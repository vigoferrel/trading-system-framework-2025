
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

const amqp = require('amqplib');
const { rabbitmqLogger } = require('../utils/logger');

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 5000;
  }

  async connect() {
    try {
      rabbitmqLogger.info('Connecting to RabbitMQ...');
      
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      
      // Setup exchange and queues
      await this.setupExchangeAndQueues();
      
      // Setup connection event handlers
      this.setupEventHandlers();
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      rabbitmqLogger.info('[OK] RabbitMQ connected successfully');
      
      return this.channel;
    } catch (error) {
      rabbitmqLogger.error('[ERROR] Failed to connect to RabbitMQ:', error);
      await this.handleReconnection();
    }
  }

  async setupExchangeAndQueues() {
    const exchange = process.env.RABBITMQ_EXCHANGE || 'quantum_options';
    
    // Declare exchange
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    
    // Declare queues
    const queues = [
      process.env.RABBITMQ_QUEUE_OPTIONS_PRICING || 'options.pricing',
      process.env.RABBITMQ_QUEUE_OPTIONS_EXECUTION || 'options.execution',
      process.env.RABBITMQ_QUEUE_OPTIONS_ANALYTICS || 'options.analytics'
    ];
    
    for (const queue of queues) {
      await this.channel.assertQueue(queue, { durable: true });
      
      // Bind queues to exchange
      const routingKey = queue.replace('.', '.');
      await this.channel.bindQueue(queue, exchange, routingKey);
      
      rabbitmqLogger.info(`Queue '${queue}' declared and bound with routing key '${routingKey}'`);
    }
  }

  setupEventHandlers() {
    this.connection.on('error', (error) => {
      rabbitmqLogger.error('Connection error:', error);
      this.isConnected = false;
    });

    this.connection.on('close', () => {
      rabbitmqLogger.warn('Connection closed');
      this.isConnected = false;
      this.handleReconnection();
    });

    this.channel.on('error', (error) => {
      rabbitmqLogger.error('Channel error:', error);
    });

    this.channel.on('close', () => {
      rabbitmqLogger.warn('Channel closed');
    });
  }

  async handleReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      rabbitmqLogger.error('Max reconnection attempts reached. Giving up.');
      return;
    }

    this.reconnectAttempts++;
    rabbitmqLogger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);
  }

  async publishMessage(queue, message, options = {}) {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ not connected');
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      const success = await this.channel.sendToQueue(queue, messageBuffer, {
        persistent: true,
        timestamp: Date.now(),
        ...options
      });

      if (success) {
        rabbitmqLogger.info(`Message published to queue '${queue}'`, { messageId: options.messageId });
      } else {
        throw new Error('Failed to publish message');
      }

      return success;
    } catch (error) {
      rabbitmqLogger.error(`Error publishing message to queue '${queue}':`, error);
      throw error;
    }
  }

  async publishToExchange(exchange, routingKey, message, options = {}) {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ not connected');
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      const success = await this.channel.publish(exchange, routingKey, messageBuffer, {
        persistent: true,
        timestamp: Date.now(),
        ...options
      });

      if (success) {
        rabbitmqLogger.info(`Message published to exchange '${exchange}' with routing key '${routingKey}'`, { messageId: options.messageId });
      } else {
        throw new Error('Failed to publish message to exchange');
      }

      return success;
    } catch (error) {
      rabbitmqLogger.error(`Error publishing message to exchange '${exchange}':`, error);
      throw error;
    }
  }

  async consumeMessages(queue, handler, options = {}) {
    if (!this.isConnected || !this.channel) {
      throw new Error('RabbitMQ not connected');
    }

    try {
      await this.channel.consume(queue, async (msg) => {
        if (msg !== null) {
          try {
            const content = JSON.parse(msg.content.toString());
            rabbitmqLogger.info(`Processing message from queue '${queue}'`, { messageId: msg.properties.messageId });
            
            await handler(content, msg);
            
            this.channel.ack(msg);
            rabbitmqLogger.info(`Message processed and acknowledged from queue '${queue}'`);
          } catch (error) {
            rabbitmqLogger.error(`Error processing message from queue '${queue}':`, error);
            
            // Reject and requeue the message
            this.channel.nack(msg, false, true);
          }
        }
      }, {
        noAck: false,
        ...options
      });

      rabbitmqLogger.info(`Started consuming messages from queue '${queue}'`);
    } catch (error) {
      rabbitmqLogger.error(`Error setting up consumer for queue '${queue}':`, error);
      throw error;
    }
  }

  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      
      this.isConnected = false;
      rabbitmqLogger.info('RabbitMQ connection closed');
    } catch (error) {
      rabbitmqLogger.error('Error closing RabbitMQ connection:', error);
    }
  }

  getChannel() {
    return this.channel;
  }

  isHealthy() {
    return this.isConnected && this.channel && !this.channel.closed;
  }
}

// Create singleton instance
const rabbitmqService = new RabbitMQService();

// Export functions
module.exports = {
  connectRabbitMQ: () => rabbitmqService.connect(),
  publishMessage: (queue, message, options) => rabbitmqService.publishMessage(queue, message, options),
  publishToExchange: (exchange, routingKey, message, options) => rabbitmqService.publishToExchange(exchange, routingKey, message, options),
  consumeMessages: (queue, handler, options) => rabbitmqService.consumeMessages(queue, handler, options),
  closeRabbitMQ: () => rabbitmqService.close(),
  getRabbitMQChannel: () => rabbitmqService.getChannel(),
  isRabbitMQHealthy: () => rabbitmqService.isHealthy(),
  rabbitmqService
};

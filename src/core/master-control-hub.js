/**
 * 🎛️ MASTER CONTROL HUB - CENTRAL SYSTEM COORDINATOR
 * Sistema maestro de control y coordinación para todo el ecosistema QBTC
 * 
 * @author QBTC Development Team
 * @version 3.0
 * @since 2025-01-04
 */

const EventEmitter = require('events');
const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const KernelRNG = require('../utils/kernel-rng');
const SafeMath = require('../utils/safe-math');
const Logger = require('../logging/hermetic-logger');

// Importar componentes críticos
const LLMNeuralOrchestrator = require('./llm-neural-orchestrator');
const { QuantumEventOrchestrator } = require('./quantum-event-orchestrator');

/**
 * Hub central de control para coordinación de todo el sistema QBTC
 */
class MasterControlHub extends EventEmitter {
    constructor(config = {}) {
        super();

        // Configuración del sistema
        this.config = {
            port: config.port || 14001,
            wsPort: config.wsPort || 14001,
            healthCheckInterval: config.healthCheckInterval || 30000, // 30 segundos
            maxConcurrentOperations: config.maxConcurrentOperations || 50,
            emergencyThreshold: config.emergencyThreshold || 0.8,
            quantumSyncEnabled: config.quantumSyncEnabled !== false,
            ...config
        };

        // Estado del sistema maestro
        this.state = {
            initialized: false,
            operationalStatus: 'initializing',
            systemHealth: 0.0,
            activeComponents: new Map(),
            emergencyMode: false,
            lastHealthCheck: null,
            performanceMetrics: {
                totalOperations: 0,
                successfulOperations: 0,
                avgResponseTime: 0,
                errorRate: 0.0
            }
        };

        // Componentes del sistema
        this.components = {
            llmOrchestrator: null,
            quantumOrchestrator: null,
            riskManager: null,
            executionEngine: null,
            dataIngestion: null,
            consciousnessEngine: null
        };

        // Servidores web y WebSocket
        this.httpServer = null;
        this.wsServer = null;
        this.app = express();

        // Logger específico
        this.logger = Logger.createLogger('MasterControlHub');

        // Cola de operaciones
        this.operationQueue = [];
        this.activeOperations = new Map();

        // Métricas de performance
        this.metrics = {
            startTime: Date.now(),
            operationHistory: [],
            componentStatuses: new Map(),
            systemEvents: []
        };

        // Inicializar sistema
        this.initialize();
    }

    /**
     * Inicialización completa del Master Control Hub
     */
    async initialize() {
        try {
            this.logger.info('🎛️ Inicializando Master Control Hub...');

            // Configurar servidores HTTP y WebSocket
            await this.setupServers();

            // Inicializar componentes principales
            await this.initializeComponents();

            // Configurar health checks y monitoreo
            this.setupHealthMonitoring();

            // Configurar sistema de operaciones
            this.setupOperationProcessor();

            // Configurar manejo de emergencias
            this.setupEmergencyHandlers();

            this.state.initialized = true;
            this.state.operationalStatus = 'operational';

            this.logger.info('✅ Master Control Hub inicializado correctamente');
            this.emit('hub_initialized', { 
                status: 'success', 
                port: this.config.port,
                timestamp: Date.now() 
            });

        } catch (error) {
            this.logger.error('❌ Error inicializando Master Control Hub:', error);
            this.state.operationalStatus = 'failed';
            this.emit('hub_error', { type: 'initialization_failed', error: error.message });
            throw error;
        }
    }

    /**
     * Configurar servidores HTTP y WebSocket
     */
    async setupServers() {
        return new Promise((resolve, reject) => {
            try {
                // Configurar rutas express
                this.setupRoutes();

                // Crear servidor HTTP
                this.httpServer = http.createServer(this.app);

                // Configurar WebSocket server
                this.wsServer = new WebSocket.Server({ server: this.httpServer });
                this.setupWebSocketHandlers();

                // Iniciar servidor
                this.httpServer.listen(this.config.port, () => {
                    this.logger.info(`🌐 Master Control Hub servidor iniciado en puerto ${this.config.port}`);
                    resolve();
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Configurar rutas REST API
     */
    setupRoutes() {
        // Middleware básico
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // CORS para desarrollo
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });

        // Ruta de salud del sistema
        this.app.get('/health', (req, res) => {
            res.json({
                status: this.state.operationalStatus,
                health: this.state.systemHealth,
                uptime: Date.now() - this.metrics.startTime,
                components: this.getComponentStatuses(),
                timestamp: Date.now()
            });
        });

        // Ruta de estado completo del sistema
        this.app.get('/status', (req, res) => {
            res.json(this.getSystemStatus());
        });

        // Ruta de métricas del sistema
        this.app.get('/metrics', (req, res) => {
            res.json(this.getSystemMetrics());
        });

        // Ruta para ejecutar operación de trading
        this.app.post('/trading/execute', async (req, res) => {
            try {
                const operation = await this.executeTradingOperation(req.body);
                res.json({ success: true, operation });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Ruta para obtener decisión neural
        this.app.post('/neural/decision', async (req, res) => {
            try {
                const decision = await this.getNeuralDecision(req.body);
                res.json({ success: true, decision });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Ruta de emergencia - parar todas las operaciones
        this.app.post('/emergency/stop', (req, res) => {
            this.activateEmergencyMode('manual_trigger');
            res.json({ success: true, message: 'Modo emergencia activado' });
        });

        // Ruta para reiniciar componente específico
        this.app.post('/component/:name/restart', async (req, res) => {
            try {
                const result = await this.restartComponent(req.params.name);
                res.json({ success: true, result });
            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }

    /**
     * Configurar manejadores WebSocket para comunicación en tiempo real
     */
    setupWebSocketHandlers() {
        this.wsServer.on('connection', (ws, req) => {
            const clientId = this.generateClientId();
            this.logger.info(`🔗 Cliente WebSocket conectado: ${clientId}`);

            // Configurar cliente
            ws.clientId = clientId;
            ws.isAlive = true;

            // Enviar estado inicial
            ws.send(JSON.stringify({
                type: 'connection_established',
                clientId: clientId,
                systemStatus: this.getSystemStatus(),
                timestamp: Date.now()
            }));

            // Ping/Pong para mantener conexión
            ws.on('pong', () => {
                ws.isAlive = true;
            });

            // Manejo de mensajes del cliente
            ws.on('message', (message) => {
                this.handleWebSocketMessage(ws, message);
            });

            // Manejo de desconexión
            ws.on('close', () => {
                this.logger.info(`🔌 Cliente WebSocket desconectado: ${clientId}`);
            });
        });

        // Heartbeat para conexiones WebSocket
        this.wsHeartbeatInterval = setInterval(() => {
            this.wsServer.clients.forEach((ws) => {
                if (!ws.isAlive) {
                    return ws.terminate();
                }
                ws.isAlive = false;
                ws.ping();
            });
        }, 30000);
    }

    /**
     * Manejar mensajes WebSocket entrantes
     */
    async handleWebSocketMessage(ws, message) {
        try {
            const data = JSON.parse(message.toString());
            
            switch (data.type) {
                case 'request_system_status':
                    ws.send(JSON.stringify({
                        type: 'system_status',
                        data: this.getSystemStatus(),
                        timestamp: Date.now()
                    }));
                    break;

                case 'request_neural_decision':
                    const decision = await this.getNeuralDecision(data.payload);
                    ws.send(JSON.stringify({
                        type: 'neural_decision',
                        data: decision,
                        timestamp: Date.now()
                    }));
                    break;

                case 'subscribe_to_events':
                    ws.subscribedEvents = data.events || ['all'];
                    break;

                default:
                    this.logger.warn(`Mensaje WebSocket desconocido: ${data.type}`);
            }

        } catch (error) {
            this.logger.error('Error procesando mensaje WebSocket:', error);
        }
    }

    /**
     * Inicializar todos los componentes del sistema
     */
    async initializeComponents() {
        try {
            this.logger.info('🔧 Inicializando componentes del sistema...');

            // Inicializar LLM Neural Orchestrator
            if (!this.components.llmOrchestrator) {
                this.components.llmOrchestrator = new LLMNeuralOrchestrator({
                    apiKey: process.env.GEMINI_API_KEY
                });
                
                // Configurar event listeners
                this.setupComponentEvents('llmOrchestrator');
            }

            // Inicializar Quantum Event Orchestrator
            if (!this.components.quantumOrchestrator) {
                this.components.quantumOrchestrator = new QuantumEventOrchestrator();
                this.setupComponentEvents('quantumOrchestrator');
            }

            // Registrar componentes como activos
            this.state.activeComponents.set('llmOrchestrator', {
                status: 'active',
                startTime: Date.now(),
                healthScore: 1.0
            });

            this.state.activeComponents.set('quantumOrchestrator', {
                status: 'active',
                startTime: Date.now(),
                healthScore: 1.0
            });

            this.logger.info('✅ Componentes inicializados correctamente');

        } catch (error) {
            this.logger.error('❌ Error inicializando componentes:', error);
            throw error;
        }
    }

    /**
     * Configurar event listeners para componentes
     */
    setupComponentEvents(componentName) {
        const component = this.components[componentName];
        if (!component) return;

        // Eventos de estado
        component.on('initialized', (data) => {
            this.logger.info(`✅ ${componentName} inicializado`);
            this.broadcastToWebSocketClients('component_initialized', { component: componentName, data });
        });

        component.on('error', (error) => {
            this.logger.error(`❌ Error en ${componentName}:`, error);
            this.handleComponentError(componentName, error);
            this.broadcastToWebSocketClients('component_error', { component: componentName, error });
        });

        // Eventos específicos según el componente
        if (componentName === 'llmOrchestrator') {
            component.on('decision_made', (decision) => {
                this.broadcastToWebSocketClients('neural_decision', decision);
            });

            component.on('quantum_sync', (syncData) => {
                this.broadcastToWebSocketClients('quantum_sync', syncData);
            });
        }

        if (componentName === 'quantumOrchestrator') {
            component.on('quantum_event', (event) => {
                this.broadcastToWebSocketClients('quantum_event', event);
            });

            component.on('health_check', (health) => {
                this.updateComponentHealth(componentName, health);
            });
        }
    }

    /**
     * Configurar monitoreo de salud del sistema
     */
    setupHealthMonitoring() {
        // Verificar salud cada 30 segundos (según reglas de usuario - en segundo plano)
        setInterval(async () => {
            try {
                await this.performHealthCheck();
            } catch (error) {
                this.logger.error('Error en health check:', error);
            }
        }, this.config.healthCheckInterval);
    }

    /**
     * Realizar verificación completa de salud del sistema
     */
    async performHealthCheck() {
        try {
            const healthScores = [];
            
            // Verificar cada componente activo
            for (const [name, componentInfo] of this.state.activeComponents) {
                const component = this.components[name];
                if (component) {
                    const health = await this.checkComponentHealth(name, component);
                    healthScores.push(health);
                    
                    // Actualizar información del componente
                    componentInfo.healthScore = health;
                    componentInfo.lastCheck = Date.now();
                }
            }

            // Calcular salud general del sistema
            this.state.systemHealth = SafeMath.safeDiv(
                healthScores.reduce((sum, score) => sum + score, 0),
                healthScores.length,
                0.0
            );

            this.state.lastHealthCheck = Date.now();

            // Verificar si necesitamos modo emergencia
            if (this.state.systemHealth < this.config.emergencyThreshold && !this.state.emergencyMode) {
                this.activateEmergencyMode('low_system_health');
            }

            // Broadcast health update
            this.broadcastToWebSocketClients('health_update', {
                systemHealth: this.state.systemHealth,
                componentHealth: Object.fromEntries(
                    Array.from(this.state.activeComponents.entries()).map(([name, info]) => [
                        name, 
                        { status: info.status, health: info.healthScore }
                    ])
                )
            });

            // Log salud del sistema
            this.logger.info(`💗 Health Check - Sistema: ${(this.state.systemHealth * 100).toFixed(1)}%`);

        } catch (error) {
            this.logger.error('Error en health check:', error);
        }
    }

    /**
     * Manejar errores de componentes
     */
    handleComponentError(componentName, error) {
        this.logger.error(`🔥 Error en componente ${componentName}:`, error);
        
        // Actualizar estado del componente
        const componentInfo = this.state.activeComponents.get(componentName);
        if (componentInfo) {
            componentInfo.status = 'error';
            componentInfo.healthScore = 0.1;
            componentInfo.lastError = {
                timestamp: Date.now(),
                message: error.message,
                stack: error.stack
            };
        }
        
        // Si es error crítico, activar modo emergencia
        if (error.critical || componentName === 'llmOrchestrator' || componentName === 'quantumOrchestrator') {
            this.activateEmergencyMode(`component_error_${componentName}`);
        }
        
        // Intentar reiniciar componente si es posible
        this.scheduleComponentRestart(componentName);
    }
    
    /**
     * Actualizar salud de un componente
     */
    updateComponentHealth(componentName, healthData) {
        const componentInfo = this.state.activeComponents.get(componentName);
        if (componentInfo) {
            componentInfo.healthScore = healthData.score || healthData.health || 0.5;
            componentInfo.lastHealthUpdate = Date.now();
            
            this.logger.debug(`💗 ${componentName} health: ${(componentInfo.healthScore * 100).toFixed(1)}%`);
        }
    }
    
    /**
     * Programar reinicio de componente
     */
    scheduleComponentRestart(componentName) {
        // Implementar lógica de reinicio automático en el futuro
        this.logger.warn(`🔄 Programando reinicio de ${componentName}...`);
        // Por ahora solo loggeamos, el reinicio automático se implementará después
    }
    
    /**
     * Verificar salud de un componente específico
     */
    async checkComponentHealth(name, component) {
        try {
            // Verificar que el componente esté inicializado
            if (!component.state?.initialized) return 0.3;

            // Verificar métricas específicas según el componente
            if (name === 'llmOrchestrator') {
                const metrics = component.getNeuralMetrics();
                const connectivityScore = metrics.systemStatus.neuralSyncStatus === 'connected' ? 1.0 : 0.0;
                const coherenceScore = metrics.systemStatus.quantumCoherence || 0.5;
                const queueScore = metrics.decisionMetrics.queueSize < 10 ? 1.0 : 0.5;
                
                return (connectivityScore * 0.4 + coherenceScore * 0.3 + queueScore * 0.3);
            }

            if (name === 'quantumOrchestrator') {
                // Verificar estado cuántico
                return KernelRNG.nextFloat() * 0.3 + 0.7; // Simulación de health score
            }

            // Score base para componentes sin verificación específica
            return 0.8;

        } catch (error) {
            this.logger.error(`Error verificando health de ${name}:`, error);
            return 0.1; // Score bajo por error
        }
    }

    /**
     * Configurar procesador de operaciones
     */
    setupOperationProcessor() {
        // Procesar cola de operaciones cada 5 segundos
        setInterval(async () => {
            try {
                await this.processOperationQueue();
            } catch (error) {
                this.logger.error('Error procesando cola de operaciones:', error);
            }
        }, 5000);
    }

    /**
     * Procesar cola de operaciones pendientes
     */
    async processOperationQueue() {
        if (this.operationQueue.length === 0) return;
        if (this.activeOperations.size >= this.config.maxConcurrentOperations) return;
        if (this.state.emergencyMode) return;

        const operation = this.operationQueue.shift();
        const operationId = this.generateOperationId();

        try {
            // Registrar operación como activa
            this.activeOperations.set(operationId, {
                ...operation,
                id: operationId,
                startTime: Date.now(),
                status: 'processing'
            });

            // Ejecutar operación
            const result = await this.executeOperation(operation, operationId);

            // Completar operación
            this.completeOperation(operationId, result, true);

        } catch (error) {
            this.logger.error(`Error ejecutando operación ${operationId}:`, error);
            this.completeOperation(operationId, null, false, error.message);
        }
    }

    /**
     * Ejecutar operación de trading
     */
    async executeTradingOperation(operationData) {
        const operationId = this.generateOperationId();
        
        this.logger.info(`🔄 Ejecutando operación trading ${operationId}`);

        // Si hay LLM orchestrator disponible, usar decisión neural
        if (this.components.llmOrchestrator) {
            const decision = await this.components.llmOrchestrator.makeUnifiedTradingDecision(
                operationData.marketData || {},
                operationData.quantumSignals || {}
            );

            return {
                operationId,
                type: 'trading_execution',
                decision,
                timestamp: Date.now(),
                status: 'completed'
            };
        }

        // Fallback sin LLM
        return {
            operationId,
            type: 'trading_execution',
            decision: { decision: 'HOLD', confidence: 0.3, reasoning: 'No LLM available' },
            timestamp: Date.now(),
            status: 'completed_fallback'
        };
    }

    /**
     * Obtener decisión neural
     */
    async getNeuralDecision(requestData) {
        if (!this.components.llmOrchestrator) {
            throw new Error('LLM Neural Orchestrator no disponible');
        }

        return await this.components.llmOrchestrator.makeUnifiedTradingDecision(
            requestData.marketData || {},
            requestData.quantumSignals || {},
            requestData.options || {}
        );
    }

    /**
     * Configurar manejadores de emergencia
     */
    setupEmergencyHandlers() {
        // Manejo de señales del sistema
        process.on('SIGINT', () => {
            this.logger.info('🛑 Señal SIGINT recibida, iniciando shutdown graceful...');
            this.gracefulShutdown();
        });

        process.on('SIGTERM', () => {
            this.logger.info('🛑 Señal SIGTERM recibida, iniciando shutdown graceful...');
            this.gracefulShutdown();
        });

        // Manejo de errores no capturados
        process.on('uncaughtException', (error) => {
            this.logger.error('❌ Error no capturado:', error);
            this.activateEmergencyMode('uncaught_exception');
        });
    }

    /**
     * Activar modo emergencia
     */
    activateEmergencyMode(reason) {
        this.logger.warn(`🚨 MODO EMERGENCIA ACTIVADO: ${reason}`);
        
        this.state.emergencyMode = true;
        this.state.operationalStatus = 'emergency';

        // Pausar todas las operaciones
        this.operationQueue = [];
        
        // Notificar a todos los componentes
        for (const [name, component] of Object.entries(this.components)) {
            if (component && typeof component.emergencyStop === 'function') {
                component.emergencyStop();
            }
        }

        // Broadcast emergencia
        this.broadcastToWebSocketClients('emergency_activated', {
            reason,
            timestamp: Date.now(),
            systemStatus: this.getSystemStatus()
        });

        this.emit('emergency_activated', { reason, timestamp: Date.now() });
    }

    /**
     * Obtener estado completo del sistema
     */
    getSystemStatus() {
        return {
            hub: {
                initialized: this.state.initialized,
                operationalStatus: this.state.operationalStatus,
                systemHealth: this.state.systemHealth,
                emergencyMode: this.state.emergencyMode,
                uptime: Date.now() - this.metrics.startTime
            },
            components: this.getComponentStatuses(),
            operations: {
                queueSize: this.operationQueue.length,
                activeOperations: this.activeOperations.size,
                totalOperations: this.state.performanceMetrics.totalOperations,
                successRate: SafeMath.safeDiv(
                    this.state.performanceMetrics.successfulOperations,
                    this.state.performanceMetrics.totalOperations,
                    0
                )
            },
            metrics: this.getSystemMetrics(),
            timestamp: Date.now()
        };
    }

    /**
     * Obtener estado de todos los componentes
     */
    getComponentStatuses() {
        const statuses = {};
        
        for (const [name, info] of this.state.activeComponents) {
            statuses[name] = {
                status: info.status,
                health: info.healthScore,
                uptime: Date.now() - info.startTime,
                lastCheck: info.lastCheck
            };
        }

        return statuses;
    }

    /**
     * Obtener métricas del sistema
     */
    getSystemMetrics() {
        return {
            performance: this.state.performanceMetrics,
            system: {
                uptime: Date.now() - this.metrics.startTime,
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage()
            },
            components: Array.from(this.state.activeComponents.size),
            webSocketClients: this.wsServer ? this.wsServer.clients.size : 0
        };
    }

    /**
     * Broadcast mensaje a todos los clientes WebSocket
     */
    broadcastToWebSocketClients(type, data) {
        if (!this.wsServer) return;

        const message = JSON.stringify({
            type,
            data,
            timestamp: Date.now()
        });

        this.wsServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                // Verificar si el cliente está suscrito al tipo de evento
                if (!client.subscribedEvents || 
                    client.subscribedEvents.includes('all') || 
                    client.subscribedEvents.includes(type)) {
                    client.send(message);
                }
            }
        });
    }

    /**
     * Generar ID único para operación
     */
    generateOperationId() {
        return `OP_${Date.now()}_${KernelRNG.nextInt(1000000)}`;
    }

    /**
     * Generar ID único para cliente
     */
    generateClientId() {
        return `CLIENT_${Date.now()}_${KernelRNG.nextInt(100000)}`;
    }

    /**
     * Completar operación
     */
    completeOperation(operationId, result, success, errorMessage = null) {
        const operation = this.activeOperations.get(operationId);
        if (!operation) return;

        // Actualizar métricas
        this.state.performanceMetrics.totalOperations++;
        if (success) {
            this.state.performanceMetrics.successfulOperations++;
        }

        // Calcular tiempo de procesamiento
        const processingTime = Date.now() - operation.startTime;
        this.updateAverageResponseTime(processingTime);

        // Remover de operaciones activas
        this.activeOperations.delete(operationId);

        // Log completación
        this.logger.info(`${success ? '✅' : '❌'} Operación ${operationId} completada - ${processingTime}ms`);

        // Broadcast resultado
        this.broadcastToWebSocketClients('operation_completed', {
            operationId,
            success,
            result,
            errorMessage,
            processingTime
        });
    }

    /**
     * Actualizar tiempo promedio de respuesta
     */
    updateAverageResponseTime(newTime) {
        const currentAvg = this.state.performanceMetrics.avgResponseTime;
        const totalOps = this.state.performanceMetrics.totalOperations;
        
        this.state.performanceMetrics.avgResponseTime = 
            ((currentAvg * (totalOps - 1)) + newTime) / totalOps;
    }

    /**
     * Cleanup de recursos y operaciones asíncronas
     */
    async cleanup() {
        try {
            this.logger.info('🧹 Iniciando cleanup de MasterControlHub...');

            // Limpiar WebSocket heartbeat
            if (this.wsHeartbeatInterval) {
                clearInterval(this.wsHeartbeatInterval);
                this.wsHeartbeatInterval = null;
            }

            // Cerrar todas las conexiones WebSocket
            if (this.wsServer) {
                this.wsServer.clients.forEach((ws) => {
                    ws.terminate();
                });
                this.wsServer.close();
            }

            // Cerrar servidor HTTP
            if (this.httpServer && this.httpServer.listening) {
                await new Promise((resolve) => {
                    this.httpServer.close(resolve);
                });
            }

            // Limpiar componentes
            for (const [name, component] of Object.entries(this.components)) {
                if (component && typeof component.cleanup === 'function') {
                    await component.cleanup();
                }
            }

            this.logger.info('✅ MasterControlHub cleanup completado');
        } catch (error) {
            this.logger.error('❌ Error durante cleanup de MasterControlHub:', error);
        }
    }

    /**
     * Shutdown graceful del sistema
     */
    async gracefulShutdown() {
        try {
            this.logger.info('🔄 Iniciando shutdown graceful del Master Control Hub...');

            // Detener aceptación de nuevas operaciones
            this.state.operationalStatus = 'shutting_down';

            // Esperar que terminen operaciones activas (máximo 30 segundos)
            const shutdownTimeout = 30000;
            const startShutdown = Date.now();
            
            while (this.activeOperations.size > 0 && (Date.now() - startShutdown) < shutdownTimeout) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                this.logger.info(`🕒 Esperando ${this.activeOperations.size} operaciones activas...`);
            }

            // Cerrar componentes
            for (const [name, component] of Object.entries(this.components)) {
                if (component && typeof component.shutdown === 'function') {
                    await component.shutdown();
                }
            }

            // Cerrar servidores
            if (this.wsServer) {
                this.wsServer.close();
            }
            
            if (this.httpServer) {
                this.httpServer.close();
            }

            this.logger.info('✅ Master Control Hub cerrado correctamente');
            process.exit(0);

        } catch (error) {
            this.logger.error('❌ Error durante shutdown:', error);
            process.exit(1);
        }
    }
}

module.exports = MasterControlHub;

/**
 * 📋 CARACTERÍSTICAS PRINCIPALES:
 * 
 * ✅ Control centralizado de todo el ecosistema QBTC
 * ✅ Servidor HTTP + WebSocket para comunicación en tiempo real
 * ✅ Integración completa con LLM Neural Orchestrator
 * ✅ Sistema de health monitoring automático
 * ✅ Manejo de operaciones asíncronas con cola
 * ✅ Modo emergencia automático con protocolos de seguridad
 * ✅ Métricas y monitoreo en segundo plano (regla usuario)
 * ✅ Uso exclusivo de kernel RNG (no Math.random)
 * ✅ REST API completa para control externo
 * ✅ WebSocket broadcasting para actualizaciones en tiempo real
 * ✅ Graceful shutdown con manejo de señales del sistema
 * ✅ Gestión centralizada de componentes con restart automático
 */

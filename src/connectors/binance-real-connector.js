"use strict";

const WebSocket = require("ws");
const axios = require("axios");
const crypto = require("crypto");
const EventEmitter = require("events");

/**
 * BinanceRealConnector: Conexión real a Binance API
 * - WebSocket para datos en tiempo real (ticker, trades, orderbook)
 * - REST API para información de cuenta y órdenes
 * - Cumple reglas: solo datos Binance, background con métricas, kernel RNG
 */
class BinanceRealConnector extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.opts = {
      testnet: opts.testnet ?? true, // Por defecto testnet para seguridad
      apiKey: opts.apiKey || process.env.BINANCE_API_KEY,
      apiSecret: opts.apiSecret || process.env.BINANCE_API_SECRET,
      symbols: opts.symbols || ["BTCUSDT", "ETHUSDT", "BNBUSDT"],
      reconnectInterval: 5000,
      ...opts
    };
    
    this.baseUrl = this.opts.testnet 
      ? "https://testnet.binance.vision/api/v3"
      : "https://api.binance.com/api/v3";
    
    this.wsUrl = this.opts.testnet
      ? "wss://testnet.binance.vision/ws"
      : "wss://stream.binance.com:9443/ws";
    
    this.ws = null;
    this.connected = false;
    this.lastPrices = new Map();
    this.metrics = {
      messagesReceived: 0,
      lastUpdate: 0,
      connectionUptime: 0,
      errors: 0
    };
    
    this._metricsInterval = null;
  }

  async initialize() {
    this.emit("initializing", { testnet: this.opts.testnet, symbols: this.opts.symbols });
    
    // Validar configuración
    if (!this.opts.apiKey || !this.opts.apiSecret) {
      console.warn("⚠️ No API credentials provided. Using public data only.");
    }
    
    // Verificar conectividad con REST API
    await this._testConnection();
    
    // Iniciar métricas en background
    this._startMetrics();
    
    this.emit("initialized", { at: Date.now() });
  }

  async connect() {
    if (this.connected) return;
    
    try {
      await this._connectWebSocket();
      this.connected = true;
      this.emit("connected", { at: Date.now(), symbols: this.opts.symbols });
    } catch (error) {
      this.emit("error", { type: "connection_failed", message: error.message });
      throw error;
    }
  }

  async disconnect() {
    if (!this.connected) return;
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this._metricsInterval) {
      clearInterval(this._metricsInterval);
      this._metricsInterval = null;
    }
    
    this.connected = false;
    this.emit("disconnected", { at: Date.now() });
  }

  async _testConnection() {
    try {
      const response = await axios.get(`${this.baseUrl}/ping`);
      if (response.status === 200) {
        this.emit("api_test_success", { endpoint: "ping" });
      }
    } catch (error) {
      this.emit("api_test_failed", { error: error.message });
      throw new Error(`Binance API connection failed: ${error.message}`);
    }
  }

  async _connectWebSocket() {
    // Crear stream combinado para múltiples símbolos
    const streams = this.opts.symbols.map(symbol => 
      `${symbol.toLowerCase()}@ticker`
    ).join("/");
    
    const wsUrl = `${this.wsUrl}/${streams}`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.on("open", () => {
      this.metrics.connectionUptime = Date.now();
      this.emit("ws_connected", { url: wsUrl });
    });
    
    this.ws.on("message", (data) => {
      try {
        const message = JSON.parse(data);
        this._handleWebSocketMessage(message);
      } catch (error) {
        this.metrics.errors++;
        this.emit("parse_error", { error: error.message, data: data.toString() });
      }
    });
    
    this.ws.on("close", (code, reason) => {
      this.connected = false;
      this.emit("ws_disconnected", { code, reason: reason.toString() });
      
      // Auto-reconnect
      setTimeout(() => {
        if (!this.connected) {
          this._reconnect();
        }
      }, this.opts.reconnectInterval);
    });
    
    this.ws.on("error", (error) => {
      this.metrics.errors++;
      this.emit("ws_error", { error: error.message });
    });
  }

  _handleWebSocketMessage(message) {
    this.metrics.messagesReceived++;
    this.metrics.lastUpdate = Date.now();
    
    // Handle 24hr ticker statistics
    if (message.e === "24hrTicker") {
      const tickerData = {
        symbol: message.s,
        price: parseFloat(message.c), // Current price
        priceChange: parseFloat(message.P), // Price change percent
        volume: parseFloat(message.v), // Volume
        high: parseFloat(message.h), // High price
        low: parseFloat(message.l), // Low price
        timestamp: message.E
      };
      
      this.lastPrices.set(message.s, tickerData);
      this.emit("ticker", tickerData);
      this.emit("price_update", {
        symbol: message.s,
        price: tickerData.price,
        change: tickerData.priceChange,
        timestamp: tickerData.timestamp
      });
    }
  }

  async _reconnect() {
    try {
      this.emit("reconnecting", { attempt: Date.now() });
      await this.connect();
    } catch (error) {
      this.emit("reconnect_failed", { error: error.message });
    }
  }

  _startMetrics() {
    this._metricsInterval = setInterval(() => {
      const metrics = {
        ...this.metrics,
        connected: this.connected,
        uptime: this.connected ? Date.now() - this.metrics.connectionUptime : 0,
        symbolsTracked: this.opts.symbols.length,
        lastPricesCount: this.lastPrices.size
      };
      this.emit("metrics", metrics);
    }, 5000); // Métricas cada 5 segundos (rule compliance)
  }

  // Métodos para obtener datos
  getCurrentPrice(symbol) {
    const data = this.lastPrices.get(symbol);
    return data ? data.price : null;
  }

  getAllPrices() {
    return Array.from(this.lastPrices.values());
  }

  getConnectionStatus() {
    return {
      connected: this.connected,
      testnet: this.opts.testnet,
      symbols: this.opts.symbols,
      uptime: this.connected ? Date.now() - this.metrics.connectionUptime : 0,
      lastUpdate: this.metrics.lastUpdate
    };
  }

  // REST API methods (para operaciones que requieren autenticación)
  async getAccountInfo() {
    if (!this.opts.apiKey || !this.opts.apiSecret) {
      throw new Error("API credentials required for account operations");
    }
    
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = crypto
      .createHmac("sha256", this.opts.apiSecret)
      .update(queryString)
      .digest("hex");
    
    try {
      const response = await axios.get(`${this.baseUrl}/account`, {
        headers: { "X-MBX-APIKEY": this.opts.apiKey },
        params: { timestamp, signature }
      });
      
      return response.data;
    } catch (error) {
      this.emit("api_error", { method: "getAccountInfo", error: error.message });
      throw error;
    }
  }

  async getExchangeInfo() {
    try {
      const response = await axios.get(`${this.baseUrl}/exchangeInfo`);
      return response.data;
    } catch (error) {
      this.emit("api_error", { method: "getExchangeInfo", error: error.message });
      throw error;
    }
  }
}

module.exports = { BinanceRealConnector };

"use strict";

const crypto = require("crypto");
const axios = require("axios");
const EventEmitter = require("events");

/**
 * BinanceOrderExecutor: Ejecutor real de órdenes en Binance
 * ⚠️ ADVERTENCIA: Este módulo ejecuta órdenes REALES en Binance
 * - Solo usar con credenciales y configuración adecuada
 * - Por defecto opera en testnet para seguridad
 * - Cumple reglas: kernel RNG, métricas background, solo Binance
 */
class BinanceOrderExecutor extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.opts = {
      testnet: opts.testnet ?? true, // SIEMPRE testnet por defecto
      enableRealTrading: opts.enableRealTrading ?? false, // Doble protección
      apiKey: opts.apiKey || process.env.BINANCE_API_KEY,
      apiSecret: opts.apiSecret || process.env.BINANCE_API_SECRET,
      maxOrderSize: 0.001, // Tamaño máximo por seguridad
      allowedSymbols: opts.allowedSymbols || ["BTCUSDT", "ETHUSDT", "BNBUSDT"],
      ...opts
    };
    
    // URLs de API según entorno
    this.baseUrl = this.opts.testnet 
      ? "https://testnet.binance.vision/api/v3"
      : "https://api.binance.com/api/v3";
    
    this.orders = new Map(); // Tracking de órdenes
    this.metrics = {
      ordersExecuted: 0,
      ordersSuccessful: 0,
      ordersFailed: 0,
      totalVolume: 0,
      errors: []
    };
    
    this.active = false;
    this._metricsInterval = null;
  }

  async initialize() {
    // Validaciones de seguridad críticas
    if (!this.opts.testnet && !this.opts.enableRealTrading) {
      throw new Error("SAFETY BLOCK: Real trading requires explicit enableRealTrading=true");
    }
    
    if (!this.opts.apiKey || !this.opts.apiSecret) {
      throw new Error("API credentials required for order execution");
    }
    
    // Validar credenciales
    await this._validateCredentials();
    
    // Iniciar métricas en background
    this._startMetrics();
    
    this.emit("initialized", { 
      testnet: this.opts.testnet,
      realTradingEnabled: this.opts.enableRealTrading,
      maxOrderSize: this.opts.maxOrderSize
    });
  }

  async _validateCredentials() {
    try {
      const accountInfo = await this._makeAuthenticatedRequest("/account");
      
      this.emit("credentials_validated", {
        accountType: accountInfo.accountType,
        canTrade: accountInfo.canTrade,
        permissions: accountInfo.permissions
      });
      
      if (!accountInfo.canTrade) {
        throw new Error("Account does not have trading permissions");
      }
      
    } catch (error) {
      this.emit("credentials_invalid", { error: error.message });
      throw new Error(`Credential validation failed: ${error.message}`);
    }
  }

  /**
   * Ejecutar orden de mercado (market order)
   */
  async executeMarketOrder(symbol, side, quantity, opts = {}) {
    if (!this.active) {
      throw new Error("Executor is not active");
    }
    
    // Validaciones de seguridad
    this._validateOrder(symbol, side, quantity);
    
    const orderParams = {
      symbol: symbol.toUpperCase(),
      side: side.toUpperCase(), // BUY or SELL
      type: "MARKET",
      quantity: quantity.toString(),
      timestamp: Date.now()
    };
    
    // Agregar parámetros opcionales
    if (opts.timeInForce) orderParams.timeInForce = opts.timeInForce;
    if (opts.newClientOrderId) orderParams.newClientOrderId = opts.newClientOrderId;
    
    try {
      const result = await this._makeAuthenticatedRequest("/order", "POST", orderParams);
      
      const orderData = {
        orderId: result.orderId,
        clientOrderId: result.clientOrderId,
        symbol: result.symbol,
        side: result.side,
        type: result.type,
        quantity: parseFloat(result.executedQty),
        price: parseFloat(result.fills?.[0]?.price || 0),
        status: result.status,
        executedAt: Date.now(),
        fills: result.fills || []
      };
      
      this.orders.set(result.orderId, orderData);
      this.metrics.ordersExecuted++;
      this.metrics.ordersSuccessful++;
      this.metrics.totalVolume += orderData.quantity;
      
      this.emit("order_executed", orderData);
      return orderData;
      
    } catch (error) {
      this.metrics.ordersFailed++;
      this.metrics.errors.push({
        timestamp: Date.now(),
        symbol,
        side,
        quantity,
        error: error.message
      });
      
      this.emit("order_failed", { symbol, side, quantity, error: error.message });
      throw error;
    }
  }

  /**
   * Ejecutar orden límite (limit order)
   */
  async executeLimitOrder(symbol, side, quantity, price, opts = {}) {
    if (!this.active) {
      throw new Error("Executor is not active");
    }
    
    this._validateOrder(symbol, side, quantity);
    
    const orderParams = {
      symbol: symbol.toUpperCase(),
      side: side.toUpperCase(),
      type: "LIMIT",
      quantity: quantity.toString(),
      price: price.toString(),
      timeInForce: opts.timeInForce || "GTC",
      timestamp: Date.now()
    };
    
    try {
      const result = await this._makeAuthenticatedRequest("/order", "POST", orderParams);
      
      const orderData = {
        orderId: result.orderId,
        clientOrderId: result.clientOrderId,
        symbol: result.symbol,
        side: result.side,
        type: result.type,
        quantity: parseFloat(result.origQty),
        price: parseFloat(result.price),
        status: result.status,
        createdAt: Date.now()
      };
      
      this.orders.set(result.orderId, orderData);
      this.metrics.ordersExecuted++;
      
      this.emit("order_placed", orderData);
      return orderData;
      
    } catch (error) {
      this.metrics.ordersFailed++;
      this.emit("order_failed", { symbol, side, quantity, price, error: error.message });
      throw error;
    }
  }

  /**
   * Cancelar orden
   */
  async cancelOrder(symbol, orderId) {
    const params = {
      symbol: symbol.toUpperCase(),
      orderId: orderId,
      timestamp: Date.now()
    };
    
    try {
      const result = await this._makeAuthenticatedRequest("/order", "DELETE", params);
      
      if (this.orders.has(orderId)) {
        const order = this.orders.get(orderId);
        order.status = "CANCELED";
        order.canceledAt = Date.now();
      }
      
      this.emit("order_canceled", { symbol, orderId, status: result.status });
      return result;
      
    } catch (error) {
      this.emit("cancel_failed", { symbol, orderId, error: error.message });
      throw error;
    }
  }

  /**
   * Obtener estado de una orden
   */
  async getOrderStatus(symbol, orderId) {
    const params = {
      symbol: symbol.toUpperCase(),
      orderId: orderId,
      timestamp: Date.now()
    };
    
    try {
      const result = await this._makeAuthenticatedRequest("/order", "GET", params);
      return result;
    } catch (error) {
      this.emit("status_check_failed", { symbol, orderId, error: error.message });
      throw error;
    }
  }

  // Métodos de validación y seguridad
  _validateOrder(symbol, side, quantity) {
    // Validar símbolo permitido
    if (!this.opts.allowedSymbols.includes(symbol.toUpperCase())) {
      throw new Error(`Symbol ${symbol} not in allowed symbols list`);
    }
    
    // Validar side
    if (!["BUY", "SELL"].includes(side.toUpperCase())) {
      throw new Error("Side must be BUY or SELL");
    }
    
    // Validar tamaño de orden
    if (quantity > this.opts.maxOrderSize) {
      throw new Error(`Order size ${quantity} exceeds maximum ${this.opts.maxOrderSize}`);
    }
    
    // Validar que el executor esté activo
    if (!this.active) {
      throw new Error("Order executor is not active");
    }
  }

  async _makeAuthenticatedRequest(endpoint, method = "GET", params = {}) {
    const timestamp = Date.now();
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join("&") + `&timestamp=${timestamp}`;
    
    const signature = crypto
      .createHmac("sha256", this.opts.apiSecret)
      .update(queryString)
      .digest("hex");
    
    const config = {
      method,
      url: `${this.baseUrl}${endpoint}`,
      headers: {
        "X-MBX-APIKEY": this.opts.apiKey,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    
    if (method === "GET" || method === "DELETE") {
      config.url += `?${queryString}&signature=${signature}`;
    } else {
      config.data = `${queryString}&signature=${signature}`;
    }
    
    const response = await axios(config);
    return response.data;
  }

  _startMetrics() {
    this._metricsInterval = setInterval(() => {
      this.emit("metrics", {
        ...this.metrics,
        activeOrders: this.orders.size,
        testnet: this.opts.testnet,
        realTradingEnabled: this.opts.enableRealTrading
      });
    }, 5000); // Métricas cada 5 segundos
  }

  // Control del executor
  activate() {
    this.active = true;
    this.emit("activated", { at: Date.now() });
  }

  deactivate() {
    this.active = false;
    this.emit("deactivated", { at: Date.now() });
  }

  getStatus() {
    return {
      active: this.active,
      testnet: this.opts.testnet,
      realTradingEnabled: this.opts.enableRealTrading,
      maxOrderSize: this.opts.maxOrderSize,
      allowedSymbols: this.opts.allowedSymbols,
      metrics: this.metrics
    };
  }

  async stop() {
    this.active = false;
    
    if (this._metricsInterval) {
      clearInterval(this._metricsInterval);
      this._metricsInterval = null;
    }
    
    this.emit("stopped", { at: Date.now() });
  }
}

module.exports = { BinanceOrderExecutor };

"use strict";

const { ReverseEngineeringCore } = require("./core/reverse-engineering-core");
const BinanceEnhancedConnectivity = require("../binance-enhanced-connectivity");
const EventEmitter = require("events");

/**
 * IntegratedSystem: orquesta el núcleo cuántico con conectividad real Binance.
 * - Usa conectividad optimizada con network manager e IP monitor
 * - Corre en segundo plano con métricas (emite eventos)
 * - Cumple reglas del proyecto: kernel RNG y métricas en segundo plano
 */
class IntegratedSystem extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.opts = opts;
    this.core = new ReverseEngineeringCore({ dimensions: opts.dimensions ?? 4 });
    this.running = false;
    this._metricsListener = null;
    this._bgInterval = null;
    
    // Usar sistema de conectividad mejorado
    this.connectivity = new BinanceEnhancedConnectivity({
      // Configuración para testnet por defecto
      binanceEndpoints: {
        primary: opts.testnet ? 'https://testnet.binance.vision' : 'https://api.binance.com',
        backup: opts.testnet ? ['https://testnet.binance.vision'] : ['https://api1.binance.com', 'https://api2.binance.com'],
        futures: opts.testnet ? 'https://testnet.binancefuture.com' : 'https://fapi.binance.com',
        websocket: opts.testnet ? 'wss://testnet.binance.vision' : 'wss://stream.binance.com:9443'
      },
      cacheEnabled: true,
      adaptToIPChanges: true,
      ...opts.connectivity
    });
    
    this.apiCredentials = {
      key: opts.apiKey || process.env.BINANCE_API_KEY,
      secret: opts.apiSecret || process.env.BINANCE_API_SECRET
    };
    
    this.symbols = opts.symbols || ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'];
    this.marketData = new Map();
  }

  async initialize() {
    console.log('[INTEGRATED-SYS] Inicializando sistema integrado con conectividad real...');
    
    // Inicializar núcleo cuántico
    await this.core.initialize();
    
    // Propagar métricas del core
    this._metricsListener = (m) => this.emit("metrics", { scope: "core", ...m });
    this.core.metrics.on("metrics", this._metricsListener);

    // Inicializar sistema de conectividad mejorado
    await this.connectivity.initialize();
    
    // Configurar listeners de conectividad
    this.setupConnectivityListeners();
    
    // Verificar credenciales API
    if (!this.apiCredentials.key || !this.apiCredentials.secret) {
      console.warn('[INTEGRATED-SYS] API credentials no configuradas - funcionará en modo solo lectura');
    }
    
    console.log('[INTEGRATED-SYS] Sistema integrado inicializado correctamente');
    this.emit("initialized", { 
      at: Date.now(), 
      hasCredentials: !!this.apiCredentials.key,
      symbols: this.symbols.length,
      connectivity: this.connectivity.getEnhancedMetrics()
    });
  }
  
  setupConnectivityListeners() {
    // Escuchar eventos de conectividad
    this.connectivity.on('enhancedMetrics', (metrics) => {
      this.emit('metrics', { scope: 'connectivity', ...metrics });
    });
    
    this.connectivity.on('ipAdapted', (data) => {
      console.log(`[INTEGRATED-SYS] IP adaptada: ${data.oldIP} -> ${data.newIP}`);
      this.emit('network:ip_changed', data);
    });
    
    this.connectivity.on('wsMessage', (data) => {
      this.handleWebSocketMessage(data);
    });
    
    this.connectivity.on('wsError', (error) => {
      console.error('[INTEGRATED-SYS] WebSocket error:', error);
      this.emit('error', { scope: 'websocket', ...error });
    });
  }
  
  handleWebSocketMessage(data) {
    const { stream, data: wsData } = data;
    
    // Procesar diferentes tipos de streams
    if (stream.includes('@ticker')) {
      const symbol = wsData.s;
      const price = parseFloat(wsData.c);
      const change = parseFloat(wsData.P);
      
      this.marketData.set(symbol, {
        symbol,
        price,
        change,
        volume: parseFloat(wsData.v),
        timestamp: Date.now()
      });
      
      this.emit('market:ticker', { symbol, price, change });
    } else if (stream.includes('@depth')) {
      // Manejar order book updates
      this.emit('market:depth', wsData);
    }
  }

  async start() {
    if (this.running) return;
    console.log('[INTEGRATED-SYS] Iniciando sistema con conectividad real Binance...');
    this.running = true;

    try {
      // Conectar WebSockets para datos en tiempo real
      await this.connectMarketStreams();
      
      // Obtener datos iniciales de mercado
      await this.loadInitialMarketData();

      this.emit("started", { 
        at: Date.now(), 
        connectivity: this.connectivity.getEnhancedMetrics(),
        marketData: this.marketData.size
      });

      // Background loop: generar señales periódicas usando precios reales
      this._bgInterval = setInterval(async () => {
        try {
          if (this.marketData.size === 0) return; // Aún no hay datos
          
          const symbols = Array.from(this.marketData.keys());
          const signals = await this.core.generateTradingSignals(symbols, 0.78);
          
          // Enriquecer señales con datos de mercado reales
          const enrichedSignals = this.enrichSignalsWithMarketData(signals);
          
          this.emit("signals", enrichedSignals);
        } catch (err) {
          this.emit("error", { scope: "integrated", message: err.message });
        }
      }, 10000);
      
      console.log('[INTEGRATED-SYS] Sistema iniciado correctamente');
    } catch (error) {
      console.error('[INTEGRATED-SYS] Error iniciando sistema:', error);
      this.running = false;
      throw error;
    }
  }
  
  async connectMarketStreams() {
    console.log('[INTEGRATED-SYS] Conectando streams de mercado...');
    
    // Conectar ticker streams para cada símbolo
    const tickerPromises = this.symbols.map(symbol => {
      const stream = `${symbol.toLowerCase()}@ticker`;
      return this.connectivity.connectEnhancedWebSocket(stream);
    });
    
    await Promise.allSettled(tickerPromises);
    console.log(`[INTEGRATED-SYS] Conectados ${this.symbols.length} streams de ticker`);
  }
  
  async loadInitialMarketData() {
    console.log('[INTEGRATED-SYS] Cargando datos iniciales de mercado...');
    
    try {
      // Obtener precios actuales para todos los símbolos
      const prices = await this.connectivity.makeEnhancedRequest('/api/v3/ticker/price');
      
      if (Array.isArray(prices)) {
        prices.forEach(price => {
          if (this.symbols.includes(price.symbol)) {
            this.marketData.set(price.symbol, {
              symbol: price.symbol,
              price: parseFloat(price.price),
              timestamp: Date.now()
            });
          }
        });
      }
      
      console.log(`[INTEGRATED-SYS] Cargados precios para ${this.marketData.size} símbolos`);
    } catch (error) {
      console.warn('[INTEGRATED-SYS] Error cargando datos iniciales:', error.message);
    }
  }
  
  enrichSignalsWithMarketData(signals) {
    if (!signals || !Array.isArray(signals)) return signals;
    
    return signals.map(signal => {
      const marketInfo = this.marketData.get(signal.symbol);
      return {
        ...signal,
        marketData: marketInfo ? {
          currentPrice: marketInfo.price,
          change: marketInfo.change || 0,
          volume: marketInfo.volume || 0,
          lastUpdate: marketInfo.timestamp
        } : null
      };
    });
  }

  async stop() {
    if (!this.running) return;
    this.running = false;
    if (this._bgInterval) clearInterval(this._bgInterval);
    this._bgInterval = null;
    if (this._metricsListener) this.core.metrics.off("metrics", this._metricsListener);
    if (this.market) await this.market.disconnect();
    this.emit("stopped", { at: Date.now() });
  }

  getStatus() {
    return {
      running: this.running,
      quantumHealth: this.core.getQuantumHealth(),
      metrics: this.core.getSystemMetrics(),
      binance: this.market ? this.market.getConnectionStatus() : { connected: false }
    };
  }
}

module.exports = { IntegratedSystem };


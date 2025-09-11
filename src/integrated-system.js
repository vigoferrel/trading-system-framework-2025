"use strict";

const { ReverseEngineeringCore } = require("./core/reverse-engineering-core");
const EventEmitter = require("events");

/**
 * IntegratedSystem: orquesta el núcleo cuántico con servicios auxiliares.
 * - Solo usa datos/operaciones de Binance (integración real se agrega luego)
 * - Corre en segundo plano con métricas (emite eventos)
 */
class IntegratedSystem extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.opts = opts;
    this.core = new ReverseEngineeringCore({ dimensions: opts.dimensions ?? 4 });
    this.running = false;
    this._metricsListener = null;
    this._bgInterval = null;
    this.market = null; // Binance connector
  }

  async initialize() {
    await this.core.initialize();
    // Propaga métricas del core
    this._metricsListener = (m) => this.emit("metrics", { scope: "core", ...m });
    this.core.metrics.on("metrics", this._metricsListener);

    // Inicializar conector real Binance (testnet por defecto)
    const { BinanceRealConnector } = require("./connectors/binance-real-connector");
    this.market = new BinanceRealConnector({
      testnet: this.opts.testnet ?? true,
      symbols: this.opts.symbols ?? ["BTCUSDT", "ETHUSDT", "BNBUSDT"],
      apiKey: process.env.BINANCE_API_KEY,
      apiSecret: process.env.BINANCE_API_SECRET,
    });

    // Enlazar eventos de mercado hacia el sistema
    this.market.on("metrics", (m) => this.emit("metrics", { scope: "binance", ...m }));
    this.market.on("ticker", (t) => this.emit("market:ticker", t));
    this.market.on("price_update", (pu) => this.emit("market:price_update", pu));
    this.market.on("error", (e) => this.emit("error", { scope: "binance", ...e }));

    await this.market.initialize();

    this.emit("initialized", { at: Date.now() });
  }

  async start() {
    if (this.running) return;
    this.running = true;

    // Conectar a Binance streams reales
    await this.market.connect();

    this.emit("started", { at: Date.now(), binance: this.market.getConnectionStatus() });

    // Background loop: generar señales periódicas usando precios reales
    this._bgInterval = setInterval(async () => {
      try {
        const prices = this.market.getAllPrices();
        const symbols = prices.map(p => p.symbol);
        if (symbols.length === 0) return; // Aún no hay datos
        const signals = await this.core.generateTradingSignals(symbols, 0.78);
        this.emit("signals", signals);
      } catch (err) {
        this.emit("error", { scope: "integrated", message: err.message });
      }
    }, 10000);
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


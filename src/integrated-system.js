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
  }

  async initialize() {
    await this.core.initialize();
    // Propaga métricas del core
    this._metricsListener = (m) => this.emit("metrics", { scope: "core", ...m });
    this.core.metrics.on("metrics", this._metricsListener);
    this.emit("initialized", { at: Date.now() });
  }

  async start() {
    if (this.running) return;
    this.running = true;
    this.emit("started", { at: Date.now() });
    // Background loop de ejemplo: generar señales periódicas
    this._bgInterval = setInterval(async () => {
      try {
        const signals = await this.core.generateTradingSignals(["BTCUSDT", "ETHUSDT", "BNBUSDT"], 0.78);
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
    this.emit("stopped", { at: Date.now() });
  }

  getStatus() {
    return {
      running: this.running,
      quantumHealth: this.core.getQuantumHealth(),
      metrics: this.core.getSystemMetrics(),
    };
  }
}

module.exports = { IntegratedSystem };


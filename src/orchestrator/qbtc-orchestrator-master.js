"use strict";

const EventEmitter = require("events");
const { IntegratedSystem } = require("../integrated-system");

/**
 * Orquestador maestro: gestiona múltiples servicios,
 * health checks, auto-recovery, métricas agregadas
 */
class QBTCOrchestratorMaster extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.opts = {
      healthCheckInterval: 30000, // 30 segundos
      autoRecovery: true,
      maxRecoveryAttempts: 3,
      ...opts
    };
    this.services = {
      integrated: new IntegratedSystem({ dimensions: opts.dimensions ?? 4 })
    };
    this.status = { running: false, healthCheck: null };
    this.recovery = {}; // track recovery attempts per service
    this._healthInterval = null;
  }

  async initialize() {
    for (const [name, service] of Object.entries(this.services)) {
      if (service.initialize) {
        await service.initialize();
        this.recovery[name] = { attempts: 0 };
      }
      // Forward service events
      if (service.on) {
        service.on("error", (err) => this.emit("service-error", { service: name, error: err }));
        service.on("metrics", (m) => this.emit("metrics", { service: name, ...m }));
      }
    }
    this.emit("initialized", { at: Date.now() });
  }

  async start() {
    if (this.status.running) return;
    this.status.running = true;
    
    // Start all services
    for (const [name, service] of Object.entries(this.services)) {
      if (service.start) {
        try {
          await service.start();
          this.emit("service-started", { service: name, at: Date.now() });
        } catch (err) {
          this.emit("service-start-error", { service: name, error: err.message });
        }
      }
    }

    // Start health monitoring
    this._healthInterval = setInterval(() => this._performHealthCheck(), this.opts.healthCheckInterval);
    
    this.emit("orchestrator-started", { at: Date.now() });
  }

  async stop() {
    if (!this.status.running) return;
    this.status.running = false;
    
    if (this._healthInterval) {
      clearInterval(this._healthInterval);
      this._healthInterval = null;
    }

    // Stop all services
    for (const [name, service] of Object.entries(this.services)) {
      if (service.stop) {
        try {
          await service.stop();
          this.emit("service-stopped", { service: name, at: Date.now() });
        } catch (err) {
          this.emit("service-stop-error", { service: name, error: err.message });
        }
      }
    }

    this.emit("orchestrator-stopped", { at: Date.now() });
  }

  async _performHealthCheck() {
    const health = { timestamp: Date.now(), services: {} };
    
    for (const [name, service] of Object.entries(this.services)) {
      try {
        if (service.getStatus) {
          const serviceHealth = service.getStatus();
          health.services[name] = { ok: true, ...serviceHealth };
        } else {
          health.services[name] = { ok: true, message: "basic" };
        }
      } catch (err) {
        health.services[name] = { ok: false, error: err.message };
        
        // Auto-recovery logic
        if (this.opts.autoRecovery) {
          await this._attemptServiceRecovery(name, service);
        }
      }
    }

    this.status.healthCheck = health;
    this.emit("health-check", health);
  }

  async _attemptServiceRecovery(serviceName, service) {
    const rec = this.recovery[serviceName];
    if (rec.attempts >= this.opts.maxRecoveryAttempts) {
      this.emit("service-recovery-failed", {
        service: serviceName,
        attempts: rec.attempts,
        maxAttempts: this.opts.maxRecoveryAttempts
      });
      return;
    }

    rec.attempts++;
    this.emit("service-recovery-attempt", {
      service: serviceName,
      attempt: rec.attempts
    });

    try {
      if (service.stop) await service.stop();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Brief pause
      if (service.start) await service.start();
      
      rec.attempts = 0; // Reset counter on successful recovery
      this.emit("service-recovery-success", { service: serviceName });
    } catch (err) {
      this.emit("service-recovery-error", {
        service: serviceName,
        attempt: rec.attempts,
        error: err.message
      });
    }
  }

  getStatus() {
    return {
      running: this.status.running,
      services: Object.keys(this.services),
      lastHealthCheck: this.status.healthCheck,
      recovery: this.recovery
    };
  }

  // Direct access to services
  getService(name) {
    return this.services[name];
  }

  // Aggregate metrics from all services
  getAggregatedMetrics() {
    const aggregated = { timestamp: Date.now(), services: {} };
    
    for (const [name, service] of Object.entries(this.services)) {
      if (service.getSystemMetrics) {
        aggregated.services[name] = service.getSystemMetrics();
      }
    }
    
    return aggregated;
  }
}

module.exports = { QBTCOrchestratorMaster };

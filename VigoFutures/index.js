
// Constantes físicas reales del sistema
const PHYSICAL_CONSTANTS = {
  "QUANTUM_COHERENCE": 0.75,
  "QUANTUM_CONSCIOUSNESS": 0.8,
  "QUANTUM_ENTANGLEMENT": 0.65,
  "QUANTUM_SUPERPOSITION": 0.7,
  "QUANTUM_TUNNELING": 0.6,
  "MARKET_VOLATILITY": 0.05,
  "MARKET_MOMENTUM": 0.1,
  "MARKET_LIQUIDITY": 0.75,
  "MARKET_SPREAD": 0.001,
  "MARKET_DEPTH": 500000,
  "FUNDING_RATE": 0.02,
  "FUNDING_VOLATILITY": 0.01,
  "FUNDING_DEVIATION": 0.5,
  "FUNDING_ANNUALIZED": 5,
  "LIQUIDATION_PROBABILITY": 0.05,
  "SLIPPAGE_RATE": 0.0025,
  "VOLATILITY_RISK": 0.1,
  "EXECUTION_RISK": 0.005,
  "VOLUME_24H": 500000,
  "VOLUME_RATIO": 0.75,
  "VOLUME_EXPANSION": 300000,
  "PRICE_CHANGE": 0.02,
  "PRICE_ACCELERATION": 0.015,
  "PRICE_MOMENTUM": 0.01,
  "TIME_TO_FUNDING": 1800000,
  "SESSION_INTENSITY": 0.6,
  "TEMPORAL_RESONANCE": 0.7,
  "FIBONACCI_STRENGTH": 0.75,
  "FIBONACCI_INDEX": 5,
  "NEURAL_CONFIDENCE": 0.85,
  "NEURAL_COHERENCE": 0.8,
  "NEURAL_ENTANGLEMENT": 0.7,
  "BASE_LEVERAGE": 15,
  "CONSERVATIVE_LEVERAGE": 10,
  "AGGRESSIVE_LEVERAGE": 25,
  "STOP_LOSS": 0.03,
  "TAKE_PROFIT": 0.06,
  "BASE_SCORE": 0.65,
  "CONFIDENCE_SCORE": 0.75,
  "QUALITY_SCORE": 0.8
};

/**
 * VigoFutures – Lanzador unificado standalone
 * Inicia QuantumUnifiedCore y opcionalmente Coordinator sin dependencias externas.
 */

const path = require('path');
const fs = require('fs');

// Logger simple
const log = (level, msg) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${level.toUpperCase()}] ${msg}`);
};

function loadEnvironmentIfAvailable() {
  try {
    const { loadEnv } = require('../quantum-core/services/SharedServices');
    if (typeof loadEnv === 'function') {
      loadEnv();
      log('info', 'Variables de entorno cargadas desde SharedServices (externo)');
    }
  } catch (err) {
    try {
      const { loadEnv } = require('./quantum-core/services/SharedServices');
      if (typeof loadEnv === 'function') {
        loadEnv();
        log('info', 'Variables de entorno cargadas desde SharedServices (local)');
        return;
      }
    } catch (_) {
      // noop
    }
    log('info', 'SharedServices no disponible, usando process.env tal cual');
  }
}

function validatePort(port, fallback) {
  const p = parseInt(port || fallback, 10);
  if (isNaN(p) || p < 1 || p > 65535) {
    log('error', `Puerto inválido: ${port}`);
    process.exit(1);
  }
  return p;
}

async function startUnified() {
  loadEnvironmentIfAvailable();

  const unifiedPort = validatePort(process.env.UNIFIED_SERVER_PORT, 18020);
  const singleServerMode = (process.env.SINGLE_SERVER_MODE || 'true').toLowerCase() === 'true';

  let QuantumUnifiedCore;
  try {
    QuantumUnifiedCore = require('../quantum-core/QuantumUnifiedCore').QuantumUnifiedCore;
    log('info', 'Cargando QuantumUnifiedCore (externo)');
  } catch (err) {
    QuantumUnifiedCore = require('./quantum-core/QuantumUnifiedCore').QuantumUnifiedCore;
    log('info', 'Cargando QuantumUnifiedCore (local)');
  }
  const quantumCore = new QuantumUnifiedCore();
  await quantumCore.start(unifiedPort);

  log('info', `QuantumUnifiedCore expuesto en http://localhost:${unifiedPort}`);
  log('info', `WS disponible en ws://localhost:${unifiedPort}`);

  if (!singleServerMode) {
    try {
      let coordinator;
      try {
        coordinator = require('../coordinator');
        log('info', 'Cargando Coordinator (externo)');
      } catch (err) {
        coordinator = require('./coordinator');
        log('info', 'Cargando Coordinator (local)');
      }
      if (coordinator && typeof coordinator.start === 'function') {
        const coordinatorPort = validatePort(process.env.COORDINATOR_PORT, 3000);
        await coordinator.start();
        log('info', `Coordinator expuesto en http://localhost:${coordinatorPort}`);
      } else if (coordinator && coordinator.default && typeof coordinator.default.start === 'function') {
        const coordinatorPort = validatePort(process.env.COORDINATOR_PORT, 3000);
        await coordinator.default.start();
        log('info', `Coordinator expuesto en http://localhost:${coordinatorPort}`);
      } else {
        log('warn', 'No se pudo iniciar Coordinator: export inesperado');
      }
    } catch (err) {
      log('warn', `Coordinator no arrancó: ${err.message}`);
    }
  } else {
    log('info', 'SINGLE_SERVER_MODE=true -> Coordinator omitido');
  }

  const stop = async () => {
    try {
      log('info', 'Recibida señal de apagado, cerrando servicios...');
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

startUnified().catch((err) => {
  log('error', `Error al iniciar sistema unificado: ${err.message}`);
  process.exit(1);
});



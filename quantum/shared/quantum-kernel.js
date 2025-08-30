
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
 * Quantum Kernel - Funciones y constantes compartidas
 * Centraliza λ, transformaciones trig y normalizaciones para consistencia entre módulos.
 */

// Constantes heredadas del núcleo QBTC (kernel Python)
const UNIVERSAL_FREQUENCY = 7919;
const QUANTUM_RESOLUTION = 0.0001;
const ARCHETYPAL_DIMENSIONS = 12;

function getLambda(customLambda) {
  if (typeof customLambda === 'number' && Number.isFinite(customLambda)) return customLambda;
  return Math.log(UNIVERSAL_FREQUENCY);
}

function quantumPhase(sumWeighted, customLambda) {
  const lambda = getLambda(customLambda);
  return lambda * sumWeighted;
}

function quantumRealImag(phase) {
  const real = 9 * Math.cos(phase);
  const imag = 16 * Math.sin(phase);
  return { real, imag };
}

function quantumMagnitude(phase) {
  const { real, imag } = quantumRealImag(phase);
  return Math.sqrt(real * real + imag * imag);
}

function quantumEnhancement(sumWeighted, customLambda) {
  const phase = quantumPhase(sumWeighted, customLambda);
  const magnitude = quantumMagnitude(phase);
  return Math.sin(magnitude) * Math.cos(phase * 0.5);
}

function clamp01(x) {
  if (!Number.isFinite(x)) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

module.exports = {
  // Constantes físicas del sistema
  PHYSICAL_CONSTANTS,
  // Constantes del núcleo
  UNIVERSAL_FREQUENCY,
  QUANTUM_RESOLUTION,
  ARCHETYPAL_DIMENSIONS,
  getLambda,
  quantumPhase,
  quantumRealImag,
  quantumMagnitude,
  quantumEnhancement,
  clamp01,
};



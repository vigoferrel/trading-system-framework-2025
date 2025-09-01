
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



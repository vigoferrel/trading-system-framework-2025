/**
 * QUANTUM CONSTANTS - Sistema Unificado de Constantes Cuánticas
 *
 * Este archivo centraliza todas las constantes cuánticas del sistema
 * para evitar duplicación y asegurar consistencia.
 *
 * Version: 1.0.0
 * Last Updated: 2025-09-03
 */

'use strict';

// =============================================================================
// CONSTANTES FUNDAMENTALES DEL SISTEMA QUÁNTICO
// =============================================================================

/**
 * Constantes del Número Cuántico Complejo z = 9 + 16i
 * Basado en la teoría de Feynman y mecánica cuántica avanzada
 */
const QUANTUM_COMPLEX = Object.freeze({
  Z_REAL: 9,                    // Parte real del número cuántico complejo z = 9 + 16i
  Z_IMAG: 16,                   // Parte imaginaria del número cuántico complejo
  Z_MAGNITUDE: Math.sqrt(9 * 9 + 16 * 16), // |z| = √(9² + 16²) = 18.3576
  Z_PHASE: Math.atan2(16, 9),   // Fase de z = atan2(16, 9) = 1.0637 rad
});

/**
 * Constantes de Longitud de Onda Cuántica
 * Basadas en el número primo 7919 y logaritmos naturales
 */
const QUANTUM_WAVELENGTH = Object.freeze({
  LAMBDA_7919: Math.log(7919),  // Longitud de onda cuántica fundamental λ = log(7919) = 8.977 Hz
  LAMBDA_LOG_7919: Math.log(7919), // Alias para compatibilidad
  LOG_7919: Math.log(7919),    // Alias alternativo
});

/**
 * Constantes de Resonancia y Frecuencia
 * Basadas en análisis espectral cuántico
 */
const QUANTUM_RESONANCE = Object.freeze({
  RESONANCE_FREQ: 888,         // Frecuencia de resonancia fundamental 888 MHz
  LAMBDA_888_MHZ: 888,         // Alias para compatibilidad
  FREQ_88MHZ: 888,             // Alias alternativo
});

/**
 * Constantes Matemáticas Fundamentales
 * Proporción áurea y constantes matemáticas universales
 */
const MATHEMATICAL_CONSTANTS = Object.freeze({
  PHI_GOLDEN: (1 + Math.sqrt(5)) / 2, // Proporción áurea φ = 1.618034
  PHI: (1 + Math.sqrt(5)) / 2,        // Alias para compatibilidad
  EULER_GAMMA: 0.57721566490153286060651209008240243104215933593992, // Constante de Euler-Mascheroni
  E: Math.E,                          // Número e (Euler)
});

/**
 * Constantes de Coherencia Cuántica
 * Umbrales y factores para algoritmos de coherencia
 */
const QUANTUM_COHERENCE = Object.freeze({
  COHERENCE_THRESHOLD: 0.85,   // Umbral mínimo de coherencia para operaciones válidas
  ENTANGLEMENT_FACTOR: 0.95,   // Factor de entrelazamiento cuántico
  SUPERPOSITION_DEPTH: 0.90,   // Profundidad de superposición
});

/**
 * Constantes de Energía Cuántica
 * Energía fundamental del sistema z × λ × φ
 */
const QUANTUM_ENERGY = Object.freeze({
  QUANTUM_ENERGY: QUANTUM_COMPLEX.Z_REAL * QUANTUM_COMPLEX.Z_IMAG * QUANTUM_WAVELENGTH.LAMBDA_7919,
  BASE_ENERGY: QUANTUM_COMPLEX.Z_REAL * QUANTUM_COMPLEX.Z_IMAG,
  RESONANCE_ENERGY: QUANTUM_RESONANCE.RESONANCE_FREQ * QUANTUM_WAVELENGTH.LAMBDA_7919,
});

/**
 * Secuencia Fibonacci Cuántica
 * Primeros 16 números de Fibonacci para algoritmos cuánticos
 */
const QUANTUM_FIBONACCI = Object.freeze([
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987
]);

/**
 * Primos Cuánticos Optimizados
 * Secuencia prima para generadores cuánticos y hash
 */
const QUANTUM_PRIMES = Object.freeze({
  PRIMES: [7919, 9973, 1597, 887], // Secuencia prima optimizada
  PRIMARY_PRIME: 7919,             // Primo principal del sistema
  SECONDARY_PRIME: 9973,           // Primo secundario
});

/**
 * Constantes de Tiempo Cuántico
 * Factores temporales para algoritmos dinámicos
 */
const QUANTUM_TIME = Object.freeze({
  QUANTUM_TIME_FACTOR: 0.0001,     // Factor temporal cuántico base
  RESONANCE_PERIOD: 1 / 888,       // Período de resonancia
  COHERENCE_WINDOW: 1000,          // Ventana de coherencia en ms
});

/**
 * Constantes de Validación
 * Límites y validaciones del sistema
 */
const VALIDATION_CONSTANTS = Object.freeze({
  MAX_QUANTUM_ITERATIONS: 1000,    // Máximo de iteraciones cuánticas
  MIN_COHERENCE_LEVEL: 0.1,        // Nivel mínimo de coherencia
  MAX_ENTANGLEMENT_DEPTH: 10,      // Profundidad máxima de entrelazamiento
  TIMEOUT_QUANTUM_OPERATION: 5000, // Timeout para operaciones cuánticas (ms)
});

// =============================================================================
// OBJETO PRINCIPAL DE CONSTANTES - EXPORTACIÓN UNIFICADA
// =============================================================================

/**
 * QuantumConstants - Objeto principal con todas las constantes del sistema
 * Congela el objeto para prevenir modificaciones accidentales
 */
const QuantumConstants = Object.freeze({
  // Números Cuánticos Complejos
  Z_REAL: QUANTUM_COMPLEX.Z_REAL,
  Z_IMAG: QUANTUM_COMPLEX.Z_IMAG,
  Z_MAGNITUDE: QUANTUM_COMPLEX.Z_MAGNITUDE,
  Z_PHASE: QUANTUM_COMPLEX.Z_PHASE,

  // Longitudes de Onda Cuánticas
  LAMBDA_7919: QUANTUM_WAVELENGTH.LAMBDA_7919,
  LAMBDA_LOG_7919: QUANTUM_WAVELENGTH.LAMBDA_LOG_7919,
  LOG_7919: QUANTUM_WAVELENGTH.LOG_7919,

  // Resonancia y Frecuencia
  RESONANCE_FREQ: QUANTUM_RESONANCE.RESONANCE_FREQ,
  LAMBDA_888_MHZ: QUANTUM_RESONANCE.LAMBDA_888_MHZ,
  FREQ_88MHZ: QUANTUM_RESONANCE.FREQ_88MHZ,

  // Constantes Matemáticas
  PHI_GOLDEN: MATHEMATICAL_CONSTANTS.PHI_GOLDEN,
  PHI: MATHEMATICAL_CONSTANTS.PHI,
  EULER_GAMMA: MATHEMATICAL_CONSTANTS.EULER_GAMMA,
  E: MATHEMATICAL_CONSTANTS.E,

  // Coherencia Cuántica
  COHERENCE_THRESHOLD: QUANTUM_COHERENCE.COHERENCE_THRESHOLD,
  ENTANGLEMENT_FACTOR: QUANTUM_COHERENCE.ENTANGLEMENT_FACTOR,
  SUPERPOSITION_DEPTH: QUANTUM_COHERENCE.SUPERPOSITION_DEPTH,

  // Energía Cuántica
  QUANTUM_ENERGY: QUANTUM_ENERGY.QUANTUM_ENERGY,
  BASE_ENERGY: QUANTUM_ENERGY.BASE_ENERGY,
  RESONANCE_ENERGY: QUANTUM_ENERGY.RESONANCE_ENERGY,

  // Secuencias
  QUANTUM_FIBONACCI: QUANTUM_FIBONACCI,
  PRIMES: QUANTUM_PRIMES.PRIMES,
  PRIMARY_PRIME: QUANTUM_PRIMES.PRIMARY_PRIME,
  SECONDARY_PRIME: QUANTUM_PRIMES.SECONDARY_PRIME,

  // Tiempo
  QUANTUM_TIME_FACTOR: QUANTUM_TIME.QUANTUM_TIME_FACTOR,
  RESONANCE_PERIOD: QUANTUM_TIME.RESONANCE_PERIOD,
  COHERENCE_WINDOW: QUANTUM_TIME.COHERENCE_WINDOW,

  // Validación
  MAX_QUANTUM_ITERATIONS: VALIDATION_CONSTANTS.MAX_QUANTUM_ITERATIONS,
  MIN_COHERENCE_LEVEL: VALIDATION_CONSTANTS.MIN_COHERENCE_LEVEL,
  MAX_ENTANGLEMENT_DEPTH: VALIDATION_CONSTANTS.MAX_ENTANGLEMENT_DEPTH,
  TIMEOUT_QUANTUM_OPERATION: VALIDATION_CONSTANTS.TIMEOUT_QUANTUM_OPERATION,

  // Objetos completos para acceso avanzado
  COMPLEX: QUANTUM_COMPLEX,
  WAVELENGTH: QUANTUM_WAVELENGTH,
  RESONANCE: QUANTUM_RESONANCE,
  MATHEMATICS: MATHEMATICAL_CONSTANTS,
  COHERENCE: QUANTUM_COHERENCE,
  ENERGY: QUANTUM_ENERGY,
  TIME: QUANTUM_TIME,
  VALIDATION: VALIDATION_CONSTANTS,
});

// =============================================================================
// FUNCIONES UTILITARIAS
// =============================================================================

/**
 * Valida que todas las constantes estén definidas y sean números finitos
 */
function validateConstants() {
  const issues = [];

  Object.entries(QuantumConstants).forEach(([key, value]) => {
    if (typeof value === 'number' && !isFinite(value)) {
      issues.push(`Constante ${key} no es un número finito: ${value}`);
    }
    if (value === undefined || value === null) {
      issues.push(`Constante ${key} está indefinida o es null`);
    }
  });

  if (issues.length > 0) {
    console.error('❌ Errores de validación en constantes cuánticas:', issues);
    throw new Error(`Constantes inválidas detectadas: ${issues.join(', ')}`);
  }

  console.log('✅ Todas las constantes cuánticas validadas correctamente');
  return true;
}

/**
 * Obtiene una constante por nombre con validación
 */
function getConstant(name) {
  if (!(name in QuantumConstants)) {
    throw new Error(`Constante cuántica '${name}' no encontrada`);
  }
  return QuantumConstants[name];
}

/**
 * Lista todas las constantes disponibles
 */
function listConstants() {
  return Object.keys(QuantumConstants).filter(key =>
    typeof QuantumConstants[key] === 'number'
  );
}

/**
 * Obtiene todas las constantes físicas para compatibilidad
 */
function getPhysicalConstants() {
  return {
    // Constantes físicas fundamentales
    SPEED_OF_LIGHT: 299792458,
    PLANCK_CONSTANT: 6.62607015e-34,
    AVOGADRO_NUMBER: 6.02214076e23,
    BOLTZMANN_CONSTANT: 1.380649e-23,
    ELECTRON_CHARGE: 1.602176634e-19,
    
    // Constantes matemáticas
    PI: Math.PI,
    E: Math.E,
    PHI: QuantumConstants.PHI_GOLDEN,
    EULER_GAMMA: QuantumConstants.EULER_GAMMA,
    
    // Constantes cuánticas del sistema
    Z_REAL: QuantumConstants.Z_REAL,
    Z_IMAG: QuantumConstants.Z_IMAG,
    LAMBDA_7919: QuantumConstants.LAMBDA_7919,
    RESONANCE_FREQ: QuantumConstants.RESONANCE_FREQ,
    BASE_ENERGY: QuantumConstants.BASE_ENERGY
  };
}

/**
 * Obtiene todas las constantes cuánticas
 */
function getQuantumConstants() {
  return QuantumConstants;
}

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  QuantumConstants,
  QUANTUM_CONSTANTS: QuantumConstants, // Alias para compatibilidad
  validateConstants,
  getConstant,
  listConstants,
  getPhysicalConstants,
  getQuantumConstants,

  // Exportaciones individuales para compatibilidad
  Z_REAL: QuantumConstants.Z_REAL,
  Z_IMAG: QuantumConstants.Z_IMAG,
  LAMBDA_7919: QuantumConstants.LAMBDA_7919,
  PHI_GOLDEN: QuantumConstants.PHI_GOLDEN,
  RESONANCE_FREQ: QuantumConstants.RESONANCE_FREQ,
  COHERENCE_THRESHOLD: QuantumConstants.COHERENCE_THRESHOLD,
  QUANTUM_FIBONACCI: QuantumConstants.QUANTUM_FIBONACCI,
  EULER_GAMMA: QuantumConstants.EULER_GAMMA,
};

// Validar constantes al cargar el módulo
validateConstants();

console.log('🔬 [QUANTUM CONSTANTS] Sistema de constantes cuánticas inicializado');
console.log(`   📊 ${listConstants().length} constantes cargadas`);
console.log(`   🎯 Energía base: ${QuantumConstants.BASE_ENERGY.toFixed(3)}`);
console.log(`   📈 Coherencia mínima: ${(QuantumConstants.MIN_COHERENCE_LEVEL * 100).toFixed(1)}%`);

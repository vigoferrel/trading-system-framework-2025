/**
 * VALIDATION CONSTANTS - CONSTANTES DE VALIDACIÓN CUÁNTICA
 * ========================================================
 * 
 * Define rangos válidos y límites seguros para todos los parámetros
 * del sistema cuántico QBTC. Estas constantes previenen valores
 * fuera de rango que podrían causar inestabilidad numérica.
 * 
 * Basado en las constantes primas: z = 9 + 16i, λ = ln(7919), 888 MHz
 */

// Constantes fundamentales del sistema cuántico
const QUANTUM_FUNDAMENTALS = {
    // Constantes primas base
    Z_REAL: 9,
    Z_IMAG: 16,
    LAMBDA_7919: Math.log(7919), // ≈ 8.977
    RESONANCE_888_MHZ: 888,
    UNIVERSAL_FREQUENCY: 7919,
    
    // Constantes físicas
    PLANCK_CONSTANT: 6.62607015e-34,
    GOLDEN_RATIO: (1 + Math.sqrt(5)) / 2, // φ ≈ 1.618
    EULER_NUMBER: Math.E, // e ≈ 2.718
    PI: Math.PI
};

// Rangos de validación para coherencia cuántica
const COHERENCE_RANGES = {
    MIN_COHERENCE_LEVEL: 0.0,
    MAX_COHERENCE_LEVEL: 1.0,
    OPTIMAL_COHERENCE: 0.85,
    CRITICAL_COHERENCE: 0.3,
    
    // Subcategorías de coherencia
    MIN_QUANTUM_COHERENCE: 0.5,
    MAX_QUANTUM_COHERENCE: 1.0,
    MIN_NEURAL_COHERENCE: 0.2,
    MAX_NEURAL_COHERENCE: 0.95
};

// Rangos para niveles de energía cuántica
const ENERGY_RANGES = {
    MIN_ENERGY_LEVEL: 0.0,
    MAX_ENERGY_LEVEL: 100.0,
    OPTIMAL_ENERGY: 75.0,
    CRITICAL_ENERGY: 25.0,
    
    // Energías específicas
    MIN_QUANTUM_ENERGY: 10.0,
    MAX_QUANTUM_ENERGY: 90.0,
    MIN_NEURAL_ENERGY: 5.0,
    MAX_NEURAL_ENERGY: 85.0
};

// Rangos de resonancia (MHz)
const RESONANCE_RANGES = {
    MIN_RESONANCE: 100,
    MAX_RESONANCE: 2000,
    OPTIMAL_RESONANCE: 888, // Frecuencia principal
    CRITICAL_RESONANCE: 200,
    
    // Bandas de resonancia
    LOW_BAND_MIN: 100,
    LOW_BAND_MAX: 300,
    MID_BAND_MIN: 300,
    MID_BAND_MAX: 1000,
    HIGH_BAND_MIN: 1000,
    HIGH_BAND_MAX: 2000
};

// Rangos para fases cuánticas (radianes)
const PHASE_RANGES = {
    MIN_PHASE: -2 * Math.PI,
    MAX_PHASE: 2 * Math.PI,
    OPTIMAL_PHASE: Math.PI / 4, // 45 grados
    CRITICAL_PHASE: Math.PI / 6, // 30 grados
    
    // Fases especiales
    ZERO_PHASE: 0,
    QUARTER_PHASE: Math.PI / 2,
    HALF_PHASE: Math.PI,
    THREE_QUARTER_PHASE: 3 * Math.PI / 2,
    FULL_PHASE: 2 * Math.PI
};

// Rangos de probabilidad y confianza
const PROBABILITY_RANGES = {
    MIN_PROBABILITY: 0.0,
    MAX_PROBABILITY: 1.0,
    MIN_CONFIDENCE: 0.0,
    MAX_CONFIDENCE: 1.0,
    
    // Umbrales de confianza
    LOW_CONFIDENCE: 0.3,
    MEDIUM_CONFIDENCE: 0.6,
    HIGH_CONFIDENCE: 0.8,
    CRITICAL_CONFIDENCE: 0.95
};

// Rangos para magnitudes y amplitudes
const MAGNITUDE_RANGES = {
    MIN_MAGNITUDE: 0.0,
    MAX_MAGNITUDE: Number.MAX_SAFE_INTEGER / 1000000,
    MIN_AMPLITUDE: -1.0,
    MAX_AMPLITUDE: 1.0,
    
    // Umbrales de magnitud
    SMALL_MAGNITUDE: 0.01,
    MEDIUM_MAGNITUDE: 0.5,
    LARGE_MAGNITUDE: 10.0,
    HUGE_MAGNITUDE: 1000.0
};

// Rangos financieros (para trading)
const FINANCIAL_RANGES = {
    MIN_PRICE: 0.0001,
    MAX_PRICE: 1000000,
    MIN_VOLUME: 0,
    MAX_VOLUME: 1e12,
    MIN_LEVERAGE: 1,
    MAX_LEVERAGE: 125,
    
    // Rangos de volatilidad
    MIN_VOLATILITY: 0.001,
    MAX_VOLATILITY: 2.0,
    MIN_SPREAD: 0.0001,
    MAX_SPREAD: 0.1,
    
    // Rangos de tiempo (milisegundos)
    MIN_TIMEFRAME: 1000, // 1 segundo
    MAX_TIMEFRAME: 86400000 * 365, // 1 año
    
    // Rangos de score/puntuación
    MIN_SCORE: 0.0,
    MAX_SCORE: 100.0
};

// Tolerancias numéricas para comparaciones
const NUMERICAL_TOLERANCES = {
    FLOAT_EPSILON: Number.EPSILON,
    COMPARISON_TOLERANCE: 1e-12,
    DIVISION_TOLERANCE: 1e-15,
    TRIGONOMETRIC_TOLERANCE: 1e-10,
    
    // Tolerancias específicas
    PRICE_TOLERANCE: 1e-8,
    VOLUME_TOLERANCE: 1e-6,
    SCORE_TOLERANCE: 1e-4
};

// Límites de sistema para prevenir overflows
const SYSTEM_LIMITS = {
    MAX_ITERATIONS: 10000,
    MAX_RECURSION_DEPTH: 100,
    MAX_CACHE_SIZE: 50000,
    MAX_MEMORY_MB: 1024,
    
    // Timeouts (milisegundos)
    DEFAULT_TIMEOUT: 30000,
    SHORT_TIMEOUT: 5000,
    LONG_TIMEOUT: 120000,
    
    // Límites de red
    MAX_REQUESTS_PER_SECOND: 10,
    MAX_CONCURRENT_REQUESTS: 5
};

// Configuración de kernel RNG
const RNG_CONFIG = {
    DEFAULT_SEED_MULTIPLIER: 1664525,
    DEFAULT_SEED_INCREMENT: 1013904223,
    DEFAULT_SEED_MODULO: Math.pow(2, 32),
    
    // Rangos para generación
    MIN_RANDOM_SEED: 1,
    MAX_RANDOM_SEED: Math.pow(2, 31) - 1,
    
    // Configuración de distribuciones
    NORMAL_MEAN: 0.0,
    NORMAL_STDDEV: 1.0,
    EXPONENTIAL_LAMBDA: 1.0
};

// Objeto principal de constantes de validación
const VALIDATION_CONSTANTS = {
    // Rangos fundamentales
    ...COHERENCE_RANGES,
    ...ENERGY_RANGES,
    ...RESONANCE_RANGES,
    ...PHASE_RANGES,
    ...PROBABILITY_RANGES,
    ...MAGNITUDE_RANGES,
    ...FINANCIAL_RANGES,
    
    // Configuraciones del sistema
    ...NUMERICAL_TOLERANCES,
    ...SYSTEM_LIMITS,
    ...RNG_CONFIG,
    
    // Constantes fundamentales
    QUANTUM_FUNDAMENTALS
};

/**
 * Función para validar si un valor está dentro del rango permitido
 * @param {number} value - Valor a validar
 * @param {string} type - Tipo de validación
 * @param {object} customLimits - Límites personalizados opcionales
 * @returns {boolean} True si el valor es válido
 */
function isValidValue(value, type, customLimits = {}) {
    if (!isFinite(value)) return false;
    
    const limits = { ...VALIDATION_CONSTANTS, ...customLimits };
    
    switch (type) {
        case 'coherence':
            return value >= limits.MIN_COHERENCE_LEVEL && 
                   value <= limits.MAX_COHERENCE_LEVEL;
        
        case 'energy':
            return value >= limits.MIN_ENERGY_LEVEL && 
                   value <= limits.MAX_ENERGY_LEVEL;
        
        case 'resonance':
            return value >= limits.MIN_RESONANCE && 
                   value <= limits.MAX_RESONANCE;
        
        case 'phase':
            return value >= limits.MIN_PHASE && 
                   value <= limits.MAX_PHASE;
        
        case 'probability':
            return value >= limits.MIN_PROBABILITY && 
                   value <= limits.MAX_PROBABILITY;
        
        case 'magnitude':
            return value >= limits.MIN_MAGNITUDE && 
                   value <= limits.MAX_MAGNITUDE;
        
        case 'price':
            return value >= limits.MIN_PRICE && 
                   value <= limits.MAX_PRICE;
        
        case 'volume':
            return value >= limits.MIN_VOLUME && 
                   value <= limits.MAX_VOLUME;
        
        case 'leverage':
            return value >= limits.MIN_LEVERAGE && 
                   value <= limits.MAX_LEVERAGE;
        
        case 'volatility':
            return value >= limits.MIN_VOLATILITY && 
                   value <= limits.MAX_VOLATILITY;
        
        case 'score':
            return value >= limits.MIN_SCORE && 
                   value <= limits.MAX_SCORE;
        
        default:
            return true;
    }
}

/**
 * Función para obtener los límites de un tipo específico
 * @param {string} type - Tipo de límite a obtener
 * @returns {object} Objeto con min y max para el tipo especificado
 */
function getLimitsForType(type) {
    const limits = VALIDATION_CONSTANTS;
    
    switch (type) {
        case 'coherence':
            return { 
                min: limits.MIN_COHERENCE_LEVEL, 
                max: limits.MAX_COHERENCE_LEVEL,
                optimal: limits.OPTIMAL_COHERENCE 
            };
        
        case 'energy':
            return { 
                min: limits.MIN_ENERGY_LEVEL, 
                max: limits.MAX_ENERGY_LEVEL,
                optimal: limits.OPTIMAL_ENERGY 
            };
        
        case 'resonance':
            return { 
                min: limits.MIN_RESONANCE, 
                max: limits.MAX_RESONANCE,
                optimal: limits.OPTIMAL_RESONANCE 
            };
        
        case 'phase':
            return { 
                min: limits.MIN_PHASE, 
                max: limits.MAX_PHASE,
                optimal: limits.OPTIMAL_PHASE 
            };
        
        case 'probability':
            return { 
                min: limits.MIN_PROBABILITY, 
                max: limits.MAX_PROBABILITY 
            };
        
        default:
            return { min: -Infinity, max: Infinity };
    }
}

module.exports = {
    VALIDATION_CONSTANTS,
    QUANTUM_FUNDAMENTALS,
    COHERENCE_RANGES,
    ENERGY_RANGES,
    RESONANCE_RANGES,
    PHASE_RANGES,
    PROBABILITY_RANGES,
    MAGNITUDE_RANGES,
    FINANCIAL_RANGES,
    NUMERICAL_TOLERANCES,
    SYSTEM_LIMITS,
    RNG_CONFIG,
    
    // Funciones de utilidad
    isValidValue,
    getLimitsForType
};

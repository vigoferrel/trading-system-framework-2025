
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
 * CONFIGURACIÓN UNIFICADA DEL SISTEMA CUÁNTICO
 * Integra todos los componentes bajo las mismas constantes y campos
 */

const QUANTUM_CONSTANTS = {
    // Constantes principales verificadas
    LAMBDA_888_MHZ: 888e6,      // Frecuencia de resonancia principal
    LOG_7919: Math.log(7919),    // Factor logarítmico óptimo ≈ 8.977
    PHI: (1 + Math.sqrt(5)) / 2, // Proporción áurea ≈ 1.618034
    
    // Campos cuánticos de Srona (optimizados)
    SRONA_FIELDS: {
        ALPHA: 0.941,    // Campo coherencia (optimizado)
        BETA: 0.964,     // Campo resonancia (verificado)
        GAMMA: 0.888     // Campo estabilidad (888MHz normalizado)
    },

    // Constantes Feynman
    FEYNMAN_CONSTANT: 2.71828182846,
    GOLDEN_RATIO: 1.61803398875,

    // Configuración del sistema
    SYSTEM: {
        MIN_CONFIDENCE: 0.75,
        TIME_DECAY: 0.00002,
        VOLATILITY_WEIGHT: 1.5
    },

    // Configuración de trading
    TRADING: {
        MIN_PREMIUM: 0.001,
        MAX_PREMIUM: 0.01,
        RISK_FACTOR: 0.05,
        PROFIT_FACTOR: 0.1
    },

    // Puertos del sistema
    PORTS: {
        QUANTUM_SYSTEM: 7919,    // Puerto principal (log7919)
        QUANTUM_WS: 7919,        // WebSocket (mismo que principal)
        QUANTUM_REST: 7919,      // REST API (mismo que principal)
        FUTURES: 7920,           // Futures (7919 + 1)
        ECOSYSTEM: 7921,         // Ecosystem (7919 + 2)
        HOOK_WHEEL: 7922,        // Hook Wheel (7919 + 3)
        MESSAGE_BROKER: 7923     // Message Broker (7919 + 4)
    }
};

// Funciones de transformación cuántica
const QUANTUM_TRANSFORMS = {
    // Normalización de frecuencia 888MHz
    normalizeFrequency: (freq) => freq / 1e9,
    
    // Transformación logarítmica 7919
    logTransform: (value) => Math.log(value) / QUANTUM_CONSTANTS.LOG_7919,
    
    // Campo unificado
    unifyFields: (resonance, logValue) => {
        const { ALPHA, BETA, GAMMA } = QUANTUM_CONSTANTS.SRONA_FIELDS;
        // Optimización: Incluir GAMMA en el cálculo de strength y mejorar coherencia
        const strength = (resonance * ALPHA * GAMMA) + (logValue * BETA * GAMMA);
        const coherence = (resonance * ALPHA + logValue * BETA + GAMMA) / 3;
        return {
            strength: Math.min(strength * 1.5, 1.0), // Amplificar strength con límite 1.0
            stability: Math.min(GAMMA * 2.5, 1.0),    // Aumentar estabilidad
            coherence: Math.min(coherence * 2, 1.0)   // Amplificar coherencia con límite 1.0
        };
    },

    // Ajuste cuántico de precio
    calculatePrice: (basePrice, unifiedField) => {
        const phiAdjustment = 1 / QUANTUM_CONSTANTS.PHI;
        const quantumAdjustment = (
            (unifiedField.strength * QUANTUM_CONSTANTS.LOG_7919) +
            (unifiedField.stability * QUANTUM_CONSTANTS.PHI) +
            unifiedField.coherence
        ) / 3;
        return basePrice * phiAdjustment * quantumAdjustment;
    }
};

module.exports = {
    QUANTUM_CONSTANTS,
    QUANTUM_TRANSFORMS
};

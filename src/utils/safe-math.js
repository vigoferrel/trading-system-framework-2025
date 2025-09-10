/**
 * SAFE MATH UTILITIES - NÚCLEO MATEMÁTICO SEGURO
 * ==============================================
 * 
 * Sistema de funciones matemáticas robustas que previenen:
 * - Divisiones por cero
 * - Senos cercanos a cero (singularidades)
 * - Valores infinitos o NaN
 * - Desbordamientos numéricos
 * 
 * Utiliza constantes cuánticas del kernel y métricas propias
 * para generación de números estables sin Math.random
 */

const { VALIDATION_CONSTANTS } = require('../constants/validation-constants');

// Constantes para cálculos seguros
const SAFE_MATH_CONSTANTS = {
    EPSILON: Number.EPSILON || 2.220446049250313e-16,
    MIN_SAFE_DIVISOR: 1e-15,
    MIN_TRIG_THRESHOLD: 1e-12,
    MAX_SAFE_MAGNITUDE: Number.MAX_SAFE_INTEGER / 1000,
    GOLDEN_RATIO: (1 + Math.sqrt(5)) / 2, // φ = 1.618...
    EULER_GAMMA: 0.5772156649015329, // γ de Euler-Mascheroni
    LOG_7919: Math.log(7919), // λ = ln(7919) ≈ 8.977
    RESONANCE_888: 888 // Frecuencia de resonancia universal MHz
};

/**
 * Cache inteligente para funciones trigonométricas costosas
 */
class TrigonometricCache {
    constructor(maxSize = 1000, ttlMs = 30000) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttlMs;
        this.hits = 0;
        this.misses = 0;
    }
    
    _generateKey(func, value, precision = 6) {
        return `${func}_${value.toFixed(precision)}`;
    }
    
    get(func, value) {
        const key = this._generateKey(func, value);
        const cached = this.cache.get(key);
        
        if (!cached) {
            this.misses++;
            return null;
        }
        
        if (Date.now() - cached.timestamp > this.ttl) {
            this.cache.delete(key);
            this.misses++;
            return null;
        }
        
        this.hits++;
        return cached.result;
    }
    
    set(func, value, result) {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) this.cache.delete(firstKey);
        }
        
        const key = this._generateKey(func, value);
        this.cache.set(key, {
            result,
            timestamp: Date.now()
        });
    }
    
    getStats() {
        return {
            size: this.cache.size,
            hits: this.hits,
            misses: this.misses,
            hitRatio: this.hits / (this.hits + this.misses) || 0
        };
    }
    
    clear() {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
    }
}

// Instancia global del cache
const trigCache = new TrigonometricCache();

/**
 * División segura que previene divisiones por cero
 * @param {number} numerator - Numerador
 * @param {number} denominator - Denominador
 * @param {number} fallback - Valor de fallback si división es insegura
 * @returns {number} Resultado seguro de la división
 */
function safeDiv(numerator, denominator, fallback = 0) {
    // Validar entradas
    if (!isFinite(numerator) || !isFinite(denominator)) {
        return fallback;
    }
    
    // Prevenir división por cero o valores muy pequeños
    if (Math.abs(denominator) < SAFE_MATH_CONSTANTS.MIN_SAFE_DIVISOR) {
        return fallback;
    }
    
    const result = numerator / denominator;
    
    // Validar resultado
    if (!isFinite(result) || Math.abs(result) > SAFE_MATH_CONSTANTS.MAX_SAFE_MAGNITUDE) {
        return fallback;
    }
    
    return result;
}

/**
 * Seno seguro que maneja valores cercanos a cero
 * @param {number} value - Valor de entrada
 * @param {number} threshold - Umbral mínimo para evitar singularidades
 * @returns {number} Seno seguro del valor
 */
function safeTrigSin(value, threshold = SAFE_MATH_CONSTANTS.MIN_TRIG_THRESHOLD) {
    if (!isFinite(value)) return 0;
    
    // Verificar cache primero
    const cached = trigCache.get('sin', value);
    if (cached !== null) return cached;
    
    // Normalizar valor al rango [-2π, 2π] para estabilidad
    const normalizedValue = value % (2 * Math.PI);
    
    const result = Math.sin(normalizedValue);
    
    // Si el resultado está muy cerca de cero, usar el umbral
    const safeResult = Math.abs(result) < threshold ? 
        (result >= 0 ? threshold : -threshold) : result;
    
    // Cachear resultado
    trigCache.set('sin', value, safeResult);
    
    return safeResult;
}

/**
 * Coseno seguro con cache
 * @param {number} value - Valor de entrada
 * @returns {number} Coseno seguro del valor
 */
function safeTrigCos(value) {
    if (!isFinite(value)) return 1;
    
    const cached = trigCache.get('cos', value);
    if (cached !== null) return cached;
    
    const normalizedValue = value % (2 * Math.PI);
    const result = Math.cos(normalizedValue);
    
    trigCache.set('cos', value, result);
    return result;
}

/**
 * Tangente segura que previene singularidades en π/2, 3π/2, etc.
 * @param {number} value - Valor de entrada
 * @param {number} fallback - Valor de fallback para singularidades
 * @returns {number} Tangente segura del valor
 */
function safeTrigTan(value, fallback = 1e6) {
    if (!isFinite(value)) return 0;
    
    const cached = trigCache.get('tan', value);
    if (cached !== null) return cached;
    
    const normalizedValue = value % Math.PI;
    
    // Verificar si está cerca de π/2 (singularidad de tangente)
    const distanceToSingularity = Math.abs(normalizedValue - Math.PI/2);
    if (distanceToSingularity < SAFE_MATH_CONSTANTS.MIN_TRIG_THRESHOLD) {
        trigCache.set('tan', value, fallback);
        return fallback;
    }
    
    const result = Math.tan(normalizedValue);
    
    if (!isFinite(result) || Math.abs(result) > SAFE_MATH_CONSTANTS.MAX_SAFE_MAGNITUDE) {
        trigCache.set('tan', value, fallback);
        return fallback;
    }
    
    trigCache.set('tan', value, result);
    return result;
}

/**
 * Logaritmo seguro que previene log(0) y log(negativos)
 * @param {number} value - Valor de entrada
 * @param {number} fallback - Valor de fallback para entradas inválidas
 * @returns {number} Logaritmo seguro del valor
 */
function safeLog(value, fallback = -10) {
    if (!isFinite(value) || value <= 0) {
        return fallback;
    }
    
    const result = Math.log(value);
    return isFinite(result) ? result : fallback;
}

/**
 * Raíz cuadrada segura para valores negativos
 * @param {number} value - Valor de entrada
 * @param {number} fallback - Valor de fallback para negativos
 * @returns {number} Raíz cuadrada segura del valor
 */
function safeSqrt(value, fallback = 0) {
    if (!isFinite(value) || value < 0) {
        return fallback;
    }
    
    return Math.sqrt(value);
}

/**
 * Validador de rangos basado en VALIDATION_CONSTANTS
 * @param {number} value - Valor a validar
 * @param {string} type - Tipo de validación ('coherence', 'energy', 'phase', etc.)
 * @returns {boolean} True si el valor está en rango válido
 */
function validateRange(value, type) {
    if (!isFinite(value)) return false;
    
    const constants = VALIDATION_CONSTANTS || {};
    
    switch (type) {
        case 'coherence':
            return value >= (constants.MIN_COHERENCE_LEVEL || 0) && 
                   value <= (constants.MAX_COHERENCE_LEVEL || 1);
        
        case 'energy':
            return value >= (constants.MIN_ENERGY_LEVEL || 0) && 
                   value <= (constants.MAX_ENERGY_LEVEL || 100);
        
        case 'phase':
            return value >= -2 * Math.PI && value <= 2 * Math.PI;
        
        case 'resonance':
            return value >= (constants.MIN_RESONANCE || 0) && 
                   value <= (constants.MAX_RESONANCE || 1000);
        
        case 'probability':
            return value >= 0 && value <= 1;
        
        default:
            return true; // Sin restricciones para tipos desconocidos
    }
}

/**
 * Limita un valor a un rango específico
 * @param {number} value - Valor a limitar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Valor limitado al rango
 */
function clampValue(value, min = -Infinity, max = Infinity) {
    if (!isFinite(value)) return min;
    return Math.max(min, Math.min(max, value));
}

/**
 * Transformación compleja segura usando constantes cuánticas
 * @param {number} x - Valor de entrada
 * @param {object} constants - Constantes cuánticas (z_real, z_imag, lambda)
 * @returns {object} Resultado de transformación compleja segura
 */
function safeComplexTransform(x, constants = {}) {
    const {
        z_real = 9,
        z_imag = 16,
        lambda = SAFE_MATH_CONSTANTS.LOG_7919
    } = constants;
    
    if (!isFinite(x)) {
        return { real: 0, imag: 0, magnitude: 0, normalized: 0 };
    }
    
    const phase = lambda * x;
    const real = z_real * safeTrigCos(phase);
    const imag = z_imag * safeTrigSin(phase);
    const magnitude = Math.hypot(real, imag);
    const z_mag = Math.hypot(z_real, z_imag);
    
    return {
        real,
        imag,
        magnitude,
        normalized: safeDiv(magnitude, z_mag, 0)
    };
}

/**
 * Generador de números pseudoaleatorios basado en métricas del sistema
 * (Reemplaza Math.random con determinismo basado en kernel)
 * @param {number} seed - Semilla opcional basada en timestamp + constantes
 * @returns {number} Número pseudoaleatorio [0, 1)
 */
function kernelRandom(seed) {
    // Usar timestamp actual + constantes cuánticas si no hay semilla
    const effectiveSeed = seed || (
        Date.now() % 1000000 + 
        SAFE_MATH_CONSTANTS.RESONANCE_888 + 
        Math.floor(SAFE_MATH_CONSTANTS.LOG_7919 * 1000)
    );
    
    // Algoritmo LCG (Linear Congruential Generator) modificado
    // Usando constantes que evitan ciclos cortos
    const a = 1664525; // Multiplicador
    const c = 1013904223; // Incremento
    const m = Math.pow(2, 32); // Módulo
    
    const next = (a * effectiveSeed + c) % m;
    return next / m;
}

/**
 * Precálculo de funciones trigonométricas comunes
 * @param {number} steps - Número de pasos para precálculo
 * @returns {object} Objeto con valores precalculados
 */
function precomputeTrigonometric(steps = 360) {
    const precomputed = {
        sin: new Map(),
        cos: new Map(),
        tan: new Map()
    };
    
    for (let i = 0; i < steps; i++) {
        const angle = (2 * Math.PI * i) / steps;
        const key = i;
        
        precomputed.sin.set(key, Math.sin(angle));
        precomputed.cos.set(key, Math.cos(angle));
        
        const tanValue = Math.tan(angle);
        precomputed.tan.set(key, isFinite(tanValue) ? tanValue : 1e6);
    }
    
    return precomputed;
}

module.exports = {
    // Funciones principales
    safeDiv,
    safeTrigSin,
    safeTrigCos,
    safeTrigTan,
    safeLog,
    safeSqrt,
    safeComplexTransform,
    
    // Validación y rangos
    validateRange,
    clampValue,
    
    // Sistema de kernel RNG
    kernelRandom,
    
    // Cache y optimización
    trigCache,
    precomputeTrigonometric,
    
    // Constantes
    SAFE_MATH_CONSTANTS,
    
    // Utilidades
    getTrigCacheStats: () => trigCache.getStats(),
    clearTrigCache: () => trigCache.clear()
};

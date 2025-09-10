/**
 * 🧮 SAFE MATH - Operaciones matemáticas seguras
 * Previene overflows, underflows y operaciones no seguras
 * 
 * @author QBTC Quantum Consciousness Trading System
 * @version 1.0.0
 */

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;
const MAX_SAFE_FLOAT = Number.MAX_VALUE;
const MIN_SAFE_FLOAT = Number.MIN_VALUE;
const EPSILON = Number.EPSILON;

/**
 * Verificar si un número es seguro para operaciones
 */
function isSafeNumber(value) {
    return typeof value === 'number' && 
           !isNaN(value) && 
           isFinite(value) &&
           value >= MIN_SAFE_INTEGER && 
           value <= MAX_SAFE_INTEGER;
}

/**
 * Verificar si un número es finito y válido
 */
function isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Suma segura
 */
function safeAdd(a, b) {
    if (!isValidNumber(a) || !isValidNumber(b)) {
        return 0;
    }
    
    const result = a + b;
    
    // Verificar overflow
    if (!isFinite(result) || result > MAX_SAFE_INTEGER || result < MIN_SAFE_INTEGER) {
        return a > 0 ? MAX_SAFE_INTEGER : MIN_SAFE_INTEGER;
    }
    
    return result;
}

/**
 * Resta segura
 */
function safeSubtract(a, b) {
    if (!isValidNumber(a) || !isValidNumber(b)) {
        return 0;
    }
    
    const result = a - b;
    
    if (!isFinite(result) || result > MAX_SAFE_INTEGER || result < MIN_SAFE_INTEGER) {
        return a > b ? MAX_SAFE_INTEGER : MIN_SAFE_INTEGER;
    }
    
    return result;
}

/**
 * Multiplicación segura
 */
function safeMultiply(a, b) {
    if (!isValidNumber(a) || !isValidNumber(b)) {
        return 0;
    }
    
    // Casos especiales
    if (a === 0 || b === 0) return 0;
    if (a === 1) return b;
    if (b === 1) return a;
    
    const result = a * b;
    
    if (!isFinite(result) || result > MAX_SAFE_INTEGER || result < MIN_SAFE_INTEGER) {
        const sign = (a > 0 && b > 0) || (a < 0 && b < 0) ? 1 : -1;
        return sign > 0 ? MAX_SAFE_INTEGER : MIN_SAFE_INTEGER;
    }
    
    return result;
}

/**
 * División segura
 */
function safeDivide(a, b) {
    if (!isValidNumber(a) || !isValidNumber(b)) {
        return 0;
    }
    
    // División por cero
    if (Math.abs(b) < EPSILON) {
        return a > 0 ? MAX_SAFE_INTEGER : (a < 0 ? MIN_SAFE_INTEGER : 0);
    }
    
    const result = a / b;
    
    if (!isFinite(result)) {
        const sign = (a > 0 && b > 0) || (a < 0 && b < 0) ? 1 : -1;
        return sign > 0 ? MAX_SAFE_INTEGER : MIN_SAFE_INTEGER;
    }
    
    return result;
}

/**
 * Potenciación segura
 */
function safePower(base, exponent) {
    if (!isValidNumber(base) || !isValidNumber(exponent)) {
        return 0;
    }
    
    // Casos especiales
    if (exponent === 0) return 1;
    if (base === 0) return 0;
    if (base === 1) return 1;
    if (exponent === 1) return base;
    
    // Prevenir potencias muy grandes
    if (Math.abs(exponent) > 1000) {
        return base > 1 ? MAX_SAFE_INTEGER : (base < -1 ? MIN_SAFE_INTEGER : 0);
    }
    
    try {
        const result = Math.pow(base, exponent);
        
        if (!isFinite(result) || result > MAX_SAFE_INTEGER || result < MIN_SAFE_INTEGER) {
            return result > 0 ? MAX_SAFE_INTEGER : MIN_SAFE_INTEGER;
        }
        
        return result;
    } catch (error) {
        return 0;
    }
}

/**
 * Raíz cuadrada segura
 */
function safeSqrt(value) {
    if (!isValidNumber(value)) {
        return 0;
    }
    
    if (value < 0) {
        return 0; // No soportar números complejos
    }
    
    return Math.sqrt(value);
}

/**
 * Logaritmo natural seguro
 */
function safeLog(value) {
    if (!isValidNumber(value) || value <= 0) {
        return MIN_SAFE_INTEGER;
    }
    
    const result = Math.log(value);
    return isFinite(result) ? result : MIN_SAFE_INTEGER;
}

/**
 * Logaritmo base 10 seguro
 */
function safeLog10(value) {
    if (!isValidNumber(value) || value <= 0) {
        return MIN_SAFE_INTEGER;
    }
    
    const result = Math.log10(value);
    return isFinite(result) ? result : MIN_SAFE_INTEGER;
}

/**
 * Exponencial segura
 */
function safeExp(value) {
    if (!isValidNumber(value)) {
        return 0;
    }
    
    // Prevenir exponenciales muy grandes
    if (value > 700) {
        return MAX_SAFE_INTEGER;
    }
    if (value < -700) {
        return 0;
    }
    
    const result = Math.exp(value);
    return isFinite(result) ? result : MAX_SAFE_INTEGER;
}

/**
 * Seno seguro
 */
function safeSin(value) {
    if (!isValidNumber(value)) {
        return 0;
    }
    
    return Math.sin(value);
}

/**
 * Coseno seguro
 */
function safeCos(value) {
    if (!isValidNumber(value)) {
        return 1;
    }
    
    return Math.cos(value);
}

/**
 * Tangente segura
 */
function safeTan(value) {
    if (!isValidNumber(value)) {
        return 0;
    }
    
    const result = Math.tan(value);
    
    if (!isFinite(result)) {
        // Aproximaciones para valores cerca de π/2
        const normalized = value % (Math.PI);
        if (Math.abs(normalized - Math.PI/2) < EPSILON) {
            return value > 0 ? MAX_SAFE_INTEGER : MIN_SAFE_INTEGER;
        }
    }
    
    return isFinite(result) ? result : 0;
}

/**
 * Arco tangente seguro
 */
function safeAtan(value) {
    if (!isValidNumber(value)) {
        return 0;
    }
    
    return Math.atan(value);
}

/**
 * Arco tangente de dos argumentos seguro
 */
function safeAtan2(y, x) {
    if (!isValidNumber(y) || !isValidNumber(x)) {
        return 0;
    }
    
    return Math.atan2(y, x);
}

/**
 * Valor absoluto seguro
 */
function safeAbs(value) {
    if (!isValidNumber(value)) {
        return 0;
    }
    
    const result = Math.abs(value);
    return result > MAX_SAFE_INTEGER ? MAX_SAFE_INTEGER : result;
}

/**
 * Redondeo seguro
 */
function safeRound(value, decimals = 0) {
    if (!isValidNumber(value)) {
        return 0;
    }
    
    const factor = Math.pow(10, Math.min(Math.abs(decimals), 15));
    return Math.round(value * factor) / factor;
}

/**
 * Techo seguro
 */
function safeCeil(value) {
    if (!isValidNumber(value)) {
        return 0;
    }
    
    return Math.ceil(value);
}

/**
 * Piso seguro
 */
function safeFloor(value) {
    if (!isValidNumber(value)) {
        return 0;
    }
    
    return Math.floor(value);
}

/**
 * Mínimo seguro
 */
function safeMin(...values) {
    const validValues = values.filter(isValidNumber);
    if (validValues.length === 0) return 0;
    
    return Math.min(...validValues);
}

/**
 * Máximo seguro
 */
function safeMax(...values) {
    const validValues = values.filter(isValidNumber);
    if (validValues.length === 0) return 0;
    
    return Math.max(...validValues);
}

/**
 * Clamp - limitar valor entre min y max
 */
function clamp(value, min, max) {
    if (!isValidNumber(value) || !isValidNumber(min) || !isValidNumber(max)) {
        return 0;
    }
    
    if (min > max) [min, max] = [max, min]; // Intercambiar si están al revés
    
    return value < min ? min : (value > max ? max : value);
}

/**
 * Interpolación lineal segura
 */
function lerp(a, b, t) {
    if (!isValidNumber(a) || !isValidNumber(b) || !isValidNumber(t)) {
        return 0;
    }
    
    t = clamp(t, 0, 1);
    return safeAdd(a, safeMultiply(safeSubtract(b, a), t));
}

/**
 * Normalizar valor entre 0 y 1
 */
function normalize(value, min, max) {
    if (!isValidNumber(value) || !isValidNumber(min) || !isValidNumber(max)) {
        return 0;
    }
    
    if (Math.abs(max - min) < EPSILON) {
        return 0;
    }
    
    return clamp(safeDivide(safeSubtract(value, min), safeSubtract(max, min)), 0, 1);
}

/**
 * Calcular porcentaje de cambio
 */
function percentageChange(oldValue, newValue) {
    if (!isValidNumber(oldValue) || !isValidNumber(newValue)) {
        return 0;
    }
    
    if (Math.abs(oldValue) < EPSILON) {
        return newValue > 0 ? 100 : (newValue < 0 ? -100 : 0);
    }
    
    return safeMultiply(safeDivide(safeSubtract(newValue, oldValue), Math.abs(oldValue)), 100);
}

/**
 * Verificar si dos números son aproximadamente iguales
 */
function isApproximatelyEqual(a, b, tolerance = EPSILON) {
    if (!isValidNumber(a) || !isValidNumber(b) || !isValidNumber(tolerance)) {
        return false;
    }
    
    return Math.abs(a - b) <= Math.abs(tolerance);
}

/**
 * Media aritmética segura
 */
function mean(values) {
    if (!Array.isArray(values) || values.length === 0) {
        return 0;
    }
    
    const validValues = values.filter(isValidNumber);
    if (validValues.length === 0) {
        return 0;
    }
    
    const sum = validValues.reduce((acc, val) => safeAdd(acc, val), 0);
    return safeDivide(sum, validValues.length);
}

/**
 * Desviación estándar segura
 */
function standardDeviation(values) {
    if (!Array.isArray(values) || values.length <= 1) {
        return 0;
    }
    
    const validValues = values.filter(isValidNumber);
    if (validValues.length <= 1) {
        return 0;
    }
    
    const avg = mean(validValues);
    const squaredDifferences = validValues.map(value => 
        safePower(safeSubtract(value, avg), 2)
    );
    
    const variance = safeDivide(
        squaredDifferences.reduce((acc, val) => safeAdd(acc, val), 0),
        validValues.length - 1
    );
    
    return safeSqrt(variance);
}

module.exports = {
    // Validación
    isSafeNumber,
    isValidNumber,
    isApproximatelyEqual,
    
    // Operaciones básicas
    safeAdd,
    safeSubtract,
    safeMultiply,
    safeDivide,
    safePower,
    safeSqrt,
    safeAbs,
    
    // Logaritmos y exponenciales
    safeLog,
    safeLog10,
    safeExp,
    
    // Trigonométricas
    safeSin,
    safeCos,
    safeTan,
    safeAtan,
    safeAtan2,
    
    // Redondeo
    safeRound,
    safeCeil,
    safeFloor,
    
    // Comparación
    safeMin,
    safeMax,
    clamp,
    
    // Utilidades
    lerp,
    normalize,
    percentageChange,
    mean,
    standardDeviation,
    
    // Constantes
    MAX_SAFE_INTEGER,
    MIN_SAFE_INTEGER,
    MAX_SAFE_FLOAT,
    MIN_SAFE_FLOAT,
    EPSILON
};

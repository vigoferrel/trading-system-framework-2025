/**
 * KERNEL RNG - GENERADOR DE NÚMEROS PSEUDOALEATORIOS DETERMINISTA
 * ==============================================================
 * 
 * Sistema de generación de números cuánticos determinista que reemplaza
 * completamente Math.random() en todo el sistema QBTC.
 * 
 * Características:
 * - Reproducibilidad total con semillas
 * - Distribuciones normales y exponenciales 
 * - Basado en constantes cuánticas y métricas del sistema
 * - APIs: nextFloat(), nextInt(), nextNormal(), seed()
 * - Sin dependencias de Math.random
 * 
 * Algoritmos utilizados:
 * - LCG (Linear Congruential Generator) con SplitMix64
 * - Box-Muller transform para distribución normal
 * - Inverse transform sampling para exponencial
 */

const { VALIDATION_CONSTANTS, RNG_CONFIG } = require('../constants/validation-constants');

// Constantes específicas para el Kernel RNG
const KERNEL_RNG_CONSTANTS = {
    // Constantes cuánticas base
    QUANTUM_TIME_FACTOR: Math.log(7919), // λ = ln(7919) ≈ 8.977
    RESONANCE_FACTOR: 888, // 888 MHz
    Z_COMPLEX_REAL: 9,
    Z_COMPLEX_IMAG: 16,
    
    // Parámetros LCG optimizados (Numerical Recipes)
    LCG_MULTIPLIER: 1664525,
    LCG_INCREMENT: 1013904223,
    LCG_MODULUS: Math.pow(2, 32),
    
    // Parámetros SplitMix64 para mejor distribución
    SPLITMIX_MULTIPLIER: 0x9e3779b97f4a7c15n,
    SPLITMIX_SHIFT1: 30n,
    SPLITMIX_SHIFT2: 27n,
    SPLITMIX_SHIFT3: 31n,
    
    // Constantes para distribuciones
    TWO_PI: 2.0 * Math.PI,
    EPSILON: 1e-15,
    MAX_NORMAL_ITERATIONS: 100
};

/**
 * Clase principal del Kernel RNG
 */
class KernelRNG {
    constructor(seed = null) {
        // Inicializar statistics ANTES de initializeSeeds
        this.statistics = {
            floatCalls: 0,
            intCalls: 0,
            normalCalls: 0,
            exponentialCalls: 0,
            seedChanges: 0
        };
        
        this.initializeSeeds(seed);
        this.distributionCache = {
            hasSpareNormal: false,
            spareNormal: 0.0
        };
        
        console.log(`[KERNEL RNG] Inicializado con semilla: ${this.currentSeed}`);
    }
    
    /**
     * Inicializa las semillas del generador
     * @param {number} seed - Semilla inicial (opcional)
     */
    initializeSeeds(seed = null) {
        if (seed !== null) {
            this.currentSeed = this.validateSeed(seed);
        } else {
            // Generar semilla basada en timestamp + constantes cuánticas
            const hrTime = process.hrtime.bigint();
            this.currentSeed = Number(hrTime % BigInt(Number.MAX_SAFE_INTEGER)) ^ 
                              Math.floor(KERNEL_RNG_CONSTANTS.QUANTUM_TIME_FACTOR * 1000000) ^
                              KERNEL_RNG_CONSTANTS.RESONANCE_FACTOR;
        }
        
        // Estados internos para LCG y SplitMix
        this.lcgState = this.currentSeed;
        this.splitMixState = BigInt(this.currentSeed);
        
        this.statistics.seedChanges++;
    }
    
    /**
     * Valida y normaliza una semilla
     * @param {number} seed - Semilla a validar
     * @returns {number} Semilla válida
     */
    validateSeed(seed) {
        if (!isFinite(seed)) {
            return 1;
        }
        
        const normalizedSeed = Math.abs(Math.floor(seed));
        
        if (normalizedSeed < RNG_CONFIG.MIN_RANDOM_SEED) {
            return RNG_CONFIG.MIN_RANDOM_SEED;
        }
        
        if (normalizedSeed > RNG_CONFIG.MAX_RANDOM_SEED) {
            return normalizedSeed % RNG_CONFIG.MAX_RANDOM_SEED;
        }
        
        return normalizedSeed;
    }
    
    /**
     * Genera el siguiente estado usando LCG optimizado
     * @returns {number} Nuevo estado LCG
     */
    nextLCGState() {
        this.lcgState = (
            KERNEL_RNG_CONSTANTS.LCG_MULTIPLIER * this.lcgState + 
            KERNEL_RNG_CONSTANTS.LCG_INCREMENT
        ) % KERNEL_RNG_CONSTANTS.LCG_MODULUS;
        
        return this.lcgState;
    }
    
    /**
     * Genera el siguiente estado usando SplitMix64
     * @returns {bigint} Nuevo estado SplitMix64
     */
    nextSplitMixState() {
        this.splitMixState += KERNEL_RNG_CONSTANTS.SPLITMIX_MULTIPLIER;
        
        let z = this.splitMixState;
        z = (z ^ (z >> KERNEL_RNG_CONSTANTS.SPLITMIX_SHIFT1)) * 0xbf58476d1ce4e5b9n;
        z = (z ^ (z >> KERNEL_RNG_CONSTANTS.SPLITMIX_SHIFT2)) * 0x94d049bb133111ebn;
        z = z ^ (z >> KERNEL_RNG_CONSTANTS.SPLITMIX_SHIFT3);
        
        return z;
    }
    
    /**
     * Genera un número float en el rango [0, 1)
     * @returns {number} Número pseudoaleatorio float
     */
    nextFloat() {
        this.statistics.floatCalls++;
        
        // Combinar LCG y SplitMix para mejor distribución
        const lcgValue = this.nextLCGState();
        const splitMixValue = Number(this.nextSplitMixState() & 0xffffffffn);
        
        // XOR de ambos valores para mayor aleatoriedad
        const combined = (lcgValue ^ splitMixValue) >>> 0; // Unsigned 32-bit
        
        // Normalizar a [0, 1)
        const result = combined / KERNEL_RNG_CONSTANTS.LCG_MODULUS;
        
        // Asegurar que esté en rango válido
        return Math.max(0, Math.min(0.9999999999999998, result));
    }
    
    /**
     * Genera un entero en el rango [0, max)
     * @param {number} max - Límite superior (exclusivo)
     * @returns {number} Entero pseudoaleatorio
     */
    nextInt(max = 2147483647) {
        this.statistics.intCalls++;
        
        if (!isFinite(max) || max <= 0) {
            return 0;
        }
        
        const maxInt = Math.floor(max);
        
        // Usar método de división simple con sesgo mínimo
        const randomFloat = this.nextFloat();
        const result = Math.floor(randomFloat * maxInt);
        
        return Math.max(0, Math.min(maxInt - 1, result));
    }
    
    /**
     * Genera un número con distribución normal usando Box-Muller
     * @param {number} mu - Media (por defecto 0)
     * @param {number} sigma - Desviación estándar (por defecto 1)
     * @returns {number} Número con distribución normal
     */
    nextNormal(mu = 0, sigma = 1) {
        this.statistics.normalCalls++;
        
        // Validar parámetros
        if (!isFinite(mu)) mu = 0;
        if (!isFinite(sigma) || sigma <= 0) sigma = 1;
        
        // Usar valor cached si está disponible
        if (this.distributionCache.hasSpareNormal) {
            this.distributionCache.hasSpareNormal = false;
            return this.distributionCache.spareNormal * sigma + mu;
        }
        
        // Box-Muller transform
        let u = 0, v = 0, s = 0;
        let iterations = 0;
        
        do {
            u = 2.0 * this.nextFloat() - 1.0;
            v = 2.0 * this.nextFloat() - 1.0;
            s = u * u + v * v;
            iterations++;
            
            if (iterations > KERNEL_RNG_CONSTANTS.MAX_NORMAL_ITERATIONS) {
                // Fallback para prevenir loops infinitos
                return mu;
            }
        } while (s >= 1.0 || s === 0);
        
        const multiplier = Math.sqrt(-2.0 * Math.log(s) / s);
        
        // Cachear un valor para la próxima llamada
        this.distributionCache.spareNormal = v * multiplier;
        this.distributionCache.hasSpareNormal = true;
        
        return u * multiplier * sigma + mu;
    }
    
    /**
     * Genera un número con distribución exponencial
     * @param {number} lambda - Parámetro de tasa (por defecto 1)
     * @returns {number} Número con distribución exponencial
     */
    nextExponential(lambda = 1) {
        this.statistics.exponentialCalls++;
        
        // Validar lambda
        if (!isFinite(lambda) || lambda <= 0) {
            lambda = 1;
        }
        
        // Inverse transform sampling: -ln(1-U)/λ
        const u = this.nextFloat();
        const safeU = Math.max(KERNEL_RNG_CONSTANTS.EPSILON, Math.min(1 - KERNEL_RNG_CONSTANTS.EPSILON, u));
        
        return -Math.log(1 - safeU) / lambda;
    }
    
    /**
     * Genera un boolean pseudoaleatorio
     * @param {number} probability - Probabilidad de true (0-1, por defecto 0.5)
     * @returns {boolean} Valor booleano pseudoaleatorio
     */
    nextBoolean(probability = 0.5) {
        if (!isFinite(probability)) probability = 0.5;
        probability = Math.max(0, Math.min(1, probability));
        
        return this.nextFloat() < probability;
    }
    
    /**
     * Genera una selección aleatoria de un array
     * @param {Array} array - Array del cual seleccionar
     * @returns {*} Elemento seleccionado aleatoriamente
     */
    choice(array) {
        if (!Array.isArray(array) || array.length === 0) {
            return undefined;
        }
        
        const index = this.nextInt(array.length);
        return array[index];
    }
    
    /**
     * Mezcla un array usando Fisher-Yates shuffle
     * @param {Array} array - Array a mezclar (se modifica in-place)
     * @returns {Array} Array mezclado
     */
    shuffle(array) {
        if (!Array.isArray(array)) {
            return array;
        }
        
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.nextInt(i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        
        return array;
    }
    
    /**
     * Establece una nueva semilla
     * @param {number} newSeed - Nueva semilla
     */
    seed(newSeed) {
        this.initializeSeeds(newSeed);
        
        // Limpiar cache de distribuciones
        this.distributionCache.hasSpareNormal = false;
        this.distributionCache.spareNormal = 0.0;
        
        console.log(`[KERNEL RNG] Nueva semilla establecida: ${this.currentSeed}`);
    }
    
    /**
     * Obtiene la semilla actual
     * @returns {number} Semilla actual
     */
    getSeed() {
        return this.currentSeed;
    }
    
    /**
     * Obtiene estadísticas de uso
     * @returns {object} Objeto con estadísticas de llamadas
     */
    getStatistics() {
        return {
            ...this.statistics,
            totalCalls: this.statistics.floatCalls + 
                       this.statistics.intCalls + 
                       this.statistics.normalCalls + 
                       this.statistics.exponentialCalls,
            currentSeed: this.currentSeed,
            lcgState: this.lcgState,
            splitMixState: Number(this.splitMixState & 0xffffffffn)
        };
    }
    
    /**
     * Reinicia las estadísticas
     */
    resetStatistics() {
        this.statistics = {
            floatCalls: 0,
            intCalls: 0,
            normalCalls: 0,
            exponentialCalls: 0,
            seedChanges: this.statistics.seedChanges
        };
    }
    
    /**
     * Genera múltiples números float de una vez
     * @param {number} count - Cantidad de números a generar
     * @returns {Array<number>} Array de números float
     */
    nextFloats(count) {
        if (!isFinite(count) || count <= 0) return [];
        
        const result = new Array(Math.floor(count));
        for (let i = 0; i < result.length; i++) {
            result[i] = this.nextFloat();
        }
        
        return result;
    }
    
    /**
     * Test de calidad básico del generador
     * @param {number} samples - Número de muestras para el test
     * @returns {object} Resultados del test de calidad
     */
    qualityTest(samples = 10000) {
        console.log(`[KERNEL RNG] Ejecutando test de calidad con ${samples} muestras...`);
        
        const values = this.nextFloats(samples);
        
        // Calcular estadísticas básicas
        const sum = values.reduce((acc, val) => acc + val, 0);
        const mean = sum / samples;
        
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / samples;
        const stdDev = Math.sqrt(variance);
        
        // Test de uniformidad (Chi-cuadrado simple)
        const bins = 10;
        const binCounts = new Array(bins).fill(0);
        
        values.forEach(val => {
            const bin = Math.min(bins - 1, Math.floor(val * bins));
            binCounts[bin]++;
        });
        
        const expectedPerBin = samples / bins;
        const chiSquare = binCounts.reduce((acc, count) => {
            return acc + Math.pow(count - expectedPerBin, 2) / expectedPerBin;
        }, 0);
        
        return {
            samples,
            mean: Number(mean.toFixed(6)),
            expectedMean: 0.5,
            meanError: Math.abs(mean - 0.5),
            standardDeviation: Number(stdDev.toFixed(6)),
            expectedStdDev: Number((1/Math.sqrt(12)).toFixed(6)), // Para distribución uniforme
            variance: Number(variance.toFixed(6)),
            chiSquareStatistic: Number(chiSquare.toFixed(4)),
            chiSquareDegreesOfFreedom: bins - 1,
            binCounts,
            qualityScore: this.calculateQualityScore(mean, stdDev, chiSquare, bins)
        };
    }
    
    /**
     * Calcula una puntuación de calidad del generador
     * @private
     */
    calculateQualityScore(mean, stdDev, chiSquare, bins) {
        let score = 100;
        
        // Penalizar desviación de la media esperada (0.5)
        const meanError = Math.abs(mean - 0.5);
        score -= meanError * 200; // Máximo -100 si media = 0 o 1
        
        // Penalizar desviación de la desviación estándar esperada
        const expectedStdDev = 1/Math.sqrt(12);
        const stdDevError = Math.abs(stdDev - expectedStdDev);
        score -= stdDevError * 100;
        
        // Penalizar chi-cuadrado alto (mala uniformidad)
        const expectedChiSquare = bins - 1;
        const chiSquareError = Math.abs(chiSquare - expectedChiSquare) / expectedChiSquare;
        score -= chiSquareError * 50;
        
        return Math.max(0, Math.min(100, Number(score.toFixed(2))));
    }
}

// Instancia global del Kernel RNG
const kernelRNG = new KernelRNG();

// Funciones de conveniencia que replican la API de Math.random
function random() {
    return kernelRNG.nextFloat();
}

function randomInt(max) {
    return kernelRNG.nextInt(max);
}

function randomNormal(mu = 0, sigma = 1) {
    return kernelRNG.nextNormal(mu, sigma);
}

function randomExponential(lambda = 1) {
    return kernelRNG.nextExponential(lambda);
}

function randomBoolean(probability = 0.5) {
    return kernelRNG.nextBoolean(probability);
}

function randomChoice(array) {
    return kernelRNG.choice(array);
}

function randomShuffle(array) {
    return kernelRNG.shuffle(array);
}

function setSeed(seed) {
    kernelRNG.seed(seed);
}

function getSeed() {
    return kernelRNG.getSeed();
}

function getStatistics() {
    return kernelRNG.getStatistics();
}

function qualityTest(samples = 10000) {
    return kernelRNG.qualityTest(samples);
}

module.exports = {
    // Clase principal
    KernelRNG,
    
    // Instancia global
    kernelRNG,
    
    // API de conveniencia
    random,
    randomInt,
    randomNormal,
    randomExponential,
    randomBoolean,
    randomChoice,
    randomShuffle,
    
    // Control de semillas
    setSeed,
    getSeed,
    
    // Estadísticas y testing
    getStatistics,
    qualityTest,
    
    // Constantes
    KERNEL_RNG_CONSTANTS
};

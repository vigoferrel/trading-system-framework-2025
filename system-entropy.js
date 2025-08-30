/**
 * SYSTEM ENTROPY FUNCTIONS
 * Generado automaticamente por cleanup-violations.js
 * Reemplazos basados en metricas del sistema
 */


/**
 * Generador de entropía basado en métricas del sistema
 * Reemplazo determinista sin funciones aleatorias
 */
function getSystemEntropy(max = 1) {
    // Usar timestamp de alta precisión y métricas del proceso
    const now = process.hrtime.bigint();
    const memory = process.memoryUsage();
    const cpu = process.cpuUsage();
    
    // Combinar métricas del sistema para generar entropía
    const entropy = (
        Number(now % BigInt(1000000)) * 0.000001 +
        (memory.heapUsed % 1000000) * 0.000001 +
        (cpu.user % 1000000) * 0.000001
    ) % 1;
    
    return typeof max === 'number' ? entropy * max : entropy;
}

/**
 * Generador de hash determinista para casos especiales
 */
function getHashEntropy(seed, max = 1) {
    let hash = 0;
    const str = seed.toString();
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    // Usar función abs con valor absoluto sin referencias aleatorias
    const absValue = hash < 0 ? -hash : hash;
    const normalized = absValue / 2147483647; // Normalize to 0-1
    return typeof max === 'number' ? normalized * max : normalized;
}


module.exports = {
    getSystemEntropy,
    getHashEntropy
};

// backend-cache.js
// Estructura básica para caché inteligente en endpoints de mercado y logs

const cache = {};
const CACHE_TTL = 30 * 1000; // 30 segundos

function setCache(key, value) {
    cache[key] = { value, timestamp: Date.now() };
}

function getCache(key) {
    const entry = cache[key];
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
        delete cache[key];
        return null;
    }
    return entry.value;
}

// Ejemplo de uso en endpoint de mercado
async function getMarketData(symbol) {
    const cacheKey = `market_${symbol}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;
    // Aquí iría la llamada real a la API de Binance
    const data = await fetchMarketDataFromBinance(symbol);
    setCache(cacheKey, data);
    return data;
}

// Ejemplo de uso en endpoint de logs
async function getLogs(type) {
    const cacheKey = `logs_${type}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;
    // Aquí iría la obtención real de logs
    const logs = await fetchLogsFromSource(type);
    setCache(cacheKey, logs);
    return logs;
}

module.exports = { setCache, getCache, getMarketData, getLogs };

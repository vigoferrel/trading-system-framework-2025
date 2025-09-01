

/**
 * Módulo para inicializar y gestionar la caché cuántica
 * 
 * Este módulo maneja la inicialización y población de las cachés del frontend
 * para datos cuánticos, libros de órdenes y klines.
 */

// Cachés globales
window.bookQuantumCache = window.bookQuantumCache || {};
window.klinesQuantumCache = window.klinesQuantumCache || {};

// Contadores de estadísticas de caché
let cacheStats = {
    bookHits: 0,
    bookMisses: 0,
    klinesHits: 0,
    klinesMisses: 0,
    lastCleanup: Date.now(),
    memoryUsage: 0
};

/**
 * Inicializa la caché cuántica precargando datos para símbolos clave
 */
async function initializeQuantumCache() {
    console.log('Inicializando caché cuántica...');
    
    // Símbolos principales para precarga
    const keySymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP'];
    
    // Inicializar contadores
    let loaded = 0;
    const total = keySymbols.length * 3; // Factores, orderbook y klines para cada símbolo
    
    try {
        // Precargar factores cuánticos para símbolos clave
        const factorsPromises = keySymbols.map(async (symbol) => {
            try {
                await fetchQuantumFactors(symbol);
                loaded++;
                updateCacheInitProgress(loaded, total);
            } catch (error) {
                console.warn(`Error precargando factores para ${symbol}:`, error);
            }
        });
        
        // Precargar datos de orderbook para símbolos clave
        const orderbookPromises = keySymbols.map(async (symbol) => {
            try {
                const response = await fetch(`http://localhost:4603/api/orderbook?symbol=${symbol}`);
                if (response.ok) {
                    const data = await response.json();
                    window.bookQuantumCache[symbol] = {
                        data: data,
                        timestamp: Date.now()
                    };
                    loaded++;
                    updateCacheInitProgress(loaded, total);
                }
            } catch (error) {
                console.warn(`Error precargando orderbook para ${symbol}:`, error);
            }
        });
        
        // Precargar klines para símbolos clave
        const klinesPromises = keySymbols.map(async (symbol) => {
            try {
                const response = await fetch(`http://localhost:4603/api/klines?symbol=${symbol}&interval=1h&limit=24`);
                if (response.ok) {
                    const data = await response.json();
                    window.klinesQuantumCache[symbol] = {
                        data: data,
                        timestamp: Date.now()
                    };
                    loaded++;
                    updateCacheInitProgress(loaded, total);
                }
            } catch (error) {
                console.warn(`Error precargando klines para ${symbol}:`, error);
            }
        });
        
        // Esperar a que todas las precargas terminen
        await Promise.allSettled([...factorsPromises, ...orderbookPromises, ...klinesPromises]);
        
        console.log(`Caché inicializada: ${loaded}/${total} elementos cargados`);
        
        // Configurar actualización periódica de estadísticas de caché
        setInterval(() => updateCacheStats(), 30000);
        updateCacheStats(); // Actualizar estadísticas iniciales
        
    } catch (error) {
        console.error('Error inicializando caché cuántica:', error);
    }
}

/**
 * Actualiza el progreso de inicialización de la caché
 * @param {number} loaded - Número de elementos cargados
 * @param {number} total - Número total de elementos a cargar
 */
function updateCacheInitProgress(loaded, total) {
    const percent = Math.floor((loaded / total) * 100);
    console.log(`Progreso de caché: ${percent}% (${loaded}/${total})`);
    
    // Actualizar elemento de UI si existe
    const cacheMetricsElement = document.querySelector('.cache-metrics');
    if (cacheMetricsElement) {
        cacheMetricsElement.textContent = `Caché cuántica: ${percent}% (${loaded}/${total})`;
    }
}

/**
 * Actualiza las estadísticas de caché y limpia entradas expiradas
 */
async function updateCacheStats() {
    // Contar elementos en caché
    const bookItems = Object.keys(window.bookQuantumCache).length;
    const klinesItems = Object.keys(window.klinesQuantumCache).length;
    const totalItems = bookItems + klinesItems;
    
    // Calcular uso de memoria aproximado (muy aproximado)
    let memoryUsage = 0;
    
    // Estimar tamaño de bookQuantumCache
    for (const symbol in window.bookQuantumCache) {
        const entry = window.bookQuantumCache[symbol];
        if (entry && entry.data) {
            // Estimar tamaño de datos de orderbook
            const bidsLength = entry.data.bids ? entry.data.bids.length : 0;
            const asksLength = entry.data.asks ? entry.data.asks.length : 0;
            memoryUsage += (bidsLength + asksLength) * 16; // ~16 bytes por entrada
        }
    }
    
    // Estimar tamaño de klinesQuantumCache
    for (const symbol in window.klinesQuantumCache) {
        const entry = window.klinesQuantumCache[symbol];
        if (entry && entry.data) {
            memoryUsage += entry.data.length * 80; // ~80 bytes por kline
        }
    }
    
    // Convertir a MB
    const memoryMB = (memoryUsage / (1024 * 1024)).toFixed(1);
    
    // Actualizar estadísticas
    cacheStats.memoryUsage = memoryMB;
    
    // Limpiar entradas expiradas (más de 5 minutos)
    const now = Date.now();
    let expiredCount = 0;
    
    // Limpiar bookQuantumCache
    for (const symbol in window.bookQuantumCache) {
        const entry = window.bookQuantumCache[symbol];
        if (entry && now - entry.timestamp > 300000) { // 5 minutos
            delete window.bookQuantumCache[symbol];
            expiredCount++;
        }
    }
    
    // Limpiar klinesQuantumCache
    for (const symbol in window.klinesQuantumCache) {
        const entry = window.klinesQuantumCache[symbol];
        if (entry && now - entry.timestamp > 1800000) { // 30 minutos
            delete window.klinesQuantumCache[symbol];
            expiredCount++;
        }
    }
    
    // Actualizar timestamp de última limpieza
    cacheStats.lastCleanup = now;
    
    // Actualizar elemento de UI si existe
    const cacheMetricsElement = document.querySelector('.cache-metrics');
    if (cacheMetricsElement) {
        // Obtener estadísticas reales del backend
        try {
            const response = await fetch('http://localhost:4603/api/cache/performance');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    const cacheData = data.data;
                    const totalItems = (cacheData.cache.marketData.size || 0) + 
                                     (cacheData.cache.klines.size || 0) + 
                                     (cacheData.cache.orderbook.size || 0) + 
                                     (cacheData.cache.quantumFactors.size || 0);
                    const totalHits = cacheData.stats.hits || 0;
                    const totalMisses = cacheData.stats.misses || 0;
                    const totalRequests = totalHits + totalMisses;
                    const hitRate = totalRequests > 0 ? Math.round((totalHits / totalRequests) * 100) : 0;
                    cacheMetricsElement.textContent = `Cache: ${totalItems} items, ${totalHits}/${totalRequests} hits (${hitRate}%), Mem: ${memoryMB}MB`;
                }
            }
        } catch (error) {
            // Fallback con estadísticas locales
            const totalHits = cacheStats.bookHits + cacheStats.klinesHits;
            const totalMisses = cacheStats.bookMisses + cacheStats.klinesMisses;
            const totalRequests = totalHits + totalMisses;
            const hitRate = totalRequests > 0 ? Math.round((totalHits / totalRequests) * 100) : 0;
            cacheMetricsElement.textContent = `Cache: ${totalItems} items, ${totalHits}/${totalRequests} hits (${hitRate}%), Mem: ${memoryMB}MB`;
        }
    }
    
    console.log(`Cache cleanup: ${expiredCount} entradas expiradas eliminadas. Tamaño actual: ${totalItems}`);
}

/**
 * Obtiene datos de la caché o de la API si no están disponibles
 * @param {string} type - Tipo de datos ('book' o 'klines')
 * @param {string} symbol - Símbolo para el que obtener datos
 * @param {Object} options - Opciones adicionales (interval, limit para klines)
 * @returns {Promise<Object>} - Los datos solicitados
 */
async function getCachedData(type, symbol, options = {}) {
    // Determinar qué caché usar
    const cache = type === 'book' ? window.bookQuantumCache : window.klinesQuantumCache;
    
    // Verificar si tenemos datos en caché y no han expirado
    if (cache[symbol] && Date.now() - cache[symbol].timestamp < (type === 'book' ? 30000 : 300000)) {
        // Incrementar contador de hits
        if (type === 'book') {
            cacheStats.bookHits++;
        } else {
            cacheStats.klinesHits++;
        }
        return cache[symbol].data;
    }
    
    // Incrementar contador de misses
    if (type === 'book') {
        cacheStats.bookMisses++;
    } else {
        cacheStats.klinesMisses++;
    }
    
    // Construir URL para la API
            let url = `http://localhost:4603/api/${type === 'book' ? 'orderbook' : 'klines'}?symbol=${symbol}`;
    
    // Añadir parámetros adicionales para klines
    if (type === 'klines') {
        url += `&interval=${options.interval || '1h'}&limit=${options.limit || 24}`;
    }
    
    try {
        // Obtener datos de la API
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            
            // Guardar en caché
            cache[symbol] = {
                data: data,
                timestamp: Date.now()
            };
            
            return data;
        }
        throw new Error(`Error en respuesta: ${response.status}`);
    } catch (error) {
        console.error(`Error obteniendo ${type} para ${symbol}:`, error);
        
        // Devolver datos en caché aunque estén expirados, si existen
        if (cache[symbol]) {
            console.warn(`Usando datos expirados de ${type} para ${symbol}`);
            return cache[symbol].data;
        }
        
        // Devolver estructura vacía como último recurso
        return type === 'book' ? { bids: [], asks: [] } : [];
    }
}

/**
 * Obtiene factores cuánticos para un símbolo específico
 * @param {string} symbol - Símbolo para el que obtener factores cuánticos
 * @returns {Promise<Object>} - Los factores cuánticos
 */
async function fetchQuantumFactors(symbol) {
    try {
        const response = await fetch(`http://localhost:4603/api/quantum-factors?symbol=${symbol}`);
        if (response.ok) {
            const data = await response.json();
            // Guardar en caché global para uso posterior
            if (!window.quantumFactorsCache) {
                window.quantumFactorsCache = {};
            }
            window.quantumFactorsCache[symbol] = {
                data: data,
                timestamp: Date.now()
            };
            return data;
        }
        throw new Error(`Error en respuesta: ${response.status}`);
    } catch (error) {
        console.error(`Error obteniendo factores cuánticos para ${symbol}:`, error);
        return null;
    }
}

// Exportar funciones para uso global
window.initializeQuantumCache = initializeQuantumCache;
window.getCachedData = getCachedData;
window.updateCacheStats = updateCacheStats;
window.fetchQuantumFactors = fetchQuantumFactors;
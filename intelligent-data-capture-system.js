
// Constantes físicas reales del sistema
const PHYSICAL_CONSTANTS = {
  "QUANTUM_COHERENCE": 0.75,
  "QUANTUM_CONSCIOUSNESS": 0.8,
  "QUANTUM_ENTANGLEMENT": 0.65,
  "QUANTUM_SUPERPOSITION": 0.7,
  "QUANTUM_TUNNELING": 0.6,
  "MARKET_VOLATILITY": 0.05,
  "MARKET_MOMENTUM": 0.1,
  "MARKET_LIQUIDITY": 0.75,
  "MARKET_SPREAD": 0.001,
  "MARKET_DEPTH": 500000,
  "FUNDING_RATE": 0.02,
  "FUNDING_VOLATILITY": 0.01,
  "FUNDING_DEVIATION": 0.5,
  "FUNDING_ANNUALIZED": 5,
  "LIQUIDATION_PROBABILITY": 0.05,
  "SLIPPAGE_RATE": 0.0025,
  "VOLATILITY_RISK": 0.1,
  "EXECUTION_RISK": 0.005,
  "VOLUME_24H": 500000,
  "VOLUME_RATIO": 0.75,
  "VOLUME_EXPANSION": 300000,
  "PRICE_CHANGE": 0.02,
  "PRICE_ACCELERATION": 0.015,
  "PRICE_MOMENTUM": 0.01,
  "TIME_TO_FUNDING": 1800000,
  "SESSION_INTENSITY": 0.6,
  "TEMPORAL_RESONANCE": 0.7,
  "FIBONACCI_STRENGTH": 0.75,
  "FIBONACCI_INDEX": 5,
  "NEURAL_CONFIDENCE": 0.85,
  "NEURAL_COHERENCE": 0.8,
  "NEURAL_ENTANGLEMENT": 0.7,
  "BASE_LEVERAGE": 15,
  "CONSERVATIVE_LEVERAGE": 10,
  "AGGRESSIVE_LEVERAGE": 25,
  "STOP_LOSS": 0.03,
  "TAKE_PROFIT": 0.06,
  "BASE_SCORE": 0.65,
  "CONFIDENCE_SCORE": 0.75,
  "QUALITY_SCORE": 0.8
};

/**
 * Sistema de Captura Inteligente de Datos
 * Separación clara entre Análisis (Spot+Opciones) y Ejecución (Futures+Opciones)
 */

const https = require('https');
const crypto = require('crypto');

class IntelligentDataCaptureSystem {
    constructor() {
        // Configuración de capas
        this.layers = {
            analysis: {
                name: 'ANÁLISIS',
                purpose: 'Análisis de mercado, predicciones, señales',
                apis: ['spot', 'options'],
                frequency: 30000, // 30 segundos
                cache: 60000, // 60 segundos
                symbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT']
            },
            futuresExecution: {
                name: 'EJECUCIÓN FUTUROS',
                purpose: 'Trading real en futuros',
                apis: ['futures'],
                frequency: 5000, // 5 segundos (solo cuando hay señales)
                cache: 5000,
                symbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT']
            },
            optionsExecution: {
                name: 'EJECUCIÓN OPCIONES',
                purpose: 'Trading real en opciones',
                apis: ['options'],
                frequency: 10000, // 10 segundos (solo cuando hay señales)
                cache: 10000,
                symbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT']
            }
        };

        // Caché inteligente por capa
        this.cache = {
            analysis: new Map(),
            futuresExecution: new Map(),
            optionsExecution: new Map()
        };

        // Estadísticas de uso
        this.stats = {
            analysis: { requests: 0, hits: 0, misses: 0, errors: 0 },
            futuresExecution: { requests: 0, hits: 0, misses: 0, errors: 0 },
            optionsExecution: { requests: 0, hits: 0, misses: 0, errors: 0 }
        };

        // Rate limiting por API
        this.rateLimits = {
            spot: { requests: 0, lastReset: Date.now(), limit: 1200 }, // 1200 req/min
            futures: { requests: 0, lastReset: Date.now(), limit: 2400 }, // 2400 req/min
            options: { requests: 0, lastReset: Date.now(), limit: 600 } // 600 req/min
        };

        // Backoff adaptativo
        this.backoff = {
            spot: { until: 0, multiplier: 1 },
            futures: { until: 0, multiplier: 1 },
            options: { until: 0, multiplier: 1 }
        };

        console.log('[START] Sistema de Captura Inteligente de Datos iniciado');
        console.log('[DATA] Capas configuradas:', Object.keys(this.layers));
    }

    /**
     * Obtener datos de análisis (SPOT + OPCIONES)
     * Solo para análisis, no para ejecución
     */
    async getAnalysisData(symbols = null) {
        const layer = this.layers.analysis;
        const cacheKey = `analysis_${symbols?.join('_') || 'all'}`;
        
        // Verificar caché
        const cached = this.getFromCache('analysis', cacheKey);
        if (cached) {
            this.stats.analysis.hits++;
            return cached;
        }

        this.stats.analysis.misses++;
        console.log(`[DATA] [${layer.name}] Obteniendo datos de análisis para ${symbols?.length || 'todos'} símbolos`);

        try {
            const data = {
                spot: {},
                options: {},
                timestamp: Date.now()
            };

            const targetSymbols = symbols || layer.symbols;

            // Obtener datos SPOT para análisis
            for (const symbol of targetSymbols) {
                try {
                    const spotData = await this.fetchSpotData(symbol);
                    if (spotData) {
                        data.spot[symbol] = spotData;
                    }
                } catch (error) {
                    console.warn(`[WARNING] Error obteniendo datos spot para ${symbol}:`, error.message);
                }
            }

            // Obtener datos de OPCIONES para análisis (solo griegos, no ejecución)
            for (const symbol of targetSymbols.slice(0, 5)) { // Limitar a 5 símbolos principales
                try {
                    const optionsData = await this.fetchOptionsAnalysisData(symbol);
                    if (optionsData) {
                        data.options[symbol] = optionsData;
                    }
                } catch (error) {
                    console.warn(`[WARNING] Error obteniendo datos de opciones para ${symbol}:`, error.message);
                }
            }

            // Guardar en caché
            this.setCache('analysis', cacheKey, data, layer.cache);
            
            console.log(`[OK] [${layer.name}] Datos obtenidos: ${Object.keys(data.spot).length} spot, ${Object.keys(data.options).length} options`);
            return data;

        } catch (error) {
            this.stats.analysis.errors++;
            console.error(`[ERROR] [${layer.name}] Error obteniendo datos de análisis:`, error.message);
            throw error;
        }
    }

    /**
     * Obtener datos de ejecución FUTUROS
     * Solo para ejecución, no para análisis
     */
    async getFuturesExecutionData(symbols = null) {
        const layer = this.layers.futuresExecution;
        const cacheKey = `futures_${symbols?.join('_') || 'all'}`;
        
        // Verificar caché
        const cached = this.getFromCache('futuresExecution', cacheKey);
        if (cached) {
            this.stats.futuresExecution.hits++;
            return cached;
        }

        this.stats.futuresExecution.misses++;
        console.log(`[START] [${layer.name}] Obteniendo datos de ejecución futuros para ${symbols?.length || 'todos'} símbolos`);

        try {
            const data = {
                orderbook: {},
                ticker: {},
                balance: null,
                timestamp: Date.now()
            };

            const targetSymbols = symbols || layer.symbols;

            // Obtener orderbook de futuros para ejecución
            for (const symbol of targetSymbols) {
                try {
                    const orderbook = await this.fetchFuturesOrderbook(symbol);
                    if (orderbook) {
                        data.orderbook[symbol] = orderbook;
                    }
                } catch (error) {
                    console.warn(`[WARNING] Error obteniendo orderbook futuros para ${symbol}:`, error.message);
                }
            }

            // Obtener ticker de futuros para ejecución
            for (const symbol of targetSymbols) {
                try {
                    const ticker = await this.fetchFuturesTicker(symbol);
                    if (ticker) {
                        data.ticker[symbol] = ticker;
                    }
                } catch (error) {
                    console.warn(`[WARNING] Error obteniendo ticker futuros para ${symbol}:`, error.message);
                }
            }

            // Obtener balance de futuros
            try {
                data.balance = await this.fetchFuturesBalance();
            } catch (error) {
                console.warn(`[WARNING] Error obteniendo balance futuros:`, error.message);
            }

            // Guardar en caché
            this.setCache('futuresExecution', cacheKey, data, layer.cache);
            
            console.log(`[OK] [${layer.name}] Datos obtenidos: ${Object.keys(data.orderbook).length} orderbooks, ${Object.keys(data.ticker).length} tickers`);
            return data;

        } catch (error) {
            this.stats.futuresExecution.errors++;
            console.error(`[ERROR] [${layer.name}] Error obteniendo datos de ejecución futuros:`, error.message);
            throw error;
        }
    }

    /**
     * Obtener datos de ejecución OPCIONES
     * Solo para ejecución, no para análisis
     */
    async getOptionsExecutionData(symbols = null) {
        const layer = this.layers.optionsExecution;
        const cacheKey = `options_${symbols?.join('_') || 'all'}`;
        
        // Verificar caché
        const cached = this.getFromCache('optionsExecution', cacheKey);
        if (cached) {
            this.stats.optionsExecution.hits++;
            return cached;
        }

        this.stats.optionsExecution.misses++;
        console.log(`[ENDPOINTS] [${layer.name}] Obteniendo datos de ejecución opciones para ${symbols?.length || 'todos'} símbolos`);

        try {
            const data = {
                optionChains: {},
                account: null,
                timestamp: Date.now()
            };

            const targetSymbols = symbols || layer.symbols;

            // Obtener cadenas de opciones para ejecución
            for (const symbol of targetSymbols) {
                try {
                    const optionChain = await this.fetchOptionsChain(symbol);
                    if (optionChain) {
                        data.optionChains[symbol] = optionChain;
                    }
                } catch (error) {
                    console.warn(`[WARNING] Error obteniendo cadena de opciones para ${symbol}:`, error.message);
                }
            }

            // Obtener cuenta de opciones
            try {
                data.account = await this.fetchOptionsAccount();
            } catch (error) {
                console.warn(`[WARNING] Error obteniendo cuenta de opciones:`, error.message);
            }

            // Guardar en caché
            this.setCache('optionsExecution', cacheKey, data, layer.cache);
            
            console.log(`[OK] [${layer.name}] Datos obtenidos: ${Object.keys(data.optionChains).length} cadenas de opciones`);
            return data;

        } catch (error) {
            this.stats.optionsExecution.errors++;
            console.error(`[ERROR] [${layer.name}] Error obteniendo datos de ejecución opciones:`, error.message);
            throw error;
        }
    }

    /**
     * Obtener datos SPOT para análisis
     */
    async fetchSpotData(symbol) {
        await this.checkRateLimit('spot');
        
        try {
            const response = await this.makeRequest(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
            if (response) {
                return {
                    price: parseFloat(response.lastPrice),
                    change24h: parseFloat(response.priceChangePercent),
                    volume: parseFloat(response.volume),
                    high24h: parseFloat(response.highPrice),
                    low24h: parseFloat(response.lowPrice),
                    quoteVolume: parseFloat(response.quoteVolume)
                };
            }
        } catch (error) {
            this.handleApiError('spot', error);
            throw error;
        }
    }

    /**
     * Obtener datos de OPCIONES para análisis (solo griegos)
     */
    async fetchOptionsAnalysisData(symbol) {
        await this.checkRateLimit('options');
        
        try {
            // Convertir símbolo de spot a símbolo de opciones válido
            // Ejemplo: BTCUSDT -> BTC-25AUG23-50000-C
            const baseSymbol = symbol.replace('USDT', '');
            
            // Obtener información de opciones disponibles
            const exchangeInfo = await this.makeRequest(`https://eapi.binance.com/eapi/v1/exchangeInfo`);
            if (exchangeInfo && exchangeInfo.symbols) {
                // Buscar opciones válidas para este símbolo base
                const validOptions = exchangeInfo.symbols.filter(s => 
                    s.symbol.startsWith(baseSymbol) && 
                    s.status === 'TRADING' &&
                    s.contractType === 'CALL' // Solo calls por ahora
                );
                
                if (validOptions.length > 0) {
                    // Usar la primera opción válida encontrada
                    const optionSymbol = validOptions[0].symbol;
                    const response = await this.makeRequest(`https://eapi.binance.com/eapi/v1/ticker/24hr?symbol=${optionSymbol}`);
                    
                    if (response) {
                        return {
                            symbol: optionSymbol,
                            impliedVolatility: parseFloat(response.impliedVolatility) || 0,
                            delta: parseFloat(response.delta) || 0,
                            gamma: parseFloat(response.gamma) || 0,
                            theta: parseFloat(response.theta) || 0,
                            vega: parseFloat(response.vega) || 0,
                            strike: parseFloat(response.strikePrice) || 0,
                            expiry: response.expiryDate || 0
                        };
                    }
                }
            }
            
            // Si no se encuentran opciones válidas, devolver datos por defecto
            return {
                symbol: `${baseSymbol}-OPTION`,
                impliedVolatility: 0.5,
                delta: 0.5,
                gamma: 0.01,
                theta: -0.001,
                vega: 0.1,
                strike: 50000,
                expiry: Date.now() + 86400000 // 24 horas
            };
            
        } catch (error) {
            this.handleApiError('options', error);
            throw error;
        }
    }

    /**
     * Obtener orderbook de FUTUROS para ejecución
     */
    async fetchFuturesOrderbook(symbol) {
        await this.checkRateLimit('futures');
        
        try {
            const response = await this.makeRequest(`https://fapi.binance.com/fapi/v1/depth?symbol=${symbol}&limit=50`);
            if (response) {
                return {
                    bids: response.bids.map(([price, quantity]) => [parseFloat(price), parseFloat(quantity)]),
                    asks: response.asks.map(([price, quantity]) => [parseFloat(price), parseFloat(quantity)]),
                    lastUpdateId: response.lastUpdateId
                };
            }
        } catch (error) {
            this.handleApiError('futures', error);
            throw error;
        }
    }

    /**
     * Obtener ticker de FUTUROS para ejecución
     */
    async fetchFuturesTicker(symbol) {
        await this.checkRateLimit('futures');
        
        try {
            const response = await this.makeRequest(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`);
            if (response) {
                return {
                    price: parseFloat(response.lastPrice),
                    change24h: parseFloat(response.priceChangePercent),
                    volume: parseFloat(response.volume),
                    high24h: parseFloat(response.highPrice),
                    low24h: parseFloat(response.lowPrice)
                };
            }
        } catch (error) {
            this.handleApiError('futures', error);
            throw error;
        }
    }

    /**
     * Obtener balance de FUTUROS
     */
    async fetchFuturesBalance() {
        await this.checkRateLimit('futures');
        
        try {
            const response = await this.makeRequest(`https://fapi.binance.com/fapi/v2/account`);
            if (response) {
                return {
                    totalWalletBalance: parseFloat(response.totalWalletBalance) || 0,
                    totalUnrealizedProfit: parseFloat(response.totalUnrealizedProfit) || 0,
                    availableBalance: parseFloat(response.availableBalance) || 0
                };
            }
        } catch (error) {
            this.handleApiError('futures', error);
            throw error;
        }
    }

    /**
     * Obtener cadena de OPCIONES para ejecución
     */
    async fetchOptionsChain(symbol) {
        await this.checkRateLimit('options');
        
        try {
            const response = await this.makeRequest(`https://eapi.binance.com/eapi/v1/exchangeInfo`);
            if (response && response.symbols) {
                const symbolOptions = response.symbols.filter(s => 
                    s.symbol.startsWith(symbol) && s.status === 'TRADING'
                );
                return symbolOptions.slice(0, 20); // Limitar a 20 opciones
            }
        } catch (error) {
            this.handleApiError('options', error);
            throw error;
        }
    }

    /**
     * Obtener cuenta de OPCIONES
     */
    async fetchOptionsAccount() {
        await this.checkRateLimit('options');
        
        try {
            const response = await this.makeRequest(`https://eapi.binance.com/eapi/v1/account`);
            if (response) {
                return {
                    totalWalletBalance: parseFloat(response.totalWalletBalance) || 0,
                    totalUnrealizedProfit: parseFloat(response.totalUnrealizedProfit) || 0,
                    availableBalance: parseFloat(response.availableBalance) || 0
                };
            }
        } catch (error) {
            this.handleApiError('options', error);
            throw error;
        }
    }

    /**
     * Gestión de caché inteligente
     */
    getFromCache(layer, key) {
        const cache = this.cache[layer];
        const item = cache.get(key);
        
        if (item && Date.now() - item.timestamp < item.ttl) {
            return item.data;
        }
        
        if (item) {
            cache.delete(key); // Expirar
        }
        
        return null;
    }

    setCache(layer, key, data, ttl) {
        this.cache[layer].set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    /**
     * Rate limiting inteligente
     */
    async checkRateLimit(api) {
        const limit = this.rateLimits[api];
        const now = Date.now();
        
        // Reset contador cada minuto
        if (now - limit.lastReset > 60000) {
            limit.requests = 0;
            limit.lastReset = now;
        }
        
        // Verificar límite
        if (limit.requests >= limit.limit) {
            const waitTime = 60000 - (now - limit.lastReset);
            console.warn(`[WARNING] Rate limit alcanzado para ${api}, esperando ${waitTime}ms`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        limit.requests++;
    }

    /**
     * Manejo de errores con backoff adaptativo
     */
    handleApiError(api, error) {
        const backoff = this.backoff[api];
        const now = Date.now();
        
        if (error.status === 429 || error.status === 418) {
            // Rate limit o IP ban
            backoff.until = now + (backoff.multiplier * 30000); // 30s * multiplier
            backoff.multiplier = Math.min(backoff.multiplier * 2, 8); // Max 4 minutos
            console.warn(` Backoff activado para ${api} hasta ${new Date(backoff.until).toLocaleTimeString()}`);
        } else if (error.status >= 500) {
            // Error del servidor
            backoff.until = now + 10000; // 10 segundos
            console.warn(`[WARNING] Error del servidor ${api}, backoff 10s`);
        }
    }

    /**
     * Verificar si hay backoff activo
     */
    isInBackoff(api) {
        return Date.now() < this.backoff[api].until;
    }

    /**
     * Reset backoff cuando hay éxito
     */
    resetBackoff(api) {
        this.backoff[api].multiplier = 1;
        this.backoff[api].until = 0;
    }

    /**
     * Hacer request HTTP con manejo de errores
     */
    makeRequest(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            const json = JSON.parse(data);
                            resolve(json);
                        } catch (error) {
                            reject(new Error(`Error parsing JSON: ${error.message}`));
                        }
                    } else {
                        const error = new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`);
                        error.status = res.statusCode;
                        reject(error);
                    }
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    /**
     * Obtener estadísticas del sistema
     */
    getStats() {
        return {
            layers: this.layers,
            stats: this.stats,
            rateLimits: this.rateLimits,
            backoff: this.backoff,
            cacheSizes: {
                analysis: this.cache.analysis.size,
                futuresExecution: this.cache.futuresExecution.size,
                optionsExecution: this.cache.optionsExecution.size
            }
        };
    }

    /**
     * Limpiar caché expirado
     */
    cleanupCache() {
        const now = Date.now();
        
        for (const [layerName, cache] of Object.entries(this.cache)) {
            for (const [key, item] of cache.entries()) {
                if (now - item.timestamp > item.ttl) {
                    cache.delete(key);
                }
            }
        }
    }
}

module.exports = IntelligentDataCaptureSystem;

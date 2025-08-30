/**
 * 🚀 CORE OPTIMAL ANTI-418 TRADING SYSTEM
 * ======================================
 * 
 * Sistema óptimo que combina:
 * - Entropía basada en kernel del sistema (system-entropy.js)
 * - Circuit breakers avanzados
 * - Rate limiting ultra-conservador
 * - Simulación de comportamiento humano
 * - Cache persistente multi-nivel
 * - Integración con sistemas neuronales existentes
 * 
 * Diseñado para eliminar completamente los errores 418 de Binance
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Importar sistemas existentes
const { LeverageOptimizerV2 } = require('./LEVERAGE_OPTIMIZER_V2');
const { QuantumStateRebalancer } = require('./QUANTUM_REBALANCER');
const { LLMNeuralOrchestrator } = require('./llm-neural-orchestrator');
const { getSystemEntropy, getHashEntropy } = require('./system-entropy');

const app = express();
const PORT = 4602;

// Configuración CORS y middlewares
app.use(cors());
app.use(express.json());

// 🎲 SISTEMA DE ENTROPÍA BASADO EN KERNEL
class OptimalEntropyEngine {
    constructor() {
        this.entropyPool = [];
        this.poolIndex = 0;
        this.poolSize = 100;
        this.lastRefresh = 0;
        this.refreshInterval = 60000; // 1 minuto
        
        this.refreshEntropyPool();
        console.log('🎲 [ENTROPY ENGINE] Inicializado con entropía del kernel');
    }
    
    refreshEntropyPool() {
        this.entropyPool = [];
        for (let i = 0; i < this.poolSize; i++) {
            // Usar system-entropy.js que ya está implementado
            const entropy = getSystemEntropy(1);
            this.entropyPool.push(entropy);
        }
        this.poolIndex = 0;
        this.lastRefresh = Date.now();
    }
    
    getEntropy(max = 1) {
        // Refrescar pool si es necesario
        if (Date.now() - this.lastRefresh > this.refreshInterval || this.poolIndex >= this.poolSize) {
            this.refreshEntropyPool();
        }
        
        const entropy = this.entropyPool[this.poolIndex++];
        return typeof max === 'number' ? entropy * max : entropy;
    }
    
    // Generar delay humano usando entropía del sistema
    generateHumanDelay(minMs = 5000, maxMs = 15000) {
        const entropy = this.getEntropy();
        const range = maxMs - minMs;
        
        // Aplicar distribución sesgada hacia valores menores (más humano)
        const skewed = Math.pow(entropy, 2); // Sesgo hacia valores más bajos
        return Math.floor(minMs + (skewed * range));
    }
    
    // Simular decisión humana
    humanDecision(probability = 0.5) {
        return this.getEntropy() < probability;
    }
    
    // Selección aleatoria de array
    chooseRandom(array) {
        if (!Array.isArray(array) || array.length === 0) return null;
        const index = Math.floor(this.getEntropy() * array.length);
        return array[index];
    }
}

// 🛡️ SISTEMA CIRCUIT BREAKER AVANZADO
class AdvancedCircuitBreaker {
    constructor() {
        this.breakers = {
            spot: {
                failures: 0,
                lastFailure: 0,
                isOpen: false,
                threshold: 3,
                timeout: 120000,    // 2 minutos inicial
                maxTimeout: 600000, // 10 minutos máximo
                successCount: 0
            },
            futures: {
                failures: 0,
                lastFailure: 0,
                isOpen: false,
                threshold: 3,
                timeout: 120000,
                maxTimeout: 600000,
                successCount: 0
            },
            liquidity: {
                failures: 0,
                lastFailure: 0,
                isOpen: false,
                threshold: 5,
                timeout: 180000,    // 3 minutos inicial
                maxTimeout: 900000, // 15 minutos máximo
                successCount: 0
            }
        };
        
        console.log('🛡️ [CIRCUIT BREAKER] Sistema avanzado inicializado');
    }
    
    canExecute(type) {
        const breaker = this.breakers[type];
        if (!breaker) return true;
        
        const now = Date.now();
        
        // Si el circuito está cerrado, permitir ejecución
        if (!breaker.isOpen) return true;
        
        // Verificar si ha pasado el timeout
        if (now - breaker.lastFailure > breaker.timeout) {
            breaker.isOpen = false;
            breaker.failures = Math.max(0, breaker.failures - 1); // Reducir gradualmente
            console.log(`🔄 [CIRCUIT BREAKER] ${type} - Circuito CERRADO después de timeout`);
            return true;
        }
        
        console.log(`⛔ [CIRCUIT BREAKER] ${type} - Circuito ABIERTO (${Math.floor((breaker.timeout - (now - breaker.lastFailure)) / 1000)}s restantes)`);
        return false;
    }
    
    recordSuccess(type) {
        const breaker = this.breakers[type];
        if (!breaker) return;
        
        breaker.successCount++;
        
        // Reducir failures gradualmente con éxitos
        if (breaker.successCount >= 3 && breaker.failures > 0) {
            breaker.failures--;
            breaker.successCount = 0;
            console.log(`✅ [CIRCUIT BREAKER] ${type} - Failure count reducido a ${breaker.failures}`);
        }
        
        // Resetear timeout a valor base después de varios éxitos
        if (breaker.successCount >= 5) {
            breaker.timeout = Math.max(breaker.timeout * 0.8, 120000);
            breaker.successCount = 0;
        }
    }
    
    recordFailure(type, error) {
        const breaker = this.breakers[type];
        if (!breaker) return;
        
        breaker.failures++;
        breaker.lastFailure = Date.now();
        breaker.successCount = 0; // Reset success count
        
        const statusCode = error.response?.status;
        
        // Aumentar timeout según el tipo de error
        if (statusCode === 418) {
            // Error 418 - máximo castigo
            breaker.timeout = Math.min(breaker.timeout * 3, breaker.maxTimeout);
            console.log(`🚨 [CIRCUIT BREAKER] ${type} - Error 418 detectado, timeout: ${breaker.timeout/1000}s`);
        } else if (statusCode === 429 || statusCode === 403) {
            // Rate limiting
            breaker.timeout = Math.min(breaker.timeout * 2, breaker.maxTimeout);
            console.log(`⏰ [CIRCUIT BREAKER] ${type} - Rate limit detectado, timeout: ${breaker.timeout/1000}s`);
        } else {
            // Otros errores
            breaker.timeout = Math.min(breaker.timeout * 1.5, breaker.maxTimeout);
        }
        
        // Abrir circuito si se alcanza el threshold
        if (breaker.failures >= breaker.threshold) {
            breaker.isOpen = true;
            console.log(`🔴 [CIRCUIT BREAKER] ${type} - Circuito ABIERTO (${breaker.failures} fallas)`);
        }
    }
    
    getStatus() {
        return Object.keys(this.breakers).reduce((status, type) => {
            const breaker = this.breakers[type];
            status[type] = {
                isOpen: breaker.isOpen,
                failures: breaker.failures,
                timeout: breaker.timeout,
                timeLeft: breaker.isOpen ? Math.max(0, breaker.timeout - (Date.now() - breaker.lastFailure)) : 0
            };
            return status;
        }, {});
    }
}

// 🕰️ RATE LIMITER ULTRA-CONSERVADOR CON SIMULACIÓN HUMANA
class HumanBehaviorRateLimiter {
    constructor(entropyEngine) {
        this.entropyEngine = entropyEngine;
        this.requestQueue = [];
        this.processing = false;
        this.lastRequestTime = 0;
        this.requestCount = 0;
        this.sessionStart = Date.now();
        this.humanState = {
            fatigue: 0,
            lastBreak: Date.now(),
            totalRequests: 0,
            avgResponseTime: 2000,
            isResting: false
        };
        
        // Configuración ultra-conservadora
        this.config = {
            minDelay: 5000,     // 5 segundos mínimo
            maxDelay: 15000,    // 15 segundos máximo
            maxRequestsPerMinute: 10,
            breakProbability: 0.15,  // 15% probabilidad de tomar descanso
            breakDuration: { min: 30000, max: 120000 }, // 30s - 2min
            fatigueThreshold: 0.7
        };
        
        console.log('🕰️ [RATE LIMITER] Sistema ultra-conservador con simulación humana inicializado');
    }
    
    async queueRequest(requestFunction, priority = 1, type = 'unknown') {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                requestFunction,
                priority,
                type,
                resolve,
                reject,
                timestamp: Date.now()
            });
            
            this.processQueue();
        });
    }
    
    async processQueue() {
        if (this.processing || this.requestQueue.length === 0) return;
        
        this.processing = true;
        
        try {
            while (this.requestQueue.length > 0) {
                // Verificar si necesitamos descanso
                await this.checkAndTakeBreak();
                
                // Ordenar por prioridad
                this.requestQueue.sort((a, b) => b.priority - a.priority);
                
                const request = this.requestQueue.shift();
                
                // Aplicar delay humano
                await this.applyHumanDelay(request.type);
                
                try {
                    const result = await request.requestFunction();
                    this.updateHumanState(true);
                    request.resolve(result);
                } catch (error) {
                    this.updateHumanState(false);
                    request.reject(error);
                }
            }
        } finally {
            this.processing = false;
        }
    }
    
    async applyHumanDelay(type) {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        // Calcular delay base
        let baseDelay = this.entropyEngine.generateHumanDelay(
            this.config.minDelay, 
            this.config.maxDelay
        );
        
        // Aplicar factor de fatiga
        const fatigueMultiplier = 1 + (this.humanState.fatigue * 0.5);
        baseDelay *= fatigueMultiplier;
        
        // Verificar rate limiting por minuto
        const requestsLastMinute = this.getRequestsInLastMinute();
        if (requestsLastMinute >= this.config.maxRequestsPerMinute) {
            const extraDelay = this.entropyEngine.generateHumanDelay(10000, 30000);
            baseDelay += extraDelay;
            console.log(`⏰ [RATE LIMITER] Rate limit alcanzado, delay extra: ${extraDelay}ms`);
        }
        
        // Asegurar delay mínimo desde última request
        const requiredDelay = Math.max(baseDelay, this.config.minDelay - timeSinceLastRequest);
        
        if (requiredDelay > 0) {
            console.log(`🕰️ [RATE LIMITER] Delay humano para ${type}: ${requiredDelay}ms`);
            await new Promise(resolve => setTimeout(resolve, requiredDelay));
        }
        
        this.lastRequestTime = Date.now();
        this.requestCount++;
        this.humanState.totalRequests++;
    }
    
    async checkAndTakeBreak() {
        const now = Date.now();
        const timeSinceLastBreak = now - this.humanState.lastBreak;
        const sessionTime = now - this.sessionStart;
        
        // Aumentar fatiga con el tiempo
        this.humanState.fatigue = Math.min(1, sessionTime / (60 * 60 * 1000)); // Fatiga máxima en 1 hora
        
        // Decidir si tomar descanso
        const shouldBreak = (
            this.entropyEngine.humanDecision(this.config.breakProbability) ||
            this.humanState.fatigue > this.config.fatigueThreshold ||
            timeSinceLastBreak > 300000 // 5 minutos sin descanso
        ) && !this.humanState.isResting;
        
        if (shouldBreak) {
            this.humanState.isResting = true;
            const breakTime = this.entropyEngine.generateHumanDelay(
                this.config.breakDuration.min,
                this.config.breakDuration.max
            );
            
            console.log(`😴 [RATE LIMITER] Tomando descanso humano: ${Math.floor(breakTime/1000)}s`);
            await new Promise(resolve => setTimeout(resolve, breakTime));
            
            this.humanState.lastBreak = Date.now();
            this.humanState.fatigue = Math.max(0, this.humanState.fatigue - 0.3); // Reducir fatiga
            this.humanState.isResting = false;
        }
    }
    
    updateHumanState(success) {
        if (success) {
            // Ajustar tiempo de respuesta promedio
            this.humanState.avgResponseTime = (this.humanState.avgResponseTime + 2000) / 2;
        } else {
            // Aumentar fatiga por errores
            this.humanState.fatigue = Math.min(1, this.humanState.fatigue + 0.1);
            this.humanState.avgResponseTime = (this.humanState.avgResponseTime + 5000) / 2;
        }
    }
    
    getRequestsInLastMinute() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // En una implementación real, mantendrías un log de requests
        // Por simplicidad, usamos una aproximación basada en requestCount
        const minutesSinceStart = (now - this.sessionStart) / 60000;
        return Math.floor(this.requestCount / Math.max(minutesSinceStart, 1));
    }
    
    getStatus() {
        return {
            queueLength: this.requestQueue.length,
            processing: this.processing,
            requestCount: this.requestCount,
            humanState: { ...this.humanState },
            lastRequestTime: this.lastRequestTime,
            requestsPerMinute: this.getRequestsInLastMinute()
        };
    }
}

// 📊 CACHE MULTI-NIVEL PERSISTENTE
class PersistentMultiLevelCache {
    constructor() {
        this.caches = {
            spot: {
                data: {},
                metadata: {
                    lastUpdate: 0,
                    ttl: 300000,        // 5 minutos
                    accessCount: 0,
                    hitRate: 0
                }
            },
            futures: {
                data: {},
                metadata: {
                    lastUpdate: 0,
                    ttl: 300000,        // 5 minutos
                    accessCount: 0,
                    hitRate: 0
                }
            },
            liquidity: {
                data: {},
                metadata: {
                    lastUpdate: 0,
                    ttl: 600000,        // 10 minutos
                    accessCount: 0,
                    hitRate: 0
                }
            }
        };
        
        console.log('📊 [CACHE] Sistema multi-nivel persistente inicializado');
    }
    
    get(type, key = 'default') {
        const cache = this.caches[type];
        if (!cache) return null;
        
        cache.metadata.accessCount++;
        
        const now = Date.now();
        const isExpired = (now - cache.metadata.lastUpdate) > cache.metadata.ttl;
        
        if (isExpired || !cache.data[key]) {
            return null;
        }
        
        // Actualizar hit rate
        cache.metadata.hitRate = (cache.metadata.hitRate + 1) / 2;
        
        console.log(`📋 [CACHE] Hit para ${type}:${key}`);
        return cache.data[key];
    }
    
    set(type, data, key = 'default') {
        const cache = this.caches[type];
        if (!cache) return;
        
        cache.data[key] = {
            ...data,
            cachedAt: Date.now()
        };
        cache.metadata.lastUpdate = Date.now();
        
        console.log(`💾 [CACHE] Guardado ${type}:${key}`);
    }
    
    isValid(type, key = 'default') {
        const cache = this.caches[type];
        if (!cache) return false;
        
        const now = Date.now();
        return (now - cache.metadata.lastUpdate) < cache.metadata.ttl && 
               cache.data[key] !== undefined;
    }
    
    clear(type = null) {
        if (type) {
            if (this.caches[type]) {
                this.caches[type].data = {};
                this.caches[type].metadata.lastUpdate = 0;
                console.log(`🧹 [CACHE] Cache ${type} limpiado`);
            }
        } else {
            Object.keys(this.caches).forEach(cacheType => {
                this.caches[cacheType].data = {};
                this.caches[cacheType].metadata.lastUpdate = 0;
            });
            console.log('🧹 [CACHE] Todos los caches limpiados');
        }
    }
    
    getStatus() {
        return Object.keys(this.caches).reduce((status, type) => {
            const cache = this.caches[type];
            status[type] = {
                ...cache.metadata,
                hasData: Object.keys(cache.data).length > 0,
                isValid: this.isValid(type),
                age: Date.now() - cache.metadata.lastUpdate
            };
            return status;
        }, {});
    }
}

// 🚀 INICIALIZACIÓN DE SISTEMAS
const entropyEngine = new OptimalEntropyEngine();
const circuitBreaker = new AdvancedCircuitBreaker();
const rateLimiter = new HumanBehaviorRateLimiter(entropyEngine);
const cache = new PersistentMultiLevelCache();

// Inicializar sistemas de trading
const leverageOptimizer = new LeverageOptimizerV2();
const quantumRebalancer = new QuantumStateRebalancer();
const llmOrchestrator = new LLMNeuralOrchestrator();

console.log('🚀 [SISTEMA OPTIMAL] Todos los componentes inicializados');

// URLs de Binance
const BINANCE_URLS = {
    SPOT: 'https://api.binance.com',
    FUTURES: 'https://fapi.binance.com'
};

// 📡 FUNCIÓN ULTRA-SEGURA PARA REQUESTS HTTP
async function ultraSafeRequest(url, type = 'unknown', options = {}) {
    // Verificar circuit breaker
    if (!circuitBreaker.canExecute(type)) {
        throw new Error(`Circuit breaker abierto para ${type}`);
    }
    
    // Headers humanos
    const humanHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9,es;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site'
    };
    
    const requestConfig = {
        timeout: 30000,
        headers: { ...humanHeaders, ...options.headers },
        ...options
    };
    
    try {
        const response = await axios.get(url, requestConfig);
        circuitBreaker.recordSuccess(type);
        
        console.log(`✅ [HTTP] ${type} - Request exitoso (${response.status})`);
        return response;
        
    } catch (error) {
        circuitBreaker.recordFailure(type, error);
        
        const statusCode = error.response?.status;
        const errorMsg = error.response?.statusText || error.message;
        
        console.log(`❌ [HTTP] ${type} - Error ${statusCode}: ${errorMsg}`);
        throw error;
    }
}

// 📊 FUNCIONES OPTIMIZADAS PARA OBTENER DATOS
async function fetchOptimalSpotData() {
    const cacheKey = 'spot_data';
    
    // Verificar cache primero
    const cachedData = cache.get('spot', cacheKey);
    if (cachedData) {
        console.log('📋 [SPOT] Usando datos del cache');
        return cachedData;
    }
    
    try {
        const response = await rateLimiter.queueRequest(async () => {
            return await ultraSafeRequest(
                `${BINANCE_URLS.SPOT}/api/v3/ticker/24hr`,
                'spot'
            );
        }, 2, 'SPOT');
        
        const data = response.data;
        
        // 🛡️ CRITICAL FIX: Guard defensivo para evitar 'Cannot read properties of undefined'
        if (!data || !Array.isArray(data)) {
            console.warn('⚠️ [DEFENSIVE GUARD] Response data is not a valid array, using fallback');
            throw new Error('Invalid API response: data is not an array');
        }
        
        const processedData = {
            ticker: {},
            signals: {},
            count: 0,
            timestamp: Date.now(),
            source: 'API'
        };
        
        // 🎯 FRAMEWORK COMPLETO QBTC - 77 SÍMBOLOS ORGANIZADOS POR TIERS
        const ALL_QBTC_SYMBOLS = {
            // 👑 TIER 1: LA TRINIDAD SUPREMA (3 símbolos)
            TIER1: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
            
            // 🥈 TIER 2: LA CORTE NOBLE (12 símbolos)
            TIER2: ['SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 
                   'LINKUSDT', 'MATICUSDT', 'LTCUSDT', 'BCHUSDT', 'ATOMUSDT', 'NEARUSDT'],
            
            // 🥉 TIER 3: LA NOBLEZA POPULAR (20 símbolos)
            TIER3: ['UNIUSDT', 'FILUSDT', 'TRXUSDT', 'ETCUSDT', 'XLMUSDT', 'ICPUSDT',
                   'VETUSDT', 'FTMUSDT', 'ALGOUSDT', 'SANDUSDT', 'MANAUSDT', 'AXSUSDT',
                   'THETAUSDT', 'GRTUSDT', 'EOSUSDT', 'AAVEUSDT', 'MKRUSDT', 'COMPUSDT',
                   'SNXUSDT', 'SUSHIUSDT'],
            
            // 🚀 TIER 4: LOS EMERGENTES (14 símbolos)
            TIER4: ['APTUSDT', 'SUIUSDT', 'ARBUSDT', 'OPUSDT', 'INJUSDT', 'STXUSDT',
                   'TIAUSDT', 'SEIUSDT', 'ORDIUSDT', '1000PEPEUSDT', '1000FLOKIUSDT',
                   'WIFUSDT', 'BONKUSDT', '1000SATSUSDT'],
            
            // 💎 TIER 5: LOS ESPECIALISTAS (16 símbolos)
            TIER5: ['CRVUSDT', 'LRCUSDT', 'ENJUSDT', 'CHZUSDT', 'BATUSDT', 'ZRXUSDT',
                   'RENUSDT', 'STORJUSDT', 'CTKUSDT', 'BNTUSDT', 'DYDXUSDT', 'UMAUSDT',
                   'BANDUSDT', 'KAVAUSDT', 'IOTAUSDT', 'ONTUSDT'],
            
            // 🌊 TIER 6: LOS VISIONARIOS (12 símbolos)
            TIER6: ['APEUSDT', 'GALAUSDT', 'GMEUSDT', 'IMXUSDT', 'LOOKSUSDT', 'MINAUSDT',
                   'FLOWUSDT', 'CHRUSDT', 'TLMUSDT', 'ALPACAUSDT', 'YGGUSDT', 'GHSTUSDT']
        };
        
        // Combinar todos los símbolos (77 total)
        const mainSymbols = [
            ...ALL_QBTC_SYMBOLS.TIER1,
            ...ALL_QBTC_SYMBOLS.TIER2, 
            ...ALL_QBTC_SYMBOLS.TIER3,
            ...ALL_QBTC_SYMBOLS.TIER4,
            ...ALL_QBTC_SYMBOLS.TIER5,
            ...ALL_QBTC_SYMBOLS.TIER6
        ];
        
        // 🛡️ SAFE ITERATION: Validar cada item antes de procesar
        data.forEach(item => {
            // Guard adicional por item
            if (!item || typeof item !== 'object' || !item.symbol) {
                console.warn('⚠️ [ITEM GUARD] Skipping invalid item:', item);
                return;
            }
            if (mainSymbols.includes(item.symbol)) {
                const priceChange = parseFloat(item.priceChangePercent);
                
                processedData.ticker[item.symbol] = {
                    symbol: item.symbol,
                    price: parseFloat(item.lastPrice),
                    change: priceChange,
                    volume: parseFloat(item.volume),
                    high: parseFloat(item.highPrice),
                    low: parseFloat(item.lowPrice),
                    volatility: Math.abs(priceChange),
                    momentum: priceChange > 0 ? 1 : -1
                };
                
                processedData.count++;
                
                // Generar señales usando entropía del sistema
                if (Math.abs(priceChange) > 3) {
                    const confidence = Math.min(Math.abs(priceChange) / 10, 1);
                    processedData.signals[item.symbol] = {
                        type: priceChange > 0 ? 'LONG' : 'SHORT',
                        strength: Math.abs(priceChange),
                        confidence: confidence,
                        entropy_factor: getSystemEntropy(confidence)
                    };
                }
            }
        });
        
        // Guardar en cache
        cache.set('spot', processedData, cacheKey);
        
        console.log(`✅ [SPOT] Datos obtenidos: ${processedData.count} símbolos, ${Object.keys(processedData.signals).length} señales`);
        return processedData;
        
    } catch (error) {
        console.log(`❌ [SPOT] Error: ${error.message}`);
        
        // Fallback a datos por defecto
        const fallbackData = generateDefaultSpotData();
        cache.set('spot', fallbackData, cacheKey + '_fallback');
        return fallbackData;
    }
}

async function fetchOptimalFuturesData() {
    const cacheKey = 'futures_data';
    
    // Verificar cache primero
    const cachedData = cache.get('futures', cacheKey);
    if (cachedData) {
        console.log('📋 [FUTURES] Usando datos del cache');
        return cachedData;
    }
    
    try {
        const response = await rateLimiter.queueRequest(async () => {
            return await ultraSafeRequest(
                `${BINANCE_URLS.FUTURES}/fapi/v1/ticker/24hr`,
                'futures'
            );
        }, 3, 'FUTURES'); // Mayor prioridad para futures
        
        const data = response.data;
        
        // 🛡️ CRITICAL FIX: Guard defensivo para FUTURES data
        if (!data || !Array.isArray(data)) {
            console.warn('⚠️ [DEFENSIVE GUARD] FUTURES Response data is not a valid array, using fallback');
            throw new Error('Invalid FUTURES API response: data is not an array');
        }
        
        const processedData = {
            ticker: {},
            opportunities: {},
            count: 0,
            timestamp: Date.now(),
            source: 'API'
        };
        
        // 🚀 EXPANSIÓN MASIVA FUTURES - FRAMEWORK QBTC COMPLETO + SÍMBOLOS ADICIONALES
        // OBJETIVO: 150+ símbolos para máxima cobertura y oportunidades
        const futuresSymbols = [
            // 👑 TIER 1: LA TRINIDAD SUPREMA (3 símbolos)
            'BTCUSDT', 'ETHUSDT', 'BNBUSDT',
            
            // 🥈 TIER 2: LA CORTE NOBLE COMPLETA (11 símbolos - MATICUSDT no disponible en FUTURES)
            'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'DOTUSDT',
            'LINKUSDT', 'LTCUSDT', 'BCHUSDT', 'ATOMUSDT', 'NEARUSDT',
            
            // 🥉 TIER 3: LA NOBLEZA POPULAR COMPLETA (19 símbolos - EOSUSDT no disponible)
            'UNIUSDT', 'FILUSDT', 'TRXUSDT', 'ETCUSDT', 'XLMUSDT', 'ICPUSDT',
            'VETUSDT', 'FTMUSDT', 'ALGOUSDT', 'SANDUSDT', 'MANAUSDT', 'AXSUSDT',
            'THETAUSDT', 'GRTUSDT', 'AAVEUSDT', 'MKRUSDT', 'COMPUSDT', 'SNXUSDT', 'SUSHIUSDT',
            
            // 🚀 TIER 4: LOS EMERGENTES COMPLETOS (13 símbolos - BONKUSDT no disponible)
            'APTUSDT', 'SUIUSDT', 'ARBUSDT', 'OPUSDT', 'INJUSDT', 'STXUSDT',
            'TIAUSDT', 'SEIUSDT', 'ORDIUSDT', '1000PEPEUSDT', '1000FLOKIUSDT',
            'WIFUSDT', '1000SATSUSDT',
            
            // 💎 TIER 5: LOS ESPECIALISTAS COMPLETOS (16 símbolos)
            'CRVUSDT', 'LRCUSDT', 'ENJUSDT', 'CHZUSDT', 'BATUSDT', 'ZRXUSDT',
            'RENUSDT', 'STORJUSDT', 'CTKUSDT', 'BNTUSDT', 'DYDXUSDT', 'UMAUSDT',
            'BANDUSDT', 'KAVAUSDT', 'IOTAUSDT', 'ONTUSDT',
            
            // 🌊 TIER 6: LOS VISIONARIOS COMPLETOS (10 símbolos - GMEUSDT, LOOKSUSDT no disponibles)
            'APEUSDT', 'GALAUSDT', 'IMXUSDT', 'MINAUSDT', 'FLOWUSDT', 'CHRUSDT',
            'TLMUSDT', 'ALPACAUSDT', 'YGGUSDT', 'GHSTUSDT',
            
            // 🔥 LAYER 1 BLOCKCHAINS ADICIONALES (15 símbolos)
            'LUNAUSDT', 'FTMUSDT', 'ONEUSDT', 'ZILUSDT', 'QTUMUSDT', 'WAVESUSDT',
            'ICXUSDT', 'ZENUSDT', 'NULSUSDT', 'SCUSDT', 'DGBUSDT', 'RVNUSDT',
            'NEOUSDT', 'XTZUSDT', 'EGLDUSDT',
            
            // 🎮 GAMING & METAVERSE (12 símbolos)
            'AXSUSDT', 'SLPUSDT', 'ALICEUSDT', 'PAXGUSDT', 'ENJUSDT', 'MAGICUSDT',
            'GMTUSDT', 'GALUSDT', 'STARUSDT', 'YGGUSDT', 'MCUSDT', 'HIGHUSDT',
            
            // 💰 DEFI PROTOCOLS EXPANDIDO (20 símbolos)
            '1INCHUSDT', 'CAKEUSDT', 'SXPUSDT', 'KNCUSDT', 'KSMUSDT', 'MDTUSDT',
            'PONDUSDT', 'DUSKUSDT', 'VITEUSDT', 'CKBUSDT', 'BADGERUSDT', 'FISUSDT',
            'RAYUSDT', 'C98USDT', 'MOVRUSDT', 'LPTUSDT', 'TVKUSDT', 'BADGERUSDT',
            'STMXUSDT', 'DATAUSDT',
            
            // 🐕 MEME COINS EXPANDIDO (15 símbolos)
            'SHIBUSDT', '1000LUNCUSDT', '1000XECUSDT', 'SPELLUSDT', 'JASMYUSDT',
            'HOTUSDT', 'WINUSDT', 'BTTUSDT', 'DENTUSDT', 'CELRUSDT',
            'ANKRUSDT', 'CHRUSDT', 'OCEANUSDT', 'AUDIOUSDT', 'CTSIUSDT',
            
            // 📊 ORACLE & DATA (8 símbolos)
            'BANDUSDT', 'APIUSDT', 'DIAUSDT', 'TELLUSDT', 'OXTUSDT', 'REEFUSDT',
            'BELUSDT', 'WINGUSDT',
            
            // ⚡ PAYMENT & TRANSFER (10 símbolos)
            'XMRUSDT', 'DASHUSDT', 'ZECUSDT', 'XEMUSDT', 'IOSTUSDT', 'DCRUSDT',
            'BTGUSDT', 'BSVUSDT', 'NKNUSDT', 'OGNUSDT',
            
            // 🏭 INFRASTRUCTURE (8 símbolos)
            'HBARUSDT', 'TWTUSDT', 'KAVAUSDT', 'HARDUSDT', 'KLAYUSDT', 'STPTUSDT',
            'TCUSDT', 'VIDTUSDT'
        ];
        
        // 🛡️ SAFE ITERATION: Validar cada item antes de procesar
        data.forEach(item => {
            // Guard adicional por item
            if (!item || typeof item !== 'object' || !item.symbol) {
                console.warn('⚠️ [FUTURES ITEM GUARD] Skipping invalid item:', item);
                return;
            }
            if (futuresSymbols.includes(item.symbol)) {
                const priceChange = parseFloat(item.priceChangePercent);
                
                processedData.ticker[item.symbol] = {
                    symbol: item.symbol,
                    price: parseFloat(item.lastPrice),
                    change: priceChange,
                    volume: parseFloat(item.volume),
                    fundingRate: parseFloat(item.fundingRate || 0),
                    leverage_factor: getSystemEntropy(25) + 5 // 5-30x leverage basado en entropía
                };
                
                processedData.count++;
                
                // Generar oportunidades usando métricas del sistema
                if (Math.abs(priceChange) > 2) {
                    processedData.opportunities[item.symbol] = {
                        type: priceChange > 0 ? 'LONG' : 'SHORT',
                        leverage: Math.min(Math.abs(priceChange) * 2, 20),
                        confidence: getSystemEntropy(1),
                        entropy_score: getHashEntropy(item.symbol, 1)
                    };
                }
            }
        });
        
        // Guardar en cache
        cache.set('futures', processedData, cacheKey);
        
        console.log(`✅ [FUTURES] Datos obtenidos: ${processedData.count} símbolos`);
        return processedData;
        
    } catch (error) {
        console.log(`❌ [FUTURES] Error: ${error.message}`);
        
        // Fallback a datos por defecto
        const fallbackData = generateDefaultFuturesData();
        cache.set('futures', fallbackData, cacheKey + '_fallback');
        return fallbackData;
    }
}

async function fetchOptimalLiquidityData() {
    const cacheKey = 'liquidity_data';
    
    // Verificar cache primero (cache más largo para liquidez)
    const cachedData = cache.get('liquidity', cacheKey);
    if (cachedData) {
        console.log('📋 [LIQUIDITY] Usando datos del cache');
        return cachedData;
    }
    
    try {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
        const liquidityData = {};
        
        // Procesar secuencialmente para evitar rate limiting
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            
            try {
                const response = await rateLimiter.queueRequest(async () => {
                    return await ultraSafeRequest(
                        `${BINANCE_URLS.FUTURES}/fapi/v1/depth?symbol=${symbol}&limit=20`,
                        'liquidity'
                    );
                }, 1, `LIQUIDITY_${symbol}`);
                
                const { bids, asks } = response.data;
                
                // Calcular métricas usando entropía del sistema
                const bidLiquidity = bids.reduce((sum, [price, qty]) => 
                    sum + (parseFloat(price) * parseFloat(qty)), 0
                );
                const askLiquidity = asks.reduce((sum, [price, qty]) => 
                    sum + (parseFloat(price) * parseFloat(qty)), 0
                );
                const totalLiquidity = bidLiquidity + askLiquidity;
                const spread = (parseFloat(asks[0][0]) - parseFloat(bids[0][0])) / parseFloat(bids[0][0]);
                
                liquidityData[symbol] = {
                    liquidityScore: Math.min(totalLiquidity / 1000000, 1),
                    spread: spread,
                    tier: 'TIER1_MAJOR',
                    totalLiquidity: totalLiquidity,
                    entropy_factor: getHashEntropy(symbol + totalLiquidity, 1),
                    lastUpdated: Date.now()
                };
                
                console.log(`✅ [LIQUIDITY] ${symbol}: Score ${(liquidityData[symbol].liquidityScore * 100).toFixed(1)}%`);
                
            } catch (error) {
                console.log(`⚠️ [LIQUIDITY] Error para ${symbol}: ${error.message}`);
                liquidityData[symbol] = generateDefaultLiquidityForSymbol(symbol);
            }
        }
        
        // Guardar en cache
        cache.set('liquidity', liquidityData, cacheKey);
        
        console.log(`💧 [LIQUIDITY] Datos obtenidos para ${Object.keys(liquidityData).length} símbolos`);
        return liquidityData;
        
    } catch (error) {
        console.log(`❌ [LIQUIDITY] Error general: ${error.message}`);
        return generateDefaultLiquidityData();
    }
}

// 🎯 FUNCIONES DE DATOS POR DEFECTO
function generateDefaultSpotData() {
    return {
        ticker: {
            'BTCUSDT': { 
                symbol: 'BTCUSDT', 
                price: 70000 + getSystemEntropy(10000), 
                change: getSystemEntropy(10) - 5, 
                volume: 1000000 + getSystemEntropy(500000) 
            },
            'ETHUSDT': { 
                symbol: 'ETHUSDT', 
                price: 2500 + getSystemEntropy(500), 
                change: getSystemEntropy(8) - 4, 
                volume: 500000 + getSystemEntropy(250000) 
            },
            'BNBUSDT': { 
                symbol: 'BNBUSDT', 
                price: 350 + getSystemEntropy(100), 
                change: getSystemEntropy(6) - 3, 
                volume: 300000 + getSystemEntropy(150000) 
            }
        },
        signals: {},
        count: 3,
        timestamp: Date.now(),
        source: 'DEFAULT'
    };
}

function generateDefaultFuturesData() {
    return {
        ticker: generateDefaultSpotData().ticker,
        opportunities: {
            'BTCUSDT': {
                type: entropyEngine.humanDecision() ? 'LONG' : 'SHORT',
                leverage: 10 + getSystemEntropy(10),
                confidence: getSystemEntropy(1)
            }
        },
        count: 3,
        timestamp: Date.now(),
        source: 'DEFAULT'
    };
}

function generateDefaultLiquidityData() {
    return {
        'BTCUSDT': generateDefaultLiquidityForSymbol('BTCUSDT'),
        'ETHUSDT': generateDefaultLiquidityForSymbol('ETHUSDT'),
        'BNBUSDT': generateDefaultLiquidityForSymbol('BNBUSDT')
    };
}

function generateDefaultLiquidityForSymbol(symbol) {
    return {
        liquidityScore: getSystemEntropy(0.5) + 0.5, // 0.5-1.0
        spread: getSystemEntropy(0.005) + 0.001,     // 0.001-0.006
        tier: 'TIER1_MAJOR',
        totalLiquidity: 10000000 + getSystemEntropy(40000000),
        entropy_factor: getHashEntropy(symbol, 1),
        lastUpdated: Date.now()
    };
}

// 🔄 FUNCIÓN PRINCIPAL DE ACTUALIZACIÓN ÓPTIMA
async function optimalSystemUpdate() {
    console.log('🔄 [SISTEMA OPTIMAL] Iniciando actualización completa...');
    const startTime = Date.now();
    
    try {
        // Obtener datos con priorización
        const [spotData, futuresData, liquidityData] = await Promise.allSettled([
            fetchOptimalSpotData(),
            fetchOptimalFuturesData(),
            fetchOptimalLiquidityData()
        ]);
        
        // Generar estado cuántico usando entropía del sistema
        const quantumState = {
            coherence: getSystemEntropy(0.5) + 0.5,
            consciousness: getSystemEntropy(0.4) + 0.6,
            entanglement: getSystemEntropy(0.3) + 0.7,
            superposition: getSystemEntropy(0.4) + 0.6,
            tunneling: getSystemEntropy(0.5) + 0.5,
            optimalLeverage: getSystemEntropy(0.3) + 0.7
        };
        
        // Integrar con el LLM Neural Orchestrator
        let unifiedDecision = null;
        try {
            await llmOrchestrator.initializeNeuralSystems();
            unifiedDecision = await llmOrchestrator.generateUnifiedDecision('BTCUSDT');
        } catch (error) {
            console.log(`⚠️ [LLM] Error generando decisión unificada: ${error.message}`);
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Guardar estado global
        global.optimalSystemState = {
            spot: spotData.status === 'fulfilled' ? spotData.value : generateDefaultSpotData(),
            futures: futuresData.status === 'fulfilled' ? futuresData.value : generateDefaultFuturesData(),
            liquidity: liquidityData.status === 'fulfilled' ? liquidityData.value : generateDefaultLiquidityData(),
            quantum: quantumState,
            unifiedDecision: unifiedDecision,
            lastUpdate: endTime,
            updateDuration: duration,
            circuitBreakerStatus: circuitBreaker.getStatus(),
            rateLimiterStatus: rateLimiter.getStatus(),
            cacheStatus: cache.getStatus()
        };
        
        console.log(`✅ [SISTEMA OPTIMAL] Actualización completada en ${duration}ms`);
        
    } catch (error) {
        console.log(`❌ [SISTEMA OPTIMAL] Error en actualización: ${error.message}`);
        
        // Estado de emergencia
        global.optimalSystemState = global.optimalSystemState || {
            spot: generateDefaultSpotData(),
            futures: generateDefaultFuturesData(),
            liquidity: generateDefaultLiquidityData(),
            quantum: { coherence: 0.5, consciousness: 0.5, entanglement: 0.5 },
            lastUpdate: Date.now(),
            emergency: true
        };
    }
}

// 🌐 ENDPOINTS OPTIMIZADOS
app.get('/health', (req, res) => {
    const state = global.optimalSystemState || {};
    const systemHealth = {
        status: 'OK',
        system: 'Optimal Anti-418 Trading System',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        
        // Métricas del sistema
        metrics: {
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage(),
            systemEntropy: getSystemEntropy(1)
        },
        
        // Estado de los componentes
        components: {
            circuitBreaker: circuitBreaker.getStatus(),
            rateLimiter: rateLimiter.getStatus(),
            cache: cache.getStatus(),
            entropy: entropyEngine.getEntropy(1)
        },
        
        // Estado del sistema
        lastUpdate: state.lastUpdate,
        emergency: state.emergency || false,
        updateDuration: state.updateDuration || 0
    };
    
    res.json(systemHealth);
});

app.get('/api/strategic-overview', (req, res) => {
    const state = global.optimalSystemState || {};
    
    res.json({
        success: true,
        mode: 'OPTIMAL_ANTI_418',
        timestamp: Date.now(),
        
        data: {
            spot: {
                symbols: state.spot?.count || 0,
                signals: Object.keys(state.spot?.signals || {}).length,
                source: state.spot?.source || 'UNKNOWN',
                purpose: 'ANALISIS_NEURAL_AVANZADO'
            },
            futures: {
                symbols: state.futures?.count || 0,
                opportunities: Object.keys(state.futures?.opportunities || {}).length,
                source: state.futures?.source || 'UNKNOWN',
                purpose: 'EJECUCION_OPTIMAL'
            },
            liquidity: {
                symbols: Object.keys(state.liquidity || {}).length,
                avgScore: calculateAvgLiquidityScore(state.liquidity),
                purpose: 'MONITOREO_INTELIGENTE'
            },
            quantum: state.quantum || {},
            unifiedDecision: state.unifiedDecision || null
        },
        
        systemStatus: {
            circuitBreakers: circuitBreaker.getStatus(),
            rateLimiting: rateLimiter.getStatus(),
            cache: cache.getStatus(),
            entropy: {
                current: getSystemEntropy(1),
                pool: entropyEngine.entropyPool.length
            }
        },
        
        strategy: 'OPTIMAL_ANTI_418_WITH_NEURAL_INTEGRATION'
    });
});

app.get('/api/system-status', (req, res) => {
    const state = global.optimalSystemState || {};
    
    res.json({
        success: true,
        system: 'Optimal Anti-418',
        timestamp: Date.now(),
        
        performance: {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage(),
            lastUpdateDuration: state.updateDuration || 0
        },
        
        dataFreshness: {
            spot: {
                age: state.spot?.timestamp ? Date.now() - state.spot.timestamp : 0,
                source: state.spot?.source || 'UNKNOWN',
                valid: cache.isValid('spot')
            },
            futures: {
                age: state.futures?.timestamp ? Date.now() - state.futures.timestamp : 0,
                source: state.futures?.source || 'UNKNOWN',
                valid: cache.isValid('futures')
            },
            liquidity: {
                age: getLiquidityAge(state.liquidity),
                valid: cache.isValid('liquidity')
            }
        },
        
        systemComponents: {
            circuitBreakers: circuitBreaker.getStatus(),
            rateLimiter: rateLimiter.getStatus(),
            cache: cache.getStatus(),
            entropyEngine: {
                poolSize: entropyEngine.entropyPool.length,
                poolIndex: entropyEngine.poolIndex,
                lastRefresh: entropyEngine.lastRefresh
            }
        },
        
        neuralIntegration: {
            llmOrchestrator: llmOrchestrator.getSystemStats(),
            unifiedDecision: state.unifiedDecision ? {
                decision: state.unifiedDecision.final_decision,
                confidence: state.unifiedDecision.confidence,
                timestamp: state.unifiedDecision.timestamp
            } : null
        },
        
        antiRateLimiting: {
            strategy: 'ULTRA_CONSERVATIVE_HUMAN_SIMULATION',
            queueLength: rateLimiter.getStatus().queueLength,
            humanState: rateLimiter.getStatus().humanState,
            requestsPerMinute: rateLimiter.getStatus().requestsPerMinute
        }
    });
});

// 🎯 ENDPOINTS PARA DATOS DETALLADOS
app.get('/api/raw-signals', (req, res) => {
    const state = global.optimalSystemState || {};
    const symbol = req.query.symbol; // Filtro opcional por símbolo
    const minConfidence = parseFloat(req.query.min_confidence) || 0; // Filtro por confianza mínima
    
    let signals = state.spot?.signals || {};
    
    // Aplicar filtros si se especifican
    if (symbol) {
        signals = signals[symbol] ? { [symbol]: signals[symbol] } : {};
    }
    
    if (minConfidence > 0) {
        signals = Object.fromEntries(
            Object.entries(signals).filter(([sym, signal]) => 
                (signal.confidence || 0) >= minConfidence
            )
        );
    }
    
    res.json({
        success: true,
        system: 'RAW_SPOT_SIGNALS',
        timestamp: Date.now(),
        filters_applied: {
            symbol: symbol || 'all',
            min_confidence: minConfidence
        },
        signals: signals,
        count: Object.keys(signals).length,
        total_available: Object.keys(state.spot?.signals || {}).length,
        source: state.spot?.source || 'UNKNOWN',
        last_update: state.spot?.timestamp || 0
    });
});

app.get('/api/raw-opportunities', (req, res) => {
    const state = global.optimalSystemState || {};
    const symbol = req.query.symbol; // Filtro opcional por símbolo  
    const minConfidence = parseFloat(req.query.min_confidence) || 0; // Filtro por confianza mínima
    const maxLeverage = parseFloat(req.query.max_leverage) || Infinity; // Filtro por leverage máximo
    
    let opportunities = state.futures?.opportunities || {};
    
    // Aplicar filtros si se especifican
    if (symbol) {
        opportunities = opportunities[symbol] ? { [symbol]: opportunities[symbol] } : {};
    }
    
    if (minConfidence > 0 || maxLeverage < Infinity) {
        opportunities = Object.fromEntries(
            Object.entries(opportunities).filter(([sym, opp]) => {
                const confidence = opp.confidence || 0;
                const leverage = opp.leverage || 1;
                return confidence >= minConfidence && leverage <= maxLeverage;
            })
        );
    }
    
    res.json({
        success: true,
        system: 'RAW_FUTURES_OPPORTUNITIES',
        timestamp: Date.now(),
        filters_applied: {
            symbol: symbol || 'all',
            min_confidence: minConfidence,
            max_leverage: maxLeverage === Infinity ? 'unlimited' : maxLeverage
        },
        opportunities: opportunities,
        count: Object.keys(opportunities).length,
        total_available: Object.keys(state.futures?.opportunities || {}).length,
        source: state.futures?.source || 'UNKNOWN',
        last_update: state.futures?.timestamp || 0
    });
});

app.get('/api/raw-data', (req, res) => {
    const state = global.optimalSystemState || {};
    const includeTickerData = req.query.include_ticker === 'true';
    
    const responseData = {
        success: true,
        system: 'RAW_COMPLETE_DATA',
        timestamp: Date.now(),
        
        spot: {
            signals: state.spot?.signals || {},
            count: state.spot?.count || 0,
            source: state.spot?.source || 'UNKNOWN',
            timestamp: state.spot?.timestamp || 0
        },
        
        futures: {
            opportunities: state.futures?.opportunities || {},
            count: state.futures?.count || 0,
            source: state.futures?.source || 'UNKNOWN',
            timestamp: state.futures?.timestamp || 0
        },
        
        liquidity: state.liquidity || {},
        quantum: state.quantum || {},
        unifiedDecision: state.unifiedDecision || null,
        
        systemMetrics: {
            lastUpdate: state.lastUpdate || 0,
            updateDuration: state.updateDuration || 0,
            emergency: state.emergency || false
        }
    };
    
    // Incluir datos de ticker si se solicita (puede ser muy grande)
    if (includeTickerData) {
        responseData.spot.ticker = state.spot?.ticker || {};
        responseData.futures.ticker = state.futures?.ticker || {};
    }
    
    res.json(responseData);
});

// 🧮 FUNCIONES AUXILIARES
function calculateAvgLiquidityScore(liquidityData) {
    if (!liquidityData || Object.keys(liquidityData).length === 0) return 0;
    
    const scores = Object.values(liquidityData).map(data => data.liquidityScore || 0);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function getLiquidityAge(liquidityData) {
    if (!liquidityData || Object.keys(liquidityData).length === 0) return 0;
    
    const timestamps = Object.values(liquidityData)
        .map(data => data.lastUpdated || 0)
        .filter(ts => ts > 0);
    
    if (timestamps.length === 0) return 0;
    
    const maxTimestamp = Math.max(...timestamps);
    return Date.now() - maxTimestamp;
}

// 🚀 INICIALIZACIÓN DEL SERVIDOR
app.listen(PORT, async () => {
    console.log(`🚀 [SISTEMA OPTIMAL] Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🛡️ Sistema Anti-418 con Circuit Breakers - ACTIVO`);
    console.log(`🕰️ Rate Limiter Ultra-Conservador - ACTIVO`);
    console.log(`🎲 Entropía basada en Kernel del Sistema - ACTIVO`);
    console.log(`📊 Cache Multi-Nivel Persistente - ACTIVO`);
    console.log(`🧠 Integración Neural con LLM - ACTIVO`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    
    // Log de configuración
    console.log(`⚙️ Configuración:`);
    console.log(`   - Delay mínimo: ${rateLimiter.config.minDelay}ms`);
    console.log(`   - Delay máximo: ${rateLimiter.config.maxDelay}ms`);
    console.log(`   - Max requests/min: ${rateLimiter.config.maxRequestsPerMinute}`);
    console.log(`   - Cache TTL SPOT/FUTURES: ${cache.caches.spot.metadata.ttl/1000}s`);
    console.log(`   - Cache TTL LIQUIDEZ: ${cache.caches.liquidity.metadata.ttl/1000}s`);
    
    // Primera actualización inmediata
    await optimalSystemUpdate();
    
    // Programar actualizaciones cada 10 minutos (ultra-conservador)
    setInterval(optimalSystemUpdate, 600000);
    
    console.log(`✅ [SISTEMA OPTIMAL] Sistema completamente inicializado`);
    console.log(`📊 Endpoints disponibles:`);
    console.log(`   - /health (estado completo del sistema)`);
    console.log(`   - /api/strategic-overview (overview estratégico neural)`);
    console.log(`   - /api/system-status (métricas detalladas anti-418)`);
    console.log(`🔄 Próxima actualización automática en 10 minutos`);
});

// ⚠️ MANEJADORES DE PROCESOS PARA SEGUNDO PLANO
process.on('SIGTERM', () => {
    console.log('🔄 [SISTEMA OPTIMAL] Recibido SIGTERM, cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🔄 [SISTEMA OPTIMAL] Recibido SIGINT, cerrando servidor...');
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    console.error('❌ [SISTEMA OPTIMAL] Excepción no capturada:', error.message);
    // No salir del proceso para mantener el sistema en segundo plano
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ [SISTEMA OPTIMAL] Promesa rechazada no manejada:', reason);
    // No salir del proceso para mantener el sistema en segundo plano
});

console.log('🎯 [SISTEMA OPTIMAL] Configurado para ejecución en segundo plano');

module.exports = {
    app,
    entropyEngine,
    circuitBreaker,
    rateLimiter,
    cache,
    optimalSystemUpdate,
    fetchOptimalSpotData,
    fetchOptimalFuturesData,
    fetchOptimalLiquidityData
};

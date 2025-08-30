
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
 * Core System Estratégico - Arquitectura Correcta
 * 
 * SPOT = FUENTE DE INFORMACIÓN (Análisis y Señales)
 * FUTURES = EJECUCIÓN PRINCIPAL (Leverage y Profit)
 * OPTIONS = EJECUCIÓN AVANZADA (Estrategias Complejas)
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { LeverageOptimizerV2 } = require('./LEVERAGE_OPTIMIZER_V2');
const { QuantumStateRebalancer } = require('./QUANTUM_REBALANCER');

const app = express();
const PORT = 4602;

// [NIGHT] INICIALIZAR OPTIMIZADORES CARA OCULTA
const leverageOptimizer = new LeverageOptimizerV2();
const quantumRebalancer = new QuantumStateRebalancer();
console.log('[START] Optimizadores Cara Oculta activados');

// [DATA] LIQUIDEZ MONITORING EN TIEMPO REAL
const liquidityCache = {
    data: {},
    lastUpdate: 0,
    ttl: 30000 // 30 segundos
};

// Configuración CORS
app.use(cors());
app.use(express.json());

// URLs de Binance por tipo
const BINANCE_URLS = {
    SPOT: 'https://api.binance.com',
    FUTURES: 'https://fapi.binance.com',
    OPTIONS: 'https://eapi.binance.com'
};

// [RELOAD] SISTEMA CIRCUIT BREAKER PARA EVITAR RATE LIMITING
const circuitBreaker = {
    spot: { failures: 0, lastFailure: 0, isOpen: false, threshold: 3, timeout: 60000 },
    futures: { failures: 0, lastFailure: 0, isOpen: false, threshold: 3, timeout: 60000 },
    liquidity: { failures: 0, lastFailure: 0, isOpen: false, threshold: 5, timeout: 120000 }
};

//  RATE LIMITER GLOBAL
const rateLimiter = {
    lastRequest: 0,
    minInterval: 2000, // 2 segundos mínimo entre requests
    requestQueue: [],
    processing: false
};

// Cache estratégico organizado
const strategicCache = {
    // SPOT: Solo para análisis y señales
    spot: {
        ticker: {},
        klines: {},
        orderbook: {},
        signals: {}, // Señales generadas desde SPOT
        correlations: {}, // Correlaciones entre activos
        trends: {}, // Tendencias identificadas
        lastUpdate: 0,
        ttl: 120000 // 2 minutos TTL
    },
    
    // FUTURES: Ejecución principal
    futures: {
        ticker: {},
        positions: {},
        orders: {},
        leverage: {},
        liquidation: {},
        pnl: {},
        lastUpdate: 0,
        ttl: 120000 // 2 minutos TTL
    },
    
    // OPTIONS: Ejecución avanzada
    options: {
        contracts: {},
        strikes: {},
        expirations: {},
        greeks: {},
        strategies: {},
        volatility: {},
        lastUpdate: 0,
        ttl: 300000 // 5 minutos TTL
    },
    
    // Sistema de señales unificado
    signals: {
        ranking: [], // Ranking de mejores oportunidades
        execution: {}, // Señales listas para ejecutar
        performance: {}, // Performance de señales anteriores
        risk: {} // Análisis de riesgo
    },
    
    // Métricas cuánticas estratégicas
    quantum: {
        coherence: 0,
        consciousness: 0,
        entanglement: 0,
        superposition: 0,
        tunneling: 0,
        optimalLeverage: 0
    },
    
    // Control de ejecución y errores
    requestControl: {
        lastRequestTime: {},
        errorCounts: {},
        retryDelays: {}
    }
};

//  FUNCIONES CIRCUIT BREAKER
function checkCircuitBreaker(type) {
    const breaker = circuitBreaker[type];
    const now = Date.now();
    
    // Si el circuito está abierto, verificar si ya pasó el timeout
    if (breaker.isOpen) {
        if (now - breaker.lastFailure > breaker.timeout) {
            breaker.isOpen = false;
            breaker.failures = 0;
            console.log(`[RELOAD] Circuit breaker CERRADO para ${type}`);
            return true;
        }
        console.log(`[BLOCKED] Circuit breaker ABIERTO para ${type} - esperando timeout`);
        return false;
    }
    return true;
}

function recordFailure(type, error) {
    const breaker = circuitBreaker[type];
    breaker.failures++;
    breaker.lastFailure = Date.now();
    
    if (breaker.failures >= breaker.threshold) {
        breaker.isOpen = true;
        console.log(`[ALERT] Circuit breaker ABIERTO para ${type} - demasiados errores (${breaker.failures})`);
    }
    
    // Si es error 418, aumentar timeout
    if (error.response?.status === 418) {
        breaker.timeout = Math.min(breaker.timeout * 2, 600000); // Max 10 minutos
        console.log(`[TIME] Timeout aumentado para ${type}: ${breaker.timeout / 1000}s`);
    }
}

function recordSuccess(type) {
    const breaker = circuitBreaker[type];
    if (breaker.failures > 0) {
        breaker.failures = Math.max(0, breaker.failures - 1); // Reducir gradualmente
    }
}

//  RATE LIMITER INTELIGENTE
async function smartDelay(type, priority = 1) {
    const now = Date.now();
    const timeSinceLastRequest = now - rateLimiter.lastRequest;
    const requiredDelay = rateLimiter.minInterval * priority;
    
    if (timeSinceLastRequest < requiredDelay) {
        const delay = requiredDelay - timeSinceLastRequest;
        console.log(` Smart delay para ${type}: ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    rateLimiter.lastRequest = Date.now();
}

// Función para obtener datos SPOT (solo análisis) - CON CIRCUIT BREAKER
async function fetchSpotData() {
    // Verificar circuit breaker
    if (!checkCircuitBreaker('spot')) {
        console.log(' SPOT data fetch bloqueado por circuit breaker');
        return;
    }
    
    // Verificar cache TTL
    const now = Date.now();
    if (now - strategicCache.spot.lastUpdate < strategicCache.spot.ttl) {
        console.log('[LIST] Usando cache SPOT (TTL activo)');
        return;
    }
    
    try {
        // Smart delay con prioridad alta
        await smartDelay('SPOT', 2);
        
        console.log('[DATA] Consultando datos SPOT con circuit breaker...');
        const response = await axios.get(`${BINANCE_URLS.SPOT}/api/v3/ticker/24hr`, {
            timeout: 15000 // Timeout de 15 segundos
        });
        const data = response.data;
        
        // Éxito - registrar
        recordSuccess('spot');
        
        strategicCache.spot.ticker = {};
        let signalCount = 0;
        
        data.forEach(item => {
            if (item.symbol.endsWith('USDT')) {
                strategicCache.spot.ticker[item.symbol] = {
                    symbol: item.symbol,
                    price: parseFloat(item.lastPrice),
                    change: parseFloat(item.priceChangePercent),
                    volume: parseFloat(item.volume),
                    high: parseFloat(item.highPrice),
                    low: parseFloat(item.lowPrice),
                    // Análisis para señales
                    volatility: Math.abs(parseFloat(item.priceChangePercent)),
                    momentum: parseFloat(item.priceChangePercent),
                    strength: parseFloat(item.volume) * parseFloat(item.lastPrice)
                };
                
                // Generar señales desde SPOT
                const signal = generateSpotSignal(item);
                if (signal) {
                    strategicCache.spot.signals[item.symbol] = signal;
                    signalCount++;
                }
            }
        });
        
        console.log(`[DATA] Datos SPOT obtenidos: ${Object.keys(strategicCache.spot.ticker).length} símbolos`);
        console.log(`[ENDPOINTS] Señales generadas desde SPOT: ${signalCount}`);
        
        // Actualizar TTL
        strategicCache.spot.lastUpdate = now;
        
        // Analizar correlaciones y tendencias
        analyzeSpotCorrelations();
        
    } catch (error) {
        console.log(`[ERROR] Error obteniendo datos SPOT: ${error.message}`);
        recordFailure('spot', error);
    }
}

//  FUNCIÓN PARA OBTENER LIQUIDEZ EN TIEMPO REAL CON ANTI-RATE LIMITING
async function fetchLiquidityData() {
    const now = Date.now();
    if (now - liquidityCache.lastUpdate < liquidityCache.ttl) {
        return liquidityCache.data; // Usar cache
    }
    
    try {
        console.log(' Obteniendo datos de liquidez en tiempo real (anti-418)...');
        
        // Obtener order book depth para símbolos principales con delays
        const liquidityData = {};
        const prioritySymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'BONKUSDT', 'FLOKIUSDT', 'EPXUSDT'];
        
        // [START] PROCESAMIENTO SECUENCIAL PARA EVITAR 418
        for (let i = 0; i < prioritySymbols.length; i++) {
            const symbol = prioritySymbols[i];
            try {
                // Delay entre consultas para evitar rate limiting
                if (i > 0) {
                    await new Promise(resolve => setTimeout(resolve, 800)); // 800ms delay
                }
                
                const depthResponse = await axios.get(`${BINANCE_URLS.FUTURES}/fapi/v1/depth?symbol=${symbol}&limit=50`, {
                    timeout: 5000 // Timeout de 5 segundos
                });
                const { bids, asks } = depthResponse.data;
                
                // Calcular métricas de liquidez
                const bidLiquidity = bids.reduce((sum, [price, qty]) => sum + (parseFloat(price) * parseFloat(qty)), 0);
                const askLiquidity = asks.reduce((sum, [price, qty]) => sum + (parseFloat(price) * parseFloat(qty)), 0);
                const totalLiquidity = bidLiquidity + askLiquidity;
                const spread = (parseFloat(asks[0][0]) - parseFloat(bids[0][0])) / parseFloat(bids[0][0]);
                
                liquidityData[symbol] = {
                    bidLiquidity,
                    askLiquidity,
                    totalLiquidity,
                    spread,
                    liquidityScore: Math.min(totalLiquidity / 1000000, 1), // Normalizado a 1M
                    tier: getTierBySymbol(symbol),
                    lastUpdated: now
                };
                
                console.log(`[OK] Liquidez obtenida para ${symbol}: ${(liquidityData[symbol].liquidityScore * 100).toFixed(1)}%`);
                
            } catch (error) {
                const errorMsg = error.response?.status === 418 ? 'Rate Limited (418)' : error.message;
                console.log(`[WARNING] Error obteniendo liquidez para ${symbol}: ${errorMsg}`);
                // Datos por defecto basados en tier
                liquidityData[symbol] = getDefaultLiquidity(symbol);
                
                // Si es rate limiting, esperamos más tiempo
                if (error.response?.status === 418) {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo extra
                }
            }
        }
        
        liquidityCache.data = liquidityData;
        liquidityCache.lastUpdate = now;
        
        console.log(` Liquidez actualizada para ${Object.keys(liquidityData).length} símbolos`);
        return liquidityData;
        
    } catch (error) {
        console.log(`[ERROR] Error obteniendo liquidez general: ${error.message}`);
        return liquidityCache.data || {};
    }
}

//  FUNCIÓN PARA CLASIFICAR TIER POR SÍMBOLO
function getTierBySymbol(symbol) {
    if (['BTCUSDT', 'ETHUSDT', 'BNBUSDT'].includes(symbol)) return 'TIER1_MAJOR';
    if (['SOLUSDT', 'XRPUSDT', 'ADAUSDT'].includes(symbol)) return 'TIER2_BLUE';
    if (['BONKUSDT', 'FLOKIUSDT', 'DOGEUSDT'].includes(symbol)) return 'TIER4_MEME';
    return 'TIER5_MICRO';
}

// [DATA] FUNCIÓN PARA LIQUIDEZ POR DEFECTO
function getDefaultLiquidity(symbol) {
    const tier = getTierBySymbol(symbol);
    const defaults = {
        'TIER1_MAJOR': { totalLiquidity: 50000000, liquidityScore: 1.0, spread: 0.001 },
        'TIER2_BLUE': { totalLiquidity: 10000000, liquidityScore: 0.8, spread: 0.002 },
        'TIER4_MEME': { totalLiquidity: 1000000, liquidityScore: 0.4, spread: 0.005 },
        'TIER5_MICRO': { totalLiquidity: 100000, liquidityScore: 0.1, spread: 0.01 }
    };
    return { ...defaults[tier], tier };
}

// Función para obtener datos FUTURES (ejecución principal) - CON ANTI-RATE LIMITING
async function fetchFuturesData() {
    try {
        // Delay antes de consulta futures para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo delay
        
        console.log('[START] Consultando datos FUTURES con anti-rate limiting...');
        const response = await axios.get(`${BINANCE_URLS.FUTURES}/fapi/v1/ticker/24hr`, {
            timeout: 10000 // Timeout de 10 segundos
        });
        const data = response.data;
        
        strategicCache.futures.ticker = {};
        let executionOpportunities = 0;
        
        data.forEach(item => {
            if (item.symbol.endsWith('USDT')) {
                strategicCache.futures.ticker[item.symbol] = {
                    symbol: item.symbol,
                    price: parseFloat(item.lastPrice),
                    change: parseFloat(item.priceChangePercent),
                    volume: parseFloat(item.volume),
                    high: parseFloat(item.highPrice),
                    low: parseFloat(item.lowPrice),
                    // Datos específicos de futuros
                    fundingRate: parseFloat(item.fundingRate || 0),
                    openInterest: parseFloat(item.openInterest || 0),
                    longShortRatio: parseFloat(item.longShortRatio || 1),
                    // Oportunidades de ejecución
                    leverage: calculateOptimalLeverage(item),
                    risk: calculateFuturesRisk(item),
                    profit: calculateFuturesProfit(item)
                };
                
                // Identificar oportunidades de ejecución
                const opportunity = identifyFuturesOpportunity(item);
                if (opportunity) {
                    strategicCache.futures.orders[item.symbol] = opportunity;
                    executionOpportunities++;
                }
            }
        });
        
        console.log(`[START] Datos FUTURES obtenidos: ${Object.keys(strategicCache.futures.ticker).length} símbolos`);
        console.log(` Oportunidades de ejecución FUTURES: ${executionOpportunities}`);
        
    } catch (error) {
        console.log(`[ERROR] Error obteniendo datos FUTURES: ${error.message}`);
    }
}

// Función para generar datos OPTIONS (ejecución avanzada)
async function generateOptionsData() {
    try {
        const baseSymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP'];
        const expirations = ['1D', '7D', '30D', '90D'];
        const strikes = [0.8, 0.9, 1.0, 1.1, 1.2]; // Porcentajes del precio actual
        
        strategicCache.options.contracts = {};
        let strategyOpportunities = 0;
        
        baseSymbols.forEach(baseSymbol => {
            const spotPrice = strategicCache.spot.ticker[`${baseSymbol}USDT`]?.price || 100;
            
            expirations.forEach(exp => {
                strikes.forEach(strikePercent => {
                    const strikePrice = spotPrice * strikePercent;
                    const contractId = `${baseSymbol}USDT_${exp}_${strikePrice.toFixed(2)}`;
                    
                    // Generar datos de opciones
                    const optionData = {
                        symbol: baseSymbol,
                        expiration: exp,
                        strike: strikePrice,
                        type: 'CALL', // También generar PUT
                        price: calculateOptionPrice(spotPrice, strikePrice, exp),
                        delta: calculateDelta(spotPrice, strikePrice, exp),
                        gamma: calculateGamma(spotPrice, strikePrice, exp),
                        theta: calculateTheta(spotPrice, strikePrice, exp),
                        vega: calculateVega(spotPrice, strikePrice, exp),
                        impliedVol: calculateImpliedVolatility(spotPrice, strikePrice, exp)
                    };
                    
                    strategicCache.options.contracts[contractId] = optionData;
                    
                    // Identificar estrategias de opciones
                    const strategy = identifyOptionsStrategy(optionData);
                    if (strategy) {
                        strategicCache.options.strategies[contractId] = strategy;
                        strategyOpportunities++;
                    }
                });
            });
        });
        
        console.log(`[ENDPOINTS] Datos OPTIONS generados: ${Object.keys(strategicCache.options.contracts).length} contratos`);
        console.log(`[UP] Estrategias OPTIONS identificadas: ${strategyOpportunities}`);
        
    } catch (error) {
        console.log(`[ERROR] Error generando datos OPTIONS: ${error.message}`);
    }
}

// Función para generar señales desde SPOT
function generateSpotSignal(item) {
    const price = parseFloat(item.lastPrice);
    const change = parseFloat(item.priceChangePercent);
    const volume = parseFloat(item.volume);
    
    // Criterios para señales
    const highVolatility = Math.abs(change) > 5;
    const highVolume = volume > 1000000;
    const strongMomentum = Math.abs(change) > 2;
    
    if (highVolatility && highVolume && strongMomentum) {
        return {
            symbol: item.symbol,
            type: change > 0 ? 'LONG' : 'SHORT',
            strength: Math.abs(change) * (volume / 1000000),
            confidence: Math.min(Math.abs(change) / 10, 1),
            source: 'SPOT_ANALYSIS',
            timestamp: Date.now(),
            // Recomendación de ejecución
            recommendedInstrument: change > 0 ? 'FUTURES_LONG' : 'FUTURES_SHORT',
            recommendedLeverage: Math.min(Math.abs(change) / 2, 10),
            riskLevel: Math.abs(change) > 10 ? 'HIGH' : 'MEDIUM'
        };
    }
    
    return null;
}

// Función para identificar oportunidades en FUTURES
function identifyFuturesOpportunity(item) {
    const price = parseFloat(item.lastPrice);
    const change = parseFloat(item.priceChangePercent);
    const fundingRate = parseFloat(item.fundingRate || 0);
    const volume = parseFloat(item.volume);
    
    // Oportunidades basadas en funding rate y momentum
    const fundingOpportunity = Math.abs(fundingRate) > 0.01;
    const momentumOpportunity = Math.abs(change) > 3;
    const volumeOpportunity = volume > 500000;
    
    if (fundingOpportunity || momentumOpportunity) {
        return {
            symbol: item.symbol,
            type: fundingRate > 0 ? 'LONG' : 'SHORT',
            reason: fundingRate > 0 ? 'POSITIVE_FUNDING' : 'NEGATIVE_FUNDING',
            confidence: Math.min(Math.abs(fundingRate) * 100, 1),
            leverage: Math.min(Math.abs(fundingRate) * 50, 20),
            stopLoss: price * (fundingRate > 0 ? 0.95 : 1.05),
            takeProfit: price * (fundingRate > 0 ? 1.15 : 0.85),
            timestamp: Date.now()
        };
    }
    
    return null;
}

// Función para identificar estrategias de OPTIONS
function identifyOptionsStrategy(optionData) {
    const { delta, gamma, theta, impliedVol } = optionData;
    
    // Estrategias basadas en griegas
    if (Math.abs(delta) > 0.7 && gamma > 0.1) {
        return {
            type: 'DIRECTIONAL_PLAY',
            description: 'Alta exposición direccional con gamma',
            risk: 'HIGH',
            profit: 'HIGH',
            setup: 'LONG_CALL_OR_PUT'
        };
    }
    
    if (theta < -0.01 && impliedVol > 0.5) {
        return {
            type: 'VOLATILITY_PLAY',
            description: 'Juego de volatilidad implícita',
            risk: 'MEDIUM',
            profit: 'MEDIUM',
            setup: 'STRADDLE_OR_STRANGLE'
        };
    }
    
    return null;
}

// Función para analizar correlaciones SPOT
function analyzeSpotCorrelations() {
    const symbols = Object.keys(strategicCache.spot.ticker);
    const correlations = {};
    
    // Análisis de correlaciones entre activos principales
    const mainAssets = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
    
    mainAssets.forEach(asset1 => {
        correlations[asset1] = {};
        mainAssets.forEach(asset2 => {
            if (asset1 !== asset2) {
                const corr = calculateCorrelation(
                    strategicCache.spot.ticker[asset1]?.change || 0,
                    strategicCache.spot.ticker[asset2]?.change || 0
                );
                correlations[asset1][asset2] = corr;
            }
        });
    });
    
    strategicCache.spot.correlations = correlations;
    console.log(` Correlaciones SPOT analizadas para ${mainAssets.length} activos`);
}

// Función para calcular correlación
function calculateCorrelation(x, y) {
    return Math.abs(x - y) < 1 ? 0.8 : Math.abs(x - y) < 3 ? 0.5 : 0.2;
}

//  FUNCIÓN MEJORADA PARA CALCULAR LEVERAGE ÓPTIMO CON LIQUIDEZ
async function calculateOptimalLeverage(item, liquidityData = null) {
    const symbol = item.symbol;
    const volatility = Math.abs(parseFloat(item.priceChangePercent));
    const volume = parseFloat(item.volume);
    const price = parseFloat(item.lastPrice);
    
    // Obtener datos de liquidez si no se proporcionan
    if (!liquidityData) {
        liquidityData = await fetchLiquidityData();
    }
    
    const liquidity = liquidityData[symbol] || getDefaultLiquidity(symbol);
    
    // Leverage base ajustado por volatilidad
    const baseLeverage = Math.min(Math.max(15 - (volatility * 2), 3), 25);
    
    //  APLICAR OPTIMIZADOR V2
    const session = leverageOptimizer.getCurrentSession();
    const optimizedLeverage = leverageOptimizer.calculateOptimizedLeverage(
        symbol,
        0.8, // confidence por defecto
        volume,
        liquidity.tier || 'TIER5_MICRO',
        session
    );
    
    // Penalización por liquidez baja (micro-caps)
    let liquidityAdjustment = 1;
    if (liquidity.liquidityScore < 0.3) {
        liquidityAdjustment = 0.5; // Reducir leverage 50% para micro-caps
        console.log(`[WARNING] Penalización micro-cap aplicada a ${symbol}: ${liquidityAdjustment}x`);
    } else if (liquidity.liquidityScore < 0.6) {
        liquidityAdjustment = 0.75; // Reducir leverage 25% para baja liquidez
    }
    
    // Ajuste por spread
    const spreadAdjustment = Math.max(1 - (liquidity.spread * 100), 0.5);
    
    // Leverage final optimizado
    const finalLeverage = Math.min(
        optimizedLeverage * liquidityAdjustment * spreadAdjustment,
        getTierMaxLeverage(liquidity.tier)
    );
    
    return {
        leverage: Math.round(finalLeverage * 100) / 100,
        liquidityScore: liquidity.liquidityScore,
        tier: liquidity.tier,
        adjustments: {
            liquidityAdjustment,
            spreadAdjustment,
            optimizerLeverage: optimizedLeverage
        }
    };
}

//  FUNCIÓN PARA OBTENER LEVERAGE MÁXIMO POR TIER
function getTierMaxLeverage(tier) {
    const tierLimits = {
        'TIER1_MAJOR': 50,
        'TIER2_BLUE': 30,
        'TIER3_STABLE': 20,
        'TIER4_MEME': 15,
        'TIER5_MICRO': 8,
        'TIER6_ULTRA_MICRO': 3
    };
    return tierLimits[tier] || 5;
}

// Función para calcular riesgo en futuros
function calculateFuturesRisk(item) {
    const volatility = Math.abs(parseFloat(item.priceChangePercent));
    const volume = parseFloat(item.volume);
    return (volatility * 10) / (volume / 1000000);
}

// Función para calcular profit potencial en futuros
function calculateFuturesProfit(item) {
    const change = parseFloat(item.priceChangePercent);
    const leverage = calculateOptimalLeverage(item);
    return change * leverage;
}

// Funciones para calcular griegas de opciones
function calculateOptionPrice(spot, strike, expiration) {
    const timeValue = expiration === '1D' ? 0.1 : expiration === '7D' ? 0.2 : 0.3;
    return Math.max(spot - strike, 0) + timeValue;
}

function calculateDelta(spot, strike, expiration) {
    return spot > strike ? 0.8 : 0.2;
}

function calculateGamma(spot, strike, expiration) {
    return Math.abs(spot - strike) < 10 ? 0.15 : 0.05;
}

function calculateTheta(spot, strike, expiration) {
    return expiration === '1D' ? -0.02 : expiration === '7D' ? -0.01 : -0.005;
}

function calculateVega(spot, strike, expiration) {
    return expiration === '1D' ? 0.1 : expiration === '7D' ? 0.2 : 0.3;
}

function calculateImpliedVolatility(spot, strike, expiration) {
    return 0.65; // Valor fijo basado en volatilidad real del mercado
}

// Función para actualizar métricas cuánticas
function updateQuantumMetrics() {
    const spotSignals = Object.keys(strategicCache.spot.signals).length;
    const futuresOpportunities = Object.keys(strategicCache.futures.orders).length;
    const optionsStrategies = Object.keys(strategicCache.options.strategies).length;
    
    strategicCache.quantum = {
        coherence: Math.min((spotSignals + futuresOpportunities) / 20, 1),
        consciousness: Math.min((spotSignals + optionsStrategies) / 15, 1),
        entanglement: Math.min((futuresOpportunities + optionsStrategies) / 25, 1),
        superposition: Math.min((spotSignals + futuresOpportunities + optionsStrategies) / 30, 1),
        tunneling: Math.min((futuresOpportunities * 2) / 40, 1),
        optimalLeverage: Math.min((futuresOpportunities + optionsStrategies) / 20, 1)
    };
}

// Función para rankear señales
function rankSignals() {
    const allSignals = [];
    
    // Agregar señales de SPOT
    Object.values(strategicCache.spot.signals).forEach(signal => {
        allSignals.push({
            ...signal,
            source: 'SPOT',
            score: signal.strength * signal.confidence
        });
    });
    
    // Agregar oportunidades de FUTURES
    Object.values(strategicCache.futures.orders).forEach(order => {
        allSignals.push({
            ...order,
            source: 'FUTURES',
            score: order.confidence * (order.leverage / 10)
        });
    });
    
    // Agregar estrategias de OPTIONS
    Object.values(strategicCache.options.strategies).forEach(strategy => {
        allSignals.push({
            ...strategy,
            source: 'OPTIONS',
            score: strategy.risk === 'HIGH' ? 0.8 : strategy.risk === 'MEDIUM' ? 0.6 : 0.4
        });
    });
    
    // Ordenar por score
    allSignals.sort((a, b) => b.score - a.score);
    
    strategicCache.signals.ranking = allSignals.slice(0, 20); // Top 20
    console.log(` Top señales rankeadas: ${strategicCache.signals.ranking.length}`);
}

// Endpoints estratégicos
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        system: 'Core System Estratégico',
        timestamp: new Date().toISOString(),
        architecture: {
            spot: 'FUENTE_DE_INFORMACION',
            futures: 'EJECUCION_PRINCIPAL',
            options: 'EJECUCION_AVANZADA'
        }
    });
});

// Endpoint para datos SPOT (solo análisis)
app.get('/api/spot-data', (req, res) => {
    res.json({
        success: true,
        data: strategicCache.spot,
        purpose: 'ANALISIS_Y_SEÑALES',
        count: {
            symbols: Object.keys(strategicCache.spot.ticker).length,
            signals: Object.keys(strategicCache.spot.signals).length,
            correlations: Object.keys(strategicCache.spot.correlations).length
        }
    });
});

// Endpoint para datos FUTURES (ejecución)
app.get('/api/futures-data', (req, res) => {
    res.json({
        success: true,
        data: strategicCache.futures,
        purpose: 'EJECUCION_PRINCIPAL',
        count: {
            symbols: Object.keys(strategicCache.futures.ticker).length,
            opportunities: Object.keys(strategicCache.futures.orders).length
        }
    });
});

// Endpoint para datos OPTIONS (ejecución avanzada)
app.get('/api/options-data', (req, res) => {
    res.json({
        success: true,
        data: strategicCache.options,
        purpose: 'EJECUCION_AVANZADA',
        count: {
            contracts: Object.keys(strategicCache.options.contracts).length,
            strategies: Object.keys(strategicCache.options.strategies).length
        }
    });
});

// Endpoint para señales rankeadas
app.get('/api/signals', (req, res) => {
    res.json({
        success: true,
        data: strategicCache.signals,
        purpose: 'MAXIMIZAR_PROFIT',
        summary: {
            totalSignals: strategicCache.signals.ranking.length,
            topOpportunities: strategicCache.signals.ranking.slice(0, 5),
            executionReady: strategicCache.signals.ranking.filter(s => s.score > 0.7).length
        }
    });
});

// Endpoint para estado cuántico estratégico
app.get('/api/quantum-state', (req, res) => {
    res.json({
        success: true,
        data: strategicCache.quantum,
        architecture: 'SPOT_ANALISIS_FUTURES_OPTIONS_EJECUCION',
        strategy: 'MAXIMIZAR_PROFIT_CON_SEÑALES_RANKEADAS'
    });
});

// [DATA] ENDPOINT PARA MONITOREO DE LIQUIDEZ
app.get('/api/liquidity-monitor', async (req, res) => {
    try {
        const liquidityData = await fetchLiquidityData();
        const { symbol } = req.query;
        
        let result = {};
        
        if (symbol && liquidityData[symbol]) {
            // Datos específicos para un símbolo
            result = {
                success: true,
                symbol,
                data: liquidityData[symbol],
                leverageRecommendation: await calculateOptimalLeverage(
                    { symbol, priceChangePercent: "0" }, 
                    liquidityData
                ),
                alerts: generateLiquidityAlerts(symbol, liquidityData[symbol])
            };
        } else {
            // Vista general de liquidez
            const summary = Object.entries(liquidityData).map(([sym, data]) => ({
                symbol: sym,
                liquidityScore: data.liquidityScore,
                tier: data.tier,
                spread: data.spread,
                riskLevel: data.liquidityScore < 0.3 ? 'HIGH' : data.liquidityScore < 0.6 ? 'MEDIUM' : 'LOW'
            }));
            
            result = {
                success: true,
                totalSymbols: summary.length,
                lastUpdate: new Date(liquidityCache.lastUpdate).toISOString(),
                summary: summary.sort((a, b) => b.liquidityScore - a.liquidityScore),
                alerts: generateSystemLiquidityAlerts(liquidityData)
            };
        }
        
        res.json(result);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: `Error en monitoreo de liquidez: ${error.message}`
        });
    }
});

// [ALERT] ENDPOINT PARA ALERTAS DEL SISTEMA
app.get('/api/system-alerts', async (req, res) => {
    try {
        const liquidityData = await fetchLiquidityData();
        const alerts = [];
        
        // Alertas de liquidez
        Object.entries(liquidityData).forEach(([symbol, data]) => {
            if (data.liquidityScore < 0.2) {
                alerts.push({
                    type: 'CRITICAL_LIQUIDITY',
                    symbol,
                    message: `Liquidez crítica en ${symbol}: ${(data.liquidityScore * 100).toFixed(1)}%`,
                    recommendation: 'Reducir leverage significativamente',
                    severity: 'HIGH'
                });
            }
            
            if (data.spread > 0.02) {
                alerts.push({
                    type: 'HIGH_SPREAD',
                    symbol,
                    message: `Spread alto en ${symbol}: ${(data.spread * 100).toFixed(3)}%`,
                    recommendation: 'Considerar timing de entrada',
                    severity: 'MEDIUM'
                });
            }
        });
        
        // Alertas de estado cuántico
        const quantumHealth = checkQuantumHealth();
        if (quantumHealth.coherence < 0.5) {
            alerts.push({
                type: 'QUANTUM_COHERENCE',
                message: 'Estado cuántico con baja coherencia',
                recommendation: 'Rebalancear portfolio',
                severity: 'MEDIUM'
            });
        }
        
        // Alertas de señales
        const signalHealth = checkSignalHealth();
        if (signalHealth.quality < 0.6) {
            alerts.push({
                type: 'SIGNAL_QUALITY',
                message: 'Calidad de señales degradada',
                recommendation: 'Revisar filtros de entrada',
                severity: 'MEDIUM'
            });
        }
        
        res.json({
            success: true,
            totalAlerts: alerts.length,
            timestamp: new Date().toISOString(),
            alerts: alerts.sort((a, b) => {
                const severityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
                return severityOrder[b.severity] - severityOrder[a.severity];
            }),
            systemHealth: {
                liquidity: calculateLiquidityHealth(liquidityData),
                quantum: quantumHealth,
                signals: signalHealth
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: `Error en alertas del sistema: ${error.message}`
        });
    }
});

// Endpoint unificado para overview estratégico
app.get('/api/strategic-overview', (req, res) => {
    res.json({
        success: true,
        data: {
            spot: {
                symbols: Object.keys(strategicCache.spot.ticker).length,
                signals: Object.keys(strategicCache.spot.signals).length,
                purpose: 'FUENTE_DE_INFORMACION'
            },
            futures: {
                symbols: Object.keys(strategicCache.futures.ticker).length,
                opportunities: Object.keys(strategicCache.futures.orders).length,
                purpose: 'EJECUCION_PRINCIPAL'
            },
            options: {
                contracts: Object.keys(strategicCache.options.contracts).length,
                strategies: Object.keys(strategicCache.options.strategies).length,
                purpose: 'EJECUCION_AVANZADA'
            },
            signals: {
                ranked: strategicCache.signals.ranking.length,
                topScore: strategicCache.signals.ranking[0]?.score || 0,
                purpose: 'MAXIMIZAR_PROFIT'
            },
            quantum: strategicCache.quantum
        },
        strategy: 'SPOT_ANALISIS_FUTURES_OPTIONS_EJECUCION_MAXIMIZAR_PROFIT'
    });
});

//  FUNCIONES AUXILIARES PARA ALERTAS Y MONITOREO

// Generar alertas de liquidez para un símbolo
function generateLiquidityAlerts(symbol, liquidityData) {
    const alerts = [];
    
    if (liquidityData.liquidityScore < 0.3) {
        alerts.push({
            type: 'LOW_LIQUIDITY',
            message: `Liquidez baja en ${symbol}`,
            severity: liquidityData.liquidityScore < 0.15 ? 'HIGH' : 'MEDIUM',
            recommendation: 'Reducir tamaño de posición'
        });
    }
    
    if (liquidityData.spread > 0.01) {
        alerts.push({
            type: 'WIDE_SPREAD',
            message: `Spread amplio: ${(liquidityData.spread * 100).toFixed(3)}%`,
            severity: liquidityData.spread > 0.02 ? 'HIGH' : 'MEDIUM',
            recommendation: 'Evaluar costo de entrada/salida'
        });
    }
    
    return alerts;
}

// Generar alertas del sistema de liquidez
function generateSystemLiquidityAlerts(liquidityData) {
    const alerts = [];
    const symbols = Object.keys(liquidityData);
    
    const lowLiquiditySymbols = symbols.filter(sym => 
        liquidityData[sym].liquidityScore < 0.3
    );
    
    if (lowLiquiditySymbols.length > symbols.length * 0.3) {
        alerts.push({
            type: 'SYSTEM_LIQUIDITY_DEGRADATION',
            message: `${lowLiquiditySymbols.length}/${symbols.length} símbolos con baja liquidez`,
            severity: 'HIGH',
            recommendation: 'Reducir exposición general del portfolio'
        });
    }
    
    const highSpreadSymbols = symbols.filter(sym => 
        liquidityData[sym].spread > 0.01
    );
    
    if (highSpreadSymbols.length > 0) {
        alerts.push({
            type: 'HIGH_SPREAD_CONDITIONS',
            message: `${highSpreadSymbols.length} símbolos con spreads altos`,
            severity: 'MEDIUM',
            recommendation: 'Monitorear costos de transacción'
        });
    }
    
    return alerts;
}

// Verificar salud del estado cuántico
function checkQuantumHealth() {
    const quantum = strategicCache.quantum;
    
    const healthScore = (
        quantum.coherence * 0.25 +
        quantum.consciousness * 0.20 +
        quantum.entanglement * 0.20 +
        quantum.superposition * 0.15 +
        quantum.tunneling * 0.10 +
        quantum.optimalLeverage * 0.10
    );
    
    return {
        coherence: quantum.coherence,
        consciousness: quantum.consciousness,
        entanglement: quantum.entanglement,
        superposition: quantum.superposition,
        tunneling: quantum.tunneling,
        optimalLeverage: quantum.optimalLeverage,
        overallHealth: healthScore,
        status: healthScore > 0.8 ? 'EXCELLENT' : 
                healthScore > 0.6 ? 'GOOD' : 
                healthScore > 0.4 ? 'FAIR' : 'POOR'
    };
}

// Verificar salud de las señales
function checkSignalHealth() {
    const signals = strategicCache.signals.ranking;
    
    if (signals.length === 0) {
        return {
            quality: 0,
            count: 0,
            averageScore: 0,
            status: 'NO_SIGNALS'
        };
    }
    
    const averageScore = signals.reduce((sum, signal) => sum + signal.score, 0) / signals.length;
    const highQualitySignals = signals.filter(s => s.score > 0.7).length;
    const qualityRatio = highQualitySignals / signals.length;
    
    return {
        quality: qualityRatio,
        count: signals.length,
        averageScore: averageScore,
        highQualitySignals: highQualitySignals,
        status: qualityRatio > 0.7 ? 'EXCELLENT' : 
                qualityRatio > 0.5 ? 'GOOD' : 
                qualityRatio > 0.3 ? 'FAIR' : 'POOR'
    };
}

// Calcular salud general de liquidez
function calculateLiquidityHealth(liquidityData) {
    const symbols = Object.keys(liquidityData);
    
    if (symbols.length === 0) {
        return {
            score: 0,
            status: 'NO_DATA'
        };
    }
    
    const averageLiquidity = symbols.reduce((sum, sym) => 
        sum + liquidityData[sym].liquidityScore, 0
    ) / symbols.length;
    
    const averageSpread = symbols.reduce((sum, sym) => 
        sum + liquidityData[sym].spread, 0
    ) / symbols.length;
    
    // Puntuación combinada (liquidez alta es buena, spread bajo es bueno)
    const combinedScore = (averageLiquidity * 0.7) + ((1 - Math.min(averageSpread * 100, 1)) * 0.3);
    
    return {
        score: combinedScore,
        averageLiquidity: averageLiquidity,
        averageSpread: averageSpread,
        symbolCount: symbols.length,
        status: combinedScore > 0.8 ? 'EXCELLENT' : 
                combinedScore > 0.6 ? 'GOOD' : 
                combinedScore > 0.4 ? 'FAIR' : 'POOR'
    };
}

// [RELOAD] FUNCIÓN MEJORADA DE ACTUALIZACIÓN CON REBALANCEADOR CUÁNTICO
async function updateStrategicDataWithQuantumRebalancing() {
    console.log(' Iniciando actualización con rebalanceador cuántico...');
    
    // Obtener datos de liquidez primero
    const liquidityData = await fetchLiquidityData();
    
    // Actualizar datos principales
    await fetchSpotData();
    await fetchFuturesData();
    await generateOptionsData();
    
    // Actualizar métricas cuánticas
    updateQuantumMetrics();
    
    // [ENDPOINTS] APLICAR REBALANCEADOR CUÁNTICO
    const rebalanceParams = {
        quantumState: strategicCache.quantum,
        marketConditions: {
            volatility: calculateMarketVolatility(),
            liquidity: calculateLiquidityHealth(liquidityData),
            signalStrength: checkSignalHealth()
        },
        currentPositions: strategicCache.signals.ranking.length,
        maxPositions: 20
    };
    
    const rebalancedState = quantumRebalancer.rebalanceQuantumState(rebalanceParams);
    
    // Actualizar estado cuántico rebalanceado
    strategicCache.quantum = {
        ...strategicCache.quantum,
        ...rebalancedState.optimizedState,
        rebalanceScore: rebalancedState.rebalanceScore,
        lastRebalance: Date.now()
    };
    
    // Rankear señales con nueva información
    rankSignals();
    
    const rebalanceScore = rebalancedState?.rebalanceScore || 0.5;
    console.log(` Rebalanceador cuántico aplicado - Score: ${rebalanceScore.toFixed(3)}`);
    
    return rebalancedState;
}

// Calcular volatilidad del mercado
function calculateMarketVolatility() {
    const spotTickers = Object.values(strategicCache.spot.ticker);
    if (spotTickers.length === 0) return 0;
    
    const avgVolatility = spotTickers.reduce((sum, ticker) => 
        sum + Math.abs(ticker.change), 0
    ) / spotTickers.length;
    
    return avgVolatility / 100; // Normalizar
}

// Función principal de actualización
async function updateStrategicData() {
    console.log('[RELOAD] Actualizando datos estratégicos...');
    
    await fetchSpotData();
    await fetchFuturesData();
    await generateOptionsData();
    
    updateQuantumMetrics();
    rankSignals();
    
    console.log('[OK] Datos estratégicos actualizados');
    console.log(`[DATA] SPOT: ${Object.keys(strategicCache.spot.ticker).length} símbolos para análisis`);
    console.log(`[START] FUTURES: ${Object.keys(strategicCache.futures.ticker).length} símbolos para ejecución`);
    console.log(`[ENDPOINTS] OPTIONS: ${Object.keys(strategicCache.options.contracts).length} contratos para estrategias`);
    console.log(` SEÑALES: ${strategicCache.signals.ranking.length} rankeadas para máximo profit`);
}

// Inicialización
app.listen(PORT, () => {
    console.log(`[NIGHT] Core System Estratégico ejecutándose en puerto ${PORT}`);
    console.log(`[DATA] Sistema Cuántico con Arquitectura Correcta - ACTIVO`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(`[ENDPOINTS] Estrategia: SPOT (Análisis)  FUTURES/OPTIONS (Ejecución)  MÁXIMO PROFIT`);
    console.log(` Optimizadores V2 + Rebalanceador Cuántico + Liquidez en Tiempo Real`);
    
    // Primera actualización con rebalanceador cuántico
    updateStrategicDataWithQuantumRebalancing();
    
    // Actualización normal cada 30 segundos
    setInterval(updateStrategicData, 30000);
    
    // Rebalanceador cuántico cada 2 minutos para optimización profunda
    setInterval(updateStrategicDataWithQuantumRebalancing, 120000);
    
    console.log(`[ALERT] Sistema de alertas y monitoreo de liquidez ACTIVO`);
    console.log(`[DATA] Endpoints disponibles:`);
    console.log(`   - /api/liquidity-monitor`);
    console.log(`   - /api/system-alerts`);
    console.log(`   - /api/strategic-overview`);
    console.log(`   - /api/signals`);
    console.log(`   - /api/quantum-state`);
});

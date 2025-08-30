
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

const BinanceConnector = require('./binance-connector');

async function debugBinanceConnector() {
    console.log('[SEARCH] [DEBUG] Iniciando análisis de BinanceConnector...\n');
    
    try {
        // Test 1: Crear instancia con configuración básica
        console.log('[LIST] [TEST 1] Creando BinanceConnector con configuración básica...');
        const config = {
            apiKey: process.env.BINANCE_API_KEY || 'test',
            secretKey: process.env.BINANCE_SECRET_KEY || 'test',
            testnet: process.env.BINANCE_TESTNET === 'true' || true,
            enableLogging: true
        };
        
        console.log('Configuración:', config);
        const binance = new BinanceConnector(config);
        
        // Test 2: Verificar métodos disponibles
        console.log('\n[LIST] [TEST 2] Verificando métodos disponibles...');
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(binance));
        console.log('Métodos disponibles:', methods);
        
        // Test 3: Verificar si makeUnsignedRequest existe
        console.log('\n[LIST] [TEST 3] Verificando makeUnsignedRequest...');
        if (typeof binance.makeUnsignedRequest === 'function') {
            console.log('[OK] makeUnsignedRequest está disponible');
        } else {
            console.log('[ERROR] makeUnsignedRequest NO está disponible');
        }
        
        // Test 4: Verificar si makeRequest existe (causa del error)
        console.log('\n[LIST] [TEST 4] Verificando makeRequest...');
        if (typeof binance.makeRequest === 'function') {
            console.log('[OK] makeRequest está disponible');
        } else {
            console.log('[ERROR] makeRequest NO está disponible (esto es correcto)');
        }
        
        // Test 5: Verificar configuración
        console.log('\n[LIST] [TEST 5] Verificando configuración...');
        console.log('Config del binance:', binance.config);
        
        // Test 6: Intentar hacer una llamada real
        console.log('\n[LIST] [TEST 6] Intentando llamada real...');
        try {
            const url = `${binance.config.futuresBaseUrl}/klines`;
            const params = {
                symbol: 'BTCUSDT',
                interval: '1h',
                limit: 10
            };
            
            console.log('URL:', url);
            console.log('Params:', params);
            
            const result = await binance.makeUnsignedRequest(url, params);
            console.log('[OK] Llamada exitosa, resultado:', result.length, 'elementos');
        } catch (error) {
            console.log('[ERROR] Error en llamada:', error.message);
        }
        
    } catch (error) {
        console.log('[ERROR] [ERROR] Error general:', error.message);
        console.log('Stack:', error.stack);
    }
}

debugBinanceConnector();

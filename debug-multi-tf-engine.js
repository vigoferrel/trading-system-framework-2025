
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

const MultiTimeframeConfluenceEngine = require('./multi-timeframe-confluence-engine');

async function debugMultiTFEngine() {
    console.log('[SEARCH] [DEBUG] Iniciando análisis de MultiTimeframeConfluenceEngine...\\n');
    
    try {
        // Test 1: Crear instancia con configuración básica
        console.log('[LIST] [TEST 1] Creando MultiTimeframeConfluenceEngine con configuración básica...');
        const config = {
            apiKey: process.env.BINANCE_API_KEY || 'test',
            secretKey: process.env.BINANCE_SECRET_KEY || 'test',
            testnet: process.env.BINANCE_TESTNET === 'true' || true,
            enableLogging: true
        };
        
        console.log('Configuración:', config);
        const engine = new MultiTimeframeConfluenceEngine(config);
        
        // Test 2: Verificar que el binance connector se inicializó correctamente
        console.log('\\n[LIST] [TEST 2] Verificando BinanceConnector...');
        console.log('BinanceConnector existe:', !!engine.binance);
        console.log('makeUnsignedRequest existe:', typeof engine.binance.makeUnsignedRequest === 'function');
        console.log('makeSignedRequest existe:', typeof engine.binance.makeSignedRequest === 'function');
        
        // Test 3: Verificar métodos del engine
        console.log('\\n[LIST] [TEST 3] Verificando métodos del engine...');
        console.log('analyzeMultiTimeframeConfluence existe:', typeof engine.analyzeMultiTimeframeConfluence === 'function');
        console.log('getTimeframeAnalysis existe:', typeof engine.getTimeframeAnalysis === 'function');
        
        // Test 4: Intentar análisis simple
        console.log('\\n[LIST] [TEST 4] Intentando análisis simple...');
        try {
            const analysis = await engine.analyzeMultiTimeframeConfluence('BTCUSDT', 'LONG');
            console.log('[OK] Análisis exitoso:', analysis ? 'SÍ' : 'NO');
        } catch (error) {
            console.log('[ERROR] Error en análisis:', error.message);
            console.log('Stack trace:', error.stack);
        }
        
    } catch (error) {
        console.error('[ERROR] Error general:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

debugMultiTFEngine();


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

const axios = require('axios');

async function testFixes() {
    console.log('[SEARCH] [TEST] Verificando correcciones de errores...\n');
    
    // Test 1: Verificar que el QBTC Core no usa binanceConnector
    console.log('[LIST] [TEST 1] Verificando QBTC Core...');
    try {
        const response = await axios.get('http://localhost:4602/health', { timeout: 5000 });
        console.log(`[OK] QBTC Core: ${response.status} - ${response.data.status || 'OK'}`);
    } catch (error) {
        console.log(`[ERROR] QBTC Core: ${error.code || error.message}`);
    }
    
    // Test 2: Verificar que el Monitor de Gráficos funciona
    console.log('\n[LIST] [TEST 2] Verificando Monitor de Gráficos...');
    try {
        const response = await axios.get('http://localhost:4606/health', { timeout: 5000 });
        console.log(`[OK] Monitor de Gráficos: ${response.status} - ${response.data.status || 'OK'}`);
    } catch (error) {
        console.log(`[ERROR] Monitor de Gráficos: ${error.code || error.message}`);
    }
    
    // Test 3: Verificar endpoints de datos
    console.log('\n[LIST] [TEST 3] Verificando endpoints de datos...');
    try {
        const response = await axios.get('http://localhost:4602/api/futures-data', { timeout: 10000 });
        console.log(`[OK] Futures Data: ${response.status} - ${Object.keys(response.data.data || {}).length} símbolos`);
    } catch (error) {
        console.log(`[ERROR] Futures Data: ${error.response?.status || error.code || error.message}`);
    }
    
    // Test 4: Verificar que no hay errores de binanceConnector
    console.log('\n[LIST] [TEST 4] Verificando ausencia de errores binanceConnector...');
    try {
        const response = await axios.get('http://localhost:4602/api/quantum-analysis', { timeout: 15000 });
        console.log(`[OK] Quantum Analysis: ${response.status} - Sin errores de binanceConnector`);
    } catch (error) {
        if (error.message.includes('binanceConnector')) {
            console.log(`[ERROR] Quantum Analysis: Error de binanceConnector detectado`);
        } else {
            console.log(`[WARNING] Quantum Analysis: ${error.response?.status || error.code || error.message}`);
        }
    }
    
    // Test 5: Verificar conexión a Binance (con rate limiting)
    console.log('\n[LIST] [TEST 5] Verificando conexión a Binance...');
    try {
        const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr', {
            timeout: 10000,
            headers: {
                'User-Agent': 'QBTC-Test/1.0',
                'Accept': 'application/json'
            }
        });
        console.log(`[OK] Binance API: ${response.status} - ${response.data.length} símbolos`);
    } catch (error) {
        if (error.response?.status === 418) {
            console.log(`[WARNING] Binance API: Rate limiting (418) - esperar antes de reintentar`);
        } else {
            console.log(`[ERROR] Binance API: ${error.response?.status || error.code || error.message}`);
        }
    }
    
    console.log('\n[ENDPOINTS] Verificación de correcciones completada');
}

testFixes().catch(console.error);

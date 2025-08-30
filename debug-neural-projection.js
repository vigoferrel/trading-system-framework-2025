
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

const { RealPriceManager } = require('./qbtc-unified-prime-quantum-system');

async function debugNeuralProjection() {
    console.log('[SEARCH] [DEBUG] Iniciando análisis de proyección neural...\\n');
    
    try {
        // Test 1: Crear RealPriceManager
        console.log('[LIST] [TEST 1] Creando RealPriceManager...');
        const priceManager = new RealPriceManager();
        
        // Test 2: Obtener precio para BTCUSDT
        console.log('\\n[LIST] [TEST 2] Obteniendo precio para BTCUSDT...');
        const price = await priceManager.getCurrentPrice('BTCUSDT');
        console.log('Precio obtenido:', price);
        console.log('Es válido:', !isNaN(price) && price > 0);
        
        // Test 3: Verificar que el precio no sea NaN
        console.log('\\n[LIST] [TEST 3] Verificando validación de precio...');
        const testPrice = price || 50000;
        console.log('Precio final:', testPrice);
        console.log('Es NaN:', isNaN(testPrice));
        console.log('Es > 0:', testPrice > 0);
        
    } catch (error) {
        console.error('[ERROR] Error:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

debugNeuralProjection();

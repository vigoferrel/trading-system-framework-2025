
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
 * [SEARCH] TEST DASHBOARD DATA
 * Script para verificar la estructura de datos del endpoint master-analysis
 */

const axios = require('axios');

async function testDashboardData() {
    try {
        console.log('[SEARCH] [TEST] Verificando estructura de datos del dashboard...');
        
        // Probar endpoint de market health
        console.log('\n[DATA] [TEST] Probando /api/market-health...');
        const healthResponse = await axios.get('http://localhost:4601/api/market-health');
        console.log('[OK] Market Health Response:', JSON.stringify(healthResponse.data, null, 2));
        
        // Probar endpoint de master analysis
        console.log('\n [TEST] Probando /api/master-analysis/BTCUSDT...');
        const analysisResponse = await axios.get('http://localhost:4601/api/master-analysis/BTCUSDT?timeHorizon=7d');
        
        const analysis = analysisResponse.data.data;
        console.log('[OK] Master Analysis Response Structure:');
        console.log('- Symbol:', analysis.symbol);
        console.log('- Timestamp:', analysis.analysis_timestamp);
        console.log('- Time Horizon:', analysis.time_horizon);
        
        // Buscar precios en la estructura
        console.log('\n[MONEY] [TEST] Buscando precios en la estructura...');
        
        if (analysis.detailed_analysis) {
            console.log('- detailed_analysis.market_intelligence.current_price:', 
                analysis.detailed_analysis.market_intelligence?.current_price);
            console.log('- detailed_analysis.neural_projection.current_price:', 
                analysis.detailed_analysis.neural_projection?.current_price);
        }
        
        if (analysis.market_intelligence) {
            console.log('- market_intelligence.current_price:', 
                analysis.market_intelligence.current_price);
        }
        
        if (analysis.neural_projection) {
            console.log('- neural_projection.current_price:', 
                analysis.neural_projection.current_price);
        }
        
        console.log('- current_price:', analysis.current_price);
        
        // Buscar decisiones
        console.log('\n[ENDPOINTS] [TEST] Buscando decisiones en la estructura...');
        console.log('- final_master_decision:', analysis.final_master_decision);
        
        // Mostrar estructura completa si es necesario
        console.log('\n[LIST] [TEST] Estructura completa (primeros 1000 caracteres):');
        console.log(JSON.stringify(analysis, null, 2).substring(0, 1000) + '...');
        
    } catch (error) {
        console.error('[RED] [TEST] Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Ejecutar test
testDashboardData();

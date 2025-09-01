
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

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

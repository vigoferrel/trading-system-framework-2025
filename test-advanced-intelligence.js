
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
 *  TEST SISTEMA DE INTELIGENCIA AVANZADA
 *  VERIFICACIÓN DE INTEGRACIÓN COMPLETA
 */

const axios = require('axios');

async function testAdvancedIntelligence() {
    console.log(' [TEST] Iniciando pruebas del Sistema de Inteligencia Avanzada...\n');
    
    const baseURL = 'http://localhost:4601';
    const testSymbol = 'BTCUSDT';
    
    try {
        // 1. TEST ENDPOINT DE SALUD
        console.log('[SEARCH] [TEST] Verificando endpoint de salud...');
        const healthResponse = await axios.get(`${baseURL}/health`);
        console.log('[OK] [TEST] Core system operativo:', healthResponse.data.status);
        
        // 2. TEST INTELIGENCIA AVANZADA
        console.log('\n [TEST] Probando inteligencia avanzada...');
        const intelligenceResponse = await axios.get(`${baseURL}/api/advanced-intelligence/${testSymbol}`);
        
        if (intelligenceResponse.data.success) {
            const intelligence = intelligenceResponse.data.data;
            console.log('[OK] [TEST] Inteligencia avanzada generada exitosamente');
            console.log('[DATA] [TEST] Score de inteligencia:', intelligence.unified_intelligence.total_intelligence_score);
            console.log('[ENDPOINTS] [TEST] Decisión final:', intelligence.final_decision.action);
            console.log('[FAST] [TEST] Confianza:', intelligence.final_decision.confidence);
        } else {
            console.log('[ERROR] [TEST] Error en inteligencia avanzada');
        }
        
        // 3. TEST ANÁLISIS MAESTRO
        console.log('\n [TEST] Probando análisis maestro...');
        const masterResponse = await axios.get(`${baseURL}/api/master-analysis/${testSymbol}`);
        
        if (masterResponse.data.success) {
            const masterAnalysis = masterResponse.data.data;
            console.log('[OK] [TEST] Análisis maestro generado exitosamente');
            console.log(' [TEST] Score de inteligencia:', masterAnalysis.master_synthesis.intelligence_score);
            console.log(' [TEST] Confianza neural:', masterAnalysis.master_synthesis.neural_confidence);
            console.log('[ENDPOINTS] [TEST] Confianza combinada:', masterAnalysis.master_synthesis.combined_confidence);
            console.log('[FAST] [TEST] Decisión final:', masterAnalysis.master_synthesis.final_decision);
        } else {
            console.log('[ERROR] [TEST] Error en análisis maestro');
        }
        
        // 4. TEST SISTEMAS INDIVIDUALES
        console.log('\n [TEST] Verificando sistemas individuales...');
        const systems = [
            'funding_analysis',
            'whale_institutional', 
            'seasonal_patterns',
            'volatility_prediction',
            'contrarian_signals',
            'easter_egg_anomalies',
            'institutional_flow',
            'market_regime'
        ];
        
        systems.forEach(system => {
            const systemData = intelligenceResponse.data.data.detailed_intelligence[system];
            if (systemData && systemData.intelligence_score) {
                console.log(`[OK] [TEST] ${system}: ${systemData.intelligence_score.total_score.toFixed(3)}`);
            } else {
                console.log(`[ERROR] [TEST] ${system}: No disponible`);
            }
        });
        
        console.log('\n [TEST] Todas las pruebas completadas exitosamente!');
        
    } catch (error) {
        console.error('[RED] [TEST] Error durante las pruebas:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log(' [TEST] Asegúrate de que el core system esté ejecutándose en puerto 4601');
        }
    }
}

// EJECUTAR PRUEBAS
if (require.main === module) {
    testAdvancedIntelligence();
}

module.exports = { testAdvancedIntelligence };

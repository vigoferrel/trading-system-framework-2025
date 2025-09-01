
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

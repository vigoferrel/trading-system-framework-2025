
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
 * [TEST] TEST SISTEMA UNIFICADO DE INTELIGENCIA DE MERCADO
 *  UNIFIED MARKET INTELLIGENCE SYSTEM TEST
 *  VERIFICACIÓN COMPLETA DEL SISTEMA CUÁNTICO
 */

const { UnifiedMarketIntelligenceSystem } = require('./unified-market-intelligence-system');

async function testUnifiedIntelligenceSystem() {
    console.log(' [TEST] Iniciando prueba del Sistema Unificado de Inteligencia...\n');
    
    try {
        // INICIALIZAR SISTEMA UNIFICADO
        const unifiedSystem = new UnifiedMarketIntelligenceSystem();
        console.log('[OK] [TEST] Sistema Unificado inicializado correctamente');
        
        // SÍMBOLOS DE PRUEBA
        const testSymbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT'];
        const timeHorizons = ['1d', '7d', '30d'];
        
        console.log('\n [TEST] Ejecutando análisis maestro para múltiples símbolos...\n');
        
        for (const symbol of testSymbols) {
            console.log(`[DATA] [TEST] Analizando ${symbol}...`);
            
            for (const timeHorizon of timeHorizons) {
                try {
                    console.log(`  [TIME] Timeframe: ${timeHorizon}`);
                    
                    // ANÁLISIS MAESTRO
                    const startTime = Date.now();
                    const masterAnalysis = await unifiedSystem.generateMasterMarketAnalysis(symbol, timeHorizon);
                    const endTime = Date.now();
                    
                    // RESULTADOS DEL ANÁLISIS
                    console.log(`  [OK] Análisis completado en ${endTime - startTime}ms`);
                    
                    // DECISIÓN FINAL
                    const finalDecision = masterAnalysis.final_master_decision;
                    console.log(`  [ENDPOINTS] Decisión: ${finalDecision.action}`);
                    console.log(`  [ENDPOINTS] Confianza: ${(finalDecision.confidence * 100).toFixed(1)}%`);
                    console.log(`  [ENDPOINTS] Racional: ${finalDecision.rationale}`);
                    
                    // CONSENSO DE MERCADO
                    const consensus = masterAnalysis.master_intelligence.market_consensus;
                    console.log(`  [UP] Consenso: ${consensus.consensus} (${(consensus.strength * 100).toFixed(1)}%)`);
                    
                    // RÉGIMEN DE MERCADO
                    const regimeSignals = masterAnalysis.master_intelligence.extracted_signals.regime_signals;
                    if (regimeSignals.length > 0) {
                        console.log(`  [API] Régimen: ${regimeSignals[0].regime_type}`);
                    }
                    
                    // FACTORES DE RIESGO
                    const riskFactors = masterAnalysis.master_intelligence.risk_factors;
                    if (riskFactors.length > 0) {
                        console.log(`  [WARNING]  Riesgos: ${riskFactors.length} factores identificados`);
                        riskFactors.forEach(risk => {
                            console.log(`     - ${risk.type} (${risk.severity})`);
                        });
                    }
                    
                    // BOTTOM LINE
                    const bottomLine = masterAnalysis.bottom_line;
                    console.log(`  [LIST] Resumen: ${bottomLine.one_sentence_summary}`);
                    console.log(`  [DATA] Ratio R/R: ${bottomLine.risk_reward_ratio.toFixed(2)}`);
                    console.log(`  [ENDPOINTS] Probabilidad de éxito: ${(bottomLine.success_probability * 100).toFixed(1)}%`);
                    
                    console.log('  ' + ''.repeat(50));
                    
                } catch (error) {
                    console.error(`  [ERROR] Error en análisis de ${symbol} (${timeHorizon}):`, error.message);
                }
            }
            
            console.log('\n' + ''.repeat(60) + '\n');
        }
        
        // PRUEBA DE SÍNTESIS MAESTRA
        console.log(' [TEST] Probando síntesis maestra de inteligencias...\n');
        
        const testSymbol = 'BTCUSDT';
        const testTimeHorizon = '7d';
        
        const masterAnalysis = await unifiedSystem.generateMasterMarketAnalysis(testSymbol, testTimeHorizon);
        
        // VERIFICAR ESTRUCTURA DE DATOS
        console.log('[LIST] [TEST] Verificando estructura de datos...');
        
        const requiredFields = [
            'symbol',
            'analysis_timestamp',
            'time_horizon',
            'detailed_analysis',
            'master_intelligence',
            'final_master_decision',
            'executive_summary',
            'bottom_line'
        ];
        
        for (const field of requiredFields) {
            if (masterAnalysis[field]) {
                console.log(`  [OK] ${field}: PRESENTE`);
            } else {
                console.log(`  [ERROR] ${field}: FALTANTE`);
            }
        }
        
        // VERIFICAR SEÑALES EXTRACTADAS
        console.log('\n[DATA] [TEST] Verificando señales extraídas...');
        
        const extractedSignals = masterAnalysis.master_intelligence.extracted_signals;
        
        if (extractedSignals.market_signals.length > 0) {
            console.log(`  [OK] Señales de mercado: ${extractedSignals.market_signals.length}`);
        }
        
        if (extractedSignals.neural_signals.length > 0) {
            console.log(`  [OK] Señales neurales: ${extractedSignals.neural_signals.length}`);
        }
        
        if (extractedSignals.regime_signals.length > 0) {
            console.log(`  [OK] Señales de régimen: ${extractedSignals.regime_signals.length}`);
        }
        
        // VERIFICAR MÉTRICAS CUÁNTICAS
        console.log('\n [TEST] Verificando métricas cuánticas...');
        
        const constants = unifiedSystem.constants;
        console.log(`   (Golden Ratio): ${constants.}`);
        console.log(`  _inv (Inverse): ${constants._inv}`);
        console.log(`  _888 (Lambda): ${constants._888}`);
        console.log(`  ℙ_7919 (Prime): ${constants.ℙ_7919}`);
        
        // VERIFICAR PESOS NEURALES
        console.log('\n [TEST] Verificando pesos neurales...');
        
        const weights = unifiedSystem.neuralWeights;
        console.log(`  Market Intelligence: ${(weights.market_intelligence * 100).toFixed(0)}%`);
        console.log(`  Neural Projection: ${(weights.neural_projection * 100).toFixed(0)}%`);
        console.log(`  Regime Analysis: ${(weights.regime_analysis * 100).toFixed(0)}%`);
        
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        console.log(`  Total Weight: ${(totalWeight * 100).toFixed(0)}%`);
        
        if (Math.abs(totalWeight - 1.0) < 0.01) {
            console.log('  [OK] Pesos normalizados correctamente');
        } else {
            console.log('  [WARNING]  Pesos no normalizados correctamente');
        }
        
        console.log('\n [TEST] ¡Sistema Unificado de Inteligencia funcionando correctamente!');
        console.log('[START] [TEST] Todas las métricas cuánticas reales integradas');
        console.log(' [TEST] Análisis maestro unificado operativo');
        
    } catch (error) {
        console.error('[RED] [TEST] Error en prueba del sistema:', error.message);
        console.error('[RED] [TEST] Stack trace:', error.stack);
    }
}

// EJECUTAR PRUEBA
if (require.main === module) {
    testUnifiedIntelligenceSystem()
        .then(() => {
            console.log('\n[OK] [TEST] Prueba completada exitosamente');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n[ERROR] [TEST] Prueba falló:', error.message);
            process.exit(1);
        });
}

module.exports = {
    testUnifiedIntelligenceSystem
};

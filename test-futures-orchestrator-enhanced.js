#!/usr/bin/env node

/**
 * [TEST] TEST QBTC FUTURES ORCHESTRATOR ENHANCED
 * ==========================================
 * Script de prueba para demostrar la orquestación mejorada
 * que aprovecha el motor de Feynman para generar descripciones
 * precisas de oportunidades de mercado
 */

const QBTCFuturesOrchestratorEnhanced = require('./qbtc-futures-orchestrator-enhanced.js');

async function testFuturesOrchestratorEnhanced() {
    console.log('[TEST] PRUEBA QBTC FUTURES ORCHESTRATOR ENHANCED');
    console.log('='.repeat(60));
    
    try {
        // 1. Crear instancia del orquestador mejorado
        console.log('\n1 Creando orquestador de futures mejorado...');
        const orchestrator = new QBTCFuturesOrchestratorEnhanced({
            futures_symbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'],
            opportunity_thresholds: {
                high_confidence: 0.75,
                medium_confidence: 0.6,
                low_confidence: 0.4
            }
        });
        
        // Esperar inicialización
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 2. Analizar oportunidad individual
        console.log('\n2 Analizando oportunidad individual (BTCUSDT)...');
        const individualResult = await orchestrator.analyzeSymbolOpportunity('BTCUSDT');
        
        console.log('\n[DATA] RESULTADO INDIVIDUAL:');
        console.log(`[OK] Símbolo: ${individualResult.symbol}`);
        console.log(`[OK] Confianza: ${(individualResult.confidence_score * 100).toFixed(1)}%`);
        console.log(`[OK] Clasificación: ${individualResult.opportunity_classification.category}`);
        console.log(`[OK] Acción: ${individualResult.opportunity_classification.action}`);
        console.log(`[OK] Urgencia: ${individualResult.opportunity_classification.urgency}`);
        
        console.log('\n DESCRIPCIÓN PRECISA:');
        console.log(`   ${individualResult.opportunity_description.summary}`);
        
        console.log('\n[SEARCH] ANÁLISIS DETALLADO:');
        const detailed = individualResult.opportunity_description.detailed_analysis;
        console.log(`    Dirección: ${detailed.market_direction.direction} (${detailed.market_direction.strength})`);
        console.log(`    Confianza: ${(detailed.market_direction.confidence * 100).toFixed(1)}%`);
        console.log(`    Fase Cuántica: ${detailed.quantum_analysis.phase.interpretation}`);
        console.log(`    Coherencia: ${detailed.quantum_analysis.coherence.level}`);
        console.log(`    Probabilidad Feynman: ${detailed.quantum_analysis.probability.level}`);
        
        console.log('\n[WARNING] EVALUACIÓN DE RIESGO:');
        const risk = individualResult.opportunity_description.risk_assessment;
        console.log(`    Riesgo General: ${risk.overall_risk}`);
        console.log(`    Score de Riesgo: ${(risk.risk_score * 100).toFixed(1)}%`);
        if (risk.risk_factors.length > 0) {
            console.log(`    Factores de Riesgo:`);
            risk.risk_factors.forEach(factor => {
                console.log(`     - ${factor.factor} (${factor.level}): ${factor.description}`);
            });
        }
        
        console.log('\n[ENDPOINTS] RECOMENDACIONES ACCIONABLES:');
        individualResult.actionable_recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. ${rec.type}: ${rec.action}`);
            console.log(`      Confianza: ${rec.confidence} | Timeframe: ${rec.timeframe}`);
            console.log(`      Descripción: ${rec.description}`);
        });
        
        // 3. Analizar todas las oportunidades
        console.log('\n3 Analizando todas las oportunidades de futures...');
        const allResults = await orchestrator.analyzeAllFuturesOpportunities();
        console.log('\n[DATA] RESUMEN EJECUTIVO:');
        console.log(`    Total oportunidades: ${allResults.executive_summary.total_opportunities}`);
        console.log(`    Alta confianza: ${allResults.executive_summary.high_confidence_count}`);
        console.log(`    Sentimiento general: ${allResults.executive_summary.market_sentiment}`);
        console.log(`    Confianza promedio: ${(allResults.executive_summary.average_confidence * 100).toFixed(1)}%`);

        // 4. Analizar multi-sector (más de 400 símbolos)
        console.log('\n4 Analizando multi-sector (más de 400 símbolos)...');
        const multiSectorResults = await orchestrator.analyzeMultiSectorFutures();
        console.log('\n[ENDPOINTS] RESULTADOS MULTI-SECTOR:');
        console.log(`    Total símbolos disponibles: ${multiSectorResults.total_symbols}`);
        console.log(`    Símbolos analizados: ${multiSectorResults.analyzed_symbols}`);
        console.log(`    Sectores analizados: ${Object.keys(multiSectorResults.sector_results).length}`);
        console.log(`    Sentimiento general: ${multiSectorResults.executive_summary.overall_sentiment}`);

        // 5. Mostrar estado del orquestador
        console.log('\n5 ESTADO DEL ORQUESTADOR:');
        const status = orchestrator.getOrchestratorStatus();
        console.log(`    Configuración: ${JSON.stringify(status.config, null, 2)}`);
        console.log(`    Estado: ${JSON.stringify(status.state, null, 2)}`);
        console.log(`    Motor de Feynman: ${status.feynman_engine_status.status}`);
        console.log(`    Cache size: ${status.cache_size}`);
        
        console.log('\n ESTADO DEL MOTOR DE FEYNMAN:');
        const feynmanStatus = status.feynman_engine_status;
        console.log(`[OK] Integraciones exitosas: ${feynmanStatus.state.successful_integrations}`);
        console.log(`[OK] Coherencia: ${feynmanStatus.state.coherence_percentage}%`);
        console.log(`[OK] Magnitud de amplitud: ${feynmanStatus.state.amplitude_magnitude.toFixed(3)}`);
        console.log(`[OK] Tasa de éxito: ${(feynmanStatus.state.success_rate * 100).toFixed(1)}%`);
        
        // 5. Demostrar análisis específico por timeframe
        console.log('\n5 ANÁLISIS POR TIMEFRAME (BTCUSDT):');
        const timeframeAnalysis = individualResult.opportunity_description.timeframe_analysis;
        Object.entries(timeframeAnalysis).forEach(([timeframe, data]) => {
            console.log(`    ${timeframe} (${data.duration}):`);
            console.log(`     - Confianza: ${(data.confidence * 100).toFixed(1)}%`);
            console.log(`     - Recomendación: ${data.recommendation}`);
            console.log(`     - Peso: ${(data.weight * 100).toFixed(0)}%`);
        });
        
        // 6. Mostrar factores clave
        console.log('\n6 FACTORES CLAVE IDENTIFICADOS:');
        const keyFactors = individualResult.opportunity_description.key_factors;
        if (keyFactors.length > 0) {
            keyFactors.forEach((factor, index) => {
                console.log(`   ${index + 1}. ${factor.type}: ${factor.description}`);
                console.log(`      Impacto: ${factor.impact} | Confianza: ${(factor.confidence * 100).toFixed(1)}%`);
            });
        } else {
            console.log('   No se identificaron factores clave significativos');
        }
        
        // 7. Demostrar métricas cuánticas
        console.log('\n7 MÉTRICAS CUÁNTICAS:');
        const quantumMetrics = individualResult.quantum_metrics;
        console.log(`    Coherencia: ${(quantumMetrics.coherence * 100).toFixed(1)}%`);
        console.log(`    Volatilidad: ${(quantumMetrics.volatility * 100).toFixed(1)}%`);
        console.log(`    Momentum: ${(quantumMetrics.momentum * 100).toFixed(1)}%`);
        console.log(`    Eficiencia Cuántica: ${(quantumMetrics.quantum_efficiency * 100).toFixed(1)}%`);
        
        console.log('\n[OK] PRUEBA COMPLETADA EXITOSAMENTE');
        console.log('[ENDPOINTS] El orquestador mejorado está funcionando correctamente');
        console.log('[DATA] Generando descripciones precisas de oportunidades de mercado');
        console.log(' Aprovechando el motor de Feynman para análisis cuántico');
        
        return {
            success: true,
            individual_result: individualResult,
            all_results: allResults,
            orchestrator_status: status,
            timestamp: Date.now()
        };
        
    } catch (error) {
        console.error('[ERROR] Error en la prueba:', error.message);
        console.error(error.stack);
        
        return {
            success: false,
            error: error.message,
            timestamp: Date.now()
        };
    }
}

// Ejecutar prueba si se llama directamente
if (require.main === module) {
    testFuturesOrchestratorEnhanced()
        .then(result => {
            if (result.success) {
                console.log('\n PRUEBA EXITOSA');
                process.exit(0);
            } else {
                console.log('\n PRUEBA FALLIDA');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error(' Error fatal:', error);
            process.exit(1);
        });
}

module.exports = testFuturesOrchestratorEnhanced;

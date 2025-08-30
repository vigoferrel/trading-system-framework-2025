// ============================================================================
// TEST QBTC V7 - SISTEMA DE RANKING CUÁNTICO AVANZADO
// ============================================================================

const { QBTC_V7_IntegratedSystem } = require('./qbtc-v7-integration');

async function testQBTCV7Ranking() {
    console.log('[TEST] [TEST QBTC V7] Iniciando pruebas del sistema de ranking cuántico avanzado...\n');
    
    const v7System = new QBTC_V7_IntegratedSystem();
    
    try {
        // PASO 1: Generar datos de prueba
        console.log('[DATA] [TEST QBTC V7] Paso 1: Generando datos de prueba...');
        const testRecommendations = generateTestRecommendations();
        const marketContext = generateTestMarketContext();
        
        console.log(`[OK] [TEST QBTC V7] Datos generados: ${testRecommendations.length} recomendaciones`);
        console.log(`[UP] [TEST QBTC V7] Contexto de mercado: ${marketContext.currentRegime}\n`);
        
        // PASO 2: Ejecutar ranking V7
        console.log('[START] [TEST QBTC V7] Paso 2: Ejecutando ranking cuántico avanzado...');
        const v7Result = await v7System.executeAdvancedRanking(testRecommendations, marketContext);
        
        if (!v7Result.success) {
            throw new Error(`Error en ranking V7: ${v7Result.error}`);
        }
        
        console.log(`[OK] [TEST QBTC V7] Ranking V7 completado: ${v7Result.finalRanking.length} recomendaciones`);
        console.log(` [TEST QBTC V7] Tiempo de procesamiento: ${v7Result.metadata.processingTime}ms\n`);
        
        // PASO 3: Analizar resultados
        console.log('[UP] [TEST QBTC V7] Paso 3: Analizando resultados...');
        analyzeV7Results(v7Result);
        
        // PASO 4: Comparar con sistema V6 simulado
        console.log('[RELOAD] [TEST QBTC V7] Paso 4: Comparando con sistema V6...');
        const comparison = await v7System.integrateWithV6System(testRecommendations, marketContext);
        analyzeComparison(comparison);
        
        // PASO 5: Validar métricas de calidad
        console.log('[OK] [TEST QBTC V7] Paso 5: Validando métricas de calidad...');
        validateQualityMetrics(v7Result);
        
        console.log('\n[ENDPOINTS] [TEST QBTC V7] Todas las pruebas completadas exitosamente!');
        
        return {
            success: true,
            v7Result,
            comparison,
            summary: generateTestSummary(v7Result, comparison)
        };
        
    } catch (error) {
        console.error(`[ERROR] [TEST QBTC V7] Error en las pruebas:`, error);
        return {
            success: false,
            error: error.message
        };
    }
}

function generateTestRecommendations() {
    const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT', 'XRPUSDT', 'DOTUSDT', 'LINKUSDT', 'MATICUSDT', 'AVAXUSDT'];
    const recommendations = [];
    
    symbols.forEach((symbol, index) => {
        // Usar valores determinísticos basados en el índice en lugar de Math.random
        const baseScore = 50 + (index * 4); // 50, 54, 58, 62, 66, 70, 74, 78, 82, 86
        const confidence = 60 + (index * 3); // 60, 63, 66, 69, 72, 75, 78, 81, 84, 87
        const volume = 100000 + (index * 100000); // 100k, 200k, 300k, etc.
        const priceChange = -5 + (index * 1); // -5, -4, -3, -2, -1, 0, 1, 2, 3, 4
        
        recommendations.push({
            symbol: symbol,
            action: index % 2 === 0 ? 'LONG' : 'SHORT', // Alternar LONG/SHORT
            confidence: confidence,
            score: baseScore,
            volume: volume,
            priceChange: priceChange,
            sourceCount: 2 + (index % 3), // 2, 3, 4 cíclicamente
            timestamp: Date.now() - (index * 300000), // Última hora escalonada
            volatility: 0.3 + (index * 0.04), // 0.3, 0.34, 0.38, etc.
            quantumScore: 40 + (index * 5), // 40, 45, 50, etc.
            brainScore: 45 + (index * 4), // 45, 49, 53, etc.
            spread: 0.0005 + (index * 0.0001), // 0.0005, 0.0006, etc.
            price: 100 + (index * 100) // 100, 200, 300, etc.
        });
    });
    
    return recommendations;
}

function generateTestMarketContext() {
    const regimes = ['QUANTUM_CRISIS', 'LEONARDO_TRENDING', 'FIBONACCI_RANGING', 'NEUTRAL'];
    const selectedRegime = regimes[Math.floor((Date.now() / 1000) % regimes.length)]; // Determinístico basado en tiempo
    
    return {
        currentRegime: selectedRegime,
        volatility: 0.4 + ((Date.now() / 1000) % 30) / 100, // 0.4-0.7 determinístico
        marketSentiment: 'MIXED',
        timestamp: Date.now()
    };
}

function analyzeV7Results(v7Result) {
    const { finalRanking, insights, metadata } = v7Result;
    
    console.log(`[DATA] [ANÁLISIS V7] Resultados del ranking:`);
    console.log(`    Total recomendaciones: ${finalRanking.length}`);
    console.log(`    Score promedio: ${(metadata.qualityMetrics.averageScore * 100).toFixed(1)}%`);
    console.log(`    Confianza promedio: ${(metadata.qualityMetrics.averageConfidence * 100).toFixed(1)}%`);
    console.log(`    Coherencia promedio: ${(metadata.qualityMetrics.averageCoherence * 100).toFixed(1)}%`);
    
    console.log(`\n [ANÁLISIS V7] Top 5 recomendaciones:`);
    finalRanking.slice(0, 5).forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.symbol} - Score: ${(rec.optimizedScore * 100).toFixed(1)}% - Tier: ${rec.rankingTier}`);
    });
    
    console.log(`\n[UP] [ANÁLISIS V7] Métricas cuánticas:`);
    console.log(`    Coherencia cuántica: ${(metadata.quantumMetrics.averageCoherence * 100).toFixed(1)}%`);
    console.log(`    Entanglement: ${(metadata.quantumMetrics.averageEntanglement * 100).toFixed(1)}%`);
    console.log(`    Superposición: ${(metadata.quantumMetrics.averageSuperposition * 100).toFixed(1)}%`);
    console.log(`    Estabilidad cuántica: ${(metadata.quantumMetrics.quantumStability * 100).toFixed(1)}%`);
    
    console.log(`\n [ANÁLISIS V7] Insights generados: ${insights.insights.length}`);
    insights.insights.forEach((insight, index) => {
        console.log(`   ${index + 1}. [${insight.type.toUpperCase()}] ${insight.message}`);
    });
}

function analyzeComparison(comparison) {
    const { v7Ranking, comparison: compData } = comparison;
    
    console.log(`\n[RELOAD] [COMPARACIÓN V6 vs V7] Análisis de comparación:`);
    console.log(`    Overlap top 10: ${compData.overlap}/10 (${compData.overlapPercentage.toFixed(1)}%)`);
    console.log(`    Mejora de score: ${compData.scoreImprovement.toFixed(1)}%`);
    console.log(`    Tipo de mejora: ${compData.improvement}`);
    
    console.log(`\n[DATA] [COMPARACIÓN] Top 10 V6 vs V7:`);
    console.log(`   V6: ${compData.v6Top10.join(', ')}`);
    console.log(`   V7: ${compData.v7Top10.join(', ')}`);
    
    if (compData.scoreImprovement > 0) {
        console.log(`\n[OK] [COMPARACIÓN] El sistema V7 muestra mejora significativa`);
    } else {
        console.log(`\n[WARNING] [COMPARACIÓN] El sistema V7 necesita optimización`);
    }
}

function validateQualityMetrics(v7Result) {
    const { metadata } = v7Result;
    const { qualityMetrics, quantumMetrics } = metadata;
    
    console.log(`\n[OK] [VALIDACIÓN] Métricas de calidad:`);
    
    // Validar scores
    if (qualityMetrics.averageScore > 0.6) {
        console.log(`   [OK] Score promedio aceptable: ${(qualityMetrics.averageScore * 100).toFixed(1)}%`);
    } else {
        console.log(`   [WARNING] Score promedio bajo: ${(qualityMetrics.averageScore * 100).toFixed(1)}%`);
    }
    
    // Validar confianza
    if (qualityMetrics.averageConfidence > 0.7) {
        console.log(`   [OK] Confianza promedio alta: ${(qualityMetrics.averageConfidence * 100).toFixed(1)}%`);
    } else {
        console.log(`   [WARNING] Confianza promedio baja: ${(qualityMetrics.averageConfidence * 100).toFixed(1)}%`);
    }
    
    // Validar coherencia
    if (qualityMetrics.averageCoherence > 0.6) {
        console.log(`   [OK] Coherencia promedio buena: ${(qualityMetrics.averageCoherence * 100).toFixed(1)}%`);
    } else {
        console.log(`   [WARNING] Coherencia promedio baja: ${(qualityMetrics.averageCoherence * 100).toFixed(1)}%`);
    }
    
    // Validar métricas cuánticas
    if (quantumMetrics.averageCoherence > 0.7) {
        console.log(`   [OK] Coherencia cuántica alta: ${(quantumMetrics.averageCoherence * 100).toFixed(1)}%`);
    } else {
        console.log(`   [WARNING] Coherencia cuántica baja: ${(quantumMetrics.averageCoherence * 100).toFixed(1)}%`);
    }
    
    if (quantumMetrics.quantumStability > 0.8) {
        console.log(`   [OK] Estabilidad cuántica excelente: ${(quantumMetrics.quantumStability * 100).toFixed(1)}%`);
    } else {
        console.log(`   [WARNING] Estabilidad cuántica moderada: ${(quantumMetrics.quantumStability * 100).toFixed(1)}%`);
    }
}

function generateTestSummary(v7Result, comparison) {
    const { metadata, insights } = v7Result;
    const { qualityMetrics, quantumMetrics } = metadata;
    
    return {
        testStatus: 'COMPLETED',
        timestamp: Date.now(),
        v7Performance: {
            totalRecommendations: v7Result.finalRanking.length,
            averageScore: qualityMetrics.averageScore,
            averageConfidence: qualityMetrics.averageConfidence,
            averageCoherence: qualityMetrics.averageCoherence,
            quantumCoherence: quantumMetrics.averageCoherence,
            quantumStability: quantumMetrics.quantumStability,
            processingTime: metadata.processingTime
        },
        comparison: {
            scoreImprovement: comparison.comparison.scoreImprovement,
            overlapPercentage: comparison.comparison.overlapPercentage,
            improvement: comparison.comparison.improvement
        },
        insights: {
            totalInsights: insights.insights.length,
            criticalInsights: insights.summary.criticalInsights,
            averageScore: insights.summary.averageScore,
            diversificationRatio: insights.summary.diversificationRatio
        },
        recommendations: insights.recommendations.length
    };
}

// Ejecutar pruebas si se llama directamente
if (require.main === module) {
    testQBTCV7Ranking()
        .then(result => {
            if (result.success) {
                console.log('\n [TEST QBTC V7] Pruebas completadas exitosamente!');
                console.log('[LIST] [TEST QBTC V7] Resumen:', JSON.stringify(result.summary, null, 2));
            } else {
                console.error('\n[ERROR] [TEST QBTC V7] Pruebas fallaron:', result.error);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('\n [TEST QBTC V7] Error crítico:', error);
            process.exit(1);
        });
}

module.exports = { testQBTCV7Ranking };

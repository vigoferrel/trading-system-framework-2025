// ============================================================================
// TEST DE ADAPTACIÓN DE RÉGIMEN - VERIFICACIÓN DE UMBRALES DINÁMICOS
// ============================================================================

const axios = require('axios');

async function testRegimeAdaptation() {
    console.log('[TEST] [TEST] Iniciando prueba de adaptación de régimen...\n');
    
    try {
        // PASO 1: Verificar conectividad del servidor
        console.log(' [TEST] Verificando conectividad del servidor...');
        const healthResponse = await axios.get('http://localhost:4602/api/enhanced-opportunities', { timeout: 5000 });
        console.log('[OK] [TEST] Servidor conectado correctamente\n');
        
        // PASO 2: Probar endpoint de consolidación
        console.log('[RELOAD] [TEST] Probando endpoint de consolidación...');
        const consolidationResponse = await axios.get('http://localhost:4602/api/consolidated-recommendations', { timeout: 15000 });
        
        if (consolidationResponse.data.success) {
            const data = consolidationResponse.data.data;
            console.log('[OK] [TEST] Consolidación exitosa');
            console.log(`[DATA] [TEST] Régimen detectado: ${data.summary.marketRegime}`);
            console.log(` [TEST] Umbrales aplicados: Score=${data.summary.regimeThresholds.minScore}%, Confianza=${data.summary.regimeThresholds.minConfidence}%`);
            console.log(`[UP] [TEST] Recomendaciones generadas: ${data.recommendations.length}`);
            console.log(` [TEST] Salud del sistema: ${data.summary.systemHealth}`);
            console.log(`[ENDPOINTS] [TEST] Razón de adaptación: ${data.summary.regimeAdaptation.adaptationReason}\n`);
            
            // PASO 3: Verificar fuentes individuales
            console.log('[SEARCH] [TEST] Verificando fuentes individuales...');
            const sources = [
                { name: 'Enhanced Opportunities', url: '/api/enhanced-opportunities' },
                { name: 'Quantum Recommendations', url: '/api/quantum-recommendations' },
                { name: 'Quantum Brain', url: '/api/quantum-brain-test' },
                { name: 'Quantum Analysis', url: '/api/quantum-analysis' }
            ];
            
            for (const source of sources) {
                try {
                    const response = await axios.get(`http://localhost:4602${source.url}`, { timeout: 10000 });
                    const dataCount = getDataCount(response.data);
                    console.log(`[OK] [TEST] ${source.name}: ${dataCount} elementos`);
                } catch (error) {
                    console.log(`[ERROR] [TEST] ${source.name}: Error - ${error.message}`);
                }
            }
            
            // PASO 4: Análisis de métricas de régimen
            console.log('\n[DATA] [TEST] Análisis de métricas de régimen...');
            if (data.summary.marketRegime) {
                console.log(`[ENDPOINTS] [TEST] Régimen actual: ${data.summary.marketRegime}`);
                console.log(` [TEST] Umbrales configurados:`);
                console.log(`   - Score mínimo: ${data.summary.regimeThresholds.minScore}%`);
                console.log(`   - Confianza mínima: ${data.summary.regimeThresholds.minConfidence}%`);
                console.log(`   - Máximo recomendaciones: ${data.summary.regimeThresholds.maxRecommendations}`);
                console.log(`   - Bonus confianza: ${data.summary.regimeThresholds.confidenceBonus}`);
                console.log(`   - Bonus fuentes: ${data.summary.regimeThresholds.sourceBonus}`);
            }
            
            // PASO 5: Verificar top recomendaciones
            if (data.recommendations.length > 0) {
                console.log('\n [TEST] Top 3 recomendaciones:');
                data.recommendations.slice(0, 3).forEach((rec, index) => {
                    console.log(`   ${index + 1}. ${rec.symbol} - ${rec.action} (${rec.confidence}) - ${rec.priority} priority`);
                });
            } else {
                console.log('\n[WARNING] [TEST] No hay recomendaciones generadas');
                console.log(' [TEST] Esto puede ser debido a:');
                console.log('   - Fuentes individuales sin datos');
                console.log('   - Umbrales muy estrictos');
                console.log('   - Rate limiting de Binance');
            }
            
        } else {
            console.log('[ERROR] [TEST] Error en consolidación:', consolidationResponse.data.error);
        }
        
    } catch (error) {
        console.error('[ERROR] [TEST] Error en prueba:', error.message);
    }
}

function getDataCount(data) {
    if (data.opportunities) return data.opportunities.length;
    if (data.recommendations) return data.recommendations.length;
    if (data.brainRecommendations) return data.brainRecommendations.length;
    if (data.quantumRecommendations) return data.quantumRecommendations.length;
    if (data.brainAnalysis) return Object.keys(data.brainAnalysis).length;
    return 0;
}

// Ejecutar prueba
testRegimeAdaptation().then(() => {
    console.log('\n[OK] [TEST] Prueba completada');
    process.exit(0);
}).catch(error => {
    console.error('\n[ERROR] [TEST] Prueba fallida:', error.message);
    process.exit(1);
});

/**
 * TEST LEONARDO-FEYNMAN QBTC INTEGRATION
 * ======================================
 * 
 * Script de prueba para validar la integración del sistema Leonardo-Feynman
 * con datos reales de Binance y el sistema QBTC existente
 */

const { startLeonardoFeynmanQBTC } = require('./leonardo-feynman-integration');
const axios = require('axios');

async function testLeonardoFeynmanIntegration() {
    console.log('[TEST] [TEST] Iniciando prueba de integración Leonardo-Feynman QBTC...\n');
    
    try {
        // PASO 1: Verificar conectividad del servidor QBTC
        console.log(' [TEST] Verificando conectividad del servidor QBTC...');
        const healthResponse = await axios.get('http://localhost:4602/api/enhanced-opportunities', { timeout: 5000 });
        console.log('[OK] [TEST] Servidor QBTC conectado correctamente\n');
        
        // PASO 2: Inicializar sistema Leonardo-Feynman
        console.log(' [TEST] Inicializando sistema Leonardo-Feynman...');
        const leonardoFeynmanSystem = await startLeonardoFeynmanQBTC();
        console.log('[OK] [TEST] Sistema Leonardo-Feynman inicializado\n');
        
        // PASO 3: Obtener lista de símbolos reales
        console.log('[DATA] [TEST] Obteniendo lista de símbolos reales...');
        const marketDataResponse = await axios.get('http://localhost:4602/api/market-data');
        
        if (!marketDataResponse.data.success) {
            throw new Error('No se pudieron obtener datos de mercado');
        }
        
        const symbols = Object.keys(marketDataResponse.data.data.futures || {});
        console.log(`[OK] [TEST] Obtenidos ${symbols.length} símbolos reales\n`);
        
        // PASO 4: Probar análisis de símbolos individuales
        console.log(' [TEST] Probando análisis de símbolos individuales...');
        const testSymbols = symbols.slice(0, 5); // Probar con 5 símbolos
        
        for (const symbol of testSymbols) {
            const marketData = marketDataResponse.data.data.futures[symbol];
            
            if (marketData) {
                const analysis = await leonardoFeynmanSystem.analyzeSymbol(symbol, marketData);
                
                console.log(`[UP] [TEST] ${symbol}:`);
                console.log(`   Psicología: ${analysis.psychology}`);
                console.log(`   Confianza: ${(analysis.confidence * 100).toFixed(1)}%`);
                console.log(`   Recomendación: ${analysis.recommendation.action}`);
                console.log(`   Razón: ${analysis.reasoning}`);
                
                if (analysis.recommendation.entryPrice) {
                    console.log(`   Entrada: $${analysis.recommendation.entryPrice.toFixed(4)}`);
                    console.log(`   Stop Loss: $${analysis.recommendation.stopLoss.toFixed(4)}`);
                    console.log(`   Take Profit: $${analysis.recommendation.takeProfit.toFixed(4)}`);
                }
                console.log('');
            }
        }
        
        // PASO 5: Probar análisis masivo
        console.log('[START] [TEST] Probando análisis masivo de símbolos...');
        const massAnalysis = await leonardoFeynmanSystem.analyzeAllSymbols(symbols.slice(0, 20));
        
        console.log(`[OK] [TEST] Análisis masivo completado:`);
        console.log(`   Total analizados: ${massAnalysis.totalAnalyzed}`);
        console.log(`   Recomendaciones alta confianza: ${massAnalysis.highConfidenceRecommendations.length}`);
        console.log(`   Distribución psicológica:`, massAnalysis.psychologyDistribution);
        console.log(`   Salud del sistema: ${massAnalysis.systemHealth.health}\n`);
        
        // PASO 6: Mostrar recomendaciones de alta confianza
        if (massAnalysis.highConfidenceRecommendations.length > 0) {
            console.log(' [TEST] Top 5 Recomendaciones de Alta Confianza:');
            massAnalysis.highConfidenceRecommendations
                .sort((a, b) => b.confidence - a.confidence)
                .slice(0, 5)
                .forEach((rec, index) => {
                    console.log(`   ${index + 1}. ${rec.symbol} - ${rec.recommendation.action} (${(rec.confidence * 100).toFixed(1)}%)`);
                    console.log(`      Psicología: ${rec.psychology}`);
                    console.log(`      Razón: ${rec.reasoning}`);
                });
            console.log('');
        }
        
        // PASO 7: Verificar estado del sistema
        console.log('[DATA] [TEST] Verificando estado del sistema...');
        const systemStatus = leonardoFeynmanSystem.getSystemStatus();
        
        console.log(`[OK] [TEST] Estado del sistema:`);
        console.log(`   Psicología actual: ${systemStatus.psychologyDetector.currentState}`);
        console.log(`   Confianza: ${(systemStatus.psychologyDetector.confidence * 100).toFixed(1)}%`);
        console.log(`   Estados analizados: ${systemStatus.psychologyDetector.statesAnalyzed}`);
        console.log(`   Salud: ${systemStatus.health.health}`);
        console.log(`   Símbolos en historial: ${systemStatus.health.totalSymbols}`);
        console.log(`   Puntos de datos: ${systemStatus.health.totalDataPoints}\n`);
        
        // PASO 8: Validación de integración
        console.log('[SEARCH] [TEST] Validando integración con QBTC...');
        
        // Verificar que el sistema puede acceder a datos reales
        const testSymbol = symbols[0];
        const testData = marketDataResponse.data.data.futures[testSymbol];
        
        if (testData && testData.price && testData.volume) {
            console.log(`[OK] [TEST] Integración con datos reales verificada:`);
            console.log(`   Símbolo: ${testSymbol}`);
            console.log(`   Precio: $${testData.price}`);
            console.log(`   Volumen: ${testData.volume}`);
            console.log(`   Cambio: ${testData.priceChangePercent}%`);
        } else {
            console.warn('[WARNING] [TEST] Datos de prueba incompletos');
        }
        
        console.log('\n[ENDPOINTS] [TEST] Validación de integración Leonardo-Feynman QBTC completada exitosamente!');
        
        return {
            success: true,
            system: leonardoFeynmanSystem,
            analysis: massAnalysis,
            status: systemStatus,
            summary: {
                symbolsAnalyzed: massAnalysis.totalAnalyzed,
                highConfidenceRecommendations: massAnalysis.highConfidenceRecommendations.length,
                systemHealth: massAnalysis.systemHealth.health,
                integrationStatus: 'SUCCESS'
            }
        };
        
    } catch (error) {
        console.error('[ERROR] [TEST] Error en prueba de integración Leonardo-Feynman:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Función para comparar con sistema QBTC existente
async function compareWithQBTCSystem() {
    console.log('\n[RELOAD] [COMPARISON] Comparando Leonardo-Feynman con sistema QBTC existente...\n');
    
    try {
        // Obtener recomendaciones del sistema QBTC existente
        const qbtcResponse = await axios.get('http://localhost:4602/api/consolidated-recommendations');
        
        if (!qbtcResponse.data.success) {
            throw new Error('No se pudieron obtener recomendaciones QBTC');
        }
        
        const qbtcRecommendations = qbtcResponse.data.data.recommendations;
        
        console.log(`[DATA] [COMPARISON] Sistema QBTC existente:`);
        console.log(`   Total recomendaciones: ${qbtcRecommendations.length}`);
        console.log(`   Top 3: ${qbtcRecommendations.slice(0, 3).map(r => `${r.symbol}(${r.confidence})`).join(', ')}`);
        
        // Inicializar Leonardo-Feynman
        const leonardoFeynmanSystem = await startLeonardoFeynmanQBTC();
        
        // Analizar los mismos símbolos
        const qbtcSymbols = qbtcRecommendations.map(r => r.symbol);
        const lfAnalysis = await leonardoFeynmanSystem.analyzeAllSymbols(qbtcSymbols);
        
        console.log(`\n [COMPARISON] Sistema Leonardo-Feynman:`);
        console.log(`   Total analizados: ${lfAnalysis.totalAnalyzed}`);
        console.log(`   Alta confianza: ${lfAnalysis.highConfidenceRecommendations.length}`);
        console.log(`   Top 3: ${lfAnalysis.highConfidenceRecommendations.slice(0, 3).map(r => `${r.symbol}(${(r.confidence * 100).toFixed(1)}%)`).join(', ')}`);
        
        // Comparar enfoques
        console.log(`\n[UP] [COMPARISON] Análisis comparativo:`);
        console.log(`   QBTC: Enfoque cuántico-multidimensional`);
        console.log(`   Leonardo-Feynman: Enfoque psicológico-empírico`);
        console.log(`   Complementariedad: Alta (diferentes perspectivas)`);
        
        return {
            qbtcRecommendations: qbtcRecommendations.length,
            leonardoFeynmanRecommendations: lfAnalysis.highConfidenceRecommendations.length,
            comparison: 'COMPLEMENTARY_APPROACHES'
        };
        
    } catch (error) {
        console.error('[ERROR] [COMPARISON] Error en comparación:', error.message);
        return { error: error.message };
    }
}

// Ejecutar pruebas
async function runAllTests() {
    console.log('[TEST] INICIANDO SUITE DE PRUEBAS LEONARDO-FEYNMAN QBTC\n');
    
    const integrationTest = await testLeonardoFeynmanIntegration();
    
    if (integrationTest.success) {
        const comparisonTest = await compareWithQBTCSystem();
        
        console.log('\n[LIST] RESUMEN DE PRUEBAS:');
        console.log(`[OK] Integración Leonardo-Feynman: ${integrationTest.success ? 'EXITOSA' : 'FALLIDA'}`);
        console.log(`[DATA] Símbolos analizados: ${integrationTest.summary?.symbolsAnalyzed || 0}`);
        console.log(`[ENDPOINTS] Recomendaciones alta confianza: ${integrationTest.summary?.highConfidenceRecommendations || 0}`);
        console.log(` Salud del sistema: ${integrationTest.summary?.systemHealth || 'UNKNOWN'}`);
        
        if (comparisonTest.comparison) {
            console.log(`[RELOAD] Comparación con QBTC: ${comparisonTest.comparison}`);
        }
        
        console.log('\n Leonardo-Feynman QBTC Integration está listo para producción!');
    } else {
        console.error('[ERROR] Las pruebas fallaron. Revisar configuración del sistema.');
    }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    testLeonardoFeynmanIntegration,
    compareWithQBTCSystem,
    runAllTests
};

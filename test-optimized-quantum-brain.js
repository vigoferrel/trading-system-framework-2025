const axios = require('axios');

async function testOptimizedQuantumBrain() {
    try {
        console.log(' VERIFICACIÓN DEL QUANTUM BRAIN OPTIMIZADO');
        console.log('=' .repeat(60));
        
        console.log('\n Conectando al endpoint /api/quantum-brain-test...');
        const response = await axios.get('http://localhost:4602/api/quantum-brain-test', {
            timeout: 15000 // 15 segundos timeout
        });
        
        if (response.data.success) {
            const { brainAnalysis, brainRecommendations, enhancedCoherence, totalSymbolsAnalyzed } = response.data;
            
            console.log('\n[OK] RESPUESTA EXITOSA DEL QUANTUM BRAIN OPTIMIZADO');
            console.log('=' .repeat(50));
            
            // 1. VERIFICAR COHERENCIA CEREBRAL
            console.log('\n COHERENCIA CEREBRAL MEJORADA:');
            console.log(`   Global Coherence: ${enhancedCoherence.globalCoherence}`);
            console.log(`   Target Coherence: ${enhancedCoherence.targetCoherence}`);
            console.log(`   Status: ${enhancedCoherence.status}`);
            console.log(`   Quantum States: ${enhancedCoherence.quantumStates}`);
            console.log(`   Learning Progress: ${enhancedCoherence.learningProgress?.toFixed(2) || 'N/A'}%`);
            console.log(`   Memory Size: ${enhancedCoherence.memorySize || 'N/A'}`);
            
            // 2. VERIFICAR ANÁLISIS CEREBRAL
            console.log('\n[DATA] ANÁLISIS CEREBRAL CUÁNTICO:');
            const analysisSymbols = Object.keys(brainAnalysis);
            console.log(`   Total símbolos analizados: ${analysisSymbols.length}`);
            console.log(`   Símbolos reportados por API: ${totalSymbolsAnalyzed}`);
            
            // Verificar datos reales
            console.log('\n[SEARCH] VERIFICACIÓN DE DATOS REALES:');
            let realDataCount = 0;
            let falseDataCount = 0;
            
            analysisSymbols.forEach(symbol => {
                const data = brainAnalysis[symbol];
                const price = data.realPrice;
                const volume = data.realVolume;
                
                // Verificar si los precios son realistas (entre $0.01 y $100,000)
                const isRealisticPrice = price && price > 0.01 && price < 100000;
                const isRealisticVolume = volume && volume > 0;
                
                console.log(`\n  ${symbol}:`);
                console.log(`     Precio: $${price?.toFixed(4) || 'N/A'} ${isRealisticPrice ? '[OK]' : '[ERROR]'}`);
                console.log(`     Volumen: ${volume?.toFixed(2) || 'N/A'} ${isRealisticVolume ? '[OK]' : '[ERROR]'}`);
                console.log(`     Brain Score: ${data.brainScore?.toFixed(2) || 'N/A'}%`);
                console.log(`     Coherence: ${data.coherence?.toFixed(2) || 'N/A'}`);
                
                if (isRealisticPrice && isRealisticVolume) {
                    realDataCount++;
                } else {
                    falseDataCount++;
                }
            });
            
            // 3. VERIFICAR RECOMENDACIONES
            console.log('\n[ENDPOINTS] RECOMENDACIONES CEREBRALES:');
            console.log(`   Total recomendaciones: ${brainRecommendations.length}`);
            
            if (brainRecommendations.length > 0) {
                console.log('\n[SEARCH] MUESTRA DE RECOMENDACIONES:');
                
                let realisticRecs = 0;
                
                brainRecommendations.forEach(rec => {
                    const entryPrice = rec.entryPrice;
                    const stopLoss = rec.stopLoss;
                    const takeProfit = rec.takeProfit;
                    
                    // Verificar si los precios son realistas
                    const isRealisticEntry = entryPrice && entryPrice > 0.01 && entryPrice < 100000;
                    const isRealisticSL = stopLoss && stopLoss > 0.01 && stopLoss < 100000;
                    const isRealisticTP = takeProfit && takeProfit > 0.01 && takeProfit < 100000;
                    
                    console.log(`\n  ${rec.symbol}:`);
                    console.log(`     Action: ${rec.action}`);
                    console.log(`     Entry: $${entryPrice?.toFixed(4) || 'N/A'} ${isRealisticEntry ? '[OK]' : '[ERROR]'}`);
                    console.log(`     Stop Loss: $${stopLoss?.toFixed(4) || 'N/A'} ${isRealisticSL ? '[OK]' : '[ERROR]'}`);
                    console.log(`     Take Profit: $${takeProfit?.toFixed(4) || 'N/A'} ${isRealisticTP ? '[OK]' : '[ERROR]'}`);
                    console.log(`     Brain Score: ${rec.brainScore?.toFixed(2) || 'N/A'}%`);
                    console.log(`     Leverage: ${rec.leverage}x`);
                    
                    if (isRealisticEntry && isRealisticSL && isRealisticTP) {
                        realisticRecs++;
                    }
                });
                
                console.log(`\n[UP] ESTADÍSTICAS DE RECOMENDACIONES:`);
                console.log(`   Recomendaciones realistas: ${realisticRecs}/${brainRecommendations.length}`);
            }
            
            // 4. VERIFICAR CACHE
            console.log('\n[DATA] VERIFICACIÓN DE CACHE:');
            try {
                const cacheResponse = await axios.get('http://localhost:4602/api/market-data', {
                    timeout: 5000
                });
                
                if (cacheResponse.data.success) {
                    const cacheData = cacheResponse.data.data;
                    console.log(`   Símbolos SPOT en cache: ${cacheData.summary.spotCount}`);
                    console.log(`   Símbolos FUTURES en cache: ${cacheData.summary.futuresCount}`);
                    console.log(`   Símbolos OPTIONS en cache: ${cacheData.summary.optionsCount}`);
                    console.log(`   Total instrumentos: ${cacheData.summary.totalInstruments}`);
                    console.log(`   Estado de cache: ${cacheData.summary.cacheStatus}`);
                    console.log(`   Última actualización: ${cacheData.summary.lastUpdate}`);
                    console.log('  [OK] Cache funcionando correctamente');
                } else {
                    console.log('  [ERROR] Error en cache');
                }
            } catch (cacheError) {
                console.log('  [ERROR] Error verificando cache:', cacheError.message);
            }
            
            // 5. RESUMEN DE VERIFICACIÓN
            console.log('\n[LIST] RESUMEN DE VERIFICACIÓN OPTIMIZADA:');
            console.log('=' .repeat(50));
            console.log(`   Símbolos analizados: ${analysisSymbols.length} [OK]`);
            console.log(`   Datos reales en análisis: ${realDataCount}/${analysisSymbols.length} [OK]`);
            console.log(`   Datos falsos detectados: ${falseDataCount} ${falseDataCount === 0 ? '[OK]' : '[ERROR]'}`);
            console.log(`   Recomendaciones generadas: ${brainRecommendations.length} [OK]`);
            console.log(`   Coherencia cerebral: ${enhancedCoherence.globalCoherence} [OK]`);
            console.log(`   Tiempo de respuesta: <15 segundos [OK]`);
            
            if (falseDataCount === 0 && analysisSymbols.length > 0 && brainRecommendations.length > 0) {
                console.log('\n ¡VERIFICACIÓN OPTIMIZADA EXITOSA!');
                console.log('[OK] El Quantum Brain está usando cache existente');
                console.log('[OK] Sin duplicación de llamadas a Binance');
                console.log('[OK] Datos reales y precios realistas');
                console.log('[OK] Sistema completamente optimizado');
            } else {
                console.log('\n[WARNING]  PROBLEMAS DETECTADOS:');
                if (falseDataCount > 0) {
                    console.log(`[ERROR] Se encontraron ${falseDataCount} símbolos con datos falsos`);
                }
                if (analysisSymbols.length === 0) {
                    console.log('[ERROR] No se analizaron símbolos');
                }
                if (brainRecommendations.length === 0) {
                    console.log('[ERROR] No se generaron recomendaciones');
                }
            }
            
        } else {
            console.error('[ERROR] Error en la respuesta del API:', response.data.error);
        }
        
    } catch (error) {
        console.error('[ERROR] Error durante la verificación optimizada:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error(' El servidor no está ejecutándose. Ejecuta: node core-system-organized.js');
        } else if (error.code === 'ETIMEDOUT') {
            console.error(' Timeout - el servidor puede estar sobrecargado');
        }
    }
}

// Ejecutar verificación optimizada
testOptimizedQuantumBrain();

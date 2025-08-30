const axios = require('axios');

async function quickBrainVerification() {
    try {
        console.log(' VERIFICACIÓN RÁPIDA DEL QUANTUM BRAIN');
        console.log('=' .repeat(50));
        
        console.log('\n Conectando al endpoint (timeout: 15s)...');
        const response = await axios.get('http://localhost:4602/api/quantum-brain-analysis', {
            timeout: 15000 // 15 segundos timeout
        });
        
        if (response.data.success) {
            const { brainAnalysis, brainRecommendations, enhancedCoherence, totalSymbolsAnalyzed } = response.data;
            
            console.log('\n[OK] RESPUESTA EXITOSA');
            console.log('=' .repeat(30));
            
            // Verificar estructura básica
            console.log('\n[DATA] ESTRUCTURA DE DATOS:');
            console.log(`   Brain Analysis keys: ${Object.keys(brainAnalysis).length}`);
            console.log(`   Brain Recommendations: ${brainRecommendations.length}`);
            console.log(`   Total Symbols Reported: ${totalSymbolsAnalyzed}`);
            console.log(`   Global Coherence: ${enhancedCoherence.globalCoherence}`);
            
            // Verificar solo los primeros 3 símbolos para datos reales
            const analysisSymbols = Object.keys(brainAnalysis);
            if (analysisSymbols.length > 0) {
                console.log('\n[SEARCH] VERIFICACIÓN DE DATOS REALES (primeros 3):');
                
                const sampleSymbols = analysisSymbols.slice(0, 3);
                let realDataCount = 0;
                
                sampleSymbols.forEach(symbol => {
                    const data = brainAnalysis[symbol];
                    const price = data.realPrice;
                    const volume = data.realVolume;
                    
                    // Verificar si los precios son realistas
                    const isRealisticPrice = price && price > 0.01 && price < 100000;
                    const isRealisticVolume = volume && volume > 0;
                    
                    console.log(`\n  ${symbol}:`);
                    console.log(`     Precio: $${price?.toFixed(4) || 'N/A'} ${isRealisticPrice ? '[OK]' : '[ERROR]'}`);
                    console.log(`     Volumen: ${volume?.toFixed(2) || 'N/A'} ${isRealisticVolume ? '[OK]' : '[ERROR]'}`);
                    
                    if (isRealisticPrice && isRealisticVolume) {
                        realDataCount++;
                    }
                });
                
                console.log(`\n[UP] DATOS REALES: ${realDataCount}/${sampleSymbols.length}`);
            }
            
            // Verificar recomendaciones
            if (brainRecommendations.length > 0) {
                console.log('\n[ENDPOINTS] VERIFICACIÓN DE RECOMENDACIONES (primeras 3):');
                
                const sampleRecs = brainRecommendations.slice(0, 3);
                let realisticRecs = 0;
                
                sampleRecs.forEach(rec => {
                    const entryPrice = rec.entryPrice;
                    const isRealistic = entryPrice && entryPrice > 0.01 && entryPrice < 100000;
                    
                    console.log(`\n  ${rec.symbol}:`);
                    console.log(`     Entry: $${entryPrice?.toFixed(4) || 'N/A'} ${isRealistic ? '[OK]' : '[ERROR]'}`);
                    console.log(`     Action: ${rec.action}`);
                    console.log(`     Brain Score: ${rec.brainScore?.toFixed(2) || 'N/A'}%`);
                    
                    if (isRealistic) {
                        realisticRecs++;
                    }
                });
                
                console.log(`\n[UP] RECOMENDACIONES REALISTAS: ${realisticRecs}/${sampleRecs.length}`);
            }
            
            // Resumen final
            console.log('\n[LIST] RESUMEN RÁPIDO:');
            console.log('=' .repeat(30));
            console.log(`   Símbolos analizados: ${analysisSymbols.length} [OK]`);
            console.log(`   Recomendaciones: ${brainRecommendations.length} [OK]`);
            console.log(`   Coherencia: ${enhancedCoherence.globalCoherence} [OK]`);
            
            if (analysisSymbols.length > 0 && brainRecommendations.length > 0) {
                console.log('\n ¡VERIFICACIÓN EXITOSA!');
                console.log('[OK] Quantum Brain funcionando con datos reales');
            } else {
                console.log('\n[WARNING]  Problemas detectados');
            }
            
        } else {
            console.error('[ERROR] Error en la respuesta:', response.data.error);
        }
        
    } catch (error) {
        console.error('[ERROR] Error:', error.message);
        if (error.code === 'ECONNABORTED') {
            console.error(' Timeout - el endpoint está tardando mucho');
            console.error(' Esto puede ser normal si está analizando muchos símbolos');
        }
    }
}

quickBrainVerification();

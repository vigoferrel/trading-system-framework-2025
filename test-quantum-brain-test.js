const axios = require('axios');

async function testQuantumBrainTest() {
    try {
        console.log(' PROBANDO ENDPOINT DE PRUEBA RÁPIDA');
        console.log('=' .repeat(50));
        
        console.log('\n Conectando a /api/quantum-brain-test...');
        const response = await axios.get('http://localhost:4602/api/quantum-brain-test', {
            timeout: 10000 // 10 segundos
        });
        
        if (response.data.success) {
            const { brainAnalysis, brainRecommendations, enhancedCoherence, totalSymbolsAnalyzed } = response.data;
            
            console.log('\n[OK] RESPUESTA EXITOSA');
            console.log('=' .repeat(30));
            
            console.log('\n[DATA] DATOS BÁSICOS:');
            console.log(`   Símbolos analizados: ${totalSymbolsAnalyzed}`);
            console.log(`   Brain Analysis keys: ${Object.keys(brainAnalysis).length}`);
            console.log(`   Recomendaciones: ${brainRecommendations.length}`);
            console.log(`   Coherencia: ${enhancedCoherence.globalCoherence}`);
            
            // Verificar datos reales
            console.log('\n[SEARCH] VERIFICACIÓN DE DATOS REALES:');
            const symbols = Object.keys(brainAnalysis);
            
            symbols.forEach(symbol => {
                const data = brainAnalysis[symbol];
                const price = data.realPrice;
                const volume = data.realVolume;
                
                const isRealisticPrice = price && price > 0.01 && price < 100000;
                const isRealisticVolume = volume && volume > 0;
                
                console.log(`\n  ${symbol}:`);
                console.log(`     Precio: $${price?.toFixed(4) || 'N/A'} ${isRealisticPrice ? '[OK]' : '[ERROR]'}`);
                console.log(`     Volumen: ${volume?.toFixed(2) || 'N/A'} ${isRealisticVolume ? '[OK]' : '[ERROR]'}`);
                console.log(`     Brain Score: ${data.brainScore?.toFixed(2) || 'N/A'}%`);
            });
            
            // Verificar recomendaciones
            if (brainRecommendations.length > 0) {
                console.log('\n[ENDPOINTS] RECOMENDACIONES:');
                brainRecommendations.forEach(rec => {
                    const entryPrice = rec.entryPrice;
                    const isRealistic = entryPrice && entryPrice > 0.01 && entryPrice < 100000;
                    
                    console.log(`\n  ${rec.symbol}:`);
                    console.log(`     Action: ${rec.action}`);
                    console.log(`     Entry: $${entryPrice?.toFixed(4) || 'N/A'} ${isRealistic ? '[OK]' : '[ERROR]'}`);
                    console.log(`     Brain Score: ${rec.brainScore?.toFixed(2) || 'N/A'}%`);
                    console.log(`     Leverage: ${rec.leverage}x`);
                });
            }
            
            console.log('\n ¡VERIFICACIÓN COMPLETA!');
            
        } else {
            console.error('[ERROR] Error en la respuesta:', response.data.error);
        }
        
    } catch (error) {
        console.error('[ERROR] Error:', error.message);
    }
}

testQuantumBrainTest();

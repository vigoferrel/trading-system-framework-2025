const axios = require('axios');

async function testSimpleMetrics() {
    try {
        console.log('[SEARCH] Verificando métricas cuánticas...\n');
        
        const response = await axios.get('http://localhost:4602/api/quantum-analysis');
        
        if (response.data.success) {
            const quantumMetrics = response.data.quantumMetrics;
            const symbols = Object.keys(quantumMetrics);
            
            console.log(`[DATA] Total símbolos: ${symbols.length}`);
            
            // Verificar primeros 10 símbolos
            let naCount = 0;
            let placeholderCount = 0;
            let validCount = 0;
            
            symbols.slice(0, 10).forEach(symbol => {
                const metrics = quantumMetrics[symbol];
                const spin = metrics.spinState?.spin_j;
                const area = metrics.quantumArea;
                const volume = metrics.quantumVolume;
                
                console.log(`\n${symbol}:`);
                console.log(`  Spin: ${spin} ${spin === 'N/A' || spin === null ? '[ERROR]' : '[OK]'}`);
                console.log(`  Área: ${area} ${area <= 0.1 ? '[WARNING]' : '[OK]'}`);
                console.log(`  Volumen: ${volume} ${volume < 1000 ? '[WARNING]' : '[OK]'}`);
                
                if (spin === 'N/A' || spin === null || spin === undefined) naCount++;
                if (area <= 0.1) placeholderCount++;
                if (spin && spin !== 'N/A' && area > 0.1 && volume > 1000) validCount++;
            });
            
            console.log(`\n[UP] RESUMEN (primeros 10):`);
            console.log(`  [OK] Válidos: ${validCount}`);
            console.log(`  [ERROR] N/A: ${naCount}`);
            console.log(`  [WARNING]  Placeholders: ${placeholderCount}`);
            
            if (naCount === 0 && placeholderCount === 0) {
                console.log('\n ¡CORRECCIÓN EXITOSA!');
            } else {
                console.log('\n[WARNING]  Aún hay problemas que resolver');
            }
            
        } else {
            console.log('[ERROR] Error en la respuesta');
        }
        
    } catch (error) {
        console.error('[ERROR] Error:', error.message);
    }
}

testSimpleMetrics();

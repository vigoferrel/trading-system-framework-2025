const axios = require('axios');

async function quickCheck() {
    try {
        console.log('[SEARCH] Verificación rápida de métricas...\n');
        
        const response = await axios.get('http://localhost:4602/api/quantum-analysis');
        
        if (response.data.success) {
            const quantumMetrics = response.data.quantumMetrics;
            const symbols = Object.keys(quantumMetrics);
            
            console.log(`[DATA] Total símbolos: ${symbols.length}`);
            
            // Verificar solo los primeros 5 símbolos
            const testSymbols = symbols.slice(0, 5);
            
            testSymbols.forEach(symbol => {
                const metrics = quantumMetrics[symbol];
                const spin = metrics.spinState?.spin_j;
                const area = metrics.quantumArea;
                const volume = metrics.quantumVolume;
                
                console.log(`\n${symbol}:`);
                console.log(`  Spin: ${spin} ${spin === 'N/A' || spin === null ? '[ERROR]' : '[OK]'}`);
                console.log(`  Área: ${area} ${area <= 0.1 ? '[WARNING]' : '[OK]'}`);
                console.log(`  Volumen: ${volume} ${volume < 1000 ? '[WARNING]' : '[OK]'}`);
            });
            
            // Contar problemas
            let naCount = 0;
            let placeholderCount = 0;
            
            symbols.forEach(symbol => {
                const metrics = quantumMetrics[symbol];
                const spin = metrics.spinState?.spin_j;
                const area = metrics.quantumArea;
                
                if (spin === 'N/A' || spin === null || spin === undefined) naCount++;
                if (area <= 0.1) placeholderCount++;
            });
            
            console.log(`\n[UP] RESUMEN TOTAL:`);
            console.log(`  [ERROR] N/A values: ${naCount}/${symbols.length}`);
            console.log(`  [WARNING]  Placeholder values: ${placeholderCount}/${symbols.length}`);
            
            if (naCount === 0 && placeholderCount === 0) {
                console.log('\n ¡CORRECCIÓN EXITOSA! No hay valores N/A ni placeholders');
            } else {
                console.log('\n[WARNING]  Aún hay problemas que resolver');
            }
            
        } else {
            console.log('[ERROR] Error en la respuesta del servidor');
        }
        
    } catch (error) {
        console.error('[ERROR] Error de conexión:', error.message);
    }
}

quickCheck();

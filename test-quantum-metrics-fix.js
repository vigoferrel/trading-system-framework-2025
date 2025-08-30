const axios = require('axios');

async function testQuantumMetricsFix() {
    try {
        console.log('[SEARCH] Probando corrección de métricas cuánticas...\n');
        
        // Test quantum analysis endpoint
        const response = await axios.get('http://localhost:4602/api/quantum-analysis');
        
        if (response.data.success) {
            console.log('[OK] Endpoint de análisis cuántico funcionando');
            
            const quantumMetrics = response.data.quantumMetrics;
            console.log(`[DATA] Total de símbolos analizados: ${Object.keys(quantumMetrics).length}\n`);
            
            // Check for N/A values and placeholder values
            let naCount = 0;
            let placeholderCount = 0;
            let validCount = 0;
            
            Object.entries(quantumMetrics).forEach(([symbol, metrics]) => {
                const spinValue = metrics.spinState?.spin_j;
                const areaValue = metrics.quantumArea;
                const volumeValue = metrics.quantumVolume;
                
                // Check for N/A values
                if (spinValue === 'N/A' || spinValue === null || spinValue === undefined) {
                    naCount++;
                    console.log(`[ERROR] ${symbol}: Spin Financiero = N/A`);
                }
                
                // Check for placeholder values (0.10, 0.00, etc.)
                if (areaValue === 0.10 || areaValue === 0.00 || areaValue < 0.1) {
                    placeholderCount++;
                    console.log(`[WARNING]  ${symbol}: Área Cuántica = ${areaValue} (placeholder)`);
                }
                
                // Check for valid values
                if (spinValue && spinValue !== 'N/A' && areaValue > 0.1 && volumeValue > 1000) {
                    validCount++;
                    if (validCount <= 10) { // Show first 10 valid entries
                        console.log(`[OK] ${symbol}: Spin=${spinValue.toFixed(2)}, Área=${areaValue.toFixed(2)}, Vol=${volumeValue.toFixed(0)}`);
                    }
                }
            });
            
            console.log(`\n[UP] RESUMEN:`);
            console.log(`   [OK] Valores válidos: ${validCount}`);
            console.log(`   [ERROR] Valores N/A: ${naCount}`);
            console.log(`   [WARNING]  Valores placeholder: ${placeholderCount}`);
            
            if (naCount === 0 && placeholderCount === 0) {
                console.log('\n ¡CORRECCIÓN EXITOSA! No se encontraron valores N/A ni placeholders');
            } else {
                console.log('\n[WARNING]  Aún hay valores problemáticos que necesitan corrección');
            }
            
        } else {
            console.log('[ERROR] Error en el endpoint de análisis cuántico');
        }
        
    } catch (error) {
        console.error('[ERROR] Error en la prueba:', error.message);
    }
}

testQuantumMetricsFix();

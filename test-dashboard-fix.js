const axios = require('axios');

// Función para verificar que el dashboard esté funcionando correctamente
async function testDashboardFix() {
    try {
        console.log('[SEARCH] Verificando corrección del dashboard...');
        
        // Obtener datos del endpoint
        const response = await axios.get('http://localhost:4602/api/enhanced-opportunities');
        
        if (response.data && response.data.opportunities) {
            const opportunities = response.data.opportunities;
            
            console.log(`[DATA] Total oportunidades: ${opportunities.length}`);
            
            // Verificar que los datos estén correctos
            const validOpportunities = opportunities.filter(opp => {
                return opp.currentPrice && 
                       !isNaN(opp.currentPrice) && 
                       opp.currentPrice > 0 &&
                       opp.priceChangePercent !== undefined &&
                       opp.volume > 0;
            });
            
            console.log(`[OK] Oportunidades válidas: ${validOpportunities.length}`);
            console.log(`[ERROR] Oportunidades inválidas: ${opportunities.length - validOpportunities.length}`);
            
            // Mostrar ejemplos de datos válidos
            if (validOpportunities.length > 0) {
                console.log('\n[DATA] EJEMPLOS DE DATOS VÁLIDOS:');
                validOpportunities.slice(0, 5).forEach((opp, index) => {
                    console.log(`${index + 1}. ${opp.symbol}:`);
                    console.log(`   Precio: $${opp.currentPrice.toFixed(4)}`);
                    console.log(`   Cambio: ${opp.priceChange.toFixed(4)} (${opp.priceChangePercent.toFixed(2)}%)`);
                    console.log(`   Volumen: ${opp.volume.toLocaleString()}`);
                    console.log(`   Confianza: ${(opp.confidence * 100).toFixed(1)}%`);
                    console.log('');
                });
            }
            
            // Verificar estructura de datos
            if (opportunities.length > 0) {
                const sample = opportunities[0];
                console.log('[SEARCH] ESTRUCTURA DE DATOS:');
                console.log(`- symbol: ${sample.symbol}`);
                console.log(`- currentPrice: ${sample.currentPrice} (${typeof sample.currentPrice})`);
                console.log(`- priceChange: ${sample.priceChange} (${typeof sample.priceChange})`);
                console.log(`- priceChangePercent: ${sample.priceChangePercent} (${typeof sample.priceChangePercent})`);
                console.log(`- volume: ${sample.volume} (${typeof sample.volume})`);
                console.log(`- confidence: ${sample.confidence} (${typeof sample.confidence})`);
            }
            
            // Verificar que no haya NaN
            const nanCount = opportunities.filter(opp => 
                isNaN(opp.currentPrice) || 
                isNaN(opp.priceChange) || 
                isNaN(opp.priceChangePercent) || 
                isNaN(opp.volume)
            ).length;
            
            console.log(`\n[DATA] VERIFICACIÓN DE NaN:`);
            console.log(`- Oportunidades con NaN: ${nanCount}`);
            console.log(`- Porcentaje válido: ${((opportunities.length - nanCount) / opportunities.length * 100).toFixed(1)}%`);
            
            if (nanCount === 0) {
                console.log('[OK] ¡EXCELENTE! No se encontraron valores NaN');
            } else {
                console.log('[WARNING] Se encontraron valores NaN que necesitan corrección');
            }
            
            // Verificar rango de precios
            const prices = validOpportunities.map(opp => opp.currentPrice);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            
            console.log(`\n[DATA] RANGO DE PRECIOS:`);
            console.log(`- Precio mínimo: $${minPrice.toFixed(4)}`);
            console.log(`- Precio máximo: $${maxPrice.toFixed(4)}`);
            console.log(`- Rango válido: ${minPrice > 0 && maxPrice < 1000000 ? '[OK]' : '[ERROR]'}`);
            
            return {
                total: opportunities.length,
                valid: validOpportunities.length,
                invalid: opportunities.length - validOpportunities.length,
                nanCount: nanCount,
                priceRange: { min: minPrice, max: maxPrice }
            };
        }
    } catch (error) {
        console.error('[ERROR] Error verificando dashboard:', error.message);
        return null;
    }
}

// Función para simular el frontend
async function simulateFrontend() {
    try {
        console.log('\n Simulando procesamiento del frontend...');
        
        const response = await axios.get('http://localhost:4602/api/enhanced-opportunities');
        const opportunities = response.data.opportunities || [];
        
        // Simular el procesamiento del frontend
        const processedOpportunities = opportunities.map(opp => {
            const currentPrice = parseFloat(opp.currentPrice || opp.price || 0);
            const priceChange = parseFloat(opp.priceChange || 0);
            const priceChangePercent = parseFloat(opp.priceChangePercent || 0);
            const volume = parseFloat(opp.volume || 0);
            
            return {
                symbol: opp.symbol,
                currentPrice: currentPrice,
                priceChange: priceChange,
                priceChangePercent: priceChangePercent,
                volume: volume,
                isValid: !isNaN(currentPrice) && currentPrice > 0 && !isNaN(priceChangePercent)
            };
        });
        
        const validProcessed = processedOpportunities.filter(opp => opp.isValid);
        
        console.log(`[DATA] Procesamiento del frontend:`);
        console.log(`- Total procesados: ${processedOpportunities.length}`);
        console.log(`- Válidos: ${validProcessed.length}`);
        console.log(`- Inválidos: ${processedOpportunities.length - validProcessed.length}`);
        
        // Mostrar ejemplos de procesamiento
        if (validProcessed.length > 0) {
            console.log('\n[DATA] EJEMPLOS DE PROCESAMIENTO FRONTEND:');
            validProcessed.slice(0, 3).forEach((opp, index) => {
                console.log(`${index + 1}. ${opp.symbol}: $${opp.currentPrice.toFixed(4)} (${opp.priceChangePercent > 0 ? '+' : ''}${opp.priceChangePercent.toFixed(2)}%)`);
            });
        }
        
        return {
            processed: processedOpportunities.length,
            valid: validProcessed.length,
            invalid: processedOpportunities.length - validProcessed.length
        };
    } catch (error) {
        console.error('[ERROR] Error simulando frontend:', error.message);
        return null;
    }
}

// Ejecutar verificación completa
async function main() {
    console.log('[START] VERIFICANDO CORRECCIÓN DEL DASHBOARD\n');
    
    const dashboardResult = await testDashboardFix();
    const frontendResult = await simulateFrontend();
    
    if (dashboardResult && frontendResult) {
        console.log('\n[OK] VERIFICACIÓN COMPLETADA');
        console.log(`[DATA] Backend: ${dashboardResult.valid}/${dashboardResult.total} válidos`);
        console.log(`[DATA] Frontend: ${frontendResult.valid}/${frontendResult.processed} válidos`);
        
        if (dashboardResult.nanCount === 0 && frontendResult.invalid === 0) {
            console.log('\n ¡DASHBOARD CORREGIDO EXITOSAMENTE!');
            console.log('[OK] No se encontraron valores NaN');
            console.log('[OK] Todos los datos son válidos');
            console.log('[OK] El frontend puede procesar correctamente los datos');
        } else {
            console.log('\n[WARNING] Aún hay problemas que necesitan atención');
        }
    }
}

main();

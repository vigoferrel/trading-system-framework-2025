const axios = require('axios');

// Función para verificar símbolos válidos
async function testValidSymbols() {
    try {
        console.log('[SEARCH] Verificando sistema con plantilla de símbolos válidos...');
        
        // Obtener datos del endpoint
        const response = await axios.get('http://localhost:4602/api/enhanced-opportunities');
        
        if (response.data && response.data.opportunities) {
            const opportunities = response.data.opportunities;
            
            console.log(`[OK] Oportunidades obtenidas: ${opportunities.length}`);
            
            // Verificar que todos los símbolos son válidos
            const validSymbols = require('./valid-symbols-template.js').VALID_BINANCE_FUTURES_SYMBOLS;
            const invalidSymbols = [];
            
            opportunities.forEach(opp => {
                if (!validSymbols.includes(opp.symbol)) {
                    invalidSymbols.push(opp.symbol);
                }
            });
            
            if (invalidSymbols.length === 0) {
                console.log('[OK] Todos los símbolos son válidos');
            } else {
                console.log('[ERROR] Símbolos inválidos encontrados:', invalidSymbols);
            }
            
            // Mostrar algunos ejemplos
            console.log('\n[DATA] Ejemplos de oportunidades válidas:');
            opportunities.slice(0, 5).forEach(opp => {
                console.log(`  ${opp.symbol}: $${opp.currentPrice} (${opp.priceChangePercent.toFixed(2)}%) - Vol: ${opp.displayVolume}`);
            });
            
            // Estadísticas
            const longs = opportunities.filter(opp => opp.priceChangePercent > 0);
            const shorts = opportunities.filter(opp => opp.priceChangePercent < 0);
            
            console.log(`\n[UP] Estadísticas:`);
            console.log(`  LONGS: ${longs.length}`);
            console.log(`  SHORTS: ${shorts.length}`);
            console.log(`  Total: ${opportunities.length}`);
            
        } else {
            console.log('[ERROR] No se pudieron obtener oportunidades');
        }
        
    } catch (error) {
        console.error('[ERROR] Error verificando símbolos:', error.message);
    }
}

// Ejecutar
testValidSymbols();

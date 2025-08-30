const axios = require('axios');

// Función para obtener símbolos válidos de Binance Futures
async function getValidBinanceFuturesSymbols() {
    try {
        console.log('[SEARCH] Obteniendo símbolos válidos de Binance Futures...');
        
        // Obtener datos reales de Binance Futures
        const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr');
        
        if (response.data && Array.isArray(response.data)) {
            const validSymbols = [];
            
            // Filtrar solo símbolos USDT que realmente existen
            response.data.forEach(item => {
                if (item.symbol.endsWith('USDT') && 
                    parseFloat(item.lastPrice) > 0 && 
                    parseFloat(item.volume) > 0) {
                    validSymbols.push(item.symbol);
                }
            });
            
            // Ordenar alfabéticamente
            validSymbols.sort();
            
            console.log(`[OK] Símbolos válidos encontrados: ${validSymbols.length}`);
            
            // Crear el template
            const template = `// PLANTILLA ÚNICA DE SÍMBOLOS VÁLIDOS DE BINANCE FUTURES
// Generado automáticamente: ${new Date().toISOString()}
// Total símbolos válidos: ${validSymbols.length}

const VALID_BINANCE_FUTURES_SYMBOLS = [
${validSymbols.map(symbol => `    '${symbol}'`).join(',\n')}
];

module.exports = { VALID_BINANCE_FUTURES_SYMBOLS };`;
            
            // Guardar en archivo
            const fs = require('fs');
            fs.writeFileSync('valid-symbols-template.js', template);
            
            console.log('[OK] Template guardado en: valid-symbols-template.js');
            console.log(`[DATA] Primeros 10 símbolos: ${validSymbols.slice(0, 10).join(', ')}`);
            console.log(`[DATA] Últimos 10 símbolos: ${validSymbols.slice(-10).join(', ')}`);
            
            return validSymbols;
        }
    } catch (error) {
        console.error('[ERROR] Error obteniendo símbolos válidos:', error.message);
        return [];
    }
}

// Ejecutar
getValidBinanceFuturesSymbols();

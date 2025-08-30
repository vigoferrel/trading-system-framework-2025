const axios = require('axios');

// Función para verificar símbolos realmente listados en Binance Futures
async function checkListedSymbols() {
    try {
        console.log('[SEARCH] Verificando símbolos realmente listados en Binance Futures...');
        
        // Obtener información de exchange para verificar símbolos listados
        const exchangeInfoResponse = await axios.get('https://fapi.binance.com/fapi/v1/exchangeInfo');
        
        if (exchangeInfoResponse.data && exchangeInfoResponse.data.symbols) {
            const listedSymbols = [];
            const unlistedSymbols = [];
            
            // Obtener la plantilla actual
            const currentTemplate = require('./valid-symbols-template.js').VALID_BINANCE_FUTURES_SYMBOLS;
            
            console.log(`[DATA] Verificando ${currentTemplate.length} símbolos de la plantilla...`);
            
            // Verificar cada símbolo de la plantilla
            currentTemplate.forEach(symbol => {
                const symbolInfo = exchangeInfoResponse.data.symbols.find(item => item.symbol === symbol);
                
                if (symbolInfo && symbolInfo.status === 'TRADING') {
                    listedSymbols.push(symbol);
                } else {
                    unlistedSymbols.push(symbol);
                }
            });
            
            console.log(`[OK] Símbolos listados encontrados: ${listedSymbols.length}`);
            console.log(`[ERROR] Símbolos no listados encontrados: ${unlistedSymbols.length}`);
            
            if (unlistedSymbols.length > 0) {
                console.log('\n[ALERT] SÍMBOLOS NO LISTADOS DETECTADOS:');
                unlistedSymbols.forEach(symbol => {
                    console.log(`  - ${symbol}`);
                });
            }
            
            // Crear nueva plantilla con solo símbolos listados
            const newTemplate = `// PLANTILLA ÚNICA DE SÍMBOLOS LISTADOS EN BINANCE FUTURES
// Generado automáticamente: ${new Date().toISOString()}
// Total símbolos listados: ${listedSymbols.length}
// Símbolos no listados eliminados: ${unlistedSymbols.length}

const VALID_BINANCE_FUTURES_SYMBOLS = [
${listedSymbols.map(symbol => `    '${symbol}'`).join(',\n')}
];

module.exports = { VALID_BINANCE_FUTURES_SYMBOLS };`;
            
            // Guardar nueva plantilla
            const fs = require('fs');
            fs.writeFileSync('valid-symbols-template.js', newTemplate);
            
            console.log('\n[OK] Nueva plantilla guardada con solo símbolos listados');
            console.log(`[DATA] Total símbolos listados: ${listedSymbols.length}`);
            
            // Verificar específicamente MEMEFIUSDT y XEMUSDT
            console.log('\n[SEARCH] Verificación específica:');
            console.log(`MEMEFIUSDT está listado: ${listedSymbols.includes('MEMEFIUSDT')}`);
            console.log(`XEMUSDT está listado: ${listedSymbols.includes('XEMUSDT')}`);
            
            // Mostrar algunos ejemplos de símbolos listados
            console.log('\n[DATA] Ejemplos de símbolos listados:');
            listedSymbols.slice(0, 10).forEach(symbol => {
                console.log(`  - ${symbol}`);
            });
            
            return {
                listedSymbols,
                unlistedSymbols,
                totalListed: listedSymbols.length,
                totalUnlisted: unlistedSymbols.length
            };
        }
    } catch (error) {
        console.error('[ERROR] Error verificando símbolos listados:', error.message);
        return null;
    }
}

// Ejecutar verificación
checkListedSymbols();

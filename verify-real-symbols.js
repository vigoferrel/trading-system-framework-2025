const axios = require('axios');

// Función para verificar símbolos reales de Binance Futures
async function verifyRealSymbols() {
    try {
        console.log('[SEARCH] Verificando símbolos reales de Binance Futures...');
        
        // Obtener datos reales de Binance Futures
        const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr');
        
        if (response.data && Array.isArray(response.data)) {
            const realSymbols = [];
            const fakeSymbols = [];
            
            // Obtener la plantilla actual
            const currentTemplate = require('./valid-symbols-template.js').VALID_BINANCE_FUTURES_SYMBOLS;
            
            console.log(`[DATA] Verificando ${currentTemplate.length} símbolos de la plantilla...`);
            
            // Verificar cada símbolo de la plantilla
            currentTemplate.forEach(symbol => {
                const exists = response.data.some(item => item.symbol === symbol);
                if (exists) {
                    realSymbols.push(symbol);
                } else {
                    fakeSymbols.push(symbol);
                }
            });
            
            console.log(`[OK] Símbolos reales encontrados: ${realSymbols.length}`);
            console.log(`[ERROR] Símbolos falsos encontrados: ${fakeSymbols.length}`);
            
            if (fakeSymbols.length > 0) {
                console.log('\n[ALERT] SÍMBOLOS FALSOS DETECTADOS:');
                fakeSymbols.forEach(symbol => {
                    console.log(`  - ${symbol}`);
                });
            }
            
            // Crear nueva plantilla con solo símbolos reales
            const newTemplate = `// PLANTILLA ÚNICA DE SÍMBOLOS VÁLIDOS DE BINANCE FUTURES
// Generado automáticamente: ${new Date().toISOString()}
// Total símbolos válidos: ${realSymbols.length}
// Símbolos falsos eliminados: ${fakeSymbols.length}

const VALID_BINANCE_FUTURES_SYMBOLS = [
${realSymbols.map(symbol => `    '${symbol}'`).join(',\n')}
];

module.exports = { VALID_BINANCE_FUTURES_SYMBOLS };`;
            
            // Guardar nueva plantilla
            const fs = require('fs');
            fs.writeFileSync('valid-symbols-template.js', newTemplate);
            
            console.log('\n[OK] Nueva plantilla guardada con solo símbolos reales');
            console.log(`[DATA] Total símbolos válidos: ${realSymbols.length}`);
            
            // Verificar específicamente MEMEFIUSDT y XEMUSDT
            console.log('\n[SEARCH] Verificación específica:');
            console.log(`MEMEFIUSDT existe: ${realSymbols.includes('MEMEFIUSDT')}`);
            console.log(`XEMUSDT existe: ${realSymbols.includes('XEMUSDT')}`);
            
            return {
                realSymbols,
                fakeSymbols,
                totalReal: realSymbols.length,
                totalFake: fakeSymbols.length
            };
        }
    } catch (error) {
        console.error('[ERROR] Error verificando símbolos:', error.message);
        return null;
    }
}

// Ejecutar verificación
verifyRealSymbols();

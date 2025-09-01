
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

const https = require('https');

async function checkSymbolAvailability(symbol) {
    return new Promise((resolve) => {
        const url = `https://fapi.binance.com/fapi/v1/ticker/price?symbol=${symbol}USDT`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.symbol) {
                        resolve({ symbol: symbol, available: true, price: result.price });
                    } else {
                        resolve({ symbol: symbol, available: false, error: result.msg || 'Not found' });
                    }
                } catch (e) {
                    resolve({ symbol: symbol, available: false, error: 'Parse error' });
                }
            });
        }).on('error', (err) => {
            resolve({ symbol: symbol, available: false, error: err.message });
        });
    });
}

async function validateAllSymbols() {
    const symbols = [
        'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE',
        'ADA', 'AVAX', 'DOT', 'LINK',
        'UNI', 'LTC', 'BCH', 'ATOM', 'NEAR',
        'FTM', 'ALGO', 'VET', 'ICP', 'FIL'
    ];
    
    console.log('[SEARCH] Validando símbolos en Binance Futures...\n');
    
    const results = [];
    for (const symbol of symbols) {
        const result = await checkSymbolAvailability(symbol);
        results.push(result);
        
        if (result.available) {
            console.log(`[OK] ${symbol}USDT - $${result.price}`);
        } else {
            console.log(`[ERROR] ${symbol}USDT - ${result.error}`);
        }
        
        // Pequeña pausa para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const available = results.filter(r => r.available);
    const unavailable = results.filter(r => !r.available);
    
    console.log('\n[DATA] RESUMEN:');
    console.log(`[OK] Símbolos disponibles: ${available.length}`);
    console.log(`[ERROR] Símbolos no disponibles: ${unavailable.length}`);
    
    if (unavailable.length > 0) {
        console.log('\n[ERROR] SÍMBOLOS PROBLEMÁTICOS:');
        unavailable.forEach(r => console.log(`   - ${r.symbol}USDT: ${r.error}`));
    }
    
    return results;
}

validateAllSymbols().catch(console.error);

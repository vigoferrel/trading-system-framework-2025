
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

const axios = require('axios');

async function testBinanceSymbols() {
    try {
        console.log('[SEARCH] Verificando símbolos reales de Binance Futures...');
        
        // Obtener datos de la API de Binance Futures
        const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr');
        
        if (response.data && Array.isArray(response.data)) {
            console.log(`[DATA] Total de símbolos recibidos: ${response.data.length}`);
            
            // Filtrar solo símbolos USDT
            const usdtSymbols = response.data.filter(item => item.symbol.endsWith('USDT'));
            console.log(`[UP] Símbolos USDT encontrados: ${usdtSymbols.length}`);
            
            // Verificar algunos símbolos problemáticos
            const problematicSymbols = ['BNXUSDT', 'ASRUSDT', 'BANDUSDT', 'MYXUSDT', 'EPTUSDT', 'VIDTUSDT'];
            
            console.log('\n[SEARCH] Verificando símbolos problemáticos:');
            problematicSymbols.forEach(symbol => {
                const found = usdtSymbols.find(item => item.symbol === symbol);
                if (found) {
                    console.log(`[ERROR] ${symbol} - ENCONTRADO (precio: $${found.lastPrice})`);
                } else {
                    console.log(`[OK] ${symbol} - NO ENCONTRADO`);
                }
            });
            
            // Mostrar algunos símbolos reales
            console.log('\n[OK] Primeros 10 símbolos reales:');
            usdtSymbols.slice(0, 10).forEach(item => {
                console.log(`  ${item.symbol}: $${item.lastPrice} (${item.priceChangePercent}%)`);
            });
            
            // Verificar si hay símbolos con precios sospechosos
            console.log('\n[ALERT] Símbolos con precios sospechosos:');
            usdtSymbols.forEach(item => {
                const price = parseFloat(item.lastPrice);
                if (price === 0 || price < 0.0001 || price > 100000) {
                    console.log(`  ${item.symbol}: $${item.lastPrice} (sospechoso)`);
                }
            });
            
        } else {
            console.log('[ERROR] No se recibieron datos válidos de Binance');
        }
        
    } catch (error) {
        console.error('[ERROR] Error verificando símbolos:', error.message);
    }
}

testBinanceSymbols();

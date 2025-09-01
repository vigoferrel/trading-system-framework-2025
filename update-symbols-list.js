
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

async function updateSymbolsList() {
    try {
        console.log('[RELOAD] [ACTUALIZACIÓN] Generando lista completa de símbolos de Binance Futures...\n');
        
        // Obtener todos los símbolos de la API de Binance Futures
        const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr');
        
        if (response.data && Array.isArray(response.data)) {
            // Filtrar solo símbolos USDT
            const usdtSymbols = response.data.filter(item => item.symbol.endsWith('USDT'));
            
            console.log(`[DATA] Total símbolos USDT encontrados: ${usdtSymbols.length}`);
            
            // Filtrar símbolos válidos (con precios y volúmenes razonables)
            const validSymbols = usdtSymbols.filter(item => {
                const price = parseFloat(item.lastPrice);
                const volume = parseFloat(item.volume);
                const change = parseFloat(item.priceChangePercent);
                
                // Criterios de validación
                return price > 0 && 
                       price < 100000 && 
                       volume > 0 && 
                       Math.abs(change) < 1000; // Excluir cambios extremos
            });
            
            console.log(`[OK] Símbolos válidos después de filtrado: ${validSymbols.length}`);
            
            // Ordenar por volumen (mayor a menor)
            validSymbols.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
            
            // Generar la nueva lista de símbolos
            const symbolsList = validSymbols.map(item => `'${item.symbol}'`);
            
            // Crear el código JavaScript para la nueva lista
            const newListCode = `//  SÍMBOLOS REALES DE BINANCE FUTURES (LISTA COMPLETA Y ACTUALIZADA)
// Total símbolos: ${validSymbols.length}
// Última actualización: ${new Date().toISOString()}
const REAL_BINANCE_FUTURES_SYMBOLS = [
    ${symbolsList.join(',\n    ')}
];`;
            
            // Guardar en archivo
            const fs = require('fs');
            fs.writeFileSync('updated-symbols-list.js', newListCode);
            
            console.log('\n[OK] Lista actualizada guardada en: updated-symbols-list.js');
            console.log(`[DATA] Total símbolos incluidos: ${validSymbols.length}`);
            
            // Mostrar los primeros 20 símbolos con mayor volumen
            console.log('\n Top 20 símbolos por volumen:');
            validSymbols.slice(0, 20).forEach((item, index) => {
                const volume = parseFloat(item.volume);
                const volumeFormatted = volume > 1000000000 ? 
                    `${(volume / 1000000000).toFixed(1)}B` : 
                    volume > 1000000 ? 
                    `${(volume / 1000000).toFixed(1)}M` : 
                    `${(volume / 1000).toFixed(1)}K`;
                
                console.log(`${index + 1}. ${item.symbol}: $${item.lastPrice} (${item.priceChangePercent}%) - Vol: ${volumeFormatted}`);
            });
            
            // Mostrar estadísticas de la nueva lista
            console.log('\n[UP] Estadísticas de la nueva lista:');
            const avgPrice = validSymbols.reduce((sum, item) => sum + parseFloat(item.lastPrice), 0) / validSymbols.length;
            const avgVolume = validSymbols.reduce((sum, item) => sum + parseFloat(item.volume), 0) / validSymbols.length;
            const avgChange = validSymbols.reduce((sum, item) => sum + Math.abs(parseFloat(item.priceChangePercent)), 0) / validSymbols.length;
            
            console.log(`   Precio promedio: $${avgPrice.toFixed(4)}`);
            console.log(`   Volumen promedio: ${(avgVolume / 1000000).toFixed(1)}M`);
            console.log(`   Cambio promedio: ${avgChange.toFixed(2)}%`);
            
            // Verificar si los símbolos problemáticos están incluidos
            const problematicSymbols = ['BNXUSDT', 'ASRUSDT', 'BANDUSDT', 'MYXUSDT', 'EPTUSDT', 'VIDTUSDT', 'MEMEFIUSDT', 'AMBUSDT', 'NEIROETHUSDT', 'FHEUSDT'];
            console.log('\n[SEARCH] Verificando símbolos problemáticos en la nueva lista:');
            problematicSymbols.forEach(symbol => {
                const found = validSymbols.find(item => item.symbol === symbol);
                if (found) {
                    console.log(`[OK] ${symbol} - INCLUIDO en nueva lista`);
                } else {
                    console.log(`[ERROR] ${symbol} - NO incluido (filtrado por criterios)`);
                }
            });
            
            return validSymbols;
            
        } else {
            console.log('[ERROR] No se recibieron datos válidos de la API');
            return [];
        }
        
    } catch (error) {
        console.error('[ERROR] Error actualizando lista de símbolos:', error.message);
        return [];
    }
}

updateSymbolsList();

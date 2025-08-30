const axios = require('axios');

// Función para diagnosticar inconsistencias de datos
async function diagnoseDataInconsistencies() {
    try {
        console.log('[SEARCH] Diagnosticando inconsistencias de datos...');
        
        // Obtener datos del endpoint
        const response = await axios.get('http://localhost:4602/api/enhanced-opportunities');
        
        if (response.data && response.data.opportunities) {
            const opportunities = response.data.opportunities;
            
            console.log(`[DATA] Total oportunidades: ${opportunities.length}`);
            
            // Analizar problemas
            const problems = {
                nanPrices: [],
                invalidPrices: [],
                missingData: [],
                zeroVolumes: []
            };
            
            opportunities.forEach((opp, index) => {
                // Verificar precios NaN
                if (isNaN(opp.currentPrice) || opp.currentPrice === null || opp.currentPrice === undefined) {
                    problems.nanPrices.push({
                        symbol: opp.symbol,
                        index: index,
                        currentPrice: opp.currentPrice,
                        priceChange: opp.priceChange,
                        priceChangePercent: opp.priceChangePercent
                    });
                }
                
                // Verificar precios inválidos
                if (opp.currentPrice <= 0 && !isNaN(opp.currentPrice)) {
                    problems.invalidPrices.push({
                        symbol: opp.symbol,
                        currentPrice: opp.currentPrice
                    });
                }
                
                // Verificar datos faltantes
                if (!opp.priceChange && !opp.priceChangePercent) {
                    problems.missingData.push({
                        symbol: opp.symbol,
                        volume: opp.volume
                    });
                }
                
                // Verificar volúmenes cero
                if (opp.volume === 0 || opp.volume === null || opp.volume === undefined) {
                    problems.zeroVolumes.push({
                        symbol: opp.symbol,
                        volume: opp.volume
                    });
                }
            });
            
            // Mostrar resultados
            console.log('\n[DATA] DIAGNÓSTICO DE PROBLEMAS:');
            console.log(`[ERROR] Precios NaN: ${problems.nanPrices.length}`);
            console.log(`[ERROR] Precios inválidos: ${problems.invalidPrices.length}`);
            console.log(`[ERROR] Datos faltantes: ${problems.missingData.length}`);
            console.log(`[ERROR] Volúmenes cero: ${problems.zeroVolumes.length}`);
            
            if (problems.nanPrices.length > 0) {
                console.log('\n[ALERT] SÍMBOLOS CON PRECIOS NaN:');
                problems.nanPrices.slice(0, 10).forEach(problem => {
                    console.log(`  - ${problem.symbol}: precio=${problem.currentPrice}, cambio=${problem.priceChange}, cambio%=${problem.priceChangePercent}`);
                });
            }
            
            if (problems.invalidPrices.length > 0) {
                console.log('\n[ALERT] SÍMBOLOS CON PRECIOS INVÁLIDOS:');
                problems.invalidPrices.slice(0, 10).forEach(problem => {
                    console.log(`  - ${problem.symbol}: precio=${problem.currentPrice}`);
                });
            }
            
            // Verificar datos de Binance directamente
            console.log('\n[SEARCH] Verificando datos directos de Binance...');
            const binanceResponse = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr');
            
            if (binanceResponse.data && Array.isArray(binanceResponse.data)) {
                const binanceData = binanceResponse.data;
                console.log(`[DATA] Datos de Binance obtenidos: ${binanceData.length} símbolos`);
                
                // Verificar algunos símbolos problemáticos
                const problematicSymbols = problems.nanPrices.slice(0, 5).map(p => p.symbol);
                
                problematicSymbols.forEach(symbol => {
                    const binanceSymbol = binanceData.find(item => item.symbol === symbol);
                    if (binanceSymbol) {
                        console.log(`[OK] ${symbol} en Binance: precio=${binanceSymbol.lastPrice}, cambio=${binanceSymbol.priceChange}, cambio%=${binanceSymbol.priceChangePercent}%`);
                    } else {
                        console.log(`[ERROR] ${symbol} NO encontrado en Binance`);
                    }
                });
            }
            
            return problems;
        }
    } catch (error) {
        console.error('[ERROR] Error diagnosticando inconsistencias:', error.message);
        return null;
    }
}

// Función para corregir inconsistencias
async function fixDataInconsistencies() {
    try {
        console.log('\n Corrigiendo inconsistencias de datos...');
        
        // Obtener datos directos de Binance
        const binanceResponse = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr');
        
        if (binanceResponse.data && Array.isArray(binanceResponse.data)) {
            const binanceData = binanceResponse.data;
            
            // Crear mapa de datos válidos
            const validDataMap = {};
            binanceData.forEach(item => {
                if (item.symbol.endsWith('USDT') && 
                    parseFloat(item.lastPrice) > 0 && 
                    parseFloat(item.volume) > 0) {
                    validDataMap[item.symbol] = {
                        price: parseFloat(item.lastPrice),
                        priceChange: parseFloat(item.priceChange),
                        priceChangePercent: parseFloat(item.priceChangePercent),
                        volume: parseFloat(item.volume)
                    };
                }
            });
            
            console.log(`[OK] Datos válidos de Binance: ${Object.keys(validDataMap).length} símbolos`);
            
            // Crear script de corrección
            const correctionScript = `// SCRIPT DE CORRECCIÓN DE INCONSISTENCIAS
// Generado automáticamente: ${new Date().toISOString()}

const VALID_BINANCE_DATA = ${JSON.stringify(validDataMap, null, 2)};

// Función para obtener datos válidos
function getValidBinanceData(symbol) {
    return VALID_BINANCE_DATA[symbol] || null;
}

// Función para validar precio
function validatePrice(price) {
    if (isNaN(price) || price <= 0 || price === null || price === undefined) {
        return false;
    }
    return true;
}

// Función para obtener precio válido
function getValidPrice(symbol, fallbackPrice = 100) {
    const validData = getValidBinanceData(symbol);
    if (validData && validatePrice(validData.price)) {
        return validData.price;
    }
    return fallbackPrice;
}

module.exports = { 
    VALID_BINANCE_DATA, 
    getValidBinanceData, 
    validatePrice, 
    getValidPrice 
};`;
            
            // Guardar script de corrección
            const fs = require('fs');
            fs.writeFileSync('data-correction.js', correctionScript);
            
            console.log('[OK] Script de corrección guardado: data-correction.js');
            
            // Mostrar estadísticas
            const validSymbols = Object.keys(validDataMap);
            console.log(`[DATA] Símbolos válidos: ${validSymbols.length}`);
            console.log(`[DATA] Rango de precios: $${Math.min(...Object.values(validDataMap).map(d => d.price)).toFixed(4)} - $${Math.max(...Object.values(validDataMap).map(d => d.price)).toFixed(4)}`);
            
            return validDataMap;
        }
    } catch (error) {
        console.error('[ERROR] Error corrigiendo inconsistencias:', error.message);
        return null;
    }
}

// Ejecutar diagnóstico y corrección
async function main() {
    console.log('[START] INICIANDO DIAGNÓSTICO Y CORRECCIÓN DE DATOS\n');
    
    const problems = await diagnoseDataInconsistencies();
    const validData = await fixDataInconsistencies();
    
    if (problems && validData) {
        console.log('\n[OK] DIAGNÓSTICO COMPLETADO');
        console.log(`[DATA] Total problemas encontrados: ${problems.nanPrices.length + problems.invalidPrices.length + problems.missingData.length + problems.zeroVolumes.length}`);
        console.log(`[DATA] Datos válidos disponibles: ${Object.keys(validData).length} símbolos`);
        
        if (problems.nanPrices.length > 0) {
            console.log('\n[WARNING] RECOMENDACIÓN: Actualizar el sistema para usar datos válidos de Binance');
        }
    }
}

main();

/**
 * 🎯 ANÁLISIS INTERSECCIÓN SPOT + FUTURES - QBTC FRAMEWORK
 * =======================================================
 * 
 * Script para encontrar exactamente qué símbolos del framework QBTC
 * están disponibles TANTO en Binance SPOT como en FUTURES
 */

const axios = require('axios');

// 🎯 FRAMEWORK COMPLETO QBTC - 77 SÍMBOLOS (del contexto externo)
const ALL_QBTC_SYMBOLS = {
    // 👑 TIER 1: LA TRINIDAD SUPREMA (3 símbolos)
    TIER1: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
    
    // 🥈 TIER 2: LA CORTE NOBLE (12 símbolos)
    TIER2: ['SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 
           'LINKUSDT', 'MATICUSDT', 'LTCUSDT', 'BCHUSDT', 'ATOMUSDT', 'NEARUSDT'],
    
    // 🥉 TIER 3: LA NOBLEZA POPULAR (20 símbolos)
    TIER3: ['UNIUSDT', 'FILUSDT', 'TRXUSDT', 'ETCUSDT', 'XLMUSDT', 'ICPUSDT',
           'VETUSDT', 'FTMUSDT', 'ALGOUSDT', 'SANDUSDT', 'MANAUSDT', 'AXSUSDT',
           'THETAUSDT', 'GRTUSDT', 'EOSUSDT', 'AAVEUSDT', 'MKRUSDT', 'COMPUSDT',
           'SNXUSDT', 'SUSHIUSDT'],
    
    // 🚀 TIER 4: LOS EMERGENTES (14 símbolos)
    TIER4: ['APTUSDT', 'SUIUSDT', 'ARBUSDT', 'OPUSDT', 'INJUSDT', 'STXUSDT',
           'TIAUSDT', 'SEIUSDT', 'ORDIUSDT', '1000PEPEUSDT', '1000FLOKIUSDT',
           'WIFUSDT', 'BONKUSDT', '1000SATSUSDT'],
    
    // 💎 TIER 5: LOS ESPECIALISTAS (16 símbolos)
    TIER5: ['CRVUSDT', 'LRCUSDT', 'ENJUSDT', 'CHZUSDT', 'BATUSDT', 'ZRXUSDT',
           'RENUSDT', 'STORJUSDT', 'CTKUSDT', 'BNTUSDT', 'DYDXUSDT', 'UMAUSDT',
           'BANDUSDT', 'KAVAUSDT', 'IOTAUSDT', 'ONTUSDT'],
    
    // 🌊 TIER 6: LOS VISIONARIOS (12 símbolos)
    TIER6: ['APEUSDT', 'GALAUSDT', 'GMEUSDT', 'IMXUSDT', 'LOOKSUSDT', 'MINAUSDT',
           'FLOWUSDT', 'CHRUSDT', 'TLMUSDT', 'ALPACAUSDT', 'YGGUSDT', 'GHSTUSDT']
};

// Combinar todos los símbolos QBTC (77 total)
const ALL_QBTC_SYMBOLS_LIST = [
    ...ALL_QBTC_SYMBOLS.TIER1,
    ...ALL_QBTC_SYMBOLS.TIER2, 
    ...ALL_QBTC_SYMBOLS.TIER3,
    ...ALL_QBTC_SYMBOLS.TIER4,
    ...ALL_QBTC_SYMBOLS.TIER5,
    ...ALL_QBTC_SYMBOLS.TIER6
];

console.log(`🎯 ANÁLISIS INTERSECCIÓN SPOT + FUTURES`);
console.log(`=====================================`);
console.log(`📊 Total símbolos QBTC Framework: ${ALL_QBTC_SYMBOLS_LIST.length}`);

async function analyzeSpotFuturesIntersection() {
    try {
        console.log(`\n🔍 Consultando APIs de Binance...`);
        
        // Consultar SPOT API
        console.log(`📈 Consultando SPOT API...`);
        const spotResponse = await axios.get('https://api.binance.com/api/v3/ticker/24hr', {
            timeout: 15000,
            headers: { 'User-Agent': 'QBTCAnalyzer/1.0' }
        });
        const spotSymbols = new Set(spotResponse.data.map(item => item.symbol));
        console.log(`✅ SPOT: ${spotSymbols.size} símbolos total`);
        
        // Consultar FUTURES API
        console.log(`🚀 Consultando FUTURES API...`);
        const futuresResponse = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr', {
            timeout: 15000,
            headers: { 'User-Agent': 'QBTCAnalyzer/1.0' }
        });
        const futuresSymbols = new Set(futuresResponse.data.map(item => item.symbol));
        console.log(`✅ FUTURES: ${futuresSymbols.size} símbolos total`);
        
        // Analizar disponibilidad por tier
        console.log(`\n📊 ANÁLISIS POR TIER - INTERSECCIÓN SPOT + FUTURES:`);
        
        const results = {
            availableInBoth: [],
            onlyInSpot: [],
            onlyInFutures: [],
            notAvailable: [],
            tierBreakdown: {}
        };
        
        Object.keys(ALL_QBTC_SYMBOLS).forEach(tier => {
            const tierSymbols = ALL_QBTC_SYMBOLS[tier];
            const tierResults = {
                inBoth: [],
                onlySpot: [],
                onlyFutures: [],
                missing: []
            };
            
            tierSymbols.forEach(symbol => {
                const inSpot = spotSymbols.has(symbol);
                const inFutures = futuresSymbols.has(symbol);
                
                if (inSpot && inFutures) {
                    tierResults.inBoth.push(symbol);
                    results.availableInBoth.push(symbol);
                } else if (inSpot && !inFutures) {
                    tierResults.onlySpot.push(symbol);
                    results.onlyInSpot.push(symbol);
                } else if (!inSpot && inFutures) {
                    tierResults.onlyFutures.push(symbol);
                    results.onlyInFutures.push(symbol);
                } else {
                    tierResults.missing.push(symbol);
                    results.notAvailable.push(symbol);
                }
            });
            
            results.tierBreakdown[tier] = tierResults;
            
            console.log(`\n${getTierIcon(tier)} ${tier} (${tierSymbols.length} símbolos):`);
            console.log(`  ✅ SPOT + FUTURES (${tierResults.inBoth.length}): ${tierResults.inBoth.join(', ')}`);
            if (tierResults.onlySpot.length > 0) {
                console.log(`  📈 Solo SPOT (${tierResults.onlySpot.length}): ${tierResults.onlySpot.join(', ')}`);
            }
            if (tierResults.onlyFutures.length > 0) {
                console.log(`  🚀 Solo FUTURES (${tierResults.onlyFutures.length}): ${tierResults.onlyFutures.join(', ')}`);
            }
            if (tierResults.missing.length > 0) {
                console.log(`  ❌ NO disponibles (${tierResults.missing.length}): ${tierResults.missing.join(', ')}`);
            }
        });
        
        console.log(`\n🎯 RESUMEN FINAL:`);
        console.log(`✅ Disponibles en AMBOS (SPOT + FUTURES): ${results.availableInBoth.length}/${ALL_QBTC_SYMBOLS_LIST.length} (${((results.availableInBoth.length/ALL_QBTC_SYMBOLS_LIST.length)*100).toFixed(1)}%)`);
        console.log(`📈 Solo en SPOT: ${results.onlyInSpot.length}`);
        console.log(`🚀 Solo en FUTURES: ${results.onlyInFutures.length}`);
        console.log(`❌ No disponibles: ${results.notAvailable.length}`);
        
        if (results.onlyInSpot.length > 0) {
            console.log(`\n📈 SÍMBOLOS SOLO EN SPOT:`);
            results.onlyInSpot.forEach((symbol, index) => {
                console.log(`${index + 1}. ${symbol}`);
            });
        }
        
        if (results.onlyInFutures.length > 0) {
            console.log(`\n🚀 SÍMBOLOS SOLO EN FUTURES:`);
            results.onlyInFutures.forEach((symbol, index) => {
                console.log(`${index + 1}. ${symbol}`);
            });
        }
        
        if (results.notAvailable.length > 0) {
            console.log(`\n❌ SÍMBOLOS NO DISPONIBLES EN NINGUNO:`);
            results.notAvailable.forEach((symbol, index) => {
                console.log(`${index + 1}. ${symbol}`);
            });
        }
        
        // Mostrar símbolos óptimos para YieldDashboard
        console.log(`\n🎯 SÍMBOLOS ÓPTIMOS PARA YIELD DASHBOARD (${results.availableInBoth.length}):`);
        console.log(`========================================`);
        
        const columns = 6;
        let symbolGrid = '';
        for (let i = 0; i < results.availableInBoth.length; i += columns) {
            const row = results.availableInBoth.slice(i, i + columns);
            symbolGrid += row.map(s => s.padEnd(12)).join(' ') + '\n';
        }
        console.log(symbolGrid);
        
        // Generar configuración JavaScript para el dashboard
        console.log(`\n🔧 CONFIGURACIÓN PARA YIELD DASHBOARD:`);
        console.log(`=====================================`);
        console.log(`const QBTC_AVAILABLE_SYMBOLS = [`);
        results.availableInBoth.forEach((symbol, index) => {
            const comma = index < results.availableInBoth.length - 1 ? ',' : '';
            console.log(`    '${symbol}'${comma}`);
        });
        console.log(`]; // Total: ${results.availableInBoth.length} símbolos`);
        
        // Análisis de oportunidades adicionales
        const totalAvailable = results.availableInBoth.length + results.onlyInSpot.length + results.onlyInFutures.length;
        console.log(`\n💡 OPORTUNIDADES DE EXPANSIÓN:`);
        console.log(`🎯 Núcleo sólido (SPOT + FUTURES): ${results.availableInBoth.length} símbolos`);
        console.log(`📊 Expansión posible (solo SPOT): +${results.onlyInSpot.length} símbolos`);
        console.log(`⚡ Expansión posible (solo FUTURES): +${results.onlyInFutures.length} símbolos`);
        console.log(`🚀 Total disponible: ${totalAvailable}/${ALL_QBTC_SYMBOLS_LIST.length} (${((totalAvailable/ALL_QBTC_SYMBOLS_LIST.length)*100).toFixed(1)}%)`);
        
        return results;
        
    } catch (error) {
        console.error(`❌ Error consultando APIs:`, error.message);
        return null;
    }
}

function getTierIcon(tier) {
    const icons = {
        'TIER1': '👑',
        'TIER2': '🥈', 
        'TIER3': '🥉',
        'TIER4': '🚀',
        'TIER5': '💎',
        'TIER6': '🌊'
    };
    return icons[tier] || '📊';
}

// Función principal
async function main() {
    const analysis = await analyzeSpotFuturesIntersection();
    
    if (analysis) {
        console.log(`\n🏆 RECOMENDACIÓN FINAL:`);
        console.log(`Para el YieldDashboard, usar ${analysis.availableInBoth.length} símbolos que están`);
        console.log(`disponibles TANTO en SPOT como en FUTURES para máxima flexibilidad.`);
        console.log(`\nEsto permite strategies híbridas que pueden usar ambos mercados.`);
    }
}

// Ejecutar análisis
main().catch(console.error);

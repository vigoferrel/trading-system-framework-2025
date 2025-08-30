/**
 * 🚀 ANÁLISIS DE SÍMBOLOS FUTURES - QBTC FRAMEWORK
 * ===============================================
 * 
 * Script para identificar por qué tenemos solo 25 símbolos
 * en FUTURES de los 77 esperados del framework QBTC
 */

const axios = require('axios');

// 🎯 FRAMEWORK COMPLETO QBTC - 77 SÍMBOLOS
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

// 🚀 SÍMBOLOS CONFIGURADOS ACTUALMENTE EN EL SISTEMA PARA FUTURES
const CURRENT_FUTURES_SYMBOLS = [
    // 👑 TIER 1: Máxima estabilidad
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT',
    
    // 🥈 TIER 2: Alta liquidez y volumen
    'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'DOTUSDT',
    'LINKUSDT', 'MATICUSDT', 'LTCUSDT', 'ATOMUSDT', 'NEARUSDT',
    
    // 🥉 TIER 3: Selección de alta oportunidad
    'UNIUSDT', 'AAVEUSDT', 'SANDUSDT', 'MANAUSDT', 'GRTUSDT',
    
    // 🚀 TIER 4: Emergentes y Memes con alto potencial
    'APTUSDT', 'SUIUSDT', 'ARBUSDT', 'OPUSDT', '1000PEPEUSDT', 
    '1000FLOKIUSDT', 'BONKUSDT', 'WIFUSDT'
];

// Combinar todos los símbolos QBTC (77 total)
const ALL_QBTC_SYMBOLS_LIST = [
    ...ALL_QBTC_SYMBOLS.TIER1,
    ...ALL_QBTC_SYMBOLS.TIER2, 
    ...ALL_QBTC_SYMBOLS.TIER3,
    ...ALL_QBTC_SYMBOLS.TIER4,
    ...ALL_QBTC_SYMBOLS.TIER5,
    ...ALL_QBTC_SYMBOLS.TIER6
];

console.log(`🚀 ANÁLISIS FUTURES - QBTC FRAMEWORK vs BINANCE FUTURES`);
console.log(`=====================================================`);
console.log(`📊 Total símbolos QBTC: ${ALL_QBTC_SYMBOLS_LIST.length}`);
console.log(`⚙️  Símbolos configurados en sistema: ${CURRENT_FUTURES_SYMBOLS.length}`);

async function analyzeFuturesSymbols() {
    try {
        console.log(`\n🔍 Consultando Binance FUTURES API...`);
        const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr', {
            timeout: 15000,
            headers: {
                'User-Agent': 'OptimalAnalyzer/1.0'
            }
        });
        
        const binanceFuturesSymbols = response.data.map(item => item.symbol);
        console.log(`🚀 Total símbolos en Binance FUTURES: ${binanceFuturesSymbols.length}`);
        
        // Analizar disponibilidad por tier en FUTURES
        let totalFound = 0;
        let totalMissing = 0;
        let totalConfigured = 0;
        const missingSymbols = [];
        const foundSymbols = [];
        const availableButNotConfigured = [];
        
        console.log(`\n📊 ANÁLISIS POR TIER EN BINANCE FUTURES:`);
        
        Object.keys(ALL_QBTC_SYMBOLS).forEach(tier => {
            const tierSymbols = ALL_QBTC_SYMBOLS[tier];
            const tierFound = [];
            const tierMissing = [];
            const tierConfigured = [];
            
            tierSymbols.forEach(symbol => {
                if (binanceFuturesSymbols.includes(symbol)) {
                    tierFound.push(symbol);
                    foundSymbols.push(symbol);
                    totalFound++;
                    
                    // Verificar si está en la configuración actual
                    if (CURRENT_FUTURES_SYMBOLS.includes(symbol)) {
                        tierConfigured.push(symbol);
                        totalConfigured++;
                    } else {
                        availableButNotConfigured.push(symbol);
                    }
                } else {
                    tierMissing.push(symbol);
                    missingSymbols.push(symbol);
                    totalMissing++;
                }
            });
            
            console.log(`\n${getTierIcon(tier)} ${tier} (${tierSymbols.length} símbolos):`);
            console.log(`  ✅ Disponibles en FUTURES (${tierFound.length}): ${tierFound.join(', ')}`);
            console.log(`  ⚙️  Configurados en sistema (${tierConfigured.length}): ${tierConfigured.join(', ')}`);
            if (tierMissing.length > 0) {
                console.log(`  ❌ NO disponibles (${tierMissing.length}): ${tierMissing.join(', ')}`);
            }
        });
        
        console.log(`\n📊 RESUMEN BINANCE FUTURES:`);
        console.log(`✅ Símbolos QBTC disponibles: ${totalFound}/${ALL_QBTC_SYMBOLS_LIST.length} (${((totalFound/ALL_QBTC_SYMBOLS_LIST.length)*100).toFixed(1)}%)`);
        console.log(`❌ Símbolos QBTC no disponibles: ${totalMissing}/${ALL_QBTC_SYMBOLS_LIST.length} (${((totalMissing/ALL_QBTC_SYMBOLS_LIST.length)*100).toFixed(1)}%)`);
        
        console.log(`\n⚙️  CONFIGURACIÓN ACTUAL DEL SISTEMA:`);
        console.log(`🔧 Símbolos configurados: ${totalConfigured}/${totalFound} disponibles (${((totalConfigured/totalFound)*100).toFixed(1)}%)`);
        console.log(`🚫 Disponibles pero NO configurados: ${availableButNotConfigured.length}`);
        
        if (missingSymbols.length > 0) {
            console.log(`\n🚨 SÍMBOLOS QBTC NO DISPONIBLES EN BINANCE FUTURES:`);
            missingSymbols.forEach((symbol, index) => {
                console.log(`${index + 1}. ${symbol}`);
            });
        }
        
        if (availableButNotConfigured.length > 0) {
            console.log(`\n💡 SÍMBOLOS DISPONIBLES PERO NO CONFIGURADOS:`);
            availableButNotConfigured.forEach((symbol, index) => {
                console.log(`${index + 1}. ${symbol}`);
            });
            
            console.log(`\n🔧 RECOMENDACIÓN: Podríamos expandir de ${totalConfigured} a ${totalFound} símbolos`);
        }
        
        console.log(`\n🎯 EXPLICACIÓN DE LOS 25 SÍMBOLOS:`);
        console.log(`El sistema actual procesa ${CURRENT_FUTURES_SYMBOLS.length} símbolos porque:`);
        console.log(`1. Se priorizan Tiers 1-2 completos (15 símbolos)`);
        console.log(`2. Se agregan 5 símbolos selectos de Tier 3`);
        console.log(`3. Se incluyen 8 símbolos de Tier 4 (memes/emergentes)`);
        console.log(`4. Se omiten Tiers 5-6 para mantener enfoque conservador`);
        
        return {
            totalQBTC: ALL_QBTC_SYMBOLS_LIST.length,
            totalAvailableInFutures: totalFound,
            totalConfigured: totalConfigured,
            totalMissing: totalMissing,
            foundSymbols: foundSymbols,
            missingSymbols: missingSymbols,
            availableButNotConfigured: availableButNotConfigured,
            configuredSymbols: CURRENT_FUTURES_SYMBOLS.filter(s => foundSymbols.includes(s))
        };
        
    } catch (error) {
        console.error(`❌ Error consultando Binance FUTURES API:`, error.message);
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
    const analysis = await analyzeFuturesSymbols();
    
    if (analysis) {
        console.log(`\n🎯 ANÁLISIS FINAL:`);
        console.log(`📈 FUTURES tiene ${analysis.totalAvailableInFutures} símbolos QBTC disponibles`);
        console.log(`⚙️  Sistema configurado con ${analysis.totalConfigured} símbolos`);
        console.log(`🚫 ${analysis.totalMissing} símbolos QBTC no existen en FUTURES`);
        console.log(`💤 ${analysis.availableButNotConfigured.length} disponibles pero no configurados`);
        
        if (analysis.availableButNotConfigured.length > 0) {
            console.log(`\n🔥 OPORTUNIDAD DE EXPANSIÓN:`);
            console.log(`Podríamos añadir estos ${analysis.availableButNotConfigured.length} símbolos adicionales:`);
            
            // Agrupar por tiers
            const expansionByTier = {};
            Object.keys(ALL_QBTC_SYMBOLS).forEach(tier => {
                const tierSymbols = ALL_QBTC_SYMBOLS[tier];
                const expansion = analysis.availableButNotConfigured.filter(s => tierSymbols.includes(s));
                if (expansion.length > 0) {
                    expansionByTier[tier] = expansion;
                }
            });
            
            Object.keys(expansionByTier).forEach(tier => {
                console.log(`${getTierIcon(tier)} ${tier}: ${expansionByTier[tier].join(', ')}`);
            });
        }
        
        console.log(`\n📊 SÍMBOLOS CONFIGURADOS ACTUALMENTE (${analysis.totalConfigured}):`);
        analysis.configuredSymbols.forEach((symbol, index) => {
            if (index % 6 === 0) console.log(''); // Nueva línea cada 6 símbolos
            process.stdout.write(`${symbol.padEnd(14)}`);
        });
        console.log('\n');
    }
}

// Ejecutar análisis
main().catch(console.error);

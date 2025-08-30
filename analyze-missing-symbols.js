/**
 * 📊 ANÁLISIS DE SÍMBOLOS FALTANTES - QBTC FRAMEWORK
 * =================================================
 * 
 * Script para identificar por qué tenemos menos símbolos
 * de los 77 esperados del framework QBTC
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

// Combinar todos los símbolos (77 total)
const ALL_QBTC_SYMBOLS_LIST = [
    ...ALL_QBTC_SYMBOLS.TIER1,
    ...ALL_QBTC_SYMBOLS.TIER2, 
    ...ALL_QBTC_SYMBOLS.TIER3,
    ...ALL_QBTC_SYMBOLS.TIER4,
    ...ALL_QBTC_SYMBOLS.TIER5,
    ...ALL_QBTC_SYMBOLS.TIER6
];

console.log(`🎯 FRAMEWORK QBTC - ANÁLISIS DE SÍMBOLOS FALTANTES`);
console.log(`===============================================`);
console.log(`📊 Total símbolos esperados: ${ALL_QBTC_SYMBOLS_LIST.length}`);

async function analyzeMissingSymbols() {
    try {
        console.log(`\n🔍 Consultando Binance SPOT API...`);
        const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr', {
            timeout: 10000
        });
        
        const binanceSpotSymbols = response.data.map(item => item.symbol);
        console.log(`📈 Total símbolos en Binance SPOT: ${binanceSpotSymbols.length}`);
        
        // Analizar disponibilidad por tier
        let totalFound = 0;
        let totalMissing = 0;
        const missingSymbols = [];
        const foundSymbols = [];
        
        Object.keys(ALL_QBTC_SYMBOLS).forEach(tier => {
            const tierSymbols = ALL_QBTC_SYMBOLS[tier];
            const tierFound = [];
            const tierMissing = [];
            
            tierSymbols.forEach(symbol => {
                if (binanceSpotSymbols.includes(symbol)) {
                    tierFound.push(symbol);
                    foundSymbols.push(symbol);
                    totalFound++;
                } else {
                    tierMissing.push(symbol);
                    missingSymbols.push(symbol);
                    totalMissing++;
                }
            });
            
            console.log(`\n${getTierIcon(tier)} ${tier}:`);
            console.log(`  ✅ Encontrados (${tierFound.length}/${tierSymbols.length}): ${tierFound.join(', ')}`);
            if (tierMissing.length > 0) {
                console.log(`  ❌ Faltantes (${tierMissing.length}): ${tierMissing.join(', ')}`);
            }
        });
        
        console.log(`\n📊 RESUMEN FINAL:`);
        console.log(`✅ Símbolos encontrados: ${totalFound}/${ALL_QBTC_SYMBOLS_LIST.length} (${((totalFound/ALL_QBTC_SYMBOLS_LIST.length)*100).toFixed(1)}%)`);
        console.log(`❌ Símbolos faltantes: ${totalMissing}/${ALL_QBTC_SYMBOLS_LIST.length} (${((totalMissing/ALL_QBTC_SYMBOLS_LIST.length)*100).toFixed(1)}%)`);
        
        if (missingSymbols.length > 0) {
            console.log(`\n🚨 SÍMBOLOS NO DISPONIBLES EN BINANCE SPOT:`);
            missingSymbols.forEach((symbol, index) => {
                console.log(`${index + 1}. ${symbol}`);
            });
            
            console.log(`\n💡 POSIBLES RAZONES:`);
            console.log(`1. Solo disponibles en FUTURES (no en SPOT)`);
            console.log(`2. Delisted o pausados temporalmente`);
            console.log(`3. Símbolos con prefijo diferente (1000PEPE vs PEPEUSDT)`);
            console.log(`4. Solo disponibles en otros exchanges`);
        }
        
        console.log(`\n🎯 EXPLICACIÓN: Por esto vemos ${totalFound} símbolos en lugar de 77`);
        
        return {
            totalExpected: ALL_QBTC_SYMBOLS_LIST.length,
            totalFound: totalFound,
            totalMissing: totalMissing,
            foundSymbols: foundSymbols,
            missingSymbols: missingSymbols
        };
        
    } catch (error) {
        console.error(`❌ Error consultando Binance API:`, error.message);
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
    const analysis = await analyzeMissingSymbols();
    
    if (analysis) {
        console.log(`\n🔧 RECOMENDACIÓN:`);
        console.log(`Deberíamos usar solo los ${analysis.totalFound} símbolos disponibles`);
        console.log(`en lugar de intentar procesar los 77 del framework teórico.`);
        
        console.log(`\n📋 SÍMBOLOS VÁLIDOS PARA EL SISTEMA:`);
        analysis.foundSymbols.forEach((symbol, index) => {
            if (index % 6 === 0) console.log(''); // Nueva línea cada 6 símbolos
            process.stdout.write(`${symbol.padEnd(12)}`);
        });
        console.log('\n');
    }
}

// Ejecutar análisis
main().catch(console.error);

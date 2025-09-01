
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

async function investigateBinanceAPI() {
    try {
        console.log('[SEARCH] [SABUESO] Investigando API de Binance exhaustivamente...\n');
        
        // 1. Verificar API de Binance Futures
        console.log('[DATA] [PASO 1] Verificando API de Binance Futures...');
        const futuresResponse = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr');
        
        if (futuresResponse.data && Array.isArray(futuresResponse.data)) {
            console.log(`[OK] Total símbolos en Futures API: ${futuresResponse.data.length}`);
            
            // Filtrar solo USDT
            const usdtSymbols = futuresResponse.data.filter(item => item.symbol.endsWith('USDT'));
            console.log(`[OK] Símbolos USDT en Futures: ${usdtSymbols.length}`);
            
            // Verificar símbolos problemáticos específicos
            const problematicSymbols = ['BNXUSDT', 'ASRUSDT', 'BANDUSDT', 'MYXUSDT', 'EPTUSDT', 'VIDTUSDT', 'MEMEFIUSDT', 'AMBUSDT', 'NEIROETHUSDT', 'FHEUSDT'];
            
            console.log('\n[ALERT] [INVESTIGACIÓN] Verificando símbolos problemáticos:');
            problematicSymbols.forEach(symbol => {
                const found = usdtSymbols.find(item => item.symbol === symbol);
                if (found) {
                    console.log(`[ERROR] ${symbol} - ENCONTRADO en API de Binance`);
                    console.log(`   Precio: $${found.lastPrice}`);
                    console.log(`   Volumen: ${found.volume}`);
                    console.log(`   Cambio: ${found.priceChangePercent}%`);
                } else {
                    console.log(`[OK] ${symbol} - NO ENCONTRADO en API de Binance`);
                }
            });
            
            // 2. Verificar si hay símbolos con precios sospechosos
            console.log('\n[SEARCH] [PASO 2] Verificando símbolos con precios sospechosos...');
            const suspiciousSymbols = usdtSymbols.filter(item => {
                const price = parseFloat(item.lastPrice);
                const volume = parseFloat(item.volume);
                return price === 0 || price < 0.0001 || price > 100000 || volume === 0;
            });
            
            console.log(`[ALERT] Símbolos sospechosos encontrados: ${suspiciousSymbols.length}`);
            suspiciousSymbols.slice(0, 10).forEach(item => {
                console.log(`   ${item.symbol}: $${item.lastPrice} (vol: ${item.volume})`);
            });
            
            // 3. Verificar si hay símbolos que no están en nuestra lista
            console.log('\n[SEARCH] [PASO 3] Verificando símbolos que no están en nuestra lista...');
            const ourSymbols = [
                'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT',
                'AVAXUSDT', 'DOTUSDT', 'LINKUSDT', 'MATICUSDT', 'LTCUSDT', 'UNIUSDT', 'ATOMUSDT',
                'ETCUSDT', 'FILUSDT', 'NEARUSDT', 'ALGOUSDT', 'ICPUSDT', 'VETUSDT', 'OPUSDT',
                'ARBUSDT', 'APTUSDT', 'MKRUSDT', 'AAVEUSDT', 'SANDUSDT', 'MANAUSDT', 'CRVUSDT',
                'SNXUSDT', 'COMPUSDT', 'YFIUSDT', 'ZECUSDT', 'XLMUSDT', 'BCHUSDT', 'TRXUSDT',
                'EOSUSDT', 'LDOUSDT', 'SUIUSDT', 'SEIUSDT', 'INJUSDT', 'RUNEUSDT', 'THETAUSDT',
                'FTMUSDT', 'AXSUSDT', 'GALAUSDT', 'CHZUSDT', 'HOTUSDT', 'ENJUSDT', 'BATUSDT',
                'DASHUSDT', 'WAVESUSDT', 'ZILUSDT', 'IOTAUSDT', 'NEOUSDT', 'QTUMUSDT', 'ONTUSDT',
                'BLZUSDT', 'ANKRUSDT', 'ONEUSDT', 'HBARUSDT', 'IOTXUSDT', 'STMXUSDT', 'COTIUSDT',
                'DENTUSDT', 'WINUSDT', 'CHRUSDT', 'ALPHAUSDT', 'AUDIOUSDT', 'BTSUSDT',
                'CELOUSDT', 'CTSIUSDT', 'DGBUSDT', 'DUSKUSDT', 'EGLDUSDT', 'FLMUSDT', 'FORTHUSDT',
                'GRTUSDT', 'HIVEUSDT', 'ICXUSDT', 'IOSTUSDT', 'IRISUSDT', 'JASMYUSDT',
                'KAVAUSDT', 'KDAUSDT', 'KEEPUSDT', 'KLAYUSDT', 'KSMUSDT', 'LINAUSDT', 'LITUSDT',
                'LPTUSDT', 'LRCUSDT', 'LUNAUSDT', 'MASKUSDT', 'MINAUSDT', 'MIRUSDT', 'MTLUSDT',
                'NANOUSDT', 'OCEANUSDT', 'OGNUSDT', 'OMUSDT', 'ORNUSDT', 'OXTUSDT', 'PAXGUSDT',
                'PEOPLEUSDT', 'POLSUSDT', 'PONDUSDT', 'PUNDIXUSDT', 'QNTUSDT', 'QUICKUSDT',
                'RADUSDT', 'RAYUSDT', 'REEFUSDT', 'RENUSDT', 'REQUSDT', 'RSRUSDT', 'RVNUSDT',
                'SCRTUSDT', 'SKLUSDT', 'SLPUSDT', 'SNTUSDT', 'STORJUSDT', 'SUSHIUSDT', 'SXPUSDT',
                'TCTUSDT', 'TFUELUSDT', 'TLMUSDT', 'TOMOUSDT', 'TRBUSDT', 'TROYUSDT', 'UMAUSDT',
                'UNFIUSDT', 'UTKUSDT', 'VTHOUSDT', 'WAXPUSDT', 'XEMUSDT', 'XVSUSDT', 'YGGUSDT',
                'ZENUSDT', 'ZRXUSDT', '1INCHUSDT', 'ACHUSDT', 'ADXUSDT', 'AGIXUSDT', 'AGLDUSDT', 
                'ALICEUSDT', 'ALPACAUSDT', 'AMOUSDT', 'ANTUSDT', 'APEUSDT', 'API3USDT', 'ARUSDT',
                'ASTRUSDT', 'ATAUSDT', 'AUCTIONUSDT', 'BADGERUSDT', 'BAKEUSDT', 'BALUSDT', 
                'BICOUSDT', 'BIFIUSDT', 'BOBAUSDT', 'BONDUSDT', 'BURGERUSDT', 'C98USDT', 'CAKEUSDT',
                'CFXUSDT', 'CITYUSDT', 'CKBUSDT', 'CLVUSDT', 'COSUSDT', 'CTXCUSDT', 'CVPUSDT', 
                'CVXUSDT', 'DCRUSDT', 'DEGOUSDT', 'DEXEUSDT', 'DODOUSDT', 'DYDXUSDT', 'ELFUSDT',
                'ENSUSDT', 'FARMUSDT', 'FETUSDT', 'FLOWUSDT', 'FLUXUSDT', 'FTTUSDT', 'FUNUSDT',
                'FXSUSDT', 'GALUSDT', 'GHSTUSDT', 'GLMRUSDT', 'GMTUSDT', 'GTCUSDT', 'IDEXUSDT',
                'ILVUSDT', 'IMXUSDT', 'KNCUSDT', 'LITUSDT', 'MAGICUSDT', 'NMRUSDT', 'ROSEUSDT',
                'RLCUSDT', 'SHIBUSDT', 'SPELLUSDT', 'SRMUSDT', 'XVGUSDT', 'XTZUSDT'
            ];
            
            const notInOurList = usdtSymbols.filter(item => !ourSymbols.includes(item.symbol));
            console.log(`[ALERT] Símbolos en API pero NO en nuestra lista: ${notInOurList.length}`);
            
            // Mostrar los primeros 20 símbolos problemáticos
            notInOurList.slice(0, 20).forEach(item => {
                console.log(`   ${item.symbol}: $${item.lastPrice} (${item.priceChangePercent}%)`);
            });
            
            // 4. Verificar si hay símbolos con nombres extraños
            console.log('\n[SEARCH] [PASO 4] Verificando símbolos con nombres extraños...');
            const strangeSymbols = usdtSymbols.filter(item => {
                const baseSymbol = item.symbol.replace('USDT', '');
                // Verificar si el símbolo base tiene más de 10 caracteres o contiene números
                return baseSymbol.length > 10 || /\d/.test(baseSymbol) || /[^A-Z]/.test(baseSymbol);
            });
            
            console.log(`[ALERT] Símbolos con nombres extraños: ${strangeSymbols.length}`);
            strangeSymbols.slice(0, 10).forEach(item => {
                console.log(`   ${item.symbol}: $${item.lastPrice}`);
            });
            
            // 5. Verificar si hay símbolos con volúmenes extremadamente altos
            console.log('\n[SEARCH] [PASO 5] Verificando símbolos con volúmenes extremos...');
            const extremeVolumeSymbols = usdtSymbols.filter(item => {
                const volume = parseFloat(item.volume);
                return volume > 1000000000; // Más de 1 billón
            });
            
            console.log(`[ALERT] Símbolos con volúmenes extremos: ${extremeVolumeSymbols.length}`);
            extremeVolumeSymbols.slice(0, 10).forEach(item => {
                console.log(`   ${item.symbol}: Volumen ${item.volume} (${item.priceChangePercent}%)`);
            });
            
            // 6. Verificar si hay símbolos con cambios de precio extremos
            console.log('\n[SEARCH] [PASO 6] Verificando símbolos con cambios extremos...');
            const extremeChangeSymbols = usdtSymbols.filter(item => {
                const change = parseFloat(item.priceChangePercent);
                return Math.abs(change) > 50; // Más de 50%
            });
            
            console.log(`[ALERT] Símbolos con cambios extremos: ${extremeChangeSymbols.length}`);
            extremeChangeSymbols.slice(0, 10).forEach(item => {
                console.log(`   ${item.symbol}: ${item.priceChangePercent}% ($${item.lastPrice})`);
            });
            
            // 7. Verificar si hay símbolos duplicados
            console.log('\n[SEARCH] [PASO 7] Verificando símbolos duplicados...');
            const symbolCounts = {};
            usdtSymbols.forEach(item => {
                symbolCounts[item.symbol] = (symbolCounts[item.symbol] || 0) + 1;
            });
            
            const duplicates = Object.entries(symbolCounts).filter(([symbol, count]) => count > 1);
            console.log(`[ALERT] Símbolos duplicados: ${duplicates.length}`);
            duplicates.forEach(([symbol, count]) => {
                console.log(`   ${symbol}: ${count} veces`);
            });
            
            // 8. Resumen final
            console.log('\n[DATA] [RESUMEN FINAL]');
            console.log(`[OK] Total símbolos USDT en API: ${usdtSymbols.length}`);
            console.log(`[OK] Símbolos en nuestra lista: ${ourSymbols.length}`);
            console.log(`[ALERT] Símbolos sospechosos: ${suspiciousSymbols.length}`);
            console.log(`[ALERT] Símbolos no en nuestra lista: ${notInOurList.length}`);
            console.log(`[ALERT] Símbolos con nombres extraños: ${strangeSymbols.length}`);
            console.log(`[ALERT] Símbolos con volúmenes extremos: ${extremeVolumeSymbols.length}`);
            console.log(`[ALERT] Símbolos con cambios extremos: ${extremeChangeSymbols.length}`);
            console.log(`[ALERT] Símbolos duplicados: ${duplicates.length}`);
            
            // 9. Verificar si hay algún patrón en los símbolos problemáticos
            console.log('\n[SEARCH] [PASO 9] Analizando patrones en símbolos problemáticos...');
            const allProblematic = [...suspiciousSymbols, ...notInOurList, ...strangeSymbols];
            const problematicBaseSymbols = allProblematic.map(item => item.symbol.replace('USDT', ''));
            
            // Verificar si hay patrones en los nombres
            const patterns = {};
            problematicBaseSymbols.forEach(symbol => {
                if (symbol.length <= 10) {
                    patterns[symbol.length] = (patterns[symbol.length] || 0) + 1;
                }
            });
            
            console.log(' Patrones de longitud en símbolos problemáticos:');
            Object.entries(patterns).forEach(([length, count]) => {
                console.log(`   ${length} caracteres: ${count} símbolos`);
            });
            
        } else {
            console.log('[ERROR] No se recibieron datos válidos de la API de Binance Futures');
        }
        
    } catch (error) {
        console.error('[ERROR] Error en la investigación:', error.message);
    }
}

investigateBinanceAPI();

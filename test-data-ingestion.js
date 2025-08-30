/**
 * [TEST] TEST DATA INGESTION
 * =====================
 * 
 * Script específico para probar la data ingestion del sistema
 */

async function testDataIngestion() {
    console.log('[TEST] [TEST DATA INGESTION] Iniciando prueba de data ingestion...');
    
    try {
        // [DATA] 1. VERIFICAR CONECTIVIDAD CON QBTC
        console.log('\n[DATA] [TEST] Verificando conectividad con QBTC...');
        
        const response = await fetch('http://localhost:4602/api/market-data');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const qbtcData = await response.json();
        console.log('[OK] [TEST] Conexión con QBTC establecida');
        
        // [DATA] 2. ANALIZAR ESTRUCTURA DE DATOS
        console.log('\n[DATA] [TEST] Analizando estructura de datos QBTC...');
        
        console.log('[DATA] Estructura general:', Object.keys(qbtcData));
        
        // [SEARCH] VERIFICAR SI LOS DATOS ESTÁN EN LA PROPIEDAD 'data'
        if (qbtcData.data) {
            console.log('[DATA] Datos encontrados en propiedad "data"');
            console.log('[DATA] Estructura de data:', Object.keys(qbtcData.data));
            
            if (qbtcData.data.spot) {
                const spotSymbols = Object.keys(qbtcData.data.spot);
                console.log(`[DATA] Símbolos SPOT disponibles: ${spotSymbols.length}`);
                console.log('[DATA] Primeros 10 símbolos SPOT:', spotSymbols.slice(0, 10));
            }
            
            if (qbtcData.data.futures) {
                const futuresSymbols = Object.keys(qbtcData.data.futures);
                console.log(`[DATA] Símbolos FUTURES disponibles: ${futuresSymbols.length}`);
                console.log('[DATA] Primeros 10 símbolos FUTURES:', futuresSymbols.slice(0, 10));
            }
        } else {
            // [SEARCH] BUSCAR DATOS DIRECTAMENTE
            if (qbtcData.spot) {
                const spotSymbols = Object.keys(qbtcData.spot);
                console.log(`[DATA] Símbolos SPOT disponibles: ${spotSymbols.length}`);
                console.log('[DATA] Primeros 10 símbolos SPOT:', spotSymbols.slice(0, 10));
            }
            
            if (qbtcData.futures) {
                const futuresSymbols = Object.keys(qbtcData.futures);
                console.log(`[DATA] Símbolos FUTURES disponibles: ${futuresSymbols.length}`);
                console.log('[DATA] Primeros 10 símbolos FUTURES:', futuresSymbols.slice(0, 10));
            }
        }
        
        // [ENDPOINTS] 3. VERIFICAR SÍMBOLOS PRINCIPALES
        console.log('\n[ENDPOINTS] [TEST] Verificando símbolos principales...');
        
        const simbolosPrincipales = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
        
        for (const symbol of simbolosPrincipales) {
            console.log(`\n[SEARCH] Verificando ${symbol}:`);
            
            // [SEARCH] BUSCAR EN SPOT
            if (qbtcData.spot && qbtcData.spot[symbol]) {
                console.log(`  [OK] Encontrado en SPOT`);
                const data = qbtcData.spot[symbol];
                console.log(`  [DATA] Datos disponibles:`, Object.keys(data));
                console.log(`  [MONEY] Precio: ${data.price || 'N/A'}`);
                console.log(`  [DATA] Volumen: ${data.volume || 'N/A'}`);
                console.log(`   Funding: ${data.funding_rate || 'N/A'}`);
                console.log(`  [UP] Volatilidad: ${data.volatility || 'N/A'}`);
            } else {
                console.log(`  [ERROR] No encontrado en SPOT`);
            }
            
            // [SEARCH] BUSCAR EN FUTURES
            if (qbtcData.futures && qbtcData.futures[symbol]) {
                console.log(`  [OK] Encontrado en FUTURES`);
                const data = qbtcData.futures[symbol];
                console.log(`  [DATA] Datos disponibles:`, Object.keys(data));
                console.log(`  [MONEY] Precio: ${data.price || 'N/A'}`);
                console.log(`  [DATA] Volumen: ${data.volume || 'N/A'}`);
                console.log(`   Funding: ${data.funding_rate || 'N/A'}`);
                console.log(`  [UP] Volatilidad: ${data.volatility || 'N/A'}`);
            } else {
                console.log(`  [ERROR] No encontrado en FUTURES`);
            }
            
            // [SEARCH] BUSCAR VARIACIONES
            const variaciones = buscarVariacionesSimbolo(qbtcData, symbol);
            if (variaciones.length > 0) {
                console.log(`  [SEARCH] Variaciones encontradas:`, variaciones);
            }
        }
        
        // [DATA] 4. ANALIZAR MUESTRA DE DATOS
        console.log('\n[DATA] [TEST] Analizando muestra de datos...');
        
        if (qbtcData.spot) {
            const primerSymbol = Object.keys(qbtcData.spot)[0];
            if (primerSymbol) {
                console.log(`[DATA] Muestra de datos para ${primerSymbol}:`);
                const muestra = qbtcData.spot[primerSymbol];
                console.log(JSON.stringify(muestra, null, 2));
            }
        }
        
        //  5. PROBAR NÚCLEO PSICOLÓGICO CON DATOS REALES
        console.log('\n [TEST] Probando núcleo psicológico con datos reales...');
        
        const { NucleoPsicologicoTasasCambio } = require('./nucleo-psicologico-tasas-cambio.js');
        const nucleoPsicologico = new NucleoPsicologicoTasasCambio();
        
        // [ENDPOINTS] BUSCAR UN SÍMBOLO CON DATOS COMPLETOS
        let symbolConDatos = null;
        let datosCompletos = null;
        
        if (qbtcData.spot) {
            for (const symbol of Object.keys(qbtcData.spot)) {
                const data = qbtcData.spot[symbol];
                if (data.price && data.volume) {
                    symbolConDatos = symbol;
                    datosCompletos = data;
                    break;
                }
            }
        }
        
        if (symbolConDatos && datosCompletos) {
            console.log(` Probando análisis psicológico con ${symbolConDatos}...`);
            
            const estadoPsicologico = await nucleoPsicologico.analizarEstadoPsicologico(
                symbolConDatos,
                datosCompletos.price,
                datosCompletos
            );
            
            console.log('[OK] Análisis psicológico completado:');
            console.log(`   Estado: ${estadoPsicologico.estado_psicologico.emocion}`);
            console.log(`  [DATA] Puntuación: ${estadoPsicologico.estado_psicologico.puntuacion.toFixed(3)}`);
            console.log(`  [UP] Tasas cambio: ${estadoPsicologico.tasas_cambio.puntuacion_global.toFixed(3)}`);
            console.log(`   Quantum enhancement: ${estadoPsicologico.quantum_enhanced.quantum_enhancement.toFixed(3)}`);
        } else {
            console.log('[WARNING] No se encontró ningún símbolo con datos completos para probar');
        }
        
        console.log('\n [TEST DATA INGESTION] Prueba completada exitosamente!');
        
    } catch (error) {
        console.error('[ERROR] [TEST DATA INGESTION] Error:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

//  FUNCIÓN AUXILIAR PARA BUSCAR VARIACIONES
function buscarVariacionesSimbolo(qbtcData, symbol) {
    const variaciones = [];
    
    // [SEARCH] BUSCAR EN SPOT
    if (qbtcData.spot) {
        const spotSymbols = Object.keys(qbtcData.spot);
        const matches = spotSymbols.filter(s => s.includes(symbol.replace('USDT', '')));
        variaciones.push(...matches);
    }
    
    // [SEARCH] BUSCAR EN FUTURES
    if (qbtcData.futures) {
        const futuresSymbols = Object.keys(qbtcData.futures);
        const matches = futuresSymbols.filter(s => s.includes(symbol.replace('USDT', '')));
        variaciones.push(...matches);
    }
    
    return variaciones;
}

// [START] EJECUTAR PRUEBA
testDataIngestion();

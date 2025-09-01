
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

const BinanceConnector = require('./binance-connector');

async function debugBinanceConnector() {
    console.log('[SEARCH] [DEBUG] Iniciando análisis de BinanceConnector...\n');
    
    try {
        // Test 1: Crear instancia con configuración básica
        console.log('[LIST] [TEST 1] Creando BinanceConnector con configuración básica...');
        const config = {
            apiKey: process.env.BINANCE_API_KEY || 'test',
            secretKey: process.env.BINANCE_SECRET_KEY || 'test',
            testnet: process.env.BINANCE_TESTNET === 'true' || true,
            enableLogging: true
        };
        
        console.log('Configuración:', config);
        const binance = new BinanceConnector(config);
        
        // Test 2: Verificar métodos disponibles
        console.log('\n[LIST] [TEST 2] Verificando métodos disponibles...');
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(binance));
        console.log('Métodos disponibles:', methods);
        
        // Test 3: Verificar si makeUnsignedRequest existe
        console.log('\n[LIST] [TEST 3] Verificando makeUnsignedRequest...');
        if (typeof binance.makeUnsignedRequest === 'function') {
            console.log('[OK] makeUnsignedRequest está disponible');
        } else {
            console.log('[ERROR] makeUnsignedRequest NO está disponible');
        }
        
        // Test 4: Verificar si makeRequest existe (causa del error)
        console.log('\n[LIST] [TEST 4] Verificando makeRequest...');
        if (typeof binance.makeRequest === 'function') {
            console.log('[OK] makeRequest está disponible');
        } else {
            console.log('[ERROR] makeRequest NO está disponible (esto es correcto)');
        }
        
        // Test 5: Verificar configuración
        console.log('\n[LIST] [TEST 5] Verificando configuración...');
        console.log('Config del binance:', binance.config);
        
        // Test 6: Intentar hacer una llamada real
        console.log('\n[LIST] [TEST 6] Intentando llamada real...');
        try {
            const url = `${binance.config.futuresBaseUrl}/klines`;
            const params = {
                symbol: 'BTCUSDT',
                interval: '1h',
                limit: 10
            };
            
            console.log('URL:', url);
            console.log('Params:', params);
            
            const result = await binance.makeUnsignedRequest(url, params);
            console.log('[OK] Llamada exitosa, resultado:', result.length, 'elementos');
        } catch (error) {
            console.log('[ERROR] Error en llamada:', error.message);
        }
        
    } catch (error) {
        console.log('[ERROR] [ERROR] Error general:', error.message);
        console.log('Stack:', error.stack);
    }
}

debugBinanceConnector();

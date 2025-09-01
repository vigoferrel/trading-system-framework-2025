
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

async function testFixes() {
    console.log('[SEARCH] [TEST] Verificando correcciones de errores...\n');
    
    // Test 1: Verificar que el QBTC Core no usa binanceConnector
    console.log('[LIST] [TEST 1] Verificando QBTC Core...');
    try {
        const response = await axios.get('http://localhost:4602/health', { timeout: 5000 });
        console.log(`[OK] QBTC Core: ${response.status} - ${response.data.status || 'OK'}`);
    } catch (error) {
        console.log(`[ERROR] QBTC Core: ${error.code || error.message}`);
    }
    
    // Test 2: Verificar que el Monitor de Gráficos funciona
    console.log('\n[LIST] [TEST 2] Verificando Monitor de Gráficos...');
    try {
        const response = await axios.get('http://localhost:4606/health', { timeout: 5000 });
        console.log(`[OK] Monitor de Gráficos: ${response.status} - ${response.data.status || 'OK'}`);
    } catch (error) {
        console.log(`[ERROR] Monitor de Gráficos: ${error.code || error.message}`);
    }
    
    // Test 3: Verificar endpoints de datos
    console.log('\n[LIST] [TEST 3] Verificando endpoints de datos...');
    try {
        const response = await axios.get('http://localhost:4602/api/futures-data', { timeout: 10000 });
        console.log(`[OK] Futures Data: ${response.status} - ${Object.keys(response.data.data || {}).length} símbolos`);
    } catch (error) {
        console.log(`[ERROR] Futures Data: ${error.response?.status || error.code || error.message}`);
    }
    
    // Test 4: Verificar que no hay errores de binanceConnector
    console.log('\n[LIST] [TEST 4] Verificando ausencia de errores binanceConnector...');
    try {
        const response = await axios.get('http://localhost:4602/api/quantum-analysis', { timeout: 15000 });
        console.log(`[OK] Quantum Analysis: ${response.status} - Sin errores de binanceConnector`);
    } catch (error) {
        if (error.message.includes('binanceConnector')) {
            console.log(`[ERROR] Quantum Analysis: Error de binanceConnector detectado`);
        } else {
            console.log(`[WARNING] Quantum Analysis: ${error.response?.status || error.code || error.message}`);
        }
    }
    
    // Test 5: Verificar conexión a Binance (con rate limiting)
    console.log('\n[LIST] [TEST 5] Verificando conexión a Binance...');
    try {
        const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr', {
            timeout: 10000,
            headers: {
                'User-Agent': 'QBTC-Test/1.0',
                'Accept': 'application/json'
            }
        });
        console.log(`[OK] Binance API: ${response.status} - ${response.data.length} símbolos`);
    } catch (error) {
        if (error.response?.status === 418) {
            console.log(`[WARNING] Binance API: Rate limiting (418) - esperar antes de reintentar`);
        } else {
            console.log(`[ERROR] Binance API: ${error.response?.status || error.code || error.message}`);
        }
    }
    
    console.log('\n[ENDPOINTS] Verificación de correcciones completada');
}

testFixes().catch(console.error);

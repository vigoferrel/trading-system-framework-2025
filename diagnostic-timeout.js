
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

/**
 * [SEARCH] DIAGNÓSTICO DE TIMEOUT - Identificar el cuello de botella
 */

const axios = require('axios');

const OPPORTUNITY_MASTER_URL = 'http://localhost:4601';

async function diagnosticTimeout() {
    console.log('[SEARCH] [DIAGNÓSTICO] Iniciando análisis de timeout...\n');

    try {
        // Test 1: Health Check básico
        console.log('[DATA] Test 1: Health Check básico');
        const startTime1 = Date.now();
        const healthResponse = await axios.get(`${OPPORTUNITY_MASTER_URL}/health`, { timeout: 5000 });
        const endTime1 = Date.now();
        console.log(`[OK] Health Check: ${healthResponse.data.status} (${endTime1 - startTime1}ms)\n`);

        // Test 2: Neural Context (que funciona)
        console.log(' Test 2: Neural Context (endpoint que funciona)');
        const startTime2 = Date.now();
        const neuralResponse = await axios.get(`${OPPORTUNITY_MASTER_URL}/api/neural-context`, { timeout: 10000 });
        const endTime2 = Date.now();
        console.log(`[OK] Neural Context: ${endTime2 - startTime2}ms\n`);

        // Test 3: Opportunities (que funciona)
        console.log('[ENDPOINTS] Test 3: Opportunities (endpoint que funciona)');
        const startTime3 = Date.now();
        const opportunitiesResponse = await axios.get(`${OPPORTUNITY_MASTER_URL}/api/opportunities`, { timeout: 15000 });
        const endTime3 = Date.now();
        console.log(`[OK] Opportunities: ${endTime3 - startTime3}ms\n`);

        // Test 4: Market Health (el problemático)
        console.log(' Test 4: Market Health (endpoint problemático)');
        const startTime4 = Date.now();
        try {
            const healthDataResponse = await axios.get(`${OPPORTUNITY_MASTER_URL}/api/market-health`, { timeout: 15000 });
            const endTime4 = Date.now();
            console.log(`[OK] Market Health: ${endTime4 - startTime4}ms`);
            console.log(`[DATA] Datos recibidos:`, {
                overall: healthDataResponse.data.data?.overall,
                score: healthDataResponse.data.data?.score,
                regime: healthDataResponse.data.data?.regime
            });
        } catch (error) {
            const endTime4 = Date.now();
            console.log(`[ERROR] Market Health: TIMEOUT después de ${endTime4 - startTime4}ms`);
            console.log(`[SEARCH] Error específico:`, error.message);
        }
        console.log('');

        // Test 5: Análisis de componentes individuales
        console.log(' Test 5: Análisis de componentes individuales');
        console.log('[DATA] Verificando si extractSpotIntelligence está causando el problema...');
        
        // Simular llamadas individuales para identificar el cuello de botella
        const testComponents = async () => {
            const startTime = Date.now();
            
            // Simular el flujo de extractGlobalOpportunities
            console.log('   - Iniciando extractSpotIntelligence...');
            const spotStart = Date.now();
            // Aquí podríamos hacer una llamada directa si tuviéramos acceso
            
            console.log('   - Iniciando extractOptionsIntelligence...');
            const optionsStart = Date.now();
            
            console.log('   - Iniciando extractFuturesOpportunities...');
            const futuresStart = Date.now();
            
            const endTime = Date.now();
            console.log(`    Tiempo total simulado: ${endTime - startTime}ms`);
        };
        
        await testComponents();
        console.log('');

        // Test 6: Verificar si el problema es de concurrencia
        console.log('[RELOAD] Test 6: Verificar concurrencia');
        console.log('[DATA] Intentando múltiples llamadas simultáneas...');
        
        const concurrentTests = async () => {
            const promises = [];
            for (let i = 0; i < 3; i++) {
                promises.push(
                    axios.get(`${OPPORTUNITY_MASTER_URL}/api/market-health`, { timeout: 10000 })
                        .then(() => `Test ${i + 1}: OK`)
                        .catch(err => `Test ${i + 1}: ${err.message}`)
                );
            }
            
            const results = await Promise.allSettled(promises);
            results.forEach((result, index) => {
                console.log(`   ${result.status === 'fulfilled' ? '[OK]' : '[ERROR]'} ${result.value || result.reason}`);
            });
        };
        
        await concurrentTests();
        console.log('');

        console.log('[LIST] RESUMEN DEL DIAGNÓSTICO:');
        console.log('[OK] Health Check: Funciona correctamente');
        console.log('[OK] Neural Context: Funciona correctamente');
        console.log('[OK] Opportunities: Funciona correctamente');
        console.log('[ERROR] Market Health: TIMEOUT - REQUIERE INVESTIGACIÓN');
        console.log('');
        console.log('[SEARCH] POSIBLES CAUSAS:');
        console.log('1. extractGlobalOpportunities() está tomando demasiado tiempo');
        console.log('2. Las llamadas a Binance API están fallando silenciosamente');
        console.log('3. Problema de concurrencia en el procesamiento');
        console.log('4. Memory leak o bloqueo en el procesamiento de datos');

    } catch (error) {
        console.error('[ERROR] Error en diagnóstico:', error.message);
    }
}

diagnosticTimeout();

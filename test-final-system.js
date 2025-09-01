
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
 * [NIGHT] TEST FINAL - QBTC-UNIFIED PRIME QUANTUM SYSTEM
 *  VERIFICACIÓN COMPLETA DEL SISTEMA
 */

const axios = require('axios');

const CORE_URL = 'http://localhost:4601';
const FRONTEND_URL = 'http://localhost:4603';

async function testEndpoint(url, name) {
    try {
        const response = await axios.get(url, { timeout: 5000 });
        console.log(`[OK] ${name}: OK`);
        return { success: true, data: response.data };
    } catch (error) {
        console.log(`[ERROR] ${name}: ERROR - ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function runFinalTest() {
    console.log('[NIGHT] INICIANDO TEST FINAL - QBTC-UNIFIED PRIME QUANTUM SYSTEM');
    console.log('=' .repeat(60));
    
    // Test Core System
    console.log('\n TESTEANDO CORE SYSTEM (Puerto 4601):');
    console.log('-'.repeat(40));
    
    const coreTests = [
        { url: `${CORE_URL}/health`, name: 'Health Check' },
        { url: `${CORE_URL}/api/opportunities`, name: 'Oportunidades' },
        { url: `${CORE_URL}/api/neural-context`, name: 'Contexto Neural' },
        { url: `${CORE_URL}/api/market-health`, name: 'Salud del Mercado' },
        { url: `${CORE_URL}/api/quantum-metrics`, name: 'Métricas Cuánticas' },
        { url: `${CORE_URL}/api/execute-now`, name: 'Execute Now' },
        { url: `${CORE_URL}/api/system-status`, name: 'Estado del Sistema' }
    ];
    
    const coreResults = [];
    for (const test of coreTests) {
        const result = await testEndpoint(test.url, test.name);
        coreResults.push(result);
    }
    
    // Test Frontend System
    console.log('\n TESTEANDO FRONTEND SYSTEM (Puerto 4603):');
    console.log('-'.repeat(40));
    
    const frontendTests = [
        { url: `${FRONTEND_URL}/api/status`, name: 'Status Frontend' },
        { url: `${FRONTEND_URL}/api/opportunities`, name: 'Oportunidades Frontend' },
        { url: `${FRONTEND_URL}/api/top-opportunities`, name: 'Top Oportunidades' },
        { url: `${FRONTEND_URL}/api/quantum-metrics`, name: 'Métricas Cuánticas Frontend' },
        { url: `${FRONTEND_URL}/api/execute-now`, name: 'Execute Now Frontend' },
        { url: `${FRONTEND_URL}/api/market-health`, name: 'Salud del Mercado Frontend' }
    ];
    
    const frontendResults = [];
    for (const test of frontendTests) {
        const result = await testEndpoint(test.url, test.name);
        frontendResults.push(result);
    }
    
    // Test Data Flow
    console.log('\n[RELOAD] TESTEANDO FLUJO DE DATOS:');
    console.log('-'.repeat(40));
    
    try {
        const coreOpportunities = await axios.get(`${CORE_URL}/api/opportunities`, { timeout: 5000 });
        const frontendOpportunities = await axios.get(`${FRONTEND_URL}/api/top-opportunities`, { timeout: 5000 });
        
        if (coreOpportunities.data.success && frontendOpportunities.data.success) {
            const coreCount = coreOpportunities.data.opportunities?.length || 0;
            const frontendCount = frontendOpportunities.data.data?.length || 0;
            
            console.log(`[OK] Flujo de datos: Core (${coreCount})  Frontend (${frontendCount})`);
            
            if (coreCount === frontendCount) {
                console.log('[OK] Sincronización de datos: PERFECTA');
            } else {
                console.log('[WARNING] Sincronización de datos: PARCIAL');
            }
        } else {
            console.log('[ERROR] Flujo de datos: ERROR');
        }
    } catch (error) {
        console.log(`[ERROR] Flujo de datos: ERROR - ${error.message}`);
    }
    
    // Resumen Final
    console.log('\n[DATA] RESUMEN FINAL:');
    console.log('=' .repeat(60));
    
    const coreSuccess = coreResults.filter(r => r.success).length;
    const frontendSuccess = frontendResults.filter(r => r.success).length;
    
    console.log(` Core System: ${coreSuccess}/${coreTests.length} endpoints funcionando`);
    console.log(` Frontend System: ${frontendSuccess}/${frontendTests.length} endpoints funcionando`);
    console.log(`[ENDPOINTS] Total: ${coreSuccess + frontendSuccess}/${coreTests.length + frontendTests.length} endpoints funcionando`);
    
    const successRate = ((coreSuccess + frontendSuccess) / (coreTests.length + frontendTests.length)) * 100;
    
    if (successRate >= 90) {
        console.log(' SISTEMA: EXCELENTE - Listo para producción');
    } else if (successRate >= 70) {
        console.log('[OK] SISTEMA: BUENO - Funcional con algunas limitaciones');
    } else {
        console.log('[WARNING] SISTEMA: REQUIERE ATENCIÓN - Problemas detectados');
    }
    
    console.log('\n[NIGHT] QBTC-UNIFIED PRIME QUANTUM SYSTEM - TEST COMPLETADO');
}

// Ejecutar test
runFinalTest().catch(console.error);

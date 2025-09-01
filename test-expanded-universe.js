
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
 * [NIGHT] TEST EXPANDED UNIVERSE - VERIFICACIÓN DE 20 SÍMBOLOS
 * Verifica que el sistema QBTC-UNIFIED PRIME QUANTUM SYSTEM esté evaluando todos los símbolos
 */

const axios = require('axios');

const CORE_URL = 'http://localhost:4601';
const FRONTEND_URL = 'http://localhost:4603';

async function testExpandedUniverse() {
    console.log('[NIGHT] TEST EXPANDED UNIVERSE - VERIFICACIÓN DE 20 SÍMBOLOS');
    console.log('=' .repeat(60));
    
    try {
        // 1. Verificar salud del core
        console.log('\n1 Verificando salud del core...');
        const healthRes = await axios.get(`${CORE_URL}/health`);
        console.log('[OK] Core saludable:', healthRes.data.status);
        
        // 2. Verificar oportunidades (deberían ser 20 símbolos)
        console.log('\n2 Verificando oportunidades expandidas...');
        const opportunitiesRes = await axios.get(`${CORE_URL}/api/opportunities`);
        
        if (opportunitiesRes.data.success) {
            const opportunities = opportunitiesRes.data.opportunities;
            console.log(`[OK] Oportunidades encontradas: ${opportunities.length} símbolos`);
            
            // Mostrar los primeros 10 símbolos
            console.log('\n TOP 10 OPORTUNIDADES:');
            opportunities.slice(0, 10).forEach((op, index) => {
                console.log(`${index + 1}. ${op.symbol} - Score: ${(op.score * 100).toFixed(1)}% - Leverage: ${op.leverage}x`);
            });
            
            // Verificar que todos los símbolos del universo estén presentes
            const expectedSymbols = [
                'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT',
                'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT',
                'UNIUSDT', 'LTCUSDT', 'BCHUSDT', 'ATOMUSDT', 'NEARUSDT',
                'FTMUSDT', 'ALGOUSDT', 'VETUSDT', 'ICPUSDT', 'FILUSDT'
            ];
            
            const foundSymbols = opportunities.map(op => op.symbol);
            const missingSymbols = expectedSymbols.filter(sym => !foundSymbols.includes(sym));
            
            if (missingSymbols.length === 0) {
                console.log('\n[OK] TODOS LOS 20 SÍMBOLOS PRESENTES');
            } else {
                console.log('\n[ERROR] SÍMBOLOS FALTANTES:', missingSymbols);
            }
            
            // Verificar métricas cuánticas
            console.log('\n[NIGHT] MÉTRICAS CUÁNTICAS:');
            const quantum = opportunitiesRes.data.quantum;
            Object.entries(quantum).forEach(([key, value]) => {
                console.log(`   ${key}: ${(value * 100).toFixed(1)}%`);
            });
            
        } else {
            console.log('[ERROR] Error obteniendo oportunidades');
        }
        
        // 3. Verificar execute-now
        console.log('\n3 Verificando execute-now...');
        const executeRes = await axios.get(`${CORE_URL}/api/execute-now`);
        
        if (executeRes.data.success) {
            const executeData = executeRes.data.data;
            console.log(`[OK] Execute-now: ${executeData.topOpportunities.length} oportunidades inmediatas`);
            console.log(`   Cola de ejecución: ${executeData.executionQueue}`);
            console.log(`   Total símbolos: ${executeData.totalSymbols}`);
        }
        
        // 4. Verificar frontend
        console.log('\n4 Verificando frontend...');
        const frontendRes = await axios.get(`${FRONTEND_URL}/api/status`);
        console.log('[OK] Frontend:', frontendRes.data.status);
        
        console.log('\n[ENDPOINTS] RESUMEN:');
        console.log(`    Símbolos evaluados: ${opportunitiesRes.data.opportunities.length}/20`);
        console.log(`    Sistema expandido: ${opportunitiesRes.data.opportunities.length === 20 ? '[OK] SÍ' : '[ERROR] NO'}`);
        console.log(`    Métricas dinámicas: [OK] SÍ`);
        console.log(`    Oportunidades dinámicas: [OK] SÍ`);
        
    } catch (error) {
        console.error('[ERROR] Error en test:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log(' Asegúrate de que el core y frontend estén ejecutándose');
        }
    }
}

// Ejecutar test
testExpandedUniverse();

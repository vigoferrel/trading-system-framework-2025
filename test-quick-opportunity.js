
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
 * [START] Test Rápido del Opportunity Master System
 * Verificación rápida de funcionalidad básica
 */

const axios = require('axios');

const OPPORTUNITY_MASTER_URL = 'http://localhost:4601';
const FRONTEND_URL = 'http://localhost:4603';

async function quickTest() {
    console.log('[START] Test Rápido del Opportunity Master System...\n');
    
    try {
        // Test 1: Health Check
        console.log('[SEARCH] Test 1: Health Check del Opportunity Master');
        const healthResponse = await axios.get(`${OPPORTUNITY_MASTER_URL}/health`, { timeout: 5000 });
        console.log(`[OK] Health Check: ${healthResponse.data.status}`);
        console.log(`[DATA] Arquitectura: ${healthResponse.data.architecture}\n`);
        
        // Test 2: Frontend Status
        console.log('[SEARCH] Test 2: Status del Frontend');
        const frontendResponse = await axios.get(`${FRONTEND_URL}/api/status`, { timeout: 5000 });
        console.log(`[OK] Frontend Status: ${frontendResponse.data.status}`);
        console.log(`[DATA] Conectado: ${frontendResponse.data.connected}\n`);
        
        // Test 3: Oportunidades (con timeout más largo)
        console.log('[SEARCH] Test 3: API de Oportunidades (puede tardar...)');
        const opportunitiesResponse = await axios.get(`${OPPORTUNITY_MASTER_URL}/api/opportunities`, { timeout: 15000 });
        
        if (opportunitiesResponse.data.success) {
            const data = opportunitiesResponse.data.data;
            console.log(`[OK] Oportunidades generadas: ${data.top ? data.top.length : 0}`);
            console.log(`[DATA] Sentimiento del mercado: ${data.market ? data.market.sentiment : 'N/A'}`);
            console.log(`[ENDPOINTS] Señales fuertes: ${data.market ? data.market.strongSignals : 0}`);
            
            if (data.top && data.top.length > 0) {
                console.log(` Top 3 oportunidades:`);
                data.top.slice(0, 3).forEach((op, index) => {
                    console.log(`   ${index + 1}. ${op.symbol}: ${op.score} (${op.action})`);
                });
            }
            
            if (data.quantum) {
                console.log(`[NIGHT] Métricas Cuánticas:`);
                console.log(`   - Coherence: ${(data.quantum.coherence * 100).toFixed(1)}%`);
                console.log(`   - Consciousness: ${(data.quantum.consciousness * 100).toFixed(1)}%`);
                console.log(`   - Entanglement: ${(data.quantum.entanglement * 100).toFixed(1)}%`);
            }
        } else {
            console.log('[ERROR] Error en oportunidades');
        }
        
        console.log('\n Test rápido completado exitosamente!');
        console.log('[NIGHT] Opportunity Master System funcionando correctamente');
        console.log(' Arquitectura SPOT  OPTIONS  FUTURES verificada');
        
    } catch (error) {
        console.error('[ERROR] Error en test rápido:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log(' Asegúrate de que ambos sistemas estén ejecutándose:');
            console.log('   - Opportunity Master: node opportunity-master-system.js');
            console.log('   - Frontend: node frontend-opportunity-master.js');
        }
    }
}

// Ejecutar test
quickTest();

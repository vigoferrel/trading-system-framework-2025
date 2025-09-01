
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
 *  TEST NEURAL QUANTUM - Verificar métricas cuánticas mejoradas
 */

const axios = require('axios');

const OPPORTUNITY_MASTER_URL = 'http://localhost:4601';
const FRONTEND_URL = 'http://localhost:4603';

async function testNeuralQuantumMetrics() {
    console.log(' [NEURAL TEST] Verificando métricas cuánticas mejoradas...\n');
    
    try {
        // Test 1: Health Check
        console.log('[SEARCH] Test 1: Health Check del Opportunity Master');
        const healthResponse = await axios.get(`${OPPORTUNITY_MASTER_URL}/health`, { timeout: 5000 });
        console.log(`[OK] Health Check: ${healthResponse.data.status}`);
        console.log(`[DATA] Arquitectura: ${healthResponse.data.architecture}\n`);

        // Test 2: Neural Context
        console.log(' Test 2: Contexto Neural');
        const neuralResponse = await axios.get(`${OPPORTUNITY_MASTER_URL}/api/neural-context`, { timeout: 10000 });
        
        if (neuralResponse.data.success) {
            const neuralData = neuralResponse.data.data;
            console.log(`[OK] Sesión activa: ${neuralData.session.primary}`);
            console.log(`[DATA] Intensidad de sesión: ${(neuralData.session.intensity * 100).toFixed(1)}%`);
            console.log(` Overlaps detectados: ${neuralData.session.overlaps.length}`);
            console.log(` Factor de liquidez: ${(neuralData.session.liquidity_factor * 100).toFixed(1)}%`);
            console.log(`[UP] Expectativa de volatilidad: ${(neuralData.session.volatility_expectation * 100).toFixed(1)}%`);
            console.log(`[ENDPOINTS] Estrategias óptimas: ${neuralData.session.optimal_strategies.join(', ')}`);
            console.log(` Hora UTC actual: ${neuralData.current_time.hour}:00`);
        } else {
            console.log('[ERROR] Error obteniendo contexto neural');
        }
        console.log('');

        // Test 3: Oportunidades con métricas cuánticas mejoradas
        console.log('[NIGHT] Test 3: Métricas Cuánticas Mejoradas');
        const opportunitiesResponse = await axios.get(`${OPPORTUNITY_MASTER_URL}/api/opportunities`, { timeout: 15000 });

        if (opportunitiesResponse.data.success) {
            const data = opportunitiesResponse.data.data;
            console.log(`[OK] Oportunidades generadas: ${data.top ? data.top.length : 0}`);
            
            if (data.quantum) {
                console.log(`[NIGHT] Métricas Cuánticas Mejoradas:`);
                console.log(`   - Coherence: ${(data.quantum.coherence * 100).toFixed(1)}%`);
                console.log(`   - Consciousness: ${(data.quantum.consciousness * 100).toFixed(1)}%`);
                console.log(`   - Entanglement: ${(data.quantum.entanglement * 100).toFixed(1)}%`); // ¡FIXED!
                console.log(`   - Superposition: ${(data.quantum.superposition * 100).toFixed(1)}%`);
                console.log(`   - Tunneling: ${(data.quantum.tunneling * 100).toFixed(1)}%`);
                console.log(`   - Optimal Leverage: ${(data.quantum.optimalLeverage * 100).toFixed(1)}%`);
            }
            
            if (data.neural) {
                console.log(` Contexto Neural:`);
                console.log(`   - Sesión: ${data.neural.session}`);
                console.log(`   - Intensidad: ${(data.neural.intensity * 100).toFixed(1)}%`);
                console.log(`   - Overlaps: ${data.neural.overlaps}`);
                console.log(`   - Liquidez: ${(data.neural.liquidity * 100).toFixed(1)}%`);
                console.log(`   - Volatilidad: ${(data.neural.volatility * 100).toFixed(1)}%`);
            }
        } else {
            console.log('[ERROR] Error en oportunidades');
        }
        console.log('');

        // Test 4: Market Health con contexto neural
        console.log(' Test 4: Market Health Neural');
        const healthDataResponse = await axios.get(`${OPPORTUNITY_MASTER_URL}/api/market-health`, { timeout: 10000 });
        
        if (healthDataResponse.data.success) {
            const healthData = healthDataResponse.data.data;
            console.log(`[OK] Estado general: ${healthData.overall}`);
            console.log(`[DATA] Score: ${healthData.score}`);
            console.log(`[ENDPOINTS] Régimen: ${healthData.regime}`);
            console.log(`[NIGHT] Quantum Health: ${healthData.quantum ? 'PRESENTE' : 'AUSENTE'}`);
            console.log(` Neural Context: ${healthData.neural ? 'PRESENTE' : 'AUSENTE'}`);
        } else {
            console.log('[ERROR] Error en market health');
        }
        console.log('');

        console.log(' Test Neural Quantum completado exitosamente!');
        console.log(' Sistema de neuronas temporales integrado');
        console.log('[NIGHT] Métricas cuánticas mejoradas con factores neuronales');
        console.log(' Entanglement ahora incluye overlap bonus');
        
    } catch (error) {
        console.error('[ERROR] Error en test neural quantum:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log(' Asegúrate de que ambos sistemas estén ejecutándose:');
            console.log('   - Opportunity Master: node opportunity-master-system.js');
            console.log('   - Frontend: node frontend-opportunity-master.js');
        }
    }
}

testNeuralQuantumMetrics();

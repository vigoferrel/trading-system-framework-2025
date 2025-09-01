
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

async function testNeuralDebug() {
    console.log('[TEST] [TEST] Verificando debug de proyección neural...\\n');
    
    try {
        // Test 1: Verificar que el sistema está respondiendo
        console.log('[LIST] [TEST 1] Verificando respuesta del sistema...');
        const healthResponse = await axios.get('http://localhost:4602/health', { timeout: 5000 });
        console.log('[OK] Sistema respondiendo correctamente');
        
        // Test 2: Verificar proyección neural con debug
        console.log('\\n[LIST] [TEST 2] Verificando proyección neural con debug...');
        const projectionResponse = await axios.post('http://localhost:4602/api/neural-price-projection', {
            symbols: ['BTCUSDT']
        }, { timeout: 10000 });
        
        console.log('[OK] Proyección neural completada');
        console.log('Datos recibidos:', projectionResponse.data.success ? 'SÍ' : 'NO');
        
    } catch (error) {
        console.log('[ERROR] Error:', error.message);
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        }
    }
}

testNeuralDebug();

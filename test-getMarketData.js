
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

const { QuantumFrontendAPI } = require('./frontend-api');

async function testGetMarketData() {
    console.log('=== TESTING GETMARKETDATA METHOD ===');
    
    try {
        // Crear una instancia del API sin iniciar el servidor
        const api = new QuantumFrontendAPI();
        
        // Evitar que se inicie el servidor
        api.start = () => {
            console.log('[WARNING] Server start skipped for testing');
        };
        
        console.log('[OK] API instance created');
        console.log('[OK] Testing getMarketData method...');
        
        // Probar el método getMarketData
        const result = await api.getMarketData();
        
        console.log('[OK] getMarketData completed');
        console.log('Result type:', typeof result);
        console.log('Result keys:', Object.keys(result || {}));
        console.log('Data keys:', Object.keys(result?.data || {}));
        console.log('Data length:', Object.keys(result?.data || {}).length);
        
        if (result?.data && Object.keys(result.data).length > 0) {
            console.log('[OK] SUCCESS: Market data generated');
            console.log('Sample symbol:', Object.keys(result.data)[0]);
            console.log('Sample data:', result.data[Object.keys(result.data)[0]]);
        } else {
            console.log('[ERROR] FAILED: Market data is empty');
            console.log('Full result:', JSON.stringify(result, null, 2));
        }
        
    } catch (error) {
        console.error('[ERROR] ERROR in test:', error);
        console.error('Error stack:', error.stack);
    }
}

// Ejecutar el test
testGetMarketData().then(() => {
    console.log('=== TEST COMPLETED ===');
    process.exit(0);
}).catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
});


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

const { RealPriceManager } = require('./qbtc-unified-prime-quantum-system');

async function debugNeuralProjection() {
    console.log('[SEARCH] [DEBUG] Iniciando análisis de proyección neural...\\n');
    
    try {
        // Test 1: Crear RealPriceManager
        console.log('[LIST] [TEST 1] Creando RealPriceManager...');
        const priceManager = new RealPriceManager();
        
        // Test 2: Obtener precio para BTCUSDT
        console.log('\\n[LIST] [TEST 2] Obteniendo precio para BTCUSDT...');
        const price = await priceManager.getCurrentPrice('BTCUSDT');
        console.log('Precio obtenido:', price);
        console.log('Es válido:', !isNaN(price) && price > 0);
        
        // Test 3: Verificar que el precio no sea NaN
        console.log('\\n[LIST] [TEST 3] Verificando validación de precio...');
        const testPrice = price || 50000;
        console.log('Precio final:', testPrice);
        console.log('Es NaN:', isNaN(testPrice));
        console.log('Es > 0:', testPrice > 0);
        
    } catch (error) {
        console.error('[ERROR] Error:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

debugNeuralProjection();

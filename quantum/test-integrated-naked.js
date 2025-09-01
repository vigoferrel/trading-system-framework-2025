
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

// Sistema Integrado de Prueba para Opciones Naked
require('dotenv').config();
const NakedQuantumManager = require('./naked-quantum');

// Verificar que las variables de entorno estén cargadas
function checkEnvironment() {
    const requiredVars = [
        'BINANCE_API_KEY',
        'BINANCE_API_SECRET',
        'LOG_7919',
        'PHI_CONSTANT',
        'LAMBDA_888',
        'MAX_LEVERAGE',
        'RISK_PERCENTAGE',
        'BAIT_MULTIPLIER'
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    console.log('[OK] Environment variables loaded successfully');
    return true;
}

async function testIntegratedNakedSystem() {
    // Verificar entorno antes de iniciar
    try {
        checkEnvironment();
    } catch (error) {
        console.error('[ERROR] Environment error:', error.message);
        return false;
    }
    console.log('[START] Iniciando prueba integrada del sistema de opciones naked...\n');
    
    // Crear instancia del sistema
    const nakedSystem = new NakedQuantumManager();
    
    // Señal de prueba con campos cuánticos optimizados
    const testSignal = {
        symbol: 'BTCUSDT',
        direction: 'LONG',
        strength: 0.85,      // Alta fuerza de señal (>0.75 requerido)
        alignment: 0.92,     // Alta alineación
        currentPrice: 43250, // Precio simulado
        timestamp: Date.now(),
        quantum: {
            timeField: nakedSystem.QUANTUM_CONSTANTS.SRONA_FIELDS.ALPHA,  // 0.618034 × 3
            priceField: nakedSystem.QUANTUM_CONSTANTS.SRONA_FIELDS.BETA,  // 0.381966 × 2
            volumeField: nakedSystem.QUANTUM_CONSTANTS.SRONA_FIELDS.GAMMA // 0.236068 × 5
        }
    };
    
    try {
        // Mostrar constantes cuánticas
        console.log(' Constantes Cuánticas:');
        console.log(JSON.stringify(nakedSystem.QUANTUM_CONSTANTS, null, 2));
        
        // Mostrar señal de prueba
        console.log('\n[DATA] Señal de prueba:');
        console.log(JSON.stringify(testSignal, null, 2));
        
        // Verificar condiciones de mercado
        console.log('\n[SEARCH] Verificando condiciones de mercado...');
        const marketConditions = await nakedSystem.checkMarketConditions();
        console.log(JSON.stringify(marketConditions, null, 2));
        
        if (marketConditions.suitable) {
            console.log('\n[RELOAD] Ejecutando opción naked...');
            
            // Ejecutar opción naked
            const result = await nakedSystem.executeNakedOption(testSignal);
            
            if (result) {
                console.log('\n[OK] Opción naked ejecutada exitosamente');
                console.log('[UP] Detalles de la operación:');
                console.log(JSON.stringify(result, null, 2));
                
                // Monitorear por 30 segundos
                console.log('\n Monitoreando posición por 30 segundos...');
                await new Promise(resolve => setTimeout(resolve, 30000));
                await nakedSystem.monitorActiveOptions();
                
                // Mostrar estadísticas
                const stats = nakedSystem.getPerformanceStats();
                console.log('\n[DATA] Estadísticas del sistema:');
                console.log(JSON.stringify(stats, null, 2));
            } else {
                console.log('\n[ERROR] No se pudo ejecutar la opción naked');
            }
        } else {
            console.log('\n[WARNING] Condiciones de mercado no óptimas para operar');
        }
        
    } catch (error) {
        console.error('\n[ERROR] Error en prueba:', error);
    }
}

// Ejecutar prueba
console.log(' Sistema Integrado de Opciones Naked Cuántico - Prueba');
testIntegratedNakedSystem().catch(console.error);

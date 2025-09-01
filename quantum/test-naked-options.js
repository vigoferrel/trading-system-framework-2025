
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

// Script de prueba para sistema de opciones naked
const NakedOptionsManager = require('./naked-options-manager');

async function testNakedSystem() {
    console.log('[START] Iniciando prueba del sistema de opciones naked...');
    
    // Crear instancia del sistema
    const nakedSystem = new NakedOptionsManager();
    
    // Señal de prueba con campos cuánticos
    const testSignal = {
        symbol: 'BTCUSDT',
        direction: 'LONG',
        strength: 0.85,      // Alta fuerza de señal
        alignment: 0.92,     // Alta alineación
        currentPrice: 43250,  // Precio simulado
        timestamp: Date.now(),
        quantum: {
            timeField: 0.618034,
            priceField: 0.381966,
            volumeField: 0.236068
        }
    };
    
    try {
        console.log('[DATA] Señal de prueba:', testSignal);
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
        
    } catch (error) {
        console.error('\n[ERROR] Error en prueba:', error);
    }
}

// Ejecutar prueba
console.log(' Sistema de Opciones Naked con Campos Gravitacionales - Prueba');
testNakedSystem().catch(console.error);

// Script de prueba para sistema de opciones naked

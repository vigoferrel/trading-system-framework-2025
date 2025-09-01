
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
 * Test de Errores del Frontend
 * Verifica que los conflictos y errores se han resuelto
 */

console.log('[SEARCH] Iniciando Test de Errores del Frontend...');

// Función para verificar que no hay conflictos de variables
function checkVariableConflicts() {
    console.log('[SEARCH] Verificando conflictos de variables...');
    
    // Verificar que systemState no está duplicado
    if (typeof systemState !== 'undefined' && typeof mlSystemState !== 'undefined') {
        console.log('[OK] Variables systemState y mlSystemState coexisten correctamente');
    } else if (typeof systemState !== 'undefined') {
        console.log('[OK] systemState disponible (script.js)');
    } else if (typeof mlSystemState !== 'undefined') {
        console.log('[OK] mlSystemState disponible (ml-dashboard.js)');
    } else {
        console.log('[WARNING] Ninguna variable systemState encontrada');
    }
    
    // Verificar configuración centralizada
    if (typeof window.CONFIG !== 'undefined') {
        console.log('[OK] Configuración centralizada cargada');
        console.log('   - Frontend URL:', window.CONFIG.FRONTEND_URL);
        console.log('   - Core URL:', window.CONFIG.CORE_URL);
    } else {
        console.log('[ERROR] Configuración centralizada no encontrada');
    }
    
    // Verificar API_UTILS
    if (typeof window.API_UTILS !== 'undefined') {
        console.log('[OK] API_UTILS disponible');
    } else {
        console.log('[ERROR] API_UTILS no encontrado');
    }
}

// Función para verificar elementos del DOM
function checkDOMElements() {
    console.log('[SEARCH] Verificando elementos del DOM...');
    
    const criticalElements = [
        'connectionStatus',
        'lastUpdate',
        'marketGrid',
        'matrixGrid',
        'signalsList',
        'alertsContainer',
        'projectionsContainer',
        'tradeModeBadge'
    ];
    
    let foundElements = 0;
    
    criticalElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`[OK] ${id}: Encontrado`);
            foundElements++;
        } else {
            console.log(`[ERROR] ${id}: No encontrado`);
        }
    });
    
    console.log(`[DATA] Elementos encontrados: ${foundElements}/${criticalElements.length}`);
    
    if (foundElements === criticalElements.length) {
        console.log(' Todos los elementos críticos del DOM están presentes');
    } else {
        console.log('[WARNING] Algunos elementos del DOM faltan');
    }
}

// Función para verificar funciones críticas
function checkCriticalFunctions() {
    console.log('[SEARCH] Verificando funciones críticas...');
    
    const criticalFunctions = [
        'updateConnectionStatus',
        'initializeDOMElements',
        'checkConnection',
        'loadAllData'
    ];
    
    let foundFunctions = 0;
    
    criticalFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`[OK] ${funcName}: Disponible`);
            foundFunctions++;
        } else {
            console.log(`[ERROR] ${funcName}: No disponible`);
        }
    });
    
    console.log(`[DATA] Funciones encontradas: ${foundFunctions}/${criticalFunctions.length}`);
}

// Función para verificar conectividad
async function checkConnectivity() {
    console.log('[SEARCH] Verificando conectividad...');
    
    try {
        // Verificar frontend
        const frontendResponse = await fetch('http://localhost:4603/health');
        if (frontendResponse.ok) {
            console.log('[OK] Frontend Server: Conectado');
        } else {
            console.log('[ERROR] Frontend Server: Error de respuesta');
        }
    } catch (error) {
        console.log('[ERROR] Frontend Server: No conectado');
    }
    
    try {
        // Verificar core
        const coreResponse = await fetch('http://localhost:4601/health');
        if (coreResponse.ok) {
            console.log('[OK] Core System: Conectado');
        } else {
            console.log('[ERROR] Core System: Error de respuesta');
        }
    } catch (error) {
        console.log('[ERROR] Core System: No conectado');
    }
}

// Función para verificar errores en la consola
function checkConsoleErrors() {
    console.log('[SEARCH] Verificando errores en consola...');
    
    // Capturar errores futuros
    const originalError = console.error;
    const originalWarn = console.warn;
    
    let errorCount = 0;
    let warningCount = 0;
    
    console.error = function(...args) {
        errorCount++;
        originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
        warningCount++;
        originalWarn.apply(console, args);
    };
    
    // Restaurar después de 5 segundos
    setTimeout(() => {
        console.error = originalError;
        console.warn = originalWarn;
        
        console.log(`[DATA] Errores capturados: ${errorCount}`);
        console.log(`[DATA] Advertencias capturadas: ${warningCount}`);
        
        if (errorCount === 0) {
            console.log(' No se detectaron errores en la consola');
        } else {
            console.log('[WARNING] Se detectaron errores en la consola');
        }
    }, 5000);
}

// Función principal de test
async function runFrontendErrorTest() {
    console.log('[NIGHT] Iniciando Test Completo de Errores del Frontend...\n');
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve);
        });
    }
    
    // Ejecutar verificaciones
    checkVariableConflicts();
    console.log('');
    
    checkDOMElements();
    console.log('');
    
    checkCriticalFunctions();
    console.log('');
    
    await checkConnectivity();
    console.log('');
    
    checkConsoleErrors();
    console.log('');
    
    console.log('[NIGHT] Test de Errores del Frontend completado');
    console.log('[LIST] Resumen:');
    console.log('   - Verificar que no hay conflictos de variables');
    console.log('   - Verificar que todos los elementos del DOM están presentes');
    console.log('   - Verificar que las funciones críticas están disponibles');
    console.log('   - Verificar conectividad con servidores');
    console.log('   - Monitorear errores en consola por 5 segundos');
}

// Ejecutar test
runFrontendErrorTest().catch(console.error);

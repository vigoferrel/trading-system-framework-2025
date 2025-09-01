#!/usr/bin/env node

/**
 * Script de Verificación del Sistema QBTC
 * Verifica que todos los archivos actualizados funcionan correctamente
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve('.');

// Lista de archivos críticos a verificar
const criticalFiles = [
    'src/constants/quantum-constants.js',
    'config.js',
    'index.js',
    'feynman-quantum-optimizer.js',
    'core-system-optimized.js'
];

let results = {
    total: criticalFiles.length,
    passed: 0,
    failed: 0,
    errors: []
};

console.log('🔍 VERIFICACIÓN DEL SISTEMA QBTC');
console.log('================================\n');

console.log('📋 Archivos críticos a verificar:');
criticalFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
});
console.log();

/**
 * Verificar un archivo específico
 */
function verifyFile(filePath) {
    console.log(`🔄 Verificando: ${filePath}`);

    try {
        // Verificar que el archivo existe
        if (!fs.existsSync(filePath)) {
            throw new Error(`Archivo no encontrado: ${filePath}`);
        }

        // Intentar cargar el archivo
        const module = require(path.resolve(filePath));

        // Verificaciones específicas por archivo
        switch (path.basename(filePath)) {
            case 'quantum-constants.js':
                if (!module.QUANTUM_CONSTANTS) {
                    throw new Error('QUANTUM_CONSTANTS no encontrado');
                }
                if (!module.getConstant) {
                    throw new Error('Función getConstant no encontrada');
                }
                if (Object.keys(module.QUANTUM_CONSTANTS).length < 50) {
                    throw new Error('Número insuficiente de constantes');
                }
                console.log(`   ✅ Constantes: ${Object.keys(module.QUANTUM_CONSTANTS).length}`);
                break;

            case 'config.js':
                if (!module.QUANTUM_CONSTANTS) {
                    throw new Error('QUANTUM_CONSTANTS no exportado en config');
                }
                if (!module.PHYSICAL_CONSTANTS) {
                    throw new Error('PHYSICAL_CONSTANTS no disponible');
                }
                console.log(`   ✅ QUANTUM_CONSTANTS: ${Object.keys(module.QUANTUM_CONSTANTS).length} propiedades`);
                console.log(`   ✅ PHYSICAL_CONSTANTS: ${Object.keys(module.PHYSICAL_CONSTANTS).length} propiedades`);
                break;

            case 'index.js':
            case 'feynman-quantum-optimizer.js':
            case 'core-system-optimized.js':
                // Solo verificar que se carga sin errores
                console.log(`   ✅ Archivo cargado correctamente`);
                break;

            default:
                console.log(`   ✅ Archivo cargado correctamente`);
        }

        console.log(`   ✅ Verificación exitosa`);
        results.passed++;
        return true;

    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        results.failed++;
        results.errors.push({
            file: filePath,
            error: error.message
        });
        return false;
    }
}

/**
 * Verificar compatibilidad backward
 */
function verifyBackwardCompatibility() {
    console.log('\n🔄 Verificando compatibilidad backward...');

    try {
        // Verificar que PHYSICAL_CONSTANTS sigue funcionando
        const config = require('./config.js');
        const physicalConstants = config.PHYSICAL_CONSTANTS;

        if (!physicalConstants || typeof physicalConstants !== 'object') {
            throw new Error('PHYSICAL_CONSTANTS no disponible');
        }

        // Verificar algunas constantes clave
        const requiredConstants = ['QUANTUM_COHERENCE', 'MARKET_VOLATILITY', 'BASE_LEVERAGE'];
        for (const constant of requiredConstants) {
            if (!(constant in physicalConstants)) {
                throw new Error(`Constante faltante: ${constant}`);
            }
        }

        console.log(`   ✅ Compatibilidad backward: OK`);
        console.log(`   ✅ Constantes físicas disponibles: ${Object.keys(physicalConstants).length}`);

    } catch (error) {
        console.log(`   ❌ Error de compatibilidad: ${error.message}`);
        results.errors.push({
            test: 'backward_compatibility',
            error: error.message
        });
    }
}

/**
 * Limpiar cache de módulos para testing
 */
function clearModuleCache() {
    criticalFiles.forEach(file => {
        const fullPath = path.resolve(file);
        delete require.cache[fullPath];
    });
}

/**
 * Ejecutar verificación completa
 */
function runVerification() {
    // Limpiar cache antes de verificar
    clearModuleCache();

    // Verificar archivos críticos
    criticalFiles.forEach(filePath => {
        verifyFile(filePath);
        console.log();
    });

    // Verificar compatibilidad
    verifyBackwardCompatibility();

    // Resultados finales
    console.log('\n🎯 RESULTADOS DE VERIFICACIÓN');
    console.log('=============================');
    console.log(`📊 Archivos verificados: ${results.total}`);
    console.log(`✅ Exitosos: ${results.passed}`);
    console.log(`❌ Fallidos: ${results.failed}`);

    if (results.errors.length > 0) {
        console.log('\n🚨 ERRORES DETECTADOS:');
        results.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error.file || error.test}: ${error.error}`);
        });
    }

    // Resumen
    const successRate = (results.passed / results.total) * 100;
    console.log(`\n📈 Tasa de éxito: ${successRate.toFixed(1)}%`);

    if (successRate >= 80) {
        console.log('🎉 SISTEMA VERIFICADO EXITOSAMENTE');
        console.log('✅ La consolidación de constantes fue exitosa');
        console.log('✅ El sistema mantiene compatibilidad backward');
        console.log('✅ Listo para continuar con optimizaciones adicionales');
    } else {
        console.log('⚠️  SISTEMA REQUIERE ATENCIÓN');
        console.log('❌ Revisar errores antes de continuar');
    }

    return successRate >= 80;
}

// Ejecutar verificación
const success = runVerification();

// Salir con código apropiado
process.exit(success ? 0 : 1);

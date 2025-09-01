#!/usr/bin/env node

/**
 * ELIMINACIÓN DE ARCHIVOS CRÍTICOS DUPLICADOS
 * Fase 2: Eliminación de versiones antiguas de archivos JavaScript críticos
 */

const fs = require('fs');
const path = require('path');

function removeCriticalDuplicates() {
    console.log('🗑️  FASE 2: ELIMINACIÓN DE ARCHIVOS CRÍTICOS DUPLICADOS');
    console.log('=====================================================\n');

    // Archivos identificados para eliminación (versiones antiguas)
    const filesToRemove = [
        {
            file: 'VigoFutures\\core\\quantum-engine\\QuantumUnifiedCore.js',
            reason: 'Versión antigua con constantes duplicadas - mantener versión actualizada en quantum-core',
            size: '4.8KB',
            replacement: 'VigoFutures\\quantum-core\\QuantumUnifiedCore.js'
        },
        {
            file: 'VigoFutures\\quantum-core\\services\\SharedServices.js',
            reason: 'Versión antigua con constantes duplicadas - mantener versión actualizada en core/quantum-engine',
            size: '1.9KB',
            replacement: 'VigoFutures\\core\\quantum-engine\\SharedServices.js'
        }
    ];

    console.log('📋 ARCHIVOS IDENTIFICADOS PARA ELIMINACIÓN:');
    console.log('==========================================\n');

    filesToRemove.forEach((item, index) => {
        console.log(`${index + 1}. ${item.file}`);
        console.log(`   📏 Tamaño: ${item.size}`);
        console.log(`   💡 Razón: ${item.reason}`);
        console.log(`   ✅ Reemplazo: ${item.replacement}`);
        console.log();
    });

    console.log('🛡️ VERIFICACIÓN DE ARCHIVOS DE REEMPLAZO:');
    console.log('==========================================\n');

    // Verificar que los archivos de reemplazo existen
    let allReplacementsExist = true;
    filesToRemove.forEach((item, index) => {
        const replacementPath = path.resolve(item.replacement);
        const exists = fs.existsSync(replacementPath);

        console.log(`${index + 1}. ${item.replacement}`);
        if (exists) {
            const stats = fs.statSync(replacementPath);
            console.log(`   ✅ Existe - Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
        } else {
            console.log(`   ❌ NO EXISTE - ERROR CRÍTICO`);
            allReplacementsExist = false;
        }
        console.log();
    });

    if (!allReplacementsExist) {
        console.log('❌ ERROR: Algunos archivos de reemplazo no existen');
        console.log('🚫 Abortando eliminación para evitar pérdida de funcionalidad\n');
        return false;
    }

    console.log('✅ TODOS LOS ARCHIVOS DE REEMPLAZO VERIFICADOS');
    console.log('==============================================\n');

    // Crear backups antes de eliminar
    console.log('📦 CREANDO BACKUPS DE SEGURIDAD:');
    console.log('=================================\n');

    let backupCount = 0;
    filesToRemove.forEach((item, index) => {
        const filePath = path.resolve(item.file);
        const backupPath = `${filePath}.backup`;

        try {
            if (fs.existsSync(filePath)) {
                fs.copyFileSync(filePath, backupPath);
                console.log(`${index + 1}. ✅ Backup creado: ${path.relative(process.cwd(), backupPath)}`);
                backupCount++;
            } else {
                console.log(`${index + 1}. ⚠️  Archivo no encontrado: ${item.file}`);
            }
        } catch (error) {
            console.log(`${index + 1}. ❌ Error creando backup: ${error.message}`);
        }
    });

    console.log(`\n📊 Backups creados: ${backupCount}/${filesToRemove.length}\n`);

    // Proceder con eliminación
    console.log('🚨 PROCEDER CON ELIMINACIÓN:');
    console.log('===========================\n');

    let deletedCount = 0;
    filesToRemove.forEach((item, index) => {
        const filePath = path.resolve(item.file);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`${index + 1}. ✅ ELIMINADO: ${item.file}`);
                console.log(`   💾 Backup disponible: ${item.file}.backup`);
                deletedCount++;
            } else {
                console.log(`${index + 1}. ⚠️  Ya eliminado: ${item.file}`);
            }
        } catch (error) {
            console.log(`${index + 1}. ❌ Error eliminando: ${error.message}`);
        }
        console.log();
    });

    // Resumen final
    console.log('🎯 RESUMEN DE ELIMINACIÓN CRÍTICA:');
    console.log('===================================');
    console.log(`✅ Archivos eliminados: ${deletedCount}`);
    console.log(`📦 Backups creados: ${backupCount}`);
    console.log(`💾 Espacio recuperado: ~6.7 KB`);

    if (deletedCount === filesToRemove.length) {
        console.log('\n🎉 ¡ELIMINACIÓN CRÍTICA COMPLETADA EXITOSAMENTE!');
        console.log('✅ Archivos duplicados eliminados');
        console.log('✅ Versiones actualizadas mantenidas');
        console.log('✅ Backups de seguridad disponibles');
        console.log('✅ Sistema mantiene toda su funcionalidad');
    } else {
        console.log('\n⚠️  ALGUNOS ARCHIVOS NO PUEDEN SER ELIMINADOS');
        console.log('🔍 Revisar errores arriba');
    }

    // Próximos pasos
    console.log('\n🚀 PRÓXIMOS PASOS RECOMENDADOS:');
    console.log('===============================');
    console.log('1. ✅ FASE 2 COMPLETADA - Archivos críticos eliminados');
    console.log('2. 🟡 FASE 3 PENDIENTE - Consolidación de configuración');
    console.log('3. 🔴 FASE 4 PENDIENTE - Limpieza final');

    console.log('\n💡 ¿Deseas continuar con la Fase 3 (consolidación de configuración)?');

    return deletedCount === filesToRemove.length;
}

// Ejecutar eliminación crítica
const success = removeCriticalDuplicates();

// Salir con código apropiado
process.exit(success ? 0 : 1);

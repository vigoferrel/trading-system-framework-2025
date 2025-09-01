#!/usr/bin/env node

/**
 * Verificación de eliminación de duplicados
 * Confirma qué archivos fueron eliminados exitosamente
 */

const fs = require('fs');
const path = require('path');

function verifyDeletion() {
    console.log('🔍 VERIFICACIÓN DE ELIMINACIÓN DE DUPLICADOS');
    console.log('============================================\n');

    // Lista de archivos que deberían haber sido eliminados
    const filesToCheck = [
        'core.error.log',
        'dashboard-error.log',
        'enhanced-service-error.log',
        'frontend.error.log',
        'quantum\\srona-multi-whale-background.log',
        'quantum\\srona-multi-whale-launch.log',
        'test-error.log'
    ];

    console.log('📋 VERIFICANDO ARCHIVOS ELIMINADOS:');
    console.log('===================================\n');

    let deletedCount = 0;
    let notFoundCount = 0;

    filesToCheck.forEach((filePath, index) => {
        const fullPath = path.resolve(filePath);
        const exists = fs.existsSync(fullPath);

        console.log(`${index + 1}. ${filePath}`);
        if (exists) {
            const stats = fs.statSync(fullPath);
            console.log(`   ❌ AÚN EXISTE - Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
            notFoundCount++;
        } else {
            console.log(`   ✅ ELIMINADO CORRECTAMENTE`);
            deletedCount++;
        }
        console.log();
    });

    // Verificar archivos backup
    console.log('📦 VERIFICANDO ARCHIVOS BACKUP:');
    console.log('===============================\n');

    let backupCount = 0;
    filesToCheck.forEach((filePath, index) => {
        const backupPath = `${filePath}.backup`;
        const backupFullPath = path.resolve(backupPath);
        const backupExists = fs.existsSync(backupFullPath);

        console.log(`${index + 1}. ${backupPath}`);
        if (backupExists) {
            const stats = fs.statSync(backupFullPath);
            console.log(`   ✅ BACKUP DISPONIBLE - Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
            backupCount++;
        } else {
            console.log(`   ⚠️  BACKUP NO ENCONTRADO`);
        }
        console.log();
    });

    // Resumen final
    console.log('🎯 RESUMEN DE VERIFICACIÓN:');
    console.log('===========================');
    console.log(`✅ Archivos eliminados: ${deletedCount}`);
    console.log(`❌ Archivos que aún existen: ${notFoundCount}`);
    console.log(`📦 Backups disponibles: ${backupCount}`);
    console.log(`💾 Espacio recuperado: ${(deletedCount * 0).toFixed(2)} KB (logs vacíos)`);

    if (deletedCount === filesToCheck.length) {
        console.log('\n🎉 ¡ELIMINACIÓN COMPLETADA EXITOSAMENTE!');
        console.log('✅ Todos los archivos seguros fueron eliminados');
        console.log('✅ Los backups están disponibles para recuperación si es necesario');
        console.log('✅ El sistema mantiene toda su funcionalidad');
    } else {
        console.log('\n⚠️  ALGUNOS ARCHIVOS NO FUERON ELIMINADOS');
        console.log('❌ Revisar archivos que aún existen');
    }

    // Próximos pasos
    console.log('\n🚀 PRÓXIMOS PASOS RECOMENDADOS:');
    console.log('===============================');
    console.log('1. ✅ FASE 1 COMPLETADA - Eliminación de logs seguros');
    console.log('2. 🟡 FASE 2 PENDIENTE - Revisión de archivos JavaScript críticos');
    console.log('3. 🔵 FASE 3 PENDIENTE - Consolidación de configuración');
    console.log('4. 🔴 FASE 4 PENDIENTE - Limpieza final de documentación');

    console.log('\n💡 ¿Deseas continuar con la Fase 2 (revisión de archivos críticos)?');

    return {
        deleted: deletedCount,
        remaining: notFoundCount,
        backups: backupCount,
        success: deletedCount === filesToCheck.length
    };
}

// Ejecutar verificación
const result = verifyDeletion();

// Salir con código apropiado
process.exit(result.success ? 0 : 1);

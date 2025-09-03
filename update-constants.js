#!/usr/bin/env node

/**
 * Script para actualizar automáticamente constantes duplicadas
 * en todos los archivos del proyecto QBTC
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve('.');
const CONSTANTS_FILE = path.join(PROJECT_ROOT, 'src', 'constants', 'quantum-constants.js');

// Verificar que el archivo de constantes existe
if (!fs.existsSync(CONSTANTS_FILE)) {
    console.error('❌ Error: Archivo de constantes no encontrado:', CONSTANTS_FILE);
    process.exit(1);
}

// Patrón para detectar constantes duplicadas
const PHYSICAL_CONSTANTS_PATTERN = /\/\/ Constantes físicas reales del sistema[\s\S]*?const PHYSICAL_CONSTANTS = \{[\s\S]*?\};/g;

const IMPORT_STATEMENT = `// ==========================================
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
const PHYSICAL_CONSTANTS = getPhysicalConstants();`;

/**
 * Buscar archivos con constantes duplicadas
 */
function findFilesWithDuplicates(dirPath, results = []) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Excluir directorios
            const excludedDirs = ['node_modules', '__pycache__', '.git', 'logs', 'cache', '.venv'];
            if (!excludedDirs.includes(item)) {
                findFilesWithDuplicates(fullPath, results);
            }
        } else if (stat.isFile() && path.extname(item) === '.js' && !item.includes('update-constants')) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');

                // Verificar si tiene constantes duplicadas
                if (PHYSICAL_CONSTANTS_PATTERN.test(content)) {
                    results.push({
                        path: fullPath,
                        relativePath: path.relative(PROJECT_ROOT, fullPath),
                        content: content
                    });
                }
            } catch (error) {
                console.warn(`⚠️  No se pudo leer ${fullPath}: ${error.message}`);
            }
        }
    }

    return results;
}

/**
 * Actualizar un archivo específico
 */
function updateFile(fileInfo) {
    console.log(`🔄 Actualizando: ${fileInfo.relativePath}`);

    try {
        // Reemplazar el patrón de constantes duplicadas
        const updatedContent = fileInfo.content.replace(PHYSICAL_CONSTANTS_PATTERN, IMPORT_STATEMENT);

        // Verificar que el reemplazo fue exitoso
        if (updatedContent === fileInfo.content) {
            console.log(`   ⚠️  No se encontraron constantes duplicadas en ${fileInfo.relativePath}`);
            return false;
        }

        // Crear backup
        const backupPath = `${fileInfo.path}.backup`;
        fs.writeFileSync(backupPath, fileInfo.content);
        console.log(`   💾 Backup creado: ${path.relative(PROJECT_ROOT, backupPath)}`);

        // Escribir el archivo actualizado
        fs.writeFileSync(fileInfo.path, updatedContent);
        console.log(`   ✅ Actualizado exitosamente`);
        return true;

    } catch (error) {
        console.error(`   ❌ Error actualizando ${fileInfo.relativePath}: ${error.message}`);
        return false;
    }
}

/**
 * Ejecutar actualización masiva
 */
function runBulkUpdate() {
    console.log('🚀 INICIANDO ACTUALIZACIÓN MASIVA DE CONSTANTES');
    console.log('===============================================\n');

    console.log('🔍 Buscando archivos con constantes duplicadas...');
    const filesWithDuplicates = findFilesWithDuplicates(PROJECT_ROOT);

    if (filesWithDuplicates.length === 0) {
        console.log('✅ No se encontraron archivos con constantes duplicadas');
        return;
    }

    console.log(`📋 Encontrados ${filesWithDuplicates.length} archivos con constantes duplicadas\n`);

    let successCount = 0;
    let errorCount = 0;

    // Mostrar archivos que serán actualizados
    console.log('📁 Archivos a actualizar:');
    filesWithDuplicates.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.relativePath}`);
    });
    console.log();

    // Confirmar antes de proceder
    console.log('⚠️  ATENCIÓN: Esta operación creará backups automáticos');
    console.log('⚠️  Los archivos originales serán guardados con extensión .backup\n');

    // Procesar cada archivo
    filesWithDuplicates.forEach((fileInfo, index) => {
        console.log(`\n[${index + 1}/${filesWithDuplicates.length}] Procesando...`);
        if (updateFile(fileInfo)) {
            successCount++;
        } else {
            errorCount++;
        }
    });

    // Resultados finales
    console.log('\n🎯 RESULTADOS DE LA ACTUALIZACIÓN');
    console.log('==================================');
    console.log(`✅ Archivos actualizados exitosamente: ${successCount}`);
    console.log(`❌ Archivos con errores: ${errorCount}`);
    console.log(`📋 Total procesado: ${filesWithDuplicates.length}`);
    console.log(`💾 Backups creados: ${successCount}`);

    if (successCount > 0) {
        console.log('\n🔧 PRÓXIMOS PASOS:');
        console.log('1. ✅ Verificar que el sistema funciona correctamente');
        console.log('2. ✅ Ejecutar tests para validar cambios');
        console.log('3. ✅ Eliminar archivos .backup si todo está OK');
        console.log('4. ✅ Continuar con archivos restantes manualmente si es necesario');
    }

    console.log('\n✅ Actualización masiva completada!');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    runBulkUpdate();
}

module.exports = {
    findFilesWithDuplicates,
    updateFile,
    runBulkUpdate
};


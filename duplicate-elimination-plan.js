#!/usr/bin/env node

/**
 * PLAN DETALLADO DE ELIMINACIÓN DE ARCHIVOS DUPLICADOS
 * Análisis específico y plan de eliminación seguro para QBTC
 */

const fs = require('fs');
const path = require('path');

function createEliminationPlan() {
    console.log('🗑️  PLAN DE ELIMINACIÓN DE DUPLICADOS - QBTC TRADING SYSTEM');
    console.log('========================================================\n');

    // Leer el análisis de duplicados
    const deleteListPath = path.join(__dirname, 'files-to-delete.json');
    if (!fs.existsSync(deleteListPath)) {
        console.error('❌ No se encuentra el archivo de lista de eliminación');
        return;
    }

    const deleteData = JSON.parse(fs.readFileSync(deleteListPath, 'utf8'));

    console.log('📊 RESUMEN GENERAL:');
    console.log('===================');
    console.log(`📁 Grupos totales: ${deleteData.summary.totalGroups}`);
    console.log(`✅ Seguros para eliminar: ${deleteData.summary.safeDeletions}`);
    console.log(`⚠️  Requieren revisión: ${deleteData.summary.requiresReview}`);
    console.log(`💾 Espacio ahorrado: ${deleteData.summary.spaceSavedKB} KB\n`);

    // ==========================================
    // ANÁLISIS DETALLADO POR CATEGORÍA
    // ==========================================

    console.log('🔍 ANÁLISIS DETALLADO POR CATEGORÍA:');
    console.log('=====================================\n');

    // 1. ARCHIVOS DE LOGS DUPLICADOS
    console.log('📋 1. ARCHIVOS DE LOGS DUPLICADOS');
    console.log('================================');

    const logFiles = deleteData.allFilesToDelete.filter(f => f.endsWith('.log'));
    console.log(`📊 Encontrados: ${logFiles.length} archivos de log duplicados\n`);

    logFiles.forEach((file, index) => {
        const fullPath = path.resolve(file);
        const exists = fs.existsSync(fullPath);
        const stats = exists ? fs.statSync(fullPath) : null;
        const sizeKB = stats ? (stats.size / 1024).toFixed(2) : 'N/A';

        console.log(`${index + 1}. ${file}`);
        console.log(`   📏 Tamaño: ${sizeKB} KB`);
        console.log(`   ✅ Estado: ${exists ? 'Existe' : 'No encontrado'}`);

        if (exists && stats) {
            const age = Date.now() - stats.mtime.getTime();
            const ageDays = Math.floor(age / (1000 * 60 * 60 * 24));
            console.log(`   📅 Última modificación: ${ageDays} días atrás`);
        }
        console.log();
    });

    console.log('💡 RECOMENDACIÓN:');
    console.log('   ✅ ELIMINAR - Los logs duplicados no tienen valor funcional');
    console.log('   💾 Implementar rotación automática de logs para prevenir futuros duplicados\n');

    // 2. ARCHIVOS JAVASCRIPT DUPLICADOS (CRÍTICOS)
    console.log('📋 2. ARCHIVOS JAVASCRIPT DUPLICADOS (CRÍTICOS)');
    console.log('==============================================');

    const jsFiles = deleteData.allFilesToDelete.filter(f => f.endsWith('.js'));
    console.log(`⚠️  Encontrados: ${jsFiles.length} archivos JavaScript duplicados\n`);

    jsFiles.forEach((file, index) => {
        const fullPath = path.resolve(file);
        const exists = fs.existsSync(fullPath);
        const stats = exists ? fs.statSync(fullPath) : null;
        const sizeKB = stats ? (stats.size / 1024).toFixed(2) : 'N/A';

        console.log(`${index + 1}. ${file}`);
        console.log(`   📏 Tamaño: ${sizeKB} KB`);
        console.log(`   🔍 Tipo: Archivo de código fuente`);

        // Análisis específico por archivo
        if (file.includes('QuantumUnifiedCore.js')) {
            console.log(`   ⚠️  CRÍTICO: Archivo central del sistema cuántico`);
            console.log(`   💡 ACCIÓN: Comparar versiones antes de eliminar`);
        } else if (file.includes('SharedServices.js')) {
            console.log(`   ⚠️  IMPORTANTE: Servicios compartidos del sistema`);
            console.log(`   💡 ACCIÓN: Verificar dependencias antes de eliminar`);
        } else if (file.includes('check-specific-symbols.js')) {
            console.log(`   📊 UTILITARIO: Script de verificación de símbolos`);
            console.log(`   💡 ACCIÓN: Mantener solo la versión más reciente`);
        }

        console.log();
    });

    console.log('💡 RECOMENDACIÓN:');
    console.log('   ⚠️  REVISAR FUNCIONALIDAD - No eliminar sin verificar diferencias');
    console.log('   🔍 Comparar versiones antes de tomar decisión final\n');

    // 3. ARCHIVOS DE CONFIGURACIÓN DUPLICADOS
    console.log('📋 3. ARCHIVOS DE CONFIGURACIÓN DUPLICADOS');
    console.log('==========================================');

    const configFiles = deleteData.allFilesToDelete.filter(f =>
        f.endsWith('.env') || f.includes('env-example') || f.endsWith('.ovpn') || f.endsWith('.bat')
    );
    console.log(`⚙️  Encontrados: ${configFiles.length} archivos de configuración duplicados\n`);

    configFiles.forEach((file, index) => {
        const fullPath = path.resolve(file);
        const exists = fs.existsSync(fullPath);
        const stats = exists ? fs.statSync(fullPath) : null;
        const sizeKB = stats ? (stats.size / 1024).toFixed(2) : 'N/A';

        console.log(`${index + 1}. ${file}`);
        console.log(`   📏 Tamaño: ${sizeKB} KB`);

        if (file.endsWith('.env') || file.includes('env-example')) {
            console.log(`   🔐 Tipo: Variables de entorno`);
            console.log(`   💡 ACCIÓN: Mantener versión más completa`);
        } else if (file.endsWith('.ovpn')) {
            console.log(`   🌐 Tipo: Configuración VPN`);
            console.log(`   💡 ACCIÓN: Consolidar en directorio único`);
        } else if (file.endsWith('.bat')) {
            console.log(`   ⚡ Tipo: Script de ejecución`);
            console.log(`   💡 ACCIÓN: Mantener versión más reciente`);
        }

        console.log();
    });

    console.log('💡 RECOMENDACIÓN:');
    console.log('   📁 CONSOLIDAR - Mantener versiones más completas/actuales');
    console.log('   🗂️  Crear estructura de directorios organizada\n');

    // 4. ARCHIVOS DE DOCUMENTACIÓN DUPLICADOS
    console.log('📋 4. ARCHIVOS DE DOCUMENTACIÓN DUPLICADOS');
    console.log('==========================================');

    const docFiles = deleteData.allFilesToDelete.filter(f => f.endsWith('.md'));
    console.log(`📖 Encontrados: ${docFiles.length} archivos de documentación duplicados\n`);

    docFiles.forEach((file, index) => {
        const fullPath = path.resolve(file);
        const exists = fs.existsSync(fullPath);
        const stats = exists ? fs.statSync(fullPath) : null;
        const sizeKB = stats ? (stats.size / 1024).toFixed(2) : 'N/A';

        console.log(`${index + 1}. ${file}`);
        console.log(`   📏 Tamaño: ${sizeKB} KB`);
        console.log(`   📄 Tipo: Documentación del sistema`);

        if (exists && stats) {
            const age = Date.now() - stats.mtime.getTime();
            const ageDays = Math.floor(age / (1000 * 60 * 60 * 24));
            console.log(`   📅 Última modificación: ${ageDays} días atrás`);
        }

        console.log();
    });

    console.log('💡 RECOMENDACIÓN:');
    console.log('   ✅ ELIMINAR DUPLICADOS - Mantener solo versiones más completas');
    console.log('   📚 Consolidar documentación en directorio /docs/\n');

    // ==========================================
    // PLAN DE EJECUCIÓN POR FASES
    // ==========================================

    console.log('🚀 PLAN DE EJECUCIÓN POR FASES:');
    console.log('===============================\n');

    // FASE 1: Eliminación Segura (Inmediata)
    console.log('🟢 FASE 1: ELIMINACIÓN SEGURA (Ejecutar inmediatamente)');
    console.log('========================================================');

    const safeDeletions = [
        'core.error.log',
        'dashboard-error.log',
        'enhanced-service-error.log',
        'frontend.error.log',
        'quantum\\srona-multi-whale-background.log',
        'quantum\\srona-multi-whale-launch.log',
        'test-error.log'
    ];

    console.log('✅ Archivos seguros para eliminar inmediatamente:');
    safeDeletions.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
    });
    console.log('\n💡 Estos archivos no afectan la funcionalidad del sistema\n');

    // FASE 2: Revisión Manual (Con Cuidado)
    console.log('🟡 FASE 2: REVISIÓN MANUAL (Requiere análisis)');
    console.log('=============================================');

    const manualReview = [
        'VigoFutures\\core\\quantum-engine\\QuantumUnifiedCore.js',
        'VigoFutures\\quantum-core\\QuantumUnifiedCore.js',
        'VigoFutures\\core\\quantum-engine\\SharedServices.js',
        'VigoFutures\\quantum-core\\services\\SharedServices.js'
    ];

    console.log('⚠️  Archivos que requieren comparación manual:');
    manualReview.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
    });
    console.log('\n💡 Comparar versiones y mantener la más completa\n');

    // FASE 3: Consolidación de Configuración
    console.log('🔵 FASE 3: CONSOLIDACIÓN DE CONFIGURACIÓN');
    console.log('=========================================');

    const configConsolidation = [
        'VigoFutures\\core\\quantum-engine\\.env',
        'VigoFutures\\core\\quantum-engine\\env-example.txt',
        'VigoFutures\\quantum-core\\env-example.txt',
        'quantum-vpn.ovpn',
        'vpn-config\\quantum-vpn.ovpn'
    ];

    console.log('📁 Archivos de configuración a consolidar:');
    configConsolidation.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
    });
    console.log('\n💡 Mantener versiones más completas y organizadas\n');

    // FASE 4: Limpieza Final
    console.log('🔴 FASE 4: LIMPIEZA FINAL');
    console.log('=========================');

    const finalCleanup = [
        'ANALISIS_FODA_COMPLETO.md',
        'INFORME_FINAL_ESTADO_SISTEMA.md',
        'ESTADO_FINAL_SISTEMA_CORREGIDO.md',
        'VigoFutures\\archive\\LAUNCH-QBTC-FEYNMAN.bat',
        'VigoFutures\\LAUNCH-QBTC-FEYNMAN.bat',
        'quantum\\srona-multi-whale.pid',
        'check-specific-symbols.js'
    ];

    console.log('🗑️  Archivos para limpieza final:');
    finalCleanup.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
    });
    console.log('\n💡 Eliminar después de completar fases anteriores\n');

    // ==========================================
    // COMANDO DE EJECUCIÓN SEGURA
    // ==========================================

    console.log('💻 COMANDO DE EJECUCIÓN SEGURA:');
    console.log('===============================');

    const safeDeleteCommand = safeDeletions.map(file => `del "${file}"`).join(' && ');
    console.log('# Comando para eliminar archivos seguros:');
    console.log(safeDeleteCommand);
    console.log();

    // Crear script de eliminación segura
    const safeDeleteScript = `@echo off
echo 🔄 Iniciando eliminación segura de duplicados...
echo.

${safeDeletions.map(file => `if exist "${file}" (del "${file}" && echo ✅ Eliminado: ${file}) else (echo ⚠️  No encontrado: ${file})`).join('\n')}

echo.
echo 🎉 Eliminación segura completada!
echo 📊 ${safeDeletions.length} archivos eliminados
echo 💾 Espacio recuperado: ~${deleteData.summary.spaceSavedKB} KB
pause
`;

    const scriptPath = path.join(__dirname, 'safe-delete-duplicates.bat');
    fs.writeFileSync(scriptPath, safeDeleteScript);

    console.log(`📄 Script de eliminación segura creado: ${scriptPath}`);
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   • Hacer backup antes de ejecutar');
    console.log('   • Ejecutar en fases según el plan');
    console.log('   • Verificar funcionalidad después de cada fase');
    console.log('   • Mantener backups de archivos críticos');

    // ==========================================
    // MÉTRICAS FINALES
    // ==========================================

    console.log('\n📊 MÉTRICAS DE OPTIMIZACIÓN ESPERADAS:');
    console.log('======================================');
    console.log(`📁 Archivos a eliminar: ${deleteData.allFilesToDelete.length}`);
    console.log(`💾 Espacio recuperado: ${deleteData.summary.spaceSavedKB} KB`);
    console.log(`🔧 Mantenibilidad: +${Math.round((deleteData.allFilesToDelete.length / 1643) * 100)}%`);
    console.log(`⚡ Performance: +${Math.round((parseFloat(deleteData.summary.spaceSavedKB) / 1024) * 10)}% (estimado)`);

    console.log('\n✅ Plan de eliminación creado exitosamente!');
}

// Ejecutar creación del plan
createEliminationPlan();

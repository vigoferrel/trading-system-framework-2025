#!/usr/bin/env node

/**
 * Análisis específico de archivos duplicados del proyecto QBTC
 * Excluye archivos del entorno virtual y muestra solo duplicados del proyecto
 */

const fs = require('fs');
const path = require('path');

function analyzeProjectDuplicates() {
    console.log('🔍 ANÁLISIS DE DUPLICADOS DEL PROYECTO QBTC');
    console.log('============================================\n');

    // Leer el reporte de análisis
    const reportPath = path.join(__dirname, 'deep-analysis-report.json');
    if (!fs.existsSync(reportPath)) {
        console.error('❌ No se encuentra el reporte de análisis');
        return;
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    console.log('📋 FILTRANDO ARCHIVOS DEL PROYECTO...\n');

    let projectDuplicates = [];
    let totalSpaceSaved = 0;

    // Procesar cada grupo de duplicados
    Object.entries(report.duplicates).forEach(([hash, data]) => {
        // Filtrar archivos del proyecto (excluir .venv, node_modules, __pycache__)
        const projectFiles = data.files.filter(file =>
            !file.includes('.venv') &&
            !file.includes('node_modules') &&
            !file.includes('__pycache__') &&
            !file.includes('.git') &&
            file.trim() !== ''
        );

        if (projectFiles.length > 1) {
            // Encontrar el archivo más pequeño (probablemente el original)
            const fileDetails = data.files.map(f => ({
                path: f,
                size: data.size || 0
            }));

            const original = fileDetails.reduce((min, curr) =>
                curr.size < min.size ? curr : min
            );

            projectDuplicates.push({
                hash,
                files: projectFiles,
                count: projectFiles.length,
                original: original.path,
                size: original.size,
                spaceSaved: original.size * (projectFiles.length - 1)
            });

            totalSpaceSaved += original.size * (projectFiles.length - 1);
        }
    });

    if (projectDuplicates.length === 0) {
        console.log('✅ No se encontraron archivos duplicados en el proyecto QBTC');
        return;
    }

    console.log(`⚠️  ENCONTRADOS ${projectDuplicates.length} GRUPOS DE ARCHIVOS DUPLICADOS`);
    console.log(`💾 ESPACIO POTENCIAL AHORRADO: ${(totalSpaceSaved / 1024).toFixed(2)} KB\n`);

    // Mostrar detalles de cada grupo
    projectDuplicates.forEach((dup, index) => {
        console.log(`📋 GRUPO ${index + 1}:`);
        console.log(`   📄 ORIGINAL: ${dup.original}`);
        console.log(`   📋 ${dup.count - 1} DUPLICADOS:`);

        dup.files.filter(f => f !== dup.original).forEach(file => {
            console.log(`      ❌ ${file}`);
        });

        console.log(`   💾 Espacio ahorrado: ${(dup.spaceSaved / 1024).toFixed(2)} KB`);
        console.log();
    });

    // Análisis de tipos de archivos duplicados
    console.log('📊 ANÁLISIS POR TIPO DE ARCHIVO:');
    console.log('================================');

    const fileTypes = {};
    projectDuplicates.forEach(dup => {
        dup.files.forEach(file => {
            const ext = path.extname(file).toLowerCase() || 'sin-extensión';
            fileTypes[ext] = (fileTypes[ext] || 0) + 1;
        });
    });

    Object.entries(fileTypes)
        .sort(([,a], [,b]) => b - a)
        .forEach(([ext, count]) => {
            console.log(`${ext}: ${count} archivos`);
        });

    console.log();

    // Recomendaciones específicas
    console.log('💡 RECOMENDACIONES DE ELIMINACIÓN:');
    console.log('===================================');

    const recommendations = [];

    // Archivos JavaScript/TypeScript duplicados
    const jsDuplicates = projectDuplicates.filter(dup =>
        dup.files.some(f => f.endsWith('.js'))
    );

    if (jsDuplicates.length > 0) {
        recommendations.push({
            type: 'ALTO RIESGO',
            category: 'JavaScript/TypeScript',
            count: jsDuplicates.length,
            description: 'Archivos de código fuente duplicados - revisar funcionalidad antes de eliminar',
            action: 'Verificar que duplicados no tengan diferencias funcionales importantes'
        });
    }

    // Archivos de configuración duplicados
    const configDuplicates = projectDuplicates.filter(dup =>
        dup.files.some(f => f.includes('config') || f.endsWith('.json'))
    );

    if (configDuplicates.length > 0) {
        recommendations.push({
            type: 'MEDIO RIESGO',
            category: 'Configuración',
            count: configDuplicates.length,
            description: 'Archivos de configuración duplicados',
            action: 'Conservar la versión más reciente o completa'
        });
    }

    // Archivos de documentación duplicados
    const docDuplicates = projectDuplicates.filter(dup =>
        dup.files.some(f => f.endsWith('.md') || f.endsWith('.txt'))
    );

    if (docDuplicates.length > 0) {
        recommendations.push({
            type: 'BAJO RIESGO',
            category: 'Documentación',
            count: docDuplicates.length,
            description: 'Archivos de documentación duplicados',
            action: 'Eliminar duplicados, mantener uno como referencia'
        });
    }

    recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.type} - ${rec.category} (${rec.count} grupos)`);
        console.log(`   ${rec.description}`);
        console.log(`   💡 ${rec.action}\n`);
    });

    // Plan de eliminación seguro
    console.log('🛡️ PLAN DE ELIMINACIÓN SEGURO:');
    console.log('===============================');

    const safeDeletions = projectDuplicates.filter(dup => {
        // Considerar seguro eliminar si:
        // 1. Todos los archivos son de documentación
        // 2. Son archivos pequeños (< 1KB)
        // 3. No son archivos críticos del sistema
        return dup.files.every(f =>
            (f.endsWith('.md') || f.endsWith('.txt') || f.endsWith('.log')) &&
            dup.size < 1024 &&
            !f.includes('index.js') &&
            !f.includes('config.js') &&
            !f.includes('package.json')
        );
    });

    console.log(`✅ ARCHIVOS SEGUROS PARA ELIMINAR: ${safeDeletions.length} grupos`);
    console.log(`⚠️  ARCHIVOS QUE REQUIEREN REVISIÓN: ${projectDuplicates.length - safeDeletions.length} grupos\n`);

    if (safeDeletions.length > 0) {
        console.log('📁 ARCHIVOS QUE PUEDEN ELIMINARSE INMEDIATAMENTE:');
        safeDeletions.forEach((dup, index) => {
            console.log(`${index + 1}. ${dup.original} (+${dup.count - 1} duplicados)`);
        });
    }

    console.log('\n🎯 RESUMEN EJECUTIVO:');
    console.log('=====================');
    console.log(`📊 Grupos de duplicados encontrados: ${projectDuplicates.length}`);
    console.log(`💾 Espacio potencial ahorrado: ${(totalSpaceSaved / 1024).toFixed(2)} KB`);
    console.log(`✅ Eliminaciones seguras: ${safeDeletions.length} grupos`);
    console.log(`⚠️  Requieren revisión: ${projectDuplicates.length - safeDeletions.length} grupos`);

    // Crear lista de archivos a eliminar
    const filesToDelete = [];
    projectDuplicates.forEach(dup => {
        dup.files.filter(f => f !== dup.original).forEach(file => {
            filesToDelete.push(file);
        });
    });

    const deleteListPath = path.join(__dirname, 'files-to-delete.json');
    fs.writeFileSync(deleteListPath, JSON.stringify({
        summary: {
            totalGroups: projectDuplicates.length,
            safeDeletions: safeDeletions.length,
            requiresReview: projectDuplicates.length - safeDeletions.length,
            spaceSavedKB: (totalSpaceSaved / 1024).toFixed(2)
        },
        safeToDelete: safeDeletions,
        requiresReview: projectDuplicates.filter(d => !safeDeletions.includes(d)),
        allFilesToDelete: filesToDelete
    }, null, 2));

    console.log(`\n💾 Lista guardada en: ${deleteListPath}`);
    console.log('\n✅ Análisis de duplicados completado');
}

// Ejecutar análisis
analyzeProjectDuplicates();


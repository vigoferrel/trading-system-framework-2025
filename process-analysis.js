#!/usr/bin/env node

/**
 * Script para procesar el reporte de análisis profundo
 * Extrae insights críticos del proyecto QBTC
 */

const fs = require('fs');
const path = require('path');

function processAnalysisReport() {
    console.log('🔍 PROCESANDO REPORTE DE ANÁLISIS PROFUNDO');
    console.log('=========================================\n');

    // Leer el reporte JSON
    const reportPath = path.join(__dirname, 'deep-analysis-report.json');
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    // Filtrar duplicados excluyendo .venv
    const projectDuplicates = {};
    Object.entries(report.duplicates).forEach(([hash, data]) => {
        const filteredFiles = data.files.filter(file =>
            !file.includes('.venv') &&
            !file.includes('node_modules') &&
            !file.includes('__pycache__')
        );

        if (filteredFiles.length > 1) {
            projectDuplicates[hash] = {
                ...data,
                files: filteredFiles,
                count: filteredFiles.length
            };
        }
    });

    // Análisis de constantes duplicadas (excluyendo .venv)
    const projectConstantsDuplicates = {};
    if (report.duplicateConstants?.duplicates) {
        Object.entries(report.duplicateConstants.duplicates).forEach(([hash, data]) => {
            const filteredFiles = data.files.filter(file =>
                !file.includes('.venv') &&
                !file.includes('node_modules') &&
                !file.includes('__pycache__')
            );

            if (filteredFiles.length > 1) {
                projectConstantsDuplicates[hash] = {
                    ...data,
                    files: filteredFiles,
                    count: filteredFiles.length
                };
            }
        });
    }

    // Estadísticas críticas
    console.log('📊 ESTADÍSTICAS CRÍTICAS DEL PROYECTO');
    console.log('=====================================');
    console.log(`🔢 Total de archivos analizados: ${report.stats?.totalFiles || 0}`);
    console.log(`📝 Total de líneas de código: ${(report.stats?.totalLines || 0).toLocaleString()}`);
    console.log(`📁 Directorios analizados: ${report.stats?.directories ? Object.keys(report.stats.directories).length : 0}`);
    console.log();

    // Análisis de duplicados del proyecto
    console.log('🔄 DUPLICADOS EN EL PROYECTO (excluyendo .venv)');
    console.log('==============================================');
    const duplicateCount = Object.keys(projectDuplicates).length;
    if (duplicateCount > 0) {
        console.log(`⚠️  ${duplicateCount} grupos de archivos duplicados encontrados`);

        let totalSpaceSaved = 0;
        Object.values(projectDuplicates).forEach((dup, index) => {
            console.log(`\n📋 Grupo ${index + 1}:`);
            console.log(`   📄 Original: ${dup.original}`);
            console.log(`   📋 ${dup.count - 1} duplicados:`);
            dup.files.filter(f => f !== dup.original).slice(0, 5).forEach(file => {
                console.log(`      - ${file}`);
            });
            if (dup.files.length > 6) {
                console.log(`      ... y ${dup.files.length - 6} más`);
            }
            totalSpaceSaved += dup.size * (dup.count - 1);
        });

        console.log(`\n💾 Espacio potencial ahorrado: ${(totalSpaceSaved / (1024 * 1024)).toFixed(2)} MB`);
    } else {
        console.log('✅ No se encontraron duplicados críticos en el proyecto');
    }
    console.log();

    // Análisis de constantes
    console.log('⚡ ANÁLISIS DE CONSTANTES DUPLICADAS');
    console.log('===================================');
    const constDuplicateCount = Object.keys(projectConstantsDuplicates).length;
    if (constDuplicateCount > 0) {
        console.log(`🔴 CRÍTICO: ${constDuplicateCount} grupos de constantes físicas duplicadas`);

        Object.values(projectConstantsDuplicates).forEach((dup, index) => {
            console.log(`\n📋 Grupo ${index + 1}:`);
            console.log(`   📊 Aparece en ${dup.count} archivos:`);

            // Mostrar archivos principales (excluyendo archivos de test y configuración)
            const importantFiles = dup.files.filter(file =>
                !file.includes('test-') &&
                !file.includes('-test') &&
                !file.includes('fix-') &&
                !file.includes('debug-') &&
                file.endsWith('.js')
            ).slice(0, 10);

            importantFiles.forEach(file => {
                console.log(`      - ${file}`);
            });

            if (dup.files.length > 10) {
                console.log(`      ... y ${dup.files.length - 10} archivos más`);
            }
        });
    } else {
        console.log('✅ No se encontraron constantes duplicadas críticas');
    }
    console.log();

    // Análisis de archivos grandes
    console.log('📏 ANÁLISIS DE ARCHIVOS GRANDES');
    console.log('==============================');
    if (report.stats?.largestFiles?.length > 0) {
        const criticalFiles = report.stats.largestFiles.filter(f =>
            parseFloat(f.sizeMB) > 5 &&
            !f.path.includes('.venv') &&
            !f.path.includes('node_modules')
        );

        if (criticalFiles.length > 0) {
            console.log(`⚠️  ${criticalFiles.length} archivos críticos (>5MB):`);
            criticalFiles.forEach((file, index) => {
                console.log(`${index + 1}. ${file.path} - ${file.sizeMB} MB`);
            });
        } else {
            console.log('✅ No hay archivos excesivamente grandes');
        }
    }
    console.log();

    // Análisis de estructura de directorios
    console.log('📂 ANÁLISIS DE ESTRUCTURA DE DIRECTORIOS');
    console.log('======================================');
    if (report.stats?.directories) {
        const sortedDirs = Object.entries(report.stats.directories)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 15);

        console.log('Top 15 directorios por cantidad de archivos:');
        sortedDirs.forEach(([dir, count], index) => {
            console.log(`${index + 1}. ${dir}: ${count} archivos`);
        });
    }
    console.log();

    // Problemas críticos identificados
    console.log('🚨 PROBLEMAS CRÍTICOS IDENTIFICADOS');
    console.log('===================================');

    const criticalIssues = [];

    // Problema 1: Constantes duplicadas
    if (constDuplicateCount > 0) {
        const totalFilesWithDupConstants = Object.values(projectConstantsDuplicates)
            .reduce((total, dup) => total + dup.count, 0);
        criticalIssues.push({
            severity: 'CRITICAL',
            issue: 'CONSTANTES FÍSICAS DUPLICADAS',
            description: `${totalFilesWithDupConstants} archivos tienen las mismas constantes físicas repetidas`,
            impact: 'Alto - Afecta mantenibilidad y consistencia del código',
            solution: 'Crear archivo único constants.js y importar en todos los módulos'
        });
    }

    // Problema 2: Archivos duplicados
    if (duplicateCount > 0) {
        criticalIssues.push({
            severity: 'HIGH',
            issue: 'ARCHIVOS COMPLETAMENTE DUPLICADOS',
            description: `${duplicateCount} grupos de archivos idénticos encontrados`,
            impact: 'Medio - Desperdicio de espacio y confusión en mantenimiento',
            solution: 'Eliminar duplicados y crear enlaces simbólicos donde sea necesario'
        });
    }

    // Problema 3: Archivos muy grandes
    if (report.stats?.largestFiles?.some(f => parseFloat(f.sizeMB) > 10)) {
        const hugeFiles = report.stats.largestFiles.filter(f => parseFloat(f.sizeMB) > 10);
        criticalIssues.push({
            severity: 'MEDIUM',
            issue: 'ARCHIVOS EXCESIVAMENTE GRANDES',
            description: `${hugeFiles.length} archivos > 10MB (bases de datos y logs)`,
            impact: 'Bajo - Solo afecta performance de carga',
            solution: 'Implementar rotación de logs y compresión de datos históricos'
        });
    }

    // Problema 4: Estructura de directorios
    const dirCount = report.stats?.directories ? Object.keys(report.stats.directories).length : 0;
    if (dirCount > 50) {
        criticalIssues.push({
            severity: 'MEDIUM',
            issue: 'ESTRUCTURA DE DIRECTORIOS COMPLEJA',
            description: `${dirCount} directorios encontrados`,
            impact: 'Medio - Dificulta navegación y mantenimiento',
            solution: 'Reorganizar en estructura modular más simple'
        });
    }

    if (criticalIssues.length > 0) {
        criticalIssues.forEach((issue, index) => {
            const severityIcon = issue.severity === 'CRITICAL' ? '🔴' :
                               issue.severity === 'HIGH' ? '🟠' : '🟡';
            console.log(`${index + 1}. ${severityIcon} [${issue.severity}] ${issue.issue}`);
            console.log(`   ${issue.description}`);
            console.log(`   💥 Impacto: ${issue.impact}`);
            console.log(`   💡 Solución: ${issue.solution}\n`);
        });
    } else {
        console.log('✅ No se identificaron problemas críticos');
    }

    // Recomendaciones de optimización
    console.log('💡 RECOMENDACIONES DE OPTIMIZACIÓN');
    console.log('==================================');

    const recommendations = [
        {
            priority: 'HIGH',
            action: 'Consolidar constantes físicas',
            description: 'Crear archivo constants.js único con todas las constantes cuánticas',
            effort: '2-3 días',
            benefit: 'Mejor mantenibilidad y consistencia'
        },
        {
            priority: 'HIGH',
            action: 'Eliminar archivos duplicados',
            description: 'Identificar y remover archivos completamente idénticos',
            effort: '1-2 días',
            benefit: 'Reducción de complejidad y espacio'
        },
        {
            priority: 'MEDIUM',
            action: 'Reestructurar directorios',
            description: 'Organizar archivos en estructura modular más clara',
            effort: '3-5 días',
            benefit: 'Mejor navegación y mantenibilidad'
        },
        {
            priority: 'MEDIUM',
            action: 'Optimizar archivos grandes',
            description: 'Implementar rotación de logs y compresión',
            effort: '1 día',
            benefit: 'Mejor performance y menor uso de disco'
        },
        {
            priority: 'LOW',
            action: 'Limpiar directorios vacíos',
            description: 'Eliminar directorios sin contenido',
            effort: '30 minutos',
            benefit: 'Estructura más limpia'
        }
    ];

    recommendations.forEach((rec, index) => {
        const priorityIcon = rec.priority === 'HIGH' ? '🔴' :
                           rec.priority === 'MEDIUM' ? '🟡' : '🟢';
        console.log(`${index + 1}. ${priorityIcon} [${rec.priority}] ${rec.action}`);
        console.log(`   ${rec.description}`);
        console.log(`   ⏱️  Esfuerzo estimado: ${rec.effort}`);
        console.log(`   💎 Beneficio: ${rec.benefit}\n`);
    });

    // Resumen ejecutivo final
    console.log('🎯 RESUMEN EJECUTIVO FINAL');
    console.log('==========================');
    console.log(`📊 Archivos analizados: ${report.stats?.totalFiles || 0}`);
    console.log(`🔄 Duplicados encontrados: ${duplicateCount}`);
    console.log(`⚡ Constantes duplicadas: ${constDuplicateCount}`);
    console.log(`📏 Archivos grandes (>5MB): ${report.stats?.largestFiles?.filter(f => parseFloat(f.sizeMB) > 5).length || 0}`);
    console.log(`📂 Directorios: ${report.stats?.directories ? Object.keys(report.stats.directories).length : 0}`);
    console.log(`🚨 Problemas críticos: ${criticalIssues.length}`);

    const totalSpaceWaste = Object.values(projectDuplicates)
        .reduce((total, dup) => total + (dup.size * (dup.count - 1)), 0);
    console.log(`💾 Espacio desperdiciado: ${(totalSpaceWaste / (1024 * 1024)).toFixed(2)} MB`);

    // Calcular porcentaje de código esencial
    const totalJSFiles = report.stats?.fileTypes?.js || 0;
    const filesWithDupConstants = Object.values(projectConstantsDuplicates)
        .reduce((total, dup) => total + dup.count, 0);
    const essentialCodeRatio = totalJSFiles > 0 ?
        (((totalJSFiles - filesWithDupConstants) / totalJSFiles) * 100).toFixed(1) : 0;

    console.log(`🎯 Código esencial estimado: ${essentialCodeRatio}% del total`);

    console.log('\n✅ Análisis procesado exitosamente!');
}

// Ejecutar el procesamiento
processAnalysisReport();


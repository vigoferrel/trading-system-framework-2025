#!/usr/bin/env node

/**
 * SCRIPT DE RECUPERACIÓN QBTC - EXTRACTOR DE ARCHIVOS ELIMINADOS
 * Script para identificar archivos valiosos eliminados en la refactorización
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración de archivos de prioridad según reglas del proyecto
const priorityPatterns = {
    // ALTA PRIORIDAD (score +4 a +5)
    HIGH_VALUE: [
        /src\/utils\/kernel-rng\.js/,
        /src\/integration.*binance/i,
        /src\/core/i,
        /src\/analysis/i,
        /src\/algorithms/i,
        /.*binance.*\.js$/i
    ],
    
    // MEDIA PRIORIDAD (score +2 a +3)  
    MEDIUM_VALUE: [
        /src\/monitoring/i,
        /src\/config/i,
        /scripts\/automation/i,
        /scripts\/deploy/i,
        /\.env\.example$/,
        /config.*\.js$/,
        /config.*\.json$/
    ],
    
    // EXCLUIR (score -3 a -4)
    EXCLUDE: [
        /test/i,
        /__tests__/i,
        /\.test\./,
        /\.spec\./,
        /fixtures/i,
        /mocks/i,
        /snapshots/i,
        /examples/i,
        /demos/i,
        /kraken/i,
        /bybit/i,
        /kucoin/i
    ]
};

function main() {
    console.log('🔍 Iniciando análisis de archivos eliminados en el commit 3f29ab8...\n');
    
    try {
        // Obtener lista de archivos eliminados
        const gitOutput = execSync('git show --name-status 3f29ab8', { encoding: 'utf8' });
        const deletedFiles = gitOutput
            .split('\n')
            .filter(line => line.startsWith('D\t'))
            .map(line => line.substring(2))
            .filter(file => file.trim().length > 0);
        
        console.log(`📊 Total de archivos eliminados: ${deletedFiles.length}\n`);
        
        // Clasificar archivos por prioridad
        const classified = {
            highValue: [],
            mediumValue: [],
            lowValue: [],
            excluded: []
        };
        
        deletedFiles.forEach(file => {
            const score = calculateFileScore(file);
            
            if (score <= -3) {
                classified.excluded.push({ file, score });
            } else if (score >= 4) {
                classified.highValue.push({ file, score });
            } else if (score >= 2) {
                classified.mediumValue.push({ file, score });
            } else {
                classified.lowValue.push({ file, score });
            }
        });
        
        // Mostrar resumen por categoría
        console.log('📈 CLASIFICACIÓN POR PRIORIDAD:\n');
        
        console.log(`🟢 ALTA PRIORIDAD (score >= 4): ${classified.highValue.length} archivos`);
        classified.highValue
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .forEach(item => console.log(`   [${item.score}] ${item.file}`));
        if (classified.highValue.length > 10) {
            console.log(`   ... y ${classified.highValue.length - 10} más\n`);
        }
        
        console.log(`🟡 MEDIA PRIORIDAD (score 2-3): ${classified.mediumValue.length} archivos`);
        classified.mediumValue
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .forEach(item => console.log(`   [${item.score}] ${item.file}`));
        if (classified.mediumValue.length > 10) {
            console.log(`   ... y ${classified.mediumValue.length - 10} más\n`);
        }
        
        console.log(`⚪ BAJA PRIORIDAD (score 0-1): ${classified.lowValue.length} archivos\n`);
        console.log(`🔴 EXCLUIDOS (score < 0): ${classified.excluded.length} archivos\n`);
        
        // Crear archivos de salida para el proceso de recuperación
        const recoveryDir = './recovery';
        
        // Manifest de candidatos para recuperación
        const candidates = [
            ...classified.highValue.map(item => ({ ...item, priority: 'HIGH' })),
            ...classified.mediumValue.map(item => ({ ...item, priority: 'MEDIUM' }))
        ].sort((a, b) => b.score - a.score);
        
        const manifest = {
            metadata: {
                sourceCommit: '3f29ab8^',
                analysisDate: new Date().toISOString(),
                totalDeleted: deletedFiles.length,
                candidatesForRecovery: candidates.length
            },
            candidates: candidates.map(item => ({
                path: item.file,
                priority: item.priority,
                score: item.score,
                reason: getRecoveryReason(item.file),
                compliance: getComplianceNotes(item.file)
            }))
        };
        
        // Escribir archivos de trabajo
        fs.writeFileSync(
            path.join(recoveryDir, 'deleted_files_all.json'),
            JSON.stringify({ files: deletedFiles, count: deletedFiles.length }, null, 2)
        );
        
        fs.writeFileSync(
            path.join(recoveryDir, 'recovery_manifest.json'),
            JSON.stringify(manifest, null, 2)
        );
        
        // Lista simple para scripts
        const candidatePaths = candidates.map(item => item.file);
        fs.writeFileSync(
            path.join(recoveryDir, 'candidate_paths.txt'),
            candidatePaths.join('\n')
        );
        
        console.log('📁 Archivos de trabajo creados:');
        console.log('   • recovery/deleted_files_all.json - Lista completa');
        console.log('   • recovery/recovery_manifest.json - Manifest detallado');
        console.log('   • recovery/candidate_paths.txt - Lista simple para scripts\n');
        
        console.log(`🎯 RECOMENDACIÓN: Revisar los ${Math.min(20, candidates.length)} archivos de mayor prioridad manualmente`);
        console.log('   Use: git show 3f29ab8^:RUTA_ARCHIVO para inspeccionar contenido\n');
        
        // Mostrar top candidatos para revisión manual
        console.log('📋 TOP CANDIDATOS PARA RECUPERACIÓN:');
        candidates.slice(0, 15).forEach((item, i) => {
            console.log(`${(i+1).toString().padStart(2, ' ')}. [${item.score}] ${item.file}`);
            console.log(`    └─ ${item.reason}`);
        });
        
    } catch (error) {
        console.error('❌ Error ejecutando análisis:', error.message);
        process.exit(1);
    }
}

function calculateFileScore(filePath) {
    let score = 0;
    
    // Puntuaciones positivas
    if (priorityPatterns.HIGH_VALUE.some(pattern => pattern.test(filePath))) {
        score += 5;
    }
    if (priorityPatterns.MEDIUM_VALUE.some(pattern => pattern.test(filePath))) {
        score += 3;
    }
    
    // Penalizaciones
    if (priorityPatterns.EXCLUDE.some(pattern => pattern.test(filePath))) {
        score -= 4;
    }
    
    // Bonificaciones específicas por reglas del proyecto
    if (filePath.includes('binance')) score += 2;  // Binance como fuente única
    if (filePath.includes('kernel-rng')) score += 3;  // RNG determinista
    if (filePath.includes('background') || filePath.includes('metrics')) score += 1; // Segundo plano
    
    // Penalizaciones por archivos no relevantes
    if (filePath.includes('freqtrade')) score -= 5;
    if (filePath.includes('VigoFutures') && !filePath.includes('binance')) score -= 3;
    if (filePath.endsWith('.py') && !filePath.includes('binance')) score -= 2;
    if (filePath.endsWith('.bat') || filePath.endsWith('.ps1')) score -= 1;
    
    return score;
}

function getRecoveryReason(filePath) {
    if (filePath.includes('kernel-rng')) return 'Generador RNG determinista (regla crítica del proyecto)';
    if (filePath.includes('binance')) return 'Integración Binance (fuente única de datos)';
    if (filePath.includes('src/core')) return 'Componente central del sistema';
    if (filePath.includes('src/analysis') || filePath.includes('algorithms')) return 'Algoritmos de análisis';
    if (filePath.includes('monitoring')) return 'Sistema de monitoreo (segundo plano)';
    if (filePath.includes('config')) return 'Configuración del sistema';
    if (filePath.includes('scripts/automation')) return 'Automatización de deployment';
    return 'Funcionalidad potencialmente crítica';
}

function getComplianceNotes(filePath) {
    const notes = [];
    if (filePath.includes('binance')) notes.push('✓ Cumple regla Binance-first');
    if (filePath.includes('kernel-rng') || filePath.includes('rng')) notes.push('✓ Cumple regla no-Math.random');
    if (filePath.includes('background') || filePath.includes('metrics')) notes.push('✓ Cumple regla segundo plano');
    if (notes.length === 0) notes.push('⚠ Verificar cumplimiento de reglas');
    return notes.join(', ');
}

if (require.main === module) {
    main();
}

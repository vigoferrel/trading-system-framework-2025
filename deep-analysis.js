#!/usr/bin/env node

/**
 * Script de Análisis Profundo - QBTC Trading System
 * Investigación exhaustiva de la estructura del proyecto
 * Identifica duplicados, redundancias y áreas de optimización
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuración del análisis
const PROJECT_ROOT = path.resolve('.');
const EXCLUDE_DIRS = [
    'node_modules',
    '__pycache__',
    '.git',
    'coverage',
    'logs',
    'cache'
];

const EXCLUDE_FILES = [
    '.DS_Store',
    'Thumbs.db',
    'package-lock.json',
    '.gitignore',
    '.cursorignore'
];

// Resultados del análisis
let analysis = {
    summary: {},
    duplicates: {},
    fileStats: {},
    codePatterns: {},
    dependencies: {},
    recommendations: []
};

/**
 * Calcula hash MD5 de un archivo para detectar duplicados
 */
function getFileHash(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return crypto.createHash('md5').update(content).digest('hex');
    } catch (error) {
        return null;
    }
}

/**
 * Analiza el contenido de un archivo JavaScript
 */
function analyzeJSFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const stats = {
            lines: content.split('\n').length,
            size: Buffer.byteLength(content, 'utf8'),
            functions: 0,
            constants: 0,
            imports: 0,
            exports: 0,
            comments: 0,
            emptyLines: 0
        };

        // Contar elementos del código
        const lines = content.split('\n');
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed === '') stats.emptyLines++;
            else if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) stats.comments++;
            else if (trimmed.includes('function ') || trimmed.includes('=>')) stats.functions++;
            else if (trimmed.includes('const ') || trimmed.includes('let ')) stats.constants++;
            else if (trimmed.includes('require(') || trimmed.includes('import ')) stats.imports++;
            else if (trimmed.includes('module.exports') || trimmed.includes('export ')) stats.exports++;
        });

        return stats;
    } catch (error) {
        return null;
    }
}

/**
 * Busca constantes duplicadas en archivos
 */
function findDuplicateConstants() {
    const constants = {};
    const files = [];

    function scanDirectory(dirPath) {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!EXCLUDE_DIRS.includes(item)) {
                    scanDirectory(fullPath);
                }
            } else if (stat.isFile() && path.extname(item) === '.js' && !EXCLUDE_FILES.includes(item)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const relativePath = path.relative(PROJECT_ROOT, fullPath);
                    files.push({ path: relativePath, content, fullPath });

                    // Buscar constantes físicas
                    const constMatches = content.match(/const\s+PHYSICAL_CONSTANTS\s*=\s*\{[\s\S]*?\};/g);
                    if (constMatches) {
                        constMatches.forEach(match => {
                            const hash = crypto.createHash('md5').update(match).digest('hex');
                            if (!constants[hash]) {
                                constants[hash] = { content: match, files: [] };
                            }
                            constants[hash].files.push(relativePath);
                        });
                    }
                } catch (error) {
                    console.warn(`Error leyendo ${fullPath}: ${error.message}`);
                }
            }
        }
    }

    scanDirectory(PROJECT_ROOT);

    // Identificar constantes duplicadas
    const duplicates = {};
    Object.entries(constants).forEach(([hash, data]) => {
        if (data.files.length > 1) {
            duplicates[hash] = {
                content: data.content.substring(0, 100) + '...',
                files: data.files,
                count: data.files.length
            };
        }
    });

    return { constants, duplicates, totalFiles: files.length };
}

/**
 * Analiza dependencias del proyecto
 */
function analyzeDependencies() {
    const deps = {
        packageJson: {},
        actualUsage: {},
        unused: [],
        duplicates: []
    };

    // Leer package.json
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        deps.packageJson = {
            dependencies: Object.keys(packageJson.dependencies || {}),
            devDependencies: Object.keys(packageJson.devDependencies || {}),
            total: Object.keys(packageJson.dependencies || {}).length + Object.keys(packageJson.devDependencies || {}).length
        };
    } catch (error) {
        console.warn('No se pudo leer package.json');
    }

    return deps;
}

/**
 * Busca patrones de código repetitivo
 */
function findCodePatterns() {
    const patterns = {
        imports: {},
        functions: {},
        constants: {},
        configurations: {}
    };

    function scanForPatterns(dirPath) {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!EXCLUDE_DIRS.includes(item)) {
                    scanForPatterns(fullPath);
                }
            } else if (stat.isFile() && path.extname(item) === '.js' && !EXCLUDE_FILES.includes(item)) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const relativePath = path.relative(PROJECT_ROOT, fullPath);

                    // Buscar patrones comunes
                    const importMatches = content.match(/require\(['"`]([^'"`]+)['"`]\)/g) || [];
                    importMatches.forEach(match => {
                        const module = match.match(/require\(['"`]([^'"`]+)['"`]\)/)[1];
                        if (!patterns.imports[module]) patterns.imports[module] = [];
                        patterns.imports[module].push(relativePath);
                    });

                    // Buscar funciones comunes
                    const funcMatches = content.match(/function\s+(\w+)/g) || [];
                    funcMatches.forEach(match => {
                        const funcName = match.match(/function\s+(\w+)/)[1];
                        if (!patterns.functions[funcName]) patterns.functions[funcName] = [];
                        patterns.functions[funcName].push(relativePath);
                    });

                } catch (error) {
                    console.warn(`Error analizando ${fullPath}: ${error.message}`);
                }
            }
        }
    }

    scanForPatterns(PROJECT_ROOT);
    return patterns;
}

/**
 * Genera estadísticas generales del proyecto
 */
function generateProjectStats() {
    const stats = {
        totalFiles: 0,
        totalLines: 0,
        fileTypes: {},
        largestFiles: [],
        directories: {},
        emptyDirectories: []
    };

    function scanStats(dirPath, depth = 0) {
        const items = fs.readdirSync(dirPath);

        if (items.length === 0) {
            stats.emptyDirectories.push(path.relative(PROJECT_ROOT, dirPath));
        }

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!EXCLUDE_DIRS.includes(item)) {
                    const relativeDir = path.relative(PROJECT_ROOT, fullPath);
                    stats.directories[relativeDir] = stats.directories[relativeDir] || 0;
                    stats.directories[relativeDir]++;
                    scanStats(fullPath, depth + 1);
                }
            } else if (stat.isFile()) {
                const ext = path.extname(item);
                stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1;
                stats.totalFiles++;

                // Estadísticas de archivos grandes
                if (stat.size > 1024 * 1024) { // > 1MB
                    stats.largestFiles.push({
                        path: path.relative(PROJECT_ROOT, fullPath),
                        size: stat.size,
                        sizeMB: (stat.size / (1024 * 1024)).toFixed(2)
                    });
                }

                // Contar líneas en archivos de código
                if (['.js', '.py', '.json', '.md', '.html', '.css'].includes(ext)) {
                    try {
                        const content = fs.readFileSync(fullPath, 'utf8');
                        const lines = content.split('\n').length;
                        stats.totalLines += lines;
                    } catch (error) {
                        // Ignorar errores de lectura
                    }
                }
            }
        }
    }

    scanStats(PROJECT_ROOT);

    // Ordenar archivos más grandes
    stats.largestFiles.sort((a, b) => b.size - a.size);
    stats.largestFiles = stats.largestFiles.slice(0, 10);

    return stats;
}

/**
 * Genera recomendaciones basadas en el análisis
 */
function generateRecommendations(analysis) {
    const recommendations = [];

    // Recomendaciones basadas en duplicados
    if (Object.keys(analysis.duplicates).length > 0) {
        recommendations.push({
            priority: 'HIGH',
            category: 'DUPLICATES',
            title: 'Eliminar archivos duplicados',
            description: `${Object.keys(analysis.duplicates).length} grupos de archivos duplicados encontrados`,
            action: 'Consolidar archivos idénticos y crear enlaces simbólicos o imports compartidos'
        });
    }

    // Recomendaciones basadas en constantes duplicadas
    const duplicateConstants = Object.values(analysis.duplicateConstants?.duplicates || {}).length;
    if (duplicateConstants > 0) {
        recommendations.push({
            priority: 'HIGH',
            category: 'CONSTANTS',
            title: 'Consolidar constantes físicas duplicadas',
            description: `${duplicateConstants} grupos de constantes físicas duplicadas`,
            action: 'Crear un archivo único de constantes y importar desde todos los módulos'
        });
    }

    // Recomendaciones basadas en dependencias
    if (analysis.dependencies?.packageJson?.total > 20) {
        recommendations.push({
            priority: 'MEDIUM',
            category: 'DEPENDENCIES',
            title: 'Revisar dependencias excesivas',
            description: `${analysis.dependencies.packageJson.total} dependencias totales`,
            action: 'Auditar dependencias y eliminar paquetes no utilizados'
        });
    }

    // Recomendaciones basadas en archivos grandes
    if (analysis.stats?.largestFiles?.length > 0) {
        const largeFiles = analysis.stats.largestFiles.filter(f => parseFloat(f.sizeMB) > 2);
        if (largeFiles.length > 0) {
            recommendations.push({
                priority: 'MEDIUM',
                category: 'PERFORMANCE',
                title: 'Optimizar archivos grandes',
                description: `${largeFiles.length} archivos > 2MB`,
                action: 'Dividir archivos grandes en módulos más pequeños'
            });
        }
    }

    // Recomendaciones basadas en directorios vacíos
    if (analysis.stats?.emptyDirectories?.length > 0) {
        recommendations.push({
            priority: 'LOW',
            category: 'CLEANUP',
            title: 'Eliminar directorios vacíos',
            description: `${analysis.stats.emptyDirectories.length} directorios vacíos`,
            action: 'Eliminar directorios sin contenido'
        });
    }

    return recommendations;
}

/**
 * Ejecuta el análisis completo
 */
async function runDeepAnalysis() {
    console.log('🔬 INICIANDO ANÁLISIS PROFUNDO DEL PROYECTO QBTC');
    console.log('================================================\n');

    console.log('📊 Generando estadísticas generales...');
    analysis.stats = generateProjectStats();

    console.log('🔍 Buscando archivos duplicados...');
    analysis.duplicateConstants = findDuplicateConstants();

    console.log('📦 Analizando dependencias...');
    analysis.dependencies = analyzeDependencies();

    console.log('🔎 Identificando patrones de código...');
    analysis.codePatterns = findCodePatterns();

    console.log('💡 Generando recomendaciones...');
    analysis.recommendations = generateRecommendations(analysis);

    // Calcular duplicados por hash de archivo completo
    console.log('🗂️  Calculando hashes de archivos para detectar duplicados completos...');
    const fileHashes = {};
    const allFiles = [];

    function collectFiles(dirPath) {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!EXCLUDE_DIRS.includes(item)) {
                    collectFiles(fullPath);
                }
            } else if (stat.isFile() && !EXCLUDE_FILES.includes(item)) {
                const hash = getFileHash(fullPath);
                if (hash) {
                    const relativePath = path.relative(PROJECT_ROOT, fullPath);
                    allFiles.push({ path: relativePath, hash, size: stat.size });

                    if (!fileHashes[hash]) {
                        fileHashes[hash] = [];
                    }
                    fileHashes[hash].push(relativePath);
                }
            }
        }
    }

    collectFiles(PROJECT_ROOT);

    // Identificar archivos completamente duplicados
    analysis.duplicates = {};
    Object.entries(fileHashes).forEach(([hash, files]) => {
        if (files.length > 1) {
            // Encontrar el archivo más pequeño (probablemente el original)
            const fileDetails = allFiles.filter(f => files.includes(f.path));
            const original = fileDetails.reduce((min, curr) => curr.size < min.size ? curr : min);

            analysis.duplicates[hash] = {
                files: files,
                count: files.length,
                original: original.path,
                size: original.size
            };
        }
    });

    return analysis;
}

/**
 * Genera el reporte final
 */
function generateReport(analysis) {
    console.log('\n📋 REPORTE DE ANÁLISIS PROFUNDO');
    console.log('=================================\n');

    // Estadísticas generales
    console.log('📊 ESTADÍSTICAS GENERALES');
    console.log('-------------------------');
    console.log(`Total de archivos: ${analysis.stats.totalFiles}`);
    console.log(`Total de líneas de código: ${analysis.stats.totalLines.toLocaleString()}`);
    console.log(`Directorios analizados: ${Object.keys(analysis.stats.directories).length}`);
    console.log(`Tipos de archivo encontrados: ${Object.keys(analysis.stats.fileTypes).length}`);
    console.log();

    // Tipos de archivo
    console.log('📁 DISTRIBUCIÓN POR TIPO DE ARCHIVO');
    console.log('-----------------------------------');
    Object.entries(analysis.stats.fileTypes)
        .sort(([,a], [,b]) => b - a)
        .forEach(([ext, count]) => {
            console.log(`${ext || 'Sin extensión'}: ${count} archivos`);
        });
    console.log();

    // Archivos más grandes
    if (analysis.stats.largestFiles.length > 0) {
        console.log('📏 ARCHIVOS MÁS GRANDES (> 1MB)');
        console.log('-------------------------------');
        analysis.stats.largestFiles.forEach((file, index) => {
            console.log(`${index + 1}. ${file.path} - ${file.sizeMB} MB`);
        });
        console.log();
    }

    // Duplicados
    console.log('🔄 ARCHIVOS COMPLETAMENTE DUPLICADOS');
    console.log('-----------------------------------');
    const duplicateGroups = Object.keys(analysis.duplicates).length;
    if (duplicateGroups > 0) {
        console.log(`⚠️  ${duplicateGroups} grupos de archivos duplicados encontrados`);
        console.log(`💾 Espacio potencial ahorrado: ${Object.values(analysis.duplicates).reduce((total, dup) => {
            return total + (dup.size * (dup.count - 1));
        }, 0) / (1024 * 1024).toFixed(2)} MB`);

        let count = 1;
        Object.values(analysis.duplicates).forEach(dup => {
            console.log(`\nGrupo ${count++}:`);
            console.log(`  📄 Original: ${dup.original}`);
            console.log(`  📋 Duplicados (${dup.count - 1}):`);
            dup.files.filter(f => f !== dup.original).forEach(file => {
                console.log(`    - ${file}`);
            });
        });
    } else {
        console.log('✅ No se encontraron archivos completamente duplicados');
    }
    console.log();

    // Constantes duplicadas
    console.log('⚡ CONSTANTES FÍSICAS DUPLICADAS');
    console.log('-------------------------------');
    const constDuplicates = Object.keys(analysis.duplicateConstants.duplicates).length;
    if (constDuplicates > 0) {
        console.log(`⚠️  ${constDuplicates} grupos de constantes físicas duplicadas`);
        console.log(`📊 Total de archivos con constantes: ${analysis.duplicateConstants.totalFiles}`);

        let count = 1;
        Object.values(analysis.duplicateConstants.duplicates).forEach(dup => {
            console.log(`\nGrupo ${count++}:`);
            console.log(`  📋 Aparece en ${dup.count} archivos:`);
            dup.files.forEach(file => {
                console.log(`    - ${file}`);
            });
        });
    } else {
        console.log('✅ No se encontraron constantes duplicadas');
    }
    console.log();

    // Dependencias
    console.log('📦 ANÁLISIS DE DEPENDENCIAS');
    console.log('--------------------------');
    if (analysis.dependencies.packageJson.total > 0) {
        console.log(`Dependencias de producción: ${analysis.dependencies.packageJson.dependencies.length}`);
        console.log(`Dependencias de desarrollo: ${analysis.dependencies.packageJson.devDependencies.length}`);
        console.log(`Total de dependencias: ${analysis.dependencies.packageJson.total}`);
    } else {
        console.log('No se pudo analizar package.json');
    }
    console.log();

    // Directorios vacíos
    if (analysis.stats.emptyDirectories.length > 0) {
        console.log('📂 DIRECTORIOS VACÍOS');
        console.log('--------------------');
        console.log(`⚠️  ${analysis.stats.emptyDirectories.length} directorios vacíos encontrados:`);
        analysis.stats.emptyDirectories.forEach(dir => {
            console.log(`  - ${dir}`);
        });
        console.log();
    }

    // Recomendaciones
    console.log('💡 RECOMENDACIONES DE OPTIMIZACIÓN');
    console.log('----------------------------------');
    if (analysis.recommendations.length > 0) {
        analysis.recommendations.forEach((rec, index) => {
            const priorityIcon = rec.priority === 'HIGH' ? '🔴' : rec.priority === 'MEDIUM' ? '🟡' : '🟢';
            console.log(`${index + 1}. ${priorityIcon} [${rec.category}] ${rec.title}`);
            console.log(`   ${rec.description}`);
            console.log(`   💡 ${rec.action}\n`);
        });
    } else {
        console.log('✅ No se identificaron problemas críticos');
    }

    // Resumen ejecutivo
    console.log('🎯 RESUMEN EJECUTIVO');
    console.log('===================');
    console.log(`📊 Proyecto analizado: ${analysis.stats.totalFiles} archivos`);
    console.log(`🔄 Duplicados encontrados: ${Object.keys(analysis.duplicates).length} grupos`);
    console.log(`⚡ Constantes duplicadas: ${Object.keys(analysis.duplicateConstants.duplicates).length} grupos`);
    console.log(`📏 Archivos grandes (>1MB): ${analysis.stats.largestFiles.length}`);
    console.log(`📂 Directorios vacíos: ${analysis.stats.emptyDirectories.length}`);
    console.log(`💾 Espacio potencial ahorrado: ${Object.values(analysis.duplicates).reduce((total, dup) => {
        return total + (dup.size * (dup.count - 1));
    }, 0) / (1024 * 1024).toFixed(2)} MB`);
}

// Ejecutar análisis
runDeepAnalysis().then(analysis => {
    generateReport(analysis);

    // Guardar resultados en archivo JSON
    const outputFile = path.join(PROJECT_ROOT, 'deep-analysis-report.json');
    fs.writeFileSync(outputFile, JSON.stringify(analysis, null, 2));
    console.log(`\n💾 Reporte guardado en: ${outputFile}`);

    console.log('\n✅ Análisis profundo completado exitosamente!');
}).catch(error => {
    console.error('❌ Error durante el análisis:', error);
    process.exit(1);
});


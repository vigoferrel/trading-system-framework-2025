#!/usr/bin/env node

/**
 * Script para encontrar archivos con constantes duplicadas
 * que necesitan ser actualizadas para usar el sistema centralizado
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DuplicateConstantsFinder {
    constructor() {
        this.duplicatePatterns = [
            // Patrones de constantes Z_REAL y Z_IMAG
            /Z_REAL\s*[:=]\s*9/g,
            /Z_IMAG\s*[:=]\s*16/g,

            // Patrones de LAMBDA_7919 y variantes
            /LAMBDA_7919\s*[:=]\s*Math\.log\(7919\)/g,
            /LAMBDA_LOG_7919\s*[:=]\s*Math\.log\(7919\)/g,
            /LOG_7919\s*[:=]\s*Math\.log\(7919\)/g,

            // Patrones de PHI y variantes
            /PHI\s*[:=]\s*\(1\s*\+\s*Math\.sqrt\(5\)\)\s*\/\s*2/g,
            /PHI_GOLDEN\s*[:=]\s*\(1\s*\+\s*Math\.sqrt\(5\)\)\s*\/\s*2/g,

            // Patrones de RESONANCE_FREQ
            /RESONANCE_FREQ\s*[:=]\s*888/g,
            /LAMBDA_888_MHZ\s*[:=]\s*888/g,
            /FREQ_88MHZ\s*[:=]\s*888/g,

            // Patrones de constantes Feynman
            /FEYNMAN_Z_REAL\s*[:=]\s*9/g,
            /FEYNMAN_Z_IMAG\s*[:=]\s*16/g,
        ];

        this.excludePatterns = [
            /node_modules/,
            /\.git/,
            /src\/constants\/quantum-constants\.js/,
            /scripts\/find-duplicate-constants\.js/
        ];
    }

    /**
     * Busca archivos con constantes duplicadas
     */
    findDuplicateFiles() {
        console.log('🔍 [DUPLICATE FINDER] Buscando archivos con constantes duplicadas...\n');

        const results = {
            files: [],
            totalDuplicates: 0,
            byPattern: {}
        };

        // Obtener todos los archivos JavaScript
        const jsFiles = this.getAllJSFiles('.');

        jsFiles.forEach(filePath => {
            const duplicates = this.scanFileForDuplicates(filePath);
            if (duplicates.length > 0) {
                results.files.push({
                    path: filePath,
                    duplicates: duplicates
                });
                results.totalDuplicates += duplicates.length;

                // Contar por patrón
                duplicates.forEach(dup => {
                    const pattern = dup.pattern;
                    if (!results.byPattern[pattern]) {
                        results.byPattern[pattern] = 0;
                    }
                    results.byPattern[pattern]++;
                });
            }
        });

        return results;
    }

    /**
     * Obtiene todos los archivos JavaScript en el directorio
     */
    getAllJSFiles(dir) {
        const files = [];

        function scanDirectory(currentDir) {
            const items = fs.readdirSync(currentDir);

            items.forEach(item => {
                const fullPath = path.join(currentDir, item);
                const stat = fs.statSync(fullPath);

                // Verificar si debe ser excluido
                const shouldExclude = this.excludePatterns.some(pattern =>
                    pattern.test(fullPath)
                );

                if (shouldExclude) {
                    return;
                }

                if (stat.isDirectory()) {
                    scanDirectory.call(this, fullPath);
                } else if (item.endsWith('.js')) {
                    files.push(fullPath);
                }
            });
        }

        scanDirectory.call(this, dir);
        return files;
    }

    /**
     * Escanea un archivo en busca de constantes duplicadas
     */
    scanFileForDuplicates(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const duplicates = [];

            this.duplicatePatterns.forEach((pattern, index) => {
                const matches = content.match(pattern);
                if (matches) {
                    duplicates.push({
                        pattern: pattern.source,
                        matches: matches.length,
                        lines: this.findLineNumbers(content, pattern)
                    });
                }
            });

            return duplicates;
        } catch (error) {
            console.warn(`⚠️  Error leyendo archivo ${filePath}:`, error.message);
            return [];
        }
    }

    /**
     * Encuentra los números de línea donde aparecen las coincidencias
     */
    findLineNumbers(content, pattern) {
        const lines = content.split('\n');
        const lineNumbers = [];

        lines.forEach((line, index) => {
            if (pattern.test(line)) {
                lineNumbers.push(index + 1);
            }
        });

        return lineNumbers;
    }

    /**
     * Genera un reporte de los archivos encontrados
     */
    generateReport(results) {
        console.log('📋 [REPORT] Archivos con constantes duplicadas encontrados:\n');

        if (results.files.length === 0) {
            console.log('✅ ¡Excelente! No se encontraron archivos con constantes duplicadas.');
            return;
        }

        console.log(`📊 Total de archivos afectados: ${results.files.length}`);
        console.log(`🔢 Total de duplicados encontrados: ${results.totalDuplicates}\n`);

        // Mostrar resumen por patrón
        console.log('📈 Resumen por tipo de constante:');
        Object.entries(results.byPattern).forEach(([pattern, count]) => {
            console.log(`  • ${pattern}: ${count} ocurrencias`);
        });

        console.log('\n📁 Archivos que necesitan actualización:');

        results.files.forEach((file, index) => {
            console.log(`\n${index + 1}. ${file.path}`);
            file.duplicates.forEach(dup => {
                console.log(`   📍 Patrón: ${dup.pattern}`);
                console.log(`   🔢 Ocurrencias: ${dup.matches}`);
                console.log(`   📍 Líneas: ${dup.lines.join(', ')}`);
            });
        });

        console.log('\n💡 RECOMENDACIONES:');
        console.log('1. Actualizar imports para usar: const { QuantumConstants } = require(\'../src/constants/quantum-constants\');');
        console.log('2. Reemplazar constantes locales con referencias a QuantumConstants');
        console.log('3. Mantener extensiones específicas del módulo si son necesarias');
        console.log('4. Ejecutar tests después de cada actualización');

        return results;
    }

    /**
     * Ejecuta el análisis completo
     */
    run() {
        try {
            const results = this.findDuplicateFiles();
            this.generateReport(results);
            return results;
        } catch (error) {
            console.error('❌ Error ejecutando análisis de duplicados:', error);
            process.exit(1);
        }
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    const finder = new DuplicateConstantsFinder();
    finder.run();
}

module.exports = DuplicateConstantsFinder;
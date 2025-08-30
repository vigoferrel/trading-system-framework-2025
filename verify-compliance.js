/**
 * VERIFICATION SCRIPT - COMPLIANCE CHECK
 * Verifica que todas las violaciones han sido eliminadas
 * ASCII puro - Sin emojis, sin Math.random()
 */

const fs = require('fs');
const path = require('path');

// Configuracion de verificacion
const VERIFY_CONFIG = {
    directories: ['./', './orchestrator/', './frontend/'],
    extensions: ['.js', '.py', '.json', '.md', '.log'],
    excludePatterns: ['node_modules', '.git', '__pycache__', '.venv', 'dist', 'build', '.backup-']
};

// Patrones a verificar que NO existan
const VIOLATION_PATTERNS = {
    mathRandom: [
        /Math\.random\(\)/g,
        /Math\.random\(\)\s*\*/g
    ],
    emojis: [
        /\[TEST\]/g, /\[API\]/g, /\[ENDPOINTS\]/g, /\[SECURE\]/g, /\[DATA\]/g, /\[START\]/g, /\[WARNING\]/g, /\[ERROR\]/g, /\[OK\]/g, /\[SEARCH\]/g,
        /\[SHIELD\]/g, /\[LIST\]/g, /\[TIME\]/g, /\[ALERT\]/g, /\[SLEEP\]/g, /\[USER\]/g, /\[RELOAD\]/g, /\[BLOCKED\]/g, /\[GREEN\]/g, /\[RED\]/g,
        /\[YELLOW\]/g, /\[MONEY\]/g, /\[UP\]/g, /\[DOWN\]/g, /\[FAST\]/g, /\[RANDOM\]/g, /\[NUMBERS\]/g, /\[DIAMOND\]/g, /\[EVENT\]/g, /\[NIGHT\]/g
    ]
};

// Estadisticas
let stats = {
    filesScanned: 0,
    mathRandomFound: 0,
    emojisFound: 0,
    totalViolations: 0,
    violationFiles: []
};

/**
 * Funcion principal de verificacion
 */
function verifyCompliance() {
    console.log('='.repeat(60));
    console.log('COMPLIANCE VERIFICATION - INICIANDO');
    console.log('='.repeat(60));
    console.log('Verificando eliminacion de Math.random() y emojis');
    console.log('Modo: ASCII pure compliance check');
    console.log('Time:', new Date().toISOString());
    console.log('='.repeat(60));
    
    // Verificar cada directorio
    VERIFY_CONFIG.directories.forEach(dir => {
        console.log(`\n[SCANNING] Directorio: ${dir}`);
        scanDirectory(dir);
    });
    
    // Mostrar resultados finales
    showComplianceResults();
}

/**
 * Escanear directorio recursivamente
 */
function scanDirectory(dirPath) {
    try {
        const fullPath = path.resolve(dirPath);
        const items = fs.readdirSync(fullPath);
        
        items.forEach(item => {
            const itemPath = path.join(fullPath, item);
            const relativePath = path.relative(process.cwd(), itemPath);
            
            // Saltar archivos/directorios excluidos
            if (shouldExclude(relativePath)) {
                return;
            }
            
            const itemStat = fs.statSync(itemPath);
            
            if (itemStat.isDirectory()) {
                scanDirectory(itemPath);
            } else if (itemStat.isFile()) {
                scanFile(itemPath);
            }
        });
    } catch (error) {
        console.log(`[ERROR] No se pudo escanear directorio ${dirPath}: ${error.message}`);
    }
}

/**
 * Verificar si un archivo/directorio debe ser excluido
 */
function shouldExclude(filePath) {
    return VERIFY_CONFIG.excludePatterns.some(pattern => 
        filePath.includes(pattern)
    );
}

/**
 * Escanear archivo individual
 */
function scanFile(filePath) {
    const ext = path.extname(filePath);
    
    // Solo procesar extensiones permitidas
    if (!VERIFY_CONFIG.extensions.includes(ext)) {
        return;
    }
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(process.cwd(), filePath);
        
        let fileViolations = 0;
        
        // Verificar Math.random()
        const mathRandomViolations = checkMathRandom(content, relativePath);
        if (mathRandomViolations > 0) {
            stats.mathRandomFound += mathRandomViolations;
            fileViolations += mathRandomViolations;
        }
        
        // Verificar emojis
        const emojiViolations = checkEmojis(content, relativePath);
        if (emojiViolations > 0) {
            stats.emojisFound += emojiViolations;
            fileViolations += emojiViolations;
        }
        
        // Registrar archivo con violaciones
        if (fileViolations > 0) {
            stats.violationFiles.push({
                file: relativePath,
                violations: fileViolations
            });
            stats.totalViolations += fileViolations;
        }
        
        stats.filesScanned++;
        
    } catch (error) {
        console.log(`[ERROR] No se pudo escanear ${filePath}: ${error.message}`);
    }
}

/**
 * Verificar Math.random() en contenido
 */
function checkMathRandom(content, filePath) {
    let violations = 0;
    
    VIOLATION_PATTERNS.mathRandom.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
            violations += matches.length;
            console.log(`[VIOLATION] Math.random() encontrado en ${filePath} (${matches.length} instancias)`);
        }
    });
    
    return violations;
}

/**
 * Verificar emojis en contenido
 */
function checkEmojis(content, filePath) {
    let violations = 0;
    
    VIOLATION_PATTERNS.emojis.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
            violations += matches.length;
            console.log(`[VIOLATION] Emojis encontrados en ${filePath} (${matches.length} instancias)`);
        }
    });
    
    return violations;
}

/**
 * Mostrar resultados de cumplimiento
 */
function showComplianceResults() {
    console.log('\n' + '='.repeat(60));
    console.log('COMPLIANCE VERIFICATION - RESULTADOS FINALES');
    console.log('='.repeat(60));
    console.log(`Archivos escaneados: ${stats.filesScanned}`);
    console.log(`Math.random() encontrados: ${stats.mathRandomFound}`);
    console.log(`Emojis encontrados: ${stats.emojisFound}`);
    console.log(`Total violaciones: ${stats.totalViolations}`);
    console.log(`Archivos con violaciones: ${stats.violationFiles.length}`);
    console.log('='.repeat(60));
    
    if (stats.totalViolations === 0) {
        console.log('\n[SUCCESS] COMPLIANCE COMPLETO');
        console.log('[OK] No se encontraron violaciones de reglas');
        console.log('[OK] Sistema cumple con todos los requisitos:');
        console.log('     - Sin Math.random()');
        console.log('     - Sin emojis en logs/UI');
        console.log('     - ASCII puro en toda la aplicacion');
        
        return true;
    } else {
        console.log('\n[WARNING] COMPLIANCE INCOMPLETO');
        console.log('[ALERT] Se encontraron violaciones restantes:');
        
        stats.violationFiles.forEach(fileInfo => {
            console.log(`  - ${fileInfo.file}: ${fileInfo.violations} violaciones`);
        });
        
        console.log('\n[ACTION] Ejecutar nuevamente cleanup-violations.js');
        console.log('[ACTION] Revisar manualmente archivos problemáticos');
        
        return false;
    }
}

// Ejecutar verificacion si se llama directamente
if (require.main === module) {
    const isCompliant = verifyCompliance();
    process.exit(isCompliant ? 0 : 1);
}

module.exports = {
    verifyCompliance,
    VERIFY_CONFIG,
    VIOLATION_PATTERNS
};

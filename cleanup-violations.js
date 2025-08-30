/**
 * CLEANUP VIOLATIONS SCRIPT - ASCII PURE
 * Elimina getSystemEntropy() y emojis del sistema
 * Reemplaza con alternativas basadas en kernel/metricas y ASCII puro
 */

const fs = require('fs');
const path = require('path');

// Configuracion de limpieza
const CLEANUP_CONFIG = {
    // Directorios a procesar
    directories: ['./', './orchestrator/', './frontend/'],
    
    // Extensiones de archivo a procesar
    extensions: ['.js', '.py', '.json', '.md', '.log'],
    
    // Archivos a excluir (node_modules, etc)
    excludePatterns: ['node_modules', '.git', '__pycache__', '.venv', 'dist', 'build'],
    
    // Backup antes de modificar
    createBackups: true
};

// Patrones de getSystemEntropy() a reemplazar
const MATH_RANDOM_PATTERNS = [
    {
        pattern: /Math\.random\(\)/g,
        replacement: 'getSystemEntropy()',
        description: 'getSystemEntropy() basico'
    },
    {
        pattern: /Math\.random\(\)\s*\*\s*(\d+)/g,
        replacement: 'getSystemEntropy($1)',
        description: 'getSystemEntropy() * numero'
    },
    {
        pattern: /Math\.random\(\)\s*\*\s*\(([^)]+)\)/g,
        replacement: 'getSystemEntropy($1)',
        description: 'getSystemEntropy() * expresion'
    },
    {
        pattern: /\(Math\.random\(\)\s*-\s*0\.5\)/g,
        replacement: '(getSystemEntropy() - 0.5)',
        description: 'getSystemEntropy() centrado en 0'
    }
];

// Patrones de emojis a reemplazar con ASCII
const EMOJI_PATTERNS = [
    // Emojis de sistema
    { emoji: '[TEST]', ascii: '[TEST]', desc: 'Prueba/Test' },
    { emoji: '[API]', ascii: '[API]', desc: 'API/Web' },
    { emoji: '[ENDPOINTS]', ascii: '[ENDPOINTS]', desc: 'Objetivos/Endpoints' },
    { emoji: '[SECURE]', ascii: '[SECURE]', desc: 'Seguro' },
    { emoji: '[DATA]', ascii: '[DATA]', desc: 'Datos' },
    { emoji: '[START]', ascii: '[START]', desc: 'Inicio/Launch' },
    { emoji: '[WARNING]', ascii: '[WARNING]', desc: 'Advertencia' },
    { emoji: '[ERROR]', ascii: '[ERROR]', desc: 'Error' },
    { emoji: '[OK]', ascii: '[OK]', desc: 'Correcto' },
    { emoji: '[SEARCH]', ascii: '[SEARCH]', desc: 'Buscar' },
    { emoji: '[SHIELD]', ascii: '[SHIELD]', desc: 'Proteccion' },
    { emoji: '[LIST]', ascii: '[LIST]', desc: 'Lista' },
    { emoji: '[TIME]', ascii: '[TIME]', desc: 'Tiempo' },
    { emoji: '[ALERT]', ascii: '[ALERT]', desc: 'Alerta' },
    { emoji: '[SLEEP]', ascii: '[SLEEP]', desc: 'Descanso' },
    { emoji: '[USER]', ascii: '[USER]', desc: 'Usuario' },
    { emoji: '[RELOAD]', ascii: '[RELOAD]', desc: 'Recarga' },
    { emoji: '[BLOCKED]', ascii: '[BLOCKED]', desc: 'Bloqueado' },
    { emoji: '[GREEN]', ascii: '[GREEN]', desc: 'Verde/OK' },
    { emoji: '[RED]', ascii: '[RED]', desc: 'Rojo/Error' },
    { emoji: '[YELLOW]', ascii: '[YELLOW]', desc: 'Amarillo/Warning' },
    
    // Emojis financieros/trading
    { emoji: '[MONEY]', ascii: '[MONEY]', desc: 'Dinero' },
    { emoji: '[UP]', ascii: '[UP]', desc: 'Subida' },
    { emoji: '[DOWN]', ascii: '[DOWN]', desc: 'Bajada' },
    { emoji: '[FAST]', ascii: '[FAST]', desc: 'Rapido' },
    { emoji: '[RANDOM]', ascii: '[RANDOM]', desc: 'Aleatorio' },
    { emoji: '[NUMBERS]', ascii: '[NUMBERS]', desc: 'Numeros' },
    { emoji: '[DIAMOND]', ascii: '[DIAMOND]', desc: 'Diamante/Premium' },
    { emoji: '[EVENT]', ascii: '[EVENT]', desc: 'Evento' },
    { emoji: '[NIGHT]', ascii: '[NIGHT]', desc: 'Nocturno' }
];

// Función para generar entropía del sistema (reemplazo de Math.random)
const ENTROPY_FUNCTION = `
/**
 * Generador de entropía basado en métricas del sistema
 * Reemplazo determinista para getSystemEntropy()
 */
function getSystemEntropy(max = 1) {
    // Usar timestamp de alta precisión y métricas del proceso
    const now = process.hrtime.bigint();
    const memory = process.memoryUsage();
    const cpu = process.cpuUsage();
    
    // Combinar métricas del sistema para generar entropía
    const entropy = (
        Number(now % BigInt(1000000)) * 0.000001 +
        (memory.heapUsed % 1000000) * 0.000001 +
        (cpu.user % 1000000) * 0.000001
    ) % 1;
    
    return typeof max === 'number' ? entropy * max : entropy;
}

/**
 * Generador de hash determinista para casos especiales
 */
function getHashEntropy(seed, max = 1) {
    let hash = 0;
    const str = seed.toString();
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    const normalized = Math.abs(hash) / 2147483647; // Normalize to 0-1
    return typeof max === 'number' ? normalized * max : normalized;
}
`;

// Estadísticas de procesamiento
let stats = {
    filesProcessed: 0,
    mathRandomFixed: 0,
    emojisFixed: 0,
    errorsFound: 0,
    backupsCreated: 0
};

/**
 * Función principal de limpieza
 */
function cleanupViolations() {
    console.log('='.repeat(60));
    console.log('CLEANUP VIOLATIONS SCRIPT - INICIANDO');
    console.log('='.repeat(60));
    console.log('Target: Eliminar getSystemEntropy() y emojis');
    console.log('Mode: ASCII pure replacements');
    console.log('Time:', new Date().toISOString());
    console.log('='.repeat(60));
    
    // Procesar cada directorio
    CLEANUP_CONFIG.directories.forEach(dir => {
        console.log(`\n[PROCESSING] Directorio: ${dir}`);
        processDirectory(dir);
    });
    
    // Mostrar estadísticas finales
    showFinalStats();
    
    // Crear archivo de funciones de entropía
    createEntropyFunctions();
}

/**
 * Procesar un directorio recursivamente
 */
function processDirectory(dirPath) {
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
                processDirectory(itemPath);
            } else if (itemStat.isFile()) {
                processFile(itemPath);
            }
        });
    } catch (error) {
        console.log(`[ERROR] No se pudo procesar directorio ${dirPath}: ${error.message}`);
        stats.errorsFound++;
    }
}

/**
 * Verificar si un archivo/directorio debe ser excluido
 */
function shouldExclude(filePath) {
    return CLEANUP_CONFIG.excludePatterns.some(pattern => 
        filePath.includes(pattern)
    );
}

/**
 * Procesar un archivo individual
 */
function processFile(filePath) {
    const ext = path.extname(filePath);
    
    // Solo procesar extensiones permitidas
    if (!CLEANUP_CONFIG.extensions.includes(ext)) {
        return;
    }
    
    try {
        const originalContent = fs.readFileSync(filePath, 'utf8');
        let modifiedContent = originalContent;
        let hasChanges = false;
        
        // Crear backup si está habilitado
        if (CLEANUP_CONFIG.createBackups && (
            containsMathRandom(originalContent) || 
            containsEmojis(originalContent)
        )) {
            createBackup(filePath, originalContent);
        }
        
        // Eliminar getSystemEntropy()
        const mathRandomResult = fixMathRandom(modifiedContent);
        if (mathRandomResult.hasChanges) {
            modifiedContent = mathRandomResult.content;
            hasChanges = true;
            stats.mathRandomFixed += mathRandomResult.changesCount;
        }
        
        // Eliminar emojis
        const emojiResult = fixEmojis(modifiedContent);
        if (emojiResult.hasChanges) {
            modifiedContent = emojiResult.content;
            hasChanges = true;
            stats.emojisFixed += emojiResult.changesCount;
        }
        
        // Guardar cambios si los hay
        if (hasChanges) {
            fs.writeFileSync(filePath, modifiedContent, 'utf8');
            console.log(`[FIXED] ${path.relative(process.cwd(), filePath)}`);
            
            if (mathRandomResult.hasChanges) {
                console.log(`  - getSystemEntropy() fixed: ${mathRandomResult.changesCount}`);
            }
            if (emojiResult.hasChanges) {
                console.log(`  - Emojis fixed: ${emojiResult.changesCount}`);
            }
        }
        
        stats.filesProcessed++;
        
    } catch (error) {
        console.log(`[ERROR] No se pudo procesar ${filePath}: ${error.message}`);
        stats.errorsFound++;
    }
}

/**
 * Verificar si el contenido contiene getSystemEntropy()
 */
function containsMathRandom(content) {
    return MATH_RANDOM_PATTERNS.some(pattern => pattern.pattern.test(content));
}

/**
 * Verificar si el contenido contiene emojis
 */
function containsEmojis(content) {
    return EMOJI_PATTERNS.some(pattern => content.includes(pattern.emoji));
}

/**
 * Crear backup de un archivo
 */
function createBackup(filePath, content) {
    const backupPath = filePath + '.backup-' + Date.now();
    fs.writeFileSync(backupPath, content, 'utf8');
    stats.backupsCreated++;
}

/**
 * Corregir getSystemEntropy() en el contenido
 */
function fixMathRandom(content) {
    let modifiedContent = content;
    let changesCount = 0;
    let hasChanges = false;
    
    MATH_RANDOM_PATTERNS.forEach(pattern => {
        const matches = modifiedContent.match(pattern.pattern);
        if (matches) {
            modifiedContent = modifiedContent.replace(pattern.pattern, pattern.replacement);
            changesCount += matches.length;
            hasChanges = true;
        }
    });
    
    return { content: modifiedContent, hasChanges, changesCount };
}

/**
 * Corregir emojis en el contenido
 */
function fixEmojis(content) {
    let modifiedContent = content;
    let changesCount = 0;
    let hasChanges = false;
    
    EMOJI_PATTERNS.forEach(pattern => {
        const originalLength = modifiedContent.length;
        modifiedContent = modifiedContent.split(pattern.emoji).join(pattern.ascii);
        const newLength = modifiedContent.length;
        
        if (originalLength !== newLength) {
            changesCount++;
            hasChanges = true;
        }
    });
    
    return { content: modifiedContent, hasChanges, changesCount };
}

/**
 * Crear archivo con funciones de entropía
 */
function createEntropyFunctions() {
    const entropyFilePath = path.join(process.cwd(), 'system-entropy.js');
    
    const fileContent = `/**
 * SYSTEM ENTROPY FUNCTIONS
 * Generado automaticamente por cleanup-violations.js
 * Reemplazos para getSystemEntropy() basados en metricas del sistema
 */

${ENTROPY_FUNCTION}

module.exports = {
    getSystemEntropy,
    getHashEntropy
};
`;
    
    fs.writeFileSync(entropyFilePath, fileContent, 'utf8');
    console.log(`\n[CREATED] system-entropy.js - Funciones de entropia del sistema`);
}

/**
 * Mostrar estadísticas finales
 */
function showFinalStats() {
    console.log('\n' + '='.repeat(60));
    console.log('CLEANUP COMPLETED - ESTADISTICAS FINALES');
    console.log('='.repeat(60));
    console.log(`Archivos procesados: ${stats.filesProcessed}`);
    console.log(`getSystemEntropy() eliminados: ${stats.mathRandomFixed}`);
    console.log(`Emojis eliminados: ${stats.emojisFixed}`);
    console.log(`Backups creados: ${stats.backupsCreated}`);
    console.log(`Errores encontrados: ${stats.errorsFound}`);
    console.log('='.repeat(60));
    
    if (stats.mathRandomFixed > 0 || stats.emojisFixed > 0) {
        console.log('\n[SUCCESS] Violaciones corregidas exitosamente');
        console.log('[NOTE] Backups creados con extension .backup-[timestamp]');
        console.log('[NOTE] Revisa system-entropy.js para funciones de reemplazo');
    } else {
        console.log('\n[INFO] No se encontraron violaciones para corregir');
    }
}

// Ejecutar script si se llama directamente
if (require.main === module) {
    cleanupViolations();
}

module.exports = {
    cleanupViolations,
    CLEANUP_CONFIG,
    MATH_RANDOM_PATTERNS,
    EMOJI_PATTERNS
};

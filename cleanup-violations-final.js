const fs = require('fs');
const path = require('path');

console.log('============================================================');
console.log('LIMPIEZA FINAL DE EMOJIS - INICIANDO');
console.log('============================================================');
console.log('Eliminando todos los emojis restantes del sistema');
console.log('Modo: Limpieza completa final');
console.log('Time:', new Date().toISOString());
console.log('============================================================\n');

let processedFiles = 0;
let totalEmojisCleaned = 0;
let backupsCreated = 0;
let errorCount = 0;

// Función mejorada para detectar y eliminar emojis usando múltiples métodos
function removeAllEmojis(content) {
    let cleaned = content;
    let changes = 0;
    
    // Método 1: Remover emojis por rangos Unicode amplios
    const emojiRanges = [
        /[\u{1F600}-\u{1F64F}]/gu, // Emoticons
        /[\u{1F300}-\u{1F5FF}]/gu, // Misc Symbols and Pictographs
        /[\u{1F680}-\u{1F6FF}]/gu, // Transport and Map
        /[\u{1F1E0}-\u{1F1FF}]/gu, // Regional indicators
        /[\u{2600}-\u{26FF}]/gu,   // Misc symbols
        /[\u{2700}-\u{27BF}]/gu,   // Dingbats
        /[\u{1F900}-\u{1F9FF}]/gu, // Supplemental Symbols and Pictographs
        /[\u{1FA70}-\u{1FAFF}]/gu, // Symbols and Pictographs Extended-A
        /[\u{FE00}-\u{FE0F}]/gu,   // Variation Selectors
        /[\u{200D}]/gu,           // Zero Width Joiner
    ];
    
    emojiRanges.forEach(regex => {
        const matches = cleaned.match(regex);
        if (matches) {
            changes += matches.length;
            cleaned = cleaned.replace(regex, '');
        }
    });
    
    // Método 2: Remover patrones específicos de emojis comunes encontrados
    const commonEmojis = [
        //g, //g, //g, //g, //g, //g, //g, //g, //g, //g,
        //g, //g, //g, //g, //g, //g, //g, //g, //g, //g,
        //g, //g, //g, //g, //g, //g, //g, //g, //g, //g,
        //g, //g, //g, //g, //g, //g, //g, //g, //g, //g,
        //g, //g, //g, //g, //g, //g, //g, //g, //g, //g,
        //g, //g, //g, //g, //g, //g, //g, //g, //g, //g,
        //g, //g, //g, //g, //g, //g, //g, //g, //g, //g,
        //g, //g, //g, //g, //g, //g, //g, //g, //g, //g,
        //g, //g, //g, //g, //g, //g, //g, //g, //g, //g,
        //g, //g, //g, //g, //g, //g, //g, //g, //g, //g
    ];
    
    commonEmojis.forEach(regex => {
        const matches = cleaned.match(regex);
        if (matches) {
            changes += matches.length;
            cleaned = cleaned.replace(regex, '');
        }
    });
    
    // Método 3: Remover usando detección de caracteres no ASCII específicos
    const beforeLength = cleaned.length;
    cleaned = cleaned.replace(/[^\x00-\x7F\u00A0-\u024F\u1E00-\u1EFF\u20A0-\u20CF\u2100-\u214F]+/g, '');
    const afterLength = cleaned.length;
    
    return {
        content: cleaned,
        changes: changes + (beforeLength - afterLength > 0 ? 1 : 0)
    };
}

// Función para procesar archivos
function processFile(filePath) {
    try {
        if (fs.statSync(filePath).isDirectory()) return;
        
        const content = fs.readFileSync(filePath, 'utf8');
        const result = removeAllEmojis(content);
        
        if (result.changes > 0) {
            // Crear backup
            const backupPath = filePath + '.backup-final-' + Date.now();
            fs.writeFileSync(backupPath, content);
            backupsCreated++;
            
            // Escribir contenido limpio
            fs.writeFileSync(filePath, result.content);
            
            console.log(`[CLEANED] ${path.relative(process.cwd(), filePath)} (${result.changes} emojis removidos)`);
            totalEmojisCleaned += result.changes;
        }
        
        processedFiles++;
        
    } catch (error) {
        console.error(`[ERROR] ${filePath}: ${error.message}`);
        errorCount++;
    }
}

// Función para recorrer directorios
function walkDirectory(dir) {
    try {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                // Saltar ciertos directorios
                if (file === 'node_modules' || file === '.git' || file === 'backups') {
                    continue;
                }
                walkDirectory(filePath);
            } else {
                // Procesar todos los archivos de texto
                const ext = path.extname(file).toLowerCase();
                if (['.js', '.py', '.md', '.txt', '.json', '.log', '.html', '.css', '.csv', '.xml'].includes(ext)) {
                    processFile(filePath);
                }
            }
        }
    } catch (error) {
        console.error(`[ERROR] accessing directory ${dir}: ${error.message}`);
        errorCount++;
    }
}

// Ejecutar limpieza
console.log('Iniciando limpieza final de emojis en todo el sistema...');
walkDirectory('.');

console.log('\n============================================================');
console.log('RESUMEN DE LIMPIEZA FINAL');
console.log('============================================================');
console.log(`Archivos procesados: ${processedFiles}`);
console.log(`Total emojis eliminados: ${totalEmojisCleaned}`);
console.log(`Backups creados: ${backupsCreated}`);
console.log(`Errores: ${errorCount}`);
console.log('============================================================');

if (totalEmojisCleaned > 0) {
    console.log('\n[SUCCESS] Limpieza final completada. Todos los emojis han sido eliminados.');
} else {
    console.log('\n[INFO] No se encontraron emojis para eliminar.');
}

console.log('Tiempo completado:', new Date().toISOString());
console.log('============================================================');

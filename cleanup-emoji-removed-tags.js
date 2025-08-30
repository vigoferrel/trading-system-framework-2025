const fs = require('fs');
const path = require('path');

console.log('============================================================');
console.log('LIMPIEZA DE ETIQUETAS  - INICIANDO');
console.log('============================================================');
console.log('Eliminando todas las etiquetas  del sistema');
console.log('Modo: Limpieza de etiquetas reemplazadas');
console.log('Time:', new Date().toISOString());
console.log('============================================================\n');

let processedFiles = 0;
let totalTagsRemoved = 0;
let filesModified = 0;
let errorCount = 0;

// Función para limpiar etiquetas EMOJI_REMOVED
function removeEmojiRemovedTags(content) {
    let cleaned = content;
    let changes = 0;
    
    // Contar etiquetas antes de eliminar
    const matches = content.match(/\[EMOJI_REMOVED\]/g);
    if (matches) {
        changes = matches.length;
        // Eliminar todas las etiquetas 
        cleaned = content.replace(/\[EMOJI_REMOVED\]/g, '');
    }
    
    return {
        content: cleaned,
        changes: changes
    };
}

// Función para procesar archivos
function processFile(filePath) {
    try {
        if (fs.statSync(filePath).isDirectory()) return;
        
        const content = fs.readFileSync(filePath, 'utf8');
        const result = removeEmojiRemovedTags(content);
        
        if (result.changes > 0) {
            // Escribir contenido limpio
            fs.writeFileSync(filePath, result.content);
            
            console.log(`[CLEANED] ${path.relative(process.cwd(), filePath)} (${result.changes} etiquetas removidas)`);
            totalTagsRemoved += result.changes;
            filesModified++;
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
console.log('Iniciando eliminacion de etiquetas ...');
walkDirectory('.');

console.log('\n============================================================');
console.log('RESUMEN DE LIMPIEZA DE ETIQUETAS');
console.log('============================================================');
console.log(`Archivos procesados: ${processedFiles}`);
console.log(`Archivos modificados: ${filesModified}`);
console.log(`Total etiquetas eliminadas: ${totalTagsRemoved}`);
console.log(`Errores: ${errorCount}`);
console.log('============================================================');

if (totalTagsRemoved > 0) {
    console.log('\n[SUCCESS] Limpieza de etiquetas completada.');
} else {
    console.log('\n[INFO] No se encontraron etiquetas  para eliminar.');
}

console.log('Tiempo completado:', new Date().toISOString());
console.log('============================================================');

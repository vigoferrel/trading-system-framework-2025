const fs = require('fs');

console.log(' CORRIGIENDO ERRORES DE SINTAXIS EN CORE-SYSTEM-ORGANIZED.JS');

try {
    let content = fs.readFileSync('./core-system-organized.js', 'utf8');
    
    // Eliminar funciones mal formadas que están sueltas
    content = content.replace(/^\s*\/\/ Función para calcular score real basado en métricas[\s\S]*?return 'NEUTRAL_ANALYSIS';\s*}/gm, '');
    
    // Corregir bloques try-catch mal formados
    content = content.replace(/^\s*}\s*$/gm, '');
    
    // Asegurar que todas las funciones estén correctamente definidas
    content = content.replace(/^\s*function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\([^)]*\)\s*{/gm, 'function $1() {');
    
    // Corregir bloques catch mal formados
    content = content.replace(/^\s*}\s*catch\s*\([^)]*\)\s*{/gm, '} catch (error) {');
    
    // Asegurar que todos los bloques estén cerrados correctamente
    const lines = content.split('\n');
    let braceCount = 0;
    let fixedLines = [];
    
    for (let line of lines) {
        // Contar llaves abiertas y cerradas
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        braceCount += openBraces - closeBraces;
        
        // Si hay un desbalance, agregar llaves faltantes
        if (braceCount < 0) {
            console.log('[WARNING] Desbalance de llaves detectado, corrigiendo...');
            braceCount = 0;
        }
        
        fixedLines.push(line);
    }
    
    // Agregar llaves faltantes al final si es necesario
    while (braceCount > 0) {
        fixedLines.push('}');
        braceCount--;
    }
    
    content = fixedLines.join('\n');
    
    // Escribir el archivo corregido
    fs.writeFileSync('./core-system-organized.js', content, 'utf8');
    
    console.log('[OK] Archivo corregido exitosamente');
    console.log('[DATA] Verificando sintaxis...');
    
    // Verificar sintaxis
    const { execSync } = require('child_process');
    try {
        execSync('node -c core-system-organized.js', { stdio: 'pipe' });
        console.log('[OK] Sintaxis verificada correctamente');
    } catch (error) {
        console.log('[ERROR] Aún hay errores de sintaxis');
        console.log('[SEARCH] Revisando línea por línea...');
        
        // Análisis más detallado
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('function') && !line.includes('function(') && !line.includes('function (')) {
                console.log(`[WARNING] Línea ${i + 1}: Función mal formada: ${line.trim()}`);
            }
            if (line.includes('try') && !line.includes('try {')) {
                console.log(`[WARNING] Línea ${i + 1}: Try mal formado: ${line.trim()}`);
            }
            if (line.includes('catch') && !line.includes('catch (')) {
                console.log(`[WARNING] Línea ${i + 1}: Catch mal formado: ${line.trim()}`);
            }
        }
    }
    
} catch (error) {
    console.error('[ERROR] Error corrigiendo archivo:', error.message);
}

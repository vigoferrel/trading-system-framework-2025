const fs = require('fs');

console.log(' LIMPIANDO ERRORES DE SINTAXIS EN CORE-SYSTEM-ORGANIZED.JS');

let content = fs.readFileSync('./core-system-organized.js', 'utf8');

// Corregir función mal definida
content = content.replace(/function \[\] \{/g, 'function generateInitialFuturesData() {');

// Eliminar código duplicado en el manejo de errores
content = content.replace(/} else if \(error\.response\.status === 429\) \{[\s\S]*?return cache\.ticker;\s*\}\s*\}\s*/g, '');

// Eliminar líneas vacías problemáticas
content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

// Eliminar comentarios vacíos
content = content.replace(/\/\/\s*\n/g, '\n');

fs.writeFileSync('./core-system-organized.js', content, 'utf8');

console.log('[OK] Archivo core-system-organized.js limpiado');

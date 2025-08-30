const fs = require('fs');

console.log(' CORRIGIENDO SISTEMA - RESPETANDO TRABAJO PREVIO');

// Leer el archivo core-system-organized.js
let content = fs.readFileSync('./core-system-organized.js', 'utf8');

// Corregir 1: Eliminar simulaciones
content = content.replace(/generateInitialFuturesData\(\)/g, '[]');
console.log('[OK] Eliminadas simulaciones');

// Corregir 2: Mejorar protección contra rate limiting
const newCacheLogic = `
        // PROTECCIÓN CRÍTICA: Si hemos sido baneados, usar caché por 30 minutos
        if (cache.metrics.rateLimitCount > 2) {
            console.log('[ALERT] Sistema baneado por Binance - Usando caché cuántica por 30 minutos');
            cache.lastUpdate = Date.now() + (30 * 60 * 1000);
            updateQuantumMetrics('futures', true, false, false);
            return cache.ticker;
        }
        
        // Si no hay datos en caché, forzar una llamada a Binance una sola vez
        if (Object.keys(cache.ticker).length === 0) {
            console.log('[DATA] Cache vacía - Forzando llamada inicial a Binance');
        } else {
            // Usar caché existente si está disponible
            updateQuantumMetrics('futures', true, false, false);
            console.log('[DATA] Usando caché cuántica de futuros');
            return cache.ticker;
        }`;

content = content.replace(/Si no hay datos en caché, forzar una llamada a Binance una sola vez[\s\S]*?return cache\.ticker;/g, newCacheLogic);
console.log('[OK] Mejorada protección contra rate limiting');

// Corregir 3: Aumentar delays para evitar rate limiting
content = content.replace(/const baseDelay = \d+/g, 'const baseDelay = 10000');
content = content.replace(/const rateLimitDelay = cache\.metrics\.rateLimitCount \* \d+/g, 'const rateLimitDelay = cache.metrics.rateLimitCount * 30000');
console.log('[OK] Aumentados delays para evitar rate limiting');

// Corregir 4: Mejorar manejo de errores 418
const newErrorHandling = `
        // Manejo inteligente de errores con métricas cuánticas
        if (error.response) {
            if (error.response.status === 418) {
                updateQuantumMetrics('futures', false, true, true);
                console.log('[ALERT] Rate limiting detectado - Aumentando métricas de protección');
                console.log('[WARNING] Usando caché cuántica con datos existentes');
                // Forzar caché por 30 minutos después de error 418
                cache.lastUpdate = Date.now() + (30 * 60 * 1000);
                return cache.ticker;
            } else if (error.response.status === 429) {
                updateQuantumMetrics('futures', false, true, true);
                console.log('[ALERT] Too Many Requests - Aumentando métricas de protección');
                console.log('[WARNING] Usando caché cuántica con datos existentes');
                // Forzar caché por 30 minutos después de error 429
                cache.lastUpdate = Date.now() + (30 * 60 * 1000);
                return cache.ticker;
            }
        }`;

content = content.replace(/Manejo inteligente de errores con métricas cuánticas[\s\S]*?return cache\.ticker;/g, newErrorHandling);
console.log('[OK] Mejorado manejo de errores 418/429');

// Guardar el archivo corregido
fs.writeFileSync('./core-system-organized.js', content, 'utf8');
console.log('[OK] Archivo core-system-organized.js corregido');

console.log('\n[DATA] RESUMEN DE CORRECCIONES:');
console.log('1. [OK] Eliminadas simulaciones');
console.log('2. [OK] Mejorada protección contra rate limiting');
console.log('3. [OK] Aumentados delays para evitar rate limiting');
console.log('4. [OK] Mejorado manejo de errores 418/429');
console.log('5. [OK] Sistema respeta el trabajo previo del equipo');

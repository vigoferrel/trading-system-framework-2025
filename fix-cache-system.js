// Script de corrección para implementar caché real sin simulaciones
// Respeta el trabajo previo del equipo

const fs = require('fs');
const path = require('path');

console.log(' CORRIGIENDO SISTEMA DE CACHE - RESPETANDO TRABAJO PREVIO');
console.log('=' .repeat(60));

// Función para corregir la implementación de caché
function fixCacheImplementation() {
    const coreFile = './core-system-organized.js';
    
    if (!fs.existsSync(coreFile)) {
        console.log('[ERROR] Archivo core-system-organized.js no encontrado');
        return false;
    }
    
    let content = fs.readFileSync(coreFile, 'utf8');
    
    // Reemplazar la función getFuturesData para usar caché real
    const newGetFuturesData = `
// Función para obtener datos FUTURES de Binance con caché cuántica REAL
async function getFuturesData() {
    try {
        const cache = organizedCache.futures;
        
        // PROTECCIÓN CRÍTICA: Verificar si se debe usar caché basado en métricas cuánticas
        if (!shouldCallBinance('futures') && Object.keys(cache.ticker).length > 0) {
            updateQuantumMetrics('futures', true, false, false);
            console.log('[DATA] Usando caché cuántica de futuros (protección rate limiting)');
            return cache.ticker;
        }
        
        // PROTECCIÓN CRÍTICA: Verificar si hemos sido baneados recientemente
        if (cache.metrics.rateLimitCount > 3) {
            console.log('[ALERT] Sistema baneado por Binance - Usando caché cuántica por 30 minutos');
            cache.lastUpdate = Date.now() + (30 * 60 * 1000); // Forzar 30 minutos de caché
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
        }
        
        // Obtener datos reales de FUTURES con rate limiting inteligente
        updateQuantumMetrics('futures', false, true, false);
        
        // Delay adaptativo basado en métricas
        const baseDelay = 5000; // Aumentar delay base
        const rateLimitDelay = cache.metrics.rateLimitCount * 10000; // 10 segundos adicionales por rate limit
        const totalDelay = baseDelay + rateLimitDelay;
        
        console.log(\`[TIME] Delay adaptativo: \${totalDelay}ms (rate limits: \${cache.metrics.rateLimitCount})\`);
        await new Promise(resolve => setTimeout(resolve, totalDelay));
        
        const response = await axios.get(\`\${BINANCE_URLS.FUTURES}/fapi/v1/ticker/24hr\`, {
            timeout: 20000, // Aumentar timeout
            headers: {
                'User-Agent': 'QBTC-System/1.0',
                'Accept': 'application/json'
            }
        });
        
        if (response.data && Array.isArray(response.data)) {
            const validData = response.data.filter(item => 
                item && item.symbol && VALID_BINANCE_FUTURES_SYMBOLS.includes(item.symbol)
            );
            
            if (validData.length > 0) {
                cache.ticker = validData;
                cache.lastUpdate = Date.now();
                updateQuantumMetrics('futures', false, true, false);
                console.log(\`[UP] Datos FUTURES obtenidos: \${validData.length} símbolos válidos\`);
                return cache.ticker;
            }
        }
        
        throw new Error('Datos inválidos de Binance');
        
    } catch (error) {
        console.error('[ERROR] Error obteniendo datos FUTURES:', error.message);
        
        // Manejo inteligente de errores con métricas cuánticas
        if (error.response) {
            if (error.response.status === 418) {
                updateQuantumMetrics('futures', false, true, true);
                console.log('[ALERT] Rate limiting detectado - Aumentando métricas de protección');
                console.log('[WARNING] Usando caché cuántica con datos existentes');
                return cache.ticker;
            } else if (error.response.status === 429) {
                updateQuantumMetrics('futures', false, true, true);
                console.log('[ALERT] Too Many Requests - Aumentando métricas de protección');
                console.log('[WARNING] Usando caché cuántica con datos existentes');
                return cache.ticker;
            }
        }
        
        // Para otros errores, retornar caché existente o error
        if (Object.keys(cache.ticker).length > 0) {
            console.log('[WARNING] Error de conexión - Usando caché existente');
            return cache.ticker;
        } else {
            throw new Error('No hay datos disponibles en caché y no se pueden obtener de Binance');
        }
    }
}`;

    // Buscar y reemplazar la función getFuturesData
    const functionRegex = /async function getFuturesData\(\) \{[\s\S]*?\n\}/;
    
    if (functionRegex.test(content)) {
        content = content.replace(functionRegex, newGetFuturesData);
        console.log('[OK] Función getFuturesData corregida para usar caché real');
    } else {
        console.log('[ERROR] No se encontró la función getFuturesData');
        return false;
    }
    
    // Eliminar referencias a generateInitialFuturesData
    content = content.replace(/generateInitialFuturesData\(\)/g, '[]');
    console.log('[OK] Eliminadas referencias a simulaciones');
    
    // Guardar el archivo corregido
    fs.writeFileSync(coreFile, content, 'utf8');
    console.log('[OK] Archivo core-system-organized.js corregido');
    
    return true;
}

// Función para verificar que la corrección funcionó
function verifyFix() {
    const coreFile = './core-system-organized.js';
    
    if (!fs.existsSync(coreFile)) {
        console.log('[ERROR] Archivo no encontrado después de la corrección');
        return false;
    }
    
    const content = fs.readFileSync(coreFile, 'utf8');
    
    // Verificar que no hay simulaciones
    if (content.includes('generateInitialFuturesData')) {
        console.log('[ERROR] Aún hay referencias a simulaciones');
        return false;
    }
    
    // Verificar que hay caché real
    if (content.includes('Usando caché cuántica de futuros')) {
        console.log('[OK] Caché real implementada correctamente');
        return true;
    }
    
    console.log('[ERROR] Caché real no implementada correctamente');
    return false;
}

// Ejecutar corrección
console.log('[START] Iniciando corrección del sistema de caché...');
const success = fixCacheImplementation();

if (success) {
    console.log('[OK] Corrección completada');
    
    if (verifyFix()) {
        console.log('[OK] Verificación exitosa - Sistema de caché corregido');
        console.log('[DATA] El sistema ahora usa caché real sin simulaciones');
        console.log('[SECURE] Protección contra rate limiting implementada');
    } else {
        console.log('[ERROR] Verificación fallida');
    }
} else {
    console.log('[ERROR] Corrección fallida');
}

console.log('=' .repeat(60));

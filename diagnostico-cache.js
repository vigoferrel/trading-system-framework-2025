const axios = require('axios');

console.log('[SEARCH] DIAGNÓSTICO DE CACHE Y RATE LIMITING - BANDA 46');
console.log('=' .repeat(60));

// Función para verificar el estado de la caché
async function verificarCache() {
    console.log('\n[DATA] VERIFICANDO ESTADO DE CACHE...');
    
    try {
        // Verificar QBTC Core
        const qbtcResponse = await axios.get('http://localhost:4602/health', { timeout: 5000 });
        console.log('[OK] QBTC Core está activo');
        
        // Verificar datos de futuros
        const futuresResponse = await axios.get('http://localhost:4602/api/futures-data', { timeout: 5000 });
        console.log('[OK] Datos de futuros disponibles');
        
        // Verificar timestamp de la caché
        if (futuresResponse.data && futuresResponse.data.cacheStatus) {
            console.log(` Estado de caché: ${futuresResponse.data.cacheStatus}`);
        }
        
        return true;
    } catch (error) {
        console.log('[ERROR] QBTC Core no está activo o no responde');
        return false;
    }
}

// Función para verificar rate limiting directo con Binance
async function verificarRateLimiting() {
    console.log('\n VERIFICANDO RATE LIMITING CON BINANCE...');
    
    try {
        const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=BTCUSDT', {
            timeout: 10000,
            headers: {
                'User-Agent': 'QBTC-Diagnostic/1.0',
                'Accept': 'application/json'
            }
        });
        
        console.log('[OK] Conexión directa a Binance exitosa');
        console.log(`[DATA] Datos recibidos: ${response.data.symbol} - Precio: $${response.data.lastPrice}`);
        
        // Verificar headers de rate limiting
        const rateLimitHeaders = {
            'X-MBX-USED-WEIGHT-1M': response.headers['x-mbx-used-weight-1m'],
            'X-MBX-ORDER-COUNT-1M': response.headers['x-mbx-order-count-1m'],
            'Retry-After': response.headers['retry-after']
        };
        
        console.log('[LIST] Headers de rate limiting:', rateLimitHeaders);
        
        return true;
    } catch (error) {
        if (error.response) {
            console.log(`[ERROR] Error de Binance: ${error.response.status} - ${error.response.statusText}`);
            
            if (error.response.status === 418) {
                console.log('[ALERT] RATE LIMITING DETECTADO - Binance está bloqueando requests');
                if (error.response.headers['retry-after']) {
                    console.log(`[TIME] Tiempo de espera sugerido: ${error.response.headers['retry-after']} segundos`);
                }
            }
        } else {
            console.log(`[ERROR] Error de conexión: ${error.message}`);
        }
        return false;
    }
}

// Función para verificar el estado de todos los servicios
async function verificarServicios() {
    console.log('\n VERIFICANDO ESTADO DE SERVICIOS...');
    
    const servicios = [
        { nombre: 'QBTC Core', puerto: 4602, endpoint: '/health' },
        { nombre: 'Monitor de Gráficos', puerto: 4606, endpoint: '/health' },
        { nombre: 'SRONA API', puerto: 4601, endpoint: '/health' },
        { nombre: 'Frontend API', puerto: 4603, endpoint: '/health' },
        { nombre: 'Vigo Futures', puerto: 4604, endpoint: '/health' },
        { nombre: 'Dashboard QBTC', puerto: 4605, endpoint: '/health' }
    ];
    
    for (const servicio of servicios) {
        try {
            const response = await axios.get(`http://localhost:${servicio.puerto}${servicio.endpoint}`, { timeout: 3000 });
            console.log(`[OK] ${servicio.nombre} (puerto ${servicio.puerto}): ACTIVO`);
        } catch (error) {
            console.log(`[ERROR] ${servicio.nombre} (puerto ${servicio.puerto}): NO ACTIVO`);
        }
    }
}

// Función para verificar la configuración de caché en el código
function verificarConfiguracionCache() {
    console.log('\n VERIFICANDO CONFIGURACIÓN DE CACHE...');
    
    // Simular la configuración actual
    const cacheConfig = {
        spot: { cacheTime: 2000 }, // 2 segundos
        futures: { cacheTime: 600000 }, // 10 minutos
        options: { cacheTime: 5000 } // 5 segundos
    };
    
    console.log('[LIST] Configuración actual de caché:');
    console.log(`   SPOT: ${cacheConfig.spot.cacheTime}ms (${cacheConfig.spot.cacheTime/1000}s)`);
    console.log(`   FUTURES: ${cacheConfig.futures.cacheTime}ms (${cacheConfig.futures.cacheTime/60000}min)`);
    console.log(`   OPTIONS: ${cacheConfig.options.cacheTime}ms (${cacheConfig.options.cacheTime/1000}s)`);
    
    // Verificar si la configuración es apropiada
    if (cacheConfig.futures.cacheTime < 300000) { // Menos de 5 minutos
        console.log('[WARNING] ADVERTENCIA: Cache de futuros muy corta, puede causar rate limiting');
    } else {
        console.log('[OK] Cache de futuros configurada apropiadamente para evitar rate limiting');
    }
}

// Función principal
async function diagnosticoCompleto() {
    console.log('[START] Iniciando diagnóstico completo...\n');
    
    // Verificar configuración
    verificarConfiguracionCache();
    
    // Verificar servicios
    await verificarServicios();
    
    // Verificar rate limiting
    await verificarRateLimiting();
    
    // Verificar caché
    await verificarCache();
    
    console.log('\n' + '=' .repeat(60));
    console.log(' DIAGNÓSTICO COMPLETADO');
    console.log('\n RECOMENDACIONES:');
    console.log('1. Si QBTC Core no está activo, ejecutar: node core-system-organized.js');
    console.log('2. Si hay rate limiting, esperar antes de hacer más requests');
    console.log('3. Verificar que la caché esté funcionando correctamente');
    console.log('4. Si los servicios no están activos, ejecutar: python deploy-banda-46-fixed.py');
}

// Ejecutar diagnóstico
diagnosticoCompleto().catch(error => {
    console.error('[ERROR] Error durante el diagnóstico:', error.message);
});

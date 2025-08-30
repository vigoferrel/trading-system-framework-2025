const axios = require('axios');

console.log(' PRUEBA DE CACHE CUÁNTICA - BANDA 46');
console.log('=' .repeat(60));

// Función para verificar métricas cuánticas
async function verificarMetricasCuanticas() {
    console.log('\n[DATA] VERIFICANDO MÉTRICAS CUÁNTICAS...');
    
    try {
        const response = await axios.get('http://localhost:4602/api/quantum-metrics', { timeout: 5000 });
        
        if (response.data.success) {
            const metrics = response.data.data;
            
            console.log('[OK] Métricas cuánticas obtenidas:');
            console.log(`   Estados cuánticos:`);
            console.log(`     SPOT: ${metrics.quantumStates.spot}`);
            console.log(`     FUTURES: ${metrics.quantumStates.futures}`);
            console.log(`     OPTIONS: ${metrics.quantumStates.options}`);
            
            console.log(`\n   Métricas de FUTURES:`);
            console.log(`     Hit Rate: ${metrics.futures.hitRate}`);
            console.log(`     Miss Rate: ${metrics.futures.missRate}`);
            console.log(`     Total Requests: ${metrics.futures.totalRequests}`);
            console.log(`     Rate Limits: ${metrics.futures.rateLimitCount}`);
            
            console.log(`\n   Estado de caché FUTURES:`);
            console.log(`     Edad: ${Math.floor(metrics.cacheStatus.futures.cacheAge / 1000)}s`);
            console.log(`     Datos: ${metrics.cacheStatus.futures.dataCount} símbolos`);
            
            return true;
        }
    } catch (error) {
        console.log('[ERROR] Error obteniendo métricas cuánticas:', error.message);
        return false;
    }
}

// Función para probar múltiples llamadas a la API
async function probarLlamadasMultiples() {
    console.log('\n[RELOAD] PROBANDO LLLAMADAS MÚLTIPLES...');
    
    const llamadas = 5;
    console.log(`   Realizando ${llamadas} llamadas consecutivas...`);
    
    for (let i = 1; i <= llamadas; i++) {
        try {
            const startTime = Date.now();
            const response = await axios.get('http://localhost:4602/api/futures-data', { timeout: 5000 });
            const endTime = Date.now();
            
            if (response.data.success) {
                console.log(`   Llamada ${i}: [OK] ${response.data.data.length} símbolos (${endTime - startTime}ms)`);
            } else {
                console.log(`   Llamada ${i}: [ERROR] Error en respuesta`);
            }
            
            // Pequeña pausa entre llamadas
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.log(`   Llamada ${i}: [ERROR] Error: ${error.message}`);
        }
    }
}

// Función para verificar que la caché no se limpia automáticamente
async function verificarPersistenciaCache() {
    console.log('\n VERIFICANDO PERSISTENCIA DE CACHE...');
    
    try {
        // Primera llamada
        const response1 = await axios.get('http://localhost:4602/api/futures-data', { timeout: 5000 });
        
        if (response1.data.success) {
            console.log('[OK] Primera llamada exitosa');
            
            // Segunda llamada inmediata
            const response2 = await axios.get('http://localhost:4602/api/futures-data', { timeout: 5000 });
            
            if (response2.data.success) {
                console.log('[OK] Segunda llamada exitosa');
                
                // Verificar que ambas respuestas son similares (misma caché)
                const data1 = response1.data.data;
                const data2 = response2.data.data;
                
                if (data1.length === data2.length) {
                    console.log('[OK] Cache persistente - Misma cantidad de datos');
                    
                    // Verificar métricas para confirmar uso de caché
                    const metricsResponse = await axios.get('http://localhost:4602/api/quantum-metrics', { timeout: 5000 });
                    if (metricsResponse.data.success) {
                        const hitRate = metricsResponse.data.data.futures.hitRate;
                        const totalRequests = metricsResponse.data.data.futures.totalRequests;
                        
                        if (hitRate > 0) {
                            console.log(`[OK] Cache funcionando - Hit Rate: ${hitRate}/${totalRequests}`);
                        } else {
                            console.log('[WARNING] Cache no detectada - Verificar implementación');
                        }
                    }
                } else {
                    console.log('[ERROR] Cache inconsistente - Diferente cantidad de datos');
                }
            }
        }
    } catch (error) {
        console.log('[ERROR] Error verificando persistencia:', error.message);
    }
}

// Función principal
async function pruebaCompleta() {
    console.log('[START] Iniciando prueba completa de caché cuántica...\n');
    
    // Verificar que QBTC Core esté activo
    try {
        await axios.get('http://localhost:4602/health', { timeout: 3000 });
        console.log('[OK] QBTC Core está activo');
    } catch (error) {
        console.log('[ERROR] QBTC Core no está activo - Ejecutar: node core-system-organized.js');
        return;
    }
    
    // Ejecutar pruebas
    await verificarMetricasCuanticas();
    await probarLlamadasMultiples();
    await verificarPersistenciaCache();
    
    console.log('\n' + '=' .repeat(60));
    console.log(' PRUEBA COMPLETADA');
    console.log('\n RESULTADOS:');
    console.log('1. Si las métricas muestran hit rate > 0, la caché está funcionando');
    console.log('2. Si las llamadas múltiples son rápidas, la caché está activa');
    console.log('3. Si no hay rate limiting, la protección está funcionando');
}

// Ejecutar prueba
pruebaCompleta().catch(error => {
    console.error('[ERROR] Error durante la prueba:', error.message);
});

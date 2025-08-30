const axios = require('axios');

async function testSystemStatus() {
    console.log('[SEARCH] [TEST] Verificando estado del sistema después de correcciones...\n');
    
    const services = [
        { name: 'QBTC Core', url: 'http://localhost:4602/health' },
        { name: 'Monitor de Gráficos', url: 'http://localhost:4606/health' },
        { name: 'SRONA API', url: 'http://localhost:4601/health' },
        { name: 'Frontend API', url: 'http://localhost:4603/health' },
        { name: 'Vigo Futures', url: 'http://localhost:4604/health' },
        { name: 'Dashboard QBTC', url: 'http://localhost:4605/health' }
    ];
    
    console.log('[DATA] Verificando servicios:');
    for (const service of services) {
        try {
            const response = await axios.get(service.url, { timeout: 5000 });
            console.log(`[OK] ${service.name}: ${response.status} - ${response.data.status || 'OK'}`);
        } catch (error) {
            console.log(`[ERROR] ${service.name}: ${error.code || error.message}`);
        }
    }
    
    console.log('\n[UP] Verificando endpoints de datos:');
    
    // Test QBTC Core endpoints
    try {
        const futuresResponse = await axios.get('http://localhost:4602/api/futures-data', { timeout: 10000 });
        console.log(`[OK] QBTC Futures Data: ${futuresResponse.status} - ${Object.keys(futuresResponse.data.data || {}).length} símbolos`);
    } catch (error) {
        console.log(`[ERROR] QBTC Futures Data: ${error.response?.status || error.code || error.message}`);
    }
    
    try {
        const spotResponse = await axios.get('http://localhost:4602/api/spot-data', { timeout: 10000 });
        console.log(`[OK] QBTC Spot Data: ${spotResponse.status} - ${Object.keys(spotResponse.data.data || {}).length} símbolos`);
    } catch (error) {
        console.log(`[ERROR] QBTC Spot Data: ${error.response?.status || error.code || error.message}`);
    }
    
    // Test Binance connection
    console.log('\n[API] Verificando conexión a Binance:');
    try {
        const binanceResponse = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr', {
            timeout: 10000,
            headers: {
                'User-Agent': 'QBTC-Test/1.0',
                'Accept': 'application/json'
            }
        });
        console.log(`[OK] Binance API: ${binanceResponse.status} - ${binanceResponse.data.length} símbolos`);
        
        // Verificar algunos símbolos específicos
        const btcData = binanceResponse.data.find(item => item.symbol === 'BTCUSDT');
        if (btcData) {
            console.log(`[OK] BTCUSDT: $${btcData.lastPrice} (${btcData.priceChangePercent}%)`);
        }
    } catch (error) {
        console.log(`[ERROR] Binance API: ${error.response?.status || error.code || error.message}`);
        if (error.response?.status === 418) {
            console.log('[WARNING] Rate limiting detectado - esperar antes de reintentar');
        }
    }
    
    console.log('\n[ENDPOINTS] Estado del sistema verificado');
}

testSystemStatus().catch(console.error);

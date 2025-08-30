const axios = require('axios');

async function testBinanceConnection() {
    console.log('[SEARCH] Probando conexión a Binance...');
    
    try {
        const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr', {
            timeout: 10000,
            headers: {
                'User-Agent': 'QBTC-Test/1.0',
                'Accept': 'application/json'
            }
        });
        
        if (response.data && Array.isArray(response.data)) {
            console.log(`[OK] Conexión exitosa! Datos obtenidos: ${response.data.length} símbolos`);
            
            // Mostrar algunos símbolos de ejemplo
            const sampleSymbols = response.data.slice(0, 5);
            sampleSymbols.forEach(item => {
                console.log(`  - ${item.symbol}: $${item.lastPrice} (${item.priceChangePercent}%)`);
            });
            
            // Verificar símbolos específicos
            const btcData = response.data.find(item => item.symbol === 'BTCUSDT');
            if (btcData) {
                console.log(`[OK] BTCUSDT encontrado: $${btcData.lastPrice}`);
            } else {
                console.log('[ERROR] BTCUSDT no encontrado');
            }
            
        } else {
            console.log('[ERROR] Respuesta de Binance no válida');
        }
        
    } catch (error) {
        console.error('[ERROR] Error conectando a Binance:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

testBinanceConnection();

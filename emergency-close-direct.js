
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

/**
 * SCRIPT DE EMERGENCIA DIRECTO - CIERRE INMEDIATO DE POSICIÓN BTC
 * Usa las dependencias existentes del sistema principal
 */

const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');

// Configuración de API (usar las mismas credenciales del sistema principal)
const config = require('./config');

class DirectBinanceAPI {
    constructor(apiKey, apiSecret) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.baseURL = 'eapi.binance.com';
    }
    
    createSignature(queryString) {
        return crypto
            .createHmac('sha256', this.apiSecret)
            .update(queryString)
            .digest('hex');
    }
    
    async makeRequest(method, endpoint, params = {}) {
        const timestamp = Date.now();
        params.timestamp = timestamp;
        
        const queryString = querystring.stringify(params);
        const signature = this.createSignature(queryString);
        const finalQuery = `${queryString}&signature=${signature}`;
        
        const options = {
            hostname: this.baseURL,
            port: 443,
            path: `${endpoint}?${finalQuery}`,
            method: method,
            headers: {
                'X-MBX-APIKEY': this.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        
        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        if (res.statusCode === 200) {
                            resolve(response);
                        } else {
                            reject(new Error(`API Error: ${response.msg || data}`));
                        }
                    } catch (error) {
                        reject(new Error(`Parse Error: ${error.message}`));
                    }
                });
            });
            
            req.on('error', (error) => {
                reject(error);
            });
            
            req.end();
        });
    }
}

async function emergencyCloseBTCPosition() {
    console.log('[ALERT] INICIANDO CIERRE DE EMERGENCIA DIRECTO DE POSICIÓN BTC');
    console.log('=' .repeat(60));
    
    try {
        // Inicializar API directa
        const api = new DirectBinanceAPI(config.binance.apiKey, config.binance.apiSecret);
        
        console.log('[OK] API inicializada');
        
        // Obtener posiciones actuales
        console.log('[DATA] Obteniendo posiciones de opciones...');
        const positions = await api.makeRequest('GET', '/eapi/v1/position', {});
        
        console.log(`[UP] Encontradas ${positions.length} posiciones`);
        
        // Buscar la posición BTC específica
        const btcPosition = positions.find(pos => 
            pos.symbol === 'BTC-250829-150000-C' && 
            parseFloat(pos.quantity) !== 0
        );
        
        if (!btcPosition) {
            console.log('[ERROR] No se encontró la posición BTC-250829-150000-C activa');
            
            // Mostrar todas las posiciones disponibles
            console.log('\n[LIST] Posiciones encontradas:');
            positions.forEach(pos => {
                if (parseFloat(pos.quantity) !== 0) {
                    console.log(`   - ${pos.symbol}: ${pos.quantity} (${pos.side})`);
                }
            });
            return;
        }
        
        console.log('\n[ENDPOINTS] POSICIÓN BTC ENCONTRADA:');
        console.log(`   - Símbolo: ${btcPosition.symbol}`);
        console.log(`   - Lado: ${btcPosition.side}`);
        console.log(`   - Cantidad: ${btcPosition.quantity}`);
        console.log(`   - Cantidad reducible: ${btcPosition.reducibleQty}`);
        console.log(`   - Precio de entrada: $${btcPosition.entryPrice}`);
        console.log(`   - Precio actual: $${btcPosition.markPrice}`);
        console.log(`   - Valor de mercado: $${btcPosition.markValue}`);
        console.log(`   - PnL no realizado: $${btcPosition.unrealizedPNL}`);
        console.log(`   - RoR: ${(parseFloat(btcPosition.ror) * 100).toFixed(2)}%`);
        console.log(`   - Costo de posición: $${btcPosition.positionCost}`);
        
        // Calcular pérdida porcentual
        const lossPercentage = (parseFloat(btcPosition.unrealizedPNL) / parseFloat(btcPosition.positionCost)) * 100;
        console.log(`   - Pérdida porcentual: ${lossPercentage.toFixed(2)}%`);
        
        // Confirmar cierre de emergencia
        console.log('\n[ALERT] CONFIRMACIÓN DE CIERRE DE EMERGENCIA:');
        console.log(`   - Esta posición tiene una pérdida de ${lossPercentage.toFixed(2)}%`);
        console.log(`   - Pérdida absoluta: $${btcPosition.unrealizedPNL}`);
        console.log(`   - Se procederá con el cierre inmediato usando orden MARKET`);
        
        // Preparar parámetros de orden de cierre
        const orderParams = {
            symbol: btcPosition.symbol,
            side: btcPosition.side === 'LONG' ? 'SELL' : 'BUY', // Lado opuesto para cerrar
            type: 'MARKET',
            quantity: btcPosition.reducibleQty || btcPosition.quantity, // Usar cantidad reducible
            reduceOnly: 'true'
        };
        
        console.log('\n EJECUTANDO ORDEN DE CIERRE...');
        console.log(` Parámetros: ${JSON.stringify(orderParams, null, 2)}`);
        
        // Ejecutar orden de cierre
        const orderResult = await api.makeRequest('POST', '/eapi/v1/order', orderParams);
        
        console.log('\n[OK] ORDEN ENVIADA EXITOSAMENTE');
        console.log(`   - Order ID: ${orderResult.orderId}`);
        console.log(`   - Client Order ID: ${orderResult.clientOrderId}`);
        console.log(`   - Status: ${orderResult.status}`);
        console.log(`   - Símbolo: ${orderResult.symbol}`);
        console.log(`   - Lado: ${orderResult.side}`);
        console.log(`   - Tipo: ${orderResult.type}`);
        console.log(`   - Cantidad: ${orderResult.quantity}`);
        
        // Esperar un momento y verificar el resultado
        console.log('\n Esperando confirmación de ejecución...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Verificar estado de la orden
        try {
            const orderStatus = await api.makeRequest('GET', '/eapi/v1/order', {
                symbol: orderResult.symbol,
                orderId: orderResult.orderId
            });
            
            console.log('\n[DATA] ESTADO DE LA ORDEN:');
            console.log(`   - Status: ${orderStatus.status}`);
            console.log(`   - Cantidad ejecutada: ${orderStatus.executedQty}`);
            console.log(`   - Precio promedio: ${orderStatus.avgPrice || 'N/A'}`);
            
            if (orderStatus.status === 'FILLED') {
                console.log('[OK] ORDEN COMPLETAMENTE EJECUTADA');
                
                // Calcular pérdida realizada
                const executedValue = parseFloat(orderStatus.executedQty) * parseFloat(orderStatus.avgPrice || btcPosition.markPrice);
                const originalCost = parseFloat(btcPosition.entryPrice) * parseFloat(orderStatus.executedQty);
                const realizedPnL = executedValue - originalCost;
                
                console.log(`   - Valor ejecutado: $${executedValue.toFixed(2)}`);
                console.log(`   - Costo original: $${originalCost.toFixed(2)}`);
                console.log(`   - PnL realizado: $${realizedPnL.toFixed(2)}`);
            }
            
        } catch (statusError) {
            console.log(`[WARNING] No se pudo verificar el estado de la orden: ${statusError.message}`);
        }
        
        // Verificar posiciones restantes
        console.log('\n[SEARCH] Verificando posiciones restantes...');
        const updatedPositions = await api.makeRequest('GET', '/eapi/v1/position', {});
        const remainingBTC = updatedPositions.find(pos => 
            pos.symbol === 'BTC-250829-150000-C' && 
            parseFloat(pos.quantity) !== 0
        );
        
        if (!remainingBTC) {
            console.log('[OK] CONFIRMADO: Posición BTC cerrada completamente');
        } else {
            console.log('[WARNING] ADVERTENCIA: Aún queda posición BTC:');
            console.log(`   - Cantidad restante: ${remainingBTC.quantity}`);
            console.log(`   - Cantidad reducible: ${remainingBTC.reducibleQty}`);
        }
        
        // Obtener balance final
        console.log('\n[MONEY] BALANCE FINAL:');
        try {
            const finalBalance = await api.makeRequest('GET', '/eapi/v1/account', {});
            
            if (finalBalance && finalBalance.asset) {
                const usdtAsset = finalBalance.asset.find(asset => asset.asset === 'USDT');
                if (usdtAsset) {
                    console.log(`   - Equity: $${usdtAsset.equity}`);
                    console.log(`   - Available: $${usdtAsset.available}`);
                    console.log(`   - Unrealized PnL: $${usdtAsset.unrealizedPNL}`);
                    console.log(`   - Margin Balance: $${usdtAsset.marginBalance}`);
                }
            }
        } catch (balanceError) {
            console.log(`   - Error obteniendo balance: ${balanceError.message}`);
        }
        
        console.log('\n CIERRE DE EMERGENCIA COMPLETADO');
        console.log('=' .repeat(60));
        
    } catch (error) {
        console.error('\n ERROR CRÍTICO EN CIERRE DE EMERGENCIA:');
        console.error(`   - Error: ${error.message}`);
        console.error(`   - Stack: ${error.stack}`);
        
        console.log('\n RECOMENDACIONES:');
        console.log('   1. Verificar credenciales de API');
        console.log('   2. Verificar permisos de trading en Binance');
        console.log('   3. Cerrar posición manualmente en la interfaz de Binance');
        console.log('   4. Contactar soporte si el problema persiste');
    }
}

// Ejecutar el script
if (require.main === module) {
    emergencyCloseBTCPosition()
        .then(() => {
            console.log('\n[ENDPOINTS] Script de emergencia finalizado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n Error fatal en script de emergencia:', error);
            process.exit(1);
        });
}

module.exports = emergencyCloseBTCPosition;

// Constantes físicas reales del sistema
const PHYSICAL_CONSTANTS = {
  "QUANTUM_COHERENCE": 0.75,
  "QUANTUM_CONSCIOUSNESS": 0.8,
  "QUANTUM_ENTANGLEMENT": 0.65,
  "QUANTUM_SUPERPOSITION": 0.7,
  "QUANTUM_TUNNELING": 0.6,
  "MARKET_VOLATILITY": 0.05,
  "MARKET_MOMENTUM": 0.1,
  "MARKET_LIQUIDITY": 0.75,
  "MARKET_SPREAD": 0.001,
  "MARKET_DEPTH": 500000,
  "FUNDING_RATE": 0.02,
  "FUNDING_VOLATILITY": 0.01,
  "FUNDING_DEVIATION": 0.5,
  "FUNDING_ANNUALIZED": 5,
  "LIQUIDATION_PROBABILITY": 0.05,
  "SLIPPAGE_RATE": 0.0025,
  "VOLATILITY_RISK": 0.1,
  "EXECUTION_RISK": 0.005,
  "VOLUME_24H": 500000,
  "VOLUME_RATIO": 0.75,
  "VOLUME_EXPANSION": 300000,
  "PRICE_CHANGE": 0.02,
  "PRICE_ACCELERATION": 0.015,
  "PRICE_MOMENTUM": 0.01,
  "TIME_TO_FUNDING": 1800000,
  "SESSION_INTENSITY": 0.6,
  "TEMPORAL_RESONANCE": 0.7,
  "FIBONACCI_STRENGTH": 0.75,
  "FIBONACCI_INDEX": 5,
  "NEURAL_CONFIDENCE": 0.85,
  "NEURAL_COHERENCE": 0.8,
  "NEURAL_ENTANGLEMENT": 0.7,
  "BASE_LEVERAGE": 15,
  "CONSERVATIVE_LEVERAGE": 10,
  "AGGRESSIVE_LEVERAGE": 25,
  "STOP_LOSS": 0.03,
  "TAKE_PROFIT": 0.06,
  "BASE_SCORE": 0.65,
  "CONFIDENCE_SCORE": 0.75,
  "QUALITY_SCORE": 0.8
};

/**
 * SCRIPT DE EMERGENCIA - CIERRE INMEDIATO DE POSICIÓN BTC
 * Cierra la posición BTC-250829-150000-C que está perdiendo -71.6%
 */

const AdvancedPositionManager = require('./ADVANCED_POSITION_MANAGEMENT_SYSTEM');
const BinanceConnector = require('./quantum-options-specialist/src/core/binance-connector');
const config = require('./config');

async function emergencyCloseBTCPosition() {
    console.log('[ALERT] INICIANDO CIERRE DE EMERGENCIA DE POSICIÓN BTC');
    console.log('=' .repeat(60));
    
    try {
        // Inicializar conector de Binance
        const binanceConnector = new BinanceConnector(config);
        
        // Inicializar gestor de posiciones
        const positionManager = new AdvancedPositionManager(binanceConnector, {
            defaultStopLoss: 0.01, // 1% para forzar cierre inmediato
            emergencyMode: true
        });
        
        console.log('[OK] Sistemas inicializados');
        
        // Obtener posiciones actuales
        console.log('[DATA] Obteniendo posiciones actuales...');
        const optionsPositions = await positionManager.getOptionsPositions();
        
        console.log(`[UP] Encontradas ${optionsPositions.length} posiciones de opciones`);
        
        // Buscar la posición BTC específica
        const btcPosition = optionsPositions.find(pos => 
            pos.symbol === 'BTC-250829-150000-C' && 
            parseFloat(pos.quantity) !== 0
        );
        
        if (!btcPosition) {
            console.log('[ERROR] No se encontró la posición BTC-250829-150000-C');
            return;
        }
        
        console.log('[ENDPOINTS] POSICIÓN BTC ENCONTRADA:');
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
        
        // Ejecutar cierre de emergencia
        console.log('\n EJECUTANDO CIERRE DE EMERGENCIA...');
        
        const closeResult = await positionManager.closePosition(
            btcPosition, 
            `Cierre de emergencia: pérdida crítica de ${lossPercentage.toFixed(2)}%`
        );
        
        if (closeResult.success) {
            console.log('\n[OK] POSICIÓN CERRADA EXITOSAMENTE');
            console.log(`   - Order ID: ${closeResult.orderId}`);
            console.log(`   - Client Order ID: ${closeResult.clientOrderId}`);
            console.log(`   - Pérdida realizada: $${btcPosition.unrealizedPNL}`);
            
            // Verificar que la posición se cerró
            console.log('\n[SEARCH] Verificando cierre de posición...');
            await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar 3 segundos
            
            const updatedPositions = await positionManager.getOptionsPositions();
            const stillExists = updatedPositions.find(pos => pos.symbol === 'BTC-250829-150000-C');
            
            if (!stillExists || parseFloat(stillExists.quantity) === 0) {
                console.log('[OK] CONFIRMADO: Posición cerrada completamente');
            } else {
                console.log('[WARNING] ADVERTENCIA: La posición aún existe, puede requerir tiempo adicional');
                console.log(`   - Cantidad restante: ${stillExists.quantity}`);
            }
            
        } else {
            console.log('\n[ERROR] ERROR EN EL CIERRE DE POSICIÓN');
            console.log(`   - Error: ${closeResult.error}`);
            
            // Intentar cierre alternativo
            console.log('\n[RELOAD] Intentando método alternativo...');
            
            try {
                const alternativeResult = await positionManager.closeOptionsPosition(btcPosition);
                
                if (alternativeResult.success) {
                    console.log('[OK] CIERRE ALTERNATIVO EXITOSO');
                    console.log(`   - Order ID: ${alternativeResult.orderId}`);
                } else {
                    console.log('[ERROR] CIERRE ALTERNATIVO TAMBIÉN FALLÓ');
                    console.log(`   - Error: ${alternativeResult.error}`);
                }
                
            } catch (altError) {
                console.log(`[ERROR] Error en método alternativo: ${altError.message}`);
            }
        }
        
        // Obtener balance final
        console.log('\n[MONEY] BALANCE FINAL:');
        try {
            const finalBalance = await binanceConnector.makeRequest('GET', '/eapi/v1/account', {}, 'EAPI');
            
            if (finalBalance && finalBalance.asset) {
                const usdtAsset = finalBalance.asset.find(asset => asset.asset === 'USDT');
                if (usdtAsset) {
                    console.log(`   - Equity: $${usdtAsset.equity}`);
                    console.log(`   - Available: $${usdtAsset.available}`);
                    console.log(`   - Unrealized PnL: $${usdtAsset.unrealizedPNL}`);
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
        
        // Intentar cierre directo con API
        console.log('\n INTENTANDO CIERRE DIRECTO CON API...');
        
        try {
            const binanceConnector = new BinanceConnector(config);
            
            // Parámetros de orden de cierre directo
            const orderParams = {
                symbol: 'BTC-250829-150000-C',
                side: 'SELL', // Cerrar posición LONG
                type: 'MARKET',
                quantity: '5', // Cantidad reducible
                reduceOnly: 'true'
            };
            
            console.log(` Enviando orden directa: ${JSON.stringify(orderParams)}`);
            
            const directResult = await binanceConnector.makeRequest('POST', '/eapi/v1/order', orderParams, 'EAPI');
            
            console.log('[OK] ORDEN DIRECTA ENVIADA EXITOSAMENTE');
            console.log(`   - Order ID: ${directResult.orderId}`);
            console.log(`   - Status: ${directResult.status}`);
            
        } catch (directError) {
            console.error('[ERROR] CIERRE DIRECTO TAMBIÉN FALLÓ');
            console.error(`   - Error: ${directError.message}`);
        }
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
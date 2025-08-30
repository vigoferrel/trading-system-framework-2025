
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
 * Script para forzar el cierre de todas las posiciones activas
 */

const BinanceConnector = require('./binance-connector');
const config = require('./config');
const crypto = require('crypto');

class ForcePositionCloser {
    constructor() {
        this.binanceConnector = new BinanceConnector(config.binance);
    }

    async forceCloseAllPositions() {
        console.log('[ALERT] FORZANDO CIERRE DE TODAS LAS POSICIONES ACTIVAS...');
        
        try {
            // Método 1: Cerrar todas las posiciones de futuros usando endpoint directo
            await this.closeAllFuturesPositionsDirectly();
            
            // Método 2: Verificar y mostrar posiciones de opciones
            await this.showOptionsPositions();
            
            console.log('[OK] Proceso de cierre forzado completado');
            
        } catch (error) {
            console.error('[ERROR] Error en cierre forzado:', error.message);
        }
    }
    
    async closeAllFuturesPositionsDirectly() {
        console.log('[RELOAD] Cerrando todas las posiciones de futuros...');
        
        try {
            // Obtener todas las posiciones usando el endpoint correcto
            const positions = await this.getFuturesPositionsRaw();
            
            console.log(`[DATA] Posiciones de futuros encontradas: ${positions.length}`);
            
            for (const position of positions) {
                const positionAmt = parseFloat(position.positionAmt);
                if (Math.abs(positionAmt) > 0) {
                    console.log(`[LIST] Posición activa: ${position.symbol} - Cantidad: ${positionAmt}`);
                    await this.forceClosePosition(position);
                    await this.sleep(500); // Esperar entre órdenes
                }
            }
            
        } catch (error) {
            console.error('[ERROR] Error cerrando posiciones de futuros:', error.message);
        }
    }
    
    async getFuturesPositionsRaw() {
        const timestamp = Date.now() + (this.binanceConnector.timeOffsetMs || 0);
        const params = `timestamp=${timestamp}&recvWindow=5000`;
        const signature = crypto
            .createHmac('sha256', this.binanceConnector.config.apiSecret)
            .update(params)
            .digest('hex');
        
        const url = `${this.binanceConnector.config.futuresBaseUrl}/positionRisk?${params}&signature=${signature}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-MBX-APIKEY': this.binanceConnector.config.apiKey
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const positions = await response.json();
        return positions.filter(pos => Math.abs(parseFloat(pos.positionAmt)) > 0);
    }
    
    async forceClosePosition(position) {
        try {
            const symbol = position.symbol;
            const positionAmt = parseFloat(position.positionAmt);
            const side = positionAmt > 0 ? 'SELL' : 'BUY';
            const quantity = Math.abs(positionAmt);
            
            console.log(`[RELOAD] Cerrando ${symbol}: ${side} ${quantity}`);
            
            // Usar el método del BinanceConnector directamente
            const orderParams = {
                symbol: symbol,
                side: side,
                type: 'MARKET',
                quantity: this.formatQuantity(symbol, quantity),
                reduceOnly: true
            };
            
            console.log('[LIST] Parámetros:', orderParams);
            
            const result = await this.binanceConnector.placeFuturesOrder(orderParams);
            
            if (result && result.orderId) {
                console.log(`[OK] ${symbol} cerrado exitosamente - Order ID: ${result.orderId}`);
            } else {
                console.log(`[WARNING] Respuesta inesperada para ${symbol}:`, result);
            }
            
        } catch (error) {
            console.error(`[ERROR] Error cerrando ${position.symbol}:`, error.message);
            
            // Intentar cerrar con orden de mercado simple
            try {
                console.log(`[RELOAD] Intentando cierre alternativo para ${position.symbol}...`);
                await this.alternativeClose(position);
            } catch (altError) {
                console.error(`[ERROR] Cierre alternativo falló:`, altError.message);
            }
        }
    }
    
    async alternativeClose(position) {
        const symbol = position.symbol;
        const positionAmt = parseFloat(position.positionAmt);
        const side = positionAmt > 0 ? 'SELL' : 'BUY';
        const quantity = Math.abs(positionAmt);
        
        // Crear orden manualmente con timestamp
        const timestamp = Date.now() + (this.binanceConnector.timeOffsetMs || 0);
        const params = new URLSearchParams({
            symbol: symbol,
            side: side,
            type: 'MARKET',
            quantity: this.formatQuantity(symbol, quantity),
            reduceOnly: 'true',
            timestamp: timestamp.toString(),
            recvWindow: '5000'
        });
        
        const signature = crypto
            .createHmac('sha256', this.binanceConnector.config.apiSecret)
            .update(params.toString())
            .digest('hex');
        
        params.append('signature', signature);
        
        const url = `${this.binanceConnector.config.futuresBaseUrl}/order`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-MBX-APIKEY': this.binanceConnector.config.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });
        
        const result = await response.json();
        
        if (response.ok && result.orderId) {
            console.log(`[OK] ${symbol} cerrado con método alternativo - Order ID: ${result.orderId}`);
        } else {
            console.log(`[ERROR] Método alternativo falló para ${symbol}:`, result);
        }
    }
    
    async showOptionsPositions() {
        console.log('[LIST] Verificando posiciones de opciones...');
        
        try {
            const positions = await this.binanceConnector.getOptionsPositions();
            
            if (positions.length === 0) {
                console.log('[OK] No hay posiciones de opciones');
                return;
            }
            
            console.log(`[DATA] Posiciones de opciones encontradas: ${positions.length}`);
            
            for (const position of positions) {
                console.log(`[LIST] ${position.symbol}:`);
                console.log(`   - Lado: ${position.side}`);
                console.log(`   - Cantidad: ${position.quantity}`);
                console.log(`   - PnL: ${position.unrealizedPNL} USDT`);
                console.log(`   [WARNING] DEBE CERRARSE MANUALMENTE EN BINANCE APP`);
            }
            
        } catch (error) {
            console.error('[ERROR] Error obteniendo posiciones de opciones:', error.message);
        }
    }
    
    formatQuantity(symbol, quantity) {
        const precisionRules = {
            'BTCUSDT': 3,
            'ETHUSDT': 3,
            'BNBUSDT': 2,
            'SOLUSDT': 1,
            'XRPUSDT': 0,
            'DOGEUSDT': 0
        };
        
        const decimals = precisionRules[symbol] || 3;
        return parseFloat(quantity.toFixed(decimals)).toString();
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Ejecutar el script
async function main() {
    const closer = new ForcePositionCloser();
    await closer.forceCloseAllPositions();
    process.exit(0);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = ForcePositionCloser;
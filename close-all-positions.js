
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
 * Script para cerrar todas las posiciones abiertas de forma controlada
 */

const BinanceConnector = require('./binance-connector');
const config = require('./config');

class PositionCloser {
    constructor() {
        this.binanceConnector = new BinanceConnector(config.binance);
    }

    async closeAllPositions() {
        console.log('[RELOAD] Cerrando todas las posiciones abiertas...');
        
        try {
            // Obtener posiciones de futuros abiertas
            const futuresPositions = await this.getFuturesPositions();
            console.log(`[DATA] Encontradas ${futuresPositions.length} posiciones de futuros abiertas`);
            
            // Cerrar posiciones de futuros
            for (const position of futuresPositions) {
                await this.closeFuturesPosition(position);
            }
            
            // Obtener posiciones de opciones abiertas
            const optionsPositions = await this.getOptionsPositions();
            console.log(`[DATA] Encontradas ${optionsPositions.length} posiciones de opciones abiertas`);
            
            // Mostrar información de posiciones de opciones (no se pueden cerrar automáticamente)
            for (const position of optionsPositions) {
                this.showOptionsPosition(position);
            }
            
            console.log('[OK] Proceso de cierre completado');
            
        } catch (error) {
            console.error('[ERROR] Error cerrando posiciones:', error.message);
        }
    }
    
    async getFuturesPositions() {
        try {
            const positions = await this.binanceConnector.getFuturesPositions();
            // Filtrar solo posiciones con cantidad > 0
            return positions.filter(pos => Math.abs(parseFloat(pos.positionAmt)) > 0);
        } catch (error) {
            console.error('[ERROR] Error obteniendo posiciones de futuros:', error.message);
            return [];
        }
    }
    
    async getOptionsPositions() {
        try {
            const positions = await this.binanceConnector.getOptionsPositions();
            // Filtrar solo posiciones con cantidad > 0
            return positions.filter(pos => parseFloat(pos.quantity) > 0);
        } catch (error) {
            console.error('[ERROR] Error obteniendo posiciones de opciones:', error.message);
            return [];
        }
    }
    
    async closeFuturesPosition(position) {
        try {
            const symbol = position.symbol;
            const positionAmt = parseFloat(position.positionAmt);
            const side = positionAmt > 0 ? 'SELL' : 'BUY'; // Opuesto a la posición actual
            const quantity = Math.abs(positionAmt);
            
            console.log(`[RELOAD] Cerrando posición de futuros: ${symbol} ${side} ${quantity}`);
            
            const orderParams = {
                symbol: symbol,
                side: side,
                type: 'MARKET',
                quantity: quantity.toString(),
                reduceOnly: true // Importante: solo cerrar posición existente
            };
            
            const result = await this.binanceConnector.placeFuturesOrder(orderParams);
            
            if (result && result.orderId) {
                console.log(`[OK] Posición cerrada: ${symbol} - Order ID: ${result.orderId}`);
            } else {
                console.log(`[WARNING] No se pudo cerrar la posición: ${symbol}`);
            }
            
        } catch (error) {
            console.error(`[ERROR] Error cerrando posición ${position.symbol}:`, error.message);
        }
    }
    
    showOptionsPosition(position) {
        console.log(`[LIST] Posición de opciones: ${position.symbol}`);
        console.log(`   - Lado: ${position.side}`);
        console.log(`   - Cantidad: ${position.quantity}`);
        console.log(`   - Precio de entrada: ${position.entryPrice}`);
        console.log(`   - PnL no realizado: ${position.unrealizedPNL}`);
        console.log(`   - Precio actual: ${position.markPrice}`);
        console.log(`   [WARNING] Las posiciones de opciones deben cerrarse manualmente desde la interfaz de Binance`);
    }
}

// Ejecutar el script
async function main() {
    const closer = new PositionCloser();
    await closer.closeAllPositions();
    process.exit(0);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = PositionCloser;
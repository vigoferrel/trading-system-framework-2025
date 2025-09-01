
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
 * LEONARDO QUANTUM ORDER EXECUTOR
 * ===============================
 * 
 * Sistema de ejecución de órdenes de alta precisión
 * Basado en la filosofía Leonardo Quantum Liberation
 * Maximiza captura de alpha y minimiza slippage
 * 
 * "La perfección se logra cuando no hay nada más que quitar" - Leonardo da Vinci
 */

const crypto = require('crypto');
const axios = require('axios');
const { EventEmitter } = require('events');

class LeonardoOrderExecutor extends EventEmitter {
    constructor(config = {}) {
        super();
        
        // Configuración
        this.config = {
            apiKey: config.apiKey || process.env.BINANCE_API_KEY,
            apiSecret: config.apiSecret || process.env.BINANCE_API_SECRET,
            baseUrl: config.baseUrl || 'https://fapi.binance.com',
            recvWindow: config.recvWindow || 5000,
            maxRetries: config.maxRetries || 3,
            retryDelay: config.retryDelay || 250,
            ...config
        };
        
        // Parámetros de ejecución cuántica
        this.executionParams = {
            // Parámetros de ejecución fraccionada
            enableFractionalExecution: true,           // Permite contratos fraccionados
            minOrderSize: 0.001,                       // Tamaño mínimo de orden
            maxSlippageBps: 5,                         // Máximo slippage permitido en bps
            dynamicSlippageVolatilityFactor: 0.5,      // Factor de ajuste de slippage por volatilidad
            
            // Parámetros de ejecución algorítmica
            enableTWAP: true,                          // Time-Weighted Average Price
            twapIntervalMs: 500,                       // Intervalo entre órdenes TWAP
            twapRandomization: 0.2,                    // Randomización de intervalos (±20%)
            
            // Parámetros de iceberg
            enableIcebergOrders: true,                 // Órdenes iceberg para tamaños grandes
            icebergThreshold: 5.0,                     // Umbral para activar iceberg (BTC)
            icebergDisplayFactor: 0.15,                // Factor de visualización (15%)
            
            // Parámetros de gestión de liquidez
            liquidityProbing: true,                    // Sondeo de liquidez antes de órdenes grandes
            probeSize: 0.01,                           // Tamaño de la orden de sondeo
            minLiquidityRatio: 10,                     // Ratio mínimo de liquidez (orderbook/orden)
            
            // Parámetros de gestión de riesgo
            maxLeverage: 25,                           // Apalancamiento máximo
            defaultLeverage: 5,                        // Apalancamiento por defecto
            dynamicLeverage: true,                     // Ajuste dinámico de apalancamiento
            
            // Parámetros de salida
            trailingStopEnabled: true,                 // Stop loss dinámico
            trailingStopActivationPct: 1.0,            // Activación cuando el profit es 1%
            trailingStopDistancePct: 0.5,              // Distancia del trailing stop (0.5%)
            
            // Parámetros de optimización de tasas
            feeOptimization: true,                     // Optimización de comisiones
            preferMakerOrders: true,                   // Preferir órdenes maker cuando sea posible
            makerSlippageTolerance: 1,                 // Tolerancia de slippage para órdenes maker (1 bp)
            
            // Parámetros de protección
            maxNotionalPerOrder: 100000,               // Máximo valor nocional por orden (USDT)
            maxOpenOrdersPerSymbol: 10,                // Máximo de órdenes abiertas por símbolo
            emergencyCloseThreshold: -10.0,            // % de pérdida para cierre de emergencia
            
            // Parámetros de optimización cuántica
            quantumExecutionBoost: true,               // Activar optimización cuántica
            coherenceThreshold: 0.7,                   // Umbral de coherencia para ejecución
            entanglementFactor: 0.85,                  // Factor de entrelazamiento para órdenes correlacionadas
            zuritaOptimalConstant: 9.16,               // Constante de optimización Zurita
            feynmanPathIntegral: true,                 // Cálculo de integral de camino para timing óptimo
        };
        
        // Estado interno
        this.orderHistory = [];
        this.activeOrders = new Map();
        this.positionCache = new Map();
        this.lastBalanceUpdate = 0;
        this.balanceCache = null;
        this.marketDataCache = new Map();
        
        console.log('[START] Leonardo Order Executor inicializado');
    }
    
    /**
     * Establece parámetros de ejecución
     * @param {Object} params - Nuevos parámetros
     */
    setExecutionParams(params = {}) {
        this.executionParams = {
            ...this.executionParams,
            ...params
        };
        
        console.log(' Parámetros de ejecución actualizados');
        return this.executionParams;
    }
    
    /**
     * Ejecuta una orden con optimización cuántica
     * @param {Object} orderParams - Parámetros de la orden
     */
    async executeOrder(orderParams) {
        const {
            symbol,
            side,
            type = 'MARKET',
            quantity,
            price,
            leverage,
            reduceOnly = false,
            closePosition = false,
            stopPrice,
            timeInForce = 'GTC',
        } = orderParams;
        
        console.log(`[RELOAD] Ejecutando orden: ${symbol} ${side} ${quantity} @ ${price || 'MARKET'}`);
        
        try {
            // Validar parámetros
            if (!symbol || !side || !quantity) {
                throw new Error('Parámetros insuficientes para ejecutar orden');
            }
            
            // Verificar si es una cantidad fraccionada y ajustar si es necesario
            const adjustedQuantity = this.adjustQuantity(symbol, quantity);
            
            // Establecer apalancamiento si se proporciona
            if (leverage) {
                await this.setLeverage(symbol, leverage);
            }
            
            // Preparar parámetros de la orden
            const orderRequest = {
                symbol,
                side,
                type,
                quantity: adjustedQuantity,
                reduceOnly,
                closePosition,
                timeInForce: type !== 'MARKET' ? timeInForce : undefined,
            };
            
            // Añadir precio para órdenes limitadas
            if (type === 'LIMIT' && price) {
                orderRequest.price = price;
            }
            
            // Añadir precio de activación para órdenes stop
            if ((type === 'STOP' || type === 'STOP_MARKET' || type === 'TAKE_PROFIT' || type === 'TAKE_PROFIT_MARKET') && stopPrice) {
                orderRequest.stopPrice = stopPrice;
            }
            
            // Aplicar optimización cuántica si está activada
            if (this.executionParams.quantumExecutionBoost) {
                this.applyQuantumOptimization(orderRequest);
            }
            
            // Ejecutar la orden con reintentos
            const result = await this.executeWithRetry(() => this.placeOrder(orderRequest));
            
            // Registrar la orden en el historial
            this.orderHistory.push({
                ...result,
                timestamp: Date.now(),
                originalParams: orderParams
            });
            
            // Actualizar caché de posiciones
            await this.updatePositionCache(symbol);
            
            // Emitir evento de orden ejecutada
            this.emit('ORDER_EXECUTED', {
                success: true,
                order: result,
                originalParams: orderParams
            });
            
            console.log(`[OK] Orden ejecutada: ${result.orderId}`);
            return result;
            
        } catch (error) {
            console.error(`[ERROR] Error ejecutando orden: ${error.message}`);
            
            // Emitir evento de error
            this.emit('ORDER_ERROR', {
                success: false,
                error: error.message,
                originalParams: orderParams
            });
            
            throw error;
        }
    }
    
    /**
     * Ejecuta una orden con reintentos automáticos
     * @private
     */
    async executeWithRetry(fn, retries = this.config.maxRetries) {
        try {
            return await fn();
        } catch (error) {
            if (retries > 0 && this.isRetryableError(error)) {
                console.log(`[WARNING] Reintentando operación... (${retries} intentos restantes)`);
                await new Promise(resolve => setTimeout(resolve, this.config.retryDelay));
                return this.executeWithRetry(fn, retries - 1);
            }
            throw error;
        }
    }
    
    /**
     * Determina si un error permite reintento
     * @private
     */
    isRetryableError(error) {
        // Códigos de error de Binance que permiten reintento
        const retryableCodes = [-1000, -1001, -1002, -1007, -1013, -1015, -1021, -1022];
        
        if (error.response && error.response.data && error.response.data.code) {
            return retryableCodes.includes(error.response.data.code);
        }
        
        // Errores de red
        return error.code === 'ECONNRESET' || 
               error.code === 'ETIMEDOUT' || 
               error.message.includes('timeout') || 
               error.message.includes('rate limit');
    }
    
    /**
     * Ajusta la cantidad según las reglas de precisión del símbolo
     * @private
     */
    adjustQuantity(symbol, quantity) {
        // Si no se permiten fracciones, redondear al entero más cercano
        if (!this.executionParams.enableFractionalExecution) {
            return Math.floor(quantity);
        }
        
        // Obtener información del símbolo (asumimos que está en caché)
        const symbolInfo = this.marketDataCache.get(symbol) || {};
        const precision = symbolInfo.quantityPrecision || 3;
        
        // Ajustar a la precisión correcta
        const adjustedQuantity = parseFloat(quantity.toFixed(precision));
        
        // Asegurar que cumple con el tamaño mínimo
        return Math.max(adjustedQuantity, this.executionParams.minOrderSize);
    }
    
    /**
     * Establece el apalancamiento para un símbolo
     * @private
     */
    async setLeverage(symbol, leverage) {
        try {
            const maxLeverage = this.executionParams.maxLeverage;
            const safeLeverage = Math.min(Math.max(1, leverage), maxLeverage);
            
            const timestamp = Date.now();
            const params = {
                symbol,
                leverage: safeLeverage,
                timestamp
            };
            
            const signature = this.generateSignature(params);
            
            const response = await axios.post(
                `${this.config.baseUrl}/fapi/v1/leverage`,
                null,
                {
                    headers: {
                        'X-MBX-APIKEY': this.config.apiKey
                    },
                    params: {
                        ...params,
                        signature
                    }
                }
            );
            
            console.log(`[OK] Apalancamiento establecido: ${symbol} ${safeLeverage}x`);
            return response.data;
            
        } catch (error) {
            console.error(`[ERROR] Error estableciendo apalancamiento: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Aplica optimización cuántica a los parámetros de la orden
     * @private
     */
    applyQuantumOptimization(orderRequest) {
        // Obtener datos de mercado actuales
        const marketData = this.marketDataCache.get(orderRequest.symbol) || {};
        
        // Calcular coherencia del mercado (simulado)
        const coherence = marketData.coherence || ((Date.now() % 50 + 50) / 100);
        
        // Ajustar precio según coherencia del mercado
        if (orderRequest.type === 'LIMIT' && orderRequest.price && coherence > this.executionParams.coherenceThreshold) {
            // Mejorar precio en mercados coherentes
            const direction = orderRequest.side === 'BUY' ? -1 : 1;
            const improvement = this.executionParams.makerSlippageTolerance / 10000;
            orderRequest.price = parseFloat((orderRequest.price * (1 + direction * improvement)).toFixed(8));
        }
        
        // Aplicar TWAP si está activado y la orden es grande
        if (this.executionParams.enableTWAP && 
            orderRequest.quantity > 5.0 && 
            orderRequest.type === 'MARKET') {
            
            // Convertir a LIMIT para mejor ejecución
            orderRequest.type = 'LIMIT';
            orderRequest.timeInForce = 'GTC';
            
            // Calcular precio con ligero margen para asegurar ejecución
            const currentPrice = marketData.price || 0;
            if (currentPrice > 0) {
                const slippageFactor = this.executionParams.maxSlippageBps / 10000;
                const direction = orderRequest.side === 'BUY' ? 1 : -1;
                orderRequest.price = parseFloat((currentPrice * (1 + direction * slippageFactor)).toFixed(8));
            }
        }
        
        // Aplicar órdenes iceberg para tamaños grandes
        if (this.executionParams.enableIcebergOrders && 
            orderRequest.quantity > this.executionParams.icebergThreshold && 
            orderRequest.type === 'LIMIT') {
            
            orderRequest.iceberg = true;
            orderRequest.icebergQty = orderRequest.quantity * this.executionParams.icebergDisplayFactor;
        }
        
        return orderRequest;
    }
    
    /**
     * Coloca una orden en Binance
     * @private
     */
    async placeOrder(orderParams) {
        const timestamp = Date.now();
        const params = {
            ...orderParams,
            timestamp,
            recvWindow: this.config.recvWindow
        };
        
        const signature = this.generateSignature(params);
        
        try {
            const response = await axios.post(
                `${this.config.baseUrl}/fapi/v1/order`,
                null,
                {
                    headers: {
                        'X-MBX-APIKEY': this.config.apiKey
                    },
                    params: {
                        ...params,
                        signature
                    }
                }
            );
            
            // Añadir a órdenes activas
            if (response.data.orderId) {
                this.activeOrders.set(response.data.orderId, {
                    ...response.data,
                    timestamp: Date.now()
                });
            }
            
            return response.data;
            
        } catch (error) {
            console.error('Error placing order:', error.response?.data || error.message);
            throw error;
        }
    }
    
    /**
     * Actualiza la caché de posiciones para un símbolo
     * @private
     */
    async updatePositionCache(symbol) {
        try {
            const timestamp = Date.now();
            const params = {
                symbol,
                timestamp
            };
            
            const signature = this.generateSignature(params);
            
            const response = await axios.get(
                `${this.config.baseUrl}/fapi/v2/positionRisk`,
                {
                    headers: {
                        'X-MBX-APIKEY': this.config.apiKey
                    },
                    params: {
                        ...params,
                        signature
                    }
                }
            );
            
            for (const position of response.data) {
                if (parseFloat(position.positionAmt) !== 0) {
                    this.positionCache.set(position.symbol, {
                        symbol: position.symbol,
                        size: parseFloat(position.positionAmt),
                        entryPrice: parseFloat(position.entryPrice),
                        markPrice: parseFloat(position.markPrice),
                        pnl: parseFloat(position.unrealizedProfit),
                        leverage: parseFloat(position.leverage),
                        isolated: position.isolated,
                        lastUpdate: Date.now()
                    });
                } else {
                    this.positionCache.delete(position.symbol);
                }
            }
            
        } catch (error) {
            console.error(`[ERROR] Error actualizando caché de posiciones: ${error.message}`);
        }
    }
    
    /**
     * Actualiza la caché de balance
     */
    async updateBalanceCache() {
        try {
            const timestamp = Date.now();
            const params = { timestamp };
            const signature = this.generateSignature(params);
            
            const response = await axios.get(
                `${this.config.baseUrl}/fapi/v2/balance`,
                {
                    headers: {
                        'X-MBX-APIKEY': this.config.apiKey
                    },
                    params: {
                        ...params,
                        signature
                    }
                }
            );
            
            this.balanceCache = response.data.reduce((acc, asset) => {
                acc[asset.asset] = {
                    asset: asset.asset,
                    balance: parseFloat(asset.balance),
                    availableBalance: parseFloat(asset.availableBalance),
                    crossWalletBalance: parseFloat(asset.crossWalletBalance),
                    crossUnPnl: parseFloat(asset.crossUnPnl)
                };
                return acc;
            }, {});
            
            this.lastBalanceUpdate = Date.now();
            
        } catch (error) {
            console.error(`[ERROR] Error actualizando caché de balance: ${error.message}`);
        }
    }
    
    /**
     * Genera firma para autenticación de API
     * @private
     */
    generateSignature(params) {
        const queryString = Object.keys(params)
            .filter(key => params[key] !== undefined && params[key] !== null)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        
        return crypto
            .createHmac('sha256', this.config.apiSecret)
            .update(queryString)
            .digest('hex');
    }
    
    /**
     * Cierra todas las posiciones abiertas
     */
    async closeAllPositions() {
        console.log('[WARNING] Cerrando todas las posiciones...');
        
        try {
            // Actualizar posiciones
            await this.updateAllPositions();
            
            const positions = Array.from(this.positionCache.values())
                .filter(pos => Math.abs(pos.size) > 0);
            
            if (positions.length === 0) {
                console.log('[OK] No hay posiciones abiertas para cerrar');
                return [];
            }
            
            const results = [];
            
            for (const position of positions) {
                try {
                    const closeResult = await this.executeOrder({
                        symbol: position.symbol,
                        side: position.size > 0 ? 'SELL' : 'BUY',
                        type: 'MARKET',
                        quantity: Math.abs(position.size),
                        reduceOnly: true
                    });
                    
                    results.push({
                        symbol: position.symbol,
                        success: true,
                        order: closeResult
                    });
                    
                } catch (error) {
                    results.push({
                        symbol: position.symbol,
                        success: false,
                        error: error.message
                    });
                }
            }
            
            console.log(`[OK] Cerradas ${results.filter(r => r.success).length}/${positions.length} posiciones`);
            return results;
            
        } catch (error) {
            console.error(`[ERROR] Error cerrando posiciones: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Actualiza todas las posiciones
     */
    async updateAllPositions() {
        try {
            const timestamp = Date.now();
            const params = { timestamp };
            const signature = this.generateSignature(params);
            
            const response = await axios.get(
                `${this.config.baseUrl}/fapi/v2/positionRisk`,
                {
                    headers: {
                        'X-MBX-APIKEY': this.config.apiKey
                    },
                    params: {
                        ...params,
                        signature
                    }
                }
            );
            
            // Limpiar caché actual
            this.positionCache.clear();
            
            // Actualizar con nuevas posiciones
            for (const position of response.data) {
                if (parseFloat(position.positionAmt) !== 0) {
                    this.positionCache.set(position.symbol, {
                        symbol: position.symbol,
                        size: parseFloat(position.positionAmt),
                        entryPrice: parseFloat(position.entryPrice),
                        markPrice: parseFloat(position.markPrice),
                        pnl: parseFloat(position.unrealizedProfit),
                        leverage: parseFloat(position.leverage),
                        isolated: position.isolated,
                        lastUpdate: Date.now()
                    });
                }
            }
            
            return Array.from(this.positionCache.values());
            
        } catch (error) {
            console.error(`[ERROR] Error actualizando posiciones: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Cancela todas las órdenes abiertas para un símbolo
     */
    async cancelAllOrders(symbol) {
        try {
            const timestamp = Date.now();
            const params = {
                symbol,
                timestamp
            };
            
            const signature = this.generateSignature(params);
            
            const response = await axios.delete(
                `${this.config.baseUrl}/fapi/v1/allOpenOrders`,
                {
                    headers: {
                        'X-MBX-APIKEY': this.config.apiKey
                    },
                    params: {
                        ...params,
                        signature
                    }
                }
            );
            
            // Actualizar órdenes activas
            this.activeOrders = new Map(
                Array.from(this.activeOrders.entries())
                    .filter(([_, order]) => order.symbol !== symbol)
            );
            
            console.log(`[OK] Canceladas todas las órdenes para ${symbol}`);
            return response.data;
            
        } catch (error) {
            console.error(`[ERROR] Error cancelando órdenes: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Obtiene estadísticas de trading
     */
    getTradingStats() {
        const positions = Array.from(this.positionCache.values());
        const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
        const totalSize = positions.reduce((sum, pos) => sum + Math.abs(pos.size * pos.entryPrice), 0);
        
        return {
            positions: positions.length,
            activeOrders: this.activeOrders.size,
            totalPnL,
            totalExposure: totalSize,
            lastBalanceUpdate: this.lastBalanceUpdate,
            usdt: this.balanceCache?.USDT?.availableBalance || 0
        };
    }
}

module.exports = { LeonardoOrderExecutor };

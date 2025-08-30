
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
 * LEONARDO QUANTUM TRADER
 * ======================
 * 
 * Sistema integrado de trading cuántico
 * Basado en la filosofía Leonardo Quantum Liberation
 * Integra todos los componentes para maximizar el profit
 * 
 * "La simplicidad es la máxima sofisticación" - Leonardo da Vinci
 */

const { EventEmitter } = require('events');
// Importaciones condicionales para evitar errores si los archivos no existen
const LeonardoOrderExecutor = (() => {
    try {
        return require('./LeonardoOrderExecutor').LeonardoOrderExecutor;
    } catch (e) {
        console.warn('[WARNING] LeonardoOrderExecutor no disponible, usando implementación simulada');
        return class MockOrderExecutor extends EventEmitter {
            constructor() {
                super();
                this.balanceCache = { USDT: { availableBalance: 10000 } };
            }
            async executeOrder() { return { orderId: 'mock-' + Date.now() }; }
            async updateBalanceCache() {}
            async updateAllPositions() { return []; }
            async closeAllPositions() { return []; }
        };
    }
})();
// Importación condicional para LeonardoLeverageMatrix
const LeonardoLeverageMatrix = (() => {
    try {
        return require('./LeonardoLeverageMatrix').LeonardoLeverageMatrix;
    } catch (e) {
        console.warn('[WARNING] LeonardoLeverageMatrix no disponible, usando implementación simulada');
        return class MockLeverageMatrix {
            constructor() {}
            setRiskProfile() { return true; }
            calculateOptimalPositionSize() { return { positionSize: 1, leverage: 5 }; }
        };
    }
})();

class LeonardoQuantumTrader extends EventEmitter {
    constructor(config = {}) {
        super();
        
        // Configuración
        this.config = {
            apiKey: config.apiKey || process.env.BINANCE_API_KEY,
            apiSecret: config.apiSecret || process.env.BINANCE_API_SECRET,
            baseUrl: config.baseUrl || 'https://fapi.binance.com',
            riskProfile: config.riskProfile || 'balanced',
            maxPositions: config.maxPositions || 10,
            maxSymbolPositions: config.maxSymbolPositions || 2,
            maxStrategyPositions: config.maxStrategyPositions || 3,
            enableFractionalContracts: config.enableFractionalContracts !== false,
            defaultRiskPerTrade: config.defaultRiskPerTrade || 1.0, // % del capital
            profitTarget: config.profitTarget || 2.0, // % del capital
            stopLossDefault: config.stopLossDefault || 1.0, // % del capital
            trailingStop: config.trailingStop !== false,
            ...config
        };
        
        // Componentes del sistema
        this.orderExecutor = new LeonardoOrderExecutor({
            apiKey: this.config.apiKey,
            apiSecret: this.config.apiSecret,
            baseUrl: this.config.baseUrl
        });
        
        this.leverageMatrix = new LeonardoLeverageMatrix({
            riskToleranceLevel: this.config.riskProfile,
            enableFractionalLeverage: true
        });
        
        // Estado del sistema
        this.isRunning = false;
        this.activePositions = [];
        this.pendingOrders = [];
        this.tradeHistory = [];
        this.marketData = new Map();
        this.lastUpdate = Date.now();
        
        // Métricas de rendimiento
        this.performanceMetrics = {
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            totalProfit: 0,
            totalLoss: 0,
            maxDrawdown: 0,
            currentDrawdown: 0,
            winRate: 0,
            profitFactor: 0,
            averageWin: 0,
            averageLoss: 0,
            sharpeRatio: 0,
            sortinoRatio: 0
        };
        
        // Configurar event listeners
        this._setupEventListeners();
        
        console.log('[START] Leonardo Quantum Trader inicializado');
        console.log(`[DATA] Perfil de riesgo: ${this.config.riskProfile}`);
        console.log(`[MONEY] Contratos fraccionados: ${this.config.enableFractionalContracts ? 'Activados' : 'Desactivados'}`);
    }
    
    /**
     * Configura los event listeners
     * @private
     */
    _setupEventListeners() {
        // Eventos del ejecutor de órdenes
        this.orderExecutor.on('ORDER_EXECUTED', (data) => {
            console.log(`[OK] Orden ejecutada: ${data.order.symbol} ${data.order.side} ${data.order.origQty}`);
            this._processExecutedOrder(data);
            this.emit('TRADE_EXECUTED', data);
        });
        
        this.orderExecutor.on('ORDER_ERROR', (data) => {
            console.error(`[ERROR] Error en orden: ${data.error}`);
            this.emit('TRADE_ERROR', data);
        });
    }
    
    /**
     * Inicia el sistema
     */
    async start() {
        if (this.isRunning) {
            console.log('[WARNING] El sistema ya está en ejecución');
            return false;
        }
        
        try {
            console.log('[RELOAD] Iniciando Leonardo Quantum Trader...');
            
            // Configurar perfil de riesgo
            this.leverageMatrix.setRiskProfile(this.config.riskProfile);
            
            // Sincronizar posiciones existentes
            await this._syncPositions();
            
            this.isRunning = true;
            this.lastUpdate = Date.now();
            
            console.log('[OK] Leonardo Quantum Trader iniciado correctamente');
            this.emit('SYSTEM_STARTED', {
                timestamp: Date.now(),
                activePositions: this.activePositions.length
            });
            
            return true;
        } catch (error) {
            console.error('[ERROR] Error al iniciar el sistema:', error.message);
            return false;
        }
    }
    
    /**
     * Detiene el sistema
     */
    async stop() {
        if (!this.isRunning) {
            console.log('[WARNING] El sistema no está en ejecución');
            return false;
        }
        
        try {
            console.log('[RELOAD] Deteniendo Leonardo Quantum Trader...');
            
            this.isRunning = false;
            
            console.log('[OK] Leonardo Quantum Trader detenido correctamente');
            this.emit('SYSTEM_STOPPED', {
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error('[ERROR] Error al detener el sistema:', error.message);
            return false;
        }
    }
    
    /**
     * Sincroniza las posiciones existentes
     * @private
     */
    async _syncPositions() {
        try {
            // Obtener posiciones actuales
            const positions = await this.orderExecutor.updateAllPositions();
            
            // Actualizar posiciones activas
            this.activePositions = positions.map(pos => ({
                id: `${pos.symbol}_${pos.entryTime || Date.now()}`,
                symbol: pos.symbol,
                side: pos.size > 0 ? 'BUY' : 'SELL',
                size: Math.abs(pos.size),
                entryPrice: pos.entryPrice,
                markPrice: pos.markPrice,
                pnl: pos.pnl,
                leverage: pos.leverage,
                entryTime: pos.lastUpdate,
                status: 'OPEN'
            }));
            
            console.log(`[DATA] Sincronizadas ${this.activePositions.length} posiciones activas`);
            return this.activePositions;
        } catch (error) {
            console.error('[ERROR] Error sincronizando posiciones:', error.message);
            throw error;
        }
    }
    
    /**
     * Procesa una oportunidad de trading
     * @param {Object} opportunity - Oportunidad de trading
     */
    async processOpportunity(opportunity) {
        if (!this.isRunning) {
            console.log('[WARNING] El sistema no está en ejecución. Oportunidad ignorada.');
            return null;
        }
        
        try {
            console.log(`[SEARCH] Procesando oportunidad: ${opportunity.symbol} ${opportunity.direction}`);
            
            // Validar oportunidad
            if (!this._validateOpportunity(opportunity)) {
                console.log('[WARNING] Oportunidad inválida. Ignorando.');
                return null;
            }
            
            // Verificar límites de posiciones
            if (!this._checkPositionLimits(opportunity)) {
                console.log('[WARNING] Límite de posiciones alcanzado. Ignorando oportunidad.');
                return null;
            }
            
            // Calcular tamaño de posición óptimo
            const positionDetails = await this._calculatePositionDetails(opportunity);
            
            if (!positionDetails || positionDetails.positionSize <= 0) {
                console.log('[WARNING] Tamaño de posición inválido. Ignorando oportunidad.');
                return null;
            }
            
            // Preparar orden
            const orderParams = {
                symbol: opportunity.symbol,
                side: opportunity.direction === 'LONG' ? 'BUY' : 'SELL',
                type: 'MARKET',
                quantity: positionDetails.positionSize,
                leverage: positionDetails.leverage
            };
            
            // Ejecutar orden
            const orderResult = await this.orderExecutor.executeOrder(orderParams);
            
            if (!orderResult) {
                throw new Error('Error ejecutando orden');
            }
            
            // Registrar posición
            const position = {
                id: orderResult.orderId,
                symbol: opportunity.symbol,
                side: orderParams.side,
                size: parseFloat(orderResult.origQty),
                entryPrice: parseFloat(orderResult.avgPrice),
                leverage: positionDetails.leverage,
                entryTime: Date.now(),
                status: 'OPEN',
                stopLoss: this._calculateStopLoss(orderParams.side, parseFloat(orderResult.avgPrice), opportunity),
                takeProfit: this._calculateTakeProfit(orderParams.side, parseFloat(orderResult.avgPrice), opportunity),
                strategy: opportunity.strategy,
                edge: opportunity.edge || 0,
                score: opportunity.score || 0
            };
            
            // Añadir a posiciones activas
            this.activePositions.push(position);
            
            // Colocar órdenes de stop loss y take profit
            await this._placeExitOrders(position);
            
            console.log(`[OK] Posición abierta: ${position.symbol} ${position.side} ${position.size} @ ${position.entryPrice}`);
            
            // Emitir evento
            this.emit('POSITION_OPENED', position);
            
            return position;
        } catch (error) {
            console.error('[ERROR] Error procesando oportunidad:', error.message);
            
            // Emitir evento de error
            this.emit('OPPORTUNITY_ERROR', {
                opportunity,
                error: error.message,
                timestamp: Date.now()
            });
            
            return null;
        }
    }
    
    /**
     * Valida una oportunidad de trading
     * @private
     */
    _validateOpportunity(opportunity) {
        // Verificar campos requeridos
        if (!opportunity.symbol || !opportunity.direction) {
            return false;
        }
        
        // Verificar dirección válida
        if (opportunity.direction !== 'LONG' && opportunity.direction !== 'SHORT') {
            return false;
        }
        
        // Verificar score mínimo
        const minScore = this.config.minOpportunityScore || 0.3;
        if ((opportunity.score || 0) < minScore) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Verifica los límites de posiciones
     * @private
     */
    _checkPositionLimits(opportunity) {
        // Verificar límite total de posiciones
        if (this.activePositions.length >= this.config.maxPositions) {
            return false;
        }
        
        // Verificar límite por símbolo
        const symbolPositions = this.activePositions.filter(
            pos => pos.symbol === opportunity.symbol
        ).length;
        
        if (symbolPositions >= this.config.maxSymbolPositions) {
            return false;
        }
        
        // Verificar límite por estrategia
        if (opportunity.strategy) {
            const strategyPositions = this.activePositions.filter(
                pos => pos.strategy === opportunity.strategy
            ).length;
            
            if (strategyPositions >= this.config.maxStrategyPositions) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Calcula los detalles de la posición
     * @private
     */
    async _calculatePositionDetails(opportunity) {
        try {
            // Obtener balance
            await this.orderExecutor.updateBalanceCache();
            const balance = this.orderExecutor.balanceCache?.USDT?.availableBalance || 0;
            
            if (balance <= 0) {
                console.log('[WARNING] Balance insuficiente');
                return null;
            }
            
            // Parámetros para el cálculo
            const params = {
                accountBalance: balance,
                riskPerTradePercent: opportunity.riskPercent || this.config.defaultRiskPerTrade,
                winRate: opportunity.winRate || 0.55,
                rewardRatio: opportunity.rewardRatio || 2.0,
                edge: opportunity.edge || 0.5,
                volatility: opportunity.volatility || 0.03,
                maxFraction: 0.25
            };
            
            // Calcular tamaño de posición con LeverageMatrix
            const result = this.leverageMatrix.calculateOptimalPositionSize(params);
            
            // Si no se permiten contratos fraccionados, redondear
            let finalSize = result.positionSize;
            if (!this.config.enableFractionalContracts) {
                finalSize = Math.floor(finalSize);
            }
            
            // Asegurar tamaño mínimo
            if (finalSize < 0.001) {
                console.log('[WARNING] Tamaño de posición demasiado pequeño');
                return null;
            }
            
            return {
                positionSize: finalSize,
                leverage: result.leverage,
                riskAmount: result.riskAmount,
                kellyFraction: result.kellyFraction
            };
        } catch (error) {
            console.error('[ERROR] Error calculando detalles de posición:', error.message);
            return null;
        }
    }
    
    /**
     * Calcula el precio de stop loss
     * @private
     */
    _calculateStopLoss(side, entryPrice, opportunity) {
        const stopLossPercent = opportunity.stopLossPercent || this.config.stopLossDefault;
        const direction = side === 'BUY' ? -1 : 1;
        
        return entryPrice * (1 + (direction * stopLossPercent / 100));
    }
    
    /**
     * Calcula el precio de take profit
     * @private
     */
    _calculateTakeProfit(side, entryPrice, opportunity) {
        const takeProfitPercent = opportunity.takeProfitPercent || this.config.profitTarget;
        const direction = side === 'BUY' ? 1 : -1;
        
        return entryPrice * (1 + (direction * takeProfitPercent / 100));
    }
    
    /**
     * Coloca órdenes de salida con optimización cuántica avanzada en el plano Z
     * @private
     */
    async _placeExitOrders(position) {
        try {
            const stopSide = position.side === 'BUY' ? 'SELL' : 'BUY';
            
            // Importar optimizador de Feynman si está disponible
            let feynmanOptimizer;
            try {
                const { FeynmanQuantumOptimizer } = require('./FeynmanQuantumOptimizer');
                feynmanOptimizer = new FeynmanQuantumOptimizer();
                console.log(`[LEONARDO] Optimizador de Feynman integrado para órdenes de salida`);
            } catch (e) {
                console.log(`[LEONARDO] Usando optimización estándar para órdenes de salida`);
            }
            
            // Obtener datos de mercado para optimización
            const marketData = {
                symbol: position.symbol,
                price: position.entryPrice,
                volatility: position.volatility || 0.03,
                volume: 1000000
            };
            
            // Calcular delta óptimo para trailing stop
            const trailingDelta = feynmanOptimizer ? 
                feynmanOptimizer._calculateOptimalTrailingDelta(
                    marketData.volatility, 
                    0.95, // coherencia alta
                    Math.sqrt(Math.pow(9, 2) + Math.pow(16, 2)) // magnitud Z óptima
                ) : 
                this._calculateOptimalTrailingDelta(position);
                
            // Aplicar división de stop loss: 50% trailing, 50% fijo
            // Esta estrategia aprovecha tanto la protección fija como la captura de tendencia
            
            // 1. Colocar stop loss con trailing para 50% de la posición
            await this.orderExecutor.executeOrder({
                symbol: position.symbol,
                side: stopSide,
                type: 'TRAILING_STOP_MARKET',
                quantity: position.size * 0.5, // 50% con trailing
                callbackRate: trailingDelta,
                reduceOnly: true,
                activationPrice: position.side === 'BUY' ? 
                    position.entryPrice * 1.005 : // Activar cuando suba un 0.5%
                    position.entryPrice * 0.995   // Activar cuando baje un 0.5%
            });
            
            // 2. Colocar stop loss fijo para el otro 50% de la posición
            await this.orderExecutor.executeOrder({
                symbol: position.symbol,
                side: stopSide,
                type: 'STOP_MARKET',
                quantity: position.size * 0.5, // 50% con stop fijo
                stopPrice: position.stopLoss,
                reduceOnly: true
            });
            
            // Calcular niveles de take profit escalonados con optimización cuántica
            let takeProfitLevels;
            if (feynmanOptimizer) {
                // Usar optimizador cuántico para calcular niveles óptimos
                const positionData = {
                    symbol: position.symbol,
                    side: position.side,
                    entryPrice: position.entryPrice,
                    size: position.size
                };
                takeProfitLevels = feynmanOptimizer.calculateOptimalTakeProfitLevels(positionData, marketData);
                console.log(`[LEONARDO] Niveles TP optimizados: ${takeProfitLevels.map(l => l.percentage.toFixed(2) + '%').join(', ')}`);
            } else {
                // Usar niveles predeterminados con optimización Z-plane
                const baseTarget = this.config.profitTarget;
                const zFactor = 9/16; // Relación óptima del plano Z
                const volatilityFactor = 1 + (position.volatility || 0.03) * 10;
                
                takeProfitLevels = [
                    { 
                        percentage: baseTarget * volatilityFactor * 1.0, 
                        portion: 0.4,
                        price: position.entryPrice * (1 + (position.side === 'BUY' ? 1 : -1) * (baseTarget * volatilityFactor * 1.0 / 100))
                    },
                    { 
                        percentage: baseTarget * volatilityFactor * 1.5, 
                        portion: 0.3,
                        price: position.entryPrice * (1 + (position.side === 'BUY' ? 1 : -1) * (baseTarget * volatilityFactor * 1.5 / 100))
                    },
                    { 
                        percentage: baseTarget * volatilityFactor * 2.0, 
                        portion: 0.3,
                        price: position.entryPrice * (1 + (position.side === 'BUY' ? 1 : -1) * (baseTarget * volatilityFactor * 2.0 / 100))
                    }
                ];
            }
            
            // Colocar órdenes de take profit escalonadas
            for (const level of takeProfitLevels) {
                await this.orderExecutor.executeOrder({
                    symbol: position.symbol,
                    side: stopSide,
                    type: 'TAKE_PROFIT_MARKET',
                    quantity: position.size * level.portion,
                    stopPrice: level.price,
                    reduceOnly: true
                });
            }
            
            console.log(`[OK] Órdenes de salida cuánticas colocadas para ${position.symbol}`);
            console.log(`[DATA] Take Profit: ${takeProfitLevels.map(l => l.percentage.toFixed(2) + '%').join(', ')}`);
            console.log(`[DATA] Trailing Stop: ${trailingDelta}%`);
            return true;
        } catch (error) {
            console.error(`[ERROR] Error colocando órdenes de salida: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Calcula el delta óptimo para trailing stop basado en el plano Z
     * @private
     */
    _calculateOptimalTrailingDelta(position) {
        // Obtener volatilidad del símbolo
        const volatility = position.volatility || 0.03;
        
        // Calcular delta base según volatilidad (3x la volatilidad)
        const baseDelta = volatility * 100 * 3;
        
        // Ajustar según edge y score de la oportunidad
        const edgeMultiplier = 1 - (position.edge || 0.5) * 0.5;
        const scoreMultiplier = 1 + (position.score || 0.5) * 0.5;
        
        // Aplicar resonancia del plano Z
        const zResonance = 0.9 + Math.sin(Date.now() / 10000) * 0.1;
        
        // Calcular delta final
        const finalDelta = baseDelta * edgeMultiplier * scoreMultiplier * zResonance;
        
        // Limitar a valores razonables (0.5% - 5%)
        return Math.max(0.5, Math.min(5.0, finalDelta));
    }
    
    /**
     * Procesa una orden ejecutada
     * @private
     */
    _processExecutedOrder(orderData) {
        const { order, originalParams } = orderData;
        
        // Si es una orden reduceOnly, puede ser un cierre de posición
        if (originalParams.reduceOnly) {
            this._processPositionClosed(order);
        }
    }
    
    /**
     * Procesa el cierre de una posición
     * @private
     */
    _processPositionClosed(order) {
        // Buscar la posición correspondiente
        const positionIndex = this.activePositions.findIndex(
            pos => pos.symbol === order.symbol
        );
        
        if (positionIndex === -1) {
            return;
        }
        
        const position = this.activePositions[positionIndex];
        
        // Calcular P&L
        const exitPrice = parseFloat(order.avgPrice);
        const direction = position.side === 'BUY' ? 1 : -1;
        const priceDiff = (exitPrice - position.entryPrice) * direction;
        const pnl = priceDiff * position.size;
        
        // Actualizar posición
        position.exitPrice = exitPrice;
        position.exitTime = Date.now();
        position.pnl = pnl;
        position.status = 'CLOSED';
        
        // Mover a historial
        this.tradeHistory.push(position);
        this.activePositions.splice(positionIndex, 1);
        
        // Actualizar métricas
        this._updatePerformanceMetrics(position);
        
        console.log(`[DOWN] Posición cerrada: ${position.symbol} P&L: ${pnl.toFixed(2)} USDT`);
        
        // Emitir evento
        this.emit('POSITION_CLOSED', position);
    }
    
    /**
     * Actualiza las métricas de rendimiento
     * @private
     */
    _updatePerformanceMetrics(closedPosition) {
        this.performanceMetrics.totalTrades++;
        
        if (closedPosition.pnl > 0) {
            this.performanceMetrics.winningTrades++;
            this.performanceMetrics.totalProfit += closedPosition.pnl;
        } else {
            this.performanceMetrics.losingTrades++;
            this.performanceMetrics.totalLoss += Math.abs(closedPosition.pnl);
        }
        
        // Calcular win rate
        this.performanceMetrics.winRate = 
            this.performanceMetrics.winningTrades / this.performanceMetrics.totalTrades;
        
        // Calcular profit factor
        this.performanceMetrics.profitFactor = 
            this.performanceMetrics.totalProfit / Math.max(1, this.performanceMetrics.totalLoss);
        
        // Calcular ganancia/pérdida promedio
        if (this.performanceMetrics.winningTrades > 0) {
            this.performanceMetrics.averageWin = 
                this.performanceMetrics.totalProfit / this.performanceMetrics.winningTrades;
        }
        
        if (this.performanceMetrics.losingTrades > 0) {
            this.performanceMetrics.averageLoss = 
                this.performanceMetrics.totalLoss / this.performanceMetrics.losingTrades;
        }
        
        // Actualizar drawdown
        if (closedPosition.pnl < 0) {
            this.performanceMetrics.currentDrawdown += Math.abs(closedPosition.pnl);
            this.performanceMetrics.maxDrawdown = Math.max(
                this.performanceMetrics.maxDrawdown,
                this.performanceMetrics.currentDrawdown
            );
        } else {
            this.performanceMetrics.currentDrawdown = Math.max(
                0,
                this.performanceMetrics.currentDrawdown - closedPosition.pnl
            );
        }
    }
    
    /**
     * Cierra una posición específica
     */
    async closePosition(positionId) {
        try {
            // Buscar la posición
            const position = this.activePositions.find(pos => pos.id === positionId);
            
            if (!position) {
                throw new Error(`Posición no encontrada: ${positionId}`);
            }
            
            console.log(`[RELOAD] Cerrando posición: ${position.symbol}`);
            
            // Cancelar órdenes abiertas
            await this.orderExecutor.cancelAllOrders(position.symbol);
            
            // Crear orden de cierre
            const result = await this.orderExecutor.executeOrder({
                symbol: position.symbol,
                side: position.side === 'BUY' ? 'SELL' : 'BUY',
                type: 'MARKET',
                quantity: position.size,
                reduceOnly: true
            });
            
            console.log(`[OK] Posición cerrada: ${position.symbol}`);
            return result;
        } catch (error) {
            console.error(`[ERROR] Error cerrando posición: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Cierra todas las posiciones abiertas
     */
    async closeAllPositions() {
        try {
            console.log('[RELOAD] Cerrando todas las posiciones...');
            
            const results = await this.orderExecutor.closeAllPositions();
            
            // Actualizar estado
            await this._syncPositions();
            
            console.log(`[OK] Cerradas ${results.filter(r => r.success).length} posiciones`);
            return results;
        } catch (error) {
            console.error(`[ERROR] Error cerrando posiciones: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Obtiene el estado actual del sistema
     */
    getSystemStatus() {
        return {
            isRunning: this.isRunning,
            activePositions: this.activePositions.length,
            pendingOrders: this.pendingOrders.length,
            totalTrades: this.performanceMetrics.totalTrades,
            winRate: this.performanceMetrics.winRate,
            profitFactor: this.performanceMetrics.profitFactor,
            totalProfit: this.performanceMetrics.totalProfit,
            maxDrawdown: this.performanceMetrics.maxDrawdown,
            riskProfile: this.config.riskProfile,
            lastUpdate: this.lastUpdate
        };
    }
    
    /**
     * Obtiene las posiciones activas
     */
    getActivePositions() {
        return this.activePositions;
    }
    
    /**
     * Obtiene el historial de trades
     */
    getTradeHistory(limit = 20) {
        return this.tradeHistory.slice(-limit);
    }
    
    /**
     * Obtiene las métricas de rendimiento
     */
    getPerformanceMetrics() {
        return this.performanceMetrics;
    }
    
    /**
     * Establece el perfil de riesgo
     */
    setRiskProfile(profile) {
        if (!['conservative', 'balanced', 'aggressive'].includes(profile)) {
            console.error(`[ERROR] Perfil de riesgo no válido: ${profile}`);
            return false;
        }
        
        this.config.riskProfile = profile;
        this.leverageMatrix.setRiskProfile(profile);
        
        console.log(`[DATA] Perfil de riesgo actualizado: ${profile}`);
        return true;
    }
}

module.exports = { LeonardoQuantumTrader };

/**
 * 💼 POSITION MANAGER θ-AWARE
 * Gestor de posiciones con métricas temporales integradas
 * 
 * @author QBTC Quantum confidence Trading System
 * @version 1.0.0
 * @since 2024
 */

const { secure_logger } = require('../utils/secure-logger');
const { random, generateUUID } = require('../../utils/kernel-rng');
const safeMath = require('../../utils/safe-math');
const { TemporalPrimeLadder } = require('../temporal-prime-ladder-fixed');

class PositionManager {
    constructor(options = {}) {
        this.logger = secure_logger.createLogger('PositionManager');
        
        // Configuración
        this.config = {
            maxPositions: options.maxPositions || 10,
            maxRiskPerPosition: options.maxRiskPerPosition || 0.025,
            dailyThetaBudget: options.dailyThetaBudget || 0.10,
            leverageLimit: options.leverageLimit || 10,
            ...options
        };
        
        // Estado interno
        this.state = {
            positions: new Map(),
            thetaBudget: {
                dailyBudget: this.config.dailyThetaBudget,
                usedBudget: 0,
                reservations: new Map()
            },
            initialized: false
        };
        
        // Métricas
        this.metrics = {
            totalPositions: 0,
            activePositions: 0,
            closedPositions: 0,
            totalPnL: 0,
            winRate: 0,
            avgHoldTime: 0,
            thetaEfficiency: 0
        };
        
        // Componentes integrados
        this.temporalEngine = null;
        this.primeLadder = null;
        
        this.initialize();
    }
    
    /**
     * Inicializar Position Manager
     */
    async initialize() {
        try {
            this.logger.info('Inicializando Position Manager θ-aware...');
            
            // Inicializar Prime Ladder integrado
            this.primeLadder = new TemporalPrimeLadder(this, null, {
                primeBands: [7, 11, 13, 17, 19, 23, 29, 31]
            });
            
            this.state.initialized = true;
            this.logger.info('Position Manager inicializado correctamente');
            
        } catch (error) {
            this.logger.error('Error inicializando Position Manager:', error);
            throw error;
        }
    }
    
    /**
     * Calcular position size con Kelly θ-aware
     */
    calculateQuantumPositionSize(symbol, entryPrice, stopLoss, takeProfit, confidence, temporalOptions = {}) {
        try {
            // Validaciones básicas
            if (!symbol || !entryPrice || !stopLoss || !takeProfit || !confidence) {
                return this.getFallbackSizing();
            }
            
            // Calcular riesgo base
            const riskAmount = Math.abs(entryPrice - stopLoss);
            const rewardAmount = Math.abs(takeProfit - entryPrice);
            const riskRewardRatio = safeMath.safeDivide(rewardAmount, riskAmount, 1.0);
            
            // Kelly Criterion básico
            const winProbability = Math.max(0.4, Math.min(0.9, confidence));
            const lossProbability = 1 - winProbability;
            const avgWin = rewardAmount;
            const avgLoss = riskAmount;
            
            const kellyFraction = safeMath.safeDivide(
                (winProbability * avgWin) - (lossProbability * avgLoss),
                avgWin,
                0.01
            );
            
            // Base position size (limitado)
            let positionSize = Math.max(0.005, Math.min(kellyFraction, this.config.maxRiskPerPosition));
            
            // === AJUSTES TEMPORALES ===
            let temporalMetrics = null;
            let temporalFlags = {};
            let adjustments = {};
            
            if (this.temporalEngine && temporalOptions.expiry) {
                try {
                    // Calcular métricas temporales
                    const optionData = {
                        symbol,
                        expiry: temporalOptions.expiry,
                        daysToExpiry: temporalOptions.daysToExpiry || 7,
                        theta: temporalOptions.theta || -0.01,
                        price: entryPrice
                    };
                    
                    const marketData = temporalOptions.marketData || this.generateMockMarketData();
                    temporalMetrics = this.temporalEngine.evaluateTemporalMetrics(optionData, marketData, symbol);
                    
                    // Ajustes basados en edge temporal
                    if (temporalMetrics.temporal_edge) {
                        const edgeMultiplier = 1 + (temporalMetrics.temporal_edge.edge_temporal * 2);
                        positionSize *= Math.max(0.5, Math.min(2.0, edgeMultiplier));
                        adjustments.edge_temporal = edgeMultiplier;
                    }
                    
                    // Ajustes por DTE prime band
                    if (temporalMetrics.temporal_edge && temporalMetrics.temporal_edge.dte_prime_band) {
                        const dteBand = temporalMetrics.temporal_edge.dte_prime_band;
                        const bandMultiplier = this.getDTEBandMultiplier(dteBand);
                        positionSize *= bandMultiplier;
                        adjustments.dte_prime_band = bandMultiplier;
                    }
                    
                    // Reservar θ-budget
                    const thetaConsumption = Math.abs(temporalOptions.theta || 0.01) * positionSize;
                    if (this.canReserveThetaBudget(thetaConsumption)) {
                        this.reserveThetaBudget(symbol, thetaConsumption);
                        adjustments.theta_budget = thetaConsumption;
                    } else {
                        positionSize *= 0.5; // Reducir si no hay suficiente θ-budget
                        adjustments.theta_budget_limited = true;
                    }
                    
                    // Flags temporales
                    temporalFlags = {
                        isPrimeBand: temporalMetrics.temporal_edge?.dte_prime_band && 
                                    [7, 11, 13, 17, 19, 23, 29, 31].includes(temporalMetrics.temporal_edge.dte_prime_band),
                        hasStrongEdge: temporalMetrics.temporal_edge?.edge_temporal > 0.1,
                        hasGoodCoherence: temporalMetrics.composite_score > 0.6,
                        isRecommendedBuy: temporalMetrics.trading_recommendation?.action === 'BUY'
                    };
                    
                } catch (temporalError) {
                    this.logger.warn('Error en cálculos temporales, usando fallback:', temporalError.message);
                    temporalMetrics = this.getMockTemporalMetrics(optionData);
                }
            }
            
            // Limitar position size final
            positionSize = Math.max(0.001, Math.min(positionSize, this.config.maxRiskPerPosition));
            
            const result = {
                positionSize,
                riskRewardRatio,
                kellyFraction,
                confidence: winProbability,
                temporalMetrics,
                temporalFlags,
                adjustments,
                calculations: {
                    baseKelly: kellyFraction,
                    riskAmount,
                    rewardAmount,
                    winProbability,
                    lossProbability
                }
            };
            
            this.logger.debug(`Quantum sizing: ${symbol} -> ${(positionSize * 100).toFixed(2)}%`, {
                riskReward: riskRewardRatio.toFixed(2),
                confidence: winProbability.toFixed(2),
                hasTemporalData: !!temporalMetrics
            });
            
            return result;
            
        } catch (error) {
            this.logger.error('Error en quantum position sizing:', error);
            return this.getFallbackSizing();
        }
    }
    
    /**
     * Obtener multiplicador por DTE band
     */
    getDTEBandMultiplier(dteBand) {
        const multipliers = {
            7: 1.2,   // Corto plazo - más agresivo
            11: 1.15,
            13: 1.1,
            17: 1.0,  // Medio plazo - neutral
            19: 1.0,
            23: 0.9,  // Largo plazo - más conservador
            29: 0.85,
            31: 0.8
        };
        
        return multipliers[dteBand] || 1.0;
    }
    
    /**
     * Abrir nueva posición
     */
    async openPosition(positionRequest) {
        try {
            // Validar request
            if (!this.validatePositionRequest(positionRequest)) {
                throw new Error('Invalid position request');
            }
            
            // Verificar límites
            if (this.state.positions.size >= this.config.maxPositions) {
                throw new Error('Max positions limit reached');
            }
            
            // Calcular sizing
            const sizingDetails = this.calculateQuantumPositionSize(
                positionRequest.symbol,
                positionRequest.entryPrice,
                positionRequest.stopLoss,
                positionRequest.takeProfit,
                positionRequest.confidence,
                positionRequest.options
            );
            
            // Crear posición
            const position = {
                id: generateUUID(),
                symbol: positionRequest.symbol,
                side: positionRequest.side,
                entryPrice: positionRequest.entryPrice,
                stopLoss: positionRequest.stopLoss,
                takeProfit: positionRequest.takeProfit,
                actualSize: sizingDetails.positionSize,
                leverage: positionRequest.leverage || 1,
                status: 'ACTIVE',
                openTime: Date.now(),
                sizingDetails,
                unrealizedPnL: 0,
                avgEntryPrice: positionRequest.entryPrice,
                currentPrice: positionRequest.entryPrice
            };
            
            // Almacenar posición
            this.state.positions.set(position.id, position);
            this.metrics.totalPositions++;
            this.metrics.activePositions++;
            
            // Evaluar para ladder si tiene métricas temporales
            if (this.primeLadder && sizingDetails.temporalMetrics) {
                await this.primeLadder.evaluateForLadder(position);
            }
            
            this.logger.info(`Posición abierta: ${position.id}`, {
                symbol: position.symbol,
                side: position.side,
                size: (position.actualSize * 100).toFixed(2) + '%'
            });
            
            return position;
            
        } catch (error) {
            this.logger.error('Error abriendo posición:', error);
            throw error;
        }
    }
    
    /**
     * Cerrar posición
     */
    async closePosition(positionId, reason = 'manual') {
        try {
            const position = this.state.positions.get(positionId);
            if (!position) {
                throw new Error(`Position ${positionId} not found`);
            }
            
            // Simular PnL
            const pnlPercent = (random() - 0.5) * 0.1; // ±5%
            const realizedPnL = position.actualSize * position.avgEntryPrice * pnlPercent;
            
            // Actualizar posición
            position.status = 'CLOSED';
            position.closeTime = Date.now();
            position.closeReason = reason;
            position.realizedPnL = realizedPnL;
            position.holdTime = position.closeTime - position.openTime;
            
            // Liberar θ-budget si existe
            if (position.sizingDetails && position.sizingDetails.adjustments.theta_budget) {
                this.releaseThetaBudget(position.symbol, position.sizingDetails.adjustments.theta_budget);
            }
            
            // Actualizar métricas
            this.metrics.activePositions--;
            this.metrics.closedPositions++;
            this.metrics.totalPnL += realizedPnL;
            
            this.logger.info(`Posición cerrada: ${positionId}`, {
                reason,
                pnl: realizedPnL.toFixed(4),
                holdTime: Math.round(position.holdTime / 1000 / 60) + 'm'
            });
            
            return {
                status: 'CLOSED',
                position,
                realizedPnL
            };
            
        } catch (error) {
            this.logger.error('Error cerrando posición:', error);
            throw error;
        }
    }
    
    /**
     * Obtener posición por ID
     */
    getPosition(positionId) {
        return this.state.positions.get(positionId);
    }
    
    /**
     * Gestión de θ-budget
     */
    getThetaBudgetStatus() {
        return {
            dailyBudget: this.state.thetaBudget.dailyBudget,
            usedBudget: this.state.thetaBudget.usedBudget,
            remainingBudget: this.state.thetaBudget.dailyBudget - this.state.thetaBudget.usedBudget,
            utilizationPercent: safeMath.safeDivide(
                this.state.thetaBudget.usedBudget,
                this.state.thetaBudget.dailyBudget,
                0
            ) * 100,
            reservations: this.state.thetaBudget.reservations.size
        };
    }
    
    canReserveThetaBudget(amount) {
        return (this.state.thetaBudget.usedBudget + amount) <= this.state.thetaBudget.dailyBudget;
    }
    
    reserveThetaBudget(symbol, amount) {
        if (this.canReserveThetaBudget(amount)) {
            this.state.thetaBudget.usedBudget += amount;
            this.state.thetaBudget.reservations.set(symbol, 
                (this.state.thetaBudget.reservations.get(symbol) || 0) + amount
            );
            return true;
        }
        return false;
    }
    
    releaseThetaBudget(symbol, amount) {
        this.state.thetaBudget.usedBudget = Math.max(0, this.state.thetaBudget.usedBudget - amount);
        const current = this.state.thetaBudget.reservations.get(symbol) || 0;
        if (current > amount) {
            this.state.thetaBudget.reservations.set(symbol, current - amount);
        } else {
            this.state.thetaBudget.reservations.delete(symbol);
        }
    }
    
    resetThetaBudget(reason = 'daily_reset') {
        const oldUsed = this.state.thetaBudget.usedBudget;
        this.state.thetaBudget.usedBudget = 0.0; // Explícitamente 0.0
        this.state.thetaBudget.reservations.clear();
        
        this.logger.info(`θ-budget reset: ${oldUsed.toFixed(4)} -> 0.0000 (${reason})`);
        
        return {
            success: true,
            previousUsed: oldUsed,
            reason
        };
    }
    
    /**
     * Limpiar residuos de θ-budget (para testing)
     */
    cleanupThetaBudgetResidues() {
        // Limpiar residuos menores a 0.001
        if (Math.abs(this.state.thetaBudget.usedBudget) < 0.001) {
            this.state.thetaBudget.usedBudget = 0.0;
        }
        
        // Limpiar reservaciones pequeñas
        for (const [symbol, amount] of this.state.thetaBudget.reservations) {
            if (Math.abs(amount) < 0.001) {
                this.state.thetaBudget.reservations.delete(symbol);
            }
        }
    }
    
    /**
     * Obtener métricas del Position Manager
     */
    getPositionManagerMetrics() {
        const budgetStatus = this.getThetaBudgetStatus();
        
        return {
            ...this.metrics,
            thetaBudget: budgetStatus,
            primeLadders: this.primeLadder ? this.primeLadder.getSystemMetrics() : null,
            temporal: this.temporalEngine ? this.temporalEngine.getSystemMetrics() : null,
            activePositionsCount: this.state.positions.size,
            timestamp: Date.now()
        };
    }
    
    /**
     * Validar request de posición
     */
    validatePositionRequest(request) {
        return request && 
               request.symbol && 
               typeof request.entryPrice === 'number' &&
               typeof request.stopLoss === 'number' &&
               typeof request.takeProfit === 'number' &&
               typeof request.confidence === 'number' &&
               request.confidence > 0 && request.confidence <= 1;
    }
    
    /**
     * Obtener sizing de fallback
     */
    getFallbackSizing() {
        return {
            positionSize: 0.01, // 1% conservador
            riskRewardRatio: 2.0,
            confidence: 0.5,
            isFallback: true,
            temporalMetrics: null,
            temporalFlags: {},
            adjustments: {}
        };
    }
    
    /**
     * Generar datos de mercado mock
     */
    generateMockMarketData() {
        const data = [];
        let price = 1000;
        
        for (let i = 0; i < 20; i++) {
            const change = (random() - 0.5) * 0.02;
            price *= (1 + change);
            
            data.push({
                timestamp: Date.now() - (20 - i) * 60000,
                open: price * (1 + (random() - 0.5) * 0.001),
                high: price * (1 + random() * 0.005),
                low: price * (1 - random() * 0.005),
                close: price,
                volume: Math.floor(random() * 10000) + 1000
            });
        }
        
        return data;
    }
    
    /**
     * Métricas temporales mock
     */
    getMockTemporalMetrics(optionData) {
        return {
            temporal_edge: {
                edge_temporal: random() * 0.2 - 0.1,
                dte_prime_band: optionData.daysToExpiry,
                theta_normalized: Math.abs(optionData.theta) * 100
            },
            composite_score: random() * 0.8 + 0.2,
            trading_recommendation: {
                action: random() > 0.5 ? 'BUY' : 'HOLD'
            }
        };
    }
    
    /**
     * Cleanup de recursos
     */
    async cleanup() {
        this.logger.info('Limpiando Position Manager...');
        
        if (this.primeLadder) {
            await this.primeLadder.cleanup();
        }
        
        this.state.positions.clear();
        this.state.thetaBudget.reservations.clear();
        
        this.logger.info('Position Manager cleanup completado');
    }
}

module.exports = PositionManager;


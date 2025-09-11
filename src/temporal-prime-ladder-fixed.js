/**
 * 🏗️ TEMPORAL PRIME LADDER - Sistema de gestión de ladders de expiración
 * Maneja rolls automáticos y distribución theta optimizada por bandas primas
 * 
 * @author QBTC Quantum confidence Trading System
 * @version 1.0.0  
 * @since 2024
 */

const { secure_logger } = require('./utils/secure-logger');
const { random, generateUUID } = require('../utils/kernel-rng');
const safeMath = require('../utils/safe-math');

class TemporalPrimeLadder {
    constructor(positionManager, temporalEngine, options = {}) {
        this.positionManager = positionManager;
        this.temporalEngine = temporalEngine;
        this.logger = secure_logger.createLogger('TemporalPrimeLadder');
        
        // Configuración optimizada para ladders primas
        this.config = {
            primeBands: [7, 11, 13, 17, 19, 23, 29, 31],
            tierDistribution: {
                tier1: { bands: [7, 11, 13], allocation: 0.40 },    // 40% en bandas cortas
                tier2: { bands: [17, 19], allocation: 0.35 },       // 35% en bandas medias  
                tier3: { bands: [23, 29, 31], allocation: 0.25 }    // 25% en bandas largas
            },
            rollCriteria: {
                daysToExpiry: 2,        // Roll cuando quedan ≤2 días
                profitThreshold: 0.5,   // Roll si profit >50%
                lossThreshold: -0.25    // Roll si loss >-25%
            },
            thetaSmoothing: {
                maxThetaConcentration: 0.4,    // Máx 40% theta en una banda
                rebalanceInterval: 4 * 60 * 60 * 1000, // 4 horas
                targetThetaSpread: 0.15         // Target spread entre bandas
            },
            ...options
        };
        
        // Estado interno
        this.state = {
            activeLadders: new Map(),
            rollQueue: [],
            initialized: false,
            rebalanceTimer: null,
            rollProcessingTimer: null
        };
        
        // Métricas de sistema
        this.metrics = {
            totalLadders: 0,
            activeRolls: 0,
            completedRolls: 0,
            rollSuccessRate: 0,
            avgRollProfit: 0,
            lastRebalance: 0,
            performanceByBand: new Map()
        };
        
        this.initialize();
    }
    
    /**
     * Inicializar sistema de ladders
     */
    async initialize() {
        try {
            this.logger.info('Inicializando Temporal Prime Ladder System...');
            
            this.initializeBandMetrics();
            this.setupAutomaticProcessing();
            this.setupRebalancing();
            
            this.state.initialized = true;
            this.logger.info('Temporal Prime Ladder inicializado correctamente');
            
        } catch (error) {
            this.logger.error('Error inicializando Temporal Prime Ladder:', error);
            throw error;
        }
    }
    
    /**
     * Evaluar posición para inclusión en ladder
     */
    async evaluateForLadder(position) {
        try {
            if (!position) {
                return false;
            }
            
            // Obtener métricas temporales de sizing details o generar fallback
            let temporalMetrics = position.sizingDetails?.temporalMetrics;
            let dteBand;
            
            if (!temporalMetrics) {
                // Generar métricas temporales de fallback
                temporalMetrics = this.generateFallbackTemporalMetrics(position);
                dteBand = temporalMetrics.dte_prime_band;
                
                this.logger.debug(`Usando métricas temporales de fallback para posición ${position.id}`, {
                    dteBand,
                    fallbackGenerated: true
                });
            } else {
                dteBand = temporalMetrics.dte_prime_band;
            }
            
            // Verificar que la banda esté en nuestras bandas primas
            if (!this.config.primeBands.includes(dteBand)) {
                this.logger.debug(`Posición ${position.id} no está en banda prima (DTE: ${dteBand})`);
                return false;
            }
            
            // Buscar ladder existente para el símbolo y banda
            let ladder = this.findOrCreateLadder(position.symbol, dteBand);
            
            // Añadir posición al ladder
            ladder.positions.push({
                positionId: position.id,
                addedAt: Date.now(),
                initialTheta: this.estimatePositionTheta(position),
                initialEdge: temporalMetrics.edge_temporal
            });
            
            // Actualizar métricas del ladder
            this.updateLadderMetrics(ladder);
            
            this.logger.info(`Posición ${position.id} añadida a ladder ${ladder.id} (Banda: ${dteBand}d)`);
            return true;
            
        } catch (error) {
            this.logger.error(`Error evaluando posición ${position.id} para ladder:`, error);
            return false;
        }
    }
    
    /**
     * Encontrar o crear ladder para símbolo y banda
     */
    findOrCreateLadder(symbol, primeBand) {
        let ladders = this.state.activeLadders.get(symbol);
        
        if (!ladders) {
            ladders = [];
            this.state.activeLadders.set(symbol, ladders);
        }
        
        // Buscar ladder existente para esta banda
        let ladder = ladders.find(l => l.primeBand === primeBand);
        
        if (!ladder) {
            ladder = this.createNewLadder(symbol, primeBand);
            ladders.push(ladder);
            this.metrics.totalLadders++;
        }
        
        return ladder;
    }
    
    /**
     * Crear nuevo ladder
     */
    createNewLadder(symbol, primeBand) {
        const ladder = {
            id: `ladder_${symbol}_${primeBand}d_${generateUUID().substring(0, 8)}`,
            symbol: symbol,
            primeBand: primeBand,
            tier: this.getBandTier(primeBand),
            positions: [],
            createdAt: Date.now(),
            lastRebalanced: Date.now(),
            rollHistory: [],
            metrics: {
                totalTheta: 0,
                avgEdgeTemporal: 0,
                totalValue: 0,
                unrealizedPnL: 0,
                rollsCompleted: 0,
                thetaEfficiency: 0
            }
        };
        
        this.logger.info(`Nuevo ladder creado: ${ladder.id} (${symbol}, ${primeBand}d, Tier: ${ladder.tier})`);
        return ladder;
    }
    
    /**
     * Obtener tier de banda prima
     */
    getBandTier(primeBand) {
        for (const [tier, config] of Object.entries(this.config.tierDistribution)) {
            if (config.bands.includes(primeBand)) {
                return tier;
            }
        }
        return 'unknown';
    }
    
    /**
     * Evaluar criterios de roll para posición
     */
    async evaluateRollCriteria(position) {
        try {
            if (!position || !position.sizingDetails) return;
            
            const daysToExpiry = this.calculateDaysToExpiry(position);
            const profitPercent = this.calculateProfitPercent(position);
            
            let shouldRoll = false;
            let rollReason = '';
            
            // Criterio 1: Proximidad a expiración
            if (daysToExpiry <= this.config.rollCriteria.daysToExpiry) {
                shouldRoll = true;
                rollReason = 'approaching_expiry';
            }
            
            // Criterio 2: Profit target alcanzado
            if (profitPercent >= this.config.rollCriteria.profitThreshold) {
                shouldRoll = true;
                rollReason = 'profit_target_reached';
            }
            
            // Criterio 3: Stop loss activado
            if (profitPercent <= this.config.rollCriteria.lossThreshold) {
                shouldRoll = true;
                rollReason = 'stop_loss_triggered';
            }
            
            if (shouldRoll) {
                await this.queueForRoll(position, rollReason);
            }
            
        } catch (error) {
            this.logger.error(`Error evaluando roll criteria para ${position.id}:`, error);
        }
    }
    
    /**
     * Añadir posición a cola de roll
     */
    async queueForRoll(position, reason) {
        const optimalBand = this.selectOptimalRollBand(position);
        
        const rollItem = {
            positionId: position.id,
            ladderId: this.findLadderByPosition(position.id)?.id,
            reason: reason,
            priority: this.calculateRollPriority(reason),
            targetBand: optimalBand,
            queuedAt: Date.now()
        };
        
        this.state.rollQueue.push(rollItem);
        this.state.rollQueue.sort((a, b) => b.priority - a.priority);
        
        this.metrics.activeRolls++;
        
        this.logger.info(`Roll programado: ${position.id} -> ${optimalBand}d (${reason})`);
    }
    
    /**
     * Seleccionar banda óptima para roll
     */
    selectOptimalRollBand(position) {
        const currentBand = this.calculateDaysToExpiry(position);
        const currentTier = this.getBandTier(currentBand);
        
        // Obtener bandas del mismo tier
        const tierBands = this.config.tierDistribution[currentTier]?.bands || this.config.primeBands;
        
        // Filtrar bandas que proporcionen más tiempo
        const candidateBands = tierBands.filter(band => band > currentBand + 3);
        
        if (candidateBands.length === 0) {
            // Si no hay bandas en el mismo tier, escalar al siguiente
            const nextTierBands = currentTier === 'tier1' ? 
                this.config.tierDistribution.tier2.bands :
                this.config.tierDistribution.tier3.bands;
            
            return nextTierBands[0]; // Primera banda del siguiente tier
        }
        
        // Seleccionar banda con menor concentración theta
        return this.selectLeastConcentratedBand(position.symbol, candidateBands);
    }
    
    /**
     * Seleccionar banda con menor concentración theta
     */
    selectLeastConcentratedBand(symbol, candidateBands) {
        let minConcentration = 1.0;
        let optimalBand = candidateBands[0];
        
        for (const band of candidateBands) {
            const concentration = this.getThetaConcentrationForBand(symbol, band);
            if (concentration < minConcentration) {
                minConcentration = concentration;
                optimalBand = band;
            }
        }
        
        return optimalBand;
    }
    
    /**
     * Calcular prioridad de roll
     */
    calculateRollPriority(reason) {
        const priorities = {
            'stop_loss_triggered': 20,
            'approaching_expiry': 15,
            'profit_target_reached': 10,
            'rebalance_theta_concentration': 5,
            'manual': 15
        };
        
        return priorities[reason] || 1;
    }
    
    /**
     * Seleccionar banda óptima para rebalanceo
     */
    selectOptimalRebalanceBand(ladder) {
        const symbol = ladder.symbol;
        const currentBand = ladder.primeBand;
        
        // Obtener todas las bandas excepto la actual
        const candidateBands = this.config.primeBands.filter(band => band !== currentBand);
        
        return this.selectLeastConcentratedBand(symbol, candidateBands);
    }
    
    /**
     * Procesar cola de rolls
     */
    async processRollQueue() {
        if (this.state.rollQueue.length === 0) return;
        
        this.logger.debug(`Procesando cola de rolls: ${this.state.rollQueue.length} items pendientes`);
        
        // Procesar hasta 3 rolls por ciclo para no sobrecargar
        const maxRollsPerCycle = 3;
        const rollsToProcess = this.state.rollQueue.splice(0, maxRollsPerCycle);
        
        for (const rollItem of rollsToProcess) {
            try {
                await this.executeRoll(rollItem);
                this.metrics.activeRolls--;
                this.metrics.completedRolls++;
            } catch (error) {
                this.logger.error(`Error ejecutando roll para posición ${rollItem.positionId}:`, error);
            }
        }
    }
    
    /**
     * Ejecutar roll de posición
     */
    async executeRoll(rollItem) {
        try {
            this.logger.info(`Ejecutando roll para posición ${rollItem.positionId}: ${rollItem.reason}`);
            
            // Obtener posición actual
            const position = this.positionManager.getPosition(rollItem.positionId);
            if (!position) {
                throw new Error(`Position ${rollItem.positionId} not found`);
            }
            
            // Cerrar posición actual
            const closeResult = await this.positionManager.closePosition(
                rollItem.positionId, 
                `roll_${rollItem.reason}`
            );
            
            if (closeResult.status !== 'CLOSED') {
                throw new Error('Failed to close position for roll');
            }
            
            // Calcular nuevo entry para la nueva banda prima
            const newPositionRequest = this.generateRollPositionRequest(position, rollItem);
            
            // Abrir nueva posición en la banda target
            const newPosition = await this.positionManager.openPosition(newPositionRequest);
            
            // Actualizar ladder con la nueva posición
            this.updateLadderWithRoll(rollItem.ladderId, rollItem.positionId, newPosition.id, rollItem);
            
            // Registrar métricas del roll
            this.recordRollMetrics(rollItem, closeResult, newPosition);
            
            this.logger.info(`Roll completado: ${rollItem.positionId} -> ${newPosition.id} (${rollItem.targetBand}d)`);
            
        } catch (error) {
            this.logger.error(`Roll fallido para ${rollItem.positionId}:`, error);
            throw error;
        }
    }
    
    /**
     * Generar request para nueva posición en roll
     */
    generateRollPositionRequest(originalPosition, rollItem) {
        // Obtener precio actual del mercado
        const currentPrice = originalPosition.currentPrice;
        
        // Calcular distancias ajustadas para la nueva banda
        const bandMultiplier = rollItem.targetBand / originalPosition.sizingDetails.temporalMetrics.dte_prime_band;
        
        // Ajustar stop loss y take profit
        const originalRisk = Math.abs(originalPosition.entryPrice - originalPosition.stopLoss);
        const adjustedRisk = originalRisk * Math.sqrt(bandMultiplier);
        
        const isLong = ['BUY', 'LONG'].includes(originalPosition.side);
        const newStopLoss = isLong ? 
            currentPrice - adjustedRisk : 
            currentPrice + adjustedRisk;
        
        const newTakeProfit = isLong ?
            currentPrice + adjustedRisk * 2.0 :
            currentPrice - adjustedRisk * 2.0;
        
        return {
            symbol: originalPosition.symbol,
            side: originalPosition.side,
            entryPrice: currentPrice,
            stopLoss: newStopLoss,
            takeProfit: newTakeProfit,
            confidence: 0.7,
            leverage: originalPosition.leverage || 1,
            options: {
                expiry: this.calculateExpiryForBand(rollItem.targetBand),
                daysToExpiry: rollItem.targetBand,
                isRoll: true,
                originalPositionId: originalPosition.id,
                rollReason: rollItem.reason
            }
        };
    }
    
    /**
     * Calcular expiración para banda prima
     */
    calculateExpiryForBand(primeBand) {
        return new Date(Date.now() + primeBand * 24 * 60 * 60 * 1000).toISOString();
    }
    
    /**
     * Configurar procesamiento automático
     */
    setupAutomaticProcessing() {
        this.state.rollProcessingTimer = setInterval(async () => {
            if (this.state.rollQueue.length > 0) {
                await this.processRollQueue();
            }
        }, 30000);
        
        this.logger.info('Procesamiento automático de rolls configurado');
    }
    
    /**
     * Configurar rebalanceo automático
     */
    setupRebalancing() {
        this.state.rebalanceTimer = setInterval(async () => {
            await this.rebalanceLadders();
        }, this.config.thetaSmoothing.rebalanceInterval);
        
        this.logger.info('Rebalanceo automático de ladders configurado');
    }
    
    /**
     * Obtener métricas del sistema
     */
    getSystemMetrics() {
        return {
            ...this.metrics,
            activeLadders: this.getTotalLaddersCount(),
            queuedRolls: this.state.rollQueue.length,
            laddersBySymbol: Array.from(this.state.activeLadders.entries()).map(([symbol, ladders]) => ({
                symbol,
                ladderCount: ladders.length,
                totalPositions: ladders.reduce((sum, l) => sum + l.positions.length, 0),
                totalValue: ladders.reduce((sum, l) => sum + l.metrics.totalValue, 0),
                avgThetaEfficiency: ladders.reduce((sum, l) => sum + l.metrics.thetaEfficiency, 0) / ladders.length
            })),
            performanceByBand: Array.from(this.metrics.performanceByBand.entries()),
            timestamp: Date.now()
        };
    }
    
    /**
     * Obtener ladders por símbolo
     */
    getLaddersBySymbol(symbol) {
        return this.state.activeLadders.get(symbol) || [];
    }
    
    /**
     * Obtener cola de rolls
     */
    getRollQueue() {
        return {
            queue: [...this.state.rollQueue].map(item => ({
                ...item,
                waitTime: Date.now() - item.queuedAt
            })),
            totalQueued: this.state.rollQueue.length,
            nextProcessing: this.state.rollQueue.length > 0 ? 30000 : null
        };
    }
    
    /**
     * Forzar roll manual
     */
    async forceRoll(positionId, targetBand, reason = 'manual') {
        try {
            const containingLadder = this.findLadderByPosition(positionId);
            if (!containingLadder) {
                throw new Error(`Position ${positionId} not found in any ladder`);
            }
            
            const rollItem = {
                positionId,
                ladderId: containingLadder.id,
                reason: `manual_${reason}`,
                priority: 15,
                targetBand,
                queuedAt: Date.now()
            };
            
            this.state.rollQueue.unshift(rollItem);
            
            this.logger.info(`Manual roll programado: ${positionId} -> ${targetBand}d`);
            
            return {
                success: true,
                message: `Roll programado para posición ${positionId}`,
                queuePosition: 0,
                estimatedProcessing: '30 seconds'
            };
            
        } catch (error) {
            this.logger.error(`Error forzando roll para ${positionId}:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Métodos auxiliares simplificados
    async rebalanceLadders() { /* Implementación simplificada */ }
    calculateDaysToExpiry(position) { return position.sizingDetails?.temporalMetrics?.dte_prime_band || 999; }
    calculateProfitPercent(position) { return 0; }
    getThetaConcentrationForBand(symbol, band) { return 0.1; }
    
    findLadderByPosition(positionId) { 
        for (const [symbol, ladders] of this.state.activeLadders) {
            for (const ladder of ladders) {
                if (ladder.positions.some(p => p.positionId === positionId)) {
                    return ladder;
                }
            }
        }
        return null;
    }
    
    updateLadderMetrics(ladder) {
        let totalTheta = 0;
        let totalValue = 0;
        let validPositions = 0;
        
        for (const posRef of ladder.positions) {
            const position = this.positionManager.getPosition(posRef.positionId);
            if (position && position.status === 'ACTIVE') {
                totalTheta += this.estimatePositionTheta(position);
                totalValue += position.actualSize * position.avgEntryPrice;
                validPositions++;
            }
        }
        
        ladder.metrics.totalTheta = totalTheta;
        ladder.metrics.totalValue = totalValue;
        ladder.metrics.thetaEfficiency = validPositions > 0 ? totalTheta / validPositions : 0;
        ladder.lastRebalanced = Date.now();
    }
    
    estimatePositionTheta(position) { return 0.01; }
    
    initializeBandMetrics() {
        for (const band of this.config.primeBands) {
            this.metrics.performanceByBand.set(band, {
                totalPositions: 0,
                successfulRolls: 0,
                avgProfit: 0,
                avgHoldTime: 0,
                thetaEfficiency: 0
            });
        }
    }
    
    updateLadderWithRoll(ladderId, oldPositionId, newPositionId, rollItem) {
        for (const [symbol, ladders] of this.state.activeLadders) {
            for (const ladder of ladders) {
                if (ladder.id === ladderId) {
                    ladder.positions = ladder.positions.filter(p => p.positionId !== oldPositionId);
                    ladder.positions.push({
                        positionId: newPositionId,
                        addedAt: Date.now(),
                        rolledFrom: oldPositionId,
                        rollReason: rollItem.reason
                    });
                    ladder.metrics.rollsCompleted++;
                    return;
                }
            }
        }
    }
    
    recordRollMetrics(rollItem, closeResult, newPosition) {
        this.metrics.completedRolls++;
        this.metrics.avgRollProfit = (closeResult.realizedPnL || 0);
        
        const targetBandMetrics = this.metrics.performanceByBand.get(rollItem.targetBand);
        if (targetBandMetrics) {
            targetBandMetrics.successfulRolls++;
            targetBandMetrics.avgProfit = closeResult.realizedPnL || 0;
        }
    }
    
    /**
     * Generar métricas temporales de fallback para posiciones sin ellas
     */
    generateFallbackTemporalMetrics(position) {
        // Estimar DTE basado en el símbolo y tiempo de apertura
        const defaultDTE = this.estimateDTEFromPosition(position);
        const primeBand = this.mapDTEToPrimeBand(defaultDTE);
        
        return {
            dte_prime_band: primeBand,
            edge_temporal: random() * 0.1 - 0.05, // Edge aleatorio pequeño
            theta_normalized: random() * 0.02 + 0.005, // Theta conservador
            isFallback: true,
            generatedAt: Date.now()
        };
    }
    
    /**
     * Estimar DTE basado en características de la posición
     */
    estimateDTEFromPosition(position) {
        // Lógica heurística para estimar DTE
        const timeSinceOpen = Date.now() - position.openTime;
        const daysSinceOpen = timeSinceOpen / (24 * 60 * 60 * 1000);
        
        // Si es una posición reciente, asumir DTE medio-largo
        if (daysSinceOpen < 1) {
            return 13; // Banda prima estándar
        } else if (daysSinceOpen < 7) {
            return 11;
        } else {
            return 7;
        }
    }
    
    /**
     * Mapear DTE a banda prima más cercana
     */
    mapDTEToPrimeBand(dte) {
        return this.config.primeBands.reduce((closest, prime) => 
            Math.abs(prime - dte) < Math.abs(closest - dte) ? prime : closest
        );
    }
    getTotalLaddersCount() { 
        let total = 0;
        for (const ladders of this.state.activeLadders.values()) {
            total += ladders.length;
        }
        return total;
    }
    
    /**
     * Cleanup de recursos
     */
    async cleanup() {
        this.logger.info('Limpiando Temporal Prime Ladder...');
        
        if (this.state.rebalanceTimer) {
            clearInterval(this.state.rebalanceTimer);
        }
        
        if (this.state.rollProcessingTimer) {
            clearInterval(this.state.rollProcessingTimer);
        }
        
        this.state.initialized = false;
        this.logger.info('Temporal Prime Ladder cleanup completado');
    }
}

module.exports = { TemporalPrimeLadder };


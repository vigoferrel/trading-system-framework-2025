/**
 * 🏗️ TEMPORAL PRIME LADDER SYSTEM v2.0
 * Sistema avanzado de ladders de expiración en bandas primas
 * Optimización de win rate y control de drawdown con roll automático
 * 
 * Integra DTE en bandas primas {7,11,13,17,19,23} para suavizar θ
 * y maximizar eficiencia temporal con resonancia λ_7919
 * 
 * @author QBTC Quantum confidence Trading System
 * @version 2.0.0
 * @since 2024
 */

const { kernelRNG } = require('./utils/kernel-rng');
const { safeMath } = require('./utils/safe-math');
const { secure_logger } = require('./utils/secure-logger');

class TemporalPrimeLadder {
    constructor(config = {}) {
        // Configuración del sistema de ladders
        this.config = {
            // Bandas primas optimizadas para expiración
            primeBands: config.primeBands || [7, 11, 13, 17, 19, 23, 29, 31],
            
            // Configuración de roll automático
            rollTriggers: {
                edge_temporal_decay: config.edgeTemporalDecay || 0.02, // 2% mínimo
                iv_rank_shift: config.ivRankShift || 0.15, // 15% cambio en IV rank
                theta_efficiency_min: config.thetaEfficiencyMin || 0.6, // 60% mínimo
                days_before_expiry: config.daysBeforeExpiry || 3, // Roll 3 días antes
                profit_target_hit: config.profitTargetHit || 0.5 // 50% de ganancia máxima
            },
            
            // Distribución de expiración por tier
            tierDistribution: {
                TIER1: { primary: [11, 13, 17], secondary: [7, 19, 23] },
                TIER2: { primary: [7, 11, 13], secondary: [17, 19] },
                TIER3: { primary: [7, 11], secondary: [13, 17] },
                TIER4: { primary: [7, 11], secondary: [13] },
                TIER5: { primary: [7], secondary: [11, 13] },
                TIER6: { primary: [7], secondary: [11] }
            },
            
            // Límites de ladder por tier
            ladderLimits: {
                TIER1: { maxLadders: 6, maxPositionsPerLadder: 3 },
                TIER2: { maxLadders: 5, maxPositionsPerLadder: 2 },
                TIER3: { maxLadders: 4, maxPositionsPerLadder: 2 },
                TIER4: { maxLadders: 3, maxPositionsPerLadder: 2 },
                TIER5: { maxLadders: 2, maxPositionsPerLadder: 1 },
                TIER6: { maxLadders: 2, maxPositionsPerLadder: 1 }
            },
            
            // Configuración de suavizado θ
            thetaSmoothing: {
                targetThetaPerDay: config.targetThetaPerDay || 0.002, // 0.2% diario
                maxThetaConcentration: config.maxThetaConcentration || 0.3, // 30% en una banda
                rebalanceInterval: config.rebalanceInterval || 4 * 60 * 60 * 1000 // 4 horas
            },
            
            ...config
        };
        
        // Estado del sistema de ladders
        this.state = {
            initialized: false,
            activeLadders: new Map(), // symbol -> ladders[]
            rollQueue: [],
            ladderMetrics: new Map(),
            rebalanceTimer: null,
            rollProcessingTimer: null
        };
        
        // Referencias a otros sistemas
        this.positionManager = null;
        this.temporalEngine = null;
        this.exchangeGateway = null;
        
        // Logger específico
        this.logger = secure_logger.createLogger('TemporalPrimeLadder');
        
        // Métricas del sistema
        this.metrics = {
            totalLadders: 0,
            activeRolls: 0,
            completedRolls: 0,
            rollSuccessRate: 0.0,
            avgRollProfit: 0.0,
            thetaEfficiency: 0.0,
            ladderBalance: 0.0,
            lastRebalance: Date.now(),
            performanceByBand: new Map()
        };
        
        this.initialize();
    }
    
    /**
     * Inicializar sistema de ladders primas
     */
    async initialize() {
        try {
            this.logger.info('🏗️ Inicializando Temporal Prime Ladder System...');
            
            // Configurar procesamiento automático
            this.setupAutomaticProcessing();
            
            // Inicializar métricas por banda prima
            this.initializeBandMetrics();
            
            // Configurar rebalanceo automático
            this.setupRebalancing();
            
            this.state.initialized = true;
            this.logger.info('✅ Temporal Prime Ladder System inicializado');
            
        } catch (error) {
            this.logger.error('❌ Error inicializando Prime Ladder:', error);
            throw error;
        }
    }
    
    /**
     * Conectar con Position Manager
     */
    connectPositionManager(positionManager) {
        this.positionManager = positionManager;
        
        // Escuchar eventos de posiciones para detectar candidatos para ladders
        this.positionManager.on('position_opened', (position) => {
            this.evaluateForLadder(position);
        });
        
        this.positionManager.on('position_updated', (position) => {
            this.evaluateRollCriteria(position);
        });
        
        this.logger.info('🔗 Position Manager conectado al Prime Ladder');
    }
    
    /**
     * Conectar con Temporal Engine
     */
    connectTemporalEngine(temporalEngine) {
        this.temporalEngine = temporalEngine;
        this.logger.info('⚛️ Temporal Engine conectado al Prime Ladder');
    }
    
    /**
     * Conectar con Exchange Gateway
     */
    connectExchangeGateway(exchangeGateway) {
        this.exchangeGateway = exchangeGateway;
        this.logger.info('🔗 Exchange Gateway conectado al Prime Ladder');
    }
    
    /**
     * Evaluar posición para inclusión en ladder prima
     */
    async evaluateForLadder(position) {
        try {
            if (!this.shouldCreateLadder(position)) {
                return;
            }
            
            const symbol = position.symbol;
            const tier = this.positionManager.determineSymbolTier(symbol);
            
            // Obtener distribución de expiraciones para el tier
            const distribution = this.config.tierDistribution[tier];
            if (!distribution) {
                this.logger.warn(`No distribution found for tier ${tier}`);
                return;
            }
            
            // Crear o actualizar ladder para el símbolo
            await this.createOrUpdateLadder(symbol, tier, position);
            
        } catch (error) {
            this.logger.error('Error evaluando posición para ladder:', error);
        }
    }
    
    /**
     * Determinar si se debe crear ladder para posición
     */
    shouldCreateLadder(position) {
        // Solo para posiciones con sizing details y métricas temporales
        if (!position.sizingDetails || !position.sizingDetails.temporalMetrics) {
            return false;
        }
        
        const temporal = position.sizingDetails.temporalMetrics;
        
        // Requiere coherencia prima mínima
        if (temporal.prime_coherence < 0.4) {
            return false;
        }
        
        // Requiere edge temporal positivo
        if (temporal.edge_temporal <= 0) {
            return false;
        }
        
        // Requiere resonancia λ_7919 no mínima
        const resonanceGrade = this.gradeResonance(temporal.lambda_resonance);
        if (resonanceGrade === 'MINIMAL') {
            return false;
        }
        
        return true;
    }
    
    /**
     * Crear o actualizar ladder para símbolo
     */
    async createOrUpdateLadder(symbol, tier, position) {
        try {
            let symbolLadders = this.state.activeLadders.get(symbol) || [];
            const limits = this.config.ladderLimits[tier];
            
            // Verificar límites de ladder
            if (symbolLadders.length >= limits.maxLadders) {
                this.logger.debug(`Max ladders reached for ${symbol} (${symbolLadders.length}/${limits.maxLadders})`);
                return;
            }
            
            // Determinar banda prima óptima para nueva posición
            const optimalBand = this.selectOptimalPrimeBand(symbol, tier, position);
            
            // Buscar ladder existente en esa banda
            let targetLadder = symbolLadders.find(ladder => ladder.primeBand === optimalBand);
            
            if (!targetLadder) {
                // Crear nuevo ladder
                targetLadder = this.createNewLadder(symbol, tier, optimalBand, position);
                symbolLadders.push(targetLadder);
                
                this.logger.info(`📊 Created new prime ladder for ${symbol} - Band: ${optimalBand}d`);
            } else {
                // Verificar límites de posiciones por ladder
                if (targetLadder.positions.length >= limits.maxPositionsPerLadder) {
                    this.logger.debug(`Max positions reached for ${symbol} ladder ${optimalBand}d`);
                    return;
                }
                
                // Añadir posición al ladder existente
                targetLadder.positions.push({
                    positionId: position.id,
                    addedAt: Date.now(),
                    originalMetrics: position.sizingDetails.temporalMetrics
                });
            }
            
            // Actualizar métricas del ladder
            this.updateLadderMetrics(targetLadder);
            
            // Guardar cambios
            this.state.activeLadders.set(symbol, symbolLadders);
            this.metrics.totalLadders = this.getTotalLaddersCount();
            
        } catch (error) {
            this.logger.error(`Error creating/updating ladder for ${symbol}:`, error);
        }
    }
    
    /**
     * Seleccionar banda prima óptima
     */
    selectOptimalPrimeBand(symbol, tier, position) {
        const distribution = this.config.tierDistribution[tier];
        const temporal = position.sizingDetails.temporalMetrics;
        
        // Priorizar bandas primary si la coherencia es alta
        const candidateBands = temporal.prime_coherence >= 0.6 ? 
            distribution.primary : distribution.primary.concat(distribution.secondary);
        
        // Seleccionar banda con menor concentración de theta actual
        let optimalBand = candidateBands[0];
        let minThetaConcentration = 1.0;
        
        for (const band of candidateBands) {
            const concentration = this.getThetaConcentrationForBand(symbol, band);
            if (concentration < minThetaConcentration) {
                minThetaConcentration = concentration;
                optimalBand = band;
            }
        }
        
        // Factor de resonancia λ_7919 para ajuste final
        const resonanceFactor = Math.abs(temporal.lambda_resonance);
        if (resonanceFactor > 0.5) {
            // Resonancia fuerte: preferir bandas más cortas
            const shorterBands = candidateBands.filter(b => b <= 13);
            if (shorterBands.length > 0) {
                optimalBand = shorterBands[Math.floor(kernelRNG.nextFloat() * shorterBands.length)];
            }
        }
        
        return optimalBand;
    }
    
    /**
     * Crear nuevo ladder prima
     */
    createNewLadder(symbol, tier, primeBand, position) {
        return {
            id: `LADDER_${symbol}_${primeBand}_${Date.now()}`,
            symbol,
            tier,
            primeBand,
            createdAt: Date.now(),
            lastRebalanced: Date.now(),
            positions: [{
                positionId: position.id,
                addedAt: Date.now(),
                originalMetrics: position.sizingDetails.temporalMetrics
            }],
            metrics: {
                totalTheta: 0,
                avgEdgeTemporal: 0,
                totalValue: 0,
                unrealizedPnL: 0,
                thetaEfficiency: 0,
                rollsCompleted: 0,
                rollsSuccessful: 0
            },
            rollHistory: [],
            status: 'ACTIVE'
        };
    }
    
    /**
     * Evaluar criterios de roll para posición
     */
    async evaluateRollCriteria(position) {
        try {
            // Buscar ladder que contenga esta posición
            const containingLadder = this.findLadderByPosition(position.id);
            if (!containingLadder) {
                return;
            }
            
            // Evaluar si debe hacer roll
            const rollDecision = await this.shouldRollPosition(position, containingLadder);
            
            if (rollDecision.shouldRoll) {
                // Añadir a cola de roll
                this.state.rollQueue.push({
                    positionId: position.id,
                    ladderId: containingLadder.id,
                    reason: rollDecision.reason,
                    priority: rollDecision.priority,
                    targetBand: rollDecision.targetBand,
                    queuedAt: Date.now()
                });
                
                this.logger.info(`📋 Position ${position.id} queued for roll: ${rollDecision.reason}`);
            }
            
        } catch (error) {
            this.logger.error('Error evaluating roll criteria:', error);
        }
    }
    
    /**
     * Determinar si posición debe hacer roll
     */
    async shouldRollPosition(position, ladder) {
        const rollDecision = {
            shouldRoll: false,
            reason: null,
            priority: 0,
            targetBand: null
        };
        
        try {
            // 1. Verificar días hasta expiración
            const daysToExpiry = this.calculateDaysToExpiry(position);
            if (daysToExpiry <= this.config.rollTriggers.days_before_expiry) {
                rollDecision.shouldRoll = true;
                rollDecision.reason = 'approaching_expiry';
                rollDecision.priority = 10; // Alta prioridad
                rollDecision.targetBand = this.selectNextPrimeBand(ladder);
            }
            
            // 2. Verificar caída de edge temporal
            if (position.sizingDetails && position.sizingDetails.temporalMetrics) {
                const currentEdge = position.sizingDetails.temporalMetrics.edge_temporal;
                if (currentEdge < this.config.rollTriggers.edge_temporal_decay) {
                    rollDecision.shouldRoll = true;
                    rollDecision.reason = 'edge_temporal_decay';
                    rollDecision.priority = Math.max(rollDecision.priority, 8);
                    rollDecision.targetBand = this.selectNextPrimeBand(ladder);
                }
            }
            
            // 3. Verificar objetivo de ganancia alcanzado
            const profitPercent = this.calculateProfitPercent(position);
            if (profitPercent >= this.config.rollTriggers.profit_target_hit) {
                rollDecision.shouldRoll = true;
                rollDecision.reason = 'profit_target_hit';
                rollDecision.priority = Math.max(rollDecision.priority, 6);
                rollDecision.targetBand = this.selectNextPrimeBand(ladder);
            }
            
            // 4. Verificar eficiencia theta del ladder
            if (ladder.metrics.thetaEfficiency < this.config.rollTriggers.theta_efficiency_min) {
                rollDecision.shouldRoll = true;
                rollDecision.reason = 'low_theta_efficiency';
                rollDecision.priority = Math.max(rollDecision.priority, 4);
                rollDecision.targetBand = this.selectOptimalRebalanceBand(ladder);
            }
            
        } catch (error) {
            this.logger.error('Error determining roll decision:', error);
        }
        
        return rollDecision;
    }
    
    /**
     * Seleccionar siguiente banda prima para roll
     */
    selectNextPrimeBand(ladder) {
        const distribution = this.config.tierDistribution[ladder.tier];
        const currentBand = ladder.primeBand;
        
        // Preferir banda inmediatamente superior si existe
        const sortedBands = distribution.primary.concat(distribution.secondary).sort((a, b) => a - b);
        const currentIndex = sortedBands.indexOf(currentBand);
        
        if (currentIndex >= 0 && currentIndex < sortedBands.length - 1) {
            return sortedBands[currentIndex + 1];
        }
        
        // Si está en la banda más alta, ciclar a la más baja
        return sortedBands[0];
    }
    
    /**
     * Seleccionar banda óptima para rebalanceo
     */
    selectOptimalRebalanceBand(ladder) {
        const symbol = ladder.symbol;
        const tier = ladder.tier;
        const distribution = this.config.tierDistribution[tier];
        
        // Encontrar banda con menor concentración theta
        const allBands = distribution.primary.concat(distribution.secondary);
        let optimalBand = allBands[0];
        let minConcentration = 1.0;
        
        for (const band of allBands) {
            const concentration = this.getThetaConcentrationForBand(symbol, band);
            if (concentration < minConcentration) {
                minConcentration = concentration;
                optimalBand = band;
            }
        }
        
        return optimalBand;
    }
    
    /**
     * Procesar cola de rolls automáticamente
     */
    async processRollQueue() {
        if (this.state.rollQueue.length === 0) {
            return;
        }
        
        // Ordenar por prioridad
        this.state.rollQueue.sort((a, b) => b.priority - a.priority);
        
        // Procesar hasta 3 rolls por ciclo para no sobrecargar
        const maxRollsPerCycle = 3;
        const rollsToProcess = this.state.rollQueue.splice(0, maxRollsPerCycle);
        
        for (const rollItem of rollsToProcess) {
            try {
                await this.executeRoll(rollItem);
                this.metrics.activeRolls--;
                this.metrics.completedRolls++;
            } catch (error) {
                this.logger.error(`Error executing roll for position ${rollItem.positionId}:`, error);
            }
        }
    }
    
    /**
     * Ejecutar roll de posición
     */
    async executeRoll(rollItem) {
        try {
            this.logger.info(`🔄 Executing roll for position ${rollItem.positionId}: ${rollItem.reason}`);
            
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
            
            this.logger.info(`✅ Roll completed: ${rollItem.positionId} -> ${newPosition.id} (${rollItem.targetBand}d)`);
            
        } catch (error) {
            this.logger.error(`❌ Roll failed for ${rollItem.positionId}:`, error);
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
        const adjustedRisk = originalRisk * Math.sqrt(bandMultiplier); // Ajuste no-lineal
        
        const isLong = ['BUY', 'LONG'].includes(originalPosition.side);
        const newStopLoss = isLong ? 
            currentPrice - adjustedRisk : 
            currentPrice + adjustedRisk;
        
        const newTakeProfit = isLong ?
            currentPrice + adjustedRisk * 2.0 : // Mantener ratio 2:1
            currentPrice - adjustedRisk * 2.0;
        
        return {
            symbol: originalPosition.symbol,
            side: originalPosition.side,
            entryPrice: currentPrice,
            stopLoss: newStopLoss,
            takeProfit: newTakeProfit,
            confidence: 0.7, // Confidence moderada para rolls
            leverage: originalPosition.leverage || 1,
            options: {
                expiry: this.calculateExpiryForBand(rollItem.targetBand),
                daysToExpiry: rollItem.targetBand,
                isRoll: true,
                originalPositionId: originalPosition.id,
                rollReason: rollItem.reason
            }\n        };\n    }\n    \n    /**\n     * Calcular expiración para banda prima\n     */\n    calculateExpiryForBand(primeBand) {\n        return new Date(Date.now() + primeBand * 24 * 60 * 60 * 1000).toISOString();\n    }\n    \n    // === MÉTODOS AUXILIARES ===\n    \n    /**\n     * Configurar procesamiento automático\n     */\n    setupAutomaticProcessing() {\n        // Procesar cola de rolls cada 30 segundos\n        this.state.rollProcessingTimer = setInterval(async () => {\n            if (this.state.rollQueue.length > 0) {\n                await this.processRollQueue();\n            }\n        }, 30000);\n        \n        this.logger.info('🔄 Automatic roll processing configured');\n    }\n    \n    /**\n     * Configurar rebalanceo automático\n     */\n    setupRebalancing() {\n        this.state.rebalanceTimer = setInterval(async () => {\n            await this.rebalanceLadders();\n        }, this.config.thetaSmoothing.rebalanceInterval);\n        \n        this.logger.info('⚖️ Automatic ladder rebalancing configured');\n    }\n    \n    /**\n     * Rebalancear ladders para optimizar theta\n     */\n    async rebalanceLadders() {\n        try {\n            this.logger.debug('⚖️ Starting ladder rebalancing...');\n            \n            for (const [symbol, ladders] of this.state.activeLadders) {\n                await this.rebalanceSymbolLadders(symbol, ladders);\n            }\n            \n            this.metrics.lastRebalance = Date.now();\n            \n        } catch (error) {\n            this.logger.error('Error in ladder rebalancing:', error);\n        }\n    }\n    \n    /**\n     * Rebalancear ladders de un símbolo\n     */\n    async rebalanceSymbolLadders(symbol, ladders) {\n        // Calcular distribución theta actual\n        const thetaDistribution = this.calculateThetaDistribution(ladders);\n        \n        // Verificar si hay concentración excesiva\n        const maxConcentration = Math.max(...Object.values(thetaDistribution));\n        \n        if (maxConcentration > this.config.thetaSmoothing.maxThetaConcentration) {\n            this.logger.info(`🎯 Rebalancing ${symbol} - Max theta concentration: ${(maxConcentration * 100).toFixed(1)}%`);\n            \n            // Identificar ladders que necesitan rebalanceo\n            for (const ladder of ladders) {\n                if (thetaDistribution[ladder.primeBand] > this.config.thetaSmoothing.maxThetaConcentration) {\n                    await this.rebalanceLadder(ladder);\n                }\n            }\n        }\n    }\n    \n    /**\n     * Rebalancear ladder individual\n     */\n    async rebalanceLadder(ladder) {\n        // Seleccionar posiciones para mover a otras bandas\n        const positionsToMove = ladder.positions.slice(1); // Mantener al menos una posición\n        \n        for (const positionRef of positionsToMove) {\n            const position = this.positionManager.getPosition(positionRef.positionId);\n            if (position && position.status === 'ACTIVE') {\n                \n                // Añadir a cola de roll con prioridad de rebalanceo\n                this.state.rollQueue.push({\n                    positionId: position.id,\n                    ladderId: ladder.id,\n                    reason: 'rebalance_theta_concentration',\n                    priority: 5,\n                    targetBand: this.selectOptimalRebalanceBand(ladder),\n                    queuedAt: Date.now()\n                });\n            }\n        }\n    }\n    \n    /**\n     * Calcular distribución theta de ladders\n     */\n    calculateThetaDistribution(ladders) {\n        const distribution = {};\n        let totalTheta = 0;\n        \n        // Sumar theta por banda\n        for (const ladder of ladders) {\n            if (!distribution[ladder.primeBand]) {\n                distribution[ladder.primeBand] = 0;\n            }\n            distribution[ladder.primeBand] += ladder.metrics.totalTheta;\n            totalTheta += ladder.metrics.totalTheta;\n        }\n        \n        // Convertir a porcentajes\n        for (const band in distribution) {\n            distribution[band] = safeMath.safeDiv(distribution[band], totalTheta, 0);\n        }\n        \n        return distribution;\n    }\n    \n    /**\n     * Obtener concentración theta para banda\n     */\n    getThetaConcentrationForBand(symbol, band) {\n        const ladders = this.state.activeLadders.get(symbol) || [];\n        const bandLadder = ladders.find(l => l.primeBand === band);\n        \n        if (!bandLadder) return 0;\n        \n        const totalTheta = ladders.reduce((sum, l) => sum + l.metrics.totalTheta, 0);\n        return safeMath.safeDiv(bandLadder.metrics.totalTheta, totalTheta, 0);\n    }\n    \n    /**\n     * Encontrar ladder que contiene posición\n     */\n    findLadderByPosition(positionId) {\n        for (const [symbol, ladders] of this.state.activeLadders) {\n            for (const ladder of ladders) {\n                if (ladder.positions.some(p => p.positionId === positionId)) {\n                    return ladder;\n                }\n            }\n        }\n        return null;\n    }\n    \n    /**\n     * Calcular días hasta expiración\n     */\n    calculateDaysToExpiry(position) {\n        if (!position.sizingDetails || !position.sizingDetails.temporalMetrics) {\n            return 999; // Valor alto por defecto\n        }\n        \n        return position.sizingDetails.temporalMetrics.dte_prime_band || 999;\n    }\n    \n    /**\n     * Calcular porcentaje de ganancia\n     */\n    calculateProfitPercent(position) {\n        if (!position.unrealizedPnL || !position.actualSize || !position.avgEntryPrice) {\n            return 0;\n        }\n        \n        const positionValue = position.actualSize * position.avgEntryPrice;\n        return safeMath.safeDiv(position.unrealizedPnL, positionValue, 0);\n    }\n    \n    /**\n     * Graduar resonancia\n     */\n    gradeResonance(resonance) {\n        const absResonance = Math.abs(resonance);\n        if (absResonance >= 0.7) return 'STRONG';\n        if (absResonance >= 0.4) return 'MODERATE';\n        if (absResonance >= 0.2) return 'WEAK';\n        return 'MINIMAL';\n    }\n    \n    /**\n     * Actualizar métricas de ladder\n     */\n    updateLadderMetrics(ladder) {\n        let totalTheta = 0;\n        let totalEdge = 0;\n        let totalValue = 0;\n        let totalPnL = 0;\n        let validPositions = 0;\n        \n        for (const posRef of ladder.positions) {\n            const position = this.positionManager.getPosition(posRef.positionId);\n            if (position && position.status === 'ACTIVE') {\n                \n                // Estimar theta (simulado)\n                const estimatedTheta = this.estimatePositionTheta(position);\n                totalTheta += estimatedTheta;\n                \n                // Edge temporal\n                if (position.sizingDetails && position.sizingDetails.temporalMetrics) {\n                    totalEdge += position.sizingDetails.temporalMetrics.edge_temporal;\n                }\n                \n                // Valor y PnL\n                totalValue += position.actualSize * position.avgEntryPrice;\n                totalPnL += position.unrealizedPnL || 0;\n                validPositions++;\n            }\n        }\n        \n        // Actualizar métricas del ladder\n        ladder.metrics.totalTheta = totalTheta;\n        ladder.metrics.avgEdgeTemporal = safeMath.safeDiv(totalEdge, validPositions, 0);\n        ladder.metrics.totalValue = totalValue;\n        ladder.metrics.unrealizedPnL = totalPnL;\n        ladder.metrics.thetaEfficiency = this.calculateThetaEfficiency(ladder);\n        \n        ladder.lastRebalanced = Date.now();\n    }\n    \n    /**\n     * Estimar theta de posición\n     */\n    estimatePositionTheta(position) {\n        // Estimación simplificada basada en tamaño y tiempo\n        const positionValue = position.actualSize * position.avgEntryPrice;\n        const timeDecay = (Date.now() - position.openTime) / (24 * 60 * 60 * 1000); // días\n        \n        // Theta aproximado: 0.1% del valor por día\n        return positionValue * 0.001 * Math.max(1, timeDecay);\n    }\n    \n    /**\n     * Calcular eficiencia theta\n     */\n    calculateThetaEfficiency(ladder) {\n        if (ladder.metrics.totalTheta === 0) return 0;\n        \n        // Eficiencia = PnL / Theta consumido\n        const thetaConsumed = ladder.metrics.totalTheta;\n        const pnlGenerated = ladder.metrics.unrealizedPnL;\n        \n        return safeMath.safeDiv(pnlGenerated, thetaConsumed, 0);\n    }\n    \n    /**\n     * Inicializar métricas por banda\n     */\n    initializeBandMetrics() {\n        for (const band of this.config.primeBands) {\n            this.metrics.performanceByBand.set(band, {\n                totalPositions: 0,\n                successfulRolls: 0,\n                avgProfit: 0,\n                avgHoldTime: 0,\n                thetaEfficiency: 0\n            });\n        }\n    }\n    \n    /**\n     * Actualizar ladder con roll completado\n     */\n    updateLadderWithRoll(ladderId, oldPositionId, newPositionId, rollItem) {\n        for (const [symbol, ladders] of this.state.activeLadders) {\n            for (const ladder of ladders) {\n                if (ladder.id === ladderId) {\n                    \n                    // Remover posición antigua\n                    ladder.positions = ladder.positions.filter(p => p.positionId !== oldPositionId);\n                    \n                    // Añadir posición nueva\n                    ladder.positions.push({\n                        positionId: newPositionId,\n                        addedAt: Date.now(),\n                        rolledFrom: oldPositionId,\n                        rollReason: rollItem.reason\n                    });\n                    \n                    // Registrar en historial\n                    ladder.rollHistory.push({\n                        timestamp: Date.now(),\n                        oldPositionId,\n                        newPositionId,\n                        reason: rollItem.reason,\n                        fromBand: ladder.primeBand,\n                        toBand: rollItem.targetBand\n                    });\n                    \n                    // Actualizar contador de rolls\n                    ladder.metrics.rollsCompleted++;\n                    \n                    return;\n                }\n            }\n        }\n    }\n    \n    /**\n     * Registrar métricas del roll\n     */\n    recordRollMetrics(rollItem, closeResult, newPosition) {\n        // Actualizar métricas globales\n        this.metrics.rollSuccessRate = safeMath.safeDiv(\n            this.metrics.completedRolls, \n            this.metrics.completedRolls + 1, \n            0\n        );\n        \n        // Calcular ganancia del roll\n        const rollProfit = closeResult.realizedPnL || 0;\n        this.metrics.avgRollProfit = safeMath.safeDiv(\n            (this.metrics.avgRollProfit * this.metrics.completedRolls) + rollProfit,\n            this.metrics.completedRolls + 1,\n            rollProfit\n        );\n        \n        // Actualizar métricas por banda\n        const targetBandMetrics = this.metrics.performanceByBand.get(rollItem.targetBand);\n        if (targetBandMetrics) {\n            targetBandMetrics.successfulRolls++;\n            targetBandMetrics.avgProfit = safeMath.safeDiv(\n                (targetBandMetrics.avgProfit * (targetBandMetrics.successfulRolls - 1)) + rollProfit,\n                targetBandMetrics.successfulRolls,\n                rollProfit\n            );\n        }\n    }\n    \n    /**\n     * Obtener total de ladders activos\n     */\n    getTotalLaddersCount() {\n        let total = 0;\n        for (const ladders of this.state.activeLadders.values()) {\n            total += ladders.length;\n        }\n        return total;\n    }\n    \n    /**\n     * Obtener métricas completas del sistema\n     */\n    getSystemMetrics() {\n        return {\n            ...this.metrics,\n            activeLadders: this.getTotalLaddersCount(),\n            queuedRolls: this.state.rollQueue.length,\n            laddersBySymbol: Array.from(this.state.activeLadders.entries()).map(([symbol, ladders]) => ({\n                symbol,\n                ladderCount: ladders.length,\n                totalPositions: ladders.reduce((sum, l) => sum + l.positions.length, 0),\n                totalValue: ladders.reduce((sum, l) => sum + l.metrics.totalValue, 0),\n                avgThetaEfficiency: ladders.reduce((sum, l) => sum + l.metrics.thetaEfficiency, 0) / ladders.length\n            })),\n            performanceByBand: Array.from(this.metrics.performanceByBand.entries()),\n            timestamp: Date.now()\n        };\n    }\n    \n    /**\n     * Obtener ladders por símbolo\n     */\n    getLaddersBySymbol(symbol) {\n        return this.state.activeLadders.get(symbol) || [];\n    }\n    \n    /**\n     * Obtener cola de rolls\n     */\n    getRollQueue() {\n        return {\n            queue: [...this.state.rollQueue].map(item => ({\n                ...item,\n                waitTime: Date.now() - item.queuedAt\n            })),\n            totalQueued: this.state.rollQueue.length,\n            nextProcessing: this.state.rollQueue.length > 0 ? 30000 : null // 30 segundos\n        };\n    }\n    \n    /**\n     * Forzar roll manual de posición\n     */\n    async forceRoll(positionId, targetBand, reason = 'manual') {\n        try {\n            const containingLadder = this.findLadderByPosition(positionId);\n            if (!containingLadder) {\n                throw new Error(`Position ${positionId} not found in any ladder`);\n            }\n            \n            const rollItem = {\n                positionId,\n                ladderId: containingLadder.id,\n                reason: `manual_${reason}`,\n                priority: 15, // Prioridad máxima\n                targetBand,\n                queuedAt: Date.now()\n            };\n            \n            // Añadir al inicio de la cola\n            this.state.rollQueue.unshift(rollItem);\n            \n            this.logger.info(`🎯 Manual roll queued for position ${positionId} -> ${targetBand}d`);\n            \n            return {\n                success: true,\n                message: `Roll queued for position ${positionId}`,\n                queuePosition: 0,\n                estimatedProcessing: '30 seconds'\n            };\n            \n        } catch (error) {\n            this.logger.error(`Error forcing roll for ${positionId}:`, error);\n            return {\n                success: false,\n                error: error.message\n            };\n        }\n    }\n    \n    /**\n     * Cleanup de recursos\n     */\n    async cleanup() {\n        this.logger.info('🧹 Cleaning up Temporal Prime Ladder...');\n        \n        // Detener timers\n        if (this.state.rebalanceTimer) {\n            clearInterval(this.state.rebalanceTimer);\n        }\n        \n        if (this.state.rollProcessingTimer) {\n            clearInterval(this.state.rollProcessingTimer);\n        }\n        \n        this.state.initialized = false;\n        this.logger.info('✅ Temporal Prime Ladder cleanup completed');\n    }\n}\n\nmodule.exports = { TemporalPrimeLadder };"},


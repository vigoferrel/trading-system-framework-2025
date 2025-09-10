/**
 * 💼 POSITION MANAGER θ-AWARE
 * Gestor de posiciones con métricas temporales integradas
 * 
 * @author QBTC Quantum confidence Trading System
 * @version 1.0.0
 * @since 2024
 */

const EventEmitter = require('events');
const Logger = require('../utils/secure-logger');
const { kernelRNG } = require('../utils/kernel-rng');
const SafeMath = require('../utils/safe-math');
const { TemporalPrimeLadder } = require('../temporal-prime-ladder-fixed');

class PositionManager extends EventEmitter {
    constructor(options = {}) {
        super();
        this.logger = new Logger.SecureLogger('PositionManager');
        
        // Configuración
        this.config = {
            maxPositions: options.maxPositions || 50,
            maxRiskPerPosition: options.maxRiskPerPosition || 0.02,
            maxPortfolioRisk: options.maxPortfolioRisk || 0.1,
            defaultTimeToExpiry: options.defaultTimeToExpiry || 30,
            allowedStrategies: options.allowedStrategies || ['covered_call', 'cash_secured_put', 'collar'],
            riskManagement: options.riskManagement || 'conservative',
            temporalCoherence: options.temporalCoherence || 0.618, // φ ratio
            primeTargets: options.primeTargets || [7, 11, 13, 17, 19, 23, 29],
            ...options
        };
        
        // Estado del manager
        this.state = {
            positions: new Map(),
            totalExposure: 0,
            unrealizedPnL: 0,
            realizedPnL: 0,
            
            // θ-aware metrics
            thetaBudget: {
                total: 0,
                allocated: 0,
                available: 0,
                efficiency: 0,
                reservations: new Map()
            },
            
            // Temporal metrics integradas
            temporalMetrics: {
                primeCoherence: 0,
                ladderEfficiency: 0,
                rollTargets: new Map(),
                nextPrimeWindow: 0
            },
            
            // Gestión de riesgo
            riskMetrics: {
                portfolioVaR: 0,
                maxDrawdown: 0,
                sharpeRatio: 0,
                portfolioDelta: 0,
                portfolioGamma: 0,
                portfolioTheta: 0,
                portfolioVega: 0
            }
        };
        
        // Temporal Prime Ladder integrado
        this.primeLadder = null;
        this.initialized = false;
        
        this.logger.info('🎯 Position Manager θ-aware inicializado', {
            maxPositions: this.config.maxPositions,
            temporalCoherence: this.config.temporalCoherence,
            primeTargets: this.config.primeTargets
        });
    }
    
    /**
     * Inicializar Position Manager con Temporal Prime Ladder
     */
    async initialize(temporalEngine) {
        try {
            this.logger.info('🚀 Inicializando Position Manager θ-aware...');
            
            // Inicializar Temporal Prime Ladder
            if (temporalEngine) {
                this.primeLadder = new TemporalPrimeLadder(this, temporalEngine, {
                    primeTargets: this.config.primeTargets,
                    coherenceThreshold: this.config.temporalCoherence
                });
                
                await this.primeLadder.initialize();
                this.logger.info('✅ Temporal Prime Ladder integrado');
            }
            
            // Inicializar métricas
            await this.updateMetrics();
            
            this.initialized = true;
            this.logger.info('✅ Position Manager θ-aware inicializado completamente');
            
            // Emitir evento de inicialización
            this.emit('position_manager_initialized');
            
            return true;
        } catch (error) {
            this.logger.error('❌ Error inicializando Position Manager:', error);
            throw error;
        }
    }
    
    /**
     * Abrir nueva posición θ-aware
     */
    async openPosition(positionData) {
        try {
            if (!this.initialized) {
                throw new Error('Position Manager no inicializado');
            }
            
            const positionId = kernelRNG.generateUUID();
            
            // Validaciones de riesgo
            await this.validatePosition(positionData);
            
            // Calcular métricas temporales
            const temporalMetrics = await this.calculateTemporalMetrics(positionData);
            
            // Crear posición
            const position = {
                id: positionId,
                ...positionData,
                temporalMetrics,
                openTime: Date.now(),
                status: 'OPEN',
                unrealizedPnL: 0,
                realizedPnL: 0,
                
                // θ-aware metrics
                thetaAllocation: temporalMetrics.thetaBudget || 0,
                primeAlignment: temporalMetrics.primeAlignment || 0,
                rollProbability: temporalMetrics.rollProbability || 0
            };
            
            // Almacenar posición
            this.state.positions.set(positionId, position);
            
            // Actualizar budget θ
            await this.allocateThetaBudget(position);
            
            // Integrar con Prime Ladder
            if (this.primeLadder) {
                await this.primeLadder.addPosition(position);
            }
            
            // Actualizar métricas
            await this.updateMetrics();
            
            this.logger.info(`📈 Posición abierta: ${positionId}`, {
                strategy: position.strategy,
                underlying: position.underlying,
                thetaAllocation: position.thetaAllocation,
                primeAlignment: position.primeAlignment
            });
            
            // Emitir evento de posición abierta
            this.emit('position_opened', position);
            
            return position;
            
        } catch (error) {
            this.logger.error('❌ Error abriendo posición:', error);
            throw error;
        }
    }
    
    /**
     * Cerrar posición
     */
    async closePosition(positionId, closeData = {}) {
        try {
            const position = this.state.positions.get(positionId);
            if (!position) {
                throw new Error(`Posición ${positionId} no encontrada`);
            }
            
            // Calcular PnL final
            const finalPnL = closeData.pnl || position.unrealizedPnL;
            
            // Liberar budget θ
            await this.releaseThetaBudget(position);
            
            // Remover de Prime Ladder
            if (this.primeLadder) {
                await this.primeLadder.removePosition(positionId);
            }
            
            // Actualizar posición
            position.status = 'CLOSED';
            position.closeTime = Date.now();
            position.realizedPnL = finalPnL;
            position.closePrice = closeData.closePrice || position.currentPrice;
            
            // Actualizar estado global
            this.state.realizedPnL = SafeMath.add(this.state.realizedPnL, finalPnL);
            
            // Remover de posiciones activas
            this.state.positions.delete(positionId);
            
            // Actualizar métricas
            await this.updateMetrics();
            
            this.logger.info(`📉 Posición cerrada: ${positionId}`, {
                pnl: finalPnL,
                duration: position.closeTime - position.openTime,
                strategy: position.strategy
            });
            
            // Emitir evento de posición cerrada
            this.emit('position_closed', { position, pnl: finalPnL });
            
            // Verificar si todas las posiciones están cerradas
            if (this.state.positions.size === 0) {
                this.emit('all_positions_closed', { totalPnL: this.state.realizedPnL });
            }
            
            return position;
            
        } catch (error) {
            this.logger.error('❌ Error cerrando posición:', error);
            throw error;
        }
    }
    
    /**
     * Validar nueva posición
     */
    async validatePosition(positionData) {
        // Validar límites de posiciones
        if (this.state.positions.size >= this.config.maxPositions) {
            throw new Error('Límite máximo de posiciones alcanzado');
        }
        
        // Validar riesgo por posición
        const positionRisk = positionData.risk || this.calculatePositionRisk(positionData);
        if (positionRisk > this.config.maxRiskPerPosition) {
            throw new Error(`Riesgo por posición excede límite: ${positionRisk}`);
        }
        
        // Validar riesgo total del portfolio
        const portfolioRisk = SafeMath.add(this.state.riskMetrics.portfolioVaR, positionRisk);
        if (portfolioRisk > this.config.maxPortfolioRisk) {
            throw new Error(`Riesgo total del portfolio excede límite: ${portfolioRisk}`);
        }
        
        // Validar estrategia permitida
        if (!this.config.allowedStrategies.includes(positionData.strategy)) {
            throw new Error(`Estrategia no permitida: ${positionData.strategy}`);
        }
        
        return true;
    }
    
    /**
     * Calcular métricas temporales para posición
     */
    async calculateTemporalMetrics(positionData) {
        const daysToExpiry = positionData.daysToExpiry || this.config.defaultTimeToExpiry;
        
        // Calcular alineación con números primos
        const primeAlignment = this.calculatePrimeAlignment(daysToExpiry);
        
        // Calcular budget θ requerido
        const thetaBudget = this.calculateThetaBudget(positionData);
        
        // Probabilidad de roll automático
        const rollProbability = this.calculateRollProbability(daysToExpiry, primeAlignment);
        
        return {
            daysToExpiry,
            primeAlignment,
            thetaBudget,
            rollProbability,
            temporalCoherence: this.config.temporalCoherence
        };
    }
    
    /**
     * Calcular alineación con números primos
     */
    calculatePrimeAlignment(daysToExpiry) {
        const primes = this.config.primeTargets;
        let bestAlignment = 0;
        
        for (const prime of primes) {
            const distance = Math.abs(daysToExpiry - prime);
            const alignment = 1 / (1 + distance);
            bestAlignment = Math.max(bestAlignment, alignment);
        }
        
        return bestAlignment;
    }
    
    /**
     * Calcular budget θ requerido
     */
    calculateThetaBudget(positionData) {
        const baseTheta = positionData.theta || 0;
        const size = positionData.size || 1;
        const timeWeight = positionData.daysToExpiry ? (30 / positionData.daysToExpiry) : 1;
        
        return SafeMath.multiply(SafeMath.multiply(baseTheta, size), timeWeight);
    }
    
    /**
     * Calcular probabilidad de roll
     */
    calculateRollProbability(daysToExpiry, primeAlignment) {
        const baseProb = 0.3; // 30% probabilidad base
        const timeDecay = Math.max(0, (21 - daysToExpiry) / 21); // Aumenta cerca de expiración
        const primeBonus = primeAlignment * 0.4; // Bonus por alineación prima
        
        return Math.min(0.9, baseProb + timeDecay + primeBonus);
    }
    
    /**
     * Asignar budget θ a posición
     */
    async allocateThetaBudget(position) {
        const required = position.thetaAllocation;
        
        if (this.state.thetaBudget.available < required) {
            this.logger.warn('⚠️ Budget θ insuficiente, optimizando asignaciones...');
            await this.optimizeThetaAllocations();
        }
        
        this.state.thetaBudget.allocated = SafeMath.add(this.state.thetaBudget.allocated, required);
        this.state.thetaBudget.available = SafeMath.subtract(this.state.thetaBudget.available, required);
        this.state.thetaBudget.reservations.set(position.id, required);
        
        this.logger.debug(`💰 Budget θ asignado: ${required} a posición ${position.id}`);
    }
    
    /**
     * Liberar budget θ de posición
     */
    async releaseThetaBudget(position) {
        const allocated = this.state.thetaBudget.reservations.get(position.id) || 0;
        
        this.state.thetaBudget.allocated = SafeMath.subtract(this.state.thetaBudget.allocated, allocated);
        this.state.thetaBudget.available = SafeMath.add(this.state.thetaBudget.available, allocated);
        this.state.thetaBudget.reservations.delete(position.id);
        
        this.logger.debug(`💰 Budget θ liberado: ${allocated} de posición ${position.id}`);
    }
    
    /**
     * Optimizar asignaciones de budget θ
     */
    async optimizeThetaAllocations() {
        // Identificar posiciones ineficientes
        const positions = Array.from(this.state.positions.values());
        const inefficient = positions.filter(p => p.thetaAllocation / (p.unrealizedPnL || 1) < 0.1);
        
        // Considerar cerrar posiciones ineficientes
        for (const position of inefficient.slice(0, 3)) { // Máximo 3 por ciclo
            this.logger.info(`🔄 Considerando cerrar posición ineficiente: ${position.id}`);
            // Lógica de auto-close podría ir aquí
        }
    }
    
    /**
     * Calcular riesgo de posición
     */
    calculatePositionRisk(positionData) {
        const size = positionData.size || 1;
        const volatility = positionData.volatility || 0.2;
        const timeWeight = Math.sqrt((positionData.daysToExpiry || 30) / 365);
        
        return SafeMath.multiply(SafeMath.multiply(size, volatility), timeWeight);
    }
    
    /**
     * Actualizar todas las métricas
     */
    async updateMetrics() {
        try {
            // Métricas básicas
            await this.updateBasicMetrics();
            
            // Métricas de riesgo
            await this.updateRiskMetrics();
            
            // Métricas temporales
            await this.updateTemporalMetrics();
            
            // Métricas θ
            await this.updateThetaMetrics();
            
        } catch (error) {
            this.logger.error('❌ Error actualizando métricas:', error);
        }
    }
    
    /**
     * Actualizar métricas básicas
     */
    async updateBasicMetrics() {
        const positions = Array.from(this.state.positions.values());
        
        this.state.totalExposure = positions.reduce((sum, pos) => 
            SafeMath.add(sum, pos.size * (pos.currentPrice || pos.openPrice || 0)), 0);
        
        this.state.unrealizedPnL = positions.reduce((sum, pos) => 
            SafeMath.add(sum, pos.unrealizedPnL || 0), 0);
    }
    
    /**
     * Actualizar métricas de riesgo
     */
    async updateRiskMetrics() {
        const positions = Array.from(this.state.positions.values());
        
        // Portfolio Greeks
        this.state.riskMetrics.portfolioDelta = positions.reduce((sum, pos) => 
            SafeMath.add(sum, pos.delta || 0), 0);
        
        this.state.riskMetrics.portfolioGamma = positions.reduce((sum, pos) => 
            SafeMath.add(sum, pos.gamma || 0), 0);
        
        this.state.riskMetrics.portfolioTheta = positions.reduce((sum, pos) => 
            SafeMath.add(sum, pos.theta || 0), 0);
        
        this.state.riskMetrics.portfolioVega = positions.reduce((sum, pos) => 
            SafeMath.add(sum, pos.vega || 0), 0);
        
        // VaR simplificado
        this.state.riskMetrics.portfolioVaR = Math.sqrt(
            positions.reduce((sum, pos) => sum + Math.pow(pos.risk || 0, 2), 0)
        );
    }
    
    /**
     * Actualizar métricas temporales
     */
    async updateTemporalMetrics() {
        const positions = Array.from(this.state.positions.values());
        
        // Coherencia temporal promedio
        this.state.temporalMetrics.primeCoherence = positions.length > 0 ?
            positions.reduce((sum, pos) => sum + (pos.temporalMetrics?.primeAlignment || 0), 0) / positions.length : 0;
        
        // Eficiencia del ladder
        if (this.primeLadder) {
            this.state.temporalMetrics.ladderEfficiency = await this.primeLadder.getEfficiency();
        }
    }
    
    /**
     * Actualizar métricas θ
     */
    async updateThetaMetrics() {
        const totalTheta = Math.abs(this.state.riskMetrics.portfolioTheta);
        this.state.thetaBudget.total = totalTheta;
        this.state.thetaBudget.available = Math.max(0, totalTheta - this.state.thetaBudget.allocated);
        this.state.thetaBudget.efficiency = this.state.thetaBudget.allocated > 0 ? 
            this.state.unrealizedPnL / this.state.thetaBudget.allocated : 0;
    }
    
    /**
     * Obtener resumen de posiciones
     */
    getPositionsSummary() {
        return {
            totalPositions: this.state.positions.size,
            totalExposure: this.state.totalExposure,
            unrealizedPnL: this.state.unrealizedPnL,
            realizedPnL: this.state.realizedPnL,
            riskMetrics: this.state.riskMetrics,
            temporalMetrics: this.state.temporalMetrics,
            thetaBudget: this.state.thetaBudget
        };
    }
    
    /**
     * Obtener posiciones activas
     */
    getActivePositions() {
        return Array.from(this.state.positions.values());
    }
    
    /**
     * Obtener posición específica
     */
    getPosition(positionId) {
        return this.state.positions.get(positionId);
    }
    
    /**
     * Conectar con Exchange Gateway
     */
    connectExchangeGateway(exchangeGateway) {
        this.exchangeGateway = exchangeGateway;
        this.logger.info('🔗 Position Manager conectado con Exchange Gateway');
        
        // Configurar listeners para eventos del exchange
        if (this.exchangeGateway) {
            this.exchangeGateway.on('order_update', (order) => {
                this.handleOrderUpdate(order);
            });
            
            this.exchangeGateway.on('account_update', (account) => {
                this.handleAccountUpdate(account);
            });
        }
    }
    
    /**
     * Manejar actualizaciones de órdenes
     */
    handleOrderUpdate(order) {
        this.logger.debug('📊 Actualización de orden recibida:', {
            orderId: order.orderId,
            status: order.status,
            symbol: order.symbol
        });
        
        // Actualizar posición relacionada si existe
        const position = this.findPositionByOrderId(order.orderId);
        if (position) {
            position.lastOrderUpdate = order;
            this.emit('position_updated', position);
        }
    }
    
    /**
     * Manejar actualizaciones de cuenta
     */
    handleAccountUpdate(account) {
        this.logger.debug('💰 Actualización de cuenta recibida:', {
            balance: account.balance,
            equity: account.equity,
            margin: account.margin
        });
        
        // Actualizar métricas de riesgo basadas en el balance
        this.updateRiskMetricsFromAccount(account);
    }
    
    /**
     * Encontrar posición por ID de orden
     */
    findPositionByOrderId(orderId) {
        for (const position of this.state.positions.values()) {
            if (position.orderIds && position.orderIds.includes(orderId)) {
                return position;
            }
        }
        return null;
    }
    
    /**
     * Actualizar métricas de riesgo desde cuenta
     */
    updateRiskMetricsFromAccount(account) {
        // Recalcular métricas de riesgo basadas en el balance actual
        this.state.riskMetrics.accountBalance = account.balance;
        this.state.riskMetrics.accountEquity = account.equity;
        this.state.riskMetrics.availableMargin = account.availableMargin;
        
        // Emitir evento de actualización
        this.emit('risk_metrics_updated', this.state.riskMetrics);
    }
    
    /**
     * Obtener métricas del Position Manager
     */
    getPositionManagerMetrics() {
        return {
            status: this.initialized ? 'active' : 'inactive',
            totalPositions: this.state.positions.size,
            totalExposure: this.state.totalExposure,
            unrealizedPnL: this.state.unrealizedPnL,
            realizedPnL: this.state.realizedPnL,
            riskMetrics: this.state.riskMetrics,
            temporalMetrics: this.state.temporalMetrics,
            thetaBudget: this.state.thetaBudget,
            lastUpdate: Date.now()
        };
    }
    
    /**
     * Shutdown del Position Manager
     */
    async shutdown() {
        this.logger.info('🔄 Iniciando shutdown del Position Manager...');
        
        try {
            // Cerrar todas las posiciones abiertas
            const openPositions = Array.from(this.state.positions.values());
            for (const position of openPositions) {
                await this.closePosition(position.id, { 
                    reason: 'system_shutdown',
                    pnl: position.unrealizedPnL || 0 
                });
            }
            
            // Cleanup de recursos
            await this.cleanup();
            
            this.logger.info('✅ Position Manager shutdown completado');
            return true;
        } catch (error) {
            this.logger.error('❌ Error durante shutdown del Position Manager:', error);
            throw error;
        }
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
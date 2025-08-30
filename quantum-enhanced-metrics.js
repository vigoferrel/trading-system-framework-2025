
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
 * Quantum Enhanced Metrics System
 * =============================
 * 
 * Sistema avanzado de métricas de rendimiento para el sistema de trading cuántico
 * Implementa indicadores sofisticados para evaluar y optimizar el rendimiento
 * del sistema con enfoque en "hacer más con menos"
 */

const EventEmitter = require('events');

class QuantumEnhancedMetrics extends EventEmitter {
    constructor() {
        super();
        
        // Métricas básicas del sistema
        this.basicMetrics = {
            totalTrades: 0,
            successfulTrades: 0,
            failedTrades: 0,
            totalProfit: 0,
            totalLoss: 0,
            winRate: 0,
            averageProfit: 0,
            averageLoss: 0,
            profitFactor: 0,
            maxDrawdown: 0,
            currentDrawdown: 0,
            sharpeRatio: 0,
            sortinoRatio: 0,
            calmarRatio: 0
        };
        
        // Métricas cuánticas avanzadas
        this.quantumMetrics = {
            quantumEfficiency: 0.75,
            quantumAccuracy: 0.85,
            quantumCoherence: 0.8,
            quantumEntanglement: 0.7,
            quantumSuperposition: 0.6,
            quantumDecoherenceRate: 0.05,
            quantumAdvantage: 0.0,
            quantumStateStability: 0.8
        };
        
        // Métricas de optimización de recursos
        this.resourceMetrics = {
            capitalEfficiency: 0.0,
            positionSizingEfficiency: 0.0,
            riskAdjustedReturn: 0.0,
            opportunityCost: 0.0,
            resourceUtilization: 0.0,
            costBenefitRatio: 0.0,
            timeEfficiency: 0.0,
            energyEfficiency: 0.0
        };
        
        // Métricas de estrategia
        this.strategyMetrics = {
            strategyDiversity: 0.0,
            strategyPerformance: {},
            strategyAdaptability: 0.0,
            strategyRobustness: 0.0,
            strategyInnovation: 0.0,
            // Conjunto de estrategias activas (se mantiene de forma perezosa)
            _activeSet: new Set()
        };
        
        // Métricas de mercado
        this.marketMetrics = {
            marketRegime: 'unknown',
            marketVolatility: 0.0,
            marketTrend: 'neutral',
            marketLiquidity: 0.0,
            marketEfficiency: 0.0,
            marketSentiment: 0.0
        };
        
        // Historial de métricas
        this.metricsHistory = {
            daily: [],
            weekly: [],
            monthly: []
        };
        
        // Umbral de rendimiento
        this.performanceThresholds = {
            minimumWinRate: 0.6,
            minimumProfitFactor: 1.2,
            maximumDrawdown: 0.2,
            minimumSharpeRatio: 1.0,
            minimumQuantumEfficiency: 0.75,
            minimumCapitalEfficiency: 0.8
        };
        
        // Inicializar sistema
        this.initializeMetrics();
    }
    
    /**
     * Inicializa el sistema de métricas
     */
    initializeMetrics() {
        console.log('[DATA] Inicializando Sistema de Métricas Cuánticas Avanzadas...');
        
        // Configurar recolección periódica de métricas
        this.setupMetricsCollection();
        
        console.log('[OK] Sistema de Métricas Cuánticas Avanzadas inicializado');
    }
    
    /**
     * Configura la recolección periódica de métricas
     */
    setupMetricsCollection() {
        // Recolectar métricas cada minuto
        setInterval(() => {
            this.collectRealTimeMetrics();
        }, 60000);
        
        // Procesar métricas diarias
        setInterval(() => {
            this.processDailyMetrics();
        }, 24 * 60 * 60 * 1000);
        
        // Procesar métricas semanales
        setInterval(() => {
            this.processWeeklyMetrics();
        }, 7 * 24 * 60 * 60 * 1000);
    }
    
    /**
     * Recolecta métricas en tiempo real
     */
    collectRealTimeMetrics() {
        const timestamp = Date.now();
        const realTimeMetrics = {
            timestamp,
            basic: this.calculateBasicMetrics(),
            quantum: this.calculateQuantumMetrics(),
            resource: this.calculateResourceMetrics(),
            market: this.calculateMarketMetrics()
        };
        
        // Emitir evento de métricas en tiempo real
        this.emit('realTimeMetrics', realTimeMetrics);
        
        // Guardar en historial
        this.saveMetricsToHistory(realTimeMetrics);
    }
    
    /**
     * Calcula métricas básicas
     */
    calculateBasicMetrics() {
        const metrics = { ...this.basicMetrics };
        
        // Calcular win rate
        metrics.winRate = metrics.totalTrades > 0 ? 
            metrics.successfulTrades / metrics.totalTrades : 0;
        
        // Calcular profit factor
        metrics.profitFactor = metrics.totalLoss > 0 ? 
            Math.abs(metrics.totalProfit / metrics.totalLoss) : 0;
        
        // Calcular promedios
        metrics.averageProfit = metrics.successfulTrades > 0 ? 
            metrics.totalProfit / metrics.successfulTrades : 0;
        metrics.averageLoss = metrics.failedTrades > 0 ? 
            metrics.totalLoss / metrics.failedTrades : 0;
        
        return metrics;
    }
    
    /**
     * Calcula métricas cuánticas
     */
    calculateQuantumMetrics() {
        const metrics = { ...this.quantumMetrics };
        
        // Calcular ventaja cuántica
        metrics.quantumAdvantage = 
            metrics.quantumEfficiency * 
            metrics.quantumAccuracy * 
            metrics.quantumCoherence * 
            (1 - metrics.quantumDecoherenceRate);
        
        // Calcular estabilidad del estado cuántico
        metrics.quantumStateStability = 
            metrics.quantumCoherence * 
            metrics.quantumEntanglement * 
            (1 - metrics.quantumDecoherenceRate);
        
        return metrics;
    }
    
    /**
     * Calcula métricas de recursos
     */
    calculateResourceMetrics() {
        const metrics = { ...this.resourceMetrics };
        
        // Calcular eficiencia del capital
        metrics.capitalEfficiency = this.basicMetrics.totalProfit > 0 ? 
            this.basicMetrics.totalProfit / this.getCapitalDeployed() : 0;
        
        // Calcular retorno ajustado por riesgo
        metrics.riskAdjustedReturn = this.basicMetrics.totalProfit > 0 ? 
            this.basicMetrics.totalProfit / (this.basicMetrics.maxDrawdown || 0.01) : 0;
        
        // Calcular ratio costo-beneficio
        metrics.costBenefitRatio = this.getTotalCosts() > 0 ? 
            this.basicMetrics.totalProfit / this.getTotalCosts() : 0;
        
        // Calcular eficiencia temporal
        metrics.timeEfficiency = this.calculateTimeEfficiency();
        
        return metrics;
    }
    
    /**
     * Calcula métricas de mercado
     */
    calculateMarketMetrics() {
        const metrics = { ...this.marketMetrics };
        
        // Actualizar régimen de mercado
        metrics.marketRegime = this.determineMarketRegime();
        
        // Actualizar tendencia
        metrics.marketTrend = this.determineMarketTrend();
        
        // Calcular sentimiento de mercado
        metrics.marketSentiment = this.calculateMarketSentiment();
        
        return metrics;
    }
    
    /**
     * Procesa métricas diarias
     */
    processDailyMetrics() {
        const dailyMetrics = {
            date: new Date().toISOString().split('T')[0],
            summary: this.generateDailySummary(),
            performance: this.evaluateDailyPerformance(),
            recommendations: this.generateDailyRecommendations()
        };
        
        this.metricsHistory.daily.push(dailyMetrics);
        
        // Emitir evento de métricas diarias
        this.emit('dailyMetrics', dailyMetrics);
        
        console.log(`[DATA] Métricas diarias procesadas: ${dailyMetrics.date}`);
    }
    
    /**
     * Procesa métricas semanales
     */
    processWeeklyMetrics() {
        const weeklyMetrics = {
            week: this.getWeekNumber(),
            summary: this.generateWeeklySummary(),
            performance: this.evaluateWeeklyPerformance(),
            trends: this.analyzeWeeklyTrends(),
            recommendations: this.generateWeeklyRecommendations()
        };
        
        this.metricsHistory.weekly.push(weeklyMetrics);
        
        // Emitir evento de métricas semanales
        this.emit('weeklyMetrics', weeklyMetrics);
        
        console.log(`[DATA] Métricas semanales procesadas: Semana ${weeklyMetrics.week}`);
    }
    
    /**
     * Genera resumen diario
     */
    generateDailySummary() {
        return {
            totalTrades: this.basicMetrics.totalTrades,
            successfulTrades: this.basicMetrics.successfulTrades,
            totalProfit: this.basicMetrics.totalProfit,
            winRate: this.basicMetrics.winRate,
            profitFactor: this.basicMetrics.profitFactor,
            quantumEfficiency: this.quantumMetrics.quantumEfficiency,
            capitalEfficiency: this.resourceMetrics.capitalEfficiency
        };
    }
    
    /**
     * Evalúa rendimiento diario
     */
    evaluateDailyPerformance() {
        const performance = {
            overall: this.evaluateOverallPerformance(),
            efficiency: this.evaluateEfficiencyPerformance(),
            risk: this.evaluateRiskPerformance(),
            quantum: this.evaluateQuantumPerformance()
        };
        
        return performance;
    }
    
    /**
     * Evalúa rendimiento general
     */
    evaluateOverallPerformance() {
        const score = (
            (this.basicMetrics.winRate >= this.performanceThresholds.minimumWinRate ? 1 : 0) * 0.3 +
            (this.basicMetrics.profitFactor >= this.performanceThresholds.minimumProfitFactor ? 1 : 0) * 0.3 +
            (this.basicMetrics.maxDrawdown <= this.performanceThresholds.maximumDrawdown ? 1 : 0) * 0.2 +
            (this.basicMetrics.sharpeRatio >= this.performanceThresholds.minimumSharpeRatio ? 1 : 0) * 0.2
        );
        
        return {
            score,
            rating: score >= 0.8 ? 'excellent' : score >= 0.6 ? 'good' : score >= 0.4 ? 'fair' : 'poor'
        };
    }
    
    /**
     * Evalúa rendimiento de eficiencia
     */
    evaluateEfficiencyPerformance() {
        const score = (
            (this.quantumMetrics.quantumEfficiency >= this.performanceThresholds.minimumQuantumEfficiency ? 1 : 0) * 0.5 +
            (this.resourceMetrics.capitalEfficiency >= this.performanceThresholds.minimumCapitalEfficiency ? 1 : 0) * 0.5
        );
        
        return {
            score,
            rating: score >= 0.8 ? 'excellent' : score >= 0.6 ? 'good' : score >= 0.4 ? 'fair' : 'poor'
        };
    }
    
    /**
     * Evalúa rendimiento de riesgo
     */
    evaluateRiskPerformance() {
        const maxDrawdownScore = Math.max(0, 1 - (this.basicMetrics.maxDrawdown / this.performanceThresholds.maximumDrawdown));
        const volatilityScore = Math.max(0, 1 - (this.marketMetrics.marketVolatility / 0.5));
        
        const score = (maxDrawdownScore * 0.6 + volatilityScore * 0.4);
        
        return {
            score,
            rating: score >= 0.8 ? 'excellent' : score >= 0.6 ? 'good' : score >= 0.4 ? 'fair' : 'poor'
        };
    }
    
    /**
     * Evalúa rendimiento cuántico
     */
    evaluateQuantumPerformance() {
        const score = (
            this.quantumMetrics.quantumAccuracy * 0.3 +
            this.quantumMetrics.quantumCoherence * 0.3 +
            this.quantumMetrics.quantumStateStability * 0.2 +
            this.quantumMetrics.quantumAdvantage * 0.2
        );
        
        return {
            score,
            rating: score >= 0.8 ? 'excellent' : score >= 0.6 ? 'good' : score >= 0.4 ? 'fair' : 'poor'
        };
    }
    
    /**
     * Genera recomendaciones diarias
     */
    generateDailyRecommendations() {
        const recommendations = [];
        
        // Recomendaciones basadas en rendimiento general
        if (this.basicMetrics.winRate < this.performanceThresholds.minimumWinRate) {
            recommendations.push({
                type: 'warning',
                category: 'performance',
                message: 'Win rate below threshold. Consider adjusting trading strategy.',
                priority: 'high'
            });
        }
        
        // Recomendaciones basadas en eficiencia cuántica
        if (this.quantumMetrics.quantumEfficiency < this.performanceThresholds.minimumQuantumEfficiency) {
            recommendations.push({
                type: 'warning',
                category: 'quantum',
                message: 'Quantum efficiency below optimal. Recalibrate quantum algorithms.',
                priority: 'medium'
            });
        }
        
        // Recomendaciones basadas en drawdown
        if (this.basicMetrics.maxDrawdown > this.performanceThresholds.maximumDrawdown * 0.8) {
            recommendations.push({
                type: 'warning',
                category: 'risk',
                message: 'Drawdown approaching limit. Consider reducing position sizes.',
                priority: 'high'
            });
        }
        
        // Recomendaciones basadas en mercado
        if (this.marketMetrics.marketVolatility > 0.7) {
            recommendations.push({
                type: 'info',
                category: 'market',
                message: 'High volatility detected. Consider volatility-based strategies.',
                priority: 'medium'
            });
        }
        
        return recommendations;
    }
    
    /**
     * Actualiza métricas después de una operación
     */
    updateTradeMetrics(tradeResult) {
        // Actualizar métricas básicas
        this.basicMetrics.totalTrades++;
        
        if (tradeResult.profit > 0) {
            this.basicMetrics.successfulTrades++;
            this.basicMetrics.totalProfit += tradeResult.profit;
        } else {
            this.basicMetrics.failedTrades++;
            this.basicMetrics.totalLoss += Math.abs(tradeResult.profit);
        }
        
        // Actualizar drawdown
        this.updateDrawdown(tradeResult);
        
        // Actualizar métricas de estrategia
        this.updateStrategyMetrics(tradeResult);
        
        // Calcular ratios avanzados
        this.calculateAdvancedRatios();
        
        // Emitir evento de actualización
        this.emit('tradeMetricsUpdated', {
            trade: tradeResult,
            metrics: this.basicMetrics
        });
    }
    
    /**
     * Actualiza drawdown
     */
    updateDrawdown(tradeResult) {
        // Implementar lógica de actualización de drawdown
        // Esta es una implementación simplificada
        if (tradeResult.profit < 0) {
            this.basicMetrics.currentDrawdown += Math.abs(tradeResult.profit);
            this.basicMetrics.maxDrawdown = Math.max(
                this.basicMetrics.maxDrawdown,
                this.basicMetrics.currentDrawdown
            );
        } else {
            this.basicMetrics.currentDrawdown = Math.max(0, this.basicMetrics.currentDrawdown - tradeResult.profit);
        }
    }
    
    /**
     * Actualiza métricas de estrategia
     */
    updateStrategyMetrics(tradeResult) {
        const strategy = tradeResult.strategy;
        
        if (!this.strategyMetrics.strategyPerformance[strategy]) {
            this.strategyMetrics.strategyPerformance[strategy] = {
                trades: 0,
                successfulTrades: 0,
                totalProfit: 0,
                averageProfit: 0,
                winRate: 0
            };
        }
        
        const strategyPerf = this.strategyMetrics.strategyPerformance[strategy];
        strategyPerf.trades++;
        
        if (tradeResult.profit > 0) {
            strategyPerf.successfulTrades++;
            strategyPerf.totalProfit += tradeResult.profit;
        }
        
        strategyPerf.winRate = strategyPerf.trades > 0 ? 
            strategyPerf.successfulTrades / strategyPerf.trades : 0;
        strategyPerf.averageProfit = strategyPerf.successfulTrades > 0 ? 
            strategyPerf.totalProfit / strategyPerf.successfulTrades : 0;
        
        // Actualizar diversidad de estrategias
        this.updateStrategyDiversity();
    }
    
    /**
     * Actualiza diversidad de estrategias
     */
    updateStrategyDiversity() {
        const strategies = Object.keys(this.strategyMetrics.strategyPerformance);
        const totalTrades = strategies.reduce((sum, strategy) => 
            sum + this.strategyMetrics.strategyPerformance[strategy].trades, 0);
        
        if (totalTrades > 0) {
            // Calcular índice de diversidad de Shannon
            let diversity = 0;
            for (const strategy of strategies) {
                const proportion = this.strategyMetrics.strategyPerformance[strategy].trades / totalTrades;
                if (proportion > 0) {
                    diversity -= proportion * Math.log(proportion);
                }
            }
            
            // Normalizar a 0-1
            const maxDiversity = Math.log(strategies.length);
            this.strategyMetrics.strategyDiversity = strategies.length > 1 ? 
                diversity / maxDiversity : 0;
        }
    }
    
    /**
     * Calcula ratios avanzados
     */
    calculateAdvancedRatios() {
        // Calcular Sharpe Ratio (simplificado)
        if (this.basicMetrics.totalTrades > 10) {
            const avgReturn = this.basicMetrics.totalProfit / this.basicMetrics.totalTrades;
            const returnStdDev = this.calculateReturnStdDev();
            this.basicMetrics.sharpeRatio = returnStdDev > 0 ? avgReturn / returnStdDev : 0;
        }
        
        // Calcular Sortino Ratio (simplificado)
        if (this.basicMetrics.totalTrades > 10) {
            const avgReturn = this.basicMetrics.totalProfit / this.basicMetrics.totalTrades;
            const negativeReturnStdDev = this.calculateNegativeReturnStdDev();
            this.basicMetrics.sortinoRatio = negativeReturnStdDev > 0 ? avgReturn / negativeReturnStdDev : 0;
        }
        
        // Calcular Calmar Ratio
        if (this.basicMetrics.maxDrawdown > 0) {
            const annualizedReturn = this.basicMetrics.totalProfit * 365 / this.getDaysActive();
            this.basicMetrics.calmarRatio = annualizedReturn / this.basicMetrics.maxDrawdown;
        }
    }
    
    /**
     * Obtiene estado completo del sistema de métricas
     */
    getMetricsState() {
        return {
            basic: this.basicMetrics,
            quantum: this.quantumMetrics,
            resource: this.resourceMetrics,
            strategy: this.strategyMetrics,
            market: this.marketMetrics,
            thresholds: this.performanceThresholds,
            lastUpdated: Date.now()
        };
    }

    /**
     * Actualiza métricas a partir de señales generadas
     * payload esperado: { signals: Signal[], timestamp, quantumMatrix? }
     * o una señal única { symbol, strategy, confidence, ... }
     */
    updateSignalMetrics(payload) {
        try {
            const signals = Array.isArray(payload?.signals) ? payload.signals : (payload ? [payload] : []);
            if (!signals.length) return;

            for (const s of signals) {
                const strategy = (s?.strategy || 'unknown').toString();
                // Inicializar registro por estrategia si no existe
                if (!this.strategyMetrics.strategyPerformance[strategy]) {
                    this.strategyMetrics.strategyPerformance[strategy] = {
                        trades: 0,
                        successfulTrades: 0,
                        totalProfit: 0,
                        averageProfit: 0,
                        winRate: 0
                    };
                }
                // Contabilizar "actividad" de estrategia a partir de señales
                this.strategyMetrics.strategyPerformance[strategy].trades += 1;

                // Marcar estrategia como activa
                if (!this.strategyMetrics._activeSet) this.strategyMetrics._activeSet = new Set();
                this.strategyMetrics._activeSet.add(strategy);
            }

            // Recalcular diversidad y adaptabilidad (usar diversidad como proxy)
            this.updateStrategyDiversity();
            this.strategyMetrics.strategyAdaptability = this.strategyMetrics.strategyDiversity;

            // Actualizar métricas de mercado básicas si hay matriz cuántica
            if (payload?.quantumMatrix && Array.isArray(payload.quantumMatrix)) {
                this.marketMetrics.marketRegime = this.determineMarketRegime();
                this.marketMetrics.marketTrend = this.determineMarketTrend();
            }

            // Emitir evento informativo
            this.emit?.('signalsMetricsUpdated', {
                count: signals.length,
                activeStrategies: this.strategyMetrics._activeSet ? this.strategyMetrics._activeSet.size : 0,
                strategyDiversity: this.strategyMetrics.strategyDiversity,
                ts: Date.now()
            });
        } catch (e) {
            // Tolerante a errores
        }
    }

    /**
     * Actualiza métricas a partir de eventos de posición (apertura/cierre)
     * payload esperado: { position, signal?, profitLoss? }
     */
    updatePositionMetrics(payload) {
        try {
            const pos = payload?.position || payload;
            if (!pos) return;
            const strategy = (pos?.strategy || 'unknown').toString();

            if (!this.strategyMetrics.strategyPerformance[strategy]) {
                this.strategyMetrics.strategyPerformance[strategy] = {
                    trades: 0,
                    successfulTrades: 0,
                    totalProfit: 0,
                    averageProfit: 0,
                    winRate: 0
                };
            }

            // Mantener conjunto de activas
            if (!this.strategyMetrics._activeSet) this.strategyMetrics._activeSet = new Set();
            if (String(pos?.status || '').toUpperCase() === 'OPEN') {
                this.strategyMetrics._activeSet.add(strategy);
            }
            if (String(pos?.status || '').toUpperCase() === 'CLOSED') {
                // Remover si no quedan más posiciones de esa estrategia (heurística simple)
                // Nota: si el emisor no provee contexto, mantenemos conservative: no remover.
                // Dejar activo hasta que pase mantenimiento periódico.
            }

            // Re-contabilizar diversidad/adaptabilidad
            this.updateStrategyDiversity();
            this.strategyMetrics.strategyAdaptability = this.strategyMetrics.strategyDiversity;

            this.emit?.('positionMetricsUpdated', {
                strategy,
                activeStrategies: this.strategyMetrics._activeSet.size,
                strategyDiversity: this.strategyMetrics.strategyDiversity,
                ts: Date.now()
            });
        } catch (e) {
            // Tolerante a errores
        }
    }

    /**
     * Actualiza métricas cuánticas en tiempo real
     * payload esperado: { quantumMatrix, marketData? } o estructura equivalente
     */
    updateQuantumMetrics(payload) {
        try {
            const qm = payload?.quantumMatrix;
            if (Array.isArray(qm) && qm.length > 0) {
                // Promedios simples de primeras columnas si existen (entanglement ~ col0, coherence ~ col1)
                let sumEnt = 0, sumCoh = 0, n = 0;
                for (const row of qm) {
                    if (Array.isArray(row)) {
                        if (typeof row[0] === 'number') sumEnt += row[0];
                        if (typeof row[1] === 'number') sumCoh += row[1];
                        n++;
                    }
                }
                if (n > 0) {
                    const avgEnt = Math.max(0, Math.min(1, sumEnt / n));
                    const avgCoh = Math.max(0, Math.min(1, sumCoh / n));
                    this.quantumMetrics.quantumEntanglement = avgEnt;
                    this.quantumMetrics.quantumCoherence = avgCoh;
                    // Recalcular ventaja cuántica y estabilidad
                    const qm2 = this.calculateQuantumMetrics();
                    this.quantumMetrics = { ...this.quantumMetrics, ...qm2 };
                }
            }

            // Sentimiento/volatilidad si marketData aporta algo (fallbacks si no)
            if (payload?.marketData && typeof payload.marketData === 'object') {
                // Heurística: sentimiento ~ 0.5-0.8 si hay datos
                this.marketMetrics.marketSentiment = Math.max(0.4, Math.min(0.9, this.marketMetrics.marketSentiment || 0.6));
                this.marketMetrics.marketVolatility = Math.max(0.1, this.marketMetrics.marketVolatility || 0.2);
            }

            this.emit?.('quantumMetricsUpdated', {
                quantum: this.quantumMetrics,
                market: this.marketMetrics,
                ts: Date.now()
            });
        } catch (e) {
            // Tolerante a errores
        }
    }
    
    /**
     * Genera reporte de rendimiento completo
     */
    generatePerformanceReport() {
        const report = {
            timestamp: Date.now(),
            summary: this.generateDailySummary(),
            performance: this.evaluateDailyPerformance(),
            recommendations: this.generateDailyRecommendations(),
            detailedMetrics: this.getMetricsState()
        };
        
        return report;
    }
    
    // Métodos auxiliares
    getCapitalDeployed() {
        // Implementar lógica para obtener capital desplegado
        return 10000; // Valor por defecto
    }
    
    getTotalCosts() {
        // Implementar lógica para obtener costos totales
        return 100; // Valor por defecto
    }
    
    calculateTimeEfficiency() {
        // Implementar lógica para calcular eficiencia temporal
        return 0.8; // Valor por defecto
    }
    
    determineMarketRegime() {
        // Implementar lógica para determinar régimen de mercado
        return 'trending'; // Valor por defecto
    }
    
    determineMarketTrend() {
        // Implementar lógica para determinar tendencia de mercado
        return 'bullish'; // Valor por defecto
    }
    
    calculateMarketSentiment() {
        // Implementar lógica para calcular sentimiento de mercado
        return 0.6; // Valor por defecto
    }
    
    getWeekNumber() {
        const date = new Date();
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
    
    generateWeeklySummary() {
        // Implementar lógica para generar resumen semanal
        return { totalTrades: 0, totalProfit: 0 }; // Placeholder
    }
    
    evaluateWeeklyPerformance() {
        // Implementar lógica para evaluar rendimiento semanal
        return { score: 0.5, rating: 'fair' }; // Placeholder
    }
    
    analyzeWeeklyTrends() {
        // Implementar lógica para analizar tendencias semanales
        return { profitTrend: 'stable', efficiencyTrend: 'improving' }; // Placeholder
    }
    
    generateWeeklyRecommendations() {
        // Implementar lógica para generar recomendaciones semanales
        return []; // Placeholder
    }
    
    saveMetricsToHistory(metrics) {
        // Implementar lógica para guardar métricas en historial
        console.log('Métricas guardadas en historial:', metrics.timestamp);
    }
    
    calculateReturnStdDev() {
        // Implementar lógica para calcular desviación estándar de retornos
        return 0.1; // Valor por defecto
    }
    
    calculateNegativeReturnStdDev() {
        // Implementar lógica para calcular desviación estándar de retornos negativos
        return 0.05; // Valor por defecto
    }
    
    getDaysActive() {
        // Implementar lógica para obtener días activos
        return 30; // Valor por defecto
    }
}

module.exports = QuantumEnhancedMetrics;
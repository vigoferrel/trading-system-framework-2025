#!/usr/bin/env node
/**
 * 💎 VOLATILITY MONETIZATION SYSTEM
 * ================================
 * 
 * Implementación práctica del principio "MENOS ES MÁS"
 * 
 * UNA VERDAD FUNDAMENTAL:
 * "La incertidumbre tiene precio, y tú puedes cobrarlo"
 * 
 * Este sistema transforma holders pasivos en cobradores activos de volatilidad
 * usando la geometría temporal y el poder del compounding.
 * 
 * @author QBTC Systems - Volatility Monetization Division
 * @version 1.0 - MENOS ES MÁS
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ==============================================================================
// 🎯 CONSTANTES FUNDAMENTALES - "MENOS ES MÁS"
// ==============================================================================

const CORE_TRUTH = {
    PRINCIPLE: "La incertidumbre tiene precio, y tú puedes cobrarlo",
    TARGET_MONTHLY: 0.025,        // 2.5% mensual = 30%+ anual
    COMPOUNDING_MAGIC: 1.025**12, // = 1.344 (34.4% anual compuesto)
    VOLATILITY_DECAY_RATE: 0.05   // Theta decay diario promedio
};

const HOLDER_PROFILES = {
    CONSERVATIVE: {
        max_portfolio_risk: 0.15,     // 15% máximo del portfolio
        otm_buffer: 0.20,             // 20% Out-The-Money buffer
        assignment_tolerance: 0.10,    // 10% probabilidad asignación máxima
        target_premium: 0.02,         // 2% mensual objetivo
        max_dte: 45                   // 45 días máximo
    },
    MODERATE: {
        max_portfolio_risk: 0.25,
        otm_buffer: 0.15,
        assignment_tolerance: 0.20,
        target_premium: 0.03,
        max_dte: 60
    },
    AGGRESSIVE: {
        max_portfolio_risk: 0.35,
        otm_buffer: 0.10,
        assignment_tolerance: 0.30,
        target_premium: 0.05,
        max_dte: 90
    }
};

// Uso del kernel RNG del sistema existente
// Usar el motor de costos reales
const { createRealCostEngine } = require('./transaction-costs-engine.js');
const { createRealMarketDataEngine } = require('./real-market-data-engine.js');
// Si existe el kernel RNG del sistema existente, usarlo; sino, usar Math de forma controlada
let kernelRNG, setSeed;
try {
    const kernelModule = require('./src/utils/kernel-rng.js');
    kernelRNG = kernelModule.kernelRNG;
    setSeed = kernelModule.setSeed;
} catch (error) {
    // Fallback: implementación simple sin Math.random
    let seed = Date.now();
    kernelRNG = {
        nextFloat: () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        },
        nextInt: (max) => Math.floor(kernelRNG.nextFloat() * max),
        nextBoolean: (prob = 0.5) => kernelRNG.nextFloat() < prob
    };
    setSeed = (newSeed) => { seed = newSeed; };
}

// ==============================================================================
// 🏭 SISTEMA PRINCIPAL DE MONETIZACIÓN
// ==============================================================================

class VolatilityMonetizationSystem {
    constructor(config = {}) {
        this.config = {
            profile: config.profile || 'CONSERVATIVE',
            initial_capital: config.initial_capital || 100000,
            enable_background_monitoring: config.enable_background_monitoring ?? true,
            enable_quantum_optimization: config.enable_quantum_optimization ?? true,
            language: config.language || 'es',
            ...config
        };
        
        this.state = {
            portfolio: new Map(),
            active_positions: new Map(),
            cash_available: this.config.initial_capital,
            total_portfolio_value: this.config.initial_capital,
            monthly_premium_collected: 0,
            inception_date: new Date(),
            performance_metrics: {
                total_return: 0,
                monthly_returns: [],
                win_rate: 0,
                max_drawdown: 0,
                sharpe_ratio: 0
            }
        };
        
        this.profile_settings = HOLDER_PROFILES[this.config.profile];
        this.volatility_engine = new VolatilityEngine();
        this.wheel_strategy = new WheelStrategy(this.profile_settings);
        this.risk_manager = new RiskManager(this.profile_settings);
        
        // Integrar motor de costos reales
        this.cost_engine = createRealCostEngine(
            this.config.broker || 'BINANCE', 
            {
                account_size: this.config.initial_capital,
                monthly_volume: this.config.initial_capital * 0.5, // 50% monthly turnover estimate
                enable_logging: this.config.enable_background_monitoring
            }
        );
        
        // Integrar motor de datos de mercado reales
        this.market_data_engine = createRealMarketDataEngine({
            enable_caching: true,
            cache_duration_ms: 60000, // 1 minuto cache
            enable_fallback: true
        });
        
        // Inicializar logging en segundo plano
        if (this.config.enable_background_monitoring) {
            this.startBackgroundMonitoring();
        }
    }
    
    /**
     * 🎯 MÉTODO PRINCIPAL: Analizar y ejecutar oportunidades
     */
    async analyzeAndExecute(symbols = ['BTCUSDT', 'ETHUSDT', 'AAPL', 'TSLA']) {
        // Obtener datos de mercado reales
        console.log('📡 Obteniendo datos de mercado actualizados...');
        const market_data = await this.market_data_engine.getMarketData(symbols);
        
        // Mostrar precios actuales
        console.log('\n💹 PRECIOS ACTUALES:');
        Object.entries(market_data).forEach(([symbol, data]) => {
            const change_color = data.price_change_24h > 0 ? '🟢' : '🔴';
            console.log(`   ${change_color} ${symbol}: $${data.current_price.toLocaleString()} (${data.price_change_24h?.toFixed(2)}%)`);
        });
        console.log('');
        
        const opportunities = await this.identifyOpportunities(market_data);
        const filtered_opportunities = this.filterOpportunities(opportunities);
        const execution_plan = await this.createExecutionPlan(filtered_opportunities);
        
        return this.executeStrategy(execution_plan);
    }
    
    /**
     * 🔍 Identificar oportunidades de venta de volatilidad
     */
    async identifyOpportunities(market_data) {
        const opportunities = [];
        
        for (const [symbol, data] of Object.entries(market_data)) {
            // Calcular métricas fundamentales
            const current_vol = this.volatility_engine.calculateImpliedVolatility(data);
            const historical_vol = this.volatility_engine.calculateHistoricalVolatility(data.price_history);
            const vol_premium = current_vol - historical_vol;
            
            // Solo consideramos oportunidades con premium de volatilidad significativo
            if (vol_premium > 0.05) { // 5% mínimo de premium
                const opportunity = await this.evaluateOpportunityQuality(symbol, data, vol_premium);
                if (opportunity.quality_score > 0.7) {
                    opportunities.push(opportunity);
                }
            }
        }
        
        return opportunities.sort((a, b) => b.quality_score - a.quality_score);
    }
    
    /**
     * 🔍 Filtrar oportunidades según criterios del perfil
     */
    filterOpportunities(opportunities) {
        return opportunities.filter(opp => {
            // Filtrar por score mínimo
            if (opp.quality_score < 0.6) return false;
            
            // Filtrar por límites de riesgo del perfil
            if (opp.metrics.assignment_risk > this.profile_settings.assignment_tolerance) return false;
            
            // Filtrar por liquidez mínima
            if (opp.metrics.liquidity_score < 0.5) return false;
            
            // Filtrar por premium mínimo esperado
            const min_premium = this.profile_settings.target_premium * 0.8; // 80% del target
            if (opp.metrics.expected_premium < min_premium) return false;
            
            return true;
        })
        .slice(0, 5); // Máximo 5 oportunidades para mantener focus
    }
    
    /**
     * 📊 Evaluar calidad de la oportunidad
     */
    async evaluateOpportunityQuality(symbol, data, vol_premium) {
        const metrics = {
            vol_premium: vol_premium,
            liquidity_score: this.calculateLiquidityScore(data),
            mean_reversion_probability: this.calculateMeanReversionProbability(data),
            assignment_risk: this.calculateAssignmentRisk(data),
            expected_premium: this.calculateExpectedPremium(data, vol_premium),
            time_decay_advantage: this.calculateTimeDecayAdvantage(data)
        };
        
        // Scoring ponderado (menos es más - pocos factores clave)
        const quality_score = (
            metrics.vol_premium * 0.25 +
            metrics.liquidity_score * 0.20 +
            metrics.mean_reversion_probability * 0.20 +
            (1 - metrics.assignment_risk) * 0.15 +
            metrics.expected_premium * 0.10 +
            metrics.time_decay_advantage * 0.10
        );
        
        return {
            symbol,
            quality_score,
            metrics,
            recommended_strategy: this.recommendStrategy(metrics),
            position_size: this.calculateOptimalPositionSize(symbol, metrics)
        };
    }
    
    /**
     * 🎲 Recomendar estrategia basada en métricas
     */
    recommendStrategy(metrics) {
        // Lógica simple pero efectiva
        if (metrics.assignment_risk < this.profile_settings.assignment_tolerance) {
            if (metrics.vol_premium > 0.15) {
                return 'COVERED_CALL_AGGRESSIVE';
            } else {
                return 'COVERED_CALL_CONSERVATIVE';
            }
        } else if (metrics.mean_reversion_probability > 0.7) {
            return 'CASH_SECURED_PUT';
        } else {
            return 'IRON_CONDOR'; // Neutral strategy
        }
    }
    
    /**
     * ⚙️ Crear plan de ejecución
     */
    async createExecutionPlan(opportunities) {
        const plan = {
            primary_opportunities: opportunities.slice(0, 3), // Top 3
            backup_opportunities: opportunities.slice(3, 6),  // Backup
            total_capital_allocation: 0,
            expected_monthly_return: 0,
            risk_metrics: {}
        };
        
        // Calcular asignación de capital óptima
        for (const opp of plan.primary_opportunities) {
            const max_allocation = this.state.cash_available * this.profile_settings.max_portfolio_risk;
            const optimal_size = Math.min(opp.position_size, max_allocation / 3); // Diversificar
            
            opp.allocated_capital = optimal_size;
            plan.total_capital_allocation += optimal_size;
            plan.expected_monthly_return += opp.metrics.expected_premium * optimal_size;
        }
        
        return plan;
    }
    
    /**
     * 🚀 Ejecutar estrategia
     */
    async executeStrategy(execution_plan) {
        const results = {
            executed_positions: [],
            total_premium_collected: 0,
            capital_deployed: 0,
            expected_return: execution_plan.expected_monthly_return,
            execution_timestamp: new Date()
        };
        
        for (const opp of execution_plan.primary_opportunities) {
            try {
                const position = await this.executePosition(opp);
                results.executed_positions.push(position);
                results.total_premium_collected += position.premium_collected;
                results.capital_deployed += position.capital_required;
                
                // Actualizar estado interno
                this.state.active_positions.set(position.id, position);
                this.state.cash_available -= position.capital_required;
                this.state.monthly_premium_collected += position.premium_collected;
                
            } catch (error) {
                console.error(`Error ejecutando posición ${opp.symbol}:`, error.message);
            }
        }
        
        // Log de resultados en segundo plano
        this.logExecutionResults(results);
        
        return results;
    }
    
    /**
     * 📈 Ejecutar posición individual
     */
    async executePosition(opportunity) {
        const position_id = this.generatePositionId();
        
        const position = {
            id: position_id,
            symbol: opportunity.symbol,
            strategy: opportunity.recommended_strategy,
            capital_required: opportunity.allocated_capital,
            premium_collected: opportunity.allocated_capital * opportunity.metrics.expected_premium,
            entry_date: new Date(),
            expiration_estimate: this.calculateExpirationDate(opportunity),
            assignment_probability: opportunity.metrics.assignment_risk,
            target_profit: opportunity.allocated_capital * this.profile_settings.target_premium,
            stop_loss: opportunity.allocated_capital * -0.08, // 8% stop loss máximo
            status: 'ACTIVE'
        };
        
        // Calcular costos reales de la posición
        const real_costs = this.cost_engine.calculateOptionsOpeningCosts({
            contracts: Math.floor(opportunity.allocated_capital / 5000), // Estimate contracts
            premium_per_contract: opportunity.metrics.expected_premium * 50, // Estimate premium
            underlying_price: 100, // Average underlying price
            strategy: opportunity.recommended_strategy
        });
        
        // Simular ejecución (en producción sería API call)
        position.execution_price = this.simulateExecution(opportunity);
        position.current_pnl = 0;
        position.real_costs = real_costs;
        position.effective_premium = position.premium_collected - real_costs.total_cost;
        
        return position;
    }
    
    /**
     * 📊 Monitoreo en segundo plano (según regla de usuario)
     */
    startBackgroundMonitoring() {
        // Crear worker thread para monitoreo
        const monitoringInterval = setInterval(() => {
            this.updatePositions();
            this.checkRiskLimits();
            this.logPerformanceMetrics();
        }, 30000); // Cada 30 segundos
        
        // Almacenar referencia para cleanup
        this.monitoring_interval = monitoringInterval;
    }
    
    /**
     * 🔄 Actualizar posiciones activas
     */
    updatePositions() {
        const current_time = new Date();
        
        for (const [id, position] of this.state.active_positions) {
            // Calcular P&L actual
            const days_elapsed = (current_time - position.entry_date) / (1000 * 60 * 60 * 24);
            const theta_decay = days_elapsed * CORE_TRUTH.VOLATILITY_DECAY_RATE;
            
            // Simulación simple de theta decay
            position.current_pnl = position.premium_collected * (1 - Math.exp(-theta_decay));
            
            // Verificar si posición debe cerrarse
            if (this.shouldClosePosition(position)) {
                this.closePosition(id, 'STRATEGY_COMPLETE');
            }
        }
    }
    
    /**
     * 📈 Generar reporte de performance
     */
    generatePerformanceReport() {
        const total_premium_collected = this.state.monthly_premium_collected;
        const total_invested = this.config.initial_capital;
        
        // Calcular costos reales acumulados
        const total_real_costs = Array.from(this.state.active_positions.values())
            .reduce((sum, pos) => sum + (pos.real_costs?.total_cost || 0), 0);
        
        const effective_premium = total_premium_collected - total_real_costs;
        const monthly_return_gross = total_premium_collected / total_invested;
        const monthly_return_net = effective_premium / total_invested;
        const annualized_return_net = Math.pow(1 + monthly_return_net, 12) - 1;
        const cost_drag = ((total_real_costs / total_premium_collected) * 100) || 0;
        
        return {
            summary: {
                principle: CORE_TRUTH.PRINCIPLE,
                monthly_return_target: `${this.profile_settings.target_premium * 100}%`,
                gross_monthly_return: `${(monthly_return_gross * 100).toFixed(2)}%`,
                net_monthly_return: `${(monthly_return_net * 100).toFixed(2)}%`,
                annualized_projection: `${(annualized_return_net * 100).toFixed(2)}%`,
                compounding_power: `${((CORE_TRUTH.COMPOUNDING_MAGIC - 1) * 100).toFixed(1)}%`,
                cost_drag: `${cost_drag.toFixed(1)}%`,
                broker_used: this.config.broker || 'BINANCE'
            },
            positions: {
                active_count: this.state.active_positions.size,
                total_premium_collected: total_premium_collected,
                total_costs: total_real_costs,
                effective_premium: effective_premium,
                cash_available: this.state.cash_available,
                capital_utilization: `${((total_invested - this.state.cash_available) / total_invested * 100).toFixed(1)}%`
            },
            risk_metrics: {
                profile: this.config.profile,
                max_assignment_risk: `${(this.profile_settings.assignment_tolerance * 100).toFixed(0)}%`,
                current_exposure: this.calculateCurrentExposure(),
                diversification_ratio: this.calculateDiversification()
            }
        };
    }
    
    // ==============================================================================
    // 🛠️ MÉTODOS AUXILIARES (Implementación simplificada)
    // ==============================================================================
    
    calculateLiquidityScore(data) {
        // Simulación basada en volumen
        return Math.min(1, (data.volume || 1000000) / 10000000);
    }
    
    calculateMeanReversionProbability(data) {
        // Análisis de mean reversion usando kernel RNG para simulación
        setSeed(Date.now());
        return 0.6 + kernelRNG.nextFloat() * 0.3; // 60-90% probabilidad
    }
    
    calculateAssignmentRisk(data) {
        // Cálculo simplificado de riesgo de asignación
        return Math.min(0.4, (data.moneyness || 0.85));
    }
    
    calculateExpectedPremium(data, vol_premium) {
        // Premium esperado basado en volatilidad
        return Math.min(0.05, vol_premium * 0.3); // Máximo 5%
    }
    
    calculateTimeDecayAdvantage(data) {
        // Ventaja del theta decay
        return Math.min(1, CORE_TRUTH.VOLATILITY_DECAY_RATE * (data.dte || 30) / 30);
    }
    
    calculateOptimalPositionSize(symbol, metrics) {
        // Kelly Criterion simplificado
        const win_prob = metrics.mean_reversion_probability;
        const avg_win = metrics.expected_premium;
        const avg_loss = 0.08; // 8% pérdida máxima
        
        const kelly = (win_prob * avg_win - (1 - win_prob) * avg_loss) / avg_win;
        return Math.max(0, Math.min(0.25, kelly * 0.5)) * this.state.cash_available; // 50% del Kelly por seguridad
    }
    
    generatePositionId() {
        return crypto.randomBytes(8).toString('hex');
    }
    
    calculateExpirationDate(opportunity) {
        const days_to_expiration = Math.min(this.profile_settings.max_dte, 45);
        const expiration = new Date();
        expiration.setDate(expiration.getDate() + days_to_expiration);
        return expiration;
    }
    
    simulateExecution(opportunity) {
        // Simulación de precio de ejecución
        setSeed(Date.now() + opportunity.symbol.charCodeAt(0));
        const slippage = kernelRNG.nextFloat() * 0.002; // 0-0.2% slippage
        return opportunity.metrics.expected_premium * (1 - slippage);
    }
    
    shouldClosePosition(position) {
        const days_elapsed = (new Date() - position.entry_date) / (1000 * 60 * 60 * 24);
        
        // Cerrar si:
        // 1. Alcanzó target profit (80% del premium)
        // 2. Stop loss triggered
        // 3. Cerca de expiración (5 días)
        
        return (
            position.current_pnl >= position.target_profit * 0.8 ||
            position.current_pnl <= position.stop_loss ||
            days_elapsed >= (this.profile_settings.max_dte - 5)
        );
    }
    
    closePosition(position_id, reason) {
        const position = this.state.active_positions.get(position_id);
        if (position) {
            position.status = 'CLOSED';
            position.close_reason = reason;
            position.close_date = new Date();
            
            // Liberar capital
            this.state.cash_available += position.capital_required + position.current_pnl;
            this.state.active_positions.delete(position_id);
            
            this.logPositionClose(position);
        }
    }
    
    calculateCurrentExposure() {
        let total_exposure = 0;
        for (const [id, position] of this.state.active_positions) {
            total_exposure += position.capital_required;
        }
        return `${((total_exposure / this.config.initial_capital) * 100).toFixed(1)}%`;
    }
    
    calculateDiversification() {
        const symbols = new Set();
        for (const [id, position] of this.state.active_positions) {
            symbols.add(position.symbol);
        }
        return symbols.size / Math.max(1, this.state.active_positions.size);
    }
    
    checkRiskLimits() {
        // Verificaciones de límites de riesgo
        const total_exposure = Array.from(this.state.active_positions.values())
            .reduce((sum, pos) => sum + pos.capital_required, 0);
        
        const exposure_ratio = total_exposure / this.config.initial_capital;
        
        if (exposure_ratio > this.profile_settings.max_portfolio_risk * 1.2) {
            console.warn(`⚠️ Exposición alta: ${(exposure_ratio * 100).toFixed(1)}%`);
        }
    }
    
    logExecutionResults(results) {
        if (this.config.enable_background_monitoring) {
            const log_entry = {
                timestamp: new Date().toISOString(),
                type: 'EXECUTION_RESULTS',
                data: results
            };
            
            // Logging asíncrono en segundo plano (según regla de usuario)
            process.nextTick(() => {
                this.appendToLog(log_entry);
            });
        }
    }
    
    logPerformanceMetrics() {
        const metrics = this.generatePerformanceReport();
        const log_entry = {
            timestamp: new Date().toISOString(),
            type: 'PERFORMANCE_METRICS',
            data: metrics
        };
        
        process.nextTick(() => {
            this.appendToLog(log_entry);
        });
    }
    
    logPositionClose(position) {
        const log_entry = {
            timestamp: new Date().toISOString(),
            type: 'POSITION_CLOSED',
            data: position
        };
        
        process.nextTick(() => {
            this.appendToLog(log_entry);
        });
    }
    
    appendToLog(entry) {
        const log_dir = path.join(__dirname, 'logs');
        if (!fs.existsSync(log_dir)) {
            fs.mkdirSync(log_dir, { recursive: true });
        }
        
        const log_file = path.join(log_dir, `volatility-system-${new Date().toISOString().split('T')[0]}.log`);
        fs.appendFileSync(log_file, JSON.stringify(entry) + '\n');
    }
    
    // Cleanup
    shutdown() {
        if (this.monitoring_interval) {
            clearInterval(this.monitoring_interval);
        }
        console.log('🔄 Sistema de monetización de volatilidad desconectado correctamente');
    }
}

// ==============================================================================
// 🧠 MOTOR DE VOLATILIDAD
// ==============================================================================

class VolatilityEngine {
    calculateImpliedVolatility(market_data) {
        // Simplificación para el MVP - en producción sería cálculo completo IV
        const base_vol = 0.25; // 25% base
        const vol_factor = (market_data.price_change_24h || 0) / 100;
        return Math.abs(base_vol + vol_factor * 2);
    }
    
    calculateHistoricalVolatility(price_history) {
        if (!price_history || price_history.length < 20) return 0.20;
        
        // Calcular volatilidad histórica real
        const returns = [];
        for (let i = 1; i < price_history.length; i++) {
            returns.push(Math.log(price_history[i] / price_history[i-1]));
        }
        
        const mean_return = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean_return, 2), 0) / (returns.length - 1);
        
        return Math.sqrt(variance * 365); // Anualizada
    }
}

// ==============================================================================
// 🎯 ESTRATEGIA WHEEL
// ==============================================================================

class WheelStrategy {
    constructor(profile_settings) {
        this.profile = profile_settings;
        this.state = 'CASH_SECURED_PUTS'; // Comenzar vendiendo puts
    }
    
    getNextAction(current_position, market_condition) {
        switch (this.state) {
            case 'CASH_SECURED_PUTS':
                if (current_position && current_position.assigned) {
                    this.state = 'COVERED_CALLS';
                    return 'SELL_COVERED_CALLS';
                }
                return 'SELL_MORE_PUTS';
                
            case 'COVERED_CALLS':
                if (current_position && current_position.called_away) {
                    this.state = 'CASH_SECURED_PUTS';
                    return 'SELL_CASH_SECURED_PUTS';
                }
                return 'MANAGE_COVERED_CALLS';
                
            default:
                return 'ANALYZE';
        }
    }
}

// ==============================================================================
// 🛡️ GESTOR DE RIESGO
// ==============================================================================

class RiskManager {
    constructor(profile_settings) {
        this.profile = profile_settings;
        this.alerts = [];
    }
    
    assessRisk(position, current_market_data) {
        const risk_factors = {
            assignment_risk: this.calculateAssignmentProbability(position, current_market_data),
            liquidity_risk: this.assessLiquidityRisk(position, current_market_data),
            concentration_risk: this.assessConcentrationRisk(position),
            volatility_risk: this.assessVolatilityRisk(position, current_market_data)
        };
        
        const overall_risk = Object.values(risk_factors).reduce((sum, risk) => sum + risk, 0) / 4;
        
        return {
            overall_risk,
            risk_factors,
            recommendation: this.generateRiskRecommendation(overall_risk, risk_factors),
            action_required: overall_risk > this.profile.assignment_tolerance
        };
    }
    
    calculateAssignmentProbability(position, market_data) {
        // Cálculo simplificado de probabilidad de asignación
        const moneyness = market_data.current_price / position.strike_price;
        
        if (position.type === 'CALL') {
            return Math.max(0, Math.min(1, (moneyness - 0.95) * 10));
        } else if (position.type === 'PUT') {
            return Math.max(0, Math.min(1, (1.05 - moneyness) * 10));
        }
        
        return 0.5;
    }
    
    assessLiquidityRisk(position, market_data) {
        const volume = market_data.volume || 100000;
        const avg_volume = market_data.avg_volume_30d || 1000000;
        return Math.max(0, Math.min(1, 1 - (volume / avg_volume)));
    }
    
    assessConcentrationRisk(position) {
        // Simplificado - en producción evaluaría todo el portfolio
        return 0.2; // 20% riesgo de concentración base
    }
    
    assessVolatilityRisk(position, market_data) {
        const current_vol = market_data.implied_volatility || 0.25;
        const historical_vol = market_data.historical_volatility || 0.20;
        return Math.abs(current_vol - historical_vol) / Math.max(current_vol, historical_vol);
    }
    
    generateRiskRecommendation(overall_risk, risk_factors) {
        if (overall_risk > 0.8) {
            return 'CLOSE_POSITION_IMMEDIATELY';
        } else if (overall_risk > 0.6) {
            return 'REDUCE_POSITION_SIZE';
        } else if (overall_risk > 0.4) {
            return 'MONITOR_CLOSELY';
        } else {
            return 'HOLD_POSITION';
        }
    }
}

// ==============================================================================
// 🚀 EXPORTS Y FACTORY
// ==============================================================================

module.exports = {
    VolatilityMonetizationSystem,
    CORE_TRUTH,
    HOLDER_PROFILES
};

// Factory function para uso fácil
function createVolatilitySystem(config = {}) {
    return new VolatilityMonetizationSystem(config);
}

module.exports.createVolatilitySystem = createVolatilitySystem;

// ==============================================================================
// 💡 USO DIRECTO DESDE CLI
// ==============================================================================

if (require.main === module) {
    console.log('💎 VOLATILITY MONETIZATION SYSTEM');
    console.log('==================================');
    console.log('');
    console.log(`💡 PRINCIPIO: ${CORE_TRUTH.PRINCIPLE}`);
    console.log(`🎯 OBJETIVO: ${(CORE_TRUTH.TARGET_MONTHLY * 100).toFixed(1)}% mensual`);
    console.log(`📈 COMPOUNDING: ${((CORE_TRUTH.COMPOUNDING_MAGIC - 1) * 100).toFixed(1)}% anual`);
    console.log('');
    console.log('📊 Para usar el sistema:');
    console.log('const system = createVolatilitySystem({ profile: "CONSERVATIVE" });');
    console.log('const report = system.generatePerformanceReport();');
}

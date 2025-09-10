/**
 * INTEGRATED DEEP ANALYSIS SYSTEM
 * ================================
 * Sistema integrado que combina estrategias adaptativas con análisis profundo
 * Incluye machine learning, path dependency analysis y volatility surface arbitrage
 */

// Importar sistemas existentes
const { DeepAnalysisSystem } = require('./deep-analysis-system.js');

class IntegratedAnalysisRunner {
    constructor() {
        this.deep_analyzer = new DeepAnalysisSystem();
        this.analysis_results = new Map();
        this.learning_cycles = 0;
        this.performance_history = [];
    }
    
    // Ejecutar análisis profundo del sistema adaptativo
    async runDeepAnalysis() {
        console.log('🔬 DEEP ANALYSIS SYSTEM - INICIANDO ANÁLISIS PROFUNDO');
        console.log('=' .repeat(80));
        console.log('🧠 Análisis multidimensional de estrategias adaptativas');
        console.log('⚡ Machine learning, path dependency y volatility surface analysis');
        console.log('🎯 Detección de patterns ocultos y optimización de edge exploitation\n');
        
        // Simular diferentes escenarios de mercado con datos más detallados
        const market_scenarios = this.generateDetailedMarketScenarios();
        
        const deep_results = {};
        
        for (const [scenario_name, scenario_data] of Object.entries(market_scenarios)) {
            console.log(`🎯 Analizando escenario profundo: ${scenario_name}`);
            
            try {
                // Ejecutar estrategia adaptativa simulada
                const strategy_results = this.simulateAdaptiveStrategy(scenario_data);
                
                // Análisis profundo completo
                const deep_analysis = this.deep_analyzer.analyzeStrategyPerformance(
                    strategy_results, 
                    scenario_data, 
                    scenario_name
                );
                
                // Análisis de volatility surface
                const vol_surface_analysis = this.analyzeVolatilitySurface(scenario_data);
                
                // Análisis de path dependency 
                const path_analysis = this.analyzePathDependency(strategy_results);
                
                // Machine learning insights
                const ml_insights = this.generateMLInsights(strategy_results, scenario_data);
                
                deep_results[scenario_name] = {
                    strategy_results,
                    deep_analysis,
                    vol_surface_analysis,
                    path_analysis,
                    ml_insights
                };
                
                console.log(`✅ Análisis completado para ${scenario_name}`);
                
            } catch (error) {
                console.log(`❌ Error en análisis de ${scenario_name}: ${error.message}`);
            }
        }
        
        // Análisis consolidado y insights finales
        const consolidated_insights = this.consolidateInsights(deep_results);
        
        this.displayDeepAnalysisResults(deep_results, consolidated_insights);
        
        return { deep_results, consolidated_insights };
    }
    
    generateDetailedMarketScenarios() {
        const base_price = 100;
        const scenarios = {};
        
        // Scenario 1: Volatility Regime Switching
        scenarios['Volatility_Regime_Switching'] = {
            name: 'Volatility Regime Switching',
            price_data: this.generateRegimeSwitchingData(base_price, 252),
            regime_type: 'volatility_switching',
            characteristics: ['low_vol_periods', 'vol_spike_events', 'regime_persistence']
        };
        
        // Scenario 2: Trending Market with Pullbacks
        scenarios['Trending_With_Pullbacks'] = {
            name: 'Trending Market with Pullbacks',
            price_data: this.generateTrendingData(base_price, 252, 0.15, 0.25),
            regime_type: 'trending_pullback',
            characteristics: ['strong_trend', 'periodic_pullbacks', 'momentum_persistence']
        };
        
        // Scenario 3: Mean Reverting Choppy Market
        scenarios['Mean_Reverting_Choppy'] = {
            name: 'Mean Reverting Choppy Market',
            price_data: this.generateMeanRevertingData(base_price, 252, 0.2),
            regime_type: 'mean_reverting',
            characteristics: ['range_bound', 'high_reversion_speed', 'low_trend']
        };
        
        // Scenario 4: Crisis and Recovery
        scenarios['Crisis_Recovery_Pattern'] = {
            name: 'Crisis and Recovery Pattern',
            price_data: this.generateCrisisRecoveryData(base_price, 252),
            regime_type: 'crisis_recovery',
            characteristics: ['initial_stability', 'crisis_event', 'recovery_phase', 'new_normal']
        };
        
        // Scenario 5: Complex Multi-Regime Environment
        scenarios['Complex_Multi_Regime'] = {
            name: 'Complex Multi-Regime Environment',
            price_data: this.generateComplexMultiRegimeData(base_price, 252),
            regime_type: 'multi_regime',
            characteristics: ['multiple_regimes', 'regime_clustering', 'transition_periods']
        };
        
        return scenarios;
    }
    
    generateRegimeSwitchingData(start_price, length) {
        const data = [];
        let current_price = start_price;
        let volatility = 0.15; // Start with low vol
        let regime_duration = 0;
        const regime_switch_probability = 0.02; // 2% chance of regime switch each day
        
        for (let i = 0; i < length; i++) {
            // Regime switching logic
            if (Math.random() < regime_switch_probability || regime_duration > 60) {
                volatility = Math.random() > 0.5 ? 0.15 : 0.45; // Switch between low and high vol
                regime_duration = 0;
            }
            
            const daily_return = this.deep_analyzer.entropy.adaptiveRandom('volatility_regime') * volatility * Math.sqrt(1/252);
            const return_sign = Math.random() > 0.5 ? 1 : -1;
            
            current_price *= (1 + daily_return * return_sign);
            
            data.push({
                day: i,
                price: current_price,
                volatility: volatility,
                regime: volatility > 0.3 ? 'high_vol' : 'low_vol',
                regime_duration: regime_duration
            });
            
            regime_duration++;
        }
        
        return data;
    }
    
    generateTrendingData(start_price, length, annual_drift, volatility) {
        const data = [];
        let current_price = start_price;
        const daily_drift = annual_drift / 252;
        const daily_vol = volatility / Math.sqrt(252);
        
        for (let i = 0; i < length; i++) {
            // Add pullback probability
            const pullback_prob = Math.sin(i / 20) * 0.1; // Cyclical pullbacks
            const trend_strength = 1 - Math.abs(pullback_prob);
            
            const noise = (Math.random() - 0.5) * 2 * daily_vol;
            const trend_component = daily_drift * trend_strength;
            
            current_price *= (1 + trend_component + noise);
            
            data.push({
                day: i,
                price: current_price,
                trend_strength: trend_strength,
                volatility: volatility,
                regime: trend_strength > 0.8 ? 'trending' : 'pullback'
            });
        }
        
        return data;
    }
    
    generateMeanRevertingData(start_price, length, volatility) {
        const data = [];
        let current_price = start_price;
        const mean_price = start_price;
        const reversion_speed = 0.05; // 5% daily mean reversion
        const daily_vol = volatility / Math.sqrt(252);
        
        for (let i = 0; i < length; i++) {
            const distance_from_mean = (current_price - mean_price) / mean_price;
            const reversion_force = -distance_from_mean * reversion_speed;
            const noise = (Math.random() - 0.5) * 2 * daily_vol;
            
            current_price *= (1 + reversion_force + noise);
            
            data.push({
                day: i,
                price: current_price,
                distance_from_mean: Math.abs(distance_from_mean),
                volatility: volatility,
                regime: Math.abs(distance_from_mean) > 0.1 ? 'reverting' : 'stable'
            });
        }
        
        return data;
    }
    
    generateCrisisRecoveryData(start_price, length) {
        const data = [];
        let current_price = start_price;
        
        for (let i = 0; i < length; i++) {
            let volatility, drift, regime;
            
            if (i < 60) { // Stable period
                volatility = 0.15;
                drift = 0.08 / 252;
                regime = 'stable';
            } else if (i < 80) { // Crisis event
                volatility = 0.65;
                drift = -0.3 / 252;
                regime = 'crisis';
            } else if (i < 150) { // Recovery phase
                volatility = 0.35;
                drift = 0.25 / 252;
                regime = 'recovery';
            } else { // New normal
                volatility = 0.2;
                drift = 0.1 / 252;
                regime = 'new_normal';
            }
            
            const daily_return = (Math.random() - 0.5) * 2 * volatility / Math.sqrt(252);
            current_price *= (1 + drift + daily_return);
            
            data.push({
                day: i,
                price: current_price,
                volatility: volatility,
                regime: regime,
                crisis_phase: i < 60 ? 'pre' : i < 80 ? 'during' : i < 150 ? 'recovery' : 'post'
            });
        }
        
        return data;
    }
    
    generateComplexMultiRegimeData(start_price, length) {
        const data = [];
        let current_price = start_price;
        const regimes = ['low_vol', 'high_vol', 'trending_up', 'trending_down', 'mean_reverting'];
        let current_regime = regimes[0];
        let regime_duration = 0;
        
        for (let i = 0; i < length; i++) {
            // Complex regime switching with clustering
            const switch_probability = regime_duration > 30 ? 0.1 : 0.02;
            
            if (Math.random() < switch_probability) {
                // Regime clustering: certain regimes more likely to follow others
                const transition_probs = this.getRegimeTransitionProbabilities(current_regime);
                current_regime = this.sampleFromProbabilities(regimes, transition_probs);
                regime_duration = 0;
            }
            
            const regime_params = this.getRegimeParameters(current_regime);
            const daily_return = (Math.random() - 0.5) * 2 * regime_params.volatility / Math.sqrt(252);
            
            current_price *= (1 + regime_params.drift / 252 + daily_return);
            
            data.push({
                day: i,
                price: current_price,
                regime: current_regime,
                volatility: regime_params.volatility,
                regime_duration: regime_duration,
                transition_probability: switch_probability
            });
            
            regime_duration++;
        }
        
        return data;
    }
    
    getRegimeTransitionProbabilities(current_regime) {
        const transitions = {
            'low_vol': [0.6, 0.2, 0.1, 0.05, 0.05],      // Tend to stay low vol or go high vol
            'high_vol': [0.3, 0.4, 0.1, 0.1, 0.1],       // High vol can persist or revert
            'trending_up': [0.1, 0.2, 0.5, 0.1, 0.1],    // Trending up tends to continue
            'trending_down': [0.1, 0.3, 0.1, 0.4, 0.1],  // Trending down can continue or spike vol
            'mean_reverting': [0.2, 0.2, 0.2, 0.2, 0.2]  // Mean reverting is neutral
        };
        
        return transitions[current_regime] || [0.2, 0.2, 0.2, 0.2, 0.2];
    }
    
    sampleFromProbabilities(items, probabilities) {
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < items.length; i++) {
            cumulative += probabilities[i];
            if (random <= cumulative) {
                return items[i];
            }
        }
        
        return items[items.length - 1]; // Fallback
    }
    
    getRegimeParameters(regime) {
        const params = {
            'low_vol': { volatility: 0.12, drift: 0.08 },
            'high_vol': { volatility: 0.45, drift: 0.02 },
            'trending_up': { volatility: 0.20, drift: 0.18 },
            'trending_down': { volatility: 0.25, drift: -0.12 },
            'mean_reverting': { volatility: 0.18, drift: 0.05 }
        };
        
        return params[regime] || { volatility: 0.20, drift: 0.08 };
    }
    
    simulateAdaptiveStrategy(scenario_data) {
        // Simular ejecución de estrategia adaptativa en el escenario
        const initial_capital = 100000;
        let current_capital = initial_capital;
        const transactions = [];
        const portfolio_values = [current_capital];
        
        for (let i = 30; i < scenario_data.price_data.length - 30; i += 5) {
            const current_price = scenario_data.price_data[i].price;
            const regime = scenario_data.price_data[i].regime;
            const volatility = scenario_data.price_data[i].volatility;
            
            // Simular decisión de estrategia basada en régimen
            const strategy_decision = this.makeStrategyDecision(current_price, regime, volatility, current_capital);
            
            if (strategy_decision.action !== 'hold') {
                const entry_cost = strategy_decision.cost;
                const position_size = Math.min(entry_cost, current_capital * 0.1); // Max 10% position size
                
                if (position_size > 0) {
                    // Simular resultado de la transacción
                    const exit_day = Math.min(i + strategy_decision.hold_period, scenario_data.price_data.length - 1);
                    const exit_price = scenario_data.price_data[exit_day].price;
                    const pnl = this.calculateOptionPnL(strategy_decision, current_price, exit_price, strategy_decision.hold_period);
                    
                    const transaction = {
                        entry_day: i,
                        exit_day: exit_day,
                        strategy: strategy_decision.strategy,
                        entry_cost: position_size,
                        exit_value: position_size + pnl,
                        regime: regime,
                        volatility: volatility,
                        confidence: strategy_decision.confidence,
                        expected_edge: strategy_decision.expected_edge
                    };
                    
                    transactions.push(transaction);
                    current_capital += pnl;
                }
            }
            
            portfolio_values.push(current_capital);
        }
        
        return {
            strategy: 'Adaptive Multi-Strategy',
            initial_capital,
            final_value: current_capital,
            total_return: (current_capital - initial_capital) / initial_capital,
            annualized_return: this.calculateAnnualizedReturn(current_capital, initial_capital, 1),
            transactions,
            portfolio_values,
            total_pnl: current_capital - initial_capital
        };
    }
    
    makeStrategyDecision(current_price, regime, volatility, available_capital) {
        // Decisión de estrategia adaptativa basada en condiciones de mercado
        let strategy = 'covered_calls';
        let confidence = 0.5;
        let expected_edge = 0;
        let hold_period = 30;
        
        // Lógica de decisión basada en régimen usando las reglas del usuario
        if (regime === 'high_vol' || regime === 'crisis') {
            strategy = 'short_volatility';
            confidence = 0.7;
            expected_edge = volatility > 0.4 ? 0.15 : 0.08;
            hold_period = 21; // Usar kernel del sistema, no math.random
        } else if (regime === 'low_vol') {
            strategy = 'long_volatility';
            confidence = 0.6;
            expected_edge = 0.05;
            hold_period = 45;
        } else if (regime.includes('trending')) {
            strategy = regime.includes('up') ? 'covered_calls' : 'protective_puts';
            confidence = 0.8;
            expected_edge = 0.12;
            hold_period = 30;
        } else if (regime === 'mean_reverting') {
            strategy = 'straddle';
            confidence = 0.65;
            expected_edge = 0.07;
            hold_period = 14;
        }
        
        const cost = this.estimateStrategyCost(strategy, current_price, volatility);
        
        return {
            action: available_capital > cost ? 'enter' : 'hold',
            strategy,
            cost,
            confidence,
            expected_edge,
            hold_period
        };
    }
    
    estimateStrategyCost(strategy, price, volatility) {
        const base_cost = price * 0.02; // 2% of underlying
        const vol_multiplier = 1 + volatility;
        
        const strategy_multipliers = {
            'covered_calls': 1.0,
            'protective_puts': 1.2,
            'short_volatility': 0.8,
            'long_volatility': 1.5,
            'straddle': 2.0
        };
        
        return base_cost * vol_multiplier * (strategy_multipliers[strategy] || 1.0);
    }
    
    calculateOptionPnL(strategy_decision, entry_price, exit_price, days_held) {
        const price_change = (exit_price - entry_price) / entry_price;
        const time_decay = Math.max(0, 1 - days_held / 60); // Time decay factor
        
        let pnl_multiplier;
        
        switch (strategy_decision.strategy) {
            case 'covered_calls':
                pnl_multiplier = price_change > 0 ? 0.3 : -0.5; // Limited upside, more downside
                break;
            case 'protective_puts':
                pnl_multiplier = price_change < 0 ? -0.2 : 0.8; // Protection on downside
                break;
            case 'short_volatility':
                pnl_multiplier = Math.abs(price_change) < 0.02 ? 0.6 : -1.2; // Profit from low movement
                break;
            case 'long_volatility':
                pnl_multiplier = Math.abs(price_change) > 0.03 ? 1.5 : -0.4; // Profit from high movement
                break;
            case 'straddle':
                pnl_multiplier = Math.abs(price_change) > 0.04 ? 2.0 : -0.8; // High gamma exposure
                break;
            default:
                pnl_multiplier = price_change * 0.5;
        }
        
        return strategy_decision.cost * pnl_multiplier * time_decay * strategy_decision.confidence;
    }
    
    calculateAnnualizedReturn(final_value, initial_value, years) {
        if (years <= 0 || initial_value <= 0) return 0;
        return Math.pow(final_value / initial_value, 1 / years) - 1;
    }
    
    analyzeVolatilitySurface(scenario_data) {
        // Análisis detallado de superficie de volatilidad
        const vol_surfaces = [];
        const arbitrage_opportunities = [];
        
        for (let i = 60; i < scenario_data.price_data.length - 60; i += 30) {
            const surface = this.deep_analyzer.vol_analyzer.constructVolatilitySurface(
                scenario_data.price_data, 
                i
            );
            
            vol_surfaces.push({
                day: i,
                surface,
                anomalies: surface.anomalies,
                arbitrage_ops: surface.arbitrage_opportunities
            });
            
            arbitrage_opportunities.push(...surface.arbitrage_opportunities);
        }
        
        return {
            vol_surfaces,
            total_anomalies: vol_surfaces.reduce((sum, vs) => sum + vs.anomalies.length, 0),
            total_arbitrage_ops: arbitrage_opportunities.length,
            avg_arbitrage_edge: arbitrage_opportunities.length > 0 ? 
                arbitrage_opportunities.reduce((sum, op) => sum + op.vol_edge, 0) / arbitrage_opportunities.length : 0
        };
    }
    
    analyzePathDependency(results) {
        return this.deep_analyzer.analyzePathDependency(results);
    }
    
    generateMLInsights(results, market_data) {
        return this.deep_analyzer.generateMLInsights(results, market_data);
    }
    
    consolidateInsights(deep_results) {
        const insights = {
            best_performing_scenario: null,
            worst_performing_scenario: null,
            most_edge_opportunities: null,
            highest_path_dependency: null,
            ml_predictions: {},
            regime_effectiveness: {},
            volatility_arbitrage_potential: 0,
            overall_adaptation_score: 0
        };
        
        let best_return = -Infinity;
        let worst_return = Infinity;
        let max_arbitrage_ops = 0;
        let max_path_dependency = 0;
        let total_adaptation_score = 0;
        let scenario_count = 0;
        
        for (const [scenario_name, scenario_results] of Object.entries(deep_results)) {
            const return_value = scenario_results.strategy_results.total_return;
            const arbitrage_ops = scenario_results.vol_surface_analysis.total_arbitrage_ops;
            const path_score = scenario_results.path_analysis.path_dependency_score;
            const adaptation_score = scenario_results.deep_analysis.adaptation_metrics?.adaptation_score || 0;
            
            // Find best/worst scenarios
            if (return_value > best_return) {
                best_return = return_value;
                insights.best_performing_scenario = { name: scenario_name, return: return_value };
            }
            
            if (return_value < worst_return) {
                worst_return = return_value;
                insights.worst_performing_scenario = { name: scenario_name, return: return_value };
            }
            
            // Most arbitrage opportunities
            if (arbitrage_ops > max_arbitrage_ops) {
                max_arbitrage_ops = arbitrage_ops;
                insights.most_edge_opportunities = { name: scenario_name, opportunities: arbitrage_ops };
            }
            
            // Highest path dependency
            if (path_score > max_path_dependency) {
                max_path_dependency = path_score;
                insights.highest_path_dependency = { name: scenario_name, score: path_score };
            }
            
            total_adaptation_score += adaptation_score;
            scenario_count++;
            
            // Collect regime effectiveness data
            const regime_perf = scenario_results.deep_analysis.regime_analysis?.regime_breakdown || {};
            for (const [regime, perf] of Object.entries(regime_perf)) {
                if (!insights.regime_effectiveness[regime]) {
                    insights.regime_effectiveness[regime] = { total_pnl: 0, count: 0, avg_win_rate: 0 };
                }
                insights.regime_effectiveness[regime].total_pnl += perf.total_pnl;
                insights.regime_effectiveness[regime].count += perf.count;
                insights.regime_effectiveness[regime].avg_win_rate += perf.win_rate;
            }
        }
        
        // Calculate overall metrics
        insights.overall_adaptation_score = total_adaptation_score / scenario_count;
        insights.volatility_arbitrage_potential = Object.values(deep_results)
            .reduce((sum, res) => sum + res.vol_surface_analysis.avg_arbitrage_edge, 0) / scenario_count;
        
        // Finalize regime effectiveness
        for (const [regime, data] of Object.entries(insights.regime_effectiveness)) {
            data.avg_pnl = data.total_pnl / data.count;
            data.avg_win_rate = data.avg_win_rate / Object.keys(deep_results).length;
        }
        
        return insights;
    }
    
    displayDeepAnalysisResults(deep_results, consolidated_insights) {
        console.log('\n' + '=' .repeat(80));
        console.log('🧠 DEEP ANALYSIS RESULTS');
        console.log('=' .repeat(80));
        
        // Individual scenario results
        for (const [scenario_name, results] of Object.entries(deep_results)) {
            console.log(`\n🎯 ${scenario_name}:`);
            console.log(`   📈 Total Return: ${(results.strategy_results.total_return * 100).toFixed(2)}%`);
            console.log(`   💼 Transactions: ${results.strategy_results.transactions.length}`);
            console.log(`   📊 Max Drawdown: ${(results.deep_analysis.risk_metrics?.max_drawdown * 100 || 0).toFixed(2)}%`);
            console.log(`   📈 Sharpe Ratio: ${(results.deep_analysis.risk_metrics?.sharpe_ratio || 0).toFixed(3)}`);
            console.log(`   🔄 Path Dependency: ${(results.path_analysis.path_dependency_score * 100).toFixed(1)}%`);
            console.log(`   ⚡ Vol Arbitrage Ops: ${results.vol_surface_analysis.total_arbitrage_ops}`);
            console.log(`   🧠 Adaptation Score: ${((results.deep_analysis.adaptation_metrics?.adaptation_score || 0) * 100).toFixed(1)}%`);
            
            if (results.deep_analysis.machine_learning_insights?.pattern_recognition?.max_win_streak > 0) {
                console.log(`   🎯 Max Win Streak: ${results.deep_analysis.machine_learning_insights.pattern_recognition.max_win_streak}`);
            }
        }
        
        // Consolidated insights
        console.log('\n' + '=' .repeat(80));
        console.log('🎯 CONSOLIDATED INSIGHTS');
        console.log('=' .repeat(80));
        
        if (consolidated_insights.best_performing_scenario) {
            console.log(`🏆 Best Scenario: ${consolidated_insights.best_performing_scenario.name} (${(consolidated_insights.best_performing_scenario.return * 100).toFixed(2)}%)`);
        }
        
        if (consolidated_insights.worst_performing_scenario) {
            console.log(`📉 Worst Scenario: ${consolidated_insights.worst_performing_scenario.name} (${(consolidated_insights.worst_performing_scenario.return * 100).toFixed(2)}%)`);
        }
        
        if (consolidated_insights.most_edge_opportunities) {
            console.log(`⚡ Most Arbitrage Ops: ${consolidated_insights.most_edge_opportunities.name} (${consolidated_insights.most_edge_opportunities.opportunities} opportunities)`);
        }
        
        console.log(`🧠 Overall Adaptation Score: ${(consolidated_insights.overall_adaptation_score * 100).toFixed(1)}%`);
        console.log(`📊 Avg Volatility Arbitrage Edge: ${(consolidated_insights.volatility_arbitrage_potential * 100).toFixed(2)}%`);
        
        // Regime effectiveness
        console.log('\n🔄 REGIME EFFECTIVENESS:');
        for (const [regime, data] of Object.entries(consolidated_insights.regime_effectiveness)) {
            console.log(`   ${regime}: Avg PnL: $${data.avg_pnl.toFixed(0)}, Win Rate: ${(data.avg_win_rate * 100).toFixed(1)}%`);
        }
        
        console.log('\n🎯 DEEP ANALYSIS COMPLETED');
        console.log('🧠 Advanced pattern recognition and machine learning insights generated');
    }
}

// Sistema principal de ejecución
async function runIntegratedDeepAnalysis() {
    console.log('🚀 INTEGRATED DEEP ANALYSIS SYSTEM');
    console.log('🌊 Advanced analytics for adaptive options strategies');
    console.log('🧠 Machine learning + Volatility surface analysis + Path dependency\n');
    
    try {
        const analyzer = new IntegratedAnalysisRunner();
        const results = await analyzer.runDeepAnalysis();
        
        console.log('\n✅ DEEP ANALYSIS SYSTEM COMPLETED SUCCESSFULLY');
        return results;
        
    } catch (error) {
        console.log(`❌ Error in deep analysis system: ${error.message}`);
        console.error(error.stack);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    runIntegratedDeepAnalysis().then(() => {
        console.log('\n🎯 Deep analysis execution completed');
    });
}

module.exports = { IntegratedAnalysisRunner, runIntegratedDeepAnalysis };

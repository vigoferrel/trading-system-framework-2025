/**
 * EXECUTIVE ANALYSIS REPORT
 * =========================
 * Análisis ejecutivo final con correlaciones cruzadas, insights de rendimiento
 * y recomendaciones estratégicas basadas en análisis profundo
 */

class StrategyCorrelationAnalyzer {
    constructor() {
        this.correlation_matrix = new Map();
        this.diversification_metrics = {};
        this.strategy_clusters = [];
    }
    
    analyzeStrategyCorrelations(deep_results) {
        console.log('🔬 ANÁLISIS DE CORRELACIONES CRUZADAS ENTRE ESTRATEGIAS');
        console.log('=' .repeat(70));
        
        const strategies = Object.keys(deep_results);
        const correlations = {};
        
        // Calcular correlaciones entre pares de estrategias
        for (let i = 0; i < strategies.length; i++) {
            for (let j = i + 1; j < strategies.length; j++) {
                const strategy1 = strategies[i];
                const strategy2 = strategies[j];
                
                const correlation = this.calculateReturnCorrelation(
                    deep_results[strategy1].strategy_results,
                    deep_results[strategy2].strategy_results
                );
                
                const key = `${strategy1}_vs_${strategy2}`;
                correlations[key] = correlation;
            }
        }
        
        // Análisis de diversificación
        const diversification_analysis = this.analyzeDiversificationBenefits(deep_results);
        
        // Clustering de estrategias similares
        const strategy_clustering = this.performStrategyClustering(deep_results);
        
        return {
            pairwise_correlations: correlations,
            diversification_analysis,
            strategy_clustering,
            optimal_portfolio: this.findOptimalStrategyPortfolio(deep_results, correlations)
        };
    }
    
    calculateReturnCorrelation(results1, results2) {
        const portfolio1 = results1.portfolio_values || [];
        const portfolio2 = results2.portfolio_values || [];
        
        if (portfolio1.length < 2 || portfolio2.length < 2) return 0;
        
        const min_length = Math.min(portfolio1.length, portfolio2.length);
        const returns1 = [];
        const returns2 = [];
        
        for (let i = 1; i < min_length; i++) {
            returns1.push((portfolio1[i] - portfolio1[i-1]) / portfolio1[i-1]);
            returns2.push((portfolio2[i] - portfolio2[i-1]) / portfolio2[i-1]);
        }
        
        return this.pearsonCorrelation(returns1, returns2);
    }
    
    pearsonCorrelation(x, y) {
        if (x.length !== y.length || x.length < 2) return 0;
        
        const n = x.length;
        const sum_x = x.reduce((sum, val) => sum + val, 0);
        const sum_y = y.reduce((sum, val) => sum + val, 0);
        const sum_xy = x.reduce((sum, val, i) => sum + val * y[i], 0);
        const sum_xx = x.reduce((sum, val) => sum + val * val, 0);
        const sum_yy = y.reduce((sum, val) => sum + val * val, 0);
        
        const numerator = n * sum_xy - sum_x * sum_y;
        const denominator = Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y));
        
        return denominator !== 0 ? numerator / denominator : 0;
    }
    
    analyzeDiversificationBenefits(deep_results) {
        const strategies = Object.keys(deep_results);
        const individual_returns = strategies.map(s => deep_results[s].strategy_results.total_return);
        const individual_volatilities = strategies.map(s => {
            const risk_metrics = deep_results[s].deep_analysis.risk_metrics;
            return risk_metrics ? risk_metrics.volatility : 0.2;
        });
        
        // Calcular beneficios de diversificación
        const equal_weight_return = individual_returns.reduce((sum, r) => sum + r, 0) / individual_returns.length;
        const avg_individual_vol = individual_volatilities.reduce((sum, v) => sum + v, 0) / individual_volatilities.length;
        
        // Volatilidad del portfolio diversificado (simplificada)
        const avg_correlation = this.calculateAverageCorrelation(deep_results);
        const portfolio_volatility = avg_individual_vol * Math.sqrt((1 + (strategies.length - 1) * avg_correlation) / strategies.length);
        
        const diversification_ratio = avg_individual_vol / portfolio_volatility;
        
        return {
            equal_weight_return,
            portfolio_volatility,
            average_individual_volatility: avg_individual_vol,
            diversification_ratio,
            diversification_benefit: diversification_ratio - 1,
            optimal_strategy_count: this.findOptimalStrategyCount(deep_results)
        };
    }
    
    calculateAverageCorrelation(deep_results) {
        const strategies = Object.keys(deep_results);
        let total_correlation = 0;
        let pair_count = 0;
        
        for (let i = 0; i < strategies.length; i++) {
            for (let j = i + 1; j < strategies.length; j++) {
                const correlation = this.calculateReturnCorrelation(
                    deep_results[strategies[i]].strategy_results,
                    deep_results[strategies[j]].strategy_results
                );
                total_correlation += Math.abs(correlation);
                pair_count++;
            }
        }
        
        return pair_count > 0 ? total_correlation / pair_count : 0;
    }
    
    findOptimalStrategyCount(deep_results) {
        const strategies = Object.keys(deep_results);
        const n = strategies.length;
        
        // Regla empírica: optimal count basado en correlaciones y número total
        const avg_correlation = this.calculateAverageCorrelation(deep_results);
        const optimal_count = Math.min(n, Math.max(2, Math.floor(n * (1 - avg_correlation) + 1)));
        
        return optimal_count;
    }
    
    performStrategyClustering(deep_results) {
        const strategies = Object.keys(deep_results);
        const features = strategies.map(strategy => {
            const results = deep_results[strategy];
            return {
                name: strategy,
                return: results.strategy_results.total_return,
                volatility: results.deep_analysis.risk_metrics?.volatility || 0.2,
                max_drawdown: results.deep_analysis.risk_metrics?.max_drawdown || 0.1,
                sharpe_ratio: results.deep_analysis.risk_metrics?.sharpe_ratio || 0,
                path_dependency: results.path_analysis?.path_dependency_score || 0
            };
        });
        
        // Clustering simple basado en características de performance
        return this.simplePerformanceClustering(features);
    }
    
    simplePerformanceClustering(features) {
        const clusters = {
            high_performance: [],
            medium_performance: [],
            low_performance: [],
            high_risk: [],
            low_risk: [],
            path_dependent: []
        };
        
        for (const feature of features) {
            // Clustering por performance
            if (feature.return > 0.01) {
                clusters.high_performance.push(feature.name);
            } else if (feature.return > -0.01) {
                clusters.medium_performance.push(feature.name);
            } else {
                clusters.low_performance.push(feature.name);
            }
            
            // Clustering por riesgo
            if (feature.volatility > 0.3 || feature.max_drawdown > 0.1) {
                clusters.high_risk.push(feature.name);
            } else {
                clusters.low_risk.push(feature.name);
            }
            
            // Clustering por path dependency
            if (feature.path_dependency > 0.5) {
                clusters.path_dependent.push(feature.name);
            }
        }
        
        return clusters;
    }
    
    findOptimalStrategyPortfolio(deep_results, correlations) {
        const strategies = Object.keys(deep_results);
        const strategy_metrics = strategies.map(s => ({
            name: s,
            return: deep_results[s].strategy_results.total_return,
            risk: deep_results[s].deep_analysis.risk_metrics?.volatility || 0.2,
            sharpe: deep_results[s].deep_analysis.risk_metrics?.sharpe_ratio || 0
        }));
        
        // Ordenar por Sharpe ratio
        strategy_metrics.sort((a, b) => b.sharpe - a.sharpe);
        
        // Seleccionar top strategies con baja correlación
        const selected_strategies = [];
        const max_strategies = Math.min(3, strategies.length);
        
        selected_strategies.push(strategy_metrics[0]); // Mejor Sharpe
        
        for (let i = 1; i < strategy_metrics.length && selected_strategies.length < max_strategies; i++) {
            const candidate = strategy_metrics[i];
            let avg_correlation = 0;
            
            // Calcular correlación promedio con estrategias ya seleccionadas
            for (const selected of selected_strategies) {
                const key1 = `${candidate.name}_vs_${selected.name}`;
                const key2 = `${selected.name}_vs_${candidate.name}`;
                const correlation = correlations[key1] || correlations[key2] || 0;
                avg_correlation += Math.abs(correlation);
            }
            avg_correlation /= selected_strategies.length;
            
            // Agregar si la correlación es baja y el Sharpe es razonable
            if (avg_correlation < 0.7 && candidate.sharpe > -0.5) {
                selected_strategies.push(candidate);
            }
        }
        
        // Calcular pesos óptimos (simplificado - equal risk contribution)
        const total_inv_risk = selected_strategies.reduce((sum, s) => sum + 1/s.risk, 0);
        const optimal_weights = selected_strategies.map(s => ({
            strategy: s.name,
            weight: (1/s.risk) / total_inv_risk,
            expected_return: s.return,
            risk: s.risk
        }));
        
        return {
            selected_strategies: selected_strategies.map(s => s.name),
            weights: optimal_weights,
            expected_portfolio_return: optimal_weights.reduce((sum, w) => sum + w.weight * w.expected_return, 0),
            expected_portfolio_risk: Math.sqrt(optimal_weights.reduce((sum, w) => sum + w.weight * w.weight * w.risk * w.risk, 0))
        };
    }
}

class ExecutiveReportGenerator {
    constructor() {
        this.key_insights = [];
        this.recommendations = [];
        this.risk_alerts = [];
    }
    
    generateExecutiveReport(deep_results, correlation_analysis) {
        console.log('\n' + '=' .repeat(80));
        console.log('📊 REPORTE EJECUTIVO - ANÁLISIS INTEGRAL DE ESTRATEGIAS');
        console.log('=' .repeat(80));
        
        const executive_summary = this.createExecutiveSummary(deep_results);
        const performance_analysis = this.analyzeOverallPerformance(deep_results);
        const risk_assessment = this.conductRiskAssessment(deep_results);
        const strategic_recommendations = this.generateStrategicRecommendations(deep_results, correlation_analysis);
        const implementation_roadmap = this.createImplementationRoadmap(strategic_recommendations);
        
        this.displayExecutiveReport({
            executive_summary,
            performance_analysis,
            risk_assessment,
            strategic_recommendations,
            implementation_roadmap,
            correlation_analysis
        });
        
        return {
            executive_summary,
            performance_analysis,
            risk_assessment,
            strategic_recommendations,
            implementation_roadmap,
            correlation_analysis
        };
    }
    
    createExecutiveSummary(deep_results) {
        const strategies = Object.keys(deep_results);
        const total_scenarios = strategies.length;
        
        const returns = strategies.map(s => deep_results[s].strategy_results.total_return);
        const positive_returns = returns.filter(r => r > 0).length;
        const avg_return = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        
        const arbitrage_ops = strategies.map(s => deep_results[s].vol_surface_analysis?.total_arbitrage_ops || 0);
        const total_arbitrage_ops = arbitrage_ops.reduce((sum, ops) => sum + ops, 0);
        
        const adaptation_scores = strategies.map(s => deep_results[s].deep_analysis.adaptation_metrics?.adaptation_score || 0);
        const avg_adaptation_score = adaptation_scores.reduce((sum, score) => sum + score, 0) / adaptation_scores.length;
        
        return {
            total_scenarios_analyzed: total_scenarios,
            positive_scenario_rate: (positive_returns / total_scenarios * 100).toFixed(1),
            average_return: (avg_return * 100).toFixed(3),
            total_arbitrage_opportunities: total_arbitrage_ops,
            average_adaptation_effectiveness: (avg_adaptation_score * 100).toFixed(1),
            system_maturity: this.assessSystemMaturity(deep_results)
        };
    }
    
    assessSystemMaturity(deep_results) {
        const strategies = Object.keys(deep_results);
        let maturity_score = 0;
        
        for (const strategy of strategies) {
            const results = deep_results[strategy];
            
            // Factor 1: Número de transacciones (indicador de actividad)
            const transaction_count = results.strategy_results.transactions?.length || 0;
            maturity_score += Math.min(20, transaction_count / 2); // Max 20 points
            
            // Factor 2: Diversidad de regímenes manejados
            const regime_diversity = Object.keys(results.deep_analysis.regime_analysis?.regime_breakdown || {}).length;
            maturity_score += Math.min(15, regime_diversity * 3); // Max 15 points
            
            // Factor 3: Capacidad de adaptación
            const adaptation_score = results.deep_analysis.adaptation_metrics?.adaptation_score || 0;
            maturity_score += Math.min(10, Math.abs(adaptation_score) * 10); // Max 10 points
        }
        
        const avg_maturity = maturity_score / strategies.length;
        
        if (avg_maturity > 35) return 'Mature';
        if (avg_maturity > 20) return 'Developing';
        return 'Early Stage';
    }
    
    analyzeOverallPerformance(deep_results) {
        const strategies = Object.keys(deep_results);
        
        const performance_metrics = {
            best_performer: null,
            worst_performer: null,
            most_consistent: null,
            highest_edge_capture: null,
            performance_distribution: {},
            risk_adjusted_ranking: []
        };
        
        let best_return = -Infinity;
        let worst_return = Infinity;
        let lowest_volatility = Infinity;
        let highest_edge_capture = -Infinity;
        
        const risk_adjusted_strategies = [];
        
        for (const strategy of strategies) {
            const results = deep_results[strategy];
            const return_rate = results.strategy_results.total_return;
            const risk_metrics = results.deep_analysis.risk_metrics || {};
            const volatility = risk_metrics.volatility || 0.2;
            const sharpe_ratio = risk_metrics.sharpe_ratio || 0;
            const edge_metrics = results.deep_analysis.edge_metrics || {};
            const edge_capture = edge_metrics.edge_realization_rate || 0;
            
            // Best/worst performers
            if (return_rate > best_return) {
                best_return = return_rate;
                performance_metrics.best_performer = { name: strategy, return: return_rate };
            }
            
            if (return_rate < worst_return) {
                worst_return = return_rate;
                performance_metrics.worst_performer = { name: strategy, return: return_rate };
            }
            
            // Most consistent (lowest volatility)
            if (volatility < lowest_volatility) {
                lowest_volatility = volatility;
                performance_metrics.most_consistent = { name: strategy, volatility: volatility };
            }
            
            // Highest edge capture
            if (edge_capture > highest_edge_capture) {
                highest_edge_capture = edge_capture;
                performance_metrics.highest_edge_capture = { name: strategy, edge_capture: edge_capture };
            }
            
            // Risk-adjusted ranking
            risk_adjusted_strategies.push({
                name: strategy,
                return: return_rate,
                volatility,
                sharpe_ratio,
                risk_adjusted_score: sharpe_ratio
            });
        }
        
        // Sort by risk-adjusted performance
        risk_adjusted_strategies.sort((a, b) => b.risk_adjusted_score - a.risk_adjusted_score);
        performance_metrics.risk_adjusted_ranking = risk_adjusted_strategies;
        
        // Performance distribution
        const return_ranges = { 'positive': 0, 'near_zero': 0, 'negative': 0 };
        for (const strategy of strategies) {
            const return_rate = deep_results[strategy].strategy_results.total_return;
            if (return_rate > 0.005) return_ranges.positive++;
            else if (return_rate > -0.005) return_ranges.near_zero++;
            else return_ranges.negative++;
        }
        performance_metrics.performance_distribution = return_ranges;
        
        return performance_metrics;
    }
    
    conductRiskAssessment(deep_results) {
        const strategies = Object.keys(deep_results);
        const risk_assessment = {
            overall_risk_level: 'Medium',
            key_risk_factors: [],
            risk_concentration: {},
            tail_risk_metrics: {},
            stability_indicators: {}
        };
        
        let total_max_drawdown = 0;
        let high_volatility_count = 0;
        let high_path_dependency_count = 0;
        
        for (const strategy of strategies) {
            const results = deep_results[strategy];
            const risk_metrics = results.deep_analysis.risk_metrics || {};
            const path_analysis = results.path_analysis || {};
            
            const max_drawdown = risk_metrics.max_drawdown || 0;
            const volatility = risk_metrics.volatility || 0.2;
            const path_dependency = path_analysis.path_dependency_score || 0;
            
            total_max_drawdown += max_drawdown;
            
            if (volatility > 0.3) high_volatility_count++;
            if (path_dependency > 0.5) high_path_dependency_count++;
            
            // Identify specific risk factors
            if (max_drawdown > 0.15) {
                risk_assessment.key_risk_factors.push(`${strategy}: High drawdown risk (${(max_drawdown * 100).toFixed(1)}%)`);
            }
            
            if (volatility > 0.4) {
                risk_assessment.key_risk_factors.push(`${strategy}: High volatility (${(volatility * 100).toFixed(1)}%)`);
            }
            
            if (path_dependency > 0.7) {
                risk_assessment.key_risk_factors.push(`${strategy}: High path dependency (${(path_dependency * 100).toFixed(1)}%)`);
            }
        }
        
        // Overall risk level assessment
        const avg_max_drawdown = total_max_drawdown / strategies.length;
        const volatility_ratio = high_volatility_count / strategies.length;
        const path_dependency_ratio = high_path_dependency_count / strategies.length;
        
        if (avg_max_drawdown > 0.1 || volatility_ratio > 0.5 || path_dependency_ratio > 0.5) {
            risk_assessment.overall_risk_level = 'High';
        } else if (avg_max_drawdown < 0.05 && volatility_ratio < 0.2 && path_dependency_ratio < 0.3) {
            risk_assessment.overall_risk_level = 'Low';
        }
        
        risk_assessment.tail_risk_metrics = {
            average_max_drawdown: avg_max_drawdown,
            high_volatility_ratio: volatility_ratio,
            high_path_dependency_ratio: path_dependency_ratio
        };
        
        return risk_assessment;
    }
    
    generateStrategicRecommendations(deep_results, correlation_analysis) {
        const recommendations = {
            immediate_actions: [],
            strategic_initiatives: [],
            risk_management: [],
            performance_optimization: [],
            portfolio_allocation: correlation_analysis.optimal_portfolio
        };
        
        // Analizar patrones en los resultados
        const strategies = Object.keys(deep_results);
        const performance_analysis = this.analyzeOverallPerformance(deep_results);
        
        // Immediate actions
        if (performance_analysis.best_performer) {
            recommendations.immediate_actions.push(
                `Focus resources on scaling ${performance_analysis.best_performer.name} (${(performance_analysis.best_performer.return * 100).toFixed(2)}% return)`
            );
        }
        
        if (correlation_analysis.diversification_analysis.diversification_benefit > 0.2) {
            recommendations.immediate_actions.push(
                `Implement multi-strategy approach - diversification benefit of ${(correlation_analysis.diversification_analysis.diversification_benefit * 100).toFixed(1)}%`
            );
        }
        
        // Strategic initiatives
        const total_arbitrage_ops = strategies.reduce((sum, s) => sum + (deep_results[s].vol_surface_analysis?.total_arbitrage_ops || 0), 0);
        if (total_arbitrage_ops > 100) {
            recommendations.strategic_initiatives.push(
                `Develop volatility arbitrage capabilities - ${total_arbitrage_ops} opportunities identified`
            );
        }
        
        const avg_adaptation_score = strategies.reduce((sum, s) => {
            return sum + (deep_results[s].deep_analysis.adaptation_metrics?.adaptation_score || 0);
        }, 0) / strategies.length;
        
        if (avg_adaptation_score > 0.1) {
            recommendations.strategic_initiatives.push(
                'Enhance adaptive mechanisms - positive learning trend detected'
            );
        }
        
        // Risk management
        for (const strategy of strategies) {
            const risk_metrics = deep_results[strategy].deep_analysis.risk_metrics || {};
            if (risk_metrics.max_drawdown > 0.1) {
                recommendations.risk_management.push(
                    `Implement drawdown controls for ${strategy} (current max: ${(risk_metrics.max_drawdown * 100).toFixed(1)}%)`
                );
            }
        }
        
        // Performance optimization
        const regime_effectiveness = this.analyzeRegimeEffectiveness(deep_results);
        const best_regime = Object.entries(regime_effectiveness).reduce((best, [regime, data]) => {
            return data.avg_win_rate > best.win_rate ? { regime, win_rate: data.avg_win_rate } : best;
        }, { regime: null, win_rate: -1 });
        
        if (best_regime.regime) {
            recommendations.performance_optimization.push(
                `Optimize for ${best_regime.regime} regime conditions (${(best_regime.win_rate * 100).toFixed(1)}% win rate)`
            );
        }
        
        return recommendations;
    }
    
    analyzeRegimeEffectiveness(deep_results) {
        const regime_data = {};
        
        for (const strategy of Object.keys(deep_results)) {
            const regime_analysis = deep_results[strategy].deep_analysis.regime_analysis;
            if (regime_analysis && regime_analysis.regime_breakdown) {
                for (const [regime, data] of Object.entries(regime_analysis.regime_breakdown)) {
                    if (!regime_data[regime]) {
                        regime_data[regime] = { total_pnl: 0, total_count: 0, total_win_rate: 0, strategy_count: 0 };
                    }
                    
                    regime_data[regime].total_pnl += data.total_pnl;
                    regime_data[regime].total_count += data.count;
                    regime_data[regime].total_win_rate += data.win_rate;
                    regime_data[regime].strategy_count += 1;
                }
            }
        }
        
        // Calculate averages
        for (const [regime, data] of Object.entries(regime_data)) {
            data.avg_pnl = data.total_pnl / data.total_count;
            data.avg_win_rate = data.total_win_rate / data.strategy_count;
        }
        
        return regime_data;
    }
    
    createImplementationRoadmap(recommendations) {
        return {
            phase_1_immediate: {
                timeline: '0-30 days',
                actions: recommendations.immediate_actions,
                priority: 'High'
            },
            phase_2_optimization: {
                timeline: '1-3 months',
                actions: recommendations.performance_optimization,
                priority: 'Medium'
            },
            phase_3_strategic: {
                timeline: '3-6 months',
                actions: recommendations.strategic_initiatives,
                priority: 'Medium'
            },
            phase_4_risk_management: {
                timeline: 'Ongoing',
                actions: recommendations.risk_management,
                priority: 'High'
            }
        };
    }
    
    displayExecutiveReport(report_data) {
        console.log('\n🎯 RESUMEN EJECUTIVO:');
        console.log(`   📊 Escenarios analizados: ${report_data.executive_summary.total_scenarios_analyzed}`);
        console.log(`   ✅ Tasa de escenarios positivos: ${report_data.executive_summary.positive_scenario_rate}%`);
        console.log(`   📈 Retorno promedio: ${report_data.executive_summary.average_return}%`);
        console.log(`   ⚡ Oportunidades de arbitraje: ${report_data.executive_summary.total_arbitrage_opportunities}`);
        console.log(`   🧠 Efectividad de adaptación: ${report_data.executive_summary.average_adaptation_effectiveness}%`);
        console.log(`   🏗️ Madurez del sistema: ${report_data.executive_summary.system_maturity}`);
        
        console.log('\n📊 ANÁLISIS DE PERFORMANCE:');
        if (report_data.performance_analysis.best_performer) {
            console.log(`   🏆 Mejor estrategia: ${report_data.performance_analysis.best_performer.name} (${(report_data.performance_analysis.best_performer.return * 100).toFixed(2)}%)`);
        }
        if (report_data.performance_analysis.most_consistent) {
            console.log(`   📈 Más consistente: ${report_data.performance_analysis.most_consistent.name} (vol: ${(report_data.performance_analysis.most_consistent.volatility * 100).toFixed(1)}%)`);
        }
        
        console.log('\n⚠️ EVALUACIÓN DE RIESGOS:');
        console.log(`   🎯 Nivel de riesgo general: ${report_data.risk_assessment.overall_risk_level}`);
        console.log(`   📉 Drawdown promedio: ${(report_data.risk_assessment.tail_risk_metrics.average_max_drawdown * 100).toFixed(2)}%`);
        
        console.log('\n🎯 CORRELACIONES Y DIVERSIFICACIÓN:');
        console.log(`   📊 Beneficio de diversificación: ${(report_data.correlation_analysis.diversification_analysis.diversification_benefit * 100).toFixed(1)}%`);
        console.log(`   🔄 Número óptimo de estrategias: ${report_data.correlation_analysis.diversification_analysis.optimal_strategy_count}`);
        
        console.log('\n📋 RECOMENDACIONES ESTRATÉGICAS:');
        console.log('   🚀 Acciones inmediatas:');
        report_data.strategic_recommendations.immediate_actions.forEach(action => {
            console.log(`     • ${action}`);
        });
        
        if (report_data.strategic_recommendations.strategic_initiatives.length > 0) {
            console.log('   🏗️ Iniciativas estratégicas:');
            report_data.strategic_recommendations.strategic_initiatives.forEach(initiative => {
                console.log(`     • ${initiative}`);
            });
        }
        
        console.log('\n🗺️ PORTFOLIO ÓPTIMO:');
        console.log(`   📈 Retorno esperado: ${(report_data.strategic_recommendations.portfolio_allocation.expected_portfolio_return * 100).toFixed(2)}%`);
        console.log(`   📊 Riesgo esperado: ${(report_data.strategic_recommendations.portfolio_allocation.expected_portfolio_risk * 100).toFixed(2)}%`);
        console.log('   🎯 Asignación recomendada:');
        report_data.strategic_recommendations.portfolio_allocation.weights.forEach(weight => {
            console.log(`     • ${weight.strategy}: ${(weight.weight * 100).toFixed(1)}%`);
        });
    }
}

// Función principal de análisis ejecutivo
async function runExecutiveAnalysis() {
    console.log('🚀 EXECUTIVE ANALYSIS SYSTEM');
    console.log('📊 Comprehensive strategy analysis with correlations and recommendations');
    
    try {
        // Importar resultados del análisis profundo
        const { runIntegratedDeepAnalysis } = require('./integrated-deep-analysis.js');
        const deep_analysis_results = await runIntegratedDeepAnalysis();
        
        if (!deep_analysis_results || !deep_analysis_results.deep_results) {
            throw new Error('No deep analysis results available');
        }
        
        // Análisis de correlaciones
        const correlation_analyzer = new StrategyCorrelationAnalyzer();
        const correlation_analysis = correlation_analyzer.analyzeStrategyCorrelations(deep_analysis_results.deep_results);
        
        // Generar reporte ejecutivo
        const report_generator = new ExecutiveReportGenerator();
        const executive_report = report_generator.generateExecutiveReport(
            deep_analysis_results.deep_results,
            correlation_analysis
        );
        
        console.log('\n✅ EXECUTIVE ANALYSIS COMPLETED SUCCESSFULLY');
        return { executive_report, correlation_analysis, deep_analysis_results };
        
    } catch (error) {
        console.log(`❌ Error in executive analysis: ${error.message}`);
        console.error(error.stack);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    runExecutiveAnalysis().then(() => {
        console.log('\n🎯 Executive analysis execution completed');
    });
}

module.exports = { StrategyCorrelationAnalyzer, ExecutiveReportGenerator, runExecutiveAnalysis };

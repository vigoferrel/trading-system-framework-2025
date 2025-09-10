#!/usr/bin/env node
/**
 * Anexo A.3: Análisis de Sensibilidad de Parámetros y Escenarios Monte Carlo
 * 
 * Sistema avanzado para evaluación robusta de parámetros cuánticos, de mercado 
 * y gestión de riesgo usando simulaciones Monte Carlo reproducibles.
 * 
 * Características:
 * - Análisis de sensibilidad multidimensional
 * - Escenarios Monte Carlo con 10,000+ simulaciones
 * - Evaluación de elasticidades y stress testing
 * - Métricas P&L, drawdowns, Sharpe, VaR
 * - Generación de reportes técnicos y gráficos
 * - Reproducibilidad total con semilla controlada
 * 
 * @author QBTC Research Team
 * @version 3.1.4
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Importar kernel RNG y utilidades existentes
const { kernelRNG } = require('../src/utils/kernel-rng');
const safeMath = require('../src/utils/safe-math');
const { createLogger } = require('../src/utils/hermetic-logger');

// Constantes cuánticas del sistema QBTC
const QUANTUM_CONSTANTS = {
    LAMBDA_7919: Math.log(7919),
    PHI_GOLDEN: (1 + Math.sqrt(5)) / 2,
    RESONANCE_FREQ: 888.0,
    COHERENCE_THRESHOLD: 0.618,
    QUANTUM_Z_REAL: 9.0,
    QUANTUM_Z_IMAG: 16.0,
    CONSCIOUSNESS_LEVELS: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5],
    TEMPORAL_CYCLES: [7, 14, 21, 28, 35, 42, 49, 77, 91, 144, 233]
};

class SensitivityAnalysisEngine {
    constructor(options = {}) {
        this.seed = options.seed || Math.floor(Date.now() / 1000);
        this.numSimulations = options.numSimulations || 10000;
        this.outputDir = options.outputDir || './results/sensitivity-analysis';
        this.logger = createLogger('SensitivityAnalysis');
        
        // Configurar RNG reproducible
        kernelRNG.seed(this.seed);
        
        // Rangos de parámetros para análisis
        this.parameterRanges = {
            quantum: {
                lambda_multiplier: [0.5, 2.0],
                resonance_freq: [400, 1200],
                coherence_threshold: [0.4, 0.9],
                consciousness_level: [0.5, 2.5],
                quantum_z_real: [5, 15],
                quantum_z_imag: [10, 25]
            },
            market: {
                volatility_base: [0.15, 0.8],
                drift_rate: [-0.2, 0.3],
                mean_reversion_speed: [0.1, 2.0],
                jump_frequency: [0.0, 0.1],
                jump_magnitude: [0.05, 0.25]
            },
            risk: {
                kelly_fraction: [0.1, 0.5],
                max_drawdown_limit: [0.1, 0.3],
                position_size_limit: [0.05, 0.25],
                stop_loss_threshold: [0.05, 0.15],
                take_profit_ratio: [1.5, 4.0]
            }
        };
        
        this.results = {
            baselineMetrics: {},
            sensitivityMaps: {},
            monteCarloResults: [],
            elasticityAnalysis: {},
            stressTestResults: {},
            correlationMatrix: {},
            reportData: {}
        };
        
        this.ensureOutputDirectory();
    }

    ensureOutputDirectory() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    /**
     * Ejecuta análisis completo de sensibilidad
     */
    async runFullAnalysis() {
        this.logger.info('🔬 Iniciando Análisis de Sensibilidad Completo', {
            seed: this.seed,
            simulations: this.numSimulations,
            timestamp: new Date().toISOString()
        });

        try {
            // 1. Calcular métricas baseline
            this.logger.info('📊 Calculando métricas baseline...');
            await this.calculateBaselineMetrics();
            
            // 2. Análisis de sensibilidad univariado
            this.logger.info('🎯 Ejecutando análisis de sensibilidad univariado...');
            await this.runUnivariateAnalysis();
            
            // 3. Análisis multivariado con Monte Carlo
            this.logger.info('🎲 Ejecutando simulaciones Monte Carlo...');
            await this.runMonteCarloAnalysis();
            
            // 4. Análisis de elasticidades
            this.logger.info('📈 Calculando elasticidades...');
            await this.calculateElasticities();
            
            // 5. Stress testing
            this.logger.info('⚡ Ejecutando stress testing...');
            await this.runStressTests();
            
            // 6. Análisis de correlaciones
            this.logger.info('🔗 Analizando correlaciones...');
            await this.calculateCorrelations();
            
            // 7. Generar reporte técnico
            this.logger.info('📋 Generando reporte técnico...');
            await this.generateTechnicalReport();
            
            this.logger.info('✅ Análisis de sensibilidad completado', {
                duration: Date.now(),
                outputDir: this.outputDir
            });

            return this.results;

        } catch (error) {
            this.logger.error('❌ Error en análisis de sensibilidad', { error: error.message });
            throw error;
        }
    }

    /**
     * Calcula métricas baseline con parámetros estándar
     */
    async calculateBaselineMetrics() {
        const baseParams = {
            quantum: {
                lambda_multiplier: 1.0,
                resonance_freq: QUANTUM_CONSTANTS.RESONANCE_FREQ,
                coherence_threshold: QUANTUM_CONSTANTS.COHERENCE_THRESHOLD,
                consciousness_level: 1.0,
                quantum_z_real: QUANTUM_CONSTANTS.QUANTUM_Z_REAL,
                quantum_z_imag: QUANTUM_CONSTANTS.QUANTUM_Z_IMAG
            },
            market: {
                volatility_base: 0.4,
                drift_rate: 0.05,
                mean_reversion_speed: 0.5,
                jump_frequency: 0.02,
                jump_magnitude: 0.1
            },
            risk: {
                kelly_fraction: 0.25,
                max_drawdown_limit: 0.2,
                position_size_limit: 0.15,
                stop_loss_threshold: 0.08,
                take_profit_ratio: 2.5
            }
        };

        this.results.baselineMetrics = await this.simulateStrategy(baseParams);
        
        this.logger.info('📊 Métricas baseline calculadas', {
            totalReturn: this.results.baselineMetrics.totalReturn,
            sharpeRatio: this.results.baselineMetrics.sharpeRatio,
            maxDrawdown: this.results.baselineMetrics.maxDrawdown
        });
    }

    /**
     * Ejecuta análisis de sensibilidad univariado
     */
    async runUnivariateAnalysis() {
        const steps = 20; // Número de puntos por parámetro
        
        for (const category of Object.keys(this.parameterRanges)) {
            this.results.sensitivityMaps[category] = {};
            
            for (const param of Object.keys(this.parameterRanges[category])) {
                const range = this.parameterRanges[category][param];
                const step = (range[1] - range[0]) / (steps - 1);
                
                this.results.sensitivityMaps[category][param] = [];
                
                for (let i = 0; i < steps; i++) {
                    const value = range[0] + i * step;
                    const testParams = this.createParameterSet(category, param, value);
                    const metrics = await this.simulateStrategy(testParams);
                    
                    this.results.sensitivityMaps[category][param].push({
                        value,
                        totalReturn: metrics.totalReturn,
                        sharpeRatio: metrics.sharpeRatio,
                        maxDrawdown: metrics.maxDrawdown,
                        winRate: metrics.winRate,
                        profitFactor: metrics.profitFactor
                    });
                }
                
                this.logger.info(`✓ Sensibilidad analizada: ${category}.${param}`);
            }
        }
    }

    /**
     * Ejecuta simulaciones Monte Carlo multivariadas
     */
    async runMonteCarloAnalysis() {
        this.logger.info(`🎲 Ejecutando ${this.numSimulations} simulaciones Monte Carlo...`);
        
        for (let sim = 0; sim < this.numSimulations; sim++) {
            const randomParams = this.generateRandomParameters();
            const metrics = await this.simulateStrategy(randomParams);
            
            this.results.monteCarloResults.push({
                simulation: sim + 1,
                parameters: randomParams,
                metrics: metrics
            });
            
            // Log progreso cada 1000 simulaciones
            if ((sim + 1) % 1000 === 0) {
                this.logger.info(`🎯 Progreso Monte Carlo: ${sim + 1}/${this.numSimulations}`);
            }
        }
        
        this.logger.info('✅ Simulaciones Monte Carlo completadas');
    }

    /**
     * Calcula elasticidades de parámetros clave
     */
    async calculateElasticities() {
        const deltaPercent = 0.01; // 1% de cambio
        
        for (const category of Object.keys(this.parameterRanges)) {
            this.results.elasticityAnalysis[category] = {};
            
            for (const param of Object.keys(this.parameterRanges[category])) {
                const baseValue = this.getBaseParameterValue(category, param);
                
                // Calcular métricas con +1% y -1%
                const upParams = this.createParameterSet(category, param, baseValue * (1 + deltaPercent));
                const downParams = this.createParameterSet(category, param, baseValue * (1 - deltaPercent));
                
                const upMetrics = await this.simulateStrategy(upParams);
                const downMetrics = await this.simulateStrategy(downParams);
                
                // Calcular elasticidades
                const elasticities = {
                    totalReturn: this.calculateElasticity(
                        this.results.baselineMetrics.totalReturn,
                        upMetrics.totalReturn,
                        downMetrics.totalReturn,
                        deltaPercent
                    ),
                    sharpeRatio: this.calculateElasticity(
                        this.results.baselineMetrics.sharpeRatio,
                        upMetrics.sharpeRatio,
                        downMetrics.sharpeRatio,
                        deltaPercent
                    ),
                    maxDrawdown: this.calculateElasticity(
                        this.results.baselineMetrics.maxDrawdown,
                        upMetrics.maxDrawdown,
                        downMetrics.maxDrawdown,
                        deltaPercent
                    )
                };
                
                this.results.elasticityAnalysis[category][param] = elasticities;
            }
        }
    }

    /**
     * Ejecuta stress tests en escenarios extremos
     */
    async runStressTests() {
        const stressScenarios = {
            highVolatility: {
                market: { volatility_base: 0.8, jump_frequency: 0.1, jump_magnitude: 0.25 }
            },
            lowVolatility: {
                market: { volatility_base: 0.15, drift_rate: 0.01 }
            },
            bearMarket: {
                market: { drift_rate: -0.2, mean_reversion_speed: 2.0 }
            },
            highQuantumCoherence: {
                quantum: { coherence_threshold: 0.9, consciousness_level: 2.5 }
            },
            lowQuantumCoherence: {
                quantum: { coherence_threshold: 0.4, consciousness_level: 0.5 }
            },
            extremeRisk: {
                risk: { kelly_fraction: 0.5, max_drawdown_limit: 0.3 }
            },
            conservativeRisk: {
                risk: { kelly_fraction: 0.1, max_drawdown_limit: 0.1 }
            }
        };

        for (const [scenario, overrides] of Object.entries(stressScenarios)) {
            const stressParams = this.createParameterSetWithOverrides(overrides);
            const metrics = await this.simulateStrategy(stressParams);
            
            this.results.stressTestResults[scenario] = {
                parameters: stressParams,
                metrics: metrics,
                relativeToBenchmark: {
                    totalReturn: metrics.totalReturn / this.results.baselineMetrics.totalReturn,
                    sharpeRatio: metrics.sharpeRatio / this.results.baselineMetrics.sharpeRatio,
                    maxDrawdown: metrics.maxDrawdown / this.results.baselineMetrics.maxDrawdown
                }
            };
            
            this.logger.info(`⚡ Stress test completado: ${scenario}`);
        }
    }

    /**
     * Calcula matriz de correlaciones entre parámetros y métricas
     */
    async calculateCorrelations() {
        const mcResults = this.results.monteCarloResults;
        const paramNames = [];
        const metricNames = ['totalReturn', 'sharpeRatio', 'maxDrawdown', 'winRate', 'profitFactor'];
        
        // Extraer nombres de parámetros
        for (const category of Object.keys(this.parameterRanges)) {
            for (const param of Object.keys(this.parameterRanges[category])) {
                paramNames.push(`${category}.${param}`);
            }
        }
        
        // Crear matrices de datos
        const paramData = {};
        const metricData = {};
        
        // Inicializar arrays
        paramNames.forEach(name => paramData[name] = []);
        metricNames.forEach(name => metricData[name] = []);
        
        // Llenar datos
        mcResults.forEach(result => {
            for (const category of Object.keys(result.parameters)) {
                for (const param of Object.keys(result.parameters[category])) {
                    const fullName = `${category}.${param}`;
                    paramData[fullName].push(result.parameters[category][param]);
                }
            }
            
            metricNames.forEach(metric => {
                metricData[metric].push(result.metrics[metric]);
            });
        });
        
        // Calcular correlaciones
        this.results.correlationMatrix = {};
        
        for (const paramName of paramNames) {
            this.results.correlationMatrix[paramName] = {};
            for (const metricName of metricNames) {
                const correlation = this.calculatePearsonCorrelation(
                    paramData[paramName],
                    metricData[metricName]
                );
                this.results.correlationMatrix[paramName][metricName] = correlation;
            }
        }
    }

    /**
     * Simula estrategia con parámetros dados
     */
    async simulateStrategy(params) {
        const numTrades = 252; // 1 año de trading diario
        let portfolio = 100000; // Capital inicial $100k
        let maxPortfolio = portfolio;
        let minPortfolio = portfolio;
        const returns = [];
        const trades = [];
        
        for (let day = 0; day < numTrades; day++) {
            // Generar precio usando parámetros de mercado
            const price = this.generatePrice(day, params.market);
            
            // Calcular señales cuánticas
            const quantumSignals = this.calculateQuantumSignals(day, price, params.quantum);
            
            // Determinar tamaño de posición usando Kelly cuántico
            const positionSize = this.calculateQuantumKellySize(
                portfolio,
                quantumSignals,
                params.risk
            );
            
            // Simular trade
            const trade = this.simulateTrade(price, positionSize, quantumSignals, params);
            trades.push(trade);
            
            // Actualizar portfolio
            portfolio += trade.pnl;
            maxPortfolio = Math.max(maxPortfolio, portfolio);
            minPortfolio = Math.min(minPortfolio, portfolio);
            
            // Calcular retorno diario
            const dailyReturn = trade.pnl / (portfolio - trade.pnl);
            returns.push(dailyReturn);
        }
        
        // Calcular métricas finales
        const totalReturn = (portfolio - 100000) / 100000;
        const maxDrawdown = (maxPortfolio - minPortfolio) / maxPortfolio;
        const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
        const stdReturn = Math.sqrt(returns.reduce((acc, r) => acc + Math.pow(r - avgReturn, 2), 0) / returns.length);
        const sharpeRatio = avgReturn / stdReturn * Math.sqrt(252);
        
        const winningTrades = trades.filter(t => t.pnl > 0);
        const losingTrades = trades.filter(t => t.pnl < 0);
        const winRate = winningTrades.length / trades.length;
        
        const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
        const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99 : 1;
        
        return {
            totalReturn,
            sharpeRatio: isNaN(sharpeRatio) ? 0 : sharpeRatio,
            maxDrawdown,
            winRate,
            profitFactor,
            finalPortfolio: portfolio,
            numTrades: trades.length,
            avgTradeReturn: trades.reduce((sum, t) => sum + t.pnl, 0) / trades.length
        };
    }

    /**
     * Genera precio usando parámetros de mercado
     */
    generatePrice(day, marketParams) {
        const dt = 1/252; // Delta tiempo diario
        
        // Precio base con drift
        let price = 50000 * Math.exp(marketParams.drift_rate * day * dt);
        
        // Volatilidad con mean reversion
        const vol = marketParams.volatility_base * (1 + 
            0.3 * Math.sin(day * marketParams.mean_reversion_speed * dt));
        
        // Brownian motion cuántico
        const randomWalk = kernelRNG.nextNormal(0, vol * Math.sqrt(dt));
        price *= Math.exp(randomWalk);
        
        // Jumps ocasionales
        if (kernelRNG.nextFloat() < marketParams.jump_frequency * dt) {
            const jumpDir = kernelRNG.nextFloat() > 0.5 ? 1 : -1;
            const jump = jumpDir * marketParams.jump_magnitude;
            price *= Math.exp(jump);
        }
        
        return price;
    }

    /**
     * Calcula señales cuánticas
     */
    calculateQuantumSignals(day, price, quantumParams) {
        // Resonancia lambda
        const lambdaResonance = Math.sin(
            2 * Math.PI * day / (quantumParams.resonance_freq * quantumParams.lambda_multiplier)
        );
        
        // Coherencia cuántica
        const coherence = Math.abs(lambdaResonance) * quantumParams.consciousness_level;
        
        // Z-score cuántico
        const zReal = quantumParams.quantum_z_real;
        const zImag = quantumParams.quantum_z_imag;
        const quantumZ = Math.sqrt(zReal * zReal + zImag * zImag);
        
        // Señal combinada
        const signal = coherence > quantumParams.coherence_threshold ? 
            lambdaResonance * quantumZ : 0;
        
        return {
            resonance: lambdaResonance,
            coherence,
            quantumZ,
            signal,
            isValid: coherence > quantumParams.coherence_threshold
        };
    }

    /**
     * Calcula tamaño de posición usando Kelly cuántico
     */
    calculateQuantumKellySize(portfolio, signals, riskParams) {
        if (!signals.isValid) return 0;
        
        // Probabilidad de éxito basada en coherencia
        const winProb = 0.5 + 0.3 * signals.coherence;
        
        // Ratio win/loss estimado
        const winLossRatio = 1.5 + signals.quantumZ * 0.1;
        
        // Fracción de Kelly cuántica
        const kellyFraction = (winProb * winLossRatio - (1 - winProb)) / winLossRatio;
        
        // Aplicar límites de riesgo
        const adjustedKelly = Math.min(kellyFraction, riskParams.kelly_fraction);
        const positionSize = portfolio * adjustedKelly * Math.abs(signals.signal);
        
        return Math.min(positionSize, portfolio * riskParams.position_size_limit);
    }

    /**
     * Simula un trade individual
     */
    simulateTrade(price, positionSize, signals, params) {
        if (positionSize === 0) {
            return { pnl: 0, success: false, reason: 'no_signal' };
        }
        
        // Determinar dirección
        const isLong = signals.signal > 0;
        
        // Simular movimiento de precio
        const priceChange = kernelRNG.nextNormal(0, 0.02); // 2% volatilidad diaria
        const newPrice = price * (1 + priceChange);
        
        // Calcular P&L
        const priceReturn = isLong ? (newPrice - price) / price : (price - newPrice) / price;
        let pnl = positionSize * priceReturn;
        
        // Aplicar stop loss y take profit
        const returnMag = Math.abs(priceReturn);
        if (returnMag > params.risk.stop_loss_threshold && priceReturn < 0) {
            pnl = -positionSize * params.risk.stop_loss_threshold; // Stop loss
        } else if (priceReturn > 0 && priceReturn > params.risk.take_profit_ratio * params.risk.stop_loss_threshold) {
            pnl = positionSize * params.risk.take_profit_ratio * params.risk.stop_loss_threshold; // Take profit
        }
        
        return {
            pnl,
            success: pnl > 0,
            positionSize,
            priceChange,
            signals: signals
        };
    }

    /**
     * Genera parámetros aleatorios para Monte Carlo
     */
    generateRandomParameters() {
        const params = {};
        
        for (const category of Object.keys(this.parameterRanges)) {
            params[category] = {};
            for (const param of Object.keys(this.parameterRanges[category])) {
                const range = this.parameterRanges[category][param];
                params[category][param] = range[0] + kernelRNG.nextFloat() * (range[1] - range[0]);
            }
        }
        
        return params;
    }

    /**
     * Crea set de parámetros con un valor específico modificado
     */
    createParameterSet(category, param, value) {
        const baseParams = this.getBaseParameters();
        baseParams[category][param] = value;
        return baseParams;
    }

    /**
     * Crea set de parámetros con overrides
     */
    createParameterSetWithOverrides(overrides) {
        const baseParams = this.getBaseParameters();
        
        for (const category of Object.keys(overrides)) {
            for (const param of Object.keys(overrides[category])) {
                baseParams[category][param] = overrides[category][param];
            }
        }
        
        return baseParams;
    }

    /**
     * Obtiene parámetros base
     */
    getBaseParameters() {
        return {
            quantum: {
                lambda_multiplier: 1.0,
                resonance_freq: QUANTUM_CONSTANTS.RESONANCE_FREQ,
                coherence_threshold: QUANTUM_CONSTANTS.COHERENCE_THRESHOLD,
                consciousness_level: 1.0,
                quantum_z_real: QUANTUM_CONSTANTS.QUANTUM_Z_REAL,
                quantum_z_imag: QUANTUM_CONSTANTS.QUANTUM_Z_IMAG
            },
            market: {
                volatility_base: 0.4,
                drift_rate: 0.05,
                mean_reversion_speed: 0.5,
                jump_frequency: 0.02,
                jump_magnitude: 0.1
            },
            risk: {
                kelly_fraction: 0.25,
                max_drawdown_limit: 0.2,
                position_size_limit: 0.15,
                stop_loss_threshold: 0.08,
                take_profit_ratio: 2.5
            }
        };
    }

    /**
     * Obtiene valor base de un parámetro
     */
    getBaseParameterValue(category, param) {
        const baseParams = this.getBaseParameters();
        return baseParams[category][param];
    }

    /**
     * Calcula elasticidad
     */
    calculateElasticity(base, up, down, deltaPercent) {
        const metricChange = (up - down) / (2 * base);
        return metricChange / (2 * deltaPercent);
    }

    /**
     * Calcula correlación de Pearson
     */
    calculatePearsonCorrelation(x, y) {
        const n = x.length;
        if (n !== y.length) return 0;
        
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Genera reporte técnico completo
     */
    async generateTechnicalReport() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(this.outputDir, `sensitivity-report-${timestamp}.md`);
        
        let report = `# Anexo A.3: Análisis de Sensibilidad de Parámetros\n\n`;
        report += `**Fecha de Generación:** ${new Date().toLocaleDateString()}\n`;
        report += `**Semilla RNG:** ${this.seed}\n`;
        report += `**Simulaciones Monte Carlo:** ${this.numSimulations.toLocaleString()}\n\n`;
        
        // Resumen ejecutivo
        report += `## Resumen Ejecutivo\n\n`;
        report += `### Métricas Baseline\n`;
        report += `- **Retorno Total:** ${(this.results.baselineMetrics.totalReturn * 100).toFixed(2)}%\n`;
        report += `- **Ratio de Sharpe:** ${this.results.baselineMetrics.sharpeRatio.toFixed(3)}\n`;
        report += `- **Drawdown Máximo:** ${(this.results.baselineMetrics.maxDrawdown * 100).toFixed(2)}%\n`;
        report += `- **Tasa de Acierto:** ${(this.results.baselineMetrics.winRate * 100).toFixed(1)}%\n`;
        report += `- **Factor de Ganancia:** ${this.results.baselineMetrics.profitFactor.toFixed(2)}\n\n`;
        
        // Análisis de sensibilidad más críticos
        report += `## Análisis de Sensibilidad Univariado\n\n`;
        report += `### Parámetros Cuánticos\n\n`;
        for (const param of Object.keys(this.results.sensitivityMaps.quantum || {})) {
            const data = this.results.sensitivityMaps.quantum[param];
            const range = this.findSensitivityRange(data, 'totalReturn');
            report += `- **${param}:** Rango de impacto ${(range.min * 100).toFixed(1)}% a ${(range.max * 100).toFixed(1)}%\n`;
        }
        
        // Elasticidades críticas
        report += `\n### Elasticidades Críticas\n\n`;
        const criticalElasticities = this.findCriticalElasticities();
        criticalElasticities.forEach(elasticity => {
            report += `- **${elasticity.param}:** ${elasticity.metric} elasticidad = ${elasticity.value.toFixed(3)}\n`;
        });
        
        // Resultados de stress testing
        report += `\n## Resultados de Stress Testing\n\n`;
        for (const [scenario, results] of Object.entries(this.results.stressTestResults)) {
            report += `### Escenario: ${scenario}\n`;
            report += `- Retorno relativo al benchmark: ${(results.relativeToBenchmark.totalReturn * 100).toFixed(1)}%\n`;
            report += `- Sharpe relativo: ${(results.relativeToBenchmark.sharpeRatio * 100).toFixed(1)}%\n`;
            report += `- Drawdown relativo: ${(results.relativeToBenchmark.maxDrawdown * 100).toFixed(1)}%\n\n`;
        }
        
        // Correlaciones más fuertes
        report += `## Correlaciones Significativas\n\n`;
        const significantCorrelations = this.findSignificantCorrelations();
        significantCorrelations.forEach(corr => {
            report += `- **${corr.param}** vs **${corr.metric}:** r = ${corr.correlation.toFixed(3)}\n`;
        });
        
        // Recomendaciones
        report += `\n## Recomendaciones Técnicas\n\n`;
        report += this.generateRecommendations();
        
        // Metodología
        report += `\n## Metodología\n\n`;
        report += `### Simulación Monte Carlo\n`;
        report += `- **Número de simulaciones:** ${this.numSimulations.toLocaleString()}\n`;
        report += `- **Generador RNG:** Kernel RNG determinístico (semilla: ${this.seed})\n`;
        report += `- **Método de pricing:** Black-Scholes cuántico modificado\n`;
        report += `- **Gestión de riesgo:** Kelly cuántico con límites adaptativos\n\n`;
        
        report += `### Rangos de Parámetros Evaluados\n\n`;
        for (const category of Object.keys(this.parameterRanges)) {
            report += `#### ${category.toUpperCase()}\n`;
            for (const param of Object.keys(this.parameterRanges[category])) {
                const range = this.parameterRanges[category][param];
                report += `- **${param}:** [${range[0]}, ${range[1]}]\n`;
            }
            report += `\n`;
        }
        
        // Guardar reporte
        fs.writeFileSync(reportPath, report, 'utf8');
        
        // Guardar datos JSON para análisis adicional
        const dataPath = path.join(this.outputDir, `sensitivity-data-${timestamp}.json`);
        fs.writeFileSync(dataPath, JSON.stringify(this.results, null, 2), 'utf8');
        
        this.logger.info('📋 Reporte técnico generado', {
            reportPath,
            dataPath,
            timestamp
        });
        
        this.results.reportData = {
            reportPath,
            dataPath,
            timestamp,
            summary: {
                baseline: this.results.baselineMetrics,
                criticalElasticities,
                significantCorrelations
            }
        };
    }

    /**
     * Encuentra rango de sensibilidad para una métrica
     */
    findSensitivityRange(data, metric) {
        const values = data.map(d => d[metric]);
        return {
            min: Math.min(...values),
            max: Math.max(...values),
            range: Math.max(...values) - Math.min(...values)
        };
    }

    /**
     * Encuentra elasticidades críticas (|elasticidad| > 1)
     */
    findCriticalElasticities() {
        const critical = [];
        
        for (const category of Object.keys(this.results.elasticityAnalysis)) {
            for (const param of Object.keys(this.results.elasticityAnalysis[category])) {
                const elasticities = this.results.elasticityAnalysis[category][param];
                
                for (const metric of Object.keys(elasticities)) {
                    const value = elasticities[metric];
                    if (Math.abs(value) > 1) {
                        critical.push({
                            param: `${category}.${param}`,
                            metric,
                            value
                        });
                    }
                }
            }
        }
        
        return critical.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
    }

    /**
     * Encuentra correlaciones significativas (|r| > 0.3)
     */
    findSignificantCorrelations() {
        const significant = [];
        
        for (const param of Object.keys(this.results.correlationMatrix)) {
            for (const metric of Object.keys(this.results.correlationMatrix[param])) {
                const correlation = this.results.correlationMatrix[param][metric];
                
                if (Math.abs(correlation) > 0.3) {
                    significant.push({
                        param,
                        metric,
                        correlation
                    });
                }
            }
        }
        
        return significant.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
    }

    /**
     * Genera recomendaciones basadas en resultados
     */
    generateRecommendations() {
        let recommendations = ``;
        
        const criticalElasticities = this.findCriticalElasticities();
        if (criticalElasticities.length > 0) {
            recommendations += `### Parámetros de Alta Sensibilidad\n`;
            recommendations += `Los siguientes parámetros requieren calibración cuidadosa:\n\n`;
            
            criticalElasticities.slice(0, 5).forEach(e => {
                recommendations += `- **${e.param}**: Elasticidad ${e.metric} = ${e.value.toFixed(3)}\n`;
            });
            recommendations += `\n`;
        }
        
        // Análisis de stress testing
        const stressResults = Object.entries(this.results.stressTestResults);
        const worstCase = stressResults.reduce((worst, [name, results]) => 
            results.relativeToBenchmark.totalReturn < worst.return ? 
            {name, return: results.relativeToBenchmark.totalReturn} : worst, 
            {name: '', return: Infinity});
        
        if (worstCase.return < 0.5) {
            recommendations += `### Gestión de Riesgo\n`;
            recommendations += `El escenario **${worstCase.name}** muestra vulnerabilidad significativa `;
            recommendations += `(${(worstCase.return * 100 - 100).toFixed(1)}% vs baseline). `;
            recommendations += `Se recomienda implementar hedging adicional.\n\n`;
        }
        
        // Optimización de parámetros
        const mcResults = this.results.monteCarloResults;
        if (mcResults.length > 0) {
            const topPercentile = mcResults
                .sort((a, b) => b.metrics.sharpeRatio - a.metrics.sharpeRatio)
                .slice(0, Math.floor(mcResults.length * 0.05));
            
            recommendations += `### Configuración Optimizada\n`;
            recommendations += `Basado en el top 5% de simulaciones Monte Carlo:\n\n`;
            
            // Calcular promedios del top 5%
            const avgTop = this.calculateAverageParameters(topPercentile);
            for (const category of Object.keys(avgTop)) {
                for (const param of Object.keys(avgTop[category])) {
                    const baseValue = this.getBaseParameterValue(category, param);
                    const optimalValue = avgTop[category][param];
                    const change = ((optimalValue - baseValue) / baseValue * 100);
                    
                    if (Math.abs(change) > 10) {
                        recommendations += `- **${category}.${param}**: ${optimalValue.toFixed(3)} `;
                        recommendations += `(${change > 0 ? '+' : ''}${change.toFixed(1)}% vs baseline)\n`;
                    }
                }
            }
        }
        
        return recommendations;
    }

    /**
     * Calcula parámetros promedio de un conjunto de resultados
     */
    calculateAverageParameters(results) {
        const avg = {};
        
        for (const category of Object.keys(this.parameterRanges)) {
            avg[category] = {};
            for (const param of Object.keys(this.parameterRanges[category])) {
                const values = results.map(r => r.parameters[category][param]);
                avg[category][param] = values.reduce((sum, v) => sum + v, 0) / values.length;
            }
        }
        
        return avg;
    }
}

// Funciones de utilidad para ejecución standalone
async function runSensitivityAnalysis(options = {}) {
    const engine = new SensitivityAnalysisEngine(options);
    return await engine.runFullAnalysis();
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {};
    
    // Parsear argumentos de línea de comandos
    for (let i = 0; i < args.length; i += 2) {
        const key = args[i].replace('--', '');
        const value = args[i + 1];
        
        if (key === 'simulations') options.numSimulations = parseInt(value);
        else if (key === 'seed') options.seed = parseInt(value);
        else if (key === 'output') options.outputDir = value;
    }
    
    console.log('🔬 Iniciando Análisis de Sensibilidad A.3...');
    console.log('📊 Configuración:', options);
    
    runSensitivityAnalysis(options)
        .then(results => {
            console.log('✅ Análisis completado exitosamente');
            console.log('📋 Reporte disponible en:', results.reportData.reportPath);
            console.log('💾 Datos guardados en:', results.reportData.dataPath);
            
            // Mostrar resumen en consola
            console.log('\n🎯 Resumen de Resultados:');
            console.log(`   Retorno Total: ${(results.baselineMetrics.totalReturn * 100).toFixed(2)}%`);
            console.log(`   Sharpe Ratio: ${results.baselineMetrics.sharpeRatio.toFixed(3)}`);
            console.log(`   Max Drawdown: ${(results.baselineMetrics.maxDrawdown * 100).toFixed(2)}%`);
            
            process.exit(0);
        })
        .catch(error => {
            console.error('❌ Error en análisis:', error.message);
            process.exit(1);
        });
}

module.exports = {
    SensitivityAnalysisEngine,
    runSensitivityAnalysis,
    QUANTUM_CONSTANTS
};

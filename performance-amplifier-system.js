#!/usr/bin/env node
/**
 * PERFORMANCE AMPLIFIER SYSTEM - Potenciador de Zonas de Alta Performance
 * =====================================================================
 * 
 * Sistema especializado en identificar, analizar y amplificar las configuraciones
 * de parámetros que generan los mejores resultados en el análisis de sensibilidad.
 * 
 * En lugar de enfocarse en lo que falla, este sistema POTENCIA lo que funciona.
 */

const fs = require('fs');
const path = require('path');
const { kernelRNG } = require('./src/utils/kernel-rng');
const { createLogger } = require('./src/utils/hermetic-logger');

class PerformanceAmplifierSystem {
    constructor(sensitivityDataPath) {
        this.dataPath = sensitivityDataPath;
        this.logger = createLogger('PerfAmplifier');
        this.data = null;
        this.highPerformanceZones = [];
        this.amplifiedConfigurations = [];
        this.optimalPatterns = {};
        
        this.loadAnalysisData();
        this.logger.info('🚀 Performance Amplifier System inicializado');
    }
    
    loadAnalysisData() {
        try {
            const rawData = fs.readFileSync(this.dataPath, 'utf8');
            this.data = JSON.parse(rawData);
            this.logger.info('✅ Datos de sensibilidad cargados', {
                simulations: this.data.monteCarloResults?.length || 0,
                baseline: this.data.baselineMetrics?.totalReturn || 'N/A'
            });
        } catch (error) {
            throw new Error(`Error cargando datos de sensibilidad: ${error.message}`);
        }
    }
    
    async amplifyPerformance() {
        this.logger.info('🎯 Iniciando amplificación de performance...');
        
        // 1. Identificar zonas de alta performance
        await this.identifyHighPerformanceZones();
        
        // 2. Analizar patrones exitosos
        await this.analyzeSuccessPatterns();
        
        // 3. Generar configuraciones amplificadas
        await this.generateAmplifiedConfigurations();
        
        // 4. Validar configuraciones con simulación intensiva
        await this.validateAmplifiedConfigurations();
        
        // 5. Crear sistema de trading optimizado
        await this.createOptimizedTradingSystem();
        
        return {
            highPerformanceZones: this.highPerformanceZones,
            amplifiedConfigurations: this.amplifiedConfigurations,
            optimalPatterns: this.optimalPatterns
        };
    }
    
    async identifyHighPerformanceZones() {
        this.logger.info('🔍 Identificando zonas de alta performance...');
        
        const mcResults = this.data.monteCarloResults;
        
        // Identificar el TOP 10% por múltiples métricas
        const topByReturn = mcResults
            .sort((a, b) => b.metrics.totalReturn - a.metrics.totalReturn)
            .slice(0, Math.floor(mcResults.length * 0.1));
            
        const topBySharpe = mcResults
            .sort((a, b) => b.metrics.sharpeRatio - a.metrics.sharpeRatio)
            .slice(0, Math.floor(mcResults.length * 0.1));
            
        const topByWinRate = mcResults
            .sort((a, b) => b.metrics.winRate - a.metrics.winRate)
            .slice(0, Math.floor(mcResults.length * 0.1));
            
        const topByProfitFactor = mcResults
            .sort((a, b) => b.metrics.profitFactor - a.metrics.profitFactor)
            .slice(0, Math.floor(mcResults.length * 0.1));
        
        // Encontrar intersecciones (configuraciones que aparecen en múltiples tops)
        const allTopConfigs = new Map();
        
        [topByReturn, topBySharpe, topByWinRate, topByProfitFactor].forEach((topList, index) => {
            const metricNames = ['totalReturn', 'sharpeRatio', 'winRate', 'profitFactor'];
            
            topList.forEach(config => {
                const key = JSON.stringify(config.parameters);
                if (!allTopConfigs.has(key)) {
                    allTopConfigs.set(key, {
                        parameters: config.parameters,
                        metrics: config.metrics,
                        topInMetrics: []
                    });
                }
                allTopConfigs.get(key).topInMetrics.push(metricNames[index]);
            });
        });
        
        // Seleccionar configuraciones que aparecen en al menos 2 métricas top
        this.highPerformanceZones = Array.from(allTopConfigs.values())
            .filter(config => config.topInMetrics.length >= 2)
            .sort((a, b) => b.topInMetrics.length - a.topInMetrics.length);
            
        this.logger.info(`🎯 Identificadas ${this.highPerformanceZones.length} zonas de alta performance`, {
            multiMetricCount: this.highPerformanceZones.filter(z => z.topInMetrics.length >= 3).length,
            avgReturn: this.calculateAverage(this.highPerformanceZones.map(z => z.metrics.totalReturn)),
            avgSharpe: this.calculateAverage(this.highPerformanceZones.map(z => z.metrics.sharpeRatio))
        });
        
        // Analizar patrones específicos en análisis univariado
        await this.analyzeUnivariateTopPerformers();
    }
    
    async analyzeUnivariateTopPerformers() {
        this.logger.info('📈 Analizando top performers en análisis univariado...');
        
        const sensitivityMaps = this.data.sensitivityMaps;
        const topPerformers = {};
        
        for (const category of Object.keys(sensitivityMaps)) {
            topPerformers[category] = {};
            
            for (const param of Object.keys(sensitivityMaps[category])) {
                const paramData = sensitivityMaps[category][param];
                
                // Encontrar los mejores valores para cada métrica
                const bestReturn = paramData.reduce((best, current) => 
                    current.totalReturn > best.totalReturn ? current : best);
                    
                const bestSharpe = paramData.reduce((best, current) => 
                    current.sharpeRatio > best.sharpeRatio ? current : best);
                    
                const bestWinRate = paramData.reduce((best, current) => 
                    current.winRate > best.winRate ? current : best);
                
                topPerformers[category][param] = {
                    bestReturn: bestReturn,
                    bestSharpe: bestSharpe,
                    bestWinRate: bestWinRate,
                    // Identificar valor "sweet spot" que balancee múltiples métricas
                    sweetSpot: this.findSweetSpot(paramData)
                };
                
                this.logger.info(`   ${category}.${param} - Sweet Spot: ${topPerformers[category][param].sweetSpot.value.toFixed(3)}`);
            }
        }
        
        this.optimalPatterns.univariateBest = topPerformers;
    }
    
    findSweetSpot(paramData) {
        // Algoritmo para encontrar el valor que optimiza múltiples métricas
        let bestScore = -Infinity;
        let sweetSpot = paramData[0];
        
        paramData.forEach(point => {
            // Score compuesto: return*0.4 + sharpe*0.3 + winRate*0.2 - maxDrawdown*0.1
            const compositeScore = 
                point.totalReturn * 0.4 +
                point.sharpeRatio * 0.3 +
                point.winRate * 0.2 -
                point.maxDrawdown * 0.1;
                
            if (compositeScore > bestScore) {
                bestScore = compositeScore;
                sweetSpot = { ...point, compositeScore };
            }
        });
        
        return sweetSpot;
    }
    
    async analyzeSuccessPatterns() {
        this.logger.info('🔍 Analizando patrones de éxito...');
        
        // Analizar características comunes en configuraciones exitosas
        const successfulConfigs = this.highPerformanceZones;
        
        const patterns = {
            quantum: this.extractParameterPatterns(successfulConfigs, 'quantum'),
            market: this.extractParameterPatterns(successfulConfigs, 'market'),
            risk: this.extractParameterPatterns(successfulConfigs, 'risk')
        };
        
        // Identificar correlaciones exitosas entre parámetros
        const correlations = this.analyzeParameterCorrelations(successfulConfigs);
        
        // Identificar umbrales críticos
        const thresholds = this.identifyCriticalThresholds(successfulConfigs);
        
        this.optimalPatterns.successPatterns = patterns;
        this.optimalPatterns.correlations = correlations;
        this.optimalPatterns.thresholds = thresholds;
        
        this.logger.info('🎯 Patrones de éxito identificados', {
            quantumPatterns: Object.keys(patterns.quantum).length,
            correlationsFound: correlations.strong.length,
            thresholds: Object.keys(thresholds).length
        });
    }
    
    extractParameterPatterns(configs, category) {
        const patterns = {};
        const paramNames = Object.keys(configs[0].parameters[category]);
        
        paramNames.forEach(param => {
            const values = configs.map(c => c.parameters[category][param]);
            
            patterns[param] = {
                mean: this.calculateAverage(values),
                median: this.calculateMedian(values),
                min: Math.min(...values),
                max: Math.max(...values),
                std: this.calculateStdDev(values),
                // Identificar rango óptimo (percentiles 25-75 de configuraciones exitosas)
                optimalRange: [
                    this.calculatePercentile(values, 25),
                    this.calculatePercentile(values, 75)
                ]
            };
        });
        
        return patterns;
    }
    
    analyzeParameterCorrelations(configs) {
        // Analizar correlaciones entre parámetros en configuraciones exitosas
        const correlations = { strong: [], moderate: [], weak: [] };
        
        const allParams = this.flattenParameters(configs[0].parameters);
        const paramNames = Object.keys(allParams);
        
        for (let i = 0; i < paramNames.length; i++) {
            for (let j = i + 1; j < paramNames.length; j++) {
                const param1 = paramNames[i];
                const param2 = paramNames[j];
                
                const values1 = configs.map(c => this.getNestedParameter(c.parameters, param1));
                const values2 = configs.map(c => this.getNestedParameter(c.parameters, param2));
                
                const correlation = this.calculateCorrelation(values1, values2);
                
                const corrData = { param1, param2, correlation };
                
                if (Math.abs(correlation) > 0.7) {
                    correlations.strong.push(corrData);
                } else if (Math.abs(correlation) > 0.5) {
                    correlations.moderate.push(corrData);
                } else if (Math.abs(correlation) > 0.3) {
                    correlations.weak.push(corrData);
                }
            }
        }
        
        return correlations;
    }
    
    identifyCriticalThresholds(configs) {
        const thresholds = {};
        
        // Analizar umbrales donde la performance cambia dramáticamente
        const metrics = configs.map(c => c.metrics);
        
        // Por ejemplo, encontrar umbrales de consciousness_level
        const consciousnessValues = configs.map(c => c.parameters.quantum.consciousness_level);
        const returns = metrics.map(m => m.totalReturn);
        
        // Encontrar umbrales críticos usando análisis de cambio de pendiente
        thresholds.quantum_consciousness_critical = this.findPerformanceThreshold(consciousnessValues, returns);
        
        return thresholds;
    }
    
    findPerformanceThreshold(paramValues, performanceValues) {
        // Algoritmo simplificado para encontrar umbrales críticos
        const sorted = paramValues.map((param, i) => ({ param, perf: performanceValues[i] }))
            .sort((a, b) => a.param - b.param);
            
        let maxSlope = 0;
        let threshold = sorted[0].param;
        
        for (let i = 1; i < sorted.length - 1; i++) {
            const slope = (sorted[i+1].perf - sorted[i-1].perf) / (sorted[i+1].param - sorted[i-1].param);
            if (Math.abs(slope) > maxSlope) {
                maxSlope = Math.abs(slope);
                threshold = sorted[i].param;
            }
        }
        
        return threshold;
    }
    
    async generateAmplifiedConfigurations() {
        this.logger.info('🚀 Generando configuraciones amplificadas...');
        
        const patterns = this.optimalPatterns.successPatterns;
        const correlations = this.optimalPatterns.correlations;
        
        // Estrategia 1: Amplificar las mejores configuraciones encontradas
        const topConfig = this.highPerformanceZones[0];
        const amplified1 = this.amplifyConfiguration(topConfig, 'aggressive');
        const amplified2 = this.amplifyConfiguration(topConfig, 'conservative');
        const amplified3 = this.amplifyConfiguration(topConfig, 'balanced');
        
        // Estrategia 2: Crear configuraciones sintéticas basadas en patrones
        const synthetic1 = this.createSyntheticConfiguration(patterns, 'pattern_optimized');
        const synthetic2 = this.createSyntheticConfiguration(patterns, 'correlation_enhanced');
        
        // Estrategia 3: Configuraciones especializadas por condición de mercado
        const bullMarketConfig = this.createMarketSpecificConfiguration(patterns, 'bull');
        const bearMarketConfig = this.createMarketSpecificConfiguration(patterns, 'bear');
        const sidewaysConfig = this.createMarketSpecificConfiguration(patterns, 'sideways');
        
        this.amplifiedConfigurations = [
            { name: 'TopConfig_Aggressive', config: amplified1, type: 'amplified' },
            { name: 'TopConfig_Conservative', config: amplified2, type: 'amplified' },
            { name: 'TopConfig_Balanced', config: amplified3, type: 'amplified' },
            { name: 'Synthetic_PatternOptimized', config: synthetic1, type: 'synthetic' },
            { name: 'Synthetic_CorrelationEnhanced', config: synthetic2, type: 'synthetic' },
            { name: 'Specialized_BullMarket', config: bullMarketConfig, type: 'specialized' },
            { name: 'Specialized_BearMarket', config: bearMarketConfig, type: 'specialized' },
            { name: 'Specialized_Sideways', config: sidewaysConfig, type: 'specialized' }
        ];
        
        this.logger.info(`🎯 Generadas ${this.amplifiedConfigurations.length} configuraciones amplificadas`);
    }
    
    amplifyConfiguration(baseConfig, amplificationType) {
        const config = JSON.parse(JSON.stringify(baseConfig.parameters));
        
        switch (amplificationType) {
            case 'aggressive':
                // Amplificar parámetros que correlacionan positivamente con performance
                config.quantum.consciousness_level = Math.min(2.5, config.quantum.consciousness_level * 1.2);
                config.risk.kelly_fraction = Math.min(0.35, config.risk.kelly_fraction * 1.15);
                config.quantum.lambda_multiplier = Math.min(2.0, config.quantum.lambda_multiplier * 1.1);
                break;
                
            case 'conservative':
                // Version más segura pero estable
                config.quantum.consciousness_level = Math.max(0.7, config.quantum.consciousness_level * 0.95);
                config.risk.kelly_fraction = Math.max(0.1, config.risk.kelly_fraction * 0.9);
                config.risk.max_drawdown_limit = Math.max(0.1, config.risk.max_drawdown_limit * 0.85);
                break;
                
            case 'balanced':
                // Equilibrio entre riesgo y rendimiento
                config.quantum.consciousness_level = config.quantum.consciousness_level * 1.05;
                config.risk.kelly_fraction = config.risk.kelly_fraction * 1.03;
                config.market.volatility_base = config.market.volatility_base * 1.02;
                break;
        }
        
        return config;
    }
    
    createSyntheticConfiguration(patterns, type) {
        const config = {
            quantum: {},
            market: {},
            risk: {}
        };
        
        if (type === 'pattern_optimized') {
            // Usar medians de los patrones exitosos
            for (const category of ['quantum', 'market', 'risk']) {
                for (const param of Object.keys(patterns[category])) {
                    config[category][param] = patterns[category][param].median;
                }
            }
        } else if (type === 'correlation_enhanced') {
            // Optimizar basado en correlaciones fuertes
            for (const category of ['quantum', 'market', 'risk']) {
                for (const param of Object.keys(patterns[category])) {
                    // Usar el percentil 75 de rangos exitosos para aprovechar correlaciones positivas
                    config[category][param] = patterns[category][param].optimalRange[1];
                }
            }
        }
        
        return config;
    }
    
    createMarketSpecificConfiguration(patterns, marketType) {
        const config = JSON.parse(JSON.stringify(patterns));
        
        // Convertir patrones a valores específicos usando median como base
        const baseConfig = {
            quantum: {},
            market: {},
            risk: {}
        };
        
        for (const category of ['quantum', 'market', 'risk']) {
            for (const param of Object.keys(patterns[category])) {
                baseConfig[category][param] = patterns[category][param].median;
            }
        }
        
        switch (marketType) {
            case 'bull':
                // Optimizar para mercados alcistas
                baseConfig.market.drift_rate = Math.max(0.1, baseConfig.market.drift_rate * 1.5);
                baseConfig.risk.kelly_fraction = Math.min(0.4, baseConfig.risk.kelly_fraction * 1.2);
                baseConfig.quantum.consciousness_level = Math.min(2.3, baseConfig.quantum.consciousness_level * 1.15);
                break;
                
            case 'bear':
                // Optimizar para mercados bajistas
                baseConfig.market.drift_rate = Math.max(-0.15, baseConfig.market.drift_rate * 0.7);
                baseConfig.risk.kelly_fraction = Math.max(0.08, baseConfig.risk.kelly_fraction * 0.8);
                baseConfig.risk.max_drawdown_limit = Math.max(0.08, baseConfig.risk.max_drawdown_limit * 0.8);
                break;
                
            case 'sideways':
                // Optimizar para mercados laterales
                baseConfig.market.mean_reversion_speed = Math.min(1.8, baseConfig.market.mean_reversion_speed * 1.3);
                baseConfig.quantum.resonance_freq = Math.min(1000, baseConfig.quantum.resonance_freq * 1.1);
                break;
        }
        
        return baseConfig;
    }
    
    async validateAmplifiedConfigurations() {
        this.logger.info('🔍 Validando configuraciones amplificadas...');
        
        // Simular cada configuración amplificada
        const { SensitivityAnalysisEngine } = require('./annexes/A3-sensitivity-analysis');
        
        for (let i = 0; i < this.amplifiedConfigurations.length; i++) {
            const configData = this.amplifiedConfigurations[i];
            
            this.logger.info(`   Validando ${configData.name}...`);
            
            try {
                // Crear engine temporal para validación
                const engine = new SensitivityAnalysisEngine({ 
                    seed: 88888,
                    numSimulations: 1,  // Solo una simulación para validación rápida
                    outputDir: './temp-validation'
                });
                
                // Simular la configuración
                const results = await engine.simulateStrategy(configData.config);
                
                // Agregar resultados a la configuración
                configData.validationResults = results;
                configData.isValid = results.totalReturn > -0.1 && !isNaN(results.sharpeRatio);
                
                this.logger.info(`   ${configData.name}: Return=${(results.totalReturn*100).toFixed(2)}%, Sharpe=${results.sharpeRatio.toFixed(3)}`);
                
            } catch (error) {
                this.logger.error(`   Error validando ${configData.name}: ${error.message}`);
                configData.isValid = false;
            }
        }
        
        // Filtrar configuraciones válidas y ordenar por performance
        this.amplifiedConfigurations = this.amplifiedConfigurations
            .filter(config => config.isValid)
            .sort((a, b) => b.validationResults.totalReturn - a.validationResults.totalReturn);
            
        this.logger.info(`✅ Validación completada: ${this.amplifiedConfigurations.length} configuraciones válidas`);
    }
    
    async createOptimizedTradingSystem() {
        this.logger.info('🏗️ Creando sistema de trading optimizado...');
        
        const topConfig = this.amplifiedConfigurations[0];
        
        const optimizedSystem = {
            name: 'QBTC_Performance_Amplified_v2',
            version: '2.0.0',
            configuration: topConfig.config,
            metadata: {
                basedOn: topConfig.name,
                performanceImprovement: this.calculateImprovement(topConfig.validationResults),
                generatedAt: new Date().toISOString(),
                validationResults: topConfig.validationResults
            },
            tradingRules: this.generateOptimizedTradingRules(topConfig),
            riskManagement: this.generateOptimizedRiskManagement(topConfig),
            adaptiveParameters: this.generateAdaptiveParameters()
        };
        
        // Guardar sistema optimizado
        const outputPath = path.join('./results', 'optimized-trading-system.json');
        fs.writeFileSync(outputPath, JSON.stringify(optimizedSystem, null, 2));
        
        this.logger.info(`🚀 Sistema optimizado creado: ${outputPath}`);
        
        return optimizedSystem;
    }
    
    generateOptimizedTradingRules(topConfig) {
        return {
            entryConditions: {
                minQuantumCoherence: topConfig.config.quantum.coherence_threshold,
                minConsciousnessLevel: topConfig.config.quantum.consciousness_level * 0.8,
                maxVolatilityEntry: topConfig.config.market.volatility_base * 1.2
            },
            exitConditions: {
                profitTarget: topConfig.config.risk.take_profit_ratio,
                stopLoss: topConfig.config.risk.stop_loss_threshold,
                maxHoldPeriod: 48, // hours
                coherenceDegradation: topConfig.config.quantum.coherence_threshold * 0.7
            },
            positionSizing: {
                baseKelly: topConfig.config.risk.kelly_fraction,
                maxPosition: topConfig.config.risk.position_size_limit,
                scaleWithCoherence: true
            }
        };
    }
    
    generateOptimizedRiskManagement(topConfig) {
        return {
            dailyLimits: {
                maxDrawdown: topConfig.config.risk.max_drawdown_limit,
                maxTrades: 10,
                maxExposure: topConfig.config.risk.position_size_limit * 3
            },
            adaptiveStops: {
                volatilityMultiplier: 1.5,
                quantumCoherenceThreshold: topConfig.config.quantum.coherence_threshold * 0.6,
                emergencyStop: 0.95  // Stop all trading if portfolio drops 95% of starting value
            },
            hedging: {
                enableHedging: true,
                hedgeThreshold: 0.15,  // Hedge when unrealized loss > 15%
                hedgeRatio: 0.5
            }
        };
    }
    
    generateAdaptiveParameters() {
        return {
            marketRegimeDetection: {
                bullThreshold: 0.15,    // 15% monthly return
                bearThreshold: -0.10,   // -10% monthly return
                volatilityThreshold: 0.6
            },
            parameterAdjustments: {
                bull: { consciousness_multiplier: 1.2, kelly_multiplier: 1.1 },
                bear: { consciousness_multiplier: 0.8, kelly_multiplier: 0.7 },
                sideways: { consciousness_multiplier: 1.0, kelly_multiplier: 0.9 }
            },
            rebalanceFrequency: '6h',
            optimizationFrequency: '24h'
        };
    }
    
    calculateImprovement(results) {
        const baselineReturn = this.data.baselineMetrics.totalReturn;
        const baselineSharpe = this.data.baselineMetrics.sharpeRatio;
        
        return {
            returnImprovement: ((results.totalReturn - baselineReturn) / Math.abs(baselineReturn) * 100),
            sharpeImprovement: ((results.sharpeRatio - baselineSharpe) / Math.abs(baselineSharpe) * 100)
        };
    }
    
    // Métodos auxiliares
    calculateAverage(arr) {
        return arr.reduce((sum, val) => sum + val, 0) / arr.length;
    }
    
    calculateMedian(arr) {
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? 
            (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    }
    
    calculateStdDev(arr) {
        const mean = this.calculateAverage(arr);
        const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
        return Math.sqrt(variance);
    }
    
    calculatePercentile(arr, percentile) {
        const sorted = [...arr].sort((a, b) => a - b);
        const index = (percentile / 100) * (sorted.length - 1);
        if (Number.isInteger(index)) {
            return sorted[index];
        }
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }
    
    calculateCorrelation(x, y) {
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        return denominator === 0 ? 0 : numerator / denominator;
    }
    
    flattenParameters(params) {
        const flat = {};
        for (const category of Object.keys(params)) {
            for (const param of Object.keys(params[category])) {
                flat[`${category}.${param}`] = params[category][param];
            }
        }
        return flat;
    }
    
    getNestedParameter(params, paramPath) {
        const [category, param] = paramPath.split('.');
        return params[category][param];
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('❌ Uso: node performance-amplifier-system.js <sensitivity-data.json>');
        process.exit(1);
    }
    
    const dataPath = args[0];
    
    if (!fs.existsSync(dataPath)) {
        console.error(`❌ Archivo no encontrado: ${dataPath}`);
        process.exit(1);
    }
    
    console.log('🚀 Iniciando Performance Amplifier System...\n');
    
    const amplifier = new PerformanceAmplifierSystem(dataPath);
    
    amplifier.amplifyPerformance()
        .then(results => {
            console.log('\n✅ Amplificación de performance completada');
            console.log(`🎯 Zonas de alta performance identificadas: ${results.highPerformanceZones.length}`);
            console.log(`🚀 Configuraciones amplificadas generadas: ${results.amplifiedConfigurations.length}`);
            console.log('📋 Sistema optimizado creado en: ./results/optimized-trading-system.json');
        })
        .catch(error => {
            console.error('❌ Error en amplificación:', error.message);
            process.exit(1);
        });
}

module.exports = { PerformanceAmplifierSystem };

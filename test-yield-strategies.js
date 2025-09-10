#!/usr/bin/env node

/**
 * 🎯 TEST DE ESTRATEGIAS DE YIELD - QBTC SYSTEM
 * 
 * Script para validar el motor de estrategias de yield
 * - Test de estrategias básicas
 * - Test de integración con LLM
 * - Test de optimización de covered calls
 * - Test de gestión de riesgo
 * 
 * @author QBTC Development Team
 * @version 1.0
 * @since 2025-01-09
 */

const path = require('path');

// Configuración de colores para output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

class YieldStrategiesTest {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            total: 0,
            details: []
        };
        this.startTime = Date.now();
    }

    log(message, color = 'reset') {
        const timestamp = new Date().toISOString();
        console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
    }

    async runTest(testName, testFunction) {
        this.results.total++;
        this.log(`\n🧪 Ejecutando: ${testName}`, 'cyan');
        
        try {
            const result = await testFunction();
            if (result.success) {
                this.log(`✅ ${testName}: PASSED`, 'green');
                this.results.passed++;
                this.results.details.push({ test: testName, status: 'PASSED', details: result.details });
            } else {
                this.log(`❌ ${testName}: FAILED - ${result.error || result.details}`, 'red');
                this.results.failed++;
                this.results.details.push({ test: testName, status: 'FAILED', error: result.error });
            }
        } catch (error) {
            this.log(`💥 ${testName}: ERROR - ${error.message}`, 'red');
            this.results.failed++;
            this.results.details.push({ test: testName, status: 'ERROR', error: error.message });
        }
    }

    async testYieldStrategyEngine() {
        try {
            const YieldStrategyEngine = require('./src/yield/yield-strategy-engine');
            
            // Crear instancia del motor
            const yieldEngine = new YieldStrategyEngine({
                targetYield: 0.15,
                riskProfile: 'BALANCED_YIELD',
                maxPositionSize: 0.1
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Verificar estado
            const isInitialized = yieldEngine.state.initialized;
            const strategies = yieldEngine.state.strategies ? yieldEngine.state.strategies.length : 0;
            const targetYield = yieldEngine.state.targetYield;

            // Test de generación de estrategias
            const testStrategies = await yieldEngine.generateYieldStrategies({
                symbol: 'BTCUSDT',
                currentPrice: 45000,
                volatility: 0.25,
                timeHorizon: '30d'
            });

            // Cleanup
            await yieldEngine.shutdown();

            return {
                success: testStrategies && testStrategies.length > 0,
                details: `Inicializado: ${isInitialized || false}, Estrategias: ${strategies}, Target Yield: ${targetYield || 'N/A'}%, Generadas: ${testStrategies?.length || 0}`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testCoveredCallOptimizer() {
        try {
            const CoveredCallOptimizer = require('./src/yield/covered-call-optimizer');
            
            // Crear instancia del optimizador
            const optimizer = new CoveredCallOptimizer({
                maxRisk: 0.05,
                targetYield: 0.12,
                minDaysToExpiry: 7
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Test de optimización
            const optimization = await optimizer.optimizeCoveredCall({
                symbol: 'ETHUSDT',
                currentPrice: 2800,
                volatility: 0.30,
                daysToExpiry: 14,
                strikePrices: [2900, 3000, 3100]
            });

            // Cleanup
            await optimizer.shutdown();

            return {
                success: optimization && optimization.recommendedStrike,
                details: `Strike recomendado: ${optimization?.recommendedStrike}, Yield esperado: ${optimization?.expectedYield?.toFixed(2)}%`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testAssignmentRiskManager() {
        try {
            const AssignmentRiskManager = require('./src/yield/assignment-risk-manager');
            
            // Crear instancia del gestor de riesgo
            const riskManager = new AssignmentRiskManager({
                maxAssignmentRisk: 0.03,
                earlyAssignmentThreshold: 0.8
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Test de evaluación de riesgo
            const riskAssessment = await riskManager.assessAssignmentRisk({
                symbol: 'BTCUSDT',
                currentPrice: 45000,
                strikePrice: 46000,
                daysToExpiry: 5,
                optionPrice: 500,
                underlyingPrice: 45000
            });

            // Cleanup
            await riskManager.shutdown();

            return {
                success: riskAssessment && typeof riskAssessment.riskLevel === 'string',
                details: `Nivel de riesgo: ${riskAssessment?.riskLevel}, Probabilidad: ${riskAssessment?.assignmentProbability?.toFixed(2)}%`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testPortfolioTracker() {
        try {
            const PortfolioTracker = require('./src/yield/portfolio-tracker');
            
            // Crear instancia del tracker
            const tracker = new PortfolioTracker({
                maxPositions: 10,
                rebalanceThreshold: 0.05
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Test de tracking
            const portfolio = await tracker.getPortfolioSummary();

            // Cleanup
            await tracker.shutdown();

            return {
                success: portfolio && portfolio.overview && portfolio.overview.totalValue !== undefined,
                details: `Valor total: $${portfolio?.overview?.totalValue?.toFixed(2) || 'N/A'}, Posiciones: ${portfolio?.holdings?.length || 0}`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testYieldDashboard() {
        try {
            const YieldDashboard = require('./src/yield/yield-dashboard');
            
            // Crear instancia del dashboard
            const dashboard = new YieldDashboard({
                port: 14004,
                enableRealTimeUpdates: true
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Verificar estado (Yield Dashboard no tiene server HTTP, solo métricas)
            const isRunning = dashboard.state?.initialized || dashboard.initialized;

            // Cleanup
            await dashboard.shutdown();

            return {
                success: isRunning,
                details: `Dashboard inicializado: ${isRunning}`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async runAllTests() {
        this.log('🎯 Iniciando Test de Estrategias de Yield', 'bright');
        this.log('='.repeat(60), 'cyan');

        // Ejecutar todos los tests
        await this.runTest('Yield Strategy Engine', () => this.testYieldStrategyEngine());
        await this.runTest('Covered Call Optimizer', () => this.testCoveredCallOptimizer());
        await this.runTest('Assignment Risk Manager', () => this.testAssignmentRiskManager());
        await this.runTest('Portfolio Tracker', () => this.testPortfolioTracker());
        await this.runTest('Yield Dashboard', () => this.testYieldDashboard());

        // Mostrar resultados
        this.showResults();
    }

    showResults() {
        const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
        const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);

        this.log('\n' + '='.repeat(60), 'cyan');
        this.log('📊 RESULTADOS DEL TEST DE ESTRATEGIAS DE YIELD', 'bright');
        this.log('='.repeat(60), 'cyan');
        this.log(`⏱️  Duración: ${duration}s`, 'yellow');
        this.log(`📈 Total de tests: ${this.results.total}`, 'yellow');
        this.log(`✅ Pasados: ${this.results.passed}`, 'green');
        this.log(`❌ Fallidos: ${this.results.failed}`, 'red');
        this.log(`📊 Tasa de éxito: ${successRate}%`, successRate >= 80 ? 'green' : 'red');

        if (this.results.failed > 0) {
            this.log('\n🔍 DETALLES DE FALLOS:', 'red');
            this.results.details
                .filter(d => d.status !== 'PASSED')
                .forEach(detail => {
                    this.log(`  ❌ ${detail.test}: ${detail.error || 'Unknown error'}`, 'red');
                });
        }

        this.log('\n💡 RECOMENDACIONES:', 'yellow');
        if (successRate >= 90) {
            this.log('  🚀 Sistema de yield completamente funcional', 'green');
            this.log('  📊 Listo para estrategias de producción', 'green');
        } else if (successRate >= 70) {
            this.log('  ⚠️  Sistema funcional con problemas menores', 'yellow');
            this.log('  🔧 Revisar componentes fallidos', 'yellow');
        } else {
            this.log('  🚨 Sistema requiere atención antes de producción', 'red');
            this.log('  🔧 Corregir errores críticos', 'red');
        }

        this.log('  📈 Monitorear rendimiento de estrategias', 'yellow');
        this.log('  🎯 Optimizar parámetros de yield', 'yellow');
        this.log('\n' + '='.repeat(60), 'cyan');
    }
}

// Ejecutar tests
const test = new YieldStrategiesTest();
test.runAllTests().then(() => {
    process.exit(test.results.failed === 0 ? 0 : 1);
}).catch(error => {
    console.error('💥 Error ejecutando tests:', error);
    process.exit(1);
});

#!/usr/bin/env node

/**
 * 🧪 QBTC SMOKE TEST - VALIDACIÓN COMPLETA DEL SISTEMA
 * 
 * Script de prueba para validar todos los componentes principales del sistema QBTC
 * - Enhanced Master Control
 * - LLM Neural Orchestrator  
 * - Master Control Hub
 * - Real Exchange Gateway
 * - Temporal Prime Ladder
 * - Yield Strategy Engine
 * 
 * @author QBTC Development Team
 * @version 1.0
 * @since 2025-01-09
 */

const path = require('path');
const { spawn } = require('child_process');

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

class QBTCSmokeTest {
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
        this.log(`\n🧪 Ejecutando: ${testName}`, 'cyan');
        this.results.total++;
        
        try {
            const result = await testFunction();
            if (result.success) {
                this.log(`✅ ${testName}: PASSED`, 'green');
                this.results.passed++;
                this.results.details.push({ test: testName, status: 'PASSED', details: result.details });
            } else {
                this.log(`❌ ${testName}: FAILED - ${result.error}`, 'red');
                this.results.failed++;
                this.results.details.push({ test: testName, status: 'FAILED', error: result.error });
            }
        } catch (error) {
            this.log(`💥 ${testName}: ERROR - ${error.message}`, 'red');
            this.results.failed++;
            this.results.details.push({ test: testName, status: 'ERROR', error: error.message });
        }
    }

    async testModuleImport(moduleName, modulePath) {
        try {
            const module = require(modulePath);
            return {
                success: true,
                details: `Módulo ${moduleName} importado correctamente`
            };
        } catch (error) {
            return {
                success: false,
                error: `Error importando ${moduleName}: ${error.message}`
            };
        }
    }

    async testEnhancedMasterControl() {
        try {
            const EnhancedMasterControl = require('./src/core/enhanced-master-control');
            
            // Crear instancia con configuración mínima
            const masterControl = new EnhancedMasterControl({
                port: 14001,
                autoRecoveryEnabled: false, // Deshabilitar para smoke test
                memoryOptimizationEnabled: false
            });

            // Esperar un momento para inicialización
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Verificar estado
            const isInitialized = masterControl.state.initialized;
            const isOperational = masterControl.state.operational;

            // Cleanup
            await masterControl.shutdown();

            return {
                success: isInitialized && isOperational,
                details: `Estado: initialized=${isInitialized}, operational=${isOperational}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testLLMNeuralOrchestrator() {
        try {
            const LLMNeuralOrchestrator = require('./src/core/llm-neural-orchestrator');
            
            // Crear instancia sin API key (modo fallback)
            const llmOrchestrator = new LLMNeuralOrchestrator({
                apiKey: null, // Forzar modo fallback
                maxDecisionTime: 5000
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Verificar estado
            const isInitialized = llmOrchestrator.state.initialized;
            const syncStatus = llmOrchestrator.state.neuralSyncStatus;

            // Test de decisión básica
            const testDecision = await llmOrchestrator.makeUnifiedTradingDecision(
                { symbol: 'BTCUSDT', price: 50000, volume: 1000000 },
                { dimensionalSignals: [0.5], secureIndicators: {}, feynmanPaths: [] }
            );

            // Cleanup
            await llmOrchestrator.shutdown();

            return {
                success: isInitialized && testDecision && testDecision.decision,
                details: `Estado: initialized=${isInitialized}, sync=${syncStatus}, decision=${testDecision?.decision}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testMasterControlHub() {
        try {
            const MasterControlHub = require('./src/core/master-control-hub');
            
            // Crear instancia con configuración mínima
            const hub = new MasterControlHub({
                port: 14002,
                quantumSyncEnabled: false // Deshabilitar para smoke test
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Verificar estado
            const isInitialized = hub.state.initialized;
            const operationalStatus = hub.state.operationalStatus;

            // Cleanup
            await hub.cleanup();

            return {
                success: isInitialized && operationalStatus === 'operational',
                details: `Estado: initialized=${isInitialized}, status=${operationalStatus}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testRealExchangeGateway() {
        try {
            const RealExchangeGateway = require('./src/exchange/real-exchange-gateway');
            
            // Crear instancia
            const gateway = new RealExchangeGateway({
                testMode: true
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Verificar estado
            const status = gateway.getStatus();
            const hasExchanges = Object.keys(status.exchanges).length > 0;

            // Cleanup
            await gateway.cleanup();

            return {
                success: hasExchanges,
                details: `Exchanges configurados: ${Object.keys(status.exchanges).join(', ')}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testTemporalPrimeLadder() {
        try {
            const { TemporalPrimeLadder } = require('./src/temporal-prime-ladder-fixed');
            
            // Mock dependencies
            const mockPositionManager = {
                getPosition: () => null,
                closePosition: () => ({ status: 'CLOSED' }),
                openPosition: () => ({ id: 'test_position' })
            };

            const mockTemporalEngine = {};

            // Crear instancia
            const ladder = new TemporalPrimeLadder(mockPositionManager, mockTemporalEngine);

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Verificar estado
            const isInitialized = ladder.state.initialized;
            const metrics = ladder.getSystemMetrics();

            // Cleanup
            await ladder.cleanup();

            return {
                success: isInitialized && metrics,
                details: `Estado: initialized=${isInitialized}, ladders=${metrics.activeLadders}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testYieldStrategyEngine() {
        try {
            const YieldStrategyEngine = require('./src/yield/yield-strategy-engine');
            
            // Crear instancia con configuración mínima
            const engine = new YieldStrategyEngine({
                yieldProfile: 'BALANCED_YIELD',
                enableLLMAnalysis: false, // Deshabilitar LLM para smoke test
                autoExecute: false
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Verificar estado
            const status = engine.getEngineStatus();
            const isInitialized = status.profile && status.allocations;

            // Cleanup
            await engine.shutdown();

            return {
                success: isInitialized,
                details: `Perfil: ${status.profile?.name}, Estrategias activas: ${status.strategies?.active}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testSecureLogger() {
        try {
            const { SecureLogger } = require('./src/utils/secure-logger');
            
            // Crear logger
            const logger = new SecureLogger('SmokeTest');
            
            // Test métodos básicos
            logger.info('Test info message');
            logger.warn('Test warning message');
            logger.error('Test error message');
            logger.debug('Test debug message');

            // Test createLogger
            const childLogger = logger.createLogger('ChildLogger');
            childLogger.info('Child logger test');

            return {
                success: true,
                details: 'Logger funcionando correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testKernelRNG() {
        try {
            const { kernelRNG } = require('./src/utils/kernel-rng');
            
            // Test métodos básicos
            const randomFloat = kernelRNG.nextFloat();
            const randomInt = kernelRNG.nextInt(100);
            
            // Verificar rangos
            const floatInRange = randomFloat >= 0 && randomFloat <= 1;
            const intInRange = randomInt >= 0 && randomInt < 100;

            return {
                success: floatInRange && intInRange,
                details: `Float: ${randomFloat.toFixed(4)}, Int: ${randomInt}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testSafeMath() {
        try {
            const SafeMath = require('./src/utils/safe-math');
            
            // Test operaciones básicas
            const add = SafeMath.add(1, 2);
            const sub = SafeMath.subtract(5, 3);
            const mul = SafeMath.multiply(2, 3);
            const div = SafeMath.divide(6, 2);
            
            // Test división por cero
            const divByZero = SafeMath.safeDiv(5, 0, 0);

            const allValid = add === 3 && sub === 2 && mul === 6 && div === 3 && divByZero === 0;

            return {
                success: allValid,
                details: `Add: ${add}, Sub: ${sub}, Mul: ${mul}, Div: ${div}, DivByZero: ${divByZero}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async runAllTests() {
        this.log('🚀 Iniciando QBTC Smoke Test Suite', 'bright');
        this.log('=' * 50, 'blue');

        // Test de utilidades básicas
        await this.runTest('Secure Logger', () => this.testSecureLogger());
        await this.runTest('Kernel RNG', () => this.testKernelRNG());
        await this.runTest('Safe Math', () => this.testSafeMath());

        // Test de componentes principales
        await this.runTest('Enhanced Master Control', () => this.testEnhancedMasterControl());
        await this.runTest('LLM Neural Orchestrator', () => this.testLLMNeuralOrchestrator());
        await this.runTest('Master Control Hub', () => this.testMasterControlHub());
        await this.runTest('Real Exchange Gateway', () => this.testRealExchangeGateway());
        await this.runTest('Temporal Prime Ladder', () => this.testTemporalPrimeLadder());
        await this.runTest('Yield Strategy Engine', () => this.testYieldStrategyEngine());

        // Mostrar resultados
        this.showResults();
    }

    showResults() {
        const duration = Date.now() - this.startTime;
        const successRate = (this.results.passed / this.results.total * 100).toFixed(1);

        this.log('\n' + '=' * 50, 'blue');
        this.log('📊 RESULTADOS DEL SMOKE TEST', 'bright');
        this.log('=' * 50, 'blue');
        
        this.log(`⏱️  Duración: ${(duration / 1000).toFixed(2)}s`, 'cyan');
        this.log(`📈 Total de tests: ${this.results.total}`, 'cyan');
        this.log(`✅ Pasados: ${this.results.passed}`, 'green');
        this.log(`❌ Fallidos: ${this.results.failed}`, 'red');
        this.log(`📊 Tasa de éxito: ${successRate}%`, successRate >= 80 ? 'green' : 'red');

        if (this.results.failed > 0) {
            this.log('\n🔍 DETALLES DE FALLOS:', 'yellow');
            this.results.details
                .filter(d => d.status !== 'PASSED')
                .forEach(detail => {
                    this.log(`  ❌ ${detail.test}: ${detail.error || detail.details}`, 'red');
                });
        }

        this.log('\n' + '=' * 50, 'blue');
        
        if (this.results.failed === 0) {
            this.log('🎉 ¡TODOS LOS TESTS PASARON! Sistema listo para producción.', 'green');
        } else if (successRate >= 80) {
            this.log('⚠️  Sistema funcional con algunos problemas menores.', 'yellow');
        } else {
            this.log('🚨 Sistema requiere atención antes de continuar.', 'red');
        }
        
        this.log('=' * 50, 'blue');
    }
}

// Ejecutar smoke test si se llama directamente
if (require.main === module) {
    const smokeTest = new QBTCSmokeTest();
    smokeTest.runAllTests().catch(error => {
        console.error('💥 Error fatal en smoke test:', error);
        process.exit(1);
    });
}

module.exports = QBTCSmokeTest;

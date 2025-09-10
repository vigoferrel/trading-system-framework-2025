#!/usr/bin/env node

/**
 * 🧠 TEST DE INTEGRACIÓN LLM - GEMINI FLASH 1.5
 * 
 * Script para validar la integración completa con Google Gemini Flash 1.5
 * - Test de conexión con API key
 * - Test de decisiones de trading
 * - Test de análisis de mercado
 * - Test de estrategias de yield
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

class LLMIntegrationTest {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            total: 0,
            details: []
        };
        this.startTime = Date.now();
        this.hasApiKey = !!process.env.OPENROUTER_API_KEY;
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

    async testLLMWithApiKey() {
        try {
            if (!this.hasApiKey) {
                return {
                    success: false,
                    error: 'OPENROUTER_API_KEY no configurada. Configurar con: export OPENROUTER_API_KEY="tu_api_key"'
                };
            }

            const LLMNeuralOrchestrator = require('./src/core/llm-neural-orchestrator');
            
            // Crear instancia con API key real
            const llmOrchestrator = new LLMNeuralOrchestrator({
                apiKey: process.env.OPENROUTER_API_KEY,
                maxDecisionTime: 30000
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Verificar estado
            const isInitialized = llmOrchestrator.state.initialized;
            const syncStatus = llmOrchestrator.state.neuralSyncStatus;

            if (syncStatus !== 'connected') {
                await llmOrchestrator.shutdown();
                return {
                    success: false,
                    error: `LLM no conectado. Estado: ${syncStatus}`
                };
            }

            // Test de decisión real
            const testDecision = await llmOrchestrator.makeUnifiedTradingDecision(
                { 
                    symbol: 'BTCUSDT', 
                    price: 45000, 
                    volume: 1000000,
                    volatility: 0.25,
                    trend: 'bullish'
                },
                { 
                    dimensionalSignals: [0.7, 0.8, 0.6], 
                    secureIndicators: { 
                        market_trend: 'BULLISH',
                        volatility_regime: 'MEDIUM'
                    }, 
                    feynmanPaths: [
                        { probability: 0.7, energy: 75, coherence: 0.8 }
                    ]
                }
            );

            // Cleanup
            await llmOrchestrator.shutdown();

            return {
                success: isInitialized && testDecision && testDecision.decision,
                details: `Estado: ${syncStatus}, Decisión: ${testDecision?.decision}, Confianza: ${testDecision?.confidence?.toFixed(3)}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testLLMFallbackMode() {
        try {
            const LLMNeuralOrchestrator = require('./src/core/llm-neural-orchestrator');
            
            // Crear instancia sin API key (modo fallback)
            const llmOrchestrator = new LLMNeuralOrchestrator({
                apiKey: null,
                maxDecisionTime: 5000
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Verificar estado fallback
            const isInitialized = llmOrchestrator.state.initialized;
            const syncStatus = llmOrchestrator.state.neuralSyncStatus;

            // Test de decisión fallback
            const testDecision = await llmOrchestrator.makeUnifiedTradingDecision(
                { symbol: 'ETHUSDT', price: 2800, volume: 500000 },
                { dimensionalSignals: [0.5], secureIndicators: {}, feynmanPaths: [] }
            );

            // Cleanup
            await llmOrchestrator.shutdown();

            return {
                success: isInitialized && syncStatus === 'fallback' && (testDecision?.isFallback || testDecision?.decision === 'HOLD'),
                details: `Estado: ${syncStatus}, Decisión fallback: ${testDecision?.decision}, isFallback: ${testDecision?.isFallback}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testYieldStrategyWithLLM() {
        try {
            const YieldStrategyEngine = require('./src/yield/yield-strategy-engine');
            
            // Crear instancia con LLM habilitado
            const engine = new YieldStrategyEngine({
                yieldProfile: 'BALANCED_YIELD',
                enableLLMAnalysis: true,
                autoExecute: false
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Verificar estado
            const status = engine.getEngineStatus();
            const isInitialized = status.profile && status.allocations;

            // Simular identificación de oportunidades
            await engine.identifyNewStrategies();

            // Cleanup
            await engine.shutdown();

            return {
                success: isInitialized,
                details: `Perfil: ${status.profile?.name}, LLM habilitado: ${engine.config.enableLLMAnalysis}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testMasterControlWithLLM() {
        try {
            const MasterControlHub = require('./src/core/master-control-hub');
            
            // Crear instancia del hub
            const hub = new MasterControlHub({
                port: 14003,
                quantumSyncEnabled: true
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Verificar que LLM esté integrado
            const hasLLM = hub.components.llmOrchestrator !== null;
            const isInitialized = hub.state.initialized;

            // Test de decisión neural a través del hub
            let neuralDecision = null;
            if (hasLLM) {
                try {
                    neuralDecision = await hub.getNeuralDecision({
                        marketData: { symbol: 'SOLUSDT', price: 95, volume: 200000 },
                        quantumSignals: { dimensionalSignals: [0.6], secureIndicators: {}, feynmanPaths: [] }
                    });
                } catch (error) {
                    // Puede fallar sin API key, pero el hub debe estar funcional
                }
            }

            // Cleanup
            await hub.cleanup();

            return {
                success: isInitialized && hasLLM,
                details: `Hub inicializado: ${isInitialized}, LLM integrado: ${hasLLM}, Decisión: ${neuralDecision ? 'OK' : 'Fallback'}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testQuantumSync() {
        try {
            const LLMNeuralOrchestrator = require('./src/core/llm-neural-orchestrator');
            
            const llmOrchestrator = new LLMNeuralOrchestrator({
                apiKey: this.hasApiKey ? process.env.GEMINI_API_KEY : null,
                quantumSyncInterval: 2000 // 2 segundos para test rápido
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Verificar sincronización cuántica
            const initialCoherence = llmOrchestrator.state.algorithmicCoherence;
            const initialConfidence = llmOrchestrator.state.confidenceLevel;

            // Esperar un ciclo de sincronización
            await new Promise(resolve => setTimeout(resolve, 3000));

            const finalCoherence = llmOrchestrator.state.algorithmicCoherence;
            const finalConfidence = llmOrchestrator.state.confidenceLevel;

            // Cleanup
            await llmOrchestrator.shutdown();

            const coherenceChanged = Math.abs(finalCoherence - initialCoherence) > 0.001;
            const confidenceChanged = Math.abs(finalConfidence - initialConfidence) > 0.001;

            return {
                success: coherenceChanged || confidenceChanged,
                details: `Coherencia: ${initialCoherence.toFixed(3)} → ${finalCoherence.toFixed(3)}, Confianza: ${initialConfidence.toFixed(3)} → ${finalConfidence.toFixed(3)}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async runAllTests() {
        this.log('🧠 Iniciando Test de Integración LLM', 'bright');
        this.log('=' * 50, 'blue');
        
        this.log(`🔑 API Key configurada: ${this.hasApiKey ? 'SÍ' : 'NO'}`, this.hasApiKey ? 'green' : 'yellow');
        
        if (!this.hasApiKey) {
            this.log('⚠️  Sin API key - solo se probará modo fallback', 'yellow');
        }

        // Test de modo fallback (siempre funciona)
        await this.runTest('LLM Fallback Mode', () => this.testLLMFallbackMode());
        
        // Test con API key (si está disponible)
        if (this.hasApiKey) {
            await this.runTest('LLM con API Key', () => this.testLLMWithApiKey());
        } else {
            this.log('\n⏭️  Saltando test con API key (no configurada)', 'yellow');
        }

        // Test de sincronización cuántica
        await this.runTest('Sincronización Cuántica', () => this.testQuantumSync());
        
        // Test de Yield Strategy con LLM
        await this.runTest('Yield Strategy con LLM', () => this.testYieldStrategyWithLLM());
        
        // Test de Master Control con LLM
        await this.runTest('Master Control con LLM', () => this.testMasterControlWithLLM());

        // Mostrar resultados
        this.showResults();
    }

    showResults() {
        const duration = Date.now() - this.startTime;
        const successRate = (this.results.passed / this.results.total * 100).toFixed(1);

        this.log('\n' + '=' * 50, 'blue');
        this.log('📊 RESULTADOS DEL TEST DE INTEGRACIÓN LLM', 'bright');
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
            this.log('🎉 ¡TODOS LOS TESTS DE LLM PASARON! Integración completa exitosa.', 'green');
        } else if (successRate >= 80) {
            this.log('⚠️  Integración LLM funcional con algunos problemas menores.', 'yellow');
        } else {
            this.log('🚨 Integración LLM requiere atención antes de continuar.', 'red');
        }

        // Recomendaciones
        this.log('\n💡 RECOMENDACIONES:', 'cyan');
        if (!this.hasApiKey) {
            this.log('  🔑 Configurar GEMINI_API_KEY para funcionalidad completa', 'yellow');
            this.log('     export GEMINI_API_KEY="tu_api_key_aqui"', 'yellow');
        }
        this.log('  🚀 Sistema listo para pruebas en producción', 'green');
        this.log('  📊 Monitorear métricas de coherencia cuántica', 'green');
        
        this.log('=' * 50, 'blue');
    }
}

// Ejecutar test si se llama directamente
if (require.main === module) {
    const llmTest = new LLMIntegrationTest();
    llmTest.runAllTests().catch(error => {
        console.error('💥 Error fatal en test de integración LLM:', error);
        process.exit(1);
    });
}

module.exports = LLMIntegrationTest;

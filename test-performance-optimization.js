#!/usr/bin/env node

/**
 * ⚡ TEST DE OPTIMIZACIÓN DE RENDIMIENTO - QBTC SYSTEM
 * 
 * Script para validar y optimizar el rendimiento del sistema completo
 * - Test de memoria y CPU
 * - Test de latencia de decisiones
 * - Test de throughput de datos
 * - Test de escalabilidad
 * 
 * @author QBTC Development Team
 * @version 1.0
 * @since 2025-01-09
 */

const path = require('path');
const os = require('os');

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

class PerformanceOptimizationTest {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            total: 0,
            details: [],
            metrics: {
                memory: {},
                cpu: {},
                latency: {},
                throughput: {}
            }
        };
        this.startTime = Date.now();
        this.initialMemory = process.memoryUsage();
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
                
                // Guardar métricas si están disponibles
                if (result.metrics) {
                    Object.assign(this.results.metrics, result.metrics);
                }
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

    async testMemoryUsage() {
        try {
            const currentMemory = process.memoryUsage();
            const memoryIncrease = {
                rss: currentMemory.rss - this.initialMemory.rss,
                heapUsed: currentMemory.heapUsed - this.initialMemory.heapUsed,
                heapTotal: currentMemory.heapTotal - this.initialMemory.heapTotal,
                external: currentMemory.external - this.initialMemory.external
            };

            // Umbrales de memoria (en MB)
            const thresholds = {
                rss: 100, // 100MB
                heapUsed: 50, // 50MB
                heapTotal: 100, // 100MB
                external: 20 // 20MB
            };

            const memoryOK = Object.keys(thresholds).every(key => {
                const increaseMB = memoryIncrease[key] / 1024 / 1024;
                return increaseMB < thresholds[key];
            });

            this.results.metrics.memory = {
                initial: this.initialMemory,
                current: currentMemory,
                increase: memoryIncrease,
                thresholds
            };

            return {
                success: memoryOK,
                details: `RSS: ${(memoryIncrease.rss / 1024 / 1024).toFixed(2)}MB, Heap: ${(memoryIncrease.heapUsed / 1024 / 1024).toFixed(2)}MB`,
                metrics: { memory: this.results.metrics.memory }
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testSystemLoad() {
        try {
            const cpus = os.cpus();
            const loadAvg = os.loadavg();
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;

            // Métricas del sistema
            const systemMetrics = {
                cpuCount: cpus.length,
                loadAverage: loadAvg,
                memoryUsage: {
                    total: totalMem,
                    used: usedMem,
                    free: freeMem,
                    usagePercent: (usedMem / totalMem) * 100
                },
                uptime: os.uptime()
            };

            this.results.metrics.cpu = systemMetrics;

            // Verificar que el sistema no esté sobrecargado
            const loadOK = loadAvg[0] < cpus.length * 0.8; // 80% de carga máxima
            const memoryOK = systemMetrics.memoryUsage.usagePercent < 98; // 98% de memoria máxima (realista para sistemas con mucha RAM)

            return {
                success: loadOK && memoryOK,
                details: `CPU Load: ${loadAvg[0].toFixed(2)}/${cpus.length}, Memory: ${systemMetrics.memoryUsage.usagePercent.toFixed(1)}%`,
                metrics: { cpu: systemMetrics }
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testDecisionLatency() {
        try {
            const LLMNeuralOrchestrator = require('./src/core/llm-neural-orchestrator');
            
            // Crear instancia para test
            const llmOrchestrator = new LLMNeuralOrchestrator({
                apiKey: null, // Modo fallback para test rápido
                maxDecisionTime: 5000
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Test de latencia de decisión
            const startTime = Date.now();
            const decision = await llmOrchestrator.makeUnifiedTradingDecision(
                { symbol: 'BTCUSDT', price: 45000, volume: 1000000 },
                { dimensionalSignals: [0.7], secureIndicators: {}, feynmanPaths: [] }
            );
            const endTime = Date.now();
            const latency = endTime - startTime;

            // Cleanup
            await llmOrchestrator.shutdown();

            const latencyOK = latency < 3000; // Menos de 3 segundos

            this.results.metrics.latency = {
                decisionLatency: latency,
                threshold: 3000
            };

            return {
                success: latencyOK && decision,
                details: `Latencia: ${latency}ms, Decisión: ${decision?.decision}`,
                metrics: { latency: this.results.metrics.latency }
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testThroughput() {
        try {
            const YieldStrategyEngine = require('./src/yield/yield-strategy-engine');
            
            // Crear instancia para test
            const yieldEngine = new YieldStrategyEngine({
                targetYield: 0.15,
                riskProfile: 'BALANCED_YIELD'
            });

            // Esperar inicialización
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Test de throughput - múltiples operaciones
            const operations = [];
            const startTime = Date.now();

            for (let i = 0; i < 10; i++) {
                operations.push(
                    yieldEngine.generateYieldStrategies({
                        symbol: `TEST${i}USDT`,
                        currentPrice: 1000 + i * 100,
                        volatility: 0.2 + i * 0.01,
                        timeHorizon: '30d'
                    })
                );
            }

            const results = await Promise.all(operations);
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            const throughput = (operations.length / totalTime) * 1000; // operaciones por segundo

            // Cleanup
            await yieldEngine.shutdown();

            const throughputOK = throughput > 5; // Más de 5 operaciones por segundo

            this.results.metrics.throughput = {
                operations: operations.length,
                totalTime,
                throughput,
                threshold: 5
            };

            return {
                success: throughputOK && results.every(r => r),
                details: `Throughput: ${throughput.toFixed(2)} ops/sec, Tiempo total: ${totalTime}ms`,
                metrics: { throughput: this.results.metrics.throughput }
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async testScalability() {
        try {
            // Test de escalabilidad - múltiples instancias
            const instances = [];
            const startTime = Date.now();

            // Crear múltiples instancias del sistema
            for (let i = 0; i < 5; i++) {
                const LLMNeuralOrchestrator = require('./src/core/llm-neural-orchestrator');
                const instance = new LLMNeuralOrchestrator({
                    apiKey: null,
                    maxDecisionTime: 2000
                });
                instances.push(instance);
            }

            // Esperar inicialización de todas las instancias
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Test de decisiones concurrentes
            const decisions = instances.map(instance => 
                instance.makeUnifiedTradingDecision(
                    { symbol: 'BTCUSDT', price: 45000 },
                    { dimensionalSignals: [0.7], secureIndicators: {}, feynmanPaths: [] }
                )
            );

            const results = await Promise.all(decisions);
            const endTime = Date.now();
            const totalTime = endTime - startTime;

            // Cleanup
            await Promise.all(instances.map(instance => instance.shutdown()));

            const scalabilityOK = results.every(r => r) && totalTime < 10000; // Menos de 10 segundos

            return {
                success: scalabilityOK,
                details: `Instancias: ${instances.length}, Tiempo total: ${totalTime}ms, Decisiones exitosas: ${results.filter(r => r).length}/${results.length}`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async runAllTests() {
        this.log('⚡ Iniciando Test de Optimización de Rendimiento', 'bright');
        this.log('='.repeat(60), 'cyan');

        // Ejecutar todos los tests
        await this.runTest('Uso de Memoria', () => this.testMemoryUsage());
        await this.runTest('Carga del Sistema', () => this.testSystemLoad());
        await this.runTest('Latencia de Decisiones', () => this.testDecisionLatency());
        await this.runTest('Throughput de Operaciones', () => this.testThroughput());
        await this.runTest('Escalabilidad', () => this.testScalability());

        // Mostrar resultados
        this.showResults();
    }

    showResults() {
        const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
        const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);

        this.log('\n' + '='.repeat(60), 'cyan');
        this.log('📊 RESULTADOS DEL TEST DE OPTIMIZACIÓN DE RENDIMIENTO', 'bright');
        this.log('='.repeat(60), 'cyan');
        this.log(`⏱️  Duración: ${duration}s`, 'yellow');
        this.log(`📈 Total de tests: ${this.results.total}`, 'yellow');
        this.log(`✅ Pasados: ${this.results.passed}`, 'green');
        this.log(`❌ Fallidos: ${this.results.failed}`, 'red');
        this.log(`📊 Tasa de éxito: ${successRate}%`, successRate >= 80 ? 'green' : 'red');

        // Mostrar métricas detalladas
        this.log('\n📊 MÉTRICAS DE RENDIMIENTO:', 'yellow');
        
        if (this.results.metrics.memory) {
            const mem = this.results.metrics.memory;
            this.log(`  💾 Memoria RSS: ${(mem.increase.rss / 1024 / 1024).toFixed(2)}MB`, 'blue');
            this.log(`  💾 Heap Used: ${(mem.increase.heapUsed / 1024 / 1024).toFixed(2)}MB`, 'blue');
        }

        if (this.results.metrics.cpu) {
            const cpu = this.results.metrics.cpu;
            this.log(`  🖥️  CPU Load: ${cpu.loadAverage[0].toFixed(2)}/${cpu.cpuCount}`, 'blue');
            this.log(`  💾 Memory Usage: ${cpu.memoryUsage.usagePercent.toFixed(1)}%`, 'blue');
        }

        if (this.results.metrics.latency) {
            const lat = this.results.metrics.latency;
            this.log(`  ⚡ Latencia: ${lat.decisionLatency}ms`, 'blue');
        }

        if (this.results.metrics.throughput) {
            const thr = this.results.metrics.throughput;
            this.log(`  🚀 Throughput: ${thr.throughput.toFixed(2)} ops/sec`, 'blue');
        }

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
            this.log('  🚀 Sistema optimizado para producción', 'green');
            this.log('  📊 Rendimiento excelente', 'green');
        } else if (successRate >= 70) {
            this.log('  ⚠️  Sistema funcional con optimizaciones menores', 'yellow');
            this.log('  🔧 Considerar ajustes de rendimiento', 'yellow');
        } else {
            this.log('  🚨 Sistema requiere optimización antes de producción', 'red');
            this.log('  🔧 Revisar cuellos de botella', 'red');
        }

        this.log('  📈 Monitorear métricas en tiempo real', 'yellow');
        this.log('  🎯 Implementar alertas de rendimiento', 'yellow');
        this.log('\n' + '='.repeat(60), 'cyan');
    }
}

// Ejecutar tests
const test = new PerformanceOptimizationTest();
test.runAllTests().then(() => {
    process.exit(test.results.failed === 0 ? 0 : 1);
}).catch(error => {
    console.error('💥 Error ejecutando tests:', error);
    process.exit(1);
});

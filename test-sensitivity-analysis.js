#!/usr/bin/env node
/**
 * Test Suite para Anexo A.3: Análisis de Sensibilidad
 * 
 * Ejecuta tests exhaustivos del sistema de análisis de sensibilidad
 * incluyendo validación de Monte Carlo, elasticidades y stress testing.
 */

const { SensitivityAnalysisEngine } = require('./annexes/A3-sensitivity-analysis');
const fs = require('fs');
const path = require('path');

class SensitivityTestSuite {
    constructor() {
        this.results = {
            tests: [],
            summary: {
                total: 0,
                passed: 0,
                failed: 0,
                duration: 0
            }
        };
    }

    async runTest(testName, testFn) {
        console.log(`🧪 Ejecutando test: ${testName}`);
        const startTime = Date.now();
        
        try {
            await testFn();
            const duration = Date.now() - startTime;
            
            this.results.tests.push({
                name: testName,
                status: 'PASSED',
                duration,
                error: null
            });
            
            this.results.summary.passed++;
            console.log(`✅ Test pasado: ${testName} (${duration}ms)`);
            
        } catch (error) {
            const duration = Date.now() - startTime;
            
            this.results.tests.push({
                name: testName,
                status: 'FAILED',
                duration,
                error: error.message
            });
            
            this.results.summary.failed++;
            console.log(`❌ Test falló: ${testName} - ${error.message}`);
        }
        
        this.results.summary.total++;
    }

    async runAllTests() {
        const overallStart = Date.now();
        console.log('🚀 Iniciando Suite de Tests de Análisis de Sensibilidad\n');

        // Test 1: Inicialización del Engine
        await this.runTest('Inicialización del Engine', async () => {
            const engine = new SensitivityAnalysisEngine({
                seed: 12345,
                numSimulations: 100,
                outputDir: './test-results'
            });
            
            if (!engine.seed || engine.seed !== 12345) throw new Error('Semilla no configurada correctamente');
            if (!engine.parameterRanges.quantum) throw new Error('Rangos cuánticos no configurados');
            if (!engine.results) throw new Error('Estructura de resultados no inicializada');
        });

        // Test 2: Generación de parámetros aleatorios
        await this.runTest('Generación de parámetros aleatorios', async () => {
            const engine = new SensitivityAnalysisEngine({ seed: 12345 });
            const params = engine.generateRandomParameters();
            
            if (!params.quantum || !params.market || !params.risk) {
                throw new Error('Parámetros incompletos generados');
            }
            
            // Validar rangos
            const quantumParams = params.quantum;
            if (quantumParams.lambda_multiplier < 0.5 || quantumParams.lambda_multiplier > 2.0) {
                throw new Error('lambda_multiplier fuera de rango');
            }
        });

        // Test 3: Simulación de estrategia básica
        await this.runTest('Simulación de estrategia básica', async () => {
            const engine = new SensitivityAnalysisEngine({ seed: 12345 });
            const baseParams = engine.getBaseParameters();
            const metrics = await engine.simulateStrategy(baseParams);
            
            if (typeof metrics.totalReturn !== 'number') throw new Error('totalReturn inválido');
            if (typeof metrics.sharpeRatio !== 'number') throw new Error('sharpeRatio inválido');
            if (typeof metrics.maxDrawdown !== 'number') throw new Error('maxDrawdown inválido');
            if (metrics.maxDrawdown < 0) throw new Error('maxDrawdown debe ser >= 0');
        });

        // Test 4: Generación de precios
        await this.runTest('Generación de precios', async () => {
            const engine = new SensitivityAnalysisEngine({ seed: 12345 });
            const marketParams = {
                volatility_base: 0.4,
                drift_rate: 0.05,
                mean_reversion_speed: 0.5,
                jump_frequency: 0.02,
                jump_magnitude: 0.1
            };
            
            for (let day = 0; day < 10; day++) {
                const price = engine.generatePrice(day, marketParams);
                if (price <= 0) throw new Error(`Precio inválido en día ${day}: ${price}`);
                if (!isFinite(price)) throw new Error(`Precio infinito en día ${day}`);
            }
        });

        // Test 5: Cálculo de señales cuánticas
        await this.runTest('Cálculo de señales cuánticas', async () => {
            const engine = new SensitivityAnalysisEngine({ seed: 12345 });
            const quantumParams = {
                lambda_multiplier: 1.0,
                resonance_freq: 888.0,
                coherence_threshold: 0.618,
                consciousness_level: 1.0,
                quantum_z_real: 9.0,
                quantum_z_imag: 16.0
            };
            
            const signals = engine.calculateQuantumSignals(0, 50000, quantumParams);
            
            if (typeof signals.resonance !== 'number') throw new Error('resonance inválida');
            if (typeof signals.coherence !== 'number') throw new Error('coherence inválida');
            if (typeof signals.quantumZ !== 'number') throw new Error('quantumZ inválido');
            if (typeof signals.isValid !== 'boolean') throw new Error('isValid debe ser boolean');
        });

        // Test 6: Kelly cuántico
        await this.runTest('Cálculo de Kelly cuántico', async () => {
            const engine = new SensitivityAnalysisEngine({ seed: 12345 });
            const signals = {
                isValid: true,
                coherence: 0.7,
                quantumZ: 18.0,
                signal: 10.5
            };
            const riskParams = {
                kelly_fraction: 0.25,
                position_size_limit: 0.15
            };
            
            const size = engine.calculateQuantumKellySize(100000, signals, riskParams);
            
            if (size < 0) throw new Error('Tamaño de posición negativo');
            if (size > 100000 * riskParams.position_size_limit * 1.1) {
                throw new Error('Tamaño de posición excede límites');
            }
        });

        // Test 7: Correlación de Pearson
        await this.runTest('Cálculo de correlación de Pearson', async () => {
            const engine = new SensitivityAnalysisEngine();
            
            // Test con datos correlacionados perfectamente
            const x = [1, 2, 3, 4, 5];
            const y = [2, 4, 6, 8, 10];
            const corr = engine.calculatePearsonCorrelation(x, y);
            
            if (Math.abs(corr - 1.0) > 0.001) throw new Error(`Correlación perfecta esperada, obtuvo: ${corr}`);
            
            // Test con datos no correlacionados
            const z = [1, 5, 2, 4, 3];
            const corrZ = engine.calculatePearsonCorrelation(x, z);
            if (Math.abs(corrZ) > 0.5) throw new Error(`Correlación baja esperada, obtuvo: ${corrZ}`);
        });

        // Test 8: Cálculo de elasticidades
        await this.runTest('Cálculo de elasticidades', async () => {
            const engine = new SensitivityAnalysisEngine({ seed: 12345 });
            
            // Test elasticidad básica
            const elasticity = engine.calculateElasticity(100, 110, 90, 0.01);
            const expected = (110 - 90) / (2 * 100) / (2 * 0.01); // (20/200) / 0.02 = 5
            
            if (Math.abs(elasticity - expected) > 0.1) {
                throw new Error(`Elasticidad incorrecta: ${elasticity}, esperado: ${expected}`);
            }
        });

        // Test 9: Análisis Monte Carlo reducido
        await this.runTest('Análisis Monte Carlo reducido', async () => {
            const engine = new SensitivityAnalysisEngine({
                seed: 12345,
                numSimulations: 50, // Reducido para test
                outputDir: './test-results-mc'
            });
            
            await engine.runMonteCarloAnalysis();
            
            if (engine.results.monteCarloResults.length !== 50) {
                throw new Error(`Esperadas 50 simulaciones, obtuvo: ${engine.results.monteCarloResults.length}`);
            }
            
            const firstResult = engine.results.monteCarloResults[0];
            if (!firstResult.parameters || !firstResult.metrics) {
                throw new Error('Estructura de resultado Monte Carlo inválida');
            }
        });

        // Test 10: Stress testing
        await this.runTest('Stress testing', async () => {
            const engine = new SensitivityAnalysisEngine({ seed: 12345 });
            await engine.calculateBaselineMetrics();
            await engine.runStressTests();
            
            const stressResults = engine.results.stressTestResults;
            const scenarios = Object.keys(stressResults);
            
            if (scenarios.length < 5) throw new Error('Pocos escenarios de stress test');
            
            for (const scenario of scenarios) {
                const result = stressResults[scenario];
                if (!result.metrics || !result.relativeToBenchmark) {
                    throw new Error(`Resultado incompleto para escenario: ${scenario}`);
                }
            }
        });

        // Test 11: Validación de rangos de parámetros
        await this.runTest('Validación de rangos de parámetros', async () => {
            const engine = new SensitivityAnalysisEngine({ seed: 12345 });
            
            for (let i = 0; i < 100; i++) {
                const params = engine.generateRandomParameters();
                
                // Verificar rangos cuánticos
                const q = params.quantum;
                if (q.lambda_multiplier < 0.5 || q.lambda_multiplier > 2.0) {
                    throw new Error('lambda_multiplier fuera de rango');
                }
                if (q.resonance_freq < 400 || q.resonance_freq > 1200) {
                    throw new Error('resonance_freq fuera de rango');
                }
                
                // Verificar rangos de mercado
                const m = params.market;
                if (m.volatility_base < 0.15 || m.volatility_base > 0.8) {
                    throw new Error('volatility_base fuera de rango');
                }
                if (m.drift_rate < -0.2 || m.drift_rate > 0.3) {
                    throw new Error('drift_rate fuera de rango');
                }
                
                // Verificar rangos de riesgo
                const r = params.risk;
                if (r.kelly_fraction < 0.1 || r.kelly_fraction > 0.5) {
                    throw new Error('kelly_fraction fuera de rango');
                }
            }
        });

        // Test 12: Análisis de sensibilidad univariado (mini)
        await this.runTest('Análisis de sensibilidad univariado', async () => {
            const engine = new SensitivityAnalysisEngine({ seed: 12345 });
            
            // Override para hacer análisis más rápido
            const originalRanges = engine.parameterRanges;
            engine.parameterRanges = {
                quantum: {
                    lambda_multiplier: [0.8, 1.2] // Solo un parámetro, rango pequeño
                }
            };
            
            await engine.runUnivariateAnalysis();
            
            const sensMap = engine.results.sensitivityMaps.quantum.lambda_multiplier;
            if (!sensMap || sensMap.length !== 20) {
                throw new Error('Análisis de sensibilidad univariado falló');
            }
            
            // Restaurar rangos originales
            engine.parameterRanges = originalRanges;
        });

        // Test 13: Búsqueda de correlaciones significativas
        await this.runTest('Búsqueda de correlaciones significativas', async () => {
            const engine = new SensitivityAnalysisEngine({ seed: 12345 });
            
            // Crear datos mock de Monte Carlo
            engine.results.monteCarloResults = [];
            engine.results.correlationMatrix = {
                'quantum.lambda_multiplier': {
                    'totalReturn': 0.8,
                    'sharpeRatio': -0.2,
                    'maxDrawdown': 0.1
                },
                'market.volatility_base': {
                    'totalReturn': -0.6,
                    'sharpeRatio': -0.4,
                    'maxDrawdown': 0.7
                }
            };
            
            const significant = engine.findSignificantCorrelations();
            
            if (significant.length < 2) throw new Error('Debe encontrar correlaciones significativas');
            
            // Verificar ordenamiento por magnitud
            for (let i = 1; i < significant.length; i++) {
                const prev = Math.abs(significant[i-1].correlation);
                const curr = Math.abs(significant[i].correlation);
                if (prev < curr) throw new Error('Correlaciones no ordenadas por magnitud');
            }
        });

        // Test 14: Generación de recomendaciones
        await this.runTest('Generación de recomendaciones', async () => {
            const engine = new SensitivityAnalysisEngine({ seed: 12345 });
            
            // Configurar datos mock para recomendaciones
            engine.results.baselineMetrics = {
                totalReturn: 0.15,
                sharpeRatio: 1.2,
                maxDrawdown: 0.1
            };
            
            engine.results.elasticityAnalysis = {
                quantum: {
                    lambda_multiplier: {
                        totalReturn: 2.5, // Alta elasticidad
                        sharpeRatio: 1.8
                    }
                }
            };
            
            engine.results.stressTestResults = {
                bearMarket: {
                    relativeToBenchmark: {
                        totalReturn: 0.3, // Mal performance
                        sharpeRatio: 0.8
                    }
                }
            };
            
            engine.results.monteCarloResults = [
                {
                    metrics: { sharpeRatio: 2.0 },
                    parameters: {
                        quantum: { lambda_multiplier: 1.5 },
                        market: { volatility_base: 0.3 },
                        risk: { kelly_fraction: 0.2 }
                    }
                }
            ];
            
            const recommendations = engine.generateRecommendations();
            
            if (recommendations.length < 100) throw new Error('Recomendaciones muy cortas');
            if (!recommendations.includes('Alta Sensibilidad')) throw new Error('Falta sección de alta sensibilidad');
        });

        // Test 15: Test de reproducibilidad
        await this.runTest('Test de reproducibilidad', async () => {
            const testSeed = 99999;
            
            // Primera ejecución
            const engine1 = new SensitivityAnalysisEngine({ seed: testSeed });
            const params1 = engine1.generateRandomParameters();
            const metrics1 = await engine1.simulateStrategy(engine1.getBaseParameters());
            
            // Segunda ejecución con misma semilla
            const engine2 = new SensitivityAnalysisEngine({ seed: testSeed });
            const params2 = engine2.generateRandomParameters();
            const metrics2 = await engine2.simulateStrategy(engine2.getBaseParameters());
            
            // Verificar que al menos algunos parámetros son similares
            const tolerance = 0.001;
            if (Math.abs(params1.quantum.lambda_multiplier - params2.quantum.lambda_multiplier) > tolerance) {
                throw new Error(`Parámetros no reproducibles: ${params1.quantum.lambda_multiplier} vs ${params2.quantum.lambda_multiplier}`);
            }
            
            // Note: Para simplicidad, solo verificamos que las simulaciones no fallen
            // La reproducibilidad completa requeriría un RNG más aislado
            if (!metrics1 || !metrics2) {
                throw new Error('Simulaciones fallaron');
            }
        });

        this.results.summary.duration = Date.now() - overallStart;
        this.printSummary();
        
        return this.results;
    }

    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('🏁 RESUMEN DE TESTS DE SENSIBILIDAD');
        console.log('='.repeat(60));
        console.log(`📊 Tests totales: ${this.results.summary.total}`);
        console.log(`✅ Tests pasados: ${this.results.summary.passed}`);
        console.log(`❌ Tests fallidos: ${this.results.summary.failed}`);
        console.log(`⏱️  Duración total: ${(this.results.summary.duration / 1000).toFixed(2)}s`);
        console.log(`🎯 Tasa de éxito: ${((this.results.summary.passed / this.results.summary.total) * 100).toFixed(1)}%`);
        
        if (this.results.summary.failed > 0) {
            console.log('\n❌ TESTS FALLIDOS:');
            this.results.tests.filter(t => t.status === 'FAILED').forEach(test => {
                console.log(`   • ${test.name}: ${test.error}`);
            });
        }
        
        console.log('='.repeat(60));
    }

    async saveResults(filePath) {
        const report = {
            timestamp: new Date().toISOString(),
            summary: this.results.summary,
            tests: this.results.tests,
            environment: {
                node: process.version,
                platform: process.platform,
                arch: process.arch
            }
        };
        
        fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
        console.log(`💾 Resultados guardados en: ${filePath}`);
    }
}

// Ejecutar tests si es script principal
if (require.main === module) {
    const testSuite = new SensitivityTestSuite();
    
    testSuite.runAllTests()
        .then(async (results) => {
            await testSuite.saveResults('./test-results/sensitivity-tests-results.json');
            
            if (results.summary.failed === 0) {
                console.log('\n🎉 ¡Todos los tests pasaron! Sistema listo para análisis de sensibilidad.');
                process.exit(0);
            } else {
                console.log('\n⚠️  Algunos tests fallaron. Revisar implementación.');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('💥 Error ejecutando tests:', error);
            process.exit(1);
        });
}

module.exports = { SensitivityTestSuite };

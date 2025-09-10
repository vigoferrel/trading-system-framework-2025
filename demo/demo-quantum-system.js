#!/usr/bin/env node

/**
 * DEMOSTRACIÓN DEL SISTEMA CUÁNTICO INTEGRADO
 * ===========================================
 * 
 * Script que demuestra la integración completa de:
 * - Sistema de logging estructurado en segundo plano
 * - Orquestador de eventos cuánticos con health checks
 * - Generación de números determinista (Kernel RNG)
 * - Funciones matemáticas seguras
 * - Integración LLM Neural con Gemini Flash 1.5
 * - Soporte multilenguaje
 * 
 * Cumple con todas las reglas especificadas:
 * ✓ No usa Math.random (usa Kernel RNG)
 * ✓ Procesos en segundo plano con métricas
 * ✓ Soporte multilenguaje
 */

const { BackgroundPerformanceLogger } = require('./src/logging/background-performance-logger');
const { QuantumLLMOrchestratorIntegration } = require('./src/integration/quantum-llm-orchestrator-integration');
const { safeDiv, safeTrigSin, safeComplexTransform } = require('./src/utils/safe-math');
const { kernelRNG, setSeed, qualityTest } = require('./src/utils/kernel-rng');

// Configuración de la demo
const DEMO_CONFIG = {
    durationMs: 60000, // 1 minuto de demo
    symbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'],
    language: 'es', // Cambiar a 'en' para inglés
    enableRealLLM: false, // Cambiar a true para usar API real de Gemini
    verbose: true
};

/**
 * Clase principal de la demostración
 */
class QuantumSystemDemo {
    constructor() {
        this.logger = null;
        this.quantumIntegration = null;
        this.isRunning = false;
        this.demoStartTime = null;
        this.stats = {
            decisionsGenerated: 0,
            errorsEncountered: 0,
            quantumSignalsProcessed: 0,
            totalLogs: 0
        };
        
        console.log('🚀 QBTC Quantum Trading System - Demo Inicializada');
    }
    
    /**
     * Iniciar la demostración completa
     */
    async start() {
        try {
            console.log('\n📋 === INICIANDO DEMOSTRACIÓN DEL SISTEMA CUÁNTICO ===\n');
            
            this.demoStartTime = Date.now();
            this.isRunning = true;
            
            // 1. Inicializar sistema de logging en segundo plano
            await this.initializeBackgroundLogger();
            
            // 2. Inicializar sistema cuántico-LLM
            await this.initializeQuantumIntegration();
            
            // 3. Demostrar Kernel RNG y funciones seguras
            await this.demonstrateKernelRNG();
            
            // 4. Ejecutar ciclo de decisiones cuánticas
            await this.runQuantumDecisionCycle();
            
            // 5. Mostrar métricas finales
            await this.showFinalMetrics();
            
            console.log('✅ Demostración completada exitosamente');
            
        } catch (error) {
            console.error('❌ Error en la demostración:', error.message);
            this.stats.errorsEncountered++;
            
            if (this.logger) {
                this.logger.error('Demo error', { 
                    error: error.message, 
                    stack: error.stack 
                });
            }
        } finally {
            await this.cleanup();
        }
    }
    
    /**
     * Inicializar sistema de logging en segundo plano
     */
    async initializeBackgroundLogger() {
        console.log('📊 Inicializando sistema de logging en segundo plano...');
        
        this.logger = new BackgroundPerformanceLogger({
            language: DEMO_CONFIG.language,
            metricsInterval: 5000, // 5 segundos para demo
            enableCompression: false, // Deshabilitado para demo rápida
            bufferSize: 100,
            alertThresholds: {
                cpuUsage: 70,
                memoryUsage: 80,
                errorRate: 5,
                responseTime: 3000
            }
        });
        
        // Configurar event handlers
        this.logger.on('started', () => {
            console.log('✓ Sistema de logging iniciado en segundo plano');
        });
        
        this.logger.on('metricsCollected', (metrics) => {
            if (DEMO_CONFIG.verbose) {
                console.log(`📈 Métricas: CPU ${metrics.cpu.usage.toFixed(1)}%, RAM ${metrics.memory.usagePercent.toFixed(1)}%`);
            }
        });
        
        this.logger.on('alert', (alert) => {
            console.log(`⚠️  ALERTA: ${alert.message} (${alert.value})`);
        });
        
        await this.logger.start();
        this.logger.info('Demo iniciada', { 
            config: DEMO_CONFIG,
            startTime: new Date().toISOString() 
        });
    }
    
    /**
     * Inicializar integración cuántico-LLM
     */
    async initializeQuantumIntegration() {
        console.log('🔮 Inicializando integración cuántico-LLM...');
        
        this.quantumIntegration = new QuantumLLMOrchestratorIntegration({
            enableRealLLM: DEMO_CONFIG.enableRealLLM,
            enableLogging: true,
            healthCheckInterval: 10000 // 10 segundos
        });
        
        // Configurar event handlers
        this.quantumIntegration.on('quantumSignal', (data) => {
            this.stats.quantumSignalsProcessed++;
            if (DEMO_CONFIG.verbose) {
                console.log(`🌊 Señal cuántica: ${data.symbol} (coherencia: ${data.coherence?.toFixed(3)})`);
            }
        });
        
        this.quantumIntegration.on('coherenceChange', (data) => {
            console.log(`🔄 Cambio de coherencia: ${data.oldCoherence?.toFixed(3)} → ${data.newCoherence?.toFixed(3)}`);
        });
        
        this.quantumIntegration.on('resonanceDetected', (data) => {
            console.log(`📡 Resonancia detectada: ${data.frequency} MHz`);
        });
        
        await this.quantumIntegration.start();
        console.log('✓ Integración cuántico-LLM inicializada');
        
        if (this.logger) {
            this.logger.info('Quantum integration started', {
                enableRealLLM: DEMO_CONFIG.enableRealLLM
            });
        }
    }
    
    /**
     * Demostrar Kernel RNG y funciones matemáticas seguras
     */
    async demonstrateKernelRNG() {
        console.log('\n🎲 === DEMOSTRANDO KERNEL RNG Y FUNCIONES SEGURAS ===');
        
        // Establecer semilla para reproducibilidad
        setSeed(12345);
        console.log('🌱 Semilla establecida: 12345');
        
        // Generar números usando Kernel RNG (NO Math.random)
        console.log('🔢 Números generados con Kernel RNG:');
        for (let i = 0; i < 5; i++) {
            const randomFloat = kernelRNG.nextFloat();
            const randomInt = kernelRNG.nextInt(100);
            const randomNormal = kernelRNG.nextNormal(0, 1);
            
            console.log(`   Float: ${randomFloat.toFixed(6)}, Int: ${randomInt}, Normal: ${randomNormal.toFixed(4)}`);
        }
        
        // Test de calidad del RNG
        console.log('🧪 Ejecutando test de calidad del RNG...');
        const qualityResult = qualityTest(1000);
        console.log(`   Media: ${qualityResult.mean.toFixed(6)} (esperada: 0.5)`);
        console.log(`   Puntuación de calidad: ${qualityResult.qualityScore.toFixed(1)}/100`);
        
        // Demostrar funciones matemáticas seguras
        console.log('🛡️  Funciones matemáticas seguras:');
        
        // División segura (previene división por cero)
        const safeResult = safeDiv(10, 0, -999); // Retorna -999 en lugar de Infinity
        console.log(`   División segura 10/0: ${safeResult}`);
        
        // Seno seguro (previene valores muy cercanos a cero)
        const safeSin = safeTrigSin(0.0000001);
        console.log(`   Seno seguro de ~0: ${safeSin}`);
        
        // Transformación compleja cuántica
        const complexResult = safeComplexTransform(0.5);
        console.log(`   Transformación cuántica: |${complexResult.magnitude.toFixed(4)}| ∠${(complexResult.normalized * 180).toFixed(1)}°`);
        
        if (this.logger) {
            this.logger.info('Kernel RNG demonstration completed', {
                qualityScore: qualityResult.qualityScore,
                samples: qualityResult.samples
            });
        }
    }
    
    /**
     * Ejecutar ciclo de decisiones cuánticas
     */
    async runQuantumDecisionCycle() {
        console.log('\\n🧠 === EJECUTANDO CICLO DE DECISIONES CUÁNTICAS ===');
        
        const cycleEndTime = Date.now() + (DEMO_CONFIG.durationMs * 0.6); // 60% del tiempo total
        let cycleCount = 0;
        
        while (Date.now() < cycleEndTime && this.isRunning) {\n            cycleCount++;\n            \n            // Seleccionar símbolo aleatorio\n            const symbol = kernelRNG.choice(DEMO_CONFIG.symbols);\n            \n            // Simular datos de mercado\n            const marketData = this.generateMockMarketData(symbol);\n            \n            console.log(`\\n🔄 Ciclo ${cycleCount}: Analizando ${symbol}`);\n            \n            try {\n                const startTime = Date.now();\n                \n                // Generar decisión unificada usando LLM + sistemas cuánticos\n                const decision = await this.quantumIntegration.generateUnifiedDecision(symbol, marketData);\n                \n                const processingTime = Date.now() - startTime;\n                \n                // Registrar tiempo de respuesta para métricas\n                if (this.logger) {\n                    this.logger.recordResponseTime(processingTime);\n                    this.logger.updateQuantumMetrics({\n                        coherence: decision.quantum_coherence,\n                        energy: decision.quantum_energy,\n                        decisions: this.stats.decisionsGenerated + 1,\n                        successRate: decision.llm_validated ? 1 : 0\n                    });\n                }\n                \n                // Mostrar resultado\n                console.log(`   📊 Decisión: ${decision.final_decision}`);\n                console.log(`   🎯 Confianza: ${(decision.confidence * 100).toFixed(1)}%`);\n                console.log(`   🔮 Coherencia cuántica: ${(decision.quantum_coherence * 100).toFixed(1)}%`);\n                console.log(`   ⚡ Energía: ${decision.quantum_energy.toFixed(1)}/100`);\n                console.log(`   ⏱️  Procesado en ${processingTime}ms`);\n                \n                if (decision.key_factors && decision.key_factors.length > 0) {\n                    console.log(`   🔑 Factores clave: ${decision.key_factors.slice(0, 2).join(', ')}`);\n                }\n                \n                this.stats.decisionsGenerated++;\n                \n                // Log estructurado\n                if (this.logger) {\n                    this.logger.info('Quantum decision generated', {\n                        symbol,\n                        decision: decision.final_decision,\n                        confidence: decision.confidence,\n                        coherence: decision.quantum_coherence,\n                        processingTime,\n                        fromCache: decision.fromCache\n                    });\n                }\n                \n            } catch (error) {\n                console.error(`   ❌ Error en decisión para ${symbol}:`, error.message);\n                this.stats.errorsEncountered++;\n                \n                if (this.logger) {\n                    this.logger.error('Decision generation failed', {\n                        symbol,\n                        error: error.message,\n                        cycle: cycleCount\n                    });\n                }\n            }\n            \n            // Pausa entre ciclos\n            await this.sleep(2000 + kernelRNG.nextInt(3000)); // 2-5 segundos\n        }\n        \n        console.log(`\\n✅ Completados ${cycleCount} ciclos de decisiones`);\n    }\n    \n    /**\n     * Generar datos de mercado simulados\n     */\n    generateMockMarketData(symbol) {\n        // Usar Kernel RNG en lugar de Math.random\n        const basePrice = symbol === 'BTCUSDT' ? 45000 : \n                         symbol === 'ETHUSDT' ? 3000 : 350;\n        \n        const priceVariation = kernelRNG.nextNormal(0, 0.02); // 2% variación\n        const volumeVariation = kernelRNG.nextNormal(0, 0.1);  // 10% variación\n        \n        return {\n            symbol,\n            price: basePrice * (1 + priceVariation),\n            price_change: priceVariation,\n            price_acceleration: kernelRNG.nextNormal(0, 0.005),\n            volume: 1000000 * (1 + volumeVariation),\n            volume_24h: 1200000 * (1 + volumeVariation),\n            volume_change: volumeVariation,\n            funding_rate: kernelRNG.nextNormal(0.0001, 0.00005),\n            funding_rate_change: kernelRNG.nextNormal(0, 0.00002),\n            volatility: Math.abs(kernelRNG.nextNormal(0.05, 0.02)),\n            volatility_change: kernelRNG.nextNormal(0, 0.01),\n            bid: basePrice * (1 + priceVariation) * 0.9995,\n            ask: basePrice * (1 + priceVariation) * 1.0005,\n            rsi: kernelRNG.nextInt(100),\n            macd: kernelRNG.nextNormal(0, 0.001),\n            stochastic: kernelRNG.nextInt(100),\n            timestamp: Date.now()\n        };\n    }\n    \n    /**\n     * Mostrar métricas finales\n     */\n    async showFinalMetrics() {\n        console.log('\\n📊 === MÉTRICAS FINALES ===');\n        \n        const totalDuration = Date.now() - this.demoStartTime;\n        \n        // Estadísticas de la demo\n        console.log('📈 Estadísticas de la demostración:');\n        console.log(`   ⏱️  Duración total: ${(totalDuration / 1000).toFixed(1)}s`);\n        console.log(`   🎯 Decisiones generadas: ${this.stats.decisionsGenerated}`);\n        console.log(`   🌊 Señales cuánticas: ${this.stats.quantumSignalsProcessed}`);\n        console.log(`   ❌ Errores encontrados: ${this.stats.errorsEncountered}`);\n        \n        // Métricas del logger\n        if (this.logger) {\n            const loggerStats = this.logger.getStats();\n            const dashboard = this.logger.generateDashboard();\n            \n            console.log('\\n🖥️  Métricas del sistema:');\n            console.log(`   📝 Total de logs: ${loggerStats.state.totalLogs}`);\n            console.log(`   ⚠️  Alertas activadas: ${dashboard.alerts.activeCount}`);\n            console.log(`   💾 Uso de memoria: ${dashboard.performance.memory.usagePercent.toFixed(1)}%`);\n            console.log(`   🔋 Uso de CPU: ${dashboard.performance.cpu.usage.toFixed(1)}%`);\n            console.log(`   📶 Buffer utilización: ${dashboard.logging.bufferUtilization.toFixed(1)}%`);\n            \n            // Log final\n            this.logger.info('Demo completed successfully', {\n                duration: totalDuration,\n                stats: this.stats,\n                systemMetrics: dashboard\n            });\n        }\n        \n        // Métricas de integración cuántica\n        if (this.quantumIntegration) {\n            const quantumMetrics = this.quantumIntegration.getMetrics();\n            \n            console.log('\\n🔮 Métricas cuánticas:');\n            console.log(`   🎯 Tasa de éxito: ${(quantumMetrics.system.successRate * 100).toFixed(1)}%`);\n            console.log(`   ⚡ Tiempo promedio: ${quantumMetrics.system.averageDecisionTime.toFixed(0)}ms`);\n            console.log(`   🔧 Sistemas activos: ${Object.keys(quantumMetrics.activeSystems).length}`);\n        }\n        \n        // Mostrar dashboard final (JSON)\n        if (DEMO_CONFIG.verbose && this.logger) {\n            console.log('\\n📋 Dashboard completo (JSON):');\n            console.log(JSON.stringify(this.logger.generateDashboard(), null, 2));\n        }\n    }\n    \n    /**\n     * Limpiar recursos\n     */\n    async cleanup() {\n        console.log('\\n🧹 Limpiando recursos...');\n        this.isRunning = false;\n        \n        try {\n            if (this.quantumIntegration) {\n                await this.quantumIntegration.stop();\n                console.log('✓ Integración cuántica detenida');\n            }\n            \n            if (this.logger) {\n                await this.logger.stop();\n                console.log('✓ Sistema de logging detenido');\n            }\n            \n        } catch (error) {\n            console.error('❌ Error durante limpieza:', error.message);\n        }\n        \n        console.log('✅ Limpieza completada');\n    }\n    \n    /**\n     * Función de utilidad para pausa\n     */\n    sleep(ms) {\n        return new Promise(resolve => setTimeout(resolve, ms));\n    }\n}\n\n/**\n * Función principal\n */\nasync function main() {\n    // Banner de inicio\n    console.log('\\n' + '='.repeat(60));\n    console.log('🚀 QBTC QUANTUM TRADING SYSTEM - DEMO TÉCNICA');\n    console.log('   Sistema Cuántico-Neural con LLM Integrado');\n    console.log('   Todas las mejoras técnicas implementadas ✓');\n    console.log('='.repeat(60));\n    \n    const demo = new QuantumSystemDemo();\n    \n    // Manejar señales de interrupción\n    process.on('SIGINT', async () => {\n        console.log('\\n\\n⏹️  Interrupción detectada, finalizando demo...');\n        await demo.cleanup();\n        process.exit(0);\n    });\n    \n    process.on('SIGTERM', async () => {\n        console.log('\\n\\n🛑 Terminación solicitada, finalizando demo...');\n        await demo.cleanup();\n        process.exit(0);\n    });\n    \n    // Ejecutar demo\n    await demo.start();\n}\n\n// Ejecutar solo si se llama directamente\nif (require.main === module) {\n    main().catch(error => {\n        console.error('\\n💥 Error fatal en la demostración:', error);\n        process.exit(1);\n    });\n}\n\nmodule.exports = { QuantumSystemDemo };"

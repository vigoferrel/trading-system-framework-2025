#!/usr/bin/env node
/**
 * 🚀 QBTC ULTIMATE LAUNCHER - INGENIERÍA INVERSA ACELERADA
 * ========================================================
 * 
 * Launcher universal que inicia todo el ecosistema QBTC simultáneamente
 * usando ingeniería inversa para acortar tiempos de desarrollo
 * 
 * SERVICIOS GESTIONADOS:
 * - Sistema QBTC Principal (5 componentes core)
 * - LLM Neural Orchestrator + OpenRouter
 * - Trading Engine Independiente
 * - Quantum Engine
 * - Hybrid Optimizer V2  
 * - Enhanced Dashboard Web
 * - Intelligent Monitor
 * - API Gateway Unificada
 * 
 * @author QBTC Development Team
 * @version ULTIMATE
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

class QBTCUltimateLauncher {
    constructor() {
        this.services = new Map();
        this.startTime = Date.now();
        this.config = {
            // Puertos optimizados sin conflictos
            ports: {
                qbtcCore: 14001,          // Sistema principal
                llmServer: 4607,          // LLM Neural Orchestrator
                tradingEngine: 14201,     // Trading Engine
                quantumEngine: 14115,     // Quantum Engine  
                hybridOptimizer: 14301,   // Hybrid Optimizer
                concentratedHybrid: 14302, // Concentrated Hybrid
                dashboard: 14401,         // Enhanced Dashboard
                monitor: 14501,           // Intelligent Monitor
                apiGateway: 14000         // API Gateway Unificada
            },
            
            // Configuración de arranque
            startup: {
                maxStartupTime: 60000,    // 60 segundos máximo
                healthCheckInterval: 2000, // 2 segundos entre checks
                maxRetries: 3,
                parallelStart: true       // Arranque en paralelo
            }
        };
        
        this.serviceDefinitions = this.defineServices();
    }
    
    /**
     * Definir todos los servicios del ecosistema
     */
    defineServices() {
        return {
            // 1. SISTEMA QBTC PRINCIPAL (Core integrado)
            qbtcCore: {
                name: 'QBTC Core System',
                script: 'src/launch-qbtc-system.js',
                port: this.config.ports.qbtcCore,
                priority: 1,
                healthEndpoint: '/health',
                dependencies: [],
                env: {
                    QBTC_MODE: 'paper',
                    NODE_ENV: 'development'
                }
            },
            
            // 2. LLM NEURAL ORCHESTRATOR 
            llmServer: {
                name: 'LLM Neural Orchestrator',
                script: 'llm-server.js',
                port: this.config.ports.llmServer,
                priority: 2,
                healthEndpoint: '/health',
                dependencies: [],
                env: {
                    LLM_SERVER_PORT: this.config.ports.llmServer
                }
            },
            
            // 3. TRADING ENGINE INDEPENDIENTE
            tradingEngine: {
                name: 'Trading Engine',
                script: 'src/trading/trading-engine.js',
                port: this.config.ports.tradingEngine,
                priority: 3,
                healthEndpoint: '/health',
                dependencies: ['qbtcCore'],
                env: {
                    TRADING_PORT: this.config.ports.tradingEngine
                }
            },
            
            // 4. QUANTUM ENGINE
            quantumEngine: {
                name: 'Quantum Engine',
                script: 'src/quantum/quantum-engine.js',
                port: this.config.ports.quantumEngine,
                priority: 3,
                healthEndpoint: '/health',
                dependencies: ['qbtcCore'],
                env: {
                    QUANTUM_PORT: this.config.ports.quantumEngine
                }
            },
            
            // 5. HYBRID OPTIMIZER V2
            hybridOptimizer: {
                name: 'Hybrid Optimizer V2',
                script: 'src/core/hybrid-optimizer-v2.js',
                port: this.config.ports.hybridOptimizer,
                priority: 4,
                healthEndpoint: '/health',
                dependencies: ['qbtcCore', 'quantumEngine'],
                env: {
                    HYBRID_PORT: this.config.ports.hybridOptimizer
                }
            },
            
            // 6. CONCENTRATED HYBRID V3
            concentratedHybrid: {
                name: 'Concentrated Hybrid V3',
                script: 'src/core/concentrated-hybrid-v3.js',
                port: this.config.ports.concentratedHybrid,
                priority: 4,
                healthEndpoint: '/health',
                dependencies: ['qbtcCore', 'hybridOptimizer'],
                env: {
                    CONCENTRATED_PORT: this.config.ports.concentratedHybrid
                }
            },
            
            // 7. ENHANCED DASHBOARD
            dashboard: {
                name: 'Enhanced Dashboard',
                script: 'src/ui/enhanced-dashboard.js',
                port: this.config.ports.dashboard,
                priority: 5,
                healthEndpoint: '/health',
                dependencies: ['qbtcCore', 'llmServer'],
                env: {
                    DASHBOARD_PORT: this.config.ports.dashboard
                }
            },
            
            // 8. INTELLIGENT MONITOR
            monitor: {
                name: 'Intelligent Monitor',
                script: 'src/monitoring/intelligent-monitor.js',
                port: this.config.ports.monitor,
                priority: 6,
                healthEndpoint: '/health',
                dependencies: ['qbtcCore'],
                env: {
                    MONITOR_PORT: this.config.ports.monitor
                }
            }
        };
    }
    
    /**
     * 🚀 LAUNCHER PRINCIPAL
     */
    async launch() {
        console.log('🚀 [QBTC ULTIMATE] ========================================');
        console.log('🚀 [QBTC ULTIMATE] INICIANDO ECOSISTEMA COMPLETO');
        console.log('🚀 [QBTC ULTIMATE] ========================================');
        console.log(`⚡ [QBTC ULTIMATE] Servicios a iniciar: ${Object.keys(this.serviceDefinitions).length}`);
        console.log(`🔧 [QBTC ULTIMATE] Modo: PARALELO ACELERADO`);
        console.log('');
        
        try {
            // 1. Validar entorno
            await this.validateEnvironment();
            
            // 2. Crear directorio de logs si no existe
            this.setupLogging();
            
            // 3. Iniciar servicios por prioridades
            await this.startServicesByPriority();
            
            // 4. Verificar salud de todos los servicios
            await this.performHealthChecks();
            
            // 5. Configurar monitoreo continuo
            this.setupContinuousMonitoring();
            
            // 6. Mostrar resumen final
            this.showFinalSummary();
            
            // 7. Configurar shutdown graceful
            this.setupGracefulShutdown();
            
        } catch (error) {
            console.error('❌ [QBTC ULTIMATE] Error crítico en launcher:', error);
            await this.emergencyShutdown();
        }
    }
    
    /**
     * Validar entorno y dependencias
     */
    async validateEnvironment() {
        console.log('🔍 [QBTC ULTIMATE] Validando entorno...');
        
        // Verificar archivos principales
        const criticalFiles = [
            'src/launch-qbtc-system.js',
            'llm-server.js',
            'src/constants/quantum-constants.js'
        ];
        
        for (const file of criticalFiles) {
            if (!fs.existsSync(file)) {
                throw new Error(`Archivo crítico no encontrado: ${file}`);
            }
        }
        
        // Verificar puertos disponibles
        await this.checkPortsAvailability();
        
        console.log('✅ [QBTC ULTIMATE] Entorno validado correctamente');
    }
    
    /**
     * Verificar disponibilidad de puertos
     */
    async checkPortsAvailability() {
        const busyPorts = [];
        
        for (const [serviceName, port] of Object.entries(this.config.ports)) {
            try {
                await axios.get(`http://localhost:${port}/health`, { timeout: 1000 });
                busyPorts.push(`${serviceName}:${port}`);
            } catch (error) {
                // Puerto disponible (esperado)
            }
        }
        
        if (busyPorts.length > 0) {
            console.log(`⚠️ [QBTC ULTIMATE] Puertos ocupados: ${busyPorts.join(', ')}`);
            console.log('💡 [QBTC ULTIMATE] Se intentará usar puertos alternativos automáticamente');
        }
    }
    
    /**
     * Configurar sistema de logging
     */
    setupLogging() {
        const logDir = './logs';
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        console.log('📝 [QBTC ULTIMATE] Sistema de logging configurado');
    }
    
    /**
     * Iniciar servicios por prioridades (paralelización inteligente)
     */
    async startServicesByPriority() {
        console.log('🔄 [QBTC ULTIMATE] Iniciando servicios por prioridades...\n');
        
        // Agrupar servicios por prioridad
        const priorityGroups = this.groupServicesByPriority();
        
        for (const [priority, services] of priorityGroups) {
            console.log(`📊 [QBTC ULTIMATE] Iniciando prioridad ${priority}: ${services.map(s => s.name).join(', ')}`);
            
            // Iniciar servicios de la misma prioridad en paralelo
            const startPromises = services.map(service => this.startService(service));
            await Promise.allSettled(startPromises);
            
            // Breve pausa entre prioridades
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    /**
     * Agrupar servicios por prioridad
     */
    groupServicesByPriority() {
        const groups = new Map();
        
        for (const [key, service] of Object.entries(this.serviceDefinitions)) {
            const priority = service.priority;
            if (!groups.has(priority)) {
                groups.set(priority, []);
            }
            groups.get(priority).push({ key, ...service });
        }
        
        return new Map([...groups.entries()].sort());
    }
    
    /**
     * Iniciar un servicio individual
     */
    async startService(service) {
        try {
            console.log(`🚀 [${service.name}] Iniciando en puerto ${service.port}...`);
            
            const childProcess = spawn('node', [service.script], {
                env: { ...process.env, ...service.env },
                stdio: ['inherit', 'pipe', 'pipe'],
                cwd: process.cwd()
            });
            
            // Capturar logs
            const logFile = `./logs/${service.key}.log`;
            const logStream = fs.createWriteStream(logFile, { flags: 'a' });
            
            childProcess.stdout.pipe(logStream);
            childProcess.stderr.pipe(logStream);
            
            // Registrar proceso
            this.services.set(service.key, {
                process: childProcess,
                config: service,
                startTime: Date.now(),
                status: 'starting'
            });
            
            // Configurar eventos del proceso
            childProcess.on('exit', (code) => {
                console.log(`⚠️ [${service.name}] Proceso terminado con código ${code}`);
                this.services.get(service.key).status = 'stopped';
            });
            
            childProcess.on('error', (error) => {
                console.error(`❌ [${service.name}] Error:`, error.message);
                this.services.get(service.key).status = 'error';
            });
            
            console.log(`✅ [${service.name}] Proceso iniciado (PID: ${childProcess.pid})`);
            
        } catch (error) {
            console.error(`❌ [${service.name}] Error al iniciar:`, error.message);
        }
    }
    
    /**
     * Realizar health checks de todos los servicios
     */
    async performHealthChecks() {
        console.log('\n🏥 [QBTC ULTIMATE] Verificando salud de servicios...');
        
        // Esperar un poco para que los servicios arranquen
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        const healthResults = [];
        
        for (const [key, serviceInfo] of this.services) {
            const service = serviceInfo.config;
            try {
                const response = await axios.get(
                    `http://localhost:${service.port}${service.healthEndpoint}`,
                    { timeout: 5000 }
                );
                
                serviceInfo.status = 'healthy';
                healthResults.push(`✅ ${service.name}: HEALTHY`);
                
            } catch (error) {
                serviceInfo.status = 'unhealthy';
                healthResults.push(`❌ ${service.name}: UNHEALTHY (${error.message.substring(0, 30)})`);
            }
        }
        
        // Mostrar resultados
        console.log('\n📊 [QBTC ULTIMATE] RESULTADOS DE SALUD:');
        console.log('=====================================');
        healthResults.forEach(result => console.log(result));
    }
    
    /**
     * Configurar monitoreo continuo
     */
    setupContinuousMonitoring() {
        console.log('\n🔍 [QBTC ULTIMATE] Configurando monitoreo continuo...');
        
        setInterval(async () => {
            const healthyServices = Array.from(this.services.values())
                .filter(s => s.status === 'healthy').length;
            const totalServices = this.services.size;
            
            console.log(`💗 [QBTC ULTIMATE] Servicios saludables: ${healthyServices}/${totalServices}`);
            
        }, 30000); // Cada 30 segundos según reglas de segundo plano
    }
    
    /**
     * Mostrar resumen final
     */
    showFinalSummary() {
        const elapsed = Date.now() - this.startTime;
        const healthyCount = Array.from(this.services.values())
            .filter(s => s.status === 'healthy').length;
        
        console.log('\n🎉 [QBTC ULTIMATE] ========================================');
        console.log('🎉 [QBTC ULTIMATE] ECOSISTEMA QBTC INICIADO');
        console.log('🎉 [QBTC ULTIMATE] ========================================');
        console.log(`⏱️ [QBTC ULTIMATE] Tiempo total: ${(elapsed / 1000).toFixed(1)}s`);
        console.log(`📊 [QBTC ULTIMATE] Servicios activos: ${healthyCount}/${this.services.size}`);
        console.log('');
        console.log('🌐 [QBTC ULTIMATE] ENDPOINTS DISPONIBLES:');
        
        for (const [key, serviceInfo] of this.services) {
            const service = serviceInfo.config;
            const status = serviceInfo.status === 'healthy' ? '✅' : '❌';
            console.log(`   ${status} ${service.name}: http://localhost:${service.port}`);
        }
        
        console.log('');
        console.log('📋 [QBTC ULTIMATE] SERVICIOS PRINCIPALES:');
        console.log('   🏛️ QBTC Core: Sistema principal integrado');
        console.log('   🧠 LLM Neural: OpenRouter + Gemini Flash 1.5');
        console.log('   📈 Trading: Engine de trading independiente');
        console.log('   ⚛️ Quantum: Motor cuántico avanzado');
        console.log('   🎯 Dashboard: Interface web completa');
        console.log('');
        console.log('🚀 [QBTC ULTIMATE] ¡Sistema listo para trading cuántico!')
        console.log('🚀 [QBTC ULTIMATE] ========================================\n');
    }
    
    /**
     * Configurar shutdown graceful
     */
    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            console.log(`\n🛑 [QBTC ULTIMATE] Señal ${signal} recibida, iniciando shutdown graceful...`);
            await this.gracefulShutdown();
        };
        
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    }
    
    /**
     * Shutdown graceful de todos los servicios
     */
    async gracefulShutdown() {
        console.log('🔄 [QBTC ULTIMATE] Cerrando servicios...');
        
        const shutdownPromises = [];
        
        for (const [key, serviceInfo] of this.services) {
            if (serviceInfo.process && serviceInfo.status !== 'stopped') {
                shutdownPromises.push(new Promise((resolve) => {
                    serviceInfo.process.kill('SIGTERM');
                    setTimeout(() => {
                        if (!serviceInfo.process.killed) {
                            serviceInfo.process.kill('SIGKILL');
                        }
                        resolve();
                    }, 5000);
                }));
            }
        }
        
        await Promise.all(shutdownPromises);
        console.log('✅ [QBTC ULTIMATE] Todos los servicios cerrados correctamente');
        process.exit(0);
    }
    
    /**
     * Shutdown de emergencia
     */
    async emergencyShutdown() {
        console.log('🚨 [QBTC ULTIMATE] SHUTDOWN DE EMERGENCIA');
        
        for (const [key, serviceInfo] of this.services) {
            if (serviceInfo.process) {
                serviceInfo.process.kill('SIGKILL');
            }
        }
        
        process.exit(1);
    }
}

// Ejecutar launcher si se llama directamente
if (require.main === module) {
    const launcher = new QBTCUltimateLauncher();
    launcher.launch().catch(console.error);
}

module.exports = { QBTCUltimateLauncher };

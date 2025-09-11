/**
 * QBTC θ-aware Master Launcher
 * 
 * Launcher maestro que orquesta todos los componentes del sistema θ-aware
 * Incluye integración completa del Exchange Gateway, Dashboard y sistema temporal
 * 
 * Componentes integrados:
 * - Real Exchange Gateway (múltiples exchanges)
 * - Central Control Dashboard (web + WebSocket)
 * - Position Manager θ-aware  
 * - Temporal Prime Ladder System
 * - Master Control Hub
 * - Quantum Event Orchestrator
 * - LLM Neural Orchestrator
 * - Kernel RNG y Safe Math
 * - secure Logger
 */

const path = require('path');
const { kernelRNG } = require('./utils/kernel-rng');
const safeMath = require('./utils/safe-math');
const { secureLogger } = require('./utils/secure-logger');

// Componentes principales del sistema
const RealExchangeGateway = require('./exchange/real-exchange-gateway');
const CentralControlDashboard = require('./dashboard/central-control-dashboard');
const PositionManager = require('./core/position-manager');
const { TemporalPrimeLadder } = require('./temporal-prime-ladder-fixed');
const { QuantumEventOrchestrator } = require('./core/quantum-event-orchestrator');

class ThetaAwareMasterLauncher {
    constructor(config = {}) {
        this.logger = new secureLogger('θ-MasterLauncher');
        this.config = {
            environment: process.env.NODE_ENV || 'development',
            paperTrading: process.env.PAPER_TRADING !== 'false',
            autoStart: config.autoStart !== false,
            shutdownTimeout: config.shutdownTimeout || 30000,
            healthCheckInterval: config.healthCheckInterval || 60000,
            ...config
        };

        // Estado del sistema
        this.systemState = {
            isRunning: false,
            startTime: null,
            components: new Map(),
            healthStatus: new Map(),
            lastHealthCheck: null,
            shutdownInProgress: false
        };

        // Componentes del sistema
        this.components = {};
        
        // Configuración de componentes
        this.componentConfig = {
            exchangeGateway: {
                name: 'Exchange Gateway',
                priority: 1,
                required: true,
                healthEndpoint: 'getStatus'
            },
            positionManager: {
                name: 'Position Manager θ-aware',
                priority: 2,
                required: true,
                healthEndpoint: 'getSystemStatus'
            },
            temporalEngine: {
                name: 'Temporal Prime Ladder',
                priority: 3,
                required: true,
                healthEndpoint: 'getMetrics'
            },
            quantumOrchestrator: {
                name: 'Quantum Event Orchestrator',
                priority: 4,
                required: true,
                healthEndpoint: 'getStatus'
            },
            dashboard: {
                name: 'Central Control Dashboard',
                priority: 5,
                required: false,
                healthEndpoint: 'getStatistics'
            }
        };

        this.logger.info('🚀 Inicializando θ-aware Master Launcher...');
        
        // Configurar manejo de señales del sistema
        this.setupSignalHandlers();
    }

    /**
     * Inicializar y lanzar todo el sistema
     */
    async launch() {
        try {
            this.logger.info('🎯 Iniciando lanzamiento del sistema QBTC θ-aware...');
            this.systemState.startTime = Date.now();

            // Mostrar información del sistema
            this.displaySystemInfo();
            
            // Validar entorno y dependencias
            await this.validateEnvironment();
            
            // Inicializar componentes en orden de prioridad
            await this.initializeComponents();
            
            // Conectar componentes entre sí
            await this.interconnectComponents();
            
            // Iniciar monitoreo de salud
            this.startHealthMonitoring();
            
            // Marcar sistema como activo
            this.systemState.isRunning = true;
            
            // Mostrar estado final
            this.displayLaunchSummary();
            
            this.logger.info('✅ Sistema QBTC θ-aware lanzado exitosamente');
            
        } catch (error) {
            this.logger.error(`❌ Error durante el lanzamiento: ${error.message}`);
            await this.handleLaunchFailure(error);
            throw error;
        }
    }

    /**
     * Mostrar información del sistema
     */
    displaySystemInfo() {
        this.logger.info('');
        this.logger.info('╔═══════════════════════════════════════════════╗');
        this.logger.info('║        QBTC θ-aware Trading System           ║');
        this.logger.info('║     Quantum-Based Trading confidence      ║');
        this.logger.info('╚═══════════════════════════════════════════════╝');
        this.logger.info('');
        this.logger.info(`🌐 Environment: ${this.config.environment.toUpperCase()}`);
        this.logger.info(`📊 Paper Trading: ${this.config.paperTrading ? 'ENABLED' : 'DISABLED'}`);
        this.logger.info(`🔢 Kernel RNG: ACTIVE (Seed: ${kernelRNG.seed || 'Dynamic'})`);
        this.logger.info(`⚡ Safe Math: ENABLED`);
        this.logger.info(`📝 secure Logging: ACTIVE`);
        this.logger.info('');
    }

    /**
     * Validar entorno y dependencias
     */
    async validateEnvironment() {
        this.logger.info('🔍 Validando entorno del sistema...');
        
        const validations = [
            {
                name: 'Node.js Version',
                check: () => {
                    const version = process.version;
                    const major = parseInt(version.split('.')[0].substring(1));
                    return major >= 16;
                },
                message: 'Node.js 16+ requerido'
            },
            {
                name: 'Memory Available',
                check: () => {
                    const totalMem = require('os').totalmem();
                    return totalMem > 1024 * 1024 * 1024; // 1GB mínimo
                },
                message: 'Mínimo 1GB RAM requerido'
            },
            {
                name: 'Kernel RNG',
                check: () => {
                    return typeof kernelRNG.nextFloat === 'function' && 
                           kernelRNG.nextFloat() !== kernelRNG.nextFloat();
                },
                message: 'Kernel RNG debe estar funcionando'
            },
            {
                name: 'Safe Math',
                check: () => {
                    return safeMath.add(1, 2) === 3 && safeMath.multiply(2, 3) === 6;
                },
                message: 'Safe Math debe estar funcionando'
            }
        ];

        for (const validation of validations) {
            try {
                const isValid = validation.check();
                if (!isValid) {
                    throw new Error(validation.message);
                }
                this.logger.info(`  ✅ ${validation.name}: OK`);
            } catch (error) {
                this.logger.error(`  ❌ ${validation.name}: ${error.message}`);
                throw new Error(`Environment validation failed: ${validation.name}`);
            }
        }

        this.logger.info('✅ Validación de entorno completada');
    }

    /**
     * Inicializar componentes en orden de prioridad
     */
    async initializeComponents() {
        this.logger.info('🔧 Inicializando componentes del sistema...');
        
        // Ordenar componentes por prioridad
        const sortedComponents = Object.entries(this.componentConfig)
            .sort(([,a], [,b]) => a.priority - b.priority);

        for (const [componentKey, componentConfig] of sortedComponents) {
            try {
                this.logger.info(`📦 Inicializando ${componentConfig.name}...`);
                
                const component = await this.initializeComponent(componentKey, componentConfig);
                this.components[componentKey] = component;
                this.systemState.components.set(componentKey, {
                    instance: component,
                    config: componentConfig,
                    status: 'initialized',
                    initTime: Date.now()
                });
                
                this.logger.info(`  ✅ ${componentConfig.name} inicializado correctamente`);
                
            } catch (error) {
                this.logger.error(`  ❌ Error inicializando ${componentConfig.name}: ${error.message}`);
                
                if (componentConfig.required) {
                    throw new Error(`Required component ${componentConfig.name} failed to initialize`);
                } else {
                    this.logger.warn(`  ⚠️ Componente opcional ${componentConfig.name} omitido`);
                }
            }
        }

        this.logger.info('✅ Inicialización de componentes completada');
    }

    /**
     * Inicializar componente específico
     */
    async initializeComponent(componentKey, componentConfig) {
        switch (componentKey) {
            case 'exchangeGateway':
                return await this.initializeExchangeGateway();
                
            case 'positionManager':
                return await this.initializePositionManager();
                
            case 'temporalEngine':
                return await this.initializeTemporalEngine();
                
            case 'quantumOrchestrator':
                return await this.initializeQuantumOrchestrator();
                
            case 'dashboard':
                return await this.initializeDashboard();
                
            default:
                throw new Error(`Unknown component: ${componentKey}`);
        }
    }

    /**
     * Inicializar Exchange Gateway
     */
    async initializeExchangeGateway() {
        const gateway = new RealExchangeGateway({
            paperTrading: this.config.paperTrading,
            environment: this.config.environment
        });
        
        // Esperar inicialización completa
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return gateway;
    }

    /**
     * Inicializar Position Manager
     */
    async initializePositionManager() {
        const positionManager = new PositionManager({
            maxPositions: 100,
            riskParameters: {
                maxRiskPerPosition: 0.02,
                maxTotalRisk: 0.1,
                stopLossThreshold: 0.05
            }
        });
        
        return positionManager;
    }

    /**
     * Inicializar Temporal Engine
     */
    async initializeTemporalEngine() {
        const temporalEngine = new TemporalPrimeLadder({
            autoProcessRolls: true,
            autoRebalance: true,
            rebalanceInterval: 3600000, // 1 hora
            primeHours: [7, 11, 13, 17, 19, 23]
        });
        
        return temporalEngine;
    }

    /**
     * Inicializar Quantum Orchestrator
     */
    async initializeQuantumOrchestrator() {
        const orchestrator = new QuantumEventOrchestrator({
            maxListeners: 100,
            queueSize: 1000,
            enableMetrics: true,
            enableLogging: true
        });
        
        await orchestrator.start();
        return orchestrator;
    }

    /**
     * Inicializar Dashboard
     */
    async initializeDashboard() {
        const dashboard = new CentralControlDashboard({
            port: 8080,
            wsPort: 8081,
            updateInterval: 5000
        });
        
        return dashboard;
    }

    /**
     * Conectar componentes entre sí
     */
    async interconnectComponents() {
        this.logger.info('🔗 Conectando componentes del sistema...');
        
        // Conectar Dashboard con otros componentes
        if (this.components.dashboard) {
            this.components.dashboard.connectSystemComponents({
                exchangeGateway: this.components.exchangeGateway,
                positionManager: this.components.positionManager,
                temporalEngine: this.components.temporalEngine,
                quantumOrchestrator: this.components.quantumOrchestrator
            });
            
            this.logger.info('  ✅ Dashboard conectado a componentes');
        }
        
        // Configurar eventos entre Position Manager y Temporal Engine
        if (this.components.positionManager && this.components.temporalEngine) {
            // El Position Manager puede usar el Temporal Engine para decisiones θ-aware
            if (typeof this.components.positionManager.setTemporalEngine === 'function') {
                this.components.positionManager.setTemporalEngine(this.components.temporalEngine);
                this.logger.info('  ✅ Position Manager conectado a Temporal Engine');
            } else {
                this.logger.debug('  ℹ️ Position Manager no implementa setTemporalEngine, omitiendo conexión');
            }
        }
        
        // Configurar integración Quantum Orchestrator con Exchange Gateway
        if (this.components.quantumOrchestrator && this.components.exchangeGateway) {
            this.setupQuantumExchangeIntegration();
            this.logger.info('  ✅ Quantum Orchestrator conectado a Exchange Gateway');
        }
        
        this.logger.info('✅ Interconexión de componentes completada');
    }

    /**
     * Configurar integración Quantum-Exchange
     */
    setupQuantumExchangeIntegration() {
        const orchestrator = this.components.quantumOrchestrator;
        const gateway = this.components.exchangeGateway;
        
        // Escuchar eventos algorithmics para ejecutar órdenes
        orchestrator.on('quantumSignal', async (data) => {
            if (data.signal && data.signal.action === 'execute_order') {
                try {
                    const result = await gateway.executeOrder(data.signal.order);
                    this.logger.debug(`🔄 Orden cuántica ejecutada: ${result.success ? 'SUCCESS' : 'FAILED'}`);
                } catch (error) {
                    this.logger.error(`❌ Error ejecutando orden cuántica: ${error.message}`);
                }
            }
        });
        
        // Emitir eventos de estado del gateway
        setInterval(() => {
            const gatewayStatus = gateway.getStatus();
            orchestrator.emit('exchangeStatus', gatewayStatus);
        }, 30000); // Cada 30 segundos
    }

    /**
     * Iniciar monitoreo de salud
     */
    startHealthMonitoring() {
        this.logger.info('💓 Iniciando monitoreo de salud del sistema...');
        
        setInterval(async () => {
            await this.performHealthCheck();
        }, this.config.healthCheckInterval);
        
        // Health check inicial
        setTimeout(() => this.performHealthCheck(), 5000);
        
        this.logger.info('✅ Monitoreo de salud iniciado');
    }

    /**
     * Realizar verificación de salud de todos los componentes
     */
    async performHealthCheck() {
        try {
            const healthResults = new Map();
            
            for (const [componentKey, componentData] of this.systemState.components) {
                try {
                    const component = componentData.instance;
                    const config = componentData.config;
                    
                    let healthStatus = { status: 'unknown', timestamp: Date.now() };
                    
                    // Verificar salud según el endpoint configurado
                    if (component[config.healthEndpoint]) {
                        const result = await component[config.healthEndpoint]();
                        healthStatus = {
                            status: 'healthy',
                            data: result,
                            timestamp: Date.now()
                        };
                    } else {
                        // Verificación básica de que el componente existe
                        healthStatus = {
                            status: component ? 'healthy' : 'unhealthy',
                            timestamp: Date.now()
                        };
                    }
                    
                    healthResults.set(componentKey, healthStatus);
                    
                } catch (error) {
                    healthResults.set(componentKey, {
                        status: 'unhealthy',
                        error: error.message,
                        timestamp: Date.now()
                    });
                    
                    this.logger.warn(`⚠️ Health check falló para ${componentKey}: ${error.message}`);
                }
            }
            
            this.systemState.healthStatus = healthResults;
            this.systemState.lastHealthCheck = Date.now();
            
            // Log resumen de salud
            const healthyCount = Array.from(healthResults.values())
                .filter(status => status.status === 'healthy').length;
            const totalCount = healthResults.size;
            
            if (healthyCount === totalCount) {
                this.logger.debug(`💚 Health check: ${healthyCount}/${totalCount} componentes saludables`);
            } else {
                this.logger.warn(`⚠️ Health check: ${healthyCount}/${totalCount} componentes saludables`);
            }
            
        } catch (error) {
            this.logger.error(`❌ Error en health check global: ${error.message}`);
        }
    }

    /**
     * Mostrar resumen del lanzamiento
     */
    displayLaunchSummary() {
        const uptime = Date.now() - this.systemState.startTime;
        const componentCount = this.systemState.components.size;
        
        this.logger.info('');
        this.logger.info('╔═══════════════════════════════════════════════╗');
        this.logger.info('║              LAUNCH SUMMARY                   ║');
        this.logger.info('╚═══════════════════════════════════════════════╝');
        this.logger.info(`🚀 Tiempo de inicialización: ${uptime}ms`);
        this.logger.info(`📦 Componentes inicializados: ${componentCount}`);
        this.logger.info(`🎯 Estado del sistema: ${this.systemState.isRunning ? 'ACTIVO' : 'INACTIVO'}`);
        this.logger.info('');
        
        // Mostrar componentes y sus URLs/puertos
        if (this.components.dashboard) {
            this.logger.info('🌐 Dashboard Web: http://localhost:8080');
            this.logger.info('📡 WebSocket: ws://localhost:8081');
        }
        
        if (this.components.exchangeGateway) {
            const status = this.components.exchangeGateway.getStatus();
            const exchangeCount = Object.keys(status.exchanges || {}).length;
            this.logger.info(`💱 Exchanges conectados: ${exchangeCount}`);
        }
        
        this.logger.info('');
        this.logger.info('🎉 Sistema θ-aware listo para trading');
        this.logger.info('');
    }

    /**
     * Manejar falla en el lanzamiento
     */
    async handleLaunchFailure(error) {
        this.logger.error('💥 Falla crítica durante el lanzamiento');
        this.logger.error(`Error: ${error.message}`);
        this.logger.error(`Stack: ${error.stack}`);
        
        // Intentar cleanup de componentes ya iniciados
        await this.cleanup();
        
        process.exit(1);
    }

    /**
     * Configurar manejo de señales del sistema
     */
    setupSignalHandlers() {
        // Manejo graceful de shutdown
        const signals = ['SIGINT', 'SIGTERM', 'SIGUSR2'];
        
        signals.forEach(signal => {
            process.on(signal, async () => {
                this.logger.info(`📡 Señal ${signal} recibida, iniciando shutdown graceful...`);
                await this.gracefulShutdown();
                process.exit(0);
            });
        });
        
        // Manejo de errores no capturados
        process.on('uncaughtException', async (error) => {
            this.logger.error('💥 Uncaught Exception:', error);
            await this.gracefulShutdown();
            process.exit(1);
        });
        
        process.on('unhandledRejection', async (reason, promise) => {
            this.logger.error('💥 Unhandled Promise Rejection:', reason);
            await this.gracefulShutdown();
            process.exit(1);
        });
    }

    /**
     * Shutdown graceful del sistema
     */
    async gracefulShutdown() {
        if (this.systemState.shutdownInProgress) {
            this.logger.warn('⚠️ Shutdown ya en progreso...');
            return;
        }
        
        this.systemState.shutdownInProgress = true;
        this.logger.info('🛑 Iniciando shutdown graceful del sistema θ-aware...');
        
        try {
            // Timeout de emergencia
            const emergencyTimeout = setTimeout(() => {
                this.logger.error('⏰ Timeout de emergency shutdown');
                process.exit(1);
            }, this.config.shutdownTimeout);
            
            await this.cleanup();
            
            clearTimeout(emergencyTimeout);
            this.logger.info('✅ Shutdown graceful completado');
            
        } catch (error) {
            this.logger.error(`❌ Error durante shutdown: ${error.message}`);
        }
    }

    /**
     * Cleanup de todos los componentes
     */
    async cleanup() {
        this.logger.info('🧹 Iniciando cleanup del sistema...');
        
        const cleanupPromises = [];
        
        // Cleanup de componentes en orden inverso de prioridad
        const sortedComponents = Array.from(this.systemState.components.entries())
            .sort(([,a], [,b]) => b.config.priority - a.config.priority);
        
        for (const [componentKey, componentData] of sortedComponents) {
            if (componentData.instance && typeof componentData.instance.cleanup === 'function') {
                this.logger.info(`  🧹 Limpiando ${componentData.config.name}...`);
                
                const cleanupPromise = componentData.instance.cleanup()
                    .then(() => {
                        this.logger.info(`    ✅ ${componentData.config.name} limpiado`);
                    })
                    .catch(error => {
                        this.logger.error(`    ❌ Error limpiando ${componentData.config.name}: ${error.message}`);
                    });
                    
                cleanupPromises.push(cleanupPromise);
            }
        }
        
        // Esperar a que todos los cleanups terminen
        await Promise.allSettled(cleanupPromises);
        
        // Limpiar estado del sistema
        this.systemState.isRunning = false;
        this.systemState.components.clear();
        this.systemState.healthStatus.clear();
        
        this.logger.info('✅ Cleanup del sistema completado');
    }

    /**
     * Obtener estado del sistema
     */
    getSystemStatus() {
        return {
            isRunning: this.systemState.isRunning,
            startTime: this.systemState.startTime,
            uptime: this.systemState.startTime ? Date.now() - this.systemState.startTime : 0,
            environment: this.config.environment,
            paperTrading: this.config.paperTrading,
            componentCount: this.systemState.components.size,
            healthStatus: Object.fromEntries(this.systemState.healthStatus),
            lastHealthCheck: this.systemState.lastHealthCheck
        };
    }

    /**
     * Obtener estadísticas detalladas
     */
    getDetailedStatistics() {
        const components = {};
        for (const [key, data] of this.systemState.components) {
            components[key] = {
                name: data.config.name,
                priority: data.config.priority,
                required: data.config.required,
                status: data.status,
                initTime: data.initTime,
                uptime: Date.now() - data.initTime
            };
        }
        
        return {
            ...this.getSystemStatus(),
            components,
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage(),
            nodeVersion: process.version,
            platform: process.platform
        };
    }
}

// Auto-lanzar si se ejecuta directamente
if (require.main === module) {
    const launcher = new ThetaAwareMasterLauncher({
        autoStart: true,
        environment: process.env.NODE_ENV || 'development',
        paperTrading: process.env.PAPER_TRADING !== 'false'
    });
    
    launcher.launch().catch(error => {
        console.error('💥 Error fatal en el lanzamiento:', error);
        process.exit(1);
    });
}

module.exports = ThetaAwareMasterLauncher;


#!/usr/bin/env node
/**
 * 🚀 QBTC SYSTEM LAUNCHER - INTEGRATED QUANTUM TRADING SYSTEM
 * Script principal para iniciar todo el ecosistema QBTC con todos los componentes integrados
 * 
 * @author QBTC Development Team
 * @version 4.0
 * @since 2025-01-04
 */

const fs = require('fs');
const path = require('path');
const Logger = require('./logging/secure-logger');

// Importar componentes principales
const MasterControlHub = require('./core/master-control-hub');
const LLMNeuralOrchestrator = require('./core/llm-neural-orchestrator');
const ExchangeGateway = require('./core/exchange-gateway');
const PositionManager = require('./core/position-manager');
const { QuantumEventOrchestrator } = require('./core/quantum-event-orchestrator');

/**
 * Launcher principal del sistema QBTC
 */
class QBTCSystemLauncher {
    constructor(config = {}) {
        // Configuración del sistema
        this.config = {
            mode: config.mode || process.env.QBTC_MODE || 'paper', // paper | live
            logLevel: config.logLevel || process.env.LOG_LEVEL || 'info',
            geminiApiKey: config.geminiApiKey || process.env.GEMINI_API_KEY,
            binanceApiKey: config.binanceApiKey || process.env.BINANCE_API_KEY,
            binanceApiSecret: config.binanceApiSecret || process.env.BINANCE_API_SECRET,
            
            // Configuraciones por modo
            paper: {
                startingCapital: 100000, // $100,000 simulado
                enableRealPrices: true,
                enablePaperExecution: true,
                testnet: true
            },
            live: {
                maxRiskPerTrade: 0.02, // 2% máximo por trade
                maxTotalRisk: 0.15, // 15% máximo total
                enableCircuitBreakers: true,
                testnet: false
            },
            
            // Puertos de servicios
            ports: {
                masterHub: 14001,
                exchangeGateway: 14204,
                positionManager: 14202,
                neuralOrchestrator: 14301,
                quantumOrchestrator: 14302
            },
            
            // Configuraciones de integración
            integration: {
                autoStartWebSocket: true,
                enableRealTimeUpdates: true,
                enablePerformanceMetrics: true,
                metricsInterval: 30000 // 30 segundos (segundo plano para métricas según reglas)
            },
            
            ...config
        };

        // Sistema de componentes
        this.components = {
            masterHub: null,
            llmOrchestrator: null,
            exchangeGateway: null,
            positionManager: null,
            quantumOrchestrator: null
        };

        // Estado del launcher
        this.state = {
            initialized: false,
            launched: false,
            componentsStarted: 0,
            totalComponents: 5,
            startTime: null,
            lastHealthCheck: null,
            errors: []
        };

        // Logger principal
        this.logger = Logger.createLogger('QBTCLauncher');

        // Validar entorno
        this.validateEnvironment();
    }

    /**
     * Validar entorno y configuración
     */
    validateEnvironment() {
        this.logger.info('🔍 Validando entorno del sistema QBTC...');

        // Verificar variables de entorno según el modo
        if (this.config.mode === 'live') {
            if (!this.config.binanceApiKey || !this.config.binanceApiSecret) {
                throw new Error('❌ MODO LIVE: BINANCE_API_KEY y BINANCE_API_SECRET son requeridos');
            }
        }

        if (this.config.geminiApiKey) {
            this.logger.info('✅ Gemini API Key configurada - LLM Neural Orchestrator disponible');
        } else {
            this.logger.warn('⚠️ Gemini API Key no configurada - LLM funcionará en modo fallback');
        }

        // Verificar dependencias críticas
        this.validateDependencies();

        this.logger.info(`✅ Entorno validado - Modo: ${this.config.mode.toUpperCase()}`);
    }

    /**
     * Validar dependencias del sistema
     */
    validateDependencies() {
        const requiredDirs = [
            './utils',
            './constants',
            './logging',
            './core'
        ];

        for (const dir of requiredDirs) {
            const fullPath = path.resolve(__dirname, dir);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`❌ Directorio requerido no encontrado: ${fullPath}`);
            }
        }

        // Verificar archivos críticos
        const requiredFiles = [
            './utils/kernel-rng.js',
            './utils/safe-math.js',
            './constants/quantum-constants.js',
            './logging/secure-logger.js'
        ];

        for (const file of requiredFiles) {
            const fullPath = path.resolve(__dirname, file);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`❌ Archivo crítico no encontrado: ${fullPath}`);
            }
        }

        this.logger.info('✅ Dependencias del sistema validadas');
    }

    /**
     * Inicializar todos los componentes del sistema
     */
    async initialize() {
        try {
            this.logger.info('🚀 Inicializando sistema QBTC...');
            this.state.startTime = Date.now();

            // 1. Inicializar Master Control Hub
            await this.initializeMasterHub();

            // 2. Inicializar Exchange Gateway
            await this.initializeExchangeGateway();

            // 3. Inicializar Position Manager
            await this.initializePositionManager();

            // 4. Inicializar LLM Neural Orchestrator
            await this.initializeLLMOrchestrator();

            // 5. Inicializar Quantum Event Orchestrator
            await this.initializeQuantumOrchestrator();

            // 6. Conectar componentes entre sí
            await this.connectComponents();

            this.state.initialized = true;
            this.logger.info(`✅ Sistema QBTC inicializado completamente - ${this.state.componentsStarted}/${this.state.totalComponents} componentes activos`);

        } catch (error) {
            this.logger.error('❌ Error inicializando sistema QBTC:', error);
            this.state.errors.push(error);
            throw error;
        }
    }

    /**
     * Inicializar Master Control Hub
     */
    async initializeMasterHub() {
        try {
            this.logger.info('🎛️ Inicializando Master Control Hub...');

            this.components.masterHub = new MasterControlHub({
                port: this.config.ports.masterHub,
                maxConcurrentOperations: this.config.mode === 'live' ? 20 : 50,
                emergencyThreshold: this.config.mode === 'live' ? 0.8 : 0.6,
                healthCheckInterval: this.config.integration.metricsInterval
            });

            // Esperar inicialización
            await new Promise((resolve, reject) => {
                this.components.masterHub.on('hub_initialized', resolve);
                this.components.masterHub.on('hub_error', reject);
                
                // Timeout de 30 segundos
                setTimeout(() => reject(new Error('Timeout inicializando Master Hub')), 30000);
            });

            this.state.componentsStarted++;
            this.logger.info('✅ Master Control Hub iniciado correctamente');

        } catch (error) {
            this.logger.error('❌ Error inicializando Master Hub:', error);
            throw error;
        }
    }

    /**
     * Inicializar Exchange Gateway
     */
    async initializeExchangeGateway() {
        try {
            this.logger.info('🔗 Inicializando Exchange Gateway...');

            const gatewayConfig = {
                apiKey: this.config.binanceApiKey,
                apiSecret: this.config.binanceApiSecret,
                testnet: this.config.mode === 'paper' || this.config.paper.testnet,
                timeout: 10000,
                retryAttempts: 3
            };

            // Solo inicializar si tenemos credenciales o estamos en paper mode
            if (this.config.mode === 'paper' || (gatewayConfig.apiKey && gatewayConfig.apiSecret)) {
                this.components.exchangeGateway = new ExchangeGateway(gatewayConfig);

                // Esperar conexión (solo si no es paper mode sin credenciales)
                if (this.config.mode === 'live' || (gatewayConfig.apiKey && gatewayConfig.apiSecret)) {
                    await new Promise((resolve, reject) => {
                        this.components.exchangeGateway.on('gateway_connected', resolve);
                        this.components.exchangeGateway.on('gateway_error', reject);
                        
                        setTimeout(() => reject(new Error('Timeout conectando Exchange Gateway')), 30000);
                    });
                }

                this.state.componentsStarted++;
                this.logger.info(`✅ Exchange Gateway iniciado - Modo: ${this.config.mode} - Testnet: ${gatewayConfig.testnet}`);
            } else {
                this.logger.warn('⚠️ Exchange Gateway no iniciado - Sin credenciales en modo paper');
                // Crear mock gateway para paper trading sin API
                this.components.exchangeGateway = this.createMockExchangeGateway();
                this.state.componentsStarted++;
            }

        } catch (error) {
            this.logger.error('❌ Error inicializando Exchange Gateway:', error);
            
            // En paper mode, continuar con mock gateway
            if (this.config.mode === 'paper') {
                this.logger.info('📝 Continuando con Mock Exchange Gateway para paper trading...');
                this.components.exchangeGateway = this.createMockExchangeGateway();
                this.state.componentsStarted++;
            } else {
                throw error;
            }
        }
    }

    /**
     * Crear Mock Exchange Gateway para paper trading
     */
    createMockExchangeGateway() {
        const EventEmitter = require('events');
        const mockGateway = new EventEmitter();
        
        // Simular métodos básicos del Exchange Gateway
        mockGateway.state = {
            connected: true,
            authenticated: true,
            wsConnected: false,
            balance: { USDT: { walletBalance: this.config.paper.startingCapital } },
            positions: new Map()
        };

        // Mock methods
        mockGateway.getSymbolPrice = async (symbol) => {
            // Simular precios realistas
            const prices = {
                'BTCUSDT': 45000 + (Math.random() - 0.5) * 2000,
                'ETHUSDT': 2800 + (Math.random() - 0.5) * 200,
                'SOLUSDT': 100 + (Math.random() - 0.5) * 10
            };
            return prices[symbol.toUpperCase()] || 100;
        };

        mockGateway.createMarketOrder = async (symbol, side, quantity, options) => {
            const price = await mockGateway.getSymbolPrice(symbol);
            return {
                orderId: `MOCK_${Date.now()}`,
                symbol,
                side,
                type: 'MARKET',
                quantity,
                price,
                avgPrice: price,
                status: 'FILLED',
                executedQty: quantity,
                timestamp: Date.now()
            };
        };

        mockGateway.getGatewayMetrics = () => ({
            connection: { connected: true, authenticated: true },
            performance: { totalRequests: 0, successRate: 1.0 },
            positions: 0,
            balanceAssets: 1
        });

        mockGateway.shutdown = async () => {
            this.logger.info('📝 Mock Exchange Gateway cerrado');
        };

        return mockGateway;
    }

    /**
     * Inicializar Position Manager
     */
    async initializePositionManager() {
        try {
            this.logger.info('💼 Inicializando Position Manager...');

            const positionConfig = {
                maxPositions: this.config.mode === 'live' ? 15 : 25,
                maxRiskPerPosition: this.config.mode === 'live' ? this.config.live.maxRiskPerTrade : 0.05,
                maxTotalRisk: this.config.mode === 'live' ? this.config.live.maxTotalRisk : 0.25,
                quantumRiskAdjustment: true,
                rebalanceInterval: this.config.integration.metricsInterval * 10 // 5 minutos
            };

            this.components.positionManager = new PositionManager(positionConfig);

            // Esperar inicialización
            await new Promise((resolve, reject) => {
                this.components.positionManager.on('position_manager_initialized', resolve);
                
                setTimeout(() => resolve(), 2000); // Timeout corto, no requiere conexión externa
            });

            this.state.componentsStarted++;
            this.logger.info('✅ Position Manager iniciado correctamente');

        } catch (error) {
            this.logger.error('❌ Error inicializando Position Manager:', error);
            throw error;
        }
    }

    /**
     * Inicializar LLM Neural Orchestrator
     */
    async initializeLLMOrchestrator() {
        try {
            this.logger.info('🧠 Inicializando LLM Neural Orchestrator...');

            const llmConfig = {
                apiKey: this.config.geminiApiKey,
                maxDecisionTime: 30000,
                decisionThreshold: 0.7,
                quantumSyncInterval: this.config.integration.metricsInterval * 2 // 1 minuto
            };

            this.components.llmOrchestrator = new LLMNeuralOrchestrator(llmConfig);

            // Solo esperar inicialización si tenemos API key
            if (this.config.geminiApiKey) {
                await new Promise((resolve, reject) => {
                    this.components.llmOrchestrator.on('initialized', resolve);
                    this.components.llmOrchestrator.on('error', reject);
                    
                    setTimeout(() => reject(new Error('Timeout inicializando LLM Orchestrator')), 40000);
                });

                this.logger.info('✅ LLM Neural Orchestrator iniciado con Gemini API');
            } else {
                this.logger.info('⚠️ LLM Neural Orchestrator iniciado en modo fallback');
            }

            this.state.componentsStarted++;

        } catch (error) {
            this.logger.error('❌ Error inicializando LLM Orchestrator:', error);
            
            // Continuar sin LLM si hay error
            this.logger.info('📝 Continuando sin LLM Neural Orchestrator...');
            this.components.llmOrchestrator = null;
        }
    }

    /**
     * Inicializar Quantum Event Orchestrator
     */
    async initializeQuantumOrchestrator() {
        try {
            this.logger.info('⚛️ Inicializando Quantum Event Orchestrator...');

            this.components.quantumOrchestrator = new QuantumEventOrchestrator({
                maxEventQueue: 1000,
                processingInterval: 5000,
                timeoutThreshold: 30000,
                backpressureLimit: 100
            });

            // Esperar inicialización
            await new Promise((resolve) => {
                setTimeout(resolve, 1000); // Breve delay para inicialización
            });

            this.state.componentsStarted++;
            this.logger.info('✅ Quantum Event Orchestrator iniciado correctamente');

        } catch (error) {
            this.logger.error('❌ Error inicializando Quantum Orchestrator:', error);
            throw error;
        }
    }

    /**
     * Conectar componentes entre sí
     */
    async connectComponents() {
        try {
            this.logger.info('🔗 Conectando componentes del sistema...');

            // Conectar Position Manager con Exchange Gateway
            if (this.components.positionManager && this.components.exchangeGateway) {
                this.components.positionManager.connectExchangeGateway(this.components.exchangeGateway);
            }

            // Conectar Master Hub con LLM Orchestrator si está disponible
            if (this.components.masterHub && this.components.llmOrchestrator) {
                this.components.masterHub.components.llmOrchestrator = this.components.llmOrchestrator;
            }

            // Conectar Master Hub con Quantum Orchestrator
            if (this.components.masterHub && this.components.quantumOrchestrator) {
                this.components.masterHub.components.quantumOrchestrator = this.components.quantumOrchestrator;
            }

            // Configurar eventos de integración
            this.setupIntegrationEvents();

            this.logger.info('✅ Componentes conectados correctamente');

        } catch (error) {
            this.logger.error('❌ Error conectando componentes:', error);
            throw error;
        }
    }

    /**
     * Configurar eventos de integración entre componentes
     */
    setupIntegrationEvents() {
        // Position Manager → Master Hub
        if (this.components.positionManager && this.components.masterHub) {
            this.components.positionManager.on('position_opened', (position) => {
                this.components.masterHub.broadcastToWebSocketClients('position_opened', position);
            });

            this.components.positionManager.on('position_closed', (data) => {
                this.components.masterHub.broadcastToWebSocketClients('position_closed', data);
            });

            this.components.positionManager.on('all_positions_closed', (data) => {
                this.components.masterHub.broadcastToWebSocketClients('emergency_positions_closed', data);
            });
        }

        // Exchange Gateway → Master Hub
        if (this.components.exchangeGateway && this.components.masterHub) {
            this.components.exchangeGateway.on('authenticated', (data) => {
                this.components.masterHub.broadcastToWebSocketClients('exchange_authenticated', data);
            });

            this.components.exchangeGateway.on('order_update', (order) => {
                this.components.masterHub.broadcastToWebSocketClients('order_update', order);
            });

            this.components.exchangeGateway.on('account_update', (account) => {
                this.components.masterHub.broadcastToWebSocketClients('account_update', account);
            });
        }

        // LLM Orchestrator → Master Hub (ya configurado en Master Hub)
        // Quantum Orchestrator → Master Hub (ya configurado en Master Hub)

        this.logger.info('🔗 Eventos de integración configurados');
    }

    /**
     * Iniciar sistema completo
     */
    async launch() {
        try {
            if (!this.state.initialized) {
                await this.initialize();
            }

            this.logger.info('🚀 Lanzando sistema QBTC...');

            // Configurar monitoreo de salud del sistema
            this.setupSystemHealthMonitoring();

            // Configurar manejo de shutdown graceful
            this.setupGracefulShutdown();

            this.state.launched = true;
            const launchTime = Date.now() - this.state.startTime;
            
            this.logger.info('🎉 ========================================');
            this.logger.info('🎉 SISTEMA QBTC LANZADO EXITOSAMENTE');
            this.logger.info('🎉 ========================================');
            this.logger.info(`🕐 Tiempo de arranque: ${launchTime}ms`);
            this.logger.info(`📊 Componentes activos: ${this.state.componentsStarted}/${this.state.totalComponents}`);
            this.logger.info(`🎯 Modo de operación: ${this.config.mode.toUpperCase()}`);
            this.logger.info(`🌐 Master Hub: http://localhost:${this.config.ports.masterHub}`);
            this.logger.info(`💼 Position Manager: Activo con límites de riesgo configurados`);
            this.logger.info(`🧠 LLM Neural: ${this.components.llmOrchestrator ? 'Activo con Gemini API' : 'Modo Fallback'}`);
            this.logger.info(`🔗 Exchange: ${this.components.exchangeGateway?.state?.connected ? 'Conectado' : 'Mock/Simulado'}`);
            this.logger.info('🎉 Sistema listo para trading algorithmic!');
            this.logger.info('🎉 ========================================');

            // Mostrar estadísticas iniciales
            this.logSystemStats();

            return this.getSystemStatus();

        } catch (error) {
            this.logger.error('❌ Error lanzando sistema QBTC:', error);
            throw error;
        }
    }

    /**
     * Configurar monitoreo de salud del sistema
     */
    setupSystemHealthMonitoring() {
        // Health check cada 30 segundos (segundo plano para métricas según reglas)
        setInterval(async () => {
            try {
                await this.performSystemHealthCheck();
            } catch (error) {
                this.logger.error('Error en health check del sistema:', error);
            }
        }, this.config.integration.metricsInterval);

        this.logger.info('💗 Monitoreo de salud del sistema configurado');
    }

    /**
     * Realizar verificación de salud del sistema
     */
    async performSystemHealthCheck() {
        try {
            const healthData = {
                timestamp: Date.now(),
                uptime: Date.now() - this.state.startTime,
                components: {},
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage()
            };

            // Verificar cada componente
            if (this.components.masterHub) {
                healthData.components.masterHub = this.components.masterHub.getSystemStatus();
            }

            if (this.components.positionManager) {
                healthData.components.positionManager = this.components.positionManager.getPositionManagerMetrics();
            }

            if (this.components.exchangeGateway && this.components.exchangeGateway.getGatewayMetrics) {
                healthData.components.exchangeGateway = this.components.exchangeGateway.getGatewayMetrics();
            }

            if (this.components.llmOrchestrator && this.components.llmOrchestrator.getNeuralMetrics) {
                healthData.components.llmOrchestrator = this.components.llmOrchestrator.getNeuralMetrics();
            }

            this.state.lastHealthCheck = healthData;

            // Log estadísticas periódicas
            const uptimeHours = (healthData.uptime / (1000 * 60 * 60)).toFixed(1);
            const memoryMB = Math.round(healthData.memoryUsage.heapUsed / 1024 / 1024);
            
            this.logger.debug(`💗 Sistema saludable - Uptime: ${uptimeHours}h - Memoria: ${memoryMB}MB`);

        } catch (error) {
            this.logger.error('Error realizando health check:', error);
        }
    }

    /**
     * Configurar shutdown graceful
     */
    setupGracefulShutdown() {
        const shutdownHandler = async (signal) => {
            this.logger.info(`🛑 Señal ${signal} recibida, iniciando shutdown graceful...`);
            await this.shutdown();
            process.exit(0);
        };

        process.on('SIGINT', shutdownHandler);
        process.on('SIGTERM', shutdownHandler);
        process.on('SIGUSR2', shutdownHandler); // Para nodemon

        // Manejo de errores no capturados
        process.on('uncaughtException', (error) => {
            this.logger.error('❌ Error no capturado:', error);
            this.shutdown().finally(() => process.exit(1));
        });

        process.on('unhandledRejection', (reason, promise) => {
            this.logger.error('❌ Promesa rechazada no manejada:', reason);
        });

        this.logger.info('🛡️ Handlers de shutdown configurados');
    }

    /**
     * Mostrar estadísticas del sistema
     */
    logSystemStats() {
        const stats = this.getSystemStatus();
        
        this.logger.info('📊 ESTADÍSTICAS INICIALES DEL SISTEMA:');
        this.logger.info(`   • Tiempo de inicialización: ${stats.initTime}ms`);
        this.logger.info(`   • Componentes activos: ${stats.activeComponents}`);
        this.logger.info(`   • Memoria utilizada: ${Math.round(stats.memoryUsage.heapUsed / 1024 / 1024)}MB`);
        this.logger.info(`   • Modo de trading: ${stats.tradingMode}`);
        this.logger.info(`   • APIs configuradas: ${stats.configuredAPIs.join(', ')}`);
    }

    /**
     * Obtener estado completo del sistema
     */
    getSystemStatus() {
        const configuredAPIs = [];
        if (this.config.geminiApiKey) configuredAPIs.push('Gemini');
        if (this.config.binanceApiKey) configuredAPIs.push('Binance');
        if (configuredAPIs.length === 0) configuredAPIs.push('Mock/Simulado');

        return {
            launched: this.state.launched,
            initialized: this.state.initialized,
            mode: this.config.mode,
            tradingMode: this.config.mode.toUpperCase(),
            activeComponents: this.state.componentsStarted,
            totalComponents: this.state.totalComponents,
            initTime: this.state.startTime ? Date.now() - this.state.startTime : 0,
            uptime: this.state.launched ? Date.now() - this.state.startTime : 0,
            ports: this.config.ports,
            configuredAPIs,
            memoryUsage: process.memoryUsage(),
            lastHealthCheck: this.state.lastHealthCheck,
            errors: this.state.errors,
            components: {
                masterHub: !!this.components.masterHub,
                exchangeGateway: !!this.components.exchangeGateway,
                positionManager: !!this.components.positionManager,
                llmOrchestrator: !!this.components.llmOrchestrator,
                quantumOrchestrator: !!this.components.quantumOrchestrator
            }
        };
    }

    /**
     * Shutdown completo del sistema
     */
    async shutdown() {
        try {
            this.logger.info('🔄 Iniciando shutdown del sistema QBTC...');

            // Cerrar componentes en orden inverso
            const shutdownPromises = [];

            if (this.components.quantumOrchestrator && this.components.quantumOrchestrator.shutdown) {
                shutdownPromises.push(this.components.quantumOrchestrator.shutdown());
            }

            if (this.components.llmOrchestrator && this.components.llmOrchestrator.shutdown) {
                shutdownPromises.push(this.components.llmOrchestrator.shutdown());
            }

            if (this.components.positionManager && this.components.positionManager.shutdown) {
                shutdownPromises.push(this.components.positionManager.shutdown());
            }

            if (this.components.exchangeGateway && this.components.exchangeGateway.shutdown) {
                shutdownPromises.push(this.components.exchangeGateway.shutdown());
            }

            if (this.components.masterHub && this.components.masterHub.gracefulShutdown) {
                shutdownPromises.push(this.components.masterHub.gracefulShutdown());
            }

            // Esperar que todos los componentes se cierren
            await Promise.allSettled(shutdownPromises);

            this.state.launched = false;
            this.logger.info('✅ Sistema QBTC cerrado correctamente');

        } catch (error) {
            this.logger.error('❌ Error durante shutdown:', error);
        }
    }
}

// Script principal
async function main() {
    try {
        console.log('🚀 Iniciando QBTC Dimensional Supreme Trading System...');
        console.log('');

        // Configuración desde argumentos de línea de comandos
        const args = process.argv.slice(2);
        const config = {};

        // Parsear argumentos
        args.forEach(arg => {
            if (arg.startsWith('--mode=')) {
                config.mode = arg.split('=')[1];
            }
            if (arg.startsWith('--log-level=')) {
                config.logLevel = arg.split('=')[1];
            }
        });

        // Crear y lanzar sistema
        const launcher = new QBTCSystemLauncher(config);
        const status = await launcher.launch();

        // Mantener proceso activo
        console.log('\n✅ Sistema QBTC ejecutándose... (Ctrl+C para cerrar)\n');

    } catch (error) {
        console.error('❌ Error fatal lanzando sistema QBTC:', error.message);
        process.exit(1);
    }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main();
}

module.exports = QBTCSystemLauncher;

/**
 * 📋 CARACTERÍSTICAS DEL LAUNCHER:
 * 
 * ✅ Launcher completo del ecosistema QBTC
 * ✅ Soporte para modo paper trading y live trading
 * ✅ Inicialización automática de todos los componentes
 * ✅ Validación de entorno y dependencias
 * ✅ Integración automática entre componentes
 * ✅ Mock Exchange Gateway para paper trading sin APIs
 * ✅ Health monitoring en segundo plano (regla usuario)
 * ✅ Shutdown graceful con limpieza de recursos
 * ✅ Manejo robusto de errores y recuperación
 * ✅ Configuración flexible por línea de comandos
 * ✅ Logging comprehensivo con secure logger
 * ✅ Métricas de performance y estadísticas del sistema
 * 
 * 🚀 MODOS DE USO:
 * 
 * Paper Trading:
 * node src/launch-qbtc-system.js --mode=paper
 * 
 * Live Trading:
 * BINANCE_API_KEY=xxx BINANCE_API_SECRET=xxx GEMINI_API_KEY=xxx node src/launch-qbtc-system.js --mode=live
 * 
 * Con logging debug:
 * node src/launch-qbtc-system.js --mode=paper --log-level=debug
 */


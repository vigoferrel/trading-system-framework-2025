/**
 * 🚀 SYSTEM OPTIMIZATION - CONFIGURACIÓN OPTIMIZADA PARA QBTC
 * Configuración centralizada de parámetros de rendimiento y optimización
 * 
 * Implementa configuraciones optimizadas para todos los componentes del sistema
 * según las reglas de segundo plano y métricas del sistema
 * 
 * @author QBTC Development Team
 * @version 3.0
 * @since 2025-01-09
 */

const os = require('os');
const Logger = require('../utils/secure-logger');
const { kernelRNG } = require('../utils/kernel-rng');

/**
 * System Optimization - Configuración optimizada del sistema
 */
class SystemOptimization {
    constructor() {
        this.logger = new Logger.SecureLogger('SystemOptimization');
        this.rng = kernelRNG;
        
        // Detectar capacidades del sistema
        this.systemInfo = this.detectSystemCapabilities();
        
        // Generar configuraciones optimizadas
        this.config = this.generateOptimizedConfiguration();
        
        this.logger.info('⚙️ Configuración del sistema optimizada generada');
    }

    /**
     * Detectar capacidades del sistema
     */
    detectSystemCapabilities() {
        const totalMemoryGB = os.totalmem() / (1024 * 1024 * 1024);
        const cpuCores = os.cpus().length;
        const platform = os.platform();
        const arch = os.arch();
        
        // Categorizar sistema por capacidades
        let systemCategory;
        if (totalMemoryGB >= 16 && cpuCores >= 8) {
            systemCategory = 'high-performance';
        } else if (totalMemoryGB >= 8 && cpuCores >= 4) {
            systemCategory = 'medium-performance';
        } else {
            systemCategory = 'low-performance';
        }

        const capabilities = {
            memory: {
                total: totalMemoryGB,
                available: os.freemem() / (1024 * 1024 * 1024),
                category: totalMemoryGB >= 16 ? 'high' : totalMemoryGB >= 8 ? 'medium' : 'low'
            },
            cpu: {
                cores: cpuCores,
                model: os.cpus()[0].model,
                category: cpuCores >= 8 ? 'high' : cpuCores >= 4 ? 'medium' : 'low'
            },
            system: {
                platform,
                arch,
                category: systemCategory,
                uptime: os.uptime(),
                loadavg: platform !== 'win32' ? os.loadavg() : [0, 0, 0]
            }
        };

        this.logger.info(`🖥️ Sistema detectado: ${systemCategory} (${totalMemoryGB.toFixed(1)}GB RAM, ${cpuCores} cores)`);
        
        return capabilities;
    }

    /**
     * Generar configuración optimizada
     */
    generateOptimizedConfiguration() {
        const baseConfig = this.getBaseConfiguration();
        const systemSpecific = this.getSystemSpecificConfiguration();
        const serviceSpecific = this.getServiceSpecificConfiguration();
        
        return {
            ...baseConfig,
            system: systemSpecific,
            services: serviceSpecific,
            generated: Date.now(),
            systemCategory: this.systemInfo.system.category
        };
    }

    /**
     * Configuración base del sistema
     */
    getBaseConfiguration() {
        return {
            // Configuración global de timeouts
            timeouts: {
                healthCheck: 3000,      // 3 segundos para health checks
                serviceRestart: 15000,  // 15 segundos para reiniciar servicios
                dataFetch: 5000,        // 5 segundos para obtener datos
                websocketPing: 30000,   // 30 segundos para websocket ping
                alertCooldown: 60000,   // 1 minuto de cooldown para alertas
                shutdownGraceful: 10000 // 10 segundos para shutdown graceful
            },
            
            // Configuración de intervalos
            intervals: {
                healthCheck: 5000,      // Health checks cada 5 segundos
                monitoring: 2000,       // Monitoreo cada 2 segundos
                memoryCleanup: 30000,   // Limpieza de memoria cada 30 segundos
                logRotation: 3600000,   // Rotación de logs cada hora
                metricsPersistence: 10000, // Persistir métricas cada 10 segundos
                systemAnalysis: 60000   // Análisis del sistema cada minuto
            },
            
            // Configuración de memoria
            memory: {
                globalThreshold: this.calculateMemoryThreshold(),
                gcForceThreshold: 85,   // Forzar GC al 85% de uso
                cacheMaxSize: this.calculateCacheSize(),
                historyRetention: this.calculateHistoryRetention(),
                enableOptimization: true,
                cleanupAggressive: this.systemInfo.memory.category === 'low'
            },
            
            // Configuración de logging
            logging: {
                level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
                maxFileSize: 10 * 1024 * 1024, // 10MB
                maxFiles: 5,
                enableConsole: process.env.NODE_ENV !== 'production',
                enableFile: true,
                enableMetrics: true
            },
            
            // Configuración de red
            network: {
                maxConnections: this.calculateMaxConnections(),
                keepAliveTimeout: 65000,
                headersTimeout: 66000,
                requestTimeout: 30000,
                retryAttempts: 3,
                retryDelay: 1000
            },
            
            // Configuración de seguridad
            security: {
                enableRateLimiting: true,
                maxRequestsPerMinute: this.calculateRateLimit(),
                enableCors: true,
                enableCompression: true,
                enableHelmet: false // Para evitar conflictos en desarrollo
            }
        };
    }

    /**
     * Configuración específica del sistema
     */
    getSystemSpecificConfiguration() {
        const category = this.systemInfo.system.category;
        
        const configurations = {
            'high-performance': {
                concurrency: {
                    maxWorkers: Math.min(this.systemInfo.cpu.cores * 2, 16),
                    maxConcurrentRequests: 200,
                    queueMaxSize: 1000,
                    processingTimeout: 30000
                },
                optimization: {
                    enableClustering: false, // Deshabilitado para simplicidad
                    enableCaching: true,
                    enableCompression: true,
                    enablePreloading: true,
                    aggressiveOptimization: true
                },
                resources: {
                    memoryBuffer: 20,       // 20% buffer de memoria
                    cpuThreshold: 80,       // 80% uso máximo CPU
                    diskIOThreshold: 70,    // 70% uso máximo disco
                    networkThreshold: 80    // 80% uso máximo red
                }
            },
            
            'medium-performance': {
                concurrency: {
                    maxWorkers: Math.min(this.systemInfo.cpu.cores, 8),
                    maxConcurrentRequests: 100,
                    queueMaxSize: 500,
                    processingTimeout: 45000
                },
                optimization: {
                    enableClustering: false,
                    enableCaching: true,
                    enableCompression: true,
                    enablePreloading: false,
                    aggressiveOptimization: false
                },
                resources: {
                    memoryBuffer: 25,       // 25% buffer de memoria
                    cpuThreshold: 75,       // 75% uso máximo CPU
                    diskIOThreshold: 65,    // 65% uso máximo disco
                    networkThreshold: 75    // 75% uso máximo red
                }
            },
            
            'low-performance': {
                concurrency: {
                    maxWorkers: Math.max(this.systemInfo.cpu.cores / 2, 2),
                    maxConcurrentRequests: 50,
                    queueMaxSize: 200,
                    processingTimeout: 60000
                },
                optimization: {
                    enableClustering: false,
                    enableCaching: false,   // Reducir uso de memoria
                    enableCompression: false,
                    enablePreloading: false,
                    aggressiveOptimization: false
                },
                resources: {
                    memoryBuffer: 30,       // 30% buffer de memoria
                    cpuThreshold: 70,       // 70% uso máximo CPU
                    diskIOThreshold: 60,    // 60% uso máximo disco
                    networkThreshold: 70    // 70% uso máximo red
                }
            }
        };
        
        return configurations[category];
    }

    /**
     * Configuración específica por servicio
     */
    getServiceSpecificConfiguration() {
        return {
            // Enhanced Master Control
            masterControl: {
                port: 14001,
                healthCheckInterval: 5000,
                serviceRestartTimeout: 15000,
                maxRetries: 3,
                memoryThreshold: 70,
                enableAutoRecovery: true,
                recoveryDelay: 2000,
                maxConcurrentOperations: this.systemInfo.system.category === 'high-performance' ? 10 : 5
            },
            
            // Trading Engine
            tradingEngine: {
                port: 14201,
                maxPositions: this.systemInfo.memory.category === 'high' ? 1000 : 
                             this.systemInfo.memory.category === 'medium' ? 500 : 200,
                riskCalculationInterval: 1000,
                orderProcessingTimeout: 5000,
                marketDataRefreshRate: 100,
                enableHighFrequency: this.systemInfo.system.category === 'high-performance',
                memoryThreshold: 75
            },
            
            // Quantum Engine
            quantumEngine: {
                port: 14115,
                coherenceCalculationInterval: 500,
                quantumStateTimeout: 10000,
                maxEntanglements: this.systemInfo.cpu.cores * 10,
                fieldUpdateRate: 50,
                enableQuantumAcceleration: this.systemInfo.system.category === 'high-performance',
                memoryThreshold: 80
            },
            
            // Hybrid Optimizer V2
            hybridOptimizer: {
                port: 14301,
                optimizationInterval: 2000,
                maxPatterns: this.systemInfo.memory.category === 'high' ? 1000 : 
                            this.systemInfo.memory.category === 'medium' ? 500 : 200,
                synergyCalculationTimeout: 3000,
                enableDeepOptimization: this.systemInfo.system.category !== 'low-performance',
                memoryThreshold: 75,
                cacheSize: this.systemInfo.memory.category === 'high' ? 500 : 200
            },
            
            // Concentrated Hybrid V3
            concentratedHybrid: {
                port: 14302,
                concentrationInterval: 1000,
                maxAnalysisDepth: this.systemInfo.cpu.cores >= 8 ? 10 : 
                                 this.systemInfo.cpu.cores >= 4 ? 7 : 5,
                patternAnalysisTimeout: 5000,
                signalProcessingRate: this.systemInfo.system.category === 'high-performance' ? 100 : 50,
                enableIntensiveAnalysis: this.systemInfo.system.category === 'high-performance',
                memoryThreshold: 80,
                historicalDataPoints: this.systemInfo.memory.category === 'high' ? 2000 : 1000
            },
            
            // Enhanced Dashboard
            dashboard: {
                port: 14401,
                refreshInterval: 5000,
                maxDataPoints: this.systemInfo.memory.category === 'high' ? 200 : 100,
                websocketTimeout: 30000,
                enableRealTimeUpdates: true,
                maxConnectedClients: this.systemInfo.system.category === 'high-performance' ? 50 : 20,
                memoryThreshold: 70,
                cacheRetention: 3600000 // 1 hora
            },
            
            // Intelligent Monitor
            intelligentMonitor: {
                port: 14501,
                monitoringInterval: 2000,
                analysisInterval: 10000,
                predictiveAnalysisInterval: 60000,
                historicalDataPoints: this.systemInfo.memory.category === 'high' ? 2000 : 1000,
                anomalyDetectionSensitivity: 0.15,
                enablePredictiveAlerts: true,
                enableAnomalyDetection: true,
                memoryThreshold: 75,
                alertCooldown: 60000
            }
        };
    }

    /**
     * Calcular umbral de memoria óptimo
     */
    calculateMemoryThreshold() {
        switch (this.systemInfo.memory.category) {
            case 'high': return 75;
            case 'medium': return 70;
            case 'low': return 60;
            default: return 70;
        }
    }

    /**
     * Calcular tamaño de cache óptimo
     */
    calculateCacheSize() {
        const memoryGB = this.systemInfo.memory.total;
        
        if (memoryGB >= 16) {
            return 1000;
        } else if (memoryGB >= 8) {
            return 500;
        } else {
            return 200;
        }
    }

    /**
     * Calcular retención de historial
     */
    calculateHistoryRetention() {
        switch (this.systemInfo.memory.category) {
            case 'high': return 2000;
            case 'medium': return 1000;
            case 'low': return 500;
            default: return 1000;
        }
    }

    /**
     * Calcular máximo de conexiones
     */
    calculateMaxConnections() {
        const cores = this.systemInfo.cpu.cores;
        
        if (cores >= 8) {
            return 1000;
        } else if (cores >= 4) {
            return 500;
        } else {
            return 200;
        }
    }

    /**
     * Calcular límite de rate limiting
     */
    calculateRateLimit() {
        switch (this.systemInfo.system.category) {
            case 'high-performance': return 1000;
            case 'medium-performance': return 500;
            case 'low-performance': return 200;
            default: return 500;
        }
    }

    /**
     * Obtener configuración para un servicio específico
     */
    getServiceConfig(serviceName) {
        const globalConfig = {
            ...this.config.timeouts,
            ...this.config.intervals,
            memory: this.config.memory,
            logging: this.config.logging,
            network: this.config.network,
            system: this.config.system
        };
        
        const serviceConfig = this.config.services[serviceName] || {};
        
        return {
            ...globalConfig,
            ...serviceConfig
        };
    }

    /**
     * Aplicar configuración de Node.js optimizada
     */
    applyNodeJSOptimizations() {
        // Configuraciones de V8 para mejor rendimiento
        const v8Flags = [];
        
        // Optimizaciones de memoria
        const memoryMB = Math.floor(this.systemInfo.memory.total * 1024 * 0.6); // 60% de la memoria total
        v8Flags.push(`--max-old-space-size=${memoryMB}`);
        
        // Optimizaciones de GC según el sistema (sin --optimize-for-size prohibido)
        if (this.systemInfo.system.category === 'high-performance') {
            v8Flags.push('--max-semi-space-size=128');
        } else if (this.systemInfo.system.category === 'low-performance') {
            v8Flags.push('--max-semi-space-size=32');
        }
        
        // Configurar variables de entorno
        process.env.UV_THREADPOOL_SIZE = Math.max(4, this.systemInfo.cpu.cores);
        process.env.NODE_OPTIONS = v8Flags.join(' ');
        
        // Configurar timeouts de HTTP
        require('http').globalAgent.timeout = this.config.network.requestTimeout;
        require('http').globalAgent.keepAlive = true;
        require('http').globalAgent.keepAliveMsecs = this.config.network.keepAliveTimeout;
        
        this.logger.info(`⚙️ Optimizaciones Node.js aplicadas: ${v8Flags.join(' ')}`);
        this.logger.info(`🧵 UV_THREADPOOL_SIZE configurado a: ${process.env.UV_THREADPOOL_SIZE}`);
    }

    /**
     * Generar configuración de healthchecks optimizada
     */
    generateHealthCheckConfiguration() {
        return {
            global: {
                enabled: true,
                interval: this.config.intervals.healthCheck,
                timeout: this.config.timeouts.healthCheck,
                retries: 3,
                retryDelay: 1000,
                enableMetrics: true
            },
            
            services: Object.keys(this.config.services).map(serviceName => ({
                name: serviceName,
                url: `http://localhost:${this.config.services[serviceName].port}/health`,
                interval: this.config.services[serviceName].healthCheckInterval || this.config.intervals.healthCheck,
                timeout: this.config.timeouts.healthCheck,
                expectedStatus: 'OK',
                critical: ['masterControl', 'tradingEngine', 'quantumEngine'].includes(serviceName)
            }))
        };
    }

    /**
     * Generar configuración de monitoreo de recursos
     */
    generateResourceMonitoring() {
        return {
            cpu: {
                enabled: true,
                threshold: this.config.system.resources.cpuThreshold,
                interval: 5000,
                alertOnHighUsage: true
            },
            
            memory: {
                enabled: true,
                threshold: this.config.memory.globalThreshold,
                interval: 10000,
                enableGCMetrics: true,
                alertOnHighUsage: true
            },
            
            disk: {
                enabled: true,
                threshold: this.config.system.resources.diskIOThreshold,
                interval: 30000,
                monitorTempFiles: true
            },
            
            network: {
                enabled: true,
                threshold: this.config.system.resources.networkThreshold,
                interval: 15000,
                monitorConnections: true
            }
        };
    }

    /**
     * Exportar toda la configuración
     */
    exportConfiguration() {
        return {
            systemInfo: this.systemInfo,
            config: this.config,
            healthCheck: this.generateHealthCheckConfiguration(),
            resourceMonitoring: this.generateResourceMonitoring(),
            nodeOptimizations: {
                maxOldSpaceSize: Math.floor(this.systemInfo.memory.total * 1024 * 0.6),
                uvThreadpoolSize: Math.max(4, this.systemInfo.cpu.cores),
                optimizeForSize: this.systemInfo.system.category !== 'high-performance'
            }
        };
    }

    /**
     * Validar configuración
     */
    validateConfiguration() {
        const issues = [];
        
        // Validar memoria disponible
        if (this.systemInfo.memory.available < 1) {
            issues.push('Poca memoria disponible (< 1GB)');
        }
        
        // Validar CPU
        if (this.systemInfo.cpu.cores < 2) {
            issues.push('CPU insuficiente (< 2 cores)');
        }
        
        // Validar puertos
        const ports = Object.values(this.config.services).map(s => s.port);
        const uniquePorts = new Set(ports);
        if (ports.length !== uniquePorts.size) {
            issues.push('Conflictos de puertos detectados');
        }
        
        if (issues.length > 0) {
            this.logger.warn('⚠️ Problemas de configuración detectados:', issues);
        } else {
            this.logger.info('✅ Configuración validada correctamente');
        }
        
        return {
            valid: issues.length === 0,
            issues
        };
    }
}

// Inicializar y exportar
const systemOptimization = new SystemOptimization();

// Aplicar optimizaciones de Node.js
systemOptimization.applyNodeJSOptimizations();

// Validar configuración
const validation = systemOptimization.validateConfiguration();
if (!validation.valid) {
    console.warn('⚠️ Configuración con problemas:', validation.issues);
}

// Exportar configuración y funciones
module.exports = {
    SystemOptimization,
    getSystemConfig: () => systemOptimization.exportConfiguration(),
    getServiceConfig: (serviceName) => systemOptimization.getServiceConfig(serviceName),
    getSystemInfo: () => systemOptimization.systemInfo,
    validateConfig: () => systemOptimization.validateConfiguration(),
    
    // Configuraciones específicas para fácil acceso
    TIMEOUTS: systemOptimization.config.timeouts,
    INTERVALS: systemOptimization.config.intervals,
    MEMORY_CONFIG: systemOptimization.config.memory,
    NETWORK_CONFIG: systemOptimization.config.network,
    LOGGING_CONFIG: systemOptimization.config.logging,
    SERVICES_CONFIG: systemOptimization.config.services,
    SYSTEM_CATEGORY: systemOptimization.systemInfo.system.category
};

// Log final
console.log(`🚀 Sistema QBTC optimizado para: ${systemOptimization.systemInfo.system.category}`);
console.log(`💾 Memoria: ${systemOptimization.systemInfo.memory.total.toFixed(1)}GB disponible`);
console.log(`⚡ CPU: ${systemOptimization.systemInfo.cpu.cores} cores`);
console.log(`⚙️ Configuración cargada con ${Object.keys(systemOptimization.config.services).length} servicios`);


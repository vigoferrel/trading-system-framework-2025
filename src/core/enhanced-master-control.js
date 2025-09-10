#!/usr/bin/env node
/**
 * 🎛️ ENHANCED MASTER CONTROL - INTEGRATED AUTO-RECOVERY SYSTEM
 * Sistema maestro mejorado con auto-recovery, optimización de memoria y monitoreo inteligente
 * 
 * Integra Memory Optimizer y Service Recovery Manager para máxima estabilidad
 * 
 * @author QBTC Development Team
 * @version 4.0
 * @since 2025-01-09
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const Logger = require('../logging/hermetic-logger');
const MemoryOptimizer = require('../utils/memory-optimizer');
const ServiceRecoveryManager = require('../utils/service-recovery-manager');
const { kernelRNG } = require('../utils/kernel-rng');

/**
 * Master Control Hub mejorado con sistemas integrados
 */
class EnhancedMasterControl {
    constructor(config = {}) {
        // Configuración del sistema maestro
        this.config = {
            port: config.port || process.env.SERVICE_PORT || 14001,
            wsPort: config.wsPort || 14001,
            
            // Configuración de recovery y monitoreo
            systemHealthInterval: config.systemHealthInterval || 30000, // 30 segundos
            autoRecoveryEnabled: config.autoRecoveryEnabled !== false,
            memoryOptimizationEnabled: config.memoryOptimizationEnabled !== false,
            intelligentMonitoringEnabled: config.intelligentMonitoringEnabled !== false,
            
            // Servicios a gestionar
            services: config.services || {
                'HYBRID_OPTIMIZER_V2': {
                    port: 14301,
                    script: 'src/core/hybrid-optimizer-v2.js',
                    healthEndpoint: '/health',
                    critical: true,
                    restartDelay: 5000,
                    memoryLimit: 512 // MB
                },
                'CONCENTRATED_HYBRID_V3': {
                    port: 14302,
                    script: 'src/core/concentrated-hybrid-v3.js', 
                    healthEndpoint: '/health',
                    critical: true,
                    restartDelay: 5000,
                    memoryLimit: 768 // MB
                },
                'ENHANCED_DASHBOARD': {
                    port: 14401,
                    script: 'src/ui/enhanced-dashboard.js',
                    healthEndpoint: '/health',
                    critical: false,
                    restartDelay: 3000,
                    memoryLimit: 256 // MB
                },
                'INTELLIGENT_MONITOR': {
                    port: 14501,
                    script: 'src/monitoring/intelligent-monitor.js',
                    healthEndpoint: '/health',
                    critical: false,
                    restartDelay: 3000,
                    memoryLimit: 128 // MB
                }
            },
            
            ...config
        };

        // Estado del sistema maestro
        this.state = {
            initialized: false,
            operational: true,
            systemHealth: 0.0,
            totalServices: Object.keys(this.config.services).length,
            healthyServices: 0,
            criticalServices: 0,
            lastSystemCheck: null,
            
            // Estados de subsistemas
            memoryOptimizer: {
                active: false,
                memoryUsage: 0,
                lastCleanup: null,
                alertLevel: 'normal'
            },
            serviceRecovery: {
                active: false,
                totalRecoveries: 0,
                lastRecovery: null,
                circuitBreakers: new Map()
            },
            performance: {
                uptime: Date.now(),
                totalRequests: 0,
                avgResponseTime: 0,
                errorRate: 0.0
            }
        };

        // Componentes integrados
        this.app = express();
        this.server = null;
        this.wsServer = null;
        this.memoryOptimizer = null;
        this.serviceRecovery = null;
        
        // Timers del sistema
        this.healthTimer = null;
        this.performanceTimer = null;

        // Utilidades
        this.logger = Logger.createLogger('EnhancedMasterControl');
        this.rng = kernelRNG;

        // Métricas del sistema
        this.metrics = {
            requests: new Map(),
            errors: new Map(),
            recoveries: [],
            systemEvents: []
        };

        // Inicializar sistema
        this.initialize();
    }

    /**
     * Inicializar Enhanced Master Control
     */
    async initialize() {
        try {
            this.logger.info('🎛️ Inicializando Enhanced Master Control...');

            // Configurar servidor web
            await this.setupServer();

            // Inicializar Memory Optimizer
            if (this.config.memoryOptimizationEnabled) {
                await this.initializeMemoryOptimizer();
            }

            // Inicializar Service Recovery Manager
            if (this.config.autoRecoveryEnabled) {
                await this.initializeServiceRecovery();
            }

            // Iniciar monitoreo de sistema
            this.startSystemMonitoring();

            // Iniciar monitoreo de rendimiento
            this.startPerformanceMonitoring();

            this.state.initialized = true;
            this.logger.info('✅ Enhanced Master Control inicializado correctamente');

            // Iniciar servicios gestionados
            await this.startManagedServices();

        } catch (error) {
            this.logger.error('❌ Error inicializando Enhanced Master Control:', error);
            throw error;
        }
    }

    /**
     * Configurar servidor web
     */
    async setupServer() {
        // Middleware básico
        this.app.use(express.json());
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            
            // Métricas de request
            this.metrics.requests.set(Date.now(), {
                method: req.method,
                url: req.url,
                timestamp: Date.now()
            });
            
            next();
        });

        // Configurar rutas
        this.setupRoutes();

        // Crear servidor
        this.server = http.createServer(this.app);

        // Configurar WebSocket
        this.wsServer = new WebSocket.Server({ server: this.server });
        this.setupWebSocketHandlers();

        // Iniciar servidor
        await new Promise((resolve, reject) => {
            this.server.listen(this.config.port, (error) => {
                if (error) {
                    reject(error);
                } else {
                    this.logger.info(`🌐 Enhanced Master Control servidor iniciado en puerto ${this.config.port}`);
                    resolve();
                }
            });
        });
    }

    /**
     * Configurar rutas REST API
     */
    setupRoutes() {
        // Health check del sistema maestro
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                service: 'Enhanced Master Control',
                port: this.config.port,
                operational: this.state.operational,
                systemHealth: this.state.systemHealth,
                uptime: Date.now() - this.state.performance.uptime,
                services: {
                    total: this.state.totalServices,
                    healthy: this.state.healthyServices,
                    critical: this.state.criticalServices
                },
                subsystems: {
                    memoryOptimizer: this.state.memoryOptimizer.active,
                    serviceRecovery: this.state.serviceRecovery.active,
                    memoryUsage: this.state.memoryOptimizer.memoryUsage,
                    totalRecoveries: this.state.serviceRecovery.totalRecoveries
                }
            });
        });

        // Estado completo del sistema
        this.app.get('/system/status', (req, res) => {
            res.json({
                ...this.state,
                services: this.serviceRecovery ? this.serviceRecovery.getServicesStatus() : {},
                memoryStats: this.memoryOptimizer ? this.memoryOptimizer.getStats() : null,
                metrics: this.getSystemMetrics()
            });
        });

        // Métricas del sistema
        this.app.get('/metrics', (req, res) => {
            const uptime = (Date.now() - this.state.performance.uptime) / 1000;
            
            res.set('Content-Type', 'text/plain; charset=utf-8');
            res.send(`# Enhanced Master Control Metrics
master_control_uptime_seconds ${uptime}
master_control_system_health ${this.state.systemHealth}
master_control_services_total ${this.state.totalServices}
master_control_services_healthy ${this.state.healthyServices}
master_control_services_critical ${this.state.criticalServices}
master_control_memory_usage_percentage ${this.state.memoryOptimizer.memoryUsage}
master_control_total_recoveries ${this.state.serviceRecovery.totalRecoveries}
master_control_requests_total ${this.state.performance.totalRequests}
master_control_avg_response_time ${this.state.performance.avgResponseTime}
master_control_error_rate ${this.state.performance.errorRate}
`);
        });

        // Control de servicios
        this.app.post('/services/:serviceName/restart', async (req, res) => {
            try {
                const { serviceName } = req.params;
                
                if (!this.serviceRecovery) {
                    return res.status(503).json({ success: false, error: 'Service Recovery no disponible' });
                }

                await this.serviceRecovery.forceRestartService(serviceName);
                
                res.json({ 
                    success: true, 
                    message: `Reinicio de ${serviceName} solicitado` 
                });
            } catch (error) {
                this.logger.error(`❌ Error reiniciando servicio ${req.params.serviceName}:`, error);
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Optimización manual de memoria
        this.app.post('/system/optimize-memory', async (req, res) => {
            try {
                if (!this.memoryOptimizer) {
                    return res.status(503).json({ success: false, error: 'Memory Optimizer no disponible' });
                }

                const cleaned = await this.memoryOptimizer.performCleanup();
                
                res.json({ 
                    success: true, 
                    cleaned,
                    memoryStats: this.memoryOptimizer.getStats()
                });
            } catch (error) {
                this.logger.error('❌ Error en optimización manual de memoria:', error);
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Obtener logs del sistema
        this.app.get('/system/events', (req, res) => {
            const limit = parseInt(req.query.limit) || 100;
            const events = this.metrics.systemEvents.slice(-limit);
            
            res.json({
                total: this.metrics.systemEvents.length,
                events
            });
        });

        // Dashboard de control
        this.app.get('/dashboard', (req, res) => {
            res.json({
                systemOverview: {
                    health: this.state.systemHealth,
                    uptime: Date.now() - this.state.performance.uptime,
                    services: this.serviceRecovery ? this.serviceRecovery.getServicesStatus() : {}
                },
                performance: this.getPerformanceMetrics(),
                memory: this.memoryOptimizer ? this.memoryOptimizer.getStats() : null,
                recentEvents: this.metrics.systemEvents.slice(-20)
            });
        });
    }

    /**
     * Configurar WebSocket handlers
     */
    setupWebSocketHandlers() {
        this.wsServer.on('connection', (ws) => {
            this.logger.debug('🔗 Nueva conexión WebSocket de control establecida');

            // Enviar estado inicial
            ws.send(JSON.stringify({
                type: 'system_state',
                data: {
                    systemHealth: this.state.systemHealth,
                    services: this.serviceRecovery ? this.serviceRecovery.getServicesStatus() : {},
                    memory: this.memoryOptimizer ? this.memoryOptimizer.getStats() : null
                }
            }));

            // Configurar suscripción a eventos
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleControlWebSocketMessage(ws, data);
                } catch (error) {
                    this.logger.error('❌ Error procesando mensaje WebSocket de control:', error);
                }
            });

            ws.on('close', () => {
                this.logger.debug('🔗 Conexión WebSocket de control cerrada');
            });
        });
    }

    /**
     * Manejar mensajes WebSocket de control
     */
    async handleControlWebSocketMessage(ws, data) {
        switch (data.type) {
            case 'subscribe_system_events':
                ws.systemEventSubscription = true;
                ws.send(JSON.stringify({
                    type: 'subscription_confirmed',
                    data: { event: 'system_events', subscribed: true }
                }));
                break;

            case 'request_service_restart':
                try {
                    if (this.serviceRecovery) {
                        await this.serviceRecovery.forceRestartService(data.serviceName);
                        ws.send(JSON.stringify({
                            type: 'service_restart_initiated',
                            data: { serviceName: data.serviceName, success: true }
                        }));
                    }
                } catch (error) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        data: { message: error.message }
                    }));
                }
                break;

            case 'request_memory_cleanup':
                try {
                    if (this.memoryOptimizer) {
                        const cleaned = await this.memoryOptimizer.performCleanup();
                        ws.send(JSON.stringify({
                            type: 'memory_cleanup_completed',
                            data: { cleaned, stats: this.memoryOptimizer.getStats() }
                        }));
                    }
                } catch (error) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        data: { message: error.message }
                    }));
                }
                break;

            default:
                this.logger.warn(`⚠️ Tipo de mensaje WebSocket de control desconocido: ${data.type}`);
        }
    }

    /**
     * Inicializar Memory Optimizer
     */
    async initializeMemoryOptimizer() {
        this.memoryOptimizer = new MemoryOptimizer({
            memoryThreshold: 85,
            criticalThreshold: 95,
            maxCacheSize: 500,
            maxPatterns: 100,
            maxHistory: 300,
            monitorInterval: 30000 // 30 segundos según reglas
        });

        await this.memoryOptimizer.initialize();
        this.state.memoryOptimizer.active = true;
        this.logger.info('🧠 Memory Optimizer integrado y activo');

        // Configurar listener para emergencias de memoria
        process.on('memoryEmergency', (data) => {
            this.handleMemoryEmergency(data);
        });
    }

    /**
     * Inicializar Service Recovery Manager
     */
    async initializeServiceRecovery() {
        this.serviceRecovery = new ServiceRecoveryManager({
            services: this.config.services,
            healthCheckInterval: 15000, // 15 segundos
            maxRetries: 3,
            enableCircuitBreaker: true,
            enableGracefulShutdown: true
        });

        await this.serviceRecovery.initialize();
        this.state.serviceRecovery.active = true;
        this.logger.info('🔄 Service Recovery Manager integrado y activo');
    }

    /**
     * Iniciar servicios gestionados
     */
    async startManagedServices() {
        if (!this.serviceRecovery) {
            this.logger.warn('⚠️ Service Recovery no disponible - servicios no se iniciarán automáticamente');
            return;
        }

        this.logger.info('🚀 Iniciando servicios gestionados...');

        // Los servicios se iniciarán automáticamente por el Service Recovery Manager
        // cuando detecte que no están disponibles en los health checks
        
        // Esperar un momento para permitir que el monitoreo comience
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        this.logger.info('✅ Servicios gestionados en proceso de inicio');
    }

    /**
     * Iniciar monitoreo de sistema
     */
    startSystemMonitoring() {
        this.healthTimer = setInterval(async () => {
            await this.performSystemHealthCheck();
        }, this.config.systemHealthInterval);

        this.logger.info('📊 Monitoreo de sistema iniciado en segundo plano');
    }

    /**
     * Iniciar monitoreo de rendimiento
     */
    startPerformanceMonitoring() {
        this.performanceTimer = setInterval(async () => {
            await this.updatePerformanceMetrics();
            this.broadcastSystemUpdate();
        }, 60000); // 1 minuto para métricas de rendimiento

        this.logger.info('⚡ Monitoreo de rendimiento iniciado');
    }

    /**
     * Realizar health check del sistema completo
     */
    async performSystemHealthCheck() {
        try {
            this.state.lastSystemCheck = Date.now();
            
            // Obtener estados de servicios
            const serviceStates = this.serviceRecovery ? 
                this.serviceRecovery.getServicesStatus() : {};

            // Calcular salud del sistema
            let healthyCount = 0;
            let criticalCount = 0;
            
            for (const [serviceName, serviceState] of Object.entries(serviceStates)) {
                if (serviceState.status === 'HEALTHY') {
                    healthyCount++;
                    if (this.config.services[serviceName]?.critical) {
                        criticalCount++;
                    }
                }
            }

            this.state.healthyServices = healthyCount;
            this.state.criticalServices = criticalCount;
            
            // Calcular salud general del sistema (0.0 a 1.0)
            const serviceHealthRatio = this.state.totalServices > 0 ? 
                healthyCount / this.state.totalServices : 0;
            
            const memoryHealth = this.memoryOptimizer ? 
                (1 - this.memoryOptimizer.getStats().memory.percentage / 100) : 1;
            
            const recoveryHealth = this.state.serviceRecovery.totalRecoveries < 10 ? 1 : 
                Math.max(0.3, 1 - (this.state.serviceRecovery.totalRecoveries / 100));

            this.state.systemHealth = (serviceHealthRatio + memoryHealth + recoveryHealth) / 3;

            // Actualizar estado de memoria
            if (this.memoryOptimizer) {
                const memStats = this.memoryOptimizer.getStats();
                this.state.memoryOptimizer.memoryUsage = memStats.memory.percentage;
                this.state.memoryOptimizer.lastCleanup = memStats.lastCleanup;
                
                if (memStats.memory.percentage > 90) {
                    this.state.memoryOptimizer.alertLevel = 'critical';
                } else if (memStats.memory.percentage > 80) {
                    this.state.memoryOptimizer.alertLevel = 'high';
                } else {
                    this.state.memoryOptimizer.alertLevel = 'normal';
                }
            }

            // Verificar si el sistema está operacional
            const criticalServicesNeeded = Object.values(this.config.services)
                .filter(service => service.critical).length;
            
            this.state.operational = criticalCount >= criticalServicesNeeded && 
                this.state.systemHealth > 0.5;

            // Log de estado crítico
            if (this.state.systemHealth < 0.3) {
                this.logger.error(`🚨 SISTEMA EN ESTADO CRÍTICO - Salud: ${(this.state.systemHealth * 100).toFixed(1)}%`);
            } else if (this.state.systemHealth < 0.7) {
                this.logger.warn(`⚠️ Sistema con problemas - Salud: ${(this.state.systemHealth * 100).toFixed(1)}%`);
            }

            // Registrar evento del sistema
            this.recordSystemEvent('health_check', {
                systemHealth: this.state.systemHealth,
                healthyServices: healthyCount,
                totalServices: this.state.totalServices,
                operational: this.state.operational
            });

        } catch (error) {
            this.logger.error('❌ Error en health check del sistema:', error);
            this.state.systemHealth = 0.1; // Salud mínima en caso de error
        }
    }

    /**
     * Actualizar métricas de rendimiento
     */
    async updatePerformanceMetrics() {
        // Limpiar requests antiguos (mantener solo últimos 5 minutos)
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        
        const recentRequests = Array.from(this.metrics.requests.entries())
            .filter(([timestamp]) => timestamp > fiveMinutesAgo);
        
        this.metrics.requests.clear();
        recentRequests.forEach(([timestamp, request]) => {
            this.metrics.requests.set(timestamp, request);
        });

        // Calcular métricas
        this.state.performance.totalRequests = recentRequests.length;
        
        // Actualizar métricas de recovery
        if (this.serviceRecovery) {
            const recoveryStats = this.serviceRecovery.getServicesStatus();
            this.state.serviceRecovery.totalRecoveries = Object.values(recoveryStats)
                .reduce((sum, service) => sum + service.restartCount, 0);
        }
    }

    /**
     * Obtener métricas del sistema
     */
    getSystemMetrics() {
        return {
            uptime: Date.now() - this.state.performance.uptime,
            systemHealth: this.state.systemHealth,
            services: {
                total: this.state.totalServices,
                healthy: this.state.healthyServices,
                critical: this.state.criticalServices
            },
            memory: this.memoryOptimizer ? this.memoryOptimizer.getStats() : null,
            recovery: {
                totalRecoveries: this.state.serviceRecovery.totalRecoveries,
                lastRecovery: this.state.serviceRecovery.lastRecovery
            },
            requests: this.state.performance.totalRequests,
            errorRate: this.state.performance.errorRate
        };
    }

    /**
     * Obtener métricas de rendimiento
     */
    getPerformanceMetrics() {
        const now = Date.now();
        const uptime = now - this.state.performance.uptime;
        
        return {
            uptime,
            uptimeFormatted: this.formatUptime(uptime),
            systemHealth: this.state.systemHealth,
            memoryUsage: this.state.memoryOptimizer.memoryUsage,
            totalRequests: this.state.performance.totalRequests,
            avgResponseTime: this.state.performance.avgResponseTime,
            errorRate: this.state.performance.errorRate,
            totalRecoveries: this.state.serviceRecovery.totalRecoveries
        };
    }

    /**
     * Formatear uptime
     */
    formatUptime(uptimeMs) {
        const seconds = Math.floor(uptimeMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else {
            return `${minutes}m ${seconds % 60}s`;
        }
    }

    /**
     * Manejar emergencia de memoria
     */
    async handleMemoryEmergency(data) {
        this.logger.error('🆘 EMERGENCIA DE MEMORIA DETECTADA', data);
        
        this.recordSystemEvent('memory_emergency', {
            memoryPercentage: data.percentage,
            memoryUsed: data.used,
            timestamp: data.timestamp
        });

        // Acciones de emergencia
        if (this.memoryOptimizer) {
            try {
                await this.memoryOptimizer.performEmergencyCleanup();
                this.logger.info('🧹 Limpieza de emergencia ejecutada');
            } catch (error) {
                this.logger.error('❌ Error en limpieza de emergencia:', error);
            }
        }

        // Notificar a través de WebSocket
        this.broadcastEmergencyEvent('memory_emergency', data);
    }

    /**
     * Registrar evento del sistema
     */
    recordSystemEvent(type, data) {
        const event = {
            type,
            data,
            timestamp: Date.now(),
            id: this.rng.getSecureFloat().toString(36).substr(2, 9)
        };

        this.metrics.systemEvents.push(event);

        // Mantener solo los últimos 1000 eventos
        if (this.metrics.systemEvents.length > 1000) {
            this.metrics.systemEvents = this.metrics.systemEvents.slice(-1000);
        }

        // Debug log para eventos importantes
        if (['memory_emergency', 'service_failure', 'system_critical'].includes(type)) {
            this.logger.info(`📝 Evento del sistema registrado: ${type}`, data);
        }
    }

    /**
     * Broadcast de actualización del sistema
     */
    broadcastSystemUpdate() {
        const systemUpdate = {
            type: 'system_update',
            data: {
                timestamp: Date.now(),
                systemHealth: this.state.systemHealth,
                services: this.serviceRecovery ? this.serviceRecovery.getServicesStatus() : {},
                memory: this.memoryOptimizer ? this.memoryOptimizer.getStats() : null,
                performance: this.getPerformanceMetrics()
            }
        };

        this.wsServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(systemUpdate));
            }
        });
    }

    /**
     * Broadcast de evento de emergencia
     */
    broadcastEmergencyEvent(type, data) {
        const emergencyEvent = {
            type: 'emergency_event',
            data: {
                emergencyType: type,
                timestamp: Date.now(),
                details: data
            }
        };

        this.wsServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(emergencyEvent));
            }
        });
    }

    /**
     * Shutdown graceful
     */
    async shutdown() {
        this.logger.info('🔄 Cerrando Enhanced Master Control...');

        this.state.operational = false;

        // Detener timers
        if (this.healthTimer) {
            clearInterval(this.healthTimer);
        }
        
        if (this.performanceTimer) {
            clearInterval(this.performanceTimer);
        }

        // Cerrar Service Recovery Manager
        if (this.serviceRecovery) {
            await this.serviceRecovery.shutdown();
        }

        // Cerrar Memory Optimizer
        if (this.memoryOptimizer) {
            await this.memoryOptimizer.shutdown();
        }

        // Cerrar servidores
        if (this.wsServer) {
            this.wsServer.close();
        }
        
        if (this.server) {
            this.server.close();
        }

        this.logger.info('✅ Enhanced Master Control cerrado correctamente');
    }
}

// Inicializar y exportar si se ejecuta directamente
if (require.main === module) {
    const enhancedMaster = new EnhancedMasterControl();
    
    // Manejo de señales para shutdown graceful
    process.on('SIGTERM', async () => {
        await enhancedMaster.shutdown();
        process.exit(0);
    });
    
    process.on('SIGINT', async () => {
        await enhancedMaster.shutdown();
        process.exit(0);
    });
    
    // Manejo de errores no capturados
    process.on('uncaughtException', (error) => {
        console.error('💀 Uncaught Exception:', error);
        enhancedMaster.shutdown().then(() => process.exit(1));
    });
    
    process.on('unhandledRejection', (reason, promise) => {
        console.error('💀 Unhandled Rejection at:', promise, 'reason:', reason);
        enhancedMaster.shutdown().then(() => process.exit(1));
    });
}

module.exports = EnhancedMasterControl;

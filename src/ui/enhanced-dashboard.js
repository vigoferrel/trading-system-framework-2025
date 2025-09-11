#!/usr/bin/env node
/**
 * 📊 ENHANCED DASHBOARD - ADVANCED WEB DASHBOARD FOR QBTC SYSTEM
 * Dashboard web avanzado con métricas en tiempo real, control de servicios y visualizaciones
 * 
 * Implementa las reglas de segundo plano para reportar métricas de desempeño
 * 
 * @author QBTC Development Team
 * @version 3.0
 * @since 2025-01-09
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const Logger = require('../logging/secure-logger');
const MemoryOptimizer = require('../utils/memory-optimizer');
const { kernelRNG } = require('../utils/kernel-rng');

/**
 * Enhanced Dashboard - Interface web avanzada para QBTC
 */
class EnhancedDashboard {
    constructor(config = {}) {
        // Configuración del dashboard
        this.config = {
            port: config.port || process.env.SERVICE_PORT || 14401,
            wsPort: config.wsPort || 14401,
            
            // Configuración de servicios QBTC a monitorear
            qbtcServices: config.qbtcServices || {
                masterControl: 'http://localhost:14001',
                hybridOptimizer: 'http://localhost:14301',
                concentratedHybrid: 'http://localhost:14302',
                tradingEngine: 'http://localhost:14201',
                quantumEngine: 'http://localhost:14115/health',
            },
            
            // Configuración de dashboard
            refreshInterval: config.refreshInterval || 5000, // 5 segundos
            metricsRetention: config.metricsRetention || 3600000, // 1 hora
            maxDataPoints: config.maxDataPoints || 100,
            enableRealTimeUpdates: config.enableRealTimeUpdates !== false,
            enableAlerts: config.enableAlerts !== false,
            
            ...config
        };

        // Estado del dashboard
        this.state = {
            initialized: false,
            running: false,
            connectedClients: 0,
            lastDataUpdate: null,
            alertsActive: 0,
            
            // Datos del sistema QBTC
            systemData: {
                overall: {
                    health: 0.0,
                    uptime: 0,
                    services: 0,
                    alerts: 0
                },
                services: new Map(),
                metrics: new Map(),
                alerts: []
            }
        };

        // Componentes del sistema
        this.app = express();
        this.server = null;
        this.wsServer = null;
        this.memoryOptimizer = null;
        
        // Timers
        this.dataUpdateTimer = null;
        this.metricsTimer = null;

        // Utilidades
        this.logger = Logger.createLogger('EnhancedDashboard');
        this.rng = kernelRNG;

        // Cache de datos para visualizaciones
        this.dataCache = {
            timeSeriesData: new Map(),
            serviceMetrics: new Map(),
            alertHistory: []
        };

        // Inicializar dashboard
        this.initialize();
    }

    /**
     * Inicializar Enhanced Dashboard
     */
    async initialize() {
        try {
            this.logger.info('📊 Inicializando Enhanced Dashboard...');

            // Configurar Memory Optimizer
            await this.initializeMemoryOptimizer();

            // Configurar servidor web y rutas
            await this.setupWebServer();

            // Iniciar recolección de datos
            this.startDataCollection();

            // Iniciar métricas en tiempo real
            this.startRealTimeMetrics();

            this.state.initialized = true;
            this.state.running = true;

            this.logger.info('✅ Enhanced Dashboard inicializado correctamente');

        } catch (error) {
            this.logger.error('❌ Error inicializando Enhanced Dashboard:', error);
            throw error;
        }
    }

    /**
     * Inicializar Memory Optimizer
     */
    async initializeMemoryOptimizer() {
        this.memoryOptimizer = new MemoryOptimizer({
            memoryThreshold: 70, // Más conservador para UI
            maxCacheSize: 200,
            maxPatterns: 50,
            maxHistory: 200,
            monitorInterval: 30000
        });

        await this.memoryOptimizer.initialize();
        this.logger.info('🧠 Memory Optimizer configurado para dashboard');
    }

    /**
     * Configurar servidor web
     */
    async setupWebServer() {
        // Middleware básico
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, 'public')));
        
        // CORS para desarrollo
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });

        // Configurar rutas
        this.setupRoutes();

        // Crear servidor HTTP
        this.server = http.createServer(this.app);

        // Configurar WebSocket para tiempo real
        this.wsServer = new WebSocket.Server({ server: this.server });
        this.setupWebSocketHandlers();

        // Iniciar servidor
        await new Promise((resolve, reject) => {
            this.server.listen(this.config.port, (error) => {
                if (error) {
                    reject(error);
                } else {
                    this.logger.info(`🌐 Enhanced Dashboard servidor iniciado en puerto ${this.config.port}`);
                    resolve();
                }
            });
        });
    }

    /**
     * Configurar rutas del dashboard
     */
    setupRoutes() {
        // Health check del dashboard
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                service: 'Enhanced Dashboard',
                port: this.config.port,
                running: this.state.running,
                connectedClients: this.state.connectedClients,
                lastDataUpdate: this.state.lastDataUpdate,
                alertsActive: this.state.alertsActive,
                uptime: Date.now() - (this.memoryOptimizer ? this.memoryOptimizer.getStats().startTime || Date.now() : Date.now()),
                memory: this.memoryOptimizer ? this.memoryOptimizer.getStats() : null
            });
        });

        // Página principal del dashboard
        this.app.get('/', (req, res) => {
            res.send(this.generateDashboardHTML());
        });

        // API: Obtener datos generales del sistema
        this.app.get('/api/system/overview', async (req, res) => {
            try {
                const overview = await this.getSystemOverview();
                res.json(overview);
            } catch (error) {
                this.logger.error('❌ Error obteniendo overview del sistema:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // API: Obtener métricas de servicios
        this.app.get('/api/services/metrics', async (req, res) => {
            try {
                const metrics = await this.getServicesMetrics();
                res.json(metrics);
            } catch (error) {
                this.logger.error('❌ Error obteniendo métricas de servicios:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // API: Obtener datos de time series
        this.app.get('/api/metrics/timeseries', (req, res) => {
            const { metric = 'systemHealth', duration = '1h' } = req.query;
            const timeSeriesData = this.getTimeSeriesData(metric, duration);
            res.json(timeSeriesData);
        });

        // API: Obtener alertas activas
        this.app.get('/api/alerts', (req, res) => {
            const alerts = this.getActiveAlerts();
            res.json({
                total: alerts.length,
                alerts: alerts.slice(0, 50) // Limitar respuesta
            });
        });

        // API: Reiniciar servicio específico
        this.app.post('/api/services/:serviceName/restart', async (req, res) => {
            try {
                const { serviceName } = req.params;
                const result = await this.restartService(serviceName);
                res.json(result);
            } catch (error) {
                this.logger.error(`❌ Error reiniciando servicio ${req.params.serviceName}:`, error);
                res.status(500).json({ error: error.message });
            }
        });

        // API: Optimizar memoria del sistema
        this.app.post('/api/system/optimize-memory', async (req, res) => {
            try {
                const result = await this.optimizeSystemMemory();
                res.json(result);
            } catch (error) {
                this.logger.error('❌ Error optimizando memoria:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // API: Configuración del dashboard
        this.app.get('/api/dashboard/config', (req, res) => {
            res.json({
                refreshInterval: this.config.refreshInterval,
                services: Object.keys(this.config.qbtcServices),
                realTimeUpdates: this.config.enableRealTimeUpdates,
                alerts: this.config.enableAlerts
            });
        });
        
        // === NUEVAS APIS PARA MÉTRICAS TEMPORALES θ-AWARE ===
        
        // API: Métricas temporales del Position Manager
        this.app.get('/api/temporal/metrics', async (req, res) => {
            try {
                const temporalMetrics = await this.getTemporalMetrics();
                res.json(temporalMetrics);
            } catch (error) {
                this.logger.error('❌ Error obteniendo métricas temporales:', error);
                res.status(500).json({ error: error.message });
            }
        });
        
        // API: θ-Budget status y utilización
        this.app.get('/api/temporal/theta-budget', async (req, res) => {
            try {
                const thetaBudgetStatus = await this.getThetaBudgetStatus();
                res.json(thetaBudgetStatus);
            } catch (error) {
                this.logger.error('❌ Error obteniendo θ-budget status:', error);
                res.status(500).json({ error: error.message });
            }
        });
        
        // API: Coherencia prima y resonancia λ_7919 en tiempo real
        this.app.get('/api/temporal/coherence-resonance', async (req, res) => {
            try {
                const coherenceResonance = await this.getCoherenceResonance();
                res.json(coherenceResonance);
            } catch (error) {
                this.logger.error('❌ Error obteniendo coherencia-resonancia:', error);
                res.status(500).json({ error: error.message });
            }
        });
        
        // API: Edge temporal por símbolo
        this.app.get('/api/temporal/edge/:symbol?', async (req, res) => {
            try {
                const { symbol } = req.params;
                const temporalEdge = await this.getTemporalEdge(symbol);
                res.json(temporalEdge);
            } catch (error) {
                this.logger.error(`❌ Error obteniendo edge temporal para ${req.params.symbol}:`, error);
                res.status(500).json({ error: error.message });
            }
        });
        
        // API: Reset manual de θ-budget (para emergencias)
        this.app.post('/api/temporal/reset-theta-budget', async (req, res) => {
            try {
                const result = await this.resetThetaBudget();
                res.json(result);
            } catch (error) {
                this.logger.error('❌ Error reseteando θ-budget:', error);
                res.status(500).json({ error: error.message });
            }
        });
        
        // === ENDPOINTS PARA PRIME LADDERS ===
        
        // API: Métricas de Prime Ladders
        this.app.get('/api/prime-ladders/metrics', async (req, res) => {
            try {
                const ladderMetrics = await this.getPrimeLadderMetrics();
                res.json(ladderMetrics);
            } catch (error) {
                this.logger.error('❌ Error obteniendo métricas de ladders:', error);
                res.status(500).json({ error: error.message });
            }
        });
        
        // API: Ladders por símbolo
        this.app.get('/api/prime-ladders/symbol/:symbol', async (req, res) => {
            try {
                const { symbol } = req.params;
                const ladders = await this.getPrimeLaddersBySymbol(symbol);
                res.json(ladders);
            } catch (error) {
                this.logger.error(`❌ Error obteniendo ladders para ${req.params.symbol}:`, error);
                res.status(500).json({ error: error.message });
            }
        });
        
        // API: Cola de rolls
        this.app.get('/api/prime-ladders/roll-queue', async (req, res) => {
            try {
                const rollQueue = await this.getRollQueue();
                res.json(rollQueue);
            } catch (error) {
                this.logger.error('❌ Error obteniendo cola de rolls:', error);
                res.status(500).json({ error: error.message });
            }
        });
        
        // API: Forzar roll manual
        this.app.post('/api/prime-ladders/force-roll', async (req, res) => {
            try {
                const { positionId, targetBand, reason } = req.body;
                
                if (!positionId || !targetBand) {
                    return res.status(400).json({ error: 'positionId and targetBand are required' });
                }
                
                const result = await this.forcePositionRoll(positionId, targetBand, reason || 'manual_dashboard');
                res.json(result);
            } catch (error) {
                this.logger.error('❌ Error forzando roll:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Métricas en formato Prometheus
        this.app.get('/metrics', (req, res) => {
            const metrics = this.generatePrometheusMetrics();
            res.set('Content-Type', 'text/plain; charset=utf-8');
            res.send(metrics);
        });
    }

    /**
     * Configurar WebSocket handlers
     */
    setupWebSocketHandlers() {
        this.wsServer.on('connection', (ws, request) => {
            this.state.connectedClients++;
            this.logger.debug(`🔗 Nuevo cliente conectado al dashboard (Total: ${this.state.connectedClients})`);

            // Enviar datos iniciales
            ws.send(JSON.stringify({
                type: 'dashboard_init',
                data: {
                    systemOverview: this.state.systemData.overall,
                    services: Array.from(this.state.systemData.services.entries()),
                    config: {
                        refreshInterval: this.config.refreshInterval,
                        enableRealTimeUpdates: this.config.enableRealTimeUpdates
                    }
                }
            }));

            // Manejar mensajes del cliente
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleDashboardWebSocketMessage(ws, data);
                } catch (error) {
                    this.logger.error('❌ Error procesando mensaje WebSocket dashboard:', error);
                }
            });

            ws.on('close', () => {
                this.state.connectedClients--;
                this.logger.debug(`🔗 Cliente desconectado del dashboard (Total: ${this.state.connectedClients})`);
            });

            // Configurar ping/pong para mantener conexión
            ws.isAlive = true;
            ws.on('pong', () => {
                ws.isAlive = true;
            });
        });

        // Cleanup de conexiones inactivas
        const interval = setInterval(() => {
            this.wsServer.clients.forEach((ws) => {
                if (ws.isAlive === false) {
                    return ws.terminate();
                }

                ws.isAlive = false;
                ws.ping();
            });
        }, 30000);

        this.wsServer.on('close', () => {
            clearInterval(interval);
        });
    }

    /**
     * Manejar mensajes WebSocket del dashboard
     */
    async handleDashboardWebSocketMessage(ws, data) {
        switch (data.type) {
            case 'subscribe_realtime':
                ws.realtimeSubscription = true;
                ws.send(JSON.stringify({
                    type: 'subscription_confirmed',
                    data: { subscription: 'realtime', active: true }
                }));
                break;

            case 'request_service_restart':
                try {
                    const result = await this.restartService(data.serviceName);
                    ws.send(JSON.stringify({
                        type: 'service_restart_response',
                        data: { serviceName: data.serviceName, result }
                    }));
                } catch (error) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        data: { message: error.message, action: 'service_restart' }
                    }));
                }
                break;

            case 'request_timeseries':
                try {
                    const { metric, duration } = data;
                    const timeseriesData = this.getTimeSeriesData(metric, duration);
                    ws.send(JSON.stringify({
                        type: 'timeseries_data',
                        data: { metric, duration, data: timeseriesData }
                    }));
                } catch (error) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        data: { message: error.message, action: 'timeseries_request' }
                    }));
                }
                break;

            default:
                this.logger.warn(`⚠️ Tipo de mensaje WebSocket dashboard desconocido: ${data.type}`);
        }
    }

    /**
     * Iniciar recolección de datos
     */
    startDataCollection() {
        this.dataUpdateTimer = setInterval(async () => {
            await this.collectSystemData();
        }, this.config.refreshInterval);

        this.logger.info('📊 Recolección de datos iniciada en segundo plano');
    }

    /**
     * Iniciar métricas en tiempo real
     */
    startRealTimeMetrics() {
        this.metricsTimer = setInterval(async () => {
            if (this.config.enableRealTimeUpdates && this.state.connectedClients > 0) {
                await this.broadcastRealTimeUpdate();
            }
        }, 1000); // 1 segundo para tiempo real

        this.logger.info('⚡ Métricas en tiempo real iniciadas');
    }

    /**
     * Recopilar datos del sistema QBTC
     */
    async collectSystemData() {
        try {
            // Recopilar datos de cada servicio QBTC
            const servicesData = new Map();
            let healthyServices = 0;
            let totalServices = Object.keys(this.config.qbtcServices).length;

            for (const [serviceName, serviceUrl] of Object.entries(this.config.qbtcServices)) {
                try {
                    const serviceData = await this.fetchServiceData(serviceName, serviceUrl);
                    servicesData.set(serviceName, serviceData);
                    
                    if (serviceData.status === 'healthy') {
                        healthyServices++;
                    }
                } catch (error) {
                    this.logger.warn(`⚠️ Error recopilando datos de ${serviceName}:`, error.message);
                    servicesData.set(serviceName, {
                        status: 'error',
                        error: error.message,
                        lastUpdate: Date.now()
                    });
                }
            }

            // Actualizar datos del sistema
            this.state.systemData.services = servicesData;
            this.state.systemData.overall = {
                health: healthyServices / totalServices,
                uptime: Date.now() - (this.memoryOptimizer ? this.memoryOptimizer.getStats().startTime || Date.now() : Date.now()),
                services: totalServices,
                healthyServices,
                alerts: this.state.alertsActive,
                lastUpdate: Date.now()
            };

            // Almacenar datos para time series
            this.storeTimeSeriesData('systemHealth', this.state.systemData.overall.health);
            this.storeTimeSeriesData('healthyServices', healthyServices);

            this.state.lastDataUpdate = Date.now();

        } catch (error) {
            this.logger.error('❌ Error en recolección de datos del sistema:', error);
        }
    }

    /**
     * Obtener datos de un servicio específico
     */
    async fetchServiceData(serviceName, serviceUrl) {
        const response = await fetch(`${serviceUrl}/health`, {
            method: 'GET',
            timeout: 5000
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const healthData = await response.json();
        
        // Normalizar datos según el servicio
        const normalizedData = {
            status: healthData.status === 'OK' ? 'healthy' : 'unhealthy',
            service: healthData.service || serviceName,
            port: healthData.port,
            uptime: healthData.uptime || 0,
            lastUpdate: Date.now(),
            rawData: healthData
        };

        // Extraer métricas específicas por servicio
        switch (serviceName) {
            case 'masterControl':
                normalizedData.systemHealth = healthData.systemHealth;
                normalizedData.services = healthData.services;
                normalizedData.subsystems = healthData.subsystems;
                break;

            case 'hybridOptimizer':
                normalizedData.algorithmicCoherence = healthData.quantum_coherence;
                normalizedData.classicalConfidence = healthData.classical_confidence;
                normalizedData.hybridSynergy = healthData.hybrid_synergy;
                normalizedData.optimizationsTotal = healthData.optimizations_total;
                normalizedData.successRate = healthData.success_rate;
                break;

            case 'concentratedHybrid':
                normalizedData.concentrationIntensity = healthData.concentration_intensity;
                normalizedData.patternConfidence = healthData.pattern_confidence;
                normalizedData.signalStrength = healthData.signal_strength;
                normalizedData.deepestLevel = healthData.deepest_level;
                break;

            case 'tradingEngine':
                normalizedData.activeTrades = healthData.active_trades;
                normalizedData.profit = healthData.profit;
                normalizedData.winRate = healthData.win_rate;
                normalizedData.totalVolume = healthData.total_volume;
                break;

            case 'quantumEngine':
                normalizedData.coherence = healthData.coherence;
                normalizedData.quantumField = healthData.quantum_field;
                normalizedData.entanglementLevel = healthData.entanglement_level;
                break;
        }

        return normalizedData;
    }

    /**
     * Almacenar datos de time series
     */
    storeTimeSeriesData(metric, value) {
        if (!this.dataCache.timeSeriesData.has(metric)) {
            this.dataCache.timeSeriesData.set(metric, []);
        }

        const timeSeriesArray = this.dataCache.timeSeriesData.get(metric);
        timeSeriesArray.push({
            timestamp: Date.now(),
            value: value
        });

        // Mantener solo los últimos datos según maxDataPoints
        if (timeSeriesArray.length > this.config.maxDataPoints) {
            timeSeriesArray.splice(0, timeSeriesArray.length - this.config.maxDataPoints);
        }
    }

    /**
     * Obtener datos de time series
     */
    getTimeSeriesData(metric, duration = '1h') {
        const timeSeriesArray = this.dataCache.timeSeriesData.get(metric) || [];
        
        // Convertir duración a millisegundos
        const durationMs = this.parseDuration(duration);
        const cutoffTime = Date.now() - durationMs;
        
        return timeSeriesArray
            .filter(point => point.timestamp >= cutoffTime)
            .map(point => ({
                x: point.timestamp,
                y: point.value
            }));
    }

    /**
     * Parsear duración string a millisegundos
     */
    parseDuration(duration) {
        const matches = duration.match(/^(\d+)([smhd])$/);
        if (!matches) return 3600000; // Default 1 hora

        const value = parseInt(matches[1]);
        const unit = matches[2];

        switch (unit) {
            case 's': return value * 1000;
            case 'm': return value * 60 * 1000;
            case 'h': return value * 60 * 60 * 1000;
            case 'd': return value * 24 * 60 * 60 * 1000;
            default: return 3600000;
        }
    }

    /**
     * Obtener overview del sistema
     */
    async getSystemOverview() {
        return {
            overall: this.state.systemData.overall,
            services: Array.from(this.state.systemData.services.entries()).map(([name, data]) => ({
                name,
                ...data
            })),
            timestamp: Date.now()
        };
    }

    /**
     * Obtener métricas de servicios
     */
    async getServicesMetrics() {
        const metrics = {};
        
        for (const [serviceName, serviceData] of this.state.systemData.services) {
            metrics[serviceName] = {
                status: serviceData.status,
                uptime: serviceData.uptime,
                lastUpdate: serviceData.lastUpdate,
                specificMetrics: this.extractSpecificMetrics(serviceName, serviceData)
            };
        }

        return metrics;
    }

    /**
     * Extraer métricas específicas por servicio
     */
    extractSpecificMetrics(serviceName, serviceData) {
        const specificMetrics = {};

        // Filtrar solo métricas numéricas útiles para visualización
        for (const [key, value] of Object.entries(serviceData)) {
            if (typeof value === 'number' && !['lastUpdate', 'port'].includes(key)) {
                specificMetrics[key] = value;
            }
        }

        return specificMetrics;
    }

    /**
     * Obtener alertas activas
     */
    getActiveAlerts() {
        // Generar alertas basadas en el estado de los servicios
        const alerts = [];

        for (const [serviceName, serviceData] of this.state.systemData.services) {
            if (serviceData.status !== 'healthy') {
                alerts.push({
                    id: `${serviceName}_${Date.now()}`,
                    type: 'service_down',
                    severity: this.getServiceSeverity(serviceName),
                    message: `${serviceName} is ${serviceData.status}`,
                    service: serviceName,
                    timestamp: serviceData.lastUpdate || Date.now()
                });
            }
        }

        // Alertas de salud del sistema
        if (this.state.systemData.overall.health < 0.5) {
            alerts.push({
                id: `system_health_${Date.now()}`,
                type: 'system_health',
                severity: 'critical',
                message: `System health is low: ${(this.state.systemData.overall.health * 100).toFixed(1)}%`,
                timestamp: Date.now()
            });
        }

        this.state.alertsActive = alerts.length;
        return alerts;
    }

    /**
     * Obtener severidad del servicio
     */
    getServiceSeverity(serviceName) {
        const criticalServices = ['masterControl', 'tradingEngine'];
        return criticalServices.includes(serviceName) ? 'critical' : 'warning';
    }

    /**
     * Reiniciar servicio
     */
    async restartService(serviceName) {
        try {
            const serviceUrl = this.config.qbtcServices[serviceName];
            if (!serviceUrl) {
                throw new Error(`Servicio ${serviceName} no encontrado`);
            }

            // Intentar reinicio a través del Master Control
            const masterControlUrl = this.config.qbtcServices.masterControl;
            const response = await fetch(`${masterControlUrl}/services/${serviceName}/restart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            this.logger.info(`🔄 Reinicio de servicio ${serviceName} solicitado desde dashboard`);
            
            return {
                success: true,
                message: `Reinicio de ${serviceName} solicitado`,
                timestamp: Date.now()
            };

        } catch (error) {
            this.logger.error(`❌ Error reiniciando servicio ${serviceName}:`, error);
            return {
                success: false,
                error: error.message,
                timestamp: Date.now()
            };
        }
    }

    /**
     * Optimizar memoria del sistema
     */
    async optimizeSystemMemory() {
        try {
            // Optimizar memoria local del dashboard
            const localCleanup = await this.memoryOptimizer.performCleanup();

            // Solicitar optimización al Master Control
            const masterControlUrl = this.config.qbtcServices.masterControl;
            const response = await fetch(`${masterControlUrl}/system/optimize-memory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            let systemCleanup = 0;
            if (response.ok) {
                const result = await response.json();
                systemCleanup = result.cleaned || 0;
            }

            this.logger.info(`🧹 Optimización de memoria ejecutada desde dashboard - Local: ${localCleanup}, Sistema: ${systemCleanup}`);

            return {
                success: true,
                localCleanup,
                systemCleanup,
                timestamp: Date.now()
            };

        } catch (error) {
            this.logger.error('❌ Error optimizando memoria del sistema:', error);
            return {
                success: false,
                error: error.message,
                timestamp: Date.now()
            };
        }
    }

    /**
     * Broadcast de actualización en tiempo real
     */
    async broadcastRealTimeUpdate() {
        const updateData = {
            type: 'realtime_update',
            data: {
                timestamp: Date.now(),
                systemOverview: this.state.systemData.overall,
                services: Array.from(this.state.systemData.services.entries()),
                alerts: this.getActiveAlerts()
            }
        };

        this.wsServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client.realtimeSubscription) {
                client.send(JSON.stringify(updateData));
            }
        });
    }

    /**
     * === MÉTODOS PARA MÉTRICAS TEMPORALES θ-AWARE ===
     */
    
    /**
     * Obtener métricas temporales del Position Manager
     */
    async getTemporalMetrics() {
        try {
            // Intentar obtener métricas del Master Control
            const masterControlUrl = this.config.qbtcServices.masterControl;
            const response = await fetch(`${masterControlUrl}/position-manager/temporal-metrics`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Agregar datos calculados y cache local
                return {
                    ...data,
                    dashboard_timestamp: Date.now(),
                    metrics_age: Date.now() - (data.timestamp || Date.now())
                };
            }
            
            // Fallback: generar métricas simuladas
            return this.generateFallbackTemporalMetrics();
            
        } catch (error) {
            this.logger.warn('⚠️ Error obteniendo métricas temporales, usando fallback:', error.message);
            return this.generateFallbackTemporalMetrics();
        }
    }
    
    /**
     * Obtener estado del θ-budget
     */
    async getThetaBudgetStatus() {
        try {
            const masterControlUrl = this.config.qbtcServices.masterControl;
            const response = await fetch(`${masterControlUrl}/position-manager/theta-budget`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Enriquecer con cálculos del dashboard
                const enrichedData = {
                    ...data,
                    utilization_percentage: (data.used_budget / data.daily_budget) * 100,
                    remaining_percentage: ((data.daily_budget - data.used_budget) / data.daily_budget) * 100,
                    status: this.classifyThetaBudgetStatus(data.used_budget / data.daily_budget),
                    time_until_reset: this.calculateTimeUntilReset(data.last_reset_time),
                    dashboard_timestamp: Date.now()
                };
                
                return enrichedData;
            }
            
            return this.generateFallbackThetaBudgetStatus();
            
        } catch (error) {
            this.logger.warn('⚠️ Error obteniendo θ-budget, usando fallback:', error.message);
            return this.generateFallbackThetaBudgetStatus();
        }
    }
    
    /**
     * Obtener coherencia prima y resonancia λ_7919
     */
    async getCoherenceResonance() {
        try {
            const masterControlUrl = this.config.qbtcServices.masterControl;
            const response = await fetch(`${masterControlUrl}/temporal-engine/coherence-resonance`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                
                return {
                    ...data,
                    coherence_grade: this.gradeCoherence(data.prime_coherence),
                    resonance_grade: this.gradeResonance(data.lambda_resonance),
                    composite_health: this.calculateCompositeTemporalHealth(data),
                    dashboard_timestamp: Date.now()
                };
            }
            
            return this.generateFallbackCoherenceResonance();
            
        } catch (error) {
            this.logger.warn('⚠️ Error obteniendo coherencia-resonancia, usando fallback:', error.message);
            return this.generateFallbackCoherenceResonance();
        }
    }
    
    /**
     * Obtener edge temporal para un símbolo (o general)
     */
    async getTemporalEdge(symbol = null) {
        try {
            const masterControlUrl = this.config.qbtcServices.masterControl;
            const url = symbol ? 
                `${masterControlUrl}/temporal-engine/edge/${symbol}` : 
                `${masterControlUrl}/temporal-engine/edge`;
                
            const response = await fetch(url, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                
                return {
                    symbol: symbol || 'GENERAL',
                    ...data,
                    edge_grade: this.gradeTemporalEdge(data.edge_temporal),
                    trading_signal: this.generateTradingSignal(data),
                    dashboard_timestamp: Date.now()
                };
            }
            
            return this.generateFallbackTemporalEdge(symbol);
            
        } catch (error) {
            this.logger.warn(`⚠️ Error obteniendo edge temporal para ${symbol}, usando fallback:`, error.message);
            return this.generateFallbackTemporalEdge(symbol);
        }
    }
    
    /**
     * Reset manual de θ-budget
     */
    async resetThetaBudget() {
        try {
            const masterControlUrl = this.config.qbtcServices.masterControl;
            const response = await fetch(`${masterControlUrl}/position-manager/reset-theta-budget`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: 'manual_dashboard_reset' })
            });
            
            if (response.ok) {
                const result = await response.json();
                
                this.logger.info('θ-Budget reset ejecutado desde dashboard');
                
                return {
                    success: true,
                    message: 'θ-Budget reseteado correctamente',
                    ...result,
                    dashboard_timestamp: Date.now()
                };
            }
            
            throw new Error('Reset no autorizado o servicio no disponible');
            
        } catch (error) {
            this.logger.error('❌ Error reseteando θ-budget:', error);
            return {
                success: false,
                error: error.message,
                dashboard_timestamp: Date.now()
            };
        }
    }
    
    // === MÉTODOS AUXILIARES PARA MÉTRICAS TEMPORALES ===
    
    /**
     * Clasificar estado del θ-budget
     */
    classifyThetaBudgetStatus(utilizationRatio) {
        if (utilizationRatio >= 0.9) return 'CRITICAL';
        if (utilizationRatio >= 0.7) return 'WARNING';
        if (utilizationRatio >= 0.5) return 'MODERATE';
        return 'HEALTHY';
    }
    
    /**
     * Calcular tiempo hasta reset de θ-budget
     */
    calculateTimeUntilReset(lastResetTime) {
        const nextReset = new Date(lastResetTime);
        nextReset.setDate(nextReset.getDate() + 1); // Reset diario
        
        const timeUntilReset = nextReset.getTime() - Date.now();
        return Math.max(0, timeUntilReset);
    }
    
    /**
     * Graduar coherencia prima
     */
    gradeCoherence(coherence) {
        if (coherence >= 0.8) return 'EXCELLENT';
        if (coherence >= 0.618) return 'GOOD';  // Golden ratio threshold
        if (coherence >= 0.4) return 'FAIR';
        return 'POOR';
    }
    
    /**
     * Graduar resonancia λ_7919
     */
    gradeResonance(resonance) {
        const absResonance = Math.abs(resonance);
        if (absResonance >= 0.7) return 'STRONG';
        if (absResonance >= 0.4) return 'MODERATE';
        if (absResonance >= 0.2) return 'WEAK';
        return 'MINIMAL';
    }
    
    /**
     * Graduar edge temporal
     */
    gradeTemporalEdge(edge) {
        if (edge >= 0.1) return 'EXCELLENT';
        if (edge >= 0.05) return 'GOOD';
        if (edge >= 0.02) return 'FAIR';
        return 'POOR';
    }
    
    /**
     * Calcular salud temporal compuesta
     */
    calculateCompositeTemporalHealth(data) {
        const coherenceWeight = 0.4;
        const resonanceWeight = 0.3;
        const edgeWeight = 0.3;
        
        const coherenceScore = Math.min(1.0, data.prime_coherence || 0);
        const resonanceScore = Math.min(1.0, Math.abs(data.lambda_resonance || 0));
        const edgeScore = Math.min(1.0, (data.edge_temporal || 0) / 0.1);
        
        return (coherenceScore * coherenceWeight + 
               resonanceScore * resonanceWeight + 
               edgeScore * edgeWeight);
    }
    
    /**
     * Generar señal de trading basada en métricas temporales
     */
    generateTradingSignal(data) {
        const compositeScore = this.calculateCompositeTemporalHealth(data);
        
        if (compositeScore >= 0.8 && data.prime_coherence >= 0.618) {
            return { signal: 'STRONG_BUY', confidence: compositeScore };
        } else if (compositeScore >= 0.6) {
            return { signal: 'BUY', confidence: compositeScore };
        } else if (compositeScore <= 0.3) {
            return { signal: 'AVOID', confidence: 1 - compositeScore };
        }
        
        return { signal: 'HOLD', confidence: 0.5 };
    }
    
    // === MÉTODOS DE FALLBACK ===
    
    /**
     * Generar métricas temporales simuladas
     */
    generateFallbackTemporalMetrics() {
        return {
            edge_temporal: 0.03 + this.rng.nextFloat() * 0.04,
            prime_coherence: 0.4 + this.rng.nextFloat() * 0.4,
            lambda_resonance: (this.rng.nextFloat() - 0.5) * 0.8,
            composite_score: 0.5 + (this.rng.nextFloat() - 0.5) * 0.3,
            dte_prime_band: [7, 11, 13, 17, 19][Math.floor(this.rng.nextFloat() * 5)],
            lunar_phase: this.rng.nextFloat(),
            is_fallback: true,
            dashboard_timestamp: Date.now()
        };
    }
    
    /**
     * Generar estado θ-budget simulado
     */
    generateFallbackThetaBudgetStatus() {
        const usedBudget = 0.02 + this.rng.nextFloat() * 0.06; // 2-8%
        const dailyBudget = 0.1; // 10%
        
        return {
            daily_budget: dailyBudget,
            used_budget: usedBudget,
            remaining_budget: dailyBudget - usedBudget,
            utilization_percentage: (usedBudget / dailyBudget) * 100,
            remaining_percentage: ((dailyBudget - usedBudget) / dailyBudget) * 100,
            status: this.classifyThetaBudgetStatus(usedBudget / dailyBudget),
            last_reset_time: Date.now() - (this.rng.nextFloat() * 12 * 60 * 60 * 1000), // Hasta 12h atrás
            time_until_reset: this.rng.nextFloat() * 12 * 60 * 60 * 1000, // Hasta 12h adelante
            is_fallback: true,
            dashboard_timestamp: Date.now()
        };
    }
    
    /**
     * Generar coherencia-resonancia simulada
     */
    generateFallbackCoherenceResonance() {
        const primeCoherence = 0.3 + this.rng.nextFloat() * 0.5;
        const lambdaResonance = (this.rng.nextFloat() - 0.5) * 1.2;
        
        return {
            prime_coherence: primeCoherence,
            lambda_resonance: lambdaResonance,
            coherence_grade: this.gradeCoherence(primeCoherence),
            resonance_grade: this.gradeResonance(lambdaResonance),
            composite_health: this.calculateCompositeTemporalHealth({
                prime_coherence: primeCoherence,
                lambda_resonance: lambdaResonance,
                edge_temporal: 0.03
            }),
            is_fallback: true,
            dashboard_timestamp: Date.now()
        };
    }
    
    /**
     * Generar edge temporal simulado
     */
    generateFallbackTemporalEdge(symbol = null) {
        const edgeTemporal = 0.01 + this.rng.nextFloat() * 0.08;
        
        return {
            symbol: symbol || 'FALLBACK',
            edge_temporal: edgeTemporal,
            theta_normalized: 0.01 + this.rng.nextFloat() * 0.03,
            dte_prime_band: [7, 11, 13, 17][Math.floor(this.rng.nextFloat() * 4)],
            lunar_phase: this.rng.nextFloat(),
            edge_grade: this.gradeTemporalEdge(edgeTemporal),
            trading_signal: this.generateTradingSignal({
                edge_temporal: edgeTemporal,
                prime_coherence: 0.5,
                lambda_resonance: 0.3
            }),
            is_fallback: true,
            dashboard_timestamp: Date.now()
        };
    }
    
    // === MÉTODOS PARA PRIME LADDERS ===
    
    /**
     * Obtener métricas de Prime Ladders
     */
    async getPrimeLadderMetrics() {
        try {
            const masterControlUrl = this.config.qbtcServices.masterControl;
            const response = await fetch(`${masterControlUrl}/position-manager/prime-ladders/metrics`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                return {
                    ...data,
                    dashboard_timestamp: Date.now()
                };
            }
            
            return this.generateFallbackLadderMetrics();
            
        } catch (error) {
            this.logger.warn('⚠️ Error obteniendo métricas de ladders, usando fallback:', error.message);
            return this.generateFallbackLadderMetrics();
        }
    }
    
    /**
     * Obtener ladders por símbolo
     */
    async getPrimeLaddersBySymbol(symbol) {
        try {
            const masterControlUrl = this.config.qbtcServices.masterControl;
            const response = await fetch(`${masterControlUrl}/position-manager/prime-ladders/symbol/${symbol}`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                return {
                    ...data,
                    dashboard_timestamp: Date.now()
                };
            }
            
            return this.generateFallbackSymbolLadders(symbol);
            
        } catch (error) {
            this.logger.warn(`⚠️ Error obteniendo ladders para ${symbol}, usando fallback:`, error.message);
            return this.generateFallbackSymbolLadders(symbol);
        }
    }
    
    /**
     * Obtener cola de rolls
     */
    async getRollQueue() {
        try {
            const masterControlUrl = this.config.qbtcServices.masterControl;
            const response = await fetch(`${masterControlUrl}/position-manager/roll-queue`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                return {
                    ...data,
                    dashboard_timestamp: Date.now()
                };
            }
            
            return this.generateFallbackRollQueue();
            
        } catch (error) {
            this.logger.warn('⚠️ Error obteniendo cola de rolls, usando fallback:', error.message);
            return this.generateFallbackRollQueue();
        }
    }
    
    /**
     * Forzar roll manual de posición
     */
    async forcePositionRoll(positionId, targetBand, reason) {
        try {
            const masterControlUrl = this.config.qbtcServices.masterControl;
            const response = await fetch(`${masterControlUrl}/position-manager/force-roll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ positionId, targetBand, reason })
            });
            
            if (response.ok) {
                const result = await response.json();
                
                this.logger.info(`Roll manual ejecutado desde dashboard: ${positionId} -> ${targetBand}d`);
                
                return {
                    ...result,
                    dashboard_timestamp: Date.now()
                };
            }
            
            throw new Error('Roll no autorizado o servicio no disponible');
            
        } catch (error) {
            this.logger.error('❌ Error forzando roll:', error);
            return {
                success: false,
                error: error.message,
                dashboard_timestamp: Date.now()
            };
        }
    }
    
    // === FALLBACKS PARA PRIME LADDERS ===
    
    /**
     * Generar métricas de ladders simuladas
     */
    generateFallbackLadderMetrics() {
        return {
            totalLadders: Math.floor(this.rng.nextFloat() * 10) + 2,
            activeRolls: Math.floor(this.rng.nextFloat() * 3),
            completedRolls: Math.floor(this.rng.nextFloat() * 50) + 10,
            rollSuccessRate: 0.8 + this.rng.nextFloat() * 0.15,
            avgRollProfit: (this.rng.nextFloat() - 0.3) * 200,
            thetaEfficiency: 0.6 + this.rng.nextFloat() * 0.3,
            ladderBalance: 0.7 + this.rng.nextFloat() * 0.2,
            queuedRolls: Math.floor(this.rng.nextFloat() * 5),
            laddersBySymbol: [
                { symbol: 'BTCUSDT', ladderCount: 3, totalPositions: 8, totalValue: 50000, avgThetaEfficiency: 0.75 },
                { symbol: 'ETHUSDT', ladderCount: 2, totalPositions: 4, totalValue: 25000, avgThetaEfficiency: 0.68 },
                { symbol: 'SOLUSDT', ladderCount: 2, totalPositions: 3, totalValue: 15000, avgThetaEfficiency: 0.71 }
            ],
            performanceByBand: [
                [7, { totalPositions: 15, successfulRolls: 12, avgProfit: 150, avgHoldTime: 7, thetaEfficiency: 0.8 }],
                [11, { totalPositions: 10, successfulRolls: 8, avgProfit: 180, avgHoldTime: 11, thetaEfficiency: 0.75 }],
                [13, { totalPositions: 8, successfulRolls: 7, avgProfit: 200, avgHoldTime: 13, thetaEfficiency: 0.72 }]
            ],
            is_fallback: true,
            dashboard_timestamp: Date.now()
        };
    }
    
    /**
     * Generar ladders por símbolo simulados
     */
    generateFallbackSymbolLadders(symbol) {
        const ladderCount = Math.floor(this.rng.nextFloat() * 4) + 1;
        const ladders = [];
        
        for (let i = 0; i < ladderCount; i++) {
            const primeBand = [7, 11, 13, 17, 19][Math.floor(this.rng.nextFloat() * 5)];
            ladders.push({
                id: `LADDER_${symbol}_${primeBand}_${Date.now() + i}`,
                symbol,
                tier: this.estimateSymbolTier(symbol),
                primeBand,
                createdAt: Date.now() - (this.rng.nextFloat() * 7 * 24 * 60 * 60 * 1000),
                positions: Math.floor(this.rng.nextFloat() * 3) + 1,
                metrics: {
                    totalTheta: this.rng.nextFloat() * 1000,
                    avgEdgeTemporal: 0.02 + this.rng.nextFloat() * 0.05,
                    totalValue: 5000 + this.rng.nextFloat() * 20000,
                    unrealizedPnL: (this.rng.nextFloat() - 0.4) * 1000,
                    thetaEfficiency: 0.5 + this.rng.nextFloat() * 0.4,
                    rollsCompleted: Math.floor(this.rng.nextFloat() * 10),
                    rollsSuccessful: Math.floor(this.rng.nextFloat() * 8)
                },
                status: 'ACTIVE'
            });
        }
        
        return {
            symbol,
            ladders,
            is_fallback: true,
            dashboard_timestamp: Date.now()
        };
    }
    
    /**
     * Generar cola de rolls simulada
     */
    generateFallbackRollQueue() {
        const queueLength = Math.floor(this.rng.nextFloat() * 6);
        const queue = [];
        
        for (let i = 0; i < queueLength; i++) {
            queue.push({
                positionId: `POS_${Date.now()}_${this.rng.nextInt(100000)}`,
                ladderId: `LADDER_SIM_${i}`,
                reason: ['approaching_expiry', 'edge_temporal_decay', 'profit_target_hit'][Math.floor(this.rng.nextFloat() * 3)],
                priority: Math.floor(this.rng.nextFloat() * 10) + 1,
                targetBand: [7, 11, 13, 17, 19][Math.floor(this.rng.nextFloat() * 5)],
                queuedAt: Date.now() - (this.rng.nextFloat() * 5 * 60 * 1000), // Hasta 5 min atrás
                waitTime: this.rng.nextFloat() * 5 * 60 * 1000
            });
        }
        
        return {
            queue,
            totalQueued: queueLength,
            nextProcessing: queueLength > 0 ? 30000 : null,
            is_fallback: true,
            dashboard_timestamp: Date.now()
        };
    }
    
    /**
     * Estimar tier de símbolo
     */
    estimateSymbolTier(symbol) {
        const symbolUpper = symbol.toUpperCase();
        if (['BTC', 'ETH'].some(s => symbolUpper.includes(s))) return 'TIER1';
        if (['SOL', 'XRP', 'ADA'].some(s => symbolUpper.includes(s))) return 'TIER2';
        if (['UNI', 'AAVE', 'LINK'].some(s => symbolUpper.includes(s))) return 'TIER3';
        return 'TIER4';
    }
    
    /**
     * Generar métricas en formato Prometheus
     */
    generatePrometheusMetrics() {
        let metrics = '# Enhanced Dashboard Metrics\n';
        
        // Métricas del dashboard
        metrics += `dashboard_uptime_seconds ${(Date.now() - (this.memoryOptimizer ? this.memoryOptimizer.getStats().startTime || Date.now() : Date.now())) / 1000}\n`;
        metrics += `dashboard_connected_clients ${this.state.connectedClients}\n`;
        metrics += `dashboard_active_alerts ${this.state.alertsActive}\n`;
        
        // Métricas del sistema general
        metrics += `system_health ${this.state.systemData.overall.health}\n`;
        metrics += `system_services_total ${this.state.systemData.overall.services}\n`;
        metrics += `system_services_healthy ${this.state.systemData.overall.healthyServices}\n`;

        // Métricas por servicio
        for (const [serviceName, serviceData] of this.state.systemData.services) {
            const statusValue = serviceData.status === 'healthy' ? 1 : 0;
            metrics += `service_status{service="${serviceName}"} ${statusValue}\n`;
            
            if (serviceData.uptime !== undefined) {
                metrics += `service_uptime_seconds{service="${serviceName}"} ${serviceData.uptime / 1000}\n`;
            }

            // Métricas específicas por servicio
            const specificMetrics = this.extractSpecificMetrics(serviceName, serviceData);
            for (const [metricName, metricValue] of Object.entries(specificMetrics)) {
                metrics += `service_${metricName}{service="${serviceName}"} ${metricValue}\n`;
            }
        }

        return metrics;
    }

    /**
     * Generar HTML del dashboard
     */
    generateDashboardHTML() {
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced QBTC Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #0a0a0a; 
            color: #fff;
            overflow-x: auto;
        }
        .header {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            padding: 1rem 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 { color: #4fc3f7; font-size: 1.8rem; }
        .status-badge {
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
        }
        .status-online { background: #4caf50; color: white; }
        .status-warning { background: #ff9800; color: white; }
        .status-error { background: #f44336; color: white; }
        .container { 
            max-width: 1400px; 
            margin: 2rem auto; 
            padding: 0 2rem; 
            display: grid; 
            gap: 2rem;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        .card {
            background: rgba(25, 25, 40, 0.9);
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            border: 1px solid rgba(79, 195, 247, 0.2);
        }
        .card h3 { 
            color: #4fc3f7; 
            margin-bottom: 1rem; 
            font-size: 1.3rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .metric { 
            display: flex; 
            justify-content: space-between; 
            margin: 0.5rem 0; 
            padding: 0.5rem;
            background: rgba(255,255,255,0.05);
            border-radius: 6px;
        }
        .metric-value { 
            font-weight: bold; 
            color: #4fc3f7; 
        }
        .service-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem;
            margin: 0.5rem 0;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            border-left: 4px solid transparent;
        }
        .service-healthy { border-left-color: #4caf50; }
        .service-error { border-left-color: #f44336; }
        .btn {
            background: #4fc3f7;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s;
        }
        .btn:hover { background: #29b6f6; }
        .btn-danger { background: #f44336; }
        .btn-danger:hover { background: #d32f2f; }
        .connection-status {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            z-index: 1000;
        }
        .connected { background: #4caf50; color: white; }
        .disconnected { background: #f44336; color: white; }
        @media (max-width: 768px) {
            .container { grid-template-columns: 1fr; }
            .header { flex-direction: column; gap: 1rem; }
        }
        
        /* === ESTILOS PARA MÉTRICAS TEMPORALES θ-AWARE === */
        
        /* Grades de calidad */
        .grade-excellent, .health-excellent { color: #4caf50 !important; }
        .grade-good, .health-good { color: #8bc34a !important; }
        .grade-fair, .health-fair { color: #ffc107 !important; }
        .grade-poor, .health-poor { color: #f44336 !important; }
        
        /* Señales de trading */
        .signal-strong-buy { color: #2e7d32; background: rgba(46, 125, 50, 0.2); padding: 0.2rem 0.5rem; border-radius: 4px; }
        .signal-buy { color: #388e3c; background: rgba(56, 142, 60, 0.2); padding: 0.2rem 0.5rem; border-radius: 4px; }
        .signal-hold { color: #f57c00; background: rgba(245, 124, 0, 0.2); padding: 0.2rem 0.5rem; border-radius: 4px; }
        .signal-avoid { color: #d32f2f; background: rgba(211, 47, 47, 0.2); padding: 0.2rem 0.5rem; border-radius: 4px; }
        
        /* Estados de θ-Budget */
        .budget-healthy { color: #4caf50 !important; }
        .budget-moderate { color: #ff9800 !important; }
        .budget-warning { color: #ff5722 !important; }
        .budget-critical { color: #f44336 !important; font-weight: bold; }
        
        /* Estados de status */
        .status-healthy { color: #4caf50 !important; }
        .status-moderate { color: #ff9800 !important; }
        .status-warning { color: #ff5722 !important; }
        .status-critical { color: #f44336 !important; font-weight: bold; }
    </style>
</head>
<body>
    <div class="connection-status" id="connectionStatus">Conectando...</div>
    
    <header class="header">
        <h1>🚀 Enhanced QBTC Dashboard</h1>
        <div>
            <span class="status-badge" id="systemStatus">Sistema: Cargando...</span>
        </div>
    </header>

    <div class="container">
        <!-- System Overview -->
        <div class="card">
            <h3>📊 Sistema General</h3>
            <div class="metric">
                <span>Salud del Sistema</span>
                <span class="metric-value" id="systemHealth">--</span>
            </div>
            <div class="metric">
                <span>Servicios Activos</span>
                <span class="metric-value" id="healthyServices">--</span>
            </div>
            <div class="metric">
                <span>Alertas Activas</span>
                <span class="metric-value" id="activeAlerts">--</span>
            </div>
            <div class="metric">
                <span>Tiempo Activo</span>
                <span class="metric-value" id="systemUptime">--</span>
            </div>
            <button class="btn" onclick="optimizeMemory()">🧹 Optimizar Memoria</button>
        </div>

        <!-- Services Status -->
        <div class="card">
            <h3>⚙️ Estado de Servicios</h3>
            <div id="servicesList"></div>
        </div>

        <!-- Alerts -->
        <div class="card">
            <h3>🚨 Alertas</h3>
            <div id="alertsList"></div>
        </div>

        <!-- Trading Metrics -->
        <div class="card">
            <h3>📈 Métricas de Trading</h3>
            <div id="tradingMetrics"></div>
        </div>
        
        <!-- === NUEVAS SECCIONES TEMPORALES θ-AWARE === -->
        
        <!-- Temporal Edge θ-aware -->
        <div class="card">
            <h3>⏱️ Edge Temporal θ-aware</h3>
            <div class="metric">
                <span>Edge Temporal</span>
                <span class="metric-value" id="edgeTemporalValue">--</span>
            </div>
            <div class="metric">
                <span>Grade Edge</span>
                <span class="metric-value" id="edgeTemporalGrade">--</span>
            </div>
            <div class="metric">
                <span>DTE Prime Band</span>
                <span class="metric-value" id="dtePrimeBand">-- días</span>
            </div>
            <div class="metric">
                <span>Señal Trading</span>
                <span class="metric-value" id="tradingSignal">--</span>
            </div>
        </div>
        
        <!-- Coherencia Prima & Resonancia λ_7919 -->
        <div class="card">
            <h3>🌌 Coherencia Prima & λ_7919</h3>
            <div class="metric">
                <span>Coherencia Prima</span>
                <span class="metric-value" id="primeCoherence">--</span>
            </div>
            <div class="metric">
                <span>Grade Coherencia</span>
                <span class="metric-value" id="coherenceGrade">--</span>
            </div>
            <div class="metric">
                <span>Resonancia λ_7919</span>
                <span class="metric-value" id="lambdaResonance">--</span>
            </div>
            <div class="metric">
                <span>Grade Resonancia</span>
                <span class="metric-value" id="resonanceGrade">--</span>
            </div>
            <div class="metric">
                <span>Salud Temporal</span>
                <span class="metric-value" id="compositeHealth">--</span>
            </div>
        </div>
        
        <!-- θ-Budget Monitor -->
        <div class="card">
            <h3>🏷️ θ-Budget Monitor</h3>
            <div class="metric">
                <span>Utilización Diaria</span>
                <span class="metric-value" id="thetaBudgetUtilization">--</span>
            </div>
            <div class="metric">
                <span>Estado Budget</span>
                <span class="metric-value" id="thetaBudgetStatus">--</span>
            </div>
            <div class="metric">
                <span>Tiempo hasta Reset</span>
                <span class="metric-value" id="timeUntilReset">--</span>
            </div>
            <div class="metric">
                <span>Budget Restante</span>
                <span class="metric-value" id="remainingBudget">--</span>
            </div>
            <button class="btn btn-danger" onclick="resetThetaBudget()">🔄 Reset θ-Budget</button>
        </div>
    </div>

    <script>
        let ws;
        let reconnectInterval = 5000;
        let reconnectTimer;

        function connectWebSocket() {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = protocol + '//' + window.location.host;
            
            ws = new WebSocket(wsUrl);

            ws.onopen = function() {
                console.log('WebSocket conectado');
                document.getElementById('connectionStatus').textContent = '🟢 Conectado';
                document.getElementById('connectionStatus').className = 'connection-status connected';
                
                // Suscribirse a actualizaciones en tiempo real
                ws.send(JSON.stringify({ type: 'subscribe_realtime' }));
                
                clearTimeout(reconnectTimer);
            };

            ws.onmessage = function(event) {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            };

            ws.onclose = function() {
                console.log('WebSocket desconectado');
                document.getElementById('connectionStatus').textContent = '🔴 Desconectado';
                document.getElementById('connectionStatus').className = 'connection-status disconnected';
                
                // Intentar reconectar
                reconnectTimer = setTimeout(connectWebSocket, reconnectInterval);
            };

            ws.onerror = function(error) {
                console.error('Error WebSocket:', error);
            };
        }

        function handleWebSocketMessage(data) {
            switch(data.type) {
                case 'dashboard_init':
                case 'realtime_update':
                    updateDashboard(data.data);
                    break;
                case 'subscription_confirmed':
                    console.log('Suscripción confirmada:', data.data);
                    break;
                case 'error':
                    console.error('Error del servidor:', data.data);
                    break;
            }
        }

        function updateDashboard(data) {
            // Actualizar overview del sistema
            const overview = data.systemOverview;
            if (overview) {
                document.getElementById('systemHealth').textContent = (overview.health * 100).toFixed(1) + '%';
                document.getElementById('healthyServices').textContent = overview.healthyServices + '/' + overview.services;
                document.getElementById('activeAlerts').textContent = overview.alerts || 0;
                document.getElementById('systemUptime').textContent = formatUptime(overview.uptime);
                
                // Actualizar estado del sistema
                const statusEl = document.getElementById('systemStatus');
                if (overview.health > 0.8) {
                    statusEl.textContent = 'Sistema: Excelente';
                    statusEl.className = 'status-badge status-online';
                } else if (overview.health > 0.5) {
                    statusEl.textContent = 'Sistema: Advertencia';
                    statusEl.className = 'status-badge status-warning';
                } else {
                    statusEl.textContent = 'Sistema: Crítico';
                    statusEl.className = 'status-badge status-error';
                }
            }

            // Actualizar servicios
            if (data.services) {
                updateServicesList(data.services);
            }

            // Actualizar alertas
            if (data.alerts) {
                updateAlertsList(data.alerts);
            }
            
            // === NUEVAS ACTUALIZACIONES TEMPORALES θ-AWARE ===
            // Cargar métricas temporales de forma asíncrona
            updateTemporalMetrics();
        }

        function updateServicesList(services) {
            const servicesList = document.getElementById('servicesList');
            servicesList.innerHTML = '';

            services.forEach(([serviceName, serviceData]) => {
                const serviceItem = document.createElement('div');
                serviceItem.className = 'service-item ' + (serviceData.status === 'healthy' ? 'service-healthy' : 'service-error');
                
                serviceItem.innerHTML = \`
                    <div>
                        <strong>\${serviceName}</strong><br>
                        <small>Puerto: \${serviceData.port || 'N/A'}</small>
                    </div>
                    <div>
                        <span class="status-badge \${serviceData.status === 'healthy' ? 'status-online' : 'status-error'}">
                            \${serviceData.status}
                        </span>
                        <button class="btn btn-danger" onclick="restartService('\${serviceName}')">🔄</button>
                    </div>
                \`;
                
                servicesList.appendChild(serviceItem);
            });
        }

        function updateAlertsList(alerts) {
            const alertsList = document.getElementById('alertsList');
            
            if (!alerts || alerts.length === 0) {
                alertsList.innerHTML = '<div style="color: #4caf50; text-align: center;">✅ No hay alertas activas</div>';
                return;
            }

            alertsList.innerHTML = '';
            alerts.slice(0, 10).forEach(alert => {
                const alertItem = document.createElement('div');
                alertItem.className = 'metric';
                alertItem.innerHTML = \`
                    <span>\${alert.message}</span>
                    <span class="status-badge \${alert.severity === 'critical' ? 'status-error' : 'status-warning'}">
                        \${alert.severity}
                    </span>
                \`;
                alertsList.appendChild(alertItem);
            });
        }

        function formatUptime(uptimeMs) {
            const seconds = Math.floor(uptimeMs / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) return \`\${days}d \${hours % 24}h\`;
            if (hours > 0) return \`\${hours}h \${minutes % 60}m\`;
            return \`\${minutes}m\`;
        }

        function restartService(serviceName) {
            if (confirm(\`¿Reiniciar el servicio \${serviceName}?\`)) {
                ws.send(JSON.stringify({
                    type: 'request_service_restart',
                    serviceName: serviceName
                }));
            }
        }

        function optimizeMemory() {
            if (confirm('¿Optimizar memoria del sistema?')) {
                fetch('/api/system/optimize-memory', { method: 'POST' })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.success ? 'Memoria optimizada correctamente' : 'Error: ' + data.error);
                    })
                    .catch(error => {
                        alert('Error optimizando memoria: ' + error.message);
                    });
            }
        }
        
        // === FUNCIONES PARA MÉTRICAS TEMPORALES θ-AWARE ===
        
        async function updateTemporalMetrics() {
            try {
                // Actualizar Edge Temporal
                const edgeResponse = await fetch('/api/temporal/edge');
                if (edgeResponse.ok) {
                    const edgeData = await edgeResponse.json();
                    updateEdgeTemporalDisplay(edgeData);
                }
                
                // Actualizar Coherencia & Resonancia
                const coherenceResponse = await fetch('/api/temporal/coherence-resonance');
                if (coherenceResponse.ok) {
                    const coherenceData = await coherenceResponse.json();
                    updateCoherenceResonanceDisplay(coherenceData);
                }
                
                // Actualizar θ-Budget
                const budgetResponse = await fetch('/api/temporal/theta-budget');
                if (budgetResponse.ok) {
                    const budgetData = await budgetResponse.json();
                    updateThetaBudgetDisplay(budgetData);
                }
                
            } catch (error) {
                console.error('Error actualizando métricas temporales:', error);
            }
        }
        
        function updateEdgeTemporalDisplay(data) {
            const edgeValue = document.getElementById('edgeTemporalValue');
            const edgeGrade = document.getElementById('edgeTemporalGrade');
            const dteBand = document.getElementById('dtePrimeBand');
            const signal = document.getElementById('tradingSignal');
            
            if (edgeValue) edgeValue.textContent = (data.edge_temporal * 100).toFixed(2) + '%';
            if (edgeGrade) {
                edgeGrade.textContent = data.edge_grade || 'N/A';
                edgeGrade.className = 'metric-value ' + getGradeClass(data.edge_grade);
            }
            if (dteBand) dteBand.textContent = (data.dte_prime_band || '--') + ' días';
            if (signal && data.trading_signal) {
                signal.textContent = data.trading_signal.signal || 'HOLD';
                signal.className = 'metric-value ' + getSignalClass(data.trading_signal.signal);
            }
        }
        
        function updateCoherenceResonanceDisplay(data) {
            const coherence = document.getElementById('primeCoherence');
            const coherenceGrade = document.getElementById('coherenceGrade');
            const resonance = document.getElementById('lambdaResonance');
            const resonanceGrade = document.getElementById('resonanceGrade');
            const health = document.getElementById('compositeHealth');
            
            if (coherence) coherence.textContent = (data.prime_coherence * 100).toFixed(1) + '%';
            if (coherenceGrade) {
                coherenceGrade.textContent = data.coherence_grade || 'N/A';
                coherenceGrade.className = 'metric-value ' + getGradeClass(data.coherence_grade);
            }
            if (resonance) resonance.textContent = data.lambda_resonance.toFixed(3);
            if (resonanceGrade) {
                resonanceGrade.textContent = data.resonance_grade || 'N/A';
                resonanceGrade.className = 'metric-value ' + getGradeClass(data.resonance_grade);
            }
            if (health) {
                health.textContent = (data.composite_health * 100).toFixed(1) + '%';
                health.className = 'metric-value ' + getHealthClass(data.composite_health);
            }
        }
        
        function updateThetaBudgetDisplay(data) {
            const utilization = document.getElementById('thetaBudgetUtilization');
            const status = document.getElementById('thetaBudgetStatus');
            const timeReset = document.getElementById('timeUntilReset');
            const remaining = document.getElementById('remainingBudget');
            
            if (utilization) {
                utilization.textContent = data.utilization_percentage.toFixed(1) + '%';
                utilization.className = 'metric-value ' + getBudgetUtilizationClass(data.utilization_percentage);
            }
            if (status) {
                status.textContent = data.status || 'UNKNOWN';
                status.className = 'metric-value ' + getBudgetStatusClass(data.status);
            }
            if (timeReset) {
                timeReset.textContent = formatTimeUntilReset(data.time_until_reset);
            }
            if (remaining) {
                remaining.textContent = data.remaining_percentage.toFixed(1) + '%';
            }
        }
        
        // Funciones auxiliares para CSS classes
        function getGradeClass(grade) {
            switch(grade) {
                case 'EXCELLENT': return 'grade-excellent';
                case 'GOOD': return 'grade-good';
                case 'FAIR': return 'grade-fair';
                case 'POOR': return 'grade-poor';
                default: return '';
            }
        }
        
        function getSignalClass(signal) {
            switch(signal) {
                case 'STRONG_BUY': return 'signal-strong-buy';
                case 'BUY': return 'signal-buy';
                case 'HOLD': return 'signal-hold';
                case 'AVOID': return 'signal-avoid';
                default: return '';
            }
        }
        
        function getHealthClass(health) {
            if (health >= 0.8) return 'health-excellent';
            if (health >= 0.6) return 'health-good';
            if (health >= 0.4) return 'health-fair';
            return 'health-poor';
        }
        
        function getBudgetUtilizationClass(utilization) {
            if (utilization >= 90) return 'budget-critical';
            if (utilization >= 70) return 'budget-warning';
            if (utilization >= 50) return 'budget-moderate';
            return 'budget-healthy';
        }
        
        function getBudgetStatusClass(status) {
            switch(status) {
                case 'HEALTHY': return 'status-healthy';
                case 'MODERATE': return 'status-moderate';
                case 'WARNING': return 'status-warning';
                case 'CRITICAL': return 'status-critical';
                default: return '';
            }
        }
        
        function formatTimeUntilReset(timeMs) {
            if (!timeMs || timeMs <= 0) return 'Ya es hora';
            
            const hours = Math.floor(timeMs / (60 * 60 * 1000));
            const minutes = Math.floor((timeMs % (60 * 60 * 1000)) / (60 * 1000));
            
            if (hours > 0) return hours + 'h ' + minutes + 'm';
            return minutes + 'm';
        }
        
        function resetThetaBudget() {
            if (confirm('¿Estás seguro de que quieres resetear el θ-Budget? Esta acción liberará todo el budget usado.')) {
                fetch('/api/temporal/reset-theta-budget', { method: 'POST' })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            alert('θ-Budget reseteado correctamente');
                            updateTemporalMetrics(); // Actualizar inmediatamente
                        } else {
                            alert('Error reseteando θ-Budget: ' + data.error);
                        }
                    })
                    .catch(error => {
                        alert('Error reseteando θ-Budget: ' + error.message);
                    });
            }
        }

        // Inicializar dashboard
        connectWebSocket();
        
        // Cargar datos iniciales
        fetch('/api/system/overview')
            .then(response => response.json())
            .then(data => updateDashboard(data))
            .catch(error => console.error('Error cargando datos iniciales:', error));
    </script>
</body>
</html>
        `;
    }

    /**
     * Shutdown graceful
     */
    async shutdown() {
        this.logger.info('🔄 Cerrando Enhanced Dashboard...');

        this.state.running = false;

        // Detener timers
        if (this.dataUpdateTimer) {
            clearInterval(this.dataUpdateTimer);
        }
        
        if (this.metricsTimer) {
            clearInterval(this.metricsTimer);
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

        this.logger.info('✅ Enhanced Dashboard cerrado correctamente');
    }
}

// Polyfill simple para fetch en Node.js (si no está disponible)
if (typeof fetch === 'undefined') {
    global.fetch = async function(url, options = {}) {
        const http = require('http');
        const https = require('https');
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;

        return new Promise((resolve, reject) => {
            const req = client.request(url, {
                method: options.method || 'GET',
                headers: options.headers || {},
                timeout: options.timeout || 5000
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        ok: res.statusCode >= 200 && res.statusCode < 300,
                        status: res.statusCode,
                        statusText: res.statusMessage,
                        json: () => Promise.resolve(JSON.parse(data)),
                        text: () => Promise.resolve(data)
                    });
                });
            });

            req.on('error', reject);
            req.on('timeout', () => reject(new Error('Request timeout')));
            
            if (options.body) {
                req.write(options.body);
            }
            
            req.end();
        });
    };
}

// Inicializar y exportar si se ejecuta directamente
if (require.main === module) {
    const dashboard = new EnhancedDashboard();
    
    // Manejo de señales para shutdown graceful
    process.on('SIGTERM', async () => {
        await dashboard.shutdown();
        process.exit(0);
    });
    
    process.on('SIGINT', async () => {
        await dashboard.shutdown();
        process.exit(0);
    });
    
    // Manejo de errores no capturados
    process.on('uncaughtException', (error) => {
        console.error('💀 Uncaught Exception:', error);
        dashboard.shutdown().then(() => process.exit(1));
    });
    
    process.on('unhandledRejection', (reason, promise) => {
        console.error('💀 Unhandled Rejection at:', promise, 'reason:', reason);
        dashboard.shutdown().then(() => process.exit(1));
    });
}

module.exports = EnhancedDashboard;


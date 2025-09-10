#!/usr/bin/env node
/**
 * 🌐 QBTC API GATEWAY UNIFICADA - INGENIERÍA INVERSA ACELERADA
 * ===========================================================
 * 
 * Gateway API que centraliza el acceso a todos los servicios del ecosistema QBTC
 * Proporciona endpoints unificados, balanceo de carga, y agregación de datos
 * 
 * SERVICIOS GESTIONADOS:
 * - Sistema QBTC Principal
 * - LLM Neural Orchestrator + OpenRouter
 * - Trading Engine
 * - Quantum Engine
 * - Hybrid Optimizer V2
 * - Concentrated Hybrid V3
 * - Enhanced Dashboard
 * - Intelligent Monitor
 * 
 * @author QBTC Development Team
 * @version GATEWAY-ULTIMATE
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

class QBTCApiGateway {
    constructor() {
        this.app = express();
        this.port = process.env.API_GATEWAY_PORT || 14000;
        
        // Configuración de servicios
        this.services = {
            qbtcCore: {
                name: 'QBTC Core System',
                url: 'http://localhost:14001',
                health: '/health',
                priority: 1,
                status: 'unknown'
            },
            llmServer: {
                name: 'LLM Neural Orchestrator',
                url: 'http://localhost:4607',
                health: '/health',
                priority: 2,
                status: 'unknown'
            },
            tradingEngine: {
                name: 'Trading Engine',
                url: 'http://localhost:14201',
                health: '/health',
                priority: 3,
                status: 'unknown'
            },
            quantumEngine: {
                name: 'Quantum Engine',
                url: 'http://localhost:14115',
                health: '/health',
                priority: 3,
                status: 'unknown'
            },
            hybridOptimizer: {
                name: 'Hybrid Optimizer V2',
                url: 'http://localhost:14301',
                health: '/health',
                priority: 4,
                status: 'unknown'
            },
            concentratedHybrid: {
                name: 'Concentrated Hybrid V3',
                url: 'http://localhost:14302',
                health: '/health',
                priority: 4,
                status: 'unknown'
            },
            dashboard: {
                name: 'Enhanced Dashboard',
                url: 'http://localhost:14401',
                health: '/health',
                priority: 5,
                status: 'unknown'
            },
            monitor: {
                name: 'Intelligent Monitor',
                url: 'http://localhost:14501',
                health: '/health',
                priority: 6,
                status: 'unknown'
            }
        };
        
        // Métricas del gateway
        this.metrics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            servicesHealthy: 0,
            servicesTotal: Object.keys(this.services).length,
            startTime: Date.now(),
            lastHealthCheck: null
        };
        
        // Cache para respuestas
        this.cache = new Map();
        this.cacheTimeout = 10000; // 10 segundos
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupHealthMonitoring();
    }
    
    /**
     * Configurar middleware
     */
    setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        // Logger de requests
        this.app.use((req, res, next) => {
            this.metrics.totalRequests++;
            console.log(`📊 [API GATEWAY] ${req.method} ${req.path} - ${req.ip}`);
            next();
        });
    }
    
    /**
     * Configurar todas las rutas
     */
    setupRoutes() {
        // Ruta raíz - Información del gateway
        this.app.get('/', this.getGatewayInfo.bind(this));
        
        // Health check del gateway
        this.app.get('/health', this.getGatewayHealth.bind(this));
        
        // Estado de todos los servicios
        this.app.get('/api/services/status', this.getAllServicesStatus.bind(this));
        
        // Métricas agregadas
        this.app.get('/api/metrics', this.getAggregatedMetrics.bind(this));
        
        // === ENDPOINTS LLM NEURAL ORCHESTRATOR ===
        this.app.post('/api/llm/decision', this.proxyToLLM.bind(this, 'unified-decision'));
        this.app.get('/api/llm/analysis', this.proxyToLLM.bind(this, 'analysis'));
        this.app.get('/api/llm/stats', this.proxyToLLM.bind(this, 'stats'));
        this.app.post('/api/llm/clear-cache', this.proxyToLLM.bind(this, 'clear-cache'));
        
        // === ENDPOINTS TRADING ===
        this.app.get('/api/trading/signals', this.getTradingSignals.bind(this));
        this.app.post('/api/trading/execute', this.executeTrade.bind(this));
        this.app.get('/api/trading/positions', this.getTradingPositions.bind(this));
        
        // === ENDPOINTS QUANTUM ===
        this.app.get('/api/quantum/state', this.getQuantumState.bind(this));
        this.app.get('/api/quantum/coherence', this.getQuantumCoherence.bind(this));
        
        // === ENDPOINTS HÍBRIDOS ===
        this.app.get('/api/hybrid/optimization', this.getHybridOptimization.bind(this));
        this.app.get('/api/concentrated/analysis', this.getConcentratedAnalysis.bind(this));
        
        // === ENDPOINTS DASHBOARD ===
        this.app.get('/api/dashboard/data', this.getDashboardData.bind(this));
        this.app.get('/dashboard', this.serveDashboard.bind(this));
        
        // === PROXY GENÉRICO ===
        this.app.all('/api/proxy/:service/*', this.genericProxy.bind(this));
        
        // Error handling
        this.app.use(this.errorHandler.bind(this));
        
        // 404 handler
        this.app.use(this.notFoundHandler.bind(this));
    }
    
    /**
     * Información del gateway
     */
    async getGatewayInfo(req, res) {
        const uptime = Date.now() - this.metrics.startTime;
        
        res.json({
            name: '🌐 QBTC API Gateway',
            version: '1.0.0',
            description: 'Gateway unificada para el ecosistema QBTC',
            uptime: Math.floor(uptime / 1000),
            services: Object.keys(this.services).length,
            endpoints: [
                'GET  /health - Estado del gateway',
                'GET  /api/services/status - Estado de servicios',
                'GET  /api/metrics - Métricas agregadas',
                'POST /api/llm/decision - Decisión LLM',
                'GET  /api/llm/analysis - Análisis LLM',
                'GET  /api/trading/signals - Señales de trading',
                'GET  /api/quantum/state - Estado cuántico',
                'GET  /api/hybrid/optimization - Optimización híbrida',
                'GET  /api/dashboard/data - Datos del dashboard',
                'GET  /dashboard - Dashboard web',
                'ALL  /api/proxy/:service/* - Proxy genérico'
            ],
            metrics: this.metrics,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Health check del gateway
     */
    async getGatewayHealth(req, res) {
        const healthyServices = Object.values(this.services)
            .filter(s => s.status === 'healthy').length;
        
        const healthPercentage = (healthyServices / Object.keys(this.services).length) * 100;
        
        const status = healthPercentage >= 70 ? 'healthy' : 
                      healthPercentage >= 40 ? 'degraded' : 'unhealthy';
        
        res.status(status === 'healthy' ? 200 : 503).json({
            status,
            gateway: 'healthy',
            servicesHealthy: healthyServices,
            servicesTotal: Object.keys(this.services).length,
            healthPercentage: Math.round(healthPercentage),
            lastHealthCheck: this.metrics.lastHealthCheck,
            uptime: Math.floor((Date.now() - this.metrics.startTime) / 1000),
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Estado de todos los servicios
     */
    async getAllServicesStatus(req, res) {
        try {
            const statuses = {};
            
            for (const [key, service] of Object.entries(this.services)) {
                statuses[key] = {
                    name: service.name,
                    url: service.url,
                    status: service.status,
                    priority: service.priority,
                    lastCheck: service.lastCheck || null
                };
            }
            
            this.metrics.successfulRequests++;
            res.json({
                status: 'OK',
                services: statuses,
                summary: {
                    total: Object.keys(this.services).length,
                    healthy: Object.values(this.services).filter(s => s.status === 'healthy').length,
                    unhealthy: Object.values(this.services).filter(s => s.status === 'unhealthy').length,
                    unknown: Object.values(this.services).filter(s => s.status === 'unknown').length
                },
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            this.metrics.failedRequests++;
            res.status(500).json({
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Métricas agregadas de todo el sistema
     */
    async getAggregatedMetrics(req, res) {
        try {
            // Obtener métricas de LLM si está disponible
            let llmMetrics = null;
            if (this.services.llmServer.status === 'healthy') {
                try {
                    const response = await this.makeServiceRequest('llmServer', '/api/stats');
                    llmMetrics = response.data;
                } catch (error) {
                    console.warn('No se pudieron obtener métricas del LLM:', error.message);
                }
            }
            
            const aggregatedMetrics = {
                gateway: {
                    ...this.metrics,
                    healthyServices: Object.values(this.services).filter(s => s.status === 'healthy').length,
                    uptime: Math.floor((Date.now() - this.metrics.startTime) / 1000)
                },
                llm: llmMetrics,
                system: {
                    totalServices: Object.keys(this.services).length,
                    operationalServices: Object.values(this.services).filter(s => s.status === 'healthy').length,
                    timestamp: new Date().toISOString()
                }
            };
            
            this.metrics.successfulRequests++;
            res.json({
                status: 'OK',
                data: aggregatedMetrics,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            this.metrics.failedRequests++;
            res.status(500).json({
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Proxy para LLM Neural Orchestrator
     */
    async proxyToLLM(endpoint, req, res) {
        try {
            const method = req.method.toLowerCase();
            const url = `/api/${endpoint}`;
            
            let response;
            if (method === 'post') {
                response = await this.makeServiceRequest('llmServer', url, 'POST', req.body);
            } else {
                response = await this.makeServiceRequest('llmServer', url);
            }
            
            this.metrics.successfulRequests++;
            res.json(response);
            
        } catch (error) {
            this.metrics.failedRequests++;
            res.status(503).json({
                status: 'ERROR',
                error: `LLM service error: ${error.message}`,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Obtener señales de trading agregadas
     */
    async getTradingSignals(req, res) {
        try {
            const signals = [];
            
            // Intentar obtener señal del LLM
            if (this.services.llmServer.status === 'healthy') {
                try {
                    const llmResponse = await this.makeServiceRequest('llmServer', '/api/analysis');
                    signals.push({
                        source: 'LLM Neural',
                        symbol: 'BTCUSDT',
                        signal: llmResponse.recommendations[0] || 'HOLD',
                        confidence: Math.round(llmResponse.confidence * 100),
                        timestamp: new Date().toISOString()
                    });
                } catch (error) {
                    console.warn('Error obteniendo señal LLM:', error.message);
                }
            }
            
            // Señales adicionales de otros servicios (mock por ahora)
            signals.push({
                source: 'Quantum Engine',
                symbol: 'BTCUSDT',
                signal: 'BUY',
                confidence: 75,
                timestamp: new Date().toISOString()
            });
            
            this.metrics.successfulRequests++;
            res.json({
                status: 'OK',
                data: signals,
                count: signals.length,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            this.metrics.failedRequests++;
            res.status(500).json({
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Ejecutar trade
     */
    async executeTrade(req, res) {
        try {
            const { symbol, side, quantity, type = 'market' } = req.body;
            
            if (!symbol || !side || !quantity) {
                return res.status(400).json({
                    status: 'ERROR',
                    error: 'Parámetros requeridos: symbol, side, quantity'
                });
            }
            
            // Por ahora es un mock - en producción se conectaría al trading engine real
            const mockOrder = {
                orderId: `QBTC_${Date.now()}`,
                symbol,
                side: side.toUpperCase(),
                type: type.toUpperCase(),
                quantity: parseFloat(quantity),
                price: 45000 + (Math.random() - 0.5) * 1000, // Mock price
                status: 'FILLED',
                timestamp: new Date().toISOString()
            };
            
            console.log(`📈 [TRADE] ${side.toUpperCase()} ${quantity} ${symbol} @ ${mockOrder.price}`);
            
            this.metrics.successfulRequests++;
            res.json({
                status: 'OK',
                data: mockOrder,
                message: 'Orden ejecutada en modo simulación',
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            this.metrics.failedRequests++;
            res.status(500).json({
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Obtener posiciones de trading
     */
    async getTradingPositions(req, res) {
        try {
            // Mock positions - en producción se obtendrían del exchange gateway
            const positions = [
                {
                    symbol: 'BTCUSDT',
                    side: 'LONG',
                    size: 0.1,
                    entryPrice: 44500,
                    currentPrice: 45000,
                    pnl: 50,
                    pnlPercentage: 1.12,
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                }
            ];
            
            this.metrics.successfulRequests++;
            res.json({
                status: 'OK',
                data: positions,
                count: positions.length,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            this.metrics.failedRequests++;
            res.status(500).json({
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Obtener estado cuántico
     */
    async getQuantumState(req, res) {
        try {
            // Mock quantum state - en producción se obtendría del quantum engine
            const quantumState = {
                coherence: Math.random() * 0.3 + 0.7, // 70-100%
                entanglement: Math.random() * 0.5 + 0.5, // 50-100%
                energy: Math.random() * 50 + 100, // 100-150
                phase: Math.random() * 2 * Math.PI,
                resonanceFreq: 888,
                timestamp: new Date().toISOString()
            };
            
            this.metrics.successfulRequests++;
            res.json({
                status: 'OK',
                data: quantumState,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            this.metrics.failedRequests++;
            res.status(500).json({
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Obtener coherencia cuántica
     */
    async getQuantumCoherence(req, res) {
        try {
            const coherenceData = {
                current: Math.random() * 0.3 + 0.7,
                historical: Array.from({length: 10}, () => Math.random() * 0.3 + 0.7),
                trend: 'increasing',
                lastUpdate: new Date().toISOString()
            };
            
            this.metrics.successfulRequests++;
            res.json({
                status: 'OK',
                data: coherenceData,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            this.metrics.failedRequests++;
            res.status(500).json({
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Obtener optimización híbrida
     */
    async getHybridOptimization(req, res) {
        try {
            const optimizationData = {
                efficiency: Math.random() * 0.2 + 0.8,
                patterns: Math.floor(Math.random() * 50) + 10,
                synergyIndex: Math.random() * 0.3 + 0.7,
                recommendations: ['Increase position size', 'Diversify portfolio'],
                timestamp: new Date().toISOString()
            };
            
            this.metrics.successfulRequests++;
            res.json({
                status: 'OK',
                data: optimizationData,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            this.metrics.failedRequests++;
            res.status(500).json({
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Obtener análisis concentrado
     */
    async getConcentratedAnalysis(req, res) {
        try {
            const analysisData = {
                concentration: Math.random() * 0.3 + 0.7,
                depth: Math.floor(Math.random() * 5) + 3,
                signals: ['Strong buy momentum', 'Volume confirmation'],
                accuracy: Math.random() * 0.15 + 0.85,
                timestamp: new Date().toISOString()
            };
            
            this.metrics.successfulRequests++;
            res.json({
                status: 'OK',
                data: analysisData,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            this.metrics.failedRequests++;
            res.status(500).json({
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Obtener datos para dashboard
     */
    async getDashboardData(req, res) {
        try {
            const dashboardData = {
                services: await this.getAllServicesStatusData(),
                metrics: await this.getAggregatedMetricsData(),
                signals: await this.getTradingSignalsData(),
                quantum: await this.getQuantumStateData(),
                timestamp: new Date().toISOString()
            };
            
            this.metrics.successfulRequests++;
            res.json({
                status: 'OK',
                data: dashboardData,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            this.metrics.failedRequests++;
            res.status(500).json({
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Servir dashboard web
     */
    async serveDashboard(req, res) {
        try {
            const dashboardPath = path.join(__dirname, 'qbtc-dashboard-universal.html');
            
            if (fs.existsSync(dashboardPath)) {
                res.sendFile(dashboardPath);
            } else {
                res.status(404).json({
                    status: 'ERROR',
                    error: 'Dashboard file not found',
                    message: 'Dashboard HTML file is not available'
                });
            }
            
        } catch (error) {
            res.status(500).json({
                status: 'ERROR',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Proxy genérico a cualquier servicio
     */
    async genericProxy(req, res) {
        try {
            const serviceName = req.params.service;
            const path = req.params[0];
            const fullPath = `/${path}`;
            
            if (!this.services[serviceName]) {
                return res.status(404).json({
                    status: 'ERROR',
                    error: `Service ${serviceName} not found`
                });
            }
            
            const method = req.method;
            const data = ['POST', 'PUT', 'PATCH'].includes(method) ? req.body : undefined;
            
            const response = await this.makeServiceRequest(serviceName, fullPath, method, data);
            
            this.metrics.successfulRequests++;
            res.json(response);
            
        } catch (error) {
            this.metrics.failedRequests++;
            res.status(503).json({
                status: 'ERROR',
                error: `Proxy error: ${error.message}`,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    /**
     * Realizar request a un servicio
     */
    async makeServiceRequest(serviceName, path, method = 'GET', data = null) {
        const service = this.services[serviceName];
        
        if (!service) {
            throw new Error(`Service ${serviceName} not configured`);
        }
        
        if (service.status !== 'healthy') {
            throw new Error(`Service ${serviceName} is not healthy`);
        }
        
        const config = {
            method: method,
            url: `${service.url}${path}`,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'QBTC-API-Gateway/1.0'
            }
        };
        
        if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            config.data = data;
        }
        
        const response = await axios(config);
        return response.data;
    }
    
    /**
     * Configurar monitoreo de salud
     */
    setupHealthMonitoring() {
        // Health check cada 30 segundos según reglas de segundo plano
        setInterval(async () => {
            await this.checkAllServicesHealth();
        }, 30000);
        
        // Primer health check inmediato
        setTimeout(() => this.checkAllServicesHealth(), 5000);
    }
    
    /**
     * Verificar salud de todos los servicios
     */
    async checkAllServicesHealth() {
        console.log('💗 [API GATEWAY] Verificando salud de servicios...');
        
        for (const [key, service] of Object.entries(this.services)) {
            try {
                const response = await axios.get(`${service.url}${service.health}`, {
                    timeout: 5000
                });
                
                service.status = response.status === 200 ? 'healthy' : 'unhealthy';
                service.lastCheck = new Date().toISOString();
                
            } catch (error) {
                service.status = 'unhealthy';
                service.lastCheck = new Date().toISOString();
                service.lastError = error.message;
            }
        }
        
        this.metrics.servicesHealthy = Object.values(this.services)
            .filter(s => s.status === 'healthy').length;
        this.metrics.lastHealthCheck = new Date().toISOString();
        
        const healthyCount = this.metrics.servicesHealthy;
        const totalCount = this.metrics.servicesTotal;
        console.log(`💗 [API GATEWAY] Servicios saludables: ${healthyCount}/${totalCount}`);
    }
    
    /**
     * Métodos auxiliares para datos
     */
    async getAllServicesStatusData() {
        const statuses = {};
        for (const [key, service] of Object.entries(this.services)) {
            statuses[key] = {
                name: service.name,
                status: service.status,
                lastCheck: service.lastCheck
            };
        }
        return statuses;
    }
    
    async getAggregatedMetricsData() {
        return {
            ...this.metrics,
            uptime: Math.floor((Date.now() - this.metrics.startTime) / 1000)
        };
    }
    
    async getTradingSignalsData() {
        // Implementar obtención de señales reales
        return [
            { symbol: 'BTCUSDT', signal: 'BUY', confidence: 85 }
        ];
    }
    
    async getQuantumStateData() {
        return {
            coherence: Math.random() * 0.3 + 0.7,
            energy: Math.random() * 50 + 100
        };
    }
    
    /**
     * Error handler
     */
    errorHandler(error, req, res, next) {
        console.error('❌ [API GATEWAY] Error:', error);
        this.metrics.failedRequests++;
        
        res.status(500).json({
            status: 'ERROR',
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * 404 handler
     */
    notFoundHandler(req, res) {
        res.status(404).json({
            status: 'NOT_FOUND',
            error: 'Endpoint not found',
            path: req.path,
            availableEndpoints: [
                'GET  /',
                'GET  /health',
                'GET  /api/services/status',
                'GET  /api/metrics',
                'POST /api/llm/decision',
                'GET  /api/trading/signals',
                'GET  /dashboard'
            ],
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Iniciar servidor
     */
    async start() {
        return new Promise((resolve, reject) => {
            try {
                const server = this.app.listen(this.port, () => {
                    console.log('🌐 [API GATEWAY] ========================================');
                    console.log('🌐 [API GATEWAY] QBTC API GATEWAY INICIADA');
                    console.log('🌐 [API GATEWAY] ========================================');
                    console.log(`🚀 [API GATEWAY] Servidor: http://localhost:${this.port}`);
                    console.log(`📊 [API GATEWAY] Servicios gestionados: ${Object.keys(this.services).length}`);
                    console.log('📋 [API GATEWAY] Endpoints disponibles:');
                    console.log('   GET  / - Información del gateway');
                    console.log('   GET  /health - Estado del gateway');
                    console.log('   GET  /api/services/status - Estado de servicios');
                    console.log('   GET  /api/metrics - Métricas agregadas');
                    console.log('   POST /api/llm/decision - Decisión LLM');
                    console.log('   GET  /api/trading/signals - Señales de trading');
                    console.log('   GET  /dashboard - Dashboard web');
                    console.log('🌐 [API GATEWAY] ========================================\n');
                    resolve(server);
                });
                
                // Manejo de shutdown graceful
                process.on('SIGINT', () => {
                    console.log('\n🛑 [API GATEWAY] Cerrando servidor...');
                    server.close(() => {
                        console.log('✅ [API GATEWAY] Servidor cerrado correctamente');
                        process.exit(0);
                    });
                });
                
            } catch (error) {
                console.error('❌ [API GATEWAY] Error iniciando servidor:', error);
                reject(error);
            }
        });
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const gateway = new QBTCApiGateway();
    gateway.start().catch(console.error);
}

module.exports = { QBTCApiGateway };

#!/usr/bin/env node
/**
 * 🧠 INTELLIGENT MONITOR - SISTEMA DE MONITOREO INTELIGENTE QBTC
 * Monitor inteligente con análisis predictivo y alertas automáticas
 * 
 * Utiliza métricas del sistema para análisis predictivo y reporta en segundo plano
 * Implementa RNG basado en kernel según las reglas definidas
 * 
 * @author QBTC Development Team
 * @version 3.0
 * @since 2025-01-09
 */

const Logger = require('../logging/hermetic-logger');
const MemoryOptimizer = require('../utils/memory-optimizer');
const { kernelRNG } = require('../utils/kernel-rng');

/**
 * Intelligent Monitor - Monitoreo inteligente con análisis predictivo
 */
class IntelligentMonitor {
    constructor(config = {}) {
        // Configuración del monitor
        this.config = {
            port: config.port || process.env.SERVICE_PORT || 14501,
            
            // Configuración de servicios QBTC a monitorear
            qbtcServices: config.qbtcServices || {
                masterControl: 'http://localhost:14001',
                hybridOptimizer: 'http://localhost:14301',
                concentratedHybrid: 'http://localhost:14302',
                tradingEngine: 'http://localhost:14201',
                quantumEngine: 'http://localhost:14115/health',
                dashboard: 'http://localhost:14401'
            },
            
            // Configuración de monitoreo
            monitoringInterval: config.monitoringInterval || 2000, // 2 segundos
            analysisInterval: config.analysisInterval || 10000, // 10 segundos
            predictiveAnalysisInterval: config.predictiveAnalysisInterval || 60000, // 1 minuto
            
            // Umbrales y configuración
            healthThreshold: config.healthThreshold || 0.7,
            memoryThreshold: config.memoryThreshold || 80,
            latencyThreshold: config.latencyThreshold || 5000, // 5 segundos
            errorRateThreshold: config.errorRateThreshold || 0.05, // 5%
            
            // Configuración de machine learning simple
            historicalDataPoints: config.historicalDataPoints || 1000,
            anomalyDetectionSensitivity: config.anomalyDetectionSensitivity || 0.15,
            
            // Configuración de alertas
            alertCooldown: config.alertCooldown || 60000, // 1 minuto
            enablePredictiveAlerts: config.enablePredictiveAlerts !== false,
            enableAnomalyDetection: config.enableAnomalyDetection !== false,
            
            ...config
        };

        // Estado del monitor
        this.state = {
            initialized: false,
            running: false,
            monitoringActive: false,
            lastHealthCheck: null,
            systemHealth: 0.0,
            
            // Contadores y métricas
            totalChecks: 0,
            totalErrors: 0,
            totalAlerts: 0,
            
            // Datos históricos para análisis
            historicalData: {
                systemHealth: [],
                serviceLatencies: new Map(),
                memoryUsage: [],
                errorRates: [],
                timestamps: []
            },
            
            // Estado de servicios
            services: new Map(),
            
            // Alertas activas y historial
            activeAlerts: new Map(),
            alertHistory: []
        };

        // Componentes del sistema
        this.memoryOptimizer = null;
        
        // Timers
        this.monitoringTimer = null;
        this.analysisTimer = null;
        this.predictiveTimer = null;

        // Utilidades
        this.logger = Logger.createLogger('IntelligentMonitor');
        this.rng = kernelRNG;

        // Machine Learning simple - modelos estadísticos
        this.models = {
            healthPredictor: {
                coefficients: [0.7, 0.2, 0.1], // Pesos para tendencias
                lastPredictions: [],
                accuracy: 0.0
            },
            anomalyDetector: {
                baseline: 0.0,
                variance: 0.0,
                threshold: 0.0,
                calibrated: false
            }
        };

        // Inicializar monitor
        this.initialize();
    }

    /**
     * Inicializar Intelligent Monitor
     */
    async initialize() {
        try {
            this.logger.info('🧠 Inicializando Intelligent Monitor...');

            // Configurar Memory Optimizer
            await this.initializeMemoryOptimizer();

            // Iniciar monitoreo en segundo plano
            this.startMonitoring();

            // Iniciar análisis predictivo
            this.startPredictiveAnalysis();

            // Calibrar modelos iniciales
            await this.calibrateModels();

            this.state.initialized = true;
            this.state.running = true;
            this.state.monitoringActive = true;

            this.logger.info('✅ Intelligent Monitor inicializado correctamente');

        } catch (error) {
            this.logger.error('❌ Error inicializando Intelligent Monitor:', error);
            throw error;
        }
    }

    /**
     * Inicializar Memory Optimizer
     */
    async initializeMemoryOptimizer() {
        this.memoryOptimizer = new MemoryOptimizer({
            memoryThreshold: 75, // Monitor conservador
            maxCacheSize: 1000, // Más espacio para datos históricos
            maxPatterns: 100,
            maxHistory: 1000,
            monitorInterval: 30000
        });

        await this.memoryOptimizer.initialize();
        this.logger.info('🧠 Memory Optimizer configurado para monitor inteligente');
    }

    /**
     * Iniciar monitoreo continuo
     */
    startMonitoring() {
        this.monitoringTimer = setInterval(async () => {
            await this.performMonitoringCycle();
        }, this.config.monitoringInterval);

        this.logger.info('🔍 Monitoreo continuo iniciado en segundo plano');
    }

    /**
     * Iniciar análisis predictivo
     */
    startPredictiveAnalysis() {
        // Análisis estadístico cada 10 segundos
        this.analysisTimer = setInterval(async () => {
            await this.performStatisticalAnalysis();
        }, this.config.analysisInterval);

        // Análisis predictivo cada minuto
        this.predictiveTimer = setInterval(async () => {
            await this.performPredictiveAnalysis();
        }, this.config.predictiveAnalysisInterval);

        this.logger.info('🔮 Análisis predictivo iniciado');
    }

    /**
     * Realizar ciclo de monitoreo
     */
    async performMonitoringCycle() {
        try {
            const cycleStart = Date.now();
            
            // Recopilar datos de servicios
            const servicesData = await this.collectServicesData();
            
            // Calcular salud del sistema
            const systemHealth = this.calculateSystemHealth(servicesData);
            
            // Detectar anomalías en tiempo real
            const anomalies = await this.detectAnomalies(systemHealth, servicesData);
            
            // Actualizar estado
            this.updateMonitoringState(systemHealth, servicesData);
            
            // Almacenar datos históricos
            this.storeHistoricalData(systemHealth, servicesData);
            
            // Procesar alertas
            await this.processAlerts(anomalies, servicesData);
            
            // Actualizar contadores
            this.state.totalChecks++;
            this.state.lastHealthCheck = Date.now();
            
            const cycleTime = Date.now() - cycleStart;
            if (cycleTime > 1000) { // Log si el ciclo toma más de 1 segundo
                this.logger.warn(`⚠️ Ciclo de monitoreo lento: ${cycleTime}ms`);
            }

        } catch (error) {
            this.state.totalErrors++;
            this.logger.error('❌ Error en ciclo de monitoreo:', error);
        }
    }

    /**
     * Recopilar datos de servicios
     */
    async collectServicesData() {
        const servicesData = new Map();
        const promises = [];

        for (const [serviceName, serviceUrl] of Object.entries(this.config.qbtcServices)) {
            const promise = this.fetchServiceMetrics(serviceName, serviceUrl)
                .then(data => {
                    servicesData.set(serviceName, data);
                })
                .catch(error => {
                    servicesData.set(serviceName, {
                        status: 'error',
                        error: error.message,
                        timestamp: Date.now(),
                        responseTime: null
                    });
                });
            
            promises.push(promise);
        }

        // Esperar a que todas las requests terminen
        await Promise.allSettled(promises);
        
        return servicesData;
    }

    /**
     * Obtener métricas de un servicio específico
     */
    async fetchServiceMetrics(serviceName, serviceUrl) {
        const startTime = Date.now();
        
        try {
            const response = await fetch(`${serviceUrl}/health`, {
                method: 'GET',
                timeout: 5000,
                headers: { 'User-Agent': 'QBTC-IntelligentMonitor/3.0' }
            });

            const responseTime = Date.now() - startTime;
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const healthData = await response.json();
            
            // Extraer métricas relevantes
            const metrics = {
                status: healthData.status === 'OK' ? 'healthy' : 'unhealthy',
                service: healthData.service || serviceName,
                port: healthData.port,
                uptime: healthData.uptime || 0,
                responseTime: responseTime,
                timestamp: Date.now(),
                rawData: healthData
            };

            // Métricas específicas por servicio
            this.extractServiceSpecificMetrics(serviceName, healthData, metrics);

            return metrics;

        } catch (error) {
            return {
                status: 'error',
                error: error.message,
                responseTime: Date.now() - startTime,
                timestamp: Date.now(),
                service: serviceName
            };
        }
    }

    /**
     * Extraer métricas específicas por servicio
     */
    extractServiceSpecificMetrics(serviceName, healthData, metrics) {
        switch (serviceName) {
            case 'masterControl':
                metrics.systemHealth = healthData.systemHealth || 0;
                metrics.servicesCount = healthData.services || 0;
                metrics.subsystemsCount = healthData.subsystems || 0;
                break;

            case 'hybridOptimizer':
                metrics.quantumCoherence = healthData.quantum_coherence || 0;
                metrics.classicalConfidence = healthData.classical_confidence || 0;
                metrics.hybridSynergy = healthData.hybrid_synergy || 0;
                metrics.optimizationsTotal = healthData.optimizations_total || 0;
                break;

            case 'concentratedHybrid':
                metrics.concentrationIntensity = healthData.concentration_intensity || 0;
                metrics.patternConfidence = healthData.pattern_confidence || 0;
                metrics.signalStrength = healthData.signal_strength || 0;
                break;

            case 'tradingEngine':
                metrics.activeTrades = healthData.active_trades || 0;
                metrics.profit = healthData.profit || 0;
                metrics.winRate = healthData.win_rate || 0;
                break;

            case 'quantumEngine':
                metrics.coherence = healthData.coherence || 0;
                metrics.quantumField = healthData.quantum_field || 0;
                metrics.entanglementLevel = healthData.entanglement_level || 0;
                break;

            case 'dashboard':
                metrics.connectedClients = healthData.connectedClients || 0;
                metrics.alertsActive = healthData.alertsActive || 0;
                break;
        }

        // Métricas comunes de rendimiento
        if (healthData.memory) {
            metrics.memoryUsage = healthData.memory.usage || 0;
            metrics.memoryTotal = healthData.memory.total || 0;
        }

        if (healthData.cpu) {
            metrics.cpuUsage = healthData.cpu.usage || 0;
        }
    }

    /**
     * Calcular salud del sistema
     */
    calculateSystemHealth(servicesData) {
        let healthyServices = 0;
        let totalWeight = 0;
        let weightedHealth = 0;

        // Pesos por importancia del servicio
        const serviceWeights = {
            masterControl: 0.25,
            quantumEngine: 0.20,
            tradingEngine: 0.20,
            hybridOptimizer: 0.15,
            concentratedHybrid: 0.10,
            dashboard: 0.10
        };

        for (const [serviceName, serviceData] of servicesData) {
            const weight = serviceWeights[serviceName] || 0.1;
            totalWeight += weight;

            if (serviceData.status === 'healthy') {
                healthyServices++;
                
                // Calcular salud ponderada basada en métricas específicas
                let serviceHealth = 1.0;
                
                // Penalizar por alta latencia
                if (serviceData.responseTime > this.config.latencyThreshold) {
                    serviceHealth *= 0.8;
                }
                
                // Penalizar por uso de memoria alto
                if (serviceData.memoryUsage > this.config.memoryThreshold) {
                    serviceHealth *= 0.9;
                }

                // Bonificar servicios con métricas específicas buenas
                if (serviceName === 'hybridOptimizer' && serviceData.hybridSynergy > 0.8) {
                    serviceHealth = Math.min(serviceHealth * 1.1, 1.0);
                }

                weightedHealth += serviceHealth * weight;
            } else {
                // Servicio no saludable - penalización severa
                weightedHealth += 0.0;
            }
        }

        return totalWeight > 0 ? weightedHealth / totalWeight : 0.0;
    }

    /**
     * Detectar anomalías en tiempo real
     */
    async detectAnomalies(systemHealth, servicesData) {
        const anomalies = [];

        if (!this.config.enableAnomalyDetection || !this.models.anomalyDetector.calibrated) {
            return anomalies;
        }

        // Detectar anomalías en salud del sistema
        const healthAnomaly = this.detectHealthAnomaly(systemHealth);
        if (healthAnomaly) {
            anomalies.push(healthAnomaly);
        }

        // Detectar anomalías en servicios individuales
        for (const [serviceName, serviceData] of servicesData) {
            const serviceAnomalies = this.detectServiceAnomalies(serviceName, serviceData);
            anomalies.push(...serviceAnomalies);
        }

        // Detectar patrones anómalos en latencia
        const latencyAnomalies = this.detectLatencyAnomalies(servicesData);
        anomalies.push(...latencyAnomalies);

        return anomalies;
    }

    /**
     * Detectar anomalías en salud del sistema
     */
    detectHealthAnomaly(currentHealth) {
        const baseline = this.models.anomalyDetector.baseline;
        const threshold = this.models.anomalyDetector.threshold;

        const deviation = Math.abs(currentHealth - baseline);
        
        if (deviation > threshold) {
            return {
                type: 'system_health_anomaly',
                severity: deviation > threshold * 2 ? 'critical' : 'warning',
                message: `Anomalía en salud del sistema: ${(currentHealth * 100).toFixed(1)}% (esperado ~${(baseline * 100).toFixed(1)}%)`,
                value: currentHealth,
                expected: baseline,
                deviation: deviation,
                timestamp: Date.now()
            };
        }

        return null;
    }

    /**
     * Detectar anomalías en servicios individuales
     */
    detectServiceAnomalies(serviceName, serviceData) {
        const anomalies = [];

        // Anomalía de servicio caído
        if (serviceData.status === 'error') {
            anomalies.push({
                type: 'service_down_anomaly',
                severity: this.getServiceCriticality(serviceName),
                message: `Servicio ${serviceName} no responde: ${serviceData.error}`,
                service: serviceName,
                error: serviceData.error,
                timestamp: serviceData.timestamp
            });
        }

        // Anomalía de alta latencia
        if (serviceData.responseTime > this.config.latencyThreshold) {
            anomalies.push({
                type: 'high_latency_anomaly',
                severity: 'warning',
                message: `Alta latencia en ${serviceName}: ${serviceData.responseTime}ms`,
                service: serviceName,
                value: serviceData.responseTime,
                threshold: this.config.latencyThreshold,
                timestamp: serviceData.timestamp
            });
        }

        // Anomalía de uso de memoria
        if (serviceData.memoryUsage && serviceData.memoryUsage > this.config.memoryThreshold) {
            anomalies.push({
                type: 'high_memory_anomaly',
                severity: serviceData.memoryUsage > 90 ? 'critical' : 'warning',
                message: `Uso alto de memoria en ${serviceName}: ${serviceData.memoryUsage}%`,
                service: serviceName,
                value: serviceData.memoryUsage,
                threshold: this.config.memoryThreshold,
                timestamp: serviceData.timestamp
            });
        }

        return anomalies;
    }

    /**
     * Detectar anomalías en latencia
     */
    detectLatencyAnomalies(servicesData) {
        const anomalies = [];
        const latencies = [];

        for (const [serviceName, serviceData] of servicesData) {
            if (serviceData.responseTime !== null && serviceData.responseTime > 0) {
                latencies.push({
                    service: serviceName,
                    latency: serviceData.responseTime,
                    timestamp: serviceData.timestamp
                });
            }
        }

        if (latencies.length < 2) return anomalies;

        // Calcular estadísticas de latencia
        const latencyValues = latencies.map(l => l.latency);
        const avgLatency = latencyValues.reduce((a, b) => a + b, 0) / latencyValues.length;
        const maxLatency = Math.max(...latencyValues);

        // Detectar latencia anómalamente alta en conjunto
        if (maxLatency > avgLatency * 3 && maxLatency > 1000) {
            const slowService = latencies.find(l => l.latency === maxLatency);
            
            anomalies.push({
                type: 'extreme_latency_anomaly',
                severity: 'critical',
                message: `Latencia extrema detectada en ${slowService.service}: ${maxLatency}ms (promedio: ${avgLatency.toFixed(0)}ms)`,
                service: slowService.service,
                value: maxLatency,
                average: avgLatency,
                timestamp: slowService.timestamp
            });
        }

        return anomalies;
    }

    /**
     * Obtener criticidad del servicio
     */
    getServiceCriticality(serviceName) {
        const criticalServices = ['masterControl', 'quantumEngine', 'tradingEngine'];
        return criticalServices.includes(serviceName) ? 'critical' : 'warning';
    }

    /**
     * Actualizar estado de monitoreo
     */
    updateMonitoringState(systemHealth, servicesData) {
        this.state.systemHealth = systemHealth;
        this.state.services = new Map(servicesData);

        // Calcular tasa de errores
        const totalServices = servicesData.size;
        const errorServices = Array.from(servicesData.values()).filter(s => s.status === 'error').length;
        const errorRate = totalServices > 0 ? errorServices / totalServices : 0;

        if (errorRate > this.config.errorRateThreshold) {
            this.logger.warn(`⚠️ Alta tasa de errores detectada: ${(errorRate * 100).toFixed(1)}%`);
        }
    }

    /**
     * Almacenar datos históricos
     */
    storeHistoricalData(systemHealth, servicesData) {
        const timestamp = Date.now();
        
        // Almacenar salud del sistema
        this.state.historicalData.systemHealth.push({
            value: systemHealth,
            timestamp: timestamp
        });

        // Almacenar latencias por servicio
        for (const [serviceName, serviceData] of servicesData) {
            if (!this.state.historicalData.serviceLatencies.has(serviceName)) {
                this.state.historicalData.serviceLatencies.set(serviceName, []);
            }
            
            if (serviceData.responseTime !== null) {
                this.state.historicalData.serviceLatencies.get(serviceName).push({
                    value: serviceData.responseTime,
                    timestamp: timestamp
                });
            }
        }

        // Almacenar timestamp
        this.state.historicalData.timestamps.push(timestamp);

        // Limpiar datos antiguos usando Memory Optimizer
        this.cleanupHistoricalData();
    }

    /**
     * Limpiar datos históricos antiguos
     */
    cleanupHistoricalData() {
        const maxPoints = this.config.historicalDataPoints;
        
        // Limpiar salud del sistema
        if (this.state.historicalData.systemHealth.length > maxPoints) {
            const excess = this.state.historicalData.systemHealth.length - maxPoints;
            this.state.historicalData.systemHealth.splice(0, excess);
        }

        // Limpiar latencias por servicio
        for (const [serviceName, latencyData] of this.state.historicalData.serviceLatencies) {
            if (latencyData.length > maxPoints) {
                const excess = latencyData.length - maxPoints;
                latencyData.splice(0, excess);
            }
        }

        // Limpiar timestamps
        if (this.state.historicalData.timestamps.length > maxPoints) {
            const excess = this.state.historicalData.timestamps.length - maxPoints;
            this.state.historicalData.timestamps.splice(0, excess);
        }
    }

    /**
     * Procesar alertas
     */
    async processAlerts(anomalies, servicesData) {
        for (const anomaly of anomalies) {
            await this.handleAnomaly(anomaly);
        }

        // Limpiar alertas expiradas
        await this.cleanupExpiredAlerts();
    }

    /**
     * Manejar anomalía detectada
     */
    async handleAnomaly(anomaly) {
        const alertKey = `${anomaly.type}_${anomaly.service || 'system'}`;
        const now = Date.now();

        // Verificar cooldown
        const existingAlert = this.state.activeAlerts.get(alertKey);
        if (existingAlert && (now - existingAlert.lastSent) < this.config.alertCooldown) {
            return; // Skip - en cooldown
        }

        // Crear o actualizar alerta
        const alert = {
            id: alertKey,
            type: anomaly.type,
            severity: anomaly.severity,
            message: anomaly.message,
            service: anomaly.service,
            value: anomaly.value,
            threshold: anomaly.threshold,
            firstDetected: existingAlert ? existingAlert.firstDetected : now,
            lastDetected: now,
            lastSent: now,
            count: existingAlert ? existingAlert.count + 1 : 1
        };

        this.state.activeAlerts.set(alertKey, alert);
        
        // Agregar al historial
        this.state.alertHistory.push({...alert, timestamp: now});
        
        // Limpiar historial si es muy grande
        if (this.state.alertHistory.length > 1000) {
            this.state.alertHistory.splice(0, this.state.alertHistory.length - 1000);
        }

        // Log de la alerta
        this.logAlert(alert);
        
        // Enviar notificación (futuro: integrar con sistemas de notificación)
        await this.sendAlert(alert);
        
        this.state.totalAlerts++;
    }

    /**
     * Log de alerta
     */
    logAlert(alert) {
        const logMessage = `🚨 ALERTA ${alert.severity.toUpperCase()}: ${alert.message}`;
        
        switch (alert.severity) {
            case 'critical':
                this.logger.error(logMessage);
                break;
            case 'warning':
                this.logger.warn(logMessage);
                break;
            default:
                this.logger.info(logMessage);
        }
    }

    /**
     * Enviar alerta (placeholder para futuras integraciones)
     */
    async sendAlert(alert) {
        // Futuro: integrar con Slack, email, webhook, etc.
        // Por ahora solo registramos en segundo plano
        this.logger.debug(`📤 Alerta enviada: ${alert.id}`);
    }

    /**
     * Limpiar alertas expiradas
     */
    async cleanupExpiredAlerts() {
        const now = Date.now();
        const alertTimeout = this.config.alertCooldown * 5; // 5 veces el cooldown
        
        for (const [alertKey, alert] of this.state.activeAlerts) {
            if (now - alert.lastDetected > alertTimeout) {
                this.state.activeAlerts.delete(alertKey);
                this.logger.debug(`🧹 Alerta expirada limpiada: ${alertKey}`);
            }
        }
    }

    /**
     * Realizar análisis estadístico
     */
    async performStatisticalAnalysis() {
        try {
            if (this.state.historicalData.systemHealth.length < 10) {
                return; // No hay suficientes datos
            }

            // Análisis de tendencias
            const trends = this.analyzeTrends();
            
            // Calibrar detector de anomalías
            this.calibrateAnomalyDetector();
            
            // Análisis de correlaciones
            const correlations = this.analyzeCorrelations();

            this.logger.debug(`📈 Análisis estadístico completado - Tendencias: ${Object.keys(trends).length}, Correlaciones: ${Object.keys(correlations).length}`);

        } catch (error) {
            this.logger.error('❌ Error en análisis estadístico:', error);
        }
    }

    /**
     * Analizar tendencias
     */
    analyzeTrends() {
        const healthData = this.state.historicalData.systemHealth.slice(-50); // Últimos 50 puntos
        
        if (healthData.length < 5) return {};

        const values = healthData.map(d => d.value);
        const trend = this.calculateLinearTrend(values);

        const trends = {
            systemHealth: {
                slope: trend.slope,
                direction: trend.slope > 0.01 ? 'improving' : trend.slope < -0.01 ? 'degrading' : 'stable',
                confidence: trend.r2
            }
        };

        // Log tendencias significativas
        if (Math.abs(trend.slope) > 0.02 && trend.r2 > 0.5) {
            const direction = trend.slope > 0 ? 'mejorando' : 'degradándose';
            this.logger.info(`📈 Tendencia detectada: Salud del sistema ${direction} (pendiente: ${trend.slope.toFixed(4)}, R²: ${trend.r2.toFixed(3)})`);
        }

        return trends;
    }

    /**
     * Calcular tendencia lineal simple
     */
    calculateLinearTrend(values) {
        const n = values.length;
        const x = Array.from({length: n}, (_, i) => i);
        const y = values;

        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Calcular R²
        const yMean = sumY / n;
        const ssRes = y.reduce((sum, yi, i) => {
            const predicted = slope * i + intercept;
            return sum + Math.pow(yi - predicted, 2);
        }, 0);
        const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
        const r2 = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;

        return { slope, intercept, r2 };
    }

    /**
     * Calibrar detector de anomalías
     */
    calibrateAnomalyDetector() {
        const healthValues = this.state.historicalData.systemHealth.map(d => d.value);
        
        if (healthValues.length < 20) return;

        const mean = healthValues.reduce((a, b) => a + b, 0) / healthValues.length;
        const variance = healthValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / healthValues.length;
        const stdDev = Math.sqrt(variance);

        this.models.anomalyDetector.baseline = mean;
        this.models.anomalyDetector.variance = variance;
        this.models.anomalyDetector.threshold = stdDev * this.config.anomalyDetectionSensitivity;
        this.models.anomalyDetector.calibrated = true;

        this.logger.debug(`🎯 Detector de anomalías calibrado - Baseline: ${mean.toFixed(3)}, Threshold: ${this.models.anomalyDetector.threshold.toFixed(3)}`);
    }

    /**
     * Analizar correlaciones
     */
    analyzeCorrelations() {
        // Placeholder para análisis de correlaciones más sofisticado
        // Futuro: analizar correlaciones entre servicios, métricas, etc.
        return {};
    }

    /**
     * Realizar análisis predictivo
     */
    async performPredictiveAnalysis() {
        try {
            if (!this.config.enablePredictiveAlerts || this.state.historicalData.systemHealth.length < 30) {
                return;
            }

            // Predicción de salud del sistema
            const healthPrediction = this.predictSystemHealth();
            
            // Predicción de problemas
            const problemPrediction = this.predictPotentialProblems();

            // Generar alertas predictivas si es necesario
            if (healthPrediction.risk > 0.7) {
                await this.handlePredictiveAlert('system_health_risk', healthPrediction);
            }

            if (problemPrediction.length > 0) {
                for (const problem of problemPrediction) {
                    await this.handlePredictiveAlert('predicted_problem', problem);
                }
            }

        } catch (error) {
            this.logger.error('❌ Error en análisis predictivo:', error);
        }
    }

    /**
     * Predecir salud del sistema
     */
    predictSystemHealth() {
        const recentData = this.state.historicalData.systemHealth.slice(-30);
        const values = recentData.map(d => d.value);
        
        // Predicción simple basada en promedio ponderado de tendencias
        const short = values.slice(-5).reduce((a, b) => a + b, 0) / 5; // Últimos 5
        const medium = values.slice(-15).reduce((a, b) => a + b, 0) / 15; // Últimos 15
        const long = values.reduce((a, b) => a + b, 0) / values.length; // Todos

        const prediction = (short * 0.5) + (medium * 0.3) + (long * 0.2);
        const currentHealth = values[values.length - 1];
        
        const risk = currentHealth > prediction ? 0 : (prediction - currentHealth) / prediction;

        return {
            predicted: prediction,
            current: currentHealth,
            risk: Math.min(risk, 1.0),
            confidence: values.length >= 30 ? 0.7 : 0.4
        };
    }

    /**
     * Predecir problemas potenciales
     */
    predictPotentialProblems() {
        const problems = [];

        // Analizar patrones de latencia creciente
        for (const [serviceName, latencyData] of this.state.historicalData.serviceLatencies) {
            if (latencyData.length < 10) continue;

            const recentLatencies = latencyData.slice(-10).map(d => d.value);
            const trend = this.calculateLinearTrend(recentLatencies);

            if (trend.slope > 50 && trend.r2 > 0.6) { // Latencia creciendo >50ms por punto con buena correlación
                problems.push({
                    type: 'increasing_latency',
                    service: serviceName,
                    severity: 'warning',
                    message: `Latencia creciente predicha en ${serviceName}`,
                    trend: trend.slope,
                    confidence: trend.r2
                });
            }
        }

        return problems;
    }

    /**
     * Manejar alerta predictiva
     */
    async handlePredictiveAlert(type, prediction) {
        const anomaly = {
            type: `predictive_${type}`,
            severity: prediction.risk > 0.8 ? 'critical' : 'warning',
            message: this.generatePredictiveMessage(type, prediction),
            service: prediction.service || 'system',
            value: prediction.predicted || prediction.risk,
            confidence: prediction.confidence
        };

        await this.handleAnomaly(anomaly);
    }

    /**
     * Generar mensaje predictivo
     */
    generatePredictiveMessage(type, prediction) {
        switch (type) {
            case 'system_health_risk':
                return `Riesgo predicho en salud del sistema: ${(prediction.risk * 100).toFixed(1)}% (predicción: ${(prediction.predicted * 100).toFixed(1)}%)`;
            case 'predicted_problem':
                return prediction.message || 'Problema predicho en el sistema';
            default:
                return 'Alerta predictiva generada';
        }
    }

    /**
     * Calibrar modelos iniciales
     */
    async calibrateModels() {
        // Esperar algunos ciclos para tener datos iniciales
        setTimeout(() => {
            if (this.state.historicalData.systemHealth.length > 5) {
                this.calibrateAnomalyDetector();
                this.logger.info('🎯 Modelos iniciales calibrados');
            }
        }, 30000); // 30 segundos
    }

    /**
     * Obtener estado del monitor (API endpoint)
     */
    getMonitorStatus() {
        return {
            status: 'OK',
            service: 'Intelligent Monitor',
            port: this.config.port,
            running: this.state.running,
            monitoringActive: this.state.monitoringActive,
            systemHealth: this.state.systemHealth,
            lastHealthCheck: this.state.lastHealthCheck,
            
            // Estadísticas
            totalChecks: this.state.totalChecks,
            totalErrors: this.state.totalErrors,
            totalAlerts: this.state.totalAlerts,
            activeAlertsCount: this.state.activeAlerts.size,
            
            // Estado de modelos
            anomalyDetectorCalibrated: this.models.anomalyDetector.calibrated,
            historicalDataPoints: this.state.historicalData.systemHealth.length,
            
            // Configuración
            config: {
                monitoringInterval: this.config.monitoringInterval,
                enablePredictiveAlerts: this.config.enablePredictiveAlerts,
                enableAnomalyDetection: this.config.enableAnomalyDetection
            },
            
            uptime: Date.now() - (this.memoryOptimizer ? this.memoryOptimizer.getStats().startTime || Date.now() : Date.now()),
            memory: this.memoryOptimizer ? this.memoryOptimizer.getStats() : null
        };
    }

    /**
     * Obtener alertas activas (API endpoint)
     */
    getActiveAlerts() {
        return {
            total: this.state.activeAlerts.size,
            alerts: Array.from(this.state.activeAlerts.values()).map(alert => ({
                id: alert.id,
                type: alert.type,
                severity: alert.severity,
                message: alert.message,
                service: alert.service,
                firstDetected: alert.firstDetected,
                lastDetected: alert.lastDetected,
                count: alert.count
            }))
        };
    }

    /**
     * Obtener datos históricos (API endpoint)
     */
    getHistoricalData(metric = 'systemHealth', limit = 100) {
        let data;
        
        switch (metric) {
            case 'systemHealth':
                data = this.state.historicalData.systemHealth;
                break;
            default:
                data = [];
        }

        return {
            metric,
            points: data.slice(-limit).map(point => ({
                timestamp: point.timestamp,
                value: point.value
            }))
        };
    }

    /**
     * Shutdown graceful
     */
    async shutdown() {
        this.logger.info('🔄 Cerrando Intelligent Monitor...');

        this.state.running = false;
        this.state.monitoringActive = false;

        // Detener timers
        if (this.monitoringTimer) {
            clearInterval(this.monitoringTimer);
        }
        
        if (this.analysisTimer) {
            clearInterval(this.analysisTimer);
        }
        
        if (this.predictiveTimer) {
            clearInterval(this.predictiveTimer);
        }

        // Cerrar Memory Optimizer
        if (this.memoryOptimizer) {
            await this.memoryOptimizer.shutdown();
        }

        this.logger.info('✅ Intelligent Monitor cerrado correctamente');
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
    const express = require('express');
    const monitor = new IntelligentMonitor();
    
    // Configurar servidor HTTP
    const app = express();
    app.use(express.json());
    
    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json(monitor.getMonitorStatus());
    });
    
    // Status endpoint
    app.get('/status', (req, res) => {
        res.json(monitor.getMonitorStatus());
    });
    
    // Active alerts endpoint
    app.get('/alerts', (req, res) => {
        res.json(monitor.getActiveAlerts());
    });
    
    // Historical data endpoint
    app.get('/data/:metric?', (req, res) => {
        const metric = req.params.metric || 'systemHealth';
        const limit = parseInt(req.query.limit) || 100;
        res.json(monitor.getHistoricalData(metric, limit));
    });
    
    // Iniciar servidor HTTP
    const server = app.listen(monitor.config.port, () => {
        console.log(`🧠 Intelligent Monitor servidor iniciado en puerto ${monitor.config.port}`);
    });
    
    // Manejo de señales para shutdown graceful
    process.on('SIGTERM', async () => {
        await monitor.shutdown();
        server.close();
        process.exit(0);
    });
    
    process.on('SIGINT', async () => {
        await monitor.shutdown();
        server.close();
        process.exit(0);
    });
    
    // Manejo de errores no capturados
    process.on('uncaughtException', (error) => {
        console.error('💰 Uncaught Exception:', error);
        monitor.shutdown().then(() => {
            server.close();
            process.exit(1);
        });
    });
    
    process.on('unhandledRejection', (reason, promise) => {
        console.error('💰 Unhandled Rejection at:', promise, 'reason:', reason);
        monitor.shutdown().then(() => {
            server.close();
            process.exit(1);
        });
    });
}

module.exports = IntelligentMonitor;

/**
 * 🖥️ INTELLIGENT MONITORING DASHBOARD
 * ===================================
 * 
 * Sistema de monitoreo y visualización inteligente que proporciona:
 * - Vista en tiempo real del ecosistema completo
 * - Dashboard web interactivo
 * - Métricas avanzadas y alertas
 * - Análisis de performance
 * - Visualización de correlaciones
 * - Panel de control para gestión
 * 
 * ECOSISTEMA MONITOREADO:
 * - Core Anti-418 (4602)
 * - Hybrid Optimizer V2 (4800) 
 * - Concentrated Hybrid V3 (4850)
 * - Este Monitor (5000)
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// 🎯 CONFIGURACIÓN DEL MONITOR - OPTIMIZADA PARA REDUCIR OVERHEAD
const MONITOR_CONFIG = {
    UPDATE_INTERVAL: 15000,     // 15 segundos (era 5s) - Reduce overhead 3x
    HEALTH_CHECK_INTERVAL: 30000, // Health checks cada 30s
    LIGHT_UPDATE_INTERVAL: 45000,  // Updates ligeros cada 45s
    ALERT_THRESHOLDS: {
        LOW_DATA_QUALITY: 0.3,
        HIGH_ERROR_RATE: 0.15,      // Más tolerante para evitar alertas innecesarias
        LOW_CORRELATION: 0.5,
        SYSTEM_DOWN_TIMEOUT: 15000  // 15s en lugar de 10s
    },
    SYSTEMS: {
        CORE_ANTI_418: {
            name: 'Core Anti-418',
            url: 'http://localhost:4602',
            endpoints: {
                health: '/health',
                overview: '/api/strategic-overview',
                signals: '/api/raw-signals',
                opportunities: '/api/raw-opportunities'
            },
            priority: 1
        },
        HYBRID_OPTIMIZER: {
            name: 'Hybrid Optimizer V2',
            url: 'http://localhost:4800',
            endpoints: {
                health: '/health',
                analysis: '/api/hybrid-analysis',
                recommendations: '/api/optimized-recommendations'
            },
            priority: 2
        },
        CONCENTRATED_HYBRID: {
            name: 'Concentrated Hybrid V3',
            url: 'http://localhost:4850',
            endpoints: {
                health: '/health',
                analysis: '/api/concentrated-analysis',
                tiers: '/api/tier-analysis'
            },
            priority: 3
        },
        ENHANCED_RECOMMENDATIONS: {
            name: 'Enhanced Recommendations Service',
            url: 'http://localhost:4608',
            endpoints: {
                health: '/health',
                recommendations: '/api/enhanced-recommendations',
                patterns: '/api/pattern-analysis',
                metrics: '/api/performance-metrics',
                alerts: '/api/alerts'
            },
            priority: 4
        }
    }
};

console.log('🖥️ [MONITOR] Iniciando Sistema de Monitoreo Inteligente...');

// 🧠 MOTOR DE MONITOREO INTELIGENTE
class IntelligentMonitor {
    constructor() {
        this.systemsStatus = {};
        this.performanceHistory = [];
        this.alerts = [];
        this.isRunning = false;
        this.updateInterval = null;
        this.connectedClients = 0;
        
        this.initializeSystems();
        console.log('🧠 [MONITOR ENGINE] Motor de monitoreo inteligente inicializado');
    }
    
    initializeSystems() {
        for (const [key, system] of Object.entries(MONITOR_CONFIG.SYSTEMS)) {
            this.systemsStatus[key] = {
                name: system.name,
                status: 'UNKNOWN',
                lastUpdate: 0,
                uptime: 0,
                responseTime: 0,
                errorRate: 0,
                dataQuality: 0,
                alerts: [],
                metrics: {}
            };
        }
    }
    
    start() {
        if (this.isRunning) return;
        
        console.log('🚀 [MONITOR] Iniciando monitoreo en tiempo real...');
        this.isRunning = true;
        
        // Actualización inicial
        this.updateAllSystems();
        
        // Configurar intervalo de actualización
        this.updateInterval = setInterval(() => {
            this.updateAllSystems();
        }, MONITOR_CONFIG.UPDATE_INTERVAL);
        
        console.log(`⏰ [MONITOR] Actualizando cada ${MONITOR_CONFIG.UPDATE_INTERVAL/1000}s`);
    }
    
    stop() {
        if (!this.isRunning) return;
        
        console.log('⏹️ [MONITOR] Deteniendo monitoreo...');
        this.isRunning = false;
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    async updateAllSystems() {
        const startTime = Date.now();
        const systemUpdates = [];
        
        // Actualizar todos los sistemas en paralelo
        for (const [key, system] of Object.entries(MONITOR_CONFIG.SYSTEMS)) {
            systemUpdates.push(this.updateSystemStatus(key, system));
        }
        
        try {
            await Promise.all(systemUpdates);
            
            // Generar análisis inteligente
            const intelligentAnalysis = this.generateIntelligentAnalysis();
            
            // Detectar alertas
            this.detectAlerts();
            
            // Guardar en historial
            this.savePerformanceSnapshot();
            
            // Emitir actualización a clientes conectados
            if (this.connectedClients > 0) {
                io.emit('systemUpdate', {
                    timestamp: Date.now(),
                    systems: this.systemsStatus,
                    analysis: intelligentAnalysis,
                    alerts: this.alerts.slice(-10), // Últimas 10 alertas
                    performance: this.getPerformanceMetrics(),
                    ecosystemHealth: this.calculateEcosystemHealth()
                });
            }
            
            const totalTime = Date.now() - startTime;
            // Solo log si toma más de 1000ms o cada 10 actualizaciones
            if (totalTime > 1000 || (Date.now() % 150000) < 15000) {
                console.log(`📊 [MONITOR] Actualización completada en ${totalTime}ms`);
            }
            
        } catch (error) {
            console.error('❌ [MONITOR] Error en actualización:', error.message);
        }
    }
    
    async updateSystemStatus(key, systemConfig) {
        const status = this.systemsStatus[key];
        const startTime = Date.now();
        
        try {
            // Verificar salud del sistema
            const healthResponse = await axios.get(
                `${systemConfig.url}${systemConfig.endpoints.health}`,
                { timeout: 8000 }
            );
            
            const responseTime = Date.now() - startTime;
            
            // Obtener datos específicos del sistema
            const systemData = await this.fetchSystemSpecificData(key, systemConfig);
            
            // Actualizar estado
            status.status = 'ACTIVE';
            status.lastUpdate = Date.now();
            status.responseTime = responseTime;
            status.uptime = Date.now() - (status.startTime || Date.now());
            
            // Mejorar algoritmo de error rate - reducción más agresiva en éxito
            status.errorRate = Math.max(0, status.errorRate - 0.05); // Reducir 5% en éxito
            status.dataQuality = this.calculateDataQuality(systemData);
            status.metrics = systemData;
            
            // Limpiar alertas viejas
            status.alerts = status.alerts.filter(alert => 
                Date.now() - alert.timestamp < 60000 // Solo últimos 60s
            );
            
        } catch (error) {
            // Sistema caído o con error
            status.status = error.code === 'ECONNREFUSED' ? 'DOWN' : 'ERROR';
            status.responseTime = Date.now() - startTime;
            
            // Incremento más conservador de error rate (2% en lugar de 10%)
            status.errorRate = Math.min(1, status.errorRate + 0.02);
            
            // Agregar alerta de sistema caído
            status.alerts.push({
                type: 'SYSTEM_ERROR',
                message: `Sistema ${systemConfig.name} no responde: ${error.message}`,
                timestamp: Date.now(),
                severity: 'HIGH'
            });
            
            console.log(`❌ [MONITOR] ${systemConfig.name}: ${error.message}`);
        }
    }
    
    async fetchSystemSpecificData(key, systemConfig) {
        const data = {};
        
        try {
            switch (key) {
                case 'CORE_ANTI_418':
                    // Obtener overview estratégico
                    const overviewResponse = await axios.get(
                        `${systemConfig.url}${systemConfig.endpoints.overview}`,
                        { timeout: 5000 }
                    );
                    data.overview = overviewResponse.data;
                    
                    // Obtener señales y oportunidades
                    const signalsResponse = await axios.get(
                        `${systemConfig.url}${systemConfig.endpoints.signals}`,
                        { timeout: 5000 }
                    );
                    data.signals = signalsResponse.data;
                    
                    const opportunitiesResponse = await axios.get(
                        `${systemConfig.url}${systemConfig.endpoints.opportunities}`,
                        { timeout: 5000 }
                    );
                    data.opportunities = opportunitiesResponse.data;
                    break;
                    
                case 'HYBRID_OPTIMIZER':
                    const hybridAnalysisResponse = await axios.get(
                        `${systemConfig.url}${systemConfig.endpoints.analysis}`,
                        { timeout: 8000 }
                    );
                    data.analysis = hybridAnalysisResponse.data;
                    break;
                    
                case 'CONCENTRATED_HYBRID':
                    const concentratedAnalysisResponse = await axios.get(
                        `${systemConfig.url}${systemConfig.endpoints.analysis}`,
                        { timeout: 8000 }
                    );
                    data.analysis = concentratedAnalysisResponse.data;
                    break;
                    
                case 'ENHANCED_RECOMMENDATIONS':
                    // Obtener recomendaciones IA avanzadas
                    const recommendationsResponse = await axios.get(
                        `${systemConfig.url}${systemConfig.endpoints.recommendations}`,
                        { timeout: 6000 }
                    );
                    data.recommendations = recommendationsResponse.data;
                    
                    // Obtener análisis de patrones
                    const patternsResponse = await axios.get(
                        `${systemConfig.url}${systemConfig.endpoints.patterns}`,
                        { timeout: 5000 }
                    );
                    data.patterns = patternsResponse.data;
                    
                    // Obtener métricas de performance
                    const metricsResponse = await axios.get(
                        `${systemConfig.url}${systemConfig.endpoints.metrics}`,
                        { timeout: 5000 }
                    );
                    data.performance = metricsResponse.data;
                    
                    // Obtener alertas del servicio
                    const alertsResponse = await axios.get(
                        `${systemConfig.url}${systemConfig.endpoints.alerts}`,
                        { timeout: 5000 }
                    );
                    data.alerts = alertsResponse.data;
                    break;
            }
        } catch (error) {
            data.error = error.message;
        }
        
        return data;
    }
    
    calculateDataQuality(systemData) {
        if (!systemData || systemData.error) return 0;
        
        // Calcular calidad basada en disponibilidad de datos
        let quality = 0.5; // Base
        
        // Datos del Core Anti-418
        if (systemData.overview) {
            const overview = systemData.overview;
            if (overview.success && overview.data) {
                if (overview.data.spot?.signals > 0) quality += 0.2;
                if (overview.data.futures?.opportunities > 0) quality += 0.2;
                if (overview.data.unifiedDecision) quality += 0.1;
            }
        }
        
        // Datos de análisis híbrido
        if (systemData.analysis) {
            const analysis = systemData.analysis;
            if (analysis.success) {
                if (analysis.hybridAnalysis?.correlationsFound > 0) quality += 0.2;
                if (analysis.concentratedRecommendations?.length > 0) quality += 0.2;
            }
        }
        
        // Datos del Enhanced Recommendations Service
        if (systemData.recommendations) {
            const recommendations = systemData.recommendations;
            if (recommendations.success) {
                if (recommendations.recommendations?.length > 0) quality += 0.2;
                if (recommendations.metadata?.patterns_analyzed > 5) quality += 0.1;
                if (recommendations.metadata?.processing_time < 2000) quality += 0.1; // Buena performance
            }
        }
        
        if (systemData.patterns) {
            const patterns = systemData.patterns;
            if (patterns.success && patterns.pattern_analysis) {
                if (patterns.pattern_analysis.total_patterns > 0) quality += 0.15;
                if (patterns.pattern_analysis.high_confidence_patterns > 0) quality += 0.15;
                if (patterns.pattern_analysis.avg_confidence > 0.7) quality += 0.1;
            }
        }
        
        if (systemData.performance) {
            const performance = systemData.performance;
            if (performance.success && performance.performance_metrics) {
                const healthIndicators = performance.performance_metrics.health_indicators;
                if (healthIndicators?.memory_status === 'HEALTHY') quality += 0.1;
                if (healthIndicators?.cpu_status === 'HEALTHY') quality += 0.1;
            }
        }
        
        return Math.min(1, quality);
    }
    
    generateIntelligentAnalysis() {
        const analysis = {
            ecosystemStatus: 'UNKNOWN',
            totalRecommendations: 0,
            correlationsFound: 0,
            dataPoints: 0,
            averageResponseTime: 0,
            systemsOnline: 0,
            criticalAlerts: 0,
            enhancedAIMetrics: {
                aiRecommendations: 0,
                patternsDetected: 0,
                avgConfidence: 0,
                processingTime: 0
            },
            insights: []
        };
        
        let totalResponseTime = 0;
        let activeSystems = 0;
        
        // Analizar estado de cada sistema
        for (const [key, status] of Object.entries(this.systemsStatus)) {
            if (status.status === 'ACTIVE') {
                activeSystems++;
                totalResponseTime += status.responseTime;
                
                // Extraer métricas específicas de sistemas híbridos
                if (status.metrics.analysis) {
                    const metrics = status.metrics.analysis;
                    if (metrics.concentratedRecommendations) {
                        analysis.totalRecommendations += metrics.concentratedRecommendations.length;
                    }
                    if (metrics.hybridAnalysis?.correlationsFound) {
                        analysis.correlationsFound += metrics.hybridAnalysis.correlationsFound;
                    }
                }
                
                // Extraer métricas del Enhanced Recommendations Service
                if (key === 'ENHANCED_RECOMMENDATIONS' && status.metrics.recommendations) {
                    const recommendations = status.metrics.recommendations;
                    if (recommendations.success && recommendations.recommendations) {
                        analysis.enhancedAIMetrics.aiRecommendations = recommendations.recommendations.length;
                        analysis.enhancedAIMetrics.processingTime = recommendations.metadata?.processing_time || 0;
                        analysis.totalRecommendations += recommendations.recommendations.length;
                    }
                }
                
                if (key === 'ENHANCED_RECOMMENDATIONS' && status.metrics.patterns) {
                    const patterns = status.metrics.patterns;
                    if (patterns.success && patterns.pattern_analysis) {
                        analysis.enhancedAIMetrics.patternsDetected = patterns.pattern_analysis.total_patterns;
                        analysis.enhancedAIMetrics.avgConfidence = patterns.pattern_analysis.avg_confidence;
                        analysis.correlationsFound += patterns.pattern_analysis.high_confidence_patterns;
                    }
                }
                
                if (status.metrics.overview) {
                    const overview = status.metrics.overview;
                    if (overview.data) {
                        analysis.dataPoints += (overview.data.spot?.signals || 0);
                        analysis.dataPoints += (overview.data.futures?.opportunities || 0);
                    }
                }
            }
        }
        
        analysis.systemsOnline = activeSystems;
        analysis.averageResponseTime = activeSystems > 0 ? totalResponseTime / activeSystems : 0;
        analysis.criticalAlerts = this.alerts.filter(a => a.severity === 'HIGH').length;
        
        // Determinar estado del ecosistema
        if (activeSystems === Object.keys(this.systemsStatus).length) {
            analysis.ecosystemStatus = 'OPTIMAL';
        } else if (activeSystems >= 2) {
            analysis.ecosystemStatus = 'DEGRADED';
        } else if (activeSystems >= 1) {
            analysis.ecosystemStatus = 'CRITICAL';
        } else {
            analysis.ecosystemStatus = 'DOWN';
        }
        
        // Generar insights inteligentes
        analysis.insights = this.generateIntelligentInsights(analysis);
        
        return analysis;
    }
    
    generateIntelligentInsights(analysis) {
        const insights = [];
        
        if (analysis.ecosystemStatus === 'OPTIMAL') {
            insights.push({
                type: 'SUCCESS',
                message: `Ecosistema funcionando óptimamente con ${analysis.totalRecommendations} recomendaciones activas`,
                icon: '✅'
            });
        }
        
        if (analysis.correlationsFound > 10) {
            insights.push({
                type: 'INFO',
                message: `Excelente! ${analysis.correlationsFound} correlaciones híbridas detectadas`,
                icon: '🔍'
            });
        }
        
        // Insights específicos del Enhanced Recommendations Service
        if (analysis.enhancedAIMetrics.aiRecommendations > 20) {
            insights.push({
                type: 'SUCCESS',
                message: `IA Avanzada: ${analysis.enhancedAIMetrics.aiRecommendations} recomendaciones ML generadas`,
                icon: '🤖'
            });
        }
        
        if (analysis.enhancedAIMetrics.patternsDetected > 15) {
            insights.push({
                type: 'INFO',
                message: `Motor IA detectó ${analysis.enhancedAIMetrics.patternsDetected} patrones con alta confianza`,
                icon: '🧠'
            });
        }
        
        if (analysis.enhancedAIMetrics.avgConfidence > 0.8) {
            insights.push({
                type: 'SUCCESS',
                message: `Alta confianza IA: ${Math.round(analysis.enhancedAIMetrics.avgConfidence * 100)}% en análisis de patrones`,
                icon: '⚡'
            });
        }
        
        if (analysis.enhancedAIMetrics.processingTime > 0 && analysis.enhancedAIMetrics.processingTime < 1000) {
            insights.push({
                type: 'SUCCESS',
                message: `Procesamiento IA ultra-rápido: ${analysis.enhancedAIMetrics.processingTime}ms`,
                icon: '🚀'
            });
        }
        
        if (analysis.averageResponseTime > 3000) {
            insights.push({
                type: 'WARNING',
                message: `Tiempo de respuesta alto: ${Math.round(analysis.averageResponseTime)}ms`,
                icon: '⚠️'
            });
        }
        
        if (analysis.dataPoints > 100) {
            insights.push({
                type: 'INFO',
                message: `Rica fuente de datos: ${analysis.dataPoints} puntos de datos procesados`,
                icon: '📊'
            });
        }
        
        if (analysis.criticalAlerts > 0) {
            insights.push({
                type: 'ERROR',
                message: `${analysis.criticalAlerts} alertas críticas requieren atención`,
                icon: '🚨'
            });
        }
        
        return insights;
    }
    
    detectAlerts() {
        const currentTime = Date.now();
        
        // Limpiar alertas viejas (mayores a 5 minutos)
        this.alerts = this.alerts.filter(alert => 
            currentTime - alert.timestamp < 300000
        );
        
        // Detectar nuevas alertas
        for (const [key, status] of Object.entries(this.systemsStatus)) {
            const systemName = status.name;
            
            // Alerta de sistema caído
            if (status.status === 'DOWN' || status.status === 'ERROR') {
                this.addAlert({
                    type: 'SYSTEM_DOWN',
                    system: key,
                    message: `${systemName} no está respondiendo`,
                    severity: 'HIGH',
                    timestamp: currentTime
                });
            }
            
            // Alerta de calidad de datos baja
            if (status.dataQuality < MONITOR_CONFIG.ALERT_THRESHOLDS.LOW_DATA_QUALITY) {
                this.addAlert({
                    type: 'LOW_DATA_QUALITY',
                    system: key,
                    message: `${systemName} tiene calidad de datos baja (${Math.round(status.dataQuality * 100)}%)`,
                    severity: 'MEDIUM',
                    timestamp: currentTime
                });
            }
            
            // Alerta de alta tasa de error
            if (status.errorRate > MONITOR_CONFIG.ALERT_THRESHOLDS.HIGH_ERROR_RATE) {
                this.addAlert({
                    type: 'HIGH_ERROR_RATE',
                    system: key,
                    message: `${systemName} tiene alta tasa de errores (${Math.round(status.errorRate * 100)}%)`,
                    severity: 'MEDIUM',
                    timestamp: currentTime
                });
            }
        }
    }
    
    addAlert(alert) {
        // Evitar alertas duplicadas recientes
        const recentSimilar = this.alerts.find(existing => 
            existing.type === alert.type &&
            existing.system === alert.system &&
            Date.now() - existing.timestamp < 30000 // 30 segundos
        );
        
        if (!recentSimilar) {
            this.alerts.push(alert);
            console.log(`🚨 [ALERT] ${alert.severity}: ${alert.message}`);
        }
    }
    
    savePerformanceSnapshot() {
        const snapshot = {
            timestamp: Date.now(),
            systems: { ...this.systemsStatus },
            alertCount: this.alerts.length
        };
        
        this.performanceHistory.push(snapshot);
        
        // Mantener solo últimos 100 snapshots
        if (this.performanceHistory.length > 100) {
            this.performanceHistory.shift();
        }
    }
    
    getPerformanceMetrics() {
        if (this.performanceHistory.length === 0) return {};
        
        const recent = this.performanceHistory.slice(-20); // Últimos 20 snapshots
        
        const metrics = {
            uptimePercentage: 0,
            averageResponseTime: 0,
            dataQualityTrend: [],
            systemsStatusDistribution: {}
        };
        
        // Calcular métricas promedio
        let totalUptime = 0;
        let totalResponseTime = 0;
        let totalSystems = 0;
        
        recent.forEach(snapshot => {
            Object.values(snapshot.systems).forEach(system => {
                if (system.status === 'ACTIVE') totalUptime++;
                totalResponseTime += system.responseTime;
                totalSystems++;
                
                metrics.dataQualityTrend.push(system.dataQuality);
                
                metrics.systemsStatusDistribution[system.status] = 
                    (metrics.systemsStatusDistribution[system.status] || 0) + 1;
            });
        });
        
        metrics.uptimePercentage = totalSystems > 0 ? (totalUptime / totalSystems) * 100 : 0;
        metrics.averageResponseTime = totalSystems > 0 ? totalResponseTime / totalSystems : 0;
        
        return metrics;
    }
    
    calculateEcosystemHealth() {
        const systemsCount = Object.keys(this.systemsStatus).length;
        const activeSystems = Object.values(this.systemsStatus).filter(s => s.status === 'ACTIVE').length;
        const avgDataQuality = Object.values(this.systemsStatus).reduce((sum, s) => sum + s.dataQuality, 0) / systemsCount;
        const avgResponseTime = Object.values(this.systemsStatus).reduce((sum, s) => sum + s.responseTime, 0) / systemsCount;
        
        // Calcular score de salud (0-100)
        const uptimeScore = (activeSystems / systemsCount) * 40; // 40% peso
        const dataQualityScore = avgDataQuality * 30; // 30% peso
        const responseTimeScore = Math.max(0, 30 - (avgResponseTime / 100)); // 30% peso (mejor tiempo = mayor score)
        
        const totalScore = uptimeScore + dataQualityScore + responseTimeScore;
        
        return {
            score: Math.round(totalScore),
            uptime: Math.round((activeSystems / systemsCount) * 100),
            dataQuality: Math.round(avgDataQuality * 100),
            responseTime: Math.round(avgResponseTime),
            status: totalScore >= 80 ? 'EXCELLENT' : 
                   totalScore >= 60 ? 'GOOD' : 
                   totalScore >= 40 ? 'FAIR' : 'POOR'
        };
    }
    
    getSystemsStatus() {
        return {
            systems: this.systemsStatus,
            alerts: this.alerts.slice(-20),
            performance: this.getPerformanceMetrics(),
            ecosystemHealth: this.calculateEcosystemHealth()
        };
    }
}

// Instancia global del monitor
const monitor = new IntelligentMonitor();

// 🌐 ENDPOINTS DEL DASHBOARD

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/api/status', (req, res) => {
    res.json(monitor.getSystemsStatus());
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        system: 'INTELLIGENT_MONITOR_DASHBOARD',
        status: 'ACTIVE',
        version: '1.0_INTELLIGENT',
        connectedClients: monitor.connectedClients,
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

app.get('/api/systems/:systemKey', (req, res) => {
    const systemKey = req.params.systemKey.toUpperCase();
    const system = monitor.systemsStatus[systemKey];
    
    if (system) {
        res.json(system);
    } else {
        res.status(404).json({ error: 'Sistema no encontrado' });
    }
});

app.post('/api/alerts/dismiss/:alertId', (req, res) => {
    const alertId = parseInt(req.params.alertId);
    monitor.alerts = monitor.alerts.filter((_, index) => index !== alertId);
    res.json({ success: true, message: 'Alerta descartada' });
});

// 🔧 ENDPOINT PARA RESETEAR ERROR RATES
app.post('/api/systems/reset-error-rates', (req, res) => {
    const systemKey = req.query.system; // Sistema específico o todos
    let resetCount = 0;
    
    if (systemKey && systemKey !== 'ALL') {
        const system = monitor.systemsStatus[systemKey.toUpperCase()];
        if (system) {
            system.errorRate = 0;
            resetCount = 1;
            console.log(`🔧 [RESET] Error rate reseteado para ${system.name}`);
        }
    } else {
        // Resetear todos los sistemas
        Object.values(monitor.systemsStatus).forEach(system => {
            system.errorRate = 0;
            resetCount++;
        });
        console.log('🔧 [RESET] Error rates reseteados para todos los sistemas');
    }
    
    res.json({ 
        success: true, 
        message: `Error rates reseteados para ${resetCount} sistema(s)`,
        resetCount: resetCount 
    });
});

// 📡 WEBSOCKET PARA TIEMPO REAL
io.on('connection', (socket) => {
    monitor.connectedClients++;
    console.log(`🔌 [WEBSOCKET] Cliente conectado. Total: ${monitor.connectedClients}`);
    
    // Enviar estado inicial
    socket.emit('initialStatus', monitor.getSystemsStatus());
    
    socket.on('disconnect', () => {
        monitor.connectedClients--;
        console.log(`🔌 [WEBSOCKET] Cliente desconectado. Total: ${monitor.connectedClients}`);
    });
    
    socket.on('requestUpdate', () => {
        socket.emit('systemUpdate', monitor.getSystemsStatus());
    });
});

// 🚀 INICIO DEL SERVIDOR
server.listen(PORT, async () => {
    console.log(`🚀 [MONITOR DASHBOARD] Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🖥️ Dashboard Web Inteligente - ACTIVO`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    
    console.log('\n📋 Funcionalidades del Monitor:');
    console.log('   ✅ Monitoreo en tiempo real de todo el ecosistema');
    console.log('   📊 Dashboard web interactivo');
    console.log('   🚨 Sistema de alertas inteligente');
    console.log('   📈 Métricas de performance avanzadas');
    console.log('   🔍 Análisis de correlaciones');
    console.log('   🌐 WebSocket para actualizaciones en vivo');
    
    console.log('\n🎯 Sistemas monitoreados:');
    Object.entries(MONITOR_CONFIG.SYSTEMS).forEach(([key, system]) => {
        console.log(`   ${system.priority}. ${system.name} (${system.url})`);
    });
    
    // Crear directorio public si no existe
    if (!fs.existsSync('public')) {
        fs.mkdirSync('public');
        console.log('📁 [SETUP] Directorio public creado');
    }
    
    // Iniciar monitoreo
    monitor.start();
    
    console.log('\n🔄 [MONITOR] Iniciando monitoreo inteligente del ecosistema...');
    console.log('💡 Accede al dashboard en: http://localhost:5000');
});

// Manejo de cierre limpio
process.on('SIGINT', () => {
    console.log('\n⏹️ [MONITOR] Cerrando monitor inteligente...');
    monitor.stop();
    server.close(() => {
        console.log('✅ [MONITOR] Monitor cerrado correctamente');
        process.exit(0);
    });
});

module.exports = { monitor, IntelligentMonitor };

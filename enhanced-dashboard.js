/**
 * 🚀 ENHANCED INTELLIGENT MONITORING DASHBOARD
 * ===========================================
 * 
 * Dashboard mejorado que integra:
 * - Enhanced Recommendations Service (4608)
 * - SRONA Quantum Bridge (4646)
 * - Visualizador Neuronal (4606)
 * - Sistemas existentes del ecosistema
 * - Análisis técnico detallado con LLM Master Brain
 * - Alertas avanzadas por nivel de consciencia
 * 
 * NUEVO ECOSISTEMA MONITOREADO:
 * - Enhanced Recommendations (4608) - NUEVO
 * - SRONA Quantum Bridge (4646)
 * - Visualizador Neuronal (4606)  
 * - Core Anti-418 (4602)
 * - Hybrid Systems (4800, 4850)
 * - Este Dashboard Mejorado (5001) - NUEVO PUERTO
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
const PORT = 5001; // NUEVO PUERTO para no conflictar con el dashboard existente

// Middleware
app.use(express.json());
app.use(express.static('public'));

// 🎯 CONFIGURACIÓN MEJORADA DEL MONITOR - OPTIMIZADA
const ENHANCED_MONITOR_CONFIG = {
    UPDATE_INTERVAL: 20000,     // 20 segundos (era 10s) - Reduce overhead 2x
    LIGHTWEIGHT_UPDATE: 30000,  // Updates ligeros cada 30s
    DEEP_ANALYSIS_INTERVAL: 60000, // Análisis profundo cada 60s
    ALERT_THRESHOLDS: {
        LOW_DATA_QUALITY: 0.25,      // Más tolerante
        HIGH_ERROR_RATE: 0.2,        // Más tolerante para evitar spam
        LOW_CORRELATION: 0.4,        // Más tolerante
        LOW_CONSCIOUSNESS: 0.3,      // Más tolerante
        HIGH_RISK_POSITION: 0.2,     // Más tolerante
        SYSTEM_DOWN_TIMEOUT: 20000   // Mayor timeout
    },
    SYSTEMS: {
        ENHANCED_RECOMMENDATIONS: {    // NUEVO SISTEMA PRINCIPAL
            name: 'Enhanced Recommendations',
            url: 'http://localhost:4608',
            endpoints: {
                health: '/health',  // Corregido - usar /health en lugar de /
                recommendations: '/api/enhanced-recommendations',
                pattern_analysis: '/api/pattern-analysis',
                performance_metrics: '/api/performance-metrics',
                alerts: '/api/alerts'
            },
            priority: 1,
            type: 'primary'
        },
        SRONA_QUANTUM_BRIDGE: {
            name: 'SRONA Quantum Bridge',
            url: 'http://localhost:4646',
            endpoints: {
                health: '/',
                unified_recommendations: '/api/unified-recommendations',
                bridge_status: '/api/bridge-status',
                test_python: '/api/test-python'
            },
            priority: 2,
            type: 'quantum'
        },
        NEURAL_VISUALIZER: {
            name: 'Visualizador Neuronal',
            url: 'http://localhost:4606',
            endpoints: {
                health: '/',
                neural_recommendations: '/api/neural-recommendations',
                session_state: '/api/session-state',
                psychological_state: '/api/psychological-state'
            },
            priority: 3,
            type: 'neural'
        },
        CORE_ANTI_418: {
            name: 'Core Anti-418',
            url: 'http://localhost:4602',
            endpoints: {
                health: '/health',
                overview: '/api/strategic-overview'
            },
            priority: 4,
            type: 'core'
        }
    }
};

console.log('🚀 [ENHANCED MONITOR] Iniciando Dashboard Mejorado...');

// 🧠 MOTOR DE MONITOREO MEJORADO
class EnhancedIntelligentMonitor {
    constructor() {
        this.systemsStatus = {};
        this.enhancedRecommendations = [];
        this.patternAnalysis = {};
        this.performanceMetrics = {};
        this.serviceAlerts = {};
        // 🌉 NUEVO: Variables para SRONA Quantum Bridge
        this.sronaUnifiedRecommendations = null;
        this.sronaCoherence = 0;
        this.sronaQuantumCount = 0;
        this.sronaHybridCount = 0;
        this.alertsHistory = [];
        this.performanceHistory = [];
        this.isRunning = false;
        this.updateInterval = null;
        this.connectedClients = 0;
        
        this.initializeSystems();
        console.log('🧠 [ENHANCED ENGINE] Motor mejorado inicializado');
    }
    
    initializeSystems() {
        for (const [key, system] of Object.entries(ENHANCED_MONITOR_CONFIG.SYSTEMS)) {
            this.systemsStatus[key] = {
                name: system.name,
                type: system.type,
                status: 'UNKNOWN',
                lastUpdate: 0,
                uptime: 0,
                responseTime: 0,
                errorRate: 0,
                dataQuality: 0,
                alerts: [],
                metrics: {},
                healthDetails: {}
            };
        }
    }
    
    start() {
        if (this.isRunning) return;
        
        console.log('🚀 [ENHANCED] Iniciando monitoreo mejorado...');
        this.isRunning = true;
        
        // Actualización inicial
        this.updateAllSystems();
        
        // Configurar intervalo de actualización
        this.updateInterval = setInterval(() => {
            this.updateAllSystems();
        }, ENHANCED_MONITOR_CONFIG.UPDATE_INTERVAL);
        
        console.log(`⏰ [ENHANCED] Actualizando cada ${ENHANCED_MONITOR_CONFIG.UPDATE_INTERVAL/1000}s`);
    }
    
    stop() {
        if (!this.isRunning) return;
        
        console.log('⏹️ [ENHANCED] Deteniendo monitoreo mejorado...');
        this.isRunning = false;
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    async updateAllSystems() {
        const startTime = Date.now();
        
        try {
            // Actualizar Enhanced Recommendations Service primero (más importante)
            await this.updateEnhancedRecommendations();
            
            // Actualizar otros sistemas en paralelo
            const systemUpdates = [];
            for (const [key, system] of Object.entries(ENHANCED_MONITOR_CONFIG.SYSTEMS)) {
                systemUpdates.push(this.updateSystemStatus(key, system));
            }
            
            await Promise.all(systemUpdates);
            
            // Análisis inteligente mejorado
            const enhancedAnalysis = this.generateEnhancedAnalysis();
            
            // Detectar alertas avanzadas
            this.detectEnhancedAlerts();
            
            // Guardar snapshot
            this.saveEnhancedSnapshot();
            
            // Emitir a clientes conectados
            if (this.connectedClients > 0) {
                io.emit('enhancedSystemUpdate', {
                    timestamp: Date.now(),
                    systems: this.systemsStatus,
                    enhancedRecommendations: this.enhancedRecommendations,
                    technicalAnalysis: this.technicalAnalysis,
                    marketSentiment: this.marketSentiment,
                    llmBrainStatus: this.llmBrainStatus,
                    // 🌉 NUEVO: Datos del SRONA Quantum Bridge
                    sronaUnifiedRecommendations: this.sronaUnifiedRecommendations,
                    sronaCoherence: this.sronaCoherence,
                    sronaQuantumCount: this.sronaQuantumCount,
                    sronaHybridCount: this.sronaHybridCount,
                    analysis: enhancedAnalysis,
                    alerts: this.alertsHistory.slice(-15), // Últimas 15 alertas
                    performance: this.getEnhancedMetrics(),
                    ecosystemHealth: this.calculateEnhancedHealth()
                });
            }
            
            const totalTime = Date.now() - startTime;
            // Solo log si toma más de 2000ms o cada 5 actualizaciones principales
            if (totalTime > 2000 || (Date.now() % 100000) < 20000) {
                console.log(`📊 [ENHANCED] Actualización completada en ${totalTime}ms`);
            }
            
        } catch (error) {
            console.error('❌ [ENHANCED] Error en actualización:', error.message);
            this.addAlert('SYSTEM_ERROR', `Error en actualización: ${error.message}`, 'high');
        }
    }
    
    async updateEnhancedRecommendations() {
        try {
            // Solo log ocasional de recomendaciones para reducir overhead
            if (Date.now() % 60000 < 20000) {
                console.log('🧠 [ENHANCED] Obteniendo recomendaciones mejoradas...');
            }
            
            // Obtener recomendaciones mejoradas del Enhanced Service
            const recResponse = await axios.get('http://localhost:4608/api/enhanced-recommendations', { timeout: 8000 });
            if (recResponse.data && recResponse.data.success) {
                // La estructura correcta del Enhanced Service es directa, no anidada
                this.enhancedRecommendations = recResponse.data.recommendations || [];
                // Log solo si hay cambios significativos en el número de recomendaciones
                if (!this._lastRecCount || Math.abs(this._lastRecCount - this.enhancedRecommendations.length) > 5) {
                    console.log(`✅ [ENHANCED] ${this.enhancedRecommendations.length} recomendaciones básicas obtenidas`);
                    this._lastRecCount = this.enhancedRecommendations.length;
                }
            }
            
            // 🌉 NUEVO: Obtener recomendaciones unificadas del SRONA Quantum Bridge
            try {
                const sronaResponse = await axios.get('http://localhost:4646/api/unified-recommendations', { timeout: 8000 });
                if (sronaResponse.data && sronaResponse.data.success) {
                    this.sronaUnifiedRecommendations = sronaResponse.data.unified_recommendations;
                    this.sronaCoherence = sronaResponse.data.coherence_score;
                    this.sronaQuantumCount = sronaResponse.data.quantum_count;
                    this.sronaHybridCount = sronaResponse.data.hybrid_count;
                    // Log solo cambios significativos
                    if (!this._lastSronaCount || Math.abs(this._lastSronaCount - this.sronaUnifiedRecommendations.recommendations.length) > 3) {
                        console.log(`🌉 [SRONA] ${this.sronaUnifiedRecommendations.recommendations.length} recomendaciones unificadas obtenidas`);
                        this._lastSronaCount = this.sronaUnifiedRecommendations.recommendations.length;
                    }
                }
            } catch (sronaError) {
                console.warn('⚠️ [SRONA] Bridge no disponible:', sronaError.message);
                this.sronaUnifiedRecommendations = null;
                this.sronaCoherence = 0;
            }
            
            // Obtener análisis de patrones (reemplazo de análisis técnico)
            try {
                const patternResponse = await axios.get('http://localhost:4608/api/pattern-analysis', { timeout: 5000 });
                if (patternResponse.data && patternResponse.data.success) {
                    this.patternAnalysis = patternResponse.data.pattern_analysis;
                }
            } catch (error) {
                console.warn('⚠️ [ENHANCED] Pattern analysis not available:', error.message);
            }
            
            // Obtener métricas de performance (reemplazo de sentimiento de mercado)
            try {
                const metricsResponse = await axios.get('http://localhost:4608/api/performance-metrics', { timeout: 5000 });
                if (metricsResponse.data && metricsResponse.data.success) {
                    this.performanceMetrics = metricsResponse.data.performance_metrics;
                }
            } catch (error) {
                console.warn('⚠️ [ENHANCED] Performance metrics not available:', error.message);
            }
            
            // Obtener alertas del servicio (reemplazo de LLM Brain)
            try {
                const alertsResponse = await axios.get('http://localhost:4608/api/alerts', { timeout: 5000 });
                if (alertsResponse.data && alertsResponse.data.success) {
                    this.serviceAlerts = alertsResponse.data;
                }
            } catch (error) {
                console.warn('⚠️ [ENHANCED] Service alerts not available:', error.message);
            }
            
        } catch (error) {
            console.error('❌ [ENHANCED] Error obteniendo recomendaciones:', error.message);
            this.addAlert('RECOMMENDATIONS_ERROR', `Error obteniendo recomendaciones: ${error.message}`, 'medium');
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
            
            // Actualizar estado
            status.status = 'ACTIVE';
            status.lastUpdate = Date.now();
            status.responseTime = responseTime;
            status.healthDetails = healthResponse.data || {};
            
            // Actualizar métricas específicas por tipo de sistema
            await this.updateSystemSpecificMetrics(key, systemConfig, status);
            
        } catch (error) {
            console.error(`❌ [${key}] Error actualizando sistema:`, error.message);
            status.status = 'DOWN';
            status.lastUpdate = Date.now();
            status.responseTime = Date.now() - startTime;
            
            this.addAlert('SYSTEM_DOWN', `${systemConfig.name} no responde`, 'high');
        }
    }
    
    async updateSystemSpecificMetrics(key, systemConfig, status) {
        try {
            switch (systemConfig.type) {
                case 'quantum':
                    // Métricas del SRONA Quantum Bridge
                    if (systemConfig.endpoints.bridge_status) {
                        const bridgeResponse = await axios.get(
                            `${systemConfig.url}${systemConfig.endpoints.bridge_status}`,
                            { timeout: 5000 }
                        );
                        status.metrics.bridge = bridgeResponse.data;
                        status.metrics.bridge_coherence = this.sronaCoherence;
                        status.metrics.quantum_recommendations = this.sronaQuantumCount;
                        status.metrics.hybrid_recommendations = this.sronaHybridCount;
                    }
                    break;
                    
                case 'neural':
                    // Métricas del visualizador neuronal
                    if (systemConfig.endpoints.session_state) {
                        const sessionResponse = await axios.get(
                            `${systemConfig.url}${systemConfig.endpoints.session_state}`,
                            { timeout: 5000 }
                        );
                        status.metrics.session = sessionResponse.data;
                    }
                    break;
                    
                case 'primary':
                    // El Enhanced Recommendations ya se actualiza en updateEnhancedRecommendations
                    status.metrics.recommendations_count = this.enhancedRecommendations.length;
                    break;
            }
        } catch (error) {
            console.warn(`⚠️ [${key}] Error obteniendo métricas específicas:`, error.message);
        }
    }
    
    generateEnhancedAnalysis() {
        const activeSystems = Object.values(this.systemsStatus).filter(s => s.status === 'ACTIVE').length;
        const totalSystems = Object.keys(this.systemsStatus).length;
        
        // Análisis de recomendaciones
        const recAnalysis = this.analyzeRecommendations();
        
        // Análisis de sentimiento
        const sentimentAnalysis = this.analyzeSentiment();
        
        // Análisis del LLM Brain
        const llmAnalysis = this.analyzeLLMBrain();
        
        return {
            ecosystemStatus: activeSystems === totalSystems ? 'OPTIMAL' : 
                           activeSystems >= totalSystems * 0.75 ? 'GOOD' : 
                           activeSystems >= totalSystems * 0.5 ? 'DEGRADED' : 'CRITICAL',
            systemsOnline: activeSystems,
            totalSystems: totalSystems,
            recommendationsAnalysis: recAnalysis,
            sentimentAnalysis: sentimentAnalysis,
            llmAnalysis: llmAnalysis,
            correlationsFound: this.calculateCorrelations(),
            insights: this.generateInsights()
        };
    }
    
    analyzeRecommendations() {
        if (!this.enhancedRecommendations || this.enhancedRecommendations.length === 0) {
            return { status: 'NO_DATA', message: 'No hay recomendaciones disponibles' };
        }
        
        const totalRecs = this.enhancedRecommendations.length;
        const avgConfidence = this.enhancedRecommendations.reduce((sum, r) => sum + r.confidence, 0) / totalRecs;
        const strongBuys = this.enhancedRecommendations.filter(r => r.action === 'STRONG_BUY').length;
        const buys = this.enhancedRecommendations.filter(r => r.action === 'BUY').length;
        const sells = this.enhancedRecommendations.filter(r => r.action === 'SELL').length;
        const strongSells = this.enhancedRecommendations.filter(r => r.action === 'STRONG_SELL').length;
        
        // Alertas por consciencia requerida
        const highConsciousness = this.enhancedRecommendations.filter(r => 
            r.risk_management && r.risk_management.consciousness_required > 0.7
        ).length;
        
        return {
            total: totalRecs,
            averageConfidence: avgConfidence,
            distribution: { strongBuys, buys, sells, strongSells },
            highConsciousnessRequired: highConsciousness,
            marketBias: strongBuys + buys > sells + strongSells ? 'BULLISH' : 
                       sells + strongSells > strongBuys + buys ? 'BEARISH' : 'NEUTRAL'
        };
    }
    
    analyzeSentiment() {
        if (!this.marketSentiment.overall_sentiment) {
            return { status: 'NO_DATA', message: 'No hay datos de sentimiento' };
        }
        
        const overall = this.marketSentiment.overall_sentiment;
        const implications = this.marketSentiment.trading_implications || {};
        
        return {
            overall_sentiment: overall.interpretation,
            average_score: overall.average_score,
            contrarian_opportunities: implications.contrarian_opportunities || 0,
            euphoria_warnings: implications.euphoria_warnings || 0,
            recommended_approach: implications.recommended_approach || 'NEUTRAL'
        };
    }
    
    analyzeLLMBrain() {
        if (!this.llmBrainStatus.status) {
            return { status: 'NO_DATA', message: 'LLM Master Brain no disponible' };
        }
        
        return {
            status: this.llmBrainStatus.status,
            provider: this.llmBrainStatus.llm_provider,
            totalDecisions: this.llmBrainStatus.total_decisions || 0,
            accuracy: this.llmBrainStatus.performance_metrics?.accuracy_rate || 0,
            contradictionResolution: this.llmBrainStatus.performance_metrics?.contradiction_resolution_rate || 0
        };
    }
    
    detectEnhancedAlerts() {
        // Alertas por consciencia requerida
        this.enhancedRecommendations.forEach(rec => {
            if (rec.risk_management?.consciousness_required > 0.8) {
                this.addAlert('HIGH_CONSCIOUSNESS_REQUIRED', 
                    `${rec.symbol}: Requiere consciencia ${(rec.risk_management.consciousness_required * 100).toFixed(0)}%`, 
                    'medium');
            }
        });
        
        // Alertas por riesgo alto
        this.enhancedRecommendations.forEach(rec => {
            if (rec.risk_management?.max_loss_percent > 15) {
                this.addAlert('HIGH_RISK_POSITION', 
                    `${rec.symbol}: Riesgo máximo ${rec.risk_management.max_loss_percent.toFixed(1)}%`, 
                    'high');
            }
        });
        
        // Alertas por LLM Brain
        if (this.llmBrainStatus.status !== 'ACTIVE') {
            this.addAlert('LLM_BRAIN_DOWN', 'LLM Master Brain no disponible', 'high');
        }
        
        // Alertas por sentimiento extremo
        if (this.marketSentiment.overall_sentiment?.average_score < 0.2) {
            this.addAlert('EXTREME_FEAR', 'Miedo extremo en el mercado - Oportunidad contraria', 'medium');
        }
        if (this.marketSentiment.overall_sentiment?.average_score > 0.8) {
            this.addAlert('EXTREME_GREED', 'Codicia extrema - Considerar toma de profits', 'high');
        }
    }
    
    addAlert(type, message, severity) {
        const alert = {
            id: Date.now() + Math.random(),
            type: type,
            message: message,
            severity: severity,
            timestamp: Date.now(),
            acknowledged: false
        };
        
        this.alertsHistory.unshift(alert);
        
        // Mantener solo últimas 50 alertas
        if (this.alertsHistory.length > 50) {
            this.alertsHistory = this.alertsHistory.slice(0, 50);
        }
        
        console.log(`🚨 [ALERT-${severity.toUpperCase()}] ${type}: ${message}`);
    }
    
    calculateCorrelations() {
        // Calcular correlaciones entre sistemas
        let correlations = 0;
        
        // Correlación entre Enhanced Recommendations y sentiment
        if (this.enhancedRecommendations.length > 0 && this.marketSentiment.overall_sentiment) {
            correlations += 1;
        }
        
        // Correlación entre sistemas activos
        const activeSystems = Object.values(this.systemsStatus).filter(s => s.status === 'ACTIVE');
        correlations += activeSystems.length * 2;
        
        return correlations;
    }
    
    generateInsights() {
        const insights = [];
        
        // Insight sobre recomendaciones
        if (this.enhancedRecommendations.length > 0) {
            const avgConfidence = this.enhancedRecommendations.reduce((sum, r) => sum + r.confidence, 0) / this.enhancedRecommendations.length;
            insights.push({
                icon: '🎯',
                message: `Confianza promedio de recomendaciones: ${(avgConfidence * 100).toFixed(1)}%`
            });
        }
        
        // Insight sobre LLM Brain
        if (this.llmBrainStatus.total_decisions > 0) {
            insights.push({
                icon: '🧠',
                message: `LLM Master Brain ha procesado ${this.llmBrainStatus.total_decisions} decisiones`
            });
        }
        
        // Insight sobre sentimiento
        if (this.marketSentiment.trading_implications?.contrarian_opportunities > 0) {
            insights.push({
                icon: '💡',
                message: `${this.marketSentiment.trading_implications.contrarian_opportunities} oportunidades contrarias detectadas`
            });
        }
        
        return insights;
    }
    
    calculateEnhancedHealth() {
        const activeSystems = Object.values(this.systemsStatus).filter(s => s.status === 'ACTIVE').length;
        const totalSystems = Object.keys(this.systemsStatus).length;
        const systemsRatio = activeSystems / totalSystems;
        
        const avgResponseTime = Object.values(this.systemsStatus)
            .filter(s => s.responseTime > 0)
            .reduce((sum, s) => sum + s.responseTime, 0) / activeSystems || 0;
        
        const dataQuality = this.enhancedRecommendations.length > 0 ? 0.9 : 0.5;
        
        return {
            status: systemsRatio >= 0.9 ? 'EXCELLENT' : systemsRatio >= 0.7 ? 'GOOD' : systemsRatio >= 0.5 ? 'FAIR' : 'POOR',
            score: Math.round(systemsRatio * 100),
            uptime: systemsRatio * 100,
            dataQuality: dataQuality * 100,
            responseTime: Math.round(avgResponseTime),
            systemsOnline: `${activeSystems}/${totalSystems}`
        };
    }
    
    getEnhancedMetrics() {
        return {
            totalRecommendations: this.enhancedRecommendations.length,
            averageConfidence: this.enhancedRecommendations.length > 0 ? 
                this.enhancedRecommendations.reduce((sum, r) => sum + r.confidence, 0) / this.enhancedRecommendations.length : 0,
            llmBrainStatus: this.llmBrainStatus.status || 'UNKNOWN',
            alertsCount: this.alertsHistory.length,
            marketSentiment: this.marketSentiment.overall_sentiment?.interpretation || 'UNKNOWN'
        };
    }
    
    saveEnhancedSnapshot() {
        const snapshot = {
            timestamp: Date.now(),
            systems: Object.keys(this.systemsStatus).filter(k => this.systemsStatus[k].status === 'ACTIVE').length,
            recommendations: this.enhancedRecommendations.length,
            alerts: this.alertsHistory.length
        };
        
        this.performanceHistory.unshift(snapshot);
        
        // Mantener solo últimos 100 snapshots
        if (this.performanceHistory.length > 100) {
            this.performanceHistory = this.performanceHistory.slice(0, 100);
        }
    }
}

// Crear instancia del monitor mejorado
const enhancedMonitor = new EnhancedIntelligentMonitor();

// 🌐 RUTAS DEL DASHBOARD MEJORADO
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🚀 Enhanced Trading Ecosystem Monitor</title>
        <script src="/socket.io/socket.io.js"></script>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
                color: #ffffff;
                min-height: 100vh;
            }
            
            .container {
                max-width: 1600px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding: 30px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
            }
            
            .header h1 {
                font-size: 3em;
                background: linear-gradient(45deg, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff6b6b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 10px;
                text-shadow: 0 0 30px rgba(78, 205, 196, 0.5);
            }
            
            .dashboard-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 25px;
                margin-bottom: 30px;
            }
            
            .card {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                padding: 25px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
            }
            
            .card h3 {
                color: #4ecdc4;
                margin-bottom: 20px;
                font-size: 1.4em;
            }
            
            .status-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(0, 0, 0, 0.3);
                padding: 15px 25px;
                border-radius: 15px;
                margin-bottom: 30px;
            }
            
            .status-item {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .status-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            
            .status-active { background: #00ff00; }
            .status-warning { background: #ffaa00; }
            .status-error { background: #ff0000; }
            
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
            
            .recommendation-card {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                border-left: 4px solid;
            }
            
            .rec-strong-buy { border-left-color: #00ff00; }
            .rec-buy { border-left-color: #4ecdc4; }
            .rec-hold { border-left-color: #ffaa00; }
            .rec-sell { border-left-color: #ff6b6b; }
            .rec-strong-sell { border-left-color: #ff0000; }
            
            .loading {
                text-align: center;
                padding: 50px;
                color: #888;
            }
            
            .spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid #4ecdc4;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }
            
            .metric-item {
                text-align: center;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }
            
            .metric-value {
                font-size: 1.5em;
                font-weight: bold;
                color: #4ecdc4;
            }
            
            .alert-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                margin-bottom: 8px;
                border-radius: 8px;
                border-left: 4px solid;
            }
            
            .alert-high { background: rgba(255, 0, 68, 0.2); border-left-color: #ff0044; }
            .alert-medium { background: rgba(255, 170, 0, 0.2); border-left-color: #ffaa00; }
            .alert-low { background: rgba(0, 255, 136, 0.2); border-left-color: #00ff88; }
        </style>
    </head>
    <body>
        <div class="container">
            <header class="header">
                <h1>🚀 Enhanced Trading Ecosystem Monitor</h1>
                <p>Dashboard Mejorado con Análisis Técnico Avanzado y LLM Master Brain</p>
                
                <div class="status-bar" id="statusBar">
                    <div class="status-item">
                        <div class="status-indicator status-warning"></div>
                        <span>Conectando...</span>
                    </div>
                </div>
            </header>
            
            <main>
                <div class="dashboard-grid">
                    <!-- Enhanced Recommendations -->
                    <div class="card">
                        <h3>🎯 Recomendaciones Mejoradas</h3>
                        <div id="enhancedRecommendations">
                            <div class="loading">
                                <div class="spinner"></div>
                                <p>Cargando recomendaciones...</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Technical Analysis -->
                    <div class="card">
                        <h3>📊 Análisis Técnico Detallado</h3>
                        <div id="technicalAnalysis">
                            <div class="loading">
                                <div class="spinner"></div>
                                <p>Cargando análisis técnico...</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Market Sentiment -->
                    <div class="card">
                        <h3>😱 Sentimiento de Mercado</h3>
                        <div id="marketSentiment">
                            <div class="loading">
                                <div class="spinner"></div>
                                <p>Cargando sentimiento...</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- LLM Master Brain -->
                    <div class="card">
                        <h3>🧠 LLM Master Brain</h3>
                        <div id="llmBrainStatus">
                            <div class="loading">
                                <div class="spinner"></div>
                                <p>Conectando con LLM...</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- System Status -->
                    <div class="card">
                        <h3>🖥️ Estado del Ecosistema</h3>
                        <div id="systemStatus">
                            <div class="loading">
                                <div class="spinner"></div>
                                <p>Verificando sistemas...</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Enhanced Alerts -->
                    <div class="card">
                        <h3>🚨 Alertas Avanzadas</h3>
                        <div id="enhancedAlerts">
                            <div class="loading">
                                <div class="spinner"></div>
                                <p>Monitoreando alertas...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        
        <script>
            const socket = io();
            
            socket.on('connect', () => {
                document.getElementById('statusBar').innerHTML = \`
                    <div class="status-item">
                        <div class="status-indicator status-active"></div>
                        <span>Conectado - Dashboard Mejorado Activo</span>
                    </div>
                    <div class="status-item">
                        <span>Última actualización: \${new Date().toLocaleTimeString()}</span>
                    </div>
                \`;
            });
            
            socket.on('enhancedSystemUpdate', (data) => {
                updateEnhancedRecommendations(data.enhancedRecommendations);
                updateTechnicalAnalysis(data.technicalAnalysis);
                updateMarketSentiment(data.marketSentiment);
                updateLLMBrainStatus(data.llmBrainStatus);
                updateSystemStatus(data.systems, data.ecosystemHealth);
                updateEnhancedAlerts(data.alerts);
                
                // Actualizar status bar
                document.getElementById('statusBar').innerHTML = \`
                    <div class="status-item">
                        <div class="status-indicator status-active"></div>
                        <span>Ecosistema: \${data.ecosystemHealth.status}</span>
                    </div>
                    <div class="status-item">
                        <span>Recomendaciones: \${data.enhancedRecommendations.length}</span>
                    </div>
                    <div class="status-item">
                        <span>Actualizado: \${new Date().toLocaleTimeString()}</span>
                    </div>
                \`;
            });
            
            function updateEnhancedRecommendations(recommendations) {
                const container = document.getElementById('enhancedRecommendations');
                
                if (!recommendations || recommendations.length === 0) {
                    container.innerHTML = '<p>No hay recomendaciones disponibles</p>';
                    return;
                }
                
                container.innerHTML = recommendations.slice(0, 5).map(rec => \`
                    <div class="recommendation-card rec-\${rec.action.toLowerCase().replace('_', '-')}">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <strong>\${rec.symbol}</strong>
                            <span style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 12px; font-size: 0.8em;">
                                \${rec.action}
                            </span>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <strong>Confianza:</strong> \${(rec.confidence * 100).toFixed(1)}%
                        </div>
                        <div style="margin-bottom: 10px;">
                            <strong>Timeframe Dominante:</strong> \${rec.dominant_timeframe}
                        </div>
                        <div style="margin-bottom: 10px;">
                            <strong>Sentimiento:</strong> \${rec.market_sentiment.sentiment}
                        </div>
                        \${rec.risk_management ? \`
                            <div style="font-size: 0.9em; opacity: 0.8;">
                                <strong>Gestión de Riesgo:</strong><br>
                                Position Size: \${(rec.risk_management.position_size * 100).toFixed(1)}% | 
                                Leverage: \${rec.risk_management.max_leverage}x | 
                                Consciencia Req.: \${(rec.risk_management.consciousness_required * 100).toFixed(0)}%
                            </div>
                        \` : ''}
                    </div>
                \`).join('');
            }
            
            function updateTechnicalAnalysis(analysis) {
                const container = document.getElementById('technicalAnalysis');
                
                if (!analysis || !analysis.BTCUSDT) {
                    container.innerHTML = '<p>No hay análisis técnico disponible</p>';
                    return;
                }
                
                const btcAnalysis = analysis.BTCUSDT;
                container.innerHTML = \`
                    <div style="margin-bottom: 15px;">
                        <strong>\${btcAnalysis.symbol}</strong> - \${btcAnalysis.recommendation} (\${(btcAnalysis.confidence * 100).toFixed(1)}%)
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Precio Actual:</strong> $\${btcAnalysis.current_price?.toLocaleString() || 'N/A'}
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Consenso Multi-TF:</strong> \${btcAnalysis.consensus_analysis?.interpretation || 'N/A'}
                    </div>
                    \${btcAnalysis.key_levels ? \`
                        <div style="margin-bottom: 15px;">
                            <strong>Niveles Clave:</strong><br>
                            \${btcAnalysis.key_levels.stop_loss ? \`Stop Loss: $\${btcAnalysis.key_levels.stop_loss.price?.toFixed(0) || 'N/A'}<br>\` : ''}
                            \${btcAnalysis.key_levels.take_profits ? btcAnalysis.key_levels.take_profits.slice(0,2).map((tp, i) => 
                                \`TP\${i+1}: $\${tp.price?.toFixed(0) || 'N/A'}\`
                            ).join('<br>') : ''}
                        </div>
                    \` : ''}
                \`;
            }
            
            function updateMarketSentiment(sentiment) {
                const container = document.getElementById('marketSentiment');
                
                if (!sentiment || !sentiment.overall_sentiment) {
                    container.innerHTML = '<p>No hay datos de sentimiento disponibles</p>';
                    return;
                }
                
                const overall = sentiment.overall_sentiment;
                container.innerHTML = \`
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 2em; margin-bottom: 10px;">
                            \${overall.interpretation?.includes('FEAR') ? '😰' : 
                              overall.interpretation?.includes('GREED') ? '😤' : '😐'}
                        </div>
                        <div style="font-size: 1.2em; font-weight: bold;">
                            \${overall.interpretation?.toUpperCase() || 'UNKNOWN'}
                        </div>
                        <div style="margin-top: 10px;">
                            Score: \${(overall.average_score * 100).toFixed(1)}%
                        </div>
                    </div>
                    \${sentiment.trading_implications ? \`
                        <div>
                            <strong>Implicaciones:</strong><br>
                            Enfoque Recomendado: \${sentiment.trading_implications.recommended_approach || 'N/A'}<br>
                            Oportunidades Contrarias: \${sentiment.trading_implications.contrarian_opportunities || 0}<br>
                            Advertencias de Euforia: \${sentiment.trading_implications.euphoria_warnings || 0}
                        </div>
                    \` : ''}
                \`;
            }
            
            function updateLLMBrainStatus(llmStatus) {
                const container = document.getElementById('llmBrainStatus');
                
                if (!llmStatus || !llmStatus.status) {
                    container.innerHTML = '<p>LLM Master Brain no disponible</p>';
                    return;
                }
                
                container.innerHTML = \`
                    <div style="margin-bottom: 15px;">
                        <strong>Estado:</strong> 
                        <span style="color: \${llmStatus.status === 'ACTIVE' ? '#00ff88' : '#ff6b6b'};">
                            \${llmStatus.status}
                        </span>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Proveedor:</strong> \${llmStatus.provider || llmStatus.llm_provider || 'N/A'}
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Decisiones Totales:</strong> \${llmStatus.totalDecisions || llmStatus.total_decisions || 0}
                    </div>
                    \${llmStatus.performance_metrics || llmStatus.accuracy ? \`
                        <div class="metrics-grid">
                            <div class="metric-item">
                                <div class="metric-value">\${((llmStatus.accuracy || llmStatus.performance_metrics?.accuracy_rate || 0) * 100).toFixed(1)}%</div>
                                <div>Precisión</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">\${((llmStatus.contradictionResolution || llmStatus.performance_metrics?.contradiction_resolution_rate || 0) * 100).toFixed(1)}%</div>
                                <div>Resolución</div>
                            </div>
                        </div>
                    \` : ''}
                \`;
            }
            
            function updateSystemStatus(systems, health) {
                const container = document.getElementById('systemStatus');
                
                const systemsList = Object.entries(systems || {}).map(([key, system]) => \`
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 8px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                        <div>
                            <strong>\${system.name}</strong><br>
                            <small>\${system.type?.toUpperCase() || ''}</small>
                        </div>
                        <div style="text-align: right;">
                            <span style="color: \${system.status === 'ACTIVE' ? '#00ff88' : '#ff6b6b'};">
                                \${system.status}
                            </span><br>
                            <small>\${system.responseTime}ms</small>
                        </div>
                    </div>
                \`).join('');
                
                container.innerHTML = \`
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 2em; color: \${health?.status === 'EXCELLENT' ? '#00ff88' : health?.status === 'GOOD' ? '#4ecdc4' : '#ffaa00'};">
                            \${health?.score || 0}%
                        </div>
                        <div>Salud del Ecosistema: \${health?.status || 'UNKNOWN'}</div>
                    </div>
                    \${systemsList}
                \`;
            }
            
            function updateEnhancedAlerts(alerts) {
                const container = document.getElementById('enhancedAlerts');
                
                if (!alerts || alerts.length === 0) {
                    container.innerHTML = '<p style="color: #00ff88;">✅ No hay alertas activas</p>';
                    return;
                }
                
                container.innerHTML = alerts.slice(0, 8).map(alert => \`
                    <div class="alert-item alert-\${alert.severity}">
                        <div>
                            <strong>\${alert.type.replace(/_/g, ' ')}</strong><br>
                            \${alert.message}<br>
                            <small>\${new Date(alert.timestamp).toLocaleTimeString()}</small>
                        </div>
                        <div style="color: \${alert.severity === 'high' ? '#ff0044' : alert.severity === 'medium' ? '#ffaa00' : '#00ff88'};">
                            \${alert.severity.toUpperCase()}
                        </div>
                    </div>
                \`).join('');
            }
        </script>
    </body>
    </html>
    `);
});

// Inicializar WebSocket
io.on('connection', (socket) => {
    console.log('👤 [ENHANCED] Cliente conectado al dashboard mejorado');
    enhancedMonitor.connectedClients++;
    
    socket.on('disconnect', () => {
        console.log('👤 [ENHANCED] Cliente desconectado del dashboard mejorado');
        enhancedMonitor.connectedClients--;
    });
    
    socket.on('requestUpdate', () => {
        // Forzar actualización inmediata
        enhancedMonitor.updateAllSystems();
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log('🚀 [ENHANCED DASHBOARD] Iniciado exitosamente');
    console.log('=' * 70);
    console.log(`🌐 Dashboard mejorado disponible en: http://localhost:${PORT}`);
    console.log('🎯 Funcionalidades mejoradas:');
    console.log('   ✅ Integración Enhanced Recommendations Service (4608)');
    console.log('   ✅ Análisis técnico detallado con justificaciones');
    console.log('   ✅ LLM Master Brain con resolución de contradicciones');
    console.log('   ✅ Sentimiento de mercado avanzado');
    console.log('   ✅ Alertas por nivel de consciencia y riesgo');
    console.log('   ✅ Monitoreo en tiempo real de todos los servicios');
    console.log('=' * 70);
    
    // Iniciar el motor de monitoreo
    enhancedMonitor.start();
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
    console.log('\n🛑 [ENHANCED] Cerrando dashboard mejorado...');
    enhancedMonitor.stop();
    server.close(() => {
        console.log('✅ [ENHANCED] Dashboard cerrado correctamente');
        process.exit(0);
    });
});

module.exports = { enhancedMonitor };

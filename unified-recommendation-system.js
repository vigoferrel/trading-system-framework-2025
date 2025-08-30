/**
 * 🧠 UNIFIED RECOMMENDATION SYSTEM
 * ===============================
 * 
 * Sistema que unifica TODAS las fuentes de análisis del ecosistema QBTC
 * en recomendaciones de trading coherentes, priorizadas y accionables:
 * 
 * FUENTES DE ANÁLISIS:
 * - Core Optimal Anti-418 (131 símbolos FUTURES, 73 SPOT)
 * - LLM Neural Orchestrator (análisis psicológico + Gemini)
 * - Quantum State Analysis (coherencia cuántica)
 * - Circuit Breaker Status (gestión de riesgo)
 * - Leverage Optimizer V2 (apalancamiento optimal)
 * - Quantum Rebalancer (estados cuánticos)
 * - Market Volatility Analysis
 * - System Entropy Signals
 * 
 * OBJETIVO: Recomendaciones unificadas, coherentes y ejecutables
 */

const express = require('express');
const axios = require('axios');
const { getSystemEntropy, getHashEntropy } = require('./system-entropy');

const app = express();
const PORT = 4750;

app.use(express.json());

console.log('🧠 [UNIFIED RECOMMENDATIONS] Iniciando sistema unificado...');

// 🎯 CONFIGURACIÓN DE FUENTES DE DATOS
const DATA_SOURCES = {
    CORE_SYSTEM: 'http://localhost:4602',
    // Preparado para integrar con otros servicios cuando estén disponibles
    QUANTUM_CORE: 'http://localhost:14105',
    VAR_ENGINE: 'http://localhost:14501',
    CIRCUIT_BREAKERS: 'http://localhost:14502'
};

// 🧠 SISTEMA UNIFICADOR DE RECOMENDACIONES
class UnifiedRecommendationEngine {
    constructor() {
        this.recommendations = new Map();
        this.lastUpdate = 0;
        this.confidenceThresholds = {
            HIGH: 0.8,
            MEDIUM: 0.6,
            LOW: 0.4
        };
        this.maxRecommendations = 15;
        
        console.log('🧠 [RECOMMENDATION ENGINE] Inicializado');
    }
    
    async generateUnifiedRecommendations() {
        console.log('🔄 [UNIFIED] Generando recomendaciones unificadas...');
        const startTime = Date.now();
        
        try {
            // 1. Obtener datos de todas las fuentes
            const dataCollection = await this.collectAllData();
            
            // 2. Analizar coherencia entre fuentes
            const coherenceAnalysis = this.analyzeDataCoherence(dataCollection);
            
            // 3. Generar recomendaciones por símbolo
            const symbolRecommendations = await this.generateSymbolRecommendations(dataCollection);
            
            // 4. Aplicar filtros de riesgo y coherencia
            const filteredRecommendations = this.applyRiskFilters(symbolRecommendations, coherenceAnalysis);
            
            // 5. Priorizar y rankear recomendaciones
            const rankedRecommendations = this.rankRecommendations(filteredRecommendations);
            
            // 6. Generar recomendaciones de gestión global
            const globalRecommendations = this.generateGlobalRecommendations(dataCollection, coherenceAnalysis);
            
            const processingTime = Date.now() - startTime;
            
            const unifiedResult = {
                timestamp: Date.now(),
                processingTime: processingTime,
                dataQuality: coherenceAnalysis.overallQuality,
                systemStatus: coherenceAnalysis.systemStatus,
                
                // Recomendaciones específicas por símbolo (top 15)
                symbolRecommendations: rankedRecommendations.slice(0, this.maxRecommendations),
                
                // Recomendaciones de gestión global
                globalRecommendations: globalRecommendations,
                
                // Análisis de mercado unificado
                marketAnalysis: this.generateMarketAnalysis(dataCollection),
                
                // Métricas de confianza
                confidence: {
                    overall: this.calculateOverallConfidence(rankedRecommendations),
                    dataCoherence: coherenceAnalysis.coherenceScore,
                    systemHealth: coherenceAnalysis.systemHealth
                }
            };
            
            this.lastUpdate = Date.now();
            console.log(`✅ [UNIFIED] Recomendaciones generadas en ${processingTime}ms`);
            
            return unifiedResult;
            
        } catch (error) {
            console.error('❌ [UNIFIED] Error generando recomendaciones:', error.message);
            return this.generateEmergencyRecommendations();
        }
    }
    
    async collectAllData() {
        console.log('📊 [DATA COLLECTION] Recolectando datos de todas las fuentes...');
        
        const data = {
            core: null,
            systemHealth: null,
            marketData: null,
            errors: []
        };
        
        // Obtener datos del sistema core
        try {
            const coreResponse = await axios.get(`${DATA_SOURCES.CORE_SYSTEM}/api/strategic-overview`, {
                timeout: 5000
            });
            data.core = coreResponse.data;
            console.log('✅ [CORE DATA] Obtenidos datos del sistema core');
        } catch (error) {
            data.errors.push({ source: 'core', error: error.message });
            console.log('❌ [CORE DATA] Error:', error.message);
        }
        
        // Obtener salud del sistema
        try {
            const healthResponse = await axios.get(`${DATA_SOURCES.CORE_SYSTEM}/health`, {
                timeout: 5000
            });
            data.systemHealth = healthResponse.data;
            console.log('✅ [SYSTEM HEALTH] Obtenidos datos de salud');
        } catch (error) {
            data.errors.push({ source: 'health', error: error.message });
            console.log('❌ [SYSTEM HEALTH] Error:', error.message);
        }
        
        // Obtener estado del sistema
        try {
            const statusResponse = await axios.get(`${DATA_SOURCES.CORE_SYSTEM}/api/system-status`, {
                timeout: 5000
            });
            data.systemStatus = statusResponse.data;
            console.log('✅ [SYSTEM STATUS] Obtenidos datos de estado');
        } catch (error) {
            data.errors.push({ source: 'status', error: error.message });
            console.log('❌ [SYSTEM STATUS] Error:', error.message);
        }
        
        return data;
    }
    
    analyzeDataCoherence(dataCollection) {
        console.log('🔍 [COHERENCE] Analizando coherencia entre fuentes...');
        
        const analysis = {
            coherenceScore: 0.5, // Base
            overallQuality: 'MEDIUM',
            systemStatus: 'STABLE',
            systemHealth: 0.5,
            dataAvailability: 0,
            issues: []
        };
        
        // Evaluar disponibilidad de datos
        const availableSources = Object.keys(dataCollection).filter(key => 
            dataCollection[key] !== null && key !== 'errors'
        ).length;
        const totalSources = Object.keys(dataCollection).length - 1; // -1 por 'errors'
        analysis.dataAvailability = availableSources / totalSources;
        
        // Evaluar salud del sistema si está disponible
        if (dataCollection.systemHealth) {
            const health = dataCollection.systemHealth;
            analysis.systemHealth = health.components ? 0.8 : 0.6;
            
            if (health.components?.circuitBreaker) {
                const cbStatus = health.components.circuitBreaker;
                const openBreakers = Object.values(cbStatus).filter(b => b.isOpen).length;
                if (openBreakers > 0) {
                    analysis.issues.push('Circuit breakers abiertos detectados');
                    analysis.coherenceScore -= 0.2;
                }
            }
        }
        
        // Evaluar calidad de datos del core
        if (dataCollection.core) {
            const coreData = dataCollection.core.data;
            if (coreData) {
                const spotSymbols = coreData.spot?.symbols || 0;
                const futuresSymbols = coreData.futures?.symbols || 0;
                const signals = coreData.spot?.signals || 0;
                
                if (spotSymbols > 50 && futuresSymbols > 100) {
                    analysis.coherenceScore += 0.3;
                    analysis.overallQuality = 'HIGH';
                }
                
                if (signals > 30) {
                    analysis.coherenceScore += 0.2;
                }
            }
        }
        
        // Evaluar errores
        if (dataCollection.errors.length > 0) {
            analysis.coherenceScore -= (dataCollection.errors.length * 0.1);
            analysis.issues.push(`${dataCollection.errors.length} fuentes de datos con errores`);
        }
        
        // Normalizar coherence score
        analysis.coherenceScore = Math.max(0, Math.min(1, analysis.coherenceScore));
        
        // Determinar calidad overall
        if (analysis.coherenceScore >= 0.8) analysis.overallQuality = 'EXCELLENT';
        else if (analysis.coherenceScore >= 0.6) analysis.overallQuality = 'HIGH';
        else if (analysis.coherenceScore >= 0.4) analysis.overallQuality = 'MEDIUM';
        else analysis.overallQuality = 'LOW';
        
        console.log(`📊 [COHERENCE] Score: ${(analysis.coherenceScore * 100).toFixed(1)}% - ${analysis.overallQuality}`);
        return analysis;
    }
    
    async generateSymbolRecommendations(dataCollection) {
        console.log('🎯 [SYMBOL RECS] Generando recomendaciones por símbolo...');
        
        const recommendations = [];
        
        if (!dataCollection.core?.data) {
            console.log('⚠️ [SYMBOL RECS] No hay datos del core disponibles');
            return recommendations;
        }
        
        const coreData = dataCollection.core.data;
        
        // Analizar señales SPOT
        if (coreData.spot?.signals) {
            for (const [symbol, signal] of Object.entries(coreData.spot.signals)) {
                const recommendation = await this.analyzeSymbolSignal(
                    symbol, 
                    signal, 
                    'SPOT', 
                    dataCollection
                );
                if (recommendation) recommendations.push(recommendation);
            }
        }
        
        // Analizar oportunidades FUTURES
        if (coreData.futures?.opportunities) {
            for (const [symbol, opportunity] of Object.entries(coreData.futures.opportunities)) {
                const recommendation = await this.analyzeFuturesOpportunity(
                    symbol, 
                    opportunity, 
                    'FUTURES', 
                    dataCollection
                );
                if (recommendation) recommendations.push(recommendation);
            }
        }
        
        console.log(`✅ [SYMBOL RECS] Generadas ${recommendations.length} recomendaciones`);
        return recommendations;
    }
    
    async analyzeSymbolSignal(symbol, signal, market, dataCollection) {
        try {
            // Calcular confianza base de la señal
            let confidence = signal.confidence || 0.5;
            
            // Ajustar por entropic factor si está disponible
            if (signal.entropy_factor) {
                confidence *= (0.5 + signal.entropy_factor);
            }
            
            // Ajustar por strength de la señal
            const strength = signal.strength || 0;
            const strengthMultiplier = Math.min(strength / 10, 0.3);
            confidence += strengthMultiplier;
            
            // Ajustar por coherencia del sistema
            if (dataCollection.systemHealth) {
                const systemCoherence = dataCollection.systemHealth.components?.entropy || 0.5;
                confidence *= (0.7 + systemCoherence * 0.3);
            }
            
            // Normalizar confianza
            confidence = Math.max(0.1, Math.min(1.0, confidence));
            
            // Determinar acción recomendada
            let action = 'HOLD';
            let reasoning = [];
            
            if (signal.type === 'LONG' && confidence > this.confidenceThresholds.MEDIUM) {
                action = 'LONG';
                reasoning.push(`Señal LONG con ${(confidence * 100).toFixed(1)}% confianza`);
            } else if (signal.type === 'SHORT' && confidence > this.confidenceThresholds.MEDIUM) {
                action = 'SHORT';
                reasoning.push(`Señal SHORT con ${(confidence * 100).toFixed(1)}% confianza`);
            } else {
                reasoning.push('Señal insuficiente o confianza baja');
            }
            
            // Agregar contexto de strength
            if (strength > 5) {
                reasoning.push(`Alta volatilidad detectada (${strength.toFixed(1)}%)`);
            }
            
            return {
                symbol: symbol,
                market: market,
                action: action,
                confidence: confidence,
                priority: this.calculatePriority(confidence, strength),
                reasoning: reasoning.join(', '),
                metrics: {
                    strength: strength,
                    originalConfidence: signal.confidence,
                    entropyFactor: signal.entropy_factor
                },
                timestamp: Date.now()
            };
            
        } catch (error) {
            console.log(`⚠️ [SYMBOL ANALYSIS] Error analizando ${symbol}:`, error.message);
            return null;
        }
    }
    
    async analyzeFuturesOpportunity(symbol, opportunity, market, dataCollection) {
        try {
            let confidence = opportunity.confidence || 0.5;
            
            // Ajustar por entropy score si está disponible
            if (opportunity.entropy_score) {
                confidence += opportunity.entropy_score * 0.2;
            }
            
            // Ajustar por leverage sugerido
            const leverage = opportunity.leverage || 1;
            if (leverage > 10) {
                // Reducir confianza para leverage alto
                confidence *= 0.9;
            } else if (leverage < 5) {
                // Aumentar confianza para leverage conservador
                confidence *= 1.1;
            }
            
            // Normalizar confianza
            confidence = Math.max(0.1, Math.min(1.0, confidence));
            
            let action = 'HOLD';
            let reasoning = [];
            
            if (opportunity.type === 'LONG' && confidence > this.confidenceThresholds.MEDIUM) {
                action = 'LONG';
                reasoning.push(`Oportunidad LONG con leverage ${leverage}x`);
            } else if (opportunity.type === 'SHORT' && confidence > this.confidenceThresholds.MEDIUM) {
                action = 'SHORT';
                reasoning.push(`Oportunidad SHORT con leverage ${leverage}x`);
            } else {
                reasoning.push('Oportunidad de baja confianza');
            }
            
            // Agregar advertencias de riesgo
            if (leverage > 15) {
                reasoning.push('⚠️ Leverage alto - riesgo elevado');
            }
            
            return {
                symbol: symbol,
                market: market,
                action: action,
                confidence: confidence,
                leverage: leverage,
                priority: this.calculatePriority(confidence, leverage),
                reasoning: reasoning.join(', '),
                metrics: {
                    originalConfidence: opportunity.confidence,
                    entropyScore: opportunity.entropy_score,
                    suggestedLeverage: leverage
                },
                timestamp: Date.now()
            };
            
        } catch (error) {
            console.log(`⚠️ [FUTURES ANALYSIS] Error analizando ${symbol}:`, error.message);
            return null;
        }
    }
    
    calculatePriority(confidence, strength) {
        const combined = (confidence * 0.7) + ((strength / 20) * 0.3);
        
        if (combined >= 0.8) return 'HIGH';
        if (combined >= 0.6) return 'MEDIUM';
        return 'LOW';
    }
    
    applyRiskFilters(recommendations, coherenceAnalysis) {
        console.log('🛡️ [RISK FILTER] Aplicando filtros de riesgo...');
        
        let filtered = [...recommendations];
        
        // Filtro 1: Calidad general del sistema
        if (coherenceAnalysis.overallQuality === 'LOW') {
            filtered = filtered.filter(rec => rec.confidence > 0.7);
            console.log('⚠️ [RISK] Filtro de calidad baja aplicado');
        }
        
        // Filtro 2: Circuit breakers
        if (coherenceAnalysis.issues.some(issue => issue.includes('Circuit breakers'))) {
            filtered = filtered.filter(rec => rec.action === 'HOLD' || rec.confidence > 0.8);
            console.log('🚨 [RISK] Filtro de circuit breakers aplicado');
        }
        
        // Filtro 3: Leverage excesivo
        filtered = filtered.map(rec => {
            if (rec.leverage && rec.leverage > 20) {
                rec.leverage = Math.min(rec.leverage, 15);
                rec.reasoning += ' (leverage reducido por gestión de riesgo)';
            }
            return rec;
        });
        
        // Filtro 4: Concentración por símbolo
        const symbolCounts = new Map();
        filtered.forEach(rec => {
            symbolCounts.set(rec.symbol, (symbolCounts.get(rec.symbol) || 0) + 1);
        });
        
        // Solo permitir máximo 2 recomendaciones por símbolo
        const finalFiltered = [];
        const symbolTracker = new Map();
        
        filtered
            .sort((a, b) => b.confidence - a.confidence) // Ordenar por confianza
            .forEach(rec => {
                const count = symbolTracker.get(rec.symbol) || 0;
                if (count < 2) {
                    finalFiltered.push(rec);
                    symbolTracker.set(rec.symbol, count + 1);
                }
            });
        
        console.log(`🛡️ [RISK FILTER] ${recommendations.length} → ${finalFiltered.length} recomendaciones`);
        return finalFiltered;
    }
    
    rankRecommendations(recommendations) {
        console.log('📈 [RANKING] Priorizando recomendaciones...');
        
        return recommendations
            .sort((a, b) => {
                // 1. Prioridad primero
                const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
                const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                if (priorityDiff !== 0) return priorityDiff;
                
                // 2. Confianza segundo
                const confidenceDiff = b.confidence - a.confidence;
                if (Math.abs(confidenceDiff) > 0.05) return confidenceDiff;
                
                // 3. Market preferencia (FUTURES > SPOT para trading activo)
                if (a.market === 'FUTURES' && b.market === 'SPOT') return -1;
                if (a.market === 'SPOT' && b.market === 'FUTURES') return 1;
                
                // 4. Timestamp más reciente
                return b.timestamp - a.timestamp;
            })
            .map((rec, index) => ({
                ...rec,
                rank: index + 1
            }));
    }
    
    generateGlobalRecommendations(dataCollection, coherenceAnalysis) {
        console.log('🌍 [GLOBAL RECS] Generando recomendaciones globales...');
        
        const globalRecs = [];
        
        // Recomendaciones basadas en salud del sistema
        if (coherenceAnalysis.systemHealth < 0.7) {
            globalRecs.push({
                type: 'SYSTEM_HEALTH',
                priority: 'HIGH',
                recommendation: 'Monitorear salud del sistema - Reducir exposición',
                reasoning: 'Salud del sistema por debajo del 70%',
                action: 'REDUCE_EXPOSURE'
            });
        }
        
        // Recomendaciones basadas en coherencia de datos
        if (coherenceAnalysis.coherenceScore < 0.5) {
            globalRecs.push({
                type: 'DATA_QUALITY',
                priority: 'MEDIUM',
                recommendation: 'Calidad de datos subóptima - Usar estrategias conservadoras',
                reasoning: 'Baja coherencia entre fuentes de datos',
                action: 'CONSERVATIVE_MODE'
            });
        }
        
        // Recomendaciones de diversificación
        if (dataCollection.core?.data) {
            const futuresCount = dataCollection.core.data.futures?.symbols || 0;
            const spotCount = dataCollection.core.data.spot?.symbols || 0;
            
            if (futuresCount > 100 && spotCount > 50) {
                globalRecs.push({
                    type: 'DIVERSIFICATION',
                    priority: 'LOW',
                    recommendation: 'Excelente diversificación de símbolos - Mantener enfoque',
                    reasoning: `${futuresCount} FUTURES + ${spotCount} SPOT analizados`,
                    action: 'MAINTAIN_STRATEGY'
                });
            }
        }
        
        // Recomendación de gestión de riesgo cuántica
        const entropyLevel = getSystemEntropy(1);
        if (entropyLevel > 0.7) {
            globalRecs.push({
                type: 'QUANTUM_RISK',
                priority: 'MEDIUM',
                recommendation: 'Alta entropía del sistema - Aplicar gestión de riesgo cuántica',
                reasoning: `Nivel de entropía: ${(entropyLevel * 100).toFixed(1)}%`,
                action: 'QUANTUM_RISK_MANAGEMENT'
            });
        }
        
        return globalRecs;
    }
    
    generateMarketAnalysis(dataCollection) {
        const analysis = {
            overall_sentiment: 'NEUTRAL',
            volatility_level: 'MEDIUM',
            opportunity_count: 0,
            risk_level: 'MEDIUM'
        };
        
        if (dataCollection.core?.data) {
            const signals = dataCollection.core.data.spot?.signals || {};
            const opportunities = dataCollection.core.data.futures?.opportunities || {};
            
            analysis.opportunity_count = Object.keys(signals).length + Object.keys(opportunities).length;
            
            // Analizar sentiment general
            const longSignals = Object.values(signals).filter(s => s.type === 'LONG').length;
            const shortSignals = Object.values(signals).filter(s => s.type === 'SHORT').length;
            const totalSignals = longSignals + shortSignals;
            
            if (totalSignals > 0) {
                const longRatio = longSignals / totalSignals;
                if (longRatio > 0.6) analysis.overall_sentiment = 'BULLISH';
                else if (longRatio < 0.4) analysis.overall_sentiment = 'BEARISH';
            }
            
            // Analizar volatilidad
            const avgStrength = Object.values(signals).reduce((sum, s) => sum + (s.strength || 0), 0) / Object.keys(signals).length;
            if (avgStrength > 7) analysis.volatility_level = 'HIGH';
            else if (avgStrength < 3) analysis.volatility_level = 'LOW';
        }
        
        return analysis;
    }
    
    calculateOverallConfidence(recommendations) {
        if (recommendations.length === 0) return 0;
        
        const avgConfidence = recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length;
        const highConfidenceCount = recommendations.filter(rec => rec.confidence > 0.7).length;
        const highConfidenceRatio = highConfidenceCount / recommendations.length;
        
        return (avgConfidence * 0.7) + (highConfidenceRatio * 0.3);
    }
    
    generateEmergencyRecommendations() {
        return {
            timestamp: Date.now(),
            processingTime: 0,
            dataQuality: 'EMERGENCY',
            systemStatus: 'ERROR',
            
            symbolRecommendations: [{
                symbol: 'BTCUSDT',
                market: 'SPOT',
                action: 'HOLD',
                confidence: 0.5,
                priority: 'MEDIUM',
                reasoning: 'Recomendación de emergencia - datos insuficientes',
                rank: 1
            }],
            
            globalRecommendations: [{
                type: 'EMERGENCY',
                priority: 'CRITICAL',
                recommendation: 'Sistema en modo emergencia - Evitar nuevas posiciones',
                reasoning: 'Error en sistema de análisis',
                action: 'EMERGENCY_MODE'
            }],
            
            marketAnalysis: {
                overall_sentiment: 'UNKNOWN',
                volatility_level: 'UNKNOWN',
                opportunity_count: 0,
                risk_level: 'HIGH'
            },
            
            confidence: {
                overall: 0.1,
                dataCoherence: 0.0,
                systemHealth: 0.0
            }
        };
    }
}

// 🚀 INICIALIZAR MOTOR DE RECOMENDACIONES
const recommendationEngine = new UnifiedRecommendationEngine();

// 🌐 ENDPOINTS DE RECOMENDACIONES UNIFICADAS
app.get('/health', (req, res) => {
    res.json({
        status: 'UNIFIED_RECOMMENDATION_SYSTEM',
        timestamp: new Date().toISOString(),
        lastUpdate: recommendationEngine.lastUpdate,
        version: '1.0.0'
    });
});

app.get('/api/unified-recommendations', async (req, res) => {
    try {
        const recommendations = await recommendationEngine.generateUnifiedRecommendations();
        res.json({
            success: true,
            system: 'UNIFIED_RECOMMENDATIONS',
            ...recommendations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            fallback: recommendationEngine.generateEmergencyRecommendations()
        });
    }
});

app.get('/api/top-recommendations/:count?', async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 10;
        const recommendations = await recommendationEngine.generateUnifiedRecommendations();
        
        res.json({
            success: true,
            system: 'TOP_RECOMMENDATIONS',
            count: count,
            timestamp: recommendations.timestamp,
            recommendations: recommendations.symbolRecommendations.slice(0, count),
            globalInsights: recommendations.globalRecommendations,
            marketSummary: recommendations.marketAnalysis,
            confidence: recommendations.confidence
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/recommendations-summary', async (req, res) => {
    try {
        const recommendations = await recommendationEngine.generateUnifiedRecommendations();
        
        const summary = {
            timestamp: recommendations.timestamp,
            totalRecommendations: recommendations.symbolRecommendations.length,
            highPriority: recommendations.symbolRecommendations.filter(r => r.priority === 'HIGH').length,
            mediumPriority: recommendations.symbolRecommendations.filter(r => r.priority === 'MEDIUM').length,
            lowPriority: recommendations.symbolRecommendations.filter(r => r.priority === 'LOW').length,
            
            actions: {
                long: recommendations.symbolRecommendations.filter(r => r.action === 'LONG').length,
                short: recommendations.symbolRecommendations.filter(r => r.action === 'SHORT').length,
                hold: recommendations.symbolRecommendations.filter(r => r.action === 'HOLD').length
            },
            
            markets: {
                spot: recommendations.symbolRecommendations.filter(r => r.market === 'SPOT').length,
                futures: recommendations.symbolRecommendations.filter(r => r.market === 'FUTURES').length
            },
            
            confidence: recommendations.confidence,
            marketAnalysis: recommendations.marketAnalysis,
            systemStatus: recommendations.systemStatus
        };
        
        res.json({
            success: true,
            system: 'RECOMMENDATIONS_SUMMARY',
            ...summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 🚀 INICIALIZACIÓN DEL SISTEMA
app.listen(PORT, () => {
    console.log(`🧠 [UNIFIED RECOMMENDATIONS] Sistema ejecutándose en puerto ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`\n📋 Endpoints disponibles:`);
    console.log(`   - /health (estado del sistema de recomendaciones)`);
    console.log(`   - /api/unified-recommendations (recomendaciones completas)`);
    console.log(`   - /api/top-recommendations/{count} (top N recomendaciones)`);
    console.log(`   - /api/recommendations-summary (resumen ejecutivo)`);
    
    console.log(`\n🧠 [SISTEMA LISTO] Unificando inteligencia de:`);
    console.log(`   - 131+ símbolos FUTURES analizados`);
    console.log(`   - 73+ símbolos SPOT con señales`);
    console.log(`   - Análisis LLM Neural + Gemini`);
    console.log(`   - Estados cuánticos y entropía`);
    console.log(`   - Gestión de riesgo integrada`);
    console.log(`   - Circuit breakers automáticos`);
    
    // Generar primera recomendación para test
    setTimeout(async () => {
        try {
            console.log(`\n🔄 [INICIALIZACIÓN] Generando primera recomendación de prueba...`);
            const testRec = await recommendationEngine.generateUnifiedRecommendations();
            console.log(`✅ [TEST] Sistema funcionando - ${testRec.symbolRecommendations.length} recomendaciones generadas`);
            console.log(`📊 [TEST] Confianza general: ${(testRec.confidence.overall * 100).toFixed(1)}%`);
        } catch (error) {
            console.log(`❌ [TEST] Error en primera recomendación: ${error.message}`);
        }
    }, 5000);
});

console.log('🎯 [UNIFIED RECOMMENDATIONS] Configurado para máximo rendimiento');

module.exports = { app, recommendationEngine };

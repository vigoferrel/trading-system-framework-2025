/**
 * 🧠 REAL UNIFIED RECOMMENDATIONS SYSTEM
 * =====================================
 * 
 * Sistema que unifica recomendaciones usando DATOS REALES del ecosistema:
 * - Core Optimal Anti-418 (datos reales de Binance)
 * - LLM Neural Orchestrator 
 * - System entropy real
 * - Circuit breakers reales
 * 
 * OBJETIVO: Recomendaciones coherentes basadas en datos reales de mercado
 */

const express = require('express');
const axios = require('axios');
const { getSystemEntropy, getHashEntropy } = require('./system-entropy');

const app = express();
const PORT = 4760;

app.use(express.json());

console.log('🧠 [REAL UNIFIED] Iniciando sistema con datos reales...');

// 🎯 CONFIGURACIÓN DE FUENTES REALES
const REAL_SOURCES = {
    CORE_SYSTEM: 'http://localhost:4602'
};

// 🧠 MOTOR DE RECOMENDACIONES CON DATOS REALES
class RealUnifiedRecommendationEngine {
    constructor() {
        this.lastUpdate = 0;
        this.confidenceThresholds = {
            HIGH: 0.75,
            MEDIUM: 0.55,
            LOW: 0.35
        };
        this.maxRecommendations = 15;
        
        console.log('🧠 [REAL ENGINE] Motor con datos reales inicializado');
    }
    
    async generateRealRecommendations() {
        console.log('🔄 [REAL UNIFIED] Obteniendo datos reales del sistema...');
        const startTime = Date.now();
        
        try {
            // Obtener datos reales del Core Anti-418
            const realData = await this.fetchRealData();
            
            if (!realData.core) {
                throw new Error('No se pudieron obtener datos del sistema core');
            }
            
            // Analizar coherencia de datos reales
            const coherenceAnalysis = this.analyzeRealDataCoherence(realData);
            
            // Generar recomendaciones basadas en datos reales
            const symbolRecommendations = this.generateRealSymbolRecommendations(realData);
            
            // Aplicar filtros de riesgo reales
            const filteredRecommendations = this.applyRealRiskFilters(symbolRecommendations, coherenceAnalysis);
            
            // Rankear por importancia real
            const rankedRecommendations = this.rankByRealMetrics(filteredRecommendations);
            
            // Generar insights globales reales
            const globalRecommendations = this.generateRealGlobalInsights(realData, coherenceAnalysis);
            
            const processingTime = Date.now() - startTime;
            
            const result = {
                timestamp: Date.now(),
                processingTime: processingTime,
                dataSource: 'REAL_MARKET_DATA',
                systemStatus: coherenceAnalysis.systemStatus,
                
                // Top recomendaciones basadas en datos reales
                symbolRecommendations: rankedRecommendations.slice(0, this.maxRecommendations),
                
                // Insights globales del mercado real
                globalRecommendations: globalRecommendations,
                
                // Análisis del mercado real
                marketAnalysis: this.analyzeRealMarketConditions(realData),
                
                // Métricas de confianza reales
                confidence: {
                    overall: this.calculateRealConfidence(rankedRecommendations),
                    dataQuality: coherenceAnalysis.dataQuality,
                    systemHealth: coherenceAnalysis.systemHealth
                },
                
                // Estadísticas reales del sistema
                realStats: {
                    spotSymbols: realData.core.data?.spot?.symbols || 0,
                    futuresSymbols: realData.core.data?.futures?.symbols || 0,
                    activeSignals: Object.keys(realData.core.data?.spot?.signals || {}).length,
                    futuresOpportunities: Object.keys(realData.core.data?.futures?.opportunities || {}).length,
                    recommendationsGenerated: rankedRecommendations.length,
                    systemEntropy: getSystemEntropy(1),
                    unifiedDecision: realData.core.unifiedDecision?.final_decision || 'UNKNOWN'
                }
            };
            
            this.lastUpdate = Date.now();
            console.log(`✅ [REAL UNIFIED] Análisis completado en ${processingTime}ms`);
            console.log(`📊 [REAL] ${result.realStats.spotSymbols + result.realStats.futuresSymbols} símbolos → ${result.realStats.recommendationsGenerated} recomendaciones`);
            
            return result;
            
        } catch (error) {
            console.error('❌ [REAL UNIFIED] Error:', error.message);
            return this.generateErrorResponse(error);
        }
    }
    
    async fetchRealData() {
        console.log('📡 [REAL DATA] Obteniendo datos del sistema core con endpoints detallados...');
        
        const data = {
            core: null,
            systemHealth: null,
            systemStatus: null,
            rawSignals: null,
            rawOpportunities: null,
            errors: []
        };
        
        try {
            // Datos estratégicos del core
            const coreResponse = await axios.get(`${REAL_SOURCES.CORE_SYSTEM}/api/strategic-overview`, {
                timeout: 8000
            });
            data.core = coreResponse.data;
            console.log('✅ [REAL DATA] Datos core obtenidos');
        } catch (error) {
            data.errors.push({ source: 'core', error: error.message });
            console.log('❌ [REAL DATA] Error en core:', error.message);
        }
        
        try {
            // 🎯 SEÑALES SPOT DETALLADAS (NUEVO)
            const signalsResponse = await axios.get(`${REAL_SOURCES.CORE_SYSTEM}/api/raw-signals`, {
                timeout: 8000
            });
            data.rawSignals = signalsResponse.data;
            console.log(`✅ [REAL DATA] Señales SPOT detalladas obtenidas: ${data.rawSignals.count}`);
        } catch (error) {
            data.errors.push({ source: 'raw-signals', error: error.message });
            console.log('❌ [REAL DATA] Error en raw-signals:', error.message);
        }
        
        try {
            // ⚡ OPORTUNIDADES FUTURES DETALLADAS (NUEVO)
            const opportunitiesResponse = await axios.get(`${REAL_SOURCES.CORE_SYSTEM}/api/raw-opportunities`, {
                timeout: 8000
            });
            data.rawOpportunities = opportunitiesResponse.data;
            console.log(`✅ [REAL DATA] Oportunidades FUTURES detalladas obtenidas: ${data.rawOpportunities.count}`);
        } catch (error) {
            data.errors.push({ source: 'raw-opportunities', error: error.message });
            console.log('❌ [REAL DATA] Error en raw-opportunities:', error.message);
        }
        
        try {
            // Salud del sistema
            const healthResponse = await axios.get(`${REAL_SOURCES.CORE_SYSTEM}/health`, {
                timeout: 5000
            });
            data.systemHealth = healthResponse.data;
            console.log('✅ [REAL DATA] Salud del sistema obtenida');
        } catch (error) {
            data.errors.push({ source: 'health', error: error.message });
            console.log('❌ [REAL DATA] Error en health:', error.message);
        }
        
        try {
            // Estado detallado del sistema
            const statusResponse = await axios.get(`${REAL_SOURCES.CORE_SYSTEM}/api/system-status`, {
                timeout: 5000
            });
            data.systemStatus = statusResponse.data;
            console.log('✅ [REAL DATA] Estado del sistema obtenido');
        } catch (error) {
            data.errors.push({ source: 'status', error: error.message });
            console.log('❌ [REAL DATA] Error en status:', error.message);
        }
        
        return data;
    }
    
    analyzeRealDataCoherence(realData) {
        console.log('🔍 [REAL COHERENCE] Analizando coherencia de datos reales...');
        
        const analysis = {
            dataQuality: 0.5,
            systemStatus: 'UNKNOWN',
            systemHealth: 0.5,
            issues: []
        };
        
        // Evaluar disponibilidad de datos core
        if (realData.core?.data) {
            analysis.dataQuality += 0.3;
            
            const coreData = realData.core.data;
            const spotSymbols = coreData.spot?.symbols || 0;
            const futuresSymbols = coreData.futures?.symbols || 0;
            const signals = Object.keys(coreData.spot?.signals || {}).length;
            
            if (spotSymbols > 50 && futuresSymbols > 100) {
                analysis.dataQuality += 0.2;
                analysis.systemStatus = 'OPTIMAL';
            } else if (spotSymbols > 0 || futuresSymbols > 0) {
                analysis.systemStatus = 'FUNCTIONAL';
            }
            
            if (signals > 30) {
                analysis.dataQuality += 0.1;
            }
            
            console.log(`📊 [REAL] SPOT: ${spotSymbols}, FUTURES: ${futuresSymbols}, Señales: ${signals}`);
        }
        
        // Evaluar salud del sistema
        if (realData.systemHealth) {
            analysis.systemHealth = 0.8;
            
            const components = realData.systemHealth.components;
            if (components?.circuitBreaker) {
                const openBreakers = Object.values(components.circuitBreaker).filter(b => b.isOpen).length;
                if (openBreakers > 0) {
                    analysis.issues.push(`${openBreakers} circuit breakers abiertos`);
                    analysis.dataQuality -= 0.1;
                }
            }
            
            if (components?.rateLimiter?.processing) {
                const queueLength = components.rateLimiter.queueLength || 0;
                if (queueLength > 5) {
                    analysis.issues.push('Cola de requests elevada');
                    analysis.dataQuality -= 0.05;
                }
            }
        }
        
        // Evaluar errores
        if (realData.errors.length > 0) {
            analysis.dataQuality -= (realData.errors.length * 0.15);
            analysis.issues.push(`${realData.errors.length} fuentes con errores`);
        }
        
        // Normalizar
        analysis.dataQuality = Math.max(0, Math.min(1, analysis.dataQuality));
        
        console.log(`🔍 [REAL COHERENCE] Calidad: ${(analysis.dataQuality * 100).toFixed(1)}%, Estado: ${analysis.systemStatus}`);
        return analysis;
    }
    
    generateRealSymbolRecommendations(realData) {
        console.log('🎯 [REAL SYMBOLS] Analizando símbolos con datos reales detallados...');
        
        const recommendations = [];
        
        // 🎯 Usar datos DETALLADOS de las señales SPOT si están disponibles
        if (realData.rawSignals?.signals) {
            const spotSignals = realData.rawSignals.signals;
            console.log(`📈 [SPOT] Procesando ${Object.keys(spotSignals).length} señales DETALLADAS`);
            
            for (const [symbol, signal] of Object.entries(spotSignals)) {
                const rec = this.analyzeRealSpotSignal(symbol, signal, realData);
                if (rec) recommendations.push(rec);
            }
        } else if (realData.core?.data?.spot?.signals) {
            // Fallback a datos del overview si los detallados no están disponibles
            const spotSignals = realData.core.data.spot.signals;
            console.log(`📈 [SPOT FALLBACK] Procesando ${Object.keys(spotSignals).length} señales del overview`);
            
            for (const [symbol, signal] of Object.entries(spotSignals)) {
                const rec = this.analyzeRealSpotSignal(symbol, signal, realData);
                if (rec) recommendations.push(rec);
            }
        }
        
        // ⚡ Usar datos DETALLADOS de las oportunidades FUTURES si están disponibles
        if (realData.rawOpportunities?.opportunities) {
            const futuresOpps = realData.rawOpportunities.opportunities;
            console.log(`⚡ [FUTURES] Procesando ${Object.keys(futuresOpps).length} oportunidades DETALLADAS`);
            
            for (const [symbol, opportunity] of Object.entries(futuresOpps)) {
                const rec = this.analyzeRealFuturesOpportunity(symbol, opportunity, realData);
                if (rec) recommendations.push(rec);
            }
        } else if (realData.core?.data?.futures?.opportunities) {
            // Fallback a datos del overview si los detallados no están disponibles
            const futuresOpps = realData.core.data.futures.opportunities;
            console.log(`⚡ [FUTURES FALLBACK] Procesando ${Object.keys(futuresOpps).length} oportunidades del overview`);
            
            for (const [symbol, opportunity] of Object.entries(futuresOpps)) {
                const rec = this.analyzeRealFuturesOpportunity(symbol, opportunity, realData);
                if (rec) recommendations.push(rec);
            }
        }
        
        if (recommendations.length === 0) {
            console.log('⚠️ [REAL SYMBOLS] No se encontraron datos detallados ni de fallback');
        }
        
        console.log(`✅ [REAL SYMBOLS] ${recommendations.length} recomendaciones generadas de datos reales`);
        return recommendations;
    }
    
    analyzeRealSpotSignal(symbol, signal, realData) {
        // Usar datos reales del signal
        let confidence = signal.confidence || 0.5;
        const strength = signal.strength || 0;
        const entropyFactor = signal.entropy_factor || 0;
        
        // Ajustar confianza con entropy real
        if (entropyFactor) {
            confidence *= (0.8 + entropyFactor * 0.4);
        }
        
        // Ajustar por strength real
        if (strength > 0) {
            const strengthBoost = Math.min(strength / 12, 0.25);
            confidence += strengthBoost;
        }
        
        // Ajustar por salud del sistema real
        if (realData.systemHealth?.components?.entropy) {
            const systemEntropy = realData.systemHealth.components.entropy;
            confidence *= (0.75 + systemEntropy * 0.25);
        }
        
        confidence = Math.max(0.1, Math.min(1.0, confidence));
        
        // Decisión basada en datos reales
        let action = 'HOLD';
        let reasoning = [];
        
        if (signal.type === 'LONG' && confidence > this.confidenceThresholds.MEDIUM) {
            action = 'LONG';
            reasoning.push(`Señal LONG real (${(confidence * 100).toFixed(1)}%)`);
        } else if (signal.type === 'SHORT' && confidence > this.confidenceThresholds.MEDIUM) {
            action = 'SHORT';
            reasoning.push(`Señal SHORT real (${(confidence * 100).toFixed(1)}%)`);
        } else {
            reasoning.push('Señal real de baja confianza');
        }
        
        // Contexto de volatilidad real
        if (strength > 8) {
            reasoning.push(`⚡ Alta volatilidad real (${strength.toFixed(1)}%)`);
        } else if (strength > 5) {
            reasoning.push(`📈 Volatilidad moderada (${strength.toFixed(1)}%)`);
        }
        
        return {
            symbol: symbol,
            market: 'SPOT',
            action: action,
            confidence: confidence,
            priority: this.calculateRealPriority(confidence, strength),
            reasoning: reasoning.join(', '),
            realMetrics: {
                originalStrength: strength,
                originalConfidence: signal.confidence,
                entropyFactor: entropyFactor,
                signalType: signal.type,
                dataSource: 'BINANCE_API'
            },
            timestamp: Date.now()
        };
    }
    
    analyzeRealFuturesOpportunity(symbol, opportunity, realData) {
        // Usar datos reales de la oportunidad
        let confidence = opportunity.confidence || 0.5;
        const leverage = opportunity.leverage || 1;
        const entropyScore = opportunity.entropy_score || 0;
        
        // Ajustar confianza con entropy score real
        if (entropyScore) {
            confidence += entropyScore * 0.2;
        }
        
        // Ajustar por leverage real (penalizar leverage extremo)
        if (leverage > 15) {
            confidence *= 0.85;
        } else if (leverage < 5) {
            confidence *= 1.05;
        }
        
        confidence = Math.max(0.1, Math.min(1.0, confidence));
        
        // Decisión basada en datos reales
        let action = 'HOLD';
        let reasoning = [];
        
        if (opportunity.type === 'LONG' && confidence > this.confidenceThresholds.MEDIUM) {
            action = 'LONG';
            reasoning.push(`Oportunidad LONG real ${leverage.toFixed(1)}x`);
        } else if (opportunity.type === 'SHORT' && confidence > this.confidenceThresholds.MEDIUM) {
            action = 'SHORT';
            reasoning.push(`Oportunidad SHORT real ${leverage.toFixed(1)}x`);
        } else {
            reasoning.push('Oportunidad real de baja confianza');
        }
        
        // Advertencias de riesgo real
        if (leverage > 12) {
            reasoning.push('⚠️ Leverage alto detectado');
        }
        
        return {
            symbol: symbol,
            market: 'FUTURES',
            action: action,
            confidence: confidence,
            leverage: leverage,
            priority: this.calculateRealPriority(confidence, leverage),
            reasoning: reasoning.join(', '),
            realMetrics: {
                originalLeverage: leverage,
                originalConfidence: opportunity.confidence,
                entropyScore: entropyScore,
                opportunityType: opportunity.type,
                dataSource: 'BINANCE_FUTURES_API'
            },
            timestamp: Date.now()
        };
    }
    
    calculateRealPriority(confidence, intensity) {
        // Prioridad basada en métricas reales
        const weightedScore = (confidence * 0.7) + (Math.min(intensity / 15, 1) * 0.3);
        
        if (weightedScore >= 0.75) return 'HIGH';
        if (weightedScore >= 0.55) return 'MEDIUM';
        return 'LOW';
    }
    
    applyRealRiskFilters(recommendations, coherenceAnalysis) {
        console.log('🛡️ [REAL RISK] Aplicando filtros con datos reales...');
        
        let filtered = [...recommendations];
        
        // Filtro basado en calidad real de datos
        if (coherenceAnalysis.dataQuality < 0.6) {
            const originalCount = filtered.length;
            filtered = filtered.filter(rec => rec.confidence > 0.7);
            console.log(`⚠️ [REAL RISK] Filtro de calidad: ${originalCount} → ${filtered.length}`);
        }
        
        // Filtro por problemas reales del sistema
        if (coherenceAnalysis.issues.length > 0) {
            const originalCount = filtered.length;
            filtered = filtered.filter(rec => rec.action === 'HOLD' || rec.confidence > 0.8);
            console.log(`🚨 [REAL RISK] Filtro por problemas del sistema: ${originalCount} → ${filtered.length}`);
        }
        
        // Límite real de diversificación
        const maxPerSymbol = 2;
        const symbolCounts = new Map();
        const diversified = [];
        
        filtered
            .sort((a, b) => b.confidence - a.confidence)
            .forEach(rec => {
                const count = symbolCounts.get(rec.symbol) || 0;
                if (count < maxPerSymbol) {
                    diversified.push(rec);
                    symbolCounts.set(rec.symbol, count + 1);
                }
            });
        
        console.log(`🛡️ [REAL RISK] Filtros aplicados: ${recommendations.length} → ${diversified.length}`);
        return diversified;
    }
    
    rankByRealMetrics(recommendations) {
        console.log('📈 [REAL RANKING] Rankeando por métricas reales...');
        
        return recommendations
            .sort((a, b) => {
                // 1. Prioridad calculada con datos reales
                const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
                const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
                if (priorityDiff !== 0) return priorityDiff;
                
                // 2. Confianza ajustada con datos reales
                if (Math.abs(b.confidence - a.confidence) > 0.05) {
                    return b.confidence - a.confidence;
                }
                
                // 3. Preferir FUTURES para oportunidades de mayor retorno
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
    
    generateRealGlobalInsights(realData, coherenceAnalysis) {
        console.log('🌍 [REAL GLOBAL] Generando insights globales reales...');
        
        const insights = [];
        
        // Insight basado en salud real del sistema
        if (coherenceAnalysis.systemHealth < 0.7) {
            insights.push({
                type: 'SYSTEM_HEALTH_REAL',
                priority: 'HIGH',
                recommendation: 'Sistema con problemas detectados - Reducir exposición',
                reasoning: `Salud del sistema: ${(coherenceAnalysis.systemHealth * 100).toFixed(1)}%`,
                action: 'REDUCE_RISK_EXPOSURE'
            });
        }
        
        // Insight basado en datos reales del mercado
        if (realData.core?.data) {
            const spotCount = realData.core.data.spot?.symbols || 0;
            const futuresCount = realData.core.data.futures?.symbols || 0;
            const totalSymbols = spotCount + futuresCount;
            
            if (totalSymbols > 150) {
                insights.push({
                    type: 'MARKET_COVERAGE_REAL',
                    priority: 'MEDIUM',
                    recommendation: 'Excelente cobertura de mercado detectada',
                    reasoning: `${totalSymbols} símbolos analizados en tiempo real (${spotCount} SPOT + ${futuresCount} FUTURES)`,
                    action: 'OPTIMIZE_DIVERSIFICATION'
                });
            }
        }
        
        // Insight basado en entropía real del sistema
        const currentEntropy = getSystemEntropy(1);
        if (currentEntropy > 0.8) {
            insights.push({
                type: 'QUANTUM_ENTROPY_REAL',
                priority: 'HIGH',
                recommendation: 'Alta entropía cuántica detectada - Oportunidades excepcionales',
                reasoning: `Entropía del sistema: ${(currentEntropy * 100).toFixed(1)}%`,
                action: 'CAPITALIZE_ON_QUANTUM_OPPORTUNITIES'
            });
        }
        
        // Insight basado en decisión unificada LLM
        if (realData.core?.unifiedDecision) {
            const decision = realData.core.unifiedDecision;
            insights.push({
                type: 'LLM_NEURAL_DECISION',
                priority: 'MEDIUM',
                recommendation: `Sistema neural recomienda: ${decision.final_decision}`,
                reasoning: `Confianza LLM: ${(decision.confidence * 100).toFixed(1)}%`,
                action: 'ALIGN_WITH_NEURAL_ANALYSIS'
            });
        }
        
        return insights;
    }
    
    analyzeRealMarketConditions(realData) {
        console.log('📊 [REAL MARKET] Analizando condiciones reales del mercado...');
        
        const analysis = {
            dataSource: 'REAL_BINANCE_API',
            overall_sentiment: 'NEUTRAL',
            volatility_level: 'MEDIUM',
            opportunity_count: 0,
            risk_level: 'MEDIUM'
        };
        
        if (realData.core?.data) {
            const signals = realData.core.data.spot?.signals || {};
            const opportunities = realData.core.data.futures?.opportunities || {};
            
            analysis.opportunity_count = Object.keys(signals).length + Object.keys(opportunities).length;
            
            // Analizar sentiment real
            const longSignals = Object.values(signals).filter(s => s.type === 'LONG').length;
            const shortSignals = Object.values(signals).filter(s => s.type === 'SHORT').length;
            const totalSignals = longSignals + shortSignals;
            
            if (totalSignals > 0) {
                const longRatio = longSignals / totalSignals;
                if (longRatio > 0.6) {
                    analysis.overall_sentiment = 'BULLISH';
                } else if (longRatio < 0.4) {
                    analysis.overall_sentiment = 'BEARISH';
                }
                
                analysis.sentiment_details = {
                    long_signals: longSignals,
                    short_signals: shortSignals,
                    bullish_ratio: `${(longRatio * 100).toFixed(1)}%`
                };
            }
            
            // Analizar volatilidad real
            const strengths = Object.values(signals).map(s => s.strength || 0);
            if (strengths.length > 0) {
                const avgStrength = strengths.reduce((sum, s) => sum + s, 0) / strengths.length;
                const maxStrength = Math.max(...strengths);
                
                if (avgStrength > 7 || maxStrength > 12) {
                    analysis.volatility_level = 'HIGH';
                } else if (avgStrength < 3) {
                    analysis.volatility_level = 'LOW';
                }
                
                analysis.volatility_details = {
                    average_strength: avgStrength.toFixed(2),
                    max_strength: maxStrength.toFixed(2),
                    volatile_symbols: strengths.filter(s => s > 8).length
                };
            }
        }
        
        // Sistema de entropía real
        analysis.system_entropy = {
            current_level: getSystemEntropy(1),
            level_description: getSystemEntropy(1) > 0.7 ? 'HIGH_OPPORTUNITY' : 'NORMAL'
        };
        
        return analysis;
    }
    
    calculateRealConfidence(recommendations) {
        if (recommendations.length === 0) return 0;
        
        const avgConfidence = recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length;
        const highConfidenceCount = recommendations.filter(rec => rec.confidence > 0.75).length;
        const highConfidenceRatio = highConfidenceCount / recommendations.length;
        
        return (avgConfidence * 0.65) + (highConfidenceRatio * 0.35);
    }
    
    generateErrorResponse(error) {
        return {
            timestamp: Date.now(),
            dataSource: 'ERROR_FALLBACK',
            systemStatus: 'ERROR',
            
            symbolRecommendations: [],
            globalRecommendations: [{
                type: 'SYSTEM_ERROR',
                priority: 'CRITICAL',
                recommendation: 'Error en sistema - Verificar conexiones',
                reasoning: error.message,
                action: 'CHECK_SYSTEM_STATUS'
            }],
            
            marketAnalysis: {
                dataSource: 'UNAVAILABLE',
                overall_sentiment: 'UNKNOWN',
                volatility_level: 'UNKNOWN',
                opportunity_count: 0,
                risk_level: 'HIGH'
            },
            
            confidence: {
                overall: 0.0,
                dataQuality: 0.0,
                systemHealth: 0.0
            },
            
            realStats: {
                spotSymbols: 0,
                futuresSymbols: 0,
                activeSignals: 0,
                futuresOpportunities: 0,
                recommendationsGenerated: 0,
                systemEntropy: getSystemEntropy(1),
                error: error.message
            }
        };
    }
}

// 🚀 INICIALIZAR MOTOR REAL
const realEngine = new RealUnifiedRecommendationEngine();

// 🌐 ENDPOINTS CON DATOS REALES
app.get('/health', (req, res) => {
    res.json({
        status: 'REAL_UNIFIED_RECOMMENDATIONS',
        timestamp: new Date().toISOString(),
        lastUpdate: realEngine.lastUpdate,
        version: '1.0.0-REAL',
        dataSources: ['CORE_ANTI_418_REAL', 'BINANCE_API_REAL', 'SYSTEM_ENTROPY_REAL']
    });
});

app.get('/api/real-recommendations', async (req, res) => {
    try {
        const recommendations = await realEngine.generateRealRecommendations();
        res.json({
            success: true,
            system: 'REAL_UNIFIED_RECOMMENDATIONS',
            ...recommendations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            fallback: realEngine.generateErrorResponse(error)
        });
    }
});

app.get('/api/real-top/:count?', async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 10;
        const recommendations = await realEngine.generateRealRecommendations();
        
        res.json({
            success: true,
            system: 'REAL_TOP_RECOMMENDATIONS',
            count: count,
            timestamp: recommendations.timestamp,
            recommendations: recommendations.symbolRecommendations.slice(0, count),
            globalInsights: recommendations.globalRecommendations,
            marketAnalysis: recommendations.marketAnalysis,
            confidence: recommendations.confidence,
            realStats: recommendations.realStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/real-market-analysis', async (req, res) => {
    try {
        const analysis = await realEngine.generateRealRecommendations();
        
        res.json({
            success: true,
            system: 'REAL_MARKET_ANALYSIS',
            timestamp: analysis.timestamp,
            marketAnalysis: analysis.marketAnalysis,
            globalInsights: analysis.globalRecommendations,
            systemHealth: {
                dataQuality: analysis.confidence.dataQuality,
                systemHealth: analysis.confidence.systemHealth,
                overallConfidence: analysis.confidence.overall
            },
            realStats: analysis.realStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 🚀 INICIALIZACIÓN
app.listen(PORT, () => {
    console.log(`🧠 [REAL UNIFIED] Sistema con datos reales ejecutándose en puerto ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`\n📋 Endpoints con datos reales:`);
    console.log(`   - /health (estado del sistema real)`);
    console.log(`   - /api/real-recommendations (recomendaciones con datos reales)`);
    console.log(`   - /api/real-top/{count} (top N recomendaciones reales)`);
    console.log(`   - /api/real-market-analysis (análisis de mercado real)`);
    
    // Verificar conexión con sistema core después de un momento
    setTimeout(async () => {
        try {
            console.log(`\n🔄 [REAL TEST] Probando conexión con datos reales...`);
            const testResult = await realEngine.generateRealRecommendations();
            
            if (testResult.realStats.spotSymbols > 0 || testResult.realStats.futuresSymbols > 0) {
                console.log(`✅ [REAL TEST] Conexión exitosa con datos reales:`);
                console.log(`   📈 SPOT: ${testResult.realStats.spotSymbols} símbolos`);
                console.log(`   ⚡ FUTURES: ${testResult.realStats.futuresSymbols} símbolos`);
                console.log(`   🎯 Señales: ${testResult.realStats.activeSignals}`);
                console.log(`   🔥 Oportunidades: ${testResult.realStats.futuresOpportunities}`);
                console.log(`   📊 Recomendaciones: ${testResult.realStats.recommendationsGenerated}`);
                console.log(`   🎪 Entropía: ${(testResult.realStats.systemEntropy * 100).toFixed(1)}%`);
            } else {
                console.log(`⚠️ [REAL TEST] Sistema core no responde - verificar que esté ejecutándose`);
            }
        } catch (error) {
            console.log(`❌ [REAL TEST] Error: ${error.message}`);
            console.log(`💡 [SUGERENCIA] Ejecutar: node core-optimal-anti418.js`);
        }
    }, 5000);
});

console.log('🎯 [REAL UNIFIED] Sistema listo para datos reales de mercado');

module.exports = { app, realEngine };

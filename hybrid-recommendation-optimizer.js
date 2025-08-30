/**
 * 🚀 HYBRID RECOMMENDATION OPTIMIZER
 * ==================================
 * 
 * Sistema optimizado que combina:
 * - Señales SPOT (como fuente de información de mercado)
 * - Oportunidades FUTURES (como ejecución operativa)
 * - Correlación cruzada entre ambos mercados
 * - Entropía híbrida para maximizar calidad de recomendaciones
 * - Priorización inteligente basada en confluencia
 * 
 * OBJETIVO: Generar recomendaciones de máxima calidad usando TODO el ecosistema
 */

const express = require('express');
const axios = require('axios');
const { getSystemEntropy, getHashEntropy } = require('./system-entropy');

const app = express();
const PORT = 4800;

app.use(express.json());

// 🎯 CONFIGURACIÓN DEL OPTIMIZADOR HÍBRIDO
const HYBRID_CONFIG = {
    CORE_SYSTEM: 'http://localhost:4602',
    ENTROPY_THRESHOLD: 0.6,
    CONFIDENCE_THRESHOLDS: {
        SPOT_MIN: 0.2,      // Umbral mínimo para SPOT (información)
        FUTURES_MIN: 0.7,   // Umbral mínimo para FUTURES (ejecución)
        HYBRID_MIN: 0.6     // Umbral para recomendaciones híbridas
    },
    MAX_RECOMMENDATIONS: 25,
    CORRELATION_WEIGHT: 0.3, // Peso de la correlación SPOT-FUTURES
    LEVERAGE_LIMITS: {
        CONSERVATIVE: 5,
        MODERATE: 10,
        AGGRESSIVE: 20
    }
};

console.log('🚀 [HYBRID OPTIMIZER] Iniciando sistema híbrido optimizado...');

// 🧠 MOTOR DE OPTIMIZACIÓN HÍBRIDA
class HybridRecommendationOptimizer {
    constructor() {
        this.lastUpdate = 0;
        this.cachedData = null;
        this.correlationMatrix = new Map();
        this.entropyPool = [];
        
        console.log('🧠 [HYBRID ENGINE] Motor híbrido inicializado');
    }
    
    async generateOptimizedRecommendations() {
        console.log('🔄 [HYBRID] Iniciando optimización híbrida...');
        const startTime = Date.now();
        
        try {
            // 1. 📡 OBTENER DATOS COMPLETOS
            const rawData = await this.fetchCompleteRawData();
            
            // 2. 🔍 ANALIZAR CORRELACIONES SPOT-FUTURES
            const correlations = this.analyzeSpotFuturesCorrelations(rawData);
            
            // 3. 🎯 GENERAR RECOMENDACIONES HÍBRIDAS
            const hybridRecommendations = this.generateHybridRecommendations(rawData, correlations);
            
            // 4. 🧮 CALCULAR ENTROPÍA HÍBRIDA
            const entropyMetrics = this.calculateHybridEntropy(hybridRecommendations, rawData);
            
            // 5. 📊 PRIORIZAR CON INTELIGENCIA AVANZADA
            const prioritizedRecommendations = this.intelligentPrioritization(hybridRecommendations, entropyMetrics);
            
            // 6. 🛡️ APLICAR FILTROS DE RIESGO HÍBRIDOS
            const finalRecommendations = this.applyHybridRiskFilters(prioritizedRecommendations);
            
            const processingTime = Date.now() - startTime;
            
            const result = {
                success: true,
                system: 'HYBRID_RECOMMENDATION_OPTIMIZER',
                timestamp: Date.now(),
                processingTime,
                version: '2.0_HYBRID',
                
                // 📈 RECOMENDACIONES OPTIMIZADAS
                optimizedRecommendations: finalRecommendations.slice(0, HYBRID_CONFIG.MAX_RECOMMENDATIONS),
                
                // 📊 ANÁLISIS HÍBRIDO
                hybridAnalysis: {
                    spotSignalsAnalyzed: Object.keys(rawData.spotSignals || {}).length,
                    futuresOpportunitiesAnalyzed: Object.keys(rawData.futuresOpportunities || {}).length,
                    correlationsFound: correlations.high.length + correlations.medium.length,
                    hybridMatches: correlations.high.length,
                    entropyScore: entropyMetrics.overallEntropy,
                    confidenceDistribution: this.analyzeConfidenceDistribution(finalRecommendations)
                },
                
                // 🔗 MATRIZ DE CORRELACIÓN
                correlationMatrix: {
                    highCorrelation: correlations.high,
                    mediumCorrelation: correlations.medium,
                    spotFuturesOverlap: correlations.overlap
                },
                
                // 🎲 MÉTRICAS DE ENTROPÍA HÍBRIDA
                entropyMetrics: {
                    systemEntropy: entropyMetrics.systemEntropy,
                    dataEntropy: entropyMetrics.dataEntropy,
                    hybridEntropy: entropyMetrics.hybridEntropy,
                    optimalityScore: entropyMetrics.optimalityScore
                },
                
                // 📋 ESTADÍSTICAS DEL SISTEMA
                systemStats: {
                    dataQuality: this.assessDataQuality(rawData),
                    recommendationTypes: this.categorizeRecommendations(finalRecommendations),
                    riskDistribution: this.analyzeRiskDistribution(finalRecommendations),
                    leverageStats: this.analyzeLeverageDistribution(finalRecommendations)
                }
            };
            
            this.cachedData = result;
            this.lastUpdate = Date.now();
            
            console.log(`✅ [HYBRID] Optimización completada en ${processingTime}ms`);
            console.log(`📊 [HYBRID] ${result.hybridAnalysis.spotSignalsAnalyzed}+${result.hybridAnalysis.futuresOpportunitiesAnalyzed} datos → ${result.optimizedRecommendations.length} recomendaciones`);
            
            return result;
            
        } catch (error) {
            console.error('❌ [HYBRID] Error en optimización:', error.message);
            return this.generateErrorResponse(error);
        }
    }
    
    async fetchCompleteRawData() {
        console.log('📡 [HYBRID] Obteniendo datos completos del ecosistema...');
        
        const data = {
            spotSignals: {},
            futuresOpportunities: {},
            systemHealth: null,
            errors: []
        };
        
        try {
            // Obtener señales SPOT completas (sin filtro de confianza)
            const spotsResponse = await axios.get(`${HYBRID_CONFIG.CORE_SYSTEM}/api/raw-signals`, {
                timeout: 10000
            });
            
            if (spotsResponse.data.success) {
                data.spotSignals = spotsResponse.data.signals || {};
                console.log(`✅ [HYBRID] ${spotsResponse.data.count} señales SPOT obtenidas`);
            }
        } catch (error) {
            data.errors.push({ source: 'spot-signals', error: error.message });
            console.log('❌ [HYBRID] Error en señales SPOT:', error.message);
        }
        
        try {
            // Obtener oportunidades FUTURES completas
            const futuresResponse = await axios.get(`${HYBRID_CONFIG.CORE_SYSTEM}/api/raw-opportunities`, {
                timeout: 10000
            });
            
            if (futuresResponse.data.success) {
                data.futuresOpportunities = futuresResponse.data.opportunities || {};
                console.log(`✅ [HYBRID] ${futuresResponse.data.count} oportunidades FUTURES obtenidas`);
            }
        } catch (error) {
            data.errors.push({ source: 'futures-opportunities', error: error.message });
            console.log('❌ [HYBRID] Error en oportunidades FUTURES:', error.message);
        }
        
        try {
            // Obtener salud del sistema para contexto
            const healthResponse = await axios.get(`${HYBRID_CONFIG.CORE_SYSTEM}/health`, {
                timeout: 5000
            });
            data.systemHealth = healthResponse.data;
            console.log('✅ [HYBRID] Estado del sistema obtenido');
        } catch (error) {
            data.errors.push({ source: 'system-health', error: error.message });
        }
        
        return data;
    }
    
    analyzeSpotFuturesCorrelations(rawData) {
        console.log('🔍 [HYBRID] Analizando correlaciones SPOT-FUTURES...');
        
        const spotSymbols = Object.keys(rawData.spotSignals || {});
        const futuresSymbols = Object.keys(rawData.futuresOpportunities || {});
        
        const correlations = {
            high: [],      // Misma dirección, alta confianza
            medium: [],    // Misma dirección, confianza media
            conflicts: [], // Direcciones opuestas
            overlap: []    // Símbolos presentes en ambos mercados
        };
        
        for (const symbol of spotSymbols) {
            if (futuresSymbols.includes(symbol)) {
                correlations.overlap.push(symbol);
                
                const spotSignal = rawData.spotSignals[symbol];
                const futuresOpp = rawData.futuresOpportunities[symbol];
                
                if (spotSignal && futuresOpp) {
                    const spotDirection = spotSignal.type; // LONG/SHORT
                    const futuresDirection = futuresOpp.type || 'UNKNOWN';
                    
                    const combinedConfidence = (
                        (spotSignal.confidence || 0) * 0.3 +
                        (futuresOpp.confidence || 0) * 0.7
                    );
                    
                    const correlation = {
                        symbol,
                        spotDirection,
                        futuresDirection,
                        combinedConfidence,
                        spotStrength: spotSignal.strength || 0,
                        futuresLeverage: futuresOpp.leverage || 1,
                        entropyFactor: (spotSignal.entropy_factor || 0 + futuresOpp.entropy_factor || 0) / 2
                    };
                    
                    if (spotDirection === futuresDirection) {
                        if (combinedConfidence >= 0.8) {
                            correlations.high.push(correlation);
                        } else if (combinedConfidence >= 0.6) {
                            correlations.medium.push(correlation);
                        }
                    } else if (spotDirection !== 'UNKNOWN' && futuresDirection !== 'UNKNOWN') {
                        correlations.conflicts.push(correlation);
                    }
                }
            }
        }
        
        console.log(`🔍 [CORRELATIONS] Alta: ${correlations.high.length}, Media: ${correlations.medium.length}, Conflictos: ${correlations.conflicts.length}`);
        
        return correlations;
    }
    
    generateHybridRecommendations(rawData, correlations) {
        console.log('🎯 [HYBRID] Generando recomendaciones híbridas...');
        
        const recommendations = [];
        
        // 1. RECOMENDACIONES DE ALTA CORRELACIÓN (máxima prioridad)
        for (const correlation of correlations.high) {
            const hybrid = this.createHybridRecommendation(correlation, rawData, 'HIGH_CORRELATION');
            if (hybrid) recommendations.push(hybrid);
        }
        
        // 2. RECOMENDACIONES DE CORRELACIÓN MEDIA
        for (const correlation of correlations.medium) {
            const hybrid = this.createHybridRecommendation(correlation, rawData, 'MEDIUM_CORRELATION');
            if (hybrid) recommendations.push(hybrid);
        }
        
        // 3. RECOMENDACIONES SOLO FUTURES (para símbolos sin correlación SPOT)
        for (const [symbol, opportunity] of Object.entries(rawData.futuresOpportunities || {})) {
            if (!correlations.overlap.includes(symbol) && opportunity.confidence >= HYBRID_CONFIG.CONFIDENCE_THRESHOLDS.FUTURES_MIN) {
                const futuresOnly = this.createFuturesOnlyRecommendation(symbol, opportunity, rawData);
                if (futuresOnly) recommendations.push(futuresOnly);
            }
        }
        
        console.log(`🎯 [HYBRID] ${recommendations.length} recomendaciones híbridas generadas`);
        return recommendations;
    }
    
    createHybridRecommendation(correlation, rawData, correlationType) {
        const { symbol, spotDirection, futuresDirection, combinedConfidence, spotStrength, futuresLeverage, entropyFactor } = correlation;
        
        // Calcular confianza híbrida
        const spotSignal = rawData.spotSignals[symbol];
        const futuresOpp = rawData.futuresOpportunities[symbol];
        
        const hybridConfidence = Math.min(
            combinedConfidence * (1 + entropyFactor * 0.5), // Bonus por entropía
            1.0
        );
        
        // Ajustar leverage basado en correlación
        let adjustedLeverage = futuresLeverage;
        if (correlationType === 'HIGH_CORRELATION') {
            adjustedLeverage *= 1.2; // Bonus de leverage por alta correlación
        }
        
        // Calcular score híbrido
        const hybridScore = (
            hybridConfidence * 0.4 +
            (spotStrength / 10) * 0.2 +
            (Math.min(adjustedLeverage / 10, 1)) * 0.3 +
            entropyFactor * 0.1
        );
        
        return {
            symbol,
            market: 'HYBRID_SPOT_FUTURES',
            action: futuresDirection,
            confidence: hybridConfidence,
            leverage: adjustedLeverage,
            priority: correlationType === 'HIGH_CORRELATION' ? 'CRITICAL' : 'HIGH',
            reasoning: `Híbrido ${correlationType.toLowerCase()}: SPOT ${spotDirection} + FUTURES ${futuresDirection} (${adjustedLeverage.toFixed(1)}x)`,
            hybridMetrics: {
                correlationType,
                spotConfidence: spotSignal.confidence,
                futuresConfidence: futuresOpp.confidence,
                combinedConfidence: hybridConfidence,
                spotStrength,
                entropyFactor,
                hybridScore
            },
            timestamp: Date.now(),
            dataSource: 'HYBRID_SPOT_FUTURES_CORRELATION'
        };
    }
    
    createFuturesOnlyRecommendation(symbol, opportunity, rawData) {
        return {
            symbol,
            market: 'FUTURES_STANDALONE',
            action: opportunity.type || 'UNKNOWN',
            confidence: opportunity.confidence || 0,
            leverage: opportunity.leverage || 1,
            priority: 'MEDIUM',
            reasoning: `Solo FUTURES: ${opportunity.type} ${(opportunity.leverage || 1).toFixed(1)}x`,
            hybridMetrics: {
                correlationType: 'NO_SPOT_DATA',
                spotConfidence: 0,
                futuresConfidence: opportunity.confidence || 0,
                combinedConfidence: opportunity.confidence || 0,
                entropyFactor: opportunity.entropy_factor || 0,
                hybridScore: (opportunity.confidence || 0) * 0.8
            },
            timestamp: Date.now(),
            dataSource: 'FUTURES_ONLY'
        };
    }
    
    calculateHybridEntropy(recommendations, rawData) {
        console.log('🧮 [HYBRID] Calculando entropía híbrida...');
        
        const systemEntropy = getSystemEntropy(1);
        const dataEntropy = this.calculateDataEntropy(rawData);
        
        // Calcular entropía de recomendaciones
        const confidences = recommendations.map(r => r.confidence);
        const leverages = recommendations.map(r => r.leverage);
        
        const confidenceEntropy = this.calculateArrayEntropy(confidences);
        const leverageEntropy = this.calculateArrayEntropy(leverages);
        
        const hybridEntropy = (systemEntropy + dataEntropy + confidenceEntropy + leverageEntropy) / 4;
        
        const optimalityScore = Math.min(
            hybridEntropy * recommendations.length / 10,
            1.0
        );
        
        return {
            systemEntropy,
            dataEntropy,
            confidenceEntropy,
            leverageEntropy,
            hybridEntropy,
            optimalityScore,
            overallEntropy: hybridEntropy
        };
    }
    
    calculateArrayEntropy(array) {
        if (array.length === 0) return 0;
        
        // Crear histograma normalizado
        const histogram = {};
        for (const value of array) {
            const bucket = Math.floor(value * 10) / 10; // Redondear a 1 decimal
            histogram[bucket] = (histogram[bucket] || 0) + 1;
        }
        
        const total = array.length;
        let entropy = 0;
        
        for (const count of Object.values(histogram)) {
            const p = count / total;
            if (p > 0) {
                entropy -= p * Math.log2(p);
            }
        }
        
        return entropy / Math.log2(Object.keys(histogram).length || 1);
    }
    
    calculateDataEntropy(rawData) {
        const spotCount = Object.keys(rawData.spotSignals || {}).length;
        const futuresCount = Object.keys(rawData.futuresOpportunities || {}).length;
        const totalCount = spotCount + futuresCount;
        
        if (totalCount === 0) return 0;
        
        const spotRatio = spotCount / totalCount;
        const futuresRatio = futuresCount / totalCount;
        
        let entropy = 0;
        if (spotRatio > 0) entropy -= spotRatio * Math.log2(spotRatio);
        if (futuresRatio > 0) entropy -= futuresRatio * Math.log2(futuresRatio);
        
        return entropy;
    }
    
    intelligentPrioritization(recommendations, entropyMetrics) {
        console.log('📊 [HYBRID] Aplicando priorización inteligente...');
        
        return recommendations
            .map(rec => {
                // Calcular score final basado en múltiples factores
                let finalScore = rec.hybridMetrics.hybridScore;
                
                // Bonus por tipo de correlación
                if (rec.hybridMetrics.correlationType === 'HIGH_CORRELATION') {
                    finalScore += 0.3;
                } else if (rec.hybridMetrics.correlationType === 'MEDIUM_CORRELATION') {
                    finalScore += 0.15;
                }
                
                // Bonus por entropía del sistema
                finalScore += entropyMetrics.overallEntropy * 0.2;
                
                // Penalty por leverage extremo
                if (rec.leverage > HYBRID_CONFIG.LEVERAGE_LIMITS.AGGRESSIVE) {
                    finalScore *= 0.8;
                } else if (rec.leverage > HYBRID_CONFIG.LEVERAGE_LIMITS.MODERATE) {
                    finalScore *= 0.9;
                }
                
                return {
                    ...rec,
                    finalScore,
                    rank: 0 // Se asignará después del ordenamiento
                };
            })
            .sort((a, b) => b.finalScore - a.finalScore)
            .map((rec, index) => ({
                ...rec,
                rank: index + 1
            }));
    }
    
    applyHybridRiskFilters(recommendations) {
        console.log('🛡️ [HYBRID] Aplicando filtros de riesgo híbridos...');
        
        return recommendations.filter(rec => {
            // Filtro por confianza mínima
            if (rec.confidence < HYBRID_CONFIG.CONFIDENCE_THRESHOLDS.HYBRID_MIN) {
                return false;
            }
            
            // Filtro por leverage extremo (solo para advertencia, no eliminación)
            if (rec.leverage > HYBRID_CONFIG.LEVERAGE_LIMITS.AGGRESSIVE) {
                rec.reasoning += ', ⚠️ Leverage muy alto detectado';
            }
            
            return true;
        });
    }
    
    // Métodos auxiliares de análisis
    analyzeConfidenceDistribution(recommendations) {
        const high = recommendations.filter(r => r.confidence >= 0.8).length;
        const medium = recommendations.filter(r => r.confidence >= 0.6 && r.confidence < 0.8).length;
        const low = recommendations.filter(r => r.confidence < 0.6).length;
        
        return { high, medium, low };
    }
    
    assessDataQuality(rawData) {
        const spotCount = Object.keys(rawData.spotSignals || {}).length;
        const futuresCount = Object.keys(rawData.futuresOpportunities || {}).length;
        const errorCount = rawData.errors?.length || 0;
        
        const totalData = spotCount + futuresCount;
        const qualityScore = Math.max(0, (totalData - errorCount * 10) / Math.max(totalData, 1));
        
        return {
            score: qualityScore,
            spotDataAvailable: spotCount > 0,
            futuresDataAvailable: futuresCount > 0,
            errors: errorCount
        };
    }
    
    categorizeRecommendations(recommendations) {
        return {
            hybrid: recommendations.filter(r => r.market === 'HYBRID_SPOT_FUTURES').length,
            futuresOnly: recommendations.filter(r => r.market === 'FUTURES_STANDALONE').length,
            critical: recommendations.filter(r => r.priority === 'CRITICAL').length,
            high: recommendations.filter(r => r.priority === 'HIGH').length,
            medium: recommendations.filter(r => r.priority === 'MEDIUM').length
        };
    }
    
    analyzeRiskDistribution(recommendations) {
        return {
            conservative: recommendations.filter(r => r.leverage <= HYBRID_CONFIG.LEVERAGE_LIMITS.CONSERVATIVE).length,
            moderate: recommendations.filter(r => r.leverage > HYBRID_CONFIG.LEVERAGE_LIMITS.CONSERVATIVE && r.leverage <= HYBRID_CONFIG.LEVERAGE_LIMITS.MODERATE).length,
            aggressive: recommendations.filter(r => r.leverage > HYBRID_CONFIG.LEVERAGE_LIMITS.MODERATE).length
        };
    }
    
    analyzeLeverageDistribution(recommendations) {
        const leverages = recommendations.map(r => r.leverage);
        
        return {
            average: leverages.reduce((sum, l) => sum + l, 0) / leverages.length || 0,
            min: Math.min(...leverages) || 0,
            max: Math.max(...leverages) || 0,
            median: this.calculateMedian(leverages)
        };
    }
    
    calculateMedian(array) {
        const sorted = [...array].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    }
    
    generateErrorResponse(error) {
        return {
            success: false,
            system: 'HYBRID_RECOMMENDATION_OPTIMIZER',
            error: error.message,
            timestamp: Date.now(),
            fallback: 'Sistema híbrido no disponible temporalmente'
        };
    }
}

// Instancia global del optimizador
const hybridOptimizer = new HybridRecommendationOptimizer();

// 🚀 ENDPOINTS DE OPTIMIZACIÓN HÍBRIDA

app.get('/health', (req, res) => {
    res.json({
        success: true,
        system: 'HYBRID_RECOMMENDATION_OPTIMIZER',
        status: 'ACTIVE',
        version: '2.0_HYBRID',
        timestamp: Date.now(),
        lastUpdate: hybridOptimizer.lastUpdate
    });
});

app.get('/api/optimized-recommendations', async (req, res) => {
    try {
        const result = await hybridOptimizer.generateOptimizedRecommendations();
        res.json(result);
    } catch (error) {
        console.error('❌ [ENDPOINT] Error:', error.message);
        res.status(500).json(hybridOptimizer.generateErrorResponse(error));
    }
});

app.get('/api/top-hybrid/:count', async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 10;
        const result = await hybridOptimizer.generateOptimizedRecommendations();
        
        if (result.success) {
            res.json({
                ...result,
                optimizedRecommendations: result.optimizedRecommendations.slice(0, count)
            });
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('❌ [ENDPOINT] Error:', error.message);
        res.status(500).json(hybridOptimizer.generateErrorResponse(error));
    }
});

app.get('/api/hybrid-analysis', async (req, res) => {
    try {
        const result = await hybridOptimizer.generateOptimizedRecommendations();
        
        if (result.success) {
            res.json({
                success: true,
                system: 'HYBRID_ANALYSIS',
                timestamp: result.timestamp,
                hybridAnalysis: result.hybridAnalysis,
                correlationMatrix: result.correlationMatrix,
                entropyMetrics: result.entropyMetrics,
                systemStats: result.systemStats
            });
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('❌ [ENDPOINT] Error:', error.message);
        res.status(500).json(hybridOptimizer.generateErrorResponse(error));
    }
});

// 🚀 INICIO DEL SERVIDOR
app.listen(PORT, async () => {
    console.log(`🚀 [HYBRID OPTIMIZER] Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🧠 Sistema de Optimización Híbrida SPOT+FUTURES - ACTIVO`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    
    console.log('\n📋 Endpoints híbridos disponibles:');
    console.log('   - /health (estado del optimizador)');
    console.log('   - /api/optimized-recommendations (recomendaciones híbridas completas)');
    console.log('   - /api/top-hybrid/{N} (top N recomendaciones optimizadas)');
    console.log('   - /api/hybrid-analysis (análisis de correlación y entropía)');
    
    // Test inicial
    console.log('\n🔄 [HYBRID TEST] Probando optimización híbrida inicial...');
    try {
        const testResult = await hybridOptimizer.generateOptimizedRecommendations();
        if (testResult.success) {
            console.log(`✅ [HYBRID TEST] Sistema híbrido operativo: ${testResult.optimizedRecommendations.length} recomendaciones`);
        } else {
            console.log(`❌ [HYBRID TEST] Error inicial: ${testResult.error}`);
        }
    } catch (error) {
        console.log(`❌ [HYBRID TEST] Error de conexión: ${error.message}`);
    }
});

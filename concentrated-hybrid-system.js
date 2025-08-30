/**
 * 🎯 CONCENTRATED HYBRID SYSTEM
 * ============================
 * 
 * Sistema híbrido que se concentra EXCLUSIVAMENTE en símbolos que están 
 * presentes en AMBOS mercados (SPOT + FUTURES) de Binance.
 * 
 * DESCUBRIMIENTO CRÍTICO:
 * - SPOT: 412 símbolos activos
 * - FUTURES: 484 símbolos activos  
 * - INTERSECCIÓN: 345 símbolos híbridos (!!!)
 * - Sistema actual: Solo 56 símbolos
 * 
 * OBJETIVO: Maximizar la calidad de correlaciones concentrándonos en 
 * los símbolos TOP de la intersección SPOT-FUTURES.
 */

const express = require('express');
const axios = require('axios');
const { getSystemEntropy, getHashEntropy } = require('./system-entropy');

const app = express();
const PORT = 4850;

app.use(express.json());

// 🎯 SÍMBOLOS TOP CURADOS DE LA INTERSECCIÓN SPOT+FUTURES
const TOP_HYBRID_SYMBOLS = [
    // TIER 1: LA TRINIDAD SUPREMA
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT',
    
    // TIER 2: LA CORTE NOBLE (Alta capitalización)
    'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 
    'DOTUSDT', 'LINKUSDT', 'LTCUSDT', 'BCHUSDT', 'ATOMUSDT', 'NEARUSDT',
    
    // TIER 3: LA NOBLEZA POPULAR (DeFi y utilidad)
    'UNIUSDT', 'FILUSDT', 'TRXUSDT', 'ETCUSDT', 'XLMUSDT', 
    'ICPUSDT', 'VETUSDT', 'FTMUSDT', 'ALGOUSDT', 'SANDUSDT',
    'MANAUSDT', 'AXSUSDT', 'THETAUSDT', 'GRTUSDT', 'AAVEUSDT',
    'COMPUSDT', 'SNXUSDT', 'SUSHIUSDT',
    
    // TIER 4: LOS EMERGENTES (Nuevos L1/L2)
    'APTUSDT', 'SUIUSDT', 'ARBUSDT', 'OPUSDT', 'INJUSDT',
    'STXUSDT', 'TIAUSDT', 'ORDIUSDT',
    
    // TIER 5: MEMES Y ESPECULATIVOS (Alto potencial)
    '1000PEPEUSDT', 'WIFUSDT', 'BONKUSDT', '1000SATSUSDT', 'FLOKIUSDT',
    
    // TIER 6: ESPECIALISTAS (Gaming, NFTs, Oracles)
    'APEUSDT', 'GALAUSDT', 'IMXUSDT', 'MINAUSDT', 'FLOWUSDT',
    'CHRUSDT', 'TLMUSDT', 'YGGUSDT', 'GHSTUSDT'
];

console.log(`🎯 [CONCENTRATED] Inicializando con ${TOP_HYBRID_SYMBOLS.length} símbolos híbridos curados`);

// 🧠 MOTOR CONCENTRADO DE HÍBRIDOS
class ConcentratedHybridEngine {
    constructor() {
        this.targetSymbols = TOP_HYBRID_SYMBOLS;
        this.cachedIntersection = null;
        this.lastMarketDataFetch = 0;
        this.correlationThreshold = {
            HIGH: 0.85,    // Correlación excelente
            MEDIUM: 0.70,  // Correlación buena
            LOW: 0.55      // Correlación aceptable
        };
        
        console.log('🧠 [CONCENTRATED ENGINE] Motor híbrido concentrado inicializado');
    }
    
    async analyzeConcentratedMarket() {
        console.log('🔄 [CONCENTRATED] Iniciando análisis concentrado...');
        const startTime = Date.now();
        
        try {
            // 1. 📡 OBTENER DATOS SOLO DE SÍMBOLOS HÍBRIDOS
            const hybridData = await this.fetchHybridData();
            
            // 2. 🔍 ANÁLISIS CONCENTRADO DE CORRELACIONES
            const concentratedCorrelations = this.analyzeConcentratedCorrelations(hybridData);
            
            // 3. 🎯 RECOMENDACIONES SÚPER CONCENTRADAS
            const concentratedRecommendations = this.generateConcentratedRecommendations(
                hybridData, 
                concentratedCorrelations
            );
            
            // 4. 📊 MÉTRICAS DE CALIDAD HÍBRIDA
            const qualityMetrics = this.calculateQualityMetrics(
                concentratedRecommendations, 
                hybridData
            );
            
            const processingTime = Date.now() - startTime;
            
            const result = {
                success: true,
                system: 'CONCENTRATED_HYBRID_ENGINE',
                timestamp: Date.now(),
                processingTime,
                version: '3.0_CONCENTRATED',
                
                // 📈 DATOS DEL ANÁLISIS CONCENTRADO
                marketAnalysis: {
                    totalHybridSymbols: this.targetSymbols.length,
                    availableInSpot: Object.keys(hybridData.spotSignals || {}).length,
                    availableInFutures: Object.keys(hybridData.futuresOpportunities || {}).length,
                    perfectMatches: concentratedCorrelations.perfect.length,
                    goodMatches: concentratedCorrelations.good.length,
                    
                    // Estadísticas de cobertura
                    coverageStats: {
                        spotCoverage: (Object.keys(hybridData.spotSignals || {}).length / this.targetSymbols.length) * 100,
                        futuresCoverage: (Object.keys(hybridData.futuresOpportunities || {}).length / this.targetSymbols.length) * 100,
                        hybridCoverage: concentratedCorrelations.hybrid.length
                    }
                },
                
                // 🎯 RECOMENDACIONES CONCENTRADAS
                concentratedRecommendations: concentratedRecommendations.slice(0, 15),
                
                // 🔍 MATRIZ DE CORRELACIONES CONCENTRADAS
                correlationMatrix: concentratedCorrelations,
                
                // 📊 MÉTRICAS DE CALIDAD
                qualityMetrics: qualityMetrics,
                
                // 🏆 TOP PERFORMERS POR TIER
                tierAnalysis: this.analyzeTierPerformance(concentratedRecommendations)
            };
            
            console.log(`✅ [CONCENTRATED] Análisis completado en ${processingTime}ms`);
            console.log(`📊 [CONCENTRATED] ${result.marketAnalysis.perfectMatches + result.marketAnalysis.goodMatches} correlaciones de calidad encontradas`);
            
            return result;
            
        } catch (error) {
            console.error('❌ [CONCENTRATED] Error:', error.message);
            return this.generateErrorResponse(error);
        }
    }
    
    async fetchHybridData() {
        console.log('📡 [CONCENTRATED] Obteniendo datos de símbolos híbridos curados...');
        
        const data = {
            spotSignals: {},
            futuresOpportunities: {},
            errors: []
        };
        
        try {
            // Obtener señales SPOT del sistema core
            const spotResponse = await axios.get('http://localhost:4602/api/raw-signals', {
                timeout: 10000
            });
            
            if (spotResponse.data.success) {
                // Filtrar solo los símbolos de nuestro target
                const allSpotSignals = spotResponse.data.signals;
                for (const symbol of this.targetSymbols) {
                    if (allSpotSignals[symbol]) {
                        data.spotSignals[symbol] = allSpotSignals[symbol];
                    }
                }
                console.log(`✅ [CONCENTRATED] ${Object.keys(data.spotSignals).length} señales SPOT híbridas obtenidas`);
            }
        } catch (error) {
            data.errors.push({ source: 'spot-signals', error: error.message });
        }
        
        try {
            // Obtener oportunidades FUTURES del sistema core
            const futuresResponse = await axios.get('http://localhost:4602/api/raw-opportunities', {
                timeout: 10000
            });
            
            if (futuresResponse.data.success) {
                // Filtrar solo los símbolos de nuestro target
                const allFuturesOpportunities = futuresResponse.data.opportunities;
                for (const symbol of this.targetSymbols) {
                    if (allFuturesOpportunities[symbol]) {
                        data.futuresOpportunities[symbol] = allFuturesOpportunities[symbol];
                    }
                }
                console.log(`✅ [CONCENTRATED] ${Object.keys(data.futuresOpportunities).length} oportunidades FUTURES híbridas obtenidas`);
            }
        } catch (error) {
            data.errors.push({ source: 'futures-opportunities', error: error.message });
        }
        
        return data;
    }
    
    analyzeConcentratedCorrelations(hybridData) {
        console.log('🔍 [CONCENTRATED] Analizando correlaciones en símbolos híbridos...');
        
        const correlations = {
            perfect: [],   // Correlación perfecta (>85%)
            good: [],      // Correlación buena (70-85%)
            medium: [],    // Correlación media (55-70%)
            conflicts: [], // Direcciones opuestas
            hybrid: []     // Todos los símbolos con datos híbridos
        };
        
        const spotSymbols = Object.keys(hybridData.spotSignals || {});
        const futuresSymbols = Object.keys(hybridData.futuresOpportunities || {});
        
        // Encontrar símbolos híbridos (presentes en ambos)
        for (const symbol of this.targetSymbols) {
            if (spotSymbols.includes(symbol) && futuresSymbols.includes(symbol)) {
                correlations.hybrid.push(symbol);
                
                const spotSignal = hybridData.spotSignals[symbol];
                const futuresOpp = hybridData.futuresOpportunities[symbol];
                
                if (spotSignal && futuresOpp) {
                    const spotDirection = spotSignal.type;
                    const futuresDirection = futuresOpp.type || 'UNKNOWN';
                    
                    // Calcular confianza combinada híbrida
                    const spotConfidence = spotSignal.confidence || 0;
                    const futuresConfidence = futuresOpp.confidence || 0;
                    
                    // Peso mayor a FUTURES para ejecución, menor a SPOT para información
                    const hybridConfidence = (spotConfidence * 0.25) + (futuresConfidence * 0.75);
                    
                    const correlation = {
                        symbol,
                        spotDirection,
                        futuresDirection,
                        spotConfidence,
                        futuresConfidence,
                        hybridConfidence,
                        spotStrength: spotSignal.strength || 0,
                        futuresLeverage: futuresOpp.leverage || 1,
                        entropyFactor: ((spotSignal.entropy_factor || 0) + (futuresOpp.entropy_factor || 0)) / 2,
                        tier: this.getSymbolTier(symbol)
                    };
                    
                    // Clasificar por calidad de correlación
                    if (spotDirection === futuresDirection && hybridConfidence >= this.correlationThreshold.HIGH) {
                        correlations.perfect.push(correlation);
                    } else if (spotDirection === futuresDirection && hybridConfidence >= this.correlationThreshold.MEDIUM) {
                        correlations.good.push(correlation);
                    } else if (spotDirection === futuresDirection && hybridConfidence >= this.correlationThreshold.LOW) {
                        correlations.medium.push(correlation);
                    } else if (spotDirection !== futuresDirection && spotDirection !== 'UNKNOWN' && futuresDirection !== 'UNKNOWN') {
                        correlations.conflicts.push(correlation);
                    }
                }
            }
        }
        
        console.log(`🔍 [CORRELATIONS] Perfectas: ${correlations.perfect.length}, Buenas: ${correlations.good.length}, Medias: ${correlations.medium.length}`);
        
        return correlations;
    }
    
    generateConcentratedRecommendations(hybridData, correlations) {
        console.log('🎯 [CONCENTRATED] Generando recomendaciones híbridas concentradas...');
        
        const recommendations = [];
        
        // 1. RECOMENDACIONES PERFECTAS (máxima prioridad)
        for (const correlation of correlations.perfect) {
            const rec = this.createPremiumHybridRecommendation(correlation, 'PERFECT');
            if (rec) recommendations.push(rec);
        }
        
        // 2. RECOMENDACIONES BUENAS
        for (const correlation of correlations.good) {
            const rec = this.createPremiumHybridRecommendation(correlation, 'GOOD');
            if (rec) recommendations.push(rec);
        }
        
        // 3. RECOMENDACIONES MEDIAS (solo si son de TIER alto)
        for (const correlation of correlations.medium) {
            if (correlation.tier <= 3) { // Solo TIER 1, 2, 3
                const rec = this.createPremiumHybridRecommendation(correlation, 'MEDIUM');
                if (rec) recommendations.push(rec);
            }
        }
        
        // 4. OPORTUNIDADES SOLO FUTURES DE ALTA CALIDAD
        for (const [symbol, opportunity] of Object.entries(hybridData.futuresOpportunities || {})) {
            if (this.targetSymbols.includes(symbol) && 
                !correlations.hybrid.includes(symbol) && 
                opportunity.confidence >= 0.80) {
                
                const rec = this.createFuturesOnlyRecommendation(symbol, opportunity);
                if (rec) recommendations.push(rec);
            }
        }
        
        // Ordenar por score híbrido
        recommendations.sort((a, b) => b.hybridScore - a.hybridScore);
        
        console.log(`🎯 [CONCENTRATED] ${recommendations.length} recomendaciones híbridas concentradas generadas`);
        return recommendations;
    }
    
    createPremiumHybridRecommendation(correlation, quality) {
        const { symbol, spotDirection, futuresDirection, hybridConfidence, spotStrength, futuresLeverage, entropyFactor, tier } = correlation;
        
        // Calcular multiplicadores de calidad
        const qualityMultipliers = {
            'PERFECT': 1.5,
            'GOOD': 1.25,
            'MEDIUM': 1.1
        };
        
        const qualityMultiplier = qualityMultipliers[quality] || 1.0;
        
        // Ajustar leverage basado en tier y calidad
        let adjustedLeverage = futuresLeverage * qualityMultiplier;
        
        // Bonus por tier (tiers más altos = más conservadores)
        const tierMultipliers = { 1: 0.8, 2: 0.9, 3: 1.0, 4: 1.1, 5: 1.2, 6: 1.3 };
        adjustedLeverage *= (tierMultipliers[tier] || 1.0);
        
        // Calcular score híbrido avanzado
        const hybridScore = (
            hybridConfidence * 0.35 +
            (spotStrength / 10) * 0.15 +
            (Math.min(adjustedLeverage / 15, 1)) * 0.25 +
            entropyFactor * 0.15 +
            (qualityMultiplier - 1) * 0.10  // Bonus por calidad
        );
        
        // Determinar prioridad basada en calidad y tier
        let priority = 'MEDIUM';
        if (quality === 'PERFECT' && tier <= 2) priority = 'CRITICAL';
        else if (quality === 'PERFECT' || (quality === 'GOOD' && tier <= 2)) priority = 'HIGH';
        
        return {
            symbol,
            market: 'PREMIUM_HYBRID',
            action: futuresDirection,
            confidence: hybridConfidence,
            leverage: adjustedLeverage,
            priority,
            reasoning: `${quality} híbrido TIER${tier}: SPOT ${spotDirection} + FUTURES ${futuresDirection} (${adjustedLeverage.toFixed(1)}x)`,
            hybridMetrics: {
                correlationQuality: quality,
                tier: tier,
                spotConfidence: correlation.spotConfidence,
                futuresConfidence: correlation.futuresConfidence,
                hybridConfidence: hybridConfidence,
                spotStrength: spotStrength,
                entropyFactor: entropyFactor,
                hybridScore: hybridScore,
                qualityMultiplier: qualityMultiplier
            },
            timestamp: Date.now(),
            dataSource: 'CONCENTRATED_HYBRID_PREMIUM'
        };
    }
    
    createFuturesOnlyRecommendation(symbol, opportunity) {
        return {
            symbol,
            market: 'FUTURES_PREMIUM',
            action: opportunity.type || 'UNKNOWN',
            confidence: opportunity.confidence || 0,
            leverage: opportunity.leverage || 1,
            priority: 'LOW',
            reasoning: `FUTURES premium: ${opportunity.type} ${(opportunity.leverage || 1).toFixed(1)}x`,
            hybridMetrics: {
                correlationQuality: 'FUTURES_ONLY',
                tier: this.getSymbolTier(symbol),
                spotConfidence: 0,
                futuresConfidence: opportunity.confidence || 0,
                hybridConfidence: opportunity.confidence || 0,
                entropyFactor: opportunity.entropy_factor || 0,
                hybridScore: (opportunity.confidence || 0) * 0.7
            },
            timestamp: Date.now(),
            dataSource: 'CONCENTRATED_FUTURES_PREMIUM'
        };
    }
    
    getSymbolTier(symbol) {
        // TIER 1: Trinity Supreme
        if (['BTCUSDT', 'ETHUSDT', 'BNBUSDT'].includes(symbol)) return 1;
        
        // TIER 2: Court Noble  
        if (['SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 
             'LINKUSDT', 'LTCUSDT', 'BCHUSDT', 'ATOMUSDT', 'NEARUSDT'].includes(symbol)) return 2;
        
        // TIER 3: Popular Nobility
        if (['UNIUSDT', 'FILUSDT', 'TRXUSDT', 'ETCUSDT', 'XLMUSDT', 'ICPUSDT', 
             'VETUSDT', 'FTMUSDT', 'ALGOUSDT', 'SANDUSDT', 'MANAUSDT', 'AXSUSDT',
             'THETAUSDT', 'GRTUSDT', 'AAVEUSDT', 'COMPUSDT', 'SNXUSDT', 'SUSHIUSDT'].includes(symbol)) return 3;
        
        // TIER 4: Emergents
        if (['APTUSDT', 'SUIUSDT', 'ARBUSDT', 'OPUSDT', 'INJUSDT', 'STXUSDT', 'TIAUSDT', 'ORDIUSDT'].includes(symbol)) return 4;
        
        // TIER 5: Memes  
        if (['1000PEPEUSDT', 'WIFUSDT', 'BONKUSDT', '1000SATSUSDT', 'FLOKIUSDT'].includes(symbol)) return 5;
        
        // TIER 6: Specialists
        return 6;
    }
    
    calculateQualityMetrics(recommendations, hybridData) {
        const metrics = {
            dataQuality: {
                spotDataPoints: Object.keys(hybridData.spotSignals || {}).length,
                futuresDataPoints: Object.keys(hybridData.futuresOpportunities || {}).length,
                hybridDataPoints: recommendations.filter(r => r.market === 'PREMIUM_HYBRID').length,
                qualityScore: 0
            },
            
            recommendationQuality: {
                perfect: recommendations.filter(r => r.hybridMetrics?.correlationQuality === 'PERFECT').length,
                good: recommendations.filter(r => r.hybridMetrics?.correlationQuality === 'GOOD').length,
                medium: recommendations.filter(r => r.hybridMetrics?.correlationQuality === 'MEDIUM').length,
                avgHybridScore: 0,
                avgConfidence: 0
            },
            
            tierDistribution: {
                tier1: recommendations.filter(r => r.hybridMetrics?.tier === 1).length,
                tier2: recommendations.filter(r => r.hybridMetrics?.tier === 2).length,
                tier3: recommendations.filter(r => r.hybridMetrics?.tier === 3).length,
                tier4: recommendations.filter(r => r.hybridMetrics?.tier === 4).length,
                tier5: recommendations.filter(r => r.hybridMetrics?.tier === 5).length,
                tier6: recommendations.filter(r => r.hybridMetrics?.tier === 6).length
            }
        };
        
        // Calcular promedios
        if (recommendations.length > 0) {
            metrics.recommendationQuality.avgHybridScore = 
                recommendations.reduce((sum, r) => sum + (r.hybridMetrics?.hybridScore || 0), 0) / recommendations.length;
                
            metrics.recommendationQuality.avgConfidence = 
                recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length;
        }
        
        // Calcular score de calidad general
        const totalDataPoints = metrics.dataQuality.spotDataPoints + metrics.dataQuality.futuresDataPoints;
        metrics.dataQuality.qualityScore = Math.min(
            (totalDataPoints / (this.targetSymbols.length * 2)) * 100, 
            100
        );
        
        return metrics;
    }
    
    analyzeTierPerformance(recommendations) {
        const tierPerformance = {};
        
        for (let tier = 1; tier <= 6; tier++) {
            const tierRecs = recommendations.filter(r => r.hybridMetrics?.tier === tier);
            
            tierPerformance[`tier${tier}`] = {
                count: tierRecs.length,
                avgScore: tierRecs.length > 0 ? 
                    tierRecs.reduce((sum, r) => sum + (r.hybridMetrics?.hybridScore || 0), 0) / tierRecs.length : 0,
                avgConfidence: tierRecs.length > 0 ?
                    tierRecs.reduce((sum, r) => sum + r.confidence, 0) / tierRecs.length : 0,
                topSymbol: tierRecs.length > 0 ? tierRecs[0].symbol : null
            };
        }
        
        return tierPerformance;
    }
    
    generateErrorResponse(error) {
        return {
            success: false,
            system: 'CONCENTRATED_HYBRID_ENGINE',
            error: error.message,
            timestamp: Date.now(),
            fallback: 'Sistema híbrido concentrado no disponible'
        };
    }
}

// Instancia global del motor concentrado
const concentratedEngine = new ConcentratedHybridEngine();

// 🚀 ENDPOINTS DEL SISTEMA CONCENTRADO

app.get('/health', (req, res) => {
    res.json({
        success: true,
        system: 'CONCENTRATED_HYBRID_ENGINE',
        status: 'ACTIVE',
        version: '3.0_CONCENTRATED',
        targetSymbols: concentratedEngine.targetSymbols.length,
        timestamp: Date.now()
    });
});

app.get('/api/concentrated-analysis', async (req, res) => {
    try {
        const result = await concentratedEngine.analyzeConcentratedMarket();
        res.json(result);
    } catch (error) {
        console.error('❌ [ENDPOINT] Error:', error.message);
        res.status(500).json(concentratedEngine.generateErrorResponse(error));
    }
});

app.get('/api/concentrated-top/:count', async (req, res) => {
    try {
        const count = parseInt(req.params.count) || 10;
        const result = await concentratedEngine.analyzeConcentratedMarket();
        
        if (result.success) {
            res.json({
                ...result,
                concentratedRecommendations: result.concentratedRecommendations.slice(0, count)
            });
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json(concentratedEngine.generateErrorResponse(error));
    }
});

app.get('/api/tier-analysis', async (req, res) => {
    try {
        const result = await concentratedEngine.analyzeConcentratedMarket();
        
        if (result.success) {
            res.json({
                success: true,
                system: 'CONCENTRATED_TIER_ANALYSIS',
                timestamp: result.timestamp,
                tierAnalysis: result.tierAnalysis,
                qualityMetrics: result.qualityMetrics
            });
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json(concentratedEngine.generateErrorResponse(error));
    }
});

// 🚀 INICIO DEL SERVIDOR
app.listen(PORT, async () => {
    console.log(`🚀 [CONCENTRATED HYBRID] Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🎯 Sistema Concentrado en ${TOP_HYBRID_SYMBOLS.length} Símbolos Híbridos Premium - ACTIVO`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    
    console.log('\n📋 Endpoints concentrados disponibles:');
    console.log('   - /health (estado del sistema concentrado)');
    console.log('   - /api/concentrated-analysis (análisis híbrido completo)');
    console.log('   - /api/concentrated-top/{N} (top N recomendaciones concentradas)');
    console.log('   - /api/tier-analysis (análisis por tiers)');
    
    console.log(`\n🎯 [SÍMBOLOS TARGET] Los ${TOP_HYBRID_SYMBOLS.length} símbolos híbridos curados:`);
    console.log(`   TIER 1: ${TOP_HYBRID_SYMBOLS.slice(0, 3).join(', ')}`);
    console.log(`   TIER 2: ${TOP_HYBRID_SYMBOLS.slice(3, 14).join(', ')}`);
    console.log(`   TIER 3: ${TOP_HYBRID_SYMBOLS.slice(14, 32).join(', ')}`);
    console.log(`   Y más...`);
    
    // Test inicial
    console.log('\n🔄 [CONCENTRATED TEST] Probando sistema concentrado...');
    try {
        const testResult = await concentratedEngine.analyzeConcentratedMarket();
        if (testResult.success) {
            console.log(`✅ [CONCENTRATED TEST] Sistema operativo: ${testResult.concentratedRecommendations.length} recomendaciones premium`);
            console.log(`📊 [CONCENTRATED] Correlaciones: ${testResult.correlationMatrix.perfect.length} perfectas, ${testResult.correlationMatrix.good.length} buenas`);
        } else {
            console.log(`❌ [CONCENTRATED TEST] Error: ${testResult.error}`);
        }
    } catch (error) {
        console.log(`❌ [CONCENTRATED TEST] Error de conexión: ${error.message}`);
    }
});

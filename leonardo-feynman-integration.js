/**
 * LEONARDO-FEYNMAN INTEGRATION WITH QBTC
 * ======================================
 * 
 * Integración del sistema Leonardo-Feynman con datos reales de Binance
 * y el sistema QBTC existente
 */

const EventEmitter = require('events');
const axios = require('axios');
const { startLeonardoFeynmanDataIngestion } = require('./leonardo-feynman-data-ingestion');

// CONSTANTES FÍSICAS REALES (Feynman)
const PHYSICAL_CONSTANTS = {
    PHI: (1 + Math.sqrt(5)) / 2,           // Golden ratio real
    E: Math.E,                              // Euler's number
    PI: Math.PI,                            // Pi
    
    // Parámetros de sistema verificables
    MIN_SAMPLE_SIZE: 30,                    // Mínimo estadístico válido
    CONFIDENCE_THRESHOLD: 0.3,              // Umbral de confianza más realista (30%)
    UPDATE_FREQUENCY: 5000,                 // 5 segundos - medible
    
    // Límites psicológicos observables
    EXTREME_FEAR_THRESHOLD: -0.5,           // Funding rate extremo
    EXTREME_GREED_THRESHOLD: 1.0,           // Funding rate extremo
    VOLUME_SPIKE_MULTIPLIER: 2.0            // 2x volumen promedio
};

/**
 * DETECTOR DE ESTADOS PSICOLÓGICOS CON DATOS REALES
 */
class RealDataPsychologicalDetector {
    constructor() {
        this.stateHistory = [];
        this.currentState = 'NEUTRAL';
        this.confidence = 0.5;
        
        this.stateIndicators = {
            EXTREME_FEAR: {
                description: "Capitulación observable",
                measurableSignals: [
                    { metric: 'fundingRate', threshold: -0.3, weight: 0.3 },
                    { metric: 'volumeSpike', threshold: 2.0, weight: 0.2 },
                    { metric: 'priceRecovery', threshold: 0.02, weight: 0.2 },
                    { metric: 'openInterest', threshold: 0.8, weight: 0.3 }
                ],
                psychologyNote: "When others sell in panic, opportunity emerges"
            },
            
            EXTREME_GREED: {
                description: "Euforia observable",
                measurableSignals: [
                    { metric: 'fundingRate', threshold: 0.8, weight: 0.3 },
                    { metric: 'volumeDecline', threshold: 0.5, weight: 0.2 },
                    { metric: 'priceSlowing', threshold: -0.02, weight: 0.2 },
                    { metric: 'openInterest', threshold: 1.2, weight: 0.3 }
                ],
                psychologyNote: "When others buy in euphoria, caution is warranted"
            },
            
            ACCUMULATION: {
                description: "Aburrimiento observable",
                measurableSignals: [
                    { metric: 'volatility', threshold: 0.02, weight: 0.4 },
                    { metric: 'volume', threshold: 0.7, weight: 0.3 },
                    { metric: 'fundingRate', threshold: 0.1, weight: 0.3 }
                ],
                psychologyNote: "When others ignore, smart money accumulates"
            }
        };
    }
    
    async analyzeCurrentState(symbol, enrichedMarketData) {
        // Usar datos enriquecidos del sistema de ingesta
        const stateScores = {};
        
        // Calcular score para cada estado basado en métricas verificables
        for (const [stateName, stateConfig] of Object.entries(this.stateIndicators)) {
            let score = 0;
            let totalWeight = 0;
            
            for (const signal of stateConfig.measurableSignals) {
                const metricValue = this.extractEnrichedMetric(enrichedMarketData, signal.metric);
                const signalScore = this.evaluateSignal(metricValue, signal.threshold, signal.metric);
                
                score += signalScore * signal.weight;
                totalWeight += signal.weight;
            }
            
            stateScores[stateName] = totalWeight > 0 ? score / totalWeight : 0;
        }
        
        // Determinar estado dominante
        const dominantState = Object.keys(stateScores)
            .reduce((a, b) => stateScores[a] > stateScores[b] ? a : b);
        
        const confidence = stateScores[dominantState];
        
        // Solo cambiar estado si confianza > umbral
        if (confidence > PHYSICAL_CONSTANTS.CONFIDENCE_THRESHOLD) {
            this.currentState = dominantState;
            this.confidence = confidence;
        }
        
        // Almacenar en historial para verificación
        this.stateHistory.push({
            timestamp: Date.now(),
            symbol: symbol,
            state: this.currentState,
            confidence: this.confidence,
            scores: stateScores,
            marketData: this.compressMarketData(enrichedMarketData)
        });
        
        // Mantener solo últimos 100 estados para análisis
        if (this.stateHistory.length > 100) {
            this.stateHistory.shift();
        }
        
        return {
            state: this.currentState,
            confidence: this.confidence,
            scores: stateScores,
            psychology: this.stateIndicators[this.currentState]?.psychologyNote || "Neutral market psychology",
            enrichedData: enrichedMarketData
        };
    }
    
    extractEnrichedMetric(enrichedData, metricName) {
        switch (metricName) {
            case 'fundingRate':
                return enrichedData.fundingRate || 0;
            case 'volumeSpike':
                return enrichedData.volumeSpike || 1;
            case 'priceRecovery':
                return enrichedData.priceMomentum?.momentum || 0;
            case 'openInterest':
                return enrichedData.openInterest || 0;
            case 'volumeDecline':
                return 1 - (enrichedData.volumeSpike || 1);
            case 'priceSlowing':
                return enrichedData.priceMomentum?.momentum || 0;
            case 'volatility':
                return enrichedData.volatilityIndex || 0;
            case 'volume':
                return enrichedData.volumeSpike || 1;
            default:
                return 0.5;
        }
    }
    
    evaluateSignal(value, threshold, metricName) {
        switch (metricName) {
            case 'fundingRate':
                // Para funding rate negativo (miedo), queremos detectar cuando es muy negativo
                if (value < threshold) {
                    return Math.min(1, Math.abs(value / threshold));
                }
                return 0;
                
            case 'volumeSpike':
                // Para volumen alto, queremos detectar cuando es significativamente mayor
                if (value > threshold) {
                    return Math.min(1, (value / threshold - 1) * 0.5);
                }
                return 0;
                
            case 'volatility':
                // Para volatilidad baja (acumulación), queremos detectar cuando es menor al umbral
                if (value < threshold) {
                    return Math.min(1, (threshold - value) / threshold);
                }
                return 0;
                
            case 'openInterest':
                // Para open interest bajo (miedo), queremos detectar cuando es menor al umbral
                if (value < threshold) {
                    return Math.min(1, (threshold - value) / threshold);
                }
                return 0;
                
            case 'volumeDecline':
                // Para declive de volumen (euforia), queremos detectar cuando el volumen es bajo
                if (value > threshold) {
                    return Math.min(1, value);
                }
                return 0;
                
            case 'priceSlowing':
                // Para desaceleración de precio (euforia), queremos detectar momentum negativo
                if (value < threshold) {
                    return Math.min(1, Math.abs(value / threshold));
                }
                return 0;
                
            case 'volume':
                // Para volumen bajo (acumulación), queremos detectar cuando es menor al umbral
                if (value < threshold) {
                    return Math.min(1, (threshold - value) / threshold);
                }
                return 0;
                
            case 'priceRecovery':
                // Para recuperación de precio (miedo), queremos detectar momentum positivo
                if (value > threshold) {
                    return Math.min(1, value / threshold);
                }
                return 0;
                
            default:
                return Math.abs(value - 0.5) * 2;
        }
    }
    
    compressMarketData(marketData) {
        return {
            price: marketData.price,
            change: marketData.priceChangePercent,
            volume: marketData.volume,
            fundingRate: marketData.fundingRate,
            fearGreedIndex: marketData.fearGreedIndex,
            marketSentiment: marketData.marketSentiment,
            volatilityIndex: marketData.volatilityIndex,
            timestamp: marketData.timestamp
        };
    }
}

/**
 * SISTEMA PRINCIPAL INTEGRADO CON DATA INGESTION
 */
class LeonardoFeynmanQBTCIntegration extends EventEmitter {
    constructor() {
        super();
        
        this.psychologyDetector = new RealDataPsychologicalDetector();
        this.marketHistory = new Map(); // Por símbolo
        this.dataIngestion = null;
        
        this.systemState = {
            currentPsychology: 'NEUTRAL',
            confidence: 0.5,
            lastUpdate: null,
            analyzedSymbols: 0
        };
        
        this.isRunning = false;
    }
    
    async initialize() {
        try {
            console.log(' [LEONARDO-FEYNMAN] Inicializando sistema con data ingestion...');
            
            // Inicializar sistema de ingesta de datos
            this.dataIngestion = await startLeonardoFeynmanDataIngestion();
            
            // Configurar eventos de datos actualizados
            this.dataIngestion.on('dataUpdated', (updateInfo) => {
                console.log(`[DATA] [LEONARDO-FEYNMAN] Datos actualizados: ${updateInfo.symbolCount} símbolos`);
                this.emit('dataUpdated', updateInfo);
            });
            
            // Iniciar ingesta de datos
            await this.dataIngestion.start();
            
            console.log('[OK] [LEONARDO-FEYNMAN] Sistema inicializado con data ingestion');
            
        } catch (error) {
            console.error('[ERROR] [LEONARDO-FEYNMAN] Error inicializando data ingestion:', error.message);
            throw error;
        }
    }
    
    async analyzeSymbol(symbol, marketData) {
        try {
            // Obtener datos enriquecidos del sistema de ingesta
            let enrichedData = this.dataIngestion.getData(symbol);
            
            if (!enrichedData) {
                // Si no hay datos enriquecidos, usar los datos básicos
                enrichedData = marketData;
                console.warn(`[WARNING] [LEONARDO-FEYNMAN] No hay datos enriquecidos para ${symbol}, usando datos básicos`);
            }
            
            // Analizar estado psicológico con datos enriquecidos
            const psychologyState = await this.psychologyDetector.analyzeCurrentState(symbol, enrichedData);
            
            // Generar recomendación basada en psicología
            const recommendation = this.generateRecommendation(psychologyState, symbol);
            
            // Almacenar en historial
            if (!this.marketHistory.has(symbol)) {
                this.marketHistory.set(symbol, []);
            }
            
            const symbolHistory = this.marketHistory.get(symbol);
            symbolHistory.push({
                timestamp: Date.now(),
                psychologyState: psychologyState,
                recommendation: recommendation,
                marketData: enrichedData
            });
            
            // Mantener solo últimos 50 entradas por símbolo
            if (symbolHistory.length > 50) {
                symbolHistory.shift();
            }
            
            return {
                symbol: symbol,
                psychology: psychologyState.state,
                confidence: psychologyState.confidence,
                recommendation: recommendation,
                reasoning: psychologyState.psychology,
                enrichedData: enrichedData,
                dataQuality: enrichedData.dataQuality || 'BASIC'
            };
            
        } catch (error) {
            console.error(`[ERROR] [LEONARDO-FEYNMAN] Error analizando ${symbol}:`, error.message);
            return {
                symbol: symbol,
                psychology: 'NEUTRAL',
                confidence: 0,
                recommendation: 'HOLD',
                reasoning: 'Error en análisis',
                error: error.message
            };
        }
    }
    
    generateRecommendation(psychologyState, symbol) {
        const { state, confidence } = psychologyState;
        
        if (confidence < PHYSICAL_CONSTANTS.CONFIDENCE_THRESHOLD) {
            return {
                action: 'HOLD',
                confidence: confidence,
                reasoning: 'Confianza insuficiente para acción'
            };
        }
        
        switch (state) {
            case 'EXTREME_FEAR':
                return {
                    action: 'LONG',
                    confidence: confidence,
                    reasoning: 'Miedo extremo detectado - oportunidad contraria',
                    entryPrice: psychologyState.enrichedData.price,
                    stopLoss: psychologyState.enrichedData.price * 0.95,
                    takeProfit: psychologyState.enrichedData.price * 1.05
                };
                
            case 'EXTREME_GREED':
                return {
                    action: 'SHORT',
                    confidence: confidence,
                    reasoning: 'Euforia extrema detectada - distribución probable',
                    entryPrice: psychologyState.enrichedData.price,
                    stopLoss: psychologyState.enrichedData.price * 1.05,
                    takeProfit: psychologyState.enrichedData.price * 0.95
                };
                
            case 'ACCUMULATION':
                return {
                    action: 'LONG',
                    confidence: confidence * 0.8, // Menor confianza
                    reasoning: 'Fase de acumulación - acumulación inteligente',
                    entryPrice: psychologyState.enrichedData.price,
                    stopLoss: psychologyState.enrichedData.price * 0.98,
                    takeProfit: psychologyState.enrichedData.price * 1.03
                };
                
            default:
                return {
                    action: 'HOLD',
                    confidence: confidence,
                    reasoning: 'Estado neutral - esperar mejor oportunidad'
                };
        }
    }
    
    async analyzeAllSymbols(symbolsList) {
        console.log(` [LEONARDO-FEYNMAN] Analizando ${symbolsList.length} símbolos con data ingestion...`);
        
        if (!this.dataIngestion) {
            throw new Error('Sistema de data ingestion no inicializado');
        }
        
        const results = [];
        let processedCount = 0;
        
        for (const symbol of symbolsList) {
            try {
                // Obtener datos enriquecidos del sistema de ingesta
                const enrichedData = this.dataIngestion.getData(symbol);
                
                if (enrichedData) {
                    const analysis = await this.analyzeSymbol(symbol, enrichedData);
                    results.push(analysis);
                    
                    processedCount++;
                    if (processedCount % 10 === 0) {
                        console.log(`[DATA] [LEONARDO-FEYNMAN] Procesados ${processedCount}/${symbolsList.length} símbolos`);
                    }
                } else {
                    console.warn(`[WARNING] [LEONARDO-FEYNMAN] No hay datos enriquecidos para ${symbol}`);
                }
                
                // Rate limiting para evitar sobrecarga
                await new Promise(resolve => setTimeout(resolve, 50));
                
            } catch (error) {
                console.error(`[ERROR] [LEONARDO-FEYNMAN] Error procesando ${symbol}:`, error.message);
            }
        }
        
        // Filtrar solo recomendaciones con confianza alta
        const highConfidenceResults = results.filter(r => r.confidence > 0.4); // Reducir umbral a 40%
        
        console.log(`[OK] [LEONARDO-FEYNMAN] Análisis completado: ${highConfidenceResults.length} recomendaciones de alta confianza`);
        
        // Mostrar detalles de filtrado para debugging
        const confidenceDistribution = {
            '0.0-0.2': results.filter(r => r.confidence >= 0.0 && r.confidence < 0.2).length,
            '0.2-0.4': results.filter(r => r.confidence >= 0.2 && r.confidence < 0.4).length,
            '0.4-0.6': results.filter(r => r.confidence >= 0.4 && r.confidence < 0.6).length,
            '0.6-0.8': results.filter(r => r.confidence >= 0.6 && r.confidence < 0.8).length,
            '0.8-1.0': results.filter(r => r.confidence >= 0.8 && r.confidence <= 1.0).length
        };
        
        console.log(`[DATA] [LEONARDO-FEYNMAN] Distribución de confianza:`, confidenceDistribution);
        
        return {
            totalAnalyzed: results.length,
            highConfidenceRecommendations: highConfidenceResults,
            psychologyDistribution: this.calculatePsychologyDistribution(results),
            confidenceDistribution: confidenceDistribution,
            systemHealth: this.validateSystemHealth(),
            dataSource: 'ENRICHED_DATA_INGESTION'
        };
    }
    
    calculatePsychologyDistribution(results) {
        const distribution = {
            EXTREME_FEAR: 0,
            EXTREME_GREED: 0,
            ACCUMULATION: 0,
            NEUTRAL: 0
        };
        
        results.forEach(result => {
            distribution[result.psychology] = (distribution[result.psychology] || 0) + 1;
        });
        
        return distribution;
    }
    
    validateSystemHealth() {
        const totalHistory = Array.from(this.marketHistory.values())
            .reduce((sum, history) => sum + history.length, 0);
        
        const dataQuality = this.dataIngestion ? this.dataIngestion.getDataQuality() : null;
        
        return {
            totalSymbols: this.marketHistory.size,
            totalDataPoints: totalHistory,
            averageDataPerSymbol: totalHistory / Math.max(1, this.marketHistory.size),
            health: totalHistory > 100 ? 'EXCELLENT' : totalHistory > 50 ? 'GOOD' : 'NEEDS_DATA',
            dataIngestionHealth: dataQuality?.isRunning ? 'ACTIVE' : 'INACTIVE',
            cacheSize: dataQuality?.cacheSize || 0
        };
    }
    
    getSystemStatus() {
        return {
            ...this.systemState,
            health: this.validateSystemHealth(),
            psychologyDetector: {
                statesAnalyzed: this.psychologyDetector.stateHistory.length,
                currentState: this.psychologyDetector.currentState,
                confidence: this.psychologyDetector.confidence
            },
            dataIngestion: this.dataIngestion ? this.dataIngestion.getDataQuality() : null
        };
    }
    
    async stop() {
        if (this.dataIngestion) {
            await this.dataIngestion.stop();
        }
        this.isRunning = false;
        console.log(' [LEONARDO-FEYNMAN] Sistema detenido');
    }
}

// Función de inicio integrada
async function startLeonardoFeynmanQBTC() {
    try {
        const system = new LeonardoFeynmanQBTCIntegration();
        
        console.log(' Leonardo-Feynman QBTC Integration initialized');
        console.log('- Empirical psychology detection with enriched data');
        console.log('- Scientific validation of market patterns');
        console.log('- Integration with QBTC data ingestion system');
        console.log('- Verifiable recommendations only');
        
        // Inicializar con data ingestion
        await system.initialize();
        
        return system;
        
    } catch (error) {
        console.error('[ERROR] Error starting Leonardo-Feynman QBTC integration:', error);
        throw error;
    }
}

module.exports = {
    LeonardoFeynmanQBTCIntegration,
    RealDataPsychologicalDetector,
    startLeonardoFeynmanQBTC,
    PHYSICAL_CONSTANTS
};

console.log(`
 LEONARDO-FEYNMAN QBTC INTEGRATION LOADED

Integration Features:
- Real Binance data integration with ingestion system
- Psychological state detection with enriched metrics
- Verifiable pattern recognition
- QBTC system compatibility
- Empirical validation approach

"Simplicity is the ultimate sophistication." - Leonardo da Vinci
"Nature uses only the longest threads to weave her patterns." - Richard Feynman
`);

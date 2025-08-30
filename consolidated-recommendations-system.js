// ============================================================================
// SISTEMA DE CONSOLIDACIÓN DE RECOMENDACIONES - QBTC V6
// ============================================================================

const axios = require('axios');

// Agregar Leonardo-Feynman como fuente adicional
const { startLeonardoFeynmanQBTC } = require('./leonardo-feynman-integration');

class ConsolidatedRecommendationsSystem {
    constructor() {
        this.sources = [
            'ENHANCED_OPPORTUNITIES',
            'QUANTUM_RECOMMENDATIONS', 
            'QUANTUM_BRAIN',
            'QUANTUM_ANALYSIS',
            'LEONARDO_FEYNMAN' // Nueva fuente
        ];
        
        this.leonardoFeynmanSystem = null;
        this.initializeLeonardoFeynman();
    }
    
    async initializeLeonardoFeynman() {
        try {
            this.leonardoFeynmanSystem = await startLeonardoFeynmanQBTC();
            console.log(' [CONSOLIDATION] Leonardo-Feynman system initialized');
        } catch (error) {
            console.error('[ERROR] [CONSOLIDATION] Error initializing Leonardo-Feynman:', error.message);
        }
    }

    async executeConsolidation() {
        console.log(`[RELOAD] [CONSOLIDATION] Iniciando consolidación de recomendaciones...`);
        
        try {
            // PASO 1: Recolectar datos de todas las fuentes
            const sourcesData = await this.collectAllSourcesData();
            
            // PASO 2: Consolidar y deduplicar
            const consolidatedData = await this.consolidateRecommendations(sourcesData);
            
            // PASO 3: Optimizar y ranking
            const finalResults = await this.optimizeAndRank(consolidatedData);
            
            console.log(`[OK] [CONSOLIDATION] Consolidación completada: ${finalResults.recommendations.length} recomendaciones`);
            
            return {
                success: true,
                data: finalResults,
                timestamp: Date.now()
            };
            
        } catch (error) {
            console.error(`[ERROR] [CONSOLIDATION] Error:`, error);
            return {
                success: false,
                error: error.message,
                timestamp: Date.now()
            };
        }
    }

    async collectAllSourcesData() {
        const sourcesData = {};
        
        for (const source of this.sources) {
            try {
                console.log(` [CONSOLIDATION] Obteniendo ${source}...`);
                const response = await axios.get(`http://localhost:4602${this.getUrlForSource(source)}`, { timeout: 10000 });
                
                if (response.data && response.data.success) {
                    sourcesData[source] = response.data;
                    console.log(`[OK] [CONSOLIDATION] ${source}: ${this.getDataCount(response.data)} elementos`);
                }
            } catch (error) {
                console.error(`[ERROR] [CONSOLIDATION] Error en ${source}:`, error.message);
                sourcesData[source] = null;
            }
        }
        
        return sourcesData;
    }

    async consolidateRecommendations(sourcesData) {
        const allRecommendations = [];
        const symbolMap = new Map();

        // Procesar cada fuente
        Object.entries(sourcesData).forEach(([sourceName, sourceData]) => {
            if (sourceData) {
                const recommendations = this.extractRecommendations(sourceName, sourceData);
                console.log(`[DATA] [CONSOLIDATION] ${sourceName}: ${recommendations.length} recomendaciones extraídas`);
                allRecommendations.push(...recommendations);
            } else {
                console.log(`[ERROR] [CONSOLIDATION] ${sourceName}: Sin datos`);
            }
        });
        
        console.log(`[UP] [CONSOLIDATION] Total recomendaciones extraídas: ${allRecommendations.length}`);

        // Consolidar por símbolo
        allRecommendations.forEach(rec => {
            if (!symbolMap.has(rec.symbol)) {
                symbolMap.set(rec.symbol, {
                    symbol: rec.symbol,
                    sources: new Set(),
                    recommendations: [],
                    metrics: {
                        totalConfidence: 0,
                        sourceCount: 0,
                        quantumScore: 0,
                        brainScore: 0,
                        volume: 0,
                        priceChange: 0
                    }
                });
            }
            
            const symbolData = symbolMap.get(rec.symbol);
            symbolData.sources.add(rec.source);
            symbolData.recommendations.push(rec);
            
            // Acumular métricas
            symbolData.metrics.totalConfidence += rec.confidence;
            symbolData.metrics.sourceCount = symbolData.sources.size;
            symbolData.metrics.quantumScore = Math.max(symbolData.metrics.quantumScore, rec.quantumScore || 0);
            symbolData.metrics.brainScore = Math.max(symbolData.metrics.brainScore, rec.brainScore || 0);
            symbolData.metrics.volume = Math.max(symbolData.metrics.volume, rec.volume || 0);
            symbolData.metrics.priceChange = Math.max(symbolData.metrics.priceChange, Math.abs(rec.priceChange || 0));
        });

        // Calcular scores consolidados
        const consolidatedSymbols = Array.from(symbolMap.values()).map(symbolData => {
            const avgConfidence = symbolData.metrics.totalConfidence / symbolData.recommendations.length;
            
            // Score consolidado con pesos
            const confidenceWeight = 0.4;
            const sourceWeight = 0.2;
            const quantumWeight = 0.2;
            const brainWeight = 0.1;
            const volumeWeight = 0.1;
            
            const sourceScore = Math.min(0.2, symbolData.metrics.sourceCount * 0.05);
            const quantumScore = (symbolData.metrics.quantumScore / 100) * quantumWeight;
            const brainScore = (symbolData.metrics.brainScore / 100) * brainWeight;
            const volumeScore = Math.min(0.1, symbolData.metrics.volume / 1000000) * volumeWeight;
            
            const consolidatedScore = Math.min(100, 
                (avgConfidence / 100) * confidenceWeight + 
                sourceScore + 
                quantumScore + 
                brainScore + 
                volumeScore
            );

            return {
                ...symbolData,
                consolidatedScore,
                averageConfidence: avgConfidence,
                bestRecommendation: this.selectBestRecommendation(symbolData.recommendations)
            };
        });
        
        console.log(`[DATA] [CONSOLIDATION] Símbolos consolidados: ${consolidatedSymbols.length}`);
        if (consolidatedSymbols.length > 0) {
            console.log(`[UP] [CONSOLIDATION] Score promedio: ${(consolidatedSymbols.reduce((sum, s) => sum + s.consolidatedScore, 0) / consolidatedSymbols.length).toFixed(1)}%`);
            console.log(`[UP] [CONSOLIDATION] Confianza promedio: ${(consolidatedSymbols.reduce((sum, s) => sum + s.averageConfidence, 0) / consolidatedSymbols.length).toFixed(1)}%`);
        }

        return consolidatedSymbols;
    }

    async optimizeAndRank(consolidatedSymbols) {
        // Detectar régimen del mercado basado en los datos disponibles
        const marketRegime = this.detectMarketRegime(consolidatedSymbols);
        
        // Ajustar umbrales según el régimen
        const thresholds = this.getRegimeThresholds(marketRegime);
        
        console.log(`[DATA] [CONSOLIDATION] Régimen detectado: ${marketRegime}`);
        console.log(` [CONSOLIDATION] Umbrales ajustados: Score=${thresholds.minScore}%, Confianza=${thresholds.minConfidence}%`);
        
        // MEJORA: Calcular métricas avanzadas para cada símbolo
        const enhancedSymbols = consolidatedSymbols.map(symbol => {
            const enhancedMetrics = this.calculateEnhancedMetrics(symbol, marketRegime);
            return { ...symbol, enhancedMetrics };
        });
        
        // MEJORA: Filtrar por calidad con umbrales dinámicos y métricas mejoradas
        const qualityFiltered = enhancedSymbols.filter(symbol => {
            const baseScore = symbol.consolidatedScore;
            const baseConfidence = symbol.averageConfidence;
            const enhancedScore = symbol.enhancedMetrics.enhancedScore;
            
            // En régimen de crisis, ser más permisivo pero con métricas mejoradas
            if (marketRegime === 'CRISIS') {
                const passes = (baseScore >= (thresholds.minScore * 0.5) || enhancedScore >= thresholds.minScore) && 
                              baseConfidence >= (thresholds.minConfidence * 0.5);
                if (!passes) {
                    console.log(`[ERROR] [CONSOLIDATION] ${symbol.symbol} filtrado: Score=${baseScore.toFixed(1)}%/${enhancedScore.toFixed(1)}% (min=${thresholds.minScore * 0.5}), Confianza=${baseConfidence.toFixed(1)}% (min=${thresholds.minConfidence * 0.5})`);
                }
                return passes;
            }
            
            // Para otros regímenes, usar umbrales normales con métricas mejoradas
            const passes = (baseScore >= thresholds.minScore || enhancedScore >= thresholds.minScore) && 
                          baseConfidence >= thresholds.minConfidence;
            if (!passes) {
                console.log(`[ERROR] [CONSOLIDATION] ${symbol.symbol} filtrado: Score=${baseScore.toFixed(1)}%/${enhancedScore.toFixed(1)}% (min=${thresholds.minScore}), Confianza=${baseConfidence.toFixed(1)}% (min=${thresholds.minConfidence})`);
            }
            return passes;
        });
        
        console.log(`[OK] [CONSOLIDATION] Símbolos que pasan filtro: ${qualityFiltered.length}/${consolidatedSymbols.length}`);

        // MEJORA: Ordenar por score mejorado y optimizar con umbrales dinámicos
        const optimizedSymbols = qualityFiltered
            .sort((a, b) => {
                // Priorizar por score mejorado, luego por score base
                const scoreDiff = b.enhancedMetrics.enhancedScore - a.enhancedMetrics.enhancedScore;
                if (Math.abs(scoreDiff) > 1) return scoreDiff;
                return b.consolidatedScore - a.consolidatedScore;
            })
            .slice(0, thresholds.maxRecommendations)
            .map((symbol, index) => {
                // MEJORA: Bonificaciones dinámicas mejoradas según régimen y métricas
                const rankingBonus = Math.max(0, (thresholds.maxRecommendations - index) * 0.8);
                const sourceBonus = Math.min(thresholds.sourceBonus, symbol.metrics.sourceCount * 3);
                const confidenceBonus = symbol.averageConfidence > 80 ? thresholds.confidenceBonus : 
                                      symbol.averageConfidence > 70 ? Math.floor(thresholds.confidenceBonus / 2) : 0;
                
                // MEJORA: Bonus por métricas cuánticas
                const quantumBonus = this.calculateQuantumBonus(symbol);
                
                // MEJORA: Bonus por consistencia entre fuentes
                const consistencyBonus = this.calculateConsistencyBonus(symbol);
                
                const finalScore = Math.min(100, 
                    symbol.enhancedMetrics.enhancedScore + 
                    rankingBonus + 
                    sourceBonus + 
                    confidenceBonus + 
                    quantumBonus + 
                    consistencyBonus
                );
                
                return {
                    ...symbol,
                    finalScore,
                    ranking: index + 1,
                    bonuses: { 
                        ranking: rankingBonus, 
                        source: sourceBonus, 
                        confidence: confidenceBonus,
                        quantum: quantumBonus,
                        consistency: consistencyBonus
                    },
                    marketRegime: marketRegime,
                    enhancedMetrics: symbol.enhancedMetrics
                };
            });

        // Formatear resultados finales
        const finalRecommendations = optimizedSymbols.map(symbol => {
            const bestRec = symbol.bestRecommendation;
            
            return {
                symbol: symbol.symbol,
                ranking: symbol.ranking,
                action: bestRec.action,
                confidence: symbol.finalScore.toFixed(1) + '%',
                entryPrice: bestRec.entryPrice.toFixed(4),
                stopLoss: bestRec.stopLoss.toFixed(4),
                takeProfit: bestRec.takeProfit.toFixed(4),
                leverage: bestRec.leverage,
                reasoning: bestRec.reasoning,
                priority: symbol.finalScore > 80 ? 'HIGH' : symbol.finalScore > 60 ? 'MEDIUM' : 'LOW',
                timeframe: bestRec.timeframe || '4h',
                riskLevel: symbol.finalScore > 75 ? 'LOW' : symbol.finalScore > 55 ? 'MEDIUM' : 'HIGH',
                sources: Array.from(symbol.sources),
                sourceCount: symbol.metrics.sourceCount,
                volume: symbol.metrics.volume,
                priceChange: symbol.metrics.priceChange.toFixed(2) + '%',
                quantumScore: symbol.metrics.quantumScore.toFixed(1) + '%',
                brainScore: symbol.metrics.brainScore.toFixed(1) + '%',
                consolidatedScore: symbol.consolidatedScore.toFixed(1) + '%',
                finalScore: symbol.finalScore.toFixed(1) + '%'
            };
        });

        // Generar resumen con información del régimen
        const summary = {
            totalRecommendations: finalRecommendations.length,
            uniqueSymbols: optimizedSymbols.length,
            averageFinalScore: optimizedSymbols.reduce((sum, s) => sum + s.finalScore, 0) / optimizedSymbols.length,
            marketRegime: marketRegime,
            regimeThresholds: thresholds,
            topRecommendations: finalRecommendations.slice(0, 5).map(rec => ({
                symbol: rec.symbol,
                action: rec.action,
                confidence: rec.confidence,
                priority: rec.priority
            })),
            systemHealth: finalRecommendations.length > 10 ? 'EXCELLENT' : 
                         finalRecommendations.length > 5 ? 'GOOD' : 
                         finalRecommendations.length > 0 ? 'FAIR' : 'POOR',
            sourcesAvailable: 4, // Número fijo de fuentes configuradas
            totalSources: this.sources.length,
            regimeAdaptation: {
                appliedThresholds: thresholds,
                detectedRegime: marketRegime,
                adaptationReason: this.getRegimeAdaptationReason(marketRegime, thresholds)
            }
        };

        return {
            recommendations: finalRecommendations,
            summary: summary
        };
    }

    extractRecommendations(sourceName, sourceData) {
        const recommendations = [];

        switch (sourceName) {
            case 'ENHANCED_OPPORTUNITIES':
                if (sourceData.opportunities) {
                    sourceData.opportunities.forEach(opp => {
                        recommendations.push({
                            symbol: opp.symbol,
                            source: sourceName,
                            action: opp.priceChangePercent > 0 ? 'LONG' : 'SHORT',
                            confidence: opp.confidence * 100,
                            entryPrice: opp.currentPrice,
                            stopLoss: opp.currentPrice * (opp.priceChangePercent > 0 ? 0.95 : 1.05),
                            takeProfit: opp.currentPrice * (opp.priceChangePercent > 0 ? 1.15 : 0.85),
                            leverage: opp.leverage || '10x',
                            reasoning: `Volatilidad: ${opp.priceChangePercent.toFixed(2)}%, Volumen: ${opp.displayVolume}`,
                            timeframe: opp.timeframe,
                            riskLevel: opp.riskLevel,
                            volume: opp.volume,
                            priceChange: opp.priceChangePercent,
                            quantumScore: 0,
                            brainScore: 0
                        });
                    });
                }
                break;

            case 'QUANTUM_RECOMMENDATIONS':
                if (sourceData.recommendations) {
                    sourceData.recommendations.forEach(rec => {
                        const confidence = parseFloat(rec.confidence.replace('%', ''));
                        recommendations.push({
                            symbol: rec.symbol,
                            source: sourceName,
                            action: rec.action,
                            confidence: confidence,
                            entryPrice: parseFloat(rec.entryPrice),
                            stopLoss: parseFloat(rec.stopLoss),
                            takeProfit: parseFloat(rec.takeProfit),
                            leverage: rec.leverage,
                            reasoning: rec.reasoning,
                            timeframe: '4h',
                            riskLevel: rec.riskLevel,
                            volume: rec.marketData?.volume || 0,
                            priceChange: parseFloat(String(rec.marketData?.priceChangePercent || '0').replace('%', '')),
                            quantumScore: parseFloat(rec.quantumMetrics?.quantumScore?.replace('%', '') || '0'),
                            brainScore: 0
                        });
                    });
                }
                break;

            case 'QUANTUM_BRAIN':
                if (sourceData.brainRecommendations) {
                    sourceData.brainRecommendations.forEach(rec => {
                        const brainScore = parseFloat(rec.brainScore?.replace('%', '') || '0');
                        recommendations.push({
                            symbol: rec.symbol,
                            source: sourceName,
                            action: rec.action,
                            confidence: brainScore,
                            entryPrice: parseFloat(rec.entryPrice || '0'),
                            stopLoss: parseFloat(rec.stopLoss || '0'),
                            takeProfit: parseFloat(rec.takeProfit || '0'),
                            leverage: rec.leverage || '15x',
                            reasoning: rec.reasoning || 'Análisis cerebral cuántico',
                            timeframe: '1h',
                            riskLevel: brainScore > 80 ? 'LOW' : brainScore > 60 ? 'MEDIUM' : 'HIGH',
                            volume: 0,
                            priceChange: 0,
                            quantumScore: 0,
                            brainScore: brainScore
                        });
                    });
                }
                break;

            case 'QUANTUM_ANALYSIS':
                if (sourceData.quantumRecommendations) {
                    sourceData.quantumRecommendations.forEach(rec => {
                        recommendations.push({
                            symbol: rec.symbol,
                            source: sourceName,
                            action: rec.action,
                            confidence: rec.confidence * 100,
                            entryPrice: rec.entryPrice,
                            stopLoss: rec.stopLoss,
                            takeProfit: rec.takeProfit,
                            leverage: rec.leverage,
                            reasoning: rec.reasoning,
                            timeframe: '4h',
                            riskLevel: rec.riskLevel,
                            volume: rec.marketData?.volume || 0,
                            priceChange: rec.marketData?.priceChangePercent || 0,
                            quantumScore: rec.quantumMetrics?.quantumScore * 100 || 0,
                            brainScore: 0
                        });
                    });
                }
                break;

            case 'LEONARDO_FEYNMAN':
                if (sourceData.leonardoFeynmanRecommendations) {
                    sourceData.leonardoFeynmanRecommendations.forEach(rec => {
                        recommendations.push({
                            symbol: rec.symbol,
                            source: sourceName,
                            action: rec.action,
                            confidence: rec.confidence * 100,
                            entryPrice: rec.entryPrice,
                            stopLoss: rec.stopLoss,
                            takeProfit: rec.takeProfit,
                            leverage: rec.leverage,
                            reasoning: rec.reasoning,
                            timeframe: '4h', // Leo-Feynman usa 4h
                            riskLevel: rec.riskLevel,
                            volume: rec.marketData?.volume || 0,
                            priceChange: rec.marketData?.priceChangePercent || 0,
                            quantumScore: rec.quantumMetrics?.quantumScore * 100 || 0,
                            brainScore: rec.brainScore || 0
                        });
                    });
                }
                break;
        }

        return recommendations;
    }

    selectBestRecommendation(recommendations) {
        if (recommendations.length === 0) return null;
        return recommendations.reduce((best, current) => 
            current.confidence > best.confidence ? current : best
        );
    }

    getDataCount(sourceData) {
        if (sourceData.opportunities) return sourceData.opportunities.length;
        if (sourceData.recommendations) return sourceData.recommendations.length;
        if (sourceData.brainRecommendations) return sourceData.brainRecommendations.length;
        if (sourceData.quantumRecommendations) return sourceData.quantumRecommendations.length;
        if (sourceData.leonardoFeynmanRecommendations) return sourceData.leonardoFeynmanRecommendations.length;
        return 0;
    }

    getUrlForSource(source) {
        const urlMap = {
            'ENHANCED_OPPORTUNITIES': '/api/enhanced-opportunities',
            'QUANTUM_RECOMMENDATIONS': '/api/quantum-recommendations',
            'QUANTUM_BRAIN': '/api/quantum-brain-test',
            'QUANTUM_ANALYSIS': '/api/quantum-analysis',
            'LEONARDO_FEYNMAN': '/api/leonardo-feynman-recommendations'
        };
        return urlMap[source] || '/api/market-data';
    }

    detectMarketRegime(consolidatedSymbols) {
        if (consolidatedSymbols.length === 0) return 'NEUTRAL';
        
        // MEJORA: Calcular métricas del mercado más detalladas
        const avgScore = consolidatedSymbols.reduce((sum, s) => sum + s.consolidatedScore, 0) / consolidatedSymbols.length;
        const avgConfidence = consolidatedSymbols.reduce((sum, s) => sum + s.averageConfidence, 0) / consolidatedSymbols.length;
        const avgVolume = consolidatedSymbols.reduce((sum, s) => sum + s.metrics.volume, 0) / consolidatedSymbols.length;
        const avgPriceChange = consolidatedSymbols.reduce((sum, s) => Math.abs(s.metrics.priceChange), 0) / consolidatedSymbols.length;
        
        // MEJORA: Calcular métricas cuánticas promedio
        const avgQuantumScore = consolidatedSymbols.reduce((sum, s) => sum + s.metrics.quantumScore, 0) / consolidatedSymbols.length;
        const avgBrainScore = consolidatedSymbols.reduce((sum, s) => sum + s.metrics.brainScore, 0) / consolidatedSymbols.length;
        
        // Contar acciones LONG vs SHORT
        const longCount = consolidatedSymbols.filter(s => s.bestRecommendation?.action === 'LONG').length;
        const shortCount = consolidatedSymbols.filter(s => s.bestRecommendation?.action === 'SHORT').length;
        const longRatio = longCount / (longCount + shortCount);
        
        // MEJORA: Calcular volatilidad del mercado
        const priceChanges = consolidatedSymbols.map(s => Math.abs(s.metrics.priceChange));
        const volatility = Math.sqrt(priceChanges.reduce((sum, change) => sum + Math.pow(change - avgPriceChange, 2), 0) / priceChanges.length);
        
        // MEJORA: Detectar régimen con algoritmo mejorado
        let regime = 'NEUTRAL';
        let confidence = 0;
        
        // Análisis de crisis (prioridad alta)
        if (avgConfidence < 35 || avgScore < 45 || (avgQuantumScore < 30 && avgBrainScore < 30)) {
            regime = 'CRISIS';
            confidence = 90;
        }
        // Análisis de alta volatilidad
        else if (volatility > 6 || avgPriceChange > 8) {
            regime = 'HIGH_VOLATILITY';
            confidence = 85;
        }
        // Análisis de tendencia alcista
        else if (longRatio > 0.65 && avgScore > 65 && avgPriceChange > 3) {
            regime = 'BULLISH';
            confidence = 80;
        }
        // Análisis de tendencia bajista
        else if (longRatio < 0.35 && avgScore > 65 && avgPriceChange > 3) {
            regime = 'BEARISH';
            confidence = 80;
        }
        // Análisis de baja volatilidad
        else if (volatility < 2 && avgPriceChange < 2 && avgVolume < 500000) {
            regime = 'LOW_VOLATILITY';
            confidence = 75;
        }
        // Análisis de consolidación
        else if (Math.abs(longRatio - 0.5) < 0.15 && avgPriceChange < 4 && volatility < 4) {
            regime = 'CONSOLIDATION';
            confidence = 70;
        }
        // Neutral por defecto
        else {
            regime = 'NEUTRAL';
            confidence = 60;
        }
        
        console.log(`[SEARCH] [CONSOLIDATION] Métricas de régimen mejoradas:`);
        console.log(`   Score=${avgScore.toFixed(1)}, Confianza=${avgConfidence.toFixed(1)}`);
        console.log(`   Volumen=${avgVolume.toFixed(0)}, Cambio=${avgPriceChange.toFixed(2)}%`);
        console.log(`   Volatilidad=${volatility.toFixed(2)}, LongRatio=${longRatio.toFixed(2)}`);
        console.log(`   Quantum=${avgQuantumScore.toFixed(1)}, Brain=${avgBrainScore.toFixed(1)}`);
        console.log(`   Régimen detectado: ${regime} (confianza: ${confidence}%)`);
        
        return regime;
    }

    getRegimeThresholds(marketRegime) {
        const thresholds = {
            'BULLISH': {
                minScore: 45,
                minConfidence: 50,
                maxRecommendations: 25,
                confidenceBonus: 5,
                sourceBonus: 3
            },
            'BEARISH': {
                minScore: 45,
                minConfidence: 50,
                maxRecommendations: 25,
                confidenceBonus: 5,
                sourceBonus: 3
            },
            'HIGH_VOLATILITY': {
                minScore: 35,
                minConfidence: 40,
                maxRecommendations: 30,
                confidenceBonus: 8,
                sourceBonus: 5
            },
            'LOW_VOLATILITY': {
                minScore: 60,
                minConfidence: 70,
                maxRecommendations: 15,
                confidenceBonus: 2,
                sourceBonus: 1
            },
            'CRISIS': {
                minScore: 25,
                minConfidence: 30,
                maxRecommendations: 35,
                confidenceBonus: 10,
                sourceBonus: 8
            },
            'CONSOLIDATION': {
                minScore: 55,
                minConfidence: 65,
                maxRecommendations: 20,
                confidenceBonus: 3,
                sourceBonus: 2
            },
            'NEUTRAL': {
                minScore: 50,
                minConfidence: 60,
                maxRecommendations: 20,
                confidenceBonus: 3,
                sourceBonus: 2
            }
        };
        
        return thresholds[marketRegime] || thresholds['NEUTRAL'];
    }

    getRegimeAdaptationReason(marketRegime, thresholds) {
        const reasons = {
            'BULLISH': 'Mercado alcista detectado - Umbrales moderados para capturar oportunidades de tendencia',
            'BEARISH': 'Mercado bajista detectado - Umbrales moderados para capturar oportunidades de tendencia',
            'HIGH_VOLATILITY': 'Alta volatilidad detectada - Umbrales bajos para capturar movimientos rápidos',
            'LOW_VOLATILITY': 'Baja volatilidad detectada - Umbrales altos para asegurar calidad en mercados tranquilos',
            'CRISIS': 'Crisis de mercado detectada - Umbrales muy bajos para capturar oportunidades de recuperación',
            'CONSOLIDATION': 'Consolidación detectada - Umbrales altos para esperar confirmaciones claras',
            'NEUTRAL': 'Mercado neutral - Umbrales estándar para condiciones normales'
        };
        
        return reasons[marketRegime] || reasons['NEUTRAL'];
    }

    // MEJORA: Método para calcular métricas mejoradas
    calculateEnhancedMetrics(symbol, marketRegime) {
        const baseScore = symbol.consolidatedScore;
        const baseConfidence = symbol.averageConfidence;
        const quantumScore = symbol.metrics.quantumScore;
        const brainScore = symbol.metrics.brainScore;
        const volume = symbol.metrics.volume;
        const priceChange = Math.abs(symbol.metrics.priceChange);
        const sourceCount = symbol.metrics.sourceCount;

        // Factor de volumen (mayor volumen = mejor score)
        const volumeFactor = Math.min(1, volume / 1000000) * 10; // Máximo 10 puntos

        // Factor de cambio de precio (mayor cambio = mejor score)
        const priceChangeFactor = Math.min(1, priceChange / 10) * 8; // Máximo 8 puntos

        // Factor de fuentes múltiples (más fuentes = mejor score)
        const sourceFactor = Math.min(1, (sourceCount - 1) / 3) * 5; // Máximo 5 puntos

        // Factor de métricas cuánticas
        const quantumFactor = ((quantumScore + brainScore) / 2) * 0.15; // Máximo 15 puntos

        // Factor de régimen de mercado
        const regimeFactor = this.calculateRegimeFactor(marketRegime, symbol);

        // Score mejorado
        const enhancedScore = Math.min(100, 
            baseScore + 
            volumeFactor + 
            priceChangeFactor + 
            sourceFactor + 
            quantumFactor + 
            regimeFactor
        );

        return {
            enhancedScore,
            volumeFactor,
            priceChangeFactor,
            sourceFactor,
            quantumFactor,
            regimeFactor,
            breakdown: {
                baseScore,
                volumeFactor,
                priceChangeFactor,
                sourceFactor,
                quantumFactor,
                regimeFactor
            }
        };
    }

    // MEJORA: Calcular factor de régimen
    calculateRegimeFactor(marketRegime, symbol) {
        const action = symbol.bestRecommendation?.action;
        const priceChange = symbol.metrics.priceChange;

        let factor = 0;

        switch (marketRegime) {
            case 'BULLISH':
                // Bonus para LONG en mercado alcista
                if (action === 'LONG' && priceChange > 0) factor = 5;
                else if (action === 'SHORT' && priceChange < 0) factor = 3;
                break;
            case 'BEARISH':
                // Bonus para SHORT en mercado bajista
                if (action === 'SHORT' && priceChange < 0) factor = 5;
                else if (action === 'LONG' && priceChange > 0) factor = 3;
                break;
            case 'HIGH_VOLATILITY':
                // Bonus para movimientos fuertes
                if (Math.abs(priceChange) > 5) factor = 4;
                break;
            case 'LOW_VOLATILITY':
                // Bonus para consistencia
                if (symbol.averageConfidence > 75) factor = 3;
                break;
            case 'CRISIS':
                // Bonus para oportunidades de recuperación
                if (Math.abs(priceChange) > 8) factor = 6;
                break;
            case 'CONSOLIDATION':
                // Bonus para señales claras
                if (symbol.averageConfidence > 80) factor = 4;
                break;
            default:
                factor = 0;
        }

        return factor;
    }

    // MEJORA: Calcular bonus por métricas cuánticas
    calculateQuantumBonus(symbol) {
        const quantumScore = symbol.metrics.quantumScore;
        const brainScore = symbol.metrics.brainScore;
        
        // Bonus si ambas métricas cuánticas son altas
        if (quantumScore > 70 && brainScore > 70) return 8;
        if (quantumScore > 60 && brainScore > 60) return 5;
        if (quantumScore > 50 || brainScore > 50) return 3;
        
        return 0;
    }

    // MEJORA: Calcular bonus por consistencia entre fuentes
    calculateConsistencyBonus(symbol) {
        const sourceCount = symbol.metrics.sourceCount;
        const confidence = symbol.averageConfidence;
        
        // Bonus por múltiples fuentes con alta confianza
        if (sourceCount >= 3 && confidence > 80) return 6;
        if (sourceCount >= 2 && confidence > 70) return 4;
        if (sourceCount >= 2 && confidence > 60) return 2;
        
        return 0;
    }

    async getLeonardoFeynmanRecommendations() {
        try {
            if (!this.leonardoFeynmanSystem) {
                console.warn('[WARNING] [CONSOLIDATION] Leonardo-Feynman system not initialized');
                return [];
            }
            
            // Obtener símbolos del sistema QBTC
            const marketDataResponse = await axios.get('http://localhost:4602/api/market-data');
            if (!marketDataResponse.data.success) {
                return [];
            }
            
            const symbols = Object.keys(marketDataResponse.data.data.futures || {});
            const topSymbols = symbols.slice(0, 50); // Analizar top 50 símbolos
            
            console.log(` [CONSOLIDATION] Leonardo-Feynman analyzing ${topSymbols.length} symbols...`);
            
            const analysis = await this.leonardoFeynmanSystem.analyzeAllSymbols(topSymbols);
            
            // Convertir a formato de recomendaciones
            const recommendations = analysis.highConfidenceRecommendations.map(rec => ({
                symbol: rec.symbol,
                action: rec.recommendation.action,
                confidence: rec.confidence * 100, // Convertir a porcentaje
                reasoning: rec.reasoning,
                psychology: rec.psychology,
                entryPrice: rec.recommendation.entryPrice,
                stopLoss: rec.recommendation.stopLoss,
                takeProfit: rec.recommendation.takeProfit,
                source: 'LEONARDO_FEYNMAN',
                timestamp: Date.now()
            }));
            
            console.log(`[OK] [CONSOLIDATION] Leonardo-Feynman generated ${recommendations.length} recommendations`);
            return recommendations;
            
        } catch (error) {
            console.error('[ERROR] [CONSOLIDATION] Error getting Leonardo-Feynman recommendations:', error.message);
            return [];
        }
    }
}

// Función principal de exportación
async function getConsolidatedRecommendations() {
    const consolidationSystem = new ConsolidatedRecommendationsSystem();
    return await consolidationSystem.executeConsolidation();
}

module.exports = {
    ConsolidatedRecommendationsSystem,
    getConsolidatedRecommendations
};

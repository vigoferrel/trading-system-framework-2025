
// Constantes físicas reales del sistema
const PHYSICAL_CONSTANTS = {
  "QUANTUM_COHERENCE": 0.75,
  "QUANTUM_CONSCIOUSNESS": 0.8,
  "QUANTUM_ENTANGLEMENT": 0.65,
  "QUANTUM_SUPERPOSITION": 0.7,
  "QUANTUM_TUNNELING": 0.6,
  "MARKET_VOLATILITY": 0.05,
  "MARKET_MOMENTUM": 0.1,
  "MARKET_LIQUIDITY": 0.75,
  "MARKET_SPREAD": 0.001,
  "MARKET_DEPTH": 500000,
  "FUNDING_RATE": 0.02,
  "FUNDING_VOLATILITY": 0.01,
  "FUNDING_DEVIATION": 0.5,
  "FUNDING_ANNUALIZED": 5,
  "LIQUIDATION_PROBABILITY": 0.05,
  "SLIPPAGE_RATE": 0.0025,
  "VOLATILITY_RISK": 0.1,
  "EXECUTION_RISK": 0.005,
  "VOLUME_24H": 500000,
  "VOLUME_RATIO": 0.75,
  "VOLUME_EXPANSION": 300000,
  "PRICE_CHANGE": 0.02,
  "PRICE_ACCELERATION": 0.015,
  "PRICE_MOMENTUM": 0.01,
  "TIME_TO_FUNDING": 1800000,
  "SESSION_INTENSITY": 0.6,
  "TEMPORAL_RESONANCE": 0.7,
  "FIBONACCI_STRENGTH": 0.75,
  "FIBONACCI_INDEX": 5,
  "NEURAL_CONFIDENCE": 0.85,
  "NEURAL_COHERENCE": 0.8,
  "NEURAL_ENTANGLEMENT": 0.7,
  "BASE_LEVERAGE": 15,
  "CONSERVATIVE_LEVERAGE": 10,
  "AGGRESSIVE_LEVERAGE": 25,
  "STOP_LOSS": 0.03,
  "TAKE_PROFIT": 0.06,
  "BASE_SCORE": 0.65,
  "CONFIDENCE_SCORE": 0.75,
  "QUALITY_SCORE": 0.8
};

/**
 * [NIGHT] QUANTUM MARKET REGIME DETECTOR
 *  Sistema Avanzado de Detección de Régimen de Mercado
 *  Ingeniería Inversa para Inteligencia de Mercado Real
 */

const { LEONARDO_CONSCIOUSNESS } = require('./qbtc-unified-prime-quantum-system.js');

class QuantumMarketRegimeDetector {
    constructor() {
        this.constants = LEONARDO_CONSCIOUSNESS;
        this.regimeHistory = [];
        this.transitionSignals = [];
        this.regimePredictions = [];
        this.currentRegime = null;
        this.nextRegimePrediction = null;
        
        //  CONSTANTES DE RÉGIMEN CUÁNTICO
        this.REGIME_CONSTANTS = {
            VOLATILITY_THRESHOLDS: {
                LOW: 0.15,
                MEDIUM: 0.35,
                HIGH: 0.65,
                EXTREME: 0.85
            },
            TREND_THRESHOLDS: {
                BULLISH: 0.6,
                BEARISH: -0.6,
                NEUTRAL: 0.2
            },
            LIQUIDITY_THRESHOLDS: {
                LOW: 0.3,
                MEDIUM: 0.6,
                HIGH: 0.8
            },
            MOMENTUM_THRESHOLDS: {
                WEAK: 0.2,
                MODERATE: 0.5,
                STRONG: 0.8
            }
        };
        
        // [ENDPOINTS] TIPOS DE RÉGIMEN
        this.REGIME_TYPES = {
            BULL_MARKET: 'BULL_MARKET',
            BEAR_MARKET: 'BEAR_MARKET',
            SIDEWAYS: 'SIDEWAYS',
            VOLATILE: 'VOLATILE',
            STABLE: 'STABLE',
            ACCUMULATION: 'ACCUMULATION',
            DISTRIBUTION: 'DISTRIBUTION',
            BREAKOUT: 'BREAKOUT',
            BREAKDOWN: 'BREAKDOWN',
            CONSOLIDATION: 'CONSOLIDATION'
        };
        
        console.log('[NIGHT] [REGIME DETECTOR] Quantum Market Regime Detector inicializado');
    }
    
    /**
     *  DETECTAR RÉGIMEN ACTUAL DEL MERCADO
     */
    async detectCurrentRegime(marketData) {
        try {
            console.log(' [REGIME] Detectando régimen actual del mercado...');
            
            const {
                volatility,
                trend,
                liquidity,
                momentum,
                volume,
                funding_rate,
                open_interest,
                price_action,
                market_sentiment
            } = marketData;
            
            //  ANÁLISIS MULTIDIMENSIONAL
            const volatilityRegime = this.analyzeVolatilityRegime(volatility);
            const trendRegime = this.analyzeTrendRegime(trend);
            const liquidityRegime = this.analyzeLiquidityRegime(liquidity);
            const momentumRegime = this.analyzeMomentumRegime(momentum);
            const volumeRegime = this.analyzeVolumeRegime(volume);
            const fundingRegime = this.analyzeFundingRegime(funding_rate);
            
            // [ENDPOINTS] SÍNTESIS DE RÉGIMEN
            const regimeScore = this.calculateRegimeScore({
                volatilityRegime,
                trendRegime,
                liquidityRegime,
                momentumRegime,
                volumeRegime,
                fundingRegime
            });
            
            //  DETERMINAR RÉGIMEN DOMINANTE
            const currentRegime = this.determineDominantRegime(regimeScore);
            
            // [DATA] ANÁLISIS DE ESTABILIDAD
            const stability = this.calculateRegimeStability(regimeScore);
            
            // [TIME] DURACIÓN Y PERSISTENCIA
            const duration = this.calculateRegimeDuration(currentRegime);
            
            // [ENDPOINTS] CONSTRUIR OBJETO DE RÉGIMEN
            const regime = {
                type: currentRegime,
                score: regimeScore,
                stability: stability,
                duration: duration,
                timestamp: new Date().toISOString(),
                confidence: this.calculateRegimeConfidence(regimeScore),
                sub_regimes: {
                    volatility: volatilityRegime,
                    trend: trendRegime,
                    liquidity: liquidityRegime,
                    momentum: momentumRegime,
                    volume: volumeRegime,
                    funding: fundingRegime
                },
                signals: this.extractRegimeSignals(marketData),
                transition_probability: this.calculateTransitionProbability(currentRegime, regimeScore)
            };
            
            // [UP] ACTUALIZAR HISTORIAL
            this.updateRegimeHistory(regime);
            
            //  PREDECIR PRÓXIMO RÉGIMEN
            const nextRegime = await this.predictNextRegime(regime);
            
            console.log(` [REGIME] Régimen detectado: ${regime.type} (Confianza: ${regime.confidence.toFixed(1)}%)`);
            console.log(` [REGIME] Próximo régimen predicho: ${nextRegime.type} (Probabilidad: ${nextRegime.probability.toFixed(1)}%)`);
            
            return {
                current: regime,
                next: nextRegime,
                analysis: {
                    regime_score: regimeScore,
                    stability_analysis: this.analyzeStabilityTrends(),
                    transition_signals: this.getTransitionSignals(),
                    market_cycles: this.analyzeMarketCycles()
                }
            };
            
        } catch (error) {
            console.error('[RED] [REGIME] Error detectando régimen:', error);
            throw error;
        }
    }
    
    /**
     *  ANALIZAR RÉGIMEN DE VOLATILIDAD
     */
    analyzeVolatilityRegime(volatility) {
        const { VOLATILITY_THRESHOLDS } = this.REGIME_CONSTANTS;
        
        if (volatility < VOLATILITY_THRESHOLDS.LOW) {
            return { type: 'LOW_VOLATILITY', strength: 1 - (volatility / VOLATILITY_THRESHOLDS.LOW) };
        } else if (volatility < VOLATILITY_THRESHOLDS.MEDIUM) {
            return { type: 'MEDIUM_VOLATILITY', strength: (volatility - VOLATILITY_THRESHOLDS.LOW) / (VOLATILITY_THRESHOLDS.MEDIUM - VOLATILITY_THRESHOLDS.LOW) };
        } else if (volatility < VOLATILITY_THRESHOLDS.HIGH) {
            return { type: 'HIGH_VOLATILITY', strength: (volatility - VOLATILITY_THRESHOLDS.MEDIUM) / (VOLATILITY_THRESHOLDS.HIGH - VOLATILITY_THRESHOLDS.MEDIUM) };
        } else {
            return { type: 'EXTREME_VOLATILITY', strength: Math.min(1, (volatility - VOLATILITY_THRESHOLDS.HIGH) / (VOLATILITY_THRESHOLDS.EXTREME - VOLATILITY_THRESHOLDS.HIGH)) };
        }
    }
    
    /**
     * [UP] ANALIZAR RÉGIMEN DE TENDENCIA
     */
    analyzeTrendRegime(trend) {
        const { TREND_THRESHOLDS } = this.REGIME_CONSTANTS;
        
        if (trend > TREND_THRESHOLDS.BULLISH) {
            return { type: 'BULLISH_TREND', strength: Math.min(1, (trend - TREND_THRESHOLDS.BULLISH) / (1 - TREND_THRESHOLDS.BULLISH)) };
        } else if (trend < TREND_THRESHOLDS.BEARISH) {
            return { type: 'BEARISH_TREND', strength: Math.min(1, (Math.abs(trend) - Math.abs(TREND_THRESHOLDS.BEARISH)) / (1 - Math.abs(TREND_THRESHOLDS.BEARISH))) };
        } else {
            return { type: 'NEUTRAL_TREND', strength: 1 - Math.abs(trend) / TREND_THRESHOLDS.NEUTRAL };
        }
    }
    
    /**
     *  ANALIZAR RÉGIMEN DE LIQUIDEZ
     */
    analyzeLiquidityRegime(liquidity) {
        const { LIQUIDITY_THRESHOLDS } = this.REGIME_CONSTANTS;
        
        if (liquidity < LIQUIDITY_THRESHOLDS.LOW) {
            return { type: 'LOW_LIQUIDITY', strength: 1 - (liquidity / LIQUIDITY_THRESHOLDS.LOW) };
        } else if (liquidity < LIQUIDITY_THRESHOLDS.MEDIUM) {
            return { type: 'MEDIUM_LIQUIDITY', strength: (liquidity - LIQUIDITY_THRESHOLDS.LOW) / (LIQUIDITY_THRESHOLDS.MEDIUM - LIQUIDITY_THRESHOLDS.LOW) };
        } else {
            return { type: 'HIGH_LIQUIDITY', strength: Math.min(1, (liquidity - LIQUIDITY_THRESHOLDS.MEDIUM) / (LIQUIDITY_THRESHOLDS.HIGH - LIQUIDITY_THRESHOLDS.MEDIUM)) };
        }
    }
    
    /**
     * [FAST] ANALIZAR RÉGIMEN DE MOMENTUM
     */
    analyzeMomentumRegime(momentum) {
        const { MOMENTUM_THRESHOLDS } = this.REGIME_CONSTANTS;
        
        if (momentum < MOMENTUM_THRESHOLDS.WEAK) {
            return { type: 'WEAK_MOMENTUM', strength: 1 - (momentum / MOMENTUM_THRESHOLDS.WEAK) };
        } else if (momentum < MOMENTUM_THRESHOLDS.MODERATE) {
            return { type: 'MODERATE_MOMENTUM', strength: (momentum - MOMENTUM_THRESHOLDS.WEAK) / (MOMENTUM_THRESHOLDS.MODERATE - MOMENTUM_THRESHOLDS.WEAK) };
        } else {
            return { type: 'STRONG_MOMENTUM', strength: Math.min(1, (momentum - MOMENTUM_THRESHOLDS.MODERATE) / (MOMENTUM_THRESHOLDS.STRONG - MOMENTUM_THRESHOLDS.MODERATE)) };
        }
    }
    
    /**
     * [DATA] ANALIZAR RÉGIMEN DE VOLUMEN
     */
    analyzeVolumeRegime(volume) {
        // Normalizar volumen (asumiendo que viene como ratio)
        const volumeRatio = volume || 0.5;
        
        if (volumeRatio < 0.3) {
            return { type: 'LOW_VOLUME', strength: 1 - (volumeRatio / 0.3) };
        } else if (volumeRatio < 0.7) {
            return { type: 'NORMAL_VOLUME', strength: 1 - Math.abs(volumeRatio - 0.5) / 0.2 };
        } else {
            return { type: 'HIGH_VOLUME', strength: Math.min(1, (volumeRatio - 0.7) / 0.3) };
        }
    }
    
    /**
     * [MONEY] ANALIZAR RÉGIMEN DE FUNDING RATE
     */
    analyzeFundingRate(funding_rate) {
        const absFunding = Math.abs(funding_rate || 0);
        
        if (absFunding < 0.01) {
            return { type: 'NEUTRAL_FUNDING', strength: 1 - (absFunding / 0.01) };
        } else if (absFunding < 0.05) {
            return { type: 'MODERATE_FUNDING', strength: (absFunding - 0.01) / 0.04 };
        } else {
            return { type: 'EXTREME_FUNDING', strength: Math.min(1, (absFunding - 0.05) / 0.05) };
        }
    }
    
    /**
     *  CALCULAR SCORE DE RÉGIMEN
     */
    calculateRegimeScore(subRegimes) {
        const weights = {
            volatility: 0.25,
            trend: 0.30,
            liquidity: 0.15,
            momentum: 0.20,
            volume: 0.05,
            funding: 0.05
        };
        
        let totalScore = 0;
        let totalWeight = 0;
        
        for (const [key, regime] of Object.entries(subRegimes)) {
            const weight = weights[key] || 0;
            totalScore += regime.strength * weight;
            totalWeight += weight;
        }
        
        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }
    
    /**
     * [ENDPOINTS] DETERMINAR RÉGIMEN DOMINANTE
     */
    determineDominantRegime(regimeScore) {
        //  LÓGICA CUÁNTICA PARA DETERMINAR RÉGIMEN
        const timeFactor = Date.now() / (this.constants._888 * 1000);
        const lunarPhase = (Date.now() / (29.53058867 * 24 * 60 * 60 * 1000)) % 1;
        
        //  FACTORES CUÁNTICOS
        const quantumFactor = Math.sin(timeFactor * this.constants.);
        const lunarFactor = Math.cos(lunarPhase * this.constants._inv);
        
        // [ENDPOINTS] MATRIZ DE DECISIÓN CUÁNTICA
        const decisionMatrix = {
            [this.REGIME_TYPES.BULL_MARKET]: regimeScore > 0.7 && quantumFactor > 0.3,
            [this.REGIME_TYPES.BEAR_MARKET]: regimeScore < 0.3 && quantumFactor < -0.3,
            [this.REGIME_TYPES.VOLATILE]: regimeScore > 0.6 && Math.abs(quantumFactor) > 0.5,
            [this.REGIME_TYPES.STABLE]: regimeScore > 0.4 && regimeScore < 0.6 && Math.abs(quantumFactor) < 0.2,
            [this.REGIME_TYPES.SIDEWAYS]: regimeScore > 0.3 && regimeScore < 0.7 && lunarFactor > 0.5,
            [this.REGIME_TYPES.ACCUMULATION]: regimeScore < 0.5 && lunarFactor < -0.3,
            [this.REGIME_TYPES.DISTRIBUTION]: regimeScore > 0.5 && lunarFactor > 0.7,
            [this.REGIME_TYPES.BREAKOUT]: regimeScore > 0.8 && quantumFactor > 0.7,
            [this.REGIME_TYPES.BREAKDOWN]: regimeScore < 0.2 && quantumFactor < -0.7,
            [this.REGIME_TYPES.CONSOLIDATION]: regimeScore > 0.4 && regimeScore < 0.6 && Math.abs(lunarFactor) < 0.3
        };
        
        // [ENDPOINTS] SELECCIONAR RÉGIMEN CON MAYOR PROBABILIDAD
        let bestRegime = this.REGIME_TYPES.STABLE;
        let bestScore = 0;
        
        for (const [regime, condition] of Object.entries(decisionMatrix)) {
            if (condition) {
                const regimeProbability = this.calculateRegimeProbability(regime, regimeScore, quantumFactor, lunarFactor);
                if (regimeProbability > bestScore) {
                    bestScore = regimeProbability;
                    bestRegime = regime;
                }
            }
        }
        
        return bestRegime;
    }
    
    /**
     *  CALCULAR PROBABILIDAD DE RÉGIMEN
     */
    calculateRegimeProbability(regime, regimeScore, quantumFactor, lunarFactor) {
        const baseProbability = regimeScore;
        const quantumAdjustment = Math.abs(quantumFactor) * 0.3;
        const lunarAdjustment = Math.abs(lunarFactor) * 0.2;
        
        return Math.min(1, baseProbability + quantumAdjustment + lunarAdjustment);
    }
    
    /**
     * [DATA] CALCULAR ESTABILIDAD DEL RÉGIMEN
     */
    calculateRegimeStability(regimeScore) {
        //  ESTABILIDAD BASADA EN COHERENCIA CUÁNTICA
        const timeFactor = Date.now() / (this.constants._888 * 1000);
        const coherence = Math.abs(Math.sin(timeFactor * this.constants.));
        
        // [UP] ESTABILIDAD COMBINADA
        const scoreStability = 1 - Math.abs(regimeScore - 0.5) * 2; // Más estable cerca de 0.5
        const quantumStability = coherence;
        
        return (scoreStability + quantumStability) / 2;
    }
    
    /**
     * [TIME] CALCULAR DURACIÓN DEL RÉGIMEN
     */
    calculateRegimeDuration(currentRegime) {
        if (this.currentRegime && this.currentRegime.type === currentRegime) {
            const startTime = this.currentRegime.startTime || Date.now();
            return Date.now() - startTime;
        }
        return 0;
    }
    
    /**
     * [ENDPOINTS] CALCULAR CONFIANZA DEL RÉGIMEN
     */
    calculateRegimeConfidence(regimeScore) {
        //  CONFIANZA BASADA EN COHERENCIA Y PERSISTENCIA
        const timeFactor = Date.now() / (this.constants._888 * 1000);
        const quantumCoherence = Math.abs(Math.sin(timeFactor * this.constants.));
        
        const scoreConfidence = Math.abs(regimeScore - 0.5) * 2; // Más confianza en extremos
        const quantumConfidence = quantumCoherence;
        
        return Math.min(1, (scoreConfidence + quantumConfidence) / 2);
    }
    
    /**
     * [SEARCH] EXTRAER SEÑALES DE RÉGIMEN
     */
    extractRegimeSignals(marketData) {
        const signals = [];
        
        // [DATA] SEÑALES DE VOLATILIDAD
        if (marketData.volatility > 0.7) {
            signals.push({ type: 'HIGH_VOLATILITY', strength: marketData.volatility, timestamp: Date.now() });
        }
        
        // [UP] SEÑALES DE TENDENCIA
        if (Math.abs(marketData.trend) > 0.6) {
            signals.push({ 
                type: marketData.trend > 0 ? 'STRONG_BULLISH' : 'STRONG_BEARISH', 
                strength: Math.abs(marketData.trend), 
                timestamp: Date.now() 
            });
        }
        
        //  SEÑALES DE LIQUIDEZ
        if (marketData.liquidity < 0.3) {
            signals.push({ type: 'LIQUIDITY_CRISIS', strength: 1 - marketData.liquidity, timestamp: Date.now() });
        }
        
        // [FAST] SEÑALES DE MOMENTUM
        if (marketData.momentum > 0.8) {
            signals.push({ type: 'MOMENTUM_SURGE', strength: marketData.momentum, timestamp: Date.now() });
        }
        
        return signals;
    }
    
    /**
     *  PREDECIR PRÓXIMO RÉGIMEN
     */
    async predictNextRegime(currentRegime) {
        try {
            console.log(' [PREDICTION] Prediciendo próximo régimen...');
            
            // [DATA] ANÁLISIS DE PATRONES HISTÓRICOS
            const historicalPatterns = this.analyzeHistoricalPatterns();
            
            //  ANÁLISIS CUÁNTICO TEMPORAL
            const quantumAnalysis = this.performQuantumTemporalAnalysis();
            
            // [ENDPOINTS] ANÁLISIS DE TRANSICIONES
            const transitionAnalysis = this.analyzeRegimeTransitions();
            
            //  CÁLCULO DE PROBABILIDADES
            const regimeProbabilities = this.calculateRegimeProbabilities(
                currentRegime,
                historicalPatterns,
                quantumAnalysis,
                transitionAnalysis
            );
            
            // [ENDPOINTS] SELECCIONAR RÉGIMEN MÁS PROBABLE
            const nextRegime = this.selectMostProbableRegime(regimeProbabilities);
            
            // [TIME] ESTIMAR TIEMPO DE TRANSICIÓN
            const transitionTime = this.estimateTransitionTime(currentRegime, nextRegime);
            
            // [DATA] CONSTRUIR PREDICCIÓN
            const prediction = {
                type: nextRegime.type,
                probability: nextRegime.probability,
                confidence: nextRegime.confidence,
                estimated_transition_time: transitionTime,
                signals: nextRegime.signals,
                analysis: {
                    historical_patterns: historicalPatterns,
                    quantum_analysis: quantumAnalysis,
                    transition_analysis: transitionAnalysis
                },
                timestamp: new Date().toISOString()
            };
            
            // [UP] ACTUALIZAR PREDICCIONES
            this.regimePredictions.push(prediction);
            
            console.log(` [PREDICTION] Próximo régimen: ${prediction.type} (${prediction.probability.toFixed(1)}%)`);
            
            return prediction;
            
        } catch (error) {
            console.error('[RED] [PREDICTION] Error prediciendo régimen:', error);
            throw error;
        }
    }
    
    /**
     * [DATA] ANALIZAR PATRONES HISTÓRICOS
     */
    analyzeHistoricalPatterns() {
        if (this.regimeHistory.length < 2) {
            return { patterns: [], confidence: 0.3 };
        }
        
        const patterns = [];
        const recentRegimes = this.regimeHistory.slice(-10);
        
        // [SEARCH] BUSCAR PATRONES DE TRANSICIÓN
        for (let i = 0; i < recentRegimes.length - 1; i++) {
            const current = recentRegimes[i];
            const next = recentRegimes[i + 1];
            
            patterns.push({
                from: current.type,
                to: next.type,
                duration: current.duration,
                stability: current.stability,
                confidence: current.confidence
            });
        }
        
        //  CALCULAR CONFIANZA DE PATRONES
        const patternConfidence = Math.min(1, patterns.length / 5);
        
        return { patterns, confidence: patternConfidence };
    }
    
    /**
     *  ANÁLISIS CUÁNTICO TEMPORAL
     */
    performQuantumTemporalAnalysis() {
        const timeFactor = Date.now() / (this.constants._888 * 1000);
        const lunarPhase = (Date.now() / (29.53058867 * 24 * 60 * 60 * 1000)) % 1;
        const halvingPhase = (Date.now() % (210000 * 24 * 60 * 60 * 1000)) / (210000 * 24 * 60 * 60 * 1000);
        
        //  FACTORES CUÁNTICOS
        const quantumResonance = Math.sin(timeFactor * this.constants.);
        const lunarInfluence = Math.cos(lunarPhase * this.constants._inv);
        const halvingInfluence = Math.sin(halvingPhase * this.constants.);
        
        // [ENDPOINTS] ANÁLISIS DE CICLOS
        const cycleAnalysis = {
            quantum_cycle: Math.abs(quantumResonance),
            lunar_cycle: Math.abs(lunarInfluence),
            halving_cycle: Math.abs(halvingInfluence),
            combined_cycle: (Math.abs(quantumResonance) + Math.abs(lunarInfluence) + Math.abs(halvingInfluence)) / 3
        };
        
        //  PREDICCIÓN CUÁNTICA
        const quantumPrediction = {
            bullish_probability: Math.max(0, quantumResonance),
            bearish_probability: Math.max(0, -quantumResonance),
            volatile_probability: Math.abs(lunarInfluence),
            stable_probability: 1 - Math.abs(halvingInfluence)
        };
        
        return {
            cycle_analysis: cycleAnalysis,
            quantum_prediction: quantumPrediction,
            confidence: Math.abs(quantumResonance * lunarInfluence * halvingInfluence)
        };
    }
    
    /**
     * [RELOAD] ANALIZAR TRANSICIONES DE RÉGIMEN
     */
    analyzeRegimeTransitions() {
        const transitions = [];
        
        for (let i = 0; i < this.regimeHistory.length - 1; i++) {
            const from = this.regimeHistory[i];
            const to = this.regimeHistory[i + 1];
            
            if (from.type !== to.type) {
                transitions.push({
                    from: from.type,
                    to: to.type,
                    duration: from.duration,
                    stability_before: from.stability,
                    stability_after: to.stability,
                    confidence_change: to.confidence - from.confidence
                });
            }
        }
        
        return {
            transitions,
            total_transitions: transitions.length,
            average_duration: transitions.reduce((sum, t) => sum + t.duration, 0) / Math.max(1, transitions.length)
        };
    }
    
    /**
     *  CALCULAR PROBABILIDADES DE RÉGIMEN
     */
    calculateRegimeProbabilities(currentRegime, historicalPatterns, quantumAnalysis, transitionAnalysis) {
        const probabilities = {};
        
        // [ENDPOINTS] INICIALIZAR PROBABILIDADES BASE
        for (const regimeType of Object.values(this.REGIME_TYPES)) {
            probabilities[regimeType] = {
                type: regimeType,
                probability: 0.1, // Probabilidad base
                confidence: 0.5,
                signals: []
            };
        }
        
        // [DATA] AJUSTAR POR PATRONES HISTÓRICOS
        for (const pattern of historicalPatterns.patterns) {
            if (pattern.from === currentRegime.type) {
                const targetRegime = probabilities[pattern.to];
                targetRegime.probability += pattern.confidence * 0.3;
                targetRegime.confidence = Math.max(targetRegime.confidence, pattern.confidence);
            }
        }
        
        //  AJUSTAR POR ANÁLISIS CUÁNTICO
        const quantumPred = quantumAnalysis.quantum_prediction;
        probabilities[this.REGIME_TYPES.BULL_MARKET].probability += quantumPred.bullish_probability * 0.4;
        probabilities[this.REGIME_TYPES.BEAR_MARKET].probability += quantumPred.bearish_probability * 0.4;
        probabilities[this.REGIME_TYPES.VOLATILE].probability += quantumPred.volatile_probability * 0.3;
        probabilities[this.REGIME_TYPES.STABLE].probability += quantumPred.stable_probability * 0.3;
        
        // [RELOAD] AJUSTAR POR TRANSICIONES
        for (const transition of transitionAnalysis.transitions) {
            if (transition.from === currentRegime.type) {
                const targetRegime = probabilities[transition.to];
                targetRegime.probability += 0.2;
                targetRegime.signals.push(`Transition from ${transition.from}`);
            }
        }
        
        //  NORMALIZAR PROBABILIDADES
        const totalProbability = Object.values(probabilities).reduce((sum, p) => sum + p.probability, 0);
        if (totalProbability > 0) {
            for (const regime of Object.values(probabilities)) {
                regime.probability /= totalProbability;
            }
        }
        
        return probabilities;
    }
    
    /**
     * [ENDPOINTS] SELECCIONAR RÉGIMEN MÁS PROBABLE
     */
    selectMostProbableRegime(probabilities) {
        let bestRegime = null;
        let bestProbability = 0;
        
        for (const regime of Object.values(probabilities)) {
            if (regime.probability > bestProbability) {
                bestProbability = regime.probability;
                bestRegime = regime;
            }
        }
        
        return bestRegime || {
            type: this.REGIME_TYPES.STABLE,
            probability: 0.5,
            confidence: 0.5,
            signals: ['Default selection']
        };
    }
    
    /**
     * [TIME] ESTIMAR TIEMPO DE TRANSICIÓN
     */
    estimateTransitionTime(currentRegime, nextRegime) {
        //  ESTIMACIÓN BASADA EN FACTORES CUÁNTICOS
        const timeFactor = Date.now() / (this.constants._888 * 1000);
        const quantumFactor = Math.abs(Math.sin(timeFactor * this.constants.));
        
        // [DATA] TIEMPO BASE POR TIPO DE TRANSICIÓN
        const baseTimes = {
            [this.REGIME_TYPES.BULL_MARKET]: 24 * 60 * 60 * 1000, // 24 horas
            [this.REGIME_TYPES.BEAR_MARKET]: 12 * 60 * 60 * 1000, // 12 horas
            [this.REGIME_TYPES.VOLATILE]: 6 * 60 * 60 * 1000,     // 6 horas
            [this.REGIME_TYPES.STABLE]: 48 * 60 * 60 * 1000,      // 48 horas
            [this.REGIME_TYPES.SIDEWAYS]: 36 * 60 * 60 * 1000     // 36 horas
        };
        
        const baseTime = baseTimes[nextRegime.type] || 24 * 60 * 60 * 1000;
        const quantumAdjustment = 1 + (quantumFactor - 0.5) * 0.5; // ±25% ajuste
        
        return Math.round(baseTime * quantumAdjustment);
    }
    
    /**
     * [UP] ACTUALIZAR HISTORIAL DE RÉGIMEN
     */
    updateRegimeHistory(regime) {
        // [RELOAD] ACTUALIZAR RÉGIMEN ACTUAL
        if (this.currentRegime && this.currentRegime.type === regime.type) {
            this.currentRegime.duration = regime.duration;
            this.currentRegime.stability = regime.stability;
            this.currentRegime.confidence = regime.confidence;
        } else {
            //  NUEVO RÉGIMEN
            regime.startTime = Date.now();
            this.currentRegime = regime;
            this.regimeHistory.push(regime);
            
            // [SEARCH] DETECTAR SEÑALES DE TRANSICIÓN
            this.detectTransitionSignals(regime);
        }
        
        // [DATA] LIMITAR HISTORIAL
        if (this.regimeHistory.length > 100) {
            this.regimeHistory = this.regimeHistory.slice(-50);
        }
    }
    
    /**
     * [SEARCH] DETECTAR SEÑALES DE TRANSICIÓN
     */
    detectTransitionSignals(regime) {
        if (this.regimeHistory.length < 2) return;
        
        const previousRegime = this.regimeHistory[this.regimeHistory.length - 2];
        
        if (previousRegime.type !== regime.type) {
            const transitionSignal = {
                from: previousRegime.type,
                to: regime.type,
                timestamp: Date.now(),
                confidence: regime.confidence,
                stability_change: regime.stability - previousRegime.stability
            };
            
            this.transitionSignals.push(transitionSignal);
            console.log(`[RELOAD] [TRANSITION] ${transitionSignal.from}  ${transitionSignal.to} (Confianza: ${transitionSignal.confidence.toFixed(1)}%)`);
        }
    }
    
    /**
     * [DATA] OBTENER SEÑALES DE TRANSICIÓN
     */
    getTransitionSignals() {
        return this.transitionSignals.slice(-10); // Últimas 10 transiciones
    }
    
    /**
     *  ANALIZAR TENDENCIAS DE ESTABILIDAD
     */
    analyzeStabilityTrends() {
        if (this.regimeHistory.length < 5) {
            return { trend: 'NEUTRAL', confidence: 0.3 };
        }
        
        const recentStabilities = this.regimeHistory.slice(-5).map(r => r.stability);
        const trend = recentStabilities[recentStabilities.length - 1] - recentStabilities[0];
        
        return {
            trend: trend > 0.1 ? 'INCREASING' : trend < -0.1 ? 'DECREASING' : 'STABLE',
            confidence: Math.abs(trend),
            average_stability: recentStabilities.reduce((sum, s) => sum + s, 0) / recentStabilities.length
        };
    }
    
    /**
     * [RELOAD] ANALIZAR CICLOS DE MERCADO
     */
    analyzeMarketCycles() {
        if (this.regimeHistory.length < 10) {
            return { cycles: [], average_cycle_length: 0 };
        }
        
        const cycles = [];
        let cycleStart = null;
        
        for (let i = 0; i < this.regimeHistory.length; i++) {
            const regime = this.regimeHistory[i];
            
            if (regime.type === this.REGIME_TYPES.BULL_MARKET && !cycleStart) {
                cycleStart = regime.timestamp;
            } else if (regime.type === this.REGIME_TYPES.BEAR_MARKET && cycleStart) {
                const cycleLength = new Date(regime.timestamp) - new Date(cycleStart);
                cycles.push(cycleLength);
                cycleStart = null;
            }
        }
        
        const averageCycleLength = cycles.length > 0 ? 
            cycles.reduce((sum, c) => sum + c, 0) / cycles.length : 0;
        
        return { cycles, average_cycle_length: averageCycleLength };
    }
    
    /**
     *  CALCULAR PROBABILIDAD DE TRANSICIÓN
     */
    calculateTransitionProbability(currentRegime, regimeScore) {
        const timeFactor = Date.now() / (this.constants._888 * 1000);
        const quantumFactor = Math.sin(timeFactor * this.constants.);
        
        // [DATA] FACTORES DE TRANSICIÓN
        const stabilityFactor = 1 - currentRegime.stability;
        const scoreFactor = Math.abs(regimeScore - 0.5) * 2;
        const quantumFactor = Math.abs(quantumFactor);
        
        return Math.min(1, (stabilityFactor + scoreFactor + quantumFactor) / 3);
    }
    
    /**
     * [DATA] OBTENER RESUMEN DE RÉGIMEN
     */
    getRegimeSummary() {
        return {
            current_regime: this.currentRegime,
            regime_history: this.regimeHistory.slice(-10),
            transition_signals: this.getTransitionSignals(),
            predictions: this.regimePredictions.slice(-5),
            statistics: {
                total_regimes: this.regimeHistory.length,
                total_transitions: this.transitionSignals.length,
                average_regime_duration: this.regimeHistory.reduce((sum, r) => sum + r.duration, 0) / Math.max(1, this.regimeHistory.length),
                most_common_regime: this.getMostCommonRegime()
            }
        };
    }
    
    /**
     * [UP] OBTENER RÉGIMEN MÁS COMÚN
     */
    getMostCommonRegime() {
        const regimeCounts = {};
        
        for (const regime of this.regimeHistory) {
            regimeCounts[regime.type] = (regimeCounts[regime.type] || 0) + 1;
        }
        
        let mostCommon = null;
        let maxCount = 0;
        
        for (const [regime, count] of Object.entries(regimeCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = regime;
            }
        }
        
        return { type: mostCommon, count: maxCount };
    }
}

module.exports = QuantumMarketRegimeDetector;

/**
 * TEMPORAL METRICS ENGINE v2.0
 * Sistema avanzado de métricas temporales con resonancia λ_7919
 * Integra ciclos lunares, ventanas primas y edge temporal θ-aware
 * 
 * @author QBTC Quantum confidence Trading System
 * @version 2.0.0
 * @since 2024
 */

const { kernelRNG } = require('../utils/kernel-rng');
const safeMath = require('../utils/safe-math');
const { secure_logger } = require('./utils/secure-logger');

class TemporalMetricsEngine {
    constructor(config = {}) {
        // Inicializar logger primero
        this.logger = secure_logger.createLogger('TemporalMetricsEngine');
        
        // Constantes cuánticas fundamentales
        this.LAMBDA_7919 = Math.log(7919); // λ_7919 = 8.976106164279123
        this.QUANTUM_Z = { real: 9, imag: 16 }; // z = 9 + 16i
        this.RESONANCE_FREQ = 888; // Hz
        this.GOLDEN_RATIO = 1.618033988749895;
        
        // Números primos para ventanas temporales
        this.PRIME_WINDOWS = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
        
        // Configuración del sistema
        this.config = {
            coherence_threshold: config.coherence_threshold || 0.618,
            edge_threshold: config.edge_threshold || 0.05,
            theta_budget_multiplier: config.theta_budget_multiplier || 1.0,
            lunar_influence_factor: config.lunar_influence_factor || 0.15,
            prime_filter_sensitivity: config.prime_filter_sensitivity || 0.75,
            ...config
        };
        
        // Cache para optimización de rendimiento
        this.metricsCache = new Map();
        this.coherenceCache = new Map();
        this.lunarCache = new Map();
        
        // Estado del sistema en segundo plano
        this.isRunning = false;
        this.lastUpdate = Date.now();
        this.metrics = {
            calculations_performed: 0,
            cache_hits: 0,
            cache_misses: 0,
            coherence_events: 0,
            dissonance_events: 0
        };
        
        this.logger.info('TemporalMetricsEngine initialized', {
            lambda_7919: this.LAMBDA_7919,
            prime_windows: this.PRIME_WINDOWS.length,
            config: this.config
        });
    }
    
    /**
     * Calcula el Edge Temporal (E_temporal) integrando theta, DTE y resonancia λ_7919
     */
    calculateTemporalEdge(optionData) {
        const cacheKey = `temporal_edge_${optionData.symbol}_${optionData.expiry}`;
        
        if (this.metricsCache.has(cacheKey)) {
            this.metrics.cache_hits++;
            return this.metricsCache.get(cacheKey);
        }
        
        try {
            // 1. Theta anualizada normalizada
            const thetaNormalized = this._normalizeThetaAnnualized(optionData.theta, optionData.price);
            
            // 2. DTE ajustado a bandas primas
            const dtePrimeBand = this._mapDTEToPrimeBand(optionData.daysToExpiry);
            const dteFactor = this._calculateDTEFactor(dtePrimeBand);
            
            // 3. Resonancia λ_7919 modulada
            const lunarPhase = this._getCurrentLunarPhase();
            const resonanceModulation = this._calculateResonanceModulation(lunarPhase, dtePrimeBand);
            
            // 4. Edge temporal combinado
            const temporalEdge = this._combineTemporalFactors(
                thetaNormalized, 
                dteFactor, 
                resonanceModulation
            );
            
            const result = {
                edge_temporal: temporalEdge,
                theta_normalized: thetaNormalized,
                dte_prime_band: dtePrimeBand,
                dte_factor: dteFactor,
                lunar_phase: lunarPhase,
                resonance_modulation: resonanceModulation,
                timestamp: Date.now()
            };
            
            // Cache con TTL de 5 minutos
            this.metricsCache.set(cacheKey, result);
            setTimeout(() => this.metricsCache.delete(cacheKey), 300000);
            this.metrics.cache_misses++;
            this.metrics.calculations_performed++;
            
            return result;
            
        } catch (error) {
            this.logger.error('Error calculating temporal edge', { error: error.message, optionData });
            return this._getDefaultTemporalEdge();
        }
    }
    
    /**
     * Calcula la Coherencia Prima (C_prime) usando indicadores técnicos en ventanas primas
     */
    calculatePrimeCoherence(marketData, symbol) {
        const cacheKey = `prime_coherence_${symbol}_${Date.now() - (Date.now() % 60000)}`;
        
        if (this.coherenceCache.has(cacheKey)) {
            this.metrics.cache_hits++;
            return this.coherenceCache.get(cacheKey);
        }
        
        try {
            const coherenceScores = [];
            
            // Calcular coherencia para cada ventana prima
            for (const primeWindow of this.PRIME_WINDOWS) {
                if (marketData.length >= primeWindow) {
                    const windowData = marketData.slice(-primeWindow);
                    const coherenceScore = this._calculateWindowCoherence(windowData, primeWindow);
                    coherenceScores.push({
                        window: primeWindow,
                        coherence: coherenceScore,
                        weight: this._getPrimeWeight(primeWindow)
                    });
                }
            }
            
            // Coherencia ponderada
            const weightedCoherence = this._calculateWeightedCoherence(coherenceScores);
            
            // Detectar eventos de coherencia/disonancia
            if (weightedCoherence >= this.config.coherence_threshold) {
                this.metrics.coherence_events++;
                this.logger.debug('Coherence event detected', { 
                    symbol, 
                    coherence: weightedCoherence,
                    threshold: this.config.coherence_threshold 
                });
            } else if (weightedCoherence < 0.3) {
                this.metrics.dissonance_events++;
                this.logger.warn('Dissonance event detected', { 
                    symbol, 
                    coherence: weightedCoherence 
                });
            }
            
            const result = {
                prime_coherence: weightedCoherence,
                coherence_scores: coherenceScores,
                coherence_grade: this._gradeCoherence(weightedCoherence),
                timestamp: Date.now()
            };
            
            // Cache con TTL de 1 minuto
            this.coherenceCache.set(cacheKey, result);
            setTimeout(() => this.coherenceCache.delete(cacheKey), 60000);
            this.metrics.calculations_performed++;
            
            return result;
            
        } catch (error) {
            this.logger.error('Error calculating prime coherence', { error: error.message, symbol });
            return this._getDefaultPrimeCoherence();
        }
    }
    
    /**
     * Calcula la Resonancia λ_7919 (R_λ) con modulación temporal
     */
    calculateLambdaResonance(timestamp, marketVolatility) {
        try {
            // Fase temporal basada en λ_7919
            const temporalPhase = (timestamp / 1000) % this.LAMBDA_7919;
            
            // Modulación por volatilidad de mercado
            const volatilityFactor = safeMath.clamp(marketVolatility / 0.3, 0.1, 3.0);
            
            // Resonancia cuántica
            const quantumResonance = Math.sin(2 * Math.PI * temporalPhase / this.LAMBDA_7919) * 
                                   Math.cos(this.RESONANCE_FREQ * temporalPhase / 1000);
            
            // Factor de amplificación weighted
            const gravitationalAmplifier = this._calculateGravitationalAmplifier(temporalPhase);
            
            // Resonancia λ_7919 final
            const lambdaResonance = quantumResonance * volatilityFactor * gravitationalAmplifier;
            
            return {
                lambda_resonance: lambdaResonance,
                temporal_phase: temporalPhase,
                volatility_factor: volatilityFactor,
                quantum_resonance: quantumResonance,
                gravitational_amplifier: gravitationalAmplifier,
                resonance_grade: this._gradeLambdaResonance(lambdaResonance),
                timestamp: Date.now()
            };
            
        } catch (error) {
            this.logger.error('Error calculating lambda resonance', { error: error.message });
            return this._getDefaultLambdaResonance();
        }
    }
    
    /**
     * Sistema integrado de evaluación de métricas temporales
     */
    evaluateTemporalMetrics(optionData, marketData, symbol) {
        const temporalEdge = this.calculateTemporalEdge(optionData);
        const primeCoherence = this.calculatePrimeCoherence(marketData, symbol);
        const lambdaResonance = this.calculateLambdaResonance(Date.now(), marketData.volatility || 0.2);
        
        // Score compuesto temporal
        const compositeScore = this._calculateCompositeTemporalScore(
            temporalEdge, 
            primeCoherence, 
            lambdaResonance
        );
        
        // Recomendación de trading
        const tradingRecommendation = this._generateTradingRecommendation(
            temporalEdge,
            primeCoherence,
            lambdaResonance,
            compositeScore
        );
        
        return {
            temporal_edge: temporalEdge,
            prime_coherence: primeCoherence,
            lambda_resonance: lambdaResonance,
            composite_score: compositeScore,
            trading_recommendation: tradingRecommendation,
            evaluation_timestamp: Date.now()
        };
    }
    
    // ==================== MÉTODOS PRIVADOS ====================
    
    _normalizeThetaAnnualized(theta, optionPrice) {
        const annualizedTheta = Math.abs(theta) * 365;
        return safeMath.safeDivide(annualizedTheta, optionPrice, 0);
    }
    
    _mapDTEToPrimeBand(dte) {
        // Mapea DTE a la banda prima más cercana
        return this.PRIME_WINDOWS.reduce((closest, prime) => 
            Math.abs(prime - dte) < Math.abs(closest - dte) ? prime : closest
        );
    }
    
    _calculateDTEFactor(dtePrimeBand) {
        // Factor exponencial decreciente para DTE más largos
        const normalizedDTE = dtePrimeBand / 60; // Normalizar a ~2 meses
        return Math.exp(-normalizedDTE * this.GOLDEN_RATIO);
    }
    
    _getCurrentLunarPhase() {
        // Ciclo lunar simplificado (29.53 días)
        const lunarCycle = 29.53 * 24 * 60 * 60 * 1000; // ms
        const knownNewMoon = new Date('2024-01-11').getTime(); // Luna nueva conocida
        const timeSinceNewMoon = Date.now() - knownNewMoon;
        return (timeSinceNewMoon % lunarCycle) / lunarCycle; // 0-1
    }
    
    _calculateResonanceModulation(lunarPhase, dtePrimeBand) {
        const lunarInfluence = Math.sin(2 * Math.PI * lunarPhase) * this.config.lunar_influence_factor;
        const primeHarmonic = Math.cos(2 * Math.PI * dtePrimeBand / 47); // 47 es el mayor primo en ventanas
        const lambdaModulation = Math.sin(this.LAMBDA_7919 * lunarPhase);
        
        return (lunarInfluence + primeHarmonic + lambdaModulation) / 3;
    }
    
    _combineTemporalFactors(thetaNormalized, dteFactor, resonanceModulation) {
        // Combinación weighted con bias hacia theta
        const thetaWeight = 0.5;
        const dteWeight = 0.3;
        const resonanceWeight = 0.2;
        
        return (thetaNormalized * thetaWeight + 
                dteFactor * dteWeight + 
                Math.abs(resonanceModulation) * resonanceWeight);
    }
    
    _calculateWindowCoherence(windowData, primeWindow) {
        if (windowData.length === 0) return 0;
        
        // Calcular múltiples indicadores técnicos
        const sma = this._calculateSMA(windowData);
        const rsi = this._calculateRSI(windowData, Math.min(14, primeWindow));
        const momentum = this._calculateMomentum(windowData, Math.floor(primeWindow / 2));
        
        // Coherencia basada en consistencia direccional
        const priceConsistency = this._calculatePriceConsistency(windowData);
        const volumeConsistency = this._calculateVolumeConsistency(windowData);
        
        // Score de coherencia combinado
        return (priceConsistency * 0.4 + volumeConsistency * 0.3 + 
                Math.abs(rsi - 50) / 50 * 0.2 + momentum * 0.1);
    }
    
    _getPrimeWeight(primeWindow) {
        // Pesos decrecientes para ventanas primas más grandes
        const maxPrime = Math.max(...this.PRIME_WINDOWS);
        return safeMath.safeDivide(maxPrime - primeWindow + 1, maxPrime, 1);
    }
    
    _calculateWeightedCoherence(coherenceScores) {
        if (coherenceScores.length === 0) return 0;
        
        let weightedSum = 0;
        let totalWeight = 0;
        
        for (const score of coherenceScores) {
            weightedSum += score.coherence * score.weight;
            totalWeight += score.weight;
        }
        
        return safeMath.safeDivide(weightedSum, totalWeight, 0);
    }
    
    _calculateGravitationalAmplifier(temporalPhase) {
        // Amplificador basado en constantes cuánticas z = 9 + 16i
        const realPart = this.QUANTUM_Z.real * Math.cos(temporalPhase);
        const imagPart = this.QUANTUM_Z.imag * Math.sin(temporalPhase);
        const magnitude = Math.sqrt(realPart * realPart + imagPart * imagPart);
        
        return safeMath.clamp(magnitude / 25, 0.1, 2.0); // Normalizar
    }
    
    _calculateCompositeTemporalScore(temporalEdge, primeCoherence, lambdaResonance) {
        // Score compuesto con pesos optimizados
        const edgeWeight = 0.45;
        const coherenceWeight = 0.35;
        const resonanceWeight = 0.20;
        
        const edgeScore = Math.min(temporalEdge.edge_temporal / 0.1, 1.0);
        const coherenceScore = primeCoherence.prime_coherence;
        const resonanceScore = Math.abs(lambdaResonance.lambda_resonance);
        
        return safeMath.clamp(
            edgeScore * edgeWeight + 
            coherenceScore * coherenceWeight + 
            resonanceScore * resonanceWeight,
            0, 1
        );
    }
    
    _generateTradingRecommendation(temporalEdge, primeCoherence, lambdaResonance, compositeScore) {
        const recommendations = {
            action: 'HOLD',
            confidence: 0,
            reasoning: [],
            risk_level: 'MEDIUM',
            position_sizing: 0.1,
            stop_distance: 0.05
        };
        
        // Lógica de recomendación basada en métricas temporales
        if (compositeScore >= 0.7 && primeCoherence.prime_coherence >= this.config.coherence_threshold) {
            recommendations.action = 'BUY';
            recommendations.confidence = compositeScore;
            recommendations.reasoning.push('High temporal edge with strong prime coherence');
            recommendations.position_sizing = Math.min(compositeScore * 0.3, 0.25);
        } else if (compositeScore <= 0.3 || primeCoherence.prime_coherence < 0.3) {
            recommendations.action = 'AVOID';
            recommendations.confidence = 1 - compositeScore;
            recommendations.reasoning.push('Low composite score or poor coherence');
        }
        
        // Ajustar por resonancia λ_7919
        if (Math.abs(lambdaResonance.lambda_resonance) > 0.5) {
            recommendations.reasoning.push('Strong lambda resonance detected');
            recommendations.position_sizing *= 1.2;
            recommendations.stop_distance *= 0.8;
        }
        
        return recommendations;
    }
    
    // Métodos auxiliares para cálculos técnicos
    _calculateSMA(data, period = null) {
        const len = period || data.length;
        const sliced = data.slice(-len);
        return sliced.reduce((sum, val) => sum + (val.close || val), 0) / sliced.length;
    }
    
    _calculateRSI(data, period = 14) {
        if (data.length < period + 1) return 50; // Neutral RSI
        
        let gains = 0, losses = 0;
        for (let i = 1; i <= period; i++) {
            const change = (data[data.length - i].close || data[data.length - i]) - 
                          (data[data.length - i - 1].close || data[data.length - i - 1]);
            if (change > 0) gains += change;
            else losses -= change;
        }
        
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = safeMath.safeDivide(avgGain, avgLoss, 1);
        
        return 100 - (100 / (1 + rs));
    }
    
    _calculateMomentum(data, period = 10) {
        if (data.length < period + 1) return 0;
        
        const current = data[data.length - 1].close || data[data.length - 1];
        const previous = data[data.length - period - 1].close || data[data.length - period - 1];
        
        return safeMath.safeDivide(current - previous, previous, 0);
    }
    
    _calculatePriceConsistency(data) {
        if (data.length < 3) return 0.5;
        
        let consistentMoves = 0;
        for (let i = 2; i < data.length; i++) {
            const prev2 = data[i-2].close || data[i-2];
            const prev1 = data[i-1].close || data[i-1];
            const curr = data[i].close || data[i];
            
            const direction1 = prev1 > prev2;
            const direction2 = curr > prev1;
            
            if (direction1 === direction2) consistentMoves++;
        }
        
        return consistentMoves / (data.length - 2);
    }
    
    _calculateVolumeConsistency(data) {
        if (data.length < 3) return 0.5;
        
        const volumes = data.map(d => d.volume || kernelRNG.nextFloat() * 1000);
        const avgVolume = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;
        
        let consistentVolumes = 0;
        for (let i = 1; i < volumes.length; i++) {
            const volumeChange = Math.abs(volumes[i] - volumes[i-1]) / avgVolume;
            if (volumeChange < 0.5) consistentVolumes++; // Volumen relativamente estable
        }
        
        return consistentVolumes / (volumes.length - 1);
    }
    
    // Métodos de grading
    _gradeCoherence(coherence) {
        if (coherence >= 0.8) return 'EXCELLENT';
        if (coherence >= 0.6) return 'GOOD';
        if (coherence >= 0.4) return 'FAIR';
        return 'POOR';
    }
    
    _gradeLambdaResonance(resonance) {
        const absResonance = Math.abs(resonance);
        if (absResonance >= 0.7) return 'STRONG';
        if (absResonance >= 0.4) return 'MODERATE';
        if (absResonance >= 0.2) return 'WEAK';
        return 'MINIMAL';
    }
    
    // Métodos de fallback
    _getDefaultTemporalEdge() {
        return {
            edge_temporal: 0,
            theta_normalized: 0,
            dte_prime_band: 21,
            dte_factor: 0.5,
            lunar_phase: 0.5,
            resonance_modulation: 0,
            timestamp: Date.now()
        };
    }
    
    _getDefaultPrimeCoherence() {
        return {
            prime_coherence: 0.5,
            coherence_scores: [],
            coherence_grade: 'FAIR',
            timestamp: Date.now()
        };
    }
    
    _getDefaultLambdaResonance() {
        return {
            lambda_resonance: 0,
            temporal_phase: 0,
            volatility_factor: 1,
            quantum_resonance: 0,
            gravitational_amplifier: 1,
            resonance_grade: 'MINIMAL',
            timestamp: Date.now()
        };
    }
    
    /**
     * Sistema de monitoreo en segundo plano
     */
    startBackgroundMonitoring() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.logger.info('Background temporal monitoring started');
        
        // Ejecutar reportes periódicos en segundo plano
        const reportingInterval = setInterval(() => {
            if (!this.isRunning) {
                clearInterval(reportingInterval);
                return;
            }
            
            this._generatePerformanceReport();
        }, 300000); // Cada 5 minutos
        
        // Limpiar cache periódicamente
        const cacheCleanupInterval = setInterval(() => {
            if (!this.isRunning) {
                clearInterval(cacheCleanupInterval);
                return;
            }
            
            this._performCacheCleanup();
        }, 600000); // Cada 10 minutos
    }
    
    stopBackgroundMonitoring() {
        this.isRunning = false;
        this.logger.info('Background temporal monitoring stopped');
    }
    
    _generatePerformanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            uptime: Date.now() - this.lastUpdate,
            metrics: this.metrics,
            cache_sizes: {
                metrics: this.metricsCache.size,
                coherence: this.coherenceCache.size,
                lunar: this.lunarCache.size
            },
            lambda_7919: this.LAMBDA_7919,
            system_health: this._calculateSystemHealth()
        };
        
        this.logger.info('Temporal metrics performance report', report);
    }
    
    _performCacheCleanup() {
        const initialSize = this.metricsCache.size + this.coherenceCache.size + this.lunarCache.size;
        
        // Limpiar entradas expiradas
        [this.metricsCache, this.coherenceCache, this.lunarCache].forEach(cache => {
            for (const [key, value] of cache.entries()) {
                if (value.timestamp && Date.now() - value.timestamp > 900000) { // 15 minutos
                    cache.delete(key);
                }
            }
        });
        
        const finalSize = this.metricsCache.size + this.coherenceCache.size + this.lunarCache.size;
        this.logger.debug('Cache cleanup completed', { 
            entries_removed: initialSize - finalSize,
            final_cache_size: finalSize 
        });
    }
    
    _calculateSystemHealth() {
        const healthFactors = {
            cache_hit_ratio: safeMath.safeDivide(this.metrics.cache_hits, 
                                            this.metrics.cache_hits + this.metrics.cache_misses, 0),
            coherence_ratio: safeMath.safeDivide(this.metrics.coherence_events, 
                                            this.metrics.coherence_events + this.metrics.dissonance_events, 0.5),
            calculation_rate: this.metrics.calculations_performed / ((Date.now() - this.lastUpdate) / 60000)
        };
        
        const avgHealth = Object.values(healthFactors).reduce((sum, val) => sum + val, 0) / 
                         Object.keys(healthFactors).length;
        
        return {
            overall: avgHealth,
            factors: healthFactors,
            grade: avgHealth >= 0.8 ? 'EXCELLENT' : avgHealth >= 0.6 ? 'GOOD' : 'NEEDS_IMPROVEMENT'
        };
    }
    
    /**
     * API pública para métricas del sistema
     */
    getSystemMetrics() {
        return {
            metrics: this.metrics,
            config: this.config,
            constants: {
                lambda_7919: this.LAMBDA_7919,
                quantum_z: this.QUANTUM_Z,
                resonance_freq: this.RESONANCE_FREQ,
                prime_windows: this.PRIME_WINDOWS
            },
            cache_status: {
                metrics_cache_size: this.metricsCache.size,
                coherence_cache_size: this.coherenceCache.size,
                lunar_cache_size: this.lunarCache.size
            },
            system_health: this._calculateSystemHealth(),
            is_running: this.isRunning,
            last_update: new Date(this.lastUpdate).toISOString()
        };
    }
}

module.exports = { TemporalMetricsEngine };





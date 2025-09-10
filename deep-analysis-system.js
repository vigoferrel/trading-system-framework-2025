/**
 * DEEP ANALYSIS SYSTEM FOR ADAPTIVE OPTIONS STRATEGIES
 * ===================================================
 * Sistema avanzado de análisis para estrategias adaptativas anti-frágiles
 * Análisis granular de edge exploitation, volatility surfaces y machine learning
 */

const crypto = require('crypto');

class EnhancedEntropyEngine {
    constructor() {
        this.pattern_memory = new Map();
        this.regime_transitions = new Map();
        this.learning_rate = 0.1;
        this.entropy_buffer = [];
        this.system_state = {
            chaos_level: 0.5,
            market_memory: 0.3,
            adaptation_speed: 0.7
        };
    }
    
    // Enhanced system-level entropy using multiple sources
    getSystemEntropy() {
        const system_metrics = process.memoryUsage();
        const time_chaos = Date.now() % 1000000;
        const crypto_random = crypto.randomBytes(8).readBigUInt64BE(0);
        
        // Combine multiple entropy sources
        const entropy_value = (
            Number(crypto_random % BigInt(1000000)) / 1000000 +
            (system_metrics.heapUsed % 1000000) / 1000000 +
            (time_chaos / 1000000) +
            Math.sin(Date.now() / 10000) * 0.5 + 0.5
        ) / 4;
        
        this.entropy_buffer.push(entropy_value);
        if (this.entropy_buffer.length > 100) {
            this.entropy_buffer.shift();
        }
        
        return entropy_value;
    }
    
    // Pattern-aware random generation
    adaptiveRandom(context = 'default', pattern_weight = 0.3) {
        const base_entropy = this.getSystemEntropy();
        
        if (this.pattern_memory.has(context)) {
            const pattern = this.pattern_memory.get(context);
            const pattern_influence = pattern.success_rate * pattern_weight;
            return Math.min(1, Math.max(0, base_entropy * (1 - pattern_weight) + pattern_influence));
        }
        
        return base_entropy;
    }
    
    // Learn from strategy outcomes
    learnPattern(context, outcome, confidence = 1.0) {
        const current = this.pattern_memory.get(context) || {
            success_rate: 0.5,
            sample_count: 0,
            confidence_sum: 0
        };
        
        current.sample_count += 1;
        current.confidence_sum += confidence;
        
        // Adaptive learning rate based on confidence
        const adaptive_lr = this.learning_rate * confidence;
        current.success_rate = current.success_rate * (1 - adaptive_lr) + outcome * adaptive_lr;
        
        this.pattern_memory.set(context, current);
    }
    
    // Advanced entropy analysis
    getEntropyMetrics() {
        if (this.entropy_buffer.length < 10) return null;
        
        const buffer = this.entropy_buffer;
        const mean = buffer.reduce((sum, x) => sum + x, 0) / buffer.length;
        const variance = buffer.reduce((sum, x) => sum + (x - mean) ** 2, 0) / buffer.length;
        
        return {
            mean,
            variance,
            std_dev: Math.sqrt(variance),
            entropy_level: variance > 0.1 ? 'high' : variance > 0.05 ? 'medium' : 'low',
            buffer_size: buffer.length,
            trend: buffer.length > 20 ? this.calculateTrend(buffer.slice(-20)) : 0
        };
    }
    
    calculateTrend(values) {
        if (values.length < 2) return 0;
        const n = values.length;
        const x_sum = (n * (n - 1)) / 2;
        const y_sum = values.reduce((sum, y) => sum + y, 0);
        const xy_sum = values.reduce((sum, y, i) => sum + i * y, 0);
        const xx_sum = (n * (n - 1) * (2 * n - 1)) / 6;
        
        return (n * xy_sum - x_sum * y_sum) / (n * xx_sum - x_sum * x_sum);
    }
}

class VolatilitySurfaceAnalyzer {
    constructor() {
        this.surface_cache = new Map();
        this.anomaly_threshold = 0.15;
        this.arbitrage_threshold = 0.05;
    }
    
    // Advanced volatility surface construction
    constructVolatilitySurface(price_data, current_index) {
        const current_price = price_data[current_index].price;
        const strikes = this.generateStrikeRange(current_price);
        const expiries = [7, 14, 30, 60, 90]; // Days to expiration
        
        const surface = {
            strikes,
            expiries,
            implied_vols: new Map(),
            skew_metrics: {},
            term_structure: {},
            anomalies: [],
            arbitrage_opportunities: []
        };
        
        // Calculate historical volatility for reference
        const hist_vol = this.calculateHistoricalVolatility(price_data, current_index, 30);
        
        // Generate implied volatility surface
        for (const expiry of expiries) {
            surface.implied_vols.set(expiry, new Map());
            
            for (const strike of strikes) {
                const moneyness = strike / current_price;
                const time_to_expiry = expiry / 365;
                
                // Enhanced vol surface model with regime awareness
                const base_vol = this.calculateBaseVolatility(hist_vol, moneyness, time_to_expiry);
                const skew_adjustment = this.calculateSkewAdjustment(moneyness);
                const term_adjustment = this.calculateTermStructureAdjustment(time_to_expiry);
                
                const implied_vol = base_vol + skew_adjustment + term_adjustment;
                surface.implied_vols.get(expiry).set(strike, implied_vol);
            }
            
            // Analyze term structure
            surface.term_structure[expiry] = this.analyzeTermStructure(surface.implied_vols.get(expiry), current_price);
        }
        
        // Detect anomalies and arbitrage opportunities
        this.detectSurfaceAnomalies(surface, current_price);
        this.detectArbitrageOpportunities(surface, current_price);
        
        return surface;
    }
    
    generateStrikeRange(current_price, range_pct = 0.3) {
        const strikes = [];
        const min_strike = current_price * (1 - range_pct);
        const max_strike = current_price * (1 + range_pct);
        const step = (max_strike - min_strike) / 20;
        
        for (let strike = min_strike; strike <= max_strike; strike += step) {
            strikes.push(Math.round(strike));
        }
        
        return strikes;
    }
    
    calculateBaseVolatility(hist_vol, moneyness, time_to_expiry) {
        // Base volatility with volatility clustering
        const vol_clustering = 1 + 0.1 * Math.sin(moneyness * Math.PI);
        const time_decay = Math.sqrt(time_to_expiry);
        
        return hist_vol * vol_clustering * time_decay;
    }
    
    calculateSkewAdjustment(moneyness) {
        // Volatility skew - puts more expensive than calls (typical equity behavior)
        if (moneyness < 1) {
            // OTM puts - higher vol
            return 0.05 * (1 - moneyness);
        } else if (moneyness > 1.05) {
            // OTM calls - lower vol
            return -0.02 * (moneyness - 1);
        }
        return 0;
    }
    
    calculateTermStructureAdjustment(time_to_expiry) {
        // Term structure effects
        if (time_to_expiry < 0.08) { // < 30 days
            return 0.1; // Short-term vol premium
        } else if (time_to_expiry > 0.25) { // > 90 days
            return -0.05; // Long-term vol discount
        }
        return 0;
    }
    
    analyzeTermStructure(expiry_vols, current_price) {
        const vols = Array.from(expiry_vols.values());
        const atm_vol = expiry_vols.get(this.findClosestStrike(expiry_vols, current_price));
        
        return {
            atm_vol,
            vol_range: Math.max(...vols) - Math.min(...vols),
            skew: this.calculateVolatilitySkew(expiry_vols, current_price),
            convexity: this.calculateVolatilityConvexity(expiry_vols, current_price)
        };
    }
    
    findClosestStrike(vol_map, target_price) {
        let closest_strike = null;
        let min_diff = Infinity;
        
        for (const strike of vol_map.keys()) {
            const diff = Math.abs(strike - target_price);
            if (diff < min_diff) {
                min_diff = diff;
                closest_strike = strike;
            }
        }
        
        return closest_strike;
    }
    
    calculateVolatilitySkew(vol_map, current_price) {
        const strikes = Array.from(vol_map.keys()).sort((a, b) => a - b);
        if (strikes.length < 3) return 0;
        
        const atm_index = strikes.findIndex(s => s >= current_price);
        if (atm_index <= 0 || atm_index >= strikes.length - 1) return 0;
        
        const put_vol = vol_map.get(strikes[atm_index - 1]);
        const call_vol = vol_map.get(strikes[atm_index + 1]);
        
        return put_vol - call_vol; // Positive = put skew
    }
    
    calculateVolatilityConvexity(vol_map, current_price) {
        const strikes = Array.from(vol_map.keys()).sort((a, b) => a - b);
        if (strikes.length < 3) return 0;
        
        const vols = strikes.map(s => vol_map.get(s));
        let convexity_sum = 0;
        let count = 0;
        
        for (let i = 1; i < vols.length - 1; i++) {
            const second_derivative = vols[i-1] - 2 * vols[i] + vols[i+1];
            convexity_sum += second_derivative;
            count++;
        }
        
        return count > 0 ? convexity_sum / count : 0;
    }
    
    detectSurfaceAnomalies(surface, current_price) {
        const anomalies = [];
        
        // Check for volatility smile inconsistencies
        for (const [expiry, vol_map] of surface.implied_vols) {
            const term_analysis = surface.term_structure[expiry];
            
            // Detect inverted volatility smile
            if (term_analysis.skew > 0.1) {
                anomalies.push({
                    type: 'inverted_smile',
                    expiry,
                    severity: term_analysis.skew,
                    description: `Unusual put skew detected: ${(term_analysis.skew * 100).toFixed(2)}%`
                });
            }
            
            // Detect excessive convexity
            if (Math.abs(term_analysis.convexity) > 0.05) {
                anomalies.push({
                    type: 'excessive_convexity',
                    expiry,
                    severity: Math.abs(term_analysis.convexity),
                    description: `Abnormal volatility convexity: ${(term_analysis.convexity * 100).toFixed(2)}%`
                });
            }
            
            // Detect term structure inversions
            const next_expiry = surface.expiries[surface.expiries.indexOf(expiry) + 1];
            if (next_expiry && surface.term_structure[next_expiry]) {
                const current_atm = term_analysis.atm_vol;
                const next_atm = surface.term_structure[next_expiry].atm_vol;
                
                if (current_atm > next_atm + 0.05) {
                    anomalies.push({
                        type: 'term_structure_inversion',
                        expiry,
                        next_expiry,
                        severity: current_atm - next_atm,
                        description: `Term structure inversion: ${expiry}d vol > ${next_expiry}d vol`
                    });
                }
            }
        }
        
        surface.anomalies = anomalies;
    }
    
    detectArbitrageOpportunities(surface, current_price) {
        const opportunities = [];
        
        // Calendar spread arbitrage
        for (let i = 0; i < surface.expiries.length - 1; i++) {
            const short_expiry = surface.expiries[i];
            const long_expiry = surface.expiries[i + 1];
            
            const short_vol_map = surface.implied_vols.get(short_expiry);
            const long_vol_map = surface.implied_vols.get(long_expiry);
            
            for (const strike of short_vol_map.keys()) {
                if (long_vol_map.has(strike)) {
                    const short_vol = short_vol_map.get(strike);
                    const long_vol = long_vol_map.get(strike);
                    const vol_diff = short_vol - long_vol;
                    
                    if (vol_diff > this.arbitrage_threshold) {
                        opportunities.push({
                            type: 'calendar_spread',
                            strategy: 'sell_short_buy_long',
                            strike,
                            short_expiry,
                            long_expiry,
                            vol_edge: vol_diff,
                            expected_profit: this.calculateCalendarSpreadProfit(vol_diff, strike, current_price),
                            confidence: Math.min(0.95, vol_diff / 0.1)
                        });
                    }
                }
            }
        }
        
        // Butterfly arbitrage
        this.detectButterflyArbitrage(surface, current_price, opportunities);
        
        surface.arbitrage_opportunities = opportunities;
    }
    
    detectButterflyArbitrage(surface, current_price, opportunities) {
        for (const [expiry, vol_map] of surface.implied_vols) {
            const strikes = Array.from(vol_map.keys()).sort((a, b) => a - b);
            
            for (let i = 1; i < strikes.length - 1; i++) {
                const lower_strike = strikes[i - 1];
                const middle_strike = strikes[i];
                const upper_strike = strikes[i + 1];
                
                const lower_vol = vol_map.get(lower_strike);
                const middle_vol = vol_map.get(middle_strike);
                const upper_vol = vol_map.get(upper_strike);
                
                // Check butterfly no-arbitrage condition
                const theoretical_middle_vol = (lower_vol + upper_vol) / 2;
                const vol_arbitrage = middle_vol - theoretical_middle_vol;
                
                if (Math.abs(vol_arbitrage) > this.arbitrage_threshold) {
                    opportunities.push({
                        type: 'butterfly_arbitrage',
                        strategy: vol_arbitrage > 0 ? 'sell_butterfly' : 'buy_butterfly',
                        expiry,
                        strikes: [lower_strike, middle_strike, upper_strike],
                        vol_edge: Math.abs(vol_arbitrage),
                        expected_profit: this.calculateButterflyProfit(vol_arbitrage, strikes, current_price),
                        confidence: Math.min(0.9, Math.abs(vol_arbitrage) / 0.1)
                    });
                }
            }
        }
    }
    
    calculateCalendarSpreadProfit(vol_edge, strike, current_price) {
        const moneyness = Math.abs(strike - current_price) / current_price;
        const base_profit = vol_edge * 100; // Basic vol edge in dollars
        const moneyness_adjustment = Math.max(0.5, 1 - moneyness); // Less profitable for OTM
        
        return base_profit * moneyness_adjustment;
    }
    
    calculateButterflyProfit(vol_edge, strikes, current_price) {
        const [lower, middle, upper] = strikes;
        const wing_width = (upper - lower) / 2;
        const atm_distance = Math.abs(middle - current_price);
        
        const base_profit = Math.abs(vol_edge) * wing_width * 0.1;
        const distance_decay = Math.exp(-atm_distance / current_price / 0.1);
        
        return base_profit * distance_decay;
    }
    
    calculateHistoricalVolatility(price_data, current_index, periods) {
        const start = Math.max(0, current_index - periods);
        const prices = price_data.slice(start, current_index + 1).map(d => d.price);
        
        if (prices.length < 2) return 0.25;
        
        const returns = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push(Math.log(prices[i] / prices[i-1]));
        }
        
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;
        
        return Math.sqrt(variance * 252);
    }
}

class RegimeAnalyzer {
    constructor() {
        this.regime_history = [];
        this.transition_matrix = new Map();
        this.regime_features = {
            volatility_threshold_low: 0.15,
            volatility_threshold_high: 0.35,
            trend_threshold: 0.02,
            momentum_threshold: 0.05
        };
    }
    
    // Enhanced regime detection with multiple features
    detectMarketRegime(price_data, current_index, lookback = 30) {
        if (current_index < lookback) return this.getDefaultRegime();
        
        const recent_data = price_data.slice(current_index - lookback, current_index + 1);
        const prices = recent_data.map(d => d.price);
        
        // Calculate multiple regime indicators
        const volatility = this.calculateRollingVolatility(prices);
        const trend = this.calculateTrend(prices);
        const momentum = this.calculateMomentum(prices);
        const mean_reversion = this.calculateMeanReversion(prices);
        const regime_stability = this.calculateRegimeStability(recent_data);
        
        // Multi-dimensional regime classification
        const regime_features = {
            volatility,
            trend,
            momentum,
            mean_reversion,
            regime_stability
        };
        
        const regime = this.classifyRegime(regime_features);
        const confidence = this.calculateRegimeConfidence(regime_features, regime);
        
        // Update regime history and transition matrix
        this.updateRegimeHistory(regime, confidence);
        
        return {
            regime,
            confidence,
            features: regime_features,
            stability: regime_stability,
            transition_probability: this.calculateTransitionProbability(regime),
            regime_duration: this.calculateRegimeDuration(regime)
        };
    }
    
    calculateRollingVolatility(prices, window = 20) {
        if (prices.length < window) return 0.25;
        
        const recent_prices = prices.slice(-window);
        const returns = [];
        
        for (let i = 1; i < recent_prices.length; i++) {
            returns.push(Math.log(recent_prices[i] / recent_prices[i-1]));
        }
        
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;
        
        return Math.sqrt(variance * 252);
    }
    
    calculateTrend(prices, window = 20) {
        if (prices.length < window) return 0;
        
        const recent_prices = prices.slice(-window);
        const n = recent_prices.length;
        
        let sum_x = 0, sum_y = 0, sum_xy = 0, sum_xx = 0;
        
        for (let i = 0; i < n; i++) {
            sum_x += i;
            sum_y += Math.log(recent_prices[i]);
            sum_xy += i * Math.log(recent_prices[i]);
            sum_xx += i * i;
        }
        
        const slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
        return slope * 252; // Annualized trend
    }
    
    calculateMomentum(prices, short_window = 5, long_window = 20) {
        if (prices.length < long_window) return 0;
        
        const short_ma = prices.slice(-short_window).reduce((sum, p) => sum + p, 0) / short_window;
        const long_ma = prices.slice(-long_window).reduce((sum, p) => sum + p, 0) / long_window;
        
        return (short_ma - long_ma) / long_ma;
    }
    
    calculateMeanReversion(prices, window = 20) {
        if (prices.length < window) return 0;
        
        const recent_prices = prices.slice(-window);
        const mean_price = recent_prices.reduce((sum, p) => sum + p, 0) / recent_prices.length;
        const current_price = recent_prices[recent_prices.length - 1];
        
        // Calculate how much price deviates from mean (normalized)
        const deviation = (current_price - mean_price) / mean_price;
        
        // Calculate autocorrelation to measure mean reversion tendency
        const returns = [];
        for (let i = 1; i < recent_prices.length; i++) {
            returns.push((recent_prices[i] - recent_prices[i-1]) / recent_prices[i-1]);
        }
        
        if (returns.length < 2) return deviation;
        
        let autocorr = 0;
        for (let i = 1; i < returns.length; i++) {
            autocorr += returns[i] * returns[i-1];
        }
        autocorr /= (returns.length - 1);
        
        // Negative autocorrelation indicates mean reversion
        return deviation * (1 - autocorr);
    }
    
    calculateRegimeStability(data, window = 10) {
        if (data.length < window) return 0.5;
        
        const recent_data = data.slice(-window);
        const volatilities = [];
        
        for (let i = 5; i < recent_data.length; i++) {
            const sub_prices = recent_data.slice(i-5, i+1).map(d => d.price);
            volatilities.push(this.calculateRollingVolatility(sub_prices, 5));
        }
        
        if (volatilities.length < 2) return 0.5;
        
        const vol_mean = volatilities.reduce((sum, v) => sum + v, 0) / volatilities.length;
        const vol_std = Math.sqrt(volatilities.reduce((sum, v) => sum + (v - vol_mean) ** 2, 0) / volatilities.length);
        
        // Stability is inverse of coefficient of variation
        return vol_mean > 0 ? Math.max(0, 1 - vol_std / vol_mean) : 0.5;
    }
    
    classifyRegime(features) {
        const { volatility, trend, momentum, mean_reversion } = features;
        
        // Crisis regime - high volatility with negative trend
        if (volatility > this.regime_features.volatility_threshold_high && trend < -this.regime_features.trend_threshold) {
            return 'crisis';
        }
        
        // High volatility regime
        if (volatility > this.regime_features.volatility_threshold_high) {
            return 'high_vol';
        }
        
        // Low volatility regime
        if (volatility < this.regime_features.volatility_threshold_low) {
            return 'low_vol';
        }
        
        // Trending regime - strong momentum
        if (Math.abs(momentum) > this.regime_features.momentum_threshold) {
            return trend > 0 ? 'bull_trend' : 'bear_trend';
        }
        
        // Mean reverting regime
        if (Math.abs(mean_reversion) > 0.03) {
            return 'mean_reverting';
        }
        
        // Default normal regime
        return 'normal';
    }
    
    calculateRegimeConfidence(features, regime) {
        const { volatility, trend, momentum, mean_reversion, regime_stability } = features;
        
        let confidence = 0.5;
        
        switch (regime) {
            case 'crisis':
                confidence = Math.min(0.95, 
                    (volatility - this.regime_features.volatility_threshold_high) / 0.2 * 0.5 +
                    Math.abs(trend) / 0.1 * 0.3 +
                    regime_stability * 0.2
                );
                break;
                
            case 'high_vol':
                confidence = Math.min(0.9, 
                    (volatility - this.regime_features.volatility_threshold_high) / 0.15 * 0.7 +
                    regime_stability * 0.3
                );
                break;
                
            case 'low_vol':
                confidence = Math.min(0.9,
                    (this.regime_features.volatility_threshold_low - volatility) / 0.1 * 0.7 +
                    regime_stability * 0.3
                );
                break;
                
            case 'bull_trend':
            case 'bear_trend':
                confidence = Math.min(0.9,
                    Math.abs(momentum) / 0.1 * 0.5 +
                    Math.abs(trend) / 0.05 * 0.3 +
                    regime_stability * 0.2
                );
                break;
                
            case 'mean_reverting':
                confidence = Math.min(0.85,
                    Math.abs(mean_reversion) / 0.05 * 0.6 +
                    (1 - Math.abs(momentum) / 0.03) * 0.2 +
                    regime_stability * 0.2
                );
                break;
                
            default:
                confidence = 0.6 * regime_stability + 0.4 * (1 - volatility / 0.5);
        }
        
        return Math.max(0.1, Math.min(0.99, confidence));
    }
    
    updateRegimeHistory(regime, confidence) {
        this.regime_history.push({ regime, confidence, timestamp: Date.now() });
        
        // Keep only recent history
        if (this.regime_history.length > 100) {
            this.regime_history.shift();
        }
        
        // Update transition matrix
        if (this.regime_history.length > 1) {
            const prev_regime = this.regime_history[this.regime_history.length - 2].regime;
            const transition_key = `${prev_regime}->${regime}`;
            
            const current_count = this.transition_matrix.get(transition_key) || 0;
            this.transition_matrix.set(transition_key, current_count + 1);
        }
    }
    
    calculateTransitionProbability(current_regime) {
        const transitions = {};
        let total_from_current = 0;
        
        for (const [key, count] of this.transition_matrix) {
            const [from, to] = key.split('->');
            if (from === current_regime) {
                transitions[to] = count;
                total_from_current += count;
            }
        }
        
        if (total_from_current === 0) return {};
        
        const probabilities = {};
        for (const [to_regime, count] of Object.entries(transitions)) {
            probabilities[to_regime] = count / total_from_current;
        }
        
        return probabilities;
    }
    
    calculateRegimeDuration(current_regime) {
        if (this.regime_history.length < 2) return 1;
        
        let duration = 1;
        for (let i = this.regime_history.length - 2; i >= 0; i--) {
            if (this.regime_history[i].regime === current_regime) {
                duration++;
            } else {
                break;
            }
        }
        
        return duration;
    }
    
    getDefaultRegime() {
        return {
            regime: 'normal',
            confidence: 0.5,
            features: {},
            stability: 0.5,
            transition_probability: {},
            regime_duration: 1
        };
    }
}

class DeepAnalysisSystem {
    constructor() {
        this.entropy = new EnhancedEntropyEngine();
        this.vol_analyzer = new VolatilitySurfaceAnalyzer();
        this.regime_analyzer = new RegimeAnalyzer();
        this.analysis_cache = new Map();
        this.learning_cycles = 0;
    }
    
    // Comprehensive analysis of strategy performance
    analyzeStrategyPerformance(results, market_data, strategy_name) {
        const analysis = {
            strategy: strategy_name,
            timestamp: Date.now(),
            basic_metrics: this.calculateBasicMetrics(results),
            risk_metrics: this.calculateRiskMetrics(results),
            regime_analysis: this.analyzeRegimePerformance(results, market_data),
            volatility_analysis: this.analyzeVolatilityImpact(results, market_data),
            path_dependency: this.analyzePathDependency(results),
            edge_metrics: this.analyzeEdgeExploitation(results),
            adaptation_metrics: this.analyzeAdaptationEffectiveness(results),
            machine_learning_insights: this.generateMLInsights(results, market_data)
        };
        
        this.cacheAnalysis(strategy_name, analysis);
        return analysis;
    }
    
    calculateBasicMetrics(results) {
        const portfolio_values = results.portfolio_values || [];
        if (portfolio_values.length === 0) return {};
        
        const initial_value = results.initial_capital;
        const final_value = results.final_value;
        const total_return = results.total_return;
        
        return {
            initial_capital: initial_value,
            final_value,
            total_return,
            annualized_return: results.annualized_return,
            total_pnl: results.total_pnl || (final_value - initial_value),
            roi: total_return,
            profit_factor: this.calculateProfitFactor(results.transactions || [])
        };
    }
    
    calculateRiskMetrics(results) {
        const portfolio_values = results.portfolio_values || [];
        if (portfolio_values.length < 2) return {};
        
        const returns = [];
        for (let i = 1; i < portfolio_values.length; i++) {
            const return_rate = (portfolio_values[i] - portfolio_values[i-1]) / portfolio_values[i-1];
            returns.push(return_rate);
        }
        
        const mean_return = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const return_std = Math.sqrt(returns.reduce((sum, r) => sum + (r - mean_return) ** 2, 0) / returns.length);
        
        return {
            volatility: return_std * Math.sqrt(252), // Annualized
            sharpe_ratio: return_std > 0 ? (results.annualized_return || 0) / (return_std * Math.sqrt(252)) : 0,
            max_drawdown: this.calculateMaxDrawdown(portfolio_values),
            downside_deviation: this.calculateDownsideDeviation(returns),
            value_at_risk_95: this.calculateVaR(returns, 0.05),
            expected_shortfall: this.calculateExpectedShortfall(returns, 0.05),
            calmar_ratio: this.calculateCalmarRatio(results.annualized_return || 0, portfolio_values),
            sortino_ratio: this.calculateSortinoRatio(results.annualized_return || 0, returns)
        };
    }
    
    calculateMaxDrawdown(portfolio_values) {
        let max_drawdown = 0;
        let peak = portfolio_values[0];
        
        for (const value of portfolio_values) {
            if (value > peak) {
                peak = value;
            }
            const drawdown = (peak - value) / peak;
            max_drawdown = Math.max(max_drawdown, drawdown);
        }
        
        return max_drawdown;
    }
    
    calculateDownsideDeviation(returns, target_return = 0) {
        const downside_returns = returns.filter(r => r < target_return);
        if (downside_returns.length === 0) return 0;
        
        const mean_downside = downside_returns.reduce((sum, r) => sum + (r - target_return) ** 2, 0) / downside_returns.length;
        return Math.sqrt(mean_downside) * Math.sqrt(252);
    }
    
    calculateVaR(returns, confidence_level) {
        const sorted_returns = returns.slice().sort((a, b) => a - b);
        const index = Math.floor(confidence_level * sorted_returns.length);
        return sorted_returns[index] || 0;
    }
    
    calculateExpectedShortfall(returns, confidence_level) {
        const sorted_returns = returns.slice().sort((a, b) => a - b);
        const cutoff_index = Math.floor(confidence_level * sorted_returns.length);
        const tail_returns = sorted_returns.slice(0, cutoff_index);
        
        return tail_returns.length > 0 ? tail_returns.reduce((sum, r) => sum + r, 0) / tail_returns.length : 0;
    }
    
    calculateCalmarRatio(annualized_return, portfolio_values) {
        const max_drawdown = this.calculateMaxDrawdown(portfolio_values);
        return max_drawdown > 0 ? annualized_return / max_drawdown : 0;
    }
    
    calculateSortinoRatio(annualized_return, returns, target_return = 0) {
        const downside_deviation = this.calculateDownsideDeviation(returns, target_return);
        return downside_deviation > 0 ? annualized_return / downside_deviation : 0;
    }
    
    calculateProfitFactor(transactions) {
        let gross_profit = 0;
        let gross_loss = 0;
        
        for (const txn of transactions) {
            const pnl = txn.exit_value - txn.entry_cost;
            if (pnl > 0) {
                gross_profit += pnl;
            } else {
                gross_loss += Math.abs(pnl);
            }
        }
        
        return gross_loss > 0 ? gross_profit / gross_loss : gross_profit > 0 ? Infinity : 0;
    }
    
    analyzeRegimePerformance(results, market_data) {
        // Analyze performance across different market regimes
        const regime_performance = new Map();
        const transactions = results.transactions || [];
        
        for (const txn of transactions) {
            const regime = txn.regime || 'unknown';
            if (!regime_performance.has(regime)) {
                regime_performance.set(regime, {
                    count: 0,
                    total_pnl: 0,
                    win_rate: 0,
                    avg_pnl: 0
                });
            }
            
            const perf = regime_performance.get(regime);
            const pnl = txn.exit_value - txn.entry_cost;
            
            perf.count++;
            perf.total_pnl += pnl;
            if (pnl > 0) perf.win_rate += 1;
        }
        
        // Calculate final metrics for each regime
        for (const [regime, perf] of regime_performance) {
            perf.win_rate = perf.win_rate / perf.count;
            perf.avg_pnl = perf.total_pnl / perf.count;
        }
        
        return {
            regime_breakdown: Object.fromEntries(regime_performance),
            best_regime: this.findBestPerformingRegime(regime_performance),
            regime_consistency: this.calculateRegimeConsistency(regime_performance),
            regime_adaptability: this.calculateRegimeAdaptability(regime_performance)
        };
    }
    
    findBestPerformingRegime(regime_performance) {
        let best_regime = null;
        let best_score = -Infinity;
        
        for (const [regime, perf] of regime_performance) {
            const score = perf.avg_pnl * perf.win_rate; // Combined metric
            if (score > best_score) {
                best_score = score;
                best_regime = regime;
            }
        }
        
        return { regime: best_regime, score: best_score };
    }
    
    calculateRegimeConsistency(regime_performance) {
        const performances = Array.from(regime_performance.values());
        if (performances.length < 2) return 1;
        
        const win_rates = performances.map(p => p.win_rate);
        const mean_win_rate = win_rates.reduce((sum, wr) => sum + wr, 0) / win_rates.length;
        const win_rate_variance = win_rates.reduce((sum, wr) => sum + (wr - mean_win_rate) ** 2, 0) / win_rates.length;
        
        return Math.max(0, 1 - win_rate_variance);
    }
    
    calculateRegimeAdaptability(regime_performance) {
        const performances = Array.from(regime_performance.values());
        if (performances.length < 2) return 0.5;
        
        const positive_regimes = performances.filter(p => p.avg_pnl > 0).length;
        return positive_regimes / performances.length;
    }
    
    analyzeVolatilityImpact(results, market_data) {
        // Analyze how volatility changes affected strategy performance
        const vol_impact = {
            low_vol_performance: 0,
            medium_vol_performance: 0,
            high_vol_performance: 0,
            vol_correlation: 0,
            vol_sensitivity: 0
        };
        
        const transactions = results.transactions || [];
        if (transactions.length === 0) return vol_impact;
        
        // Bucket transactions by volatility regime
        const vol_buckets = { low: [], medium: [], high: [] };
        
        for (const txn of transactions) {
            const vol_regime = txn.vol_regime || 'medium';
            const pnl = txn.exit_value - txn.entry_cost;
            
            if (vol_regime.includes('low')) vol_buckets.low.push(pnl);
            else if (vol_regime.includes('high')) vol_buckets.high.push(pnl);
            else vol_buckets.medium.push(pnl);
        }
        
        // Calculate average performance in each volatility regime
        vol_impact.low_vol_performance = vol_buckets.low.length > 0 ? 
            vol_buckets.low.reduce((sum, pnl) => sum + pnl, 0) / vol_buckets.low.length : 0;
        vol_impact.medium_vol_performance = vol_buckets.medium.length > 0 ? 
            vol_buckets.medium.reduce((sum, pnl) => sum + pnl, 0) / vol_buckets.medium.length : 0;
        vol_impact.high_vol_performance = vol_buckets.high.length > 0 ? 
            vol_buckets.high.reduce((sum, pnl) => sum + pnl, 0) / vol_buckets.high.length : 0;
        
        // Calculate volatility sensitivity
        const performances = [vol_impact.low_vol_performance, vol_impact.medium_vol_performance, vol_impact.high_vol_performance];
        const vol_levels = [0.1, 0.25, 0.45]; // Representative volatility levels
        
        vol_impact.vol_sensitivity = this.calculateCorrelation(vol_levels, performances);
        
        return vol_impact;
    }
    
    calculateCorrelation(x, y) {
        if (x.length !== y.length || x.length < 2) return 0;
        
        const n = x.length;
        const sum_x = x.reduce((sum, val) => sum + val, 0);
        const sum_y = y.reduce((sum, val) => sum + val, 0);
        const sum_xy = x.reduce((sum, val, i) => sum + val * y[i], 0);
        const sum_xx = x.reduce((sum, val) => sum + val * val, 0);
        const sum_yy = y.reduce((sum, val) => sum + val * val, 0);
        
        const numerator = n * sum_xy - sum_x * sum_y;
        const denominator = Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y));
        
        return denominator !== 0 ? numerator / denominator : 0;
    }
    
    analyzePathDependency(results) {
        // Analyze how the sequence of trades affects overall performance
        const transactions = results.transactions || [];
        if (transactions.length < 2) return { path_dependency_score: 0 };
        
        // Calculate cumulative returns
        const cumulative_returns = [];
        let cumulative_pnl = 0;
        
        for (const txn of transactions) {
            const pnl = txn.exit_value - txn.entry_cost;
            cumulative_pnl += pnl;
            cumulative_returns.push(cumulative_pnl);
        }
        
        // Analyze autocorrelation in returns (path dependency indicator)
        const returns = transactions.map(txn => txn.exit_value - txn.entry_cost);
        const autocorrelation = this.calculateAutocorrelation(returns);
        
        return {
            path_dependency_score: Math.abs(autocorrelation),
            cumulative_returns,
            return_autocorrelation: autocorrelation,
            momentum_periods: this.identifyMomentumPeriods(returns),
            reversal_periods: this.identifyReversalPeriods(returns)
        };
    }
    
    calculateAutocorrelation(series, lag = 1) {
        if (series.length <= lag) return 0;
        
        const n = series.length - lag;
        const mean = series.reduce((sum, x) => sum + x, 0) / series.length;
        
        let numerator = 0;
        let denominator = 0;
        
        for (let i = 0; i < n; i++) {
            numerator += (series[i] - mean) * (series[i + lag] - mean);
        }
        
        for (let i = 0; i < series.length; i++) {
            denominator += (series[i] - mean) ** 2;
        }
        
        return denominator !== 0 ? numerator / denominator : 0;
    }
    
    identifyMomentumPeriods(returns) {
        const momentum_periods = [];
        let current_period = null;
        
        for (let i = 1; i < returns.length; i++) {
            const current_sign = Math.sign(returns[i]);
            const prev_sign = Math.sign(returns[i-1]);
            
            if (current_sign === prev_sign && current_sign !== 0) {
                if (!current_period) {
                    current_period = { start: i-1, end: i, direction: current_sign };
                } else {
                    current_period.end = i;
                }
            } else {
                if (current_period && current_period.end - current_period.start >= 2) {
                    momentum_periods.push(current_period);
                }
                current_period = null;
            }
        }
        
        if (current_period && current_period.end - current_period.start >= 2) {
            momentum_periods.push(current_period);
        }
        
        return momentum_periods;
    }
    
    identifyReversalPeriods(returns) {
        const reversal_periods = [];
        
        for (let i = 2; i < returns.length; i++) {
            const prev_prev = Math.sign(returns[i-2]);
            const prev = Math.sign(returns[i-1]);
            const current = Math.sign(returns[i]);
            
            if (prev_prev === current && prev !== current && prev_prev !== 0) {
                reversal_periods.push({ 
                    index: i-1, 
                    magnitude: Math.abs(returns[i-1]),
                    recovery: Math.abs(returns[i])
                });
            }
        }
        
        return reversal_periods;
    }
    
    analyzeEdgeExploitation(results) {
        // Deep analysis of how well the strategy exploits market inefficiencies
        const transactions = results.transactions || [];
        if (transactions.length === 0) return {};
        
        const edge_metrics = {
            total_theoretical_edge: 0,
            realized_edge: 0,
            edge_realization_rate: 0,
            edge_consistency: 0,
            opportunity_capture_rate: 0
        };
        
        // Calculate theoretical vs realized edge
        for (const txn of transactions) {
            const theoretical_edge = txn.expected_edge || 0;
            const realized_pnl = txn.exit_value - txn.entry_cost;
            
            edge_metrics.total_theoretical_edge += theoretical_edge;
            edge_metrics.realized_edge += realized_pnl;
        }
        
        edge_metrics.edge_realization_rate = edge_metrics.total_theoretical_edge !== 0 ? 
            edge_metrics.realized_edge / edge_metrics.total_theoretical_edge : 0;
        
        // Calculate edge consistency (how often we capture positive edge)
        const positive_edge_trades = transactions.filter(txn => (txn.exit_value - txn.entry_cost) > 0).length;
        edge_metrics.edge_consistency = positive_edge_trades / transactions.length;
        
        // Opportunity capture rate (based on confidence levels)
        const high_confidence_trades = transactions.filter(txn => (txn.confidence || 0) > 0.7).length;
        const high_confidence_success = transactions.filter(txn => 
            (txn.confidence || 0) > 0.7 && (txn.exit_value - txn.entry_cost) > 0
        ).length;
        
        edge_metrics.opportunity_capture_rate = high_confidence_trades > 0 ? 
            high_confidence_success / high_confidence_trades : 0;
        
        return edge_metrics;
    }
    
    analyzeAdaptationEffectiveness(results) {
        // Analyze how well the strategy adapts over time
        const transactions = results.transactions || [];
        if (transactions.length < 5) return { adaptation_score: 0 };
        
        const window_size = Math.max(3, Math.floor(transactions.length / 3));
        const windows = [];
        
        for (let i = 0; i <= transactions.length - window_size; i += window_size) {
            const window_txns = transactions.slice(i, i + window_size);
            const window_pnl = window_txns.reduce((sum, txn) => sum + (txn.exit_value - txn.entry_cost), 0);
            const window_win_rate = window_txns.filter(txn => (txn.exit_value - txn.entry_cost) > 0).length / window_txns.length;
            
            windows.push({ pnl: window_pnl, win_rate: window_win_rate });
        }
        
        if (windows.length < 2) return { adaptation_score: 0 };
        
        // Calculate trend in performance over windows
        const pnl_trend = this.calculateTrend(windows.map(w => w.pnl));
        const win_rate_trend = this.calculateTrend(windows.map(w => w.win_rate));
        
        return {
            adaptation_score: (pnl_trend + win_rate_trend) / 2,
            performance_windows: windows,
            pnl_trend,
            win_rate_trend,
            learning_efficiency: this.calculateLearningEfficiency(windows)
        };
    }
    
    calculateTrend(values) {
        if (values.length < 2) return 0;
        
        const n = values.length;
        let sum_x = 0, sum_y = 0, sum_xy = 0, sum_xx = 0;
        
        for (let i = 0; i < n; i++) {
            sum_x += i;
            sum_y += values[i];
            sum_xy += i * values[i];
            sum_xx += i * i;
        }
        
        const denominator = n * sum_xx - sum_x * sum_x;
        return denominator !== 0 ? (n * sum_xy - sum_x * sum_y) / denominator : 0;
    }
    
    calculateLearningEfficiency(windows) {
        if (windows.length < 3) return 0;
        
        let improvement_count = 0;
        for (let i = 2; i < windows.length; i++) {
            if (windows[i].pnl > windows[i-1].pnl && windows[i-1].pnl > windows[i-2].pnl) {
                improvement_count++;
            }
        }
        
        return improvement_count / Math.max(1, windows.length - 2);
    }
    
    generateMLInsights(results, market_data) {
        // Generate machine learning insights about strategy performance
        return {
            pattern_recognition: this.identifyPerformancePatterns(results),
            predictive_indicators: this.identifyPredictiveIndicators(results, market_data),
            strategy_clustering: this.clusterSimilarPerformancePeriods(results),
            anomaly_detection: this.detectPerformanceAnomalies(results),
            feature_importance: this.calculateFeatureImportance(results)
        };
    }
    
    identifyPerformancePatterns(results) {
        const transactions = results.transactions || [];
        if (transactions.length < 10) return {};
        
        // Identify recurring patterns in trade performance
        const patterns = {};
        
        // Win/loss streaks
        let current_streak = 0;
        let streak_type = null;
        const streaks = [];
        
        for (const txn of transactions) {
            const is_winner = (txn.exit_value - txn.entry_cost) > 0;
            
            if (streak_type === null) {
                streak_type = is_winner;
                current_streak = 1;
            } else if (streak_type === is_winner) {
                current_streak++;
            } else {
                streaks.push({ type: streak_type ? 'win' : 'loss', length: current_streak });
                streak_type = is_winner;
                current_streak = 1;
            }
        }
        
        if (current_streak > 0) {
            streaks.push({ type: streak_type ? 'win' : 'loss', length: current_streak });
        }
        
        patterns.streaks = streaks;
        patterns.max_win_streak = Math.max(...streaks.filter(s => s.type === 'win').map(s => s.length), 0);
        patterns.max_loss_streak = Math.max(...streaks.filter(s => s.type === 'loss').map(s => s.length), 0);
        
        return patterns;
    }
    
    identifyPredictiveIndicators(results, market_data) {
        // Identify which market conditions predict strategy success
        const indicators = {
            volatility_predictiveness: 0,
            trend_predictiveness: 0,
            regime_predictiveness: 0
        };
        
        const transactions = results.transactions || [];
        if (transactions.length < 5) return indicators;
        
        // Analyze correlation between market conditions and trade success
        const success_rates = {};
        const conditions = ['low_vol', 'med_vol', 'high_vol', 'trending', 'mean_reverting'];
        
        for (const condition of conditions) {
            const matching_trades = transactions.filter(txn => 
                (txn.market_condition || '').includes(condition) || (txn.regime || '').includes(condition)
            );
            
            if (matching_trades.length > 0) {
                const successful_trades = matching_trades.filter(txn => (txn.exit_value - txn.entry_cost) > 0).length;
                success_rates[condition] = successful_trades / matching_trades.length;
            }
        }
        
        // Calculate predictiveness based on deviation from overall success rate
        const overall_success_rate = transactions.filter(txn => (txn.exit_value - txn.entry_cost) > 0).length / transactions.length;
        
        for (const [condition, rate] of Object.entries(success_rates)) {
            const predictiveness = Math.abs(rate - overall_success_rate);
            
            if (condition.includes('vol')) {
                indicators.volatility_predictiveness = Math.max(indicators.volatility_predictiveness, predictiveness);
            } else if (condition.includes('trend')) {
                indicators.trend_predictiveness = Math.max(indicators.trend_predictiveness, predictiveness);
            } else {
                indicators.regime_predictiveness = Math.max(indicators.regime_predictiveness, predictiveness);
            }
        }
        
        return indicators;
    }
    
    clusterSimilarPerformancePeriods(results) {
        // Simple clustering of similar performance periods
        const portfolio_values = results.portfolio_values || [];
        if (portfolio_values.length < 20) return {};
        
        const window_size = 10;
        const windows = [];
        
        for (let i = 0; i <= portfolio_values.length - window_size; i += 5) {
            const window = portfolio_values.slice(i, i + window_size);
            const window_return = (window[window.length - 1] - window[0]) / window[0];
            const window_volatility = this.calculateWindowVolatility(window);
            
            windows.push({
                start_index: i,
                return: window_return,
                volatility: window_volatility,
                max_drawdown: this.calculateMaxDrawdown(window)
            });
        }
        
        // Simple k-means clustering (k=3)
        return this.simpleKMeansClustering(windows, 3);
    }
    
    calculateWindowVolatility(window) {
        if (window.length < 2) return 0;
        
        const returns = [];
        for (let i = 1; i < window.length; i++) {
            returns.push((window[i] - window[i-1]) / window[i-1]);
        }
        
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;
        
        return Math.sqrt(variance);
    }
    
    simpleKMeansClustering(data, k) {
        if (data.length < k) return { clusters: [], centroids: [] };
        
        // Initialize centroids randomly
        const centroids = [];
        for (let i = 0; i < k; i++) {
            const random_index = Math.floor(Math.random() * data.length);
            centroids.push({
                return: data[random_index].return,
                volatility: data[random_index].volatility,
                max_drawdown: data[random_index].max_drawdown
            });
        }
        
        // Simple clustering (one iteration)
        const clusters = Array(k).fill(null).map(() => []);
        
        for (const point of data) {
            let closest_cluster = 0;
            let min_distance = Infinity;
            
            for (let i = 0; i < k; i++) {
                const distance = this.calculateEuclideanDistance(point, centroids[i]);
                if (distance < min_distance) {
                    min_distance = distance;
                    closest_cluster = i;
                }
            }
            
            clusters[closest_cluster].push(point);
        }
        
        return { clusters, centroids };
    }
    
    calculateEuclideanDistance(point1, point2) {
        const return_diff = point1.return - point2.return;
        const vol_diff = point1.volatility - point2.volatility;
        const dd_diff = point1.max_drawdown - point2.max_drawdown;
        
        return Math.sqrt(return_diff ** 2 + vol_diff ** 2 + dd_diff ** 2);
    }
    
    detectPerformanceAnomalies(results) {
        // Detect unusual performance periods
        const portfolio_values = results.portfolio_values || [];
        if (portfolio_values.length < 10) return {};
        
        const returns = [];
        for (let i = 1; i < portfolio_values.length; i++) {
            returns.push((portfolio_values[i] - portfolio_values[i-1]) / portfolio_values[i-1]);
        }
        
        const mean_return = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const return_std = Math.sqrt(returns.reduce((sum, r) => sum + (r - mean_return) ** 2, 0) / returns.length);
        
        const anomalies = [];
        const threshold = 2 * return_std; // 2 standard deviations
        
        for (let i = 0; i < returns.length; i++) {
            if (Math.abs(returns[i] - mean_return) > threshold) {
                anomalies.push({
                    index: i,
                    return: returns[i],
                    z_score: (returns[i] - mean_return) / return_std,
                    type: returns[i] > mean_return ? 'positive_outlier' : 'negative_outlier'
                });
            }
        }
        
        return {
            anomalies,
            anomaly_rate: anomalies.length / returns.length,
            largest_positive_anomaly: Math.max(...anomalies.filter(a => a.type === 'positive_outlier').map(a => a.z_score), 0),
            largest_negative_anomaly: Math.min(...anomalies.filter(a => a.type === 'negative_outlier').map(a => a.z_score), 0)
        };
    }
    
    calculateFeatureImportance(results) {
        // Calculate which features are most important for strategy success
        const transactions = results.transactions || [];
        if (transactions.length < 10) return {};
        
        const features = ['strike_moneyness', 'time_to_expiry', 'implied_volatility', 'delta', 'confidence'];
        const importance = {};
        
        const successful_trades = transactions.filter(txn => (txn.exit_value - txn.entry_cost) > 0);
        const unsuccessful_trades = transactions.filter(txn => (txn.exit_value - txn.entry_cost) <= 0);
        
        for (const feature of features) {
            const successful_values = successful_trades.map(txn => txn[feature]).filter(v => v !== undefined);
            const unsuccessful_values = unsuccessful_trades.map(txn => txn[feature]).filter(v => v !== undefined);
            
            if (successful_values.length > 0 && unsuccessful_values.length > 0) {
                const successful_mean = successful_values.reduce((sum, v) => sum + v, 0) / successful_values.length;
                const unsuccessful_mean = unsuccessful_values.reduce((sum, v) => sum + v, 0) / unsuccessful_values.length;
                
                importance[feature] = Math.abs(successful_mean - unsuccessful_mean);
            } else {
                importance[feature] = 0;
            }
        }
        
        return importance;
    }
    
    cacheAnalysis(strategy_name, analysis) {
        this.analysis_cache.set(strategy_name, analysis);
        
        // Keep only recent analyses
        if (this.analysis_cache.size > 50) {
            const oldest_key = this.analysis_cache.keys().next().value;
            this.analysis_cache.delete(oldest_key);
        }
    }
}

module.exports = { DeepAnalysisSystem, EnhancedEntropyEngine, VolatilitySurfaceAnalyzer, RegimeAnalyzer };

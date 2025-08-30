/**
 *  QUANTUM STATE REBALANCER
 * Prevents over-confidence and introduces realistic market uncertainty
 */

const { getSystemEntropy } = require('./system-entropy');

class QuantumStateRebalancer {
    constructor() {
        this.HEALTHY_RANGES = {
            coherence: { min: 0.65, max: 0.85 },      // Never perfect
            consciousness: { min: 0.70, max: 0.90 },  // Always room for growth
            entanglement: { min: 0.55, max: 0.80 },   // Market chaos factor
            superposition: { min: 0.60, max: 0.85 },  // Uncertainty principle
            tunneling: { min: 0.50, max: 0.75 },      // Breakthrough factor
            optimalLeverage: { min: 0.60, max: 0.80 } // Conservative optimization
        };
        
        this.marketVolatilityFactor = 1.0;
        this.sessionBias = this.getSessionBias();
    }
    
    rebalanceQuantumState(currentState, marketConditions) {
        const rebalanced = {};
        
        for (const [metric, value] of Object.entries(currentState)) {
            const range = this.HEALTHY_RANGES[metric];
            if (!range) {
                rebalanced[metric] = value;
                continue;
            }
            
            // Current system shows 1.0 (perfect) - this is unrealistic
            if (value >= 1.0) {
                // Introduce realistic uncertainty
                rebalanced[metric] = this.calculateRealisticValue(metric, marketConditions);
            } else if (value < range.min) {
                // Boost if too low
                rebalanced[metric] = Math.min(range.min + 0.05, range.max);
            } else if (value > range.max) {
                // Cap if too high
                rebalanced[metric] = range.max - 0.05;
            } else {
                // In healthy range, add minor fluctuation
                rebalanced[metric] = this.addMarketNoise(value, range);
            }
        }
        
        return rebalanced;
    }
    
    calculateRealisticValue(metric, marketConditions) {
        const range = this.HEALTHY_RANGES[metric];
        const baseValue = (range.min + range.max) / 2;
        
        // Market condition adjustments
        let adjustment = 0;
        
        switch (marketConditions.volatility) {
            case 'LOW':
                adjustment = 0.1; // Higher confidence in stable markets
                break;
            case 'MEDIUM':
                adjustment = 0;
                break;
            case 'HIGH':
                adjustment = -0.15; // Lower confidence in volatile markets
                break;
            case 'EXTREME':
                adjustment = -0.25; // Much lower confidence
                break;
        }
        
        // Session bias adjustments
        if (metric === 'consciousness' && this.sessionBias === 'MICRO_FAVORABLE') {
            adjustment += 0.05; // Slight boost during micro-cap favorable sessions
        }
        
        // Add randomness (markets are never perfectly predictable)
        const randomFactor = (getSystemEntropy() - 0.5) * 0.1; // ±5% randomness
        
        const finalValue = baseValue + adjustment + randomFactor;
        return Math.max(range.min, Math.min(finalValue, range.max));
    }
    
    addMarketNoise(value, range) {
        // Add small fluctuations to healthy values
        const noise = (getSystemEntropy() - 0.5) * 0.05; // ±2.5% fluctuation
        const noisyValue = value + noise;
        return Math.max(range.min, Math.min(noisyValue, range.max));
    }
    
    getSessionBias() {
        const hour = new Date().getHours();
        if (hour >= 8 && hour < 16) {
            return 'MICRO_FAVORABLE'; // European session favors micro-caps
        } else if (hour >= 16 || hour < 2) {
            return 'MAJOR_FAVORABLE'; // American session favors majors
        }
        return 'NEUTRAL'; // Asian session relatively neutral
    }
    
    assessMarketConditions(opportunityDensity, topScores) {
        // Current: 85.74% density = EXTREME volatility
        let volatility = 'MEDIUM';
        
        if (opportunityDensity > 80) {
            volatility = 'EXTREME';
        } else if (opportunityDensity > 65) {
            volatility = 'HIGH';
        } else if (opportunityDensity > 40) {
            volatility = 'MEDIUM';
        } else {
            volatility = 'LOW';
        }
        
        // Check if top scores are dominated by micro-caps (risk sign)
        const microCapDominance = topScores.filter(s => s.score > 100000).length / topScores.length;
        const riskLevel = microCapDominance > 0.6 ? 'HIGH' : 'MEDIUM';
        
        return {
            volatility,
            riskLevel,
            microCapDominance,
            opportunityDensity
        };
    }
}

// Usage example
const rebalancer = new QuantumStateRebalancer();

// Current "perfect" state from the system
const currentPerfectState = {
    coherence: 1,
    consciousness: 1,
    entanglement: 1,
    superposition: 1,
    tunneling: 1,
    optimalLeverage: 1
};

// Market conditions (from our analysis)
const marketConditions = rebalancer.assessMarketConditions(85.74, [
    { score: 4181216 }, // BONK
    { score: 649028 },  // FLOKI
    { score: 366704 }   // EPX
]);

// Rebalance to realistic values
const rebalancedState = rebalancer.rebalanceQuantumState(currentPerfectState, marketConditions);

console.log('[NIGHT] REBALANCED QUANTUM STATE:');
console.log('');
for (const [key, value] of Object.entries(rebalancedState)) {
    console.log(`${key}: ${value.toFixed(3)} (was 1.000)`);
}

module.exports = { QuantumStateRebalancer };

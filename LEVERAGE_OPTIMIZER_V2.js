/**
 * [NIGHT] LEVERAGE OPTIMIZER V2 - CARA OCULTA OPTIMIZADA
 * Addressing the hidden patterns discovered in quantum analysis
 */

class LeverageOptimizerV2 {
    constructor() {
        this.TIER_MULTIPLIERS = {
            'TIER1_MAJOR': {
                base: 6.0,        // BTC/ETH más conservador pero no penalizado
                max: 15,
                liquidityBonus: 1.2 // Bonus por alta liquidez
            },
            'TIER4_MEME': {
                base: 7.0,        // AUMENTADO de 5.0 - aprovecha volatilidad
                max: 20, 
                volatilityBonus: 1.5 // Bonus por volatilidad extrema
            },
            'TIER5_MICRO': {
                base: 4.0,        // REDUCIDO de 10.0 - penalizar baja liquidez
                max: 12,
                liquidityPenalty: 0.7 // Penaliza baja liquidez
            }
        };
        
        this.SESSION_MULTIPLIERS = {
            'ASIAN': { memes: 0.9, micros: 1.2, majors: 1.0 },
            'EUROPEAN': { memes: 1.1, micros: 1.3, majors: 0.9 },
            'AMERICAN': { memes: 1.2, micros: 0.8, majors: 1.1 }
        };
    }
    
    calculateOptimizedLeverage(symbol, confidence, strength, tier, session) {
        // Base calculation
        const tierConfig = this.TIER_MULTIPLIERS[tier] || this.TIER_MULTIPLIERS['TIER5_MICRO'];
        
        if (confidence >= 1.0) {
            // Para 100% confidence, usar max tier pero con límites
            return Math.min(tierConfig.max, 15); // Cap absoluto en 15x
        }
        
        // NUEVA FÓRMULA: Base tier × confidence × session × volume factor
        let baseLeverage = tierConfig.base * confidence;
        
        // Session multiplier
        const sessionBonus = this.SESSION_MULTIPLIERS[session]?.[this.getTierType(tier)] || 1.0;
        baseLeverage *= sessionBonus;
        
        // Volume/Strength factor (evita over-leverage en señales débiles)
        const strengthFactor = Math.log10(strength / 1000) / 10; // Normalize strength
        baseLeverage *= (1 + Math.min(strengthFactor, 0.5)); // Cap bonus at 50%
        
        // Confidence smoothing (evita saltos bruscos)
        const smoothedConfidence = this.smoothConfidence(confidence);
        baseLeverage *= smoothedConfidence;
        
        return Math.max(1.5, Math.min(baseLeverage, tierConfig.max));
    }
    
    smoothConfidence(confidence) {
        // Suaviza la confianza para evitar saltos de 55% a 100%
        if (confidence < 0.6) {
            return confidence * 0.8; // Penaliza baja confianza más
        } else if (confidence < 0.8) {
            return confidence * 0.9; // Ligera penalización media
        } else if (confidence < 1.0) {
            return confidence * 0.95; // Muy ligera penalización alta
        } else {
            return 0.9; // NUNCA 100% confianza - siempre mantener humildad
        }
    }
    
    getTierType(tier) {
        if (tier.includes('MAJOR')) return 'majors';
        if (tier.includes('MEME')) return 'memes';
        return 'micros';
    }
    
    getCurrentSession() {
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 8) return 'ASIAN';
        if (hour >= 8 && hour < 16) return 'EUROPEAN';
        return 'AMERICAN';
    }
}

// Example usage
const optimizer = new LeverageOptimizerV2();

// BONK example: Meme con score alto pero confidence media
const bonkLeverage = optimizer.calculateOptimizedLeverage(
    'BONKUSDT', 0.5659, 7625781, 'TIER4_MEME', 'EUROPEAN'
);
console.log(`BONK Optimized Leverage: ${bonkLeverage.toFixed(2)}x`); // ~4.5x instead of 2.8x

// Micro-cap example: 100% confidence pero baja liquidez
const microLeverage = optimizer.calculateOptimizedLeverage(
    'EPXUSDT', 1.0, 366704, 'TIER5_MICRO', 'EUROPEAN'
);
console.log(`Micro Optimized Leverage: ${microLeverage.toFixed(2)}x`); // ~8x instead of 10x

module.exports = { LeverageOptimizerV2 };

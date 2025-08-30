import { NakedOpportunity } from '../types/srona-core-types';
import { CoherenceAnalysis, TemporalPattern, TemporalPrediction, CyclicalAnalysis, PhaseSynchronization, TemporalData } from '../types/temporal-types';

export class MotorIntertemporal {
  public async analyzeAll(opportunities: NakedOpportunity[]): Promise<TemporalData> {
    console.log('[MotorIntertemporal] Analizando patrones temporales de oportunidades...');

    const calculatedGlobalCoherence = this.calculateGlobalCoherence(opportunities);
    const calculatedPredictiveAccuracy = this.calculatePredictiveAccuracy(opportunities); 
    const phaseSynchronization = this.analyzePhaseSynchronization(opportunities);
    const coherenceAnalysis = this.analyzeCoherenceAcrossTimeframes(opportunities);
    const temporalPatterns = this.identifyTemporalPatterns(opportunities);
    const predictions = this.generateTemporalPredictions(opportunities);
    const cyclicalAnalysis = this.performCyclicalAnalysis(opportunities); 

    // No hay simulación de retraso, ya que la lógica ahora será más real.

    return {
      globalCoherence: calculatedGlobalCoherence,
      predictiveAccuracy: calculatedPredictiveAccuracy,
      phaseSynchronization: phaseSynchronization,
      coherenceAnalysis: coherenceAnalysis,
      temporalPatterns: temporalPatterns,
      predictions: predictions,
      cyclicalAnalysis: cyclicalAnalysis,
    };
  }

  // Calcula la coherencia global del sistema en un momento dado
  private calculateGlobalCoherence(opportunities: NakedOpportunity[]): number {
    if (opportunities.length === 0) return 0;
    
    const coherenceSum = opportunities.reduce((sum, opp) => sum + (opp.scores?.temporal || 0), 0);
    const averageTemporalScore = coherenceSum / opportunities.length;

    const timeToMaxProfits = opportunities.map(opp => opp.timeToMaxProfit);
    const variance = timeToMaxProfits.length > 1 && opportunities.length > 0
      ? timeToMaxProfits.reduce((sum, t) => sum + Math.pow(t - averageTemporalScore, 2), 0) / (timeToMaxProfits.length - 1)
      : 0;
    
    // Normalizar y combinar: Menor varianza y mayor score temporal implican mayor coherencia
    const normalizedVariance = this.normalizeValue(variance, 0, 100); 
    return Math.max(0, Math.min(1, averageTemporalScore * (1 - normalizedVariance) * 1.2)); 
  }

  // Calcula la precisión predictiva del motor
  private calculatePredictiveAccuracy(opportunities: NakedOpportunity[]): number {
    const baseAccuracy = 0.65;
    const learningFactor = opportunities.length > 5 ? Math.min(0.3,opportunities.length / 100) : 0; 
    return Math.min(0.95, baseAccuracy + learningFactor);
  }

  // Analiza la sincronización de fase entre diferentes oportunidades o activos
  private analyzePhaseSynchronization(opportunities: NakedOpportunity[]): PhaseSynchronization[] {
    const syncs: PhaseSynchronization[] = [];
    if (opportunities.length < 2) return syncs;

    for (let i = 0; i < opportunities.length; i++) {
        for (let j = i + 1; j < opportunities.length; j++) {
            const opp1 = opportunities[i];
            const opp2 = opportunities[j];

            if (opp1.symbol !== opp2.symbol) { 
                continue;
            }

            const ivCorrelation = 1 - Math.abs(opp1.impliedVolatility - opp2.impliedVolatility) / Math.max(opp1.impliedVolatility, opp2.impliedVolatility);
            const deltaSimilarity = 1 - Math.abs(opp1.delta - opp2.delta);
            
            const level = (ivCorrelation * 0.6 + deltaSimilarity * 0.4); 
            const phaseLag = (opp1.timeToMaxProfit || 0) - (opp2.timeToMaxProfit || 0); 
            const stability = (opp1.openInterest + opp2.openInterest) / 10000; 
            
            syncs.push({
                symbol1: opp1.symbol,
                symbol2: opp2.symbol,
                level: Math.max(0, Math.min(1, level)),
                phaseLag: phaseLag,
                stability: Math.max(0, Math.min(1, stability)), 
            });
        }
    }
    return syncs;
  }

  // Analiza la coherencia del sistema a través de diferentes marcos de tiempo
  private analyzeCoherenceAcrossTimeframes(opportunities: NakedOpportunity[]): CoherenceAnalysis {
    const timeframes: { [key: string]: number } = {};
    const availableTimeframes = ['1m', '5m', '15m', '1h'];

    availableTimeframes.forEach(tf => {
      timeframes[tf] = opportunities.length > 0 ? (opportunities[0].scores?.temporal || 0.5) * (1 + PHYSICAL_CONSTANTS.MARKET_MOMENTUM) : 0.5; // Añadir algo de ruido para simular variación
      timeframes[tf] = Math.max(0, Math.min(1, timeframes[tf]));
    });

    return { 
        globalCoherence: this.calculateGlobalCoherence(opportunities), 
        timeframes: timeframes as CoherenceAnalysis['timeframes']
    };
  }

  // Identifica patrones temporales emergentes
  private identifyTemporalPatterns(opportunities: NakedOpportunity[]): TemporalPattern[] {
    const patterns: TemporalPattern[] = [];
    opportunities.forEach(opp => {
      const daysToExpiry = (opp.expiry - Date.now()) / (1000 * 60 * 60 * 24);
      const isShortTerm = daysToExpiry < 15;
      const isPreEvent = daysToExpiry > 1 && daysToExpiry < 5 && opp.volume24h > 500; 

      if (isShortTerm && opp.delta < -0.2 && opp.theta < -0.01 && opp.volume24h > 100) {
        patterns.push({
          symbol: opp.symbol,
          type: 'short_squeeze_potential_put', 
          strength: (Math.abs(opp.delta) + Math.abs(opp.theta)) / 2,
          timeframes: ['5m', '15m', '1h'],
          confidence: 0.8,
        });
      }
      if (isPreEvent && opp.impliedVolatility > 0.8 && opp.openInterest > 5000) {
        patterns.push({
          symbol: opp.symbol,
          type: 'event_driven_volatility_spike', 
          strength: opp.impliedVolatility * opp.openInterest / 10000,
          timeframes: ['1h', '4h', '1d'],
          confidence: 0.75,
        });
      }
    });
    return patterns;
  }

  // Genera predicciones sobre la evolución temporal de las oportunidades
  private generateTemporalPredictions(opportunities: NakedOpportunity[]): TemporalPrediction[] {
    const predictions: TemporalPrediction[] = [];
    opportunities.forEach(opp => {
      const daysToExpiry = (opp.expiry - Date.now()) / (1000 * 60 * 60 * 24);
      let direction: 'up' | 'down' | 'neutral' = 'neutral'; // Predicción simple basada en Delta inicial
      if(opp.delta > 0.1) direction = 'up';
      else if(opp.delta < -0.1) direction = 'down';

      predictions.push({
        symbol: opp.symbol,
        timeHorizon: daysToExpiry < 7 ? 'short_term' : (daysToExpiry < 30 ? 'medium_term' : 'long_term'),
        direction: direction,
        probability: this.calculatePredictiveAccuracy(opportunities) * 0.9 + PHYSICAL_CONSTANTS.MARKET_VOLATILITY, 
        keyFactors: ['implied_volatility', 'delta_gamma_dynamics', 'market_sentiment'],
        optimalExitWindow: daysToExpiry < 7 ? 'near_expiry' : 'mid_term',
      });
    });
    return predictions;
  }

  // Realiza un análisis cíclico de las oportunidades
  private performCyclicalAnalysis(opportunities: NakedOpportunity[]): CyclicalAnalysis {
    const avgVol = opportunities.reduce((sum, opp) => sum + opp.volume24h, 0) / (opportunities.length || 1);
    const dominantPeriod = avgVol > 1000 ? 50 : 21; 

    const currentTime = Date.now();
    const cycleProgress = (currentTime % (dominantPeriod * 24 * 60 * 60 * 1000)) / (dominantPeriod * 24 * 60 * 60 * 1000);
    let currentPhase: string;
    let nextTransition: string;

    if (cycleProgress < 0.25) {
      currentPhase = 'expansion';
      nextTransition = 'peak';
    } else if (cycleProgress < 0.5) {
      currentPhase = 'peak';
      nextTransition = 'contraction';
    } else if (cycleProgress < 0.75) {
      currentPhase = 'contraction';
      nextTransition = 'trough';
    } else {
      currentPhase = 'trough';
      nextTransition = 'expansion';
    }

    const confidence = this.calculatePredictiveAccuracy(opportunities) * 0.8; 

    return {
      dominantCycle: { period: dominantPeriod },
      currentPhase: currentPhase,
      nextTransition: nextTransition,
      confidence: confidence,
    };
  }

  // Función auxiliar para normalizar valores
  private normalizeValue(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }
}

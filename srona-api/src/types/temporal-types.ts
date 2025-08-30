export interface TemporalData {
  globalCoherence: number;
  predictiveAccuracy: number;
  phaseSynchronization: PhaseSynchronization[];
  coherenceAnalysis: CoherenceAnalysis;
  temporalPatterns: TemporalPattern[];
  predictions: TemporalPrediction[];
  cyclicalAnalysis: CyclicalAnalysis;
}

// Interfaces específicas para datos temporales
export interface CoherenceAnalysis {
  globalCoherence: number; // Agregado para consistencia
  timeframes: {
    '1m': number;
    '5m': number;
    '15m': number;
    '1h': number;
  };
}

export interface TemporalPattern {
  symbol: string;
  type: string;
  strength: number;
  timeframes: string[];
  confidence: number;
}

export interface TemporalPrediction {
  symbol: string;
  timeHorizon: string;
  direction: string;
  probability: number;
  keyFactors: string[];
  optimalExitWindow: string;
}

export interface CyclicalAnalysis {
  dominantCycle: {
    period: number;
  };
  currentPhase: string;
  nextTransition: string;
  confidence: number;
}

export interface PhaseSynchronization {
  symbol1: string;
  symbol2: string;
  level: number;
  phaseLag: number;
  stability: number;
}

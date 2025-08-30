export interface FrequencyData {
  coherence: number;
  anomalyStrength: number;
  theta: {
    frequencies: Array<{ value: number; amplitude: number }>;
    patterns: string[];
    averageDecayRate: number;
    resonancePoints: string[];
  };
  iv: {
    crushProbability: number;
    volatilityOfVolatility: number;
    skew: number;
    termStructure: string;
    surfaceAnalysis: string;
  };
  delta: {
    neutralityScore: number;
    breakdownRisk: number;
    gammaExposure: number;
    hedgeRatio: number;
    sensitivityMap: { [key: string]: number };
  };
  resonance: {
    patterns: ResonancePattern[];
  };
  anomalies: FrequencyAnomaly[];
}

// Interfaces específicas para datos de frecuencia
export interface ThetaFrequency {
  dominantFrequency: number;
  maxAmplitude: number;
  patterns: string[];
  averageDecayRate: number; // Agregado
  resonancePoints: string[]; // Agregado
  frequencies: Array<{ value: number; amplitude: number }>; // Agregado

}

export interface IVFrequency {
  crushProbability: number;
  volatilityOfVolatility: number;
  skew: number; // Skew general (put-call)
  termStructure: string;
  surfaceAnalysis: string; // Puede ser 'rough', 'smooth', 'inverted' etc.
  volatilitySmile: { // Descripción cuantitativa de la 'sonrisa'
    otmCallIV: number;
    atmMonoIV: number; // ATM "mono" (único)
    otmPutIV: number;
    butterflyImpact: number; // Impacto de la forma de mariposa
  };
  ivMomentum: number; // Velocidad de cambio de la IV promedio
  ivAcceleration: number; // Aceleración de cambio de la IV promedio
}

export interface DeltaFrequency {
  neutralityScore: number;
  breakdownRisk: number;
  gammaExposure: number;
  hedgeRatio: number;
  sensitivityMap: { [key: string]: number };
  gammaDistribution: { // Cómo Gamma se distribuye en strikes
    atmGamma: number;
    otmGamma: number;
    itmGamma: number;
    peakGammaStrike: number; // Strike con mayor Gamma
  };
  vanna: number; // Impacto del cambio de IV en Delta
  charm: number; // Impacto del tiempo en Delta
}

export interface ResonancePattern {
  symbol: string;
  strength: number;
  frequency: number;
  type: string;
  phase: number;
  stability: number;
}

export interface FrequencyAnomaly {
  confidence: number;
  type: string;
  description: string;
  severity: string;
  affectedSymbols: string[];
}

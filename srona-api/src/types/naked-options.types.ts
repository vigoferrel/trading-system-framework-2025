export interface NakedOpportunity {
  id: string;
  symbol: string;
  type: 'NAKED_CALL' | 'NAKED_PUT';
  strike: number;
  expiry: number;
  spotPrice: number;
  premium: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  volume24h: number;
  openInterest: number;
  
  // Propiedades calculadas en el backend (se envían al frontend)
  nakedScore?: number;
  liquidityScore?: number;
  riskRewardRatio?: number;
  probabilityOfProfit: number;
  expectedReturn: number;
  timeToMaxProfit: number;
  riskLevel?: number;
  alertTriggers?: AlertTrigger[];
  maxLoss?: number;

  // Scores más detallados del detector
  detectorScores?: { // Renombrado a detectorScores
    photonic: number;
    fundamental: number;
    technical: number;
    risk: number;
    liquidity: number;
    akashic: number;
    final: number;
    temporal?: number;
  };
  nakedOptionScores?: NakedOptionScore; // Nuevo campo para el score del NakedOptionsDetector
}

export interface AlertTrigger {
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
}

export interface NakedOptionScore {
  // Componentes del score (0-1 cada uno)
  volatilityMispricing: number;
  volumeAnomaly: number;
  openInterestImbalance: number;
  deltaFlowDivergence: number;
  gammaExposureRisk: number;
  thetaDecayBenefit: number;
  vegaRiskReward: number;
  marketSentimentEdge: number;
  
  // Score final compuesto
  revelationScore: number;
  confidenceLevel: number;
  expectedProfit: number;
  maxRisk: number;
}

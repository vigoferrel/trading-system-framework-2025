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
  nakedScore?: number;        // Agregado
  liquidityScore?: number;    // Agregado
  riskRewardRatio?: number;   // Agregado
  scores?: {
    photonic: number;
    fundamental: number;
    technical: number;
    risk: number;
    liquidity: number;
    akashic: number;
    final: number;
    temporal?: number;
  };
  probabilityOfProfit: number;
  expectedReturn: number;
  timeToMaxProfit: number;
  riskLevel?: number;
  alertTriggers?: AlertTrigger[];
  maxLoss?: number;
}

export interface EdgeSuggestion {
  id: string;
  symbol: string;
  action: string;
  confidence: number;
  timing: string;
  reasoning: string;
  riskManagement: string;
  edgeFactors: {
    frequencyEdge: number;
    temporalEdge: number;
    combinedEdge: number;
  };
}

export interface AlertTrigger {
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
}

export interface EdgeMetrics {
  frequencyEdge: number;
  temporalEdge: number;
  combinedEdge: number;
}

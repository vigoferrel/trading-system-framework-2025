// Tipos fundamentales del Sistema Cuántico Matriz 13x13

// Los 13 activos estratégicos de la matriz
export type QuantumAssetSymbol = 
  | 'BTC' | 'ETH' | 'BNB' | 'SOL' | 'ADA' 
  | 'USDT' | 'USDC' | 'BUSD' | 'DOT' | 'LINK' 
  | 'AVAX' | 'UNI' | 'DOGE';

// Factores cuánticos fundamentales
export interface QuantumFactors {
  // Factores físicos
  entanglement: number;    // 0-1: Correlación con otros activos
  coherence: number;       // 0-1: Consistencia del patrón
  momentum: number;        // 0-1: Momentum cuántico
  density: number;         // 0-1: Densidad de información
  temperature: number;     // 0-1: Temperatura del mercado
  
  // Factores derivados
  volatilidad: number;     // Volatilidad cuántica calculada
  phase: number;           // Fase cuántica (0-360 grados)
  amplitude: number;       // Amplitud cuántica (0-2)
  frequency: number;       // Frecuencia de oscilación (ms)

  // Nuevos factores cuánticos
  quantumEntropy: number;   // 0-1: Entropía cuántica del mercado
  superpositionIndex: number; // 0-1: Índice de superposición
  tunnelingProbability: number; // 0-1: Probabilidad de tunelaje
}

// Datos de precios y mercado
export interface MarketData {
  spot: {
    price: number;
    volume: number;
    change24h: number;
  };
  futures: {
    price: number;
    volume: number;
    basis: number;
    fundingRate: number;
    timeToExpiry: number;
  };
  options: {
    calls: OptionData[];
    puts: OptionData[];
    impliedVolatility: number;
  };
  liquidity: {
    score: number;        // 0-1: Score de liquidez
    depth: number;        // Profundidad del libro
    spread: number;       // Spread bid-ask
  };
}

export interface OptionData {
  strike: number;
  price: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  timeToExpiry: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

// Activo cuántico completo
export interface QuantumAsset {
  symbol: QuantumAssetSymbol;
  matrixPosition: [number, number];  // Posición en matriz 13x13
  
  // Datos de mercado
  market: MarketData;
  
  // Factores cuánticos
  quantum: QuantumFactors;
  
  // Precios calculados por nuestro modelo
  pricing: {
    quantumSpotPrice: number;
    quantumFuturesPrice: number;
    quantumOptionsPrice: {
      calls: number[];
      puts: number[];
    };
  };
  
  // Métricas de confianza
  confidence: number;      // 0-1: Confianza en nuestro modelo
  lastUpdated: number;     // Timestamp de última actualización
}

// Tipos de oportunidades de arbitraje
export type ArbitrageType = 
  | 'BASIS_ARBITRAGE'      // Spot vs Futuros
  | 'NAKED_CALL'          // Opción call naked
  | 'NAKED_PUT'           // Opción put naked
  | 'COMBINED'            // Combinación de estrategias
  | 'NEUTRAL';            // Sin oportunidades

// Oportunidad de arbitraje detectada
export interface ArbitrageOpportunity {
  id: string;
  asset: QuantumAssetSymbol;
  type: ArbitrageType;
  
  // Detalles de la oportunidad
  strategy: string;
  differential: number;    // Diferencial de precio (%)
  expectedProfit: number;  // Profit esperado
  maxRisk: number;        // Riesgo máximo
  
  // Score de la oportunidad
  score: number;          // 0-1: Score combinado
  liquidityScore: number; // 0-1: Score de liquidez
  confidenceScore: number; // 0-1: Confianza del modelo
  
  // Gestión de riesgo
  riskManagement: {
    stopLoss: number;
    takeProfit: number;
    maxRisk: number;
    hedgeRatio?: number;
  };
  
  // Timing
  detectedAt: number;
  expiresAt: number;
  optimalExecutionTime?: number;
}

// Celda de la matriz 13x13
export interface MatrixCell {
  asset: QuantumAssetSymbol;
  position: [number, number];
  
  // Visualización
  color: 'green' | 'red' | 'blue' | 'yellow' | 'gray';
  intensity: number;      // 0-100: Intensidad del color
  
  // Datos de la oportunidad
  opportunity: ArbitrageOpportunity | null;
  
  // Estado cuántico visual
  quantumState: {
    phase: number;        // Rotación del indicador cuántico
    amplitude: number;    // Escala del indicador
    frequency: number;    // Velocidad de animación
  };
}

// Matriz completa 13x13
export interface QuantumMatrix {
  cells: MatrixCell[][];  // 13x13 grid
  lastUpdated: number;
  totalOpportunities: number;
  averageScore: number;
}

// Configuración del copilot
export interface CopilotContext {
  selectedCell?: MatrixCell;
  conversationHistory: CopilotMessage[];
  systemState: {
    quantumEngine: object;
    mlOptimizer: object;
    riskManager: object;
  };
}

export interface CopilotMessage {
  id: string;
  type: 'user' | 'copilot';
  content: string;
  timestamp: number;
  context?: Record<string, unknown> | MatrixCell | CopilotResponse | null;
}

// Respuesta del copilot
export interface CopilotResponse {
  visual: string;           // Explicación visual simple
  technical: {              // Explicación técnica detallada
    quantumPricing: string;
    arbitrageDetected: string;
    quantumFactors: Record<string, string>;
    mlOptimizations: string;
    riskManagement: Record<string, string>;
    strategy: string;
    confidence: string;
  };
  recommendation: string;   // Recomendación final
  actions?: string[];      // Acciones sugeridas
}

// Configuración del ML Optimizer
export interface MLOptimizerConfig {
  optimizationFrequency: number;  // ms entre optimizaciones
  learningRate: number;
  batchSize: number;
  maxIterations: number;
}

export interface MLOptimization {
  factorAdjustments: Partial<Record<keyof QuantumFactors, {
    previousWeight: number;
    newWeight: number;
    improvement: number;
    reason: string;
  }>>;
  accuracyImprovement: number;
  tradesAnalyzed: number;
  timestamp: number;
}

// Gestión de riesgo
export interface RiskParameters {
  stopLoss: number;
  takeProfit: number;
  maxDrawdown: number;
  positionSize: number;
  hedgeRatio?: number;
  monitoringFrequency: number;  // ms
}

export interface RiskMonitoring {
  positionId: string;
  asset: QuantumAssetSymbol;
  parameters: RiskParameters;
  currentState: {
    price: number;
    pnl: number;
    risk: number;
    quantum: QuantumFactors;
  };
  adjustments: RiskAdjustment[];
  lastCheck: number;
}

export interface RiskAdjustment {
  timestamp: number;
  type: 'STOP_LOSS' | 'TAKE_PROFIT' | 'HEDGE' | 'EXIT';
  previousValue: number;
  newValue: number;
  reason: string;
}

// Configuración del sistema
export interface QuantumSystemConfig {
  assets: QuantumAssetSymbol[];
  updateFrequency: number;      // ms entre actualizaciones
  mlOptimizer: MLOptimizerConfig;
  riskManagement: {
    defaultStopLoss: number;
    defaultTakeProfit: number;
    maxPositions: number;
    monitoringFrequency: number;
  };
  ui: {
    matrixSize: number;         // Siempre 13 para matriz 13x13
    animationSpeed: number;
    colorIntensity: number;
  };
}

// Estados del sistema
export type SystemStatus = 'INITIALIZING' | 'RUNNING' | 'PAUSED' | 'ERROR';

export interface SystemState {
  status: SystemStatus;
  lastUpdate: number;
  totalAssets: number;
  activeOpportunities: number;
  totalTrades: number;
  performance: {
    accuracy: number;
    profitLoss: number;
    winRate: number;
    quantumScore: number;
    riskAdjustedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  quantumMetrics: {
    coherenceIndex: number;
    entanglementScore: number;
    quantumVolatility: number;
  };
}

// Eventos del sistema
export interface SystemEvent {
  id: string;
  type: 'OPPORTUNITY_DETECTED' | 'TRADE_EXECUTED' | 'RISK_TRIGGERED' | 'ML_OPTIMIZED' | 'ERROR';
  timestamp: number;
  data: Record<string, unknown>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

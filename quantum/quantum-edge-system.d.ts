export = QuantumEdgeSystem;
declare class QuantumEdgeSystem extends EventEmitter<[never]> {
    constructor(config?: {});
    config: {
        enableQuantumTiming: boolean;
        enableQuantumArbitrage: boolean;
        enableQuantumPrediction: boolean;
        enableQuantumOptimization: boolean;
        edgeUpdateInterval: any;
        minEdgeThreshold: any;
        maxPositionSize: any;
        riskTolerance: any;
        quantumPrecision: any;
    };
    QUANTUM_EDGE_CONSTANTS: {
        Z_REAL: number;
        Z_IMAG: number;
        LAMBDA: number;
        PHI: number;
        EDGE_AMPLIFICATION: number;
        TIMING_PRECISION: number;
        ARBITRAGE_THRESHOLD: number;
        PREDICTION_HORIZON: number;
        OPTIMIZATION_CYCLES: number;
        QUANTUM_ADVANTAGE_FACTORS: {
            SUPERPOSITION: number;
            ENTANGLEMENT: number;
            COHERENCE: number;
            TUNNELING: number;
        };
    };
    edgeState: {
        isActive: boolean;
        currentEdge: number;
        timingAdvantage: number;
        arbitrageOpportunities: never[];
        predictionAccuracy: number;
        portfolioOptimization: number;
        quantumAdvantage: number;
        lastUpdate: null;
    };
    edgeMetrics: {
        totalEdgesDetected: number;
        successfulTrades: number;
        totalProfit: number;
        averageEdge: number;
        maxEdge: number;
        edgeEfficiency: number;
        quantumEnhancement: number;
    };
    edgeSystems: {
        timing: QuantumTimingSystem;
        arbitrage: QuantumArbitrageSystem;
        prediction: QuantumPredictionSystem;
        optimization: QuantumOptimizationSystem;
    };
    edgeCache: Map<any, any>;
    /**
     * Inicializa el sistema de edge cuántico
     */
    initializeQuantumEdgeSystem(): void;
    /**
     * Inicia el sistema de edge cuántico
     */
    start(): void;
    /**
     * Detiene el sistema de edge cuántico
     */
    stop(): void;
    /**
     * Inicia el ciclo de detección de edges
     */
    startEdgeDetectionCycle(): void;
    /**
     * Detecta edges cuánticos en el mercado
     */
    detectQuantumEdges(): Promise<void>;
    /**
     * Detecta edges de timing cuántico
     */
    detectQuantumTimingEdges(): Promise<{
        advantage: number;
        opportunities: never[];
        precision?: undefined;
        quantumEnhancement?: undefined;
    } | {
        advantage: number;
        opportunities: any[];
        precision: number;
        quantumEnhancement: number;
    }>;
    /**
     * Calcula edge de timing para un símbolo específico
     */
    calculateSymbolTimingEdge(symbol: any, quantumTime: any): {
        edge: number;
        timeWindow: number;
        quantumAdvantage: number;
    };
    /**
     * Detecta oportunidades de arbitraje cuántico
     */
    detectQuantumArbitrageEdges(): Promise<{
        opportunities: never[];
        totalEdge: number;
        quantumEnhancement?: undefined;
    } | {
        opportunities: any[];
        totalEdge: any;
        quantumEnhancement: number;
    }>;
    /**
     * Calcula oportunidad de arbitraje entre dos exchanges
     */
    calculateArbitrageOpportunity(symbol: any, exchange1: any, exchange2: any): {
        symbol: any;
        exchange1: any;
        exchange2: any;
        price1: number;
        price2: number;
        edge: number;
        direction: string;
        estimatedProfit: number;
        executionTime: number;
        quantumAdvantage: number;
    };
    /**
     * Genera predicciones cuánticas
     */
    generateQuantumPredictions(): Promise<{
        predictions: never[];
        accuracy: number;
        horizon?: undefined;
        quantumEnhancement?: undefined;
    } | {
        predictions: any[];
        accuracy: number;
        horizon: number;
        quantumEnhancement: number;
    }>;
    /**
     * Genera predicción cuántica para un símbolo
     */
    generateSymbolPrediction(symbol: any, horizon: any): {
        symbol: any;
        direction: string;
        magnitude: number;
        confidence: number;
        horizon: any;
        targetTime: number;
        quantumStates: {
            state1: number;
            state2: number;
            superposition: number;
        };
        quantumAdvantage: number;
    };
    /**
     * Optimiza portafolio cuánticamente
     */
    optimizeQuantumPortfolio(): Promise<{
        allocation: {};
        expectedReturn: number;
        risk: number;
        sharpeRatio?: undefined;
        quantumEnhancement?: undefined;
    } | {
        allocation: {};
        expectedReturn: number;
        risk: number;
        sharpeRatio: number;
        quantumEnhancement: number;
    }>;
    /**
     * Genera asignación cuántica de portafolio
     */
    generateQuantumAllocation(symbols: any, cycle: any): {};
    /**
     * Evalúa una asignación de portafolio
     */
    evaluateAllocation(allocation: any): {
        expectedReturn: number;
        risk: number;
    };
    /**
     * Combina todos los edges cuánticos
     */
    combineQuantumEdges(edges: any): {
        totalEdge: number;
        components: any;
        quantumAmplification: number;
        confidence: number;
        recommendations: any[];
    };
    /**
     * Genera recomendaciones basadas en edges
     */
    generateEdgeRecommendations(edges: any): any[];
    /**
     * Actualiza el estado del edge
     */
    updateEdgeState(combinedEdge: any): void;
    /**
     * Actualiza las métricas de edge
     */
    updateEdgeMetrics(combinedEdge: any): void;
    hashSymbol(symbol: any): number;
    getSymbolMultiplier(symbol: any): any;
    getSymbolExpectedReturn(symbol: any): number;
    getSymbolRisk(symbol: any): number;
    /**
     * Obtiene el estado actual del sistema de edge
     */
    getEdgeStatus(): {
        edgeState: {
            isActive: boolean;
            currentEdge: number;
            timingAdvantage: number;
            arbitrageOpportunities: never[];
            predictionAccuracy: number;
            portfolioOptimization: number;
            quantumAdvantage: number;
            lastUpdate: null;
        };
        edgeMetrics: {
            totalEdgesDetected: number;
            successfulTrades: number;
            totalProfit: number;
            averageEdge: number;
            maxEdge: number;
            edgeEfficiency: number;
            quantumEnhancement: number;
        };
        config: {
            enableQuantumTiming: boolean;
            enableQuantumArbitrage: boolean;
            enableQuantumPrediction: boolean;
            enableQuantumOptimization: boolean;
            edgeUpdateInterval: any;
            minEdgeThreshold: any;
            maxPositionSize: any;
            riskTolerance: any;
            quantumPrecision: any;
        };
        constants: {
            Z_REAL: number;
            Z_IMAG: number;
            LAMBDA: number;
            PHI: number;
            EDGE_AMPLIFICATION: number;
            TIMING_PRECISION: number;
            ARBITRAGE_THRESHOLD: number;
            PREDICTION_HORIZON: number;
            OPTIMIZATION_CYCLES: number;
            QUANTUM_ADVANTAGE_FACTORS: {
                SUPERPOSITION: number;
                ENTANGLEMENT: number;
                COHERENCE: number;
                TUNNELING: number;
            };
        };
        cacheSize: number;
        timestamp: number;
    };
    /**
     * Obtiene estadísticas detalladas
     */
    getDetailedStatistics(): {
        systemPerformance: {
            edgeDetectionRate: number;
            averageEdgeValue: number;
            maxEdgeValue: number;
            edgeEfficiency: number;
            quantumEnhancement: number;
        };
        edgeState: {
            isActive: boolean;
            currentEdge: number;
            timingAdvantage: number;
            arbitrageOpportunities: never[];
            predictionAccuracy: number;
            portfolioOptimization: number;
            quantumAdvantage: number;
            lastUpdate: null;
        };
        edgeMetrics: {
            totalEdgesDetected: number;
            successfulTrades: number;
            totalProfit: number;
            averageEdge: number;
            maxEdge: number;
            edgeEfficiency: number;
            quantumEnhancement: number;
        };
        config: {
            enableQuantumTiming: boolean;
            enableQuantumArbitrage: boolean;
            enableQuantumPrediction: boolean;
            enableQuantumOptimization: boolean;
            edgeUpdateInterval: any;
            minEdgeThreshold: any;
            maxPositionSize: any;
            riskTolerance: any;
            quantumPrecision: any;
        };
        constants: {
            Z_REAL: number;
            Z_IMAG: number;
            LAMBDA: number;
            PHI: number;
            EDGE_AMPLIFICATION: number;
            TIMING_PRECISION: number;
            ARBITRAGE_THRESHOLD: number;
            PREDICTION_HORIZON: number;
            OPTIMIZATION_CYCLES: number;
            QUANTUM_ADVANTAGE_FACTORS: {
                SUPERPOSITION: number;
                ENTANGLEMENT: number;
                COHERENCE: number;
                TUNNELING: number;
            };
        };
        cacheSize: number;
        timestamp: number;
    };
}
import EventEmitter = require("events");
declare class QuantumTimingSystem {
    constructor(config: any);
    config: any;
    initialize(): void;
}
declare class QuantumArbitrageSystem {
    constructor(config: any);
    config: any;
    initialize(): void;
}
declare class QuantumPredictionSystem {
    constructor(config: any);
    config: any;
    initialize(): void;
}
declare class QuantumOptimizationSystem {
    constructor(config: any);
    config: any;
    initialize(): void;
}
//# sourceMappingURL=quantum-edge-system.d.ts.map
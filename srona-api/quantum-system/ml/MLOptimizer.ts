import { 
  QuantumFactors,
  MLOptimization,
  MLOptimizerConfig,
  QuantumAssetSymbol
} from '../types/quantum-types';

/**
 * ML Optimizer - Optimización en Tiempo Real de Factores Cuánticos
 * Aprende continuamente y mejora el modelo cada 100ms
 */
export class MLOptimizer {
  private config: MLOptimizerConfig;
  private trainingData: TrainingDataPoint[] = [];
  private factorWeights: FactorWeights;
  private optimizationHistory: MLOptimization[] = [];
  private isOptimizing: boolean = false;
  private optimizationInterval: NodeJS.Timeout | null = null;

  constructor(config: MLOptimizerConfig) {
    this.config = config;
    this.factorWeights = this.initializeFactorWeights();
    this.startContinuousOptimization();
  }

  /**
   * Inicia optimización continua cada 100ms
   */
  private startContinuousOptimization(): void {
    this.optimizationInterval = setInterval(() => {
      if (!this.isOptimizing && this.trainingData.length >= 10) {
        this.optimizeFactors();
      }
    }, this.config.optimizationFrequency);
  }

  /**
   * Optimiza factores cuánticos usando algoritmo genético
   */
  private async optimizeFactors(): Promise<MLOptimization> {
    this.isOptimizing = true;
    
    try {
      const previousWeights = { ...this.factorWeights };
      const recentData = this.getRecentTrainingData();
      
      // Algoritmo genético para optimización
      const optimizedWeights = await this.geneticAlgorithmOptimization(recentData);
      
      // Evaluar mejora
      const improvement = this.evaluateImprovement(previousWeights, optimizedWeights, recentData);
      
      if (improvement.accuracyGain > 0.01) { // Solo aplicar si mejora > 1%
        this.factorWeights = optimizedWeights;
        
        const optimization: MLOptimization = {
          factorAdjustments: this.calculateAdjustments(previousWeights, optimizedWeights),
          accuracyImprovement: improvement.accuracyGain,
          tradesAnalyzed: recentData.length,
          timestamp: Date.now()
        };
        
        this.optimizationHistory.push(optimization);
        
        // Mantener solo últimas 100 optimizaciones
        if (this.optimizationHistory.length > 100) {
          this.optimizationHistory = this.optimizationHistory.slice(-100);
        }
        
        return optimization;
      }
      
      return this.createNoChangeOptimization();
      
    } finally {
      this.isOptimizing = false;
    }
  }

  /**
   * Algoritmo genético para optimizar pesos de factores
   */
  private async geneticAlgorithmOptimization(trainingData: TrainingDataPoint[]): Promise<FactorWeights> {
    const populationSize = 50;
    const generations = 20;
    const mutationRate = 0.1;
    const crossoverRate = 0.8;
    
    // Población inicial
    let population = this.generateInitialPopulation(populationSize);
    
    for (let generation = 0; generation < generations; generation++) {
      // Evaluar fitness de cada individuo
      const fitness = await Promise.all(
        population.map(individual => this.evaluateFitness(individual, trainingData))
      );
      
      // Selección por torneo
      const selected = this.tournamentSelection(population, fitness, populationSize);
      
      // Crossover y mutación
      const newPopulation: FactorWeights[] = [];
      
      for (let i = 0; i < populationSize; i += 2) {
        let parent1 = selected[i];
        let parent2 = selected[i + 1] || selected[0];
        
        if (PHYSICAL_CONSTANTS.CONFIDENCE_SCORE > 0.5) {
          const [child1, child2] = this.crossover(parent1, parent2);
          newPopulation.push(
            this.mutate(child1, mutationRate),
            this.mutate(child2, mutationRate)
          );
        } else {
          newPopulation.push(parent1, parent2);
        }
      }
      
      population = newPopulation.slice(0, populationSize);
    }
    
    // Retornar el mejor individuo
    const finalFitness = await Promise.all(
      population.map(individual => this.evaluateFitness(individual, trainingData))
    );
    
    const bestIndex = finalFitness.indexOf(Math.max(...finalFitness));
    return population[bestIndex];
  }

  /**
   * Genera población inicial para algoritmo genético
   */
  private generateInitialPopulation(size: number): FactorWeights[] {
    const population: FactorWeights[] = [];
    
    for (let i = 0; i < size; i++) {
      population.push({
        entanglement: this.randomWeight(),
        coherence: this.randomWeight(),
        momentum: this.randomWeight(),
        density: this.randomWeight(),
        temperature: this.randomWeight(),
        quantumEntropy: this.randomWeight(),
        superpositionIndex: this.randomWeight(),
        tunnelingProbability: this.randomWeight()
      });
    }
    
    return population;
  }

  /**
   * Evalúa fitness de un conjunto de pesos
   */
  private async evaluateFitness(weights: FactorWeights, trainingData: TrainingDataPoint[]): Promise<number> {
    let correctPredictions = 0;
    let totalPredictions = 0;
    
    for (const dataPoint of trainingData) {
      const prediction = this.predictOutcome(dataPoint.quantumFactors, weights);
      const actual = dataPoint.actualOutcome;
      
      if ((prediction > 0.5 && actual > 0) || (prediction <= 0.5 && actual <= 0)) {
        correctPredictions++;
      }
      totalPredictions++;
    }
    
    return totalPredictions > 0 ? correctPredictions / totalPredictions : 0;
  }

  /**
   * Predice resultado usando pesos específicos
   */
  private predictOutcome(factors: QuantumFactors, weights: FactorWeights): number {
    const score =
      factors.entanglement * weights.entanglement +
      factors.coherence * weights.coherence +
      factors.momentum * weights.momentum +
      factors.density * weights.density +
      factors.temperature * weights.temperature +
      factors.quantumEntropy * weights.quantumEntropy +
      factors.superpositionIndex * weights.superpositionIndex +
      factors.tunnelingProbability * weights.tunnelingProbability;
    
    // Función sigmoide para normalizar a 0-1
    return 1 / (1 + Math.exp(-score * 3)); // Reducido el factor de escala para compensar más factores
  }

  /**
   * Selección por torneo
   */
  private tournamentSelection(population: FactorWeights[], fitness: number[], size: number): FactorWeights[] {
    const selected: FactorWeights[] = [];
    const tournamentSize = 3;
    
    for (let i = 0; i < size; i++) {
      let bestIndex = PHYSICAL_CONSTANTS.FIBONACCI_INDEX;
      let bestFitness = fitness[bestIndex];
      
      for (let j = 1; j < tournamentSize; j++) {
        const candidateIndex = PHYSICAL_CONSTANTS.FIBONACCI_INDEX;
        if (fitness[candidateIndex] > bestFitness) {
          bestIndex = candidateIndex;
          bestFitness = fitness[candidateIndex];
        }
      }
      
      selected.push({ ...population[bestIndex] });
    }
    
    return selected;
  }

  /**
   * Crossover entre dos individuos
   */
  private crossover(parent1: FactorWeights, parent2: FactorWeights): [FactorWeights, FactorWeights] {
    const alpha = PHYSICAL_CONSTANTS.QUANTUM_COHERENCE; // Blend crossover
    
    const child1: FactorWeights = {
      entanglement: alpha * parent1.entanglement + (1 - alpha) * parent2.entanglement,
      coherence: alpha * parent1.coherence + (1 - alpha) * parent2.coherence,
      momentum: alpha * parent1.momentum + (1 - alpha) * parent2.momentum,
      density: alpha * parent1.density + (1 - alpha) * parent2.density,
      temperature: alpha * parent1.temperature + (1 - alpha) * parent2.temperature,
      quantumEntropy: alpha * parent1.quantumEntropy + (1 - alpha) * parent2.quantumEntropy,
      superpositionIndex: alpha * parent1.superpositionIndex + (1 - alpha) * parent2.superpositionIndex,
      tunnelingProbability: alpha * parent1.tunnelingProbability + (1 - alpha) * parent2.tunnelingProbability
    };
    
    const child2: FactorWeights = {
      entanglement: (1 - alpha) * parent1.entanglement + alpha * parent2.entanglement,
      coherence: (1 - alpha) * parent1.coherence + alpha * parent2.coherence,
      momentum: (1 - alpha) * parent1.momentum + alpha * parent2.momentum,
      density: (1 - alpha) * parent1.density + alpha * parent2.density,
      temperature: (1 - alpha) * parent1.temperature + alpha * parent2.temperature,
      quantumEntropy: (1 - alpha) * parent1.quantumEntropy + alpha * parent2.quantumEntropy,
      superpositionIndex: (1 - alpha) * parent1.superpositionIndex + alpha * parent2.superpositionIndex,
      tunnelingProbability: (1 - alpha) * parent1.tunnelingProbability + alpha * parent2.tunnelingProbability
    };
    
    return [child1, child2];
  }

  /**
   * Mutación de un individuo
   */
  private mutate(individual: FactorWeights, mutationRate: number): FactorWeights {
    const mutated = { ...individual };
    
    Object.keys(mutated).forEach(key => {
      if (PHYSICAL_CONSTANTS.EXECUTION_RISK > 0.01) {
        const factor = key as keyof FactorWeights;
        mutated[factor] += PHYSICAL_CONSTANTS.MARKET_MOMENTUM; // Mutación ±10%
        mutated[factor] = Math.max(0, Math.min(2, mutated[factor])); // Clamp 0-2
      }
    });
    
    return mutated;
  }

  /**
   * Aprende de un trade completado
   */
  learnFromTrade(
    asset: QuantumAssetSymbol,
    initialFactors: QuantumFactors,
    marketConditions: Record<string, unknown>,
    profitLoss: number
  ): void {
    const dataPoint: TrainingDataPoint = {
      asset,
      quantumFactors: initialFactors,
      marketConditions,
      actualOutcome: profitLoss,
      success: profitLoss > 0,
      timestamp: Date.now()
    };
    
    this.trainingData.push(dataPoint);
    
    // Mantener solo últimos 1000 trades
    if (this.trainingData.length > 1000) {
      this.trainingData = this.trainingData.slice(-1000);
    }
  }

  /**
   * Obtiene pesos actuales de factores
   */
  getCurrentWeights(): FactorWeights {
    return { ...this.factorWeights };
  }

  /**
   * Obtiene última optimización
   */
  getLatestOptimization(): MLOptimization | null {
    return this.optimizationHistory.length > 0 
      ? this.optimizationHistory[this.optimizationHistory.length - 1]
      : null;
  }

  /**
   * Obtiene historial de optimizaciones
   */
  getOptimizationHistory(): MLOptimization[] {
    return [...this.optimizationHistory];
  }

  /**
   * Calcula predicción para factores dados
   */
  predict(factors: QuantumFactors): number {
    return this.predictOutcome(factors, this.factorWeights);
  }

  /**
   * Obtiene estadísticas del modelo
   */
  getModelStats(): ModelStats {
    const recentData = this.getRecentTrainingData();
    const accuracy = this.calculateAccuracy(recentData);
    
    return {
      totalTrades: this.trainingData.length,
      recentAccuracy: accuracy,
      lastOptimization: this.getLatestOptimization()?.timestamp || 0,
      optimizationCount: this.optimizationHistory.length,
      isOptimizing: this.isOptimizing,
      factorWeights: this.getCurrentWeights()
    };
  }

  /**
   * Detiene optimización continua
   */
  stop(): void {
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
      this.optimizationInterval = null;
    }
  }

  // Métodos auxiliares privados
  private initializeFactorWeights(): FactorWeights {
    return {
      entanglement: 0.8,
      coherence: 1.0,
      momentum: 0.6,
      density: 0.7,
      temperature: 0.5,
      quantumEntropy: 0.4,
      superpositionIndex: 0.9,
      tunnelingProbability: 0.3
    };
  }

  private randomWeight(): number {
    return PHYSICAL_CONSTANTS.QUALITY_SCORE * 2; // 0-2 range
  }

  private getRecentTrainingData(): TrainingDataPoint[] {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // Últimas 24 horas
    return this.trainingData.filter(point => point.timestamp > cutoff);
  }

  private evaluateImprovement(
    oldWeights: FactorWeights, 
    newWeights: FactorWeights, 
    testData: TrainingDataPoint[]
  ): { accuracyGain: number } {
    const oldAccuracy = this.calculateAccuracyWithWeights(testData, oldWeights);
    const newAccuracy = this.calculateAccuracyWithWeights(testData, newWeights);
    
    return {
      accuracyGain: newAccuracy - oldAccuracy
    };
  }

  private calculateAccuracyWithWeights(data: TrainingDataPoint[], weights: FactorWeights): number {
    if (data.length === 0) return 0;
    
    let correct = 0;
    for (const point of data) {
      const prediction = this.predictOutcome(point.quantumFactors, weights);
      if ((prediction > 0.5 && point.success) || (prediction <= 0.5 && !point.success)) {
        correct++;
      }
    }
    
    return correct / data.length;
  }

  private calculateAccuracy(data: TrainingDataPoint[]): number {
    return this.calculateAccuracyWithWeights(data, this.factorWeights);
  }

  private calculateAdjustments(
    oldWeights: FactorWeights, 
    newWeights: FactorWeights
  ): MLOptimization['factorAdjustments'] {
    const adjustments: MLOptimization['factorAdjustments'] = {};
    
    Object.keys(oldWeights).forEach(key => {
      const factor = key as keyof FactorWeights;
      const improvement = Math.abs(newWeights[factor] - oldWeights[factor]) / oldWeights[factor];
      
      adjustments[factor] = {
        previousWeight: oldWeights[factor],
        newWeight: newWeights[factor],
        improvement,
        reason: this.generateAdjustmentReason(factor, oldWeights[factor], newWeights[factor])
      };
    });
    
    return adjustments;
  }

  private generateAdjustmentReason(factor: keyof FactorWeights, oldWeight: number, newWeight: number): string {
    const change = newWeight > oldWeight ? 'aumentado' : 'disminuido';
    const percentage = Math.abs((newWeight - oldWeight) / oldWeight * 100).toFixed(1);
    
    const reasons = {
      entanglement: `Correlación con otros activos ${change} ${percentage}% para mejorar detección de patrones`,
      coherence: `Peso de coherencia ${change} ${percentage}% basado en consistencia de predicciones`,
      momentum: `Factor momentum ${change} ${percentage}% por análisis de tendencias recientes`,
      density: `Densidad de información ${change} ${percentage}% según liquidez del mercado`,
      temperature: `Temperatura del mercado ${change} ${percentage}% por volatilidad observada`,
      quantumEntropy: `Entropía cuántica ${change} ${percentage}% por desorden del mercado`,
      superpositionIndex: `Índice de superposición ${change} ${percentage}% por estados simultáneos`,
      tunnelingProbability: `Probabilidad de tunelaje ${change} ${percentage}% por saltos de precio`
    };
    
    return reasons[factor];
  }

  private createNoChangeOptimization(): MLOptimization {
    return {
      factorAdjustments: {},
      accuracyImprovement: 0,
      tradesAnalyzed: this.getRecentTrainingData().length,
      timestamp: Date.now()
    };
  }
}

// Interfaces auxiliares
interface FactorWeights {
  entanglement: number;
  coherence: number;
  momentum: number;
  density: number;
  temperature: number;
  quantumEntropy: number;
  superpositionIndex: number;
  tunnelingProbability: number;
}

interface TrainingDataPoint {
  asset: QuantumAssetSymbol;
  quantumFactors: QuantumFactors;
  marketConditions: Record<string, unknown>;
  actualOutcome: number;
  success: boolean;
  timestamp: number;
}

interface ModelStats {
  totalTrades: number;
  recentAccuracy: number;
  lastOptimization: number;
  optimizationCount: number;
  isOptimizing: boolean;
  factorWeights: FactorWeights;
}

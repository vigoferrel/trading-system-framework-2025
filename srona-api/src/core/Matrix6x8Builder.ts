import { NakedOpportunity } from '../types/srona-core-types';
import type { Matrix6x8, Matrix6x8Cell, Matrix6x9, Matrix6x9Cell, Matrix8x6, Matrix8x6Cell } from '../types/matrix.types';
import { PrimeTransformations } from './PrimeTransformations';
import { MemoriaTemporal } from './MemoriaTemporal';
import { AnalizadorFrecuencias } from './AnalizadorFrecuencias';
import { FrequencyData, ResonancePattern } from '../types/frequency-types';

export class Matrix6x8Builder {
  private readonly ASSETS = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE'];
  private readonly METRICS = [
    'impliedVolatility', // P2
    'volume24h',         // P3
    'openInterest',      // P5
    'putCallRatio',      // Este metric no viene directamente en NakedOpportunity, necesitaría un cálculo
    'delta',             // Usaremos Delta absoluto como proxy para Delta Flow - P11
    'gamma',             // Usaremos Gamma como proxy para Gamma Exposure - P13
    'theta',             // Usaremos Theta absoluto como proxy para Theta Decay - P17
    'vega'               // Usaremos Vega como proxy para Vega Risk - P19
  ];
  private primeTransformations: PrimeTransformations;

  constructor() {
    this.primeTransformations = new PrimeTransformations();
  }

  // Construye la matriz 6x8 a partir de oportunidades Naked
  public buildMatrix(opportunities: NakedOpportunity[]): Matrix6x8 {
    return this.buildMatrix6x8(opportunities);
  }

  // Construye Matrix6x9 con SentimientoAkashico usando componentes existentes
  public async buildMatrix6x9(
    opportunities: NakedOpportunity[],
    memoriaTemporal: MemoriaTemporal,
    analizadorFrecuencias: AnalizadorFrecuencias
  ): Promise<Matrix6x9> {
    const matrix6x8 = this.buildMatrix6x8(opportunities);
    return this.extendToMatrix6x9(matrix6x8, opportunities, memoriaTemporal, analizadorFrecuencias);
  }

  // Método interno para construir Matrix6x8 (código existente)
  private buildMatrix6x8(opportunities: NakedOpportunity[]): Matrix6x8 {
    const cells: Matrix6x8Cell[][] = [];

    this.ASSETS.forEach(asset => {
      const assetOpportunities = opportunities.filter(opp => opp.symbol === asset);
      const row: Matrix6x8Cell[] = [];

      this.METRICS.forEach(metric => {
        let value: number = 0;
        let transformedValue: number = 0;
        let quantum = { coherence: 0, entanglement: 0, momentum: 0, density: 0, temperature: 0, frequency: 0, amplitude: 0, phase: 0 };

        // Lógica de cálculo y transformación para cada métrica
        // Esta es una simplificación; en una implementación real, se harían cálculos más complejos
        switch (metric) {
          case 'impliedVolatility':
            value = this.getAverageMetric(assetOpportunities, 'impliedVolatility');
            transformedValue = this.primeTransformations.transformWithPrime(value, 2); // Primo 2
            quantum = this.calculateQuantumFactors(value, transformedValue, assetOpportunities);
            break;
          case 'volume24h':
            value = this.getAverageMetric(assetOpportunities, 'volume24h');
            transformedValue = this.primeTransformations.transformWithPrime(value, 3); // Primo 3
            quantum = this.calculateQuantumFactors(value, transformedValue, assetOpportunities);
            break;
          case 'openInterest':
            value = this.getAverageMetric(assetOpportunities, 'openInterest');
            transformedValue = this.primeTransformations.transformWithPrime(value, 5); // Primo 5
            quantum = this.calculateQuantumFactors(value, transformedValue, assetOpportunities);
            break;
          case 'putCallRatio':
            // TODO: Calcular Put/Call Ratio (necesita agrupar calls y puts y contar OI/Vol)
            value = this.calculatePutCallRatio(assetOpportunities);
            transformedValue = this.primeTransformations.transformWithPrime(value, 7); // Primo 7
            quantum = this.calculateQuantumFactors(value, transformedValue, assetOpportunities);
            break;
          case 'delta':
            value = this.getAverageAbsoluteMetric(assetOpportunities, 'delta'); // Delta Flow
            transformedValue = this.primeTransformations.transformWithPrime(value, 11); // Primo 11
            quantum = this.calculateQuantumFactors(value, transformedValue, assetOpportunities);
            break;
          case 'gamma':
            value = this.getAverageMetric(assetOpportunities, 'gamma'); // Gamma Exposure
            transformedValue = this.primeTransformations.transformWithPrime(value, 13); // Primo 13
            quantum = this.calculateQuantumFactors(value, transformedValue, assetOpportunities);
            break;
          case 'theta':
            value = this.getAverageAbsoluteMetric(assetOpportunities, 'theta'); // Theta Decay
            transformedValue = this.primeTransformations.transformWithPrime(value, 17); // Primo 17
            quantum = this.calculateQuantumFactors(value, transformedValue, assetOpportunities);
            break;
          case 'vega':
            value = this.getAverageMetric(assetOpportunities, 'vega'); // Vega Risk
            transformedValue = this.primeTransformations.transformWithPrime(value, 19); // Primo 19
            quantum = this.calculateQuantumFactors(value, transformedValue, assetOpportunities);
            break;
        }

        row.push({
          asset: asset,
          metric: metric,
          value: value,
          transformedValue: transformedValue,
          quantum: quantum
        });
      });
      cells.push(row);
    });

    return {
      rows: this.ASSETS,
      cols: this.METRICS,
      cells: cells
    };
  }

  // Transpone la matriz 6x8 a 8x6
  public transposeMatrix(matrix: Matrix6x8): Matrix8x6 {
    const transposedCells: Matrix8x6Cell[][] = [];
    matrix.cols.forEach((_col: string, colIndex: number) => {
      const newRow: Matrix8x6Cell[] = [];
      matrix.rows.forEach((_row: string, rowIndex: number) => {
        const originalCell = matrix.cells[rowIndex][colIndex];
        newRow.push({
          asset: originalCell.asset,
          metric: originalCell.metric,
          value: originalCell.value,
          transformedValue: originalCell.transformedValue,
          quantum: originalCell.quantum
        });
      });
      transposedCells.push(newRow);
    });

    return {
      rows: matrix.cols,
      cols: matrix.rows,
      cells: transposedCells
    };
  }

  private getAverageMetric(opportunities: NakedOpportunity[], metric: keyof NakedOpportunity): number {
    if (opportunities.length === 0) return 0;
    const sum = opportunities.reduce((acc, opp) => acc + (typeof opp[metric] === 'number' ? (opp[metric] as number) : 0), 0);
    return sum / opportunities.length;
  }

  private getAverageAbsoluteMetric(opportunities: NakedOpportunity[], metric: keyof NakedOpportunity): number {
    if (opportunities.length === 0) return 0;
    const sum = opportunities.reduce((acc, opp) => acc + (typeof opp[metric] === 'number' ? Math.abs(opp[metric] as number) : 0), 0);
    return sum / opportunities.length;
  }

  private calculatePutCallRatio(opportunities: NakedOpportunity[]): number {
    const totalCallsOI = opportunities.filter(opp => opp.type === 'NAKED_CALL').reduce((sum, opp) => sum + opp.openInterest, 0);
    const totalPutsOI = opportunities.filter(opp => opp.type === 'NAKED_PUT').reduce((sum, opp) => sum + opp.openInterest, 0);
    return totalCallsOI > 0 ? totalPutsOI / totalCallsOI : 0; // Evitar división por cero
  }

  private calculateQuantumFactors(value: number, transformedValue: number, opportunities: NakedOpportunity[]): Matrix6x8Cell['quantum'] {
    if (opportunities.length === 0) {
      return { coherence: 0, entanglement: 0, momentum: 0, density: 0, temperature: 0, frequency: 0, amplitude: 0, phase: 0 };
    }

    // Calcular factores cuánticos basados en datos reales
    const avgLiquidityScore = opportunities.reduce((sum, opp) => sum + (opp.liquidityScore || 0), 0) / opportunities.length;
    const avgRiskReward = opportunities.reduce((sum, opp) => sum + (opp.riskRewardRatio || 0), 0) / opportunities.length;
    const avgProbability = opportunities.reduce((sum, opp) => sum + (opp.probabilityOfProfit || 0), 0) / opportunities.length;
    const avgExpectedReturn = opportunities.reduce((sum, opp) => sum + (opp.expectedReturn || 0), 0) / opportunities.length;
    const avgRiskLevel = opportunities.reduce((sum, opp) => sum + (opp.riskLevel || 0), 0) / opportunities.length;
    const avgTimeToProfit = opportunities.reduce((sum, opp) => sum + (opp.timeToMaxProfit || 0), 0) / opportunities.length;

    // Coherencia: basada en la consistencia de las métricas
    const coherence = Math.min(1, avgLiquidityScore * avgProbability);
    
    // Entanglement: correlación entre valor original y transformado
    const entanglement = Math.min(1, Math.abs(transformedValue - value) / (Math.max(value, 1)));
    
    // Momentum: basado en el ratio riesgo/recompensa
    const momentum = Math.min(1, avgRiskReward / 3);
    
    // Density: concentración de oportunidades
    const density = Math.min(1, opportunities.length / 10);
    
    // Temperature: nivel de riesgo promedio (invertido - menos riesgo = más "frío")
    const temperature = Math.max(0, 1 - avgRiskLevel);
    
    // Frequency: basada en el retorno esperado
    const frequency = Math.min(1000, avgExpectedReturn);
    
    // Amplitude: magnitud del valor transformado
    const amplitude = Math.min(1, Math.abs(transformedValue) / 100);
    
    // Phase: tiempo hasta máximo beneficio (normalizado)
    const phase = Math.min(360, avgTimeToProfit * 12); // Convertir días a grados

    return { coherence, entanglement, momentum, density, temperature, frequency, amplitude, phase };
  }

  // Extiende Matrix6x8 a Matrix6x9 agregando columna SentimientoAkashico
  private async extendToMatrix6x9(
    matrix6x8: Matrix6x8,
    opportunities: NakedOpportunity[],
    memoriaTemporal: MemoriaTemporal,
    analizadorFrecuencias: AnalizadorFrecuencias
  ): Promise<Matrix6x9> {
    const frequencyData: FrequencyData = await analizadorFrecuencias.analyzeAll(opportunities);
    
    // Crear nueva matriz con columna adicional
    const cells: Matrix6x9Cell[][] = [];
    
    matrix6x8.cells.forEach((row, assetIndex) => {
      const asset = this.ASSETS[assetIndex];
      const assetOpportunities = opportunities.filter(opp => opp.symbol === asset);
      
      // Calcular SentimientoAkashico usando componentes existentes
      const accuracy = memoriaTemporal.getAccuracyForSymbol(asset);
      const resonancePatterns = frequencyData.resonance.patterns.filter(p => p.symbol === asset);
      const sentimientoAkashico = this.calculateSentimientoAkashico(accuracy, resonancePatterns, frequencyData);
      
      // Copiar fila existente y agregar nueva celda
      const newRow: Matrix6x9Cell[] = [...row];
      newRow.push({
        asset: asset,
        metric: 'sentimientoAkashico',
        value: sentimientoAkashico,
        transformedValue: this.primeTransformations.transformWithPrime(sentimientoAkashico, 23), // Primo 23
        quantum: this.calculateQuantumFactors(sentimientoAkashico, sentimientoAkashico * 23, assetOpportunities)
      });
      
      cells.push(newRow);
    });

    return {
      rows: matrix6x8.rows,
      cols: [
        'impliedVolatility',
        'volume24h',
        'openInterest',
        'putCallRatio',
        'delta',
        'gamma',
        'theta',
        'vega',
        'sentimientoAkashico'
      ],
      cells: cells
    };
  }

  // Calcula SentimientoAkashico combinando componentes existentes
  private calculateSentimientoAkashico(
    accuracy: number,
    patterns: ResonancePattern[],
    frequencyData: FrequencyData
  ): number {
    // Combinar precisión histórica (MemoriaTemporal)
    const memoryWeight = accuracy;
    
    // Combinar patrones de resonancia (AnalizadorFrecuencias)
    const resonanceStrength = patterns.length > 0
      ? patterns.reduce((sum, p) => sum + p.strength, 0) / patterns.length
      : 0;
    
    // Combinar coherencia global (AnalizadorFrecuencias)
    const coherenceBoost = frequencyData.coherence;
    
    // Combinar fuerza de anomalías (AnalizadorFrecuencias)
    const anomalyFactor = 1 - Math.min(0.5, frequencyData.anomalyStrength);
    
    // Fórmula ponderada del SentimientoAkashico
    const sentimiento = (
      memoryWeight * 0.3 +           // 30% precisión histórica
      resonanceStrength * 0.25 +     // 25% patrones de resonancia
      coherenceBoost * 0.25 +        // 25% coherencia global
      anomalyFactor * 0.2            // 20% factor de anomalías (invertido)
    );
    
    // Normalizar entre 0 y 1
    return Math.min(1.0, Math.max(0.0, sentimiento));
  }
}

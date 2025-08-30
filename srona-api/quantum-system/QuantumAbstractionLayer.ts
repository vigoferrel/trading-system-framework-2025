import { QuantumEngine } from './core/QuantumEngine';
import { QuantumFactors, SystemState } from './types/quantum-types';

/**
 * Capa de Abstracción Cuántica - Interfaz entre el sistema clásico y cuántico
 */
export class QuantumAbstractionLayer {
  private quantumEngine: QuantumEngine;
  private quantumState: Map<string, QuantumFactors> = new Map();
  private systemState: SystemState;

  constructor(quantumEngine: QuantumEngine, initialSystemState: SystemState) {
    this.quantumEngine = quantumEngine;
    this.systemState = initialSystemState;
    this.initializeQuantumStates();
  }

  /**
   * Inicializa los estados cuánticos para todos los activos
   */
  private initializeQuantumStates(): void {
    const assets = this.quantumEngine.getAllAssets();
    assets.forEach(asset => {
      this.quantumState.set(asset.symbol, asset.quantum);
    });
  }

  /**
   * Traduce una operación clásica a su equivalente cuántico
   */
  public translateToQuantumOperation(operation: string, assetSymbol: string): QuantumFactors {
    const quantumState = this.quantumState.get(assetSymbol);
    if (!quantumState) {
      throw new Error(`Estado cuántico no encontrado para ${assetSymbol}`);
    }

    switch (operation) {
      case 'BUY':
        return this.applyBuyOperation(quantumState);
      case 'SELL':
        return this.applySellOperation(quantumState);
      case 'HOLD':
        return this.applyHoldOperation(quantumState);
      default:
        throw new Error(`Operación no soportada: ${operation}`);
    }
  }

  /**
   * Aplica operación de compra al estado cuántico
   */
  private applyBuyOperation(state: QuantumFactors): QuantumFactors {
    return {
      ...state,
      amplitude: Math.min(state.amplitude * 1.2, 2),
      frequency: Math.max(state.frequency * 0.9, 500),
      entanglement: Math.min(state.entanglement + 0.1, 1)
    };
  }

  /**
   * Aplica operación de venta al estado cuántico
   */
  private applySellOperation(state: QuantumFactors): QuantumFactors {
    return {
      ...state,
      amplitude: Math.max(state.amplitude * 0.8, 0.5),
      frequency: Math.min(state.frequency * 1.1, 2000),
      entanglement: Math.max(state.entanglement - 0.1, 0)
    };
  }

  /**
   * Aplica operación de hold al estado cuántico
   */
  private applyHoldOperation(state: QuantumFactors): QuantumFactors {
    return {
      ...state,
      coherence: Math.min(state.coherence + 0.05, 1),
      density: Math.min(state.density + 0.05, 1)
    };
  }

  /**
   * Obtiene el estado cuántico actual para un activo
   */
  public getQuantumState(assetSymbol: string): QuantumFactors {
    const state = this.quantumState.get(assetSymbol);
    if (!state) {
      throw new Error(`Estado cuántico no encontrado para ${assetSymbol}`);
    }
    return state;
  }

  /**
   * Actualiza el estado cuántico para un activo
   */
  public updateQuantumState(assetSymbol: string, newState: QuantumFactors): void {
    this.quantumState.set(assetSymbol, newState);
    this.systemState.quantumMetrics = this.calculateSystemMetrics();
  }

  /**
   * Calcula métricas del sistema basadas en estados cuánticos
   */
  private calculateSystemMetrics(): SystemState['quantumMetrics'] {
    let totalCoherence = 0;
    let totalEntanglement = 0;
    let totalVolatility = 0;
    let count = 0;

    this.quantumState.forEach(state => {
      totalCoherence += state.coherence;
      totalEntanglement += state.entanglement;
      totalVolatility += state.volatilidad;
      count++;
    });

    return {
      coherenceIndex: totalCoherence / count,
      entanglementScore: totalEntanglement / count,
      quantumVolatility: totalVolatility / count
    };
  }
}

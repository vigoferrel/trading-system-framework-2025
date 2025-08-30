import { NakedOpportunity, EdgeSuggestion } from '../types/srona-core-types';
import { AnalizadorFrecuencias } from './AnalizadorFrecuencias';
import { MotorIntertemporal } from './MotorIntertemporal';
import { FrequencyData } from '../types/frequency-types';
import { TemporalData } from '../types/temporal-types';

export class CopilotConEdge {
  private analizadorFrecuencias: AnalizadorFrecuencias;
  private motorIntertemporal: MotorIntertemporal;

  constructor() {
    this.analizadorFrecuencias = new AnalizadorFrecuencias();
    this.motorIntertemporal = new MotorIntertemporal();
  }

  public async generateAdvancedSuggestion(opportunities: NakedOpportunity[]): Promise<EdgeSuggestion> {
    if (opportunities.length === 0) {
      // Devolver una sugerencia por defecto o lanzar un error si no hay oportunidades
      return {
        id: `no_suggestion_${Date.now()}`,
        symbol: 'N/A',
        action: 'NO HAY OPORTUNIDADES VALIDAS',
        confidence: 0,
        timing: 'ESPERAR',
        reasoning: 'No se encontraron oportunidades válidas para analizar.',
        riskManagement: 'Mantener la cautela.',
        edgeFactors: { frequencyEdge: 0, temporalEdge: 0, combinedEdge: 0 },
      };
    }
    const opportunity = opportunities[0]; // Procesa solo la primera oportunidad por ahora
    console.log('[CopilotConEdge] Generando sugerencia avanzada con edge para:', opportunity.symbol);

    const frequencyAnalysis = await this.analizadorFrecuencias.analyzeAll([opportunity]);
    const temporalAnalysis = await this.motorIntertemporal.analyzeAll([opportunity]);

    const edgeFactors = this.calculateEdgeFactors(frequencyAnalysis, temporalAnalysis);
    const confidence = this.calculateConfidence(opportunity, edgeFactors);
    const action = this.determineOptimalAction(opportunity);
    const timing = this.determineOptimalTiming(temporalAnalysis);
    const reasoning = this.generateReasoning(opportunity, frequencyAnalysis, temporalAnalysis, edgeFactors); // Pasar edgeFactors
    const riskManagement = this.generateRiskManagementAdvice(opportunity);

    // Simular retraso
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      id: `suggestion_${opportunity.id}_${Date.now()}`,
      symbol: opportunity.symbol,
      action,
      confidence,
      timing,
      reasoning,
      riskManagement,
      edgeFactors,
    };
  }

  private calculateEdgeFactors(frequencyData: FrequencyData, temporalData: TemporalData): {
    frequencyEdge: number;
    temporalEdge: number;
    combinedEdge: number;
  } {
    const frequencyEdge = (frequencyData?.coherence || 0) * 0.8 + (frequencyData?.anomalyStrength || 0) * 0.2;
    const temporalEdge = (temporalData?.globalCoherence || 0) * 0.6 + (temporalData?.predictiveAccuracy || 0) * 0.4;
    const combinedEdge = Math.sqrt(frequencyEdge * temporalEdge); // Media geométrica

    return { frequencyEdge, temporalEdge, combinedEdge };
  }

  private calculateConfidence(opportunity: NakedOpportunity, edgeFactors: { frequencyEdge: number; temporalEdge: number; combinedEdge: number }): number {
    // La confianza se basa en el score final de la oportunidad y la fuerza del edge
    const baseConfidence = opportunity.scores?.final || 0;
    const edgeBoost = edgeFactors.combinedEdge * 0.3; // El edge aumenta la confianza hasta un 30%
    return Math.min(1, baseConfidence + edgeBoost);
  }

  private determineOptimalAction(opportunity: NakedOpportunity): string {
    if ((opportunity.scores?.final || 0) > 0.8 && opportunity.probabilityOfProfit > 0.75) {
      return 'VENDER CALL/PUT NAKED AHORA';
    } else if ((opportunity.scores?.final || 0) > 0.65) {
      return 'CONSIDERAR VENTA DE NAKED OPTION';
    }
    return 'OBSERVAR POR POSIBLES CAMBIOS';
  }

  private determineOptimalTiming(temporalData: TemporalData): string {
    if (temporalData.cyclicalAnalysis.currentPhase === 'expansion' && temporalData.cyclicalAnalysis.nextTransition === 'peak') {
      return 'ÓPTIMO: ANTES DEL PICO';
    } else if (temporalData.predictiveAccuracy > 0.7) {
      // Usar la primera predicción si existe y tiene un optimalExitWindow
      const prediction = temporalData.predictions.find(p => p.optimalExitWindow); 
      return prediction ? `ÓPTIMO: ${prediction.optimalExitWindow}` : 'VER VENTANA EN PANEL TEMPORAL';
    }
    return 'MONITOREAR FASES TEMPORALES';
  }

  private generateReasoning(opportunity: NakedOpportunity, freqData: FrequencyData, tempData: TemporalData, edgeFactors: { frequencyEdge: number; temporalEdge: number; combinedEdge: number }): string {
    let reason = `Oportunidad ${opportunity.symbol} (${opportunity.type}) con score final de ${(opportunity.scores?.final || 0) * 100}%. `;
    reason += `Edge de Frecuencias: ${(edgeFactors.frequencyEdge * 100).toFixed(1)}%. `; // Usar edgeFactors directamente
    reason += `Edge Temporal: ${(edgeFactors.temporalEdge * 100).toFixed(1)}%. `; // Usar edgeFactors directamente
    reason += `Alta probabilidad de ganancia: ${(opportunity.probabilityOfProfit * 100).toFixed(1)}%. `;
    
    if (freqData.anomalies.length > 0) {
      reason += `Anomalías frecuenciales detectadas: ${freqData.anomalies.map(a => a.description).join(', ')}. `;
    }
    if (tempData.cyclicalAnalysis?.currentPhase) { // Acceso seguro
      reason += `Estamos en fase ${tempData.cyclicalAnalysis.currentPhase} del ciclo.`;
    }

    return reason;
  }

  private generateRiskManagementAdvice(opportunity: NakedOpportunity): string {
    let advice = `Riesgo de la oportunidad: ${(opportunity.riskLevel || 0) * 100}%. `;
    if ((opportunity.riskLevel || 0) > 0.5) {
      advice += 'Considerar un tamaño de posición más pequeño. Establecer un stop-loss estricto. ';
    } else {
      advice += 'Riesgo moderado, mantener gestión de riesgo estándar. ';
    }
    advice += `Máxima pérdida potencial: ${opportunity.maxLoss?.toFixed(2) || 'N/A'}. `; // Usar encadenamiento opcional
    return advice;
  }
}

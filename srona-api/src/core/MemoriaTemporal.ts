import { NakedOpportunity } from "../types/srona-core-types";

// Define una estructura para almacenar los resultados históricos por símbolo.
interface HistoricalOutcome {
  id: string; // ID de la oportunidad específica
  timestamp: number; // Marca de tiempo del registro
  success: boolean; // Si la oportunidad fue exitosa
  profitPercentage?: number; // Porcentaje de ganancia/pérdida
  ivAtExecution?: number; // IV en el momento de la ejecución
  daysToExpiryAtExecution?: number; // Día a vencimiento en el momento de la ejecución
  // Podríamos añadir más métricas relevantes para el aprendizaje.
}

export class MemoriaTemporal {
  // Almacena resultados históricos agrupados por el símbolo del activo (ej. "ETH", "BTC").
  private historicalOutcomesBySymbol: Map<string, HistoricalOutcome[]> = new Map();

  public recordOpportunityOutcome(opportunity: NakedOpportunity, success: boolean, profitPercentage?: number): void {
    const symbol = opportunity.symbol;
    const records = this.historicalOutcomesBySymbol.get(symbol) || [];
    
    records.push({ 
      id: opportunity.id, 
      timestamp: Date.now(), 
      success,
      profitPercentage,
      ivAtExecution: opportunity.impliedVolatility,
      daysToExpiryAtExecution: Math.ceil((opportunity.expiry - Date.now()) / (1000 * 60 * 60 * 24)),
    });
    
    this.historicalOutcomesBySymbol.set(symbol, records);
    console.log(`[MemoriaTemporal] Outcome registrado para ${symbol} (ID: ${opportunity.id}): ${success ? 'Éxito' : 'Fracaso'}`);
  }

  // Calcula la precisión de las oportunidades para un símbolo de activo dado.
  public getAccuracyForSymbol(symbol: string): number {
    const outcomes = this.historicalOutcomesBySymbol.get(symbol);
    if (!outcomes || outcomes.length === 0) {
      return 0; // Si no hay datos, la precisión es 0
    }

    const successfulOutcomes = outcomes.filter(o => o.success).length;
    return successfulOutcomes / outcomes.length;
  }

  // Obtiene el historial completo de outcomes para un símbolo de activo.
  public getHistoricalOutcomesBySymbol(symbol: string): HistoricalOutcome[] {
    return this.historicalOutcomesBySymbol.get(symbol) || [];
  }

  // Analiza patrones históricos de éxito/fracaso para un símbolo.
  public analyzeHistoricalPatterns(symbol: string): { commonSuccessFactors: string[]; commonFailureFactors: string[] } {
    const outcomes = this.historicalOutcomesBySymbol.get(symbol);
    if (!outcomes || outcomes.length === 0) {
      return { commonSuccessFactors: [], commonFailureFactors: [] };
    }

    const successfulOutcomes = outcomes.filter(o => o.success);
    const failedOutcomes = outcomes.filter(o => !o.success);

    // Aquí iría una lógica más compleja para identificar factores comunes.
    // Una implementación real usaría algoritmos de machine learning sobre los datos
    // de cada HistoricalOutcome. Por ahora, es pseudo-lógica.
    const commonSuccessFactors = successfulOutcomes.length > 5 ? ['high_iv_pre_decay', 'mid_term_expiry'] : [];
    const commonFailureFactors = failedOutcomes.length > 5 ? ['low_liquidity', 'unexpected_spot_move'] : [];

    return { commonSuccessFactors, commonFailureFactors };
  }

  // Podríamos añadir métodos para olvidar datos antiguos, gestionar el tamaño de la memoria, etc.
}

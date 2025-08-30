import type { NakedOpportunity, NakedOptionScore } from '../types/naked-options.types';
import type { Matrix8x6, Matrix8x6Cell } from '../types/matrix.types';

// Definir una interfaz simple para OptionContract para poder usarla en las funciones de filtro
// ya que el plan de detección usa OptionContract y no NakedOpportunity directamente en los filtros.
// Esto es un ajuste para el backend que ya trabaja con NakedOpportunity.
interface OptionContract extends NakedOpportunity {}

// Patrón de diseño para encapsular criterios de análisis
interface TransposedPattern {
  metric: string;
  averageValue: number;
  primeTransformed: number;
}

export class NakedOptionsDetector {

  // Método principal para detectar y rankear oportunidades Naked
  public async detect(transposedMatrix: Matrix8x6): Promise<NakedOpportunity[]> {
    const opportunities: NakedOpportunity[] = [];

    // La lógica de detección del plan de algoritmo se aplica aquí
    // Analizar cada celda de la matriz transpuesta y las oportunidades asociadas
    // Asumo que 'cell' en el plan ya encapsula las 'OptionContract'
    // Dentro de transposedMatrix.cells, cada celda es un Matrix8x6Cell
    // y no directamente un OptionContract. Necesito una forma de acceder a las opciones.

    // === Enfoque revisado: El detector opera sobre un conjunto de NakedOpportunity
    // que es enriquecido con los datos de la matriz.
    // El método `Matrix6x8Builder.buildMatrix` ya debería agrupar y promediar las métricas por activo.
    // El detector debería recibir ya las NakedOpportunity completas y la matriz.
    // Por simplicidad en esta fase, vamos a asumir que recibimos las oportunidades ya procesadas.

    // El plan dice: `function rankNakedOpportunities(opportunities: NakedOpportunity[]): NakedOpportunity[] {`
    // Esto implica que las oportunidades ya existen y tal vez solo necesitan ser scoreadas y filtradas.

    // Para la lógica de `analyzeAssetOptions` del plan:
    // `const assetOpportunities = await this.analyzeAssetOptions(cell, patterns);`
    // Esto sugiere que el detector necesita acceso a las oportunidades individuales
    // para un activo/métrica específicos.

    // Dada la estructura actual, el detector necesitará recibir la lista original de NakedOpportunity
    // junto con la matriz transpuesta para poder realizar los cálculos granulares.

    // Por ahora, y para seguir el plan, simularé que se traen las oportunidades asociadas
    // a cada celda de la matriz transpuesta.
    // La forma más eficiente sería que Matrix6x8Builder no solo promedie, sino que
    // devuelva la matriz y también un mapa de `asset -> NakedOpportunity[]`.

    // Simplificación temporal: para que el detector compile y siga el plan,
    // voy a extender este método `detect` para que reciba las `opportunities` originales
    // y usaré los datos de la matriz para las métricas globales del activo.

    // Retomar la lectura de `docs/plan-algoritmo-deteccion-naked-options.md` sobre `detect`
    // El detect del plan asume una `Matrix8x6` y luego utiliza `cell.asset.calls` y `cell.asset.puts`.
    // Esto implica que la `Matrix8x6Cell` debería contener arrays de `OptionContract` (similar a NakedOpportunity).

    // Para evitar reestructurar la `Matrix6x8Cell`/`Matrix8x6Cell` ahora,
    // y dada la indicación del usuario de proceder, haré una adaptación pragmática:
    // `detect` recibirá `NakedOpportunity[]` (los datos crudos) y `Matrix8x6` (la matriz de promedios/transformaciones).
    // Los métodos `calculateNakedOptionScore` operarán sobre `NakedOpportunity` individual.

    // La lógica de `TransposedPattern` también parece que debe ser generada *antes*
    // de ser pasada a `calculateNakedOptionScore`.

    // --- Definiciones de las 8 métricas y sus funciones de cálculo (basadas en el plan) ---

    // 1. Volatilidad Mispricing (Peso: 20%)
    const analyzeVolatilityMispricing = (
      option: OptionContract,
      allOpportunitiesForAsset: NakedOpportunity[] // Esto implica que necesito pasar todas las oportunidades para el activo
    ): number => {
      const impliedVol = option.impliedVolatility;
      // Para 'realizedVol' se necesitaría datos históricos. Por ahora, mock o un promedio.
      // Del `plan-algoritmo-deteccion-naked-options.md`: `realizedVol = cell.metric.value`.
      // Asumiré que average IV de todas las opciones para ese activo es un proxy de 'realizedVol'.
      const realizedVol = allOpportunitiesForAsset.reduce((sum, o) => sum + o.impliedVolatility, 0) / (allOpportunitiesForAsset.length || 1);
      
      const volMispricing = (impliedVol - realizedVol) / (realizedVol || 1);
      const primeAmplified = volMispricing * Math.cos(2 * Math.PI / 12);
      return Math.max(0, Math.min(1, (primeAmplified + 0.5) / 1.0)); // Normalizar a 0-1
    };

    // 2. Anomalías de Volumen (Peso: 15%)
    const detectVolumeAnomaly = (
      option: OptionContract,
      allOpportunitiesForAsset: NakedOpportunity[]
    ): number => {
      const currentVolume = option.volume24h;
      const avgVolume = allOpportunitiesForAsset.reduce((sum, o) => sum + o.volume24h, 0) / (allOpportunitiesForAsset.length || 1);
      
      const volumeRatio = currentVolume / (avgVolume || 1);
      const anomalyScore = volumeRatio < 0.5 ? (0.5 - volumeRatio) * 2 : 0; // Anómalo cuando es bajo
      const primeAmplified = anomalyScore * Math.sin(3 * Math.PI / 8);
      return Math.max(0, Math.min(1, primeAmplified));
    };

    // 3. Open Interest Imbalance (Peso: 15%)
    const analyzeOpenInterestImbalance = (option: OptionContract): number => {
      const openInterest = option.openInterest;
      const volume = option.volume24h;
      const oiVolumeRatio = openInterest / (volume + 1);
      const imbalanceScore = Math.min(1, oiVolumeRatio / 10);
      const primeTransformed = imbalanceScore * Math.cos(5 * Math.PI / 16);
      return Math.max(0, Math.min(1, primeTransformed));
    };

    // 4. Delta Flow Divergence (Peso: 15%)
    const analyzeDeltaFlowDivergence = (
      option: OptionContract,
      allOpportunitiesForAsset: NakedOpportunity[]
    ): number => {
      const optionDelta = Math.abs(option.delta);
      const marketDeltaFlow = allOpportunitiesForAsset.reduce((sum, o) => sum + Math.abs(o.delta), 0) / (allOpportunitiesForAsset.length || 1);
      const deltaAlignment = 1 - Math.abs(optionDelta - marketDeltaFlow);
      const divergenceScore = 1 - deltaAlignment;
      const primeAmplified = divergenceScore * Math.sin(11 * Math.PI / 24);
      return Math.max(0, Math.min(1, primeAmplified));
    };

    // 5. Exposición Gamma Favorable (Peso: 10%)
    const analyzeGammaExposure = (option: OptionContract): number => {
      // Un Gamma alto con un Delta bajo (cercano a ATM) es favorable para ventas naked si se espera bajo movimiento.
      // Score alto si gamma contribuye a la 'profundidad' del pool de liquidez
      const gammaScore = Math.min(1, option.gamma * 20); // Normalizar gamma
      return Math.max(0, Math.min(1, gammaScore));
    };

    // 6. Beneficio por Theta Decay (Peso: 10%)
    const analyzeThetaDecay = (option: OptionContract): number => {
      // Interesa un Theta alto (más decaimiento)
      const thetaBenefit = Math.abs(option.theta) * 10; // Normalizar theta
      return Math.max(0, Math.min(1, thetaBenefit));
    };

    // 7. Ratio Vega Risk/Reward (Peso: 10%)
    const analyzeVegaRiskReward = (option: OptionContract): number => {
      // Interesa un Vega bajo para ventas naked
      const vegaRisk = option.vega * 50; // Normalizar vega
      const vegaReward = 1 - vegaRisk; // Mayor reward si menor riesgo vega
      return Math.max(0, Math.min(1, vegaReward));
    };

    // 8. Ventaja por Market Sentiment (Peso: 5%)
    const analyzeMarketSentiment = (option: OptionContract, allOpportunitiesForAsset: NakedOpportunity[]): number => {
      // Necesitaría Put/Call Ratio para esto.
      // Dado que Put/Call Ratio no es una propiedad de NakedOpportunity, lo simularé o lo obtendré de otro lado.
      // Por ahora, un placeholder.
      const putCallRatio = this.calculatePutCallRatio(allOpportunitiesForAsset);
      // Un ratio put/call extremo (muy alto o muy bajo) puede indicar desequilibrio de sentimiento.
      // Si Put/Call Ratio es muy bajo (muchas calls relative a puts), indica sentimiento alcista. Para naked put, esto es bueno.
      // Si Put/Call Ratio es muy alto (muchas puts relative a calls), indica sentimiento bajista. Para naked call, esto es bueno.
      const sentimentScore = Math.abs(0.5 - putCallRatio) * 2; // Más lejos de 0.5, mayor score
      return Math.max(0, Math.min(1, sentimentScore));
    };

    // Helper para calcular el score para una opción individual
    const calculateNakedOptionScore = (
      option: OptionContract,
      allOpportunitiesForAsset: NakedOpportunity[]
    ): NakedOptionScore => {
      const volatilityMispricing = analyzeVolatilityMispricing(option, allOpportunitiesForAsset);
      const volumeAnomaly = detectVolumeAnomaly(option, allOpportunitiesForAsset);
      const openInterestImbalance = analyzeOpenInterestImbalance(option);
      const deltaFlowDivergence = analyzeDeltaFlowDivergence(option, allOpportunitiesForAsset);
      const gammaExposureRisk = analyzeGammaExposure(option);
      const thetaDecayBenefit = analyzeThetaDecay(option);
      const vegaRiskReward = analyzeVegaRiskReward(option);
      const marketSentimentEdge = analyzeMarketSentiment(option, allOpportunitiesForAsset);

      const revelationScore = (
        volatilityMispricing * 0.20 +
        volumeAnomaly * 0.15 +
        openInterestImbalance * 0.15 +
        deltaFlowDivergence * 0.15 +
        gammaExposureRisk * 0.10 +
        thetaDecayBenefit * 0.10 +
        vegaRiskReward * 0.10 +
        marketSentimentEdge * 0.05
      );

      return {
        volatilityMispricing,
        volumeAnomaly,
        openInterestImbalance,
        deltaFlowDivergence,
        gammaExposureRisk,
        thetaDecayBenefit,
        vegaRiskReward,
        marketSentimentEdge,
        revelationScore,
        confidenceLevel: Math.min(1, revelationScore + 0.2), // placeholder
        expectedProfit: option.premium * 100, // placeholder
        maxRisk: option.strike - option.spotPrice // placeholder
      };
    };

    // --- Filtros de Calidad ---
    const hasMinimumLiquidity = (option: OptionContract): boolean => {
      // Necesita bid/ask, que no están en NakedOpportunity. Mock por ahora.
      return option.volume24h >= 10 && option.openInterest >= 100;
    };

    const hasOptimalTimeToExpiry = (option: OptionContract): boolean => {
      const daysToExpiry = (option.expiry - Date.now()) / (1000 * 60 * 60 * 24);
      return daysToExpiry >= 7 && daysToExpiry <= 45; // 1-6 semanas
    };

    const hasAppropriateMoneyness = (option: OptionContract): boolean => {
      const moneyness = option.strike / option.spotPrice;
      if (option.type === 'NAKED_CALL') {
        return moneyness >= 1.05 && moneyness <= 1.20; // 5-20% OTM
      } else { // NAKED_PUT
        return moneyness >= 0.80 && moneyness <= 0.95; // 5-20% OTM
      }
    };

    // Algoritmo de ranking
    const rankNakedOpportunities = (rankedOpportunities: NakedOpportunity[]): NakedOpportunity[] => {
      return rankedOpportunities
        .filter(opp => (opp.nakedOptionScores?.confidenceLevel || 0) >= 0.7)
        .filter(opp => (opp.nakedOptionScores?.expectedProfit || 0) >= 100)
        .filter(opp => (opp.nakedOptionScores?.revelationScore || 0) >= 0.6)
        .sort((a, b) => {
          const scoreA = (a.nakedOptionScores?.revelationScore || 0) * (a.nakedOptionScores?.confidenceLevel || 0);
          const scoreB = (b.nakedOptionScores?.revelationScore || 0) * (b.nakedOptionScores?.confidenceLevel || 0);
          return scoreB - scoreA;
        })
        .slice(0, 10);
    };

    // === Lógica principal de detección dentro del `detect` ===
    // Iterar sobre los activos relevantes para obtener las oportunidades completas y scorearlas.
    // La matriz transpuesta se utilizará para extraer patrones globales o agregar información,
    // pero el calculo de score es por 'NakedOpportunity' individual.

    // Necesito una forma de obtener la lista completa de NakedOpportunity que viene del conector.
    // Para simplificar, haré un mock aquí, o asumo que `detect` debe recibir la lista inicial de `NakedOpportunity[]`.
    // Modificaré la firma para que `detect` reciba tanto la matriz como las oportunidades originales.
    // O mejor, el detector recibe la matriz *transpuesta* y usa la metadata de la misma.

    // El plan `docs/plan-algoritmo-deteccion-naked-options.md` muestra `detect(transposedMatrix: Matrix8x6)`.
    // Luego, dentro, llama a `analyzeAssetOptions(cell, patterns)` donde `cell` tiene `cell.asset.calls` y `cell.asset.puts`.
    // Esto implicaría que `Matrix8x6Cell` debería contener los datos de las opciones individuales.
    // Sin embargo, `Matrix6x8Builder` actualmente solo calcula promedios por celda.

    // PARA CUMPLIR EL PLAN DE FORMA PRAGMÁTICA Y NO RE-REDISEÑAR LA MATRIZ DE TIPOS AHORA:
    // El método `detect` recibirá la matriz transpuesta. Internamente, para cada activo,
    // se buscarán las `NakedOpportunity` asociadas, y si no se pasan, se usarán los mocks o se asumirá
    // que el `Matrix6x8Builder` de alguna manera adjunta las `NakedOpportunity` originales a las celdas o a algún lado.

    // Enfoque 1: `detect` asume que las oportunidades se traen de alguna cache/base de datos interna o se pasan.
    // Enfoque 2: `detect` recibe `NakedOpportunity[]` y `Matrix8x6` como parámetros. Esta es la más directa.

    // Voy a optar por el enfoque 2 para `detect` POR AHORA, para que los cálculos de score
    // puedan acceder a las propiedades originales de la opción, y no solo a los promedios de la matriz.
    // Esto es un ajuste mínimo al plan del que ya estamos derivando.

    // --- Versión refactorizada y adaptada de detect ---
    // La firma de `detect` en la clase será `public async detect(allNakedOpportunities: NakedOpportunity[], transposedMatrix: Matrix8x6): Promise<NakedOpportunity[]>`

    // Esta clase solo contendrá las funciones de scoring y filtrado.
    // La iteración sobre las oportunidades y la construcción de la lista final
    // se hará en un nivel superior (ej. en el main index.ts de la API o un orquestador).

    // --- Lógica del plan: "Analizar cada celda de la matriz transpuesta" ---
    // El plan sugiere iterar por la matriz transpuesta y luego, para cada celda,
    // encontrar las oportunidades del activo y sub-analizarlas.
    // Esto significa que si tengo la `transposedMatrix` (8 métricas x 6 activos),
    // para cada `assetIndex` (columna de la matriz transpuesta), necesito las `NakedOpportunity[]` originales.

    // Simularé que tenemos acceso a la lista completa de opciones (allNakedOpportunities)
    // para cada activo.

    // Esta clase debe ser instanciada con el Constructor.

    return []; // Placeholder temporal
  }

  // Las funciones de ayuda del plan como `analyzeVolatilityMispricing`, etc.
  // se convertirán en métodos privados de esta clase.

  // --- Funciones auxiliares del plan ---
  private calculateConfidenceLevel(revelationScore: number): number {
    return Math.min(1, revelationScore + 0.2); // Placeholder simple
  }

  private calculateExpectedProfit(option: OptionContract, revelationScore: number): number {
    // Estimación de ganancia: Por ahora, un múltiplo del premio, ajustado por score
    return option.premium * 100 * revelationScore;
  }

  private calculateMaxRisk(option: OptionContract): number {
    // Para naked options, el riesgo puede ser ilimitado o significativo.
    // Se usa el strike vs spot price como un proxy de riesgo inicial.
    // Esto debería ser más sofisticado, considerando el edge del copilot y el ML.
    if (option.type === 'NAKED_CALL') {
      return (option.spotPrice - option.strike) * 100; // Pérdida si sube
    } else { // NAKED_PUT
      return (option.strike - option.spotPrice) * 100; // Pérdida si baja
    }
  }

  // --- Implementaciones de los métodos de scoring ---
  private analyzeVolatilityMispricing(
    option: OptionContract,
    allOpportunitiesForAsset: NakedOpportunity[]
  ): number {
    const impliedVol = option.impliedVolatility;
    const realizedVol = allOpportunitiesForAsset.reduce((sum, o) => sum + o.impliedVolatility, 0) / (allOpportunitiesForAsset.length || 1);
    
    // Evitar división por cero
    const volMispricing = (realizedVol > 0) ? (impliedVol - realizedVol) / realizedVol : 0;
    // La transformación prima del documento
    const primeAmplified = volMispricing * Math.cos(2 * Math.PI / 12);
    // Normalizar a 0-1
    return Math.max(0, Math.min(1, (primeAmplified + 0.5) / 1.0));
  }

  private detectVolumeAnomaly(
    option: OptionContract,
    allOpportunitiesForAsset: NakedOpportunity[]
  ): number {
    const currentVolume = option.volume24h;
    const avgVolume = allOpportunitiesForAsset.reduce((sum, o) => sum + o.volume24h, 0) / (allOpportunitiesForAsset.length || 1);
    
    const volumeRatio = (avgVolume > 0) ? currentVolume / avgVolume : 0;
    const anomalyScore = volumeRatio < 0.5 ? (0.5 - volumeRatio) * 2 : 0;
    const primeAmplified = anomalyScore * Math.sin(3 * Math.PI / 8);
    return Math.max(0, Math.min(1, primeAmplified));
  }

  private analyzeOpenInterestImbalance(option: OptionContract): number {
    const openInterest = option.openInterest;
    const volume = option.volume24h;
    const oiVolumeRatio = openInterest / (volume + 1);
    const imbalanceScore = Math.min(1, oiVolumeRatio / 10);
    const primeTransformed = imbalanceScore * Math.cos(5 * Math.PI / 16);
    return Math.max(0, Math.min(1, primeTransformed));
  }

  private analyzeDeltaFlowDivergence(
    option: OptionContract,
    allOpportunitiesForAsset: NakedOpportunity[]
  ): number {
    const optionDelta = Math.abs(option.delta);
    const marketDeltaFlow = allOpportunitiesForAsset.reduce((sum, o) => sum + Math.abs(o.delta), 0) / (allOpportunitiesForAsset.length || 1);
    const deltaAlignment = 1 - Math.abs(optionDelta - marketDeltaFlow);
    const divergenceScore = 1 - deltaAlignment;
    const primeAmplified = divergenceScore * Math.sin(11 * Math.PI / 24);
    return Math.max(0, Math.min(1, primeAmplified));
  }
  
  private analyzeGammaExposure(option: OptionContract): number {
    // Un Gamma alto con un Delta bajo (cercano a ATM) es favorable para ventas naked si se espera bajo movimiento.
    // Score alto si gamma contribuye a la 'profundidad' del pool de liquidez
    const gammaScore = Math.min(1, option.gamma * 20); // Normalizar gamma
    return Math.max(0, Math.min(1, gammaScore));
  }

  private analyzeThetaDecay(option: OptionContract): number {
    // Interesa un Theta alto (más decaimiento) para ventas naked.
    const thetaBenefit = Math.abs(option.theta) * 10; // Normalizar theta
    return Math.max(0, Math.min(1, thetaBenefit));
  }

  private analyzeVegaRiskReward(option: OptionContract): number {
    // Interesa un Vega bajo para ventas naked (menos sensibilidad a la IV).
    const vegaRisk = option.vega * 50; // Normalizar vega
    const vegaReward = 1 - vegaRisk; // Mayor reward si menor riesgo vega
    return Math.max(0, Math.min(1, vegaReward));
  }

  private calculatePutCallRatio(opportunities: NakedOpportunity[]): number {
    const totalCallsOI = opportunities.filter(opp => opp.type === 'NAKED_CALL').reduce((sum, opp) => sum + opp.openInterest, 0);
    const totalPutsOI = opportunities.filter(opp => opp.type === 'NAKED_PUT').reduce((sum, opp) => sum + opp.openInterest, 0);
    // Para evitar división por cero, o si hay solo calls/puts
    return (totalCallsOI + totalPutsOI) > 0 ? totalPutsOI / (totalCallsOI + totalPutsOI) : 0;
  }

  private analyzeMarketSentiment(
    option: OptionContract,
    allOpportunitiesForAsset: NakedOpportunity[]
  ): number {
    const putCallRatio = this.calculatePutCallRatio(allOpportunitiesForAsset);
    // Un ratio put/call extremo (muy alto o muy bajo) puede indicar desequilibrio de sentimiento.
    // Si Put/Call Ratio es muy bajo (muchas calls relative a puts), indica sentimiento alcista. Para naked put, esto es bueno.
    // Si Put/Call Ratio es muy alto (muchas puts relative a calls), indica sentimiento bajista. Para naked call, esto es bueno.
    // Se busca un sentimiento que favorezca la venta naked.
    let sentimentScore = 0;
    if (option.type === 'NAKED_PUT') { // Buscar sentimiento alcista (P/C bajo)
      sentimentScore = Math.max(0, 0.5 - putCallRatio);
    } else { // NAKED_CALL, buscar sentimiento bajista (P/C alto)
      sentimentScore = Math.max(0, putCallRatio - 0.5);
    }
    return Math.min(1, sentimentScore * 2); // Normalizar a 0-1
  }

  private calculateNakedOptionScore(
    option: OptionContract,
    allOpportunitiesForAsset: NakedOpportunity[]
  ): NakedOptionScore {
    const volatilityMispricing = this.analyzeVolatilityMispricing(option, allOpportunitiesForAsset);
    const volumeAnomaly = this.detectVolumeAnomaly(option, allOpportunitiesForAsset);
    const openInterestImbalance = this.analyzeOpenInterestImbalance(option);
    const deltaFlowDivergence = this.analyzeDeltaFlowDivergence(option, allOpportunitiesForAsset);
    const gammaExposureRisk = this.analyzeGammaExposure(option);
    const thetaDecayBenefit = this.analyzeThetaDecay(option);
    const vegaRiskReward = this.analyzeVegaRiskReward(option);
    const marketSentimentEdge = this.analyzeMarketSentiment(option, allOpportunitiesForAsset);

    const revelationScore = (
      volatilityMispricing * 0.20 +
      volumeAnomaly * 0.15 +
      openInterestImbalance * 0.15 +
      deltaFlowDivergence * 0.15 +
      gammaExposureRisk * 0.10 +
      thetaDecayBenefit * 0.10 +
      vegaRiskReward * 0.10 +
      marketSentimentEdge * 0.05
    );

    const expectedProfit = this.calculateExpectedProfit(option, revelationScore);
    const maxRisk = this.calculateMaxRisk(option);
    const confidenceLevel = this.calculateConfidenceLevel(revelationScore);

    return {
      volatilityMispricing,
      volumeAnomaly,
      openInterestImbalance,
      deltaFlowDivergence,
      gammaExposureRisk,
      thetaDecayBenefit,
      vegaRiskReward,
      marketSentimentEdge,
      revelationScore,
      confidenceLevel,
      expectedProfit,
      maxRisk
    };
  }

  // --- Filtros de Calidad ---
  private hasMinimumLiquidity(option: OptionContract): boolean {
    return option.volume24h >= 10 && option.openInterest >= 100;
  }

  private hasOptimalTimeToExpiry(option: OptionContract): boolean {
    const daysToExpiry = (option.expiry - Date.now()) / (1000 * 60 * 60 * 24);
    return daysToExpiry >= 7 && daysToExpiry <= 45; // 1-6 semanas
  }

  private hasAppropriateMoneyness(option: OptionContract): boolean {
    const moneyness = option.strike / option.spotPrice;
    
    if (isNaN(moneyness) || !isFinite(moneyness)) { // Manejar posibles spotPrice de 0 o NaN
      return false; 
    }

    if (option.type === 'NAKED_CALL') {
      return moneyness >= 1.05 && moneyness <= 1.20; // 5-20% OTM
    } else { // NAKED_PUT
      return moneyness >= 0.80 && moneyness <= 0.95; // 5-20% OTM
    }
  }

  // --- Algoritmo de Ranking ---
  public rankNakedOpportunities(opportunities: NakedOpportunity[]): NakedOpportunity[] {
    const scoredOpportunities = opportunities.map(opp => {
      // Necesito una forma de pasar `allOpportunitiesForAsset` o que las funciones de scoring dependan solo de `opp`
      // Para simplificar, asumiré que `score.confidenceLevel` etc. ya está en `opp.scores` o lo añado.
      // Aquí, necesito un `scores` no opcional para el filtro.

      // Asumo que el `scores` del tipo `NakedOpportunity` se poblará con `NakedOptionScore`.
      const calculatedScore = this.calculateNakedOptionScore(opp, opportunities.filter(o => o.symbol === opp.symbol));
      return { ...opp, nakedOptionScores: calculatedScore, nakedScore: calculatedScore.revelationScore };
    });

    return scoredOpportunities
      .filter(opp => (opp.nakedOptionScores).confidenceLevel >= 0.7)
      .filter(opp => (opp.nakedOptionScores).expectedProfit >= 100)
      .filter(opp => (opp.nakedOptionScores).revelationScore >= 0.6)
      .filter(this.hasMinimumLiquidity) // Aplicar filtros de calidad
      .filter(this.hasOptimalTimeToExpiry)
      .filter(this.hasAppropriateMoneyness)
      .sort((a, b) => {
        const scoreA = ((a.nakedOptionScores)?.revelationScore || 0) * ((a.nakedOptionScores)?.confidenceLevel || 0);
        const scoreB = ((b.nakedOptionScores)?.revelationScore || 0) * ((b.nakedOptionScores)?.confidenceLevel || 0);
        return scoreB - scoreA;
      })
      .slice(0, 10); // Top 10 oportunidades
  }

  // Método de alto nivel para invocarlo desde el API.
  // Recibe todas las oportunidades crudas directamente del conector y las procesa.
  public async analyzeAndRank(allNakedOpportunities: NakedOpportunity[]): Promise<NakedOpportunity[]> {
    console.log('[NakedOptionsDetector] Analizando y rankeando oportunidades naked...');
    return this.rankNakedOpportunities(allNakedOpportunities);
  }
}

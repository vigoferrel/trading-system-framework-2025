import { NakedOpportunity } from '../types/srona-core-types';
import { AnalizadorFrecuencias } from './AnalizadorFrecuencias';
import { MotorIntertemporal } from './MotorIntertemporal';
import { FrequencyData, ThetaFrequency } from '../types/frequency-types'; 
import { TemporalData } from '../types/temporal-types'; 

export class DetectorConEdge {
  private analizadorFrecuencias: AnalizadorFrecuencias;
  private motorIntertemporal: MotorIntertemporal;

  constructor() {
    this.analizadorFrecuencias = new AnalizadorFrecuencias();
    this.motorIntertemporal = new MotorIntertemporal();
  }

  public async detectOpportunities(opportunities: NakedOpportunity[]): Promise<NakedOpportunity[]> {
    console.log('[DetectorConEdge] Detectando oportunidades con edge...');

    if (opportunities.length === 0) {
      return [];
    }

    const detectedOpportunities: NakedOpportunity[] = [];

    for (const opp of opportunities) { // Usamos 'opp' aquí
      // Asegurarse de que analyzeAll es un método que devuelve FrequencyData
      const frequencyAnalysis: FrequencyData = await this.analizadorFrecuencias.analyzeAll([opp]);
      const temporalAnalysis: TemporalData = await this.motorIntertemporal.analyzeAll([opp]);

      // Asegurarse de que frequencyAnalysis.theta está presente y es del tipo ThetaFrequency
      const thetaAnalysis: ThetaFrequency = frequencyAnalysis.theta as ThetaFrequency; // Se mantiene el casteo por now

      const photonicScore = this.calculatePhotonicScore(opp, thetaAnalysis, frequencyAnalysis); 
      const temporalScore = this.calculateTemporalScore(opp, temporalAnalysis);
      const fundamentalScore = this.calculateFundamentalScore(opp);
      const technicalScore = this.calculateTechnicalScore(opp);
      const riskScore = this.calculateRiskScore(opp);
      const liquidityScore = this.calculateLiquidityScore(opp);
      
      const finalScore = this.calculateWeightedScore({
        photonic: photonicScore,
        temporal: temporalScore,
        fundamental: fundamentalScore,
        technical: technicalScore,
        risk: riskScore,
        liquidity: liquidityScore,
      });

      // Asignar todos los scores a la oportunidad
      opp.nakedScore = this.calculateNakedScore(opp, frequencyAnalysis, temporalAnalysis);
      opp.liquidityScore = liquidityScore; // Ya calculado arriba
      opp.riskRewardRatio = this.calculateRiskRewardRatio(opp, finalScore);
      opp.maxLoss = this.calculateMaxLoss(opp);

      opp.scores = {
        photonic: photonicScore,
        temporal: temporalScore,
        fundamental: fundamentalScore,
        technical: technicalScore,
        risk: riskScore,
        liquidity: liquidityScore,
        akashic: 0, // Placeholder, sería calculado por MemoriaTemporal
        final: finalScore,
      };

      if (finalScore > 0.6) { // Solo oportunidades con score suficientemente alto
        detectedOpportunities.push(opp);
      }
    }

    return detectedOpportunities.sort((a, b) => (b.scores?.final || 0) - (a.scores?.final || 0));
  }

  // Métodos de cálculo para scores
  public calculatePhotonicScore(opportunity: NakedOpportunity, thetaAnalysis: ThetaFrequency, freqData: FrequencyData): number {
    // El score fotónico refleja la claridad de la señal en las frecuencias cuánticas (theta, IV, Delta).
    // Un edge fuerte se asocia a alta coherencia y anomalías favorables.
    const coherenceFactor = freqData.coherence; // (0-1)
    const anomalyImpact = freqData.anomalies.reduce((sum, a) => {
        if (a.type === 'ACCELERATED_THETA_DECAY' && a.severity === 'HIGH') return sum + 0.3; // Favorables para naked
        if (a.type === 'IV_CRUSH_IMMINENT' && a.severity === 'MEDIUM') return sum + 0.2;
        return sum;
    }, 0);

    // Considerar la "pureza" de la señal de frecuencia dominante
    // Acceder a dominantFrequency desde el objeto thetaAnalysis
    const purityFactor = thetaAnalysis.frequencies.some(f => f.value === thetaAnalysis.dominantFrequency) ?
                         (thetaAnalysis.frequencies.find(f => f.value === thetaAnalysis.dominantFrequency)?.amplitude || 0) : 0; // Acceso seguro
    
    return Math.min(1, (coherenceFactor * 0.5) + (anomalyImpact * 0.3) + (purityFactor * 0.2));
  }

  public calculateTemporalScore(opportunity: NakedOpportunity, tempData: TemporalData): number {
    // El score temporal refleja la alineación con los ciclos de mercado y la predictibilidad futura.
    // Un edge fuerte viene de alta coherencia global y patrones intertemporales claros.
    const globalCoherenceFactor = tempData.globalCoherence; // (0-1)
    const predictiveAccuracyFactor = tempData.predictiveAccuracy; // (0-1)

    // Impacto del análisis cíclico: si la oportunidad está en una fase ascendente del ciclo
    const cyclicalAlignment = (tempData.cyclicalAnalysis.currentPhase === 'expansion' || tempData.cyclicalAnalysis.currentPhase === 'trough') ? 0.2 : 0;
    
    // Sincronización de fases con otros activos relevantes (si aplica y está en el mismo subyacente)
    const phaseSyncImpact = tempData.phaseSynchronization.filter(ps => ps.symbol1 === opportunity.symbol || ps.symbol2 === opportunity.symbol).reduce((sum, ps) => sum + ps.level, 0) / (tempData.phaseSynchronization.length || 1);
    
    return Math.min(1, (globalCoherenceFactor * 0.4) + (predictiveAccuracyFactor * 0.3) + cyclicalAlignment + (phaseSyncImpact * 0.1));
  }

  public calculateFundamentalScore(opportunity: NakedOpportunity): number {
    // El score fundamental se basa en métricas intrínsecas de la opción.
    let score = 0;
    // Premium recibido: mayor es mejor para naked options
    score += Math.min(0.3, opportunity.premium * 10); // Max 0.3 para premiums > 0.03

    // Moneyness: preferir Out-of-the-Money (OTM)
    const moneynessRatio = opportunity.strike / opportunity.spotPrice;
    if (opportunity.type === 'NAKED_CALL' && moneynessRatio >= 1.05) score += 0.25; // 5% OTM o más para Calls
    if (opportunity.type === 'NAKED_PUT' && moneynessRatio <= 0.95) score += 0.25; // 5% OTM o más para Puts

    // Días a vencimiento: preferir corto a medio plazo (15-45 días)
    const daysToExpiry = Math.ceil((opportunity.expiry - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysToExpiry >= 15 && daysToExpiry <= 45) score += 0.2;
    else if (daysToExpiry > 45 && daysToExpiry <= 90) score += 0.1;

    // Implied Volatility (IV): preferir un IV alto
    score += Math.min(0.25, opportunity.impliedVolatility / 2); // Max 0.25 para IV >= 0.5

    return Math.min(1, score);
  }

  public calculateTechnicalScore(opportunity: NakedOpportunity): number {
    // El score técnico evalúa la oportunidad basada en el análisis de mercado del subyacente y la liquidez.
    let score = 0;

    // Volumen vs Open Interest: Alto OI con bajo volumen puede indicar interés institucional y menos riesgo de "manipulación"
    const oiVolumeRatio = opportunity.openInterest / Math.max(opportunity.volume24h, 1);
    score += Math.min(0.3, oiVolumeRatio / 100); // Bonifica relaciones OI/Vol altas

    // Bid-Ask Spread: Más estrecho es mejor liquidez
    // No tenemos el spread directo, asumiremos un proxy por el volumen
    const liquidityProxy = opportunity.volume24h / opportunity.openInterest;
    score += Math.min(0.2, (1 - liquidityProxy) * 0.5); // Bonifica baja liquidez de trading (difícil de mover para market makers)

    // Estabilidad del precio del subyacente: un subyacente estable es mejor para naked options vendidas
    // Proxy: Cuanto menos Delta y Gamma tenga la opción, más estable es frente al subyacente.
    score += Math.min(0.25, (1 - Math.abs(opportunity.delta)) * 0.7 + (1 - Math.abs(opportunity.gamma / 0.01)) * 0.3); // Delta y Gamma pequeños son más estables

    // Volatility Skew: un skew plano o ligeramente positivo/negativo puede ser más predecible
    // Asumiremos que un IV alto vs Strike indica skew (no tenemos datos directos de skew)
    score += Math.min(0.25, Math.abs(opportunity.impliedVolatility - (opportunity.spotPrice / opportunity.strike * 0.01)) * 0.5); // Simulación de skew plano

    return Math.min(1, score);
  }

  public calculateRiskScore(opportunity: NakedOpportunity): number {
    // El score de riesgo evalúa la exposición potencial y la "seguridad" de la operación.
    let score = 1; // Empezamos en 1 (riesgo bajo) y restamos por riesgos

    // Riesgo inherente de la naked option (ilimitado en teoría, pero mitigable)
    // El 'riskLevel' de la oportunidad simulada es un buen punto de partida.
    score -= (opportunity.riskLevel || 0) * 0.5; // Resta hasta 0.5 si riskLevel es 1

    // Distancia al dinero (OTM suficiente): Mayor distancia = menor riesgo
    const moneynessRatio = opportunity.strike / opportunity.spotPrice;
    if (opportunity.type === 'NAKED_CALL' && moneynessRatio < 1.1) score -= 0.2; // Call muy cerca del dinero
    if (opportunity.type === 'NAKED_PUT' && moneynessRatio > 0.9) score -= 0.2; // Put muy cerca del dinero

    // Tamaño de Theta: Un Theta alto es bueno (más decaimiento rápido), pero también puede indicar mayor riesgo si la opción se mueve muy rápido.
    // Buscamos un balance. Theta muy pequeño es malo (no hay decaimiento rápido)
    if (Math.abs(opportunity.theta) < 0.005) score -= 0.1; // Poco decaimiento
    if (Math.abs(opportunity.theta) > 0.05) score -= 0.05; // Demasiado rápido, puede indicar alto vega

    // MaxLoss: Si está definido, es un riesgo directo.
    if (opportunity.maxLoss !== undefined && opportunity.maxLoss < -100) { // Si la pérdida máxima es superior a un umbral
        // En una naked call, la maxLoss simulada sería un número negativo muy grande.
        // Aquí ajustamos la penalización por una pérdida máxima grande.
        score -= Math.min(0.2, Math.abs(opportunity.maxLoss) / 1000000); // Normalizar por un valor muy grande
    }
    
    return Math.min(1, Math.max(0, score)); // Asegurar que el score esté entre 0 y 1
  }

  public calculateLiquidityScore(opportunity: NakedOpportunity): number {
    // El score de liquidez es crucial para la ejecución.
    let score = 0;

    // Open Interest (OI): Mayor OI significa mayor interés y liquidez.
    score += Math.min(0.4, opportunity.openInterest / 5000); // Max 0.4 para OI >= 2000

    // Volumen de trading: Mayor volumen diario, más fácil de entrar y salir.
    score += Math.min(0.4, opportunity.volume24h / 100); // Max 0.4 para volumen >= 40

    // Bid-Ask Spread: Preferir spreads estrechos.
    // Asumiremos que el volumen y OI son proxies. Un bid-ask estrecho es implícito en alta liquidez.
    // Sin embargo, si tuviéramos acceso a los datos del libro de órdenes, sería directo.
    const impliedSpreadFactor = (opportunity.openInterest + opportunity.volume24h) / 10000;
    score += Math.min(0.2, impliedSpreadFactor * 0.5);

    return Math.min(1, score);
  }

  public calculateWeightedScore(scores: {
    photonic: number;
    temporal: number;
    fundamental: number;
    technical: number;
    risk: number;
    liquidity: number;
  }): number {
    const weights = {
      photonic: 0.20,      // Nuestro edge!
      temporal: 0.20,      // Nuestro otro edge!
      fundamental: 0.15,
      technical: 0.15,
      risk: 0.15,
      liquidity: 0.15,
    };

    // Asegurarse de que los scores no sean NaN o indefinidos
    const actualScores = {
      photonic: isNaN(scores.photonic) ? 0 : scores.photonic,
      temporal: isNaN(scores.temporal) ? 0 : scores.temporal,
      fundamental: isNaN(scores.fundamental) ? 0 : scores.fundamental,
      technical: isNaN(scores.technical) ? 0 : scores.technical,
      risk: isNaN(scores.risk) ? 0 : scores.risk,
      liquidity: isNaN(scores.liquidity) ? 0 : scores.liquidity,
    };

    return (
      actualScores.photonic * weights.photonic +
      actualScores.temporal * weights.temporal +
      actualScores.fundamental * weights.fundamental +
      actualScores.technical * weights.technical +
      actualScores.risk * weights.risk +
      actualScores.liquidity * weights.liquidity
    );
  }

  // Método para calcular el Naked Score general de la oportunidad
  public calculateNakedScore(
    opportunity: NakedOpportunity,
    frequencyAnalysis: FrequencyData,
    temporalAnalysis: TemporalData
  ): number {
    const photonicScore = this.calculatePhotonicScore(opportunity, frequencyAnalysis.theta as ThetaFrequency, frequencyAnalysis);
    const temporalScore = this.calculateTemporalScore(opportunity, temporalAnalysis);
    const fundamentalScore = this.calculateFundamentalScore(opportunity);
    const technicalScore = this.calculateTechnicalScore(opportunity);
    const riskScore = this.calculateRiskScore(opportunity);
    const liquidityScore = this.calculateLiquidityScore(opportunity);

    const weightedScores = {
      photonic: photonicScore,
      temporal: temporalScore,
      fundamental: fundamentalScore,
      technical: technicalScore,
      risk: riskScore,
      liquidity: liquidityScore,
    };

    return this.calculateWeightedScore(weightedScores);
  }

  // Método para calcular la relación Riesgo/Recompensa
  public calculateRiskRewardRatio(opportunity: NakedOpportunity, finalScore: number = 0.5): number { // Valor por defecto
    // Por simplicidad, un ratio más alto es mejor.
    // Basado en el finalScore y la probabilidad de ganancia proyectada.
    // Si opportunity.expectedReturn no está definido y es 0, un divisor de 0.01 es necesario para evitar division by zero.
    const adjustedExpectedReturn = opportunity.expectedReturn !== undefined ? opportunity.expectedReturn : 0.01;
    const adjustedRiskLevel = opportunity.riskLevel !== undefined ? opportunity.riskLevel : 0.1;


    // Evitar division por cero y asegurar un valor razonable
    const baseRatio = adjustedExpectedReturn / Math.max(0.001, adjustedRiskLevel); 
    return baseRatio * (1 + finalScore); // Bonificar por un alto score
  }

  // Método para calcular la pérdida máxima potencial
  public calculateMaxLoss(opportunity: NakedOpportunity): number {
    // Para una naked call, la pérdida es ilimitada. Se simulará un valor grande.
    // Para una naked put, la pérdida es hasta el strike menos el premium recibido.
    if (opportunity.type === 'NAKED_CALL') {
      return -opportunity.strike * 1000; // Un valor representativamente grande
    } else { // NAKED_PUT
      return -(opportunity.strike - opportunity.premium);
    }
  }
}

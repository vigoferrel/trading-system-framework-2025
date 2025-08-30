import { NakedOpportunity } from '../types/srona-core-types';
import { FrequencyData, ThetaFrequency, IVFrequency, DeltaFrequency, ResonancePattern, FrequencyAnomaly } from '../types/frequency-types';

export class AnalizadorFrecuencias {
  public async analyzeAll(opportunities: NakedOpportunity[]): Promise<FrequencyData> {
    console.log('[AnalizadorFrecuencias] Analizando frecuencias de oportunidades...');

    const thetaAnalysisResult = this.performThetaAnalysis(opportunities); 
    const ivAnalysis = this.performIVAnalysis(opportunities);
    const deltaAnalysis = this.performDeltaAnalysis(opportunities);
    const resonancePatterns = this.identifyResonancePatterns(opportunities);
    const anomalies = this.detectFrequencyAnomalies(opportunities, thetaAnalysisResult, ivAnalysis, deltaAnalysis);

    // No hay simulación de retraso, ya que la lógica ahora será más real.

    return {
      coherence: this.calculateGlobalCoherence(thetaAnalysisResult, ivAnalysis, deltaAnalysis),
      anomalyStrength: anomalies.length > 0 ? anomalies.reduce((sum, a) => sum + a.confidence, 0) / anomalies.length : 0,
      theta: thetaAnalysisResult,
      iv: ivAnalysis,
      delta: deltaAnalysis,
      resonance: { patterns: resonancePatterns },
      anomalies: anomalies,
    };
  }

  // Análisis de Frecuencias Theta (Decaimiento Temporal)
  private performThetaAnalysis(opportunities: NakedOpportunity[]): ThetaFrequency {
    // La tasa de decaimiento temporal (Theta) es crucial. Aquí la cuantificamos y analizamos.
    // Las "frecuencias" de Theta no son frecuencias literales, sino la velocidad y el impacto del decaimiento temporal.
    // Cuanto más rápido y significativo sea el decaimiento, mayor la "frecuencia" de la señal.
    const frequencies = opportunities.map(opp => {
      // Valor de la frecuencia: Theta normalizado por los días a vencimiento y el moneyness
      const daysToExpiry = (opp.expiry - Date.now()) / (1000 * 60 * 60 * 24);
      const moneyness = Math.abs(opp.strike / opp.spotPrice - 1);
      // Sensibilidad del decaimiento: Theta se acelera cerca del vencimiento y ATM
      const thetaSensitivityFactor = (1 - this.normalizeValue(daysToExpiry, 0, 90)) + (1 - this.normalizeValue(moneyness, 0, 0.2));
      const value = Math.abs(opp.theta) * thetaSensitivityFactor * 1000; // Multiplico para escalar como una "frecuencia"

      // Amplitud de la frecuencia: Combinación de prima y Vega (sensibilidad a la volatilidad)
      // Una mayor prima y mayor Vega significan que la "onda" de decaimiento es más potente.
      const premiumImpact = this.normalizeValue(opp.premium, 0, 0.5);
      const vegaImpact = this.normalizeValue(opp.vega, 0, 0.05); // Valor típico de Vega es pequeño
      const amplitude = (premiumImpact * 0.7 + vegaImpact * 0.3); // Ponderación de impacto

      return { value, amplitude };
    });
    
    const totalAmplitude = frequencies.reduce((sum, freq) => sum + freq.amplitude, 0);
    const dominantFrequency = frequencies.length > 0 ?
      frequencies.reduce((max, freq) => freq.amplitude > max.amplitude ? freq : max).value : 0;
    const maxAmplitude = frequencies.length > 0 ?
      Math.max(...frequencies.map(f => f.amplitude)) : 0;

    const averageDecayRate = opportunities.reduce((sum, opp) => sum + Math.abs(opp.theta), 0) / (opportunities.length || 1);

    // Detección de patrones de decaimiento más dinámicos
    const patterns: string[] = [];
    if (averageDecayRate > 0.02 && maxAmplitude > 0.5) patterns.push('theta_accelerated_strong');
    if (opportunities.some(opp => (opp.expiry - Date.now()) / (1000 * 60 * 60 * 24) < 7 && Math.abs(opp.theta) > 0.03)) {
      patterns.push('weekly_theta_burn'); // Patrón de decaimiento rápido en vencimientos semanales
    }
    if (opportunities.some(opp => Math.abs(opp.strike / opp.spotPrice - 1) < 0.01 && Math.abs(opp.theta) > 0.015)) {
      patterns.push('atm_theta_convergence'); // Theta convergiendo rápidamente a cero en ATM
    }

    return {
      dominantFrequency: dominantFrequency,
      maxAmplitude: maxAmplitude,
      patterns: patterns.length > 0 ? patterns : ['decay_normal'],
      averageDecayRate: averageDecayRate,
      resonancePoints: this.findThetaResonancePoints(opportunities),
      frequencies: frequencies
    };
  }

  // Análisis de Frecuencias de Volatilidad Implícita (IV)
  private performIVAnalysis(opportunities: NakedOpportunity[]): IVFrequency { 
    // La IV es un indicador clave de las expectativas del mercado sobre el movimiento del precio
    // y es fundamental para el pricing de opciones.
    const ivValues = opportunities.map(opp => opp.impliedVolatility);
    const avgIV = ivValues.reduce((sum, iv) => sum + iv, 0) / ivValues.length;

    // Cálculo básico de Volatility of Volatility (VoV)
    // En la realidad, esto sería más complejo, considerando series temporales de la IV.
    const volatilityOfVolatility = opportunities.length > 1 ? 
      Math.sqrt(ivValues.map(iv => Math.pow(iv - avgIV, 2)).reduce((a, b) => a + b) / (ivValues.length - 1)) : 0;

    // Skew (Inclinación): diferencia en IV para diferentes strikes (OTM vs ATM/ITM)
    // Un skew alto puede indicar fuerte demanda de opciones de protección (puts)
    const calls = opportunities.filter(o => o.type === 'NAKED_CALL');
    const puts = opportunities.filter(o => o.type === 'NAKED_PUT');
    const avgIVCall = calls.length > 0 ? calls.reduce((s, c) => s + c.impliedVolatility, 0) / calls.length : avgIV;
    const avgIVPut = puts.length > 0 ? puts.reduce((s, p) => s + p.impliedVolatility, 0) / puts.length : avgIV;
    const skew = (avgIVPut - avgIVCall) / avgIV; // Proxy sencillo de skew

    // Term Structure (Estructura a Término): IV para diferentes expiraciones
    // Puede indicar expectativas de volatilidad futura
    const shortTermIV = opportunities.filter(o => (o.expiry - Date.now()) / (1000 * 60 * 60 * 24) < 30)
                               .map(o => o.impliedVolatility)
                               .reduce((s, iv) => s + iv, 0) / (opportunities.length || 1);
    const longTermIV = opportunities.filter(o => (o.expiry - Date.now()) / (1000 * 60 * 60 * 24) >= 90)
                              .map(o => o.impliedVolatility)
                              .reduce((s, iv) => s + iv, 0) / (opportunities.length || 1);
    const termStructureTrend = longTermIV > shortTermIV ? 'contango' : 'backwardation';

    // Análisis de superficie de volatilidad (simplificado)
    const surfaceAnalysis = opportunities.some(o => o.impliedVolatility > 1.0) ? 'rough' : 'smooth';

    return {
      crushProbability: volatilityOfVolatility * 0.5, // Mayor VoV -> mayor probabilidad de IV crush
      volatilityOfVolatility: volatilityOfVolatility,
      skew: skew,
      termStructure: termStructureTrend,
      surfaceAnalysis: surfaceAnalysis,
      volatilitySmile: {
        otmCallIV: avgIVCall,
        atmMonoIV: avgIV,
        otmPutIV: avgIVPut,
        butterflyImpact: Math.abs(avgIVCall + avgIVPut - 2 * avgIV)
      },
      ivMomentum: volatilityOfVolatility,
      ivAcceleration: volatilityOfVolatility * 2 // Simple acceleration proxy
    };
  }

  // Análisis de Frecuencias Delta (Sensibilidad Direccional)
  private performDeltaAnalysis(opportunities: NakedOpportunity[]): DeltaFrequency { 
    // Delta mide la sensibilidad del precio de la opción al precio del activo subyacente.
    // Es clave para entender la exposición direccional.
    const deltaValues = opportunities.map(opp => opp.delta);
    const avgDelta = deltaValues.reduce((sum, d) => sum + d, 0) / deltaValues.length;

    // Neutralidad del portfolio (simplificado)
    const neutralityScore = 1 - Math.abs(avgDelta); // Qué tan cerca estamos de ser delta neutral

    // Riesgo de "Breakdown" (cuando la estrategia pierde neutralidad)
    // Basado en Gamma y un cambio significativo en Delta.
    const breakdownRisk = opportunities.reduce((risk, opp) => risk + Math.abs(opp.gamma * opp.delta), 0) * 0.1;

    // Gamma Exposure (GEX) o Gamma de la cartera
    // Mide cuánto cambia el delta por un movimiento de un punto en el subyacente.
    const gammaExposure = opportunities.reduce((sum, opp) => sum + opp.gamma * opp.openInterest * opp.spotPrice, 0);

    // Hedge Ratio (Radio de Cobertura)
    // Proporción de activo subyacente necesaria para cubrir un cambio en el delta de la opción.
    const hedgeRatio = Math.abs(avgDelta);

    // Mapa de Sensibilidad (simplificado)
    const sensitivityMap: { [key: string]: number } = {};
    opportunities.forEach(opp => {
      if (!sensitivityMap[opp.symbol]) {
        sensitivityMap[opp.symbol] = 0;
      }
      sensitivityMap[opp.symbol] += opp.delta;
    });

    // Calculate gamma distribution
    const atmOpportunities = opportunities.filter(opp => Math.abs(opp.strike / opp.spotPrice - 1) < 0.02);
    const otmOpportunities = opportunities.filter(opp => opp.strike / opp.spotPrice > 1.02);
    const itmOpportunities = opportunities.filter(opp => opp.strike / opp.spotPrice < 0.98);
    
    const atmGamma = atmOpportunities.reduce((sum, opp) => sum + opp.gamma, 0) / (atmOpportunities.length || 1);
    const otmGamma = otmOpportunities.reduce((sum, opp) => sum + opp.gamma, 0) / (otmOpportunities.length || 1);
    const itmGamma = itmOpportunities.reduce((sum, opp) => sum + opp.gamma, 0) / (itmOpportunities.length || 1);
    
    const peakGammaOpp = opportunities.reduce((max, opp) => opp.gamma > max.gamma ? opp : max, opportunities[0] || { gamma: 0, strike: 0 });

    return {
      neutralityScore: neutralityScore,
      breakdownRisk: breakdownRisk,
      gammaExposure: gammaExposure,
      hedgeRatio: hedgeRatio,
      sensitivityMap: sensitivityMap,
      gammaDistribution: {
        atmGamma: atmGamma,
        otmGamma: otmGamma,
        itmGamma: itmGamma,
        peakGammaStrike: peakGammaOpp.strike
      },
      vanna: opportunities.reduce((sum, opp) => sum + (opp.vega * opp.delta), 0) / (opportunities.length || 1),
      charm: opportunities.reduce((sum, opp) => sum + (opp.theta * opp.delta), 0) / (opportunities.length || 1)
    };
  }

  // Identificación de Patrones de Resonancia (Theta, IV, Delta en conjunto)
  private identifyResonancePatterns(opportunities: NakedOpportunity[]): ResonancePattern[] {
    const patterns: ResonancePattern[] = [];
    opportunities.forEach(opp => {
      // Un patrón de resonancia ocurre cuando Theta, IV y Delta exhiben comportamientos sincrónicos
      // o que se refuerzan mutuamente.
      // Esta es una pseudo-lógica compleja, representando la interdependencia de griegas.

      const daysToExpiry = (opp.expiry - Date.now()) / (1000 * 60 * 60 * 24);
      const isShortTerm = daysToExpiry < 30;
      const isHighIV = opp.impliedVolatility > 0.7;
      const isNearATM = Math.abs(opp.strike / opp.spotPrice - 1) < 0.03;

      if (isShortTerm && isHighIV && opp.theta < -0.02 && isNearATM) {
        // Ejemplo: Decaimiento rápido de Theta en opciones near-ATM con alta IV a corto plazo
        patterns.push({
          symbol: opp.symbol,
          strength: (Math.abs(opp.theta) + opp.impliedVolatility) / 2,
          frequency: opp.impliedVolatility * 100, // IV como proxy de frecuencia
          type: 'theta_iv_bleed',
          phase: 0.1,
          stability: 0.8
        });
      }

      if (opp.type === 'NAKED_PUT' && opp.delta < -0.1 && opp.gamma > 0.005 && opp.impliedVolatility > 0.6) {
        // Ejemplo: Venta de Put defensivo con alta gamma para movimientos bruscos
        patterns.push({
          symbol: opp.symbol,
          strength: opp.gamma * opp.impliedVolatility,
          frequency: opp.gamma * 1000,
          type: 'directional_vol_play',
          phase: 0.3,
          stability: 0.7
        });
      }
      // Se añadirían más reglas para detectar otros patrones de resonancia
    });
    return patterns;
  }

  // Detección de Anomalías Frecuenciales (rupturas en los patrones esperados)
  private detectFrequencyAnomalies(
    opportunities: NakedOpportunity[],
    thetaAnalysis: ThetaFrequency,
    ivAnalysis: IVFrequency,
    deltaAnalysis: DeltaFrequency
  ): FrequencyAnomaly[] {
    const anomalies: FrequencyAnomaly[] = [];

    // Anomalía 1: Decaimiento Theta Anormalmente Rápido (posible evento de tiempo)
    if (thetaAnalysis.averageDecayRate > 0.03 && thetaAnalysis.maxAmplitude > 1.0) {
      anomalies.push({
        type: 'ACCELERATED_THETA_DECAY',
        severity: 'HIGH',
        affectedSymbols: opportunities.map(o => o.symbol),
        description: 'Decaimiento Theta anómalamente rápido, indicando expiración inminente o evento significativo.',
        confidence: 0.9,
      });
    }
    
    // Anomalía 2: Probabilidad de IV Crush Elevada
    if (ivAnalysis.crushProbability > 0.4 && ivAnalysis.termStructure === 'backwardation') {
      anomalies.push({
        type: 'IV_CRUSH_IMMINENT',
        severity: 'MEDIUM',
        affectedSymbols: opportunities.map(o => o.symbol),
        description: 'Riesgo elevado de implosión de volatilidad implícita, especialmente en backwardation.',
        confidence: 0.75,
      });
    }

    // Anomalía 3: Confusión en la Señal Delta (Delta-Gamma Squeeze potencial)
    if (deltaAnalysis.neutralityScore < 0.5 && deltaAnalysis.gammaExposure > 50000) {
      anomalies.push({
        type: 'DELTA_NEUTRAL_BREAKDOWN', // O DELTA_GAMMA_SQUEEZE_POTENTIAL
        severity: 'HIGH',
        affectedSymbols: opportunities.map(o => o.symbol),
        description: 'Múltiples opciones apuntando a direcciones opuestas o alta GEX, indicando posible "squeeze" o ruptura de la neutralidad.',
        confidence: 0.85,
      });
    }
    
    // Se añadirían más reglas complejas basadas en desviaciones estándar, aprendizaje automático, etc.
    return anomalies;
  }

  // Cálculo de Coherencia Global de las Frecuencias
  private calculateGlobalCoherence(
    thetaAnalysis: ThetaFrequency,
    ivAnalysis: IVFrequency,
    deltaAnalysis: DeltaFrequency
  ): number {
    // La coherencia es una métrica de cuán alineadas están las diferentes "ondas" de frecuencias.
    // Un valor alto indica una señal clara y concisa en el mercado de opciones.
    // Normalizamos los valores a un rango de 0-1 antes de combinarlos.
    const normalizedTheta = this.normalizeValue(thetaAnalysis.averageDecayRate, 0, 0.05); // (0 - 0.05)
    const normalizedIV = this.normalizeValue(ivAnalysis.volatilityOfVolatility, 0, 1.0); // (0 - 1.0)
    const normalizedDelta = this.normalizeValue(deltaAnalysis.neutralityScore, 0.5, 1.0); // (0.5 - 1.0)

    // Combinación ponderada de las coherencias de cada frecuencia
    const coherence = (
      normalizedTheta * 0.3 +       // Importancia del decaimiento temporal
      normalizedIV * 0.4 +          // La volatilidad es un factor dominante
      normalizedDelta * 0.3         // La direccionalidad también influye
    );

    return Math.min(1.0, Math.max(0.0, coherence)); // Asegurarse de que esté entre 0 y 1
  }

  // Función auxiliar para normalizar valores a un rango de 0 a 1
  private normalizeValue(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  // Métodos auxiliares para encontrar puntos de resonancia (pseudo-lógica)
  private findThetaResonancePoints(_opportunities: NakedOpportunity[]): string[] {
    // Esto implicaría análisis de datos históricos y machine learning
    // para encontrar strikes o expiraciones donde Theta es anómalamente alto/bajo
    // o donde ha habido un cambio brusco consistentemente.
    return ['2000 ETH C', '30000 BTC P']; // Placeholder
  }
}

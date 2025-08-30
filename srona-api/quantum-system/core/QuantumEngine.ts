import { 
  QuantumAsset, 
  QuantumFactors, 
  MarketData, 
  ArbitrageOpportunity, 
  ArbitrageType,
  QuantumAssetSymbol 
} from '../types/quantum-types';

/**
 * Motor Cuántico Principal - Corazón del Sistema
 * Calcula factores cuánticos y detecta oportunidades de arbitraje
 */
export class QuantumEngine {
  private assets: Map<QuantumAssetSymbol, QuantumAsset> = new Map();
  private riskFreeRate: number = 0.05; // 5% anual
  private lastOptimization: number = 0;

  constructor() {
    this.initializeAssets();
  }

  /**
   * Inicializa los 13 activos estratégicos de la matriz
   */
  private initializeAssets(): void {
    const symbols: QuantumAssetSymbol[] = [
      'BTC', 'ETH', 'BNB', 'SOL', 'ADA',
      'USDT', 'USDC', 'BUSD', 'DOT', 'LINK',
      'AVAX', 'UNI', 'DOGE'
    ];

    symbols.forEach((symbol, index) => {
      const row = Math.floor(index / 13);
      const col = index % 13;
      
      const asset: QuantumAsset = {
        symbol,
        matrixPosition: [row, col],
        market: this.initializeMarketData(),
        quantum: this.initializeQuantumFactors(),
        pricing: {
          quantumSpotPrice: 0,
          quantumFuturesPrice: 0,
          quantumOptionsPrice: { calls: [], puts: [] }
        },
        confidence: 0.5,
        lastUpdated: Date.now()
      };

      this.assets.set(symbol, asset);
    });
  }

  /**
   * Actualiza datos de mercado para un activo
   */
  updateMarketData(symbol: QuantumAssetSymbol, marketData: MarketData): void {
    const asset = this.assets.get(symbol);
    if (!asset) return;

    asset.market = marketData;
    asset.lastUpdated = Date.now();

    // Recalcular factores cuánticos
    asset.quantum = this.calculateQuantumFactors(asset);
    
    // Recalcular precios cuánticos
    asset.pricing = this.calculateQuantumPricing(asset);
    
    // Actualizar confianza del modelo
    asset.confidence = this.calculateModelConfidence(asset);

    this.assets.set(symbol, asset);
  }

  /**
   * Calcula factores cuánticos basados en datos de mercado
   */
  private calculateQuantumFactors(asset: QuantumAsset): QuantumFactors {
    const market = asset.market;
    
    // Factores base
    const entanglement = this.calculateEntanglement(asset);
    const coherence = this.calculateCoherence(asset);
    const momentum = this.calculateMomentum(asset);
    const density = this.calculateDensity(asset);
    const temperature = this.calculateTemperature(asset);

    // Nuevos factores cuánticos
    const quantumEntropy = this.calculateQuantumEntropy(asset);
    const superpositionIndex = this.calculateSuperpositionIndex(asset);
    const tunnelingProbability = this.calculateTunnelingProbability(asset);

    // Factores derivados
    const volatilidad = this.calculateQuantumVolatility(
      entanglement, coherence, momentum, density, temperature
    );
    
    const phase = this.calculateQuantumPhase(asset);
    const amplitude = this.calculateQuantumAmplitude(asset);
    const frequency = this.calculateQuantumFrequency(asset);

    return {
      entanglement,
      coherence,
      momentum,
      density,
      temperature,
      volatilidad,
      phase,
      amplitude,
      frequency,
      quantumEntropy,
      superpositionIndex,
      tunnelingProbability
    };
  }

  /**
   * Calcula entanglement (correlación con otros activos)
   */
  public calculateEntanglement(asset: QuantumAsset): number {
    let totalCorrelation = 0;
    let count = 0;

    // Calcular correlación con otros activos
    for (const [symbol, otherAsset] of this.assets) {
      if (symbol === asset.symbol) continue;
      
      const correlation = this.calculatePriceCorrelation(asset, otherAsset);
      totalCorrelation += Math.abs(correlation);
      count++;
    }

    return count > 0 ? Math.min(totalCorrelation / count, 1) : 0;
  }

  /**
   * Calcula coherencia del patrón de precios
   */
  public calculateCoherence(asset: QuantumAsset): number {
    const market = asset.market;
    
    // Coherencia basada en consistencia entre spot, futuros y opciones
    const spotPrice = market.spot.price;
    const futuresPrice = market.futures.price;
    const impliedVol = market.options.impliedVolatility;
    
    // Calcular desviación de precios teóricos
    const theoreticalFutures = this.calculateTheoreticalFuturesPrice(asset);
    const futuresDeviation = Math.abs(futuresPrice - theoreticalFutures) / theoreticalFutures;
    
    // Coherencia inversa a la desviación
    return Math.max(0, 1 - futuresDeviation * 10);
  }

  /**
   * Calcula momentum cuántico
   */
  public calculateMomentum(asset: QuantumAsset): number {
    const market = asset.market;
    
    // Momentum basado en cambio de precio y volumen
    const priceChange = Math.abs(market.spot.change24h) / 100;
    const volumeRatio = market.spot.volume / (market.spot.volume + market.futures.volume);
    
    return Math.min(priceChange * volumeRatio * 2, 1);
  }

  /**
   * Calcula densidad de información
   */
  public calculateDensity(asset: QuantumAsset): number {
    const market = asset.market;
    
    // Densidad basada en liquidez y profundidad del mercado
    const liquidityScore = market.liquidity.score;
    const spread = market.liquidity.spread;
    const depth = market.liquidity.depth;
    
    // Normalizar y combinar métricas
    const normalizedSpread = Math.max(0, 1 - spread * 1000); // Spread más bajo = mayor densidad
    const normalizedDepth = Math.min(depth / 1000000, 1); // Normalizar depth
    
    return (liquidityScore + normalizedSpread + normalizedDepth) / 3;
  }

  /**
   * Calcula temperatura del mercado
   */
  public calculateTemperature(asset: QuantumAsset): number {
    const market = asset.market;
    
    // Temperatura basada en volatilidad implícita y cambios de precio
    const impliedVol = market.options.impliedVolatility;
    const priceChange = Math.abs(market.spot.change24h) / 100;
    
    return Math.min((impliedVol + priceChange) / 2, 1);
  }

  /**
   * Calcula volatilidad cuántica
   */
  private calculateQuantumVolatility(
    entanglement: number,
    coherence: number,
    momentum: number,
    density: number,
    temperature: number
  ): number {
    // Fórmula cuántica para volatilidad
    return Math.min(
      temperature * (1 + entanglement * 0.2 + momentum * 0.3) * (2 - coherence) * (2 - density),
      2
    );
  }

  /**
   * Calcula precios cuánticos
   */
  private calculateQuantumPricing(asset: QuantumAsset): QuantumAsset['pricing'] {
    const market = asset.market;
    const quantum = asset.quantum;
    
    // Precio spot cuántico (referencia)
    const quantumSpotPrice = market.spot.price;
    
    // Precio futuros cuántico
    const quantumFuturesPrice = this.calculateQuantumFuturesPrice(asset);
    
    // Precios opciones cuánticas
    const quantumOptionsPrice = this.calculateQuantumOptionsPrice(asset);
    
    return {
      quantumSpotPrice,
      quantumFuturesPrice,
      quantumOptionsPrice
    };
  }

  /**
   * Calcula precio cuántico de futuros
   */
  private calculateQuantumFuturesPrice(asset: QuantumAsset): number {
    const market = asset.market;
    const quantum = asset.quantum;
    
    // Precio base de futuros
    const basePrice = market.spot.price * Math.exp(
      (this.riskFreeRate - 0.02) * market.futures.timeToExpiry
    );
    
    // Ajustes cuánticos
    const quantumAdjustment = basePrice * (
      quantum.entanglement * 0.001 +
      quantum.momentum * 0.002 +
      quantum.density * 0.001 -
      quantum.temperature * 0.001
    );
    
    return basePrice + quantumAdjustment;
  }

  /**
   * Calcula precios cuánticos de opciones
   */
  private calculateQuantumOptionsPrice(asset: QuantumAsset): { calls: number[], puts: number[] } {
    const market = asset.market;
    const quantum = asset.quantum;
    
    const calls = market.options.calls.map(call => 
      this.calculateQuantumOptionPrice(asset, call.strike, call.timeToExpiry, 'CALL')
    );
    
    const puts = market.options.puts.map(put => 
      this.calculateQuantumOptionPrice(asset, put.strike, put.timeToExpiry, 'PUT')
    );
    
    return { calls, puts };
  }

  /**
   * Calcula precio cuántico de una opción individual
   */
  private calculateQuantumOptionPrice(
    asset: QuantumAsset,
    strike: number,
    timeToExpiry: number,
    type: 'CALL' | 'PUT'
  ): number {
    const spot = asset.market.spot.price;
    const quantum = asset.quantum;
    
    // Volatilidad cuántica
    const quantumVol = quantum.volatilidad;
    
    // Black-Scholes cuántico
    const d1 = (Math.log(spot / strike) + 
                (this.riskFreeRate + 0.5 * quantumVol ** 2) * timeToExpiry) /
               (quantumVol * Math.sqrt(timeToExpiry));
    
    const d2 = d1 - quantumVol * Math.sqrt(timeToExpiry);
    
    if (type === 'CALL') {
      return spot * this.normalCDF(d1) - 
             strike * Math.exp(-this.riskFreeRate * timeToExpiry) * this.normalCDF(d2);
    } else {
      return strike * Math.exp(-this.riskFreeRate * timeToExpiry) * this.normalCDF(-d2) - 
             spot * this.normalCDF(-d1);
    }
  }

  /**
   * Detecta oportunidades de arbitraje
   */
  private arbitrageOpportunities: ArbitrageOpportunity[] = [];

  detectArbitrageOpportunities(): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];
    
    for (const [symbol, asset] of this.assets) {
      // Arbitraje basis (spot vs futuros)
      const basisOpp = this.detectBasisArbitrage(asset);
      if (basisOpp && basisOpp.score > 0.1) {
        opportunities.push(basisOpp);
      }
      
      // Arbitraje opciones naked
      const optionOpps = this.detectNakedOptionArbitrage(asset);
      opportunities.push(...optionOpps.filter(opp => opp.score > 0.1));
    }
    
    // Ordenar por score
    this.arbitrageOpportunities = opportunities.sort((a, b) => b.score - a.score);
    return this.arbitrageOpportunities;
  }

  getArbitrageOpportunities(): ArbitrageOpportunity[] {
    return [...this.arbitrageOpportunities];
  }

  /**
   * Detecta arbitraje basis
   */
  private detectBasisArbitrage(asset: QuantumAsset): ArbitrageOpportunity | null {
    const market = asset.market;
    const pricing = asset.pricing;
    
    const binanceFuturesPrice = market.futures.price;
    const quantumFuturesPrice = pricing.quantumFuturesPrice;
    
    const differential = Math.abs(quantumFuturesPrice - binanceFuturesPrice) / binanceFuturesPrice;
    
    if (differential < 0.001) return null; // Mínimo 0.1% diferencial
    
    const liquidityScore = market.liquidity.score;
    const confidenceScore = asset.confidence;
    
    const score = differential * 0.4 + liquidityScore * 0.3 + confidenceScore * 0.3;
    
    return {
      id: `basis_${asset.symbol}_${Date.now()}`,
      asset: asset.symbol,
      type: 'BASIS_ARBITRAGE',
      strategy: quantumFuturesPrice > binanceFuturesPrice ? 'SELL_FUTURES_BUY_SPOT' : 'BUY_FUTURES_SELL_SPOT',
      differential,
      expectedProfit: differential * 10000, // Asumiendo posición de $10k
      maxRisk: differential * 2000, // 20% del profit esperado
      score,
      liquidityScore,
      confidenceScore,
      riskManagement: {
        stopLoss: binanceFuturesPrice * (1 + (quantumFuturesPrice > binanceFuturesPrice ? -0.02 : 0.02)),
        takeProfit: binanceFuturesPrice + (quantumFuturesPrice - binanceFuturesPrice) * 0.7,
        maxRisk: differential * 2000
      },
      detectedAt: Date.now(),
      expiresAt: Date.now() + 300000 // 5 minutos
    };
  }

  /**
   * Detecta arbitraje opciones naked
   */
  private detectNakedOptionArbitrage(asset: QuantumAsset): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];
    const market = asset.market;
    const pricing = asset.pricing;
    
    // Verificar calls
    market.options.calls.forEach((call, index) => {
      const quantumPrice = pricing.quantumOptionsPrice.calls[index];
      if (!quantumPrice) return;
      
      const differential = Math.abs(quantumPrice - call.price) / call.price;
      if (differential < 0.02) return; // Mínimo 2% diferencial
      
      const score = differential * 0.5 + market.liquidity.score * 0.3 + asset.confidence * 0.2;
      
      opportunities.push({
        id: `naked_call_${asset.symbol}_${call.strike}_${Date.now()}`,
        asset: asset.symbol,
        type: 'NAKED_CALL',
        strategy: quantumPrice > call.price ? 'SELL_NAKED_CALL' : 'BUY_NAKED_CALL',
        differential,
        expectedProfit: differential * call.price * 100, // 100 contratos
        maxRisk: quantumPrice > call.price ? Infinity : call.price * 100,
        score,
        liquidityScore: market.liquidity.score,
        confidenceScore: asset.confidence,
        riskManagement: {
          stopLoss: call.price * (1 + (quantumPrice > call.price ? -0.1 : 0.1)),
          takeProfit: call.price + (quantumPrice - call.price) * 0.6,
          maxRisk: call.price * 100
        },
        detectedAt: Date.now(),
        expiresAt: Date.now() + 600000 // 10 minutos
      });
    });
    
    // Verificar puts (similar lógica)
    market.options.puts.forEach((put, index) => {
      const quantumPrice = pricing.quantumOptionsPrice.puts[index];
      if (!quantumPrice) return;
      
      const differential = Math.abs(quantumPrice - put.price) / put.price;
      if (differential < 0.02) return;
      
      const score = differential * 0.5 + market.liquidity.score * 0.3 + asset.confidence * 0.2;
      
      opportunities.push({
        id: `naked_put_${asset.symbol}_${put.strike}_${Date.now()}`,
        asset: asset.symbol,
        type: 'NAKED_PUT',
        strategy: quantumPrice > put.price ? 'SELL_NAKED_PUT' : 'BUY_NAKED_PUT',
        differential,
        expectedProfit: differential * put.price * 100,
        maxRisk: quantumPrice > put.price ? put.strike * 100 : put.price * 100,
        score,
        liquidityScore: market.liquidity.score,
        confidenceScore: asset.confidence,
        riskManagement: {
          stopLoss: put.price * (1 + (quantumPrice > put.price ? -0.1 : 0.1)),
          takeProfit: put.price + (quantumPrice - put.price) * 0.6,
          maxRisk: put.price * 100
        },
        detectedAt: Date.now(),
        expiresAt: Date.now() + 600000
      });
    });
    
    return opportunities;
  }

  /**
   * Obtiene todos los activos
   */
  getAllAssets(): QuantumAsset[] {
    return Array.from(this.assets.values());
  }

  /**
   * Obtiene un activo específico
   */
  getAsset(symbol: QuantumAssetSymbol): QuantumAsset | undefined {
    return this.assets.get(symbol);
  }

  // Métodos auxiliares
  private initializeMarketData(): MarketData {
    return {
      spot: { price: 0, volume: 0, change24h: 0 },
      futures: { price: 0, volume: 0, basis: 0, fundingRate: 0, timeToExpiry: 0 },
      options: { calls: [], puts: [], impliedVolatility: 0 },
      liquidity: { score: 0, depth: 0, spread: 0 }
    };
  }

  private initializeQuantumFactors(): QuantumFactors {
    return {
      entanglement: 0,
      coherence: 0,
      momentum: 0,
      density: 0,
      temperature: 0,
      volatilidad: 0,
      phase: 0,
      amplitude: 1,
      frequency: 1000,
      quantumEntropy: 0,
      superpositionIndex: 0,
      tunnelingProbability: 0
    };
  }

  private calculatePriceCorrelation(asset1: QuantumAsset, asset2: QuantumAsset): number {
    // Correlación simplificada basada en cambios de precio
    const change1 = asset1.market.spot.change24h;
    const change2 = asset2.market.spot.change24h;
    
    // Correlación básica
    return Math.abs(change1 - change2) < 5 ? 0.8 : 0.2;
  }

  private calculateTheoreticalFuturesPrice(asset: QuantumAsset): number {
    return asset.market.spot.price * Math.exp(
      (this.riskFreeRate - 0.02) * asset.market.futures.timeToExpiry
    );
  }

  public calculateQuantumPhase(asset: QuantumAsset): number {
    return (asset.quantum.momentum * 360) % 360;
  }

  public calculateQuantumAmplitude(asset: QuantumAsset): number {
    return 0.5 + asset.quantum.coherence * 1.5;
  }

  public calculateQuantumFrequency(asset: QuantumAsset): number {
    return 500 + asset.quantum.temperature * 1500;
  }

  public calculateQuantumEntropy(asset: QuantumAsset): number {
    const market = asset.market;
    const priceChange = Math.abs(market.spot.change24h) / 100;
    const volumeChange = Math.abs(market.spot.volume - market.futures.volume) / market.spot.volume;
    return Math.min(priceChange * volumeChange * 2, 1);
  }

  public calculateSuperpositionIndex(asset: QuantumAsset): number {
    const quantum = asset.quantum;
    const superposition =
      (quantum.entanglement + quantum.coherence + quantum.momentum) / 3;
    return Math.min(superposition * 1.5, 1);
  }

  public calculateTunnelingProbability(asset: QuantumAsset): number {
    const market = asset.market;
    const spread = market.liquidity.spread;
    const depth = market.liquidity.depth;
    const tunneling =
      (1 - spread) * (depth / 1000000) * asset.quantum.volatilidad;
    return Math.min(tunneling, 1);
  }

  private calculateModelConfidence(asset: QuantumAsset): number {
    const quantum = asset.quantum;
    return (quantum.coherence + quantum.density + (1 - quantum.temperature)) / 3;
  }

  private normalCDF(x: number): number {
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  private erf(x: number): number {
    // Aproximación de la función error de Gauss para mayor precisión
    // Código basado en la fórmula de Abramowitz y Stegun
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    // Constantes para la aproximación de Abramowitz y Stegun (fórmula 7.1.26)
    const t = 1.0 / (1.0 + 0.5 * x);
    const y = 1.0 - t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 +
              t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 +
              t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 +
              t * (0.17087277))))))))));

    return sign * y;
  }
}


// Constantes físicas reales del sistema
const PHYSICAL_CONSTANTS = {
  "QUANTUM_COHERENCE": 0.75,
  "QUANTUM_CONSCIOUSNESS": 0.8,
  "QUANTUM_ENTANGLEMENT": 0.65,
  "QUANTUM_SUPERPOSITION": 0.7,
  "QUANTUM_TUNNELING": 0.6,
  "MARKET_VOLATILITY": 0.05,
  "MARKET_MOMENTUM": 0.1,
  "MARKET_LIQUIDITY": 0.75,
  "MARKET_SPREAD": 0.001,
  "MARKET_DEPTH": 500000,
  "FUNDING_RATE": 0.02,
  "FUNDING_VOLATILITY": 0.01,
  "FUNDING_DEVIATION": 0.5,
  "FUNDING_ANNUALIZED": 5,
  "LIQUIDATION_PROBABILITY": 0.05,
  "SLIPPAGE_RATE": 0.0025,
  "VOLATILITY_RISK": 0.1,
  "EXECUTION_RISK": 0.005,
  "VOLUME_24H": 500000,
  "VOLUME_RATIO": 0.75,
  "VOLUME_EXPANSION": 300000,
  "PRICE_CHANGE": 0.02,
  "PRICE_ACCELERATION": 0.015,
  "PRICE_MOMENTUM": 0.01,
  "TIME_TO_FUNDING": 1800000,
  "SESSION_INTENSITY": 0.6,
  "TEMPORAL_RESONANCE": 0.7,
  "FIBONACCI_STRENGTH": 0.75,
  "FIBONACCI_INDEX": 5,
  "NEURAL_CONFIDENCE": 0.85,
  "NEURAL_COHERENCE": 0.8,
  "NEURAL_ENTANGLEMENT": 0.7,
  "BASE_LEVERAGE": 15,
  "CONSERVATIVE_LEVERAGE": 10,
  "AGGRESSIVE_LEVERAGE": 25,
  "STOP_LOSS": 0.03,
  "TAKE_PROFIT": 0.06,
  "BASE_SCORE": 0.65,
  "CONFIDENCE_SCORE": 0.75,
  "QUALITY_SCORE": 0.8
};

/**
 * PredictionService
 * Capacidades predictivas basadas en SentimentScore (Binance-only) + ORCH-OR coherence/phi
 * No usa dependencias externas. Diseñado para producir señales BUY/SELL/HOLD por símbolo y a nivel cartera.
 */

class PredictionService {
  constructor(opts = {}) {
    this.getSentimentScore = typeof opts.getSentimentScore === 'function' ? opts.getSentimentScore : null;
    this.getOrchState = typeof opts.getOrchState === 'function' ? opts.getOrchState : null;
    this.symbols = Array.isArray(opts.symbols) ? opts.symbols.slice() : ['BTC', 'ETH', 'BNB'];
  }

  _combineScores(sentScore, orch) {
    const coh = Math.max(0, Math.min(1, Number(orch?.coherence || 1)));
    const phi = Math.max(0, Math.min(1, Number(orch?.phi || 0)));
    const s = Math.max(0, Math.min(1, Number(sentScore || 0.5)));
    // score combinado: pondera sentimiento y eleva confianza bajo coherencia
    const combined = 0.7 * s + 0.3 * Math.max(0.0, Math.min(1.0, (coh + phi) / 2));
    // confianza: escala por |s-0.5| y coh
    const confidence = Math.max(0, Math.min(1, Math.abs(s - 0.5) * 2 * (0.6 + 0.4 * coh)));
    return { combined, confidence };
  }

  _decisionFromScore(score) {
    if (score > 0.6) return 'BUY';
    if (score < 0.4) return 'SELL';
    return 'HOLD';
  }

  async getPredictions() {
    try {
      const sentiment = this.getSentimentScore ? (await this.getSentimentScore()) : { score: 0.5, perSymbol: {}, gating: { sizeAdj: 1.0, capAdj: 1.0 } };
      const orch = this.getOrchState ? (await this.getOrchState()) : { coherence: 1.0, phi: 0.0 };
      const perSymbol = sentiment?.perSymbol || {};

      const predictions = [];
      for (const sym of this.symbols) {
        const base = sym.toUpperCase().replace(/USDT$/, '');
        const ss = Number(perSymbol?.[base]?.score || sentiment.score || 0.5);
        const mix = this._combineScores(ss, orch);
        const decision = this._decisionFromScore(mix.combined);
        const expectedEdge = (mix.combined - 0.5) * 2; // [-1,1] proxy
        predictions.push({ symbol: base, decision, confidence: Number(mix.confidence.toFixed(3)), expectedEdge: Number(expectedEdge.toFixed(3)), components: perSymbol?.[base]?.components || {} });
      }
      // Ordenar por confianza * |edge|
      predictions.sort((a,b)=> (Math.abs(b.expectedEdge)*b.confidence) - (Math.abs(a.expectedEdge)*a.confidence));

      // Agregada de cartera
      const mix = this._combineScores(sentiment.score, orch);
      const portfolio = {
        decision: this._decisionFromScore(mix.combined),
        confidence: Number(mix.confidence.toFixed(3)),
        score: Number(mix.combined.toFixed(3)),
        gating: sentiment?.gating || { sizeAdj: 1.0, capAdj: 1.0 }
      };

      return { success: true, portfolio, predictions };
    } catch (e) {
      return { success: true, portfolio: { decision: 'HOLD', confidence: 0.0, score: 0.5, gating: { sizeAdj: 1.0, capAdj: 1.0 } }, predictions: [] };
    }
  }
}

module.exports = PredictionService;



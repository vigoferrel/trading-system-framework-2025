
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

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



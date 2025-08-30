
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
 * BinanceSentimentService
 * Servicio de sentimiento usando solamente datos públicos de Binance (Spot/Futures/Options si disponibles)
 * Evita dependencias externas. Usa fetch nativo/dinámico.
 */

const fs = require('fs');
const path = require('path');

class BinanceSentimentService {
  constructor(opts = {}) {
    this.binanceConnector = opts.binanceConnector || null;
    this.symbols = Array.isArray(opts.symbols) ? opts.symbols.slice() : ['BTC', 'ETH', 'BNB'];
    this.cacheDir = opts.cacheDir || path.join(__dirname, 'logs');
  }

  _fut(sym) { return sym.toUpperCase().endsWith('USDT') ? sym.toUpperCase() : `${sym.toUpperCase()}USDT`; }
  _spot(sym) { return this._fut(sym); }

  async _fetchJson(urlStr) {
    try {
      const useFetch = (typeof fetch === 'function') ? fetch : (await import('node-fetch')).default;
      const r = await useFetch(urlStr);
      if (!r || !r.ok) return null;
      return await r.json();
    } catch (_) { return null; }
  }

  async _getSpotPrice(symbol) {
    // Preferir conector si está disponible
    try {
      if (this.binanceConnector && typeof this.binanceConnector.getSymbolPrice === 'function') {
        const t = await this.binanceConnector.getSymbolPrice(this._spot(symbol));
        return Number(t?.price || t);
      }
    } catch (_) {}
    // Fallback público (fapi 24hr lastPrice para proxy)
    try {
      const j = await this._fetchJson(`https://api.binance.com/api/v3/ticker/price?symbol=${encodeURIComponent(this._spot(symbol))}`);
      return Number(j?.price || 0);
    } catch (_) { return 0; }
  }

  async _getFuturesTicker24h(symbol) {
    return await this._fetchJson(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${encodeURIComponent(this._fut(symbol))}`);
  }

  async _getBookTicker(symbol) {
    return await this._fetchJson(`https://fapi.binance.com/fapi/v1/ticker/bookTicker?symbol=${encodeURIComponent(this._fut(symbol))}`);
  }

  async _getFundingRateHistory(symbol, limit = 8) {
    return await this._fetchJson(`https://fapi.binance.com/fapi/v1/fundingRate?symbol=${encodeURIComponent(this._fut(symbol))}&limit=${encodeURIComponent(limit)}`);
  }

  async _getOpenInterest(symbol) {
    return await this._fetchJson(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${encodeURIComponent(this._fut(symbol))}`);
  }

  async collectShortTerm() {
    const out = { symbols: [], data: {}, ts: Date.now() };
    for (const base of this.symbols) {
      try {
        const sym = this._fut(base);
        const [spotPx, t24, bt, oi, fund] = await Promise.all([
          this._getSpotPrice(base),
          this._getFuturesTicker24h(base),
          this._getBookTicker(base),
          this._getOpenInterest(base),
          this._getFundingRateHistory(base, 8)
        ]);
        const lastPrice = Number(t24?.lastPrice || 0);
        const markBasis = (spotPx > 0 && lastPrice) ? ((lastPrice - spotPx) / spotPx) : 0; // basis relativo
        const bidQty = Number(bt?.bidQty || 0), askQty = Number(bt?.askQty || 0);
        const obImbalance = (bidQty + askQty) > 0 ? (bidQty - askQty) / (bidQty + askQty) : 0;
        const takerBuyVol = Number(t24?.takerBuyBaseAssetVolume || 0);
        const vol = Number(t24?.volume || 0);
        const takerImbalance = (vol > 0) ? (takerBuyVol / vol) - 0.5 : 0; // [-0.5, +0.5]
        const fundingNow = Array.isArray(fund) && fund.length ? Number(fund[fund.length - 1]?.fundingRate || 0) : 0;
        const fundingAvg = Array.isArray(fund) && fund.length ? (fund.reduce((s,x)=> s + Number(x?.fundingRate||0), 0) / fund.length) : 0;
        const oiNum = Number(oi?.openInterest || 0);

        out.symbols.push(base);
        out.data[base] = {
          spotPrice: spotPx, futuresPrice: lastPrice, basis: markBasis,
          orderbookImbalance: obImbalance, takerImbalance,
          volume24h: vol, takerBuyVolume: takerBuyVol,
          fundingNow, fundingAvg,
          openInterest: oiNum
        };
      } catch (_) { /* tolerante */ }
    }
    this._persist('sentiment-short.json', out);
    return out;
  }

  async collectLongTerm() {
    // MVP: derivar señales lentas básicas con datos 24h y OI; extender a klines D1 en siguientes iteraciones
    const short = await this.collectShortTerm();
    const out = { symbols: short.symbols, data: {}, ts: Date.now() };
    for (const base of short.symbols) {
      try {
        const d = short.data[base] || {};
        // Proxies simples: tendencia por basis medio y funding medio; posición frente a rango 24h
        const trendProxy = Math.tanh((Number(d?.basis || 0) + Number(d?.fundingAvg || 0)) * 10);
        out.data[base] = {
          trendProxy,
          oiLevel: Number(d?.openInterest || 0)
        };
      } catch (_) {}
    }
    this._persist('sentiment-long.json', out);
    return out;
  }

  computeScore(short, long) {
    try {
      const syms = short?.symbols || [];
      const scores = {};
      for (const base of syms) {
        const s = short?.data?.[base] || {};
        const l = long?.data?.[base] || {};
        // Normalizaciones toscas y robustas
        const fundingBias = Math.max(-0.01, Math.min(0.01, Number(s?.fundingAvg || 0))) / 0.01; // [-1,1]
        const basisZ = Math.max(-0.02, Math.min(0.02, Number(s?.basis || 0))) / 0.02; // [-1,1]
        const ob = Number(s?.orderbookImbalance || 0); // [-1,1]
        const tk = Math.max(-0.5, Math.min(0.5, Number(s?.takerImbalance || 0))) * 2; // [-1,1]
        const trend = Math.max(-1, Math.min(1, Number(l?.trendProxy || 0)));
        const components = { fundingBias, basisZ, ob, tk, trend };
        // Peso corto plazo > largo plazo
        const score = 0.6 * (0.4*fundingBias + 0.3*basisZ + 0.2*ob + 0.1*tk) + 0.4 * (trend);
        scores[base] = { score: Math.max(0, Math.min(1, (score+1)/2 )), components };
      }
      // Agregado cartera: media de scores simbólicos
      const vals = Object.values(scores).map(x=> Number(x?.score || 0));
      const portfolioScore = vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length) : 0.5;
      return { portfolioScore, perSymbol: scores };
    } catch (_) {
      return { portfolioScore: 0.5, perSymbol: {} };
    }
  }

  async getSentimentScore() {
    const short = await this.collectShortTerm();
    const long = await this.collectLongTerm();
    const computed = this.computeScore(short, long);
    const gating = this._deriveGating(computed.portfolioScore);
    const payload = { score: computed.portfolioScore, perSymbol: computed.perSymbol, gating, ts: Date.now() };
    this._persist('sentiment-score.json', payload);
    return payload;
  }

  _deriveGating(score) {
    // Umbrales calibrables
    const t1 = 0.35, t2 = 0.65;
    let sizeAdj = 1.0, capAdj = 1.0;
    if (score < t1) { sizeAdj = 0.7; capAdj = 0.85; }
    else if (score > t2) { sizeAdj = 1.1; capAdj = 1.0; }
    return { sizeAdj, capAdj };
  }

  _persist(name, obj) {
    try {
      if (!fs.existsSync(this.cacheDir)) fs.mkdirSync(this.cacheDir, { recursive: true });
      fs.writeFileSync(path.join(this.cacheDir, name), JSON.stringify(obj, null, 2), 'utf8');
    } catch (_) {}
  }
}

module.exports = BinanceSentimentService;



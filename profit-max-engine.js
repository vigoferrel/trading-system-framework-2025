
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
 * ProfitMaxEngine - Motor de trading para maximizar profit
 *
 * - Lee el último `global-overview-*.json` generado por options-data-fetcher
 * - Cruza con señales del sistema (si se proveen) para robustecer dirección
 * - Prioriza (PPD/USD) * Hook * ZBoost y limita por presupuesto y riesgo
 * - Ejecuta en modo simulación por defecto; si existe conector de Binance con
 *   método de orden Futuro, puede ejecutar real
 */
const fs = require('fs');
const path = require('path');

class ProfitMaxEngine {
  constructor(opts = {}) {
    this.logsDir = opts.logsDir || path.join(__dirname, 'logs');
    this.objective = opts.objective || 'profit'; // 'profit' | 'leverage'
    this.maxPositions = opts.maxPositions || 5;
    this.dryRun = opts.dryRun !== false; // true por defecto
    this.symbolCaps = opts.symbolCaps || {}; // { BTCUSDT: 0.3 } fracción del budget
    this.intervalSec = 120;
    this.timer = null;
    this.binanceConnector = opts.binanceConnector || null;
    this.lastPlan = { timestamp: 0, selected: [], budgetUSD: 0, usedUSD: 0 };
    this.placed = new Map(); // symbol -> timestamp
    this.history = [];
    this.maxHistory = 200;
    this.positions = new Map(); // symbol -> { side, qty, entryPrice, notionalUSD, lastPrice }
    this.pnlHistory = [];
    this.maxPnlHistory = 500;
    this.getLastPrice = typeof opts.getLastPrice === 'function' ? opts.getLastPrice : async () => 0;
    this.getSignals = typeof opts.getSignals === 'function' ? opts.getSignals : async () => [];
    this.getAccountSnapshot = typeof opts.getAccountSnapshot === 'function' ? opts.getAccountSnapshot : async () => ({});
    this.getOverview = typeof opts.getOverview === 'function' ? opts.getOverview : null;
    this.getSentimentScore = typeof opts.getSentimentScore === 'function' ? opts.getSentimentScore : null;

    // ORCH-OR inspired gating and exposure controller
    this.orchConfig = {
      enabled: opts.orchEnabled !== false,
      coherenceThreshold: Number(opts.orchCoherenceThreshold || 0.618),
      explorationMaxAdj: Number(opts.orchExplorationMaxAdj || 0.1)
    };
    this.orchState = { coherence: 1.0, phi: 0.0, gatingActive: false, sizeAdj: 1.0, capAdj: 1.0 };
    this.sentimentState = { score: 0.5, sizeAdj: 1.0, capAdj: 1.0 };
  }

  start(intervalSec = 120) {
    this.stop();
    this.intervalSec = Math.max(30, parseInt(intervalSec, 10) || 120);
    const run = async () => {
      try { await this.runOnce(); } catch (_) {}
    };
    run();
    this.timer = setInterval(run, this.intervalSec * 1000);
    return { running: true, intervalSec: this.intervalSec };
  }

  stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    return { running: false };
  }

  getStatus() {
    return {
      running: !!this.timer,
      intervalSec: this.intervalSec,
      objective: this.objective,
      dryRun: this.dryRun,
      lastPlan: this.lastPlan,
      placedCount: this.placed.size,
      orchOr: this.orchState
    };
  }

  async runOnce() {
    let overview = null;
    try { overview = this.getOverview ? await this.getOverview() : null; } catch(_) { overview = null; }
    // Si viene envuelto con {success, ...}
    const ov = (overview && overview.success) ? overview : overview;
    const allocation = ov?.allocation || {};
    const budgetUSD = Number(allocation.portfolioCapitalUSD || ov?.totals?.budgetUSD || 0);
    const perTradeUSD = Number(allocation.capitalPerTradeUSD || 0) || 50;
    const selected = Array.isArray(ov?.leverageMaxPortfolio?.selected)
      ? ov.leverageMaxPortfolio.selected
      : [];

    // Fallback: tratar de leer selected simplificado en root del overview si existe
    const rootSel = Array.isArray(ov?.selected) ? ov.selected : [];
    const universe = (selected.length ? selected : rootSel).map(s => this._normalizeSel(s));

    // Señales de apoyo (dirección)
    let signals = [];
    try { signals = await this.getSignals(); } catch (_) { signals = []; }
    const bestDirBySymbol = this._deriveDirectionalBias(signals);

    // Ranking
    const ranked = universe
      .map(u => ({
        ...u,
        score: this._score(u),
        dirBias: bestDirBySymbol[u.underlying] || 'HOLD'
      }))
      .sort((a,b)=> b.score - a.score);

    // ORCH-OR gating (coherencia y phi) sobre el universo
    this._computeOrchGating(universe);
    // Sentiment gating (portfolio score) desde BinanceSentimentService si está disponible
    await this._computeSentimentGating();

    // Construcción de plan hasta maxPositions y presupuesto (con ajustes ORCH-OR)
    const plan = [];
    let usedUSD = 0;
    const capBySymbol = {};
    for (const it of ranked) {
      if (plan.length >= this.maxPositions) break;
      // Ajuste de cap agregado combinando ORCH-OR y Sentiment
      const capTotalAdj = Number(this.orchState?.capAdj || 1.0) * Number(this.sentimentState?.capAdj || 1.0);
      const adjBudget = Math.max(0, budgetUSD * capTotalAdj);
      const remain = Math.max(0, adjBudget - usedUSD);
      if (remain <= 0) break;
      const capSymFrac = this.symbolCaps[it.underlying] || 0.5; // por defecto hasta 50% del trade unit
      let ticketUSD = Math.min(perTradeUSD, remain, perTradeUSD * (1 + capSymFrac));
      // Aplicar ajuste de tamaño combinando ORCH-OR y Sentiment
      const sizeAdj = Number(this.orchState?.sizeAdj || 1.0) * Number(this.sentimentState?.sizeAdj || 1.0);
      ticketUSD = Math.max(0, ticketUSD * sizeAdj);
      const side = this._decideSide(it, bestDirBySymbol[it.underlying]);
      const route = it.route || 'post-only';
      plan.push({ symbol: it.underlying, side, ticketUSD: ticketUSD, route, src: it });
      usedUSD += ticketUSD;
    }

    const timestamp = Date.now();
    this.lastPlan = { timestamp, selected: plan, budgetUSD, usedUSD };

    // Registrar historia (PPD estimado ponderado por tamaño del ticket)
    const ppdSum = plan.reduce((sum, p) => {
      const base = Number(p?.src?.ppd || 0);
      const denom = Number(p?.src?.spend || 0) || Number(p?.ticketUSD || 1);
      const w = Math.max(0, Math.min(1.5, Number(p.ticketUSD || 0) / denom));
      return sum + base * w;
    }, 0);
    this.history.push({ t: timestamp, ppd: Number(ppdSum.toFixed(2)), usedUSD, budgetUSD, count: plan.length });
    if (this.history.length > this.maxHistory) this.history.shift();

    // Ejecución
    for (const p of plan) {
      await this._executeFuturesTicket(p);
    }

    return this.lastPlan;
  }

  _normalizeSel(s) {
    // Convierte item selected del overview a un modelo común
    const underlying = (s.symbol || '').toUpperCase().replace(/C$|P$/,'').replace(/-?\d+$/,'') || 'BTCUSDT';
    return {
      underlying,
      type: (s.type || '').toUpperCase(),
      ppd: Number(s.ppd || s.profitPerDay || 0),
      spend: Number(s.spend || s.premiumUSD || s.contracts?.totalPremiumUSD || 0),
      leverage: Number(s.leverage || s.M || 0),
      hookWheelFactor: Number(s.hookWheelFactor || s.hook || 1),
      zBoost: Number(s.zBoost || 1),
      var: Number(s.var || 0),
      cvar: Number(s.cvar || 0),
      route: s.route || 'post-only'
    };
  }

  _score(u) {
    const base = this.objective === 'leverage'
      ? (u.leverage || 0)
      : (Number(u.ppd || 0));
    const riskTerm = 1 / (1 + 3 * Math.max(0, (u.var || 0) + (u.cvar || 0)));
    const hook = Math.max(0.5, Math.min(2.0, u.hookWheelFactor || 1));
    const z = Math.max(0.8, Math.min(1.8, u.zBoost || 1));
    return base * hook * z * riskTerm;
  }

  _decideSide(item, dirBias) {
    // Si viene de CALL preferir LONG, PUT => SHORT. Sesgo de señales prioriza
    if (dirBias === 'BUY') return 'BUY';
    if (dirBias === 'SELL') return 'SELL';
    if ((item.type || '').includes('CALL')) return 'BUY';
    if ((item.type || '').includes('PUT')) return 'SELL';
    return 'BUY';
  }

  async _executeFuturesTicket(ticket) {
    const key = `${ticket.symbol}:${ticket.side}`;
    const now = Date.now();
    if (this.placed.has(key) && now - this.placed.get(key) < 60_000) {
      return; // anti-duplicado 60s
    }
    this.placed.set(key, now);

    // Determinar tamaño por notional (USD)
    try {
      const snapshot = await this.getAccountSnapshot();
      const avail = Number(snapshot?.futuresAvailableUSDT || snapshot?.availableUSDT || 0);
      if (avail && ticket.ticketUSD > avail) {
        ticket.ticketUSD = Math.max(5, avail * 0.95);
      }
    } catch (_) {}

    // Simular fill inmediato en DRY y actualizar posiciones
    if (this.dryRun || !this.binanceConnector || typeof this.binanceConnector.createFuturesOrder !== 'function') {
      const fillPrice = await this._getPrice(ticket.symbol);
      this._upsertPosition(ticket, fillPrice);
      this._logExec({ mode: 'DRY', ticket, fillPrice });
      return { success: true, dryRun: true };
    }

    try {
      const params = {
        symbol: ticket.symbol,
        side: ticket.side, // BUY | SELL
        type: 'MARKET',
        notional: Number(ticket.ticketUSD.toFixed(2))
      };
      const res = await this.binanceConnector.createFuturesOrder(params);
      const fillPrice = await this._getPrice(ticket.symbol);
      this._upsertPosition(ticket, fillPrice);
      this._logExec({ mode: 'LIVE', ticket, res, fillPrice });
      return { success: true };
    } catch (e) {
      this._logExec({ mode: 'LIVE_ERROR', ticket, error: e?.message || String(e) });
      return { success: false, error: e?.message || String(e) };
    }
  }

  _logExec(payload) {
    try {
      const fn = path.join(this.logsDir, `profit-engine-${new Date().toISOString().slice(0,10)}.log`);
      fs.appendFileSync(fn, JSON.stringify({ t: Date.now(), ...payload }) + '\n');
    } catch (_) {}
  }
  
  // === ORCH-OR helpers ===
  _computeOrchGating(universe) {
    try {
      if (!this.orchConfig.enabled) { this.orchState = { coherence: 1.0, phi: 0.0, gatingActive: false, sizeAdj: 1.0, capAdj: 1.0 }; return; }
      const ppds = (universe || []).map(u => Number(u.ppd || 0)).filter(v => Number.isFinite(v));
      const n = ppds.length;
      let coherence = 1.0;
      if (n >= 3) {
        const mean = ppds.reduce((a,b)=>a+b,0) / Math.max(1, n);
        const varr = ppds.reduce((s,v)=> s + Math.pow(v - mean, 2), 0) / Math.max(1, n-1);
        const std = Math.sqrt(Math.max(0, varr));
        const scale = Math.max(1e-6, Math.abs(mean) + 1);
        // Coherencia: mayor cuando la dispersión relativa es baja
        coherence = 1 / (1 + (std / scale));
      }
      // Phi proxy: diversidad de símbolos (Shannon) normalizada
      const syms = (universe || []).map(u => String(u.underlying || 'SYM'));
      const counts = syms.reduce((acc,s)=>{ acc[s]=(acc[s]||0)+1; return acc; }, {});
      const total = syms.length || 1;
      let shannon = 0;
      Object.values(counts).forEach(c => { const p = Number(c)/total; if (p>0) shannon += -p * Math.log(p); });
      const maxShannon = Math.log(Math.max(1, Object.keys(counts).length));
      const phi = maxShannon > 0 ? (shannon / maxShannon) : 0;

      const gatingActive = coherence < this.orchConfig.coherenceThreshold;
      // Ajuste de tamaño: si gating, reducir 50%; sino 1.0 +/- pequeña exploración
      let sizeAdj = gatingActive ? 0.5 : 1.0;
      // Exploración acotada: pequeña perturbación determinística basada en tiempo
      try {
        const t = Date.now() / 10000;
        const wiggle = Math.sin(t) * this.orchConfig.explorationMaxAdj; // +/- maxAdj
        sizeAdj = Math.max(0, sizeAdj * (1 + wiggle));
      } catch(_) {}
      // Cap agregado: si gating, reducir 20%
      const capAdj = gatingActive ? 0.8 : 1.0;

      this.orchState = {
        coherence: Number(coherence.toFixed(6)),
        phi: Number(phi.toFixed(6)),
        gatingActive,
        sizeAdj: Number(sizeAdj.toFixed(6)),
        capAdj: Number(capAdj.toFixed(6))
      };
    } catch (_) {
      this.orchState = { coherence: 1.0, phi: 0.0, gatingActive: false, sizeAdj: 1.0, capAdj: 1.0 };
    }
  }

  async _computeSentimentGating() {
    try {
      if (typeof this.getSentimentScore !== 'function') { this.sentimentState = { score: 0.5, sizeAdj: 1.0, capAdj: 1.0 }; return; }
      const s = await this.getSentimentScore();
      const score = Number(s?.score || 0.5);
      const sz = Number((s?.gating && s.gating.sizeAdj) || 1.0);
      const cp = Number((s?.gating && s.gating.capAdj) || 1.0);
      this.sentimentState = { score, sizeAdj: Math.max(0, sz), capAdj: Math.max(0, cp) };
    } catch (_) {
      this.sentimentState = { score: 0.5, sizeAdj: 1.0, capAdj: 1.0 };
    }
  }

  _readLatestOverview() {
    try {
      const files = fs.readdirSync(this.logsDir).filter(f => f.startsWith('global-overview-') && f.endsWith('.json'));
      if (!files.length) return null;
      files.sort((a,b)=> fs.statSync(path.join(this.logsDir,b)).mtimeMs - fs.statSync(path.join(this.logsDir,a)).mtimeMs);
      const full = path.join(this.logsDir, files[0]);
      return JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (_) { return null; }
  }

  _deriveDirectionalBias(signals) {
    const out = {};
    for (const s of (signals || [])) {
      const sym = (s.symbol || '').toUpperCase().replace(/USDT$/,'') + 'USDT';
      const act = (s.action || s.type || '').toUpperCase();
      if (act === 'BUY' || act === 'SELL') out[sym] = act;
    }
    return out;
  }

  getHistory() {
    return { success: true, data: this.history.slice(-this.maxHistory) };
  }

  clearHistory() {
    this.history = [];
    return { success: true, cleared: true };
  }

  async _getPrice(symbol) {
    try {
      return await this.getLastPrice(symbol);
    } catch (_) { return 0; }
  }

  _upsertPosition(ticket, fillPrice) {
    const price = Number(fillPrice || 0);
    if (!price || !isFinite(price)) return;
    const notional = Number(ticket.ticketUSD || 0);
    const qty = notional > 0 ? notional / price : 0;
    const key = ticket.symbol.toUpperCase();
    const side = (ticket.side || 'BUY').toUpperCase();
    const sign = side === 'BUY' ? 1 : -1;
    const existing = this.positions.get(key);
    if (!existing) {
      this.positions.set(key, { side, qty: qty * sign, entryPrice: price, notionalUSD: notional, lastPrice: price });
      return;
    }
    // Promediar precio y acumular qty con signo
    const newQty = existing.qty + qty * sign;
    if (Math.abs(newQty) < 1e-8) {
      // cerrado
      this.positions.delete(key);
      return;
    }
    const currentValue = existing.entryPrice * existing.qty;
    const addValue = price * (qty * sign);
    const avgPrice = (currentValue + addValue) / newQty;
    this.positions.set(key, {
      side: newQty >= 0 ? 'BUY' : 'SELL',
      qty: newQty,
      entryPrice: Math.abs(avgPrice),
      notionalUSD: Math.abs(newQty) * price,
      lastPrice: price
    });
  }

  async markToMarket() {
    let totalUnrealized = 0;
    let totalNotional = 0;
    const positionsOut = [];
    for (const [sym, pos] of this.positions.entries()) {
      const px = await this._getPrice(sym);
      if (!px) continue;
      const qtyAbs = Math.abs(pos.qty);
      const sideSign = pos.qty >= 0 ? 1 : -1; // BUY positivo, SELL negativo
      const unreal = (px - pos.entryPrice) * sideSign * qtyAbs;
      const notional = qtyAbs * px;
      totalUnrealized += unreal;
      totalNotional += notional;
      positionsOut.push({ symbol: sym, side: pos.qty >= 0 ? 'LONG' : 'SHORT', qty: qtyAbs, entry: pos.entryPrice, last: px, unrealized: unreal });
    }
    const snapshot = { t: Date.now(), totalUnrealized: Number(totalUnrealized.toFixed(2)), totalNotional: Number(totalNotional.toFixed(2)) };
    this.pnlHistory.push(snapshot);
    if (this.pnlHistory.length > this.maxPnlHistory) this.pnlHistory.shift();
    return { ...snapshot, positions: positionsOut };
  }

  async getPnlSnapshot() {
    return await this.markToMarket();
  }

  getPnlHistory() {
    return { success: true, data: this.pnlHistory.slice(-this.maxPnlHistory) };
  }

  clearPnlHistory() {
    this.pnlHistory = [];
    return { success: true, cleared: true };
  }
}

module.exports = ProfitMaxEngine;



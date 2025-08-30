"use strict";

// LLM GEMINI SUPREME ORCHESTRATOR
// Integra señales neuronales, sistemas cuánticos (SRONA), y workers en background
// Usa constantes primas: z = 9 + 16i, ln(7919), 888 MHz

const path = require("path");
const fs = require("fs");
const { EventEmitter } = require("events");
const { Worker } = require("worker_threads");
const { spawn } = require("child_process");

// Componentes locales
const { LeonardoLeverageMatrix } = require(path.join(__dirname, "..", "LeonardoLeverageMatrix.js"));
const { SymbolsLoader } = require("./SymbolsLoader.js");

// =============================
// Constantes Primas y Utilidades
// =============================
const PRIME = {
  Z_REAL: 9,
  Z_IMAG: 16,
  UF: 7919, // primo zurita
  LAMBDA: Math.log(7919),
  RESONANCE_MHZ: 888,
  get Z_MAG() { return Math.hypot(this.Z_REAL, this.Z_IMAG); },
  get Z_PHASE() { return Math.atan2(this.Z_IMAG, this.Z_REAL); }
};

class TTLCache {
  constructor(ttlMs = 30000, max = 500) {
    this.ttl = ttlMs;
    this.max = max;
    this.map = new Map();
  }
  set(key, value) {
    if (this.map.size >= this.max) {
      const first = this.map.keys().next().value;
      if (first !== undefined) this.map.delete(first);
    }
    this.map.set(key, { value, expires: Date.now() + this.ttl });
  }
  get(key) {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expires) {
      this.map.delete(key);
      return undefined;
    }
    return entry.value;
  }
}

function complexTransform(x) {
  const phase = PRIME.LAMBDA * x;
  const real = PRIME.Z_REAL * Math.cos(phase);
  const imag = PRIME.Z_IMAG * Math.sin(phase);
  const mag = Math.hypot(real, imag);
  return { real, imag, mag, normalized: mag / (PRIME.Z_MAG || 1) };
}

// ==========================================
// Orquestador Supremo - Clase principal
// ==========================================
class LLMSupremeOrchestrator extends EventEmitter {
  constructor(config = {}) {
    super();
    
    // INICIALIZAR CARGADOR DINÁMICO DE SÍMBOLOS
    this.symbolsLoader = new SymbolsLoader();
    
    // FALLBACK: Lista básica si falla la carga dinámica
    const FALLBACK_SYMBOLS = [
      // TIER 1: LA TRINIDAD SUPREMA (3)
      "BTCUSDT", "ETHUSDT", "BNBUSDT",
      // TIER 2: LA CORTE NOBLE (12)
      "SOLUSDT", "XRPUSDT", "DOGEUSDT", "ADAUSDT", "AVAXUSDT", "DOTUSDT",
      "LINKUSDT", "MATICUSDT", "LTCUSDT", "BCHUSDT", "ATOMUSDT", "NEARUSDT",
      // TIER 3: LA NOBLEZA POPULAR (20)
      "UNIUSDT", "FILUSDT", "TRXUSDT", "ETCUSDT", "XLMUSDT", "ICPUSDT",
      "VETUSDT", "FTMUSDT", "ALGOUSDT", "SANDUSDT", "MANAUSDT", "AXSUSDT",
      "THETAUSDT", "GRTUSDT", "EOSUSDT", "AAVEUSDT", "MKRUSDT", "COMPUSDT",
      "SNXUSDT", "SUSHIUSDT",
      // TIER 4: LOS EMERGENTES (14)
      "APTUSDT", "SUIUSDT", "ARBUSDT", "OPUSDT", "INJUSDT", "STXUSDT",
      "TIAUSDT", "SEIUSDT", "ORDIUSDT", "1000PEPEUSDT", "1000FLOKIUSDT",
      "WIFUSDT", "BONKUSDT", "1000SATSUSDT",
      // TIER 5: LOS ESPECIALISTAS (16)
      "CRVUSDT", "LRCUSDT", "ENJUSDT", "CHZUSDT", "BATUSDT", "ZRXUSDT",
      "RENUSDT", "STORJUSDT", "CTKUSDT", "BNTUSDT", "DYDXUSDT", "UMAUSDT",
      "BANDUSDT", "KAVAUSDT", "IOTAUSDT", "ONTUSDT",
      // TIER 6: LOS VISIONARIOS (12)
      "APEUSDT", "GALAUSDT", "GMEUSDT", "IMXUSDT", "LOOKSUSDT", "MINAUSDT",
      "FLOWUSDT", "CHRUSDT", "TLMUSDT", "ALPACAUSDT", "YGGUSDT", "GHSTUSDT"
    ];
    
    this.config = {
      symbols: FALLBACK_SYMBOLS,
      cols: 8,
      cacheTtlMs: 20000,
      aiWeight: 0.25,
      vigoWeight: 0.25,
      coreWeight: 0.50,
      budgetUSD: 1000,
      risk: {
        baseStop: 0.02,
        baseTake: 0.05,
        maxLeverage: 25
      },
      srona: {
        pythonBin: "python", // o python3
        inversePrimeScript: path.join(__dirname, "..", "quantum", "SRONA_Inverse_Prime_Transposition.py"),
        launchBackground: path.join(__dirname, "..", "quantum", "launch-srona-multi-whale-background.js"),
        logsDir: path.join(__dirname, "..", "logs")
      },
      workers: {
        quantumScorer: path.join(__dirname, "..", "workers", "quantum-worker.js"),
      },
      ...config
    };

    this.cache = new TTLCache(this.config.cacheTtlMs);
    this.background = {
      sronaPid: null,
      processes: new Map(), // name -> { pid, startedAt }
    };

    // Módulos de riesgo
    this.leoMatrix = new LeonardoLeverageMatrix();
  }

  // ======================================
  // 1) Capa de orquestación cuántica
  // ======================================
  async scoreSymbols({ aiScores = {}, vigoScores = {} } = {}) {
    const cacheKey = `scoreSymbols:${JSON.stringify({ aiScores, vigoScores })}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const workerPath = this.config.workers.quantumScorer;
    const symbols = this.config.symbols;

    const payload = {
      task: "scoreSymbols",
      symbols,
      weights: {
        coreWeight: this.config.coreWeight,
        aiWeight: this.config.aiWeight,
        vigoWeight: this.config.vigoWeight
      },
      aiScores,
      vigoScores,
      universalFrequency: PRIME.UF,
      cols: this.config.cols
    };

    const result = await new Promise((resolve, reject) => {
      const w = new Worker(workerPath);
      let settled = false;
      w.once("message", (msg) => {
        settled = true;
        w.terminate();
        if (msg && msg.ok) resolve(msg.data);
        else reject(new Error(msg?.error || "worker error"));
      });
      w.once("error", (err) => {
        if (!settled) reject(err);
      });
      w.postMessage(payload);
    });

    this.cache.set(cacheKey, result);
    return result; // [{symbol, score}]
  }

  async optimizePortfolio({ aiScores = {}, vigoScores = {}, budgetUSD } = {}) {
    const budget = Number(budgetUSD ?? this.config.budgetUSD) || 1000;
    const scored = await this.scoreSymbols({ aiScores, vigoScores });

    const ranked = [...scored].sort((a, b) => b.score - a.score);
    const enriched = ranked.map((row, idx) => {
      const t = complexTransform(row.score + idx * 0.01);
      const primeBoost = Math.min(1, Math.abs(Math.sin(t.mag)));
      return { ...row, primeBoost };
    });

    // Pesos proporcionales al score y primeBoost
    const weights = enriched.map(r => Math.max(0, r.score) * (1 + 0.2 * r.primeBoost));
    const weightSum = weights.reduce((a, b) => a + b, 0) || 1;

    // Decisiones por símbolo usando LeonardoLeverageMatrix para riesgo
    const decisions = enriched.map((r, i) => {
      const w = weights[i] / weightSum;
      const allocationUSD = budget * w;
      const leverage = this.leoMatrix.calculateOptimalLeverage({
        symbol: r.symbol,
        volatility: 0.03 + 0.02 * (1 - r.score), // heurística si no hay vol real
        edge: r.score,
        liquidity: 0.75,
        momentum: 0
      });
      const { stopLossPct, takeProfitPct } = this.leoMatrix.recommendStopsAndTargets({ volatility: 0.03, leverage });
      return {
        symbol: r.symbol,
        score: r.score,
        primeBoost: r.primeBoost,
        allocationUSD: Number(allocationUSD.toFixed(2)),
        leverage,
        stopLossPct: Number(stopLossPct.toFixed(4)),
        takeProfitPct: Number(takeProfitPct.toFixed(4))
      };
    });

    return {
      primes: { z: { real: PRIME.Z_REAL, imag: PRIME.Z_IMAG, magnitude: PRIME.Z_MAG, phase: PRIME.Z_PHASE }, lambda: PRIME.LAMBDA, resonanceMHz: PRIME.RESONANCE_MHZ },
      ranked,
      decisions
    };
  }

  // ======================================
  // 2) Integración con SRONA (Python)
  // ======================================
  async runSronaInversePrime({ carnadaUSD = 10 } = {}) {
    const script = this.config.srona.inversePrimeScript;
    return await new Promise((resolve) => {
      const env = { ...process.env, CARNADA_USD: String(carnadaUSD) };
      const py = spawn(this.config.srona.pythonBin, [script], { cwd: path.dirname(script), env });
      let out = ""; let err = "";
      py.stdout.on("data", d => out += d.toString());
      py.stderr.on("data", d => err += d.toString());
      py.on("close", code => resolve({ code, stdout: out, stderr: err }));
    });
  }

  // ==================================================
  // 3) Control y monitoreo de procesos background
  // ==================================================
  async launchSronaBackground() {
    const launcher = this.config.srona.launchBackground;
    return await new Promise((resolve) => {
      const child = spawn(process.execPath, [launcher], { detached: true, stdio: "ignore" });
      child.unref();
      this.background.sronaPid = child.pid;
      this.background.processes.set("srona", { pid: child.pid, startedAt: Date.now(), launcher });
      resolve({ ok: true, pid: child.pid, launcher });
    });
  }

  stopBackgroundByName(name) {
    const meta = this.background.processes.get(name);
    if (!meta) return { ok: false, error: "not-found" };
    try {
      process.kill(meta.pid, "SIGTERM");
      this.background.processes.delete(name);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e?.message };
    }
  }

  getBackgroundStatus() {
    const status = {};
    for (const [name, meta] of this.background.processes.entries()) {
      status[name] = { pid: meta.pid, startedAt: meta.startedAt, launcher: meta.launcher };
    }
    return status;
  }

  tryReadRecentLogLines(filename, maxBytes = 8192) {
    try {
      const p = path.isAbsolute(filename) ? filename : path.join(this.config.srona.logsDir, filename);
      const stat = fs.statSync(p);
      const start = Math.max(0, stat.size - maxBytes);
      const fd = fs.openSync(p, "r");
      const buf = Buffer.alloc(stat.size - start);
      fs.readSync(fd, buf, 0, buf.length, start);
      fs.closeSync(fd);
      return buf.toString("utf8");
    } catch {
      return "";
    }
  }
}

module.exports = { LLMSupremeOrchestrator, PRIME, complexTransform };


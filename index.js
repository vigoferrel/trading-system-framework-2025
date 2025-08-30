
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

require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const config = require('./config');
const { validateAndInject } = require('./key-manager');
const http = require('http');
const { logger } = require('./quantum-options-specialist/src/utils/logger');
const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');
const QuantumBinanceSystem = require('./quantum-binance-system');

// [NIGHT] SISTEMA DE CAPTURA INTELIGENTE INTEGRADO
const IntelligentDataCaptureSystem = require('./intelligent-data-capture-system');
const IntelligentDataCoreAdapter = require('./intelligent-data-core-adapter');

let WebSocketLib = null;
try { WebSocketLib = require('ws'); } catch (e) { console.warn('[WS] Módulo ws no disponible, se usará solo SSE'); }

// AI/ML (opcional, activable por flag)
const AI_ML_ENABLED = process.env.AI_ML_ENABLED === 'true';
let aiMlSystem = null;
let aiMlAvailable = false;
if (AI_ML_ENABLED) {
  try {
    // Cargar de forma perezosa para evitar fallos si faltan dependencias
    // Requiere: @tensorflow/tfjs-node, natural, brain.js
    const QuantumAIMLSystem = require('./quantum-ai-ml-system');
    aiMlSystem = new QuantumAIMLSystem({
      predictionInterval: Number(process.env.AI_ML_PREDICTION_INTERVAL_MS || 2000),
      learningInterval: Number(process.env.AI_ML_LEARNING_INTERVAL_MS || 60000),
      optimizationInterval: Number(process.env.AI_ML_OPTIMIZATION_INTERVAL_MS || 300000)
    });
    aiMlAvailable = true;
    // No llamamos start() aún; lo exponemos vía endpoint y lo iniciamos al arrancar el servidor para métricas periódicas
    aiMlSystem.start();
    logger.info('AI/ML System habilitado y en ejecución (flag AI_ML_ENABLED=true)');
  } catch (err) {
    console.warn('[AI/ML] No disponible. Sugerencia: npm i @tensorflow/tfjs-node natural brain.js');
    console.warn('[AI/ML] Error al cargar:', err.message);
    aiMlAvailable = false;
  }
}

// VigoFutures (opcional) - HABILITADO DESDE VARIABLE DE ENTORNO
const VIGO_FUTURES_ENABLED = process.env.VIGO_FUTURES_ENABLED === 'true' || process.env.VIGO_FUTURES_ENABLED === true;
let vigoFutures = null;
let vigoAvailable = false;
let vigoPort = Number(process.env.VIGO_FUTURES_PORT || 5501);
if (VIGO_FUTURES_ENABLED) {
  try {
    const BotFuturos = require('./VigoFutures/bot-futuros/futures-bot-wrapper');
    vigoFutures = new BotFuturos();
    // Arrancar su servidor interno (puerto configurado en su propio config)
    vigoFutures.start().then(() => {
      vigoAvailable = true;
      logger.info(`VigoFutures habilitado en puerto ${vigoPort}`);
    }).catch((err) => {
      console.warn('[VigoFutures] No se pudo iniciar:', err?.message || err);
      vigoAvailable = false;
    });
  } catch (err) {
    console.warn('[VigoFutures] No disponible. Verifica dependencias de VigoFutures/bot-futuros');
    console.warn('[VigoFutures] Error al cargar:', err.message);
    vigoAvailable = false;
  }
}

// Create a simple router (supports multiple methods per path)
const router = {
  routes: {}, // path -> { GET: handler, POST: handler, ... }
  
  get(path, handler) {
    if (!this.routes[path]) this.routes[path] = {};
    this.routes[path]['GET'] = handler;
  },
  
  post(path, handler) {
    if (!this.routes[path]) this.routes[path] = {};
    this.routes[path]['POST'] = handler;
  },
  
  handle(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const route = this.routes[url.pathname];
    const handler = route && route[req.method];
    if (typeof handler === 'function') {
      handler(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  }
};

// Inject credentials from env/secrets.json before systems boot
try {
  const creds = validateAndInject(config);
  console.log(`[Keys] Source=${creds.source} key=${creds.masked.key} secret=${creds.masked.secret}`);
} catch (_) {
  console.warn('[Keys] No credentials injected');
}

// Initialize Quantum Binance System
const quantumSystem = new QuantumBinanceSystem();
// Active orders tracking
quantumSystem.activeOrders = quantumSystem.activeOrders || [];

// [NIGHT] SISTEMA DE CAPTURA INTELIGENTE INTEGRADO
let intelligentDataSystem = null;
let intelligentDataAdapter = null;

try {
  // Inicializar sistema de captura inteligente
  intelligentDataSystem = new IntelligentDataCaptureSystem();
  console.log('[OK] Sistema de Captura Inteligente inicializado');
  
  // Inicializar adaptador para integración con el core
  intelligentDataAdapter = new IntelligentDataCoreAdapter(quantumSystem);
  
  // Inicializar el adaptador
  intelligentDataAdapter.initialize().then((success) => {
    if (success) {
      console.log('[OK] Adaptador de Captura Inteligente integrado con el core');
      
      // Interceptar métodos del core para usar datos mejorados
      if (quantumSystem.executeTradingSignal) {
        const originalExecuteTradingSignal = quantumSystem.executeTradingSignal.bind(quantumSystem);
        quantumSystem.executeTradingSignal = async (signal) => {
          return await intelligentDataAdapter.interceptExecuteTradingSignal(signal);
        };
      }
      
      if (quantumSystem.binanceConnector && quantumSystem.binanceConnector.getQuantumMarketData) {
        const originalGetQuantumMarketData = quantumSystem.binanceConnector.getQuantumMarketData.bind(quantumSystem.binanceConnector);
        quantumSystem.binanceConnector.getQuantumMarketData = async (symbols) => {
          return await intelligentDataAdapter.interceptGetQuantumMarketData(symbols);
        };
      }
      
      // Interceptar getQuantumMarketData del sistema cuántico
      if (quantumSystem.getQuantumMarketData) {
        const originalGetQuantumMarketData = quantumSystem.getQuantumMarketData.bind(quantumSystem);
        quantumSystem.getQuantumMarketData = async () => {
          try {
            // Usar datos de análisis del sistema inteligente
            const analysisData = await intelligentDataSystem.getAnalysisData();
            return analysisData;
          } catch (error) {
            console.warn('[WARNING] Fallback a datos originales:', error.message);
            return await originalGetQuantumMarketData();
          }
        };
      }
      
    } else {
      console.warn('[WARNING] Adaptador de Captura Inteligente no pudo inicializarse');
    }
  }).catch((error) => {
    console.error('[ERROR] Error inicializando adaptador de captura inteligente:', error.message);
  });
  
} catch (error) {
  console.warn('[WARNING] No se pudo cargar el sistema de captura inteligente:', error.message);
}

// Estado Auto-Execute (Unified)
let unifiedAutoExec = { timer: null, running: false, config: null, lastRunAt: 0, lastResult: null, lastLegs: null, lastSnapshot: null, history: [] };

// Métricas de rendimiento
const perfMetrics = {
  cache: { factors: { hits: 0, misses: 0 }, market: { hits: 0, misses: 0 } },
  suggest: { count: 0, totalMs: 0, avgMs: 0, p50: 0, p90: 0 },
  matrix: { lastMs: 0, p50: 0, p90: 0 },
  ws: { clients: 0, sseClients: 0, lastBroadcastAt: 0 },
  signals: { lastCount: 0, perMin: 0 },
  lastPersistedAt: 0
};
// Samples en memoria para percentiles (capados)
const __suggestSamples = [];
const __matrixSamples = [];
const __signalsHistory = [];
function computePercentile(arr, p){
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  const a = arr.slice().sort((x,y)=>x-y);
  const idx = Math.min(a.length-1, Math.max(0, Math.floor((p/100)*a.length)));
  return a[idx];
}
const METRICS_FLUSH_INTERVAL_MS = Number(process.env.METRICS_FLUSH_INTERVAL_MS || 60000);
function persistPerfMetrics() {
  try {
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    const snapshot = {
      t: Date.now(),
      cache: perfMetrics.cache,
      suggest: perfMetrics.suggest,
      matrix: perfMetrics.matrix,
      ws: perfMetrics.ws,
      signals: perfMetrics.signals
    };
    // Último snapshot legible
    fs.writeFileSync(path.join(logsDir, 'metrics.json'), JSON.stringify(snapshot, null, 2), 'utf8');
    // Historia en NDJSON
    fs.appendFileSync(path.join(logsDir, 'metrics-history.ndjson'), JSON.stringify(snapshot) + "\n", 'utf8');
    perfMetrics.lastPersistedAt = snapshot.t;
  } catch (_) { /* ignore disk errors */ }
}
setInterval(persistPerfMetrics, METRICS_FLUSH_INTERVAL_MS);

// ==== Integración de puntajes AI/ML y VigoFutures para el ensemble ====
// Mapas de scores por símbolo
const aiMlScores = new Map();
const vigoScores = new Map();

// Hook que usa el core para obtener el score AI/ML
quantumSystem.getAiMlScoreForSymbol = (symbol) => {
  return aiMlScores.get(symbol) || 0;
};

// Hook que usa el core para obtener el score VigoFutures
quantumSystem.getVigoFuturesScoreForSymbol = (symbol) => {
  return vigoScores.get(symbol) || 0;
};

// Actualizar periódicamente los scores si los módulos están activos
if (aiMlAvailable) {
  const updateAiScores = async () => {
    try {
      const symbols = (config.quantum?.symbols) || [];
      const tasks = (Array.isArray(symbols) ? symbols : []).map(async (sym) => {
        try {
          let factors = [];
          try {
            if (typeof quantumSystem.getCurrentQuantumFactors === 'function') {
              factors = quantumSystem.getCurrentQuantumFactors(sym) || [];
            }
          } catch (_) {}
          const vec = Array.from({ length: 16 }, (_, i) => factors.length ? (factors[i % factors.length] || 0) : 0);
          const pred = await aiMlSystem.predict(vec);
          const y = Array.isArray(pred) ? (pred[0] ?? 0) : 0;
          const score = 1 / (1 + Math.exp(-y));
          aiMlScores.set(sym, Math.max(0, Math.min(1, score)));
        } catch (_) { if (!aiMlScores.has(sym)) aiMlScores.set(sym, 0); }
      });
      await Promise.all(tasks);
    } catch (err) {
      // noop
    }
  };
  // Primera carga y luego cada 5s
  updateAiScores();
  setInterval(updateAiScores, 5000);
}

if (vigoAvailable) {
  const updateVigoScores = async () => {
    try {
      const symbols = (config.quantum?.symbols) || [];
      const concurrency = 4;
      for (let i = 0; i < symbols.length; i += concurrency) {
        const batch = symbols.slice(i, i + concurrency);
        await Promise.all((Array.isArray(batch) ? batch : []).map(async (sym) => {
          try {
            const pair = sym.endsWith('USDT') ? sym : `${sym}USDT`;
            const opp = await vigoFutures?.trader?.evaluateTradingOpportunity?.(pair);
            if (opp && typeof opp.confidence === 'number') {
              const edge = typeof opp.edge === 'number' ? opp.edge : 0;
              const edgeScaled = Math.tanh(Math.max(0, edge));
              const score = Math.max(0, Math.min(1, 0.5 * opp.confidence + 0.5 * edgeScaled));
              vigoScores.set(sym, score);
            } else {
              if (!vigoScores.has(sym)) vigoScores.set(sym, 0);
            }
          } catch (_) { if (!vigoScores.has(sym)) vigoScores.set(sym, 0); }
        }));
      }
    } catch (err) {
      // noop
    }
  };
  // Primera carga y luego cada 7s
  updateVigoScores();
  setInterval(updateVigoScores, 7000);
}

// === Worker Pool simple para scoring paralelo ===
const workerPool = [];
let nextWorker = 0;
function initWorkers(n = Math.max(2, (require('os').cpus()?.length || 4) - 1)) {
  try {
    const workersDir = path.join(__dirname, 'workers');
    for (let i = 0; i < n; i++) {
      const w = new Worker(path.join(workersDir, 'quantum-worker.js'));
      workerPool.push(w);
    }
    logger.info(`[Workers] Inicializados ${workerPool.length} workers`);
  } catch (e) {
    console.warn('[Workers] No se pudieron iniciar:', e?.message || e);
  }
}
initWorkers();

function scoreSymbolsInParallel(symbols) {
  return new Promise((resolve) => {
    try {
      // Validar que symbols sea un array válido
      if (!Array.isArray(symbols) || symbols.length === 0) {
        console.log('[Workers] No symbols provided, returning empty array');
        return resolve([]);
      }
      
      if (!workerPool.length) {
        console.log('[Workers] No workers available, using fallback scoring');
        // Fallback: scoring simple sin workers
        const fallbackScores = (Array.isArray(symbols) ? symbols : []).map(symbol => ({
          symbol, 
                          score: 0.5 + ((Date.now() % 10 - 5) / 100) // 0.45-0.55
        }));
        return resolve(fallbackScores);
      }
      
      const w = workerPool[nextWorker % workerPool.length];
      nextWorker++;
      const weights = (quantumSystem.quantumConfig?.ensembleWeights) || { coreWeight: 1, aiWeight: 0, vigoWeight: 0 };
      const ai = {}; aiMlScores.forEach((v, k) => ai[k] = v);
      const vg = {}; vigoScores.forEach((v, k) => vg[k] = v);
      const cols = (quantumSystem.quantumConfig?.matrixSize?.cols) || 8;
      const handler = (msg) => {
        try { w.off('message', handler); } catch(_) {}
        if (msg && msg.ok && Array.isArray(msg.data)) return resolve(msg.data);
        resolve([]);
      };
      w.on('message', handler);
      w.postMessage({ task: 'scoreSymbols', symbols, weights, aiScores: ai, vigoScores: vg, universalFrequency: 7919, cols });
    } catch (error) {
      console.error('[Workers] Error in scoreSymbolsInParallel:', error);
      resolve([]);
    }
  });
}

// === Cache agresivo de factores y market data ===
const factorsCache = new Map(); // symbol -> { t, factors }
const optionsMarketCache = new Map(); // symbol -> { t, data }
const FACTORS_TTL_MS = Number(process.env.FACTORS_TTL_MS || 1000);
const MARKET_TTL_MS = Number(process.env.MARKET_TTL_MS || 1000);

function getFactorsCached(symbol) {
  try {
    const now = Date.now();
    const hit = factorsCache.get(symbol);
    if (hit && (now - hit.t) < FACTORS_TTL_MS) { perfMetrics.cache.factors.hits++; return hit.factors; }
    const factors = typeof quantumSystem.getCurrentQuantumFactors === 'function' ? (quantumSystem.getCurrentQuantumFactors(symbol) || []) : [];
    factorsCache.set(symbol, { t: now, factors });
    perfMetrics.cache.factors.misses++;
    return factors;
  } catch (_) { return []; }
}

function getOptionsMarketDataCached(symbol) {
  try {
    const now = Date.now();
    const hit = optionsMarketCache.get(symbol);
    if (hit && (now - hit.t) < MARKET_TTL_MS) { perfMetrics.cache.market.hits++; return hit.data; }
    const data = quantumSystem?.getMarketDataForSymbol?.(symbol) || {};
    optionsMarketCache.set(symbol, { t: now, data });
    perfMetrics.cache.market.misses++;
    return data;
  } catch (_) { return {}; }
}

// Define routes
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Bot Opciones Service - Quantum Binance Edition',
    version: '1.0.0',
    status: 'running',
    binanceConnected: !!config.binance.apiKey && !!config.binance.apiSecret,
    timestamp: new Date().toISOString()
  }));
});

router.get('/health', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'healthy',
    binanceConnected: !!config.binance.apiKey && !!config.binance.apiSecret,
    intelligentDataCapture: intelligentDataAdapter ? 'enabled' : 'disabled',
    timestamp: new Date().toISOString()
  }));
});

// Endpoints para el sistema de captura inteligente
router.get('/intelligent-data/status', (req, res) => {
  try {
    if (!intelligentDataAdapter) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'disabled',
        error: 'Adaptador de captura inteligente no disponible'
      }));
      return;
    }
    
    const stats = intelligentDataAdapter.getIntegrationStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      timestamp: new Date().toISOString(),
      integration: stats
    }));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'error',
      error: error.message 
    }));
  }
});

router.get('/intelligent-data/sync', async (req, res) => {
  try {
    if (!intelligentDataAdapter) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'disabled',
        error: 'Adaptador de captura inteligente no disponible'
      }));
      return;
    }
    
    await intelligentDataAdapter.syncAnalysisData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'success',
      message: 'Datos de análisis sincronizados',
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'error',
      error: error.message 
    }));
  }
});

router.get('/intelligent-data/execution/:symbol/:type', async (req, res) => {
  try {
    if (!intelligentDataAdapter) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'disabled',
        error: 'Adaptador de captura inteligente no disponible'
      }));
      return;
    }
    
    const { symbol, type } = req.params;
    const executionData = await intelligentDataAdapter.getExecutionData(symbol, type);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'success',
      symbol,
      type,
      data: executionData,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'error',
      error: error.message 
    }));
  }
});

router.get('/quantum-matrix', async (req, res) => {
  try {
    // Get the real quantum matrix from the system
    const t0 = Date.now();
    let matrix = await quantumSystem.updateQuantumMatrix();
    const dt = Date.now() - t0; perfMetrics.matrix.lastMs = dt; __matrixSamples.push(dt); if (__matrixSamples.length > 200) __matrixSamples.shift(); perfMetrics.matrix.p50 = computePercentile(__matrixSamples, 50); perfMetrics.matrix.p90 = computePercentile(__matrixSamples, 90);
    // Validar que sea una matriz numérica; si no, intentar usar la actual o generar fallback
    const isMatrix = Array.isArray(matrix) && matrix.length > 0 && Array.isArray(matrix[0]);
    if (!isMatrix) {
      matrix = Array.from({ length: (config.quantum?.matrixSize?.rows || (config.quantum?.symbols?.length || 6)) }, (_, i) => {
        return Array.from({ length: (config.quantum?.matrixSize?.cols || 8) }, (_, j) => {
          try { if (typeof quantumSystem.generateQuantumValue === 'function') return quantumSystem.generateQuantumValue(i, j); } catch(_) {}
          const v = Math.abs(Math.sin((i + 1) * (j + 1)));
          return Number.isFinite(v) ? v : 0;
        });
      });
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ matrix, symbols: config.quantum.symbols, timestamp: new Date().toISOString() }));
  } catch (error) {
    logger.error('Error getting quantum matrix:', error);
    try {
      // Fallback de emergencia: matriz determinística
      const rows = (config.quantum?.matrixSize?.rows || (config.quantum?.symbols?.length || 6));
      const cols = (config.quantum?.matrixSize?.cols || 8);
      const matrix = Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => Math.abs(Math.sin((i + 1) * (j + 1)))));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ matrix, symbols: config.quantum.symbols, fallback: true, timestamp: new Date().toISOString() }));
    } catch (_) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }
});

router.get('/trading-signals', async (req, res) => {
  try {
    // Generate trading signals
    const t0 = Date.now();
    const signals = await quantumSystem.generateTradingSignals();
    const dt = Date.now() - t0; // tiempo del ciclo de señales
    __signalsHistory.push({ t: Date.now(), n: Array.isArray(signals)?signals.length:0 });
    if (__signalsHistory.length > 100) __signalsHistory.shift();
    perfMetrics.signals.lastCount = Array.isArray(signals)?signals.length:0;
    // perMin por ventana de 1 min
    try { const cutoff = Date.now() - 60000; const recent = __signalsHistory.filter(x=> x.t >= cutoff); const total = recent.reduce((s,x)=> s + Number(x.n||0), 0); perfMetrics.signals.perMin = total; } catch(_) {}
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      signals: signals,
      count: signals.length,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    logger.error('Error generating trading signals:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

router.get('/active-positions', (req, res) => {
  try {
    const positions = quantumSystem.activePositions;
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      positions: positions,
      count: positions.length,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    logger.error('Error getting active positions:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

router.get('/performance', async (req, res) => {
  try {
    // Fast path para evitar timeouts bajo alta carga o backoff de APIs
    if (String(process.env.FAST_PERFORMANCE || '').toLowerCase() === 'true') {
      try {
        const logsDir = path.join(__dirname, 'logs');
        const f = path.join(logsDir, 'metrics.json');
        let snapshot = null;
        if (fs.existsSync(f)) {
          snapshot = JSON.parse(fs.readFileSync(f, 'utf8'));
        }
        const quick = {
          metrics: {},
          kpis: { risk: { volatility: 0, sharpeRatio: 0, sortinoRatio: 0, maxDrawdown: 0, var95: 0, var99: 0, cvar95: 0, cvar99: 0 }, trading: { totalTrades: 0, winRate: 0, totalProfit: 0, profitFactor: 0 } },
          enhanced: {},
          enhancedReport: {},
          positionsBySymbol: {},
          orchOr: {},
          sentiment: { score: 0, gating: { sizeAdj: 1, capAdj: 1 } },
          predictionsTop: [],
          perf: snapshot ? { cache: snapshot.cache || {}, suggest: snapshot.suggest || {}, matrix: snapshot.matrix || {}, ws: snapshot.ws || {}, signals: snapshot.signals || {} } : { cache: perfMetrics.cache, suggest: perfMetrics.suggest, matrix: perfMetrics.matrix, ws: perfMetrics.ws, signals: perfMetrics.signals },
          timestamp: new Date().toISOString(),
          fast: true
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(quick));
        return;
      } catch(_) { /* continuará por la vía normal si falla */ }
    }

    let baseMetrics = {};
    try {
      baseMetrics = quantumSystem.getPerformanceMetrics();
      if (!baseMetrics || typeof baseMetrics !== 'object') baseMetrics = {};
    } catch (e) {
      baseMetrics = {
        totalTrades: 0,
        successfulTrades: 0,
        winRate: 0,
        totalProfit: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        timestamp: new Date().toISOString()
      };
    }

    // Agregar distribución de PnL por símbolo para la UI (heatmap)
    try {
      const positions = Array.isArray(quantumSystem.activePositions) ? quantumSystem.activePositions : [];
      const bySymbol = positions.reduce((acc, p) => {
        const sym = String(p.symbol || p.underlying || 'SYM').toUpperCase();
        const pnl = Number(p.unrealizedPnl || p.pnl || 0) || 0;
        acc[sym] = (acc[sym] || 0) + pnl;
        return acc;
      }, {});
      if (Object.keys(bySymbol).length && (!baseMetrics.positionsBySymbol || !Object.keys(baseMetrics.positionsBySymbol).length)) {
        baseMetrics.positionsBySymbol = bySymbol;
      }
    } catch (_) { /* tolerante */ }
    
    // Intentar leer métricas avanzadas (enhanced) si el sistema las expone
    let enhanced = {};
    let enhancedReport = {};
    try {
      if (quantumSystem?.enhancedMetrics && typeof quantumSystem.enhancedMetrics.getMetricsState === 'function') {
        enhanced = quantumSystem.enhancedMetrics.getMetricsState() || {};
      }
      if (quantumSystem?.enhancedMetrics && typeof quantumSystem.enhancedMetrics.generatePerformanceReport === 'function') {
        enhancedReport = quantumSystem.enhancedMetrics.generatePerformanceReport() || {};
      }
    } catch (_) { /* tolerante */ }

    // Consolidar KPIs de riesgo a partir de fuentes disponibles
    const basic = enhanced?.basic || {};
    const sharpe = Number.isFinite(basic.sharpeRatio) ? basic.sharpeRatio : (Number(baseMetrics?.sharpeRatio) || 0);
    const sortino = Number.isFinite(basic.sortinoRatio) ? basic.sortinoRatio : 0;
    const maxDrawdown = Number.isFinite(basic.maxDrawdown) ? basic.maxDrawdown : (Number(baseMetrics?.maxDrawdown) || 0);
    // Estimar vol y VaR/CVaR de forma paramétrica simple si no están provistos
    const volProxy = Number.isFinite(enhanced?.market?.marketVolatility) ? enhanced.market.marketVolatility : 0.1;
    const muProxy = (() => {
      try {
        const tp = Number(basic.totalProfit || baseMetrics?.totalProfit || 0);
        const n = Math.max(1, Number(basic.totalTrades || baseMetrics?.totalTrades || 1));
        return tp / n; // retorno medio por operación (proxy)
      } catch (_) { return 0; }
    })();
    const sigma = Math.max(1e-6, Number(volProxy || 0.1));
    const z95 = 1.645, z99 = 2.326;
    const var95 = -(muProxy - z95 * sigma);
    const var99 = -(muProxy - z99 * sigma);
    // Aproximación de CVaR bajo normalidad (CVaR = VaR * (phi/alpha)) simplificada
    const cvar95 = var95 * 1.25;
    const cvar99 = var99 * 1.10;

    // Helper: fetch JSON with soft timeout to avoid hanging
    const fetchJsonQuick = async (url, timeoutMs = 1000) => {
      try {
        const useFetch = (typeof fetch === 'function') ? fetch : (await import('node-fetch')).default;
        const p = useFetch(url).then(async (r) => (r && r.ok) ? (await r.json()) : null).catch(()=>null);
        const t = new Promise(resolve => setTimeout(() => resolve(null), timeoutMs));
        return await Promise.race([p, t]);
      } catch (_) { return null; }
    };

    const payload = {
      metrics: baseMetrics,
      kpis: {
        risk: {
          volatility: sigma,
          sharpeRatio: sharpe,
          sortinoRatio: sortino,
          maxDrawdown,
          var95,
          var99,
          cvar95,
          cvar99
        },
        trading: {
          totalTrades: Number(baseMetrics?.totalTrades || basic.totalTrades || 0),
          winRate: Number(baseMetrics?.winRate || basic.winRate || 0),
          totalProfit: Number(baseMetrics?.totalProfit || basic.totalProfit || 0),
          profitFactor: Number(basic.profitFactor || 0)
        }
      },
      // Exponer estado ORCH-OR / Sentiment si el Frontend-API publica /sentiment/score
      orchOr: (()=>{ try { const s = (typeof quantumSystem?.getEngineStatus === 'function') ? quantumSystem.getEngineStatus() : {}; return s?.profitEngine?.orchOr || {}; } catch(_) { return {}; } })(),
      sentiment: await (async ()=>{
        const port = Number(process.env.FRONTEND_API_PORT || process.env.FRONTEND_PORT || 4602);
        const j = await fetchJsonQuick(`http://localhost:${port}/sentiment/score`, 1200);
        return j || { score: 0, gating: { sizeAdj: 1, capAdj: 1 } };
      })(),
      predictionsTop: await (async ()=>{
        const port = Number(process.env.FRONTEND_API_PORT || process.env.FRONTEND_PORT || 4602);
        const j = await fetchJsonQuick(`http://localhost:${port}/predictions`, 1500);
        const arr = Array.isArray(j?.predictions) ? j.predictions : [];
        return arr.slice(0,5);
      })(),
      enhanced,
      enhancedReport,
      perf: {
        cache: perfMetrics.cache,
        suggest: perfMetrics.suggest,
        matrix: perfMetrics.matrix,
        ws: perfMetrics.ws,
        signals: perfMetrics.signals
      },
      timestamp: new Date().toISOString()
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
  } catch (error) {
    try {
      const details = (error && (error.stack || error.message)) ? (error.stack || error.message) : String(error);
      logger.error('Error getting performance metrics:', details);
    } catch(_) {
      logger.error('Error getting performance metrics: <no-details>');
    }
    // Respuesta de gracia para no romper el dashboard mientras hay backoff/errores transitorios
    const fallback = {
      metrics: {},
      kpis: { risk: { volatility: 0, sharpeRatio: 0, sortinoRatio: 0, maxDrawdown: 0, var95: 0, var99: 0, cvar95: 0, cvar99: 0 }, trading: { totalTrades: 0, winRate: 0, totalProfit: 0, profitFactor: 0 } },
      enhanced: {},
      enhancedReport: {},
      positionsBySymbol: {},
      orchOr: {},
      sentiment: { score: 0, gating: { sizeAdj: 1, capAdj: 1 } },
      predictionsTop: [],
      perf: { cache: perfMetrics.cache, suggest: perfMetrics.suggest, matrix: perfMetrics.matrix, ws: perfMetrics.ws, signals: perfMetrics.signals },
      timestamp: new Date().toISOString(),
      transientError: true
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(fallback));
  }
});

// Metrics endpoints
router.get('/metrics', (req, res) => {
  try {
    const logsDir = path.join(__dirname, 'logs');
    const f = path.join(logsDir, 'metrics.json');
    let payload = null;
    try {
      if (fs.existsSync(f)) {
        const raw = fs.readFileSync(f, 'utf8');
        payload = JSON.parse(raw);
      }
    } catch (_) {}
    if (!payload) {
      payload = { t: Date.now(), cache: perfMetrics.cache, suggest: perfMetrics.suggest };
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data: payload }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: err?.message || 'Error metrics' }));
  }
});

router.get('/metrics/history', (req, res) => {
  try {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const limit = Math.max(1, Math.min(5000, Number(urlObj.searchParams.get('limit') || 500)));
    const since = Number(urlObj.searchParams.get('since') || 0);
    const lastMinutes = Number(urlObj.searchParams.get('lastMinutes') || 0);
    const sinceTs = lastMinutes > 0 ? (Date.now() - lastMinutes * 60000) : since;
    const logsDir = path.join(__dirname, 'logs');
    const f = path.join(logsDir, 'metrics-history.ndjson');
    let entries = [];
    try {
      if (fs.existsSync(f)) {
        const raw = fs.readFileSync(f, 'utf8');
        const lines = raw.split(/\r?\n/).filter(Boolean);
        for (let i = Math.max(0, lines.length - limit); i < lines.length; i++) {
          try {
            const obj = JSON.parse(lines[i]);
            if (!sinceTs || (obj.t && obj.t >= sinceTs)) entries.push(obj);
          } catch (_) {}
        }
      }
    } catch (_) {}
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: entries.length, data: entries }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: err?.message || 'Error metrics history' }));
  }
});

// [Consolidated] Duplicate /ensemble/config handlers removed. See single implementation below.

router.post('/start-trading', async (req, res) => {
  try {
    // Start the trading system in the background
    if (!quantumSystem.tradingInterval) {
      quantumSystem.runMainCycle().catch(error => {
        logger.error('Error in trading cycle:', error);
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'Trading system started',
        timestamp: new Date().toISOString()
      }));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Trading system already running' }));
    }
  } catch (error) {
    logger.error('Error starting trading system:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

router.post('/stop-trading', (req, res) => {
  try {
    quantumSystem.stop();
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Trading system stopped',
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    logger.error('Error stopping trading system:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

router.get('/binance/connection', async (req, res) => {
  try {
    // Test Binance connection
    const serverTime = await quantumSystem.binanceConnector.getServerTime();
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      connected: true,
      serverTime: serverTime,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    logger.error('Binance connection test failed:', error);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      connected: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }));
  }
});

router.get('/binance/market-data', async (req, res) => {
  try {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const symbol = urlObj.searchParams.get('symbol') || '';
    const symbols = symbol ? [symbol] : config.quantum.symbols;
    
    // Get market data from Binance
    const marketData = await quantumSystem.binanceConnector.getQuantumMarketData(symbols);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: marketData,
      symbols: Object.keys(marketData),
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    logger.error('Error getting market data:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

router.get('/binance/options-data', async (req, res) => {
  try {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const symbol = urlObj.searchParams.get('symbol') || 'BTC';
    
    // Get options data from Binance
    const optionsData = await quantumSystem.getOptionsData(symbol);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      symbol: symbol,
      data: optionsData,
      count: optionsData.length,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    logger.error('Error getting options data:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

// Create server
const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control');
    res.writeHead(204);
    res.end();
    return;
  }
  
  router.handle(req, res);
});

// Start server
const PORT = config.ports?.core || 4601;
server.listen(PORT, () => {
  logger.info(`Bot Opciones Service running on port ${PORT}`);
  console.log(` Bot Opciones Service - Quantum Binance Edition running on port ${PORT}`);
  console.log(` Binance API: ${config.binance.apiKey ? 'Configured' : 'Not configured'}`);
  console.log(`[TEST] Testnet Mode: ${config.binance.testnet ? 'Enabled' : 'Disabled'}`);
  console.log(`[DATA] API available at: http://localhost:${PORT}`);
  // Warmup: ejecutar una sugerencia para poblar suggest.avgMs y caches
  try {
    (async ()=>{
      try {
        const t0 = Date.now();
        // Precalentar factores y market cache
        try {
          const symbols = (config.quantum?.symbols) || [];
          for (const s of symbols) { try { getFactorsCached(s); getOptionsMarketDataCached(s); } catch(_) {} }
        } catch(_) {}
        // Ejecutar sugerencia interna y medir
        await suggestUnifiedLegsInternal({ top: 3, symbol: '', maxVol: 0, kelly: false });
        const dt = Date.now() - t0; perfMetrics.suggest.count++; perfMetrics.suggest.totalMs += dt; perfMetrics.suggest.avgMs = Math.round(perfMetrics.suggest.totalMs / Math.max(1, perfMetrics.suggest.count));
      } catch(_) {}
    })();
  } catch(_) {}

  // === Unified integrated boot (monouser) ===
  try {
    // 1) Forzar tradeMode=unified si así se configuró y Futuros está habilitado
    const modeEnv = String(process.env.TRADE_MODE || '').toLowerCase();
    const vigoEnabled = process.env.VIGO_FUTURES_ENABLED === 'true' || process.env.VIGO_FUTURES_ENABLED === true;
    if (modeEnv === 'unified' && vigoEnabled && quantumSystem?.config?.binance) {
      quantumSystem.config.binance.tradeMode = 'unified';
      const q = quantumSystem.quantumConfig || (quantumSystem.quantumConfig = {});
      const base = Math.max(0, Math.min(1, Number(process.env.DEFAULT_VIGO_WEIGHT || 0.4)));
      const rest = 1 - base;
      const curCore = Number((q.ensembleWeights?.coreWeight) ?? 0.6);
      const curAi = Number((q.ensembleWeights?.aiWeight) ?? 0.4);
      const sum = Math.max(1e-9, curCore + curAi);
      q.ensembleWeights = { coreWeight: (curCore / sum) * rest, aiWeight: (curAi / sum) * rest, vigoWeight: base };
      console.log(`[UNIFIED] Trade mode set to 'unified' with ensemble weights:`, q.ensembleWeights);
    }

    // 2) Auto-start Unified Auto-Exec si está habilitado por env
    if (process.env.AUTOSTART_UNIFIED_AUTO_EXEC === 'true' || process.env.AUTOSTART_UNIFIED_AUTO_EXEC === true) {
      const modeNow = String(quantumSystem?.config?.binance?.tradeMode || '').toLowerCase();
      if (modeNow === 'unified') {
        const intervalSec = Math.max(30, Number(process.env.AUTOEXEC_INTERVAL_SEC || 120));
        const top = Math.max(1, Number(process.env.AUTOEXEC_TOP || 5));
        const symbol = '';
        const maxVol = 0;
        const perSymbolCapUSD = Number(process.env.AUTOEXEC_PER_SYMBOL_CAP_USD || 0);

        try { if (unifiedAutoExec.timer) { clearInterval(unifiedAutoExec.timer); unifiedAutoExec.timer = null; } } catch(_) {}
        unifiedAutoExec.config = { intervalSec, top, symbol, maxVol, perSymbolCapUSD };

        const runOnceBoot = async () => {
          try {
            // Sugerir y ejecutar piernas unificadas con Kelly sizing
            const legs = await suggestUnifiedLegsInternal({ top, symbol, maxVol, kelly: true });
            if (Array.isArray(legs) && legs.length) {
              const execResult = await executeUnifiedLegsInternal(legs, { perSymbolCapUSD });
              unifiedAutoExec.lastResult = execResult;
              unifiedAutoExec.lastRunAt = Date.now();
              unifiedAutoExec.lastLegs = legs;
              // Persist snapshot (imitando la ruta /unified/auto-exec/start)
              try {
                const logsDir = path.join(__dirname, 'logs');
                if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
                const snap = { t: unifiedAutoExec.lastRunAt, legs, result: execResult };
                unifiedAutoExec.lastSnapshot = snap;
                const f = path.join(logsDir, `unified-autoexec-${unifiedAutoExec.lastRunAt}.json`);
                fs.writeFileSync(f, JSON.stringify(snap, null, 2), 'utf8');
              } catch (_) {}
            }
          } catch (_) { /* ignore run errors */ }
        };

        unifiedAutoExec.timer = setInterval(runOnceBoot, intervalSec * 1000);
        unifiedAutoExec.running = true;
        // Ejecutar inmediatamente una vez
        runOnceBoot();
        console.log(`[UNIFIED] Auto-exec started interval=${intervalSec}s top=${top} perSymbolCapUSD=${perSymbolCapUSD}`);
      } else {
        console.log(`[UNIFIED] AUTOSTART requested but tradeMode='${modeNow}', skipping auto-exec.`);
      }
    }
    
    // 3) Iniciar automáticamente el ciclo principal de trading para ejecutar señales
    // Esto es necesario para que las señales generadas se conviertan en órdenes ejecutadas
    if (!quantumSystem.tradingInterval) {
      console.log('[TRADING] Iniciando ciclo principal de trading automáticamente...');
      quantumSystem.runMainCycle().catch(error => {
        logger.error('Error en el ciclo principal de trading:', error);
      });
    }
  } catch (e) {
    console.warn('[UNIFIED] Boot integration warning:', e?.message || e);
  }
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${config.port} is already in use`);
  } else {
    console.error('Server error:', error);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  quantumSystem.stop();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

  // === Órdenes: abiertas, historial, cancelación (mínimo viable) ===
  router.get('/orders/open', async (req, res) => {
    try {
      const urlObj = new URL(req.url, `http://${req.headers.host}`);
      const symbol = urlObj.searchParams.get('symbol') || null;
      const orders = await quantumSystem.getOpenOrders(symbol);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, orders, count: Array.isArray(orders)?orders.length:0, timestamp: Date.now() }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err?.message || 'Error consultando órdenes abiertas' }));
    }
  });

  router.get('/orders/history', (req, res) => {
    try {
      const orders = quantumSystem.getOrderHistory();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, orders, count: Array.isArray(orders)?orders.length:0, timestamp: Date.now() }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err?.message || 'Error consultando historial' }));
    }
  });

  router.post('/orders/cancel', async (req, res) => {
    try {
      const chunks = [];
      req.on('data', c => chunks.push(c));
      await new Promise(r => req.on('end', r));
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
      const { symbol, orderId } = body || {};
      if (!symbol || !orderId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'symbol y orderId requeridos' }));
      }
      // Cancelación vía conector si está disponible
      if (quantumSystem?.binanceConnector?.cancelOrder) {
        try {
          const r = await quantumSystem.binanceConnector.cancelOrder(symbol, orderId);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: true, result: r }));
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ success: false, error: e?.message || 'Error cancelando' }));
        }
      }
      res.writeHead(501, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Cancelación no implementada' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err?.message || 'Error en cancelación' }));
    }
  });

  // === SSE eventos en vivo (estado, últimas órdenes, métricas) ===
  const sseClients = new Set();
  router.get('/events', (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write(`:ok\n\n`);
    const client = { res };
    sseClients.add(client);
    req.on('close', () => { sseClients.delete(client); });
  });
  setInterval(() => {
    if (!sseClients.size) return;
    const payload = {
      t: Date.now(),
      perf: quantumSystem.getPerformanceMetrics?.() || {},
      positionsCount: Array.isArray(quantumSystem.activePositions) ? quantumSystem.activePositions.length : 0,
      lastOrder: Array.isArray(quantumSystem.orderHistory) && quantumSystem.orderHistory.length ? quantumSystem.orderHistory[quantumSystem.orderHistory.length-1] : null,
      lastOrders: Array.isArray(quantumSystem.orderHistory) ? quantumSystem.orderHistory.slice(-3) : [],
      pnlBySymbol: Array.isArray(quantumSystem.activePositions) ? quantumSystem.activePositions.reduce((acc, p)=>{ const s=p.symbol||p.underlying||'SYM'; acc[s]=(acc[s]||0)+Number(p.unrealizedPnl||p.pnl||0); return acc; }, {}) : {},
      engine: (()=>{ try { return typeof quantumSystem.getEngineStatus === 'function' ? quantumSystem.getEngineStatus() : {}; } catch(_) { return {}; } })(),
      tradeMode: String(quantumSystem?.config?.binance?.tradeMode || 'options'),
      ensemble: quantumSystem.quantumConfig || {}
    };
    const msg = `data: ${JSON.stringify(payload)}\n\n`;
    for (const c of sseClients) { try { c.res.write(msg); } catch (_) {} }
    perfMetrics.ws.sseClients = sseClients.size; perfMetrics.ws.lastBroadcastAt = Date.now();
  }, 3000);

  // === WebSocket broadcast (si ws disponible) ===
  let wss = null;
  if (WebSocketLib && typeof WebSocketLib.Server === 'function') {
    try {
      wss = new WebSocketLib.Server({ server, path: '/ws' });
      // Suscripciones por cliente
      const normalizeSymbols = (arr=[])=> (Array.isArray(arr)? arr : []).map(s=>{
        const x = String(s||'').toUpperCase().trim();
        return x.endsWith('USDT')? x : `${x}USDT`;
      }).filter(Boolean);
      wss.on('connection', (ws) => {
        ws._subs = null; // { channels:{orderbook,ticker,klines}, symbols:Set, interval }
        try { ws.send(JSON.stringify({ type: 'hello', t: Date.now(), mode: String(quantumSystem?.config?.binance?.tradeMode || 'options') })); } catch(_) {}
        ws.on('message', (raw)=>{
          try {
            const m = JSON.parse(String(raw||'{}'));
            if (m && m.type === 'ping') {
              try { ws.send(JSON.stringify({ type: 'pong', t: Date.now() })); } catch(_) {}
              return;
            }
            if (m && m.type === 'subscribe') {
              const ch = m.channels || {};
              const syms = normalizeSymbols(m.symbols);
              const interval = typeof m.interval === 'string' ? m.interval : '1m';
              ws._subs = {
                channels: { orderbook: !!ch.orderbook, ticker: !!ch.ticker, klines: !!ch.klines },
                symbols: syms.length? new Set(syms) : null,
                interval
              };
              try { ws.send(JSON.stringify({ type:'subscribed', ok:true, channels: ws._subs.channels, count: syms.length, interval })); } catch(_) {}
              return;
            }
            if (m && m.type === 'unsubscribe') {
              ws._subs = null;
              try { ws.send(JSON.stringify({ type:'unsubscribed', ok:true })); } catch(_) {}
              return;
            }
          } catch(_) {}
        });
      });
      setInterval(() => {
        if (!wss || wss.clients.size === 0) return;
        const payload = {
          t: Date.now(),
          perf: quantumSystem.getPerformanceMetrics?.() || {},
          positionsCount: Array.isArray(quantumSystem.activePositions) ? quantumSystem.activePositions.length : 0,
          lastOrder: Array.isArray(quantumSystem.orderHistory) && quantumSystem.orderHistory.length ? quantumSystem.orderHistory[quantumSystem.orderHistory.length-1] : null,
          lastOrders: Array.isArray(quantumSystem.orderHistory) ? quantumSystem.orderHistory.slice(-3) : [],
          pnlBySymbol: Array.isArray(quantumSystem.activePositions) ? quantumSystem.activePositions.reduce((acc, p)=>{ const s=p.symbol||p.underlying||'SYM'; acc[s]=(acc[s]||0)+Number(p.unrealizedPnl||p.pnl||0); return acc; }, {}) : {},
          engine: (()=>{ try { return typeof quantumSystem.getEngineStatus === 'function' ? quantumSystem.getEngineStatus() : {}; } catch(_) { return {}; } })(),
          tradeMode: String(quantumSystem?.config?.binance?.tradeMode || 'options'),
          ensemble: quantumSystem.quantumConfig || {}
        };
        const msg = JSON.stringify(payload);
        wss.clients.forEach((client) => {
          try { if (client && client.readyState === WebSocketLib.OPEN) client.send(msg); } catch(_) {}
        });
        perfMetrics.ws.clients = wss.clients.size; perfMetrics.ws.lastBroadcastAt = Date.now();
      }, 1000);
      console.log(` WebSocket habilitado en ws://localhost:${PORT}/ws`);
      // Heartbeat y eventos incrementales opcionales
      wss.on('connection', (client) => {
        client.on('message', (raw) => {
          try {
            const m = JSON.parse(String(raw||'{}'));
            if (m && m.type === 'ping') {
              try { client.send(JSON.stringify({ type: 'pong', t: Date.now() })); } catch(_) {}
            }
          } catch(_) {}
        });
      });

      // ===== Streaming incremental: orderbook/ticker/klines =====
      const doFetch = (typeof fetch === 'function') ? fetch : (...args) => import('node-fetch').then(({default: f}) => f(...args));
      const useTestnet = !!(quantumSystem?.config?.binance?.testnet);
      const fapiBase = useTestnet ? 'https://testnet.binancefuture.com' : 'https://fapi.binance.com';
      // Normaliza lista de símbolos a formato FAPI (e.g., BTCUSDT)
      const getFuturesSymbols = ()=>{
        const bases = (config.quantum?.symbols) || [];
        return (Array.isArray(bases) ? bases : []).map(b => {
          const s = String(b||'').toUpperCase();
          return s.endsWith('USDT') ? s : `${s}USDT`;
        });
      };

      // Broadcast helper
      const wsBroadcast = (obj)=>{
        const msg = JSON.stringify(obj);
        wss.clients.forEach((client) => {
          try { if (client && client.readyState === WebSocketLib.OPEN) client.send(msg); } catch(_) {}
        });
      };

      // 1) Orderbook top-of-book (bookTicker all) cada 2.5s
      setInterval(async ()=>{
        try {
          if (!wss || wss.clients.size === 0) return;
          const symbols = new Set(getFuturesSymbols());
          const url = `${fapiBase}/fapi/v1/ticker/bookTicker`;
          const r = await doFetch(url).catch(()=>null);
          if (!r || !r.ok) return;
          const arr = await r.json();
          if (!Array.isArray(arr)) return;
          const now = Date.now();
          for (const it of arr) {
            const sym = String(it.symbol||'');
            if (!symbols.has(sym)) continue;
            const bid = Number(it.bidPrice||0), ask = Number(it.askPrice||0);
            const bidQty = Number(it.bidQty||0), askQty = Number(it.askQty||0);
            if (!isFinite(bid) || !isFinite(ask) || bid<=0 || ask<=0) continue;
            const mid = (bid+ask)/2; const spreadBps = mid? ((ask-bid)/mid)*10000 : 0;
            const imbalance = (bidQty+askQty)>0? (bidQty-askQty)/(bidQty+askQty) : 0;
            const payload = { type: 'orderbook', symbol: sym, bid, ask, bestBidQty: bidQty, bestAskQty: askQty, spreadBps, imbalance, ts: now };
            wss.clients.forEach((client)=>{
              try {
                if (!client || client.readyState !== WebSocketLib.OPEN) return;
                const s = client._subs;
                if (!s) { client.send(JSON.stringify(payload)); return; }
                if (!s.channels.orderbook) return;
                if (s.symbols && !s.symbols.has(sym)) return;
                client.send(JSON.stringify(payload));
              } catch(_) {}
            });
          }
        } catch(_) {}
      }, 2500);

      // 2) Ticker 24hr (precio/volumen) cada 5s (subset de símbolos)
      setInterval(async ()=>{
        try {
          if (!wss || wss.clients.size === 0) return;
          const symbols = getFuturesSymbols().slice(0, 15); // limitar
          const now = Date.now();
          // /ticker/24hr por símbolo
          await Promise.all((Array.isArray(symbols) ? symbols : []).map(async (sym)=>{
            try {
              const r = await doFetch(`${fapiBase}/fapi/v1/ticker/24hr?symbol=${encodeURIComponent(sym)}`).catch(()=>null);
              if (!r || !r.ok) return;
              const j = await r.json();
              const price = Number(j.lastPrice||j.weightedAvgPrice||0);
              const volume = Number(j.volume||0);
              if (!isFinite(price) || price<=0) return;
              const payload = { type: 'ticker', symbol: sym, price, volume, ts: now };
              wss.clients.forEach((client)=>{
                try {
                  if (!client || client.readyState !== WebSocketLib.OPEN) return;
                  const s = client._subs;
                  if (!s) { client.send(JSON.stringify(payload)); return; }
                  if (!s.channels.ticker) return;
                  if (s.symbols && !s.symbols.has(sym)) return;
                  client.send(JSON.stringify(payload));
                } catch(_) {}
              });
            } catch(_) {}
          }));
        } catch(_) {}
      }, 5000);

      // 3) Klines incrementales (últimas 2 velas) cada 7s (subset para no spamear)
      setInterval(async ()=>{
        try {
          if (!wss || wss.clients.size === 0) return;
          const symbols = getFuturesSymbols().slice(0, 8); // subset
          const defaultInterval = (config.quantum?.streamInterval || '1m');
          await Promise.all((Array.isArray(symbols) ? symbols : []).map(async (sym)=>{
            try {
              const r = await doFetch(`${fapiBase}/fapi/v1/klines?symbol=${encodeURIComponent(sym)}&interval=${encodeURIComponent(defaultInterval)}&limit=2`).catch(()=>null);
              if (!r || !r.ok) return;
              const arr = await r.json();
              if (!Array.isArray(arr) || arr.length === 0) return;
              const candles = (Array.isArray(arr) ? arr : []).map(k => ({ t: Number(k[0]), o: Number(k[1]), h: Number(k[2]), l: Number(k[3]), c: Number(k[4]), v: Number(k[5]) }));
              const payload = { type: 'klines', symbol: sym, interval: defaultInterval, candles, ts: Date.now() };
              wss.clients.forEach((client)=>{
                try {
                  if (!client || client.readyState !== WebSocketLib.OPEN) return;
                  const s = client._subs;
                  if (!s) { client.send(JSON.stringify(payload)); return; }
                  if (!s.channels.klines) return;
                  // Si el cliente especificó intervalo, filtrar
                  const wantInt = String(s.interval||defaultInterval);
                  if (wantInt && wantInt !== payload.interval) return;
                  if (s.symbols && !s.symbols.has(sym)) return;
                  client.send(JSON.stringify(payload));
                } catch(_) {}
              });
            } catch(_) {}
          }));
        } catch(_) {}
      }, 7000);
    } catch (e) {
      console.warn('[WS] No se pudo iniciar WebSocket:', e?.message || e);
    }
  }

  // === Ensemble config endpoints ===
  router.get('/ensemble/config', (req, res) => {
    const q = quantumSystem.quantumConfig || config.quantum || {};
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ensembleWeights: q.ensembleWeights || {},
      costs: q.costs || {},
      kelly: q.kelly || {},
      kellyHeuristics: q.kellyHeuristics || { reward: 0.02, risk: 0.01 },
      tradeMode: (config?.binance?.tradeMode || 'options')
    }));
  });

  router.post('/ensemble/config', async (req, res) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    await new Promise(r => req.on('end', r));
    try {
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
      const q = quantumSystem.quantumConfig || (quantumSystem.quantumConfig = {});
      if (body.ensembleWeights) {
        q.ensembleWeights = {
          ...q.ensembleWeights,
          ...body.ensembleWeights
        };
      }
      if (body.costs) {
        q.costs = { ...(q.costs || {}), ...body.costs };
      }
      if (body.kelly) {
        q.kelly = { ...(q.kelly || {}), ...body.kelly };
      }
      if (body.kellyHeuristics) {
        const h = body.kellyHeuristics || {};
        const reward = Number(h.reward);
        const risk = Number(h.risk);
        q.kellyHeuristics = { ...(q.kellyHeuristics || { reward: 0.02, risk: 0.01 }) };
        if (Number.isFinite(reward) && reward > 0) q.kellyHeuristics.reward = reward;
        if (Number.isFinite(risk) && risk > 0) q.kellyHeuristics.risk = risk;
      }
        if (body.tradeMode && quantumSystem.config && quantumSystem.config.binance) {
        const newMode = String(body.tradeMode).toLowerCase();
          if (newMode === 'spot') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Trade mode no permitido (use options, futures o unified).' }));
          }
        const prevMode = String(quantumSystem.config.binance.tradeMode || '').toLowerCase();
        quantumSystem.config.binance.tradeMode = newMode;
        // Auto-ajuste de ensemble al cambiar de modo
        const ew = q.ensembleWeights || { coreWeight: 1, aiWeight: 0, vigoWeight: 0 };
        if (newMode !== prevMode) {
          if (newMode === 'options') {
            // En opciones, vigoWeight -> 0; renormalizar core/ai
            const core = Number(ew.coreWeight || 0.7);
            const ai = Number(ew.aiWeight || 0.3);
            const sum = Math.max(1e-9, core + ai);
            q.ensembleWeights = { coreWeight: core / sum, aiWeight: ai / sum, vigoWeight: 0 };
            } else if (newMode === 'futures' || newMode === 'unified') {
            // En futuros, permitir algo de vigo; por defecto 0.5 vigo, 0.5 (core+ai)
            const base = Math.max(0, Math.min(1, Number(process.env.DEFAULT_VIGO_WEIGHT || 0.5)));
            const rest = 1 - base;
            const core = Number(ew.coreWeight || 0.6);
            const ai = Number(ew.aiWeight || 0.4);
            const sum = Math.max(1e-9, core + ai);
            q.ensembleWeights = { coreWeight: (core / sum) * rest, aiWeight: (ai / sum) * rest, vigoWeight: base };
          }
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Ensemble config updated', ensemble: q.ensembleWeights, costs: q.costs, kelly: q.kelly, kellyHeuristics: q.kellyHeuristics || { reward: 0.02, risk: 0.01 }, tradeMode: quantumSystem.config.binance.tradeMode }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });

  // === Opciones: ejecutar y consultar ===
  router.post('/options/execute', async (req, res) => {
    try {
      const tradeMode = String(quantumSystem?.config?.binance?.tradeMode || 'options').toLowerCase();
      if (tradeMode !== 'options') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Trade mode no es options' }));
      }
      const chunks = [];
      req.on('data', c => chunks.push(c));
      await new Promise(r => req.on('end', r));
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
      const symbol = String(body.symbol || '').toUpperCase();
      if (!symbol) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'symbol requerido' }));
      }
      // Construir señal básica usando ensemble actual
      const factors = typeof quantumSystem.getCurrentQuantumFactors === 'function' ? (quantumSystem.getCurrentQuantumFactors(symbol) || []) : [];
      const coreScore = typeof quantumSystem.calculateQuantumScore === 'function' ? quantumSystem.calculateQuantumScore(factors) : 0;
      const aiScore = typeof quantumSystem.getAiMlScoreForSymbol === 'function' ? (quantumSystem.getAiMlScoreForSymbol(symbol) ?? 0) : 0;
      const vigoScore = 0; // ignorado en options
      const { coreWeight, aiWeight, vigoWeight } = (quantumSystem.quantumConfig?.ensembleWeights || { coreWeight: 1, aiWeight: 0, vigoWeight: 0 });
      const sum = Math.max(1e-9, coreWeight + aiWeight + vigoWeight);
      const score = (coreWeight * coreScore + aiWeight * aiScore + vigoWeight * vigoScore) / sum;
      const strat = typeof quantumSystem.determineOptimalStrategy === 'function' ? quantumSystem.determineOptimalStrategy(factors) : { strategy: 'directional_options', direction: 'BUY', confidence: Math.max(coreScore, aiScore) };
      const signal = {
        symbol,
        score,
        strategy: String(body.strategy || strat.strategy),
        direction: String(body.direction || strat.direction),
        confidence: Number(body.confidence || strat.confidence || score || 0.5)
      };
      const result = await quantumSystem.executeTradingSignal(signal);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: !!result, position: result }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err?.message || 'Error ejecutando opción' }));
    }
  });

  router.get('/options/positions', (req, res) => {
    try {
      const tradeMode = String(quantumSystem?.config?.binance?.tradeMode || 'options').toLowerCase();
      const positions = (tradeMode === 'options')
        ? (Array.isArray(quantumSystem.activePositions) ? quantumSystem.activePositions : [])
        : [];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ positions, count: positions.length }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err?.message || 'Error consultando posiciones' }));
    }
  });

  // === VigoFutures endpoints (opcionales) ===
  router.get('/futures/health', (req, res) => {
    if (!VIGO_FUTURES_ENABLED || !vigoAvailable) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ enabled: false, available: false }));
    }
    const stats = vigoFutures?.trader?.getTradingStats?.() || {};
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      enabled: true,
      available: true,
      port: vigoPort,
      positions: stats.positions || 0,
      totalPnL: stats.totalPnL || 0,
      avgLeverage: stats.avgLeverage || 0,
      timestamp: new Date().toISOString()
    }));
  });

  router.get('/futures/status', (req, res) => {
    if (!VIGO_FUTURES_ENABLED || !vigoAvailable) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ enabled: false, available: false }));
    }
    const tradingStats = vigoFutures?.trader?.getTradingStats?.() || {};
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      bot: 'online',
      port: vigoPort,
      opportunities: vigoFutures?.opportunities || [],
      tradingStats,
      timestamp: Date.now()
    }));
  });

  router.get('/futures/opportunities', (req, res) => {
    if (!VIGO_FUTURES_ENABLED || !vigoAvailable) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ enabled: false, available: false, opportunities: [] }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ opportunities: vigoFutures?.opportunities || [], count: (vigoFutures?.opportunities || []).length, timestamp: Date.now() }));
  });

  router.get('/futures/positions', (req, res) => {
    const tradeMode = String(quantumSystem?.config?.binance?.tradeMode || 'options').toLowerCase();
    if (tradeMode !== 'futures') {
      // Responder 200 con vacío para evitar 400 en otros modos (e.g., unified/options)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ positions: [], count: 0, totalPnL: 0, timestamp: Date.now() }));
    }
    if (!VIGO_FUTURES_ENABLED || !vigoAvailable) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ positions: [], count: 0, totalPnL: 0, timestamp: Date.now() }));
    }
    const positions = Array.from(vigoFutures?.trader?.positions?.values?.() || []);
    const totalPnL = positions.reduce((sum, p) => sum + (p.pnl || 0), 0);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ positions, count: positions.length, totalPnL, timestamp: Date.now() }));
  });

  router.post('/futures/execute', async (req, res) => {
    try {
      const tradeMode = String(quantumSystem?.config?.binance?.tradeMode || 'options').toLowerCase();
      if (tradeMode !== 'futures') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Trade mode no es futures' }));
      }
      if (!VIGO_FUTURES_ENABLED || !vigoAvailable) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'VigoFutures no disponible' }));
      }
      const chunks = [];
      req.on('data', chunk => chunks.push(chunk));
      await new Promise(resolve => req.on('end', resolve));
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
      const { symbol, side = 'BUY', size = 1 } = body;
      if (!symbol) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'symbol requerido' }));
      }
      // Generar oportunidad y ejecutar
      const marketData = vigoFutures?.trader?.getMarketData?.(symbol) || { price: 1000, volatility: 0.02 };
      const opportunity = await vigoFutures.trader.evaluateTradingOpportunity(symbol);
      opportunity.side = side;
      opportunity.size = size;

      // Cap de riesgo agregado (opciones + futuros)
      try {
        const kellyCfg = (quantumSystem.quantumConfig?.kelly || { riskCapNotional: 0.2 });
        const balanceUSDT = Number(vigoFutures?.trader?.balance?.availableBalance || 0) || 0;
        if (balanceUSDT > 0) {
          const cap = Math.max(0, Math.min(1, Number(kellyCfg.riskCapNotional || 0.2))) * balanceUSDT;
          // Exposición actual opciones (precio*qty)
          const optExposure = Array.isArray(quantumSystem?.activePositions) ? quantumSystem.activePositions.reduce((s, p) => s + Number(p.entryPrice || 0) * Number(p.quantity || 0), 0) : 0;
          // Exposición actual futuros (|markPrice*size|)
          const futExposure = vigoFutures?.trader?.positions ? Array.from(vigoFutures.trader.positions.values()).reduce((s, p) => s + Math.abs(Number(p.markPrice || p.entryPrice || 0) * Number(p.size || 0)), 0) : 0;
          const currentExposure = optExposure + futExposure;
          const px = Number(marketData.price || opportunity.price || 0) || 0;
          const desiredQty = Number(opportunity.size || size || 0) || 0;
          const newExposure = px * desiredQty;
          if (px > 0 && currentExposure + newExposure > cap) {
            const remaining = Math.max(0, cap - currentExposure);
            const maxQty = Math.floor(remaining / px);
            if (!maxQty || maxQty <= 0) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ success: false, message: 'Cap de riesgo alcanzado' }));
            }
            opportunity.size = maxQty;
          }
        }
      } catch (_) {}

      const result = await vigoFutures.trader.executeTrade(opportunity);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, opportunity, result, timestamp: Date.now() }));
    } catch (error) {
      logger.error('Error en /futures/execute:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });

  router.post('/futures/cancel', async (req, res) => {
    try {
      const tradeMode = String(quantumSystem?.config?.binance?.tradeMode || 'options').toLowerCase();
      if (tradeMode !== 'futures') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Trade mode no es futures' }));
      }
      if (!VIGO_FUTURES_ENABLED || !vigoAvailable) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'VigoFutures no disponible' }));
      }
      const chunks = [];
      req.on('data', c => chunks.push(c));
      await new Promise(r => req.on('end', r));
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
      const { id } = body || {};
      if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'id requerido' }));
      }
      // Proxy al demo server de VigoFutures
      try {
        const http = require('http');
        const payload = Buffer.from(JSON.stringify({ id }));
        await new Promise((resolve, reject) => {
          const req2 = http.request({ hostname: 'localhost', port: vigoPort, path: '/api/cancel', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': payload.length } }, (resp) => {
            let buf=''; resp.on('data', d=> buf+=d); resp.on('end', ()=>{
              try {
                const j = JSON.parse(buf||'{}');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(j));
                resolve();
              } catch (e) { reject(e); }
            });
          });
          req2.on('error', reject); req2.write(payload); req2.end();
        });
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e?.message || 'Error cancelando en VigoFutures' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err?.message || 'Error en cancelación de futuros' }));
    }
  });

  // === Modo Unificado: overview y ejecución en cesta ===
  router.get('/unified/overview', (req, res) => {
    try {
      const optionsPos = Array.isArray(quantumSystem.activePositions) ? quantumSystem.activePositions : [];
      const futuresPos = vigoFutures?.trader?.positions ? Array.from(vigoFutures.trader.positions.values()) : [];
      const optionsPnL = optionsPos.reduce((s, p) => s + Number(p.unrealizedPnl || p.pnl || 0), 0);
      const futuresPnL = futuresPos.reduce((s, p) => s + Number(p.unrealizedPnl || p.pnl || 0), 0);
      const totalPnL = optionsPnL + futuresPnL;
      // Agregar distribución PnL por símbolo para visualizaciones
      const bySymbol = {};
      try {
        for (const p of optionsPos) {
          const sym = String(p.symbol || p.underlying || 'SYM').toUpperCase();
          const pnl = Number(p.unrealizedPnl || p.pnl || 0) || 0;
          bySymbol[sym] = (bySymbol[sym] || 0) + pnl;
        }
        for (const p of futuresPos) {
          const sym = String(p.symbol || p.underlying || 'SYM').toUpperCase();
          const pnl = Number(p.unrealizedPnl || p.pnl || 0) || 0;
          bySymbol[sym] = (bySymbol[sym] || 0) + pnl;
        }
      } catch(_) {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        tradeMode: String(quantumSystem?.config?.binance?.tradeMode || 'options'),
        positions: { options: optionsPos, futures: futuresPos },
        pnl: { options: optionsPnL, futures: futuresPnL, total: totalPnL },
        positionsBySymbol: bySymbol,
        timestamp: Date.now()
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err?.message || 'Error en unified/overview' }));
    }
  });

  router.post('/unified/execute', async (req, res) => {
    try {
      const chunks = []; req.on('data', c => chunks.push(c)); await new Promise(r => req.on('end', r));
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
      const legs = Array.isArray(body.legs) ? body.legs : [];
      const caps = (body.caps || {});
      if (!legs.length) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'legs requerido' }));
      }
      // Cap de riesgo unificado
      const kellyCfg = (quantumSystem.quantumConfig?.kelly || { riskCapNotional: 0.2 });
      const balanceOptions = Number(quantumSystem?.getPerformanceMetrics?.().availableUSDT || 0) || 0;
      const balanceFutures = Number(vigoFutures?.trader?.balance?.available || vigoFutures?.trader?.balance?.availableBalance || 0) || 0;
      const totalBalance = (balanceOptions || 0) + (balanceFutures || 0);
      const cap = Math.max(0, Math.min(1, Number(kellyCfg.riskCapNotional || 0.2))) * totalBalance;
      const currentOptExposure = Array.isArray(quantumSystem?.activePositions) ? quantumSystem.activePositions.reduce((s, p) => s + Number(p.entryPrice || 0) * Number(p.quantity || 0), 0) : 0;
      const currentFutExposure = vigoFutures?.trader?.positions ? Array.from(vigoFutures.trader.positions.values()).reduce((s, p) => s + Math.abs(Number(p.markPrice || p.entryPrice || 0) * Number(p.size || 0)), 0) : 0;
      let usedExposure = currentOptExposure + currentFutExposure;
      const results = [];
      const perSymbolCapUSD = Number(caps.perSymbolCapUSD || 0);
      const symbolExposure = new Map();
      for (const leg of legs) {
        const kind = String(leg.type || 'options').toLowerCase();
        const symbol = String(leg.symbol || '').toUpperCase();
        const side = String(leg.side || 'BUY').toUpperCase();
        let size = Number(leg.size);
        if (!symbol) { results.push({ success: false, error: 'symbol requerido', leg }); continue; }
        // estimar precio para exposición marginal
        let px = 0;
        try {
          if (kind === 'futures') {
            const md = vigoFutures?.trader?.getMarketData?.(symbol) || {}; px = Number(md.lastPrice || md.price || 0) || 0;
          } else {
            const md = quantumSystem?.getMarketDataForSymbol?.(symbol) || {}; px = Number(md.price || 0) || 0;
          }
        } catch (_) {}
        // Dimensionamiento automático (Kelly) si no viene size válido (>0)
        if (!Number.isFinite(size) || size <= 0) {
          try {
            const baseSym = kind === 'futures' ? symbol.replace(/USDT$/, '') : symbol;
            const factors = typeof quantumSystem.getCurrentQuantumFactors === 'function' ? (quantumSystem.getCurrentQuantumFactors(baseSym) || []) : [];
            const score = typeof quantumSystem.calculateQuantumScore === 'function' ? quantumSystem.calculateQuantumScore(factors) : 0.5;
            const costs = (quantumSystem.quantumConfig?.costs || { takerFeeRate: 0.001, slippageBps: 5 });
            const costRate = (Number(costs.takerFeeRate || 0.001) * 2) + (Number(costs.slippageBps || 5) / 10000);
            const probWin = Math.min(0.99, Math.max(0.01, score >= 0.5 ? score : 1 - score));
            const heur = quantumSystem.quantumConfig?.kellyHeuristics || { reward: 0.02, risk: 0.01 };
            const reward = Number(heur.reward || 0.02);
            const risk = Number(heur.risk || 0.01);
            const grossEdge = probWin * reward - (1 - probWin) * risk;
            const netEdge = grossEdge - costRate;
            let kellyFraction = 0.0;
            if (netEdge > 0) {
              const R = reward / Math.max(1e-6, risk);
              const rawKelly = Math.max(0, (probWin * (R + 1) - 1) / R);
              kellyFraction = Math.min(Number(kellyCfg.maxFraction || 0.25), rawKelly * 0.5);
            }
            const maxF = Math.max(1e-6, Number(kellyCfg.maxFraction || 0.25));
            const buckets = 5;
            const sizeUnits = Math.max(1, Math.min(5, Math.round((kellyFraction / maxF) * buckets)));
            size = sizeUnits;
          } catch (_) {
            size = 1;
          }
        } else {
          size = Math.max(1, Math.floor(size));
        }
        const marginal = px * size;
        // Límite por símbolo si aplica
        if (perSymbolCapUSD > 0 && px > 0) {
          const used = Number(symbolExposure.get(symbol) || 0);
          if (used + marginal > perSymbolCapUSD) {
            const remain = Math.max(0, perSymbolCapUSD - used);
            const maxQty = Math.floor(remain / px);
            if (!maxQty || maxQty <= 0) { results.push({ success: false, error: 'Cap por símbolo alcanzado', leg }); continue; }
            leg.size = maxQty;
          }
        }
        if (px > 0 && usedExposure + marginal > cap) {
          const remaining = Math.max(0, cap - usedExposure);
          const maxQty = Math.floor(remaining / px);
          if (!maxQty || maxQty <= 0) { results.push({ success: false, error: 'Cap riesgo alcanzado', leg }); continue; }
          leg.size = maxQty;
        }
        // ejecutar
        try {
          if (kind === 'futures') {
            const opportunity = await vigoFutures.trader.evaluateTradingOpportunity(symbol);
            opportunity.side = side; opportunity.size = Number(leg.size || size);
            const r = await vigoFutures.trader.executeTrade(opportunity);
            results.push({ success: true, leg, result: r });
            const spend = px * Number(leg.size || size);
            usedExposure += spend;
            symbolExposure.set(symbol, Number(symbolExposure.get(symbol) || 0) + spend);
          } else {
            const strat = { strategy: 'directional_options', direction: side, confidence: 0.6 };
            const r = await quantumSystem.executeTradingSignal({ symbol, ...strat });
            results.push({ success: !!r, leg, result: r });
            const spend = px * Number(leg.size || size);
            usedExposure += spend;
            symbolExposure.set(symbol, Number(symbolExposure.get(symbol) || 0) + spend);
          }
        } catch (e) {
          results.push({ success: false, error: e?.message || 'Error ejecutando', leg });
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, results, cap, usedExposure, perSymbolCapUSD }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err?.message || 'Error en unified/execute' }));
    }
  });

  router.get('/unified/suggest', async (req, res) => {
    try {
      const urlObj = new URL(req.url, `http://${req.headers.host}`);
      const top = Math.max(1, Number(urlObj.searchParams.get('top') || 3));
      const symbolFilter = String(urlObj.searchParams.get('symbol') || '').toUpperCase();
      const maxVol = Number(urlObj.searchParams.get('maxVol') || 0); // 0 => sin filtro
      const symbolsAll = (config.quantum?.symbols) || [];
      const symbols = symbolFilter ? symbolsAll.filter(s => s.toUpperCase().includes(symbolFilter)) : symbolsAll;
      const t0 = Date.now();
      // Calcular scores en paralelo con worker
      let scored = await scoreSymbolsInParallel(symbols);
      if (!Array.isArray(scored) || !scored.length) scored = (Array.isArray(symbols) ? symbols : []).map(sym => ({ symbol: sym, score: 0.5 }));
      // Filtro de volatilidad si aplica
      if (maxVol > 0) {
        const keep = [];
        for (const item of scored) {
          try {
            const md = getOptionsMarketDataCached(item.symbol);
            const vol = Number(md.volatility || md.iv || 0);
            if (vol <= maxVol) keep.push(item);
          } catch (_) { keep.push(item); }
        }
        scored = keep;
      }
      scored.sort((a,b)=> Math.abs(b.score-0.5) - Math.abs(a.score-0.5));
      const picks = scored.slice(0, top);
      const legs = [];
      for (const p of picks) {
        const bull = p.score >= 0.6; const bear = p.score <= 0.4;
        const futSym = p.symbol.endsWith('USDT') ? p.symbol : `${p.symbol}USDT`;
        if (bull) { legs.push({ type:'options', symbol:p.symbol, side:'BUY' }); legs.push({ type:'futures', symbol:futSym, side:'SELL' }); }
        else if (bear) { legs.push({ type:'options', symbol:p.symbol, side:'SELL' }); legs.push({ type:'futures', symbol:futSym, side:'BUY' }); }
      }
      const dt = Date.now() - t0; perfMetrics.suggest.count++; perfMetrics.suggest.totalMs += dt; perfMetrics.suggest.avgMs = Math.round(perfMetrics.suggest.totalMs / Math.max(1, perfMetrics.suggest.count));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, picks, legs }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err?.message || 'Error en unified/suggest' }));
    }
  });

  // Arranque y estado de Auto-Execute Unified
  router.get('/unified/auto-exec/status', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      running: unifiedAutoExec.running,
      config: unifiedAutoExec.config || {},
      lastRunAt: unifiedAutoExec.lastRunAt || 0,
      lastResult: unifiedAutoExec.lastResult ? { count: Array.isArray(unifiedAutoExec.lastResult?.results) ? unifiedAutoExec.lastResult.results.length : 0 } : null,
      historyCount: Array.isArray(unifiedAutoExec.history) ? unifiedAutoExec.history.length : 0
    }));
  });

  router.post('/unified/auto-exec/start', async (req, res) => {
    try {
      const chunks = []; req.on('data', c => chunks.push(c)); await new Promise(r => req.on('end', r));
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
      const intervalSec = Math.max(30, Number(body.intervalSec || 60));
      const top = Math.max(1, Number(body.top || 3));
      const symbol = String(body.symbol || '').toUpperCase();
      const maxVol = Number(body.maxVol || 0);
      const perSymbolCapUSD = Number(body.perSymbolCapUSD || 0);
      const immediate = body.immediate !== false;
      unifiedAutoExec.config = { intervalSec, top, symbol, maxVol, perSymbolCapUSD };
      if (unifiedAutoExec.timer) { clearInterval(unifiedAutoExec.timer); unifiedAutoExec.timer = null; }
      const runOnce = async () => {
        try {
          if (String(quantumSystem?.config?.binance?.tradeMode || '').toLowerCase() !== 'unified') return;
          const legs = await suggestUnifiedLegsInternal({ top, symbol, maxVol, kelly: true });
          if (!Array.isArray(legs) || !legs.length) return;
          const execResult = await executeUnifiedLegsInternal(legs, { perSymbolCapUSD });
          unifiedAutoExec.lastResult = execResult;
          unifiedAutoExec.lastRunAt = Date.now();
          unifiedAutoExec.lastLegs = legs;
          // persist snapshot to logs
          try {
            const logsDir = path.join(__dirname, 'logs');
            if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
            const snap = { t: unifiedAutoExec.lastRunAt, legs, result: execResult };
            unifiedAutoExec.lastSnapshot = snap;
            const f = path.join(logsDir, `unified-autoexec-${unifiedAutoExec.lastRunAt}.json`);
            fs.writeFileSync(f, JSON.stringify(snap, null, 2), 'utf8');
          } catch (_) {}
          try {
            const total = Array.isArray(execResult?.results) ? execResult.results.length : 0;
            const ok = Array.isArray(execResult?.results) ? execResult.results.filter(r=> r && r.success).length : 0;
            const fail = total - ok;
            unifiedAutoExec.history = Array.isArray(unifiedAutoExec.history) ? unifiedAutoExec.history : [];
            unifiedAutoExec.history.push({ t: unifiedAutoExec.lastRunAt, total, ok, fail });
            if (unifiedAutoExec.history.length > 50) unifiedAutoExec.history = unifiedAutoExec.history.slice(-50);
          } catch (_) {}
        } catch (_) {}
      };
      unifiedAutoExec.timer = setInterval(runOnce, intervalSec * 1000);
      unifiedAutoExec.running = true;
      if (immediate) { runOnce(); }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, config: unifiedAutoExec.config }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err?.message || 'Error iniciando auto-exec' }));
    }
  });

  router.post('/unified/auto-exec/stop', (req, res) => {
    if (unifiedAutoExec.timer) { clearInterval(unifiedAutoExec.timer); unifiedAutoExec.timer = null; }
    unifiedAutoExec.running = false;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  });

  router.get('/unified/auto-exec/history', (req, res) => {
    try {
      const list = Array.isArray(unifiedAutoExec.history) ? unifiedAutoExec.history.slice(-50).reverse() : [];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: list }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err?.message || 'Error history' }));
    }
  });

  router.get('/unified/auto-exec/last', (req, res) => {
    try {
      const last = unifiedAutoExec.lastResult || {};
      const legs = unifiedAutoExec.lastLegs || [];
      const total = Array.isArray(last?.results) ? last.results.length : 0;
      const ok = Array.isArray(last?.results) ? last.results.filter(r=> r && r.success).length : 0;
      const fail = total - ok;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, t: unifiedAutoExec.lastRunAt || 0, total, ok, fail, legs }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err?.message || 'Error last' }));
    }
  });

  router.get('/unified/auto-exec/snapshot', (req, res) => {
    try {
      const snap = unifiedAutoExec.lastSnapshot || null;
      if (!snap) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: false, error: 'No snapshot' }));
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, snapshot: snap }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err?.message || 'Error snapshot' }));
    }
  });

  // Internos reutilizables
  async function suggestUnifiedLegsInternal({ top, symbol, maxVol, kelly }) {
    const symbolFilter = String(symbol || '').toUpperCase();
    const symbolsAll = (config.quantum?.symbols) || [];
    const symbols = symbolFilter ? symbolsAll.filter(s => s.toUpperCase().includes(symbolFilter)) : symbolsAll;
    const scored = [];
    for (const sym of symbols) {
      try {
        const factors = getFactorsCached(sym);
        const score = typeof quantumSystem.calculateQuantumScore === 'function' ? quantumSystem.calculateQuantumScore(factors) : 0.5;
        if (maxVol > 0) {
          try { const md = getOptionsMarketDataCached(sym); const vol = Number(md.volatility || md.iv || 0); if (vol > maxVol) continue; } catch (_) {}
        }
        scored.push({ symbol: sym, score });
      } catch (_) { scored.push({ symbol: sym, score: 0.5 }); }
    }
    scored.sort((a,b)=> Math.abs(b.score-0.5) - Math.abs(a.score-0.5));
    const picks = scored.slice(0, Math.max(1, Number(top||3)));
    const legs = [];
    // Kelly params
    const kellyCfg = (quantumSystem.quantumConfig?.kelly || { maxFraction: 0.25 });
    const costs = (quantumSystem.quantumConfig?.costs || { takerFeeRate: 0.001, slippageBps: 5 });
    const costRate = (Number(costs.takerFeeRate || 0.001) * 2) + (Number(costs.slippageBps || 5) / 10000);
    for (const p of picks) {
      const bull = p.score >= 0.6; const bear = p.score <= 0.4;
      const futSym = p.symbol.endsWith('USDT') ? p.symbol : `${p.symbol}USDT`;
      if (!(bull || bear)) continue;
      let sizeUnits = 1;
      if (kelly) {
        const probWin = Math.min(0.99, Math.max(0.01, p.score >= 0.5 ? p.score : 1 - p.score));
        const reward = 0.02; const risk = 0.01;
        const grossEdge = probWin * reward - (1 - probWin) * risk;
        const netEdge = grossEdge - costRate;
        if (netEdge > 0) {
          const R = reward / Math.max(1e-6, risk);
          const rawKelly = Math.max(0, (probWin * (R + 1) - 1) / R);
          const kf = Math.min(Number(kellyCfg.maxFraction || 0.25), rawKelly * 0.5);
          const maxF = Math.max(1e-6, Number(kellyCfg.maxFraction || 0.25));
          const buckets = 5; sizeUnits = Math.max(1, Math.min(5, Math.round((kf / maxF) * buckets)));
        }
      }
      if (bull) { legs.push({ type:'options', symbol:p.symbol, side:'BUY', size: sizeUnits }); legs.push({ type:'futures', symbol:futSym, side:'SELL', size: sizeUnits }); }
      if (bear) { legs.push({ type:'options', symbol:p.symbol, side:'SELL', size: sizeUnits }); legs.push({ type:'futures', symbol:futSym, side:'BUY', size: sizeUnits }); }
    }
    return legs;
  }

  async function executeUnifiedLegsInternal(legs, caps) {
    // Reutiliza la lógica de unified/execute sin rutas
    const kellyCfg = (quantumSystem.quantumConfig?.kelly || { riskCapNotional: 0.2 });
    const balanceOptions = Number(quantumSystem?.getPerformanceMetrics?.().availableUSDT || 0) || 0;
    const balanceFutures = Number(vigoFutures?.trader?.balance?.available || vigoFutures?.trader?.balance?.availableBalance || 0) || 0;
    const totalBalance = (balanceOptions || 0) + (balanceFutures || 0);
    const cap = Math.max(0, Math.min(1, Number(kellyCfg.riskCapNotional || 0.2))) * totalBalance;
    const currentOptExposure = Array.isArray(quantumSystem?.activePositions) ? quantumSystem.activePositions.reduce((s, p) => s + Number(p.entryPrice || 0) * Number(p.quantity || 0), 0) : 0;
    const currentFutExposure = vigoFutures?.trader?.positions ? Array.from(vigoFutures.trader.positions.values()).reduce((s, p) => s + Math.abs(Number(p.markPrice || p.entryPrice || 0) * Number(p.size || 0)), 0) : 0;
    let usedExposure = currentOptExposure + currentFutExposure;
    const perSymbolCapUSD = Number(caps?.perSymbolCapUSD || 0);
    const symbolExposure = new Map();
    const results = [];
    for (const leg of legs) {
      const kind = String(leg.type || 'options').toLowerCase();
      const symbol = String(leg.symbol || '').toUpperCase();
      const side = String(leg.side || 'BUY').toUpperCase();
      const size = Math.max(1, Number(leg.size || 1));
      let px = 0;
      try { if (kind === 'futures') { const md = vigoFutures?.trader?.getMarketData?.(symbol) || {}; px = Number(md.lastPrice || md.price || 0) || 0; } else { const md = quantumSystem?.getMarketDataForSymbol?.(symbol) || {}; px = Number(md.price || 0) || 0; } } catch(_) {}
      const marginal = px * size;
      if (perSymbolCapUSD > 0 && px > 0) {
        const used = Number(symbolExposure.get(symbol) || 0);
        if (used + marginal > perSymbolCapUSD) { const remain = Math.max(0, perSymbolCapUSD - used); const maxQty = Math.floor(remain / px); if (!maxQty || maxQty <= 0) { results.push({ success:false, error:'Cap por símbolo', leg }); continue; } leg.size = maxQty; }
      }
      if (px > 0 && usedExposure + marginal > cap) { const remaining = Math.max(0, cap - usedExposure); const maxQty = Math.floor(remaining / px); if (!maxQty || maxQty <= 0) { results.push({ success:false, error:'Cap de riesgo', leg }); continue; } leg.size = maxQty; }
      try {
        if (kind === 'futures') { const opportunity = await vigoFutures.trader.evaluateTradingOpportunity(symbol); opportunity.side = side; opportunity.size = Number(leg.size); const r = await vigoFutures.trader.executeTrade(opportunity); results.push({ success:true, leg, result:r }); const spend = px * Number(leg.size); usedExposure += spend; symbolExposure.set(symbol, Number(symbolExposure.get(symbol) || 0) + spend); }
        else { const strat = { strategy:'directional_options', direction: side, confidence: 0.6 }; const r = await quantumSystem.executeTradingSignal({ symbol, ...strat }); results.push({ success: !!r, leg, result: r }); const spend = px * Number(leg.size); usedExposure += spend; symbolExposure.set(symbol, Number(symbolExposure.get(symbol) || 0) + spend); }
      } catch (e) { results.push({ success:false, error: e?.message || 'Error', leg }); }
    }
    return { results, cap, usedExposure, perSymbolCapUSD };
  }

  router.post('/unified/auto-hedge', async (req, res) => {
    try {
      const chunks = []; req.on('data', c => chunks.push(c)); await new Promise(r => req.on('end', r));
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
      let symbols = [];
      if (Array.isArray(body.symbols)) symbols = body.symbols.map(s=> String(s||'').toUpperCase()).filter(Boolean);
      const sone = String(body.symbol || '').toUpperCase(); if (sone) symbols = [sone];
      if (!symbols.length) symbols = (config.quantum?.symbols || []).slice(0, 3);
      const legs = [];
      // Parámetros Kelly y costes
      const kellyCfg = (quantumSystem.quantumConfig?.kelly || { maxFraction: 0.25 });
      const costs = (quantumSystem.quantumConfig?.costs || { takerFeeRate: 0.001, slippageBps: 5 });
      const costRate = (Number(costs.takerFeeRate || 0.001) * 2) + (Number(costs.slippageBps || 5) / 10000);
      for (const sym of symbols) {
        try {
          const factors = typeof quantumSystem.getCurrentQuantumFactors === 'function' ? (quantumSystem.getCurrentQuantumFactors(sym) || []) : [];
          const score = typeof quantumSystem.calculateQuantumScore === 'function' ? quantumSystem.calculateQuantumScore(factors) : 0.5;
          const futSym = sym.endsWith('USDT') ? sym : `${sym}USDT`;
          let pair = null;
          if (score >= 0.6) {
            pair = [ { type:'options', symbol:sym, side:'BUY' }, { type:'futures', symbol:futSym, side:'SELL' } ];
          } else if (score <= 0.4) {
            pair = [ { type:'options', symbol:sym, side:'SELL' }, { type:'futures', symbol:futSym, side:'BUY' } ];
          }
          if (!pair) continue;
          // Kelly sizing por símbolo
          const probWin = Math.min(0.99, Math.max(0.01, score >= 0.5 ? score : 1 - score));
          // Heurísticos reward/risk: opciones más volátiles que futuros
          const reward = 0.02; // 2%
          const risk = 0.01;   // 1%
          const grossEdge = probWin * reward - (1 - probWin) * risk;
          const netEdge = grossEdge - costRate;
          let kellyFraction = 0.0;
          if (netEdge > 0) {
            const R = reward / Math.max(1e-6, risk);
            const rawKelly = Math.max(0, (probWin * (R + 1) - 1) / R);
            kellyFraction = Math.min(Number(kellyCfg.maxFraction || 0.25), rawKelly * 0.5);
          }
          // Mapear fracción a tamaño discreto [1..5]
          const maxF = Math.max(1e-6, Number(kellyCfg.maxFraction || 0.25));
          const buckets = 5;
          const sizeUnits = Math.max(1, Math.min(5, Math.round((kellyFraction / maxF) * buckets)));
          pair.forEach(leg => legs.push({ ...leg, size: sizeUnits }));
        } catch (_) {}
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, legs }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err?.message || 'Error en unified/auto-hedge' }));
    }
  });

  router.get('/futures/start', async (req, res) => {
    if (!VIGO_FUTURES_ENABLED) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Flag VIGO_FUTURES_ENABLED desactivada' }));
    }
    if (!vigoFutures) {
      try {
        const BotFuturos = require('./VigoFutures/bot-futuros/futures-bot');
        vigoFutures = new BotFuturos();
        await vigoFutures.start();
        vigoAvailable = true;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'VigoFutures iniciado' }));
      } catch (err) {
        vigoAvailable = false;
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: err?.message || 'No se pudo iniciar VigoFutures' }));
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'VigoFutures ya estaba activo' }));
  });

  router.get('/futures/stop', (req, res) => {
    if (vigoFutures) {
      try { vigoFutures.stop(); } catch (_) {}
      vigoAvailable = false;
      vigoFutures = null;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'VigoFutures detenido' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'VigoFutures no estaba activo' }));
  });

  // === AI/ML endpoints (opcionales) ===
  router.get('/ai-ml/status', (req, res) => {
    if (!AI_ML_ENABLED || !aiMlAvailable) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ enabled: false, available: false }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      enabled: true,
      available: true,
      state: aiMlSystem?.mlState || {},
      metrics: aiMlSystem?.mlMetrics || {}
    }));
  });

  router.get('/ai-ml/start', (req, res) => {
    if (!AI_ML_ENABLED || !aiMlAvailable) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'AI/ML no disponible' }));
    }
    aiMlSystem.start();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'AI/ML iniciado' }));
  });

  router.get('/ai-ml/stop', (req, res) => {
    if (!AI_ML_ENABLED || !aiMlAvailable) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'AI/ML no disponible' }));
    }
    aiMlSystem.stop();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'AI/ML detenido' }));
  });

  router.get('/ai-ml/predict', async (req, res) => {
    try {
      if (!AI_ML_ENABLED || !aiMlAvailable) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'AI/ML no disponible' }));
      }
      const urlObj = new URL(req.url, `http://${req.headers.host}`);
      const inputParam = urlObj.searchParams.get('input') || '';
      const vector = inputParam
        ? inputParam.split(',').map(v => Number(v.trim())).filter(v => Number.isFinite(v))
        : [];
      const output = await aiMlSystem.predict(vector);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ input: vector, output, timestamp: new Date().toISOString() }));
    } catch (error) {
      logger.error('Error en /ai-ml/predict:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });

  // Endpoints para el sistema cuántico del lado oscuro
  router.get('/quantum/status', (req, res) => {
    try {
        const quantumMetrics = quantumSystem.getQuantumMetrics();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'quantum_active',
            side: 'dark', // Lado oscuro de la luna
            capabilities: quantumSystem.quantumCapabilities,
            metrics: quantumMetrics,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'error',
            error: error.message 
        }));
    }
  });

  router.get('/quantum/signals', async (req, res) => {
    try {
        const quantumSignals = await quantumSystem.generateQuantumTradingSignals();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            signals: quantumSignals,
            count: quantumSignals.length,
            quantum: true,
            perfect: true,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'error',
            error: error.message 
        }));
    }
  });

  router.get('/quantum/matrix', async (req, res) => {
    try {
        const quantumMatrix = await quantumSystem.updateQuantumMatrix();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            matrix: quantumMatrix,
            symbols: quantumSystem.config.quantum.symbols,
            quantum: true,
            infinite: true,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'error',
            error: error.message 
        }));
    }
  });

  router.get('/quantum/initialize', async (req, res) => {
    try {
        const success = await quantumSystem.initializeQuantumSystem();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: success ? 'quantum_initialized' : 'quantum_failed',
            side: 'dark',
            capabilities: quantumSystem.quantumCapabilities,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'error',
            error: error.message 
        }));
    }
  });

  // [NIGHT] Endpoints para el Sistema de Captura Inteligente
  router.get('/intelligent-data/status', (req, res) => {
    try {
        if (!intelligentDataSystem) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
                status: 'not_available',
                message: 'Sistema de captura inteligente no disponible'
            }));
        }
        
        const stats = intelligentDataSystem.getStats();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'active',
            system: 'IntelligentDataCaptureSystem',
            layers: Object.keys(intelligentDataSystem.layers),
            stats: stats,
            adapter: intelligentDataAdapter ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'error',
            error: error.message 
        }));
    }
  });

  router.get('/intelligent-data/analysis', async (req, res) => {
    try {
        if (!intelligentDataSystem) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Sistema de captura inteligente no disponible' }));
        }
        
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const symbols = urlObj.searchParams.get('symbols');
        const symbolArray = symbols ? symbols.split(',') : null;
        
        const analysisData = await intelligentDataSystem.getAnalysisData(symbolArray);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: analysisData,
            source: 'IntelligentDataCaptureSystem',
            layer: 'analysis',
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'error',
            error: error.message 
        }));
    }
  });

  router.get('/intelligent-data/execution/:symbol/:type', async (req, res) => {
    try {
        if (!intelligentDataSystem) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Sistema de captura inteligente no disponible' }));
        }
        
        const { symbol, type } = req.params;
        let executionData;
        
        if (type === 'futures') {
            executionData = await intelligentDataSystem.getFuturesExecutionData([symbol]);
        } else if (type === 'options') {
            executionData = await intelligentDataSystem.getOptionsExecutionData([symbol]);
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Tipo de ejecución no válido. Use "futures" o "options"' }));
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            data: executionData,
            source: 'IntelligentDataCaptureSystem',
            layer: 'execution',
            type: type,
            symbol: symbol,
            timestamp: new Date().toISOString()
        }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'error',
            error: error.message 
        }));
    }
  });

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  quantumSystem.stop();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
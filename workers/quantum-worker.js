
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
} = require('../src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

// Lightweight quantum worker: parallel scoring for symbols
const { parentPort } = require('worker_threads');

function getLambda(universalFrequency) {
  const uf = Number(universalFrequency || 7919);
  return Math.log(uf);
}

function generateDeterministicFactors(symbol, cols, lambda) {
  const size = Math.max(1, Number(cols || 8));
  const lam = Number(lambda || Math.log(7919));
  const seed = hashSymbol(symbol);
  const arr = new Array(size);
  for (let j = 0; j < size; j++) {
    const positionFactor = (seed + j + 1);
    const real = 9 * Math.cos(lam * positionFactor);
    const imag = 16 * Math.sin(lam * positionFactor);
    const magnitude = Math.sqrt(real * real + imag * imag);
    const normalized = Math.abs(Math.sin(magnitude) * Math.cos(lam * positionFactor));
    arr[j] = normalized;
  }
  return arr;
}

function coreScoreFromFactors(factors) {
  if (!Array.isArray(factors) || factors.length === 0) return 0.5;
  const s = factors.reduce((a, b) => a + (Number(b) || 0), 0);
  return Math.max(0, Math.min(1, s / (factors.length * 1.0)));
}

function ensembleScore(symbol, weights, aiScores, vigoScores, cols, lambda) {
  const w = weights || { coreWeight: 1, aiWeight: 0, vigoWeight: 0 };
  const core = coreScoreFromFactors(generateDeterministicFactors(symbol, cols, lambda));
  const ai = Number((aiScores && aiScores[symbol]) || 0) || 0;
  const vigo = Number((vigoScores && vigoScores[symbol]) || 0) || 0;
  const sum = Math.max(1e-9, Number(w.coreWeight||0)+Number(w.aiWeight||0)+Number(w.vigoWeight||0));
  return (Number(w.coreWeight||0)*core + Number(w.aiWeight||0)*ai + Number(w.vigoWeight||0)*vigo) / sum;
}

function hashSymbol(sym) {
  const s = String(sym || 'SYM');
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h % 9973) + 1; // prime-ish
}

parentPort.on('message', (msg) => {
  try {
    const { task } = msg || {};
    if (task === 'scoreSymbols') {
      const symbols = Array.isArray(msg.symbols) ? msg.symbols : [];
      const weights = msg.weights || { coreWeight: 1, aiWeight: 0, vigoWeight: 0 };
      const aiMap = msg.aiScores || {}; // plain object
      const vigoMap = msg.vigoScores || {};
      const lambda = getLambda(msg.universalFrequency || 7919);
      const cols = Number(msg.cols || 8);
      const out = symbols.map(symbol => ({ symbol, score: ensembleScore(symbol, weights, aiMap, vigoMap, cols, lambda) }));
      parentPort.postMessage({ ok: true, data: out });
      return;
    }
    parentPort.postMessage({ ok: false, error: 'Unknown task' });
  } catch (e) {
    parentPort.postMessage({ ok: false, error: e?.message || 'Worker error' });
  }
});



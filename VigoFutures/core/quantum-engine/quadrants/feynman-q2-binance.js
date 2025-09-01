
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

const { FeynmanQuadrantsOptimizer } = require('../modules/FeynmanQuadrantsOptimizer');
const { QuantumProfitMaximizer } = require('../QuantumProfitMaximizer');
const { BinanceRateLimitOptimizer } = require('../modules/BinanceRateLimitOptimizer');

console.log('[FEYNMAN-Q2] Iniciando Cuadrante II - Plano Complejo Superior Izquierdo (Binance Rate Limits)...');

const feynman = new FeynmanQuadrantsOptimizer();
const binanceOpt = new BinanceRateLimitOptimizer();
const maximizer = new QuantumProfitMaximizer();

// Configurar optimización de límites de tasa para Binance
maximizer.maximizerConfig.maxSimultaneousStreams = binanceOpt.getMaxConcurrentStreams();

// Iniciar ciclo de maximización de beneficios cuánticos
setInterval(() => {
  try {
    maximizer.maximizeQuantumProfits();
    console.log('[FEYNMAN-Q2] Ciclo de maximización completado - Streams:', maximizer.maximizerConfig.maxSimultaneousStreams);
  } catch (error) {
    console.error('[FEYNMAN-Q2] Error en ciclo de maximización:', error.message);
  }
}, 15000);

console.log('[FEYNMAN-Q2] Cuadrante II iniciado correctamente con optimización de rate limits Binance');
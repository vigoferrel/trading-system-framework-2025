
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
const { LunarHiddenFaceOptimizer } = require('../modules/LunarHiddenFaceOptimizer');

console.log('[FEYNMAN-Q4] Iniciando Cuadrante IV - Plano Complejo Inferior Derecho (Binance Lunar Optimization)...');

const feynman = new FeynmanQuadrantsOptimizer();
const lunar = new LunarHiddenFaceOptimizer();
const maximizer = new QuantumProfitMaximizer();

// Configurar optimización lunar para Binance
maximizer.maximizerConfig.transTemporalAdvantage = lunar.getTemporalAdvantage();

// Iniciar ciclo de maximización de beneficios cuánticos
setInterval(() => {
  try {
    maximizer.maximizeQuantumProfits();
    console.log('[FEYNMAN-Q4] Ciclo de maximización completado - Temporal Advantage:', maximizer.maximizerConfig.transTemporalAdvantage);
  } catch (error) {
    console.error('[FEYNMAN-Q4] Error en ciclo de maximización:', error.message);
  }
}, 15000);

console.log('[FEYNMAN-Q4] Cuadrante IV iniciado correctamente con optimización lunar Binance');
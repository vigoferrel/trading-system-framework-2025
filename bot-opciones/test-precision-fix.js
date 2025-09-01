
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

const BinanceConnector = require('./binance-connector.js');

// Test precision rules for XRP and DOGE
const testSymbols = ['XRPUSDT', 'DOGEUSDT', 'BTCUSDT', 'ETHUSDT'];

testSymbols.forEach(symbol => {
    const connector = new BinanceConnector();
    const precision = connector.getPrecision(symbol, 100);
    console.log(`[TEST] ${symbol}: precision=${precision}, quantity=100`);
});
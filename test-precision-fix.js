
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

const BinanceConnector = require('./binance-connector');

// Test the precision formatting function directly
const connector = new BinanceConnector();

console.log('Testing precision formatting:');

// Test XRP
const xrpOriginal = 14.243711085889572;
const xrpFormatted = connector._formatQuantityPrecision('XRPUSDT', xrpOriginal);
console.log(`XRP: ${xrpOriginal} -> ${xrpFormatted} (should be integer)`);

// Test DOGE
const dogeOriginal = 191.8780914876033;
const dogeFormatted = connector._formatQuantityPrecision('DOGEUSDT', dogeOriginal);
console.log(`DOGE: ${dogeOriginal} -> ${dogeFormatted} (should be integer)`);

// Test BTC (should work normally)
const btcOriginal = 0.001;
const btcFormatted = connector._formatQuantityPrecision('BTCUSDT', btcOriginal);
console.log(`BTC: ${btcOriginal} -> ${btcFormatted} (should be 0.001)`);

// Test ETH (should work normally)
const ethOriginal = 0.0109489502805942;
const ethFormatted = connector._formatQuantityPrecision('ETHUSDT', ethOriginal);
console.log(`ETH: ${ethOriginal} -> ${ethFormatted} (should be 0.011)`);
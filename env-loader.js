
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
 * Cargador centralizado de variables de entorno para el sistema cuántico
 * 
 * Este módulo carga las variables de entorno desde un único archivo .env
 * en el directorio raíz del proyecto y las exporta para que sean utilizadas
 * por todos los componentes del sistema. Esto evita duplicaciones y asegura
 * que las claves correctas se utilicen en todo el sistema.
 * 
 * @author Quantum Trading Team
 * @version 1.0.0
 */

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env en el directorio raíz
const envPath = path.resolve(__dirname, '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error(`Error cargando variables de entorno desde ${envPath}:`, result.error);
  
  // Intentar cargar desde .env.example si .env no existe
  const exampleEnvPath = path.resolve(__dirname, '.env.example');
  if (fs.existsSync(exampleEnvPath)) {
    console.log(`Intentando cargar desde ${exampleEnvPath}...`);
    dotenv.config({ path: exampleEnvPath });
  }
}

// Verificar si hay claves configuradas (familias dedicadas o genéricas)
const hasGeneric = !!(process.env.BINANCE_API_KEY && process.env.BINANCE_API_SECRET);
const hasEapi = !!(process.env.BINANCE_EAPI_API_KEY && process.env.BINANCE_EAPI_API_SECRET);
const hasFapi = !!(process.env.BINANCE_FAPI_API_KEY && process.env.BINANCE_FAPI_API_SECRET);
if (!hasGeneric && !hasEapi && !hasFapi) {
  console.warn('[WARNING] ADVERTENCIA: No se encontraron claves API de Binance (EAPI/FAPI o genéricas).');
  console.warn('El sistema funcionará en modo simulación y algunas funciones se degradarán.');
} else {
  const families = [
    hasEapi ? 'EAPI' : null,
    hasFapi ? 'FAPI' : null,
    hasGeneric ? 'GENERIC' : null
  ].filter(Boolean).join(', ');
  console.log(`[OK] Claves API de Binance cargadas (${families})`);
}

// Constantes cuánticas fundamentales
const QUANTUM_Z_REAL = 9;
const QUANTUM_Z_IMAG = 16;
const QUANTUM_LAMBDA = Math.log(7919);

// Exportar variables de entorno y constantes cuánticas
module.exports = {
  // Binance API (families)
  BINANCE_API_KEY: process.env.BINANCE_API_KEY,
  BINANCE_API_SECRET: process.env.BINANCE_API_SECRET,
  BINANCE_EAPI_API_KEY: process.env.BINANCE_EAPI_API_KEY,
  BINANCE_EAPI_API_SECRET: process.env.BINANCE_EAPI_API_SECRET,
  BINANCE_FAPI_API_KEY: process.env.BINANCE_FAPI_API_KEY,
  BINANCE_FAPI_API_SECRET: process.env.BINANCE_FAPI_API_SECRET,
  BINANCE_SPOT_BASE_URL: process.env.BINANCE_SPOT_BASE_URL || 'https://api.binance.com/api/v3',
  BINANCE_OPTIONS_BASE_URL: process.env.BINANCE_OPTIONS_BASE_URL || 'https://eapi.binance.com/eapi/v1',
  BINANCE_FAPI_BASE_URL: process.env.BINANCE_FAPI_BASE_URL || 'https://fapi.binance.com/fapi/v1',
  BINANCE_TESTNET: process.env.BINANCE_TESTNET === 'true',
  
  // VPN Configuration
  VPN_IP: process.env.VPN_IP || '192.168.173.160',
  VPN_PORT: process.env.VPN_PORT || 1862,
  
  // Quantum Constants
  QUANTUM_Z_REAL,
  QUANTUM_Z_IMAG,
  QUANTUM_LAMBDA,
  QUANTUM_Z_COMPLEX: `${QUANTUM_Z_REAL} + ${QUANTUM_Z_IMAG}i`,
  
  // Helper function to get all environment variables
  getAll: () => process.env
};
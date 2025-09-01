
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
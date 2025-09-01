
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
 * Configuración de PM2 para gestión de procesos del sistema Quantum Trading
 * 
 * Este archivo define la configuración para ejecutar los componentes del sistema
 * con PM2, incluyendo variables de entorno, monitoreo y reinicio automático.
 */

module.exports = {
  apps: [
    {
      name: 'quantum-core',
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
        CORE_PORT: 4601,
        VIGO_FUTURES_ENABLED: 'false',
        FAST_PERFORMANCE: 'true',
        TRADE_MODE: 'unified',
        AUTOSTART_UNIFIED_AUTO_EXEC: 'true',
        AUTOEXEC_INTERVAL_SEC: '120',
        AUTOEXEC_TOP: '5',
        AUTOEXEC_PER_SYMBOL_CAP_USD: '0'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/quantum-core-error.log',
      out_file: 'logs/quantum-core-out.log',
      merge_logs: true,
      restart_delay: 5000
    },
    {
      name: 'quantum-frontend',
      script: 'frontend-api-extended.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4602
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/quantum-frontend-error.log',
      out_file: 'logs/quantum-frontend-out.log',
      merge_logs: true,
      restart_delay: 5000
    },
    {
      name: 'quantum-monitor',
      script: 'quantum-real-time-monitor.js',
      env: {
        NODE_ENV: 'production',
        MONITOR_PORT: 8082
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/quantum-monitor-error.log',
      out_file: 'logs/quantum-monitor-out.log',
      merge_logs: true,
      restart_delay: 5000
    }
  ]
};

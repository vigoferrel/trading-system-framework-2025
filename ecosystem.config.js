
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


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
 * Configuración Centralizada del Frontend
 * Unifica todas las URLs y configuraciones del sistema
 */

// Configuración de URLs
const CONFIG = {
    // URLs principales
    FRONTEND_URL: window.location.hostname === 'localhost' ? 'http://localhost:4603' : '',
    CORE_URL: window.location.hostname === 'localhost' ? 'http://localhost:4601' : '/core',
    
    // Endpoints del frontend
    ENDPOINTS: {
        STATUS: '/api/status',
        HEALTH: '/health',
        MARKET_DATA: '/api/market-data',
        QUANTUM_FACTORS: '/api/quantum-factors',
        QUANTUM_STATE: '/api/quantum-state',
        QUANTUM_MATRIX: '/api/quantum-matrix',
        PERFORMANCE: '/api/performance',
        ALERTS: '/api/alerts',
        ADMIN_OVERVIEW: '/api/admin/overview',
        CACHE_PERFORMANCE: '/api/cache/performance',
        MARKET_SPARKLINE: '/api/market-sparkline',
        ORDERBOOK: '/api/orderbook',
        KLINES: '/api/klines'
    },
    
    // Endpoints del core
    CORE_ENDPOINTS: {
        HEALTH: '/health',
        MARKET_DATA: '/api/market-data',
        QUANTUM_FACTORS: '/api/quantum-factors',
        QUANTUM_STATE: '/api/quantum-state',
        QUANTUM_MATRIX: '/api/quantum-matrix',
        PERFORMANCE: '/api/performance',
        ALERTS: '/api/alerts',
        ADMIN_OVERVIEW: '/api/admin/overview'
    },
    
    // Configuración de rendimiento
    PERFORMANCE: {
        REFRESH_INTERVAL: 30000, // 30 segundos
        BATCH_SIZE: 50,
        THROTTLE_DELAY: 16, // 60fps
        DEBOUNCE_DELAY: 300,
        MAX_CONCURRENT_REQUESTS: 10,
        REQUEST_TIMEOUT: 15000,
        RETRY_ATTEMPTS: 3,
        CACHE_CLEANUP_INTERVAL: 300000, // 5 minutos
        MEMORY_THRESHOLD: 0.8
    },
    
    // Configuración de caché
    CACHE: {
        TTL: 30000, // 30 segundos
        MAX_SIZE: 100,
        CLEANUP_INTERVAL: 60000, // 60 segundos
        COHERENCE_WEIGHT: 0.25
    },
    
    // Configuración de monitoreo
    MONITORING: {
        HEALTH_CHECK_INTERVAL: 60000, // 1 minuto
        UI_UPDATE_INTERVAL: 1000, // 1 segundo
        CORE_STATUS_INTERVAL: 10000, // 10 segundos
        REQUEST_TIMEOUT: 3000 // 3 segundos
    }
};

// Funciones de utilidad
const API_UTILS = {
    // Obtener URL completa del frontend
    getFrontendUrl: (endpoint) => `${CONFIG.FRONTEND_URL}${endpoint}`,
    
    // Obtener URL completa del core
    getCoreUrl: (endpoint) => `${CONFIG.CORE_URL}${endpoint}`,
    
    // Verificar si el core está disponible
    async checkCoreHealth() {
        try {
            const response = await fetch(this.getCoreUrl(CONFIG.CORE_ENDPOINTS.HEALTH), {
                method: 'GET',
                headers: { 'Cache-Control': 'no-cache' },
                signal: AbortSignal.timeout(CONFIG.MONITORING.REQUEST_TIMEOUT)
            });
            return response.ok;
        } catch (error) {
            console.warn('Core health check failed:', error.message);
            return false;
        }
    },
    
    // Realizar request con fallback
    async requestWithFallback(frontendEndpoint, coreEndpoint, options = {}) {
        try {
            // Intentar frontend primero
            const frontendUrl = this.getFrontendUrl(frontendEndpoint);
            const response = await fetch(frontendUrl, {
                ...options,
                signal: AbortSignal.timeout(CONFIG.PERFORMANCE.REQUEST_TIMEOUT)
            });
            
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.warn('Frontend request failed, trying core:', error.message);
        }
        
        try {
            // Fallback al core
            const coreUrl = this.getCoreUrl(coreEndpoint);
            const response = await fetch(coreUrl, {
                ...options,
                signal: AbortSignal.timeout(CONFIG.PERFORMANCE.REQUEST_TIMEOUT)
            });
            
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Core request also failed:', error.message);
            throw error;
        }
    }
};

// Exportar configuración global
window.CONFIG = CONFIG;
window.API_UTILS = API_UTILS;

// Log de configuración
console.log('[NIGHT] Configuración del frontend cargada:', {
    frontendUrl: CONFIG.FRONTEND_URL,
    coreUrl: CONFIG.CORE_URL,
    endpoints: Object.keys(CONFIG.ENDPOINTS).length,
    coreEndpoints: Object.keys(CONFIG.CORE_ENDPOINTS).length
});

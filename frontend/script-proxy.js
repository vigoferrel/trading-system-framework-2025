
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
 * Script Proxy for Quantum Trading Dashboard
 * Provides proxy functionality for cross-origin requests and script loading
 */

// Quantum Trading Dashboard Script Proxy
const QuantumScriptProxy = {
    // Initialize proxy functionality
    init() {
        console.log(' Quantum Script Proxy initialized');
        this.setupCORS();
        this.setupWebSocketProxy();
        this.setupAPIProxy();
    },

    // Setup CORS handling
    setupCORS() {
        // Add CORS headers for cross-origin requests
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => {
                console.log('[RELOAD] Cleaning up proxy connections...');
            });
        }
    },

    // Setup WebSocket proxy for real-time data
    setupWebSocketProxy() {
        if (typeof window !== 'undefined' && window.WebSocket) {
            const originalWebSocket = window.WebSocket;
            window.WebSocket = function(url, protocols) {
                console.log(' WebSocket proxy intercepting:', url);
                const ws = new originalWebSocket(url, protocols);
                
                ws.addEventListener('open', () => {
                    console.log('[OK] WebSocket connection established via proxy');
                });
                
                ws.addEventListener('error', (error) => {
                    console.warn('[ERROR] WebSocket error via proxy:', error);
                });
                
                return ws;
            };
        }
    },

    // Setup API proxy for backend requests
    setupAPIProxy() {
        if (typeof window !== 'undefined' && window.fetch) {
            const originalFetch = window.fetch;
            window.fetch = function(url, options = {}) {
                console.log('[API] API proxy intercepting:', url);
                
                // Add default headers for quantum trading requests
                const defaultHeaders = {
                    'Content-Type': 'application/json',
                    'X-Quantum-Client': 'dashboard',
                    'X-Requested-With': 'XMLHttpRequest'
                };
                
                const mergedOptions = {
                    ...options,
                    headers: {
                        ...defaultHeaders,
                        ...(options.headers || {})
                    }
                };
                
                return originalFetch(url, mergedOptions)
                    .then(response => {
                        console.log('[OK] API response via proxy:', response.status);
                        return response;
                    })
                    .catch(error => {
                        console.warn('[ERROR] API error via proxy:', error);
                        throw error;
                    });
            };
        }
    },

    // Proxy utility functions
    utils: {
        // Create secure request headers
        createSecureHeaders(additionalHeaders = {}) {
            return {
                'Content-Type': 'application/json',
                'X-Quantum-Timestamp': Date.now(),
                'X-Quantum-Version': '1.0.0',
                ...additionalHeaders
            };
        },

        // Handle proxy errors
        handleProxyError(error, context = 'unknown') {
            console.error(`[ALERT] Proxy error in ${context}:`, error);
            
            // Emit custom event for error handling
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('quantumProxyError', {
                    detail: { error, context }
                }));
            }
        },

        // Validate proxy response
        validateResponse(response) {
            if (!response.ok) {
                throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`);
            }
            return response;
        }
    }
};

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    // Initialize immediately if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            QuantumScriptProxy.init();
        });
    } else {
        QuantumScriptProxy.init();
    }
} else if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = QuantumScriptProxy;
}

// Global export
if (typeof window !== 'undefined') {
    window.QuantumScriptProxy = QuantumScriptProxy;
}

console.log(' Quantum Script Proxy loaded successfully');
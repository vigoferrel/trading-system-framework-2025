
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
 * AXIOS MOCK FOR TESTING
 * ======================
 * Mock simple de axios para testing sin dependencias externas
 */

class AxiosMock {
    static async get(url, config = {}) {
        return {
            data: { success: true, mock: true, url, config },
            status: 200,
            statusText: 'OK'
        };
    }
    
    static async post(url, data = null, config = {}) {
        return {
            data: { 
                success: true, 
                mock: true, 
                url, 
                data, 
                config,
                orderId: 'mock_' + Date.now()
            },
            status: 200,
            statusText: 'OK'
        };
    }
    
    static async delete(url, config = {}) {
        return {
            data: { success: true, mock: true, url, config },
            status: 200,
            statusText: 'OK'
        };
    }
}

module.exports = AxiosMock;


// ==========================================
// CONSTANTES UNIFICADAS - Usar PHYSICAL_CONSTANTS de script.js
// ==========================================

/**
 * Módulo para actualizar el estado de conexión con el core
 * Versión optimizada con configuración centralizada
 */

async function updateCoreStatus() {
    try {
        // Verificar si la configuración está disponible
        if (!window.CONFIG || !window.API_UTILS) {
            console.warn('Configuración no disponible, usando fallback');
            await updateCoreStatusFallback();
            return;
        }

        // Verificar salud del core directamente
        const coreHealthy = await window.API_UTILS.checkCoreHealth();
        
        // Obtener estado detallado del frontend
        const frontendResponse = await fetch(window.API_UTILS.getFrontendUrl(window.CONFIG.ENDPOINTS.STATUS));
        const frontendData = frontendResponse.ok ? await frontendResponse.json() : null;
        
        // Determinar estado final
        let coreStatus = 'offline';
        let statusText = 'DESCONECTADO';
        let statusClass = 'status-offline';
        let dataSource = 'N/A';
        
        if (coreHealthy) {
            coreStatus = 'online';
            statusText = 'CONECTADO';
            statusClass = 'status-online';
            dataSource = 'BINANCE_REAL';
        } else if (frontendData && frontendData.data) {
            // Frontend disponible pero core no
            coreStatus = 'partial';
            statusText = 'PARCIAL';
            statusClass = 'status-partial';
            dataSource = frontendData.data.dataSource || 'FALLBACK';
        }
        
        // Actualizar UI
        updateCoreStatusUI(statusText, statusClass, dataSource);
        
        // Log del estado
        console.log(` Estado Core: ${statusText} (${dataSource})`);
        
    } catch (error) {
        console.error('Error actualizando estado del core:', error);
        updateCoreStatusUI('ERROR', 'status-error', 'ERROR');
    }
}

async function updateCoreStatusFallback() {
    try {
        // Fallback para cuando no hay configuración centralizada
        const response = await fetch('/api/status');
        if (response.ok) {
            const data = await response.json();
            const coreStatusElement = document.getElementById('coreStatus');
            
            if (coreStatusElement) {
                const coreStatus = data.services?.core || 'offline';
                const statusText = coreStatus === 'online' ? 'CONECTADO' : 'DESCONECTADO';
                const statusClass = coreStatus === 'online' ? 'status-online' : 'status-offline';
                
                coreStatusElement.textContent = statusText;
                coreStatusElement.className = `summary-value ${statusClass}`;
            }
        }
    } catch (error) {
        console.error('Error en fallback de estado del core:', error);
        updateCoreStatusUI('ERROR', 'status-error', 'ERROR');
    }
}

function updateCoreStatusUI(statusText, statusClass, dataSource) {
    const coreStatusElement = document.getElementById('coreStatus');
    const dataSourceElement = document.getElementById('dataSource');
    
    if (coreStatusElement) {
        coreStatusElement.textContent = statusText;
        coreStatusElement.className = `summary-value ${statusClass}`;
    }
    
    if (dataSourceElement) {
        dataSourceElement.textContent = dataSource;
        dataSourceElement.className = `summary-value ${statusClass}`;
    }
    
    // Actualizar otros elementos relacionados
    const connectionStatusElements = document.querySelectorAll('.connection-status');
    connectionStatusElements.forEach(element => {
        element.textContent = statusText;
        element.className = `connection-status ${statusClass}`;
    });
}

// Función para verificar conectividad completa
async function checkFullConnectivity() {
    const results = {
        frontend: false,
        core: false,
        binance: false
    };
    
    try {
        // Verificar frontend
        const frontendResponse = await fetch(window.API_UTILS.getFrontendUrl(window.CONFIG.ENDPOINTS.HEALTH));
        results.frontend = frontendResponse.ok;
        
        // Verificar core
        results.core = await window.API_UTILS.checkCoreHealth();
        
        // Verificar datos de Binance (a través del frontend)
        if (results.frontend) {
            const marketResponse = await fetch(window.API_UTILS.getFrontendUrl(window.CONFIG.ENDPOINTS.MARKET_DATA));
            if (marketResponse.ok) {
                const marketData = await marketResponse.json();
                results.binance = marketData.success && Object.keys(marketData.data || {}).length > 0;
            }
        }
        
        console.log('[SEARCH] Conectividad completa:', results);
        return results;
        
    } catch (error) {
        console.error('Error verificando conectividad completa:', error);
        return results;
    }
}

// Configurar intervalos
const CORE_STATUS_INTERVAL = window.CONFIG?.MONITORING?.CORE_STATUS_INTERVAL || 10000;

// Actualizar cada 10 segundos (o según configuración)
setInterval(updateCoreStatus, CORE_STATUS_INTERVAL);

// Actualizar inmediatamente
updateCoreStatus();

// Verificar conectividad completa cada 30 segundos
setInterval(checkFullConnectivity, 30000);

// Exportar funciones para uso global
window.updateCoreStatus = updateCoreStatus;
window.checkFullConnectivity = checkFullConnectivity;

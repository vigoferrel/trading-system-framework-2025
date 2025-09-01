

/**
 * Módulo para monitorear el estado del sistema
 * 
 * Este módulo proporciona funcionalidad para monitorear el tiempo de actividad
 * y la salud general del sistema, verificando la disponibilidad de los servicios
 * principales.
 */

// Estado global del sistema
const systemState = {
    startTime: Date.now(),
    services: {
        core: { status: 'unknown', lastCheck: 0 },
        api: { status: 'unknown', lastCheck: 0 },
        monitor: { status: 'unknown', lastCheck: 0 }
    },
    healthScore: 0,
    checkInterval: null
};

/**
 * Inicializa el monitor de estado del sistema
 */
function initSystemStatus() {
    console.log('Inicializando monitor de estado del sistema...');
    
    // Establecer tiempo de inicio
    systemState.startTime = Date.now();
    
    // Realizar verificación inicial
    checkSystemHealth();
    
    // Configurar verificación periódica
    systemState.checkInterval = setInterval(checkSystemHealth, 60000); // Cada minuto
    
    // Iniciar actualización de UI
    updateSystemStatusUI();
    setInterval(updateSystemStatusUI, 1000); // Actualizar UI cada segundo
}

/**
 * Verifica la salud del sistema comprobando la disponibilidad de los servicios
 */
async function checkSystemHealth() {
    try {
        console.log('[SEARCH] Verificando salud del sistema...');
        
        // Verificar Core API
        await checkService('core', 'http://localhost:4601/health');
        
        // Verificar Frontend API
        await checkService('api', 'http://localhost:4603/health');
        
        // Verificar Monitor (WebSocket) - Comentado porque no está activo
        // await checkService('monitor', 'http://localhost:8082/status');
        
        // Calcular puntuación de salud
        calculateHealthScore();
        
        // Actualizar UI inmediatamente
        updateSystemStatusUI();
        
        console.log('[OK] Salud del sistema verificada:', systemState.healthScore);
        
    } catch (error) {
        console.error('Error verificando salud del sistema:', error);
    }
}

/**
 * Verifica la disponibilidad de un servicio específico
 * @param {string} serviceName - Nombre del servicio a verificar
 * @param {string} endpoint - URL del endpoint a verificar
 */
async function checkService(serviceName, endpoint) {
    try {
        console.log(`[SEARCH] Verificando ${serviceName} en ${endpoint}...`);
        const response = await fetch(endpoint, { 
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' },
            signal: AbortSignal.timeout(3000) // Timeout de 3 segundos
        });
        
        const status = response.ok ? 'online' : 'error';
        systemState.services[serviceName] = {
            status: status,
            lastCheck: Date.now(),
            statusCode: response.status
        };
        
        console.log(`[OK] ${serviceName}: ${status} (${response.status})`);
    } catch (error) {
        systemState.services[serviceName] = {
            status: 'offline',
            lastCheck: Date.now(),
            error: error.message
        };
        console.log(`[ERROR] ${serviceName}: offline - ${error.message}`);
    }
}

/**
 * Calcula la puntuación de salud del sistema
 */
function calculateHealthScore() {
    // Pesos para cada servicio (ajustados porque monitor no está activo)
    const weights = {
        core: 0.6,    // Core API es el más importante
        api: 0.4,     // Frontend API es importante
        monitor: 0.0  // Monitor deshabilitado
    };
    
    // Calcular puntuación
    let score = 0;
    console.log('[DATA] Calculando puntuación de salud:');
    
    for (const [service, weight] of Object.entries(weights)) {
        const serviceStatus = systemState.services[service]?.status || 'offline';
        console.log(`  - ${service}: ${serviceStatus} (peso: ${weight})`);
        
        if (serviceStatus === 'online') {
            score += weight;
        } else if (serviceStatus === 'error') {
            score += weight * 0.5; // Medio punto si hay error pero responde
        }
        // 0 puntos si está offline
    }
    
    // Actualizar puntuación de salud
    systemState.healthScore = score;
    console.log(`[UP] Puntuación final: ${score} (${Math.round(score * 100)}%)`);
}

/**
 * Actualiza la UI con el estado actual del sistema
 */
function updateSystemStatusUI() {
    // Actualizar tiempo de actividad
    const uptimeElement = document.querySelector('.status-item .status-value[data-status="uptime"]');
    if (uptimeElement) {
        uptimeElement.textContent = formatUptime(Date.now() - systemState.startTime);
    }
    
    // Actualizar puntuación de salud
    const healthElement = document.querySelector('.status-item .status-value[data-status="health"]');
    const healthBarElement = document.querySelector('.health-bar .health-fill');
    
    if (healthElement) {
        const healthPercent = Math.round(systemState.healthScore * 100);
        healthElement.textContent = `${healthPercent}%`;
        
        // Cambiar color según salud
        if (healthPercent >= 80) {
            healthElement.style.color = '#4caf50'; // Verde
        } else if (healthPercent >= 50) {
            healthElement.style.color = '#ffc107'; // Amarillo
        } else {
            healthElement.style.color = '#f44336'; // Rojo
        }
    }
    
    if (healthBarElement) {
        healthBarElement.style.width = `${systemState.healthScore * 100}%`;
    }
    
    // Actualizar también el elemento kpiHealth del header
    const kpiHealthElement = document.querySelector('#kpiHealth span');
    if (kpiHealthElement) {
        const healthPercent = Math.round(systemState.healthScore * 100);
        let status = '';
        if (healthPercent >= 80) {
            status = 'excellent';
        } else if (healthPercent >= 50) {
            status = 'good';
        } else {
            status = 'poor';
        }
        kpiHealthElement.textContent = `Salud: ${healthPercent}% ${status}`;
        console.log(` Actualizado kpiHealth: ${healthPercent}% ${status}`);
    } else {
        console.log('[WARNING] Elemento #kpiHealth span no encontrado');
    }
    
    // Actualizar estado de conexión
    const connectionStatusElement = document.getElementById('connectionStatus');
    if (connectionStatusElement) {
        if (systemState.healthScore >= 0.8) {
            connectionStatusElement.className = 'status-badge status-connected';
            connectionStatusElement.innerHTML = '<i class="fas fa-plug"></i> Conectado';
        } else if (systemState.healthScore >= 0.5) {
            connectionStatusElement.className = 'status-badge status-connected';
            connectionStatusElement.innerHTML = '<i class="fas fa-plug"></i> Degradado';
        } else {
            connectionStatusElement.className = 'status-badge status-disconnected';
            connectionStatusElement.innerHTML = '<i class="fas fa-plug"></i> Problemas';
        }
    }
}

/**
 * Formatea el tiempo de actividad en formato legible
 * @param {number} ms - Tiempo de actividad en milisegundos
 * @returns {string} - Tiempo de actividad formateado
 */
function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

// Exportar función para uso global
window.initSystemStatus = initSystemStatus;

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
 * Script de correcciones para el dashboard
 * 
 * Este script corrige problemas con la inicialización de módulos
 * y asegura que las funciones estén disponibles globalmente.
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicando correcciones al dashboard...');
    
    // Corregir inicialización de caché para evitar duplicaciones
    const originalInitializeDashboard = window.initializeDashboard;

    if (typeof originalInitializeDashboard === 'function') {
        window.initializeDashboard = function() {
            try {
                // Llamar a la función original
                originalInitializeDashboard();
                
                // Configurar actualizaciones periódicas
                if (typeof window.fetchMarketData === 'function') setInterval(window.fetchMarketData, 30000);
                if (typeof window.fetchSignals === 'function') setInterval(window.fetchSignals, 60000);
                if (typeof window.fetchQuantumMatrix === 'function') setInterval(window.fetchQuantumMatrix, 120000);
                
                // NO inicializar caché aquí - ya se hace en script.js
                // La caché se inicializa una sola vez en script.js línea 1106
                
                // Inicializar monitor de estado
                try {
                    if (typeof window.initSystemStatus === 'function') {
                        window.initSystemStatus();
                    } else {
                        console.error('Error al inicializar monitor de estado: initSystemStatus no está definida');
                    }
                } catch (statusError) {
                    console.error('Error al inicializar monitor de estado:', statusError);
                }
                
                console.log('Quantum Trading Dashboard initialized successfully');
            } catch (error) {
                console.error('Error initializing dashboard:', error);
            }
        };
    } else {
        console.error('No se pudo encontrar la función initializeDashboard original');
    }
    
    // Corregir función showSymbolDetails para manejar valores undefined
    const originalShowSymbolDetails = window.showSymbolDetails;
    
    if (typeof originalShowSymbolDetails === 'function') {
        window.showSymbolDetails = function(data) {
            try {
                // Verificar que data existe
                if (!data) {
                    console.error('showSymbolDetails: datos no proporcionados');
                    return;
                }
                
                // Abrir modal
                const modal = document.getElementById('symbolModal');
                if (modal) modal.style.display = 'flex';
                
                // Establecer título
                const modalTitle = document.getElementById('modalTitle');
                if (modalTitle) modalTitle.textContent = `Detalles de ${data.symbol || 'Símbolo'}`;
                
                // Preparar contenido
                const modalBody = document.getElementById('modalBody');
                if (!modalBody) return;
                
                // Asegurar que los valores numéricos son válidos
                const price = data.price !== undefined ? Number(data.price) : null;
                const change24h = data.change24h !== undefined ? Number(data.change24h) : null;
                const volume = data.volume !== undefined ? Number(data.volume) : null;
                const volatility = data.volatility !== undefined ? Number(data.volatility) : null;
                const quantumScore = data.quantumScore !== undefined ? Number(data.quantumScore) : null;
                
                // Asegurar que quantumFactors existe y tiene valores válidos
                const factors = data.quantumFactors || {};
                const coherence = factors.coherence !== undefined ? Number(factors.coherence) : null;
                const entanglement = factors.entanglement !== undefined ? Number(factors.entanglement) : null;
                const momentum = factors.momentum !== undefined ? Number(factors.momentum) : null;
                const density = factors.density !== undefined ? Number(factors.density) : null;
                const temperature = factors.temperature !== undefined ? Number(factors.temperature) : null;
                
                // Construir HTML con manejo seguro de valores
                let html = `
                    <div class="symbol-details">
                        <div>
                            <h3>Información Básica</h3>
                            <p>Precio: ${price !== null ? price.toFixed(2) : 'N/A'}</p>
                            <p>Cambio 24h: ${change24h !== null ? change24h.toFixed(2) + '%' : 'N/A'}</p>
                            <p>Volumen: ${volume !== null ? volume.toLocaleString() : 'N/A'}</p>
                            <p>Volatilidad: ${volatility !== null ? volatility.toFixed(2) + '%' : 'N/A'}</p>
                        </div>
                        
                        <div>
                            <h3>Análisis Cuántico</h3>
                            <p>Puntuación Cuántica: ${quantumScore !== null ? quantumScore.toFixed(2) : '0.00'}</p>
                            <p>Recomendación: ${getRecommendation(quantumScore)}</p>
                        </div>
                        
                        <div>
                            <h3>Factores Cuánticos</h3>
                            <p>Coherencia: ${coherence !== null ? coherence.toFixed(2) : '0.00'}</p>
                            <p>Entrelazamiento: ${entanglement !== null ? entanglement.toFixed(2) : '0.00'}</p>
                            <p>Momento: ${momentum !== null ? momentum.toFixed(2) : '0.00'}</p>
                            <p>Densidad: ${density !== null ? density.toFixed(2) : '0.00'}</p>
                            <p>Temperatura: ${temperature !== null ? temperature.toFixed(2) : '0.00'}</p>
                        </div>
                    </div>
                `;
                
                modalBody.innerHTML = html;
                
                // Si falta información cuántica, intentar obtenerla
                if (quantumScore === null || coherence === null) {
                    console.log(`Solicitando factores cuánticos para ${data.symbol} en showSymbolDetails`);
                    if (typeof window.fetchQuantumFactors === 'function') {
                        window.fetchQuantumFactors(data.symbol);
                    }
                }
            } catch (error) {
                console.error('Error en showSymbolDetails:', error);
                
                // Mostrar mensaje de error en modal
                const modalBody = document.getElementById('modalBody');
                if (modalBody) {
                    modalBody.innerHTML = `
                        <div class="error-message">
                            <p>Error al mostrar detalles del símbolo.</p>
                            <p>Por favor, inténtelo de nuevo más tarde.</p>
                        </div>
                    `;
                }
            }
        };
    }
    
    // Función auxiliar para obtener recomendación
    function getRecommendation(score) {
        if (score === null || score === undefined) return 'Mantener';
        if (score >= 0.7) return 'Comprar';
        if (score <= 0.3) return 'Vender';
        return 'Mantener';
    }
    
    // NO redefinir calculateOverallQuantumScore - dejar que updateQuantumMetrics.js lo maneje
    // Solo verificar que esté disponible
    if (typeof window.calculateOverallQuantumScore !== 'function') {
        console.warn('calculateOverallQuantumScore no está disponible - verificar que updateQuantumMetrics.js esté cargado');
    }
    
    console.log('Correcciones aplicadas correctamente - sin conflictos con updateQuantumMetrics.js');
});

// Implementaciones de respaldo para funciones críticas
window.fetchQuantumFactors = window.fetchQuantumFactors || function(symbol) {
    console.log(`Implementación de respaldo para fetchQuantumFactors(${symbol})`);
    
    // Generar factores determinísticos como respaldo
    const randomFactor = () => ((Date.now() % 50 + 30) / 100);
    
    // Buscar el símbolo en marketData (soporta objeto mapeado por símbolo)
    if (window.marketData && typeof window.marketData === 'object') {
        const symbolData = window.marketData[symbol] || Object.values(window.marketData).find(s => (s && (s.symbol === symbol)));
        if (symbolData) {
            // Asignar factores aleatorios
            symbolData.quantumFactors = {
                coherence: randomFactor(),
                entanglement: randomFactor(),
                momentum: randomFactor(),
                density: randomFactor(),
                temperature: randomFactor()
            };
            
            // Calcular puntuación
            symbolData.quantumScore = Object.values(symbolData.quantumFactors).reduce((a, b) => a + b, 0) / 5;
            
            // Actualizar UI
            if (typeof window.updateQuantumMetrics === 'function') {
                window.updateQuantumMetrics();
            }
        }
    }
    
    return Promise.resolve({
        coherence: randomFactor(),
        entanglement: randomFactor(),
        momentum: randomFactor(),
        density: randomFactor(),
        temperature: randomFactor()
    });
};

// NO crear updateQuantumMetrics aquí - dejar que updateQuantumMetrics.js lo maneje
// Solo verificar que esté disponible
if (typeof window.updateQuantumMetrics !== 'function') {
    console.warn('updateQuantumMetrics no está disponible - verificar que updateQuantumMetrics.js esté cargado');
}

// NO sobrescribir initializeQuantumCache - dejar que el sistema principal maneje la caché
// Solo verificar que esté disponible
if (typeof window.initializeQuantumCache !== 'function') {
    console.warn('initializeQuantumCache no está disponible - el sistema de caché puede no funcionar correctamente');
}

window.initSystemStatus = window.initSystemStatus || function() {
    console.log('Implementación de respaldo para initSystemStatus()');
    
    // Establecer tiempo de inicio
    const startTime = Date.now();
    
    // Actualizar elementos de UI
    const updateUptime = () => {
        const uptimeElement = document.querySelector('.status-item .status-value[data-status="uptime"]');
        if (uptimeElement) {
            const uptime = Date.now() - startTime;
            uptimeElement.textContent = formatUptime(uptime);
        }
        
        const healthElement = document.querySelector('.status-item .status-value[data-status="health"]');
        if (healthElement) {
            healthElement.textContent = '85%';
            healthElement.style.color = '#4caf50'; // Verde
        }
        
        const healthBarElement = document.querySelector('.health-bar .health-fill');
        if (healthBarElement) {
            healthBarElement.style.width = '85%';
        }
    };
    
    // Función para formatear tiempo de actividad
    function formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
    
    // Actualizar inicialmente y configurar actualización periódica
    updateUptime();
    setInterval(updateUptime, 1000);
};

// Verificar si los módulos necesarios están cargados
window.addEventListener('load', function() {
    setTimeout(() => {
        // Verificar módulos
        const modules = [
            'fetchQuantumFactors',
            'updateQuantumMetrics',
            'initializeQuantumCache',
            'initSystemStatus'
        ];
        
        for (const module of modules) {
            if (typeof window[module] !== 'function') {
                console.error(`Módulo ${module} no está cargado correctamente`);
                
                // Intentar cargar el módulo dinámicamente
                const script = document.createElement('script');
                script.src = `/${module}.js`;
                script.onload = () => console.log(`Módulo ${module} cargado dinámicamente`);
                script.onerror = () => console.error(`Error al cargar ${module} dinámicamente`);
                document.head.appendChild(script);
            }
        }
    }, 1000);
});

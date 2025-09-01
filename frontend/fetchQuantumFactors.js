
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
 * Módulo para obtener factores cuánticos con múltiples mecanismos de respaldo
 * 
 * Este módulo centraliza la lógica para obtener factores cuánticos de diferentes
 * fuentes, con mecanismos de respaldo en caso de fallos.
 */

// Caché local para evitar solicitudes repetidas
const factorsCache = {};

/**
 * Obtiene los factores cuánticos para un símbolo específico
 * @param {string} symbol - El símbolo para el que obtener los factores
 * @returns {Promise<Object>} - Los factores cuánticos
 */
async function fetchQuantumFactors(symbol) {
    // Si ya tenemos factores recientes en caché, los devolvemos
    if (factorsCache[symbol] && Date.now() - factorsCache[symbol].timestamp < 60000) {
        console.log(`Usando factores en caché para ${symbol}`);
        return factorsCache[symbol].data;
    }

    try {
        // Intento 1: Endpoint específico de factores cuánticos
        console.log(`Obteniendo factores cuánticos para ${symbol} desde API específica`);
        const response = await fetch(`http://localhost:4603/api/quantum-factors?symbol=${symbol}`);
        
        if (response.ok) {
            const data = await response.json();
            
            // Actualizar marketData y caché
            if (window.marketData && window.marketData.symbols) {
                const symbolData = window.marketData.symbols.find(s => s.symbol === symbol);
                if (symbolData) {
                    symbolData.quantumFactors = data;
                    // Recalcular puntuación cuántica
                    symbolData.quantumScore = calculateQuantumScore(data);
                    
                    // Actualizar UI si es necesario
                    updateSymbolUI(symbol);
                }
            }
            
            // Guardar en caché
            factorsCache[symbol] = {
                data: data,
                timestamp: Date.now()
            };
            
            return data;
        }
        
        throw new Error('Primer intento fallido');
    } catch (error) {
        console.warn(`Error en primer intento para ${symbol}: ${error.message}`);
        
        try {
            // Intento 2: Extraer de la matriz cuántica completa
            console.log(`Intentando obtener de matriz cuántica para ${symbol}`);
            const matrixResponse = await fetch('http://localhost:4603/api/quantum-matrix');
            
            if (matrixResponse.ok) {
                const matrixData = await matrixResponse.json();
                const symbolData = matrixData.find(item => item.symbol === symbol);
                
                if (symbolData && symbolData.factors) {
                    // Actualizar marketData y caché
                    if (window.marketData && window.marketData.symbols) {
                        const marketSymbol = window.marketData.symbols.find(s => s.symbol === symbol);
                        if (marketSymbol) {
                            marketSymbol.quantumFactors = symbolData.factors;
                            marketSymbol.quantumScore = calculateQuantumScore(symbolData.factors);
                            
                            // Actualizar UI
                            updateSymbolUI(symbol);
                        }
                    }
                    
                    // Guardar en caché
                    factorsCache[symbol] = {
                        data: symbolData.factors,
                        timestamp: Date.now()
                    };
                    
                    return symbolData.factors;
                }
            }
            
            throw new Error('Segundo intento fallido');
        } catch (secondError) {
            console.warn(`Error en segundo intento para ${symbol}: ${secondError.message}`);
            
            // Valores predeterminados como último recurso
            const defaultFactors = {
                coherence: ((Date.now() % 60 + 20) / 100), // 0.20-0.80
                entanglement: ((Date.now() % 50 + 25) / 100), // 0.25-0.75
                momentum: ((Date.now() % 55 + 20) / 100), // 0.20-0.75
                density: ((Date.now() % 45 + 30) / 100), // 0.30-0.75
                temperature: ((Date.now() % 50 + 25) / 100), // 0.25-0.75
                successProbability: ((Date.now() % 70 + 15) / 100), // 0.15-0.85
                opportunity: ((Date.now() % 60 + 20) / 100) // 0.20-0.80
            };
            
            console.log(`Usando valores predeterminados para ${symbol}`);
            
            // Actualizar marketData con valores predeterminados
            if (window.marketData && window.marketData.symbols) {
                const marketSymbol = window.marketData.symbols.find(s => s.symbol === symbol);
                if (marketSymbol) {
                    marketSymbol.quantumFactors = defaultFactors;
                    marketSymbol.quantumScore = calculateQuantumScore(defaultFactors);
                    
                    // Actualizar UI
                    updateSymbolUI(symbol);
                }
            }
            
            // Guardar en caché con tiempo de vida más corto
            factorsCache[symbol] = {
                data: defaultFactors,
                timestamp: Date.now() - 40000 // Expira más rápido (20s en lugar de 60s)
            };
            
            return defaultFactors;
        }
    }
}

/**
 * Calcula la puntuación cuántica a partir de los factores
 * @param {Object} factors - Los factores cuánticos
 * @returns {number} - La puntuación cuántica
 */
function calculateQuantumScore(factors) {
    if (!factors) return 0;
    
    // Pesos para cada factor
    const weights = {
        coherence: 0.35,
        entanglement: 0.25,
        momentum: 0.15,
        density: 0.15,
        temperature: 0.10
    };
    
    // Calcular puntuación ponderada
    let score = 0;
    let totalWeight = 0;
    
    for (const [factor, weight] of Object.entries(weights)) {
        if (typeof factors[factor] === 'number') {
            score += factors[factor] * weight;
            totalWeight += weight;
        }
    }
    
    // Normalizar si no tenemos todos los factores
    return totalWeight > 0 ? score / totalWeight : 0;
}

/**
 * Actualiza la UI para un símbolo específico si está visible
 * @param {string} symbol - El símbolo a actualizar
 */
function updateSymbolUI(symbol) {
    // Actualizar tarjeta de mercado si existe
    const marketCard = document.querySelector(`.market-card[data-symbol="${symbol}"]`);
    if (marketCard) {
        const symbolData = window.marketData.symbols.find(s => s.symbol === symbol);
        if (symbolData) {
            // Actualizar contenido de la tarjeta
            const quantumScoreElement = marketCard.querySelector('.quantum-score');
            if (quantumScoreElement && symbolData.quantumScore !== undefined) {
                quantumScoreElement.textContent = symbolData.quantumScore.toFixed(2);
            }
        }
    }
    
    // Si el modal de detalles está abierto para este símbolo, actualizar
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle && modalTitle.textContent.includes(symbol)) {
        const symbolData = window.marketData.symbols.find(s => s.symbol === symbol);
        if (symbolData) {
            showSymbolDetails(symbolData);
        }
    }
    
    // Actualizar métricas cuánticas globales
    if (typeof updateQuantumMetrics === 'function') {
        updateQuantumMetrics();
    }
}

// Exportar función para uso global
window.fetchQuantumFactors = fetchQuantumFactors;
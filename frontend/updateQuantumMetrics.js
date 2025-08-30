
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
 * Módulo para actualizar y mostrar métricas cuánticas en la UI
 * 
 * Este módulo maneja la lógica para calcular y mostrar métricas cuánticas
 * globales basadas en los factores cuánticos de los símbolos individuales.
 */

/**
 * Actualiza las métricas cuánticas globales y la UI correspondiente
 */
function updateQuantumMetrics() {
    console.log('DEBUG: updateQuantumMetrics called');
    console.log('DEBUG: window.marketData:', window.marketData);

    if (!window.marketData || Object.keys(window.marketData).length === 0) {
        console.warn('No hay datos de mercado disponibles para actualizar métricas cuánticas - usando valores por defecto');
        // Proporcionar valores por defecto cuando no hay datos
        const defaultMetrics = {
            overallScore: 0.5,
            coherence: 0.5,
            consciousness: 0.5,
            optimalLeverage: 0.5,
            tunneling: 0.5
        };
        updateQuantumUI(defaultMetrics);
        return;
    }

    console.log('DEBUG: Procesando símbolos:', Object.keys(window.marketData));

    // Calcular coherencia cuántica general
    const overallCoherence = calculateOverallQuantumCoherence();
    console.log('DEBUG: Métricas calculadas:', overallCoherence);

    // Actualizar elementos de UI
    updateQuantumUI(overallCoherence);

    // Verificar símbolos sin factores cuánticos y solicitarlos
    checkMissingFactors();
}

/**
 * Calcula la coherencia cuántica general basada en todos los símbolos
 * @returns {Object} - Métricas de coherencia cuántica
 */
function calculateOverallQuantumCoherence() {
    console.log('DEBUG: Calculating overall quantum coherence with unified QBTC metrics...');
    
    if (!window.marketData || Object.keys(window.marketData).length === 0) {
        console.log('DEBUG: No market data available for quantum metrics calculation - using default values');
        return {
            overallScore: 0.5,
            coherence: 0.5,
            consciousness: 0.5,
            optimalLeverage: 0.5,
            tunneling: 0.5
        };
    }
    
    console.log('DEBUG: Market data keys:', Object.keys(window.marketData));
    
    let totalCoherence = 0;
    let totalConsciousness = 0;
    let totalTunneling = 0;
    let totalLeverage = 0;
    let symbolCount = 0;
    
    // CONSTANTES QBTC UNIFICADAS - Alineadas con config.js
    const QBTC_CONSTANTS = {
        Z_REAL: 9,
        Z_IMAG: 16,
        LAMBDA_7919: Math.log(7919),
        PHI_GOLDEN: (1 + Math.sqrt(5)) / 2,
        RESONANCE_FREQ: 888,
        COHERENCE_THRESHOLD: 0.941,
        EULER_GAMMA: 0.5772156649015329
    };
    
    // MÉTRICAS CUÁNTICAS UNIFICADAS - Modelo Híbrido-8
    const quantumMetrics = [
        'Coherencia', 'Entrelazamiento', 'Momentum', 'Densidad', 
        'Temperatura', 'Probabilidad', 'Oportunidad', 'Sensibilidad'
    ];
    
    // FACTORES CUÁNTICOS UNIFICADOS - Pesos optimizados para máximo profit
    const quantumFactors = {
        coherence: { weight: 0.25, threshold: 0.941 },
        entanglement: { weight: 0.20, threshold: 0.871 },
        momentum: { weight: 0.15, threshold: 0.5 },
        density: { weight: 0.15, threshold: 0.5 },
        temperature: { weight: 0.15, threshold: 0.5 },
        successProbability: { weight: 0.05, threshold: 0.5 },
        opportunity: { weight: 0.03, threshold: 0.5 },
        sensitivity: { weight: 0.02, threshold: 0.5 }
    };
    
    console.log('DEBUG: Using unified QBTC constants:', QBTC_CONSTANTS);
    console.log('DEBUG: Using unified quantum metrics:', quantumMetrics);
    console.log('DEBUG: Using unified quantum factors:', Object.keys(quantumFactors));
    
    Object.entries(window.marketData).forEach(([symbol, data]) => {
        console.log(`DEBUG: Processing symbol ${symbol}:`, data);
        
        if (data && typeof data === 'object' && data.quantumFactors && typeof data.quantumFactors === 'object') {
            const factors = data.quantumFactors;
            console.log(`DEBUG: Quantum factors for ${symbol}:`, factors);
            console.log(`DEBUG: Available factors for ${symbol}:`, Object.keys(factors));
            
            // Verificar que todos los factores unificados estén presentes
            const missingFactors = checkMissingFactors();
            if (missingFactors && missingFactors.length > 0) {
                console.log(`DEBUG: Missing factors for ${symbol}:`, missingFactors);
            }
            
            // Calcular métricas usando factores unificados con constantes QBTC
            if (factors.coherence !== undefined) {
                totalCoherence += factors.coherence;
            }
            
            // Usar entanglement como consciousness (compatible con QBTC)
            if (factors.entanglement !== undefined) {
                totalConsciousness += factors.entanglement;
            }
            
            // Usar successProbability como tunneling (Modelo Híbrido-8)
            let tunnelingValue = 0;
            if (factors.successProbability !== undefined) {
                tunnelingValue = factors.successProbability;
                console.log(`DEBUG: ${symbol} tunneling from successProbability:`, tunnelingValue);
            } else if (factors.opportunity !== undefined) {
                // Fallback: usar opportunity si successProbability no está disponible
                tunnelingValue = factors.opportunity;
                console.log(`DEBUG: ${symbol} tunneling from opportunity:`, tunnelingValue);
            } else {
                // Fallback: calcular tunneling basado en otros factores
                tunnelingValue = (factors.coherence || 0.5) * (factors.entanglement || 0.5) * 0.8;
                console.log(`DEBUG: ${symbol} tunneling calculated from coherence/entanglement:`, tunnelingValue);
            }
            totalTunneling += tunnelingValue;
            
            // Calcular leverage óptimo usando factores unificados y constantes QBTC
            const leverage = calculateOptimalLeverage(factors, quantumFactors, QBTC_CONSTANTS);
            totalLeverage += leverage;
            
            symbolCount++;
            console.log(`DEBUG: Added metrics for ${symbol} - coherence: ${factors.coherence}, consciousness: ${factors.entanglement}, tunneling: ${factors.successProbability}, leverage: ${leverage}`);
        } else {
            console.log(`DEBUG: Invalid data structure for ${symbol}:`, data);
        }
    });
    
    if (symbolCount === 0) {
        console.log('DEBUG: No valid symbols found for quantum metrics calculation');
        return {
            overallScore: 0,
            coherence: 0,
            consciousness: 0,
            optimalLeverage: 0,
            tunneling: 0
        };
    }
    
    const avgCoherence = totalCoherence / symbolCount;
    const avgConsciousness = totalConsciousness / symbolCount;
    const avgTunneling = totalTunneling / symbolCount;
    const avgLeverage = totalLeverage / symbolCount;
    
    console.log('DEBUG: Tunneling calculation summary:', {
        totalTunneling,
        symbolCount,
        avgTunneling
    });
    
    // Calcular score general usando pesos unificados y constantes QBTC
    const overallScore = calculateUnifiedQuantumScore({
        coherence: avgCoherence,
        consciousness: avgConsciousness,
        tunneling: avgTunneling,
        leverage: avgLeverage
    }, quantumFactors, QBTC_CONSTANTS);
    
    console.log('DEBUG: Final unified QBTC metrics:', {
        overallScore,
        coherence: avgCoherence,
        consciousness: avgConsciousness,
        optimalLeverage: avgLeverage,
        tunneling: avgTunneling,
        symbolCount
    });
    
    return {
        overallScore,
        coherence: avgCoherence,
        consciousness: avgConsciousness,
        optimalLeverage: avgLeverage,
        tunneling: avgTunneling
    };
}

/**
 * Calcular score cuántico unificado usando pesos del config y constantes QBTC
 */
function calculateUnifiedQuantumScore(metrics, quantumFactors, qbtcConstants) {
    let score = 0;
    
    // Aplicar pesos unificados
    if (quantumFactors.coherence && metrics.coherence !== undefined) {
        score += metrics.coherence * quantumFactors.coherence.weight;
    }
    if (quantumFactors.entanglement && metrics.consciousness !== undefined) {
        score += metrics.consciousness * quantumFactors.entanglement.weight;
    }
    if (quantumFactors.momentum && metrics.momentum !== undefined) {
        score += metrics.momentum * quantumFactors.momentum.weight;
    }
    if (quantumFactors.density && metrics.density !== undefined) {
        score += metrics.density * quantumFactors.density.weight;
    }
    if (quantumFactors.temperature && metrics.temperature !== undefined) {
        score += metrics.temperature * quantumFactors.temperature.weight;
    }
    if (quantumFactors.successProbability && metrics.tunneling !== undefined) {
        score += metrics.tunneling * quantumFactors.successProbability.weight;
    }
    if (quantumFactors.opportunity && metrics.opportunity !== undefined) {
        score += metrics.opportunity * quantumFactors.opportunity.weight;
    }
    if (quantumFactors.sensitivity && metrics.sensitivity !== undefined) {
        score += metrics.sensitivity * quantumFactors.sensitivity.weight;
    }
    
    // Aplicar factor de resonancia QBTC
    const resonanceBoost = Math.sin(qbtcConstants.RESONANCE_FREQ * Date.now() / 1000) * 0.1;
    score = Math.min(1, Math.max(0, score + resonanceBoost));
    
    return score;
}

/**
 * Calcular leverage óptimo usando factores unificados y constantes QBTC
 */
function calculateOptimalLeverage(factors, quantumFactors, qbtcConstants) {
    // Usar factores unificados para calcular leverage con constantes QBTC
    const baseLeverage = 1.0;
    let leverageMultiplier = 1.0;
    
    // Ajustar basado en coherencia con umbral QBTC
    if (factors.coherence !== undefined) {
        const coherenceBoost = factors.coherence > qbtcConstants.COHERENCE_THRESHOLD ? 0.8 : 0.3;
        leverageMultiplier += factors.coherence * coherenceBoost;
    }
    
    // Ajustar basado en entrelazamiento
    if (factors.entanglement !== undefined) {
        leverageMultiplier += factors.entanglement * 0.3;
    }
    
    // Ajustar basado en momentum
    if (factors.momentum !== undefined) {
        leverageMultiplier += factors.momentum * 0.2;
    }
    
    // Ajustar basado en probabilidad de éxito
    if (factors.successProbability !== undefined) {
        leverageMultiplier += factors.successProbability * 0.4;
    }
    
    // Aplicar factor de proporción áurea QBTC
    leverageMultiplier *= qbtcConstants.PHI_GOLDEN / 2;
    
    return Math.min(20, Math.max(0.1, baseLeverage * leverageMultiplier));
}

/**
 * Verificar factores faltantes usando métricas unificadas
 */
function checkMissingFactors() {
    const missing = [];
    const quantumMetrics = [
        'Coherencia', 'Entrelazamiento', 'Momentum', 'Densidad', 
        'Temperatura', 'Probabilidad', 'Oportunidad', 'Sensibilidad'
    ];
    quantumMetrics.forEach(metric => {
        const factorKey = metric.toLowerCase().replace(/[^a-z]/g, '');
        if (typeof window.marketData === 'object' && window.marketData !== null) {
            const symbolData = window.marketData[Object.keys(window.marketData)[0]]; // Solo verificar el primer símbolo para simplificar
            if (symbolData && symbolData.quantumFactors && symbolData.quantumFactors[factorKey] === undefined) {
                missing.push(metric);
            }
        }
    });
    return missing;
}

/**
 * Actualiza los elementos de UI con las métricas cuánticas
 * @param {Object} metrics - Las métricas cuánticas calculadas
 */
function updateQuantumUI(metrics) {
    // Actualizar puntuación cuántica general
    const quantumScoreElement = document.getElementById('quantumScore');
    
    if (quantumScoreElement && metrics.overallScore !== undefined) {
        const scoreText = (metrics.overallScore * 100).toFixed(0) + '%';
        quantumScoreElement.textContent = scoreText;
    }
    
    // Actualizar factores individuales
    updateFactorUI('coherence', metrics.coherence);
    updateFactorUI('consciousness', metrics.consciousness);
    updateFactorUI('tunneling', metrics.tunneling);
    updateFactorUI('optimalLeverage', metrics.optimalLeverage);
}

/**
 * Actualiza la UI para un factor específico
 * @param {string} factor - El nombre del factor a actualizar
 * @param {number} value - El valor del factor
 */
function updateFactorUI(factor, value) {
    console.log(`DEBUG: updateFactorUI called for ${factor} with value:`, value);
    let valueElement;
    const progressElement = document.getElementById(`${factor}Progress`);
    
    // Manejar casos especiales de IDs
    if (factor === 'optimalLeverage') {
        valueElement = document.getElementById('optimalLeverageValue');
    } else if (factor === 'tunneling') {
        valueElement = document.getElementById('tunnelingValue');
    } else {
        valueElement = document.getElementById(`${factor}Value`);
    }
    
    console.log(`DEBUG: Found element for ${factor}:`, !!valueElement);
    
    if (valueElement && value !== undefined) {
        // Para el leverage óptimo, mostramos un formato diferente
        if (factor === 'optimalLeverage') {
            const leverageValue = value * 5;
            const text = `${leverageValue.toFixed(1)}x`;
            valueElement.textContent = text;
        } else {
            const text = `${(value * 100).toFixed(0)}%`;
            valueElement.textContent = text;
        }
    }
    
    if (progressElement && value !== undefined) {
        const progressWidth = `${Math.min(100, value * 100)}%`;
        progressElement.style.width = progressWidth;
    }
}

/**
 * Verifica símbolos sin factores cuánticos y los solicita
 */
function checkMissingFactors() {
    if (!window.marketData || Object.keys(window.marketData).length === 0) return;
    
    // Priorizar símbolos principales
    const prioritySymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP'];
    
    // Primero procesar símbolos prioritarios
    for (const prioritySymbol of prioritySymbols) {
        const symbolData = window.marketData[prioritySymbol];
        if (symbolData && (!symbolData.quantumFactors || !symbolData.quantumScore)) {
            console.log(`Solicitando factores cuánticos para símbolo prioritario: ${prioritySymbol}`);
            fetchQuantumFactors(prioritySymbol);
        }
    }
    
    // Luego procesar el resto de símbolos
    for (const [symbol, data] of Object.entries(window.marketData)) {
        if (!prioritySymbols.includes(symbol) && (!data.quantumFactors || !data.quantumScore)) {
            console.log(`Solicitando factores cuánticos para: ${symbol}`);
            // Usar setTimeout para no saturar con solicitudes
            setTimeout(() => {
                fetchQuantumFactors(symbol);
            }, (Date.now() % 2000)); // Distribuir solicitudes en 2 segundos
        }
    }
}

// Exportar función para uso global
window.updateQuantumMetrics = updateQuantumMetrics;
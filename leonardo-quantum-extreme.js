/**
 *  LEONARDO QUANTUM LIBERATION ENGINE - EXTREME MODE 
 * Sistema QBTC Banda 46 Ultra-Perfeccionado
 * MODO EXTREMO ÚNICAMENTE - Todos los 475 Símbolos de Futuros
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4777;

app.use(cors());
app.use(express.json());

// Importar todos los símbolos válidos
const { VALID_BINANCE_FUTURES_SYMBOLS } = require('./valid-symbols-template.js');
const CORE_SYSTEM_URL = 'http://localhost:4602';

//  CONSTANTES CUÁNTICAS ESENCIALES
const QUANTUM = {
    LAMBDA_RESONANCE: 7919,
    CONSCIOUSNESS_THRESHOLD: 0.75,
    TOTAL_SYMBOLS: VALID_BINANCE_FUTURES_SYMBOLS.length, // 475 símbolos
    ANTIMATTER_FACTOR: 1.337
};

// [ENDPOINTS] ARQUETIPOS PRINCIPALES SOLAMENTE
const MAJOR_ARCHETYPES = {
    'BTCUSDT': { tarot: ' El Emperador', power: 'SOVEREIGNTY' },
    'ETHUSDT': { tarot: '[NIGHT] La Suma Sacerdotisa', power: 'INTUITION' },
    'BNBUSDT': { tarot: ' La Emperatriz', power: 'ABUNDANCE' },
    'SOLUSDT': { tarot: ' El Sol', power: 'ILLUMINATION' },
    'DOGEUSDT': { tarot: ' El Loco', power: 'MEME_MAGIC' },
    'PEPEUSDT': { tarot: ' El Chamán Verde', power: 'VIRAL_MAGIC' },
    '1000PEPEUSDT': { tarot: ' El Chamán Verde x1000', power: 'VIRAL_STORM' }
};

//  CONFIGURACIÓN MODO EXTREME ÚNICAMENTE
const EXTREME_CONFIG = {
    name: 'Modo Extremo - Quantum Unlimited',
    max_positions: 25,
    risk_per_trade: 0.05,
    leverage_limit: 35,
    target_monthly_return: [500, 3000],
    consciousness_required: 0.75,
    use_all_symbols: true
};

// [DATA] Obtener datos de futuros del Core System
async function getFuturesData() {
    try {
        console.log('[API] Obteniendo datos de futuros...');
        const response = await axios.get(`${CORE_SYSTEM_URL}/api/futures-data`, {
            timeout: 20000
        });
        
        if (response.data && response.data.success) {
            const dataLength = Array.isArray(response.data.data) ? 
                response.data.data.length : Object.keys(response.data.data).length;
            console.log(`[OK] ${dataLength} símbolos obtenidos del Core System`);
            return response.data.data;
        }
        throw new Error('Datos inválidos del Core System');
    } catch (error) {
        console.error('[ERROR] Error obteniendo datos:', error.message);
        return null;
    }
}

//  Calcular factores cuánticos simplificados
function calculateQuantumFactors(symbol, marketData) {
    const change = parseFloat(marketData.priceChangePercent) || 0;
    const volume = parseFloat(marketData.volume) || 0;
    const price = parseFloat(marketData.lastPrice) || parseFloat(marketData.price) || 0;
    
    const volatility = Math.abs(change);
    const momentum = change / 100;
    const liquidityScore = Math.log(volume + 1) / 25;
    
    // Bonificación por arquetipo
    const archetypeBonus = MAJOR_ARCHETYPES[symbol] ? 0.15 : 0;
    
    return {
        coherence: Math.max(0, Math.min(1, 0.65 + momentum + archetypeBonus)),
        entanglement: Math.max(0, Math.min(1, 0.4 + (volatility / 200))),
        momentum: Math.max(0, Math.min(1, 0.3 + (volatility / 150))),
        density: Math.max(0, Math.min(1, 0.5 + liquidityScore)),
        lambda_resonance: Math.max(0, Math.min(1, 0.5 + (momentum * QUANTUM.LAMBDA_RESONANCE) / 10000)),
        success_probability: Math.max(0, Math.min(1, 0.5 + momentum + (liquidityScore * 0.3) + archetypeBonus)),
        antimatter_factor: 1.0 + (volatility / 100) * QUANTUM.ANTIMATTER_FACTOR
    };
}

// [ENDPOINTS] Calcular score cuántico total
function calculateQuantumScore(quantumFactors, symbol) {
    const weights = {
        coherence: 0.20,
        entanglement: 0.15,
        momentum: 0.18,
        density: 0.12,
        lambda_resonance: 0.15,
        success_probability: 0.20
    };
    
    let score = Object.keys(weights).reduce((total, factor) => {
        return total + (quantumFactors[factor] || 0) * weights[factor];
    }, 0);
    
    // Bonos especiales
    if (MAJOR_ARCHETYPES[symbol]) score += 0.10; // Arquetipo mayor
    if (['BTCUSDT', 'ETHUSDT', 'BNBUSDT'].includes(symbol)) score += 0.08; // Crypto mayor
    if (quantumFactors.antimatter_factor > 1.5) score += 0.05; // Alta antimatter
    
    return Math.max(0, Math.min(100, score * 100));
}

// [START] Función principal de recomendaciones EXTREME
async function generateExtremeRecommendations(consciousness_level = 0.75, max_recommendations = 20) {
    try {
        console.log(' Iniciando análisis EXTREME de todos los símbolos...');
        const startTime = Date.now();
        
        // Verificar consciencia
        if (consciousness_level < EXTREME_CONFIG.consciousness_required) {
            return {
                error: 'Consciencia insuficiente para modo EXTREME',
                required: EXTREME_CONFIG.consciousness_required,
                current: consciousness_level,
                message: ' Medita más para acceder al poder cuántico total'
            };
        }
        
        // Obtener datos de futuros
        const futuresData = await getFuturesData();
        if (!futuresData) {
            throw new Error('No se pudieron obtener datos de futuros');
        }
        
        console.log(`[SEARCH] Analizando TODOS los ${QUANTUM.TOTAL_SYMBOLS} símbolos disponibles...`);
        
        const recommendations = [];
        let processed = 0;
        
        // Analizar TODOS los símbolos válidos
        for (const symbol of VALID_BINANCE_FUTURES_SYMBOLS) {
            try {
                // Buscar datos del símbolo
                const marketData = Array.isArray(futuresData) 
                    ? futuresData.find(item => item.symbol === symbol)
                    : futuresData[symbol];
                
                if (!marketData) continue;
                
                // Calcular factores cuánticos
                const quantumFactors = calculateQuantumFactors(symbol, marketData);
                const quantumScore = calculateQuantumScore(quantumFactors, symbol);
                
                // Filtro mínimo (muy permisivo para modo EXTREME)
                if (quantumScore < 15) continue;
                
                const archetype = MAJOR_ARCHETYPES[symbol];
                
                recommendations.push({
                    symbol,
                    quantum_score: parseFloat(quantumScore.toFixed(2)),
                    quantum_factors: quantumFactors,
                    archetype: archetype || { 
                        tarot: ' El Explorador Cuántico',
                        power: 'UNKNOWN'
                    },
                    market_data: {
                        price: parseFloat(marketData.lastPrice) || parseFloat(marketData.price) || 0,
                        change_24h: parseFloat(marketData.priceChangePercent) || 0,
                        volume_24h: parseFloat(marketData.volume) || 0,
                        trades_count: parseInt(marketData.count) || 0
                    },
                    strength: quantumScore > 80 ? 'EXTREMA' :
                            quantumScore > 65 ? 'FUERTE' : 
                            quantumScore > 45 ? 'MODERADA' : 'ESPECULATIVA',
                    risk_level: quantumFactors.antimatter_factor > 2.0 ? 'EXTREMO' :
                               quantumFactors.antimatter_factor > 1.5 ? 'ALTO' : 'MEDIO'
                });
                
                processed++;
                
            } catch (error) {
                console.warn(`[WARNING] Error procesando ${symbol}: ${error.message}`);
            }
        }
        
        // Ordenar por score cuántico
        recommendations.sort((a, b) => b.quantum_score - a.quantum_score);
        const topRecommendations = recommendations.slice(0, max_recommendations);
        
        const processingTime = Date.now() - startTime;
        
        console.log(`[OK] Análisis EXTREME completado:`);
        console.log(`   [FAST] Tiempo: ${processingTime}ms`);
        console.log(`   [DATA] Símbolos procesados: ${processed}/${QUANTUM.TOTAL_SYMBOLS}`);
        console.log(`   [ENDPOINTS] Recomendaciones: ${topRecommendations.length}`);
        
        return {
            success: true,
            mode: 'EXTREME',
            consciousness_level,
            analysis_summary: {
                total_symbols_universe: QUANTUM.TOTAL_SYMBOLS,
                symbols_processed: processed,
                recommendations_generated: topRecommendations.length,
                processing_time_ms: processingTime
            },
            top_recommendations: topRecommendations,
            all_recommendations: recommendations,
            quantum_state: {
                lambda_resonance: (recommendations.reduce((sum, r) => 
                    sum + r.quantum_factors.lambda_resonance, 0) / recommendations.length * QUANTUM.LAMBDA_RESONANCE).toFixed(0),
                total_coherence: (recommendations.reduce((sum, r) => 
                    sum + r.quantum_factors.coherence, 0) / recommendations.length).toFixed(3),
                antimatter_activity: (recommendations.reduce((sum, r) => 
                    sum + r.quantum_factors.antimatter_factor, 0) / recommendations.length).toFixed(2)
            },
            extreme_config: {
                max_positions: EXTREME_CONFIG.max_positions,
                risk_per_trade: (EXTREME_CONFIG.risk_per_trade * 100) + '%',
                leverage_limit: EXTREME_CONFIG.leverage_limit,
                target_monthly: EXTREME_CONFIG.target_monthly_return[0] + '-' + EXTREME_CONFIG.target_monthly_return[1] + '%'
            },
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error('[ERROR] Error en análisis EXTREME:', error.message);
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

//  ENDPOINTS SIMPLIFICADOS

// Health check
app.get('/health', async (req, res) => {
    try {
        const coreResponse = await axios.get(`${CORE_SYSTEM_URL}/health`, { timeout: 5000 });
        
        res.json({
            status: 'EXTREME_QUANTUM_ACTIVE',
            service: 'Leonardo Quantum Liberation Engine - EXTREME',
            version: '3.0.0',
            mode: 'EXTREME ONLY',
            core_connected: coreResponse.status === 200,
            total_symbols: QUANTUM.TOTAL_SYMBOLS,
            consciousness_required: QUANTUM.CONSCIOUSNESS_THRESHOLD,
            lambda_resonance: QUANTUM.LAMBDA_RESONANCE,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({
            status: 'DEGRADED',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Endpoint principal - Solo modo EXTREME
app.get('/api/extreme-recommendations', async (req, res) => {
    try {
        const consciousness = parseFloat(req.query.consciousness) || 0.75;
        const maxRecs = parseInt(req.query.max_recommendations) || 20;
        
        const recommendations = await generateExtremeRecommendations(consciousness, maxRecs);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error en motor cuántico EXTREME',
            details: error.message
        });
    }
});

// Endpoint de símbolos disponibles
app.get('/api/symbols-universe', (req, res) => {
    res.json({
        success: true,
        total_symbols: QUANTUM.TOTAL_SYMBOLS,
        mode: 'EXTREME - All Symbols',
        major_archetypes: Object.keys(MAJOR_ARCHETYPES).length,
        sample_symbols: VALID_BINANCE_FUTURES_SYMBOLS.slice(0, 20),
        consciousness_required: QUANTUM.CONSCIOUSNESS_THRESHOLD
    });
});

// Endpoint de arquetipos principales
app.get('/api/archetypes', (req, res) => {
    const archetypes = Object.keys(MAJOR_ARCHETYPES).map(symbol => ({
        symbol,
        ...MAJOR_ARCHETYPES[symbol]
    }));
    
    res.json({
        success: true,
        total_major_archetypes: archetypes.length,
        coverage: `${archetypes.length}/${QUANTUM.TOTAL_SYMBOLS} símbolos`,
        archetypes
    });
});

// Iniciar Leonardo Quantum Engine EXTREME
app.listen(PORT, () => {
    console.log(`\n[FAST] LEONARDO QUANTUM LIBERATION ENGINE - EXTREME MODE [FAST]`);
    console.log(`[START] ACTIVADO en puerto ${PORT}`);
    console.log(`[ENDPOINTS] Sistema QBTC Banda 46 - MODO EXTREMO ÚNICAMENTE`);
    console.log(`\n[DATA] CAPACIDADES EXTREMAS:`);
    console.log(`    Símbolos Total: ${QUANTUM.TOTAL_SYMBOLS}`);
    console.log(`    Arquetipos Principales: ${Object.keys(MAJOR_ARCHETYPES).length}`);
    console.log(`   [FAST] Resonancia ${QUANTUM.LAMBDA_RESONANCE}`);
    console.log(`    Consciencia Requerida: ${QUANTUM.CONSCIOUSNESS_THRESHOLD}`);
    console.log(`    Riesgo Máximo: ${(EXTREME_CONFIG.risk_per_trade * 100)}% por trade`);
    console.log(`   [UP] Target Mensual: ${EXTREME_CONFIG.target_monthly_return[0]}-${EXTREME_CONFIG.target_monthly_return[1]}%`);
    console.log(`\n SOLO MODO EXTREME - Sin límites, sin miedo, máximo potencial cuántico`);
    console.log(`[API] URL: http://localhost:${PORT}`);
    console.log(`[START] Listo para analizar el universo completo de futuros...`);
});

module.exports = app;

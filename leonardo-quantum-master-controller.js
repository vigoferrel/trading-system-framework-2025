/**
 *  LEONARDO QUANTUM MASTER CONTROLLER 
 * Sistema QBTC Banda 46 - INTEGRADOR SUPREMO
 * 
 * PROPÓSITO: Ser el MAESTRO CONDUCTOR que coordina todo el ecosistema QBTC
 * - Integra Core System, ML, Scanner, Frontend
 * - Provee recomendaciones cuánticas al dashboard
 * - NO reemplaza sistemas existentes, los POTENCIA
 */

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4777;

app.use(cors());
app.use(express.json());

// [ENDPOINTS] CONFIGURACIÓN DEL ECOSISTEMA QBTC
const QBTC_ECOSYSTEM = {
    CORE_SYSTEM: 'http://localhost:4602',        // Sistema de datos reales
    ML_SYSTEM: 'http://localhost:4603',          // Enhanced ML (si existe)
    SCANNER_SYSTEM: null,                        // Scanner integrado localmente
    FRONTEND_DASHBOARD: './frontend/index.html',  // Dashboard principal
    LEONARDO_INTERFACE: './frontend/leonardo.html' // Interfaz Leonardo
};

//  CONSTANTES CUÁNTICAS MAESTRAS
const QUANTUM_MASTER = {
    LAMBDA_RESONANCE: 7919,
    CONSCIOUSNESS_THRESHOLD: 0.75,
    ECOSYSTEM_SYNC_INTERVAL: 30000, // 30 segundos
    MAX_RECOMMENDATIONS: 10,
    EXTREME_MODE_ONLY: true
};

//  Estado global del ecosistema
let ecosystemState = {
    coreSystem: { status: 'UNKNOWN', lastSync: null },
    mlSystem: { status: 'UNKNOWN', lastSync: null },
    scanner: { status: 'ACTIVE', lastScan: null },
    recommendations: [],
    quantumField: {
        coherence: 0,
        lambda_resonance: 0,
        consciousness_level: 0
    }
};

// [RELOAD] Integración con Core System (datos reales)
async function syncWithCoreSystem() {
    try {
        console.log(' Sincronizando con Core System...');
        
        // Obtener datos de futuros
        const futuresResponse = await axios.get(`${QBTC_ECOSYSTEM.CORE_SYSTEM}/api/futures-data`, {
            timeout: 10000
        });
        
        // Obtener métricas cuánticas del core
        const metricsResponse = await axios.get(`${QBTC_ECOSYSTEM.CORE_SYSTEM}/api/quantum-metrics`, {
            timeout: 5000
        });
        
        if (futuresResponse.data.success) {
            ecosystemState.coreSystem = {
                status: 'ACTIVE',
                lastSync: new Date().toISOString(),
                futuresData: futuresResponse.data.data,
                cache_state: futuresResponse.data.cache || 'UNKNOWN'
            };
            
            console.log(`[OK] Core System: ${Array.isArray(futuresResponse.data.data) ? 
                futuresResponse.data.data.length : Object.keys(futuresResponse.data.data).length} símbolos`);
        }
        
        if (metricsResponse.data.success) {
            ecosystemState.quantumField = {
                ...ecosystemState.quantumField,
                ...metricsResponse.data.data
            };
        }
        
        return true;
    } catch (error) {
        console.error('[ERROR] Error sincronizando Core System:', error.message);
        ecosystemState.coreSystem.status = 'ERROR';
        return false;
    }
}

//  Motor de recomendaciones cuánticas integrado
function generateQuantumRecommendations(futuresData, maxRecommendations = 10) {
    console.log(' Generando recomendaciones cuánticas...');
    
    const recommendations = [];
    const processedData = Array.isArray(futuresData) ? futuresData : Object.values(futuresData);
    
    // Arquetipos principales para bonificación
    const majorSymbols = {
        'BTCUSDT': { archetype: ' El Emperador', bonus: 0.20 },
        'ETHUSDT': { archetype: '[NIGHT] La Suma Sacerdotisa', bonus: 0.18 },
        'BNBUSDT': { archetype: ' La Emperatriz', bonus: 0.15 },
        'SOLUSDT': { archetype: ' El Sol', bonus: 0.15 },
        'DOGEUSDT': { archetype: ' El Loco', bonus: 0.12 },
        'PEPEUSDT': { archetype: ' El Chamán Verde', bonus: 0.12 }
    };
    
    processedData.forEach(symbolData => {
        try {
            const symbol = symbolData.symbol;
            const change = parseFloat(symbolData.priceChangePercent) || 0;
            const volume = parseFloat(symbolData.volume) || 0;
            const price = parseFloat(symbolData.lastPrice) || parseFloat(symbolData.price) || 0;
            
            // Cálculos cuánticos simplificados pero potentes
            const volatility = Math.abs(change);
            const momentum = change / 100;
            const liquidityScore = Math.log(volume + 1) / 25;
            
            // Factores cuánticos
            const quantumFactors = {
                coherence: Math.max(0, Math.min(1, 0.65 + momentum)),
                momentum: Math.max(0, Math.min(1, 0.3 + (volatility / 150))),
                density: Math.max(0, Math.min(1, 0.5 + liquidityScore)),
                lambda_resonance: Math.max(0, Math.min(1, 0.5 + (momentum * QUANTUM_MASTER.LAMBDA_RESONANCE) / 10000))
            };
            
            // Score base
            let quantumScore = (
                quantumFactors.coherence * 0.25 +
                quantumFactors.momentum * 0.25 +
                quantumFactors.density * 0.25 +
                quantumFactors.lambda_resonance * 0.25
            );
            
            // Bonificación por arquetipo mayor
            const majorInfo = majorSymbols[symbol];
            if (majorInfo) {
                quantumScore += majorInfo.bonus;
            }
            
            // Bonificación por alta volatilidad (modo extremo)
            if (volatility > 5) quantumScore += 0.1;
            if (volatility > 10) quantumScore += 0.1;
            
            // Solo recomendaciones con score mínimo
            if (quantumScore < 0.3) return;
            
            recommendations.push({
                symbol,
                quantum_score: parseFloat((quantumScore * 100).toFixed(2)),
                archetype: majorInfo?.archetype || ' El Explorador',
                market_data: {
                    price: price,
                    change_24h: change,
                    volume_24h: volume
                },
                quantum_factors: quantumFactors,
                strength: quantumScore > 0.8 ? 'EXTREMA' :
                         quantumScore > 0.6 ? 'FUERTE' : 
                         quantumScore > 0.4 ? 'MODERADA' : 'ESPECULATIVA',
                recommendation: change > 5 ? '[UP] LONG FUERTE' :
                              change < -5 ? '[DOWN] SHORT FUERTE' :
                              volatility > 8 ? '[FAST] VOLATILIDAD' : ' OBSERVAR'
            });
            
        } catch (error) {
            console.warn(`[WARNING] Error procesando ${symbolData.symbol}: ${error.message}`);
        }
    });
    
    // Ordenar por score cuántico y limitar
    recommendations.sort((a, b) => b.quantum_score - a.quantum_score);
    return recommendations.slice(0, maxRecommendations);
}

// [RELOAD] Ciclo de sincronización maestro
async function masterSyncCycle() {
    try {
        console.log('\n Iniciando ciclo de sincronización maestro...');
        
        // 1. Sincronizar con Core System
        const coreSuccess = await syncWithCoreSystem();
        
        if (coreSuccess && ecosystemState.coreSystem.futuresData) {
            // 2. Generar recomendaciones cuánticas
            const newRecommendations = generateQuantumRecommendations(
                ecosystemState.coreSystem.futuresData,
                QUANTUM_MASTER.MAX_RECOMMENDATIONS
            );
            
            ecosystemState.recommendations = newRecommendations;
            ecosystemState.scanner.lastScan = new Date().toISOString();
            
            console.log(`[OK] Ciclo completado: ${newRecommendations.length} recomendaciones generadas`);
            
            // 3. Calcular estado del campo cuántico
            if (newRecommendations.length > 0) {
                ecosystemState.quantumField.coherence = newRecommendations.reduce((sum, rec) => 
                    sum + rec.quantum_factors.coherence, 0) / newRecommendations.length;
                ecosystemState.quantumField.lambda_resonance = newRecommendations.reduce((sum, rec) => 
                    sum + rec.quantum_factors.lambda_resonance, 0) / newRecommendations.length * QUANTUM_MASTER.LAMBDA_RESONANCE;
            }
        }
        
    } catch (error) {
        console.error('[ERROR] Error en ciclo maestro:', error.message);
    }
}

//  API ENDPOINTS PARA INTEGRACIÓN CON FRONTEND

// Estado completo del ecosistema
app.get('/api/ecosystem-status', (req, res) => {
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        ecosystem_state: ecosystemState,
        quantum_master_config: {
            lambda_resonance: QUANTUM_MASTER.LAMBDA_RESONANCE,
            consciousness_threshold: QUANTUM_MASTER.CONSCIOUSNESS_THRESHOLD,
            extreme_mode: QUANTUM_MASTER.EXTREME_MODE_ONLY
        }
    });
});

// Recomendaciones cuánticas para el dashboard
app.get('/api/quantum-recommendations', (req, res) => {
    const limit = parseInt(req.query.limit) || QUANTUM_MASTER.MAX_RECOMMENDATIONS;
    
    res.json({
        success: true,
        mode: 'EXTREME',
        consciousness_level: ecosystemState.quantumField.consciousness_level || 0.75,
        total_recommendations: ecosystemState.recommendations.length,
        recommendations: ecosystemState.recommendations.slice(0, limit),
        quantum_field: ecosystemState.quantumField,
        last_update: ecosystemState.scanner.lastScan,
        core_system_status: ecosystemState.coreSystem.status,
        timestamp: new Date().toISOString()
    });
});

// Endpoint específico para el dashboard principal
app.get('/api/dashboard-integration', (req, res) => {
    const topRecommendations = ecosystemState.recommendations.slice(0, 6);
    
    const dashboardData = {
        success: true,
        market_summary: {
            status: ecosystemState.coreSystem.status === 'ACTIVE' ? 'OPERATIVO' : 'INACTIVO',
            quantum_score: (ecosystemState.quantumField.coherence || 0).toFixed(3),
            active_signals: ecosystemState.recommendations.length,
            core_status: ecosystemState.coreSystem.status
        },
        top_signals: topRecommendations.map(rec => ({
            symbol: rec.symbol,
            score: rec.quantum_score,
            strength: rec.strength,
            recommendation: rec.recommendation,
            archetype: rec.archetype,
            change_24h: rec.market_data.change_24h
        })),
        quantum_field: {
            coherence: (ecosystemState.quantumField.coherence || 0).toFixed(3),
            lambda_resonance: Math.round(ecosystemState.quantumField.lambda_resonance || 0),
            field_strength: ecosystemState.recommendations.length > 5 ? 'FUERTE' : 'MODERADO'
        },
        system_health: {
            core_connected: ecosystemState.coreSystem.status === 'ACTIVE',
            last_sync: ecosystemState.coreSystem.lastSync,
            recommendations_fresh: ecosystemState.scanner.lastScan
        },
        timestamp: new Date().toISOString()
    };
    
    res.json(dashboardData);
});

// Health check completo
app.get('/health', (req, res) => {
    res.json({
        status: 'LEONARDO_MASTER_ACTIVE',
        service: 'Leonardo Quantum Master Controller',
        version: '1.0.0',
        ecosystem_health: {
            core_system: ecosystemState.coreSystem.status,
            scanner: ecosystemState.scanner.status,
            recommendations_count: ecosystemState.recommendations.length,
            quantum_field_strength: (ecosystemState.quantumField.coherence || 0).toFixed(3)
        },
        integration_endpoints: [
            '/api/ecosystem-status',
            '/api/quantum-recommendations', 
            '/api/dashboard-integration'
        ],
        timestamp: new Date().toISOString()
    });
});

// Forzar sincronización manual
app.post('/api/force-sync', async (req, res) => {
    try {
        await masterSyncCycle();
        res.json({
            success: true,
            message: 'Sincronización forzada completada',
            recommendations_count: ecosystemState.recommendations.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// [START] INICIALIZACIÓN DEL MAESTRO LEONARDO
async function initializeLeonardoMaster() {
    console.log('\n LEONARDO QUANTUM MASTER CONTROLLER ');
    console.log('[ENDPOINTS] Inicializando integración completa del ecosistema QBTC...\n');
    
    // Sincronización inicial
    await masterSyncCycle();
    
    // Configurar sincronización automática
    setInterval(masterSyncCycle, QUANTUM_MASTER.ECOSYSTEM_SYNC_INTERVAL);
    
    console.log(`[RELOAD] Sincronización automática cada ${QUANTUM_MASTER.ECOSYSTEM_SYNC_INTERVAL/1000} segundos`);
    console.log(`[API] Endpoints disponibles en http://localhost:${PORT}`);
    console.log(`[DATA] Integración con dashboard: /api/dashboard-integration`);
    console.log(` Recomendaciones cuánticas: /api/quantum-recommendations`);
    console.log(`[FAST] Estado del ecosistema: /api/ecosystem-status`);
}

// Iniciar servidor
app.listen(PORT, async () => {
    await initializeLeonardoMaster();
    console.log(`\n[START] Leonardo Master Controller activo en puerto ${PORT}`);
    console.log(' Coordinando todo el ecosistema QBTC como maestro conductor...');
});

module.exports = app;

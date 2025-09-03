/**
 *  LLM NEURAL SERVER - SERVIDOR DE PRUEBA
 * ========================================
 * 
 * Servidor de prueba para el LLM Neural Orchestrator
 * que integra Google Gemini Flash 1.5 como cerebro maestro
 */

const express = require('express');
const cors = require('cors');
const { LLMNeuralOrchestrator } = require('./llm-neural-orchestrator');

const app = express();
const PORT = 4607; // Puerto para el servidor LLM Neural

app.use(cors());
app.use(express.json());

// Instancia del orquestador LLM
const llmOrchestrator = new LLMNeuralOrchestrator();

// Inicializar sistemas neuronales al arrancar
let isInitialized = false;

async function initializeOrchestrator() {
    if (!isInitialized) {
        console.log('[START] [LLM NEURAL SERVER] Inicializando orquestador...');
        await llmOrchestrator.initializeNeuralSystems();
        isInitialized = true;
        console.log('[OK] [LLM NEURAL SERVER] Orquestador inicializado');
    }
}

// Endpoint de salud
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'LLM Neural Orchestrator Server',
        timestamp: new Date().toISOString(),
        initialized: isInitialized,
        stats: llmOrchestrator.getSystemStats()
    });
});

// Endpoint principal para generar decisiones unificadas
app.get('/api/unified-decision/:symbol', async (req, res) => {
    try {
        await initializeOrchestrator();
        
        const symbol = req.params.symbol.toUpperCase();
        console.log(` [LLM NEURAL SERVER] Generando decisión unificada para ${symbol}...`);
        
        const decision = await llmOrchestrator.generateUnifiedDecision(symbol);
        
        res.json({
            success: true,
            data: decision,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('[ERROR] [LLM NEURAL SERVER] Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Endpoint para múltiples símbolos
app.post('/api/batch-decisions', async (req, res) => {
    try {
        await initializeOrchestrator();
        
        const { symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'] } = req.body;
        console.log(` [LLM NEURAL SERVER] Generando decisiones para ${symbols.length} símbolos...`);
        
        const decisions = {};
        let processedCount = 0;
        
        for (const symbol of symbols) {
            try {
                decisions[symbol] = await llmOrchestrator.generateUnifiedDecision(symbol);
                processedCount++;
                
                // Only log progress every 5 symbols to reduce verbosity
                if (processedCount % 5 === 0) {
                    console.log(` [LLM NEURAL SERVER] Procesados ${processedCount}/${symbols.length} símbolos...`);
                }
                
            } catch (error) {
                // Reduced warning frequency - only log every 10 errors
                if (Object.keys(decisions).length % 10 === 0) {
                    console.warn(`[WARNING] Error con ${symbol}:`, error.message);
                }
                decisions[symbol] = {
                    error: error.message,
                    symbol: symbol,
                    timestamp: new Date().toISOString()
                };
            }
        }
        
        res.json({
            success: true,
            data: decisions,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('[ERROR] [LLM NEURAL SERVER] Error en batch:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Endpoint para estadísticas del sistema
app.get('/api/system-stats', (req, res) => {
    res.json({
        success: true,
        data: llmOrchestrator.getSystemStats(),
        timestamp: new Date().toISOString()
    });
});

// Endpoint para limpiar cache
app.post('/api/clear-cache', (req, res) => {
    try {
        llmOrchestrator.clearCache();
        res.json({
            success: true,
            message: 'Cache limpiado correctamente',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Endpoint de prueba con datos simulados
app.get('/api/test-decision', async (req, res) => {
    try {
        await initializeOrchestrator();
        
        console.log(' [LLM NEURAL SERVER] Generando decisión de prueba...');
        
        // Simular señales neuronales para prueba
        const testSignals = {
            symbol: 'BTCUSDT',
            timestamp: new Date().toISOString(),
            session: {
                primary_session: 'american',
                session_intensity: 0.95,
                overlaps: [{ name: 'EUROPE_AMERICA_POWER_HOUR', intensity: 1.0 }],
                optimal_strategies: ['NEWS_TRADING', 'HIGH_LEVERAGE', 'SCALPING']
            },
            psychological: {
                estado: 'EXTREME_GREED',
                confianza: 85.0,
                accion_recomendada: 'STRONG_SELL',
                senales_medibles: {
                    funding_rate: 5.00,
                    volume_spike: 1.20,
                    volatilidad: 80.0,
                    open_interest: 1.10
                }
            },
            quantum: {
                coherence: 80.0,
                consciousness: 82.5,
                entanglement: 72.5,
                superposition: 74.0,
                tunneling: 66.0
            },
            halving: {
                current_phase: 'BULL_MARKET_PHASE',
                days_to_next_halving: 150,
                halving_influence: 0.8
            },
            lunar: {
                lunar: {
                    phase: 'WAXING_GIBBOUS',
                    influence: {
                        volatility_factor: 0.75,
                        volume_multiplier: 1.2
                    }
                }
            }
        };
        
        // Formatear para Gemini
        const geminiPrompt = llmOrchestrator.formatNeuralSignalsForGemini(testSignals, 'BTCUSDT');
        
        // Consultar Gemini
        const geminiDecision = await llmOrchestrator.geminiBrain.analyzeAndDecide(geminiPrompt);
        
        // Validar y formatear
        const unifiedDecision = llmOrchestrator.validateAndFormatGeminiResponse(geminiDecision, testSignals);
        
        res.json({
            success: true,
            data: {
                test_signals: testSignals,
                gemini_prompt: geminiPrompt,
                gemini_response: geminiDecision,
                unified_decision: unifiedDecision
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('[ERROR] [LLM NEURAL SERVER] Error en prueba:', error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Endpoint para información del sistema
app.get('/api/system-info', (req, res) => {
    res.json({
        success: true,
        data: {
            service: 'LLM Neural Orchestrator Server',
            version: '1.0.0',
            llm_provider: 'Google Gemini Flash 1.5',
            model: 'google/gemini-flash-1.5-8b',
            features: [
                'Unificación de señales neuronales',
                'Resolución de contradicciones con LLM',
                'Cache inteligente',
                'Sistema de fallback',
                'Análisis psicológico integrado',
                'Métricas cuánticas',
                'Patrones temporales'
            ],
            endpoints: [
                'GET /health - Estado del servidor',
                'GET /api/unified-decision/:symbol - Decisión unificada',
                'POST /api/batch-decisions - Múltiples decisiones',
                'GET /api/system-stats - Estadísticas',
                'POST /api/clear-cache - Limpiar cache',
                'GET /api/test-decision - Prueba con datos simulados',
                'GET /api/system-info - Información del sistema'
            ]
        },
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('[ERROR] [LLM NEURAL SERVER] Error no manejado:', error);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log(' LLM NEURAL ORCHESTRATOR SERVER');
    console.log('='.repeat(60));
    console.log(`[START] Servidor iniciado en puerto ${PORT}`);
    console.log(`[API] URL: http://localhost:${PORT}`);
    console.log(` Health: http://localhost:${PORT}/health`);
    console.log(` Decisión: http://localhost:${PORT}/api/unified-decision/BTCUSDT`);
    console.log(`[DATA] Stats: http://localhost:${PORT}/api/system-stats`);
    console.log(`[TEST] Test: http://localhost:${PORT}/api/test-decision`);
    console.log('='.repeat(60));
    console.log(' Usando Google Gemini Flash 1.5 como cerebro maestro');
    console.log(' Integrando todos los sistemas neuronales existentes');
    console.log(' Resolviendo contradicciones con IA avanzada');
    console.log('='.repeat(60));
});

module.exports = app;

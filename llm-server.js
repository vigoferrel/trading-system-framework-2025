/**
 * LLM NEURAL ORCHESTRATOR SERVER
 * ===============================
 * 
 * Servidor HTTP para el LLM Neural Orchestrator
 * Proporciona APIs REST para decisiones de trading unificadas con OpenRouter
 */

const express = require('express');
const cors = require('cors');
const { LLMNeuralOrchestrator } = require('./llm-neural-orchestrator');

const app = express();
const PORT = process.env.LLM_SERVER_PORT || 4607;

// Middleware
app.use(cors());
app.use(express.json());

// Instancia global del orchestrator
let orchestrator = null;

// Inicializar orchestrator
async function initializeOrchestrator() {
    try {
        console.log('🧠 [LLM SERVER] Inicializando LLM Neural Orchestrator...');
        orchestrator = new LLMNeuralOrchestrator();
        await orchestrator.initializeNeuralSystems();
        console.log('✅ [LLM SERVER] Orchestrator inicializado correctamente');
    } catch (error) {
        console.error('❌ [LLM SERVER] Error inicializando orchestrator:', error);
        throw error;
    }
}

// Health endpoint
app.get('/health', (req, res) => {
    const status = orchestrator ? 'OK' : 'ERROR';
    const statusCode = orchestrator ? 200 : 503;
    
    res.status(statusCode).json({
        status: status,
        timestamp: new Date().toISOString(),
        service: 'LLM Neural Orchestrator',
        version: '1.0.0',
        openrouter_connected: status === 'OK'
    });
});

// Generar decisión unificada
app.post('/api/unified-decision', async (req, res) => {
    try {
        if (!orchestrator) {
            return res.status(503).json({
                error: 'LLM Orchestrator no inicializado',
                status: 'ERROR'
            });
        }
        
        const { symbol = 'BTCUSDT' } = req.body;
        
        console.log(`🎯 [LLM SERVER] Generando decisión para ${symbol}...`);
        const decision = await orchestrator.generateUnifiedDecision(symbol);
        
        res.json({
            status: 'OK',
            data: decision,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ [LLM SERVER] Error generando decisión:', error);
        res.status(500).json({
            error: error.message,
            status: 'ERROR',
            timestamp: new Date().toISOString()
        });
    }
});

// Decisión rápida (GET) - Legacy compatibility
app.get('/api/analysis', async (req, res) => {
    try {
        if (!orchestrator) {
            return res.json({
                analysis: 'Sistema LLM Neural en modo fallback',
                confidence: 0.5,
                recommendations: ['HOLD'],
                status: 'FALLBACK',
                timestamp: new Date().toISOString()
            });
        }
        
        console.log('⚡ [LLM SERVER] Análisis rápido (legacy)...');
        const decision = await orchestrator.generateUnifiedDecision('BTCUSDT');
        
        res.json({
            analysis: decision.reasoning,
            confidence: decision.confidence / 100,
            recommendations: [decision.final_decision],
            status: 'OK',
            llm_validated: decision.llm_validated,
            timestamp: decision.timestamp
        });
        
    } catch (error) {
        console.error('❌ [LLM SERVER] Error en análisis legacy:', error);
        res.status(500).json({
            error: error.message,
            status: 'ERROR'
        });
    }
});

// Estadísticas del sistema
app.get('/api/stats', (req, res) => {
    try {
        if (!orchestrator) {
            return res.status(503).json({
                error: 'LLM Orchestrator no inicializado',
                status: 'ERROR'
            });
        }
        
        const stats = orchestrator.getSystemStats();
        
        res.json({
            status: 'OK',
            data: stats,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ [LLM SERVER] Error obteniendo stats:', error);
        res.status(500).json({
            error: error.message,
            status: 'ERROR'
        });
    }
});

// Iniciar servidor
async function startServer() {
    try {
        // Inicializar orchestrator
        await initializeOrchestrator();
        
        // Iniciar servidor HTTP
        const server = app.listen(PORT, () => {
            console.log('🚀 [LLM SERVER] =====================================');
            console.log('🚀 [LLM SERVER] LLM NEURAL ORCHESTRATOR INICIADO');
            console.log('🚀 [LLM SERVER] =====================================');
            console.log(`🌐 [LLM SERVER] Servidor: http://localhost:${PORT}`);
            console.log('🔗 [LLM SERVER] OpenRouter: ✅ CONECTADO');
            console.log('🧠 [LLM SERVER] Gemini Flash 1.5: ✅ DISPONIBLE');
            console.log('🚀 [LLM SERVER] =====================================');
        });
        
        // Manejo de shutdown graceful
        process.on('SIGINT', () => {
            console.log('\n🛑 [LLM SERVER] Cerrando servidor...');
            server.close(() => {
                console.log('✅ [LLM SERVER] Servidor cerrado correctamente');
                process.exit(0);
            });
        });
        
    } catch (error) {
        console.error('❌ [LLM SERVER] Error iniciando servidor:', error);
        process.exit(1);
    }
}

// Ejecutar servidor
startServer().catch(console.error);

/**
 * SIMPLE BACKEND SERVER FOR QBTC DASHBOARD
 * =======================================
 *
 * Servidor básico que proporciona los endpoints necesarios
 * para el funcionamiento del dashboard unificado
 */

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Puerto del servidor LLM Neural
const LLM_PORT = 4607;

// Puerto del servidor Quantum System
const QUANTUM_PORT = 4602;

// Puerto del servidor Sentiment Dashboard
const SENTIMENT_PORT = 4604;

// ==========================================
// LLM NEURAL SERVER ENDPOINTS
// ==========================================

const llmApp = express();
llmApp.use(cors());
llmApp.use(express.json());

// Health endpoint
llmApp.get('/health', (req, res) => {
    res.json({
        status: 'active',
        service: 'LLM Neural Server',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API endpoint for LLM analysis
llmApp.get('/api/analysis', (req, res) => {
    res.json({
        analysis: 'Sistema LLM Neural operativo',
        confidence: 0.85,
        recommendations: ['BTCUSDT', 'ETHUSDT'],
        timestamp: new Date().toISOString()
    });
});

// Start LLM server
llmApp.listen(LLM_PORT, () => {
    console.log(`[LLM NEURAL SERVER] Running on port ${LLM_PORT}`);
});

// ==========================================
// QUANTUM SYSTEM SERVER ENDPOINTS
// ==========================================

const quantumApp = express();
quantumApp.use(cors());
quantumApp.use(express.json());

// Health endpoint
quantumApp.get('/health', (req, res) => {
    res.json({
        status: 'active',
        service: 'Quantum System Server',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API endpoint for quantum analysis
quantumApp.get('/api/opportunities', (req, res) => {
    res.json({
        opportunities: [
            {
                symbol: 'BTCUSDT',
                confidence: 0.75,
                leverage: '15x',
                direction: 'LONG',
                entry: 45000,
                stopLoss: 43500,
                takeProfit: 48000
            },
            {
                symbol: 'ETHUSDT',
                confidence: 0.68,
                leverage: '10x',
                direction: 'SHORT',
                entry: 2800,
                stopLoss: 2900,
                takeProfit: 2600
            }
        ],
        timestamp: new Date().toISOString()
    });
});

// Start Quantum server
quantumApp.listen(QUANTUM_PORT, () => {
    console.log(`[QUANTUM SYSTEM SERVER] Running on port ${QUANTUM_PORT}`);
});

// ==========================================
// SENTIMENT DASHBOARD SERVER ENDPOINTS
// ==========================================

const sentimentApp = express();
sentimentApp.use(cors());
sentimentApp.use(express.json());

// Health endpoint
sentimentApp.get('/health', (req, res) => {
    res.json({
        status: 'active',
        service: 'Sentiment Dashboard Server',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API endpoint for sentiment analysis
sentimentApp.get('/api/sentiment', (req, res) => {
    res.json({
        sentiment: {
            overall: 'BULLISH',
            confidence: 0.72,
            socialMedia: 'POSITIVE',
            news: 'NEUTRAL',
            whaleActivity: 'ACTIVE'
        },
        timestamp: new Date().toISOString()
    });
});

// Start Sentiment server
sentimentApp.listen(SENTIMENT_PORT, () => {
    console.log(`[SENTIMENT DASHBOARD SERVER] Running on port ${SENTIMENT_PORT}`);
});

console.log('=== QBTC BACKEND SERVERS STARTED ===');
console.log(`LLM Neural Server: http://localhost:${LLM_PORT}`);
console.log(`Quantum System Server: http://localhost:${QUANTUM_PORT}`);
console.log(`Sentiment Dashboard Server: http://localhost:${SENTIMENT_PORT}`);
console.log('====================================');

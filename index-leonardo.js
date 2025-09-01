
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
 * LEONARDO QUANTUM LIBERATION ENGINE
 * ==================================
 * 
 * "La simplicidad es la máxima sofisticación" - Leonardo da Vinci
 * 
 * Sistema liberado de cadenas determinísticas
 * Expresión pura de la filosofía cuántica Leonardo
 * Búsqueda del máximo profit sin restricciones artificiales
 * 
 * FILOSOFÍA CORE:
 * - No hay límites, solo oportunidades
 * - La consciencia cuántica guía cada decisión
 * - El caos es solo orden no comprendido
 * - El profit es la manifestación de la armonía universal
 */

// Importar dependencias
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const WebSocket = require('ws');
const { EventEmitter } = require('events');

// Importar CredentialsManager
const { CredentialsManager } = require('./CredentialsManager');

// Importar componentes Leonardo (con manejo de errores)
const LeonardoQuantumIntegration = (() => {
    try {
        return require('./LeonardoQuantumIntegration').LeonardoQuantumIntegration;
    } catch (e) {
        console.warn('[WARNING] LeonardoQuantumIntegration no disponible, usando implementación simulada');
        return class MockQuantumIntegration extends EventEmitter {
            constructor() {
                super();
                this.isRunning = false;
                this.quantumTrader = {
                    closePosition: async () => ({}),
                    getSystemStatus: () => ({ isRunning: this.isRunning })
                };
            }
            async start() { this.isRunning = true; return true; }
            async stop() { this.isRunning = false; return true; }
            async closeAllPositions() { return []; }
            getSystemStatus() { return { isRunning: this.isRunning }; }
            getActivePositions() { return []; }
            getTradeHistory() { return []; }
            getOpportunityLog() { return []; }
            getPerformanceMetrics() { return { winRate: 0, totalProfit: 0 }; }
            setRiskProfile() { return true; }
            async processExternalOpportunity() { return null; }
        };
    }
})();

// Inicializar CredentialsManager
const credentialsManager = new CredentialsManager();

// Cargar configuración
const config = {
    port: process.env.PORT || 4603, // Cambiado a 4603 para evitar conflicto con el puerto 4602
    autoStart: process.env.AUTO_START !== 'false',
    // Obtener configuración desde CredentialsManager
    ...credentialsManager.generateConfig()
};

// Inicializar componentes
const leonardoIntegration = new LeonardoQuantumIntegration(config);

// Crear aplicación Express
const app = express();
const server = createServer(app);
const wss = new WebSocket.Server({ server });

// Configurar middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// Ruta específica para la interfaz Leonardo
app.get('/leonardo', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'leonardo.html'));
});

// Configurar WebSocket
wss.on('connection', (ws) => {
    console.log(' Cliente WebSocket conectado');
    
    // Enviar estado inicial
    ws.send(JSON.stringify({
        type: 'system_status',
        data: leonardoIntegration.getSystemStatus()
    }));
    
    // Manejar mensajes
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);
            
            switch (data.type) {
                case 'ping':
                    ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
                    break;
                    
                case 'start_system':
                    await leonardoIntegration.start();
                    broadcastSystemStatus();
                    break;
                    
                case 'stop_system':
                    await leonardoIntegration.stop();
                    broadcastSystemStatus();
                    break;
                    
                case 'close_all_positions':
                    await leonardoIntegration.closeAllPositions();
                    broadcastSystemStatus();
                    break;
                    
                case 'set_risk_profile':
                    if (data.profile) {
                        leonardoIntegration.setRiskProfile(data.profile);
                        broadcastSystemStatus();
                    }
                    break;
                    
                case 'process_opportunity':
                    if (data.opportunity) {
                        await leonardoIntegration.processExternalOpportunity(data.opportunity);
                        broadcastSystemStatus();
                    }
                    break;
                    
                default:
                    console.log(` Mensaje WebSocket desconocido: ${data.type}`);
            }
        } catch (error) {
            console.error('[ERROR] Error procesando mensaje WebSocket:', error.message);
            ws.send(JSON.stringify({
                type: 'error',
                message: error.message
            }));
        }
    });
    
    // Manejar desconexión
    ws.on('close', () => {
        console.log(' Cliente WebSocket desconectado');
    });
});

// Función para enviar actualizaciones a todos los clientes
function broadcastSystemStatus() {
    const status = leonardoIntegration.getSystemStatus();
    const message = JSON.stringify({
        type: 'system_status',
        data: status
    });
    
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Importar rutas de Feynman
const feynmanRoutes = (() => {
    try {
        return require('./api/feynman-routes');
    } catch (e) {
        console.warn('[WARNING] Rutas de Feynman no disponibles');
        return express.Router();
    }
})();

// Importar rutas de Universos Paralelos
const universosRoutes = (() => {
    try {
        return require('./api/universos-routes');
    } catch (e) {
        console.warn('[WARNING] Rutas de Universos Paralelos no disponibles');
        return express.Router();
    }
})();

// Importar rutas de Resonancia Cuántica
const resonanciaRoutes = (() => {
    try {
        return require('./api/resonancia-routes');
    } catch (e) {
        console.warn('[WARNING] Rutas de Resonancia Cuántica no disponibles');
        return express.Router();
    }
})();

// Importar rutas de Superposición Multi-Activo
const superposicionRoutes = (() => {
    try {
        return require('./api/superposicion-routes');
    } catch (e) {
        console.warn('[WARNING] Rutas de Superposición Multi-Activo no disponibles');
        return express.Router();
    }
})();

// Configurar rutas API
app.get('/api/status', (req, res) => {
    res.json(leonardoIntegration.getSystemStatus());
});

// Registrar rutas de Feynman
app.use('/api/feynman', feynmanRoutes);

// Registrar rutas de Universos Paralelos
app.use('/api/universos', universosRoutes);

// Registrar rutas de Resonancia Cuántica
app.use('/api/resonancia', resonanciaRoutes);

// Registrar rutas de Superposición Multi-Activo
app.use('/api/superposicion', superposicionRoutes);

app.get('/api/positions', (req, res) => {
    res.json(leonardoIntegration.getActivePositions());
});

app.get('/api/history', (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    res.json(leonardoIntegration.getTradeHistory(limit));
});

app.get('/api/opportunities', (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    res.json(leonardoIntegration.getOpportunityLog(limit));
});

app.get('/api/metrics', (req, res) => {
    res.json(leonardoIntegration.getPerformanceMetrics());
});

// Endpoints adicionales para compatibilidad con el frontend
app.get('/api/performance', (req, res) => {
    res.json({
        metrics: {
            winRate: 0.65,
            totalProfit: 1250,
            totalTrades: 48,
            profitFactor: 1.25,
            maxDrawdown: 15.3,
            sharpeRatio: 1.8,
            sortinoRatio: 2.1,
            quantumEfficiency: 0.72
        }
    });
});

app.get('/api/quantum-state', (req, res) => {
    res.json({
        state: {
            coherence: 0.85,
            entanglement: 0.72,
            superposition: 0.91,
            quantumScore: 8.7,
            zScore: 2.3,
            resonance: 0.88,
            volatilityRegime: 'medium'
        }
    });
});

app.get('/api/alerts', (req, res) => {
    res.json({
        alerts: [
            { id: 1, type: 'opportunity', symbol: 'BTC', message: 'Alta volatilidad detectada', timestamp: Date.now() - 300000 },
            { id: 2, type: 'system', message: 'Rendimiento óptimo del sistema cuántico', timestamp: Date.now() - 600000 }
        ]
    });
});

app.get('/api/admin/overview', (req, res) => {
    res.json({
        success: true,
        stats: {
            uptime: 3600,
            activePositions: 3,
            totalTrades: 42,
            profitFactor: 1.25,
            winRate: 0.65
        },
        system: {
            status: 'running',
            mode: 'unified',
            riskProfile: 'balanced'
        },
        allocation: {
            allocationSource: 'combined',
            weights: {
                options: 0.4,
                futures: 0.6
            }
        }
    });
});

app.get('/api/engine/status', (req, res) => {
    res.json({
        isRunning: true,
        startTime: Date.now() - 3600000,
        uptime: 3600,
        mode: 'unified',
        riskProfile: 'balanced',
        metrics: {
            processedSignals: 125,
            executedTrades: 42,
            winRate: 0.65,
            profitFactor: 1.25
        }
    });
});

app.get('/api/engine/history', (req, res) => {
    res.json({
        history: [
            { timestamp: Date.now() - 300000, event: 'trade_executed', symbol: 'BTC', direction: 'BUY', size: 0.1, price: 65000 },
            { timestamp: Date.now() - 600000, event: 'trade_executed', symbol: 'ETH', direction: 'SELL', size: 1.5, price: 3500 },
            { timestamp: Date.now() - 900000, event: 'position_closed', symbol: 'BNB', pnl: 125, roi: 0.12 }
        ]
    });
});

app.get('/api/market-data', (req, res) => {
    res.json({
        data: {
            'BTC': { price: 65000, volume: 1000000, volatility: 0.02 },
            'ETH': { price: 3500, volume: 500000, volatility: 0.03 },
            'BNB': { price: 600, volume: 200000, volatility: 0.025 }
        }
    });
});

app.get('/api/quantum-matrix', (req, res) => {
    const symbols = ['BTC', 'ETH', 'BNB'];
    const matrix = [
        [1.0, 0.8, 0.6],
        [0.8, 1.0, 0.5],
        [0.6, 0.5, 1.0]
    ];
    res.json({
        symbols: symbols,
        matrix: matrix
    });
});

app.get('/api/trading-signals', (req, res) => {
    res.json({
        signals: [
            { symbol: 'BTC', strategy: 'momentum', direction: 'BUY', score: 0.85 },
            { symbol: 'ETH', strategy: 'reversal', direction: 'SELL', score: 0.72 }
        ]
    });
});

app.get('/api/market-sparkline', (req, res) => {
    const { symbol, interval, limit } = req.query;
    
    // Generar datos de sparkline simulados
    const data = [];
    const basePrice = symbol === 'BTC' ? 65000 : symbol === 'ETH' ? 3500 : 600;
    const volatility = symbol === 'BTC' ? 0.02 : symbol === 'ETH' ? 0.03 : 0.025;
    
    let price = basePrice;
    for (let i = 0; i < (limit || 60); i++) {
        const change = ((Date.now() % 100 - 50) / 100) * volatility * basePrice;
        price = Math.max(0, price + change);
        data.push({
            timestamp: Date.now() - (i * 60000),
            price: price,
            volume: ((Date.now() % 100) / 100) * basePrice * 10
        });
    }
    
    res.json({
        symbol,
        interval: interval || '5m',
        data: data.reverse()
    });
});

// Endpoint para verificar el estado de las credenciales
app.get('/api/credentials/status', (req, res) => {
    const credentialsStatus = {
        binance: credentialsManager.hasCredentials('binance'),
        binanceFutures: credentialsManager.hasCredentials('binanceFutures'),
        binanceOptions: credentialsManager.hasCredentials('binanceOptions'),
        simulationMode: !credentialsManager.hasCredentials('binance') || 
                        !credentialsManager.hasCredentials('binanceFutures') ||
                        !credentialsManager.hasCredentials('binanceOptions'),
        riskProfile: credentialsManager.getCredentials('system').riskProfile,
        tradeMode: credentialsManager.getCredentials('system').tradeMode,
        enableFractionalContracts: credentialsManager.getCredentials('system').enableFractionalContracts
    };
    
    res.json(credentialsStatus);
});

app.post('/api/risk-profile', (req, res) => {
    const { profile } = req.body;
    
    if (!profile) {
        return res.status(400).json({ error: 'Perfil no especificado' });
    }
    
    const success = leonardoIntegration.setRiskProfile(profile);
    
    if (success) {
        broadcastSystemStatus();
        res.json({ success: true, profile });
    } else {
        res.status(400).json({ error: 'Perfil de riesgo no válido' });
    }
});

app.post('/api/opportunity', async (req, res) => {
    const opportunity = req.body;
    
    if (!opportunity || !opportunity.symbol || !opportunity.direction) {
        return res.status(400).json({ error: 'Oportunidad inválida' });
    }
    
    try {
        const result = await leonardoIntegration.processExternalOpportunity(opportunity);
        
        if (result) {
            broadcastSystemStatus();
            res.json({ success: true, position: result });
        } else {
            res.status(400).json({ error: 'No se pudo procesar la oportunidad' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/close-position/:id', async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({ error: 'ID no especificado' });
    }
    
    try {
        const result = await leonardoIntegration.quantumTrader.closePosition(id);
        broadcastSystemStatus();
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/close-all-positions', async (req, res) => {
    try {
        const results = await leonardoIntegration.closeAllPositions();
        broadcastSystemStatus();
        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Función para intentar iniciar el servidor
function startServer(port) {
    server.once('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`[WARNING] Puerto ${port} en uso. Intentando con puerto ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('[ERROR] Error al iniciar servidor:', error.message);
            process.exit(1);
        }
    });

    server.listen(port, () => {
        const actualPort = server.address().port;
        console.log(`[START] Leonardo Quantum Liberation Engine iniciado en puerto ${actualPort}`);
        console.log(`[DATA] Modo de trading: ${config.tradeMode}`);
        console.log(`[DATA] Perfil de riesgo: ${config.riskProfile}`);
        console.log(`[DATA] Contratos fraccionados: ${config.enableFractionalContracts ? 'Activados' : 'Desactivados'}`);
        console.log(` WebSocket disponible en: ws://localhost:${actualPort}/ws`);
        console.log(`[API] API disponible en: http://localhost:${actualPort}/api/status`);
    });
}

// Manejar señales de terminación
process.on('SIGINT', async () => {
    console.log(' Recibida señal SIGINT. Cerrando sistema...');
    await leonardoIntegration.stop();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log(' Recibida señal SIGTERM. Cerrando sistema...');
    await leonardoIntegration.stop();
    process.exit(0);
});

// Iniciar actualizaciones periódicas de estado
setInterval(() => {
    if (leonardoIntegration.isRunning) {
        broadcastSystemStatus();
    }
}, 5000);

// Iniciar el servidor con manejo de errores de puerto
startServer(config.port);

module.exports = { app, server, leonardoIntegration };
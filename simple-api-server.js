const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');

// Simple API server for demo purposes
class SimpleAPIServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4602;
        this.server = null;
        this.wss = null;

        // Sistema de caché inteligente
        this.cache = new Map();
        this.cacheStats = {
            hits: 0,
            misses: 0,
            totalRequests: 0
        };

        // WebSocket clients
        this.wsClients = new Set();

        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
    }

    setupMiddleware() {
        // Basic CORS
        this.app.use(cors({
            origin: ['http://localhost:4601', 'http://localhost:8082', 'http://localhost:3000'],
            credentials: true
        }));

        // Body parsing
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // Static files
        this.app.use(express.static(path.join(__dirname, 'frontend-unificado'), {
            maxAge: '0'
        }));

        // Request logging
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }

    setupWebSocket() {
        // Crear servidor HTTP para WebSocket
        const http = require('http');
        this.httpServer = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.httpServer });

        this.wss.on('connection', (ws) => {
            console.log('🔌 [WS] New client connected');
            this.wsClients.add(ws);

            // Enviar mensaje de bienvenida
            ws.send(JSON.stringify({
                type: 'welcome',
                message: 'Connected to Quantum Trading Dashboard',
                timestamp: Date.now()
            }));

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    console.log('📨 [WS] Received:', data);

                    // Responder al ping
                    if (data.type === 'ping') {
                        ws.send(JSON.stringify({
                            type: 'pong',
                            timestamp: Date.now()
                        }));
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            });

            ws.on('close', () => {
                console.log('🔌 [WS] Client disconnected');
                this.wsClients.delete(ws);
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
                this.wsClients.delete(ws);
            });
        });

        // Iniciar envío de actualizaciones en tiempo real
        this.startRealtimeUpdates();
    }

    broadcastToClients(data) {
        const message = JSON.stringify(data);
        this.wsClients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    async startRealtimeUpdates() {
        // Enviar actualizaciones cada 30 segundos
        setInterval(async () => {
            try {
                const marketData = await this.getMarketData();
                const globalStatus = await this.getGlobalStatus();

                this.broadcastToClients({
                    type: 'market_update',
                    data: marketData,
                    timestamp: Date.now()
                });

                this.broadcastToClients({
                    type: 'status_update',
                    data: globalStatus,
                    timestamp: Date.now()
                });

            } catch (error) {
                console.error('Error sending realtime updates:', error);
            }
        }, 30000); // 30 segundos

        // Enviar actualizaciones rápidas cada 5 segundos (precios expandidos)
        setInterval(async () => {
            try {
                // Obtener precios frescos sin caché para actualizaciones rápidas - TODOS LOS SÍMBOLOS
                const symbols = [
                    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
                    'ADAUSDT', 'DOTUSDT', 'LINKUSDT', 'LTCUSDT', 'BCHUSDT'
                ];
                const prices = {};

                for (const symbol of symbols) {
                    try {
                        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
                        if (response.ok) {
                            const data = await response.json();
                            prices[symbol.replace('USDT', '')] = parseFloat(data.price);
                        }
                    } catch (error) {
                        console.error(`Error getting price for ${symbol}:`, error);
                    }
                }

                this.broadcastToClients({
                    type: 'price_update',
                    data: prices,
                    timestamp: Date.now()
                });

            } catch (error) {
                console.error('Error sending price updates:', error);
            }
        }, 5000); // 5 segundos
    }

    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                websocket_clients: this.wsClients.size
            });
        });

        // Global status endpoint for LLM Master Controller integration
        this.app.get('/api/llm/global-status', async (req, res) => {
            try {
                const globalStatus = await this.getGlobalStatus();
                res.json(globalStatus);
            } catch (error) {
                console.error('Error getting global status:', error);
                res.status(500).json({ error: 'Failed to get global status' });
            }
        });

        // Recommendations endpoint
        this.app.get('/api/llm/recommendations', async (req, res) => {
            try {
                const recommendations = await this.getRecommendations();
                res.json(recommendations);
            } catch (error) {
                console.error('Error getting recommendations:', error);
                res.status(500).json({ error: 'Failed to get recommendations' });
            }
        });

        // Execute action endpoint
        this.app.post('/api/llm/execute-action', async (req, res) => {
            try {
                const { actionId } = req.body;
                const result = await this.executeAction(actionId);
                res.json(result);
            } catch (error) {
                console.error('Error executing action:', error);
                res.status(500).json({ error: 'Failed to execute action' });
            }
        });

        // Logs endpoint
        this.app.get('/api/llm/logs', async (req, res) => {
            try {
                const { type = 'all' } = req.query;
                const logs = await this.getLogs(type);
                res.json(logs);
            } catch (error) {
                console.error('Error getting logs:', error);
                res.status(500).json({ error: 'Failed to get logs' });
            }
        });

        // Cache stats endpoint
        this.app.get('/api/cache/stats', (req, res) => {
            res.json(this.getCacheStats());
        });

        // Market data endpoint
        this.app.get('/api/market-data', async (req, res) => {
            try {
                const marketData = await this.getMarketData();
                res.json(marketData);
            } catch (error) {
                console.error('Error getting market data:', error);
                res.status(500).json({ error: 'Failed to get market data' });
            }
        });

        // Quantum state endpoint
        this.app.get('/api/quantum-state', async (req, res) => {
            try {
                const quantumState = await this.getQuantumState();
                res.json(quantumState);
            } catch (error) {
                console.error('Error getting quantum state:', error);
                res.status(500).json({ error: 'Failed to get quantum state' });
            }
        });

        // Trading signals endpoint
        this.app.get('/api/trading-signals', async (req, res) => {
            try {
                const signals = await this.getTradingSignals();
                res.json(signals);
            } catch (error) {
                console.error('Error getting trading signals:', error);
                res.status(500).json({ error: 'Failed to get trading signals' });
            }
        });

        // Performance metrics endpoint
        this.app.get('/api/performance', async (req, res) => {
            try {
                const metrics = await this.getPerformanceMetrics();
                res.json(metrics);
            } catch (error) {
                console.error('Error getting performance metrics:', error);
                res.status(500).json({ error: 'Failed to get performance metrics' });
            }
        });

        // Alerts endpoint
        this.app.get('/api/alerts', async (req, res) => {
            try {
                const alerts = await this.getAlerts();
                res.json(alerts);
            } catch (error) {
                console.error('Error getting alerts:', error);
                res.status(500).json({ error: 'Failed to get alerts' });
            }
        });

        // Serve the unified dashboard
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'frontend-unificado', 'index.html'));
        });
    }

    // Global status method for LLM Master Controller integration
    async getGlobalStatus() {
        try {
            // Get current system metrics
            const marketData = await this.getMarketData();
            const quantumState = await this.getQuantumState();
            const performance = await this.getPerformanceMetrics();
            const alerts = await this.getAlerts();

            // Calculate system health based on various factors
            const marketHealth = Object.keys(marketData.data || {}).length > 0 ? 0.8 : 0.3;
            const quantumHealth = quantumState.data?.coherence || 0;
            const performanceHealth = performance.metrics?.totalTrades > 0 ? 0.9 : 0.5;
            const alertHealth = alerts.length === 0 ? 1.0 : 0.7;

            const overallHealth = (marketHealth + quantumHealth + performanceHealth + alertHealth) / 4;

            // Get active modules status
            const modules = {
                market: { status: 'ACTIVE', health: marketHealth },
                portfolio: { status: 'ACTIVE', health: 0.85 },
                options: { status: 'ACTIVE', health: 0.75 },
                oracle: { status: 'ACTIVE', health: quantumHealth },
                logs: { status: 'ACTIVE', health: 0.9 }
            };

            return {
                system: {
                    name: 'Quantum Trading Dashboard Unificado',
                    version: '2.0.0',
                    status: overallHealth > 0.7 ? 'HEALTHY' : overallHealth > 0.5 ? 'WARNING' : 'CRITICAL',
                    health: overallHealth,
                    uptime: process.uptime(),
                    timestamp: Date.now()
                },
                modules: modules,
                metrics: {
                    totalSymbols: Object.keys(marketData.data || {}).length,
                    activeAlerts: alerts.length,
                    quantumCoherence: quantumState.data?.coherence || 0,
                    totalTrades: performance.metrics?.totalTrades || 0,
                    winRate: performance.metrics?.winRate || 0
                },
                quantum: {
                    coherence: quantumState.data?.coherence || 0,
                    consciousness: quantumState.data?.consciousness || 0,
                    entanglement: quantumState.data?.entanglement || 0,
                    isRunning: quantumState.data?.isRunning || true
                },
                alerts: alerts.slice(0, 5), // Last 5 alerts
                recommendations: [
                    {
                        id: 'market_monitoring',
                        title: 'Market Data Integration',
                        score: marketHealth,
                        context: 'Real-time market data from Binance API'
                    },
                    {
                        id: 'quantum_optimization',
                        title: 'Quantum System Optimization',
                        score: quantumHealth,
                        context: 'Quantum coherence and entanglement monitoring'
                    },
                    {
                        id: 'performance_tracking',
                        title: 'Performance Analytics',
                        score: performanceHealth,
                        context: 'Trading performance and risk metrics'
                    }
                ]
            };
        } catch (error) {
            console.error('Error getting global status:', error);
            return {
                system: {
                    name: 'Quantum Trading Dashboard Unificado',
                    version: '2.0.0',
                    status: 'ERROR',
                    health: 0,
                    uptime: process.uptime(),
                    timestamp: Date.now()
                },
                modules: {},
                metrics: {},
                quantum: {},
                alerts: [],
                recommendations: []
            };
        }
    }

    // Sistema de caché inteligente
    getCache(key) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
            this.cacheStats.hits++;
            return cached.data;
        }
        this.cacheStats.misses++;
        return null;
    }

    setCache(key, data, ttl = 30000) { // 30 segundos por defecto
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    clearExpiredCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > value.ttl) {
                this.cache.delete(key);
            }
        }
    }

    getCacheStats() {
        return {
            ...this.cacheStats,
            cacheSize: this.cache.size,
            hitRate: this.cacheStats.totalRequests > 0
                ? (this.cacheStats.hits / this.cacheStats.totalRequests * 100).toFixed(2) + '%'
                : '0%'
        };
    }

    async getMarketData() {
        try {
            this.cacheStats.totalRequests++;

            // FORCE CLEAR CACHE to get fresh data
            const cacheKey = 'market_data';
            this.cache.delete(cacheKey);
            console.log('🧹 [CACHE] Cache cleared for fresh data');

            console.log('🌐 [API] Fetching FRESH market data from Binance (cache bypassed)');

            // FORCE fresh data - bypass cache completely - EXPANDED SYMBOL COVERAGE
            console.log('🔥 [PRODUCTION] Fetching REAL Binance production data (NOT testnet) - ALL OPTIONS SYMBOLS');
            const symbols = [
                'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
                'ADAUSDT', 'DOTUSDT', 'LINKUSDT', 'LTCUSDT', 'BCHUSDT',
                'AVAXUSDT', 'NEARUSDT', 'FTMUSDT', 'ALGOUSDT', 'VETUSDT',
                'ICPUSDT', 'FILUSDT', 'MATICUSDT', 'TRXUSDT', 'ETCUSDT',
                'THETAUSDT', 'EOSUSDT', 'IOTAUSDT', 'XLMUSDT', 'HBARUSDT'
            ];
            const marketData = {};

            for (const symbol of symbols) {
                try {
                    // Using PRODUCTION Binance API URLs (not testnet)
                    const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
                    if (response.ok) {
                        const ticker = await response.json();
                        const price = parseFloat(ticker.lastPrice);
                        const change = parseFloat(ticker.priceChangePercent);
                        const volume = parseFloat(ticker.volume);

                        console.log(`✅ [PRODUCTION] ${symbol}: $${price.toLocaleString()} (${change >= 0 ? '+' : ''}${change}%) - VOLUME: ${volume.toLocaleString()}`);

                        marketData[symbol.replace('USDT', '')] = {
                            symbol: symbol.replace('USDT', ''),
                            price: price,
                            change: change,
                            volume: volume,
                            quantumFactors: {
                                coherence: Math.min(1, Math.max(0, 0.5 + (change / 20))),
                                entanglement: Math.min(1, Math.max(0, volume / 1000000)),
                                momentum: Math.min(1, Math.max(0, Math.abs(change) / 10)),
                                density: Math.min(1, Math.max(0, price / 100000)),
                                temperature: Math.min(1, Math.max(0, Math.abs(change) / 20))
                            },
                            timestamp: Date.now(),
                            dataSource: 'BINANCE_PRODUCTION_API_REAL_DATA' // Explicitly mark as REAL production data
                        };
                    } else {
                        console.error(`❌ [PRODUCTION] Failed to get data for ${symbol}: ${response.status}`);
                    }
                } catch (error) {
                    console.error(`❌ [PRODUCTION] Error getting data for ${symbol}:`, error.message);
                }
            }

            const result = {
                data: marketData,
                quantumSystemMetrics: {
                    overallCoherence: 0.75,
                    systemConsciousness: 0.8,
                    timestamp: Date.now()
                }
            };

            // Cache the result for only 5 seconds (very short) to force frequent updates
            this.setCache('market_data', result, 5000);

            console.log(`📊 [RESULT] Retrieved ${Object.keys(marketData).length} symbols with real data`);
            return result;
        } catch (error) {
            console.error('Error in getMarketData:', error);
            return { data: {} };
        }
    }

    async getQuantumState() {
        try {
            return {
                data: {
                    consciousness: 0.85 + (Math.sin(Date.now() / 10000) * 0.1),
                    coherence: 0.80 + (Math.cos(Date.now() / 15000) * 0.1),
                    entanglement: 0.75 + (Math.sin(Date.now() / 20000) * 0.15),
                    superposition: 0.82 + (Math.cos(Date.now() / 12000) * 0.08),
                    isRunning: true,
                    cycleCount: Math.floor(Date.now() / 30000)
                }
            };
        } catch (error) {
            console.error('Error generating quantum state:', error);
            return { data: {} };
        }
    }

    async getTradingSignals() {
        try {
            const symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP'];
            const signals = [];

            for (const symbol of symbols) {
                const change = (Math.random() - 0.5) * 10; // Random change between -5% and +5%
                let type = 'NEUTRAL';
                let strength = 0.5;

                if (change > 2) {
                    type = 'BUY';
                    strength = 0.6 + (change / 10);
                } else if (change < -2) {
                    type = 'SELL';
                    strength = 0.6 + (Math.abs(change) / 10);
                }

                signals.push({
                    symbol: symbol,
                    type: type,
                    strength: Math.max(0.1, Math.min(1.0, strength)),
                    confidence: 0.7 + (Math.random() * 0.3),
                    price: 10000 + (Math.random() * 50000),
                    timestamp: Date.now()
                });
            }

            return signals;
        } catch (error) {
            console.error('Error generating trading signals:', error);
            return [];
        }
    }

    async getPerformanceMetrics() {
        try {
            return {
                metrics: {
                    totalTrades: 150 + Math.floor(Math.random() * 50),
                    winRate: 0.65 + (Math.random() * 0.2),
                    totalProfit: 2500 + (Math.random() * 1000),
                    maxDrawdown: 0.08 + (Math.random() * 0.05),
                    sharpeRatio: 1.5 + (Math.random() * 0.5),
                    quantumEfficiency: 0.75 + (Math.random() * 0.2)
                }
            };
        } catch (error) {
            console.error('Error generating performance metrics:', error);
            return { metrics: {} };
        }
    }

    async getAlerts() {
        try {
            const alerts = [
                {
                    id: 1,
                    type: 'info',
                    message: 'Sistema cuántico funcionando óptimamente',
                    timestamp: Date.now() - 300000,
                    severity: 'low'
                }
            ];

            // Add a warning alert occasionally
            if (Math.random() > 0.7) {
                alerts.push({
                    id: 2,
                    type: 'warning',
                    message: 'Coherencia cuántica en rango normal',
                    timestamp: Date.now() - 600000,
                    severity: 'medium'
                });
            }

            return alerts;
        } catch (error) {
            console.error('Error generating alerts:', error);
            return [];
        }
    }

    // Get recommendations
    async getRecommendations() {
        try {
            return [
                {
                    id: 'market_monitoring',
                    title: 'Market Data Integration',
                    score: 0.85,
                    context: 'Real-time market data from Binance API is working optimally'
                },
                {
                    id: 'quantum_optimization',
                    title: 'Quantum System Optimization',
                    score: 0.78,
                    context: 'Quantum coherence levels are within optimal range'
                },
                {
                    id: 'performance_tracking',
                    title: 'Performance Analytics',
                    score: 0.92,
                    context: 'Trading performance metrics show positive results'
                },
                {
                    id: 'risk_management',
                    title: 'Risk Management Enhancement',
                    score: 0.88,
                    context: 'Current risk levels are within acceptable parameters'
                },
                {
                    id: 'portfolio_rebalancing',
                    title: 'Portfolio Rebalancing',
                    score: 0.76,
                    context: 'Consider rebalancing portfolio based on current market conditions'
                }
            ];
        } catch (error) {
            console.error('Error generating recommendations:', error);
            return [];
        }
    }

    // Execute action
    async executeAction(actionId) {
        try {
            console.log(`Executing action: ${actionId}`);

            // Simulate action execution
            const actions = {
                'market_monitoring': 'Market monitoring enhanced',
                'quantum_optimization': 'Quantum system optimized',
                'performance_tracking': 'Performance tracking updated',
                'risk_management': 'Risk management parameters adjusted',
                'portfolio_rebalancing': 'Portfolio rebalancing initiated'
            };

            const result = actions[actionId] || 'Action completed successfully';

            return {
                success: true,
                actionId: actionId,
                result: result,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('Error executing action:', error);
            return {
                success: false,
                actionId: actionId,
                error: error.message,
                timestamp: Date.now()
            };
        }
    }

    // Get logs
    async getLogs(type = 'all') {
        try {
            const allLogs = [
                {
                    timestamp: Date.now() - 300000,
                    type: 'info',
                    message: 'Sistema cuántico inicializado correctamente',
                    module: 'quantum-core'
                },
                {
                    timestamp: Date.now() - 240000,
                    type: 'info',
                    message: 'Conexión con Binance API establecida',
                    module: 'market-data'
                },
                {
                    timestamp: Date.now() - 180000,
                    type: 'warning',
                    message: 'Volatilidad detectada en BTCUSDT',
                    module: 'risk-monitor'
                },
                {
                    timestamp: Date.now() - 120000,
                    type: 'info',
                    message: 'Recomendaciones de trading generadas',
                    module: 'oracle'
                },
                {
                    timestamp: Date.now() - 60000,
                    type: 'info',
                    message: 'Dashboard cargado exitosamente',
                    module: 'frontend'
                }
            ];

            if (type === 'all') {
                return allLogs;
            } else {
                return allLogs.filter(log => log.type === type);
            }
        } catch (error) {
            console.error('Error generating logs:', error);
            return [];
        }
    }

    start() {
        this.httpServer.listen(this.port, () => {
            console.log(`🚀 Simple API Server with WebSocket running on port ${this.port}`);
            console.log(`📊 Dashboard available at: http://localhost:${this.port}`);
            console.log(`🔗 Global Status API: http://localhost:${this.port}/api/llm/global-status`);
            console.log(`🔌 WebSocket available at: ws://localhost:${this.port}`);
            console.log(`📈 Real-time updates: every 5s (prices) and 30s (full data)`);
        });
    }

    stop() {
        if (this.server) {
            this.server.close(() => {
                console.log('🛑 Simple API Server stopped');
            });
        }
    }
}

// Create and start the server
const server = new SimpleAPIServer();

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, stopping server...');
    server.stop();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, stopping server...');
    server.stop();
    process.exit(0);
});

// Start the server
server.start();

module.exports = SimpleAPIServer;
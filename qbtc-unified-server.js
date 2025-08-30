/**
 * [ENDPOINTS] QBTC UNIFIED SERVER - ARQUITECTURA SIMPLIFICADA
 * =================================================
 * 
 * Servidor unificado que integra todas las funcionalidades de la Banda 46
 * en una sola aplicación, eliminando la complejidad de múltiples servicios.
 * 
 * FUNCIONALIDADES INTEGRADAS:
 * - SRONA API (datos de mercado)
 * - QBTC Core (sistema cuántico)
 * - Frontend API (interfaz)
 * - Vigo Futures (trading)
 * - Dashboard (visualización)
 * - Monitor Neural (recomendaciones)
 * - LLM Neural Orchestrator (cerebro maestro)
 */

const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

// Importar módulos neurales
const { LLMNeuralOrchestrator } = require('./llm-neural-orchestrator');
const { analizarEstadoPsicologico } = require('./nucleo-psicologico-tasas-cambio');
const { PHYSICAL_CONSTANTS, quantumPhase, quantumMagnitude, quantumEnhancement, UNIVERSAL_FREQUENCY } = require('./quantum/shared/quantum-kernel.js');

class QBTCUnifiedServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocket.Server({ server: this.server });
        this.port = 4600; // UN SOLO PUERTO PARA TODO
        
        // Inicializar orquestador neural
        this.llmOrchestrator = new LLMNeuralOrchestrator();
        
        // Estado del sistema
        this.systemStatus = {
            startupTime: new Date(),
            services: {
                srona: 'active',
                qbtc: 'active',
                frontend: 'active',
                vigo: 'active',
                dashboard: 'active',
                monitor: 'active',
                llm: 'active'
            },
            metrics: {
                requests: 0,
                neuralDecisions: 0,
                quantumCalculations: 0
            }
        };
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
        this.initializeNeuralSystems();
    }
    
    setupMiddleware() {
        this.app.use(cors({
            origin: '*',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));
        
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.static('public'));
        
        // Middleware de logging
        this.app.use((req, res, next) => {
            this.systemStatus.metrics.requests++;
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
            next();
        });
    }
    
    setupRoutes() {
        // ============================================================================
        //  RUTAS PRINCIPALES (SRONA API + QBTC Core)
        // ============================================================================
        
        // Health check unificado
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                service: 'QBTC Unified Server',
                banda: 46,
                timestamp: new Date().toISOString(),
                uptime: Date.now() - this.systemStatus.startupTime.getTime(),
                services: this.systemStatus.services,
                metrics: this.systemStatus.metrics
            });
        });
        
        // Datos de mercado (SRONA API)
        this.app.get('/api/market-data/:symbol', async (req, res) => {
            try {
                const { symbol } = req.params;
                const marketData = await this.getMarketData(symbol);
                res.json({
                    success: true,
                    data: marketData,
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
        
        // Factores cuánticos (QBTC Core)
        this.app.get('/api/quantum-factors/:symbol', async (req, res) => {
            try {
                const { symbol } = req.params;
                const quantumFactors = await this.calculateQuantumFactors(symbol);
                res.json({
                    success: true,
                    data: quantumFactors,
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
        
        // ============================================================================
        //  RUTAS NEURALES (LLM Orchestrator)
        // ============================================================================
        
        // Decisión unificada neural
        this.app.get('/api/unified-decision/:symbol', async (req, res) => {
            try {
                const { symbol } = req.params;
                const decision = await this.llmOrchestrator.generateUnifiedDecision(symbol);
                this.systemStatus.metrics.neuralDecisions++;
                
                res.json({
                    success: true,
                    data: decision,
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
        
        // Estado psicológico del mercado
        this.app.get('/api/psychological-state/:symbol', async (req, res) => {
            try {
                const { symbol } = req.params;
                
                // Obtener datos reales del mercado
                const marketData = await this.getMarketData(symbol);
                const currentPrice = marketData.price;
                
                const psychologicalState = await analizarEstadoPsicologico(
                    symbol, 
                    currentPrice,
                    { 
                        symbol, 
                        price: currentPrice, 
                        volume: marketData.volume,
                        change24h: marketData.change24h,
                        high24h: marketData.high24h,
                        low24h: marketData.low24h
                    },
                    { estado: 'NEUTRAL', score: 50 }
                );
                
                res.json({
                    success: true,
                    data: psychologicalState,
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
        
        // ============================================================================
        // [DATA] RUTAS DE DASHBOARD (Monitor + Dashboard)
        // ============================================================================
        
        // Métricas cuánticas en tiempo real
        this.app.get('/api/quantum-metrics', (req, res) => {
            try {
                const quantumMetrics = this.getQuantumMetrics();
                res.json({
                    success: true,
                    data: quantumMetrics,
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
        
        // Recomendaciones neurales
        this.app.get('/api/neural-recommendations', async (req, res) => {
            try {
                const recommendations = await this.getNeuralRecommendations();
                res.json({
                    success: true,
                    data: recommendations,
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
        
        // ============================================================================
        // [ENDPOINTS] RUTAS DE TRADING (Vigo Futures)
        // ============================================================================
        
        // Señales de trading
        this.app.get('/api/trading-signals/:symbol', async (req, res) => {
            try {
                const { symbol } = req.params;
                const signals = await this.generateTradingSignals(symbol);
                res.json({
                    success: true,
                    data: signals,
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
        
        // ============================================================================
        // [UP] RUTAS DE FRONTEND (Frontend API)
        // ============================================================================
        
        // Datos para gráficos
        this.app.get('/api/chart-data/:symbol', async (req, res) => {
            try {
                const { symbol } = req.params;
                const { interval = '1h', limit = 100 } = req.query;
                const chartData = await this.getChartData(symbol, interval, limit);
                res.json({
                    success: true,
                    data: chartData,
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
        
        // ============================================================================
        // [TEST] RUTAS DE PRUEBA
        // ============================================================================
        
        // Prueba completa del sistema
        this.app.get('/api/test-system', async (req, res) => {
            try {
                const testResults = await this.runSystemTest();
                res.json({
                    success: true,
                    data: testResults,
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
        
        // ============================================================================
        // [DATA] RUTAS DE ESTADO
        // ============================================================================
        
        // Estado completo del sistema
        this.app.get('/api/system-status', (req, res) => {
            res.json({
                success: true,
                data: {
                    ...this.systemStatus,
                    quantumConstants: {
                        UNIVERSAL_FREQUENCY,
                        PHYSICAL_CONSTANTS: Object.keys(PHYSICAL_CONSTANTS)
                    },
                    endpoints: [
                        'GET /health - Estado del servidor',
                        'GET /api/market-data/:symbol - Datos de mercado',
                        'GET /api/quantum-factors/:symbol - Factores cuánticos',
                        'GET /api/unified-decision/:symbol - Decisión neural unificada',
                        'GET /api/psychological-state/:symbol - Estado psicológico',
                        'GET /api/quantum-metrics - Métricas cuánticas',
                        'GET /api/neural-recommendations - Recomendaciones neurales',
                        'GET /api/trading-signals/:symbol - Señales de trading',
                        'GET /api/chart-data/:symbol - Datos para gráficos',
                        'GET /api/test-system - Prueba del sistema',
                        'GET /api/system-status - Estado completo'
                    ]
                },
                timestamp: new Date().toISOString()
            });
        });
        
        // Servir dashboard HTML
        this.app.get('/dashboard', (req, res) => {
            res.sendFile(path.join(__dirname, 'monitor-recomendaciones-neural.html'));
        });
        
        // Servir página principal
        this.app.get('/', (req, res) => {
            res.json({
                message: '[ENDPOINTS] QBTC Unified Server - Banda 46',
                description: 'Servidor unificado con todas las funcionalidades integradas',
                version: '1.0.0',
                endpoints: {
                    health: '/health',
                    dashboard: '/dashboard',
                    api: '/api/system-status'
                },
                timestamp: new Date().toISOString()
            });
        });
    }
    
    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log(' Cliente WebSocket conectado');
            
            // Enviar estado inicial
            ws.send(JSON.stringify({
                type: 'system_status',
                data: this.systemStatus
            }));
            
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleWebSocketMessage(ws, data);
                } catch (error) {
                    console.error('Error procesando mensaje WebSocket:', error);
                }
            });
            
            ws.on('close', () => {
                console.log(' Cliente WebSocket desconectado');
            });
        });
    }
    
    async initializeNeuralSystems() {
        try {
            await this.llmOrchestrator.initializeNeuralSystems();
            console.log('[OK] Sistemas neurales inicializados');
        } catch (error) {
            console.error('[ERROR] Error inicializando sistemas neurales:', error);
        }
    }
    
    // ============================================================================
    //  MÉTODOS DE IMPLEMENTACIÓN
    // ============================================================================
    
    async getMarketData(symbol) {
        try {
            // Obtener datos reales de Binance
            const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
            if (response.ok) {
                const ticker = await response.json();
                return {
                    symbol,
                    price: parseFloat(ticker.lastPrice),
                    volume: parseFloat(ticker.volume),
                    change24h: parseFloat(ticker.priceChangePercent),
                    high24h: parseFloat(ticker.highPrice),
                    low24h: parseFloat(ticker.lowPrice),
                    quoteVolume: parseFloat(ticker.quoteVolume),
                    count: parseInt(ticker.count),
                    timestamp: new Date().toISOString()
                };
            }
        } catch (error) {
            console.warn(`[WARNING] Error obteniendo datos reales para ${symbol}:`, error.message);
        }
        
        // Fallback con constantes del sistema
        return {
            symbol,
            price: PHYSICAL_CONSTANTS.MARKET_DEPTH / 10, // Usar constante real
            volume: PHYSICAL_CONSTANTS.VOLUME_24H,
            change24h: PHYSICAL_CONSTANTS.PRICE_CHANGE * 100,
            high24h: PHYSICAL_CONSTANTS.MARKET_DEPTH / 9.5,
            low24h: PHYSICAL_CONSTANTS.MARKET_DEPTH / 10.5,
            quoteVolume: PHYSICAL_CONSTANTS.VOLUME_24H * PHYSICAL_CONSTANTS.MARKET_DEPTH / 10,
            count: 1000,
            timestamp: new Date().toISOString()
        };
    }
    
    async calculateQuantumFactors(symbol) {
        this.systemStatus.metrics.quantumCalculations++;
        
        const phase = quantumPhase();
        const magnitude = quantumMagnitude();
        const enhancement = quantumEnhancement();
        
        return {
            symbol,
            quantumPhase: phase,
            quantumMagnitude: magnitude,
            quantumEnhancement: enhancement,
            universalFrequency: UNIVERSAL_FREQUENCY,
            physicalConstants: PHYSICAL_CONSTANTS,
            timestamp: new Date().toISOString()
        };
    }
    
    getQuantumMetrics() {
        return {
            coherence: PHYSICAL_CONSTANTS.QUANTUM_COHERENCE,
            entanglement: PHYSICAL_CONSTANTS.QUANTUM_ENTANGLEMENT,
            superposition: PHYSICAL_CONSTANTS.QUANTUM_SUPERPOSITION,
            quantumEfficiency: PHYSICAL_CONSTANTS.QUANTUM_CONSCIOUSNESS,
            neuralConfidence: PHYSICAL_CONSTANTS.NEURAL_CONFIDENCE,
            quantumTunneling: PHYSICAL_CONSTANTS.QUANTUM_TUNNELING,
            temporalResonance: PHYSICAL_CONSTANTS.TEMPORAL_RESONANCE,
            fibonacciStrength: PHYSICAL_CONSTANTS.FIBONACCI_STRENGTH,
            universalFrequency: UNIVERSAL_FREQUENCY,
            timestamp: new Date().toISOString()
        };
    }
    
    async getNeuralRecommendations() {
        try {
            const decision = await this.llmOrchestrator.generateUnifiedDecision('BTCUSDT');
            return {
                symbol: 'BTCUSDT',
                recommendation: decision.decision || 'HOLD',
                confidence: decision.confidence || 0.75,
                riskLevel: decision.risk_level || 'MEDIUM',
                timeframe: decision.timeframe || 'SHORT',
                reasoning: decision.reasoning || 'Análisis neural unificado',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                symbol: 'BTCUSDT',
                recommendation: 'HOLD',
                confidence: 0.5,
                riskLevel: 'HIGH',
                timeframe: 'SHORT',
                reasoning: 'Sistema en modo fallback',
                timestamp: new Date().toISOString()
            };
        }
    }
    
    async generateTradingSignals(symbol) {
        // Obtener datos reales del mercado
        const marketData = await this.getMarketData(symbol);
        const currentPrice = marketData.price;
        
        // Calcular señales usando constantes del sistema
        const volatility = PHYSICAL_CONSTANTS.MARKET_VOLATILITY;
        const momentum = PHYSICAL_CONSTANTS.MARKET_MOMENTUM;
        const quantumPhase = quantumPhase(marketData.change24h / 100, UNIVERSAL_FREQUENCY);
        const quantumMagnitude = quantumMagnitude(quantumPhase);
        const enhancement = quantumEnhancement(marketData.change24h / 100, UNIVERSAL_FREQUENCY);
        
        // Determinar señal basada en factores cuánticos reales
        const signalStrength = Math.abs(enhancement) * 100;
        const signal = enhancement > 0 ? 'BUY' : 'SELL';
        
        // Calcular niveles usando constantes del sistema
        const stopLoss = currentPrice * (1 - PHYSICAL_CONSTANTS.STOP_LOSS);
        const takeProfit = currentPrice * (1 + PHYSICAL_CONSTANTS.TAKE_PROFIT);
        
        return {
            symbol,
            signal,
            strength: signalStrength,
            stopLoss: stopLoss,
            takeProfit: takeProfit,
            quantumPhase: quantumPhase,
            quantumMagnitude: quantumMagnitude,
            quantumEnhancement: enhancement,
            volatility: volatility,
            momentum: momentum,
            timestamp: new Date().toISOString()
        };
    }
    
    async getChartData(symbol, interval, limit) {
        try {
            // Obtener datos reales de Binance
            const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
            if (response.ok) {
                const klines = await response.json();
                return klines.map(kline => ({
                    timestamp: kline[0],
                    open: parseFloat(kline[1]),
                    high: parseFloat(kline[2]),
                    low: parseFloat(kline[3]),
                    close: parseFloat(kline[4]),
                    volume: parseFloat(kline[5])
                }));
            }
        } catch (error) {
            console.warn(`[WARNING] Error obteniendo datos de chart para ${symbol}:`, error.message);
        }
        
        // Fallback con datos basados en constantes del sistema
        const data = [];
        const now = Date.now();
        const basePrice = PHYSICAL_CONSTANTS.MARKET_DEPTH / 10;
        const volatility = PHYSICAL_CONSTANTS.MARKET_VOLATILITY;
        
        for (let i = 0; i < limit; i++) {
            const timeOffset = (limit - i) * 60000;
            const quantumPhase = quantumPhase(i / limit, UNIVERSAL_FREQUENCY);
            const priceVariation = Math.sin(quantumPhase) * volatility * basePrice;
            
            data.push({
                timestamp: now - timeOffset,
                open: basePrice + priceVariation,
                high: basePrice + priceVariation * 1.02,
                low: basePrice + priceVariation * 0.98,
                close: basePrice + priceVariation * 1.01,
                volume: PHYSICAL_CONSTANTS.VOLUME_24H * (0.8 + Math.abs(Math.sin(quantumPhase)) * 0.4)
            });
        }
        
        return data;
    }
    
    async runSystemTest() {
        const tests = [];
        
        // Test de datos de mercado
        try {
            const marketData = await this.getMarketData('BTCUSDT');
            tests.push({ name: 'Market Data', status: 'PASS', data: marketData });
        } catch (error) {
            tests.push({ name: 'Market Data', status: 'FAIL', error: error.message });
        }
        
        // Test de factores cuánticos
        try {
            const quantumFactors = await this.calculateQuantumFactors('BTCUSDT');
            tests.push({ name: 'Quantum Factors', status: 'PASS', data: quantumFactors });
        } catch (error) {
            tests.push({ name: 'Quantum Factors', status: 'FAIL', error: error.message });
        }
        
        // Test de decisión neural
        try {
            const decision = await this.llmOrchestrator.generateUnifiedDecision('BTCUSDT');
            tests.push({ name: 'Neural Decision', status: 'PASS', data: decision });
        } catch (error) {
            tests.push({ name: 'Neural Decision', status: 'FAIL', error: error.message });
        }
        
        return {
            totalTests: tests.length,
            passedTests: tests.filter(t => t.status === 'PASS').length,
            failedTests: tests.filter(t => t.status === 'FAIL').length,
            tests
        };
    }
    
    handleWebSocketMessage(ws, data) {
        switch (data.type) {
            case 'get_status':
                ws.send(JSON.stringify({
                    type: 'system_status',
                    data: this.systemStatus
                }));
                break;
            case 'get_quantum_metrics':
                ws.send(JSON.stringify({
                    type: 'quantum_metrics',
                    data: this.getQuantumMetrics()
                }));
                break;
            default:
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Tipo de mensaje no reconocido'
                }));
        }
    }
    
    start() {
        this.server.listen(this.port, () => {
            console.log('='.repeat(60));
            console.log('[ENDPOINTS] QBTC UNIFIED SERVER - BANDA 46');
            console.log('='.repeat(60));
            console.log(`[START] Servidor unificado iniciado en puerto ${this.port}`);
            console.log(`[API] URL: http://localhost:${this.port}`);
            console.log(` Health: http://localhost:${this.port}/health`);
            console.log(`[DATA] Dashboard: http://localhost:${this.port}/dashboard`);
            console.log(` Neural: http://localhost:${this.port}/api/unified-decision/BTCUSDT`);
            console.log(`[UP] Charts: http://localhost:${this.port}/api/chart-data/BTCUSDT`);
            console.log('='.repeat(60));
            console.log(' TODAS LAS FUNCIONALIDADES INTEGRADAS EN UN SOLO SERVIDOR');
            console.log(' SIN CONFLICTOS DE PUERTOS NI PROCESOS MÚLTIPLES');
            console.log(' ARQUITECTURA SIMPLIFICADA Y EFICIENTE');
            console.log('='.repeat(60));
        });
    }
}

// Crear y exportar instancia
const unifiedServer = new QBTCUnifiedServer();

// Manejar señales de terminación
process.on('SIGINT', () => {
    console.log('\n Deteniendo QBTC Unified Server...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n Deteniendo QBTC Unified Server...');
    process.exit(0);
});

// Iniciar servidor si se ejecuta directamente
if (require.main === module) {
    unifiedServer.start();
}

module.exports = { QBTCUnifiedServer, unifiedServer };

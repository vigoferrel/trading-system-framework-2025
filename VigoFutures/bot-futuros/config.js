
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

// Configuración autónoma para Bot de Futuros QBTC
// No depende de otros directorios - Sistema Tandalones

const path = require('path');

class BotFuturosConfig {
    constructor() {
        // Configuración del servidor
        this.server = {
            port: 5501, // Puerto específico para evitar conflictos
            host: 'localhost'
        };

        // Configuración de trading
        this.trading = {
            // Universo ampliado (alta liquidez + rotación)
            pairs: [
                'BTCUSDT','ETHUSDT','BNBUSDT','SOLUSDT','XRPUSDT','DOGEUSDT',
                'ADAUSDT','LTCUSDT','LINKUSDT','OPUSDT','ARBUSDT','AVAXUSDT',
                'DOTUSDT','ATOMUSDT','NEARUSDT','MATICUSDT'
            ],
            leverage: 20,
            marginType: 'ISOLATED',
            stopLossPercent: 2.5,
            takeProfitPercent: 5.0,
            // Caps y sizing
            maxNotionalUSDPerSymbol: 2500, // tope por símbolo
            maxAggregateNotionalUSD: 10000, // tope agregado
            impactToleranceBps: 5, // tolerancia de impacto de precio estimado
            minLiquidityScore: 0.4, // filtro por liquidez
            maxPositionSize: 100,
            minPositionSize: 10
        };

        // Configuración de Binance
        this.binance = {
            apiKey: process.env.BINANCE_API_KEY || 'your-api-key',
            apiSecret: process.env.BINANCE_API_SECRET || 'your-api-secret',
            testnet: process.env.BINANCE_TESTNET === 'true',
            baseURL: process.env.BINANCE_TESTNET === 'true' 
                ? 'https://testnet.binancefuture.com' 
                : 'https://fapi.binance.com',
            wsURL: process.env.BINANCE_TESTNET === 'true'
                ? 'wss://stream.binancefuture.com'
                : 'wss://fstream.binance.com',
            recvWindow: 60000,
            timeout: 5000
        };

        // Configuración cuántica optimizada
        this.quantum = {
            minEdge: 0.0025,
            minConfidence: 0.75,
            maxRiskPerTrade: 0.02,
            riskRewardRatio: 2.5,
            depthWeight: 0.35, // peso de profundidad/imbalances en señal
            volatilityWeight: 0.25,
            momentumWeight: 0.20,
            baselineWeight: 0.20,
            // Parámetros Feynman optimizados
            feynmanComplexOptimization: { real: 9, imaginary: 16 },
            lambdaFrequency: 888,
            logPrimeFactor: Math.log(7919),
            // Parámetros cuánticos
            quantumLeverageMultiplier: 1.618,
            zuritaMultiplier: 7919,
            gravitationalLensingFactor: 1.333,
            temporalAdvantage: 0.001
        };

        // Configuración de logging
        this.logging = {
            level: 'info',
            enableConsole: true,
            enableFile: true,
            logDirectory: path.join(__dirname, 'logs'),
            maxFileSize: '10MB',
            maxFiles: 5
        };

        // Configuración de la base de datos
        this.database = {
            type: 'sqlite',
            path: path.join(__dirname, 'data', 'bot-futuros.db'),
            enableWAL: true
        };

        // Configuración de monitoreo
        this.monitoring = {
            enableMetrics: true,
            metricsInterval: 60000,
            enableHealthCheck: true,
            healthCheckInterval: 30000
        };
    }

    // Métodos para obtener configuraciones específicas
    getServerConfig() {
        return this.server;
    }

    getTradingConfig() {
        return this.trading;
    }

    getBinanceConfig() {
        return this.binance;
    }

    getQuantumConfig() {
        return this.quantum;
    }

    getLoggingConfig() {
        return this.logging;
    }

    getDatabaseConfig() {
        return this.database;
    }

    getMonitoringConfig() {
        return this.monitoring;
    }

    // Método para obtener el puerto del servidor
    getServerPort() {
        return this.server.port;
    }

    // Validar configuración
    validate() {
        const errors = [];

        // Validar configuración del servidor
        if (!this.server.port || this.server.port < 1 || this.server.port > 65535) {
            errors.push('Server port must be between 1 and 65535');
        }

        // Validar configuración de trading
        if (!this.trading.pairs || this.trading.pairs.length === 0) {
            errors.push('At least one trading pair must be specified');
        }

        if (this.trading.leverage < 1 || this.trading.leverage > 125) {
            errors.push('Leverage must be between 1 and 125');
        }

        // Validar configuración de Binance
        if (!this.binance.apiKey || this.binance.apiKey === 'your-api-key') {
            errors.push('Binance API key must be configured');
        }

        if (!this.binance.apiSecret || this.binance.apiSecret === 'your-api-secret') {
            errors.push('Binance API secret must be configured');
        }

        // Validar configuración cuántica
        if (this.quantum.minEdge <= 0) {
            errors.push('Min edge must be greater than 0');
        }

        if (this.quantum.minConfidence <= 0 || this.quantum.minConfidence > 1) {
            errors.push('Min confidence must be between 0 and 1');
        }

        return errors;
    }
}

// Exportar instancia única de configuración
module.exports = new BotFuturosConfig();
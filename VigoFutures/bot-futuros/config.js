
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
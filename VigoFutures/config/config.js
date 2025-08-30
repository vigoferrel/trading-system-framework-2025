
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

const path = require('path');

class Config {
    constructor() {
        this.services = {
            futures: 8002,
            coordinator: 18001,
            quantumCore: 18002,
            feynman: 18021
        };

        this.trading = {
            pairs: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT'],
            leverage: 10,
            marginType: 'ISOLATED',
            stopLossPercent: 2.0,
            takeProfitPercent: 4.0,
            maxPositionSize: 0.1,
            minTradeAmount: 10
        };

        this.binance = {
            apiKey: process.env.BINANCE_API_KEY || '',
            apiSecret: process.env.BINANCE_API_SECRET || '',
            testnet: process.env.BINANCE_TESTNET === 'true' || false,
            baseUrl: process.env.BINANCE_TESTNET === 'true' 
                ? 'https://testnet.binancefuture.com' 
                : 'https://fapi.binance.com',
            wsUrl: process.env.BINANCE_TESTNET === 'true'
                ? 'wss://stream.binancefuture.com'
                : 'wss://fstream.binance.com',
            recvWindow: 5000,
            timeout: 3000
        };

        this.quantum = {
            minEdge: 0.02,
            minConfidence: 0.7,
            riskLevel: 'MEDIUM',
            maxDrawdown: 5.0,
            leverageMultiplier: 1.5
        };
    }

    getServicePort(serviceName) {
        return this.services[serviceName] || 3000;
    }

    getQuantumParams() {
        return this.quantum;
    }

    getBinanceConfig() {
        return this.binance;
    }

    getTradingConfig() {
        return this.trading;
    }
}

module.exports = new Config();
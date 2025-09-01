
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
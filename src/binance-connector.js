#!/usr/bin/env node
/**
 * 🔗 BINANCE CONNECTOR MOCK
 * =========================
 * 
 * Mock del conector de Binance para desarrollo y testing
 * 
 * @author QBTC Systems
 * @version 1.0 - MOCK VERSION
 */

class BinanceConnector {
    constructor(options = {}) {
        this.tradeMode = options.tradeMode || 'spot';
        this.testnet = options.testnet || false;
        this.initialized = false;
        
        this.mockData = {
            prices: {
                'BTCUSDT': 52000,
                'ETHUSDT': 3100,
                'BNBUSDT': 320,
                'SOLUSDT': 98,
                'XRPUSDT': 0.52,
                'DOGEUSDT': 0.08
            },
            volumes: {
                'BTCUSDT': 1250000,
                'ETHUSDT': 850000,
                'BNBUSDT': 120000,
                'SOLUSDT': 95000,
                'XRPUSDT': 750000,
                'DOGEUSDT': 2100000
            }
        };
        
        console.log(`📡 BinanceConnector initialized (${this.tradeMode} mode, testnet: ${this.testnet})`);
        this.initialized = true;
    }
    
    async getPrice(symbol) {
        await this.delay(50); // Simular latencia de red
        return this.mockData.prices[symbol] || 0;
    }
    
    async getVolume(symbol) {
        await this.delay(30);
        return this.mockData.volumes[symbol] || 0;
    }
    
    async get24HrStats(symbol) {
        await this.delay(100);
        const price = this.mockData.prices[symbol] || 0;
        const volume = this.mockData.volumes[symbol] || 0;
        
        return {
            symbol,
            price,
            volume,
            priceChange: price * (Math.random() * 0.1 - 0.05),
            priceChangePercent: (Math.random() * 10 - 5).toFixed(2),
            openPrice: price * (1 + (Math.random() * 0.02 - 0.01)),
            highPrice: price * (1 + Math.random() * 0.03),
            lowPrice: price * (1 - Math.random() * 0.03),
            prevClosePrice: price * (1 + (Math.random() * 0.01 - 0.005))
        };
    }
    
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = BinanceConnector;

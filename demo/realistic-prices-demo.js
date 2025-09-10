#!/usr/bin/env node
/**
 * 🎭 DEMO: REALISTIC PRICES MOCK
 * ============================
 * 
 * Demostración del sistema de simulación de mercado con precios realistas
 * - Precios basados en datos reales de Enero 2025
 * - Volatilidades coherentes con el mercado crypto
 * - Correlaciones entre activos
 * - Eventos especiales simulados
 * - Ciclos de mercado
 */

const { realisticMarketMock } = require('../src/mocks/realistic-market-mock');
const { kernelRNG } = require('../src/utils/kernel-rng');

class RealisticPricesDemo {
    constructor() {
        this.symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT'];
        this.isRunning = false;
    }

    /**
     * 🚀 Iniciar demostración
     */
    async start() {
        console.log('🎭 DEMO: REALISTIC MARKET MOCK');
        console.log('===============================\n');
        
        console.log('📊 Precios iniciales (basados en datos reales):');
        this.displayCurrentPrices();
        
        console.log('\n🔄 Iniciando monitoreo en tiempo real...');
        console.log('Presiona Ctrl+C para detener\n');
        
        this.isRunning = true;
        this.startMonitoring();
        
        // Manejar cierre limpio
        process.on('SIGINT', () => {
            console.log('\n🛑 Deteniendo demostración...');
            this.isRunning = false;
            process.exit(0);
        });
    }

    /**
     * 📈 Mostrar precios actuales
     */
    displayCurrentPrices() {
        this.symbols.forEach(symbol => {
            const ticker = realisticMarketMock.getTicker(symbol);
            const price = parseFloat(ticker.price);
            const change = parseFloat(ticker.priceChangePercent);
            const changeIcon = change >= 0 ? '📈' : '📉';
            const changeColor = change >= 0 ? '\x1b[32m' : '\x1b[31m'; // Verde o rojo
            
            console.log(`${changeIcon} ${symbol.padEnd(10)} $${price.toFixed(this.getPriceDecimals(price))} ${changeColor}(${change >= 0 ? '+' : ''}${change.toFixed(2)}%)\x1b[0m`);
        });
    }

    /**
     * 📊 Mostrar ticker completo
     */
    displayFullTicker(symbol) {
        const ticker = realisticMarketMock.getTicker(symbol);
        
        console.log(`\n📊 ${symbol} - Ticker Completo:`);
        console.log(`   Price: $${parseFloat(ticker.price).toFixed(this.getPriceDecimals(parseFloat(ticker.price)))}`);
        console.log(`   24h Change: ${ticker.priceChangePercent}%`);
        console.log(`   24h High: $${parseFloat(ticker.highPrice).toFixed(this.getPriceDecimals(parseFloat(ticker.highPrice)))}`);
        console.log(`   24h Low: $${parseFloat(ticker.lowPrice).toFixed(this.getPriceDecimals(parseFloat(ticker.lowPrice)))}`);
        console.log(`   24h Volume: ${parseInt(ticker.volume).toLocaleString()}`);
        console.log(`   Quote Volume: $${parseInt(ticker.quoteVolume).toLocaleString()}`);
    }

    /**
     * 📈 Mostrar order book
     */
    displayOrderBook(symbol, limit = 5) {
        const orderBook = realisticMarketMock.getOrderBook(symbol, limit);
        const price = realisticMarketMock.getPrice(symbol);
        
        console.log(`\n📖 ${symbol} - Order Book (Top ${limit}):`);
        console.log('   Asks (Venta):');
        orderBook.asks.slice(0, limit).reverse().forEach((ask, i) => {
            console.log(`   🔴 $${parseFloat(ask[0]).toFixed(this.getPriceDecimals(price))} x ${ask[1]}`);
        });
        
        console.log(`   --- Spread: $${(parseFloat(orderBook.asks[0][0]) - parseFloat(orderBook.bids[0][0])).toFixed(this.getPriceDecimals(price))} ---`);
        
        console.log('   Bids (Compra):');
        orderBook.bids.slice(0, limit).forEach((bid, i) => {
            console.log(`   🟢 $${parseFloat(bid[0]).toFixed(this.getPriceDecimals(price))} x ${bid[1]}`);
        });
    }

    /**
     * 🔄 Iniciar monitoreo en tiempo real
     */
    startMonitoring() {
        let counter = 0;
        
        const monitorInterval = setInterval(() => {
            if (!this.isRunning) {
                clearInterval(monitorInterval);
                return;
            }
            
            counter++;
            
            // Limpiar consola y mostrar header
            console.clear();
            console.log('🎭 REALISTIC MARKET MOCK - LIVE DEMO');
            console.log('====================================');
            
            // Mostrar estado del mercado
            const marketStatus = realisticMarketMock.getMarketStatus();
            console.log(`📊 Market Regime: ${this.getRegimeIcon(marketStatus.regime)} ${marketStatus.regime}`);
            console.log(`🔄 Market Cycle: ${marketStatus.cycle.phase} (${(marketStatus.cycle.strength * 100).toFixed(1)}%)`);
            
            if (marketStatus.specialEvent) {
                console.log(`⚡ Special Event: ${marketStatus.specialEvent.type} (${(marketStatus.specialEvent.intensity * 100).toFixed(1)}% intensity)`);
            }
            
            console.log(`🕒 Update #${counter} - ${new Date().toLocaleTimeString()}\n`);
            
            // Mostrar precios actuales
            this.displayCurrentPrices();
            
            // Cada 10 actualizaciones, mostrar detalles de un símbolo
            if (counter % 10 === 0) {
                const randomSymbol = this.symbols[Math.floor(kernelRNG.nextFloat() * this.symbols.length)];
                this.displayFullTicker(randomSymbol);
            }
            
            // Cada 20 actualizaciones, mostrar order book
            if (counter % 20 === 0) {
                const randomSymbol = this.symbols[Math.floor(kernelRNG.nextFloat() * this.symbols.length)];
                this.displayOrderBook(randomSymbol);
            }
            
        }, 3000); // Actualizar cada 3 segundos
    }

    /**
     * 🎯 Obtener decimales apropiados
     */
    getPriceDecimals(price) {
        if (price >= 1000) return 2;
        if (price >= 10) return 3;
        if (price >= 1) return 4;
        return 6;
    }

    /**
     * 📊 Obtener icono de régimen de mercado
     */
    getRegimeIcon(regime) {
        const icons = {
            'BULL': '🟢',
            'BEAR': '🔴',
            'NORMAL': '🟡',
            'CRISIS': '⚫'
        };
        return icons[regime] || '❓';
    }

    /**
     * 🧪 Ejecutar pruebas de funcionalidad
     */
    async runTests() {
        console.log('🧪 EJECUTANDO PRUEBAS DE FUNCIONALIDAD');
        console.log('======================================\n');
        
        // Test 1: Precios básicos
        console.log('✅ Test 1: Obtener precios básicos');
        this.symbols.forEach(symbol => {
            const price = realisticMarketMock.getPrice(symbol);
            console.log(`   ${symbol}: $${price.toFixed(this.getPriceDecimals(price))}`);
        });
        
        // Test 2: Tickers completos
        console.log('\n✅ Test 2: Tickers completos');
        const btcTicker = realisticMarketMock.getTicker('BTCUSDT');
        console.log(`   BTC 24h Change: ${btcTicker.priceChangePercent}%`);
        console.log(`   BTC 24h Volume: ${parseInt(btcTicker.volume).toLocaleString()}`);
        
        // Test 3: Order Book
        console.log('\n✅ Test 3: Order Book');
        const ethOrderBook = realisticMarketMock.getOrderBook('ETHUSDT', 3);
        console.log(`   ETH Best Bid: $${ethOrderBook.bids[0][0]}`);
        console.log(`   ETH Best Ask: $${ethOrderBook.asks[0][0]}`);
        console.log(`   ETH Spread: $${(parseFloat(ethOrderBook.asks[0][0]) - parseFloat(ethOrderBook.bids[0][0])).toFixed(4)}`);
        
        // Test 4: Estado del mercado
        console.log('\n✅ Test 4: Estado del mercado');
        const marketStatus = realisticMarketMock.getMarketStatus();
        console.log(`   Régimen: ${marketStatus.regime}`);
        console.log(`   Fase del ciclo: ${marketStatus.cycle.phase}`);
        console.log(`   Pares activos: ${marketStatus.activePairs}`);
        
        console.log('\n✅ Todas las pruebas completadas exitosamente!');
    }

    /**
     * 📈 Mostrar estadísticas de volatilidad
     */
    displayVolatilityStats() {
        console.log('\n📊 ESTADÍSTICAS DE VOLATILIDAD');
        console.log('==============================');
        
        this.symbols.forEach(symbol => {
            const ticker = realisticMarketMock.getTicker(symbol);
            const price = parseFloat(ticker.price);
            const high = parseFloat(ticker.highPrice);
            const low = parseFloat(ticker.lowPrice);
            const volatility = ((high - low) / price) * 100;
            
            console.log(`${symbol.padEnd(10)} Volatilidad 24h: ${volatility.toFixed(2)}% (${low.toFixed(2)} - ${high.toFixed(2)})`);
        });
    }
}

// Ejecutar demostración
async function main() {
    const demo = new RealisticPricesDemo();
    
    // Mostrar ayuda si se pasa argumento
    const arg = process.argv[2];
    
    switch (arg) {
        case 'test':
        case 'tests':
            await demo.runTests();
            break;
            
        case 'vol':
        case 'volatility':
            demo.displayVolatilityStats();
            break;
            
        case 'help':
        case '--help':
        case '-h':
            console.log('🎭 REALISTIC PRICES DEMO');
            console.log('========================');
            console.log('');
            console.log('Uso: node realistic-prices-demo.js [comando]');
            console.log('');
            console.log('Comandos:');
            console.log('  (sin argumentos)  - Iniciar demo en tiempo real');
            console.log('  test             - Ejecutar pruebas de funcionalidad');
            console.log('  vol              - Mostrar estadísticas de volatilidad');
            console.log('  help             - Mostrar esta ayuda');
            console.log('');
            break;
            
        default:
            await demo.start();
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = RealisticPricesDemo;

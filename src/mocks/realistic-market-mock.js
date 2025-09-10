/**
 * 🎭 REALISTIC MARKET MOCK
 * ======================
 * 
 * Sistema de simulación de mercado con precios realistas basados en:
 * - Datos históricos reales (precios base actuales)
 * - Patrones de volatilidad coherentes
 * - Correlaciones entre activos
 * - Ciclos de mercado (bull/bear/lateral)
 * - Eventos de alta volatilidad simulados
 * 
 * @author QBTC Systems - Market Simulation Division
 * @version 2.0
 */

const { kernelRNG } = require('../utils/kernel-rng');
const { clampValue } = require('../utils/safe-math');

class RealisticMarketMock {
    constructor() {
        // Precios base realistas (Enero 2025)
        this.basePrices = {
            'BTCUSDT': 97450.00,
            'ETHUSDT': 3384.50,
            'BNBUSDT': 707.20,
            'SOLUSDT': 187.30,
            'XRPUSDT': 2.14,
            'DOGEUSDT': 0.3142,
            'ADAUSDT': 0.8835,
            'AVAXUSDT': 36.42,
            'DOTUSDT': 6.89,
            'LINKUSDT': 20.15,
            'LTCUSDT': 104.80,
            'UNIUSDT': 13.67,
            'ATOMUSDT': 5.85,
            'FILUSDT': 4.92,
            'NEARUSDT': 5.23
        };

        // Volatilidades anualizadas realistas por activo
        this.volatilities = {
            'BTCUSDT': 0.75,    // 75% anualizada
            'ETHUSDT': 0.85,    // 85% anualizada
            'BNBUSDT': 0.90,    // 90% anualizada
            'SOLUSDT': 1.20,    // 120% anualizada
            'XRPUSDT': 1.10,    // 110% anualizada
            'DOGEUSDT': 1.50,   // 150% anualizada
            'ADAUSDT': 1.00,    // 100% anualizada
            'AVAXUSDT': 1.15,   // 115% anualizada
            'DOTUSDT': 0.95,    // 95% anualizada
            'LINKUSDT': 1.05,   // 105% anualizada
            'LTCUSDT': 0.80,    // 80% anualizada
            'UNIUSDT': 1.25,    // 125% anualizada
            'ATOMUSDT': 1.10,   // 110% anualizada
            'FILUSDT': 1.30,    // 130% anualizada
            'NEARUSDT': 1.20    // 120% anualizada
        };

        // Matriz de correlaciones (simplificada)
        this.correlations = {
            'BTCUSDT': { 'ETHUSDT': 0.72, 'BNBUSDT': 0.68, 'SOLUSDT': 0.61 },
            'ETHUSDT': { 'BTCUSDT': 0.72, 'BNBUSDT': 0.75, 'SOLUSDT': 0.69 },
            'BNBUSDT': { 'BTCUSDT': 0.68, 'ETHUSDT': 0.75, 'SOLUSDT': 0.64 },
            'SOLUSDT': { 'BTCUSDT': 0.61, 'ETHUSDT': 0.69, 'BNBUSDT': 0.64 }
        };

        // Estado del mercado simulado
        this.currentPrices = { ...this.basePrices };
        this.priceHistory = new Map();
        this.marketRegime = 'NORMAL'; // BULL, BEAR, NORMAL, CRISIS
        this.marketTrend = 0.0001; // Trend diario (0.01% up)
        this.lastUpdate = Date.now();
        this.updateInterval = 5000; // 5 segundos
        
        // Parámetros del ciclo de mercado
        this.marketCycle = {
            phase: 'ACCUMULATION', // ACCUMULATION, MARKUP, DISTRIBUTION, DECLINE
            strength: 0.5,         // 0-1, fuerza del ciclo
            duration: 0,           // Tiempo en fase actual
            phaseDuration: 86400000 // Duración típica de fase (1 día)
        };

        // Eventos especiales simulados
        this.specialEvents = {
            active: false,
            type: null, // 'FLASH_CRASH', 'PUMP', 'WHALE_MOVE', 'NEWS_EVENT'
            intensity: 0,
            duration: 0,
            maxDuration: 300000 // 5 minutos máximo
        };

        // Inicializar histórico
        this.initializePriceHistory();
        
        // Iniciar simulación
        this.startSimulation();
    }

    /**
     * 🔄 Inicializar histórico de precios
     */
    initializePriceHistory() {
        const now = Date.now();
        
        Object.keys(this.currentPrices).forEach(symbol => {
            const history = [];
            const basePrice = this.basePrices[symbol];
            
            // Generar 100 puntos históricos (últimas ~8 horas)
            for (let i = 100; i >= 0; i--) {
                const timestamp = now - (i * 300000); // Cada 5 minutos
                const randomWalk = this.generateRandomWalk(symbol, i / 100);
                
                history.push({
                    timestamp,
                    price: basePrice * (1 + randomWalk),
                    volume: this.generateRealisticVolume(symbol)
                });
            }
            
            this.priceHistory.set(symbol, history);
        });
    }

    /**
     * 📈 Generar random walk realista
     */
    generateRandomWalk(symbol, timeFactor) {
        const vol = this.volatilities[symbol] || 1.0;
        const dt = 1 / (365 * 24 * 12); // 5 minutos como fracción del año
        
        // Movimiento base (random walk)
        const randomComponent = (kernelRNG.nextFloat() - 0.5) * 2;
        const drift = this.marketTrend * timeFactor;
        const diffusion = Math.sqrt(dt) * vol * randomComponent;
        
        return clampValue(drift + diffusion, -0.1, 0.1); // Max ±10% move
    }

    /**
     * 📊 Generar volumen realista
     */
    generateRealisticVolume(symbol) {
        const baseVolumes = {
            'BTCUSDT': 25000000,    // $25M promedio
            'ETHUSDT': 15000000,    // $15M promedio
            'BNBUSDT': 800000,      // $800K promedio
            'SOLUSDT': 2500000,     // $2.5M promedio
            'XRPUSDT': 1200000,     // $1.2M promedio
            'DOGEUSDT': 800000,     // $800K promedio
            'ADAUSDT': 600000,      // $600K promedio
            'AVAXUSDT': 400000,     // $400K promedio
            'DOTUSDT': 300000,      // $300K promedio
            'LINKUSDT': 500000,     // $500K promedio
            'LTCUSDT': 1000000,     // $1M promedio
            'UNIUSDT': 300000,      // $300K promedio
            'ATOMUSDT': 200000,     // $200K promedio
            'FILUSDT': 150000,      // $150K promedio
            'NEARUSDT': 180000      // $180K promedio
        };

        const baseVol = baseVolumes[symbol] || 100000;
        const volumeMultiplier = 0.5 + kernelRNG.nextFloat() * 1.5; // 0.5x a 2x
        
        return Math.round(baseVol * volumeMultiplier);
    }

    /**
     * 🎯 Obtener precio actual de un símbolo
     */
    getPrice(symbol) {
        const normalizedSymbol = symbol.toUpperCase();
        return this.currentPrices[normalizedSymbol] || this.basePrices['BTCUSDT'] || 50000;
    }

    /**
     * 📊 Obtener datos completos de ticker
     */
    getTicker(symbol) {
        const normalizedSymbol = symbol.toUpperCase();
        const currentPrice = this.getPrice(normalizedSymbol);
        const history = this.priceHistory.get(normalizedSymbol) || [];
        const last24h = history.slice(-288); // Últimas 24h (288 períodos de 5min)
        
        if (last24h.length === 0) {
            return this.generateBasicTicker(normalizedSymbol, currentPrice);
        }

        const openPrice = last24h[0].price;
        const highPrice = Math.max(...last24h.map(h => h.price));
        const lowPrice = Math.min(...last24h.map(h => h.price));
        const volume = last24h.reduce((sum, h) => sum + h.volume, 0);
        const priceChange = currentPrice - openPrice;
        const priceChangePercent = (priceChange / openPrice) * 100;

        return {
            symbol: normalizedSymbol,
            price: currentPrice.toFixed(this.getPriceDecimals(normalizedSymbol)),
            priceChange: priceChange.toFixed(this.getPriceDecimals(normalizedSymbol)),
            priceChangePercent: priceChangePercent.toFixed(2),
            weightedAvgPrice: (last24h.reduce((sum, h, i) => sum + h.price * (i + 1), 0) / 
                              last24h.reduce((sum, _, i) => sum + (i + 1), 0)).toFixed(this.getPriceDecimals(normalizedSymbol)),
            openPrice: openPrice.toFixed(this.getPriceDecimals(normalizedSymbol)),
            highPrice: highPrice.toFixed(this.getPriceDecimals(normalizedSymbol)),
            lowPrice: lowPrice.toFixed(this.getPriceDecimals(normalizedSymbol)),
            volume: Math.round(volume).toString(),
            quoteVolume: Math.round(volume * currentPrice).toString(),
            count: last24h.length,
            timestamp: Date.now()
        };
    }

    /**
     * 🔢 Obtener decimales apropiados por precio
     */
    getPriceDecimals(symbol) {
        const price = this.currentPrices[symbol] || 1;
        if (price >= 1000) return 2;
        if (price >= 10) return 3;
        if (price >= 1) return 4;
        return 6;
    }

    /**
     * 📊 Generar ticker básico para símbolos desconocidos
     */
    generateBasicTicker(symbol, price) {
        const change = (kernelRNG.nextFloat() - 0.5) * price * 0.1; // ±5% max
        
        return {
            symbol,
            price: price.toFixed(this.getPriceDecimals(symbol)),
            priceChange: change.toFixed(this.getPriceDecimals(symbol)),
            priceChangePercent: ((change / price) * 100).toFixed(2),
            weightedAvgPrice: price.toFixed(this.getPriceDecimals(symbol)),
            openPrice: (price - change).toFixed(this.getPriceDecimals(symbol)),
            highPrice: (price + Math.abs(change) * 0.5).toFixed(this.getPriceDecimals(symbol)),
            lowPrice: (price - Math.abs(change) * 0.5).toFixed(this.getPriceDecimals(symbol)),
            volume: this.generateRealisticVolume(symbol).toString(),
            quoteVolume: Math.round(this.generateRealisticVolume(symbol) * price).toString(),
            count: Math.floor(100 + kernelRNG.nextFloat() * 500),
            timestamp: Date.now()
        };
    }

    /**
     * 📈 Obtener book de órdenes simulado
     */
    getOrderBook(symbol, limit = 100) {
        const price = this.getPrice(symbol);
        const spread = price * 0.001; // 0.1% spread típico
        
        const bids = [];
        const asks = [];
        
        // Generar bids (órdenes de compra)
        for (let i = 0; i < limit; i++) {
            const bidPrice = price - spread * (i + 1) / limit;
            const quantity = (kernelRNG.nextFloat() * 10 + 0.1).toFixed(6);
            bids.push([bidPrice.toFixed(this.getPriceDecimals(symbol)), quantity]);
        }
        
        // Generar asks (órdenes de venta)
        for (let i = 0; i < limit; i++) {
            const askPrice = price + spread * (i + 1) / limit;
            const quantity = (kernelRNG.nextFloat() * 10 + 0.1).toFixed(6);
            asks.push([askPrice.toFixed(this.getPriceDecimals(symbol)), quantity]);
        }
        
        return {
            lastUpdateId: Date.now(),
            bids: bids,
            asks: asks
        };
    }

    /**
     * 🔄 Iniciar simulación de mercado
     */
    startSimulation() {
        setInterval(() => {
            this.updateMarketState();
            this.updatePrices();
            this.updateMarketCycle();
            this.checkSpecialEvents();
        }, this.updateInterval);
    }

    /**
     * 📊 Actualizar estado del mercado
     */
    updateMarketState() {
        const now = Date.now();
        const timeDelta = now - this.lastUpdate;
        
        // Actualizar régimen de mercado basado en movimientos recientes
        const btcHistory = this.priceHistory.get('BTCUSDT') || [];
        if (btcHistory.length > 10) {
            const recent = btcHistory.slice(-10);
            const trend = (recent[recent.length - 1].price - recent[0].price) / recent[0].price;
            
            if (trend > 0.02) this.marketRegime = 'BULL';
            else if (trend < -0.02) this.marketRegime = 'BEAR';
            else this.marketRegime = 'NORMAL';
        }
        
        this.lastUpdate = now;
    }

    /**
     * 💰 Actualizar precios de todos los activos
     */
    updatePrices() {
        Object.keys(this.currentPrices).forEach(symbol => {
            const newPrice = this.calculateNewPrice(symbol);
            this.currentPrices[symbol] = newPrice;
            
            // Actualizar historial
            const history = this.priceHistory.get(symbol) || [];
            history.push({
                timestamp: Date.now(),
                price: newPrice,
                volume: this.generateRealisticVolume(symbol)
            });
            
            // Mantener solo las últimas 1000 entradas
            if (history.length > 1000) {
                history.shift();
            }
            
            this.priceHistory.set(symbol, history);
        });
    }

    /**
     * 🧮 Calcular nuevo precio para un símbolo
     */
    calculateNewPrice(symbol) {
        const currentPrice = this.currentPrices[symbol];
        const vol = this.volatilities[symbol] || 1.0;
        const dt = this.updateInterval / (1000 * 60 * 60 * 24 * 365); // Fracción del año
        
        // Componente de correlación (influencia de BTC)
        let correlationImpact = 0;
        if (symbol !== 'BTCUSDT' && this.correlations[symbol]) {
            const btcChange = this.getBTCRecentChange();
            const correlation = this.correlations[symbol]['BTCUSDT'] || 0.5;
            correlationImpact = btcChange * correlation * 0.3; // 30% del impacto correlativo
        }
        
        // Componente de evento especial
        const eventImpact = this.getEventImpact(symbol);
        
        // Componente de ciclo de mercado
        const cycleImpact = this.getCycleImpact();
        
        // Movimiento aleatorio base
        const randomComponent = (kernelRNG.nextFloat() - 0.5) * 2;
        const drift = this.marketTrend + correlationImpact + eventImpact + cycleImpact;
        const diffusion = Math.sqrt(dt) * vol * randomComponent;
        
        const priceChange = currentPrice * (drift + diffusion);
        const newPrice = currentPrice + priceChange;
        
        // Evitar precios negativos o extremos
        return Math.max(newPrice, currentPrice * 0.95); // Max -5% en una actualización
    }

    /**
     * 📈 Obtener cambio reciente de BTC
     */
    getBTCRecentChange() {
        const btcHistory = this.priceHistory.get('BTCUSDT') || [];
        if (btcHistory.length < 2) return 0;
        
        const recent = btcHistory.slice(-2);
        return (recent[1].price - recent[0].price) / recent[0].price;
    }

    /**
     * ⚡ Obtener impacto de eventos especiales
     */
    getEventImpact(symbol) {
        if (!this.specialEvents.active) return 0;
        
        const intensity = this.specialEvents.intensity;
        const eventTypes = {
            'FLASH_CRASH': -0.001 * intensity,
            'PUMP': 0.002 * intensity,
            'WHALE_MOVE': (kernelRNG.nextFloat() - 0.5) * 0.003 * intensity,
            'NEWS_EVENT': (kernelRNG.nextFloat() - 0.3) * 0.002 * intensity
        };
        
        return eventTypes[this.specialEvents.type] || 0;
    }

    /**
     * 🔄 Obtener impacto del ciclo de mercado
     */
    getCycleImpact() {
        const phaseImpacts = {
            'ACCUMULATION': 0.0001,  // Leve tendencia alcista
            'MARKUP': 0.0005,        // Tendencia alcista fuerte
            'DISTRIBUTION': -0.0001, // Leve tendencia bajista
            'DECLINE': -0.0003       // Tendencia bajista
        };
        
        return (phaseImpacts[this.marketCycle.phase] || 0) * this.marketCycle.strength;
    }

    /**
     * 🔄 Actualizar ciclo de mercado
     */
    updateMarketCycle() {
        this.marketCycle.duration += this.updateInterval;
        
        // Cambiar fase si es necesario
        if (this.marketCycle.duration > this.marketCycle.phaseDuration) {
            const phases = ['ACCUMULATION', 'MARKUP', 'DISTRIBUTION', 'DECLINE'];
            const currentIndex = phases.indexOf(this.marketCycle.phase);
            this.marketCycle.phase = phases[(currentIndex + 1) % phases.length];
            this.marketCycle.duration = 0;
            this.marketCycle.strength = 0.3 + kernelRNG.nextFloat() * 0.7; // 0.3-1.0
            
            console.log(`🔄 Ciclo de mercado cambió a: ${this.marketCycle.phase} (Fuerza: ${this.marketCycle.strength.toFixed(2)})`);
        }
    }

    /**
     * ⚡ Verificar y activar eventos especiales
     */
    checkSpecialEvents() {
        if (this.specialEvents.active) {
            this.specialEvents.duration += this.updateInterval;
            this.specialEvents.intensity *= 0.98; // Decay del evento
            
            // Terminar evento si es muy débil o ha durado mucho
            if (this.specialEvents.intensity < 0.1 || this.specialEvents.duration > this.specialEvents.maxDuration) {
                this.specialEvents.active = false;
                this.specialEvents.type = null;
                console.log('⚡ Evento especial terminado');
            }
        } else {
            // Probabilidad de evento especial: 0.1% cada actualización
            if (kernelRNG.nextFloat() < 0.001) {
                const eventTypes = ['FLASH_CRASH', 'PUMP', 'WHALE_MOVE', 'NEWS_EVENT'];
                this.specialEvents.active = true;
                this.specialEvents.type = eventTypes[Math.floor(kernelRNG.nextFloat() * eventTypes.length)];
                this.specialEvents.intensity = 0.5 + kernelRNG.nextFloat() * 0.5; // 0.5-1.0
                this.specialEvents.duration = 0;
                
                console.log(`⚡ Evento especial activado: ${this.specialEvents.type} (Intensidad: ${this.specialEvents.intensity.toFixed(2)})`);
            }
        }
    }

    /**
     * 📊 Obtener estado completo del mercado simulado
     */
    getMarketStatus() {
        return {
            regime: this.marketRegime,
            cycle: this.marketCycle,
            specialEvent: this.specialEvents.active ? {
                type: this.specialEvents.type,
                intensity: this.specialEvents.intensity,
                remaining: Math.max(0, this.specialEvents.maxDuration - this.specialEvents.duration)
            } : null,
            activePairs: Object.keys(this.currentPrices).length,
            lastUpdate: this.lastUpdate,
            updateInterval: this.updateInterval
        };
    }
}

// Singleton instance
const realisticMarketMock = new RealisticMarketMock();

module.exports = {
    RealisticMarketMock,
    realisticMarketMock
};

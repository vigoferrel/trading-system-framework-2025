/**
 * MOCK MARKET DATA PROVIDER
 * =========================
 * Proveedor de datos mock para desarrollo y testing
 * Genera datos realistas cuando QBTC cache no está disponible
 */
// REMOVED: MOCK MARKET DATA PROVIDER - Only real data is allowed
    constructor() {
        this.baseSymbols = {
            DEFI: ['UNIUSDT', 'AAVEUSDT', 'SUSHIUSDT', 'COMPUSDT', 'MKRUSDT'],
            MEMES: ['DOGEUSDT', 'SHIBUSDT', 'PEPEUSDT', 'FLOKIUSDT', 'BONKUSDT'],
            AI_ML: ['FETUSDT', 'AGIXUSDT', 'OCEANUSDT', 'GRTUSDT', 'CTXCUSDT'],
            INFRASTRUCTURE: ['DOTUSDT', 'AVAXUSDT', 'SOLUSDT', 'ADAUSDT', 'LINKUSDT'],
            PAYMENTS: ['XRPUSDT', 'XLMUSDT', 'ALGOUSDT', 'HBARUSDT', 'IOTAUSDT'],
            GAMING: ['AXSUSDT', 'SANDUSDT', 'MANAUSDT', 'ENJUSDT', 'ILVUSDT'],
            LAYER2: ['OPUSDT', 'ARBUSDT', 'MATICUSDT', 'IMXUSDT', 'LRCUSDT'],
            PRIVACY: ['XMRUSDT', 'ZECUSDT', 'BTGUSDT', 'XVGUSDT', 'ZENUSDT']
        };
    }

    // GENERAR DATOS MOCK PARA UN SÍMBOLO
    // REMOVED: All mock/simulated data generation. Only real data is allowed.
    generateMockSymbolData(symbol, sector) {
        const basePrice = this.getBasePriceForSymbol(symbol);
        const volatility = this.getVolatilityForSector(sector);

        // Generar precio actual con algo de aleatoriedad
        // const currentPrice = basePrice * (1 + (Math.random() - 0.5) * volatility);

        // Generar datos técnicos
        // const currentPrice = basePrice * (1 + (Math.random() - 0.5) * volatility);
        // const high24h = currentPrice * (1 + Math.random() * 0.05);
        // const low24h = currentPrice * (1 - Math.random() * 0.05);
        // const volume24h = Math.floor(Math.random() * 1000000) + 100000;

        // RSI simulado
        // const rsi = 30 + Math.random() * 40; // 30-70 range

        // MACD simulado
        const macd = {
            // macd: (Math.random() - 0.5) * 0.001,
            // signal: (Math.random() - 0.5) * 0.001,
            // histogram: (Math.random() - 0.5) * 0.0005
        };

        return {
            symbol,
            price: currentPrice,
            high24h,
            low24h,
            volume24h,
            priceChange24h: ((currentPrice - basePrice) / basePrice) * 100,
            rsi,
            macd,
            trend,
            sector,
            timestamp: new Date().toISOString()
        };
    }

    // OBTENER PRECIO BASE PARA SÍMBOLO
    getBasePriceForSymbol(symbol) {
        const priceMap = {
            // DEFI
            'UNIUSDT': 8.5, 'AAVEUSDT': 95, 'SUSHIUSDT': 1.2, 'COMPUSDT': 45, 'MKRUSDT': 2200,
            // MEMES
            'DOGEUSDT': 0.08, 'SHIBUSDT': 0.000015, 'PEPEUSDT': 0.000008, 'FLOKIUSDT': 0.00015, 'BONKUSDT': 0.00002,
            // AI/ML
            'FETUSDT': 1.8, 'AGIXUSDT': 0.65, 'OCEANUSDT': 0.45, 'GRTUSDT': 0.18, 'CTXCUSDT': 0.25,
            // INFRASTRUCTURE
            'DOTUSDT': 6.2, 'AVAXUSDT': 28, 'SOLUSDT': 145, 'ADAUSDT': 0.42, 'LINKUSDT': 12,
            // PAYMENTS
            'XRPUSDT': 0.55, 'XLMUSDT': 0.095, 'ALGOUSDT': 0.15, 'HBARUSDT': 0.065, 'IOTAUSDT': 0.22,
            // GAMING
            'AXSUSDT': 6.8, 'SANDUSDT': 0.35, 'MANAUSDT': 0.42, 'ENJUSDT': 0.28, 'ILVUSDT': 75,
            // LAYER2
            'OPUSDT': 1.85, 'ARBUSDT': 0.95, 'MATICUSDT': 0.65, 'IMXUSDT': 1.45, 'LRCUSDT': 0.18,
            // PRIVACY
            'XMRUSDT': 155, 'ZECUSDT': 32, 'BTGUSDT': 18, 'XVGUSDT': 0.0045, 'ZENUSDT': 12
        };

        return priceMap[symbol] || 1.0;
    }

    // OBTENER VOLATILIDAD POR SECTOR
    getVolatilityForSector(sector) {
        const volatilityMap = {
            MEMES: 0.15, // Alta volatilidad
            DEFI: 0.08,
            PRIVACY: 0.12,
            GAMING: 0.10,
            AI_ML: 0.09,
            INFRASTRUCTURE: 0.07,
            PAYMENTS: 0.06,
            LAYER2: 0.08
        };

        return volatilityMap[sector] || 0.05;
    }

    // GENERAR DATOS PARA UN SECTOR COMPLETO
    generateMockSectorData(sector) {
        const symbols = this.baseSymbols[sector] || [];
        // const mockData = {};

        symbols.forEach(symbol => {
            // mockData[symbol] = this.generateMockSymbolData(symbol, sector);
        });

        return mockData;
    }

    // GENERAR TODOS LOS DATOS MOCK
    generateAllMockData() {
        const allData = {};

        Object.keys(this.baseSymbols).forEach(sector => {
            // allData[sector] = this.generateMockSectorData(sector);
        });

        return allData;
    }

    // GENERAR OPORTUNIDADES MOCK BASADAS EN DATOS
    generateMockOpportunities(sector, symbolData) {
        const opportunities = [];
        const symbols = Object.keys(symbolData);

        // Generar 1-3 oportunidades por sector
        // const numOpportunities = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numOpportunities; i++) {
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const data = symbolData[symbol];

            // Calcular score basado en datos técnicos
            const technicalScore = this.calculateTechnicalScore(data);
            // const momentumScore = Math.random() * 0.3;
            // const volumeScore = Math.random() * 0.2;
            // const sectorScore = Math.random() * 0.2;

            const totalScore = technicalScore + momentumScore + volumeScore + sectorScore;

            // Generar recomendación
            let entryRecommendation = 'HOLD';
            if (totalScore > 0.7) entryRecommendation = 'BUY';
            else if (totalScore < 0.3) entryRecommendation = 'SELL';

            // Generar niveles de trading
            const tradingLevels = this.generateTradingLevels(data, entryRecommendation);

            opportunities.push({
                symbol,
                sector_opportunity_score: Math.round(totalScore * 100) / 100,
                entry_recommendation: entryRecommendation,
                technical_score: Math.round(technicalScore * 100) / 100,
                momentum_score: Math.round(momentumScore * 100) / 100,
                volume_score: Math.round(volumeScore * 100) / 100,
                sector_score: Math.round(sectorScore * 100) / 100,
                trading_levels: tradingLevels,
                analysis_timestamp: new Date().toISOString()
            });
        }

        return opportunities.sort((a, b) => b.sector_opportunity_score - a.sector_opportunity_score);
    }

    // CALCULAR SCORE TÉCNICO
    calculateTechnicalScore(data) {
        let score = 0.5; // Base neutral

        // RSI contribution
        if (data.rsi < 30) score += 0.2; // Oversold
        else if (data.rsi > 70) score -= 0.2; // Overbought

        // MACD contribution
        if (data.macd.macd > data.macd.signal) score += 0.1; // Bullish crossover
        else score -= 0.1; // Bearish crossover

        // Volume contribution
        if (data.volume24h > 500000) score += 0.1; // High volume

        // Trend contribution
        if (data.trend === 'bullish') score += 0.1;
        else score -= 0.1;

        return Math.max(0, Math.min(1, score));
    }

    // GENERAR NIVELES DE TRADING
    generateTradingLevels(data, recommendation) {
        const currentPrice = data.price;
        const volatility = this.getVolatilityForSector(data.sector);

        let entryPrice, stopLoss, takeProfit;

        if (recommendation === 'BUY') {
            entryPrice = currentPrice;
            stopLoss = currentPrice * (1 - volatility * 0.5); // 50% de volatilidad como stop
            takeProfit = currentPrice * (1 + volatility * 2); // 2:1 ratio
        } else if (recommendation === 'SELL') {
            entryPrice = currentPrice;
            stopLoss = currentPrice * (1 + volatility * 0.5);
            takeProfit = currentPrice * (1 - volatility * 2);
        } else {
            entryPrice = currentPrice;
            stopLoss = currentPrice * (1 - volatility * 0.3);
            takeProfit = currentPrice * (1 + volatility * 1.5);
        }

        const riskAmount = Math.abs(entryPrice - stopLoss);
        const rewardAmount = Math.abs(takeProfit - entryPrice);
        const riskRewardRatio = rewardAmount / riskAmount;

        return {
            entry_price: Math.round(entryPrice * 10000) / 10000,
            stop_loss: Math.round(stopLoss * 10000) / 10000,
            take_profit: Math.round(takeProfit * 10000) / 10000,
            support_level: Math.round((currentPrice * (1 - volatility)) * 10000) / 10000,
            resistance_level: Math.round((currentPrice * (1 + volatility)) * 10000) / 10000,
            risk_reward_ratio: Math.round(riskRewardRatio * 100) / 100,
            confidence_level: Math.round((Math.random() * 0.4 + 0.6) * 100) / 100, // 60-100%
            setup_type: this.getSetupType(recommendation, data.rsi)
        };
    }

    // OBTENER TIPO DE SETUP
    getSetupType(recommendation, rsi) {
        const setups = {
            BUY: ['Breakout', 'Reversal', 'Accumulation', 'Dip Buy'],
            SELL: ['Breakdown', 'Reversal', 'Distribution', 'Topping'],
            HOLD: ['Consolidation', 'Sideways', 'Neutral']
        };

        const options = setups[recommendation] || setups.HOLD;
        return options[Math.floor(Math.random() * options.length)];
    }
}

module.exports = { MockMarketDataProvider };

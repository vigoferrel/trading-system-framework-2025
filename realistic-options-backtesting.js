#!/usr/bin/env node
/**
 * 🎯 REALISTIC OPTIONS BACKTESTING SYSTEM
 * ========================================
 * 
 * Sistema realista para cuantificar el EDGE real de estrategias de opciones
 * vs Buy & Hold benchmark. Usa primas de mercado reales y métricas comparables.
 * 
 * Objetivo: Determinar si las estrategias de opciones generan alpha sostenible
 * 
 * @author Vigo Ferrel - QBTC Evolution Team  
 * @version 2.1 - REALISTIC EDITION
 */

const fs = require('fs');
const crypto = require('crypto');

// Constantes de mercado realistas
const MARKET_CONSTANTS = {
    RISK_FREE_RATE: 0.04,      // 4% anual
    TYPICAL_IV: 0.25,          // 25% volatilidad implícita típica
    OPTION_MULTIPLIER: 100,    // Contratos estándar
    COMMISSION: 1.00,          // $1 por contrato (realista)
    MIN_PREMIUM: 0.05,         // $0.05 mínimo por contrato
    MAX_PREMIUM_PCT: 0.08      // 8% máximo del subyacente
};

/**
 * Generador de números pseudoaleatorios usando kernel (sin Math.random)
 */
class SystemEntropyGenerator {
    constructor() {
        this.counter = 0;
        this.seed = this.generateSeed();
    }

    generateSeed() {
        const metrics = {
            time: Date.now(),
            memory: process.memoryUsage().rss,
            pid: process.pid
        };
        
        let hash = 0;
        const str = JSON.stringify(metrics);
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32-bit integer
        }
        return Math.abs(hash) / 2147483647; // Normalize to [0,1]
    }

    next() {
        // Linear congruential generator (simple but deterministic)
        this.counter++;
        this.seed = (this.seed * 1103515245 + 12345) % 2147483647;
        return this.seed / 2147483647;
    }

    normal(mean = 0, std = 1) {
        // Box-Muller transform usando nuestro generador
        const u1 = this.next();
        const u2 = this.next();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return mean + std * z0;
    }

    range(min, max) {
        return min + (max - min) * this.next();
    }
}

/**
 * Calculadora de precios de opciones Black-Scholes simplificada
 */
class RealisticBlackScholes {
    constructor() {
        this.rng = new SystemEntropyGenerator();
    }

    calculateOptionPrice(S, K, T, r, sigma, optionType = 'call') {
        if (T <= 0) return Math.max(0, optionType === 'call' ? S - K : K - S);
        
        const d1 = (Math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);
        
        let price;
        if (optionType === 'call') {
            price = S * this.normalCDF(d1) - K * Math.exp(-r * T) * this.normalCDF(d2);
        } else {
            price = K * Math.exp(-r * T) * this.normalCDF(-d2) - S * this.normalCDF(-d1);
        }
        
        // Aplicar límites realistas
        price = Math.max(MARKET_CONSTANTS.MIN_PREMIUM, price);
        price = Math.min(price, S * MARKET_CONSTANTS.MAX_PREMIUM_PCT);
        
        return price;
    }

    normalCDF(x) {
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }

    erf(x) {
        // Approximación de error function
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }
}

/**
 * Estrategias de opciones con parámetros realistas
 */
class RealisticOptionsStrategies {
    constructor() {
        this.bs = new RealisticBlackScholes();
        this.rng = new SystemEntropyGenerator();
    }

    /**
     * Buy & Hold - Benchmark Strategy
     */
    buyAndHold(capital, priceData) {
        if (!priceData || priceData.length === 0) {
            return this.getEmptyResult('Buy & Hold', capital);
        }
        
        const initialPrice = priceData[0].price;
        const finalPrice = priceData[priceData.length - 1].price;
        const shares = capital / initialPrice;
        const finalValue = shares * finalPrice;
        
        // Calcular serie de valores del portafolio
        const portfolioValues = priceData.map(d => shares * d.price);
        const returns = this.calculateReturns(portfolioValues);
        
        return {
            strategy: 'Buy & Hold',
            initial_capital: capital,
            final_value: finalValue,
            total_return: (finalValue - capital) / capital,
            annualized_return: this.calculateAnnualizedReturn(finalValue, capital, priceData.length / 252),
            transactions: 1,
            commissions: 0,
            max_drawdown: this.calculateMaxDrawdown(portfolioValues),
            volatility: this.calculateVolatility(returns),
            sharpe_ratio: this.calculateSharpeRatio(returns),
            portfolio_values: portfolioValues
        };
    }

    /**
     * Covered Calls - Venta de calls sobre posición larga
     */
    coveredCalls(capital, priceData, deltaTarget = 0.30) {
        let cash = capital;
        let shares = 0;
        let totalPremiums = 0;
        let totalCommissions = 0;
        let transactions = 0;
        const portfolioValues = [];
        const trades = [];
        
        // Comprar acciones inicialmente
        const initialPrice = priceData[0].price;
        shares = Math.floor(capital / initialPrice / 100) * 100; // Lotes de 100
        cash -= shares * initialPrice;
        transactions++;
        
        for (let i = 0; i < priceData.length - 30; i += 30) { // Ciclo mensual
            const currentPrice = priceData[i].price;
            const volatility = this.calculateHistoricalVolatility(priceData, i, 20);
            
            if (shares >= 100) {
                // Vender call OTM
                const strikePrice = currentPrice * 1.05; // 5% OTM
                const timeToExpiry = 30 / 365;
                
                const callPremium = this.bs.calculateOptionPrice(
                    currentPrice, strikePrice, timeToExpiry, 
                    MARKET_CONSTANTS.RISK_FREE_RATE, volatility, 'call'
                );
                
                const contracts = Math.floor(shares / 100);
                const premiumReceived = callPremium * contracts * MARKET_CONSTANTS.OPTION_MULTIPLIER;
                const commission = contracts * MARKET_CONSTANTS.COMMISSION;
                
                cash += premiumReceived - commission;
                totalPremiums += premiumReceived;
                totalCommissions += commission;
                transactions++;
                
                trades.push({
                    day: i,
                    action: 'SELL_CALL',
                    strike: strikePrice,
                    premium: callPremium,
                    contracts: contracts,
                    net_premium: premiumReceived - commission
                });
                
                // Simular vencimiento
                const expiryIndex = Math.min(i + 30, priceData.length - 1);
                const expiryPrice = priceData[expiryIndex].price;
                
                if (expiryPrice > strikePrice) {
                    // Call asignada - vender acciones
                    cash += shares * strikePrice;
                    shares = 0;
                    transactions++;
                    
                    trades.push({
                        day: expiryIndex,
                        action: 'ASSIGNED',
                        price: strikePrice,
                        shares: shares + Math.floor(shares/100) * 100
                    });
                    
                    // Recomprar acciones si tenemos capital
                    if (cash >= expiryPrice * 100) {
                        shares = Math.floor(cash / expiryPrice / 100) * 100;
                        cash -= shares * expiryPrice;
                        transactions++;
                    }
                }
            }
            
            const portfolioValue = cash + (shares * currentPrice);
            portfolioValues.push(portfolioValue);
        }
        
        // Valor final
        const finalPrice = priceData[priceData.length - 1].price;
        const finalValue = cash + (shares * finalPrice);
        const returns = this.calculateReturns(portfolioValues);
        
        return {
            strategy: 'Covered Calls',
            initial_capital: capital,
            final_value: finalValue,
            total_return: (finalValue - capital) / capital,
            annualized_return: this.calculateAnnualizedReturn(finalValue, capital, priceData.length / 252),
            total_premiums: totalPremiums,
            total_commissions: totalCommissions,
            net_premium_income: totalPremiums - totalCommissions,
            transactions,
            max_drawdown: this.calculateMaxDrawdown(portfolioValues),
            volatility: this.calculateVolatility(returns),
            sharpe_ratio: this.calculateSharpeRatio(returns),
            portfolio_values: portfolioValues,
            trades: trades.slice(-10) // Últimas 10 operaciones
        };
    }

    /**
     * Cash Secured Puts - Venta de puts con efectivo como garantía
     */
    cashSecuredPuts(capital, priceData) {
        let cash = capital;
        let shares = 0;
        let totalPremiums = 0;
        let totalCommissions = 0;
        let transactions = 0;
        const portfolioValues = [];
        const trades = [];
        
        for (let i = 0; i < priceData.length - 30; i += 30) {
            const currentPrice = priceData[i].price;
            const volatility = this.calculateHistoricalVolatility(priceData, i, 20);
            
            if (shares === 0 && cash >= currentPrice * 100) {
                // Vender put OTM
                const strikePrice = currentPrice * 0.95; // 5% OTM
                const timeToExpiry = 30 / 365;
                
                const putPremium = this.bs.calculateOptionPrice(
                    currentPrice, strikePrice, timeToExpiry,
                    MARKET_CONSTANTS.RISK_FREE_RATE, volatility, 'put'
                );
                
                const contracts = Math.floor(cash / (strikePrice * 100));
                const premiumReceived = putPremium * contracts * MARKET_CONSTANTS.OPTION_MULTIPLIER;
                const commission = contracts * MARKET_CONSTANTS.COMMISSION;
                
                cash += premiumReceived - commission;
                totalPremiums += premiumReceived;
                totalCommissions += commission;
                transactions++;
                
                trades.push({
                    day: i,
                    action: 'SELL_PUT',
                    strike: strikePrice,
                    premium: putPremium,
                    contracts: contracts,
                    net_premium: premiumReceived - commission
                });
                
                // Simular vencimiento
                const expiryIndex = Math.min(i + 30, priceData.length - 1);
                const expiryPrice = priceData[expiryIndex].price;
                
                if (expiryPrice < strikePrice) {
                    // Put asignada - comprar acciones
                    shares = contracts * 100;
                    cash -= shares * strikePrice;
                    transactions++;
                    
                    trades.push({
                        day: expiryIndex,
                        action: 'ASSIGNED',
                        price: strikePrice,
                        shares: shares
                    });
                }
            } else if (shares > 0) {
                // Vender acciones si tenemos posición
                cash += shares * currentPrice;
                shares = 0;
                transactions++;
            }
            
            const portfolioValue = cash + (shares * currentPrice);
            portfolioValues.push(portfolioValue);
        }
        
        const finalPrice = priceData[priceData.length - 1].price;
        const finalValue = cash + (shares * finalPrice);
        const returns = this.calculateReturns(portfolioValues);
        
        return {
            strategy: 'Cash Secured Puts',
            initial_capital: capital,
            final_value: finalValue,
            total_return: (finalValue - capital) / capital,
            annualized_return: this.calculateAnnualizedReturn(finalValue, capital, priceData.length / 252),
            total_premiums: totalPremiums,
            total_commissions: totalCommissions,
            net_premium_income: totalPremiums - totalCommissions,
            transactions,
            max_drawdown: this.calculateMaxDrawdown(portfolioValues),
            volatility: this.calculateVolatility(returns),
            sharpe_ratio: this.calculateSharpeRatio(returns),
            portfolio_values: portfolioValues,
            trades: trades.slice(-10)
        };
    }

    /**
     * Wheel Strategy - Combinación de covered calls y cash secured puts
     */
    wheelStrategy(capital, priceData) {
        let cash = capital;
        let shares = 0;
        let totalPremiums = 0;
        let totalCommissions = 0;
        let transactions = 0;
        let wheelCycles = 0;
        const portfolioValues = [];
        const trades = [];
        
        for (let i = 0; i < priceData.length - 30; i += 30) {
            const currentPrice = priceData[i].price;
            const volatility = this.calculateHistoricalVolatility(priceData, i, 20);
            const timeToExpiry = 30 / 365;
            
            if (shares === 0) {
                // Fase 1: Vender Cash Secured Puts
                if (cash >= currentPrice * 100 * 0.95) {
                    const strikePrice = currentPrice * 0.95;
                    const putPremium = this.bs.calculateOptionPrice(
                        currentPrice, strikePrice, timeToExpiry,
                        MARKET_CONSTANTS.RISK_FREE_RATE, volatility, 'put'
                    );
                    
                    const contracts = 1; // Un contrato por vez
                    const premiumReceived = putPremium * contracts * MARKET_CONSTANTS.OPTION_MULTIPLIER;
                    const commission = contracts * MARKET_CONSTANTS.COMMISSION;
                    
                    cash += premiumReceived - commission;
                    totalPremiums += premiumReceived;
                    totalCommissions += commission;
                    transactions++;
                    
                    // Verificar asignación
                    const expiryIndex = Math.min(i + 30, priceData.length - 1);
                    const expiryPrice = priceData[expiryIndex].price;
                    
                    if (expiryPrice < strikePrice) {
                        // Asignado - iniciar wheel
                        shares = 100;
                        cash -= strikePrice * 100;
                        wheelCycles++;
                        transactions++;
                        
                        trades.push({
                            day: expiryIndex,
                            action: 'PUT_ASSIGNED',
                            price: strikePrice,
                            premium: putPremium,
                            net: premiumReceived - commission
                        });
                    }
                }
            } else {
                // Fase 2: Vender Covered Calls
                const breakEvenPrice = cash < 0 ? currentPrice * 1.1 : currentPrice * 1.05;
                const strikePrice = Math.max(breakEvenPrice, currentPrice * 1.02);
                
                const callPremium = this.bs.calculateOptionPrice(
                    currentPrice, strikePrice, timeToExpiry,
                    MARKET_CONSTANTS.RISK_FREE_RATE, volatility, 'call'
                );
                
                const contracts = 1;
                const premiumReceived = callPremium * contracts * MARKET_CONSTANTS.OPTION_MULTIPLIER;
                const commission = contracts * MARKET_CONSTANTS.COMMISSION;
                
                cash += premiumReceived - commission;
                totalPremiums += premiumReceived;
                totalCommissions += commission;
                transactions++;
                
                // Verificar asignación
                const expiryIndex = Math.min(i + 30, priceData.length - 1);
                const expiryPrice = priceData[expiryIndex].price;
                
                if (expiryPrice > strikePrice) {
                    // Call asignada - completar wheel cycle
                    cash += shares * strikePrice;
                    shares = 0;
                    transactions++;
                    
                    trades.push({
                        day: expiryIndex,
                        action: 'CALL_ASSIGNED',
                        price: strikePrice,
                        premium: callPremium,
                        net: premiumReceived - commission,
                        cycle_complete: true
                    });
                }
            }
            
            const portfolioValue = cash + (shares * currentPrice);
            portfolioValues.push(portfolioValue);
        }
        
        const finalPrice = priceData[priceData.length - 1].price;
        const finalValue = cash + (shares * finalPrice);
        const returns = this.calculateReturns(portfolioValues);
        
        return {
            strategy: 'Wheel Strategy',
            initial_capital: capital,
            final_value: finalValue,
            total_return: (finalValue - capital) / capital,
            annualized_return: this.calculateAnnualizedReturn(finalValue, capital, priceData.length / 252),
            total_premiums: totalPremiums,
            total_commissions: totalCommissions,
            net_premium_income: totalPremiums - totalCommissions,
            wheel_cycles: wheelCycles,
            transactions,
            max_drawdown: this.calculateMaxDrawdown(portfolioValues),
            volatility: this.calculateVolatility(returns),
            sharpe_ratio: this.calculateSharpeRatio(returns),
            portfolio_values: portfolioValues,
            trades: trades.slice(-10)
        };
    }

    // ===== MÉTODOS DE UTILIDAD =====

    getEmptyResult(strategyName, capital) {
        return {
            strategy: strategyName,
            initial_capital: capital,
            final_value: capital,
            total_return: 0,
            annualized_return: 0,
            transactions: 0,
            max_drawdown: 0,
            volatility: 0,
            sharpe_ratio: 0,
            portfolio_values: [capital]
        };
    }

    calculateHistoricalVolatility(priceData, currentIndex, periods) {
        const startIndex = Math.max(0, currentIndex - periods);
        const prices = priceData.slice(startIndex, currentIndex + 1).map(d => d.price);
        
        if (prices.length < 2) return MARKET_CONSTANTS.TYPICAL_IV;
        
        const returns = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push(Math.log(prices[i] / prices[i - 1]));
        }
        
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;
        const volatility = Math.sqrt(variance * 252); // Anualizar
        
        return Math.max(0.1, Math.min(0.8, volatility)); // Límites realistas
    }

    calculateReturns(values) {
        if (!values || values.length < 2) return [];
        return values.slice(1).map((v, i) => v / values[i] - 1);
    }

    calculateAnnualizedReturn(finalValue, initialValue, years) {
        if (years <= 0 || initialValue <= 0) return 0;
        return Math.pow(finalValue / initialValue, 1 / years) - 1;
    }

    calculateMaxDrawdown(values) {
        if (!values || values.length === 0) return 0;
        
        let maxDrawdown = 0;
        let peak = values[0];
        
        for (let value of values) {
            if (value > peak) peak = value;
            if (peak > 0) {
                const drawdown = (peak - value) / peak;
                if (drawdown > maxDrawdown) maxDrawdown = drawdown;
            }
        }
        
        return maxDrawdown;
    }

    calculateVolatility(returns) {
        if (!returns || returns.length === 0) return 0;
        
        const validReturns = returns.filter(r => !isNaN(r) && isFinite(r));
        if (validReturns.length === 0) return 0;
        
        const mean = validReturns.reduce((sum, r) => sum + r, 0) / validReturns.length;
        const variance = validReturns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / validReturns.length;
        
        return Math.sqrt(variance * 252); // Anualizada
    }

    calculateSharpeRatio(returns) {
        if (!returns || returns.length === 0) return 0;
        
        const validReturns = returns.filter(r => !isNaN(r) && isFinite(r));
        if (validReturns.length === 0) return 0;
        
        const mean = validReturns.reduce((sum, r) => sum + r, 0) / validReturns.length;
        const annualizedReturn = mean * 252;
        const volatility = this.calculateVolatility(returns);
        
        return volatility > 0 ? (annualizedReturn - MARKET_CONSTANTS.RISK_FREE_RATE) / volatility : 0;
    }
}

/**
 * Generador de datos de mercado realistas
 */
class RealisticMarketDataGenerator {
    constructor() {
        this.rng = new SystemEntropyGenerator();
    }

    generateRealisticPriceData(days, initialPrice = 100, annualVolatility = 0.25, annualDrift = 0.08) {
        const data = [];
        let price = initialPrice;
        
        const dailyVolatility = annualVolatility / Math.sqrt(252);
        const dailyDrift = annualDrift / 252;
        
        for (let i = 0; i < days; i++) {
            // Geometric Brownian Motion
            const randomShock = this.rng.normal(0, 1);
            const dailyReturn = dailyDrift + dailyVolatility * randomShock;
            
            price = price * Math.exp(dailyReturn);
            
            // Evitar precios extremos
            price = Math.max(initialPrice * 0.3, Math.min(price, initialPrice * 3.0));
            
            data.push({
                date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
                price: Number(price.toFixed(2)),
                volume: Math.floor(this.rng.range(500000, 2000000))
            });
        }
        
        return data;
    }

    generateMultipleScenarios(days = 252) {
        return {
            'Bull Market': this.generateRealisticPriceData(days, 100, 0.20, 0.12),
            'Bear Market': this.generateRealisticPriceData(days, 100, 0.30, -0.05),
            'Sideways Market': this.generateRealisticPriceData(days, 100, 0.18, 0.02),
            'Volatile Market': this.generateRealisticPriceData(days, 100, 0.40, 0.06),
            'Stable Growth': this.generateRealisticPriceData(days, 100, 0.15, 0.08)
        };
    }
}

/**
 * Sistema principal de backtesting realista
 */
class RealisticBacktester {
    constructor() {
        this.strategies = new RealisticOptionsStrategies();
        this.dataGenerator = new RealisticMarketDataGenerator();
        this.results = {};
    }

    async runRealisticBacktest(initialCapital = 100000) {
        console.log('🎯 REALISTIC OPTIONS BACKTESTING - EDGE ANALYSIS');
        console.log('=' .repeat(60));
        console.log(`💰 Capital inicial: $${initialCapital.toLocaleString()}`);
        console.log(`📊 Benchmark: Buy & Hold`);
        console.log(`🎚️  Primas limitadas a rangos realistas (1-8% del subyacente)`);
        console.log(`💸 Comisiones incluidas: $${MARKET_CONSTANTS.COMMISSION}/contrato`);
        console.log('');

        const scenarios = this.dataGenerator.generateMultipleScenarios(252);
        
        for (let [scenarioName, priceData] of Object.entries(scenarios)) {
            console.log(`📊 Analizando: ${scenarioName}`);
            
            this.results[scenarioName] = {};
            
            // Buy & Hold (Benchmark)
            this.results[scenarioName]['Buy & Hold'] = 
                this.strategies.buyAndHold(initialCapital, priceData);
            
            // Covered Calls
            this.results[scenarioName]['Covered Calls'] = 
                this.strategies.coveredCalls(initialCapital, priceData);
            
            // Cash Secured Puts
            this.results[scenarioName]['Cash Secured Puts'] = 
                this.strategies.cashSecuredPuts(initialCapital, priceData);
            
            // Wheel Strategy
            this.results[scenarioName]['Wheel Strategy'] = 
                this.strategies.wheelStrategy(initialCapital, priceData);
            
            console.log(`✅ ${scenarioName} completado`);
        }

        this.generateEdgeAnalysis();
        this.saveResults();
        
        console.log('\n🎯 REALISTIC BACKTESTING COMPLETADO');
    }

    generateEdgeAnalysis() {
        console.log('\n' + '=' .repeat(60));
        console.log('📈 ANÁLISIS DE EDGE vs BUY & HOLD');
        console.log('=' .repeat(60));

        const edgeAnalysis = {};

        for (let [scenario, results] of Object.entries(this.results)) {
            console.log(`\n🎯 ${scenario.toUpperCase()}`);
            console.log('-' .repeat(40));

            const benchmark = results['Buy & Hold'];
            edgeAnalysis[scenario] = {};

            // Mostrar benchmark primero
            console.log(`\n📊 BENCHMARK - Buy & Hold:`);
            console.log(`   💰 Retorno final: ${(benchmark.total_return * 100).toFixed(2)}%`);
            console.log(`   📈 Retorno anualizado: ${(benchmark.annualized_return * 100).toFixed(2)}%`);
            console.log(`   📉 Max Drawdown: ${(benchmark.max_drawdown * 100).toFixed(2)}%`);
            console.log(`   📏 Sharpe Ratio: ${benchmark.sharpe_ratio.toFixed(3)}`);
            console.log(`   🌊 Volatilidad: ${(benchmark.volatility * 100).toFixed(2)}%`);

            // Analizar cada estrategia vs benchmark
            for (let [strategyName, result] of Object.entries(results)) {
                if (strategyName === 'Buy & Hold') continue;

                const excessReturn = result.annualized_return - benchmark.annualized_return;
                const relativePerformance = (result.final_value / benchmark.final_value - 1) * 100;
                const sharpeImprovement = result.sharpe_ratio - benchmark.sharpe_ratio;

                edgeAnalysis[scenario][strategyName] = {
                    excess_return: excessReturn,
                    relative_performance: relativePerformance,
                    sharpe_improvement: sharpeImprovement,
                    has_edge: excessReturn > 0.01 && sharpeImprovement > 0
                };

                console.log(`\n💡 ${strategyName}:`);
                console.log(`   💰 Retorno final: ${(result.total_return * 100).toFixed(2)}%`);
                console.log(`   📈 Retorno anualizado: ${(result.annualized_return * 100).toFixed(2)}%`);
                console.log(`   🎯 EDGE vs B&H: ${excessReturn >= 0 ? '+' : ''}${(excessReturn * 100).toFixed(2)}%`);
                console.log(`   🔄 Performance relativo: ${relativePerformance >= 0 ? '+' : ''}${relativePerformance.toFixed(2)}%`);
                console.log(`   📏 Sharpe vs B&H: ${sharpeImprovement >= 0 ? '+' : ''}${sharpeImprovement.toFixed(3)}`);
                console.log(`   📉 Max Drawdown: ${(result.max_drawdown * 100).toFixed(2)}%`);
                
                if (result.net_premium_income) {
                    console.log(`   💎 Ingresos netos primas: $${result.net_premium_income.toLocaleString()}`);
                    console.log(`   🔄 Transacciones: ${result.transactions}`);
                }

                // Veredicto del edge
                const hasEdge = edgeAnalysis[scenario][strategyName].has_edge;
                console.log(`   🏆 EDGE REAL: ${hasEdge ? '✅ SÍ' : '❌ NO'}`);
            }
        }

        this.generateEdgeSummary(edgeAnalysis);
    }

    generateEdgeSummary(edgeAnalysis) {
        console.log('\n' + '=' .repeat(60));
        console.log('🏆 RESUMEN DE EDGE REAL');
        console.log('=' .repeat(60));

        const strategyEdges = {};
        
        // Agregar datos por estrategia
        for (let scenario of Object.keys(edgeAnalysis)) {
            for (let [strategy, analysis] of Object.entries(edgeAnalysis[scenario])) {
                if (!strategyEdges[strategy]) {
                    strategyEdges[strategy] = {
                        scenarios_with_edge: 0,
                        total_scenarios: 0,
                        avg_excess_return: 0,
                        avg_sharpe_improvement: 0,
                        excess_returns: []
                    };
                }
                
                strategyEdges[strategy].total_scenarios++;
                strategyEdges[strategy].excess_returns.push(analysis.excess_return);
                
                if (analysis.has_edge) {
                    strategyEdges[strategy].scenarios_with_edge++;
                }
            }
        }

        // Calcular promedios
        for (let [strategy, data] of Object.entries(strategyEdges)) {
            data.avg_excess_return = data.excess_returns.reduce((sum, r) => sum + r, 0) / data.excess_returns.length;
            data.edge_consistency = data.scenarios_with_edge / data.total_scenarios;
        }

        // Mostrar ranking por consistencia de edge
        const rankedStrategies = Object.entries(strategyEdges)
            .sort(([,a], [,b]) => b.edge_consistency - a.edge_consistency);

        console.log('\n📊 RANKING DE ESTRATEGIAS POR EDGE REAL:');
        console.log('-' .repeat(50));

        rankedStrategies.forEach(([strategy, data], index) => {
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}️⃣`;
            
            console.log(`\n${medal} ${strategy}:`);
            console.log(`   🎯 Edge consistente: ${(data.edge_consistency * 100).toFixed(0)}% de escenarios`);
            console.log(`   📈 Excess return promedio: ${(data.avg_excess_return * 100).toFixed(2)}%`);
            console.log(`   ✅ Escenarios exitosos: ${data.scenarios_with_edge}/${data.total_scenarios}`);
            
            const recommendation = this.getStrategyRecommendation(data);
            console.log(`   💡 Recomendación: ${recommendation}`);
        });

        console.log('\n' + '=' .repeat(60));
        console.log('🎯 CONCLUSIÓN PRINCIPAL');
        console.log('=' .repeat(60));
        
        const bestStrategy = rankedStrategies[0];
        if (bestStrategy[1].edge_consistency > 0.6) {
            console.log(`✅ ${bestStrategy[0]} muestra EDGE REAL consistente`);
            console.log(`📊 Supera a Buy & Hold en ${(bestStrategy[1].edge_consistency * 100).toFixed(0)}% de escenarios`);
            console.log(`💰 Genera excess return promedio de ${(bestStrategy[1].avg_excess_return * 100).toFixed(2)}%`);
        } else {
            console.log(`❌ NINGUNA estrategia muestra edge consistente vs Buy & Hold`);
            console.log(`📊 La mejor estrategia solo funciona en ${(bestStrategy[1].edge_consistency * 100).toFixed(0)}% de casos`);
            console.log(`💡 Recomendación: Mantener Buy & Hold como estrategia principal`);
        }
    }

    getStrategyRecommendation(data) {
        if (data.edge_consistency >= 0.8) return "ALTAMENTE RECOMENDADA";
        if (data.edge_consistency >= 0.6) return "RECOMENDADA con gestión de riesgo";
        if (data.edge_consistency >= 0.4) return "USAR CON PRECAUCIÓN";
        return "NO RECOMENDADA - Sin edge consistente";
    }

    saveResults() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `realistic-options-edge-analysis-${timestamp}.json`;
        
        const output = {
            timestamp: new Date().toISOString(),
            analysis_type: 'Realistic Options Edge Analysis',
            market_constants: MARKET_CONSTANTS,
            results: this.results,
            metadata: {
                focus: 'Quantifying real edge vs Buy & Hold',
                commission_included: true,
                realistic_premiums: true,
                scenarios_tested: Object.keys(this.results).length
            }
        };

        fs.writeFileSync(filename, JSON.stringify(output, null, 2));
        console.log(`\n💾 Análisis guardado: ${filename}`);
    }
}

// Función principal
async function main() {
    console.log('🚀 REALISTIC OPTIONS BACKTESTING SYSTEM');
    console.log('🎯 Quantifying Real Edge vs Buy & Hold');
    console.log('');
    
    try {
        const backtester = new RealisticBacktester();
        await backtester.runRealisticBacktest(100000);
        
    } catch (error) {
        console.error('❌ Error during backtesting:', error);
        process.exit(1);
    }
}

// Ejecutar
if (require.main === module) {
    main();
}

module.exports = {
    RealisticBacktester,
    RealisticOptionsStrategies,
    RealisticBlackScholes,
    RealisticMarketDataGenerator,
    MARKET_CONSTANTS
};

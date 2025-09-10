#!/usr/bin/env node
/**
 * 🧪 TEST REAL GAMMA HEDGING ENGINE
 * =================================
 * 
 * Prueba del motor de gamma hedging usando datos reales de mercado
 * Conecta a Binance para obtener precios actuales y volatilidades
 * 
 * @author QBTC Systems - Real Data Testing
 * @version 1.0 - REAL MARKET DATA
 */

const GammaHedgingEngine = require('./src/optimization/gamma-hedging-engine');

class RealGammaHedgingTest {
    constructor() {
        this.engine = new GammaHedgingEngine();
        this.testResults = {
            passed: 0,
            failed: 0,
            total: 0,
            realDataUsed: 0,
            details: []
        };
    }
    
    /**
     * 🚀 Ejecutar prueba completa con datos reales
     */
    async runRealDataTest() {
        console.log('🧪 === PRUEBA DE GAMMA HEDGING CON DATOS REALES ===\n');
        
        try {
            // Inicializar engine con datos reales
            await this.engine.initialize();
            
            // Crear posiciones de prueba realistas
            const realPositions = await this.createRealPositions();
            console.log(`📊 Creadas ${realPositions.length} posiciones con precios de mercado actuales\n`);
            
            // Test 1: Análisis gamma con datos reales
            await this.testRealGammaAnalysis(realPositions);
            
            // Test 2: Cálculo de griegos con volatilidad real
            await this.testRealGreeksCalculation(realPositions[0]);
            
            // Test 3: Generación de estrategia con condiciones reales
            await this.testRealHedgingStrategy(realPositions);
            
            // Test 4: Validación de conexiones
            await this.testRealConnections();
            
            // Test 5: Monitoreo en tiempo real
            await this.testRealTimeMonitoring();
            
            // Mostrar resultados finales
            this.showResults();
            
        } catch (error) {
            console.error('💥 Error en prueba de datos reales:', error.message);
            console.error(error.stack);
        }
    }
    
    /**
     * 📊 Crear posiciones con precios de mercado actuales
     */
    async createRealPositions() {
        console.log('📊 Obteniendo precios actuales del mercado...');
        
        try {
            // Obtener precios actuales
            const btcPrice = await this.engine.binanceConnector.getFuturesTickerPrice('BTCUSDT');
            const ethPrice = await this.engine.binanceConnector.getFuturesTickerPrice('ETHUSDT');
            
            console.log(`💰 BTC: $${Number(btcPrice.price).toLocaleString()}`);
            console.log(`💰 ETH: $${Number(ethPrice.price).toLocaleString()}`);
            
            // Crear posiciones con precios reales
            const positions = [
                {
                    symbol: 'BTCUSDT',
                    strike: Math.round(Number(btcPrice.price) * 0.95), // 5% OTM PUT
                    expiration: this.getExpirationDate(30), // 30 días
                    optionType: 'PUT',
                    quantity: 50,
                    underlyingPrice: Number(btcPrice.price),
                    impliedVolatility: 0.8 // Se actualizará con datos reales
                },
                {
                    symbol: 'BTCUSDT',
                    strike: Math.round(Number(btcPrice.price) * 1.05), // 5% OTM CALL
                    expiration: this.getExpirationDate(30),
                    optionType: 'CALL',
                    quantity: 30,
                    underlyingPrice: Number(btcPrice.price),
                    impliedVolatility: 0.85
                },
                {
                    symbol: 'ETHUSDT',
                    strike: Math.round(Number(ethPrice.price) * 0.9), // 10% OTM PUT
                    expiration: this.getExpirationDate(45), // 45 días
                    optionType: 'PUT',
                    quantity: 100,
                    underlyingPrice: Number(ethPrice.price),
                    impliedVolatility: 0.9
                }
            ];
            
            this.testResults.realDataUsed += 2; // BTC y ETH precios reales
            return positions;
            
        } catch (error) {
            console.warn(`⚠️ Error obteniendo precios reales: ${error.message}`);
            console.log('🔄 Usando datos fallback...');
            
            // Fallback a precios estimados
            return [
                {
                    symbol: 'BTCUSDT',
                    strike: 92000,
                    expiration: this.getExpirationDate(30),
                    optionType: 'PUT',
                    quantity: 50,
                    underlyingPrice: 97000,
                    impliedVolatility: 0.8
                }
            ];
        }
    }
    
    /**
     * 📈 Test análisis gamma con datos reales
     */
    async testRealGammaAnalysis(positions) {
        console.log('📈 Testing: Análisis de gamma con datos reales...');
        
        try {
            const analysis = await this.engine.analyzeGammaExposure(positions);
            
            // Verificar que se usaron datos reales
            this.assert(analysis.realMarketData !== undefined, 'Debe incluir datos de mercado reales');
            this.assert(analysis.realMarketData.pricesUsed > 0, 'Debe haber usado precios reales');
            this.assert(analysis.quantumEnhancement.dataSource === 'real_market', 'Quantum enhancement debe usar datos reales');
            
            console.log(`   💹 Gamma Total: ${analysis.totalGamma.toLocaleString()}`);
            console.log(`   🎯 Delta Total: ${analysis.totalDelta.toFixed(2)}`);
            console.log(`   ⚠️ Nivel de Riesgo: ${analysis.riskLevel}`);
            console.log(`   📊 Precios Usados: ${analysis.realMarketData.pricesUsed}`);
            console.log(`   🔄 Frescura de Datos: ${new Date(analysis.realMarketData.dataFreshness).toLocaleTimeString()}`);
            
            this.testResults.realDataUsed += analysis.realMarketData.pricesUsed;
            this.pass('Análisis gamma con datos reales');
            
        } catch (error) {
            this.fail('Análisis gamma con datos reales', error.message);
        }
    }
    
    /**
     * 🧮 Test cálculo de griegos con datos reales
     */
    async testRealGreeksCalculation(position) {
        console.log('🧮 Testing: Cálculo de griegos con datos reales...');
        
        try {
            // Obtener datos de mercado actuales para la posición
            const marketData = await this.engine.getRealMarketData([position]);
            
            // Crear posición enriquecida con datos reales
            const realPosition = {
                ...position,
                underlyingPrice: marketData[position.symbol] || position.underlyingPrice,
                marketData: marketData[position.symbol + '_detail'] || null
            };
            
            const greeks = await this.engine.calculateGreeksWithRealData(realPosition);
            
            // Verificar que se usaron datos reales
            this.assert(greeks.realData !== undefined, 'Debe incluir metadatos de datos reales');
            this.assert(greeks.realData.dataSource === 'real_market', 'Debe usar datos de mercado real');
            this.assert(greeks.realData.currentPrice > 0, 'Precio actual debe ser válido');
            
            console.log(`   📊 Delta: ${greeks.delta.toFixed(4)} (precio actual: $${greeks.realData.currentPrice.toLocaleString()})`);
            console.log(`   📈 Gamma: ${greeks.gamma.toFixed(8)}`);
            console.log(`   ⏰ Theta: ${greeks.theta.toFixed(2)} (tiempo: ${greeks.realData.timeToExpiration.toFixed(4)} años)`);
            console.log(`   📊 Vega: ${greeks.vega.toFixed(2)}`);
            console.log(`   💨 Volatilidad de Mercado: ${(greeks.realData.marketVolatility * 100)?.toFixed(1) || 'N/A'}%`);
            
            this.testResults.realDataUsed += 1;
            this.pass('Cálculo de griegos con datos reales');
            
        } catch (error) {
            this.fail('Cálculo de griegos con datos reales', error.message);
        }
    }
    
    /**
     * 🎯 Test generación de estrategia con condiciones reales
     */
    async testRealHedgingStrategy(positions) {
        console.log('🎯 Testing: Generación de estrategia con condiciones reales...');
        
        try {
            // Análisis con datos reales
            const analysis = await this.engine.analyzeGammaExposure(positions);
            
            // Obtener condiciones de mercado actuales
            const marketConditions = await this.getRealMarketConditions();
            
            // Generar estrategia
            const strategy = await this.engine.generateHedgingStrategy(analysis, marketConditions);
            
            // Verificar estrategia
            this.assert(strategy !== null, 'Debe generar una estrategia');
            this.assert(['NO_HEDGE_NEEDED', 'CONSERVATIVE_HEDGE', 'STANDARD_HEDGE', 'AGGRESSIVE_HEDGE', 'EMERGENCY_HEDGE'].includes(strategy.action), 'Acción de estrategia debe ser válida');
            
            console.log(`   🎯 Acción Recomendada: ${strategy.action}`);
            console.log(`   📊 Hedge Ratio: ${strategy.hedgeRatio?.toFixed(3) || 'N/A'}`);
            console.log(`   💰 Costo Esperado: $${strategy.expectedCosts?.expected?.toFixed(2) || '0.00'}`);
            console.log(`   🤖 Confianza ML: ${(strategy.mlConfidence * 100)?.toFixed(1) || 'N/A'}%`);
            console.log(`   📈 Condiciones de Mercado: Volatilidad ${(marketConditions.impliedVolatility * 100).toFixed(1)}%`);
            
            this.pass('Generación de estrategia con condiciones reales');
            
        } catch (error) {
            this.fail('Generación de estrategia con condiciones reales', error.message);
        }
    }
    
    /**
     * 🔗 Test validación de conexiones reales
     */
    async testRealConnections() {
        console.log('🔗 Testing: Validación de conexiones reales...');
        
        try {
            const isConnected = await this.engine.validateRealDataConnections();
            
            this.assert(isConnected === true, 'Debe conectar a fuentes de datos reales');
            
            // Test adicional: obtener balance si está configurado
            try {
                const balance = await this.engine.binanceConnector.getAccountBalance();
                if (balance && balance.__detail) {
                    console.log(`   💰 Balance Total Disponible: ${balance.__detail.availableTotal || 0} USDT`);
                    console.log(`   📊 OPTIONS: ${balance.__detail.eapiUSDT || 0} USDT`);
                    console.log(`   📈 FUTURES: ${balance.__detail.fapiUSDT || 0} USDT`);
                    this.testResults.realDataUsed += 1;
                }
            } catch (balanceError) {
                console.warn(`   ⚠️ No se pudo obtener balance (normal si no hay API keys): ${balanceError.message}`);
            }
            
            this.pass('Validación de conexiones reales');
            
        } catch (error) {
            this.fail('Validación de conexiones reales', error.message);
        }
    }
    
    /**
     * ⚡ Test monitoreo en tiempo real
     */
    async testRealTimeMonitoring() {
        console.log('⚡ Testing: Monitoreo en tiempo real...');
        
        try {
            // Simular actualización de cache con datos reales
            await this.engine.updateMarketDataCache();
            
            // Verificar que el cache se actualizó
            const cached = this.engine.marketDataCache.get('latest_prices');
            
            if (cached) {
                this.assert(cached.data !== null, 'Cache debe contener datos');
                this.assert(Date.now() - cached.timestamp < 60000, 'Datos deben ser recientes (menos de 1 minuto)');
                
                console.log(`   🔄 Cache Actualizado: ${new Date(cached.timestamp).toLocaleTimeString()}`);
                console.log(`   📊 Símbolos en Cache: ${Object.keys(cached.data).filter(k => !k.includes('_detail')).length}`);
                
                this.testResults.realDataUsed += 1;
            }
            
            this.pass('Monitoreo en tiempo real');
            
        } catch (error) {
            this.fail('Monitoreo en tiempo real', error.message);
        }
    }
    
    /**
     * 🌍 Obtener condiciones de mercado reales
     */
    async getRealMarketConditions() {
        try {
            // Obtener estadísticas de 24hr para volatilidad
            const btcStats = await this.engine.binanceConnector.getFutures24hrTicker('BTCUSDT');
            
            const change = Math.abs(Number(btcStats?.priceChangePercent || 0)) / 100;
            const volatility = Math.max(0.3, Math.min(2.0, change * 10)); // Estimar volatilidad desde cambio
            
            return {
                volatilityRegime: volatility > 1.0 ? 'HIGH_VOL' : volatility > 0.6 ? 'NORMAL_VOL' : 'LOW_VOL',
                impliedVolatility: volatility,
                liquidity: 0.85, // Asumir alta liquidez para BTC
                priceVelocity: change,
                volumeRatio: 1.2,
                timeToExpiration: 30,
                correlationStrength: 0.7,
                dataSource: 'real_market',
                timestamp: Date.now()
            };
        } catch (error) {
            console.warn(`⚠️ Error obteniendo condiciones reales: ${error.message}`);
            return {
                volatilityRegime: 'NORMAL_VOL',
                impliedVolatility: 0.8,
                liquidity: 0.8,
                priceVelocity: 0.02,
                volumeRatio: 1.1,
                timeToExpiration: 30,
                correlationStrength: 0.6,
                dataSource: 'fallback',
                timestamp: Date.now()
            };
        }
    }
    
    /**
     * 📅 Obtener fecha de expiración
     */
    getExpirationDate(daysFromNow) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + daysFromNow);
        return expiry.toISOString();
    }
    
    /**
     * ✅ Assertion helper
     */
    assert(condition, message) {
        this.testResults.total++;
        
        if (condition) {
            this.testResults.passed++;
            this.testResults.details.push({ status: 'PASS', message });
        } else {
            this.testResults.failed++;
            this.testResults.details.push({ status: 'FAIL', message });
            throw new Error(`Assertion failed: ${message}`);
        }
    }
    
    /**
     * ✅ Pass helper
     */
    pass(testName) {
        console.log(`✅ ${testName} - PASSED\n`);
    }
    
    /**
     * ❌ Fail helper
     */
    fail(testName, error) {
        console.log(`❌ ${testName} - FAILED: ${error}\n`);
    }
    
    /**
     * 📋 Mostrar resultados finales
     */
    showResults() {
        console.log('\n📋 === RESULTADOS DE PRUEBA CON DATOS REALES ===');
        console.log(`📊 Total Tests: ${this.testResults.total}`);
        console.log(`✅ Passed: ${this.testResults.passed}`);
        console.log(`❌ Failed: ${this.testResults.failed}`);
        console.log(`📈 Datos Reales Utilizados: ${this.testResults.realDataUsed} fuentes`);
        console.log(`🎯 Success Rate: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(1)}%`);
        
        if (this.testResults.failed > 0) {
            console.log('\n❌ Tests Fallidos:');
            this.testResults.details
                .filter(detail => detail.status === 'FAIL')
                .forEach((detail, index) => {
                    console.log(`   ${index + 1}. ${detail.message}`);
                });
        }
        
        console.log('\n🎉 Prueba de Gamma Hedging con Datos Reales Completada!');
        
        if (this.testResults.realDataUsed > 0) {
            console.log(`🌟 Sistema validado con ${this.testResults.realDataUsed} fuentes de datos reales`);
        } else {
            console.log('⚠️ Sistema ejecutado pero sin acceso a datos reales (revisar configuración API)');
        }
    }
}

// Ejecutar prueba si se llama directamente
if (require.main === module) {
    const realTest = new RealGammaHedgingTest();
    realTest.runRealDataTest()
        .then(() => {
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Test suite crashed:', error);
            process.exit(1);
        });
}

module.exports = RealGammaHedgingTest;

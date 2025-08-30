
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

/**
 *  TEST PRECIOS Y PROYECCIONES - SISTEMA NEURAL QUANTUM UNIFIED
 * Script de prueba para verificar precios reales y proyecciones por timeframe
 */

const axios = require('axios');

const CORE_URL = 'http://localhost:4601';
const FRONTEND_URL = 'http://localhost:4603';

class PricesProjectionsTester {
    constructor() {
        this.testResults = [];
        this.startTime = Date.now();
    }

    async runAllTests() {
        console.log(' INICIANDO TEST PRECIOS Y PROYECCIONES');
        console.log(' SISTEMA NEURAL QUANTUM UNIFIED');
        console.log('=' .repeat(80));

        try {
            // Test 1: Precios Actuales
            await this.testCurrentPrices();

            // Test 2: Precio de Símbolo Específico
            await this.testSpecificPrice();

            // Test 3: Proyecciones por Timeframe
            await this.testTimeframeProjections();

            // Test 4: Proyección Neural con Precios Reales
            await this.testNeuralProjectionReal();

            // Test 5: Todas las Proyecciones Neurales
            await this.testAllNeuralProjections();

            // Test 6: Frontend Endpoints
            await this.testFrontendEndpoints();

            this.printResults();

        } catch (error) {
            console.error('[ERROR] Error en tests:', error.message);
        }
    }

    async testCurrentPrices() {
        console.log('\n[MONEY] Test 1: Precios Actuales');
        try {
            const response = await axios.get(`${CORE_URL}/api/current-prices`, { timeout: 10000 });
            
            if (response.status === 200 && response.data.success) {
                const data = response.data.data;
                console.log('[OK] Precios Actuales: OPERATIVOS');
                console.log(`[DATA] Total Símbolos: ${data.totalSymbols}`);
                console.log(`[TIME] Timestamp: ${data.timestamp}`);
                
                // Mostrar algunos precios
                const prices = data.prices;
                const symbols = Object.keys(prices).slice(0, 5);
                console.log('[UP] Primeros 5 Precios:');
                symbols.forEach(symbol => {
                    console.log(`   ${symbol}: $${prices[symbol].toFixed(4)}`);
                });

                this.testResults.push({ test: 'Current Prices', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Precios Actuales: ERROR');
                this.testResults.push({ test: 'Current Prices', status: 'FAIL', error: 'Response not successful' });
            }
        } catch (error) {
            console.log('[ERROR] Precios Actuales: ERROR -', error.message);
            this.testResults.push({ test: 'Current Prices', status: 'FAIL', error: error.message });
        }
    }

    async testSpecificPrice() {
        console.log('\n[DIAMOND] Test 2: Precio de Símbolo Específico');
        try {
            const symbol = 'BTCUSDT';
            const response = await axios.get(`${CORE_URL}/api/price/${symbol}`, { timeout: 5000 });
            
            if (response.status === 200 && response.data.success) {
                const data = response.data.data;
                console.log('[OK] Precio Específico: OPERATIVO');
                console.log(` Símbolo: ${data.symbol}`);
                console.log(`[MONEY] Precio: $${data.price.toFixed(4)}`);
                console.log(`[TIME] Timestamp: ${data.timestamp}`);

                this.testResults.push({ test: 'Specific Price', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Precio Específico: ERROR');
                this.testResults.push({ test: 'Specific Price', status: 'FAIL', error: 'Response not successful' });
            }
        } catch (error) {
            console.log('[ERROR] Precio Específico: ERROR -', error.message);
            this.testResults.push({ test: 'Specific Price', status: 'FAIL', error: error.message });
        }
    }

    async testTimeframeProjections() {
        console.log('\n[DATA] Test 3: Proyecciones por Timeframe');
        try {
            const symbol = 'BTCUSDT';
            const timeframes = '1h,4h,1d,7d,30d';
            const response = await axios.get(`${CORE_URL}/api/projections/${symbol}?timeframes=${timeframes}`, { timeout: 10000 });
            
            if (response.status === 200 && response.data.success) {
                const data = response.data.data;
                console.log('[OK] Proyecciones por Timeframe: OPERATIVAS');
                console.log(` Símbolo: ${data.symbol}`);
                console.log(`[MONEY] Precio Actual: $${data.projections['1h'].currentPrice.toFixed(4)}`);
                
                console.log('[UP] Proyecciones:');
                Object.entries(data.projections).forEach(([timeframe, projection]) => {
                    console.log(`   ${timeframe}: $${projection.projectedPrice.toFixed(4)} (${projection.percentChange.toFixed(2)}%) [${(projection.confidence * 100).toFixed(1)}%]`);
                });

                this.testResults.push({ test: 'Timeframe Projections', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Proyecciones por Timeframe: ERROR');
                this.testResults.push({ test: 'Timeframe Projections', status: 'FAIL', error: 'Response not successful' });
            }
        } catch (error) {
            console.log('[ERROR] Proyecciones por Timeframe: ERROR -', error.message);
            this.testResults.push({ test: 'Timeframe Projections', status: 'FAIL', error: error.message });
        }
    }

    async testNeuralProjectionReal() {
        console.log('\n Test 4: Proyección Neural con Precios Reales');
        try {
            const response = await axios.post(`${CORE_URL}/api/neural-projection-real`, {
                symbol: 'ETHUSDT',
                timeHorizon: '7d',
                leverage: 50
            }, { timeout: 15000 });
            
            if (response.status === 200 && response.data.success) {
                const data = response.data.data;
                console.log('[OK] Proyección Neural Real: OPERATIVA');
                console.log(` Símbolo: ${data.symbol}`);
                console.log(`[MONEY] Precio Actual: $${data.currentPrice.toFixed(4)}`);
                console.log(`[FAST] Leverage: ${data.leverage}x`);
                
                if (data.quantumTimeframes) {
                    console.log('[DATA] Timeframes Cuánticos:');
                    Object.entries(data.quantumTimeframes).forEach(([timeframe, tfData]) => {
                        console.log(`   ${timeframe}: $${tfData.projectedPrice.toFixed(4)} (${tfData.percentChange.toFixed(2)}%)`);
                    });
                }

                if (data.takeProfitZones) {
                    console.log('[ENDPOINTS] Zonas Take Profit:');
                    Object.entries(data.takeProfitZones).forEach(([zone, zoneData]) => {
                        console.log(`   ${zone}: $${zoneData.price.toFixed(4)} (${(zoneData.probability * 100).toFixed(1)}%)`);
                    });
                }

                this.testResults.push({ test: 'Neural Projection Real', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Proyección Neural Real: ERROR');
                this.testResults.push({ test: 'Neural Projection Real', status: 'FAIL', error: 'Response not successful' });
            }
        } catch (error) {
            console.log('[ERROR] Proyección Neural Real: ERROR -', error.message);
            this.testResults.push({ test: 'Neural Projection Real', status: 'FAIL', error: error.message });
        }
    }

    async testAllNeuralProjections() {
        console.log('\n Test 5: Todas las Proyecciones Neurales');
        try {
            const response = await axios.get(`${CORE_URL}/api/all-neural-projections`, { timeout: 20000 });
            
            if (response.status === 200 && response.data.success) {
                const data = response.data.data;
                console.log('[OK] Todas las Proyecciones Neurales: OPERATIVAS');
                console.log(`[DATA] Total Símbolos: ${data.totalSymbols}`);
                
                // Mostrar algunos ejemplos
                const projections = data.projections;
                const symbols = Object.keys(projections).slice(0, 3);
                console.log(' Ejemplos de Proyecciones:');
                symbols.forEach(symbol => {
                    const projection = projections[symbol];
                    if (!projection.error) {
                        const currentPrice = projection.currentPrice || 0;
                        console.log(`   ${symbol}: $${currentPrice.toFixed(4)}`);
                    } else {
                        console.log(`   ${symbol}: Error - ${projection.error}`);
                    }
                });

                this.testResults.push({ test: 'All Neural Projections', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Todas las Proyecciones Neurales: ERROR');
                this.testResults.push({ test: 'All Neural Projections', status: 'FAIL', error: 'Response not successful' });
            }
        } catch (error) {
            console.log('[ERROR] Todas las Proyecciones Neurales: ERROR -', error.message);
            this.testResults.push({ test: 'All Neural Projections', status: 'FAIL', error: error.message });
        }
    }

    async testFrontendEndpoints() {
        console.log('\n[NIGHT] Test 6: Frontend Endpoints');
        try {
            // Test endpoint unificado
            const response = await axios.get(`${FRONTEND_URL}/api/unified-data`, { timeout: 15000 });
            
            if (response.status === 200 && response.data.success) {
                const data = response.data.data;
                console.log('[OK] Frontend Endpoints: OPERATIVOS');
                console.log(`[DATA] Oportunidades: ${data.opportunities?.length || 0}`);
                console.log(`[MONEY] Precios: ${Object.keys(data.currentPrices || {}).length}`);
                console.log(` Proyecciones: ${Object.keys(data.allProjections || {}).length}`);
                console.log(` Sistema Neural: ${data.systemStatus?.neuralSystem}`);
                console.log(` Posicionamiento: ${data.systemStatus?.quantumPositioning}`);
                console.log(`[MONEY] Price Feed: ${data.systemStatus?.priceFeed}`);

                this.testResults.push({ test: 'Frontend Endpoints', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Frontend Endpoints: ERROR');
                this.testResults.push({ test: 'Frontend Endpoints', status: 'FAIL', error: 'Response not successful' });
            }
        } catch (error) {
            console.log('[ERROR] Frontend Endpoints: ERROR -', error.message);
            this.testResults.push({ test: 'Frontend Endpoints', status: 'FAIL', error: error.message });
        }
    }

    printResults() {
        const endTime = Date.now();
        const duration = (endTime - this.startTime) / 1000;

        console.log('\n' + '=' .repeat(80));
        console.log(' RESUMEN DE TESTS PRECIOS Y PROYECCIONES');
        console.log(' SISTEMA NEURAL QUANTUM UNIFIED');
        console.log('=' .repeat(80));

        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        const total = this.testResults.length;

        console.log(`  Duración Total: ${duration.toFixed(2)} segundos`);
        console.log(`[OK] Tests Exitosos: ${passed}/${total}`);
        console.log(`[ERROR] Tests Fallidos: ${failed}/${total}`);
        console.log(`[DATA] Tasa de Éxito: ${((passed / total) * 100).toFixed(1)}%`);

        console.log('\n[LIST] Detalle de Tests:');
        this.testResults.forEach((result, index) => {
            const status = result.status === 'PASS' ? '[OK]' : '[ERROR]';
            console.log(`${status} Test ${index + 1}: ${result.test} - ${result.status}`);
        });

        if (passed === total) {
            console.log('\n ¡SISTEMA DE PRECIOS Y PROYECCIONES OPERATIVO AL 100%!');
            console.log('[MONEY] Precios Reales: ACTIVOS');
            console.log(' Proyecciones por Timeframe: ACTIVAS');
            console.log(' Proyecciones Neurales: ACTIVAS');
            console.log(' TODOS LOS COMPONENTES FUNCIONANDO CORRECTAMENTE');
        } else {
            console.log('\n[WARNING]  SISTEMA PARCIALMENTE OPERATIVO');
            console.log(' Revisar componentes fallidos');
        }

        console.log('\n[API] URLs del Sistema:');
        console.log(` Core System: ${CORE_URL}`);
        console.log(`[NIGHT] Frontend: ${FRONTEND_URL}`);
        console.log(` Dashboard: ${FRONTEND_URL}/qbtc-unified-quantum-frontend.html`);
    }
}

// Ejecutar tests
async function main() {
    const tester = new PricesProjectionsTester();
    await tester.runAllTests();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = PricesProjectionsTester;

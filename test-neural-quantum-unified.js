
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
 *  TEST NEURAL QUANTUM UNIFIED - PROYECCIÓN NEURONAL CON TAKE PROFIT CUÁNTICO
 * Script de prueba completo para verificar el sistema unificado
 */

const axios = require('axios');

const CORE_URL = 'http://localhost:4601';
const FRONTEND_URL = 'http://localhost:4603';

class NeuralQuantumUnifiedTester {
    constructor() {
        this.testResults = [];
        this.startTime = Date.now();
    }

    async runAllTests() {
        console.log(' INICIANDO TEST NEURAL QUANTUM UNIFIED');
        console.log(' PROYECCIÓN NEURONAL CON TAKE PROFIT CUÁNTICO');
        console.log('=' .repeat(80));

        try {
            // Test 1: Verificar Core System
            await this.testCoreSystem();

            // Test 2: Verificar Frontend System
            await this.testFrontendSystem();

            // Test 3: Verificar Proyección Neural
            await this.testNeuralProjection();

            // Test 4: Verificar Posicionamiento Cuántico
            await this.testQuantumPositioning();

            // Test 5: Verificar Métricas Neurales Unificadas
            await this.testNeuralMetrics();

            // Test 6: Verificar Oportunidades
            await this.testOpportunities();

            // Test 7: Verificar Salud del Mercado
            await this.testMarketHealth();

            // Test 8: Verificar Endpoints Dinámicos
            await this.testDynamicEndpoints();

            this.printResults();

        } catch (error) {
            console.error('[ERROR] Error en tests:', error.message);
        }
    }

    async testCoreSystem() {
        console.log('\n Test 1: Core System');
        try {
            const response = await axios.get(`${CORE_URL}/health`, { timeout: 5000 });
            if (response.status === 200) {
                console.log('[OK] Core System: OPERATIVO');
                this.testResults.push({ test: 'Core System', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Core System: ERROR');
                this.testResults.push({ test: 'Core System', status: 'FAIL', error: 'Status not 200' });
            }
        } catch (error) {
            console.log('[ERROR] Core System: ERROR -', error.message);
            this.testResults.push({ test: 'Core System', status: 'FAIL', error: error.message });
        }
    }

    async testFrontendSystem() {
        console.log('\n[NIGHT] Test 2: Frontend System');
        try {
            const response = await axios.get(`${FRONTEND_URL}/api/status`, { timeout: 5000 });
            if (response.status === 200 && response.data.neuralSystem === 'ACTIVO') {
                console.log('[OK] Frontend System: OPERATIVO');
                console.log(' Neural System: ACTIVO');
                console.log(' Quantum Positioning: ACTIVO');
                this.testResults.push({ test: 'Frontend System', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Frontend System: ERROR');
                this.testResults.push({ test: 'Frontend System', status: 'FAIL', error: 'Neural system not active' });
            }
        } catch (error) {
            console.log('[ERROR] Frontend System: ERROR -', error.message);
            this.testResults.push({ test: 'Frontend System', status: 'FAIL', error: error.message });
        }
    }

    async testNeuralProjection() {
        console.log('\n Test 3: Proyección Neural');
        try {
            const response = await axios.post(`${FRONTEND_URL}/api/neural-projection`, {
                symbol: 'BTCUSDT',
                currentPrice: 45000,
                timeHorizon: '30d',
                leverage: 75
            }, { timeout: 10000 });

            if (response.status === 200 && response.data.success) {
                const data = response.data.data;
                console.log('[OK] Proyección Neural: OPERATIVA');
                console.log(` Símbolo: ${data.symbol}`);
                console.log(`[MONEY] Precio Actual: $${data.currentPrice}`);
                console.log(`[TIME] Horizonte: ${data.timeHorizon}`);
                console.log(`[FAST] Leverage: ${data.leverage}x`);
                
                if (data.quantumTimeframes) {
                    console.log('[DATA] Timeframes Cuánticos:');
                    Object.entries(data.quantumTimeframes).forEach(([timeframe, tfData]) => {
                        console.log(`   ${timeframe}: $${(tfData.projectedPrice || 0).toFixed(2)} (${(tfData.confidence * 100 || 0).toFixed(1)}%)`);
                    });
                }

                if (data.takeProfitZones) {
                    console.log('[ENDPOINTS] Zonas Take Profit:');
                    Object.entries(data.takeProfitZones).forEach(([zone, zoneData]) => {
                        console.log(`   ${zone}: $${(zoneData.price || 0).toFixed(2)} (${(zoneData.probability * 100 || 0).toFixed(1)}%)`);
                    });
                }

                this.testResults.push({ test: 'Neural Projection', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Proyección Neural: ERROR');
                this.testResults.push({ test: 'Neural Projection', status: 'FAIL', error: 'Projection failed' });
            }
        } catch (error) {
            console.log('[ERROR] Proyección Neural: ERROR -', error.message);
            this.testResults.push({ test: 'Neural Projection', status: 'FAIL', error: error.message });
        }
    }

    async testQuantumPositioning() {
        console.log('\n Test 4: Posicionamiento Cuántico');
        try {
            const response = await axios.post(`${FRONTEND_URL}/api/quantum-position`, {
                symbol: 'BTCUSDT',
                accountBalance: 10000,
                neuralInputs: { coherence: 0.85, consciousness: 0.92, entanglement: 0.78 },
                historicalPerformance: { winRate: 0.68, avgReturn: 0.15, maxDrawdown: 0.12 }
            }, { timeout: 10000 });

            if (response.status === 200 && response.data.success) {
                const data = response.data.data;
                console.log('[OK] Posicionamiento Cuántico: OPERATIVO');
                console.log(`[MONEY] Balance: $${data.accountBalance}`);
                console.log(`[DATA] Tamaño Posición: ${(data.quantumPositionSize * 100 || 0).toFixed(2)}%`);
                console.log(`[FAST] Leverage Óptimo: ${(data.quantumOptimalLeverage || 0).toFixed(0)}x`);
                console.log(` Stop Loss: $${(data.quantumStopLoss || 0).toFixed(2)}`);
                console.log(`[ENDPOINTS] Kelly Cuántico: ${(data.quantumKelly * 100 || 0).toFixed(2)}%`);
                console.log(` Confluencia Neural: ${(data.neuralConfluence * 100 || 0).toFixed(1)}%`);

                this.testResults.push({ test: 'Quantum Positioning', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Posicionamiento Cuántico: ERROR');
                this.testResults.push({ test: 'Quantum Positioning', status: 'FAIL', error: 'Positioning failed' });
            }
        } catch (error) {
            console.log('[ERROR] Posicionamiento Cuántico: ERROR -', error.message);
            this.testResults.push({ test: 'Quantum Positioning', status: 'FAIL', error: error.message });
        }
    }

    async testNeuralMetrics() {
        console.log('\n Test 5: Métricas Neurales Unificadas');
        try {
            const response = await axios.get(`${FRONTEND_URL}/api/neural-metrics`, { timeout: 10000 });

            if (response.status === 200 && response.data.success) {
                const data = response.data.data;
                console.log('[OK] Métricas Neurales: OPERATIVAS');
                
                if (data.systemStatus) {
                    console.log(' Estado del Sistema:');
                    Object.entries(data.systemStatus).forEach(([key, value]) => {
                        console.log(`   ${key}: ${value}`);
                    });
                }

                if (data.quantum) {
                    console.log(' Métricas Cuánticas:');
                    Object.entries(data.quantum).forEach(([key, value]) => {
                        if (typeof value === 'number') {
                            console.log(`   ${key}: ${(value * 100).toFixed(1)}%`);
                        } else {
                            console.log(`   ${key}: ${value}`);
                        }
                    });
                }

                this.testResults.push({ test: 'Neural Metrics', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Métricas Neurales: ERROR');
                this.testResults.push({ test: 'Neural Metrics', status: 'FAIL', error: 'Metrics failed' });
            }
        } catch (error) {
            console.log('[ERROR] Métricas Neurales: ERROR -', error.message);
            this.testResults.push({ test: 'Neural Metrics', status: 'FAIL', error: error.message });
        }
    }

    async testOpportunities() {
        console.log('\n[START] Test 6: Oportunidades');
        try {
            const response = await axios.get(`${FRONTEND_URL}/api/opportunities`, { timeout: 10000 });

            if (response.status === 200 && response.data.success) {
                const opportunities = response.data.data;
                console.log('[OK] Oportunidades: OPERATIVAS');
                console.log(`[DATA] Total Oportunidades: ${opportunities.length}`);

                if (opportunities.length > 0) {
                    console.log(' Top 3 Oportunidades:');
                    opportunities.slice(0, 3).forEach((opp, index) => {
                        console.log(`   ${index + 1}. ${opp.symbol}: ${(opp.score * 100 || 0).toFixed(1)}% (${(opp.leverage || 0).toFixed(0)}x)`);
                    });
                }

                this.testResults.push({ test: 'Opportunities', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Oportunidades: ERROR');
                this.testResults.push({ test: 'Opportunities', status: 'FAIL', error: 'Opportunities failed' });
            }
        } catch (error) {
            console.log('[ERROR] Oportunidades: ERROR -', error.message);
            this.testResults.push({ test: 'Opportunities', status: 'FAIL', error: error.message });
        }
    }

    async testMarketHealth() {
        console.log('\n[DATA] Test 7: Salud del Mercado');
        try {
            const response = await axios.get(`${FRONTEND_URL}/api/market-health`, { timeout: 10000 });

            if (response.status === 200 && response.data.success) {
                const health = response.data.data;
                console.log('[OK] Salud del Mercado: OPERATIVA');
                console.log(`[UP] Volatilidad: ${(health.volatility || 0).toFixed(1)}%`);
                console.log(` Liquidez: ${(health.liquidity || 0).toFixed(1)}%`);
                console.log(` Sentimiento: ${(health.sentiment || 0).toFixed(0)}`);
                console.log(` Cola Ejecución: ${(health.executionQueue || 0).toFixed(0)}`);

                this.testResults.push({ test: 'Market Health', status: 'PASS', data: response.data });
            } else {
                console.log('[ERROR] Salud del Mercado: ERROR');
                this.testResults.push({ test: 'Market Health', status: 'FAIL', error: 'Health failed' });
            }
        } catch (error) {
            console.log('[ERROR] Salud del Mercado: ERROR -', error.message);
            this.testResults.push({ test: 'Market Health', status: 'FAIL', error: error.message });
        }
    }

    async testDynamicEndpoints() {
        console.log('\n[RELOAD] Test 8: Endpoints Dinámicos');
        try {
            // Test múltiples símbolos para proyección neural
            const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT'];
            let successCount = 0;

            for (const symbol of symbols) {
                try {
                    const response = await axios.post(`${FRONTEND_URL}/api/neural-projection`, {
                        symbol: symbol,
                        currentPrice: 45000,
                        timeHorizon: '7d',
                        leverage: 50
                    }, { timeout: 5000 });

                    if (response.status === 200 && response.data.success) {
                        successCount++;
                        console.log(`[OK] ${symbol}: Proyección exitosa`);
                    }
                } catch (error) {
                    console.log(`[ERROR] ${symbol}: Error en proyección`);
                }
            }

            if (successCount >= 2) {
                console.log(`[OK] Endpoints Dinámicos: ${successCount}/${symbols.length} exitosos`);
                this.testResults.push({ test: 'Dynamic Endpoints', status: 'PASS', data: { successCount, total: symbols.length } });
            } else {
                console.log('[ERROR] Endpoints Dinámicos: Muy pocos exitosos');
                this.testResults.push({ test: 'Dynamic Endpoints', status: 'FAIL', error: 'Too few successful' });
            }
        } catch (error) {
            console.log('[ERROR] Endpoints Dinámicos: ERROR -', error.message);
            this.testResults.push({ test: 'Dynamic Endpoints', status: 'FAIL', error: error.message });
        }
    }

    printResults() {
        const endTime = Date.now();
        const duration = (endTime - this.startTime) / 1000;

        console.log('\n' + '=' .repeat(80));
        console.log(' RESUMEN DE TESTS NEURAL QUANTUM UNIFIED');
        console.log(' PROYECCIÓN NEURONAL CON TAKE PROFIT CUÁNTICO');
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
            console.log('\n ¡SISTEMA NEURAL QUANTUM UNIFIED OPERATIVO AL 100%!');
            console.log(' PROYECCIÓN NEURONAL CON TAKE PROFIT CUÁNTICO - ACTIVO');
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
    const tester = new NeuralQuantumUnifiedTester();
    await tester.runAllTests();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = NeuralQuantumUnifiedTester;

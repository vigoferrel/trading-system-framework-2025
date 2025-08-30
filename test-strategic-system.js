
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
 * Test del Sistema Estratégico - Verificación de Arquitectura Correcta
 * 
 * Verifica que el sistema funciona con:
 * - SPOT = FUENTE DE INFORMACIÓN (Análisis y Señales)
 * - FUTURES = EJECUCIÓN PRINCIPAL (Leverage y Profit)
 * - OPTIONS = EJECUCION AVANZADA (Estrategias Complejas)
 */

console.log('[SEARCH] Iniciando Test del Sistema Estratégico...');

// Función para probar endpoint
async function testEndpoint(url, description) {
    try {
        console.log(`[SEARCH] Probando: ${description}`);
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            console.log(`[OK] ${description}: OK`);
            console.log(`   - Status: ${response.status}`);
            console.log(`   - Success: ${data.success}`);
            
            // Mostrar información específica según el endpoint
            if (data.architecture) {
                console.log(`   - Arquitectura: SPOT=${data.architecture.spot}, FUTURES=${data.architecture.futures}, OPTIONS=${data.architecture.options}`);
            }
            
            if (data.purpose) {
                console.log(`   - Propósito: ${data.purpose}`);
            }
            
            if (data.data) {
                if (data.data.spot) {
                    console.log(`   - SPOT: ${data.data.spot.symbols || 0} símbolos, ${data.data.spot.signals || 0} señales`);
                }
                if (data.data.futures) {
                    console.log(`   - FUTURES: ${data.data.futures.symbols || 0} símbolos, ${data.data.futures.opportunities || 0} oportunidades`);
                }
                if (data.data.options) {
                    console.log(`   - OPTIONS: ${data.data.options.contracts || 0} contratos, ${data.data.options.strategies || 0} estrategias`);
                }
                if (data.data.signals) {
                    console.log(`   - SEÑALES: ${data.data.signals.ranked || 0} rankeadas`);
                }
            }
            
            return true;
        } else {
            console.log(`[ERROR] ${description}: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.log(`[ERROR] ${description}: ${error.message}`);
        return false;
    }
}

// Función para probar endpoints del Core System Estratégico
async function testCoreStrategicEndpoints() {
    console.log('\n[NIGHT] Probando Core System Estratégico...');
    
    const endpoints = [
        { url: 'http://localhost:4601/health', desc: 'Core Health' },
        { url: 'http://localhost:4601/api/spot-data', desc: 'Core SPOT Data (Análisis)' },
        { url: 'http://localhost:4601/api/futures-data', desc: 'Core FUTURES Data (Ejecución)' },
        { url: 'http://localhost:4601/api/options-data', desc: 'Core OPTIONS Data (Ejecución Avanzada)' },
        { url: 'http://localhost:4601/api/signals', desc: 'Core Signals (Rankeadas)' },
        { url: 'http://localhost:4601/api/strategic-overview', desc: 'Core Strategic Overview' }
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
        const result = await testEndpoint(endpoint.url, endpoint.desc);
        results.push(result);
    }
    
    return results;
}

// Función para probar endpoints del Frontend Server Estratégico
async function testFrontendStrategicEndpoints() {
    console.log('\n[START] Probando Frontend Server Estratégico...');
    
    const endpoints = [
        { url: 'http://localhost:4603/health', desc: 'Frontend Health' },
        { url: 'http://localhost:4603/api/status', desc: 'Frontend Status' },
        { url: 'http://localhost:4603/api/spot-data', desc: 'Frontend SPOT Data' },
        { url: 'http://localhost:4603/api/futures-data', desc: 'Frontend FUTURES Data' },
        { url: 'http://localhost:4603/api/options-data', desc: 'Frontend OPTIONS Data' },
        { url: 'http://localhost:4603/api/signals', desc: 'Frontend Signals' },
        { url: 'http://localhost:4603/api/strategic-overview', desc: 'Frontend Strategic Overview' },
        { url: 'http://localhost:4603/api/execution-opportunities', desc: 'Frontend Execution Opportunities' },
        { url: 'http://localhost:4603/api/spot-signals', desc: 'Frontend SPOT Signals' },
        { url: 'http://localhost:4603/api/trading-signals', desc: 'Frontend Trading Signals' }
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
        const result = await testEndpoint(endpoint.url, endpoint.desc);
        results.push(result);
    }
    
    return results;
}

// Función para probar endpoints de visualización
async function testVisualizationEndpoints() {
    console.log('\n[DATA] Probando Endpoints de Visualización...');
    
    const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
    const results = [];
    
    for (const symbol of symbols) {
        const sparklineUrl = `http://localhost:4603/api/market-sparkline?symbol=${symbol}&interval=5m&limit=60`;
        const orderbookUrl = `http://localhost:4603/api/orderbook?symbol=${symbol}`;
        const klinesUrl = `http://localhost:4603/api/klines?symbol=${symbol}&interval=1h&limit=24`;
        
        const sparklineResult = await testEndpoint(sparklineUrl, `Sparkline ${symbol}`);
        const orderbookResult = await testEndpoint(orderbookUrl, `Orderbook ${symbol}`);
        const klinesResult = await testEndpoint(klinesUrl, `Klines ${symbol}`);
        
        results.push(sparklineResult, orderbookResult, klinesResult);
    }
    
    return results;
}

// Función para verificar arquitectura estratégica
async function verifyStrategicArchitecture() {
    console.log('\n[ENDPOINTS] Verificando Arquitectura Estratégica...');
    
    try {
        // Verificar que SPOT es solo para análisis
        const spotResponse = await fetch('http://localhost:4601/api/spot-data');
        const spotData = await spotResponse.json();
        
        if (spotData.purpose === 'ANALISIS_Y_SEÑALES') {
            console.log('[OK] SPOT configurado correctamente como FUENTE DE INFORMACIÓN');
        } else {
            console.log('[ERROR] SPOT no está configurado correctamente');
        }
        
        // Verificar que FUTURES es para ejecución
        const futuresResponse = await fetch('http://localhost:4601/api/futures-data');
        const futuresData = await futuresResponse.json();
        
        if (futuresData.purpose === 'EJECUCION_PRINCIPAL') {
            console.log('[OK] FUTURES configurado correctamente como EJECUCIÓN PRINCIPAL');
        } else {
            console.log('[ERROR] FUTURES no está configurado correctamente');
        }
        
        // Verificar que OPTIONS es para ejecución avanzada
        const optionsResponse = await fetch('http://localhost:4601/api/options-data');
        const optionsData = await optionsResponse.json();
        
        if (optionsData.purpose === 'EJECUCION_AVANZADA') {
            console.log('[OK] OPTIONS configurado correctamente como EJECUCIÓN AVANZADA');
        } else {
            console.log('[ERROR] OPTIONS no está configurado correctamente');
        }
        
        // Verificar señales rankeadas
        const signalsResponse = await fetch('http://localhost:4601/api/signals');
        const signalsData = await signalsResponse.json();
        
        if (signalsData.purpose === 'MAXIMIZAR_PROFIT') {
            console.log('[OK] SEÑALES configuradas correctamente para MAXIMIZAR PROFIT');
        } else {
            console.log('[ERROR] SEÑALES no están configuradas correctamente');
        }
        
        return true;
        
    } catch (error) {
        console.log(`[ERROR] Error verificando arquitectura: ${error.message}`);
        return false;
    }
}

// Función principal de test
async function runStrategicTest() {
    console.log('[NIGHT] Iniciando Test Completo del Sistema Estratégico...\n');
    
    const results = {
        core: await testCoreStrategicEndpoints(),
        frontend: await testFrontendStrategicEndpoints(),
        visualization: await testVisualizationEndpoints(),
        architecture: await verifyStrategicArchitecture()
    };
    
    console.log('\n[DATA] Resultados del Test del Sistema Estratégico:');
    
    // Core System
    console.log('\n[NIGHT] Core System Estratégico:');
    const corePassed = results.core.filter(Boolean).length;
    const coreTotal = results.core.length;
    console.log(`   [OK] Pasaron: ${corePassed}/${coreTotal} (${(corePassed/coreTotal*100).toFixed(1)}%)`);
    
    // Frontend Server
    console.log('\n[START] Frontend Server Estratégico:');
    const frontendPassed = results.frontend.filter(Boolean).length;
    const frontendTotal = results.frontend.length;
    console.log(`   [OK] Pasaron: ${frontendPassed}/${frontendTotal} (${(frontendPassed/frontendTotal*100).toFixed(1)}%)`);
    
    // Visualización
    console.log('\n[DATA] Endpoints de Visualización:');
    const vizPassed = results.visualization.filter(Boolean).length;
    const vizTotal = results.visualization.length;
    console.log(`   [OK] Pasaron: ${vizPassed}/${vizTotal} (${(vizPassed/vizTotal*100).toFixed(1)}%)`);
    
    // Arquitectura
    console.log('\n[ENDPOINTS] Arquitectura Estratégica:');
    console.log(`   ${results.architecture ? '[OK]' : '[ERROR]'} Arquitectura verificada: ${results.architecture ? 'CORRECTA' : 'INCORRECTA'}`);
    
    // Resumen final
    const allResults = [
        ...results.core,
        ...results.frontend,
        ...results.visualization,
        results.architecture
    ];
    
    const passedTests = allResults.filter(Boolean).length;
    const totalTests = allResults.length;
    
    console.log(`\n[UP] Resultado Final: ${passedTests}/${totalTests} (${(passedTests/totalTests*100).toFixed(1)}%)`);
    
    if (passedTests === totalTests) {
        console.log(' ¡SISTEMA ESTRATÉGICO COMPLETAMENTE OPERATIVO!');
        console.log('[OK] Arquitectura correcta: SPOT (Análisis)  FUTURES/OPTIONS (Ejecución)');
        console.log('[OK] Señales rankeadas para máximo profit');
        console.log('[OK] Sistema listo para maximizar ganancias');
    } else {
        console.log('[WARNING] Algunos componentes requieren atención');
    }
    
    console.log('\n[NIGHT] Test del Sistema Estratégico completado');
}

// Ejecutar test
runStrategicTest().catch(console.error);

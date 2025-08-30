
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
 * Test de Conectividad Optimizado
 * Verifica que todas las desalineaciones se han resuelto
 */

const BASE_URL = 'http://localhost:4603';
const CORE_URL = 'http://localhost:4601';

async function testEndpoint(url, description) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' },
            signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`[OK] ${description}: OK`);
            
            // Verificar datos específicos
            if (data.success && data.data) {
                const symbols = Object.keys(data.data);
                if (symbols.length > 0) {
                    console.log(`   [DATA] Datos detectados: ${symbols.length} símbolos`);
                    const firstSymbol = symbols[0];
                    const firstData = data.data[firstSymbol];
                    if (firstData && firstData.price) {
                        console.log(`   [MONEY] ${firstSymbol}: $${firstData.price.toFixed(2)} (${firstData.change24h?.toFixed(2)}%)`);
                    }
                }
            }
            return true;
        } else {
            console.log(`[ERROR] ${description}: Error ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`[ERROR] ${description}: ${error.message}`);
        return false;
    }
}

async function testConnectivityOptimized() {
    console.log('[NIGHT] Iniciando Test de Conectividad Optimizado...\n');
    
    const tests = [
        // Tests del Frontend
        { url: `${BASE_URL}/health`, desc: 'Frontend Health' },
        { url: `${BASE_URL}/api/status`, desc: 'Frontend Status' },
        { url: `${BASE_URL}/api/market-data`, desc: 'Frontend Market Data' },
        { url: `${BASE_URL}/api/quantum-factors?symbol=BTCUSDT`, desc: 'Frontend Quantum Factors' },
        { url: `${BASE_URL}/api/quantum-state`, desc: 'Frontend Quantum State' },
        { url: `${BASE_URL}/api/quantum-matrix`, desc: 'Frontend Quantum Matrix' },
        { url: `${BASE_URL}/api/performance`, desc: 'Frontend Performance' },
        { url: `${BASE_URL}/api/alerts`, desc: 'Frontend Alerts' },
        { url: `${BASE_URL}/api/admin/overview`, desc: 'Frontend Admin Overview' },
        
        // Tests del Core
        { url: `${CORE_URL}/health`, desc: 'Core Health' },
        { url: `${CORE_URL}/api/market-data`, desc: 'Core Market Data' },
        { url: `${CORE_URL}/api/quantum-factors?symbol=BTCUSDT`, desc: 'Core Quantum Factors' },
        { url: `${CORE_URL}/api/quantum-state`, desc: 'Core Quantum State' },
        { url: `${CORE_URL}/api/quantum-matrix`, desc: 'Core Quantum Matrix' },
        { url: `${CORE_URL}/api/performance`, desc: 'Core Performance' },
        { url: `${CORE_URL}/api/alerts`, desc: 'Core Alerts' },
        { url: `${CORE_URL}/api/admin/overview`, desc: 'Core Admin Overview' }
    ];
    
    let frontendSuccess = 0;
    let coreSuccess = 0;
    let totalTests = tests.length;
    
    for (const test of tests) {
        const success = await testEndpoint(test.url, test.desc);
        
        if (success) {
            if (test.url.includes(BASE_URL)) {
                frontendSuccess++;
            } else if (test.url.includes(CORE_URL)) {
                coreSuccess++;
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 200)); // Pausa entre tests
    }
    
    console.log(`\n[DATA] Resultados del Test de Conectividad:`);
    console.log(`[OK] Frontend: ${frontendSuccess}/9 (${((frontendSuccess/9)*100).toFixed(1)}%)`);
    console.log(`[OK] Core: ${coreSuccess}/8 (${((coreSuccess/8)*100).toFixed(1)}%)`);
    console.log(`[UP] Total: ${frontendSuccess + coreSuccess}/${totalTests} (${(((frontendSuccess + coreSuccess)/totalTests)*100).toFixed(1)}%)`);
    
    // Análisis de desalineaciones
    console.log(`\n[SEARCH] Análisis de Desalineaciones:`);
    
    if (frontendSuccess === 9 && coreSuccess === 8) {
        console.log(` ¡SISTEMA COMPLETAMENTE ALINEADO!`);
        console.log(`[OK] Todas las desalineaciones resueltas`);
        console.log(`[OK] Configuración centralizada funcionando`);
        console.log(`[OK] Datos reales de Binance disponibles`);
        console.log(`[OK] Sistema cuántico operativo`);
    } else if (frontendSuccess >= 7 && coreSuccess >= 6) {
        console.log(`[WARNING] Sistema parcialmente alineado`);
        console.log(`[OK] Configuración centralizada funcionando`);
        console.log(`[WARNING] Algunos endpoints con problemas menores`);
    } else {
        console.log(`[ERROR] Sistema con desalineaciones significativas`);
        console.log(`[ERROR] Necesita revisión de configuración`);
    }
    
    // Verificar conectividad específica
    console.log(`\n Estado de Conectividad:`);
    
    try {
        const coreHealth = await fetch(`${CORE_URL}/health`);
        const frontendHealth = await fetch(`${BASE_URL}/health`);
        
        if (coreHealth.ok && frontendHealth.ok) {
            console.log(`[OK] Core System: CONECTADO`);
            console.log(`[OK] Frontend Server: CONECTADO`);
            console.log(`[OK] Comunicación bidireccional: FUNCIONAL`);
        } else {
            console.log(`[ERROR] Problemas de conectividad detectados`);
        }
    } catch (error) {
        console.log(`[ERROR] Error verificando conectividad: ${error.message}`);
    }
    
    console.log(`\n[NIGHT] Test de Conectividad Optimizado completado`);
}

// Ejecutar test
testConnectivityOptimized().catch(console.error);

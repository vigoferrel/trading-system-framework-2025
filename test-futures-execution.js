
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

/**
 * Test final para verificar la ejecución de futuros con balance corregido
 */

const QuantumBinanceSystem = require('./quantum-binance-system');

async function testFuturesExecution() {
    console.log('[START] Testing Futures Execution with Corrected Balance...\n');
    
    try {
        // Crear sistema en modo unified
        const system = new QuantumBinanceSystem({
            binance: {
                tradeMode: 'unified',
                testnet: false // Usar real para probar balance real
            }
        });
        
        console.log('[OK] System initialized');
        console.log(`[LIST] Has valid API keys: ${system.hasValidApiKeys()}`);
        console.log(`[TEST] Is testnet mode: ${system.isTestnetMode()}`);
        
        // Forzar actualización de balance (limpiar caché)
        console.log('\n[MONEY] Getting fresh account balance...');
        const balance = await system.getAccountBalance(true); // forceUpdate = true
        
        if (balance.__detail) {
            const detail = balance.__detail;
            console.log(`[DATA] EAPI Available: ${detail.eapiUSDT || 0} USDT`);
            console.log(`[UP] FAPI Available: ${detail.fapiUSDT || 0} USDT`);
            console.log(`[DIAMOND] Total Available: ${detail.availableTotal || 0} USDT`);
            console.log(` Total Equity: ${detail.equityTotal || 0} USDT`);
            
            // Verificar si FAPI balance es detectado
            if (detail.fapiUSDT > 0) {
                console.log('\n[OK] SUCCESS: FAPI balance detected!');
                console.log(`[START] Ready for futures trading with ${detail.fapiUSDT} USDT`);
                
                // Test futures signal execution
                console.log('\n[TEST] Testing futures signal execution...');
                
                const testSignal = {
                    symbol: 'ETH',
                    score: 0.75,
                    strategy: 'momentum_trading',
                    direction: 'BUY',
                    confidence: 0.8,
                    timestamp: Date.now()
                };
                
                console.log('[DATA] Test signal:', testSignal);
                
                // Ejecutar señal de futuros
                const result = await system.executeFuturesSignal(testSignal);
                
                if (result) {
                    console.log('\n FUTURES EXECUTION SUCCESS!');
                    console.log(`[UP] Position: ${result.quantity} ${result.symbol} @ ${result.entryPrice}`);
                    console.log(`[MONEY] Side: ${result.side}`);
                    console.log(` Simulated: ${result.simulated || false}`);
                    console.log(` Confidence: ${(result.confidence * 100).toFixed(1)}%`);
                } else {
                    console.log('\n[ERROR] Futures execution returned null');
                }
                
            } else {
                console.log('\n[ERROR] ISSUE: FAPI balance still showing 0');
                console.log('[SEARCH] Check if futures account has funds or API permissions');
            }
        } else {
            console.log('\n[ERROR] No balance detail found');
        }
        
    } catch (error) {
        console.error('[ERROR] Test failed:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Run test
if (require.main === module) {
    testFuturesExecution().catch(console.error);
}

module.exports = { testFuturesExecution };
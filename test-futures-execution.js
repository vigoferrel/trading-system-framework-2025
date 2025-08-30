
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
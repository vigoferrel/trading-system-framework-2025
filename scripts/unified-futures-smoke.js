
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

'use strict';

const QuantumBinanceSystem = require('../bot-opciones/quantum-binance-system');

async function main() {
  console.log('[SMOKE] Unified futures smoke test starting...');
  try {
    // Force simulation: empty API keys and testnet=true
    const system = new QuantumBinanceSystem({
      binance: {
        apiKey: '',
        apiSecret: '',
        tradeMode: 'unified',
        testnet: true
      },
      trading: {
        maxPositions: 1,
        defaultPositionSize: 1,
        simulationMaxHoldMs: 8000,
        adaptiveHoldEnabled: false
      }
    });

    // Inject simulated balances so unified path selects futures first
    system.getAccountBalance = async function() {
      const balances = {
        USDT: { asset: 'USDT', free: 600, total: 600 },
        __detail: { eapiUSDT: 100, fapiUSDT: 500 }
      };
      console.log(`[SMOKE] Injected balances: EAPI=${balances.__detail.eapiUSDT} FAPI=${balances.__detail.fapiUSDT} Total=${balances.USDT.total}`);
      return balances;
    };

    const signal = {
      symbol: 'ETH',
      strategy: 'momentum_trading',
      direction: 'BUY',
      score: 0.36,
      confidence: 0.6,
      timestamp: Date.now()
    };

    console.log('[SMOKE] Executing unified trading signal (expect futures branch first)...');
    const res = await system.executeTradingSignal(signal);
    const usedFutures = !!(res && res.isFutures);
    console.log('[SMOKE] Execution result:', JSON.stringify(res, null, 2));
    console.log(`[SMOKE] Futures branch triggered = ${usedFutures}`);

    // Exercise lifecycle briefly
    await new Promise(r => setTimeout(r, 1500));
    await system.manageActivePositions();

    console.log('[SMOKE] Done.');
    process.exit(usedFutures ? 0 : 2);
  } catch (e) {
    console.error('[SMOKE] Error:', e?.message || e);
    process.exit(1);
  }
}

main();
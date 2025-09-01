
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
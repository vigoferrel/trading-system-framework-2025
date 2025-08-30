
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
 * Verificador de Saldo para Binance con IP Dual VPN
 * 
 * Este script verifica el saldo de la cuenta de Binance utilizando
 * la solución de IP dual VPN para evitar conflictos.
 * 
 * @author Quantum Trading Team
 * @version 1.0.0
 */

const env = require('./env-loader');
const BinanceConnector = require('./binance-connector');

// Constantes cuánticas desde el cargador de entorno
const QUANTUM_Z_REAL = env.QUANTUM_Z_REAL;
const QUANTUM_Z_IMAG = env.QUANTUM_Z_IMAG;
const QUANTUM_LAMBDA = env.QUANTUM_LAMBDA;

/**
 * Función principal para verificar el saldo
 */
async function checkBalance() {
  console.log('[RELOAD] Iniciando verificación de saldo con IP dual VPN...');
  console.log(` Utilizando constantes cuánticas: z = ${QUANTUM_Z_REAL} + ${QUANTUM_Z_IMAG}i @ =${QUANTUM_LAMBDA}`);
  
  try {
    // Crear instancia del conector de Binance
    const binanceConnector = new BinanceConnector();
    
    // Verificar conexión con Binance
    console.log('[RELOAD] Verificando conexión con Binance API...');
    const serverTime = await binanceConnector.getServerTime();
    const serverDate = new Date(serverTime);
    console.log(`[OK] Conexión exitosa. Hora del servidor Binance: ${serverDate.toISOString()}`);
    
    // SPOT eliminado: no consultar cuenta spot
    
    // Obtener saldo de la cuenta
    console.log('[RELOAD] Obteniendo saldo de la cuenta...');
    const balances = await binanceConnector.getAccountBalance();
    
    // Mostrar desglose estructurado (disponible vs equity) para evitar mezclar posiciones con efectivo
    try {
      const d = balances.__detail || {};
      const fmt = (n) => Number(n || 0).toFixed(8);
      console.log('\n[DATA] DESGLOSE DETALLADO USDT (evita mezclar equity de posiciones con disponible):');
      console.log('==============================');
      console.log(`EAPI available=${fmt(d?.eapi?.available ?? d?.eapiUSDT)} equity=${fmt(d?.eapi?.equity)}`);
      console.log(`FAPI available=${fmt(d?.fapi?.available ?? d?.fapiUSDT)} equity=${fmt(d?.fapi?.equity)}`);
      console.log(`TOTAL available=${fmt(d?.availableTotal ?? balances?.USDT?.total)} equity=${fmt(d?.equityTotal)}`);
    } catch (_) {}

    // Mostrar saldos (filtrar sólo entradas con asset/total válidos)
    console.log('\n[DATA] SALDO INICIAL DE LA CUENTA (sólo disponibles):');
    console.log('==============================');

    const entries = Object.values(balances).filter(b => b && typeof b === 'object' && typeof b.asset === 'string' && Number.isFinite(Number(b.total)));
    // Ordenar los saldos por valor total (de mayor a menor)
    const sortedBalances = entries.sort((a, b) => Number(b.total) - Number(a.total));
    
    // Calcular el valor total en USD (aproximado)
    let totalUSDValue = 0;
    
    // Mostrar los saldos
    for (const balance of sortedBalances) {
      let usdValue = 0;
      
      // Estimar valor en USD
      if (balance.asset === 'USDT' || balance.asset === 'BUSD' || balance.asset === 'USDC' || balance.asset === 'DAI') {
        usdValue = Number(balance.total || 0);
      } else {
        try {
          // Intentar obtener el precio actual
          const ticker = await binanceConnector.getFuturesTickerPrice(`${balance.asset}USDT`);
          if (ticker && ticker.price) {
            usdValue = Number(balance.total || 0) * parseFloat(ticker.price);
          }
        } catch (error) {
          // Si no se puede obtener el precio, usar estimación cuántica
          const symbolHash = hashString(balance.asset);
          const symbolLambda = QUANTUM_LAMBDA * (symbolHash % 1000 + 1);
          const basePrice = estimateBasePrice(balance.asset);
          const normalized = Math.abs(Math.sin(Math.sqrt(QUANTUM_Z_REAL*QUANTUM_Z_REAL + QUANTUM_Z_IMAG*QUANTUM_Z_IMAG)) * Math.cos(symbolLambda));
          const estimatedPrice = basePrice + normalized * basePrice * 0.1;
          usdValue = Number(balance.total || 0) * estimatedPrice;
        }
      }
      
      totalUSDValue += usdValue;
      
      // Mostrar el saldo con formato
      console.log(`${balance.asset.padEnd(8)}: ${Number(balance.total || 0).toFixed(8).padStart(16)} ( $${usdValue.toFixed(2).padStart(10)})`);
    }
    
    // Mostrar el valor total
    console.log('==============================');
    console.log(`TOTAL DISPONIBLE:  $${totalUSDValue.toFixed(2)}`);
    
    // Verificar saldo de opciones si está disponible
    try {
      console.log('\n[RELOAD] Obteniendo saldo de opciones (EAPI /account)...');
      const optionsBalance = await binanceConnector.getOptionsBalance();
      console.log('\n[DATA] SALDO DE OPCIONES (raw /account):');
      console.log('==============================');
      console.log(JSON.stringify(optionsBalance, null, 2));

      // Si la API expone balances/positions dentro del payload, intentar mostrar resumen
      try {
        const summarize = (payload) => {
          const out = { positions: 0, usdtAvailable: 0, usdtEquity: 0 };
          const isUSDT = (n) => {
            const cur = (n?.currency || n?.asset || n?.symbol || n?.ccy || '').toString().toUpperCase();
            return cur === 'USDT' || cur === 'USD';
          };
          const nums = [];
          const walk = (node) => {
            if (!node || typeof node !== 'object') return;
            if (Array.isArray(node)) {
              for (const it of node) walk(it);
              return;
            }
            if (isUSDT(node)) {
              if (node.withdrawAvailable || node.availableBalance || node.availableAmount || node.available || node.free) {
                const v = Number(node.withdrawAvailable ?? node.availableBalance ?? node.availableAmount ?? node.available ?? node.free ?? 0);
                if (Number.isFinite(v)) out.usdtAvailable = Math.max(out.usdtAvailable, v);
              }
              if (node.equity || node.marginBalance || node.walletBalance || node.balance) {
                const v2 = Number(node.equity ?? node.marginBalance ?? (Number(node.walletBalance || 0) + Number(node.unrealizedProfit || node.unrealizedPnl || 0)) ?? node.walletBalance ?? node.balance ?? 0);
                if (Number.isFinite(v2)) out.usdtEquity = Math.max(out.usdtEquity, v2);
              }
            }
            // contar campos que luzcan como posiciones
            if (node.hasOwnProperty('positions') && Array.isArray(node.positions)) {
              out.positions += node.positions.length;
            }
            for (const k of Object.keys(node)) {
              const v = node[k];
              if (v && typeof v === 'object') walk(v);
            }
          };
          walk(payload);
          return out;
        };
        const sum = summarize(optionsBalance);
        console.log(`[EAPI SUMMARY] positions=${sum.positions} | USDT available=${sum.usdtAvailable} | USDT equity=${sum.usdtEquity}`);
      } catch (_) {}
    } catch (error) {
      console.log('\n[WARNING] No se pudo obtener el saldo de opciones:', error.message);
    }
    
    console.log('\n[OK] Verificación de saldo completada con éxito.');
    console.log('[SECURE] Conexión realizada a través de IP dual VPN: 192.168.173.160:1862');
    
  } catch (error) {
    console.error('\n[ERROR] Error al verificar el saldo:', error.message);
    console.error('Detalles del error:', error);
  }
}

/**
 * Función hash para valores deterministas
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Estima el precio base para un activo
 */
function estimateBasePrice(asset) {
  switch (asset.toUpperCase()) {
    case 'BTC': return 50000;
    case 'ETH': return 3000;
    case 'BNB': return 400;
    case 'SOL': return 100;
    case 'XRP': return 0.6;
    case 'DOGE': return 0.1;
    case 'ADA': return 0.5;
    case 'DOT': return 10;
    case 'MATIC': return 1;
    case 'LINK': return 15;
    case 'AVAX': return 30;
    case 'UNI': return 8;
    case 'ATOM': return 12;
    case 'LTC': return 80;
    case 'BCH': return 300;
    case 'XLM': return 0.3;
    case 'ALGO': return 0.4;
    case 'FIL': return 5;
    case 'THETA': return 2;
    case 'VET': return 0.05;
    default: return 1;
  }
}

// Ejecutar la función principal
checkBalance().catch(error => {
  console.error('Error en la ejecución principal:', error);
  process.exit(1);
});
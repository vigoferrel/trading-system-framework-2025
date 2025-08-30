
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

// Consulta de balances en Binance Futures (UM) y Options (EAPI) con firma HMAC,
// sincronización de tiempo de servidor y actualización de .env con allocation.

/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const dotenv = require('dotenv');

const ENV_PATH = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: ENV_PATH });

const API_KEY = process.env.BINANCE_API_KEY || '';
const API_SECRET = process.env.BINANCE_API_SECRET || '';
if (!API_KEY || !API_SECRET) {
  console.error('Faltan BINANCE_API_KEY o BINANCE_API_SECRET en bot-opciones/.env');
  process.exit(1);
}

function httpsGetJson(fullUrl, headers = {}) {
  const urlObj = new URL(fullUrl);
  return new Promise((resolve, reject) => {
    const baseHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) QuantumBot/1.0',
      'Accept': 'application/json,text/plain,*/*',
      'Connection': 'keep-alive'
    };
    const merged = { ...baseHeaders, ...headers };
    const req = https.request(
      {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: merged,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data || '{}');
            resolve(json);
          } catch (e) {
            reject(new Error(`Respuesta no JSON desde ${fullUrl}: ${e.message} | data=${data}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function getServerTime(base, ep) {
  try {
    const j = await httpsGetJson(`${base}${ep}`);
    return j.serverTime || Date.now();
  } catch (_) {
    return Date.now();
  }
}

function sign(query, secret) {
  return crypto.createHmac('sha256', secret).update(query).digest('hex');
}

async function signedGet(base, timeEp, ep) {
  const ts = await getServerTime(base, timeEp);
  const qs = `timestamp=${ts}&recvWindow=5000`;
  const sig = sign(qs, API_SECRET);
  const full = `${base}${ep}?${qs}&signature=${sig}`;
  return httpsGetJson(full, { 'X-MBX-APIKEY': API_KEY });
}

async function main() {
  const fapi = 'https://fapi.binance.com';
  const eapi = 'https://eapi.binance.com';
  let futuresAvail = 0;
  let optionsAvail = 0;

  try {
    const fAcc = await signedGet(fapi, '/fapi/v1/time', '/fapi/v2/account');
    if (fAcc && typeof fAcc.availableBalance !== 'undefined') {
      futuresAvail = parseFloat(fAcc.availableBalance) || 0;
    } else if (fAcc && Array.isArray(fAcc.assets)) {
      const usdt = fAcc.assets.find((a) => a.asset === 'USDT');
      if (usdt) futuresAvail = parseFloat(usdt.availableBalance) || 0;
    }
    // Persistir respuesta cruda para debug
    try {
      const logsDir = path.resolve(__dirname, '..', 'logs');
      if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
      fs.writeFileSync(path.join(logsDir, 'fapi-account-latest.json'), JSON.stringify(fAcc, null, 2), 'utf8');
    } catch {}
  } catch (e) {
    console.error('Error leyendo Futures:', e.message);
  }

  try {
    const oAcc = await signedGet(eapi, '/eapi/v1/time', '/eapi/v1/account');
    if (oAcc) {
      // Campos comunes
      const candidates = [
        oAcc.availableBalance,
        oAcc.totalAvailableBalance,
        oAcc.cashBalance,
        oAcc.equity,
        oAcc?.data?.availableBalance,
        oAcc?.accountInfo?.accountBalance
      ];
      for (const v of candidates) {
        const num = parseFloat(v);
        if (!Number.isNaN(num) && num > 0) { optionsAvail = Math.max(optionsAvail, num); }
      }
      // Nuevo: formato de cuenta con arreglo 'asset' [{ asset:'USDT', available:'151', equity:'...', ... }]
      if (Array.isArray(oAcc.asset)) {
        const usdtRow = oAcc.asset.find(x => (x.asset || '').toUpperCase() === 'USDT') || oAcc.asset[0];
        if (usdtRow) {
          const availFields = [usdtRow.available, usdtRow.marginBalance, usdtRow.equity];
          for (const v of availFields) {
            const num = parseFloat(v);
            if (!Number.isNaN(num) && num > 0) { optionsAvail = Math.max(optionsAvail, num); }
          }
        }
      }
    }
    // Persistir respuesta cruda para debug
    try {
      const logsDir = path.resolve(__dirname, '..', 'logs');
      if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
      fs.writeFileSync(path.join(logsDir, 'eapi-account-latest.json'), JSON.stringify(oAcc || {}, null, 2), 'utf8');
    } catch {}
  } catch (e) {
    // Silencioso si EAPI devuelve HTML (página de error); mantenemos 0
  }

  futuresAvail = Math.round(futuresAvail * 100) / 100;
  optionsAvail = Math.round(optionsAvail * 100) / 100;

  // Fuente de allocation: futures | options | combined
  const allocateFrom = (process.env.ALLOCATION_SOURCE || 'futures').toLowerCase();
  const basis = allocateFrom === 'options'
    ? optionsAvail
    : allocateFrom === 'combined'
      ? (futuresAvail + optionsAvail)
      : futuresAvail;
  const source = allocateFrom === 'options' ? 'Options' : (allocateFrom === 'combined' ? 'Combined' : 'Futures');
  const allocation = Math.max(0, Math.floor(basis * 0.9));
  const capPer = Math.min(30, Math.max(10, Math.floor(Math.max(allocation, 100) / 20)));

  // Persistir en .env
  try {
    let envTxt = '';
    if (fs.existsSync(ENV_PATH)) envTxt = fs.readFileSync(ENV_PATH, 'utf8');
    const upsert = (text, key, val) => {
      const re = new RegExp(`^\\s*${key}\\s*=.*$`, 'm');
      if (re.test(text)) return text.replace(re, `${key}=${val}`);
      return `${text.trim()}\n${key}=${val}\n`;
    };
    envTxt = upsert(envTxt, 'BINANCE_TESTNET', 'false');
    envTxt = upsert(envTxt, 'PORTFOLIO_CAPITAL_USD', String(allocation));
    envTxt = upsert(envTxt, 'CAPITAL_PER_TRADE_USD', String(capPer));
    envTxt = upsert(envTxt, 'PORTFOLIO_OBJECTIVE', 'profit');
    envTxt = upsert(envTxt, 'FUTURES_AVAILABLE_USDT', String(futuresAvail));
    envTxt = upsert(envTxt, 'OPTIONS_AVAILABLE_USDT', String(optionsAvail));
    envTxt = upsert(envTxt, 'ALLOCATION_SOURCE', source.toLowerCase());
    fs.writeFileSync(ENV_PATH, envTxt, 'utf8');
  } catch (e) {
    console.error('No se pudo actualizar .env:', e.message);
  }

  // Log resumen
  const logsDir = path.resolve(__dirname, '..', 'logs');
  try { if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true }); } catch {}
  const summary = `Futures USDT available=${futuresAvail} | Options USDT available=${optionsAvail}\nAllocation source: ${source} | Allocation(90%)=${allocation} | CAPITAL_PER_TRADE_USD=${capPer}`;
  fs.writeFileSync(path.join(logsDir, 'allocation-latest.txt'), summary, 'utf8');

  console.log(JSON.stringify({ futuresAvail, optionsAvail, source, allocation, capitalPerTradeUSD: capPer }, null, 2));
}

main().catch((e) => {
  console.error('Error general:', e.message);
  process.exit(1);
});



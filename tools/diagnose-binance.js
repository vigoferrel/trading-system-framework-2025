
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

/* eslint-disable no-console */
// Diagnóstico de conexión a Binance Futures (UM) y Options (EAPI)
// - Muestra IP pública actual
// - Llama endpoints firmados /fapi/v2/account y /eapi/v1/account
// - Imprime statusCode y cuerpo crudo de respuesta (o error)

const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const ENV_PATH = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: ENV_PATH });

const API_KEY = process.env.BINANCE_API_KEY || '';
const API_SECRET = process.env.BINANCE_API_SECRET || '';

function httpGetRaw(url, headers = {}, timeoutMs = 12000) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: 'GET',
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          resolve({ ok: true, status: res.statusCode, body: data });
        });
      }
    );
    req.on('timeout', () => {
      req.destroy(new Error('timeout'));
    });
    req.on('error', (err) => {
      resolve({ ok: false, status: 0, body: String(err && err.message ? err.message : err) });
    });
    req.setTimeout(timeoutMs);
    req.end();
  });
}

async function getPublicIP() {
  try {
    const r = await httpGetRaw('https://api.ipify.org');
    if (r.ok) return r.body.trim();
  } catch {}
  return '';
}

async function getServerTime(base, ep) {
  const r = await httpGetRaw(base + ep);
  try {
    const j = JSON.parse(r.body || '{}');
    return j.serverTime || Date.now();
  } catch (_) {
    return Date.now();
  }
}

function sign(qs, secret) {
  return crypto.createHmac('sha256', secret).update(qs).digest('hex');
}

async function signedGet(base, timeEp, ep) {
  const ts = await getServerTime(base, timeEp);
  const qs = `timestamp=${ts}&recvWindow=60000`;
  const sig = sign(qs, API_SECRET);
  const url = `${base}${ep}?${qs}&signature=${sig}`;
  return httpGetRaw(url, { 'X-MBX-APIKEY': API_KEY });
}

async function main() {
  if (!API_KEY || !API_SECRET) {
    console.error('[ERROR] Faltan BINANCE_API_KEY o BINANCE_API_SECRET en bot-opciones/.env');
    process.exit(1);
  }
  const publicIp = await getPublicIP();
  const futures = await signedGet('https://fapi.binance.com', '/fapi/v1/time', '/fapi/v2/account');
  const options = await signedGet('https://eapi.binance.com', '/eapi/v1/time', '/eapi/v1/account');

  const out = {
    publicIp,
    futures,
    options,
  };

  // Persistir a logs para consulta
  try {
    const logsDir = path.resolve(__dirname, '..', 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
    fs.writeFileSync(path.join(logsDir, 'diagnose-binance.json'), JSON.stringify(out, null, 2), 'utf8');
  } catch {}

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error('Error diagnóstico:', e.message);
  process.exit(1);
});



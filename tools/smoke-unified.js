
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
 * Unified Monouser Smoke Tests
 * - Verifica endpoints Core (4601) y Frontend API (4602)
 * - Futuros habilitado, modo unified, auto-exec, ensemble y métricas
 *
 * Uso:
 *   node tools/smoke-unified.js
 */

const http = require('http');

const CFG = {
  corePort: Number(process.env.BOT_OPCIONES_PORT || 4601),
  fePort: Number(process.env.PORT || 4602),
  timeoutMs: 4000
};

function fetchJson(host, port, path, timeoutMs = CFG.timeoutMs) {
  return new Promise((resolve) => {
    const req = http.request(
      { hostname: host, port, path, method: 'GET', timeout: timeoutMs, headers: { 'Accept': 'application/json' } },
      (res) => {
        let buf = '';
        res.on('data', (d) => (buf += d));
        res.on('end', () => {
          try {
            const j = JSON.parse(buf || '{}');
            resolve({ ok: true, status: res.statusCode, data: j });
          } catch (_) {
            resolve({ ok: false, status: res.statusCode, error: 'Invalid JSON', raw: buf });
          }
        });
      }
    );
    req.on('timeout', () => {
      try { req.destroy(); } catch(_) {}
      resolve({ ok: false, error: 'Timeout' });
    });
    req.on('error', (e) => resolve({ ok: false, error: e.message || String(e) }));
    req.end();
  });
}

async function runCoreTests() {
  const base = `http://localhost:${CFG.corePort}`;
  const tests = [
    { name: 'core.health', path: '/health' },
    { name: 'core.futures.health', path: '/futures/health' },
    { name: 'core.unified.overview', path: '/unified/overview' },
    { name: 'core.unified.autoexec.status', path: '/unified/auto-exec/status' },
    { name: 'core.ensemble.config', path: '/ensemble/config' },
    { name: 'core.performance', path: '/performance' },
    { name: 'core.metrics', path: '/metrics' },
  ];
  console.log(`\n=== Core Smoke @ ${base} ===`);
  const results = [];
  for (const t of tests) {
    const r = await fetchJson('localhost', CFG.corePort, t.path);
    const ok = !!(r.ok && (r.status >= 200 && r.status < 300));
    console.log(`${ok ? '[OK]' : '[ERROR]'} ${t.name} -> status=${r.status || '-'} ${r.ok ? '' : `err=${r.error || ''}`}`);
    if (!ok && r.raw) {
      console.log(`raw: ${String(r.raw).slice(0, 200)}`);
    }
    results.push({ ...t, ok, status: r.status || 0, error: r.error || null });
  }
  // Validaciones rápidas
  const summary = {
    health: results.find(x => x.name === 'core.health')?.ok || false,
    futures: results.find(x => x.name === 'core.futures.health')?.ok || false,
    unified: results.find(x => x.name === 'core.unified.overview')?.ok || false,
    autoexec: results.find(x => x.name === 'core.unified.autoexec.status')?.ok || false,
    ensemble: results.find(x => x.name === 'core.ensemble.config')?.ok || false,
  };
  console.log('Core summary:', summary);
  return { base, results, summary };
}

async function runFrontendTests() {
  const base = `http://localhost:${CFG.fePort}`;
  const tests = [
    { name: 'fe.health', path: '/health', timeout: CFG.timeoutMs },
    { name: 'fe.status', path: '/api/status', timeout: CFG.timeoutMs },
    // dashboard puede tardar más por agregación; dar margen extra
    { name: 'fe.dashboard', path: '/api/dashboard', timeout: 10000 },
    { name: 'fe.oracle.status', path: '/api/oracle/status', timeout: CFG.timeoutMs },
    { name: 'fe.signals', path: '/api/trading-signals', timeout: CFG.timeoutMs },
  ];
  console.log(`\n=== Frontend API Smoke @ ${base} ===`);
  const results = [];
  for (const t of tests) {
    const r = await fetchJson('localhost', CFG.fePort, t.path, t.timeout);
    const ok = !!(r.ok && (r.status >= 200 && r.status < 300));
    console.log(`${ok ? '[OK]' : '[ERROR]'} ${t.name} -> status=${r.status || '-'} ${r.ok ? '' : `err=${r.error || ''}`}`);
    if (!ok && r.raw) {
      console.log(`raw: ${String(r.raw).slice(0, 200)}`);
    }
    results.push({ ...t, ok, status: r.status || 0, error: r.error || null });
  }
  const summary = {
    health: results.find(x => x.name === 'fe.health')?.ok || false,
    dashboard: results.find(x => x.name === 'fe.dashboard')?.ok || false,
    oracle: results.find(x => x.name === 'fe.oracle.status')?.ok || false
  };
  console.log('Frontend summary:', summary);
  return { base, results, summary };
}

async function main() {
  console.log('Running Unified Monouser Smoke Tests...');
  const core = await runCoreTests();
  const fe = await runFrontendTests();

  const total = core.results.length + fe.results.length;
  const passed = [...core.results, ...fe.results].filter(r => r.ok).length;
  const failed = total - passed;

  console.log('\n=== Results ===');
  console.log(`Total: ${total}, Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error('Smoke tests error:', e);
  process.exitCode = 2;
});
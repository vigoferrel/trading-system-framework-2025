
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

const http = require('http');

async function start() {
  const port = parseInt(process.env.COORDINATOR_PORT || '3000', 10);
  const startTime = Date.now();

  const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (method === 'OPTIONS') {
      res.writeHead(200, headers);
      res.end();
      return;
    }

    if (url === '/health') {
      const body = JSON.stringify({ status: 'ok', service: 'Coordinator' });
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(body);
      res.writeHead(200, headers);
      res.end(body);
      return;
    }

    if (url === '/info') {
      const body = JSON.stringify({
        service: 'Coordinator',
        version: '1.0.0',
        uptime: Date.now() - startTime,
        port: port,
        endpoints: ['/health', '/info', '/metrics']
      });
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(body);
      res.writeHead(200, headers);
      res.end(body);
      return;
    }

    if (url === '/metrics') {
      const body = JSON.stringify({
        uptime: Date.now() - startTime,
        memory: process.memoryUsage(),
        pid: process.pid
      });
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(body);
      res.writeHead(200, headers);
      res.end(body);
      return;
    }

    res.writeHead(404, headers);
    res.end(JSON.stringify({ error: 'Not Found' }));
  });

  await new Promise((resolve) => server.listen(port, resolve));
}

module.exports = { start };



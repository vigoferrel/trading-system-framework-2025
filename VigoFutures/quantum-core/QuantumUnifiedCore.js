
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
const crypto = require('crypto');

/**
 * Implementación mínima sin dependencias externas:
 * - HTTP: /health responde JSON
 * - WS: handshake y eco usando protocolo WebSocket nativo
 */
class QuantumUnifiedCore {
  constructor() {
    this.server = null;
    this.wsClients = new Set();
  }

  async start(port) {
    this.server = http.createServer((req, res) => {
      if (req.url === '/health') {
        const body = JSON.stringify({ status: 'ok', service: 'QuantumUnifiedCore' });
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        });
        res.end(body);
        return;
      }
      res.writeHead(404);
      res.end('Not Found');
    });

    // WebSocket handshake manual en ruta /ws
    this.server.on('upgrade', (req, socket) => {
      if (!req.url || !req.url.startsWith('/ws')) {
        socket.destroy();
        return;
      }
      const key = req.headers['sec-websocket-key'];
      const accept = generateWebSocketAcceptKey(key);
      const responseHeaders = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${accept}`
      ];
      socket.write(responseHeaders.concat('\r\n').join('\r\n'));

      this.wsClients.add(socket);
      socket.on('data', (buffer) => {
        const message = decodeWebSocketFrame(buffer);
        if (message !== null) {
          const payload = JSON.stringify({ type: 'echo', data: message });
          socket.write(encodeWebSocketFrame(payload));
        }
      });
      socket.on('close', () => this.wsClients.delete(socket));
      socket.on('end', () => this.wsClients.delete(socket));

      // mensaje de bienvenida
      socket.write(encodeWebSocketFrame(JSON.stringify({ type: 'welcome', message: 'WS conectado a QuantumUnifiedCore' })));
    });

    await new Promise((resolve) => this.server.listen(port, resolve));
  }
}

function generateWebSocketAcceptKey(secWebSocketKey) {
  return crypto
    .createHash('sha1')
    .update(secWebSocketKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
    .digest('base64');
}

function encodeWebSocketFrame(data) {
  const json = Buffer.from(data);
  const frame = [];
  frame.push(0x81); // FIN + text frame
  if (json.length < 126) {
    frame.push(json.length);
  } else if (json.length < 65536) {
    frame.push(126, (json.length >> 8) & 255, json.length & 255);
  } else {
    // long payload not expected here
    frame.push(127, 0, 0, 0, 0, (json.length >> 24) & 255, (json.length >> 16) & 255, (json.length >> 8) & 255, json.length & 255);
  }
  return Buffer.concat([Buffer.from(frame), json]);
}

function decodeWebSocketFrame(buffer) {
  if (buffer.length < 2) return null;
  const secondByte = buffer[1];
  const isMasked = (secondByte & 0x80) === 0x80;
  let payloadLength = secondByte & 0x7f;
  let offset = 2;
  if (payloadLength === 126) {
    if (buffer.length < 4) return null;
    payloadLength = buffer.readUInt16BE(2);
    offset = 4;
  } else if (payloadLength === 127) {
    // not handling > 2^32 for simplicity
    if (buffer.length < 10) return null;
    payloadLength = buffer.readUInt32BE(6);
    offset = 10;
  }
  let maskingKey;
  if (isMasked) {
    maskingKey = buffer.slice(offset, offset + 4);
    offset += 4;
  }
  let payload = buffer.slice(offset, offset + payloadLength);
  if (isMasked && maskingKey) {
    for (let i = 0; i < payload.length; i += 1) {
      payload[i] ^= maskingKey[i % 4];
    }
  }
  return payload.toString('utf8');
}

module.exports = { QuantumUnifiedCore };



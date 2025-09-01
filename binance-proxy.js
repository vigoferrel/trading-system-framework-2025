
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
 * [NIGHT] PROXY FUNCIONAL PARA BINANCE API
 * 
 * Proxy optimizado que redirige llamadas a Binance API sin problemas
 */

const http = require('http');
const https = require('https');
const url = require('url');

const PROXY_PORT = 8080;

function createProxyServer() {
    const server = http.createServer((req, res) => {
        console.log(`[NIGHT] Proxy: ${req.method} ${req.url}`);
        
        // Parsear la URL
        const parsedUrl = url.parse(req.url);
        const path = parsedUrl.path;
        
        // Determinar qué API de Binance usar basado en la ruta
        let binanceApi = 'api.binance.com';
        let binancePath = path;
        
        if (path.includes('/fapi/')) {
            binanceApi = 'fapi.binance.com';
            binancePath = path.replace('/fapi/', '/');
        } else if (path.includes('/eapi/')) {
            binanceApi = 'eapi.binance.com';
            binancePath = path.replace('/eapi/', '/');
        } else if (path.includes('/dapi/')) {
            binanceApi = 'dapi.binance.com';
            binancePath = path.replace('/dapi/', '/');
        }
        
        console.log(` Redirigiendo a: ${binanceApi}${binancePath}`);
        
        // Configurar opciones para la llamada a Binance
        const options = {
            hostname: binanceApi,
            port: 443,
            path: binancePath + (parsedUrl.search || ''),
            method: req.method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'host': binanceApi
            }
        };
        
        // Realizar la llamada a Binance
        const binanceReq = https.request(options, (binanceRes) => {
            console.log(`[OK] Binance Response: ${binanceRes.statusCode} - ${binanceApi}${binancePath}`);
            
            // Copiar headers de respuesta
            const responseHeaders = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                'Content-Type': binanceRes.headers['content-type'] || 'application/json'
            };
            
            res.writeHead(binanceRes.statusCode, responseHeaders);
            binanceRes.pipe(res);
        });
        
        binanceReq.on('error', (error) => {
            console.error(`[ERROR] Error en proxy:`, error.message);
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Error de conexión', details: error.message }));
        });
        
        // Enviar datos del body si los hay
        if (req.method === 'POST' || req.method === 'PUT') {
            req.pipe(binanceReq);
        } else {
            binanceReq.end();
        }
    });
    
    server.listen(PROXY_PORT, () => {
        console.log(`[NIGHT] Proxy Binance ejecutándose en puerto ${PROXY_PORT}`);
        console.log(` APIs soportadas: api.binance.com, fapi.binance.com, eapi.binance.com, dapi.binance.com`);
        console.log(` URL del proxy: http://localhost:${PROXY_PORT}`);
    });
    
    return server;
}

// Iniciar el proxy
if (require.main === module) {
    const proxy = createProxyServer();
    
    // Manejar cierre graceful
    process.on('SIGINT', () => {
        console.log('\n[NIGHT] Cerrando proxy...');
        proxy.close(() => {
            console.log('[OK] Proxy cerrado');
            process.exit(0);
        });
    });
}

module.exports = { createProxyServer, PROXY_PORT };

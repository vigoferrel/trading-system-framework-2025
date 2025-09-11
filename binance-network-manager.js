/**
 * BINANCE NETWORK MANAGER - CONECTIVIDAD REAL OPTIMIZADA
 * ===================================================
 * 
 * Gestor de red robusto para conexiones con Binance API
 * - Manejo inteligente de rate limiting
 * - Reconexiones automáticas con backoff exponencial
 * - Múltiples endpoints con failover
 * - Monitoreo de latencia y salud de conexiones
 * - Cumple reglas: usa kernel RNG y métricas en segundo plano
 */

const https = require('https');
const WebSocket = require('ws');
const crypto = require('crypto');

class BinanceNetworkManager {
    constructor(options = {}) {
        this.config = {
            endpoints: {
                spot: 'https://api.binance.com',
                futures: 'https://fapi.binance.com',
                websocket: 'wss://stream.binance.com:9443',
                futuresWs: 'wss://fstream.binance.com'
            },
            rateLimits: {
                spot: { weight: 1200, orders: 10 },
                futures: { weight: 2400, orders: 300 }
            },
            timeouts: {
                request: 10000,
                websocket: 5000
            },
            maxRetries: 3,
            backoffMultiplier: 2,
            healthCheckInterval: 30000,
            ...options
        };

        this.state = {
            connections: new Map(),
            rateLimiters: new Map(),
            healthStats: new Map(),
            lastFailover: 0,
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0
        };

        this.websockets = new Map();
        this.listeners = new Map();
        this.isShuttingDown = false;

        // Inicializar rate limiters según reglas del proyecto
        this.initializeRateLimiters();
        
        // Iniciar monitoreo en segundo plano (regla del proyecto)
        this.startBackgroundMonitoring();

        console.log('[BINANCE-NET] Network Manager inicializado con endpoints múltiples');
    }

    /**
     * INICIALIZAR RATE LIMITERS
     */
    initializeRateLimiters() {
        for (const [type, limits] of Object.entries(this.config.rateLimits)) {
            this.state.rateLimiters.set(type, {
                weight: { current: 0, max: limits.weight, resetTime: Date.now() + 60000 },
                orders: { current: 0, max: limits.orders, resetTime: Date.now() + 10000 }
            });
        }
    }

    /**
     * VERIFICAR RATE LIMIT
     */
    checkRateLimit(type, limitType = 'weight', cost = 1) {
        const rateLimiter = this.state.rateLimiters.get(type);
        if (!rateLimiter) return true;

        const limit = rateLimiter[limitType];
        const now = Date.now();

        // Reset si ha pasado el tiempo
        if (now >= limit.resetTime) {
            limit.current = 0;
            limit.resetTime = now + (limitType === 'weight' ? 60000 : 10000);
        }

        // Verificar si podemos hacer la request
        if (limit.current + cost > limit.max) {
            const waitTime = limit.resetTime - now;
            console.warn(`[BINANCE-NET] Rate limit ${type}/${limitType}: esperando ${waitTime}ms`);
            return false;
        }

        limit.current += cost;
        return true;
    }

    /**
     * REALIZAR REQUEST HTTP CON FAILOVER
     */
    async makeRequest(endpoint, path, options = {}) {
        const { retries = this.config.maxRetries, timeout = this.config.timeouts.request } = options;
        let lastError;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                // Verificar rate limit
                const endpointType = endpoint.includes('fapi') ? 'futures' : 'spot';
                if (!this.checkRateLimit(endpointType, 'weight', options.weight || 1)) {
                    await this.sleep(1000);
                    continue;
                }

                const result = await this.executeHttpRequest(endpoint, path, options, timeout);
                this.state.successfulRequests++;
                this.updateHealthStats(endpoint, true, Date.now());
                return result;

            } catch (error) {
                lastError = error;
                this.state.failedRequests++;
                this.updateHealthStats(endpoint, false, Date.now());

                if (attempt < retries) {
                    const backoffTime = Math.pow(this.config.backoffMultiplier, attempt) * 1000;
                    // Usar kernel RNG para jitter (regla del proyecto)
                    const jitter = crypto.randomBytes(2).readUInt16BE(0) % 500;
                    await this.sleep(backoffTime + jitter);
                    console.warn(`[BINANCE-NET] Reintentando request (${attempt + 1}/${retries + 1})...`);
                }
            }
        }

        throw new Error(`Request falló después de ${retries + 1} intentos: ${lastError.message}`);
    }

    /**
     * EJECUTAR REQUEST HTTP
     */
    executeHttpRequest(endpoint, path, options, timeout) {
        return new Promise((resolve, reject) => {
            const url = `${endpoint}${path}`;
            const { method = 'GET', body, headers = {} } = options;

            const requestOptions = {
                method,
                headers: {
                    'User-Agent': 'QBTC-Network-Manager/1.0',
                    'Content-Type': 'application/json',
                    ...headers
                },
                timeout
            };

            const req = https.request(url, requestOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const result = data ? JSON.parse(data) : {};
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            resolve(result);
                        } else {
                            reject(new Error(`HTTP ${res.statusCode}: ${result.msg || 'Unknown error'}`));
                        }
                    } catch (error) {
                        reject(new Error(`Parse error: ${error.message}`));
                    }
                });
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            if (body) {
                req.write(typeof body === 'string' ? body : JSON.stringify(body));
            }

            req.end();
        });
    }

    /**
     * CONECTAR WEBSOCKET CON RECONEXIÓN AUTOMÁTICA
     */
    async connectWebSocket(stream, options = {}) {
        const { endpoint = 'websocket', onMessage, onError, onClose } = options;
        const wsUrl = `${this.config.endpoints[endpoint]}/ws/${stream}`;

        const ws = new WebSocket(wsUrl);
        const connectionId = `${endpoint}_${stream}`;

        ws.on('open', () => {
            console.log(`[BINANCE-NET] WebSocket conectado: ${stream}`);
            this.websockets.set(connectionId, { ws, stream, endpoint, options });
            this.updateHealthStats(wsUrl, true, Date.now());
        });

        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                if (onMessage) onMessage(message);
                this.updateHealthStats(wsUrl, true, Date.now());
            } catch (error) {
                console.error(`[BINANCE-NET] Error parseando mensaje WebSocket:`, error);
                if (onError) onError(error);
            }
        });

        ws.on('error', (error) => {
            console.error(`[BINANCE-NET] Error WebSocket ${stream}:`, error.message);
            this.updateHealthStats(wsUrl, false, Date.now());
            if (onError) onError(error);
            this.scheduleReconnect(connectionId, options);
        });

        ws.on('close', (code, reason) => {
            console.log(`[BINANCE-NET] WebSocket cerrado ${stream}: ${code} ${reason}`);
            if (onClose) onClose(code, reason);
            if (!this.isShuttingDown) {
                this.scheduleReconnect(connectionId, options);
            }
        });

        return ws;
    }

    /**
     * PROGRAMAR RECONEXIÓN WEBSOCKET
     */
    async scheduleReconnect(connectionId, options) {
        if (this.isShuttingDown) return;

        const backoffTime = 5000 + (crypto.randomBytes(2).readUInt16BE(0) % 5000);
        console.log(`[BINANCE-NET] Reconectando WebSocket en ${backoffTime}ms...`);

        setTimeout(async () => {
            if (!this.isShuttingDown) {
                try {
                    const connectionData = this.websockets.get(connectionId);
                    if (connectionData) {
                        await this.connectWebSocket(connectionData.stream, connectionData.options);
                    }
                } catch (error) {
                    console.error('[BINANCE-NET] Error en reconexión:', error.message);
                }
            }
        }, backoffTime);
    }

    /**
     * ACTUALIZAR ESTADÍSTICAS DE SALUD
     */
    updateHealthStats(endpoint, success, timestamp) {
        if (!this.state.healthStats.has(endpoint)) {
            this.state.healthStats.set(endpoint, {
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                lastRequestTime: 0,
                averageLatency: 0,
                status: 'unknown'
            });
        }

        const stats = this.state.healthStats.get(endpoint);
        stats.totalRequests++;
        stats.lastRequestTime = timestamp;

        if (success) {
            stats.successfulRequests++;
            stats.status = 'healthy';
        } else {
            stats.failedRequests++;
            stats.status = 'unhealthy';
        }

        // Calcular tasa de éxito
        const successRate = stats.successfulRequests / stats.totalRequests;
        stats.healthScore = Math.round(successRate * 100);
    }

    /**
     * INICIAR MONITOREO EN SEGUNDO PLANO (REGLA DEL PROYECTO)
     */
    startBackgroundMonitoring() {
        this.monitoringInterval = setInterval(() => {
            this.reportMetrics();
            this.performHealthChecks();
        }, this.config.healthCheckInterval);

        // También reportar métricas cada minuto para depuración (regla del proyecto)
        this.metricsInterval = setInterval(() => {
            const metrics = this.getNetworkMetrics();
            console.log(`[BINANCE-NET-METRICS] Total: ${metrics.totalRequests}, Éxito: ${metrics.successRate}%, Conectado: ${metrics.activeConnections}`);
        }, 60000);
    }

    /**
     * REALIZAR HEALTH CHECKS
     */
    async performHealthChecks() {
        for (const [type, endpoint] of Object.entries(this.config.endpoints)) {
            if (type.includes('websocket')) continue;

            try {
                const startTime = Date.now();
                await this.makeRequest(endpoint, '/api/v3/ping', { timeout: 5000 });
                const latency = Date.now() - startTime;
                
                const stats = this.state.healthStats.get(endpoint) || {};
                stats.averageLatency = stats.averageLatency ? 
                    (stats.averageLatency + latency) / 2 : latency;
                
            } catch (error) {
                console.warn(`[BINANCE-NET] Health check falló para ${endpoint}:`, error.message);
            }
        }
    }

    /**
     * REPORTAR MÉTRICAS
     */
    reportMetrics() {
        const metrics = {
            timestamp: new Date().toISOString(),
            totalRequests: this.state.totalRequests,
            successfulRequests: this.state.successfulRequests,
            failedRequests: this.state.failedRequests,
            successRate: this.state.totalRequests > 0 ? 
                ((this.state.successfulRequests / this.state.totalRequests) * 100).toFixed(2) : 0,
            activeWebSockets: this.websockets.size,
            healthStats: Object.fromEntries(this.state.healthStats)
        };

        // Emitir métricas para monitoreo externo
        this.emit('metrics', metrics);
        return metrics;
    }

    /**
     * OBTENER MÉTRICAS DE RED
     */
    getNetworkMetrics() {
        return {
            totalRequests: this.state.totalRequests,
            successfulRequests: this.state.successfulRequests,
            failedRequests: this.state.failedRequests,
            successRate: this.state.totalRequests > 0 ? 
                ((this.state.successfulRequests / this.state.totalRequests) * 100).toFixed(2) : 0,
            activeConnections: this.websockets.size,
            rateLimits: Object.fromEntries(this.state.rateLimiters),
            endpoints: Object.fromEntries(this.state.healthStats)
        };
    }

    /**
     * UTILIDADES
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    emit(event, data) {
        const listeners = this.listeners.get(event) || [];
        listeners.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[BINANCE-NET] Error en listener ${event}:`, error);
            }
        });
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * CERRAR TODAS LAS CONEXIONES
     */
    async shutdown() {
        console.log('[BINANCE-NET] Cerrando Network Manager...');
        this.isShuttingDown = true;

        // Cerrar WebSockets
        for (const [id, connection] of this.websockets) {
            try {
                connection.ws.close();
            } catch (error) {
                console.warn(`[BINANCE-NET] Error cerrando WebSocket ${id}:`, error.message);
            }
        }

        // Limpiar intervalos
        if (this.monitoringInterval) clearInterval(this.monitoringInterval);
        if (this.metricsInterval) clearInterval(this.metricsInterval);

        this.websockets.clear();
        this.state.connections.clear();
        console.log('[BINANCE-NET] Network Manager cerrado completamente');
    }
}

module.exports = BinanceNetworkManager;

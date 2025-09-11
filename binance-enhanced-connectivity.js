/**
 * BINANCE ENHANCED CONNECTIVITY - SISTEMA DE CONECTIVIDAD OPTIMIZADA
 * ================================================================
 * 
 * Sistema integrado que combina network management e IP monitoring
 * para conectividad optimizada y resiliente con Binance API
 * - Gestión inteligente de múltiples conexiones
 * - Adaptación automática a cambios de red
 * - Caching inteligente y rate limiting
 * - Monitoreo continuo y auto-recuperación
 * - Cumple reglas: kernel RNG, métricas en segundo plano
 */

const BinanceNetworkManager = require('./binance-network-manager');
const IPMonitor = require('./ip-monitor');
const crypto = require('crypto');

class BinanceEnhancedConnectivity {
    constructor(options = {}) {
        this.config = {
            // Configuración de conectividad
            retryStrategies: ['immediate', 'exponential', 'linear'],
            maxConcurrentConnections: 10,
            connectionTimeout: 30000,
            healthCheckInterval: 60000,
            
            // Configuración de cache
            cacheEnabled: true,
            cacheTTL: 30000,
            maxCacheSize: 1000,
            
            // Configuración de Binance específica (regla del proyecto)
            binanceEndpoints: {
                primary: 'https://api.binance.com',
                backup: ['https://api1.binance.com', 'https://api2.binance.com'],
                futures: 'https://fapi.binance.com',
                websocket: 'wss://stream.binance.com:9443'
            },
            
            // Auto-adaptación de red
            adaptToIPChanges: true,
            reconnectOnIPChange: true,
            
            ...options
        };

        // Estado del sistema
        this.state = {
            isInitialized: false,
            activeConnections: 0,
            connectionPool: new Map(),
            requestCache: new Map(),
            metrics: {
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                cacheHits: 0,
                ipChanges: 0,
                reconnections: 0,
                averageLatency: 0
            },
            currentStrategy: 'primary'
        };

        // Componentes principales
        this.networkManager = new BinanceNetworkManager({
            endpoints: this.config.binanceEndpoints,
            healthCheckInterval: this.config.healthCheckInterval
        });

        this.ipMonitor = new IPMonitor({
            checkInterval: 30000 // Verificar IP cada 30 segundos
        });

        // Eventos y listeners
        this.listeners = new Map();
        this.setupEventListeners();

        console.log('[BINANCE-CONN] Enhanced Connectivity inicializado');
    }

    /**
     * CONFIGURAR LISTENERS DE EVENTOS
     */
    setupEventListeners() {
        // Escuchar cambios de IP
        this.ipMonitor.on('ipChanged', (data) => {
            console.log(`[BINANCE-CONN] IP cambió: ${data.oldIP} -> ${data.newIP}`);
            this.handleIPChange(data);
            this.state.metrics.ipChanges++;
        });

        // Escuchar problemas de estabilidad
        this.ipMonitor.on('instability', (data) => {
            console.warn('[BINANCE-CONN] Inestabilidad de IP detectada:', data);
            this.handleNetworkInstability(data);
        });

        // Escuchar métricas del network manager
        this.networkManager.on('metrics', (metrics) => {
            this.updateNetworkMetrics(metrics);
        });

        // Auto-limpiar cache periódicamente
        setInterval(() => {
            this.cleanupCache();
        }, this.config.cacheTTL);

        // Métricas en segundo plano (regla del proyecto)
        setInterval(() => {
            this.reportEnhancedMetrics();
        }, 60000);
    }

    /**
     * INICIALIZAR SISTEMA COMPLETO
     */
    async initialize() {
        if (this.state.isInitialized) {
            console.warn('[BINANCE-CONN] Ya está inicializado');
            return;
        }

        console.log('[BINANCE-CONN] Inicializando sistema de conectividad...');

        try {
            // Iniciar IP monitor
            this.ipMonitor.start();
            
            // Esperar a obtener IP inicial
            await this.waitForInitialIP();
            
            // Probar conectividad inicial con Binance (regla del proyecto)
            await this.testBinanceConnectivity();
            
            this.state.isInitialized = true;
            console.log('[BINANCE-CONN] Sistema inicializado correctamente');
            
            this.emit('initialized', {
                currentIP: this.ipMonitor.state.currentIP,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('[BINANCE-CONN] Error durante inicialización:', error.message);
            throw error;
        }
    }

    /**
     * ESPERAR A OBTENER IP INICIAL
     */
    async waitForInitialIP(timeout = 30000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkIP = () => {
                if (this.ipMonitor.state.currentIP) {
                    resolve(this.ipMonitor.state.currentIP);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Timeout esperando IP inicial'));
                } else {
                    setTimeout(checkIP, 1000);
                }
            };
            
            checkIP();
        });
    }

    /**
     * PROBAR CONECTIVIDAD INICIAL CON BINANCE (REGLA DEL PROYECTO)
     */
    async testBinanceConnectivity() {
        console.log('[BINANCE-CONN] Probando conectividad con Binance...');
        
        try {
            // Test ping endpoint
            const startTime = Date.now();
            await this.networkManager.makeRequest(
                this.config.binanceEndpoints.primary,
                '/api/v3/ping',
                { timeout: 10000 }
            );
            const latency = Date.now() - startTime;
            
            console.log(`[BINANCE-CONN] Conectividad OK - Latencia: ${latency}ms`);
            this.state.metrics.averageLatency = latency;
            
            // Test server time para validar sincronización
            const timeResponse = await this.networkManager.makeRequest(
                this.config.binanceEndpoints.primary,
                '/api/v3/time'
            );
            
            const serverTime = timeResponse.serverTime;
            const localTime = Date.now();
            const timeDiff = Math.abs(serverTime - localTime);
            
            if (timeDiff > 5000) { // Más de 5 segundos de diferencia
                console.warn(`[BINANCE-CONN] Diferencia de tiempo detectada: ${timeDiff}ms`);
            }
            
            return true;
            
        } catch (error) {
            console.error('[BINANCE-CONN] Error probando conectividad:', error.message);
            throw new Error(`Conectividad con Binance falló: ${error.message}`);
        }
    }

    /**
     * REALIZAR REQUEST MEJORADO CON CACHE Y FAILOVER
     */
    async makeEnhancedRequest(path, options = {}) {
        this.state.metrics.totalRequests++;
        const requestId = this.generateRequestId();
        
        console.log(`[BINANCE-CONN] Request ${requestId}: ${path}`);
        
        try {
            // Verificar cache primero
            if (this.config.cacheEnabled && options.cache !== false) {
                const cached = this.getCachedResponse(path, options);
                if (cached) {
                    this.state.metrics.cacheHits++;
                    console.log(`[BINANCE-CONN] Cache hit para ${path}`);
                    return cached;
                }
            }
            
            // Determinar endpoint a usar
            const endpoint = this.selectOptimalEndpoint();
            
            // Realizar request con network manager
            const result = await this.networkManager.makeRequest(endpoint, path, {
                ...options,
                requestId
            });
            
            // Guardar en cache si aplica
            if (this.config.cacheEnabled && this.shouldCache(path, options)) {
                this.setCachedResponse(path, options, result);
            }
            
            this.state.metrics.successfulRequests++;
            console.log(`[BINANCE-CONN] Request ${requestId} exitoso`);
            
            return result;
            
        } catch (error) {
            this.state.metrics.failedRequests++;
            console.error(`[BINANCE-CONN] Request ${requestId} falló:`, error.message);
            
            // Intentar con endpoint backup si disponible
            if (this.config.binanceEndpoints.backup.length > 0) {
                console.log(`[BINANCE-CONN] Intentando con endpoint backup...`);
                return await this.tryBackupEndpoints(path, options);
            }
            
            throw error;
        }
    }

    /**
     * SELECCIONAR ENDPOINT ÓPTIMO
     */
    selectOptimalEndpoint() {
        // Por ahora usar endpoint primario, pero aquí se puede implementar
        // lógica más sofisticada basada en métricas de latencia y salud
        return this.config.binanceEndpoints.primary;
    }

    /**
     * INTENTAR CON ENDPOINTS BACKUP
     */
    async tryBackupEndpoints(path, options) {
        const backupEndpoints = [...this.config.binanceEndpoints.backup];
        
        // Usar kernel RNG para mezclar endpoints (regla del proyecto)
        for (let i = backupEndpoints.length - 1; i > 0; i--) {
            const randomBytes = crypto.randomBytes(1);
            const j = randomBytes[0] % (i + 1);
            [backupEndpoints[i], backupEndpoints[j]] = [backupEndpoints[j], backupEndpoints[i]];
        }
        
        let lastError;
        for (const endpoint of backupEndpoints) {
            try {
                console.log(`[BINANCE-CONN] Probando backup: ${endpoint}`);
                const result = await this.networkManager.makeRequest(endpoint, path, options);
                this.state.metrics.successfulRequests++;
                return result;
            } catch (error) {
                lastError = error;
                console.warn(`[BINANCE-CONN] Backup falló: ${endpoint}`);
            }
        }
        
        throw lastError || new Error('Todos los endpoints backup fallaron');
    }

    /**
     * MANEJAR CAMBIO DE IP
     */
    async handleIPChange(data) {
        if (!this.config.adaptToIPChanges) return;
        
        console.log('[BINANCE-CONN] Adaptando a cambio de IP...');
        
        try {
            // Limpiar conexiones existentes
            await this.reconnectAllConnections();
            
            // Probar conectividad nuevamente
            await this.testBinanceConnectivity();
            
            // Limpiar cache para forzar requests frescos
            this.clearCache();
            
            this.emit('ipAdapted', {
                newIP: data.newIP,
                oldIP: data.oldIP,
                timestamp: data.timestamp
            });
            
            console.log('[BINANCE-CONN] Adaptación a IP completada');
            
        } catch (error) {
            console.error('[BINANCE-CONN] Error adaptando a cambio IP:', error.message);
            this.emit('adaptationFailed', { error: error.message });
        }
    }

    /**
     * RECONECTAR TODAS LAS CONEXIONES
     */
    async reconnectAllConnections() {
        console.log('[BINANCE-CONN] Reconectando todas las conexiones...');
        
        const reconnectPromises = [];
        for (const [connectionId, connection] of this.state.connectionPool) {
            reconnectPromises.push(this.reconnectConnection(connectionId, connection));
        }
        
        await Promise.allSettled(reconnectPromises);
        this.state.metrics.reconnections++;
        
        console.log('[BINANCE-CONN] Reconexiones completadas');
    }

    /**
     * RECONECTAR CONEXIÓN ESPECÍFICA
     */
    async reconnectConnection(connectionId, connection) {
        try {
            if (connection.type === 'websocket') {
                // Reconectar WebSocket
                await this.networkManager.connectWebSocket(connection.stream, connection.options);
            }
            console.log(`[BINANCE-CONN] Reconexión exitosa: ${connectionId}`);
        } catch (error) {
            console.error(`[BINANCE-CONN] Error reconectando ${connectionId}:`, error.message);
        }
    }

    /**
     * MANEJAR INESTABILIDAD DE RED
     */
    async handleNetworkInstability(data) {
        console.warn('[BINANCE-CONN] Manejando inestabilidad de red...');
        
        // Reducir frecuencia de requests
        this.implementBackoffStrategy();
        
        // Activar modo conservación
        this.activateConservationMode();
        
        this.emit('instabilityHandled', {
            failedChecks: data.failedChecks,
            action: 'conservation_mode_activated'
        });
    }

    /**
     * IMPLEMENTAR ESTRATEGIA DE BACKOFF
     */
    implementBackoffStrategy() {
        // Implementar lógica de backoff exponencial
        console.log('[BINANCE-CONN] Activando estrategia de backoff');
        // Por ahora solo log, implementar lógica específica después
    }

    /**
     * ACTIVAR MODO CONSERVACIÓN
     */
    activateConservationMode() {
        console.log('[BINANCE-CONN] Modo conservación activado');
        // Reducir rate limits, aumentar timeouts, etc.
    }

    /**
     * GESTIÓN DE CACHE
     */
    getCachedResponse(path, options) {
        const cacheKey = this.generateCacheKey(path, options);
        const cached = this.state.requestCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.config.cacheTTL) {
            return cached.data;
        }
        
        return null;
    }

    setCachedResponse(path, options, data) {
        if (this.state.requestCache.size >= this.config.maxCacheSize) {
            this.cleanupCache();
        }
        
        const cacheKey = this.generateCacheKey(path, options);
        this.state.requestCache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
    }

    shouldCache(path, options) {
        // No cachear requests de tiempo real
        const noCachePaths = ['/api/v3/time', '/ws/', 'ticker', 'depth'];
        return !noCachePaths.some(p => path.includes(p)) && 
               options.method !== 'POST' && 
               options.method !== 'DELETE';
    }

    generateCacheKey(path, options) {
        const key = `${path}_${JSON.stringify(options.params || {})}`;
        return crypto.createHash('md5').update(key).digest('hex');
    }

    cleanupCache() {
        const now = Date.now();
        const toDelete = [];
        
        for (const [key, entry] of this.state.requestCache) {
            if (now - entry.timestamp > this.config.cacheTTL) {
                toDelete.push(key);
            }
        }
        
        toDelete.forEach(key => this.state.requestCache.delete(key));
        
        if (toDelete.length > 0) {
            console.log(`[BINANCE-CONN] Cache limpiado: ${toDelete.length} entradas`);
        }
    }

    clearCache() {
        this.state.requestCache.clear();
        console.log('[BINANCE-CONN] Cache completamente limpiado');
    }

    /**
     * CONECTAR WEBSOCKET MEJORADO
     */
    async connectEnhancedWebSocket(stream, options = {}) {
        const connectionId = `ws_${stream}_${Date.now()}`;
        
        try {
            const ws = await this.networkManager.connectWebSocket(stream, {
                ...options,
                onMessage: (data) => {
                    this.emit('wsMessage', { stream, data });
                    if (options.onMessage) options.onMessage(data);
                },
                onError: (error) => {
                    console.error(`[BINANCE-CONN] WebSocket error ${stream}:`, error);
                    this.emit('wsError', { stream, error });
                },
                onClose: (code, reason) => {
                    console.log(`[BINANCE-CONN] WebSocket cerrado ${stream}: ${code}`);
                    this.state.connectionPool.delete(connectionId);
                    this.emit('wsClosed', { stream, code, reason });
                }
            });
            
            // Registrar conexión
            this.state.connectionPool.set(connectionId, {
                type: 'websocket',
                stream,
                options,
                ws,
                createdAt: Date.now()
            });
            
            this.state.activeConnections++;
            console.log(`[BINANCE-CONN] WebSocket conectado: ${stream} (${connectionId})`);
            
            return { ws, connectionId };
            
        } catch (error) {
            console.error(`[BINANCE-CONN] Error conectando WebSocket ${stream}:`, error);
            throw error;
        }
    }

    /**
     * UTILIDADES
     */
    generateRequestId() {
        const randomBytes = crypto.randomBytes(4);
        return randomBytes.toString('hex').substring(0, 8);
    }

    updateNetworkMetrics(networkMetrics) {
        // Actualizar métricas combinadas
        this.state.metrics.averageLatency = networkMetrics.averageLatency || this.state.metrics.averageLatency;
    }

    /**
     * REPORTAR MÉTRICAS MEJORADAS (REGLA DEL PROYECTO)
     */
    reportEnhancedMetrics() {
        const metrics = this.getEnhancedMetrics();
        
        console.log(`[BINANCE-CONN-METRICS] Requests: ${metrics.totalRequests}, Éxito: ${metrics.successRate}%, Cache: ${metrics.cacheHitRate}%, IP: ${metrics.currentIP}`);
        
        this.emit('enhancedMetrics', metrics);
    }

    /**
     * OBTENER MÉTRICAS COMPLETAS
     */
    getEnhancedMetrics() {
        const networkMetrics = this.networkManager.getNetworkMetrics();
        const ipMetrics = this.ipMonitor.getMetrics();
        
        return {
            // Métricas de conectividad
            totalRequests: this.state.metrics.totalRequests,
            successfulRequests: this.state.metrics.successfulRequests,
            failedRequests: this.state.metrics.failedRequests,
            successRate: this.state.metrics.totalRequests > 0 ? 
                ((this.state.metrics.successfulRequests / this.state.metrics.totalRequests) * 100).toFixed(2) : 0,
            
            // Métricas de cache
            cacheHits: this.state.metrics.cacheHits,
            cacheSize: this.state.requestCache.size,
            cacheHitRate: this.state.metrics.totalRequests > 0 ?
                ((this.state.metrics.cacheHits / this.state.metrics.totalRequests) * 100).toFixed(2) : 0,
            
            // Métricas de red
            currentIP: ipMetrics.currentIP,
            ipChanges: this.state.metrics.ipChanges,
            ipStable: ipMetrics.isStable,
            
            // Métricas de conexiones
            activeConnections: this.state.activeConnections,
            reconnections: this.state.metrics.reconnections,
            averageLatency: this.state.metrics.averageLatency,
            
            // Estado general
            isInitialized: this.state.isInitialized,
            strategy: this.state.currentStrategy,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * EVENTOS
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[BINANCE-CONN] Error en listener ${event}:`, error);
            }
        });
    }

    /**
     * SHUTDOWN COMPLETO
     */
    async shutdown() {
        console.log('[BINANCE-CONN] Cerrando Enhanced Connectivity...');
        
        // Detener IP monitor
        this.ipMonitor.stop();
        
        // Cerrar network manager
        await this.networkManager.shutdown();
        
        // Limpiar estado
        this.state.connectionPool.clear();
        this.clearCache();
        this.state.isInitialized = false;
        
        console.log('[BINANCE-CONN] Enhanced Connectivity cerrado');
    }
}

module.exports = BinanceEnhancedConnectivity;

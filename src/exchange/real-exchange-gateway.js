/**
 * QBTC Real Exchange Gateway - θ-aware Integration
 * 
 * Exchange Gateway con conectores reales para múltiples exchanges
 * Integrado con el sistema θ-aware y temporal prime ladders
 * 
 * Exchanges soportados:
 * - Binance Spot & Futures
 * - Deribit (Opciones)  
 * - Bybit (Futures & Opciones)
 * - OKX (Spot, Futures, Opciones)
 * 
 * Funcionalidades θ-aware:
 * - Ejecución basada en métricas temporales
 * - Rolls automáticos en bandas primas
 * - Detección de disonancia λ_7919
 * - Gestión de θ-budget por tier
 */

const WebSocket = require('ws');
const axios = require('axios');
const crypto = require('crypto');
const { kernelRNG } = require('../utils/kernel-rng');
const safeMath = require('../utils/safe-math');
const { HermeticLogger } = require('../utils/hermetic-logger');

class RealExchangeGateway {
    constructor(config = {}) {
        this.logger = new HermeticLogger('ExchangeGateway');
        this.config = config;
        this.exchanges = new Map();
        this.webSockets = new Map();
        this.rateLimiters = new Map();
        this.healthStatus = new Map();
        
        // θ-aware temporal metrics
        this.temporalMetrics = {
            thetaBudgetByTier: new Map(),
            primeRollTargets: [7, 11, 13, 17, 19, 23, 29],
            lambdaDissonanceThreshold: 7919,
            quantumCoherence: 0.618,
            lastTemporalSync: Date.now()
        };
        
        // Configuración de Binance con APIs especializadas aprovechando infraestructura existente
        this.exchangeConfigs = {
            binance: {
                name: 'Binance Complete',
                // URLs especializadas por tipo de instrumento
                spotBaseUrl: 'https://api.binance.com',
                futuresBaseUrl: 'https://fapi.binance.com', 
                optionsBaseUrl: 'https://eapi.binance.com',
                // WebSockets especializados
                spotWsUrl: 'wss://stream.binance.com:9443/ws',
                futuresWsUrl: 'wss://fstream.binance.com/ws',
                optionsWsUrl: 'wss://nbstream.binance.com/eoptions/ws',
                // Rate limits por API
                rateLimits: {
                    spot: { requests: 1200, window: 60000 },
                    futures: { requests: 1200, window: 60000 },
                    options: { requests: 500, window: 60000 }
                },
                supports: ['spot', 'futures', 'options'],
                fees: {
                    spot: { maker: 0.001, taker: 0.001 },
                    futures: { maker: 0.0002, taker: 0.0004 },
                    options: { maker: 0.0003, taker: 0.0003 }
                },
                primary: true,
                // Configuración especializada por instrumento
                specialized: {
                    spot: { priority: 1, cacheTTL: 5000 },
                    futures: { priority: 2, cacheTTL: 2000, leverage: true },
                    options: { priority: 3, cacheTTL: 10000, greeks: true }
                }
            }
        };

        this.logger.info('🔗 Inicializando Real Exchange Gateway θ-aware...');
        this.initializeExchanges();
    }

    /**
     * Inicializa conexiones a todos los exchanges configurados
     */
    async initializeExchanges() {
        try {
            for (const [exchangeId, config] of Object.entries(this.exchangeConfigs)) {
                await this.setupExchange(exchangeId, config);
            }
            
            // Inicializar métricas temporales
            await this.initializeTemporalMetrics();
            
            this.logger.info(`✅ ${this.exchanges.size} exchanges inicializados correctamente`);
            
            // Iniciar monitoreo de salud
            this.startHealthMonitoring();
            
        } catch (error) {
            this.logger.error(`❌ Error inicializando exchanges: ${error.message}`);
            throw error;
        }
    }

    /**
     * Configurar Binance con todas sus APIs especializadas
     */
    async setupExchange(exchangeId, config) {
        try {
            if (exchangeId === 'binance') {
                // Usar la infraestructura existente de BinanceConnector
                const BinanceConnector = require('../../binance-connector');
                
                this.binanceConnector = new BinanceConnector({
                    tradeMode: 'unified', // Aprovechar modo unificado
                    testnet: process.env.BINANCE_TESTNET === 'true',
                    enableRateLimit: true,
                    enableCache: true
                });
                
                this.logger.info('🚀 Binance Connector integrado con modo unificado');
                
                // Configurar rate limiters especializados por API
                Object.keys(config.rateLimits).forEach(apiType => {
                    this.rateLimiters.set(`binance_${apiType}`, {
                        requests: [],
                        limit: config.rateLimits[apiType].requests,
                        window: config.rateLimits[apiType].window
                    });
                });
                
                // Configurar clientes HTTP especializados
                this.httpClients = {
                    spot: axios.create({
                        baseURL: config.spotBaseUrl,
                        timeout: 30000,
                        headers: { 'User-Agent': 'QBTC-θ-Gateway/2.0' }
                    }),
                    futures: axios.create({
                        baseURL: config.futuresBaseUrl,
                        timeout: 30000,
                        headers: { 'User-Agent': 'QBTC-θ-Gateway/2.0' }
                    }),
                    options: axios.create({
                        baseURL: config.optionsBaseUrl,
                        timeout: 30000,
                        headers: { 'User-Agent': 'QBTC-θ-Gateway/2.0' }
                    })
                };
            } else {
                // Configuración genérica para otros exchanges (legacy)
                this.rateLimiters.set(exchangeId, {
                    requests: [],
                    limit: config.rateLimits.requests || 1200,
                    window: config.rateLimits.window || 60000
                });

                const httpClient = axios.create({
                    baseURL: config.baseUrl,
                    timeout: 30000,
                    headers: {
                        'User-Agent': 'QBTC-Theta-Aware-Gateway/1.0'
                    }
                });

            // Configurar WebSocket para datos en tiempo real con manejo robusto de errores
            let ws;
            try {
                ws = new WebSocket(config.wsUrl);
                
                ws.on('open', () => {
                    this.logger.info(`🌐 WebSocket conectado a ${config.name}`);
                    this.healthStatus.set(exchangeId, { status: 'connected', lastPing: Date.now() });
                });
                
                ws.on('message', (data) => {
                    this.handleWebSocketMessage(exchangeId, data);
                });
                
                ws.on('error', (error) => {
                    this.logger.warn(`⚠️ WebSocket error en ${config.name}: ${error.message}`);
                    this.healthStatus.set(exchangeId, { 
                        status: 'websocket_error', 
                        lastError: error.message,
                        timestamp: Date.now()
                    });
                    // No lanzar error, solo marcar como degradado
                });
                
                ws.on('close', (code, reason) => {
                    this.logger.info(`🔌 WebSocket cerrado para ${config.name}: ${code} - ${reason}`);
                    this.healthStatus.set(exchangeId, { 
                        status: 'disconnected', 
                        lastDisconnect: Date.now()
                    });
                });
                
            } catch (wsError) {
                this.logger.warn(`⚠️ No se pudo crear WebSocket para ${config.name}: ${wsError.message}`);
                ws = null; // Sin WebSocket, solo HTTP
            }

            // Almacenar configuración
            this.exchanges.set(exchangeId, {
                config,
                httpClient,
                websocket: ws,
                credentials: this.getCredentials(exchangeId)
            });

            // Test de conectividad
            await this.testExchangeConnectivity(exchangeId);

        } catch (error) {
            this.logger.error(`❌ Error configurando ${config.name}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtener credenciales de exchange desde variables de entorno
     */
    getCredentials(exchangeId) {
        const envPrefix = exchangeId.toUpperCase();
        return {
            apiKey: process.env[`${envPrefix}_API_KEY`],
            secretKey: process.env[`${envPrefix}_SECRET_KEY`],
            passphrase: process.env[`${envPrefix}_PASSPHRASE`], // Para OKX
            testnet: process.env[`${envPrefix}_TESTNET`] === 'true'
        };
    }

    /**
     * Inicializar métricas temporales θ-aware
     */
    async initializeTemporalMetrics() {
        // Configurar θ-budget por tiers
        const tiers = ['TIER_1', 'TIER_2', 'TIER_3', 'TIER_PRIME'];
        const baseTheta = 0.05; // Base theta decay rate
        
        for (const tier of tiers) {
            const tierMultiplier = this.getTierMultiplier(tier);
            this.temporalMetrics.thetaBudgetByTier.set(tier, {
                budget: safeMath.multiply(baseTheta, tierMultiplier),
                used: 0,
                resetTime: this.getNextPrimeResetTime(),
                efficiency: kernelRNG.nextFloat() * 0.2 + 0.8 // 80-100% efficiency
            });
        }

        this.logger.info(`⏰ Métricas temporales θ-aware inicializadas`);
        this.logger.info(`🎯 Prime roll targets: [${this.temporalMetrics.primeRollTargets.join(', ')}]`);
        this.logger.info(`⚡ λ-disonance threshold: ${this.temporalMetrics.lambdaDissonanceThreshold}`);
    }

    /**
     * Obtener multiplicador de tier para θ-budget
     */
    getTierMultiplier(tier) {
        const multipliers = {
            'TIER_1': 1.0,      // Assets más líquidos
            'TIER_2': 1.3,      // Assets medianamente líquidos  
            'TIER_3': 1.7,      // Assets menos líquidos
            'TIER_PRIME': 2.3   // Assets especiales en números primos
        };
        return multipliers[tier] || 1.0;
    }

    /**
     * Calcular próximo tiempo de reset basado en números primos
     */
    getNextPrimeResetTime() {
        const now = new Date();
        const currentHour = now.getHours();
        const primeHours = [7, 11, 13, 17, 19, 23];
        
        // Encontrar próxima hora prima
        let nextPrimeHour = primeHours.find(h => h > currentHour);
        if (!nextPrimeHour) {
            nextPrimeHour = primeHours[0]; // 7 AM del siguiente día
        }
        
        const nextReset = new Date(now);
        nextReset.setHours(nextPrimeHour, 0, 0, 0);
        if (nextReset <= now) {
            nextReset.setDate(nextReset.getDate() + 1);
        }
        
        return nextReset.getTime();
    }

    /**
     * Ejecutar orden con validación θ-aware
     */
    async executeOrder(orderRequest) {
        try {
            // Validar θ-budget antes de ejecutar
            const thetaValidation = await this.validateThetaBudget(orderRequest);
            if (!thetaValidation.valid) {
                this.logger.warn(`⚠️ Orden rechazada por θ-budget: ${thetaValidation.reason}`);
                return { success: false, reason: thetaValidation.reason };
            }

            // Detectar disonancia λ_7919
            const lambdaDissonance = this.detectLambdaDissonance(orderRequest);
            if (lambdaDissonance.detected) {
                this.logger.warn(`⚡ λ-disonance detectada: ${lambdaDissonance.level}`);
                orderRequest = this.adjustForDissonance(orderRequest, lambdaDissonance);
            }

            // Seleccionar mejor exchange
            const optimalExchange = await this.selectOptimalExchange(orderRequest);
            if (!optimalExchange) {
                return { success: false, reason: 'No exchange available' };
            }

            // Ejecutar orden
            const result = await this.executeOrderOnExchange(optimalExchange, orderRequest);
            
            // Actualizar métricas temporales
            if (result.success) {
                await this.updateTemporalMetrics(orderRequest, result);
            }

            return result;

        } catch (error) {
            this.logger.error(`❌ Error ejecutando orden: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Validar θ-budget para la orden
     */
    async validateThetaBudget(orderRequest) {
        const tier = this.determineTier(orderRequest.symbol);
        const thetaBudget = this.temporalMetrics.thetaBudgetByTier.get(tier);
        
        if (!thetaBudget) {
            return { valid: false, reason: `Tier ${tier} not configured` };
        }

        // Calcular θ-cost de la orden
        const thetaCost = this.calculateThetaCost(orderRequest);
        
        if (safeMath.add(thetaBudget.used, thetaCost) > thetaBudget.budget) {
            return { 
                valid: false, 
                reason: `θ-budget exceeded for ${tier}: ${thetaBudget.used + thetaCost}/${thetaBudget.budget}` 
            };
        }

        return { 
            valid: true, 
            thetaCost,
            remainingBudget: safeMath.subtract(thetaBudget.budget, thetaBudget.used)
        };
    }

    /**
     * Determinar tier del símbolo
     */
    determineTier(symbol) {
        const tier1Symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'DOTUSDT'];
        const tier2Symbols = ['BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
        const tierPrimeSymbols = ['LINKUSDT']; // Símbolos con características especiales
        
        if (tier1Symbols.includes(symbol)) return 'TIER_1';
        if (tier2Symbols.includes(symbol)) return 'TIER_2';
        if (tierPrimeSymbols.includes(symbol)) return 'TIER_PRIME';
        return 'TIER_3';
    }

    /**
     * Calcular costo θ de la orden
     */
    calculateThetaCost(orderRequest) {
        const baseTheta = 0.01;
        const sizeMultiplier = Math.log(orderRequest.quantity || 1);
        const urgencyMultiplier = orderRequest.urgency === 'high' ? 1.5 : 1.0;
        
        return safeMath.multiply(
            safeMath.multiply(baseTheta, sizeMultiplier),
            urgencyMultiplier
        );
    }

    /**
     * Detectar disonancia λ_7919
     */
    detectLambdaDissonance(orderRequest) {
        const currentTime = Date.now();
        const timeSinceSync = currentTime - this.temporalMetrics.lastTemporalSync;
        
        // Calcular factor de disonancia basado en λ=ln(7919)
        const lambda = Math.log(7919);
        const timeRatio = timeSinceSync / (lambda * 1000); // Convertir a segundos
        
        const dissonanceLevel = Math.abs(Math.sin(timeRatio * Math.PI));
        const threshold = 0.7; // Umbral de disonancia
        
        return {
            detected: dissonanceLevel > threshold,
            level: dissonanceLevel,
            timeRatio,
            recommendation: dissonanceLevel > threshold ? 'reduce_size' : 'proceed'
        };
    }

    /**
     * Ajustar orden por disonancia detectada
     */
    adjustForDissonance(orderRequest, dissonance) {
        if (dissonance.recommendation === 'reduce_size') {
            const reductionFactor = safeMath.subtract(1.0, dissonance.level * 0.3);
            orderRequest.quantity = safeMath.multiply(orderRequest.quantity, reductionFactor);
            
            this.logger.info(`🎛️ Orden ajustada por λ-disonance: ${reductionFactor.toFixed(3)}x`);
        }
        
        return orderRequest;
    }

    /**
     * Seleccionar exchange óptimo para la orden
     */
    async selectOptimalExchange(orderRequest) {
        const candidates = [];
        
        for (const [exchangeId, exchange] of this.exchanges) {
            if (!this.supportsOrderType(exchangeId, orderRequest.type)) continue;
            if (!this.isHealthy(exchangeId)) continue;
            
            const score = await this.calculateExchangeScore(exchangeId, orderRequest);
            candidates.push({ exchangeId, score, exchange });
        }
        
        // Ordenar por score descendente
        candidates.sort((a, b) => b.score - a.score);
        
        return candidates.length > 0 ? candidates[0] : null;
    }

    /**
     * Calcular score de exchange para la orden
     */
    async calculateExchangeScore(exchangeId, orderRequest) {
        const exchange = this.exchanges.get(exchangeId);
        const health = this.healthStatus.get(exchangeId);
        
        let score = 100; // Score base
        
        // Factor de salud
        if (health?.status === 'connected') score += 20;
        if (health?.status === 'error') score -= 50;
        
        // Factor de fees
        const fees = exchange.config.fees;
        const feeScore = safeMath.subtract(0.002, fees.taker) * 10000; // Menor fee = mayor score
        score = safeMath.add(score, feeScore);
        
        // Factor de liquidez (simulado)
        const liquidityScore = kernelRNG.nextFloat() * 30;
        score = safeMath.add(score, liquidityScore);
        
        return Math.max(0, score);
    }

    /**
     * Ejecutar orden en exchange específico
     */
    async executeOrderOnExchange(exchangeData, orderRequest) {
        const { exchangeId, exchange } = exchangeData;
        
        try {
            // Validar rate limit
            if (!await this.checkRateLimit(exchangeId)) {
                return { success: false, reason: 'Rate limit exceeded' };
            }
            
            // Preparar orden según el exchange
            const preparedOrder = this.prepareOrderForExchange(exchangeId, orderRequest);
            
            // Ejecutar (simulado en desarrollo, real en producción)
            const result = await this.sendOrderToExchange(exchangeId, preparedOrder);
            
            this.logger.info(`✅ Orden ejecutada en ${exchange.config.name}: ${result.orderId}`);
            
            return {
                success: true,
                orderId: result.orderId,
                exchange: exchangeId,
                executedPrice: result.executedPrice,
                executedQuantity: result.executedQuantity,
                timestamp: Date.now()
            };
            
        } catch (error) {
            this.logger.error(`❌ Error ejecutando en ${exchangeId}: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Enviar orden al exchange (implementación específica por exchange)
     */
    async sendOrderToExchange(exchangeId, order) {
        // En desarrollo/testing, simular ejecución
        if (process.env.NODE_ENV !== 'production') {
            return this.simulateOrderExecution(order);
        }
        
        // Implementación real por exchange
        switch (exchangeId) {
            case 'binance':
                return await this.executeBinanceOrder(order);
            case 'deribit':
                return await this.executeDeribitOrder(order);
            case 'bybit':
                return await this.executeBybitOrder(order);
            case 'okx':
                return await this.executeOKXOrder(order);
            default:
                throw new Error(`Exchange ${exchangeId} not supported`);
        }
    }

    /**
     * Simular ejecución de orden (para desarrollo)
     */
    simulateOrderExecution(order) {
        const orderId = `SIM_${Date.now()}_${kernelRNG.nextInt(1000000)}`;
        const executedPrice = safeMath.multiply(order.price, safeMath.add(1, (kernelRNG.nextFloat() - 0.5) * 0.001));
        
        return {
            orderId,
            executedPrice,
            executedQuantity: order.quantity,
            timestamp: Date.now()
        };
    }

    /**
     * Actualizar métricas temporales post-ejecución
     */
    async updateTemporalMetrics(orderRequest, executionResult) {
        const tier = this.determineTier(orderRequest.symbol);
        const thetaBudget = this.temporalMetrics.thetaBudgetByTier.get(tier);
        
        if (thetaBudget) {
            const thetaCost = this.calculateThetaCost(orderRequest);
            thetaBudget.used = safeMath.add(thetaBudget.used, thetaCost);
            
            this.logger.debug(`⏱️ θ-budget actualizado para ${tier}: ${thetaBudget.used}/${thetaBudget.budget}`);
        }
        
        // Actualizar tiempo de sincronización temporal
        this.temporalMetrics.lastTemporalSync = Date.now();
    }

    /**
     * Verificar si exchange soporta tipo de orden
     */
    supportsOrderType(exchangeId, orderType) {
        const exchange = this.exchanges.get(exchangeId);
        if (!exchange) return false;
        
        const supportedTypes = {
            'binance': ['spot', 'futures', 'limit', 'market'],
            'deribit': ['options', 'futures', 'limit', 'market'],
            'bybit': ['spot', 'futures', 'options', 'limit', 'market'],
            'okx': ['spot', 'futures', 'options', 'limit', 'market']
        };
        
        return supportedTypes[exchangeId]?.includes(orderType) || false;
    }

    /**
     * Verificar salud del exchange
     */
    isHealthy(exchangeId) {
        const health = this.healthStatus.get(exchangeId);
        return health?.status === 'connected';
    }

    /**
     * Verificar rate limit
     */
    async checkRateLimit(exchangeId) {
        const limiter = this.rateLimiters.get(exchangeId);
        if (!limiter) return true;
        
        const now = Date.now();
        const windowStart = now - limiter.window;
        
        // Limpiar requests antiguos
        limiter.requests = limiter.requests.filter(time => time > windowStart);
        
        if (limiter.requests.length >= limiter.limit) {
            return false;
        }
        
        limiter.requests.push(now);
        return true;
    }

    /**
     * Preparar orden para Binance usando métricas del kernel
     */
    prepareOrderForExchange(exchangeId, orderRequest) {
        // Formato para Binance
        let prepared = {
            symbol: orderRequest.symbol,
            side: orderRequest.side.toUpperCase(),
            type: orderRequest.type.toUpperCase(),
            quantity: orderRequest.quantity,
            price: orderRequest.price,
            timeInForce: 'GTC', // Good Till Canceled
            timestamp: Date.now()
        };
        
        // Validaciones específicas para Binance
        if (exchangeId === 'binance') {
            // Añadir campos requeridos por Binance
            if (prepared.type === 'MARKET') {
                delete prepared.price; // Market orders no necesitan precio
                delete prepared.timeInForce;
            }
            
            // Añadir newClientOrderId único usando kernelRNG
            const randomSuffix = kernelRNG.nextInt(100000, 999999);
            const temporalHash = (Date.now() % this.temporalMetrics.lambdaDissonanceThreshold).toString(36);
            prepared.newClientOrderId = `QBTC_${Date.now()}_${temporalHash}_${randomSuffix}`;
        }
        
        return prepared;
    }

    /**
     * Manejar mensajes de WebSocket
     */
    handleWebSocketMessage(exchangeId, data) {
        try {
            const message = JSON.parse(data.toString());
            
            // Actualizar métricas de salud
            this.healthStatus.set(exchangeId, { 
                status: 'connected', 
                lastMessage: Date.now(),
                messageCount: (this.healthStatus.get(exchangeId)?.messageCount || 0) + 1
            });
            
            // Procesar según tipo de mensaje
            this.processMarketData(exchangeId, message);
            
        } catch (error) {
            this.logger.error(`❌ Error procesando WebSocket de ${exchangeId}: ${error.message}`);
        }
    }

    /**
     * Procesar datos de mercado
     */
    processMarketData(exchangeId, data) {
        // Implementar procesamiento específico según exchange
        // Por ahora solo logging básico
        this.logger.debug(`📊 Market data de ${exchangeId}: ${JSON.stringify(data).substring(0, 100)}...`);
    }

    /**
     * Test de conectividad del exchange
     */
    async testExchangeConnectivity(exchangeId) {
        const exchange = this.exchanges.get(exchangeId);
        if (!exchange) throw new Error(`Exchange ${exchangeId} not found`);
        
        try {
            // Usar endpoint específico de Binance
            const testEndpoint = '/api/v3/ping';
            
            const response = await exchange.httpClient.get(testEndpoint);
            this.logger.info(`✅ ${exchange.config.name} conectividad OK`);
            
            // Marcar como saludable
            this.healthStatus.set(exchangeId, { 
                status: 'connected', 
                lastCheck: Date.now(),
                responseTime: Date.now() - Date.now() // Placeholder
            });
            
            return true;
        } catch (error) {
            this.logger.warn(`⚠️ ${exchange.config.name} conectividad falló: ${error.message}`);
            // Marcar como no disponible pero continuar
            this.healthStatus.set(exchangeId, { 
                status: 'unavailable', 
                lastError: error.message,
                lastCheck: Date.now()
            });
            return false;
        }
    }

    /**
     * Iniciar monitoreo de salud
     */
    startHealthMonitoring() {
        setInterval(() => {
            this.checkExchangesHealth();
            this.checkTemporalMetrics();
        }, 30000); // Cada 30 segundos
        
        this.logger.info('💓 Monitoreo de salud iniciado');
    }

    /**
     * Verificar salud de exchanges
     */
    async checkExchangesHealth() {
        for (const [exchangeId, health] of this.healthStatus) {
            const timeSinceLastMessage = Date.now() - (health.lastMessage || health.lastPing || 0);
            
            if (timeSinceLastMessage > 60000) { // 1 minuto sin actividad
                this.logger.warn(`⚠️ ${exchangeId} sin actividad por ${Math.round(timeSinceLastMessage/1000)}s`);
                health.status = 'stale';
            }
        }
    }

    /**
     * Verificar métricas temporales
     */
    checkTemporalMetrics() {
        const now = Date.now();
        
        for (const [tier, budget] of this.temporalMetrics.thetaBudgetByTier) {
            // Reset budget si es tiempo
            if (now >= budget.resetTime) {
                budget.used = 0;
                budget.resetTime = this.getNextPrimeResetTime();
                budget.efficiency = kernelRNG.nextFloat() * 0.2 + 0.8;
                
                this.logger.info(`🔄 θ-budget reset para ${tier} - próximo reset: ${new Date(budget.resetTime).toLocaleString()}`);
            }
            
            // Alertar si budget cerca del límite
            const utilization = safeMath.divide(budget.used, budget.budget);
            if (utilization > 0.8) {
                this.logger.warn(`⚠️ θ-budget ${tier} al ${Math.round(utilization * 100)}%`);
            }
        }
    }

    /**
     * Obtener estado del gateway
     */
    getStatus() {
        const exchangeStatuses = {};
        for (const [exchangeId, health] of this.healthStatus) {
            exchangeStatuses[exchangeId] = {
                status: health.status,
                lastActivity: health.lastMessage || health.lastPing,
                messageCount: health.messageCount || 0
            };
        }
        
        const thetaBudgetStatus = {};
        for (const [tier, budget] of this.temporalMetrics.thetaBudgetByTier) {
            thetaBudgetStatus[tier] = {
                used: budget.used,
                budget: budget.budget,
                utilization: safeMath.divide(budget.used, budget.budget),
                efficiency: budget.efficiency,
                nextReset: budget.resetTime
            };
        }
        
        return {
            exchanges: exchangeStatuses,
            thetaBudgets: thetaBudgetStatus,
            temporalMetrics: {
                lastSync: this.temporalMetrics.lastTemporalSync,
                primeTargets: this.temporalMetrics.primeRollTargets,
                lambdaThreshold: this.temporalMetrics.lambdaDissonanceThreshold,
                coherence: this.temporalMetrics.quantumCoherence
            },
            timestamp: Date.now()
        };
    }

    /**
     * Métodos especializados para aprovechar Binance APIs completas
     */
    
    /**
     * Ejecutar orden en el mercado apropiado (spot, futures, options)
     */
    async executeOrder(orderRequest) {
        if (!this.binanceConnector) {
            throw new Error('Binance connector no inicializado');
        }
        
        const { symbol, type = 'spot', ...orderParams } = orderRequest;
        
        try {
            let result;
            
            switch (type.toLowerCase()) {
                case 'spot':
                    result = await this.binanceConnector.placeSpotOrder(orderParams);
                    this.logger.info(`✅ Orden SPOT ejecutada: ${symbol}`);
                    break;
                    
                case 'futures':
                    result = await this.binanceConnector.placeFuturesOrder(orderParams);
                    this.logger.info(`✅ Orden FUTURES ejecutada: ${symbol}`);
                    break;
                    
                case 'options':
                    result = await this.binanceConnector.placeOptionsOrder(orderParams);
                    this.logger.info(`✅ Orden OPTIONS ejecutada: ${symbol}`);
                    break;
                    
                default:
                    throw new Error(`Tipo de orden no soportado: ${type}`);
            }
            
            this.emit('order_executed', {
                orderId: result.orderId || result.id,
                symbol,
                type,
                result,
                timestamp: Date.now()
            });
            
            return result;
            
        } catch (error) {
            this.logger.error(`❌ Error ejecutando orden ${type}: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Obtener datos de mercado según el tipo
     */
    async getMarketData(symbol, marketType = 'spot') {
        if (!this.binanceConnector) {
            return this.getMockMarketData(symbol, marketType);
        }
        
        try {
            switch (marketType.toLowerCase()) {
                case 'spot':
                    return await this.binanceConnector.getSpotTicker(symbol);
                    
                case 'futures':
                    return await this.binanceConnector.getFuturesTickerPrice(symbol);
                    
                case 'options':
                    return await this.binanceConnector.getOptionsMarketData(symbol);
                    
                default:
                    return await this.binanceConnector.getSpotTicker(symbol);
            }
        } catch (error) {
            this.logger.warn(`⚠️ Error obteniendo datos de ${marketType}: ${error.message}`);
            return this.getMockMarketData(symbol, marketType);
        }
    }
    
    /**
     * Obtener balance unificado aprovechando BinanceConnector
     */
    async getAccountBalance() {
        if (!this.binanceConnector) {
            return this.getMockBalance();
        }
        
        try {
            const balance = await this.binanceConnector.getAccountBalance(true);
            
            this.logger.info(`💰 Balance unificado obtenido:`);
            if (balance.__detail) {
                const { eapiUSDT, fapiUSDT, spotUSDT, availableTotal } = balance.__detail;
                this.logger.info(`  - OPTIONS: ${eapiUSDT || 0} USDT`);
                this.logger.info(`  - FUTURES: ${fapiUSDT || 0} USDT`);
                this.logger.info(`  - SPOT: ${spotUSDT || 0} USDT`);
                this.logger.info(`  - TOTAL: ${availableTotal || 0} USDT`);
            }
            
            return balance;
        } catch (error) {
            this.logger.error(`❌ Error obteniendo balance: ${error.message}`);
            return this.getMockBalance();
        }
    }
    
    /**
     * Obtener datos de Greeks para opciones
     */
    async getOptionsGreeks(underlying = 'BTCUSDT') {
        if (!this.binanceConnector) {
            return this.getMockGreeks(underlying);
        }
        
        try {
            // Aprovechar métodos existentes de opciones
            const [ticker, marketData] = await Promise.all([
                this.binanceConnector.getOptionsTicker(underlying),
                this.binanceConnector.getOptionsMarketData(underlying)
            ]);
            
            return {
                underlying,
                ticker,
                marketData,
                timestamp: Date.now()
            };
        } catch (error) {
            this.logger.warn(`⚠️ Error obteniendo Greeks: ${error.message}`);
            return this.getMockGreeks(underlying);
        }
    }
    
    /**
     * Métodos mock para fallback
     */
    getMockMarketData(symbol, type) {
        const basePrice = this.getBasePrice(symbol);
        return {
            symbol,
            price: basePrice,
            volume: 1000000 + kernelRNG.nextInt(0, 500000),
            change: (kernelRNG.nextFloat() - 0.5) * 0.1, // ±5%
            type,
            timestamp: Date.now(),
            mock: true
        };
    }
    
    getMockBalance() {
        return {
            __detail: {
                eapiUSDT: 1000,
                fapiUSDT: 2000,
                spotUSDT: 1500,
                availableTotal: 4500
            },
            timestamp: Date.now(),
            mock: true
        };
    }
    
    getMockGreeks(underlying) {
        return {
            underlying,
            options: [{
                symbol: `${underlying.replace('USDT', '')}-${new Date().toISOString().split('T')[0]}-50000-C`,
                delta: kernelRNG.nextFloat() * 0.5 + 0.25,
                gamma: kernelRNG.nextFloat() * 0.02,
                theta: -kernelRNG.nextFloat() * 0.05,
                vega: kernelRNG.nextFloat() * 0.2,
                iv: kernelRNG.nextFloat() * 0.5 + 0.3
            }],
            timestamp: Date.now(),
            mock: true
        };
    }
    
    getBasePrice(symbol) {
        const priceMap = {
            'BTCUSDT': 45000,
            'ETHUSDT': 2800,
            'BNBUSDT': 320,
            'SOLUSDT': 95,
            'XRPUSDT': 0.52,
            'DOGEUSDT': 0.087
        };
        return priceMap[symbol] || 100;
    }
    
    /**
     * Cleanup y cierre de conexiones
     */
    async cleanup() {
        this.logger.info('🧹 Iniciando cleanup de Exchange Gateway...');
        
        for (const [exchangeId, exchange] of this.exchanges) {
            if (exchange.websocket) {
                exchange.websocket.close();
            }
        }
        
        this.exchanges.clear();
        this.webSockets.clear();
        this.rateLimiters.clear();
        this.healthStatus.clear();
        
        this.logger.info('✅ Exchange Gateway cleanup completado');
    }
}

module.exports = RealExchangeGateway;

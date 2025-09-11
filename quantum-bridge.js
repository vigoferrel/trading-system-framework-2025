const EventEmitter = require('events');
const crypto = require('crypto');

/**
 * QUANTUM BRIDGE - SISTEMA UNIFICADO DE FUSIÓN DE SEÑALES
 * ======================================================
 * 
 * Fusiona señales de múltiples fuentes cuánticas:
 * - WebSocket Binance Integration
 * - Integrated Quantum System  
 * - Leonardo Master Controller
 * - Reverse Engineering Core
 * 
 * Respeta reglas del proyecto:
 * - ✅ Kernel RNG solamente (no Math.random)
 * - ✅ Ejecución en segundo plano con métricas
 * - ✅ Binance como fuente única de verdad
 */

class QuantumBridge extends EventEmitter {
    constructor(options = {}) {
        super();
        
        // Configuración del bridge
        this.config = {
            maxSignalAge: options.maxSignalAge || 30000, // 30 segundos
            fusionInterval: options.fusionInterval || 1000, // 1 segundo
            riskThreshold: options.riskThreshold || 0.05, // 5% VaR
            coherenceMinimum: options.coherenceMinimum || 0.6,
            metricsInterval: options.metricsInterval || 5000, // 5 segundos
            ...options
        };
        
        // Estado interno
        this.isActive = false;
        this.signalBuffer = new Map(); // Buffer de señales por símbolo
        this.lastFusion = new Map(); // Última fusión por símbolo
        this.metrics = this.initializeMetrics();
        
        // Sistemas conectados
        this.connectedSystems = {
            websocketManager: null,
            integratedSystem: null,
            leonardoController: null,
            binanceConnectivity: null
        };
        
        // Inicializar kernel RNG
        this.kernelRNG = {
            generateId: () => crypto.randomBytes(16).toString('hex'),
            randomFloat: () => crypto.randomInt(0, 1000000) / 1000000,
            randomInt: (min, max) => crypto.randomInt(min, max + 1),
            temporal: () => crypto.randomInt(-500, 501) // Jitter temporal ±500ms
        };
        
        // Configurar intervalos
        this.intervals = new Map();
        
        console.log('[INIT] Quantum Bridge inicializado con kernel RNG');
    }
    
    /**
     * Inicializar sistema de métricas
     */
    initializeMetrics() {
        return {
            signalsReceived: 0,
            signalsProcessed: 0,
            signalsFused: 0,
            signalsExecuted: 0,
            signalsRejected: 0,
            averageLatency: 0,
            coherenceLevels: [],
            riskMetrics: {
                totalVar: 0,
                circuitBreakerActivations: 0,
                positionSizingAdjustments: 0
            },
            systemHealth: {
                websocketStatus: 'UNKNOWN',
                integratedSystemStatus: 'UNKNOWN',
                leonardoStatus: 'UNKNOWN',
                binanceStatus: 'UNKNOWN'
            },
            uptime: Date.now()
        };
    }
    
    /**
     * Inicializar el Quantum Bridge
     */
    async initialize() {
        console.log('[START] Iniciando Quantum Bridge...');
        
        try {
            // Configurar manejo de señales internas
            this.setupInternalEventHandlers();
            
            // Iniciar bucles de procesamiento
            this.startProcessingLoops();
            
            // Iniciar reporte de métricas
            this.startMetricsReporting();
            
            this.isActive = true;
            console.log('[OK] Quantum Bridge activo y listo para fusionar señales');
            
            return true;
        } catch (error) {
            console.error('[ERROR] Error inicializando Quantum Bridge:', error);
            return false;
        }
    }
    
    /**
     * Conectar sistema WebSocket Manager
     */
    connectWebSocketManager(websocketManager) {
        if (!websocketManager) {
            console.error('[ERROR] WebSocket Manager no proporcionado');
            return false;
        }
        
        this.connectedSystems.websocketManager = websocketManager;
        
        // Escuchar eventos WebSocket
        websocketManager.on('spotPriceUpdate', (data) => {
            this.handleWebSocketSignal('spot', data);
        });
        
        websocketManager.on('futuresUpdate', (data) => {
            this.handleWebSocketSignal('futures', data);
        });
        
        websocketManager.on('optionsUpdate', (data) => {
            this.handleWebSocketSignal('options', data);
        });
        
        this.metrics.systemHealth.websocketStatus = 'CONNECTED';
        console.log('[OK] WebSocket Manager conectado al Quantum Bridge');
        return true;
    }
    
    /**
     * Conectar sistema integrado
     */
    connectIntegratedSystem(integratedSystem) {
        if (!integratedSystem) {
            console.error('[ERROR] Integrated System no proporcionado');
            return false;
        }
        
        this.connectedSystems.integratedSystem = integratedSystem;
        
        // Escuchar eventos del sistema integrado
        integratedSystem.on('quantumSignal', (data) => {
            this.handleIntegratedSystemSignal(data);
        });
        
        integratedSystem.on('marketState', (data) => {
            this.handleMarketStateUpdate(data);
        });
        
        this.metrics.systemHealth.integratedSystemStatus = 'CONNECTED';
        console.log('[OK] Integrated System conectado al Quantum Bridge');
        return true;
    }
    
    /**
     * Conectar Leonardo Controller
     */
    connectLeonardoController(leonardoController) {
        if (!leonardoController) {
            console.error('[ERROR] Leonardo Controller no proporcionado');
            return false;
        }
        
        this.connectedSystems.leonardoController = leonardoController;
        
        // Escuchar recomendaciones cuánticas
        leonardoController.on('quantumRecommendation', (data) => {
            this.handleLeonardoRecommendation(data);
        });
        
        this.metrics.systemHealth.leonardoStatus = 'CONNECTED';
        console.log('[OK] Leonardo Controller conectado al Quantum Bridge');
        return true;
    }
    
    /**
     * Conectar sistema de conectividad Binance
     */
    connectBinanceConnectivity(binanceConnectivity) {
        if (!binanceConnectivity) {
            console.error('[ERROR] Binance Connectivity no proporcionado');
            return false;
        }
        
        this.connectedSystems.binanceConnectivity = binanceConnectivity;
        
        // Escuchar estado de conectividad
        binanceConnectivity.on('connectivityStatus', (status) => {
            this.metrics.systemHealth.binanceStatus = status;
        });
        
        this.metrics.systemHealth.binanceStatus = 'CONNECTED';
        console.log('[OK] Binance Connectivity conectado al Quantum Bridge');
        return true;
    }
    
    /**
     * Manejar señales WebSocket
     */
    handleWebSocketSignal(type, data) {
        const startTime = Date.now();
        
        try {
            this.metrics.signalsReceived++;
            
            // Normalizar señal WebSocket
            const normalizedSignal = this.normalizeWebSocketSignal(type, data);
            
            if (normalizedSignal) {
                this.addSignalToBuffer(normalizedSignal);
                this.metrics.signalsProcessed++;
            }
            
            // Calcular latencia
            const latency = Date.now() - startTime;
            this.updateAverageLatency(latency);
            
        } catch (error) {
            console.error('[ERROR] Error procesando señal WebSocket:', error);
        }
    }
    
    /**
     * Manejar señales del sistema integrado
     */
    handleIntegratedSystemSignal(data) {
        try {
            this.metrics.signalsReceived++;
            
            const normalizedSignal = this.normalizeIntegratedSignal(data);
            
            if (normalizedSignal) {
                this.addSignalToBuffer(normalizedSignal);
                this.metrics.signalsProcessed++;
            }
            
        } catch (error) {
            console.error('[ERROR] Error procesando señal integrada:', error);
        }
    }
    
    /**
     * Manejar actualizaciones de estado de mercado
     */
    handleMarketStateUpdate(data) {
        try {
            const marketSignal = {
                source: 'marketState',
                symbol: data.symbol || 'BTCUSDT',
                timestamp: Date.now(),
                data: {
                    price: data.price,
                    volume: data.volume,
                    volatility: data.volatility
                },
                weight: 0.3 // Peso moderado para estado de mercado
            };
            
            this.addSignalToBuffer(marketSignal);
            
        } catch (error) {
            console.error('[ERROR] Error procesando estado de mercado:', error);
        }
    }
    
    /**
     * Manejar recomendaciones de Leonardo
     */
    handleLeonardoRecommendation(data) {
        try {
            this.metrics.signalsReceived++;
            
            const leonardoSignal = this.normalizeLeonardoSignal(data);
            
            if (leonardoSignal) {
                this.addSignalToBuffer(leonardoSignal);
                this.metrics.signalsProcessed++;
            }
            
        } catch (error) {
            console.error('[ERROR] Error procesando recomendación Leonardo:', error);
        }
    }
    
    /**
     * Normalizar señal WebSocket
     */
    normalizeWebSocketSignal(type, data) {
        if (type === 'spot' && data.symbol && data.price) {
            return {
                source: 'websocket-spot',
                symbol: data.symbol,
                timestamp: data.timestamp || Date.now(),
                data: {
                    price: data.price,
                    originalPrice: data.originalPrice,
                    volume: data.volume,
                    priceChange: data.priceChange,
                    coherenceFactor: data.coherenceFactor || 0.6
                },
                weight: 0.4, // Peso alto para datos en tiempo real
                signalId: this.kernelRNG.generateId()
            };
        }
        
        if (type === 'futures' && data.data && Array.isArray(data.data)) {
            return data.data.map(item => ({
                source: 'websocket-futures',
                symbol: item.symbol,
                timestamp: data.timestamp || Date.now(),
                data: {
                    price: item.price,
                    volume: item.volume,
                    openInterest: item.openInterest,
                    quantumFactor: item.quantumFactor || 0.5
                },
                weight: 0.45, // Peso alto para futuros
                signalId: this.kernelRNG.generateId()
            }));
        }
        
        return null;
    }
    
    /**
     * Normalizar señal del sistema integrado
     */
    normalizeIntegratedSignal(data) {
        if (!data.signal || !data.validation) {
            return null;
        }
        
        return {
            source: 'integrated-system',
            symbol: data.symbol || 'BTCUSDT',
            timestamp: Date.now(),
            data: {
                direction: data.signal.direction,
                strength: data.signal.strength,
                confidence: data.signal.confidence,
                resonance: data.signal.resonance,
                validation: data.validation,
                recommendation: data.validation.recommendation
            },
            weight: 0.5, // Peso alto para señales validadas
            signalId: this.kernelRNG.generateId()
        };
    }
    
    /**
     * Normalizar recomendación Leonardo
     */
    normalizeLeonardoSignal(data) {
        if (!data.symbol || !data.quantum_score) {
            return null;
        }
        
        return {
            source: 'leonardo-controller',
            symbol: data.symbol,
            timestamp: Date.now(),
            data: {
                quantumScore: data.quantum_score,
                archetype: data.archetype,
                quantumFactors: data.quantum_factors,
                strength: data.strength,
                recommendation: data.recommendation,
                marketData: data.market_data
            },
            weight: 0.35, // Peso moderado para recomendaciones
            signalId: this.kernelRNG.generateId()
        };
    }
    
    /**
     * Agregar señal al buffer
     */
    addSignalToBuffer(signal) {
        if (Array.isArray(signal)) {
            // Manejar múltiples señales
            signal.forEach(s => this.addSingleSignalToBuffer(s));
        } else {
            this.addSingleSignalToBuffer(signal);
        }
    }
    
    addSingleSignalToBuffer(signal) {
        if (!signal || !signal.symbol) return;
        
        const symbol = signal.symbol;
        
        if (!this.signalBuffer.has(symbol)) {
            this.signalBuffer.set(symbol, []);
        }
        
        const symbolBuffer = this.signalBuffer.get(symbol);
        symbolBuffer.push(signal);
        
        // Limpiar señales antiguas
        const now = Date.now();
        const cleanBuffer = symbolBuffer.filter(s => 
            (now - s.timestamp) <= this.config.maxSignalAge
        );
        
        this.signalBuffer.set(symbol, cleanBuffer);
    }
    
    /**
     * Configurar manejadores de eventos internos
     */
    setupInternalEventHandlers() {
        // Manejar señales fusionadas
        this.on('fusedSignal', async (fusedSignal) => {
            try {
                await this.handleFusedSignal(fusedSignal);
            } catch (error) {
                console.error('[ERROR] Error manejando señal fusionada:', error);
            }
        });
        
        // Manejar errores
        this.on('error', (error) => {
            console.error('[ERROR] Quantum Bridge error:', error);
        });
    }
    
    /**
     * Iniciar bucles de procesamiento
     */
    startProcessingLoops() {
        // Bucle principal de fusión
        const fusionLoop = setInterval(() => {
            this.processFusion();
        }, this.config.fusionInterval + this.kernelRNG.temporal());
        
        this.intervals.set('fusion', fusionLoop);
        
        // Bucle de limpieza
        const cleanupLoop = setInterval(() => {
            this.cleanupOldData();
        }, 60000); // Cada minuto
        
        this.intervals.set('cleanup', cleanupLoop);
    }
    
    /**
     * Procesar fusión de señales
     */
    processFusion() {
        if (!this.isActive) return;
        
        for (const [symbol, signals] of this.signalBuffer.entries()) {
            if (signals.length >= 2) { // Mínimo 2 señales para fusión
                const fusedSignal = this.fuseSignals(symbol, signals);
                
                if (fusedSignal && this.validateFusedSignal(fusedSignal)) {
                    this.lastFusion.set(symbol, fusedSignal);
                    this.emit('fusedSignal', fusedSignal);
                    this.metrics.signalsFused++;
                }
            }
        }
    }
    
    /**
     * Fusionar señales para un símbolo
     */
    fuseSignals(symbol, signals) {
        try {
            const now = Date.now();
            const validSignals = signals.filter(s => 
                (now - s.timestamp) <= this.config.maxSignalAge
            );
            
            if (validSignals.length === 0) return null;
            
            // Calcular pesos normalizados
            const totalWeight = validSignals.reduce((sum, s) => sum + s.weight, 0);
            const normalizedSignals = validSignals.map(s => ({
                ...s,
                normalizedWeight: s.weight / totalWeight
            }));
            
            // Fusionar datos de mercado
            const marketData = this.fuseMarketData(normalizedSignals);
            
            // Fusionar señales cuánticas
            const quantumSignal = this.fuseQuantumSignals(normalizedSignals);
            
            // Calcular métricas de fusión
            const fusionMetrics = this.calculateFusionMetrics(normalizedSignals);
            
            // Evaluación de riesgo
            const riskAssessment = this.calculateRiskAssessment(marketData, quantumSignal);
            
            // Validación
            const validation = this.validateQuantumFusion(quantumSignal, riskAssessment);
            
            return {
                signalId: this.kernelRNG.generateId(),
                timestamp: now,
                symbol,
                marketData,
                quantumSignal,
                fusionMetrics,
                riskAssessment,
                validation,
                metadata: {
                    archetype: this.getSymbolArchetype(symbol, normalizedSignals),
                    executionContext: 'REAL', // Siempre real para trading
                    kernelEntropyUsed: true,
                    backgroundExecution: true,
                    binanceConnectivity: this.metrics.systemHealth.binanceStatus
                }
            };
            
        } catch (error) {
            console.error(`[ERROR] Error fusionando señales para ${symbol}:`, error);
            return null;
        }
    }
    
    /**
     * Fusionar datos de mercado
     */
    fuseMarketData(signals) {
        let price = 0, originalPrice = 0, volume = 0, volatility = 0, priceChange24h = 0;
        let priceCount = 0, volumeCount = 0, volatilityCount = 0, changeCount = 0;
        
        signals.forEach(signal => {
            if (signal.data.price) {
                price += signal.data.price * signal.normalizedWeight;
                priceCount++;
            }
            if (signal.data.originalPrice) {
                originalPrice += signal.data.originalPrice * signal.normalizedWeight;
            }
            if (signal.data.volume) {
                volume += signal.data.volume * signal.normalizedWeight;
                volumeCount++;
            }
            if (signal.data.volatility) {
                volatility += signal.data.volatility * signal.normalizedWeight;
                volatilityCount++;
            }
            if (signal.data.priceChange || signal.data.change_24h) {
                const change = signal.data.priceChange || signal.data.change_24h || 0;
                priceChange24h += change * signal.normalizedWeight;
                changeCount++;
            }
        });
        
        return {
            price: priceCount > 0 ? price : 0,
            originalPrice: originalPrice || price,
            volume: volumeCount > 0 ? volume : 0,
            volatility: volatilityCount > 0 ? volatility : 0,
            priceChange24h: changeCount > 0 ? priceChange24h : 0
        };
    }
    
    /**
     * Fusionar señales cuánticas
     */
    fuseQuantumSignals(signals) {
        let strength = 0, confidence = 0, coherence = 0;
        let consciousness = 0, resonance = 0, quantumScore = 0;
        let directions = { LONG: 0, SHORT: 0, NEUTRAL: 0 };
        
        signals.forEach(signal => {
            const weight = signal.normalizedWeight;
            
            // Fusionar métricas numéricas
            if (signal.data.strength) strength += signal.data.strength * weight;
            if (signal.data.confidence) confidence += signal.data.confidence * weight;
            if (signal.data.coherenceFactor) coherence += signal.data.coherenceFactor * weight;
            if (signal.data.quantumFactors?.coherence) coherence += signal.data.quantumFactors.coherence * weight;
            if (signal.data.quantumFactors?.lambda_resonance) consciousness += signal.data.quantumFactors.lambda_resonance * weight;
            if (signal.data.resonance) resonance += signal.data.resonance * weight;
            if (signal.data.quantumScore) quantumScore += signal.data.quantumScore * weight;
            
            // Fusionar direcciones
            if (signal.data.direction) {
                directions[signal.data.direction] += weight;
            } else if (signal.data.recommendation?.includes('LONG')) {
                directions.LONG += weight;
            } else if (signal.data.recommendation?.includes('SHORT')) {
                directions.SHORT += weight;
            } else {
                directions.NEUTRAL += weight;
            }
        });
        
        // Determinar dirección final
        const finalDirection = Object.keys(directions).reduce((a, b) => 
            directions[a] > directions[b] ? a : b
        );
        
        return {
            direction: finalDirection,
            strength: Math.min(strength, 1.0),
            confidence: Math.min(confidence, 1.0),
            coherence: Math.min(coherence, 1.0),
            consciousness: Math.min(consciousness, 1.0),
            resonance: resonance,
            quantumScore: Math.min(quantumScore, 100)
        };
    }
    
    /**
     * Calcular métricas de fusión
     */
    calculateFusionMetrics(signals) {
        const websocketSignals = signals.filter(s => s.source.includes('websocket'));
        const coreSignals = signals.filter(s => s.source.includes('integrated'));
        const leonardoSignals = signals.filter(s => s.source.includes('leonardo'));
        
        const totalWeight = signals.reduce((sum, s) => sum + s.normalizedWeight, 0);
        
        return {
            sourcesCount: signals.length,
            websocketWeight: websocketSignals.reduce((sum, s) => sum + s.normalizedWeight, 0),
            coreSystemWeight: coreSignals.reduce((sum, s) => sum + s.normalizedWeight, 0),
            leonardoWeight: leonardoSignals.reduce((sum, s) => sum + s.normalizedWeight, 0),
            temporalDecay: this.calculateTemporalDecay(signals),
            agreementLevel: this.calculateAgreementLevel(signals)
        };
    }
    
    /**
     * Calcular decaimiento temporal
     */
    calculateTemporalDecay(signals) {
        const now = Date.now();
        const ages = signals.map(s => now - s.timestamp);
        const maxAge = Math.max(...ages);
        const avgAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
        
        return Math.max(0, 1 - (avgAge / this.config.maxSignalAge));
    }
    
    /**
     * Calcular nivel de acuerdo entre fuentes
     */
    calculateAgreementLevel(signals) {
        if (signals.length < 2) return 1.0;
        
        // Calcular acuerdo basado en direcciones similares
        const directions = signals.map(s => {
            if (s.data.direction) return s.data.direction;
            if (s.data.recommendation?.includes('LONG')) return 'LONG';
            if (s.data.recommendation?.includes('SHORT')) return 'SHORT';
            return 'NEUTRAL';
        });
        
        const uniqueDirections = [...new Set(directions)];
        return Math.max(0, 1 - (uniqueDirections.length - 1) * 0.3);
    }
    
    /**
     * Calcular evaluación de riesgo
     */
    calculateRiskAssessment(marketData, quantumSignal) {
        const volatility = marketData.volatility || 0.02;
        const strength = quantumSignal.strength || 0.5;
        const confidence = quantumSignal.confidence || 0.5;
        
        // Calcular VaR simplificado
        const var95 = volatility * 2.33; // 95% VaR
        
        // Calcular tamaño de posición adaptable
        const baseSize = 100; // USDT base
        const confidenceMultiplier = Math.min(confidence * 2, 2.0);
        const volatilityAdjustment = Math.max(0.1, 1 - volatility * 10);
        const positionSize = baseSize * confidenceMultiplier * volatilityAdjustment;
        
        // Leverage basado en confianza y coherencia
        const leverage = Math.min(20, Math.max(1, Math.floor(
            (confidence + quantumSignal.coherence) * 10
        )));
        
        // Circuit breaker
        const circuitBreakerTriggered = var95 > this.config.riskThreshold || 
                                       volatility > 0.15;
        
        if (circuitBreakerTriggered) {
            this.metrics.riskMetrics.circuitBreakerActivations++;
        }
        
        return {
            var: var95,
            positionSize: circuitBreakerTriggered ? 0 : positionSize,
            leverage: circuitBreakerTriggered ? 1 : leverage,
            stopLoss: Math.max(1, volatility * 200), // Stop loss en %
            takeProfit: Math.max(2, volatility * 400), // Take profit en %
            maxDrawdown: var95 * 100, // En %
            circuitBreakerTriggered
        };
    }
    
    /**
     * Validar fusión cuántica
     */
    validateQuantumFusion(quantumSignal, riskAssessment) {
        const passedFilters = [];
        const failedFilters = [];
        let validationScore = 0;
        
        // Filtro de coherencia mínima
        if (quantumSignal.coherence >= this.config.coherenceMinimum) {
            passedFilters.push('coherence_minimum');
            validationScore += 0.2;
        } else {
            failedFilters.push('coherence_minimum');
        }
        
        // Filtro de confianza
        if (quantumSignal.confidence >= 0.5) {
            passedFilters.push('confidence_threshold');
            validationScore += 0.2;
        } else {
            failedFilters.push('confidence_threshold');
        }
        
        // Filtro de fuerza
        if (quantumSignal.strength >= 0.3) {
            passedFilters.push('strength_minimum');
            validationScore += 0.2;
        } else {
            failedFilters.push('strength_minimum');
        }
        
        // Filtro de riesgo
        if (!riskAssessment.circuitBreakerTriggered) {
            passedFilters.push('risk_acceptable');
            validationScore += 0.2;
        } else {
            failedFilters.push('risk_too_high');
        }
        
        // Filtro de dirección válida
        if (quantumSignal.direction !== 'NEUTRAL') {
            passedFilters.push('direction_clear');
            validationScore += 0.2;
        } else {
            failedFilters.push('direction_unclear');
        }
        
        const isValid = validationScore >= 0.6 && failedFilters.length === 0;
        
        let recommendation;
        if (isValid && validationScore >= 0.8) {
            recommendation = 'EXECUTE';
        } else if (isValid && validationScore >= 0.6) {
            recommendation = 'HOLD';
        } else {
            recommendation = 'REJECT';
        }
        
        return {
            isValid,
            validationScore,
            passedFilters,
            failedFilters,
            recommendation
        };
    }
    
    /**
     * Obtener arquetipo del símbolo
     */
    getSymbolArchetype(symbol, signals) {
        // Buscar arquetipo en señales de Leonardo
        const leonardoSignal = signals.find(s => s.source === 'leonardo-controller');
        if (leonardoSignal && leonardoSignal.data.archetype) {
            return leonardoSignal.data.archetype;
        }
        
        // Arquetipos por defecto
        const archetypes = {
            'BTCUSDT': '👑 El Emperador',
            'ETHUSDT': '🌙 La Suma Sacerdotisa',
            'BNBUSDT': '👸 La Emperatriz',
            'SOLUSDT': '☀️ El Sol',
            'DOGEUSDT': '🃏 El Loco'
        };
        
        return archetypes[symbol] || '🔍 El Explorador';
    }
    
    /**
     * Manejar señal fusionada
     */
    async handleFusedSignal(fusedSignal) {
        try {
            console.log(`[FUSION] ${fusedSignal.symbol}: ${fusedSignal.quantumSignal.direction} ` +
                       `(Score: ${fusedSignal.quantumSignal.quantumScore.toFixed(1)}, ` +
                       `Coherence: ${(fusedSignal.quantumSignal.coherence * 100).toFixed(1)}%)`);
            
            // Validar antes de ejecutar
            if (fusedSignal.validation.recommendation === 'EXECUTE') {
                await this.executeFusedSignal(fusedSignal);
            } else if (fusedSignal.validation.recommendation === 'REJECT') {
                this.metrics.signalsRejected++;
                console.log(`[REJECT] ${fusedSignal.symbol}: ${fusedSignal.validation.failedFilters.join(', ')}`);
            }
            
        } catch (error) {
            console.error('[ERROR] Error manejando señal fusionada:', error);
        }
    }
    
    /**
     * Ejecutar señal fusionada
     */
    async executeFusedSignal(fusedSignal) {
        if (!this.connectedSystems.binanceConnectivity) {
            console.warn('[WARNING] No hay conectividad Binance disponible para ejecutar señal');
            return false;
        }
        
        try {
            const orderParams = {
                symbol: fusedSignal.symbol,
                side: fusedSignal.quantumSignal.direction,
                quantity: this.calculateOrderQuantity(fusedSignal),
                type: 'MARKET',
                leverage: fusedSignal.riskAssessment.leverage,
                stopLoss: fusedSignal.riskAssessment.stopLoss,
                takeProfit: fusedSignal.riskAssessment.takeProfit
            };
            
            // Ejecutar a través del sistema de conectividad
            const result = await this.connectedSystems.binanceConnectivity.executeOrder(orderParams);
            
            if (result.success) {
                this.metrics.signalsExecuted++;
                console.log(`[EXECUTED] ${fusedSignal.symbol}: ${fusedSignal.quantumSignal.direction} ` +
                           `${orderParams.quantity} @ ${fusedSignal.marketData.price}`);
                
                // Emitir evento de ejecución exitosa
                this.emit('signalExecuted', {
                    fusedSignal,
                    orderResult: result,
                    executionTime: Date.now()
                });
                
                return true;
            } else {
                console.error(`[EXECUTION_FAILED] ${fusedSignal.symbol}: ${result.error}`);
                return false;
            }
            
        } catch (error) {
            console.error('[ERROR] Error ejecutando señal:', error);
            return false;
        }
    }
    
    /**
     * Calcular cantidad de orden
     */
    calculateOrderQuantity(fusedSignal) {
        const positionSizeUSDT = fusedSignal.riskAssessment.positionSize;
        const price = fusedSignal.marketData.price;
        
        if (!price || price <= 0) return 0;
        
        let quantity = positionSizeUSDT / price;
        
        // Ajustar a step size típico (0.001 para la mayoría)
        quantity = Math.floor(quantity * 1000) / 1000;
        
        return Math.max(0.001, quantity);
    }
    
    /**
     * Actualizar latencia promedio
     */
    updateAverageLatency(newLatency) {
        if (this.metrics.averageLatency === 0) {
            this.metrics.averageLatency = newLatency;
        } else {
            this.metrics.averageLatency = (this.metrics.averageLatency * 0.9) + (newLatency * 0.1);
        }
    }
    
    /**
     * Validar señal fusionada
     */
    validateFusedSignal(fusedSignal) {
        if (!fusedSignal || !fusedSignal.quantumSignal) return false;
        
        // Actualizar métricas de coherencia
        this.metrics.coherenceLevels.push(fusedSignal.quantumSignal.coherence);
        if (this.metrics.coherenceLevels.length > 100) {
            this.metrics.coherenceLevels = this.metrics.coherenceLevels.slice(-100);
        }
        
        return fusedSignal.validation.isValid;
    }
    
    /**
     * Iniciar reporte de métricas
     */
    startMetricsReporting() {
        const metricsLoop = setInterval(() => {
            this.reportMetrics();
        }, this.config.metricsInterval);
        
        this.intervals.set('metrics', metricsLoop);
    }
    
    /**
     * Reportar métricas
     */
    reportMetrics() {
        const uptime = Date.now() - this.metrics.uptime;
        const uptimeMinutes = Math.floor(uptime / 60000);
        
        const avgCoherence = this.metrics.coherenceLevels.length > 0 
            ? this.metrics.coherenceLevels.reduce((sum, c) => sum + c, 0) / this.metrics.coherenceLevels.length
            : 0;
        
        console.log(`[METRICS] Uptime: ${uptimeMinutes}m | ` +
                   `Signals: R:${this.metrics.signalsReceived} P:${this.metrics.signalsProcessed} ` +
                   `F:${this.metrics.signalsFused} E:${this.metrics.signalsExecuted} ` +
                   `| Coherence: ${(avgCoherence * 100).toFixed(1)}% ` +
                   `| Latency: ${this.metrics.averageLatency.toFixed(1)}ms`);
    }
    
    /**
     * Limpiar datos antiguos
     */
    cleanupOldData() {
        const now = Date.now();
        
        // Limpiar buffer de señales
        for (const [symbol, signals] of this.signalBuffer.entries()) {
            const cleanSignals = signals.filter(s => 
                (now - s.timestamp) <= this.config.maxSignalAge * 2
            );
            
            if (cleanSignals.length === 0) {
                this.signalBuffer.delete(symbol);
            } else {
                this.signalBuffer.set(symbol, cleanSignals);
            }
        }
        
        // Limpiar fusiones antiguas
        for (const [symbol, fusion] of this.lastFusion.entries()) {
            if ((now - fusion.timestamp) > 300000) { // 5 minutos
                this.lastFusion.delete(symbol);
            }
        }
    }
    
    /**
     * Obtener estado del sistema
     */
    getSystemStatus() {
        return {
            isActive: this.isActive,
            uptime: Date.now() - this.metrics.uptime,
            connectedSystems: Object.keys(this.connectedSystems)
                .filter(key => this.connectedSystems[key] !== null),
            bufferStatus: {
                activeSymbols: this.signalBuffer.size,
                totalSignals: Array.from(this.signalBuffer.values())
                    .reduce((sum, signals) => sum + signals.length, 0)
            },
            metrics: this.metrics,
            config: this.config
        };
    }
    
    /**
     * Detener el Quantum Bridge
     */
    stop() {
        console.log('[STOP] Deteniendo Quantum Bridge...');
        
        this.isActive = false;
        
        // Limpiar intervalos
        for (const [name, interval] of this.intervals.entries()) {
            clearInterval(interval);
            console.log(`[OK] Intervalo ${name} detenido`);
        }
        
        this.intervals.clear();
        
        // Desconectar sistemas
        Object.keys(this.connectedSystems).forEach(key => {
            this.connectedSystems[key] = null;
        });
        
        console.log('[OK] Quantum Bridge detenido');
    }
}

module.exports = QuantumBridge;

// Si se ejecuta directamente, crear instancia de demostración
if (require.main === module) {
    const bridge = new QuantumBridge({
        fusionInterval: 2000, // 2 segundos para demo
        metricsInterval: 10000 // 10 segundos para demo
    });
    
    bridge.initialize().then(success => {
        if (success) {
            console.log('\n🌉 Quantum Bridge Demo iniciado');
            console.log('⚡ Listo para fusionar señales cuánticas');
            console.log('🔒 Kernel RNG activo');
            console.log('📊 Métricas en segundo plano activas\n');
        } else {
            console.error('❌ Error iniciando Quantum Bridge Demo');
            process.exit(1);
        }
    });
    
    // Manejar cierre graceful
    process.on('SIGINT', () => {
        console.log('\n⏹️ Cerrando Quantum Bridge...');
        bridge.stop();
        process.exit(0);
    });
}

/**
 * QUANTUM EVENT ORCHESTRATOR
 * ==========================
 * 
 * Sistema avanzado de orquestación de eventos algorithmics con:
 * - Timeouts configurables y cancelación
 * - Health checks y watchdogs
 * - Hooks de ciclo de vida
 * - Logging estructurado
 * - Backpressure y rate limiting
 * - Manejo de errores robusto
 * 
 * Eventos soportados:
 * - quantumSignal: Señales cuánticas del motor
 * - coherenceChange: Cambios en coherencia cuántica
 * - energyLevelShift: Cambios de nivel de energía
 * - phaseTransition: Transiciones de fase
 * - resonanceDetected: Detección de resonancia
 * - systemError: Errores del sistema
 * - healthCheck: Verificaciones de salud
 */

const { EventEmitter } = require('events');
const { VALIDATION_CONSTANTS } = require('../constants/validation-constants');
const { validateRange, clampValue } = require('../utils/safe-math');

/**
 * @typedef {Object} EventDefinition
 * @property {string} name - Nombre del evento
 * @property {string} description - Descripción del evento
 * @property {Object} payloadSchema - Esquema del payload
 * @property {number} frequency - Frecuencia esperada (Hz)
 * @property {number} priority - Prioridad (1-10, 10 = máxima)
 * @property {boolean} cancellable - Si el evento puede ser cancelado
 */

/**
 * @typedef {Object} EventMetrics
 * @property {number} totalEmitted - Total de eventos emitidos
 * @property {number} totalProcessed - Total de eventos procesados
 * @property {number} totalErrors - Total de errores
 * @property {number} averageProcessingTime - Tiempo promedio de procesamiento (ms)
 * @property {number} lastEmittedAt - Timestamp del último evento emitido
 */

/**
 * Definiciones de eventos algorithmics con esquemas JSDoc
 */
const QUANTUM_EVENTS = {
    /**
     * Evento emitido cuando se detecta una nueva señal cuántica.
     * @event QuantumEventOrchestrator#quantumSignal
     * @type {Object}
     * @property {number} timestamp - Timestamp de la señal
     * @property {string} symbol - Símbolo financiero
     * @property {number} coherence - Nivel de coherencia [0,1]
     * @property {number} energy - Nivel de energía [0,100]
     * @property {number} phase - Fase cuántica [-2π,2π]
     * @property {Object} data - Datos adicionales de la señal
     */
    quantumSignal: {
        name: 'quantumSignal',
        description: 'Nueva señal cuántica detectada',
        payloadSchema: {
            timestamp: { type: 'number', required: true },
            symbol: { type: 'string', required: true },
            coherence: { type: 'number', min: 0, max: 1, required: true },
            energy: { type: 'number', min: 0, max: 100, required: true },
            phase: { type: 'number', min: -2 * Math.PI, max: 2 * Math.PI, required: true },
            data: { type: 'object', required: false }
        },
        frequency: 10, // 10 Hz
        priority: 8,
        cancellable: false
    },
    
    /**
     * Evento emitido cuando cambia la coherencia cuántica.
     * @event QuantumEventOrchestrator#coherenceChange
     * @type {Object}
     * @property {number} timestamp - Timestamp del cambio
     * @property {number} oldCoherence - Coherencia anterior [0,1]
     * @property {number} newCoherence - Nueva coherencia [0,1]
     * @property {string} reason - Razón del cambio
     */
    coherenceChange: {
        name: 'coherenceChange',
        description: 'Cambio en la coherencia cuántica del sistema',
        payloadSchema: {
            timestamp: { type: 'number', required: true },
            oldCoherence: { type: 'number', min: 0, max: 1, required: true },
            newCoherence: { type: 'number', min: 0, max: 1, required: true },
            reason: { type: 'string', required: false }
        },
        frequency: 2, // 2 Hz
        priority: 6,
        cancellable: true
    },
    
    /**
     * Evento emitido cuando se detecta un cambio de nivel de energía.
     * @event QuantumEventOrchestrator#energyLevelShift
     * @type {Object}
     * @property {number} timestamp - Timestamp del cambio
     * @property {number} deltaEnergy - Cambio de energía
     * @property {number} currentLevel - Nivel actual [0,100]
     * @property {string} direction - Dirección del cambio ('up'|'down')
     */
    energyLevelShift: {
        name: 'energyLevelShift',
        description: 'Cambio en el nivel de energía cuántica',
        payloadSchema: {
            timestamp: { type: 'number', required: true },
            deltaEnergy: { type: 'number', required: true },
            currentLevel: { type: 'number', min: 0, max: 100, required: true },
            direction: { type: 'string', enum: ['up', 'down'], required: true }
        },
        frequency: 5, // 5 Hz
        priority: 7,
        cancellable: false
    },
    
    /**
     * Evento emitido durante transiciones de fase cuántica.
     * @event QuantumEventOrchestrator#phaseTransition
     * @type {Object}
     * @property {number} timestamp - Timestamp de la transición
     * @property {number} fromPhase - Fase inicial [-2π,2π]
     * @property {number} toPhase - Fase final [-2π,2π]
     * @property {number} transitionSpeed - Velocidad de transición
     */
    phaseTransition: {
        name: 'phaseTransition',
        description: 'Transición de fase cuántica en progreso',
        payloadSchema: {
            timestamp: { type: 'number', required: true },
            fromPhase: { type: 'number', min: -2 * Math.PI, max: 2 * Math.PI, required: true },
            toPhase: { type: 'number', min: -2 * Math.PI, max: 2 * Math.PI, required: true },
            transitionSpeed: { type: 'number', min: 0, required: true }
        },
        frequency: 1, // 1 Hz
        priority: 5,
        cancellable: true
    },
    
    /**
     * Evento emitido cuando se detecta resonancia en 888 MHz.
     * @event QuantumEventOrchestrator#resonanceDetected
     * @type {Object}
     * @property {number} timestamp - Timestamp de la detección
     * @property {number} frequency - Frecuencia de resonancia (MHz)
     * @property {number} amplitude - Amplitud de la resonancia
     * @property {string} source - Fuente de la resonancia
     */
    resonanceDetected: {
        name: 'resonanceDetected',
        description: 'Resonancia cuántica detectada a 888 MHz',
        payloadSchema: {
            timestamp: { type: 'number', required: true },
            frequency: { type: 'number', min: 100, max: 2000, required: true },
            amplitude: { type: 'number', min: 0, required: true },
            source: { type: 'string', required: false }
        },
        frequency: 0.1, // 0.1 Hz (cada 10 segundos)
        priority: 9,
        cancellable: false
    },
    
    /**
     * Evento emitido cuando ocurre un error en el sistema.
     * @event QuantumEventOrchestrator#systemError
     * @type {Object}
     * @property {number} timestamp - Timestamp del error
     * @property {string} errorType - Tipo de error
     * @property {string} message - Mensaje de error
     * @property {Object} context - Contexto del error
     * @property {boolean} recoverable - Si el error es recuperable
     */
    systemError: {
        name: 'systemError',
        description: 'Error ocurrido en el sistema algorithmic',
        payloadSchema: {
            timestamp: { type: 'number', required: true },
            errorType: { type: 'string', required: true },
            message: { type: 'string', required: true },
            context: { type: 'object', required: false },
            recoverable: { type: 'boolean', required: true }
        },
        frequency: 0.01, // 0.01 Hz (cada 100 segundos, esperando pocos errores)
        priority: 10,
        cancellable: false
    },
    
    /**
     * Evento emitido durante health checks periódicos.
     * @event QuantumEventOrchestrator#healthCheck
     * @type {Object}
     * @property {number} timestamp - Timestamp del health check
     * @property {string} component - Componente verificado
     * @property {string} status - Estado ('healthy'|'degraded'|'unhealthy')
     * @property {Object} metrics - Métricas de salud
     */
    healthCheck: {
        name: 'healthCheck',
        description: 'Resultado de verificación de salud de componente',
        payloadSchema: {
            timestamp: { type: 'number', required: true },
            component: { type: 'string', required: true },
            status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'], required: true },
            metrics: { type: 'object', required: false }
        },
        frequency: 0.033, // ~0.033 Hz (cada 30 segundos)
        priority: 4,
        cancellable: true
    }
};

/**
 * Cola de eventos con control de backpressure
 */
class EventQueue {
    constructor(maxSize = 10000) {
        this.queue = [];
        this.maxSize = maxSize;
        this.droppedCount = 0;
    }
    
    enqueue(event) {
        if (this.queue.length >= this.maxSize) {
            // Remover evento de menor prioridad
            const minPriorityIndex = this.findMinPriorityIndex();
            if (minPriorityIndex !== -1 && 
                this.queue[minPriorityIndex].priority < event.priority) {
                this.queue.splice(minPriorityIndex, 1);
            } else {
                this.droppedCount++;
                return false;
            }
        }
        
        // Insertar en orden de prioridad
        let insertIndex = 0;
        while (insertIndex < this.queue.length && 
               this.queue[insertIndex].priority >= event.priority) {
            insertIndex++;
        }
        
        this.queue.splice(insertIndex, 0, event);
        return true;
    }
    
    dequeue() {
        return this.queue.shift();
    }
    
    size() {
        return this.queue.length;
    }
    
    findMinPriorityIndex() {
        if (this.queue.length === 0) return -1;
        
        let minPriority = this.queue[0].priority;
        let minIndex = 0;
        
        for (let i = 1; i < this.queue.length; i++) {
            if (this.queue[i].priority < minPriority) {
                minPriority = this.queue[i].priority;
                minIndex = i;
            }
        }
        
        return minIndex;
    }
    
    getStats() {
        return {
            size: this.queue.length,
            maxSize: this.maxSize,
            droppedCount: this.droppedCount,
            utilizationPercent: (this.queue.length / this.maxSize) * 100
        };
    }
}

/**
 * Promesa cancelable para timeouts
 */
class CancellablePromise {
    constructor(executor, timeoutMs = 0) {
        this.cancelled = false;
        this.timeoutId = null;
        
        this.promise = new Promise((resolve, reject) => {
            if (timeoutMs > 0) {
                this.timeoutId = setTimeout(() => {
                    if (!this.cancelled) {
                        this.cancelled = true;
                        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
                    }
                }, timeoutMs);
            }
            
            executor(
                (value) => {
                    if (!this.cancelled) {
                        if (this.timeoutId) clearTimeout(this.timeoutId);
                        resolve(value);
                    }
                },
                (reason) => {
                    if (!this.cancelled) {
                        if (this.timeoutId) clearTimeout(this.timeoutId);
                        reject(reason);
                    }
                }
            );
        });
    }
    
    cancel() {
        if (!this.cancelled) {
            this.cancelled = true;
            if (this.timeoutId) clearTimeout(this.timeoutId);
        }
    }
    
    then(onFulfilled, onRejected) {
        return this.promise.then(onFulfilled, onRejected);
    }
    
    catch(onRejected) {
        return this.promise.catch(onRejected);
    }
}

/**
 * Orquestador principal de eventos algorithmics
 */
class QuantumEventOrchestrator extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.options = {
            maxListeners: options.maxListeners || 100,
            queueSize: options.queueSize || 10000,
            healthCheckInterval: options.healthCheckInterval || 30000, // 30s
            defaultTimeout: options.defaultTimeout || VALIDATION_CONSTANTS.DEFAULT_TIMEOUT,
            enableLogging: options.enableLogging !== false,
            enableMetrics: options.enableMetrics !== false,
            ...options
        };
        
        // Configurar límite de listeners
        this.setMaxListeners(this.options.maxListeners);
        
        // Estado del sistema
        this.state = {
            isRunning: false,
            startedAt: null,
            lastHealthCheck: null,
            totalEventsProcessed: 0,
            totalErrors: 0,
            components: new Map() // component name -> health status
        };
        
        // Cola de eventos con backpressure
        this.eventQueue = new EventQueue(this.options.queueSize);
        
        // Métricas por evento
        this.metrics = new Map();
        this.initializeMetrics();
        
        // Promesas activas para cancelación
        this.activePromises = new Set();
        
        // Health check interval
        this.healthCheckInterval = null;
        
        // Rate limiting
        this.rateLimiter = new Map(); // eventName -> { count, windowStart }
        
        // Hooks de ciclo de vida
        this.lifecycleHooks = {
            onStart: [],
            onStop: [],
            onError: [],
            onRecover: []
        };
        
        this.setupErrorHandling();
        this.log('QuantumEventOrchestrator initialized', { options: this.options });
    }
    
    /**
     * Inicializar métricas para todos los eventos definidos
     */
    initializeMetrics() {
        for (const eventName of Object.keys(QUANTUM_EVENTS)) {
            this.metrics.set(eventName, {
                totalEmitted: 0,
                totalProcessed: 0,
                totalErrors: 0,
                averageProcessingTime: 0,
                lastEmittedAt: 0,
                processingTimes: []
            });
        }
    }
    
    /**
     * Configurar manejo de errores
     */
    setupErrorHandling() {
        this.on('error', (error) => {
            this.state.totalErrors++;
            this.log('System error occurred', { error: error.message, stack: error.stack }, 'error');
            
            // Ejecutar hooks de error
            this.executeHooks('onError', error);
            
            // Emitir evento de error del sistema
            this.emitQuantumEvent('systemError', {
                timestamp: Date.now(),
                errorType: error.constructor.name,
                message: error.message,
                context: { stack: error.stack },
                recoverable: true
            });
        });
        
        // Manejar errores no capturados
        process.on('uncaughtException', (error) => {
            this.log('Uncaught exception', { error: error.message }, 'error');
            this.emit('error', error);
        });
        
        process.on('unhandledRejection', (reason, promise) => {
            this.log('Unhandled promise rejection', { reason }, 'error');
            this.emit('error', new Error(`Unhandled rejection: ${reason}`));
        });
    }
    
    /**
     * Iniciar el orquestador
     * @param {Object} config - Configuración adicional
     * @returns {Promise<void>}
     */
    async start(config = {}) {
        if (this.state.isRunning) {
            throw new Error('QuantumEventOrchestrator is already running');
        }
        
        try {
            this.log('Starting QuantumEventOrchestrator...');
            
            // Ejecutar hooks de inicio
            await this.executeHooks('onStart', config);
            
            // Actualizar estado
            this.state.isRunning = true;
            this.state.startedAt = Date.now();
            
            // Iniciar health checks
            this.startHealthChecks();
            
            // Iniciar procesamiento de cola
            this.startEventProcessing();
            
            this.log('QuantumEventOrchestrator started successfully');
            
        } catch (error) {
            this.log('Failed to start QuantumEventOrchestrator', { error: error.message }, 'error');
            throw error;
        }
    }
    
    /**
     * Detener el orquestador
     * @returns {Promise<void>}
     */
    async stop() {
        if (!this.state.isRunning) {
            return;
        }
        
        try {
            this.log('Stopping QuantumEventOrchestrator...');
            
            // Cancelar todas las promesas activas
            for (const promise of this.activePromises) {
                if (promise && typeof promise.cancel === 'function') {
                    promise.cancel();
                }
            }
            this.activePromises.clear();
            
            // Detener health checks
            if (this.healthCheckInterval) {
                clearInterval(this.healthCheckInterval);
                this.healthCheckInterval = null;
            }
            
            // Ejecutar hooks de parada
            await this.executeHooks('onStop');
            
            // Actualizar estado
            this.state.isRunning = false;
            
            this.log('QuantumEventOrchestrator stopped successfully');
            
        } catch (error) {
            this.log('Error during shutdown', { error: error.message }, 'error');
            throw error;
        }
    }
    
    /**
     * Emitir un evento algorithmic con validación y métricas
     * @param {string} eventName - Nombre del evento
     * @param {Object} payload - Datos del evento
     * @param {Object} options - Opciones adicionales
     * @returns {Promise<boolean>} - True si el evento fue emitido exitosamente
     */
    async emitQuantumEvent(eventName, payload, options = {}) {
        const eventDef = QUANTUM_EVENTS[eventName];
        if (!eventDef) {
            throw new Error(`Unknown quantum event: ${eventName}`);
        }
        
        try {
            // Validar payload
            this.validateEventPayload(eventName, payload);
            
            // Verificar rate limiting
            if (this.isRateLimited(eventName)) {
                this.log(`Event ${eventName} rate limited`, {}, 'warn');
                return false;
            }
            
            // Crear evento con metadatos
            const event = {
                name: eventName,
                payload,
                priority: eventDef.priority,
                timestamp: Date.now(),
                id: this.generateEventId(),
                cancellable: eventDef.cancellable,
                options
            };
            
            // Agregar a cola con backpressure
            const queued = this.eventQueue.enqueue(event);
            if (!queued) {
                this.log(`Event ${eventName} dropped due to queue full`, {}, 'warn');
                return false;
            }
            
            // Actualizar métricas
            const metrics = this.metrics.get(eventName);
            if (metrics) {
                metrics.totalEmitted++;
                metrics.lastEmittedAt = event.timestamp;
            }
            
            this.log(`Event ${eventName} queued`, { eventId: event.id });
            return true;
            
        } catch (error) {
            this.log(`Failed to emit event ${eventName}`, { error: error.message }, 'error');
            const metrics = this.metrics.get(eventName);
            if (metrics) {
                metrics.totalErrors++;
            }
            throw error;
        }
    }
    
    /**
     * Procesar eventos de la cola
     */
    startEventProcessing() {
        const processNext = async () => {
            if (!this.state.isRunning) return;
            
            const event = this.eventQueue.dequeue();
            if (event) {
                await this.processEvent(event);
            }
            
            // Continuar procesando
            setImmediate(processNext);
        };
        
        processNext();
    }
    
    /**
     * Procesar un evento individual
     * @param {Object} event - Evento a procesar
     */
    async processEvent(event) {
        const startTime = Date.now();
        
        try {
            // Verificar si el evento fue cancelado
            if (event.cancellable && event.cancelled) {
                this.log(`Event ${event.name} was cancelled`, { eventId: event.id });
                return;
            }
            
            // Emitir evento
            this.emit(event.name, event.payload);
            
            // Actualizar métricas
            const processingTime = Date.now() - startTime;
            this.updateProcessingMetrics(event.name, processingTime);
            
            this.state.totalEventsProcessed++;
            
        } catch (error) {
            this.log(`Error processing event ${event.name}`, { error: error.message, eventId: event.id }, 'error');
            
            const metrics = this.metrics.get(event.name);
            if (metrics) {
                metrics.totalErrors++;
            }
            
            this.emit('error', error);
        }
    }
    
    /**
     * Actualizar métricas de procesamiento
     * @param {string} eventName - Nombre del evento
     * @param {number} processingTime - Tiempo de procesamiento en ms
     */
    updateProcessingMetrics(eventName, processingTime) {
        const metrics = this.metrics.get(eventName);
        if (!metrics) return;
        
        metrics.totalProcessed++;
        metrics.processingTimes.push(processingTime);
        
        // Mantener solo las últimas 100 mediciones para calcular promedio
        if (metrics.processingTimes.length > 100) {
            metrics.processingTimes.shift();
        }
        
        // Calcular promedio móvil
        metrics.averageProcessingTime = 
            metrics.processingTimes.reduce((a, b) => a + b, 0) / metrics.processingTimes.length;
    }
    
    /**
     * Validar payload de evento según su esquema
     * @param {string} eventName - Nombre del evento
     * @param {Object} payload - Payload a validar
     */
    validateEventPayload(eventName, payload) {
        const eventDef = QUANTUM_EVENTS[eventName];
        if (!eventDef || !eventDef.payloadSchema) return;
        
        for (const [field, rules] of Object.entries(eventDef.payloadSchema)) {
            const value = payload[field];
            
            // Verificar campos requeridos
            if (rules.required && (value === undefined || value === null)) {
                throw new Error(`Field '${field}' is required for event '${eventName}'`);
            }
            
            if (value !== undefined && value !== null) {
                // Verificar tipo
                if (rules.type && typeof value !== rules.type) {
                    throw new Error(`Field '${field}' must be of type '${rules.type}' for event '${eventName}'`);
                }
                
                // Verificar rangos numéricos
                if (rules.type === 'number') {
                    if (rules.min !== undefined && value < rules.min) {
                        throw new Error(`Field '${field}' must be >= ${rules.min} for event '${eventName}'`);
                    }
                    if (rules.max !== undefined && value > rules.max) {
                        throw new Error(`Field '${field}' must be <= ${rules.max} for event '${eventName}'`);
                    }
                }
                
                // Verificar enum
                if (rules.enum && !rules.enum.includes(value)) {
                    throw new Error(`Field '${field}' must be one of [${rules.enum.join(', ')}] for event '${eventName}'`);
                }
            }
        }
    }
    
    /**
     * Verificar rate limiting para un evento
     * @param {string} eventName - Nombre del evento
     * @returns {boolean} - True si está rate limited
     */
    isRateLimited(eventName) {
        const eventDef = QUANTUM_EVENTS[eventName];
        if (!eventDef || !eventDef.frequency) return false;
        
        const now = Date.now();
        const windowMs = 1000; // Ventana de 1 segundo
        const maxEventsPerWindow = Math.max(1, Math.ceil(eventDef.frequency));
        
        const limiter = this.rateLimiter.get(eventName) || { count: 0, windowStart: now };
        
        // Resetear ventana si ha pasado el tiempo
        if (now - limiter.windowStart >= windowMs) {
            limiter.count = 0;
            limiter.windowStart = now;
        }
        
        // Verificar límite
        if (limiter.count >= maxEventsPerWindow) {
            return true; // Rate limited
        }
        
        limiter.count++;
        this.rateLimiter.set(eventName, limiter);
        return false;
    }
    
    /**
     * Generar ID único para evento
     * @returns {string} - ID del evento
     */
    generateEventId() {
        // Usar kernel RNG en lugar de Math.random() (regla del usuario)
        const { kernelRNG } = require('../utils/kernel-rng');
        return `qe_${Date.now()}_${Math.floor(kernelRNG.nextFloat() * 1000000).toString(36)}`;
    }
    
    /**
     * Iniciar health checks periódicos
     */
    startHealthChecks() {
        this.healthCheckInterval = setInterval(async () => {
            await this.performHealthCheck();
        }, this.options.healthCheckInterval);
    }
    
    /**
     * Realizar health check de todos los componentes
     */
    async performHealthCheck() {
        const components = [
            'eventQueue',
            'rateLimiter', 
            'metrics',
            'eventProcessor'
        ];
        
        for (const component of components) {
            try {
                const health = await this.checkComponentHealth(component);
                this.state.components.set(component, health);
                
                await this.emitQuantumEvent('healthCheck', {
                    timestamp: Date.now(),
                    component,
                    status: health.status,
                    metrics: health.metrics
                });
                
            } catch (error) {
                this.log(`Health check failed for component ${component}`, { error: error.message }, 'error');
            }
        }
        
        this.state.lastHealthCheck = Date.now();
    }
    
    /**
     * Verificar salud de un componente específico
     * @param {string} component - Nombre del componente
     * @returns {Object} - Estado de salud
     */
    async checkComponentHealth(component) {
        switch (component) {
            case 'eventQueue':
                const queueStats = this.eventQueue.getStats();
                return {
                    status: queueStats.utilizationPercent > 90 ? 'degraded' : 
                           queueStats.utilizationPercent > 50 ? 'healthy' : 'healthy',
                    metrics: queueStats
                };
                
            case 'rateLimiter':
                return {
                    status: this.rateLimiter.size < 1000 ? 'healthy' : 'degraded',
                    metrics: { activeRateLimiters: this.rateLimiter.size }
                };
                
            case 'metrics':
                const totalEvents = Array.from(this.metrics.values())
                    .reduce((sum, m) => sum + m.totalProcessed, 0);
                return {
                    status: 'healthy',
                    metrics: { totalEventsProcessed: totalEvents }
                };
                
            case 'eventProcessor':
                return {
                    status: this.state.isRunning ? 'healthy' : 'unhealthy',
                    metrics: {
                        uptime: Date.now() - (this.state.startedAt || 0),
                        totalProcessed: this.state.totalEventsProcessed,
                        totalErrors: this.state.totalErrors
                    }
                };
                
            default:
                return { status: 'unknown', metrics: {} };
        }
    }
    
    /**
     * Registrar hook de ciclo de vida
     * @param {string} hookName - Nombre del hook ('onStart', 'onStop', 'onError', 'onRecover')
     * @param {Function} callback - Función callback
     */
    addLifecycleHook(hookName, callback) {
        if (!this.lifecycleHooks[hookName]) {
            throw new Error(`Unknown lifecycle hook: ${hookName}`);
        }
        
        if (typeof callback !== 'function') {
            throw new Error('Lifecycle hook callback must be a function');
        }
        
        this.lifecycleHooks[hookName].push(callback);
        this.log(`Lifecycle hook added: ${hookName}`);
    }
    
    /**
     * Ejecutar hooks de ciclo de vida
     * @param {string} hookName - Nombre del hook
     * @param {*} data - Datos para pasar al hook
     */
    async executeHooks(hookName, data = null) {
        const hooks = this.lifecycleHooks[hookName] || [];
        
        for (const hook of hooks) {
            try {
                await hook(data);
            } catch (error) {
                this.log(`Error executing ${hookName} hook`, { error: error.message }, 'error');
            }
        }
    }
    
    /**
     * Crear una promesa con timeout y cancelación
     * @param {Function} executor - Función ejecutor
     * @param {number} timeoutMs - Timeout en milisegundos
     * @returns {CancellablePromise} - Promesa cancelable
     */
    createCancellablePromise(executor, timeoutMs = this.options.defaultTimeout) {
        const promise = new CancellablePromise(executor, timeoutMs);
        this.activePromises.add(promise);
        
        // Limpiar cuando se complete
        promise.finally(() => {
            this.activePromises.delete(promise);
        });
        
        return promise;
    }
    
    /**
     * Obtener métricas completas del sistema
     * @returns {Object} - Métricas del sistema
     */
    getMetrics() {
        const eventMetrics = {};
        for (const [eventName, metrics] of this.metrics.entries()) {
            eventMetrics[eventName] = { ...metrics };
            delete eventMetrics[eventName].processingTimes; // No exponer array interno
        }
        
        return {
            system: {
                isRunning: this.state.isRunning,
                uptime: this.state.startedAt ? Date.now() - this.state.startedAt : 0,
                totalEventsProcessed: this.state.totalEventsProcessed,
                totalErrors: this.state.totalErrors,
                lastHealthCheck: this.state.lastHealthCheck
            },
            events: eventMetrics,
            queue: this.eventQueue.getStats(),
            rateLimiter: {
                activeEventTypes: this.rateLimiter.size
            },
            components: Object.fromEntries(this.state.components)
        };
    }
    
    /**
     * Obtener información de eventos definidos
     * @returns {Object} - Definiciones de eventos
     */
    getEventDefinitions() {
        return { ...QUANTUM_EVENTS };
    }
    
    /**
     * Cleanup de recursos y operaciones asíncronas
     */
    async cleanup() {
        try {
            this.log('Initiating QuantumEventOrchestrator cleanup...');

            // Detener health checks
            if (this.healthCheckInterval) {
                clearInterval(this.healthCheckInterval);
                this.healthCheckInterval = null;
            }

            // Cancelar promesas activas
            for (const promise of this.activePromises) {
                if (promise && typeof promise.cancel === 'function') {
                    promise.cancel();
                }
            }
            this.activePromises.clear();

            // Limpiar cola de eventos
            if (this.eventQueue) {
                this.eventQueue.queue = [];
            }

            // Parar el orquestador
            await this.stop();

            this.log('QuantumEventOrchestrator cleanup completed');
        } catch (error) {
            this.log('Error during QuantumEventOrchestrator cleanup', { error: error.message }, 'error');
        }
    }

    /**
     * Logging estructurado
     * @param {string} message - Mensaje
     * @param {Object} meta - Metadata adicional
     * @param {string} level - Nivel de log
     */
    log(message, meta = {}, level = 'info') {
        if (!this.options.enableLogging) return;
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            service: 'QuantumEventOrchestrator',
            message,
            ...meta
        };
        
        console.log(JSON.stringify(logEntry));
    }
}

module.exports = {
    QuantumEventOrchestrator,
    QUANTUM_EVENTS,
    EventQueue,
    CancellablePromise
};


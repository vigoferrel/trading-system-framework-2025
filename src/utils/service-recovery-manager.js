/**
 * 🔄 SERVICE RECOVERY MANAGER - INTELLIGENT AUTO-RECOVERY SYSTEM
 * Sistema inteligente de recuperación automática para servicios del ecosistema QBTC
 * 
 * Implementa las reglas de segundo plano para mantención del código y detección de errores
 * 
 * @author QBTC Development Team
 * @version 1.0
 * @since 2025-01-09
 */

const { spawn } = require('child_process');
const http = require('http');
const Logger = require('./secure-logger');
const { kernelRNG } = require('./kernel-rng');

/**
 * Manager de recuperación automática de servicios
 */
class ServiceRecoveryManager {
    constructor(config = {}) {
        this.config = {
            // Intervalos de verificación (segundo plano según reglas)
            healthCheckInterval: config.healthCheckInterval || 15000, // 15 segundos
            recoveryTimeout: config.recoveryTimeout || 30000, // 30 segundos
            maxRetries: config.maxRetries || 3,
            backoffMultiplier: config.backoffMultiplier || 1.5,
            
            // Configuración de servicios críticos
            services: config.services || {
                'HYBRID_OPTIMIZER_V2': {
                    port: 14301,
                    script: 'src/core/hybrid-optimizer-v2.js',
                    healthEndpoint: '/health',
                    critical: true,
                    restartDelay: 5000
                },
                'CONCENTRATED_HYBRID_V3': {
                    port: 14302,
                    script: 'src/core/concentrated-hybrid-v3.js', 
                    healthEndpoint: '/health',
                    critical: true,
                    restartDelay: 5000
                },
                'ENHANCED_DASHBOARD': {
                    port: 14401,
                    script: 'src/ui/enhanced-dashboard.js',
                    healthEndpoint: '/health',
                    critical: false,
                    restartDelay: 3000
                },
                'INTELLIGENT_MONITOR': {
                    port: 14501,
                    script: 'src/monitoring/intelligent-monitor.js',
                    healthEndpoint: '/health',
                    critical: false,
                    restartDelay: 3000
                }
            },
            
            // Configuración avanzada
            enableCircuitBreaker: config.enableCircuitBreaker !== false,
            circuitBreakerThreshold: config.circuitBreakerThreshold || 5,
            enableGracefulShutdown: config.enableGracefulShutdown !== false,
            
            ...config
        };

        // Estado del recovery manager
        this.state = {
            initialized: false,
            monitoring: false,
            services: new Map(),
            recoveryAttempts: new Map(),
            circuitBreakers: new Map(),
            lastHealthCheck: Date.now()
        };

        // Procesos activos
        this.processes = new Map();
        
        // Timers
        this.healthCheckTimer = null;
        
        // Logger específico
        this.logger = Logger.createLogger('ServiceRecoveryManager');
        // RNG para delays aleatorios
        this.rng = kernelRNG;
    }

    /**
     * Inicializar el recovery manager
     */
    async initialize() {
        try {
            this.logger.info('🔄 Inicializando Service Recovery Manager...');

            // Inicializar estado de servicios
            this.initializeServiceStates();

            // Configurar circuit breakers
            this.initializeCircuitBreakers();

            // Iniciar monitoreo de salud
            this.startHealthMonitoring();

            // Configurar manejo de señales del sistema
            this.setupSystemSignals();

            this.state.initialized = true;
            this.logger.info('✅ Service Recovery Manager inicializado correctamente');

        } catch (error) {
            this.logger.error('❌ Error inicializando Service Recovery Manager:', error);
            throw error;
        }
    }

    /**
     * Inicializar estados de servicios
     */
    initializeServiceStates() {
        for (const [serviceName, serviceConfig] of Object.entries(this.config.services)) {
            this.state.services.set(serviceName, {
                name: serviceName,
                status: 'UNKNOWN',
                config: serviceConfig,
                lastHealthCheck: null,
                lastRestart: null,
                restartCount: 0,
                consecutiveFailures: 0,
                uptime: 0,
                pid: null
            });

            this.state.recoveryAttempts.set(serviceName, {
                attempts: 0,
                lastAttempt: null,
                nextRetryDelay: 1000
            });
        }

        this.logger.info(`📋 Estados de ${this.state.services.size} servicios inicializados`);
    }

    /**
     * Inicializar circuit breakers
     */
    initializeCircuitBreakers() {
        if (this.config.enableCircuitBreaker) {
            for (const serviceName of Object.keys(this.config.services)) {
                this.state.circuitBreakers.set(serviceName, {
                    state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
                    failures: 0,
                    lastFailure: null,
                    openUntil: null
                });
            }

            this.logger.info('🔌 Circuit breakers inicializados');
        }
    }

    /**
     * Iniciar monitoreo de salud en segundo plano
     */
    startHealthMonitoring() {
        this.healthCheckTimer = setInterval(async () => {
            await this.performHealthChecks();
        }, this.config.healthCheckInterval);

        this.state.monitoring = true;
        this.logger.info('📊 Monitoreo de salud iniciado en segundo plano');
    }

    /**
     * Realizar verificaciones de salud de todos los servicios
     */
    async performHealthChecks() {
        try {
            this.state.lastHealthCheck = Date.now();

            const healthPromises = [];

            for (const [serviceName, serviceState] of this.state.services) {
                healthPromises.push(this.checkServiceHealth(serviceName, serviceState));
            }

            await Promise.allSettled(healthPromises);

        } catch (error) {
            this.logger.error('❌ Error en health checks:', error);
        }
    }

    /**
     * Verificar salud de un servicio específico
     */
    async checkServiceHealth(serviceName, serviceState) {
        try {
            const isHealthy = await this.isServiceHealthy(serviceState.config.port, serviceState.config.healthEndpoint);

            if (isHealthy) {
                await this.handleHealthyService(serviceName, serviceState);
            } else {
                await this.handleUnhealthyService(serviceName, serviceState);
            }

            serviceState.lastHealthCheck = Date.now();

        } catch (error) {
            this.logger.error(`❌ Error verificando salud de ${serviceName}:`, error);
            await this.handleUnhealthyService(serviceName, serviceState);
        }
    }

    /**
     * Verificar si un servicio está saludable
     */
    async isServiceHealthy(port, healthEndpoint) {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                resolve(false);
            }, 5000); // 5 segundos timeout

            const req = http.get(`http://localhost:${port}${healthEndpoint}`, (res) => {
                clearTimeout(timeout);
                resolve(res.statusCode === 200);
            });

            req.on('error', () => {
                clearTimeout(timeout);
                resolve(false);
            });
        });
    }

    /**
     * Manejar servicio saludable
     */
    async handleHealthyService(serviceName, serviceState) {
        const wasDown = serviceState.status !== 'HEALTHY';

        serviceState.status = 'HEALTHY';
        serviceState.consecutiveFailures = 0;
        
        // Actualizar uptime si tenemos información del proceso
        if (serviceState.lastRestart) {
            serviceState.uptime = Date.now() - serviceState.lastRestart;
        }

        // Reset circuit breaker si estaba abierto
        if (this.config.enableCircuitBreaker) {
            const circuitBreaker = this.state.circuitBreakers.get(serviceName);
            if (circuitBreaker && circuitBreaker.state !== 'CLOSED') {
                circuitBreaker.state = 'CLOSED';
                circuitBreaker.failures = 0;
                this.logger.info(`🔌 Circuit breaker de ${serviceName} cerrado - servicio recuperado`);
            }
        }

        // Reset recovery attempts
        const recoveryAttempts = this.state.recoveryAttempts.get(serviceName);
        if (recoveryAttempts && recoveryAttempts.attempts > 0) {
            recoveryAttempts.attempts = 0;
            recoveryAttempts.nextRetryDelay = 1000;
        }

        if (wasDown) {
            this.logger.info(`✅ Servicio ${serviceName} recuperado - Status: HEALTHY`);
        }
    }

    /**
     * Manejar servicio no saludable
     */
    async handleUnhealthyService(serviceName, serviceState) {
        const wasHealthy = serviceState.status === 'HEALTHY';

        serviceState.status = 'DOWN';
        serviceState.consecutiveFailures++;

        if (wasHealthy) {
            this.logger.warn(`🚨 Servicio ${serviceName} detectado como DOWN`);
        }

        // Actualizar circuit breaker
        if (this.config.enableCircuitBreaker) {
            await this.updateCircuitBreaker(serviceName);
        }

        // Intentar recuperación si el circuit breaker lo permite
        if (this.shouldAttemptRecovery(serviceName, serviceState)) {
            await this.attemptServiceRecovery(serviceName, serviceState);
        }
    }

    /**
     * Actualizar circuit breaker
     */
    async updateCircuitBreaker(serviceName) {
        const circuitBreaker = this.state.circuitBreakers.get(serviceName);
        if (!circuitBreaker) return;

        circuitBreaker.failures++;
        circuitBreaker.lastFailure = Date.now();

        if (circuitBreaker.state === 'CLOSED' && circuitBreaker.failures >= this.config.circuitBreakerThreshold) {
            circuitBreaker.state = 'OPEN';
            circuitBreaker.openUntil = Date.now() + (60000 * Math.pow(2, circuitBreaker.failures - this.config.circuitBreakerThreshold)); // Exponential backoff
            
            this.logger.warn(`🔌 Circuit breaker de ${serviceName} abierto - demasiados fallos (${circuitBreaker.failures})`);
        }
    }

    /**
     * Determinar si se debe intentar recuperación
     */
    shouldAttemptRecovery(serviceName, serviceState) {
        const recoveryAttempts = this.state.recoveryAttempts.get(serviceName);
        
        // Verificar límite de reintentos
        if (recoveryAttempts.attempts >= this.config.maxRetries) {
            return false;
        }

        // Verificar circuit breaker
        if (this.config.enableCircuitBreaker) {
            const circuitBreaker = this.state.circuitBreakers.get(serviceName);
            if (circuitBreaker && circuitBreaker.state === 'OPEN') {
                if (Date.now() < circuitBreaker.openUntil) {
                    return false; // Circuit breaker aún abierto
                } else {
                    // Intentar medio abierto
                    circuitBreaker.state = 'HALF_OPEN';
                    this.logger.info(`🔌 Circuit breaker de ${serviceName} en estado HALF_OPEN`);
                }
            }
        }

        // Verificar delay entre intentos
        const now = Date.now();
        if (recoveryAttempts.lastAttempt && (now - recoveryAttempts.lastAttempt) < recoveryAttempts.nextRetryDelay) {
            return false;
        }

        return true;
    }

    /**
     * Intentar recuperación de servicio
     */
    async attemptServiceRecovery(serviceName, serviceState) {
        const recoveryAttempts = this.state.recoveryAttempts.get(serviceName);
        
        recoveryAttempts.attempts++;
        recoveryAttempts.lastAttempt = Date.now();
        
        this.logger.info(`🔄 Intentando recuperación de ${serviceName} (intento ${recoveryAttempts.attempts}/${this.config.maxRetries})`);

        try {
            // Terminar proceso existente si existe
            await this.terminateService(serviceName);

            // Esperar un poco antes de reiniciar (con jitter)
            const baseDelay = serviceState.config.restartDelay || 5000;
            const jitter = Math.floor(this.rng.getSecureFloat() * 2000); // 0-2 segundos de jitter
            await this.sleep(baseDelay + jitter);

            // Intentar reiniciar el servicio
            await this.startService(serviceName, serviceState);

            // Calcular próximo delay con backoff exponencial
            recoveryAttempts.nextRetryDelay = Math.min(
                recoveryAttempts.nextRetryDelay * this.config.backoffMultiplier,
                300000 // Máximo 5 minutos
            );

            this.logger.info(`🚀 Servicio ${serviceName} reiniciado - Verificando salud...`);

        } catch (error) {
            this.logger.error(`❌ Error en recuperación de ${serviceName}:`, error);
            
            // Incrementar delay para próximo intento
            recoveryAttempts.nextRetryDelay *= this.config.backoffMultiplier;
        }
    }

    /**
     * Terminar un servicio
     */
    async terminateService(serviceName) {
        const process = this.processes.get(serviceName);
        
        if (process && !process.killed) {
            this.logger.info(`🛑 Terminando proceso de ${serviceName} (PID: ${process.pid})`);
            
            if (this.config.enableGracefulShutdown) {
                // Intentar shutdown graceful primero
                process.kill('SIGTERM');
                
                // Esperar un poco para shutdown graceful
                await this.sleep(5000);
                
                // Forzar kill si aún está vivo
                if (!process.killed) {
                    process.kill('SIGKILL');
                }
            } else {
                process.kill('SIGKILL');
            }
            
            this.processes.delete(serviceName);
        }
    }

    /**
     * Iniciar un servicio
     */
    async startService(serviceName, serviceState) {
        const scriptPath = serviceState.config.script;
        
        this.logger.info(`🚀 Iniciando servicio ${serviceName} desde ${scriptPath}`);

        const nodeProcess = spawn('node', [scriptPath, '--expose-gc'], {
            detached: false,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: {
                ...process.env,
                SERVICE_NAME: serviceName,
                SERVICE_PORT: serviceState.config.port.toString()
            }
        });

        // Manejar salida del proceso
        nodeProcess.stdout.on('data', (data) => {
            this.logger.debug(`[${serviceName}] ${data.toString().trim()}`);
        });

        nodeProcess.stderr.on('data', (data) => {
            this.logger.error(`[${serviceName}] ERROR: ${data.toString().trim()}`);
        });

        nodeProcess.on('exit', (code, signal) => {
            this.logger.warn(`[${serviceName}] Proceso terminado - Código: ${code}, Señal: ${signal}`);
            this.processes.delete(serviceName);
        });

        nodeProcess.on('error', (error) => {
            this.logger.error(`[${serviceName}] Error del proceso:`, error);
        });

        // Almacenar referencia del proceso
        this.processes.set(serviceName, nodeProcess);
        
        // Actualizar estado del servicio
        serviceState.pid = nodeProcess.pid;
        serviceState.lastRestart = Date.now();
        serviceState.restartCount++;

        return nodeProcess;
    }

    /**
     * Configurar manejo de señales del sistema
     */
    setupSystemSignals() {
        // Manejar emergencia de memoria
        process.on('memoryEmergency', async (data) => {
            this.logger.error('🆘 Emergencia de memoria detectada - Iniciando recuperación de servicios no críticos');
            
            // Reiniciar servicios no críticos para liberar memoria
            for (const [serviceName, serviceState] of this.state.services) {
                if (!serviceState.config.critical) {
                    await this.attemptServiceRecovery(serviceName, serviceState);
                }
            }
        });

        // Shutdown graceful
        const gracefulShutdown = async (signal) => {
            this.logger.info(`📡 Señal ${signal} recibida - Iniciando shutdown graceful...`);
            await this.shutdown();
            process.exit(0);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }

    /**
     * Obtener estado de todos los servicios
     */
    getServicesStatus() {
        const status = {};
        
        for (const [serviceName, serviceState] of this.state.services) {
            const recoveryAttempts = this.state.recoveryAttempts.get(serviceName);
            const circuitBreaker = this.state.circuitBreakers.get(serviceName);
            
            status[serviceName] = {
                status: serviceState.status,
                uptime: serviceState.uptime,
                pid: serviceState.pid,
                restartCount: serviceState.restartCount,
                consecutiveFailures: serviceState.consecutiveFailures,
                lastHealthCheck: serviceState.lastHealthCheck,
                lastRestart: serviceState.lastRestart,
                recoveryAttempts: recoveryAttempts?.attempts || 0,
                circuitBreaker: circuitBreaker?.state || 'DISABLED'
            };
        }
        
        return status;
    }

    /**
     * Forzar reinicio de un servicio específico
     */
    async forceRestartService(serviceName) {
        const serviceState = this.state.services.get(serviceName);
        if (!serviceState) {
            throw new Error(`Servicio ${serviceName} no encontrado`);
        }

        this.logger.info(`🔄 Reinicio forzado de ${serviceName} solicitado`);
        
        // Reset recovery attempts para permitir reinicio inmediato
        const recoveryAttempts = this.state.recoveryAttempts.get(serviceName);
        recoveryAttempts.attempts = 0;
        recoveryAttempts.lastAttempt = null;
        
        await this.attemptServiceRecovery(serviceName, serviceState);
    }

    /**
     * Shutdown limpio del recovery manager
     */
    async shutdown() {
        this.logger.info('🔄 Cerrando Service Recovery Manager...');

        // Detener monitoreo
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);
        }

        // Terminar todos los procesos gestionados
        const terminationPromises = [];
        for (const serviceName of this.processes.keys()) {
            terminationPromises.push(this.terminateService(serviceName));
        }

        await Promise.allSettled(terminationPromises);

        this.state.monitoring = false;
        this.logger.info('✅ Service Recovery Manager cerrado correctamente');
    }

    /**
     * Utility: Sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = ServiceRecoveryManager;


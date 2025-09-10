/**
 * QBTC Hermetic Core Daemon - Lanzador en Segundo Plano
 * 
 * Daemon para ejecutar el ciclo hermético core de 10 segundos en segundo plano
 * Con reporting completo de métricas para depuración y mantenimiento
 * 
 * Cumple con reglas del sistema:
 * - Procesos en segundo plano para reportar métricas de desempeño
 * - Facilita depuración de errores y mantenimiento del código
 * - Usa kernel RNG (no Math.random)
 */

const { EventEmitter } = require('events');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { HermeticCoreCycle } = require('../temporal/hermetic-core-cycle');
const { HermeticLogger } = require('../utils/hermetic-logger');
const { kernelRNG } = require('../utils/kernel-rng');

class HermeticCoreDaemon extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.logger = new HermeticLogger('HermeticDaemon');
        this.config = {
            // Configuración del daemon
            pidFile: config.pidFile || path.join(os.tmpdir(), 'qbtc-hermetic-core.pid'),
            metricsFile: config.metricsFile || path.join(__dirname, '../../logs/hermetic-core-metrics.json'),
            logFile: config.logFile || path.join(__dirname, '../../logs/hermetic-core-daemon.log'),
            
            // Configuración del ciclo core
            coreInterval: config.coreInterval || 10000, // 10 segundos
            metricsReportInterval: config.metricsReportInterval || 60000, // 1 minuto
            healthCheckInterval: config.healthCheckInterval || 30000, // 30 segundos
            
            // Configuración de persistencia
            persistMetrics: config.persistMetrics !== false, // Por defecto true
            maxMetricsHistory: config.maxMetricsHistory || 1000,
            
            ...config
        };

        // Estado del daemon
        this.daemonState = {
            isRunning: false,
            startTime: null,
            pid: process.pid,
            uptime: 0,
            totalCycles: 0,
            lastHealthCheck: null,
            memoryUsage: {},
            cpuUsage: {},
            errorCount: 0
        };

        // Historial de métricas para reporting
        this.metricsHistory = [];
        this.performanceMetrics = {
            cycleCount: 0,
            avgCycleTime: 0,
            maxCycleTime: 0,
            minCycleTime: Number.MAX_SAFE_INTEGER,
            errorRate: 0,
            systemLoad: 0
        };

        // Instancia del ciclo hermético core
        this.hermeticCore = null;

        // Timers para reporting y health checks
        this.metricsReportTimer = null;
        this.healthCheckTimer = null;

        this.logger.info('🔧 Inicializando Hermetic Core Daemon...');
    }

    /**
     * Iniciar daemon en segundo plano
     */
    async startDaemon() {
        try {
            // Verificar si ya hay otro daemon ejecutándose
            await this.checkExistingDaemon();

            // Configurar manejo de señales del sistema
            this.setupSignalHandlers();

            // Crear archivo PID
            await this.createPidFile();

            // Inicializar ciclo hermético core
            await this.initializeHermeticCore();

            // Iniciar reporting de métricas
            this.startMetricsReporting();

            // Iniciar health checks
            this.startHealthChecks();

            // Actualizar estado
            this.daemonState.isRunning = true;
            this.daemonState.startTime = Date.now();

            this.logger.info('✅ Hermetic Core Daemon iniciado en segundo plano');
            this.logger.info(`📊 PID: ${this.daemonState.pid}`);
            this.logger.info(`📁 PID File: ${this.config.pidFile}`);
            this.logger.info(`📈 Metrics File: ${this.config.metricsFile}`);

            // Emitir evento de inicio
            this.emit('daemonStarted', {
                pid: this.daemonState.pid,
                startTime: this.daemonState.startTime,
                config: this.config
            });

        } catch (error) {
            this.logger.error(`❌ Error iniciando daemon: ${error.message}`);
            throw error;
        }
    }

    /**
     * Verificar si existe otro daemon ejecutándose
     */
    async checkExistingDaemon() {
        try {
            const pidFileExists = await fs.access(this.config.pidFile).then(() => true).catch(() => false);
            
            if (pidFileExists) {
                const pidContent = await fs.readFile(this.config.pidFile, 'utf8');
                const existingPid = parseInt(pidContent.trim());
                
                // Verificar si el proceso existe
                try {
                    process.kill(existingPid, 0); // Verificar existencia sin matar
                    throw new Error(`Daemon ya ejecutándose con PID ${existingPid}`);
                } catch (killError) {
                    // Proceso no existe, limpiar PID file
                    await fs.unlink(this.config.pidFile);
                    this.logger.warn(`🧹 PID file huérfano eliminado: ${existingPid}`);
                }
            }
        } catch (error) {
            if (error.message.includes('ya ejecutándose')) {
                throw error;
            }
            // Otros errores no son críticos
            this.logger.warn(`⚠️ Verificación de daemon existente: ${error.message}`);
        }
    }

    /**
     * Configurar manejo de señales del sistema
     */
    setupSignalHandlers() {
        // Manejo graceful de cierre
        const gracefulShutdown = async (signal) => {
            this.logger.info(`📡 Señal ${signal} recibida, iniciando cierre graceful...`);
            await this.stopDaemon();
            process.exit(0);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGHUP', () => {
            this.logger.info('📡 Señal SIGHUP recibida, recargando configuración...');
            this.reloadConfiguration();
        });

        // Manejo de errores no capturados
        process.on('uncaughtException', (error) => {
            this.logger.error(`💥 Error no capturado: ${error.message}`, error);
            this.daemonState.errorCount++;
            // No terminar el proceso automáticamente, intentar recuperar
        });

        process.on('unhandledRejection', (reason, promise) => {
            this.logger.error(`💥 Promise rechazada no manejada: ${reason}`, promise);
            this.daemonState.errorCount++;
        });
    }

    /**
     * Crear archivo PID
     */
    async createPidFile() {
        try {
            // Asegurar que el directorio existe
            const pidDir = path.dirname(this.config.pidFile);
            await fs.mkdir(pidDir, { recursive: true });

            // Escribir PID
            await fs.writeFile(this.config.pidFile, this.daemonState.pid.toString());
            
            this.logger.info(`📝 Archivo PID creado: ${this.config.pidFile}`);
        } catch (error) {
            this.logger.error(`❌ Error creando archivo PID: ${error.message}`);
            throw error;
        }
    }

    /**
     * Inicializar ciclo hermético core
     */
    async initializeHermeticCore() {
        try {
            // Crear instancia del ciclo core
            this.hermeticCore = new HermeticCoreCycle({
                coreInterval: this.config.coreInterval,
                deepAnalysisThreshold: 0.8,
                quantumCoherenceTarget: 0.618,
                primeResonanceMultiplier: 1.618
            });

            // Configurar handlers de eventos
            this.setupCoreEventHandlers();

            // Inicializar ciclo
            await this.hermeticCore.initializeCoreCycle();

            this.logger.info('🔮 Ciclo hermético core inicializado en daemon');

        } catch (error) {
            this.logger.error(`❌ Error inicializando ciclo core en daemon: ${error.message}`);
            throw error;
        }
    }

    /**
     * Configurar handlers de eventos del ciclo core
     */
    setupCoreEventHandlers() {
        // Métricas de ciclo core
        this.hermeticCore.on('coreMetrics', (metrics) => {
            this.handleCoreMetrics(metrics);
        });

        // Alertas herméticas
        this.hermeticCore.on('hermeticAlert', (alert) => {
            this.handleHermeticAlert(alert);
        });

        // Errores del core
        this.hermeticCore.on('coreError', (errorData) => {
            this.handleCoreError(errorData);
        });

        // Inicialización completa
        this.hermeticCore.on('coreInitialized', (data) => {
            this.logger.info('✅ Ciclo core completamente inicializado en daemon');
        });
    }

    /**
     * Manejar métricas del ciclo core
     */
    async handleCoreMetrics(metrics) {
        try {
            // Actualizar estadísticas de rendimiento
            this.updatePerformanceMetrics(metrics);

            // Almacenar en historial
            const enrichedMetrics = {
                ...metrics,
                daemon: {
                    pid: this.daemonState.pid,
                    uptime: Date.now() - this.daemonState.startTime,
                    memoryUsage: process.memoryUsage(),
                    cpuUsage: process.cpuUsage(),
                    systemLoad: os.loadavg()[0]
                },
                timestamp: Date.now()
            };

            this.metricsHistory.push(enrichedMetrics);

            // Mantener límite de historial
            if (this.metricsHistory.length > this.config.maxMetricsHistory) {
                this.metricsHistory.shift();
            }

            // Persistir métricas si está habilitado
            if (this.config.persistMetrics) {
                await this.persistMetricsToFile(enrichedMetrics);
            }

            // Incrementar contador
            this.daemonState.totalCycles++;

        } catch (error) {
            this.logger.error(`❌ Error procesando métricas core: ${error.message}`);
        }
    }

    /**
     * Manejar alertas herméticas
     */
    handleHermeticAlert(alert) {
        // Log según severidad
        switch (alert.severity) {
            case 'CRITICAL':
                this.logger.error(`🌋 ALERTA CRÍTICA: ${alert.message}`, alert.data);
                break;
            case 'HIGH':
                this.logger.warn(`🚨 ALERTA ALTA: ${alert.message}`, alert.data);
                break;
            case 'OPPORTUNITY':
                this.logger.info(`⭐ OPORTUNIDAD: ${alert.message}`, alert.data);
                break;
            default:
                this.logger.info(`📢 ALERTA: ${alert.message}`, alert.data);
        }

        // Emitir para posible integración externa
        this.emit('hermeticAlert', {
            ...alert,
            daemon: {
                pid: this.daemonState.pid,
                timestamp: Date.now()
            }
        });
    }

    /**
     * Manejar errores del core
     */
    handleCoreError(errorData) {
        this.daemonState.errorCount++;
        this.logger.error(`💥 Error en ciclo core: ${errorData.error}`);
        
        // Emitir para monitoreo externo
        this.emit('coreError', {
            ...errorData,
            daemon: {
                pid: this.daemonState.pid,
                errorCount: this.daemonState.errorCount,
                timestamp: Date.now()
            }
        });
    }

    /**
     * Actualizar métricas de rendimiento
     */
    updatePerformanceMetrics(coreMetrics) {
        this.performanceMetrics.cycleCount++;
        
        if (coreMetrics.cycleTime) {
            // Actualizar tiempos promedio, máximo y mínimo
            const cycleTime = coreMetrics.cycleTime;
            this.performanceMetrics.avgCycleTime = 
                (this.performanceMetrics.avgCycleTime * (this.performanceMetrics.cycleCount - 1) + cycleTime) / 
                this.performanceMetrics.cycleCount;
            
            this.performanceMetrics.maxCycleTime = Math.max(this.performanceMetrics.maxCycleTime, cycleTime);
            this.performanceMetrics.minCycleTime = Math.min(this.performanceMetrics.minCycleTime, cycleTime);
        }

        // Calcular tasa de error
        this.performanceMetrics.errorRate = this.daemonState.errorCount / this.performanceMetrics.cycleCount;
        this.performanceMetrics.systemLoad = os.loadavg()[0];
    }

    /**
     * Persistir métricas a archivo
     */
    async persistMetricsToFile(metrics) {
        try {
            // Asegurar que el directorio existe
            const metricsDir = path.dirname(this.config.metricsFile);
            await fs.mkdir(metricsDir, { recursive: true });

            // Leer métricas existentes
            let existingMetrics = [];
            try {
                const existingData = await fs.readFile(this.config.metricsFile, 'utf8');
                existingMetrics = JSON.parse(existingData);
            } catch {
                // Archivo no existe o está vacío
            }

            // Agregar nueva métrica
            existingMetrics.push(metrics);

            // Mantener solo las últimas N métricas
            if (existingMetrics.length > this.config.maxMetricsHistory) {
                existingMetrics = existingMetrics.slice(-this.config.maxMetricsHistory);
            }

            // Escribir de vuelta
            await fs.writeFile(
                this.config.metricsFile,
                JSON.stringify(existingMetrics, null, 2)
            );

        } catch (error) {
            this.logger.error(`❌ Error persistiendo métricas: ${error.message}`);
        }
    }

    /**
     * Iniciar reporting de métricas periódico
     */
    startMetricsReporting() {
        this.metricsReportTimer = setInterval(() => {
            this.reportDaemonMetrics();
        }, this.config.metricsReportInterval);

        this.logger.info(`📊 Reporting de métricas iniciado (cada ${this.config.metricsReportInterval}ms)`);
    }

    /**
     * Reportar métricas del daemon
     */
    reportDaemonMetrics() {
        const uptime = Date.now() - this.daemonState.startTime;
        const memUsage = process.memoryUsage();
        
        const report = {
            daemon: {
                pid: this.daemonState.pid,
                uptime,
                uptimeHuman: this.formatUptime(uptime),
                totalCycles: this.daemonState.totalCycles,
                errorCount: this.daemonState.errorCount,
                memoryUsage: {
                    rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
                    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
                    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`
                }
            },
            performance: this.performanceMetrics,
            system: {
                loadAvg: os.loadavg(),
                freeMemory: `${Math.round(os.freemem() / 1024 / 1024)}MB`,
                totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)}MB`
            },
            hermeticCore: this.hermeticCore ? this.hermeticCore.getCoreState() : null,
            timestamp: Date.now()
        };

        // Log de reporte
        this.logger.info(
            `📈 DAEMON REPORT - ` +
            `Uptime: ${report.daemon.uptimeHuman}, ` +
            `Cycles: ${report.daemon.totalCycles}, ` +
            `Errors: ${report.daemon.errorCount}, ` +
            `Avg Cycle Time: ${Math.round(this.performanceMetrics.avgCycleTime)}ms`
        );

        // Emitir reporte
        this.emit('daemonReport', report);
    }

    /**
     * Iniciar health checks
     */
    startHealthChecks() {
        this.healthCheckTimer = setInterval(() => {
            this.performHealthCheck();
        }, this.config.healthCheckInterval);

        this.logger.info(`🏥 Health checks iniciados (cada ${this.config.healthCheckInterval}ms)`);
    }

    /**
     * Realizar health check
     */
    performHealthCheck() {
        const healthStatus = {
            daemon: {
                isRunning: this.daemonState.isRunning,
                pid: this.daemonState.pid,
                uptime: Date.now() - this.daemonState.startTime,
                errorRate: this.performanceMetrics.errorRate
            },
            hermeticCore: {
                isActive: this.hermeticCore?.coreState?.isActive || false,
                cycleCount: this.hermeticCore?.coreState?.cycleCount || 0,
                lastUpdate: this.hermeticCore?.coreState?.lastUpdate || null
            },
            system: {
                memoryUsage: process.memoryUsage(),
                systemLoad: os.loadavg()[0],
                freeMemory: os.freemem()
            },
            timestamp: Date.now()
        };

        // Verificar salud crítica
        const isCritical = 
            this.performanceMetrics.errorRate > 0.1 || // 10% error rate
            os.loadavg()[0] > 5.0 || // Load muy alto
            (os.freemem() / os.totalmem()) < 0.1; // Menos del 10% RAM libre

        if (isCritical) {
            this.logger.warn('⚠️ Health check: Estado crítico detectado', healthStatus);
        }

        this.daemonState.lastHealthCheck = Date.now();
        this.emit('healthCheck', { ...healthStatus, isCritical });
    }

    /**
     * Recargar configuración
     */
    async reloadConfiguration() {
        try {
            this.logger.info('🔄 Recargando configuración del daemon...');
            
            // Aquí podrías recargar configuración desde archivo
            // Por ahora, solo reiniciar timers con configuración actual
            
            // Reiniciar timers
            if (this.metricsReportTimer) {
                clearInterval(this.metricsReportTimer);
                this.startMetricsReporting();
            }
            
            if (this.healthCheckTimer) {
                clearInterval(this.healthCheckTimer);
                this.startHealthChecks();
            }
            
            this.logger.info('✅ Configuración recargada exitosamente');
        } catch (error) {
            this.logger.error(`❌ Error recargando configuración: ${error.message}`);
        }
    }

    /**
     * Obtener estado completo del daemon
     */
    getDaemonStatus() {
        return {
            daemon: this.daemonState,
            performance: this.performanceMetrics,
            config: this.config,
            hermeticCore: this.hermeticCore ? this.hermeticCore.getCoreState() : null,
            metricsHistoryCount: this.metricsHistory.length
        };
    }

    /**
     * Detener daemon gracefully
     */
    async stopDaemon() {
        try {
            this.logger.info('🛑 Deteniendo Hermetic Core Daemon...');

            // Detener ciclo hermético core
            if (this.hermeticCore) {
                await this.hermeticCore.stopCoreCycle();
            }

            // Limpiar timers
            if (this.metricsReportTimer) {
                clearInterval(this.metricsReportTimer);
            }
            
            if (this.healthCheckTimer) {
                clearInterval(this.healthCheckTimer);
            }

            // Persistir métricas finales
            if (this.config.persistMetrics && this.metricsHistory.length > 0) {
                await this.persistFinalReport();
            }

            // Eliminar archivo PID
            try {
                await fs.unlink(this.config.pidFile);
            } catch {
                // PID file puede no existir
            }

            // Actualizar estado
            this.daemonState.isRunning = false;

            this.logger.info('✅ Hermetic Core Daemon detenido exitosamente');
            this.emit('daemonStopped', { timestamp: Date.now() });

        } catch (error) {
            this.logger.error(`❌ Error deteniendo daemon: ${error.message}`);
            throw error;
        }
    }

    /**
     * Persistir reporte final
     */
    async persistFinalReport() {
        try {
            const finalReport = {
                summary: {
                    totalRuntime: Date.now() - this.daemonState.startTime,
                    totalCycles: this.daemonState.totalCycles,
                    totalErrors: this.daemonState.errorCount,
                    avgCycleTime: this.performanceMetrics.avgCycleTime,
                    maxCycleTime: this.performanceMetrics.maxCycleTime,
                    minCycleTime: this.performanceMetrics.minCycleTime,
                    finalErrorRate: this.performanceMetrics.errorRate
                },
                daemon: this.daemonState,
                performance: this.performanceMetrics,
                hermeticCore: this.hermeticCore ? this.hermeticCore.getCoreState() : null,
                metricsHistory: this.metricsHistory.slice(-100), // Últimas 100
                timestamp: Date.now()
            };

            const finalReportFile = path.join(
                path.dirname(this.config.metricsFile),
                `hermetic-core-final-report-${Date.now()}.json`
            );

            await fs.writeFile(
                finalReportFile,
                JSON.stringify(finalReport, null, 2)
            );

            this.logger.info(`📋 Reporte final guardado: ${finalReportFile}`);

        } catch (error) {
            this.logger.error(`❌ Error guardando reporte final: ${error.message}`);
        }
    }

    /**
     * Formatear tiempo de ejecución
     */
    formatUptime(uptimeMs) {
        const seconds = Math.floor(uptimeMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
}

module.exports = { HermeticCoreDaemon };

// Si se ejecuta directamente, iniciar daemon
if (require.main === module) {
    const daemon = new HermeticCoreDaemon({
        metricsReportInterval: 60000, // 1 minuto
        healthCheckInterval: 30000,   // 30 segundos
        persistMetrics: true
    });

    daemon.startDaemon().catch(error => {
        console.error(`Error iniciando daemon: ${error.message}`);
        process.exit(1);
    });
}

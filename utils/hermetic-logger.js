/**
 * 📊 HERMETIC LOGGER - Sistema de logging con métricas de rendimiento
 * Diseñado para procesos en segundo plano con reporting de métricas
 * 
 * @author QBTC Quantum Consciousness Trading System  
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const os = require('os');

class HermeticLogger {
    constructor(name, options = {}) {
        this.name = name;
        this.startTime = Date.now();
        this.options = {
            level: options.level || 'INFO',
            logToFile: options.logToFile !== false,
            logToConsole: options.logToConsole !== false,
            maxLogSize: options.maxLogSize || 10 * 1024 * 1024, // 10MB
            metricsInterval: options.metricsInterval || 30000, // 30 segundos
            logDir: options.logDir || './logs',
            ...options
        };
        
        this.levels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3,
            TRACE: 4
        };
        
        this.metrics = {
            logs: { ERROR: 0, WARN: 0, INFO: 0, DEBUG: 0, TRACE: 0 },
            performance: {
                memoryUsage: [],
                cpuUsage: [],
                logCount: 0,
                startTime: this.startTime
            }
        };
        
        this.logBuffer = [];
        this.bufferFlushInterval = 1000; // 1 segundo
        
        this.initializeLogDirectory();
        this.startMetricsCollection();
        this.startBufferFlush();
        
        this.info('HermeticLogger initialized', {
            name: this.name,
            pid: process.pid,
            nodeVersion: process.version,
            platform: os.platform()
        });
    }
    
    /**
     * Inicializar directorio de logs
     */
    initializeLogDirectory() {
        if (this.options.logToFile) {
            try {
                if (!fs.existsSync(this.options.logDir)) {
                    fs.mkdirSync(this.options.logDir, { recursive: true });
                }
                
                this.logFilePath = path.join(this.options.logDir, `${this.name}-${new Date().toISOString().split('T')[0]}.log`);
                this.metricsFilePath = path.join(this.options.logDir, `${this.name}-metrics-${new Date().toISOString().split('T')[0]}.json`);
                
            } catch (error) {
                console.error('⚠️  Failed to create log directory:', error.message);
                this.options.logToFile = false;
            }
        }
    }
    
    /**
     * Iniciar recolección de métricas de sistema
     */
    startMetricsCollection() {
        setInterval(() => {
            this.collectSystemMetrics();
        }, this.options.metricsInterval);
        
        // Primera recolección inmediata
        this.collectSystemMetrics();
    }
    
    /**
     * Recopilar métricas del sistema
     */
    collectSystemMetrics() {
        const memUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        const uptime = process.uptime();
        const loadAvg = os.loadavg();
        
        const systemMetrics = {
            timestamp: Date.now(),
            memory: {
                rss: memUsage.rss,
                heapUsed: memUsage.heapUsed,
                heapTotal: memUsage.heapTotal,
                external: memUsage.external
            },
            cpu: {
                user: cpuUsage.user,
                system: cpuUsage.system
            },
            system: {
                uptime: uptime,
                loadAvg: loadAvg,
                freeMemory: os.freemem(),
                totalMemory: os.totalmem()
            },
            performance: {
                logCount: this.metrics.performance.logCount,
                bufferSize: this.logBuffer.length
            }
        };
        
        this.metrics.performance.memoryUsage.push(systemMetrics.memory);
        this.metrics.performance.cpuUsage.push(systemMetrics.cpu);
        
        // Mantener solo las últimas 100 métricas
        if (this.metrics.performance.memoryUsage.length > 100) {
            this.metrics.performance.memoryUsage.shift();
            this.metrics.performance.cpuUsage.shift();
        }
        
        // Guardar métricas a archivo
        if (this.options.logToFile && this.metricsFilePath) {
            try {
                fs.writeFileSync(this.metricsFilePath, JSON.stringify({
                    logger: this.name,
                    current: systemMetrics,
                    aggregated: this.metrics,
                    generatedAt: new Date().toISOString()
                }, null, 2));
            } catch (error) {
                // Silenciar errores de escritura para evitar loops
            }
        }
        
        // Log de métricas críticas
        if (systemMetrics.memory.heapUsed > 100 * 1024 * 1024) { // 100MB
            this.warn('High memory usage detected', {
                heapUsed: `${Math.round(systemMetrics.memory.heapUsed / 1024 / 1024)}MB`,
                heapTotal: `${Math.round(systemMetrics.memory.heapTotal / 1024 / 1024)}MB`
            });
        }
        
        if (loadAvg[0] > os.cpus().length * 0.8) {
            this.warn('High CPU load detected', {
                loadAvg: loadAvg[0].toFixed(2),
                cpuCount: os.cpus().length
            });
        }
    }
    
    /**
     * Iniciar flush periódico del buffer
     */
    startBufferFlush() {
        setInterval(() => {
            this.flushBuffer();
        }, this.bufferFlushInterval);
        
        // Flush al cerrar proceso
        process.on('exit', () => this.flushBuffer());
        process.on('SIGINT', () => {
            this.flushBuffer();
            process.exit();
        });
        process.on('SIGTERM', () => {
            this.flushBuffer();
            process.exit();
        });
    }
    
    /**
     * Escribir logs del buffer a archivo
     */
    flushBuffer() {
        if (!this.options.logToFile || this.logBuffer.length === 0) {
            return;
        }
        
        try {
            const logEntries = this.logBuffer.splice(0);
            const logText = logEntries.map(entry => this.formatLogEntry(entry)).join('\n') + '\n';
            
            // Verificar tamaño del archivo
            if (fs.existsSync(this.logFilePath)) {
                const stats = fs.statSync(this.logFilePath);
                if (stats.size > this.options.maxLogSize) {
                    // Rotar log
                    const rotatedPath = `${this.logFilePath}.${Date.now()}`;
                    fs.renameSync(this.logFilePath, rotatedPath);
                }
            }
            
            fs.appendFileSync(this.logFilePath, logText);
            
        } catch (error) {
            // Restaurar buffer si falla la escritura
            console.error('⚠️  Failed to flush log buffer:', error.message);
        }
    }
    
    /**
     * Formatear entrada de log
     */
    formatLogEntry(entry) {
        const timestamp = new Date(entry.timestamp).toISOString();
        const level = entry.level.padEnd(5);
        const name = this.name.padEnd(15);
        
        let message = `[${timestamp}] ${level} [${name}] ${entry.message}`;
        
        if (entry.data && Object.keys(entry.data).length > 0) {
            try {
                message += ` | ${JSON.stringify(entry.data)}`;
            } catch (error) {
                message += ` | [Unserializable data]`;
            }
        }
        
        if (entry.error) {
            message += `\n  Error: ${entry.error.message}`;
            if (entry.error.stack) {
                message += `\n  Stack: ${entry.error.stack}`;
            }
        }
        
        return message;
    }
    
    /**
     * Método genérico de logging
     */
    log(level, message, data = null, error = null) {
        if (this.levels[level] > this.levels[this.options.level]) {
            return;
        }
        
        const logEntry = {
            timestamp: Date.now(),
            level,
            message,
            data,
            error,
            performance: performance.now()
        };
        
        this.metrics.logs[level]++;
        this.metrics.performance.logCount++;
        
        // Console output
        if (this.options.logToConsole) {
            this.outputToConsole(logEntry);
        }
        
        // Buffer para archivo
        if (this.options.logToFile) {
            this.logBuffer.push(logEntry);
        }
        
        return logEntry;
    }
    
    /**
     * Output a consola con colores
     */
    outputToConsole(entry) {
        const colors = {
            ERROR: '\x1b[31m', // Rojo
            WARN: '\x1b[33m',  // Amarillo
            INFO: '\x1b[36m',  // Cyan
            DEBUG: '\x1b[32m', // Verde
            TRACE: '\x1b[37m'  // Blanco
        };
        
        const resetColor = '\x1b[0m';
        const color = colors[entry.level] || '';
        
        const timestamp = new Date(entry.timestamp).toISOString().substr(11, 12);
        const level = entry.level.padEnd(5);
        const name = this.name.substring(0, 12).padEnd(12);
        
        let output = `${color}[${timestamp}] ${level} [${name}] ${entry.message}${resetColor}`;
        
        if (entry.data) {
            try {
                output += `${color} | ${JSON.stringify(entry.data, null, 2)}${resetColor}`;
            } catch (error) {
                output += `${color} | [Unserializable data]${resetColor}`;
            }
        }
        
        if (entry.error) {
            output += `\n${color}  Error: ${entry.error.message}${resetColor}`;
            if (entry.error.stack) {
                output += `\n${color}  Stack: ${entry.error.stack}${resetColor}`;
            }
        }
        
        console.log(output);
    }
    
    /**
     * Métodos de logging por nivel
     */
    error(message, data = null, error = null) {
        return this.log('ERROR', message, data, error);
    }
    
    warn(message, data = null) {
        return this.log('WARN', message, data);
    }
    
    info(message, data = null) {
        return this.log('INFO', message, data);
    }
    
    debug(message, data = null) {
        return this.log('DEBUG', message, data);
    }
    
    trace(message, data = null) {
        return this.log('TRACE', message, data);
    }
    
    /**
     * Logging de performance con timing
     */
    time(label) {
        const key = `timer_${label}`;
        this[key] = performance.now();
        this.debug(`Timer started: ${label}`);
        return label;
    }
    
    timeEnd(label) {
        const key = `timer_${label}`;
        if (!this[key]) {
            this.warn(`Timer not found: ${label}`);
            return 0;
        }
        
        const duration = performance.now() - this[key];
        delete this[key];
        
        this.info(`Timer completed: ${label}`, {
            duration: `${duration.toFixed(2)}ms`
        });
        
        return duration;
    }
    
    /**
     * Obtener métricas actuales
     */
    getMetrics() {
        const memUsage = process.memoryUsage();
        const uptime = process.uptime();
        
        return {
            logger: this.name,
            uptime: uptime,
            logs: { ...this.metrics.logs },
            performance: {
                ...this.metrics.performance,
                currentMemory: memUsage,
                avgMemoryUsage: this.calculateAverage(this.metrics.performance.memoryUsage, 'heapUsed'),
                bufferSize: this.logBuffer.length
            },
            system: {
                freeMemory: os.freemem(),
                totalMemory: os.totalmem(),
                loadAverage: os.loadavg(),
                cpuCount: os.cpus().length
            },
            generatedAt: new Date().toISOString()
        };
    }
    
    /**
     * Calcular promedio de métricas
     */
    calculateAverage(metrics, field) {
        if (!metrics || metrics.length === 0) return 0;
        
        const sum = metrics.reduce((acc, metric) => acc + (metric[field] || 0), 0);
        return Math.round(sum / metrics.length);
    }
    
    /**
     * Crear reporte de salud del logger
     */
    healthCheck() {
        const metrics = this.getMetrics();
        const memUsageMB = metrics.performance.currentMemory.heapUsed / 1024 / 1024;
        const bufferHealth = this.logBuffer.length < 1000 ? 'GOOD' : (this.logBuffer.length < 5000 ? 'WARNING' : 'CRITICAL');
        
        const health = {
            status: 'HEALTHY',
            checks: {
                memory: memUsageMB < 100 ? 'GOOD' : (memUsageMB < 250 ? 'WARNING' : 'CRITICAL'),
                buffer: bufferHealth,
                logFile: this.options.logToFile && this.logFilePath ? 'GOOD' : 'DISABLED',
                uptime: metrics.uptime > 60 ? 'GOOD' : 'STARTING'
            },
            metrics: {
                memoryUsage: `${Math.round(memUsageMB)}MB`,
                bufferSize: this.logBuffer.length,
                totalLogs: metrics.performance.logCount,
                uptime: `${Math.round(metrics.uptime)}s`
            }
        };
        
        const criticalIssues = Object.values(health.checks).filter(check => check === 'CRITICAL').length;
        if (criticalIssues > 0) {
            health.status = 'CRITICAL';
        } else if (Object.values(health.checks).includes('WARNING')) {
            health.status = 'WARNING';
        }
        
        return health;
    }
    
    /**
     * Limpiar recursos
     */
    cleanup() {
        this.info('Logger cleanup initiated');
        this.flushBuffer();
        
        // Limpiar intervalos
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
        }
        if (this.bufferInterval) {
            clearInterval(this.bufferInterval);
        }
        
        this.info('Logger cleanup completed');
    }
}

/**
 * Factory para crear loggers
 */
class HermeticLoggerFactory {
    constructor() {
        this.loggers = new Map();
    }
    
    createLogger(name, options = {}) {
        if (this.loggers.has(name)) {
            return this.loggers.get(name);
        }
        
        const logger = new HermeticLogger(name, options);
        this.loggers.set(name, logger);
        
        return logger;
    }
    
    getLogger(name) {
        return this.loggers.get(name);
    }
    
    getAllLoggers() {
        return Array.from(this.loggers.values());
    }
    
    getSystemMetrics() {
        const loggers = this.getAllLoggers();
        return {
            totalLoggers: loggers.length,
            loggers: loggers.map(logger => ({
                name: logger.name,
                metrics: logger.getMetrics(),
                health: logger.healthCheck()
            })),
            systemOverview: {
                totalMemory: os.totalmem(),
                freeMemory: os.freemem(),
                loadAverage: os.loadavg(),
                uptime: os.uptime(),
                platform: os.platform(),
                nodeVersion: process.version,
                pid: process.pid
            },
            generatedAt: new Date().toISOString()
        };
    }
    
    cleanup() {
        for (const logger of this.loggers.values()) {
            logger.cleanup();
        }
        this.loggers.clear();
    }
}

// Instancia global del factory
const hermetic_logger = new HermeticLoggerFactory();

module.exports = {
    HermeticLogger,
    HermeticLoggerFactory,
    hermetic_logger,
    
    // Funciones de conveniencia
    createLogger: (name, options) => hermetic_logger.createLogger(name, options),
    getLogger: (name) => hermetic_logger.getLogger(name),
    getSystemMetrics: () => hermetic_logger.getSystemMetrics()
};

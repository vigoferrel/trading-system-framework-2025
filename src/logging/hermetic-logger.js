/**
 * 📝 HERMETIC LOGGER - STRUCTURED LOGGING SYSTEM
 * Sistema de logging hermético con categorización y persistencia para QBTC
 * 
 * @author QBTC Development Team
 * @version 2.0
 * @since 2025-01-04
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

/**
 * Logger hermético con capacidades avanzadas de categorización y persistencia
 */
class HermeticLogger {
    constructor(category, config = {}) {
        this.category = category;
        this.config = {
            level: config.level || process.env.LOG_LEVEL || 'info',
            enableColors: config.enableColors !== false,
            enableFileLogging: config.enableFileLogging !== false,
            logDir: config.logDir || path.join(process.cwd(), 'logs'),
            maxFileSize: config.maxFileSize || 10 * 1024 * 1024, // 10MB
            maxFiles: config.maxFiles || 5,
            includeTimestamp: config.includeTimestamp !== false,
            includeLevel: config.includeLevel !== false,
            includeCategory: config.includeCategory !== false,
            ...config
        };

        // Niveles de logging
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        };

        // Colores para terminal
        this.colors = {
            error: '\x1b[31m', // Red
            warn: '\x1b[33m',  // Yellow
            info: '\x1b[36m',  // Cyan
            debug: '\x1b[37m', // White
            reset: '\x1b[0m'
        };

        // Símbolos para cada nivel
        this.symbols = {
            error: '❌',
            warn: '⚠️',
            info: 'ℹ️',
            debug: '🔍'
        };

        // Inicializar logging a archivo si está habilitado
        if (this.config.enableFileLogging) {
            this.initializeFileLogging();
        }

        // Estadísticas del logger
        this.stats = {
            totalLogs: 0,
            errorCount: 0,
            warnCount: 0,
            infoCount: 0,
            debugCount: 0,
            startTime: Date.now()
        };
    }

    /**
     * Inicializar logging a archivo
     */
    initializeFileLogging() {
        try {
            // Crear directorio de logs si no existe
            if (!fs.existsSync(this.config.logDir)) {
                fs.mkdirSync(this.config.logDir, { recursive: true });
            }

            // Archivo de log principal
            const today = new Date().toISOString().split('T')[0];
            this.logFilePath = path.join(this.config.logDir, `qbtc-${today}.log`);
            
            // Archivo de log específico por categoría
            this.categoryLogFilePath = path.join(this.config.logDir, `${this.category.toLowerCase()}-${today}.log`);

        } catch (error) {
            console.error('Error inicializando file logging:', error);
        }
    }

    /**
     * Verificar si un nivel debe ser logueado
     */
    shouldLog(level) {
        const configLevel = this.levels[this.config.level];
        const messageLevel = this.levels[level];
        return messageLevel <= configLevel;
    }

    /**
     * Formatear mensaje de log
     */
    formatMessage(level, message, meta = {}) {
        const timestamp = this.config.includeTimestamp ? new Date().toISOString() : null;
        const levelStr = this.config.includeLevel ? level.toUpperCase() : null;
        const category = this.config.includeCategory ? this.category : null;
        const symbol = this.symbols[level] || '';

        let formattedMessage = '';

        // Añadir componentes del mensaje
        if (timestamp) formattedMessage += `[${timestamp}] `;
        if (levelStr) formattedMessage += `${symbol} ${levelStr} `;
        if (category) formattedMessage += `[${category}] `;
        
        formattedMessage += message;

        // Añadir metadatos si los hay
        if (meta && Object.keys(meta).length > 0) {
            formattedMessage += ` ${JSON.stringify(meta)}`;
        }

        return formattedMessage;
    }

    /**
     * Formatear mensaje para consola (con colores)
     */
    formatConsoleMessage(level, message, meta = {}) {
        const formatted = this.formatMessage(level, message, meta);
        
        if (this.config.enableColors) {
            const color = this.colors[level] || this.colors.reset;
            return `${color}${formatted}${this.colors.reset}`;
        }
        
        return formatted;
    }

    /**
     * Escribir log a archivo
     */
    writeToFile(level, formattedMessage) {
        if (!this.config.enableFileLogging) return;

        try {
            const logEntry = `${formattedMessage}\n`;
            
            // Escribir al archivo principal
            if (this.logFilePath) {
                fs.appendFileSync(this.logFilePath, logEntry);
            }

            // Escribir al archivo de categoría
            if (this.categoryLogFilePath) {
                fs.appendFileSync(this.categoryLogFilePath, logEntry);
            }

            // Rotar archivos si es necesario
            this.rotateLogsIfNeeded();

        } catch (error) {
            console.error('Error escribiendo a archivo de log:', error);
        }
    }

    /**
     * Rotar archivos de log si exceden el tamaño máximo
     */
    rotateLogsIfNeeded() {
        try {
            if (this.logFilePath && fs.existsSync(this.logFilePath)) {
                const stats = fs.statSync(this.logFilePath);
                if (stats.size > this.config.maxFileSize) {
                    const timestamp = Date.now();
                    const rotatedPath = this.logFilePath.replace('.log', `.${timestamp}.log`);
                    fs.renameSync(this.logFilePath, rotatedPath);

                    // Limpiar archivos antiguos
                    this.cleanupOldLogFiles();
                }
            }
        } catch (error) {
            console.error('Error rotando archivos de log:', error);
        }
    }

    /**
     * Limpiar archivos de log antiguos
     */
    cleanupOldLogFiles() {
        try {
            const files = fs.readdirSync(this.config.logDir)
                .filter(file => file.startsWith('qbtc-') && file.endsWith('.log'))
                .map(file => ({
                    name: file,
                    path: path.join(this.config.logDir, file),
                    time: fs.statSync(path.join(this.config.logDir, file)).mtime
                }))
                .sort((a, b) => b.time - a.time);

            // Mantener solo los archivos más recientes
            if (files.length > this.config.maxFiles) {
                const filesToDelete = files.slice(this.config.maxFiles);
                filesToDelete.forEach(file => {
                    fs.unlinkSync(file.path);
                });
            }
        } catch (error) {
            console.error('Error limpiando archivos de log antiguos:', error);
        }
    }

    /**
     * Método genérico de logging
     */
    log(level, message, meta = {}) {
        if (!this.shouldLog(level)) return;

        // Actualizar estadísticas
        this.stats.totalLogs++;
        this.stats[level + 'Count']++;

        // Formatear mensaje
        const formattedMessage = this.formatMessage(level, message, meta);
        const consoleMessage = this.formatConsoleMessage(level, message, meta);

        // Escribir a consola
        console.log(consoleMessage);

        // Escribir a archivo
        this.writeToFile(level, formattedMessage);

        // Emitir evento si es un EventEmitter
        if (this.emit && typeof this.emit === 'function') {
            this.emit('log', { level, message, meta, timestamp: Date.now() });
        }
    }

    /**
     * Log de error
     */
    error(message, meta = {}) {
        // Si es un Error object, extraer información útil
        if (message instanceof Error) {
            meta.stack = message.stack;
            meta.name = message.name;
            message = message.message;
        }
        this.log('error', message, meta);
    }

    /**
     * Log de warning
     */
    warn(message, meta = {}) {
        this.log('warn', message, meta);
    }

    /**
     * Log de información
     */
    info(message, meta = {}) {
        this.log('info', message, meta);
    }

    /**
     * Log de debug
     */
    debug(message, meta = {}) {
        this.log('debug', message, meta);
    }

    /**
     * Log estructurado con objeto completo
     */
    structured(level, data) {
        if (!this.shouldLog(level)) return;

        const message = data.message || 'Structured log entry';
        const meta = { ...data };
        delete meta.message;

        this.log(level, message, meta);
    }

    /**
     * Log de métricas de performance
     */
    metrics(metricName, value, unit = '', meta = {}) {
        this.info(`METRIC: ${metricName} = ${value}${unit}`, {
            metric: metricName,
            value: value,
            unit: unit,
            timestamp: Date.now(),
            ...meta
        });
    }

    /**
     * Log de evento del sistema
     */
    event(eventName, eventData = {}) {
        this.info(`EVENT: ${eventName}`, {
            event: eventName,
            eventData: eventData,
            timestamp: Date.now()
        });
    }

    /**
     * Log de performance de operación
     */
    performance(operationName, duration, meta = {}) {
        this.info(`PERF: ${operationName} completed in ${duration}ms`, {
            operation: operationName,
            duration: duration,
            timestamp: Date.now(),
            ...meta
        });
    }

    /**
     * Log condicional (solo si condition es true)
     */
    conditional(condition, level, message, meta = {}) {
        if (condition) {
            this.log(level, message, meta);
        }
    }

    /**
     * Log con rate limiting (evitar spam)
     */
    throttled(key, interval, level, message, meta = {}) {
        if (!this._throttleCache) this._throttleCache = new Map();

        const now = Date.now();
        const lastLog = this._throttleCache.get(key) || 0;

        if (now - lastLog >= interval) {
            this._throttleCache.set(key, now);
            this.log(level, message, meta);
        }
    }

    /**
     * Obtener estadísticas del logger
     */
    getStats() {
        const uptime = Date.now() - this.stats.startTime;
        return {
            ...this.stats,
            uptime: uptime,
            logsPerSecond: this.stats.totalLogs / (uptime / 1000)
        };
    }

    /**
     * Crear child logger con contexto adicional
     */
    child(additionalContext = {}) {
        const childLogger = Object.create(this);
        childLogger.defaultMeta = { ...this.defaultMeta, ...additionalContext };
        return childLogger;
    }

    /**
     * Flush de logs pendientes (útil para shutdown)
     */
    flush() {
        // En esta implementación síncrona no hay buffer, pero podría implementarse
        return Promise.resolve();
    }

    /**
     * Cerrar logger y limpiar recursos
     */
    close() {
        return this.flush();
    }
}

/**
 * Factory para crear loggers
 */
class HermeticLoggerFactory {
    constructor() {
        this.loggers = new Map();
        this.globalConfig = {
            level: process.env.LOG_LEVEL || 'info',
            enableColors: true,
            enableFileLogging: true
        };
    }

    /**
     * Crear o obtener logger para una categoría
     */
    createLogger(category, config = {}) {
        const effectiveConfig = { ...this.globalConfig, ...config };
        
        if (this.loggers.has(category)) {
            return this.loggers.get(category);
        }

        const logger = new HermeticLogger(category, effectiveConfig);
        this.loggers.set(category, logger);
        
        return logger;
    }

    /**
     * Obtener logger existente
     */
    getLogger(category) {
        return this.loggers.get(category);
    }

    /**
     * Configurar configuración global para nuevos loggers
     */
    setGlobalConfig(config) {
        this.globalConfig = { ...this.globalConfig, ...config };
    }

    /**
     * Cerrar todos los loggers
     */
    async closeAll() {
        const closePromises = Array.from(this.loggers.values()).map(logger => logger.close());
        await Promise.all(closePromises);
        this.loggers.clear();
    }
}

// Instancia singleton del factory
const loggerFactory = new HermeticLoggerFactory();

// Exportar tanto la clase como el factory
module.exports = {
    HermeticLogger,
    HermeticLoggerFactory,
    createLogger: (category, config) => loggerFactory.createLogger(category, config),
    getLogger: (category) => loggerFactory.getLogger(category),
    setGlobalConfig: (config) => loggerFactory.setGlobalConfig(config),
    closeAll: () => loggerFactory.closeAll()
};

/**
 * 📋 CARACTERÍSTICAS DEL HERMETIC LOGGER:
 * 
 * ✅ Logging estructurado con metadatos
 * ✅ Categorización por componente del sistema
 * ✅ Colores en terminal para mejor legibilidad
 * ✅ Escritura a archivo con rotación automática
 * ✅ Niveles de logging configurables (error, warn, info, debug)
 * ✅ Rate limiting para evitar spam de logs
 * ✅ Métricas de performance integradas
 * ✅ Eventos del sistema con timestamps
 * ✅ Child loggers con contexto adicional
 * ✅ Factory pattern para gestión centralizada
 * ✅ Estadísticas del logger para monitoreo
 * ✅ Shutdown graceful con flush de logs
 */

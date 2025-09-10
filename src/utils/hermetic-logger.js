/**
 * 📊 HERMETIC LOGGER - Sistema de logging con métricas de rendimiento
 * Para procesos en segundo plano con reporting de métricas
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
            ...options
        };
        
        this.levels = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
        this.metrics = { logs: { ERROR: 0, WARN: 0, INFO: 0, DEBUG: 0 } };
        
        this.info('HermeticLogger initialized', {
            name: this.name,
            pid: process.pid
        });
    }
    
    log(level, message, data = null) {
        if (this.levels[level] > this.levels[this.options.level]) {
            return;
        }
        
        this.metrics.logs[level]++;
        
        if (this.options.logToConsole) {
            const timestamp = new Date().toISOString().substr(11, 12);
            const colors = {
                ERROR: '\x1b[31m', // Rojo
                WARN: '\x1b[33m',  // Amarillo
                INFO: '\x1b[36m',  // Cyan
                DEBUG: '\x1b[32m'  // Verde
            };
            
            const color = colors[level] || '';
            const resetColor = '\x1b[0m';
            
            let output = `${color}[${timestamp}] ${level.padEnd(5)} [${this.name.substring(0, 12).padEnd(12)}] ${message}${resetColor}`;
            
            if (data) {
                try {
                    output += ` | ${JSON.stringify(data)}`;
                } catch (error) {
                    output += ` | [Unserializable data]`;
                }
            }
            
            console.log(output);
        }
    }
    
    error(message, data = null) { return this.log('ERROR', message, data); }
    warn(message, data = null) { return this.log('WARN', message, data); }
    info(message, data = null) { return this.log('INFO', message, data); }
    debug(message, data = null) { return this.log('DEBUG', message, data); }
    
    getMetrics() {
        return {
            logger: this.name,
            uptime: process.uptime(),
            logs: { ...this.metrics.logs },
            memory: process.memoryUsage(),
            generatedAt: new Date().toISOString()
        };
    }
    
    cleanup() {
        this.info('Logger cleanup completed');
    }
}

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
    
    cleanup() {
        for (const logger of this.loggers.values()) {
            logger.cleanup();
        }
        this.loggers.clear();
    }
}

const hermetic_logger = new HermeticLoggerFactory();

module.exports = {
    HermeticLogger,
    HermeticLoggerFactory,
    hermetic_logger,
    createLogger: (name, options) => hermetic_logger.createLogger(name, options),
    getLogger: (name) => hermetic_logger.getLogger(name)
};

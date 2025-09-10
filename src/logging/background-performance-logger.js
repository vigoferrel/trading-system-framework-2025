/**
 * BACKGROUND PERFORMANCE LOGGER
 * ============================
 * 
 * Sistema de logging estructurado que ejecuta en segundo plano para
 * reportar métricas de desempeño y lógica de depuración del sistema QBTC.
 * 
 * Características:
 * - Logging asíncrono sin bloqueo del hilo principal
 * - Métricas de CPU, memoria y red en tiempo real
 * - Rotación automática de logs
 * - Compresión de logs antiguos
 * - Alertas en tiempo real por umbrales
 * - Dashboard de métricas en vivo
 * - Soporte multilenguaje
 * 
 * Cumple con la regla: "todos los procesos y servidores deben lanzarse 
 * siempre en segundo plano para reportar sus métricas"
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');
const { Worker } = require('worker_threads');
const zlib = require('zlib');
const util = require('util');

// Utilidades internas
const { clampValue, validateRange } = require('../utils/safe-math');
const { kernelRNG } = require('../utils/kernel-rng');

// Configuración de logging por defecto
const DEFAULT_LOGGER_CONFIG = {
    logDirectory: path.join(process.cwd(), 'logs'),
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 100,
    rotationInterval: 24 * 60 * 60 * 1000, // 24 horas
    compressionDelay: 60 * 60 * 1000, // 1 hora
    metricsInterval: 10000, // 10 segundos
    alertThresholds: {
        cpuUsage: 80, // %
        memoryUsage: 85, // %
        errorRate: 10, // errores por minuto
        responseTime: 5000 // ms
    },
    enableCompression: true,
    enableMetrics: true,
    enableAlerts: true,
    bufferSize: 10000, // logs en buffer antes de escribir
    language: 'es' // Idioma por defecto
};

// Mensajes multilenguaje
const MESSAGES = {
    es: {
        systemStarted: 'Sistema iniciado en segundo plano',
        systemStopped: 'Sistema detenido correctamente',
        highCpuUsage: 'Alto uso de CPU detectado',
        highMemoryUsage: 'Alto uso de memoria detectado',
        highErrorRate: 'Alta tasa de errores detectada',
        slowResponseTime: 'Tiempo de respuesta lento detectado',
        logRotated: 'Archivo de log rotado',
        logCompressed: 'Archivo de log comprimido',
        metricsSnapshot: 'Snapshot de métricas capturado',
        workerError: 'Error en worker de segundo plano',
        bufferFull: 'Buffer de logs lleno, forzando escritura'
    },
    en: {
        systemStarted: 'System started in background',
        systemStopped: 'System stopped correctly',
        highCpuUsage: 'High CPU usage detected',
        highMemoryUsage: 'High memory usage detected',
        highErrorRate: 'High error rate detected',
        slowResponseTime: 'Slow response time detected',
        logRotated: 'Log file rotated',
        logCompressed: 'Log file compressed',
        metricsSnapshot: 'Metrics snapshot captured',
        workerError: 'Background worker error',
        bufferFull: 'Log buffer full, forcing write'
    }
};

/**
 * Colector de métricas del sistema
 */
class SystemMetricsCollector {
    constructor() {
        this.startTime = Date.now();
        this.metrics = {
            cpu: { usage: 0, loadAverage: [0, 0, 0] },
            memory: { used: 0, free: 0, total: 0, usagePercent: 0 },
            process: { 
                pid: process.pid,
                uptime: 0,
                memoryUsage: { rss: 0, heapUsed: 0, heapTotal: 0, external: 0 },
                cpuUsage: { user: 0, system: 0 }
            },
            network: { connections: 0, bytesReceived: 0, bytesSent: 0 },
            performance: {
                eventLoopDelay: 0,
                gcDuration: 0,
                responseTime: []
            },
            errors: {
                total: 0,
                rate: 0, // errores por minuto
                lastErrors: []
            },
            quantum: {
                coherence: 0,
                energy: 0,
                decisions: 0,
                successRate: 0
            },
            custom: {}
        };
        
        this.previousCpuUsage = process.cpuUsage();
        this.setupMetricsCollection();
    }
    
    setupMetricsCollection() {
        // Event Loop Lag monitoring
        const start = process.hrtime.bigint();
        setImmediate(() => {
            this.metrics.performance.eventLoopDelay = Number(process.hrtime.bigint() - start) / 1e6;
        });
        
        // GC monitoring si está disponible
        if (global.gc && performance.measureUserAgentSpecificMemory) {
            const gcStart = Date.now();
            global.gc();
            this.metrics.performance.gcDuration = Date.now() - gcStart;
        }
    }
    
    collect() {
        return new Promise((resolve) => {
            // Métricas de proceso
            const memUsage = process.memoryUsage();
            this.metrics.process.uptime = process.uptime();
            this.metrics.process.memoryUsage = memUsage;
            
            // CPU usage
            const currentCpuUsage = process.cpuUsage(this.previousCpuUsage);
            const totalCpuTime = currentCpuUsage.user + currentCpuUsage.system;
            const totalTime = 1000000; // 1 segundo en microsegundos
            this.metrics.process.cpuUsage = {
                user: (currentCpuUsage.user / totalTime) * 100,
                system: (currentCpuUsage.system / totalTime) * 100,
                total: (totalCpuTime / totalTime) * 100
            };
            this.previousCpuUsage = process.cpuUsage();
            
            // Memoria del sistema (simulada - en producción usar librerías nativas)
            const memoryUsageMB = memUsage.rss / 1024 / 1024;
            this.metrics.memory = {
                used: memoryUsageMB,
                free: 1000 - memoryUsageMB, // Simulado
                total: 1000, // Simulado
                usagePercent: (memoryUsageMB / 1000) * 100
            };
            
            // Load average (simulado en Windows)
            this.metrics.cpu.loadAverage = [
                Math.random() * 2,
                Math.random() * 1.5,
                Math.random() * 1.2
            ];
            this.metrics.cpu.usage = this.metrics.process.cpuUsage.total;
            
            // Event loop delay
            this.setupMetricsCollection();
            
            resolve(this.metrics);
        });
    }
    
    addResponseTime(duration) {
        this.metrics.performance.responseTime.push(duration);
        
        // Mantener solo las últimas 100 mediciones
        if (this.metrics.performance.responseTime.length > 100) {
            this.metrics.performance.responseTime.shift();
        }
    }
    
    recordError(error) {
        this.metrics.errors.total++;
        this.metrics.errors.lastErrors.push({
            message: error.message,
            stack: error.stack,
            timestamp: Date.now()
        });
        
        // Mantener solo los últimos 50 errores
        if (this.metrics.errors.lastErrors.length > 50) {
            this.metrics.errors.lastErrors.shift();
        }
        
        // Calcular rate de errores (errores en el último minuto)
        const oneMinuteAgo = Date.now() - 60000;
        const recentErrors = this.metrics.errors.lastErrors.filter(
            e => e.timestamp > oneMinuteAgo
        ).length;
        this.metrics.errors.rate = recentErrors;
    }
    
    updateQuantumMetrics(quantumData) {
        if (quantumData.coherence !== undefined) {
            this.metrics.quantum.coherence = clampValue(quantumData.coherence, 0, 1);
        }
        if (quantumData.energy !== undefined) {
            this.metrics.quantum.energy = clampValue(quantumData.energy, 0, 100);
        }
        if (quantumData.decisions !== undefined) {
            this.metrics.quantum.decisions = quantumData.decisions;
        }
        if (quantumData.successRate !== undefined) {
            this.metrics.quantum.successRate = clampValue(quantumData.successRate, 0, 1);
        }
    }
    
    setCustomMetric(key, value) {
        this.metrics.custom[key] = value;
    }
}

/**
 * Buffer circular para logs de alta performance
 */
class CircularLogBuffer {
    constructor(size = 10000) {
        this.buffer = new Array(size);
        this.size = size;
        this.head = 0;
        this.count = 0;
    }
    
    add(logEntry) {
        this.buffer[this.head] = logEntry;
        this.head = (this.head + 1) % this.size;
        if (this.count < this.size) {
            this.count++;
        }
    }
    
    drain() {
        const entries = [];
        const start = this.count < this.size ? 0 : this.head;
        
        for (let i = 0; i < this.count; i++) {
            const index = (start + i) % this.size;
            if (this.buffer[index]) {
                entries.push(this.buffer[index]);
            }
        }
        
        // Limpiar buffer
        this.head = 0;
        this.count = 0;
        
        return entries;
    }
    
    isFull() {
        return this.count >= this.size;
    }
}

/**
 * Logger principal de background con performance
 */
class BackgroundPerformanceLogger extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = { ...DEFAULT_LOGGER_CONFIG, ...config };
        this.language = this.config.language;
        this.messages = MESSAGES[this.language] || MESSAGES.es;
        
        // Estado del sistema
        this.state = {
            isRunning: false,
            startedAt: null,
            totalLogs: 0,
            totalErrors: 0,
            currentLogFile: null,
            rotationCount: 0,
            compressionCount: 0,
            alertCount: 0
        };
        
        // Componentes
        this.metricsCollector = new SystemMetricsCollector();
        this.logBuffer = new CircularLogBuffer(this.config.bufferSize);
        this.backgroundWorker = null;
        
        // Intervalos
        this.metricsInterval = null;
        this.rotationInterval = null;
        this.compressionInterval = null;
        
        // Alertas activas
        this.activeAlerts = new Set();
        
        this.setupDirectories();
    }
    
    async setupDirectories() {
        try {
            await fs.mkdir(this.config.logDirectory, { recursive: true });
            await fs.mkdir(path.join(this.config.logDirectory, 'archived'), { recursive: true });
            await fs.mkdir(path.join(this.config.logDirectory, 'metrics'), { recursive: true });
        } catch (error) {
            console.error('Error creating log directories:', error);
        }
    }
    
    /**
     * Iniciar el sistema de logging en segundo plano
     */
    async start() {
        if (this.state.isRunning) {
            throw new Error('Background logger is already running');
        }
        
        try {
            this.state.startedAt = Date.now();
            this.state.isRunning = true;
            
            // Crear archivo de log inicial
            await this.createNewLogFile();
            
            // Iniciar worker de segundo plano
            await this.startBackgroundWorker();
            
            // Iniciar intervalos de métricas
            this.startMetricsCollection();
            
            // Iniciar rotación automática
            this.startLogRotation();
            
            // Iniciar compresión automática
            if (this.config.enableCompression) {
                this.startLogCompression();
            }
            
            // Log inicial
            this.log('info', this.messages.systemStarted, {
                pid: process.pid,
                config: this.config,
                timestamp: new Date().toISOString()
            });
            
            this.emit('started');
            
        } catch (error) {
            this.state.isRunning = false;
            throw error;
        }
    }
    
    /**
     * Detener el sistema de logging
     */
    async stop() {
        if (!this.state.isRunning) return;
        
        try {
            // Parar intervalos
            if (this.metricsInterval) clearInterval(this.metricsInterval);
            if (this.rotationInterval) clearInterval(this.rotationInterval);
            if (this.compressionInterval) clearInterval(this.compressionInterval);
            
            // Log final antes de parar
            this.log('info', this.messages.systemStopped, {
                uptime: Date.now() - this.state.startedAt,
                totalLogs: this.state.totalLogs,
                totalErrors: this.state.totalErrors
            });
            
            // Drenar buffer final
            await this.flushBuffer();
            
            // Parar worker
            if (this.backgroundWorker) {
                await this.backgroundWorker.terminate();
                this.backgroundWorker = null;
            }
            
            this.state.isRunning = false;
            this.emit('stopped');
            
        } catch (error) {
            console.error('Error stopping background logger:', error);
        }
    }
    
    /**
     * Iniciar worker de segundo plano para procesamiento asíncrono
     */
    async startBackgroundWorker() {
        const workerScript = `
            const { parentPort } = require('worker_threads');
            const fs = require('fs').promises;
            const path = require('path');
            
            let logFileHandle = null;
            let currentLogFile = null;
            
            parentPort.on('message', async (data) => {
                try {
                    switch (data.type) {
                        case 'WRITE_LOGS':
                            await writeLogs(data.logs, data.logFile);
                            parentPort.postMessage({ type: 'LOGS_WRITTEN', count: data.logs.length });
                            break;
                            
                        case 'ROTATE_LOG':
                            if (logFileHandle) {
                                await logFileHandle.close();
                                logFileHandle = null;
                            }
                            currentLogFile = data.newLogFile;
                            parentPort.postMessage({ type: 'LOG_ROTATED' });
                            break;
                            
                        case 'COMPRESS_LOG':
                            await compressLogFile(data.sourceFile, data.targetFile);
                            parentPort.postMessage({ type: 'LOG_COMPRESSED' });
                            break;
                    }
                } catch (error) {
                    parentPort.postMessage({ 
                        type: 'ERROR', 
                        error: { message: error.message, stack: error.stack }
                    });
                }
            });
            
            async function writeLogs(logs, logFile) {
                if (currentLogFile !== logFile || !logFileHandle) {
                    if (logFileHandle) await logFileHandle.close();
                    logFileHandle = await fs.open(logFile, 'a');
                    currentLogFile = logFile;
                }
                
                const content = logs.map(log => JSON.stringify(log) + '\\n').join('');
                await logFileHandle.write(content);
                await logFileHandle.sync(); // Force write to disk
            }
            
            async function compressLogFile(sourceFile, targetFile) {
                const zlib = require('zlib');
                const sourceData = await fs.readFile(sourceFile);
                const compressedData = zlib.gzipSync(sourceData);
                await fs.writeFile(targetFile, compressedData);
                await fs.unlink(sourceFile); // Delete original
            }
        `;
        
        this.backgroundWorker = new Worker(workerScript, { eval: true });
        
        this.backgroundWorker.on('message', (data) => {
            switch (data.type) {
                case 'LOGS_WRITTEN':
                    this.emit('logsWritten', data.count);
                    break;
                    
                case 'LOG_ROTATED':
                    this.state.rotationCount++;
                    this.emit('logRotated');
                    break;
                    
                case 'LOG_COMPRESSED':
                    this.state.compressionCount++;
                    this.emit('logCompressed');
                    break;
                    
                case 'ERROR':
                    this.log('error', this.messages.workerError, data.error);
                    this.emit('workerError', data.error);
                    break;
            }
        });
        
        this.backgroundWorker.on('error', (error) => {
            this.log('error', this.messages.workerError, {
                error: error.message,
                stack: error.stack
            });
        });
    }
    
    /**
     * Crear nuevo archivo de log
     */
    async createNewLogFile() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `qbtc-performance-${timestamp}.log`;
        this.state.currentLogFile = path.join(this.config.logDirectory, filename);
        
        // Crear archivo vacío
        await fs.writeFile(this.state.currentLogFile, '');
        
        return this.state.currentLogFile;
    }
    
    /**
     * Iniciar recolección de métricas en background
     */
    startMetricsCollection() {
        this.metricsInterval = setInterval(async () => {
            try {
                const metrics = await this.metricsCollector.collect();
                
                // Log de métricas
                this.log('metrics', this.messages.metricsSnapshot, metrics);
                
                // Verificar alertas
                this.checkAlerts(metrics);
                
                // Emitir evento con métricas
                this.emit('metricsCollected', metrics);
                
                // Guardar snapshot de métricas
                await this.saveMetricsSnapshot(metrics);
                
            } catch (error) {
                this.log('error', 'Error collecting metrics', {
                    error: error.message,
                    stack: error.stack
                });
            }
        }, this.config.metricsInterval);
    }
    
    /**
     * Guardar snapshot de métricas
     */
    async saveMetricsSnapshot(metrics) {
        try {
            const timestamp = Date.now();
            const filename = `metrics-${timestamp}.json`;
            const filepath = path.join(this.config.logDirectory, 'metrics', filename);
            
            await fs.writeFile(filepath, JSON.stringify({
                timestamp,
                metrics
            }, null, 2));
            
            // Limpiar snapshots antiguos (mantener solo los últimos 100)
            const metricsDir = path.join(this.config.logDirectory, 'metrics');
            const files = await fs.readdir(metricsDir);
            
            if (files.length > 100) {
                const sortedFiles = files
                    .filter(f => f.startsWith('metrics-'))
                    .sort()
                    .slice(0, files.length - 100);
                
                for (const file of sortedFiles) {
                    await fs.unlink(path.join(metricsDir, file));
                }
            }
            
        } catch (error) {
            console.error('Error saving metrics snapshot:', error);
        }
    }
    
    /**
     * Verificar alertas basadas en métricas
     */
    checkAlerts(metrics) {
        const alerts = [];
        
        // CPU usage alert
        if (metrics.cpu.usage > this.config.alertThresholds.cpuUsage) {
            const alertKey = 'high_cpu';
            if (!this.activeAlerts.has(alertKey)) {
                alerts.push({
                    type: 'HIGH_CPU_USAGE',
                    message: this.messages.highCpuUsage,
                    value: metrics.cpu.usage,
                    threshold: this.config.alertThresholds.cpuUsage,
                    severity: 'WARNING'
                });
                this.activeAlerts.add(alertKey);
            }
        } else {
            this.activeAlerts.delete('high_cpu');
        }
        
        // Memory usage alert
        if (metrics.memory.usagePercent > this.config.alertThresholds.memoryUsage) {
            const alertKey = 'high_memory';
            if (!this.activeAlerts.has(alertKey)) {
                alerts.push({
                    type: 'HIGH_MEMORY_USAGE',
                    message: this.messages.highMemoryUsage,
                    value: metrics.memory.usagePercent,
                    threshold: this.config.alertThresholds.memoryUsage,
                    severity: 'WARNING'
                });
                this.activeAlerts.add(alertKey);
            }
        } else {
            this.activeAlerts.delete('high_memory');
        }
        
        // Error rate alert
        if (metrics.errors.rate > this.config.alertThresholds.errorRate) {
            const alertKey = 'high_error_rate';
            if (!this.activeAlerts.has(alertKey)) {
                alerts.push({
                    type: 'HIGH_ERROR_RATE',
                    message: this.messages.highErrorRate,
                    value: metrics.errors.rate,
                    threshold: this.config.alertThresholds.errorRate,
                    severity: 'CRITICAL'
                });
                this.activeAlerts.add(alertKey);
            }
        } else {
            this.activeAlerts.delete('high_error_rate');
        }
        
        // Response time alert
        const avgResponseTime = metrics.performance.responseTime.length > 0 ?
            metrics.performance.responseTime.reduce((a, b) => a + b, 0) / metrics.performance.responseTime.length : 0;
            
        if (avgResponseTime > this.config.alertThresholds.responseTime) {
            const alertKey = 'slow_response';
            if (!this.activeAlerts.has(alertKey)) {
                alerts.push({
                    type: 'SLOW_RESPONSE_TIME',
                    message: this.messages.slowResponseTime,
                    value: avgResponseTime,
                    threshold: this.config.alertThresholds.responseTime,
                    severity: 'WARNING'
                });
                this.activeAlerts.add(alertKey);
            }
        } else {
            this.activeAlerts.delete('slow_response');
        }
        
        // Emitir alertas
        for (const alert of alerts) {
            this.state.alertCount++;
            this.log('alert', alert.message, alert);
            this.emit('alert', alert);
        }
    }
    
    /**
     * Iniciar rotación automática de logs
     */
    startLogRotation() {
        this.rotationInterval = setInterval(async () => {
            try {
                await this.rotateLogFile();
            } catch (error) {
                this.log('error', 'Error rotating log file', {
                    error: error.message,
                    stack: error.stack
                });
            }
        }, this.config.rotationInterval);
    }
    
    /**
     * Rotar archivo de log actual
     */
    async rotateLogFile() {
        if (!this.state.currentLogFile) return;
        
        try {
            // Drenar buffer antes de rotar
            await this.flushBuffer();
            
            // Crear nuevo archivo
            const newLogFile = await this.createNewLogFile();
            
            // Notificar al worker sobre la rotación
            if (this.backgroundWorker) {
                this.backgroundWorker.postMessage({
                    type: 'ROTATE_LOG',
                    newLogFile
                });
            }
            
            this.log('info', this.messages.logRotated, {
                oldFile: this.state.currentLogFile,
                newFile: newLogFile
            });
            
        } catch (error) {
            throw new Error(`Failed to rotate log file: ${error.message}`);
        }
    }
    
    /**
     * Iniciar compresión automática de logs
     */
    startLogCompression() {
        this.compressionInterval = setInterval(async () => {
            try {
                await this.compressOldLogs();
            } catch (error) {
                this.log('error', 'Error compressing old logs', {
                    error: error.message,
                    stack: error.stack
                });
            }
        }, this.config.compressionDelay);
    }
    
    /**
     * Comprimir logs antiguos
     */
    async compressOldLogs() {
        try {
            const logFiles = await fs.readdir(this.config.logDirectory);
            const oneHourAgo = Date.now() - this.config.compressionDelay;
            
            for (const file of logFiles) {
                if (!file.endsWith('.log') || file === path.basename(this.state.currentLogFile)) {
                    continue;
                }
                
                const filepath = path.join(this.config.logDirectory, file);
                const stats = await fs.stat(filepath);
                
                if (stats.mtime.getTime() < oneHourAgo) {
                    const compressedFile = path.join(
                        this.config.logDirectory, 
                        'archived', 
                        file + '.gz'
                    );
                    
                    if (this.backgroundWorker) {
                        this.backgroundWorker.postMessage({
                            type: 'COMPRESS_LOG',
                            sourceFile: filepath,
                            targetFile: compressedFile
                        });
                    }
                    
                    this.log('info', this.messages.logCompressed, {
                        originalFile: filepath,
                        compressedFile
                    });
                }
            }
        } catch (error) {
            throw new Error(`Failed to compress old logs: ${error.message}`);
        }
    }
    
    /**
     * Función principal de logging
     */
    log(level, message, metadata = {}) {
        if (!this.state.isRunning) return;
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            metadata: {
                service: 'QBTC-BackgroundLogger',
                pid: process.pid,
                uptime: process.uptime(),
                ...metadata
            },
            id: `log_${Date.now()}_${kernelRNG.nextInt(10000)}`
        };
        
        // Agregar al buffer
        this.logBuffer.add(logEntry);
        this.state.totalLogs++;
        
        if (level === 'error') {
            this.state.totalErrors++;
            if (metadata.error) {
                this.metricsCollector.recordError(new Error(metadata.error.message || message));
            }
        }
        
        // Forzar escritura si el buffer está lleno
        if (this.logBuffer.isFull()) {
            this.log('warn', this.messages.bufferFull);
            setImmediate(() => this.flushBuffer());
        }
        
        // Emitir evento de log
        this.emit('log', logEntry);
        
        return logEntry;
    }
    
    /**
     * Drenar buffer de logs al archivo
     */
    async flushBuffer() {
        const logs = this.logBuffer.drain();
        if (logs.length === 0) return;
        
        if (this.backgroundWorker && this.state.currentLogFile) {
            this.backgroundWorker.postMessage({
                type: 'WRITE_LOGS',
                logs,
                logFile: this.state.currentLogFile
            });
        }
        
        return logs.length;
    }
    
    /**
     * Métodos de conveniencia para diferentes niveles de log
     */
    info(message, metadata = {}) {
        return this.log('info', message, metadata);
    }
    
    warn(message, metadata = {}) {
        return this.log('warn', message, metadata);
    }
    
    error(message, metadata = {}) {
        return this.log('error', message, metadata);
    }
    
    debug(message, metadata = {}) {
        return this.log('debug', message, metadata);
    }
    
    metrics(message, metadata = {}) {
        return this.log('metrics', message, metadata);
    }
    
    alert(message, metadata = {}) {
        return this.log('alert', message, metadata);
    }
    
    /**
     * Registrar tiempo de respuesta
     */
    recordResponseTime(duration) {
        this.metricsCollector.addResponseTime(duration);
        
        if (duration > this.config.alertThresholds.responseTime) {
            this.log('warn', 'Slow response time detected', { duration });
        }
    }
    
    /**
     * Actualizar métricas cuánticas
     */
    updateQuantumMetrics(quantumData) {
        this.metricsCollector.updateQuantumMetrics(quantumData);
    }
    
    /**
     * Establecer métrica personalizada
     */
    setCustomMetric(key, value) {
        this.metricsCollector.setCustomMetric(key, value);
    }
    
    /**
     * Obtener estadísticas actuales
     */
    getStats() {
        return {
            state: { ...this.state },
            activeAlerts: Array.from(this.activeAlerts),
            bufferSize: this.logBuffer.count,
            isBufferFull: this.logBuffer.isFull(),
            uptime: this.state.startedAt ? Date.now() - this.state.startedAt : 0
        };
    }
    
    /**
     * Cambiar idioma dinámicamente
     */
    setLanguage(language) {
        if (MESSAGES[language]) {
            this.language = language;
            this.messages = MESSAGES[language];
            this.config.language = language;
            
            this.log('info', 'Language changed', { 
                oldLanguage: this.language,
                newLanguage: language 
            });
        }
    }
    
    /**
     * Crear dashboard de métricas en tiempo real (JSON)
     */
    generateDashboard() {
        const metrics = this.metricsCollector.metrics;
        const stats = this.getStats();
        
        return {
            system: {
                isRunning: this.state.isRunning,
                uptime: stats.uptime,
                language: this.language
            },
            performance: {
                cpu: metrics.cpu,
                memory: metrics.memory,
                eventLoopDelay: metrics.performance.eventLoopDelay,
                averageResponseTime: metrics.performance.responseTime.length > 0 ?
                    metrics.performance.responseTime.reduce((a, b) => a + b, 0) / metrics.performance.responseTime.length : 0
            },
            logging: {
                totalLogs: this.state.totalLogs,
                totalErrors: this.state.totalErrors,
                rotationCount: this.state.rotationCount,
                compressionCount: this.state.compressionCount,
                bufferUtilization: (this.logBuffer.count / this.logBuffer.size) * 100
            },
            alerts: {
                activeCount: this.activeAlerts.size,
                totalTriggered: this.state.alertCount,
                activeAlerts: Array.from(this.activeAlerts)
            },
            quantum: metrics.quantum,
            custom: metrics.custom,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = {
    BackgroundPerformanceLogger,
    SystemMetricsCollector,
    CircularLogBuffer,
    DEFAULT_LOGGER_CONFIG,
    MESSAGES
};

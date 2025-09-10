#!/usr/bin/env node
/**
 * 🚀 QBTC MVP HOLDERS OPTIONS SYSTEM - BACKGROUND LAUNCHER
 * ========================================================
 * 
 * Script hermético para lanzar el sistema MVP en segundo plano
 * con logging continuo, métricas y reportes automáticos.
 * 
 * CARACTERÍSTICAS:
 * - Ejecución completamente en segundo plano
 * - Logging hermético rotatito cada 24h
 * - Reportes automáticos de métricas cada 5 minutos
 * - Health checks periódicos
 * - Auto-restart en caso de falla
 * - Cumplimiento de reglas de segundo plano
 * 
 * @author QBTC Development Team
 * @version BACKGROUND-HERMETIC-1.0
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const HoldersMVPOptionsSystem = require('./mvp-holders-options-system');

// Configuración hermética
const HERMETIC_CONFIG = {
    // Logging
    LOG_DIR: './logs',
    LOG_ROTATION_HOURS: 24,
    LOG_MAX_SIZE: 50 * 1024 * 1024, // 50MB
    
    // Métricas y reportes
    METRICS_INTERVAL: 5 * 60 * 1000, // 5 minutos
    HEALTH_CHECK_INTERVAL: 2 * 60 * 1000, // 2 minutos
    PERFORMANCE_REPORT_INTERVAL: 15 * 60 * 1000, // 15 minutos
    
    // Auto-restart
    MAX_RESTART_ATTEMPTS: 5,
    RESTART_DELAY: 30000, // 30 segundos
    
    // Proceso en segundo plano
    DETACHED_MODE: true,
    STDIO_TO_FILES: true,
    
    // Configuración MVP
    MVP_CONFIG: {
        holderProfile: 'CONSERVATIVE',
        initialCapital: 100000,
        enableLLMAnalysis: true,
        enableQuantumOptimization: true,
        enableArbitrageOpportunities: false
    }
};

/**
 * Logger hermético para procesos en segundo plano
 */
class HermeticLogger {
    constructor(logDir) {
        this.logDir = logDir;
        this.ensureLogDirectory();
        
        // Archivos de log
        this.logFiles = {
            main: path.join(this.logDir, 'mvp-main.log'),
            metrics: path.join(this.logDir, 'mvp-metrics.log'),
            health: path.join(this.logDir, 'mvp-health.log'),
            errors: path.join(this.logDir, 'mvp-errors.log'),
            performance: path.join(this.logDir, 'mvp-performance.log')
        };
        
        // Buffers para escritura eficiente
        this.buffers = {
            main: [],
            metrics: [],
            health: [],
            errors: [],
            performance: []
        };
        
        // Flush periódico
        this.flushInterval = setInterval(() => this.flushAllBuffers(), 10000); // 10s
        
        this.log('main', 'SYSTEM', '🚀 Hermetic Logger initialized');
    }
    
    ensureLogDirectory() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }
    
    log(type, category, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            category,
            message,
            data,
            pid: process.pid,
            memory: process.memoryUsage().rss / 1024 / 1024 // MB
        };
        
        const logLine = JSON.stringify(logEntry) + '\n';
        
        // Agregar al buffer
        if (this.buffers[type]) {
            this.buffers[type].push(logLine);
            
            // Flush inmediato para errores
            if (type === 'errors') {
                this.flushBuffer(type);
            }
        }
        
        // También log a consola para debug
        if (process.env.DEBUG_MVP) {
            console.log(`[${timestamp}] [${category}] ${message}`);
        }
    }
    
    flushBuffer(type) {
        if (this.buffers[type] && this.buffers[type].length > 0) {
            const content = this.buffers[type].join('');
            fs.appendFileSync(this.logFiles[type], content);
            this.buffers[type] = [];
        }
    }
    
    flushAllBuffers() {
        for (const type of Object.keys(this.buffers)) {
            this.flushBuffer(type);
        }
    }
    
    rotateLogsIfNeeded() {
        for (const [type, filePath] of Object.entries(this.logFiles)) {
            try {
                const stats = fs.statSync(filePath);
                const ageHours = (Date.now() - stats.birthtime) / (1000 * 60 * 60);
                
                if (ageHours > HERMETIC_CONFIG.LOG_ROTATION_HOURS || 
                    stats.size > HERMETIC_CONFIG.LOG_MAX_SIZE) {
                    
                    const rotatedPath = `${filePath}.${Date.now()}.old`;
                    fs.renameSync(filePath, rotatedPath);
                    this.log('main', 'LOGGER', `Rotated log file: ${type}`);
                }
            } catch (error) {
                // El archivo no existe aún, está bien
            }
        }
    }
    
    destroy() {
        clearInterval(this.flushInterval);
        this.flushAllBuffers();
    }
}

/**
 * Sistema de monitoreo hermético para MVP
 */
class HermeticMVPMonitor {
    constructor(mvpSystem, logger) {
        this.mvpSystem = mvpSystem;
        this.logger = logger;
        this.metricsHistory = [];
        this.healthHistory = [];
        this.startTime = Date.now();
        this.restartAttempts = 0;
        
        this.setupIntervals();
        this.setupProcessHandlers();
        
        this.logger.log('main', 'MONITOR', '📊 Hermetic MVP Monitor initialized');
    }
    
    setupIntervals() {
        // Métricas cada 5 minutos
        this.metricsInterval = setInterval(() => {
            this.collectMetrics();
        }, HERMETIC_CONFIG.METRICS_INTERVAL);
        
        // Health checks cada 2 minutos
        this.healthInterval = setInterval(() => {
            this.performHealthCheck();
        }, HERMETIC_CONFIG.HEALTH_CHECK_INTERVAL);
        
        // Reporte de performance cada 15 minutos
        this.performanceInterval = setInterval(() => {
            this.generatePerformanceReport();
        }, HERMETIC_CONFIG.PERFORMANCE_REPORT_INTERVAL);
        
        // Rotación de logs cada hora
        this.logRotationInterval = setInterval(() => {
            this.logger.rotateLogsIfNeeded();
        }, 60 * 60 * 1000);
    }
    
    collectMetrics() {
        try {
            const metrics = {
                timestamp: Date.now(),
                systemStatus: this.mvpSystem.getSystemStatus(),
                processMetrics: {
                    uptime: Date.now() - this.startTime,
                    memory: process.memoryUsage(),
                    cpu: process.cpuUsage(),
                    pid: process.pid
                },
                performanceMetrics: this.mvpSystem.state.performance,
                quantumMetrics: this.mvpSystem.state.quantumState,
                portfolioValue: this.mvpSystem.state.portfolio.totalValue
            };
            
            this.metricsHistory.push(metrics);
            
            // Mantener solo las últimas 24 horas
            const cutoffTime = Date.now() - (24 * 60 * 60 * 1000);
            this.metricsHistory = this.metricsHistory.filter(m => m.timestamp > cutoffTime);
            
            this.logger.log('metrics', 'METRICS_COLLECTOR', 'Metrics collected', {
                portfolioValue: metrics.portfolioValue,
                quantumCoherence: metrics.quantumMetrics.coherence,
                memoryMB: metrics.processMetrics.memory.rss / 1024 / 1024
            });
            
        } catch (error) {
            this.logger.log('errors', 'METRICS_ERROR', 'Failed to collect metrics', {
                error: error.message,
                stack: error.stack
            });
        }
    }
    
    performHealthCheck() {
        try {
            const health = this.mvpSystem.getSystemHealth();
            
            this.healthHistory.push({
                timestamp: Date.now(),
                health
            });
            
            // Mantener solo las últimas 24 horas
            const cutoffTime = Date.now() - (24 * 60 * 60 * 1000);
            this.healthHistory = this.healthHistory.filter(h => h.timestamp > cutoffTime);
            
            const status = health.healthy ? 'HEALTHY' : 'DEGRADED';
            this.logger.log('health', 'HEALTH_CHECK', `System health: ${status}`, {
                healthy: health.healthy,
                uptime: health.uptime,
                quantumCoherence: health.quantumCoherence,
                memoryUsage: health.memoryUsage.rss / 1024 / 1024
            });
            
            // Alertas automáticas si sistema no está saludable
            if (!health.healthy) {
                this.handleUnhealthySystem(health);
            }
            
        } catch (error) {
            this.logger.log('errors', 'HEALTH_ERROR', 'Health check failed', {
                error: error.message,
                stack: error.stack
            });
        }
    }
    
    generatePerformanceReport() {
        try {
            const recentMetrics = this.metricsHistory.slice(-12); // Últimas 12 métricas
            
            if (recentMetrics.length === 0) return;
            
            const avgQuantumCoherence = recentMetrics.reduce((sum, m) => 
                sum + m.quantumMetrics.coherence, 0) / recentMetrics.length;
                
            const avgPortfolioValue = recentMetrics.reduce((sum, m) => 
                sum + m.portfolioValue, 0) / recentMetrics.length;
            
            const report = {
                period: '15min',
                timestamp: Date.now(),
                metrics: {
                    averageQuantumCoherence: avgQuantumCoherence,
                    averagePortfolioValue: avgPortfolioValue,
                    totalMetricsCollected: recentMetrics.length,
                    systemUptime: Date.now() - this.startTime,
                    memoryTrend: this.calculateMemoryTrend(recentMetrics)
                },
                alerts: {
                    critical: this.mvpSystem.getCriticalAlerts().length,
                    warnings: this.mvpSystem.getWarningAlerts().length
                }
            };
            
            this.logger.log('performance', 'PERFORMANCE_REPORT', 'Performance report generated', report);
            
        } catch (error) {
            this.logger.log('errors', 'PERFORMANCE_ERROR', 'Performance report failed', {
                error: error.message
            });
        }
    }
    
    calculateMemoryTrend(metrics) {
        if (metrics.length < 2) return 'STABLE';
        
        const first = metrics[0].processMetrics.memory.rss;
        const last = metrics[metrics.length - 1].processMetrics.memory.rss;
        const change = ((last - first) / first) * 100;
        
        if (change > 10) return 'INCREASING';
        if (change < -10) return 'DECREASING';
        return 'STABLE';
    }
    
    handleUnhealthySystem(health) {
        this.logger.log('errors', 'SYSTEM_UNHEALTHY', 'System is unhealthy', {
            status: health.status,
            components: health.components,
            performance: health.performance
        });
        
        // Lógica de auto-restart si es necesario
        if (this.restartAttempts < HERMETIC_CONFIG.MAX_RESTART_ATTEMPTS) {
            this.scheduleRestart();
        }
    }
    
    scheduleRestart() {
        this.restartAttempts++;
        
        this.logger.log('main', 'AUTO_RESTART', `Scheduling restart attempt ${this.restartAttempts}`, {
            delay: HERMETIC_CONFIG.RESTART_DELAY
        });
        
        setTimeout(() => {
            this.restartSystem();
        }, HERMETIC_CONFIG.RESTART_DELAY);
    }
    
    restartSystem() {
        this.logger.log('main', 'RESTART', 'Restarting MVP system');
        
        try {
            // Limpiar intervalos
            this.destroy();
            
            // Re-spawn el proceso
            const child = spawn(process.argv[0], [__filename], {
                detached: true,
                stdio: 'ignore'
            });
            
            child.unref();
            process.exit(0);
            
        } catch (error) {
            this.logger.log('errors', 'RESTART_ERROR', 'Failed to restart system', {
                error: error.message
            });
        }
    }
    
    setupProcessHandlers() {
        // Graceful shutdown
        process.on('SIGINT', () => {
            this.logger.log('main', 'SHUTDOWN', 'Received SIGINT, shutting down gracefully');
            this.destroy();
            process.exit(0);
        });
        
        process.on('SIGTERM', () => {
            this.logger.log('main', 'SHUTDOWN', 'Received SIGTERM, shutting down gracefully');
            this.destroy();
            process.exit(0);
        });
        
        // Manejo de errores no capturados
        process.on('uncaughtException', (error) => {
            this.logger.log('errors', 'UNCAUGHT_EXCEPTION', 'Uncaught exception', {
                error: error.message,
                stack: error.stack
            });
            
            this.logger.flushAllBuffers();
            process.exit(1);
        });
        
        process.on('unhandledRejection', (reason, promise) => {
            this.logger.log('errors', 'UNHANDLED_REJECTION', 'Unhandled promise rejection', {
                reason: reason,
                promise: promise
            });
        });
    }
    
    destroy() {
        clearInterval(this.metricsInterval);
        clearInterval(this.healthInterval);
        clearInterval(this.performanceInterval);
        clearInterval(this.logRotationInterval);
        
        this.logger.log('main', 'MONITOR', 'Hermetic Monitor destroyed');
        this.logger.destroy();
    }
}

/**
 * Función principal para lanzar MVP en background
 */
async function launchMVPBackground() {
    console.log('🚀 [BACKGROUND] Starting QBTC MVP Holdings Options System...');
    console.log('📋 [BACKGROUND] Configuration:');
    console.log('   - Logging directory:', HERMETIC_CONFIG.LOG_DIR);
    console.log('   - Metrics interval:', HERMETIC_CONFIG.METRICS_INTERVAL / 1000, 'seconds');
    console.log('   - Health checks interval:', HERMETIC_CONFIG.HEALTH_CHECK_INTERVAL / 1000, 'seconds');
    console.log('   - Portfolio profile:', HERMETIC_CONFIG.MVP_CONFIG.holderProfile);
    console.log('');
    
    try {
        // Inicializar logger hermético
        const logger = new HermeticLogger(HERMETIC_CONFIG.LOG_DIR);
        logger.log('main', 'LAUNCHER', '🎯 MVP Background launcher starting');
        
        // Crear instancia del MVP system
        const mvpSystem = new HoldersMVPOptionsSystem(HERMETIC_CONFIG.MVP_CONFIG);
        
        // Configurar monitor hermético
        const monitor = new HermeticMVPMonitor(mvpSystem, logger);
        
        // Esperar inicialización
        mvpSystem.on('mvp_ready', (readyInfo) => {
            logger.log('main', 'MVP_READY', '🚀 MVP System ready in background mode', {
                componentsIntegrated: readyInfo.componentsIntegrated,
                quantumCoherence: readyInfo.quantumCoherence,
                portfolioValue: readyInfo.portfolioValue,
                backtestingEnabled: readyInfo.backtestingEnabled
            });
            
            console.log('✅ [BACKGROUND] MVP System ready and running in background!');
            console.log('📊 [BACKGROUND] Dashboard available at: http://localhost:4680');
            console.log('📝 [BACKGROUND] Logs being written to:', HERMETIC_CONFIG.LOG_DIR);
            console.log('🔄 [BACKGROUND] Metrics collection every', HERMETIC_CONFIG.METRICS_INTERVAL / 1000, 'seconds');
            
            if (HERMETIC_CONFIG.DETACHED_MODE) {
                console.log('🔥 [BACKGROUND] Process running detached. Check logs for monitoring.');
                
                // Detach del terminal padre
                process.stdin.pause();
                process.stdout.write('\n');
            }
        });
        
        // Demo portfolio para testing continuo
        const demoHoldings = {
            'BTCUSDT': 2.5,
            'ETHUSDT': 15.0,
            'BNBUSDT': 50.0,
            'SOLUSDT': 100.0,
            'XRPUSDT': 5000.0,
            'DOGEUSDT': 10000.0
        };
        
        // Análisis periódico cada 30 minutos
        setInterval(async () => {
            try {
                const analysis = await mvpSystem.analyzeHolderPortfolio(demoHoldings);
                logger.log('main', 'PERIODIC_ANALYSIS', 'Periodic portfolio analysis completed', {
                    portfolioValue: analysis.portfolioValue,
                    recommendationsCount: analysis.recommendations?.length || 0,
                    riskLevel: analysis.riskAssessment?.overallRisk || 'UNKNOWN'
                });
            } catch (error) {
                logger.log('errors', 'ANALYSIS_ERROR', 'Periodic analysis failed', {
                    error: error.message
                });
            }
        }, 30 * 60 * 1000); // 30 minutos
        
        // Mensaje final
        console.log('🌟 [BACKGROUND] QBTC MVP System launched successfully in hermetic background mode!');
        logger.log('main', 'LAUNCHER', '🌟 MVP System fully operational in background');
        
    } catch (error) {
        console.error('💥 [BACKGROUND] Failed to launch MVP system:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Auto-ejecutar si se llama directamente
if (require.main === module) {
    launchMVPBackground().catch(error => {
        console.error('💥 Fatal error launching background MVP:', error);
        process.exit(1);
    });
}

module.exports = {
    launchMVPBackground,
    HermeticLogger,
    HermeticMVPMonitor,
    HERMETIC_CONFIG
};

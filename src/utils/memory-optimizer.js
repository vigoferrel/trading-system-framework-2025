/**
 * 🧠 MEMORY OPTIMIZER - ADVANCED MEMORY MANAGEMENT SYSTEM
 * Sistema de optimización de memoria para el ecosistema QBTC con limpieza inteligente
 * 
 * Implementa las reglas de segundo plano para métricas de rendimiento
 * 
 * @author QBTC Development Team
 * @version 1.0
 * @since 2025-01-09
 */

const { performance, PerformanceObserver } = require('perf_hooks');
const Logger = require('./secure-logger');
const { kernelRNG } = require('./kernel-rng');

/**
 * Sistema avanzado de optimización de memoria
 */
class MemoryOptimizer {
    constructor(config = {}) {
        this.config = {
            // Thresholds de memoria según reglas de segundo plano
            memoryThreshold: config.memoryThreshold || 85, // %
            criticalThreshold: config.criticalThreshold || 95, // %
            gcForceThreshold: config.gcForceThreshold || 90, // %
            
            // Intervalos (en segundo plano según reglas)
            monitorInterval: config.monitorInterval || 30000, // 30 segundos
            cleanupInterval: config.cleanupInterval || 120000, // 2 minutos
            deepCleanInterval: config.deepCleanInterval || 600000, // 10 minutos
            
            // Cache management
            maxCacheSize: config.maxCacheSize || 1000,
            maxPatterns: config.maxPatterns || 200, // Reducido de 499
            maxHistory: config.maxHistory || 500,
            
            // Auto-recovery
            enableAutoRecovery: config.enableAutoRecovery !== false,
            maxRetries: config.maxRetries || 3,
            
            ...config
        };

        // Estado del optimizador
        this.state = {
            initialized: false,
            monitoring: false,
            lastCleanup: Date.now(),
            lastDeepClean: Date.now(),
            memoryStats: {
                used: 0,
                total: 0,
                percentage: 0,
                trend: []
            },
            alerts: {
                high: false,
                critical: false,
                count: 0
            }
        };

        // Cache inteligente
        this.cache = new Map();
        this.patterns = new Map();
        this.history = [];
        
        // Timers
        this.monitorTimer = null;
        this.cleanupTimer = null;
        this.deepCleanTimer = null;

        // Logger específico
        this.logger = Logger.createLogger('MemoryOptimizer');

        // Performance observer
        this.setupPerformanceObserver();
    }

    /**
     * Inicializar el optimizador de memoria
     */
    async initialize() {
        try {
            this.logger.info('🧠 Inicializando Memory Optimizer...');

            // Obtener estado inicial de memoria
            await this.updateMemoryStats();

            // Iniciar monitoreo en segundo plano (según reglas)
            this.startBackgroundMonitoring();

            // Configurar limpieza automática
            this.setupAutomaticCleanup();

            this.state.initialized = true;
            this.logger.info('✅ Memory Optimizer inicializado correctamente');

        } catch (error) {
            this.logger.error('❌ Error inicializando Memory Optimizer:', error);
            throw error;
        }
    }

    /**
     * Configurar observer de rendimiento
     */
    setupPerformanceObserver() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            for (const entry of entries) {
                if (entry.entryType === 'gc') {
                    // Usar entry.detail para acceder a las propiedades según DEP0152
                    const kind = entry.detail?.kind || 'unknown';
                    const duration = entry.duration || 0;
                    this.logger.debug(`🗑️ GC ejecutado: ${kind} - Duración: ${duration.toFixed(2)}ms`);
                }
            }
        });

        observer.observe({ entryTypes: ['gc'] });
    }

    /**
     * Iniciar monitoreo en segundo plano
     */
    startBackgroundMonitoring() {
        this.monitorTimer = setInterval(async () => {
            await this.monitorMemory();
        }, this.config.monitorInterval);

        this.state.monitoring = true;
        this.logger.info('📊 Monitoreo de memoria iniciado en segundo plano');
    }

    /**
     * Configurar limpieza automática
     */
    setupAutomaticCleanup() {
        // Limpieza regular
        this.cleanupTimer = setInterval(async () => {
            await this.performCleanup();
        }, this.config.cleanupInterval);

        // Limpieza profunda
        this.deepCleanTimer = setInterval(async () => {
            await this.performDeepClean();
        }, this.config.deepCleanInterval);

        this.logger.info('🧹 Sistema de limpieza automática configurado');
    }

    /**
     * Monitorear estado de memoria
     */
    async monitorMemory() {
        try {
            await this.updateMemoryStats();
            const { percentage } = this.state.memoryStats;

            // Verificar thresholds
            if (percentage >= this.config.criticalThreshold) {
                await this.handleCriticalMemory();
            } else if (percentage >= this.config.gcForceThreshold) {
                await this.forceGarbageCollection();
            } else if (percentage >= this.config.memoryThreshold) {
                await this.handleHighMemory();
            } else {
                // Memoria OK - resetear alertas
                this.resetAlerts();
            }

            // Mantener tendencia (máximo 10 lecturas)
            this.state.memoryStats.trend.push({
                timestamp: Date.now(),
                percentage,
                used: this.state.memoryStats.used
            });

            if (this.state.memoryStats.trend.length > 10) {
                this.state.memoryStats.trend.shift();
            }

        } catch (error) {
            this.logger.error('❌ Error monitoreando memoria:', error);
        }
    }

    /**
     * Actualizar estadísticas de memoria
     */
    async updateMemoryStats() {
        const memUsage = process.memoryUsage();
        
        this.state.memoryStats = {
            used: memUsage.heapUsed,
            total: memUsage.heapTotal,
            percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
            rss: memUsage.rss,
            external: memUsage.external,
            trend: this.state.memoryStats.trend || []
        };
    }

    /**
     * Manejar memoria crítica
     */
    async handleCriticalMemory() {
        this.state.alerts.critical = true;
        this.state.alerts.count++;

        this.logger.warn(`🚨 CRÍTICO: Memoria crítica ${this.state.memoryStats.percentage.toFixed(1)}%`);

        // Limpieza agresiva inmediata
        await this.performEmergencyCleanup();
        
        // Forzar garbage collection
        await this.forceGarbageCollection();

        // Si persiste después de limpieza, considerar restart de componente
        setTimeout(async () => {
            await this.updateMemoryStats();
            if (this.state.memoryStats.percentage >= this.config.criticalThreshold) {
                this.logger.error('💀 EMERGENCIA: Memoria crítica persistente - requiere intervención');
                this.emitMemoryEmergency();
            }
        }, 5000);
    }

    /**
     * Manejar memoria alta
     */
    async handleHighMemory() {
        this.state.alerts.high = true;
        
        if (!this.state.alerts.critical) {
            this.logger.warn(`⚠️ ADVERTENCIA: Memoria alta ${this.state.memoryStats.percentage.toFixed(1)}%`);
            
            // Limpieza preventiva
            await this.performCleanup();
        }
    }

    /**
     * Resetear alertas cuando la memoria se normaliza
     */
    resetAlerts() {
        if (this.state.alerts.high || this.state.alerts.critical) {
            this.state.alerts.high = false;
            this.state.alerts.critical = false;
            this.logger.info(`✅ Memoria normalizada: ${this.state.memoryStats.percentage.toFixed(1)}%`);
        }
    }

    /**
     * Realizar limpieza regular
     */
    async performCleanup() {
        this.logger.debug('🧹 Iniciando limpieza regular...');

        let cleaned = 0;

        // Limpiar cache excesivo
        cleaned += await this.cleanCache();

        // Limpiar patrones antiguos
        cleaned += await this.cleanPatterns();

        // Limpiar historial
        cleaned += await this.cleanHistory();

        this.state.lastCleanup = Date.now();
        
        if (cleaned > 0) {
            this.logger.info(`✨ Limpieza completada - ${cleaned} elementos eliminados`);
        }

        return cleaned;
    }

    /**
     * Realizar limpieza profunda
     */
    async performDeepClean() {
        this.logger.info('🔧 Iniciando limpieza profunda...');

        let cleaned = 0;

        // Limpieza agresiva del cache
        cleaned += await this.deepCleanCache();

        // Resetear patrones
        cleaned += await this.resetPatterns();

        // Limpiar completamente el historial
        cleaned += await this.clearHistory();

        // Forzar garbage collection
        await this.forceGarbageCollection();

        this.state.lastDeepClean = Date.now();
        this.logger.info(`🚀 Limpieza profunda completada - ${cleaned} elementos eliminados`);

        return cleaned;
    }

    /**
     * Limpieza de emergencia
     */
    async performEmergencyCleanup() {
        this.logger.error('🆘 Ejecutando limpieza de emergencia...');

        let cleaned = 0;

        // Limpiar todo inmediatamente
        this.cache.clear();
        cleaned += this.cache.size;
        
        this.patterns.clear();
        cleaned += this.patterns.size;
        
        this.history = [];
        cleaned += this.history.length;

        // Múltiples forzados de GC
        for (let i = 0; i < 3; i++) {
            await this.forceGarbageCollection();
            await this.sleep(100);
        }

        this.logger.error(`🔥 Limpieza de emergencia completada - Sistema resetado`);
        return cleaned;
    }

    /**
     * Limpiar cache inteligentemente
     */
    async cleanCache() {
        const initialSize = this.cache.size;
        
        if (this.cache.size > this.config.maxCacheSize) {
            const toDelete = this.cache.size - this.config.maxCacheSize;
            const keys = Array.from(this.cache.keys());
            
            // Eliminar los más antiguos usando kernel RNG para selección
            
            for (let i = 0; i < toDelete; i++) {
                const randomIndex = Math.floor(kernelRNG.nextFloat() * keys.length);
                const keyToDelete = keys.splice(randomIndex, 1)[0];
                this.cache.delete(keyToDelete);
            }
        }

        return initialSize - this.cache.size;
    }

    /**
     * Limpiar patrones
     */
    async cleanPatterns() {
        const initialSize = this.patterns.size;
        
        if (this.patterns.size > this.config.maxPatterns) {
            const toDelete = this.patterns.size - this.config.maxPatterns;
            const entries = Array.from(this.patterns.entries());
            
            // Ordenar por timestamp (eliminar más antiguos)
            entries.sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0));
            
            for (let i = 0; i < toDelete; i++) {
                this.patterns.delete(entries[i][0]);
            }
        }

        return initialSize - this.patterns.size;
    }

    /**
     * Limpiar historial
     */
    async cleanHistory() {
        const initialSize = this.history.length;
        
        if (this.history.length > this.config.maxHistory) {
            const toDelete = this.history.length - this.config.maxHistory;
            this.history.splice(0, toDelete);
        }

        return initialSize - this.history.length;
    }

    /**
     * Limpieza profunda del cache
     */
    async deepCleanCache() {
        const initialSize = this.cache.size;
        
        // Eliminar el 50% del cache más agresivamente
        const toKeep = Math.floor(this.config.maxCacheSize * 0.5);
        
        if (this.cache.size > toKeep) {
            const keys = Array.from(this.cache.keys());
            const toDelete = this.cache.size - toKeep;
            
            for (let i = 0; i < toDelete; i++) {
                const key = keys[i];
                this.cache.delete(key);
            }
        }

        return initialSize - this.cache.size;
    }

    /**
     * Resetear patrones
     */
    async resetPatterns() {
        const initialSize = this.patterns.size;
        
        // Mantener solo los 50 patrones más recientes
        const maxKeep = Math.min(50, this.config.maxPatterns);
        
        if (this.patterns.size > maxKeep) {
            const entries = Array.from(this.patterns.entries());
            entries.sort((a, b) => (b[1].timestamp || 0) - (a[1].timestamp || 0));
            
            this.patterns.clear();
            
            for (let i = 0; i < maxKeep; i++) {
                this.patterns.set(entries[i][0], entries[i][1]);
            }
        }

        return initialSize - this.patterns.size;
    }

    /**
     * Limpiar historial completamente
     */
    async clearHistory() {
        const initialSize = this.history.length;
        
        // Mantener solo los últimos 100 elementos
        const maxKeep = 100;
        
        if (this.history.length > maxKeep) {
            this.history = this.history.slice(-maxKeep);
        }

        return initialSize - this.history.length;
    }

    /**
     * Forzar garbage collection
     */
    async forceGarbageCollection() {
        if (global.gc) {
            this.logger.debug('🗑️ Forzando garbage collection...');
            global.gc();
            
            // Pequeña pausa para que GC complete
            await this.sleep(100);
            
            // Actualizar stats después del GC
            await this.updateMemoryStats();
        } else {
            this.logger.warn('⚠️ Garbage collection no disponible (usar --expose-gc)');
        }
    }

    /**
     * Emitir emergencia de memoria
     */
    emitMemoryEmergency() {
        if (this.config.enableAutoRecovery) {
            this.logger.error('🆘 EMITIENDO SEÑAL DE EMERGENCIA DE MEMORIA');
            
            // Aquí se puede implementar lógica para reiniciar componentes
            process.emit('memoryEmergency', {
                percentage: this.state.memoryStats.percentage,
                used: this.state.memoryStats.used,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Obtener estadísticas del optimizador
     */
    getStats() {
        return {
            memory: this.state.memoryStats,
            cache: {
                size: this.cache.size,
                maxSize: this.config.maxCacheSize
            },
            patterns: {
                size: this.patterns.size,
                maxSize: this.config.maxPatterns
            },
            history: {
                size: this.history.length,
                maxSize: this.config.maxHistory
            },
            alerts: this.state.alerts,
            lastCleanup: this.state.lastCleanup,
            lastDeepClean: this.state.lastDeepClean
        };
    }

    /**
     * Shutdown limpio
     */
    async shutdown() {
        this.logger.info('🔄 Cerrando Memory Optimizer...');

        if (this.monitorTimer) {
            clearInterval(this.monitorTimer);
        }
        
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
        
        if (this.deepCleanTimer) {
            clearInterval(this.deepCleanTimer);
        }

        // Limpieza final
        await this.performCleanup();
        
        this.state.monitoring = false;
        this.logger.info('✅ Memory Optimizer cerrado correctamente');
    }

    /**
     * Utility: Sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = MemoryOptimizer;


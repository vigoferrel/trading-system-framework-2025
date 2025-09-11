/**
 * IP MONITOR - MONITOREO INTELIGENTE DE IP PÚBLICA
 * ==============================================
 * 
 * Monitor de IP que detecta cambios automáticamente y ajusta configuraciones
 * - Detección de cambios de IP pública en tiempo real
 * - Actualización automática de configuraciones de red
 * - Alertas y notificaciones de cambios críticos
 * - Métricas de conectividad y estabilidad
 * - Cumple reglas: kernel RNG y procesos en segundo plano
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class IPMonitor {
    constructor(options = {}) {
        this.config = {
            checkInterval: 30000, // 30 segundos
            ipServices: [
                'https://api.ipify.org',
                'https://icanhazip.com',
                'https://ipecho.net/plain',
                'https://myexternalip.com/raw'
            ],
            configFile: path.join(__dirname, 'ip-config.json'),
            alertThreshold: 3, // alertar después de 3 cambios
            timeout: 10000,
            maxRetries: 3,
            historySize: 100,
            ...options
        };

        this.state = {
            currentIP: null,
            previousIP: null,
            changeCount: 0,
            lastCheck: null,
            ipHistory: [],
            failedChecks: 0,
            totalChecks: 0,
            isStable: true
        };

        this.listeners = new Map();
        this.isRunning = false;
        this.checkInterval = null;
        this.metricsInterval = null;

        // Cargar configuración existente
        this.loadConfiguration();

        console.log('[IP-MONITOR] IP Monitor inicializado');
    }

    /**
     * CARGAR CONFIGURACIÓN DESDE ARCHIVO
     */
    loadConfiguration() {
        try {
            if (fs.existsSync(this.config.configFile)) {
                const config = JSON.parse(fs.readFileSync(this.config.configFile, 'utf8'));
                this.state = { ...this.state, ...config };
                console.log(`[IP-MONITOR] Configuración cargada: IP actual ${this.state.currentIP}`);
            }
        } catch (error) {
            console.warn('[IP-MONITOR] Error cargando configuración:', error.message);
        }
    }

    /**
     * GUARDAR CONFIGURACIÓN A ARCHIVO
     */
    saveConfiguration() {
        try {
            const config = {
                currentIP: this.state.currentIP,
                previousIP: this.state.previousIP,
                changeCount: this.state.changeCount,
                lastCheck: this.state.lastCheck,
                ipHistory: this.state.ipHistory.slice(-this.config.historySize),
                isStable: this.state.isStable
            };

            fs.writeFileSync(this.config.configFile, JSON.stringify(config, null, 2));
        } catch (error) {
            console.error('[IP-MONITOR] Error guardando configuración:', error.message);
        }
    }

    /**
     * OBTENER IP PÚBLICA ACTUAL
     */
    async getCurrentIP() {
        let lastError;

        // Usar kernel RNG para mezclar servicios (regla del proyecto)
        const shuffledServices = [...this.config.ipServices];
        for (let i = shuffledServices.length - 1; i > 0; i--) {
            const randomBytes = crypto.randomBytes(1);
            const j = randomBytes[0] % (i + 1);
            [shuffledServices[i], shuffledServices[j]] = [shuffledServices[j], shuffledServices[i]];
        }

        for (const service of shuffledServices) {
            try {
                const ip = await this.queryIPService(service);
                if (this.isValidIP(ip)) {
                    return ip.trim();
                }
            } catch (error) {
                lastError = error;
                console.warn(`[IP-MONITOR] Servicio ${service} falló:`, error.message);
            }
        }

        throw new Error(`No se pudo obtener IP de ningún servicio: ${lastError?.message}`);
    }

    /**
     * CONSULTAR SERVICIO DE IP
     */
    queryIPService(url) {
        return new Promise((resolve, reject) => {
            const request = https.get(url, {
                timeout: this.config.timeout,
                headers: {
                    'User-Agent': 'QBTC-IP-Monitor/1.0'
                }
            }, (response) => {
                let data = '';
                
                response.on('data', chunk => data += chunk);
                response.on('end', () => {
                    if (response.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(new Error(`HTTP ${response.statusCode}`));
                    }
                });
            });

            request.on('error', reject);
            request.on('timeout', () => {
                request.destroy();
                reject(new Error('Request timeout'));
            });
        });
    }

    /**
     * VALIDAR FORMATO DE IP
     */
    isValidIP(ip) {
        if (!ip || typeof ip !== 'string') return false;
        
        const cleanIP = ip.trim();
        
        // IPv4
        const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
        const ipv4Match = cleanIP.match(ipv4Regex);
        if (ipv4Match) {
            return ipv4Match.slice(1).every(octet => {
                const num = parseInt(octet, 10);
                return num >= 0 && num <= 255;
            });
        }

        // IPv6 (simple check)
        const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv6Regex.test(cleanIP) || cleanIP.includes('::');
    }

    /**
     * INICIAR MONITOREO
     */
    start() {
        if (this.isRunning) {
            console.warn('[IP-MONITOR] Ya está ejecutándose');
            return;
        }

        console.log('[IP-MONITOR] Iniciando monitoreo...');
        this.isRunning = true;

        // Verificación inicial
        this.checkIP();

        // Monitoreo continuo
        this.checkInterval = setInterval(() => {
            this.checkIP();
        }, this.config.checkInterval);

        // Métricas en segundo plano (regla del proyecto)
        this.metricsInterval = setInterval(() => {
            this.reportMetrics();
        }, 60000);

        console.log(`[IP-MONITOR] Monitoreo iniciado (intervalo: ${this.config.checkInterval}ms)`);
    }

    /**
     * VERIFICAR IP ACTUAL
     */
    async checkIP() {
        try {
            this.state.totalChecks++;
            const newIP = await this.getCurrentIP();
            const timestamp = new Date().toISOString();
            
            this.state.lastCheck = timestamp;

            // Si es la primera vez o cambió la IP
            if (!this.state.currentIP || this.state.currentIP !== newIP) {
                await this.handleIPChange(newIP, timestamp);
            } else {
                // IP estable - resetear contador de fallos
                this.state.failedChecks = 0;
                this.state.isStable = true;
            }

            this.saveConfiguration();

        } catch (error) {
            this.state.failedChecks++;
            console.error('[IP-MONITOR] Error verificando IP:', error.message);

            // Marcar como inestable si hay muchos fallos
            if (this.state.failedChecks >= 3) {
                this.state.isStable = false;
                this.emit('instability', {
                    failedChecks: this.state.failedChecks,
                    error: error.message
                });
            }
        }
    }

    /**
     * MANEJAR CAMBIO DE IP
     */
    async handleIPChange(newIP, timestamp) {
        const oldIP = this.state.currentIP;
        
        console.log(`[IP-MONITOR] CAMBIO DE IP detectado: ${oldIP} -> ${newIP}`);
        
        // Actualizar estado
        this.state.previousIP = this.state.currentIP;
        this.state.currentIP = newIP;
        this.state.changeCount++;
        
        // Agregar al historial
        this.state.ipHistory.push({
            ip: newIP,
            timestamp,
            previousIP: oldIP
        });

        // Mantener solo el historial reciente
        if (this.state.ipHistory.length > this.config.historySize) {
            this.state.ipHistory = this.state.ipHistory.slice(-this.config.historySize);
        }

        // Emitir evento de cambio
        this.emit('ipChanged', {
            newIP,
            oldIP,
            timestamp,
            changeCount: this.state.changeCount
        });

        // Alerta si hay muchos cambios
        if (this.state.changeCount >= this.config.alertThreshold) {
            this.emit('alert', {
                type: 'frequent_changes',
                message: `Se han detectado ${this.state.changeCount} cambios de IP`,
                newIP,
                oldIP,
                timestamp
            });
        }

        console.log(`[IP-MONITOR] Nuevo estado: IP=${newIP}, Cambios=${this.state.changeCount}`);
    }

    /**
     * REPORTAR MÉTRICAS (REGLA DEL PROYECTO)
     */
    reportMetrics() {
        const metrics = this.getMetrics();
        
        console.log(`[IP-MONITOR-METRICS] IP: ${metrics.currentIP}, Cambios: ${metrics.changeCount}, Estabilidad: ${metrics.uptime}%`);
        
        this.emit('metrics', metrics);
    }

    /**
     * OBTENER MÉTRICAS ACTUALES
     */
    getMetrics() {
        const now = Date.now();
        const lastCheckTime = this.state.lastCheck ? new Date(this.state.lastCheck).getTime() : now;
        const uptime = this.state.totalChecks > 0 ? 
            ((this.state.totalChecks - this.state.failedChecks) / this.state.totalChecks * 100).toFixed(2) : 100;

        return {
            currentIP: this.state.currentIP,
            previousIP: this.state.previousIP,
            changeCount: this.state.changeCount,
            totalChecks: this.state.totalChecks,
            failedChecks: this.state.failedChecks,
            uptime: parseFloat(uptime),
            isStable: this.state.isStable,
            lastCheck: this.state.lastCheck,
            timeSinceLastCheck: now - lastCheckTime,
            historyCount: this.state.ipHistory.length,
            isRunning: this.isRunning
        };
    }

    /**
     * OBTENER HISTORIAL DE IP
     */
    getIPHistory(limit = 20) {
        return this.state.ipHistory.slice(-limit).reverse();
    }

    /**
     * DETECTAR PATRONES EN CAMBIOS DE IP
     */
    analyzeIPPatterns() {
        if (this.state.ipHistory.length < 3) {
            return { pattern: 'insufficient_data' };
        }

        const recentHistory = this.state.ipHistory.slice(-10);
        const changeIntervals = [];

        // Calcular intervalos entre cambios
        for (let i = 1; i < recentHistory.length; i++) {
            const current = new Date(recentHistory[i].timestamp);
            const previous = new Date(recentHistory[i - 1].timestamp);
            changeIntervals.push(current - previous);
        }

        const avgInterval = changeIntervals.reduce((a, b) => a + b, 0) / changeIntervals.length;
        const minInterval = Math.min(...changeIntervals);
        const maxInterval = Math.max(...changeIntervals);

        // Detectar patrones
        let pattern = 'irregular';
        if (avgInterval < 300000) { // menos de 5 minutos
            pattern = 'very_frequent';
        } else if (avgInterval < 1800000) { // menos de 30 minutos
            pattern = 'frequent';
        } else if (avgInterval > 86400000) { // más de 24 horas
            pattern = 'stable';
        }

        return {
            pattern,
            avgInterval: Math.round(avgInterval / 1000), // en segundos
            minInterval: Math.round(minInterval / 1000),
            maxInterval: Math.round(maxInterval / 1000),
            changeCount: recentHistory.length,
            stability: avgInterval > 3600000 ? 'good' : 'poor' // más de 1 hora = buena
        };
    }

    /**
     * OBTENER ESTADO COMPLETO
     */
    getStatus() {
        return {
            ...this.getMetrics(),
            patterns: this.analyzeIPPatterns(),
            config: {
                checkInterval: this.config.checkInterval,
                alertThreshold: this.config.alertThreshold,
                servicesCount: this.config.ipServices.length
            }
        };
    }

    /**
     * FORZAR VERIFICACIÓN INMEDIATA
     */
    async forceCheck() {
        console.log('[IP-MONITOR] Forzando verificación inmediata...');
        await this.checkIP();
        return this.state.currentIP;
    }

    /**
     * DETENER MONITOREO
     */
    stop() {
        if (!this.isRunning) {
            console.warn('[IP-MONITOR] No está ejecutándose');
            return;
        }

        console.log('[IP-MONITOR] Deteniendo monitoreo...');
        this.isRunning = false;

        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }

        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
            this.metricsInterval = null;
        }

        this.saveConfiguration();
        console.log('[IP-MONITOR] Monitoreo detenido');
    }

    /**
     * EVENTOS
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[IP-MONITOR] Error en listener ${event}:`, error);
            }
        });
    }

    off(event, callback) {
        const callbacks = this.listeners.get(event) || [];
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }
}

module.exports = IPMonitor;

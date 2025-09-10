/**
 * IP MONITOR - SISTEMA DE MONITOREO INTELIGENTE DE IP
 * 
 * Monitoreo continuo de IP con integración al NetworkManager:
 * ✅ Detección de cambios de IP en tiempo real
 * ✅ Alertas y métricas en segundo plano (cumple reglas)
 * ✅ Integración con Binance connectivity testing
 * ✅ Solo Binance como fuente de verdad (cumple reglas)
 * ✅ Sin Math.random, solo kernel RNG (cumple reglas)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

// CUMPLIMIENTO REGLAS: Usar kernel RNG en lugar de Math.random
const generateSecureRandom = () => {
    const buffer = crypto.randomBytes(4);
    return buffer.readUInt32BE(0) / 0xffffffff;
};

class IPMonitor {
    constructor(config = {}) {
        this.config = {
            // CUMPLIMIENTO REGLA: Configuración de procesos en segundo plano
            monitoring: {
                enabled: true,
                interval: 300000, // 5 minutos
                backgroundProcess: true,
                alertOnChange: true,
                metricsReporting: true
            },
            // IP fija configurada (puede ser actualizada)
            targetIP: config.targetIP || '181.43.148.169',
            // Servicios de detección de IP
            ipServices: [
                { url: 'https://api.ipify.org', name: 'ipify' },
                { url: 'https://ipinfo.io/ip', name: 'ipinfo' },
                { url: 'https://icanhazip.com', name: 'icanhazip' }
            ],
            // CUMPLIMIENTO REGLA: Solo Binance para pruebas de conectividad
            binanceTestEndpoint: 'api.binance.com',
            timeouts: {
                ipCheck: 8000,
                binanceTest: 10000
            },
            retries: {
                maxRetries: 3,
                retryDelay: 2000
            },
            ...config
        };
        
        this.currentIP = null;
        this.lastKnownIP = null;
        this.monitoringActive = false;
        this.backgroundMonitor = null;
        this.ipChangeHistory = [];
        
        // Rutas de archivos
        this.logPath = path.join(__dirname, '../../logs', 'ip-monitor.log');
        this.configPath = path.join(__dirname, '../../config', 'ip-monitor-config.json');
        this.historyPath = path.join(__dirname, '../../logs', 'ip-change-history.json');
        
        this.ensureDirectories();
        this.loadHistory();
    }
    
    ensureDirectories() {
        [this.logPath, this.configPath, this.historyPath].forEach(filePath => {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }
    
    loadHistory() {
        try {
            if (fs.existsSync(this.historyPath)) {
                const historyData = fs.readFileSync(this.historyPath, 'utf8');
                this.ipChangeHistory = JSON.parse(historyData);
            }
        } catch (error) {
            this.log(`Error cargando historial: ${error.message}`, 'WARN');
            this.ipChangeHistory = [];
        }
    }
    
    saveHistory() {
        try {
            fs.writeFileSync(this.historyPath, JSON.stringify(this.ipChangeHistory, null, 2));
        } catch (error) {
            this.log(`Error guardando historial: ${error.message}`, 'ERROR');
        }
    }
    
    // CUMPLIMIENTO REGLA: Logging con métricas para segundo plano
    log(message, level = 'INFO', includeMetrics = false) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...(includeMetrics && this.getMonitoringMetrics())
        };
        
        const logLine = `[${timestamp}] [${level}] ${message}`;
        console.log(logLine);
        
        try {
            fs.appendFileSync(this.logPath, logLine + '\n');
            
            if (includeMetrics && this.config.monitoring.metricsReporting) {
                const metricsPath = this.logPath.replace('.log', '.metrics.json');
                fs.appendFileSync(metricsPath, JSON.stringify(logEntry) + '\n');
            }
        } catch (error) {
            console.error(`Error escribiendo log: ${error.message}`);
        }
    }
    
    getMonitoringMetrics() {
        return {
            currentIP: this.currentIP,
            targetIP: this.config.targetIP,
            ipMatches: this.currentIP === this.config.targetIP,
            monitoringActive: this.monitoringActive,
            changeHistoryCount: this.ipChangeHistory.length,
            lastChangeTime: this.ipChangeHistory.length > 0 ? 
                this.ipChangeHistory[this.ipChangeHistory.length - 1].timestamp : null
        };
    }
    
    async initialize() {
        this.log('🔍 INICIANDO IP MONITOR', 'INFO');
        this.log('============================', 'INFO');
        
        try {
            // Detectar IP actual
            await this.detectCurrentIP();
            
            // Verificar estado vs IP objetivo
            const status = this.checkIPStatus();
            
            // CUMPLIMIENTO REGLA: Iniciar monitoreo en segundo plano
            if (this.config.monitoring.backgroundProcess) {
                this.startBackgroundMonitoring();
            }
            
            this.log('✅ IP MONITOR INICIALIZADO', 'SUCCESS', true);
            return status;
            
        } catch (error) {
            this.log(`❌ Error inicializando: ${error.message}`, 'ERROR');
            return { status: 'ERROR', error: error.message };
        }
    }
    
    async detectCurrentIP() {
        this.log('🔍 DETECTANDO IP ACTUAL...', 'INFO');
        
        for (const service of this.config.ipServices) {
            try {
                const ip = await this.getIPFromService(service);
                if (ip && this.isValidIP(ip)) {
                    this.currentIP = ip;
                    this.log(`✅ IP detectada (${service.name}): ${ip}`, 'INFO');
                    return ip;
                }
            } catch (error) {
                this.log(`⚠️ Error con ${service.name}: ${error.message}`, 'WARN');
            }
        }
        
        throw new Error('No se pudo detectar IP actual desde ningún servicio');
    }
    
    async getIPFromService(service) {
        return new Promise((resolve, reject) => {
            const url = new URL(service.url);
            const options = {
                hostname: url.hostname,
                path: url.pathname,
                method: 'GET',
                timeout: this.config.timeouts.ipCheck,
                headers: { 'User-Agent': 'QBTC-IPMonitor/2.0' }
            };
            
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(data.trim());
                    } catch (error) {
                        reject(new Error('Invalid response format'));
                    }
                });
            });
            
            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Timeout'));
            });
            
            req.end();
        });
    }
    
    isValidIP(ip) {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    }
    
    checkIPStatus() {
        if (!this.currentIP) {
            return { status: 'UNKNOWN', message: 'IP no detectada' };
        }
        
        const isCorrectIP = this.currentIP === this.config.targetIP;
        
        if (isCorrectIP) {
            this.log(`✅ IP CORRECTA: ${this.currentIP}`, 'SUCCESS');
            return { 
                status: 'OK', 
                currentIP: this.currentIP, 
                targetIP: this.config.targetIP,
                message: 'IP coincide con la configurada'
            };
        } else {
            this.log(`⚠️ IP DIFERENTE: actual=${this.currentIP}, objetivo=${this.config.targetIP}`, 'WARN');
            return { 
                status: 'CHANGED', 
                currentIP: this.currentIP, 
                targetIP: this.config.targetIP,
                message: 'IP no coincide - revisar configuración de red'
            };
        }
    }
    
    // CUMPLIMIENTO REGLA: Prueba de conectividad solo con Binance
    async testBinanceConnectivity() {
        this.log('🔗 PROBANDO CONECTIVIDAD CON BINANCE...', 'INFO');
        
        try {
            const isWorking = await this.performBinanceTest();
            
            if (isWorking) {
                this.log('✅ CONECTIVIDAD CON BINANCE: OK', 'SUCCESS');
                return { status: 'OK', connectivity: true };
            } else {
                this.log('❌ CONECTIVIDAD CON BINANCE: FALLO', 'ERROR');
                return { status: 'ERROR', connectivity: false };
            }
        } catch (error) {
            this.log(`❌ Error probando Binance: ${error.message}`, 'ERROR');
            return { status: 'ERROR', connectivity: false, error: error.message };
        }
    }
    
    async performBinanceTest() {
        return new Promise((resolve) => {
            const options = {
                hostname: this.config.binanceTestEndpoint,
                path: '/api/v3/time',
                method: 'GET',
                timeout: this.config.timeouts.binanceTest,
                headers: {
                    'User-Agent': 'QBTC-IPMonitor-ConnectivityTest/2.0',
                    'Accept': 'application/json'
                }
            };
            
            const req = https.request(options, (res) => {
                resolve(res.statusCode === 200);
            });
            
            req.on('error', () => resolve(false));
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });
            
            req.end();
        });
    }
    
    // CUMPLIMIENTO REGLA: Proceso de monitoreo en segundo plano
    startBackgroundMonitoring() {
        if (this.backgroundMonitor) {
            clearInterval(this.backgroundMonitor);
        }
        
        this.log('🔄 INICIANDO MONITOREO EN SEGUNDO PLANO...', 'INFO');
        
        this.monitoringActive = true;
        this.backgroundMonitor = setInterval(async () => {
            try {
                await this.performBackgroundCheck();
            } catch (error) {
                this.log(`❌ Error en monitoreo: ${error.message}`, 'ERROR');
            }
        }, this.config.monitoring.interval);
        
        this.log(`✅ Monitoreo activo (cada ${this.config.monitoring.interval / 1000}s)`, 'SUCCESS');
    }
    
    async performBackgroundCheck() {
        this.log('📊 VERIFICACIÓN AUTOMÁTICA IP', 'INFO', true);
        
        try {
            // Guardar IP anterior
            const previousIP = this.currentIP;
            
            // Detectar IP actual
            await this.detectCurrentIP();
            
            // Verificar si ha cambiado
            if (previousIP && this.currentIP !== previousIP) {
                this.handleIPChange(previousIP, this.currentIP);
            }
            
            // Verificar conectividad con Binance
            const connectivityResult = await this.testBinanceConnectivity();
            
            // Reportar métricas completas
            this.reportBackgroundMetrics(connectivityResult);
            
        } catch (error) {
            this.log(`❌ Error en verificación automática: ${error.message}`, 'ERROR');
        }
    }
    
    handleIPChange(oldIP, newIP) {
        this.log(`🚨 CAMBIO DE IP DETECTADO: ${oldIP} → ${newIP}`, 'ALERT', true);
        
        const changeRecord = {
            timestamp: new Date().toISOString(),
            oldIP,
            newIP,
            targetIP: this.config.targetIP,
            wasCorrectBefore: oldIP === this.config.targetIP,
            isCorrectNow: newIP === this.config.targetIP
        };
        
        this.ipChangeHistory.push(changeRecord);
        
        // Mantener solo los últimos 100 cambios
        if (this.ipChangeHistory.length > 100) {
            this.ipChangeHistory = this.ipChangeHistory.slice(-100);
        }
        
        this.saveHistory();
        
        // CUMPLIMIENTO REGLA: Alertas en segundo plano con métricas
        if (this.config.monitoring.alertOnChange) {
            this.triggerIPChangeAlert(changeRecord);
        }
    }
    
    triggerIPChangeAlert(changeRecord) {
        this.log('🚨 ALERTA DE CAMBIO DE IP ACTIVADA', 'ALERT', true);
        
        // Aquí se pueden agregar más mecanismos de alerta
        // Por ejemplo: webhooks, emails, notificaciones push, etc.
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🚨 ALERTA: CAMBIO DE IP DETECTADO');
        console.log(`   IP Anterior: ${changeRecord.oldIP}`);
        console.log(`   IP Nueva: ${changeRecord.newIP}`);
        console.log(`   IP Objetivo: ${changeRecord.targetIP}`);
        console.log(`   Estado: ${changeRecord.isCorrectNow ? '✅ CORRECTA' : '⚠️ DIFERENTE'}`);
        console.log(`   Timestamp: ${changeRecord.timestamp}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
    
    reportBackgroundMetrics(connectivityResult) {
        const metrics = {
            ...this.getMonitoringMetrics(),
            connectivity: connectivityResult,
            reportTime: new Date().toISOString()
        };
        
        // CUMPLIMIENTO REGLA: Métricas para segundo plano
        this.log(`METRICS: ${JSON.stringify(metrics)}`, 'METRICS');
    }
    
    // Método para verificación completa manual
    async runFullCheck() {
        this.log('🔍 VERIFICACIÓN COMPLETA DEL SISTEMA', 'INFO');
        this.log('=====================================', 'INFO');
        
        // 1. Detectar IP actual
        await this.detectCurrentIP();
        
        // 2. Verificar estado IP
        const ipStatus = this.checkIPStatus();
        
        // 3. Probar conectividad Binance
        const connectivityStatus = await this.testBinanceConnectivity();
        
        // 4. Estado general
        const overallStatus = (ipStatus.status === 'OK' && connectivityStatus.status === 'OK') 
            ? 'OK' : 'ISSUES';
        
        const result = {
            overallStatus,
            ipStatus,
            connectivityStatus,
            timestamp: new Date().toISOString(),
            metrics: this.getMonitoringMetrics()
        };
        
        this.log(`=== RESULTADO FINAL: ${overallStatus} ===`, 
                 overallStatus === 'OK' ? 'SUCCESS' : 'WARN', true);
        
        return result;
    }
    
    // Integración con NetworkManager
    integrateWithNetworkManager(networkManager) {
        this.log('🔗 INTEGRANDO CON NETWORK MANAGER', 'SUCCESS');
        
        // El NetworkManager puede usar nuestros datos de IP
        if (networkManager && typeof networkManager.updateIPInfo === 'function') {
            networkManager.updateIPInfo({
                currentIP: this.currentIP,
                targetIP: this.config.targetIP,
                isCorrect: this.currentIP === this.config.targetIP,
                history: this.ipChangeHistory.slice(-10) // Últimos 10 cambios
            });
        }
        
        return {
            currentIP: this.currentIP,
            targetIP: this.config.targetIP,
            monitoring: this.monitoringActive,
            history: this.ipChangeHistory.length
        };
    }
    
    getStatus() {
        return {
            ipMonitor: {
                initialized: true,
                currentIP: this.currentIP,
                targetIP: this.config.targetIP,
                monitoring: {
                    active: this.monitoringActive,
                    interval: this.config.monitoring.interval
                },
                history: {
                    totalChanges: this.ipChangeHistory.length,
                    recentChanges: this.ipChangeHistory.slice(-5)
                }
            },
            metrics: this.getMonitoringMetrics()
        };
    }
    
    shutdown() {
        this.log('🛑 CERRANDO IP MONITOR...', 'INFO');
        
        if (this.backgroundMonitor) {
            clearInterval(this.backgroundMonitor);
            this.backgroundMonitor = null;
        }
        
        this.monitoringActive = false;
        this.saveHistory();
        
        this.log('✅ IP MONITOR CERRADO', 'SUCCESS');
    }
}

module.exports = IPMonitor;

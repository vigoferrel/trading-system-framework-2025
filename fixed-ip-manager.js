/**
 * Sistema de IP Fija para Binance
 * Configuración completa para mantener IP whitelisted
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

class FixedIPManager {
    constructor() {
        this.configPath = path.join(__dirname, 'fixed-ip-config.json');
        this.logPath = path.join(__dirname, 'ip-manager.log');
        this.fixedIP = '181.43.148.169';
        this.loadConfig();
    }

    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                const configData = fs.readFileSync(this.configPath, 'utf8');
                this.config = JSON.parse(configData);
                this.fixedIP = this.config.fixedWhitelistIP;
                this.log('Configuración cargada correctamente', 'INFO');
            } else {
                this.createDefaultConfig();
            }
        } catch (error) {
            this.log(`Error cargando configuración: ${error.message}`, 'ERROR');
            this.createDefaultConfig();
        }
    }

    createDefaultConfig() {
        this.config = {
            description: "Configuración de IP Fija para Binance",
            fixedWhitelistIP: this.fixedIP,
            ipCheckInterval: 300000,
            monitoring: {
                monitorIPChanges: true,
                logIPChanges: true,
                alertOnIPChange: true
            },
            network: {
                primaryInterface: "Wi-Fi",
                vpnInterface: "NordLynx"
            },
            timeouts: {
                connectionTimeout: 10000,
                apiTimeout: 30000
            },
            retries: {
                maxRetries: 3,
                retryDelay: 5000
            }
        };

        this.saveConfig();
        this.log('Configuración por defecto creada', 'INFO');
    }

    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
            this.log('Configuración guardada', 'INFO');
        } catch (error) {
            this.log(`Error guardando configuración: ${error.message}`, 'ERROR');
        }
    }

    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${message}`;

        console.log(logEntry);

        try {
            fs.appendFileSync(this.logPath, logEntry + '\n');
        } catch (error) {
            console.error(`Error escribiendo log: ${error.message}`);
        }
    }

    async getCurrentIP() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'api.ipify.org',
                port: 443,
                path: '/',
                method: 'GET',
                timeout: 10000
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(data.trim());
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Timeout'));
            });

            req.end();
        });
    }

    async checkIPStatus() {
        try {
            const currentIP = await this.getCurrentIP();
            this.log(`IP actual: ${currentIP}`, 'INFO');
            this.log(`IP esperada: ${this.fixedIP}`, 'INFO');

            if (currentIP === this.fixedIP) {
                this.log('✅ IP correcta - Sistema operativo', 'SUCCESS');
                return { status: 'OK', currentIP, expectedIP: this.fixedIP };
            } else {
                this.log('❌ IP incorrecta - Se requiere corrección', 'WARNING');
                this.log(`IP actual: ${currentIP} | IP esperada: ${this.fixedIP}`, 'WARNING');
                return { status: 'CHANGED', currentIP, expectedIP: this.fixedIP };
            }
        } catch (error) {
            this.log(`Error verificando IP: ${error.message}`, 'ERROR');
            return { status: 'ERROR', error: error.message };
        }
    }

    async testBinanceConnection() {
        this.log('=== PRUEBA DE CONEXIÓN CON BINANCE ===', 'INFO');

        try {
            // Simular una petición básica a Binance
            const testUrl = 'https://api.binance.com/api/v3/time';

            return new Promise((resolve, reject) => {
                const options = {
                    hostname: 'api.binance.com',
                    port: 443,
                    path: '/api/v3/time',
                    method: 'GET',
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'FixedIP-Binance-Test/1.0'
                    }
                };

                const req = https.request(options, (res) => {
                    let data = '';

                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    res.on('end', () => {
                        if (res.statusCode === 200) {
                            this.log('✅ Conexión básica con Binance: OK', 'SUCCESS');
                            resolve({ status: 'OK', response: data });
                        } else {
                            this.log(`❌ Error HTTP ${res.statusCode} en conexión básica`, 'ERROR');
                            resolve({ status: 'ERROR', httpCode: res.statusCode });
                        }
                    });
                });

                req.on('error', (error) => {
                    this.log(`❌ Error de conexión con Binance: ${error.message}`, 'ERROR');
                    resolve({ status: 'ERROR', error: error.message });
                });

                req.on('timeout', () => {
                    req.destroy();
                    this.log('❌ Timeout en conexión con Binance', 'ERROR');
                    resolve({ status: 'TIMEOUT' });
                });

                req.end();
            });

        } catch (error) {
            this.log(`Error en prueba de conexión: ${error.message}`, 'ERROR');
            return { status: 'ERROR', error: error.message };
        }
    }

    async runFullCheck() {
        this.log('=== VERIFICACIÓN COMPLETA DEL SISTEMA ===', 'INFO');

        // Verificar IP
        const ipStatus = await this.checkIPStatus();

        // Probar conexión con Binance
        const binanceStatus = await this.testBinanceConnection();

        // Resultado final
        const overallStatus = (ipStatus.status === 'OK' && binanceStatus.status === 'OK') ? 'OK' : 'ISSUES';

        this.log(`=== RESULTADO FINAL: ${overallStatus} ===`, overallStatus === 'OK' ? 'SUCCESS' : 'WARNING');

        return {
            overallStatus,
            ipStatus,
            binanceStatus,
            timestamp: new Date().toISOString()
        };
    }

    startMonitoring() {
        this.log('=== INICIANDO MONITOREO CONTINUO ===', 'INFO');

        const checkInterval = this.config.ipCheckInterval || 300000; // 5 minutos por defecto

        setInterval(async () => {
            const result = await this.runFullCheck();

            if (result.overallStatus !== 'OK') {
                this.log('⚠️ PROBLEMAS DETECTADOS - REVISAR CONFIGURACIÓN', 'WARNING');

                // Aquí se pueden agregar alertas adicionales
                if (this.config.monitoring.alertOnIPChange && result.ipStatus.status === 'CHANGED') {
                    this.log('🚨 ALERTA: Cambio de IP detectado', 'ERROR');
                }
            }
        }, checkInterval);

        this.log(`Monitoreo iniciado - Intervalo: ${checkInterval}ms`, 'INFO');
    }
}

// Función principal para línea de comandos
async function main() {
    const args = process.argv.slice(2);
    const manager = new FixedIPManager();

    if (args.includes('--check')) {
        await manager.runFullCheck();
    } else if (args.includes('--monitor')) {
        manager.startMonitoring();
    } else if (args.includes('--test-binance')) {
        await manager.testBinanceConnection();
    } else if (args.includes('--status')) {
        const status = await manager.checkIPStatus();
        console.log(JSON.stringify(status, null, 2));
    } else {
        console.log('Uso: node fixed-ip-manager.js [opción]');
        console.log('');
        console.log('Opciones:');
        console.log('  --check        : Verificación completa del sistema');
        console.log('  --monitor      : Monitoreo continuo');
        console.log('  --test-binance : Prueba de conexión con Binance');
        console.log('  --status       : Estado actual de IP');
        console.log('');
        console.log('Ejemplos:');
        console.log('  node fixed-ip-manager.js --check');
        console.log('  node fixed-ip-manager.js --monitor');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(error => {
        console.error('Error en ejecución:', error);
        process.exit(1);
    });
}

module.exports = FixedIPManager;

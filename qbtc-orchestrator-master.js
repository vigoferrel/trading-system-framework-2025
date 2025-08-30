/**
 * [ENDPOINTS] QBTC ORCHESTRATOR MASTER - SISTEMA DE ORQUESTACIÓN REAL
 * =========================================================
 * 
 * Orquestador maestro que gestiona todos los servicios de la Banda 46
 * con manejo robusto de errores, recuperación automática y coordinación
 * centralizada de procesos.
 */

const { spawn } = require('child_process');
const net = require('net');
const fs = require('fs');
const path = require('path');

class QBTCOrchestratorMaster {
    constructor() {
        this.services = {
            'srona-api': {
                name: 'SRONA API',
                script: 'srona-api-server.py',
                port: 4601,
                type: 'python',
                dependencies: [],
                healthUrl: 'http://localhost:4601/health',
                process: null,
                status: 'stopped',
                restartAttempts: 0,
                maxRestartAttempts: 3
            },
            'qbtc-core': {
                name: 'QBTC Core',
                script: 'core-system-organized.js',
                port: 4602,
                type: 'node',
                dependencies: ['srona-api'],
                healthUrl: 'http://localhost:4602/api/futures-data',
                process: null,
                status: 'stopped',
                restartAttempts: 0,
                maxRestartAttempts: 3
            },
            'frontend-api': {
                name: 'Frontend API',
                script: 'frontend-api-server.py',
                port: 4603,
                type: 'python',
                dependencies: ['qbtc-core'],
                healthUrl: 'http://localhost:4603/health',
                process: null,
                status: 'stopped',
                restartAttempts: 0,
                maxRestartAttempts: 3
            },
            'vigo-futures': {
                name: 'Vigo Futures',
                script: 'vigo-futures-server.py',
                port: 4604,
                type: 'python',
                dependencies: ['frontend-api'],
                healthUrl: 'http://localhost:4604/health',
                process: null,
                status: 'stopped',
                restartAttempts: 0,
                maxRestartAttempts: 3
            },
            'dashboard': {
                name: 'Dashboard Funcional',
                script: 'dashboard-http-funcional.py',
                port: 4605,
                type: 'python',
                dependencies: ['vigo-futures'],
                healthUrl: 'http://localhost:4605/api/health',
                process: null,
                status: 'stopped',
                restartAttempts: 0,
                maxRestartAttempts: 3
            },
            'monitor-neural': {
                name: 'Monitor Neural',
                script: 'monitor-recomendaciones-neural.py',
                port: 4606,
                type: 'python',
                dependencies: ['dashboard'],
                healthUrl: 'http://localhost:4606/api/health',
                process: null,
                status: 'stopped',
                restartAttempts: 0,
                maxRestartAttempts: 3
            },
            'llm-neural': {
                name: 'LLM Neural Orchestrator',
                script: 'llm-neural-server.js',
                port: 4607,
                type: 'node',
                dependencies: ['monitor-neural'],
                healthUrl: 'http://localhost:4607/health',
                process: null,
                status: 'stopped',
                restartAttempts: 0,
                maxRestartAttempts: 3
            }
        };
        
        this.startupOrder = ['srona-api', 'qbtc-core', 'frontend-api', 'vigo-futures', 'dashboard', 'monitor-neural', 'llm-neural'];
        this.isShuttingDown = false;
        this.healthCheckInterval = null;
    }

    /**
     * Verificar si un puerto está disponible
     */
    async isPortAvailable(port) {
        return new Promise((resolve) => {
            const server = net.createServer();
            server.listen(port, () => {
                server.once('close', () => resolve(true));
                server.close();
            });
            server.on('error', () => resolve(false));
        });
    }

    /**
     * Liberar puerto si está en uso
     */
    async freePort(port) {
        try {
            const { exec } = require('child_process');
            return new Promise((resolve) => {
                exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
                    if (stdout) {
                        const lines = stdout.split('\n');
                        for (const line of lines) {
                            const parts = line.trim().split(/\s+/);
                            if (parts.length >= 5) {
                                const pid = parts[4];
                                if (pid && pid !== 'PID') {
                                    exec(`taskkill /F /PID ${pid}`, () => {
                                        console.log(`[RELOAD] Puerto ${port} liberado (PID: ${pid})`);
                                        setTimeout(resolve, 1000);
                                    });
                                    return;
                                }
                            }
                        }
                    }
                    resolve();
                });
            });
        } catch (error) {
            console.warn(`[WARNING] Error liberando puerto ${port}:`, error.message);
        }
    }

    /**
     * Verificar salud de un servicio
     */
    async checkServiceHealth(serviceName) {
        const service = this.services[serviceName];
        if (!service) return false;

        try {
            const https = require('https');
            const http = require('http');
            const url = require('url');
            
            return new Promise((resolve) => {
                const parsedUrl = url.parse(service.healthUrl);
                const client = parsedUrl.protocol === 'https:' ? https : http;
                
                const req = client.get(service.healthUrl, (res) => {
                    resolve(res.statusCode === 200);
                });
                
                req.on('error', () => resolve(false));
                req.setTimeout(5000, () => {
                    req.destroy();
                    resolve(false);
                });
            });
        } catch (error) {
            return false;
        }
    }

    /**
     * Iniciar un servicio individual
     */
    async startService(serviceName) {
        const service = this.services[serviceName];
        if (!service) {
            console.error(`[ERROR] Servicio ${serviceName} no encontrado`);
            return false;
        }

        // Verificar dependencias
        for (const dep of service.dependencies) {
            if (this.services[dep].status !== 'running') {
                console.log(` Esperando dependencia ${dep} para ${serviceName}...`);
                return false;
            }
        }

        // Liberar puerto si está en uso
        if (!(await this.isPortAvailable(service.port))) {
            console.log(`[RELOAD] Liberando puerto ${service.port} para ${serviceName}...`);
            await this.freePort(service.port);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Verificar que el script existe
        if (!fs.existsSync(service.script)) {
            console.error(`[ERROR] Script ${service.script} no encontrado para ${serviceName}`);
            service.status = 'error';
            return false;
        }

        try {
            console.log(`[START] Iniciando ${service.name} en puerto ${service.port}...`);
            
            const args = service.type === 'python' ? [service.script] : [service.script];
            const command = service.type === 'python' ? 'python' : 'node';
            
            service.process = spawn(command, args, {
                stdio: ['pipe', 'pipe', 'pipe'],
                detached: false
            });

            service.status = 'starting';

            // Manejar salida del proceso
            service.process.stdout.on('data', (data) => {
                console.log(`[${service.name}] ${data.toString().trim()}`);
            });

            service.process.stderr.on('data', (data) => {
                console.error(`[${service.name}] ERROR: ${data.toString().trim()}`);
            });

            // Manejar cierre del proceso
            service.process.on('close', (code) => {
                if (!this.isShuttingDown) {
                    console.log(`[WARNING] ${service.name} se cerró con código ${code}`);
                    service.status = 'stopped';
                    service.process = null;
                    
                    // Reintentar si no excedió el límite
                    if (service.restartAttempts < service.maxRestartAttempts) {
                        service.restartAttempts++;
                        console.log(`[RELOAD] Reintentando ${service.name} (intento ${service.restartAttempts}/${service.maxRestartAttempts})...`);
                        setTimeout(() => this.startService(serviceName), 5000);
                    } else {
                        console.error(`[ERROR] ${service.name} excedió el límite de reintentos`);
                        service.status = 'failed';
                    }
                }
            });

            // Esperar a que el servicio esté listo
            await this.waitForServiceReady(serviceName);
            
            service.status = 'running';
            service.restartAttempts = 0;
            console.log(`[OK] ${service.name} iniciado correctamente`);
            return true;

        } catch (error) {
            console.error(`[ERROR] Error iniciando ${service.name}:`, error.message);
            service.status = 'error';
            return false;
        }
    }

    /**
     * Esperar a que un servicio esté listo
     */
    async waitForServiceReady(serviceName, maxAttempts = 30) {
        const service = this.services[serviceName];
        let attempts = 0;

        while (attempts < maxAttempts) {
            if (await this.checkServiceHealth(serviceName)) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
            attempts++;
        }

        console.error(`[ERROR] ${service.name} no respondió después de ${maxAttempts} intentos`);
        return false;
    }

    /**
     * Detener un servicio
     */
    async stopService(serviceName) {
        const service = this.services[serviceName];
        if (!service || !service.process) return;

        console.log(` Deteniendo ${service.name}...`);
        service.process.kill('SIGTERM');
        
        // Esperar un poco y forzar si es necesario
        setTimeout(() => {
            if (service.process) {
                service.process.kill('SIGKILL');
            }
        }, 5000);
    }

    /**
     * Iniciar todos los servicios en orden
     */
    async startAllServices() {
        console.log('[ENDPOINTS] INICIANDO QBTC ORCHESTRATOR MASTER');
        console.log('='.repeat(60));
        
        this.isShuttingDown = false;

        // Iniciar servicios en orden
        for (const serviceName of this.startupOrder) {
            const success = await this.startService(serviceName);
            if (!success) {
                console.error(`[ERROR] Fallo al iniciar ${serviceName}, continuando...`);
            }
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        // Iniciar monitoreo de salud
        this.startHealthMonitoring();

        console.log('='.repeat(60));
        console.log('[ENDPOINTS] QBTC ORCHESTRATOR MASTER INICIADO');
        console.log('[DATA] URLs disponibles:');
        for (const [name, service] of Object.entries(this.services)) {
            console.log(`   ${service.name}: http://localhost:${service.port}`);
        }
        console.log('='.repeat(60));
    }

    /**
     * Monitoreo de salud de servicios
     */
    startHealthMonitoring() {
        this.healthCheckInterval = setInterval(async () => {
            for (const [serviceName, service] of Object.entries(this.services)) {
                if (service.status === 'running') {
                    const isHealthy = await this.checkServiceHealth(serviceName);
                    if (!isHealthy) {
                        console.warn(`[WARNING] ${service.name} no responde, reiniciando...`);
                        await this.stopService(serviceName);
                        setTimeout(() => this.startService(serviceName), 5000);
                    }
                }
            }
        }, 30000); // Verificar cada 30 segundos
    }

    /**
     * Detener todos los servicios
     */
    async stopAllServices() {
        console.log(' DETENIENDO QBTC ORCHESTRATOR MASTER');
        this.isShuttingDown = true;

        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }

        // Detener servicios en orden inverso
        for (let i = this.startupOrder.length - 1; i >= 0; i--) {
            const serviceName = this.startupOrder[i];
            await this.stopService(serviceName);
        }

        console.log('[OK] QBTC ORCHESTRATOR MASTER DETENIDO');
    }

    /**
     * Obtener estado del sistema
     */
    getSystemStatus() {
        const status = {};
        for (const [name, service] of Object.entries(this.services)) {
            status[name] = {
                name: service.name,
                port: service.port,
                status: service.status,
                restartAttempts: service.restartAttempts,
                healthUrl: service.healthUrl
            };
        }
        return status;
    }
}

// Crear instancia del orquestador
const orchestrator = new QBTCOrchestratorMaster();

// Manejar señales de terminación
process.on('SIGINT', async () => {
    console.log('\n Recibida señal SIGINT, deteniendo servicios...');
    await orchestrator.stopAllServices();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n Recibida señal SIGTERM, deteniendo servicios...');
    await orchestrator.stopAllServices();
    process.exit(0);
});

// Iniciar el orquestador
if (require.main === module) {
    orchestrator.startAllServices().catch(error => {
        console.error('[ERROR] Error en el orquestador:', error);
        process.exit(1);
    });
}

module.exports = QBTCOrchestratorMaster;

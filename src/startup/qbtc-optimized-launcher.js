#!/usr/bin/env node
/**
 * 🚀 QBTC OPTIMIZED LAUNCHER - LAUNCHER OPTIMIZADO DEL SISTEMA QBTC
 * Launcher principal que aplica todas las optimizaciones y configuraciones
 * 
 * Inicia todos los servicios con configuraciones optimizadas según las capacidades del sistema
 * Implementa reglas de segundo plano y métricas del kernel
 * 
 * @author QBTC Development Team
 * @version 3.0
 * @since 2025-01-09
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const { getSystemConfig, getServiceConfig, SYSTEM_CATEGORY } = require('../config/system-optimization');
const Logger = require('../logging/hermetic-logger');

/**
 * QBTC Optimized Launcher
 */
class QBTCOptimizedLauncher {
    constructor() {
        this.logger = Logger.createLogger('QBTCLauncher');
        this.systemConfig = getSystemConfig();
        this.processes = new Map();
        this.startupOrder = this.getOptimizedStartupOrder();
        this.healthChecks = new Map();
        
        this.logger.info(`🚀 QBTC Launcher iniciado para sistema ${SYSTEM_CATEGORY}`);
        this.logger.info(`💾 Sistema: ${this.systemConfig.systemInfo.memory.total.toFixed(1)}GB RAM, ${this.systemConfig.systemInfo.cpu.cores} cores`);
    }

    /**
     * Orden optimizado de startup basado en dependencias
     */
    getOptimizedStartupOrder() {
        return [
            {
                name: 'masterControl',
                file: 'src/core/enhanced-master-control.js',
                critical: true,
                waitTime: 3000, // Tiempo de espera antes del siguiente servicio
                dependencies: []
            },
            {
                name: 'quantumEngine',
                file: 'src/quantum/quantum-engine.js',
                critical: true,
                waitTime: 2000,
                dependencies: []
            },
            {
                name: 'tradingEngine',
                file: 'src/trading/trading-engine.js',
                critical: true,
                waitTime: 2000,
                dependencies: ['quantumEngine']
            },
            {
                name: 'hybridOptimizer',
                file: 'src/core/hybrid-optimizer-v2.js',
                critical: false,
                waitTime: 1500,
                dependencies: ['quantumEngine']
            },
            {
                name: 'concentratedHybrid',
                file: 'src/core/concentrated-hybrid-v3.js',
                critical: false,
                waitTime: 1500,
                dependencies: ['hybridOptimizer']
            },
            {
                name: 'intelligentMonitor',
                file: 'src/monitoring/intelligent-monitor.js',
                critical: false,
                waitTime: 1000,
                dependencies: ['masterControl']
            },
            {
                name: 'dashboard',
                file: 'src/ui/enhanced-dashboard.js',
                critical: false,
                waitTime: 1000,
                dependencies: ['masterControl', 'intelligentMonitor']
            }
        ];
    }

    /**
     * Iniciar el sistema QBTC completo
     */
    async launch() {
        try {
            this.logger.info('🌟 Iniciando sistema QBTC con configuraciones optimizadas...');
            
            // Aplicar optimizaciones pre-launch
            await this.applyPreLaunchOptimizations();
            
            // Validar archivos de servicios
            await this.validateServiceFiles();
            
            // Iniciar servicios en orden optimizado
            await this.startServicesInOrder();
            
            // Configurar health checks
            await this.setupHealthChecks();
            
            // Configurar shutdown handlers
            this.setupShutdownHandlers();
            
            this.logger.info('✅ Sistema QBTC iniciado completamente');
            this.logSystemStatus();
            
        } catch (error) {
            this.logger.error('❌ Error iniciando sistema QBTC:', error);
            await this.emergencyShutdown();
            process.exit(1);
        }
    }

    /**
     * Aplicar optimizaciones pre-launch
     */
    async applyPreLaunchOptimizations() {
        this.logger.info('⚙️ Aplicando optimizaciones pre-launch...');
        
        // Configurar variables de entorno optimizadas
        process.env.UV_THREADPOOL_SIZE = this.systemConfig.nodeOptimizations.uvThreadpoolSize;
        process.env.NODE_MAX_OLD_SPACE_SIZE = this.systemConfig.nodeOptimizations.maxOldSpaceSize;
        
        // Configurar timeouts HTTP globales
        const http = require('http');
        const https = require('https');
        
        http.globalAgent.keepAlive = true;
        http.globalAgent.keepAliveMsecs = this.systemConfig.config.network.keepAliveTimeout;
        http.globalAgent.timeout = this.systemConfig.config.network.requestTimeout;
        
        https.globalAgent.keepAlive = true;
        https.globalAgent.keepAliveMsecs = this.systemConfig.config.network.keepAliveTimeout;
        https.globalAgent.timeout = this.systemConfig.config.network.requestTimeout;
        
        // Configurar límites de proceso
        try {
            process.setMaxListeners(50); // Aumentar límite de listeners
        } catch (error) {
            this.logger.warn('⚠️ No se pudieron configurar límites de proceso:', error.message);
        }
        
        this.logger.info('✅ Optimizaciones pre-launch aplicadas');
    }

    /**
     * Validar que existen los archivos de servicios
     */
    async validateServiceFiles() {
        this.logger.info('📋 Validando archivos de servicios...');
        
        const missing = [];
        
        for (const service of this.startupOrder) {
            const filePath = path.resolve(service.file);
            try {
                await fs.access(filePath);
                this.logger.debug(`✅ Archivo encontrado: ${service.name}`);
            } catch (error) {
                missing.push(service.name);
                this.logger.error(`❌ Archivo faltante: ${service.file}`);
            }
        }
        
        if (missing.length > 0) {
            throw new Error(`Archivos de servicios faltantes: ${missing.join(', ')}`);
        }
        
        this.logger.info('✅ Todos los archivos de servicios validados');
    }

    /**
     * Iniciar servicios en orden optimizado
     */
    async startServicesInOrder() {
        this.logger.info('🚀 Iniciando servicios en orden optimizado...');
        
        for (const service of this.startupOrder) {
            try {
                // Verificar dependencias
                if (!await this.checkDependencies(service)) {
                    this.logger.warn(`⚠️ Dependencias no cumplidas para ${service.name}, omitiendo...`);
                    continue;
                }
                
                // Iniciar servicio
                await this.startService(service);
                
                // Esperar tiempo optimizado
                if (service.waitTime > 0) {
                    this.logger.debug(`⏳ Esperando ${service.waitTime}ms antes del siguiente servicio...`);
                    await this.sleep(service.waitTime);
                }
                
            } catch (error) {
                this.logger.error(`❌ Error iniciando servicio ${service.name}:`, error);
                
                if (service.critical) {
                    throw new Error(`Servicio crítico ${service.name} falló al iniciar`);
                } else {
                    this.logger.warn(`⚠️ Servicio no crítico ${service.name} falló, continuando...`);
                }
            }
        }
        
        this.logger.info('✅ Todos los servicios iniciados');
    }

    /**
     * Verificar dependencias de un servicio
     */
    async checkDependencies(service) {
        if (!service.dependencies || service.dependencies.length === 0) {
            return true;
        }
        
        for (const dependency of service.dependencies) {
            const process = this.processes.get(dependency);
            if (!process || process.killed) {
                this.logger.warn(`⚠️ Dependencia ${dependency} no está activa para ${service.name}`);
                return false;
            }
        }
        
        return true;
    }

    /**
     * Iniciar un servicio individual
     */
    async startService(service) {
        this.logger.info(`🔄 Iniciando servicio: ${service.name}...`);
        
        const serviceConfig = getServiceConfig(service.name);
        const filePath = path.resolve(service.file);
        
        // Configurar variables de entorno específicas del servicio
        const env = {
            ...process.env,
            SERVICE_NAME: service.name,
            SERVICE_PORT: serviceConfig.port || 14000,
            NODE_ENV: process.env.NODE_ENV || 'development',
            SYSTEM_CATEGORY: SYSTEM_CATEGORY
        };
        
        // Configurar opciones de spawn optimizadas
        const spawnOptions = {
            env,
            stdio: ['pipe', 'pipe', 'pipe'],
            detached: false,
            cwd: process.cwd()
        };
        
        // Calcular argumentos de Node.js optimizados
        const nodeArgs = this.getOptimizedNodeArgs(service);
        
        // Iniciar proceso
        const childProcess = spawn('node', [...nodeArgs, filePath], spawnOptions);
        
        // Configurar manejo de eventos
        this.setupProcessEventHandlers(service, childProcess);
        
        // Registrar proceso
        this.processes.set(service.name, childProcess);
        
        // Esperar a que el servicio esté listo
        await this.waitForServiceReady(service, serviceConfig.port);
        
        this.logger.info(`✅ Servicio ${service.name} iniciado correctamente en puerto ${serviceConfig.port}`);
    }

    /**
     * Obtener argumentos de Node.js optimizados para el servicio
     */
    getOptimizedNodeArgs(service) {
        const args = [];
        
        // Configuración de memoria específica por servicio
        const serviceConfig = getServiceConfig(service.name);
        const memoryMultiplier = this.getServiceMemoryMultiplier(service.name);
        const maxMemory = Math.floor(this.systemConfig.nodeOptimizations.maxOldSpaceSize * memoryMultiplier);
        
        args.push(`--max-old-space-size=${maxMemory}`);
        
        // Configuraciones de GC optimizadas (sin --optimize-for-size que no está permitido)
        if (SYSTEM_CATEGORY === 'high-performance') {
            args.push('--max-semi-space-size=64');
        } else if (SYSTEM_CATEGORY === 'low-performance') {
            args.push('--max-semi-space-size=16');
        }
        
        // Configuraciones específicas por servicio
        if (service.name === 'quantumEngine' || service.name === 'concentratedHybrid') {
            args.push('--expose-gc'); // Para servicios que usan análisis intensivo
        }
        
        return args;
    }

    /**
     * Obtener multiplicador de memoria por servicio
     */
    getServiceMemoryMultiplier(serviceName) {
        const multipliers = {
            masterControl: 0.15,        // 15% de la memoria asignada
            quantumEngine: 0.25,        // 25% - servicio intensivo
            tradingEngine: 0.20,        // 20% - servicio crítico
            hybridOptimizer: 0.15,      // 15% - servicio medio
            concentratedHybrid: 0.20,   // 20% - análisis intensivo
            intelligentMonitor: 0.10,   // 10% - monitoreo ligero
            dashboard: 0.10             // 10% - UI ligera
        };
        
        return multipliers[serviceName] || 0.10;
    }

    /**
     * Configurar manejo de eventos de proceso
     */
    setupProcessEventHandlers(service, childProcess) {
        // Manejo de salida del proceso
        childProcess.on('exit', (code, signal) => {
            this.logger.warn(`⚠️ Servicio ${service.name} terminó (código: ${code}, señal: ${signal})`);
            this.processes.delete(service.name);
            
            // Auto-reinicio para servicios críticos
            if (service.critical && code !== 0) {
                this.logger.info(`🔄 Reiniciando servicio crítico ${service.name}...`);
                setTimeout(() => {
                    this.startService(service).catch(error => {
                        this.logger.error(`❌ Error reiniciando ${service.name}:`, error);
                    });
                }, 5000);
            }
        });
        
        // Manejo de errores
        childProcess.on('error', (error) => {
            this.logger.error(`❌ Error en servicio ${service.name}:`, error);
        });
        
        // Manejo de stdout/stderr con logging mejorado
        childProcess.stdout.on('data', (data) => {
            const lines = data.toString().trim().split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    this.logger.debug(`[${service.name}] ${line}`);
                }
            });
        });
        
        childProcess.stderr.on('data', (data) => {
            const lines = data.toString().trim().split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    this.logger.warn(`[${service.name}] ${line}`);
                }
            });
        });
    }

    /**
     * Esperar a que un servicio esté listo
     */
    async waitForServiceReady(service, port, maxAttempts = 30) {
        this.logger.debug(`⏳ Esperando a que ${service.name} esté listo en puerto ${port}...`);
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await this.makeHealthCheckRequest(port);
                if (response.status === 'OK') {
                    this.logger.debug(`✅ Servicio ${service.name} respondió correctamente`);
                    return true;
                }
            } catch (error) {
                // Ignorar errores durante la espera
            }
            
            await this.sleep(1000); // Esperar 1 segundo entre intentos
        }
        
        throw new Error(`Servicio ${service.name} no respondió en ${maxAttempts} segundos`);
    }

    /**
     * Realizar request de health check
     */
    async makeHealthCheckRequest(port) {
        const http = require('http');
        
        return new Promise((resolve, reject) => {
            const req = http.request({
                hostname: 'localhost',
                port: port,
                path: '/health',
                method: 'GET',
                timeout: 2000
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        resolve(response);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
            
            req.on('error', reject);
            req.on('timeout', () => reject(new Error('Health check timeout')));
            req.end();
        });
    }

    /**
     * Configurar health checks continuos
     */
    async setupHealthChecks() {
        this.logger.info('❤️ Configurando health checks continuos...');
        
        const healthCheckInterval = this.systemConfig.config.intervals.healthCheck;
        
        for (const service of this.startupOrder) {
            if (this.processes.has(service.name)) {
                const serviceConfig = getServiceConfig(service.name);
                
                const healthCheck = setInterval(async () => {
                    try {
                        await this.makeHealthCheckRequest(serviceConfig.port);
                    } catch (error) {
                        this.logger.warn(`⚠️ Health check falló para ${service.name}: ${error.message}`);
                    }
                }, healthCheckInterval);
                
                this.healthChecks.set(service.name, healthCheck);
            }
        }
        
        this.logger.info('✅ Health checks configurados');
    }

    /**
     * Configurar manejo de shutdown
     */
    setupShutdownHandlers() {
        const gracefulShutdown = async (signal) => {
            this.logger.info(`📡 Señal ${signal} recibida, iniciando shutdown graceful...`);
            await this.gracefulShutdown();
            process.exit(0);
        };
        
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));
        
        // Manejo de errores no capturados
        process.on('uncaughtException', async (error) => {
            this.logger.error('💀 Uncaught Exception:', error);
            await this.emergencyShutdown();
            process.exit(1);
        });
        
        process.on('unhandledRejection', async (reason, promise) => {
            this.logger.error('💀 Unhandled Rejection at:', promise, 'reason:', reason);
            await this.emergencyShutdown();
            process.exit(1);
        });
    }

    /**
     * Shutdown graceful del sistema
     */
    async gracefulShutdown() {
        this.logger.info('🔄 Iniciando shutdown graceful del sistema QBTC...');
        
        // Detener health checks
        for (const [serviceName, interval] of this.healthChecks) {
            clearInterval(interval);
        }
        this.healthChecks.clear();
        
        // Cerrar servicios en orden inverso
        const shutdownOrder = [...this.startupOrder].reverse();
        
        for (const service of shutdownOrder) {
            const process = this.processes.get(service.name);
            if (process && !process.killed) {
                this.logger.info(`🔄 Cerrando servicio: ${service.name}...`);
                
                try {
                    // Intentar cerrar gracefully
                    process.kill('SIGTERM');
                    
                    // Esperar un tiempo razonable
                    await this.sleep(2000);
                    
                    // Forzar cierre si es necesario
                    if (!process.killed) {
                        process.kill('SIGKILL');
                    }
                    
                } catch (error) {
                    this.logger.error(`❌ Error cerrando ${service.name}:`, error);
                }
                
                this.processes.delete(service.name);
            }
        }
        
        this.logger.info('✅ Sistema QBTC cerrado gracefully');
    }

    /**
     * Shutdown de emergencia
     */
    async emergencyShutdown() {
        this.logger.error('💀 Ejecutando shutdown de emergencia...');
        
        // Matar todos los procesos inmediatamente
        for (const [serviceName, process] of this.processes) {
            if (!process.killed) {
                process.kill('SIGKILL');
                this.logger.warn(`💀 Forzado cierre de ${serviceName}`);
            }
        }
        
        this.processes.clear();
        this.healthChecks.clear();
        
        this.logger.error('💀 Shutdown de emergencia completado');
    }

    /**
     * Mostrar estado del sistema
     */
    logSystemStatus() {
        this.logger.info('📊 Estado del sistema QBTC:');
        this.logger.info(`   🖥️  Categoría: ${SYSTEM_CATEGORY}`);
        this.logger.info(`   💾 Memoria: ${this.systemConfig.systemInfo.memory.total.toFixed(1)}GB total, ${this.systemConfig.systemInfo.memory.available.toFixed(1)}GB disponible`);
        this.logger.info(`   ⚡ CPU: ${this.systemConfig.systemInfo.cpu.cores} cores`);
        this.logger.info(`   🚀 Servicios activos: ${this.processes.size}`);
        
        for (const [serviceName, process] of this.processes) {
            const serviceConfig = getServiceConfig(serviceName);
            this.logger.info(`   - ${serviceName}: PID ${process.pid}, Puerto ${serviceConfig.port}`);
        }
    }

    /**
     * Utilidad para sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializar y ejecutar si se llama directamente
if (require.main === module) {
    const launcher = new QBTCOptimizedLauncher();
    launcher.launch().catch(error => {
        console.error('💀 Error fatal en launcher:', error);
        process.exit(1);
    });
}

module.exports = QBTCOptimizedLauncher;

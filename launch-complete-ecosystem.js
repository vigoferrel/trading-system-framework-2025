#!/usr/bin/env node
/**
 * 🚀 COMPLETE ECOSYSTEM LAUNCHER
 * ==============================
 * 
 * Script de lanzamiento automático para todo el ecosistema de trading:
 * - Core Anti-418 (4602)
 * - Hybrid Optimizer V2 (4800) 
 * - Concentrated Hybrid V3 (4850)
 * - Enhanced Recommendations Service (4608)
 * - SRONA Quantum Bridge (4646) - NUEVO
 * - Enhanced Dashboard (5001)
 * - Intelligent Monitor Dashboard (5000)
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 🎯 CONFIGURACIÓN COMPLETA DEL ECOSISTEMA
const COMPLETE_ECOSYSTEM = {
    // Core Services (Critical Priority)
    CORE_ANTI_418: {
        name: 'Core Anti-418',
        script: 'core-optimal-anti418.js',
        port: 4602,
        priority: 1,
        healthEndpoint: '/health',
        category: 'CORE'
    },
    
    // Enhanced Services (High Priority)  
    ENHANCED_RECOMMENDATIONS: {
        name: 'Enhanced Recommendations Service',
        script: 'enhanced-recommendations-service.js',
        port: 4608,
        priority: 2,
        healthEndpoint: '/',
        category: 'ENHANCED'
    },
    
    // Quantum Bridge (High Priority)
    SRONA_QUANTUM_BRIDGE: {
        name: 'SRONA Quantum Bridge',
        script: 'srona-quantum-bridge.js',
        port: 4646,
        priority: 2,
        healthEndpoint: '/',
        category: 'QUANTUM'
    },
    
    // Hybrid Systems (Medium Priority)
    HYBRID_OPTIMIZER_V2: {
        name: 'Hybrid Optimizer V2',
        script: 'hybrid-recommendation-optimizer.js', 
        port: 4800,
        priority: 3,
        healthEndpoint: '/api/status',
        category: 'HYBRID'
    },
    
    CONCENTRATED_HYBRID_V3: {
        name: 'Concentrated Hybrid V3',
        script: 'concentrated-hybrid-system.js',
        port: 4850,
        priority: 3,
        healthEndpoint: '/api/system-status',
        category: 'HYBRID'
    },
    
    // Dashboard Services (Medium Priority)
    ENHANCED_DASHBOARD: {
        name: 'Enhanced Dashboard',
        script: 'enhanced-dashboard.js',
        port: 5001,
        priority: 4,
        healthEndpoint: '/',
        category: 'DASHBOARD'
    },
    
    INTELLIGENT_MONITOR: {
        name: 'Intelligent Monitor Dashboard',
        script: 'intelligent-monitor-dashboard.js',
        port: 5000,
        priority: 4,
        healthEndpoint: '/',
        category: 'DASHBOARD'
    }
};

class CompleteEcosystemLauncher {
    constructor() {
        this.processes = {};
        this.startupLog = [];
        this.isShuttingDown = false;
        this.launchStartTime = Date.now();
        
        // Configuración de logs
        this.logFile = `ecosystem-launch-${Date.now()}.log`;
        this.pidFile = 'complete-ecosystem.pid';
        
        console.log('🚀 [ECOSYSTEM] Inicializando Complete Ecosystem Launcher...');
        this.initializeLogger();
    }
    
    initializeLogger() {
        // Crear directorio de logs si no existe
        if (!fs.existsSync('logs')) {
            fs.mkdirSync('logs');
        }
        
        this.log('ECOSYSTEM LAUNCHER INITIALIZED', 'INFO');
        this.log(`Configuration: ${Object.keys(COMPLETE_ECOSYSTEM).length} services`, 'INFO');
    }
    
    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${message}`;
        
        console.log(logEntry);
        
        // Escribir a archivo de log
        fs.appendFileSync(path.join('logs', this.logFile), logEntry + '\n');
        
        // Mantener historial en memoria
        this.startupLog.push({
            timestamp: timestamp,
            level: level,
            message: message
        });
    }
    
    async launchCompleteEcosystem() {
        try {
            this.log('STARTING COMPLETE ECOSYSTEM LAUNCH', 'INFO');
            this.log('===============================================', 'INFO');
            
            // Verificar que los scripts existen
            await this.verifyScripts();
            
            // Lanzar servicios por prioridad
            const priorities = [...new Set(Object.values(COMPLETE_ECOSYSTEM).map(s => s.priority))].sort();
            
            for (const priority of priorities) {
                const servicesInPriority = Object.entries(COMPLETE_ECOSYSTEM)
                    .filter(([key, service]) => service.priority === priority);
                
                this.log(`Launching Priority ${priority} Services (${servicesInPriority.length} services)`, 'INFO');
                
                // Lanzar servicios de esta prioridad en paralelo
                const launchPromises = servicesInPriority.map(([key, service]) => 
                    this.launchService(key, service)
                );
                
                await Promise.all(launchPromises);
                
                // Esperar entre prioridades para startup suave
                if (priority < Math.max(...priorities)) {
                    this.log(`Waiting 3 seconds before next priority level...`, 'INFO');
                    await this.sleep(3000);
                }
            }
            
            // Verificar salud de todos los servicios
            await this.performHealthChecks();
            
            // Guardar PIDs
            this.savePIDs();
            
            // Setup cleanup handlers
            this.setupCleanupHandlers();
            
            const totalTime = Date.now() - this.launchStartTime;
            this.log(`COMPLETE ECOSYSTEM LAUNCHED SUCCESSFULLY in ${totalTime}ms`, 'SUCCESS');
            this.printEcosystemStatus();
            
        } catch (error) {
            this.log(`ECOSYSTEM LAUNCH FAILED: ${error.message}`, 'ERROR');
            process.exit(1);
        }
    }
    
    async verifyScripts() {
        this.log('Verifying all service scripts...', 'INFO');
        
        const missingScripts = [];
        for (const [key, service] of Object.entries(COMPLETE_ECOSYSTEM)) {
            if (!fs.existsSync(service.script)) {
                missingScripts.push(`${service.name}: ${service.script}`);
            }
        }
        
        if (missingScripts.length > 0) {
            throw new Error(`Missing scripts: ${missingScripts.join(', ')}`);
        }
        
        this.log('✅ All service scripts verified', 'INFO');
    }
    
    async launchService(key, serviceConfig) {
        try {
            this.log(`🚀 Launching ${serviceConfig.name} (${serviceConfig.script})...`, 'INFO');
            
            const process = spawn('node', [serviceConfig.script], {
                detached: false,
                stdio: ['ignore', 'pipe', 'pipe'],
                cwd: __dirname
            });
            
            // Configurar logging del proceso
            process.stdout.on('data', (data) => {
                const output = data.toString().trim();
                if (output) {
                    this.log(`[${key}] ${output}`, 'SERVICE');
                }
            });
            
            process.stderr.on('data', (data) => {
                const error = data.toString().trim();
                if (error) {
                    this.log(`[${key}] ERROR: ${error}`, 'ERROR');
                }
            });
            
            process.on('exit', (code, signal) => {
                if (!this.isShuttingDown) {
                    this.log(`[${key}] Process exited with code ${code}, signal ${signal}`, 'WARN');
                    
                    // Auto-restart logic (opcional)
                    setTimeout(() => {
                        if (!this.isShuttingDown) {
                            this.log(`[${key}] Attempting auto-restart...`, 'INFO');
                            this.launchService(key, serviceConfig);
                        }
                    }, 5000);
                }
            });
            
            // Guardar referencia del proceso
            this.processes[key] = {
                process: process,
                config: serviceConfig,
                startTime: Date.now(),
                pid: process.pid
            };
            
            this.log(`✅ ${serviceConfig.name} launched successfully (PID: ${process.pid})`, 'SUCCESS');
            
        } catch (error) {
            this.log(`❌ Failed to launch ${serviceConfig.name}: ${error.message}`, 'ERROR');
            throw error;
        }
    }
    
    async performHealthChecks() {
        this.log('Performing health checks on all services...', 'INFO');
        
        // Esperar un poco para que los servicios se inicialicen
        await this.sleep(5000);
        
        const axios = require('axios').default;
        const healthResults = {};
        
        for (const [key, service] of Object.entries(COMPLETE_ECOSYSTEM)) {
            try {
                const healthUrl = `http://localhost:${service.port}${service.healthEndpoint}`;
                this.log(`Health check: ${service.name} -> ${healthUrl}`, 'INFO');
                
                const response = await axios.get(healthUrl, { timeout: 5000 });
                healthResults[key] = {
                    status: 'HEALTHY',
                    responseTime: response.config.timeout,
                    statusCode: response.status
                };
                
                this.log(`✅ ${service.name} is HEALTHY`, 'SUCCESS');
                
            } catch (error) {
                healthResults[key] = {
                    status: 'UNHEALTHY',
                    error: error.message
                };
                
                this.log(`❌ ${service.name} health check failed: ${error.message}`, 'ERROR');
            }
        }
        
        // Resumen de salud
        const healthyCount = Object.values(healthResults).filter(r => r.status === 'HEALTHY').length;
        const totalCount = Object.keys(healthResults).length;
        
        this.log(`Health Check Summary: ${healthyCount}/${totalCount} services healthy`, 'INFO');
        
        return healthResults;
    }
    
    savePIDs() {
        const pidData = {
            timestamp: Date.now(),
            launcher_pid: process.pid,
            services: {}
        };
        
        for (const [key, processInfo] of Object.entries(this.processes)) {
            pidData.services[key] = {
                name: processInfo.config.name,
                pid: processInfo.pid,
                port: processInfo.config.port,
                script: processInfo.config.script,
                startTime: processInfo.startTime
            };
        }
        
        fs.writeFileSync(this.pidFile, JSON.stringify(pidData, null, 2));
        this.log(`PIDs saved to ${this.pidFile}`, 'INFO');
    }
    
    setupCleanupHandlers() {
        const cleanup = () => {
            if (this.isShuttingDown) return;
            
            console.log('\n🛑 [ECOSYSTEM] Shutting down complete ecosystem...');
            this.isShuttingDown = true;
            
            // Terminar todos los procesos
            for (const [key, processInfo] of Object.entries(this.processes)) {
                if (processInfo.process && !processInfo.process.killed) {
                    console.log(`🛑 Terminating ${processInfo.config.name} (PID: ${processInfo.pid})...`);
                    
                    try {
                        process.kill(processInfo.pid, 'SIGTERM');
                        
                        // Force kill después de 5 segundos si es necesario
                        setTimeout(() => {
                            if (!processInfo.process.killed) {
                                process.kill(processInfo.pid, 'SIGKILL');
                            }
                        }, 5000);
                        
                    } catch (error) {
                        console.log(`Warning: Could not terminate ${processInfo.config.name}: ${error.message}`);
                    }
                }
            }
            
            // Limpiar archivo PID
            if (fs.existsSync(this.pidFile)) {
                fs.unlinkSync(this.pidFile);
            }
            
            console.log('✅ [ECOSYSTEM] Complete ecosystem shutdown completed');
            process.exit(0);
        };
        
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        process.on('exit', cleanup);
    }
    
    printEcosystemStatus() {
        console.log('\n' + '='.repeat(80));
        console.log('🌟 COMPLETE TRADING ECOSYSTEM - OPERATIONAL STATUS');
        console.log('='.repeat(80));
        console.log('🔗 ECOSYSTEM ENDPOINTS:');
        
        // Agrupar por categoría
        const categories = {};
        Object.entries(COMPLETE_ECOSYSTEM).forEach(([key, service]) => {
            if (!categories[service.category]) {
                categories[service.category] = [];
            }
            categories[service.category].push({ key, service });
        });
        
        Object.entries(categories).forEach(([category, services]) => {
            console.log(`\n📁 ${category} SERVICES:`);
            services.forEach(({ key, service }) => {
                const processInfo = this.processes[key];
                const status = processInfo ? '🟢 ACTIVE' : '🔴 FAILED';
                console.log(`   ${status} ${service.name}`);
                console.log(`      └── http://localhost:${service.port} (PID: ${processInfo?.pid || 'N/A'})`);
            });
        });
        
        console.log('\n🌉 SRONA QUANTUM BRIDGE - SPECIAL ENDPOINTS:');
        console.log('   📊 Unified Recommendations: http://localhost:4646/api/unified-recommendations');
        console.log('   🔍 Bridge Status: http://localhost:4646/api/bridge-status');
        console.log('   🧬 Full Quantum Analysis: http://localhost:4646/api/full-quantum-analysis');
        console.log('   🐍 Python Test: http://localhost:4646/api/test-python');
        
        console.log('\n🖥️ DASHBOARDS:');
        console.log('   🚀 Enhanced Dashboard: http://localhost:5001');
        console.log('   📊 Monitor Dashboard: http://localhost:5000');
        
        console.log('\n📋 ECOSYSTEM MANAGEMENT:');
        console.log(`   📝 Launch Log: logs/${this.logFile}`);
        console.log(`   🔧 PIDs File: ${this.pidFile}`);
        console.log('   🛑 Shutdown: Ctrl+C or SIGTERM');
        
        console.log('='.repeat(80));
        console.log('✅ Complete Trading Ecosystem is OPERATIONAL');
        console.log('🌟 All services launched and ready for trading operations');
        console.log('='.repeat(80));
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Función principal
async function main() {
    try {
        const launcher = new CompleteEcosystemLauncher();
        await launcher.launchCompleteEcosystem();
        
        // Mantener el proceso principal vivo
        console.log('\n🔄 [ECOSYSTEM] Launcher will keep running to monitor all services...');
        console.log('Press Ctrl+C to shutdown the complete ecosystem\n');
        
        // Infinite loop para mantener vivo
        setInterval(() => {
            // Heartbeat cada 30 segundos
            const activeServices = Object.keys(launcher.processes).length;
            console.log(`💓 [HEARTBEAT] ${new Date().toLocaleTimeString()} - ${activeServices} services active`);
        }, 30000);
        
    } catch (error) {
        console.error('❌ [FATAL] Ecosystem launch failed:', error);
        process.exit(1);
    }
}

// Ejecutar si es el módulo principal
if (require.main === module) {
    main().catch(error => {
        console.error('❌ [FATAL]', error);
        process.exit(1);
    });
}

module.exports = { CompleteEcosystemLauncher, COMPLETE_ECOSYSTEM };

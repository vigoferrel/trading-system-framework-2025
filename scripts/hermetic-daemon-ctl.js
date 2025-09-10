#!/usr/bin/env node
/**
 * QBTC Hermetic Core Daemon Control
 * 
 * Script de control para gestionar el daemon del ciclo hermético core
 * Permite iniciar, detener, reiniciar y monitorear el daemon
 * 
 * Uso:
 *   node scripts/hermetic-daemon-ctl.js start
 *   node scripts/hermetic-daemon-ctl.js stop  
 *   node scripts/hermetic-daemon-ctl.js restart
 *   node scripts/hermetic-daemon-ctl.js status
 *   node scripts/hermetic-daemon-ctl.js logs
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn, exec } = require('child_process');
const os = require('os');

class HermeticDaemonController {
    constructor() {
        this.pidFile = path.join(os.tmpdir(), 'qbtc-hermetic-core.pid');
        this.daemonScript = path.join(__dirname, '../src/launcher/hermetic-core-daemon.js');
        this.logDir = path.join(__dirname, '../logs');
        this.metricsFile = path.join(this.logDir, 'hermetic-core-metrics.json');
    }

    /**
     * Comando principal
     */
    async run() {
        const command = process.argv[2];
        
        switch (command) {
            case 'start':
                await this.startDaemon();
                break;
            case 'stop':
                await this.stopDaemon();
                break;
            case 'restart':
                await this.restartDaemon();
                break;
            case 'status':
                await this.showStatus();
                break;
            case 'logs':
                await this.showLogs();
                break;
            case 'metrics':
                await this.showMetrics();
                break;
            default:
                this.showHelp();
        }
    }

    /**
     * Mostrar ayuda
     */
    showHelp() {
        console.log(`
🔮 QBTC Hermetic Core Daemon Controller

Uso: node ${path.basename(process.argv[1])} <comando>

Comandos:
  start     - Iniciar daemon del ciclo hermético core
  stop      - Detener daemon
  restart   - Reiniciar daemon 
  status    - Mostrar estado del daemon
  logs      - Mostrar logs del daemon
  metrics   - Mostrar métricas del daemon

Ejemplos:
  node ${path.basename(process.argv[1])} start
  node ${path.basename(process.argv[1])} status
  node ${path.basename(process.argv[1])} metrics
`);
    }

    /**
     * Iniciar daemon
     */
    async startDaemon() {
        try {
            console.log('🔮 Iniciando Hermetic Core Daemon...');

            // Verificar si ya está ejecutándose
            const isRunning = await this.checkDaemonStatus();
            if (isRunning.running) {
                console.log(`⚠️  Daemon ya está ejecutándose (PID: ${isRunning.pid})`);
                return;
            }

            // Asegurar que directorio de logs existe
            await fs.mkdir(this.logDir, { recursive: true });

            // Iniciar daemon en segundo plano
            const daemon = spawn('node', [this.daemonScript], {
                detached: true,
                stdio: ['ignore', 'ignore', 'ignore'],
                cwd: path.dirname(this.daemonScript)
            });

            daemon.unref();

            // Esperar un momento para verificar inicio
            await this.sleep(2000);

            const status = await this.checkDaemonStatus();
            if (status.running) {
                console.log(`✅ Daemon iniciado exitosamente (PID: ${status.pid})`);
                console.log(`📁 PID File: ${this.pidFile}`);
                console.log(`📈 Metrics: ${this.metricsFile}`);
            } else {
                console.log('❌ Error iniciando daemon');
            }

        } catch (error) {
            console.error(`❌ Error iniciando daemon: ${error.message}`);
            process.exit(1);
        }
    }

    /**
     * Detener daemon
     */
    async stopDaemon() {
        try {
            console.log('🛑 Deteniendo Hermetic Core Daemon...');

            const status = await this.checkDaemonStatus();
            if (!status.running) {
                console.log('⚠️  Daemon no está ejecutándose');
                return;
            }

            // Enviar señal SIGTERM
            try {
                process.kill(status.pid, 'SIGTERM');
                console.log(`📡 Señal SIGTERM enviada a PID ${status.pid}`);

                // Esperar cierre graceful
                let attempts = 0;
                const maxAttempts = 10;
                
                while (attempts < maxAttempts) {
                    await this.sleep(1000);
                    const newStatus = await this.checkDaemonStatus();
                    if (!newStatus.running) {
                        console.log('✅ Daemon detenido exitosamente');
                        return;
                    }
                    attempts++;
                }

                // Si no se detuvo gracefully, forzar
                console.log('⚠️  Forzando detención del daemon...');
                process.kill(status.pid, 'SIGKILL');
                await this.sleep(1000);

                const finalStatus = await this.checkDaemonStatus();
                if (!finalStatus.running) {
                    console.log('✅ Daemon detenido forzadamente');
                } else {
                    console.log('❌ No se pudo detener el daemon');
                }

            } catch (killError) {
                console.log(`⚠️  Error enviando señal: ${killError.message}`);
                // Intentar limpiar PID file
                try {
                    await fs.unlink(this.pidFile);
                    console.log('🧹 PID file huérfano eliminado');
                } catch {
                    // Ignorar error
                }
            }

        } catch (error) {
            console.error(`❌ Error deteniendo daemon: ${error.message}`);
            process.exit(1);
        }
    }

    /**
     * Reiniciar daemon
     */
    async restartDaemon() {
        console.log('🔄 Reiniciando Hermetic Core Daemon...');
        await this.stopDaemon();
        await this.sleep(2000);
        await this.startDaemon();
    }

    /**
     * Mostrar estado
     */
    async showStatus() {
        try {
            const status = await this.checkDaemonStatus();
            
            console.log('\n🔮 Estado del Hermetic Core Daemon');
            console.log('═'.repeat(50));
            
            if (status.running) {
                console.log(`Estado:      ✅ EJECUTÁNDOSE`);
                console.log(`PID:         ${status.pid}`);
                console.log(`Uptime:      ${status.uptime || 'Desconocido'}`);
                console.log(`PID File:    ${this.pidFile}`);
                
                // Intentar obtener métricas
                try {
                    const metrics = await this.getLatestMetrics();
                    if (metrics) {
                        console.log(`\n📊 Métricas del Daemon:`);
                        console.log(`Ciclos:      ${metrics.daemon?.totalCycles || 'N/A'}`);
                        console.log(`Errores:     ${metrics.daemon?.errorCount || '0'}`);
                        console.log(`Memoria:     ${metrics.daemon?.memoryUsage?.rss || 'N/A'}`);
                        console.log(`CPU Load:    ${metrics.system?.loadAvg?.[0]?.toFixed(2) || 'N/A'}`);
                        
                        if (metrics.hermeticCore) {
                            console.log(`\n🔮 Estado del Core Hermético:`);
                            console.log(`Activo:      ${metrics.hermeticCore.isActive ? '✅' : '❌'}`);
                            console.log(`Ciclos:      ${metrics.hermeticCore.cycleCount || '0'}`);
                            console.log(`Coherencia:  ${metrics.hermeticCore.quantumCoherence?.toFixed(4) || 'N/A'}`);
                            console.log(`Resonancia:  ${metrics.hermeticCore.temporalResonance?.toFixed(4) || 'N/A'}`);
                        }
                    }
                } catch (metricsError) {
                    console.log(`⚠️  Error obteniendo métricas: ${metricsError.message}`);
                }
                
            } else {
                console.log(`Estado:      ❌ DETENIDO`);
                
                // Verificar archivos huérfanos
                if (status.pidFileExists) {
                    console.log(`⚠️  Archivo PID huérfano detectado: ${this.pidFile}`);
                }
            }
            
            console.log('═'.repeat(50));

        } catch (error) {
            console.error(`❌ Error verificando estado: ${error.message}`);
            process.exit(1);
        }
    }

    /**
     * Mostrar logs
     */
    async showLogs() {
        console.log('📋 Mostrando logs del Hermetic Core Daemon...\n');
        
        // Intentar mostrar logs más recientes del sistema
        try {
            // En sistemas Unix, podrías usar journalctl o logs del sistema
            // Por ahora, mostrar métricas como "logs"
            const metrics = await this.getRecentMetrics(10);
            
            if (metrics && metrics.length > 0) {
                console.log('📊 Métricas Recientes:');
                console.log('═'.repeat(80));
                
                metrics.forEach((metric, index) => {
                    const timestamp = new Date(metric.timestamp).toLocaleString();
                    console.log(`[${timestamp}] Ciclo #${metric.cycleNumber || index + 1}`);
                    console.log(`  Tiempo:     ${metric.cycleTime || 'N/A'}ms`);
                    console.log(`  Memoria:    ${Math.round(metric.memoryUsage?.rss / 1024 / 1024) || 'N/A'}MB`);
                    console.log(`  Coherencia: ${metric.quantumCoherence?.toFixed(4) || 'N/A'}`);
                    console.log(`  Resonancia: ${metric.temporalResonance?.toFixed(4) || 'N/A'}`);
                    console.log('');
                });
            } else {
                console.log('⚠️  No hay métricas disponibles');
            }
            
        } catch (error) {
            console.log(`⚠️  Error accediendo a logs: ${error.message}`);
        }
    }

    /**
     * Mostrar métricas
     */
    async showMetrics() {
        try {
            console.log('📈 Métricas del Hermetic Core Daemon\n');

            const metrics = await this.getLatestMetrics();
            if (!metrics) {
                console.log('⚠️  No hay métricas disponibles');
                return;
            }

            // Métricas del daemon
            if (metrics.daemon) {
                console.log('🔧 Daemon:');
                console.log(`  PID:           ${metrics.daemon.pid}`);
                console.log(`  Uptime:        ${metrics.daemon.uptimeHuman || 'N/A'}`);
                console.log(`  Total Ciclos:  ${metrics.daemon.totalCycles}`);
                console.log(`  Errores:       ${metrics.daemon.errorCount}`);
                console.log(`  Memoria RSS:   ${metrics.daemon.memoryUsage?.rss || 'N/A'}`);
                console.log(`  Heap Usado:    ${metrics.daemon.memoryUsage?.heapUsed || 'N/A'}`);
                console.log('');
            }

            // Métricas de rendimiento
            if (metrics.performance) {
                console.log('⚡ Rendimiento:');
                console.log(`  Ciclos:           ${metrics.performance.cycleCount}`);
                console.log(`  Tiempo Promedio:  ${Math.round(metrics.performance.avgCycleTime)}ms`);
                console.log(`  Tiempo Máximo:    ${metrics.performance.maxCycleTime}ms`);
                console.log(`  Tiempo Mínimo:    ${metrics.performance.minCycleTime}ms`);
                console.log(`  Tasa de Error:    ${(metrics.performance.errorRate * 100).toFixed(2)}%`);
                console.log('');
            }

            // Métricas del sistema
            if (metrics.system) {
                console.log('💻 Sistema:');
                console.log(`  Load Average:   ${metrics.system.loadAvg?.join(', ') || 'N/A'}`);
                console.log(`  Memoria Libre:  ${metrics.system.freeMemory || 'N/A'}`);
                console.log(`  Memoria Total:  ${metrics.system.totalMemory || 'N/A'}`);
                console.log('');
            }

            // Métricas del core hermético
            if (metrics.hermeticCore) {
                console.log('🔮 Core Hermético:');
                console.log(`  Estado:               ${metrics.hermeticCore.isActive ? '✅ Activo' : '❌ Inactivo'}`);
                console.log(`  Ciclos Completados:   ${metrics.hermeticCore.cycleCount || 0}`);
                console.log(`  Coherencia Cuántica:  ${metrics.hermeticCore.quantumCoherence?.toFixed(4) || 'N/A'}`);
                console.log(`  Resonancia Temporal:  ${metrics.hermeticCore.temporalResonance?.toFixed(4) || 'N/A'}`);
                
                if (metrics.hermeticCore.advancedMetrics) {
                    const adv = metrics.hermeticCore.advancedMetrics;
                    console.log(`  Alineación Cósmica:   ${adv.cosmicAlignment?.toFixed(4) || 'N/A'}`);
                    console.log(`  Estabilidad Dimensional: ${adv.dimensionalStability?.toFixed(4) || 'N/A'}`);
                    console.log(`  Armónicos Temporales: ${adv.temporalHarmonics?.length || 0}`);
                    console.log(`  Fluctuaciones Cuánticas: ${adv.quantumFluctuations?.length || 0}`);
                }
            }

            console.log('═'.repeat(60));
            console.log(`Última actualización: ${new Date(metrics.timestamp).toLocaleString()}`);

        } catch (error) {
            console.error(`❌ Error obteniendo métricas: ${error.message}`);
        }
    }

    /**
     * Verificar estado del daemon
     */
    async checkDaemonStatus() {
        try {
            // Verificar si archivo PID existe
            const pidFileExists = await fs.access(this.pidFile).then(() => true).catch(() => false);
            
            if (!pidFileExists) {
                return { running: false, pidFileExists: false };
            }

            // Leer PID
            const pidContent = await fs.readFile(this.pidFile, 'utf8');
            const pid = parseInt(pidContent.trim());

            // Verificar si proceso existe
            try {
                process.kill(pid, 0); // Verificar sin matar
                
                // Obtener info del proceso
                const uptime = await this.getProcessUptime(pid);
                
                return { 
                    running: true, 
                    pid, 
                    pidFileExists: true,
                    uptime 
                };
            } catch (killError) {
                // Proceso no existe
                return { 
                    running: false, 
                    pid, 
                    pidFileExists: true 
                };
            }

        } catch (error) {
            return { running: false, error: error.message };
        }
    }

    /**
     * Obtener uptime del proceso
     */
    async getProcessUptime(pid) {
        return new Promise((resolve) => {
            const cmd = process.platform === 'win32' 
                ? `wmic process where processid=${pid} get creationdate /format:csv`
                : `ps -o etime= -p ${pid}`;

            exec(cmd, (error, stdout) => {
                if (error) {
                    resolve('Desconocido');
                    return;
                }

                if (process.platform === 'win32') {
                    // Procesar salida de Windows
                    resolve('Uptime (Windows)');
                } else {
                    // Procesar salida de Unix
                    resolve(stdout.trim() || 'Desconocido');
                }
            });
        });
    }

    /**
     * Obtener métricas más recientes
     */
    async getLatestMetrics() {
        try {
            const metricsData = await fs.readFile(this.metricsFile, 'utf8');
            const metrics = JSON.parse(metricsData);
            
            if (Array.isArray(metrics) && metrics.length > 0) {
                return metrics[metrics.length - 1];
            }
            
            return metrics;
        } catch (error) {
            return null;
        }
    }

    /**
     * Obtener métricas recientes
     */
    async getRecentMetrics(count = 10) {
        try {
            const metricsData = await fs.readFile(this.metricsFile, 'utf8');
            const metrics = JSON.parse(metricsData);
            
            if (Array.isArray(metrics)) {
                return metrics.slice(-count);
            }
            
            return [metrics];
        } catch (error) {
            return null;
        }
    }

    /**
     * Utilidad sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Ejecutar si es script principal
if (require.main === module) {
    const controller = new HermeticDaemonController();
    controller.run().catch(error => {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    });
}

module.exports = { HermeticDaemonController };

/**
 * SECTOR ANALYSIS ORCHESTRATOR
 * =============================
 * Orquestador que inicia el worker y la API
 * Arquitectura: Coordinación de procesos separados
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class SectorAnalysisOrchestrator {
    constructor() {
        this.workerProcess = null;
        this.apiProcess = null;
        this.cacheDir = path.join(__dirname, 'cache');
        this.isShuttingDown = false;
    }

    async initialize() {
        console.log('[ORCHESTRATOR] Inicializando Sector Analysis Orchestrator...');

        // Crear directorio de cache
        await fs.mkdir(this.cacheDir, { recursive: true });

        // Manejar señales de apagado
        process.on('SIGINT', () => this.shutdown());
        process.on('SIGTERM', () => this.shutdown());

        console.log('[ORCHESTRATOR] Inicialización completada');
    }

    async startWorker() {
        console.log('[ORCHESTRATOR] Iniciando Sector Analysis Worker...');

        return new Promise((resolve, reject) => {
            this.workerProcess = spawn('node', ['sector-analysis-worker.js'], {
                stdio: ['pipe', 'pipe', 'pipe'],
                cwd: __dirname
            });

            let workerReady = false;

            // Manejar output del worker
            this.workerProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log('[WORKER]', output.trim());

                if (output.includes('Worker inicializado y listo') && !workerReady) {
                    workerReady = true;
                    console.log('[ORCHESTRATOR] Worker listo y operativo');
                    resolve();
                }
            });

            this.workerProcess.stderr.on('data', (data) => {
                console.error('[WORKER ERROR]', data.toString().trim());
            });

            this.workerProcess.on('close', (code) => {
                console.log(`[ORCHESTRATOR] Worker terminó con código ${code}`);
                if (!this.isShuttingDown && !workerReady) {
                    reject(new Error(`Worker failed with code ${code}`));
                }
            });

            // Timeout de 30 segundos
            setTimeout(() => {
                if (!workerReady) {
                    console.log('[ORCHESTRATOR] Timeout esperando worker, continuando...');
                    resolve();
                }
            }, 30000);
        });
    }

    async startAPI() {
        console.log('[ORCHESTRATOR] Iniciando Sector Analysis API...');

        return new Promise((resolve, reject) => {
            this.apiProcess = spawn('node', ['sector-analysis-api.js'], {
                stdio: ['pipe', 'pipe', 'pipe'],
                cwd: __dirname
            });

            let apiReady = false;

            // Manejar output de la API
            this.apiProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log('[API]', output.trim());

                if (output.includes('running on port') && !apiReady) {
                    apiReady = true;
                    console.log('[ORCHESTRATOR] API lista y operativa');
                    resolve();
                }
            });

            this.apiProcess.stderr.on('data', (data) => {
                console.error('[API ERROR]', data.toString().trim());
            });

            this.apiProcess.on('close', (code) => {
                console.log(`[ORCHESTRATOR] API terminó con código ${code}`);
                if (!this.isShuttingDown && !apiReady) {
                    reject(new Error(`API failed with code ${code}`));
                }
            });

            // Timeout de 10 segundos
            setTimeout(() => {
                if (!apiReady) {
                    console.log('[ORCHESTRATOR] Timeout esperando API, continuando...');
                    resolve();
                }
            }, 10000);
        });
    }

    async startServices() {
        try {
            console.log('[ORCHESTRATOR] Iniciando servicios...');

            // Iniciar worker primero
            await this.startWorker();

            // Pequeña pausa
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Iniciar API
            await this.startAPI();

            console.log('[ORCHESTRATOR] Todos los servicios iniciados correctamente');
            console.log('[ORCHESTRATOR] Arquitectura operativa:');
            console.log('  - Worker: Procesamiento de análisis sectorial');
            console.log('  - API: Servicio web ligero');
            console.log('  - Cache: Comunicación entre procesos');

        } catch (error) {
            console.error('[ORCHESTRATOR] Error iniciando servicios:', error);
            await this.shutdown();
            throw error;
        }
    }

    async shutdown() {
        if (this.isShuttingDown) return;

        console.log('[ORCHESTRATOR] Apagando servicios...');
        this.isShuttingDown = true;

        // Terminar procesos
        if (this.workerProcess) {
            console.log('[ORCHESTRATOR] Terminando worker...');
            this.workerProcess.kill();
        }

        if (this.apiProcess) {
            console.log('[ORCHESTRATOR] Terminando API...');
            this.apiProcess.kill();
        }

        // Pequeña pausa para cleanup
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('[ORCHESTRATOR] Servicios terminados');
        process.exit(0);
    }

    async monitorServices() {
        console.log('[ORCHESTRATOR] Iniciando monitoreo de servicios...');

        setInterval(async () => {
            try {
                // Verificar que los procesos estén vivos
                if (this.workerProcess && this.workerProcess.killed) {
                    console.log('[ORCHESTRATOR] Worker murió, reiniciando...');
                    await this.startWorker();
                }

                if (this.apiProcess && this.apiProcess.killed) {
                    console.log('[ORCHESTRATOR] API murió, reiniciando...');
                    await this.startAPI();
                }

            } catch (error) {
                console.error('[ORCHESTRATOR] Error en monitoreo:', error);
            }
        }, 30000); // Verificar cada 30 segundos
    }
}

// Función principal
async function main() {
    const orchestrator = new SectorAnalysisOrchestrator();

    try {
        await orchestrator.initialize();
        await orchestrator.startServices();
        await orchestrator.monitorServices();

        console.log('[ORCHESTRATOR] Sistema completamente operativo');
        console.log('[ORCHESTRATOR] Presiona Ctrl+C para salir');

    } catch (error) {
        console.error('[ORCHESTRATOR] Error en inicialización:', error);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { SectorAnalysisOrchestrator };

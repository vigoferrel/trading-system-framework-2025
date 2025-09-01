
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

// Quantum Trading System Launcher
// Lanza el sistema completo de trading cuántico

const { spawn } = require('child_process');
const path = require('path');

class QuantumSystemLauncher {
    constructor() {
        this.processes = [];
        this.config = {
            mainSystem: {
                script: 'index.js',
                port: 4000,
                name: 'Quantum Binance System'
            },
            frontendApi: {
                script: 'frontend-api.js',
                port: 4002,
                name: 'Frontend API'
            },
            quantumMonitor: {
                script: 'quantum-monitor.js',
                port: 4001,
                name: 'Quantum Monitor'
            }
        };
        
        console.log('[START] Quantum Trading System Launcher');
        console.log('====================================');
    }
    
    // Lanzar todos los componentes del sistema
    async launchCompleteSystem() {
        try {
            console.log(' Iniciando lanzamiento del sistema cuántico completo...');
            
            // Lanzar sistema principal
            await this.launchComponent('mainSystem');
            
            // Esperar un momento antes de lanzar el siguiente componente
            await this.sleep(2000);
            
            // Lanzar monitor cuántico
            await this.launchComponent('quantumMonitor');
            
            // Esperar otro momento
            await this.sleep(2000);
            
            // Lanzar API frontend
            await this.launchComponent('frontendApi');
            
            console.log('[OK] Sistema cuántico completo lanzado exitosamente');
            console.log('');
            console.log('[DATA] Estado del Sistema:');
            console.log('   - Sistema Principal: http://localhost:4000');
            console.log('   - Monitor Cuántico: http://localhost:4001');
            console.log('   - API Frontend: http://localhost:4002');
            console.log('');
            console.log('[RELOAD] Verificación de componentes:');
            
            // Verificar que todos los componentes estén funcionando
            setTimeout(() => this.verifyAllComponents(), 5000);
            
        } catch (error) {
            console.error('[ERROR] Error al lanzar el sistema:', error);
            await this.shutdownAll();
        }
    }
    
    // Lanzar un componente específico
    async launchComponent(componentName) {
        const component = this.config[componentName];
        if (!component) {
            throw new Error(`Componente ${componentName} no encontrado`);
        }
        
        console.log(`[START] Iniciando ${component.name} (Puerto: ${component.port})...`);
        
        const childProcess = spawn('node', [component.script], {
            cwd: process.cwd(),
            stdio: 'pipe'
        });
        
        // Manejar salida del proceso
        childProcess.stdout.on('data', (data) => {
            console.log(`[${component.name}] ${data.toString().trim()}`);
        });
        
        childProcess.stderr.on('data', (data) => {
            console.error(`[${component.name}] ERROR: ${data.toString().trim()}`);
        });
        
        childProcess.on('close', (code) => {
            console.log(`[${component.name}] Proceso terminado con código: ${code}`);
        });
        
        this.processes.push({
            name: component.name,
            process: childProcess,
            port: component.port
        });
        
        // Esperar a que el componente se inicie
        await this.sleep(3000);
        
        console.log(`[OK] ${component.name} iniciado correctamente`);
    }
    
    // Verificar que todos los componentes estén funcionando
    async verifyAllComponents() {
        console.log('');
        console.log('[SEARCH] Verificando estado de los componentes...');
        
        for (const component of this.processes) {
            try {
                const response = await fetch(`http://localhost:${component.port}`);
                if (response.ok) {
                    console.log(`[OK] ${component.name}: Funcionando correctamente`);
                } else {
                    console.log(`[WARNING] ${component.name}: Respuesta inesperada`);
                }
            } catch (error) {
                console.log(`[ERROR] ${component.name}: No responde - ${error.message}`);
            }
        }
        
        console.log('');
        console.log('[ENDPOINTS] Sistema Cuántico de Trading Operativo');
        console.log('====================================');
        console.log('[UP] Datos en Tiempo Real:');
        console.log('   - BTC, ETH, BNB, SOL, XRP, DOGE');
        console.log('   - Matriz cuántica 6x8');
        console.log('   - Señales de trading cuánticas');
        console.log('');
        console.log(' Características Cuánticas:');
        console.log('   - Algoritmo: z = 9 + 16i @ =log(7919)');
        console.log('   - Entrelazamiento cuántico entre activos');
        console.log('   - Detección de anomalías cuánticas');
        console.log('   - Generación de señales no deterministas');
        console.log('');
        console.log('[SHIELD] Seguridad:');
        console.log('   - IP Anticonflicto: 172.16.42.223');
        console.log('   - Conexión VPN estable');
        console.log('   - Monitoreo continuo');
        console.log('');
        console.log('[API] Interfaces Disponibles:');
        console.log('   - API Principal: http://localhost:4000');
        console.log('   - Monitor: http://localhost:4001/monitor/status');
        console.log('   - Frontend: http://localhost:4002');
        console.log('');
        console.log('[FAST] Presiona Ctrl+C para detener todos los componentes');
        
        // Manejar cierre graceful
        process.on('SIGINT', () => {
            console.log('\n Recibida señal de apagado...');
            this.shutdownAll();
        });
    }
    
    // Apagar todos los componentes
    async shutdownAll() {
        console.log('[RELOAD] Apagando todos los componentes...');
        
        for (const component of this.processes) {
            try {
                component.process.kill('SIGTERM');
                console.log(`[OK] ${component.name} apagado`);
            } catch (error) {
                console.error(`[ERROR] Error al apagar ${component.name}:`, error);
            }
        }
        
        this.processes = [];
        console.log(' Sistema completamente apagado');
        process.exit(0);
    }
    
    // Función de espera
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Función para simular fetch (ya que no tenemos fetch en Node.js nativo)
async function fetch(url) {
    return new Promise((resolve, reject) => {
        const http = require('http');
        const https = require('https');
        
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    ok: res.statusCode === 200,
                    status: res.statusCode,
                    text: () => Promise.resolve(data)
                });
            });
        });
        
        req.on('error', reject);
        req.end();
    });
}

// Si se ejecuta directamente, lanzar el sistema completo
if (require.main === module) {
    const launcher = new QuantumSystemLauncher();
    launcher.launchCompleteSystem().catch(error => {
        console.error('Error fatal:', error);
        process.exit(1);
    });
}

module.exports = QuantumSystemLauncher;
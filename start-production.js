
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

/**
 * Script de inicio unificado para el sistema Quantum Trading en producción
 * 
 * Este script inicia todos los componentes del sistema en el orden correcto
 * y proporciona reinicio automático en caso de fallos.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuración
const config = {
    environment: process.env.NODE_ENV || 'production',
    ports: {
        core: process.env.CORE_PORT || 4601,
        frontend: process.env.FRONTEND_PORT || 4602,
        monitor: process.env.MONITOR_PORT || 8082
    },
    logging: {
        directory: path.join(__dirname, 'logs')
    }
};

// Asegurar que el directorio de logs existe
if (!fs.existsSync(config.logging.directory)) {
    fs.mkdirSync(config.logging.directory, { recursive: true });
}

// Función para iniciar un componente
function startComponent(scriptPath, name, port, env = {}) {
    console.log(`Iniciando ${name} en puerto ${port}...`);
    
    const logFile = fs.createWriteStream(path.join(config.logging.directory, `${name}.log`), { flags: 'a' });
    const timestamp = new Date().toISOString();
    logFile.write(`\n[${timestamp}] Iniciando ${name}\n`);
    
    const processEnv = { 
        ...process.env, 
        ...env, 
        PORT: port 
    };
    
    const proc = spawn('node', [scriptPath], {
        env: processEnv,
        stdio: ['ignore', 'pipe', 'pipe']
    });
    
    proc.stdout.pipe(logFile);
    proc.stderr.pipe(logFile);
    
    proc.on('error', (error) => {
        const errorTimestamp = new Date().toISOString();
        console.error(`[${errorTimestamp}] Error al iniciar ${name}:`, error);
        logFile.write(`[${errorTimestamp}] Error: ${error.message}\n`);
    });
    
    proc.on('exit', (code) => {
        const exitTimestamp = new Date().toISOString();
        console.log(`[${exitTimestamp}] ${name} se ha detenido con código ${code}`);
        logFile.write(`[${exitTimestamp}] Proceso terminado con código: ${code}\n`);
        
        // Reiniciar automáticamente en producción
        if (config.environment === 'production') {
            console.log(`Reiniciando ${name}...`);
            logFile.write(`[${exitTimestamp}] Reiniciando proceso...\n`);
            setTimeout(() => {
                startComponent(scriptPath, name, port, env);
            }, 5000); // Esperar 5 segundos antes de reiniciar
        }
    });
    
    return proc;
}

// Función para verificar si un puerto está en uso
function isPortInUse(port) {
    return new Promise((resolve) => {
        const net = require('net');
        const server = net.createServer();
        
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(true);
            } else {
                resolve(false);
            }
        });
        
        server.once('listening', () => {
            server.close();
            resolve(false);
        });
        
        server.listen(port);
    });
}

// Función para liberar un puerto
async function freePort(port) {
    if (await isPortInUse(port)) {
        console.log(`Puerto ${port} en uso. Intentando liberar...`);
        
        try {
            // En Windows
            if (process.platform === 'win32') {
                const { execSync } = require('child_process');
                const command = `FOR /F "tokens=5" %P IN ('netstat -ano ^| findstr :${port} ^| findstr LISTENING') DO taskkill /F /PID %P`;
                execSync(command, { stdio: 'ignore' });
            }
            // En Linux/Mac
            else {
                const { execSync } = require('child_process');
                execSync(`lsof -i :${port} -t | xargs kill -9`, { stdio: 'ignore' });
            }
            
            console.log(`Puerto ${port} liberado.`);
        } catch (error) {
            console.error(`Error al liberar puerto ${port}:`, error.message);
        }
    }
}

// Función principal para iniciar el sistema
async function startSystem() {
    console.log('Iniciando sistema Quantum Trading en modo producción...');
    
    // Liberar puertos
    await freePort(config.ports.core);
    await freePort(config.ports.frontend);
    await freePort(config.ports.monitor);
    
    // Iniciar Core API
    const coreProcess = startComponent(
        path.join(__dirname, 'index.js'),
        'core-api',
        config.ports.core,
        { VIGO_FUTURES_ENABLED: 'false', FAST_PERFORMANCE: 'true' }
    );
    
    // Esperar 5 segundos para que el Core API se inicie
    setTimeout(() => {
        // Iniciar Frontend API
        const frontendProcess = startComponent(
            path.join(__dirname, 'frontend-api-extended.js'),
            'frontend-api',
            config.ports.frontend
        );
        
        // Esperar 2 segundos más para que el Frontend API se inicie
        setTimeout(() => {
            // Iniciar Monitor
            const monitorProcess = startComponent(
                path.join(__dirname, 'quantum-real-time-monitor.js'),
                'monitor',
                config.ports.monitor
            );
        }, 2000);
    }, 5000);
}

// Manejar señales de terminación
process.on('SIGTERM', () => {
    console.log('Recibida señal SIGTERM, cerrando procesos...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Recibida señal SIGINT, cerrando procesos...');
    process.exit(0);
});

// Iniciar el sistema
startSystem();

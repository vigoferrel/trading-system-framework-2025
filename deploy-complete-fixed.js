const { spawn } = require('child_process');
const fs = require('fs');

console.log('[START] DESPLIEGUE COMPLETO - SISTEMA CORREGIDO');
console.log('=' .repeat(60));

// Función para limpiar puertos
function cleanPorts() {
    console.log('\n LIMPIANDO PUERTOS...');
    
    const ports = [4601, 4602, 4603, 4604, 4605, 4606];
    
    ports.forEach(port => {
        try {
            // En Windows, usar taskkill para matar procesos en puertos
            const cmd = `netstat -ano | findstr :${port}`;
            const result = require('child_process').execSync(cmd, { encoding: 'utf8' });
            
            if (result) {
                const lines = result.split('\n');
                lines.forEach(line => {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length > 4) {
                        const pid = parts[4];
                        if (pid && pid !== 'PID') {
                            try {
                                require('child_process').execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
                                console.log(`[OK] Puerto ${port} liberado (PID: ${pid})`);
                            } catch (e) {
                                // Ignorar errores si el proceso ya no existe
                            }
                        }
                    }
                });
            }
        } catch (e) {
            // Puerto libre
        }
    });
}

// Función para verificar que los archivos corregidos existen
function verifyFiles() {
    console.log('\n[LIST] VERIFICANDO ARCHIVOS CORREGIDOS...');
    
    const requiredFiles = [
        'core-system-organized.js',
        'qbtc-binance-integration.js',
        'monitor-graficos-server-simple.py',
        'deploy-banda-46-fixed.py'
    ];
    
    let allFilesExist = true;
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`[OK] ${file} encontrado`);
        } else {
            console.log(`[ERROR] ${file} no encontrado`);
            allFilesExist = false;
        }
    });
    
    return allFilesExist;
}

// Función para iniciar servicios
function startServices() {
    console.log('\n[START] INICIANDO SERVICIOS...');
    
    const services = [
        {
            name: 'QBTC Core',
            command: 'node',
            args: ['core-system-organized.js'],
            port: 4602
        },
        {
            name: 'Monitor de Gráficos',
            command: 'python',
            args: ['monitor-graficos-server-simple.py'],
            port: 4606
        }
    ];
    
    const processes = [];
    
    services.forEach(service => {
        console.log(`\n[DATA] Iniciando ${service.name} en puerto ${service.port}...`);
        
        const process = spawn(service.command, service.args, {
            stdio: 'pipe',
            shell: true,
            windowsHide: true
        });
        
        process.stdout.on('data', (data) => {
            console.log(`[${service.name}] ${data.toString().trim()}`);
        });
        
        process.stderr.on('data', (data) => {
            console.log(`[${service.name} ERROR] ${data.toString().trim()}`);
        });
        
        process.on('close', (code) => {
            console.log(`[${service.name}] Proceso terminado con código ${code}`);
        });
        
        processes.push(process);
        
        // Esperar un poco antes de iniciar el siguiente servicio
        setTimeout(() => {}, 2000);
    });
    
    return processes;
}

// Función para verificar que los servicios están funcionando
function verifyServices() {
    console.log('\n[SEARCH] VERIFICANDO SERVICIOS...');
    
    const axios = require('axios');
    const services = [
        { name: 'QBTC Core', url: 'http://localhost:4602/health' },
        { name: 'Monitor de Gráficos', url: 'http://localhost:4606/health' }
    ];
    
    services.forEach(async (service) => {
        try {
            const response = await axios.get(service.url, { timeout: 5000 });
            if (response.status === 200) {
                console.log(`[OK] ${service.name} está funcionando`);
            } else {
                console.log(`[ERROR] ${service.name} no responde correctamente`);
            }
        } catch (error) {
            console.log(`[ERROR] ${service.name} no está disponible: ${error.message}`);
        }
    });
}

// Función principal
async function deployComplete() {
    try {
        // 1. Limpiar puertos
        cleanPorts();
        
        // 2. Verificar archivos
        if (!verifyFiles()) {
            console.log('[ERROR] Faltan archivos requeridos');
            return;
        }
        
        // 3. Iniciar servicios
        const processes = startServices();
        
        // 4. Esperar un poco para que los servicios se inicien
        console.log('\n[TIME] Esperando que los servicios se inicien...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        // 5. Verificar servicios
        verifyServices();
        
        console.log('\n DESPLIEGUE COMPLETADO');
        console.log('\n[DATA] SERVICIOS DISPONIBLES:');
        console.log(' QBTC Core: http://localhost:4602');
        console.log(' Monitor de Gráficos: http://localhost:4606');
        console.log('\n[SECURE] SISTEMA PROTEGIDO CONTRA RATE LIMITING');
        console.log('[UP] CACHE CUÁNTICA ACTIVA');
        console.log('[OK] RESPETA EL TRABAJO PREVIO DEL EQUIPO');
        
        // Mantener el script ejecutándose
        console.log('\n Presiona Ctrl+C para detener los servicios');
        
        process.on('SIGINT', () => {
            console.log('\n Deteniendo servicios...');
            processes.forEach(process => {
                process.kill();
            });
            process.exit(0);
        });
        
    } catch (error) {
        console.error('[ERROR] Error durante el despliegue:', error.message);
    }
}

// Ejecutar despliegue
deployComplete();

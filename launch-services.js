/**
 * 🚀 SCRIPT DE LANZAMIENTO CONTROLADO DE SERVICIOS
 * ================================================
 * 
 * Lanza ambos servicios en segundo plano con logging y control de procesos
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

console.log('🚀 [LAUNCHER] Iniciando lanzamiento controlado de servicios...');

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, 'service-logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
    console.log('📁 [LAUNCHER] Directorio service-logs creado');
}

const processes = [];

/**
 * Función para lanzar un servicio en segundo plano con logging
 */
function launchService(scriptPath, serviceName, port) {
    return new Promise((resolve, reject) => {
        console.log(`🔄 [LAUNCHER] Iniciando ${serviceName}...`);
        
        const logFile = path.join(logsDir, `${serviceName.toLowerCase().replace(/\s+/g, '-')}.log`);
        const logStream = fs.createWriteStream(logFile, { flags: 'a' });
        
        const child = spawn('node', [scriptPath], {
            detached: false,
            stdio: ['ignore', 'pipe', 'pipe']
        });
        
        // Capturar salida estándar
        child.stdout.on('data', (data) => {
            const message = data.toString();
            console.log(`📝 [${serviceName}] ${message.trim()}`);
            logStream.write(`[${new Date().toISOString()}] STDOUT: ${message}`);
        });
        
        // Capturar errores
        child.stderr.on('data', (data) => {
            const message = data.toString();
            console.error(`❌ [${serviceName}] ERROR: ${message.trim()}`);
            logStream.write(`[${new Date().toISOString()}] STDERR: ${message}`);
        });
        
        child.on('close', (code) => {
            console.log(`🔚 [${serviceName}] Proceso terminado con código ${code}`);
            logStream.end();
        });
        
        child.on('error', (error) => {
            console.error(`💥 [${serviceName}] Error al iniciar: ${error.message}`);
            logStream.end();
            reject(error);
        });
        
        processes.push({ name: serviceName, process: child, port });
        
        // Esperar un momento y verificar que el servicio esté respondiendo
        setTimeout(async () => {
            try {
                const response = await axios.get(`http://localhost:${port}/health`, { timeout: 5000 });
                if (response.status === 200) {
                    console.log(`✅ [${serviceName}] Servicio iniciado correctamente en puerto ${port}`);
                    resolve(child);
                } else {
                    reject(new Error(`Servicio no responde correctamente`));
                }
            } catch (error) {
                reject(new Error(`No se puede conectar al servicio: ${error.message}`));
            }
        }, 3000);
    });
}

/**
 * Función para verificar estado de servicios
 */
async function checkServices() {
    console.log('\n🔍 [LAUNCHER] Verificando estado de servicios...');
    
    for (const service of processes) {
        try {
            const response = await axios.get(`http://localhost:${service.port}/health`, { timeout: 3000 });
            console.log(`✅ [${service.name}] Activo - Status: ${response.data.status}`);
        } catch (error) {
            console.error(`❌ [${service.name}] No responde: ${error.message}`);
        }
    }
}

/**
 * Función para probar endpoints del Enhanced Recommendations Service
 */
async function testEnhancedService() {
    console.log('\n🧪 [TESTING] Probando Enhanced Recommendations Service...');
    
    const endpoints = [
        { path: '/health', name: 'Health Check' },
        { path: '/api/enhanced-recommendations', name: 'Recomendaciones IA' },
        { path: '/api/pattern-analysis', name: 'Análisis de Patrones' },
        { path: '/api/performance-metrics', name: 'Métricas de Performance' },
        { path: '/api/alerts', name: 'Alertas del Servicio' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            const startTime = Date.now();
            const response = await axios.get(`http://localhost:4608${endpoint.path}`, { timeout: 10000 });
            const responseTime = Date.now() - startTime;
            
            console.log(`✅ [TEST] ${endpoint.name}: ${response.status} (${responseTime}ms)`);
            if (endpoint.path === '/api/enhanced-recommendations' && response.data.recommendations) {
                console.log(`   📊 Recomendaciones generadas: ${response.data.recommendations.length}`);
            }
            if (endpoint.path === '/api/pattern-analysis' && response.data.pattern_analysis) {
                console.log(`   🔍 Patrones detectados: ${response.data.pattern_analysis.total_patterns}`);
            }
        } catch (error) {
            console.error(`❌ [TEST] ${endpoint.name}: ${error.message}`);
        }
    }
}

/**
 * Función para probar integración del Dashboard
 */
async function testDashboardIntegration() {
    console.log('\n🧪 [TESTING] Probando integración del Dashboard...');
    
    try {
        const response = await axios.get('http://localhost:5000/api/status', { timeout: 10000 });
        console.log(`✅ [TEST] Dashboard API Status: ${response.status}`);
        
        if (response.data.systems && response.data.systems.ENHANCED_RECOMMENDATIONS) {
            const enhancedSystem = response.data.systems.ENHANCED_RECOMMENDATIONS;
            console.log(`   📊 Enhanced Service Status: ${enhancedSystem.status}`);
            console.log(`   🎯 Data Quality: ${Math.round(enhancedSystem.dataQuality * 100)}%`);
            console.log(`   ⏱️ Response Time: ${enhancedSystem.responseTime}ms`);
        }
        
        if (response.data.analysis && response.data.analysis.enhancedAIMetrics) {
            const aiMetrics = response.data.analysis.enhancedAIMetrics;
            console.log(`   🤖 IA Recommendations: ${aiMetrics.aiRecommendations}`);
            console.log(`   🧠 Patterns Detected: ${aiMetrics.patternsDetected}`);
            console.log(`   ⚡ Processing Time: ${aiMetrics.processingTime}ms`);
        }
    } catch (error) {
        console.error(`❌ [TEST] Dashboard Integration: ${error.message}`);
    }
}

/**
 * Función de limpieza
 */
function cleanup() {
    console.log('\n🧹 [LAUNCHER] Cerrando servicios...');
    
    processes.forEach(service => {
        if (service.process && !service.process.killed) {
            console.log(`⏹️ [LAUNCHER] Cerrando ${service.name}...`);
            service.process.kill('SIGINT');
        }
    });
    
    setTimeout(() => {
        process.exit(0);
    }, 2000);
}

// Manejar señales de cierre
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

/**
 * FLUJO PRINCIPAL DE EJECUCIÓN
 */
async function main() {
    try {
        console.log('🚀 [LAUNCHER] === INICIANDO ECOSISTEMA COMPLETO ===\n');
        
        // 1. Lanzar Enhanced Recommendations Service
        await launchService(
            path.join(__dirname, 'enhanced-recommendations-service.js'),
            'Enhanced Recommendations Service',
            4608
        );
        
        // Esperar un momento antes de lanzar el dashboard
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 2. Lanzar Intelligent Monitor Dashboard
        await launchService(
            path.join(__dirname, 'intelligent-monitor-dashboard.js'),
            'Intelligent Monitor Dashboard',
            5000
        );
        
        // Esperar un momento antes de las pruebas
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 3. Verificar estado de servicios
        await checkServices();
        
        // 4. Probar Enhanced Recommendations Service
        await testEnhancedService();
        
        // 5. Probar integración del Dashboard
        await testDashboardIntegration();
        
        console.log('\n🎉 [LAUNCHER] ¡Ecosistema lanzado exitosamente!');
        console.log('💡 Servicios disponibles:');
        console.log('   🤖 Enhanced Recommendations Service: http://localhost:4608');
        console.log('   🖥️ Intelligent Monitor Dashboard: http://localhost:5000');
        console.log('\n📊 Los servicios están ejecutándose en segundo plano con logging continuo.');
        console.log('📝 Logs disponibles en: ./service-logs/');
        console.log('\n⏹️ Para detener los servicios, presiona Ctrl+C');
        
        // Mantener el script corriendo y hacer verificaciones periódicas
        setInterval(async () => {
            await checkServices();
        }, 30000); // Cada 30 segundos
        
    } catch (error) {
        console.error('💥 [LAUNCHER] Error crítico:', error.message);
        cleanup();
    }
}

// Iniciar el launcher
main().catch(error => {
    console.error('💥 [LAUNCHER] Error fatal:', error);
    process.exit(1);
});

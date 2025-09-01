
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

#!/usr/bin/env node

/**
 * QUANTUM TRADING SYSTEM - INTEGRATION SCRIPT
 * ===========================================
 * 
 * Integra todos los servicios:
 * - Core Trading Engine (4601)
 * - Frontend API (4602) 
 * - Sentiment Dashboard (4603)
 * - Real-time Monitor (8082)
 * 
 * Proporciona una experiencia unificada con:
 * - Sentiment Radar
 * - Holdings & P&L Monitor
 * - Multi-timeframe Projections
 * - Risk Metrics
 * - Quantum Matrix
 */

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

class QuantumIntegration {
    constructor() {
        this.services = {
            core: { port: 4601, process: null, status: 'stopped' },
            frontend: { port: 4602, process: null, status: 'stopped' },
            sentiment: { port: 4603, process: null, status: 'stopped' },
            monitor: { port: 8082, process: null, status: 'stopped' }
        };
        this.integrationPort = 4600;
        this.server = null;
    }

    async start() {
        console.log(`

                    [START] QUANTUM TRADING SYSTEM INTEGRATION                    

                                                                              
  [ENDPOINTS] Iniciando servicios integrados...                                       
                                                                              

        `);

        // Iniciar servicios en orden
        await this.startService('core', 'index.js');
        await this.wait(2000);
        
        await this.startService('frontend', 'frontend-api-basic.js');
        await this.wait(2000);
        
        await this.startService('sentiment', 'sentiment-dashboard.js');
        await this.wait(2000);
        
        await this.startService('monitor', 'quantum-real-time-monitor.js');
        await this.wait(2000);

        // Iniciar servidor de integración
        this.startIntegrationServer();
        
        // Mostrar estado final
        this.displayIntegrationStatus();
    }

    async startService(name, script) {
        return new Promise((resolve, reject) => {
            console.log(`[START] Starting ${name} service (${script})...`);
            
            const service = this.services[name];
            const scriptPath = path.join(__dirname, script);
            
            service.process = spawn('node', [scriptPath], {
                stdio: 'pipe',
                cwd: __dirname
            });

            service.process.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('running on port') || output.includes('listening')) {
                    service.status = 'running';
                    console.log(`[OK] ${name} service started successfully`);
                    resolve();
                }
            });

            service.process.stderr.on('data', (data) => {
                const error = data.toString();
                if (!error.includes('Warning')) {
                    console.log(`[WARNING] ${name} service warning: ${error.trim()}`);
                }
            });

            service.process.on('error', (error) => {
                console.log(`[ERROR] Failed to start ${name} service: ${error.message}`);
                service.status = 'error';
                reject(error);
            });

            // Timeout después de 10 segundos
            setTimeout(() => {
                if (service.status === 'stopped') {
                    console.log(`[TIME] ${name} service startup timeout, continuing...`);
                    resolve();
                }
            }, 10000);
        });
    }

    startIntegrationServer() {
        this.server = http.createServer((req, res) => {
            this.handleIntegrationRequest(req, res);
        });

        this.server.listen(this.integrationPort, () => {
            console.log(` Integration server running on port ${this.integrationPort}`);
        });
    }

    handleIntegrationRequest(req, res) {
        const url = req.url;
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        switch (url) {
            case '/':
                this.serveIntegrationDashboard(req, res);
                break;
            case '/status':
                this.serveServiceStatus(req, res);
                break;
            case '/health':
                this.serveHealthCheck(req, res);
                break;
            default:
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
        }
    }

    serveIntegrationDashboard(req, res) {
        const html = this.generateIntegrationHTML();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }

    serveServiceStatus(req, res) {
        const status = {
            timestamp: Date.now(),
            services: this.services,
            uptime: process.uptime()
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(status));
    }

    serveHealthCheck(req, res) {
        const health = {
            status: 'healthy',
            timestamp: Date.now(),
            services: Object.keys(this.services).map(name => ({
                name,
                status: this.services[name].status,
                port: this.services[name].port
            }))
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(health));
    }

    generateIntegrationHTML() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[START] Quantum Trading System Integration</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Courier New', monospace;
            background: #0a0a0a;
            color: #00ff00;
            padding: 20px;
            line-height: 1.4;
        }
        
        .integration {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #00ff00;
            padding-bottom: 20px;
        }
        
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .service-card {
            border: 1px solid #00ff00;
            padding: 20px;
            background: #001100;
            text-align: center;
        }
        
        .service-card h3 {
            margin-bottom: 15px;
            color: #ffff00;
        }
        
        .status {
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            font-weight: bold;
        }
        
        .status.running { background: #002200; color: #00ff00; }
        .status.stopped { background: #220000; color: #ff0000; }
        .status.error { background: #220000; color: #ff0000; }
        
        .dashboard-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .dashboard-link {
            display: block;
            padding: 15px;
            border: 1px solid #00ff00;
            background: #002200;
            color: #00ff00;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s;
        }
        
        .dashboard-link:hover {
            background: #00ff00;
            color: #000;
        }
        
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .metric {
            text-align: center;
            padding: 15px;
            border: 1px solid #333;
            background: #001100;
        }
        
        .refresh-btn {
            background: #00ff00;
            color: #000;
            border: none;
            padding: 15px 30px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 16px;
            margin: 20px 0;
        }
        
        .refresh-btn:hover {
            background: #00cc00;
        }
    </style>
</head>
<body>
    <div class="integration">
        <div class="header">
            <h1>[START] QUANTUM TRADING SYSTEM INTEGRATION</h1>
            <p>Unified Dashboard & Service Management</p>
            <button class="refresh-btn" onclick="refreshStatus()">[RELOAD] REFRESH STATUS</button>
        </div>
        
        <div class="services-grid" id="servicesGrid">
            <div class="service-card">
                <h3>[ENDPOINTS] Core Trading Engine</h3>
                <div class="status running" id="coreStatus">RUNNING</div>
                <p>Port: 4601</p>
                <p>Quantum trading algorithms & market data processing</p>
            </div>
            
            <div class="service-card">
                <h3>[DATA] Frontend API</h3>
                <div class="status running" id="frontendStatus">RUNNING</div>
                <p>Port: 4602</p>
                <p>Market data API & dashboard services</p>
            </div>
            
            <div class="service-card">
                <h3>[ENDPOINTS] Sentiment Dashboard</h3>
                <div class="status running" id="sentimentStatus">RUNNING</div>
                <p>Port: 4603</p>
                <p>Advanced sentiment analysis & portfolio monitoring</p>
            </div>
            
            <div class="service-card">
                <h3> Real-time Monitor</h3>
                <div class="status running" id="monitorStatus">RUNNING</div>
                <p>Port: 8082</p>
                <p>System monitoring & performance metrics</p>
            </div>
        </div>
        
        <div class="dashboard-links">
            <a href="http://localhost:4601" class="dashboard-link" target="_blank">
                [ENDPOINTS] Core Trading Engine Dashboard
            </a>
            <a href="http://localhost:4602" class="dashboard-link" target="_blank">
                [DATA] Frontend API Dashboard
            </a>
            <a href="http://localhost:4603" class="dashboard-link" target="_blank">
                [ENDPOINTS] Sentiment Dashboard (NEW)
            </a>
            <a href="http://localhost:8082" class="dashboard-link" target="_blank">
                 Real-time Monitor
            </a>
        </div>
        
        <div class="metrics">
            <div class="metric">
                <h4>[RELOAD] System Uptime</h4>
                <div id="uptime">Loading...</div>
            </div>
            <div class="metric">
                <h4>[DATA] Active Services</h4>
                <div id="activeServices">Loading...</div>
            </div>
            <div class="metric">
                <h4>[FAST] System Health</h4>
                <div id="systemHealth">Loading...</div>
            </div>
            <div class="metric">
                <h4>[ENDPOINTS] Integration Status</h4>
                <div id="integrationStatus">Loading...</div>
            </div>
        </div>
    </div>

    <script>
        function refreshStatus() {
            console.log('[RELOAD] Refreshing integration status...');
            
            fetch('/status')
                .then(response => response.json())
                .then(data => {
                    console.log('[DATA] Status data:', data);
                    updateServiceStatus(data.services);
                    updateMetrics(data);
                })
                .catch(error => {
                    console.error('[ERROR] Error fetching status:', error);
                });
        }
        
        function updateServiceStatus(services) {
            Object.keys(services).forEach(serviceName => {
                const statusElement = document.getElementById(serviceName + 'Status');
                if (statusElement) {
                    statusElement.textContent = services[serviceName].status.toUpperCase();
                    statusElement.className = 'status ' + services[serviceName].status;
                }
            });
        }
        
        function updateMetrics(data) {
            document.getElementById('uptime').textContent = Math.floor(data.uptime) + 's';
            document.getElementById('activeServices').textContent = 
                Object.values(data.services).filter(s => s.status === 'running').length + '/4';
            document.getElementById('systemHealth').textContent = 'HEALTHY';
            document.getElementById('integrationStatus').textContent = 'ACTIVE';
        }
        
        // Auto-refresh cada 30 segundos
        setInterval(refreshStatus, 30000);
        
        // Cargar estado inicial
        refreshStatus();
    </script>
</body>
</html>
        `;
    }

    displayIntegrationStatus() {
        console.log(`

                    [OK] QUANTUM TRADING SYSTEM INTEGRATION                    

                                                                              
  [ENDPOINTS] Core Trading Engine:     ${this.services.core.status.toUpperCase()} (4601)    
  [DATA] Frontend API:            ${this.services.frontend.status.toUpperCase()} (4602)    
  [ENDPOINTS] Sentiment Dashboard:     ${this.services.sentiment.status.toUpperCase()} (4603)    
   Real-time Monitor:       ${this.services.monitor.status.toUpperCase()} (8082)    
                                                                              
   Integration Server:      RUNNING (4600)                                
                                                                              
  [DATA] DASHBOARDS DISPONIBLES:                                                
   http://localhost:4600 - Integration Dashboard                           
   http://localhost:4601 - Core Trading Engine                             
   http://localhost:4602 - Frontend API                                    
   http://localhost:4603 - Sentiment Dashboard (NUEVO)                     
   http://localhost:8082 - Real-time Monitor                               
                                                                              
  [ENDPOINTS] SENTIMENT DASHBOARD FEATURES:                                          
   Sentiment Radar (Circular ASCII)                                        
   Holdings & P&L Monitor                                                  
   Multi-Timeframe Projections                                             
   AI Sentiment Engine                                                     
   Risk Metrics (VaR, Sharpe, etc.)                                        
   Quantum Correlation Matrix                                              
                                                                              

        `);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    stop() {
        console.log('\n Stopping all services...');
        
        Object.keys(this.services).forEach(name => {
            const service = this.services[name];
            if (service.process) {
                service.process.kill();
                service.status = 'stopped';
                console.log(` Stopped ${name} service`);
            }
        });

        if (this.server) {
            this.server.close(() => {
                console.log(' Integration server stopped');
            });
        }
    }
}

// Crear y iniciar la integración
const integration = new QuantumIntegration();

// Manejar cierre graceful
process.on('SIGTERM', () => {
    console.log('SIGTERM received, stopping integration...');
    integration.stop();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, stopping integration...');
    integration.stop();
    process.exit(0);
});

// Iniciar la integración
integration.start();

module.exports = QuantumIntegration;

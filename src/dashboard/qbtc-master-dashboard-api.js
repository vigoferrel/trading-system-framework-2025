"use strict";

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const { QBTCOrchestratorMaster } = require("../orchestrator/qbtc-orchestrator-master");

/**
 * Dashboard maestro unificado con WebSocket y API REST
 */
class QBTCMasterDashboardAPI {
  constructor(opts = {}) {
    this.opts = { port: 8888, ...opts };
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    this.orchestrator = new QBTCOrchestratorMaster({ dimensions: opts.dimensions ?? 4 });
    this.clients = new Set();
    this._setupRoutes();
    this._setupWebSocket();
  }

  async initialize() {
    await this.orchestrator.initialize();
    this._setupEventForwarding();
  }

  _setupRoutes() {
    this.app.use(express.json());
    
    // Serve static dashboard HTML
    this.app.get("/", (req, res) => {
      res.send(this._generateDashboardHTML());
    });

    // API Routes
    this.app.get("/api/status", (req, res) => {
      res.json(this.orchestrator.getStatus());
    });

    this.app.get("/api/metrics", (req, res) => {
      res.json(this.orchestrator.getAggregatedMetrics());
    });

    this.app.post("/api/start", async (req, res) => {
      try {
        await this.orchestrator.start();
        res.json({ success: true, message: "Orchestrator started" });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    this.app.post("/api/stop", async (req, res) => {
      try {
        await this.orchestrator.stop();
        res.json({ success: true, message: "Orchestrator stopped" });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.json({ status: "ok", timestamp: Date.now() });
    });
  }

  _setupWebSocket() {
    this.wss.on("connection", (ws) => {
      this.clients.add(ws);
      ws.on("close", () => {
        this.clients.delete(ws);
      });
      
      // Send initial status
      ws.send(JSON.stringify({
        type: "status",
        data: this.orchestrator.getStatus()
      }));
    });
  }

  _setupEventForwarding() {
    // Forward orchestrator events to WebSocket clients
    this.orchestrator.on("metrics", (data) => {
      this._broadcast({ type: "metrics", data });
    });

    this.orchestrator.on("health-check", (data) => {
      this._broadcast({ type: "health-check", data });
    });

    this.orchestrator.on("signals", (data) => {
      this._broadcast({ type: "signals", data });
    });

    this.orchestrator.on("service-error", (data) => {
      this._broadcast({ type: "error", data });
    });
  }

  _broadcast(message) {
    const payload = JSON.stringify(message);
    this.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    });
  }

  async start() {
    await this.orchestrator.start();
    
    return new Promise((resolve) => {
      this.server.listen(this.opts.port, () => {
        console.log(`🌌 QBTC Master Dashboard running on http://localhost:${this.opts.port}`);
        resolve();
      });
    });
  }

  async stop() {
    await this.orchestrator.stop();
    this.server.close();
  }

  _generateDashboardHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QBTC Quantum Dashboard Unificado</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0c0c23 0%, #1a1a3a 100%);
            color: #ffffff;
            min-height: 100vh;
        }
        .header {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .header h1 {
            color: #00f5ff;
            font-size: 2em;
            margin-bottom: 10px;
        }
        .container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }
        .card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(0,245,255,0.3);
            border-radius: 10px;
            padding: 20px;
            backdrop-filter: blur(10px);
        }
        .card h3 {
            color: #00f5ff;
            margin-bottom: 15px;
            border-bottom: 2px solid rgba(0,245,255,0.5);
            padding-bottom: 10px;
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 10px;
        }
        .status-running { background: #00ff41; }
        .status-stopped { background: #ff4444; }
        .metrics-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 10px;
        }
        .metric {
            background: rgba(0,0,0,0.3);
            padding: 10px;
            border-radius: 5px;
            text-align: center;
        }
        .metric-value {
            font-size: 1.5em;
            color: #00f5ff;
            font-weight: bold;
        }
        .metric-label {
            font-size: 0.8em;
            color: #cccccc;
            margin-top: 5px;
        }
        .controls {
            grid-column: span 3;
            text-align: center;
        }
        .btn {
            background: linear-gradient(45deg, #00f5ff, #0066cc);
            color: white;
            border: none;
            padding: 12px 24px;
            margin: 0 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
            transition: transform 0.2s;
        }
        .btn:hover { transform: scale(1.05); }
        .btn-danger { background: linear-gradient(45deg, #ff4444, #cc0000); }
        .signals-list {
            max-height: 200px;
            overflow-y: auto;
        }
        .signal-item {
            background: rgba(0,0,0,0.2);
            margin: 5px 0;
            padding: 8px;
            border-radius: 5px;
            border-left: 3px solid #00f5ff;
        }
        .connection-status {
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.8em;
        }
        .connected { background: #00ff41; color: black; }
        .disconnected { background: #ff4444; color: white; }
    </style>
</head>
<body>
    <div class="connection-status" id="connectionStatus">Connecting...</div>
    
    <div class="header">
        <h1>🌌 QBTC Quantum Trading System</h1>
        <p>Sistema Unificado de Trading Cuántico - Dashboard Maestro</p>
    </div>

    <div class="container">
        <div class="card">
            <h3>📊 System Status</h3>
            <div id="systemStatus">
                <span class="status-indicator status-stopped"></span>Loading...
            </div>
            <div class="metrics-grid">
                <div class="metric">
                    <div class="metric-value" id="uptimeValue">--</div>
                    <div class="metric-label">Uptime (min)</div>
                </div>
                <div class="metric">
                    <div class="metric-value" id="servicesValue">--</div>
                    <div class="metric-label">Services Active</div>
                </div>
            </div>
        </div>

        <div class="card">
            <h3>⚛️ Quantum Metrics</h3>
            <div class="metrics-grid">
                <div class="metric">
                    <div class="metric-value" id="coherenceValue">--</div>
                    <div class="metric-label">Coherence Level</div>
                </div>
                <div class="metric">
                    <div class="metric-value" id="cyclesValue">--</div>
                    <div class="metric-label">Quantum Cycles</div>
                </div>
                <div class="metric">
                    <div class="metric-value" id="latencyValue">--ms</div>
                    <div class="metric-label">Avg Latency</div>
                </div>
                <div class="metric">
                    <div class="metric-value" id="signalsValue">--</div>
                    <div class="metric-label">Signals Generated</div>
                </div>
            </div>
        </div>

        <div class="card">
            <h3>📡 Trading Signals</h3>
            <div class="signals-list" id="signalsList">
                <div style="text-align: center; color: #888; margin: 20px 0;">
                    No recent signals
                </div>
            </div>
        </div>

        <div class="card controls">
            <h3>🎮 System Controls</h3>
            <button class="btn" onclick="startSystem()">▶️ Start System</button>
            <button class="btn btn-danger" onclick="stopSystem()">⏹️ Stop System</button>
            <button class="btn" onclick="refreshData()">🔄 Refresh</button>
        </div>
    </div>

    <script>
        let ws = null;
        let connectionStatus = document.getElementById('connectionStatus');

        function connectWebSocket() {
            const wsUrl = 'ws://localhost:${this.opts.port}';
            ws = new WebSocket(wsUrl);
            
            ws.onopen = () => {
                connectionStatus.textContent = 'Connected';
                connectionStatus.className = 'connection-status connected';
            };
            
            ws.onclose = () => {
                connectionStatus.textContent = 'Disconnected';
                connectionStatus.className = 'connection-status disconnected';
                setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
            };
            
            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                handleWebSocketMessage(message);
            };
            
            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        }

        function handleWebSocketMessage(message) {
            switch (message.type) {
                case 'status':
                    updateSystemStatus(message.data);
                    break;
                case 'metrics':
                    updateMetrics(message.data);
                    break;
                case 'signals':
                    updateSignals(message.data);
                    break;
                case 'health-check':
                    updateHealthCheck(message.data);
                    break;
            }
        }

        function updateSystemStatus(data) {
            const statusElement = document.getElementById('systemStatus');
            const indicator = data.running ? 'status-running' : 'status-stopped';
            const text = data.running ? 'Running' : 'Stopped';
            statusElement.innerHTML = \`<span class="status-indicator \${indicator}"></span>\${text}\`;
            
            document.getElementById('servicesValue').textContent = data.services ? data.services.length : '--';
        }

        function updateMetrics(data) {
            if (data.scope === 'core') {
                document.getElementById('cyclesValue').textContent = data.quantumCycles || '--';
                document.getElementById('latencyValue').textContent = data.avgLatencyMs ? data.avgLatencyMs + 'ms' : '--ms';
                document.getElementById('signalsValue').textContent = data.signalsEmitted || '--';
                
                const uptimeMin = data.startedAt ? Math.floor((Date.now() - data.startedAt) / 60000) : 0;
                document.getElementById('uptimeValue').textContent = uptimeMin;
            }
        }

        function updateSignals(signals) {
            const signalsList = document.getElementById('signalsList');
            if (!signals || signals.length === 0) return;
            
            signalsList.innerHTML = signals.map(signal => \`
                <div class="signal-item">
                    <strong>\${signal.symbol}</strong> - \${signal.action}<br>
                    <small>Confidence: \${(signal.confidence * 100).toFixed(1)}%</small>
                </div>
            \`).join('');
        }

        async function startSystem() {
            try {
                const response = await fetch('/api/start', { method: 'POST' });
                const result = await response.json();
                if (result.success) {
                    console.log('System started successfully');
                } else {
                    alert('Failed to start system: ' + result.error);
                }
            } catch (error) {
                alert('Error starting system: ' + error.message);
            }
        }

        async function stopSystem() {
            try {
                const response = await fetch('/api/stop', { method: 'POST' });
                const result = await response.json();
                if (result.success) {
                    console.log('System stopped successfully');
                } else {
                    alert('Failed to stop system: ' + result.error);
                }
            } catch (error) {
                alert('Error stopping system: ' + error.message);
            }
        }

        async function refreshData() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                updateSystemStatus(data);
                
                const metricsResponse = await fetch('/api/metrics');
                const metricsData = await metricsResponse.json();
                // Process metrics data as needed
            } catch (error) {
                console.error('Error refreshing data:', error);
            }
        }

        // Initialize connection
        connectWebSocket();
        
        // Periodic refresh fallback
        setInterval(refreshData, 10000);
    </script>
</body>
</html>`;
  }
}

module.exports = { QBTCMasterDashboardAPI };

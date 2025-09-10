#!/usr/bin/env node
/**
 * 📊 REAL-TIME VOLATILITY MONETIZATION DASHBOARD
 * ==============================================
 * 
 * Dashboard web en tiempo real para monitorear:
 * - Posiciones activas y P&L
 * - Métricas de performance
 * - Costos de transacción 
 * - Estado de la estrategia Wheel
 * - Alertas y notificaciones
 * 
 * Ejecuta en segundo plano (según regla del usuario) y proporciona
 * interfaz web accesible en http://localhost:4680
 * 
 * @author QBTC Systems - Real-Time Monitoring Division
 * @version 1.0 - LIVE DASHBOARD
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const { createRealCostEngine } = require('./transaction-costs-engine');

// ==============================================================================
// 🌐 CONFIGURACIÓN DEL SERVIDOR WEB
// ==============================================================================

const DASHBOARD_CONFIG = {
    PORT: 4680,                    // Puerto del dashboard
    UPDATE_INTERVAL_MS: 5000,     // Actualización cada 5 segundos
    MAX_HISTORY_POINTS: 200,      // Máximo puntos en gráficos
    ENABLE_ALERTS: true,          // Alertas automáticas
    ALERT_THRESHOLDS: {
        MAX_DRAWDOWN: -0.10,      // 10% drawdown máximo
        MIN_WIN_RATE: 0.60,       // 60% win rate mínimo
        HIGH_COST_DRAG: 0.40,     // 40% cost drag máximo
        LOW_LIQUIDITY: 50000      // Volumen mínimo
    }
};

// ==============================================================================
// 📊 SERVIDOR DEL DASHBOARD
// ==============================================================================

class RealTimeDashboard {
    constructor(config = {}) {
        this.config = {
            port: config.port || DASHBOARD_CONFIG.PORT,
            enable_alerts: config.enable_alerts ?? true,
            update_interval: config.update_interval || DASHBOARD_CONFIG.UPDATE_INTERVAL_MS,
            ...config
        };
        
        // Estado del dashboard
        this.state = {
            is_running: false,
            connected_clients: 0,
            last_update: new Date(),
            monitored_systems: new Map(),    // Sistemas conectados
            performance_history: [],
            alerts_history: [],
            real_time_data: {
                positions: [],
                metrics: {},
                cost_analysis: {},
                wheel_states: {},
                market_data: {}
            }
        };
        
        // Configurar servidor Express
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        
        this.setupRoutes();
        this.setupWebSocket();
        this.setupBackgroundProcesses();
    }
    
    /**
     * 🚀 Iniciar el dashboard
     */
    async start() {
        if (this.state.is_running) {
            console.log('⚠️ Dashboard ya está ejecutándose');
            return;
        }
        
        console.log('📊 INICIANDO REAL-TIME DASHBOARD');
        console.log(`   Puerto: ${this.config.port}`);
        console.log(`   URL: http://localhost:${this.config.port}`);
        console.log('');
        
        return new Promise((resolve, reject) => {
            this.server.listen(this.config.port, (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                
                this.state.is_running = true;
                console.log(`✅ Dashboard iniciado en http://localhost:${this.config.port}`);
                resolve();
            });
        });
    }
    
    /**
     * 🛑 Detener el dashboard
     */
    stop() {
        if (!this.state.is_running) {
            console.log('⚠️ Dashboard no está ejecutándose');
            return;
        }
        
        if (this.update_interval) {
            clearInterval(this.update_interval);
        }
        
        this.server.close();
        this.state.is_running = false;
        console.log('🛑 Dashboard detenido');
    }
    
    /**
     * 🔧 Configurar rutas web
     */
    setupRoutes() {
        // Servir archivos estáticos
        this.app.use('/static', express.static(path.join(__dirname, 'dashboard-static')));
        this.app.use(express.json());
        
        // Página principal
        this.app.get('/', (req, res) => {
            res.send(this.generateMainDashboardHTML());
        });
        
        // API endpoints
        this.app.get('/api/metrics', (req, res) => {
            res.json(this.getCurrentMetrics());
        });
        
        this.app.get('/api/positions', (req, res) => {
            res.json(this.getCurrentPositions());
        });
        
        this.app.get('/api/performance', (req, res) => {
            res.json(this.getPerformanceHistory());
        });
        
        this.app.get('/api/costs', (req, res) => {
            res.json(this.getCostAnalysis());
        });
        
        this.app.get('/api/alerts', (req, res) => {
            res.json(this.getAlertsHistory());
        });
        
        this.app.get('/api/wheel-status', (req, res) => {
            res.json(this.getWheelStatus());
        });
        
        // Endpoint para registrar sistemas
        this.app.post('/api/register-system', (req, res) => {
            const { system_id, system_type, config } = req.body;
            this.registerSystem(system_id, system_type, config);
            res.json({ success: true });
        });
        
        // Endpoint para actualizar datos
        this.app.post('/api/update-data', (req, res) => {
            const { system_id, data } = req.body;
            this.updateSystemData(system_id, data);
            res.json({ success: true });
        });
    }
    
    /**
     * 🔌 Configurar WebSocket para updates en tiempo real
     */
    setupWebSocket() {
        this.io.on('connection', (socket) => {
            this.state.connected_clients++;
            console.log(`📱 Cliente conectado. Total: ${this.state.connected_clients}`);
            
            // Enviar datos iniciales
            socket.emit('initial-data', this.state.real_time_data);
            
            // Manejar desconexión
            socket.on('disconnect', () => {
                this.state.connected_clients--;
                console.log(`📱 Cliente desconectado. Total: ${this.state.connected_clients}`);
            });
            
            // Manejar solicitudes de datos específicos
            socket.on('request-data', (data_type) => {
                switch (data_type) {
                    case 'positions':
                        socket.emit('positions-update', this.getCurrentPositions());
                        break;
                    case 'metrics':
                        socket.emit('metrics-update', this.getCurrentMetrics());
                        break;
                    case 'performance':
                        socket.emit('performance-update', this.getPerformanceHistory());
                        break;
                }
            });
        });
    }
    
    /**
     * ⚙️ Configurar procesos en segundo plano
     */
    setupBackgroundProcesses() {
        // Proceso principal de actualización en segundo plano
        this.update_interval = setInterval(() => {
            this.updateRealTimeData();
            this.checkAlerts();
            this.broadcastUpdates();
        }, this.config.update_interval);
    }
    
    /**
     * 📈 Actualizar datos en tiempo real
     */
    updateRealTimeData() {
        this.state.last_update = new Date();
        
        // Simular datos de mercado en tiempo real
        const mock_market_data = this.generateMockMarketData();
        this.state.real_time_data.market_data = mock_market_data;
        
        // Agregar punto de performance histórica
        const performance_point = {
            timestamp: new Date(),
            total_pnl: this.calculateTotalPnL(),
            win_rate: this.calculateWinRate(),
            active_positions: this.state.real_time_data.positions.length,
            cost_drag: this.calculateCostDrag(),
            sharpe_ratio: this.calculateSharpeRatio()
        };
        
        this.state.performance_history.push(performance_point);
        
        // Mantener solo los últimos N puntos
        if (this.state.performance_history.length > DASHBOARD_CONFIG.MAX_HISTORY_POINTS) {
            this.state.performance_history.shift();
        }
        
        // Actualizar métricas actuales
        this.state.real_time_data.metrics = this.generateCurrentMetrics();
    }
    
    /**
     * 🚨 Verificar alertas
     */
    checkAlerts() {
        if (!this.config.enable_alerts) return;
        
        const alerts = [];
        const thresholds = DASHBOARD_CONFIG.ALERT_THRESHOLDS;
        const metrics = this.state.real_time_data.metrics;
        
        // Verificar drawdown
        if (metrics.current_drawdown && metrics.current_drawdown < thresholds.MAX_DRAWDOWN) {
            alerts.push({
                type: 'WARNING',
                severity: 'HIGH',
                message: `Drawdown alto: ${(metrics.current_drawdown * 100).toFixed(1)}%`,
                timestamp: new Date(),
                metric: 'drawdown',
                value: metrics.current_drawdown
            });
        }
        
        // Verificar win rate
        if (metrics.win_rate && metrics.win_rate < thresholds.MIN_WIN_RATE) {
            alerts.push({
                type: 'WARNING',
                severity: 'MEDIUM',
                message: `Win rate bajo: ${(metrics.win_rate * 100).toFixed(1)}%`,
                timestamp: new Date(),
                metric: 'win_rate',
                value: metrics.win_rate
            });
        }
        
        // Verificar cost drag
        if (metrics.cost_drag && metrics.cost_drag > thresholds.HIGH_COST_DRAG) {
            alerts.push({
                type: 'WARNING',
                severity: 'MEDIUM',
                message: `Cost drag alto: ${(metrics.cost_drag * 100).toFixed(1)}%`,
                timestamp: new Date(),
                metric: 'cost_drag',
                value: metrics.cost_drag
            });
        }
        
        // Verificar liquidez
        for (const [symbol, data] of Object.entries(this.state.real_time_data.market_data)) {
            if (data.volume < thresholds.LOW_LIQUIDITY) {
                alerts.push({
                    type: 'INFO',
                    severity: 'LOW',
                    message: `Baja liquidez en ${symbol}: ${data.volume.toLocaleString()}`,
                    timestamp: new Date(),
                    metric: 'liquidity',
                    symbol: symbol,
                    value: data.volume
                });
            }
        }
        
        // Agregar nuevas alertas
        alerts.forEach(alert => {
            this.state.alerts_history.push(alert);
        });
        
        // Mantener solo las últimas 100 alertas
        if (this.state.alerts_history.length > 100) {
            this.state.alerts_history.splice(0, this.state.alerts_history.length - 100);
        }
        
        // Broadcast alertas críticas inmediatamente
        const critical_alerts = alerts.filter(a => a.severity === 'HIGH');
        if (critical_alerts.length > 0) {
            this.io.emit('critical-alerts', critical_alerts);
        }
    }
    
    /**
     * 📡 Broadcast actualizaciones a clientes conectados
     */
    broadcastUpdates() {
        if (this.state.connected_clients === 0) return;
        
        // Enviar datos actualizados
        this.io.emit('data-update', {
            timestamp: this.state.last_update,
            metrics: this.state.real_time_data.metrics,
            positions: this.state.real_time_data.positions,
            market_data: this.state.real_time_data.market_data,
            performance_point: this.state.performance_history[this.state.performance_history.length - 1],
            alerts_count: this.state.alerts_history.length
        });
    }
    
    // ==============================================================================
    // 🔗 INTEGRACIÓN CON SISTEMAS EXTERNOS
    // ==============================================================================
    
    /**
     * 📝 Registrar sistema de trading
     */
    registerSystem(system_id, system_type, config) {
        this.state.monitored_systems.set(system_id, {
            id: system_id,
            type: system_type,
            config: config,
            last_update: new Date(),
            status: 'ACTIVE'
        });
        
        console.log(`📋 Sistema registrado: ${system_id} (${system_type})`);
    }
    
    /**
     * 📊 Actualizar datos de sistema externo
     */
    updateSystemData(system_id, data) {
        const system = this.state.monitored_systems.get(system_id);
        if (!system) {
            console.warn(`⚠️ Sistema no registrado: ${system_id}`);
            return;
        }
        
        system.last_update = new Date();
        
        // Actualizar posiciones si se proporcionan
        if (data.positions) {
            this.state.real_time_data.positions = data.positions;
        }
        
        // Actualizar métricas si se proporcionan
        if (data.metrics) {
            Object.assign(this.state.real_time_data.metrics, data.metrics);
        }
        
        // Actualizar estados de wheel si se proporcionan
        if (data.wheel_states) {
            this.state.real_time_data.wheel_states = data.wheel_states;
        }
        
        // Actualizar análisis de costos si se proporciona
        if (data.cost_analysis) {
            this.state.real_time_data.cost_analysis = data.cost_analysis;
        }
    }
    
    // ==============================================================================
    // 📊 GENERACIÓN DE DATOS Y MÉTRICAS
    // ==============================================================================
    
    generateMockMarketData() {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
        const market_data = {};
        
        const base_prices = {
            'BTCUSDT': 43500,
            'ETHUSDT': 2720,
            'SOLUSDT': 102,
            'BNBUSDT': 315
        };
        
        symbols.forEach(symbol => {
            const base_price = base_prices[symbol] || 100;
            const time_factor = Date.now() / 1000000;
            const volatility = 0.02;
            const price_variation = Math.sin(time_factor + symbol.charCodeAt(0)) * volatility;
            
            market_data[symbol] = {
                current_price: base_price * (1 + price_variation),
                price_change_24h: (Math.sin(time_factor * 0.5) * 5),
                volume: 1000000 + Math.floor(Math.sin(time_factor) * 500000),
                implied_volatility: 0.25 + Math.sin(time_factor * 0.3) * 0.15,
                bid: base_price * (1 + price_variation - 0.001),
                ask: base_price * (1 + price_variation + 0.001),
                last_updated: new Date()
            };
        });
        
        return market_data;
    }
    
    generateCurrentMetrics() {
        const total_pnl = this.calculateTotalPnL();
        const positions = this.state.real_time_data.positions || [];
        
        return {
            total_pnl: total_pnl,
            total_positions: positions.length,
            active_positions: positions.filter(p => p.status === 'ACTIVE').length,
            win_rate: this.calculateWinRate(),
            cost_drag: this.calculateCostDrag(),
            sharpe_ratio: this.calculateSharpeRatio(),
            current_drawdown: this.calculateCurrentDrawdown(),
            monthly_return: this.calculateMonthlyReturn(),
            annualized_return: this.calculateAnnualizedReturn(),
            last_update: this.state.last_update
        };
    }
    
    calculateTotalPnL() {
        const positions = this.state.real_time_data.positions || [];
        return positions.reduce((sum, pos) => sum + (pos.current_pnl || 0), 0);
    }
    
    calculateWinRate() {
        const positions = this.state.real_time_data.positions || [];
        const closed_positions = positions.filter(p => p.status === 'CLOSED');
        if (closed_positions.length === 0) return 0;
        
        const winners = closed_positions.filter(p => (p.final_pnl || 0) > 0);
        return winners.length / closed_positions.length;
    }
    
    calculateCostDrag() {
        const positions = this.state.real_time_data.positions || [];
        const total_premium = positions.reduce((sum, pos) => sum + (pos.premium_collected || 0), 0);
        const total_costs = positions.reduce((sum, pos) => sum + (pos.total_costs || 0), 0);
        
        if (total_premium === 0) return 0;
        return total_costs / total_premium;
    }
    
    calculateSharpeRatio() {
        if (this.state.performance_history.length < 10) return 0;
        
        const returns = this.state.performance_history.slice(-30).map(p => p.total_pnl || 0);
        const mean_return = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean_return, 2), 0) / returns.length;
        const std_dev = Math.sqrt(variance);
        
        if (std_dev === 0) return 0;
        return mean_return / std_dev;
    }
    
    calculateCurrentDrawdown() {
        if (this.state.performance_history.length === 0) return 0;
        
        const pnl_values = this.state.performance_history.map(p => p.total_pnl || 0);
        const peak = Math.max(...pnl_values);
        const current = pnl_values[pnl_values.length - 1];
        
        if (peak <= 0) return 0;
        return (current - peak) / Math.abs(peak);
    }
    
    calculateMonthlyReturn() {
        const days_in_month = 30;
        const recent_points = this.state.performance_history.slice(-days_in_month);
        
        if (recent_points.length < 2) return 0;
        
        const start_pnl = recent_points[0].total_pnl || 0;
        const end_pnl = recent_points[recent_points.length - 1].total_pnl || 0;
        
        return ((end_pnl - start_pnl) / 100000) * 100; // Asumir 100k capital base
    }
    
    calculateAnnualizedReturn() {
        const monthly_return = this.calculateMonthlyReturn();
        return Math.pow(1 + monthly_return / 100, 12) - 1;
    }
    
    // ==============================================================================
    // 📊 MÉTODOS DE API
    // ==============================================================================
    
    getCurrentMetrics() {
        return {
            timestamp: this.state.last_update,
            metrics: this.state.real_time_data.metrics,
            system_status: {
                is_running: this.state.is_running,
                connected_clients: this.state.connected_clients,
                monitored_systems: Array.from(this.state.monitored_systems.values())
            }
        };
    }
    
    getCurrentPositions() {
        return {
            timestamp: this.state.last_update,
            positions: this.state.real_time_data.positions,
            summary: {
                total_count: this.state.real_time_data.positions.length,
                active_count: this.state.real_time_data.positions.filter(p => p.status === 'ACTIVE').length,
                total_pnl: this.calculateTotalPnL()
            }
        };
    }
    
    getPerformanceHistory() {
        return {
            timestamp: this.state.last_update,
            history: this.state.performance_history.slice(-100), // Últimos 100 puntos
            summary: {
                total_points: this.state.performance_history.length,
                time_range: this.state.performance_history.length > 0 ? {
                    start: this.state.performance_history[0].timestamp,
                    end: this.state.performance_history[this.state.performance_history.length - 1].timestamp
                } : null
            }
        };
    }
    
    getCostAnalysis() {
        return {
            timestamp: this.state.last_update,
            cost_analysis: this.state.real_time_data.cost_analysis,
            summary: {
                cost_drag: this.calculateCostDrag(),
                total_costs: this.state.real_time_data.positions.reduce((sum, pos) => sum + (pos.total_costs || 0), 0),
                cost_efficiency: this.calculateCostDrag() < 0.3 ? 'GOOD' : 'HIGH'
            }
        };
    }
    
    getAlertsHistory() {
        return {
            timestamp: this.state.last_update,
            alerts: this.state.alerts_history.slice(-50), // Últimas 50 alertas
            summary: {
                total_alerts: this.state.alerts_history.length,
                critical_count: this.state.alerts_history.filter(a => a.severity === 'HIGH').length,
                warning_count: this.state.alerts_history.filter(a => a.severity === 'MEDIUM').length
            }
        };
    }
    
    getWheelStatus() {
        return {
            timestamp: this.state.last_update,
            wheel_states: this.state.real_time_data.wheel_states,
            summary: {
                total_symbols: Object.keys(this.state.real_time_data.wheel_states).length,
                phases: Object.values(this.state.real_time_data.wheel_states).reduce((acc, state) => {
                    acc[state.phase] = (acc[state.phase] || 0) + 1;
                    return acc;
                }, {})
            }
        };
    }
    
    // ==============================================================================
    // 🖥️ GENERACIÓN DE HTML DEL DASHBOARD
    // ==============================================================================
    
    generateMainDashboardHTML() {
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💎 Volatility Monetization Dashboard</title>
    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            background: rgba(0,0,0,0.3);
            padding: 20px;
            border-radius: 15px;
        }
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        .card h3 {
            margin-bottom: 15px;
            color: #ffd700;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .metric {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px;
            background: rgba(0,0,0,0.2);
            border-radius: 8px;
        }
        .metric-value {
            font-weight: bold;
            color: #00ff88;
        }
        .metric-value.negative { color: #ff4757; }
        .metric-value.warning { color: #ffa502; }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-active { background-color: #00ff88; }
        .status-inactive { background-color: #ff4757; }
        .status-warning { background-color: #ffa502; }
        .chart-container {
            grid-column: span 2;
            height: 400px;
            position: relative;
        }
        .positions-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .positions-table th,
        .positions-table td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .positions-table th {
            background: rgba(0,0,0,0.3);
            color: #ffd700;
        }
        .alert {
            padding: 10px;
            margin: 5px 0;
            border-radius: 8px;
            border-left: 4px solid;
        }
        .alert-high { border-color: #ff4757; background: rgba(255,71,87,0.2); }
        .alert-medium { border-color: #ffa502; background: rgba(255,165,2,0.2); }
        .alert-low { border-color: #3742fa; background: rgba(55,66,250,0.2); }
        .update-time {
            text-align: center;
            color: rgba(255,255,255,0.7);
            margin-top: 20px;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        .updating { animation: pulse 1s infinite; }
    </style>
</head>
<body>
    <div class="header">
        <h1>💎 VOLATILITY MONETIZATION DASHBOARD</h1>
        <p>Monitoreo en Tiempo Real - Sistema de Venta de Volatilidad</p>
        <p>🎯 Principio: "La incertidumbre tiene precio, y tú puedes cobrarlo"</p>
    </div>

    <div class="dashboard-grid">
        <!-- Métricas Principales -->
        <div class="card">
            <h3>📊 Métricas Principales</h3>
            <div class="metric">
                <span>P&L Total:</span>
                <span class="metric-value" id="total-pnl">$0.00</span>
            </div>
            <div class="metric">
                <span>Return Mensual:</span>
                <span class="metric-value" id="monthly-return">0.00%</span>
            </div>
            <div class="metric">
                <span>Win Rate:</span>
                <span class="metric-value" id="win-rate">0.00%</span>
            </div>
            <div class="metric">
                <span>Sharpe Ratio:</span>
                <span class="metric-value" id="sharpe-ratio">0.00</span>
            </div>
            <div class="metric">
                <span>Cost Drag:</span>
                <span class="metric-value warning" id="cost-drag">0.00%</span>
            </div>
        </div>

        <!-- Estado del Sistema -->
        <div class="card">
            <h3>⚙️ Estado del Sistema</h3>
            <div class="metric">
                <span>Estado:</span>
                <span><span class="status-indicator status-active"></span>ACTIVO</span>
            </div>
            <div class="metric">
                <span>Posiciones Activas:</span>
                <span class="metric-value" id="active-positions">0</span>
            </div>
            <div class="metric">
                <span>Clientes Conectados:</span>
                <span class="metric-value" id="connected-clients">0</span>
            </div>
            <div class="metric">
                <span>Última Actualización:</span>
                <span id="last-update">--</span>
            </div>
        </div>

        <!-- Datos de Mercado -->
        <div class="card">
            <h3>📈 Datos de Mercado</h3>
            <div id="market-data">
                <!-- Se llena dinámicamente -->
            </div>
        </div>

        <!-- Alertas Recientes -->
        <div class="card">
            <h3>🚨 Alertas Recientes</h3>
            <div id="recent-alerts">
                <p>No hay alertas recientes</p>
            </div>
        </div>

        <!-- Gráfico de Performance -->
        <div class="card chart-container">
            <h3>📊 Performance Histórica</h3>
            <canvas id="performance-chart"></canvas>
        </div>

        <!-- Posiciones Activas -->
        <div class="card" style="grid-column: span 2;">
            <h3>🎯 Posiciones Activas</h3>
            <table class="positions-table" id="positions-table">
                <thead>
                    <tr>
                        <th>Símbolo</th>
                        <th>Tipo</th>
                        <th>Contratos</th>
                        <th>Strike</th>
                        <th>Premium</th>
                        <th>P&L</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Se llena dinámicamente -->
                </tbody>
            </table>
        </div>
    </div>

    <div class="update-time" id="update-time">
        Última actualización: --
    </div>

    <script>
        // Configurar WebSocket
        const socket = io();
        
        // Variables globales
        let performanceChart = null;
        let lastUpdate = new Date();

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            initializeChart();
            requestInitialData();
        });

        // Escuchar eventos WebSocket
        socket.on('initial-data', function(data) {
            updateAllData(data);
        });

        socket.on('data-update', function(data) {
            updateAllData(data);
            document.body.classList.add('updating');
            setTimeout(() => document.body.classList.remove('updating'), 500);
        });

        socket.on('critical-alerts', function(alerts) {
            alerts.forEach(alert => showNotification(alert));
        });

        // Solicitar datos iniciales
        function requestInitialData() {
            socket.emit('request-data', 'all');
        }

        // Actualizar todos los datos
        function updateAllData(data) {
            if (data.metrics) updateMetrics(data.metrics);
            if (data.positions) updatePositions(data.positions);
            if (data.market_data) updateMarketData(data.market_data);
            if (data.performance_point) updatePerformanceChart(data.performance_point);
            
            updateLastUpdate(data.timestamp);
        }

        // Actualizar métricas
        function updateMetrics(metrics) {
            document.getElementById('total-pnl').textContent = '$' + (metrics.total_pnl || 0).toFixed(2);
            document.getElementById('monthly-return').textContent = (metrics.monthly_return || 0).toFixed(2) + '%';
            document.getElementById('win-rate').textContent = ((metrics.win_rate || 0) * 100).toFixed(1) + '%';
            document.getElementById('sharpe-ratio').textContent = (metrics.sharpe_ratio || 0).toFixed(2);
            document.getElementById('cost-drag').textContent = ((metrics.cost_drag || 0) * 100).toFixed(1) + '%';
            document.getElementById('active-positions').textContent = metrics.active_positions || 0;

            // Colorear métricas
            const pnlElement = document.getElementById('total-pnl');
            pnlElement.className = (metrics.total_pnl || 0) >= 0 ? 'metric-value' : 'metric-value negative';
        }

        // Actualizar posiciones
        function updatePositions(positions) {
            const tbody = document.querySelector('#positions-table tbody');
            tbody.innerHTML = '';

            positions.forEach(position => {
                const row = tbody.insertRow();
                row.innerHTML = \`
                    <td>\${position.symbol}</td>
                    <td>\${position.type}</td>
                    <td>\${position.contracts}</td>
                    <td>$\${(position.strike || 0).toFixed(2)}</td>
                    <td>$\${(position.premium_collected || 0).toFixed(2)}</td>
                    <td class="\${(position.current_pnl || 0) >= 0 ? '' : 'negative'}">$\${(position.current_pnl || 0).toFixed(2)}</td>
                    <td>\${position.status}</td>
                \`;
            });
        }

        // Actualizar datos de mercado
        function updateMarketData(marketData) {
            const container = document.getElementById('market-data');
            container.innerHTML = '';

            Object.entries(marketData).forEach(([symbol, data]) => {
                const div = document.createElement('div');
                div.className = 'metric';
                div.innerHTML = \`
                    <span>\${symbol}:</span>
                    <span class="metric-value">$\${data.current_price.toFixed(2)} (\${data.price_change_24h >= 0 ? '+' : ''}\${data.price_change_24h.toFixed(2)}%)</span>
                \`;
                container.appendChild(div);
            });
        }

        // Inicializar gráfico
        function initializeChart() {
            const ctx = document.getElementById('performance-chart').getContext('2d');
            performanceChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'P&L',
                        data: [],
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            grid: {
                                color: 'rgba(255,255,255,0.1)'
                            },
                            ticks: {
                                color: 'white'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white'
                            }
                        }
                    }
                }
            });
        }

        // Actualizar gráfico de performance
        function updatePerformanceChart(performancePoint) {
            if (!performanceChart) return;

            const time = new Date(performancePoint.timestamp).toLocaleTimeString();
            
            performanceChart.data.labels.push(time);
            performanceChart.data.datasets[0].data.push(performancePoint.total_pnl);

            // Mantener solo los últimos 50 puntos
            if (performanceChart.data.labels.length > 50) {
                performanceChart.data.labels.shift();
                performanceChart.data.datasets[0].data.shift();
            }

            performanceChart.update('none');
        }

        // Actualizar timestamp
        function updateLastUpdate(timestamp) {
            const time = new Date(timestamp).toLocaleString();
            document.getElementById('update-time').textContent = 'Última actualización: ' + time;
            document.getElementById('last-update').textContent = time;
        }

        // Mostrar notificación de alerta crítica
        function showNotification(alert) {
            // Crear notificación temporal
            const notification = document.createElement('div');
            notification.className = 'alert alert-' + alert.severity.toLowerCase();
            notification.innerHTML = \`
                <strong>\${alert.type}:</strong> \${alert.message}
                <small style="float: right;">\${new Date(alert.timestamp).toLocaleTimeString()}</small>
            \`;
            
            document.body.appendChild(notification);
            
            // Remover después de 5 segundos
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 5000);
        }

        // Actualizar clientes conectados
        socket.on('connect', function() {
            console.log('Conectado al dashboard');
        });

        socket.on('disconnect', function() {
            console.log('Desconectado del dashboard');
        });
    </script>
</body>
</html>
        `;
    }
}

// ==============================================================================
// 🚀 FACTORY FUNCTION Y EXPORTS
// ==============================================================================

function createRealTimeDashboard(config = {}) {
    return new RealTimeDashboard(config);
}

module.exports = {
    RealTimeDashboard,
    DASHBOARD_CONFIG,
    createRealTimeDashboard
};

// ==============================================================================
// 💡 CLI USAGE
// ==============================================================================

if (require.main === module) {
    console.log('📊 REAL-TIME VOLATILITY DASHBOARD');
    console.log('==================================');
    console.log('');
    console.log('🌐 Dashboard web en tiempo real para monitorear:');
    console.log('   • Posiciones activas y P&L');
    console.log('   • Métricas de performance');
    console.log('   • Costos de transacción');
    console.log('   • Estado de estrategia Wheel');
    console.log('   • Alertas automáticas');
    console.log('');
    console.log('🚀 Iniciando dashboard...');
    
    const dashboard = createRealTimeDashboard();
    dashboard.start().then(() => {
        console.log(`✅ Dashboard disponible en http://localhost:${dashboard.config.port}`);
    }).catch(error => {
        console.error('❌ Error iniciando dashboard:', error.message);
    });
    
    // Manejar cierre limpio
    process.on('SIGINT', () => {
        console.log('\n🛑 Cerrando dashboard...');
        dashboard.stop();
        process.exit(0);
    });
}

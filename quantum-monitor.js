
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

const config = require('./config');
const http = require('http');
const { logger } = require('./quantum-options-specialist/src/utils/logger');
const QuantumBinanceSystem = require('./quantum-binance-system');

class QuantumMonitor {
    constructor() {
        this.quantumSystem = new QuantumBinanceSystem();
        this.monitorInterval = null;
        this.monitorData = {
            systemStatus: 'initialized',
            lastUpdate: null,
            binanceConnected: false,
            marketData: {},
            quantumMatrix: [],
            tradingSignals: [],
            activePositions: [],
            performance: {},
            cycles: 0,
            errors: [],
            warnings: [],
            uptime: 0,
            startTime: Date.now()
        };
        
        // Inicializar monitor
        this.initialize();
    }
    
    async initialize() {
        try {
            console.log(' Inicializando Monitor Cuántico de Control...');
            
            // Verificar conexión a Binance
            await this.checkBinanceConnection();
            
            // Obtener datos iniciales
            await this.updateMarketData();
            await this.updateQuantumMatrix();
            await this.updateTradingSignals();
            await this.updatePerformance();
            
            // Iniciar monitoreo continuo
            this.startMonitoring();
            
            console.log('[OK] Monitor Cuántico de Control inicializado correctamente');
        } catch (error) {
            console.error('[ERROR] Error al inicializar el monitor:', error);
            this.monitorData.errors.push({
                timestamp: new Date().toISOString(),
                message: 'Error al inicializar el monitor',
                details: error.message
            });
        }
    }
    
    async checkBinanceConnection() {
        try {
            const serverTime = await this.quantumSystem.binanceConnector.getServerTime();
            this.monitorData.binanceConnected = true;
            this.monitorData.systemStatus = 'connected';
            console.log('[OK] Conexión a Binance verificada');
        } catch (error) {
            this.monitorData.binanceConnected = false;
            this.monitorData.systemStatus = 'disconnected';
            this.monitorData.errors.push({
                timestamp: new Date().toISOString(),
                message: 'Error de conexión a Binance',
                details: error.message
            });
            console.error('[ERROR] Error de conexión a Binance:', error.message);
        }
    }
    
    async updateMarketData() {
        try {
            const symbols = config.quantum.symbols;
            const marketData = await this.quantumSystem.binanceConnector.getQuantumMarketData(symbols);
            
            this.monitorData.marketData = marketData;
            this.monitorData.lastUpdate = new Date().toISOString();
            
            console.log('[DATA] Datos de mercado actualizados');
            
            // Verificar condiciones anómalas
            this.checkMarketAnomalies(marketData);
        } catch (error) {
            this.monitorData.errors.push({
                timestamp: new Date().toISOString(),
                message: 'Error al actualizar datos de mercado',
                details: error.message
            });
            console.error('[ERROR] Error al actualizar datos de mercado:', error.message);
        }
    }
    
    checkMarketAnomalies(marketData) {
        for (const [symbol, data] of Object.entries(marketData)) {
            // Verificar volatilidad extrema
            if (data.volatility > 0.05) { // 5%
                this.monitorData.warnings.push({
                    timestamp: new Date().toISOString(),
                    type: 'high_volatility',
                    symbol: symbol,
                    value: data.volatility,
                    message: `Alta volatilidad detectada en ${symbol}`
                });
            }
            
            // Verificar cambios extremos
            if (Math.abs(data.change) > 0.1) { // 10%
                this.monitorData.warnings.push({
                    timestamp: new Date().toISOString(),
                    type: 'extreme_change',
                    symbol: symbol,
                    value: data.change,
                    message: `Cambio extremo detectado en ${symbol}`
                });
            }
            
            // Verificar volumen bajo
            if (data.volume < 100) {
                this.monitorData.warnings.push({
                    timestamp: new Date().toISOString(),
                    type: 'low_volume',
                    symbol: symbol,
                    value: data.volume,
                    message: `Volumen bajo detectado en ${symbol}`
                });
            }
        }
    }
    
    async updateQuantumMatrix() {
        try {
            const matrix = await this.quantumSystem.updateQuantumMatrix();
            this.monitorData.quantumMatrix = matrix;
            
            // Verificar coherencia cuántica
            this.checkQuantumCoherence(matrix);
            
            console.log(' Matriz cuántica actualizada');
        } catch (error) {
            this.monitorData.errors.push({
                timestamp: new Date().toISOString(),
                message: 'Error al actualizar matriz cuántica',
                details: error.message
            });
            console.error('[ERROR] Error al actualizar matriz cuántica:', error.message);
        }
    }
    
    checkQuantumCoherence(matrix) {
        // Verificar valores anómalos en la matriz cuántica
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                const value = matrix[i][j];
                
                // Verificar NaN o Infinity
                if (isNaN(value) || !isFinite(value)) {
                    this.monitorData.warnings.push({
                        timestamp: new Date().toISOString(),
                        type: 'quantum_anomaly',
                        position: `[${i},${j}]`,
                        value: value,
                        message: `Valor anómalo en matriz cuántica en posición [${i},${j}]`
                    });
                }
                
                // Verificar valores fuera de rango esperado
                if (value < 0 || value > 1) {
                    // Algunos valores cuánticos pueden estar fuera de este rango, pero es importante monitorear
                    if (value > 10 || value < -1) {
                        this.monitorData.warnings.push({
                            timestamp: new Date().toISOString(),
                            type: 'quantum_out_of_range',
                            position: `[${i},${j}]`,
                            value: value,
                            message: `Valor cuántico fuera de rango en posición [${i},${j}]`
                        });
                    }
                }
            }
        }
    }
    
    async updateTradingSignals() {
        try {
            const signals = await this.quantumSystem.generateTradingSignals();
            this.monitorData.tradingSignals = signals;
            
            console.log(` ${signals.length} señales de trading generadas`);
            
            // Verificar calidad de las señales
            this.checkSignalQuality(signals);
        } catch (error) {
            this.monitorData.errors.push({
                timestamp: new Date().toISOString(),
                message: 'Error al generar señales de trading',
                details: error.message
            });
            console.error('[ERROR] Error al generar señales de trading:', error.message);
        }
    }
    
    checkSignalQuality(signals) {
        signals.forEach((signal, index) => {
            // Verificar confianza de la señal
            if (signal.confidence && signal.confidence < 0.5) {
                this.monitorData.warnings.push({
                    timestamp: new Date().toISOString(),
                    type: 'low_confidence',
                    signalIndex: index,
                    value: signal.confidence,
                    message: `Señal con baja confianza (${signal.confidence})`
                });
            }
            
            // Verificar riesgo-reward
            if (signal.riskReward && signal.riskReward < 1) {
                this.monitorData.warnings.push({
                    timestamp: new Date().toISOString(),
                    type: 'poor_risk_reward',
                    signalIndex: index,
                    value: signal.riskReward,
                    message: `Señal con pobre ratio riesgo-reward (${signal.riskReward})`
                });
            }
        });
    }
    
    async updatePerformance() {
        try {
            const performance = this.quantumSystem.getPerformanceMetrics();
            this.monitorData.performance = performance;
            
            console.log('[UP] Métricas de rendimiento actualizadas');
            
            // Verificar métricas de rendimiento
            this.checkPerformanceMetrics(performance);
        } catch (error) {
            this.monitorData.errors.push({
                timestamp: new Date().toISOString(),
                message: 'Error al actualizar métricas de rendimiento',
                details: error.message
            });
            console.error('[ERROR] Error al actualizar métricas de rendimiento:', error.message);
        }
    }
    
    checkPerformanceMetrics(performance) {
        // Verificar drawdown máximo
        if (performance.maxDrawdown && performance.maxDrawdown > 0.2) { // 20%
            this.monitorData.warnings.push({
                timestamp: new Date().toISOString(),
                type: 'high_drawdown',
                value: performance.maxDrawdown,
                message: `Drawdown máximo elevado: ${(performance.maxDrawdown * 100).toFixed(2)}%`
            });
        }
        
        // Verificar win rate
        if (performance.winRate && performance.winRate < 0.4) { // 40%
            this.monitorData.warnings.push({
                timestamp: new Date().toISOString(),
                type: 'low_win_rate',
                value: performance.winRate,
                message: `Win rate bajo: ${(performance.winRate * 100).toFixed(2)}%`
            });
        }
        
        // Verificar Sharpe ratio
        if (performance.sharpeRatio && performance.sharpeRatio < 1) {
            this.monitorData.warnings.push({
                timestamp: new Date().toISOString(),
                type: 'low_sharpe_ratio',
                value: performance.sharpeRatio,
                message: `Sharpe ratio bajo: ${performance.sharpeRatio.toFixed(2)}`
            });
        }
    }
    
    startMonitoring() {
        // Actualizar uptime
        this.monitorData.uptime = Date.now() - this.monitorData.startTime;
        
        // Monitoreo cada 60 segundos
        this.monitorInterval = setInterval(async () => {
            try {
                this.monitorData.cycles++;
                this.monitorData.uptime = Date.now() - this.monitorData.startTime;
                
                console.log(`[RELOAD] Ciclo de monitoreo #${this.monitorData.cycles}`);
                
                // Actualizar datos
                await this.checkBinanceConnection();
                await this.updateMarketData();
                await this.updateQuantumMatrix();
                await this.updateTradingSignals();
                await this.updatePerformance();
                
                // Limpiar errores y advertencias antiguos (mantener solo últimos 50)
                if (this.monitorData.errors.length > 50) {
                    this.monitorData.errors = this.monitorData.errors.slice(-50);
                }
                
                if (this.monitorData.warnings.length > 50) {
                    this.monitorData.warnings = this.monitorData.warnings.slice(-50);
                }
                
                // Generar reporte de estado
                this.generateStatusReport();
                
            } catch (error) {
                console.error('[ERROR] Error en ciclo de monitoreo:', error);
                this.monitorData.errors.push({
                    timestamp: new Date().toISOString(),
                    message: 'Error en ciclo de monitoreo',
                    details: error.message
                });
            }
        }, 60000); // 60 segundos
        
        console.log('[RELOAD] Monitoreo continuo iniciado (cada 60 segundos)');
    }
    
    generateStatusReport() {
        const report = {
            timestamp: new Date().toISOString(),
            uptime: this.formatUptime(this.monitorData.uptime),
            cycles: this.monitorData.cycles,
            status: this.monitorData.systemStatus,
            binanceConnected: this.monitorData.binanceConnected,
            marketDataCount: Object.keys(this.monitorData.marketData).length,
            tradingSignalsCount: this.monitorData.tradingSignals.length,
            activePositionsCount: this.monitorData.activePositions.length,
            errorsCount: this.monitorData.errors.length,
            warningsCount: this.monitorData.warnings.length,
            performance: {
                totalTrades: this.monitorData.performance.totalTrades || 0,
                totalProfit: this.monitorData.performance.totalProfit || 0,
                winRate: this.monitorData.performance.winRate || 0,
                maxDrawdown: this.monitorData.performance.maxDrawdown || 0
            }
        };
        
        console.log('[DATA] Reporte de estado:', JSON.stringify(report, null, 2));
        
        // Si hay errores o advertencias críticas, mostrarlas
        if (this.monitorData.errors.length > 0) {
            console.log('[ALERT] Errores recientes:', this.monitorData.errors.slice(-3));
        }
        
        if (this.monitorData.warnings.length > 0) {
            console.log('[WARNING] Advertencias recientes:', this.monitorData.warnings.slice(-3));
        }
    }
    
    formatUptime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
    }
    
    getMonitorData() {
        return {
            ...this.monitorData,
            uptime: this.formatUptime(this.monitorData.uptime)
        };
    }
    
    stop() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
            console.log(' Monitoreo detenido');
        }
    }
}

// Crear servidor HTTP para el monitor
const monitor = new QuantumMonitor();

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    if (url.pathname === '/monitor') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(monitor.getMonitorData(), null, 2));
    } else if (url.pathname === '/monitor/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: monitor.monitorData.systemStatus,
            uptime: monitor.formatUptime(monitor.monitorData.uptime),
            cycles: monitor.monitorData.cycles,
            binanceConnected: monitor.monitorData.binanceConnected,
            timestamp: new Date().toISOString()
        }));
    } else if (url.pathname === '/monitor/errors') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            errors: monitor.monitorData.errors,
            count: monitor.monitorData.errors.length,
            timestamp: new Date().toISOString()
        }));
    } else if (url.pathname === '/monitor/warnings') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            warnings: monitor.monitorData.warnings,
            count: monitor.monitorData.warnings.length,
            timestamp: new Date().toISOString()
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Iniciar servidor de monitor en puerto 4001
server.listen(4001, () => {
    console.log(' Monitor Cuántico de Control iniciado en puerto 4001');
    console.log('[DATA] Endpoints disponibles:');
    console.log('  - GET /monitor - Datos completos del monitor');
    console.log('  - GET /monitor/status - Estado del sistema');
    console.log('  - GET /monitor/errors - Errores del sistema');
    console.log('  - GET /monitor/warnings - Advertencias del sistema');
});

// Manejar cierre graceful
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, deteniendo monitor...');
    monitor.stop();
    server.close(() => {
        console.log('Monitor detenido');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT recibido, deteniendo monitor...');
    monitor.stop();
    server.close(() => {
        console.log('Monitor detenido');
        process.exit(0);
    });
});

module.exports = QuantumMonitor;
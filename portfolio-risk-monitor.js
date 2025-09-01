
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
 * Portfolio Risk Monitor
 * 
 * Monitorea el riesgo conjunto de todas las operaciones y leverage
 * del sistema Quantum Binance en tiempo real.
 */

const EventEmitter = require('events');

class PortfolioRiskMonitor extends EventEmitter {
    constructor(quantumSystem) {
        super();
        this.quantumSystem = quantumSystem;
        this.riskHistory = [];
        this.alertThresholds = {
            portfolioRisk: 0.8,      // 80% riesgo total
            leverage: 10,            // 10x leverage máximo
            correlation: 0.9,        // 90% correlación máxima
            drawdown: 0.15,          // 15% drawdown máximo
            concentration: 0.4       // 40% concentración máxima por símbolo
        };
        this.monitoringInterval = null;
        this.isMonitoring = false;
    }

    /**
     * Iniciar monitoreo de riesgo en tiempo real
     */
    startMonitoring(intervalMs = 30000) { // 30 segundos por defecto
        if (this.isMonitoring) {
            console.log('[WARNING] Portfolio risk monitor already running');
            return;
        }

        console.log('[SEARCH] Starting Portfolio Risk Monitor...');
        console.log(`[DATA] Monitoring interval: ${intervalMs / 1000}s`);
        
        this.isMonitoring = true;
        
        // Monitoreo inicial
        this.performRiskAssessment();
        
        // Monitoreo periódico
        this.monitoringInterval = setInterval(() => {
            this.performRiskAssessment();
        }, intervalMs);
        
        console.log('[OK] Portfolio Risk Monitor started');
    }

    /**
     * Detener monitoreo
     */
    stopMonitoring() {
        if (!this.isMonitoring) {
            console.log('[WARNING] Portfolio risk monitor not running');
            return;
        }

        console.log(' Stopping Portfolio Risk Monitor...');
        
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        
        this.isMonitoring = false;
        console.log('[OK] Portfolio Risk Monitor stopped');
    }

    /**
     * Realizar evaluación completa de riesgo
     */
    async performRiskAssessment() {
        try {
            const timestamp = Date.now();
            
            // Obtener métricas de riesgo del sistema
            const portfolioRisk = this.quantumSystem.calculatePortfolioRisk();
            const leverageRisk = this.quantumSystem.calculateLeverageRisk();
            const concentrationRisk = this.calculateConcentrationRisk();
            const drawdownRisk = this.calculateDrawdownRisk();
            
            // Crear snapshot de riesgo
            const riskSnapshot = {
                timestamp: timestamp,
                portfolioRisk: portfolioRisk,
                leverageRisk: leverageRisk,
                concentrationRisk: concentrationRisk,
                drawdownRisk: drawdownRisk,
                totalPositions: this.quantumSystem.activePositions?.length || 0,
                alerts: []
            };

            // Evaluar alertas de riesgo
            this.evaluateRiskAlerts(riskSnapshot);
            
            // Guardar en historial
            this.riskHistory.push(riskSnapshot);
            
            // Mantener solo últimas 100 entradas
            if (this.riskHistory.length > 100) {
                this.riskHistory.shift();
            }
            
            // Mostrar resumen si hay alertas
            if (riskSnapshot.alerts.length > 0) {
                this.displayRiskAlerts(riskSnapshot);
            }
            
            // Emitir evento de actualización
            this.emit('riskUpdate', riskSnapshot);
            
            // Log periódico (cada 5 minutos)
            if (timestamp % 300000 < 30000) { // Aproximadamente cada 5 min
                this.displayRiskSummary(riskSnapshot);
            }
            
        } catch (error) {
            console.error('[ERROR] Error in portfolio risk assessment:', error.message);
        }
    }

    /**
     * Evaluar alertas de riesgo
     */
    evaluateRiskAlerts(riskSnapshot) {
        const alerts = [];

        // Alerta de riesgo de portafolio
        if (riskSnapshot.portfolioRisk.totalRisk > this.alertThresholds.portfolioRisk) {
            alerts.push({
                type: 'PORTFOLIO_RISK',
                severity: 'HIGH',
                message: `Portfolio risk exceeded threshold: ${(riskSnapshot.portfolioRisk.totalRisk * 100).toFixed(1)}% > ${(this.alertThresholds.portfolioRisk * 100).toFixed(1)}%`,
                value: riskSnapshot.portfolioRisk.totalRisk,
                threshold: this.alertThresholds.portfolioRisk
            });
        }

        // Alerta de leverage
        if (riskSnapshot.leverageRisk.totalLeverage > this.alertThresholds.leverage) {
            alerts.push({
                type: 'LEVERAGE_RISK',
                severity: 'HIGH',
                message: `Total leverage exceeded threshold: ${riskSnapshot.leverageRisk.totalLeverage.toFixed(2)}x > ${this.alertThresholds.leverage}x`,
                value: riskSnapshot.leverageRisk.totalLeverage,
                threshold: this.alertThresholds.leverage
            });
        }

        // Alerta de concentración
        if (riskSnapshot.concentrationRisk.maxConcentration > this.alertThresholds.concentration) {
            alerts.push({
                type: 'CONCENTRATION_RISK',
                severity: 'MEDIUM',
                message: `Position concentration exceeded threshold: ${(riskSnapshot.concentrationRisk.maxConcentration * 100).toFixed(1)}% > ${(this.alertThresholds.concentration * 100).toFixed(1)}%`,
                value: riskSnapshot.concentrationRisk.maxConcentration,
                threshold: this.alertThresholds.concentration,
                symbol: riskSnapshot.concentrationRisk.maxConcentrationSymbol
            });
        }

        // Alerta de drawdown
        if (riskSnapshot.drawdownRisk.currentDrawdown > this.alertThresholds.drawdown) {
            alerts.push({
                type: 'DRAWDOWN_RISK',
                severity: 'HIGH',
                message: `Portfolio drawdown exceeded threshold: ${(riskSnapshot.drawdownRisk.currentDrawdown * 100).toFixed(1)}% > ${(this.alertThresholds.drawdown * 100).toFixed(1)}%`,
                value: riskSnapshot.drawdownRisk.currentDrawdown,
                threshold: this.alertThresholds.drawdown
            });
        }

        // Evaluar correlaciones altas
        for (const position of this.quantumSystem.activePositions || []) {
            const correlationRisk = this.quantumSystem.calculatePositionCorrelationRisk(position);
            if (correlationRisk > this.alertThresholds.correlation) {
                alerts.push({
                    type: 'CORRELATION_RISK',
                    severity: 'MEDIUM',
                    message: `High correlation risk for ${position.symbol}: ${(correlationRisk * 100).toFixed(1)}% > ${(this.alertThresholds.correlation * 100).toFixed(1)}%`,
                    value: correlationRisk,
                    threshold: this.alertThresholds.correlation,
                    position: position.id,
                    symbol: position.symbol
                });
            }
        }

        riskSnapshot.alerts = alerts;
    }

    /**
     * Calcular riesgo de concentración
     */
    calculateConcentrationRisk() {
        const positions = this.quantumSystem.activePositions || [];
        if (positions.length === 0) {
            return { maxConcentration: 0, concentrationBySymbol: {}, maxConcentrationSymbol: null };
        }

        const totalValue = this.quantumSystem.getTotalPortfolioValue();
        const concentrationBySymbol = {};
        let maxConcentration = 0;
        let maxConcentrationSymbol = null;

        for (const position of positions) {
            const symbol = position.symbol.replace(/USDT$/, '');
            const positionValue = Number(position.entryPrice || 0) * Number(position.quantity || 0);
            const concentration = positionValue / totalValue;

            if (!concentrationBySymbol[symbol]) {
                concentrationBySymbol[symbol] = 0;
            }
            concentrationBySymbol[symbol] += concentration;

            if (concentrationBySymbol[symbol] > maxConcentration) {
                maxConcentration = concentrationBySymbol[symbol];
                maxConcentrationSymbol = symbol;
            }
        }

        return {
            maxConcentration: maxConcentration,
            concentrationBySymbol: concentrationBySymbol,
            maxConcentrationSymbol: maxConcentrationSymbol
        };
    }

    /**
     * Calcular riesgo de drawdown
     */
    calculateDrawdownRisk() {
        const performanceMetrics = this.quantumSystem.performanceMetrics || {};
        const totalProfit = Number(performanceMetrics.totalProfit || 0);
        const maxDrawdown = Number(performanceMetrics.maxDrawdown || 0);
        
        // Calcular drawdown actual basado en posiciones abiertas
        const positions = this.quantumSystem.activePositions || [];
        let unrealizedPnL = 0;
        
        for (const position of positions) {
            unrealizedPnL += this.quantumSystem.calculatePositionUnrealizedPnL(position);
        }
        
        const totalValue = this.quantumSystem.getTotalPortfolioValue();
        const currentDrawdown = Math.max(0, -unrealizedPnL / totalValue);
        
        return {
            currentDrawdown: currentDrawdown,
            maxHistoricalDrawdown: maxDrawdown,
            unrealizedPnL: unrealizedPnL,
            totalValue: totalValue
        };
    }

    /**
     * Mostrar alertas de riesgo
     */
    displayRiskAlerts(riskSnapshot) {
        console.log('\n[ALERT] PORTFOLIO RISK ALERTS:');
        console.log('=' .repeat(60));
        
        for (const alert of riskSnapshot.alerts) {
            const severityEmoji = alert.severity === 'HIGH' ? '[RED]' : 
                                alert.severity === 'MEDIUM' ? '[YELLOW]' : '[GREEN]';
            
            console.log(`${severityEmoji} ${alert.type}: ${alert.message}`);
            
            if (alert.symbol) {
                console.log(`   [DATA] Symbol: ${alert.symbol}`);
            }
            if (alert.position) {
                console.log(`    Position: ${alert.position}`);
            }
        }
        
        console.log('=' .repeat(60));
        console.log(' ACCIÓN REQUERIDA: Revisar y ajustar posiciones según alertas');
        console.log('');
    }

    /**
     * Mostrar resumen de riesgo
     */
    displayRiskSummary(riskSnapshot) {
        console.log('\n[DATA] PORTFOLIO RISK SUMMARY:');
        console.log('-' .repeat(50));
        
        // Riesgo de portafolio
        const portfolioRiskPct = (riskSnapshot.portfolioRisk.totalRisk * 100).toFixed(1);
        const portfolioStatus = riskSnapshot.portfolioRisk.totalRisk > this.alertThresholds.portfolioRisk ? '[RED]' : '[GREEN]';
        console.log(`${portfolioStatus} Portfolio Risk: ${portfolioRiskPct}% (${riskSnapshot.totalPositions} positions)`);
        
        // Leverage
        const leverageStatus = riskSnapshot.leverageRisk.totalLeverage > this.alertThresholds.leverage ? '[RED]' : '[GREEN]';
        console.log(`${leverageStatus} Total Leverage: ${riskSnapshot.leverageRisk.totalLeverage.toFixed(2)}x`);
        
        // Concentración
        const concentrationPct = (riskSnapshot.concentrationRisk.maxConcentration * 100).toFixed(1);
        const concentrationStatus = riskSnapshot.concentrationRisk.maxConcentration > this.alertThresholds.concentration ? '[RED]' : '[GREEN]';
        console.log(`${concentrationStatus} Max Concentration: ${concentrationPct}% (${riskSnapshot.concentrationRisk.maxConcentrationSymbol || 'N/A'})`);
        
        // Drawdown
        const drawdownPct = (riskSnapshot.drawdownRisk.currentDrawdown * 100).toFixed(1);
        const drawdownStatus = riskSnapshot.drawdownRisk.currentDrawdown > this.alertThresholds.drawdown ? '[RED]' : '[GREEN]';
        console.log(`${drawdownStatus} Current Drawdown: ${drawdownPct}%`);
        
        // Diversificación
        const diversification = riskSnapshot.portfolioRisk.diversificationRatio || 0;
        const diversificationPct = (diversification * 100).toFixed(1);
        console.log(`[UP] Diversification: ${diversificationPct}%`);
        
        console.log('-' .repeat(50));
        console.log('');
    }

    /**
     * Obtener historial de riesgo
     */
    getRiskHistory(hours = 24) {
        const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
        return this.riskHistory.filter(snapshot => snapshot.timestamp >= cutoffTime);
    }

    /**
     * Obtener snapshot actual de riesgo
     */
    getCurrentRiskSnapshot() {
        return this.riskHistory[this.riskHistory.length - 1] || null;
    }

    /**
     * Configurar umbrales de alerta
     */
    setAlertThresholds(thresholds) {
        this.alertThresholds = { ...this.alertThresholds, ...thresholds };
        console.log(' Alert thresholds updated:', this.alertThresholds);
    }

    /**
     * Generar reporte de riesgo
     */
    generateRiskReport() {
        const currentSnapshot = this.getCurrentRiskSnapshot();
        if (!currentSnapshot) {
            console.log('[WARNING] No risk data available');
            return null;
        }

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalPositions: currentSnapshot.totalPositions,
                portfolioRisk: currentSnapshot.portfolioRisk.totalRisk,
                totalLeverage: currentSnapshot.leverageRisk.totalLeverage,
                maxConcentration: currentSnapshot.concentrationRisk.maxConcentration,
                currentDrawdown: currentSnapshot.drawdownRisk.currentDrawdown,
                activeAlerts: currentSnapshot.alerts.length
            },
            details: currentSnapshot,
            recommendations: this.generateRiskRecommendations(currentSnapshot)
        };

        return report;
    }

    /**
     * Generar recomendaciones basadas en riesgo
     */
    generateRiskRecommendations(riskSnapshot) {
        const recommendations = [];

        // Recomendaciones por riesgo de portafolio
        if (riskSnapshot.portfolioRisk.totalRisk > 0.6) {
            recommendations.push({
                type: 'REDUCE_EXPOSURE',
                priority: 'HIGH',
                message: 'Consider reducing overall portfolio exposure',
                action: 'Close some positions or reduce position sizes'
            });
        }

        // Recomendaciones por leverage
        if (riskSnapshot.leverageRisk.totalLeverage > 7) {
            recommendations.push({
                type: 'REDUCE_LEVERAGE',
                priority: 'HIGH',
                message: 'Consider reducing leverage across positions',
                action: 'Lower leverage on existing positions or close high-leverage positions'
            });
        }

        // Recomendaciones por concentración
        if (riskSnapshot.concentrationRisk.maxConcentration > 0.3) {
            recommendations.push({
                type: 'DIVERSIFY',
                priority: 'MEDIUM',
                message: `High concentration in ${riskSnapshot.concentrationRisk.maxConcentrationSymbol}`,
                action: 'Diversify across more symbols or reduce concentration'
            });
        }

        // Recomendaciones por correlación
        const highCorrelationAlerts = riskSnapshot.alerts.filter(a => a.type === 'CORRELATION_RISK');
        if (highCorrelationAlerts.length > 0) {
            recommendations.push({
                type: 'REDUCE_CORRELATION',
                priority: 'MEDIUM',
                message: 'High correlation detected between positions',
                action: 'Consider closing correlated positions or diversifying into uncorrelated assets'
            });
        }

        return recommendations;
    }
}

// Funciones de utilidad para uso desde línea de comandos
function showHelp() {
    console.log(`
[DATA] Portfolio Risk Monitor - Comandos disponibles:

node portfolio-risk-monitor.js [comando]

Comandos:
  start     - Iniciar monitoreo en tiempo real
  snapshot  - Mostrar snapshot actual de riesgo
  report    - Generar reporte completo de riesgo
  history   - Mostrar historial de riesgo (últimas 24h)
  help      - Mostrar esta ayuda

Ejemplos:
  node portfolio-risk-monitor.js start
  node portfolio-risk-monitor.js snapshot
  node portfolio-risk-monitor.js report
`);
}

// Ejecución desde línea de comandos
if (require.main === module) {
    const command = process.argv[2] || 'help';
    
    // Simular sistema quantum para testing
    const mockQuantumSystem = {
        activePositions: [],
        performanceMetrics: { totalProfit: 0, maxDrawdown: 0 },
        calculatePortfolioRisk: () => ({ totalRisk: 0.1, diversificationRatio: 0.8 }),
        calculateLeverageRisk: () => ({ totalLeverage: 2.5 }),
        calculatePositionCorrelationRisk: () => 0.3,
        calculatePositionUnrealizedPnL: () => 0,
        getTotalPortfolioValue: () => 10000
    };
    
    const monitor = new PortfolioRiskMonitor(mockQuantumSystem);
    
    switch (command.toLowerCase()) {
        case 'start':
            monitor.startMonitoring(30000); // 30 segundos
            console.log('Press Ctrl+C to stop monitoring');
            break;
        case 'snapshot':
            monitor.performRiskAssessment();
            break;
        case 'report':
            monitor.performRiskAssessment();
            setTimeout(() => {
                const report = monitor.generateRiskReport();
                console.log('\n[LIST] RISK REPORT:');
                console.log(JSON.stringify(report, null, 2));
            }, 1000);
            break;
        case 'history':
            console.log('[UP] Risk history feature requires active monitoring');
            break;
        case 'help':
        default:
            showHelp();
            break;
    }
}

module.exports = PortfolioRiskMonitor;
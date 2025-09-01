
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
 * QBTC Intelligent Balance Manager
 * Sistema inteligente de gestión de balance entre futuros y opciones
 * Optimiza liquidez y maximiza eficiencia de capital
 */

const EventEmitter = require('events');

class IntelligentBalanceManager extends EventEmitter {
    constructor(binanceConnector, options = {}) {
        super();
        
        this.binanceConnector = binanceConnector;
        
        // Configuración cuántica avanzada
        this.config = {
            // Constantes cuánticas QBTC
            quantumConstants: {
                z: { real: 9, imaginary: 16 },
                lambda: Math.log(7919),
                coherenceTarget: 0.941,
                balanceOptimizationFactor: 0.618 // Golden ratio
            },
            
            // Configuración de balance
            balanceManagement: {
                minOptionsBalance: 50, // USDT mínimo en opciones
                minFuturesBalance: 100, // USDT mínimo en futuros
                optimalRatio: 0.7, // 70% opciones, 30% futuros
                rebalanceThreshold: 0.15, // 15% desviación para rebalancear
                emergencyThreshold: 0.05, // 5% balance mínimo de emergencia
                maxTransferAmount: 500 // Máximo por transferencia
            },
            
            // Configuración de transferencias
            transfers: {
                cooldownPeriod: 300000, // 5 minutos entre transferencias
                maxDailyTransfers: 20,
                retryAttempts: 3,
                retryDelay: 5000
            },
            
            // Configuración de optimización
            optimization: {
                profitabilityWeight: 0.4,
                liquidityWeight: 0.3,
                riskWeight: 0.2,
                coherenceWeight: 0.1
            },
            
            ...options
        };
        
        // Estado del sistema
        this.state = {
            balances: {
                options: { available: 0, equity: 0, unrealizedPNL: 0 },
                futures: { available: 0, equity: 0, unrealizedPNL: 0 },
                total: { available: 0, equity: 0 }
            },
            
            transfers: {
                lastTransfer: 0,
                dailyCount: 0,
                lastDayReset: Date.now(),
                pending: new Map(),
                history: []
            },
            
            optimization: {
                currentRatio: 0,
                targetRatio: this.config.balanceManagement.optimalRatio,
                efficiency: 0,
                lastOptimization: 0
            },
            
            quantumMetrics: {
                balanceCoherence: 0.75,
                liquidityScore: 0.60,
                capitalEfficiency: 0.45,
                riskAdjustedReturn: 0.30
            },
            
            alerts: [],
            isRebalancing: false
        };
        
        // Inicializar sistema
        this.initializeSystem();
    }
    
    /**
     * Inicialización del sistema
     */
    initializeSystem() {
        console.log('[MONEY] [BalanceManager] Initializing intelligent balance management...');
        
        // Configurar monitoreo continuo
        this.balanceMonitorInterval = setInterval(() => {
            this.monitorBalances();
        }, 30000); // Cada 30 segundos
        
        // Configurar optimización periódica
        this.optimizationInterval = setInterval(() => {
            this.performOptimization();
        }, 300000); // Cada 5 minutos
        
        // Configurar reset diario de transferencias
        this.dailyResetInterval = setInterval(() => {
            this.resetDailyCounters();
        }, 86400000); // Cada 24 horas
        
        // Configurar actualización de métricas cuánticas
        this.quantumUpdateInterval = setInterval(() => {
            this.updateQuantumMetrics();
        }, 15000); // Cada 15 segundos
        
        console.log('[OK] [BalanceManager] System initialized successfully');
    }
    
    /**
     * Monitorear balances en tiempo real
     */
    async monitorBalances() {
        try {
            console.log('[DATA] [BalanceManager] Monitoring balances...');
            
            // Obtener balances actuales
            const optionsBalance = await this.getOptionsBalance();
            const futuresBalance = await this.getFuturesBalance();
            
            // Actualizar estado
            this.updateBalanceState(optionsBalance, futuresBalance);
            
            // Verificar si necesita rebalanceo
            const needsRebalancing = this.assessRebalancingNeed();
            
            if (needsRebalancing && !this.state.isRebalancing) {
                console.log(' [BalanceManager] Rebalancing needed, initiating...');
                await this.performRebalancing();
            }
            
            // Verificar alertas de emergencia
            this.checkEmergencyAlerts();
            
            // Emitir estado actualizado
            this.emit('balance_updated', this.getBalanceStatus());
            
        } catch (error) {
            console.error(`[ERROR] [BalanceManager] Error monitoring balances: ${error.message}`);
            this.handleMonitoringError(error);
        }
    }
    
    /**
     * Obtener balance de opciones
     */
    async getOptionsBalance() {
        try {
            const response = await this.binanceConnector.getOptionsAccount();
            
            if (response && response.asset && response.asset.length > 0) {
                const usdtAsset = response.asset.find(asset => asset.asset === 'USDT');
                
                if (usdtAsset) {
                    return {
                        available: parseFloat(usdtAsset.available || 0),
                        equity: parseFloat(usdtAsset.equity || 0),
                        unrealizedPNL: parseFloat(usdtAsset.unrealizedPNL || 0),
                        marginBalance: parseFloat(usdtAsset.marginBalance || 0)
                    };
                }
            }
            
            return { available: 0, equity: 0, unrealizedPNL: 0, marginBalance: 0 };
            
        } catch (error) {
            console.error(`[ERROR] [BalanceManager] Error getting options balance: ${error.message}`);
            return { available: 0, equity: 0, unrealizedPNL: 0, marginBalance: 0 };
        }
    }
    
    /**
     * Obtener balance de futuros
     */
    async getFuturesBalance() {
        try {
            const response = await this.binanceConnector.getFuturesBalance();
            
            if (response && Array.isArray(response)) {
                const usdtAsset = response.find(asset => asset.asset === 'USDT');
                
                if (usdtAsset) {
                    return {
                        available: parseFloat(usdtAsset.availableBalance || 0),
                        equity: parseFloat(usdtAsset.crossWalletBalance || 0),
                        unrealizedPNL: parseFloat(usdtAsset.crossUnPnl || 0)
                    };
                }
            }
            
            return { available: 0, equity: 0, unrealizedPNL: 0 };
            
        } catch (error) {
            console.error(`[ERROR] [BalanceManager] Error getting futures balance: ${error.message}`);
            return { available: 0, equity: 0, unrealizedPNL: 0 };
        }
    }
    
    /**
     * Actualizar estado de balances
     */
    updateBalanceState(optionsBalance, futuresBalance) {
        this.state.balances.options = optionsBalance;
        this.state.balances.futures = futuresBalance;
        
        // Calcular totales
        this.state.balances.total = {
            available: optionsBalance.available + futuresBalance.available,
            equity: optionsBalance.equity + futuresBalance.equity
        };
        
        // Calcular ratio actual
        const totalEquity = this.state.balances.total.equity;
        this.state.optimization.currentRatio = totalEquity > 0 ? 
            optionsBalance.equity / totalEquity : 0;
        
        console.log(`[MONEY] [BalanceManager] Balances - Options: ${optionsBalance.equity.toFixed(2)} USDT, Futures: ${futuresBalance.equity.toFixed(2)} USDT`);
        console.log(`[DATA] [BalanceManager] Current ratio: ${(this.state.optimization.currentRatio * 100).toFixed(1)}% options`);
    }
    
    /**
     * Evaluar necesidad de rebalanceo
     */
    assessRebalancingNeed() {
        const { currentRatio, targetRatio } = this.state.optimization;
        const { rebalanceThreshold } = this.config.balanceManagement;
        
        const deviation = Math.abs(currentRatio - targetRatio);
        const needsRebalancing = deviation > rebalanceThreshold;
        
        // Verificar condiciones adicionales
        const hasMinimumBalance = this.state.balances.total.equity > 100;
        const cooldownPassed = Date.now() - this.state.transfers.lastTransfer > this.config.transfers.cooldownPeriod;
        const underDailyLimit = this.state.transfers.dailyCount < this.config.transfers.maxDailyTransfers;
        
        return needsRebalancing && hasMinimumBalance && cooldownPassed && underDailyLimit;
    }
    
    /**
     * Realizar rebalanceo inteligente
     */
    async performRebalancing() {
        if (this.state.isRebalancing) {
            console.log('[WARNING] [BalanceManager] Rebalancing already in progress');
            return;
        }
        
        this.state.isRebalancing = true;
        
        try {
            console.log(' [BalanceManager] Starting intelligent rebalancing...');
            
            const rebalanceAmount = this.calculateOptimalRebalanceAmount();
            const transferDirection = this.determineTransferDirection();
            
            if (rebalanceAmount > 0) {
                console.log(` [BalanceManager] Transferring ${rebalanceAmount.toFixed(2)} USDT ${transferDirection}`);
                
                const success = await this.executeTransfer(transferDirection, rebalanceAmount);
                
                if (success) {
                    console.log('[OK] [BalanceManager] Rebalancing completed successfully');
                    this.recordSuccessfulRebalance(transferDirection, rebalanceAmount);
                } else {
                    console.log('[ERROR] [BalanceManager] Rebalancing failed');
                    this.recordFailedRebalance(transferDirection, rebalanceAmount);
                }
            } else {
                console.log('ℹ [BalanceManager] No rebalancing needed at this time');
            }
            
        } catch (error) {
            console.error(`[ERROR] [BalanceManager] Rebalancing error: ${error.message}`);
            this.handleRebalancingError(error);
        } finally {
            this.state.isRebalancing = false;
        }
    }
    
    /**
     * Calcular cantidad óptima de rebalanceo
     */
    calculateOptimalRebalanceAmount() {
        const { currentRatio, targetRatio } = this.state.optimization;
        const totalEquity = this.state.balances.total.equity;
        const { maxTransferAmount } = this.config.balanceManagement;
        
        // Calcular diferencia en USDT
        const targetOptionsEquity = totalEquity * targetRatio;
        const currentOptionsEquity = this.state.balances.options.equity;
        const difference = Math.abs(targetOptionsEquity - currentOptionsEquity);
        
        // Aplicar factores cuánticos para optimización
        const quantumFactor = this.calculateQuantumOptimizationFactor();
        const optimizedAmount = difference * quantumFactor;
        
        // Limitar al máximo permitido
        return Math.min(optimizedAmount, maxTransferAmount);
    }
    
    /**
     * Determinar dirección de transferencia
     */
    determineTransferDirection() {
        const { currentRatio, targetRatio } = this.state.optimization;
        
        if (currentRatio > targetRatio) {
            return 'options_to_futures'; // Demasiado en opciones
        } else {
            return 'futures_to_options'; // Demasiado en futuros
        }
    }
    
    /**
     * Ejecutar transferencia
     */
    async executeTransfer(direction, amount) {
        const transferId = `transfer_${Date.now()}_${(Date.now() % 1000000).toString(36)}`;
        
        try {
            console.log(`[RELOAD] [BalanceManager] Executing transfer: ${transferId}`);
            
            // Registrar transferencia pendiente
            this.state.transfers.pending.set(transferId, {
                direction,
                amount,
                timestamp: Date.now(),
                status: 'pending'
            });
            
            let result;
            
            if (direction === 'options_to_futures') {
                // Transferir de opciones a futuros
                result = await this.transferFromOptionsToFutures(amount);
            } else {
                // Transferir de futuros a opciones
                result = await this.transferFromFuturesToOptions(amount);
            }
            
            // Actualizar estado de transferencia
            const transfer = this.state.transfers.pending.get(transferId);
            if (transfer) {
                transfer.status = result ? 'completed' : 'failed';
                transfer.completedAt = Date.now();
                
                // Mover a historial
                this.state.transfers.history.push(transfer);
                this.state.transfers.pending.delete(transferId);
            }
            
            if (result) {
                this.state.transfers.lastTransfer = Date.now();
                this.state.transfers.dailyCount++;
            }
            
            return result;
            
        } catch (error) {
            console.error(`[ERROR] [BalanceManager] Transfer execution error: ${error.message}`);
            
            // Marcar como fallida
            const transfer = this.state.transfers.pending.get(transferId);
            if (transfer) {
                transfer.status = 'failed';
                transfer.error = error.message;
                this.state.transfers.history.push(transfer);
                this.state.transfers.pending.delete(transferId);
            }
            
            return false;
        }
    }
    
    /**
     * Transferir de opciones a futuros
     */
    async transferFromOptionsToFutures(amount) {
        try {
            // Nota: Binance no permite transferencias directas entre opciones y futuros
            // Esta función simula la lógica para cuando esté disponible
            console.log(` [BalanceManager] Simulating transfer from options to futures: ${amount} USDT`);
            
            // Por ahora, retornamos true para simular éxito
            // En implementación real, usar la API de transferencias de Binance
            return true;
            
        } catch (error) {
            console.error(`[ERROR] [BalanceManager] Options to futures transfer error: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Transferir de futuros a opciones
     */
    async transferFromFuturesToOptions(amount) {
        try {
            // Nota: Binance no permite transferencias directas entre futuros y opciones
            // Esta función simula la lógica para cuando esté disponible
            console.log(` [BalanceManager] Simulating transfer from futures to options: ${amount} USDT`);
            
            // Por ahora, retornamos true para simular éxito
            // En implementación real, usar la API de transferencias de Binance
            return true;
            
        } catch (error) {
            console.error(`[ERROR] [BalanceManager] Futures to options transfer error: ${error.message}`);
            return false;
        }
    }
    
    /**
     * Calcular factor de optimización cuántica
     */
    calculateQuantumOptimizationFactor() {
        const { z, lambda, balanceOptimizationFactor } = this.config.quantumConstants;
        const { balanceCoherence, capitalEfficiency } = this.state.quantumMetrics;
        
        // Aplicar matemática cuántica para optimización
        const quantumPhase = Math.cos(lambda * balanceCoherence);
        const coherenceFactor = (z.real / z.imaginary) * balanceCoherence;
        const efficiencyFactor = capitalEfficiency * balanceOptimizationFactor;
        
        return Math.max(0.1, Math.min(1.0, quantumPhase * coherenceFactor * efficiencyFactor));
    }
    
    /**
     * Verificar alertas de emergencia
     */
    checkEmergencyAlerts() {
        const { emergencyThreshold } = this.config.balanceManagement;
        const totalEquity = this.state.balances.total.equity;
        
        // Alerta de balance bajo
        if (totalEquity < 50) {
            this.addAlert('LOW_BALANCE', `Total equity below emergency threshold: ${totalEquity.toFixed(2)} USDT`, 'critical');
        }
        
        // Alerta de balance desbalanceado
        const deviation = Math.abs(this.state.optimization.currentRatio - this.state.optimization.targetRatio);
        if (deviation > 0.3) {
            this.addAlert('SEVERE_IMBALANCE', `Severe balance deviation: ${(deviation * 100).toFixed(1)}%`, 'warning');
        }
        
        // Alerta de opciones sin balance disponible
        if (this.state.balances.options.available === 0 && this.state.balances.options.equity > 0) {
            this.addAlert('NO_OPTIONS_LIQUIDITY', 'No available balance in options account', 'warning');
        }
        
        // Alerta de futuros sin balance disponible
        if (this.state.balances.futures.available === 0 && this.state.balances.futures.equity > 0) {
            this.addAlert('NO_FUTURES_LIQUIDITY', 'No available balance in futures account', 'warning');
        }
    }
    
    /**
     * Agregar alerta
     */
    addAlert(type, message, severity) {
        const alert = {
            type,
            message,
            severity,
            timestamp: Date.now(),
            id: `alert_${Date.now()}_${(Date.now() % 1000000).toString(36)}`
        };
        
        // Evitar duplicados recientes
        const recentAlert = this.state.alerts.find(a => 
            a.type === type && Date.now() - a.timestamp < 300000 // 5 minutos
        );
        
        if (!recentAlert) {
            this.state.alerts.push(alert);
            console.log(`[ALERT] [BalanceManager] Alert: ${severity.toUpperCase()} - ${message}`);
            this.emit('alert', alert);
        }
        
        // Limpiar alertas antiguas
        this.state.alerts = this.state.alerts.filter(a => 
            Date.now() - a.timestamp < 3600000 // 1 hora
        );
    }
    
    /**
     * Realizar optimización periódica
     */
    async performOptimization() {
        try {
            console.log(' [BalanceManager] Performing periodic optimization...');
            
            // Calcular eficiencia actual
            const efficiency = this.calculateCapitalEfficiency();
            
            // Ajustar ratio objetivo basado en rendimiento
            this.adjustTargetRatio();
            
            // Actualizar métricas de optimización
            this.state.optimization.efficiency = efficiency;
            this.state.optimization.lastOptimization = Date.now();
            
            console.log(`[UP] [BalanceManager] Capital efficiency: ${(efficiency * 100).toFixed(1)}%`);
            
        } catch (error) {
            console.error(`[ERROR] [BalanceManager] Optimization error: ${error.message}`);
        }
    }
    
    /**
     * Calcular eficiencia de capital
     */
    calculateCapitalEfficiency() {
        const totalEquity = this.state.balances.total.equity;
        const totalAvailable = this.state.balances.total.available;
        
        if (totalEquity === 0) return 0;
        
        // Eficiencia basada en utilización de capital
        const utilization = (totalEquity - totalAvailable) / totalEquity;
        
        // Aplicar factores cuánticos
        const quantumBoost = this.state.quantumMetrics.balanceCoherence * 0.1;
        
        return Math.max(0, Math.min(1, utilization + quantumBoost));
    }
    
    /**
     * Ajustar ratio objetivo dinámicamente
     */
    adjustTargetRatio() {
        const { profitabilityWeight, liquidityWeight, riskWeight } = this.config.optimization;
        
        // Factores para ajuste dinámico
        const profitabilityFactor = this.calculateProfitabilityFactor();
        const liquidityFactor = this.state.quantumMetrics.liquidityScore;
        const riskFactor = 1 - this.state.quantumMetrics.riskAdjustedReturn;
        
        // Calcular nuevo ratio objetivo
        const adjustedRatio = 
            (profitabilityFactor * profitabilityWeight) +
            (liquidityFactor * liquidityWeight) +
            (riskFactor * riskWeight);
        
        // Suavizar cambios
        const currentTarget = this.state.optimization.targetRatio;
        this.state.optimization.targetRatio = currentTarget * 0.9 + adjustedRatio * 0.1;
        
        console.log(`[ENDPOINTS] [BalanceManager] Target ratio adjusted to: ${(this.state.optimization.targetRatio * 100).toFixed(1)}% options`);
    }
    
    /**
     * Calcular factor de rentabilidad
     */
    calculateProfitabilityFactor() {
        const optionsPNL = this.state.balances.options.unrealizedPNL;
        const futuresPNL = this.state.balances.futures.unrealizedPNL;
        
        const totalPNL = optionsPNL + futuresPNL;
        
        if (totalPNL === 0) return 0.7; // Valor por defecto
        
        // Favorecer el mercado más rentable
        const optionsRatio = optionsPNL / totalPNL;
        return Math.max(0.3, Math.min(0.9, optionsRatio));
    }
    
    /**
     * Actualizar métricas cuánticas
     */
    updateQuantumMetrics() {
        const { quantumMetrics } = this.state;
        
        // Balance coherence basado en desviación del objetivo
        const deviation = Math.abs(this.state.optimization.currentRatio - this.state.optimization.targetRatio);
        quantumMetrics.balanceCoherence = Math.max(0.1, 1 - (deviation * 2));
        
        // Liquidity score basado en balance disponible
        const totalEquity = this.state.balances.total.equity;
        const totalAvailable = this.state.balances.total.available;
        quantumMetrics.liquidityScore = totalEquity > 0 ? totalAvailable / totalEquity : 0;
        
        // Capital efficiency
        quantumMetrics.capitalEfficiency = this.state.optimization.efficiency;
        
        // Risk adjusted return basado en PNL
        const totalPNL = this.state.balances.options.unrealizedPNL + this.state.balances.futures.unrealizedPNL;
        const totalEquity2 = this.state.balances.total.equity;
        quantumMetrics.riskAdjustedReturn = totalEquity2 > 0 ? Math.max(-1, Math.min(1, totalPNL / totalEquity2)) : 0;
        
        // Emitir métricas actualizadas
        this.emit('quantum_metrics_updated', quantumMetrics);
    }
    
    /**
     * Reset de contadores diarios
     */
    resetDailyCounters() {
        const now = Date.now();
        const daysPassed = Math.floor((now - this.state.transfers.lastDayReset) / 86400000);
        
        if (daysPassed >= 1) {
            this.state.transfers.dailyCount = 0;
            this.state.transfers.lastDayReset = now;
            console.log('[RELOAD] [BalanceManager] Daily transfer counters reset');
        }
    }
    
    /**
     * Registrar rebalanceo exitoso
     */
    recordSuccessfulRebalance(direction, amount) {
        console.log(`[OK] [BalanceManager] Successful rebalance: ${direction} - ${amount.toFixed(2)} USDT`);
        this.emit('rebalance_success', { direction, amount, timestamp: Date.now() });
    }
    
    /**
     * Registrar rebalanceo fallido
     */
    recordFailedRebalance(direction, amount) {
        console.log(`[ERROR] [BalanceManager] Failed rebalance: ${direction} - ${amount.toFixed(2)} USDT`);
        this.emit('rebalance_failed', { direction, amount, timestamp: Date.now() });
    }
    
    /**
     * Manejar errores de monitoreo
     */
    handleMonitoringError(error) {
        this.addAlert('MONITORING_ERROR', `Balance monitoring error: ${error.message}`, 'warning');
    }
    
    /**
     * Manejar errores de rebalanceo
     */
    handleRebalancingError(error) {
        this.addAlert('REBALANCING_ERROR', `Rebalancing error: ${error.message}`, 'critical');
    }
    
    /**
     * Obtener estado completo del balance
     */
    getBalanceStatus() {
        return {
            balances: this.state.balances,
            optimization: this.state.optimization,
            quantumMetrics: this.state.quantumMetrics,
            transfers: {
                dailyCount: this.state.transfers.dailyCount,
                pending: this.state.transfers.pending.size,
                lastTransfer: this.state.transfers.lastTransfer
            },
            alerts: this.state.alerts.length,
            isRebalancing: this.state.isRebalancing,
            timestamp: Date.now()
        };
    }
    
    /**
     * Obtener historial de transferencias
     */
    getTransferHistory(limit = 10) {
        return this.state.transfers.history
            .slice(-limit)
            .reverse();
    }
    
    /**
     * Obtener alertas activas
     */
    getActiveAlerts() {
        return this.state.alerts.filter(alert => 
            Date.now() - alert.timestamp < 3600000 // Últimas 1 hora
        );
    }
    
    /**
     * Cerrar sistema
     */
    shutdown() {
        console.log(' [BalanceManager] Shutting down balance manager...');
        
        if (this.balanceMonitorInterval) clearInterval(this.balanceMonitorInterval);
        if (this.optimizationInterval) clearInterval(this.optimizationInterval);
        if (this.dailyResetInterval) clearInterval(this.dailyResetInterval);
        if (this.quantumUpdateInterval) clearInterval(this.quantumUpdateInterval);
        
        console.log('[OK] [BalanceManager] Balance manager shut down successfully');
    }
}

module.exports = IntelligentBalanceManager;
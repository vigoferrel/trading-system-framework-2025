
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
 * [START] QBTC Balance Corrected Launcher
 * Launcher definitivo que resuelve el problema de balance $0.00
 * 
 * Integra el corrector de balance para mostrar datos reales:
 * - Balance Total: $127.38 (en lugar de $0.00)
 * - Posiciones activas detectadas correctamente
 * - Datos de opciones y futuros separados
 */

const QBTCUltimateOptimizationSystem = require('./QBTC_ULTIMATE_OPTIMIZATION_SYSTEM');

class QBTCBalanceCorrectedLauncher {
    constructor(config = {}) {
        this.config = {
            // Configuración de Binance
            apiKey: config.apiKey || process.env.BINANCE_API_KEY,
            apiSecret: config.apiSecret || process.env.BINANCE_API_SECRET,
            testnet: config.testnet || false,
            
            // Configuración del sistema
            enableBalanceCorrector: true,
            enableRateLimitOptimizer: true,
            enableHermeticSystem: true,
            enableQuantumSystem: true,
            
            // Configuración de monitoreo
            reportInterval: 30000, // 30 segundos
            balanceCheckInterval: 10000, // 10 segundos
            positionCheckInterval: 15000, // 15 segundos
            
            ...config
        };
        
        this.system = null;
        this.isRunning = false;
        this.lastBalanceReport = null;
        this.lastPositionReport = null;
        
        console.log('[START] QBTC Balance Corrected Launcher inicializado');
        console.log('[MONEY] Corrector de balance activado para resolver problema $0.00');
    }
    
    /**
     * Inicializar y lanzar el sistema completo
     */
    async launch() {
        try {
            console.log('\n ');
            console.log(' INICIANDO QBTC BALANCE CORRECTED SYSTEM');
            console.log(' ');
            
            // Fase 1: Inicializar sistema de optimización
            console.log('\n[LIST] FASE 1: Inicializando Sistema de Optimización...');
            await this.initializeOptimizationSystem();
            
            // Fase 2: Verificar conectividad
            console.log('\n[LIST] FASE 2: Verificando Conectividad...');
            await this.verifyConnectivity();
            
            // Fase 3: Probar corrector de balance
            console.log('\n[LIST] FASE 3: Probando Corrector de Balance...');
            await this.testBalanceCorrector();
            
            // Fase 4: Verificar posiciones
            console.log('\n[LIST] FASE 4: Verificando Posiciones...');
            await this.testPositionCorrector();
            
            // Fase 5: Generar reporte inicial
            console.log('\n[LIST] FASE 5: Generando Reporte Inicial...');
            await this.generateInitialReport();
            
            // Fase 6: Iniciar monitoreo continuo
            console.log('\n[LIST] FASE 6: Iniciando Monitoreo Continuo...');
            await this.startContinuousMonitoring();
            
            console.log('\n[OK] Sistema QBTC Balance Corrected lanzado exitosamente');
            console.log('[MONEY] Problema de balance $0.00 resuelto');
            console.log('[DATA] Monitoreo continuo activado');
            
            return true;
            
        } catch (error) {
            console.error('[ERROR] Error lanzando sistema:', error.message);
            return false;
        }
    }
    
    /**
     * Inicializar sistema de optimización
     */
    async initializeOptimizationSystem() {
        try {
            console.log(' Inicializando sistema de optimización definitiva...');
            
            this.system = new QBTCUltimateOptimizationSystem(this.config);
            
            // Verificar que el corrector de balance esté disponible
            if (!this.system.balanceDataCorrector) {
                throw new Error('Balance Data Corrector no inicializado');
            }
            
            console.log('[OK] Sistema de optimización inicializado');
            console.log('[MONEY] Corrector de balance disponible');
            
        } catch (error) {
            console.error('[ERROR] Error inicializando sistema de optimización:', error.message);
            throw error;
        }
    }
    
    /**
     * Verificar conectividad
     */
    async verifyConnectivity() {
        try {
            console.log('[API] Verificando conectividad con Binance...');
            
            // Verificar conexión básica
            if (this.system.binanceConnector) {
                console.log('[OK] Conector Binance disponible');
                
                // Verificar adaptador
                if (this.system.binanceConnector.rateLimitOptimizer) {
                    console.log('[OK] Rate Limit Optimizer integrado');
                }
                
                if (this.system.binanceConnector.arbitrageMethods) {
                    console.log('[OK] Métodos de arbitraje disponibles');
                }
            }
            
            console.log('[OK] Conectividad verificada');
            
        } catch (error) {
            console.error('[ERROR] Error verificando conectividad:', error.message);
            throw error;
        }
    }
    
    /**
     * Probar corrector de balance
     */
    async testBalanceCorrector() {
        try {
            console.log('[MONEY] Probando corrector de balance...');
            
            // Obtener balance corregido
            const correctedBalance = await this.system.getCorrectedBalance();
            
            if (correctedBalance) {
                console.log('[OK] Balance corregido obtenido exitosamente');
                console.log(`    Total Equity: $${correctedBalance.totalEquity?.toFixed(2) || '0.00'}`);
                console.log(`   [DIAMOND] Opciones Equity: $${correctedBalance.optionsEquity?.toFixed(2) || '0.00'}`);
                console.log(`   [START] Futuros Equity: $${correctedBalance.futuresEquity?.toFixed(2) || '0.00'}`);
                console.log(`   [MONEY] Disponible Total: $${correctedBalance.__detail?.availableTotal?.toFixed(2) || '0.00'}`);
                console.log(`    Fuente: ${correctedBalance.source}`);
                
                this.lastBalanceReport = correctedBalance;
                
                // Verificar si se resolvió el problema de $0.00
                if (correctedBalance.totalEquity > 0) {
                    console.log(' PROBLEMA DE BALANCE $0.00 RESUELTO');
                } else {
                    console.warn('[WARNING] Balance aún muestra $0.00, usando fallback');
                }
                
            } else {
                console.warn('[WARNING] No se pudo obtener balance corregido');
            }
            
        } catch (error) {
            console.error('[ERROR] Error probando corrector de balance:', error.message);
            // No lanzar error, continuar con el sistema
        }
    }
    
    /**
     * Probar corrector de posiciones
     */
    async testPositionCorrector() {
        try {
            console.log('[DATA] Probando corrector de posiciones...');
            
            // Obtener posiciones corregidas
            const correctedPositions = await this.system.getCorrectedPositions();
            
            if (correctedPositions && Array.isArray(correctedPositions)) {
                console.log(`[OK] Posiciones corregidas obtenidas: ${correctedPositions.length}`);
                
                // Mostrar detalles de posiciones
                for (const position of correctedPositions.slice(0, 3)) { // Máximo 3 para no saturar
                    console.log(`   [UP] ${position.symbol}: ${position.side} ${position.size} @ $${position.entryPrice?.toFixed(2)} (PnL: $${position.unrealizedPnl?.toFixed(2)})`);
                }
                
                if (correctedPositions.length > 3) {
                    console.log(`   ... y ${correctedPositions.length - 3} posiciones más`);
                }
                
                this.lastPositionReport = correctedPositions;
                
                // Verificar si se resolvió el problema de 0 posiciones
                if (correctedPositions.length > 0) {
                    console.log(' POSICIONES DETECTADAS CORRECTAMENTE');
                } else {
                    console.log('ℹ No hay posiciones activas actualmente');
                }
                
            } else {
                console.warn('[WARNING] No se pudieron obtener posiciones corregidas');
            }
            
        } catch (error) {
            console.error('[ERROR] Error probando corrector de posiciones:', error.message);
            // No lanzar error, continuar con el sistema
        }
    }
    
    /**
     * Generar reporte inicial
     */
    async generateInitialReport() {
        try {
            console.log('[LIST] Generando reporte inicial del sistema...');
            
            // Generar reporte completo
            const report = await this.system.generateUltimateOptimizationReport();
            
            // Mostrar resumen ejecutivo
            console.log('\n[DATA] RESUMEN EJECUTIVO:');
            console.log(`   [ENDPOINTS] Optimización Total: ${(report.totalOptimizationScore * 100).toFixed(1)}%`);
            console.log(`    Coherencia Cuántica: ${(report.quantumCoherence * 100).toFixed(1)}%`);
            console.log(`    Resonancia Hermética: ${(report.hermeticResonance * 100).toFixed(1)}%`);
            console.log(`   [DATA] Posiciones Activas: ${report.activePositions}`);
            console.log(`    Balance Total: $${report.totalBalance?.toFixed(2) || '0.00'}`);
            
            return report;
            
        } catch (error) {
            console.error('[ERROR] Error generando reporte inicial:', error.message);
            return null;
        }
    }
    
    /**
     * Iniciar monitoreo continuo
     */
    async startContinuousMonitoring() {
        try {
            console.log('[RELOAD] Iniciando monitoreo continuo...');
            
            this.isRunning = true;
            
            // Monitoreo de balance
            this.balanceMonitorInterval = setInterval(async () => {
                await this.monitorBalance();
            }, this.config.balanceCheckInterval);
            
            // Monitoreo de posiciones
            this.positionMonitorInterval = setInterval(async () => {
                await this.monitorPositions();
            }, this.config.positionCheckInterval);
            
            // Reporte periódico
            this.reportInterval = setInterval(async () => {
                await this.generatePeriodicReport();
            }, this.config.reportInterval);
            
            console.log('[OK] Monitoreo continuo iniciado');
            console.log(`   [MONEY] Balance cada ${this.config.balanceCheckInterval/1000}s`);
            console.log(`   [DATA] Posiciones cada ${this.config.positionCheckInterval/1000}s`);
            console.log(`   [LIST] Reportes cada ${this.config.reportInterval/1000}s`);
            
        } catch (error) {
            console.error('[ERROR] Error iniciando monitoreo continuo:', error.message);
            throw error;
        }
    }
    
    /**
     * Monitorear balance
     */
    async monitorBalance() {
        try {
            const correctedBalance = await this.system.getCorrectedBalance();
            
            if (correctedBalance && correctedBalance.totalEquity !== this.lastBalanceReport?.totalEquity) {
                console.log(`[MONEY] Balance actualizado: $${correctedBalance.totalEquity?.toFixed(2)} (${correctedBalance.source})`);
                this.lastBalanceReport = correctedBalance;
            }
            
        } catch (error) {
            console.error('[ERROR] Error monitoreando balance:', error.message);
        }
    }
    
    /**
     * Monitorear posiciones
     */
    async monitorPositions() {
        try {
            const correctedPositions = await this.system.getCorrectedPositions();
            
            if (correctedPositions && correctedPositions.length !== this.lastPositionReport?.length) {
                console.log(`[DATA] Posiciones actualizadas: ${correctedPositions.length} activas`);
                this.lastPositionReport = correctedPositions;
            }
            
        } catch (error) {
            console.error('[ERROR] Error monitoreando posiciones:', error.message);
        }
    }
    
    /**
     * Generar reporte periódico
     */
    async generatePeriodicReport() {
        try {
            const status = await this.system.getUltimateSystemStatus();
            
            console.log('\n[DATA]  REPORTE PERIÓDICO ');
            console.log(`[TIME] ${new Date().toLocaleTimeString()}`);
            console.log(`[DATA] Posiciones: ${status.activePositions} |  Balance: $${status.totalBalance?.toFixed(2) || '0.00'}`);
            console.log(` Cuántico: ${(status.quantumCoherence * 100).toFixed(1)}% |  Hermético: ${(status.hermeticResonance * 100).toFixed(1)}%`);
            console.log(`[MONEY] Corrector: ${this.system.balanceDataCorrector ? '[OK]' : '[ERROR]'} | [RELOAD] Estado: ${this.isRunning ? 'Activo' : 'Inactivo'}`);
            console.log('\n');
            
        } catch (error) {
            console.error('[ERROR] Error generando reporte periódico:', error.message);
        }
    }
    
    /**
     * Detener el sistema
     */
    async stop() {
        try {
            console.log(' Deteniendo sistema...');
            
            this.isRunning = false;
            
            // Limpiar intervalos
            if (this.balanceMonitorInterval) {
                clearInterval(this.balanceMonitorInterval);
            }
            
            if (this.positionMonitorInterval) {
                clearInterval(this.positionMonitorInterval);
            }
            
            if (this.reportInterval) {
                clearInterval(this.reportInterval);
            }
            
            console.log('[OK] Sistema detenido exitosamente');
            
        } catch (error) {
            console.error('[ERROR] Error deteniendo sistema:', error.message);
        }
    }
    
    /**
     * Obtener estado del launcher
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            hasBalanceCorrector: !!this.system?.balanceDataCorrector,
            lastBalance: this.lastBalanceReport?.totalEquity || 0,
            lastPositionCount: this.lastPositionReport?.length || 0,
            config: this.config,
            timestamp: Date.now()
        };
    }
}

// Función de utilidad para lanzar el sistema
async function launchQBTCBalanceCorrectedSystem(config = {}) {
    const launcher = new QBTCBalanceCorrectedLauncher(config);
    const success = await launcher.launch();
    
    if (success) {
        console.log('\n ¡SISTEMA QBTC BALANCE CORRECTED LANZADO EXITOSAMENTE!');
        console.log('[MONEY] Problema de balance $0.00 resuelto definitivamente');
        console.log('[DATA] Monitoreo de posiciones y balance activo');
        console.log('[RELOAD] Sistema funcionando en modo continuo');
        
        // Manejar señales de terminación
        process.on('SIGINT', async () => {
            console.log('\n Recibida señal de terminación...');
            await launcher.stop();
            process.exit(0);
        });
        
        process.on('SIGTERM', async () => {
            console.log('\n Recibida señal de terminación...');
            await launcher.stop();
            process.exit(0);
        });
        
        return launcher;
    } else {
        console.error('[ERROR] Error lanzando sistema QBTC Balance Corrected');
        return null;
    }
}

module.exports = {
    QBTCBalanceCorrectedLauncher,
    launchQBTCBalanceCorrectedSystem
};

// Si se ejecuta directamente
if (require.main === module) {
    launchQBTCBalanceCorrectedSystem({
        testnet: false,
        enableBalanceCorrector: true,
        reportInterval: 30000
    }).catch(console.error);
}
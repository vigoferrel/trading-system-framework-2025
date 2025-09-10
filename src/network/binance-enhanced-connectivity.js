/**
 * BINANCE ENHANCED CONNECTIVITY - SISTEMA INTEGRADO
 * 
 * Módulo principal que integra todos los componentes de conectividad:
 * ✅ BinanceConnector existente (sin duplicar)
 * ✅ BinanceNetworkManager (bypass + proxy)
 * ✅ IPMonitor (monitoreo continuo)
 * ✅ Procesos en segundo plano con métricas
 * ✅ Solo Binance como fuente de verdad
 * ✅ Kernel RNG sin Math.random
 */

const BinanceConnector = require('../binance-connector');
const BinanceNetworkManager = require('./binance-network-manager');
const IPMonitor = require('./ip-monitor');
const crypto = require('crypto');

// CUMPLIMIENTO REGLAS: Usar kernel RNG
const generateSecureRandom = () => {
    const buffer = crypto.randomBytes(4);
    return buffer.readUInt32BE(0) / 0xffffffff;
};

class BinanceEnhancedConnectivity {
    constructor(config = {}) {
        this.config = {
            // Configuración de integración
            integration: {
                enhanceExistingConnector: true,
                fallbackToProxy: true,
                backgroundMonitoring: true,
                metricsReporting: true
            },
            // Configuración específica de cada componente
            networkManager: {
                proxy: { 
                    enabled: true, 
                    port: 8088 
                },
                monitoring: { 
                    backgroundProcess: true,
                    interval: 300000 // 5 minutos
                }
            },
            ipMonitor: {
                targetIP: '181.43.148.169', // IP fija configurada
                monitoring: {
                    backgroundProcess: true,
                    interval: 300000, // 5 minutos
                    alertOnChange: true
                }
            },
            // CUMPLIMIENTO REGLA: Configuración específica para Binance
            binanceConfig: {
                testnet: false,
                recvWindow: 60000,
                rateLimiting: true
            },
            ...config
        };
        
        // Componentes principales
        this.binanceConnector = null;
        this.networkManager = null;
        this.ipMonitor = null;
        
        // Estado del sistema
        this.initialized = false;
        this.connectivityMethod = 'direct'; // 'direct', 'proxy', 'fallback'
        this.backgroundProcesses = [];
        
        this.log('🏗️ ENHANCED CONNECTIVITY INITIALIZED', 'INFO');
    }
    
    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [ENHANCED-CONN] [${level}] ${message}`);
    }
    
    async initialize() {
        this.log('🚀 INICIANDO SISTEMA DE CONECTIVIDAD MEJORADO', 'INFO');
        this.log('===================================================', 'INFO');
        
        try {
            // 1. Inicializar IP Monitor
            await this.initializeIPMonitor();
            
            // 2. Inicializar Network Manager
            await this.initializeNetworkManager();
            
            // 3. Inicializar/Mejorar BinanceConnector existente
            await this.initializeBinanceConnector();
            
            // 4. Establecer integraciones entre componentes
            this.establishIntegrations();
            
            // 5. CUMPLIMIENTO REGLA: Iniciar procesos en segundo plano
            if (this.config.integration.backgroundMonitoring) {
                this.startBackgroundProcesses();
            }
            
            this.initialized = true;
            this.log('✅ SISTEMA DE CONECTIVIDAD MEJORADO LISTO', 'SUCCESS');
            
            return this.getSystemStatus();
            
        } catch (error) {
            this.log(`❌ Error inicializando: ${error.message}`, 'ERROR');
            throw error;
        }
    }
    
    async initializeIPMonitor() {
        this.log('🔍 Inicializando IP Monitor...', 'INFO');
        
        this.ipMonitor = new IPMonitor(this.config.ipMonitor);
        const status = await this.ipMonitor.initialize();
        
        this.log(`✅ IP Monitor inicializado - Estado: ${status.status}`, 'SUCCESS');
        return status;
    }
    
    async initializeNetworkManager() {
        this.log('🌐 Inicializando Network Manager...', 'INFO');
        
        this.networkManager = new BinanceNetworkManager(this.config.networkManager);
        const status = await this.networkManager.initialize();
        
        if (status) {
            this.log('✅ Network Manager inicializado con éxito', 'SUCCESS');
        } else {
            this.log('⚠️ Network Manager inicializado con advertencias', 'WARN');
        }
        
        return status;
    }
    
    async initializeBinanceConnector() {
        this.log('🔗 Inicializando/Mejorando Binance Connector...', 'INFO');
        
        try {
            // Usar el BinanceConnector existente con configuración mejorada
            const connectorConfig = {
                ...this.config.binanceConfig,
                // Agregar configuración de rate limiting mejorada
                rateLimiting: {
                    enabled: true,
                    maxRequestsPerMinute: 50,
                    backoffStrategy: 'exponential'
                }
            };
            
            this.binanceConnector = new BinanceConnector(connectorConfig);
            
            // Si tenemos proxy disponible, configurar como fallback
            if (this.networkManager && this.networkManager.proxyServer) {
                const integration = this.networkManager.integrateWithConnector(this.binanceConnector);
                
                if (integration.useProxy) {
                    this.connectivityMethod = 'proxy';
                    this.log(`📡 Connector configurado con proxy: ${integration.proxyUrl}`, 'INFO');
                } else if (integration.directConnection) {
                    this.connectivityMethod = 'direct';
                    this.log(`🎯 Connector usando conexión directa IP: ${integration.workingIP}`, 'INFO');
                }
            }
            
            this.log('✅ Binance Connector mejorado correctamente', 'SUCCESS');
            
        } catch (error) {
            this.log(`❌ Error inicializando Binance Connector: ${error.message}`, 'ERROR');
            throw error;
        }
    }
    
    establishIntegrations() {
        this.log('🔗 Estableciendo integraciones entre componentes...', 'INFO');
        
        // Integrar IP Monitor con Network Manager
        if (this.ipMonitor && this.networkManager) {
            this.ipMonitor.integrateWithNetworkManager(this.networkManager);
            this.log('✅ IP Monitor ↔ Network Manager integrados', 'SUCCESS');
        }
        
        // Configurar eventos de cambio de IP para reconfiguración automática
        if (this.ipMonitor) {
            const originalHandleIPChange = this.ipMonitor.handleIPChange.bind(this.ipMonitor);
            this.ipMonitor.handleIPChange = (oldIP, newIP) => {
                originalHandleIPChange(oldIP, newIP);
                
                // Reconfigurar conectividad cuando cambia la IP
                this.handleIPChangeEvent(oldIP, newIP);
            };
        }
        
        this.log('✅ Integraciones establecidas correctamente', 'SUCCESS');
    }
    
    handleIPChangeEvent(oldIP, newIP) {
        this.log(`🔄 Reconfigurando conectividad por cambio IP: ${oldIP} → ${newIP}`, 'INFO');
        
        // Reinicializar Network Manager para detectar nuevas opciones
        setTimeout(async () => {
            try {
                if (this.networkManager) {
                    await this.networkManager.testBinanceConnectivity();
                    
                    // Reconfigurar BinanceConnector si es necesario
                    if (!this.networkManager.workingIP && this.networkManager.proxyServer) {
                        this.connectivityMethod = 'proxy';
                        this.log('🔄 Cambiando a conexión por proxy debido a IP no funcional', 'INFO');
                    }
                }
            } catch (error) {
                this.log(`⚠️ Error en reconfiguración automática: ${error.message}`, 'WARN');
            }
        }, 5000); // Esperar 5 segundos antes de reconfigurar
    }
    
    // CUMPLIMIENTO REGLA: Procesos en segundo plano
    startBackgroundProcesses() {
        this.log('🔄 INICIANDO PROCESOS EN SEGUNDO PLANO...', 'INFO');
        
        // Proceso de monitoreo general del sistema
        const systemMonitor = setInterval(async () => {
            try {
                await this.performSystemHealthCheck();
            } catch (error) {
                this.log(`❌ Error en monitoreo del sistema: ${error.message}`, 'ERROR');
            }
        }, 600000); // Cada 10 minutos
        
        this.backgroundProcesses.push({
            name: 'System Health Monitor',
            process: systemMonitor,
            interval: 600000
        });
        
        // Proceso de métricas de conectividad
        if (this.config.integration.metricsReporting) {
            const metricsReporter = setInterval(async () => {
                try {
                    await this.reportSystemMetrics();
                } catch (error) {
                    this.log(`❌ Error reportando métricas: ${error.message}`, 'ERROR');
                }
            }, 300000); // Cada 5 minutos
            
            this.backgroundProcesses.push({
                name: 'Metrics Reporter',
                process: metricsReporter,
                interval: 300000
            });
        }
        
        this.log(`✅ ${this.backgroundProcesses.length} procesos en segundo plano iniciados`, 'SUCCESS');
    }
    
    async performSystemHealthCheck() {
        const metrics = {
            timestamp: new Date().toISOString(),
            connectivity: {
                method: this.connectivityMethod,
                networkManagerStatus: this.networkManager ? this.networkManager.getStatus() : null,
                ipMonitorStatus: this.ipMonitor ? this.ipMonitor.getStatus() : null
            },
            system: {
                initialized: this.initialized,
                backgroundProcesses: this.backgroundProcesses.length
            }
        };
        
        // CUMPLIMIENTO REGLA: Métricas para segundo plano
        this.log(`HEALTH_CHECK: ${JSON.stringify(metrics)}`, 'METRICS');
        
        // Verificar si todos los componentes están funcionando
        let healthStatus = 'OK';
        const issues = [];
        
        if (!this.networkManager || !this.networkManager.getStatus().networkManager.initialized) {
            issues.push('Network Manager no inicializado');
            healthStatus = 'WARNING';
        }
        
        if (!this.ipMonitor || !this.ipMonitor.getStatus().ipMonitor.initialized) {
            issues.push('IP Monitor no inicializado');
            healthStatus = 'WARNING';
        }
        
        if (!this.binanceConnector) {
            issues.push('Binance Connector no disponible');
            healthStatus = 'ERROR';
        }
        
        if (issues.length > 0) {
            this.log(`⚠️ HEALTH CHECK - Estado: ${healthStatus}, Problemas: ${issues.join(', ')}`, 'WARN');
        } else {
            this.log('✅ HEALTH CHECK - Sistema funcionando correctamente', 'SUCCESS');
        }
        
        return { status: healthStatus, issues, metrics };
    }
    
    async reportSystemMetrics() {
        const systemMetrics = {
            timestamp: new Date().toISOString(),
            connectivityMethod: this.connectivityMethod,
            components: {
                networkManager: this.networkManager?.getNetworkMetrics() || null,
                ipMonitor: this.ipMonitor?.getMonitoringMetrics() || null
            },
            performance: {
                backgroundProcesses: this.backgroundProcesses.length,
                uptime: process.uptime()
            }
        };
        
        // CUMPLIMIENTO REGLA: Reporte de métricas para segundo plano
        this.log(`SYSTEM_METRICS: ${JSON.stringify(systemMetrics)}`, 'METRICS');
    }
    
    // Método principal para obtener el conector mejorado
    getEnhancedConnector() {
        if (!this.initialized) {
            throw new Error('Enhanced Connectivity not initialized. Call initialize() first.');
        }
        
        return {
            connector: this.binanceConnector,
            method: this.connectivityMethod,
            features: {
                ipMonitoring: !!this.ipMonitor,
                proxyFallback: !!this.networkManager?.proxyServer,
                backgroundMonitoring: this.backgroundProcesses.length > 0
            }
        };
    }
    
    getSystemStatus() {
        return {
            enhancedConnectivity: {
                initialized: this.initialized,
                connectivityMethod: this.connectivityMethod,
                backgroundProcesses: this.backgroundProcesses.length
            },
            components: {
                networkManager: this.networkManager?.getStatus() || null,
                ipMonitor: this.ipMonitor?.getStatus() || null,
                binanceConnector: !!this.binanceConnector
            }
        };
    }
    
    async testFullConnectivity() {
        this.log('🧪 PRUEBA COMPLETA DE CONECTIVIDAD', 'INFO');
        this.log('===================================', 'INFO');
        
        const results = {
            timestamp: new Date().toISOString(),
            tests: {}
        };
        
        // Test 1: IP Monitor
        if (this.ipMonitor) {
            try {
                results.tests.ipMonitor = await this.ipMonitor.runFullCheck();
                this.log('✅ Test IP Monitor: OK', 'SUCCESS');
            } catch (error) {
                results.tests.ipMonitor = { status: 'ERROR', error: error.message };
                this.log(`❌ Test IP Monitor: ${error.message}`, 'ERROR');
            }
        }
        
        // Test 2: Network Manager connectivity
        if (this.networkManager) {
            try {
                const nmStatus = this.networkManager.getStatus();
                results.tests.networkManager = nmStatus;
                this.log('✅ Test Network Manager: OK', 'SUCCESS');
            } catch (error) {
                results.tests.networkManager = { status: 'ERROR', error: error.message };
                this.log(`❌ Test Network Manager: ${error.message}`, 'ERROR');
            }
        }
        
        // Test 3: Binance Connector basic test
        if (this.binanceConnector) {
            try {
                const serverTime = await this.binanceConnector.getServerTime();
                results.tests.binanceConnector = { 
                    status: 'OK', 
                    serverTime,
                    method: this.connectivityMethod
                };
                this.log('✅ Test Binance Connector: OK', 'SUCCESS');
            } catch (error) {
                results.tests.binanceConnector = { status: 'ERROR', error: error.message };
                this.log(`❌ Test Binance Connector: ${error.message}`, 'ERROR');
            }
        }
        
        const overallStatus = Object.values(results.tests).every(test => test.status === 'OK' || test.overallStatus === 'OK') 
            ? 'OK' : 'ISSUES';
        
        results.overallStatus = overallStatus;
        
        this.log(`=== RESULTADO PRUEBA COMPLETA: ${overallStatus} ===`, 
                 overallStatus === 'OK' ? 'SUCCESS' : 'WARN');
        
        return results;
    }
    
    shutdown() {
        this.log('🛑 CERRANDO SISTEMA DE CONECTIVIDAD MEJORADO...', 'INFO');
        
        // Cerrar procesos en segundo plano
        this.backgroundProcesses.forEach(bgProcess => {
            clearInterval(bgProcess.process);
            this.log(`✅ Proceso '${bgProcess.name}' cerrado`, 'INFO');
        });
        this.backgroundProcesses = [];
        
        // Cerrar componentes
        if (this.networkManager) {
            this.networkManager.shutdown();
        }
        
        if (this.ipMonitor) {
            this.ipMonitor.shutdown();
        }
        
        this.initialized = false;
        this.log('✅ SISTEMA DE CONECTIVIDAD MEJORADO CERRADO', 'SUCCESS');
    }
}

module.exports = BinanceEnhancedConnectivity;

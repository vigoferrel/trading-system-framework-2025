
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
 * [NIGHT] SOLUCIÓN DUAL VPN PARA BINANCE API
 * 
 * Este archivo configura una solución de VPN dual que permite:
 * 1. Conectar a NordVPN para tráfico general
 * 2. Usar OpenVPN específico para Binance API
 * 3. Generar IP cuántica única basada en constantes fundamentales
 * 
 * @author Quantum Trading Team
 * @version 2.0.0
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Constantes cuánticas para generación de IP
const QUANTUM_Z_REAL = 9;
const QUANTUM_Z_IMAG = 16;
const QUANTUM_LAMBDA = Math.log(7919);

class DualVPNSolution {
    constructor() {
        this.config = {
            nordVPN: {
                interface: 'NordLynx',
                server: 'us1234.nordvpn.com', // Servidor US para Binance
                protocol: 'udp'
            },
            openVPN: {
                configFile: path.join(__dirname, 'quantum-vpn.ovpn'),
                credentialsFile: path.join(__dirname, 'quantum-vpn-credentials.txt'),
                interface: 'TAP-Windows6',
                ip: '192.168.173.160',
                port: 1862
            },
            binance: {
                allowedIPs: [
                    '192.168.173.160',
                    '10.5.0.2',
                    '172.16.42.223'
                ]
            }
        };
        
        this.currentIP = null;
        this.vpnStatus = {
            nordVPN: false,
            openVPN: false
        };
    }

    /**
     * Genera IP cuántica única basada en constantes fundamentales
     */
    generateQuantumIP() {
        const zMagnitude = Math.sqrt(QUANTUM_Z_REAL * QUANTUM_Z_REAL + QUANTUM_Z_IMAG * QUANTUM_Z_IMAG);
        const lambdaPhase = QUANTUM_LAMBDA * Math.PI / 180;
        
        // Generar IP basada en constantes cuánticas
        const ip1 = Math.floor(Math.abs(Math.sin(zMagnitude)) * 255);
        const ip2 = Math.floor(Math.abs(Math.cos(lambdaPhase)) * 255);
        const ip3 = Math.floor(Math.abs(Math.sin(QUANTUM_LAMBDA)) * 255);
        const ip4 = Math.floor(Math.abs(Math.cos(zMagnitude * lambdaPhase)) * 255);
        
        return `${ip1}.${ip2}.${ip3}.${ip4}`;
    }

    /**
     * Verifica la IP actual
     */
    async checkCurrentIP() {
        return new Promise((resolve, reject) => {
            exec('powershell -Command "(Invoke-WebRequest -Uri \'https://api.ipify.org\' -UseBasicParsing).Content"', (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                this.currentIP = stdout.trim();
                resolve(this.currentIP);
            });
        });
    }

    /**
     * Verifica si la IP está autorizada para Binance
     */
    isIPAuthorized(ip) {
        return this.config.binance.allowedIPs.includes(ip);
    }

    /**
     * Configura rutas específicas para Binance API
     */
    async configureBinanceRoutes() {
        const binanceAPIs = [
            'api.binance.com',
            'fapi.binance.com',
            'eapi.binance.com',
            'dapi.binance.com'
        ];

        console.log(' Configurando rutas específicas para Binance API...');

        for (const api of binanceAPIs) {
            try {
                // Agregar ruta específica para cada API de Binance
                const command = `route add ${api} mask 255.255.255.255 ${this.config.openVPN.ip}`;
                await this.executeCommand(command);
                console.log(`[OK] Ruta configurada para ${api}`);
            } catch (error) {
                console.warn(`[WARNING] No se pudo configurar ruta para ${api}:`, error.message);
            }
        }
    }

    /**
     * Conecta OpenVPN para Binance
     */
    async connectOpenVPN() {
        console.log(' Conectando OpenVPN para Binance API...');

        // Verificar que existe el archivo de configuración
        if (!fs.existsSync(this.config.openVPN.configFile)) {
            throw new Error(`Archivo de configuración OpenVPN no encontrado: ${this.config.openVPN.configFile}`);
        }

        // Crear credenciales si no existen
        if (!fs.existsSync(this.config.openVPN.credentialsFile)) {
            this.createVPNCredentials();
        }

        // Conectar OpenVPN
        const command = `openvpn --config "${this.config.openVPN.configFile}" --auth-user-pass "${this.config.openVPN.credentialsFile}" --daemon`;
        
        try {
            await this.executeCommand(command);
            this.vpnStatus.openVPN = true;
            console.log('[OK] OpenVPN conectado para Binance API');
            
            // Esperar a que se establezca la conexión
            await this.waitForConnection();
            
            // Configurar rutas específicas
            await this.configureBinanceRoutes();
            
        } catch (error) {
            console.error('[ERROR] Error conectando OpenVPN:', error.message);
            throw error;
        }
    }

    /**
     * Crea archivo de credenciales VPN
     */
    createVPNCredentials() {
        const credentials = [
            'quantum_trading_system',
            'z9p16i_lambda7919_5eb89680'
        ];
        
        fs.writeFileSync(this.config.openVPN.credentialsFile, credentials.join('\n'));
        console.log('[OK] Archivo de credenciales VPN creado');
    }

    /**
     * Espera a que se establezca la conexión VPN
     */
    async waitForConnection(timeout = 30000) {
        console.log(' Esperando establecimiento de conexión VPN...');
        
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            try {
                const ip = await this.checkCurrentIP();
                if (this.isIPAuthorized(ip)) {
                    console.log(`[OK] Conexión VPN establecida. IP: ${ip}`);
                    return true;
                }
                await this.sleep(1000);
            } catch (error) {
                await this.sleep(1000);
            }
        }
        
        throw new Error('Timeout esperando conexión VPN');
    }

    /**
     * Ejecuta comando del sistema
     */
    executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(stdout);
            });
        });
    }

    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Inicializa la solución dual VPN
     */
    async initialize() {
        console.log('[NIGHT] Inicializando Solución Dual VPN...');
        
        try {
            // Verificar IP actual
            const currentIP = await this.checkCurrentIP();
            console.log(` IP actual: ${currentIP}`);
            
            if (this.isIPAuthorized(currentIP)) {
                console.log('[OK] IP ya está autorizada para Binance');
                return true;
            }
            
            console.log('[ERROR] IP no autorizada. Conectando VPN...');
            
            // Conectar OpenVPN
            await this.connectOpenVPN();
            
            // Verificar IP final
            const finalIP = await this.checkCurrentIP();
            console.log(` IP final: ${finalIP}`);
            
            if (this.isIPAuthorized(finalIP)) {
                console.log('[OK] Solución Dual VPN configurada correctamente');
                return true;
            } else {
                throw new Error(`IP no autorizada después de conectar VPN: ${finalIP}`);
            }
            
        } catch (error) {
            console.error('[ERROR] Error inicializando Dual VPN:', error.message);
            throw error;
        }
    }

    /**
     * Verifica el estado de la VPN
     */
    async checkStatus() {
        const status = {
            currentIP: await this.checkCurrentIP(),
            isAuthorized: this.isIPAuthorized(await this.checkCurrentIP()),
            nordVPN: this.vpnStatus.nordVPN,
            openVPN: this.vpnStatus.openVPN
        };
        
        return status;
    }
}

module.exports = DualVPNSolution;

// Ejemplo de uso
if (require.main === module) {
    const dualVPN = new DualVPNSolution();
    
    dualVPN.initialize()
        .then(() => {
            console.log('[OK] Solución Dual VPN inicializada correctamente');
            return dualVPN.checkStatus();
        })
        .then(status => {
            console.log('[DATA] Estado de la VPN:', status);
        })
        .catch(error => {
            console.error('[ERROR] Error:', error.message);
            process.exit(1);
        });
}

#!/usr/bin/env node
/*
  QBTC VPN SOLUTION - OPCIÓN 1
  Solución VPN para conectividad con Binance
*/

const https = require('https');
const { spawn } = require('child_process');
const readline = require('readline');

class QBTCVPNSolution {
    constructor() {
        this.targetIP = '181.43.212.196';
        this.currentIP = null;
        this.vpnClients = [
            'NordVPN',
            'OpenVPN',
            'ProtonVPN',
            'ExpressVPN',
            'Surfshark'
        ];
    }

    async getCurrentIP() {
        return new Promise((resolve, reject) => {
            https.get('https://ipv4.icanhazip.com', (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data.trim()));
            }).on('error', reject);
        });
    }

    createReadlineInterface() {
        return readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    askQuestion(rl, question) {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                resolve(answer.toLowerCase());
            });
        });
    }

    async showVPNInstructions() {
        console.log('🔧 INSTRUCCIONES PARA CAMBIAR IP CON VPN');
        console.log('=========================================');

        console.log('\n📋 PASO 1: IDENTIFICAR TU CLIENTE VPN');
        console.log('   Clientes VPN compatibles:');
        this.vpnClients.forEach((client, index) => {
            console.log(`   ${index + 1}. ${client}`);
        });

        console.log('\n📋 PASO 2: CONECTAR A SERVIDOR SUDAMERICANO');
        console.log('   Busca servidores en estos países:');
        console.log('   🇨🇱 Chile');
        console.log('   🇦🇷 Argentina');
        console.log('   🇧🇷 Brasil');
        console.log('   🇲🇽 México');

        console.log('\n🎯 PASO 3: IP OBJETIVO');
        console.log(`   Busca específicamente: ${this.targetIP}`);
        console.log('   Esta IP está whitelisted en Binance');

        console.log('\n⏳ PASO 4: ESPERAR CONEXIÓN');
        console.log('   • Espera 10-15 segundos después de conectar');
        console.log('   • Verifica que la conexión esté estable');
        console.log('   • Algunos VPN cambian IP automáticamente');

        console.log('\n✅ PASO 5: VERIFICAR CAMBIO');
        console.log('   Una vez conectado, presiona Enter aquí');
        console.log('   El sistema verificará automáticamente tu nueva IP');
    }

    async checkVPNStatus() {
        console.log('\n🔍 VERIFICANDO ESTADO DE VPN...');

        // Verificar procesos VPN corriendo
        const vpnProcesses = [
            'nordvpn',
            'openvpn',
            'protonvpn',
            'expressvpn',
            'surfshark'
        ];

        for (const processName of vpnProcesses) {
            try {
                const result = await this.checkProcessRunning(processName);
                if (result) {
                    console.log(`   ✅ ${processName} está ejecutándose`);
                    return processName;
                }
            } catch (error) {
                // Continuar con el siguiente
            }
        }

        console.log('   ⚠️ No se detectó ningún cliente VPN ejecutándose');
        console.log('   📝 Asegúrate de tener tu VPN abierto y conectado');
        return null;
    }

    checkProcessRunning(processName) {
        return new Promise((resolve) => {
            const cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux';
            const args = process.platform === 'win32' ? ['/FI', `IMAGENAME eq ${processName}.exe`] : [];

            const child = spawn(cmd, args, { stdio: 'pipe' });

            let output = '';
            child.stdout.on('data', (data) => {
                output += data.toString();
            });

            child.on('close', (code) => {
                const isRunning = output.toLowerCase().includes(processName.toLowerCase());
                resolve(isRunning);
            });

            child.on('error', () => resolve(false));
        });
    }

    async waitForIPChange(rl) {
        console.log('\n⏳ ESPERANDO CAMBIO DE IP...');
        console.log('   Presiona Enter cuando hayas conectado tu VPN');

        await this.askQuestion(rl, '');

        console.log('\n🔄 VERIFICANDO NUEVA IP...');
        const newIP = await this.getCurrentIP();
        console.log(`   🌐 Nueva IP: ${newIP}`);

        if (newIP === this.targetIP) {
            console.log('   🎉 ¡PERFECTO! IP cambiada correctamente');
            return true;
        } else if (newIP !== this.currentIP) {
            console.log('   ⚠️ IP cambiada, pero no es la objetivo');
            console.log(`   📍 Tu IP actual: ${newIP}`);
            console.log(`   🎯 IP objetivo: ${this.targetIP}`);
            console.log('   💡 Intenta conectar a otro servidor');
            return false;
        } else {
            console.log('   ❌ IP no cambió');
            console.log('   🔧 Verifica que tu VPN esté conectado');
            return false;
        }
    }

    async testBinanceConnection() {
        console.log('\n🔗 PROBANDO CONEXIÓN CON BINANCE...');

        try {
            // Probar conexión básica con testnet
            const testUrl = 'https://testnet.binance.vision/api/v3/ping';

            const result = await this.makeRequest(testUrl);
            if (result) {
                console.log('   ✅ Conexión básica exitosa');
                return true;
            }
        } catch (error) {
            console.log('   ❌ Error de conexión básica');
            return false;
        }

        return false;
    }

    makeRequest(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                resolve(res.statusCode === 200);
            }).on('error', reject);
        });
    }

    async runVPNSolution() {
        console.log('🚀 QBTC VPN SOLUTION - OPCIÓN 1');
        console.log('================================');

        const rl = this.createReadlineInterface();

        try {
            // 1. Verificar IP actual
            console.log('📍 VERIFICANDO IP ACTUAL...');
            this.currentIP = await this.getCurrentIP();
            console.log(`   🌐 Tu IP actual: ${this.currentIP}`);

            if (this.currentIP === this.targetIP) {
                console.log('   ✅ ¡Ya tienes la IP correcta!');
                console.log('   🎯 Ejecuta: node check-balance.js');
                return;
            }

            // 2. Verificar VPN
            await this.checkVPNStatus();

            // 3. Mostrar instrucciones
            await this.showVPNInstructions();

            // 4. Esperar cambio de IP
            let ipChanged = false;
            let attempts = 0;
            const maxAttempts = 3;

            while (!ipChanged && attempts < maxAttempts) {
                attempts++;
                console.log(`\n🔄 INTENTO ${attempts}/${maxAttempts}`);

                ipChanged = await this.waitForIPChange(rl);

                if (!ipChanged && attempts < maxAttempts) {
                    console.log('   🔄 Intenta nuevamente...');
                }
            }

            if (ipChanged) {
                // 5. Probar conexión con Binance
                const binanceOk = await this.testBinanceConnection();

                if (binanceOk) {
                    console.log('\n🎉 ¡ÉXITO COMPLETO!');
                    console.log('   ✅ IP cambiada correctamente');
                    console.log('   ✅ Conexión con Binance verificada');
                    console.log('   🚀 Ejecuta ahora: node check-balance.js');
                } else {
                    console.log('\n⚠️ IP cambiada pero problemas con Binance');
                    console.log('   💡 Puede requerir whitelist en Binance');
                    console.log('   🔧 Ejecuta: node qbtc-complete-integration.js');
                }
            } else {
                console.log('\n❌ No se pudo cambiar la IP');
                console.log('   💡 Prueba estas alternativas:');
                console.log('   1. node qbtc-ip-guide.js (guía interactiva)');
                console.log('   2. node binance-ip-bypass.js (sistema de bypass)');
                console.log('   3. .\\launch-qbtc-integration.bat (solución completa)');
            }

        } finally {
            rl.close();
        }
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const vpnSolution = new QBTCVPNSolution();
    vpnSolution.runVPNSolution().catch(console.error);
}

module.exports = QBTCVPNSolution;

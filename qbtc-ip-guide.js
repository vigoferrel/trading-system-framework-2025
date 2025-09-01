#!/usr/bin/env node
/*
  QBTC IP VERIFICATION & CHANGE GUIDE
  Guía interactiva para cambiar IP y verificar conectividad
*/

const https = require('https');
const readline = require('readline');

class QBTCIPGuide {
    constructor() {
        this.targetIP = '181.43.212.196';
        this.currentIP = null;
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

    async showMainMenu() {
        console.log('🚀 QBTC IP VERIFICATION & CHANGE GUIDE');
        console.log('======================================');

        const currentIP = await this.getCurrentIP();
        console.log(`📍 Tu IP actual: ${currentIP}`);

        if (currentIP === this.targetIP) {
            console.log('✅ ¡PERFECTO! Ya tienes la IP correcta');
            console.log('🎯 Ejecuta: node check-balance.js');
            return;
        }

        console.log(`🎯 IP objetivo: ${this.targetIP}`);
        console.log('❌ Tu IP actual NO es la correcta');
        console.log('');
    }

    async showOptions() {
        console.log('🎯 OPCIONES DISPONIBLES:');
        console.log('=======================');
        console.log('');
        console.log('1️⃣ VPN (Solución más simple):');
        console.log('   • NordVPN/OpenVPN/ProtonVPN');
        console.log('   • Conectar a Chile/Argentina/Brasil');
        console.log('   • Buscar servidor con IP: 181.43.212.196');
        console.log('');
        console.log('2️⃣ Proxy HTTP (Temporal):');
        console.log('   • Proxy local corriendo en puerto 8888');
        console.log('   • Configurar aplicación para usar proxy');
        console.log('');
        console.log('3️⃣ Servicios de Túnel (Avanzado):');
        console.log('   • ngrok: ngrok http 443 --host-header=fapi.binance.com');
        console.log('   • localtunnel: lt --port 443 --subdomain qbtc-trading');
        console.log('');
        console.log('4️⃣ Whitelist en Binance (Permanente):');
        console.log('   • Ir a Binance > API Management');
        console.log('   • Agregar tu IP actual a whitelist');
        console.log('   • Agregar también: 181.43.212.196');
        console.log('');
    }

    async runInteractiveGuide() {
        await this.showMainMenu();
        await this.showOptions();

        const rl = this.createReadlineInterface();

        try {
            const answer = await this.askQuestion(rl,
                '¿Qué opción prefieres? (1=VPN, 2=Proxy, 3=Túnel, 4=Whitelist): '
            );

            switch (answer) {
                case '1':
                    await this.handleVPNOption(rl);
                    break;
                case '2':
                    await this.handleProxyOption(rl);
                    break;
                case '3':
                    await this.handleTunnelOption(rl);
                    break;
                case '4':
                    await this.handleWhitelistOption(rl);
                    break;
                default:
                    console.log('❌ Opción no válida');
            }

            console.log('');
            console.log('🔄 ¿Quieres verificar tu IP nuevamente?');
            const verifyAgain = await this.askQuestion(rl, '(s/n): ');

            if (verifyAgain === 's' || verifyAgain === 'si') {
                const newIP = await this.getCurrentIP();
                console.log(`📍 Tu nueva IP: ${newIP}`);

                if (newIP === this.targetIP) {
                    console.log('🎉 ¡EXCELENTE! IP cambiada correctamente');
                    console.log('🚀 Ejecuta ahora: node check-balance.js');
                } else {
                    console.log('⚠️ IP aún no es la correcta');
                    console.log('🔄 Intenta nuevamente o elige otra opción');
                }
            }

        } finally {
            rl.close();
        }
    }

    async handleVPNOption(rl) {
        console.log('');
        console.log('🔧 INSTRUCCIONES PARA VPN:');
        console.log('==========================');
        console.log('1. Abre tu cliente VPN (NordVPN, OpenVPN, etc.)');
        console.log('2. Desconéctate del servidor actual si estás conectado');
        console.log('3. Busca servidores en América del Sur:');
        console.log('   • Chile (CL)');
        console.log('   • Argentina (AR)');
        console.log('   • Brasil (BR)');
        console.log('4. Conéctate a un servidor que tenga IP: 181.43.212.196');
        console.log('5. Espera a que se estabilice la conexión');
        console.log('');

        await this.askQuestion(rl, 'Presiona Enter cuando hayas cambiado la IP...');
    }

    async handleProxyOption(rl) {
        console.log('');
        console.log('🔧 INSTRUCCIONES PARA PROXY:');
        console.log('============================');
        console.log('1. El proxy local está corriendo en puerto 8888');
        console.log('2. Para configurar proxy en Node.js:');
        console.log('   process.env.HTTP_PROXY = "http://localhost:8888"');
        console.log('   process.env.HTTPS_PROXY = "http://localhost:8888"');
        console.log('3. Para configurar proxy en curl:');
        console.log('   curl -x http://localhost:8888 https://api.binance.com');
        console.log('');

        await this.askQuestion(rl, 'Presiona Enter para continuar...');
    }

    async handleTunnelOption(rl) {
        console.log('');
        console.log('🔧 INSTRUCCIONES PARA TÚNEL:');
        console.log('============================');
        console.log('1. Instala ngrok: npm install -g ngrok');
        console.log('2. Ejecuta: ngrok http 443 --host-header=fapi.binance.com');
        console.log('3. O usa localtunnel: npm install -g localtunnel');
        console.log('4. Ejecuta: lt --port 443 --subdomain qbtc-trading');
        console.log('');

        await this.askQuestion(rl, 'Presiona Enter para continuar...');
    }

    async handleWhitelistOption(rl) {
        console.log('');
        console.log('🔧 INSTRUCCIONES PARA WHITELIST:');
        console.log('================================');
        console.log('1. Ve a tu cuenta de Binance');
        console.log('2. Ve a API Management');
        console.log('3. Edita tu API Key');
        console.log('4. En "IP Addresses (Whitelist)" agrega:');
        console.log(`   • Tu IP actual: ${await this.getCurrentIP()}`);
        console.log(`   • IP objetivo: ${this.targetIP}`);
        console.log('5. Guarda los cambios');
        console.log('');

        await this.askQuestion(rl, 'Presiona Enter cuando hayas agregado las IPs...');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const guide = new QBTCIPGuide();
    guide.runInteractiveGuide().catch(console.error);
}

module.exports = QBTCIPGuide;

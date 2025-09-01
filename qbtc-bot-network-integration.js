#!/usr/bin/env node
/*
  QBTC BOT NETWORK INTEGRATION
  Integración del sistema QBTC con la red de bots con IPs fijas
*/

const https = require('https');
const { spawn } = require('child_process');
const path = require('path');

class QBTCBotNetworkIntegration {
    constructor() {
        this.botNetwork = '192.168.100.0/24';
        this.gateway = '192.168.100.1';
        this.botConfigs = [
            { name: 'bot-01', ip: '192.168.100.10', port: '3001' },
            { name: 'bot-02', ip: '192.168.100.11', port: '3002' },
            { name: 'bot-03', ip: '192.168.100.12', port: '3003' },
            { name: 'bot-04', ip: '192.168.100.13', port: '3004' },
            { name: 'bot-05', ip: '192.168.100.14', port: '3005' }
        ];
        this.targetIP = '181.43.212.196';
    }

    async checkDockerStatus() {
        console.log('🔍 VERIFICANDO DOCKER...');
        return new Promise((resolve) => {
            const docker = spawn('docker', ['--version'], { stdio: 'pipe' });
            docker.on('close', (code) => {
                if (code === 0) {
                    console.log('   ✅ Docker está disponible');
                    resolve(true);
                } else {
                    console.log('   ❌ Docker no está disponible');
                    resolve(false);
                }
            });
            docker.on('error', () => {
                console.log('   ❌ Docker no está instalado');
                resolve(false);
            });
        });
    }

    async checkBotNetwork() {
        console.log('🔍 VERIFICANDO RED DE BOTS...');
        return new Promise((resolve) => {
            const docker = spawn('docker', ['network', 'inspect', 'bot-network'], { stdio: 'pipe' });
            let output = '';
            docker.stdout.on('data', (data) => output += data.toString());
            docker.on('close', (code) => {
                if (code === 0) {
                    console.log('   ✅ Red bot-network existe');
                    resolve(true);
                } else {
                    console.log('   ❌ Red bot-network no existe');
                    resolve(false);
                }
            });
        });
    }

    async setupBotNetwork() {
        console.log('⚙️ CONFIGURANDO RED DE BOTS...');

        const setupScript = path.join('C:', 'OpenVPN', 'setup-bot-network.ps1');
        if (!require('fs').existsSync(setupScript)) {
            console.log('   ❌ Script de configuración no encontrado');
            console.log(`   📍 Buscado en: ${setupScript}`);
            return false;
        }

        return new Promise((resolve) => {
            const powershell = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', setupScript], {
                stdio: 'inherit',
                cwd: path.dirname(setupScript)
            });

            powershell.on('close', (code) => {
                if (code === 0) {
                    console.log('   ✅ Red de bots configurada exitosamente');
                    resolve(true);
                } else {
                    console.log('   ❌ Error configurando red de bots');
                    resolve(false);
                }
            });
        });
    }

    async testBotConnectivity() {
        console.log('🔗 PROBANDO CONECTIVIDAD DE BOTS...');

        for (const bot of this.botConfigs) {
            try {
                const response = await this.testBotEndpoint(bot);
                if (response) {
                    console.log(`   ✅ ${bot.name}: ${bot.ip}:${bot.port} - ACTIVO`);
                } else {
                    console.log(`   ❌ ${bot.name}: ${bot.ip}:${bot.port} - INACTIVO`);
                }
            } catch (error) {
                console.log(`   ❌ ${bot.name}: Error de conexión`);
            }
        }
    }

    testBotEndpoint(bot) {
        return new Promise((resolve) => {
            const options = {
                hostname: 'localhost',
                port: bot.port,
                path: '/',
                method: 'GET',
                timeout: 5000
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        resolve(json.bot === bot.name);
                    } catch (e) {
                        resolve(false);
                    }
                });
            });

            req.on('error', () => resolve(false));
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });

            req.end();
        });
    }

    async createQBTCDistribution() {
        console.log('🚀 CREANDO DISTRIBUCIÓN QBTC EN BOTS...');

        const distribution = {
            system: 'QBTC Unified Quantum System',
            version: '2.0.0',
            network: this.botNetwork,
            bots: this.botConfigs.map(bot => ({
                name: bot.name,
                internalIP: bot.ip,
                externalPort: bot.port,
                status: 'active',
                role: this.assignBotRole(bot)
            })),
            targetIP: this.targetIP,
            created: new Date().toISOString()
        };

        const fs = require('fs');
        const configPath = path.join(__dirname, 'qbtc-bot-distribution.json');
        fs.writeFileSync(configPath, JSON.stringify(distribution, null, 2));

        console.log(`   ✅ Distribución guardada en: ${configPath}`);
        return distribution;
    }

    assignBotRole(bot) {
        const roles = ['market-data', 'trading-engine', 'monitoring', 'backup', 'coordinator'];
        const index = parseInt(bot.name.split('-')[1]) - 1;
        return roles[index % roles.length];
    }

    async runBotNetworkIntegration() {
        console.log('🚀 INICIANDO INTEGRACIÓN QBTC BOT NETWORK');
        console.log('==========================================');

        // 1. Verificar Docker
        const dockerOk = await this.checkDockerStatus();
        if (!dockerOk) {
            console.log('❌ Docker es requerido para la red de bots');
            console.log('   📥 Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop');
            return;
        }

        // 2. Verificar red de bots
        const networkExists = await this.checkBotNetwork();
        if (!networkExists) {
            console.log('📋 RED DE BOTS NO ENCONTRADA');
            console.log('   🔧 Creando red de bots...');
            const setupOk = await this.setupBotNetwork();
            if (!setupOk) {
                console.log('❌ Error creando red de bots');
                return;
            }
        }

        // 3. Probar conectividad
        await this.testBotConnectivity();

        // 4. Crear distribución QBTC
        const distribution = await this.createQBTCDistribution();

        // 5. Mostrar resumen
        console.log('\n🎯 INTEGRACIÓN COMPLETADA');
        console.log('=========================');
        console.log(`   🌐 Red: ${this.botNetwork}`);
        console.log(`   🎯 IP Objetivo: ${this.targetIP}`);
        console.log(`   🤖 Bots activos: ${distribution.bots.length}`);
        console.log('');

        console.log('📊 DISTRIBUCIÓN DE BOTS:');
        distribution.bots.forEach(bot => {
            console.log(`   ${bot.name}: ${bot.role} (${bot.internalIP}:${bot.externalPort})`);
        });

        console.log('');
        console.log('💡 PRÓXIMOS PASOS:');
        console.log('   1. node check-balance.js (probar conectividad)');
        console.log('   2. node qbtc-vpn-solution.js (si hay problemas de IP)');
        console.log('   3. node qbtc-complete-integration.js (solución completa)');

        console.log('');
        console.log('🔧 GESTIÓN DE BOTS:');
        console.log('   • cd C:\\OpenVPN');
        console.log('   • .\\manage-bots.ps1 -Action status');
        console.log('   • .\\manage-bots.ps1 -Action logs');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const integration = new QBTCBotNetworkIntegration();
    integration.runBotNetworkIntegration().catch(console.error);
}

module.exports = QBTCBotNetworkIntegration;

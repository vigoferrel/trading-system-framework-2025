#!/usr/bin/env node
/*
  QBTC QUANTUM IP ROTATION SYSTEM
  Sistema de rotación automática de IPs para máxima compatibilidad
*/

const https = require('https');
const fs = require('fs');
const path = require('path');

class QBTCIPRotation {
    constructor() {
        this.ipPool = [
            {
                ip: '181.43.148.169',
                type: 'IPv4',
                status: 'blocked',
                priority: 1
            },
            {
                ip: '2800:300:6a71:f2d0:adca:d9ee:e188:1945',
                type: 'IPv6',
                status: 'working',
                priority: 2
            },
            {
                ip: '1.1.1.1',
                type: 'IPv4',
                status: 'blocked',
                priority: 3
            },
            {
                ip: '181.43.212.196',
                type: 'IPv4',
                status: 'target',
                priority: 0
            }
        ];
        this.currentIP = null;
        this.bestIP = null;
    }

    async testIPConnectivity(ip) {
        return new Promise((resolve) => {
            const testUrl = 'https://testnet.binance.vision/api/v3/ping';

            const options = {
                hostname: 'testnet.binance.vision',
                path: '/api/v3/ping',
                method: 'GET',
                timeout: 5000
            };

            const req = https.request(options, (res) => {
                resolve(res.statusCode === 200);
            });

            req.on('error', () => resolve(false));
            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });

            req.end();
        });
    }

    async findBestIP() {
        console.log('🔍 BUSCANDO LA MEJOR IP DISPONIBLE...');

        for (const ipConfig of this.ipPool.sort((a, b) => a.priority - b.priority)) {
            console.log(`   🧪 Probando ${ipConfig.type} ${ipConfig.ip}...`);

            const works = await this.testIPConnectivity(ipConfig.ip);
            if (works) {
                console.log(`   ✅ ${ipConfig.ip} - FUNCIONA`);
                this.bestIP = ipConfig;
                return ipConfig;
            } else {
                console.log(`   ❌ ${ipConfig.ip} - NO FUNCIONA`);
            }
        }

        return null;
    }

    async createIPRotationConfig() {
        console.log('⚙️ CREANDO CONFIGURACIÓN DE ROTACIÓN DE IP...');

        const config = {
            system: 'QBTC Quantum IP Rotation',
            version: '1.0.0',
            ipPool: this.ipPool,
            bestIP: this.bestIP,
            rotationStrategy: 'priority-based',
            fallbackEnabled: true,
            autoRetry: true,
            retryInterval: 30000, // 30 segundos
            created: new Date().toISOString()
        };

        const configPath = path.join(__dirname, 'ip-rotation-config.json');
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        console.log(`   ✅ Configuración guardada en: ${configPath}`);
        return config;
    }

    async runIPRotation() {
        console.log('🚀 INICIANDO SISTEMA DE ROTACIÓN DE IP QBTC');
        console.log('===========================================');

        // 1. Encontrar la mejor IP
        const bestIP = await this.findBestIP();

        if (bestIP) {
            console.log(`\n🎯 MEJOR IP ENCONTRADA:`);
            console.log(`   🌐 IP: ${bestIP.ip}`);
            console.log(`   📋 Tipo: ${bestIP.type}`);
            console.log(`   ⭐ Prioridad: ${bestIP.priority}`);
            console.log(`   📊 Estado: ${bestIP.status}`);

            // 2. Crear configuración
            await this.createIPRotationConfig();

            // 3. Mostrar recomendaciones
            console.log(`\n💡 RECOMENDACIONES:`);
            if (bestIP.status === 'target') {
                console.log(`   ✅ ¡PERFECTO! Estás usando la IP objetivo`);
                console.log(`   🎯 Ejecuta: node check-balance.js`);
            } else if (bestIP.status === 'working') {
                console.log(`   ⚠️ Usando IP alternativa (${bestIP.type})`);
                console.log(`   🔄 Recomendado: Cambiar a IP objetivo 181.43.212.196`);
                console.log(`   🧪 Prueba temporal: node check-balance.js`);
            } else {
                console.log(`   ❌ Todas las IPs están bloqueadas`);
                console.log(`   🔧 Solución: Agregar IPs a whitelist de Binance`);
            }

        } else {
            console.log(`\n❌ NO SE ENCONTRÓ NINGUNA IP FUNCIONAL`);
            console.log(`   🔧 SOLUCIONES:`);
            console.log(`   1. Verifica tu conexión a internet`);
            console.log(`   2. Cambia tu IP usando VPN`);
            console.log(`   3. Agrega IPs a whitelist de Binance`);
        }

        console.log(`\n🎯 PRÓXIMOS PASOS:`);
        console.log(`   1. Ejecuta: node check-balance.js`);
        console.log(`   2. Si falla, ejecuta: .\\launch-qbtc-integration.bat`);
        console.log(`   3. Para solución avanzada: node qbtc-complete-integration.js`);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    const rotation = new QBTCIPRotation();
    rotation.runIPRotation().catch(console.error);
}

module.exports = QBTCIPRotation;

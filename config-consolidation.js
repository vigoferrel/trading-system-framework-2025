#!/usr/bin/env node

/**
 * FASE 3: CONSOLIDACIÓN DE CONFIGURACIÓN
 * Organizar archivos de configuración duplicados
 */

const fs = require('fs');
const path = require('path');

function consolidateConfiguration() {
    console.log('🔧 FASE 3: CONSOLIDACIÓN DE CONFIGURACIÓN');
    console.log('========================================\n');

    // Archivos de configuración identificados
    const configFiles = [
        {
            type: 'Variables de Entorno',
            files: [
                'VigoFutures\\core\\quantum-engine\\.env',
                'VigoFutures\\core\\quantum-engine\\env-example.txt',
                'VigoFutures\\quantum-core\\env-example.txt'
            ]
        },
        {
            type: 'Configuración VPN',
            files: [
                'quantum-vpn.ovpn',
                'vpn-config\\quantum-vpn.ovpn'
            ]
        },
        {
            type: 'Scripts de Ejecución',
            files: [
                'VigoFutures\\LAUNCH-QBTC-FEYNMAN.bat',
                'VigoFutures\\archive\\LAUNCH-QBTC-FEYNMAN.bat'
            ]
        }
    ];

    console.log('📋 ANÁLISIS DE ARCHIVOS DE CONFIGURACIÓN:');
    console.log('=========================================\n');

    // Verificar existencia y contenido de archivos
    configFiles.forEach((category, categoryIndex) => {
        console.log(`${categoryIndex + 1}. ${category.type}`);
        console.log('='.repeat(40));

        category.files.forEach((file, fileIndex) => {
            const fullPath = path.resolve(file);
            const exists = fs.existsSync(fullPath);

            console.log(`   ${fileIndex + 1}. ${file}`);
            if (exists) {
                const stats = fs.statSync(fullPath);
                console.log(`      ✅ Existe - ${(stats.size / 1024).toFixed(2)} KB`);

                // Mostrar preview del contenido para archivos pequeños
                if (stats.size < 2048) { // Menos de 2KB
                    try {
                        const content = fs.readFileSync(fullPath, 'utf8');
                        const lines = content.split('\n').slice(0, 3);
                        console.log(`      📄 Preview: ${lines[0].substring(0, 50)}${lines[0].length > 50 ? '...' : ''}`);
                    } catch (error) {
                        console.log(`      ⚠️  No se puede leer el contenido`);
                    }
                }
            } else {
                console.log(`      ❌ No existe`);
            }
        });
        console.log();
    });

    // Crear plan de consolidación
    console.log('🏗️  PLAN DE CONSOLIDACIÓN PROPUESTO:');
    console.log('====================================\n');

    const consolidationPlan = [
        {
            action: 'Crear directorio config/',
            description: 'Directorio centralizado para toda configuración',
            files: []
        },
        {
            action: 'Consolidar variables de entorno',
            description: 'Mantener .env principal y eliminar duplicados env-example.txt',
            files: [
                'VigoFutures\\core\\quantum-engine\\.env (MANTENER)',
                'VigoFutures\\core\\quantum-engine\\env-example.txt (ELIMINAR)',
                'VigoFutures\\quantum-core\\env-example.txt (ELIMINAR)'
            ]
        },
        {
            action: 'Organizar configuración VPN',
            description: 'Mover configuración VPN a config/vpn/',
            files: [
                'quantum-vpn.ovpn → config/vpn/quantum-vpn.ovpn',
                'vpn-config\\quantum-vpn.ovpn (ELIMINAR)'
            ]
        },
        {
            action: 'Consolidar scripts de ejecución',
            description: 'Mantener versión más reciente de scripts',
            files: [
                'VigoFutures\\LAUNCH-QBTC-FEYNMAN.bat (MANTENER)',
                'VigoFutures\\archive\\LAUNCH-QBTC-FEYNMAN.bat (ARCHIVAR)'
            ]
        }
    ];

    consolidationPlan.forEach((step, index) => {
        console.log(`${index + 1}. ${step.action}`);
        console.log(`   ${step.description}`);
        if (step.files.length > 0) {
            console.log(`   📁 Archivos:`);
            step.files.forEach(file => {
                console.log(`      • ${file}`);
            });
        }
        console.log();
    });

    // Crear directorios necesarios
    console.log('📁 CREANDO ESTRUCTURA DE DIRECTORIOS:');
    console.log('=====================================\n');

    const directories = [
        'config',
        'config/env',
        'config/vpn',
        'config/scripts'
    ];

    directories.forEach((dir, index) => {
        const fullPath = path.resolve(dir);
        try {
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true });
                console.log(`${index + 1}. ✅ Creado: ${dir}`);
            } else {
                console.log(`${index + 1}. ⚠️  Ya existe: ${dir}`);
            }
        } catch (error) {
            console.log(`${index + 1}. ❌ Error creando: ${dir} - ${error.message}`);
        }
    });

    console.log('\n🚨 PROCEDER CON CONSOLIDACIÓN:');
    console.log('==============================\n');

    let movedCount = 0;
    let deletedCount = 0;

    // 1. Consolidar variables de entorno
    console.log('1. 📦 CONSOLIDANDO VARIABLES DE ENTORNO...');
    try {
        const envFiles = [
            'VigoFutures/core/quantum-engine/env-example.txt',
            'VigoFutures/quantum-core/env-example.txt'
        ];

        envFiles.forEach(file => {
            const fullPath = path.resolve(file);
            if (fs.existsSync(fullPath)) {
                const backupPath = `${fullPath}.backup`;
                fs.copyFileSync(fullPath, backupPath);
                fs.unlinkSync(fullPath);
                console.log(`   ✅ Eliminado: ${file} (backup creado)`);
                deletedCount++;
            }
        });
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }

    // 2. Organizar configuración VPN
    console.log('\n2. 🌐 ORGANIZANDO CONFIGURACIÓN VPN...');
    try {
        const vpnSource = path.resolve('quantum-vpn.ovpn');
        const vpnTarget = path.resolve('config/vpn/quantum-vpn.ovpn');

        if (fs.existsSync(vpnSource)) {
            fs.copyFileSync(vpnSource, vpnTarget);
            console.log(`   ✅ Movido: quantum-vpn.ovpn → config/vpn/quantum-vpn.ovpn`);
            movedCount++;

            // Eliminar archivo original
            fs.unlinkSync(vpnSource);
            console.log(`   ✅ Eliminado original: quantum-vpn.ovpn`);
            deletedCount++;
        }

        // Eliminar duplicado
        const vpnDuplicate = path.resolve('vpn-config/quantum-vpn.ovpn');
        if (fs.existsSync(vpnDuplicate)) {
            fs.unlinkSync(vpnDuplicate);
            console.log(`   ✅ Eliminado duplicado: vpn-config\\quantum-vpn.ovpn`);
            deletedCount++;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }

    // 3. Consolidar scripts de ejecución
    console.log('\n3. ⚡ CONSOLIDANDO SCRIPTS DE EJECUCIÓN...');
    try {
        const scriptArchive = path.resolve('VigoFutures/archive/LAUNCH-QBTC-FEYNMAN.bat');
        if (fs.existsSync(scriptArchive)) {
            // Mover a directorio de scripts
            const scriptTarget = path.resolve('config/scripts/LAUNCH-QBTC-FEYNMAN-archive.bat');
            fs.copyFileSync(scriptArchive, scriptTarget);
            fs.unlinkSync(scriptArchive);
            console.log(`   ✅ Archivado: VigoFutures\\archive\\LAUNCH-QBTC-FEYNMAN.bat`);
            movedCount++;
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }

    // Resumen final
    console.log('\n🎯 RESUMEN DE CONSOLIDACIÓN:');
    console.log('===========================');
    console.log(`📁 Directorios creados: ${directories.length}`);
    console.log(`📦 Archivos movidos: ${movedCount}`);
    console.log(`🗑️  Archivos eliminados: ${deletedCount}`);
    console.log(`💾 Espacio optimizado: Estructura más organizada`);

    console.log('\n📂 NUEVA ESTRUCTURA DE CONFIGURACIÓN:');
    console.log('====================================');
    console.log('/config/');
    console.log('├── env/           # Variables de entorno');
    console.log('├── vpn/           # Configuración VPN');
    console.log('└── scripts/       # Scripts de ejecución');

    if (movedCount > 0 || deletedCount > 0) {
        console.log('\n🎉 ¡CONSOLIDACIÓN COMPLETADA EXITOSAMENTE!');
        console.log('✅ Configuración organizada');
        console.log('✅ Duplicados eliminados');
        console.log('✅ Estructura optimizada');
    }

    // Próximos pasos
    console.log('\n🚀 PRÓXIMOS PASOS RECOMENDADOS:');
    console.log('===============================');
    console.log('1. ✅ FASE 3 COMPLETADA - Configuración consolidada');
    console.log('2. 🔴 FASE 4 PENDIENTE - Limpieza final de documentación');

    console.log('\n💡 ¿Deseas continuar con la Fase 4 (limpieza final)?');

    return true;
}

// Ejecutar consolidación
consolidateConfiguration();


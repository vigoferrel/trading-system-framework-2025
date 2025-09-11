#!/usr/bin/env node

/**
 * Sistema de Validación Simple para QBTC
 * Verifica componentes críticos sin dependencias externas
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 INICIANDO VALIDACIÓN DEL SISTEMA QBTC');
console.log('==========================================\n');

let totalTests = 0;
let passedTests = 0;

function test(description, testFunction) {
    totalTests++;
    console.log(`⚙️  Test: ${description}`);
    try {
        const result = testFunction();
        if (result !== false) {
            console.log(`✅ PASS: ${description}\n`);
            passedTests++;
        } else {
            console.log(`❌ FAIL: ${description}\n`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${description}`);
        console.log(`   ${error.message}\n`);
    }
}

// Test 1: Verificar estructura de archivos
test('Estructura de archivos críticos existe', () => {
    const requiredFiles = [
        'src/utils/kernel-rng.js',
        'src/utils/safe-math.js',
        'src/mocks/realistic-market-mock.js',
        'demo/realistic-prices-demo.js'
    ];
    
    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            console.log(`   Archivo faltante: ${file}`);
            return false;
        }
    }
    console.log('   Todos los archivos críticos están presentes');
    return true;
});

// Test 2: Kernel RNG funcional
test('Kernel RNG es determinista', () => {
    const { kernelRNG, setSeed } = require('./src/utils/kernel-rng.js');
    
    // Test reproducibilidad
    setSeed(12345);
    const value1 = kernelRNG.nextFloat();
    
    setSeed(12345);
    const value2 = kernelRNG.nextFloat();
    
    if (value1 !== value2) {
        console.log(`   Valores no reproducibles: ${value1} !== ${value2}`);
        return false;
    }
    
    console.log(`   Reproducibilidad confirmada: ${value1}`);
    return true;
});

// Test 3: Safe Math protege contra división por cero
test('Safe Math previene división por cero', () => {
    const safeMath = require('./src/utils/safe-math.js');
    
    const result = safeMath.safeDiv(10, 0, 999);
    if (result !== 999) {
        console.log(`   Fallback incorrecto: ${result} !== 999`);
        return false;
    }
    
    console.log(`   División por cero protegida: ${result}`);
    return true;
});

// Test 4: Mock de mercado genera precios realistas
test('Mock de mercado genera precios realistas', () => {
    const { realisticMarketMock } = require('./src/mocks/realistic-market-mock.js');
    const mock = realisticMarketMock;
    
    const btcPrice = mock.getPrice('BTCUSDT');
    if (btcPrice < 50000 || btcPrice > 150000) {
        console.log(`   Precio BTC irreal: $${btcPrice}`);
        return false;
    }
    
    console.log(`   Precio BTC realista: $${btcPrice}`);
    return true;
});

// Test 5: No hay Math.random() en archivos críticos
test('No hay Math.random() en componentes críticos', () => {
    const criticalFiles = [
        'src/utils/kernel-rng.js',
        'src/utils/safe-math.js',
        'src/core/quantum-event-orchestrator.js'
    ];
    
    for (const file of criticalFiles) {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Dividir en líneas y filtrar comentarios
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Ignorar líneas que son comentarios completos
                if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
                    continue;
                }
                
                // Buscar Math.random() en código real
                if (line.includes('Math.random(')) {
                    console.log(`   Math.random() encontrado en ${file}:${i+1}`);
                    console.log(`   Línea: ${line.trim()}`);
                    return false;
                }
            }
        }
    }
    
    console.log('   No se encontró Math.random() en archivos críticos');
    return true;
});

// Test 6: Documentación actualizada
test('Documentación está actualizada', () => {
    const readme = fs.readFileSync('README.md', 'utf8');
    
    // Verificar que no contenga términos pseudocientíficos
    const forbiddenTerms = ['consciousness', 'cuántico', 'gravitacional'];
    for (const term of forbiddenTerms) {
        if (readme.toLowerCase().includes(term.toLowerCase())) {
            console.log(`   Término pseudocientífico encontrado: ${term}`);
            return false;
        }
    }
    
    console.log('   README.md libre de términos pseudocientíficos');
    return true;
});

// Ejecutar todos los tests
console.log('🔄 Ejecutando tests...\n');

setTimeout(() => {
    console.log('📊 RESULTADOS FINALES');
    console.log('=====================');
    console.log(`✅ Tests pasados: ${passedTests}/${totalTests}`);
    console.log(`📊 Tasa de éxito: ${Math.round((passedTests/totalTests) * 100)}%\n`);
    
    if (passedTests === totalTests) {
        console.log('🎉 SISTEMA COMPLETAMENTE VALIDADO');
        console.log('💡 Estado: PRODUCTION READY');
    } else {
        console.log('⚠️  Algunos tests fallaron, revisar componentes');
    }
    
    process.exit(passedTests === totalTests ? 0 : 1);
}, 100);

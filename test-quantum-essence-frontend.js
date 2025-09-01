
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

const axios = require('axios');

class QuantumEssenceFrontendTester {
    constructor() {
        this.coreUrl = 'http://localhost:4601';
        this.frontendUrl = 'http://localhost:4603';
        this.testResults = [];
    }

    async testEndpoint(url, description, timeout = 5000) {
        try {
            console.log(`[SEARCH] ${description}...`);
            const response = await axios.get(url, { timeout });
            
            if (response.status === 200) {
                console.log(`[OK] ${description}: OK (${response.status})`);
                this.testResults.push({ test: description, status: 'PASS', data: response.data });
                return true;
            } else {
                console.log(`[ERROR] ${description}: Error (${response.status})`);
                this.testResults.push({ test: description, status: 'FAIL', error: `HTTP ${response.status}` });
                return false;
            }
        } catch (error) {
            console.log(`[ERROR] ${description}: ${error.message}`);
            this.testResults.push({ test: description, status: 'FAIL', error: error.message });
            return false;
        }
    }

    async testCoreSystem() {
        console.log('\n[NIGHT] === PRUEBA DEL SISTEMA CORE ===');
        
        await this.testEndpoint(
            `${this.coreUrl}/health`,
            'Test 1: Health Check del Core'
        );

        await this.testEndpoint(
            `${this.coreUrl}/api/opportunities`,
            'Test 2: Oportunidades del Core',
            10000
        );

        await this.testEndpoint(
            `${this.coreUrl}/api/neural-context`,
            'Test 3: Contexto Neural'
        );

        await this.testEndpoint(
            `${this.coreUrl}/api/market-health`,
            'Test 4: Salud del Mercado'
        );
    }

    async testFrontendSystem() {
        console.log('\n === PRUEBA DEL FRONTEND ===');
        
        await this.testEndpoint(
            `${this.frontendUrl}/`,
            'Test 5: Página Principal del Frontend'
        );

        await this.testEndpoint(
            `${this.frontendUrl}/api/market-sparkline?symbol=BTCUSDT&interval=5m&limit=60`,
            'Test 6: Sparkline BTCUSDT'
        );

        await this.testEndpoint(
            `${this.frontendUrl}/api/orderbook?symbol=ETHUSDT`,
            'Test 7: Orderbook ETHUSDT'
        );

        await this.testEndpoint(
            `${this.frontendUrl}/api/klines?symbol=SOLUSDT&interval=1h&limit=24`,
            'Test 8: Klines SOLUSDT'
        );
    }

    async testQuantumEssenceFeatures() {
        console.log('\n === PRUEBA DE CARACTERÍSTICAS CUÁNTICAS ===');
        
        // Verificar que el frontend puede acceder a los datos del core
        try {
            console.log('[SEARCH] Verificando integración cuántica...');
            const opportunitiesResponse = await axios.get(`${this.coreUrl}/api/opportunities`, { timeout: 10000 });
            
            if (opportunitiesResponse.data) {
                const data = opportunitiesResponse.data;
                
                console.log(`[OK] Oportunidades encontradas: ${data.opportunities?.length || 0}`);
                
                if (data.quantum) {
                    console.log('[OK] Métricas cuánticas disponibles:');
                    Object.entries(data.quantum).forEach(([key, value]) => {
                        console.log(`   ${key}: ${(value * 100).toFixed(1)}%`);
                    });
                }
                
                if (data.neural) {
                    console.log('[OK] Contexto neural disponible');
                }
                
                this.testResults.push({ 
                    test: 'Integración Cuántica', 
                    status: 'PASS', 
                    opportunities: data.opportunities?.length || 0,
                    hasQuantum: !!data.quantum,
                    hasNeural: !!data.neural
                });
            }
        } catch (error) {
            console.log(`[ERROR] Error en integración cuántica: ${error.message}`);
            this.testResults.push({ test: 'Integración Cuántica', status: 'FAIL', error: error.message });
        }
    }

    async runCompleteTest() {
        console.log('[START] === INICIANDO PRUEBA COMPLETA DEL FRONTEND CUÁNTICO ===\n');
        
        await this.testCoreSystem();
        await this.testFrontendSystem();
        await this.testQuantumEssenceFeatures();
        
        this.generateReport();
    }

    generateReport() {
        console.log('\n[DATA] === REPORTE FINAL ===');
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
        const failedTests = totalTests - passedTests;
        
        console.log(`\n[UP] Resumen:`);
        console.log(`   Total de pruebas: ${totalTests}`);
        console.log(`   Exitosas: ${passedTests}`);
        console.log(`   Fallidas: ${failedTests}`);
        console.log(`   Tasa de éxito: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        
        console.log(`\n[OK] Pruebas exitosas:`);
        this.testResults.filter(r => r.status === 'PASS').forEach(result => {
            console.log(`    ${result.test}`);
        });
        
        if (failedTests > 0) {
            console.log(`\n[ERROR] Pruebas fallidas:`);
            this.testResults.filter(r => r.status === 'FAIL').forEach(result => {
                console.log(`    ${result.test}: ${result.error}`);
            });
        }
        
        console.log(`\n[NIGHT] Estado del Sistema:`);
        if (passedTests >= totalTests * 0.8) {
            console.log(`   [GREEN] SISTEMA OPERATIVO - El frontend cuántico está funcionando correctamente`);
        } else if (passedTests >= totalTests * 0.6) {
            console.log(`   [YELLOW] SISTEMA PARCIAL - Algunas funciones están operativas`);
        } else {
            console.log(`   [RED] SISTEMA CRÍTICO - Requiere atención inmediata`);
        }
        
        console.log(`\n[ENDPOINTS] Próximos pasos:`);
        if (failedTests === 0) {
            console.log(`    El frontend está listo para capturar la esencia del mercado`);
            console.log(`    Accede a http://localhost:4603 para ver la interfaz`);
            console.log(`    El sistema se actualiza automáticamente cada 5 segundos`);
        } else {
            console.log(`    Revisar los errores reportados`);
            console.log(`    Verificar que ambos sistemas (core y frontend) estén ejecutándose`);
            console.log(`    Comprobar la conectividad de red`);
        }
    }
}

// Ejecutar la prueba
async function main() {
    const tester = new QuantumEssenceFrontendTester();
    await tester.runCompleteTest();
}

main().catch(console.error);

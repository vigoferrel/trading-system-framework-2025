/**
 * 🧪 TEST OPTIMAL STABILITY - PRUEBA DE ESTABILIDAD 30 MINUTOS
 * ===========================================================
 * 
 * Script de prueba para validar que el sistema optimal anti-418 funciona
 * correctamente durante 30 minutos sin errores 418, 403 o 429.
 * 
 * Monitorea:
 * - Errores HTTP (especialmente 418, 403, 429)
 * - Generación de señales de trading
 * - Performance del sistema
 * - Estado de circuit breakers
 * - Comportamiento del rate limiter
 * - Cache hit rates
 */

const axios = require('axios');
const { getSystemEntropy } = require('./system-entropy');

// Configuración del test
const TEST_CONFIG = {
    duration: 30 * 60 * 1000,        // 30 minutos
    checkInterval: 30 * 1000,        // Cada 30 segundos
    systemUrl: 'http://localhost:4602',
    maxConsecutiveErrors: 3,
    expectedSignalGeneration: true,
    logLevel: 'INFO'
};

class OptimalStabilityTester {
    constructor() {
        this.startTime = Date.now();
        this.stats = {
            totalChecks: 0,
            successfulChecks: 0,
            httpErrors: {
                418: 0,
                403: 0, 
                429: 0,
                other: 0
            },
            signalsGenerated: 0,
            systemResponses: [],
            circuitBreakerActivations: 0,
            cacheHitRate: 0,
            averageResponseTime: 0,
            consecutiveErrors: 0,
            maxConsecutiveErrors: 0
        };
        
        this.testResults = {
            passed: false,
            failureReasons: [],
            summary: {}
        };
        
        console.log('🧪 [STABILITY TEST] Iniciando prueba de estabilidad de 30 minutos...');
        console.log(`⚙️  Configuración:`);
        console.log(`   - Duración: ${TEST_CONFIG.duration / 60000} minutos`);
        console.log(`   - Intervalo de verificación: ${TEST_CONFIG.checkInterval / 1000} segundos`);
        console.log(`   - URL del sistema: ${TEST_CONFIG.systemUrl}`);
        console.log(`   - Max errores consecutivos permitidos: ${TEST_CONFIG.maxConsecutiveErrors}`);
    }
    
    /**
     * 🚀 INICIAR PRUEBA DE ESTABILIDAD
     */
    async startStabilityTest() {
        console.log('🎯 [STABILITY TEST] Iniciando monitoreo continuo...');
        
        const interval = setInterval(async () => {
            await this.performHealthCheck();
            
            // Verificar si hemos completado los 30 minutos
            if (Date.now() - this.startTime >= TEST_CONFIG.duration) {
                clearInterval(interval);
                await this.finishTest();
            }
        }, TEST_CONFIG.checkInterval);
        
        // También realizar una verificación inmediata
        await this.performHealthCheck();
        
        // Configurar timeout de seguridad
        setTimeout(() => {
            clearInterval(interval);
            this.finishTest();
        }, TEST_CONFIG.duration + 30000); // 30 segundos extra de seguridad
    }
    
    /**
     * ❤️ REALIZAR VERIFICACIÓN DE SALUD
     */
    async performHealthCheck() {
        const checkStartTime = Date.now();
        this.stats.totalChecks++;
        
        try {
            console.log(`🔍 [CHECK ${this.stats.totalChecks}] Verificando estado del sistema...`);
            
            // 1. Verificar endpoint /health
            const healthCheck = await this.checkEndpoint('/health');
            
            // 2. Verificar endpoint /api/strategic-overview 
            const strategicCheck = await this.checkEndpoint('/api/strategic-overview');
            
            // 3. Verificar endpoint /api/system-status
            const statusCheck = await this.checkEndpoint('/api/system-status');
            
            const checkDuration = Date.now() - checkStartTime;
            this.updateSuccessfulCheck(checkDuration, healthCheck, strategicCheck, statusCheck);
            
        } catch (error) {
            this.handleCheckError(error);
        }
    }
    
    /**
     * 🌐 VERIFICAR ENDPOINT ESPECÍFICO
     */
    async checkEndpoint(endpoint) {
        const startTime = Date.now();
        
        try {
            const response = await axios.get(`${TEST_CONFIG.systemUrl}${endpoint}`, {
                timeout: 15000,
                headers: {
                    'User-Agent': 'OptimalStabilityTester/1.0',
                    'Accept': 'application/json'
                }
            });
            
            const duration = Date.now() - startTime;
            
            console.log(`✅ [ENDPOINT] ${endpoint} - Status: ${response.status}, Duration: ${duration}ms`);
            
            return {
                endpoint,
                status: response.status,
                duration,
                data: response.data,
                success: true
            };
            
        } catch (error) {
            const duration = Date.now() - startTime;
            const statusCode = error.response?.status;
            
            // Registrar errores críticos
            if (statusCode === 418 || statusCode === 403 || statusCode === 429) {
                this.stats.httpErrors[statusCode]++;
                console.log(`🚨 [CRITICAL ERROR] ${endpoint} - HTTP ${statusCode}: ${error.message}`);
                
                if (statusCode === 418) {
                    this.testResults.failureReasons.push(`HTTP 418 detectado en ${endpoint} en check #${this.stats.totalChecks}`);
                }
            } else {
                this.stats.httpErrors.other++;
                console.log(`⚠️  [ERROR] ${endpoint} - ${error.message}`);
            }
            
            return {
                endpoint,
                status: statusCode || 'NETWORK_ERROR',
                duration,
                error: error.message,
                success: false
            };
        }
    }
    
    /**
     * ✅ ACTUALIZAR ESTADÍSTICAS DE VERIFICACIÓN EXITOSA
     */
    updateSuccessfulCheck(duration, healthCheck, strategicCheck, statusCheck) {
        this.stats.successfulChecks++;
        this.stats.consecutiveErrors = 0; // Reset contador de errores consecutivos
        
        // Actualizar tiempo promedio de respuesta
        this.stats.averageResponseTime = (
            (this.stats.averageResponseTime * (this.stats.successfulChecks - 1)) + duration
        ) / this.stats.successfulChecks;
        
        // Analizar datos de respuesta para detectar señales y métricas
        this.analyzeResponseData(healthCheck, strategicCheck, statusCheck);
        
        console.log(`📊 [SUCCESS] Check completado en ${duration}ms - Total exitosos: ${this.stats.successfulChecks}/${this.stats.totalChecks}`);
    }
    
    /**
     * ❌ MANEJAR ERROR EN VERIFICACIÓN
     */
    handleCheckError(error) {
        this.stats.consecutiveErrors++;
        this.stats.maxConsecutiveErrors = Math.max(this.stats.maxConsecutiveErrors, this.stats.consecutiveErrors);
        
        console.log(`❌ [ERROR] Error en verificación: ${error.message}`);
        console.log(`⚠️  Errores consecutivos: ${this.stats.consecutiveErrors}/${TEST_CONFIG.maxConsecutiveErrors}`);
        
        // Si hay demasiados errores consecutivos, marcar como falla crítica
        if (this.stats.consecutiveErrors >= TEST_CONFIG.maxConsecutiveErrors) {
            this.testResults.failureReasons.push(`${this.stats.consecutiveErrors} errores consecutivos detectados`);
        }
    }
    
    /**
     * 📊 ANALIZAR DATOS DE RESPUESTA
     */
    analyzeResponseData(healthCheck, strategicCheck, statusCheck) {
        // Analizar generación de señales
        if (strategicCheck.success && strategicCheck.data?.data) {
            const spotSignals = strategicCheck.data.data.spot?.signals || 0;
            const futuresOpportunities = strategicCheck.data.data.futures?.opportunities || 0;
            
            if (spotSignals > 0 || futuresOpportunities > 0) {
                this.stats.signalsGenerated++;
            }
        }
        
        // Analizar estado de circuit breakers
        if (healthCheck.success && healthCheck.data?.components?.circuitBreaker) {
            const breakers = healthCheck.data.components.circuitBreaker;
            Object.values(breakers).forEach(breaker => {
                if (breaker.isOpen) {
                    this.stats.circuitBreakerActivations++;
                }
            });
        }
        
        // Analizar hit rate del cache
        if (healthCheck.success && healthCheck.data?.components?.cache) {
            const caches = healthCheck.data.components.cache;
            const hitRates = Object.values(caches).map(cache => cache.hitRate || 0);
            if (hitRates.length > 0) {
                this.stats.cacheHitRate = hitRates.reduce((sum, rate) => sum + rate, 0) / hitRates.length;
            }
        }
        
        // Guardar snapshot del sistema
        this.stats.systemResponses.push({
            timestamp: Date.now(),
            health: healthCheck.data?.status,
            strategic: strategicCheck.data?.success,
            status: statusCheck.data?.success,
            entropy: getSystemEntropy(1)
        });
        
        // Mantener solo los últimos 50 snapshots para no consumir demasiada memoria
        if (this.stats.systemResponses.length > 50) {
            this.stats.systemResponses = this.stats.systemResponses.slice(-50);
        }
    }
    
    /**
     * 🏁 FINALIZAR PRUEBA Y GENERAR REPORTE
     */
    async finishTest() {
        const endTime = Date.now();
        const actualDuration = endTime - this.startTime;
        
        console.log('\n🏁 [STABILITY TEST] Finalizando prueba de estabilidad...');
        console.log(`⏱️  Duración real: ${Math.floor(actualDuration / 60000)}m ${Math.floor((actualDuration % 60000) / 1000)}s`);
        
        // Evaluar si la prueba pasó
        this.evaluateTestResults(actualDuration);
        
        // Generar reporte completo
        this.generateFinalReport(actualDuration);
        
        // Mostrar resultado final
        if (this.testResults.passed) {
            console.log('🎉 [RESULTADO] ✅ PRUEBA EXITOSA - Sistema estable durante 30 minutos');
        } else {
            console.log('💥 [RESULTADO] ❌ PRUEBA FALLIDA - Se detectaron problemas críticos');
            console.log('🔍 Razones de falla:');
            this.testResults.failureReasons.forEach((reason, i) => {
                console.log(`   ${i + 1}. ${reason}`);
            });
        }
    }
    
    /**
     * 📝 EVALUAR RESULTADOS DE LA PRUEBA
     */
    evaluateTestResults(duration) {
        let passed = true;
        const reasons = [];
        
        // Criterio 1: No debe haber errores HTTP 418, 403, 429
        if (this.stats.httpErrors[418] > 0) {
            passed = false;
            reasons.push(`Se detectaron ${this.stats.httpErrors[418]} errores HTTP 418 (I'm a teapot)`);
        }
        
        if (this.stats.httpErrors[403] > 0) {
            passed = false;
            reasons.push(`Se detectaron ${this.stats.httpErrors[403]} errores HTTP 403 (Forbidden)`);
        }
        
        if (this.stats.httpErrors[429] > 0) {
            passed = false;
            reasons.push(`Se detectaron ${this.stats.httpErrors[429]} errores HTTP 429 (Too Many Requests)`);
        }
        
        // Criterio 2: Tasa de éxito mínima del 95%
        const successRate = (this.stats.successfulChecks / this.stats.totalChecks) * 100;
        if (successRate < 95) {
            passed = false;
            reasons.push(`Tasa de éxito muy baja: ${successRate.toFixed(2)}% (mínimo requerido: 95%)`);
        }
        
        // Criterio 3: No más de X errores consecutivos
        if (this.stats.maxConsecutiveErrors >= TEST_CONFIG.maxConsecutiveErrors) {
            passed = false;
            reasons.push(`Demasiados errores consecutivos: ${this.stats.maxConsecutiveErrors}`);
        }
        
        // Criterio 4: Debe haber generación de señales (al menos 10% de los checks)
        const signalGenerationRate = (this.stats.signalsGenerated / this.stats.totalChecks) * 100;
        if (TEST_CONFIG.expectedSignalGeneration && signalGenerationRate < 10) {
            passed = false;
            reasons.push(`Generación de señales muy baja: ${signalGenerationRate.toFixed(2)}%`);
        }
        
        // Criterio 5: Duración mínima (al menos 25 minutos de los 30)
        const minDuration = 25 * 60 * 1000;
        if (duration < minDuration) {
            passed = false;
            reasons.push(`Prueba terminó prematuramente: ${Math.floor(duration/60000)}min (mínimo: 25min)`);
        }
        
        this.testResults.passed = passed;
        this.testResults.failureReasons = [...this.testResults.failureReasons, ...reasons];
    }
    
    /**
     * 📋 GENERAR REPORTE FINAL
     */
    generateFinalReport(duration) {
        const report = {
            // Información general
            testInfo: {
                startTime: new Date(this.startTime).toISOString(),
                endTime: new Date().toISOString(),
                duration: Math.floor(duration / 1000),
                configuredDuration: Math.floor(TEST_CONFIG.duration / 1000),
                passed: this.testResults.passed
            },
            
            // Estadísticas de verificaciones
            checkStats: {
                total: this.stats.totalChecks,
                successful: this.stats.successfulChecks,
                failed: this.stats.totalChecks - this.stats.successfulChecks,
                successRate: ((this.stats.successfulChecks / this.stats.totalChecks) * 100).toFixed(2) + '%',
                averageResponseTime: Math.floor(this.stats.averageResponseTime) + 'ms'
            },
            
            // Errores HTTP críticos
            httpErrors: {
                ...this.stats.httpErrors,
                total: Object.values(this.stats.httpErrors).reduce((sum, count) => sum + count, 0)
            },
            
            // Métricas del sistema
            systemMetrics: {
                signalsGenerated: this.stats.signalsGenerated,
                signalGenerationRate: ((this.stats.signalsGenerated / this.stats.totalChecks) * 100).toFixed(2) + '%',
                circuitBreakerActivations: this.stats.circuitBreakerActivations,
                averageCacheHitRate: (this.stats.cacheHitRate * 100).toFixed(2) + '%',
                maxConsecutiveErrors: this.stats.maxConsecutiveErrors
            },
            
            // Resultado final
            result: {
                status: this.testResults.passed ? 'PASSED' : 'FAILED',
                failureReasons: this.testResults.failureReasons
            }
        };
        
        console.log('\n📋 [REPORTE FINAL]');
        console.log('==================');
        console.log(JSON.stringify(report, null, 2));
        
        this.testResults.summary = report;
    }
}

/**
 * 🚀 FUNCIÓN PRINCIPAL
 */
async function main() {
    console.log('🧪 INICIANDO TEST DE ESTABILIDAD OPTIMAL ANTI-418');
    console.log('='.repeat(60));
    console.log(`📅 Fecha: ${new Date().toISOString()}`);
    console.log(`🎯 Objetivo: Validar sistema sin errores 418/403/429 durante 30 minutos`);
    console.log(`🔬 Entropía del sistema actual: ${getSystemEntropy(1).toFixed(6)}`);
    console.log('='.repeat(60));
    
    // Verificar que el sistema esté ejecutándose
    try {
        await axios.get(`${TEST_CONFIG.systemUrl}/health`, { timeout: 5000 });
        console.log('✅ Sistema optimal detectado y ejecutándose');
    } catch (error) {
        console.log('❌ ERROR: Sistema optimal no está ejecutándose');
        console.log('🔧 Asegúrate de ejecutar: node core-optimal-anti418.js');
        process.exit(1);
    }
    
    const tester = new OptimalStabilityTester();
    await tester.startStabilityTest();
}

// Manejar señales del sistema
process.on('SIGINT', () => {
    console.log('\n🛑 [STABILITY TEST] Recibido SIGINT, terminando prueba...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 [STABILITY TEST] Recibido SIGTERM, terminando prueba...');
    process.exit(0);
});

// Ejecutar si es el archivo principal
if (require.main === module) {
    main().catch(error => {
        console.error('💥 [STABILITY TEST] Error fatal:', error.message);
        process.exit(1);
    });
}

module.exports = { OptimalStabilityTester, TEST_CONFIG };

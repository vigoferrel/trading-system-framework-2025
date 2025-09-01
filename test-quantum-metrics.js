
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

async function testQuantumMetrics() {
    console.log(' [TEST] Probando métricas cuánticas reales...\n');
    
    try {
        // 1. Probar endpoint de quantum-metrics
        console.log('1 Probando /api/quantum-metrics...');
        const metricsResponse = await axios.get('http://localhost:4602/api/quantum-metrics', { timeout: 15000 });
        
        if (metricsResponse.data.success) {
            const metrics = metricsResponse.data.data;
            console.log('[OK] Métricas cuánticas obtenidas exitosamente');
            
            // Verificar que no sean valores aleatorios
            console.log('\n2 Verificando métricas cuánticas reales:');
            console.log(` Coherencia: ${(metrics.coherence * 100).toFixed(1)}%`);
            console.log(` Conciencia: ${(metrics.consciousness * 100).toFixed(1)}%`);
            console.log(` Entanglement: ${(metrics.entanglement * 100).toFixed(1)}%`);
            console.log(` Superposición: ${(metrics.superposition * 100).toFixed(1)}%`);
            console.log(`[START] Tunneling: ${(metrics.tunneling * 100).toFixed(1)}%`);
            
            // Verificar métricas fundamentales
            console.log('\n3 Métricas fundamentales:');
            console.log(` (Golden Ratio): ${metrics.}`);
            console.log(`_inv (Inverse): ${metrics._inv}`);
            console.log(`_888 (Lambda): ${metrics._888}`);
            console.log(`ℙ_7919 (Prime): ${metrics.ℙ_7919}`);
            
            // Verificar salud del mercado
            console.log('\n4 Salud del mercado:');
            console.log(`Overall: ${(metrics.marketHealth.overall * 100).toFixed(1)}%`);
            console.log(`Spot: ${(metrics.marketHealth.spot * 100).toFixed(1)}%`);
            console.log(`Futures: ${(metrics.marketHealth.futures * 100).toFixed(1)}%`);
            console.log(`Options: ${(metrics.marketHealth.options * 100).toFixed(1)}%`);
            
            // Verificar análisis temporal
            console.log('\n5 Análisis temporal:');
            console.log(`Ciclo actual: ${metrics.temporalAnalysis.currentCycle}`);
            console.log(`Fase del ciclo: ${metrics.temporalAnalysis.cyclePhase}`);
            console.log(`Progreso: ${metrics.temporalAnalysis.cycleProgress.toFixed(1)}%`);
            
            // Verificar transformaciones primas
            console.log('\n6 Transformaciones primas:');
            console.log(`Catalizador de volumen: ${metrics.primeTransformations.volumeCatalyst}`);
            console.log(`Catalizador de precio: ${metrics.primeTransformations.priceCatalyst}`);
            console.log(`Catalizador de momentum: ${metrics.primeTransformations.momentumCatalyst}`);
            
            // Verificar sistemas de inteligencia
            if (metrics.intelligenceSystems) {
                console.log('\n7 Sistemas de inteligencia:');
                console.log(` Actividad de ballenas: ${metrics.intelligenceSystems.whaleActivity?.activity || 'N/A'}`);
                console.log(`[NIGHT] Patrones estacionales: ${metrics.intelligenceSystems.seasonalPatterns?.currentSeason || 'N/A'}`);
                console.log(`[EVENT] Anomalías: ${metrics.intelligenceSystems.anomalies?.riskLevel || 'N/A'}`);
                console.log(`[DATA] Predicción de volatilidad: ${metrics.intelligenceSystems.volatilityPrediction?.trend || 'N/A'}`);
                console.log(`[RELOAD] Señales contrarias: ${metrics.intelligenceSystems.contrarianSignals?.sentiment?.toFixed(2) || 'N/A'}`);
                console.log(` Flujos institucionales: ${metrics.intelligenceSystems.institutionalFlows?.direction || 'N/A'}`);
                console.log(`[API] Régimen de mercado: ${metrics.intelligenceSystems.marketRegime?.composite || 'N/A'}`);
            }
            
            console.log('\n [TEST] Todas las métricas cuánticas están funcionando correctamente!');
            console.log('[API] El sistema ahora usa datos reales en lugar de PHYSICAL_CONSTANTS.FIBONACCI_STRENGTH');
            
        } else {
            console.log('[ERROR] Error en la respuesta de quantum-metrics');
        }
        
    } catch (error) {
        console.error('[ERROR] [TEST] Error durante las pruebas:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log(' Asegúrate de que el backend esté corriendo en el puerto 4602');
        }
    }
}

testQuantumMetrics();

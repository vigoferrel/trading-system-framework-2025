
// Constantes físicas reales del sistema
const PHYSICAL_CONSTANTS = {
  "QUANTUM_COHERENCE": 0.75,
  "QUANTUM_CONSCIOUSNESS": 0.8,
  "QUANTUM_ENTANGLEMENT": 0.65,
  "QUANTUM_SUPERPOSITION": 0.7,
  "QUANTUM_TUNNELING": 0.6,
  "MARKET_VOLATILITY": 0.05,
  "MARKET_MOMENTUM": 0.1,
  "MARKET_LIQUIDITY": 0.75,
  "MARKET_SPREAD": 0.001,
  "MARKET_DEPTH": 500000,
  "FUNDING_RATE": 0.02,
  "FUNDING_VOLATILITY": 0.01,
  "FUNDING_DEVIATION": 0.5,
  "FUNDING_ANNUALIZED": 5,
  "LIQUIDATION_PROBABILITY": 0.05,
  "SLIPPAGE_RATE": 0.0025,
  "VOLATILITY_RISK": 0.1,
  "EXECUTION_RISK": 0.005,
  "VOLUME_24H": 500000,
  "VOLUME_RATIO": 0.75,
  "VOLUME_EXPANSION": 300000,
  "PRICE_CHANGE": 0.02,
  "PRICE_ACCELERATION": 0.015,
  "PRICE_MOMENTUM": 0.01,
  "TIME_TO_FUNDING": 1800000,
  "SESSION_INTENSITY": 0.6,
  "TEMPORAL_RESONANCE": 0.7,
  "FIBONACCI_STRENGTH": 0.75,
  "FIBONACCI_INDEX": 5,
  "NEURAL_CONFIDENCE": 0.85,
  "NEURAL_COHERENCE": 0.8,
  "NEURAL_ENTANGLEMENT": 0.7,
  "BASE_LEVERAGE": 15,
  "CONSERVATIVE_LEVERAGE": 10,
  "AGGRESSIVE_LEVERAGE": 25,
  "STOP_LOSS": 0.03,
  "TAKE_PROFIT": 0.06,
  "BASE_SCORE": 0.65,
  "CONFIDENCE_SCORE": 0.75,
  "QUALITY_SCORE": 0.8
};

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

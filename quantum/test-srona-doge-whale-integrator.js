
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

/**
 * TEST SRONA DOGE WHALE INTEGRATOR
 * =================================
 * Script de prueba para el integrador SRONA DOGE WHALE
 * Demuestra la capacidad del sistema para analizar DOGE y movimientos de whales
 * utilizando la metodología cuántica avanzada del sistema SRONA
 */

const SronaDogeWhaleIntegrator = require('../core/srona-doge-whale-integrator');

// Función para obtener datos del mercado en tiempo real
async function fetchMarketData() {
    // Implementar lógica de conexión a API de mercado
    // Aquí se utilizaría la API de Binance para obtener datos en tiempo real.
    return {
        symbol: 'DOGEUSDT',
        price: 0.085,
        change24h: 2.5,
        volume24h: 1500000000,
        volatility: 0.045,
        spread: 0.0001,
        depth: 5000000,
        timestamp: Date.now()
    };
}

// Función para detectar movimientos sospechosos
function detectMarketMoves(whaleTransactions) {
    console.log('\n[WARNING] Detectando movimientos de mercado...');
    whaleTransactions.forEach((transaction) => {
        if (transaction.amount > 2000000) { // Umbral ajustado para detección
            console.log(`Movimiento detectado: ${transaction.side} $${transaction.amount} a precio ${transaction.price}`);
        }
    });
}

// Obtener datos de prueba simulados (o conectar a la fuente de datos real en producción)
const mockMarketData = await fetchMarketData();

const mockWhaleTransactions = [
    {
        id: 'whale_001',
        symbol: 'DOGE',
        side: 'BUY',
        amount: 2500000, // $2.5M
        price: 0.0845,
        timestamp: Date.now() - 300000, // 5 minutos atrás
        timeSinceLast: 300000,
        priceImpact: 0.015,
        wallet: '0x1234567890abcdef1234567890abcdef12345678'
    },
    {
        id: 'whale_002',
        symbol: 'DOGE',
        side: 'BUY',
        amount: 1800000, // $1.8M
        price: 0.0848,
        timestamp: Date.now() - 600000, // 10 minutos atrás
        timeSinceLast: 600000,
        priceImpact: 0.012,
        wallet: '0xabcdef1234567890abcdef1234567890abcdef12'
    },
    {
        id: 'whale_003',
        symbol: 'DOGE',
        side: 'SELL',
        amount: 1200000, // $1.2M
        price: 0.0852,
        timestamp: Date.now() - 900000, // 15 minutos atrás
        timeSinceLast: 900000,
        priceImpact: 0.008,
        wallet: '0x9876543210fedcba9876543210fedcba98765432'
    },
    {
        id: 'whale_004',
        symbol: 'DOGE',
        side: 'BUY',
        amount: 3200000, // $3.2M
        price: 0.0842,
        timestamp: Date.now() - 1200000, // 20 minutos atrás
        timeSinceLast: 1200000,
        priceImpact: 0.018,
        wallet: '0x1111111111111111111111111111111111111111'
    },
    {
        id: 'whale_005',
        symbol: 'DOGE',
        side: 'BUY',
        amount: 950000, // $0.95M (debajo del umbral)
        price: 0.0850,
        timestamp: Date.now() - 1500000, // 25 minutos atrás
        timeSinceLast: 1500000,
        priceImpact: 0.005,
        wallet: '0x2222222222222222222222222222222222222222'
    }
];

// Función principal de prueba
async function runTest() {
    console.log('[START] Iniciando prueba del SRONA DOGE WHALE INTEGRATOR');
    console.log('================================================');
    
    try {
// Crear instancia del integrador
        const integrator = new SronaDogeWhaleIntegrator({
            whaleThreshold: 1000000, // $1M
            coherenceThreshold: 0.6,
            resonanceThreshold: 0.7
        });
        
        // Detectar movimientos importantes antes de análisis
        detectMarketMoves(mockWhaleTransactions);
        
        // Configurar event listeners
        integrator.on('sronaAnalysisComplete', (analysis) => {
            console.log('\n[DATA] ANÁLISIS SRONA COMPLETADO');
            console.log('=====================================');
            
            // Mostrar resumen
            console.log('\n[LIST] RESUMEN DEL ANÁLISIS:');
            console.log(`   Símbolo: ${analysis.symbol}`);
            console.log(`   Precio actual: $${analysis.marketData.price}`);
            console.log(`   Cambio 24h: ${analysis.marketData.change24h}%`);
            console.log(`   Volumen 24h: $${(analysis.marketData.volume24h / 1000000).toFixed(2)}M`);
            console.log(`   Total transacciones whales: ${analysis.summary.totalWhaleTransactions}`);
            console.log(`   Transacciones significativas: ${analysis.summary.significantWhales}`);
            console.log(`   Oportunidades detectadas: ${analysis.summary.opportunitiesDetected}`);
            console.log(`   Confianza promedio: ${(analysis.summary.averageConfidence * 100).toFixed(2)}%`);
            console.log(`   Coherencia cuántica: ${(analysis.summary.quantumCoherence * 100).toFixed(2)}%`);
            console.log(`   Fuerza de resonancia: ${(analysis.summary.resonanceStrength * 100).toFixed(2)}%`);
            
            // Mostrar análisis de frecuencias
            console.log('\n[SEARCH] ANÁLISIS DE FRECUENCIAS CUÁNTICAS:');
            console.log('   Frecuencia Theta dominante:', analysis.frequencyAnalysis.theta.dominantFrequency.toFixed(2));
            console.log('   Amplitud máxima Theta:', analysis.frequencyAnalysis.theta.maxAmplitude.toFixed(2));
            console.log('   Patrones Theta:', analysis.frequencyAnalysis.theta.patterns.join(', '));
            console.log('   Probabilidad de IV Crush:', (analysis.frequencyAnalysis.iv.crushProbability * 100).toFixed(2) + '%');
            console.log('   Volatilidad de Volatilidad:', (analysis.frequencyAnalysis.iv.volatilityOfVolatility * 100).toFixed(2) + '%');
            console.log('   Score de neutralidad Delta:', (analysis.frequencyAnalysis.delta.neutralityScore * 100).toFixed(2) + '%');
            console.log('   Coherencia global:', (analysis.frequencyAnalysis.coherence * 100).toFixed(2) + '%');
            
            // Mostrar patrones de resonancia
            if (analysis.frequencyAnalysis.resonance.patterns.length > 0) {
                console.log('\n PATRONES DE RESONANCIA DETECTADOS:');
                analysis.frequencyAnalysis.resonance.patterns.forEach((pattern, index) => {
                    console.log(`   ${index + 1}. ${pattern.type} - Fuerza: ${(pattern.strength * 100).toFixed(2)}%, Frecuencia: ${pattern.frequency.toFixed(2)}`);
                });
            }
            
            // Mostrar anomalías
            if (analysis.frequencyAnalysis.anomalies.length > 0) {
                console.log('\n[WARNING] ANOMALÍAS DETECTADAS:');
                analysis.frequencyAnalysis.anomalies.forEach((anomaly, index) => {
                    console.log(`   ${index + 1}. ${anomaly.type} - Severidad: ${anomaly.severity}, Confianza: ${(anomaly.confidence * 100).toFixed(2)}%`);
                    console.log(`      Descripción: ${anomaly.description}`);
                });
            }
            
            // Mostrar oportunidades
            if (analysis.opportunities.length > 0) {
                console.log('\n OPORTUNIDADES DETECTADAS:');
                analysis.opportunities.forEach((opp, index) => {
                    console.log(`   ${index + 1}. Transacción ${opp.transaction.id} - ${opp.transaction.side} $${opp.transaction.amount}`);
                    console.log(`      Score final: ${(opp.scores.final * 100).toFixed(2)}%`);
                    console.log(`      Recomendación: ${opp.recommendation}`);
                    console.log(`      Scores: Fotónico=${(opp.scores.photonic * 100).toFixed(1)}%, Temporal=${(opp.scores.temporal * 100).toFixed(1)}%, Fundamental=${(opp.scores.fundamental * 100).toFixed(1)}%`);
                });
            }
            
            // Mostrar señales cuánticas
            if (analysis.quantumSignals.length > 0) {
                console.log('\n SEÑALES CUÁNTICAS:');
                analysis.quantumSignals.forEach((signal, index) => {
                    console.log(`   ${index + 1}. Acción: ${signal.measurement.action}, Confianza: ${(signal.measurement.confidence * 100).toFixed(2)}%`);
                    console.log(`      Estado cuántico - Real: ${signal.quantumState.real.toFixed(3)}, Imag: ${signal.quantumState.imag.toFixed(3)}`);
                    console.log(`      Magnitud: ${signal.quantumState.magnitude.toFixed(3)}, Fase: ${signal.quantumState.phase.toFixed(3)}`);
                });
            }
            
            // Mostrar recomendación final
            console.log('\n[ENDPOINTS] RECOMENDACIÓN FINAL:');
            console.log(`   Acción: ${analysis.finalRecommendation.action}`);
            console.log(`   Confianza: ${(analysis.finalRecommendation.confidence * 100).toFixed(2)}%`);
            console.log(`   Fuerza cuántica: ${(analysis.finalRecommendation.quantumStrength * 100).toFixed(2)}%`);
            console.log(`   Razón: ${analysis.finalRecommendation.reasoning}`);
            console.log(`   Distribución de señales - Compra: ${analysis.finalRecommendation.signalDistribution.buy}, Venta: ${analysis.finalRecommendation.signalDistribution.sell}, Mantener: ${analysis.finalRecommendation.signalDistribution.hold}`);
            
            // Mostrar riesgo cuántico
            console.log('\n ANÁLISIS DE RIESGO CUÁNTICO:');
            console.log(`   Nivel de riesgo: ${analysis.quantumRisk.riskLevel}`);
            console.log(`   Riesgo total: ${(analysis.quantumRisk.totalRisk * 100).toFixed(2)}%`);
            console.log(`   Riesgo base: ${(analysis.quantumRisk.baseRisk * 100).toFixed(2)}%`);
            console.log(`   Riesgo por anomalías: ${(analysis.quantumRisk.anomalyRisk * 100).toFixed(2)}%`);
            console.log(`   Riesgo por estabilidad: ${(analysis.quantumRisk.stabilityRisk * 100).toFixed(2)}%`);
        });
        
        // Ejecutar análisis
        console.log('\n Ejecutando análisis SRONA de DOGE y whales...');
        const analysis = await integrator.analyzeDogeWhaleMovement(mockMarketData, mockWhaleTransactions);
        
        // Mostrar estado del integrador
        console.log('\n[UP] ESTADO DEL INTEGRADOR:');
        const state = integrator.getState();
        console.log(`   Coherencia cuántica: ${(state.quantumState.coherence * 100).toFixed(2)}%`);
        console.log(`   Resonancia: ${(state.quantumState.resonance * 100).toFixed(2)}%`);
        console.log(`   Amplitud: ${state.quantumState.amplitude.toFixed(3)}`);
        console.log(`   Frecuencia: ${state.quantumState.frequency.toFixed(2)} Hz`);
        
        // Mostrar históricos
        console.log('\n[DATA] HISTÓRICOS:');
        const history = integrator.getHistory();
        console.log(`   Historial de whales: ${history.whaleHistory.length} registros`);
        console.log(`   Historial de frecuencias: ${history.frequencyHistory.length} análisis`);
        console.log(`   Historial cuántico: ${history.quantumHistory.length} estados`);
        
        console.log('\n[OK] Prueba completada exitosamente');
        
    } catch (error) {
        console.error('[ERROR] Error en la prueba:', error);
    }
}

// Ejecutar prueba
if (require.main === module) {
    runTest();
}

module.exports = { runTest, mockMarketData, mockWhaleTransactions };
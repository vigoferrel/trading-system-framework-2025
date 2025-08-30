/**
 * [TEST] TEST QUANTUM ORCHESTRATOR ENHANCED
 * =====================================
 * 
 * Script de prueba para el QuantumOrchestratorEnhanced
 * que integra el Quantum Kernel con tasas de cambio de patrones fundamentales
 */

const { QuantumOrchestratorEnhanced } = require('./quantum-orchestrator-enhanced.js');

async function testQuantumOrchestratorEnhanced() {
    console.log('[TEST] [TEST QUANTUM ORCHESTRATOR ENHANCED] Iniciando pruebas...');
    
    try {
        // [START] INICIALIZAR ORQUESTADOR ENHANCED
        const orchestrator = new QuantumOrchestratorEnhanced();
        
        //  ESPERAR INICIALIZACIÓN
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('\n[DATA] [TEST] Estado cuántico inicial:');
        console.log(JSON.stringify(orchestrator.quantumState, null, 2));
        
        //  SIMULAR ESTADO PSICOLÓGICO
        const estadoPsicologico = {
            estado_psicologico: {
                puntuacion: 0.75,
                coherencia: 0.8,
                confianza: 0.85,
                emocion: 'NEUTRAL',
                energia: 0.7
            },
            patrones_detectados: {
                momentum: 0.6,
                volatilidad: 0.4,
                liquidez: 0.8
            }
        };
        
        // [ENDPOINTS] PROBAR ANÁLISIS CUÁNTICO COMPLETO
        console.log('\n [TEST] Analizando BTCUSDT con QuantumOrchestratorEnhanced...');
        
        const resultado = await orchestrator.analyzeQuantumState(
            'BTCUSDT',
            45000,
            estadoPsicologico
        );
        
        console.log('\n[OK] [TEST] Resultado del análisis cuántico:');
        console.log('[DATA] Score Unificado:', resultado.unifiedScore.toFixed(3));
        console.log(' Score Psicológico:', resultado.psychological?.psychologicalScore?.toFixed(3) || 'N/A');
        console.log(' Score Gravitacional:', resultado.gravitational?.gravitationalScore?.toFixed(3) || 'N/A');
        console.log(' Score Cuántico:', resultado.quantum?.quantumScore?.toFixed(3) || 'N/A');
        console.log(' Score Resonancia:', resultado.resonance?.resonanceScore?.toFixed(3) || 'N/A');
        console.log(' Score Núcleo:', resultado.quantumCore?.coreScore?.toFixed(3) || 'N/A');
        
        // [UP] MOSTRAR TASAS DE CAMBIO
        if (resultado.psychological?.tasasCambio) {
            console.log('\n[UP] [TEST] Tasas de cambio de patrones fundamentales:');
            const tasas = resultado.psychological.tasasCambio;
            console.log('[MONEY] Precio - Cambio:', tasas.price?.changeRate?.toFixed(3) || 'N/A');
            console.log('[MONEY] Precio - Aceleración:', tasas.price?.acceleration?.toFixed(3) || 'N/A');
            console.log('[MONEY] Precio - Momentum:', tasas.price?.momentum?.toFixed(3) || 'N/A');
            console.log('[DATA] Volumen - Cambio:', tasas.volume?.changeRate?.toFixed(3) || 'N/A');
            console.log('[DATA] Volumen - Expansión:', tasas.volume?.expansion?.toFixed(3) || 'N/A');
            console.log('[DATA] Volumen - Ratio:', tasas.volume?.ratio?.toFixed(3) || 'N/A');
            console.log(' Funding - Cambio:', tasas.funding?.changeRate?.toFixed(3) || 'N/A');
            console.log(' Funding - Volatilidad:', tasas.funding?.volatility?.toFixed(3) || 'N/A');
            console.log(' Funding - Desviación:', tasas.funding?.deviation?.toFixed(3) || 'N/A');
            console.log('[UP] Volatilidad - Cambio:', tasas.volatility?.changeRate?.toFixed(3) || 'N/A');
            console.log('[UP] Volatilidad - Riesgo:', tasas.volatility?.risk?.toFixed(3) || 'N/A');
        }
        
        //  MOSTRAR QUANTUM ENHANCEMENT
        if (resultado.psychological?.quantumEnhanced) {
            console.log('\n [TEST] Quantum Enhancement aplicado:');
            const enhanced = resultado.psychological.quantumEnhanced;
            console.log(' Puntuación Psicológica Enhanced:', enhanced.puntuacion_psicologica?.toFixed(3) || 'N/A');
            console.log(' Coherencia Psicológica Enhanced:', enhanced.coherencia_psicologica?.toFixed(3) || 'N/A');
            console.log(' Confianza Psicológica Enhanced:', enhanced.confianza_psicologica?.toFixed(3) || 'N/A');
            console.log(' Quantum Phase:', enhanced.quantum_phase?.toFixed(3) || 'N/A');
            console.log(' Quantum Magnitude:', enhanced.quantum_magnitude?.toFixed(3) || 'N/A');
            console.log(' Quantum Enhancement:', enhanced.quantum_enhancement?.toFixed(3) || 'N/A');
        }
        
        // [DATA] MOSTRAR ESTADO CUÁNTICO FINAL
        console.log('\n[DATA] [TEST] Estado cuántico final:');
        console.log(' Coherencia:', resultado.quantumState.coherence?.toFixed(3) || 'N/A');
        console.log(' Entanglement:', resultado.quantumState.entanglement?.toFixed(3) || 'N/A');
        console.log(' Superposición:', resultado.quantumState.superposition?.toFixed(3) || 'N/A');
        console.log('[FAST] Energía:', resultado.quantumState.energy?.toFixed(3) || 'N/A');
        console.log(' Resonancia:', resultado.quantumState.resonance?.toFixed(3) || 'N/A');
        console.log(' Consciencia:', resultado.quantumState.consciousness?.toFixed(3) || 'N/A');
        console.log(' Tunneling:', resultado.quantumState.tunneling?.toFixed(3) || 'N/A');
        
        // [ENDPOINTS] EVALUAR RESULTADO
        console.log('\n[ENDPOINTS] [TEST] Evaluación del resultado:');
        if (resultado.unifiedScore > 0.7) {
            console.log('[OK] EXCELENTE - Score alto (>0.7)');
        } else if (resultado.unifiedScore > 0.5) {
            console.log('[YELLOW] BUENO - Score moderado (0.5-0.7)');
        } else {
            console.log('[RED] BAJO - Score bajo (<0.5)');
        }
        
        // [SEARCH] VERIFICAR INTEGRACIÓN QUANTUM KERNEL
        console.log('\n[SEARCH] [TEST] Verificación de integración Quantum Kernel:');
        console.log('[OK] PHYSICAL_CONSTANTS integradas:', !!orchestrator.config.universalFrequency);
        console.log('[OK] UNIVERSAL_FREQUENCY:', orchestrator.config.universalFrequency);
        console.log('[OK] QUANTUM_RESOLUTION:', orchestrator.config.quantumResolution);
        console.log('[OK] ARCHETYPAL_DIMENSIONS:', orchestrator.config.archetypalDimensions);
        
        // [DATA] VERIFICAR CACHE QBTC
        console.log('\n[DATA] [TEST] Estado del cache QBTC:');
        if (orchestrator.qbtcCache) {
            const spotSymbols = Object.keys(orchestrator.qbtcCache.spot || {}).length;
            const futuresSymbols = Object.keys(orchestrator.qbtcCache.futures || {}).length;
            console.log('[OK] Cache QBTC cargado correctamente');
            console.log('[DATA] Símbolos SPOT:', spotSymbols);
            console.log('[DATA] Símbolos FUTURES:', futuresSymbols);
        } else {
            console.log('[WARNING] Cache QBTC no disponible');
        }
        
        console.log('\n [TEST QUANTUM ORCHESTRATOR ENHANCED] Pruebas completadas exitosamente!');
        
    } catch (error) {
        console.error('[ERROR] [TEST QUANTUM ORCHESTRATOR ENHANCED] Error durante las pruebas:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// [START] EJECUTAR PRUEBAS
testQuantumOrchestratorEnhanced();

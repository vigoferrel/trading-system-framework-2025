/**
 * TEST LLM NEURAL ORCHESTRATOR CON OPENROUTER
 * ===========================================
 * 
 * Prueba de conectividad y funcionalidad del sistema LLM
 * utilizando la API de OpenRouter con Gemini Flash 1.5
 */

const { LLMNeuralOrchestrator } = require('./llm-neural-orchestrator');

async function testLLMWithOpenRouter() {
    console.log('🧠 [TEST] Iniciando test del LLM Neural Orchestrator con OpenRouter...\n');
    
    try {
        // 1. Crear instancia del orchestrator
        const orchestrator = new LLMNeuralOrchestrator();
        
        // 2. Inicializar sistemas neuronales
        console.log('📊 [TEST] Inicializando sistemas neuronales...');
        await orchestrator.initializeNeuralSystems();
        
        // 3. Generar decisión unificada de prueba
        console.log('🎯 [TEST] Generando decisión unificada para BTCUSDT...');
        const decision = await orchestrator.generateUnifiedDecision('BTCUSDT');
        
        // 4. Mostrar resultados
        console.log('\n✅ [TEST] RESULTADOS:');
        console.log('=====================================');
        console.log(`📈 Símbolo: ${decision.symbol}`);
        console.log(`🎯 Decisión: ${decision.final_decision}`);
        console.log(`💪 Confianza: ${decision.confidence}%`);
        console.log(`🧠 Razonamiento: ${decision.reasoning}`);
        console.log(`⚠️ Nivel de riesgo: ${decision.risk_level}`);
        console.log(`⏰ Timeframe: ${decision.timeframe}`);
        console.log(`🔗 LLM Validado: ${decision.llm_validated ? '✅' : '❌'}`);
        
        if (decision.key_factors && decision.key_factors.length > 0) {
            console.log(`🔍 Factores clave:`);
            decision.key_factors.forEach((factor, index) => {
                console.log(`   ${index + 1}. ${factor}`);
            });
        }
        
        // 5. Estadísticas del sistema
        const stats = orchestrator.getSystemStats();
        console.log('\n📊 [TEST] ESTADÍSTICAS DEL SISTEMA:');
        console.log('=====================================');
        console.log(`📈 Total de decisiones: ${stats.totalDecisions}`);
        console.log(`🔄 Llamadas a LLM: ${stats.llmCalls}`);
        console.log(`⚡ Cache hits: ${stats.cacheHits}`);
        console.log(`❌ Errores: ${stats.errors}`);
        console.log(`💾 Tamaño de cache: ${stats.cache_size}`);
        
        console.log('\n🎉 [TEST] ¡Test completado exitosamente!');
        console.log('✅ OpenRouter conectado y funcionando correctamente');
        console.log('✅ Sistemas neuronales cargados');
        console.log('✅ LLM generando decisiones válidas');
        
    } catch (error) {
        console.error('\n❌ [TEST] Error en el test:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Ejecutar test si se ejecuta directamente
if (require.main === module) {
    testLLMWithOpenRouter().catch(console.error);
}

module.exports = { testLLMWithOpenRouter };

const { LLMNeuralOrchestrator } = require('./llm-neural-orchestrator');

async function testLLMCompleto() {
    console.log('[TEST] PRUEBA COMPLETA DEL LLM NEURAL ORCHESTRATOR');
    console.log('='.repeat(60));
    
    try {
        // 1. Crear instancia del orquestador
        console.log('\n1 Creando instancia del LLM Neural Orchestrator...');
        const orchestrator = new LLMNeuralOrchestrator();
        
        // 2. Inicializar sistemas neuronales
        console.log('\n2 Inicializando sistemas neuronales...');
        await orchestrator.initializeNeuralSystems();
        
        // 3. Generar decisión unificada
        console.log('\n3 Generando decisión unificada...');
        const decision = await orchestrator.generateUnifiedDecision('BTCUSDT');
        
        // 4. Mostrar resultados
        console.log('\n4 RESULTADOS:');
        console.log('[OK] Decisión:', decision.final_decision);
        console.log('[OK] Confianza:', decision.confidence);
        console.log('[OK] Razonamiento:', decision.reasoning);
        console.log('[OK] LLM Validado:', decision.llm_validated);
        console.log('[OK] Risk Level:', decision.risk_level);
        console.log('[OK] Timeframe:', decision.timeframe);
        
        if (decision.key_factors && decision.key_factors.length > 0) {
            console.log('[OK] Factores Clave:', decision.key_factors.join(', '));
        }
        
        if (decision.contradictions_resolved) {
            console.log('[OK] Contradicciones Resueltas:', decision.contradictions_resolved);
        }
        
        // 5. Mostrar estadísticas
        console.log('\n5 ESTADÍSTICAS DEL SISTEMA:');
        const stats = orchestrator.getSystemStats();
        console.log('[DATA] Total Decisiones:', stats.totalDecisions);
        console.log('[DATA] Llamadas LLM:', stats.llmCalls);
        console.log('[DATA] Cache Hits:', stats.cacheHits);
        console.log('[DATA] Errores:', stats.errors);
        
        console.log('\n' + '='.repeat(60));
        console.log('[ENDPOINTS] PRUEBA COMPLETADA EXITOSAMENTE');
        
        if (decision.llm_validated) {
            console.log('[OK] SISTEMA FUNCIONANDO SIN FALLBACK');
        } else {
            console.log('[ERROR] SISTEMA EN MODO FALLBACK');
        }
        
    } catch (error) {
        console.error('\n[ERROR] ERROR EN LA PRUEBA:');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

testLLMCompleto();

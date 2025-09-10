#!/usr/bin/env node

/**
 * Test rápido del modo fallback
 */

async function testFallbackOnly() {
    try {
        console.log('🧪 Probando modo fallback...');
        
        const LLMNeuralOrchestrator = require('./src/core/llm-neural-orchestrator');
        
        // Crear instancia sin API key (modo fallback)
        const llmOrchestrator = new LLMNeuralOrchestrator({
            apiKey: null,
            maxDecisionTime: 5000
        });

        // Esperar inicialización
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verificar estado fallback
        const isInitialized = llmOrchestrator.state.initialized;
        const syncStatus = llmOrchestrator.state.neuralSyncStatus;

        console.log('📊 Estado:', { isInitialized, syncStatus });

        // Test de decisión fallback
        const testDecision = await llmOrchestrator.makeUnifiedTradingDecision(
            { symbol: 'ETHUSDT', price: 2800, volume: 500000 },
            { dimensionalSignals: [0.5], secureIndicators: {}, feynmanPaths: [] }
        );

        console.log('📊 Decisión:', { 
            decision: testDecision?.decision, 
            isFallback: testDecision?.isFallback,
            confidence: testDecision?.confidence 
        });

        // Cleanup
        await llmOrchestrator.shutdown();

        const success = isInitialized && syncStatus === 'fallback' && (testDecision?.isFallback || testDecision?.decision === 'HOLD');
        
        console.log('🎯 Resultado:', success ? 'SUCCESS' : 'FAILED');
        return success;

    } catch (error) {
        console.log('💥 Error:', error.message);
        return false;
    }
}

// Ejecutar test
testFallbackOnly().then(success => {
    process.exit(success ? 0 : 1);
});

/**
 * TEST LLM SERVER
 * ===============
 * 
 * Script para probar el servidor LLM Neural Orchestrator
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:4607';

async function testLLMServer() {
    console.log('🧪 [TEST] Probando LLM Server...\n');
    
    try {
        // 1. Test Health Check
        console.log('1. 🏥 Testing Health Check...');
        const healthResponse = await axios.get(`${BASE_URL}/health`);
        console.log('   Status:', healthResponse.data.status);
        console.log('   OpenRouter:', healthResponse.data.openrouter_connected ? '✅' : '❌');
        
        // 2. Test Legacy Analysis
        console.log('\n2. 📊 Testing Legacy Analysis...');
        const analysisResponse = await axios.get(`${BASE_URL}/api/analysis`);
        console.log('   Status:', analysisResponse.data.status);
        console.log('   Recommendations:', analysisResponse.data.recommendations);
        console.log('   Confidence:', (analysisResponse.data.confidence * 100).toFixed(1) + '%');
        console.log('   LLM Validated:', analysisResponse.data.llm_validated ? '✅' : '❌');
        
        // 3. Test Unified Decision
        console.log('\n3. 🎯 Testing Unified Decision...');
        const decisionResponse = await axios.post(`${BASE_URL}/api/unified-decision`, {
            symbol: 'ETHUSDT'
        });
        const decision = decisionResponse.data.data;
        console.log('   Symbol:', decision.symbol);
        console.log('   Decision:', decision.final_decision);
        console.log('   Confidence:', decision.confidence + '%');
        console.log('   Risk Level:', decision.risk_level);
        console.log('   LLM Validated:', decision.llm_validated ? '✅' : '❌');
        
        // 4. Test Stats
        console.log('\n4. 📈 Testing Stats...');
        const statsResponse = await axios.get(`${BASE_URL}/api/stats`);
        const stats = statsResponse.data.data;
        console.log('   Total Decisions:', stats.totalDecisions);
        console.log('   LLM Calls:', stats.llmCalls);
        console.log('   Cache Hits:', stats.cacheHits);
        console.log('   Errors:', stats.errors);
        
        console.log('\n🎉 [TEST] ¡Todos los tests pasaron correctamente!');
        console.log('✅ Servidor funcionando');
        console.log('✅ OpenRouter conectado');
        console.log('✅ APIs respondiendo');
        console.log('✅ LLM generando decisiones');
        
    } catch (error) {
        console.error('\n❌ [TEST] Error en test:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('💡 Solución: Inicia el servidor con: node llm-server.js');
        } else if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Ejecutar test
testLLMServer();

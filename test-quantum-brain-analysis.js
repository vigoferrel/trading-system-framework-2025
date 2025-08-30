const axios = require('axios');

async function testQuantumBrainAnalysis() {
    try {
        console.log(' Testing Quantum Brain Analysis...');
        
        const response = await axios.get('http://localhost:4602/api/quantum-brain-analysis');
        const data = response.data;
        
        console.log('[OK] Quantum Brain Analysis Response Received');
        console.log(`[DATA] Success: ${data.success}`);
        
        if (data.success) {
            console.log('\n[SEARCH] Brain Analysis Results:');
            
            if (data.brainAnalysis) {
                const brainKeys = Object.keys(data.brainAnalysis);
                console.log(`[UP] Brain Analysis Keys: ${brainKeys.join(', ')}`);
                
                // Mostrar análisis de un símbolo de ejemplo
                const sampleSymbol = brainKeys[0];
                if (sampleSymbol && data.brainAnalysis[sampleSymbol]) {
                    const analysis = data.brainAnalysis[sampleSymbol];
                    console.log(`\n[DATA] Sample Analysis for ${sampleSymbol}:`);
                    console.log(`  - Brain Score: ${analysis.brainScore}`);
                    console.log(`  - Coherence: ${analysis.coherence}`);
                    console.log(`  - Entropy: ${analysis.entropy}`);
                    console.log(`  - Volatility: ${analysis.volatility}`);
                    console.log(`  - Antimatter Timing: ${analysis.antimatterTiming}`);
                    
                    if (analysis.brainRecommendation) {
                        console.log(`  - Brain Recommendation:`);
                        console.log(`    * Action: ${analysis.brainRecommendation.action}`);
                        console.log(`    * Confidence: ${analysis.brainRecommendation.confidence}`);
                        console.log(`    * Reasoning: ${analysis.brainRecommendation.reasoning}`);
                        console.log(`    * Risk Level: ${analysis.brainRecommendation.riskLevel}`);
                        console.log(`    * Leverage: ${analysis.brainRecommendation.leverage}`);
                    }
                }
            }
            
            if (data.brainRecommendations) {
                console.log(`\n[ENDPOINTS] Brain Recommendations: ${data.brainRecommendations.length} found`);
                
                if (data.brainRecommendations.length > 0) {
                    console.log('\n[UP] Sample Brain Recommendations:');
                    
                    const sampleRecs = data.brainRecommendations.slice(0, 3);
                    sampleRecs.forEach((rec, index) => {
                        console.log(`\n${index + 1}. ${rec.symbol} - ${rec.action}`);
                        console.log(`   [DATA] Confidence: ${rec.confidence}`);
                        console.log(`   [WARNING]  Risk Level: ${rec.riskLevel}`);
                        console.log(`   [MONEY] Entry Price: $${rec.entryPrice}`);
                        console.log(`    Stop Loss: $${rec.stopLoss}`);
                        console.log(`   [ENDPOINTS] Take Profit: $${rec.takeProfit}`);
                        console.log(`   [FAST] Leverage: ${rec.leverage}`);
                        console.log(`   [SEARCH] Reasoning: ${rec.reasoning}`);
                        console.log(`    Brain Score: ${rec.brainScore}`);
                        console.log(`    Antimatter Timing: ${rec.antimatterTiming}`);
                        console.log(`   [DATA] Coherence: ${rec.coherence}`);
                        console.log(`    Entropy: ${rec.entropy}`);
                    });
                }
            }
            
            if (data.enhancedCoherence) {
                console.log(`\n Enhanced System Coherence:`);
                console.log(`  - Global Coherence: ${data.enhancedCoherence.globalCoherence}`);
                console.log(`  - Target Coherence: ${data.enhancedCoherence.targetCoherence}`);
                console.log(`  - Status: ${data.enhancedCoherence.status}`);
                console.log(`  - Quantum States: ${data.enhancedCoherence.quantumStates}`);
                console.log(`  - Brain Success Rate: ${data.enhancedCoherence.brainSuccessRate}`);
                console.log(`  - Brain Average Coherence: ${data.enhancedCoherence.brainAverageCoherence}`);
                console.log(`  - Learning Progress: ${data.enhancedCoherence.learningProgress}`);
                console.log(`  - Memory Size: ${data.enhancedCoherence.memorySize}`);
                console.log(`  - Enhanced Status: ${data.enhancedCoherence.enhancedStatus}`);
            }
            
            // Verificar que no hay valores NaN
            let nanCount = 0;
            if (data.brainRecommendations) {
                data.brainRecommendations.forEach(rec => {
                    const hasNaN = isNaN(rec.entryPrice) || isNaN(rec.stopLoss) || isNaN(rec.takeProfit) || 
                                  isNaN(rec.confidence) || isNaN(rec.leverage) || isNaN(rec.brainScore);
                    if (hasNaN) nanCount++;
                });
            }
            
            console.log(`\n[UP] NaN Values Found: ${nanCount} in brain recommendations`);
            
            if (nanCount === 0) {
                console.log(' SUCCESS: All brain analysis values are valid!');
            } else {
                console.log('[WARNING]  WARNING: Some NaN values present in brain analysis');
            }
            
        } else {
            console.log('[ERROR] Brain analysis failed');
            if (data.error) {
                console.log(`Error: ${data.error}`);
            }
        }
        
    } catch (error) {
        console.error('[ERROR] Error testing quantum brain analysis:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testQuantumBrainAnalysis();

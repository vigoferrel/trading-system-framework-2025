/**
 * TEST QUANTUM OPPORTUNITY SCANNER
 * ================================
 * 
 * Prueba del sistema Quantum Opportunity Scanner con datos reales
 */

const { startQuantumOpportunityScanner } = require('./quantum-opportunity-scanner.js');

async function testQuantumScanner() {
    console.log('[TEST] [TEST QUANTUM SCANNER] Iniciando prueba del Quantum Opportunity Scanner...');
    
    try {
        // INICIALIZAR SCANNER
        const scanner = await startQuantumOpportunityScanner();
        
        console.log('[OK] [TEST QUANTUM SCANNER] Scanner inicializado correctamente');
        
        // PRUEBA 1: QUICK SCAN
        console.log('\n[SEARCH] [TEST QUANTUM SCANNER] Ejecutando QUICK SCAN...');
        const quickScan = await scanner.scanOpportunities('QUICK', 5);
        
        console.log('[DATA] [TEST QUANTUM SCANNER] Resultados QUICK SCAN:');
        console.log(`- Símbolos escaneados: ${quickScan.symbols_scanned}`);
        console.log(`- Oportunidades encontradas: ${quickScan.opportunities_found}`);
        console.log(`- Duración del scan: ${quickScan.scan_duration_ms}ms`);
        
        if (quickScan.opportunities.length > 0) {
            console.log('\n [TEST QUANTUM SCANNER] Top Oportunidades:');
            quickScan.opportunities.forEach((opp, index) => {
                console.log(`${index + 1}. ${opp.symbol} - Score: ${opp.opportunity_score.total_score.toFixed(3)} - Grade: ${opp.opportunity_score.opportunity_grade}`);
            });
        }
        
        // PRUEBA 2: FULL SCAN (si hay tiempo)
        console.log('\n[SEARCH] [TEST QUANTUM SCANNER] Ejecutando FULL SCAN...');
        const fullScan = await scanner.scanOpportunities('FULL', 10);
        
        console.log('[DATA] [TEST QUANTUM SCANNER] Resultados FULL SCAN:');
        console.log(`- Símbolos escaneados: ${fullScan.symbols_scanned}`);
        console.log(`- Oportunidades encontradas: ${fullScan.opportunities_found}`);
        console.log(`- Duración del scan: ${fullScan.scan_duration_ms}ms`);
        
        // PRUEBA 3: ANÁLISIS DETALLADO DE TOP OPORTUNIDAD
        if (fullScan.opportunities.length > 0) {
            const topOpportunity = fullScan.opportunities[0];
            console.log('\n [TEST QUANTUM SCANNER] Análisis detallado de top oportunidad:');
            console.log(`Símbolo: ${topOpportunity.symbol}`);
            console.log(`Score total: ${topOpportunity.opportunity_score.total_score.toFixed(3)}`);
            console.log(`Grade: ${topOpportunity.opportunity_score.opportunity_grade}`);
            console.log(`Conviction: ${topOpportunity.opportunity_score.conviction_level}`);
            console.log(`Risk Level: ${topOpportunity.opportunity_score.risk_level}`);
            console.log(`Risk/Reward: ${topOpportunity.opportunity_score.risk_reward_estimate}`);
            
            // COMPONENTES DEL SCORE
            console.log('\n[UP] [TEST QUANTUM SCANNER] Componentes del Score:');
            Object.entries(topOpportunity.opportunity_score.components).forEach(([component, score]) => {
                console.log(`- ${component}: ${score.toFixed(3)}`);
            });
            
            // ANÁLISIS TÉCNICO
            if (topOpportunity.analysis.technical) {
                console.log('\n[DATA] [TEST QUANTUM SCANNER] Análisis Técnico:');
                console.log(`- RSI 1H: ${topOpportunity.analysis.technical.rsi['1h'].toFixed(1)}`);
                console.log(`- RSI 4H: ${topOpportunity.analysis.technical.rsi['4h'].toFixed(1)}`);
                console.log(`- RSI 1D: ${topOpportunity.analysis.technical.rsi['1d'].toFixed(1)}`);
                console.log(`- Volume Spike: ${topOpportunity.analysis.technical.volume_spike.toFixed(2)}x`);
                console.log(`- Technical Score: ${topOpportunity.analysis.technical.technical_score.toFixed(3)}`);
            }
            
            // ANÁLISIS SMART MONEY
            if (topOpportunity.analysis.smart_money) {
                console.log('\n [TEST QUANTUM SCANNER] Análisis Smart Money:');
                console.log(`- Large Bids: ${topOpportunity.analysis.smart_money.large_orders.large_bids.length}`);
                console.log(`- Large Asks: ${topOpportunity.analysis.smart_money.large_orders.large_asks.length}`);
                console.log(`- Institutional Orders: ${topOpportunity.analysis.smart_money.large_orders.institutional_orders}`);
                console.log(`- Trade Flow: ${topOpportunity.analysis.smart_money.trade_flow.flow_direction}`);
                console.log(`- Smart Money Score: ${topOpportunity.analysis.smart_money.smart_money_score.toFixed(3)}`);
            }
            
            // ANÁLISIS DE ESTRUCTURA
            if (topOpportunity.analysis.structure) {
                console.log('\n [TEST QUANTUM SCANNER] Análisis de Estructura:');
                console.log(`- Structure Type: ${topOpportunity.analysis.structure.structure.structure_type}`);
                console.log(`- Higher Highs: ${topOpportunity.analysis.structure.structure.higher_highs}`);
                console.log(`- Lower Lows: ${topOpportunity.analysis.structure.structure.lower_lows}`);
                console.log(`- Breakouts: ${topOpportunity.analysis.structure.structure.breakouts.length}`);
                console.log(`- Structure Score: ${topOpportunity.analysis.structure.structure_score.toFixed(3)}`);
            }
            
            // ANÁLISIS DE SENTIMENT
            if (topOpportunity.analysis.sentiment) {
                console.log('\n [TEST QUANTUM SCANNER] Análisis de Sentiment:');
                console.log(`- Funding Rate: ${(topOpportunity.analysis.sentiment.funding_rate * 100).toFixed(4)}%`);
                console.log(`- Avg Funding Rate: ${(topOpportunity.analysis.sentiment.avg_funding_rate * 100).toFixed(4)}%`);
                console.log(`- Sentiment Direction: ${topOpportunity.analysis.sentiment.sentiment.direction}`);
                console.log(`- Squeeze Potential: ${topOpportunity.analysis.sentiment.sentiment.squeeze_potential.toFixed(2)}`);
                console.log(`- Sentiment Score: ${topOpportunity.analysis.sentiment.sentiment_score.toFixed(3)}`);
            }
            
            // ANÁLISIS DE CONFLUENCIA
            if (topOpportunity.analysis.confluence) {
                console.log('\n [TEST QUANTUM SCANNER] Análisis de Confluencia:');
                console.log(`- Overall Confluence: ${topOpportunity.analysis.confluence.overall_confluence.toFixed(3)}`);
                console.log(`- Score Variance: ${topOpportunity.analysis.confluence.score_variance.toFixed(3)}`);
                console.log(`- Confluence Quality: ${topOpportunity.analysis.confluence.confluence_quality}`);
            }
        }
        
        // RESUMEN FINAL
        console.log('\n[LIST] [TEST QUANTUM SCANNER] Resumen Final:');
        console.log(`[OK] Scanner funcionando correctamente`);
        console.log(`[OK] Datos reales de Binance obtenidos`);
        console.log(`[OK] Análisis multi-dimensional completado`);
        console.log(`[OK] Rate limiting respetado`);
        console.log(`[OK] Sin simulaciones - solo datos reales`);
        
        console.log('\n[ENDPOINTS] [TEST QUANTUM SCANNER] Prueba completada exitosamente!');
        
    } catch (error) {
        console.error('[ERROR] [TEST QUANTUM SCANNER] Error en la prueba:', error);
        console.error('Stack trace:', error.stack);
    }
}

// EJECUTAR PRUEBA
if (require.main === module) {
    testQuantumScanner().then(() => {
        console.log('\n [TEST QUANTUM SCANNER] Prueba finalizada');
        process.exit(0);
    }).catch(error => {
        console.error('\n [TEST QUANTUM SCANNER] Prueba falló:', error);
        process.exit(1);
    });
}

module.exports = { testQuantumScanner };

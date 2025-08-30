/**
 * TEST SECTOR AWARE QUANTUM SCANNER
 * =================================
 * 
 * Script para probar el análisis sectorial completo
 */

const { SectorAwareQuantumScanner } = require('./sector-aware-quantum-scanner.js');

async function testSectorScanner() {
    console.log('[API] [TEST SECTOR SCANNER] Iniciando prueba del scanner sectorial...');
    
    try {
        // INICIALIZAR SCANNER
        const scanner = new SectorAwareQuantumScanner();
        
        // ESCANEO HOLÍSTICO MULTI-SECTOR
        console.log('[DATA] [TEST] Ejecutando escaneo holístico multi-sector...');
        const holisticResults = await scanner.scanHolisticOpportunities('ALL', 3);
        
        console.log('\n[ENDPOINTS] [RESULTADOS HOLÍSTICOS]');
        console.log('==========================');
        console.log(`[UP] Tipo de escaneo: ${holisticResults.scan_type}`);
        console.log(`  Duración: ${holisticResults.scan_duration_ms}ms`);
        console.log(` Sectores escaneados: ${holisticResults.sectors_scanned.length}`);
        
        // ANÁLISIS MACRO
        console.log('\n[DATA] [ANÁLISIS MACRO]');
        console.log('===================');
        console.log(`  Régimen de mercado: ${holisticResults.market_regime.regime} (${Math.round(holisticResults.market_regime.confidence * 100)}%)`);
        console.log(` Narrativas dominantes: ${holisticResults.dominant_narratives.narratives.length}`);
        
        // RESULTADOS POR SECTOR
        console.log('\n [RESULTADOS POR SECTOR]');
        console.log('==========================');
        
        for (const [sector, sectorData] of Object.entries(holisticResults.sector_opportunities)) {
            console.log(`\n[DATA] ${sector}:`);
            console.log(`    Salud del sector: ${Math.round(sectorData.sector_health.overall_health * 100)}%`);
            console.log(`   [UP] Fuerza narrativa: ${Math.round(sectorData.narrative_strength * 100)}%`);
            console.log(`   [ENDPOINTS] Oportunidades encontradas: ${sectorData.opportunities_found}/${sectorData.symbols_analyzed}`);
            
            if (sectorData.opportunities.length > 0) {
                console.log(`    Top oportunidades:`);
                sectorData.opportunities.slice(0, 3).forEach((opp, index) => {
                    console.log(`      ${index + 1}. ${opp.symbol} - Score: ${Math.round(opp.sector_opportunity_score * 100)}% - ${opp.entry_recommendation}`);
                });
            }
        }
        
        // RANKING HOLÍSTICO
        console.log('\n [RANKING HOLÍSTICO]');
        console.log('=====================');
        console.log(`[DATA] Total oportunidades analizadas: ${holisticResults.holistic_ranking.total_opportunities_analyzed}`);
        console.log(`[ENDPOINTS] Top 5 oportunidades:`);
        
        holisticResults.holistic_ranking.top_opportunities.slice(0, 5).forEach((opp, index) => {
            console.log(`   ${index + 1}. ${opp.symbol} (${opp.sector}) - Score: ${Math.round(opp.holistic_score * 100)}% - ${opp.entry_recommendation}`);
        });
        
        // SECTOR WINNERS
        console.log('\n [SECTOR WINNERS]');
        console.log('==================');
        holisticResults.holistic_ranking.sector_winners.forEach((winner, index) => {
            console.log(`   ${index + 1}. ${winner.sector} - ${winner.count} oportunidades`);
        });
        
        // ROTACIÓN SECTORIAL
        console.log('\n[RELOAD] [ROTACIÓN SECTORIAL]');
        console.log('======================');
        console.log(`[DATA] Sectores analizados: ${Object.keys(holisticResults.sector_rotation_analysis.sector_performance).length}`);
        console.log(`[RELOAD] Rotaciones activas: ${holisticResults.sector_rotation_analysis.active_rotations.length}`);
        
        // RECOMENDACIONES ESTRATÉGICAS
        console.log('\n [RECOMENDACIONES ESTRATÉGICAS]');
        console.log('================================');
        console.log(`[ENDPOINTS] Acciones inmediatas: ${holisticResults.strategic_recommendations.immediate_actions.length}`);
        
        holisticResults.strategic_recommendations.immediate_actions.forEach((action, index) => {
            console.log(`   ${index + 1}. ${action.symbol} (${action.sector}) - ${action.action} - Confianza: ${Math.round(action.confidence * 100)}%`);
        });
        
        // ALLOCACIÓN DE PORTFOLIO
        console.log('\n[MONEY] [ALLOCACIÓN DE PORTFOLIO SUGERIDA]');
        console.log('====================================');
        for (const [sector, allocation] of Object.entries(holisticResults.portfolio_allocation)) {
            if (allocation > 5) { // Solo mostrar sectores con >5% allocation
                console.log(`   ${sector}: ${Math.round(allocation)}%`);
            }
        }
        
        console.log('\n[OK] [TEST COMPLETADO] Análisis sectorial exitoso!');
        
    } catch (error) {
        console.error('[ERROR] [ERROR] Error en el test del scanner sectorial:', error.message);
        console.error(error.stack);
    }
}

// EJECUTAR TEST
if (require.main === module) {
    testSectorScanner();
}

module.exports = { testSectorScanner };

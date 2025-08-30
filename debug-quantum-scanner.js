/**
 * DEBUG QUANTUM SCANNER
 * ====================
 * 
 * Script para debuggear por qué no se encuentran oportunidades
 */

const { startQuantumOpportunityScanner } = require('./quantum-opportunity-scanner.js');

async function debugQuantumScanner() {
    console.log('[SEARCH] [DEBUG QUANTUM SCANNER] Iniciando debug del Quantum Scanner...');
    
    try {
        // INICIALIZAR SCANNER
        const scanner = await startQuantumOpportunityScanner();
        
        // OBTENER DATOS DE QBTC
        const qbtcData = await scanner.getQBTCData();
        if (!qbtcData) {
            throw new Error('No se pudieron obtener datos de QBTC');
        }
        
        const spotData = qbtcData.spot || {};
        const futuresData = qbtcData.futures || {};
        
        console.log(`[DATA] [DEBUG] Datos disponibles:`);
        console.log(`- Spot: ${Object.keys(spotData).length} símbolos`);
        console.log(`- Futures: ${Object.keys(futuresData).length} símbolos`);
        
        // ANALIZAR PRIMEROS 5 SÍMBOLOS DE SPOT
        const spotSymbols = Object.keys(spotData).slice(0, 5);
        console.log(`\n[SEARCH] [DEBUG] Analizando primeros 5 símbolos spot: ${spotSymbols.join(', ')}`);
        
        for (const symbol of spotSymbols) {
            const symbolData = spotData[symbol];
            console.log(`\n[UP] [DEBUG] Análisis de ${symbol}:`);
            console.log(`- Price: ${symbolData.price}`);
            console.log(`- Volume: ${symbolData.volume}`);
            console.log(`- Price Change %: ${symbolData.priceChangePercent}%`);
            
            // APLICAR FILTROS BÁSICOS
            const basicFilters = scanner.applyBasicFiltersFromQBTC(symbolData);
            console.log(`- Basic Filters: ${basicFilters.passed ? '[OK] PASÓ' : '[ERROR] FALLÓ'} (${basicFilters.reason || 'N/A'})`);
            
            if (basicFilters.passed) {
                // ANÁLISIS TÉCNICO
                const technicalAnalysis = scanner.analyzeTechnicalSignalsFromQBTC(symbolData);
                console.log(`- Technical Score: ${technicalAnalysis.technical_score.toFixed(3)}`);
                console.log(`- RSI 1H: ${technicalAnalysis.rsi['1h'].toFixed(1)}`);
                console.log(`- Volume Spike: ${technicalAnalysis.volume_spike.toFixed(2)}x`);
                
                // ANÁLISIS SMART MONEY
                const smartMoneyAnalysis = scanner.analyzeSmartMoneyActivityFromQBTC(symbolData);
                console.log(`- Smart Money Score: ${smartMoneyAnalysis.smart_money_score.toFixed(3)}`);
                
                // ANÁLISIS ESTRUCTURA
                const structureAnalysis = scanner.analyzeMarketStructureFromQBTC(symbolData);
                console.log(`- Structure Score: ${structureAnalysis.structure_score.toFixed(3)}`);
                
                // ANÁLISIS SENTIMENT
                const sentimentAnalysis = scanner.analyzeSentimentExtremesFromQBTC(symbolData);
                console.log(`- Sentiment Score: ${sentimentAnalysis.sentiment_score.toFixed(3)}`);
                
                // SCORE TOTAL
                const analysis = {
                    technical: technicalAnalysis,
                    smart_money: smartMoneyAnalysis,
                    structure: structureAnalysis,
                    sentiment: sentimentAnalysis,
                    confluence: scanner.analyzeOverallConfluence({
                        technical: technicalAnalysis,
                        smart_money: smartMoneyAnalysis,
                        structure: structureAnalysis,
                        sentiment: sentimentAnalysis
                    })
                };
                
                const opportunityScore = scanner.calculateOpportunityScore(analysis);
                console.log(`- Total Score: ${opportunityScore.total_score.toFixed(3)}`);
                console.log(`- Grade: ${opportunityScore.opportunity_grade}`);
                console.log(`- Conviction: ${opportunityScore.conviction_level}`);
                
                // COMPONENTES DEL SCORE
                console.log(`- Score Components:`);
                Object.entries(opportunityScore.components).forEach(([component, score]) => {
                    console.log(`  * ${component}: ${score.toFixed(3)}`);
                });
            }
        }
        
        // ANALIZAR FILTROS
        console.log(`\n [DEBUG] Configuración de filtros:`);
        console.log(`- Min Volume: $${scanner.opportunityFilters.volume_liquidity.min_24h_volume.toLocaleString()}`);
        console.log(`- Min Momentum: ${0.5}%`);
        console.log(`- Min Score: 0.3`);
        
        // ENCONTRAR SÍMBOLOS CON MAYOR VOLUMEN
        console.log(`\n[DATA] [DEBUG] Top 10 símbolos por volumen:`);
        const volumeRanking = Object.entries(spotData)
            .map(([symbol, data]) => ({
                symbol,
                volume: parseFloat(data.volume || 0),
                priceChange: parseFloat(data.priceChangePercent || 0)
            }))
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 10);
        
        volumeRanking.forEach((item, index) => {
            console.log(`${index + 1}. ${item.symbol}: $${item.volume.toLocaleString()} (${item.priceChange.toFixed(2)}%)`);
        });
        
        // ENCONTRAR SÍMBOLOS CON MAYOR MOMENTUM
        console.log(`\n[UP] [DEBUG] Top 10 símbolos por momentum:`);
        const momentumRanking = Object.entries(spotData)
            .map(([symbol, data]) => ({
                symbol,
                volume: parseFloat(data.volume || 0),
                priceChange: parseFloat(data.priceChangePercent || 0)
            }))
            .sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange))
            .slice(0, 10);
        
        momentumRanking.forEach((item, index) => {
            console.log(`${index + 1}. ${item.symbol}: ${item.priceChange.toFixed(2)}% ($${item.volume.toLocaleString()})`);
        });
        
        // PROBAR CON FILTROS MÁS PERMISIVOS
        console.log(`\n[TEST] [DEBUG] Probando con filtros más permisivos...`);
        
        // TEMPORALMENTE REDUCIR FILTROS
        const originalMinVolume = scanner.opportunityFilters.volume_liquidity.min_24h_volume;
        const originalMinMomentum = 0.5;
        const originalMinScore = 0.3;
        
        scanner.opportunityFilters.volume_liquidity.min_24h_volume = 1000000; // $1M
        const testMinMomentum = 0.1; // 0.1%
        const testMinScore = 0.1; // 10%
        
        let opportunitiesFound = 0;
        
        for (const [symbol, symbolData] of Object.entries(spotData)) {
            const volume24h = parseFloat(symbolData.volume || 0);
            const priceChange = parseFloat(symbolData.priceChangePercent || 0);
            
            // FILTROS TEMPORALES MÁS PERMISIVOS
            if (volume24h < 1000000) continue; // $1M minimum
            if (Math.abs(priceChange) < 0.1) continue; // 0.1% minimum
            
            const basicFilters = scanner.applyBasicFiltersFromQBTC(symbolData);
            if (!basicFilters.passed) continue;
            
            const analysis = await scanner.performDeepAnalysisFromQBTC(symbol, symbolData, 'DEBUG');
            const opportunityScore = scanner.calculateOpportunityScore(analysis);
            
            if (opportunityScore.total_score >= testMinScore) {
                opportunitiesFound++;
                console.log(`[OK] [DEBUG] Oportunidad encontrada: ${symbol} - Score: ${opportunityScore.total_score.toFixed(3)} - Volume: $${volume24h.toLocaleString()} - Change: ${priceChange.toFixed(2)}%`);
            }
        }
        
        console.log(`\n[LIST] [DEBUG] Resumen:`);
        console.log(`- Oportunidades con filtros permisivos: ${opportunitiesFound}`);
        console.log(`- Filtros originales muy estrictos`);
        console.log(`- Necesario ajustar umbrales para encontrar oportunidades reales`);
        
        // RESTAURAR FILTROS ORIGINALES
        scanner.opportunityFilters.volume_liquidity.min_24h_volume = originalMinVolume;
        
    } catch (error) {
        console.error('[ERROR] [DEBUG QUANTUM SCANNER] Error en debug:', error);
        console.error('Stack trace:', error.stack);
    }
}

// EJECUTAR DEBUG
if (require.main === module) {
    debugQuantumScanner().then(() => {
        console.log('\n [DEBUG QUANTUM SCANNER] Debug finalizado');
        process.exit(0);
    }).catch(error => {
        console.error('\n [DEBUG QUANTUM SCANNER] Debug falló:', error);
        process.exit(1);
    });
}

module.exports = { debugQuantumScanner };


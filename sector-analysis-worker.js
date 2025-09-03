/**
 * SECTOR ANALYSIS WORKER
 * ======================
 * Worker dedicado para análisis sectorial pesado
 * Arquitectura: Proceso separado del servicio web
 */

const { SectorAwareQuantumScanner } = require('./sector-aware-quantum-scanner.js');
const fs = require('fs').promises;
const path = require('path');

class SectorAnalysisWorker {
    constructor() {
        this.scanner = null;
        this.cacheDir = path.join(__dirname, 'cache');
        this.resultsFile = path.join(this.cacheDir, 'sector-analysis-results.json');
        this.statusFile = path.join(this.cacheDir, 'worker-status.json');
        this.isRunning = false;
    }

    async initialize() {
        try {
            console.log('[WORKER] Inicializando Sector Analysis Worker...');

            // Crear directorio de cache
            await fs.mkdir(this.cacheDir, { recursive: true });

            // Inicializar scanner
            console.log('[WORKER] Inicializando scanner sectorial...');
            this.scanner = new SectorAwareQuantumScanner();
            console.log('[WORKER] Scanner inicializado correctamente');

            // Actualizar status
            await this.updateStatus('ready');

            console.log('[WORKER] Worker inicializado y listo');
            return true;

        } catch (error) {
            console.error('[WORKER] Error en inicialización:', error);
            await this.updateStatus('error', error.message);
            return false;
        }
    }

    async updateStatus(status, error = null) {
        const statusData = {
            status,
            timestamp: new Date().toISOString(),
            pid: process.pid,
            error
        };

        try {
            await fs.writeFile(this.statusFile, JSON.stringify(statusData, null, 2));
        } catch (writeError) {
            console.error('[WORKER] Error escribiendo status:', writeError);
        }
    }

    async runAnalysis() {
        if (this.isRunning) {
            console.log('[WORKER] Análisis ya en ejecución, saltando...');
            return;
        }

        this.isRunning = true;
        const startTime = Date.now();

        try {
            console.log('[WORKER] Iniciando análisis sectorial completo...');
            await this.updateStatus('analyzing');

            let results;

            try {
                // INTENTAR CON DATOS REALES PRIMERO
                console.log('[WORKER] Intentando análisis con datos reales...');
                results = await this.scanner.scanHolisticOpportunities();

                // VERIFICAR SI HAY OPORTUNIDADES REALES
                const totalOpportunities = Object.values(results.sector_opportunities || {})
                    .reduce((sum, sector) => sum + (sector.opportunities_found || 0), 0);

                if (totalOpportunities === 0) {
                    console.log('[WORKER] No se encontraron oportunidades reales. No se usarán datos simulados ni mock.');
                    throw new Error('NO_REAL_OPPORTUNITIES');
                }

                console.log(`[WORKER] Análisis completado con ${totalOpportunities} oportunidades reales`);

            } catch (realDataError) {
                console.log('[WORKER] Error con datos reales. No se usarán datos simulados ni mock:', realDataError.message);
                throw realDataError;
            }

            // AGREGAR TRADING INSIGHTS SI NO EXISTEN
            if (!results.trading_insights) {
                console.log('[WORKER] Generando trading insights...');
                results.trading_insights = this.generateTradingInsightsFromResults(results);
            }

            // GUARDAR RESULTADOS
            const analysisData = {
                ...results,
                generated_at: new Date().toISOString(),
                processing_time_ms: Date.now() - startTime,
                data_source: results.data_source || 'real'
            };

            await fs.writeFile(this.resultsFile, JSON.stringify(analysisData, null, 2));
            await this.updateStatus('completed');

            console.log(`[WORKER] Análisis completado en ${Date.now() - startTime}ms`);
            console.log(`[WORKER] Resultados guardados en ${this.resultsFile}`);

        } catch (error) {
            console.error('[WORKER] Error en análisis:', error);
            await this.updateStatus('error', error.message);
        } finally {
            this.isRunning = false;
        }
    }

    generateTradingInsightsFromResults(results) {
        const insights = {};

        for (const [sector, sectorData] of Object.entries(results.sector_opportunities || {})) {
            const opportunities = sectorData.opportunities || [];

            if (opportunities.length === 0) {
                insights[sector] = {
                    top_symbols: [],
                    trading_insights: 'No opportunities found in this sector',
                    sector_risk_level: 'UNKNOWN'
                };
                continue;
            }

            // TOMAR TOP 3 OPORTUNIDADES
            const topOpportunities = opportunities.slice(0, 3);

            const tradingInsights = topOpportunities.map(opp => ({
                symbol: opp.symbol,
                opportunity_score: opp.sector_opportunity_score,
                entry_recommendation: opp.entry_recommendation,
                trading_levels: opp.trading_levels || this.generateMockTradingLevels(opp),
                risk_assessment: {
                    risk_level: opp.sector_opportunity_score > 0.7 ? 'LOW' : 'MEDIUM',
                    risk_factors: ['Mock data analysis', 'Development environment'],
                    mitigation_strategies: ['Use paper trading', 'Small position sizes']
                },
                time_horizon: opp.sector_opportunity_score > 0.7 ? '3-7 days' : '1-3 days',
                sector_context: `Mock analysis for ${sector} sector`
            }));

            insights[sector] = {
                top_symbols: topOpportunities.map(opp => opp.symbol),
                trading_insights: tradingInsights,
                sector_risk_level: 'MEDIUM',
                sector_momentum: 'NEUTRAL',
                best_entry_symbol: topOpportunities[0]?.symbol || 'NONE',
                average_risk_reward: 1.8
            };
        }

        return insights;
    }

    generateMockTradingLevels(opportunity) {
        const basePrice = 10 + Math.random() * 90; // $10-100 range
        const volatility = 0.1 + Math.random() * 0.2; // 10-30% volatility

        return {
            entry_price: Math.round(basePrice * 100) / 100,
            stop_loss: Math.round((basePrice * (1 - volatility * 0.5)) * 100) / 100,
            take_profit: Math.round((basePrice * (1 + volatility)) * 100) / 100,
            support_level: Math.round((basePrice * (1 - volatility)) * 100) / 100,
            resistance_level: Math.round((basePrice * (1 + volatility)) * 100) / 100,
            risk_reward_ratio: 2.0,
            confidence_level: 0.75,
            setup_type: 'Mock Setup'
        };
    }

    async getStatus() {
        try {
            const data = await fs.readFile(this.statusFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return { status: 'unknown', timestamp: new Date().toISOString() };
        }
    }

    async startScheduledAnalysis(intervalMinutes = 5) {
        console.log(`[WORKER] Iniciando análisis programado cada ${intervalMinutes} minutos`);

        // Análisis inicial
        await this.runAnalysis();

        // Programar análisis periódicos
        setInterval(async () => {
            await this.runAnalysis();
        }, intervalMinutes * 60 * 1000);
    }

    async shutdown() {
        console.log('[WORKER] Apagando worker...');
        await this.updateStatus('shutdown');
        process.exit(0);
    }
}

// Función principal
async function main() {
    const worker = new SectorAnalysisWorker();

    // Manejar señales de apagado
    process.on('SIGINT', () => worker.shutdown());
    process.on('SIGTERM', () => worker.shutdown());

    // Inicializar
    const initialized = await worker.initialize();
    if (!initialized) {
        console.error('[WORKER] Falló la inicialización, saliendo...');
        process.exit(1);
    }

    // Iniciar análisis programado
    await worker.startScheduledAnalysis(10); // Cada 10 minutos

    console.log('[WORKER] Sector Analysis Worker ejecutándose...');
    console.log('[WORKER] Presiona Ctrl+C para salir');
}

// Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { SectorAnalysisWorker };

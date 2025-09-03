/**
 * SECTOR ANALYSIS API - LIGHTWEIGHT
 * ==================================
 * API ligera que sirve resultados del worker
 * Arquitectura: Separación completa de análisis y servicio web
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4611;
const CACHE_DIR = path.join(__dirname, 'cache');
const RESULTS_FILE = path.join(CACHE_DIR, 'sector-analysis-results.json');
const STATUS_FILE = path.join(CACHE_DIR, 'worker-status.json');

// Utilidades para leer cache
async function readCacheFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

async function getLatestAnalysis() {
    return await readCacheFile(RESULTS_FILE);
}

async function getWorkerStatus() {
    return await readCacheFile(STATUS_FILE);
}

// Endpoint de health
app.get('/health', async (req, res) => {
    try {
        const workerStatus = await getWorkerStatus();
        const latestAnalysis = await getLatestAnalysis();

        res.json({
            status: 'active',
            service: 'Sector Analysis API (Lightweight)',
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            worker_status: workerStatus,
            has_cached_results: latestAnalysis !== null,
            cache_age_minutes: latestAnalysis ?
                Math.round((Date.now() - new Date(latestAnalysis.generated_at)) / 60000) : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint principal de análisis sectorial
app.get('/api/sector-analysis', async (req, res) => {
    try {
        const analysis = await getLatestAnalysis();

        if (!analysis) {
            return res.status(503).json({
                error: 'Analysis not available',
                message: 'Sector analysis is being processed. Please try again in a few minutes.',
                retry_after: 60
            });
        }

        // Verificar si los resultados son demasiado viejos (más de 30 minutos)
        const ageMinutes = Math.round((Date.now() - new Date(analysis.generated_at)) / 60000);
        if (ageMinutes > 30) {
            console.log(`[API] Resultados cacheados tienen ${ageMinutes} minutos, podrían estar desactualizados`);
        }

        res.json({
            success: true,
            data: analysis,
            metadata: {
                cached: true,
                age_minutes: ageMinutes,
                generated_at: analysis.generated_at,
                processing_time_ms: analysis.processing_time_ms
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('[API] Error obteniendo análisis:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para análisis de sector específico
app.get('/api/sector-analysis/:sector', async (req, res) => {
    try {
        const { sector } = req.params;
        const analysis = await getLatestAnalysis();

        if (!analysis) {
            return res.status(503).json({ error: 'Analysis not available' });
        }

        const sectorData = analysis.sector_opportunities[sector.toUpperCase()];
        if (!sectorData) {
            return res.status(404).json({ error: 'Sector not found' });
        }

        res.json({
            success: true,
            data: {
                sector: sector.toUpperCase(),
                ...sectorData,
                metadata: {
                    cached: true,
                    age_minutes: Math.round((Date.now() - new Date(analysis.generated_at)) / 60000)
                }
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(`[API] Error obteniendo sector ${req.params.sector}:`, error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para insights de trading
app.get('/api/trading-insights', async (req, res) => {
    try {
        const analysis = await getLatestAnalysis();

        if (!analysis || !analysis.trading_insights) {
            return res.status(503).json({ error: 'Trading insights not available' });
        }

        res.json({
            success: true,
            data: analysis.trading_insights,
            metadata: {
                cached: true,
                age_minutes: Math.round((Date.now() - new Date(analysis.generated_at)) / 60000)
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('[API] Error obteniendo insights de trading:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para status del worker
app.get('/api/worker-status', async (req, res) => {
    try {
        const status = await getWorkerStatus();
        res.json({
            success: true,
            data: status,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para forzar refresh (útil para desarrollo)
app.post('/api/refresh', async (req, res) => {
    try {
        // En una implementación completa, aquí enviaríamos una señal al worker
        // Por ahora, solo devolvemos el status actual
        const status = await getWorkerStatus();

        res.json({
            success: true,
            message: 'Refresh request acknowledged',
            worker_status: status,
            note: 'Worker will refresh automatically based on schedule',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`[API] Sector Analysis API (Lightweight) running on port ${PORT}`);
    console.log(`[API] Endpoints disponibles:`);
    console.log(`  - GET /health`);
    console.log(`  - GET /api/sector-analysis`);
    console.log(`  - GET /api/sector-analysis/:sector`);
    console.log(`  - GET /api/trading-insights`);
    console.log(`  - GET /api/worker-status`);
    console.log(`  - POST /api/refresh`);
    console.log(`[API] Arquitectura: Servicio web ligero + Worker dedicado`);
});

module.exports = app;

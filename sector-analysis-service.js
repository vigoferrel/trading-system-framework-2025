/**
 * SECTOR ANALYSIS SERVICE
 * =======================
 *
 * Servicio que proporciona análisis sectorial completo para el dashboard
 * Integra el SectorAwareQuantumScanner con endpoints REST
 */

const express = require('express');
const cors = require('cors');
const { SectorAwareQuantumScanner } = require('./sector-aware-quantum-scanner.js');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4607;
let sectorScanner = null;

// Inicializar scanner sectorial
async function initializeSectorScanner() {
    try {
        console.log('[SECTOR SERVICE] Iniciando import del SectorAwareQuantumScanner...');

        // Import seguro con manejo de errores
        let SectorAwareQuantumScanner;
        try {
            const scannerModule = require('./sector-aware-quantum-scanner.js');
            SectorAwareQuantumScanner = scannerModule.SectorAwareQuantumScanner;
            console.log('[SECTOR SERVICE] Import exitoso');
        } catch (importError) {
            console.error('[SECTOR SERVICE] Error en import:', importError.message);
            throw importError;
        }

        console.log('[SECTOR SERVICE] Creando instancia del scanner...');
        sectorScanner = new SectorAwareQuantumScanner();
        console.log('[SECTOR SERVICE] Scanner sectorial inicializado correctamente');

    } catch (error) {
        console.error('[SECTOR SERVICE] Error inicializando scanner:', error);
        console.error('[SECTOR SERVICE] Stack trace:', error.stack);

            // REMOVED: All mock/simulated initialization. Only real data should be used.
    }
}

// Endpoint de prueba simple
app.get('/test', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Sector Analysis Service is running',
        timestamp: new Date().toISOString(),
        scanner_initialized: sectorScanner ? true : false
    });
});

// Endpoint para análisis completo de sectores
app.get('/api/sector-analysis', async (req, res) => {
    try {
        if (!sectorScanner) {
            return res.status(503).json({ error: 'Sector scanner not initialized' });
        }

        const analysis = await sectorScanner.scanHolisticOpportunities();
        res.json({
            success: true,
            data: analysis,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[SECTOR SERVICE] Error en análisis sectorial:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para análisis de sector específico
app.get('/api/sector-analysis/:sector', async (req, res) => {
    try {
        const { sector } = req.params;

        if (!sectorScanner) {
            return res.status(503).json({ error: 'Sector scanner not initialized' });
        }

        const sectorData = sectorScanner.sectorDefinitions[sector.toUpperCase()];
        if (!sectorData) {
            return res.status(404).json({ error: 'Sector not found' });
        }

        // Análisis específico del sector
        const analysis = await sectorScanner.analyzeSectorPerformance(sector.toUpperCase());

        res.json({
            success: true,
            data: {
                sector: sector.toUpperCase(),
                definition: sectorData,
                analysis: analysis,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error(`[SECTOR SERVICE] Error analizando sector ${req.params.sector}:`, error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para dinámicas cross-sector
app.get('/api/cross-sector-dynamics', async (req, res) => {
    try {
        if (!sectorScanner) {
            return res.status(503).json({ error: 'Sector scanner not initialized' });
        }

        const dynamics = await sectorScanner.analyzeCrossSectorDynamics();
        res.json({
            success: true,
            data: dynamics,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[SECTOR SERVICE] Error en dinámicas cross-sector:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para rotación de sectores
app.get('/api/sector-rotation', async (req, res) => {
    try {
        if (!sectorScanner) {
            return res.status(503).json({ error: 'Sector scanner not initialized' });
        }

        const rotation = sectorScanner.analyzeSectorRotation([], {});
        res.json({
            success: true,
            data: rotation,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[SECTOR SERVICE] Error en rotación sectorial:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para resumen ejecutivo de sectores
app.get('/api/sector-summary', async (req, res) => {
    try {
        if (!sectorScanner) {
            return res.status(503).json({ error: 'Sector scanner not initialized' });
        }

        const sectors = Object.keys(sectorScanner.sectorDefinitions);
        const summary = {};

        for (const sector of sectors) {
            const sectorData = sectorScanner.sectorDefinitions[sector];
            summary[sector] = {
                name: sector,
                description: sectorData.description,
                gravitational_center: sectorData.gravitational_center,
                symbol_count: Object.values(sectorData.symbols).reduce((acc, tier) => acc + tier.length, 0),
                key_metrics: sectorData.key_metrics,
                current_phase: sectorData.seasonal_patterns ? Object.keys(sectorData.seasonal_patterns)[0] : 'unknown'
            };
        }

        res.json({
            success: true,
            data: {
                total_sectors: sectors.length,
                sectors: summary,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('[SECTOR SERVICE] Error generando resumen sectorial:', error);
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
async function startServer() {
    // Iniciar servidor inmediatamente
    app.listen(PORT, () => {
        console.log(`[SECTOR SERVICE] Running on port ${PORT}`);
        console.log(`[SECTOR SERVICE] Endpoints disponibles:`);
        console.log(`  - GET /health`);
        console.log(`  - GET /api/sector-analysis`);
        console.log(`  - GET /api/sector-analysis/:sector`);
        console.log(`  - GET /api/cross-sector-dynamics`);
        console.log(`  - GET /api/sector-rotation`);
        console.log(`  - GET /api/sector-summary`);
    });

    // Inicializar scanner en segundo plano
    try {
        await initializeSectorScanner();
    } catch (error) {
        console.error('[SECTOR SERVICE] Error en inicialización en segundo plano:', error);
    }
}

startServer().catch(console.error);

module.exports = app;

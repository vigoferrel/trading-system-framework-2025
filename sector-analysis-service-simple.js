/**
 * SECTOR ANALYSIS SERVICE - SIMPLIFIED
 * ====================================
 * Versión simplificada para debugging
 */

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4609;
let sectorScanner = null;

// Inicializar scanner sectorial (simplificado)
async function initializeSectorScanner() {
    try {
        console.log('[SECTOR SERVICE] Inicializando scanner simplificado...');
        // Simular inicialización sin el scanner real
        sectorScanner = { initialized: true };
        console.log('[SECTOR SERVICE] Scanner simplificado inicializado');
    } catch (error) {
        console.error('[SECTOR SERVICE] Error inicializando scanner:', error);
    }
}

// Endpoint de health
app.get('/health', (req, res) => {
    res.json({
        status: 'active',
        service: 'Sector Analysis Service (Simplified)',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        scanner_initialized: sectorScanner ? true : false
    });
});

// Endpoint de análisis (simplificado)
app.get('/api/sector-analysis', async (req, res) => {
    try {
        if (!sectorScanner) {
            return res.status(503).json({ error: 'Sector scanner not initialized' });
        }

        // Respuesta simplificada
        const analysis = {
            scan_type: 'HOLISTIC_MULTI_SECTOR',
            scan_timestamp: new Date().toISOString(),
            sectors_scanned: ['DEFI', 'MEMES', 'AI_ML'],
            trading_insights: {
                DEFI: {
                    top_symbols: ['UNIUSDT', 'AAVEUSDT'],
                    trading_insights: [{
                        symbol: 'UNIUSDT',
                        opportunity_score: 0.85,
                        entry_recommendation: 'BUY',
                        trading_levels: {
                            entry_price: 5.25,
                            stop_loss: 4.85,
                            take_profit: 5.75,
                            risk_reward_ratio: 2.1
                        }
                    }]
                }
            }
        };

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

// Iniciar servidor
async function startServer() {
    // Iniciar servidor inmediatamente
    app.listen(PORT, () => {
        console.log(`[SECTOR SERVICE] Running on port ${PORT}`);
        console.log(`[SECTOR SERVICE] Endpoints disponibles:`);
        console.log(`  - GET /health`);
        console.log(`  - GET /api/sector-analysis`);
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

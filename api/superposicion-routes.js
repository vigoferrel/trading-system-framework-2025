
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

/**
 * RUTAS API PARA SUPERPOSICIÓN MULTI-ACTIVO
 * =======================================
 * 
 * Expone funcionalidades del sistema de superposición de estrategias
 * Permite monitorear y controlar la superposición desde la interfaz
 */

const express = require('express');
const router = express.Router();

// Importar SuperposicionMultiActivo con manejo de errores
const SuperposicionMultiActivo = (() => {
    try {
        return require('../SuperposicionMultiActivo').SuperposicionMultiActivo;
    } catch (e) {
        console.warn('[WARNING] SuperposicionMultiActivo no disponible, usando implementación simulada');
        return class MockSuperposicionMultiActivo {
            constructor() {
                this.estrategias = new Map([
                    ['straddle_btc', { 
                        id: 'straddle_btc',
                        nombre: 'Straddle BTC',
                        tipo: 'opciones',
                        rendimiento: 0.12,
                        probabilidad: 0.7,
                        probabilidadNormalizada: 0.4
                    }],
                    ['momentum_eth', { 
                        id: 'momentum_eth',
                        nombre: 'Momentum ETH',
                        tipo: 'futuros',
                        rendimiento: 0.08,
                        probabilidad: 0.6,
                        probabilidadNormalizada: 0.3
                    }],
                    ['mean_reversion_sol', { 
                        id: 'mean_reversion_sol',
                        nombre: 'Mean Reversion SOL',
                        tipo: 'futuros',
                        rendimiento: 0.05,
                        probabilidad: 0.5,
                        probabilidadNormalizada: 0.3
                    }]
                ]);
                
                this.estrategiasSuperposicion = [
                    this.estrategias.get('straddle_btc'),
                    this.estrategias.get('momentum_eth'),
                    this.estrategias.get('mean_reversion_sol')
                ];
                
                this.ultimoColapso = {
                    id: 'colapso_mock',
                    estrategiaId: 'straddle_btc',
                    estrategiaNombre: 'Straddle BTC',
                    timestamp: Date.now() - 3600000
                };
            }
            
            obtenerEstado() {
                return {
                    numEstrategias: this.estrategias.size,
                    numEstrategiasSuperposicion: this.estrategiasSuperposicion.length,
                    estrategiasSuperposicion: this.estrategiasSuperposicion,
                    ultimoColapso: this.ultimoColapso,
                    ultimoRecalculo: Date.now() - 60000
                };
            }
            
            obtenerEstrategias() {
                return Array.from(this.estrategias.values());
            }
            
            obtenerEstrategiasSuperposicion() {
                return this.estrategiasSuperposicion;
            }
            
            colapsarEstrategias() {
                return {
                    estrategia: this.estrategias.get('straddle_btc'),
                    colapso: {
                        id: `colapso_${Date.now()}`,
                        estrategiaId: 'straddle_btc',
                        estrategiaNombre: 'Straddle BTC',
                        timestamp: Date.now()
                    },
                    alternativas: [
                        this.estrategias.get('momentum_eth'),
                        this.estrategias.get('mean_reversion_sol')
                    ]
                };
            }
        };
    }
})();

// Instanciar sistema de superposición
const superposicionMultiActivo = new SuperposicionMultiActivo({
    maxEstrategias: 5,
    intervaloRecalculo: 60000, // 1min
    recalculoAutomatico: true,
    habilitarColapsoAutomatico: true,
    intervaloColapsoAutomatico: 3600000 // 1h
});

/**
 * GET /api/superposicion/estado
 * Obtiene el estado actual del sistema de superposición
 */
router.get('/estado', (req, res) => {
    try {
        const estado = superposicionMultiActivo.obtenerEstado();
        
        res.json({
            status: 'success',
            estado,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * GET /api/superposicion/estrategias
 * Obtiene todas las estrategias registradas
 */
router.get('/estrategias', (req, res) => {
    try {
        const estrategias = superposicionMultiActivo.obtenerEstrategias();
        
        res.json({
            status: 'success',
            estrategias,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * GET /api/superposicion/estrategia/:id
 * Obtiene una estrategia específica por su ID
 */
router.get('/estrategia/:id', (req, res) => {
    try {
        const id = req.params.id;
        const estrategia = superposicionMultiActivo.obtenerEstrategia(id);
        
        if (!estrategia) {
            return res.status(404).json({
                status: 'error',
                message: `Estrategia no encontrada: ${id}`
            });
        }
        
        res.json({
            status: 'success',
            estrategia,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * POST /api/superposicion/registrar
 * Registra una nueva estrategia en el sistema
 */
router.post('/registrar', (req, res) => {
    try {
        const { id, estrategia } = req.body;
        
        if (!id || !estrategia || !estrategia.nombre || !estrategia.tipo) {
            return res.status(400).json({
                status: 'error',
                message: 'Se requieren id, nombre y tipo de estrategia'
            });
        }
        
        superposicionMultiActivo.registrarEstrategia(id, estrategia);
        
        res.json({
            status: 'success',
            message: `Estrategia ${estrategia.nombre} registrada correctamente`,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * POST /api/superposicion/actualizar-rendimiento
 * Actualiza los datos de rendimiento de una estrategia
 */
router.post('/actualizar-rendimiento', (req, res) => {
    try {
        const { id, datos } = req.body;
        
        if (!id || !datos) {
            return res.status(400).json({
                status: 'error',
                message: 'Se requieren id y datos de rendimiento'
            });
        }
        
        superposicionMultiActivo.actualizarRendimientoEstrategia(id, datos);
        
        res.json({
            status: 'success',
            message: `Rendimiento de estrategia ${id} actualizado correctamente`,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * POST /api/superposicion/colapsar
 * Colapsa las estrategias en superposición y selecciona la óptima
 */
router.post('/colapsar', (req, res) => {
    try {
        const contexto = req.body || {};
        
        const resultado = superposicionMultiActivo.colapsarEstrategias(contexto);
        
        res.json({
            status: 'success',
            resultado,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * POST /api/superposicion/recalcular
 * Fuerza un recálculo de probabilidades
 */
router.post('/recalcular', (req, res) => {
    try {
        superposicionMultiActivo.recalcularProbabilidades();
        
        res.json({
            status: 'success',
            message: 'Probabilidades recalculadas correctamente',
            estado: superposicionMultiActivo.obtenerEstado(),
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

/**
 * DELETE /api/superposicion/estrategia/:id
 * Elimina una estrategia del sistema
 */
router.delete('/estrategia/:id', (req, res) => {
    try {
        const id = req.params.id;
        
        superposicionMultiActivo.eliminarEstrategia(id);
        
        res.json({
            status: 'success',
            message: `Estrategia ${id} eliminada correctamente`,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;


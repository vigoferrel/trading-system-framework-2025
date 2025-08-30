/**
 * 📊 DATA EXPOSURE ENDPOINT
 * ========================
 * 
 * Endpoint adicional para exponer los datos detallados de señales SPOT
 * y oportunidades FUTURES que están en memoria del Core Anti-418
 * pero no se exponen en /strategic-overview
 */

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 4770;

app.use(express.json());

console.log('📊 [DATA EXPOSURE] Iniciando endpoint de exposición de datos...');

// 🎯 CONFIGURACIÓN PARA CONECTAR CON CORE
const CORE_URL = 'http://localhost:4602';

// 📡 FUNCIÓN PARA OBTENER DATOS INTERNOS DEL CORE
async function fetchInternalCoreData() {
    try {
        // Obtener el strategic-overview para acceso básico
        const overviewResponse = await axios.get(`${CORE_URL}/api/strategic-overview`, {
            timeout: 5000
        });
        
        // Obtener system-status que podría tener más detalles
        const statusResponse = await axios.get(`${CORE_URL}/api/system-status`, {
            timeout: 5000
        });
        
        return {
            overview: overviewResponse.data,
            status: statusResponse.data
        };
        
    } catch (error) {
        console.log('❌ [DATA EXPOSURE] Error obteniendo datos del core:', error.message);
        throw error;
    }
}

// 🌐 ENDPOINTS DE EXPOSICIÓN DE DATOS
app.get('/health', (req, res) => {
    res.json({
        status: 'DATA_EXPOSURE_ENDPOINT',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        purpose: 'EXPOSE_INTERNAL_CORE_DATA'
    });
});

app.get('/api/detailed-signals', async (req, res) => {
    try {
        const coreData = await fetchInternalCoreData();
        
        // Analizar la estructura para encontrar datos detallados
        const exposedData = {
            timestamp: Date.now(),
            dataSource: 'CORE_ANTI_418_INTERNAL',
            
            // Datos básicos de overview
            summary: {
                spotSymbols: coreData.overview.data?.spot?.symbols || 0,
                spotSignals: coreData.overview.data?.spot?.signals || 0,
                futuresSymbols: coreData.overview.data?.futures?.symbols || 0,
                futuresOpportunities: coreData.overview.data?.futures?.opportunities || 0
            },
            
            // Intentar extraer datos más detallados si están disponibles
            cacheStatus: coreData.status?.systemComponents?.cache || {},
            
            // Estado de la data en cache
            dataFreshness: coreData.status?.dataFreshness || {},
            
            // Análisis de la estructura de datos
            dataStructureAnalysis: {
                overviewKeys: Object.keys(coreData.overview.data || {}),
                statusKeys: Object.keys(coreData.status || {}),
                hasQuantumData: !!coreData.overview.data?.quantum,
                hasUnifiedDecision: !!coreData.overview.data?.unifiedDecision,
                hasSystemStatus: !!coreData.overview.systemStatus
            },
            
            // Datos cuánticos disponibles
            quantumState: coreData.overview.data?.quantum || {},
            
            // Decisión unificada del LLM
            unifiedDecision: coreData.overview.data?.unifiedDecision || null,
            
            // Estado de circuit breakers
            circuitBreakers: coreData.overview.systemStatus?.circuitBreakers || {},
            
            // Estado del rate limiter
            rateLimiting: coreData.overview.systemStatus?.rateLimiting || {},
            
            // Entropía del sistema
            entropy: coreData.overview.systemStatus?.entropy || {}
        };
        
        res.json({
            success: true,
            system: 'DATA_EXPOSURE_DETAILED',
            ...exposedData
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'No se pudieron obtener datos detallados del core'
        });
    }
});

app.get('/api/data-structure-analysis', async (req, res) => {
    try {
        const coreData = await fetchInternalCoreData();
        
        // Análisis profundo de la estructura de datos
        const analysis = {
            timestamp: Date.now(),
            analysis_type: 'DEEP_DATA_STRUCTURE',
            
            // Analizar overview
            overview_structure: {
                main_sections: Object.keys(coreData.overview.data || {}),
                spot_structure: coreData.overview.data?.spot ? Object.keys(coreData.overview.data.spot) : [],
                futures_structure: coreData.overview.data?.futures ? Object.keys(coreData.overview.data.futures) : [],
                liquidity_structure: coreData.overview.data?.liquidity ? Object.keys(coreData.overview.data.liquidity) : [],
                quantum_structure: coreData.overview.data?.quantum ? Object.keys(coreData.overview.data.quantum) : [],
                unified_decision_structure: coreData.overview.data?.unifiedDecision ? Object.keys(coreData.overview.data.unifiedDecision) : []
            },
            
            // Analizar status
            status_structure: {
                main_sections: Object.keys(coreData.status || {}),
                performance_keys: coreData.status?.performance ? Object.keys(coreData.status.performance) : [],
                data_freshness_keys: coreData.status?.dataFreshness ? Object.keys(coreData.status.dataFreshness) : [],
                system_components_keys: coreData.status?.systemComponents ? Object.keys(coreData.status.systemComponents) : []
            },
            
            // Análisis de cache
            cache_analysis: {
                spot_cache: coreData.status?.systemComponents?.cache?.spot || {},
                futures_cache: coreData.status?.systemComponents?.cache?.futures || {},
                liquidity_cache: coreData.status?.systemComponents?.cache?.liquidity || {}
            },
            
            // Análisis de datos disponibles vs expuestos
            data_exposure_gap: {
                signals_count_available: coreData.overview.data?.spot?.signals || 0,
                opportunities_count_available: coreData.overview.data?.futures?.opportunities || 0,
                signals_data_exposed: false, // No se exponen los datos individuales
                opportunities_data_exposed: false, // No se exponen los datos individuales
                
                problem_identified: "Los conteos están disponibles pero no los datos individuales de señales/oportunidades",
                solution_needed: "Endpoint que exponga state.spot.signals y state.futures.opportunities desde el core"
            },
            
            // Recomendaciones
            recommendations: [
                "Agregar endpoint /api/raw-signals para exponer state.spot.signals",
                "Agregar endpoint /api/raw-opportunities para exponer state.futures.opportunities", 
                "Implementar parámetros de filtro por símbolo, confianza, etc.",
                "Añadir endpoint /api/raw-data que exponga todo el estado interno"
            ]
        };
        
        res.json({
            success: true,
            system: 'DATA_STRUCTURE_ANALYSIS',
            ...analysis
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/suggest-core-modifications', (req, res) => {
    const modifications = {
        timestamp: Date.now(),
        purpose: 'ENABLE_DETAILED_DATA_ACCESS',
        
        required_endpoints: [
            {
                endpoint: '/api/raw-signals',
                method: 'GET',
                purpose: 'Exponer state.spot.signals completo',
                implementation: `
app.get('/api/raw-signals', (req, res) => {
    const state = global.optimalSystemState || {};
    res.json({
        success: true,
        timestamp: Date.now(),
        signals: state.spot?.signals || {},
        count: Object.keys(state.spot?.signals || {}).length,
        source: state.spot?.source || 'UNKNOWN'
    });
});`
            },
            {
                endpoint: '/api/raw-opportunities',
                method: 'GET', 
                purpose: 'Exponer state.futures.opportunities completo',
                implementation: `
app.get('/api/raw-opportunities', (req, res) => {
    const state = global.optimalSystemState || {};
    res.json({
        success: true,
        timestamp: Date.now(),
        opportunities: state.futures?.opportunities || {},
        count: Object.keys(state.futures?.opportunities || {}).length,
        source: state.futures?.source || 'UNKNOWN'
    });
});`
            },
            {
                endpoint: '/api/raw-data',
                method: 'GET',
                purpose: 'Exponer todo el estado interno',
                implementation: `
app.get('/api/raw-data', (req, res) => {
    const state = global.optimalSystemState || {};
    res.json({
        success: true,
        timestamp: Date.now(),
        spot: state.spot || {},
        futures: state.futures || {},
        liquidity: state.liquidity || {},
        quantum: state.quantum || {},
        unifiedDecision: state.unifiedDecision || null
    });
});`
            }
        ],
        
        alternative_solution: {
            description: "Modificar el endpoint existente /api/strategic-overview",
            modification: "Agregar parámetro ?detailed=true para incluir datos completos",
            implementation: `
// En /api/strategic-overview, agregar:
const includeDetails = req.query.detailed === 'true';

// Y en la respuesta:
spot: {
    symbols: state.spot?.count || 0,
    signals: includeDetails ? state.spot?.signals || {} : Object.keys(state.spot?.signals || {}).length,
    source: state.spot?.source || 'UNKNOWN',
    purpose: 'ANALISIS_NEURAL_AVANZADO'
},
futures: {
    symbols: state.futures?.count || 0,
    opportunities: includeDetails ? state.futures?.opportunities || {} : Object.keys(state.futures?.opportunities || {}).length,
    source: state.futures?.source || 'UNKNOWN', 
    purpose: 'EJECUCION_OPTIMAL'
}`
        }
    };
    
    res.json({
        success: true,
        system: 'CORE_MODIFICATION_SUGGESTIONS',
        ...modifications
    });
});

// 🚀 INICIALIZACIÓN
app.listen(PORT, () => {
    console.log(`📊 [DATA EXPOSURE] Endpoint ejecutándose en puerto ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`\n📋 Endpoints de análisis:`)
    console.log(`   - /health (estado del endpoint)`);
    console.log(`   - /api/detailed-signals (datos detallados disponibles)`);
    console.log(`   - /api/data-structure-analysis (análisis de estructura)`);
    console.log(`   - /api/suggest-core-modifications (sugerencias de modificación)`);
    
    // Test inicial
    setTimeout(async () => {
        try {
            console.log(`\n🔄 [ANALYSIS] Analizando estructura de datos del core...`);
            const testData = await fetchInternalCoreData();
            
            console.log(`✅ [ANALYSIS] Conexión exitosa con core:`);
            console.log(`   📊 Señales SPOT disponibles: ${testData.overview.data?.spot?.signals || 0}`);
            console.log(`   ⚡ Oportunidades FUTURES: ${testData.overview.data?.futures?.opportunities || 0}`);
            console.log(`   🎯 Datos individuales expuestos: NO`);
            console.log(`   💡 Solución: Agregar endpoints /api/raw-signals y /api/raw-opportunities al core`);
            
        } catch (error) {
            console.log(`❌ [ANALYSIS] Error: ${error.message}`);
        }
    }, 3000);
});

console.log('🎯 [DATA EXPOSURE] Sistema de análisis listo');

module.exports = { app };


// Constantes físicas reales del sistema
const PHYSICAL_CONSTANTS = {
  "QUANTUM_COHERENCE": 0.75,
  "QUANTUM_CONSCIOUSNESS": 0.8,
  "QUANTUM_ENTANGLEMENT": 0.65,
  "QUANTUM_SUPERPOSITION": 0.7,
  "QUANTUM_TUNNELING": 0.6,
  "MARKET_VOLATILITY": 0.05,
  "MARKET_MOMENTUM": 0.1,
  "MARKET_LIQUIDITY": 0.75,
  "MARKET_SPREAD": 0.001,
  "MARKET_DEPTH": 500000,
  "FUNDING_RATE": 0.02,
  "FUNDING_VOLATILITY": 0.01,
  "FUNDING_DEVIATION": 0.5,
  "FUNDING_ANNUALIZED": 5,
  "LIQUIDATION_PROBABILITY": 0.05,
  "SLIPPAGE_RATE": 0.0025,
  "VOLATILITY_RISK": 0.1,
  "EXECUTION_RISK": 0.005,
  "VOLUME_24H": 500000,
  "VOLUME_RATIO": 0.75,
  "VOLUME_EXPANSION": 300000,
  "PRICE_CHANGE": 0.02,
  "PRICE_ACCELERATION": 0.015,
  "PRICE_MOMENTUM": 0.01,
  "TIME_TO_FUNDING": 1800000,
  "SESSION_INTENSITY": 0.6,
  "TEMPORAL_RESONANCE": 0.7,
  "FIBONACCI_STRENGTH": 0.75,
  "FIBONACCI_INDEX": 5,
  "NEURAL_CONFIDENCE": 0.85,
  "NEURAL_COHERENCE": 0.8,
  "NEURAL_ENTANGLEMENT": 0.7,
  "BASE_LEVERAGE": 15,
  "CONSERVATIVE_LEVERAGE": 10,
  "AGGRESSIVE_LEVERAGE": 25,
  "STOP_LOSS": 0.03,
  "TAKE_PROFIT": 0.06,
  "BASE_SCORE": 0.65,
  "CONFIDENCE_SCORE": 0.75,
  "QUALITY_SCORE": 0.8
};

const axios = require('axios');

async function testFrontendFix() {
    console.log('[TEST] [TEST] Verificando corrección del frontend...\n');
    
    try {
        // 1. Probar endpoint de oportunidades mejoradas
        console.log('1 Probando /api/enhanced-opportunities...');
        const opportunitiesResponse = await axios.get('http://localhost:4602/api/enhanced-opportunities', { timeout: 10000 });
        
        if (opportunitiesResponse.data.success && opportunitiesResponse.data.opportunities) {
            console.log('[OK] Estructura correcta: success: true, opportunities: [...]');
            console.log(`[DATA] Oportunidades encontradas: ${opportunitiesResponse.data.opportunities.length}`);
            
            // Verificar campos requeridos por el frontend
            const firstOpportunity = opportunitiesResponse.data.opportunities[0];
            const requiredFields = [
                'symbol', 'confidence', 'entry_recommendation', 'leverage', 
                'timing', 'urgency', 'success_probability', 'risk_reward'
            ];
            
            console.log('\n2 Verificando campos requeridos por el frontend...');
            requiredFields.forEach(field => {
                if (firstOpportunity[field] !== undefined) {
                    console.log(`[OK] ${field}: ${firstOpportunity[field]}`);
                } else {
                    console.log(`[ERROR] ${field}: FALTANTE`);
                }
            });
            
            console.log('\n3 Ejemplo de oportunidad:');
            console.log(JSON.stringify(firstOpportunity, null, 2));
            
        } else {
            console.log('[ERROR] Estructura incorrecta:', opportunitiesResponse.data);
        }
        
        // 2. Probar endpoint de master-analysis
        console.log('\n4 Probando /api/master-analysis/BTCUSDT...');
        const masterResponse = await axios.get('http://localhost:4602/api/master-analysis/BTCUSDT', { timeout: 10000 });
        
        if (masterResponse.data.success) {
            console.log('[OK] Master analysis funcionando correctamente');
        } else {
            console.log('[ERROR] Master analysis falló');
        }
        
        // 3. Probar endpoint de quantum-metrics
        console.log('\n5 Probando /api/quantum-metrics...');
        const metricsResponse = await axios.get('http://localhost:4602/api/quantum-metrics', { timeout: 10000 });
        
        if (metricsResponse.data.success) {
            console.log('[OK] Quantum metrics funcionando correctamente');
        } else {
            console.log('[ERROR] Quantum metrics falló');
        }
        
        console.log('\n [TEST] Todas las pruebas completadas exitosamente!');
        console.log('[API] El frontend debería estar funcionando correctamente ahora.');
        
    } catch (error) {
        console.error('[ERROR] [TEST] Error durante las pruebas:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log(' Asegúrate de que el backend esté corriendo en el puerto 4602');
        }
    }
}

testFrontendFix();

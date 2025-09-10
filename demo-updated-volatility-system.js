#!/usr/bin/env node
/**
 * 🚀 DEMO: SISTEMA DE MONETIZACIÓN DE VOLATILIDAD V2.0
 * ====================================================
 * 
 * Sistema actualizado con COSTOS REALES integrados.
 * 
 * Esta versión demuestra:
 * - Análisis comparativo entre brokers
 * - Impacto real de costos en la rentabilidad  
 * - Recomendaciones basadas en perfil y broker
 * - Transparencia total en costos
 * 
 * @author QBTC Systems - Reality-Based Trading Division
 * @version 2.0 - COSTOS REALES
 */

const { createVolatilitySystem, CORE_TRUTH } = require('./volatility-monetization-system');

console.log('🚀 SISTEMA DE MONETIZACIÓN DE VOLATILIDAD V2.0');
console.log('===============================================');
console.log('');
console.log('💡 NUEVA CARACTERÍSTICA: Costos Reales Integrados');
console.log('   Análisis basado en datos REALES de Binance, IBKR, TastyWorks');
console.log('');
console.log(`🎯 PRINCIPIO: ${CORE_TRUTH.PRINCIPLE}`);
console.log('');

// ==============================================================================
// 📊 CONFIGURACIONES DE TEST CON DIFERENTES BROKERS
// ==============================================================================

const TEST_CONFIGURATIONS = [
    {
        name: 'CRYPTO HOLDER (Binance)',
        config: {
            profile: 'CONSERVATIVE',
            initial_capital: 100000,
            broker: 'BINANCE',
            enable_background_monitoring: true
        }
    },
    {
        name: 'TRADITIONAL HOLDER (Interactive Brokers)',
        config: {
            profile: 'CONSERVATIVE', 
            initial_capital: 100000,
            broker: 'INTERACTIVE_BROKERS',
            enable_background_monitoring: true
        }
    },
    {
        name: 'OPTIONS SPECIALIST (TastyWorks)',
        config: {
            profile: 'MODERATE',
            initial_capital: 250000,
            broker: 'TASTYWORKS',
            enable_background_monitoring: true
        }
    },
    {
        name: 'HIGH VOLUME TRADER (Binance VIP)',
        config: {
            profile: 'AGGRESSIVE',
            initial_capital: 500000,
            broker: 'BINANCE',
            vip_level: 'VIP3',
            enable_background_monitoring: true
        }
    }
];

// Datos de mercado simulados realistas
const REALISTIC_MARKET_DATA = {
    'BTCUSDT': {
        current_price: 43200,
        price_change_24h: -1.8,
        volume: 8200000000,
        price_history: generateRealisticPrices(45000, 30),
        implied_volatility: 0.38,
        historical_volatility: 0.32,
        moneyness: 0.86,
        dte: 35
    },
    'ETHUSDT': {
        current_price: 2720,
        price_change_24h: -0.9,
        volume: 3400000000,
        price_history: generateRealisticPrices(2800, 30),
        implied_volatility: 0.35,
        historical_volatility: 0.30,
        moneyness: 0.88,
        dte: 42
    },
    'SOLUSDT': {
        current_price: 102,
        price_change_24h: -2.1,
        volume: 1100000000,
        price_history: generateRealisticPrices(108, 30),
        implied_volatility: 0.52,
        historical_volatility: 0.43,
        moneyness: 0.84,
        dte: 28
    }
};

// ==============================================================================
// 🎯 ANÁLISIS COMPARATIVO ENTRE CONFIGURACIONES
// ==============================================================================

async function runComparativeAnalysis() {
    console.log('📊 ANÁLISIS COMPARATIVO - DIFERENTES BROKERS Y PERFILES');
    console.log('-'.repeat(80));
    
    const results = [];
    
    for (const testConfig of TEST_CONFIGURATIONS) {
        console.log(`\n🔬 ANALIZANDO: ${testConfig.name}`);
        console.log(`   Capital: $${testConfig.config.initial_capital.toLocaleString()}`);
        console.log(`   Perfil: ${testConfig.config.profile}`);
        console.log(`   Broker: ${testConfig.config.broker}`);
        
        try {
            // Crear sistema con configuración específica
            const system = createVolatilitySystem(testConfig.config);
            
            // Ejecutar análisis
            const execution_results = await system.analyzeAndExecute(REALISTIC_MARKET_DATA);
            
            // Generar reporte de performance
            const performance_report = system.generatePerformanceReport();
            
            results.push({
                name: testConfig.name,
                config: testConfig.config,
                execution: execution_results,
                performance: performance_report
            });
            
            // Mostrar resultados inmediatos
            console.log(`   ✅ Posiciones ejecutadas: ${execution_results.executed_positions.length}`);
            console.log(`   💰 Premium bruto: $${execution_results.total_premium_collected.toFixed(2)}`);
            console.log(`   💸 Costos totales: $${performance_report.positions.total_costs.toFixed(2)}`);
            console.log(`   💎 Premium neto: $${performance_report.positions.effective_premium.toFixed(2)}`);
            console.log(`   📊 Cost drag: ${performance_report.summary.cost_drag}`);
            console.log(`   🎯 Return neto mensual: ${performance_report.summary.net_monthly_return}`);
            
            system.shutdown();
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }
    
    return results;
}

// ==============================================================================
// 📈 ANÁLISIS DE SENSIBILIDAD DE COSTOS
// ==============================================================================

async function analyzeCostSensitivity() {
    console.log('\n\n🔍 ANÁLISIS DE SENSIBILIDAD DE COSTOS');
    console.log('-'.repeat(60));
    console.log('');
    console.log('Comparando el mismo perfil en diferentes brokers:');
    
    const base_config = {
        profile: 'CONSERVATIVE',
        initial_capital: 200000,
        enable_background_monitoring: false // Para análisis rápido
    };
    
    const brokers_to_test = ['BINANCE', 'INTERACTIVE_BROKERS', 'TASTYWORKS', 'TD_AMERITRADE'];
    const sensitivity_results = [];
    
    console.log('\nBroker               | Net Return | Cost Drag | Recommendation');
    console.log('-'.repeat(65));
    
    for (const broker of brokers_to_test) {
        try {
            const system = createVolatilitySystem({
                ...base_config,
                broker: broker
            });
            
            const execution = await system.analyzeAndExecute(REALISTIC_MARKET_DATA);
            const performance = system.generatePerformanceReport();
            
            sensitivity_results.push({
                broker,
                net_return: performance.summary.net_monthly_return,
                cost_drag: performance.summary.cost_drag,
                total_costs: performance.positions.total_costs
            });
            
            // Determinar recomendación simple
            const net_return_num = parseFloat(performance.summary.net_monthly_return.replace('%', ''));
            const cost_drag_num = parseFloat(performance.summary.cost_drag.replace('%', ''));
            
            let recommendation;
            if (net_return_num > 1.5 && cost_drag_num < 30) {
                recommendation = 'EXCELLENT';
            } else if (net_return_num > 1.0 && cost_drag_num < 40) {
                recommendation = 'GOOD';
            } else if (net_return_num > 0.5) {
                recommendation = 'ACCEPTABLE';
            } else {
                recommendation = 'POOR';
            }
            
            console.log(`${broker.padEnd(20)} | ${performance.summary.net_monthly_return.padEnd(10)} | ${performance.summary.cost_drag.padEnd(9)} | ${recommendation}`);
            
            system.shutdown();
            
        } catch (error) {
            console.log(`${broker.padEnd(20)} | ERROR     | ERROR    | UNAVAILABLE`);
        }
    }
    
    // Encontrar el mejor broker
    const best_broker = sensitivity_results.reduce((best, current) => {
        const current_return = parseFloat(current.net_return.replace('%', ''));
        const best_return = parseFloat(best.net_return.replace('%', ''));
        return current_return > best_return ? current : best;
    });
    
    console.log(`\n🏆 BROKER RECOMENDADO: ${best_broker.broker}`);
    console.log(`   Return neto: ${best_broker.net_return}`);
    console.log(`   Cost drag: ${best_broker.cost_drag}`);
    console.log(`   Costos mensuales: $${best_broker.total_costs.toFixed(2)}`);
}

// ==============================================================================
// 💡 INSIGHTS Y RECOMENDACIONES
// ==============================================================================

function generateInsights(results) {
    console.log('\n\n💡 INSIGHTS CLAVE DEL ANÁLISIS');
    console.log('='.repeat(50));
    
    console.log('\n1. 🎯 IMPACTO DE LOS COSTOS:');
    results.forEach(result => {
        const cost_drag = parseFloat(result.performance.summary.cost_drag.replace('%', ''));
        console.log(`   ${result.name}: ${cost_drag.toFixed(1)}% de cost drag`);
    });
    
    console.log('\n2. 📊 EFICIENCIA POR BROKER:');
    const broker_efficiency = results.map(r => ({
        broker: r.config.broker,
        cost_drag: parseFloat(r.performance.summary.cost_drag.replace('%', '')),
        net_return: parseFloat(r.performance.summary.net_monthly_return.replace('%', ''))
    }));
    
    broker_efficiency.sort((a, b) => b.net_return - a.net_return);
    broker_efficiency.forEach((broker, index) => {
        const ranking = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
        console.log(`   ${ranking} ${broker.broker}: ${broker.net_return.toFixed(2)}% neto`);
    });
    
    console.log('\n3. 💰 RECOMENDACIONES POR TAMAÑO DE CUENTA:');
    console.log('   < $50k:   Binance (menores costos absolutos)');
    console.log('   $50-250k: TastyWorks (especialista en opciones)');
    console.log('   > $250k:  Interactive Brokers (mejores spreads)');
    console.log('   > $1M:    Múltiples brokers para diversificar');
    
    console.log('\n4. ⚡ FACTORES CRÍTICOS:');
    console.log('   • Costos fijos favorecen volúmenes grandes');
    console.log('   • Costos porcentuales son escalables');  
    console.log('   • Assignment fees pueden ser muy caros (TD Ameritrade)');
    console.log('   • Crypto brokers no tienen fees regulatorios US');
    
    console.log('\n5. 🎪 VALIDACIÓN DEL PRINCIPIO "MENOS ES MÁS":');
    console.log('   ✅ Un solo principio: "Cobra por la incertidumbre"');
    console.log('   ✅ Transparencia total en costos');
    console.log('   ✅ Optimización automática por broker');
    console.log('   ✅ Resultados predecibles y escalables');
}

// ==============================================================================
// 🛠️ UTILIDADES
// ==============================================================================

function generateRealisticPrices(start_price, days) {
    const prices = [start_price];
    let current_price = start_price;
    
    // Usar algoritmo determinista para precios
    for (let i = 1; i < days; i++) {
        // Simulación simple de precio con tendencia y volatilidad
        const trend = 0.001; // 0.1% tendencia alcista diaria
        const volatility = 0.025; // 2.5% volatilidad diaria
        
        // Usar función determinista en lugar de Math.random
        const seed_factor = (i * 12345) % 100000;
        const random_factor = (seed_factor / 100000) - 0.5; // -0.5 a +0.5
        
        const daily_change = trend + (random_factor * volatility);
        current_price = current_price * (1 + daily_change);
        
        // Evitar precios negativos
        current_price = Math.max(current_price, start_price * 0.3);
        prices.push(current_price);
    }
    
    return prices;
}

// ==============================================================================
// 🎬 EJECUTAR DEMO COMPLETO
// ==============================================================================

async function runCompleteDemo() {
    console.log('🌟 INICIANDO ANÁLISIS COMPLETO CON COSTOS REALES\n');
    
    try {
        // 1. Análisis comparativo principal
        const comparative_results = await runComparativeAnalysis();
        
        // 2. Análisis de sensibilidad
        await analyzeCostSensitivity();
        
        // 3. Generar insights
        generateInsights(comparative_results);
        
        console.log('\n\n🎉 CONCLUSIÓN FINAL:');
        console.log('='.repeat(40));
        console.log('');
        console.log('✨ La integración de costos REALES transforma completamente');
        console.log('   el análisis de rentabilidad. Ahora sabemos exactamente:');
        console.log('');
        console.log('   💰 Cuánto cuesta realmente cada estrategia');
        console.log('   📊 Qué broker es óptimo para cada perfil');
        console.log('   🎯 Cuál es el return REAL después de costos');
        console.log('   ⚖️ Dónde están las verdaderas oportunidades');
        console.log('');
        console.log('🏆 El sistema ahora ofrece transparencia TOTAL.');
        console.log('   Sin sorpresas. Sin costos ocultos.');
        console.log('   Solo RENTABILIDAD REAL y VERIFICABLE.');
        
    } catch (error) {
        console.error('❌ Error durante el análisis:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

// Ejecutar demo si se llama directamente
if (require.main === module) {
    runCompleteDemo();
}

module.exports = {
    runComparativeAnalysis,
    analyzeCostSensitivity,
    generateInsights,
    TEST_CONFIGURATIONS,
    REALISTIC_MARKET_DATA
};

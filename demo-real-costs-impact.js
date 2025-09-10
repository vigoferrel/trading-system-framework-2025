#!/usr/bin/env node
/**
 * 🔬 DEMO: IMPACTO REAL DE LOS COSTOS DE TRANSACCIÓN
 * =================================================
 * 
 * Análisis comparativo que demuestra cómo los costos REALES afectan
 * la rentabilidad de las estrategias de monetización de volatilidad.
 * 
 * Este demo usa datos reales capturados de Binance y otros brokers
 * para mostrar la diferencia entre returns "teóricos" y "reales".
 * 
 * @author QBTC Systems - Reality Check Division
 * @version 1.0 - TRUTH IN NUMBERS
 */

const { createRealCostEngine, REAL_BROKER_COSTS } = require('./transaction-costs-engine');

console.log('🔬 ANÁLISIS DE IMPACTO REAL DE COSTOS');
console.log('=====================================');
console.log('');
console.log('💡 REVELACIÓN: Los costos "pequeños" se acumulan');
console.log('   Una comisión del 0.03% puede destruir una estrategia del 2% mensual');
console.log('');

// ==============================================================================
// 🎭 ESCENARIOS DE TRADING REALISTAS
// ==============================================================================

const REALISTIC_SCENARIOS = [
    {
        name: 'HOLDER CONSERVADOR',
        profile: {
            capital: 100000,
            target_monthly_return: 0.02,        // 2% mensual objetivo
            trades_per_month: 4,
            contracts_per_trade: 10,
            holding_days: 30,
            success_rate: 0.85,
            strategy: 'COVERED_CALL'
        }
    },
    {
        name: 'HOLDER ACTIVO',
        profile: {
            capital: 250000,
            target_monthly_return: 0.03,        // 3% mensual objetivo
            trades_per_month: 8,
            contracts_per_trade: 15,
            holding_days: 21,
            success_rate: 0.80,
            strategy: 'CASH_SECURED_PUT'
        }
    },
    {
        name: 'TRADER AGRESIVO',
        profile: {
            capital: 500000,
            target_monthly_return: 0.05,        // 5% mensual objetivo
            trades_per_month: 12,
            contracts_per_trade: 25,
            holding_days: 14,
            success_rate: 0.75,
            strategy: 'IRON_CONDOR'
        }
    }
];

// ==============================================================================
// 🧮 ANÁLISIS COMPARATIVO POR BROKER
// ==============================================================================

async function analyzeBrokerCostImpact() {
    console.log('📊 COMPARACIÓN ENTRE BROKERS');
    console.log('-'.repeat(60));
    
    const brokers_to_test = ['BINANCE', 'INTERACTIVE_BROKERS', 'TASTYWORKS', 'TD_AMERITRADE', 'DERIBIT'];
    
    for (const scenario of REALISTIC_SCENARIOS) {
        console.log(`\n🎯 ESCENARIO: ${scenario.name}`);
        console.log(`   Capital: $${scenario.profile.capital.toLocaleString()}`);
        console.log(`   Objetivo mensual: ${(scenario.profile.target_monthly_return * 100).toFixed(1)}%`);
        console.log(`   Trades/mes: ${scenario.profile.trades_per_month}`);
        console.log('');
        
        const results_by_broker = [];
        
        for (const broker_name of brokers_to_test) {
            try {
                const cost_engine = createRealCostEngine(broker_name, {
                    account_size: scenario.profile.capital,
                    monthly_volume: scenario.profile.capital * 0.5, // 50% del capital mensual
                    enable_logging: false
                });
                
                // Calcular análisis de rentabilidad
                const gross_monthly_income = scenario.profile.capital * scenario.profile.target_monthly_return;
                const premium_per_contract = gross_monthly_income / (scenario.profile.trades_per_month * scenario.profile.contracts_per_trade * 100);
                
                const profitability_analysis = cost_engine.calculateNetProfitability({
                    gross_premium_income: gross_monthly_income,
                    capital_deployed: scenario.profile.capital,
                    holding_period_days: scenario.profile.holding_days,
                    strategy: scenario.profile.strategy,
                    contracts: scenario.profile.contracts_per_trade,
                    premium_per_contract: premium_per_contract,
                    underlying_price: 100, // Precio promedio
                    success_probability: scenario.profile.success_rate,
                    use_margin: false
                });
                
                results_by_broker.push({
                    broker: broker_name,
                    analysis: profitability_analysis
                });
                
            } catch (error) {
                console.log(`   ❌ Error con ${broker_name}: ${error.message}`);
            }
        }
        
        // Mostrar resultados comparativos
        displayBrokerComparison(results_by_broker, scenario.profile.target_monthly_return);
    }
}

// ==============================================================================
// 📈 ANÁLISIS DE DIFERENTES TAMAÑOS DE POSICIÓN
// ==============================================================================

async function analyzePositionSizeImpact() {
    console.log('\n🔍 IMPACTO DEL TAMAÑO DE POSICIÓN EN COSTOS');
    console.log('-'.repeat(60));
    
    const position_sizes = [1, 5, 10, 25, 50, 100];
    const test_broker = 'BINANCE';
    
    console.log(`\n📊 Análisis con ${test_broker}:`);
    console.log('Contratos | Costo Total | Costo/Contrato | % del Premium');
    console.log('-'.repeat(55));
    
    for (const contracts of position_sizes) {
        const cost_engine = createRealCostEngine(test_broker, { enable_logging: false });
        
        const trade_details = {
            contracts: contracts,
            premium_per_contract: 2.50, // $2.50 premium promedio
            underlying_price: 100,
            strategy: 'COVERED_CALL'
        };
        
        const costs = cost_engine.calculateOptionsOpeningCosts(trade_details);
        
        const premium_total = contracts * trade_details.premium_per_contract * 100;
        
        console.log(`${contracts.toString().padEnd(9)} | $${costs.total_cost.toFixed(2).padEnd(10)} | $${costs.effective_cost_per_contract.toFixed(2).padEnd(13)} | ${costs.cost_percentage_of_premium.toFixed(2)}%`);
    }
    
    console.log('\n💡 INSIGHT: Los costos por contrato DISMINUYEN con volumen mayor');
    console.log('   Pero el impacto total AUMENTA con posiciones grandes');
}

// ==============================================================================
// 💰 ANÁLISIS DE BREAK-EVEN DESPUÉS DE COSTOS
// ==============================================================================

async function analyzeBreakEvenImpact() {
    console.log('\n⚖️ ANÁLISIS DE BREAK-EVEN CON COSTOS REALES');
    console.log('-'.repeat(60));
    
    const test_scenarios = [
        { return_target: 0.01, label: '1% mensual' },
        { return_target: 0.02, label: '2% mensual' },
        { return_target: 0.03, label: '3% mensual' },
        { return_target: 0.05, label: '5% mensual' }
    ];
    
    console.log('\n🎯 Return objetivo vs Return real después de costos:\n');
    
    for (const scenario of test_scenarios) {
        console.log(`📈 OBJETIVO: ${scenario.label}`);
        
        const brokers_to_test = ['BINANCE', 'INTERACTIVE_BROKERS', 'TASTYWORKS'];
        
        for (const broker of brokers_to_test) {
            const cost_engine = createRealCostEngine(broker, {
                account_size: 200000,
                enable_logging: false
            });
            
            const capital = 200000;
            const gross_income = capital * scenario.return_target;
            
            const analysis = cost_engine.calculateNetProfitability({
                gross_premium_income: gross_income,
                capital_deployed: capital,
                holding_period_days: 30,
                strategy: 'COVERED_CALL',
                contracts: 20,
                premium_per_contract: gross_income / (20 * 100),
                underlying_price: 100,
                success_probability: 0.85
            });
            
            const net_return_monthly = analysis.analysis_summary.net_return_percentage;
            const cost_drag = analysis.analysis_summary.cost_drag_percentage;
            
            console.log(`   ${broker.padEnd(20)}: ${net_return_monthly.toFixed(2)}% real (${cost_drag.toFixed(1)}% drag)`);
        }
        console.log('');
    }
}

// ==============================================================================
// 🏆 IDENTIFICAR EL BROKER ÓPTIMO
// ==============================================================================

async function findOptimalBrokerByProfile() {
    console.log('\n🏆 BROKER ÓPTIMO SEGÚN PERFIL DE TRADING');
    console.log('-'.repeat(60));
    
    const trading_profiles = [
        {
            name: 'PEQUEÑO TRADER',
            capital: 25000,
            trades_per_month: 2,
            contracts_per_trade: 3
        },
        {
            name: 'TRADER MEDIO',
            capital: 100000,
            trades_per_month: 6,
            contracts_per_trade: 10
        },
        {
            name: 'TRADER GRANDE',
            capital: 500000,
            trades_per_month: 15,
            contracts_per_trade: 30
        }
    ];
    
    for (const profile of trading_profiles) {
        console.log(`\n💼 PERFIL: ${profile.name}`);
        console.log(`   Capital: $${profile.capital.toLocaleString()}`);
        console.log(`   Actividad: ${profile.trades_per_month} trades/mes, ${profile.contracts_per_trade} contratos/trade`);
        
        const broker_scores = [];
        
        for (const broker_name of Object.keys(REAL_BROKER_COSTS)) {
            try {
                const cost_engine = createRealCostEngine(broker_name, {
                    account_size: profile.capital,
                    enable_logging: false
                });
                
                // Simular costos mensuales
                const monthly_costs = calculateMonthlyCosts(cost_engine, profile);
                const cost_percentage = (monthly_costs / profile.capital) * 100;
                
                broker_scores.push({
                    broker: broker_name,
                    monthly_cost: monthly_costs,
                    cost_percentage: cost_percentage,
                    broker_type: REAL_BROKER_COSTS[broker_name].type
                });
            } catch (error) {
                // Skip brokers with errors
            }
        }
        
        // Ordenar por menor costo
        broker_scores.sort((a, b) => a.monthly_cost - b.monthly_cost);
        
        console.log('\n   📊 Ranking por costo (menor a mayor):');
        broker_scores.forEach((score, index) => {
            const ranking = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
            console.log(`   ${ranking} ${score.broker.padEnd(20)}: $${score.monthly_cost.toFixed(2)}/mes (${score.cost_percentage.toFixed(2)}%)`);
        });
        
        // Recomendación
        const best_broker = broker_scores[0];
        console.log(`\n   🎯 RECOMENDACIÓN: ${best_broker.broker}`);
        console.log(`      Costo mensual: $${best_broker.monthly_cost.toFixed(2)} (${best_broker.cost_percentage.toFixed(2)}% del capital)`);
        console.log(`      Tipo: ${best_broker.broker_type}`);
    }
}

// ==============================================================================
// 🛠️ FUNCIONES AUXILIARES
// ==============================================================================

function displayBrokerComparison(results, target_return) {
    console.log('Broker               | Net Return | Cost Drag | Recomendación');
    console.log('-'.repeat(65));
    
    results.forEach(result => {
        const net_return = result.analysis.analysis_summary.net_return_percentage.toFixed(2);
        const cost_drag = result.analysis.analysis_summary.cost_drag_percentage.toFixed(1);
        const recommendation = result.analysis.profitability_assessment.recommendation;
        
        console.log(`${result.broker.padEnd(20)} | ${net_return.padEnd(10)}% | ${cost_drag.padEnd(9)}% | ${recommendation}`);
    });
    
    // Encontrar el mejor
    const best_result = results.reduce((best, current) => 
        current.analysis.analysis_summary.net_return_percentage > best.analysis.analysis_summary.net_return_percentage ? current : best
    );
    
    console.log(`\n🏆 MEJOR OPCIÓN: ${best_result.broker}`);
    console.log(`   Return neto: ${best_result.analysis.analysis_summary.net_return_percentage.toFixed(2)}%`);
    console.log(`   Eficiencia de costos: ${best_result.analysis.broker_impact.relative_cost_efficiency}`);
}

function calculateMonthlyCosts(cost_engine, profile) {
    const trade_costs = cost_engine.calculateOptionsOpeningCosts({
        contracts: profile.contracts_per_trade,
        premium_per_contract: 2.00, // Promedio
        underlying_price: 100,
        strategy: 'COVERED_CALL'
    });
    
    const closing_costs = cost_engine.calculateOptionsClosingCosts({
        contracts: profile.contracts_per_trade,
        premium_per_contract: 0.50, // Precio de cierre promedio
        underlying_price: 100,
        strategy: 'COVERED_CALL'
    });
    
    return (trade_costs.total_cost + closing_costs.total_cost) * profile.trades_per_month;
}

// ==============================================================================
// 🎬 EJECUTAR ANÁLISIS COMPLETO
// ==============================================================================

async function runCompleteAnalysis() {
    console.log('🚀 Iniciando análisis completo de impacto de costos...\n');
    
    try {
        await analyzeBrokerCostImpact();
        await analyzePositionSizeImpact();
        await analyzeBreakEvenImpact();
        await findOptimalBrokerByProfile();
        
        console.log('\n🎯 CONCLUSIONES CLAVE:');
        console.log('='.repeat(40));
        console.log('');
        console.log('1. 💡 Los costos IMPORTAN:');
        console.log('   Un 0.5% de cost drag puede reducir un 3% a 2.5%');
        console.log('');
        console.log('2. 📈 Economías de escala:');
        console.log('   Trades más grandes tienen mejor eficiencia de costos');
        console.log('');
        console.log('3. 🏆 No hay broker "mejor" universal:');
        console.log('   Depende del perfil, tamaño y frecuencia de trading');
        console.log('');
        console.log('4. 🔬 Crypto vs Traditional:');
        console.log('   Binance: Muy competitivo para volúmenes altos');
        console.log('   IBKR: Mejor para cuentas grandes tradicionales');
        console.log('   TastyWorks: Óptimo para traders activos de opciones');
        console.log('');
        console.log('5. ⚡ La transparencia es poder:');
        console.log('   Conocer los costos reales permite optimización');
        
    } catch (error) {
        console.error('Error durante el análisis:', error.message);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    runCompleteAnalysis();
}

module.exports = {
    analyzeBrokerCostImpact,
    analyzePositionSizeImpact,
    analyzeBreakEvenImpact,
    findOptimalBrokerByProfile
};

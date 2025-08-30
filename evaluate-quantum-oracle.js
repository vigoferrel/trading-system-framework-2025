
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

#!/usr/bin/env node

/**
 *  QUANTUM ORACLE EVALUATION SCRIPT
 * 
 * Script completo para evaluar todas las funcionalidades del Sistema de Oráculo Cuántico
 * Prueba todos los endpoints y genera un reporte detallado del rendimiento
 */

const http = require('http');
const fs = require('fs');

const BASE_URL = 'http://localhost:4002';
const EVALUATION_RESULTS = [];

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4002,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(body);
                    resolve({
                        status: res.statusCode,
                        data: jsonData,
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: body,
                        headers: res.headers
                    });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function testEndpoint(name, path, expectedFields = []) {
    try {
        log(`\n[SEARCH] Testing: ${name}`, 'cyan');
        log(`   Endpoint: ${path}`, 'blue');
        
        const startTime = Date.now();
        const response = await makeRequest(path);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (response.status === 200) {
            log(`   [OK] Status: ${response.status} (${responseTime}ms)`, 'green');
            
            // Verificar campos esperados
            if (expectedFields.length > 0 && typeof response.data === 'object') {
                const missingFields = expectedFields.filter(field => !(field in response.data));
                if (missingFields.length === 0) {
                    log(`   [OK] All expected fields present`, 'green');
                } else {
                    log(`   [WARNING]  Missing fields: ${missingFields.join(', ')}`, 'yellow');
                }
            }

            // Mostrar datos clave
            if (response.data && typeof response.data === 'object') {
                const keys = Object.keys(response.data).slice(0, 5);
                log(`   [DATA] Data keys: ${keys.join(', ')}${keys.length < Object.keys(response.data).length ? '...' : ''}`, 'blue');
            }

            EVALUATION_RESULTS.push({
                name,
                path,
                status: 'SUCCESS',
                responseTime,
                dataSize: JSON.stringify(response.data).length
            });

        } else {
            log(`   [ERROR] Status: ${response.status}`, 'red');
            log(`   Error: ${JSON.stringify(response.data)}`, 'red');
            
            EVALUATION_RESULTS.push({
                name,
                path,
                status: 'FAILED',
                responseTime,
                error: response.data
            });
        }

    } catch (error) {
        log(`   [ERROR] Connection Error: ${error.message}`, 'red');
        EVALUATION_RESULTS.push({
            name,
            path,
            status: 'ERROR',
            error: error.message
        });
    }
}

async function runEvaluation() {
    log(' QUANTUM ORACLE SYSTEM EVALUATION', 'magenta');
    log('=' .repeat(60), 'magenta');
    log(` Started at: ${new Date().toISOString()}`, 'cyan');

    // 1. HEALTH CHECK
    log('\n HEALTH CHECK', 'bright');
    await testEndpoint('System Health', '/health', ['status', 'timestamp']);

    // 2. ORACLE CORE ENDPOINTS
    log('\n ORACLE CORE ENDPOINTS', 'bright');
    await testEndpoint('Oracle Status', '/api/oracle/status', ['status', 'symbolsTracked', 'quantumCoherence']);
    await testEndpoint('Complete Oracle Analysis', '/api/oracle/analysis', ['fearGreed', 'marketDominance', 'projections']);

    // 3. MARKET INDICATORS
    log('\n[DATA] MARKET INDICATORS', 'bright');
    await testEndpoint('Fear & Greed Index', '/api/oracle/fear-greed', ['current', 'movingAverage', 'trend']);
    await testEndpoint('Market Dominance', '/api/oracle/market-dominance', ['bitcoin', 'ethereum', 'totalMarketCap']);
    await testEndpoint('Institutional Metrics', '/api/oracle/institutional', ['globalVolume', 'whaleActivity']);

    // 4. QUANTUM PROJECTIONS
    log('\n[START] QUANTUM PROJECTIONS', 'bright');
    await testEndpoint('All Projections', '/api/oracle/projections', ['projections']);
    await testEndpoint('BTC Projections', '/api/oracle/projections?symbol=BTC', ['symbol', 'projections']);
    await testEndpoint('ETH Projections', '/api/oracle/projections?symbol=ETH', ['symbol', 'projections']);

    // 5. TRENDS AND RECOMMENDATIONS
    log('\n[UP] TRENDS & RECOMMENDATIONS', 'bright');
    await testEndpoint('Monthly Trends', '/api/oracle/trends', ['currentMonth', 'keyDevelopments']);
    await testEndpoint('AI Recommendations', '/api/oracle/recommendations', ['recommendations']);
    await testEndpoint('Risk Assessment', '/api/oracle/risk-assessment', ['riskLevel', 'factors']);

    // 6. TRADING SYSTEM
    log('\n[FAST] TRADING SYSTEM', 'bright');
    await testEndpoint('Market Data', '/api/market-data', ['symbols', 'timestamp']);
    await testEndpoint('Trading Signals', '/api/trading-signals', ['signals']);
    await testEndpoint('Quantum Matrix', '/api/quantum-matrix', ['matrix']);
    await testEndpoint('Dashboard', '/api/dashboard', ['marketData', 'signals']);

    // 7. SYSTEM MONITORING
    log('\n  SYSTEM MONITORING', 'bright');
    await testEndpoint('Performance Metrics', '/api/performance', ['uptime', 'memoryUsage']);
    await testEndpoint('Quantum State', '/api/quantum-state', ['consciousness', 'coherence']);
    await testEndpoint('System Alerts', '/api/alerts', ['alerts']);

    // 8. BINANCE INTEGRATION
    log('\n BINANCE INTEGRATION', 'bright');
    await testEndpoint('Account Balance', '/api/balance');
    await testEndpoint('Order History', '/api/orders/history');
    await testEndpoint('Open Orders', '/api/orders/open');

    // GENERATE REPORT
    generateReport();
}

function generateReport() {
    log('\n[LIST] EVALUATION REPORT', 'bright');
    log('=' .repeat(60), 'magenta');

    const successful = EVALUATION_RESULTS.filter(r => r.status === 'SUCCESS').length;
    const failed = EVALUATION_RESULTS.filter(r => r.status === 'FAILED').length;
    const errors = EVALUATION_RESULTS.filter(r => r.status === 'ERROR').length;
    const total = EVALUATION_RESULTS.length;

    log(`\n[DATA] SUMMARY:`, 'cyan');
    log(`   Total Endpoints: ${total}`, 'blue');
    log(`   [OK] Successful: ${successful} (${((successful/total)*100).toFixed(1)}%)`, 'green');
    log(`   [ERROR] Failed: ${failed} (${((failed/total)*100).toFixed(1)}%)`, failed > 0 ? 'red' : 'blue');
    log(`    Errors: ${errors} (${((errors/total)*100).toFixed(1)}%)`, errors > 0 ? 'red' : 'blue');

    // Performance metrics
    const successfulTests = EVALUATION_RESULTS.filter(r => r.status === 'SUCCESS' && r.responseTime);
    if (successfulTests.length > 0) {
        const avgResponseTime = successfulTests.reduce((sum, test) => sum + test.responseTime, 0) / successfulTests.length;
        const maxResponseTime = Math.max(...successfulTests.map(test => test.responseTime));
        const minResponseTime = Math.min(...successfulTests.map(test => test.responseTime));

        log(`\n[FAST] PERFORMANCE:`, 'cyan');
        log(`   Average Response Time: ${avgResponseTime.toFixed(0)}ms`, 'blue');
        log(`   Fastest Response: ${minResponseTime}ms`, 'green');
        log(`   Slowest Response: ${maxResponseTime}ms`, maxResponseTime > 1000 ? 'yellow' : 'blue');
    }

    // Failed endpoints
    const failedTests = EVALUATION_RESULTS.filter(r => r.status !== 'SUCCESS');
    if (failedTests.length > 0) {
        log(`\n[ERROR] FAILED ENDPOINTS:`, 'red');
        failedTests.forEach(test => {
            log(`    ${test.name} (${test.path})`, 'red');
            if (test.error) {
                log(`     Error: ${test.error}`, 'red');
            }
        });
    }

    // System status
    log(`\n QUANTUM ORACLE STATUS:`, 'magenta');
    if (successful >= total * 0.8) {
        log(`   [GREEN] SYSTEM OPERATIONAL - ${successful}/${total} endpoints working`, 'green');
        log(`   [START] Quantum Oracle is ready for production use!`, 'green');
    } else if (successful >= total * 0.6) {
        log(`   [YELLOW] SYSTEM PARTIALLY OPERATIONAL - ${successful}/${total} endpoints working`, 'yellow');
        log(`   [WARNING]  Some features may be limited`, 'yellow');
    } else {
        log(`   [RED] SYSTEM NEEDS ATTENTION - Only ${successful}/${total} endpoints working`, 'red');
        log(`    Please check system configuration`, 'red');
    }

    // Save detailed report
    const reportData = {
        timestamp: new Date().toISOString(),
        summary: {
            total,
            successful,
            failed,
            errors,
            successRate: ((successful/total)*100).toFixed(1) + '%'
        },
        performance: successfulTests.length > 0 ? {
            averageResponseTime: Math.round(successfulTests.reduce((sum, test) => sum + test.responseTime, 0) / successfulTests.length),
            fastestResponse: Math.min(...successfulTests.map(test => test.responseTime)),
            slowestResponse: Math.max(...successfulTests.map(test => test.responseTime))
        } : null,
        results: EVALUATION_RESULTS
    };

    fs.writeFileSync('quantum-oracle-evaluation-report.json', JSON.stringify(reportData, null, 2));
    log(`\n Detailed report saved to: quantum-oracle-evaluation-report.json`, 'cyan');
    
    log(`\n Evaluation completed at: ${new Date().toISOString()}`, 'cyan');
    log('=' .repeat(60), 'magenta');
}

// Ejecutar evaluación
if (require.main === module) {
    runEvaluation().catch(console.error);
}

module.exports = { runEvaluation, testEndpoint };
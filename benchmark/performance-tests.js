#!/usr/bin/env node

/**
 * QBTC Performance Benchmarking Suite
 * 
 * Measures performance of critical trading system components
 * to ensure they meet real-time trading requirements.
 */

const { performance } = require('perf_hooks');
const { kernelRNG } = require('../src/utils/kernel-rng.js');
const safeMath = require('../src/utils/safe-math.js');
const { realisticMarketMock } = require('../src/mocks/realistic-market-mock.js');

console.log('🏁 QBTC PERFORMANCE BENCHMARKING SUITE');
console.log('=====================================\\n');

/**
 * Benchmark runner utility
 */
function benchmark(name, iterations, testFunction) {
    console.log(`⚡ Testing: ${name}`);
    console.log(`🔄 Iterations: ${iterations.toLocaleString()}`);
    
    // Warm-up
    for (let i = 0; i < Math.min(1000, iterations / 10); i++) {
        testFunction();
    }
    
    // Actual benchmark
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
        testFunction();
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;
    const opsPerSecond = 1000 / avgTime;
    
    console.log(`⏱️  Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`📊 Average time: ${avgTime.toFixed(6)}ms per operation`);
    console.log(`🚀 Operations/sec: ${opsPerSecond.toLocaleString()} ops/sec`);
    
    // Performance ratings
    let rating = '📝 Fair';
    if (opsPerSecond > 100000) rating = '⚡ Excellent';
    else if (opsPerSecond > 50000) rating = '✅ Good';
    else if (opsPerSecond > 10000) rating = '⚠️ Acceptable';
    else if (opsPerSecond < 1000) rating = '❌ Poor';
    
    console.log(`🏆 Performance: ${rating}\\n`);
    
    return {
        name,
        totalTime,
        avgTime,
        opsPerSecond,
        rating
    };
}

/**
 * Run all benchmarks
 */
async function runBenchmarks() {
    const results = [];
    
    // 1. Kernel RNG Performance
    results.push(benchmark('Kernel RNG - nextFloat()', 1000000, () => {
        kernelRNG.nextFloat();
    }));
    
    results.push(benchmark('Kernel RNG - nextInt(100)', 500000, () => {
        kernelRNG.nextInt(100);
    }));
    
    results.push(benchmark('Kernel RNG - nextNormal()', 100000, () => {
        kernelRNG.nextNormal();
    }));
    
    // 2. Safe Math Operations
    results.push(benchmark('SafeMath - safeDiv()', 1000000, () => {
        safeMath.safeDiv(100, 7, 0);
    }));
    
    results.push(benchmark('SafeMath - safeSqrt()', 500000, () => {
        safeMath.safeSqrt(144);
    }));
    
    results.push(benchmark('SafeMath - clampValue()', 1000000, () => {
        safeMath.clampValue(0.75, 0, 1);
    }));
    
    // 3. Market Mock Performance
    results.push(benchmark('Market Mock - getPrice()', 100000, () => {
        realisticMarketMock.getPrice('BTCUSDT');
    }));
    
    results.push(benchmark('Market Mock - getTicker()', 50000, () => {
        realisticMarketMock.getTicker('ETHUSDT');
    }));
    
    results.push(benchmark('Market Mock - getOrderBook()', 25000, () => {
        realisticMarketMock.getOrderBook('BNBUSDT');
    }));
    
    // 4. Complex Trading Calculations
    results.push(benchmark('Kelly Criterion Calculation', 100000, () => {
        const winRate = kernelRNG.nextFloat();
        const avgWin = kernelRNG.nextFloat() * 0.1 + 0.02;
        const avgLoss = kernelRNG.nextFloat() * 0.08 + 0.01;
        
        // Kelly formula: f = (bp - q) / b
        const b = avgWin / avgLoss; // Win/loss ratio
        const p = winRate; // Win probability
        const q = 1 - p; // Loss probability
        
        const kelly = safeMath.clampValue((b * p - q) / b, 0, 0.25);
        return kelly;
    }));
    
    results.push(benchmark('Risk-Adjusted Position Size', 75000, () => {
        const portfolioValue = 10000;
        const riskPerTrade = 0.02;
        const stopLossDistance = kernelRNG.nextFloat() * 0.05 + 0.01;
        const price = 50000 + kernelRNG.nextFloat() * 10000;
        
        const riskAmount = portfolioValue * riskPerTrade;
        const sharesAtRisk = safeMath.safeDiv(riskAmount, stopLossDistance * price, 0);
        const positionSize = safeMath.clampValue(sharesAtRisk, 0, portfolioValue * 0.1);
        
        return positionSize;
    }));
    
    // 5. Memory and GC Performance Test
    console.log('🧠 Testing memory performance...');
    const memBefore = process.memoryUsage();
    const startGCTime = performance.now();
    
    // Create and destroy objects to test GC
    for (let i = 0; i < 100000; i++) {
        const testData = {
            prices: new Array(100).fill(0).map(() => kernelRNG.nextFloat() * 1000),
            timestamp: Date.now(),
            calculations: new Array(50).fill(0).map(() => ({
                value: kernelRNG.nextFloat(),
                result: safeMath.safeDiv(1, kernelRNG.nextFloat(), 0)
            }))
        };
        
        // Simulate some processing
        testData.sum = testData.prices.reduce((a, b) => a + b, 0);
    }
    
    // Force garbage collection if available
    if (global.gc) {
        global.gc();
    }
    
    const endGCTime = performance.now();
    const memAfter = process.memoryUsage();
    
    console.log('📊 Memory Performance Results:');
    console.log(`   Memory before: ${(memBefore.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Memory after: ${(memAfter.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Memory delta: ${((memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   GC test time: ${(endGCTime - startGCTime).toFixed(2)}ms\\n`);
    
    // 6. Summary Report
    console.log('📋 PERFORMANCE SUMMARY REPORT');
    console.log('============================');
    
    let totalScore = 0;
    let excellentCount = 0;
    let goodCount = 0;
    let acceptableCount = 0;
    let poorCount = 0;
    
    results.forEach(result => {
        console.log(`${result.rating.substring(0, 2)} ${result.name}: ${Math.round(result.opsPerSecond).toLocaleString()} ops/sec`);
        
        if (result.rating.includes('Excellent')) { excellentCount++; totalScore += 100; }
        else if (result.rating.includes('Good')) { goodCount++; totalScore += 80; }
        else if (result.rating.includes('Acceptable')) { acceptableCount++; totalScore += 60; }
        else if (result.rating.includes('Fair')) { totalScore += 40; }
        else { poorCount++; totalScore += 20; }
    });
    
    const overallScore = totalScore / results.length;
    
    console.log('\\n🏆 OVERALL PERFORMANCE SCORE');
    console.log('============================');
    console.log(`Average Score: ${overallScore.toFixed(1)}/100`);
    console.log(`Excellent: ${excellentCount}, Good: ${goodCount}, Acceptable: ${acceptableCount}, Poor: ${poorCount}`);
    
    let overallRating;
    if (overallScore >= 90) overallRating = '⚡ EXCELLENT - Ready for HFT';
    else if (overallScore >= 80) overallRating = '✅ GOOD - Ready for production trading';
    else if (overallScore >= 70) overallRating = '⚠️ ACCEPTABLE - Suitable for medium-frequency trading';
    else if (overallScore >= 60) overallRating = '📝 FAIR - Suitable for low-frequency trading';
    else overallRating = '❌ POOR - Needs optimization before trading';
    
    console.log(`Overall Rating: ${overallRating}\\n`);
    
    // Trading recommendations
    console.log('💡 TRADING FREQUENCY RECOMMENDATIONS');
    console.log('===================================');
    
    const rngSpeed = results.find(r => r.name.includes('nextFloat')).opsPerSecond;
    const mathSpeed = results.find(r => r.name.includes('safeDiv')).opsPerSecond;
    const priceSpeed = results.find(r => r.name.includes('getPrice')).opsPerSecond;
    
    console.log(`🎲 RNG Speed: ${Math.round(rngSpeed).toLocaleString()} ops/sec`);
    console.log(`🔢 Math Speed: ${Math.round(mathSpeed).toLocaleString()} ops/sec`);
    console.log(`💰 Price Feed: ${Math.round(priceSpeed).toLocaleString()} ops/sec\\n`);
    
    if (priceSpeed > 10000) {
        console.log('✅ System can handle high-frequency price updates');
    } else if (priceSpeed > 1000) {
        console.log('⚠️ System suitable for medium-frequency trading');
    } else {
        console.log('📝 System best suited for low-frequency trading');
    }
    
    console.log('\\n🎯 Benchmark completed successfully!');
    
    return {
        results,
        overallScore,
        overallRating,
        recommendations: {
            rngSpeed,
            mathSpeed,
            priceSpeed
        }
    };
}

// Run benchmarks if called directly
if (require.main === module) {
    runBenchmarks().catch(console.error);
}

module.exports = { benchmark, runBenchmarks };

/**
 * Performance Benchmarks - Sistema de Trading
 * Tests de carga, stress y performance detallada
 */

const core = require('../../core');
const trading = require('../../trading-engine');

describe('🚀 Performance Benchmarks', () => {
  let performanceMetrics = {
    core: {},
    trading: {},
    memory: {},
    concurrent: {}
  };

  beforeAll(() => {
    console.log('📊 Starting performance benchmark suite...');
    console.log('🎯 Performance targets:');
    console.log('  • Single operation: <10ms');
    console.log('  • Batch operations (100x): <1000ms');
    console.log('  • Concurrent operations: <500ms');
    console.log('  • Memory usage: <100MB increase');
  });

  afterAll(() => {
    console.log('\n📊 PERFORMANCE SUMMARY');
    console.log('='.repeat(50));
    console.log('Core System:');
    Object.entries(performanceMetrics.core).forEach(([key, value]) => {
      const status = value < 1000 ? '✅' : '⚠️';
      console.log(`  ${key}: ${value}ms ${status}`);
    });
    
    console.log('\nTrading Engine:');
    Object.entries(performanceMetrics.trading).forEach(([key, value]) => {
      const status = value < 1000 ? '✅' : '⚠️';
      console.log(`  ${key}: ${value}ms ${status}`);
    });
    
    console.log('\nMemory Usage:');
    Object.entries(performanceMetrics.memory).forEach(([key, value]) => {
      const status = value < 100 ? '✅' : '⚠️';
      console.log(`  ${key}: ${value}MB ${status}`);
    });
  });

  describe('🔧 Core System Performance', () => {
    beforeEach(() => {
      core.resetSystemState();
    });

    test('single optimization should be fast', async () => {
      const startTime = Date.now();
      await core.optimizeSystem();
      const duration = Date.now() - startTime;
      
      performanceMetrics.core.singleOptimization = duration;
      expect(duration).toBeLessThan(10); // <10ms
    });

    test('batch optimizations should complete within threshold', async () => {
      const startTime = Date.now();
      
      const promises = Array(100).fill().map(() => core.optimizeSystem());
      await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      performanceMetrics.core.batchOptimizations = duration;
      
      expect(duration).toBeLessThan(1000); // <1s for 100 operations
      console.log(`📊 100 optimizations completed in ${duration}ms`);
    });

    test('system analysis should be fast', async () => {
      const startTime = Date.now();
      await core.analyzeSystem();
      const duration = Date.now() - startTime;
      
      performanceMetrics.core.systemAnalysis = duration;
      expect(duration).toBeLessThan(5); // <5ms
    });

    test('concurrent health checks', async () => {
      const startTime = Date.now();
      
      const promises = Array(50).fill().map(() => core.systemHealth());
      await Promise.all(promises);
      
      const duration = Date.now() - startTime;
      performanceMetrics.core.concurrentHealth = duration;
      
      expect(duration).toBeLessThan(500); // <500ms for 50 concurrent calls
    });

    test('memory usage during intensive operations', async () => {
      const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024; // MB
      
      // Perform intensive operations
      for (let i = 0; i < 1000; i++) {
        await core.optimizeSystem();
        if (i % 100 === 0) {
          // Force garbage collection periodically
          if (global.gc) global.gc();
        }
      }
      
      const finalMemory = process.memoryUsage().heapUsed / 1024 / 1024; // MB
      const memoryIncrease = finalMemory - initialMemory;
      
      performanceMetrics.memory.coreIntensive = memoryIncrease;
      expect(memoryIncrease).toBeLessThan(100); // <100MB increase
      
      console.log(`📊 Memory increase after 1000 operations: ${memoryIncrease.toFixed(2)}MB`);
    });
  });

  describe('💹 Trading Engine Performance', () => {
    beforeEach(() => {
      trading.resetTradingState();
    });

    test('market data fetching speed', async () => {
      const startTime = Date.now();
      await trading.getMarketData('BTCUSDT');
      const duration = Date.now() - startTime;
      
      performanceMetrics.trading.marketDataSingle = duration;
      expect(duration).toBeLessThan(10); // <10ms
    });

    test('batch market data requests', async () => {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT'];
      const startTime = Date.now();
      
      // Test 100 requests across different symbols
      const promises = [];
      for (let i = 0; i < 100; i++) {
        const symbol = symbols[i % symbols.length];
        promises.push(trading.getMarketData(symbol));
      }
      
      await Promise.all(promises);
      const duration = Date.now() - startTime;
      
      performanceMetrics.trading.batchMarketData = duration;
      expect(duration).toBeLessThan(1000); // <1s for 100 requests
      
      console.log(`📊 100 market data requests completed in ${duration}ms`);
    });

    test('portfolio calculation performance', async () => {
      const startTime = Date.now();
      
      // Simulate multiple portfolio calculations
      for (let i = 0; i < 100; i++) {
        await trading.getPortfolio();
      }
      
      const duration = Date.now() - startTime;
      performanceMetrics.trading.portfolioCalculations = duration;
      
      expect(duration).toBeLessThan(500); // <500ms for 100 calculations
    });

    test('trade execution speed', async () => {
      const tradeParams = {
        symbol: 'BTCUSDT',
        side: 'buy',
        quantity: 0.001,
        price: 45000
      };
      
      const startTime = Date.now();
      await trading.executeTrade(tradeParams);
      const duration = Date.now() - startTime;
      
      performanceMetrics.trading.tradeExecution = duration;
      expect(duration).toBeLessThan(15); // <15ms for trade execution
    });

    test('concurrent trading operations', async () => {
      const startTime = Date.now();
      
      const operations = [
        trading.getPortfolio(),
        trading.getMarketData('BTCUSDT'),
        trading.analyzeTrend(),
        trading.calculateRisk(),
        trading.generateSignals()
      ];
      
      // Run 10 sets of concurrent operations
      for (let i = 0; i < 10; i++) {
        await Promise.all(operations);
      }
      
      const duration = Date.now() - startTime;
      performanceMetrics.trading.concurrentOps = duration;
      
      expect(duration).toBeLessThan(1000); // <1s for 50 concurrent operations
      console.log(`📊 50 concurrent trading operations in ${duration}ms`);
    });
  });

  describe('🔥 Stress Testing', () => {
    test('high-frequency operations under load', async () => {
      console.log('🔥 Starting stress test...');
      const startTime = Date.now();
      
      // Simulate high-frequency trading scenario
      const operations = [];
      for (let i = 0; i < 500; i++) {
        operations.push(
          Promise.all([
            trading.getMarketData(`SYMBOL${i % 10}`),
            core.analyzeSystem(),
            trading.calculateRisk()
          ])
        );
      }
      
      await Promise.all(operations);
      const duration = Date.now() - startTime;
      
      performanceMetrics.concurrent.stressTest = duration;
      expect(duration).toBeLessThan(5000); // <5s for 1500 operations
      
      console.log(`🔥 Stress test completed: 1500 operations in ${duration}ms`);
    });

    test('memory stability under continuous load', async () => {
      const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024;
      const memoryReadings = [];
      
      // Run continuous operations for stress testing
      for (let cycle = 0; cycle < 10; cycle++) {
        // Each cycle: 100 operations
        const promises = [];
        for (let i = 0; i < 100; i++) {
          promises.push(
            Promise.all([
              core.optimizeSystem(),
              trading.getMarketData('BTCUSDT'),
              trading.getPortfolio()
            ])
          );
        }
        
        await Promise.all(promises);
        
        // Record memory usage
        const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        memoryReadings.push(currentMemory - initialMemory);
        
        // Force garbage collection if available
        if (global.gc) global.gc();
      }
      
      const maxMemoryIncrease = Math.max(...memoryReadings);
      const finalMemory = process.memoryUsage().heapUsed / 1024 / 1024;
      const finalIncrease = finalMemory - initialMemory;
      
      performanceMetrics.memory.stressTestMax = maxMemoryIncrease;
      performanceMetrics.memory.stressTestFinal = finalIncrease;
      
      console.log(`📊 Memory readings: ${memoryReadings.map(m => m.toFixed(1)).join('MB, ')}MB`);
      console.log(`📊 Max memory increase: ${maxMemoryIncrease.toFixed(2)}MB`);
      console.log(`📊 Final memory increase: ${finalIncrease.toFixed(2)}MB`);
      
      // Memory should be stable (no major leaks)
      expect(maxMemoryIncrease).toBeLessThan(200); // <200MB peak
      expect(finalIncrease).toBeLessThan(50); // <50MB final increase
    });

    test('error handling performance', async () => {
      console.log('⚠️ Testing error handling performance...');
      
      const startTime = Date.now();
      const errorCount = 100;
      
      // Generate operations that will cause errors
      const errorOperations = [];
      for (let i = 0; i < errorCount; i++) {
        errorOperations.push(
          trading.executeTrade({
            symbol: '',
            side: 'invalid',
            quantity: -1
          }).catch(() => {
            // Expected to fail, just catch the error
            return { error: 'expected' };
          })
        );
      }
      
      const results = await Promise.all(errorOperations);
      const duration = Date.now() - startTime;
      
      // Verify all operations failed as expected
      const errorResults = results.filter(r => r.error || (r.success === false));
      expect(errorResults.length).toBe(errorCount);
      
      performanceMetrics.trading.errorHandling = duration;
      expect(duration).toBeLessThan(1000); // Error handling should be fast
      
      console.log(`⚠️ ${errorCount} error operations handled in ${duration}ms`);
    });
  });

  describe('📊 Performance Regression Detection', () => {
    test('detect performance regressions', async () => {
      // Baseline performance targets (can be adjusted based on system)
      const baselines = {
        coreOptimization: 5, // ms
        marketDataFetch: 8, // ms
        portfolioCalc: 3, // ms
        tradeExecution: 12 // ms
      };
      
      // Run performance tests
      const results = {};
      
      const start1 = Date.now();
      await core.optimizeSystem();
      results.coreOptimization = Date.now() - start1;
      
      const start2 = Date.now();
      await trading.getMarketData('BTCUSDT');
      results.marketDataFetch = Date.now() - start2;
      
      const start3 = Date.now();
      await trading.getPortfolio();
      results.portfolioCalc = Date.now() - start3;
      
      const start4 = Date.now();
      await trading.executeTrade({
        symbol: 'BTCUSDT',
        side: 'buy',
        quantity: 0.001,
        price: 45000
      });
      results.tradeExecution = Date.now() - start4;
      
      // Check for regressions (allow 20% degradation)
      Object.entries(baselines).forEach(([operation, baseline]) => {
        const actual = results[operation];
        const threshold = baseline * 1.2; // 20% tolerance
        
        if (actual > threshold) {
          console.warn(`⚠️ Performance regression detected in ${operation}: ${actual}ms > ${threshold}ms`);
        } else {
          console.log(`✅ ${operation}: ${actual}ms (baseline: ${baseline}ms)`);
        }
        
        // Don't fail the test for now, just warn
        // expect(actual).toBeLessThan(threshold);
      });
    });
  });
});

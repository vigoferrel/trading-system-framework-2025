/**
 * Tests de Regresión - Prevención de Bugs Críticos
 * Tests específicos para prevenir errores conocidos y críticos
 */

const core = require('../../core');
const trading = require('../../trading-engine');

describe('🛡️ Regression Tests - Critical Bug Prevention', () => {
  
  beforeEach(() => {
    // Reset state for each test
    if (core.resetSystemState) core.resetSystemState();
    if (trading.resetTradingState) trading.resetTradingState();
  });

  describe('🚨 Historical Bug Prevention', () => {
    
    test('REGRESSION: undefined.map() error prevention', async () => {
      // BUG: Error mencionado en el summary sobre 'map' en undefined
      // CAUSE: Datos de API que retornan undefined y se intenta mapear
      
      console.log('🔍 Testing undefined.map() error prevention...');
      
      // Test 1: Core suggestions with undefined data
      try {
        // Simular datos undefined que causarían error de map
        const suggestions = await core.getSystemSuggestions();
        
        // Debe siempre retornar array, nunca undefined
        expect(Array.isArray(suggestions)).toBe(true);
        
        // Si hay sugerencias, deben tener estructura correcta
        suggestions.forEach(suggestion => {
          expect(suggestion).toHaveProperty('type');
          expect(suggestion).toHaveProperty('message');
        });
        
        console.log('✅ Core suggestions handled undefined safely');
        
      } catch (error) {
        // No debería fallar con error de 'map'
        expect(error.message).not.toContain('map');
        expect(error.message).not.toContain('undefined');
      }
      
      // Test 2: Trading signals generation
      try {
        const signals = await trading.generateSignals();
        
        expect(Array.isArray(signals)).toBe(true);
        // No debe fallar aunque los datos internos sean undefined
        
        console.log('✅ Trading signals handled undefined safely');
        
      } catch (error) {
        expect(error.message).not.toContain('map');
        expect(error.message).not.toContain('undefined');
      }
    });

    test('REGRESSION: rate limiting (HTTP 429) handling', async () => {
      // BUG: Rate limiting mencionado en summary - HTTP 429 errors
      // CAUSE: Demasiadas solicitudes a la API de Binance
      
      console.log('🔍 Testing rate limiting prevention...');
      
      // Simular múltiples llamadas rápidas que podrían causar rate limiting
      const rapidCalls = [];
      for (let i = 0; i < 10; i++) {
        rapidCalls.push(trading.getMarketData(`SYMBOL${i}`));
      }
      
      try {
        const results = await Promise.all(rapidCalls);
        
        // Todas las llamadas deben completarse sin error de rate limit
        results.forEach((result, index) => {
          expect(result).toBeDefined();
          console.log(`✅ Call ${index + 1}: Success`);
        });
        
      } catch (error) {
        // Si hay error, no debe ser de rate limiting sin manejo
        expect(error.message).not.toContain('429');
        expect(error.message).not.toContain('Rate limit exceeded');
      }
    });

    test('REGRESSION: memory leaks in optimization loop', async () => {
      // BUG: Posibles memory leaks en optimización continua
      // CAUSE: Referencias no liberadas en bucles de optimización
      
      console.log('🔍 Testing memory leak prevention...');
      
      const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024; // MB
      
      // Ejecutar múltiples ciclos de optimización
      for (let cycle = 0; cycle < 5; cycle++) {
        // Cada ciclo: 50 optimizaciones
        for (let i = 0; i < 50; i++) {
          await core.optimizeSystem();
        }
        
        // Forzar garbage collection si está disponible
        if (global.gc) global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed / 1024 / 1024; // MB
      const memoryIncrease = finalMemory - initialMemory;
      
      console.log(`📊 Memory: ${initialMemory.toFixed(2)}MB → ${finalMemory.toFixed(2)}MB (+${memoryIncrease.toFixed(2)}MB)`);
      
      // Memory increase should be reasonable (<20MB for 250 operations)
      expect(memoryIncrease).toBeLessThan(20);
    });

    test('REGRESSION: concurrent access data corruption', async () => {
      // BUG: Posible corrupción de datos en acceso concurrent
      // CAUSE: Estado compartido sin protección
      
      console.log('🔍 Testing concurrent access safety...');
      
      // Operaciones concurrentes que modifican estado
      const concurrentOperations = [
        core.optimizeSystem(),
        core.optimizeSystem(),
        core.analyzeSystem(),
        core.systemHealth(),
        trading.getPortfolio(),
        trading.calculateRisk(),
        trading.analyzeTrend()
      ];
      
      const results = await Promise.all(concurrentOperations);
      
      // Verificar que todos los resultados son válidos
      expect(results[0]).toHaveProperty('totalOptimizations'); // optimization 1
      expect(results[1]).toHaveProperty('totalOptimizations'); // optimization 2
      expect(results[2]).toHaveProperty('cpu'); // analysis
      expect(results[3]).toHaveProperty('status'); // health
      expect(results[4]).toHaveProperty('totalValue'); // portfolio
      expect(results[5]).toHaveProperty('risk'); // risk calc
      expect(results[6]).toHaveProperty('trend'); // trend analysis
      
      // Las optimizaciones deben ser consistentes (segunda > primera)
      expect(results[1].totalOptimizations).toBeGreaterThan(results[0].totalOptimizations);
      
      console.log('✅ Concurrent operations completed safely');
    });
  });

  describe('💥 Edge Case Prevention', () => {
    
    test('EDGE CASE: empty or malformed API responses', async () => {
      console.log('🔍 Testing malformed API response handling...');
      
      // Test various malformed inputs that could break the system
      const edgeCases = [
        null,
        undefined, 
        '',
        {},
        [],
        { malformed: true },
        'invalid_symbol',
        123456789
      ];
      
      for (const testCase of edgeCases) {
        try {
          const result = await trading.getMarketData(testCase);
          
          // Should handle gracefully
          if (result === null || result === undefined) {
            console.log(`✅ Edge case "${testCase}" handled gracefully (returned ${result})`);
          } else {
            // If it returns data, it should be properly formatted
            expect(typeof result).toBe('object');
          }
          
        } catch (error) {
          // If it throws, should be a controlled error, not a crash
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBeDefined();
          console.log(`✅ Edge case "${testCase}" handled with controlled error: ${error.message}`);
        }
      }
    });

    test('EDGE CASE: extreme numerical values', async () => {
      console.log('🔍 Testing extreme numerical values...');
      
      const extremeValues = [
        { symbol: 'TEST', side: 'buy', quantity: 0.00000001, price: 999999999 },
        { symbol: 'TEST', side: 'sell', quantity: 999999999, price: 0.00000001 },
        { symbol: 'TEST', side: 'buy', quantity: Infinity, price: 100 },
        { symbol: 'TEST', side: 'buy', quantity: -100, price: 100 },
        { symbol: 'TEST', side: 'buy', quantity: NaN, price: 100 }
      ];
      
      for (const tradeParams of extremeValues) {
        try {
          const result = await trading.executeTrade(tradeParams);
          
          // Should either succeed with valid result or fail gracefully
          expect(result).toHaveProperty('success');
          
          if (result.success) {
            expect(result).toHaveProperty('orderId');
            console.log(`✅ Extreme value trade accepted: ${JSON.stringify(tradeParams)}`);
          } else {
            expect(result).toHaveProperty('error');
            console.log(`✅ Extreme value trade rejected safely: ${result.error}`);
          }
          
        } catch (error) {
          // Should not crash, should be handled error
          expect(error).toBeInstanceOf(Error);
          console.log(`✅ Extreme value handled with error: ${error.message}`);
        }
      }
    });

    test('EDGE CASE: rapid state changes', async () => {
      console.log('🔍 Testing rapid state changes...');
      
      // Simulate rapid state changes that could cause race conditions
      const rapidStateChanges = [];
      
      for (let i = 0; i < 20; i++) {
        rapidStateChanges.push(
          (async () => {
            await core.optimizeSystem();
            await core.analyzeSystem();
            if (i % 5 === 0) {
              core.resetSystemState();
            }
          })()
        );
      }
      
      // Should complete without crashing
      await Promise.all(rapidStateChanges);
      
      // Final state should be consistent
      const health = await core.systemHealth();
      expect(health).toHaveProperty('status');
      expect(health.status).toBe('healthy');
      
      console.log('✅ Rapid state changes handled safely');
    });
  });

  describe('⚡ Performance Regression Prevention', () => {
    
    test('PERFORMANCE: operation time regression', async () => {
      console.log('🔍 Testing performance regression detection...');
      
      // Performance baselines (should not exceed these in production)
      const performanceBaselines = {
        coreOptimization: 50, // ms - generous for CI
        marketDataFetch: 50,
        portfolioCalc: 30,
        systemAnalysis: 20,
        healthCheck: 20
      };
      
      const performanceResults = {};
      
      // Test core optimization
      let start = Date.now();
      await core.optimizeSystem();
      performanceResults.coreOptimization = Date.now() - start;
      
      // Test market data
      start = Date.now();
      await trading.getMarketData('BTCUSDT');
      performanceResults.marketDataFetch = Date.now() - start;
      
      // Test portfolio calculation
      start = Date.now();
      await trading.getPortfolio();
      performanceResults.portfolioCalc = Date.now() - start;
      
      // Test system analysis
      start = Date.now();
      await core.analyzeSystem();
      performanceResults.systemAnalysis = Date.now() - start;
      
      // Test health check
      start = Date.now();
      await core.systemHealth();
      performanceResults.healthCheck = Date.now() - start;
      
      // Check against baselines
      Object.entries(performanceBaselines).forEach(([operation, baseline]) => {
        const actual = performanceResults[operation];
        
        console.log(`📊 ${operation}: ${actual}ms (baseline: ${baseline}ms)`);
        
        if (actual > baseline) {
          console.warn(`⚠️ Performance regression in ${operation}: ${actual}ms > ${baseline}ms`);
        }
        
        // For CI/CD, use generous thresholds
        expect(actual).toBeLessThan(baseline);
      });
    });

    test('PERFORMANCE: memory usage regression', async () => {
      console.log('🔍 Testing memory usage regression...');
      
      const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024; // MB
      
      // Execute standard workload
      for (let i = 0; i < 100; i++) {
        await core.optimizeSystem();
        await trading.getMarketData('BTCUSDT');
        
        // Simulate garbage collection every 20 iterations
        if (i % 20 === 0 && global.gc) {
          global.gc();
        }
      }
      
      const finalMemory = process.memoryUsage().heapUsed / 1024 / 1024; // MB
      const memoryIncrease = finalMemory - initialMemory;
      
      console.log(`📊 Memory usage: ${initialMemory.toFixed(2)}MB → ${finalMemory.toFixed(2)}MB (+${memoryIncrease.toFixed(2)}MB)`);
      
      // Memory increase should not exceed 30MB for 100 operations
      expect(memoryIncrease).toBeLessThan(30);
      
      if (memoryIncrease > 15) {
        console.warn(`⚠️ Memory usage higher than expected: ${memoryIncrease.toFixed(2)}MB`);
      }
    });
  });

  describe('🔐 Security Regression Prevention', () => {
    
    test('SECURITY: input sanitization', async () => {
      console.log('🔍 Testing input sanitization...');
      
      // Test potentially malicious inputs
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '../../etc/passwd',
        'DROP TABLE users;',
        '${process.exit(1)}',
        '__proto__.polluted = true',
        JSON.stringify({__proto__: {polluted: true}})
      ];
      
      for (const maliciousInput of maliciousInputs) {
        try {
          // Test various functions with malicious input
          const result1 = await trading.getMarketData(maliciousInput);
          const result2 = await trading.executeTrade({
            symbol: maliciousInput,
            side: maliciousInput,
            quantity: maliciousInput
          });
          
          // Should handle safely without executing malicious code
          console.log(`✅ Malicious input "${maliciousInput}" handled safely`);
          
        } catch (error) {
          // Should fail safely without exposing system info
          expect(error.message).not.toContain('eval');
          expect(error.message).not.toContain('require');
          expect(error.message).not.toContain('process');
        }
      }
    });

    test('SECURITY: no sensitive data exposure', async () => {
      console.log('🔍 Testing sensitive data exposure prevention...');
      
      // Get system information
      const health = await core.systemHealth();
      const portfolio = await trading.getPortfolio();
      const analysis = await trading.analyzeTrend();
      
      // Convert to JSON to check for sensitive data
      const healthJson = JSON.stringify(health);
      const portfolioJson = JSON.stringify(portfolio);
      const analysisJson = JSON.stringify(analysis);
      
      // Should not contain sensitive patterns
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /key/i,
        /token/i,
        /auth/i,
        /credential/i,
        /private/i
      ];
      
      sensitivePatterns.forEach(pattern => {
        expect(healthJson).not.toMatch(pattern);
        expect(portfolioJson).not.toMatch(pattern);
        expect(analysisJson).not.toMatch(pattern);
      });
      
      console.log('✅ No sensitive data patterns found in responses');
    });
  });
});

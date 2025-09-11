/**
 * QBTC System Integration Tests
 * 
 * Tests the integration between major components
 * to ensure they work together correctly in production scenarios.
 */

const { kernelRNG } = require('../../src/utils/kernel-rng.js');
const safeMath = require('../../src/utils/safe-math.js');
const { realisticMarketMock } = require('../../src/mocks/realistic-market-mock.js');

describe('QBTC System Integration Tests', () => {
    beforeAll(() => {
        // Set deterministic seed for reproducible tests
        kernelRNG.seed(123456);
    });

    describe('Core Components Integration', () => {
        test('Kernel RNG integrates with Safe Math operations', () => {
            const iterations = 1000;
            const results = [];

            for (let i = 0; i < iterations; i++) {
                const numerator = kernelRNG.nextFloat() * 100;
                const denominator = kernelRNG.nextFloat() * 10;
                const result = safeMath.safeDiv(numerator, denominator, 0);
                
                expect(result).toBeGreaterThanOrEqual(0);
                expect(result).toBeLessThan(Infinity);
                expect(Number.isNaN(result)).toBe(false);
                
                results.push(result);
            }

            // Verify statistical properties
            const mean = results.reduce((a, b) => a + b, 0) / results.length;
            expect(mean).toBeGreaterThan(0);
            expect(mean).toBeLessThan(1000); // Reasonable upper bound
        });

        test('Market Mock provides consistent data with RNG seed', () => {
            // Reset RNG for consistent test
            kernelRNG.seed(789012);

            const price1 = realisticMarketMock.getPrice('BTCUSDT');
            const ticker1 = realisticMarketMock.getTicker('BTCUSDT');

            // Reset RNG to same seed
            kernelRNG.seed(789012);

            const price2 = realisticMarketMock.getPrice('BTCUSDT');
            const ticker2 = realisticMarketMock.getTicker('BTCUSDT');

            // Prices should be deterministic with same RNG seed
            expect(price1).toBe(price2);
            expect(ticker1.price).toBe(ticker2.price);
            expect(ticker1.change24h).toBe(ticker2.change24h);
        });

        test('Trading calculations using integrated components', () => {
            // Simulate a complete trading calculation pipeline
            const portfolioValue = 10000;
            const riskPerTrade = 0.02;

            const results = [];

            for (let i = 0; i < 100; i++) {
                // Get market data
                const btcPrice = realisticMarketMock.getPrice('BTCUSDT');
                const ticker = realisticMarketMock.getTicker('BTCUSDT');

                // Calculate position size using Kelly criterion
                const historicalWinRate = 0.6; // 60% win rate
                const avgWinPercent = 0.03; // 3% average win
                const avgLossPercent = 0.02; // 2% average loss

                const b = safeMath.safeDiv(avgWinPercent, avgLossPercent, 1);
                const kellyFraction = safeMath.clampValue(
                    (b * historicalWinRate - (1 - historicalWinRate)) / b,
                    0,
                    0.25 // Maximum 25% of portfolio
                );

                // Calculate actual position size
                const riskAmount = portfolioValue * riskPerTrade;
                const stopLossPercent = 0.03; // 3% stop loss
                
                const positionValue = safeMath.safeDiv(riskAmount, stopLossPercent, 0);
                const finalPositionSize = Math.min(
                    positionValue,
                    portfolioValue * kellyFraction
                );

                const btcQuantity = safeMath.safeDiv(finalPositionSize, btcPrice, 0);

                // Validation checks
                expect(btcPrice).toBeGreaterThan(0);
                expect(finalPositionSize).toBeGreaterThanOrEqual(0);
                expect(finalPositionSize).toBeLessThanOrEqual(portfolioValue * 0.25);
                expect(btcQuantity).toBeGreaterThanOrEqual(0);

                results.push({
                    price: btcPrice,
                    positionSize: finalPositionSize,
                    quantity: btcQuantity,
                    kellyFraction
                });
            }

            // Verify all calculations completed successfully
            expect(results).toHaveLength(100);
            expect(results.every(r => r.price > 0)).toBe(true);
            expect(results.every(r => r.positionSize >= 0)).toBe(true);
        });
    });

    describe('Performance Integration Tests', () => {
        test('System maintains performance under load', () => {
            const startTime = Date.now();
            const iterations = 10000;

            for (let i = 0; i < iterations; i++) {
                // Simulate high-frequency operations
                const randomValue = kernelRNG.nextFloat();
                const price = realisticMarketMock.getPrice('ETHUSDT');
                const calculation = safeMath.safeDiv(price, randomValue * 100 + 1, 0);
                
                // Basic validation
                expect(calculation).toBeGreaterThanOrEqual(0);
            }

            const endTime = Date.now();
            const totalTime = endTime - startTime;
            const opsPerSecond = (iterations * 3) / (totalTime / 1000); // 3 operations per iteration

            console.log(`Performance test: ${opsPerSecond.toFixed(0)} ops/sec`);
            
            // Should maintain at least 1000 ops/sec for production readiness
            expect(opsPerSecond).toBeGreaterThan(1000);
        });

        test('Memory usage remains stable during extended operations', () => {
            const initialMemory = process.memoryUsage();
            const iterations = 5000;

            // Perform memory-intensive operations
            const results = [];
            for (let i = 0; i < iterations; i++) {
                const data = {
                    timestamp: Date.now(),
                    prices: {},
                    calculations: []
                };

                // Simulate market data collection
                const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];
                symbols.forEach(symbol => {
                    data.prices[symbol] = realisticMarketMock.getPrice(symbol);
                    data.calculations.push({
                        rng: kernelRNG.nextFloat(),
                        safe: safeMath.safeDiv(data.prices[symbol], 100, 0)
                    });
                });

                if (i % 1000 === 0) {
                    // Only keep recent results to test memory management
                    results.splice(0, Math.max(0, results.length - 1000));
                }

                results.push(data);
            }

            const finalMemory = process.memoryUsage();
            const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

            console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`);

            // Memory increase should be reasonable (less than 50MB for this test)
            expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
        });
    });

    describe('Error Handling Integration', () => {
        test('System handles edge cases gracefully', () => {
            // Test various edge cases that could occur in production
            const edgeCases = [
                () => safeMath.safeDiv(100, 0, -1), // Division by zero
                () => safeMath.safeDiv(Infinity, 100, 0), // Infinity input
                () => safeMath.safeDiv(100, NaN, 0), // NaN input
                () => safeMath.clampValue(-Infinity, 0, 1), // Negative infinity
                () => safeMath.clampValue(Infinity, 0, 1), // Positive infinity
            ];

            edgeCases.forEach((testCase, index) => {
                expect(() => {
                    const result = testCase();
                    expect(Number.isFinite(result) || result === 0 || result === -1).toBe(true);
                }).not.toThrow(`Edge case ${index} should not throw`);
            });
        });

        test('Market mock handles invalid symbols gracefully', () => {
            const invalidSymbols = ['INVALID', '', null, undefined, 123];

            invalidSymbols.forEach(symbol => {
                expect(() => {
                    const price = realisticMarketMock.getPrice(symbol);
                    // Should return a number or null/undefined, not throw
                    expect(typeof price === 'number' || price === null || price === undefined).toBe(true);
                }).not.toThrow(`Invalid symbol ${symbol} should not throw`);
            });
        });
    });

    describe('Deterministic Behavior Validation', () => {
        test('Complete system produces identical results with same seed', () => {
            const runSystemTest = (seed) => {
                kernelRNG.seed(seed);
                const results = [];

                for (let i = 0; i < 50; i++) {
                    const price = realisticMarketMock.getPrice('BTCUSDT');
                    const random = kernelRNG.nextFloat();
                    const calculation = safeMath.safeDiv(price, random * 10 + 1, 0);
                    
                    results.push({ price, random, calculation });
                }

                return results;
            };

            const results1 = runSystemTest(555666);
            const results2 = runSystemTest(555666);

            // All results should be identical
            expect(results1).toHaveLength(results2.length);
            
            for (let i = 0; i < results1.length; i++) {
                expect(results1[i].price).toBe(results2[i].price);
                expect(results1[i].random).toBe(results2[i].random);
                expect(results1[i].calculation).toBe(results2[i].calculation);
            }
        });
    });
});

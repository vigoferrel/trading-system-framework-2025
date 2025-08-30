/**
 * Tests Unitarios Simplificados - Core System
 * Pruebas básicas para verificar funcionalidad del sistema core
 */

const core = require('../../core');

describe('Core System - Basic Tests', () => {
  
  beforeEach(() => {
    // Reset system state before each test
    if (core.resetSystemState) {
      core.resetSystemState();
    }
  });

  describe('System Optimization', () => {
    test('should optimize system successfully', async () => {
      const result = await core.optimizeSystem();
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('totalOptimizations');
      expect(result).toHaveProperty('success', true);
      expect(typeof result.totalOptimizations).toBe('number');
      expect(result.totalOptimizations).toBeGreaterThan(0);
    });

    test('should return valid timestamp', async () => {
      const result = await core.optimizeSystem();
      
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('number');
      expect(result.timestamp).toBeGreaterThan(0);
    });
  });

  describe('System Suggestions', () => {
    test('should return array of suggestions', async () => {
      const suggestions = await core.getSystemSuggestions();
      
      expect(Array.isArray(suggestions)).toBe(true);
    });

    test('should return valid suggestion structure', async () => {
      const suggestions = await core.getSystemSuggestions();
      
      if (suggestions.length > 0) {
        const suggestion = suggestions[0];
        expect(suggestion).toHaveProperty('type');
        expect(suggestion).toHaveProperty('message');
        expect(typeof suggestion.type).toBe('string');
        expect(typeof suggestion.message).toBe('string');
      }
    });
  });

  describe('Execution Logs', () => {
    test('should return array of logs', async () => {
      // First trigger an optimization to generate logs
      await core.optimizeSystem();
      
      const logs = await core.getExecutionLogs();
      
      expect(Array.isArray(logs)).toBe(true);
    });

    test('should generate logs after optimization', async () => {
      await core.optimizeSystem();
      const logs = await core.getExecutionLogs();
      
      expect(logs.length).toBeGreaterThan(0);
      expect(typeof logs[0]).toBe('string');
    });
  });

  describe('System Analysis', () => {
    test('should analyze system performance', async () => {
      const analysis = await core.analyzeSystem();
      
      expect(analysis).toBeDefined();
      expect(analysis).toHaveProperty('cpu');
      expect(analysis).toHaveProperty('memory');
      expect(analysis).toHaveProperty('processes');
      expect(typeof analysis.cpu).toBe('number');
      expect(typeof analysis.memory).toBe('number');
      expect(typeof analysis.processes).toBe('number');
    });
  });

  describe('System Health', () => {
    test('should provide system health status', async () => {
      const health = await core.systemHealth();
      
      expect(health).toBeDefined();
      expect(health).toHaveProperty('status', 'healthy');
      expect(health).toHaveProperty('uptime');
      expect(health).toHaveProperty('memory');
      
      // Debug: log the actual values if test fails
      if (typeof health.uptime !== 'number') {
        console.log('DEBUG health object:', JSON.stringify(health, null, 2));
      }
      
      expect(typeof health.uptime).toBe('number');
      expect(typeof health.memory).toBe('object');
    });

    test('should have valid memory metrics', async () => {
      const health = await core.systemHealth();
      
      expect(health.memory).toHaveProperty('usage');
      expect(health.memory).toHaveProperty('available');
      expect(typeof health.memory.usage).toBe('number');
      expect(typeof health.memory.available).toBe('number');
      expect(health.memory.usage).toBeGreaterThanOrEqual(0);
      expect(health.memory.usage).toBeLessThanOrEqual(1);
    });
  });

  describe('Performance', () => {
    test('should complete operations quickly', async () => {
      const startTime = Date.now();
      
      await Promise.all([
        core.optimizeSystem(),
        core.getSystemSuggestions(),
        core.analyzeSystem(),
        core.systemHealth()
      ]);
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Less than 1 second
    });
  });

  describe('State Management', () => {
    test('should maintain state between operations', async () => {
      const result1 = await core.optimizeSystem();
      const result2 = await core.optimizeSystem();
      
      expect(result2.totalOptimizations).toBeGreaterThan(result1.totalOptimizations);
    });

    test('should reset state when requested', () => {
      if (core.resetSystemState) {
        expect(() => core.resetSystemState()).not.toThrow();
      }
    });
  });
});

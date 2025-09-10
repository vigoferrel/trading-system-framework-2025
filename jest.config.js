/**
 * Jest Configuration
 * Testing framework para el ecosistema de trading
 */

module.exports = {
  // Environment
  testEnvironment: 'node',
  
  // Test patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.spec.js'
  ],
  
  // Coverage
  collectCoverage: true,
  collectCoverageFrom: [
    'core.js',
    'trading-engine.js',
    '!node_modules/**',
    '!coverage/**',
    '!jest.config.js',
    '!__tests__/**',
    '!**/*.test.js',
    '!**/*.spec.js'
  ],
  
  coverageThreshold: {
    global: {
    branches: 70,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json'
  ],
  
  // Test setup
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  
  // Timeout
  testTimeout: 30000,
  
  // Detect open handles for async cleanup debugging
  detectOpenHandles: true,
  forceExit: true,
  
  // Modules
  moduleFileExtensions: [
    'js',
    'json'
  ],
  
  // Transform
  transform: {},
  
  // Verbose
  verbose: true,
  
  // Mock patterns  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true
};

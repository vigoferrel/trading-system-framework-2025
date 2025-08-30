/**
 * Jest Setup - Configuración global para tests
 * Mocks y utilidades compartidas
 */

// Mock console methods para tests más limpios
const originalConsole = { ...console };

global.mockConsole = () => {
  global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  };
};

global.restoreConsole = () => {
  global.console = originalConsole;
};

// Mock para axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn()
  }))
}));

// Mock para socket.io
jest.mock('socket.io', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    listen: jest.fn()
  }));
});

// Mock para ws
jest.mock('ws', () => {
  return {
    WebSocketServer: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      close: jest.fn()
    })),
    WebSocket: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      send: jest.fn(),
      close: jest.fn()
    }))
  };
});

// Mock para child_process
jest.mock('child_process', () => ({
  spawn: jest.fn().mockImplementation(() => ({
    stdout: { on: jest.fn() },
    stderr: { on: jest.fn() },
    on: jest.fn()
  })),
  exec: jest.fn()
}));

// Utilities para tests
global.createMockResponse = (data, status = 200) => ({
  data,
  status,
  headers: {},
  config: {},
  statusText: 'OK'
});

global.createMockError = (message, status = 500) => {
  const error = new Error(message);
  error.response = {
    status,
    statusText: 'Internal Server Error',
    data: { error: message }
  };
  return error;
};

// Mock system entropy para consistencia en tests
global.mockSystemEntropy = (value = 0.5) => {
  jest.doMock('../system-entropy', () => ({
    getSystemEntropy: jest.fn(() => value),
    getHashEntropy: jest.fn(() => value)
  }));
};

// Clean up después de cada test
afterEach(() => {
  jest.clearAllMocks();
  delete global.optimalSystemState;
});

// Setup antes de todos los tests
beforeAll(() => {
  // Mock process methods
  process.exit = jest.fn();
  process.uptime = jest.fn(() => 12345);
  process.memoryUsage = jest.fn(() => ({
    rss: 1000000,
    heapTotal: 800000,
    heapUsed: 600000,
    external: 100000,
    arrayBuffers: 50000
  }));
  process.cpuUsage = jest.fn(() => ({
    user: 100000,
    system: 50000
  }));
  
  console.log('🧪 [JEST SETUP] Test environment configured');
});

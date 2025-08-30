/**
 * Core System Mock - Para Testing
 * Simulación básica del sistema core para pruebas unitarias
 */

// Simulación de estado del sistema
let systemState = {
  optimizations: 0,
  suggestions: [],
  logs: [],
  performance: {
    cpu: 0,
    memory: 0,
    processes: 0
  },
  health: {
    status: 'healthy',
    uptime: 0,
    memory: { usage: 0.5, available: 0.5 }
  }
};

/**
 * Optimizar el sistema
 */
async function optimizeSystem() {
  systemState.optimizations += Math.floor(Math.random() * 10) + 1;
  systemState.logs.push(`System optimization completed: ${systemState.optimizations} total`);
  
  return {
    totalOptimizations: systemState.optimizations,
    timestamp: Date.now(),
    success: true
  };
}

/**
 * Obtener sugerencias del sistema
 */
async function getSystemSuggestions() {
  const suggestions = [
    { type: 'performance', message: 'Consider optimizing CPU usage', priority: 'medium' },
    { type: 'security', message: 'Update security certificates', priority: 'high' },
    { type: 'maintenance', message: 'Clean up temporary files', priority: 'low' }
  ];
  
  // Simular sugerencias dinámicas
  systemState.suggestions = suggestions.slice(0, Math.floor(Math.random() * 3) + 1);
  return systemState.suggestions;
}

/**
 * Obtener logs de ejecución
 */
async function getExecutionLogs() {
  return [...systemState.logs];
}

/**
 * Analizar rendimiento del sistema
 */
async function analyzeSystem() {
  systemState.performance = {
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    processes: Math.floor(Math.random() * 50)
  };
  
  return systemState.performance;
}

/**
 * Obtener estado de salud del sistema
 */
async function systemHealth() {
  // Get uptime, fallback to mock value if process.uptime returns undefined
  let uptime = process.uptime();
  if (typeof uptime !== 'number' || isNaN(uptime)) {
    uptime = 12345; // Default mock value
  }
  
  const health = {
    status: 'healthy',
    uptime: uptime,
    memory: {
      usage: Math.random() * 0.8,
      available: 1 - (Math.random() * 0.8)
    }
  };
  
  systemState.health = health;
  return health;
}

/**
 * Reset del estado para tests
 */
function resetSystemState() {
  systemState = {
    optimizations: 0,
    suggestions: [],
    logs: [],
    performance: { cpu: 0, memory: 0, processes: 0 },
    health: {
      status: 'healthy',
      uptime: 0,
      memory: { usage: 0.5, available: 0.5 }
    }
  };
}

module.exports = {
  optimizeSystem,
  getSystemSuggestions,
  getExecutionLogs,
  analyzeSystem,
  systemHealth,
  resetSystemState
};

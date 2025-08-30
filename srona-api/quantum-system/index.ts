/**
 * Sistema Cuántico Matriz 13x13 - Punto de Entrada Principal
 * El Mármol de Leonardo: Simplicidad Elegante, Complejidad Oculta
 */

// Exportar sistema principal
import { QuantumSystem, defaultQuantumConfig } from './QuantumSystem';
import { QuantumSystemConfig } from './types/quantum-types';
export { QuantumSystem, defaultQuantumConfig };

// Exportar motor cuántico
import { QuantumEngine } from './core/QuantumEngine';
export { QuantumEngine };

// Exportar ML Optimizer
import { MLOptimizer } from './ml/MLOptimizer';
export { MLOptimizer };

// Exportar componentes de UI
import { QuantumMatrix } from './components/QuantumMatrix';
export { QuantumMatrix };
import { CopilotHiperInteligente } from './components/CopilotHiperInteligente';
export { CopilotHiperInteligente };

// Exportar página principal
import QuantumSystemPage from '../pages/QuantumSystemPage';
export { QuantumSystemPage };

// Exportar todos los tipos
export * from './types/quantum-types';

// Configuración por defecto para uso rápido
export const QUANTUM_CONFIG = {
  // Los 13 activos estratégicos de la matriz
  ASSETS: [
    'BTC', 'ETH', 'BNB', 'SOL', 'ADA',
    'USDT', 'USDC', 'BUSD', 'DOT', 'LINK',
    'AVAX', 'UNI', 'DOGE'
  ] as const,
  
  // Configuración de actualización
  UPDATE_FREQUENCY: 1000, // 1 segundo
  
  // Configuración ML
  ML_OPTIMIZATION_FREQUENCY: 100, // 100ms
  
  // Configuración de riesgo
  DEFAULT_STOP_LOSS: 0.02, // 2%
  DEFAULT_TAKE_PROFIT: 0.05, // 5%
  
  // Configuración UI
  MATRIX_SIZE: 13,
  ANIMATION_SPEED: 1000
};

// Utilidades para inicialización rápida
export const createQuantumSystem = (customConfig?: Partial<QuantumSystemConfig>) => {
  const config = { ...defaultQuantumConfig, ...customConfig };
  return new QuantumSystem(config);
};

// Versión del sistema
export const VERSION = '1.0.0';

// Información del sistema
export const SYSTEM_INFO = {
  name: 'Sistema Cuántico Matriz 13x13',
  version: VERSION,
  description: 'Sistema de trading cuántico con ML en tiempo real',
  philosophy: 'El Mármol de Leonardo - Simplicidad Elegante, Complejidad Oculta',
  features: [
    'Matriz cuántica 13x13 con 169 elementos',
    'Motor de pricing cuántico vs Binance',
    'ML Optimizer con algoritmo genético',
    'Arbitraje basis + opciones naked',
    'Gestión automática de riesgo',
    'Copilot omnisciente',
    'UI ultra-minimalista'
  ],
  technologies: [
    'TypeScript',
    'React',
    'Física Cuántica',
    'Machine Learning',
    'Algoritmos Genéticos',
    'Black-Scholes Modificado'
  ]
};

// Función de ayuda para debugging
export const debugQuantumSystem = (system: QuantumSystem) => {
  console.group('🔬 Debug Sistema Cuántico');
  console.info('📊 Estado del Sistema:', system.getSystemState());
  console.info('🎯 Matriz Actual:', system.getMatrix());
  console.info('🤖 Estadísticas ML:', system.getMLStats());
  console.info('ℹ️ Información del Sistema:', SYSTEM_INFO);
  console.groupEnd();
};

// Función de ayuda para monitoreo
export const monitorQuantumSystem = (system: QuantumSystem, interval: number = 5000) => {
  const monitor = setInterval(() => {
    const state = system.getSystemState();
    const matrix = system.getMatrix();
    
    console.info(`🔄 [${new Date().toLocaleTimeString()}] Sistema Cuántico:`, {
      status: state.status,
      oportunidades: state.activeOpportunities,
      trades: state.totalTrades,
      precision: `${(state.performance.accuracy * 100).toFixed(1)}%`,
      pnl: `$${state.performance.profitLoss.toFixed(2)}`,
      ultimaActualizacion: new Date(matrix.lastUpdated).toLocaleTimeString()
    });
  }, interval);
  
  return () => clearInterval(monitor);
};

// Exportar todo como default para importación fácil
export default {
  QuantumSystem,
  QuantumEngine,
  MLOptimizer,
  QuantumMatrix,
  CopilotHiperInteligente,
  QuantumSystemPage,
  defaultQuantumConfig,
  QUANTUM_CONFIG,
  SYSTEM_INFO,
  VERSION,
  createQuantumSystem,
  debugQuantumSystem,
  monitorQuantumSystem
} as const;

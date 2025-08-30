declare module '../../../src/integrators/SronaQuantumIntegrator' {
  export class SronaQuantumIntegrator {
    isConnected: boolean;
    initializeQuantumConnection(): Promise<void>;
    executeQuantumFusion(): Promise<any>;
    getQuantumState(): Promise<any>;
    getFusionMetrics(): Promise<any>;
    getQuantumMatrices(): Promise<any>;
    getNakedOpportunities(): Promise<any>;
    getSronaTradingSignals(): Promise<any>;
    reconnect(): Promise<boolean>;
  }
  export default SronaQuantumIntegrator;
}
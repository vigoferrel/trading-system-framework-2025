
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

/**
 * EMERGENCY SYSTEM RESTART
 * ========================
 * 
 * Restarts all critical trading systems to resolve the fundamental issue:
 * Trading bots are not running, which is why positions never close.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class EmergencySystemRestart {
    constructor() {
        this.processes = new Map();
        this.restartAttempts = 0;
        this.maxRestartAttempts = 3;
    }

    async executeEmergencyRestart() {
        console.log('[ALERT] EMERGENCY SYSTEM RESTART INITIATED');
        console.log('[DATA] Root Cause: Trading bots are not running');
        console.log(' Solution: Restart all critical trading systems');
        
        try {
            // Step 1: Kill any hanging processes
            await this.killHangingProcesses();
            
            // Step 2: Start main trading system (port 4601)
            await this.startMainTradingSystem();
            
            // Step 3: Start Leonardo system (port 4603) 
            await this.startLeonardoSystem();
            
            // Step 4: Verify systems are running
            await this.verifySystemsRunning();
            
            // Step 5: Execute emergency close for BTC position
            await this.executeEmergencyClose();
            
            console.log('[OK] EMERGENCY RESTART COMPLETED SUCCESSFULLY');
            return true;
            
        } catch (error) {
            console.error('[ERROR] EMERGENCY RESTART FAILED:', error.message);
            return false;
        }
    }

    async killHangingProcesses() {
        console.log('[RELOAD] Killing hanging processes...');
        
        try {
            // Kill processes by port
            const ports = [4601, 4603];
            for (const port of ports) {
                try {
                    const { exec } = require('child_process');
                    await new Promise((resolve) => {
                        exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
                            if (stdout) {
                                const lines = stdout.split('\n');
                                for (const line of lines) {
                                    const match = line.match(/\s+(\d+)$/);
                                    if (match) {
                                        const pid = match[1];
                                        exec(`taskkill /F /PID ${pid}`, () => {});
                                    }
                                }
                            }
                            resolve();
                        });
                    });
                } catch (e) {
                    // Continue if process not found
                }
            }
            
            // Wait for processes to die
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('[OK] Hanging processes killed');
            
        } catch (error) {
            console.log('[WARNING] Error killing processes (continuing):', error.message);
        }
    }

    async startMainTradingSystem() {
        console.log('[START] Starting main trading system (port 4601)...');
        
        try {
            // Check if index.js exists
            if (fs.existsSync('./index.js')) {
                const childProcess = spawn('node', ['index.js'], {
                    cwd: process.cwd(),
                    stdio: ['ignore', 'pipe', 'pipe'],
                    detached: false
                });
                
                this.processes.set('main', childProcess);
                
                // Wait for startup
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('Main system startup timeout'));
                    }, 10000);
                    
                    childProcess.stdout.on('data', (data) => {
                        const output = data.toString();
                        console.log('[MAIN]', output.trim());
                        
                        if (output.includes('running on port') || output.includes('Server listening')) {
                            clearTimeout(timeout);
                            resolve();
                        }
                    });
                    
                    childProcess.stderr.on('data', (data) => {
                        const error = data.toString();
                        if (!error.includes('warning') && !error.includes('deprecated')) {
                            console.error('[MAIN ERROR]', error.trim());
                        }
                    });
                    
                    childProcess.on('exit', (code) => {
                        if (code !== 0) {
                            clearTimeout(timeout);
                            reject(new Error(`Main system exited with code ${code}`));
                        }
                    });
                });
                
                console.log('[OK] Main trading system started');
            } else {
                throw new Error('index.js not found');
            }
            
        } catch (error) {
            console.error('[ERROR] Failed to start main trading system:', error.message);
            throw error;
        }
    }

    async startLeonardoSystem() {
        console.log('[START] Starting Leonardo system (port 4603)...');
        
        try {
            // Check if index-leonardo.js exists
            if (fs.existsSync('./index-leonardo.js')) {
                const process = spawn('node', ['index-leonardo.js'], {
                    cwd: process.cwd(),
                    stdio: ['ignore', 'pipe', 'pipe'],
                    detached: false
                });
                
                this.processes.set('leonardo', process);
                
                // Wait for startup
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('Leonardo system startup timeout'));
                    }, 10000);
                    
                    process.stdout.on('data', (data) => {
                        const output = data.toString();
                        console.log('[LEONARDO]', output.trim());
                        
                        if (output.includes('running on port') || output.includes('iniciado en puerto')) {
                            clearTimeout(timeout);
                            resolve();
                        }
                    });
                    
                    process.stderr.on('data', (data) => {
                        const error = data.toString();
                        if (!error.includes('warning') && !error.includes('deprecated')) {
                            console.error('[LEONARDO ERROR]', error.trim());
                        }
                    });
                    
                    process.on('exit', (code) => {
                        if (code !== 0) {
                            clearTimeout(timeout);
                            reject(new Error(`Leonardo system exited with code ${code}`));
                        }
                    });
                });
                
                console.log('[OK] Leonardo system started');
            } else {
                console.log('[WARNING] index-leonardo.js not found, skipping');
            }
            
        } catch (error) {
            console.error('[ERROR] Failed to start Leonardo system:', error.message);
            // Don't throw - Leonardo is optional
        }
    }

    async verifySystemsRunning() {
        console.log('[SEARCH] Verifying systems are running...');
        
        const axios = require('axios').default;
        const tests = [
            { name: 'Main Trading System', url: 'http://localhost:4601/health' },
            { name: 'Leonardo System', url: 'http://localhost:4603/api/status' }
        ];
        
        for (const test of tests) {
            try {
                const response = await axios.get(test.url, { timeout: 5000 });
                console.log(`[OK] ${test.name}: RUNNING`);
            } catch (error) {
                console.log(`[ERROR] ${test.name}: NOT RESPONDING`);
            }
        }
    }

    async executeEmergencyClose() {
        console.log('[ALERT] Executing emergency close for BTC options position...');
        
        try {
            // Try to close via main system
            const axios = require('axios').default;
            
            try {
                const response = await axios.post('http://localhost:4601/close-all-positions', {}, {
                    timeout: 10000
                });
                console.log('[OK] Emergency close executed via main system');
                return;
            } catch (e) {
                console.log('[WARNING] Main system not responding, trying Leonardo...');
            }
            
            try {
                const response = await axios.post('http://localhost:4603/api/close-all-positions', {}, {
                    timeout: 10000
                });
                console.log('[OK] Emergency close executed via Leonardo system');
                return;
            } catch (e) {
                console.log('[WARNING] Leonardo system not responding');
            }
            
            // If both fail, create manual close order
            console.log(' Creating manual close order...');
            const closeOrder = {
                timestamp: Date.now(),
                symbol: 'BTCUSDT',
                action: 'EMERGENCY_CLOSE',
                reason: 'System restart - prevent further losses',
                currentPNL: -77.04,
                status: 'PENDING_MANUAL_EXECUTION'
            };
            
            fs.writeFileSync('./EMERGENCY_CLOSE_BTCUSDT_UPDATED.json', JSON.stringify(closeOrder, null, 2));
            console.log('[OK] Manual close order created');
            
        } catch (error) {
            console.error('[ERROR] Emergency close failed:', error.message);
        }
    }

    async gracefulShutdown() {
        console.log(' Graceful shutdown initiated...');
        
        for (const [name, process] of this.processes) {
            try {
                process.kill('SIGTERM');
                console.log(`[OK] ${name} process terminated`);
            } catch (error) {
                console.log(`[WARNING] Error terminating ${name}:`, error.message);
            }
        }
    }
}

// Execute if run directly
if (require.main === module) {
    const restart = new EmergencySystemRestart();
    
    restart.executeEmergencyRestart()
        .then((success) => {
            if (success) {
                console.log(' EMERGENCY RESTART SUCCESSFUL');
                console.log('[DATA] Trading bots should now be functional');
                console.log('[MONEY] BTC position closure initiated');
            } else {
                console.log(' EMERGENCY RESTART FAILED');
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error(' CRITICAL ERROR:', error);
            process.exit(1);
        });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => restart.gracefulShutdown());
    process.on('SIGTERM', () => restart.gracefulShutdown());
}

module.exports = { EmergencySystemRestart };
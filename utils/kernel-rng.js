/**
 * 🔢 KERNEL RNG - Sistema de generación aleatoria basado en kernel
 * No usa Math.random() - utiliza crypto y métricas del sistema
 * 
 * @author QBTC Quantum Consciousness Trading System
 * @version 1.0.0
 */

const crypto = require('crypto');
const os = require('os');
const { performance } = require('perf_hooks');

class KernelRNG {
    constructor() {
        this.seedBuffer = Buffer.alloc(32);
        this.entropy = 0;
        this.lastUpdate = Date.now();
        this.initializeSeeds();
    }
    
    initializeSeeds() {
        try {
            // Usar crypto.randomBytes del kernel
            const kernelSeed = crypto.randomBytes(16);
            kernelSeed.copy(this.seedBuffer, 0);
            
            // Métricas del sistema
            const systemData = Buffer.from([
                ...this.getSystemEntropy(),
                ...this.getProcessMetrics()
            ]);
            
            systemData.copy(this.seedBuffer, 16, 0, Math.min(16, systemData.length));
            this.entropy = this.calculateEntropy();
            
        } catch (error) {
            // Fallback usando timestamps precisos
            const timestampSeed = Buffer.from(Date.now().toString() + performance.now().toString());
            timestampSeed.copy(this.seedBuffer, 0, 0, Math.min(32, timestampSeed.length));
        }
    }
    
    getSystemEntropy() {
        const cpus = os.cpus();
        const loadAvg = os.loadavg();
        
        return [
            cpus.length % 256,
            (os.totalmem() / 1024 / 1024) % 256,
            (os.freemem() / 1024 / 1024) % 256,
            Math.floor(loadAvg[0] * 100) % 256,
            Math.floor(loadAvg[1] * 100) % 256,
            performance.now() % 256
        ];
    }
    
    getProcessMetrics() {
        const memUsage = process.memoryUsage();
        const hrtime = process.hrtime.bigint();
        
        return [
            (memUsage.rss / 1024 / 1024) % 256,
            (memUsage.heapUsed / 1024 / 1024) % 256,
            Number(hrtime % 256n),
            process.pid % 256,
            performance.now() % 256
        ];
    }
    
    calculateEntropy() {
        const frequencies = new Array(256).fill(0);
        for (let i = 0; i < this.seedBuffer.length; i++) {
            frequencies[this.seedBuffer[i]]++;
        }
        
        let entropy = 0;
        const bufferLength = this.seedBuffer.length;
        for (let freq of frequencies) {
            if (freq > 0) {
                const probability = freq / bufferLength;
                entropy -= probability * Math.log2(probability);
            }
        }
        return entropy;
    }
    
    /**
     * Generar número aleatorio [0, 1) usando kernel
     */
    random() {
        try {
            const randomBytes = crypto.randomBytes(4);
            let combined = 0;
            for (let i = 0; i < 4; i++) {
                combined += randomBytes[i] * this.seedBuffer[(Date.now() + i) % this.seedBuffer.length];
            }
            return (combined % 1000000) / 1000000;
            
        } catch (error) {
            // Fallback con performance timing
            const now = performance.now();
            const memUsage = process.memoryUsage().rss;
            const combined = (now * memUsage) % 1000000;
            return combined / 1000000;
        }
    }
    
    randomInt(min = 0, max = 100) {
        const range = max - min;
        return Math.floor(this.random() * range) + min;
    }
    
    randomFloat(min = 0.0, max = 1.0) {
        const range = max - min;
        return this.random() * range + min;
    }
    
    choice(array) {
        if (!Array.isArray(array) || array.length === 0) return null;
        const index = this.randomInt(0, array.length);
        return array[index];
    }
    
    generateUUID() {
        try {
            if (crypto.randomUUID) return crypto.randomUUID();
            
            const bytes = crypto.randomBytes(16);
            bytes[6] = (bytes[6] & 0x0f) | 0x40;
            bytes[8] = (bytes[8] & 0x3f) | 0x80;
            
            const hex = bytes.toString('hex');
            return [
                hex.substr(0, 8),
                hex.substr(8, 4), 
                hex.substr(12, 4),
                hex.substr(16, 4),
                hex.substr(20, 12)
            ].join('-');
            
        } catch (error) {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = Math.floor(this.random() * 16);
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }
    
    getMetrics() {
        return {
            entropy: this.entropy,
            lastUpdate: this.lastUpdate,
            seedAge: Date.now() - this.lastUpdate
        };
    }
}

// Instancia singleton
const kernelRNG = new KernelRNG();

module.exports = {
    random: () => kernelRNG.random(),
    randomInt: (min, max) => kernelRNG.randomInt(min, max),
    randomFloat: (min, max) => kernelRNG.randomFloat(min, max),
    choice: (array) => kernelRNG.choice(array),
    generateUUID: () => kernelRNG.generateUUID(),
    getMetrics: () => kernelRNG.getMetrics(),
    getInstance: () => kernelRNG
};

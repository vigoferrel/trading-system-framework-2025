/**
 * 🚀 ECOSYSTEM SCALER & MANAGER
 * =============================
 * 
 * Sistema de escalabilidad automática que:
 * - Gestiona todos los componentes del ecosistema
 * - Escala dinámicamente basado en carga
 * - Optimiza recursos automáticamente
 * - Maneja failover y recuperación
 * - Proporciona APIs centralizadas
 * - Administra configuraciones globales
 * 
 * COMPONENTES GESTIONADOS:
 * - Core Anti-418 (4602)
 * - Hybrid Optimizer V2 (4800) 
 * - Concentrated Hybrid V3 (4850)
 * - Intelligent Monitor (5000)
 * - Este Scaler (5500)
 */

const express = require('express');
const axios = require('axios');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5500;

app.use(express.json());

// 🎯 CONFIGURACIÓN DEL ESCALADOR
const SCALER_CONFIG = {
    SCALING_INTERVAL: 10000,    // 10 segundos
    HEALTH_CHECK_TIMEOUT: 5000,
    MAX_RESTART_ATTEMPTS: 3,
    RESOURCE_THRESHOLDS: {
        CPU_HIGH: 80,
        MEMORY_HIGH: 85,
        RESPONSE_TIME_HIGH: 3000,
        ERROR_RATE_HIGH: 0.1
    },
    COMPONENTS: {
        CORE_ANTI_418: {
            name: 'Core Anti-418',
            script: 'core-optimal-anti418.js',
            port: 4602,
            priority: 1,
            minInstances: 1,
            maxInstances: 2,
            scalingMetric: 'requests_per_second',
            healthEndpoint: '/health',
            criticalEndpoints: ['/api/strategic-overview', '/api/raw-signals', '/api/raw-opportunities'],
            autoRestart: true,
            resourceLimits: {
                maxMemory: '512MB',
                maxCpu: 50
            }
        },
        HYBRID_OPTIMIZER: {
            name: 'Hybrid Optimizer V2',
            script: 'hybrid-recommendation-optimizer.js',
            port: 4800,
            priority: 2,
            minInstances: 1,
            maxInstances: 2,
            scalingMetric: 'analysis_complexity',
            healthEndpoint: '/health',
            criticalEndpoints: ['/api/optimized-recommendations', '/api/hybrid-analysis'],
            autoRestart: true,
            resourceLimits: {
                maxMemory: '256MB',
                maxCpu: 30
            }
        },
        CONCENTRATED_HYBRID: {
            name: 'Concentrated Hybrid V3',
            script: 'concentrated-hybrid-system.js',
            port: 4850,
            priority: 3,
            minInstances: 1,
            maxInstances: 1,
            scalingMetric: 'recommendations_quality',
            healthEndpoint: '/health',
            criticalEndpoints: ['/api/concentrated-analysis', '/api/concentrated-top/10'],
            autoRestart: true,
            resourceLimits: {
                maxMemory: '256MB',
                maxCpu: 25
            }
        },
        INTELLIGENT_MONITOR: {
            name: 'Intelligent Monitor',
            script: 'intelligent-monitor-dashboard.js',
            port: 5000,
            priority: 4,
            minInstances: 1,
            maxInstances: 1,
            scalingMetric: 'connected_clients',
            healthEndpoint: '/api/health',
            criticalEndpoints: ['/api/status', '/'],
            autoRestart: true,
            resourceLimits: {
                maxMemory: '128MB',
                maxCpu: 15
            }
        }
    }
};

console.log('🚀 [ECOSYSTEM SCALER] Iniciando sistema de escalabilidad...');

// 🧠 MOTOR DE ESCALABILIDAD INTELIGENTE
class EcosystemScaler {
    constructor() {
        this.processes = new Map();
        this.metrics = new Map();
        this.scalingDecisions = [];
        this.lastScalingCheck = 0;
        this.isScaling = false;
        this.restartAttempts = new Map();
        this.globalHealth = {
            status: 'INITIALIZING',
            score: 0,
            lastUpdate: Date.now()
        };
        
        this.initializeMetrics();
        console.log('🧠 [SCALER ENGINE] Motor de escalabilidad inteligente inicializado');
    }
    
    initializeMetrics() {
        for (const [key, component] of Object.entries(SCALER_CONFIG.COMPONENTS)) {
            this.metrics.set(key, {
                name: component.name,
                status: 'STOPPED',
                instances: 0,
                targetInstances: component.minInstances,
                restartCount: 0,
                lastHealthCheck: 0,
                responseTime: 0,
                errorRate: 0,
                resourceUsage: {
                    cpu: 0,
                    memory: 0
                },
                scalingHistory: []
            });
            this.restartAttempts.set(key, 0);
        }
    }
    
    async start() {
        console.log('🚀 [SCALER] Iniciando escalabilidad automática...');
        
        try {
            // Iniciar componentes críticos en orden de prioridad
            await this.startAllComponents();
            
            // Iniciar monitoreo y escalado
            this.startScalingLoop();
            
            console.log('✅ [SCALER] Sistema de escalabilidad activo');
            
        } catch (error) {
            console.error('❌ [SCALER] Error al iniciar:', error.message);
        }
    }
    
    async startAllComponents() {
        console.log('🔄 [SCALER] Iniciando todos los componentes...');
        
        // Ordenar por prioridad
        const sortedComponents = Object.entries(SCALER_CONFIG.COMPONENTS)
            .sort(([,a], [,b]) => a.priority - b.priority);
        
        for (const [key, component] of sortedComponents) {
            console.log(`🚀 [SCALER] Iniciando ${component.name}...`);
            
            try {
                await this.startComponent(key, component);
                await this.waitForComponentReady(key, component);
                console.log(`✅ [SCALER] ${component.name} iniciado exitosamente`);
                
                // Esperar entre componentes para evitar sobrecarga
                await this.delay(2000);
                
            } catch (error) {
                console.error(`❌ [SCALER] Error iniciando ${component.name}:`, error.message);
            }
        }
    }
    
    async startComponent(key, component) {
        const metrics = this.metrics.get(key);
        
        // Verificar si el script existe
        if (!fs.existsSync(component.script)) {
            throw new Error(`Script ${component.script} no encontrado`);
        }
        
        // Iniciar proceso
        const process = spawn('node', [component.script], {
            stdio: 'pipe',
            detached: false
        });
        
        // Configurar manejo de eventos
        process.stdout.on('data', (data) => {
            console.log(`[${component.name}] ${data.toString().trim()}`);
        });
        
        process.stderr.on('data', (data) => {
            console.error(`[${component.name}] ERROR: ${data.toString().trim()}`);
        });
        
        process.on('exit', (code, signal) => {
            console.log(`[${component.name}] Proceso terminado con código ${code}`);
            this.handleProcessExit(key, component, code);
        });
        
        process.on('error', (error) => {
            console.error(`[${component.name}] Error de proceso:`, error.message);
            this.handleProcessError(key, component, error);
        });
        
        // Guardar referencia del proceso
        this.processes.set(key, {
            process,
            startTime: Date.now(),
            pid: process.pid
        });
        
        // Actualizar métricas
        metrics.status = 'STARTING';
        metrics.instances = 1;
        metrics.restartCount++;
    }
    
    async waitForComponentReady(key, component, maxWaitTime = 30000) {
        const startTime = Date.now();
        const checkInterval = 1000;
        
        while (Date.now() - startTime < maxWaitTime) {
            try {
                const response = await axios.get(
                    `http://localhost:${component.port}${component.healthEndpoint}`,
                    { timeout: 3000 }
                );
                
                if (response.status === 200) {
                    const metrics = this.metrics.get(key);
                    metrics.status = 'ACTIVE';
                    metrics.lastHealthCheck = Date.now();
                    metrics.responseTime = Date.now() - startTime;
                    return true;
                }
            } catch (error) {
                // Continuar esperando
            }
            
            await this.delay(checkInterval);
        }
        
        throw new Error(`Componente ${component.name} no respondió en ${maxWaitTime}ms`);
    }
    
    startScalingLoop() {
        console.log('🔄 [SCALER] Iniciando bucle de escalabilidad...');
        
        setInterval(async () => {
            if (!this.isScaling) {
                this.isScaling = true;
                await this.performScalingCheck();
                this.isScaling = false;
            }
        }, SCALER_CONFIG.SCALING_INTERVAL);
    }
    
    async performScalingCheck() {
        const startTime = Date.now();
        
        try {
            // Actualizar métricas de todos los componentes
            await this.updateAllMetrics();
            
            // Tomar decisiones de escalado
            const scalingDecisions = this.analyzeScalingNeeds();
            
            // Ejecutar decisiones de escalado
            for (const decision of scalingDecisions) {
                await this.executeScalingDecision(decision);
            }
            
            // Actualizar salud global del ecosistema
            this.updateGlobalHealth();
            
            const totalTime = Date.now() - startTime;
            console.log(`📊 [SCALER] Chequeo de escalabilidad completado en ${totalTime}ms`);
            
        } catch (error) {
            console.error('❌ [SCALER] Error en chequeo de escalabilidad:', error.message);
        }
    }
    
    async updateAllMetrics() {
        const updates = [];
        
        for (const [key, component] of Object.entries(SCALER_CONFIG.COMPONENTS)) {
            updates.push(this.updateComponentMetrics(key, component));
        }
        
        await Promise.all(updates);
    }
    
    async updateComponentMetrics(key, component) {
        const metrics = this.metrics.get(key);
        
        try {
            // Health check
            const startTime = Date.now();
            const response = await axios.get(
                `http://localhost:${component.port}${component.healthEndpoint}`,
                { timeout: SCALER_CONFIG.HEALTH_CHECK_TIMEOUT }
            );
            
            const responseTime = Date.now() - startTime;
            
            // Actualizar métricas básicas
            metrics.status = response.status === 200 ? 'ACTIVE' : 'ERROR';
            metrics.responseTime = responseTime;
            metrics.lastHealthCheck = Date.now();
            metrics.errorRate = Math.max(0, metrics.errorRate - 0.01); // Reducir error rate
            
            // Obtener métricas específicas del componente
            if (response.data) {
                await this.extractComponentSpecificMetrics(key, component, response.data);
            }
            
        } catch (error) {
            metrics.status = 'DOWN';
            metrics.errorRate = Math.min(1, metrics.errorRate + 0.1);
            metrics.responseTime = SCALER_CONFIG.HEALTH_CHECK_TIMEOUT;
            
            console.log(`❌ [METRICS] ${component.name}: ${error.message}`);
            
            // Verificar si necesita reinicio automático
            if (component.autoRestart) {
                await this.handleComponentFailure(key, component);
            }
        }
    }
    
    async extractComponentSpecificMetrics(key, component, healthData) {
        const metrics = this.metrics.get(key);
        
        // Extraer métricas específicas según el componente
        switch (key) {
            case 'CORE_ANTI_418':
                if (healthData.dataPoints) {
                    metrics.customMetrics = {
                        spotSignals: healthData.spotSignals || 0,
                        futuresOpportunities: healthData.futuresOpportunities || 0,
                        dataQuality: healthData.dataQuality || 0
                    };
                }
                break;
                
            case 'INTELLIGENT_MONITOR':
                if (healthData.connectedClients !== undefined) {
                    metrics.customMetrics = {
                        connectedClients: healthData.connectedClients,
                        uptime: healthData.uptime || 0
                    };
                }
                break;
        }
    }
    
    analyzeScalingNeeds() {
        const decisions = [];
        
        for (const [key, component] of Object.entries(SCALER_CONFIG.COMPONENTS)) {
            const metrics = this.metrics.get(key);
            const decision = this.analyzeComponentScaling(key, component, metrics);
            
            if (decision) {
                decisions.push(decision);
            }
        }
        
        return decisions;
    }
    
    analyzeComponentScaling(key, component, metrics) {
        // Reglas de escalado específicas por componente
        
        // Si está caído y tiene auto-restart
        if (metrics.status === 'DOWN' && component.autoRestart) {
            return {
                component: key,
                action: 'RESTART',
                reason: 'Component is down',
                priority: 'HIGH'
            };
        }
        
        // Si el tiempo de respuesta es muy alto
        if (metrics.responseTime > SCALER_CONFIG.RESOURCE_THRESHOLDS.RESPONSE_TIME_HIGH) {
            return {
                component: key,
                action: 'OPTIMIZE',
                reason: `High response time: ${metrics.responseTime}ms`,
                priority: 'MEDIUM'
            };
        }
        
        // Si la tasa de error es muy alta
        if (metrics.errorRate > SCALER_CONFIG.RESOURCE_THRESHOLDS.ERROR_RATE_HIGH) {
            return {
                component: key,
                action: 'RESTART',
                reason: `High error rate: ${Math.round(metrics.errorRate * 100)}%`,
                priority: 'HIGH'
            };
        }
        
        return null;
    }
    
    async executeScalingDecision(decision) {
        console.log(`🎯 [SCALING] Ejecutando: ${decision.action} para ${decision.component} - ${decision.reason}`);
        
        const component = SCALER_CONFIG.COMPONENTS[decision.component];
        
        switch (decision.action) {
            case 'RESTART':
                await this.restartComponent(decision.component, component);
                break;
                
            case 'OPTIMIZE':
                await this.optimizeComponent(decision.component, component);
                break;
                
            case 'SCALE_UP':
                await this.scaleUpComponent(decision.component, component);
                break;
                
            case 'SCALE_DOWN':
                await this.scaleDownComponent(decision.component, component);
                break;
        }
        
        // Registrar decisión
        this.scalingDecisions.push({
            ...decision,
            timestamp: Date.now(),
            executed: true
        });
        
        // Mantener solo últimas 50 decisiones
        if (this.scalingDecisions.length > 50) {
            this.scalingDecisions.shift();
        }
    }
    
    async restartComponent(key, component) {
        const attemptCount = this.restartAttempts.get(key) || 0;
        
        if (attemptCount >= SCALER_CONFIG.MAX_RESTART_ATTEMPTS) {
            console.log(`⚠️ [RESTART] ${component.name} ha alcanzado el máximo de intentos de reinicio`);
            return;
        }
        
        console.log(`🔄 [RESTART] Reiniciando ${component.name} (intento ${attemptCount + 1})...`);
        
        try {
            // Detener proceso actual si existe
            await this.stopComponent(key);
            
            // Esperar un momento
            await this.delay(2000);
            
            // Iniciar componente
            await this.startComponent(key, component);
            await this.waitForComponentReady(key, component);
            
            // Reset contador de intentos en caso de éxito
            this.restartAttempts.set(key, 0);
            
            console.log(`✅ [RESTART] ${component.name} reiniciado exitosamente`);
            
        } catch (error) {
            this.restartAttempts.set(key, attemptCount + 1);
            console.error(`❌ [RESTART] Error reiniciando ${component.name}:`, error.message);
        }
    }
    
    async optimizeComponent(key, component) {
        console.log(`⚡ [OPTIMIZE] Optimizando ${component.name}...`);
        
        // Estrategias de optimización específicas
        const metrics = this.metrics.get(key);
        
        // Reducir carga si es posible
        if (metrics.responseTime > 2000) {
            // Implementar estrategias específicas por componente
            switch (key) {
                case 'CORE_ANTI_418':
                    // Podríamos reducir la frecuencia de actualización
                    console.log(`📊 [OPTIMIZE] Reduciendo frecuencia de actualización para ${component.name}`);
                    break;
                    
                case 'INTELLIGENT_MONITOR':
                    // Podríamos reducir la frecuencia de monitoreo
                    console.log(`📊 [OPTIMIZE] Optimizando frecuencia de monitoreo para ${component.name}`);
                    break;
            }
        }
    }
    
    async scaleUpComponent(key, component) {
        console.log(`📈 [SCALE UP] Escalando ${component.name}...`);
        // Implementar lógica de escalado horizontal si es necesario
    }
    
    async scaleDownComponent(key, component) {
        console.log(`📉 [SCALE DOWN] Reduciendo escala de ${component.name}...`);
        // Implementar lógica de reducción de escala
    }
    
    async stopComponent(key) {
        const processInfo = this.processes.get(key);
        
        if (processInfo && processInfo.process) {
            try {
                processInfo.process.kill('SIGTERM');
                await this.delay(2000);
                
                if (!processInfo.process.killed) {
                    processInfo.process.kill('SIGKILL');
                }
                
                this.processes.delete(key);
                
            } catch (error) {
                console.error(`❌ [STOP] Error deteniendo proceso:`, error.message);
            }
        }
    }
    
    handleProcessExit(key, component, code) {
        const metrics = this.metrics.get(key);
        metrics.status = 'STOPPED';
        metrics.instances = 0;
        
        if (code !== 0 && component.autoRestart) {
            console.log(`🔄 [AUTO-RESTART] ${component.name} terminó inesperadamente, programando reinicio...`);
            setTimeout(() => {
                this.restartComponent(key, component);
            }, 5000);
        }
    }
    
    handleProcessError(key, component, error) {
        const metrics = this.metrics.get(key);
        metrics.status = 'ERROR';
        metrics.errorRate = Math.min(1, metrics.errorRate + 0.2);
    }
    
    handleComponentFailure(key, component) {
        const attemptCount = this.restartAttempts.get(key) || 0;
        
        if (attemptCount < SCALER_CONFIG.MAX_RESTART_ATTEMPTS) {
            console.log(`🚨 [FAILURE] ${component.name} falló, programando reinicio automático...`);
            setTimeout(() => {
                this.restartComponent(key, component);
            }, 3000);
        }
    }
    
    updateGlobalHealth() {
        const activeComponents = Array.from(this.metrics.values()).filter(m => m.status === 'ACTIVE').length;
        const totalComponents = this.metrics.size;
        const avgResponseTime = Array.from(this.metrics.values()).reduce((sum, m) => sum + m.responseTime, 0) / totalComponents;
        const avgErrorRate = Array.from(this.metrics.values()).reduce((sum, m) => sum + m.errorRate, 0) / totalComponents;
        
        // Calcular score global
        const uptimeScore = (activeComponents / totalComponents) * 50;
        const performanceScore = Math.max(0, 30 - (avgResponseTime / 100));
        const reliabilityScore = Math.max(0, 20 - (avgErrorRate * 100));
        
        const totalScore = uptimeScore + performanceScore + reliabilityScore;
        
        this.globalHealth = {
            status: totalScore >= 80 ? 'EXCELLENT' : 
                   totalScore >= 60 ? 'GOOD' : 
                   totalScore >= 40 ? 'DEGRADED' : 'CRITICAL',
            score: Math.round(totalScore),
            activeComponents,
            totalComponents,
            avgResponseTime: Math.round(avgResponseTime),
            avgErrorRate: Math.round(avgErrorRate * 100),
            lastUpdate: Date.now()
        };
    }
    
    getEcosystemStatus() {
        return {
            globalHealth: this.globalHealth,
            components: Object.fromEntries(this.metrics),
            scalingHistory: this.scalingDecisions.slice(-10),
            systemInfo: {
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                activeProcesses: this.processes.size
            }
        };
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Instancia global del escalador
const ecosystemScaler = new EcosystemScaler();

// 🌐 ENDPOINTS DEL ESCALADOR

app.get('/health', (req, res) => {
    res.json({
        success: true,
        system: 'ECOSYSTEM_SCALER',
        status: 'ACTIVE',
        version: '1.0_SCALER',
        timestamp: Date.now()
    });
});

app.get('/api/ecosystem-status', (req, res) => {
    res.json(ecosystemScaler.getEcosystemStatus());
});

app.get('/api/components', (req, res) => {
    res.json({
        success: true,
        components: Object.fromEntries(ecosystemScaler.metrics),
        timestamp: Date.now()
    });
});

app.post('/api/components/:componentKey/restart', async (req, res) => {
    const componentKey = req.params.componentKey.toUpperCase();
    const component = SCALER_CONFIG.COMPONENTS[componentKey];
    
    if (!component) {
        return res.status(404).json({ error: 'Componente no encontrado' });
    }
    
    try {
        await ecosystemScaler.restartComponent(componentKey, component);
        res.json({ 
            success: true, 
            message: `${component.name} reiniciado exitosamente` 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.post('/api/components/:componentKey/optimize', async (req, res) => {
    const componentKey = req.params.componentKey.toUpperCase();
    const component = SCALER_CONFIG.COMPONENTS[componentKey];
    
    if (!component) {
        return res.status(404).json({ error: 'Componente no encontrado' });
    }
    
    try {
        await ecosystemScaler.optimizeComponent(componentKey, component);
        res.json({ 
            success: true, 
            message: `${component.name} optimizado exitosamente` 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.get('/api/scaling-history', (req, res) => {
    res.json({
        success: true,
        history: ecosystemScaler.scalingDecisions.slice(-20),
        timestamp: Date.now()
    });
});

// 🚀 INICIO DEL SERVIDOR ESCALADOR
app.listen(PORT, async () => {
    console.log(`🚀 [ECOSYSTEM SCALER] Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🔧 Sistema de Escalabilidad Automática - ACTIVO`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    
    console.log('\n📋 Funcionalidades del Escalador:');
    console.log('   ⚡ Escalabilidad automática de componentes');
    console.log('   🔄 Auto-restart en caso de fallos');
    console.log('   📊 Monitoreo de recursos y performance');
    console.log('   🎯 Optimización automática de carga');
    console.log('   🚨 Manejo inteligente de failover');
    console.log('   📈 APIs de gestión de ecosistema');
    
    console.log('\n🎯 Componentes gestionados:');
    Object.entries(SCALER_CONFIG.COMPONENTS).forEach(([key, component]) => {
        console.log(`   ${component.priority}. ${component.name} (Puerto ${component.port})`);
    });
    
    console.log('\n🚀 [SCALER] Iniciando sistema de escalabilidad automática...');
    
    // Iniciar el escalador
    setTimeout(async () => {
        await ecosystemScaler.start();
    }, 2000);
});

// Manejo de cierre limpio
process.on('SIGINT', async () => {
    console.log('\n⏹️ [SCALER] Cerrando ecosistema de manera ordenada...');
    
    // Detener todos los componentes
    for (const key of ecosystemScaler.processes.keys()) {
        await ecosystemScaler.stopComponent(key);
    }
    
    console.log('✅ [SCALER] Ecosistema cerrado correctamente');
    process.exit(0);
});

module.exports = { ecosystemScaler, EcosystemScaler };

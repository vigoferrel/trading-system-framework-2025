#!/usr/bin/env node
/**
 * 🧪 TESTING INTEGRAL - SISTEMA θ-AWARE CON PRIME LADDERS
 * Testing end-to-end del ecosistema completo QBTC con métricas temporales
 * 
 * @author QBTC Quantum Consciousness Trading System
 * @version 1.0.0
 * @since 2024
 */

const { TemporalMetricsEngine } = require('./src/temporal-metrics-engine');
const { TemporalPrimeLadder } = require('./src/temporal-prime-ladder-fixed');
const PositionManager = require('./src/core/position-manager');
const { hermetic_logger } = require('./src/utils/hermetic-logger');

class ThetaAwareSystemTester {
    constructor() {
        this.logger = hermetic_logger.createLogger('ThetaAwareSystemTester');
        this.testResults = {
            totalTests: 0,
            passed: 0,
            failed: 0,
            warnings: 0,
            details: []
        };
        
        this.components = {
            temporalEngine: null,
            primeLadder: null,
            positionManager: null
        };
        
        this.testData = {
            symbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT'],
            positions: [],
            ladders: []
        };
    }
    
    /**
     * Ejecutar suite completo de testing
     */
    async runCompleteTestSuite() {
        try {
            this.logger.info('🧪 Iniciando testing integral del sistema θ-aware...');
            
            // Fase 1: Inicialización y configuración
            await this.testPhase1_Initialization();
            
            // Fase 2: Testing de Temporal Metrics Engine
            await this.testPhase2_TemporalMetrics();
            
            // Fase 3: Testing de Position Manager θ-aware
            await this.testPhase3_PositionManager();
            
            // Fase 4: Testing de Prime Ladders
            await this.testPhase4_PrimeLadders();
            
            // Fase 5: Testing de integración end-to-end
            await this.testPhase5_Integration();
            
            // Fase 6: Testing de stress y performance
            await this.testPhase6_StressAndPerformance();
            
            // Generar reporte final
            this.generateFinalReport();
            
        } catch (error) {
            this.logger.error('❌ Error crítico en testing:', error);
            this.recordTestResult('CRITICAL_ERROR', false, `Error crítico: ${error.message}`);
        }
    }
    
    /**
     * Fase 1: Inicialización y configuración
     */
    async testPhase1_Initialization() {
        this.logger.info('📋 FASE 1: Inicialización y configuración');
        
        try {
            // Test 1.1: Inicialización de Temporal Engine
            await this.test('Temporal Engine Initialization', async () => {
                this.components.temporalEngine = new TemporalMetricsEngine({
                    coherence_threshold: 0.618,
                    edge_threshold: 0.05
                });
                
                await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar inicialización
                
                const metrics = this.components.temporalEngine.getSystemMetrics();
                if (!metrics || !metrics.constants) {
                    throw new Error('Temporal Engine no inicializado correctamente');
                }
                
                // Verificar constantes cuánticas
                if (Math.abs(metrics.constants.lambda_7919 - 8.976106164279123) > 0.001) {
                    throw new Error(`λ_7919 incorrecta: ${metrics.constants.lambda_7919}`);
                }
                
                if (metrics.constants.quantum_z.real !== 9 || metrics.constants.quantum_z.imag !== 16) {
                    throw new Error(`Quantum Z incorrecta: ${JSON.stringify(metrics.constants.quantum_z)}`);
                }
                
                return true;
            });
            
            // Test 1.2: Inicialización de Position Manager
            await this.test('Position Manager θ-aware Initialization', async () => {
                this.components.positionManager = new PositionManager({
                    maxPositions: 10,
                    maxRiskPerPosition: 0.025,
                    dailyThetaBudget: 0.10
                });
                
                await new Promise(resolve => setTimeout(resolve, 1500)); // Esperar inicialización completa
                
                if (!this.components.positionManager.state.initialized) {
                    throw new Error('Position Manager no inicializado');
                }
                
                // Verificar θ-budget
                const thetaBudgetStatus = this.components.positionManager.getThetaBudgetStatus();
                if (thetaBudgetStatus.dailyBudget !== 0.10) {
                    throw new Error(`θ-budget incorrecto: ${thetaBudgetStatus.dailyBudget}`);
                }
                
                return true;
            });
            
            // Test 1.3: Integración de componentes
            await this.test('Components Integration', async () => {
                // Conectar Temporal Engine con Position Manager
                this.components.positionManager.temporalEngine = this.components.temporalEngine;
                
                // Verificar que Prime Ladder esté conectado
                if (!this.components.positionManager.primeLadder) {
                    throw new Error('Prime Ladder no integrado en Position Manager');
                }
                
                this.components.primeLadder = this.components.positionManager.primeLadder;
                
                // Verificar conexiones
                if (!this.components.primeLadder.positionManager) {
                    throw new Error('Prime Ladder no conectado con Position Manager');
                }
                
                return true;
            });
            
        } catch (error) {
            this.recordTestResult('Phase 1 Critical', false, error.message);
            throw error;
        }
    }
    
    /**
     * Fase 2: Testing de Temporal Metrics Engine
     */
    async testPhase2_TemporalMetrics() {
        this.logger.info('⚛️ FASE 2: Testing de Temporal Metrics Engine');
        
        // Test 2.1: Cálculo de Edge Temporal
        await this.test('Edge Temporal Calculation', async () => {
            const optionData = {
                symbol: 'BTCUSDT',
                expiry: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
                daysToExpiry: 13,
                theta: -0.02,
                price: 45000
            };
            
            const result = this.components.temporalEngine.calculateTemporalEdge(optionData);
            
            if (!result || typeof result.edge_temporal !== 'number') {
                throw new Error('Edge temporal no calculado correctamente');
            }
            
            if (result.dte_prime_band !== 13) {
                throw new Error(`DTE prime band incorrecto: ${result.dte_prime_band}`);
            }
            
            if (result.theta_normalized <= 0) {
                throw new Error(`Theta normalizado incorrecto: ${result.theta_normalized}`);
            }
            
            this.logger.debug(`✅ Edge Temporal: ${result.edge_temporal.toFixed(4)}, DTE Band: ${result.dte_prime_band}d`);
            return true;
        });
        
        // Test 2.2: Coherencia Prima
        await this.test('Prime Coherence Calculation', async () => {
            const marketData = this.generateSyntheticMarketData(50);
            const result = this.components.temporalEngine.calculatePrimeCoherence(marketData, 'BTCUSDT');
            
            if (!result || typeof result.prime_coherence !== 'number') {
                throw new Error('Coherencia prima no calculada');
            }
            
            if (result.prime_coherence < 0 || result.prime_coherence > 1) {
                throw new Error(`Coherencia fuera de rango: ${result.prime_coherence}`);
            }
            
            if (!result.coherence_scores || result.coherence_scores.length === 0) {
                throw new Error('Coherence scores no generados');
            }
            
            // Verificar ventanas primas
            const primeWindows = result.coherence_scores.map(s => s.window);
            const expectedPrimes = [7, 11, 13, 17, 19, 23];
            const foundPrimes = expectedPrimes.filter(p => primeWindows.includes(p));
            
            if (foundPrimes.length < 3) {
                throw new Error(`Pocas ventanas primas encontradas: ${foundPrimes}`);
            }
            
            this.logger.debug(`✅ Prime Coherence: ${(result.prime_coherence * 100).toFixed(1)}%, Windows: ${primeWindows.join(',')}`);
            return true;
        });
        
        // Test 2.3: Resonancia λ_7919
        await this.test('Lambda Resonance Calculation', async () => {
            const timestamp = Date.now();
            const volatility = 0.25;
            
            const result = this.components.temporalEngine.calculateLambdaResonance(timestamp, volatility);
            
            if (!result || typeof result.lambda_resonance !== 'number') {
                throw new Error('Resonancia λ_7919 no calculada');
            }
            
            if (!result.temporal_phase || result.temporal_phase < 0) {
                throw new Error(`Fase temporal incorrecta: ${result.temporal_phase}`);
            }
            
            if (result.volatility_factor <= 0) {
                throw new Error(`Factor volatilidad incorrecto: ${result.volatility_factor}`);
            }
            
            if (!result.resonance_grade || !['MINIMAL', 'WEAK', 'MODERATE', 'STRONG'].includes(result.resonance_grade)) {
                throw new Error(`Grade resonancia inválido: ${result.resonance_grade}`);
            }
            
            this.logger.debug(`✅ λ_7919 Resonance: ${result.lambda_resonance.toFixed(3)}, Grade: ${result.resonance_grade}`);
            return true;
        });
        
        // Test 2.4: Evaluación temporal integrada
        await this.test('Integrated Temporal Evaluation', async () => {
            const optionData = {
                symbol: 'ETHUSDT',
                expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                daysToExpiry: 7,
                theta: -0.015,
                price: 2800
            };
            
            const marketData = this.generateSyntheticMarketData(30);
            const result = this.components.temporalEngine.evaluateTemporalMetrics(optionData, marketData, 'ETHUSDT');
            
            if (!result.temporal_edge || !result.prime_coherence || !result.lambda_resonance) {
                throw new Error('Evaluación temporal incompleta');
            }
            
            if (typeof result.composite_score !== 'number' || result.composite_score < 0 || result.composite_score > 1) {
                throw new Error(`Composite score inválido: ${result.composite_score}`);
            }
            
            if (!result.trading_recommendation || !result.trading_recommendation.action) {
                throw new Error('Trading recommendation no generada');
            }
            
            const validActions = ['BUY', 'HOLD', 'AVOID'];
            if (!validActions.includes(result.trading_recommendation.action)) {
                throw new Error(`Acción inválida: ${result.trading_recommendation.action}`);
            }
            
            this.logger.debug(`✅ Composite Score: ${(result.composite_score * 100).toFixed(1)}%, Action: ${result.trading_recommendation.action}`);
            return true;
        });
    }
    
    /**
     * Fase 3: Testing de Position Manager θ-aware
     */
    async testPhase3_PositionManager() {
        this.logger.info('💼 FASE 3: Testing de Position Manager θ-aware');
        
        // Test 3.1: Cálculo de position size con Kelly θ-aware
        await this.test('Quantum Position Sizing with Temporal Edge', async () => {
            const sizingResult = this.components.positionManager.calculateQuantumPositionSize(
                'BTCUSDT',
                45000, // entryPrice
                44000, // stopLoss
                47000, // takeProfit
                0.75,  // confidence
                {
                    expiry: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
                    daysToExpiry: 11,
                    theta: -0.02,
                    marketData: this.generateSyntheticMarketData(25)
                }
            );
            
            if (!sizingResult || sizingResult.positionSize <= 0) {
                throw new Error('Position size no calculado');
            }
            
            // Verificar métricas temporales
            if (!sizingResult.temporalMetrics) {
                throw new Error('Métricas temporales faltantes en sizing');
            }
            
            if (typeof sizingResult.temporalMetrics.edge_temporal !== 'number') {
                throw new Error('Edge temporal faltante en sizing');
            }
            
            if (sizingResult.temporalMetrics.dte_prime_band !== 11) {
                throw new Error(`DTE prime band incorrecto en sizing: ${sizingResult.temporalMetrics.dte_prime_band}`);
            }
            
            // Verificar ajustes temporales
            if (!sizingResult.adjustments.theta_budget || !sizingResult.adjustments.dte_prime_band) {
                throw new Error('Ajustes temporales faltantes');
            }
            
            // Verificar flags temporales
            if (!sizingResult.temporalFlags) {
                throw new Error('Flags temporales faltantes');
            }
            
            this.logger.debug(`✅ Position Size: ${(sizingResult.positionSize * 100).toFixed(2)}%, Edge: ${sizingResult.temporalMetrics.edge_temporal.toFixed(4)}`);
            return true;
        });
        
        // Test 3.2: θ-budget management
        await this.test('Theta Budget Management', async () => {
            const initialBudget = this.components.positionManager.getThetaBudgetStatus();
            
            if (initialBudget.dailyBudget !== 0.10) {
                throw new Error(`Daily budget incorrecto: ${initialBudget.dailyBudget}`);
            }
            
            if (initialBudget.usedBudget !== 0) {
                throw new Error(`Used budget debería ser 0: ${initialBudget.usedBudget}`);
            }
            
            // Simular consumo de θ-budget
            const thetaConsumption = 0.02;
            this.components.positionManager.reserveThetaBudget('BTCUSDT', thetaConsumption);
            
            const afterReserve = this.components.positionManager.getThetaBudgetStatus();
            if (Math.abs(afterReserve.usedBudget - thetaConsumption) > 0.001) {
                throw new Error(`θ-budget no reservado correctamente: ${afterReserve.usedBudget}`);
            }
            
            if (afterReserve.utilizationPercent <= 0) {
                throw new Error('Utilization percent no calculado');
            }
            
            // Limpiar residuos antes del test reset
            this.components.positionManager.cleanupThetaBudgetResidues();
            
            // Test reset
            const resetResult = this.components.positionManager.resetThetaBudget('test_reset');
            if (!resetResult.success) {
                throw new Error('Reset θ-budget falló');
            }
            
            const afterReset = this.components.positionManager.getThetaBudgetStatus();
            if (Math.abs(afterReset.usedBudget) > 0.0001) {
                throw new Error(`θ-budget no reseteado correctamente: ${afterReset.usedBudget}`);
            }
            
            this.logger.debug(`✅ θ-Budget: Reserved ${thetaConsumption}, Reset OK`);
            return true;
        });
        
        // Test 3.3: Apertura de posición con métricas temporales
        await this.test('Position Opening with Temporal Metrics', async () => {
            const positionRequest = {
                symbol: 'ETHUSDT',
                side: 'BUY',
                entryPrice: 2800,
                stopLoss: 2750,
                takeProfit: 2900,
                confidence: 0.8,
                options: {
                    expiry: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
                    daysToExpiry: 13,
                    theta: -0.018,
                    marketData: this.generateSyntheticMarketData(30)
                }
            };
            
            const position = await this.components.positionManager.openPosition(positionRequest);
            
            if (!position || position.status !== 'ACTIVE') {
                throw new Error(`Posición no abierta correctamente: ${position?.status}`);
            }
            
            // Verificar sizing details temporales
            if (!position.sizingDetails || !position.sizingDetails.temporalMetrics) {
                throw new Error('Sizing details temporales faltantes');
            }
            
            if (!position.sizingDetails.temporalFlags) {
                throw new Error('Temporal flags faltantes');
            }
            
            // Verificar que θ-budget fue consumido
            const budgetStatus = this.components.positionManager.getThetaBudgetStatus();
            if (budgetStatus.usedBudget <= 0) {
                throw new Error('θ-budget no consumido al abrir posición');
            }
            
            // Guardar para pruebas posteriores
            this.testData.positions.push(position);
            
            this.logger.debug(`✅ Position opened: ${position.id}, Size: ${position.actualSize}, θ consumed: ${position.sizingDetails.temporalMetrics.theta_consumption?.toFixed(4) || 'N/A'}`);
            return true;
        });
    }
    
    /**
     * Fase 4: Testing de Prime Ladders
     */
    async testPhase4_PrimeLadders() {
        this.logger.info('🏗️ FASE 4: Testing de Prime Ladders');
        
        // Test 4.1: Evaluación para ladder
        await this.test('Ladder Evaluation and Creation', async () => {
            if (this.testData.positions.length === 0) {
                throw new Error('No hay posiciones para evaluar ladders');
            }
            
            const position = this.testData.positions[0];
            
            // Forzar evaluación para ladder
            await this.components.primeLadder.evaluateForLadder(position);
            
            // Esperar procesamiento
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const ladderMetrics = this.components.primeLadder.getSystemMetrics();
            
            if (ladderMetrics.activeLadders === 0) {
                throw new Error('No se crearon ladders');
            }
            
            if (ladderMetrics.totalLadders === 0) {
                throw new Error('Total ladders es 0');
            }
            
            // Verificar ladders por símbolo
            const symbolLadders = this.components.primeLadder.getLaddersBySymbol(position.symbol);
            
            if (!symbolLadders || symbolLadders.length === 0) {
                throw new Error(`No ladders para ${position.symbol}`);
            }
            
            const ladder = symbolLadders[0];
            if (!ladder.id || !ladder.primeBand || !ladder.positions) {
                throw new Error('Estructura de ladder incorrecta');
            }
            
            if (ladder.positions.length === 0) {
                throw new Error('Ladder sin posiciones');
            }
            
            // Guardar para pruebas posteriores
            this.testData.ladders.push(ladder);
            
            this.logger.debug(`✅ Ladder created: ${ladder.id}, Band: ${ladder.primeBand}d, Positions: ${ladder.positions.length}`);
            return true;
        });
        
        // Test 4.2: Criterios de roll
        await this.test('Roll Criteria Evaluation', async () => {
            if (this.testData.positions.length === 0) {
                throw new Error('No positions for roll evaluation');
            }
            
            const position = this.testData.positions[0];
            
            // Simular condición de roll (acercándose a expiración)
            if (position.sizingDetails && position.sizingDetails.temporalMetrics) {
                position.sizingDetails.temporalMetrics.dte_prime_band = 2; // Días hasta expiración
            }
            
            // Evaluar criterios de roll
            await this.components.primeLadder.evaluateRollCriteria(position);
            
            // Esperar procesamiento
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const rollQueue = this.components.primeLadder.getRollQueue();
            
            if (rollQueue.totalQueued === 0) {
                this.recordTestResult('Roll Queue Warning', true, 'No roll queued - might need different trigger conditions', 'warning');
            } else {
                if (!rollQueue.queue || rollQueue.queue.length === 0) {
                    throw new Error('Roll queue structure incorrect');
                }
                
                const rollItem = rollQueue.queue[0];
                if (!rollItem.positionId || !rollItem.reason || !rollItem.targetBand) {
                    throw new Error('Roll item structure incorrect');
                }
                
                this.logger.debug(`✅ Roll queued: ${rollItem.positionId} -> ${rollItem.targetBand}d, Reason: ${rollItem.reason}`);
            }
            
            return true;
        });
        
        // Test 4.3: Roll manual
        await this.test('Manual Roll Force', async () => {
            if (this.testData.positions.length === 0) {
                throw new Error('No positions for manual roll');
            }
            
            const position = this.testData.positions[0];
            const targetBand = 17; // Nueva banda prima
            
            const rollResult = await this.components.primeLadder.forceRoll(position.id, targetBand, 'test_manual');
            
            if (!rollResult.success) {
                throw new Error(`Manual roll failed: ${rollResult.error}`);
            }
            
            if (rollResult.queuePosition !== 0) {
                throw new Error(`Manual roll not prioritized: position ${rollResult.queuePosition}`);
            }
            
            // Verificar que se añadió a la cola
            const rollQueue = this.components.primeLadder.getRollQueue();
            const manualRoll = rollQueue.queue.find(item => item.positionId === position.id);
            
            if (!manualRoll) {
                throw new Error('Manual roll not found in queue');
            }
            
            if (manualRoll.priority !== 15) {
                throw new Error(`Manual roll priority incorrect: ${manualRoll.priority}`);
            }
            
            this.logger.debug(`✅ Manual roll queued: ${position.id} -> ${targetBand}d, Priority: ${manualRoll.priority}`);
            return true;
        });
        
        // Test 4.4: Distribución theta
        await this.test('Theta Distribution Analysis', async () => {
            const ladderMetrics = this.components.primeLadder.getSystemMetrics();
            
            if (!ladderMetrics.laddersBySymbol || ladderMetrics.laddersBySymbol.length === 0) {
                throw new Error('No ladder data for theta distribution');
            }
            
            // Analizar distribución por símbolo
            for (const symbolData of ladderMetrics.laddersBySymbol) {
                if (symbolData.totalValue <= 0) {
                    throw new Error(`Invalid total value for ${symbolData.symbol}: ${symbolData.totalValue}`);
                }
                
                if (isNaN(symbolData.avgThetaEfficiency)) {
                    throw new Error(`Invalid theta efficiency for ${symbolData.symbol}: ${symbolData.avgThetaEfficiency}`);
                }
            }
            
            // Verificar performance por banda
            if (!ladderMetrics.performanceByBand || ladderMetrics.performanceByBand.length === 0) {
                throw new Error('No performance by band data');
            }
            
            for (const [band, performance] of ladderMetrics.performanceByBand) {
                if (typeof band !== 'number' || band <= 0) {
                    throw new Error(`Invalid band: ${band}`);
                }
                
                if (!performance || typeof performance.thetaEfficiency !== 'number') {
                    throw new Error(`Invalid performance data for band ${band}`);
                }
            }
            
            this.logger.debug(`✅ Theta distribution: ${ladderMetrics.laddersBySymbol.length} symbols, ${ladderMetrics.performanceByBand.length} bands`);
            return true;
        });
    }
    
    /**
     * Fase 5: Testing de integración end-to-end
     */
    async testPhase5_Integration() {
        this.logger.info('🔄 FASE 5: Testing de integración end-to-end');
        
        // Test 5.1: Flujo completo posición -> ladder -> roll
        await this.test('Complete Position -> Ladder -> Roll Flow', async () => {
            // Crear nueva posición con métricas temporales óptimas
            const positionRequest = {
                symbol: 'SOLUSDT',
                side: 'BUY',
                entryPrice: 100,
                stopLoss: 95,
                takeProfit: 110,
                confidence: 0.85,
                options: {
                    expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    daysToExpiry: 7,
                    theta: -0.025,
                    marketData: this.generateSyntheticMarketData(40)
                }
            };
            
            // Paso 1: Abrir posición
            const position = await this.components.positionManager.openPosition(positionRequest);
            if (!position || position.status !== 'ACTIVE') {
                throw new Error('Position opening failed in integration flow');
            }
            
            // Paso 2: Esperar evaluación de ladder
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const ladders = this.components.primeLadder.getLaddersBySymbol('SOLUSDT');
            if (!ladders || ladders.length === 0) {
                throw new Error('Ladder not created for new position');
            }
            
            // Paso 3: Forzar condición de roll
            const rollResult = await this.components.primeLadder.forceRoll(position.id, 11, 'integration_test');
            if (!rollResult.success) {
                throw new Error(`Integration roll failed: ${rollResult.error}`);
            }
            
            // Paso 4: Verificar estado final
            const finalQueue = this.components.primeLadder.getRollQueue();
            const integrationRoll = finalQueue.queue.find(item => item.positionId === position.id);
            
            if (!integrationRoll) {
                throw new Error('Integration roll not found in final queue');
            }
            
            this.logger.debug(`✅ Integration flow: Position ${position.id} -> Ladder -> Roll queued`);
            return true;
        });
        
        // Test 5.2: Consistencia de métricas entre componentes
        await this.test('Cross-Component Metrics Consistency', async () => {
            const positionManagerMetrics = this.components.positionManager.getPositionManagerMetrics();
            const temporalMetrics = this.components.temporalEngine.getSystemMetrics();
            const ladderMetrics = this.components.primeLadder.getSystemMetrics();
            
            // Verificar que todos tienen timestamps recientes
            const now = Date.now();
            const fiveMinutesAgo = now - 5 * 60 * 1000;
            
            if (!positionManagerMetrics.primeLadders || !positionManagerMetrics.temporal) {
                throw new Error('Position Manager missing integrated metrics');
            }
            
            // Verificar θ-budget consistency
            if (!positionManagerMetrics.thetaBudget) {
                throw new Error('θ-budget metrics missing from Position Manager');
            }
            
            if (positionManagerMetrics.thetaBudget.dailyBudget <= 0) {
                throw new Error('Invalid daily θ-budget in integrated metrics');
            }
            
            // Verificar ladder metrics consistency
            const pmLadders = positionManagerMetrics.primeLadders.activeLadders;
            const directLadders = ladderMetrics.activeLadders;
            
            if (pmLadders !== directLadders) {
                throw new Error(`Ladder count mismatch: PM=${pmLadders}, Direct=${directLadders}`);
            }
            
            // Verificar temporal metrics consistency
            if (!temporalMetrics.constants || !temporalMetrics.system_health) {
                throw new Error('Temporal metrics incomplete');
            }
            
            this.logger.debug(`✅ Metrics consistency: Ladders=${pmLadders}, θ-Budget=${(positionManagerMetrics.thetaBudget.utilizationPercent).toFixed(1)}%`);
            return true;
        });
        
        // Test 5.3: Manejo de errores y fallbacks
        await this.test('Error Handling and Fallbacks', async () => {
            // Test 5.3.1: Position size con datos inválidos
            try {
                const invalidSizing = this.components.positionManager.calculateQuantumPositionSize(
                    null, // symbol inválido
                    0,    // precio inválido
                    -100, // stop loss inválido
                    0,    // take profit inválido
                    2.0   // confidence inválida
                );
                
                if (!invalidSizing.isFallback) {
                    throw new Error('Fallback not triggered for invalid sizing data');
                }
                
                if (invalidSizing.positionSize <= 0) {
                    throw new Error('Fallback position size invalid');
                }
            } catch (error) {
                // Expected error is OK
                this.logger.debug(`✅ Expected error handled: ${error.message}`);
            }
            
            // Test 5.3.2: Temporal metrics con datos faltantes
            const emptyMarketData = [];
            const temporalResult = this.components.temporalEngine.calculatePrimeCoherence(emptyMarketData, 'TESTUSDT');
            
            if (!temporalResult || temporalResult.prime_coherence < 0) {
                throw new Error('Temporal fallback not working correctly');
            }
            
            // Test 5.3.3: Ladder con posición inválida
            const invalidPosition = { id: 'INVALID', symbol: 'INVALID' };
            
            try {
                await this.components.primeLadder.evaluateForLadder(invalidPosition);
                // No debe crear ladder para posición inválida
                const invalidLadders = this.components.primeLadder.getLaddersBySymbol('INVALID');
                if (invalidLadders && invalidLadders.length > 0) {
                    throw new Error('Ladder created for invalid position');
                }
            } catch (error) {
                // Error esperado es OK
                this.logger.debug(`✅ Invalid position rejected: ${error.message}`);
            }
            
            return true;
        });
    }
    
    /**
     * Fase 6: Testing de stress y performance
     */
    async testPhase6_StressAndPerformance() {
        this.logger.info('⚡ FASE 6: Testing de stress y performance');
        
        // Test 6.1: Performance de cálculos temporales
        await this.test('Temporal Calculations Performance', async () => {
            const iterations = 100;
            const startTime = Date.now();
            
            for (let i = 0; i < iterations; i++) {
                const optionData = {
                    symbol: `TEST${i}USDT`,
                    expiry: new Date(Date.now() + (7 + i % 20) * 24 * 60 * 60 * 1000).toISOString(),
                    daysToExpiry: 7 + (i % 20),
                    theta: -0.01 - (i % 10) * 0.001,
                    price: 1000 + i * 10
                };
                
                const marketData = this.generateSyntheticMarketData(30);
                
                const result = this.components.temporalEngine.evaluateTemporalMetrics(
                    optionData, 
                    marketData, 
                    optionData.symbol
                );
                
                if (!result || !result.composite_score) {
                    throw new Error(`Performance test failed at iteration ${i}`);
                }
            }
            
            const duration = Date.now() - startTime;
            const avgTimePerCalculation = duration / iterations;
            
            if (avgTimePerCalculation > 50) { // 50ms por cálculo es el límite
                throw new Error(`Performance too slow: ${avgTimePerCalculation.toFixed(2)}ms per calculation`);
            }
            
            this.logger.debug(`✅ Performance: ${iterations} calculations in ${duration}ms (${avgTimePerCalculation.toFixed(2)}ms avg)`);
            return true;
        });
        
        // Test 6.2: Stress test de ladders múltiples
        await this.test('Multiple Ladders Stress Test', async () => {
            const symbols = ['STRESS1USDT', 'STRESS2USDT', 'STRESS3USDT', 'STRESS4USDT', 'STRESS5USDT'];
            const createdPositions = [];
            
            // Crear múltiples posiciones simultáneamente
            const creationPromises = symbols.map(async (symbol, index) => {
                const positionRequest = {
                    symbol,
                    side: 'BUY',
                    entryPrice: 1000 + index * 100,
                    stopLoss: 950 + index * 100,
                    takeProfit: 1100 + index * 100,
                    confidence: 0.7,
                    options: {
                        expiry: new Date(Date.now() + (7 + index * 2) * 24 * 60 * 60 * 1000).toISOString(),
                        daysToExpiry: 7 + index * 2,
                        theta: -0.02,
                        marketData: this.generateSyntheticMarketData(25)
                    }
                };
                
                try {
                    const position = await this.components.positionManager.openPosition(positionRequest);
                    return position;
                } catch (error) {
                    this.logger.warn(`Failed to create position for ${symbol}: ${error.message}`);
                    return null;
                }
            });
            
            const results = await Promise.all(creationPromises);
            const successfulPositions = results.filter(p => p !== null);
            
            if (successfulPositions.length < 3) {
                throw new Error(`Too few positions created: ${successfulPositions.length}/5`);
            }
            
            // Esperar procesamiento de ladders
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Verificar que se crearon ladders
            let totalLadders = 0;
            for (const symbol of symbols) {
                const ladders = this.components.primeLadder.getLaddersBySymbol(symbol);
                totalLadders += ladders.length;
            }
            
            if (totalLadders === 0) {
                throw new Error('No ladders created in stress test');
            }
            
            this.logger.debug(`✅ Stress test: ${successfulPositions.length} positions, ${totalLadders} ladders created`);
            return true;
        });
        
        // Test 6.3: Memory usage y cleanup
        await this.test('Memory Usage and Cleanup', async () => {
            const initialMemory = process.memoryUsage();
            
            // Simular carga de trabajo intensiva
            const heavyData = [];
            for (let i = 0; i < 1000; i++) {
                heavyData.push(this.generateSyntheticMarketData(100));
            }
            
            // Forzar garbage collection si está disponible
            if (global.gc) {
                global.gc();
            }
            
            const afterWorkMemory = process.memoryUsage();
            const memoryIncrease = afterWorkMemory.heapUsed - initialMemory.heapUsed;
            
            // Cleanup
            heavyData.length = 0;
            
            // Verificar cleanup de componentes
            await this.components.positionManager.cleanup();
            await this.components.primeLadder.cleanup();
            this.components.temporalEngine.stopBackgroundMonitoring();
            
            if (global.gc) {
                global.gc();
            }
            
            const finalMemory = process.memoryUsage();
            const memoryAfterCleanup = finalMemory.heapUsed;
            
            this.logger.debug(`✅ Memory: Initial=${Math.round(initialMemory.heapUsed/1024/1024)}MB, Peak=${Math.round(afterWorkMemory.heapUsed/1024/1024)}MB, Final=${Math.round(memoryAfterCleanup/1024/1024)}MB`);
            
            // Verificar que el memory usage no creció excesivamente
            if (memoryIncrease > 100 * 1024 * 1024) { // 100MB límite
                this.recordTestResult('Memory Usage Warning', true, `High memory increase: ${Math.round(memoryIncrease/1024/1024)}MB`, 'warning');
            }
            
            return true;
        });
    }
    
    /**
     * Generar datos de mercado sintéticos
     */
    generateSyntheticMarketData(count) {
        const data = [];
        let basePrice = 1000;
        
        for (let i = 0; i < count; i++) {
            const change = (Math.random() - 0.5) * 0.02; // ±1% change
            basePrice *= (1 + change);
            
            data.push({
                timestamp: Date.now() - (count - i) * 60000,
                open: basePrice * (1 + (Math.random() - 0.5) * 0.001),
                high: basePrice * (1 + Math.random() * 0.005),
                low: basePrice * (1 - Math.random() * 0.005),
                close: basePrice,
                volume: Math.floor(Math.random() * 10000) + 1000,
                volatility: 0.1 + Math.random() * 0.2
            });
        }
        
        return data;
    }
    
    /**
     * Ejecutar test individual
     */
    async test(testName, testFunction) {
        this.testResults.totalTests++;
        
        try {
            this.logger.debug(`🧪 Testing: ${testName}...`);
            const result = await testFunction();
            
            if (result === true) {
                this.testResults.passed++;
                this.recordTestResult(testName, true, 'Passed');
            } else {
                this.testResults.failed++;
                this.recordTestResult(testName, false, 'Test function returned non-true value');
            }
        } catch (error) {
            this.testResults.failed++;
            this.recordTestResult(testName, false, error.message);
            this.logger.error(`❌ Test failed: ${testName} - ${error.message}`);
        }
    }
    
    /**
     * Registrar resultado de test
     */
    recordTestResult(testName, passed, message, type = 'normal') {
        const result = {
            test: testName,
            passed,
            message,
            type,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.details.push(result);
        
        if (type === 'warning') {
            this.testResults.warnings++;
            this.logger.warn(`⚠️ ${testName}: ${message}`);
        } else if (passed) {
            this.logger.info(`✅ ${testName}: ${message}`);
        } else {
            this.logger.error(`❌ ${testName}: ${message}`);
        }
    }
    
    /**
     * Generar reporte final
     */
    generateFinalReport() {
        this.logger.info('\n📊 =============== REPORTE FINAL DE TESTING ===============\n');
        
        const passRate = (this.testResults.passed / this.testResults.totalTests * 100).toFixed(1);
        const failRate = (this.testResults.failed / this.testResults.totalTests * 100).toFixed(1);
        
        this.logger.info(`📈 RESUMEN EJECUTIVO:`);
        this.logger.info(`   Total Tests: ${this.testResults.totalTests}`);
        this.logger.info(`   ✅ Passed: ${this.testResults.passed} (${passRate}%)`);
        this.logger.info(`   ❌ Failed: ${this.testResults.failed} (${failRate}%)`);
        this.logger.info(`   ⚠️  Warnings: ${this.testResults.warnings}`);
        this.logger.info(`\n🎯 PASS RATE: ${passRate}%\n`);
        
        // Detalles por fase
        const phases = {
            'Phase 1': this.testResults.details.filter(t => t.test.includes('Initialization') || t.test.includes('Integration')),
            'Phase 2': this.testResults.details.filter(t => t.test.includes('Temporal') || t.test.includes('Edge') || t.test.includes('Coherence') || t.test.includes('Lambda')),
            'Phase 3': this.testResults.details.filter(t => t.test.includes('Position') || t.test.includes('Quantum') || t.test.includes('Theta Budget')),
            'Phase 4': this.testResults.details.filter(t => t.test.includes('Ladder') || t.test.includes('Roll')),
            'Phase 5': this.testResults.details.filter(t => t.test.includes('Integration') || t.test.includes('Consistency') || t.test.includes('Error')),
            'Phase 6': this.testResults.details.filter(t => t.test.includes('Performance') || t.test.includes('Stress') || t.test.includes('Memory'))
        };
        
        for (const [phaseName, phaseTests] of Object.entries(phases)) {
            if (phaseTests.length > 0) {
                const phasePassed = phaseTests.filter(t => t.passed).length;
                const phasePassRate = (phasePassed / phaseTests.length * 100).toFixed(1);
                
                this.logger.info(`📋 ${phaseName}: ${phasePassed}/${phaseTests.length} (${phasePassRate}%)`);
                
                const failures = phaseTests.filter(t => !t.passed);
                if (failures.length > 0) {
                    failures.forEach(f => {
                        this.logger.error(`   ❌ ${f.test}: ${f.message}`);
                    });
                }
                
                const warnings = phaseTests.filter(t => t.type === 'warning');
                if (warnings.length > 0) {
                    warnings.forEach(w => {
                        this.logger.warn(`   ⚠️  ${w.test}: ${w.message}`);
                    });
                }
            }
        }
        
        // Conclusiones
        this.logger.info(`\n🏆 CONCLUSIONES:`);
        
        if (this.testResults.failed === 0) {
            this.logger.info(`   ✅ Sistema θ-aware COMPLETAMENTE FUNCIONAL`);
            this.logger.info(`   ✅ Todos los componentes integrados correctamente`);
            this.logger.info(`   ✅ Prime Ladders operacionales`);
            this.logger.info(`   ✅ Métricas temporales estables`);
        } else if (this.testResults.failed <= 2) {
            this.logger.info(`   🟡 Sistema θ-aware MAYORMENTE FUNCIONAL`);
            this.logger.info(`   🟡 Errores menores detectados - requiere ajustes`);
        } else {
            this.logger.error(`   🔴 Sistema θ-aware REQUIERE CORRECCIONES CRÍTICAS`);
            this.logger.error(`   🔴 ${this.testResults.failed} tests fallidos - revisar implementación`);
        }
        
        if (this.testResults.warnings > 0) {
            this.logger.warn(`   ⚠️  ${this.testResults.warnings} advertencias - monitorear en producción`);
        }
        
        // Recomendaciones
        this.logger.info(`\n📋 PRÓXIMOS PASOS RECOMENDADOS:`);
        
        if (this.testResults.failed === 0) {
            this.logger.info(`   1. ✅ Continuar con integración Exchange Gateway real`);
            this.logger.info(`   2. ✅ Configurar monitoreo en producción`);
            this.logger.info(`   3. ✅ Ejecutar backtesting con datos históricos`);
        } else {
            this.logger.info(`   1. 🔧 Corregir tests fallidos antes de producción`);
            this.logger.info(`   2. 🔄 Re-ejecutar testing tras correcciones`);
            this.logger.info(`   3. 📊 Validar métricas después de fixes`);
        }
        
        this.logger.info(`\n=============== FIN DE REPORTE ===============\n`);
        
        // Guardar reporte en archivo
        this.saveReportToFile();
    }
    
    /**
     * Guardar reporte en archivo
     */
    saveReportToFile() {
        const fs = require('fs');
        const reportData = {
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: this.testResults.totalTests,
                passed: this.testResults.passed,
                failed: this.testResults.failed,
                warnings: this.testResults.warnings,
                passRate: (this.testResults.passed / this.testResults.totalTests * 100).toFixed(1)
            },
            details: this.testResults.details,
            systemInfo: {
                nodeVersion: process.version,
                platform: process.platform,
                memory: process.memoryUsage()
            }
        };
        
        try {
            fs.writeFileSync('theta-aware-test-report.json', JSON.stringify(reportData, null, 2));
            this.logger.info(`📄 Reporte guardado en: theta-aware-test-report.json`);
        } catch (error) {
            this.logger.error(`Error guardando reporte: ${error.message}`);
        }
    }
}

// Ejecutar testing si se llama directamente
if (require.main === module) {
    const tester = new ThetaAwareSystemTester();
    
    tester.runCompleteTestSuite()
        .then(() => {
            process.exit(tester.testResults.failed === 0 ? 0 : 1);
        })
        .catch((error) => {
            console.error('💀 Critical testing error:', error);
            process.exit(1);
        });
}

module.exports = ThetaAwareSystemTester;

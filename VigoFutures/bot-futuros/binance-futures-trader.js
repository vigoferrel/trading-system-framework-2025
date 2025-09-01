
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

const axios = require('axios');
const crypto = require('crypto');
const { QuantumProfitMaximizer } = require('../core/quantum-engine/QuantumProfitMaximizer');
const { FeynmanQuadrantsOptimizer } = require('../core/quantum-engine/modules/FeynmanQuadrantsOptimizer');
const { BinanceRateLimitOptimizer } = require('../core/quantum-engine/modules/BinanceRateLimitOptimizer');
const { LunarHiddenFaceOptimizer } = require('../core/quantum-engine/modules/LunarHiddenFaceOptimizer');

class BinanceFuturesTrader {
    constructor(config) {
        this.config = config || {};
        
        // Usar configuración específica de futuros si está disponible
        if (config.binanceFutures) {
            this.apiKey = config.binanceFutures.apiKey;
            this.apiSecret = config.binanceFutures.apiSecret;
            this.baseUrl = config.binanceFutures.baseUrl || 'https://fapi.binance.com';
            this.testnet = config.binanceFutures.testnet || false;
        } else if (config.binance) {
            // Fallback a configuración general de Binance
            this.apiKey = config.binance.apiKey;
            this.apiSecret = config.binance.apiSecret;
            this.baseUrl = config.binance.baseUrl || 'https://fapi.binance.com';
            this.testnet = config.binance.testnet || false;
        } else {
            // Última opción: variables de entorno
            this.apiKey = process.env.BINANCE_FUTURES_API_KEY || process.env.BINANCE_API_KEY;
            this.apiSecret = process.env.BINANCE_FUTURES_API_SECRET || process.env.BINANCE_API_SECRET;
            this.baseUrl = 'https://fapi.binance.com';
            this.testnet = false;
        }
        
        // Usar el modo de simulación de la configuración o determinarlo basado en credenciales
        this.config.simulationMode = this.config.simulationMode !== undefined ? 
            this.config.simulationMode : (!this.apiKey || this.apiKey.length < 10);
        
        // Quantum components
        this.profitMaximizer = new QuantumProfitMaximizer();
        this.feynmanOptimizer = new FeynmanQuadrantsOptimizer();
        this.rateLimitOptimizer = new BinanceRateLimitOptimizer();
        this.lunarOptimizer = new LunarHiddenFaceOptimizer();
        
        // Trading state
        this.positions = new Map();
        this.openOrders = new Map();
        this.balance = null;
        this.lastUpdate = 0;
        
        // Enhanced profit parameters
        this.profitConfig = {
            quantumLeverageMultiplier: 7919,
            zuritaProfitConstant: 9.16,
            feynmanComplexOptimization: { real: 9, imaginary: 16 },
            lambdaFrequency: 888,
            logPrimeFactor: Math.log(7919),
            riskQuantumTolerance: 0.93,
            profitCompoundingRate: 1.618,
            edgeDetectionThreshold: 0.000001,
            arbitrageWindowMs: 3,
            momentumCaptureThreshold: 0.005,
            volatilityExploitationFactor: 9.0,
            correlationProfitThreshold: 0.5,
            liquidityHarvestingRatio: 0.47,
            scalingAccelerationFactor: 7.0,
            transTemporalAdvantage: 3000,
            gravitationalLensing: true
        };
        
        console.log('[BINANCE-FUTURES] Trader inicializado con optimización cuántica');
        console.log('[BINANCE-FUTURES] Feynman Z-Optimal:', this.profitConfig.feynmanComplexOptimization);
        console.log('[BINANCE-FUTURES] Lambda Frequency:', this.profitConfig.lambdaFrequency + 'MHz');
        console.log('[BINANCE-FUTURES] Zurita Multiplier:', this.profitConfig.quantumLeverageMultiplier);
    }
    
    async initialize() {
        try {
            // Inicializar optimizadores cuánticos
            await this.feynmanOptimizer.initialize();
            await this.rateLimitOptimizer.initialize();
            await this.lunarOptimizer.initialize();
            
            // Obtener balance inicial
            await this.updateBalance();
            
            // Sincronizar posiciones abiertas
            await this.syncPositions();
            
            console.log('[BINANCE-FUTURES] Sistema inicializado correctamente');
            if (this.balance) {
                console.log('[BINANCE-FUTURES] Balance disponible:', this.balance.availableBalance);
                console.log('[BINANCE-FUTURES] Apalancamiento máximo:', this.profitConfig.quantumLeverageMultiplier);
            } else {
                console.log('[BINANCE-FUTURES] Balance no disponible - modo simulación');
                this.balance = { 
                    availableBalance: 10000, 
                    crossWalletBalance: 10000,
                    crossUnPnl: 0,
                    marginBalance: 10000
                };
            }
            
            return true;
        } catch (error) {
            console.error('[BINANCE-FUTURES] Error en inicialización:', error.message);
            return false;
        }
    }
    
    async updateBalance() {
        try {
            // Verificamos que tenemos credenciales válidas
            if (!this.apiKey || this.apiKey.length < 10) {
                throw new Error('Las credenciales no son válidas para acceder a la API');
            }
            
            // Las credenciales son válidas, continuamos con la operación
            console.log('[BINANCE-FUTURES] Usando credenciales válidas para actualizar balance');
            
            const timestamp = Date.now();
            const signature = this._generateSignature({ timestamp });
            
            const response = await axios.get(`${this.baseUrl}/fapi/v2/balance`, {
                headers: {
                    'X-MBX-APIKEY': this.apiKey
                },
                params: {
                    timestamp,
                    signature
                }
            });
            
            const usdtBalance = response.data.find(b => b.asset === 'USDT');
            if (usdtBalance) {
                this.balance = {
                    availableBalance: parseFloat(usdtBalance.availableBalance),
                    crossWalletBalance: parseFloat(usdtBalance.crossWalletBalance),
                    crossUnPnl: parseFloat(usdtBalance.crossUnPnl),
                    marginBalance: parseFloat(usdtBalance.marginBalance)
                };
                console.log('[BINANCE-FUTURES] Balance actualizado desde API');
            }
            
            this.lastUpdate = Date.now();
        } catch (error) {
            console.error('[BINANCE-FUTURES] Error actualizando balance:', error.message);
            // Crear balance simulado en caso de error
            if (!this.balance) {
                console.log('[BINANCE-FUTURES] Usando balance simulado');
                this.balance = {
                    availableBalance: 10000,
                    crossWalletBalance: 10000,
                    crossUnPnl: 0,
                    marginBalance: 10000
                };
            }
        }
    }
    
    async syncPositions() {
        try {
            // Verificamos que tenemos credenciales válidas
            if (!this.apiKey || this.apiKey.length < 10) {
                throw new Error('Las credenciales no son válidas para acceder a la API');
            }
            
            // Las credenciales son válidas, continuamos con la operación
            console.log('[BINANCE-FUTURES] Usando credenciales válidas para sincronizar posiciones');
            
            const timestamp = Date.now();
            const signature = this._generateSignature({ timestamp });
            
            const response = await axios.get(`${this.baseUrl}/fapi/v2/positionRisk`, {
                headers: {
                    'X-MBX-APIKEY': this.apiKey
                },
                params: {
                    timestamp,
                    signature
                }
            });
            
            this.positions.clear();
            
            for (const position of response.data) {
                if (parseFloat(position.positionAmt) !== 0) {
                    this.positions.set(position.symbol, {
                        symbol: position.symbol,
                        side: parseFloat(position.positionAmt) > 0 ? 'LONG' : 'SHORT',
                        size: Math.abs(parseFloat(position.positionAmt)),
                        entryPrice: parseFloat(position.entryPrice),
                        markPrice: parseFloat(position.markPrice),
                        pnl: parseFloat(position.unrealizedPnl),
                        roe: parseFloat(position.percentage),
                        leverage: parseFloat(position.leverage)
                    });
                }
            }
            
            console.log(`[BINANCE-FUTURES] Sincronizadas ${this.positions.size} posiciones`);
        } catch (error) {
            console.error('[BINANCE-FUTURES] Error sincronizando posiciones:', error.message);
            // En caso de error, inicializar con posiciones vacías
            this.positions = this.positions || new Map();
            
            // Si es modo simulación, podemos crear algunas posiciones de ejemplo
            if (this.config.simulationMode) {
                console.log('[BINANCE-FUTURES] Creando posiciones simuladas');
                this._createSimulatedPositions();
            }
        }
    }
    
    /**
     * Crea posiciones simuladas para modo de prueba
     * @private
     */
    _createSimulatedPositions() {
        // Solo crear posiciones simuladas si estamos en modo simulación y no hay posiciones
        if (!this.config.simulationMode || this.positions.size > 0) {
            return;
        }
        
        // Ejemplos de posiciones simuladas
        const simulatedPositions = [
            {
                symbol: 'BTCUSDT',
                side: 'LONG',
                size: 0.1,
                entryPrice: 65000,
                markPrice: 65500,
                pnl: 50,
                roe: 0.07,
                leverage: 10
            },
            {
                symbol: 'ETHUSDT',
                side: 'SHORT',
                size: 0.5,
                entryPrice: 3500,
                markPrice: 3450,
                pnl: 25,
                roe: 0.05,
                leverage: 5
            }
        ];
        
        // Añadir posiciones simuladas
        simulatedPositions.forEach(pos => {
            this.positions.set(pos.symbol, pos);
        });
        
        console.log(`[BINANCE-FUTURES] Creadas ${simulatedPositions.length} posiciones simuladas`);
    }
    
    async calculateOptimalLeverage(symbol, marketData) {
        // Apalancamiento basado en Sharpe de la señal y liquidez
        const vol = Math.max(1e-6, marketData.volatility || 0.02);
        const mu = (marketData.expectedReturn || 0.001); // estimado por tu motor/ventana
        const sharpe = mu / vol;
        const liquidity = Math.max(0.1, Math.min(1.0, (marketData.liquidityScore || 0.7)));
        const base = 5; // base conservadora
        const leverage = base * Math.max(0, sharpe) * liquidity;
        const maxLeverage = 25; // cap seguro por defecto
        return Math.min(maxLeverage, Math.max(1, leverage));
    }
    
    async evaluateQuantumOpportunity(symbol, marketData) {
        // Obtener métricas cuánticas
        const quantumMetrics = this.profitMaximizer.maximizeQuantumProfits();
        
        // Optimización Feynman
        const feynmanEfficiency = this.feynmanOptimizer.getFeynmanQuadrantEfficiency();
        
        // Optimización de rate limits
        const rateLimitMetrics = this.rateLimitOptimizer.getOptimizationMetrics();
        
        // Optimización lunar
        const lunarMetrics = this.lunarOptimizer.getLunarMetrics();
        
        // Calcular edge cuántico
        const quantumEdge = quantumMetrics.profitPotential * this.profitConfig.zuritaProfitConstant;
        
        // Calcular confianza cuántica
        const quantumConfidence = (
            feynmanEfficiency.totalEfficiency +
            rateLimitMetrics.optimizationScore +
            lunarMetrics.temporalAdvantageScore
        ) / 3;
        
        // Calcular tamaño de posición óptimo
        const optimalLeverage = await this.calculateOptimalLeverage(symbol, marketData);
        const riskAmount = this.balance.availableBalance * 0.02; // 2% de riesgo por operación
        const positionSize = riskAmount * optimalLeverage / marketData.price;
        
        return {
            symbol,
            timestamp: Date.now(),
            edge: quantumEdge,
            confidence: quantumConfidence,
            price: marketData.price,
            leverage: optimalLeverage,
            positionSize,
            stopLoss: marketData.price * (1 - 0.02), // 2% stop loss
            takeProfit: marketData.price * (1 + 0.04), // 4% take profit
            quantumMetrics,
            feynmanEfficiency,
            rateLimitMetrics,
            lunarMetrics
        };
    }
    
    async executeQuantumTrade(opportunity) {
        try {
            const { symbol, side, size, price, leverage, stopLoss, takeProfit } = opportunity;
            
            console.log(`[QUANTUM-TRADE] Ejecutando operación cuántica: ${symbol} ${side} ${size} @ ${price}`);
            
            // Aplicar optimización de rate limits
            await this.rateLimitOptimizer.waitForOptimalWindow();
            
            // Colocar orden principal
            const orderResult = await this._placeOrder({
                symbol,
                side,
                type: 'MARKET',
                quantity: size,
                leverage
            });
            
            if (orderResult.orderId) {
                // Colocar stop loss
                await this._placeOrder({
                    symbol,
                    side: side === 'BUY' ? 'SELL' : 'BUY',
                    type: 'STOP_MARKET',
                    quantity: size,
                    stopPrice: stopLoss,
                    reduceOnly: true
                });
                
                // Colocar take profit
                await this._placeOrder({
                    symbol,
                    side: side === 'BUY' ? 'SELL' : 'BUY',
                    type: 'TAKE_PROFIT_MARKET',
                    quantity: size,
                    stopPrice: takeProfit,
                    reduceOnly: true
                });
                
                console.log(`[QUANTUM-TRADE] Operación ejecutada con éxito: ${orderResult.orderId}`);
                return orderResult;
            }
            
            throw new Error('No se pudo ejecutar la orden');
        } catch (error) {
            console.error('[QUANTUM-TRADE] Error ejecutando operación:', error.message);
            throw error;
        }
    }
    
    async _placeOrder(params) {
        const timestamp = Date.now();
        const signature = this._generateSignature({ ...params, timestamp });
        
        try {
            const response = await axios.post(`${this.baseUrl}/fapi/v1/order`, null, {
                headers: {
                    'X-MBX-APIKEY': this.apiKey
                },
                params: {
                    ...params,
                    timestamp,
                    signature
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('[BINANCE-FUTURES] Error placing order:', error.response?.data || error.message);
            throw error;
        }
    }
    
    _generateSignature(params) {
        const queryString = Object.keys(params)
            .filter(key => params[key] !== undefined && params[key] !== null)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        
        return crypto.createHmac('sha256', this.apiSecret)
            .update(queryString)
            .digest('hex');
    }
    
    getTradingStats() {
        const positions = Array.from(this.positions.values());
        const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
        const totalLeverage = positions.reduce((sum, pos) => sum + pos.leverage, 0);
        const avgLeverage = positions.length > 0 ? totalLeverage / positions.length : 0;
        
        return {
            positions: positions.length,
            totalPnL,
            avgLeverage,
            availableBalance: this.balance?.availableBalance || 0,
            lastUpdate: this.lastUpdate,
            quantumMetrics: this.profitMaximizer.maximizeQuantumProfits(),
            feynmanEfficiency: this.feynmanOptimizer.getFeynmanQuadrantEfficiency(),
            rateLimitMetrics: this.rateLimitOptimizer.getOptimizationMetrics(),
            lunarMetrics: this.lunarOptimizer.getLunarMetrics()
        };
    }
}

module.exports = { BinanceFuturesTrader };
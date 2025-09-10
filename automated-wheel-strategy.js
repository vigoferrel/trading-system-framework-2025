#!/usr/bin/env node
/**
 * 🎯 AUTOMATED WHEEL STRATEGY - REALISMO TOTAL
 * ===========================================
 * 
 * Implementación completa de la estrategia "Wheel" automatizada:
 * 1. Cash-Secured Puts → Si se asigna → Covered Calls → Repeat
 * 2. Costos reales integrados
 * 3. Gestión automática de riesgo
 * 4. Monitoreo en segundo plano
 * 5. Optimización dinámica según market conditions
 * 
 * PRINCIPIO: "Ser el casino, no el apostador"
 * 
 * @author QBTC Systems - Automated Trading Division
 * @version 1.0 - WHEEL WITH REAL COSTS
 */

const { createRealCostEngine } = require('./transaction-costs-engine');
const fs = require('fs');
const path = require('path');

// ==============================================================================
// 🎪 CONFIGURACIÓN DE LA ESTRATEGIA WHEEL
// ==============================================================================

const WHEEL_CONFIG = {
    // Parámetros de la estrategia
    CASH_PUT_OTM_BUFFER: 0.15,           // 15% Out-The-Money para puts
    COVERED_CALL_OTM_BUFFER: 0.10,       // 10% Out-The-Money para calls
    MAX_DTE: 45,                         // Máximo 45 días a expiración
    MIN_DTE: 7,                          // Mínimo 7 días para roll
    TARGET_DELTA: 0.30,                  // Delta objetivo para opciones
    
    // Gestión de riesgo
    MAX_POSITION_SIZE: 0.20,             // 20% máximo por posición
    STOP_LOSS_THRESHOLD: -0.08,          // 8% stop loss
    PROFIT_TARGET: 0.50,                 // 50% del premium como target
    MAX_ROLL_ATTEMPTS: 3,                // Máximo 3 intentos de roll
    
    // Timing y automatización
    MONITOR_INTERVAL_MS: 30000,          // Monitoreo cada 30 segundos
    MARKET_HOURS_CHECK: true,            // Solo operar en horas de mercado
    WEEKEND_PAUSE: true,                 // Pausar en fines de semana
    
    // Optimización dinámica
    VOLATILITY_ADJUSTMENT: true,         // Ajustar según volatilidad
    EARNINGS_AVOIDANCE: true,            // Evitar fechas de earnings
    LIQUIDITY_MINIMUM: 100000           // Volumen mínimo de opciones
};

// ==============================================================================
// 🌀 MOTOR DE ESTRATEGIA WHEEL AUTOMATIZADA
// ==============================================================================

class AutomatedWheelStrategy {
    constructor(config = {}) {
        this.config = {
            broker: config.broker || 'BINANCE',
            initial_capital: config.initial_capital || 100000,
            symbols: config.symbols || ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'],
            enable_real_execution: config.enable_real_execution || false, // SEGURIDAD
            enable_logging: config.enable_logging ?? true,
            risk_profile: config.risk_profile || 'MODERATE',
            ...config
        };
        
        // Inicializar motor de costos
        this.cost_engine = createRealCostEngine(this.config.broker, {
            account_size: this.config.initial_capital,
            enable_logging: this.config.enable_logging
        });
        
        // Estado del sistema
        this.state = {
            current_positions: new Map(),      // Posiciones activas por símbolo
            wheel_phase: new Map(),            // Fase actual del wheel por símbolo
            capital_allocated: 0,              // Capital desplegado
            cash_available: this.config.initial_capital,
            total_premium_collected: 0,
            total_costs_paid: 0,
            performance_history: [],
            last_update: new Date(),
            is_running: false
        };
        
        // Inicializar wheel phases para cada símbolo
        this.config.symbols.forEach(symbol => {
            this.state.wheel_phase.set(symbol, {
                phase: 'READY_FOR_PUT',         // Estados: READY_FOR_PUT, PUT_ACTIVE, STOCK_OWNED, CALL_ACTIVE
                position: null,
                entry_date: null,
                profit_target: 0,
                stop_loss: 0,
                roll_count: 0,
                total_collected: 0
            });
        });
        
        this.monitoring_interval = null;
        this.performance_logger = new WheelPerformanceLogger(this.config.enable_logging);
    }
    
    /**
     * 🚀 Iniciar el sistema automatizado
     */
    async start() {
        if (this.state.is_running) {
            console.log('⚠️ Sistema ya está ejecutándose');
            return;
        }
        
        console.log('🎪 INICIANDO AUTOMATED WHEEL STRATEGY');
        console.log(`   Broker: ${this.config.broker}`);
        console.log(`   Capital: $${this.config.initial_capital.toLocaleString()}`);
        console.log(`   Símbolos: ${this.config.symbols.join(', ')}`);
        console.log(`   Ejecución real: ${this.config.enable_real_execution ? 'SÍ' : 'SIMULACIÓN'}`);
        console.log('');
        
        this.state.is_running = true;
        
        // Iniciar monitoreo continuo
        this.monitoring_interval = setInterval(() => {
            this.executeMainLoop().catch(error => {
                console.error('❌ Error en main loop:', error.message);
                this.performance_logger.logError(error);
            });
        }, WHEEL_CONFIG.MONITOR_INTERVAL_MS);
        
        // Ejecutar primer ciclo inmediatamente
        await this.executeMainLoop();
        
        console.log('✅ Sistema iniciado correctamente');
    }
    
    /**
     * 🛑 Detener el sistema
     */
    stop() {
        if (!this.state.is_running) {
            console.log('⚠️ Sistema no está ejecutándose');
            return;
        }
        
        if (this.monitoring_interval) {
            clearInterval(this.monitoring_interval);
            this.monitoring_interval = null;
        }
        
        this.state.is_running = false;
        console.log('🛑 Sistema detenido');
        
        // Generar reporte final
        this.generateFinalReport();
    }
    
    /**
     * 🔄 Loop principal de ejecución
     */
    async executeMainLoop() {
        try {
            this.state.last_update = new Date();
            
            // 1. Verificar condiciones de mercado
            if (!this.isMarketOpen()) {
                return; // No operar fuera de horario
            }
            
            // 2. Obtener datos de mercado actualizados
            const market_data = await this.fetchMarketData();
            
            // 3. Procesar cada símbolo
            for (const symbol of this.config.symbols) {
                await this.processSymbol(symbol, market_data[symbol]);
            }
            
            // 4. Actualizar métricas de performance
            this.updatePerformanceMetrics();
            
            // 5. Log del estado actual
            this.logCurrentState();
            
        } catch (error) {
            console.error(`❌ Error en executeMainLoop: ${error.message}`);
            this.performance_logger.logError(error);
        }
    }
    
    /**
     * ⚙️ Procesar un símbolo individual
     */
    async processSymbol(symbol, market_data) {
        const wheel_state = this.state.wheel_phase.get(symbol);
        
        try {
            switch (wheel_state.phase) {
                case 'READY_FOR_PUT':
                    await this.evaluateCashSecuredPut(symbol, market_data);
                    break;
                    
                case 'PUT_ACTIVE':
                    await this.managePutPosition(symbol, market_data);
                    break;
                    
                case 'STOCK_OWNED':
                    await this.evaluateCoveredCall(symbol, market_data);
                    break;
                    
                case 'CALL_ACTIVE':
                    await this.manageCallPosition(symbol, market_data);
                    break;
                    
                default:
                    console.warn(`⚠️ Estado desconocido para ${symbol}: ${wheel_state.phase}`);
            }
        } catch (error) {
            console.error(`❌ Error procesando ${symbol}: ${error.message}`);
        }
    }
    
    /**
     * 🎯 Evaluar oportunidad de Cash-Secured Put
     */
    async evaluateCashSecuredPut(symbol, market_data) {
        if (!market_data) {
            return;
        }
        
        const wheel_state = this.state.wheel_phase.get(symbol);
        const current_price = market_data.current_price;
        const implied_vol = market_data.implied_volatility || 0.30;
        
        // Calcular strike price objetivo
        const target_strike = current_price * (1 - WHEEL_CONFIG.CASH_PUT_OTM_BUFFER);
        
        // Estimar premium y costos
        const estimated_contracts = this.calculateOptimalContracts(symbol, target_strike);
        const estimated_premium = this.estimatePutPremium(current_price, target_strike, implied_vol);
        
        if (estimated_contracts === 0) {
            return; // No hay capital suficiente
        }
        
        // Calcular costos reales
        const opening_costs = this.cost_engine.calculateOptionsOpeningCosts({
            contracts: estimated_contracts,
            premium_per_contract: estimated_premium,
            underlying_price: current_price,
            strategy: 'CASH_SECURED_PUT'
        });
        
        const net_premium = (estimated_premium * estimated_contracts * 100) - opening_costs.total_cost;
        const net_return = net_premium / (estimated_contracts * target_strike * 100);
        
        // Criterios de entrada
        if (this.shouldEnterPutTrade(net_return, opening_costs, market_data)) {
            await this.executeCashSecuredPut(symbol, {
                contracts: estimated_contracts,
                strike: target_strike,
                premium: estimated_premium,
                costs: opening_costs,
                market_data
            });
        }
    }
    
    /**
     * 📈 Ejecutar Cash-Secured Put
     */
    async executeCashSecuredPut(symbol, trade_params) {
        const wheel_state = this.state.wheel_phase.get(symbol);
        const required_capital = trade_params.contracts * trade_params.strike * 100;
        
        if (this.state.cash_available < required_capital) {
            console.log(`⚠️ ${symbol}: Capital insuficiente para PUT`);
            return;
        }
        
        try {
            // En modo real, aquí iría la llamada a la API del broker
            if (this.config.enable_real_execution) {
                // TODO: Implementar ejecución real
                console.log('🚨 REAL EXECUTION DISABLED FOR SAFETY');
                return;
            }
            
            // Simulación de ejecución
            const position = {
                id: this.generatePositionId(),
                symbol: symbol,
                type: 'CASH_SECURED_PUT',
                contracts: trade_params.contracts,
                strike: trade_params.strike,
                premium_collected: trade_params.premium * trade_params.contracts * 100,
                costs: trade_params.costs,
                net_premium: trade_params.premium * trade_params.contracts * 100 - trade_params.costs.total_cost,
                entry_date: new Date(),
                entry_price: trade_params.market_data.current_price,
                expiration_estimate: new Date(Date.now() + WHEEL_CONFIG.MAX_DTE * 24 * 60 * 60 * 1000),
                status: 'ACTIVE',
                pnl: 0
            };
            
            // Actualizar estado
            wheel_state.phase = 'PUT_ACTIVE';
            wheel_state.position = position;
            wheel_state.entry_date = position.entry_date;
            wheel_state.profit_target = position.net_premium * WHEEL_CONFIG.PROFIT_TARGET;
            wheel_state.stop_loss = position.net_premium * WHEEL_CONFIG.STOP_LOSS_THRESHOLD;
            
            this.state.current_positions.set(position.id, position);
            this.state.capital_allocated += required_capital;
            this.state.cash_available -= required_capital;
            this.state.total_premium_collected += position.premium_collected;
            this.state.total_costs_paid += trade_params.costs.total_cost;
            
            console.log(`✅ ${symbol}: PUT ejecutado`);
            console.log(`   Contratos: ${position.contracts}`);
            console.log(`   Strike: $${position.strike.toFixed(2)}`);
            console.log(`   Premium neto: $${position.net_premium.toFixed(2)}`);
            console.log(`   Costos: $${trade_params.costs.total_cost.toFixed(2)}`);
            
            this.performance_logger.logTrade(position, 'PUT_OPENED');
            
        } catch (error) {
            console.error(`❌ Error ejecutando PUT en ${symbol}: ${error.message}`);
        }
    }
    
    /**
     * 🔄 Gestionar posición PUT activa
     */
    async managePutPosition(symbol, market_data) {
        const wheel_state = this.state.wheel_phase.get(symbol);
        const position = wheel_state.position;
        
        if (!position || !market_data) {
            return;
        }
        
        const current_price = market_data.current_price;
        const days_to_expiration = this.calculateDaysToExpiration(position.expiration_estimate);
        
        // Actualizar P&L
        const option_value = this.estimateCurrentOptionValue(position, market_data);
        position.pnl = position.net_premium - option_value;
        
        // Decisiones de gestión
        if (days_to_expiration <= WHEEL_CONFIG.MIN_DTE) {
            if (current_price > position.strike) {
                // PUT expira sin valor - ¡GANAMOS!
                await this.closePutPosition(symbol, 'EXPIRED_WORTHLESS');
            } else {
                // Probable asignación - preparar para recibir acciones
                await this.handlePutAssignment(symbol);
            }
        } else if (position.pnl >= wheel_state.profit_target) {
            // Alcanzó profit target - cerrar temprano
            await this.closePutPosition(symbol, 'PROFIT_TARGET_HIT');
        } else if (position.pnl <= wheel_state.stop_loss) {
            // Stop loss - cerrar posición
            await this.closePutPosition(symbol, 'STOP_LOSS');
        }
        // Si no, mantener la posición
    }
    
    /**
     * 📊 Evaluar oportunidad de Covered Call
     */
    async evaluateCoveredCall(symbol, market_data) {
        if (!market_data) {
            return;
        }
        
        const wheel_state = this.state.wheel_phase.get(symbol);
        const current_price = market_data.current_price;
        const implied_vol = market_data.implied_volatility || 0.30;
        
        // Calcular strike price objetivo (por encima del precio actual)
        const target_strike = current_price * (1 + WHEEL_CONFIG.COVERED_CALL_OTM_BUFFER);
        
        // Estimar premium y costos
        const stock_quantity = wheel_state.stock_quantity || 100; // Por defecto 100 acciones
        const contracts = Math.floor(stock_quantity / 100);
        const estimated_premium = this.estimateCallPremium(current_price, target_strike, implied_vol);
        
        if (contracts === 0) {
            return; // No hay acciones suficientes
        }
        
        // Calcular costos reales
        const opening_costs = this.cost_engine.calculateOptionsOpeningCosts({
            contracts: contracts,
            premium_per_contract: estimated_premium,
            underlying_price: current_price,
            strategy: 'COVERED_CALL'
        });
        
        const net_premium = (estimated_premium * contracts * 100) - opening_costs.total_cost;
        const net_return = net_premium / (contracts * current_price * 100);
        
        // Criterios de entrada
        if (this.shouldEnterCallTrade(net_return, opening_costs, market_data)) {
            await this.executeCoveredCall(symbol, {
                contracts: contracts,
                strike: target_strike,
                premium: estimated_premium,
                costs: opening_costs,
                market_data
            });
        }
    }
    
    /**
     * 📈 Ejecutar Covered Call
     */
    async executeCoveredCall(symbol, trade_params) {
        const wheel_state = this.state.wheel_phase.get(symbol);
        
        try {
            // Simulación de ejecución
            const position = {
                id: this.generatePositionId(),
                symbol: symbol,
                type: 'COVERED_CALL',
                contracts: trade_params.contracts,
                strike: trade_params.strike,
                premium_collected: trade_params.premium * trade_params.contracts * 100,
                costs: trade_params.costs,
                net_premium: trade_params.premium * trade_params.contracts * 100 - trade_params.costs.total_cost,
                entry_date: new Date(),
                entry_price: trade_params.market_data.current_price,
                expiration_estimate: new Date(Date.now() + WHEEL_CONFIG.MAX_DTE * 24 * 60 * 60 * 1000),
                status: 'ACTIVE',
                pnl: 0
            };
            
            // Actualizar estado
            wheel_state.phase = 'CALL_ACTIVE';
            wheel_state.position = position;
            wheel_state.entry_date = position.entry_date;
            wheel_state.profit_target = position.net_premium * WHEEL_CONFIG.PROFIT_TARGET;
            wheel_state.stop_loss = position.net_premium * WHEEL_CONFIG.STOP_LOSS_THRESHOLD;
            
            this.state.current_positions.set(position.id, position);
            this.state.total_premium_collected += position.premium_collected;
            this.state.total_costs_paid += trade_params.costs.total_cost;
            
            console.log(`✅ ${symbol}: CALL ejecutado`);
            console.log(`   Contratos: ${position.contracts}`);
            console.log(`   Strike: $${position.strike.toFixed(2)}`);
            console.log(`   Premium neto: $${position.net_premium.toFixed(2)}`);
            
            this.performance_logger.logTrade(position, 'CALL_OPENED');
            
        } catch (error) {
            console.error(`❌ Error ejecutando CALL en ${symbol}: ${error.message}`);
        }
    }
    
    /**
     * 🔄 Gestionar posición CALL activa
     */
    async manageCallPosition(symbol, market_data) {
        const wheel_state = this.state.wheel_phase.get(symbol);
        const position = wheel_state.position;
        
        if (!position || !market_data) {
            return;
        }
        
        const current_price = market_data.current_price;
        const days_to_expiration = this.calculateDaysToExpiration(position.expiration_estimate);
        
        // Actualizar P&L
        const option_value = this.estimateCurrentOptionValue(position, market_data);
        position.pnl = position.net_premium - option_value;
        
        // Decisiones de gestión
        if (days_to_expiration <= WHEEL_CONFIG.MIN_DTE) {
            if (current_price < position.strike) {
                // CALL expira sin valor - ¡GANAMOS!
                await this.closeCallPosition(symbol, 'EXPIRED_WORTHLESS');
            } else {
                // Probable asignación - venderemos las acciones
                await this.handleCallAssignment(symbol);
            }
        } else if (position.pnl >= wheel_state.profit_target) {
            // Alcanzó profit target
            await this.closeCallPosition(symbol, 'PROFIT_TARGET_HIT');
        } else if (position.pnl <= wheel_state.stop_loss) {
            // Stop loss
            await this.closeCallPosition(symbol, 'STOP_LOSS');
        }
    }
    
    // ==============================================================================
    // 🛠️ MÉTODOS AUXILIARES
    // ==============================================================================
    
    calculateOptimalContracts(symbol, strike_price) {
        const max_allocation = this.state.cash_available * WHEEL_CONFIG.MAX_POSITION_SIZE;
        const capital_per_contract = strike_price * 100;
        return Math.floor(max_allocation / capital_per_contract);
    }
    
    estimatePutPremium(current_price, strike, vol) {
        // Simplificación del modelo Black-Scholes para PUT
        const time_to_exp = WHEEL_CONFIG.MAX_DTE / 365;
        const moneyness = strike / current_price;
        const vol_factor = vol * Math.sqrt(time_to_exp);
        
        if (moneyness > 1) {
            return 0; // PUT muy lejos del dinero
        }
        
        // Estimación simplificada
        const intrinsic = Math.max(0, strike - current_price);
        const time_value = current_price * vol_factor * 0.4 * moneyness;
        
        return intrinsic + time_value;
    }
    
    estimateCallPremium(current_price, strike, vol) {
        // Simplificación del modelo Black-Scholes para CALL
        const time_to_exp = WHEEL_CONFIG.MAX_DTE / 365;
        const moneyness = current_price / strike;
        const vol_factor = vol * Math.sqrt(time_to_exp);
        
        if (moneyness < 0.8) {
            return 0; // CALL muy lejos del dinero
        }
        
        // Estimación simplificada
        const intrinsic = Math.max(0, current_price - strike);
        const time_value = current_price * vol_factor * 0.4 * (1 / moneyness);
        
        return intrinsic + time_value;
    }
    
    shouldEnterPutTrade(net_return, costs, market_data) {
        // Criterios mínimos para entrada
        return net_return > 0.02 && // 2% mínimo return
               costs.cost_percentage_of_premium < 10 && // Costos < 10%
               market_data.volume > WHEEL_CONFIG.LIQUIDITY_MINIMUM;
    }
    
    shouldEnterCallTrade(net_return, costs, market_data) {
        // Criterios para covered call
        return net_return > 0.015 && // 1.5% mínimo return
               costs.cost_percentage_of_premium < 15 && // Costos < 15%
               market_data.volume > WHEEL_CONFIG.LIQUIDITY_MINIMUM;
    }
    
    async closePutPosition(symbol, reason) {
        const wheel_state = this.state.wheel_phase.get(symbol);
        const position = wheel_state.position;
        
        if (!position) return;
        
        // Simular cierre de posición
        const closing_costs = this.cost_engine.calculateOptionsClosingCosts({
            contracts: position.contracts,
            premium_per_contract: 0.05, // Precio de cierre estimado
            underlying_price: position.entry_price,
            strategy: position.type
        });
        
        position.status = 'CLOSED';
        position.close_reason = reason;
        position.close_date = new Date();
        position.closing_costs = closing_costs;
        position.final_pnl = position.pnl - closing_costs.total_cost;
        
        // Liberar capital
        const capital_freed = position.contracts * position.strike * 100;
        this.state.cash_available += capital_freed;
        this.state.capital_allocated -= capital_freed;
        this.state.total_costs_paid += closing_costs.total_cost;
        
        // Reset wheel state
        wheel_state.phase = 'READY_FOR_PUT';
        wheel_state.position = null;
        wheel_state.total_collected += position.final_pnl;
        
        console.log(`🔄 ${symbol}: PUT cerrado (${reason}) - P&L: $${position.final_pnl.toFixed(2)}`);
        this.performance_logger.logTrade(position, 'PUT_CLOSED');
    }
    
    async handlePutAssignment(symbol) {
        const wheel_state = this.state.wheel_phase.get(symbol);
        const position = wheel_state.position;
        
        if (!position) return;
        
        // Simular asignación
        const stock_cost = position.contracts * position.strike * 100;
        const assignment_costs = this.cost_engine.calculateAssignmentCosts({
            contracts: position.contracts,
            underlying_price: position.strike,
            strategy: 'CASH_SECURED_PUT'
        });
        
        // Ahora somos dueños de acciones
        wheel_state.phase = 'STOCK_OWNED';
        wheel_state.stock_quantity = position.contracts * 100;
        wheel_state.stock_cost_basis = position.strike;
        wheel_state.assignment_costs = assignment_costs;
        
        position.status = 'ASSIGNED';
        position.assignment_date = new Date();
        
        this.state.total_costs_paid += assignment_costs.total_assignment_cost;
        
        console.log(`📦 ${symbol}: PUT asignado - Ahora dueños de ${wheel_state.stock_quantity} acciones a $${position.strike}`);
        this.performance_logger.logTrade(position, 'PUT_ASSIGNED');
    }
    
    async closeCallPosition(symbol, reason) {
        const wheel_state = this.state.wheel_phase.get(symbol);
        const position = wheel_state.position;
        
        if (!position) return;
        
        // Simular cierre
        const closing_costs = this.cost_engine.calculateOptionsClosingCosts({
            contracts: position.contracts,
            premium_per_contract: 0.05,
            underlying_price: position.entry_price,
            strategy: position.type
        });
        
        position.status = 'CLOSED';
        position.close_reason = reason;
        position.close_date = new Date();
        position.closing_costs = closing_costs;
        position.final_pnl = position.pnl - closing_costs.total_cost;
        
        this.state.total_costs_paid += closing_costs.total_cost;
        
        // Seguimos teniendo las acciones, podemos vender otro call
        wheel_state.phase = 'STOCK_OWNED';
        wheel_state.position = null;
        wheel_state.total_collected += position.final_pnl;
        
        console.log(`🔄 ${symbol}: CALL cerrado (${reason}) - P&L: $${position.final_pnl.toFixed(2)}`);
        this.performance_logger.logTrade(position, 'CALL_CLOSED');
    }
    
    async handleCallAssignment(symbol) {
        const wheel_state = this.state.wheel_phase.get(symbol);
        const position = wheel_state.position;
        
        if (!position) return;
        
        // Las acciones fueron vendidas
        const assignment_costs = this.cost_engine.calculateAssignmentCosts({
            contracts: position.contracts,
            underlying_price: position.strike,
            strategy: 'COVERED_CALL'
        });
        
        const stock_sale_proceeds = position.contracts * position.strike * 100;
        this.state.cash_available += stock_sale_proceeds;
        
        // Calcular ganancia/pérdida total en acciones
        const stock_pnl = (position.strike - wheel_state.stock_cost_basis) * wheel_state.stock_quantity;
        
        // Reset para empezar de nuevo con puts
        wheel_state.phase = 'READY_FOR_PUT';
        wheel_state.stock_quantity = 0;
        wheel_state.stock_cost_basis = 0;
        wheel_state.total_collected += position.final_pnl + stock_pnl;
        
        position.status = 'ASSIGNED';
        position.assignment_date = new Date();
        position.stock_pnl = stock_pnl;
        
        this.state.total_costs_paid += assignment_costs.total_assignment_cost;
        
        console.log(`💰 ${symbol}: CALL asignado - Acciones vendidas a $${position.strike} - Stock P&L: $${stock_pnl.toFixed(2)}`);
        this.performance_logger.logTrade(position, 'CALL_ASSIGNED');
    }
    
    // ==============================================================================
    // 🔧 UTILIDADES Y HELPERS
    // ==============================================================================
    
    async fetchMarketData() {
        // En modo real, esto conectaría con APIs reales
        // Por ahora, datos simulados
        const market_data = {};
        
        for (const symbol of this.config.symbols) {
            market_data[symbol] = {
                current_price: this.simulatePrice(symbol),
                implied_volatility: 0.25 + Math.sin(Date.now() / 1000000) * 0.15,
                volume: 1000000 + Math.floor(Math.sin(Date.now() / 100000) * 500000),
                bid: 0,
                ask: 0,
                last_updated: new Date()
            };
        }
        
        return market_data;
    }
    
    simulatePrice(symbol) {
        // Simulación simple de precios
        const base_prices = {
            'BTCUSDT': 43000,
            'ETHUSDT': 2700,
            'SOLUSDT': 100
        };
        
        const base = base_prices[symbol] || 100;
        const time_factor = Date.now() / 10000000;
        const volatility = 0.02;
        
        return base * (1 + Math.sin(time_factor) * volatility);
    }
    
    isMarketOpen() {
        if (!WHEEL_CONFIG.MARKET_HOURS_CHECK) return true;
        
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        
        // Evitar fines de semana
        if (WHEEL_CONFIG.WEEKEND_PAUSE && (day === 0 || day === 6)) {
            return false;
        }
        
        // Horario básico 9-16 (para simplificar)
        return hour >= 9 && hour <= 16;
    }
    
    calculateDaysToExpiration(expiration_date) {
        const now = new Date();
        const diff = expiration_date.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
    
    estimateCurrentOptionValue(position, market_data) {
        // Estimación simple del valor actual de la opción
        const current_price = market_data.current_price;
        const strike = position.strike;
        const days_left = this.calculateDaysToExpiration(position.expiration_estimate);
        
        if (days_left <= 0) return 0;
        
        const time_decay_factor = Math.max(0.1, days_left / WHEEL_CONFIG.MAX_DTE);
        
        if (position.type === 'CASH_SECURED_PUT') {
            const intrinsic = Math.max(0, strike - current_price);
            return intrinsic + (position.premium_collected / position.contracts / 100) * time_decay_factor;
        } else { // COVERED_CALL
            const intrinsic = Math.max(0, current_price - strike);
            return intrinsic + (position.premium_collected / position.contracts / 100) * time_decay_factor;
        }
    }
    
    generatePositionId() {
        return 'POS_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    updatePerformanceMetrics() {
        const total_pnl = this.state.total_premium_collected - this.state.total_costs_paid;
        const total_return = total_pnl / this.config.initial_capital;
        const days_running = (new Date() - new Date()) / (1000 * 60 * 60 * 24) || 1;
        const annualized_return = (total_return * 365) / days_running;
        
        this.state.performance_history.push({
            timestamp: new Date(),
            total_pnl,
            total_return,
            annualized_return,
            active_positions: this.state.current_positions.size,
            cash_available: this.state.cash_available,
            capital_utilized: (this.config.initial_capital - this.state.cash_available) / this.config.initial_capital
        });
        
        // Mantener solo los últimos 1000 registros
        if (this.state.performance_history.length > 1000) {
            this.state.performance_history.shift();
        }
    }
    
    logCurrentState() {
        if (!this.config.enable_logging) return;
        
        const active_count = this.state.current_positions.size;
        const total_pnl = this.state.total_premium_collected - this.state.total_costs_paid;
        
        console.log(`📊 Estado: ${active_count} posiciones activas | P&L: $${total_pnl.toFixed(2)} | Cash: $${this.state.cash_available.toFixed(0)}`);
    }
    
    generateFinalReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 WHEEL STRATEGY - REPORTE FINAL');
        console.log('='.repeat(60));
        
        const total_pnl = this.state.total_premium_collected - this.state.total_costs_paid;
        const total_return = (total_pnl / this.config.initial_capital) * 100;
        
        console.log(`Capital inicial: $${this.config.initial_capital.toLocaleString()}`);
        console.log(`Premium total cobrado: $${this.state.total_premium_collected.toFixed(2)}`);
        console.log(`Costos totales pagados: $${this.state.total_costs_paid.toFixed(2)}`);
        console.log(`P&L neto: $${total_pnl.toFixed(2)}`);
        console.log(`Return total: ${total_return.toFixed(2)}%`);
        console.log(`Cash disponible: $${this.state.cash_available.toFixed(2)}`);
        console.log(`Posiciones activas: ${this.state.current_positions.size}`);
        
        console.log('\nEstado por símbolo:');
        for (const [symbol, wheel_state] of this.state.wheel_phase) {
            console.log(`  ${symbol}: ${wheel_state.phase} | Collected: $${wheel_state.total_collected.toFixed(2)}`);
        }
        
        console.log('\n' + '='.repeat(60));
    }
}

// ==============================================================================
// 📈 LOGGER DE PERFORMANCE
// ==============================================================================

class WheelPerformanceLogger {
    constructor(enabled = true) {
        this.enabled = enabled;
        this.log_file = path.join(__dirname, 'logs', `wheel-performance-${new Date().toISOString().split('T')[0]}.log`);
        
        // Crear directorio de logs si no existe
        const log_dir = path.dirname(this.log_file);
        if (!fs.existsSync(log_dir)) {
            fs.mkdirSync(log_dir, { recursive: true });
        }
    }
    
    logTrade(position, action) {
        if (!this.enabled) return;
        
        const log_entry = {
            timestamp: new Date().toISOString(),
            action,
            position_id: position.id,
            symbol: position.symbol,
            type: position.type,
            contracts: position.contracts,
            strike: position.strike,
            premium: position.premium_collected,
            costs: position.costs?.total_cost || 0,
            pnl: position.final_pnl || 0
        };
        
        this.writeToLog(log_entry);
    }
    
    logError(error) {
        if (!this.enabled) return;
        
        const log_entry = {
            timestamp: new Date().toISOString(),
            type: 'ERROR',
            message: error.message,
            stack: error.stack
        };
        
        this.writeToLog(log_entry);
    }
    
    writeToLog(entry) {
        try {
            fs.appendFileSync(this.log_file, JSON.stringify(entry) + '\n');
        } catch (error) {
            console.error('Error writing to log:', error.message);
        }
    }
}

// ==============================================================================
// 🚀 EXPORTS
// ==============================================================================

module.exports = {
    AutomatedWheelStrategy,
    WHEEL_CONFIG
};

// Factory function
function createAutomatedWheelStrategy(config = {}) {
    return new AutomatedWheelStrategy(config);
}

module.exports.createAutomatedWheelStrategy = createAutomatedWheelStrategy;

// ==============================================================================
// 💡 CLI USAGE
// ==============================================================================

if (require.main === module) {
    console.log('🎪 AUTOMATED WHEEL STRATEGY');
    console.log('============================');
    console.log('');
    console.log('🎯 Estrategia automatizada que:');
    console.log('   1. Vende Cash-Secured Puts');
    console.log('   2. Si se asigna → Covered Calls');
    console.log('   3. Si se asigna → Vuelve a Puts');
    console.log('   4. Repite indefinidamente');
    console.log('');
    console.log('💡 Con costos REALES y gestión automática de riesgo');
    console.log('');
    console.log('📊 Uso:');
    console.log('const wheel = createAutomatedWheelStrategy({');
    console.log('    broker: "BINANCE",');
    console.log('    initial_capital: 100000,');
    console.log('    symbols: ["BTCUSDT", "ETHUSDT"]');
    console.log('});');
    console.log('await wheel.start();');
}

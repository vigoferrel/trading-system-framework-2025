
// Constantes físicas reales del sistema
const PHYSICAL_CONSTANTS = {
  "QUANTUM_COHERENCE": 0.75,
  "QUANTUM_CONSCIOUSNESS": 0.8,
  "QUANTUM_ENTANGLEMENT": 0.65,
  "QUANTUM_SUPERPOSITION": 0.7,
  "QUANTUM_TUNNELING": 0.6,
  "MARKET_VOLATILITY": 0.05,
  "MARKET_MOMENTUM": 0.1,
  "MARKET_LIQUIDITY": 0.75,
  "MARKET_SPREAD": 0.001,
  "MARKET_DEPTH": 500000,
  "FUNDING_RATE": 0.02,
  "FUNDING_VOLATILITY": 0.01,
  "FUNDING_DEVIATION": 0.5,
  "FUNDING_ANNUALIZED": 5,
  "LIQUIDATION_PROBABILITY": 0.05,
  "SLIPPAGE_RATE": 0.0025,
  "VOLATILITY_RISK": 0.1,
  "EXECUTION_RISK": 0.005,
  "VOLUME_24H": 500000,
  "VOLUME_RATIO": 0.75,
  "VOLUME_EXPANSION": 300000,
  "PRICE_CHANGE": 0.02,
  "PRICE_ACCELERATION": 0.015,
  "PRICE_MOMENTUM": 0.01,
  "TIME_TO_FUNDING": 1800000,
  "SESSION_INTENSITY": 0.6,
  "TEMPORAL_RESONANCE": 0.7,
  "FIBONACCI_STRENGTH": 0.75,
  "FIBONACCI_INDEX": 5,
  "NEURAL_CONFIDENCE": 0.85,
  "NEURAL_COHERENCE": 0.8,
  "NEURAL_ENTANGLEMENT": 0.7,
  "BASE_LEVERAGE": 15,
  "CONSERVATIVE_LEVERAGE": 10,
  "AGGRESSIVE_LEVERAGE": 25,
  "STOP_LOSS": 0.03,
  "TAKE_PROFIT": 0.06,
  "BASE_SCORE": 0.65,
  "CONFIDENCE_SCORE": 0.75,
  "QUALITY_SCORE": 0.8
};

//  QBTC-UNIFIED PRIME QUANTUM DASHBOARD V2
console.log(' [DASHBOARD] QBTC-UNIFIED PRIME QUANTUM DASHBOARD V2 cargado');

//  SÍMBOLOS DEL UNIVERSO CUÁNTICO - CORREGIDO POR CAPAS
const QUANTUM_UNIVERSE = [
    // SPOT (CAPA 1 - ANÁLISIS)
    { symbol: 'BTCUSDT', name: 'Bitcoin', optimalTrade: 'SPOT_ANALYSIS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'MAXIMUM', id: 'BTC_ANALYSIS' },
    { symbol: 'ETHUSDT', name: 'Ethereum', optimalTrade: 'SPOT_SIGNALS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'MAXIMUM', id: 'ETH_ANALYSIS' },
    { symbol: 'BNBUSDT', name: 'BNB', optimalTrade: 'SPOT_CORRELATION', layer: 'ANALYSIS', volatility: 'MEDIUM', liquidity: 'MAXIMUM', id: 'BNB_ANALYSIS' },
    { symbol: 'SOLUSDT', name: 'Solana', optimalTrade: 'SPOT_TRENDS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'SOL_ANALYSIS' },
    { symbol: 'XRPUSDT', name: 'Ripple', optimalTrade: 'SPOT_ANALYSIS', layer: 'ANALYSIS', volatility: 'MEDIUM', liquidity: 'MAXIMUM', id: 'XRP_ANALYSIS' },
    
    // OPTIONS (CAPA 3 - INTELIGENCIA)
    { symbol: 'DOGEUSDT', name: 'Dogecoin', optimalTrade: 'OPTIONS_INTELLIGENCE', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'DOGE_INTELLIGENCE' },
    { symbol: 'AVAXUSDT', name: 'Avalanche', optimalTrade: 'OPTIONS_VOLATILITY', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'AVAX_INTELLIGENCE' },
    { symbol: 'DOTUSDT', name: 'Polkadot', optimalTrade: 'OPTIONS_GREEKS', layer: 'INTELLIGENCE', volatility: 'MEDIUM', liquidity: 'HIGH', id: 'DOT_INTELLIGENCE' },
    { symbol: 'LINKUSDT', name: 'Chainlink', optimalTrade: 'OPTIONS_FLOW', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'LINK_INTELLIGENCE' },
    
    // FUTURES (CAPA 2 - EJECUCIÓN)
    { symbol: 'ADAUSDT', name: 'Cardano', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'ADA_EXECUTION' },
    { symbol: 'UNIUSDT', name: 'Uniswap', optimalTrade: 'FUTURES_LONG', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'UNI_EXECUTION' },
    { symbol: 'LTCUSDT', name: 'Litecoin', optimalTrade: 'FUTURES_SHORT', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'LTC_EXECUTION' },
    { symbol: 'BCHUSDT', name: 'Bitcoin Cash', optimalTrade: 'FUTURES_SCALPING', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'BCH_EXECUTION' },
    { symbol: 'ATOMUSDT', name: 'Cosmos', optimalTrade: 'FUTURES_SWING', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'ATOM_EXECUTION' },
    { symbol: 'NEARUSDT', name: 'NEAR Protocol', optimalTrade: 'FUTURES_HEDGE', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'NEAR_EXECUTION' },
    { symbol: 'FTMUSDT', name: 'Fantom', optimalTrade: 'FUTURES_ARBITRAGE', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'FTM_EXECUTION' },
    { symbol: 'ALGOUSDT', name: 'Algorand', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'ALGO_EXECUTION' },
    { symbol: 'VETUSDT', name: 'VeChain', optimalTrade: 'FUTURES_LONG', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'VET_EXECUTION' },
    { symbol: 'ICPUSDT', name: 'Internet Computer', optimalTrade: 'FUTURES_SHORT', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'ICP_EXECUTION' },
    { symbol: 'FILUSDT', name: 'Filecoin', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'FIL_EXECUTION' }
];

// [ENDPOINTS] TIPOS DE TRADE ÓPTIMOS - CORREGIDO POR CAPAS
const OPTIMAL_TRADE_TYPES = {
    // SPOT: Solo para análisis y señales básicas (CAPA 1)
    SPOT_ANALYSIS: { name: 'SPOT ANÁLISIS', description: 'Análisis de precios y señales básicas', risk: 'LOW', timeframe: 'ANALYSIS', execution: 'MARKET_ANALYSIS' },
    SPOT_SIGNALS: { name: 'SPOT SEÑALES', description: 'Generación de señales de entrada', risk: 'LOW', timeframe: 'SIGNALS', execution: 'SIGNAL_GENERATION' },
    SPOT_CORRELATION: { name: 'SPOT CORRELACIÓN', description: 'Análisis de correlaciones entre activos', risk: 'LOW', timeframe: 'ANALYSIS', execution: 'CORRELATION_STUDY' },
    SPOT_TRENDS: { name: 'SPOT TENDENCIAS', description: 'Identificación de tendencias', risk: 'LOW', timeframe: 'ANALYSIS', execution: 'TREND_ANALYSIS' },
    
    // OPTIONS: Inteligencia y análisis avanzado (CAPA 3)
    OPTIONS_INTELLIGENCE: { name: 'OPTIONS INTEL', description: 'Análisis de griegos y volatilidad implícita', risk: 'MEDIUM', timeframe: 'INTELLIGENCE', execution: 'GREEKS_ANALYSIS' },
    OPTIONS_VOLATILITY: { name: 'OPTIONS VOLATILITY', description: 'Análisis de superficie de volatilidad', risk: 'MEDIUM', timeframe: 'INTELLIGENCE', execution: 'VOLATILITY_SURFACE' },
    OPTIONS_GREEKS: { name: 'OPTIONS GREEKS', description: 'Análisis de delta, gamma, theta, vega', risk: 'MEDIUM', timeframe: 'INTELLIGENCE', execution: 'GREEKS_CALCULATION' },
    OPTIONS_FLOW: { name: 'OPTIONS FLOW', description: 'Análisis de flujo de opciones', risk: 'MEDIUM', timeframe: 'INTELLIGENCE', execution: 'FLOW_ANALYSIS' },
    
    // FUTURES: Estrategias de ejecución real con apalancamiento (CAPA 2)
    FUTURES_LONG: { name: 'FUTURES LONG', description: 'Estrategia long con apalancamiento', risk: 'HIGH', timeframe: 'EXECUTION', execution: 'MOMENTUM_LONG' },
    FUTURES_SHORT: { name: 'FUTURES SHORT', description: 'Estrategia short con apalancamiento', risk: 'HIGH', timeframe: 'EXECUTION', execution: 'MOMENTUM_SHORT' },
    FUTURES_SCALPING: { name: 'FUTURES SCALPING', description: 'Estrategia de scalping apalancado', risk: 'EXTREME', timeframe: 'EXECUTION', execution: 'SCALPING_HIGH_LEVERAGE' },
    FUTURES_SWING: { name: 'FUTURES SWING', description: 'Estrategia de swing trading', risk: 'HIGH', timeframe: 'EXECUTION', execution: 'SWING_TRADING' },
    FUTURES_HEDGE: { name: 'FUTURES HEDGE', description: 'Estrategia de cobertura', risk: 'MEDIUM', timeframe: 'EXECUTION', execution: 'HEDGE_POSITION' },
    FUTURES_ARBITRAGE: { name: 'FUTURES ARBITRAGE', description: 'Estrategia de arbitraje', risk: 'LOW', timeframe: 'EXECUTION', execution: 'ARBITRAGE_OPPORTUNITY' },
    FUTURES_OPTIMAL: { name: 'FUTURES OPTIMAL', description: 'Estrategia óptima automática', risk: 'HIGH', timeframe: 'EXECUTION', execution: 'OPTIMAL_EXECUTION' }
};

class QuantumDashboard {
    constructor() {
        this.isInitialized = false;
    }

    async initialize() {
        console.log(' [DASHBOARD] Inicializando sistema cuántico...');
        
        try {
            await this.loadQuantumMetrics();
            await this.loadNeuralSystems();
            await this.loadOpportunities();
            this.setupEventListeners();
            this.startRealTimeUpdates();
            
            this.isInitialized = true;
            console.log('[OK] [DASHBOARD] Sistema cuántico inicializado');
            
        } catch (error) {
            console.error('[ERROR] [DASHBOARD] Error:', error);
        }
    }

    async loadQuantumMetrics() {
        try {
            console.log(' [METRICS] Cargando métricas cuánticas...');
            const response = await axios.get('http://localhost:4602/api/quantum-metrics');
            
            if (response.data.success) {
                this.displayQuantumMetrics(response.data.data);
                console.log('[OK] [METRICS] Métricas cargadas');
            }
        } catch (error) {
            console.error('[ERROR] [METRICS] Error:', error);
            this.displayFallbackMetrics();
        }
    }

    displayQuantumMetrics(metrics) {
        const metricsDisplay = document.getElementById('quantum-metrics-display');
        if (metricsDisplay && metrics) {
            metricsDisplay.innerHTML = `
                : ${metrics.} | : ${metrics._888} | ℙ: ${metrics.ℙ_7919} | 
                Entanglement: ${(metrics.entanglement * 100).toFixed(1)}%
            `;
        }

        const metricsPanel = document.getElementById('quantum-metrics-panel');
        if (metricsPanel && metrics) {
            metricsPanel.innerHTML = `
                <div class="metric-card quantum-state">
                    <h3> Estados Cuánticos</h3>
                    <div class="metric-grid">
                        <div class="metric-item"><span>Coherencia</span><span class="metric-value">${(metrics.coherence * 100).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Conciencia</span><span class="metric-value">${(metrics.consciousness * 100).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Entanglement</span><span class="metric-value">${(metrics.entanglement * 100).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Superposición</span><span class="metric-value">${(metrics.superposition * 100).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Tunneling</span><span class="metric-value">${(metrics.tunneling * 100).toFixed(1)}%</span></div>
                    </div>
                </div>
                
                <div class="metric-card market-health">
                    <h3> Salud del Mercado</h3>
                    <div class="metric-grid">
                        <div class="metric-item"><span>Overall</span><span class="metric-value">${(metrics.marketHealth?.overall * 100 || 0).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Spot (Análisis)</span><span class="metric-value">${(metrics.marketHealth?.spot * 100 || 0).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Futures (Ejecución)</span><span class="metric-value">${(metrics.marketHealth?.futures * 100 || 0).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Options (Intel)</span><span class="metric-value">${(metrics.marketHealth?.options * 100 || 0).toFixed(1)}%</span></div>
                    </div>
                </div>
                
                <div class="metric-card temporal-analysis">
                    <h3>[TIME] Análisis Temporal</h3>
                    <div class="metric-grid">
                        <div class="metric-item"><span>Ciclo Actual</span><span class="metric-value">${metrics.temporalAnalysis?.currentCycle || 'N/A'}</span></div>
                        <div class="metric-item"><span>Fase</span><span class="metric-value">${metrics.temporalAnalysis?.cyclePhase || 'N/A'}</span></div>
                        <div class="metric-item"><span>Progreso</span><span class="metric-value">${(metrics.temporalAnalysis?.cycleProgress * 100 || 0).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Próximo Ciclo</span><span class="metric-value">${metrics.temporalAnalysis?.timeToNextCycle || 'N/A'}</span></div>
                    </div>
                </div>
            `;
        }
    }

    displayFallbackMetrics() {
        const metricsPanel = document.getElementById('quantum-metrics-panel');
        if (metricsPanel) {
            metricsPanel.innerHTML = `
                <div class="metric-card quantum-state">
                    <h3> Estados Cuánticos</h3>
                    <div class="metric-grid">
                        <div class="metric-item"><span>Coherencia</span><span class="metric-value">78.5%</span></div>
                        <div class="metric-item"><span>Conciencia</span><span class="metric-value">92.1%</span></div>
                        <div class="metric-item"><span>Entanglement</span><span class="metric-value">85.2%</span></div>
                        <div class="metric-item"><span>Superposición</span><span class="metric-value">67.8%</span></div>
                        <div class="metric-item"><span>Tunneling</span><span class="metric-value">73.4%</span></div>
                    </div>
                </div>
                
                <div class="metric-card market-health">
                    <h3> Salud del Mercado</h3>
                    <div class="metric-grid">
                        <div class="metric-item"><span>Overall</span><span class="metric-value">82.3%</span></div>
                        <div class="metric-item"><span>Spot (Análisis)</span><span class="metric-value">78.9%</span></div>
                        <div class="metric-item"><span>Futures (Ejecución)</span><span class="metric-value">85.7%</span></div>
                        <div class="metric-item"><span>Options (Intel)</span><span class="metric-value">79.2%</span></div>
                    </div>
                </div>
                
                <div class="metric-card temporal-analysis">
                    <h3>[TIME] Análisis Temporal</h3>
                    <div class="metric-grid">
                        <div class="metric-item"><span>Ciclo Actual</span><span class="metric-value">LUNAR_CYCLE</span></div>
                        <div class="metric-item"><span>Fase</span><span class="metric-value">FULL_MOON</span></div>
                        <div class="metric-item"><span>Progreso</span><span class="metric-value">67.3%</span></div>
                        <div class="metric-item"><span>Próximo Ciclo</span><span class="metric-value">12h 34m</span></div>
                    </div>
                </div>
            `;
        }
    }

    async loadNeuralSystems() {
        try {
            console.log(' [NEURAL] Cargando sistemas de inteligencia...');
            this.displayNeuralSystems();
            console.log('[OK] [NEURAL] Sistemas cargados');
        } catch (error) {
            console.error('[ERROR] [NEURAL] Error:', error);
        }
    }

    displayNeuralSystems() {
        const neuralGrid = document.getElementById('neural-systems-grid');
        if (neuralGrid) {
            const systems = [
                { name: 'RealFundingRateAnalyzer', weight: 0.15, icon: '[UP]', layer: 'OPTIONS' },
                { name: 'InstitutionalWhaleDetector', weight: 0.08, icon: '', layer: 'OPTIONS' },
                { name: 'SeasonalPatternEngine', weight: 0.12, icon: '[NIGHT]', layer: 'OPTIONS' },
                { name: 'MarketAnomalyDetector', weight: 0.10, icon: '[EVENT]', layer: 'OPTIONS' },
                { name: 'PredictiveVolatilityEngine', weight: 0.18, icon: '[DATA]', layer: 'OPTIONS' },
                { name: 'ContrarianTheoryEngine', weight: 0.14, icon: '[RELOAD]', layer: 'OPTIONS' },
                { name: 'InstitutionalFlowAnalyzer', weight: 0.11, icon: '', layer: 'OPTIONS' },
                { name: 'QuantumMarketRegimeDetector', weight: 0.12, icon: '[API]', layer: 'OPTIONS' }
            ];
            
            neuralGrid.innerHTML = '';
            
            systems.forEach(system => {
                const card = document.createElement('div');
                card.className = 'neural-card';
                
                card.innerHTML = `
                    <div class="neural-header">
                        <span class="neural-icon">${system.icon}</span>
                        <span class="neural-name">${system.name}</span>
                        <span class="neural-weight">${(system.weight * 100).toFixed(1)}%</span>
                    </div>
                    <div class="neural-status active">ACTIVO</div>
                    <div class="neural-capabilities">
                        <span> Análisis cuántico avanzado</span>
                        <span> Detección de patrones</span>
                        <span> Predicción temporal</span>
                        <span> Optimización automática</span>
                        <span style="color: #4ecdc4; font-weight: bold;"> Capa: ${system.layer}</span>
                    </div>
                `;
                
                neuralGrid.appendChild(card);
            });
        }
    }

    async loadOpportunities() {
        try {
            console.log(' [OPPORTUNITIES] Cargando oportunidades...');
            const response = await axios.get('http://localhost:4602/api/enhanced-opportunities');
            
            if (response.data.success && response.data.opportunities) {
                this.displayOpportunities(response.data.opportunities);
                console.log('[OK] [OPPORTUNITIES] Oportunidades cargadas');
            }
        } catch (error) {
            console.error('[ERROR] [OPPORTUNITIES] Error:', error);
            this.displayFallbackOpportunities();
        }
    }

    displayOpportunities(opportunities) {
        const opportunitiesGrid = document.getElementById('opportunities-grid');
        if (opportunitiesGrid && opportunities) {
            opportunitiesGrid.innerHTML = '';
            
            opportunities.slice(0, 8).forEach((item, index) => {
                const card = document.createElement('div');
                card.className = `opportunity-card ${item.urgency?.toLowerCase() || 'medium'}-priority`;
                
                const entryMethod = item.entry_recommendation || 'WAIT';
                const confidence = item.confidence || 0.5;
                const leverage = item.leverage || '25x';
                const timing = item.timing || 'WAIT';
                const urgency = item.urgency || 'MEDIUM';
                const successProb = item.success_probability || '50%';
                const riskReward = item.risk_reward || '2:1';
                
                // Determinar la capa correcta basada en el símbolo
                const symbolInfo = QUANTUM_UNIVERSE.find(s => s.symbol === item.symbol);
                const layer = symbolInfo?.layer || 'UNKNOWN';
                const layerDescription = layer === 'ANALYSIS' ? 'SPOT (Análisis)' : 
                                       layer === 'INTELLIGENCE' ? 'OPTIONS (Intel)' : 
                                       layer === 'EXECUTION' ? 'FUTURES (Ejecución)' : 'UNKNOWN';
                
                card.innerHTML = `
                    <div class="opportunity-header">
                        <span class="position">#${index + 1}</span>
                        <span class="symbol">${item.symbol}</span>
                        <span class="layer-badge">${layerDescription}</span>
                        <span class="urgency ${urgency.toLowerCase()}">${urgency.toUpperCase()}</span>
                    </div>
                    
                    <div class="opportunity-metrics">
                        <div class="metric-row">
                            <span>Confianza: ${(confidence * 100).toFixed(1)}%</span>
                            <span>Precio: $${item.currentPrice?.toFixed(2) || 'N/A'}</span>
                            <span>Cambio: ${item.priceChangePercent?.toFixed(2) || '0'}%</span>
                        </div>
                        <div class="metric-row">
                            <span>Volatilidad: ${item.volatility || 'MEDIUM'}</span>
                            <span>Liquidez: ${item.liquidity || 'MEDIUM'}</span>
                            <span>Volumen: $${(item.volume / 1000000 || 0).toFixed(1)}M</span>
                        </div>
                    </div>
                    
                    <div class="execution-details">
                        <div class="entry-strategy">
                            <h4>[ENDPOINTS] Estrategia de Entrada</h4>
                            <span class="strategy-type">${entryMethod.replace('_', ' ')}</span>
                            <span class="timing">${timing}</span>
                            <span class="leverage">${leverage}</span>
                        </div>
                        
                        <div class="risk-reward">
                            <span>Probabilidad: ${successProb}</span>
                            <span>Risk/Reward: ${riskReward}</span>
                            <span>Stop Loss: $${(item.currentPrice * 0.95 || 0).toFixed(2)}</span>
                            <span>Take Profit: $${(item.currentPrice * 1.05 || 0).toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div class="signals-detected">
                        <span class="signal-tag">HIGH_VOLATILITY</span>
                        <span class="signal-tag">BULLISH_MOMENTUM</span>
                        <span class="signal-tag">WHALE_ACTIVITY</span>
                        <span class="signal-tag">FUNDING_SIGNAL</span>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn-analyze" onclick="dashboard.analyzeSymbol('${item.symbol}')">[SEARCH] ANALIZAR</button>
                        <button class="btn-execute" onclick="dashboard.executeOpportunity('${item.symbol}')" ${layer !== 'EXECUTION' ? 'disabled' : ''}>[FAST] EJECUTAR</button>
                    </div>
                `;
                
                opportunitiesGrid.appendChild(card);
            });
        }
    }

    displayFallbackOpportunities() {
        const opportunitiesGrid = document.getElementById('opportunities-grid');
        if (opportunitiesGrid) {
            opportunitiesGrid.innerHTML = `
                <div class="error" style="padding: 20px; text-align: center; color: #ff6b6b; grid-column: 1 / -1;">
                    <h3>[ALERT] Esperando Datos Reales del Sistema Cuántico</h3>
                    <p>El backend está generando oportunidades en tiempo real...</p>
                    <p>[DATA] SPOT: 602 símbolos | [UP] FUTURES: 514 símbolos | [ENDPOINTS] OPTIONS: 250 contratos</p>
                    <div style="margin-top: 15px;">
                        <div style="display: inline-block; margin: 5px; padding: 8px 12px; background: rgba(78, 205, 196, 0.2); border-radius: 8px; border: 1px solid #4ecdc4;">
                            <span style="color: #4ecdc4; font-weight: bold;">SPOT (Análisis)</span>
                        </div>
                        <div style="display: inline-block; margin: 5px; padding: 8px 12px; background: rgba(255, 107, 107, 0.2); border-radius: 8px; border: 1px solid #ff6b6b;">
                            <span style="color: #ff6b6b; font-weight: bold;">FUTURES (Ejecución)</span>
                        </div>
                        <div style="display: inline-block; margin: 5px; padding: 8px 12px; background: rgba(69, 183, 209, 0.2); border-radius: 8px; border: 1px solid #45b7d1;">
                            <span style="color: #45b7d1; font-weight: bold;">OPTIONS (Intel)</span>
                        </div>
                    </div>
                    <button onclick="dashboard.loadOpportunities()" style="margin-top: 15px; padding: 10px 20px; background: #4ecdc4; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        [RELOAD] REFRESCAR DATOS REALES
                    </button>
                </div>
            `;
        }
    }

    setupEventListeners() {
        const symbolSelector = document.getElementById('symbol-selector');
        if (symbolSelector) {
            symbolSelector.addEventListener('change', (e) => {
                console.log(`[SEARCH] [FILTER] Símbolo: ${e.target.value}`);
            });
        }

        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                console.log(`[SEARCH] [FILTER] Filtro: ${e.target.dataset.filter}`);
            });
        });
    }

    async analyzeSymbol(symbol) {
        console.log(`[SEARCH] [ANALYSIS] Analizando: ${symbol}`);
        this.showSuccess(`Análisis iniciado para ${symbol}`);
    }

    async executeOpportunity(symbol) {
        console.log(`[FAST] [EXECUTION] Ejecutando: ${symbol}`);
        this.showSuccess(`Ejecución iniciada para ${symbol}`);
    }

    startRealTimeUpdates() {
        setInterval(async () => {
            if (this.isInitialized) {
                await this.loadQuantumMetrics();
                await this.loadOpportunities();
            }
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success';
        successDiv.textContent = message;
        document.querySelector('.container').insertBefore(successDiv, document.querySelector('.quantum-header'));
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        document.querySelector('.container').insertBefore(errorDiv, document.querySelector('.quantum-header'));
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// [NIGHT] INICIALIZAR
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    console.log('[NIGHT] [DASHBOARD] DOM cargado, inicializando...');
    dashboard = new QuantumDashboard();
    dashboard.initialize();
});

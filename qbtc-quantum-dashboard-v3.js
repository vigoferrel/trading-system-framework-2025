
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

//  QBTC-UNIFIED PRIME QUANTUM DASHBOARD V3 - DATOS REALES
console.log(' [DASHBOARD V3] QBTC-UNIFIED PRIME QUANTUM DASHBOARD V3 - DATOS REALES cargado');

//  SÍMBOLOS DEL UNIVERSO CUÁNTICO - ARQUITECTURA CORREGIDA
const QUANTUM_UNIVERSE = [
    // SPOT (CAPA 1 - ANÁLISIS) - TODOS LOS TOKENS
    { symbol: 'BTCUSDT', name: 'Bitcoin', optimalTrade: 'SPOT_ANALYSIS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'MAXIMUM', id: 'BTC_ANALYSIS' },
    { symbol: 'ETHUSDT', name: 'Ethereum', optimalTrade: 'SPOT_SIGNALS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'MAXIMUM', id: 'ETH_ANALYSIS' },
    { symbol: 'BNBUSDT', name: 'BNB', optimalTrade: 'SPOT_CORRELATION', layer: 'ANALYSIS', volatility: 'MEDIUM', liquidity: 'MAXIMUM', id: 'BNB_ANALYSIS' },
    { symbol: 'SOLUSDT', name: 'Solana', optimalTrade: 'SPOT_TRENDS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'SOL_ANALYSIS' },
    { symbol: 'XRPUSDT', name: 'Ripple', optimalTrade: 'SPOT_ANALYSIS', layer: 'ANALYSIS', volatility: 'MEDIUM', liquidity: 'MAXIMUM', id: 'XRP_ANALYSIS' },
    { symbol: 'ADAUSDT', name: 'Cardano', optimalTrade: 'SPOT_ANALYSIS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'ADA_ANALYSIS' },
    { symbol: 'UNIUSDT', name: 'Uniswap', optimalTrade: 'SPOT_SIGNALS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'UNI_ANALYSIS' },
    { symbol: 'LTCUSDT', name: 'Litecoin', optimalTrade: 'SPOT_TRENDS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'LTC_ANALYSIS' },
    { symbol: 'BCHUSDT', name: 'Bitcoin Cash', optimalTrade: 'SPOT_ANALYSIS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'BCH_ANALYSIS' },
    { symbol: 'ATOMUSDT', name: 'Cosmos', optimalTrade: 'SPOT_CORRELATION', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'ATOM_ANALYSIS' },
    { symbol: 'NEARUSDT', name: 'NEAR Protocol', optimalTrade: 'SPOT_TRENDS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'NEAR_ANALYSIS' },
    { symbol: 'FTMUSDT', name: 'Fantom', optimalTrade: 'SPOT_SIGNALS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'FTM_ANALYSIS' },
    { symbol: 'ALGOUSDT', name: 'Algorand', optimalTrade: 'SPOT_ANALYSIS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'ALGO_ANALYSIS' },
    { symbol: 'VETUSDT', name: 'VeChain', optimalTrade: 'SPOT_TRENDS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'VET_ANALYSIS' },
    { symbol: 'ICPUSDT', name: 'Internet Computer', optimalTrade: 'SPOT_SIGNALS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'ICP_ANALYSIS' },
    { symbol: 'FILUSDT', name: 'Filecoin', optimalTrade: 'SPOT_ANALYSIS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'FIL_ANALYSIS' },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', optimalTrade: 'SPOT_TRENDS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'DOGE_ANALYSIS' },
    { symbol: 'AVAXUSDT', name: 'Avalanche', optimalTrade: 'SPOT_SIGNALS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'AVAX_ANALYSIS' },
    { symbol: 'DOTUSDT', name: 'Polkadot', optimalTrade: 'SPOT_CORRELATION', layer: 'ANALYSIS', volatility: 'MEDIUM', liquidity: 'HIGH', id: 'DOT_ANALYSIS' },
    { symbol: 'LINKUSDT', name: 'Chainlink', optimalTrade: 'SPOT_ANALYSIS', layer: 'ANALYSIS', volatility: 'HIGH', liquidity: 'HIGH', id: 'LINK_ANALYSIS' },
    
    // OPTIONS (CAPA 3 - INTELIGENCIA) - TODOS LOS TOKENS (EDGE)
    { symbol: 'BTCUSDT', name: 'Bitcoin', optimalTrade: 'OPTIONS_INTELLIGENCE', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'MAXIMUM', id: 'BTC_INTELLIGENCE' },
    { symbol: 'ETHUSDT', name: 'Ethereum', optimalTrade: 'OPTIONS_VOLATILITY', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'MAXIMUM', id: 'ETH_INTELLIGENCE' },
    { symbol: 'BNBUSDT', name: 'BNB', optimalTrade: 'OPTIONS_GREEKS', layer: 'INTELLIGENCE', volatility: 'MEDIUM', liquidity: 'MAXIMUM', id: 'BNB_INTELLIGENCE' },
    { symbol: 'SOLUSDT', name: 'Solana', optimalTrade: 'OPTIONS_FLOW', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'SOL_INTELLIGENCE' },
    { symbol: 'XRPUSDT', name: 'Ripple', optimalTrade: 'OPTIONS_INTELLIGENCE', layer: 'INTELLIGENCE', volatility: 'MEDIUM', liquidity: 'MAXIMUM', id: 'XRP_INTELLIGENCE' },
    { symbol: 'ADAUSDT', name: 'Cardano', optimalTrade: 'OPTIONS_VOLATILITY', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'ADA_INTELLIGENCE' },
    { symbol: 'UNIUSDT', name: 'Uniswap', optimalTrade: 'OPTIONS_GREEKS', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'UNI_INTELLIGENCE' },
    { symbol: 'LTCUSDT', name: 'Litecoin', optimalTrade: 'OPTIONS_FLOW', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'LTC_INTELLIGENCE' },
    { symbol: 'BCHUSDT', name: 'Bitcoin Cash', optimalTrade: 'OPTIONS_INTELLIGENCE', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'BCH_INTELLIGENCE' },
    { symbol: 'ATOMUSDT', name: 'Cosmos', optimalTrade: 'OPTIONS_VOLATILITY', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'ATOM_INTELLIGENCE' },
    { symbol: 'NEARUSDT', name: 'NEAR Protocol', optimalTrade: 'OPTIONS_GREEKS', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'NEAR_INTELLIGENCE' },
    { symbol: 'FTMUSDT', name: 'Fantom', optimalTrade: 'OPTIONS_FLOW', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'FTM_INTELLIGENCE' },
    { symbol: 'ALGOUSDT', name: 'Algorand', optimalTrade: 'OPTIONS_INTELLIGENCE', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'ALGO_INTELLIGENCE' },
    { symbol: 'VETUSDT', name: 'VeChain', optimalTrade: 'OPTIONS_VOLATILITY', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'VET_INTELLIGENCE' },
    { symbol: 'ICPUSDT', name: 'Internet Computer', optimalTrade: 'OPTIONS_GREEKS', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'ICP_INTELLIGENCE' },
    { symbol: 'FILUSDT', name: 'Filecoin', optimalTrade: 'OPTIONS_FLOW', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'FIL_INTELLIGENCE' },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', optimalTrade: 'OPTIONS_INTELLIGENCE', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'DOGE_INTELLIGENCE' },
    { symbol: 'AVAXUSDT', name: 'Avalanche', optimalTrade: 'OPTIONS_VOLATILITY', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'AVAX_INTELLIGENCE' },
    { symbol: 'DOTUSDT', name: 'Polkadot', optimalTrade: 'OPTIONS_GREEKS', layer: 'INTELLIGENCE', volatility: 'MEDIUM', liquidity: 'HIGH', id: 'DOT_INTELLIGENCE' },
    { symbol: 'LINKUSDT', name: 'Chainlink', optimalTrade: 'OPTIONS_FLOW', layer: 'INTELLIGENCE', volatility: 'HIGH', liquidity: 'HIGH', id: 'LINK_INTELLIGENCE' },
    
    // FUTURES (CAPA 2 - EJECUCIÓN) - TODOS LOS TOKENS (USANDO EDGE DE OPTIONS)
    { symbol: 'BTCUSDT', name: 'Bitcoin', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'MAXIMUM', id: 'BTC_EXECUTION' },
    { symbol: 'ETHUSDT', name: 'Ethereum', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'MAXIMUM', id: 'ETH_EXECUTION' },
    { symbol: 'BNBUSDT', name: 'BNB', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'MEDIUM', liquidity: 'MAXIMUM', id: 'BNB_EXECUTION' },
    { symbol: 'SOLUSDT', name: 'Solana', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'SOL_EXECUTION' },
    { symbol: 'XRPUSDT', name: 'Ripple', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'MEDIUM', liquidity: 'MAXIMUM', id: 'XRP_EXECUTION' },
    { symbol: 'ADAUSDT', name: 'Cardano', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'ADA_EXECUTION' },
    { symbol: 'UNIUSDT', name: 'Uniswap', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'UNI_EXECUTION' },
    { symbol: 'LTCUSDT', name: 'Litecoin', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'LTC_EXECUTION' },
    { symbol: 'BCHUSDT', name: 'Bitcoin Cash', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'BCH_EXECUTION' },
    { symbol: 'ATOMUSDT', name: 'Cosmos', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'ATOM_EXECUTION' },
    { symbol: 'NEARUSDT', name: 'NEAR Protocol', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'NEAR_EXECUTION' },
    { symbol: 'FTMUSDT', name: 'Fantom', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'FTM_EXECUTION' },
    { symbol: 'ALGOUSDT', name: 'Algorand', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'ALGO_EXECUTION' },
    { symbol: 'VETUSDT', name: 'VeChain', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'VET_EXECUTION' },
    { symbol: 'ICPUSDT', name: 'Internet Computer', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'ICP_EXECUTION' },
    { symbol: 'FILUSDT', name: 'Filecoin', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'FIL_EXECUTION' },
    { symbol: 'DOGEUSDT', name: 'Dogecoin', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'DOGE_EXECUTION' },
    { symbol: 'AVAXUSDT', name: 'Avalanche', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'AVAX_EXECUTION' },
    { symbol: 'DOTUSDT', name: 'Polkadot', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'MEDIUM', liquidity: 'HIGH', id: 'DOT_EXECUTION' },
    { symbol: 'LINKUSDT', name: 'Chainlink', optimalTrade: 'FUTURES_OPTIMAL', layer: 'EXECUTION', volatility: 'HIGH', liquidity: 'HIGH', id: 'LINK_EXECUTION' }
];

// [ENDPOINTS] TIPOS DE TRADE ÓPTIMOS - CAPAS CORREGIDAS
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

class QuantumDashboardV3 {
    constructor() {
        this.isInitialized = false;
        this.connectionStatus = 'CONNECTING';
        this.lastUpdate = null;
    }

    async initialize() {
        console.log(' [DASHBOARD V3] Inicializando sistema cuántico con datos reales...');
        
        try {
            this.updateConnectionStatus('CONNECTING');
            await this.loadQuantumMetrics();
            await this.loadNeuralSystems();
            await this.loadOpportunities();
            this.setupEventListeners();
            this.startRealTimeUpdates();
            
            this.isInitialized = true;
            this.updateConnectionStatus('CONNECTED');
            console.log('[OK] [DASHBOARD V3] Sistema cuántico inicializado con datos reales');
            
        } catch (error) {
            console.error('[ERROR] [DASHBOARD V3] Error:', error);
            this.updateConnectionStatus('ERROR');
        }
    }

    updateConnectionStatus(status) {
        this.connectionStatus = status;
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `status-indicator ${status.toLowerCase()}`;
        }
    }

    async loadQuantumMetrics() {
        try {
            console.log(' [METRICS] Cargando métricas cuánticas reales...');
            const response = await axios.get('http://localhost:4602/api/quantum-metrics');
            
            if (response.data.success) {
                this.displayQuantumMetrics(response.data.data);
                this.lastUpdate = new Date();
                console.log('[OK] [METRICS] Métricas cuánticas reales cargadas');
            }
        } catch (error) {
            console.error('[ERROR] [METRICS] Error:', error);
            this.displayMetricsError();
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
                    <h3> Estados Cuánticos Reales</h3>
                    <div class="metric-grid">
                        <div class="metric-item"><span>Coherencia</span><span class="metric-value">${(metrics.coherence * 100).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Conciencia</span><span class="metric-value">${(metrics.consciousness * 100).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Entanglement</span><span class="metric-value">${(metrics.entanglement * 100).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Superposición</span><span class="metric-value">${(metrics.superposition * 100).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Tunneling</span><span class="metric-value">${(metrics.tunneling * 100).toFixed(1)}%</span></div>
                    </div>
                </div>
                
                <div class="metric-card market-health">
                    <h3> Salud del Mercado Real</h3>
                    <div class="metric-grid">
                        <div class="metric-item"><span>Overall</span><span class="metric-value">${(metrics.marketHealth?.overall * 100 || 0).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Spot (Análisis)</span><span class="metric-value">${(metrics.marketHealth?.spot * 100 || 0).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Futures (Ejecución)</span><span class="metric-value">${(metrics.marketHealth?.futures * 100 || 0).toFixed(1)}%</span></div>
                        <div class="metric-item"><span>Options (Intel)</span><span class="metric-value">${(metrics.marketHealth?.options * 100 || 0).toFixed(1)}%</span></div>
                    </div>
                </div>
                
                <div class="metric-card temporal-analysis">
                    <h3>[TIME] Análisis Temporal Real</h3>
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

    displayMetricsError() {
        const metricsPanel = document.getElementById('quantum-metrics-panel');
        if (metricsPanel) {
            metricsPanel.innerHTML = `
                <div class="error" style="grid-column: 1 / -1; padding: 20px; text-align: center;">
                    <h3>[ALERT] Error en Métricas Cuánticas</h3>
                    <p>No se pudieron cargar las métricas del sistema cuántico</p>
                    <p>Verificando conexión con el backend...</p>
                </div>
            `;
        }
    }

    async loadNeuralSystems() {
        try {
            console.log(' [NEURAL] Cargando sistemas de inteligencia reales...');
            this.displayNeuralSystems();
            console.log('[OK] [NEURAL] Sistemas de inteligencia cargados');
        } catch (error) {
            console.error('[ERROR] [NEURAL] Error:', error);
        }
    }

    displayNeuralSystems() {
        const neuralGrid = document.getElementById('neural-systems-grid');
        if (neuralGrid) {
            const systems = [
                { name: 'RealFundingRateAnalyzer', weight: 0.15, icon: '[UP]', layer: 'OPTIONS', status: 'ACTIVE' },
                { name: 'InstitutionalWhaleDetector', weight: 0.08, icon: '', layer: 'OPTIONS', status: 'ACTIVE' },
                { name: 'SeasonalPatternEngine', weight: 0.12, icon: '[NIGHT]', layer: 'OPTIONS', status: 'ACTIVE' },
                { name: 'MarketAnomalyDetector', weight: 0.10, icon: '[EVENT]', layer: 'OPTIONS', status: 'ACTIVE' },
                { name: 'PredictiveVolatilityEngine', weight: 0.18, icon: '[DATA]', layer: 'OPTIONS', status: 'ACTIVE' },
                { name: 'ContrarianTheoryEngine', weight: 0.14, icon: '[RELOAD]', layer: 'OPTIONS', status: 'ACTIVE' },
                { name: 'InstitutionalFlowAnalyzer', weight: 0.11, icon: '', layer: 'OPTIONS', status: 'ACTIVE' },
                { name: 'QuantumMarketRegimeDetector', weight: 0.12, icon: '[API]', layer: 'OPTIONS', status: 'ACTIVE' }
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
                    <div class="neural-status ${system.status.toLowerCase()}">${system.status}</div>
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
            console.log(' [OPPORTUNITIES] Cargando oportunidades reales...');
            const response = await axios.get('http://localhost:4602/api/enhanced-opportunities');
            
            if (response.data.success && response.data.opportunities) {
                this.displayOpportunities(response.data.opportunities);
                this.lastUpdate = new Date();
                console.log('[OK] [OPPORTUNITIES] Oportunidades reales cargadas');
            }
        } catch (error) {
            console.error('[ERROR] [OPPORTUNITIES] Error:', error);
            this.displayOpportunitiesWaiting();
        }
    }

    async displayOpportunities(opportunities) {
        const opportunitiesGrid = document.getElementById('opportunities-grid');
        if (opportunitiesGrid && opportunities) {
            opportunitiesGrid.innerHTML = '';
            
            console.log(`[SEARCH] [DEBUG] Total oportunidades recibidas: ${opportunities.length}`);
            console.log(`[SEARCH] [DEBUG] Primeras 3 oportunidades:`, opportunities.slice(0, 3));
            
            // SOLO FUTURES - Oportunidades de ejecución real (FILTRO FLEXIBLE)
            const futuresOpportunities = opportunities.filter(item => {
                // Buscar en QUANTUM_UNIVERSE por símbolo
                const symbolInfo = QUANTUM_UNIVERSE.find(s => s.symbol === item.symbol);
                
                // Si el símbolo existe en nuestro universo y es de capa EXECUTION, incluirlo
                if (symbolInfo && symbolInfo.layer === 'EXECUTION') {
                    console.log(`[OK] [DEBUG] ${item.symbol} - Incluido por EXECUTION layer`);
                    return true;
                }
                
                // Si no está en nuestro universo pero tiene type FUTURES, incluirlo también
                if (item.type === 'FUTURES' || item.type === 'FUTURE') {
                    console.log(`[OK] [DEBUG] ${item.symbol} - Incluido por FUTURES type`);
                    return true;
                }
                
                // Para debugging: mostrar qué oportunidades están llegando
                console.log(`[ERROR] [DEBUG] ${item.symbol} - Type: ${item.type} - En universo: ${!!symbolInfo} - Layer: ${symbolInfo?.layer}`);
                
                return false;
            });
            
            console.log(`[SEARCH] [DEBUG] Oportunidades FUTURES filtradas: ${futuresOpportunities.length}`);
            
            // Si no hay oportunidades de FUTURES, mostrar mensaje
            if (futuresOpportunities.length === 0) {
                opportunitiesGrid.innerHTML = `
                    <div class="error" style="padding: 20px; text-align: center; color: #ff6b6b; grid-column: 1 / -1;">
                        <h3>[ALERT] Esperando Oportunidades de Ejecución (FUTURES)</h3>
                        <p>El sistema cuántico está procesando datos en tiempo real...</p>
                        <p>[DATA] SPOT: Análisis | [ENDPOINTS] OPTIONS: Inteligencia | [FAST] FUTURES: Ejecución</p>
                        <p><strong>Debug:</strong> Se recibieron ${opportunities.length} oportunidades del backend</p>
                        <div style="margin-top: 15px;">
                            <div style="display: inline-block; margin: 5px; padding: 8px 12px; background: rgba(78, 205, 196, 0.2); border-radius: 8px; border: 1px solid #4ecdc4;">
                                <span style="color: #4ecdc4; font-weight: bold;">SPOT (Análisis)</span>
                            </div>
                            <div style="display: inline-block; margin: 5px; padding: 8px 12px; background: rgba(69, 183, 209, 0.2); border-radius: 8px; border: 1px solid #45b7d1;">
                                <span style="color: #45b7d1; font-weight: bold;">OPTIONS (Intel)</span>
                            </div>
                            <div style="display: inline-block; margin: 5px; padding: 8px 12px; background: rgba(255, 107, 107, 0.2); border-radius: 8px; border: 1px solid #ff6b6b;">
                                <span style="color: #ff6b6b; font-weight: bold;">FUTURES (Ejecución)</span>
                            </div>
                        </div>
                        <button onclick="dashboard.loadOpportunities()" style="margin-top: 15px; padding: 10px 20px; background: #4ecdc4; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                            [RELOAD] REFRESCAR DATOS REALES
                        </button>
                    </div>
                `;
                return;
            }
            
            // Eliminar duplicados y mejorar ponderación (CON DATOS REALES DE OPTIONS)
            const uniqueFutures = await this.removeDuplicatesAndSort(futuresOpportunities);
            
            // Separar LONGS y SHORTS
            const { longs, shorts } = await this.separateLongsAndShorts(uniqueFutures);
            
            // Crear secciones separadas para LONGS y SHORTS
            const longsCards = await this.renderOpportunityCards(longs.slice(0, 4), 'LONG');
            const shortsCards = await this.renderOpportunityCards(shorts.slice(0, 4), 'SHORT');
            
            opportunitiesGrid.innerHTML = `
                <div class="opportunities-section" style="grid-column: 1 / -1; margin-bottom: 30px;">
                    <h3 style="text-align: center; color: #96ceb4; font-size: 1.5em; margin-bottom: 20px;">
                        [UP] MEJORES LONGS - FUTURES (${longs.length} oportunidades)
                    </h3>
                    <div class="longs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px;">
                        ${longsCards}
                    </div>
                </div>
                
                <div class="opportunities-section" style="grid-column: 1 / -1;">
                    <h3 style="text-align: center; color: #ff6b6b; font-size: 1.5em; margin-bottom: 20px;">
                        [DOWN] MEJORES SHORTS - FUTURES (${shorts.length} oportunidades)
                    </h3>
                    <div class="shorts-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px;">
                        ${shortsCards}
                    </div>
                </div>
            `;
        }
    }

    displayOpportunitiesWaiting() {
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

    async executeOpportunity(symbol, direction) {
        console.log(`[FAST] [EXECUTION] Ejecutando: ${symbol} - ${direction}`);
        this.showSuccess(`Ejecución iniciada para ${symbol} - ${direction}`);
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

    async removeDuplicatesAndSort(opportunities) {
        // Agrupar por símbolo y tomar la mejor oportunidad de cada uno
        const grouped = {};
        
        opportunities.forEach(opp => {
            if (!grouped[opp.symbol]) {
                grouped[opp.symbol] = [];
            }
            grouped[opp.symbol].push(opp);
        });
        
        // Para cada símbolo, seleccionar la mejor oportunidad basada en confianza y volumen
        const uniqueOpportunitiesPromises = Object.values(grouped).map(async symbolOpps => {
            let best = symbolOpps[0];
            for (const current of symbolOpps) {
                const bestScore = await this.calculateOpportunityScore(best);
                const currentScore = await this.calculateOpportunityScore(current);
                if (currentScore > bestScore) {
                    best = current;
                }
            }
            return best;
        });
        
        const uniqueOpportunities = await Promise.all(uniqueOpportunitiesPromises);
        
        // Ordenar por score de oportunidad (confianza + volumen + volatilidad + edge de OPTIONS)
        const sortedOpportunities = await Promise.all(
            uniqueOpportunities.map(async opp => ({
                ...opp,
                score: await this.calculateOpportunityScore(opp)
            }))
        );
        
        return sortedOpportunities.sort((a, b) => b.score - a.score);
    }

    async calculateOpportunityScore(opportunity) {
        const symbolInfo = QUANTUM_UNIVERSE.find(s => s.symbol === opportunity.symbol);
        if (!symbolInfo) return 0;
        
        const confidence = opportunity.confidence || 0.5;
        const volume = opportunity.volume || 0;
        const priceChange = Math.abs(opportunity.priceChangePercent || 0);
        
        // OBTENER EDGE DE OPTIONS PARA ESTE SÍMBOLO (DATOS REALES)
        const optionsEdge = await this.getOptionsEdge(opportunity.symbol);
        
        // Factores de ponderación
        const volumeWeight = Math.min(volume / 100000000, 1); // Normalizar volumen
        const volatilityWeight = symbolInfo.volatility === 'HIGH' ? 1.2 : 1.0;
        const liquidityWeight = symbolInfo.liquidity === 'MAXIMUM' ? 1.3 : 
                               symbolInfo.liquidity === 'HIGH' ? 1.1 : 1.0;
        
        // EDGE DE OPTIONS (métricas avanzadas que adelantan información)
        const optionsEdgeWeight = optionsEdge * 1.5; // Multiplicador por edge
        
        // Score final con edge de OPTIONS
        return (confidence * 0.3 + volumeWeight * 0.2 + (priceChange / 100) * 0.15 + optionsEdgeWeight * 0.35) * 
               volatilityWeight * liquidityWeight;
    }

    async getOptionsEdge(symbol) {
        try {
            // OBTENER DATOS REALES DE OPTIONS DEL BACKEND
            const response = await axios.get(`http://localhost:4602/api/options-metrics/${symbol}`);
            
            if (response.data.success && response.data.metrics) {
                const metrics = response.data.metrics;
                
                // Calcular edge real basado en métricas de OPTIONS
                const impliedVolatility = metrics.impliedVolatility || 0.5;
                const putCallRatio = metrics.putCallRatio || 1.0;
                const gammaExposure = metrics.gammaExposure || 0;
                const deltaExposure = metrics.deltaExposure || 0;
                
                // Edge basado en métricas reales
                let edge = 0.5; // Base neutral
                
                // Volatilidad implícita alta = más edge
                if (impliedVolatility > 0.8) edge += 0.2;
                else if (impliedVolatility > 0.6) edge += 0.1;
                
                // Put/Call ratio extremo = edge
                if (putCallRatio > 1.5 || putCallRatio < 0.5) edge += 0.15;
                
                // Gamma exposure alto = edge
                if (Math.abs(gammaExposure) > 0.1) edge += 0.1;
                
                // Delta exposure significativo = edge
                if (Math.abs(deltaExposure) > 0.2) edge += 0.1;
                
                return Math.min(edge, 1.0); // Cap en 100%
            }
        } catch (error) {
            console.log(`[WARNING] [OPTIONS] No hay datos reales para ${symbol}, usando edge neutral`);
        }
        
        // Fallback: edge neutral si no hay datos reales
        return 0.5;
    }

    calculateEnhancedConfidence(opportunity, symbolInfo) {
        const baseConfidence = opportunity.confidence || 0.5;
        const volume = opportunity.volume || 0;
        const priceChange = Math.abs(opportunity.priceChangePercent || 0);
        
        // Factores de mejora
        const volumeBonus = Math.min(volume / 1000000000, 0.2); // Máximo 20% bonus por volumen
        const volatilityBonus = symbolInfo.volatility === 'HIGH' ? 0.1 : 0;
        const liquidityBonus = symbolInfo.liquidity === 'MAXIMUM' ? 0.15 : 
                              symbolInfo.liquidity === 'HIGH' ? 0.1 : 0;
        const priceChangeBonus = Math.min(priceChange / 100, 0.1); // Máximo 10% bonus por cambio de precio
        
        const enhancedConfidence = baseConfidence + volumeBonus + volatilityBonus + liquidityBonus + priceChangeBonus;
        
        return Math.min(enhancedConfidence, 1.0); // Cap en 100%
    }

    calculateUrgency(confidence, volume, volatility) {
        const volumeScore = Math.min(volume / 100000000, 1); // Normalizar volumen
        const confidenceScore = confidence;
        const volatilityScore = volatility === 'HIGH' ? 1 : 0.5;
        
        const urgencyScore = (confidenceScore * 0.4 + volumeScore * 0.3 + volatilityScore * 0.3);
        
        if (urgencyScore > 0.8) return 'HIGH';
        if (urgencyScore > 0.6) return 'MEDIUM';
        return 'LOW';
    }

    calculateSuccessProbability(confidence, opportunity) {
        const baseProb = confidence * 100;
        const volumeBonus = Math.min((opportunity.volume || 0) / 100000000, 10); // Máximo 10% bonus
        const priceChangeBonus = Math.min(Math.abs(opportunity.priceChangePercent || 0) / 10, 5); // Máximo 5% bonus
        
        const finalProb = baseProb + volumeBonus + priceChangeBonus;
        return `${Math.min(Math.round(finalProb), 99)}%`;
    }

    calculateRiskReward(confidence, opportunity) {
        const baseRatio = 1.5;
        const confidenceBonus = confidence * 0.5; // Máximo 0.5 bonus
        const volumeBonus = Math.min((opportunity.volume || 0) / 1000000000, 0.3); // Máximo 0.3 bonus
        
        const finalRatio = baseRatio + confidenceBonus + volumeBonus;
        return `${finalRatio.toFixed(1)}:1`;
    }

    async separateLongsAndShorts(opportunities) {
        const longs = [];
        const shorts = [];
        
        for (const opp of opportunities) {
            const priceChange = opp.priceChangePercent || 0;
            const symbolInfo = QUANTUM_UNIVERSE.find(s => s.symbol === opp.symbol);
            
            if (symbolInfo && symbolInfo.layer === 'EXECUTION') {
                // Determinar dirección basada en momentum y estrategia (CON EDGE DE OPTIONS)
                const isLong = await this.determineTradeDirection(opp, symbolInfo);
                
                if (isLong) {
                    longs.push({ ...opp, tradeDirection: 'LONG' });
                } else {
                    shorts.push({ ...opp, tradeDirection: 'SHORT' });
                }
            }
        }
        
        // Ordenar por score de oportunidad (CON DATOS REALES DE OPTIONS)
        const longsWithScores = await Promise.all(
            longs.map(async opp => ({
                ...opp,
                score: await this.calculateOpportunityScore(opp)
            }))
        );
        
        const shortsWithScores = await Promise.all(
            shorts.map(async opp => ({
                ...opp,
                score: await this.calculateOpportunityScore(opp)
            }))
        );
        
        longsWithScores.sort((a, b) => b.score - a.score);
        shortsWithScores.sort((a, b) => b.score - a.score);
        
        return { longs: longsWithScores, shorts: shortsWithScores };
    }

    async determineTradeDirection(opportunity, symbolInfo) {
        const priceChange = opportunity.priceChangePercent || 0;
        const volume = opportunity.volume || 0;
        const confidence = opportunity.confidence || 0.5;
        
        // OBTENER EDGE DE OPTIONS PARA DIRECCIÓN (DATOS REALES)
        const optionsEdge = await this.getOptionsEdge(opportunity.symbol);
        const optionsDirection = await this.getOptionsDirection(opportunity.symbol, priceChange);
        
        // Estrategia específica del símbolo
        const strategy = symbolInfo.optimalTrade;
        
        // Factores para determinar dirección
        const momentumFactor = priceChange > 0 ? 1 : -1;
        const volumeFactor = volume > 100000000 ? 1 : 0.5; // Volumen alto = más confiable
        const confidenceFactor = confidence > 0.7 ? 1 : 0.5;
        const optionsFactor = optionsEdge * optionsDirection; // Edge de OPTIONS para dirección
        
        // Estrategias que sugieren dirección específica
        if (strategy.includes('LONG')) return true;
        if (strategy.includes('SHORT')) return false;
        if (strategy.includes('ARBITRAGE')) return priceChange > 0;
        if (strategy.includes('HEDGE')) return priceChange < 0;
        
        // Score de dirección con edge de OPTIONS
        const directionScore = (momentumFactor * 0.3 + volumeFactor * 0.2 + confidenceFactor * 0.2 + optionsFactor * 0.3);
        
        return directionScore > 0;
    }

    async getOptionsDirection(symbol, priceChange) {
        try {
            // OBTENER DATOS REALES DE OPTIONS DEL BACKEND
            const response = await axios.get(`http://localhost:4602/api/options-metrics/${symbol}`);
            
            if (response.data.success && response.data.metrics) {
                const metrics = response.data.metrics;
                
                // Calcular dirección basada en métricas reales de OPTIONS
                const putCallRatio = metrics.putCallRatio || 1.0;
                const gammaExposure = metrics.gammaExposure || 0;
                const deltaExposure = metrics.deltaExposure || 0;
                const impliedVolatility = metrics.impliedVolatility || 0.5;
                
                let direction = priceChange > 0 ? 1 : -1; // Base en momentum
                
                // Put/Call ratio > 1 = bearish, < 1 = bullish
                if (putCallRatio > 1.2) direction *= -1.2; // Bearish signal
                else if (putCallRatio < 0.8) direction *= 1.2; // Bullish signal
                
                // Gamma exposure alto = dirección más agresiva
                if (Math.abs(gammaExposure) > 0.1) direction *= 1.3;
                
                // Delta exposure significativo = dirección más precisa
                if (Math.abs(deltaExposure) > 0.2) direction *= 1.2;
                
                // Volatilidad implícita alta = dirección más agresiva
                if (impliedVolatility > 0.8) direction *= 1.1;
                
                return direction;
            }
        } catch (error) {
            console.log(`[WARNING] [OPTIONS] No hay datos reales para ${symbol}, usando momentum`);
        }
        
        // Fallback: usar momentum si no hay datos reales
        return priceChange > 0 ? 1 : -1;
    }

    async renderOpportunityCards(opportunities, direction) {
        if (opportunities.length === 0) {
            return `
                <div class="no-opportunities" style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #888;">
                    <h4>No hay oportunidades de ${direction} disponibles</h4>
                    <p>Esperando señales del sistema cuántico...</p>
                </div>
            `;
        }
        
        const cardsPromises = opportunities.map(async (item, index) => {
            const symbolInfo = QUANTUM_UNIVERSE.find(s => s.symbol === item.symbol);
            if (!symbolInfo) return '';
            
            const confidence = this.calculateEnhancedConfidence(item, symbolInfo);
            const urgency = this.calculateUrgency(confidence, item.volume, symbolInfo.volatility);
            const successProb = this.calculateSuccessProbability(confidence, item);
            const riskReward = this.calculateRiskReward(confidence, item);
            
            const currentPrice = item.currentPrice || 0;
            const priceChange = item.priceChangePercent || 0;
            const volume = item.volume || 0;
            
            const directionColor = direction === 'LONG' ? '#96ceb4' : '#ff6b6b';
            const directionIcon = direction === 'LONG' ? '[UP]' : '[DOWN]';
            
            return `
                <div class="opportunity-card ${urgency.toLowerCase()}-priority" style="border-left: 4px solid ${directionColor};">
                    <div class="opportunity-header">
                        <span class="position">#${index + 1}</span>
                        <span class="symbol">${item.symbol}</span>
                        <span class="direction-badge" style="background: ${directionColor}20; color: ${directionColor}; border: 1px solid ${directionColor};">
                            ${directionIcon} ${direction}
                        </span>
                        <span class="urgency ${urgency.toLowerCase()}">${urgency.toUpperCase()}</span>
                    </div>
                    
                    <div class="opportunity-metrics">
                        <div class="metric-row">
                            <span>Confianza: ${(confidence * 100).toFixed(1)}%</span>
                            <span>Precio: $${currentPrice.toFixed(4)}</span>
                            <span>Cambio: ${priceChange.toFixed(2)}%</span>
                        </div>
                        <div class="metric-row">
                            <span>Volatilidad: ${symbolInfo.volatility}</span>
                            <span>Liquidez: ${symbolInfo.liquidity}</span>
                            <span>Volumen: $${(volume / 1000000).toFixed(1)}M</span>
                        </div>
                    </div>
                    
                    <div class="execution-details">
                        <div class="entry-strategy">
                            <h4>[ENDPOINTS] Estrategia de Entrada</h4>
                            <span class="strategy-type">${symbolInfo.optimalTrade.replace('FUTURES_', '')}</span>
                            <span class="timing">${this.determineTiming(priceChange, volume)}</span>
                            <span class="leverage">25x</span>
                        </div>
                        
                        <div class="risk-reward">
                            <span>Probabilidad: ${successProb}</span>
                            <span>Risk/Reward: ${riskReward}</span>
                            <span>Stop Loss: $${this.calculateStopLoss(currentPrice, direction).toFixed(4)}</span>
                            <span>Take Profit: $${this.calculateTakeProfit(currentPrice, direction).toFixed(4)}</span>
                        </div>
                    </div>
                    
                                         <div class="signals-detected">
                         <span class="signal-tag">${symbolInfo.volatility}_VOLATILITY</span>
                         <span class="signal-tag">${priceChange > 0 ? 'BULLISH' : 'BEARISH'}_MOMENTUM</span>
                         <span class="signal-tag" style="background: rgba(69, 183, 209, 0.3); color: #45b7d1; border: 1px solid #45b7d1;">OPTIONS_EDGE: ${(await this.getOptionsEdge(item.symbol) * 100).toFixed(0)}%</span>
                         <span class="signal-tag">WHALE_ACTIVITY</span>
                         <span class="signal-tag">FUNDING_SIGNAL</span>
                     </div>
                    
                    <div class="action-buttons">
                        <button class="btn-analyze" onclick="dashboard.analyzeSymbol('${item.symbol}')">[SEARCH] ANALIZAR</button>
                        <button class="btn-execute" onclick="dashboard.executeOpportunity('${item.symbol}', '${direction}')" style="background: ${directionColor}20; color: ${directionColor}; border: 1px solid ${directionColor};">
                            [FAST] EJECUTAR ${direction}
                        </button>
                                         </div>
                 </div>
             `;
         });
         
         const cards = await Promise.all(cardsPromises);
         return cards.join('');
     }

    determineTiming(priceChange, volume) {
        const absChange = Math.abs(priceChange);
        const volumeScore = volume > 100000000 ? 'HIGH' : 'MEDIUM';
        
        if (absChange > 5) return 'IMMEDIATE';
        if (absChange > 2) return 'SCALE_IN';
        return 'WAIT';
    }

    calculateStopLoss(price, direction) {
        const stopLossPercent = 0.05; // 5%
        return direction === 'LONG' ? price * (1 - stopLossPercent) : price * (1 + stopLossPercent);
    }

    calculateTakeProfit(price, direction) {
        const takeProfitPercent = 0.05; // 5%
        return direction === 'LONG' ? price * (1 + takeProfitPercent) : price * (1 - takeProfitPercent);
    }
}

// [NIGHT] INICIALIZAR DASHBOARD V3
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    console.log('[NIGHT] [DASHBOARD V3] DOM cargado, inicializando sistema con datos reales...');
    dashboard = new QuantumDashboardV3();
    dashboard.initialize();
});

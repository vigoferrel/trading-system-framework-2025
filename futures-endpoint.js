
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

// NUEVO ENDPOINT ESPECÍFICO PARA FUTURES - SIN DUPLICADOS
// Agregar este código al final de core-system-organized.js

app.get('/api/futures-opportunities', async (req, res) => {
    try {
        console.log(`[FAST] [FUTURES OPPORTUNITIES] Generando oportunidades de FUTURES...`);
        
        const allData = await getAllOrganizedData();
        const futuresOpportunities = [];
        
        // SOLO PROCESAR SÍMBOLOS DE FUTURES
        if (allData.futures) {
            Object.keys(allData.futures).forEach(symbol => {
                const data = allData.futures[symbol];
                if (data) {
                    // [ENDPOINTS] CALCULAR MÉTRICAS REALES BASADAS EN DATOS
                    const priceChange = data.priceChangePercent || 0;
                    const volume = data.volume || 0;
                    const price = data.price || data.lastPrice || 100;
                    
                    // Calcular confianza basada en datos reales
                    const volatilityScore = Math.min(1, Math.abs(priceChange) / 10);
                    const volumeScore = Math.min(1, volume / 1000000);
                    const confidence = Math.max(0.6, Math.min(1, (volatilityScore + volumeScore) / 2));
                    
                    // Determinar prioridad basada en volatilidad y volumen
                    const priority = Math.abs(priceChange) > 5 || volume > 1000000 ? 'HIGH' : 'MEDIUM';
                    
                    // Determinar timeframe basado en volatilidad
                    const timeframe = Math.abs(priceChange) > 10 ? '1h' : Math.abs(priceChange) > 5 ? '4h' : '1d';
                    
                    // Determinar nivel de riesgo basado en volatilidad
                    const riskLevel = Math.abs(priceChange) > 15 ? 'HIGH' : Math.abs(priceChange) > 8 ? 'MEDIUM' : 'LOW';
                    
                    // Calcular proyección neural basada en tendencia
                    const trendFactor = priceChange / 100;
                    const neuralProjection = price * (1 + trendFactor * 0.1);
                    
                    // Determinar recomendación de entrada basada en datos
                    let entry_recommendation = 'WAIT_FOR_CONFIRMATION';
                    if (Math.abs(priceChange) > 10 && volume > 500000) {
                        entry_recommendation = 'IMMEDIATE_MARKET';
                    } else if (Math.abs(priceChange) > 5 && volume > 200000) {
                        entry_recommendation = 'MODERATE_ENTRY';
                    }
                    
                    // Determinar leverage basado en volatilidad
                    let leverage = '10x';
                    if (Math.abs(priceChange) > 15) leverage = '50x';
                    else if (Math.abs(priceChange) > 8) leverage = '25x';
                    
                    // Determinar timing basado en momentum
                    let timing = 'WAIT';
                    if (Math.abs(priceChange) > 8) timing = 'IMMEDIATE';
                    else if (Math.abs(priceChange) > 3) timing = 'SCALE_IN';
                    
                    // Determinar urgencia basada en volatilidad
                    let urgency = 'LOW';
                    if (Math.abs(priceChange) > 12) urgency = 'HIGH';
                    else if (Math.abs(priceChange) > 6) urgency = 'MEDIUM';
                    
                    // Calcular probabilidad de éxito basada en datos
                    const successBase = 70;
                    const volatilityBonus = Math.min(20, Math.abs(priceChange) * 2);
                    const volumeBonus = Math.min(10, volume / 100000);
                    const success_probability = Math.min(95, successBase + volatilityBonus + volumeBonus);
                    
                    // Determinar risk/reward basado en volatilidad
                    let risk_reward = '1.5:1';
                    if (Math.abs(priceChange) > 12) risk_reward = '3:1';
                    else if (Math.abs(priceChange) > 6) risk_reward = '2:1';
                    
                    // Calcular señales basadas en datos reales
                    const signals = [];
                    if (Math.abs(priceChange) > 10) signals.push('HIGH_VOLATILITY');
                    if (volume > 1000000) signals.push('HIGH_VOLUME');
                    if (priceChange > 5) signals.push('BULLISH_MOMENTUM');
                    if (priceChange < -5) signals.push('BEARISH_MOMENTUM');
                    if (Math.abs(priceChange) > 15) signals.push('EXTREME_MOVE');
                    
                    const opportunity = {
                        symbol: symbol,
                        name: symbol.replace('USDT', ''),
                        currentPrice: price,
                        priceChange: data.priceChange || 0,
                        priceChangePercent: priceChange,
                        volume: volume,
                        type: 'FUTURES',
                        confidence: confidence,
                        priority: priority,
                        timeframe: timeframe,
                        riskLevel: riskLevel,
                        optimalTrade: 'FUTURES_OPTIMAL',
                        layer: 'EXECUTION',
                        volatility: Math.abs(priceChange) > 5 ? 'HIGH' : 'MEDIUM',
                        liquidity: volume > 1000000 ? 'HIGH' : 'MEDIUM',
                        signals: signals.length,
                        neuralProjection: neuralProjection,
                        // [ENDPOINTS] CAMPOS ADICIONALES PARA EL FRONTEND
                        entry_recommendation: entry_recommendation,
                        leverage: leverage,
                        timing: timing,
                        urgency: urgency,
                        success_probability: Math.floor(success_probability) + '%',
                        risk_reward: risk_reward
                    };
                    futuresOpportunities.push(opportunity);
                }
            });
        }
        
        // Ordenar por confianza
        futuresOpportunities.sort((a, b) => b.confidence - a.confidence);
        
        console.log(`[FAST] [FUTURES OPPORTUNITIES] Generadas ${futuresOpportunities.length} oportunidades de FUTURES`);
        
        res.json({ 
            success: true, 
            opportunities: futuresOpportunities,
            total_futures: futuresOpportunities.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error en /api/futures-opportunities:', error);
        res.status(500).json({ error: 'Error generando oportunidades de FUTURES' });
    }
});

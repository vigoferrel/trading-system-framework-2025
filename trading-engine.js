/**
 * Trading Engine Mock - Para Testing
 * Simulación del motor de trading para pruebas unitarias
 */

// Estado simulado del trading
let tradingState = {
  portfolio: {
    totalValue: 10000,
    positions: [
      { symbol: 'BTCUSDT', quantity: 0.5, value: 5000 },
      { symbol: 'ETHUSDT', quantity: 2, value: 3000 }
    ],
    cash: 2000
  },
  marketData: new Map(),
  trades: [],
  analysis: {
    trend: 'neutral',
    signals: [],
    confidence: 0.5
  }
};

/**
 * Obtener portfolio actual
 */
async function getPortfolio() {
  // Simular fluctuación de valores
  tradingState.portfolio.positions.forEach(position => {
    const fluctuation = (Math.random() - 0.5) * 0.1; // ±5%
    position.value *= (1 + fluctuation);
  });
  
  // Recalcular total
  const positionsValue = tradingState.portfolio.positions.reduce((sum, pos) => sum + pos.value, 0);
  tradingState.portfolio.totalValue = positionsValue + tradingState.portfolio.cash;
  
  return { ...tradingState.portfolio };
}

/**
 * Obtener datos de mercado
 */
async function getMarketData(symbol) {
  if (!symbol) return null;
  
  // Simular datos de mercado en tiempo real
  const basePrice = symbol.includes('BTC') ? 45000 : 
                   symbol.includes('ETH') ? 3200 : 
                   Math.random() * 1000;
  
  const change = (Math.random() - 0.5) * 0.1; // ±5%
  const volume = Math.random() * 1000000;
  
  const marketData = {
    symbol,
    price: basePrice * (1 + change),
    change: change,
    volume: volume,
    high: basePrice * 1.05,
    low: basePrice * 0.95,
    timestamp: Date.now()
  };
  
  tradingState.marketData.set(symbol, marketData);
  return marketData;
}

/**
 * Ejecutar trade
 */
async function executeTrade(tradeParams) {
  if (!tradeParams || !tradeParams.symbol || !tradeParams.side || !tradeParams.quantity) {
    return { success: false, error: 'Invalid parameters' };
  }
  
  // Simular validaciones
  if (tradeParams.quantity <= 0) {
    return { success: false, error: 'Invalid quantity' };
  }
  
  // Simular disponibilidad de balance
  const requiredValue = tradeParams.quantity * (tradeParams.price || 1000);
  if (tradeParams.side === 'buy' && requiredValue > tradingState.portfolio.cash) {
    return { success: false, error: 'Insufficient balance' };
  }
  
  // Simular trade exitoso
  const trade = {
    orderId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    symbol: tradeParams.symbol,
    side: tradeParams.side,
    quantity: tradeParams.quantity,
    price: tradeParams.price || (Math.random() * 50000),
    status: 'FILLED',
    timestamp: Date.now()
  };
  
  tradingState.trades.push(trade);
  
  return { success: true, orderId: trade.orderId, trade };
}

/**
 * Analizar tendencias de mercado
 */
async function analyzeTrend() {
  const trends = ['bullish', 'bearish', 'neutral'];
  const signals = ['buy', 'sell', 'hold', 'buy_btc', 'sell_eth', 'hold_ada'];
  
  tradingState.analysis = {
    trend: trends[Math.floor(Math.random() * trends.length)],
    signals: signals.slice(0, Math.floor(Math.random() * 3) + 1),
    confidence: Math.random(),
    timestamp: Date.now()
  };
  
  return { ...tradingState.analysis };
}

/**
 * Calcular métricas de riesgo
 */
async function calculateRisk() {
  const portfolioValue = tradingState.portfolio.totalValue;
  const risk = Math.random(); // 0-1
  const maxLoss = portfolioValue * risk * 0.1; // Máximo 10% del portfolio
  
  return {
    risk,
    maxLoss,
    portfolioValue,
    riskLevel: risk < 0.3 ? 'low' : risk < 0.7 ? 'medium' : 'high',
    timestamp: Date.now()
  };
}

/**
 * Generar señales de trading
 */
async function generateSignals() {
  const allSignals = ['buy', 'sell', 'hold', 'strong_buy', 'strong_sell'];
  const numSignals = Math.floor(Math.random() * 3) + 1;
  
  return allSignals.slice(0, numSignals);
}

/**
 * Reset del estado para tests
 */
function resetTradingState() {
  tradingState = {
    portfolio: {
      totalValue: 10000,
      positions: [
        { symbol: 'BTCUSDT', quantity: 0.5, value: 5000 },
        { symbol: 'ETHUSDT', quantity: 2, value: 3000 }
      ],
      cash: 2000
    },
    marketData: new Map(),
    trades: [],
    analysis: {
      trend: 'neutral',
      signals: [],
      confidence: 0.5
    }
  };
}

module.exports = {
  getPortfolio,
  getMarketData,
  executeTrade,
  analyzeTrend,
  calculateRisk,
  generateSignals,
  resetTradingState
};

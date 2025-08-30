
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

const config = require('./config');

console.log('=== DIAGNÓSTICO DE MARKET DATA ===');
console.log('Config symbols:', config.quantum.symbols);
console.log('Config symbols length:', config.quantum.symbols.length);
console.log('Quantum constants:', config.quantum.quantumConstants);

// Simular el método getMarketData
async function testGetMarketData() {
    try {
        console.log('\n=== SIMULANDO GETMARKETDATA ===');
        
        const unifiedSymbols = config.quantum.symbols;
        const quantumConstants = config.quantum.quantumConstants;
        
        console.log(`Using unified symbols: ${unifiedSymbols.length} symbols`);
        console.log(`Quantum constants: Z=${quantumConstants.Z_REAL}+${quantumConstants.Z_IMAG}i, λ=${quantumConstants.LAMBDA_7919.toFixed(3)}`);
        
        const marketData = {};
        
        unifiedSymbols.forEach((symbol, index) => {
            console.log(`Processing symbol ${index + 1}/${unifiedSymbols.length}: ${symbol}`);
            
            // Precios base realistas
            const basePrices = {
                'BTC': 65000, 'ETH': 3500, 'BNB': 600, 'SOL': 150, 'XRP': 0.5, 'DOGE': 0.08,
                'ADA': 0.45, 'AVAX': 35, 'DOT': 7, 'MATIC': 0.7, 'LINK': 15,
                'UNI': 8, 'LTC': 80, 'BCH': 400, 'ATOM': 8, 'NEAR': 5,
                'FTM': 0.3, 'ALGO': 0.15, 'VET': 0.02, 'ICP': 12, 'FIL': 5
            };
            
            // Obtener datos reales de Binance
            try {
                const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`);
                if (response.ok) {
                    const ticker = await response.json();
                    const price = parseFloat(ticker.lastPrice);
                    const change = parseFloat(ticker.priceChangePercent);
                    const volume = parseFloat(ticker.volume);
                    const high24h = parseFloat(ticker.highPrice);
                    const low24h = parseFloat(ticker.lowPrice);
                    
                    // Calcular volatilidad basada en datos reales
                    const volatility = Math.abs(change) / 100;
                    
                    // Calcular factores cuánticos
                    const quantumFactors = calculateQBTCQuantumFactors({
                        price: price,
                        change: change,
                        volume: volume
                    }, quantumConstants);
                    
                    marketData[symbol] = {
                        symbol: symbol,
                        price: price,
                        change: change,
                        volume: volume,
                        high24h: high24h,
                        low24h: low24h,
                        quantumFactors: quantumFactors,
                        quantumScore: calculateQBTCQuantumScore(quantumFactors, quantumConstants),
                        timestamp: Date.now()
                    };
                    
                    console.log(`  ${symbol}: price=${price.toFixed(2)}, change=${change.toFixed(2)}%, score=${marketData[symbol].quantumScore.toFixed(3)}`);
                }
            } catch (error) {
                console.error(`Error obteniendo datos de ${symbol}:`, error);
                
                // Fallback con datos determinísticos
                const basePrice = basePrices[symbol] || 100;
                const timeFactor = (Date.now() % 10000) / 10000;
                const change = 5 * Math.sin(timeFactor * Math.PI * 2);
                const price = basePrice * (1 + change / 100);
                const volume = basePrice * (1000 + 5000 * Math.abs(Math.sin(timeFactor * Math.PI * 3)));
                
                // Calcular factores cuánticos
                const quantumFactors = calculateQBTCQuantumFactors({
                    price: price,
                    change: change,
                    volume: volume
                }, quantumConstants);
                
                marketData[symbol] = {
                    symbol: symbol,
                    price: price,
                    change: change,
                    volume: volume,
                    high24h: price * (1 + 0.1 * Math.sin(timeFactor * Math.PI * 4)),
                    low24h: price * (1 - 0.1 * Math.cos(timeFactor * Math.PI * 5)),
                    quantumFactors: quantumFactors,
                    quantumScore: calculateQBTCQuantumScore(quantumFactors, quantumConstants),
                    timestamp: Date.now()
                };
                
                console.log(`  ${symbol}: price=${price.toFixed(2)}, change=${change.toFixed(2)}%, score=${marketData[symbol].quantumScore.toFixed(3)} (fallback)`);
            }
        });
        
        console.log(`\nGenerated market data for ${Object.keys(marketData).length} symbols`);
        console.log('Sample data:', marketData['BTC']);
        
        return { data: marketData };
        
    } catch (error) {
        console.error('Error in testGetMarketData:', error);
        return { data: {} };
    }
}

function calculateQBTCQuantumFactors(marketData, constants) {
    const price = parseFloat(marketData.price || 1);
    const change = parseFloat(marketData.change || 0);
    const volume = parseFloat(marketData.volume || 1);
    
    const zMagnitude = Math.sqrt(constants.Z_REAL ** 2 + constants.Z_IMAG ** 2);
    const lambdaFactor = constants.LAMBDA_7919 / Math.log(price);
    const phiFactor = constants.PHI_GOLDEN;
    
    return {
        coherence: Math.min(1, Math.abs(change) / 10 + 0.5),
        entanglement: Math.min(1, volume / 1000000 + 0.3),
        momentum: Math.min(1, Math.abs(change) / 5 + 0.4),
        density: Math.min(1, price / 100000 + 0.2),
        temperature: Math.min(1, Math.abs(change) / 20 + 0.6),
        successProbability: Math.min(1, (zMagnitude / 20) + 0.5),
        opportunity: Math.min(1, (lambdaFactor / 10) + 0.4),
        sensitivity: Math.min(1, (phiFactor / 2) + 0.3)
    };
}

function calculateQBTCQuantumScore(quantumFactors, constants) {
    const weights = {
        coherence: 0.25,
        entanglement: 0.20,
        momentum: 0.15,
        density: 0.15,
        temperature: 0.15,
        successProbability: 0.05,
        opportunity: 0.03,
        sensitivity: 0.02
    };
    
    let score = 0;
    Object.entries(quantumFactors).forEach(([factor, value]) => {
        if (weights[factor]) {
            score += value * weights[factor];
        }
    });
    
    const resonanceBoost = Math.sin(constants.RESONANCE_FREQ * Date.now() / 1000) * 0.1;
    score = Math.min(1, Math.max(0, score + resonanceBoost));
    
    return score;
}

// Ejecutar diagnóstico
testGetMarketData().then(result => {
    console.log('\n=== RESULTADO FINAL ===');
    console.log('Result keys:', Object.keys(result));
    console.log('Data keys:', Object.keys(result.data || {}));
    console.log('Data length:', Object.keys(result.data || {}).length);
});

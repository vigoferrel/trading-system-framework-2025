
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

const BinanceConnector = require('./binance-connector');

async function testFapiBalance() {
    console.log('[SEARCH] Testing FAPI balance detection...');
    
    const connector = new BinanceConnector({
        tradeMode: 'unified'
    });
    
    console.log('\n[LIST] Configuration:');
    console.log('- API Key:', connector.config.apiKey ? 'SET' : 'NOT SET');
    console.log('- API Secret:', connector.config.apiSecret ? 'SET' : 'NOT SET');
    console.log('- FAPI Base URL:', connector.config.futuresBaseUrl);
    console.log('- Testnet:', connector.config.testnet);
    
    try {
        console.log('\n[RELOAD] Testing direct FAPI balance call...');
        const fapiBalance = await connector.getFuturesAccountBalance();
        console.log('[OK] FAPI Balance Response:', JSON.stringify(fapiBalance, null, 2));
        
        if (Array.isArray(fapiBalance)) {
            const usdtRecord = fapiBalance.find(a => {
                const asset = String(a?.asset || '').toUpperCase();
                return asset === 'USDT' || asset === 'USD';
            });
            
            if (usdtRecord) {
                console.log('\n[MONEY] USDT Record Found:');
                console.log('- Asset:', usdtRecord.asset);
                console.log('- Available Balance:', usdtRecord.availableBalance);
                console.log('- Cross Wallet Balance:', usdtRecord.crossWalletBalance);
                console.log('- Wallet Balance:', usdtRecord.walletBalance);
                console.log('- Max Withdraw Amount:', usdtRecord.maxWithdrawAmount);
                console.log('- Cross UnPnl:', usdtRecord.crossUnPnl);
                console.log('- Unrealized Profit:', usdtRecord.unrealizedProfit);
            } else {
                console.log('[ERROR] No USDT record found in FAPI balance');
                console.log('Available assets:', fapiBalance.map(a => a.asset));
            }
        } else {
            console.log('[ERROR] FAPI balance is not an array:', typeof fapiBalance);
        }
        
    } catch (error) {
        console.error('[ERROR] Error getting FAPI balance:', error.message);
        console.error('Error details:', {
            code: error.code,
            response: error.response?.data
        });
    }
    
    try {
        console.log('\n[RELOAD] Testing unified balance call...');
        const unifiedBalance = await connector.getAccountBalance(true);
        console.log('[OK] Unified Balance:', JSON.stringify(unifiedBalance, null, 2));
        
    } catch (error) {
        console.error('[ERROR] Error getting unified balance:', error.message);
    }
}

testFapiBalance().catch(console.error);
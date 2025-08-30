import { BinanceRealClient } from '../lib/binance/BinanceRealClient';

const ASSET_SYMBOLS_ORIGINAL = [
  // Tech Momentum (7)
  'AAPL', 'MSFT', 'GOOGL', 'NVDA', 'TSLA', 'AMZN', 'QQQ',
  // Defensivos (6)
  'XLU', 'XLP', 'XLV', 'VNQ', 'GLD', 'TLT',
  // Crypto (2)
  'BTC', 'ETH',
  // Commodities (2)
  'USO', 'UNG',
  // Financiero/Defensa (2)
  'XLF', 'XAR',
  // Forex (2)
  'USDCHF', 'USDJPY',
  // Mercados Generales (2)
  'DXY', 'SPY',
  // Inteligencia Artificial (1)
  'BOTZ',
  // Volatilidad/Bonos (5)
  'VIX', 'IEF', 'SHY', 'SOL', 'DOGE'
];

const BINANCE_MAPPING_CANDIDATES = {
  'AAPL': 'AAPLUSDT', 'MSFT': 'MSFTUSDT', 'GOOGL': 'GOOGLUSDT', 'NVDA': 'NVDAUSDT', 
  'TSLA': 'TSLAUSDT', 'AMZN': 'AMZNUSDT',
  'QQQ': 'ETHUSDT', // Proxy
  'XLU': 'ADAUSDT', // Proxy
  'XLP': 'LTCUSDT', // Proxy
  'XLV': 'BNBUSDT', // Proxy
  'VNQ': 'MATICUSDT', // Proxy
  'GLD': 'PAXGUSDT', 
  'TLT': 'BUSDUSDT', // Proxy
  'BTC': 'BTCUSDT', 
  'ETH': 'ETHUSDT',
  'USO': 'BTCUSDT', // Proxy
  'UNG': 'ETHUSDT', // Proxy
  'XLF': 'UNIUSDT', // Proxy
  'XAR': 'LINKUSDT', // Proxy
  'USDCHF': 'USDCUSDT', // Proxy
  'USDJPY': 'USDCUSDT', // Proxy
  'DXY': 'USDTUSDT', // Proxy
  'SPY': 'BTCUSDT', // Proxy
  'BOTZ': 'FETUSDT', // Proxy
  'VIX': 'BTCUSDT', // Proxy
  'IEF': 'USDCUSDT', // Proxy
  'SHY': 'DAIUSDT', // Proxy
  'SOL': 'SOLUSDT', 
  'DOGE': 'DOGEUSDT',
};


async function verifyBinanceProducts() {
  console.log("Iniciando verificación de productos en Binance...");
  const binanceClient = new BinanceRealClient();

  const isPingSuccessful = await binanceClient.ping();
  if (!isPingSuccessful) {
    console.error("No se pudo conectar a la API de Binance. Verifique su conexión y las credenciales.");
    return;
  }
  console.log("Conexión con Binance API exitosa.");

  const results: { originalSymbol: string; binanceSymbol: string | null; available: boolean; notes: string }[] = [];

  for (const originalSymbol of ASSET_SYMBOLS_ORIGINAL) {
    const candidateBinanceSymbol = BINANCE_MAPPING_CANDIDATES[originalSymbol as keyof typeof BINANCE_MAPPING_CANDIDATES];
    
    if (candidateBinanceSymbol) {
      const available = await binanceClient.isSymbolAvailable(candidateBinanceSymbol);
      results.push({
        originalSymbol,
        binanceSymbol: candidateBinanceSymbol,
        available: available,
        notes: available ? "Directamente disponible o Proxy conocido." : "Candidato no encontrado o no disponible."
      });
    } else {
      results.push({
        originalSymbol,
        binanceSymbol: null,
        available: false,
        notes: "No se encontró un candidato de mapeo inicial en Binance."
      });
    }
  }

  console.log("\n--- Resultados de Verificación de Productos de Binance ---");
  results.forEach(res => {
    console.log(`Original: ${res.originalSymbol.padEnd(8)} | Binance Candidato: ${String(res.binanceSymbol).padEnd(12)} | Disponible: ${res.available ? '✅' : '❌'} | Notas: ${res.notes}`);
  });
  console.log("\nRevisa los símbolos marcados con ❌. Para los proxies, la disponibilidad se basa en el símbolo proxy, no en el activo original directamente.");
  console.log("Para continuar, asegúrese de que su '.env' esté configurado correctamente con VITE_BINANCE_API_KEY y VITE_BINANCE_SECRET.");
}

verifyBinanceProducts();

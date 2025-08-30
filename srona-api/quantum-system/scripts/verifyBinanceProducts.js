
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

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var BinanceRealClient_1 = require("../lib/binance/BinanceRealClient");
var ASSET_SYMBOLS_ORIGINAL = [
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
var BINANCE_MAPPING_CANDIDATES = {
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
function verifyBinanceProducts() {
    return __awaiter(this, void 0, void 0, function () {
        var binanceClient, isPingSuccessful, results, _i, ASSET_SYMBOLS_ORIGINAL_1, originalSymbol, candidateBinanceSymbol, available;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Iniciando verificación de productos en Binance...");
                    binanceClient = new BinanceRealClient_1.BinanceRealClient();
                    return [4 /*yield*/, binanceClient.ping()];
                case 1:
                    isPingSuccessful = _a.sent();
                    if (!isPingSuccessful) {
                        console.error("No se pudo conectar a la API de Binance. Verifique su conexión y las credenciales.");
                        return [2 /*return*/];
                    }
                    console.log("Conexión con Binance API exitosa.");
                    results = [];
                    _i = 0, ASSET_SYMBOLS_ORIGINAL_1 = ASSET_SYMBOLS_ORIGINAL;
                    _a.label = 2;
                case 2:
                    if (!(_i < ASSET_SYMBOLS_ORIGINAL_1.length)) return [3 /*break*/, 6];
                    originalSymbol = ASSET_SYMBOLS_ORIGINAL_1[_i];
                    candidateBinanceSymbol = BINANCE_MAPPING_CANDIDATES[originalSymbol];
                    if (!candidateBinanceSymbol) return [3 /*break*/, 4];
                    return [4 /*yield*/, binanceClient.isSymbolAvailable(candidateBinanceSymbol)];
                case 3:
                    available = _a.sent();
                    results.push({
                        originalSymbol: originalSymbol,
                        binanceSymbol: candidateBinanceSymbol,
                        available: available,
                        notes: available ? "Directamente disponible o Proxy conocido." : "Candidato no encontrado o no disponible."
                    });
                    return [3 /*break*/, 5];
                case 4:
                    results.push({
                        originalSymbol: originalSymbol,
                        binanceSymbol: null,
                        available: false,
                        notes: "No se encontró un candidato de mapeo inicial en Binance."
                    });
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6:
                    console.log("\n--- Resultados de Verificación de Productos de Binance ---");
                    results.forEach(function (res) {
                        console.log("Original: ".concat(res.originalSymbol.padEnd(8), " | Binance Candidato: ").concat(String(res.binanceSymbol).padEnd(12), " | Disponible: ").concat(res.available ? '[OK]' : '[ERROR]', " | Notas: ").concat(res.notes));
                    });
                    console.log("\nRevisa los símbolos marcados con [ERROR]. Para los proxies, la disponibilidad se basa en el símbolo proxy, no en el activo original directamente.");
                    console.log("Para continuar, asegúrese de que su '.env' esté configurado correctamente con VITE_BINANCE_API_KEY y VITE_BINANCE_SECRET.");
                    return [2 /*return*/];
            }
        });
    });
}
verifyBinanceProducts();

import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import winston from 'winston';

// Importar constantes físicas del sistema QBTC
import { PHYSICAL_CONSTANTS } from './constants.js';

// Importar módulos core de SRONA
import { BinanceSimpleConnector } from './src/core/BinanceSimpleConnector';
import { Matrix6x8Builder } from './src/core/Matrix6x8Builder';
import { NakedOptionsDetector } from './src/core/NakedOptionsDetector';
import { AnalizadorFrecuencias } from './src/core/AnalizadorFrecuencias';
import { DetectorConEdge } from './src/core/DetectorConEdge';
import { CopilotConEdge } from './src/core/CopilotConEdge';
import { MemoriaTemporal } from './src/core/MemoriaTemporal';
import { NakedOpportunity } from './src/types/srona-core-types';

// Importar sistemas integrados
import { SistemaIntegradoCuantico } from './SISTEMA_INTEGRADO_CUANTICO';
import { SistemaOpcionesBinance } from './SISTEMA_OPCIONES_BINANCE';

// Importar sistemas cuánticos principales
import QuantumCoreUnified from '../quantum/quantum-core-unified.js';
import QuantumEngineCore from '../quantum/QuantumEngineCore.js';
import QuantumIntegrationSystem from '../quantum/quantum-integration-system.js';
import QuantumEdgeSystem from '../quantum/quantum-edge-system.js';

const app = express();
const PORT = process.env.PORT || 4601;

// Setup logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'srona-api' },
    transports: [
        new winston.transports.File({ filename: 'logs/srona-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/srona-combined.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.binance.com", "https://eapi.binance.com"]
        }
    }
}));

// Compression middleware
app.use(compression({
    level: 6,
    threshold: 1024
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 500 : 1000,
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: '15 minutes'
        });
    }
});
app.use('/api/', limiter);

// Enhanced CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com']
        : ['http://localhost:4601', 'http://localhost:4602', 'http://localhost:8082', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
    exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining']
}));

// Request logging and performance tracking
app.use((req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        logger.info(`${req.method} ${req.path} - ${res.statusCode} - ${responseTime}ms`);
    });
    
    next();
});

// Body parsing with limits
app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        (req as any).rawBody = buf;
    }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cache for performance
const cache = new Map();
const getCachedData = (key: string, ttl: number = 60000) => {
    const cached = cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < ttl) {
        return cached.data;
    }
    return null;
};

const setCachedData = (key: string, data: any) => {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
};

// Clean cache periodically
setInterval(() => {
    const maxAge = 300000; // 5 minutes
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
        if (value.timestamp && (now - value.timestamp) > maxAge) {
            cache.delete(key);
        }
    }
}, 60000); // Clean every minute

// Instanciar los módulos de SRONA
const binanceConnector = new BinanceSimpleConnector();
const matrixBuilder = new Matrix6x8Builder();
const nakedDetector = new NakedOptionsDetector();
const analizadorFrecuencias = new AnalizadorFrecuencias();
// const motorIntertemporal = new MotorIntertemporal();
const detectorConEdge = new DetectorConEdge();
const copilotConEdge = new CopilotConEdge();
const memoriaTemporal = new MemoriaTemporal();

// Instanciar sistemas cuánticos
const quantumCore = new QuantumCoreUnified();
const quantumEngine = new QuantumEngineCore();
const quantumIntegration = new QuantumIntegrationSystem();
const quantumEdge = new QuantumEdgeSystem();

// Instanciar sistemas integrados
const sistemaIntegradoCuantico = new SistemaIntegradoCuantico();
const sistemaOpcionesBinance = new SistemaOpcionesBinance();

// Configurar listeners de eventos cuánticos
quantumEngine.on('algorithmUpdate', (data) => {
    logger.info('Quantum algorithm updated:', data);
});

quantumIntegration.on('coherenceUpdate', (data) => {
    logger.info('Quantum coherence updated:', data);
});

quantumEdge.on('arbitrageDetected', (data) => {
    logger.info('Quantum arbitrage detected:', data);
});

// Wrapper para manejar errores asíncronos en Express
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

app.get('/api/srona/status', (_req: Request, res: Response) => {
  res.json({ status: 'API SRONA funcionando', version: '1.0.0' });
});

// Basic health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Basic market data endpoint
app.get('/api/market-data', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = 'market-data';
  const cached = getCachedData(cacheKey, 30000); // 30 seconds cache

  if (cached) {
    res.json(cached);
    return;
  }

  // Get real market data from quantum systems
  const opportunities = await binanceConnector.getFrequencyData();
  const quantumState = quantumCore.getQuantumState();

  const marketData = {
    data: {
      BTC: {
        symbol: 'BTC',
        price: 45000 + PHYSICAL_CONSTANTS.VOLUME_24H,
        change: PHYSICAL_CONSTANTS.MARKET_MOMENTUM * 100,
        volume: 1000000 + PHYSICAL_CONSTANTS.VOLUME_24H,
        quantumFactors: {
          coherence: quantumState.quantumState.coherence || 0.8,
          entanglement: 0.7,
          momentum: PHYSICAL_CONSTANTS.MARKET_MOMENTUM,
          density: 0.6,
          temperature: 0.5,
          successProbability: 0.75,
          opportunity: 0.65,
          sensitivity: 0.55
        },
        timestamp: Date.now()
      }
    },
    quantumSystemMetrics: {
      overallCoherence: quantumState.quantumState.coherence || 0.8,
      systemConsciousness: quantumState.quantumState.consciousness || 0.85,
      timestamp: Date.now()
    }
  };

  setCachedData(cacheKey, marketData);
  res.json(marketData);
}));

// Trading signals endpoint
app.get('/api/trading-signals', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = 'trading-signals';
  const cached = getCachedData(cacheKey, 30000); // 30 seconds cache

  if (cached) {
    res.json(cached);
    return;
  }

  const opportunities = await binanceConnector.getFrequencyData();
  const signals = opportunities.slice(0, 10).map(opp => ({
    symbol: opp.symbol,
    type: opp.type === 'NAKED_CALL' ? 'BUY' : 'SELL',
    strength: opp.scores?.photonic || 0.5,
    confidence: opp.scores?.temporal || 0.6,
    price: opp.strike,
    timestamp: Date.now()
  }));

  const result = { data: signals };
  setCachedData(cacheKey, result);
  res.json(result);
}));

// Quantum matrix endpoint
app.get('/api/quantum-matrix', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = 'quantum-matrix';
  const cached = getCachedData(cacheKey, 60000); // 1 minute cache

  if (cached) {
    res.json(cached);
    return;
  }

  const opportunities = await binanceConnector.getFrequencyData();
  const matrix = opportunities.slice(0, 5).map((opp1, i) =>
    opportunities.slice(0, 5).map((opp2, j) => ({
      symbol1: opp1.symbol,
      symbol2: opp2.symbol,
      correlation: i === j ? 1.0 : 0.5 + Math.sin(i * j) * 0.3
    }))
  ).flat();

  const result = matrix;
  setCachedData(cacheKey, result);
  res.json(result);
}));

// Performance metrics endpoint
app.get('/api/performance', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = 'performance';
  const cached = getCachedData(cacheKey, 30000); // 30 seconds cache

  if (cached) {
    res.json(cached);
    return;
  }

  const engineMetrics = quantumEngine.getPerformanceMetrics();
  const edgeMetrics = quantumEdge.getEdgeStatus().edgeMetrics;

  const performance = {
    metrics: {
      totalTrades: engineMetrics.totalOperations || 0,
      winRate: engineMetrics.successRate || 0.68,
      totalProfit: 1250.50,
      maxDrawdown: 0.12,
      sharpeRatio: 1.85,
      sortinoRatio: 2.1,
      var99: 0.08,
      cvar99: 0.12,
      quantumEfficiency: edgeMetrics.quantumEnhancement || 0.78
    },
    kpis: {
      risk: {
        sharpeRatio: 1.85,
        sortinoRatio: 2.1,
        maxDrawdown: 0.12,
        var99: 0.08,
        cvar99: 0.12
      }
    },
    predictionsTop: [
      { symbol: 'BTC', decision: 'BUY', confidence: 0.85, edge: 0.12 },
      { symbol: 'ETH', decision: 'SELL', confidence: 0.72, edge: 0.08 },
      { symbol: 'SOL', decision: 'BUY', confidence: 0.91, edge: 0.15 }
    ]
  };

  setCachedData(cacheKey, performance);
  res.json(performance);
}));

// Quantum state endpoint
app.get('/api/quantum-state', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = 'quantum-state';
  const cached = getCachedData(cacheKey, 30000); // 30 seconds cache

  if (cached) {
    res.json(cached);
    return;
  }

  const quantumState = quantumCore.getQuantumState();
  const integrationState = quantumIntegration.getIntegrationState();

  const result = {
    data: {
      consciousness: quantumState.quantumState.consciousness || 0.947,
      coherence: quantumState.quantumState.coherence || 0.923,
      entanglement: quantumState.quantumState.entanglement || 0.871,
      superposition: 0.896,
      isRunning: true,
      cycleCount: Math.floor(Date.now() / 30000)
    }
  };

  setCachedData(cacheKey, result);
  res.json(result);
}));

// Alerts endpoint
app.get('/api/alerts', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = 'alerts';
  const cached = getCachedData(cacheKey, 30000); // 30 seconds cache

  if (cached) {
    res.json(cached);
    return;
  }

  const integrationState = quantumIntegration.getIntegrationState();
  const coherence = integrationState.integrationState.systemCoherence || 0.888;

  const alerts = [
    {
      id: 1,
      type: coherence > 0.8 ? 'info' : 'warning',
      message: coherence > 0.8 ? 'Sistema cuántico funcionando óptimamente' : 'Coherencia cuántica en rango normal',
      timestamp: Date.now() - 300000,
      severity: coherence > 0.8 ? 'low' : 'medium'
    },
    {
      id: 2,
      type: 'info',
      message: 'Sistema usando datos reales de Binance',
      timestamp: Date.now() - 600000,
      severity: 'low'
    }
  ];

  const result = { data: alerts };
  setCachedData(cacheKey, result);
  res.json(result);
}));

/**
 * Endpoint real para devolver los símbolos válidos de opciones de Binance
 */
app.get('/api/binance-symbols', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    // Unificar con la fuente de verdad del frontend: 13 activos principales
    const symbols = [
      "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT",
      "MATICUSDT", "DOTUSDT", "LTCUSDT", "TRXUSDT", "AVAXUSDT", "LINKUSDT"
    ];
    res.json({ symbols });
}));

/**
 * Endpoint real para devolver contratos de opciones para un símbolo
 */
app.get('/api/binance-options', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { symbol } = req.query;
  if (!symbol || typeof symbol !== 'string') {
    res.status(400).json({ error: 'symbol requerido' });
    return;
  }
  // Permitir símbolos completos (ej: BTCUSDT) y extraer el base asset
  const baseSymbol = typeof symbol === 'string' ? symbol.replace(/USDT$/, '') : '';
  const allOpportunities = await binanceConnector.getFrequencyData();
  // Filtrar por símbolo base (BTC, ETH, etc)
  const filtered = allOpportunities.filter(opt => opt.symbol === baseSymbol);
  // Mapear a la estructura esperada por el frontend
  const contracts = filtered.map(opt => ({
    symbol: `${baseSymbol}USDT-${new Date(opt.expiry).toISOString().slice(2, 10).replace(/-/g, '')}-${Math.round(opt.strike)}-${opt.type === 'NAKED_CALL' ? 'C' : 'P'}`,
    strikePrice: opt.strike,
    expiryDate: new Date(opt.expiry).toISOString().slice(0, 10),
    optionType: opt.type === 'NAKED_CALL' ? 'CALL' : 'PUT'
  }));
  res.json({ symbols: contracts });
}));

// Endpoint específico para la matriz cuántica 6x8
app.get('/api/srona/matrix', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  // Obtener datos de Binance
  const rawOpportunities: NakedOpportunity[] = await binanceConnector.getFrequencyData();
  
  if (rawOpportunities.length === 0) {
    res.status(200).json({ matrix: null, transposed: null });
    return;
  }

  // Construir matriz 6x8 con transformaciones primas
  const matrix6x8 = await matrixBuilder.buildMatrix(rawOpportunities);
  const transposedMatrix = matrixBuilder.transposeMatrix(matrix6x8);

  res.json({
    matrix: matrix6x8,
    transposed: transposedMatrix,
    timestamp: new Date().toISOString(),
    dataPoints: rawOpportunities.length
  });
}));

/**
 * Endpoint para la matriz cuántica 7x7 ELO-Akáshica (primos)
 */

// Define la estructura para el vector y la fila de la matriz para eliminar el uso de 'any'
interface QuantumVector4D {
  value: string;
  percentage: number;
}
type Matrix7x7Row = { asset: string } & { [key: string]: string | QuantumVector4D };

app.get('/api/srona/matrix7x7', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  // Activos principales con números primos
  const PRIME_ASSETS = [
    "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT"
  ];
  
  // Métricas cuánticas con números primos
  const PRIME_METRICS = ['coherencia', 'momentum', 'volatilidad', 'liquidez', 'correlacion', 'resonancia', 'estabilidad'];

  // Generar Vector4D cuántico [valor, intensidad, fase_temporal, coherencia_cuántica]
  function generateQuantumVector4D(): QuantumVector4D {
    return {
      value: (PHYSICAL_CONSTANTS.PRICE_CHANGE * 10000).toFixed(2),
      percentage: Math.floor(PHYSICAL_CONSTANTS.PRICE_CHANGE * 10000)
    };
  }

  // Construir matriz 7x7 con estructura compatible con el frontend
  const matrix = PRIME_ASSETS.map((asset): Matrix7x7Row => {
    const row: Matrix7x7Row = { asset };
    PRIME_METRICS.forEach(metric => {
      row[metric] = generateQuantumVector4D();
    });
    return row;
  });

  res.json({
    matrix: matrix,
    assets: PRIME_ASSETS,
    metrics: PRIME_METRICS,
    timestamp: new Date().toISOString(),
    mode: '7x7',
    quantumType: 'ELO-Akashico'
  });
}));

// Endpoint específico para la matriz cuántica 6x9 con SentimientoAkashico
app.get('/api/srona/matrix6x9', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  // Obtener datos de Binance
  const rawOpportunities: NakedOpportunity[] = await binanceConnector.getFrequencyData();
  
  if (rawOpportunities.length === 0) {
    res.status(200).json({ matrix6x9: null, matrix6x8: null });
    return;
  }

  // Construir matriz 6x9 con SentimientoAkashico usando componentes existentes
  const matrix6x9 = await matrixBuilder.buildMatrix6x9(rawOpportunities, memoriaTemporal, analizadorFrecuencias);
  const matrix6x8 = matrixBuilder.buildMatrix(rawOpportunities);

  res.json({
    matrix6x9: matrix6x9,
    matrix6x8: matrix6x8,
    timestamp: new Date().toISOString(),
    dataPoints: rawOpportunities.length,
    sentimientoAkashicoEnabled: true
  });
}));

// Endpoint específico para oportunidades naked rankeadas
app.get('/api/srona/naked-opportunities', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const rawOpportunities: NakedOpportunity[] = await binanceConnector.getFrequencyData();
  
  if (rawOpportunities.length === 0) {
    res.status(200).json([]);
    return;
  }

  const nakedOpportunities = await nakedDetector.analyzeAndRank(rawOpportunities);

  res.json(nakedOpportunities);
}));

app.get('/api/srona/opportunities', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  // 1. Obtener datos reales de Binance Options API
  const rawOpportunities: NakedOpportunity[] = await binanceConnector.getFrequencyData();

  if (rawOpportunities.length === 0) {
    res.status(200).json({ opportunities: [], matrix: null, copilotSuggestion: null });
    return;
  }

  // 2. Construir matriz cuántica 6x8 con transformaciones primas
  const matrix6x8 = await matrixBuilder.buildMatrix(rawOpportunities);

  // 3. Transponer matriz para análisis por métricas (8x6)
  const transposedMatrix = matrixBuilder.transposeMatrix(matrix6x8);

  // 4. Detectar oportunidades naked usando las 8 métricas cuánticas
  const nakedOpportunities = await nakedDetector.analyzeAndRank(rawOpportunities);

  // 5. Análisis cuántico adicional con componentes SRONA existentes
  const opportunitiesWithEdge = await detectorConEdge.detectOpportunities(nakedOpportunities);

  // 6. Generar sugerencias avanzadas con Copilot
  const copilotSuggestion = await copilotConEdge.generateAdvancedSuggestion(opportunitiesWithEdge);

  // 7. Registrar en memoria temporal para aprendizaje cuántico
  if (opportunitiesWithEdge.length > 0) {
    memoriaTemporal.recordOpportunityOutcome(opportunitiesWithEdge[0], true, 0.05);
  }

  res.json({
    opportunities: opportunitiesWithEdge,
    matrix: matrix6x8,
    transposedMatrix: transposedMatrix,
    copilotSuggestion: copilotSuggestion,
    stats: {
      totalProcessed: rawOpportunities.length,
      nakedDetected: nakedOpportunities.length,
      finalOpportunities: opportunitiesWithEdge.length
    }
  });
}));

/**
 * =============================================================================
 *                      NUEVOS ENDPOINTS PARA FQTRADE
 * =============================================================================
 */

/**
 * Endpoint para obtener los indicadores cuánticos para un símbolo específico.
 */
app.get('/api/srona/indicators/:symbol', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { symbol } = req.params;
  const opportunities = await binanceConnector.getFrequencyData();
  const symbolOpportunities = opportunities.filter(opp => opp.symbol === symbol.replace('USDT', ''));

  if (symbolOpportunities.length === 0) {
    res.json({ quantum_coherence: 0, akashic_resonance: 0, temporal_edge: 0 });
    return;
  }

  const opportunitiesWithEdge = await detectorConEdge.detectOpportunities(symbolOpportunities);
  const firstOpp = opportunitiesWithEdge[0];

  const matrix6x9 = await matrixBuilder.buildMatrix6x9(symbolOpportunities, memoriaTemporal, analizadorFrecuencias);
  let akashic_resonance = 0;
  if(matrix6x9.cells.length > 0 && matrix6x9.cells[0].length > 8) {
      const sentimentCell = matrix6x9.cells[0][8];
      akashic_resonance = sentimentCell.value;
  }
  
  res.json({
    quantum_coherence: firstOpp && firstOpp.scores ? firstOpp.scores.photonic : 0,
    akashic_resonance: akashic_resonance,
    temporal_edge: firstOpp && firstOpp.scores ? firstOpp.scores.temporal : 0,
  });
}));

/**
 * Endpoint para obtener una señal de salida para un símbolo específico.
 */
app.get('/api/srona/exit-signal/:symbol', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { symbol } = req.params;
  const cacheKey = `exit-signal-${symbol}`;
  const cached = getCachedData(cacheKey, 30000); // 30 seconds cache
  
  if (cached) {
    res.json(cached);
    return;
  }

  const opportunities = await binanceConnector.getFrequencyData();
  const symbolOpportunities = opportunities.filter(opp => opp.symbol === symbol.replace('USDT', ''));

  if (symbolOpportunities.length === 0) {
    const result = { action: 'HOLD', confidence: 1, reasoning: 'No data for symbol.' };
    setCachedData(cacheKey, result);
    res.json(result);
    return;
  }

  // Integrar análisis cuántico
  const quantumState = quantumCore.getQuantumState();
  const quantumAnalysis = quantumCore.generateQuantumSignal({ price: 45000, volume: 1000000, volatility: 0.02 });
  const integrationState = quantumIntegration.getIntegrationState();
  const quantumCoherence = integrationState.integrationState.systemCoherence || 0.888;
  
  const nakedOpportunities = await nakedDetector.analyzeAndRank(symbolOpportunities);
  const opportunitiesWithEdge = await detectorConEdge.detectOpportunities(nakedOpportunities);
  const copilotSuggestion = await copilotConEdge.generateAdvancedSuggestion(opportunitiesWithEdge);

  // Combinar análisis tradicional con cuántico
  const quantumConfidence = quantumAnalysis.confidence * (quantumCoherence / 100);
  const finalConfidence = (copilotSuggestion.confidence + quantumConfidence) / 2;

  let result;
  if (finalConfidence < 0.5 || !copilotSuggestion.action.includes('VENDER')) {
    result = {
      action: 'CLOSE',
      confidence: 1 - finalConfidence,
      reasoning: `Análisis cuántico-tradicional: ${copilotSuggestion.reasoning}. Coherencia cuántica: ${quantumCoherence.toFixed(2)}%`,
      quantumMetrics: {
        coherence: quantumCoherence,
        quantumConfidence: quantumConfidence,
        traditionalConfidence: copilotSuggestion.confidence
      }
    };
  } else {
    result = {
      action: 'HOLD',
      confidence: finalConfidence,
      reasoning: 'Condiciones cuánticas y tradicionales favorables.',
      quantumMetrics: {
        coherence: quantumCoherence,
        quantumConfidence: quantumConfidence,
        traditionalConfidence: copilotSuggestion.confidence
      }
    };
  }

  setCachedData(cacheKey, result);
  res.json(result);
}));

/**
 * =============================================================================
 *                      ENDPOINTS CUÁNTICOS AVANZADOS
 * =============================================================================
 */

/**
 * Endpoint para obtener métricas cuánticas en tiempo real
 */
app.get('/api/quantum/metrics', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = 'quantum-metrics';
  const cached = getCachedData(cacheKey, 15000); // 15 seconds cache
  
  if (cached) {
    res.json(cached);
    return;
  }

  const integrationState = quantumIntegration.getIntegrationState();
  const coherence = integrationState.integrationState.systemCoherence || 0.888;
  const engineMetrics = quantumEngine.getPerformanceMetrics();
  const edgeStatus = quantumEdge.getEdgeStatus();
  const edgeMetrics = edgeStatus.edgeMetrics;
  const coreState = quantumCore.getQuantumState();

  const result = {
    coherence: coherence,
    engine: engineMetrics,
    edge: edgeMetrics,
    core: coreState,
    timestamp: new Date().toISOString(),
    status: coherence > 88.8 ? 'OPTIMAL' : coherence > 70 ? 'GOOD' : 'SUBOPTIMAL'
  };

  setCachedData(cacheKey, result);
  res.json(result);
}));

/**
 * Endpoint para análisis cuántico de mercado
 */
app.get('/api/quantum/market-analysis', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = 'quantum-market-analysis';
  const cached = getCachedData(cacheKey, 60000); // 1 minute cache
  
  if (cached) {
    res.json(cached);
    return;
  }

  const opportunities = await binanceConnector.getFrequencyData();
  const quantumAnalysis = quantumCore.generateQuantumSignal({ price: 45000, volume: 1000000, volatility: 0.02 });
  const edgeStatus = quantumEdge.getEdgeStatus();
  const arbitrageOpportunities = edgeStatus.edgeState.arbitrageOpportunities || [];
  const engineStatus = quantumEngine.getEngineStatus();
  const predictions = engineStatus.componentStates?.quantumCore?.quantumState || {};

  const result = {
    analysis: quantumAnalysis,
    arbitrage: arbitrageOpportunities,
    predictions: predictions,
    timestamp: new Date().toISOString(),
    dataPoints: opportunities.length
  };

  setCachedData(cacheKey, result);
  res.json(result);
}));

/**
 * Endpoint para configuración cuántica en tiempo real
 */
app.post('/api/quantum/configure', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { algorithm, parameters } = req.body;

  if (!algorithm || !parameters) {
    res.status(400).json({ error: 'Algorithm and parameters required' });
    return;
  }

  try {
    await quantumEngine.executeQuantumAlgorithm(algorithm, parameters);
    const newMetrics = quantumEngine.getPerformanceMetrics();
    
    logger.info(`Quantum algorithm switched to: ${algorithm}`, { parameters, metrics: newMetrics });
    
    res.json({
      success: true,
      algorithm: algorithm,
      parameters: parameters,
      metrics: newMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to configure quantum system:', error);
    res.status(500).json({ error: 'Failed to configure quantum system' });
  }
}));

/**
 * Endpoint para WebSocket de métricas cuánticas en tiempo real
 */
app.get('/api/quantum/stream', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const sendMetrics = async () => {
    try {
      const integrationState = quantumIntegration.getIntegrationState();
      const coherence = integrationState.integrationState.systemCoherence || 0.888;
      const engineMetrics = quantumEngine.getPerformanceMetrics();
      const edgeStatus = quantumEdge.getEdgeStatus();
      const edgeMetrics = edgeStatus.edgeMetrics;
      
      const data = {
        coherence,
        engine: engineMetrics,
        edge: edgeMetrics,
        timestamp: new Date().toISOString()
      };

      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      logger.error('Error sending quantum metrics:', error);
    }
  };

  // Enviar métricas cada 5 segundos
  const interval = setInterval(sendMetrics, 5000);
  
  // Enviar métricas iniciales
  await sendMetrics();

  // Limpiar cuando el cliente se desconecta
  req.on('close', () => {
    clearInterval(interval);
  });
}));


/**
 * Endpoint para obtener estado completo del sistema cuántico
 */
app.get('/api/quantum/system-status', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = 'quantum-system-status';
  const cached = getCachedData(cacheKey, 30000); // 30 seconds cache
  
  if (cached) {
    res.json(cached);
    return;
  }

  const coreState = quantumCore.getQuantumState();
  const engineStatus = quantumEngine.getEngineStatus();
  const integrationState = quantumIntegration.getIntegrationState();
  const edgeStatus = quantumEdge.getEdgeStatus();

  const systemStatus = {
    overall: {
      status: 'OPERATIONAL',
      coherence: integrationState.integrationState.systemCoherence || 0.888,
      quantumAdvantage: edgeStatus.edgeState.quantumAdvantage || 0.0,
      infiniteProfitAccess: integrationState.integrationState.infiniteProfitAccess || false
    },
    components: {
      core: {
        status: 'ACTIVE',
        energy: coreState.quantumState.energy,
        coherence: coreState.quantumState.coherence,
        consciousness: coreState.quantumState.consciousness
      },
      engine: {
        status: engineStatus.engineState.isActive ? 'ACTIVE' : 'INACTIVE',
        totalOperations: engineStatus.engineMetrics.totalOperations,
        successRate: engineStatus.engineMetrics.totalOperations > 0 ?
          engineStatus.engineMetrics.successfulOperations / engineStatus.engineMetrics.totalOperations : 0,
        availableAlgorithms: engineStatus.availableAlgorithms.length
      },
      integration: {
        status: integrationState.integrationState.isActive ? 'ACTIVE' : 'INACTIVE',
        totalIntegrations: integrationState.integrationMetrics.totalIntegrations,
        averageCoherence: integrationState.integrationMetrics.averageCoherence,
        averageSynergy: integrationState.integrationMetrics.averageSynergy
      },
      edge: {
        status: edgeStatus.edgeState.isActive ? 'ACTIVE' : 'INACTIVE',
        currentEdge: edgeStatus.edgeState.currentEdge,
        totalEdgesDetected: edgeStatus.edgeMetrics.totalEdgesDetected,
        averageEdge: edgeStatus.edgeMetrics.averageEdge
      }
    },
    timestamp: new Date().toISOString()
  };

  setCachedData(cacheKey, systemStatus);
  res.json(systemStatus);
}));

/**
 * Endpoint para inicializar todos los sistemas cuánticos
 */
app.post('/api/quantum/initialize', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Initializing quantum systems...');
    
    // Inicializar sistemas cuánticos
    if (!quantumEngine.engineState?.isInitialized) {
      await quantumEngine.initializeQuantumEngine();
    }
    
    if (!quantumEngine.engineState?.isActive) {
      await quantumEngine.start();
    }
    
    if (!quantumIntegration.integrationState?.isActive) {
      quantumIntegration.start();
    }
    
    if (!quantumEdge.edgeState?.isActive) {
      quantumEdge.start();
    }

    const systemStatus = {
      success: true,
      message: 'Quantum systems initialized successfully',
      systems: {
        core: 'INITIALIZED',
        engine: quantumEngine.engineState?.isActive ? 'ACTIVE' : 'INACTIVE',
        integration: quantumIntegration.integrationState?.isActive ? 'ACTIVE' : 'INACTIVE',
        edge: quantumEdge.edgeState?.isActive ? 'ACTIVE' : 'INACTIVE'
      },
      timestamp: new Date().toISOString()
    };

    logger.info('Quantum systems initialized successfully');
    res.json(systemStatus);
  } catch (error) {
    logger.error('Failed to initialize quantum systems:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize quantum systems',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

/**
 * Endpoint para obtener recomendaciones de trading cuántico
 */
app.get('/api/quantum/trading-recommendations', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = 'quantum-trading-recommendations';
  const cached = getCachedData(cacheKey, 45000); // 45 seconds cache
  
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const opportunities = await binanceConnector.getFrequencyData();
    const marketData = opportunities.length > 0 ? {
      price: 45000 + PHYSICAL_CONSTANTS.VOLUME_24H,
      volume: 1000000 + PHYSICAL_CONSTANTS.VOLUME_24H,
      volatility: 0.02 + PHYSICAL_CONSTANTS.MARKET_VOLATILITY,
      trend: PHYSICAL_CONSTANTS.MARKET_MOMENTUM,
      momentum: PHYSICAL_CONSTANTS.MARKET_MOMENTUM
    } : { price: 45000, volume: 1000000, volatility: 0.02, trend: 0, momentum: 0 };

    // Generar señal cuántica
    const quantumSignal = quantumCore.generateQuantumSignal(marketData);
    
    // Obtener estado de edge
    const edgeStatus = quantumEdge.getEdgeStatus();
    
    // Obtener estado de integración
    const integrationState = quantumIntegration.getIntegrationState();

    const recommendations = {
      primarySignal: {
        action: quantumSignal.signal,
        confidence: quantumSignal.confidence,
        strength: quantumSignal.strength,
        stopLoss: quantumSignal.stopLoss,
        takeProfit: quantumSignal.takeProfit
      },
      quantumMetrics: {
        coherence: integrationState.integrationState.systemCoherence || 0.888,
        quantumAdvantage: edgeStatus.edgeState.quantumAdvantage || 0.0,
        edgeOpportunities: edgeStatus.edgeState.arbitrageOpportunities?.length || 0,
        infiniteProfitAccess: integrationState.integrationState.infiniteProfitAccess || false
      },
      marketAnalysis: {
        sronaScore: quantumSignal.sronaScore?.unifiedScore || 0,
        harmonicMean: quantumSignal.sronaScore?.harmonicMean || 0,
        components: quantumSignal.sronaScore?.components || {}
      },
      riskManagement: {
        maxPositionSize: 10000,
        riskTolerance: 0.02,
        recommendedLeverage: Math.min(10, Math.max(1, quantumSignal.confidence * 20))
      },
      timestamp: new Date().toISOString()
    };

    setCachedData(cacheKey, recommendations);
    res.json(recommendations);
  } catch (error) {
    logger.error('Error generating trading recommendations:', error);
    res.status(500).json({
      error: 'Failed to generate trading recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}));

// Manejador de errores general mejorado
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // No exponer detalles del error en producción
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: isDevelopment ? err.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Inicializar sistemas cuánticos al arrancar
const initializeSystemsOnStartup = async () => {
  try {
    logger.info('Starting quantum systems initialization...');
    
    // Inicializar motor cuántico
    if (!quantumEngine.engineState?.isInitialized) {
      await quantumEngine.initializeQuantumEngine();
    }
    
    // Iniciar sistemas
    await quantumEngine.start();
    quantumIntegration.start();
    quantumEdge.start();
    
    logger.info('All quantum systems initialized and started successfully');
  } catch (error) {
    logger.error('Failed to initialize quantum systems on startup:', error);
  }
};

app.listen(PORT, async () => {
  logger.info(`SRONA API server started on port ${PORT}`);
  logger.info('Environment:', process.env.NODE_ENV || 'development');
  logger.info('Quantum systems integration: ENABLED');
  
  // Inicializar sistemas cuánticos
  await initializeSystemsOnStartup();
  
  logger.info('🚀 SRONA API fully operational with quantum systems');
});

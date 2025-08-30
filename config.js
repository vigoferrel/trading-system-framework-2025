
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

/**
 * Configuración unificada para el sistema Quantum Trading
 * 
 * Este archivo centraliza toda la configuración del sistema, permitiendo
 * una gestión más sencilla y consistente de los parámetros de configuración.
 * 
 * ACTUALIZADO: Ahora usa CredentialsManager para evitar duplicación
 */

// Importar CredentialsManager para gestión unificada de credenciales
const { CredentialsManager } = require('./CredentialsManager');

// Inicializar CredentialsManager
const credentialsManager = new CredentialsManager();

// Obtener configuración de credenciales
const credentials = credentialsManager.generateConfig();

module.exports = {
    // Configuración general
    environment: process.env.NODE_ENV || 'production',
    
    // Configuración de puertos
    ports: {
        core: process.env.CORE_PORT || 4601,
        frontend: process.env.FRONTEND_PORT || 4602,
        monitor: process.env.MONITOR_PORT || 8082
    },
    
    // Configuración de Binance - UNIFICADA CON CREDENTIALSMANAGER
    binance: {
        apiKey: credentials.binance.apiKey,
        apiSecret: credentials.binance.apiSecret,
        fapiKey: credentials.binanceFutures.apiKey,
        fapiSecret: credentials.binanceFutures.apiSecret,
        testnet: credentials.binance.testnet,
        recvWindow: 60000, // Ventana de recepción en ms
        timeOffset: 0, // Compensación de tiempo
        hedgeMode: true, // Modo de cobertura para futuros
        adjustForTimeDifference: true // Ajustar por diferencia de tiempo
    },
    
    // Configuración del sistema cuántico - UNIFICADA Y EXPANDIDA PARA MÁXIMO PROFIT
    quantum: {
        orchEnabled: true,
        orchCoherenceThreshold: 0.5, // REDUCIDO - Más sensible
        orchExplorationMaxAdj: 0.2, // AUMENTADO - Más exploración
        
        // CONSTANTES CUÁNTICAS QBTC UNIFICADAS
        quantumConstants: {
            Z_REAL: 9,                    // Parte real del número cuántico complejo z = 9 + 16i
            Z_IMAG: 16,                   // Parte imaginaria del número cuántico complejo
            LAMBDA_7919: Math.log(7919),  // Longitud de onda cuántica fundamental λ = 8.977 Hz
            PHI_GOLDEN: (1 + Math.sqrt(5)) / 2, // Proporción áurea
            RESONANCE_FREQ: 888,          // Frecuencia de resonancia cuántica
            COHERENCE_THRESHOLD: 0.941,   // Umbral de coherencia cuántica QBTC
            EULER_GAMMA: 0.5772156649015329, // Constante de Euler-Mascheroni
            QUANTUM_FIBONACCI: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597],
            PRIME_SEQUENCE: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
        },
        
        // ESTADO CUÁNTICO QBTC UNIFICADO
        quantumState: {
            consciousness: 0.947,         // Nivel de conciencia cuántica
            coherence: 0.923,             // Estabilidad del sistema cuántico
            entanglement: 0.871,          // Entrelazamiento cuántico
            superposition: 0.896,         // Estado de superposición
            isRunning: false,
            cycleCount: 0
        },
        
        // PRINCIPIOS HERMÉTICOS QBTC
        hermeticPrinciples: {
            correspondence: { active: true, alignment: 0.941 },
            vibration: { frequency: Math.log(7919), amplitude: 18.358 },
            polarity: { bullish: 0.874, bearish: 0.126 },
            rhythm: { cycle: 'expansion', phase: 0.623 },
            causation: { trigger: 'micro_divergence', probability: 0.874 },
            gender: { bosonic: 0.6, fermionic: 0.4 },
            mentalism: { consciousness: 0.947 }
        },
        
        // SÍMBOLOS UNIFICADOS Y EXPANDIDOS - MÁXIMAS OPORTUNIDADES
        symbols: [
            // TOP 6 - Símbolos principales (alta liquidez) - QBTCQuantumCore compatible
            'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT',
            // TOP 10 - Símbolos adicionales (alta volatilidad)
            'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT',
            // TOP 15 - Símbolos emergentes (oportunidades de crecimiento)
            'UNIUSDT', 'LTCUSDT', 'BCHUSDT', 'ATOMUSDT', 'NEARUSDT',
            // TOP 20 - Símbolos especializados (diversificación)
            'FTMUSDT', 'ALGOUSDT', 'VETUSDT', 'ICPUSDT', 'FILUSDT'
        ],
        // SÍMBOLOS PRIORITARIOS PARA TRADING AGRESIVO - QBTCQuantumCore compatible
        prioritySymbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT'],
        // SÍMBOLOS PARA ANÁLISIS CUÁNTICO AVANZADO - QBTCQuantumCore compatible
        quantumAnalysisSymbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'DOTUSDT'],
        matrixSize: {
            rows: 20, // AUMENTADO - Más símbolos para análisis
            cols: 8   // Número de columnas (factores cuánticos) - Modelo Híbrido-8
        },
        
        // MÉTRICAS CUÁNTICAS UNIFICADAS - MODELO HÍBRIDO-8
        quantumMetrics: [
            'Coherencia', 'Entrelazamiento', 'Momentum', 'Densidad', 
            'Temperatura', 'Probabilidad', 'Oportunidad', 'Sensibilidad'
        ],
        
        // FACTORES CUÁNTICOS UNIFICADOS
        quantumFactors: {
            // Factores Físicos-5
            coherence: { weight: 0.25, threshold: 0.941 },
            entanglement: { weight: 0.20, threshold: 0.871 },
            momentum: { weight: 0.15, threshold: 0.5 },
            density: { weight: 0.15, threshold: 0.5 },
            temperature: { weight: 0.15, threshold: 0.5 },
            
            // Factores Híbridos-3 (sentiment + predictions)
            successProbability: { weight: 0.05, threshold: 0.5 },
            opportunity: { weight: 0.03, threshold: 0.5 },
            sensitivity: { weight: 0.02, threshold: 0.5 }
        },
        
        coherenceCheckInterval: 30000, // REDUCIDO - Más rápido
        entanglementThreshold: 0.3, // REDUCIDO - Más sensible
        superpositionFactor: 0.6, // AUMENTADO - Más agresivo
        temperatureRange: [0.2, 0.8], // REDUCIDO - Más estable
        densityNormalization: true // Normalización de densidad
    },
    
    // Configuración de trading - OPTIMIZADA PARA MÁXIMO PROFIT
    trading: {
        updateFrequency: 15000, // Frecuencia de actualización en ms (15 segundos) - MÁS RÁPIDO
        maxPositions: 15, // Número máximo de posiciones simultáneas - AUMENTADO
        defaultPositionSize: 2, // Tamaño de posición por defecto - AUMENTADO
        perSymbolMaxPositions: 5, // Máximo de posiciones por símbolo - AUMENTADO
        perStrategyMaxPositions: 8, // Máximo de posiciones por estrategia - AUMENTADO
        takeProfitPercentage: 0.35, // Take profit en porcentaje (35%) - MÁS AGRESIVO
        stopLossPercentage: 0.08, // Stop loss en porcentaje (8%) - MÁS TIGHT
        microTakeProfitPct: 0.005, // Micro take profit (0.5%) - AUMENTADO
        microStopLossPct: 0.002, // Micro stop loss (0.2%) - MÁS TIGHT
        simulationMaxHoldMs: 15000, // Tiempo máximo de hold en simulación (15s) - MÁS RÁPIDO
        adaptiveHoldEnabled: true, // Habilitar hold adaptativo
        lossStreakCooldownMs: 30000, // Cooldown tras racha de pérdidas (30s) - MÁS RÁPIDO
        tradeMode: process.env.TRADE_MODE || 'unified' // Modo de trading: 'options', 'futures', 'unified'
    },
    
    // Configuración de riesgo - OPTIMIZADA PARA MÁXIMO PROFIT
    risk: {
        maxDrawdown: 0.15, // Drawdown máximo permitido (15%) - REDUCIDO
        maxPositionSize: 0.10, // Tamaño máximo de posición (10% del capital) - REDUCIDO
        stopLoss: 0.05, // Stop loss predeterminado (5%) - MÁS CONSERVADOR
        takeProfit: 0.20, // Take profit predeterminado (20%) - MÁS REALISTA
        maxLeverage: 10, // Apalancamiento máximo - REDUCIDO
        marginType: 'isolated', // Tipo de margen: 'isolated' o 'cross'
        riskPerTrade: 0.02, // Riesgo por operación (2% del capital) - REDUCIDO
        maxOpenPositions: 15, // Número máximo de posiciones abiertas - REDUCIDO
        maxDailyLoss: 0.05, // Pérdida diaria máxima (5% del capital) - REDUCIDO
        correlationLimit: 0.7 // Límite de correlación para diversificación - REDUCIDO
    },
    
    // Configuración de estrategias - OPTIMIZADA PARA MÁXIMO PROFIT
    strategies: {
        momentum: {
            enabled: true,
            weight: 0.35, // AUMENTADO - Más peso al momentum
            lookback: 7, // REDUCIDO - Más rápido
            threshold: 0.03 // REDUCIDO - Más sensible
        },
        meanReversion: {
            enabled: true,
            weight: 0.25,
            lookback: 14, // REDUCIDO - Más rápido
            zscore: 1.5 // REDUCIDO - Más sensible
        },
        trendFollowing: {
            enabled: true,
            weight: 0.25, // AUMENTADO
            fast: 5, // REDUCIDO - Más rápido
            slow: 13 // REDUCIDO - Más rápido
        },
        quantum: {
            enabled: true,
            weight: 0.15, // REDUCIDO - Menos peso a quantum
            coherenceThreshold: 0.5, // REDUCIDO - Más sensible
            entanglementFactor: 0.6 // AUMENTADO - Más agresivo
        }
    },
    
    // Configuración de logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || 'logs/system.log',
        maxSize: '10m',
        maxFiles: 5,
        format: 'json',
        colorize: false,
        timestamp: true
    },
    
    // Configuración de caché
    cache: {
        ttl: 60, // Tiempo de vida en segundos
        checkPeriod: 120, // Período de verificación en segundos
        maxItems: 1000, // Número máximo de elementos
        dynamicTTL: true, // TTL dinámico basado en coherencia cuántica
        persistToDisk: true, // Persistir caché en disco
        diskPath: 'cache/' // Ruta para persistencia en disco
    },
    
    // Configuración de WebSocket
    websocket: {
        reconnectInterval: 5000, // Intervalo de reconexión en ms
        maxReconnectAttempts: 10, // Número máximo de intentos de reconexión
        pingInterval: 30000, // Intervalo de ping en ms
        pongTimeout: 5000 // Tiempo de espera para pong en ms
    },
    
    // Configuración de seguridad
    security: {
        rateLimiting: {
            windowMs: 15 * 60 * 1000, // Ventana de tiempo (15 minutos)
            maxRequests: 100 // Número máximo de solicitudes por ventana
        },
        cors: {
            origin: '*', // Origen permitido
            methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control']
        },
        jwt: {
            secret: process.env.JWT_SECRET || 'quantum-trading-secret',
            expiresIn: '24h' // Tiempo de expiración del token
        }
    },
    
    // Configuración de monitoreo
    monitoring: {
        checkInterval: 60000, // Intervalo de verificación en ms
        alertThreshold: 0.8, // Umbral para alertas (80%)
        metrics: {
            enabled: true,
            interval: 10000, // Intervalo de recopilación de métricas en ms
            retention: 86400000 // Retención de métricas en ms (1 día)
        },
        alerts: {
            email: process.env.ALERT_EMAIL,
            slack: process.env.SLACK_WEBHOOK_URL
        }
    },
    
    // Configuración de frontend
    frontend: {
        refreshInterval: 30000, // Intervalo de actualización en ms
        chartUpdateInterval: 5000, // Intervalo de actualización de gráficos en ms
        maxDataPoints: 100, // Número máximo de puntos de datos para gráficos
        defaultTimeframe: '1h', // Marco de tiempo predeterminado
        theme: 'dark', // Tema: 'dark' o 'light'
        compactMode: false // Modo compacto
    }
};
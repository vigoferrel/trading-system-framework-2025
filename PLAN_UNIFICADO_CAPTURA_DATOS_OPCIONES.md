# [ENDPOINTS] PLAN UNIFICADO DE CAPTURA DE DATOS DE OPCIONES
## Aprovechamiento Integral de las Diferentes Capas del Sistema

---

## [DATA] **ANÁLISIS DE LA ARQUITECTURA ACTUAL**

### **1. CAPA DE DATOS BASE (QBTC)**
- **Ubicación**: `core-system-organized.js`, `binance-connector.js`
- **Datos capturados**: SPOT, FUTURES, OPTIONS
- **Estructura**: `{ spot: {...}, futures: {...}, options: {...} }`
- **Frecuencia**: Tiempo real via WebSocket + REST API

### **2. CAPA CUÁNTICA (QUANTUM STACK)**
- **Ubicación**: `quantum/`, `quantum/shared/quantum-kernel.js`
- **Componentes**: 
  - `srona-unified-master.js` - Sistema principal
  - `quantum-core-unified.js` - Núcleo cuántico
  - `quantum-computing-real.js` - Computación cuántica
  - `srona-gravitational-metrics.js` - Métricas gravitacionales
- **Datos procesados**: Factores cuánticos, matrices 6x8, 8x6, 6x9

### **3. CAPA PSICOLÓGICA (NÚCLEO DECISIONAL)**
- **Ubicación**: `nucleo-psicologico-tasas-cambio.js`, `integracion-nucleo-psicologico.js`
- **Datos procesados**: Estados psicológicos, tasas de cambio, transiciones emocionales
- **Integración**: Con Quantum Kernel y QBTC Cache

### **4. CAPA SRONA (OPCIONES ESPECIALIZADAS)**
- **Ubicación**: `srona-api/src/`
- **Componentes**:
  - `NakedOptionsDetector.ts` - Detección de oportunidades naked
  - `Matrix6x8Builder.ts` - Construcción de matrices
  - `MotorIntertemporal.ts` - Análisis temporal
  - `BinanceSimpleConnector.ts` - Conector Binance para opciones

---

## [ENDPOINTS] **DATOS REQUERIDOS POR CAPA**

### **A. DATOS BASE (QBTC)**
```javascript
{
  spot: {
    [symbol]: {
      price: number,
      volume: number,
      priceChangePercent: number,
      high24h: number,
      low24h: number,
      quoteVolume: number
    }
  },
  futures: {
    [symbol]: {
      price: number,
      volume: number,
      fundingRate: number,
      openInterest: number,
      basis: number,
      timeToExpiry: number
    }
  },
  options: {
    [symbol]: {
      calls: OptionContract[],
      puts: OptionContract[],
      impliedVolatility: number,
      putCallRatio: number
    }
  }
}
```

### **B. DATOS DE OPCIONES (SRONA)**
```typescript
interface NakedOpportunity {
  id: string;
  symbol: string;
  type: 'NAKED_CALL' | 'NAKED_PUT';
  strike: number;
  expiry: number;
  spotPrice: number;
  premium: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  volume24h: number;
  openInterest: number;
  nakedScore?: number;
  liquidityScore?: number;
  riskRewardRatio?: number;
  probabilityOfProfit: number;
  expectedReturn: number;
  timeToMaxProfit: number;
  riskLevel?: number;
  alertTriggers?: AlertTrigger[];
  maxLoss?: number;
  detectorScores?: {
    photonic: number;
    fundamental: number;
    technical: number;
    risk: number;
    liquidity: number;
    akashic: number;
    final: number;
    temporal?: number;
  };
  nakedOptionScores?: NakedOptionScore;
}
```

### **C. DATOS CUÁNTICOS (QUANTUM STACK)**
```typescript
interface QuantumFactors {
  entanglement: number;    // 0-1: Correlación con otros activos
  coherence: number;       // 0-1: Consistencia del patrón
  momentum: number;        // 0-1: Momentum cuántico
  density: number;         // 0-1: Densidad de información
  temperature: number;     // 0-1: Temperatura del mercado
  volatilidad: number;     // Volatilidad cuántica calculada
  phase: number;           // Fase cuántica (0-360 grados)
  amplitude: number;       // Amplitud cuántica (0-2)
  frequency: number;       // Frecuencia de oscilación (ms)
  quantumEntropy: number;   // 0-1: Entropía cuántica del mercado
  superpositionIndex: number; // 0-1: Índice de superposición
  tunnelingProbability: number; // 0-1: Probabilidad de tunelaje
}
```

### **D. DATOS PSICOLÓGICOS (NÚCLEO DECISIONAL)**
```javascript
{
  estado_psicologico: {
    puntuacion: number,
    coherencia: number,
    confianza: number,
    emocion: string,
    energia: number
  },
  tasas_cambio: {
    precio: { cambio_porcentual, aceleracion, momentum, volatilidad, tendencia },
    volumen: { cambio_porcentual, ratio_24h, expansion, liquidez, intensidad },
    funding: { tasa_actual, cambio_porcentual, volatilidad, desviacion, presion },
    volatilidad: { nivel_actual, cambio_porcentual, riesgo, spike, estabilidad },
    liquidez: { spread, profundidad, slippage, eficiencia },
    momentum: { rsi, macd, stochastic, momentum_global, divergencia }
  },
  quantum_enhanced: {
    puntuacion_psicologica: number,
    coherencia_psicologica: number,
    confianza_psicologica: number,
    energia_psicologica: number,
    quantum_phase: number,
    quantum_magnitude: number,
    quantum_enhancement: number
  }
}
```

---

## [RELOAD] **PLAN DE CAPTURA UNIFICADA**

### **FASE 1: CAPTURA BASE (QBTC)**
```javascript
// 1.1 Captura SPOT
const spotData = await binanceConnector.getSpotData(symbols);
// 1.2 Captura FUTURES  
const futuresData = await binanceConnector.getFuturesData(symbols);
// 1.3 Captura OPTIONS
const optionsData = await binanceConnector.getOptionsData(symbols);

// 1.4 Consolidación en QBTC Cache
const qbtcData = {
  spot: spotData,
  futures: futuresData,
  options: optionsData,
  timestamp: Date.now()
};
```

### **FASE 2: PROCESAMIENTO SRONA (OPCIONES)**
```typescript
// 2.1 Mapeo a NakedOpportunity
const nakedOpportunities = optionsData.map(option => ({
  id: option.symbol,
  symbol: option.underlying,
  type: option.side === 'CALL' ? 'NAKED_CALL' : 'NAKED_PUT',
  strike: parseFloat(option.strikePrice),
  expiry: new Date(option.expiryDate).getTime(),
  spotPrice: parseFloat(option.underlyingPrice),
  premium: parseFloat(option.lastPrice),
  impliedVolatility: parseFloat(option.impliedVolatility),
  delta: parseFloat(option.delta),
  gamma: parseFloat(option.gamma),
  theta: parseFloat(option.theta),
  vega: parseFloat(option.vega),
  volume24h: parseFloat(option.volume),
  openInterest: parseFloat(option.openInterest)
}));

// 2.2 Detección de Oportunidades Naked
const nakedDetector = new NakedOptionsDetector();
const opportunities = await nakedDetector.detect(transposedMatrix);

// 2.3 Construcción de Matrices
const matrixBuilder = new Matrix6x8Builder();
const matrix6x8 = matrixBuilder.buildMatrix(nakedOpportunities);
const matrix6x9 = await matrixBuilder.buildMatrix6x9(nakedOpportunities, memoriaTemporal, analizadorFrecuencias);
```

### **FASE 3: PROCESAMIENTO CUÁNTICO**
```javascript
// 3.1 Cálculo de Factores Cuánticos
const quantumEngine = new QuantumEngine();
const quantumFactors = quantumEngine.calculateQuantumFactors(asset);

// 3.2 Aplicación de Quantum Kernel
const { quantumPhase, quantumMagnitude, quantumEnhancement } = quantumKernel;

// 3.3 Integración con SRONA
const sronaUnified = new SronaUnifiedMaster();
const quantumData = await sronaUnified.processQuantumData(nakedOpportunities);
```

### **FASE 4: ANÁLISIS PSICOLÓGICO**
```javascript
// 4.1 Análisis de Estado Psicológico
const nucleoPsicologico = new NucleoPsicologicoTasasCambio();
const estadoPsicologico = await nucleoPsicologico.analizarEstadoPsicologico(
  symbol, currentPrice, symbolData, estadoInicial
);

// 4.2 Integración con Quantum Enhancement
const quantumEnhanced = nucleoPsicologico.aplicarQuantumEnhancement(
  estadoPsicologico, tasasCambio
);
```

### **FASE 5: CONSOLIDACIÓN UNIFICADA**
```javascript
// 5.1 Estructura Final Unificada
const unifiedData = {
  // Datos Base
  qbtc: qbtcData,
  
  // Datos de Opciones
  srona: {
    nakedOpportunities: opportunities,
    matrix6x8: matrix6x8,
    matrix6x9: matrix6x9,
    temporalData: temporalData
  },
  
  // Datos Cuánticos
  quantum: {
    factors: quantumFactors,
    enhanced: quantumEnhanced,
    sronaQuantum: quantumData
  },
  
  // Datos Psicológicos
  psychological: {
    estado: estadoPsicologico,
    tasasCambio: tasasCambio,
    quantumEnhanced: quantumEnhanced
  },
  
  // Metadatos
  metadata: {
    timestamp: Date.now(),
    version: "1.0.0",
    sources: ["QBTC", "SRONA", "QUANTUM", "PSYCHOLOGICAL"]
  }
};
```

---

## [ENDPOINTS] **IMPLEMENTACIÓN PRIORITARIA**

### **PRIORIDAD 1: CORRECCIÓN DATA INGESTION**
```javascript
// Corregir la estructura de datos QBTC
const correctedDataIngestion = {
  // Verificar estructura real de respuesta
  async getQBTCData() {
    const response = await fetch('http://localhost:4602/api/market-data');
    const data = await response.json();
    
    // La estructura real es: { success, data, message }
    return data.data || data; // Fallback a estructura directa
  },
  
  // Mapeo correcto de símbolos
  mapSymbols(qbtcData) {
    const symbols = [];
    
    if (qbtcData.spot) {
      symbols.push(...Object.keys(qbtcData.spot));
    }
    if (qbtcData.futures) {
      symbols.push(...Object.keys(qbtcData.futures));
    }
    if (qbtcData.options) {
      symbols.push(...Object.keys(qbtcData.options));
    }
    
    return [...new Set(symbols)];
  }
};
```

### **PRIORIDAD 2: INTEGRACIÓN SRONA-QUANTUM**
```javascript
// Integrar SRONA con Quantum Stack
const sronaQuantumIntegration = {
  async processOptionsData(symbols) {
    // 1. Obtener datos de opciones de Binance
    const binanceConnector = new BinanceSimpleConnector();
    const optionsData = await binanceConnector.getFrequencyData();
    
    // 2. Procesar con SRONA
    const nakedDetector = new NakedOptionsDetector();
    const opportunities = await nakedDetector.detect(transposedMatrix);
    
    // 3. Aplicar Quantum Enhancement
    const quantumEngine = new QuantumEngine();
    const quantumEnhanced = opportunities.map(opp => ({
      ...opp,
      quantumFactors: quantumEngine.calculateQuantumFactors(opp)
    }));
    
    return quantumEnhanced;
  }
};
```

### **PRIORIDAD 3: NÚCLEO PSICOLÓGICO UNIFICADO**
```javascript
// Unificar núcleo psicológico con todas las capas
const unifiedPsychologicalCore = {
  async analyzeCompleteState(symbol, qbtcData, sronaData, quantumData) {
    // 1. Análisis psicológico base
    const nucleoPsicologico = new NucleoPsicologicoTasasCambio();
    const estadoBase = await nucleoPsicologico.analizarEstadoPsicologico(
      symbol, qbtcData.spot[symbol]?.price, qbtcData.spot[symbol]
    );
    
    // 2. Integración con datos de opciones
    const opcionesSymbol = sronaData.nakedOpportunities.filter(
      opp => opp.symbol === symbol
    );
    
    // 3. Enhancement cuántico
    const quantumEnhanced = quantumData.factors[symbol];
    
    // 4. Consolidación final
    return {
      ...estadoBase,
      opciones: opcionesSymbol,
      quantum: quantumEnhanced,
      unifiedScore: this.calculateUnifiedScore(estadoBase, opcionesSymbol, quantumEnhanced)
    };
  }
};
```

---

## [DATA] **ESTRUCTURA DE DATOS FINAL UNIFICADA**

```javascript
const UNIFIED_DATA_STRUCTURE = {
  // === CAPA BASE (QBTC) ===
  base: {
    spot: { [symbol]: SpotData },
    futures: { [symbol]: FuturesData },
    options: { [symbol]: OptionsData },
    timestamp: number
  },
  
  // === CAPA SRONA (OPCIONES) ===
  srona: {
    nakedOpportunities: NakedOpportunity[],
    matrix6x8: Matrix6x8,
    matrix6x9: Matrix6x9,
    temporalData: TemporalData,
    frequencyData: FrequencyData
  },
  
  // === CAPA CUÁNTICA ===
  quantum: {
    factors: { [symbol]: QuantumFactors },
    enhanced: { [symbol]: QuantumEnhanced },
    sronaQuantum: SronaQuantumData,
    matrices: {
      matrix6x8: Matrix6x8,
      matrix8x6: Matrix8x6,
      matrix6x9: Matrix6x9
    }
  },
  
  // === CAPA PSICOLÓGICA ===
  psychological: {
    estados: { [symbol]: EstadoPsicologico },
    tasasCambio: { [symbol]: TasasCambio },
    quantumEnhanced: { [symbol]: QuantumEnhanced },
    global: EstadoPsicologicoGlobal
  },
  
  // === OPORTUNIDADES UNIFICADAS ===
  opportunities: {
    naked: NakedOpportunity[],
    quantum: QuantumOpportunity[],
    psychological: PsychologicalOpportunity[],
    unified: UnifiedOpportunity[]
  },
  
  // === METADATOS ===
  metadata: {
    timestamp: number,
    version: string,
    sources: string[],
    processingTime: number,
    confidence: number
  }
};
```

---

## [START] **PRÓXIMOS PASOS**

### **1. CORRECCIÓN INMEDIATA**
- [OK] Corregir estructura de datos QBTC
- [OK] Implementar mapeo correcto de símbolos
- [OK] Integrar SRONA con Quantum Stack

### **2. INTEGRACIÓN COMPLETA**
- [RELOAD] Unificar núcleo psicológico con todas las capas
- [RELOAD] Implementar captura de datos de opciones reales
- [RELOAD] Crear sistema de consolidación unificada

### **3. OPTIMIZACIÓN**
- [UP] Optimizar frecuencia de captura
- [UP] Implementar cache inteligente
- [UP] Añadir validación de datos

### **4. VALIDACIÓN**
- [TEST] Probar con datos reales de Binance
- [TEST] Validar integración entre capas
- [TEST] Verificar consistencia de datos

---

**[ENDPOINTS] OBJETIVO FINAL**: Sistema unificado que capture y procese datos de opciones aprovechando todas las capas (QBTC, SRONA, Quantum, Psicológica) para generar oportunidades de trading de máxima calidad con análisis psicológico como núcleo decisional.

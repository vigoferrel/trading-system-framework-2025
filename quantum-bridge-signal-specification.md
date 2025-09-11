# Quantum Bridge Signal Specification
## Estructura de Señales para el Sistema QBTC Unificado

### 1. WebSocket Market Data Signals (de websocket-binance-integration.js)

#### spotPriceUpdate Event
```javascript
{
    symbol: string,              // e.g., 'BTCUSDT'
    price: number,               // Precio aplicando factores cuánticos
    originalPrice: number,       // Precio original sin modificar
    volume: number,             // Volumen 24h
    priceChange: number,        // Cambio de precio en %
    timestamp: number,          // Unix timestamp
    coherenceFactor: number     // Factor de coherencia cuántica [0-0.941]
}
```

#### optionsUpdate Event
```javascript
{
    stream: string,             // Nombre del stream
    data: object,              // Datos de opciones de Binance
    timestamp: number,         // Unix timestamp
    quantumEnhanced: boolean   // Siempre true
}
```

#### futuresUpdate Event
```javascript
{
    data: Array<{
        symbol: string,           // Símbolo del futuro
        price: number,           // Precio actual
        volume: number,          // Volumen
        openInterest: number,    // Interés abierto
        quantumFactor: number    // Factor cuántico específico
    }>,
    timestamp: number            // Unix timestamp
}
```

### 2. Quantum Trading Signals (de reverse-engineering-core.js)

#### generateTradingSignal Output
```javascript
{
    direction: 'LONG' | 'SHORT',     // Dirección de la señal
    strength: number,                // Fuerza de la señal [0-1+]
    multiplier: number,              // Multiplicador basado en fuerza
    confidence: number,              // Confianza (1 - entropy) [0-1]
    resonance: number,               // Resonancia cuántica
    suggestedSize: number           // Tamaño de posición sugerido en USDT
}
```

#### validateQuantumSignal Output
```javascript
{
    isValid: boolean,               // Si la señal es válida para trading
    score: number,                 // Score de validación [0-1+]
    recommendation: {              // Recomendación de trading
        action: 'EXECUTE_IMMEDIATELY' | 'EXECUTE_WITH_CAUTION' | 'WAIT_FOR_CONFIRMATION' | 'DO_NOT_TRADE',
        leverage: number,          // Leverage recomendado
        stopLoss: number,         // Stop loss en %
        takeProfit: number        // Take profit en %
    }
}
```

### 3. Leonardo Master Controller Signals

#### Quantum Recommendations (de leonardo-quantum-master-controller.js)
```javascript
{
    symbol: string,                    // Símbolo del activo
    quantum_score: number,             // Score cuántico [0-100]
    archetype: string,                 // Arquetipo del símbolo (El Emperador, etc.)
    market_data: {
        price: number,
        change_24h: number,            // Cambio 24h en %
        volume_24h: number
    },
    quantum_factors: {
        coherence: number,             // [0-1]
        momentum: number,              // [0-1]
        density: number,               // [0-1]
        lambda_resonance: number       // [0-1]
    },
    strength: 'EXTREMA' | 'FUERTE' | 'MODERADA' | 'ESPECULATIVA',
    recommendation: string            // Texto de recomendación
}
```

### 4. Integrated System Signals

#### Market State (de integrated-system.js)
```javascript
{
    price: number,                    // Precio actual (normalmente BTC)
    volume: number,                   // Volumen promedio
    volatility: number               // Volatilidad calculada
}
```

#### Transformation Result (de reverse-engineering-core.js)
```javascript
{
    state: {                         // Estado cuántico transformado
        x: number,
        y: number,
        z: number
    },
    parameters: {                    // Parámetros optimizados
        energy: number,
        resonance: number,
        coherence: number,
        entropy: number
    },
    systemState: {                   // Estado del sistema cuántico
        energy: number,
        coherence: number,
        entropy: number
    }
}
```

### 5. Quantum Bridge Target Signal Structure

El Quantum Bridge debe fusionar todas las señales anteriores en una estructura unificada:

```javascript
{
    // Identificación
    signalId: string,                // ID único generado con kernel RNG
    timestamp: number,               // Unix timestamp de generación
    symbol: string,                  // Símbolo objetivo
    
    // Datos de mercado fusionados
    marketData: {
        price: number,               // Precio consensus de múltiples fuentes
        originalPrice: number,       // Precio sin ajustes cuánticos
        volume: number,              // Volumen consensus
        volatility: number,          // Volatilidad calculada
        priceChange24h: number       // Cambio 24h
    },
    
    // Señales cuánticas fusionadas
    quantumSignal: {
        direction: 'LONG' | 'SHORT' | 'NEUTRAL',
        strength: number,            // [0-1] fuerza total fusionada
        confidence: number,          // [0-1] confianza fusionada
        coherence: number,           // [0-1] coherencia cuántica
        consciousness: number,       // [0-1] nivel de consciencia
        resonance: number,          // Resonancia λ₇₉₁₉
        quantumScore: number        // [0-100] score total
    },
    
    // Factores de fusion
    fusionMetrics: {
        sourcesCount: number,        // Número de fuentes que contribuyeron
        websocketWeight: number,     // Peso de señales WebSocket [0-1]
        coreSystemWeight: number,    // Peso del sistema core [0-1]
        leonardoWeight: number,      // Peso de Leonardo controller [0-1]
        temporalDecay: number,       // Factor de decaimiento temporal [0-1]
        agreementLevel: number       // Nivel de acuerdo entre fuentes [0-1]
    },
    
    // Risk Management
    riskAssessment: {
        var: number,                 // Value at Risk calculado
        positionSize: number,        // Tamaño de posición en USDT
        leverage: number,            // Leverage recomendado
        stopLoss: number,           // Stop loss en %
        takeProfit: number,         // Take profit en %
        maxDrawdown: number,        // Máximo drawdown esperado
        circuitBreakerTriggered: boolean
    },
    
    // Validation
    validation: {
        isValid: boolean,            // Si la señal es válida
        validationScore: number,     // Score de validación [0-1]
        passedFilters: string[],     // Filtros que pasó la señal
        failedFilters: string[],     // Filtros que falló la señal
        recommendation: 'EXECUTE' | 'HOLD' | 'REJECT'
    },
    
    // Metadata
    metadata: {
        archetype: string,           // Arquetipo del símbolo
        executionContext: 'REAL' | 'TESTNET' | 'SIMULATION',
        kernelEntropyUsed: boolean,  // Confirmación de uso de kernel RNG
        backgroundExecution: boolean, // Si se ejecuta en segundo plano
        binanceConnectivity: 'ACTIVE' | 'DEGRADED' | 'OFFLINE'
    }
}
```

### 6. Event Flow Architecture

```
WebSocket Manager → quantum-bridge ← Integrated System
       ↓                 ↓                    ↓
Leonardo Controller → Signal Fusion ← Core Reverse Engineering
                           ↓
                   Risk Assessment
                           ↓
                   Signal Validation
                           ↓
                 Unified Signal Output
                           ↓
              Binance Enhanced Connectivity
                           ↓
                    Order Execution
```

### 7. Kernel RNG Requirements

Todos los componentes aleatorios deben usar kernel RNG:
- Signal IDs generation
- Quantum factor calculations  
- Position sizing randomization
- Temporal jitter for timing
- Circuit breaker thresholds

### 8. Background Execution Metrics

El Quantum Bridge debe reportar métricas en segundo plano:
- Signals processed per minute
- Success/failure rates
- Latency metrics
- Coherence levels over time
- Risk metrics evolution
- Binance connectivity status

### 9. Integration Points

- **websocket-binance-integration.js**: Escucha eventos WebSocket
- **integrated-system.js**: Recibe señales del loop principal
- **leonardo-quantum-master-controller.js**: Consume recomendaciones cuánticas
- **binance-enhanced-connectivity.js**: Para ejecución real de órdenes
- **binance-network-manager.js**: Para gestión de conectividad
- **ip-monitor.js**: Para monitoreo de red

Esta especificación define el contrato completo para el Quantum Bridge, asegurando integración perfecta con todos los componentes existentes mientras respeta las reglas del proyecto.

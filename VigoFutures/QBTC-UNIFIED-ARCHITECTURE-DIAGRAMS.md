# QBTC-UNIFIED - Diagramas de Arquitectura

## 1. Arquitectura General del Sistema

```mermaid
graph TB
    subgraph "QBTC-UNIFIED"
        A[VigoFutures Core]
        B[Quantum Engine]
        C[Bot-Futuros]
        D[Configuration System]
    end
    
    subgraph "VigoFutures Core"
        A1[index.js]
        A2[QuantumUnifiedCore]
        A3[Coordinator Service]
        A4[SharedServices]
    end
    
    subgraph "Quantum Engine"
        B1[QuantumProfitMaximizer]
        B2[Feynman Quadrants]
        B3[Quantum Modules]
    end
    
    subgraph "Feynman Quadrants"
        B2a[Quadrant I]
        B2b[Quadrant II]
        B2c[Quadrant III]
        B2d[Quadrant IV]
    end
    
    subgraph "Quantum Modules"
        B3a[BinanceRateLimitOptimizer]
        B3b[LunarHiddenFaceOptimizer]
        B3c[FeynmanQuadrantsOptimizer]
    end
    
    subgraph "Bot-Futuros"
        C1[BinanceFuturesTrader]
        C2[QuantumOptimizer]
        C3[Trading Server]
        C4[Futures Bot]
    end
    
    subgraph "Configuration System"
        D1[Main Config]
        D2[Quantum Config]
        D3[Binance Config]
        D4[Launch Scripts]
    end
    
    A --> A1
    A --> A2
    A --> A3
    A --> A4
    
    B --> B1
    B --> B2
    B --> B3
    
    B2 --> B2a
    B2 --> B2b
    B2 --> B2c
    B2 --> B2d
    
    B3 --> B3a
    B3 --> B3b
    B3 --> B3c
    
    C --> C1
    C --> C2
    C --> C3
    C --> C4
    
    D --> D1
    D --> D2
    D --> D3
    D --> D4
    
    A2 -.-> B
    C1 -.-> B
    C2 -.-> B
```

## 2. Flujo de Datos Cuántico

```mermaid
sequenceDiagram
    participant U as Usuario/API
    participant V as VigoFutures Core
    participant Q as Quantum Engine
    participant F as Feynman Quadrants
    participant B as Bot-Futuros
    participant X as Binance API
    
    U->>V: Petición HTTP/WS
    V->>Q: Enviar datos de mercado
    Q->>F: Optimización Feynman
    F->>F: Procesar Cuadrantes I-IV
    F->>Q: Retornar métricas cuánticas
    Q->>V: Resultados optimizados
    V->>U: Respuesta con datos cuánticos
    
    par Flujo Paralelo de Trading
        Q->>B: Oportunidades cuánticas
        B->>B: Evaluar oportunidades
        B->>X: Ejecutar órdenes
        X->>B: Confirmación de orden
        B->>Q: Actualizar métricas
    end
    
    loop Ciclo Cuántico Continuo
        F->>F: Actualizar resonancia
        Q->>Q: Recalcular beneficios
        B->>B: Monitorear posiciones
    end
```

## 3. Arquitectura de Cuadrantes Feynman

```mermaid
graph LR
    subgraph "Plano Complejo Feynman"
        QI[Quadrant I<br/>Superior Derecho<br/>Optimización Apalancamiento]
        QII[Quadrant II<br/>Superior Izquierdo<br/>Optimización Rate Limits]
        QIII[Quadrant III<br/>Inferior Izquierdo<br/>Procesamiento Datos]
        QIV[Quadrant IV<br/>Inferior Derecho<br/>Optimización Temporal]
    end
    
    subgraph "Parámetros Cuánticos"
        Z[Z = 9 + 16j]
        L[λ = 888MHz]
        P[ln(7919) = 8.9769]
        M[Multiplicador Zurita = 7919]
    end
    
    subgraph "Flujo de Optimización"
        O1[Entrada de Datos<br/>Mercado Binance]
        O2[Procesamiento Cuántico]
        O3[Optimización por Cuadrante]
        O4[Síntesis de Resultados]
        O5[Salida Optimizada]
    end
    
    O1 --> O2
    O2 --> O3
    O3 --> QI
    O3 --> QII
    O3 --> QIII
    O3 --> QIV
    QI --> O4
    QII --> O4
    QIII --> O4
    QIV --> O4
    O4 --> O5
    
    Z --> QI
    Z --> QII
    Z --> QIII
    Z --> QIV
    L --> QI
    L --> QII
    P --> QIII
    P --> QIV
    M --> O4
```

## 4. Integración con Binance API

```mermaid
graph TB
    subgraph "QBTC-UNIFIED System"
        Q[Quantum Engine]
        B[Bot-Futuros]
        R[Rate Limit Optimizer]
        L[Lunar Optimizer]
    end
    
    subgraph "Binance API"
        BA[REST API]
        BW[WebSocket Streams]
        BF[Futures API]
        BM[Market Data]
    end
    
    subgraph "Flujo de Datos"
        D1[Market Data<br/>Precio/Volumen/Volatilidad]
        D2[Order Execution<br/>Comprar/Vender]
        D3[Position Management<br/>Apalancamiento/Riesgo]
        D4[Account Data<br/>Balance/PnL]
    end
    
    Q --> R
    B --> R
    R --> BA
    BA --> D1
    D1 --> Q
    D1 --> B
    
    B --> BF
    BF --> D2
    D2 --> BM
    BM --> B
    
    L --> BW
    BW --> D3
    D3 --> B
    
    B --> BA
    BA --> D4
    D4 --> B
    
    loop Ciclo de Optimización
        Q --> L
        L --> temporal_advantage
        temporal_advantage --> B
        B --> execution_feedback
        execution_feedback --> Q
    end
```

## 5. Arquitectura de Microservicios

```mermaid
graph TB
    subgraph "Capa de Presentación"
        API[API Gateway<br/>Port: 18020]
        WS[WebSocket Server<br/>Port: 18020]
        WEB[Web Interface<br/>Opcional]
    end
    
    subgraph "Capa de Servicios"
        QC[Quantum Core Service<br/>Port: 18020]
        CS[Coordinator Service<br/>Port: 3000]
        FS[Futures Service<br/>Port: 8002]
        BS[Bot Service<br/>Port: 5500]
    end
    
    subgraph "Capa de Lógica de Negocio"
        QM[Quantum Engine<br/>Módulos Feynman]
        TO[Trading Optimizer<br/>Algoritmos Cuánticos]
        RO[Risk Manager<br/>Stop Loss/Take Profit]
        MO[Market Observer<br/>Análisis en Tiempo Real]
    end
    
    subgraph "Capa de Datos"
        BD[Binance API<br/>Fuente de Verdad]
        CD[Configuration Data<br/>JSON/ENV]
        LD[Log Data<br/>Archivos Rotativos]
        MD[Market Cache<br/>Memoria Temporal]
    end
    
    API --> QC
    WS --> QC
    WEB --> CS
    
    QC --> QM
    CS --> QM
    FS --> TO
    BS --> TO
    
    QM --> RO
    TO --> RO
    RO --> MO
    
    QM --> BD
    TO --> BD
    MO --> BD
    RO --> CD
    QM --> LD
    MO --> MD
```

## 6. Flujo de Trading Cuántico

```mermaid
stateDiagram-v2
    [*] --> Inicialización
    Inicialización --> MonitoreoMercado
    MonitoreoMercado --> DetecciónOportunidad
    DetecciónOportunidad --> EvaluaciónCuántica
    EvaluaciónCuántica --> DecisiónTrading
    DecisiónTrading --> EjecuciónOrden
    EjecuciónOrden --> MonitoreoPosición
    MonitoreoPosición --> GestiónRiesgo
    GestiónRiesgo --> ActualizaciónMétricas
    ActualizaciónMétricas --> MonitoreoMercado
    
    state MonitoreoMercado {
        [*] --> RecolecciónDatos
        RecolecciónDatos --> AnálisisTendencias
        AnálisisTendencias --> CálculoVolatilidad
        CálculoVolatilidad --> [*]
    }
    
    state EvaluaciónCuántica {
        [*] --> OptimizaciónFeynman
        OptimizaciónFeynman --> CálculoResonancia
        CálculoResonancia --> EvaluaciónTemporal
        EvaluaciónTemporal --> [*]
    }
    
    state GestiónRiesgo {
        [*] --> MonitoreoStopLoss
        MonitoreoStopLoss --> MonitoreoTakeProfit
        MonitoreoTakeProfit --> AjusteApalancamiento
        AjusteApalancamiento --> [*]
    }
    
    DecisiónTrading --> Rechazo: Confianza < 75%
    Rechazo --> MonitoreoMercado
```

## 7. Arquitectura de Configuración

```mermaid
graph LR
    subgraph "Fuentes de Configuración"
        ENV[Variables de Entorno<br/>.env files]
        JSON[Archivos JSON<br/>Configuración Estática]
        API[Configuración Remota<br/>Opcional]
    end
    
    subgraph "Procesamiento de Configuración"
        V[Validación<br/>Tipos/Rangos]
        M[Merge<br/>Prioridades]
        C[Cache<br/>Memoria]
    end
    
    subgraph "Componentes Configurables"
        QC[Quantum Core]
        FE[Feynman Engine]
        BF[Bot Futuros]
        CS[Coordinator Service]
    end
    
    subgraph "Parámetros por Componente"
        QCP[Puertos<br/>Endpoints<br/>Timeouts]
        FEP[Parámetros Feynman<br/>Z, λ, Log Prime]
        BFP[Pares Trading<br/>Apalancamiento<br/>Riesgo]
        CSP[Métricas<br/>Monitoreo<br/>Health Checks]
    end
    
    ENV --> V
    JSON --> V
    API --> V
    V --> M
    M --> C
    
    C --> QC
    C --> FE
    C --> BF
    C --> CS
    
    QC --> QCP
    FE --> FEP
    BF --> BFP
    CS --> CSP
```

## 8. Arquitectura de Logging y Monitorización

```mermaid
graph TB
    subgraph "Fuentes de Logs"
        QL[Quantum Engine Logs]
        FL[Feynman Logs]
        BL[Bot Logs]
        SL[System Logs]
    end
    
    subgraph "Procesamiento de Logs"
        C[Colector de Logs]
        P[Procesador<br/>Timestamp/Level]
        F[Filtro<br/>Componente/Severidad]
        S[Storage<br/>Archivos]
    end
    
    subgraph "Métricas Cuánticas"
        QM[Métricas Feynman<br/>Eficiencia Cuadrantes]
        RM[Métricas Rendimiento<br/>Latencia/Throughput]
        TM[Métricas Trading<br/>PnL/Éxito]
        CM[Métricas Consciencia<br/>Nivel Evolución]
    end
    
    subgraph "Monitorización"
        H[Health Checks]
        A[Alertas<br/>Umbrales]
        D[Dashboard<br/>Visualización]
        R[Reportes<br/>Históricos]
    end
    
    QL --> C
    FL --> C
    BL --> C
    SL --> C
    
    C --> P
    P --> F
    F --> S
    
    P --> QM
    P --> RM
    P --> TM
    P --> CM
    
    QM --> H
    RM --> A
    TM --> D
    CM --> R
    
    loop Ciclo de Monitorización
        H --> A
        A --> D
        D --> R
    end
```

## 9. Despliegue y Escalabilidad

```mermaid
graph TB
    subgraph "Entornos de Despliegue"
        D[Development<br/>Local]
        T[Testing<br/>Staging]
        P[Production<br/>Cloud]
    end
    
    subgraph "Estrategias de Escalabilidad"
        H[Horizontal<br/>Múltiples Instancias]
        V[Vertical<br/>Más Recursos]
        S[Scaling<br/>Auto-scaling]
    end
    
    subgraph "Componentes Escalables"
        QC[Quantum Core<br/>Stateless]
        FE[Feynman Engine<br/>CPU Intensive]
        BF[Bot Futuros<br/>I/O Intensive]
        CS[Coordinator<br/>Lightweight]
    end
    
    subgraph "Infraestructura"
        LB[Load Balancer]
        CD[Content Delivery]
        DB[Database<br/>Opcional]
        CS[Cache Service<br/>Redis]
    end
    
    D --> H
    T --> V
    P --> S
    
    H --> QC
    V --> FE
    S --> BF
    S --> CS
    
    LB --> QC
    CD --> FE
    DB --> BF
    CS --> CS
    
    QC --> LB
    FE --> CD
    BF --> DB
    CS --> CS
```

## 10. Seguridad y Gestión de Riesgo

```mermaid
graph TB
    subgraph "Capa de Seguridad"
        AUTH[Autenticación<br/>API Keys]
        CRYPT[Encriptación<br/>HMAC-SHA256]
        CORS[CORS<br/>Orígenes Permitidos]
        VAL[Validación<br/>Input/Output]
    end
    
    subgraph "Gestión de Riesgo"
        SL[Stop Loss<br/>Dinámico]
        TP[Take Profit<br/>Automático]
        LV[Leverage Control<br/>Máximos]
        PS[Position Sizing<br/>Porcentaje]
    end
    
    subgraph "Monitoreo de Seguridad"
        AM[Activity Monitor<br/>Logs Auditoría]
        AA[Alert Analysis<br/>Anomalías]
        IR[Incident Response<br/>Automatizado]
        RR[Recovery<br/>Automático]
    end
    
    subgraph "Protección de Datos"
        API[API Keys<br/>Secret Management]
        CFG[Configuración<br/>Variables Entorno]
        LOG[Logs<br/>Sin Datos Sensibles]
        ENC[Encriptación<br/>En Tránsito/Reposo]
    end
    
    AUTH --> CRYPT
    CRYPT --> CORS
    CORS --> VAL
    
    VAL --> SL
    SL --> TP
    TP --> LV
    LV --> PS
    
    PS --> AM
    AM --> AA
    AA --> IR
    IR --> RR
    
    RR --> API
    API --> CFG
    CFG --> LOG
    LOG --> ENC
    
    loop Ciclo Continuo
        AM --> AA
        AA --> IR
        IR --> RR
        RR --> AM
    end
```

## Resumen de Diagramas

Estos diagramas proporcionan una visión completa de la arquitectura de QBTC-UNIFIED:

1. **Arquitectura General**: Muestra la estructura de alto nivel y las relaciones entre componentes principales.
2. **Flujo de Datos Cuántico**: Ilustra cómo fluyen los datos a través del sistema cuántico.
3. **Cuadrantes Feynman**: Detalla la implementación de los cuatro cuadrantes de optimización.
4. **Integración Binance**: Muestra cómo el sistema se integra con la API de Binance.
5. **Microservicios**: Presenta la arquitectura de microservicios del sistema.
6. **Flujo de Trading**: Describe el ciclo completo de trading cuántico.
7. **Configuración**: Explica cómo se gestiona la configuración en todo el sistema.
8. **Logging y Monitorización**: Muestra la arquitectura de monitorización y logging.
9. **Despliegue**: Ilustra las estrategias de despliegue y escalabilidad.
10. **Seguridad**: Detalla las capas de seguridad y gestión de riesgo.

Cada diagrama está diseñado para proporcionar una perspectiva diferente del sistema, permitiendo una comprensión completa de la arquitectura y el funcionamiento de QBTC-UNIFIED.
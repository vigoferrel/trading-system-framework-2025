# QBTC MASTER DASHBOARD
## 🧠 Control Absoluto LLM - Sistema de Inteligencia Cuántica 🤖

### 📊 **Dashboard Unificado para Monitoreo de Recomendaciones e Insights**

El **QBTC Master Dashboard** es una interfaz unificada que facilita el seguimiento completo de las recomendaciones generadas por el sistema de inteligencia cuántica avanzada QBTC.

## 🚀 **Características Principales**

### 🎯 **Monitoreo en Tiempo Real**
- ✅ Estado de todos los sistemas de IA (9 sistemas activos)
- ✅ Métricas de rendimiento del LLM Master Brain
- ✅ Cache inteligente y latencia de respuesta
- ✅ Uptime y health checks continuos

### 🧠 **Recomendaciones LLM Unificadas**
- ✅ Decisiones BUY/SELL/HOLD con nivel de confianza
- ✅ Análisis unificado de contradicciones resueltas
- ✅ Factores clave por símbolo
- ✅ Timestamp de última actualización

### 💡 **Insights de Sistemas de Inteligencia**
- ✅ RealFundingRateAnalyzer (Análisis de funding rates)
- ✅ InstitutionalWhaleDetector (Detección de ballenas)
- ✅ ContrarianTheoryEngine (Teoría contraria)
- ✅ PredictiveVolatilityEngine (Predicción de volatilidad)
- ✅ MarketAnomalyDetector (Detección de anomalías)

### 📈 **Métricas de Mercado**
- ✅ Universo de 475+ símbolos Binance Futures
- ✅ Sentimiento de mercado en tiempo real
- ✅ Métricas de riesgo (VaR, Drawdown, Sharpe)
- ✅ Funding rates y volumen

## 🛠️ **Instalación y Uso**

### **1. Requisitos Previos**
```bash
# Asegurarse de que los servicios estén ejecutándose:
- LLM Neural Server (puerto 4607)
- QBTC Quantum System (puerto 4602)
- Advanced Sentiment Dashboard (puerto 4604)
```

### **2. Inicio del Dashboard**
```bash
# Abrir el dashboard en el navegador
start qbtc-master-dashboard.html

# O usar un servidor local
python -m http.server 8080
# Luego abrir: http://localhost:8080/qbtc-master-dashboard.html
```

### **3. Configuración de Conexiones**
El dashboard se conecta automáticamente a:
```javascript
const baseURLs = {
    llmNeural: 'http://localhost:4607',
    quantumSystem: 'http://localhost:4602',
    sentimentDashboard: 'http://localhost:4604',
    advancedIntelligence: 'http://localhost:4602'
};
```

## 📊 **Arquitectura del Dashboard**

```
QBTC Master Dashboard
├── 🖥️ Interface HTML/JS
│   ├── Dashboard Grid (6 métricas principales)
│   ├── Recommendations Section (LLM decisions)
│   └── Insights Section (Intelligence systems)
├── 🔌 API Integration Layer
│   ├── QBTCMasterDashboardAPI class
│   ├── Cache inteligente (30s timeout)
│   └── Error handling robusto
└── 📡 Backend Services
    ├── LLM Neural Orchestrator
    ├── Quantum Intelligence Engine
    └── Market Data Connectors
```

## 🎮 **Controles del Dashboard**

### **Botones Principales**
- **🔄 Actualizar Dashboard**: Recarga todos los datos
- **📊 Cargar Todas las Recomendaciones**: Carga recomendaciones para todos los símbolos
- **⏰ Auto-Refresh**: Actualización automática cada 30 segundos

### **Filtros**
- **Selector de Símbolos**: Filtrar recomendaciones por símbolo específico
- **Filtro de Impacto**: Mostrar insights por nivel de impacto

## 📈 **Métricas Monitorizadas**

### **Sistema**
- Estado general del sistema
- Estado de LLM Master Brain
- Conexión con APIs
- Estado del cache

### **Rendimiento**
- Score global de rendimiento
- Latencia promedio
- Tasa de aciertos del cache
- Uptime del sistema

### **Mercado**
- Número total de símbolos (475+)
- Sentimiento de mercado
- Fear & Greed Index
- Cambio de volumen 24h

### **Riesgo**
- Nivel de riesgo general
- Value at Risk (VaR) 24h
- Maximum Drawdown
- Sharpe Ratio

## 🔧 **Solución de Problemas**

### **Error de Conexión**
```javascript
// Verificar que los servicios estén ejecutándose
// LLM Neural Server: http://localhost:4607/health
// Quantum System: http://localhost:4602/health
// Sentiment Dashboard: http://localhost:4604/health
```

### **Datos No Cargan**
- Verificar conexiones de red
- Revisar logs de servicios backend
- Limpiar cache del navegador
- Verificar CORS settings

### **Recomendaciones Vacías**
- Verificar LLM Neural Orchestrator esté activo
- Revisar configuración de símbolos
- Verificar conectividad con APIs de mercado

## 🚀 **Funcionalidades Avanzadas**

### **Cache Inteligente**
- ✅ Cache automático de 30 segundos
- ✅ Invalidación inteligente
- ✅ Fallback a datos de respaldo
- ✅ Optimización de rendimiento

### **Auto-Refresh**
- ✅ Actualización automática configurable
- ✅ Indicadores visuales de carga
- ✅ Manejo de errores durante refresh
- ✅ Pausable/reanudable

### **Responsive Design**
- ✅ Optimizado para desktop
- ✅ Adaptable a tablets
- ✅ Funcional en móviles
- ✅ Diseño moderno con gradientes

## 📊 **Integración con Servicios QBTC**

### **LLM Neural Orchestrator**
```javascript
// Endpoint: /api/batch-decisions
// Método: POST
// Payload: { symbols: ['BTCUSDT', 'ETHUSDT'] }
// Respuesta: Decisiones unificadas con confianza
```

### **Advanced Intelligence Engine**
```javascript
// Endpoint: /api/advanced-intelligence/{symbol}
// Método: GET
// Respuesta: Análisis completo del símbolo
```

### **Quantum System Core**
```javascript
// Endpoint: /health
// Método: GET
// Respuesta: Estado del sistema cuántico
```

## 🎯 **Próximas Funcionalidades**

- [ ] **Gráficos históricos** de recomendaciones
- [ ] **Alertas en tiempo real** por email/telegram
- [ ] **Backtesting visual** de estrategias
- [ ] **Análisis de correlación** entre símbolos
- [ ] **Dashboard móvil** nativo
- [ ] **Exportación de reportes** PDF/Excel

## 📞 **Soporte**

Para soporte técnico o reportes de bugs:
1. Revisar logs de consola del navegador
2. Verificar estado de servicios backend
3. Consultar documentación de APIs
4. Reportar issues en el repositorio

---

**🧠 QBTC Master Dashboard - Control Absoluto LLM 🤖**
**Sistema de Inteligencia Cuántica Avanzada - 475+ Símbolos Monitorizados**</content>
<parameter name="filePath">c:\Users\DELL\Desktop\opciones\QBTC-MASTER-DASHBOARD-README.md

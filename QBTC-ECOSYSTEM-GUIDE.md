# 🚀 QBTC ECOSYSTEM - GUÍA COMPLETA DE USO

## 📋 RESUMEN EJECUTIVO

Sistema de Trading Cuántico completo implementado con **ingeniería inversa acelerada** para reducir tiempos de desarrollo. El ecosistema incluye todos los componentes necesarios para trading cuántico avanzado con integración LLM.

---

## 🎯 COMPONENTES IMPLEMENTADOS

### ✅ **SERVICIOS PRINCIPALES**

1. **🌐 API Gateway Unificada** (`qbtc-api-gateway.js`)
   - Puerto: 14000
   - Centraliza acceso a todos los servicios
   - Monitoreo de salud automático
   - Endpoints unificados

2. **🧠 LLM Neural Orchestrator** (`llm-server.js`)
   - Puerto: 4607
   - Integración OpenRouter + Gemini Flash 1.5
   - Sistemas neuronales cargados
   - Decisiones de trading validadas

3. **🏛️ Sistema QBTC Principal** (`src/launch-qbtc-system.js`)
   - Puerto: 14001
   - 5 componentes core integrados
   - Modo paper trading funcional
   - Exchange Gateway simulado

4. **🚀 Launcher Universal** (`qbtc-ultimate-launcher.js`)
   - Inicia todo el ecosistema simultáneamente
   - Gestión de dependencias automática
   - Monitoreo de salud integrado

5. **📊 Dashboard Web Universal** (`qbtc-dashboard-universal.html`)
   - Interface web completa
   - Métricas en tiempo real
   - Control de servicios

---

## 🛠️ INSTALACIÓN Y CONFIGURACIÓN

### 1. **Dependencias**
```bash
npm install
```

### 2. **Variables de Entorno** (Opcional)
```bash
# Para APIs reales (opcional)
BINANCE_API_KEY=tu_api_key
BINANCE_API_SECRET=tu_secret
GEMINI_API_KEY=tu_gemini_key

# OpenRouter ya configurado por defecto
```

---

## 🚀 FORMAS DE EJECUTAR EL SISTEMA

### **OPCIÓN 1: LAUNCHER UNIVERSAL (RECOMENDADO)**
```bash
node qbtc-ultimate-launcher.js
```
**Resultado**: Inicia todo el ecosistema automáticamente en 8 servicios paralelos

### **OPCIÓN 2: SERVICIOS INDIVIDUALES**
```bash
# Terminal 1: API Gateway
node qbtc-api-gateway.js

# Terminal 2: LLM Server
node llm-server.js

# Terminal 3: Sistema QBTC
node src/launch-qbtc-system.js
```

### **OPCIÓN 3: TESTING RÁPIDO**
```bash
node test-qbtc-ecosystem.js
```

---

## 🌐 ENDPOINTS DISPONIBLES

### **API Gateway (Puerto 14000)**
```
GET  /                          - Información del gateway
GET  /health                    - Estado del gateway
GET  /api/services/status       - Estado de todos los servicios
GET  /api/metrics               - Métricas agregadas
POST /api/llm/decision          - Nueva decisión LLM
GET  /api/llm/analysis          - Análisis rápido LLM
GET  /api/trading/signals       - Señales de trading
POST /api/trading/execute       - Ejecutar trade
GET  /api/quantum/state         - Estado cuántico
GET  /api/hybrid/optimization   - Optimización híbrida
GET  /dashboard                 - Dashboard web
ALL  /api/proxy/:service/*      - Proxy a cualquier servicio
```

### **LLM Server (Puerto 4607)**
```
GET  /health                    - Estado del LLM
GET  /api/analysis              - Análisis legacy
POST /api/unified-decision      - Decisión completa
GET  /api/stats                 - Estadísticas LLM
```

### **QBTC Core (Puerto 14001)**
```
GET  /health                    - Estado del sistema core
```

---

## 🎯 EJEMPLOS DE USO

### **1. Obtener Estado del Sistema**
```bash
curl http://localhost:14000/health
```
```json
{
  "status": "healthy",
  "servicesHealthy": 8,
  "servicesTotal": 8,
  "healthPercentage": 100
}
```

### **2. Generar Decisión de Trading**
```bash
curl -X POST http://localhost:14000/api/llm/decision \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTCUSDT"}'
```

### **3. Ejecutar Trade Simulado**
```bash
curl -X POST http://localhost:14000/api/trading/execute \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "BTCUSDT",
    "side": "BUY",
    "quantity": 0.001,
    "type": "market"
  }'
```

### **4. Ver Dashboard Web**
```
http://localhost:14000/dashboard
```

---

## 📊 MONITOREO Y MÉTRICAS

### **Métricas Disponibles**
- **Gateway**: Requests totales, tasa de éxito, uptime
- **LLM**: Decisiones generadas, cache hits, llamadas API
- **Sistema**: Servicios saludables, memoria, CPU
- **Trading**: Señales generadas, trades ejecutados
- **Quantum**: Coherencia, energía, estado de entanglement

### **Health Checks Automáticos**
- Cada 30 segundos según reglas de segundo plano
- Detección automática de servicios caídos
- Reinicio automático (si está configurado)

---

## 🧪 TESTING Y VALIDACIÓN

### **Test Completo del Ecosistema**
```bash
node test-qbtc-ecosystem.js
```

### **Test Individual de OpenRouter**
```bash
node test-llm-openrouter.js
```

### **Diagnóstico de Sistema**
```bash
node diagnostico-fallback.js
```

---

## 🔧 CONFIGURACIÓN AVANZADA

### **Puertos Configurados**
```javascript
{
  apiGateway: 14000,        // Gateway principal
  qbtcCore: 14001,         // Sistema QBTC
  llmServer: 4607,         // LLM Neural
  tradingEngine: 14201,    // Trading Engine
  quantumEngine: 14115,    // Quantum Engine
  hybridOptimizer: 14301,  // Hybrid Optimizer
  concentratedHybrid: 14302, // Concentrated Hybrid
  dashboard: 14401,        // Enhanced Dashboard
  monitor: 14501           // Intelligent Monitor
}
```

### **Variables de Entorno**
```bash
API_GATEWAY_PORT=14000
LLM_SERVER_PORT=4607
QBTC_MODE=paper
NODE_ENV=development
```

---

## 🎉 FUNCIONALIDADES CLAVE

### ✅ **COMPLETAMENTE IMPLEMENTADO**

1. **🌐 API Gateway Unificada**
   - Centralización de todos los servicios
   - Balanceo de carga automático
   - Monitoreo de salud en tiempo real
   - Proxy inteligente a servicios

2. **🧠 Integración LLM Completa**
   - OpenRouter + Gemini Flash 1.5 funcionando
   - Sistemas neuronales cargados (4/4)
   - Decisiones de trading validadas
   - Cache inteligente implementado

3. **📊 Dashboard Universal**
   - Interface web responsive
   - Métricas en tiempo real
   - Control de servicios
   - Exportación de datos

4. **🚀 Launcher Inteligente**
   - Arranque paralelo de servicios
   - Gestión de dependencias
   - Logging automático
   - Shutdown graceful

5. **📈 Trading Simulado**
   - Ejecución de órdenes mock
   - Gestión de posiciones
   - Señales agregadas
   - Balance simulado ($100,000 USDT)

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

### **CORTO PLAZO (1-3 días)**
1. **Configurar APIs reales** para trading en testnet
2. **Implementar base de datos** para históricos
3. **Agregar más pares de trading** (ETH, SOL, etc.)

### **MEDIANO PLAZO (1-2 semanas)**
1. **Machine Learning** con datos reales
2. **Visualizaciones avanzadas** en dashboard
3. **Alertas y notificaciones**

### **LARGO PLAZO (1 mes+)**
1. **Trading en vivo** (producción)
2. **Escalabilidad** con Docker
3. **Multi-exchange** integration

---

## 🛡️ SEGURIDAD Y MANTENIMIENTO

### **Buenas Prácticas Implementadas**
- ✅ Shutdown graceful en todos los servicios
- ✅ Error handling robusto
- ✅ Rate limiting configurado
- ✅ Logging completo para auditoría
- ✅ Separación de concerns
- ✅ Configuración por entornos

### **Monitoreo Continuo**
- ✅ Health checks automáticos cada 30s
- ✅ Métricas de rendimiento
- ✅ Detección de anomalías
- ✅ Alertas de servicios caídos

---

## 💡 TIPS DE USO

1. **Usa el API Gateway** como punto único de entrada
2. **Monitorea el dashboard** para métricas en tiempo real
3. **Revisa los logs** en `./logs/` para debugging
4. **Exporta métricas** regularmente para análisis
5. **Usa el test completo** antes de cambios importantes

---

## 🎉 CONCLUSIÓN

El ecosistema QBTC está **100% funcional** y listo para trading cuántico avanzado:

- ✅ **Sistema integrado** con 8+ servicios
- ✅ **OpenRouter + Gemini** funcionando perfectamente  
- ✅ **Dashboard web** con métricas en tiempo real
- ✅ **API Gateway** centralizando todo el acceso
- ✅ **Trading simulado** completamente funcional
- ✅ **Arquitectura escalable** y mantenible

**🚀 ¡El sistema está listo para llevar el trading cuántico al siguiente nivel!**

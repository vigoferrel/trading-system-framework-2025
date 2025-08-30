# Guía de Conexión a Binance para el Sistema Cuántico de Opciones

## Introducción

Este documento explica cómo configurar y conectar el Sistema Cuántico de Opciones con la API de Binance para realizar operaciones de trading de opciones de forma automatizada.

## Requisitos Previos

1. Cuenta de Binance verificada
2. API Keys de Binance con permisos para trading de opciones
3. Node.js instalado
4. Conocimientos básicos de trading de opciones

## Configuración de API Keys en Binance

### 1. Crear API Keys

1. Inicia sesión en tu cuenta de Binance
2. Ve a la sección "API Management"
3. Haz clic en "Create API"
4. Nombra tu API (ej: "QuantumOptionsBot")
5. Configura los permisos necesarios:
   - **Enable Trading**: [OK] Habilitado
   - **Enable Futures**: [OK] Habilitado
   - **Enable Reading**: [OK] Habilitado
   - **Enable Spot and Margin Trading**: [ERROR] Deshabilitado (no necesario para opciones)
   - **Enable Internal Transfer**: [ERROR] Deshabilitado

### 2. Restricciones de IP (Recomendado)

Para mayor seguridad, restringe el acceso a tu API a direcciones IP específicas:
1. En la configuración de API, haz clic en "Edit IP Restrictions"
2. Añade la dirección IP del servidor donde se ejecutará el bot
3. Guarda los cambios

### 3. Guardar tus API Keys

Una vez creadas las API keys, guarda la **API Key** y la **Secret Key** en un lugar seguro. Nunca compartas estas credenciales.

## Configuración del Sistema

### 1. Archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```bash
# Copia el contenido de .env.example a .env y completa con tus datos
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```bash
# Binance API Configuration
BINANCE_API_KEY=tu_api_key_aqui
BINANCE_API_SECRET=tu_api_secret_aqui
BINANCE_SPOT_BASE_URL=https://api.binance.com/api/v3
BINANCE_OPTIONS_BASE_URL=https://eapi.binance.com/eapi/v1

# Set to true for testnet trading (recommended for testing)
BINANCE_TESTNET=true
```

### 2. Modo Testnet vs Producción

#### Testnet (Recomendado para empezar)

```bash
BINANCE_TESTNET=true
```

En modo testnet, el sistema simulará operaciones sin usar dinero real. Esto te permite:
- Probar la configuración sin riesgo
- Verificar que el sistema funciona correctamente
- Ajustar parámetros de trading

#### Producción

```bash
BINANCE_TESTNET=false
```

Cuando estés listo para operar con dinero real, cambia a modo producción:
- **ADVERTENCIA**: Esto usará dinero real para las operaciones
- Asegúrate de haber probado exhaustivamente en testnet
- Comienza con cantidades pequeñas

## Iniciar el Sistema

### 1. Instalar dependencias

```bash
npm install
```

### 2. Iniciar el servidor

```bash
npm start
```

### 3. Verificar conexión a Binance

Abre tu navegador y visita:
```
http://localhost:4000/binance/connection
```

Deberías ver una respuesta como:
```json
{
  "connected": true,
  "serverTime": 1642680000000,
  "timestamp": "2022-01-20T12:00:00.000Z"
}
```

Si la conexión falla, verifica tus API keys y la conexión a internet.

## API Endpoints Disponibles

El sistema proporciona los siguientes endpoints para interactuar con Binance:

### 1. Información del Sistema

- `GET /` - Información general del sistema
- `GET /health` - Estado de salud del sistema

### 2. Datos de Mercado

- `GET /binance/market-data` - Datos de mercado para todos los símbolos
- `GET /binance/market-data?symbol=BTC` - Datos de mercado para un símbolo específico
- `GET /binance/options-data` - Datos de opciones disponibles
- `GET /binance/options-data?symbol=ETH` - Datos de opciones para un símbolo específico

### 3. Sistema Cuántico

- `GET /quantum-matrix` - Matriz cuántica actual
- `GET /trading-signals` - Señales de trading generadas
- `GET /active-positions` - Posiciones activas
- `GET /performance` - Métricas de rendimiento

### 4. Control de Trading

- `POST /start-trading` - Iniciar el sistema de trading automático
- `POST /stop-trading` - Detener el sistema de trading automático

## Símbolos Disponibles

El sistema está configurado para operar con los siguientes símbolos de opciones en Binance:

- **BTC** - Bitcoin
- **ETH** - Ethereum
- **BNB** - Binance Coin
- **SOL** - Solana
- **XRP** - Ripple
- **DOGE** - Dogecoin

## Estrategias de Trading

El sistema implementa varias estrategias cuánticas:

1. **Quantum Arbitrage**: Aprovecha discrepancias de precios entre opciones relacionadas
2. **Momentum Trading**: Sigue tendencias basadas en factores cuánticos de momentum
3. **Mean Reversion**: Aprovecha retornos a la media con alta precisión cuántica
4. **Options Trading**: Trading básico de opciones basado en probabilidades cuánticas
5. **Naked Options**: Venta de opciones descubiertas con alta probabilidad de éxito
6. **Straddle/Strangle**: Estrategias combinadas para volatilidad

## Parámetros Configurables

### 1. Parámetros de Trading

En `config.js` puedes ajustar:

```javascript
trading: {
  defaultPositionSize: 1,        // Tamaño por defecto de la posición
  maxPositions: 6,              // Máximo de posiciones simultáneas
  stopLossPercentage: 0.1,      // Porcentaje de stop loss (10%)
  takeProfitPercentage: 0.2,    // Porcentaje de take profit (20%)
  updateFrequency: 300000,      // Frecuencia de actualización (5 minutos)
  mlOptimizationFrequency: 3600000 // Frecuencia de optimización ML (1 hora)
}
```

### 2. Parámetros Cuánticos

```javascript
quantum: {
  symbols: ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE'],
  matrixSize: { rows: 6, cols: 8 },
  riskLevel: 'medium',
  timeframe: '5m',
  lambda: Math.log(7919)  // Constante cuántica fundamental
}
```

## Monitoreo y Logs

El sistema genera logs detallados de todas las operaciones:

```bash
# Ver logs en tiempo real
npm run dev

# Ver logs del sistema
tail -f logs/system.log
```

## Solución de Problemas

### 1. Errores de Conexión

**Problema**: "API keys not configured"
- **Solución**: Verifica que tus API keys estén correctamente configuradas en `.env`

**Problema**: "Invalid API key"
- **Solución**: Verifica que la API key sea correcta y tenga los permisos necesarios

**Problema**: "IP not allowed"
- **Solución**: Añade tu IP a la lista blanca en la configuración de API de Binance

### 2. Errores de Trading

**Problema**: "Insufficient balance"
- **Solución**: Verifica que tengas saldo suficiente en tu cuenta de Binance

**Problema**: "Order failed"
- **Solución**: Verifica los parámetros de la orden y los requisitos mínimos de Binance

### 3. Errores del Sistema

**Problema**: "Port already in use"
- **Solución**: Cambia el puerto en `config.js` o detén el proceso que usa el puerto

**Problema**: "Module not found"
- **Solución**: Ejecuta `npm install` para instalar todas las dependencias

## Seguridad

### 1. Mejores Prácticas

- Nunca compartas tus API keys
- Usa restricciones de IP siempre que sea posible
- Habilita la autenticación de dos factores en tu cuenta de Binance
- Usa siempre el modo testnet antes de operar con dinero real
- Mantén tu sistema operativo y dependencias actualizadas

### 2. Permisos Mínimos

Configura tus API keys con el mínimo de permisos necesarios:
- **Enable Reading**: Para obtener datos de mercado
- **Enable Trading**: Para ejecutar órdenes
- **Enable Futures**: Para operar opciones (que se clasifican bajo futuros en Binance)

## Soporte

Si encuentras problemas o tienes preguntas:

1. Revisa los logs del sistema
2. Consulta la documentación en `ABSTRACT_FISICO_ECONOMICO.md`
3. Verifica la configuración en `config.js`
4. Prueba la conexión con el endpoint `/binance/connection`

## Conclusión

El Sistema Cuántico de Opciones está diseñado para operar de forma autónoma una vez configurado correctamente. Sigue esta guía para establecer la conexión con Binance y comenzar a operar con la potencia de los algoritmos cuánticos deterministas.

Recuerda siempre empezar en modo testnet para familiarizarte con el sistema antes de operar con dinero real.
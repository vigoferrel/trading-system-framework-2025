# Bot de Futuros QBTC - Sistema Tandalones

Bot de trading de futuros de criptomonedas completamente independiente con optimización cuántica Feynman.

## Características

- [START] **Sistema Tandalones**: Funciona de forma independiente sin dependencias externas
-  **Optimización Cuántica**: Implementa algoritmos Feynman para maximizar beneficios
-  **Integración con Binance**: Conexión directa con la API de Binance Futures
- [FAST] **Alto Rendimiento**: Optimizado para operaciones de alta frecuencia
- [SECURE] **Seguro**: Implementa stop-loss y take-profit automáticos
- [DATA] **Monitoreo en Tiempo Real**: API REST para monitoreo y control
- [NIGHT] **Cara Oculta Lunar**: Optimización temporal basada en patrones lunares

## Requisitos

- Node.js >= 16.0.0
- npm >= 8.0.0
- Cuenta de Binance con API keys

## Instalación

1. Clonar o descargar el directorio `bot-futuros`
2. Navegar al directorio del proyecto:
   ```bash
   cd bot-futuros
   ```
3. Instalar dependencias:
   ```bash
   npm install
   ```
4. Configurar variables de entorno:
   ```bash
   copy .env-example .env
   ```
5. Editar el archivo `.env` con tus credenciales de Binance:
   ```
   BINANCE_API_KEY=tu_api_key_de_binance_aqui
   BINANCE_API_SECRET=tu_api_secret_de_binance_aqui
   BINANCE_TESTNET=true
   ```

## Uso

### Iniciar el Bot

#### Método 1: Instalar dependencias y lanzar (Recomendado para primera vez)
```bash
INSTALL-AND-LAUNCH.bat
```

#### Método 2: Usando el script de lanzamiento (Si dependencias ya están instaladas)
```bash
LAUNCH-BOT-TANDALONES.bat
```

#### Método 3: Usando npm (si npm está en el PATH)
```bash
npm start
```

#### Método 4: Usando Node.js directamente
```bash
"C:\Program Files\nodejs\node.exe" server.js
```

### Modo Desarrollo
```bash
npm run dev
```

## Configuración

El bot se configura principalmente a través del archivo `.env`. Las opciones principales son:

### Configuración del Servidor
- `SERVER_PORT`: Puerto del servidor (default: 5500)
- `SERVER_HOST`: Host del servidor (default: localhost)

### Configuración de Trading
- `TRADING_PAIRS`: Pares de trading separados por comas (ej: BTCUSDT,ETHUSDT)
- `TRADING_LEVERAGE`: Apalancamiento máximo (default: 20)
- `TRADING_MARGIN_TYPE`: Tipo de margen (ISOLATED/CROSSED)
- `TRADING_STOP_LOSS_PERCENT`: Porcentaje de stop-loss (default: 2.5)
- `TRADING_TAKE_PROFIT_PERCENT`: Porcentaje de take-profit (default: 5.0)

### Configuración Cuántica
- `QUANTUM_MIN_EDGE`: Edge mínimo para operaciones (default: 0.0025)
- `QUANTUM_MIN_CONFIDENCE`: Confianza mínima (default: 0.75)
- `QUANTUM_LEVERAGE_MULTIPLIER`: Multiplicador de apalancamiento cuántico (default: 1.618)
- `QUANTUM_ZURITA_MULTIPLIER`: Multiplicador de Zurita (default: 7919)

## API Endpoints

### Estado del Bot
- `GET /api/status` - Estado general del bot
- `GET /health` - Health check del sistema

### Trading
- `POST /api/execute-quantum-trade` - Ejecutar operación cuántica
- `GET /api/positions` - Obtener posiciones activas
- `GET /api/balance` - Obtener balance actual

### Métricas
- `GET /api/quantum-metrics` - Obtener métricas cuánticas
- `GET /api/market-data/:symbol` - Obtener datos de mercado
- `GET /api/opportunities` - Obtener oportunidades detectadas

## Arquitectura del Sistema

El bot está compuesto por los siguientes módulos principales:

### Core Modules
- `server.js` - Servidor Express y API REST
- `config.js` - Configuración del sistema
- `init.js` - Inicialización del sistema
- `quantum-optimizer.js` - Optimizador cuántico Feynman
- `binance-trader.js` - Trader de Binance Futures

### Características Técnicas

#### Optimización Cuántica
- Implementa cuadrantes Feynman para maximizar beneficios
- Usa frecuencia Lambda de 888MHz para resonancia cuántica
- Aplica factor logarítmico primo (log 7919)
- Implementa ventaja temporal basada en cara oculta lunar

#### Gestión de Riesgos
- Stop-loss automático
- Take-profit automático
- Gestión dinámica de apalancamiento
- Diversificación de posiciones

#### Monitoreo
- Logging completo de operaciones
- Métricas en tiempo real
- Sistema de health check
- API REST para monitoreo externo

## Ejemplo de Uso

### Verificar estado del bot
```bash
curl http://localhost:5500/api/status
```

### Ejecutar operación manual
```bash
curl -X POST http://localhost:5500/api/execute-quantum-trade \
  -H "Content-Type: application/json" \
  -d '{"symbol": "BTCUSDT", "side": "BUY", "size": 10}'
```

### Obtener posiciones activas
```bash
curl http://localhost:5500/api/positions
```

## Seguridad

- Las API keys de Binance se almacenan de forma segura en variables de entorno
- El bot funciona en modo testnet por defecto para pruebas
- Implementa validación de firmas para todas las operaciones
- Logging seguro sin exposición de datos sensibles

## Troubleshooting

### Problemas Comunes

1. **Error: Cannot find module**
   - Asegúrate de ejecutar `npm install` en el directorio del proyecto

2. **Error: BINANCE_API_KEY not configured**
   - Configura tus API keys en el archivo `.env`

3. **Error: Port already in use**
   - Cambia el puerto en el archivo `.env` (SERVER_PORT)

4. **Error: Connection refused**
   - Verifica tu conexión a internet y las credenciales de Binance

### Logs

Los logs del sistema se almacenan en el directorio `logs/`:
- Logs del servidor: `logs/server.log`
- Logs de trading: `logs/trading.log`
- Logs de errores: `logs/error.log`

## Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Open un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## Soporte

Si tienes problemas o preguntas, por favor:
1. Revisa la sección de Troubleshooting
2. Abre un issue en el repositorio
3. Contacta al equipo de QBTC

## Descargo de Responsabilidad

Este bot de trading es para fines educativos y de investigación. El trading de criptomonedas conlleva riesgos significativos y puede no ser adecuado para todos los inversores. Usa este bot bajo tu propio riesgo.
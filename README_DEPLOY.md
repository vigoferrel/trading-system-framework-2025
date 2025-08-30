# Despliegue en Producción – Quantum Options & Futures (Sin SPOT)

## Puertos (banda anti-conflictos)
- Core (bot-core): 4601
- Frontend API: 4602
- Frontend estático: 4603
- Monitor tiempo real: 4604

## Requisitos
- Node.js LTS y npm
- PM2 instalado globalmente (recomendado): `npm i -g pm2`

## Variables de entorno (.env en la raíz)
Mínimas para producción (EAPI/FAPI, sin SPOT):
```ini
# Core / proceso principal
BOT_OPCIONES_PORT=4601
VIGO_FUTURES_ENABLED=true
AI_ML_ENABLED=false
BINANCE_TESTNET=false
TRADE_MODE=unified

# Opciones (EAPI)
BINANCE_API_KEY=TU_EAPI_KEY
BINANCE_API_SECRET=TU_EAPI_SECRET
BINANCE_OPTIONS_BASE_URL=https://eapi.binance.com/eapi/v1

# Futuros (FAPI)
BINANCE_FUTURES_BASE_URL=https://fapi.binance.com/fapi/v1
# (Opcional) Alias aceptado por el sistema
FAPI_BASE_URL=https://fapi.binance.com/fapi/v1
```

Notas:
- No mezclar con endpoints/llamadas SPOT.
- VigoFutures usa FAPI; sus credenciales pueden ir en su propio config si aplica.

## Arranque con PM2 (producción)
Desde la raíz del repo:
```bash
npm install
pm2 start ecosystem.config.js --env production
pm2 save
```
Estados y logs:
```bash
pm2 ls
pm2 logs bot-core
pm2 logs frontend-api
pm2 logs frontend-static
```
Reinicios puntuales:
```bash
pm2 restart bot-core --update-env
pm2 restart frontend-api --update-env
pm2 restart frontend-static --update-env
```

## Firewall Windows (opcional)
Ejecutar como Administrador en PowerShell:
```powershell
# Abre TCP 4601-4604
scripts/setup-production.ps1 -OpenFirewall
```
Si no hay permisos, abrir manualmente los puertos o reintentar como admin.

## Endpoints
- Core: `http://localhost:4601/`
  - Salud: `GET /`
  - Ensemble/Modo: `GET/POST /ensemble/config`
  - Unificado: `GET /unified/overview`, `POST /unified/execute`, auto-hedge/auto-exec
- Frontend API: `http://localhost:4602`
- UI estática: `http://localhost:4603`
- Monitor RT: `http://localhost:4604`

## Modo de trading
- Producción por defecto: `unified` (Opciones+Futuros).
- Cambiar por API (si se requiere):
```powershell
Invoke-RestMethod -Uri http://localhost:4601/ensemble/config -Method Post -ContentType application/json -Body '{"tradeMode":"unified"}'
```

## Diagnóstico de Binance (producción)
Script para validar EAPI/FAPI firmados e IP pública:
```bash
node bot-opciones/tools/diagnose-binance.js
```
Salida esperada: códigos 200 en `futures` y `options`.

## Solución de problemas
- Puerto en uso: verificar que no haya procesos previos (la banda 4601–4604 evita colisiones comunes).
- Permisos firewall: ejecutar `scripts/setup-production.ps1 -OpenFirewall` como Administrador.
- PM2 arranque automático en Windows: usar `pm2 save` y mantener PM2 como servicio manual o tarea programada (Windows no soporta todos los inits). El script `scripts/setup-production.ps1` guarda la lista.
- Logs detallados:
```bash
pm2 describe bot-core
pm2 logs --lines 200
```

## Política sin SPOT
- Código y conectores orientados 100% a EAPI (Opciones) y FAPI (Futuros).
- Llamadas SPOT y endpoints asociados están eliminados/bloqueados.

---
Este despliegue prioriza baja colisión de puertos, latencia consistente y separación clara entre Core, API y UI.

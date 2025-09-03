@echo off
echo ACTIVANDO SISTEMA DE TRADING REAL CUANTICO
echo ===========================================
echo.

echo Configurando credenciales de API...
echo.

set /p apiKey="Ingresa tu API Key de Binance: "
if "%apiKey%"=="" (
    echo WARNING - API Key no configurada - usando placeholder
) else (
    setx BINANCE_API_KEY "%apiKey%" /M
    echo OK - API Key configurada
)

echo.
set /p apiSecret="Ingresa tu API Secret de Binance: "
if "%apiSecret%"=="" (
    echo WARNING - API Secret no configurada - usando placeholder
) else (
    setx BINANCE_API_SECRET "%apiSecret%" /M
    echo OK - API Secret configurada
)

echo.
echo Configurando modo PRODUCCION...
setx NODE_ENV "production" /M
setx BINANCE_TESTNET "false" /M
echo OK - Modo REAL activado (no testnet)

echo.
echo Reiniciando servicios...
echo.

echo Deteniendo servicios existentes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.cmd >nul 2>&1
timeout /t 3 >nul

echo.
echo Iniciando SRONA API...
start cmd /c "cd srona-api && set PORT=4601 && npm run dev"

echo Esperando 5 segundos...
timeout /t 5 >nul

echo.
echo Iniciando VigoFutures...
start cmd /c "cd VigoFutures && npm start"

echo Esperando 5 segundos...
timeout /t 5 >nul

echo.
echo Iniciando Frontend Server...
start cmd /c "node frontend-server.js"

echo.
echo ===========================================
echo SISTEMA ACTIVADO EXITOSAMENTE!
echo ===========================================
echo.
echo Estado del sistema:
echo   - Modo: PRODUCCION (REAL TRADING)
echo   - API: Binance Real
echo   - Testnet: DESACTIVADO
echo   - Servicios: SRONA API, VigoFutures, Frontend
echo.
echo URLs de acceso:
echo   - Dashboard Principal: http://localhost:4603
echo   - Monitor de trading: http://localhost:4602
echo.
echo IMPORTANTE:
echo   - Verifica que tus credenciales de Binance sean correctas
echo   - El sistema esta configurado para operaciones REALES
echo   - Monitorea el balance y las posiciones activamente
echo.
echo El sistema cuantico esta listo para generar ganancias!
echo.
pause
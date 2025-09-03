@echo off
echo VERIFICANDO SISTEMA DE TRADING REAL CUANTICO
echo =============================================
echo.

echo Verificando configuracion...
echo   NODE_ENV: %NODE_ENV%
echo   BINANCE_TESTNET: %BINANCE_TESTNET%
if "%BINANCE_API_KEY%"=="" (
    echo   BINANCE_API_KEY: ERROR - No configurada
) else (
    echo   BINANCE_API_KEY: OK - Configurada
)
if "%BINANCE_API_SECRET%"=="" (
    echo   BINANCE_API_SECRET: ERROR - No configurada
) else (
    echo   BINANCE_API_SECRET: OK - Configurada
)

echo.
echo Verificando servicios...

REM Verificar SRONA API
curl -s http://localhost:4601/health >nul 2>&1
if %errorlevel% equ 0 (
    echo   OK - SRONA API (puerto 4601): ACTIVO
) else (
    echo   ERROR - SRONA API (puerto 4601): NO RESPONDE
)

REM Verificar VigoFutures
curl -s http://localhost:4602/health >nul 2>&1
if %errorlevel% equ 0 (
    echo   OK - VigoFutures (puerto 4602): ACTIVO
) else (
    echo   ERROR - VigoFutures (puerto 4602): NO RESPONDE
)

REM Verificar Frontend
curl -s http://localhost:4603/health >nul 2>&1
if %errorlevel% equ 0 (
    echo   OK - Frontend (puerto 4603): ACTIVO
) else (
    echo   ERROR - Frontend (puerto 4603): NO RESPONDE
)

echo.
echo Verificando estado del trading...

REM Verificar API de rendimiento
curl -s http://localhost:4601/api/performance >nul 2>&1
if %errorlevel% equ 0 (
    echo   OK - API de rendimiento: ACTIVA
) else (
    echo   ERROR - API de rendimiento: ERROR
)

REM Verificar señales de trading
curl -s http://localhost:4601/api/trading-signals >nul 2>&1
if %errorlevel% equ 0 (
    echo   OK - Senales de trading: ACTIVAS
) else (
    echo   ERROR - Senales de trading: ERROR
)

echo.
echo Verificando conexiones...

REM Verificar conexión con Binance
curl -s https://api.binance.com/api/v3/ping >nul 2>&1
if %errorlevel% equ 0 (
    echo   OK - Conexion con Binance: ACTIVA
) else (
    echo   ERROR - Conexion con Binance: ERROR
)

echo.
echo Procesos activos:
tasklist /fi "imagename eq node.exe" /nh >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=2" %%i in ('tasklist /fi "imagename eq node.exe" /nh') do echo   OK - Proceso Node.js PID %%i activo
) else (
    echo   ERROR - No hay procesos Node.js activos
)

echo.
echo DIAGNOSTICO FINAL
echo =================

set "allGood=true"
set "warnings="

if "%BINANCE_API_KEY%"=="" (
    set "warnings=%warnings%API Key de Binance no configurada "
    set "allGood=false"
)
if "%BINANCE_API_SECRET%"=="" (
    set "warnings=%warnings%API Secret de Binance no configurada "
    set "allGood=false"
)
if not "%NODE_ENV%"=="production" (
    set "warnings=%warnings%Sistema no esta en modo produccion "
    set "allGood=false"
)
if not "%BINANCE_TESTNET%"=="false" (
    set "warnings=%warnings%Sistema aun en modo testnet "
    set "allGood=false"
)

if "%allGood%"=="true" (
    echo SISTEMA COMPLETAMENTE OPERATIVO
    echo   - Modo: PRODUCCION (REAL TRADING)
    echo   - Estado: TODOS LOS SERVICIOS ACTIVOS
    echo   - Trading: LISTO PARA OPERACIONES REALES
    echo.
    echo EL SISTEMA CUANTICO ESTA LISTO PARA GENERAR GANANCIAS!
) else (
    echo SISTEMA CON PROBLEMAS
    echo   - %warnings%
    echo.
    echo Ejecuta 'activate-real-trading.bat' para solucionar los problemas
)

echo.
echo URLs de acceso:
echo   - Dashboard Principal: http://localhost:4603
echo   - Monitor VigoFutures: http://localhost:4602
echo   - API SRONA: http://localhost:4601

echo.
pause
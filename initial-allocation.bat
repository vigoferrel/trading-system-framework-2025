@echo off
echo ===================================================
echo Sistema de Asignacion Inicial para Trading Cuantico
echo ===================================================
echo.
echo Este script obtiene el saldo de la cuenta Binance
echo y realiza una asignacion inicial de fondos para
echo el sistema de trading basada en algoritmos cuanticos
echo deterministas.
echo.
echo Constantes: z = 9 + 16i @ λ=log(7919)
echo.
echo ===================================================
echo.

REM Verificar si Node.js esta instalado
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js no esta instalado o no se encuentra en el PATH.
    echo Por favor, instale Node.js desde https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Paso 1: Usando archivo .env existente...
echo ✓ Usando cargador centralizado de variables de entorno.
echo   Claves API: hqRRZfq84IhpvxCySYnBkNaO3VurQcrNCze9nfcEWqZvuhL7jeAiwV4yobVPjMTI

echo.
echo Paso 2: Ejecutando sistema de asignacion inicial en segundo plano...
echo.
start /b "Sistema de Asignacion Inicial" cmd /c "node initial-allocation.js > asignacion-inicial.log 2>&1"
echo El sistema de asignacion inicial se esta ejecutando en segundo plano.
echo Los resultados se guardaran en el archivo asignacion-inicial.log
echo.
echo ===================================================
echo.
echo Procesos iniciados en segundo plano:
echo 1. Sistema de Asignacion Inicial (resultados en asignacion-inicial.log)
echo.
echo Para ver los resultados, use el comando:
echo   type asignacion-inicial.log
echo.
echo NOTA: Para detener los procesos, use el Administrador de Tareas.
echo.
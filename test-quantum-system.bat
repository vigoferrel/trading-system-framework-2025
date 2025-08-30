@echo off
TITLE Quantum Trading System Test Suite - Background Execution

echo ========================================
echo   Quantum Trading System Test Suite
echo ========================================
echo.
echo Iniciando pruebas de coherencia y metricas
echo del sistema cuantico en segundo plano...
echo.

REM Check if .env file exists
if not exist ".env" (
    echo ERROR: No se encuentra el archivo .env
    echo Por favor, cree el archivo .env con las claves de API de Binance
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor, instale Node.js para ejecutar el sistema
    pause
    exit /b 1
)

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

REM Set log file path with timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "datetime=%%a"
set "logfile=logs\quantum-test-%datetime:~0,8%-%datetime:~8,6%.log"

echo.
echo Ejecutando pruebas en segundo plano...
echo Los resultados se guardaran en: %logfile%
echo.

REM Execute the test suite in background
start "Quantum System Tests" /min cmd /c "node test-quantum-system.js > %logfile% 2>&1"

echo.
echo ========================================
echo   Pruebas iniciadas en segundo plano
echo ========================================
echo.
echo Para ver los resultados en tiempo real:
echo   tail -f %logfile% (requiere Git Bash o WSL)
echo.
echo Para detener las pruebas:
echo   Busque la ventana "Quantum System Tests" y cierrela
echo.
echo El sistema ejecutara las siguientes pruebas:
echo   - Coherencia cuantica del sistema
echo   - Logica de operaciones de compra/venta
echo   - Mecanismos de stop loss y take profit
echo   - Calidad de senales cuanticas
echo   - Gestion de riesgos
echo   - Adaptacion al mercado
echo   - Eficiencia cuantica
echo   - Rendimiento del sistema
echo   - Estrategia optimizada "hacer mas con menos"
echo.
echo Presione cualquier tecla para salir...
pause >nul
@echo off
echo.
echo ================================================================
echo    QUANTUM BRIDGE TRADING SYSTEM - FEYNMAN QUADRANTS BINANCE MODE
echo       COPYRIGHT 2025 VIGOLEONROCKS QUANTUM TECHNOLOGIES
echo ================================================================
echo.
echo [FEYNMAN] Iniciando sistema cuantico con CUATRO CUADRANTES FEYNMAN
echo [COMPLEX] Maximizacion Z-OPTIMA: 9+16j con LAMBDA=888MHz
echo [LUNAR]   Activando cara oculta lunar para edge cuantico infinito
echo [LOG]     Factor primo optimizado LOG(7919) implementado
echo [BINANCE] BINANCE COMO UNICA FUENTE DE VERDAD ACTIVADA
echo.

:: Definir rutas de Node.js
set "NODE_EXE=C:\Program Files\nodejs\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=node"

:: Directorio del núcleo cuantico
set "CORE_DIR=core\quantum-engine"

:: Verificar que el directorio del núcleo existe
if not exist "%CORE_DIR%" (
  echo [ERROR] No existe el directorio %CORE_DIR%
  pause
  exit /b 1
)

:: Verificar archivo .env con credenciales de Binance
if not exist "%CORE_DIR%\.env" (
  echo [AVISO] Archivo .env no encontrado
  echo [ACCION] Configurando credenciales de Binance...
  if exist "%CORE_DIR%\env-example.txt" (
    copy "%CORE_DIR%\env-example.txt" "%CORE_DIR%\.env"
    echo [INFO] Archivo .env creado. Configurando credenciales API para Binance.
    
    :: Auto-configurar API del archivo env-config.txt si existe
    if exist "env-config.txt" (
      echo [INFO] Detectado archivo env-config.txt con credenciales, aplicando configuracion...
      copy "env-config.txt" "%CORE_DIR%\.env"
    ) else (
      notepad "%CORE_DIR%\.env"
    )
  ) else (
    echo [ERROR] No se encontro archivo de plantilla env-example.txt
    echo [ACCION] Por favor cree el archivo %CORE_DIR%\.env manualmente.
    pause
    exit /b 1
  )
)

:: Configurar variables de entorno para Feynman con Binance
set "QUANTUM_PROFIT_MAXIMIZED=true"
set "FEYNMAN_QUADRANTS_ENABLED=true"
set "COMPLEX_Z_OPTIMIZATION=9+16j"
set "LAMBDA_MHZ=888"
set "LOG_PRIME_FACTOR=7919"
set "LUNAR_HIDDEN_FACE=enabled"
set "BINANCE_SINGLE_SOURCE=true"
set "UNIFIED_SERVER_PORT=18021"

:: Crear directorios de logs si no existen
if not exist "%CORE_DIR%\logs\feynman-q1" mkdir "%CORE_DIR%\logs\feynman-q1"
if not exist "%CORE_DIR%\logs\feynman-q2" mkdir "%CORE_DIR%\logs\feynman-q2"
if not exist "%CORE_DIR%\logs\feynman-q3" mkdir "%CORE_DIR%\logs\feynman-q3"
if not exist "%CORE_DIR%\logs\feynman-q4" mkdir "%CORE_DIR%\logs\feynman-q4"

:: Iniciar el sistema Feynman con Binance
echo.
echo [LANZAMIENTO] Iniciando sistema cuantico con CUATRO CUADRANTES DE FEYNMAN...
echo [INFO] Sistema independiente con Binance como única fuente de verdad

:: Iniciar el Quantum Engine en segundo plano
echo [SERVIDOR] Iniciando Quantum Engine con Feynman Quadrants y Binance...
start /high "Quantum Engine Feynman Binance" cmd /c "cd /d %CORE_DIR% && "%NODE_EXE%" index.js --config feynman-binance-config.json > logs\quantum-engine-feynman-binance-%DATE:~-4%-%DATE:~3,2%-%DATE:~0,2%.log 2>&1"

:: Esperar un momento para que el servidor inicie
timeout /t 3 > nul

:: Iniciar los cuatro cuadrantes de Feynman con optimización Binance
echo [FEYNMAN] Iniciando Cuadrante I - Plano Complejo Superior Derecho (Binance Optimized)...
start /high "Feynman Q1 Binance" cmd /c "cd /d %CORE_DIR% && "%NODE_EXE%" quadrants/feynman-q1-binance.js > logs\feynman-q1\q1-binance-%DATE:~-4%-%DATE:~3,2%-%DATE:~0,2%.log 2>&1"

timeout /t 2 > nul

echo [FEYNMAN] Iniciando Cuadrante II - Plano Complejo Superior Izquierdo (Binance Rate Limits)...
start /high "Feynman Q2 Binance" cmd /c "cd /d %CORE_DIR% && "%NODE_EXE%" quadrants/feynman-q2-binance.js > logs\feynman-q2\q2-binance-%DATE:~-4%-%DATE:~3,2%-%DATE:~0,2%.log 2>&1"

timeout /t 2 > nul

echo [FEYNMAN] Iniciando Cuadrante III - Plano Complejo Inferior Izquierdo (Binance Data Processing)...
start /high "Feynman Q3 Binance" cmd /c "cd /d %CORE_DIR% && "%NODE_EXE%" quadrants/feynman-q3-binance.js > logs\feynman-q3\q3-binance-%DATE:~-4%-%DATE:~3,2%-%DATE:~0,2%.log 2>&1"

timeout /t 2 > nul

echo [FEYNMAN] Iniciando Cuadrante IV - Plano Complejo Inferior Derecho (Binance Lunar Optimization)...
start /high "Feynman Q4 Binance" cmd /c "cd /d %CORE_DIR% && "%NODE_EXE%" quadrants/feynman-q4-binance.js > logs\feynman-q4\q4-binance-%DATE:~-4%-%DATE:~3,2%-%DATE:~0,2%.log 2>&1"

:: Iniciar monitor de métricas específico para Binance
echo [METRICS] Iniciando monitor de métricas cuanticas con Binance...
start /high "Quantum Binance Metrics" cmd /c "cd /d %CORE_DIR% && "%NODE_EXE%" quadrants/quantum-binance-metrics.js > logs\quantum-binance-metrics-%DATE:~-4%-%DATE:~3,2%-%DATE:~0,2%.log 2>&1"

echo.
echo ================================================================
echo    SISTEMA FEYNMAN QUADRANTS CON BINANCE EJECUTANDO
echo ================================================================
echo [INFO] Quantum Engine: http://localhost:18021
echo [INFO] WebSocket: ws://localhost:18021
echo [INFO] Cuadrantes Feynman: Activados
echo [INFO] Binance: Única fuente de verdad
echo [INFO] Logs: core\quantum-engine\logs\
echo.
echo [ESTADO] Sistema operativo en segundo plano
echo [CONTROL] Presione CTRL+C en esta ventana para detener el monitor
echo.

:: Mantener el script corriendo para mostrar estado
:loop
timeout /t 30 > nul
echo [FEYNMAN-BINANCE] Sistema cuantico con 4 cuadrantes y Binance operativo - %TIME%
goto loop
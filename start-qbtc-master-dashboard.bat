@echo off
REM QBTC MASTER DASHBOARD LAUNCHER
REM ================================
REM Script de inicio rápido para el dashboard unificado QBTC

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                        🧠 QBTC MASTER DASHBOARD                           ║
echo ║                    🤖 CONTROL ABSOLUTO LLM SYSTEM 🤖                      ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  Iniciando Dashboard Unificado de Inteligencia Cuántica...                 ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 🚀 Iniciando servicios del sistema QBTC...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js no está instalado
    echo 📥 Descargue Node.js desde: https://nodejs.org
    pause
    exit /b 1
)

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python no está instalado
    echo 📥 Descargue Python desde: https://python.org
    pause
    exit /b 1
)

echo ✅ Verificando dependencias...
echo.

REM Instalar dependencias de Node.js si no existen
if not exist "node_modules" (
    echo 📦 Instalando dependencias de Node.js...
    npm install
    echo ✅ Dependencias instaladas
) else (
    echo ✅ Dependencias ya instaladas
)

echo.
echo 🔧 Iniciando servicios backend...
echo.

REM Iniciar LLM Neural Server en background
echo 🧠 Iniciando LLM Neural Server (puerto 4607)...
start "LLM Neural Server" cmd /c "node llm-neural-server.js"

REM Esperar un momento para que se inicie
timeout /t 3 /nobreak >nul

REM Iniciar QBTC Quantum System en background
echo ⚛️ Iniciando QBTC Quantum System (puerto 4602)...
start "QBTC Quantum System" cmd /c "node qbtc-unified-prime-quantum-system.js"

REM Esperar un momento para que se inicie
timeout /t 3 /nobreak >nul

REM Iniciar Advanced Sentiment Dashboard en background
echo 📊 Iniciando Advanced Sentiment Dashboard (puerto 4604)...
start "Advanced Sentiment Dashboard" cmd /c "node advanced-sentiment-dashboard.js"

REM Esperar un momento para que se inicie
timeout /t 3 /nobreak >nul

REM Iniciar Sector Analysis Service en background
echo 📈 Iniciando Sector Analysis Service (puerto 4605)...
start "Sector Analysis Service" cmd /c "node sector-analysis-service.js"

REM Esperar un momento para que se inicie
timeout /t 3 /nobreak >nul

REM Esperar un momento para que se inicien todos los servicios
timeout /t 5 /nobreak >nul

echo.
echo 🌐 Abriendo QBTC Master Dashboard...
echo.

REM Abrir el dashboard en el navegador predeterminado
start qbtc-master-dashboard.html

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                           ✅ SISTEMA INICIADO                             ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  Servicios Activos:                                                        ║
echo ║  🧠 LLM Neural Server          → http://localhost:4607                    ║
echo ║  ⚛️ QBTC Quantum System        → http://localhost:4602                    ║
echo ║  📊 Advanced Sentiment         → http://localhost:4604                    ║
echo ║  📈 Sector Analysis Service    → http://localhost:4605                    ║
echo ║                                                                              ║
echo ║  🎯 Dashboard Principal        → qbtc-master-dashboard.html               ║
echo ║                                                                              ║
echo ║  📈 Funcionalidades:                                                       ║
echo ║  • Monitoreo de 475+ símbolos                                             ║
echo ║  • Recomendaciones LLM unificadas                                        ║
echo ║  • Insights de sistemas de IA                                            ║
echo ║  • Análisis sectorial macro con 6 sectores                               ║
echo ║  • Dinámicas cross-sector y correlaciones                                ║
echo ║  • Métricas de rendimiento en tiempo real                                ║
echo ║  • Auto-refresh inteligente                                              ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

echo 🔄 El dashboard se actualizará automáticamente cada 30 segundos
echo 💡 Presione Ctrl+C en cualquier terminal para detener los servicios
echo.

REM Mantener la ventana abierta
pause</content>
<parameter name="filePath">c:\Users\DELL\Desktop\opciones\start-qbtc-master-dashboard.bat

@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                🎯 QUANTUM TRADING HUB                                       ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  Iniciando Quantum Trading Hub - Interfaz Unificada...                     ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 🛑 Deteniendo procesos existentes...
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak >nul

echo 🚀 Iniciando Quantum Trading Hub (puerto 4600)...
start "Quantum Trading Hub" cmd /k "cd /d \"%~dp0\" && node quantum-trading-hub.js"

echo.
echo ⏳ Esperando que el servicio se inicie...
timeout /t 5 /nobreak >nul

echo.
echo 📊 Verificando puerto...
netstat -ano | findstr ":4600"

echo.
echo 🎯 Abriendo Quantum Trading Hub...
start http://localhost:4600

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    ✅ QUANTUM TRADING HUB INICIADO                          ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  🎯 Quantum Trading Hub: http://localhost:4600                             ║
echo ║                                                                              ║
echo ║  📊 MÓDULOS UNIFICADOS:                                                    ║
echo ║  • 📊 Dashboard Overview                                                   ║
echo ║  • 💰 Portfolio Management                                                 ║
echo ║  • 📈 Trading Interface                                                    ║
echo ║  • 🎯 Sentiment Analysis                                                   ║
echo ║  • 📊 Analytics & Risk                                                     ║
echo ║  • ⚙️ System Settings                                                      ║
echo ║                                                                              ║
echo ║  🎨 CARACTERÍSTICAS:                                                        ║
echo ║  • Sidebar Navigation                                                      ║
echo ║  • Unified Interface                                                       ║
echo ║  • Real-time Updates                                                       ║
echo ║  • Portfolio Management                                                    ║
echo ║  • Trade Execution                                                         ║
echo ║  • Market Data                                                             ║
echo ║  • Sentiment Analysis                                                      ║
echo ║  • Performance Analytics                                                   ║
echo ║                                                                              ║
echo ║  🔄 Auto-refresh: Cada 30 segundos                                         ║
echo ║  📡 Real-time Updates: Habilitado                                         ║
echo ║  🎨 Tema: ASCII puro con terminal verde                                    ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
pause

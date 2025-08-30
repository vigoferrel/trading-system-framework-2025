@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                🎯 QUANTUM PORTFOLIO MANAGER                                 ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  Iniciando Quantum Portfolio Manager con seguimiento completo...           ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 🛑 Deteniendo procesos existentes...
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak >nul

echo 🚀 Iniciando Quantum Portfolio Manager (puerto 4607)...
start "Quantum Portfolio Manager" cmd /k "node quantum-portfolio-manager.js"

echo.
echo ⏳ Esperando que el servicio se inicie...
timeout /t 5 /nobreak >nul

echo.
echo 📊 Verificando puerto...
netstat -ano | findstr ":4607"

echo.
echo 🎯 Abriendo Quantum Portfolio Manager...
start http://localhost:4607

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    ✅ PORTFOLIO MANAGER INICIADO                           ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  🎯 Portfolio Manager: http://localhost:4607                               ║
echo ║                                                                              ║
echo ║  💰 FEATURES PRINCIPALES:                                                 ║
echo ║  • Real-time Portfolio Tracking                                           ║
echo ║  • Trade History & P&L Analysis                                          ║
echo ║  • Risk Management & Position Sizing                                     ║
echo ║  • Asset Allocation & Diversification                                    ║
echo ║  • Performance Metrics & Analytics                                       ║
echo ║  • Add/Close Trades in Real-time                                         ║
echo ║                                                                              ║
echo ║  📊 PORTFOLIO METRICS:                                                    ║
echo ║  • Total Portfolio Value                                                  ║
echo ║  • Cash Management                                                        ║
echo ║  • Unrealized P&L Tracking                                               ║
echo ║  • Win Rate & Performance Analytics                                      ║
echo ║  • Sharpe Ratio & Risk Metrics                                           ║
echo ║                                                                              ║
echo ║  🔄 Auto-refresh: Cada 30 segundos                                         ║
echo ║  📡 Real-time Updates: Habilitado                                         ║
echo ║  🎨 Tema: ASCII puro con terminal verde                                    ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
pause

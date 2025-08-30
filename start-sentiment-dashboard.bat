@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    🎯 QUANTUM SENTIMENT DASHBOARD                           ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  Iniciando Sentiment Dashboard con ASCII puro...                           ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 🛑 Deteniendo procesos existentes...
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak >nul

echo 🚀 Iniciando Sentiment Dashboard (puerto 4603)...
start "Sentiment Dashboard" cmd /k "node sentiment-dashboard.js"

echo.
echo ⏳ Esperando que el servicio se inicie...
timeout /t 5 /nobreak >nul

echo.
echo 📊 Verificando puerto...
netstat -ano | findstr ":4603"

echo.
echo 🎯 Abriendo Sentiment Dashboard...
start http://localhost:4603

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    ✅ SENTIMENT DASHBOARD INICIADO                          ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  🎯 Sentiment Dashboard: http://localhost:4603                             ║
echo ║                                                                              ║
echo ║  📊 FEATURES DISPONIBLES:                                                  ║
echo ║  • Sentiment Radar (Circular ASCII)                                        ║
echo ║  • Holdings & P&L Monitor                                                  ║
echo ║  • Multi-Timeframe Projections                                             ║
echo ║  • AI Sentiment Engine                                                     ║
echo ║  • Risk Metrics (VaR, Sharpe, etc.)                                        ║
echo ║  • Quantum Correlation Matrix                                              ║
echo ║                                                                              ║
echo ║  🔄 Auto-refresh: Cada 30 segundos                                         ║
echo ║  🎨 Tema: ASCII puro con terminal verde                                    ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
pause

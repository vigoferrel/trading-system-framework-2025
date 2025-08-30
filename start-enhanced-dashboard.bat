@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                🎯 QUANTUM PRICE DASHBOARD ENHANCED                          ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  Iniciando Quantum Price Dashboard Enhanced con datos reales...            ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 🛑 Deteniendo procesos existentes...
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak >nul

echo 🚀 Iniciando Quantum Price Dashboard Enhanced (puerto 4606)...
start "Quantum Price Dashboard Enhanced" cmd /k "node quantum-price-dashboard-enhanced.js"

echo.
echo ⏳ Esperando que el servicio se inicie...
timeout /t 5 /nobreak >nul

echo.
echo 📊 Verificando puerto...
netstat -ano | findstr ":4606"

echo.
echo 🎯 Abriendo Quantum Price Dashboard Enhanced...
start http://localhost:4606

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    ✅ ENHANCED DASHBOARD INICIADO                           ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  🎯 Enhanced Dashboard: http://localhost:4606                              ║
echo ║                                                                              ║
echo ║  💰 SYMBOLS DISPONIBLES:                                                   ║
echo ║  BTC | ETH | BNB | SOL | XRP | DOGE | ADA | DOT | LINK | MATIC              ║
echo ║                                                                              ║
echo ║  📊 FEATURES REALES:                                                       ║
echo ║  • Real-time Price Data from Binance API                                  ║
echo ║  • Greeks Analysis with Trader Explanations                               ║
echo ║  • Quantum Sentiment with Real News & Social Data                         ║
echo ║  • Multi-timeframe Projections with Real Calculations                     ║
echo ║  • Auto-refresh every 30 seconds                                         ║
echo ║                                                                              ║
echo ║  🔄 Auto-refresh: Cada 30 segundos                                         ║
echo ║  📡 Real Data Updates: Cada 5 minutos                                     ║
echo ║  🎨 Tema: ASCII puro con terminal verde                                    ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
pause

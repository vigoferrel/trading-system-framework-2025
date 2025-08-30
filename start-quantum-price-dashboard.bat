@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    🎯 QUANTUM PRICE DASHBOARD                              ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  Iniciando Quantum Price Dashboard con selector de símbolos...             ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 🛑 Deteniendo procesos existentes...
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak >nul

echo 🚀 Iniciando Quantum Price Dashboard (puerto 4605)...
start "Quantum Price Dashboard" cmd /k "node quantum-price-dashboard.js"

echo.
echo ⏳ Esperando que el servicio se inicie...
timeout /t 5 /nobreak >nul

echo.
echo 📊 Verificando puerto...
netstat -ano | findstr ":4605"

echo.
echo 🎯 Abriendo Quantum Price Dashboard...
start http://localhost:4605

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    ✅ QUANTUM PRICE DASHBOARD INICIADO                      ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  🎯 Quantum Price Dashboard: http://localhost:4605                          ║
echo ║                                                                              ║
echo ║  💰 SYMBOLS DISPONIBLES:                                                   ║
echo ║  BTC | ETH | BNB | SOL | XRP | DOGE | ADA | DOT | LINK | MATIC              ║
echo ║                                                                              ║
echo ║  📊 FEATURES:                                                              ║
echo ║  • Real-time Price Display with Emphasis                                   ║
echo ║  • Symbol Selector with 10 Cryptocurrencies                               ║
echo ║  • Greeks Analysis (Delta, Gamma, Theta, Vega, Rho)                       ║
echo ║  • Quantum Sentiment Analysis                                              ║
echo ║  • Multi-timeframe Price Projections                                      ║
echo ║  • Auto-refresh every 30 seconds                                          ║
echo ║                                                                              ║
echo ║  🔄 Auto-refresh: Cada 30 segundos                                         ║
echo ║  🎨 Tema: ASCII puro con terminal verde                                    ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
pause

@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    🎯 ADVANCED QUANTUM SENTIMENT DASHBOARD                  ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  Iniciando Advanced Sentiment Dashboard con IA real...                     ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 🛑 Deteniendo procesos existentes...
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak >nul

echo 🚀 Iniciando Advanced Sentiment Dashboard (puerto 4604)...
start "Advanced Sentiment Dashboard" cmd /k "node advanced-sentiment-dashboard.js"

echo.
echo ⏳ Esperando que el servicio se inicie...
timeout /t 5 /nobreak >nul

echo.
echo 📊 Verificando puerto...
netstat -ano | findstr ":4604"

echo.
echo 🎯 Abriendo Advanced Sentiment Dashboard...
start http://localhost:4604

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    ✅ ADVANCED DASHBOARD INICIADO                           ║
echo ╠══════════════════════════════════════════════════════════════════════════════╣
echo ║                                                                              ║
echo ║  🎯 Advanced Dashboard: http://localhost:4604                              ║
echo ║                                                                              ║
echo ║  🧠 AI FEATURES DISPONIBLES:                                              ║
echo ║  • Real AI Sentiment Analysis with NLP                                    ║
echo ║  • Greeks (Delta, Gamma, Theta, Vega, Rho)                               ║
echo ║  • Quantum Equations & Entanglement Metrics                               ║
echo ║  • Per-Symbol Multi-Timeframe Projections                                 ║
echo ║  • Advanced Risk Metrics (VaR, CVaR, Expected Shortfall)                  ║
echo ║  • Market Microstructure Analysis                                         ║
echo ║  • Whale Activity Detection                                               ║
echo ║  • Social Sentiment Aggregation                                           ║
echo ║                                                                              ║
echo ║  ⚛️ QUANTUM EQUATIONS:                                                     ║
echo ║  • Schrödinger: iℏ∂ψ/∂t = Ĥψ                                             ║
echo ║  • Entanglement: |ψ⟩ = (|00⟩ + |11⟩)/√2                                  ║
echo ║  • Coherence: T₂ = 1/(1/T₂* + 1/T₂')                                     ║
echo ║  • Tunneling: P = exp(-2d√(2m(V-E))/ℏ)                                   ║
echo ║                                                                              ║
echo ║  🔄 Auto-refresh: Cada 30 segundos                                         ║
echo ║  🎨 Tema: ASCII puro con terminal verde                                    ║
echo ║                                                                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
pause

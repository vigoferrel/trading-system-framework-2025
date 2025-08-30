# Quantum Trading Hub PowerShell Launcher
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                🎯 QUANTUM TRADING HUB                                       ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║                                                                              ║" -ForegroundColor Green
Write-Host "║  Iniciando Quantum Trading Hub - Interfaz Unificada...                     ║" -ForegroundColor Green
Write-Host "║                                                                              ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

Write-Host "🛑 Deteniendo procesos existentes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

Write-Host "🚀 Iniciando Quantum Trading Hub (puerto 4600)..." -ForegroundColor Green
Start-Process -FilePath "node" -ArgumentList "quantum-trading-hub.js" -WindowStyle Normal

Write-Host ""
Write-Host "⏳ Esperando que el servicio se inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "📊 Verificando puerto..." -ForegroundColor Cyan
netstat -ano | Select-String ":4600"

Write-Host ""
Write-Host "🎯 Abriendo Quantum Trading Hub..." -ForegroundColor Green
Start-Process "http://localhost:4600"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    ✅ QUANTUM TRADING HUB INICIADO                          ║" -ForegroundColor Green
Write-Host "╠══════════════════════════════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║                                                                              ║" -ForegroundColor Green
Write-Host "║  🎯 Quantum Trading Hub: http://localhost:4600                             ║" -ForegroundColor Green
Write-Host "║                                                                              ║" -ForegroundColor Green
Write-Host "║  📊 MÓDULOS UNIFICADOS:                                                    ║" -ForegroundColor Green
Write-Host "║  • 📊 Dashboard Overview                                                   ║" -ForegroundColor Green
Write-Host "║  • 💰 Portfolio Management                                                 ║" -ForegroundColor Green
Write-Host "║  • 📈 Trading Interface                                                    ║" -ForegroundColor Green
Write-Host "║  • 🎯 Sentiment Analysis                                                   ║" -ForegroundColor Green
Write-Host "║  • 📊 Analytics & Risk                                                     ║" -ForegroundColor Green
Write-Host "║  • ⚙️ System Settings                                                      ║" -ForegroundColor Green
Write-Host "║                                                                              ║" -ForegroundColor Green
Write-Host "║  🎨 CARACTERÍSTICAS:                                                        ║" -ForegroundColor Green
Write-Host "║  • Sidebar Navigation                                                      ║" -ForegroundColor Green
Write-Host "║  • Unified Interface                                                       ║" -ForegroundColor Green
Write-Host "║  • Real-time Updates                                                       ║" -ForegroundColor Green
Write-Host "║  • Portfolio Management                                                    ║" -ForegroundColor Green
Write-Host "║  • Trade Execution                                                         ║" -ForegroundColor Green
Write-Host "║  • Market Data                                                             ║" -ForegroundColor Green
Write-Host "║  • Sentiment Analysis                                                      ║" -ForegroundColor Green
Write-Host "║  • Performance Analytics                                                   ║" -ForegroundColor Green
Write-Host "║                                                                              ║" -ForegroundColor Green
Write-Host "║  🔄 Auto-refresh: Cada 30 segundos                                         ║" -ForegroundColor Green
Write-Host "║  📡 Real-time Updates: Habilitado                                         ║" -ForegroundColor Green
Write-Host "║  🎨 Tema: ASCII puro con terminal verde                                    ║" -ForegroundColor Green
Write-Host "║                                                                              ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Read-Host "Presiona Enter para continuar..."

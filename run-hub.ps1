# Simple Quantum Trading Hub Launcher
Write-Host "🎯 Starting Quantum Trading Hub..." -ForegroundColor Green

# Change to script directory
Set-Location $PSScriptRoot

# Kill existing Node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Start the hub
Write-Host "🚀 Launching Quantum Trading Hub on port 4600..." -ForegroundColor Yellow
node quantum-hub-simple.js

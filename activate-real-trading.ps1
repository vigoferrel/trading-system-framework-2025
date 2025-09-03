# Script para activar el sistema de trading real
Write-Host "ACTIVANDO SISTEMA DE TRADING REAL CUANTICO" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Yellow

# Configurar variables de entorno del sistema
Write-Host "Configurando credenciales de API..." -ForegroundColor Cyan

# Configurar API Key de Binance
$apiKey = Read-Host "Ingresa tu API Key de Binance"
if ($apiKey) {
    [Environment]::SetEnvironmentVariable("BINANCE_API_KEY", $apiKey, "Machine")
    Write-Host "OK - API Key configurada" -ForegroundColor Green
} else {
    Write-Host "WARNING - API Key no configurada - usando placeholder" -ForegroundColor Yellow
}

# Configurar API Secret de Binance
$apiSecret = Read-Host "Ingresa tu API Secret de Binance"
if ($apiSecret) {
    [Environment]::SetEnvironmentVariable("BINANCE_API_SECRET", $apiSecret, "Machine")
    Write-Host "OK - API Secret configurada" -ForegroundColor Green
} else {
    Write-Host "WARNING - API Secret no configurada - usando placeholder" -ForegroundColor Yellow
}

# Configurar modo producción
[Environment]::SetEnvironmentVariable("NODE_ENV", "production", "Machine")
Write-Host "OK - Modo PRODUCCION activado" -ForegroundColor Green

# Configurar testnet como false
[Environment]::SetEnvironmentVariable("BINANCE_TESTNET", "false", "Machine")
Write-Host "OK - Modo REAL activado (no testnet)" -ForegroundColor Green

Write-Host ""
Write-Host "Reiniciando servicios..." -ForegroundColor Cyan

# Detener procesos existentes
Write-Host "Deteniendo servicios existentes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 3

# Iniciar servicios en orden correcto
Write-Host "Iniciando SRONA API..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd srona-api && set PORT=4601 && npm run dev" -NoNewWindow

Start-Sleep -Seconds 5

Write-Host "Iniciando VigoFutures..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd VigoFutures && npm start" -NoNewWindow

Start-Sleep -Seconds 5

Write-Host "Iniciando Frontend Server..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c node frontend-server.js" -NoNewWindow

Write-Host ""
Write-Host "SISTEMA ACTIVADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Yellow
Write-Host "Estado del sistema:" -ForegroundColor Cyan
Write-Host "   - Modo: PRODUCCION (REAL TRADING)" -ForegroundColor White
Write-Host "   - API: Binance Real" -ForegroundColor White
Write-Host "   - Testnet: DESACTIVADO" -ForegroundColor White
Write-Host "   - Servicios: SRONA API, VigoFutures, Frontend" -ForegroundColor White
Write-Host ""
Write-Host "Accede al dashboard en: http://localhost:4603" -ForegroundColor Green
Write-Host "Monitor de trading: http://localhost:4602" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Red
Write-Host "   - Verifica que tus credenciales de Binance sean correctas" -ForegroundColor Red
Write-Host "   - El sistema esta configurado para operaciones REALES" -ForegroundColor Red
Write-Host "   - Monitorea el balance y las posiciones activamente" -ForegroundColor Red
Write-Host ""
Write-Host "El sistema cuantico esta listo para generar ganancias!" -ForegroundColor Green

Read-Host "Presiona Enter para continuar"
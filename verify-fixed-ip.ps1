# Verificación de IP Fija
Write-Host "=== SISTEMA DE IP FIJA ===" -ForegroundColor Green
Write-Host "IP Whitelisted: 181.43.148.169" -ForegroundColor Cyan

# Verificar IP
Write-Host "`nVerificando IP actual..." -ForegroundColor Yellow
try {
    $currentIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing -TimeoutSec 10).Content
    Write-Host "IP actual: $currentIP" -ForegroundColor White

    if ($currentIP -eq "181.43.148.169") {
        Write-Host "✅ IP CORRECTA - Whitelisted en Binance" -ForegroundColor Green
    } else {
        Write-Host "❌ IP INCORRECTA - No whitelisted en Binance" -ForegroundColor Red
        Write-Host "Configure VPN o router para mantener IP fija" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error obteniendo IP" -ForegroundColor Red
}

# Verificar archivos
Write-Host "`nVerificando archivos de configuracion..." -ForegroundColor Yellow
$files = @("fixed-ip-config.json", "fixed-ip-manager.js", "check-balance.js")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file - OK" -ForegroundColor Green
    } else {
        Write-Host "❌ $file - FALTA" -ForegroundColor Red
    }
}

# Probar balance si existe el script
Write-Host "`nProbando balance de Binance..." -ForegroundColor Yellow
if (Test-Path "check-balance.js") {
    Write-Host "Ejecutando script de balance..." -ForegroundColor Cyan
    try {
        & node check-balance.js
    } catch {
        Write-Host "Error ejecutando balance" -ForegroundColor Red
    }
} else {
    Write-Host "Script de balance no encontrado" -ForegroundColor Red
}

Write-Host "`n=== VERIFICACION COMPLETADA ===" -ForegroundColor Green

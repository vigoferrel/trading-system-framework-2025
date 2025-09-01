# Sistema de IP Fija Simplificado
# Verificación y configuración de IP whitelisted

Write-Host "=== SISTEMA DE IP FIJA PARA BINANCE ===" -ForegroundColor Green
Write-Host "IP Whitelisted: 181.43.148.169" -ForegroundColor Cyan

# Función para verificar IP
function Test-FixedIP {
    Write-Host "`n=== VERIFICANDO IP FIJA ===" -ForegroundColor Yellow

    try {
        $currentIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing -TimeoutSec 10).Content
        Write-Host "IP actual: $currentIP" -ForegroundColor White
        Write-Host "IP esperada: 181.43.148.169" -ForegroundColor White

        if ($currentIP -eq "181.43.148.169") {
            Write-Host "✅ IP CORRECTA - Whitelisted en Binance" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ IP INCORRECTA - No whitelisted" -ForegroundColor Red
            Write-Host "Solución: Configure VPN o router para IP fija" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "❌ Error obteniendo IP: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Función para probar balance
function Test-BinanceBalance {
    Write-Host "`n=== PROBANDO BALANCE DE BINANCE ===" -ForegroundColor Yellow

    if (Test-Path "check-balance.js") {
        Write-Host "Ejecutando script de balance..." -ForegroundColor Cyan
        try {
            $result = & node check-balance.js 2>&1
            Write-Host "Resultado:" -ForegroundColor White
            Write-Host $result -ForegroundColor Gray
            return $true
        } catch {
            Write-Host "❌ Error ejecutando balance: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "❌ Script check-balance.js no encontrado" -ForegroundColor Red
        return $false
    }
}

# Función para verificar configuración
function Test-Configuration {
    Write-Host "`n=== VERIFICANDO CONFIGURACIÓN ===" -ForegroundColor Yellow

    $files = @("fixed-ip-config.json", "fixed-ip-manager.js", "ip-monitor.ps1", "check-balance.js")

    foreach ($file in $files) {
        if (Test-Path $file) {
            Write-Host "✅ $file - Encontrado" -ForegroundColor Green
        } else {
            Write-Host "❌ $file - No encontrado" -ForegroundColor Red
        }
    }
}

# Función para mostrar estado
function Show-SystemStatus {
    Write-Host "`n=== ESTADO DEL SISTEMA ===" -ForegroundColor Yellow

    # Verificar Node.js
    try {
        $nodeVersion = & node --version 2>$null
        Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node.js: No instalado" -ForegroundColor Red
    }

    # Verificar IP
    $ipStatus = Test-FixedIP

    # Verificar archivos
    Test-Configuration

    # Resultado final
    Write-Host "`n=== RESULTADO FINAL ===" -ForegroundColor Yellow
    if ($ipStatus) {
        Write-Host "✅ SISTEMA LISTO - IP whitelisted y configurada" -ForegroundColor Green
    } else {
        Write-Host "❌ SISTEMA REQUIERE CONFIGURACIÓN" -ForegroundColor Red
    }
}

# Menú principal
do {
    Write-Host "`n=== MENÚ PRINCIPAL ===" -ForegroundColor Yellow
    Write-Host "1. Ver estado completo" -ForegroundColor White
    Write-Host "2. Verificar IP fija" -ForegroundColor White
    Write-Host "3. Probar balance de Binance" -ForegroundColor White
    Write-Host "4. Ver configuración" -ForegroundColor White
    Write-Host "5. Salir" -ForegroundColor White
    Write-Host "`nSeleccione opción (1-5): " -NoNewline

    $choice = Read-Host

    switch ($choice) {
        "1" { Show-SystemStatus }
        "2" { $null = Test-FixedIP }
        "3" { $null = Test-BinanceBalance }
        "4" { Test-Configuration }
        "5" {
            Write-Host "Saliendo..." -ForegroundColor Green
            break
        }
        default { Write-Host "Opción inválida" -ForegroundColor Red }
    }

    if ($choice -ne "5") {
        Read-Host "`nPresione Enter para continuar"
    }
} while ($choice -ne "5")

Write-Host "`n=== SESIÓN FINALIZADA ===" -ForegroundColor Green

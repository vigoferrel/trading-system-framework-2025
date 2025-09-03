# Sistema de Integración QBTC - Bots + Trading
# Script para integrar la red de bots con el sistema de trading quantum

Write-Host "=== INTEGRACIÓN QBTC: BOTS + TRADING SYSTEM ===" -ForegroundColor Green

# Configuración de bots
$botConfigs = @(
    @{Name="bot-01"; IP="192.168.100.10"; Port="3001"; Url="http://localhost:3001"},
    @{Name="bot-02"; IP="192.168.100.11"; Port="3002"; Url="http://localhost:3002"},
    @{Name="bot-03"; IP="192.168.100.12"; Port="3003"; Url="http://localhost:3003"},
    @{Name="bot-04"; IP="192.168.100.13"; Port="3004"; Url="http://localhost:3004"},
    @{Name="bot-05"; IP="192.168.100.14"; Port="3005"; Url="http://localhost:3005"}
)

# Función para verificar estado del sistema
function Get-SystemStatus {
    Write-Host "`n=== ESTADO DEL SISTEMA ===" -ForegroundColor Green

    # Verificar red Docker
    try {
        $networkInfo = docker network inspect bot-network 2>$null
        if ($networkInfo) {
            Write-Host "✓ Red Docker: bot-network (192.168.100.0/24)" -ForegroundColor Green
        } else {
            Write-Host "✗ Red Docker: No encontrada" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ Error al verificar red Docker" -ForegroundColor Red
    }

    # Verificar bots
    $activeBots = 0
    foreach ($bot in $botConfigs) {
        try {
            $response = Invoke-RestMethod -Uri $bot.Url -TimeoutSec 3
            if ($response.status -eq "running") {
                Write-Host "✓ $($bot.Name): $($response.ip) - Activo" -ForegroundColor Green
                $activeBots++
            } else {
                Write-Host "⚠ $($bot.Name): $($response.ip) - Estado desconocido" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "✗ $($bot.Name): Error de conexión" -ForegroundColor Red
        }
    }

    Write-Host "`nBots activos: $activeBots/5" -ForegroundColor Cyan

    # Verificar archivos del sistema de trading
    Write-Host "`n=== ARCHIVOS DEL SISTEMA ===" -ForegroundColor Green
    $tradingFiles = @(
        "qbtc-quantum-ip-integration.js",
        "qbtc-vpn-solution.js",
        "binance-connector.js",
        "backend-real.py"
    )

    foreach ($file in $tradingFiles) {
        if (Test-Path $file) {
            Write-Host "✓ $file" -ForegroundColor Green
        } else {
            Write-Host "✗ $file - No encontrado" -ForegroundColor Red
        }
    }
}

# Función para ejecutar pruebas de integración
function Test-Integration {
    Write-Host "`n=== PRUEBAS DE INTEGRACIÓN ===" -ForegroundColor Green

    # Prueba 1: Verificar que los bots responden
    Write-Host "Prueba 1: Conectividad de bots..." -ForegroundColor Cyan
    $botResponses = 0
    foreach ($bot in $botConfigs) {
        try {
            $response = Invoke-RestMethod -Uri $bot.Url -TimeoutSec 3
            $botResponses++
        } catch {
            # No hacer nada, ya se cuenta
        }
    }
    Write-Host "Bots respondiendo: $botResponses/5" -ForegroundColor $(if ($botResponses -eq 5) { "Green" } else { "Yellow" })

    # Prueba 2: Verificar configuración de red
    Write-Host "Prueba 2: Configuración de red..." -ForegroundColor Cyan
    try {
        $containers = docker ps --filter network=bot-network --format "{{.Names}}" 2>$null
        $containerCount = ($containers | Measure-Object).Count
        Write-Host "Contenedores en red: $containerCount/5" -ForegroundColor $(if ($containerCount -eq 5) { "Green" } else { "Yellow" })
    } catch {
        Write-Host "Error al verificar contenedores" -ForegroundColor Red
    }

    # Prueba 3: Verificar IPs fijas
    Write-Host "Prueba 3: IPs fijas..." -ForegroundColor Cyan
    $correctIPs = 0
    foreach ($bot in $botConfigs) {
        try {
            $response = Invoke-RestMethod -Uri $bot.Url -TimeoutSec 3
            if ($response.ip -eq $bot.IP) {
                $correctIPs++
            }
        } catch {
            # No hacer nada
        }
    }
    Write-Host "IPs correctas: $correctIPs/5" -ForegroundColor $(if ($correctIPs -eq 5) { "Green" } else { "Yellow" })
}

# Función para mostrar información de integración
function Show-IntegrationInfo {
    Write-Host "`n=== INFORMACIÓN DE INTEGRACIÓN ===" -ForegroundColor Green
    Write-Host "Red Docker: bot-network (192.168.100.0/24)" -ForegroundColor Cyan
    Write-Host "Gateway: 192.168.100.1" -ForegroundColor Cyan
    Write-Host "Rango IPs: 192.168.100.10 - 192.168.100.14" -ForegroundColor Cyan

    Write-Host "`n=== BOTS CONFIGURADOS ===" -ForegroundColor Yellow
    foreach ($bot in $botConfigs) {
        Write-Host "$($bot.Name): $($bot.IP) -> localhost:$($bot.Port)" -ForegroundColor White
    }

    Write-Host "`n=== COMANDOS DE GESTIÓN ===" -ForegroundColor Yellow
    Write-Host "Ver estado: docker ps --filter network=bot-network" -ForegroundColor Cyan
    Write-Host "Ver logs: docker logs <bot-name>" -ForegroundColor Cyan
    Write-Host "Reiniciar: docker restart <bot-name>" -ForegroundColor Cyan
    Write-Host "Gestión completa: .\qbtc-bot-manager.ps1" -ForegroundColor Cyan

    Write-Host "`n=== INTEGRACIÓN CON TRADING ===" -ForegroundColor Yellow
    Write-Host "Para usar las IPs fijas en el sistema de trading:" -ForegroundColor White
    Write-Host "1. Configurar VPN con IP whitelisted en Binance" -ForegroundColor White
    Write-Host "2. Usar .\qbtc-vpn-solution.js para gestión VPN" -ForegroundColor White
    Write-Host "3. Ejecutar .\qbtc-quantum-ip-integration.js" -ForegroundColor White
    Write-Host "4. Los bots están listos para operaciones distribuidas" -ForegroundColor White
}

# Función para ejecutar sistema de trading
function Start-TradingSystem {
    Write-Host "`n=== INICIANDO SISTEMA DE TRADING ===" -ForegroundColor Green

    if (Test-Path "qbtc-quantum-ip-integration.js") {
        Write-Host "Ejecutando integración quantum..." -ForegroundColor Cyan
        node qbtc-quantum-ip-integration.js
    } else {
        Write-Host "Archivo qbtc-quantum-ip-integration.js no encontrado" -ForegroundColor Red
    }
}

# Menú principal
do {
    Write-Host "`n=== MENÚ DE INTEGRACIÓN ===" -ForegroundColor Yellow
    Write-Host "1. Ver estado del sistema" -ForegroundColor White
    Write-Host "2. Ejecutar pruebas de integración" -ForegroundColor White
    Write-Host "3. Mostrar información de integración" -ForegroundColor White
    Write-Host "4. Iniciar sistema de trading" -ForegroundColor White
    Write-Host "5. Gestionar bots" -ForegroundColor White
    Write-Host "6. Salir" -ForegroundColor White
    Write-Host "`nSeleccione una opción (1-6): " -NoNewline

    $choice = Read-Host

    switch ($choice) {
        "1" { Get-SystemStatus }
        "2" { Test-Integration }
        "3" { Show-IntegrationInfo }
        "4" { Start-TradingSystem }
        "5" {
            if (Test-Path "qbtc-bot-manager.ps1") {
                & ".\qbtc-bot-manager.ps1"
            } else {
                Write-Host "Archivo qbtc-bot-manager.ps1 no encontrado" -ForegroundColor Red
            }
        }
        "6" { Write-Host "Saliendo..." -ForegroundColor Yellow; break }
        default { Write-Host "Opción inválida. Intente nuevamente." -ForegroundColor Red }
    }

    if ($choice -ne "6") {
        Read-Host "`nPresione Enter para continuar"
    }
} while ($choice -ne "6")

Write-Host "`n=== INTEGRACIÓN FINALIZADA ===" -ForegroundColor Green

# Sistema de Gestión de Bots QBTC
# Script principal para gestionar la red de bots con IPs fijas

Write-Host "=== SISTEMA DE GESTIÓN QBTC BOT NETWORK ===" -ForegroundColor Green
Write-Host "Red: 192.168.100.0/24" -ForegroundColor Cyan
Write-Host "Gateway: 192.168.100.1" -ForegroundColor Cyan
Write-Host "IPs disponibles: 192.168.100.10 - 192.168.100.254" -ForegroundColor Cyan

# Función para mostrar menú
function Show-Menu {
    Write-Host "`n=== MENÚ DE GESTIÓN ===" -ForegroundColor Yellow
    Write-Host "1. Ver estado de todos los bots" -ForegroundColor White
    Write-Host "2. Verificar conectividad de bots" -ForegroundColor White
    Write-Host "3. Reiniciar todos los bots" -ForegroundColor White
    Write-Host "4. Parar todos los bots" -ForegroundColor White
    Write-Host "5. Iniciar todos los bots" -ForegroundColor White
    Write-Host "6. Ver logs de un bot específico" -ForegroundColor White
    Write-Host "7. Limpiar sistema (borrar contenedores e imágenes)" -ForegroundColor White
    Write-Host "8. Recrear red de bots desde cero" -ForegroundColor White
    Write-Host "9. Salir" -ForegroundColor White
    Write-Host "`nSeleccione una opción (1-9): " -NoNewline
}

# Función para verificar estado
function Get-BotStatus {
    Write-Host "`n=== ESTADO DE BOTS ===" -ForegroundColor Green
    docker ps --filter network=bot-network --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Función para verificar conectividad
function Test-BotConnectivity {
    Write-Host "`n=== VERIFICACIÓN DE CONECTIVIDAD ===" -ForegroundColor Green

    $bots = @(
        @{Name="bot-01"; Url="http://localhost:3001"; IP="192.168.100.10"},
        @{Name="bot-02"; Url="http://localhost:3002"; IP="192.168.100.11"},
        @{Name="bot-03"; Url="http://localhost:3003"; IP="192.168.100.12"},
        @{Name="bot-04"; Url="http://localhost:3004"; IP="192.168.100.13"},
        @{Name="bot-05"; Url="http://localhost:3005"; IP="192.168.100.14"}
    )

    foreach ($bot in $bots) {
        try {
            $response = Invoke-RestMethod -Uri $bot.Url -TimeoutSec 5
            Write-Host "✓ $($bot.Name): $($response.bot) - IP: $($response.ip) - Status: $($response.status)" -ForegroundColor Green
        } catch {
            Write-Host "✗ $($bot.Name): Error de conexión" -ForegroundColor Red
        }
    }
}

# Función para reiniciar bots
function Restart-Bots {
    Write-Host "`n=== REINICIANDO BOTS ===" -ForegroundColor Yellow
    docker restart bot-01 bot-02 bot-03 bot-04 bot-05
    Write-Host "Bots reiniciados correctamente" -ForegroundColor Green
}

# Función para parar bots
function Stop-Bots {
    Write-Host "`n=== PARANDO BOTS ===" -ForegroundColor Yellow
    docker stop bot-01 bot-02 bot-03 bot-04 bot-05
    Write-Host "Bots detenidos correctamente" -ForegroundColor Green
}

# Función para iniciar bots
function Start-Bots {
    Write-Host "`n=== INICIANDO BOTS ===" -ForegroundColor Yellow
    docker start bot-01 bot-02 bot-03 bot-04 bot-05
    Write-Host "Bots iniciados correctamente" -ForegroundColor Green
}

# Función para ver logs
function Show-BotLogs {
    $botName = Read-Host "Ingrese el nombre del bot (bot-01, bot-02, etc.)"
    Write-Host "`n=== LOGS DE $botName ===" -ForegroundColor Green
    docker logs $botName
}

# Función para limpiar sistema
function Clear-System {
    Write-Host "`n=== LIMPIANDO SISTEMA ===" -ForegroundColor Red
    $confirm = Read-Host "¿Está seguro de que desea borrar todos los contenedores e imágenes? (s/n)"
    if ($confirm -eq "s" -or $confirm -eq "S") {
        docker stop bot-01 bot-02 bot-03 bot-04 bot-05 2>$null
        docker rm bot-01 bot-02 bot-03 bot-04 bot-05 2>$null
        docker rmi qbtc-bot-bot-01 qbtc-bot-bot-02 qbtc-bot-bot-03 qbtc-bot-bot-04 qbtc-bot-bot-05 2>$null
        docker network rm bot-network 2>$null
        Write-Host "Sistema limpiado correctamente" -ForegroundColor Green
    } else {
        Write-Host "Operación cancelada" -ForegroundColor Yellow
    }
}

# Función para recrear red
function Recreate-Network {
    Write-Host "`n=== RECREANDO RED DE BOTS ===" -ForegroundColor Yellow
    $confirm = Read-Host "¿Está seguro de que desea recrear la red completa? (s/n)"
    if ($confirm -eq "s" -or $confirm -eq "S") {
        # Limpiar primero
        docker stop bot-01 bot-02 bot-03 bot-04 bot-05 2>$null
        docker rm bot-01 bot-02 bot-03 bot-04 bot-05 2>$null
        docker network rm bot-network 2>$null

        # Ejecutar script de configuración
        Write-Host "Ejecutando configuración..." -ForegroundColor Cyan
        & ".\setup-bot-network-fixed.ps1"
    } else {
        Write-Host "Operación cancelada" -ForegroundColor Yellow
    }
}

# Bucle principal del menú
do {
    Show-Menu
    $choice = Read-Host

    switch ($choice) {
        "1" { Get-BotStatus }
        "2" { Test-BotConnectivity }
        "3" { Restart-Bots }
        "4" { Stop-Bots }
        "5" { Start-Bots }
        "6" { Show-BotLogs }
        "7" { Clear-System }
        "8" { Recreate-Network }
        "9" { Write-Host "Saliendo..." -ForegroundColor Yellow; break }
        default { Write-Host "Opción inválida. Intente nuevamente." -ForegroundColor Red }
    }

    if ($choice -ne "9") {
        Read-Host "`nPresione Enter para continuar"
    }
} while ($choice -ne "9")

Write-Host "`n=== SESIÓN FINALIZADA ===" -ForegroundColor Green

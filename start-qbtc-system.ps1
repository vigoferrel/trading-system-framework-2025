# Inicio Rápido - Sistema QBTC Bot Network
# Script para iniciar todo el sistema de una vez

Write-Host "=== INICIO RÁPIDO - SISTEMA QBTC ===" -ForegroundColor Green
Write-Host "Iniciando red de bots con IPs fijas..." -ForegroundColor Cyan

# Verificar Docker
Write-Host "`n1. Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker no encontrado. Instale Docker Desktop primero." -ForegroundColor Red
    exit 1
}

# Verificar si la red ya existe
Write-Host "`n2. Verificando red existente..." -ForegroundColor Yellow
try {
    $networkExists = docker network inspect bot-network 2>$null
    if ($networkExists) {
        Write-Host "✓ Red bot-network ya existe" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Red bot-network no encontrada, se creará" -ForegroundColor Yellow
}

# Limpiar contenedores existentes si es necesario
Write-Host "`n3. Preparando contenedores..." -ForegroundColor Yellow
docker stop bot-01 bot-02 bot-03 bot-04 bot-05 2>$null | Out-Null
docker rm bot-01 bot-02 bot-03 bot-04 bot-05 2>$null | Out-Null
Write-Host "✓ Contenedores limpiados" -ForegroundColor Green

# Configurar red de bots
Write-Host "`n4. Configurando red de bots..." -ForegroundColor Yellow
try {
    if (Test-Path "setup-bot-network-fixed.ps1") {
        & ".\setup-bot-network-fixed.ps1"
        Write-Host "✓ Red de bots configurada correctamente" -ForegroundColor Green
    } else {
        Write-Host "✗ Archivo setup-bot-network-fixed.ps1 no encontrado" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Error al configurar red de bots: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Verificar que los bots estén corriendo
Write-Host "`n5. Verificando bots..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

$botsRunning = 0
$botConfigs = @(
    @{Name="bot-01"; Url="http://localhost:3001"},
    @{Name="bot-02"; Url="http://localhost:3002"},
    @{Name="bot-03"; Url="http://localhost:3003"},
    @{Name="bot-04"; Url="http://localhost:3004"},
    @{Name="bot-05"; Url="http://localhost:3005"}
)

foreach ($bot in $botConfigs) {
    try {
        $response = Invoke-RestMethod -Uri $bot.Url -TimeoutSec 5
        Write-Host "✓ $($bot.Name): $($response.status)" -ForegroundColor Green
        $botsRunning++
    } catch {
        Write-Host "✗ $($bot.Name): Error de conexión" -ForegroundColor Red
    }
}

Write-Host "`n=== RESULTADO ===" -ForegroundColor Green
if ($botsRunning -eq 5) {
    Write-Host "✅ SISTEMA COMPLETO OPERATIVO" -ForegroundColor Green
    Write-Host "Todos los bots están funcionando correctamente" -ForegroundColor Green
} else {
    Write-Host "⚠️ SISTEMA PARCIALMENTE OPERATIVO" -ForegroundColor Yellow
    Write-Host "Bots funcionando: $botsRunning/5" -ForegroundColor Yellow
}

Write-Host "`n=== ACCESO AL SISTEMA ===" -ForegroundColor Cyan
Write-Host "Menú de gestión completo: .\qbtc-bot-manager.ps1" -ForegroundColor White
Write-Host "Sistema de integración: .\qbtc-integration-system.ps1" -ForegroundColor White
Write-Host "Documentación: README-QBTC-BOT-NETWORK.md" -ForegroundColor White

Write-Host "`n=== BOTS DISPONIBLES ===" -ForegroundColor Cyan
Write-Host "bot-01: http://localhost:3001 (IP: 192.168.100.10)" -ForegroundColor White
Write-Host "bot-02: http://localhost:3002 (IP: 192.168.100.11)" -ForegroundColor White
Write-Host "bot-03: http://localhost:3003 (IP: 192.168.100.12)" -ForegroundColor White
Write-Host "bot-04: http://localhost:3004 (IP: 192.168.100.13)" -ForegroundColor White
Write-Host "bot-05: http://localhost:3005 (IP: 192.168.100.14)" -ForegroundColor White

Write-Host "`n=== PRÓXIMOS PASOS ===" -ForegroundColor Yellow
Write-Host "1. Configurar VPN para whitelisting en Binance" -ForegroundColor White
Write-Host "2. Ejecutar: node qbtc-vpn-solution.js" -ForegroundColor White
Write-Host "3. Iniciar trading: node qbtc-quantum-ip-integration.js" -ForegroundColor White
Write-Host "4. Monitorear bots con: .\qbtc-bot-manager.ps1" -ForegroundColor White

Write-Host "`n=== SISTEMA LISTO ===" -ForegroundColor Green
Write-Host "Presione Enter para abrir el menú de gestión..." -ForegroundColor Cyan
Read-Host

# Abrir menú de gestión
if (Test-Path "qbtc-bot-manager.ps1") {
    & ".\qbtc-bot-manager.ps1"
} else {
    Write-Host "Archivo qbtc-bot-manager.ps1 no encontrado" -ForegroundColor Red
}

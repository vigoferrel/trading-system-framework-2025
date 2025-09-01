# Script de verificación de bots
# Ejecutar para verificar el estado de todos los bots

Write-Host "Verificando estado de la red de bots..." -ForegroundColor Green

# Función para verificar un bot
function Test-Bot {
    param([string]$BotName, [string]$Url, [string]$ExpectedIP)

    try {
        $response = Invoke-RestMethod -Uri $Url -TimeoutSec 5
        if ($response.bot -eq $BotName -and $response.ip -eq $ExpectedIP -and $response.status -eq "running") {
            Write-Host "✓ $BotName - OK (IP: $($response.ip))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ $BotName - Datos incorrectos" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "✗ $BotName - Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Verificar todos los bots
$bots = @(
    @{Name="bot-01"; Url="http://localhost:3001"; IP="192.168.100.10"},
    @{Name="bot-02"; Url="http://localhost:3002"; IP="192.168.100.11"},
    @{Name="bot-03"; Url="http://localhost:3003"; IP="192.168.100.12"},
    @{Name="bot-04"; Url="http://localhost:3004"; IP="192.168.100.13"},
    @{Name="bot-05"; Url="http://localhost:3005"; IP="192.168.100.14"}
)

$healthyBots = 0
foreach ($bot in $bots) {
    if (Test-Bot -BotName $bot.Name -Url $bot.Url -ExpectedIP $bot.IP) {
        $healthyBots++
    }
}

Write-Host "`nEstado de la red:" -ForegroundColor Cyan
Write-Host "Bots saludables: $healthyBots/5" -ForegroundColor $(if ($healthyBots -eq 5) { "Green" } else { "Yellow" })

# Verificar red Docker
Write-Host "`nVerificando red Docker..." -ForegroundColor Cyan
try {
    $networkInfo = docker network inspect bot-network | ConvertFrom-Json
    Write-Host "✓ Red bot-network: $($networkInfo[0].IPAM.Config[0].Subnet)" -ForegroundColor Green
} catch {
    Write-Host "✗ Error al verificar red Docker" -ForegroundColor Red
}

# Mostrar comandos útiles
Write-Host "`nComandos de gestión:" -ForegroundColor Yellow
Write-Host "Ver logs de bot-01: docker logs bot-01" -ForegroundColor Cyan
Write-Host "Reiniciar todos: docker restart bot-01 bot-02 bot-03 bot-04 bot-05" -ForegroundColor Cyan
Write-Host "Parar todos: docker stop bot-01 bot-02 bot-03 bot-04 bot-05" -ForegroundColor Cyan
Write-Host "Limpiar todo: docker system prune -a" -ForegroundColor Cyan

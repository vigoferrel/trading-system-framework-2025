# Script de verificación de bots
# Ejecutar para verificar el estado de todos los bots

Write-Host "Verificando estado de la red de bots..." -ForegroundColor Green

# Verificar todos los bots manualmente
$bots = @(
    @{Name="bot-01"; Url="http://localhost:3001"; IP="192.168.100.10"},
    @{Name="bot-02"; Url="http://localhost:3002"; IP="192.168.100.11"},
    @{Name="bot-03"; Url="http://localhost:3003"; IP="192.168.100.12"},
    @{Name="bot-04"; Url="http://localhost:3004"; IP="192.168.100.13"},
    @{Name="bot-05"; Url="http://localhost:3005"; IP="192.168.100.14"}
)

$healthyBots = 0
foreach ($bot in $bots) {
    try {
        $response = Invoke-RestMethod -Uri $bot.Url -TimeoutSec 5
        if ($response.bot -eq $bot.Name -and $response.ip -eq $bot.IP -and $response.status -eq "running") {
            Write-Host "✓ $($bot.Name) - OK (IP: $($response.ip))" -ForegroundColor Green
            $healthyBots++
        } else {
            Write-Host "✗ $($bot.Name) - Datos incorrectos" -ForegroundColor Red
        }
    } catch {
        Write-Host "✗ $($bot.Name) - Error de conexión: $($_.Exception.Message)" -ForegroundColor Red
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

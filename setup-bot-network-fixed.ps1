# Script corregido para configurar red de bots con IPs fijas
# Ejecutar como administrador

Write-Host "Configurando red de bots con IPs fijas..." -ForegroundColor Green

# Crear red Docker personalizada con rango IP fijo
docker network create --driver bridge --subnet=192.168.100.0/24 --gateway=192.168.100.1 bot-network

# Función para crear contenedor bot con IP fija
function New-BotContainer {
    param(
        [string]$BotName,
        [string]$IPAddress,
        [string]$Port = "3000"
    )

    Write-Host "Creando bot: $BotName con IP: $IPAddress" -ForegroundColor Yellow

    # Crear un Dockerfile temporal para el bot
    $dockerfile = @"
FROM node:18-alpine
WORKDIR /app
RUN npm init -y && npm install express
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]
"@

    $serverJs = @"
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({
        bot: '$BotName',
        ip: '$IPAddress',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Bot $BotName running on $IPAddress:3000');
});
"@

    # Crear directorio temporal
    $tempDir = "$env:TEMP\qbtc-bot-$BotName"
    New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

    # Escribir archivos
    $dockerfile | Out-File -FilePath "$tempDir\Dockerfile" -Encoding UTF8
    $serverJs | Out-File -FilePath "$tempDir\server.js" -Encoding UTF8

    # Construir imagen
    docker build -t "qbtc-bot-$BotName" $tempDir

    # Ejecutar contenedor
    docker run -d `
        --name $BotName `
        --network bot-network `
        --ip $IPAddress `
        -p "${Port}:3000" `
        --restart unless-stopped `
        "qbtc-bot-$BotName"

    # Limpiar
    Remove-Item -Recurse -Force $tempDir
}

# Crear varios bots con IPs fijas
$botConfigs = @(
    @{Name="bot-01"; IP="192.168.100.10"; Port="3001"},
    @{Name="bot-02"; IP="192.168.100.11"; Port="3002"},
    @{Name="bot-03"; IP="192.168.100.12"; Port="3003"},
    @{Name="bot-04"; IP="192.168.100.13"; Port="3004"},
    @{Name="bot-05"; IP="192.168.100.14"; Port="3005"}
)

foreach ($config in $botConfigs) {
    New-BotContainer -BotName $config.Name -IPAddress $config.IP -Port $config.Port
}

Write-Host "`nRed de bots configurada:" -ForegroundColor Green
Write-Host "Red: 192.168.100.0/24" -ForegroundColor Cyan
Write-Host "Gateway: 192.168.100.1" -ForegroundColor Cyan
Write-Host "Rango disponible: 192.168.100.10-192.168.100.254" -ForegroundColor Cyan

Write-Host "`nBots creados:" -ForegroundColor Green
foreach ($config in $botConfigs) {
    Write-Host "- $($config.Name): http://localhost:$($config.Port) (IP interna: $($config.IP))" -ForegroundColor Yellow
}

Write-Host "`nComandos útiles:" -ForegroundColor Green
Write-Host "Ver bots: docker ps" -ForegroundColor Cyan
Write-Host "Ver red: docker network inspect bot-network" -ForegroundColor Cyan
Write-Host "Parar todos: docker stop `$(docker ps -aq)" -ForegroundColor Cyan
Write-Host "Limpiar todo: docker system prune -a" -ForegroundColor Cyan

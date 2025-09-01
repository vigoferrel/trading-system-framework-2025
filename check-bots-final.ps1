# Verificación simple de bots
Write-Host "Verificando bots..." -ForegroundColor Green

# Verificar bot-01
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001" -TimeoutSec 5
    Write-Host "✓ bot-01: $($response.bot) - IP: $($response.ip)" -ForegroundColor Green
} catch {
    Write-Host "✗ bot-01: Error" -ForegroundColor Red
}

# Verificar bot-02
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002" -TimeoutSec 5
    Write-Host "✓ bot-02: $($response.bot) - IP: $($response.ip)" -ForegroundColor Green
} catch {
    Write-Host "✗ bot-02: Error" -ForegroundColor Red
}

# Verificar bot-03
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003" -TimeoutSec 5
    Write-Host "✓ bot-03: $($response.bot) - IP: $($response.ip)" -ForegroundColor Green
} catch {
    Write-Host "✗ bot-03: Error" -ForegroundColor Red
}

# Verificar bot-04
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3004" -TimeoutSec 5
    Write-Host "✓ bot-04: $($response.bot) - IP: $($response.ip)" -ForegroundColor Green
} catch {
    Write-Host "✗ bot-04: Error" -ForegroundColor Red
}

# Verificar bot-05
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3005" -TimeoutSec 5
    Write-Host "✓ bot-05: $($response.bot) - IP: $($response.ip)" -ForegroundColor Green
} catch {
    Write-Host "✗ bot-05: Error" -ForegroundColor Red
}

Write-Host "`nEstado de contenedores:" -ForegroundColor Cyan
docker ps --filter "network=bot-network"

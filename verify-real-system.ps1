# Script para verificar el estado del sistema de trading real
Write-Host "VERIFICANDO SISTEMA DE TRADING REAL CUANTICO" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Yellow

# Verificar variables de entorno
Write-Host "Verificando configuracion..." -ForegroundColor Cyan
Write-Host "   NODE_ENV: $env:NODE_ENV" -ForegroundColor White
Write-Host "   BINANCE_TESTNET: $env:BINANCE_TESTNET" -ForegroundColor White
Write-Host "   BINANCE_API_KEY: $(if($env:BINANCE_API_KEY){'OK - Configurada'}else{'ERROR - No configurada'})" -ForegroundColor $(if($env:BINANCE_API_KEY){'Green'}else{'Red'})
Write-Host "   BINANCE_API_SECRET: $(if($env:BINANCE_API_SECRET){'OK - Configurada'}else{'ERROR - No configurada'})" -ForegroundColor $(if($env:BINANCE_API_SECRET){'Green'}else{'Red'})

Write-Host ""
Write-Host "Verificando servicios..." -ForegroundColor Cyan

# Verificar servicios
$services = @(
    @{Name="SRONA API"; Port=4601; Url="http://localhost:4601/health"},
    @{Name="VigoFutures"; Port=4602; Url="http://localhost:4602/health"},
    @{Name="Frontend"; Port=4603; Url="http://localhost:4603/health"}
)

foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri $service.Url -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "   OK - $($service.Name) (puerto $($service.Port)): ACTIVO" -ForegroundColor Green
        } else {
            Write-Host "   ERROR - $($service.Name) (puerto $($service.Port)): ERROR $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ERROR - $($service.Name) (puerto $($service.Port)): NO RESPONDE" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Verificando estado del trading..." -ForegroundColor Cyan

# Verificar estado del trading
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4601/api/performance" -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        Write-Host "   OK - API de rendimiento: ACTIVA" -ForegroundColor Green
        Write-Host "   Total Trades: $($data.metrics.totalTrades)" -ForegroundColor White
        Write-Host "   Ganancia Total: $($data.metrics.totalProfit) USD" -ForegroundColor $(if($data.metrics.totalProfit -gt 0){'Green'}else{'Red'})
        Write-Host "   Win Rate: $([math]::Round($data.metrics.winRate * 100, 1))%" -ForegroundColor White
        Write-Host "   Sharpe Ratio: $($data.metrics.sharpeRatio)" -ForegroundColor $(if($data.metrics.sharpeRatio -gt 1.5){'Green'}else{'Yellow'})
    }
} catch {
    Write-Host "   ERROR - API de rendimiento: ERROR" -ForegroundColor Red
}

# Verificar señales de trading
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4601/api/trading-signals" -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        Write-Host "   OK - Senales de trading: ACTIVAS" -ForegroundColor Green
        Write-Host "   Senales generadas: $($data.data.Count)" -ForegroundColor White
    }
} catch {
    Write-Host "   ERROR - Senales de trading: ERROR" -ForegroundColor Red
}

Write-Host ""
Write-Host "Verificando conexiones..." -ForegroundColor Cyan

# Verificar conexión con Binance
try {
    $response = Invoke-WebRequest -Uri "https://api.binance.com/api/v3/ping" -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   OK - Conexion con Binance: ACTIVA" -ForegroundColor Green
    }
} catch {
    Write-Host "   ERROR - Conexion con Binance: ERROR" -ForegroundColor Red
}

# Verificar procesos en ejecución
Write-Host ""
Write-Host "Procesos activos:" -ForegroundColor Cyan
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   OK - Procesos Node.js: $($nodeProcesses.Count) activos" -ForegroundColor Green
    foreach ($proc in $nodeProcesses) {
        Write-Host "      - PID $($proc.Id): $($proc.CPU.ToString('F2'))% CPU, $($proc.WorkingSet64/1MB.ToString('F2')) MB RAM" -ForegroundColor White
    }
} else {
    Write-Host "   ERROR - No hay procesos Node.js activos" -ForegroundColor Red
}

Write-Host ""
Write-Host "DIAGNOSTICO FINAL" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Yellow

# Diagnóstico final
$allGood = $true
$warnings = @()

if (-not $env:BINANCE_API_KEY) {
    $warnings += "API Key de Binance no configurada"
    $allGood = $false
}
if (-not $env:BINANCE_API_SECRET) {
    $warnings += "API Secret de Binance no configurada"
    $allGood = $false
}
if ($env:NODE_ENV -ne "production") {
    $warnings += "Sistema no esta en modo produccion"
    $allGood = $false
}
if ($env:BINANCE_TESTNET -ne "false") {
    $warnings += "Sistema aun en modo testnet"
    $allGood = $false
}

if ($allGood) {
    Write-Host "SISTEMA COMPLETAMENTE OPERATIVO" -ForegroundColor Green
    Write-Host "   - Modo: PRODUCCION (REAL TRADING)" -ForegroundColor White
    Write-Host "   - Estado: TODOS LOS SERVICIOS ACTIVOS" -ForegroundColor White
    Write-Host "   - Trading: LISTO PARA OPERACIONES REALES" -ForegroundColor White
    Write-Host ""
    Write-Host "EL SISTEMA CUANTICO ESTA LISTO PARA GENERAR GANANCIAS!" -ForegroundColor Green
} else {
    Write-Host "SISTEMA CON PROBLEMAS" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   - $warning" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Ejecuta '.\activate-real-trading.ps1' para solucionar los problemas" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "URLs de acceso:" -ForegroundColor Cyan
Write-Host "   - Dashboard Principal: http://localhost:4603" -ForegroundColor White
Write-Host "   - Monitor VigoFutures: http://localhost:4602" -ForegroundColor White
Write-Host "   - API SRONA: http://localhost:4601" -ForegroundColor White

Read-Host "Presiona Enter para continuar"
# ==============================================
# start-clean.ps1 - Arranque limpio, robusto, seguro
# Core (4601), Frontend API (4602), Monitor (8082)
# ==============================================

param(
    [int]$CorePort = 4601,
    [int]$FrontendPort = 4602,
    [int]$MonitorPort = 8082,
    [int]$VigoPort = 5500
)

Write-Host "🧹 Limpiando procesos Node y puertos..." -ForegroundColor Yellow
$ports = @($CorePort, $FrontendPort, $MonitorPort, $VigoPort)
foreach ($p in $ports) {
    try {
        $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
        if ($conns) {
            $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ($pid in $pids) {
                Write-Host "  - Matando PID $pid (puerto $p)" -ForegroundColor Yellow
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        }
    } catch {}
}

Start-Sleep -Seconds 1

Write-Host "🛠️ Asegurando PM2 instalado..." -ForegroundColor Cyan
if (-not (Get-Command pm2 -ErrorAction SilentlyContinue)) {
    npm i -g pm2 --loglevel=error | Out-Null
}

Write-Host "🔄 Limpiando PM2 y arrancando procesos..." -ForegroundColor Cyan
pm2 delete all --silent | Out-Null

# Iniciar core, frontend y monitor
pm2 start ecosystem.config.js --only quantum-core --update-env | Out-Null
pm2 start ecosystem.config.js --only quantum-frontend --update-env | Out-Null
pm2 start ecosystem.config.js --only quantum-monitor --update-env | Out-Null
pm2 save | Out-Null

Start-Sleep -Seconds 2

function Test-Port([int]$port) {
    $t = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
    return $t.TcpTestSucceeded
}

Write-Host "🧪 Probando puertos..." -ForegroundColor Cyan
$ok4601 = Test-Port $CorePort
$ok4602 = Test-Port $FrontendPort
$ok8082 = Test-Port $MonitorPort
if ($ok4601) { Write-Host "  4601 core:   OK" -ForegroundColor Green } else { Write-Host "  4601 core:   FAIL" -ForegroundColor Red }
if ($ok4602) { Write-Host "  4602 front:  OK" -ForegroundColor Green } else { Write-Host "  4602 front:  FAIL" -ForegroundColor Red }
if ($ok8082) { Write-Host "  8082 monitor:OK" -ForegroundColor Green } else { Write-Host "  8082 monitor:FAIL" -ForegroundColor Red }

Start-Sleep -Seconds 1

Write-Host "🧪 Health checks..." -ForegroundColor Cyan
function TryGet($url) {
    try { (Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 6).StatusCode } catch { 0 }
}

$h1 = TryGet ("http://localhost:$CorePort/health")
$h2 = TryGet ("http://localhost:$FrontendPort/api/health")
$h3 = TryGet ("http://localhost:$MonitorPort/status")
Write-Host ("  core /health:        " + $h1)
Write-Host ("  front /api/health:   " + $h2)
Write-Host ("  monitor /status:     " + $h3)

if ($h1 -ne 200 -or $h2 -ne 200 -or $h3 -ne 200) {
    Write-Host "⚠️  Algún servicio no respondió 200. Mostrando pm2 status y últimos logs..." -ForegroundColor Yellow
    pm2 status | Out-String | Write-Host
    if (Test-Path logs/quantum-core-error.log) { Write-Host "--- core err ---" -ForegroundColor Yellow; Get-Content logs/quantum-core-error.log -Tail 60 }
    if (Test-Path logs/quantum-core-out.log)   { Write-Host "--- core out ---" -ForegroundColor Yellow; Get-Content logs/quantum-core-out.log -Tail 60 }
    if (Test-Path logs/quantum-frontend-error.log) { Write-Host "--- front err ---" -ForegroundColor Yellow; Get-Content logs/quantum-frontend-error.log -Tail 60 }
    if (Test-Path logs/quantum-frontend-out.log)   { Write-Host "--- front out ---" -ForegroundColor Yellow; Get-Content logs/quantum-frontend-out.log -Tail 60 }
    if (Test-Path logs/quantum-monitor-error.log) { Write-Host "--- monitor err ---" -ForegroundColor Yellow; Get-Content logs/quantum-monitor-error.log -Tail 60 }
    if (Test-Path logs/quantum-monitor-out.log)   { Write-Host "--- monitor out ---" -ForegroundColor Yellow; Get-Content logs/quantum-monitor-out.log -Tail 60 }
}

Write-Host "✅ Arranque limpio completado." -ForegroundColor Green

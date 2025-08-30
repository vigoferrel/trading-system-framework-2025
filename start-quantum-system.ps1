Param(
  [switch]$Fast,
  [int]$CorePort = 4601,
  [int]$ApiPort = 4602,
  [int]$MonitorPort = 8082,
  [int]$VigoPort = 5500,
  [int]$MaxWaitSec = 25,
  [int]$Retries = 2
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'SilentlyContinue'

function Write-Step($msg){ Write-Host ("[STEP] " + $msg) -ForegroundColor Cyan }
function Write-Ok($msg){ Write-Host ("[OK]   " + $msg) -ForegroundColor Green }
function Write-Warn($msg){ Write-Host ("[WARN] " + $msg) -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host ("[ERR]  " + $msg) -ForegroundColor Red }

function Stop-ByPort([int]$Port){
  try {
    if (Get-Command Get-NetTCPConnection -ErrorAction SilentlyContinue) {
      $conns = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
      if ($conns){ foreach($c in $conns){ try { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue } catch{} } }
    }
  } catch {}
  try {
    $lines = netstat -ano | Select-String (":" + $Port + " ")
    foreach($l in $lines){ $parts = ($l.ToString().Trim() -split '\s+'); if ($parts.Length -gt 0){ $pid = $parts[-1]; if ($pid -match '^[0-9]+$'){ try { Stop-Process -Id ([int]$pid) -Force -ErrorAction SilentlyContinue } catch{} } } }
  } catch {}
}

function Stop-NodeScripts(){
  try {
    Get-CimInstance Win32_Process |
      Where-Object { $_.Name -like 'node.exe' -and (
        $_.CommandLine -match 'index\.js' -or
        $_.CommandLine -match 'frontend-api\.js' -or
        $_.CommandLine -match 'quantum-real-time-monitor\.js' -or
        $_.CommandLine -match 'VigoFutures'
      ) } |
      ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } catch{} }
  } catch {}
}

function Ensure-Logs(){ if (!(Test-Path .\logs)) { New-Item -ItemType Directory -Path .\logs | Out-Null } }

function Wait-Endpoint([string]$Url, [int]$TimeoutSec){
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  while($sw.Elapsed.TotalSeconds -lt $TimeoutSec){
    try { $resp = Invoke-RestMethod $Url -TimeoutSec 5 -ErrorAction Stop; return @{ ok = $true; url = $Url; data = $resp } } catch {}
    Start-Sleep -Milliseconds 500
  }
  return @{ ok = $false; url = $Url }
}

Write-Step "Limpiando procesos Node conocidos"
Stop-NodeScripts

Write-Step "Liberando puertos ocupados ($CorePort core, $ApiPort api, $MonitorPort monitor, $VigoPort vigo)"
foreach($p in @($CorePort, $ApiPort, $MonitorPort, $VigoPort)){ Stop-ByPort -Port $p }
Start-Sleep -Milliseconds 300

Write-Step "Configurando variables de entorno"
$env:VIGO_FUTURES_ENABLED = 'false'
$env:BOT_OPCIONES_PORT = "$CorePort"
$env:FRONTEND_API_PORT = "$ApiPort"
$env:FRONTEND_PORT = "$ApiPort"
$env:PORT = "$ApiPort"
if ($Fast) { $env:FAST_PERFORMANCE = 'true' } else { Remove-Item Env:FAST_PERFORMANCE -ErrorAction SilentlyContinue }

Ensure-Logs

Write-Step "Lanzando Core (index.js)"
try { Start-Process -FilePath node -ArgumentList 'index.js' -WindowStyle Hidden -RedirectStandardOutput .\logs\core.out.log -RedirectStandardError .\logs\core.err.log } catch { Write-Warn "No se pudo iniciar core: $($_.Exception.Message)" }

Write-Step "Lanzando Frontend-API (frontend-api.js)"
try { Start-Process -FilePath node -ArgumentList 'frontend-api.js' -WindowStyle Hidden -RedirectStandardOutput .\logs\frontend.out.log -RedirectStandardError .\logs\frontend.err.log } catch { Write-Warn "No se pudo iniciar API: $($_.Exception.Message)" }

Write-Step "Esperando disponibilidad de endpoints"
$health = Wait-Endpoint "http://localhost:$CorePort/health" $MaxWaitSec
$sent   = Wait-Endpoint "http://localhost:$ApiPort/sentiment/score" $MaxWaitSec
$pred   = Wait-Endpoint "http://localhost:$ApiPort/predictions" $MaxWaitSec
$perf   = Wait-Endpoint "http://localhost:$CorePort/performance" $MaxWaitSec

if (-not $perf.ok -and -not $Fast) {
  Write-Warn "core /performance no respondió. Reintentando con FAST_PERFORMANCE=TRUE"
  try { Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*node*index.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force } } catch {}
  $env:FAST_PERFORMANCE = 'true'
  Start-Process -FilePath node -ArgumentList 'index.js' -WindowStyle Hidden -RedirectStandardOutput .\logs\core.out.log -RedirectStandardError .\logs\core.err.log
  Start-Sleep -Seconds 4
  $perf = Wait-Endpoint "http://localhost:$CorePort/performance" ([Math]::Max(6, [int]($MaxWaitSec/2)))
}

Write-Step "Resumen de verificación"
$summary = [PSCustomObject]@{
  coreHealthOk     = $health.ok
  corePerfOk       = $perf.ok
  apiSentimentOk   = $sent.ok
  apiPredictionsOk = $pred.ok
  ports            = @{ core = $CorePort; api = $ApiPort; monitor = $MonitorPort; vigo = $VigoPort }
  fastMode         = [bool]($env:FAST_PERFORMANCE -eq 'true')
  timestamps       = @{ started = (Get-Date).ToString('s') }
}
$summary | ConvertTo-Json -Depth 6 | Write-Output

if (-not $health.ok) { Write-Err  "core /health no disponible" }
if (-not $perf.ok)   {
  Write-Warn "core /performance no disponible todavía"
  Write-Warn "Revisa: logs/core.err.log (tail)"
  try { Get-Content .\logs\core.err.log -Tail 30 | Write-Output } catch {}
}
if (-not $sent.ok)   { Write-Err  "api /sentiment/score no disponible"; try { Get-Content .\logs\frontend.err.log -Tail 20 | Write-Output } catch {} }
if (-not $pred.ok)   { Write-Err  "api /predictions no disponible"; try { Get-Content .\logs\frontend.err.log -Tail 20 | Write-Output } catch {} }

Write-Step "Fin"


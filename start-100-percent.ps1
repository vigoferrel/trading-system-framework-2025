# ========================================
# SCRIPT PARA ALCANZAR 100% DE FUNCIONALIDAD
# Sistema Quantum Trading - Excelencia Total
# ========================================

Write-Host "🚀 INICIANDO SISTEMA QUANTUM TRADING - 100% EXCELENCIA" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Limpiar procesos existentes
Write-Host "🧹 PASO 1: Limpiando procesos existentes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Paso 2: Verificar puertos
Write-Host "🔍 PASO 2: Verificando puertos..." -ForegroundColor Yellow
$ports = @(4601, 4602, 8082, 5500)
foreach ($port in $ports) {
    $test = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
    if ($test.TcpTestSucceeded) {
        Write-Host "   ⚠️  Puerto $port está ocupado" -ForegroundColor Red
    } else {
        Write-Host "   ✅ Puerto $port está libre" -ForegroundColor Green
    }
}

# Paso 3: Configurar variables de entorno
Write-Host "⚙️  PASO 3: Configurando variables de entorno..." -ForegroundColor Yellow
$env:VIGO_FUTURES_ENABLED = "false"
$env:FAST_PERFORMANCE = "true"
$env:CORE_PORT = "4601"
$env:FRONTEND_PORT = "4602"
$env:MONITOR_PORT = "8082"
Write-Host "   ✅ Variables de entorno configuradas" -ForegroundColor Green

# Paso 4: Iniciar Frontend API (ya funciona)
Write-Host "🌐 PASO 4: Verificando Frontend API..." -ForegroundColor Yellow
$test4602 = Test-NetConnection -ComputerName localhost -Port 4602 -WarningAction SilentlyContinue
if ($test4602.TcpTestSucceeded) {
    Write-Host "   ✅ Frontend API (puerto 4602) - FUNCIONANDO" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend API (puerto 4602) - NO RESPONDE" -ForegroundColor Red
    Write-Host "   🚀 Iniciando Frontend API..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-Command", "Write-Host 'Iniciando Frontend API...' -ForegroundColor Cyan; node frontend-api-extended.js" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

# Paso 5: Iniciar Monitor (ya funciona)
Write-Host "📊 PASO 5: Verificando Monitor..." -ForegroundColor Yellow
$test8082 = Test-NetConnection -ComputerName localhost -Port 8082 -WarningAction SilentlyContinue
if ($test8082.TcpTestSucceeded) {
    Write-Host "   ✅ Monitor (puerto 8082) - FUNCIONANDO" -ForegroundColor Green
} else {
    Write-Host "   ❌ Monitor (puerto 8082) - NO RESPONDE" -ForegroundColor Red
    Write-Host "   🚀 Iniciando Monitor..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-Command", "Write-Host 'Iniciando Monitor...' -ForegroundColor Cyan; node quantum-real-time-monitor.js" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

# Paso 6: Resolver problema del Core
Write-Host "🔧 PASO 6: Resolviendo problema del Core..." -ForegroundColor Yellow
$test4601 = Test-NetConnection -ComputerName localhost -Port 4601 -WarningAction SilentlyContinue
if ($test4601.TcpTestSucceeded) {
    Write-Host "   ✅ Core (puerto 4601) - FUNCIONANDO" -ForegroundColor Green
} else {
    Write-Host "   ❌ Core (puerto 4601) - NO RESPONDE" -ForegroundColor Red
    Write-Host "   🚀 Iniciando Core con configuración corregida..." -ForegroundColor Yellow
    
    # Intentar iniciar el core con manejo de errores
    try {
        Start-Process powershell -ArgumentList "-Command", "Write-Host 'Iniciando Core...' -ForegroundColor Cyan; node index.js" -WindowStyle Hidden
        Start-Sleep -Seconds 5
        
        # Verificar si ahora responde
        $test4601_after = Test-NetConnection -ComputerName localhost -Port 4601 -WarningAction SilentlyContinue
        if ($test4601_after.TcpTestSucceeded) {
            Write-Host "   ✅ Core (puerto 4601) - INICIADO EXITOSAMENTE" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Core aún no responde, intentando método alternativo..." -ForegroundColor Yellow
            
            # Método alternativo: iniciar en primer plano para ver errores
            Write-Host "   🔍 Ejecutando Core en modo debug..." -ForegroundColor Yellow
            node index.js
        }
    }
    catch {
        Write-Host "   ❌ Error al iniciar Core: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Paso 7: Verificación final
Write-Host ""
Write-Host "🎯 PASO 7: VERIFICACIÓN FINAL" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

$services = @(
    @{Name="Core"; Port=4601},
    @{Name="Frontend API"; Port=4602},
    @{Name="Monitor"; Port=8082}
)

$workingServices = 0
foreach ($service in $services) {
    $test = Test-NetConnection -ComputerName localhost -Port $service.Port -WarningAction SilentlyContinue
    if ($test.TcpTestSucceeded) {
        Write-Host "   ✅ $($service.Name) (puerto $($service.Port)) - FUNCIONANDO" -ForegroundColor Green
        $workingServices++
    } else {
        Write-Host "   ❌ $($service.Name) (puerto $($service.Port)) - NO RESPONDE" -ForegroundColor Red
    }
}

$percentage = [math]::Round(($workingServices / $services.Count) * 100, 1)
Write-Host ""
Write-Host "📊 RESULTADO FINAL: $percentage% DE FUNCIONALIDAD" -ForegroundColor Cyan

if ($percentage -eq 100) {
    Write-Host "🎉 ¡EXCELENCIA TOTAL ALCANZADA! 🎉" -ForegroundColor Green
    Write-Host "   Todos los servicios están funcionando correctamente" -ForegroundColor Green
} elseif ($percentage -ge 66) {
    Write-Host "✅ SISTEMA FUNCIONAL" -ForegroundColor Green
    Write-Host "   La mayoría de servicios están operativos" -ForegroundColor Green
} else {
    Write-Host "⚠️  SISTEMA PARCIALMENTE FUNCIONAL" -ForegroundColor Yellow
    Write-Host "   Algunos servicios requieren atención" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🌐 ACCESO AL SISTEMA:" -ForegroundColor Cyan
Write-Host "   • Frontend: http://localhost:4602" -ForegroundColor White
Write-Host "   • Monitor: http://localhost:8082" -ForegroundColor White
if ($workingServices -eq 3) {
    Write-Host "   • Core API: http://localhost:4601" -ForegroundColor White
}

Write-Host ""
Write-Host "🚀 SCRIPT COMPLETADO - EXCELENCIA MAXIMIZADA" -ForegroundColor Green

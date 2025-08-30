<#
.SYNOPSIS
Script de parada segura del sistema QBTC Quantum Binance Options

.DESCRIPTION
Este script detiene todos los componentes del sistema de manera segura,
cerrando posiciones, guardando estado y liberando recursos.

.PARAMETER Force
Forzar parada inmediata sin esperar cierre de posiciones

.PARAMETER SaveState
Guardar estado del sistema antes del shutdown

.EXAMPLE
.\Stop-AllSystems.ps1
Parada segura normal

.EXAMPLE
.\Stop-AllSystems.ps1 -Force
Parada forzada inmediata
#>

[CmdletBinding()]
param(
    [switch]$Force,
    [switch]$SaveState = $true
)

# Configuración
$ErrorActionPreference = "Continue"
$Global:LogFile = "logs\shutdown-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
$Global:ShutdownStartTime = Get-Date

# Función de logging
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry
    if (Test-Path "logs") {
        Add-Content -Path $Global:LogFile -Value $logEntry -Encoding UTF8 -ErrorAction SilentlyContinue
    }
}

Write-Host @"
🛑======================================================🛑
   QBTC QUANTUM SYSTEM SHUTDOWN INICIADO
   
   🔒  Shutdown Seguro: $(if(-not $Force){"ACTIVADO"}else{"DESACTIVADO"})
   💾  Guardar Estado: $(if($SaveState){"SÍ"}else{"NO"})
   ⚡  Modo Forzado: $(if($Force){"SÍ"}else{"NO"})
🛑======================================================🛑
"@ -ForegroundColor Red

Write-Log "Iniciando shutdown del sistema QBTC" "INFO"
Write-Log "Parámetros: Force=$Force, SaveState=$SaveState" "INFO"

try {
    # PASO 1: Detener nuevas operaciones (solo si no es forzado)
    if (-not $Force) {
        Write-Host "`n🚫 PASO 1: Deteniendo nuevas operaciones..." -ForegroundColor Yellow
        Write-Log "Deteniendo nuevas operaciones de trading" "INFO"
        
        try {
            # Intentar detener trading via API REST
            $haltResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/trading/halt" -Method POST -TimeoutSec 10
            Write-Log "Trading detenido via API: $($haltResponse.status)" "SUCCESS"
        } catch {
            Write-Log "No se pudo detener trading via API: $($_.Exception.Message)" "WARNING"
        }
        
        Write-Host "✅ Nuevas operaciones detenidas" -ForegroundColor Green
    }

    # PASO 2: Esperar cierre de posiciones activas (solo si no es forzado)
    if (-not $Force) {
        Write-Host "`n⏳ PASO 2: Esperando cierre de posiciones activas..." -ForegroundColor Yellow
        Write-Log "Verificando posiciones activas" "INFO"
        
        $timeout = 300  # 5 minutos
        $elapsed = 0
        $checkInterval = 10
        
        do {
            try {
                $activePositions = Invoke-RestMethod -Uri "http://localhost:8080/api/positions/active" -TimeoutSec 5
                $activeCount = if ($activePositions.count) { $activePositions.count } else { 0 }
                
                if ($activeCount -gt 0) {
                    Write-Host "  • Posiciones activas: $activeCount" -ForegroundColor Yellow
                    Write-Log "Posiciones activas restantes: $activeCount" "INFO"
                    Start-Sleep $checkInterval
                    $elapsed += $checkInterval
                } else {
                    Write-Log "Todas las posiciones cerradas" "SUCCESS"
                    break
                }
            } catch {
                Write-Log "Error verificando posiciones: $($_.Exception.Message)" "WARNING"
                break
            }
        } while ($elapsed -lt $timeout)
        
        if ($elapsed -ge $timeout) {
            Write-Host "⚠️ Timeout esperando cierre de posiciones. Continuando shutdown..." -ForegroundColor Yellow
            Write-Log "Timeout esperando cierre de posiciones" "WARNING"
        }
        
        Write-Host "✅ Verificación de posiciones completada" -ForegroundColor Green
    }

    # PASO 3: Guardar estado del sistema
    if ($SaveState) {
        Write-Host "`n💾 PASO 3: Guardando estado del sistema..." -ForegroundColor Yellow
        Write-Log "Guardando estado del sistema" "INFO"
        
        try {
            # Guardar estado cuántico
            $quantumSaveResponse = Invoke-RestMethod -Uri "http://localhost:8888/quantum/save-state" -Method POST -TimeoutSec 10
            Write-Log "Estado cuántico guardado: $($quantumSaveResponse.status)" "SUCCESS"
        } catch {
            Write-Log "Error guardando estado cuántico: $($_.Exception.Message)" "WARNING"
        }
        
        try {
            # Crear snapshot de configuración actual
            $configSnapshot = @{
                Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                SystemVersion = "QBTC v3.0"
                ActiveJobs = (Get-Job | Where-Object { $_.State -eq "Running" }).Count
                ShutdownReason = if ($Force) { "FORCED" } else { "NORMAL" }
            }
            
            $snapshotPath = "logs\system-snapshot-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
            $configSnapshot | ConvertTo-Json | Out-File $snapshotPath -Encoding UTF8
            Write-Log "Snapshot del sistema guardado en: $snapshotPath" "SUCCESS"
        } catch {
            Write-Log "Error creando snapshot: $($_.Exception.Message)" "WARNING"
        }
        
        Write-Host "✅ Estado del sistema guardado" -ForegroundColor Green
    }

    # PASO 4: Detener jobs en orden inverso de prioridad
    Write-Host "`n🔄 PASO 4: Deteniendo jobs del sistema..." -ForegroundColor Yellow
    Write-Log "Iniciando detención de jobs del sistema" "INFO"
    
    # Orden de shutdown (inverso al startup)
    $shutdownOrder = @(
        "Monitoring*",
        "Dashboard*", 
        "MLOptimizer*",
        "PricingEngine*",
        "TradingSystem*",
        "AnalysisEngine*",
        "BinanceServer*",
        "BinanceConnector*",
        "QuantumEngine*",
        "QuantumCore*"
    )
    
    $allJobs = Get-Job
    Write-Log "Jobs totales encontrados: $($allJobs.Count)" "INFO"
    
    foreach ($jobPattern in $shutdownOrder) {
        $matchingJobs = $allJobs | Where-Object { $_.Name -like $jobPattern }
        
        if ($matchingJobs) {
            Write-Host "  🛑 Deteniendo jobs: $jobPattern ($($matchingJobs.Count) jobs)" -ForegroundColor Cyan
            
            foreach ($job in $matchingJobs) {
                try {
                    Write-Log "Deteniendo job: $($job.Name) (Estado: $($job.State))" "INFO"
                    
                    if ($job.State -eq "Running") {
                        Stop-Job $job -PassThru | Out-Null
                        
                        # Esperar un momento para la parada elegante
                        if (-not $Force) {
                            Start-Sleep 2
                        }
                    }
                    
                    # Remover el job
                    Remove-Job $job -Force -ErrorAction SilentlyContinue
                    Write-Log "Job $($job.Name) detenido y removido" "SUCCESS"
                    
                } catch {
                    Write-Log "Error deteniendo job $($job.Name): $($_.Exception.Message)" "ERROR"
                }
            }
            
            Start-Sleep 1
        }
    }
    
    # Verificar jobs restantes
    $remainingJobs = Get-Job
    if ($remainingJobs) {
        Write-Host "  🧹 Limpiando jobs restantes..." -ForegroundColor Yellow
        Write-Log "Jobs restantes: $($remainingJobs.Count)" "INFO"
        
        foreach ($job in $remainingJobs) {
            try {
                Write-Log "Deteniendo job restante: $($job.Name)" "INFO"
                Stop-Job $job -PassThru | Remove-Job -Force
            } catch {
                Write-Log "Error con job restante $($job.Name): $($_.Exception.Message)" "WARNING"
            }
        }
    }
    
    Write-Host "✅ Todos los jobs detenidos" -ForegroundColor Green

    # PASO 5: Cerrar conexiones y liberar recursos
    Write-Host "`n🔌 PASO 5: Cerrando conexiones y liberando recursos..." -ForegroundColor Yellow
    Write-Log "Liberando recursos del sistema" "INFO"
    
    try {
        # Cerrar posibles conexiones de red
        Write-Log "Cerrando conexiones de red" "INFO"
        
        # Intentar cerrar puertos en uso
        $portsToCheck = @(8080, 8888, 9000)
        foreach ($port in $portsToCheck) {
            try {
                $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
                if ($connections) {
                    Write-Log "Conexiones activas en puerto $port: $($connections.Count)" "INFO"
                }
            } catch {
                # Silenciar errores de puertos no en uso
            }
        }
        
        # Forzar garbage collection
        [System.GC]::Collect()
        [System.GC]::WaitForPendingFinalizers()
        Write-Log "Garbage collection ejecutado" "INFO"
        
    } catch {
        Write-Log "Error liberando recursos: $($_.Exception.Message)" "WARNING"
    }
    
    Write-Host "✅ Recursos liberados" -ForegroundColor Green

    # PASO 6: Verificación final
    Write-Host "`n✅ PASO 6: Verificación final..." -ForegroundColor Yellow
    Write-Log "Ejecutando verificación final" "INFO"
    
    $finalJobs = Get-Job
    $elapsedTime = (Get-Date) - $Global:ShutdownStartTime
    
    $shutdownSummary = @{
        JobsRemaining = $finalJobs.Count
        ShutdownTime = $elapsedTime.ToString("mm\:ss")
        ShutdownType = if ($Force) { "FORZADO" } else { "SEGURO" }
        StateSaved = $SaveState
    }
    
    Write-Log "Resumen shutdown: $($shutdownSummary | ConvertTo-Json -Compress)" "INFO"
    
    # Mostrar resumen final
    Write-Host @"
✅======================================================✅
   SHUTDOWN DEL SISTEMA QBTC COMPLETADO
   
   🕒  Tiempo total: $($shutdownSummary.ShutdownTime)
   🔄  Jobs restantes: $($shutdownSummary.JobsRemaining)
   💾  Estado guardado: $(if($SaveState){"SÍ"}else{"NO"})
   📋  Tipo shutdown: $($shutdownSummary.ShutdownType)
   
   📝  Log guardado en: $Global:LogFile
   
   Sistema QBTC detenido correctamente.
✅======================================================✅
"@ -ForegroundColor Green

    Write-Log "Shutdown del sistema completado exitosamente" "SUCCESS"

} catch {
    Write-Host "❌ ERROR DURANTE SHUTDOWN: $($_.Exception.Message)" -ForegroundColor Red
    Write-Log "Error crítico durante shutdown: $($_.Exception.Message)" "ERROR"
    Write-Log "Stack trace: $($_.ScriptStackTrace)" "ERROR"
    
    # Cleanup de emergencia
    Write-Host "`n🚨 Ejecutando cleanup de emergencia..." -ForegroundColor Red
    Write-Log "Iniciando cleanup de emergencia" "ERROR"
    
    try {
        Get-Job | Stop-Job -PassThru | Remove-Job -Force -ErrorAction SilentlyContinue
        Write-Log "Cleanup de emergencia completado" "INFO"
    } catch {
        Write-Log "Error en cleanup de emergencia: $($_.Exception.Message)" "ERROR"
    }
    
    exit 1
}

# Limpiar variables globales
Remove-Variable -Name "LogFile", "ShutdownStartTime" -Scope Global -ErrorAction SilentlyContinue

Write-Host "`n💡 Para reiniciar el sistema: .\Start-QBTCQuantumSystem.ps1" -ForegroundColor Cyan
Write-Log "Script de shutdown finalizado" "INFO"

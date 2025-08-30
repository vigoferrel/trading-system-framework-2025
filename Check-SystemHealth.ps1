<#
.SYNOPSIS
Script de verificación de salud del sistema QBTC Quantum

.DESCRIPTION
Ejecuta una verificación completa de la salud de todos los componentes
del sistema QBTC y proporciona un reporte detallado.

.PARAMETER Detailed
Mostrar información detallada de cada componente

.PARAMETER ExportReport
Exportar reporte a archivo JSON

.EXAMPLE
.\Check-SystemHealth.ps1
Verificación básica de salud

.EXAMPLE
.\Check-SystemHealth.ps1 -Detailed -ExportReport
Verificación detallada con exportación de reporte
#>

[CmdletBinding()]
param(
    [switch]$Detailed,
    [switch]$ExportReport
)

# Configuración
$ErrorActionPreference = "SilentlyContinue"
$Global:HealthReport = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    OverallStatus = "UNKNOWN"
    ComponentStatus = @{}
    Issues = @()
    Metrics = @{}
    Recommendations = @()
}

function Write-HealthStatus {
    param(
        [string]$Component,
        [string]$Status,
        [string]$Details = ""
    )
    
    $color = switch ($Status) {
        "HEALTHY" { "Green" }
        "DEGRADED" { "Yellow" }
        "CRITICAL" { "Red" }
        "UNKNOWN" { "Gray" }
        default { "White" }
    }
    
    $symbol = switch ($Status) {
        "HEALTHY" { "✅" }
        "DEGRADED" { "⚠️" }
        "CRITICAL" { "❌" }
        "UNKNOWN" { "❓" }
        default { "•" }
    }
    
    $message = "  $symbol $Component`: $Status"
    if ($Details -and $Detailed) {
        $message += " - $Details"
    }
    
    Write-Host $message -ForegroundColor $color
}

Write-Host @"
🏥======================================================🏥
   VERIFICACIÓN DE SALUD DEL SISTEMA QBTC QUANTUM
   
   ⚕️  Análisis Integral de Componentes
   📊  Métricas de Rendimiento
   🔍  Detección de Problemas
   💡  Recomendaciones Automáticas
🏥======================================================🏥
"@ -ForegroundColor Cyan

Write-Host "`n🔍 Iniciando verificación de salud del sistema..." -ForegroundColor Yellow

try {
    # 1. VERIFICAR COMPONENTES CUÁNTICOS
    Write-Host "`n⚛️ COMPONENTES CUÁNTICOS:" -ForegroundColor Magenta
    
    try {
        $quantumStatus = Invoke-RestMethod -Uri "http://localhost:8888/quantum/status" -TimeoutSec 5
        
        if ($quantumStatus.coherence -gt 0.90) {
            Write-HealthStatus "Quantum Core" "HEALTHY" "Coherencia: $([math]::Round($quantumStatus.coherence * 100, 2))%"
            $Global:HealthReport.ComponentStatus['QuantumCore'] = "HEALTHY"
        } elseif ($quantumStatus.coherence -gt 0.75) {
            Write-HealthStatus "Quantum Core" "DEGRADED" "Coherencia baja: $([math]::Round($quantumStatus.coherence * 100, 2))%"
            $Global:HealthReport.ComponentStatus['QuantumCore'] = "DEGRADED"
            $Global:HealthReport.Issues += "Coherencia cuántica por debajo del óptimo"
            $Global:HealthReport.Recommendations += "Recalibrar sistemas cuánticos"
        } else {
            Write-HealthStatus "Quantum Core" "CRITICAL" "Coherencia crítica: $([math]::Round($quantumStatus.coherence * 100, 2))%"
            $Global:HealthReport.ComponentStatus['QuantumCore'] = "CRITICAL"
            $Global:HealthReport.Issues += "Coherencia cuántica crítica"
        }
        
        $Global:HealthReport.Metrics['QuantumCoherence'] = $quantumStatus.coherence
        
    } catch {
        Write-HealthStatus "Quantum Core" "CRITICAL" "No responde"
        $Global:HealthReport.ComponentStatus['QuantumCore'] = "CRITICAL"
        $Global:HealthReport.Issues += "Quantum Core no está disponible"
        $Global:HealthReport.Recommendations += "Reiniciar componentes cuánticos"
    }

    # 2. VERIFICAR CONECTIVIDAD BINANCE
    Write-Host "`n🔗 CONECTIVIDAD BINANCE:" -ForegroundColor Blue
    
    try {
        $binanceTest = Test-NetConnection -ComputerName "api.binance.com" -Port 443 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($binanceTest) {
            Write-HealthStatus "Binance API" "HEALTHY" "Conectividad OK"
            $Global:HealthReport.ComponentStatus['BinanceAPI'] = "HEALTHY"
        } else {
            Write-HealthStatus "Binance API" "CRITICAL" "Sin conectividad"
            $Global:HealthReport.ComponentStatus['BinanceAPI'] = "CRITICAL"
            $Global:HealthReport.Issues += "Sin conectividad a Binance API"
        }
    } catch {
        Write-HealthStatus "Binance API" "UNKNOWN" "Error verificando conectividad"
        $Global:HealthReport.ComponentStatus['BinanceAPI'] = "UNKNOWN"
    }
    
    # Verificar WebSocket
    try {
        $wsTest = Test-NetConnection -ComputerName "stream.binance.com" -Port 9443 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($wsTest) {
            Write-HealthStatus "Binance WebSocket" "HEALTHY" "Conectividad OK"
            $Global:HealthReport.ComponentStatus['BinanceWS'] = "HEALTHY"
        } else {
            Write-HealthStatus "Binance WebSocket" "DEGRADED" "Conectividad limitada"
            $Global:HealthReport.ComponentStatus['BinanceWS'] = "DEGRADED"
            $Global:HealthReport.Issues += "Problemas con WebSocket de Binance"
        }
    } catch {
        Write-HealthStatus "Binance WebSocket" "UNKNOWN" "Error verificando"
        $Global:HealthReport.ComponentStatus['BinanceWS'] = "UNKNOWN"
    }

    # 3. VERIFICAR JOBS DEL SISTEMA
    Write-Host "`n🔄 JOBS DEL SISTEMA:" -ForegroundColor Green
    
    $allJobs = Get-Job
    $runningJobs = $allJobs | Where-Object { $_.State -eq "Running" }
    $failedJobs = $allJobs | Where-Object { $_.State -eq "Failed" }
    
    if ($runningJobs.Count -gt 0) {
        Write-HealthStatus "System Jobs" "HEALTHY" "$($runningJobs.Count) jobs activos"
        $Global:HealthReport.ComponentStatus['SystemJobs'] = "HEALTHY"
        $Global:HealthReport.Metrics['ActiveJobs'] = $runningJobs.Count
        
        if ($Detailed) {
            foreach ($job in $runningJobs) {
                Write-Host "    • $($job.Name): $($job.State)" -ForegroundColor Green
            }
        }
    } else {
        Write-HealthStatus "System Jobs" "CRITICAL" "Sin jobs activos"
        $Global:HealthReport.ComponentStatus['SystemJobs'] = "CRITICAL"
        $Global:HealthReport.Issues += "Sistema no tiene jobs activos"
        $Global:HealthReport.Recommendations += "Iniciar sistema QBTC"
    }
    
    if ($failedJobs.Count -gt 0) {
        Write-HealthStatus "Failed Jobs" "CRITICAL" "$($failedJobs.Count) jobs fallidos"
        $Global:HealthReport.Issues += "$($failedJobs.Count) jobs han fallado"
        $Global:HealthReport.Recommendations += "Revisar logs y reiniciar jobs fallidos"
        
        if ($Detailed) {
            foreach ($job in $failedJobs) {
                Write-Host "    ❌ $($job.Name): $($job.State)" -ForegroundColor Red
            }
        }
    }

    # 4. VERIFICAR FLUJO DE DATOS
    Write-Host "`n📊 FLUJO DE DATOS:" -ForegroundColor Cyan
    
    $latestDataFiles = @(
        "logs\market-data-latest.json",
        "logs\global-overview-*.json",
        "logs\allocation-latest.txt"
    )
    
    $dataHealthy = $true
    foreach ($filePattern in $latestDataFiles) {
        $files = Get-ChildItem $filePattern -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        
        if ($files) {
            $age = (Get-Date) - $files.LastWriteTime
            if ($age.TotalMinutes -lt 5) {
                Write-HealthStatus "Data Flow" "HEALTHY" "Datos frescos (últimos $([math]::Round($age.TotalMinutes, 1)) min)"
            } elseif ($age.TotalMinutes -lt 15) {
                Write-HealthStatus "Data Flow" "DEGRADED" "Datos algo antiguos ($([math]::Round($age.TotalMinutes, 1)) min)"
                $dataHealthy = $false
                $Global:HealthReport.Issues += "Flujo de datos puede estar degradado"
            } else {
                Write-HealthStatus "Data Flow" "CRITICAL" "Datos obsoletos ($([math]::Round($age.TotalHours, 1)) horas)"
                $dataHealthy = $false
                $Global:HealthReport.Issues += "Flujo de datos crítico"
                $Global:HealthReport.Recommendations += "Verificar conectores de datos"
            }
        }
    }
    
    if ($dataHealthy) {
        $Global:HealthReport.ComponentStatus['DataFlow'] = "HEALTHY"
    } else {
        $Global:HealthReport.ComponentStatus['DataFlow'] = "DEGRADED"
    }

    # 5. VERIFICAR RECURSOS DEL SISTEMA
    Write-Host "`n💻 RECURSOS DEL SISTEMA:" -ForegroundColor Yellow
    
    try {
        # CPU
        $cpuUsage = (Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 1 -MaxSamples 3).CounterSamples | 
                    Measure-Object -Property CookedValue -Average | Select-Object -ExpandProperty Average
        
        if ($cpuUsage -lt 70) {
            Write-HealthStatus "CPU Usage" "HEALTHY" "$([math]::Round($cpuUsage, 1))%"
            $Global:HealthReport.ComponentStatus['CPU'] = "HEALTHY"
        } elseif ($cpuUsage -lt 85) {
            Write-HealthStatus "CPU Usage" "DEGRADED" "$([math]::Round($cpuUsage, 1))%"
            $Global:HealthReport.ComponentStatus['CPU'] = "DEGRADED"
            $Global:HealthReport.Issues += "Alto uso de CPU"
        } else {
            Write-HealthStatus "CPU Usage" "CRITICAL" "$([math]::Round($cpuUsage, 1))%"
            $Global:HealthReport.ComponentStatus['CPU'] = "CRITICAL"
            $Global:HealthReport.Issues += "Uso crítico de CPU"
            $Global:HealthReport.Recommendations += "Optimizar o escalar recursos de CPU"
        }
        
        $Global:HealthReport.Metrics['CPUUsage'] = [math]::Round($cpuUsage, 2)
        
    } catch {
        Write-HealthStatus "CPU Usage" "UNKNOWN" "Error obteniendo métricas"
        $Global:HealthReport.ComponentStatus['CPU'] = "UNKNOWN"
    }
    
    try {
        # Memoria
        $totalMemory = (Get-CimInstance -ClassName Win32_ComputerSystem).TotalPhysicalMemory / 1GB
        $availableMemory = (Get-Counter '\Memory\Available MBytes').CounterSamples.CookedValue / 1024
        $memoryUsagePercent = (($totalMemory - $availableMemory) / $totalMemory) * 100
        
        if ($memoryUsagePercent -lt 70) {
            Write-HealthStatus "Memory Usage" "HEALTHY" "$([math]::Round($memoryUsagePercent, 1))% ($([math]::Round($availableMemory, 1))GB disponible)"
            $Global:HealthReport.ComponentStatus['Memory'] = "HEALTHY"
        } elseif ($memoryUsagePercent -lt 85) {
            Write-HealthStatus "Memory Usage" "DEGRADED" "$([math]::Round($memoryUsagePercent, 1))% ($([math]::Round($availableMemory, 1))GB disponible)"
            $Global:HealthReport.ComponentStatus['Memory'] = "DEGRADED"
            $Global:HealthReport.Issues += "Alto uso de memoria"
        } else {
            Write-HealthStatus "Memory Usage" "CRITICAL" "$([math]::Round($memoryUsagePercent, 1))% ($([math]::Round($availableMemory, 1))GB disponible)"
            $Global:HealthReport.ComponentStatus['Memory'] = "CRITICAL"
            $Global:HealthReport.Issues += "Memoria crítica"
            $Global:HealthReport.Recommendations += "Liberar memoria o aumentar RAM"
        }
        
        $Global:HealthReport.Metrics['MemoryUsage'] = [math]::Round($memoryUsagePercent, 2)
        $Global:HealthReport.Metrics['AvailableMemoryGB'] = [math]::Round($availableMemory, 2)
        
    } catch {
        Write-HealthStatus "Memory Usage" "UNKNOWN" "Error obteniendo métricas"
        $Global:HealthReport.ComponentStatus['Memory'] = "UNKNOWN"
    }
    
    try {
        # Espacio en disco
        $diskSpace = Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DriveType=3" | Where-Object { $_.DeviceID -eq "C:" }
        $freeSpaceGB = [math]::Round($diskSpace.FreeSpace / 1GB, 2)
        $totalSpaceGB = [math]::Round($diskSpace.Size / 1GB, 2)
        $usagePercent = [math]::Round((($totalSpaceGB - $freeSpaceGB) / $totalSpaceGB) * 100, 1)
        
        if ($freeSpaceGB -gt 5) {
            Write-HealthStatus "Disk Space" "HEALTHY" "$freeSpaceGB GB disponible ($usagePercent% usado)"
            $Global:HealthReport.ComponentStatus['DiskSpace'] = "HEALTHY"
        } elseif ($freeSpaceGB -gt 1) {
            Write-HealthStatus "Disk Space" "DEGRADED" "$freeSpaceGB GB disponible ($usagePercent% usado)"
            $Global:HealthReport.ComponentStatus['DiskSpace'] = "DEGRADED"
            $Global:HealthReport.Issues += "Poco espacio en disco"
            $Global:HealthReport.Recommendations += "Limpiar archivos temporales y logs antiguos"
        } else {
            Write-HealthStatus "Disk Space" "CRITICAL" "$freeSpaceGB GB disponible ($usagePercent% usado)"
            $Global:HealthReport.ComponentStatus['DiskSpace'] = "CRITICAL"
            $Global:HealthReport.Issues += "Espacio en disco crítico"
            $Global:HealthReport.Recommendations += "Liberar espacio en disco inmediatamente"
        }
        
        $Global:HealthReport.Metrics['DiskFreeSpaceGB'] = $freeSpaceGB
        $Global:HealthReport.Metrics['DiskUsagePercent'] = $usagePercent
        
    } catch {
        Write-HealthStatus "Disk Space" "UNKNOWN" "Error obteniendo métricas"
        $Global:HealthReport.ComponentStatus['DiskSpace'] = "UNKNOWN"
    }

    # 6. VERIFICAR SERVICIOS WEB
    Write-Host "`n🌐 SERVICIOS WEB:" -ForegroundColor Magenta
    
    $webServices = @(
        @{ Name = "Dashboard"; URL = "http://localhost:8080"; Port = 8080 },
        @{ Name = "Quantum API"; URL = "http://localhost:8888/quantum/status"; Port = 8888 }
    )
    
    foreach ($service in $webServices) {
        try {
            $response = Invoke-WebRequest -Uri $service.URL -TimeoutSec 5 -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-HealthStatus $service.Name "HEALTHY" "Puerto $($service.Port) OK"
                $Global:HealthReport.ComponentStatus[$service.Name] = "HEALTHY"
            } else {
                Write-HealthStatus $service.Name "DEGRADED" "Código: $($response.StatusCode)"
                $Global:HealthReport.ComponentStatus[$service.Name] = "DEGRADED"
            }
        } catch {
            Write-HealthStatus $service.Name "CRITICAL" "No accesible en puerto $($service.Port)"
            $Global:HealthReport.ComponentStatus[$service.Name] = "CRITICAL"
            $Global:HealthReport.Issues += "$($service.Name) no está accesible"
        }
    }

    # 7. DETERMINAR ESTADO GENERAL
    Write-Host "`n🎯 EVALUACIÓN GENERAL:" -ForegroundColor White
    
    $criticalComponents = $Global:HealthReport.ComponentStatus.Values | Where-Object { $_ -eq "CRITICAL" }
    $degradedComponents = $Global:HealthReport.ComponentStatus.Values | Where-Object { $_ -eq "DEGRADED" }
    $healthyComponents = $Global:HealthReport.ComponentStatus.Values | Where-Object { $_ -eq "HEALTHY" }
    
    if ($criticalComponents.Count -eq 0 -and $degradedComponents.Count -eq 0) {
        $Global:HealthReport.OverallStatus = "HEALTHY"
        $statusColor = "Green"
        $statusSymbol = "✅"
    } elseif ($criticalComponents.Count -eq 0) {
        $Global:HealthReport.OverallStatus = "DEGRADED"
        $statusColor = "Yellow"
        $statusSymbol = "⚠️"
    } else {
        $Global:HealthReport.OverallStatus = "CRITICAL"
        $statusColor = "Red"
        $statusSymbol = "❌"
    }
    
    Write-Host "`n$statusSymbol ESTADO GENERAL DEL SISTEMA: $($Global:HealthReport.OverallStatus)" -ForegroundColor $statusColor
    Write-Host "  • Componentes saludables: $($healthyComponents.Count)" -ForegroundColor Green
    Write-Host "  • Componentes degradados: $($degradedComponents.Count)" -ForegroundColor Yellow
    Write-Host "  • Componentes críticos: $($criticalComponents.Count)" -ForegroundColor Red

    # 8. MOSTRAR PROBLEMAS Y RECOMENDACIONES
    if ($Global:HealthReport.Issues.Count -gt 0) {
        Write-Host "`n⚠️ PROBLEMAS IDENTIFICADOS:" -ForegroundColor Red
        foreach ($issue in $Global:HealthReport.Issues) {
            Write-Host "  • $issue" -ForegroundColor Red
        }
    }
    
    if ($Global:HealthReport.Recommendations.Count -gt 0) {
        Write-Host "`n💡 RECOMENDACIONES:" -ForegroundColor Cyan
        foreach ($recommendation in $Global:HealthReport.Recommendations) {
            Write-Host "  • $recommendation" -ForegroundColor Cyan
        }
    }

    # 9. EXPORTAR REPORTE SI SE SOLICITA
    if ($ExportReport) {
        $reportPath = "logs\health-report-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
        $Global:HealthReport | ConvertTo-Json -Depth 3 | Out-File $reportPath -Encoding UTF8
        Write-Host "`n📄 Reporte exportado a: $reportPath" -ForegroundColor Cyan
    }

    # 10. RESUMEN FINAL
    $uptime = if ($runningJobs.Count -gt 0) { "ACTIVO" } else { "INACTIVO" }
    
    Write-Host @"

🏥======================================================🏥
   VERIFICACIÓN DE SALUD COMPLETADA
   
   🎯  Estado General: $($Global:HealthReport.OverallStatus)
   ⏱️  Timestamp: $($Global:HealthReport.Timestamp)
   🔄  Sistema: $uptime
   📊  Componentes verificados: $($Global:HealthReport.ComponentStatus.Count)
   
   Para más detalles: .\Check-SystemHealth.ps1 -Detailed
🏥======================================================🏥
"@ -ForegroundColor Cyan

} catch {
    Write-Host "❌ ERROR DURANTE VERIFICACIÓN: $($_.Exception.Message)" -ForegroundColor Red
    $Global:HealthReport.OverallStatus = "ERROR"
    $Global:HealthReport.Issues += "Error durante verificación de salud"
    exit 1
}

# Retornar objeto de salud para uso programático
return $Global:HealthReport

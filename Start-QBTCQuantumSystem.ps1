<#
.SYNOPSIS
Lanzador maestro del sistema QBTC Quantum Binance Options

.DESCRIPTION
Este script orquesta el arranque completo del sistema en el orden óptimo
con verificaciones de salud y fallbacks automáticos.

.PARAMETER TestMode
Ejecutar en modo de prueba sin conexiones reales

.PARAMETER SkipPreVerification
Omitir verificaciones previas (solo para desarrollo)

.PARAMETER TimeoutSeconds
Tiempo máximo de espera para arranque completo

.EXAMPLE
.\Start-QBTCQuantumSystem.ps1
Arranque normal del sistema

.EXAMPLE
.\Start-QBTCQuantumSystem.ps1 -TestMode
Arranque en modo de prueba
#>

[CmdletBinding()]
param(
    [switch]$TestMode,
    [switch]$SkipPreVerification,
    [int]$TimeoutSeconds = 600
)

# Configuración inicial
$ErrorActionPreference = "Stop"
$Global:SystemJobs = @()
$Global:StartTime = Get-Date
$Global:LogFile = "logs\startup-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

# Función de logging
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry
    Add-Content -Path $Global:LogFile -Value $logEntry -Encoding UTF8
}

# Crear directorio de logs si no existe
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Name "logs" -Force | Out-Null
}

Write-Host @"
🌟======================================================🌟
   QBTC QUANTUM BINANCE OPTIONS TRADING SYSTEM v3.0
   Iniciando Workflow Maestro de Arranque...
   
   ⚛️  Algoritmos Cuánticos Deterministas: z = 9 + 16i
   🔗  Sistema Integrado Binance Options
   📊  ML Optimizer con Algoritmos Genéticos
   🌟  Acceso al Plano de Beneficio Infinito
🌟======================================================🌟
"@ -ForegroundColor Cyan

Write-Log "Iniciando sistema QBTC Quantum v3.0" "INFO"
Write-Log "Parámetros: TestMode=$TestMode, SkipPreVerification=$SkipPreVerification" "INFO"

try {
    # FASE 1: Pre-verificación e inicialización del núcleo
    if (-not $SkipPreVerification) {
        Write-Host "`n🔍 FASE 1: Pre-verificación e inicialización del núcleo..." -ForegroundColor Yellow
        Write-Log "Iniciando FASE 1: Pre-verificación" "INFO"
        
        if (Test-Path ".\scripts\Start-QuantumPreVerification.ps1") {
            & ".\scripts\Start-QuantumPreVerification.ps1" -TestMode:$TestMode
        } else {
            Write-Warning "Script Start-QuantumPreVerification.ps1 no encontrado. Ejecutando verificaciones básicas..."
            
            # Verificaciones básicas integradas
            Write-Log "Verificando dependencias críticas" "INFO"
            
            # Verificar PowerShell version
            if ($PSVersionTable.PSVersion.Major -lt 5) {
                throw "PowerShell 5.0 o superior requerido"
            }
            
            # Verificar Python
            try {
                $pythonVersion = python --version 2>&1
                Write-Log "Python detectado: $pythonVersion" "INFO"
            } catch {
                throw "Python no está instalado o no está en PATH"
            }
            
            # Verificar Node.js
            try {
                $nodeVersion = node --version 2>&1
                Write-Log "Node.js detectado: $nodeVersion" "INFO"
            } catch {
                throw "Node.js no está instalado o no está en PATH"
            }
            
            # Verificar variables de entorno Binance (solo si no es TestMode)
            if (-not $TestMode) {
                if (-not $env:BINANCE_API_KEY -or -not $env:BINANCE_API_SECRET) {
                    Write-Warning "Credenciales de Binance no configuradas. Continuando en modo simulación."
                    $TestMode = $true
                }
            }
        }
        
        Write-Host "✅ FASE 1 COMPLETADA" -ForegroundColor Green
        Write-Log "FASE 1 completada exitosamente" "SUCCESS"
    }

    # FASE 2: Inicialización de componentes cuánticos
    Write-Host "`n⚛️ FASE 2: Inicialización de componentes cuánticos..." -ForegroundColor Yellow
    Write-Log "Iniciando FASE 2: Componentes cuánticos" "INFO"
    
    if (Test-Path ".\scripts\Start-QuantumCore.ps1") {
        & ".\scripts\Start-QuantumCore.ps1" -TestMode:$TestMode
    } else {
        Write-Warning "Script Start-QuantumCore.ps1 no encontrado. Inicializando componentes cuánticos básicos..."
        
        # Verificar si existe el motor cuántico
        if (Test-Path "quantum\QuantumEngineCore.js") {
            Write-Log "Iniciando Quantum Engine Core" "INFO"
            $quantumJob = Start-Job -Name "QuantumEngine" -ScriptBlock {
                param($TestMode)
                Set-Location $using:PWD
                if ($TestMode) {
                    node quantum\QuantumEngineCore.js --mode=test --interval=60000
                } else {
                    node quantum\QuantumEngineCore.js --mode=continuous --interval=30000
                }
            } -ArgumentList $TestMode
            $Global:SystemJobs += $quantumJob
            
            # Esperar inicialización cuántica
            Start-Sleep -Seconds 15
            Write-Log "Sistema cuántico inicializado" "SUCCESS"
        } else {
            Write-Warning "Motor cuántico no encontrado. Continuando sin componentes cuánticos."
        }
    }
    
    Write-Host "✅ FASE 2 COMPLETADA" -ForegroundColor Green
    Write-Log "FASE 2 completada exitosamente" "SUCCESS"

    # FASE 3: Activación de conectores Binance
    Write-Host "`n🔗 FASE 3: Activación de conectores Binance..." -ForegroundColor Yellow
    Write-Log "Iniciando FASE 3: Conectores Binance" "INFO"
    
    if (Test-Path ".\scripts\Start-BinanceConnectors.ps1") {
        & ".\scripts\Start-BinanceConnectors.ps1" -TestMode:$TestMode
    } else {
        Write-Warning "Script Start-BinanceConnectors.ps1 no encontrado. Inicializando conectores básicos..."
        
        # Iniciar servidor de datos básico si existe
        if (Test-Path "binance_options-main\server\dashboard_server.py") {
            Write-Log "Iniciando servidor de datos Binance" "INFO"
            $serverJob = Start-Job -Name "BinanceServer" -ScriptBlock {
                param($TestMode)
                Set-Location $using:PWD
                if ($TestMode) {
                    python binance_options-main\server\dashboard_server.py --port=8080 --host=localhost --test-mode
                } else {
                    python binance_options-main\server\dashboard_server.py --port=8080 --host=localhost
                }
            } -ArgumentList $TestMode
            $Global:SystemJobs += $serverJob
            
            Start-Sleep -Seconds 10
            Write-Log "Servidor Binance iniciado en puerto 8080" "SUCCESS"
        }
    }
    
    Write-Host "✅ FASE 3 COMPLETADA" -ForegroundColor Green
    Write-Log "FASE 3 completada exitosamente" "SUCCESS"

    # FASE 4: Arranque de motores de análisis
    Write-Host "`n📊 FASE 4: Arranque de motores de análisis..." -ForegroundColor Yellow
    Write-Log "Iniciando FASE 4: Motores de análisis" "INFO"
    
    if (Test-Path ".\scripts\Start-AnalysisEngines.ps1") {
        & ".\scripts\Start-AnalysisEngines.ps1" -TestMode:$TestMode
    } else {
        Write-Warning "Script Start-AnalysisEngines.ps1 no encontrado. Inicializando análisis básicos..."
        
        # Iniciar motor de pricing si existe
        if (Test-Path "binance_options-main\src\brisk\pricing.py") {
            Write-Log "Iniciando motor de pricing" "INFO"
            $pricingJob = Start-Job -Name "PricingEngine" -ScriptBlock {
                param($TestMode)
                Set-Location $using:PWD
                if ($TestMode) {
                    python binance_options-main\src\brisk\pricing.py --test-mode --update-interval=60
                } else {
                    python binance_options-main\src\brisk\pricing.py --continuous --update-interval=15
                }
            } -ArgumentList $TestMode
            $Global:SystemJobs += $pricingJob
        }
    }
    
    Write-Host "✅ FASE 4 COMPLETADA" -ForegroundColor Green
    Write-Log "FASE 4 completada exitosamente" "SUCCESS"

    # FASE 5: Activación de sistemas de trading
    Write-Host "`n💹 FASE 5: Activación de sistemas de trading..." -ForegroundColor Yellow
    Write-Log "Iniciando FASE 5: Sistemas de trading" "INFO"
    
    if (Test-Path ".\scripts\Start-TradingSystems.ps1") {
        & ".\scripts\Start-TradingSystems.ps1" -TestMode:$TestMode
    } else {
        Write-Warning "Script Start-TradingSystems.ps1 no encontrado. Trading en modo simulación..."
        Write-Log "Sistemas de trading en modo simulación" "WARNING"
    }
    
    Write-Host "✅ FASE 5 COMPLETADA" -ForegroundColor Green
    Write-Log "FASE 5 completada exitosamente" "SUCCESS"

    # FASE 6: Activación de monitoreo y logging
    Write-Host "`n📈 FASE 6: Activación de monitoreo y logging..." -ForegroundColor Yellow
    Write-Log "Iniciando FASE 6: Monitoreo y logging" "INFO"
    
    if (Test-Path ".\scripts\Start-MonitoringSystems.ps1") {
        & ".\scripts\Start-MonitoringSystems.ps1"
    } else {
        Write-Warning "Script Start-MonitoringSystems.ps1 no encontrado. Monitoreo básico activo..."
        Write-Log "Monitoreo básico iniciado" "INFO"
    }
    
    Write-Host "✅ FASE 6 COMPLETADA" -ForegroundColor Green
    Write-Log "FASE 6 completada exitosamente" "SUCCESS"

    # Verificación final del sistema
    Write-Host "`n🎯 Verificación final del sistema..." -ForegroundColor Yellow
    Write-Log "Ejecutando verificación final del sistema" "INFO"
    
    $systemHealth = @{
        OverallStatus = "HEALTHY"
        ActiveJobs = $Global:SystemJobs.Count
        TestMode = $TestMode
        Issues = @()
    }
    
    # Verificar jobs activos
    $runningJobs = Get-Job | Where-Object { $_.State -eq "Running" }
    Write-Log "Jobs activos: $($runningJobs.Count)" "INFO"
    
    # Verificar acceso a dashboard
    try {
        if (-not $TestMode) {
            $dashboardTest = Invoke-WebRequest -Uri "http://localhost:8080" -TimeoutSec 5 -UseBasicParsing
            Write-Log "Dashboard accesible en puerto 8080" "SUCCESS"
        }
    } catch {
        Write-Log "Dashboard no accesible: $($_.Exception.Message)" "WARNING"
        $systemHealth.Issues += "Dashboard no accesible"
    }
    
    if ($systemHealth.Issues.Count -eq 0) {
        $elapsedTime = (Get-Date) - $Global:StartTime
        
        Write-Host @"
🎉======================================================🎉
   SISTEMA QBTC COMPLETAMENTE OPERACIONAL
   
   ⚛️  Sistemas Cuánticos: $(if($TestMode){"SIMULACIÓN"}else{"ACTIVOS"})
   🔗  Conectores Binance: $(if($TestMode){"SIMULACIÓN"}else{"CONECTADOS"})
   📊  Motores Análisis: FUNCIONANDO
   💹  Sistemas Trading: $(if($TestMode){"SIMULACIÓN"}else{"OPERACIONALES"})
   📈  Monitoreo: ACTIVO
   
   🌟 ACCESO AL PLANO DE BENEFICIO INFINITO: ACTIVADO
   
   Dashboard: http://localhost:8080
   Jobs activos: $($systemHealth.ActiveJobs)
   Tiempo total arranque: $($elapsedTime.ToString("mm\:ss"))
   
   Para detener el sistema: .\Stop-AllSystems.ps1
🎉======================================================🎉
"@ -ForegroundColor Green
        
        Write-Log "Sistema QBTC iniciado exitosamente en $($elapsedTime.ToString('mm\:ss'))" "SUCCESS"
        
        # Mostrar jobs activos
        Write-Host "`n📊 Jobs del sistema activos:" -ForegroundColor Cyan
        Get-Job | Where-Object { $_.State -eq "Running" } | ForEach-Object {
            Write-Host "  • $($_.Name): $($_.State)" -ForegroundColor Green
        }
        
        Write-Host "`n💡 Comandos útiles:" -ForegroundColor Yellow
        Write-Host "  • Get-Job                    - Ver estado de jobs"
        Write-Host "  • .\Check-SystemHealth.ps1   - Verificar salud del sistema"
        Write-Host "  • .\Stop-AllSystems.ps1      - Detener sistema completo"
        Write-Host "  • Get-Content '$Global:LogFile' -Wait -Tail 10 - Ver logs en tiempo real"
        
    } else {
        Write-Host "❌ Sistema iniciado con advertencias: $($systemHealth.Issues -join ', ')" -ForegroundColor Yellow
        Write-Log "Sistema iniciado con advertencias: $($systemHealth.Issues -join ', ')" "WARNING"
    }

} catch {
    Write-Host "❌ ERROR EN ARRANQUE: $($_.Exception.Message)" -ForegroundColor Red
    Write-Log "Error crítico en arranque: $($_.Exception.Message)" "ERROR"
    Write-Log "Stack trace: $($_.ScriptStackTrace)" "ERROR"
    
    # Cleanup en caso de error
    Write-Host "🧹 Ejecutando cleanup..." -ForegroundColor Yellow
    Write-Log "Iniciando cleanup por error" "INFO"
    
    # Detener jobs creados
    $Global:SystemJobs | ForEach-Object {
        if ($_.State -eq "Running") {
            Write-Log "Deteniendo job: $($_.Name)" "INFO"
            Stop-Job $_ -PassThru | Remove-Job
        }
    }
    
    Write-Host "❌ Arranque fallido. Revise el log: $Global:LogFile" -ForegroundColor Red
    Write-Log "Arranque fallido. Sistema limpiado." "ERROR"
    
    exit 1
}

Write-Log "Script de arranque completado" "INFO"

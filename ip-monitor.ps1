# Monitor de IP Fija para Binance
# Sistema que garantiza que la IP se mantenga whitelisted

param(
    [switch]$Monitor,
    [switch]$Check,
    [switch]$Fix,
    [switch]$Status
)

# Configuración
$ConfigFile = "fixed-ip-config.json"
$FixedIP = "181.43.148.169"
$LogFile = "ip-monitor.log"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"
    Write-Host $LogEntry -ForegroundColor $(if ($Level -eq "ERROR") { "Red" } elseif ($Level -eq "WARNING") { "Yellow" } else { "Green" })
    Add-Content -Path $LogFile -Value $LogEntry
}

function Get-CurrentIP {
    try {
        $IP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing -TimeoutSec 10).Content
        return $IP
    } catch {
        Write-Log "Error obteniendo IP actual: $($_.Exception.Message)" "ERROR"
        return $null
    }
}

function Test-IPConnectivity {
    param([string]$IP)
    try {
        $PingResult = Test-Connection -ComputerName "8.8.8.8" -Count 1 -Quiet
        return $PingResult
    } catch {
        return $false
    }
}

function Check-IPStatus {
    Write-Log "=== VERIFICACIÓN DE IP FIJA ==="

    $CurrentIP = Get-CurrentIP
    if ($null -eq $CurrentIP) {
        Write-Log "No se pudo obtener la IP actual" "ERROR"
        return $false
    }

    Write-Log "IP actual: $CurrentIP"
    Write-Log "IP esperada: $FixedIP"

    if ($CurrentIP -eq $FixedIP) {
        Write-Log "✅ IP correcta - Sistema operativo" "SUCCESS"
        return $true
    } else {
        Write-Log "❌ IP incorrecta - Se requiere corrección" "WARNING"
        Write-Log "IP actual: $CurrentIP | IP esperada: $FixedIP" "WARNING"
        return $false
    }
}

function Monitor-IPChanges {
    Write-Log "=== INICIANDO MONITOREO DE IP ==="

    while ($true) {
        $IPCorrect = Check-IPStatus

        if (-not $IPCorrect) {
            Write-Log "Cambio de IP detectado - Enviando alerta" "WARNING"

            # Aquí puedes agregar código para enviar alertas por email, Telegram, etc.
            # Por ahora solo logueamos
            Write-Log "ALERTA: La IP ha cambiado. IP actual no está whitelisted en Binance" "ERROR"
        }

        # Esperar 5 minutos antes de la siguiente verificación
        Start-Sleep -Seconds 300
    }
}

function Fix-IPConfiguration {
    Write-Log "=== INTENTANDO CORREGIR CONFIGURACIÓN DE IP ==="

    # Verificar adaptadores de red
    $Adapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" }

    Write-Log "Adaptadores de red activos:"
    foreach ($Adapter in $Adapters) {
        Write-Log "  - $($Adapter.Name): $($Adapter.Status)"
    }

    # Verificar configuración de IP
    $IPConfig = Get-NetIPConfiguration

    Write-Log "Configuración de IP:"
    foreach ($Interface in $IPConfig) {
        Write-Log "  - Interfaz: $($Interface.InterfaceAlias)"
        Write-Log "  - IPv4: $($Interface.IPv4Address.IPAddress)"
        Write-Log "  - Gateway: $($Interface.IPv4DefaultGateway.NextHop)"
        Write-Log "  - DNS: $($Interface.DNSServer.ServerAddresses -join ', ')"
    }

    Write-Log "Para mantener la IP fija, asegúrate de:"
    Write-Log "1. Configurar IP estática en el router si es posible"
    Write-Log "2. Usar VPN con IP dedicada si la IP actual cambia"
    Write-Log "3. Configurar DDNS si usas IP dinámica"
}

function Show-Status {
    Write-Log "=== ESTADO DEL SISTEMA DE IP FIJA ==="

    # Verificar configuración
    if (Test-Path $ConfigFile) {
        Write-Log "✅ Archivo de configuración encontrado: $ConfigFile"
        try {
            $Config = Get-Content $ConfigFile | ConvertFrom-Json
            Write-Log "✅ Configuración JSON válida"
            Write-Log "IP configurada: $($Config.fixedWhitelistIP)"
        } catch {
            Write-Log "❌ Error en archivo de configuración JSON" "ERROR"
        }
    } else {
        Write-Log "❌ Archivo de configuración no encontrado: $ConfigFile" "ERROR"
    }

    # Verificar conectividad
    $Connectivity = Test-IPConnectivity -IP $FixedIP
    if ($Connectivity) {
        Write-Log "✅ Conectividad a internet: OK"
    } else {
        Write-Log "❌ Problemas de conectividad a internet" "WARNING"
    }

    # Verificar IP actual
    Check-IPStatus

    # Mostrar información adicional
    Write-Log "`n=== INFORMACIÓN DEL SISTEMA ==="
    Write-Log "Fecha/Hora: $(Get-Date)"
    Write-Log "Usuario: $env:USERNAME"
    Write-Log "Directorio: $(Get-Location)"
    Write-Log "Archivo de log: $LogFile"
}

# Lógica principal
if ($Monitor) {
    Write-Log "Iniciando modo monitoreo continuo..."
    Monitor-IPChanges
} elseif ($Check) {
    Check-IPStatus
} elseif ($Fix) {
    Fix-IPConfiguration
} elseif ($Status) {
    Show-Status
} else {
    Write-Host "Uso: .\ip-monitor.ps1 [-Monitor] [-Check] [-Fix] [-Status]"
    Write-Host ""
    Write-Host "Parámetros:"
    Write-Host "  -Monitor : Monitoreo continuo de cambios de IP"
    Write-Host "  -Check   : Verificación única del estado de IP"
    Write-Host "  -Fix     : Intento de corrección de configuración"
    Write-Host "  -Status  : Estado completo del sistema"
    Write-Host ""
    Write-Host "Ejemplos:"
    Write-Host "  .\ip-monitor.ps1 -Check"
    Write-Host "  .\ip-monitor.ps1 -Monitor"
    Write-Host "  .\ip-monitor.ps1 -Status"
}

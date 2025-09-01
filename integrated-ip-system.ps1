# Sistema Integrado de IP Fija para Binance
# Script principal que combina todos los componentes

Write-Host "=== SISTEMA INTEGRADO DE IP FIJA PARA BINANCE ===" -ForegroundColor Green
Write-Host "IP Fija Whitelisted: 181.43.148.169" -ForegroundColor Cyan
Write-Host "Sistema Quantum Trading - Configuración Permanente" -ForegroundColor Cyan

# Configuración
$FixedIP = "181.43.148.169"
$ConfigFile = "fixed-ip-config.json"
$ManagerScript = "fixed-ip-manager.js"
$MonitorScript = "ip-monitor.ps1"
$BalanceScript = "check-balance.js"

function Write-ColorLog {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"

    switch ($Level) {
        "SUCCESS" { Write-Host $LogEntry -ForegroundColor Green }
        "WARNING" { Write-Host $LogEntry -ForegroundColor Yellow }
        "ERROR" { Write-Host $LogEntry -ForegroundColor Red }
        default { Write-Host $LogEntry -ForegroundColor White }
    }

    Add-Content -Path "integrated-system.log" -Value $LogEntry
}

function Test-NodeJS {
    try {
        $nodeVersion = & node --version 2>$null
        Write-ColorLog "Node.js detectado: $nodeVersion" "SUCCESS"
        return $true
    } catch {
        Write-ColorLog "Node.js no encontrado. Instale Node.js primero." "ERROR"
        return $false
    }
}

function Test-Configuration {
    Write-ColorLog "=== VERIFICANDO CONFIGURACIÓN ===" "INFO"

    # Verificar archivo de configuración
    if (Test-Path $ConfigFile) {
        Write-ColorLog "✅ Archivo de configuración encontrado: $ConfigFile" "SUCCESS"
        try {
            $config = Get-Content $ConfigFile | ConvertFrom-Json
            Write-ColorLog "✅ Configuración JSON válida" "SUCCESS"
            Write-ColorLog "IP configurada: $($config.fixedWhitelistIP)" "INFO"
        } catch {
            Write-ColorLog "❌ Error en configuración JSON: $($_.Exception.Message)" "ERROR"
            return $false
        }
    } else {
        Write-ColorLog "❌ Archivo de configuración no encontrado: $ConfigFile" "ERROR"
        return $false
    }

    # Verificar scripts
    $scripts = @($ManagerScript, $MonitorScript, $BalanceScript)
    foreach ($script in $scripts) {
        if (Test-Path $script) {
            Write-ColorLog "✅ Script encontrado: $script" "SUCCESS"
        } else {
            Write-ColorLog "❌ Script no encontrado: $script" "WARNING"
        }
    }

    return $true
}

function Get-CurrentIP {
    try {
        $ip = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing -TimeoutSec 10).Content
        return $ip
    } catch {
        Write-ColorLog "Error obteniendo IP actual: $($_.Exception.Message)" "ERROR"
        return $null
    }
}

function Test-IPStatus {
    Write-ColorLog "=== VERIFICANDO ESTADO DE IP ===" "INFO"

    $currentIP = Get-CurrentIP
    if ($null -eq $currentIP) {
        Write-ColorLog "No se pudo obtener la IP actual" "ERROR"
        return $false
    }

    Write-ColorLog "IP actual: $currentIP" "INFO"
    Write-ColorLog "IP esperada: $FixedIP" "INFO"

    if ($currentIP -eq $FixedIP) {
        Write-ColorLog "✅ IP CORRECTA - Sistema operativo con IP whitelisted" "SUCCESS"
        return $true
    } else {
        Write-ColorLog "❌ IP INCORRECTA - No coincide con IP whitelisted" "ERROR"
        Write-ColorLog "Solución: Configure VPN o router para mantener IP fija" "WARNING"
        return $false
    }
}

function Test-BinanceConnection {
    Write-ColorLog "=== PRUEBA DE CONEXIÓN CON BINANCE ===" "INFO"

    if (Test-Path $ManagerScript) {
        try {
            Write-ColorLog "Ejecutando prueba de conexión..." "INFO"
            & node $ManagerScript --test-binance
            return $true
        } catch {
            Write-ColorLog "Error en prueba de conexión: $($_.Exception.Message)" "ERROR"
            return $false
        }
    } else {
        Write-ColorLog "Script de manager no encontrado" "ERROR"
        return $false
    }
}

function Test-BalanceRetrieval {
    Write-ColorLog "=== PRUEBA DE OBTENCIÓN DE BALANCE ===" "INFO"

    if (Test-Path $BalanceScript) {
        try {
            Write-ColorLog "Intentando obtener balance de Binance..." "INFO"
            $result = & node $BalanceScript 2>&1

            # Analizar resultado
            if ($result -match "OK.*Conexión exitosa") {
                Write-ColorLog "✅ Balance obtenido correctamente" "SUCCESS"
                return $true
            } elseif ($result -match "Invalid API-key") {
                Write-ColorLog "❌ Error de API Key - Verificar credenciales" "ERROR"
                return $false
            } elseif ($result -match "IP.*permissions") {
                Write-ColorLog "❌ Error de IP - La IP actual no está whitelisted" "ERROR"
                return $false
            } else {
                Write-ColorLog "⚠️ Resultado desconocido en obtención de balance" "WARNING"
                return $false
            }
        } catch {
            Write-ColorLog "Error ejecutando script de balance: $($_.Exception.Message)" "ERROR"
            return $false
        }
    } else {
        Write-ColorLog "Script de balance no encontrado" "ERROR"
        return $false
    }
}

function Show-SystemStatus {
    Write-ColorLog "=== ESTADO COMPLETO DEL SISTEMA ===" "INFO"

    Write-ColorLog "Configuración del Sistema:" "INFO"
    Write-ColorLog "  - IP Fija Whitelisted: $FixedIP" "INFO"
    Write-ColorLog "  - Archivo Config: $ConfigFile" "INFO"
    Write-ColorLog "  - Manager Script: $ManagerScript" "INFO"
    Write-ColorLog "  - Monitor Script: $MonitorScript" "INFO"
    Write-ColorLog "  - Balance Script: $BalanceScript" "INFO"

    Write-ColorLog "`nEstado de Componentes:" "INFO"

    # Verificar Node.js
    if (Test-NodeJS) {
        Write-ColorLog "  ✅ Node.js: OK" "SUCCESS"
    } else {
        Write-ColorLog "  ❌ Node.js: FALTA" "ERROR"
    }

    # Verificar configuración
    if (Test-Configuration) {
        Write-ColorLog "  ✅ Configuración: OK" "SUCCESS"
    } else {
        Write-ColorLog "  ❌ Configuración: ERROR" "ERROR"
    }

    # Verificar IP
    if (Test-IPStatus) {
        Write-ColorLog "  ✅ IP Status: OK" "SUCCESS"
    } else {
        Write-ColorLog "  ❌ IP Status: ERROR" "ERROR"
    }

    # Verificar conexión Binance
    if (Test-BinanceConnection) {
        Write-ColorLog "  ✅ Conexión Binance: OK" "SUCCESS"
    } else {
        Write-ColorLog "  ❌ Conexión Binance: ERROR" "ERROR"
    }

    # Verificar balance
    if (Test-BalanceRetrieval) {
        Write-ColorLog "  ✅ Balance: OK" "SUCCESS"
    } else {
        Write-ColorLog "  ❌ Balance: ERROR" "ERROR"
    }
}

function Start-Monitoring {
    Write-ColorLog "=== INICIANDO MONITOREO CONTINUO ===" "INFO"

    if (Test-Path $MonitorScript) {
        Write-ColorLog "Iniciando monitor de IP..." "INFO"
        Start-Process powershell -ArgumentList "-File $MonitorScript -Monitor" -NoNewWindow
    } else {
        Write-ColorLog "Script de monitor no encontrado" "ERROR"
    }

    if (Test-Path $ManagerScript) {
        Write-ColorLog "Iniciando manager de IP..." "INFO"
        Start-Process node -ArgumentList "$ManagerScript --monitor" -NoNewWindow
    } else {
        Write-ColorLog "Script de manager no encontrado" "ERROR"
    }
}

function Show-Menu {
    Write-Host "`n=== MENÚ DEL SISTEMA INTEGRADO ===" -ForegroundColor Yellow
    Write-Host "1. Verificar estado completo del sistema" -ForegroundColor White
    Write-Host "2. Probar conexión con IP actual" -ForegroundColor White
    Write-Host "3. Obtener balance de Binance" -ForegroundColor White
    Write-Host "4. Iniciar monitoreo continuo" -ForegroundColor White
    Write-Host "5. Ver configuración actual" -ForegroundColor White
    Write-Host "6. Salir" -ForegroundColor White
    Write-Host "`nSeleccione una opción (1-6): " -NoNewline
}

# Verificar Node.js al inicio
if (-not (Test-NodeJS)) {
    Write-ColorLog "Node.js es requerido para este sistema" "ERROR"
    exit 1
}

# Lógica del menú
do {
    Show-Menu
    $choice = Read-Host

    switch ($choice) {
        "1" { Show-SystemStatus }
        "2" {
            Write-ColorLog "=== PRUEBA DE IP Y CONEXIÓN ===" "INFO"
            Test-IPStatus
            Test-BinanceConnection
        }
        "3" {
            Write-ColorLog "=== OBTENCIÓN DE BALANCE ===" "INFO"
            Test-BalanceRetrieval
        }
        "4" {
            Write-ColorLog "=== INICIANDO MONITOREO ===" "INFO"
            Start-Monitoring
        }
        "5" {
            Write-ColorLog "=== CONFIGURACIÓN ACTUAL ===" "INFO"
            if (Test-Path $ConfigFile) {
                $config = Get-Content $ConfigFile | ConvertFrom-Json
                Write-ColorLog "IP Fija: $($config.fixedWhitelistIP)" "INFO"
                Write-ColorLog "Intervalo de chequeo: $($config.ipCheckInterval)ms" "INFO"
                Write-ColorLog "Monitoreo habilitado: $($config.monitoring.monitorIPChanges)" "INFO"
            } else {
                Write-ColorLog "Archivo de configuración no encontrado" "ERROR"
            }
        }
        "6" {
            Write-ColorLog "Saliendo del sistema..." "INFO"
            break
        }
        default {
            Write-ColorLog "Opción inválida. Intente nuevamente." "WARNING"
        }
    }

    if ($choice -ne "6") {
        Read-Host "`nPresione Enter para continuar"
    }
} while ($choice -ne "6")

Write-ColorLog "=== SESIÓN FINALIZADA ===" "INFO"

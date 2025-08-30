# QBTC Quantum System - Referencia Rápida de Comandos

## [START] COMANDOS PRINCIPALES

### Arranque del Sistema
```powershell
# Arranque normal
.\Start-QBTCQuantumSystem.ps1

# Arranque en modo de prueba
.\Start-QBTCQuantumSystem.ps1 -TestMode

# Arranque sin verificaciones previas
.\Start-QBTCQuantumSystem.ps1 -SkipPreVerification
```

### Parada del Sistema
```powershell
# Parada segura normal
.\Stop-AllSystems.ps1

# Parada forzada inmediata
.\Stop-AllSystems.ps1 -Force

# Parada sin guardar estado
.\Stop-AllSystems.ps1 -SaveState:$false
```

### Verificación de Salud
```powershell
# Verificación básica
.\Check-SystemHealth.ps1

# Verificación detallada
.\Check-SystemHealth.ps1 -Detailed

# Exportar reporte de salud
.\Check-SystemHealth.ps1 -Detailed -ExportReport
```

---

## [DATA] MONITOREO EN TIEMPO REAL

### Ver Jobs del Sistema
```powershell
# Listar todos los jobs
Get-Job

# Ver jobs en ejecución
Get-Job | Where-Object { $_.State -eq "Running" }

# Ver jobs fallidos
Get-Job | Where-Object { $_.State -eq "Failed" }

# Ver output de un job específico
Receive-Job -Name "QuantumEngine"
```

### Monitorear Logs
```powershell
# Ver logs de arranque en tiempo real
Get-Content "logs\startup-*.log" -Wait -Tail 10

# Ver logs más recientes
Get-ChildItem "logs\*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 5

# Ver logs de un día específico
Get-ChildItem "logs\*$(Get-Date -Format 'yyyyMMdd')*.log"
```

### Acceder Dashboard Web
- **URL Principal**: http://localhost:8080
- **API Quantum**: http://localhost:8888/quantum/status
- **Swagger API**: http://localhost:8080/swagger

---

##  COMANDOS CUÁNTICOS

### Estado Cuántico
```powershell
# Verificar coherencia cuántica
Invoke-RestMethod -Uri "http://localhost:8888/quantum/status"

# Guardar estado cuántico
Invoke-RestMethod -Uri "http://localhost:8888/quantum/save-state" -Method POST

# Recargar configuración cuántica
Invoke-RestMethod -Uri "http://localhost:8888/quantum/reload-config" -Method POST
```

### Algoritmos Cuánticos
```powershell
# Ejecutar análisis cuántico completo
Invoke-RestMethod -Uri "http://localhost:8888/quantum/analyze" -Method POST

# Verificar entrelazamiento
Invoke-RestMethod -Uri "http://localhost:8888/quantum/entanglement"

# Estado de qubits
Invoke-RestMethod -Uri "http://localhost:8888/quantum/qubits"
```

---

##  CONECTIVIDAD BINANCE

### Verificar Conectividad
```powershell
# Test conectividad API
Test-NetConnection -ComputerName "api.binance.com" -Port 443

# Test WebSocket
Test-NetConnection -ComputerName "stream.binance.com" -Port 9443

# Ping Binance API
Invoke-RestMethod -Uri "https://api.binance.com/api/v3/ping"
```

### Estado de Órdenes y Posiciones
```powershell
# Ver órdenes activas
Invoke-RestMethod -Uri "http://localhost:8080/api/orders/active"

# Ver posiciones abiertas
Invoke-RestMethod -Uri "http://localhost:8080/api/positions/active"

# Ver PnL actual
Invoke-RestMethod -Uri "http://localhost:8080/api/pnl/current"
```

---

##  COMANDOS DE TRADING

### Control de Trading
```powershell
# Detener trading
Invoke-RestMethod -Uri "http://localhost:8080/api/trading/halt" -Method POST

# Reanudar trading
Invoke-RestMethod -Uri "http://localhost:8080/api/trading/resume" -Method POST

# Estado del sistema de trading
Invoke-RestMethod -Uri "http://localhost:8080/api/trading/status"
```

### Gestión de Posiciones
```powershell
# Cerrar todas las posiciones
Invoke-RestMethod -Uri "http://localhost:8080/api/positions/close-all" -Method POST

# Cerrar posición específica
Invoke-RestMethod -Uri "http://localhost:8080/api/positions/close/BTCUSDT" -Method POST
```

---

## [UP] MÉTRICAS Y ANÁLISIS

### Métricas del Sistema
```powershell
# CPU y Memoria
Get-Counter '\Processor(_Total)\% Processor Time'
Get-Counter '\Memory\Available MBytes'

# Espacio en disco
Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DriveType=3"

# Conexiones de red activas
Get-NetTCPConnection -State Established
```

### Métricas de Trading
```powershell
# Resumen de performance
Invoke-RestMethod -Uri "http://localhost:8080/api/metrics/performance"

# Win rate y estadísticas
Invoke-RestMethod -Uri "http://localhost:8080/api/metrics/stats"

# Drawdown actual
Invoke-RestMethod -Uri "http://localhost:8080/api/metrics/drawdown"
```

---

##  MANTENIMIENTO

### Limpiar Sistema
```powershell
# Limpiar jobs completados
Get-Job | Where-Object { $_.State -eq "Completed" } | Remove-Job

# Limpiar logs antiguos (más de 7 días)
Get-ChildItem "logs\*.log" | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item

# Forzar garbage collection
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()
```

### Reiniciar Componentes
```powershell
# Reiniciar componente específico
Stop-Job -Name "QuantumEngine"
Start-Job -Name "QuantumEngine" -ScriptBlock { node quantum\QuantumEngineCore.js }

# Reiniciar todos los jobs
Get-Job | Stop-Job -PassThru | Remove-Job
.\Start-QBTCQuantumSystem.ps1
```

---

## [ALERT] COMANDOS DE EMERGENCIA

### Parada de Emergencia
```powershell
# Parada forzada inmediata
Get-Job | Stop-Job -PassThru | Remove-Job -Force

# Cerrar todas las conexiones
Get-NetTCPConnection -LocalPort 8080,8888 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Limpieza completa de emergencia
.\Stop-AllSystems.ps1 -Force
```

### Recovery del Sistema
```powershell
# Verificar integridad después de error
.\Check-SystemHealth.ps1 -Detailed -ExportReport

# Restart completo del sistema
.\Stop-AllSystems.ps1 -Force
Start-Sleep 30
.\Start-QBTCQuantumSystem.ps1
```

---

##  LOGS Y DIAGNÓSTICO

### Ubicaciones de Logs
- **Startup Logs**: `logs\startup-YYYYMMDD-HHMMSS.log`
- **Shutdown Logs**: `logs\shutdown-YYYYMMDD-HHMMSS.log`
- **Health Reports**: `logs\health-report-YYYYMMDD-HHMMSS.json`
- **Trading Logs**: `logs\trading-*.log`
- **Error Logs**: `logs\error-*.log`

### Comandos de Diagnóstico
```powershell
# Ver último error
Get-EventLog -LogName Application -Source "QBTC*" -Newest 10

# Verificar puertos en uso
Get-NetTCPConnection -LocalPort 8080,8888,9000

# Ver procesos Python/Node activos
Get-Process | Where-Object { $_.ProcessName -match "python|node" }
```

---

##  CONFIGURACIÓN

### Variables de Entorno
```powershell
# Configurar credenciales Binance
$env:BINANCE_API_KEY = "tu_api_key_aqui"
$env:BINANCE_API_SECRET = "tu_api_secret_aqui"

# Configurar modo de operación
$env:QBTC_MODE = "PRODUCTION"  # o "TEST"
$env:QBTC_LOG_LEVEL = "INFO"   # DEBUG, INFO, WARNING, ERROR
```

### Archivos de Configuración
- **Sistema Principal**: `config\system.json`
- **Configuración Cuántica**: `quantum\config.json`
- **Parámetros Trading**: `config\trading.json`
- **Configuración Binance**: `config\binance.json`

---

##  SOPORTE Y TROUBLESHOOTING

### Comandos Útiles para Soporte
```powershell
# Generar reporte completo del sistema
$report = @{
    Timestamp = Get-Date
    SystemInfo = Get-ComputerInfo
    Jobs = Get-Job
    Processes = Get-Process | Where-Object { $_.ProcessName -match "python|node" }
    NetworkConnections = Get-NetTCPConnection -LocalPort 8080,8888
    HealthReport = .\Check-SystemHealth.ps1 -Detailed
}
$report | ConvertTo-Json -Depth 3 | Out-File "system-report.json"

# Crear backup de configuración
Compress-Archive -Path "config\*", "quantum\*" -DestinationPath "backup-config-$(Get-Date -Format 'yyyyMMdd').zip"
```

### Contacto y Recursos
- **Logs Directory**: `logs\`
- **Config Directory**: `config\`
- **Documentation**: `MASTER_STARTUP_WORKFLOW.md`
- **Health Check**: `.\Check-SystemHealth.ps1 -Detailed`

---

*Este sistema utiliza exclusivamente algoritmos cuánticos deterministas basados en z = 9 + 16i @ =log(7919) para máxima precisión y consistencia.*

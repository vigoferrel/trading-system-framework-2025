# Verificador de Saldo Binance con Dual VPN Solution (PowerShell)
# Este script conecta la VPN cuántica y verifica el saldo de la cuenta Binance
# usando la IP única generada por algoritmos cuánticos deterministas.
# Ejecuta todos los procesos en segundo plano para monitoreo continuo.

# Constantes
$QUANTUM_Z_REAL = 9
$QUANTUM_Z_IMAG = 16
$QUANTUM_LAMBDA = [Math]::Log(7919)
$QUANTUM_IP = "192.168.173.160"
$QUANTUM_PORT = 1862
$LOG_FILE = "saldo-binance.log"

# Función para mostrar mensajes con formato
function Write-ColorOutput {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message,
        
        [Parameter(Mandatory = $false)]
        [string]$ForegroundColor = "White"
    )
    
    Write-Host $Message -ForegroundColor $ForegroundColor
}

# Función para verificar si un archivo existe
function Test-FileExists {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        
        [Parameter(Mandatory = $false)]
        [string]$ErrorMessage,
        
        [Parameter(Mandatory = $false)]
        [bool]$Critical = $true
    )
    
    if (-not (Test-Path $Path)) {
        if ($Critical) {
            Write-ColorOutput "ERROR: $ErrorMessage" "Red"
            Write-ColorOutput "Ruta: $Path" "Red"
            Write-ColorOutput "Presione cualquier tecla para salir..." "Yellow"
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            exit 1
        } else {
            Write-ColorOutput "ADVERTENCIA: $ErrorMessage" "Yellow"
            Write-ColorOutput "Ruta: $Path" "Yellow"
            return $false
        }
    }
    
    return $true
}

# Mostrar encabezado
Write-ColorOutput "===================================================" "Cyan"
Write-ColorOutput "Verificador de Saldo Binance con Dual VPN Solution" "Cyan"
Write-ColorOutput "MODO SEGUNDO PLANO" "Yellow"
Write-ColorOutput "===================================================" "Cyan"
Write-ColorOutput ""
Write-ColorOutput "Este script conectará la VPN cuántica y verificará" "White"
Write-ColorOutput "el saldo de la cuenta Binance usando la IP única" "White"
Write-ColorOutput "generada por algoritmos cuánticos deterministas." "White"
Write-ColorOutput "Todos los procesos se ejecutarán en segundo plano." "Yellow"
Write-ColorOutput ""
Write-ColorOutput "IP Cuántica: $QUANTUM_IP`:$QUANTUM_PORT" "Green"
Write-ColorOutput "Constantes: z = $QUANTUM_Z_REAL + ${QUANTUM_Z_IMAG}i @ λ=$QUANTUM_LAMBDA" "Green"
Write-ColorOutput ""
Write-ColorOutput "===================================================" "Cyan"
Write-ColorOutput ""

# Verificar si OpenVPN está instalado
Write-ColorOutput "Paso 1: Verificando OpenVPN..." "White"
if (-not (Test-Path "C:\Program Files\OpenVPN\bin\openvpn.exe")) {
    Write-ColorOutput "ERROR: OpenVPN no está instalado o no se encuentra en la ruta esperada." "Red"
    Write-ColorOutput "Por favor, instale OpenVPN desde https://openvpn.net/community-downloads/" "Yellow"
    Write-ColorOutput ""
    Write-ColorOutput "Presione cualquier tecla para salir..." "Yellow"
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}
Write-ColorOutput "✓ OpenVPN encontrado." "Green"

# Verificar archivos de configuración VPN
Write-ColorOutput "Paso 2: Verificando archivos de configuración VPN..." "White"
Test-FileExists -Path "vpn-config\dual-vpn\quantum-vpn.ovpn" -ErrorMessage "No se encuentra el archivo de configuración VPN."

# Verificar/crear credenciales VPN
Write-ColorOutput "Paso 3: Verificando credenciales VPN..." "White"
if (-not (Test-Path "vpn-config\dual-vpn\quantum-vpn-credentials.txt")) {
    Write-ColorOutput "Creando archivo de credenciales..." "Yellow"
    "quantum_trading_system" | Out-File -FilePath "vpn-config\dual-vpn\quantum-vpn-credentials.txt" -Encoding ascii
    "z9p16i_lambda7919_5eb89680" | Out-File -FilePath "vpn-config\dual-vpn\quantum-vpn-credentials.txt" -Encoding ascii -Append
    Write-ColorOutput "✓ Archivo de credenciales creado correctamente." "Green"
} else {
    Write-ColorOutput "✓ Archivo de credenciales encontrado." "Green"
}

# Verificar archivo .env con claves API
Write-ColorOutput "Paso 4: Verificando archivo .env con claves API..." "White"
if (-not (Test-Path ".env")) {
    Write-ColorOutput "ADVERTENCIA: No se encuentra el archivo .env con las claves API." "Yellow"
    Write-ColorOutput "Se creará un archivo .env con placeholders. Debe reemplazar estos valores con sus claves reales." "Yellow"
    Write-ColorOutput ""
    
    $envContent = @"
# Binance API Keys
BINANCE_API_KEY=su_api_key_aqui
BINANCE_API_SECRET=su_api_secret_aqui
BINANCE_SPOT_BASE_URL=https://api.binance.com/api/v3
BINANCE_OPTIONS_BASE_URL=https://eapi.binance.com/eapi/v1
BINANCE_TESTNET=false

# VPN Configuration
VPN_IP=192.168.173.160
VPN_PORT=1862

# Quantum Constants
# No modificar estos valores - son fundamentales para el sistema cuántico
# z = 9 + 16i @ λ=log(7919)
"@
    
    Set-Content -Path ".env" -Value $envContent -Encoding UTF8
    
    Write-ColorOutput "✓ Archivo .env creado." "Green"
    Write-ColorOutput "Por favor, edite este archivo con sus claves API reales antes de continuar." "Yellow"
    Write-ColorOutput "NOTA: El sistema ahora utiliza un cargador centralizado de variables de entorno." "Cyan"
    Write-ColorOutput "      Esto evita duplicaciones y asegura que las claves correctas se utilicen en todo el sistema." "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "Presione cualquier tecla para salir..." "Yellow"
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
} else {
    Write-ColorOutput "✓ Archivo .env encontrado." "Green"
    Write-ColorOutput "  Usando cargador centralizado de variables de entorno." "Cyan"
}

# Preguntar si desea omitir la conexión VPN
Write-ColorOutput "Paso 5: Configuración de conexión..." "White"
Write-ColorOutput ""
Write-ColorOutput "¿Desea omitir la conexión VPN y usar su IP actual? (S/N)" "Yellow"
$skipVPN = Read-Host

if ($skipVPN -eq "S" -or $skipVPN -eq "s") {
    Write-ColorOutput "Omitiendo conexión VPN (modo directo)..." "Cyan"
    Write-ColorOutput ""
    Write-ColorOutput "NOTA: Se ejecutará el verificador de saldo sin VPN." "Yellow"
    Write-ColorOutput ""
    Write-ColorOutput "Usando IP actual para la conexión a Binance." "White"
    Write-ColorOutput ""
    
    try {
        $currentIP = Invoke-RestMethod -Uri "https://api.ipify.org"
        Write-ColorOutput "IP actual: $currentIP" "Cyan"
    } catch {
        Write-ColorOutput "No se pudo verificar la IP actual. Continuando de todos modos..." "Yellow"
    }
} else {
    Write-ColorOutput "Iniciando VPN cuántica en segundo plano..." "White"
    Write-ColorOutput ""
    Write-ColorOutput "NOTA: La VPN se iniciará en segundo plano." "Yellow"
    Write-ColorOutput ""

    # Iniciar OpenVPN en segundo plano
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd vpn-config\dual-vpn & connect-quantum-vpn.bat" -WindowStyle Hidden

    Write-ColorOutput "Esperando 5 segundos para que la VPN se conecte..." "White"
    Start-Sleep -Seconds 5

    Write-ColorOutput ""
    Write-ColorOutput "Paso 6: Verificando conexión VPN..." "White"
    Write-ColorOutput ""
    Write-ColorOutput "Verificando IP pública actual..." "White"

    try {
        $currentIP = Invoke-RestMethod -Uri "https://api.ipify.org"
        Write-ColorOutput "IP actual: $currentIP" "Cyan"
        
        if ($currentIP -ne $QUANTUM_IP) {
            Write-ColorOutput "ADVERTENCIA: La IP actual no coincide con la IP esperada ($QUANTUM_IP)." "Yellow"
            Write-ColorOutput "La conexión VPN podría no estar funcionando correctamente." "Yellow"
            Write-ColorOutput "¿Desea continuar de todos modos? (S/N)" "Yellow"
            $response = Read-Host
            if ($response -ne "S" -and $response -ne "s") {
                Write-ColorOutput "Operación cancelada por el usuario." "Red"
                exit 1
            }
        } else {
            Write-ColorOutput "✓ IP verificada correctamente." "Green"
        }
    } catch {
        Write-ColorOutput "No se pudo verificar la IP actual. Continuando de todos modos..." "Yellow"
    }
}

Write-ColorOutput ""
Write-ColorOutput "Paso 7: Ejecutando verificador de saldo en segundo plano..." "White"
Write-ColorOutput ""

# Crear un trabajo en segundo plano para ejecutar el script de Node.js
$job = Start-Job -ScriptBlock {
    param($workingDir)
    Set-Location $workingDir
    node check-balance.js > $using:LOG_FILE 2>&1
} -ArgumentList (Get-Location).Path

Write-ColorOutput "El verificador de saldo se está ejecutando en segundo plano." "Green"
Write-ColorOutput "Los resultados se guardarán en el archivo $LOG_FILE" "Green"
Write-ColorOutput ""
Write-ColorOutput "===================================================" "Cyan"
Write-ColorOutput ""
Write-ColorOutput "Procesos iniciados en segundo plano:" "White"
if ($skipVPN -ne "S" -and $skipVPN -ne "s") {
    Write-ColorOutput "1. VPN Cuántica ($QUANTUM_IP`:$QUANTUM_PORT)" "Green"
    Write-ColorOutput "2. Verificador de Saldo Binance (Job ID: $($job.Id))" "Green"
} else {
    Write-ColorOutput "1. Verificador de Saldo Binance (Job ID: $($job.Id))" "Green"
    Write-ColorOutput "   (Modo directo - sin VPN)" "Yellow"
}
Write-ColorOutput ""
Write-ColorOutput "Para ver los resultados del saldo, use el comando:" "Yellow"
Write-ColorOutput "  Get-Content $LOG_FILE" "Cyan"
Write-ColorOutput ""
Write-ColorOutput "Para verificar el estado del trabajo:" "Yellow"
Write-ColorOutput "  Get-Job -Id $($job.Id)" "Cyan"
Write-ColorOutput ""
Write-ColorOutput "Para recibir los resultados del trabajo cuando termine:" "Yellow"
Write-ColorOutput "  Receive-Job -Id $($job.Id)" "Cyan"
Write-ColorOutput ""
Write-ColorOutput "NOTA: Para detener los procesos, use el Administrador de Tareas" "Yellow"
Write-ColorOutput "o ejecute los siguientes comandos:" "Yellow"
Write-ColorOutput "  Stop-Job -Id $($job.Id)" "Cyan"
Write-ColorOutput "  Remove-Job -Id $($job.Id)" "Cyan"
Write-ColorOutput ""
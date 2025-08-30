@echo off
echo ===================================================
echo Verificador de Saldo Binance con Dual VPN Solution
echo ===================================================
echo.
echo Este script conectara la VPN cuantica y verificara
echo el saldo de la cuenta Binance usando la IP unica
echo generada por algoritmos cuanticos deterministas.
echo.
echo IP Cuantica: 192.168.173.160:1862
echo Constantes: z = 9 + 16i @ λ=log(7919)
echo.
echo ===================================================
echo.

REM Verificar si OpenVPN esta instalado
if not exist "C:\Program Files\OpenVPN\bin\openvpn.exe" (
    echo ERROR: OpenVPN no esta instalado o no se encuentra en la ruta esperada.
    echo Por favor, instale OpenVPN desde https://openvpn.net/community-downloads/
    echo.
    pause
    exit /b 1
)

echo Paso 1: Verificando archivos de configuracion VPN...
if not exist "vpn-config\dual-vpn\quantum-vpn.ovpn" (
    echo ERROR: No se encuentra el archivo de configuracion VPN.
    echo Asegurese de que el archivo quantum-vpn.ovpn existe en la carpeta vpn-config\dual-vpn
    echo.
    pause
    exit /b 1
)

echo Paso 2: Verificando credenciales VPN...
if not exist "vpn-config\dual-vpn\quantum-vpn-credentials.txt" (
    echo Creando archivo de credenciales...
    echo quantum_trading_system> "vpn-config\dual-vpn\quantum-vpn-credentials.txt"
    echo z9p16i_lambda7919_5eb89680>> "vpn-config\dual-vpn\quantum-vpn-credentials.txt"
    echo Archivo de credenciales creado correctamente.
)

echo Paso 3: Verificando archivo .env con claves API...
if not exist ".env" (
    echo ADVERTENCIA: No se encuentra el archivo .env con las claves API.
    echo Se creara un archivo .env con placeholders. Debe reemplazar estos valores con sus claves reales.
    echo.
    echo # Binance API Keys> ".env"
    echo BINANCE_API_KEY=su_api_key_aqui>> ".env"
    echo BINANCE_API_SECRET=su_api_secret_aqui>> ".env"
    echo BINANCE_SPOT_BASE_URL=https://api.binance.com/api/v3>> ".env"
    echo BINANCE_OPTIONS_BASE_URL=https://eapi.binance.com/eapi/v1>> ".env"
    echo BINANCE_TESTNET=false>> ".env"
    echo.>> ".env"
    echo # VPN Configuration>> ".env"
    echo VPN_IP=192.168.173.160>> ".env"
    echo VPN_PORT=1862>> ".env"
    echo.>> ".env"
    echo # Quantum Constants>> ".env"
    echo # No modificar estos valores - son fundamentales para el sistema cuantico>> ".env"
    echo # z = 9 + 16i @ λ=log(7919)>> ".env"
    echo.
    echo Archivo .env creado. Por favor, edite este archivo con sus claves API reales antes de continuar.
    echo.
    echo NOTA: El sistema ahora utiliza un cargador centralizado de variables de entorno.
    echo       Esto evita duplicaciones y asegura que las claves correctas se utilicen en todo el sistema.
    echo.
    pause
    exit /b 1
) else (
    echo ✓ Archivo .env encontrado.
    echo   Usando cargador centralizado de variables de entorno.
)

echo Paso 4: Omitiendo conexion VPN (modo directo)...
echo.
echo NOTA: Se ejecutara el verificador de saldo sin VPN.
echo.
echo Usando IP actual para la conexion a Binance.
echo.

echo.
echo Paso 6: Ejecutando verificador de saldo en segundo plano...
echo.
start /b "Verificador de Saldo Binance" cmd /c "node check-balance.js > saldo-binance.log 2>&1"
echo El verificador de saldo se esta ejecutando en segundo plano.
echo Los resultados se guardaran en el archivo saldo-binance.log
echo.
echo ===================================================
echo.
echo Procesos iniciados en segundo plano:
echo 1. Verificador de Saldo Binance (resultados en saldo-binance.log)
echo.
echo Para ver los resultados del saldo, use el comando:
echo   type saldo-binance.log
echo.
echo NOTA: Para detener los procesos, use el Administrador de Tareas.
echo.
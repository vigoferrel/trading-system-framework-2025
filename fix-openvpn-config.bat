@echo off
echo ========================================
echo CORRECCION CONFIGURACION OPENVPN
echo ========================================
echo.

REM Verificar si se ejecuta como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ Se requieren permisos de administrador
    echo Ejecuta este script como administrador
    pause
    exit /b 1
)

echo ✅ Ejecutando como administrador

REM Copiar archivo de configuración
echo 🔧 Copiando archivo de configuración...
copy "quantum-vpn.ovpn" "C:\Program Files\OpenVPN\config\quantum-binance\" >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Error copiando archivo. Intentando con PowerShell...
    powershell -Command "Copy-Item 'quantum-vpn.ovpn' 'C:\Program Files\OpenVPN\config\quantum-binance\' -Force"
)
echo ✅ Archivo de configuración copiado

REM Verificar que el archivo existe
if exist "C:\Program Files\OpenVPN\config\quantum-binance\quantum-vpn.ovpn" (
    echo ✅ Archivo de configuración verificado
) else (
    echo ❌ Error: Archivo de configuración no encontrado
    pause
    exit /b 1
)

REM Configurar rutas específicas para Binance (corregidas)
echo 🔧 Configurando rutas específicas para Binance API...

REM Primero resolver las IPs de los dominios
echo Resolviendo IPs de Binance...
for /f "tokens=2" %%i in ('nslookup api.binance.com 2^>nul ^| findstr "Address:"') do set API_IP=%%i
for /f "tokens=2" %%i in ('nslookup fapi.binance.com 2^>nul ^| findstr "Address:"') do set FAPI_IP=%%i
for /f "tokens=2" %%i in ('nslookup eapi.binance.com 2^>nul ^| findstr "Address:"') do set EAPI_IP=%%i
for /f "tokens=2" %%i in ('nslookup dapi.binance.com 2^>nul ^| findstr "Address:"') do set DAPI_IP=%%i

echo API IP: %API_IP%
echo FAPI IP: %FAPI_IP%
echo EAPI IP: %EAPI_IP%
echo DAPI IP: %DAPI_IP%

REM Configurar rutas usando IPs específicas
if not "%API_IP%"=="" (
    echo Configurando ruta para api.binance.com (%API_IP%)...
    route add %API_IP% mask 255.255.255.255 192.168.173.160
)

if not "%FAPI_IP%"=="" (
    echo Configurando ruta para fapi.binance.com (%FAPI_IP%)...
    route add %FAPI_IP% mask 255.255.255.255 192.168.173.160
)

if not "%EAPI_IP%"=="" (
    echo Configurando ruta para eapi.binance.com (%EAPI_IP%)...
    route add %EAPI_IP% mask 255.255.255.255 192.168.173.160
)

if not "%DAPI_IP%"=="" (
    echo Configurando ruta para dapi.binance.com (%DAPI_IP%)...
    route add %DAPI_IP% mask 255.255.255.255 192.168.173.160
)

echo ✅ Rutas configuradas

REM Verificar IP actual
echo 📍 Verificando IP actual...
powershell -Command "(Invoke-WebRequest -Uri 'https://api.ipify.org' -UseBasicParsing).Content"

echo.
echo ========================================
echo CONFIGURACION CORREGIDA COMPLETADA
echo ========================================
echo.
echo 📋 PRÓXIMOS PASOS:
echo 1. Abre OpenVPN GUI
echo 2. Busca la configuración "quantum-binance"
echo 3. Haz clic derecho y selecciona "Connect"
echo 4. Verifica que la IP cambie a 192.168.173.160
echo.
pause

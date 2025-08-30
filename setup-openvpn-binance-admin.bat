@echo off
echo ========================================
echo CONFIGURACION OPENVPN PARA BINANCE API
echo ========================================
echo.

echo 🔧 Configurando OpenVPN para Binance API...

REM Verificar que OpenVPN esté instalado
if not exist "C:\Program Files\OpenVPN\bin\openvpn.exe" (
    echo ❌ OpenVPN no está instalado
    echo Por favor instala OpenVPN desde https://openvpn.net/
    pause
    exit /b 1
)

echo ✅ OpenVPN encontrado

REM Crear directorio de configuración si no existe
if not exist "C:\Program Files\OpenVPN\config\quantum-binance" (
    mkdir "C:\Program Files\OpenVPN\config\quantum-binance" 2>nul
    if errorlevel 1 (
        echo ⚠️ No se pudo crear directorio. Intentando con permisos elevados...
        powershell -Command "New-Item -Path 'C:\Program Files\OpenVPN\config\quantum-binance' -ItemType Directory -Force" 2>nul
    )
    echo ✅ Directorio de configuración creado
)

REM Copiar archivo de configuración
copy "quantum-vpn.ovpn" "C:\Program Files\OpenVPN\config\quantum-binance\" 2>nul
if errorlevel 1 (
    echo ⚠️ No se pudo copiar archivo. Intentando con permisos elevados...
    powershell -Command "Copy-Item 'quantum-vpn.ovpn' 'C:\Program Files\OpenVPN\config\quantum-binance\' -Force" 2>nul
)
echo ✅ Archivo de configuración copiado

REM Crear archivo de credenciales
echo quantum_trading_system > "C:\Program Files\OpenVPN\config\quantum-binance\quantum-vpn-credentials.txt" 2>nul
if errorlevel 1 (
    echo ⚠️ No se pudo crear credenciales. Intentando con permisos elevados...
    powershell -Command "'quantum_trading_system' | Out-File 'C:\Program Files\OpenVPN\config\quantum-binance\quantum-vpn-credentials.txt' -Encoding ascii -Force" 2>nul
    powershell -Command "'z9p16i_lambda7919_5eb89680' | Out-File 'C:\Program Files\OpenVPN\config\quantum-binance\quantum-vpn-credentials.txt' -Encoding ascii -Append" 2>nul
)
echo z9p16i_lambda7919_5eb89680 >> "C:\Program Files\OpenVPN\config\quantum-binance\quantum-vpn-credentials.txt" 2>nul
echo ✅ Archivo de credenciales creado

REM Configurar rutas específicas para Binance (con permisos elevados)
echo 🔧 Configurando rutas específicas para Binance API...

echo Configurando ruta para api.binance.com...
route add api.binance.com mask 255.255.255.255 192.168.173.160 2>nul
if errorlevel 1 (
    echo ⚠️ Ruta ya existe o requiere permisos elevados
)

echo Configurando ruta para fapi.binance.com...
route add fapi.binance.com mask 255.255.255.255 192.168.173.160 2>nul
if errorlevel 1 (
    echo ⚠️ Ruta ya existe o requiere permisos elevados
)

echo Configurando ruta para eapi.binance.com...
route add eapi.binance.com mask 255.255.255.255 192.168.173.160 2>nul
if errorlevel 1 (
    echo ⚠️ Ruta ya existe o requiere permisos elevados
)

echo Configurando ruta para dapi.binance.com...
route add dapi.binance.com mask 255.255.255.255 192.168.173.160 2>nul
if errorlevel 1 (
    echo ⚠️ Ruta ya existe o requiere permisos elevados
)

echo ✅ Rutas configuradas

REM Verificar IP actual
echo 📍 Verificando IP actual...
powershell -Command "(Invoke-WebRequest -Uri 'https://api.ipify.org' -UseBasicParsing).Content"

echo.
echo ========================================
echo CONFIGURACION COMPLETADA
echo ========================================
echo.
echo 📋 PRÓXIMOS PASOS:
echo 1. Abre OpenVPN GUI
echo 2. Busca la configuración "quantum-binance"
echo 3. Haz clic derecho y selecciona "Connect"
echo 4. Verifica que la IP cambie a 192.168.173.160
echo.
echo ⚠️ NOTA: Si las rutas no se configuraron, ejecuta como administrador
echo.
pause

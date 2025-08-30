@echo off
echo ========================================
echo EJECUTANDO COMO ADMINISTRADOR
echo ========================================
echo.

REM Verificar si ya se ejecuta como administrador
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Ya se ejecuta como administrador
    goto :run_setup
) else (
    echo ⚠️ Se requieren permisos de administrador
    echo 🔄 Reiniciando como administrador...
    
    REM Reiniciar como administrador
    powershell -Command "Start-Process -FilePath '%~dpnx0' -Verb RunAs"
    exit /b
)

:run_setup
echo.
echo 🔧 Ejecutando configuración de OpenVPN...
echo.

REM Crear directorio de configuración
if not exist "C:\Program Files\OpenVPN\config\quantum-binance" (
    mkdir "C:\Program Files\OpenVPN\config\quantum-binance"
    echo ✅ Directorio de configuración creado
)

REM Copiar archivo de configuración
copy "quantum-vpn.ovpn" "C:\Program Files\OpenVPN\config\quantum-binance\"
echo ✅ Archivo de configuración copiado

REM Crear archivo de credenciales
echo quantum_trading_system > "C:\Program Files\OpenVPN\config\quantum-binance\quantum-vpn-credentials.txt"
echo z9p16i_lambda7919_5eb89680 >> "C:\Program Files\OpenVPN\config\quantum-binance\quantum-vpn-credentials.txt"
echo ✅ Archivo de credenciales creado

REM Configurar rutas específicas para Binance
echo 🔧 Configurando rutas específicas para Binance API...

echo Configurando ruta para api.binance.com...
route add api.binance.com mask 255.255.255.255 192.168.173.160

echo Configurando ruta para fapi.binance.com...
route add fapi.binance.com mask 255.255.255.255 192.168.173.160

echo Configurando ruta para eapi.binance.com...
route add eapi.binance.com mask 255.255.255.255 192.168.173.160

echo Configurando ruta para dapi.binance.com...
route add dapi.binance.com mask 255.255.255.255 192.168.173.160

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
pause

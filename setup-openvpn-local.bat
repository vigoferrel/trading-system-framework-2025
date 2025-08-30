@echo off
echo ========================================
echo CONFIGURACION OPENVPN LOCAL PARA BINANCE
echo ========================================
echo.

echo 🔧 Configurando OpenVPN local para Binance API...

REM Crear directorio local de configuración
if not exist "openvpn-config" (
    mkdir "openvpn-config"
    echo ✅ Directorio de configuración local creado
)

REM Copiar archivo de configuración
copy "quantum-vpn.ovpn" "openvpn-config\"
echo ✅ Archivo de configuración copiado

REM Crear archivo de credenciales
echo quantum_trading_system > "openvpn-config\quantum-vpn-credentials.txt"
echo z9p16i_lambda7919_5eb89680 >> "openvpn-config\quantum-vpn-credentials.txt"
echo ✅ Archivo de credenciales creado

REM Crear script de conexión
echo @echo off > "openvpn-config\connect-binance.bat"
echo echo Conectando OpenVPN para Binance API... >> "openvpn-config\connect-binance.bat"
echo "C:\Program Files\OpenVPN\bin\openvpn.exe" --config "quantum-vpn.ovpn" --auth-user-pass "quantum-vpn-credentials.txt" >> "openvpn-config\connect-binance.bat"
echo ✅ Script de conexión creado

REM Verificar IP actual
echo 📍 Verificando IP actual...
powershell -Command "(Invoke-WebRequest -Uri 'https://api.ipify.org' -UseBasicParsing).Content"

echo.
echo ========================================
echo CONFIGURACION COMPLETADA
echo ========================================
echo.
echo 📋 PRÓXIMOS PASOS:
echo 1. Navega a la carpeta: openvpn-config
echo 2. Ejecuta: connect-binance.bat
echo 3. Verifica que la IP cambie a 192.168.173.160
echo.
echo 📁 Archivos creados en: openvpn-config\
echo.
pause

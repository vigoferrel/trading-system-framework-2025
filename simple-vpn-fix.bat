@echo off
echo ========================================
echo SOLUCION SIMPLE VPN PARA BINANCE
echo ========================================
echo.

echo 🔧 Configurando rutas simples para Binance...

REM Crear directorio local para configuración
if not exist "vpn-config" mkdir vpn-config

REM Copiar archivo de configuración localmente
copy "quantum-vpn.ovpn" "vpn-config\"
echo ✅ Archivo de configuración copiado localmente

REM Crear credenciales localmente
echo quantum_trading_system > "vpn-config\quantum-vpn-credentials.txt"
echo z9p16i_lambda7919_5eb89680 >> "vpn-config\quantum-vpn-credentials.txt"
echo ✅ Credenciales creadas localmente

REM Configurar rutas usando IPs conocidas de Binance
echo 🔧 Configurando rutas para Binance API...

REM IPs conocidas de Binance (pueden cambiar)
echo Configurando rutas para Binance...
route add 52.84.0.0 mask 255.255.0.0 192.168.173.160 2>nul
route add 54.230.0.0 mask 255.255.0.0 192.168.173.160 2>nul
route add 99.84.0.0 mask 255.255.0.0 192.168.173.160 2>nul

echo ✅ Rutas configuradas

REM Verificar IP actual
echo 📍 Verificando IP actual...
powershell -Command "(Invoke-WebRequest -Uri 'https://api.ipify.org' -UseBasicParsing).Content"

echo.
echo ========================================
echo CONFIGURACION SIMPLE COMPLETADA
echo ========================================
echo.
echo 📋 PRÓXIMOS PASOS:
echo 1. Abre OpenVPN GUI
echo 2. Importa el archivo: vpn-config\quantum-vpn.ovpn
echo 3. Conecta la VPN
echo 4. Verifica que la IP cambie
echo.
echo 📁 Archivos creados en: vpn-config\
echo.
pause

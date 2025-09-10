@echo off
echo ========================================
echo CONFIGURACION DE RUTAS BINANCE API
echo ========================================
echo.

echo 🔧 Configurando rutas específicas para Binance API...

REM Detectar gateway del adaptador VPN dinámicamente
for /f "tokens=3" %%i in ('route print ^| findstr "0.0.0.0.*192.168.173"') do set VPN_GW=%%i
if "%VPN_GW%"=="" set VPN_GW=10.5.0.1

echo Usando gateway VPN: %VPN_GW%

REM Configurar rutas para APIs de Binance usando gateway dinámico
echo Configurando ruta para api.binance.com via %VPN_GW%...
route add api.binance.com mask 255.255.255.255 %VPN_GW%

echo Configurando ruta para fapi.binance.com via %VPN_GW%...
route add fapi.binance.com mask 255.255.255.255 %VPN_GW%

echo Configurando ruta para eapi.binance.com via %VPN_GW%...
route add eapi.binance.com mask 255.255.255.255 %VPN_GW%

echo Configurando ruta para dapi.binance.com via %VPN_GW%...
route add dapi.binance.com mask 255.255.255.255 %VPN_GW%

echo.
echo ✅ Rutas configuradas correctamente
echo.

REM Verificar IP actual
echo 📍 Verificando IP actual...
powershell -Command "(Invoke-WebRequest -Uri 'https://api.ipify.org' -UseBasicParsing).Content"

echo.
echo ========================================
echo CONFIGURACION COMPLETADA
echo ========================================
pause

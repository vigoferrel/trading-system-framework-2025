@echo off
echo ========================================
echo CONFIGURACION DE RUTAS BINANCE API
echo ========================================
echo.

echo 🔧 Configurando rutas específicas para Binance API...

REM Configurar rutas para APIs de Binance
echo Configurando ruta para api.binance.com...
route add api.binance.com mask 255.255.255.255 10.5.0.2

echo Configurando ruta para fapi.binance.com...
route add fapi.binance.com mask 255.255.255.255 10.5.0.2

echo Configurando ruta para eapi.binance.com...
route add eapi.binance.com mask 255.255.255.255 10.5.0.2

echo Configurando ruta para dapi.binance.com...
route add dapi.binance.com mask 255.255.255.255 10.5.0.2

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

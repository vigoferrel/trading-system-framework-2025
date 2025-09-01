@echo off
REM QBTC IP CHANGE ASSISTANT
REM Asistente para cambiar IP y verificar conectividad

echo.
echo ===========================================
echo   QBTC IP CHANGE ASSISTANT
echo ===========================================
echo.

echo [PASO 1] Verificando IP actual...
curl -s https://ipv4.icanhazip.com
echo.

echo [PASO 2] INSTRUCCIONES PARA CAMBIAR IP:
echo =========================================
echo.
echo OPCION A - VPN (Recomendado):
echo 1. Abre NordVPN u OpenVPN
echo 2. Conectate a servidor en Chile/Argentina/Brasil
echo 3. Busca específicamente IP: 181.43.212.196
echo 4. Una vez conectado, presiona una tecla aquí
echo.
echo OPCION B - Proxy temporal:
echo 1. El proxy local está corriendo en puerto 8888
echo 2. Para usar proxy: set HTTP_PROXY=http://localhost:8888
echo.
echo OPCION C - Servicios de túnel:
echo 1. ngrok: ngrok http 443 --host-header=fapi.binance.com
echo 2. localtunnel: lt --port 443 --subdomain qbtc-trading
echo.

pause

echo.
echo [PASO 3] Verificando nueva IP...
curl -s https://ipv4.icanhazip.com
echo.

echo [PASO 4] Probando conectividad con Binance...
node check-balance.js

echo.
echo ===========================================
echo   VERIFICACION COMPLETADA
echo ===========================================
echo.
pause

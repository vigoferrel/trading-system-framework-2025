@echo off
echo ==============================================
echo   BOT DE FUTUROS QBTC - INSTALADOR Y LANZADOR
echo ==============================================
echo.

REM Verificar si Node.js está instalado
"C:\Program Files\nodejs\node.exe" --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado o no está en la ruta esperada
    echo Por favor, instala Node.js o verifica la ruta
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.

REM Instalar dependencias
echo 📦 Instalando dependencias...
"C:\Program Files\nodejs\npm.cmd" install
if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas correctamente
echo.

REM Verificar si existe el archivo .env
if not exist ".env" (
    echo ⚠️  Archivo .env no encontrado
    echo Creando archivo .env a partir de .env-example...
    copy ".env-example" ".env"
    echo ✅ Archivo .env creado
    echo.
    echo 📝 Por favor, edita el archivo .env con tus credenciales de Binance
    echo.
    pause
    exit /b 0
)

echo ✅ Archivo .env encontrado
echo.

REM Crear directorios necesarios
echo 📁 Creando directorios necesarios...
if not exist "logs" mkdir logs
if not exist "data" mkdir data
if not exist "cache" mkdir cache
echo ✅ Directorios creados
echo.

REM Cargar variables de entorno
echo 🔧 Cargando variables de entorno...
for /f "tokens=1,2 delims==" %%a in (.env) do (
    set %%a=%%b
)
echo ✅ Variables de entorno cargadas
echo.

REM Mostrar configuración
echo 📋 Configuración actual:
echo   Puerto del servidor: %SERVER_PORT%
echo   Modo Testnet: %BINANCE_TESTNET%
echo   Pares de trading: %TRADING_PAIRS%
echo   Apalancamiento: %TRADING_LEVERAGE%
echo.

REM Iniciar el bot
echo 🚀 Iniciando Bot de Futuros QBTC TANDALONES...
echo ==============================================
echo.

REM Establecer el puerto por defecto si no está definido
if "%SERVER_PORT%"=="" set SERVER_PORT=5500

REM Iniciar el servidor
"C:\Program Files\nodejs\node.exe" server.js

echo.
echo ==============================================
echo   BOT DETENIDO
echo ==============================================
pause
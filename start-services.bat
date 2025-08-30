@echo off
echo Iniciando Quantum Trading System...
echo.

cd /d "%~dp0"

echo Deteniendo procesos existentes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Limpiando puertos específicos...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4601\|:4602\|:8082\|:8083"') do (
    echo Terminando proceso %%a en puertos 4601, 4602, 8082, 8083...
    taskkill /f /pid %%a 2>nul
)
timeout /t 3 /nobreak >nul

echo Iniciando Frontend API Server (puerto 4602)...
start "Frontend API" cmd /k "node frontend-api-basic.js"

echo Iniciando Core Trading Engine (puerto 4601)...
start "Core Engine" cmd /k "node index.js"

echo Iniciando Real-time Monitor (puerto 8082)...
start "Monitor" cmd /k "node quantum-real-time-monitor.js"

echo.
echo Esperando que los servicios se inicien...
timeout /t 5 /nobreak >nul

echo.
echo Verificando puertos...
netstat -ano | findstr ":4601\|:4602\|:8082"

echo.
echo Abriendo dashboard...
start http://localhost:4602

echo.
echo Sistema iniciado correctamente!
echo - Frontend: http://localhost:4602
echo - Core: http://localhost:4601
echo - Monitor: http://localhost:8082
echo.
pause

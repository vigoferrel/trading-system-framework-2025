@echo off
echo.
echo ========================================
echo    QUANTUM TRADING HUB LAUNCHER
echo ========================================
echo.

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"

REM Change to the script directory
cd /d "%SCRIPT_DIR%"

echo Current directory: %CD%
echo.

echo Deteniendo procesos existentes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Verificando archivo quantum-hub-simple.js...
if exist "quantum-hub-simple.js" (
    echo ✅ Archivo encontrado
    echo.
    echo 🚀 Iniciando Quantum Trading Hub...
    echo.
    node quantum-hub-simple.js
) else (
    echo ❌ Error: quantum-hub-simple.js no encontrado
    echo.
    echo Archivos disponibles:
    dir *.js
    echo.
    pause
)

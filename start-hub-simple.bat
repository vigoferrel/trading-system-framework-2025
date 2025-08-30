@echo off
echo.
echo ========================================
echo    QUANTUM TRADING HUB - SIMPLE
echo ========================================
echo.

cd /d "%~dp0"

echo Deteniendo procesos existentes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Iniciando Quantum Trading Hub...
node quantum-hub-simple.js

echo.
echo Presiona cualquier tecla para continuar...
pause >nul

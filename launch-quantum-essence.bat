@echo off
echo 🌙 QBTC - Lanzando Sistema de Esencia del Mercado Cuantico
echo ========================================================
echo.

echo 🔧 Deteniendo procesos anteriores...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo.
echo 🚀 Iniciando Opportunity Master System (Core)...
start "QBTC Core" cmd /k "node opportunity-master-system-robust.js"

echo ⏳ Esperando inicializacion del core...
timeout /t 5 >nul

echo.
echo 🌊 Iniciando Frontend Quantum Essence...
start "QBTC Frontend" cmd /k "node frontend-opportunity-master.js"

echo ⏳ Esperando inicializacion del frontend...
timeout /t 3 >nul

echo.
echo ✅ Sistema iniciado correctamente!
echo.
echo 📊 URLs del Sistema:
echo    🌙 Core: http://localhost:4601
echo    🌊 Frontend: http://localhost:4603
echo.
echo 🎯 Accede a http://localhost:4603 para ver la Esencia del Mercado
echo.
echo 💡 El sistema se actualiza automaticamente cada 5 segundos
echo 💡 Presiona Ctrl+C en cualquier ventana para detener el sistema
echo.
pause

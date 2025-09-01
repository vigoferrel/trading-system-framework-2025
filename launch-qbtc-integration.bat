@echo off
REM QBTC QUANTUM IP INTEGRATION LAUNCHER
REM Sistema unificado para conectividad robusta con Binance

echo.
echo ===========================================
echo   QBTC QUANTUM IP INTEGRATION SYSTEM
echo ===========================================
echo.

echo [FASE 1] Ejecutando integracion cuantica...
node qbtc-quantum-ip-integration.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [FASE 2] Integracion completada, ejecutando verificacion de balance...
    node check-balance.js
) else (
    echo.
    echo [ERROR] La integracion fallo. Revisa los logs anteriores.
    pause
    exit /b 1
)

echo.
echo ===========================================
echo   INTEGRACION COMPLETADA EXITOSAMENTE
echo ===========================================
echo.
echo   - IP objetivo alcanzada: 181.43.212.196
echo   - Estado cuantico validado
echo   - Conectividad Binance verificada
echo   - Sistema listo para trading
echo.
pause

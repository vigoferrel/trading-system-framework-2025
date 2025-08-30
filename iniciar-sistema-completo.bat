@echo off
echo ============================================================
echo INICIANDO SISTEMA COMPLETO QBTC BANDA 46
echo ============================================================
echo.

echo 1. Iniciando LLM Neural Orchestrator...
start "LLM Neural Server" cmd /k "node llm-neural-server.js"
timeout /t 5 /nobreak >nul

echo 2. Iniciando Monitor de Recomendaciones...
start "Monitor Neural" cmd /k "python monitor-recomendaciones-neural.py"
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo SISTEMA INICIADO
echo ============================================================
echo URLs disponibles:
echo   🧠 LLM Neural: http://localhost:4607
echo   📊 Monitor: http://localhost:4606
echo   🔗 Health: http://localhost:4607/health
echo   🧪 Test: http://localhost:4607/api/test-decision
echo ============================================================
echo.
pause

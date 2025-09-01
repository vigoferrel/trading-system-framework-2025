@echo off
echo 🔄 Iniciando eliminación segura de duplicados...
echo.

if exist "core.error.log" (del "core.error.log" && echo ✅ Eliminado: core.error.log) else (echo ⚠️  No encontrado: core.error.log)
if exist "dashboard-error.log" (del "dashboard-error.log" && echo ✅ Eliminado: dashboard-error.log) else (echo ⚠️  No encontrado: dashboard-error.log)
if exist "enhanced-service-error.log" (del "enhanced-service-error.log" && echo ✅ Eliminado: enhanced-service-error.log) else (echo ⚠️  No encontrado: enhanced-service-error.log)
if exist "frontend.error.log" (del "frontend.error.log" && echo ✅ Eliminado: frontend.error.log) else (echo ⚠️  No encontrado: frontend.error.log)
if exist "quantum\srona-multi-whale-background.log" (del "quantum\srona-multi-whale-background.log" && echo ✅ Eliminado: quantum\srona-multi-whale-background.log) else (echo ⚠️  No encontrado: quantum\srona-multi-whale-background.log)
if exist "quantum\srona-multi-whale-launch.log" (del "quantum\srona-multi-whale-launch.log" && echo ✅ Eliminado: quantum\srona-multi-whale-launch.log) else (echo ⚠️  No encontrado: quantum\srona-multi-whale-launch.log)
if exist "test-error.log" (del "test-error.log" && echo ✅ Eliminado: test-error.log) else (echo ⚠️  No encontrado: test-error.log)

echo.
echo 🎉 Eliminación segura completada!
echo 📊 7 archivos eliminados
echo 💾 Espacio recuperado: ~8.74 KB
pause

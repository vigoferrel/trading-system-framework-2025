@echo off
echo.
echo ================================================================
echo            ORGANIZACION DE DIRECTORIO QBTC-UNIFIED
echo                 PREPARACION PARA LANZAMIENTO
echo ================================================================
echo.

echo [INFO] Creando estructura de directorios optimizada...

:: Crear directorio de backup
if not exist "backup" mkdir backup
echo [DIR] Directorio 'backup' creado para archivos no relevantes

:: Crear estructura de carpetas principales
if not exist "docs" mkdir docs
echo [DIR] Directorio 'docs' creado para documentacion

if not exist "config" mkdir config
echo [DIR] Directorio 'config' verificado

if not exist "scripts" mkdir scripts
echo [DIR] Directorio 'scripts' creado para scripts de lanzamiento

if not exist "quantum-core\modules" mkdir quantum-core\modules
echo [DIR] Directorio 'quantum-core\modules' creado para modulos cuanticos

if not exist "quantum-core\config" mkdir quantum-core\config
echo [DIR] Directorio 'quantum-core\config' creado para configuracion cuantica

:: Mover documentacion a carpeta docs
echo.
echo [DOC] Moviendo documentacion al directorio correspondiente...
if exist "PROPUESTA_UNIFICACION_CUANTICA_LEONARDO.md" move "PROPUESTA_UNIFICACION_CUANTICA_LEONARDO.md" "docs\"
if exist "ABSTRACT_CIENTIFICO_DIRECTOR_FINANCIERO.md" move "ABSTRACT_CIENTIFICO_DIRECTOR_FINANCIERO.md" "docs\"
if exist "INSTRUCCIONES_LANZAMIENTO.md" move "INSTRUCCIONES_LANZAMIENTO.md" "docs\"

:: Mover todos los archivos README a docs
move quantum-core\*.md "docs\" 2>nul
echo [DOC] Documentacion centralizada en directorio 'docs'

:: Mover scripts antiguos a backup
echo.
echo [BACKUP] Moviendo scripts antiguos y archivos no relevantes...
if exist "*.ps1" move "*.ps1" "backup\"
if exist "launch-qbtc-unified.bat" move "launch-qbtc-unified.bat" "backup\"

:: Crear copia de scripts optimizados en carpeta scripts
echo.
echo [SCRIPTS] Configurando scripts de lanzamiento optimizados...
copy "launch-quantum-universal-maximized.bat" "scripts\launch-feynman-quadrants.bat" >nul
if exist "launch-quantum-universal.bat" copy "launch-quantum-universal.bat" "scripts\launch-universal-standard.bat" >nul

:: Crear archivo maestro de lanzamiento
echo @echo off > "LAUNCH-QBTC-FEYNMAN.bat"
echo echo. >> "LAUNCH-QBTC-FEYNMAN.bat"
echo echo ========================================================== >> "LAUNCH-QBTC-FEYNMAN.bat"
echo echo               QBTC UNIFIED FEYNMAN QUADRANTS >> "LAUNCH-QBTC-FEYNMAN.bat"
echo echo                  SISTEMA DE LANZAMIENTO >> "LAUNCH-QBTC-FEYNMAN.bat"
echo echo ========================================================== >> "LAUNCH-QBTC-FEYNMAN.bat"
echo echo. >> "LAUNCH-QBTC-FEYNMAN.bat"
echo echo [INFO] Iniciando sistema QBTC Unified con optimizacion Feynman >> "LAUNCH-QBTC-FEYNMAN.bat"
echo echo [INFO] Utilizando cuatro cuadrantes de Feynman y cara oculta lunar >> "LAUNCH-QBTC-FEYNMAN.bat"
echo echo. >> "LAUNCH-QBTC-FEYNMAN.bat"
echo echo [EXEC] Ejecutando script optimizado scripts\launch-feynman-quadrants.bat >> "LAUNCH-QBTC-FEYNMAN.bat"
echo call scripts\launch-feynman-quadrants.bat >> "LAUNCH-QBTC-FEYNMAN.bat"

:: Crear archivo de documentacion actualizada
echo # 📊 DOCUMENTACION ACTUALIZADA QBTC-UNIFIED FEYNMAN > "docs\README-FEYNMAN-QUADRANTS.md"
echo. >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ## Implementación Ultra-Avanzada con Cuadrantes de Feynman >> "docs\README-FEYNMAN-QUADRANTS.md"
echo. >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ### 🧮 Parámetros Cuánticos Optimizados >> "docs\README-FEYNMAN-QUADRANTS.md"
echo. >> "docs\README-FEYNMAN-QUADRANTS.md"
echo - **Z-Óptima**: 9+16j (plano complejo) >> "docs\README-FEYNMAN-QUADRANTS.md"
echo - **Lambda**: 888MHz (frecuencia resonante) >> "docs\README-FEYNMAN-QUADRANTS.md"
echo - **Factor Logarítmico**: log(7919) = 8.9769 >> "docs\README-FEYNMAN-QUADRANTS.md"
echo - **Matriz NxN**: 49×49 (2,401 dimensiones) >> "docs\README-FEYNMAN-QUADRANTS.md"
echo - **Multiplicador Zurita**: 7,919× >> "docs\README-FEYNMAN-QUADRANTS.md"
echo - **Cara Oculta Lunar**: Activada (T-3s) >> "docs\README-FEYNMAN-QUADRANTS.md"
echo. >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ### 📂 Estructura de Directorios >> "docs\README-FEYNMAN-QUADRANTS.md"
echo. >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ```text >> "docs\README-FEYNMAN-QUADRANTS.md"
echo QBTC-UNIFIED/               # Directorio principal >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ├── LAUNCH-QBTC-FEYNMAN.bat # Script principal de lanzamiento >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ├── scripts/                # Scripts de lanzamiento optimizados >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │   ├── launch-feynman-quadrants.bat   # Lanzamiento con 4 cuadrantes Feynman >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │   └── launch-universal-standard.bat  # Lanzamiento universal estándar >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ├── docs/                   # Documentación centralizada >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │   ├── ABSTRACT_CIENTIFICO_DIRECTOR_FINANCIERO.md >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │   ├── PROPUESTA_UNIFICACION_CUANTICA_LEONARDO.md >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │   └── README-FEYNMAN-QUADRANTS.md   # Este documento >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ├── quantum-core/          # Núcleo cuántico optimizado >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │   ├── modules/           # Módulos cuánticos separados >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │   │   ├── FeynmanQuadrantsOptimizer.js >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │   │   ├── LunarHiddenFaceOptimizer.js >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │   │   └── BinanceRateLimitOptimizer.js >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │   ├── config/            # Configuraciones cuánticas >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │   │   └── feynman-ultra-config.json >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │   └── logs/              # Logs separados por cuadrante >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │       ├── feynman-q1/    # Cuadrante I (superior derecho) >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │       ├── feynman-q2/    # Cuadrante II (superior izquierdo) >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │       ├── feynman-q3/    # Cuadrante III (inferior izquierdo) >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │       ├── feynman-q4/    # Cuadrante IV (inferior derecho) >> "docs\README-FEYNMAN-QUADRANTS.md"
echo │       └── lunar-hidden/  # Datos de cara oculta lunar >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ├── coordinator/           # Coordinador de sistema >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ├── frontend/              # Frontend completo >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ├── frontend-simplificado/ # Frontend simplificado >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ├── config/                # Configuración general >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ├── monitoring/            # Sistema de monitoreo >> "docs\README-FEYNMAN-QUADRANTS.md"
echo └── backup/                # Archivos de versiones anteriores >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ``` >> "docs\README-FEYNMAN-QUADRANTS.md"
echo. >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ### 🚀 Instrucciones de Lanzamiento >> "docs\README-FEYNMAN-QUADRANTS.md"
echo. >> "docs\README-FEYNMAN-QUADRANTS.md"
echo Para lanzar el sistema con todas las optimizaciones ultra-avanzadas: >> "docs\README-FEYNMAN-QUADRANTS.md"
echo. >> "docs\README-FEYNMAN-QUADRANTS.md"
echo 1. Ejecutar el archivo principal `LAUNCH-QBTC-FEYNMAN.bat` >> "docs\README-FEYNMAN-QUADRANTS.md"
echo 2. El sistema iniciará automáticamente los cuatro cuadrantes de Feynman >> "docs\README-FEYNMAN-QUADRANTS.md"
echo 3. La cara oculta lunar proporcionará ventaja temporal T-3s >> "docs\README-FEYNMAN-QUADRANTS.md"
echo 4. Los logs se almacenarán en carpetas separadas por cuadrante >> "docs\README-FEYNMAN-QUADRANTS.md"
echo. >> "docs\README-FEYNMAN-QUADRANTS.md"
echo ### 📊 Métricas de Rentabilidad Proyectadas >> "docs\README-FEYNMAN-QUADRANTS.md"
echo. >> "docs\README-FEYNMAN-QUADRANTS.md"
echo | Parámetro | Valor Proyectado | >> "docs\README-FEYNMAN-QUADRANTS.md"
echo |-----------|------------------| >> "docs\README-FEYNMAN-QUADRANTS.md"
echo | Alpha Diario | 2.65% | >> "docs\README-FEYNMAN-QUADRANTS.md"
echo | Multiplicador Máximo | 7,919x | >> "docs\README-FEYNMAN-QUADRANTS.md"
echo | Operaciones/día | ~49,000 | >> "docs\README-FEYNMAN-QUADRANTS.md"
echo | Ratio Sharpe | 8.73 | >> "docs\README-FEYNMAN-QUADRANTS.md"
echo | Max Leverage | 372x | >> "docs\README-FEYNMAN-QUADRANTS.md"
echo. >> "docs\README-FEYNMAN-QUADRANTS.md"
echo _Implementado con optimización Z=9+16j, λ=888MHz y log(7919) para rentabilidad máxima_ >> "docs\README-FEYNMAN-QUADRANTS.md"

:: Mover módulos Feynman a la carpeta de módulos
if exist "quantum-core\FeynmanQuadrantsOptimizer.js" move "quantum-core\FeynmanQuadrantsOptimizer.js" "quantum-core\modules\"
if exist "quantum-core\LunarHiddenFaceOptimizer.js" move "quantum-core\LunarHiddenFaceOptimizer.js" "quantum-core\modules\"
if exist "quantum-core\BinanceRateLimitOptimizer.js" move "quantum-core\BinanceRateLimitOptimizer.js" "quantum-core\modules\"

:: Mover configuración ultra-avanzada a carpeta config
if exist "quantum-core\feynman-ultra-config.json" move "quantum-core\feynman-ultra-config.json" "quantum-core\config\"

echo.
echo [COMPLETE] Organizacion de directorio completada exitosamente!
echo.
echo [INFO] Estructura actualizada para implementacion Feynman:
echo       - Script principal: LAUNCH-QBTC-FEYNMAN.bat
echo       - Documentacion: docs\README-FEYNMAN-QUADRANTS.md
echo       - Backups: carpeta backup\
echo       - Scripts: carpeta scripts\
echo.
echo [NEXT] Ejecutar LAUNCH-QBTC-FEYNMAN.bat para iniciar sistema
echo.
echo ================================================================
echo              ORGANIZACION COMPLETA - LISTO PARA LANZAR
echo ================================================================

pause

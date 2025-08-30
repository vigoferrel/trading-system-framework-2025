@echo off
echo ========================================
echo Feynman Quantum Optimizer
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js to run this script
    pause
    exit /b 1
)

REM Change to the script directory
cd /d "%~dp0"

echo Starting Feynman Quantum Optimizer...
echo Log file will be created at: feynman-quantum-optimizer.log
echo.
echo This optimizer uses Feynman's path integral formulation to maximize
echo infinite profit space through quantum superposition and entanglement.
echo.
echo Press Ctrl+C to stop the optimizer
echo.

REM Run the Feynman quantum optimizer
node feynman-quantum-optimizer.js
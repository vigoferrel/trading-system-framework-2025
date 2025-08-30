@echo off
echo ========================================
echo Simple Quantum Optimizer
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

echo Starting Simple Quantum Optimizer...
echo Log file will be created at: simple-quantum-optimizer.log
echo.
echo Press Ctrl+C to stop the optimizer
echo.

REM Run the simple quantum optimizer
node simple-quantum-optimizer.js

echo.
echo Simple Quantum Optimizer stopped
pause
@echo off
echo ========================================
echo Quantum Profit Optimization Analyzer
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

echo Analyzing quantum system performance for profit optimization...
echo.

REM Check if analysis data exists
if not exist "quantum-system-analysis.json" (
    echo Warning: No analysis data found.
    echo Please run the quantum system in background mode first using:
    echo   batch-run-quantum-background.bat
    echo.
    pause
    exit /b 1
)

REM Run the profit optimization analyzer
node quantum-profit-optimizer.js

echo.
echo Optimization report saved to: quantum-profit-optimization-report.json
echo.
echo Review the report for detailed recommendations on profit optimization.
echo.
pause
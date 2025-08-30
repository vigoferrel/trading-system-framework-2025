@echo off
echo ========================================
echo Quantum System Background Runner
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

echo Starting Quantum System in Background Mode...
echo Log file will be created at: quantum-system-background.log
echo Analysis file will be created at: quantum-system-analysis.json
echo.
echo Press Ctrl+C to stop the system
echo.

REM Run the quantum system in background
node run-quantum-system-background.js

echo.
echo Quantum System stopped
pause
@echo off
setlocal EnableDelayedExpansion

echo ===============================
echo  Clean start (core/front/monitor)
echo ===============================

echo Cleaning Node processes...
taskkill /IM node.exe /F >NUL 2>&1

echo Freeing ports 4601 4602 8082 5000...
for %%P in (4601 4602 8082 5000) do (
  for /f "tokens=5" %%A in ('netstat -ano ^| findstr /R /C:":%%P "') do (
    echo   Killing PID %%A on port %%P
    taskkill /PID %%A /F >NUL 2>&1
  )
)

echo Ensuring PM2 installed...
where pm2 >NUL 2>&1
if errorlevel 1 (
  echo   Installing PM2 globally...
  npm i -g pm2 --loglevel=error
)

echo Starting services with PM2...
pm2 delete all --silent >NUL 2>&1
pm2 start ecosystem.config.js --only quantum-core --update-env
pm2 start ecosystem.config.js --only quantum-frontend --update-env
pm2 start ecosystem.config.js --only quantum-monitor --update-env
pm2 save >NUL 2>&1

echo Checking ports...
powershell -NoProfile -Command "4601,4602,8082 | ForEach-Object { $t=Test-NetConnection -ComputerName localhost -Port $_ -WarningAction SilentlyContinue; Write-Host ('Port ' + $_ + ': ' + ($t.TcpTestSucceeded?'OK':'FAIL')) }"

echo Health checks...
powershell -NoProfile -Command "try{(Invoke-WebRequest -UseBasicParsing http://localhost:4601/health -TimeoutSec 8).StatusCode}catch{'ERR'}; try{(Invoke-WebRequest -UseBasicParsing http://localhost:4602/api/health -TimeoutSec 8).StatusCode}catch{'ERR'}; try{(Invoke-WebRequest -UseBasicParsing http://localhost:8082/status -TimeoutSec 8).StatusCode}catch{'ERR'}"

echo Done.
exit /b 0



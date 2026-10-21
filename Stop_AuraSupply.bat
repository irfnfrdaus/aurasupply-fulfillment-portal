@echo off
title Stop AuraSupply Engine
echo Stopping AuraSupply on port 5050...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5050') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo AuraSupply server stopped successfully.
timeout /t 2 >nul
exit

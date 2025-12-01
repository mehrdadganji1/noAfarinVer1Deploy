@echo off
echo Killing user-service processes...

REM Kill all node processes on port 3002
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    echo Killing process %%a on port 3002
    taskkill /F /PID %%a 2>nul
)

REM Kill nodemon processes
taskkill /F /IM nodemon.exe 2>nul

REM Kill ts-node processes
for /f "tokens=2" %%a in ('tasklist ^| findstr "ts-node"') do (
    taskkill /F /PID %%a 2>nul
)

echo Done!
timeout /t 2 >nul

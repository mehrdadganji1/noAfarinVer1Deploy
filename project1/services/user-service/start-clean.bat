@echo off
echo Starting user-service with clean state...

REM Kill existing processes
call kill-service.bat

REM Wait a bit
timeout /t 2 >nul

REM Start the service
echo Starting service...
npm run dev

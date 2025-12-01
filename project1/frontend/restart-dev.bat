@echo off
echo Restarting Frontend Development Server...
echo.

REM Kill any existing node processes on port 5173
echo Killing existing processes on port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul

echo.
echo Clearing cache...
if exist dist rmdir /s /q dist
if exist .vite rmdir /s /q .vite
if exist node_modules\.vite rmdir /s /q node_modules\.vite

echo.
echo Starting development server...
npm run dev

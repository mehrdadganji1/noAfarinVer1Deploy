@echo off
cls
echo ========================================
echo   Starting ALL Noafarin Services
echo ========================================
echo.

REM Kill all old processes
echo [Step 1/12] Stopping old processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3003" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3004" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3005" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3006" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3007" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3008" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3009" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3010" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3011" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3012" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3013" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
echo Done!
timeout /t 2 >nul

REM Start API Gateway
echo [Step 2/12] Starting API Gateway (Port 3001)...
start "API Gateway" cmd /k "cd services\api-gateway && npm run dev"
timeout /t 3 >nul

REM Build and Start User Service (DEV MODE for development)
echo [Step 3/12] Building and Starting User Service (Port 3002)...
start "User Service" cmd /k "cd services\user-service && npm run build && npm run dev"
timeout /t 8 >nul

REM Start Application Service
echo [Step 4/12] Starting Application Service (Port 3003)...
start "Application Service" cmd /k "cd services\application-service && npm run dev"
timeout /t 2 >nul

REM Start Team Service
echo [Step 5/12] Starting Team Service (Port 3004)...
start "Team Service" cmd /k "cd services\team-service && npm run dev"
timeout /t 2 >nul

REM Start Event Service
echo [Step 6/12] Starting Event Service (Port 3005)...
start "Event Service" cmd /k "cd services\event-service && npm run dev"
timeout /t 2 >nul

REM Start Training Service
echo [Step 7/12] Starting Training Service (Port 3006)...
start "Training Service" cmd /k "cd services\training-service && npm run dev"
timeout /t 2 >nul

REM Start File Service
echo [Step 8/14] Starting File Service (Port 3007)...
start "File Service" cmd /k "cd services\file-service && npm run dev"
timeout /t 2 >nul

REM Start Funding Service
echo [Step 9/14] Starting Funding Service (Port 3008)...
start "Funding Service" cmd /k "cd services\funding-service && npm run dev"
timeout /t 2 >nul

REM Start Evaluation Service
echo [Step 10/14] Starting Evaluation Service (Port 3009)...
start "Evaluation Service" cmd /k "cd services\evaluation-service && npm run dev"
timeout /t 2 >nul

REM Start Project Service
echo [Step 11/14] Starting Project Service (Port 3010)...
start "Project Service" cmd /k "cd services\project-service && npm run dev"
timeout /t 2 >nul

REM Start XP Service
echo [Step 12/14] Starting XP Service (Port 3011)...
start "XP Service" cmd /k "cd services\xp-service && npm run dev"
timeout /t 2 >nul

REM Start Achievement Service
echo [Step 13/15] Starting Achievement Service (Port 3012)...
start "Achievement Service" cmd /k "cd services\achievement-service && npm run dev"
timeout /t 2 >nul

REM Start Learning Service
echo [Step 14/15] Starting Learning Service (Port 3013)...
start "Learning Service" cmd /k "cd services\learning-service && npm run dev"
timeout /t 2 >nul

REM Start Frontend
echo [Step 15/15] Starting Frontend (Port 5173)...
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 >nul

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Access Points:
echo   Frontend:                    http://localhost:5173
echo   API Gateway:                 http://localhost:3001
echo   --------------------------------------------------------
echo   User Service:                http://localhost:3002
echo   Application Service:         http://localhost:3003
echo   Team Service:                http://localhost:3004
echo   Event Service:               http://localhost:3005
echo   Training Service:            http://localhost:3006
echo   File Service:                http://localhost:3007
echo   Funding Service:             http://localhost:3008
echo   Evaluation Service:          http://localhost:3009
echo   Project Service:             http://localhost:3010
echo   XP Service:                  http://localhost:3011
echo   Achievement Service:         http://localhost:3012
echo.
echo ========================================
echo.
echo Waiting 15 seconds for services to initialize...
timeout /t 15 >nul

REM Test services
echo.
echo Testing services...
echo.

curl -s http://localhost:3001/health 2>nul && echo [OK] API Gateway || echo [FAIL] API Gateway
curl -s http://localhost:3002/health 2>nul && echo [OK] User Service || echo [FAIL] User Service
curl -s http://localhost:3003/health 2>nul && echo [OK] Application Service || echo [FAIL] Application Service
curl -s http://localhost:3004/health 2>nul && echo [OK] Team Service || echo [FAIL] Team Service
curl -s http://localhost:3005/health 2>nul && echo [OK] Event Service || echo [FAIL] Event Service
curl -s http://localhost:3006/health 2>nul && echo [OK] Training Service || echo [FAIL] Training Service
curl -s http://localhost:3007/health 2>nul && echo [OK] File Service || echo [FAIL] File Service
curl -s http://localhost:3008/health 2>nul && echo [OK] Funding Service || echo [FAIL] Funding Service
curl -s http://localhost:3009/health 2>nul && echo [OK] Evaluation Service || echo [FAIL] Evaluation Service
curl -s http://localhost:3010/health 2>nul && echo [OK] Project Service || echo [FAIL] Project Service
curl -s http://localhost:3011/health 2>nul && echo [OK] XP Service || echo [FAIL] XP Service
curl -s http://localhost:3012/health 2>nul && echo [OK] Achievement Service || echo [FAIL] Achievement Service
curl -s http://localhost:3013/health 2>nul && echo [OK] Learning Service || echo [FAIL] Learning Service

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
pause

# Professional Service Startup Script
# این اسکریپت تمام سرویس‌های مورد نیاز را به ترتیب راه‌اندازی می‌کند

Write-Host "`n=== Starting Noafarin Platform Services ===" -ForegroundColor Cyan
Write-Host "This will start all required services in order`n" -ForegroundColor Gray

# Function to check if port in use
function Test-Port {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $null -ne $connection
}

# Function to start a service
function Start-Service {
    param(
        [string]$Name,
        [string]$Path,
        [int]$Port,
        [string]$Color = "Green"
    )
    
    Write-Host "Starting $Name (Port $Port)..." -ForegroundColor Yellow
    
    if (Test-Port -Port $Port) {
        Write-Host "  ⚠️  Port $Port already in use, skipping" -ForegroundColor Yellow
        return
    }
    
    $process = Start-Process powershell -ArgumentList `
        "-NoExit", `
        "-Command", `
        "cd '$Path'; Write-Host '=== $Name ===' -ForegroundColor $Color; npm run dev" `
        -PassThru
    
    if ($process) {
        Write-Host "  ✓ Started (PID: $($process.Id))" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } else {
        Write-Host "  ✗ Failed to start" -ForegroundColor Red
    }
}

# Step 1: Check Docker Services
Write-Host "`n[1/5] Checking Docker Services..." -ForegroundColor Cyan
try {
    $mongodb = docker ps --filter "name=noafarin-mongodb" --format "{{.Names}}"
    $redis = docker ps --filter "name=noafarin-redis" --format "{{.Names}}"
    $rabbitmq = docker ps --filter "name=noafarin-rabbitmq" --format "{{.Names}}"
    
    if ($mongodb) { Write-Host "  ✓ MongoDB running" -ForegroundColor Green }
    else { Write-Host "  ✗ MongoDB not running - start with: docker compose up -d mongodb" -ForegroundColor Red }
    
    if ($redis) { Write-Host "  ✓ Redis running" -ForegroundColor Green }
    else { Write-Host "  ✗ Redis not running - start with: docker compose up -d redis" -ForegroundColor Red }
    
    if ($rabbitmq) { Write-Host "  ✓ RabbitMQ running" -ForegroundColor Green }
    else { Write-Host "  ✗ RabbitMQ not running - start with: docker compose up -d rabbitmq" -ForegroundColor Red }
} catch {
    Write-Host "  ✗ Docker not accessible" -ForegroundColor Red
    exit 1
}

# Step 2: Start User Service
Write-Host "`n[2/5] Starting User Service..." -ForegroundColor Cyan
Start-Service -Name "User Service" -Path "D:\programming\noafarineventir\project1\services\user-service" -Port 3001 -Color "Magenta"

# Step 3: Start API Gateway  
Write-Host "`n[3/5] Starting API Gateway..." -ForegroundColor Cyan
Start-Service -Name "API Gateway" -Path "D:\programming\noafarineventir\project1\services\api-gateway" -Port 3000 -Color "Blue"

# Step 4: Start Team Service
Write-Host "`n[4/5] Starting Team Service..." -ForegroundColor Cyan
Start-Service -Name "Team Service" -Path "D:\programming\noafarineventir\project1\services\team-service" -Port 3002 -Color "Yellow"

# Step 5: Start Event Service
Write-Host "`n[5/5] Starting Event Service..." -ForegroundColor Cyan
Start-Service -Name "Event Service" -Path "D:\programming\noafarineventir\project1\services\event-service" -Port 3003 -Color "Cyan"

# Summary
Write-Host "`n=== Services Started ===" -ForegroundColor Green
Write-Host "Wait 10-15 seconds for all services to fully initialize`n" -ForegroundColor Yellow

Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  User Service:    http://localhost:3001" -ForegroundColor Gray
Write-Host "  API Gateway:     http://localhost:3000" -ForegroundColor Gray
Write-Host "  Team Service:    http://localhost:3002" -ForegroundColor Gray
Write-Host "  Event Service:   http://localhost:3003" -ForegroundColor Gray
Write-Host "  Frontend:        http://localhost:5173`n" -ForegroundColor Gray

Write-Host "Press Ctrl+C in any service window to stop that service" -ForegroundColor Yellow
Write-Host "Run ./scripts/stop-all-services.ps1 to stop all services`n" -ForegroundColor Yellow

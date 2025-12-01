# Professional Service Stop Script

Write-Host "`n=== Stopping Noafarin Platform Services ===" -ForegroundColor Cyan

$ports = @(3001, 3000, 3002, 3003, 5173)

foreach ($port in $ports) {
    Write-Host "Checking port $port..." -ForegroundColor Yellow
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    
    if ($connections) {
        $processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $processIds) {
            try {
                $process = Get-Process -Id $procId -ErrorAction Stop
                Write-Host "  Stopping $($process.ProcessName) (PID: $procId)" -ForegroundColor Gray
                Stop-Process -Id $procId -Force -ErrorAction Stop
                Write-Host "  ✓ Stopped" -ForegroundColor Green
            } catch {
                Write-Host "  ✗ Could not stop PID $procId" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "  - No process on port $port" -ForegroundColor Gray
    }
}

Write-Host "`n✓ All services stopped`n" -ForegroundColor Green

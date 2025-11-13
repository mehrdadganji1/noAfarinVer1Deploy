$body = @{
    title = "تست رویداد"
    description = "این یک تست است"
    type = "workshop"
    date = "2025-11-10T12:00:00.000Z"
    time = "12:00"
    duration = 2
    capacity = 50
    location = "تهران"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzA2NjcxNzNiNjk1YmFjNTNhNDY4ZSIsImVtYWlsIjoiYWRtaW5Abm9hZmFyaW4uY29tIiwicm9sZSI6WyJhZG1pbiJdLCJpYXQiOjE3MzEyMzYyNzksImV4cCI6MTczMTMyMjY3OX0.S7gqZ1yOgKgPc3cqf0bWnzGpfm-EaOkE8YJ52LV8e0U"
}

Write-Host "📤 Sending POST request to http://localhost:3000/api/events" -ForegroundColor Cyan
Write-Host "Body: $body" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/events" -Method POST -Body $body -Headers $headers -UseBasicParsing
    Write-Host "✅ Success! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error! Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

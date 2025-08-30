Start-Sleep -Seconds 2

Write-Host "🌌 Probando LLM Gemini Supreme Orchestrator..."
Write-Host "📡 Enviando solicitud de optimización inteligente..."

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4602/optimize-intelligent" -Method POST -ContentType "application/json" -Body '{"budgetUSD":1000}'
    
    Write-Host "✅ Respuesta recibida exitosamente:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "❌ Error en la petición: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Probando también endpoint de health check..."
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:4602/health" -Method GET
    Write-Host "💚 Health check:" -ForegroundColor Green
    $healthResponse | ConvertTo-Json
} catch {
    Write-Host "❌ Error en health check: $($_.Exception.Message)" -ForegroundColor Red
}

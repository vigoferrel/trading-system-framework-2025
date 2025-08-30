# Script para gestionar el servidor MCP de Brave
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("http", "stdio", "inspector", "stop")]
    [string]$Mode = "http",
    
    [Parameter(Mandatory=$false)]
    [int]$Port = 9847,
    
    [Parameter(Mandatory=$false)]
    [string]$Host = "localhost"
)

# Configuración
$env:BRAVE_API_KEY = "BSAbyAOvF7e6oYTnvUesQ3kfVXquNvL"

Write-Host "=== Brave Search MCP Server Manager ===" -ForegroundColor Green

switch ($Mode) {
    "http" {
        Write-Host "Iniciando servidor HTTP en puerto $Port..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Servidor MCP Brave ejecutándose en http://$Host`:$Port/mcp' -ForegroundColor Green; brave-search-mcp-server --brave-api-key '$env:BRAVE_API_KEY' --port $Port --host $Host"
        Write-Host "Servidor iniciado en segundo plano. URL: http://$Host`:$Port/mcp" -ForegroundColor Green
        Write-Host "Endpoint de prueba: http://$Host`:$Port/ping" -ForegroundColor Cyan
    }
    
    "stdio" {
        Write-Host "Iniciando servidor STDIO..." -ForegroundColor Yellow
        brave-search-mcp-server --transport stdio --brave-api-key $env:BRAVE_API_KEY
    }
    
    "inspector" {
        Write-Host "Iniciando MCP Inspector..." -ForegroundColor Yellow
        $inspectorPath = "C:\Users\DELL\AppData\Roaming\npm\node_modules\@brave\brave-search-mcp-server"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$inspectorPath'; npx @modelcontextprotocol/inspector node dist/index.js --brave-api-key '$env:BRAVE_API_KEY' --transport stdio"
    }
    
    "stop" {
        Write-Host "Deteniendo procesos de brave-search-mcp-server..." -ForegroundColor Red
        Get-Process | Where-Object { $_.ProcessName -like "*brave*" -or $_.CommandLine -like "*brave-search-mcp-server*" } | Stop-Process -Force
        Write-Host "Procesos detenidos." -ForegroundColor Green
    }
}

Write-Host "`nHerramientas MCP disponibles:" -ForegroundColor Cyan
Write-Host "  • brave_web_search - Búsqueda web con IA" -ForegroundColor White
Write-Host "  • brave_local_search - Búsqueda de negocios locales" -ForegroundColor White
Write-Host "  • brave_image_search - Búsqueda de imágenes" -ForegroundColor White
Write-Host "  • brave_video_search - Búsqueda de videos" -ForegroundColor White
Write-Host "  • brave_news_search - Búsqueda de noticias" -ForegroundColor White
Write-Host "  • brave_summarizer - Resúmenes IA de páginas" -ForegroundColor White

Write-Host "`nEjemplos de uso del script:" -ForegroundColor Cyan
Write-Host "  .\start-brave-mcp.ps1 -Mode http -Port 9847" -ForegroundColor Gray
Write-Host "  .\start-brave-mcp.ps1 -Mode stdio" -ForegroundColor Gray
Write-Host "  .\start-brave-mcp.ps1 -Mode inspector" -ForegroundColor Gray
Write-Host "  .\start-brave-mcp.ps1 -Mode stop" -ForegroundColor Gray

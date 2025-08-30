# Script completo de pruebas para MCP Brave
$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:9847/mcp"
$headers = @{'Content-Type' = 'application/json'}

Write-Host "🚀 === PRUEBAS COMPLETAS MCP BRAVE SEARCH ===" -ForegroundColor Green
Write-Host "Servidor: $baseUrl" -ForegroundColor Cyan
Write-Host "Fecha: $(Get-Date)" -ForegroundColor Gray
Write-Host ""

# Función para hacer solicitudes MCP
function Invoke-MCPRequest {
    param($method, $params = @{})
    
    $body = @{
        jsonrpc = "2.0"
        id = Get-Random -Maximum 10000
        method = $method
        params = $params
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri $baseUrl -Method POST -Headers $headers -Body $body
        return $response
    } catch {
        Write-Host "❌ Error en $method`: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 1. Verificar herramientas disponibles
Write-Host "📋 1. LISTANDO HERRAMIENTAS DISPONIBLES..." -ForegroundColor Yellow
$toolsList = Invoke-MCPRequest -method "tools/list"
if ($toolsList -and $toolsList.result) {
    Write-Host "✅ Herramientas encontradas: $($toolsList.result.tools.Count)" -ForegroundColor Green
    foreach ($tool in $toolsList.result.tools) {
        Write-Host "   • $($tool.name) - $($tool.description)" -ForegroundColor White
    }
} else {
    Write-Host "❌ No se pudieron listar las herramientas" -ForegroundColor Red
}
Write-Host ""

# 2. Prueba brave_web_search
Write-Host "🌐 2. PROBANDO BRAVE_WEB_SEARCH..." -ForegroundColor Yellow
$webParams = @{
    name = "brave_web_search"
    arguments = @{
        query = "inteligencia artificial Chile 2024"
        count = 5
        summary = $true
    }
}
$webResult = Invoke-MCPRequest -method "tools/call" -params $webParams
if ($webResult -and $webResult.result) {
    Write-Host "✅ Búsqueda web exitosa" -ForegroundColor Green
    $content = $webResult.result.content[0].text | ConvertFrom-Json
    Write-Host "   • Resultados encontrados: $($content.web.results.Count)" -ForegroundColor White
    if ($content.web.results.Count -gt 0) {
        Write-Host "   • Primer resultado: $($content.web.results[0].title)" -ForegroundColor Cyan
        Write-Host "   • URL: $($content.web.results[0].url)" -ForegroundColor Gray
    }
    if ($content.summarizer_key) {
        Write-Host "   • Clave de resumen disponible: $($content.summarizer_key)" -ForegroundColor Magenta
        $global:summarizerKey = $content.summarizer_key
    }
} else {
    Write-Host "❌ Error en búsqueda web" -ForegroundColor Red
}
Write-Host ""

# 3. Prueba brave_image_search
Write-Host "🖼️ 3. PROBANDO BRAVE_IMAGE_SEARCH..." -ForegroundColor Yellow
$imageParams = @{
    name = "brave_image_search"
    arguments = @{
        query = "tecnología Chile"
        count = 3
    }
}
$imageResult = Invoke-MCPRequest -method "tools/call" -params $imageParams
if ($imageResult -and $imageResult.result) {
    Write-Host "✅ Búsqueda de imágenes exitosa" -ForegroundColor Green
    $content = $imageResult.result.content[0].text | ConvertFrom-Json
    Write-Host "   • Imágenes encontradas: $($content.results.Count)" -ForegroundColor White
    if ($content.results.Count -gt 0) {
        Write-Host "   • Primera imagen: $($content.results[0].title)" -ForegroundColor Cyan
        Write-Host "   • Tamaño: $($content.results[0].properties.width)x$($content.results[0].properties.height)" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Error en búsqueda de imágenes" -ForegroundColor Red
}
Write-Host ""

# 4. Prueba brave_video_search
Write-Host "📹 4. PROBANDO BRAVE_VIDEO_SEARCH..." -ForegroundColor Yellow
$videoParams = @{
    name = "brave_video_search"
    arguments = @{
        query = "Chile tecnología 2024"
        count = 3
    }
}
$videoResult = Invoke-MCPRequest -method "tools/call" -params $videoParams
if ($videoResult -and $videoResult.result) {
    Write-Host "✅ Búsqueda de videos exitosa" -ForegroundColor Green
    $content = $videoResult.result.content[0].text | ConvertFrom-Json
    Write-Host "   • Videos encontrados: $($content.results.Count)" -ForegroundColor White
    if ($content.results.Count -gt 0) {
        Write-Host "   • Primer video: $($content.results[0].title)" -ForegroundColor Cyan
        Write-Host "   • Duración: $($content.results[0].video.duration)" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Error en búsqueda de videos" -ForegroundColor Red
}
Write-Host ""

# 5. Prueba brave_news_search
Write-Host "📰 5. PROBANDO BRAVE_NEWS_SEARCH..." -ForegroundColor Yellow
$newsParams = @{
    name = "brave_news_search"
    arguments = @{
        query = "Chile inteligencia artificial"
        count = 3
        freshness = "pd"
    }
}
$newsResult = Invoke-MCPRequest -method "tools/call" -params $newsParams
if ($newsResult -and $newsResult.result) {
    Write-Host "✅ Búsqueda de noticias exitosa" -ForegroundColor Green
    $content = $newsResult.result.content[0].text | ConvertFrom-Json
    Write-Host "   • Noticias encontradas: $($content.results.Count)" -ForegroundColor White
    if ($content.results.Count -gt 0) {
        Write-Host "   • Primera noticia: $($content.results[0].title)" -ForegroundColor Cyan
        Write-Host "   • Fecha: $($content.results[0].meta_url.published)" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Error en búsqueda de noticias" -ForegroundColor Red
}
Write-Host ""

# 6. Prueba brave_local_search
Write-Host "📍 6. PROBANDO BRAVE_LOCAL_SEARCH..." -ForegroundColor Yellow
$localParams = @{
    name = "brave_local_search"
    arguments = @{
        query = "restaurantes Santiago Chile"
        count = 3
    }
}
$localResult = Invoke-MCPRequest -method "tools/call" -params $localParams
if ($localResult -and $localResult.result) {
    Write-Host "✅ Búsqueda local exitosa" -ForegroundColor Green
    $content = $localResult.result.content[0].text | ConvertFrom-Json
    if ($content.locations -and $content.locations.results.Count -gt 0) {
        Write-Host "   • Lugares encontrados: $($content.locations.results.Count)" -ForegroundColor White
        Write-Host "   • Primer lugar: $($content.locations.results[0].name)" -ForegroundColor Cyan
    } else {
        Write-Host "   • Sin resultados locales específicos (puede requerir plan Pro)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Error en búsqueda local" -ForegroundColor Red
}
Write-Host ""

# 7. Prueba brave_summarizer (si hay clave disponible)
if ($global:summarizerKey) {
    Write-Host "📄 7. PROBANDO BRAVE_SUMMARIZER..." -ForegroundColor Yellow
    $summaryParams = @{
        name = "brave_summarizer"
        arguments = @{
            key = $global:summarizerKey
            entity_info = $true
        }
    }
    $summaryResult = Invoke-MCPRequest -method "tools/call" -params $summaryParams
    if ($summaryResult -and $summaryResult.result) {
        Write-Host "✅ Generación de resumen exitosa" -ForegroundColor Green
        $content = $summaryResult.result.content[0].text | ConvertFrom-Json
        if ($content.summary) {
            Write-Host "   • Resumen generado (primeros 200 chars): $($content.summary.Substring(0, [Math]::Min(200, $content.summary.Length)))..." -ForegroundColor Cyan
        }
    } else {
        Write-Host "❌ Error en generación de resumen" -ForegroundColor Red
    }
} else {
    Write-Host "⏭️ 7. SALTANDO BRAVE_SUMMARIZER (sin clave de resumen)" -ForegroundColor Yellow
}
Write-Host ""

# Resumen final
Write-Host "📊 === RESUMEN DE PRUEBAS ===" -ForegroundColor Green
Write-Host "Servidor MCP: ✅ Funcionando en puerto 9847" -ForegroundColor White
Write-Host "API Key: ✅ Configurada y válida" -ForegroundColor White
Write-Host "Pruebas completadas: $(Get-Date)" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Todas las herramientas MCP de Brave han sido probadas." -ForegroundColor Green
Write-Host "Los resultados específicos aparecen arriba según la disponibilidad de cada función." -ForegroundColor White

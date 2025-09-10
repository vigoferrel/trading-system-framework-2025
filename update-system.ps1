# TRADING SYSTEM FRAMEWORK 2025 - Sistema de Actualización Automática
# Este script mantiene el sistema optimizado y actualizado automáticamente

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("full", "quick", "docs", "dependencies", "tests")]
    [string]$UpdateType = "quick",
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 TRADING SYSTEM FRAMEWORK 2025 - SISTEMA DE ACTUALIZACIÓN" -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "Tipo de actualización: $UpdateType" -ForegroundColor Yellow
Write-Host ""

function Write-Step {
    param([string]$Message, [string]$Color = "Green")
    Write-Host "✅ $Message" -ForegroundColor $Color
}

function Write-Info {
    param([string]$Message)
    if ($Verbose) {
        Write-Host "ℹ️  $Message" -ForegroundColor Blue
    }
}

function Update-Dependencies {
    Write-Step "Actualizando dependencias de Node.js..."
    Write-Info "Verificando package.json y package-lock.json"
    
    if (Test-Path "package.json") {
        npm audit fix --force
        npm update
        Write-Step "Dependencias actualizadas"
    } else {
        Write-Host "⚠️  package.json no encontrado" -ForegroundColor Yellow
    }
}

function Update-Documentation {
    Write-Step "Verificando y actualizando documentación..."
    
    $docs = @("README.md", "QUICK-START-GUIDE.md", "TECHNICAL-ARCHITECTURE.md", "COMMERCIAL-APPLICATIONS.md")
    
    foreach ($doc in $docs) {
        if (Test-Path $doc) {
            $content = Get-Content $doc -Raw
            $updated = $content -replace "última actualización:.*", "última actualización: $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
            Set-Content $doc -Value $updated -NoNewline
            Write-Info "Actualizado: $doc"
        }
    }
    
    Write-Step "Documentación actualizada"
}

function Run-Tests {
    Write-Step "Ejecutando suite de pruebas..."
    
    if (Test-Path "tests") {
        Write-Info "Ejecutando pruebas unitarias"
        npm test
        Write-Step "Pruebas completadas"
    } else {
        Write-Host "⚠️  Directorio tests/ no encontrado" -ForegroundColor Yellow
    }
}

function Optimize-Repository {
    Write-Step "Optimizando estructura del repositorio..."
    
    # Limpiar archivos temporales si existen
    $tempFiles = @("*.tmp", "*.log", "*.bak", "node_modules/.cache", ".npm")
    foreach ($pattern in $tempFiles) {
        Get-ChildItem -Path . -Recurse -Name $pattern -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
    }
    
    Write-Info "Archivos temporales limpiados"
    Write-Step "Repositorio optimizado"
}

function Update-GitInfo {
    Write-Step "Actualizando información de Git..."
    
    try {
        $gitStatus = git status --porcelain
        if ($gitStatus) {
            Write-Host "📝 Cambios detectados en el repositorio:" -ForegroundColor Yellow
            git status --short
        } else {
            Write-Info "Repositorio limpio - no hay cambios pendientes"
        }
        
        $lastCommit = git log -1 --pretty=format:"%h - %s (%cr)"
        Write-Info "Último commit: $lastCommit"
        
        Write-Step "Información de Git actualizada"
    } catch {
        Write-Host "⚠️  Error al acceder a Git: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

function Show-SystemStatus {
    Write-Host ""
    Write-Host "📊 ESTADO DEL SISTEMA ACTUALIZADO:" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan
    
    # Estructura de archivos
    $essential = @("README.md", "package.json", "LICENSE", ".gitignore")
    Write-Host "📄 Archivos esenciales:" -ForegroundColor White
    foreach ($file in $essential) {
        if (Test-Path $file) {
            $size = (Get-Item $file).Length
            Write-Host "  ✅ $file ($([math]::Round($size/1KB, 2)) KB)" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $file (faltante)" -ForegroundColor Red
        }
    }
    
    # Directorios core
    $dirs = @("src", "tests", "docs", "demo")
    Write-Host "📁 Directorios core:" -ForegroundColor White
    foreach ($dir in $dirs) {
        if (Test-Path $dir) {
            $fileCount = (Get-ChildItem $dir -Recurse -File).Count
            Write-Host "  ✅ $dir ($fileCount archivos)" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $dir (faltante)" -ForegroundColor Red
        }
    }
    
    # Información del proyecto
    if (Test-Path "package.json") {
        $packageInfo = Get-Content "package.json" | ConvertFrom-Json
        Write-Host "🏷️  Proyecto: $($packageInfo.name) v$($packageInfo.version)" -ForegroundColor White
        Write-Host "📋 Descripción: $($packageInfo.description)" -ForegroundColor White
    }
}

# EJECUCIÓN PRINCIPAL
try {
    switch ($UpdateType) {
        "full" {
            Update-Dependencies
            Update-Documentation
            Run-Tests
            Optimize-Repository
            Update-GitInfo
        }
        "quick" {
            Update-Documentation
            Optimize-Repository
            Update-GitInfo
        }
        "docs" {
            Update-Documentation
        }
        "dependencies" {
            Update-Dependencies
        }
        "tests" {
            Run-Tests
        }
    }
    
    Show-SystemStatus
    
    Write-Host ""
    Write-Host "🎉 ACTUALIZACIÓN COMPLETADA EXITOSAMENTE" -ForegroundColor Green
    Write-Host "Tipo: $UpdateType | Hora: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "❌ ERROR DURANTE LA ACTUALIZACIÓN:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

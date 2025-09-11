# TRADING SYSTEM FRAMEWORK 2025 - Sistema de Actualizacion Automatica
# Este script mantiene el sistema optimizado y actualizado automaticamente

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("full", "quick", "docs", "status")]
    [string]$UpdateType = "quick"
)

Write-Host "TRADING SYSTEM FRAMEWORK 2025 - SISTEMA DE ACTUALIZACION" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Tipo de actualizacion: $UpdateType" -ForegroundColor Yellow
Write-Host ""

function Update-Documentation {
    Write-Host "Verificando documentacion..." -ForegroundColor Green
    
    $docs = @("README.md", "QUICK-START-GUIDE.md", "TECHNICAL-ARCHITECTURE.md", "COMMERCIAL-APPLICATIONS.md")
    
    foreach ($doc in $docs) {
        if (Test-Path $doc) {
            Write-Host "  OK: $doc" -ForegroundColor Green
        } else {
            Write-Host "  MISSING: $doc" -ForegroundColor Yellow
        }
    }
}

function Optimize-Repository {
    Write-Host "Optimizando repositorio..." -ForegroundColor Green
    
    # Limpiar archivos temporales
    $tempPatterns = @("*.tmp", "*.bak", "*.log")
    foreach ($pattern in $tempPatterns) {
        $files = Get-ChildItem -Path . -Name $pattern -ErrorAction SilentlyContinue
        if ($files) {
            Remove-Item $pattern -Force -ErrorAction SilentlyContinue
            Write-Host "  Limpiados: $pattern" -ForegroundColor Blue
        }
    }
}

function Show-SystemStatus {
    Write-Host ""
    Write-Host "ESTADO DEL SISTEMA:" -ForegroundColor Cyan
    Write-Host "==================" -ForegroundColor Cyan
    
    # Archivos esenciales
    $essential = @("README.md", "package.json", "LICENSE", ".gitignore")
    Write-Host "Archivos esenciales:" -ForegroundColor White
    foreach ($file in $essential) {
        if (Test-Path $file) {
            $size = (Get-Item $file).Length
            $sizeKB = [math]::Round($size/1KB, 2)
            Write-Host "  OK: $file ($sizeKB KB)" -ForegroundColor Green
        } else {
            Write-Host "  MISSING: $file" -ForegroundColor Red
        }
    }
    
    # Directorios core
    $dirs = @("src", "tests", "docs", "demo")
    Write-Host "Directorios core:" -ForegroundColor White
    foreach ($dir in $dirs) {
        if (Test-Path $dir) {
            $fileCount = (Get-ChildItem $dir -Recurse -File -ErrorAction SilentlyContinue).Count
            Write-Host "  OK: $dir ($fileCount archivos)" -ForegroundColor Green
        } else {
            Write-Host "  MISSING: $dir" -ForegroundColor Red
        }
    }
    
    # Informacion del proyecto
    if (Test-Path "package.json") {
        try {
            $packageInfo = Get-Content "package.json" | ConvertFrom-Json
            Write-Host "Proyecto: $($packageInfo.name) v$($packageInfo.version)" -ForegroundColor White
            Write-Host "Descripcion: $($packageInfo.description)" -ForegroundColor White
        } catch {
            Write-Host "Error leyendo package.json" -ForegroundColor Yellow
        }
    }
}

function Update-GitInfo {
    Write-Host "Verificando estado de Git..." -ForegroundColor Green
    
    try {
        $gitStatus = git status --porcelain 2>$null
        if ($gitStatus) {
            Write-Host "Cambios detectados:" -ForegroundColor Yellow
            git status --short
        } else {
            Write-Host "  Repositorio limpio" -ForegroundColor Green
        }
        
        $lastCommit = git log -1 --pretty=format:"%h - %s (%cr)" 2>$null
        if ($lastCommit) {
            Write-Host "Ultimo commit: $lastCommit" -ForegroundColor Blue
        }
    } catch {
        Write-Host "Error accediendo a Git" -ForegroundColor Yellow
    }
}

# EJECUCION PRINCIPAL
try {
    switch ($UpdateType) {
        "full" {
            Update-Documentation
            Optimize-Repository
            Update-GitInfo
            Show-SystemStatus
        }
        "quick" {
            Update-Documentation
            Optimize-Repository
            Update-GitInfo
        }
        "docs" {
            Update-Documentation
        }
        "status" {
            Show-SystemStatus
        }
    }
    
    if ($UpdateType -ne "status") {
        Show-SystemStatus
    }
    
    Write-Host ""
    Write-Host "ACTUALIZACION COMPLETADA" -ForegroundColor Green
    Write-Host "Tipo: $UpdateType | Hora: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "ERROR DURANTE LA ACTUALIZACION:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

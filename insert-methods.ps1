$content = Get-Content -Path '.\frontend-api.js' -Raw
$newMethods = Get-Content -Path '.\frontend-api.js.methods' -Raw

# Encontrar el punto de inserción (justo antes del último corchete de cierre de la clase)
$insertPoint = $content.LastIndexOf('}')

# Insertar los nuevos métodos
$newContent = $content.Substring(0, $insertPoint) + $newMethods + $content.Substring($insertPoint)

# Guardar el archivo modificado
$newContent | Out-File -FilePath '.\frontend-api.js.new' -Encoding utf8

Write-Host "Archivo frontend-api.js.new creado con los nuevos métodos" -ForegroundColor Green

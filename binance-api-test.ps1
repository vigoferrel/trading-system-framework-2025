# =============================================================================
# Binance API Test Script with HMAC SHA256 Signature
# =============================================================================
# Este script permite realizar pruebas manuales contra la API de Binance
# Implementa firma HMAC SHA256 para operaciones seguras
# =============================================================================

param (
    [string]$ApiKey = "",
    [string]$SecretKey = "",
    [string]$BaseUrl = "https://api.binance.com",
    [bool]$TestNet = $false,
    [string]$Symbol = "BTCUSDT"
)

# Configuración
if ($TestNet) {
    $BaseUrl = "https://testnet.binance.vision"
    Write-Host "🔬 Usando Binance TestNet" -ForegroundColor Yellow
}

# Función para generar firma HMAC SHA256
function Get-HmacSignature {
    param (
        [string]$secretKey,
        [string]$data
    )
    
    $secretBytes = [System.Text.Encoding]::UTF8.GetBytes($secretKey)
    $dataBytes = [System.Text.Encoding]::UTF8.GetBytes($data)
    
    $hmac = New-Object System.Security.Cryptography.HMACSHA256
    $hmac.Key = $secretBytes
    
    $signatureBytes = $hmac.ComputeHash($dataBytes)
    $signature = [System.BitConverter]::ToString($signatureBytes).Replace("-", "").ToLower()
    
    return $signature
}

# Función para obtener timestamp en milisegundos
function Get-Timestamp {
    return [Math]::Floor((Get-Date).ToUniversalTime().Subtract((Get-Date "1/1/1970")).TotalMilliseconds)
}

# Función para realizar solicitudes GET a la API
function Invoke-BinanceGetRequest {
    param (
        [string]$endpoint,
        [hashtable]$params = @{}
    )
    
    $timestamp = Get-Timestamp
    $params["timestamp"] = $timestamp
    
    # Construir query string
    $queryString = ""
    foreach ($key in $params.Keys) {
        if ($queryString -ne "") {
            $queryString += "&"
        }
        $queryString += "$key=$($params[$key])"
    }
    
    # Generar firma
    $signature = Get-HmacSignature -secretKey $SecretKey -data $queryString
    
    # URL completa
    $url = "$BaseUrl$endpoint?$queryString&signature=$signature"
    
    Write-Host "📡 Enviando solicitud a: $url" -ForegroundColor Cyan
    
    try {
        $headers = @{
            "X-MBX-APIKEY" = $ApiKey
        }
        
        $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        return $response
    }
    catch {
        Write-Host "❌ Error en la solicitud: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $responseStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($responseStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "🔍 Detalles del error: $errorBody" -ForegroundColor Red
        }
        return $null
    }
}

# Función para realizar solicitudes POST a la API
function Invoke-BinancePostRequest {
    param (
        [string]$endpoint,
        [hashtable]$params = @{}
    )
    
    $timestamp = Get-Timestamp
    $params["timestamp"] = $timestamp
    
    # Construir query string
    $queryString = ""
    foreach ($key in $params.Keys) {
        if ($queryString -ne "") {
            $queryString += "&"
        }
        $queryString += "$key=$($params[$key])"
    }
    
    # Generar firma
    $signature = Get-HmacSignature -secretKey $SecretKey -data $queryString
    
    # URL completa
    $url = "$BaseUrl$endpoint"
    
    Write-Host "📡 Enviando solicitud POST a: $url" -ForegroundColor Cyan
    Write-Host "📋 Parámetros: $queryString&signature=$signature" -ForegroundColor Cyan
    
    try {
        $headers = @{
            "X-MBX-APIKEY" = $ApiKey
            "Content-Type" = "application/x-www-form-urlencoded"
        }
        
        $body = "$queryString&signature=$signature"
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
        return $response
    }
    catch {
        Write-Host "❌ Error en la solicitud: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $responseStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($responseStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "🔍 Detalles del error: $errorBody" -ForegroundColor Red
        }
        return $null
    }
}

# Función para realizar solicitudes DELETE a la API
function Invoke-BinanceDeleteRequest {
    param (
        [string]$endpoint,
        [hashtable]$params = @{}
    )
    
    $timestamp = Get-Timestamp
    $params["timestamp"] = $timestamp
    
    # Construir query string
    $queryString = ""
    foreach ($key in $params.Keys) {
        if ($queryString -ne "") {
            $queryString += "&"
        }
        $queryString += "$key=$($params[$key])"
    }
    
    # Generar firma
    $signature = Get-HmacSignature -secretKey $SecretKey -data $queryString
    
    # URL completa
    $url = "$BaseUrl$endpoint?$queryString&signature=$signature"
    
    Write-Host "📡 Enviando solicitud DELETE a: $url" -ForegroundColor Cyan
    
    try {
        $headers = @{
            "X-MBX-APIKEY" = $ApiKey
        }
        
        $response = Invoke-RestMethod -Uri $url -Method Delete -Headers $headers
        return $response
    }
    catch {
        Write-Host "❌ Error en la solicitud: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $responseStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($responseStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "🔍 Detalles del error: $errorBody" -ForegroundColor Red
        }
        return $null
    }
}

# Función para mostrar resultados de forma formateada
function Show-Results {
    param (
        [object]$data,
        [string]$title
    )
    
    Write-Host "`n📊 $title" -ForegroundColor Green
    Write-Host "=" * 50 -ForegroundColor Green
    
    if ($data -eq $null) {
        Write-Host "❌ No se recibieron datos" -ForegroundColor Red
        return
    }
    
    if ($data -is [array]) {
        Write-Host "📋 Recibidos $($data.Length) elementos" -ForegroundColor Yellow
        if ($data.Length -gt 0 -and $data[0] -is [hashtable]) {
            # Mostrar primeros 5 elementos como tabla
            $data | Select-Object -First 5 | Format-Table -AutoSize
        }
    }
    elseif ($data -is [hashtable]) {
        $data | Format-Table -AutoSize
    }
    else {
        Write-Host $data
    }
}

# Función para probar endpoints públicos (sin firma)
function Test-PublicEndpoints {
    Write-Host "`n🌐 Probando endpoints públicos (sin firma)" -ForegroundColor Magenta
    Write-Host "=" * 60 -ForegroundColor Magenta
    
    # Obtener tiempo del servidor
    try {
        $serverTime = Invoke-RestMethod -Uri "$BaseUrl/api/v3/time"
        Write-Host "⏰ Tiempo del servidor: $($serverTime.serverTime)" -ForegroundColor White
    }
    catch {
        Write-Host "❌ Error al obtener tiempo del servidor: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Obtener información de exchange
    try {
        $exchangeInfo = Invoke-RestMethod -Uri "$BaseUrl/api/v3/exchangeInfo"
        Write-Host "📊 ExchangeInfo: $($exchangeInfo.timezone) - $($exchangeInfo.symbols.Count) símbolos" -ForegroundColor White
    }
    catch {
        Write-Host "❌ Error al obtener información de exchange: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Obtener precio del símbolo
    try {
        $price = Invoke-RestMethod -Uri "$BaseUrl/api/v3/ticker/price?symbol=$Symbol"
        Write-Host "💰 Precio de $Symbol`: $($price.price)" -ForegroundColor White
    }
    catch {
        Write-Host "❌ Error al obtener precio: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Obtener libro de órdenes
    try {
        $orderBook = Invoke-RestMethod -Uri "$BaseUrl/api/v3/depth?symbol=$Symbol&limit=5"
        Write-Host "📖 Libro de órdenes para $Symbol" -ForegroundColor White
        Write-Host "   Mejores bids: $($orderBook.bids[0])" -ForegroundColor White
        Write-Host "   Mejores asks: $($orderBook.asks[0])" -ForegroundColor White
    }
    catch {
        Write-Host "❌ Error al obtener libro de órdenes: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Función para probar endpoints privados (con firma)
function Test-PrivateEndpoints {
    if ([string]::IsNullOrEmpty($ApiKey) -or [string]::IsNullOrEmpty($SecretKey)) {
        Write-Host "⚠️  Se requiere API Key y Secret Key para probar endpoints privados" -ForegroundColor Yellow
        return
    }
    
    Write-Host "`n🔐 Probando endpoints privados (con firma)" -ForegroundColor Magenta
    Write-Host "=" * 60 -ForegroundColor Magenta
    
    # Obtener información de cuenta
    $accountInfo = Invoke-BinanceGetRequest -endpoint "/api/v3/account"
    Show-Results -data $accountInfo -title "Información de cuenta"
    
    # Obtener balance de cuenta
    $balance = Invoke-BinanceGetRequest -endpoint "/api/v3/account"
    if ($balance -ne $null -and $balance.balances -ne $null) {
        $nonZeroBalances = $balance.balances | Where-Object { [double]$_.free -gt 0 -or [double]$_.locked -gt 0 }
        Show-Results -data $nonZeroBalances -title "Balances no nulos"
    }
    
    # Obtener órdenes abiertas
    $openOrders = Invoke-BinanceGetRequest -endpoint "/api/v3/openOrders" -params @{ "symbol" = $Symbol }
    Show-Results -data $openOrders -title "Órdenes abiertas para $Symbol"
    
    # Obtener historial de órdenes
    $orderHistory = Invoke-BinanceGetRequest -endpoint "/api/v3/allOrders" -params @{ "symbol" = $Symbol; "limit" = 5 }
    Show-Results -data $orderHistory -title "Historial de órdenes para $Symbol (últimas 5)"
    
    # Obtener trades recientes
    $myTrades = Invoke-BinanceGetRequest -endpoint "/api/v3/myTrades" -params @{ "symbol" = $Symbol; "limit" = 5 }
    Show-Results -data $myTrades -title "Trades recientes para $Symbol (últimos 5)"
}

# Función para probar operaciones de trading
function Test-TradingOperations {
    if ([string]::IsNullOrEmpty($ApiKey) -or [string]::IsNullOrEmpty($SecretKey)) {
        Write-Host "⚠️  Se requiere API Key y Secret Key para probar operaciones de trading" -ForegroundColor Yellow
        return
    }
    
    Write-Host "`n💼 Probando operaciones de trading" -ForegroundColor Magenta
    Write-Host "=" * 60 -ForegroundColor Magenta
    
    # Obtener información del símbolo para determinar filtros
    try {
        $exchangeInfo = Invoke-RestMethod -Uri "$BaseUrl/api/v3/exchangeInfo"
        $symbolInfo = $exchangeInfo.symbols | Where-Object { $_.symbol -eq $Symbol }
        
        if ($symbolInfo -eq $null) {
            Write-Host "❌ Símbolo $Symbol no encontrado" -ForegroundColor Red
            return
        }
        
        Write-Host "ℹ️  Información del símbolo $Symbol" -ForegroundColor White
        Write-Host "   Status: $($symbolInfo.status)" -ForegroundColor White
        Write-Host "   Base Asset: $($symbolInfo.baseAsset)" -ForegroundColor White
        Write-Host "   Quote Asset: $($symbolInfo.quoteAsset)" -ForegroundColor White
        
        # Mostrar filtros relevantes
        $priceFilter = $symbolInfo.filters | Where-Object { $_.filterType -eq "PRICE_FILTER" }
        $lotSizeFilter = $symbolInfo.filters | Where-Object { $_.filterType -eq "LOT_SIZE" }
        $minNotionalFilter = $symbolInfo.filters | Where-Object { $_.filterType -eq "MIN_NOTIONAL" }
        
        if ($priceFilter) {
            Write-Host "   Filtro de precio: Min=$($priceFilter.minPrice), Max=$($priceFilter.maxPrice), TickSize=$($priceFilter.tickSize)" -ForegroundColor White
        }
        if ($lotSizeFilter) {
            Write-Host "   Filtro de tamaño: Min=$($lotSizeFilter.minQty), Max=$($lotSizeFilter.maxQty), StepSize=$($lotSizeFilter.stepSize)" -ForegroundColor White
        }
        if ($minNotionalFilter) {
            Write-Host "   Notional mínimo: $($minNotionalFilter.minNotional)" -ForegroundColor White
        }
    }
    catch {
        Write-Host "❌ Error al obtener información del símbolo: $($_.Exception.Message)" -ForegroundColor Red
        return
    }
    
    # Obtener precio actual
    try {
        $currentPrice = Invoke-RestMethod -Uri "$BaseUrl/api/v3/ticker/price?symbol=$Symbol"
        $price = [double]$currentPrice.price
        Write-Host "💰 Precio actual de $Symbol`: $price" -ForegroundColor White
        
        # Calcular cantidad para una orden pequeña (ej. 10 USDT)
        $quantity = [Math]::Round(10 / $price, 8)
        Write-Host "📊 Cantidad calculada para 10 USDT: $quantity" -ForegroundColor White
    }
    catch {
        Write-Host "❌ Error al obtener precio actual: $($_.Exception.Message)" -ForegroundColor Red
        return
    }
    
    # Preguntar si desea crear una orden de prueba
    Write-Host "`n⚠️  ADVERTENCIA: Las siguientes operaciones crearán órdenes reales en Binance" -ForegroundColor Red
    $response = Read-Host "¿Desea crear una orden de prueba LIMIT? (s/N)"
    
    if ($response -eq "s" -or $response -eq "S") {
        # Crear orden LIMIT de compra
        $limitPrice = [Math]::Round($price * 0.99, 8)  # 1% debajo del precio actual
        
        $orderParams = @{
            "symbol" = $Symbol
            "side" = "BUY"
            "type" = "LIMIT"
            "timeInForce" = "GTC"
            "quantity" = $quantity.ToString()
            "price" = $limitPrice.ToString()
        }
        
        Write-Host "📝 Creando orden LIMIT de compra..." -ForegroundColor Yellow
        Write-Host "   Símbolo: $Symbol" -ForegroundColor White
        Write-Host "   Lado: BUY" -ForegroundColor White
        Write-Host "   Tipo: LIMIT" -ForegroundColor White
        Write-Host "   Cantidad: $quantity" -ForegroundColor White
        Write-Host "   Precio: $limitPrice" -ForegroundColor White
        
        $orderResult = Invoke-BinancePostRequest -endpoint "/api/v3/order" -params $orderParams
        Show-Results -data $orderResult -title "Resultado de orden LIMIT"
        
        if ($orderResult -ne $null -and $orderResult.orderId -ne $null) {
            # Preguntar si desea cancelar la orden
            $cancelResponse = Read-Host "¿Desea cancelar la orden creada? (S/n)"
            
            if ($cancelResponse -eq "" -or $cancelResponse -eq "S" -or $cancelResponse -eq "s") {
                # Cancelar orden
                $cancelParams = @{
                    "symbol" = $Symbol
                    "orderId" = $orderResult.orderId
                }
                
                Write-Host "🗑️  Cancelando orden..." -ForegroundColor Yellow
                $cancelResult = Invoke-BinanceDeleteRequest -endpoint "/api/v3/order" -params $cancelParams
                Show-Results -data $cancelResult -title "Resultado de cancelación"
            }
        }
    }
    
    # Preguntar si desea crear una orden de mercado
    $marketResponse = Read-Host "¿Desea crear una orden de MARKET? (s/N)"
    
    if ($marketResponse -eq "s" -or $marketResponse -eq "S") {
        # Crear orden MARKET de compra
        $marketOrderParams = @{
            "symbol" = $Symbol
            "side" = "BUY"
            "type" = "MARKET"
            "quantity" = $quantity.ToString()
        }
        
        Write-Host "📝 Creando orden MARKET de compra..." -ForegroundColor Yellow
        Write-Host "   Símbolo: $Symbol" -ForegroundColor White
        Write-Host "   Lado: BUY" -ForegroundColor White
        Write-Host "   Tipo: MARKET" -ForegroundColor White
        Write-Host "   Cantidad: $quantity" -ForegroundColor White
        
        $marketOrderResult = Invoke-BinancePostRequest -endpoint "/api/v3/order" -params $marketOrderParams
        Show-Results -data $marketOrderResult -title "Resultado de orden MARKET"
    }
}

# Función principal
function Main {
    Write-Host "============================================================================" -ForegroundColor Cyan
    Write-Host "🚀 Binance API Test Script with HMAC SHA256 Signature" -ForegroundColor Cyan
    Write-Host "============================================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Verificar si se proporcionaron claves
    if ([string]::IsNullOrEmpty($ApiKey) -or [string]::IsNullOrEmpty($SecretKey)) {
        Write-Host "⚠️  No se proporcionaron API Key y/o Secret Key" -ForegroundColor Yellow
        Write-Host "   Solo se probarán endpoints públicos" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Para probar endpoints privados, ejecute:" -ForegroundColor White
        Write-Host "   .\binance-api-test.ps1 -ApiKey 'TU_API_KEY' -SecretKey 'TU_SECRET_KEY'" -ForegroundColor White
        Write-Host ""
        Write-Host "Para usar TestNet:" -ForegroundColor White
        Write-Host "   .\binance-api-test.ps1 -ApiKey 'TU_API_KEY' -SecretKey 'TU_SECRET_KEY' -TestNet `$true" -ForegroundColor White
        Write-Host ""
    }
    else {
        Write-Host "🔑 API Key y Secret Key proporcionadas" -ForegroundColor Green
        Write-Host "   Se probarán todos los endpoints" -ForegroundColor Green
        Write-Host ""
    }
    
    # Mostrar configuración
    Write-Host "⚙️  Configuración:" -ForegroundColor White
    Write-Host "   Base URL: $BaseUrl" -ForegroundColor White
    Write-Host "   Símbolo: $Symbol" -ForegroundColor White
    Write-Host "   TestNet: $TestNet" -ForegroundColor White
    Write-Host ""
    
    # Probar endpoints públicos
    Test-PublicEndpoints
    
    # Probar endpoints privados
    Test-PrivateEndpoints
    
    # Probar operaciones de trading
    Test-TradingOperations
    
    Write-Host ""
    Write-Host "✅ Pruebas completadas" -ForegroundColor Green
    Write-Host "============================================================================" -ForegroundColor Cyan
}

# Ejecutar función principal
Main
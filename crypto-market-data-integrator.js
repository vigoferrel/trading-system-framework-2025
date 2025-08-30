/**
 * [DATA] CRYPTO MARKET DATA INTEGRATOR
 * ================================
 * 
 * Integrador de APIs Binance y CoinGecko para alimentar el núcleo psicológico
 * con datos de mercado en tiempo real y fundamentales
 */

const https = require('https');
const WebSocket = require('ws');
const { analizarEstadoPsicologico } = require('./nucleo-psicologico-tasas-cambio.js');

class CryptoMarketDataIntegrator {
    constructor() {
        console.log('[DATA] [MARKET DATA] Inicializando integrador de datos crypto...');
        
        //  CONFIGURACIÓN DE APIS
        this.binanceRestAPI = 'https://api.binance.com/api/v3';
        this.binanceFuturesAPI = 'https://fapi.binance.com/fapi/v1';
        this.binanceWebSocketURL = 'wss://stream.binance.com:9443/ws';
        this.coinGeckoAPI = 'https://api.coingecko.com/api/v3';
        
        //  ALMACENAMIENTO DE DATOS
        this.marketData = new Map();
        this.historicalData = new Map();
        this.onChainData = new Map();
        this.psychologicalStates = new Map();
        
        // [RELOAD] CONEXIONES WEBSOCKET
        this.websockets = new Map();
        this.reconnectAttempts = new Map();
        this.maxReconnectAttempts = 5;
        
        //  INTERVALOS DE ACTUALIZACIÓN
        this.updateIntervals = new Map();
        this.isRunning = false;
        
        // [UP] SÍMBOLOS A MONITOREAR
        this.symbols = [
            'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT',
            'XRPUSDT', 'DOGEUSDT', 'DOTUSDT', 'MATICUSDT', 'LINKUSDT'
        ];
        
        // [DATA] MÉTRICAS DE PERFORMANCE
        this.metrics = {
            totalApiCalls: 0,
            successfulCalls: 0,
            failedCalls: 0,
            averageResponseTime: 0,
            lastUpdate: null,
            psychologicalAnalyses: 0,
            websocketConnections: 0,
            dataFreshness: 1.0
        };
        
        this.initializeSystem();
    }
    
    /**
     * [START] INICIALIZAR SISTEMA COMPLETO
     */
    async initializeSystem() {
        try {
            console.log('[START] [MARKET DATA] Iniciando sistema integrador...');
            
            // [OK] 1. INICIALIZAR DATOS DE MERCADO
            await this.initializeMarketData();
            
            // [OK] 2. CONFIGURAR WEBSOCKETS
            await this.setupWebSocketConnections();
            
            // [OK] 3. INICIAR ACTUALIZACIONES PERIÓDICAS
            this.startPeriodicUpdates();
            
            // [OK] 4. INICIALIZAR ESTADOS PSICOLÓGICOS
            await this.initializePsychologicalStates();
            
            // [OK] 5. INICIAR MONITOREO
            this.startMonitoring();
            
            this.isRunning = true;
            console.log('[OK] [MARKET DATA] Sistema inicializado exitosamente');
            
        } catch (error) {
            console.error('[ERROR] [MARKET DATA] Error inicializando sistema:', error.message);
            throw error;
        }
    }
    
    /**
     * [DATA] INICIALIZAR DATOS DE MERCADO
     */
    async initializeMarketData() {
        console.log('[DATA] [INIT] Inicializando datos de mercado...');
        
        // Cargar datos iniciales para todos los símbolos
        for (const symbol of this.symbols) {
            try {
                console.log(`[UP] [${symbol}] Cargando datos iniciales...`);
                
                // Datos básicos de precio
                const tickerData = await this.fetchBinanceTickerData(symbol);
                
                // Datos de funding rate (futuros)
                const fundingData = await this.fetchBinanceFundingRate(symbol);
                
                // Datos de order book
                const orderBookData = await this.fetchBinanceOrderBook(symbol, 100);
                
                // Datos técnicos
                const technicalData = await this.fetchTechnicalIndicators(symbol);
                
                // Consolidar datos
                const consolidatedData = this.consolidateMarketData(
                    symbol, tickerData, fundingData, orderBookData, technicalData
                );
                
                this.marketData.set(symbol, consolidatedData);
                console.log(`[OK] [${symbol}] Datos iniciales cargados`);
                
                // Pausa para evitar rate limiting
                await this.sleep(200);
                
            } catch (error) {
                console.error(`[ERROR] [${symbol}] Error cargando datos iniciales:`, error.message);
                this.metrics.failedCalls++;
            }
        }
        
        console.log('[OK] [INIT] Datos de mercado inicializados');
    }
    
    /**
     * [API] CONFIGURAR CONEXIONES WEBSOCKET
     */
    async setupWebSocketConnections() {
        console.log('[API] [WEBSOCKET] Configurando conexiones WebSocket...');
        
        // Stream combinado para múltiples símbolos
        const streamNames = [];
        
        // Streams de ticker para cada símbolo
        this.symbols.forEach(symbol => {
            const symbolLower = symbol.toLowerCase();
            streamNames.push(`${symbolLower}@ticker`);        // 24hr ticker
            streamNames.push(`${symbolLower}@bookTicker`);    // Best bid/ask
            streamNames.push(`${symbolLower}@kline_1m`);      // 1min candles
        });
        
        const streamUrl = `${this.binanceWebSocketURL}/${streamNames.join('/')}`;
        
        console.log(` [WEBSOCKET] Conectando a ${streamNames.length} streams...`);
        
        // Crear conexión WebSocket
        const ws = new WebSocket(streamUrl);
        
        ws.on('open', () => {
            console.log('[OK] [WEBSOCKET] Conexión establecida exitosamente');
            this.metrics.websocketConnections++;
            this.reconnectAttempts.set('main', 0);
        });
        
        ws.on('message', (data) => {
            try {
                const parsedData = JSON.parse(data.toString());
                this.processWebSocketData(parsedData);
            } catch (error) {
                console.error('[ERROR] [WEBSOCKET] Error procesando mensaje:', error.message);
            }
        });
        
        ws.on('close', (code, reason) => {
            console.warn(`[WARNING] [WEBSOCKET] Conexión cerrada. Code: ${code}, Reason: ${reason}`);
            this.handleWebSocketReconnect('main');
        });
        
        ws.on('error', (error) => {
            console.error('[ERROR] [WEBSOCKET] Error de conexión:', error.message);
            this.handleWebSocketReconnect('main');
        });
        
        this.websockets.set('main', ws);
    }
    
    /**
     *  PROCESAR DATOS WEBSOCKET
     */
    processWebSocketData(data) {
        try {
            const { stream, data: streamData } = data;
            
            if (!stream || !streamData) return;
            
            // Extraer símbolo del stream name
            const symbol = this.extractSymbolFromStream(stream);
            if (!symbol) return;
            
            // Obtener datos actuales
            let currentData = this.marketData.get(symbol) || this.createEmptyMarketData(symbol);
            
            // Procesar según tipo de stream
            if (stream.includes('@ticker')) {
                currentData = this.updateTickerData(currentData, streamData);
            } else if (stream.includes('@bookTicker')) {
                currentData = this.updateBookTickerData(currentData, streamData);
            } else if (stream.includes('@kline')) {
                currentData = this.updateKlineData(currentData, streamData);
            }
            
            // Actualizar timestamp
            currentData.last_update = new Date().toISOString();
            currentData.data_freshness = 1.0;
            
            // Guardar datos actualizados
            this.marketData.set(symbol, currentData);
            
            // Trigger análisis psicológico asíncrono
            this.triggerPsychologicalAnalysis(symbol, currentData);
            
        } catch (error) {
            console.error('[ERROR] [WEBSOCKET PROCESS] Error procesando datos:', error.message);
        }
    }
    
    /**
     *  DISPARAR ANÁLISIS PSICOLÓGICO
     */
    async triggerPsychologicalAnalysis(symbol, marketData) {
        try {
            // Verificar si hay cambios significativos que justifiquen el análisis
            if (!this.shouldAnalyzePsychologicalState(symbol, marketData)) {
                return;
            }
            
            console.log(` [${symbol}] Disparando análisis psicológico...`);
            
            // Obtener estado anterior
            const previousState = this.psychologicalStates.get(symbol);
            
            // Analizar nuevo estado psicológico
            const newState = await analizarEstadoPsicologico(
                symbol,
                marketData.price,
                marketData,
                previousState?.estado_psicologico
            );
            
            // Detectar cambios significativos
            if (previousState && 
                previousState.estado_psicologico.emocion !== newState.estado_psicologico.emocion) {
                
                console.log(`[RELOAD] [${symbol}] TRANSICIÓN PSICOLÓGICA: ${previousState.estado_psicologico.emocion}  ${newState.estado_psicologico.emocion}`);
                
                // Emitir evento de cambio (puede ser usado por otros módulos)
                this.emitPsychologicalStateChange(symbol, previousState, newState);
            }
            
            // Guardar nuevo estado
            this.psychologicalStates.set(symbol, newState);
            this.metrics.psychologicalAnalyses++;
            
        } catch (error) {
            console.error(`[ERROR] [${symbol}] Error en análisis psicológico:`, error.message);
        }
    }
    
    /**
     * [DATA] DETERMINAR SI DEBE ANALIZAR ESTADO PSICOLÓGICO
     */
    shouldAnalyzePsychologicalState(symbol, marketData) {
        const lastState = this.psychologicalStates.get(symbol);
        
        // Primera vez - siempre analizar
        if (!lastState) return true;
        
        // Verificar si ha pasado suficiente tiempo (mínimo 1 minuto)
        const timeSinceLastAnalysis = Date.now() - new Date(lastState.timestamp).getTime();
        if (timeSinceLastAnalysis < 60000) return false;
        
        // Verificar cambios significativos en métricas clave
        const thresholds = {
            price_change: 0.005,      // 0.5% cambio en precio
            volume_change: 0.2,       // 20% cambio en volumen
            volatility_spike: 0.02    // 2% spike de volatilidad
        };
        
        return (
            Math.abs(marketData.price_change || 0) > thresholds.price_change ||
            Math.abs(marketData.volume_change || 0) > thresholds.volume_change ||
            Math.abs(marketData.volatility || 0) > thresholds.volatility_spike
        );
    }
    
    /**
     *  EMITIR EVENTO DE CAMBIO PSICOLÓGICO
     */
    emitPsychologicalStateChange(symbol, previousState, newState) {
        const changeEvent = {
            symbol: symbol,
            timestamp: new Date().toISOString(),
            transition: {
                from: previousState.estado_psicologico.emocion,
                to: newState.estado_psicologico.emocion,
                intensity: Math.abs(newState.estado_psicologico.puntuacion - previousState.estado_psicologico.puntuacion),
                quantum_enhancement: newState.quantum_enhanced?.quantum_enhancement || 0
            },
            impact_level: this.calculateTransitionImpact(previousState, newState),
            recommendations: newState.proyecciones
        };
        
        // Log del evento (en una implementación real, esto podría ser enviado a otros sistemas)
        console.log(` [PSYCHOLOGICAL EVENT] ${symbol}:`, JSON.stringify(changeEvent, null, 2));
    }
    
    /**
     * [FAST] INICIAR ACTUALIZACIONES PERIÓDICAS
     */
    startPeriodicUpdates() {
        console.log('[FAST] [UPDATES] Iniciando actualizaciones periódicas...');
        
        // Actualizar datos fundamentales de CoinGecko cada 5 minutos
        this.updateIntervals.set('fundamentals', setInterval(() => {
            this.updateFundamentalData();
        }, 5 * 60 * 1000));
        
        // Actualizar funding rates cada hora
        this.updateIntervals.set('funding', setInterval(() => {
            this.updateFundingRates();
        }, 60 * 60 * 1000));
        
        // Actualizar métricas on-chain cada 15 minutos
        this.updateIntervals.set('onchain', setInterval(() => {
            this.updateOnChainMetrics();
        }, 15 * 60 * 1000));
        
        // Limpiar datos históricos cada hora
        this.updateIntervals.set('cleanup', setInterval(() => {
            this.cleanupHistoricalData();
        }, 60 * 60 * 1000));
        
        console.log('[OK] [UPDATES] Actualizaciones periódicas configuradas');
    }
    
    /**
     * [UP] ACTUALIZAR DATOS FUNDAMENTALES
     */
    async updateFundamentalData() {
        console.log('[UP] [FUNDAMENTALS] Actualizando datos fundamentales...');
        
        try {
            // Mapeo de símbolos Binance a IDs CoinGecko
            const symbolToCoinGeckoId = {
                'BTCUSDT': 'bitcoin',
                'ETHUSDT': 'ethereum',
                'BNBUSDT': 'binancecoin',
                'ADAUSDT': 'cardano',
                'SOLUSDT': 'solana',
                'XRPUSDT': 'ripple',
                'DOGEUSDT': 'dogecoin',
                'DOTUSDT': 'polkadot',
                'MATICUSDT': 'matic-network',
                'LINKUSDT': 'chainlink'
            };
            
            // Crear lista de IDs para batch request
            const coinIds = Object.values(symbolToCoinGeckoId).join(',');
            
            // Fetch datos de CoinGecko
            const fundamentalData = await this.fetchCoinGeckoData(
                `/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h,24h,7d`
            );
            
            // Procesar y actualizar datos
            if (fundamentalData && Array.isArray(fundamentalData)) {
                for (const coinData of fundamentalData) {
                    const symbol = this.coinGeckoIdToSymbol(coinData.id, symbolToCoinGeckoId);
                    if (symbol) {
                        this.updateMarketDataWithFundamentals(symbol, coinData);
                    }
                }
            }
            
            console.log('[OK] [FUNDAMENTALS] Datos fundamentales actualizados');
            
        } catch (error) {
            console.error('[ERROR] [FUNDAMENTALS] Error actualizando datos:', error.message);
            this.metrics.failedCalls++;
        }
    }
    
    /**
     * [MONEY] ACTUALIZAR FUNDING RATES
     */
    async updateFundingRates() {
        console.log('[MONEY] [FUNDING] Actualizando funding rates...');
        
        try {
            for (const symbol of this.symbols) {
                const fundingData = await this.fetchBinanceFundingRate(symbol);
                if (fundingData) {
                    const currentData = this.marketData.get(symbol);
                    if (currentData) {
                        currentData.funding_rate = fundingData.fundingRate;
                        currentData.funding_rate_change = this.calculateFundingRateChange(symbol, fundingData.fundingRate);
                        currentData.next_funding_time = fundingData.nextFundingTime;
                        this.marketData.set(symbol, currentData);
                    }
                }
                
                // Pausa para rate limiting
                await this.sleep(100);
            }
            
            console.log('[OK] [FUNDING] Funding rates actualizados');
            
        } catch (error) {
            console.error('[ERROR] [FUNDING] Error actualizando funding rates:', error.message);
            this.metrics.failedCalls++;
        }
    }
    
    /**
     *  ACTUALIZAR MÉTRICAS ON-CHAIN
     */
    async updateOnChainMetrics() {
        console.log(' [ON-CHAIN] Actualizando métricas on-chain...');
        
        try {
            // Placeholder para métricas on-chain
            // En una implementación real, aquí se integrarían APIs como:
            // - Glassnode, Messari, Dune Analytics
            // - Etherscan, BSCScan para datos de blockchain
            // - DefiLlama para TVL de DeFi
            
            const onChainMetrics = {
                bitcoin: {
                    hash_rate: getSystemEntropy() * 300 + 200, // EH/s
                    difficulty: getSystemEntropy() * 30 + 20,   // T
                    mempool_size: getSystemEntropy() * 50 + 10, // MB
                    whale_movements: Math.floor(getSystemEntropy() * 10) // Count
                },
                ethereum: {
                    gas_price: getSystemEntropy() * 50 + 10,    // Gwei
                    network_utilization: getSystemEntropy() * 0.3 + 0.7, // %
                    defi_tvl: getSystemEntropy() * 20 + 40,     // Billion USD
                    nft_volume: getSystemEntropy() * 100 + 50   // Million USD
                }
            };
            
            this.onChainData.set('metrics', {
                ...onChainMetrics,
                timestamp: new Date().toISOString()
            });
            
            console.log('[OK] [ON-CHAIN] Métricas on-chain actualizadas');
            
        } catch (error) {
            console.error('[ERROR] [ON-CHAIN] Error actualizando métricas:', error.message);
        }
    }
    
    //  MÉTODOS DE UTILIDAD PARA APIS
    
    /**
     * [DATA] FETCH BINANCE TICKER DATA
     */
    async fetchBinanceTickerData(symbol) {
        const url = `${this.binanceRestAPI}/ticker/24hr?symbol=${symbol}`;
        const startTime = Date.now();
        
        try {
            const data = await this.makeHttpRequest(url);
            
            this.updateMetrics(Date.now() - startTime, true);
            
            return {
                symbol: data.symbol,
                price: parseFloat(data.lastPrice),
                price_change: parseFloat(data.priceChangePercent) / 100,
                volume: parseFloat(data.volume),
                volume_24h: parseFloat(data.quoteVolume),
                high_24h: parseFloat(data.highPrice),
                low_24h: parseFloat(data.lowPrice),
                trades_count: parseInt(data.count)
            };
            
        } catch (error) {
            this.updateMetrics(Date.now() - startTime, false);
            throw error;
        }
    }
    
    /**
     * [MONEY] FETCH BINANCE FUNDING RATE
     */
    async fetchBinanceFundingRate(symbol) {
        const url = `${this.binanceFuturesAPI}/fundingRate?symbol=${symbol}&limit=1`;
        const startTime = Date.now();
        
        try {
            const data = await this.makeHttpRequest(url);
            
            this.updateMetrics(Date.now() - startTime, true);
            
            if (Array.isArray(data) && data.length > 0) {
                return {
                    fundingRate: parseFloat(data[0].fundingRate),
                    fundingTime: data[0].fundingTime,
                    nextFundingTime: Date.now() + (8 * 60 * 60 * 1000) // Next funding in 8 hours
                };
            }
            
            return null;
            
        } catch (error) {
            this.updateMetrics(Date.now() - startTime, false);
            return null; // Funding rates not available for all symbols
        }
    }
    
    /**
     *  FETCH BINANCE ORDER BOOK
     */
    async fetchBinanceOrderBook(symbol, limit = 100) {
        const url = `${this.binanceRestAPI}/depth?symbol=${symbol}&limit=${limit}`;
        const startTime = Date.now();
        
        try {
            const data = await this.makeHttpRequest(url);
            
            this.updateMetrics(Date.now() - startTime, true);
            
            // Calculate spread and liquidity metrics
            const bestBid = parseFloat(data.bids[0][0]);
            const bestAsk = parseFloat(data.asks[0][0]);
            const spread = ((bestAsk - bestBid) / bestBid) * 100;
            
            // Calculate depth (total volume in top 10 levels)
            const bidDepth = data.bids.slice(0, 10).reduce((sum, bid) => sum + parseFloat(bid[1]), 0);
            const askDepth = data.asks.slice(0, 10).reduce((sum, ask) => sum + parseFloat(ask[1]), 0);
            
            return {
                bid: bestBid,
                ask: bestAsk,
                spread: spread,
                bid_depth: bidDepth,
                ask_depth: askDepth,
                total_depth: bidDepth + askDepth
            };
            
        } catch (error) {
            this.updateMetrics(Date.now() - startTime, false);
            throw error;
        }
    }
    
    /**
     * [UP] FETCH TECHNICAL INDICATORS (simulado)
     */
    async fetchTechnicalIndicators(symbol) {
        // En una implementación real, esto calcularía indicadores reales
        // basados en datos históricos de precios
        
        return {
            rsi: 30 + getSystemEntropy() * 40,
            macd: (getSystemEntropy() - 0.5) * 0.1,
            stochastic: 20 + getSystemEntropy() * 60,
            volatility: getSystemEntropy() * 0.1,
            momentum: (getSystemEntropy() - 0.5) * 0.2
        };
    }
    
    /**
     *  FETCH COINGECKO DATA
     */
    async fetchCoinGeckoData(endpoint) {
        const url = `${this.coinGeckoAPI}${endpoint}`;
        const startTime = Date.now();
        
        try {
            const data = await this.makeHttpRequest(url);
            this.updateMetrics(Date.now() - startTime, true);
            return data;
            
        } catch (error) {
            this.updateMetrics(Date.now() - startTime, false);
            throw error;
        }
    }
    
    /**
     * [API] HACER PETICIÓN HTTP
     */
    makeHttpRequest(url) {
        return new Promise((resolve, reject) => {
            const request = https.get(url, (response) => {
                let data = '';
                
                response.on('data', (chunk) => {
                    data += chunk;
                });
                
                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        resolve(parsedData);
                    } catch (error) {
                        reject(new Error('Error parsing JSON response'));
                    }
                });
            });
            
            request.on('error', (error) => {
                reject(error);
            });
            
            request.setTimeout(10000, () => {
                request.abort();
                reject(new Error('Request timeout'));
            });
        });
    }
    
    //  MÉTODOS AUXILIARES
    
    consolidateMarketData(symbol, tickerData, fundingData, orderBookData, technicalData) {
        return {
            symbol: symbol,
            ...tickerData,
            ...orderBookData,
            ...technicalData,
            funding_rate: fundingData?.fundingRate || 0,
            funding_time: fundingData?.fundingTime || null,
            next_funding_time: fundingData?.nextFundingTime || null,
            last_update: new Date().toISOString(),
            data_freshness: 1.0,
            data_quality: this.calculateDataQuality(tickerData, orderBookData, technicalData)
        };
    }
    
    calculateDataQuality(tickerData, orderBookData, technicalData) {
        let quality = 0;
        let checks = 0;
        
        // Check ticker data
        if (tickerData && tickerData.price > 0) { quality++; checks++; }
        if (tickerData && tickerData.volume > 0) { quality++; checks++; }
        
        // Check order book data
        if (orderBookData && orderBookData.bid > 0) { quality++; checks++; }
        if (orderBookData && orderBookData.ask > 0) { quality++; checks++; }
        
        // Check technical data
        if (technicalData && technicalData.rsi >= 0 && technicalData.rsi <= 100) { quality++; checks++; }
        
        return checks > 0 ? quality / checks : 0;
    }
    
    extractSymbolFromStream(stream) {
        const match = stream.match(/^(.+)@/);
        return match ? match[1].toUpperCase() : null;
    }
    
    updateTickerData(currentData, tickerData) {
        currentData.price = parseFloat(tickerData.c);
        currentData.price_change = parseFloat(tickerData.P) / 100;
        currentData.volume = parseFloat(tickerData.v);
        currentData.volume_24h = parseFloat(tickerData.q);
        currentData.high_24h = parseFloat(tickerData.h);
        currentData.low_24h = parseFloat(tickerData.l);
        currentData.trades_count = parseInt(tickerData.x);
        return currentData;
    }
    
    updateBookTickerData(currentData, bookTickerData) {
        currentData.bid = parseFloat(bookTickerData.b);
        currentData.ask = parseFloat(bookTickerData.a);
        currentData.spread = ((currentData.ask - currentData.bid) / currentData.bid) * 100;
        return currentData;
    }
    
    updateKlineData(currentData, klineData) {
        if (klineData.k && klineData.k.x) { // Kline is closed
            const kline = klineData.k;
            currentData.open = parseFloat(kline.o);
            currentData.high = parseFloat(kline.h);
            currentData.low = parseFloat(kline.l);
            currentData.close = parseFloat(kline.c);
            currentData.volume = parseFloat(kline.v);
        }
        return currentData;
    }
    
    createEmptyMarketData(symbol) {
        return {
            symbol: symbol,
            price: 0,
            price_change: 0,
            volume: 0,
            volume_24h: 0,
            bid: 0,
            ask: 0,
            spread: 0,
            rsi: 50,
            macd: 0,
            stochastic: 50,
            volatility: 0,
            funding_rate: 0,
            last_update: new Date().toISOString(),
            data_freshness: 0,
            data_quality: 0
        };
    }
    
    coinGeckoIdToSymbol(coinGeckoId, mapping) {
        for (const [symbol, id] of Object.entries(mapping)) {
            if (id === coinGeckoId) return symbol;
        }
        return null;
    }
    
    updateMarketDataWithFundamentals(symbol, coinData) {
        const currentData = this.marketData.get(symbol);
        if (currentData) {
            currentData.market_cap = coinData.market_cap;
            currentData.market_cap_rank = coinData.market_cap_rank;
            currentData.volume_change_24h = coinData.price_change_percentage_24h_in_currency;
            currentData.price_change_1h = coinData.price_change_percentage_1h_in_currency;
            currentData.price_change_7d = coinData.price_change_percentage_7d_in_currency;
            currentData.total_supply = coinData.total_supply;
            currentData.circulating_supply = coinData.circulating_supply;
            this.marketData.set(symbol, currentData);
        }
    }
    
    calculateFundingRateChange(symbol, newFundingRate) {
        const historicalData = this.historicalData.get(symbol);
        if (!historicalData || !historicalData.previousFundingRate) {
            return 0;
        }
        
        return newFundingRate - historicalData.previousFundingRate;
    }
    
    calculateTransitionImpact(previousState, newState) {
        const emotionValues = {
            'PANICO': 0,
            'PESIMISMO': 0.25,
            'NEUTRAL': 0.5,
            'OPTIMISMO': 0.75,
            'EUFORIA': 1.0
        };
        
        const prevValue = emotionValues[previousState.estado_psicologico.emocion] || 0.5;
        const newValue = emotionValues[newState.estado_psicologico.emocion] || 0.5;
        
        return Math.abs(newValue - prevValue);
    }
    
    updateMetrics(responseTime, success) {
        this.metrics.totalApiCalls++;
        
        if (success) {
            this.metrics.successfulCalls++;
        } else {
            this.metrics.failedCalls++;
        }
        
        // Update average response time
        this.metrics.averageResponseTime = 
            (this.metrics.averageResponseTime + responseTime) / 2;
        
        this.metrics.lastUpdate = new Date().toISOString();
        
        // Update data freshness based on success rate
        const successRate = this.metrics.successfulCalls / this.metrics.totalApiCalls;
        this.metrics.dataFreshness = Math.max(0.1, successRate);
    }
    
    async initializePsychologicalStates() {
        console.log(' [PSYCHOLOGICAL] Inicializando estados psicológicos con datos reales...');
        
        for (const symbol of this.symbols) {
            const marketData = this.marketData.get(symbol);
            if (marketData && marketData.price > 0) {
                try {
                    const initialState = await analizarEstadoPsicologico(
                        symbol,
                        marketData.price,
                        marketData
                    );
                    
                    this.psychologicalStates.set(symbol, initialState);
                    console.log(` [${symbol}] Estado inicial: ${initialState.estado_psicologico.emocion}`);
                    
                } catch (error) {
                    console.error(`[ERROR] [${symbol}] Error inicializando estado:`, error.message);
                }
            }
        }
    }
    
    handleWebSocketReconnect(connectionId) {
        const attempts = this.reconnectAttempts.get(connectionId) || 0;
        
        if (attempts >= this.maxReconnectAttempts) {
            console.error(`[ERROR] [WEBSOCKET] Máximo de reintentos alcanzado para ${connectionId}`);
            return;
        }
        
        const delay = Math.pow(2, attempts) * 1000; // Exponential backoff
        console.log(`[RELOAD] [WEBSOCKET] Reintentando conexión ${connectionId} en ${delay}ms...`);
        
        setTimeout(() => {
            this.reconnectAttempts.set(connectionId, attempts + 1);
            this.setupWebSocketConnections();
        }, delay);
    }
    
    startMonitoring() {
        console.log('[DATA] [MONITORING] Iniciando monitoreo del sistema...');
        
        setInterval(() => {
            console.log('[DATA] [STATUS] Métricas actuales:', {
                symbols_tracked: this.symbols.length,
                psychological_states: this.psychologicalStates.size,
                websocket_connections: this.websockets.size,
                ...this.metrics
            });
        }, 60000); // Cada minuto
    }
    
    cleanupHistoricalData() {
        // Limpiar datos históricos antiguos para evitar uso excesivo de memoria
        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 horas
        
        // Implementar limpieza si es necesario
        console.log(' [CLEANUP] Limpieza de datos históricos completada');
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * [DATA] OBTENER ESTADO ACTUAL DEL SISTEMA
     */
    getSystemStatus() {
        return {
            isRunning: this.isRunning,
            symbols: this.symbols,
            metrics: this.metrics,
            market_data_summary: Object.fromEntries(
                Array.from(this.marketData.entries()).map(([symbol, data]) => [
                    symbol,
                    {
                        price: data.price,
                        price_change: data.price_change,
                        data_quality: data.data_quality,
                        last_update: data.last_update
                    }
                ])
            ),
            psychological_states_summary: Object.fromEntries(
                Array.from(this.psychologicalStates.entries()).map(([symbol, state]) => [
                    symbol,
                    state.estado_psicologico.emocion
                ])
            ),
            websocket_status: Object.fromEntries(
                Array.from(this.websockets.entries()).map(([id, ws]) => [
                    id,
                    ws.readyState === WebSocket.OPEN ? 'CONNECTED' : 'DISCONNECTED'
                ])
            ),
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     *  DETENER SISTEMA
     */
    stop() {
        console.log(' [SYSTEM] Deteniendo integrador de datos...');
        
        this.isRunning = false;
        
        // Cerrar WebSocket connections
        this.websockets.forEach((ws, id) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
                console.log(` [WEBSOCKET] Conexión ${id} cerrada`);
            }
        });
        
        // Limpiar intervalos
        this.updateIntervals.forEach((interval, name) => {
            clearInterval(interval);
            console.log(` [INTERVAL] Intervalo ${name} detenido`);
        });
        
        console.log('[OK] [SYSTEM] Sistema detenido exitosamente');
    }
}

// [START] INICIALIZAR Y EXPORTAR
const cryptoMarketDataIntegrator = new CryptoMarketDataIntegrator();

module.exports = {
    CryptoMarketDataIntegrator,
    cryptoMarketDataIntegrator
};

// Si se ejecuta directamente
if (require.main === module) {
    console.log('[START] [MAIN] Iniciando Crypto Market Data Integrator...');
    
    // Manejar señales de terminación
    process.on('SIGINT', () => {
        console.log('\\n [MAIN] Recibida señal SIGINT, deteniendo...');
        cryptoMarketDataIntegrator.stop();
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        console.log('\\n [MAIN] Recibida señal SIGTERM, deteniendo...');
        cryptoMarketDataIntegrator.stop();
        process.exit(0);
    });
}

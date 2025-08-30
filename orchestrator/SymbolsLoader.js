"use strict";

/**
 * SYMBOLS LOADER - Carga Dinámica de Símbolos
 * ===========================================
 * Obtiene todos los símbolos de futuros disponibles directamente de Binance
 * Procesa más de 400+ símbolos reales para el sistema QBTC
 */

const axios = require('axios');

class SymbolsLoader {
    constructor() {
        this.cache = {
            symbols: [],
            lastUpdate: 0,
            cacheTtl: 5 * 60 * 1000, // 5 minutos
        };
        this.binanceUrl = 'https://fapi.binance.com/fapi/v1/exchangeInfo';
    }

    /**
     * Obtiene todos los símbolos de futuros de Binance
     * @returns {Promise<Array>} Lista de símbolos activos
     */
    async loadAllFuturesSymbols() {
        const now = Date.now();
        
        // Usar cache si está disponible y no ha expirado
        if (this.cache.symbols.length > 0 && (now - this.cache.lastUpdate) < this.cache.cacheTtl) {
            console.log(`[DATA] Usando cache: ${this.cache.symbols.length} símbolos`);
            return this.cache.symbols;
        }

        try {
            console.log('[API] Obteniendo símbolos de Binance Futures...');
            
            const response = await axios.get(this.binanceUrl, {
                timeout: 15000,
                headers: {
                    'User-Agent': 'QBTC-SymbolsLoader/1.0'
                }
            });

            if (!response.data || !response.data.symbols) {
                throw new Error('Respuesta inválida de Binance');
            }

            // Filtrar solo símbolos activos que terminen en USDT
            const allSymbols = response.data.symbols
                .filter(symbol => 
                    symbol.status === 'TRADING' && 
                    symbol.symbol.endsWith('USDT') &&
                    symbol.contractType === 'PERPETUAL'
                )
                .map(symbol => symbol.symbol)
                .sort();

            console.log(`[OK] Símbolos cargados: ${allSymbols.length} futuros activos`);
            
            // Actualizar cache
            this.cache.symbols = allSymbols;
            this.cache.lastUpdate = now;
            
            return allSymbols;
            
        } catch (error) {
            console.error('[ERROR] Error cargando símbolos:', error.message);
            
            // Si hay cache, devolverlo como fallback
            if (this.cache.symbols.length > 0) {
                console.log('[WARNING] Usando cache como fallback');
                return this.cache.symbols;
            }
            
            // Si no hay cache, devolver lista básica de símbolos principales
            return this.getFallbackSymbols();
        }
    }

    /**
     * Lista de fallback con símbolos principales si falla la API
     * @returns {Array} Lista de símbolos básica
     */
    getFallbackSymbols() {
        return [
            // TOP TIER - Los más importantes
            'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
            'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT',
            'MATICUSDT', 'LTCUSDT', 'BCHUSDT', 'ATOMUSDT', 'NEARUSDT',
            
            // TIER 2 - DeFi y L1
            'UNIUSDT', 'AAVEUSDT', 'MKRUSDT', 'COMPUSDT', 'SNXUSDT',
            'CRVUSDT', 'SUSHIUSDT', 'YFIUSDT', 'BALUSDT', 'INJUSDT',
            
            // TIER 3 - Gaming y Metaverse
            'AXSUSDT', 'SANDUSDT', 'MANAUSDT', 'GALAUSDT', 'APEUSDT',
            'GMEUSDT', 'IMXUSDT', 'FLOWUSDT', 'CHZUSDT', 'ENJUSDT',
            
            // TIER 4 - Layer 2 y Scaling
            'ARBUSDT', 'OPUSDT', 'STXUSDT', 'LOOPRINGUSDT', 'POLYGONUSDT',
            
            // TIER 5 - Nuevos proyectos
            'APTUSDT', 'SUIUSDT', 'SEIUSDT', 'TIAUSDT', 'WIFUSDT',
            'BONKUSDT', 'PEPEUSDT', 'FLOKIUSDT', 'SATSUSDT'
        ];
    }

    /**
     * Organiza símbolos por capitalización y volumen estimado
     * @param {Array} symbols - Lista de símbolos
     * @returns {Object} Símbolos organizados por tiers
     */
    organizeSymbolsByTiers(symbols) {
        // Tier basado en patrones de nombre y popularidad conocida
        const tier1 = symbols.filter(s => 
            ['BTC', 'ETH', 'BNB'].some(major => s.startsWith(major))
        );
        
        const tier2 = symbols.filter(s => 
            ['SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'DOT', 'LINK', 'MATIC', 'LTC', 'BCH', 'ATOM', 'NEAR'].some(major => s.startsWith(major)) &&
            !tier1.includes(s)
        );
        
        const tier3 = symbols.filter(s => 
            ['UNI', 'AAVE', 'MKR', 'COMP', 'SNX', 'CRV', 'SUSHI', 'YFI', 'BAL', 'INJ'].some(major => s.startsWith(major)) &&
            !tier1.includes(s) && !tier2.includes(s)
        );
        
        const tier4 = symbols.filter(s => 
            ['AXS', 'SAND', 'MANA', 'GALA', 'APE', 'GME', 'IMX', 'FLOW', 'CHZ', 'ENJ'].some(major => s.startsWith(major)) &&
            !tier1.includes(s) && !tier2.includes(s) && !tier3.includes(s)
        );
        
        const tier5 = symbols.filter(s => 
            ['ARB', 'OP', 'STX', 'LRC', 'POLYGON'].some(major => s.startsWith(major)) &&
            !tier1.includes(s) && !tier2.includes(s) && !tier3.includes(s) && !tier4.includes(s)
        );
        
        const tier6 = symbols.filter(s => 
            !tier1.includes(s) && !tier2.includes(s) && !tier3.includes(s) && 
            !tier4.includes(s) && !tier5.includes(s)
        );

        return {
            tier1: tier1.slice(0, 10),     // Top 10
            tier2: tier2.slice(0, 20),     // Top 20 DeFi/L1
            tier3: tier3.slice(0, 30),     // Top 30 proyectos establecidos
            tier4: tier4.slice(0, 40),     // Top 40 gaming/meta
            tier5: tier5.slice(0, 50),     // Top 50 layer2/scaling
            tier6: tier6.slice(0, 100),    // Resto hasta 100
            all: symbols
        };
    }

    /**
     * Obtiene estadísticas de los símbolos cargados
     * @returns {Object} Estadísticas
     */
    getSymbolsStats() {
        const symbols = this.cache.symbols;
        if (symbols.length === 0) {
            return { total: 0, lastUpdate: null, cacheAge: null };
        }

        const now = Date.now();
        const cacheAge = Math.floor((now - this.cache.lastUpdate) / 1000);
        
        return {
            total: symbols.length,
            lastUpdate: new Date(this.cache.lastUpdate).toISOString(),
            cacheAge: `${cacheAge}s ago`,
            sampleSymbols: symbols.slice(0, 10),
            isExpired: cacheAge > (this.cache.cacheTtl / 1000)
        };
    }

    /**
     * Fuerza la recarga de símbolos desde la API
     * @returns {Promise<Array>} Nueva lista de símbolos
     */
    async forceReload() {
        this.cache.lastUpdate = 0; // Fuerza recarga
        return await this.loadAllFuturesSymbols();
    }
}

module.exports = { SymbolsLoader };

"use strict";

/**
 * MARKET INTELLIGENCE ENGINE
 * =========================
 * Framework de inteligencia de mercado basado en PLAN_DATOS_CRYPTO_NEURAL
 * Integra múltiples fuentes de datos para análisis fundamental de crypto
 * Compatible con el sistema QBTC y Intelligence Adapter
 */

const axios = require('axios');
const EventEmitter = require('events');

// Configuración de APIs según el plan crypto neural
const API_CONFIG = {
  binance: {
    spot: 'https://api.binance.com/api/v3/',
    futures: 'https://fapi.binance.com/fapi/v1/',
    websocket: 'wss://stream.binance.com:9443/ws/'
  },
  coingecko: {
    base: 'https://api.coingecko.com/api/v3/',
    endpoints: {
      simple_price: 'simple/price',
      market_data: 'coins/markets',
      fear_greed: 'global'
    }
  },
  coinmarketcap: {
    base: 'https://pro-api.coinmarketcap.com/v1/',
    endpoints: {
      listings: 'cryptocurrency/listings/latest',
      global: 'global-metrics/quotes/latest'
    }
  }
};

// Configuración de noticias especializadas
const NEWS_SOURCES = {
  tier1_premium: [
    'bloomberg.com/crypto',
    'reuters.com/technology/finance',
    'ft.com/cryptocurrencies',
    'wsj.com/tech/blockchain'
  ],
  tier2_specialized: [
    'cointelegraph.com',
    'coindesk.com',
    'decrypt.co',
    'theblock.co',
    'cryptonews.com'
  ],
  tier3_social: [
    'twitter.com/crypto',
    'reddit.com/r/cryptocurrency',
    'discord.gg/crypto',
    'telegram.me/crypto'
  ]
};

class MarketIntelligenceEngine extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      updateInterval: 15 * 60 * 1000, // 15 minutos como especifica el plan
      cacheTimeout: 5 * 60 * 1000,    // 5 minutos de cache
      retryAttempts: 3,
      retryDelay: 2000,
      enableNewsAnalysis: true,
      enableSentimentAnalysis: true,
      enableOnChainMetrics: true,
      ...config
    };
    
    this.cache = new Map();
    this.isRunning = false;
    this.intervals = [];
    
    // Métricas de performance
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      lastUpdate: null,
      averageResponseTime: 0
    };
    
    console.log(' Market Intelligence Engine inicializando...');
  }

  /**
   * Inicializar el motor de inteligencia
   */
  async initialize() {
    try {
      console.log('[START] Iniciando Market Intelligence Engine...');
      
      // Verificar conectividad con APIs principales
      await this.testAPIConnectivity();
      
      // Iniciar recolección periódica de datos
      this.startDataCollection();
      
      this.isRunning = true;
      console.log('[OK] Market Intelligence Engine activo');
      
      this.emit('initialized');
      return true;
      
    } catch (error) {
      console.error('[ERROR] Error inicializando Market Intelligence:', error.message);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Probar conectividad con APIs críticas
   */
  async testAPIConnectivity() {
    const tests = [
      { name: 'Binance Spot API', url: API_CONFIG.binance.spot + 'ping' },
      { name: 'Binance Futures API', url: API_CONFIG.binance.futures + 'ping' },
      { name: 'CoinGecko API', url: API_CONFIG.coingecko.base + 'ping' }
    ];
    
    for (const test of tests) {
      try {
        const startTime = Date.now();
        await axios.get(test.url, { timeout: 5000 });
        const responseTime = Date.now() - startTime;
        console.log(`[OK] ${test.name}: ${responseTime}ms`);
      } catch (error) {
        console.warn(`[WARNING] ${test.name}: ${error.message}`);
      }
    }
  }

  /**
   * Iniciar recolección automática de datos
   */
  startDataCollection() {
    // Recolección de datos de mercado cada 15 minutos
    const marketDataInterval = setInterval(() => {
      this.collectMarketData();
    }, this.config.updateInterval);
    
    // Análisis de noticias cada 30 minutos
    const newsInterval = setInterval(() => {
      if (this.config.enableNewsAnalysis) {
        this.analyzeNewsData();
      }
    }, this.config.updateInterval * 2);
    
    // Métricas on-chain cada hora
    const onChainInterval = setInterval(() => {
      if (this.config.enableOnChainMetrics) {
        this.collectOnChainMetrics();
      }
    }, this.config.updateInterval * 4);
    
    this.intervals.push(marketDataInterval, newsInterval, onChainInterval);
    
    // Ejecutar inmediatamente
    this.collectMarketData();
    
    console.log('[DATA] Recolección de datos programada');
  }

  /**
   * Recopilar datos de mercado en tiempo real
   */
  async collectMarketData() {
    try {
      console.log('[DATA] Recopilando datos de mercado...');
      
      // Datos de precios y volúmenes (Binance)
      const marketData = await this.getBinanceMarketData();
      
      // Fear & Greed Index (CoinGecko)
      const sentiment = await this.getFearGreedIndex();
      
      // Métricas globales (CoinMarketCap simulado)
      const globalMetrics = await this.getGlobalMetrics();
      
      // Consolidar datos
      const intelligence = {
        timestamp: Date.now(),
        market: marketData,
        sentiment: sentiment,
        global: globalMetrics,
        quality_score: this.calculateDataQuality(marketData, sentiment, globalMetrics)
      };
      
      // Almacenar en cache
      this.cache.set('market_intelligence', {
        data: intelligence,
        timestamp: Date.now()
      });
      
      // Emitir evento
      this.emit('market-data-updated', intelligence);
      
      this.metrics.successfulRequests++;
      this.metrics.lastUpdate = new Date().toISOString();
      
      console.log(`[OK] Datos de mercado actualizados (Quality: ${intelligence.quality_score.toFixed(2)})`);
      
    } catch (error) {
      console.error('[ERROR] Error recopilando datos de mercado:', error.message);
      this.metrics.failedRequests++;
    }
    
    this.metrics.totalRequests++;
  }

  /**
   * Obtener datos de Binance según especificaciones del plan
   */
  async getBinanceMarketData() {
    const cryptos = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT'];
    const marketData = {};
    
    try {
      // Datos 24hr ticker
      const response = await axios.get(API_CONFIG.binance.spot + 'ticker/24hr', {
        timeout: 10000
      });
      
      const data = response.data.filter(item => 
        cryptos.includes(item.symbol)
      );
      
      data.forEach(ticker => {
        marketData[ticker.symbol] = {
          price: parseFloat(ticker.lastPrice),
          change24h: parseFloat(ticker.priceChangePercent),
          volume: parseFloat(ticker.volume),
          quoteVolume: parseFloat(ticker.quoteVolume),
          high24h: parseFloat(ticker.highPrice),
          low24h: parseFloat(ticker.lowPrice),
          trades: parseInt(ticker.count)
        };
      });
      
      console.log(`[UP] Binance data: ${Object.keys(marketData).length} symbols`);
      return marketData;
      
    } catch (error) {
      console.warn('[WARNING] Binance API error:', error.message);
      return {};
    }
  }

  /**
   * Obtener Fear & Greed Index
   */
  async getFearGreedIndex() {
    try {
      const response = await axios.get(API_CONFIG.coingecko.base + 'global', {
        timeout: 10000
      });
      
      // Simular Fear & Greed basado en market cap changes
      const marketCapChange = response.data?.data?.market_cap_change_percentage_24h_usd || 0;
      let fearGreedValue = 50; // Neutral
      
      if (marketCapChange > 5) fearGreedValue = 75; // Greed
      else if (marketCapChange > 2) fearGreedValue = 65; // Slight Greed
      else if (marketCapChange < -5) fearGreedValue = 25; // Fear
      else if (marketCapChange < -2) fearGreedValue = 35; // Slight Fear
      
      const sentiment = {
        fear_greed_index: fearGreedValue,
        classification: this.classifySentiment(fearGreedValue),
        market_cap_change_24h: marketCapChange,
        updated: new Date().toISOString()
      };
      
      console.log(` Sentiment: ${sentiment.classification} (${fearGreedValue})`);
      return sentiment;
      
    } catch (error) {
      console.warn('[WARNING] Sentiment API error:', error.message);
      return { fear_greed_index: 50, classification: 'Neutral' };
    }
  }

  /**
   * Obtener métricas globales del mercado
   */
  async getGlobalMetrics() {
    try {
      const response = await axios.get(API_CONFIG.coingecko.base + 'global', {
        timeout: 10000
      });
      
      const data = response.data?.data || {};
      
      const metrics = {
        total_market_cap: data.total_market_cap?.usd || 0,
        total_volume: data.total_volume?.usd || 0,
        bitcoin_dominance: data.market_cap_percentage?.btc || 0,
        ethereum_dominance: data.market_cap_percentage?.eth || 0,
        active_cryptocurrencies: data.active_cryptocurrencies || 0,
        market_cap_change_24h: data.market_cap_change_percentage_24h_usd || 0,
        updated: new Date().toISOString()
      };
      
      console.log(` Global: BTC dominance ${metrics.bitcoin_dominance.toFixed(1)}%`);
      return metrics;
      
    } catch (error) {
      console.warn('[WARNING] Global metrics error:', error.message);
      return {};
    }
  }

  /**
   * Análisis de noticias (preparado para expansión futura)
   */
  async analyzeNewsData() {
    console.log(' Análisis de noticias preparado (requiere integración MCP Brave)');
    
    // Aquí se integraría con MCP Brave cuando esté disponible
    const newsAnalysis = {
      timestamp: Date.now(),
      sentiment_score: 0.5, // Neutral por defecto
      news_volume: 0,
      key_topics: [],
      sources_analyzed: 0
    };
    
    this.cache.set('news_analysis', {
      data: newsAnalysis,
      timestamp: Date.now()
    });
    
    this.emit('news-analyzed', newsAnalysis);
  }

  /**
   * Recopilar métricas on-chain (preparado para expansión)
   */
  async collectOnChainMetrics() {
    console.log(' Métricas on-chain preparadas (requiere APIs blockchain)');
    
    // Framework preparado para integración futura
    const onChainMetrics = {
      bitcoin: {
        hash_rate: 0,
        difficulty: 0,
        mempool_size: 0,
        whale_movements: []
      },
      ethereum: {
        gas_price: 0,
        defi_tvl: 0,
        nft_volume: 0,
        whale_transactions: []
      }
    };
    
    this.cache.set('onchain_metrics', {
      data: onChainMetrics,
      timestamp: Date.now()
    });
    
    this.emit('onchain-updated', onChainMetrics);
  }

  /**
   * Clasificar sentiment basado en Fear & Greed Index
   */
  classifySentiment(value) {
    if (value >= 75) return 'Extreme Greed';
    if (value >= 55) return 'Greed';
    if (value >= 45) return 'Neutral';
    if (value >= 25) return 'Fear';
    return 'Extreme Fear';
  }

  /**
   * Calcular calidad de datos
   */
  calculateDataQuality(market, sentiment, global) {
    let quality = 0.5; // Base
    
    if (Object.keys(market).length > 0) quality += 0.2;
    if (sentiment.fear_greed_index) quality += 0.15;
    if (global.total_market_cap > 0) quality += 0.15;
    
    return Math.min(1.0, quality);
  }

  /**
   * Obtener inteligencia de mercado consolidada
   */
  getMarketIntelligence(symbol) {
    const cached = this.cache.get('market_intelligence');
    if (!cached) return null;
    
    // Verificar si el cache está vigente
    const age = Date.now() - cached.timestamp;
    if (age > this.config.cacheTimeout) {
      return null;
    }
    
    const intelligence = cached.data;
    
    // Si se solicita un símbolo específico, filtrarlo
    if (symbol && intelligence.market[symbol]) {
      return {
        ...intelligence,
        symbol_specific: intelligence.market[symbol]
      };
    }
    
    return intelligence;
  }

  /**
   * Obtener métricas del motor
   */
  getMetrics() {
    return {
      ...this.metrics,
      cache_size: this.cache.size,
      uptime: this.isRunning,
      intervals_active: this.intervals.length
    };
  }

  /**
   * Detener el motor
   */
  stop() {
    console.log(' Deteniendo Market Intelligence Engine...');
    
    // Limpiar intervalos
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    
    this.isRunning = false;
    this.emit('stopped');
    
    console.log('[OK] Market Intelligence Engine detenido');
  }
}

module.exports = { MarketIntelligenceEngine, API_CONFIG, NEWS_SOURCES };

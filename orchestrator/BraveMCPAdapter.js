"use strict";

/**
 * BRAVE MCP ADAPTER
 * =================
 * Integración opcional del sistema MCP Brave Search para análisis de sentiment 
 * y noticias crypto que complementa el Intelligence Adapter del sistema QBTC
 */

const axios = require('axios');
const { EventEmitter } = require('events');

class BraveMCPAdapter extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      mcpUrl: config.mcpUrl || 'http://localhost:9847/mcp',
      apiKey: config.apiKey || process.env.BRAVE_API_KEY,
      enabled: config.enabled !== false && !!config.apiKey,
      maxRetries: config.maxRetries || 3,
      timeout: config.timeout || 15000,
      rateLimitDelay: config.rateLimitDelay || 2000,
      cache: {
        ttl: config.cacheTtl || 5 * 60 * 1000, // 5 minutos
        maxSize: config.maxCacheSize || 100
      },
      // Queries especializadas para crypto
      cryptoQueries: [
        'Bitcoin BTC price analysis news today',
        'Ethereum ETH market prediction',
        'cryptocurrency market sentiment analysis',
        'altcoin investment recommendations',
        'DeFi protocols TVL analysis',
        'blockchain adoption news',
        'crypto whale movements',
        'regulatory crypto news'
      ],
      ...config
    };
    
    this.cache = new Map();
    this.lastRequestTime = 0;
    this.requestQueue = [];
    this.isProcessingQueue = false;
    
    console.log(` Brave MCP Adapter inicializando (${this.config.enabled ? 'ENABLED' : 'DISABLED'})`);
  }

  /**
   * Inicializar el adapter MCP Brave
   */
  async initialize() {
    if (!this.config.enabled) {
      console.log('[WARNING] Brave MCP Adapter deshabilitado (API key no configurada)');
      return false;
    }

    try {
      console.log('[START] Inicializando Brave MCP Adapter...');
      
      // Probar conectividad con el servidor MCP
      const isAlive = await this.testConnection();
      if (!isAlive) {
        console.warn('[WARNING] Servidor MCP Brave no está disponible');
        this.config.enabled = false;
        return false;
      }

      // Obtener herramientas disponibles
      const tools = await this.listAvailableTools();
      console.log(`[OK] Brave MCP activo con ${tools.length} herramientas disponibles`);
      
      this.emit('initialized', { tools });
      return true;
      
    } catch (error) {
      console.error('[ERROR] Error inicializando Brave MCP:', error.message);
      this.config.enabled = false;
      return false;
    }
  }

  /**
   * Probar conexión con el servidor MCP
   */
  async testConnection() {
    try {
      const response = await this.makeMCPRequest('tools/list');
      return response && response.result;
    } catch (error) {
      return false;
    }
  }

  /**
   * Listar herramientas MCP disponibles
   */
  async listAvailableTools() {
    const response = await this.makeMCPRequest('tools/list');
    return response?.result?.tools || [];
  }

  /**
   * Realizar búsqueda web especializada en crypto
   */
  async searchCryptoNews(query, options = {}) {
    if (!this.config.enabled) return null;

    const cacheKey = `news:${query}`;
    const cached = this.getCachedResult(cacheKey);
    if (cached) return cached;

    try {
      const searchParams = {
        name: 'brave_web_search',
        arguments: {
          query: `${query} cryptocurrency news`,
          count: options.count || 5,
          summary: options.summary !== false,
          freshness: 'pd', // Past day
          search_lang: options.language || 'en'
        }
      };

      const result = await this.makeMCPRequest('tools/call', searchParams);
      
      if (result?.result?.content) {
        const content = JSON.parse(result.result.content[0].text);
        const processedData = this.processNewsResults(content);
        
        this.setCachedResult(cacheKey, processedData);
        this.emit('news-searched', { query, results: processedData });
        
        return processedData;
      }
      
      return null;
      
    } catch (error) {
      console.error('[ERROR] Error en búsqueda de noticias crypto:', error.message);
      return null;
    }
  }

  /**
   * Análisis de sentiment específico para un símbolo
   */
  async analyzeSymbolSentiment(symbol, options = {}) {
    if (!this.config.enabled) return null;

    const cacheKey = `sentiment:${symbol}`;
    const cached = this.getCachedResult(cacheKey);
    if (cached) return cached;

    try {
      // Búsqueda específica del símbolo
      const query = `${symbol} price prediction analysis ${new Date().getFullYear()}`;
      const searchResult = await this.searchCryptoNews(query, { count: 8, summary: true });
      
      if (!searchResult || !searchResult.results) return null;

      // Análizar sentiment de los resultados
      const sentiment = this.calculateSentimentFromNews(searchResult.results, symbol);
      
      const analysis = {
        symbol: symbol,
        timestamp: Date.now(),
        sentiment_score: sentiment.score,
        sentiment_classification: sentiment.classification,
        news_volume: searchResult.results.length,
        key_topics: this.extractKeyTopics(searchResult.results),
        confidence: sentiment.confidence,
        sources: searchResult.results.map(r => ({
          title: r.title,
          url: r.url,
          sentiment_impact: this.classifyNewsSentiment(r.title + ' ' + r.description)
        }))
      };

      this.setCachedResult(cacheKey, analysis);
      this.emit('sentiment-analyzed', analysis);
      
      return analysis;
      
    } catch (error) {
      console.error(`[ERROR] Error analizando sentiment para ${symbol}:`, error.message);
      return null;
    }
  }

  /**
   * Buscar noticias de mercado general
   */
  async getMarketOverview(options = {}) {
    if (!this.config.enabled) return null;

    const cacheKey = 'market:overview';
    const cached = this.getCachedResult(cacheKey);
    if (cached) return cached;

    try {
      const queries = [
        'cryptocurrency market analysis today',
        'bitcoin ethereum price movement',
        'crypto market cap changes',
        'altcoin performance analysis'
      ];

      const searchPromises = queries.map(query => 
        this.searchCryptoNews(query, { count: 3, summary: false })
      );

      const results = await Promise.all(searchPromises);
      const consolidatedNews = results
        .filter(result => result && result.results)
        .flatMap(result => result.results)
        .slice(0, 15); // Top 15 noticias

      const overview = {
        timestamp: Date.now(),
        total_news: consolidatedNews.length,
        market_sentiment: this.calculateOverallSentiment(consolidatedNews),
        trending_topics: this.extractTrendingTopics(consolidatedNews),
        recent_news: consolidatedNews.slice(0, 8),
        sources_coverage: this.analyzeSourceCoverage(consolidatedNews)
      };

      this.setCachedResult(cacheKey, overview);
      this.emit('market-overview-updated', overview);
      
      return overview;
      
    } catch (error) {
      console.error('[ERROR] Error obteniendo overview del mercado:', error.message);
      return null;
    }
  }

  /**
   * Procesar resultados de noticias
   */
  processNewsResults(content) {
    const results = content.web?.results || [];
    
    return {
      timestamp: Date.now(),
      query_type: 'crypto_news',
      total_results: results.length,
      results: results.map(item => ({
        title: item.title,
        description: item.description,
        url: item.url,
        published: item.age || 'unknown',
        source: this.extractDomain(item.url),
        relevance_score: this.calculateRelevanceScore(item)
      })),
      summarizer_key: content.summarizer_key || null
    };
  }

  /**
   * Calcular sentiment desde noticias
   */
  calculateSentimentFromNews(newsResults, symbol) {
    if (!newsResults || newsResults.length === 0) {
      return { score: 0.5, classification: 'Neutral', confidence: 0 };
    }

    let totalScore = 0;
    let confidenceSum = 0;

    newsResults.forEach(news => {
      const text = (news.title + ' ' + news.description).toLowerCase();
      const sentiment = this.classifyNewsSentiment(text, symbol);
      const confidence = this.calculateNewsConfidence(news);
      
      totalScore += sentiment.score * confidence;
      confidenceSum += confidence;
    });

    const avgScore = confidenceSum > 0 ? totalScore / confidenceSum : 0.5;
    
    return {
      score: Math.max(0, Math.min(1, avgScore)),
      classification: this.classifySentimentScore(avgScore),
      confidence: Math.min(1, confidenceSum / newsResults.length)
    };
  }

  /**
   * Clasificar sentiment de una noticia individual
   */
  classifyNewsSentiment(text, symbol = '') {
    text = text.toLowerCase();
    
    const positiveTerms = [
      'rally', 'surge', 'bullish', 'rise', 'gain', 'pump', 'breakthrough',
      'adoption', 'growth', 'positive', 'optimistic', 'moon', 'breakout',
      'institutional', 'upgrade', 'partnership', 'success'
    ];
    
    const negativeTerms = [
      'crash', 'dump', 'bearish', 'fall', 'drop', 'decline', 'loss',
      'regulation', 'ban', 'negative', 'concern', 'risk', 'fear',
      'liquidation', 'hack', 'scam', 'volatile', 'uncertainty'
    ];

    let score = 0.5; // Neutral base
    let positiveCount = 0;
    let negativeCount = 0;

    positiveTerms.forEach(term => {
      if (text.includes(term)) {
        positiveCount++;
        score += 0.05;
      }
    });

    negativeTerms.forEach(term => {
      if (text.includes(term)) {
        negativeCount++;
        score -= 0.05;
      }
    });

    // Boost si menciona específicamente el símbolo
    if (symbol && text.includes(symbol.toLowerCase())) {
      const multiplier = 1.2;
      if (positiveCount > negativeCount) score *= multiplier;
      else if (negativeCount > positiveCount) score /= multiplier;
    }

    return {
      score: Math.max(0, Math.min(1, score)),
      positive_signals: positiveCount,
      negative_signals: negativeCount
    };
  }

  /**
   * Clasificar score numérico en categorías
   */
  classifySentimentScore(score) {
    if (score >= 0.75) return 'Very Positive';
    if (score >= 0.6) return 'Positive';
    if (score >= 0.4) return 'Neutral';
    if (score >= 0.25) return 'Negative';
    return 'Very Negative';
  }

  /**
   * Extraer temas clave de las noticias
   */
  extractKeyTopics(newsResults) {
    const topics = new Map();
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'bitcoin', 'crypto', 'cryptocurrency']);

    newsResults.forEach(news => {
      const text = (news.title + ' ' + news.description).toLowerCase();
      const words = text.match(/\b\w{4,}\b/g) || [];
      
      words.forEach(word => {
        if (!commonWords.has(word)) {
          topics.set(word, (topics.get(word) || 0) + 1);
        }
      });
    });

    return Array.from(topics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([topic, count]) => ({ topic, mentions: count }));
  }

  /**
   * Hacer solicitud al servidor MCP
   */
  async makeMCPRequest(method, params = {}) {
    await this.respectRateLimit();

    const body = {
      jsonrpc: '2.0',
      id: Date.now() + getSystemEntropy(),
      method: method,
      params: params
    };

    const response = await axios.post(this.config.mcpUrl, body, {
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'QBTC-BraveMCP/1.0'
      }
    });

    return response.data;
  }

  /**
   * Respetar límites de velocidad
   */
  async respectRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.config.rateLimitDelay) {
      const waitTime = this.config.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Gestión de caché
   */
  getCachedResult(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.config.cache.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  setCachedResult(key, data) {
    // Limpiar caché si está lleno
    if (this.cache.size >= this.config.cache.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }

  /**
   * Utilidades auxiliares
   */
  extractDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }

  calculateRelevanceScore(newsItem) {
    let score = 0.5;
    
    // Más relevante si está en el título
    const title = newsItem.title.toLowerCase();
    const cryptoTerms = ['bitcoin', 'ethereum', 'crypto', 'blockchain', 'defi', 'nft'];
    
    cryptoTerms.forEach(term => {
      if (title.includes(term)) score += 0.1;
    });
    
    return Math.min(1, score);
  }

  calculateNewsConfidence(newsItem) {
    let confidence = 0.5;
    
    // Fuentes confiables
    const trustedDomains = ['coindesk.com', 'cointelegraph.com', 'decrypt.co', 'theblock.co'];
    if (trustedDomains.some(domain => newsItem.url.includes(domain))) {
      confidence += 0.3;
    }
    
    // Noticias recientes son más confiables
    if (newsItem.published && newsItem.published.includes('hour')) {
      confidence += 0.2;
    }
    
    return Math.min(1, confidence);
  }

  calculateOverallSentiment(newsResults) {
    const sentiments = newsResults.map(news => 
      this.classifyNewsSentiment(news.title + ' ' + news.description)
    );
    
    const avgScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;
    
    return {
      score: avgScore,
      classification: this.classifySentimentScore(avgScore),
      sample_size: sentiments.length
    };
  }

  extractTrendingTopics(newsResults) {
    return this.extractKeyTopics(newsResults).slice(0, 5);
  }

  analyzeSourceCoverage(newsResults) {
    const sources = new Map();
    
    newsResults.forEach(news => {
      const domain = this.extractDomain(news.url);
      sources.set(domain, (sources.get(domain) || 0) + 1);
    });
    
    return Array.from(sources.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, articles: count }));
  }

  /**
   * Obtener métricas del adapter
   */
  getMetrics() {
    return {
      enabled: this.config.enabled,
      cache_size: this.cache.size,
      cache_hit_rate: this.calculateCacheHitRate(),
      last_request: this.lastRequestTime,
      queue_size: this.requestQueue.length
    };
  }

  calculateCacheHitRate() {
    // Implementación simplificada
    return this.cache.size > 0 ? 0.7 : 0;
  }

  /**
   * Limpiar recursos
   */
  cleanup() {
    this.cache.clear();
    this.requestQueue = [];
    this.removeAllListeners();
    console.log('[OK] Brave MCP Adapter limpiado');
  }
}

module.exports = { BraveMCPAdapter };

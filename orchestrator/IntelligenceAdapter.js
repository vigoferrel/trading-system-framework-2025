"use strict";

/**
 * INTELLIGENCE ADAPTER ULTRA-SIMPLIFICADO
 * Solo los 3 componentes CRÍTICOS para maximizar ganancias en plano z = 9 + 16i:
 * 1. SRONA Unified Master - Coherencia cuántica
 * 2. Cadenas de Markov Primas - Predicción probabilística
 * 3. Feynman Path Integrals - Amplificación en plano complejo
 */

// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const { QuantumConstants } = require(process.cwd() + '/src/constants/quantum-constants');

// Usar constantes centralizadas con extensiones específicas del módulo
const PRIME_CONSTANTS = {
  // Importar constantes fundamentales del sistema centralizado
  ...QuantumConstants,

  // Extensiones específicas del orchestrator
  PRIMES: QuantumConstants.PRIMES, // Usar primos del sistema centralizado
  Z_MAGNITUDE: QuantumConstants.Z_MAGNITUDE // Usar magnitud del sistema centralizado
};

class IntelligenceAdapter {
  constructor() {
    this.systems = {};
    this.markovStates = new Map();
    this.cache = new Map();
    
    // Inicializar nuevos módulos de inteligencia
    this.marketIntelligence = null;
    this.braveAdapter = null;
    
    console.log('[ENDPOINTS] Intelligence Adapter Ultra-Simple inicializando...');
  }

  async initialize() {
    try {
      // 1. SRONA Unified Master (coherencia cuántica)
      try {
        const SronaUnifiedMaster = require('../quantum/srona-unified-master');
        this.systems.srona = new (SronaUnifiedMaster.SronaUnifiedMaster || SronaUnifiedMaster)();
        await this.systems.srona.initialize?.();
        console.log('[OK] SRONA Unified Master activo');
      } catch (e) {
        console.log('[WARNING] SRONA simulado');
        this.systems.srona = { executeUnifiedAnalysis: () => ({ scoreUnificado: 0.7 }) };
      }

      // 2. Feynman Path Integral Engine (amplificación z)
      try {
        const FeynmanEngine = require('../feynman-path-integral-engine-enhanced');
        this.systems.feynman = new (FeynmanEngine.FeynmanPathIntegralEngine || FeynmanEngine)();
        console.log('[OK] Feynman Path Integral activo');
      } catch (e) {
        console.log('[WARNING] Feynman simulado');
        this.systems.feynman = { state: { coherence_factor: 1.05 } };
      }

      // 3. Market Intelligence Engine (opcional)
      try {
        const { MarketIntelligenceEngine } = require('./MarketIntelligenceEngine');
        this.marketIntelligence = new MarketIntelligenceEngine({ updateInterval: 10 * 60 * 1000 });
        const marketInitialized = await this.marketIntelligence.initialize();
        if (marketInitialized) {
          console.log('[OK] Market Intelligence Engine activo');
        } else {
          console.log('[WARNING] Market Intelligence en modo fallback');
        }
      } catch (e) {
        console.log('[WARNING] Market Intelligence no disponible:', e.message);
      }

      // 4. Brave MCP Adapter (opcional)
      try {
        const { BraveMCPAdapter } = require('./BraveMCPAdapter');
        this.braveAdapter = new BraveMCPAdapter({ 
          apiKey: process.env.BRAVE_API_KEY,
          enabled: !!process.env.BRAVE_API_KEY 
        });
        const braveInitialized = await this.braveAdapter.initialize();
        if (braveInitialized) {
          console.log('[OK] Brave MCP Adapter activo');
        } else {
          console.log('[WARNING] Brave MCP deshabilitado (API key no configurada)');
        }
      } catch (e) {
        console.log('[WARNING] Brave MCP no disponible:', e.message);
      }

      this.initialized = true;
      console.log('[START] Sistemas críticos cargados - Listo para maximizar ganancias');
      
    } catch (error) {
      console.error('[ERROR] Error:', error.message);
      this.initialized = false;
    }
  }

  // Cadenas de Markov con números primos para predicción
  calculateMarkovPrimes(symbol) {
    const key = `markov:${symbol}`;
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.time < 20000) return cached.value;

    // Generar estados de Markov usando primas
    const seed = this.hashSymbol(symbol);
    const states = [];
    
    for (let i = 0; i < 4; i++) {
      const prime = PRIME_CONSTANTS.PRIMES[i];
      const phase = (seed + prime) * PRIME_CONSTANTS.LAMBDA_7919;
      
      // Transformación en plano z = 9 + 16i
      const real = PRIME_CONSTANTS.Z_REAL * Math.cos(phase);
      const imag = PRIME_CONSTANTS.Z_IMAG * Math.sin(phase);
      const magnitude = Math.hypot(real, imag);
      
      // Estado normalizado [0, 1]
      states.push(Math.abs(Math.sin(magnitude)) * Math.cos(phase));
    }

    // Probabilidad de transición Markov
    const markovScore = states.reduce((acc, val, idx) => {
      const weight = (PRIME_CONSTANTS.PRIMES[idx] % 100) / 100; // Peso normalizado
      return acc + (val * weight);
    }, 0) / states.length;

    const result = Math.max(0, Math.min(1, markovScore));
    this.cache.set(key, { value: result, time: Date.now() });
    
    return result;
  }

  // Hash determinista para símbolos
  hashSymbol(symbol) {
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = ((hash << 5) - hash) + symbol.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % PRIME_CONSTANTS.PRIMES[0]) + 1;
  }

  async getEnhancedScores(symbols) {
    if (!this.initialized) await this.initialize();

    const BATCH_SIZE = 50; // Procesar en lotes de 50 símbolos
    const MAX_CONCURRENT = 4; // Máximo 4 lotes paralelos
    
    // Dividir símbolos en lotes
    const batches = [];
    for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
      batches.push(symbols.slice(i, i + BATCH_SIZE));
    }

    console.log(`[START] Procesando ${symbols.length} símbolos en ${batches.length} lotes (batch size: ${BATCH_SIZE})`);
    
    const scores = {};
    
    // Procesar lotes en paralelo con límite de concurrencia
    for (let i = 0; i < batches.length; i += MAX_CONCURRENT) {
      const currentBatches = batches.slice(i, i + MAX_CONCURRENT);
      
      const batchPromises = currentBatches.map(async (batch, batchIndex) => {
        const actualBatchIndex = i + batchIndex;
        console.log(`[LIST] Procesando lote ${actualBatchIndex + 1}/${batches.length} (${batch.length} símbolos)`);
        
        const batchScores = {};
        
        // Pre-calcular scores de Markov para todo el lote (más eficiente)
        const markovScores = batch.map(symbol => ({
          symbol,
          score: this.calculateMarkovPrimes(symbol)
        }));
        
        // Procesar cada símbolo del lote
        for (let j = 0; j < batch.length; j++) {
          const symbol = batch[j];
          const markovScore = markovScores[j].score;
          
          try {
            // 1. SRONA Score (40% peso) - Cache para eficiencia
            let sronaScore = 0.7; // fallback
            const sronaCacheKey = `srona:${symbol}`;
            const cachedSrona = this.cache.get(sronaCacheKey);
            
            if (cachedSrona && Date.now() - cachedSrona.time < 60000) { // Cache 1 min
              sronaScore = cachedSrona.value;
            } else if (this.systems.srona) {
              try {
                const result = await this.systems.srona.executeUnifiedAnalysis?.({ symbol });
                sronaScore = Math.max(0.3, Math.min(1, result?.scoreUnificado || result?.coherenciaTotal || 0.7));
                this.cache.set(sronaCacheKey, { value: sronaScore, time: Date.now() });
              } catch (e) { /* silencioso */ }
            }

            // 2. Feynman Amplification (25% peso)
            let feynmanFactor = 1.0;
            if (this.systems.feynman?.state?.coherence_factor) {
              const coherence = this.systems.feynman.state.coherence_factor;
              feynmanFactor = 1 + ((coherence - 1) * PRIME_CONSTANTS.Z_MAGNITUDE / 100);
              feynmanFactor = Math.max(0.9, Math.min(1.2, feynmanFactor));
            }

            // FUSIÓN FINAL optimizada
            const fusedScore = (sronaScore * 0.40 + markovScore * 0.35 + sronaScore * markovScore * 0.25);
            const finalScore = fusedScore * feynmanFactor;
            
            // Transformación z final
            const zPhase = finalScore * PRIME_CONSTANTS.LAMBDA_7919;
            const zAmplification = 1 + (0.1 * Math.sin(zPhase));
            
            batchScores[symbol] = Math.max(0.1, Math.min(1, finalScore * zAmplification));
            
          } catch (error) {
            console.error(` Error ${symbol}:`, error.message);
            batchScores[symbol] = 0.6; // Fallback
          }
        }
        
        console.log(`[OK] Lote ${actualBatchIndex + 1} completado (${batch.length} símbolos)`);
        return batchScores;
      });
      
      // Esperar que se completen los lotes actuales
      const batchResults = await Promise.all(batchPromises);
      
      // Combinar resultados
      batchResults.forEach(batchScores => {
        Object.assign(scores, batchScores);
      });
      
      console.log(`[START] Progreso: ${Object.keys(scores).length}/${symbols.length} símbolos procesados`);
      
      // Pequeño delay entre grupos de lotes para evitar sobrecarga
      if (i + MAX_CONCURRENT < batches.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    const avgScore = Object.values(scores).reduce((a,b)=>a+b,0)/Object.keys(scores).length;
    console.log(`[ENDPOINTS] Enhanced scores completados: ${symbols.length} símbolos | Score promedio: ${avgScore.toFixed(3)}`);
    
    return scores;
  }

  /**
   * Obtener inteligencia de mercado para un símbolo específico
   */
  async getMarketIntelligence(symbol) {
    const intelligence = {
      symbol: symbol,
      timestamp: Date.now(),
      market_data: null,
      sentiment_analysis: null,
      news_analysis: null
    };

    // Market Intelligence Engine
    if (this.marketIntelligence) {
      try {
        intelligence.market_data = this.marketIntelligence.getMarketIntelligence(symbol);
      } catch (e) {
        console.warn('[WARNING] Error obteniendo market intelligence:', e.message);
      }
    }

    // Brave MCP Sentiment Analysis
    if (this.braveAdapter) {
      try {
        intelligence.sentiment_analysis = await this.braveAdapter.analyzeSymbolSentiment(symbol);
        intelligence.news_analysis = await this.braveAdapter.searchCryptoNews(symbol, { count: 3 });
      } catch (e) {
        console.warn('[WARNING] Error obteniendo sentiment analysis:', e.message);
      }
    }

    return intelligence;
  }

  /**
   * Obtener overview general del mercado
   */
  async getMarketOverview() {
    const overview = {
      timestamp: Date.now(),
      global_metrics: null,
      market_sentiment: null,
      news_overview: null
    };

    // Market Intelligence
    if (this.marketIntelligence) {
      try {
        overview.global_metrics = this.marketIntelligence.getMarketIntelligence();
      } catch (e) {
        console.warn('[WARNING] Error obteniendo global metrics:', e.message);
      }
    }

    // Brave MCP Overview
    if (this.braveAdapter) {
      try {
        overview.news_overview = await this.braveAdapter.getMarketOverview();
      } catch (e) {
        console.warn('[WARNING] Error obteniendo news overview:', e.message);
      }
    }

    return overview;
  }

  /**
   * Limpiar recursos de los nuevos módulos
   */
  cleanup() {
    if (this.marketIntelligence) {
      this.marketIntelligence.stop();
    }
    if (this.braveAdapter) {
      this.braveAdapter.cleanup();
    }
    this.cache.clear();
    console.log('[OK] Intelligence Adapter limpiado');
  }

  getSystemsStatus() {
    return {
      srona: !!this.systems.srona,
      feynman: !!this.systems.feynman,
      markov_primes: true,
      z_amplification: true,
      market_intelligence: !!this.marketIntelligence?.isRunning,
      brave_mcp: !!this.braveAdapter?.config?.enabled,
      initialized: this.initialized
    };
  }
}

module.exports = { IntelligenceAdapter };

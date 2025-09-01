
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

/**
 * Sistema de Opciones y Profundidad de Mercado
 * Integrado con Binance y el Sistema Cuántico
 */

class MarketDepthOptionsSystem {
    constructor(quantumSystem) {
        // Referencia al sistema cuántico existente
        this.quantumSystem = quantumSystem;
        
        // Control de opciones
        this.optionsControl = {
            activePairs: new Set(['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE']),
            optionChains: new Map(),
            greeksCalculator: this.initializeGreeksCalculator(),
            volatilitySurface: this.initializeVolatilitySurface()
        };

        // Profundidad de mercado
        this.marketDepth = {
            orderBook: new Map(),
            liquidityAnalysis: {},
            volumeProfile: {},
				marketImpact: {},
				futuresDepthCache: new Map()
        };

        // Estado de las opciones
        this.optionsState = {
            calls: new Map(),
            puts: new Map(),
            impliedVolatility: new Map(),
            openInterest: new Map()
        };

        // Análisis de mercado
        this.marketAnalysis = {
            orderFlowMetrics: this.initializeOrderFlowMetrics(),
            liquidityMetrics: this.initializeLiquidityMetrics(),
            volumetricAnalysis: this.initializeVolumetricAnalysis(),
            optionsMetrics: this.initializeOptionsMetrics()
        };

        // Sistema de trading avanzado
        this.tradingSystem = {
            spotExecution: this.initializeSpotExecution(),
            optionsExecution: this.initializeOptionsExecution(),
            hedgingSystem: this.initializeHedgingSystem(),
            riskManagement: this.initializeRiskManagement()
        };
        
        // Métricas mejoradas para el sistema cuántico
        this.enhancedMetrics = {
            darkSideSignals: 0,
            volatilityArbitrage: 0,
            liquidityCapture: 0,
            orderFlowPredicition: 0,
            gammaExposure: 0,
            vegaNeutral: 0
        };

					// Descubrimiento dinámico de universo en Futuros (USDT-M) por volumen
		this._universeDiscovery = {
			lastRunTs: 0,
			ttlMs: 120000, // refresco cada 2 minutos
			volumeThresholdQuote: 1_000_000, // >= 1M en quoteVolume 24h
			maxPairs: 30, // límite de símbolos activos simultáneos
			lastUniverse: []
		};

		//  LEONARDO CONSCIOUSNESS ENGINE INTEGRATION
		try {
			const LeonardoConsciousnessEngine = require('./leonardo-consciousness-engine');
			this.leonardoEngine = new LeonardoConsciousnessEngine({
				MAX_LEVERAGE: 100.0,        // Leverage máximo para DarkSide
				CONSCIOUSNESS_TARGET: 0.941, // 94.1% objetivo
				LAMBDA_888_RESONANCE: 0.888,
				WIN_RATE_TARGET: 0.888
			});
			console.log('[DarkSide]  Leonardo Consciousness Engine integrado');
			
			// Escuchar eventos Leonardo
			this.leonardoEngine.on('bigBangActivated', (data) => {
				this.handleLeonardoBigBang(data);
			});
			
			this.leonardoEngine.on('leonardoInitialized', (state) => {
				console.log('[DarkSide]  Leonardo Consciousness initialized:', 
					`${(state.consciousness_level * 100).toFixed(1)}%`);
			});
			
		} catch (e) {
			this.leonardoEngine = null;
			console.warn('[DarkSide] Leonardo Engine no disponible:', e?.message || e);
		}

		//  QUANTUM LEVERAGE MATRIX INTEGRATION
		try {
			const QuantumLeverageMatrix = require('./quantum-leverage-matrix');
			this.leverageMatrix = new QuantumLeverageMatrix({
				MAX_LEVERAGE_GLOBAL: 125,
				MAX_TOTAL_EXPOSURE: 30.0,    // 3000% exposición máxima
				CONSCIOUSNESS_THRESHOLD: 0.85
			});
			console.log('[DarkSide]   Quantum Leverage Matrix integrado');
		} catch (e) {
			this.leverageMatrix = null;
			console.warn('[DarkSide] Leverage Matrix no disponible:', e?.message || e);
		}
	}

    /**
     * Inicialización del calculador de Greeks
     */
    initializeGreeksCalculator() {
        return {
            // Cálculo de Delta
            calculateDelta: (option, spot, strike, time, rate, vol) => {
                // Implementación de Black-Scholes para Delta
                const d1 = this.calculateD1(spot, strike, time, rate, vol);
                return option.type === 'call' ? 
                    this.normalCDF(d1) : 
                    this.normalCDF(d1) - 1;
            },

            // Cálculo de Gamma
            calculateGamma: (spot, strike, time, rate, vol) => {
                const d1 = this.calculateD1(spot, strike, time, rate, vol);
                return Math.exp(-Math.pow(d1, 2) / 2) / 
                    (spot * vol * Math.sqrt(time) * Math.sqrt(2 * Math.PI));
            },

            // Cálculo de Theta
            calculateTheta: (option, spot, strike, time, rate, vol) => {
                const d1 = this.calculateD1(spot, strike, time, rate, vol);
                const d2 = d1 - vol * Math.sqrt(time);
                const theta = -spot * vol * Math.exp(-Math.pow(d1, 2) / 2) / 
                    (2 * Math.sqrt(time) * Math.sqrt(2 * Math.PI));
                
                return option.type === 'call' ?
                    theta - rate * strike * Math.exp(-rate * time) * this.normalCDF(d2) :
                    theta + rate * strike * Math.exp(-rate * time) * this.normalCDF(-d2);
            },

            // Cálculo de Vega
            calculateVega: (spot, strike, time, rate, vol) => {
                const d1 = this.calculateD1(spot, strike, time, rate, vol);
                return spot * Math.sqrt(time) * Math.exp(-Math.pow(d1, 2) / 2) / 
                    Math.sqrt(2 * Math.PI);
            },

            // Cálculo de Rho
            calculateRho: (option, spot, strike, time, rate, vol) => {
                const d1 = this.calculateD1(spot, strike, time, rate, vol);
                const d2 = d1 - vol * Math.sqrt(time);
                
                return option.type === 'call' ?
                    strike * time * Math.exp(-rate * time) * this.normalCDF(d2) :
                    -strike * time * Math.exp(-rate * time) * this.normalCDF(-d2);
            }
        };
    }

    /**
     * Cálculo de d1 para Black-Scholes
     */
    calculateD1(spot, strike, time, rate, vol) {
        return (Math.log(spot / strike) + (rate + 0.5 * vol * vol) * time) / 
               (vol * Math.sqrt(time));
    }

    /**
     * Función de distribución normal acumulativa
     */
    normalCDF(x) {
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x) / Math.sqrt(2.0);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return 0.5 * (1.0 + sign * y);
    }

    /**
     * Inicialización de la superficie de volatilidad
     */
    initializeVolatilitySurface() {
        return {
            // Matriz de volatilidad
            matrix: new Map(),
            
            // Interpolación de volatilidad
            interpolate: (strike, expiry) => {
                // Implementar interpolación bicúbica
                return this.bicubicInterpolation(strike, expiry);
            },

            // Actualización de superficie
            update: async (marketData) => {
                await this.updateVolatilitySurface(marketData);
            },

            // Calibración de modelo
            calibrate: async () => {
                await this.calibrateVolatilityModel();
            }
        };
    }

    /**
     * Inicialización de métricas de flujo de órdenes
     */
    initializeOrderFlowMetrics() {
        return {
            // Análisis de VSR (Volume Support Resistance)
            vsr: {
                levels: [],
                strength: new Map(),
                clusters: []
            },

            // Análisis CVD (Cumulative Volume Delta)
            cvd: {
                current: 0,
                history: [],
                divergence: []
            },

            // Order Flow Imbalance
            imbalance: {
                instant: 0,
                moving: [],
                threshold: 0.7
            }
        };
    }

    /**
     * Inicialización de métricas de liquidez
     */
    initializeLiquidityMetrics() {
        return {
            // Profundidad por nivel
            depthByLevel: new Map(),

            // Libro de órdenes en tiempo real
            orderBook: {
                bids: new Map(),
                asks: new Map(),
                spread: 0
            },

            // Análisis de liquidez
            analysis: {
                immediacy: 0,
                resilience: 0,
                depth: 0,
                tightness: 0
            }
        };
    }

    /**
     * Inicialización de análisis volumétrico
     */
    initializeVolumetricAnalysis() {
        return {
            // Perfil de volumen
            volumeProfile: {
                poc: 0,                // Point of Control
                valueArea: {
                    high: 0,
                    low: 0
                },
                nodes: new Map()
            },

            // Análisis de liquidez
            liquidity: {
                buyingSurplus: 0,
                sellingSurplus: 0,
                netFlow: 0
            },

            // Clusters de volumen
            clusters: {
                support: [],
                resistance: [],
                neutral: []
            }
        };
    }

    /**
     * Inicialización de métricas de opciones
     */
    initializeOptionsMetrics() {
        return {
            // Análisis de volatilidad implícita
            impliedVolatility: {
                surface: new Map(),
                skew: new Map(),
                term: new Map()
            },

            // Análisis de flujo de opciones
            optionsFlow: {
                callVolume: new Map(),
                putVolume: new Map(),
                putCallRatio: 0
            },

            // Análisis de posicionamiento
            positioning: {
                openInterest: new Map(),
                netDelta: 0,
                gammaExposure: new Map()
            }
        };
    }

    /**
     * Inicialización de ejecución spot
     */
    initializeSpotExecution() {
        return {
            execute: async (signal) => {
                return await this.executeSpotOrder(signal);
            },
            
            update: async () => {
                await this.updateSpotExecution();
            }
        };
    }

    /**
     * Inicialización de ejecución de opciones
     */
    initializeOptionsExecution() {
        return {
            execute: async (signal) => {
                return await this.executeOptionsOrder(signal);
            },
            
            update: async () => {
                await this.updateOptionsExecution();
            }
        };
    }

    /**
     * Inicialización de sistema de cobertura
     */
    initializeHedgingSystem() {
        return {
            calculateHedge: (position) => {
                return this.calculateOptimalHedge(position);
            },
            
            executeHedge: async (hedge) => {
                return await this.executeHedgePosition(hedge);
            },
            
            update: async () => {
                await this.updateHedgingSystem();
            }
        };
    }

    /**
     * Inicialización de gestión de riesgo
     */
    initializeRiskManagement() {
        return {
            calculateVaR: (positions) => {
                return this.calculateValueAtRisk(positions);
            },
            
            calculateExposure: (positions) => {
                return this.calculateTotalExposure(positions);
            },
            
            update: async () => {
                await this.updateRiskManagement();
            }
        };
    }

    /**
     * Interpolación bicúbica para superficie de volatilidad
     */
    bicubicInterpolation(strike, expiry) {
        // Implementación simplificada de interpolación bicúbica
        // En un entorno real, esto sería más complejo y utilizaría datos reales
        const baseVol = 0.8; // 80% volatilidad base
        const strikeAdjustment = Math.log(strike / 100) * 0.1;
        const expiryAdjustment = Math.sqrt(expiry / 365) * 0.2;
        
        return Math.max(0.1, baseVol + strikeAdjustment + expiryAdjustment);
    }

    /**
     * Actualización de superficie de volatilidad
     */
    async updateVolatilitySurface(marketData) {
        // En un entorno real, esto calibraría la superficie con datos de mercado
        console.log('[DarkSide] Actualizando superficie de volatilidad...');
    }

    /**
     * Calibración del modelo de volatilidad
     */
    async calibrateVolatilityModel() {
        // En un entorno real, esto calibraría el modelo con datos de mercado
        console.log('[DarkSide] Calibrando modelo de volatilidad...');
    }

    /**
     * Actualización de estado del mercado
     */
		async updateMarketState() {
        try {
				// Expandir horizontalmente en Futuros: descubrir símbolos de alto volumen
				await this._ensureFuturesUniverse();

            // Actualizar profundidad de mercado
            await this.updateMarketDepth();

            // Actualizar estado de opciones
            await this.updateOptionsState();

            // Actualizar análisis de mercado
            await this.updateMarketAnalysis();

            // Actualizar sistema de trading
            await this.updateTradingSystem();

            // Integrar con el sistema cuántico
            await this.integrateWithQuantumSystem();

        		} catch (error) {
			console.error('Error updating market state:', error);
			throw error;
		}
	}

	/**
	 *  INTEGRACIÓN LEONARDO + ANÁLISIS CUÁNTICO COMPLETO
	 */
	async performLeonardoQuantumAnalysis() {
		if (!this.leonardoEngine) return null;
		
		try {
			// Obtener datos de mercado del universo activo
			const marketData = await this.getActiveUniverseMarketData();
			
			// Ejecutar análisis Leonardo completo
			const leonardoAnalysis = await this.leonardoEngine.performLeonardoAnalysis(marketData);
			
			if (!leonardoAnalysis) return null;
			
			// Calcular leverage cuántico para señales Leonardo
			const quantumSignals = [];
			if (this.leverageMatrix && leonardoAnalysis.trading_signals) {
				for (const signal of leonardoAnalysis.trading_signals) {
					const systemState = {
						consciousness_level: leonardoAnalysis.consciousness_level,
						quantum_coherence: this.quantumSystem?.getSystemStatus?.()?.quantumEngine?.engineState?.overallCoherence || 0,
						big_bang_active: leonardoAnalysis.big_bang_ready,
						market_volatility: marketData[signal.symbol.replace('USDT', '')]?.volatility || 0
					};
					
					const leverageCalc = this.leverageMatrix.calculateQuantumLeverage(
						signal.symbol,
						signal,
						systemState
					);
					
					quantumSignals.push({
						...signal,
						quantum_leverage: leverageCalc.leverage,
						position_size: leverageCalc.position_size,
						leverage_tier: leverageCalc.tier,
						leverage_rationale: leverageCalc.rationale,
						risk_level: leverageCalc.leverage > 75 ? 'EXTREME' : leverageCalc.leverage > 50 ? 'HIGH' : 'MODERATE'
					});
				}
			}
			
			// Almacenar análisis en métricas mejoradas
			this.enhancedMetrics.leonardoConsciousness = leonardoAnalysis.consciousness_level;
			this.enhancedMetrics.leonardoBigBangReady = leonardoAnalysis.big_bang_ready;
			this.enhancedMetrics.leonardoSignalsCount = quantumSignals.length;
			this.enhancedMetrics.quantumLeverageOpportunities = quantumSignals.filter(s => s.quantum_leverage > 50).length;
			
			return {
				leonardo_analysis: leonardoAnalysis,
				quantum_signals: quantumSignals,
				high_leverage_opportunities: quantumSignals.filter(s => s.quantum_leverage > 50),
				extreme_leverage_opportunities: quantumSignals.filter(s => s.quantum_leverage > 100),
				consciousness_level: leonardoAnalysis.consciousness_level,
				big_bang_ready: leonardoAnalysis.big_bang_ready
			};
			
		} catch (error) {
			console.error('[DarkSide] Error in Leonardo Quantum Analysis:', error.message);
			return null;
		}
	}

	/**
	 *  HANDLER BIG BANG LEONARDO
	 */
	handleLeonardoBigBang(data) {
		console.log(' [DarkSide] BIG BANG LEONARDO ACTIVATED!');
		console.log(`  Consciencia: ${(data.consciousness * 100).toFixed(1)}%`);
		
		// Activar modo extremo en sistema cuántico
		this.enhancedMetrics.bigBangActivations = (this.enhancedMetrics.bigBangActivations || 0) + 1;
		this.enhancedMetrics.leonardoBigBangActive = true;
		
		// Notificar al sistema principal
		if (this.quantumSystem && typeof this.quantumSystem.emit === 'function') {
			this.quantumSystem.emit('leonardoBigBang', {
				consciousness: data.consciousness,
				conditions: data.conditions,
				timestamp: data.timestamp,
				source: 'DarkSide.Leonardo'
			});
		}
	}

	/**
	 * [MONEY] OBTENER DATOS DE MERCADO DEL UNIVERSO ACTIVO
	 */
	async getActiveUniverseMarketData() {
		const marketData = {};
		const connector = this.quantumSystem?.binanceConnector;
		
		if (!connector) return marketData;
		
		// Obtener datos para símbolos activos (máximo 15 para evitar rate limits)
		const activeSymbols = Array.from(this.optionsControl.activePairs).slice(0, 15);
		
		for (const symbol of activeSymbols) {
			try {
				const ticker24hr = await connector.getFutures24hrTicker(`${symbol}USDT`);
				if (ticker24hr) {
					marketData[symbol] = {
						price: Number(ticker24hr.lastPrice || 0),
						volume: Number(ticker24hr.volume || 0),
						quoteVolume: Number(ticker24hr.quoteVolume || 0),
						change: Number(ticker24hr.priceChangePercent || 0),
						volatility: this.calculateVolatilityFromTicker(ticker24hr),
						trades: Number(ticker24hr.count || 0)
					};
				}
			} catch (error) {
				// Skip errores individuales para no interrumpir el flujo
				continue;
			}
		}
		
		return marketData;
	}

	/**
	 * [DATA] CALCULAR VOLATILIDAD DESDE TICKER 24H
	 */
	calculateVolatilityFromTicker(ticker) {
		const high = Number(ticker.highPrice || 0);
		const low = Number(ticker.lowPrice || 0);
		const close = Number(ticker.lastPrice || 0);
		
		if (high <= 0 || low <= 0 || close <= 0) return 0;
		
		// True Range como proxy de volatilidad
		const trueRange = (high - low) / close;
		return Math.min(0.5, Math.max(0, trueRange)); // Cap a 50%
	}

	/**
	 * [ENDPOINTS] OBTENER TOP OPORTUNIDADES LEONARDO
	 */
	async getTopLeonardoOpportunities(limit = 10) {
		const analysis = await this.performLeonardoQuantumAnalysis();
		if (!analysis || !analysis.quantum_signals) return [];
		
		// Ordenar por leverage * confidence para encontrar mejores oportunidades
		const scored = analysis.quantum_signals.map(signal => ({
			...signal,
			opportunity_score: signal.quantum_leverage * signal.confidence
		}));
		
		scored.sort((a, b) => b.opportunity_score - a.opportunity_score);
		return scored.slice(0, limit);
	}
		/**
		 * Garantiza la actualización periódica del universo de Futuros por volumen (USDT-M)
		 */
		async _ensureFuturesUniverse() {
			try {
				const now = Date.now();
				if (now - this._universeDiscovery.lastRunTs < this._universeDiscovery.ttlMs) return;
				await this._refreshFuturesUniverseByVolume();
				this._universeDiscovery.lastRunTs = Date.now();
			} catch (e) {
				try { console.warn('[DarkSide] Universe refresh skipped:', e.message); } catch (_) {}
			}
		}

		/**
		 * Refresca `activePairs` con todos los símbolos USDT-M cuya quoteVolume 24h >= umbral.
		 * Prioriza pares con mayor liquidez y momentum de precio para extraer mayor jugo cuántico.
		 */
		async _refreshFuturesUniverseByVolume() {
			const connector = this.quantumSystem?.binanceConnector;
			if (!connector || typeof connector.getFutures24hrTicker !== 'function') return;

			// Obtener tickers 24h (array) desde FAPI
			let tickers;
			try {
				tickers = await connector.getFutures24hrTicker();
			} catch (e) {
				// Respetar backoff externo del conector
				throw e;
			}
			if (!Array.isArray(tickers) || tickers.length === 0) return;

			// Filtrar símbolos USDT y calcular score cuántico de liquidez/momentum
			const universe = [];
			const validSymbols = new Set(['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'DOT', 'LINK', 'MATIC', 'UNI', 'LTC', 'BCH', 'ATOM', 'NEAR', 'FTM', 'ALGO', 'VET', 'ICP', 'FIL', 'THETA', 'XLM', 'TRX', 'EOS', 'AAVE', 'SUSHI', 'SNX', 'COMP', 'MKR', 'YFI']);
			
			for (const t of tickers) {
				const sym = String(t?.symbol || '');
				if (!sym.endsWith('USDT')) continue;
				const base = sym.replace(/USDT$/, '');
				
				// Solo incluir símbolos válidos conocidos
				if (!validSymbols.has(base)) continue;
				
				const qv = Number(t?.quoteVolume || 0);
				if (!Number.isFinite(qv) || qv < this._universeDiscovery.volumeThresholdQuote) continue;
				const chPct = Number(t?.priceChangePercent || 0); // proxy de momentum/volatilidad
				const trades = Number(t?.count || 0);
				const vol = Number(t?.volume || 0);

				// Score cuántico simple: peso log(líquidez) + momentum moderado + difusión de trades
				const liquidityScore = Math.log10(Math.max(1, qv));
				const momentumScore = Math.min(1.0, Math.abs(chPct) / 10); // cap a 10% -> 1.0
				const activityScore = Math.log10(Math.max(1, trades)) / 5; // normalizado ~0..1
				const dispersionScore = Math.log10(Math.max(1, vol)) / 6;  // proxy de distribución
				const quantumScore = 0.55 * liquidityScore + 0.25 * momentumScore + 0.15 * activityScore + 0.05 * dispersionScore;

				universe.push({ base, symbol: sym, quoteVolume: qv, priceChangePercent: chPct, count: trades, volume: vol, quantumScore });
			}

			// Ordenar por score y recortar al máximo permitido
			universe.sort((a, b) => b.quantumScore - a.quantumScore);
			const selected = universe.slice(0, this._universeDiscovery.maxPairs);

			// Unión con activos núcleo para estabilidad del sistema
			const core = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE'];
			const newSet = new Set(core);
			for (const u of selected) newSet.add(u.base);

			// Actualizar pares activos
			this.optionsControl.activePairs = newSet;

			// Exponer universo y métricas para el resto del sistema / frontend
			this.marketAnalysis.highVolumeUniverse = {
				updatedAt: Date.now(),
				thresholdQuoteVolume: this._universeDiscovery.volumeThresholdQuote,
				selected: selected,
				count: selected.length
			};
			this._universeDiscovery.lastUniverse = selected.map(s => s.symbol);

			try {
				console.log(`[DarkSide] Universo Futuros actualizado: ${selected.length} símbolos (umbral  ${this._universeDiscovery.volumeThresholdQuote})`);
			} catch (_) {}
		}

    /**
     * Actualización de profundidad de mercado
     */
		async updateMarketDepth() {
			// Si hay conector y universo Futuros, usar depth real para los top símbolos por volumen
			const connector = this.quantumSystem?.binanceConnector;
			const useRealDepth = !!connector && typeof connector.getFuturesDepth === 'function';
			const active = Array.from(this.optionsControl.activePairs || []);
			const topUniverse = Array.isArray(this.marketAnalysis?.highVolumeUniverse?.selected) ? this.marketAnalysis.highVolumeUniverse.selected : [];
			const topSet = new Set(topUniverse.slice(0, 10).map(x => String(x.symbol).replace(/USDT$/, '')));

			for (const pair of active) {
				let orderBook;
			if (useRealDepth && topSet.has(String(pair))) {
				try { orderBook = await this._getFuturesOrderBookReal(`${pair}USDT`, 50); } catch(_) { orderBook = null; }
			} else {
				try { orderBook = await this.fetchOrderBook(pair); } catch(_) { orderBook = null; }
			}

			if (!orderBook || !Array.isArray(orderBook?.bids) || !Array.isArray(orderBook?.asks)) {
				// Fallback seguro si no hay OB válido
				orderBook = { bids: [], asks: [] };
			}

		const liquidityAnalysis = this.analyzeLiquidity(orderBook);
				await this.updateVolumeProfile(pair);
				const marketImpact = this.calculateMarketImpact(orderBook);

				this.marketDepth.orderBook.set(pair, orderBook);
				this.marketDepth.liquidityAnalysis[pair] = liquidityAnalysis;
				this.marketDepth.marketImpact[pair] = marketImpact;
			}
		}

		/**
		 * Depth real de Futuros con cache TTL corto para top símbolos
		 */
		async _getFuturesOrderBookReal(symbol, limit = 50) {
			const cacheKey = `${symbol}_${limit}`;
			const now = Date.now();
			const cache = this.marketDepth.futuresDepthCache;
			const hit = cache.get(cacheKey);
			if (hit && (now - hit.ts) < 5000) return hit.data; // 5s TTL

			const connector = this.quantumSystem?.binanceConnector;
			const raw = await connector.getFuturesDepth(symbol, limit);
			const data = {
				bids: (raw?.bids || []).map(([price, qty]) => ({ price: Number(price), amount: Number(qty) })),
				asks: undefined,
				asks_: raw?.asks,
				asks2: raw?.asks
			};
			data.asks = (raw?.asks || []).map(([price, qty]) => ({ price: Number(price), amount: Number(qty) }));
			cache.set(cacheKey, { data, ts: now });
			return data;
		}

    /**
     * Obtener libro de órdenes (simulado)
     */
    async fetchOrderBook(pair) {
        // En un entorno real, esto obtendría datos reales de Binance
        return {
            bids: [
                { price: 100, amount: 10 },
                { price: 99, amount: 15 },
                { price: 98, amount: 20 }
            ],
            asks: [
                { price: 101, amount: 10 },
                { price: 102, amount: 15 },
                { price: 103, amount: 20 }
            ]
        };
    }

    /**
     * Analizar liquidez
     */
    analyzeLiquidity(orderBook) {
        try {
            const safe = (ob) => ({
                bids: Array.isArray(ob?.bids) ? ob.bids.filter(b => b && Number.isFinite(b.price) && Number.isFinite(b.amount)) : [],
                asks: Array.isArray(ob?.asks) ? ob.asks.filter(a => a && Number.isFinite(a.price) && Number.isFinite(a.amount)) : []
            });
            const ob = safe(orderBook);
            const hasBids = ob.bids.length > 0;
            const hasAsks = ob.asks.length > 0;
            const bidDepth = hasBids ? ob.bids.reduce((sum, bid) => sum + Number(bid.amount||0), 0) : 0;
            const askDepth = hasAsks ? ob.asks.reduce((sum, ask) => sum + Number(ask.amount||0), 0) : 0;
            const bestBid = hasBids ? Number(ob.bids[0].price || 0) : 0;
            const bestAsk = hasAsks ? Number(ob.asks[0].price || 0) : 0;
            const spread = (hasBids && hasAsks) ? (bestAsk - bestBid) : 0;
            const spreadPct = (hasBids && bestBid > 0) ? (spread / bestBid) : 0;
            return {
                bidDepth,
                askDepth,
                totalDepth: bidDepth + askDepth,
                spread,
                spreadPercentage: spreadPct,
                valid: hasBids && hasAsks
            };
        } catch (_) {
            return { bidDepth: 0, askDepth: 0, totalDepth: 0, spread: 0, spreadPercentage: 0, valid: false };
        }
    }

    /**
     * Actualizar perfil de volumen
     */
    async updateVolumeProfile(pair) {
        // En un entorno real, esto actualizaría el perfil de volumen con datos reales
        this.marketAnalysis.volumetricAnalysis.volumeProfile.poc = 100;
        this.marketAnalysis.volumetricAnalysis.volumeProfile.valueArea = { high: 105, low: 95 };
    }

    /**
     * Calcular impacto de mercado
     */
    calculateMarketImpact(orderBook) {
        try {
            const ob = {
                bids: Array.isArray(orderBook?.bids) ? orderBook.bids : [],
                asks: Array.isArray(orderBook?.asks) ? orderBook.asks : []
            };
            const denom = (n) => (n === 0 ? 1 : n);
            const avg = (arr, accessor) => {
                if (!Array.isArray(arr) || arr.length === 0) return 0;
                let num = 0, den = 0;
                for (let i = 0; i < arr.length; i++) { const w = (i + 1); num += accessor(arr[i]) * w; den += w; }
                return num / denom(den);
            };
            const bestBid = (ob.bids[0] && Number.isFinite(ob.bids[0].price)) ? Number(ob.bids[0].price) : 0;
            const bestAsk = (ob.asks[0] && Number.isFinite(ob.asks[0].price)) ? Number(ob.asks[0].price) : 0;
            const avgBidPrice = avg(ob.bids, (b) => Number(b.price||0));
            const avgAskPrice = avg(ob.asks, (a) => Number(a.price||0));
            const bidImpact = (bestBid > 0) ? ((avgBidPrice - bestBid) / bestBid) : 0;
            const askImpact = (bestAsk > 0) ? ((avgAskPrice - bestAsk) / bestAsk) : 0;
            return { bidImpact, askImpact };
        } catch (_) {
            return { bidImpact: 0, askImpact: 0 };
        }
    }

		/**
		 * Puntaje de edge cuántico por par usando depth real (si disponible)
		 */
		calculateQuantumEdgeScore(pair) {
			try {
				const ob = this.marketDepth.orderBook.get(pair);
				if (!ob || !Array.isArray(ob.bids) || !Array.isArray(ob.asks) || ob.bids.length === 0 || ob.asks.length === 0) return 0;
				const bestBid = ob.bids[0];
				const bestAsk = ob.asks[0];
				const spreadPct = Math.max(0, (bestAsk.price - bestBid.price) / bestBid.price);
				const bidDepth = ob.bids.slice(0, 10).reduce((s, x) => s + x.amount, 0);
				const askDepth = ob.asks.slice(0, 10).reduce((s, x) => s + x.amount, 0);
				const imbalance = (bidDepth - askDepth) / Math.max(1e-9, bidDepth + askDepth);
				const depthScore = Math.log10(1 + bidDepth + askDepth);
				const tightnessScore = 1 / Math.max(1e-6, spreadPct * 100); // spreads más chicos -> mayor score
				// edgeScore: profundidad y desequilibrio, penalizando spread
				const edgeScore = Math.max(0, 0.6 * depthScore + 0.3 * Math.abs(imbalance) + 0.1 * tightnessScore);
				return edgeScore;
			} catch (_) {
				return 0;
			}
		}

		/**
		 * Top oportunidades por edge calculado
		 */
		getTopQuantumEdges(limit = 10) {
			const pairs = Array.from(this.optionsControl.activePairs || []);
			const scored = pairs.map(p => ({ pair: p, edge: this.calculateQuantumEdgeScore(p) }));
			scored.sort((a, b) => b.edge - a.edge);
			return scored.slice(0, limit);
		}

    /**
     * Actualización de estado de opciones
     */
    async updateOptionsState() {
        // Actualizar cadenas de opciones
        for (const [pair, chain] of this.optionsControl.optionChains) {
            // Obtener datos de mercado (simulados)
            const marketData = await this.fetchOptionsMarketData(pair);

            // Actualizar volatilidad implícita
            await this.updateImpliedVolatility(pair, marketData);

            // Actualizar Greeks
            await this.updateGreeks(pair, marketData);

            // Actualizar open interest
            await this.updateOpenInterest(pair, marketData);
        }

        // Actualizar superficie de volatilidad
        await this.optionsControl.volatilitySurface.update();
    }

    /**
     * Obtener datos de mercado de opciones (simulados)
     */
    async fetchOptionsMarketData(pair) {
        // En un entorno real, esto obtendría datos reales de Binance Options
        return {
            spot: 100,
            options: [
                { type: 'call', strike: 95, expiry: 30, premium: 7.5, iv: 0.85 },
                { type: 'call', strike: 100, expiry: 30, premium: 4.2, iv: 0.82 },
                { type: 'call', strike: 105, expiry: 30, premium: 2.1, iv: 0.79 },
                { type: 'put', strike: 95, expiry: 30, premium: 1.8, iv: 0.78 },
                { type: 'put', strike: 100, expiry: 30, premium: 3.5, iv: 0.81 },
                { type: 'put', strike: 105, expiry: 30, premium: 6.8, iv: 0.84 }
            ]
        };
    }

    /**
     * Actualizar volatilidad implícita
     */
    async updateImpliedVolatility(pair, marketData) {
        // En un entorno real, esto calcularía la volatilidad implícita a partir de precios de opciones
        const ivSurface = {};
        
        for (const option of marketData.options) {
            const key = `${option.type}_${option.strike}_${option.expiry}`;
            ivSurface[key] = option.iv;
        }
        
        this.optionsState.impliedVolatility.set(pair, ivSurface);
    }

    /**
     * Actualizar Greeks
     */
    async updateGreeks(pair, marketData) {
        // Calcular Greeks para cada opción
        const greeks = {};
        const spot = marketData.spot;
        const rate = 0.02; // 2% tasa de interés
        
        for (const option of marketData.options) {
            const time = option.expiry / 365;
            const vol = option.iv;
            
            const key = `${option.type}_${option.strike}_${option.expiry}`;
            greeks[key] = {
                delta: this.optionsControl.greeksCalculator.calculateDelta(option, spot, option.strike, time, rate, vol),
                gamma: this.optionsControl.greeksCalculator.calculateGamma(spot, option.strike, time, rate, vol),
                theta: this.optionsControl.greeksCalculator.calculateTheta(option, spot, option.strike, time, rate, vol),
                vega: this.optionsControl.greeksCalculator.calculateVega(spot, option.strike, time, rate, vol),
                rho: this.optionsControl.greeksCalculator.calculateRho(option, spot, option.strike, time, rate, vol)
            };
        }
        
        // Guardar Greeks en el estado
        if (!this.optionsState.calls.has(pair)) {
            this.optionsState.calls.set(pair, new Map());
        }
        if (!this.optionsState.puts.has(pair)) {
            this.optionsState.puts.set(pair, new Map());
        }
        
        for (const [key, greek] of Object.entries(greeks)) {
            const [type, strike, expiry] = key.split('_');
            
            if (type === 'call') {
                this.optionsState.calls.get(pair).set(`${strike}_${expiry}`, greek);
            } else {
                this.optionsState.puts.get(pair).set(`${strike}_${expiry}`, greek);
            }
        }
    }

    /**
     * Actualizar open interest
     */
    async updateOpenInterest(pair, marketData) {
        // En un entorno real, esto obtendría el open interest real de Binance
        const openInterest = {};
        
        for (const option of marketData.options) {
            const key = `${option.type}_${option.strike}_${option.expiry}`;
            // Simular open interest
            openInterest[key] = Math.floor((Date.now() % 10000)) + 1000;
        }
        
        this.optionsState.openInterest.set(pair, openInterest);
    }

    /**
     * Actualización de análisis de mercado
     */
    async updateMarketAnalysis() {
        // Actualizar métricas de flujo de órdenes
        await this.updateOrderFlowMetrics();

        // Actualizar métricas de liquidez
        await this.updateLiquidityMetrics();

        // Actualizar análisis volumétrico
        await this.updateVolumetricAnalysis();

        // Actualizar métricas de opciones
        await this.updateOptionsMetrics();
    }

    /**
     * Actualizar métricas de flujo de órdenes
     */
    async updateOrderFlowMetrics() {
        // En un entorno real, esto analizaría el flujo de órdenes en tiempo real
        const vsr = this.marketAnalysis.orderFlowMetrics.vsr;
        const cvd = this.marketAnalysis.orderFlowMetrics.cvd;
        const imbalance = this.marketAnalysis.orderFlowMetrics.imbalance;
        
        // Simular actualización de VSR
        vsr.levels = [95, 100, 105];
        vsr.strength.set('95', 0.8);
        vsr.strength.set('100', 0.9);
        vsr.strength.set('105', 0.7);
        
        // Simular actualización de CVD
        cvd.current += ((Date.now() % 100 - 50) / 100) * 10;
        cvd.history.push(cvd.current);
        if (cvd.history.length > 100) cvd.history.shift();
        
        // Simular actualización de imbalance
        imbalance.instant = ((Date.now() % 100 - 50) / 100) * 2;
        imbalance.moving.push(imbalance.instant);
        if (imbalance.moving.length > 20) imbalance.moving.shift();
    }

    /**
     * Actualizar métricas de liquidez
     */
    async updateLiquidityMetrics() {
        // En un entorno real, esto analizaría la liquidez en tiempo real
        const liquidity = this.marketAnalysis.liquidityMetrics;
        
        // Actualizar análisis de liquidez
        liquidity.analysis.immediacy = ((Date.now() % 100) / 100);
        liquidity.analysis.resilience = ((Date.now() % 100) / 100);
        liquidity.analysis.depth = ((Date.now() % 100) / 100);
        liquidity.analysis.tightness = ((Date.now() % 100) / 100);
    }

    /**
     * Actualizar análisis volumétrico
     */
    async updateVolumetricAnalysis() {
        // En un entorno real, esto analizaría el volumen en tiempo real
        const volumetric = this.marketAnalysis.volumetricAnalysis;
        
        // Actualizar análisis de liquidez
        volumetric.liquidity.buyingSurplus = ((Date.now() % 100) / 100) * 100;
        volumetric.liquidity.sellingSurplus = ((Date.now() % 100) / 100) * 100;
        volumetric.liquidity.netFlow = volumetric.liquidity.buyingSurplus - volumetric.liquidity.sellingSurplus;
        
        // Actualizar clusters
        volumetric.clusters.support = [95, 90];
        volumetric.clusters.resistance = [105, 110];
        volumetric.clusters.neutral = [100];
    }

    /**
     * Actualizar métricas de opciones
     */
    async updateOptionsMetrics() {
        // En un entorno real, esto analizaría las opciones en tiempo real
        const options = this.marketAnalysis.optionsMetrics;
        
        // Actualizar análisis de volatilidad implícita
        for (const pair of this.optionsControl.activePairs) {
            const iv = this.optionsState.impliedVolatility.get(pair);
            if (iv) {
                options.impliedVolatility.surface.set(pair, iv);
            }
        }
        
        // Actualizar análisis de flujo de opciones
        let totalCallVolume = 0;
        let totalPutVolume = 0;
        
        for (const pair of this.optionsControl.activePairs) {
            const callVolume = ((Date.now() % 1000) / 1000) * 1000;
            const putVolume = ((Date.now() % 1000) / 1000) * 1000;
            
            options.optionsFlow.callVolume.set(pair, callVolume);
            options.optionsFlow.putVolume.set(pair, putVolume);
            
            totalCallVolume += callVolume;
            totalPutVolume += putVolume;
        }
        
        options.optionsFlow.putCallRatio = totalPutVolume / totalCallVolume;
        
        // Actualizar análisis de posicionamiento
        let totalDelta = 0;
        
        for (const pair of this.optionsControl.activePairs) {
            const calls = this.optionsState.calls.get(pair);
            const puts = this.optionsState.puts.get(pair);
            
            if (calls && puts) {
                let pairDelta = 0;
                let pairGamma = 0;
                
                for (const [key, greek] of calls) {
                    pairDelta += greek.delta;
                    pairGamma += greek.gamma;
                }
                
                for (const [key, greek] of puts) {
                    pairDelta += greek.delta;
                    pairGamma += greek.gamma;
                }
                
                totalDelta += pairDelta;
                options.positioning.gammaExposure.set(pair, pairGamma);
            }
        }
        
        options.positioning.netDelta = totalDelta;
    }

    /**
     * Actualización del sistema de trading
     */
    async updateTradingSystem() {
        // Actualizar ejecución spot
        await this.tradingSystem.spotExecution.update();

        // Actualizar ejecución de opciones
        await this.tradingSystem.optionsExecution.update();

        // Actualizar sistema de cobertura
        await this.tradingSystem.hedgingSystem.update();

        // Actualizar gestión de riesgo
        await this.tradingSystem.riskManagement.update();
    }

    /**
     * Actualizar ejecución spot
     */
    async updateSpotExecution() {
        // En un entorno real, esto actualizaría el estado de la ejecución spot
        console.log('[DarkSide] Actualizando ejecución spot...');
    }

    /**
     * Actualizar ejecución de opciones
     */
    async updateOptionsExecution() {
        // En un entorno real, esto actualizaría el estado de la ejecución de opciones
        console.log('[DarkSide] Actualizando ejecución de opciones...');
    }

    /**
     * Actualizar sistema de cobertura
     */
    async updateHedgingSystem() {
        // En un entorno real, esto actualizaría el estado del sistema de cobertura
        console.log('[DarkSide] Actualizando sistema de cobertura...');
    }

    /**
     * Actualizar gestión de riesgo
     */
    async updateRiskManagement() {
        // En un entorno real, esto actualizaría el estado de la gestión de riesgo
        console.log('[DarkSide] Actualizando gestión de riesgo...');
    }

    /**
     * Ejecutar orden spot
     */
    async executeSpotOrder(signal) {
        // En un entorno real, esto ejecutaría una orden spot real
        console.log(`[DarkSide] Ejecutando orden spot: ${signal.symbol} @ ${signal.price}`);
        
        return {
            orderId: `spot_${Date.now()}`,
            status: 'filled',
            filledPrice: signal.price,
            filledQuantity: signal.quantity
        };
    }

    /**
     * Ejecutar orden de opciones
     */
    async executeOptionsOrder(signal) {
        // En un entorno real, esto ejecutaría una orden de opciones real
        console.log(`[DarkSide] Ejecutando orden de opciones: ${signal.symbol} ${signal.type} ${signal.strike} @ ${signal.premium}`);
        
        return {
            orderId: `options_${Date.now()}`,
            status: 'filled',
            filledPrice: signal.premium,
            filledQuantity: signal.quantity
        };
    }

    /**
     * Calcular cobertura óptima
     */
    calculateOptimalHedge(position) {
        // En un entorno real, esto calcularía la cobertura óptima basada en Greeks
        const hedgeRatio = -position.delta; // Cobertura delta neutral
        
        return {
            symbol: position.symbol,
            hedgeRatio,
            hedgeQuantity: Math.abs(position.quantity * hedgeRatio),
            hedgeType: position.type === 'call' ? 'put' : 'call'
        };
    }

    /**
     * Ejecutar posición de cobertura
     */
    async executeHedgePosition(hedge) {
        // En un entorno real, esto ejecutaría una posición de cobertura real
        console.log(`[DarkSide] Ejecutando cobertura: ${hedge.quantity} ${hedge.hedgeType} de ${hedge.symbol}`);
        
        return {
            orderId: `hedge_${Date.now()}`,
            status: 'filled',
            hedgeRatio: hedge.hedgeRatio,
            hedgeQuantity: hedge.hedgeQuantity
        };
    }

    /**
     * Calcular Valor en Riesgo (VaR)
     */
    calculateValueAtRisk(positions) {
        // En un entorno real, esto calcularía el VaR utilizando métodos estadísticos
        const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0);
        const volatility = 0.02; // 2% volatilidad diaria
        const confidence = 1.645; // 95% confidence level
        
        return totalValue * volatility * confidence;
    }

    /**
     * Calcular exposición total
     */
    calculateTotalExposure(positions) {
        // En un entorno real, esto calcularía la exposición total considerando todos los factores de riesgo
        let totalExposure = 0;
        
        for (const position of positions) {
            totalExposure += position.value;
            
            // Añadir exposición a volatilidad
            totalExposure += Math.abs(position.vega * 0.01); // 1% cambio en volatilidad
            
            // Añadir exposición al tiempo
            totalExposure += Math.abs(position.theta * 1/365); // 1 día
        }
        
        return totalExposure;
    }

    /**
     * Integración con el sistema cuántico
     */
    async integrateWithQuantumSystem() {
        // Generar señales mejoradas utilizando el análisis de mercado profundo
        const enhancedSignals = await this.generateEnhancedTradingSignals();
        
        // Actualizar métricas mejoradas
        this.updateEnhancedMetrics();
        
        // Si hay señales mejoradas, ejecutarlas
        if (enhancedSignals.length > 0) {
            console.log(`[DarkSide] Generadas ${enhancedSignals.length} señales mejoradas`);
            
            for (const signal of enhancedSignals) {
                // Ejecutar la señal a través del sistema cuántico
                await this.quantumSystem.executeEnhancedSignal(signal);
            }
        }
    }

    /**
     * Generar señales de trading mejoradas
     */
    async generateEnhancedTradingSignals() {
        const signals = [];
        
        for (const pair of this.optionsControl.activePairs) {
            // Obtener datos del mercado
            const marketDepth = this.marketDepth.orderBook.get(pair);
            const liquidityAnalysis = this.marketDepth.liquidityAnalysis[pair];
            const marketImpact = this.marketDepth.marketImpact[pair];
            
            // Obtener datos de opciones
            const calls = this.optionsState.calls.get(pair);
            const puts = this.optionsState.puts.get(pair);
            const iv = this.optionsState.impliedVolatility.get(pair);
            
            // Obtener análisis de mercado
            const orderFlow = this.marketAnalysis.orderFlowMetrics;
            const liquidity = this.marketAnalysis.liquidityMetrics;
            const volumetric = this.marketAnalysis.volumetricAnalysis;
            const options = this.marketAnalysis.optionsMetrics;
            
            // Generar señal basada en el análisis profundo
            const signal = this.generateDarkSideSignal(pair, {
                marketDepth,
                liquidityAnalysis,
                marketImpact,
                calls,
                puts,
                iv,
                orderFlow,
                liquidity,
                volumetric,
                options
            });
            
            if (signal) {
                signals.push(signal);
            }
        }
        
        return signals;
    }

    /**
     * Generar señal del "lado oscuro"
     */
    generateDarkSideSignal(pair, data) {
        // Lógica para generar señales basadas en el análisis profundo del mercado
        
        // 1. Señales de volatilidad
        const volatilitySignal = this.generateVolatilitySignal(pair, data);
        
        // 2. Señales de flujo de órdenes
        const orderFlowSignal = this.generateOrderFlowSignal(pair, data);
        
        // 3. Señales de liquidez
        const liquiditySignal = this.generateLiquiditySignal(pair, data);
        
        // 4. Señales de gamma exposure
        const gammaSignal = this.generateGammaSignal(pair, data);
        
        // Combinar señales
        const combinedSignal = this.combineSignals(pair, [
            volatilitySignal,
            orderFlowSignal,
            liquiditySignal,
            gammaSignal
        ]);
        
        return combinedSignal;
    }

    /**
     * Generar señal de volatilidad
     */
    generateVolatilitySignal(pair, data) {
        if (!data.iv) return null;
        
        // Calcular volatilidad implícita promedio
        let avgIV = 0;
        let count = 0;
        
        for (const iv of Object.values(data.iv)) {
            avgIV += iv;
            count++;
        }
        
        avgIV /= count;
        
        // Comparar con volatilidad histórica (simulada)
        const historicalVol = 0.6; // 60% volatilidad histórica
        
        // Generar señal si hay una discrepancia significativa
        if (Math.abs(avgIV - historicalVol) > 0.1) {
            return {
                type: 'volatility_arbitrage',
                direction: avgIV > historicalVol ? 'short' : 'long',
                strength: Math.abs(avgIV - historicalVol),
                confidence: Math.min(0.9, Math.abs(avgIV - historicalVol) * 5)
            };
        }
        
        return null;
    }

    /**
     * Generar señal de flujo de órdenes
     */
    generateOrderFlowSignal(pair, data) {
        const orderFlow = data.orderFlow;
        
        // Señal basada en Order Flow Imbalance
        if (Math.abs(orderFlow.imbalance.instant) > orderFlow.imbalance.threshold) {
            return {
                type: 'order_flow',
                direction: orderFlow.imbalance.instant > 0 ? 'long' : 'short',
                strength: Math.abs(orderFlow.imbalance.instant),
                confidence: Math.min(0.9, Math.abs(orderFlow.imbalance.instant))
            };
        }
        
        // Señal basada en CVD divergence
        if (orderFlow.cvd.history.length > 10) {
            const recent = orderFlow.cvd.history.slice(-5);
            const older = orderFlow.cvd.history.slice(-10, -5);
            
            const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
            const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
            
            if (Math.abs(recentAvg - olderAvg) > 5) {
                return {
                    type: 'cvd_divergence',
                    direction: recentAvg > olderAvg ? 'long' : 'short',
                    strength: Math.abs(recentAvg - olderAvg) / 10,
                    confidence: Math.min(0.8, Math.abs(recentAvg - olderAvg) / 20)
                };
            }
        }
        
        return null;
    }

    /**
     * Generar señal de liquidez
     */
    generateLiquiditySignal(pair, data) {
        const liquidity = data.liquidityAnalysis;
        
        // Señal basada en spread
        if (liquidity.spreadPercentage > 0.01) { // 1% spread
            return {
                type: 'liquidity_capture',
                direction: 'neutral',
                strength: liquidity.spreadPercentage,
                confidence: Math.min(0.9, liquidity.spreadPercentage * 50)
            };
        }
        
        // Señal basada en profundidad
        if (liquidity.totalDepth < 50) { // Baja profundidad
            return {
                type: 'liquidity_risk',
                direction: 'neutral',
                strength: 1 - (liquidity.totalDepth / 50),
                confidence: Math.min(0.9, 1 - (liquidity.totalDepth / 50))
            };
        }
        
        return null;
    }

    /**
     * Generar señal de gamma exposure
     */
    generateGammaSignal(pair, data) {
        const options = data.options;
        
        // Obtener gamma exposure total
        let totalGamma = 0;
        
        for (const [pair, gamma] of options.positioning.gammaExposure) {
            totalGamma += gamma;
        }
        
        // Generar señal basada en gamma exposure
        if (Math.abs(totalGamma) > 1000) {
            return {
                type: 'gamma_exposure',
                direction: totalGamma > 0 ? 'long' : 'short',
                strength: Math.abs(totalGamma) / 10000,
                confidence: Math.min(0.9, Math.abs(totalGamma) / 10000)
            };
        }
        
        return null;
    }

    /**
     * Combinar señales
     */
    combineSignals(pair, signals) {
        // Filtrar señales nulas
        const validSignals = signals.filter(s => s !== null);
        
        if (validSignals.length === 0) return null;
        
        // Calcular puntuación combinada
        let totalStrength = 0;
        let totalConfidence = 0;
        let longVotes = 0;
        let shortVotes = 0;
        let neutralVotes = 0;
        
        for (const signal of validSignals) {
            totalStrength += signal.strength;
            totalConfidence += signal.confidence;
            
            if (signal.direction === 'long') longVotes++;
            else if (signal.direction === 'short') shortVotes++;
            else neutralVotes++;
        }
        
        // Determinar dirección basada en votos
        let direction = 'neutral';
        if (longVotes > shortVotes && longVotes > neutralVotes) direction = 'long';
        else if (shortVotes > longVotes && shortVotes > neutralVotes) direction = 'short';
        
        // Calcular puntuación final
        const avgStrength = totalStrength / validSignals.length;
        const avgConfidence = totalConfidence / validSignals.length;
        const score = avgStrength * avgConfidence;
        
        // Solo generar señal si la puntuación es suficientemente alta
        if (score < 0.3) return null;
        
        return {
            symbol: pair,
            type: 'dark_side',
            direction,
            score,
            confidence: avgConfidence,
            signals: validSignals,
            timestamp: Date.now()
        };
    }

    /**
     * Actualizar métricas mejoradas
     */
    updateEnhancedMetrics() {
        const metrics = this.enhancedMetrics;
        
        // Actualizar métricas basadas en el análisis de mercado
        metrics.darkSideSignals = this.marketAnalysis.orderFlowMetrics.vsr.levels.length;
        metrics.volatilityArbitrage = this.calculateVolatilityArbitrage();
        metrics.liquidityCapture = this.calculateLiquidityCapture();
        metrics.orderFlowPredicition = this.calculateOrderFlowPrediction();
        metrics.gammaExposure = this.calculateGammaExposure();
        metrics.vegaNeutral = this.calculateVegaNeutral();
    }

    /**
     * Calcular oportunidad de arbitraje de volatilidad
     */
    calculateVolatilityArbitrage() {
        let opportunity = 0;
        
        for (const [pair, iv] of this.optionsState.impliedVolatility) {
            // En un entorno real, esto compararía con la volatilidad histórica
            const historicalVol = 0.6; // 60% volatilidad histórica
            
            for (const vol of Object.values(iv)) {
                opportunity += Math.abs(vol - historicalVol);
            }
        }
        
        return opportunity / this.optionsControl.activePairs.size;
    }

    /**
     * Calcular captura de liquidez
     */
    calculateLiquidityCapture() {
        let capture = 0;
        
        for (const [pair, analysis] of Object.entries(this.marketDepth.liquidityAnalysis)) {
            // Calcular oportunidad de captura de liquidez basada en spread
            capture += analysis.spreadPercentage;
        }
        
        return capture / Object.keys(this.marketDepth.liquidityAnalysis).length;
    }

    /**
     * Calcular predicción de flujo de órdenes
     */
    calculateOrderFlowPrediction() {
        const cvd = this.marketAnalysis.orderFlowMetrics.cvd;
        
        if (cvd.history.length < 10) return 0;
        
        // Calcular tendencia del CVD
        const recent = cvd.history.slice(-5);
        const older = cvd.history.slice(-10, -5);
        
        const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
        const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
        
        // Retornar la fuerza de la tendencia
        return Math.abs(recentAvg - olderAvg) / 10;
    }

    /**
     * Calcular exposición gamma
     */
    calculateGammaExposure() {
        let totalGamma = 0;
        
        for (const gamma of this.marketAnalysis.optionsMetrics.positioning.gammaExposure.values()) {
            totalGamma += Math.abs(gamma);
        }
        
        return totalGamma;
    }

    /**
     * Calcular posicionamiento vega neutral
     */
    calculateVegaNeutral() {
        // En un entorno real, esto calcularía qué tan cerca está el portafolio de ser vega neutral
        return ((Date.now() % 100) / 100); // Simulación
    }

    /**
     * Obtener métricas mejoradas
     */
    getEnhancedMetrics() {
        return this.enhancedMetrics;
    }

    /**
     * Iniciar el sistema
     */
    async start() {
        console.log('[DarkSide] Iniciando sistema de análisis de mercado profundo...');
        
        // Actualizar estado del mercado inicialmente
        await this.updateMarketState();
        
        // Configurar actualización periódica
        setInterval(async () => {
            try {
                await this.updateMarketState();
            } catch (error) {
                console.error('[DarkSide] Error en actualización periódica:', error);
            }
        }, 30000); // Actualizar cada 30 segundos
        
        console.log('[DarkSide] Sistema de análisis de mercado profundo iniciado');
    }
}

module.exports = MarketDepthOptionsSystem;

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
 * SRNOA OPTIONS MONEY MAKER
 * Sistema de opciones con Griegos SRNOA para encontrar la mejor call y put
 * La mejor venta correlaciona con la mejor compra - Money Maker Excellence
 * Copyright (c) 2025 VigoleonRocks - Quantum Options Strategy
 */

class SRNOAOptionsMaker {
    constructor(colibriEstacional) {
        this.colibri = colibriEstacional;
        this.optionsMatrix = new Map();
        this.currentPairs = new Set();
        
        // Griegos SRNOA optimizados para opciones
        this.griegos = {
            delta: { weight: 0.35, threshold: 0.4 },
            gamma: { weight: 0.25, threshold: 0.3 },
            theta: { weight: 0.15, threshold: 0.2 }, 
            vega: { weight: 0.15, threshold: 0.25 },
            rho: { weight: 0.10, threshold: 0.1 }
        };
        
        console.log('[MONEY] SRNOA Options Money Maker inicializado');
    }
    
    /**
     * ANÁLISIS MAESTRO - Encuentra mejor CALL y PUT para cada par
     */
    async analizarPar(symbol, marketData) {
        const precio = marketData.prices[marketData.prices.length - 1];
        const volatilidad = this.calcularVolatilidad(marketData.prices);
        
        // Generar strikes OTM
        const strikes = this.generarStrikes(precio, volatilidad);
        
        // Evaluar cada strike con SRNOA
        const callResults = [];
        const putResults = [];
        
        for (const strike of strikes.calls) {
            const callScore = this.evaluarOpcion('CALL', precio, strike, volatilidad, marketData);
            if (callScore.score > 0.6) callResults.push({ strike, ...callScore });
        }
        
        for (const strike of strikes.puts) {
            const putScore = this.evaluarOpcion('PUT', precio, strike, volatilidad, marketData);
            if (putScore.score > 0.6) putResults.push({ strike, ...putScore });
        }
        
        // Encontrar las mejores opciones
        const mejorCall = callResults.sort((a, b) => b.score - a.score)[0];
        const mejorPut = putResults.sort((a, b) => b.score - a.score)[0];
        
        return {
            symbol,
            precio,
            volatilidad,
            mejorCall,
            mejorPut,
            timestamp: Date.now()
        };
    }
    
    /**
     * EVALUACIÓN SRNOA - Calcula score para una opción específica
     */
    evaluarOpcion(tipo, precio, strike, volatilidad, marketData) {
        const moneyness = tipo === 'CALL' ? strike / precio : precio / strike;
        const timeToExpiry = 30 / 365; // 30 días estándar
        
        // Griegos calculados
        const delta = this.calcularDelta(tipo, precio, strike, volatilidad, timeToExpiry);
        const gamma = this.calcularGamma(precio, strike, volatilidad, timeToExpiry);
        const theta = this.calcularTheta(tipo, precio, strike, volatilidad, timeToExpiry);
        const vega = this.calcularVega(precio, strike, volatilidad, timeToExpiry);
        const rho = this.calcularRho(tipo, precio, strike, volatilidad, timeToExpiry);
        
        // Score SRNOA ponderado
        const score = (
            Math.abs(delta) * this.griegos.delta.weight +
            gamma * this.griegos.gamma.weight +
            Math.abs(theta) * this.griegos.theta.weight +
            vega * this.griegos.vega.weight +
            Math.abs(rho) * this.griegos.rho.weight
        );
        
        return {
            score,
            griegos: { delta, gamma, theta, vega, rho },
            moneyness,
            otm: moneyness > 1.0,
            profit_potential: this.calcularProfitPotential(tipo, delta, gamma, volatilidad)
        };
    }
    
    /**
     * GENERADOR DE STRIKES - OTM por definición
     */
    generarStrikes(precio, volatilidad) {
        const range = precio * volatilidad * 2; // 2 desviaciones estándar
        const steps = 10;
        const stepSize = range / steps;
        
        return {
            calls: Array.from({length: steps}, (_, i) => precio + (i + 1) * stepSize),
            puts: Array.from({length: steps}, (_, i) => precio - (i + 1) * stepSize)
        };
    }
    
    /**
     * INTEGRACIÓN ESTACIONAL - Usa análisis Colibrí para timing
     */
    async ejecutarEstrategiaIntegrada(symbols) {
        const resultados = new Map();
        
        for (const symbol of symbols) {
            const marketData = await this.obtenerDatosMercado(symbol);
            
            // Análisis Colibrí estacional
            const estrategiaColibrí = this.colibri.ejecutarEstrategiaEstacional(symbol, marketData);
            
            // Análisis SRNOA opciones
            const opcionesAnalisis = await this.analizarPar(symbol, marketData);
            
            // Síntesis: combinar timing estacional con opciones óptimas
            const estrategiaIntegrada = this.sintetizarEstrategia(estrategiaColibrí, opcionesAnalisis);
            
            resultados.set(symbol, estrategiaIntegrada);
        }
        
        return this.priorizarOportunidades(resultados);
    }
    
    /**
     * SÍNTESIS MAESTRA - Combina Colibrí + SRNOA
     */
    sintetizarEstrategia(colibrí, opciones) {
        const timing = this.evaluarTiming(colibrí.estacion, colibrí.es_penultimo_ciclo);
        const direccion = colibrí.tipo_venta === 'ANTICIPADA_CRECIMIENTO' ? 'CALL' : 
                         colibrí.tipo_venta === 'PRE_DECLIVE' ? 'PUT' : 'NEUTRAL';
        
        const opcionRecomendada = direccion === 'CALL' ? opciones.mejorCall : 
                                 direccion === 'PUT' ? opciones.mejorPut : 
                                 this.seleccionarMejorOpcion(opciones);
        
        return {
            ...opciones,
            timing,
            direccion,
            opcionRecomendada,
            confianzaIntegrada: (colibrí.confianza + (opcionRecomendada?.score || 0)) / 2,
            ejecutable: timing.favorable && opcionRecomendada && opcionRecomendada.score > 0.7
        };
    }
    
    /**
     * EVALUACIÓN DE TIMING ESTACIONAL
     */
    evaluarTiming(estacion, penultimoCiclo) {
        const multipliers = {
            PRIMAVERA: 1.618, // Proporción áurea para crecimiento
            VERANO: 2.0,      // Peak máximo
            OTOÑO: 1.414,     // Raíz de 2 para declive controlado
            INVIERNO: 0.618   // Proporción áurea inversa para acumulación
        };
        
        const factor = multipliers[estacion] || 1.0;
        const cicloBonus = penultimoCiclo ? 0.3 : 0;
        
        return {
            factor,
            favorable: factor > 1.0,
            estacion,
            penultimoCiclo,
            score: Math.min(1.0, factor + cicloBonus)
        };
    }
    
    /**
     * CÁLCULOS DE GRIEGOS PRECISOS
     */
    calcularDelta(tipo, S, K, vol, T) {
        const d1 = this.calcularD1(S, K, vol, T);
        return tipo === 'CALL' ? this.normCDF(d1) : this.normCDF(d1) - 1;
    }
    
    calcularGamma(S, K, vol, T) {
        const d1 = this.calcularD1(S, K, vol, T);
        return this.normPDF(d1) / (S * vol * Math.sqrt(T));
    }
    
    calcularTheta(tipo, S, K, vol, T) {
        const d1 = this.calcularD1(S, K, vol, T);
        const d2 = d1 - vol * Math.sqrt(T);
        const base = -(S * this.normPDF(d1) * vol) / (2 * Math.sqrt(T));
        
        if (tipo === 'CALL') {
            return base - 0.05 * K * Math.exp(-0.05 * T) * this.normCDF(d2);
        } else {
            return base + 0.05 * K * Math.exp(-0.05 * T) * this.normCDF(-d2);
        }
    }
    
    calcularVega(S, K, vol, T) {
        const d1 = this.calcularD1(S, K, vol, T);
        return S * this.normPDF(d1) * Math.sqrt(T);
    }
    
    calcularRho(tipo, S, K, vol, T) {
        const d2 = this.calcularD1(S, K, vol, T) - vol * Math.sqrt(T);
        const factor = K * T * Math.exp(-0.05 * T);
        
        return tipo === 'CALL' ? 
            factor * this.normCDF(d2) : 
            -factor * this.normCDF(-d2);
    }
    
    calcularD1(S, K, vol, T) {
        return (Math.log(S / K) + (0.05 + 0.5 * vol * vol) * T) / (vol * Math.sqrt(T));
    }
    
    // Funciones auxiliares matemáticas
    normCDF(x) {
        return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
    }
    
    normPDF(x) {
        return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    }
    
    erf(x) {
        const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
        const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        return sign * y;
    }
    
    calcularVolatilidad(precios) {
        const returns = precios.slice(1).map((p, i) => Math.log(p / precios[i]));
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
        return Math.sqrt(variance * 252); // Anualizada
    }
    
    calcularProfitPotential(tipo, delta, gamma, volatilidad) {
        return Math.abs(delta) * volatilidad * gamma * 100;
    }
    
    seleccionarMejorOpcion(opciones) {
        const scores = [
            opciones.mejorCall ? { ...opciones.mejorCall, tipo: 'CALL' } : null,
            opciones.mejorPut ? { ...opciones.mejorPut, tipo: 'PUT' } : null
        ].filter(Boolean);
        
        return scores.sort((a, b) => b.score - a.score)[0];
    }
    
    priorizarOportunidades(resultados) {
        return Array.from(resultados.entries())
            .map(([symbol, estrategia]) => ({ symbol, ...estrategia }))
            .filter(e => e.ejecutable)
            .sort((a, b) => b.confianzaIntegrada - a.confianzaIntegrada)
            .slice(0, 5); // Top 5 oportunidades
    }
    
    async obtenerDatosMercado(symbol) {
        // Simulación de datos - en producción conectar a API real
        const basePrice = 45000 + PHYSICAL_CONSTANTS.VOLUME_24H / 5000;
        const prices = Array.from({length: 100}, (_, i) => 
            basePrice + PHYSICAL_CONSTANTS.FUNDING_ANNUALIZED00
        );
        const volumes = Array.from({length: 100}, () => 
            PHYSICAL_CONSTANTS.MARKET_DEPTH + 500000
        );
        
        return { prices, volumes };
    }
    
    generarDatosTimeframe(marketData, period) {
        // Simular agregación por timeframe
        const step = Math.max(1, Math.floor(marketData.prices.length / (100 / period)));
        
        return {
            prices: marketData.prices.filter((_, i) => i % step === 0),
            volumes: marketData.volumes.filter((_, i) => i % step === 0)
        };
    }
    
    /**
     * CALCULADORA DE CONFIANZA SRNOA - Motor independiente
     */
    calcularConfianzaSRNOA(mejorOpcion, volatilidad) {
        if (!mejorOpcion) return 0;
        
        const scoreBase = mejorOpcion.score || 0;
        const griegosBalance = this.evaluarBalanceGriegos(mejorOpcion.griegos);
        const volatilidadFactor = Math.min(1.0, volatilidad / 0.5); // Normalizar volatilidad
        const otmBonus = mejorOpcion.otm ? 0.1 : 0; // Bonus por OTM
        
        return Math.min(1.0, scoreBase * griegosBalance * volatilidadFactor + otmBonus);
    }
    
    evaluarBalanceGriegos(griegos) {
        if (!griegos) return 0.5;
        
        const { delta, gamma, theta, vega, rho } = griegos;
        
        // Evaluar si los griegos están balanceados
        const deltaScore = Math.abs(delta) > 0.3 ? 1.0 : 0.5;
        const gammaScore = gamma > 0.1 ? 1.0 : 0.5;
        const thetaScore = Math.abs(theta) < 0.05 ? 1.0 : 0.3; // Theta bajo es mejor
        const vegaScore = vega > 0.2 ? 1.0 : 0.5;
        const rhoScore = Math.abs(rho) > 0.1 ? 1.0 : 0.5;
        
        return (deltaScore + gammaScore + thetaScore + vegaScore + rhoScore) / 5.0;
    }
    
    /**
     * VALIDADOR DE SUPERSIMETRÍA SIMBIOSIS CÓNDOR
     * Colibrí evalúa la supersimetría del entorno antes de ejecutar
     */
    validarSupersimetriaCondor(symbol, marketData) {
        try {
            // Obtener estado actual del Colibrí
            const estadoColibri = this.colibri.ejecutarEstrategiaEstacional(symbol, marketData);
            
            // Analizar supersimetría basada en estaciones cuánticas
            const supersimetria = this.calcularSupersimetria(estadoColibri.estacion, marketData);
            
            // Validar simbiosis cóndor (equilibrio entre fuerzas opuestas)
            const simbiosis = this.evaluarSimbiosis(marketData);
            
            // Factor de coherencia cuántica
            const factorSupersimetria = (supersimetria + simbiosis) / 2;
            
            return {
                estado: supersimetria > 0.6 && simbiosis > 0.6 ? 'SUPERSIMÉTRICO' : 'ASIMÉTRICO',
                supersimetria: supersimetria,
                simbiosis: simbiosis,
                estacion: estadoColibri.estacion,
                coherente: factorSupersimetria > 0.65,
                factorSupersimetria: factorSupersimetria,
                timestamp: Date.now()
            };
            
        } catch (error) {
            console.error('Error en validación de supersimetría:', error);
            return {
                estado: 'ERROR',
                supersimetria: 0,
                simbiosis: 0,
                estacion: 'UNKNOWN',
                coherente: false,
                factorSupersimetria: 0,
                timestamp: Date.now()
            };
        }
    }
    
    calcularSupersimetria(estacion, marketData) {
        // Supersimetría basada en proporción áurea y fibonacci
        const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
        const prices = marketData.prices.slice(-10);
        
        if (prices.length < 10) return 0.5;
        
        // Calcular ratios entre precios consecutivos
        const ratios = prices.slice(1).map((p, i) => p / prices[i]);
        
        // Buscar patrones fibonacci en los ratios
        let fibonacciScore = 0;
        for (let i = 0; i < ratios.length - 1; i++) {
            const ratio = Math.abs(ratios[i]);
            if (Math.abs(ratio - 1.618) < 0.1) fibonacciScore += 0.2; // Proporción áurea
            if (Math.abs(ratio - 1.414) < 0.1) fibonacciScore += 0.15; // Raíz de 2
            if (Math.abs(ratio - 1.0) < 0.05) fibonacciScore += 0.1; // Equilibrio
        }
        
        // Factor estacional
        const estacionalFactor = {
            PRIMAVERA: 1.618,
            VERANO: 2.0,
            OTOÑO: 1.414,
            INVIERNO: 0.618
        }[estacion] || 1.0;
        
        return Math.min(1.0, fibonacciScore * (estacionalFactor / 2.0));
    }
    
    evaluarSimbiosis(marketData) {
        const prices = marketData.prices;
        const volumes = marketData.volumes;
        
        if (prices.length < 20 || volumes.length < 20) return 0.5;
        
        // Calcular correlación precio-volumen (simbiosis)
        const priceChanges = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);
        const volumeChanges = volumes.slice(1).map((v, i) => (v - volumes[i]) / volumes[i]);
        
        const correlation = this.calcularCorrelacion(
            priceChanges.slice(-10), 
            volumeChanges.slice(-10)
        );
        
        // Evaluar equilibrio de fuerzas (cóndor)
        const volatilidad = this.calcularVolatilidad(prices);
        const equilibrioFactor = Math.max(0, 1 - Math.abs(volatilidad - 0.3)); // Óptimo ~30%
        
        return Math.min(1.0, (Math.abs(correlation) + equilibrioFactor) / 2);
    }
    
    calcularCorrelacion(x, y) {
        if (x.length !== y.length || x.length === 0) return 0;
        
        const n = x.length;
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        return denominator === 0 ? 0 : numerator / denominator;
    }
    
    /**
     * CUBO DE RUBIK - DETERMINANTE PARA MEJOR CICLO DE INVERSIÓN
     * Malabarismo de calls ITM: rotar posiciones para maximizar valor intrínseco
     */
    calcularCuboRubikITM(symbol, marketData) {
        const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
        const precio = marketData.prices[marketData.prices.length - 1];
        const volatilidad = this.calcularVolatilidad(marketData.prices);
        
        // GENERAR MATRIZ DE MONEYNESS POR TIMEFRAME
        const matrizMoneyness = this.generarMatrizMoneyness(precio, volatilidad, timeframes, marketData);
        
        // CALCULAR DETERMINANTE DEL CUBO
        const determinante = this.calcularDeterminanteOptimizado(matrizMoneyness);
        
        // IDENTIFICAR MEJOR CICLO DE INVERSIÓN
        const mejorCiclo = this.identificarMejorCiclo(determinante, matrizMoneyness, precio);
        
        // ESTRATEGIA DE MALABARISMO ITM
        const estrategiaMalabarismo = this.disemalarMalabarerismoITM(mejorCiclo, precio, volatilidad);
        
        // SIN VALIDACIONES EXTERNAS - PURO ANÁLISIS DE OPCIONES
        
        return {
            symbol: symbol,
            precio_actual: precio,
            volatilidad: volatilidad,
            
            cubo_rubik: {
                matriz_moneyness: matrizMoneyness,
                determinante: determinante,
                mejor_ciclo: mejorCiclo,
                timeframes: timeframes
            },
            
            estrategia_malabarismo: {
                tipo: 'CALLS_ITM_ROTATION',
                ciclo_optimo: estrategiaMalabarismo.cicloOptimo,
                secuencia_rotacion: estrategiaMalabarismo.secuenciaRotacion,
                strikes_objetivo: estrategiaMalabarismo.strikesObjetivo,
                valor_intrinseco_esperado: estrategiaMalabarismo.valorIntrinseco
            },
            
            malabarismo_details: {
                entrada_inicial: estrategiaMalabarismo.entradaInicial,
                rotaciones_planificadas: estrategiaMalabarismo.rotacionesPlanificadas,
                exit_strategy: estrategiaMalabarismo.exitStrategy,
                risk_management: estrategiaMalabarismo.riskManagement
            },
            
            decision_final: this.sintetizarDecisionMalabarismo(estrategiaMalabarismo),
            timestamp: Date.now()
        };
    }
    
    generarMatrizMoneyness(precio, volatilidad, timeframes, marketData) {
        const matriz = [];
        
        for (let i = 0; i < timeframes.length; i++) {
            const tf = timeframes[i];
            const period = this.getPeriodFromTimeframe(tf);
            const tfData = this.generarDatosTimeframe(marketData, period);
            
            if (tfData.prices.length === 0) {
                matriz.push([0, 0, 0, 0, 0]);
                continue;
            }
            
            const precioTF = tfData.prices[tfData.prices.length - 1];
            const volTF = this.calcularVolatilidad(tfData.prices);
            
            // Generar strikes con diferentes niveles de moneyness
            const strikes = {
                deep_otm: precioTF * 1.15,  // 15% OTM
                otm: precioTF * 1.08,       // 8% OTM
                atm: precioTF,              // At The Money
                itm: precioTF * 0.95,       // 5% ITM
                deep_itm: precioTF * 0.88   // 12% ITM
            };
            
            // Calcular valor intrínseco para cada strike
            const filMoneyness = [
                Math.max(0, precioTF - strikes.deep_otm), // Deep OTM
                Math.max(0, precioTF - strikes.otm),      // OTM
                Math.max(0, precioTF - strikes.atm),      // ATM
                Math.max(0, precioTF - strikes.itm),      // ITM
                Math.max(0, precioTF - strikes.deep_itm)  // Deep ITM
            ];
            
            matriz.push(filMoneyness);
        }
        
        return matriz;
    }
    
    calcularDeterminanteOptimizado(matriz) {
        // Para matriz 6x5, usar submatriz 5x5 más significativa
        const submatriz = matriz.slice(0, 5).map(fila => fila.slice(0, 5));
        
        // Calcular determinante usando expansión de cofactores
        return this.determinante5x5(submatriz);
    }
    
    determinante5x5(matriz) {
        if (matriz.length !== 5 || matriz[0].length !== 5) {
            return 0;
        }
        
        let det = 0;
        for (let col = 0; col < 5; col++) {
            const cofactor = this.calcularCofactor(matriz, 0, col);
            det += matriz[0][col] * cofactor * (col % 2 === 0 ? 1 : -1);
        }
        
        return det;
    }
    
    calcularCofactor(matriz, fila, columna) {
        const submatriz = [];
        for (let i = 0; i < matriz.length; i++) {
            if (i === fila) continue;
            const nuevaFila = [];
            for (let j = 0; j < matriz[i].length; j++) {
                if (j === columna) continue;
                nuevaFila.push(matriz[i][j]);
            }
            submatriz.push(nuevaFila);
        }
        
        return this.determinante4x4(submatriz);
    }
    
    determinante4x4(matriz) {
        if (matriz.length !== 4) return 0;
        
        // Implementación simplificada usando regla de Sarrus extendida
        let det = 0;
        for (let col = 0; col < 4; col++) {
            const menor = this.obtenerMenor3x3(matriz, 0, col);
            det += matriz[0][col] * menor * (col % 2 === 0 ? 1 : -1);
        }
        
        return det;
    }
    
    obtenerMenor3x3(matriz, fila, columna) {
        const menor = [];
        for (let i = 0; i < matriz.length; i++) {
            if (i === fila) continue;
            const nuevaFila = [];
            for (let j = 0; j < matriz[i].length; j++) {
                if (j === columna) continue;
                nuevaFila.push(matriz[i][j]);
            }
            menor.push(nuevaFila);
        }
        
        // Determinante 3x3
        return menor[0][0] * (menor[1][1] * menor[2][2] - menor[1][2] * menor[2][1]) -
               menor[0][1] * (menor[1][0] * menor[2][2] - menor[1][2] * menor[2][0]) +
               menor[0][2] * (menor[1][0] * menor[2][1] - menor[1][1] * menor[2][0]);
    }
    
    identificarMejorCiclo(determinante, matrizMoneyness, precio) {
        // El determinante indica la "rotabilidad" del cubo
        const factorRotacion = Math.abs(determinante) / 1000000; // Normalizar
        
        // Identificar timeframe con mayor valor ITM
        let mejorTimeframe = 0;
        let maxValorITM = 0;
        
        for (let i = 0; i < matrizMoneyness.length; i++) {
            const fila = matrizMoneyness[i];
            const valorITM = fila[3] + fila[4]; // ITM + Deep ITM
            if (valorITM > maxValorITM) {
                maxValorITM = valorITM;
                mejorTimeframe = i;
            }
        }
        
        return {
            determinante: determinante,
            factor_rotacion: factorRotacion,
            timeframe_optimo: mejorTimeframe,
            valor_itm_maximo: maxValorITM,
            ciclo_recomendado: this.determinarTipoCiclo(factorRotacion)
        };
    }
    
    determinarTipoCiclo(factorRotacion) {
        if (factorRotacion > 100) return 'RAPIDO_SCALPING';
        if (factorRotacion > 10) return 'MEDIO_SWING';
        if (factorRotacion > 1) return 'LENTO_POSITION';
        return 'HOLD_ACUMULAR';
    }
    
    disemalarMalabarerismoITM(mejorCiclo, precio, volatilidad) {
        const tipo = mejorCiclo.ciclo_recomendado;
        
        // Estrategia base: empezar OTM y rotar hacia ITM
        const estrategia = {
            entradaInicial: {
                strike: precio * 1.05, // Empezar 5% OTM
                timeframe: '15m',
                razon: 'Entrada conservadora para capturar movimento'
            },
            
            rotacionesPlanificadas: [],
            strikesObjetivo: [],
            valorIntrinseco: 0
        };
        
        // Planificar rotaciones según el tipo de ciclo
        switch (tipo) {
            case 'RAPIDO_SCALPING':
                estrategia.rotacionesPlanificadas = [
                    { desde: precio * 1.05, hacia: precio * 1.02, timeframe: '5m', trigger: 'precio > 1.03' },
                    { desde: precio * 1.02, hacia: precio * 0.98, timeframe: '1m', trigger: 'precio > 1.01' },
                    { desde: precio * 0.98, hacia: precio * 0.95, timeframe: '1m', trigger: 'precio > 0.99' }
                ];
                break;
                
            case 'MEDIO_SWING':
                estrategia.rotacionesPlanificadas = [
                    { desde: precio * 1.05, hacia: precio * 1.00, timeframe: '1h', trigger: 'precio > 1.02' },
                    { desde: precio * 1.00, hacia: precio * 0.95, timeframe: '1h', trigger: 'precio > 0.98' }
                ];
                break;
                
            case 'LENTO_POSITION':
                estrategia.rotacionesPlanificadas = [
                    { desde: precio * 1.05, hacia: precio * 0.95, timeframe: '1d', trigger: 'precio > 1.00' }
                ];
                break;
                
            default:
                estrategia.rotacionesPlanificadas = [
                    { desde: precio * 1.05, hacia: precio * 1.00, timeframe: '4h', trigger: 'acumular' }
                ];
        }
        
        // Calcular strikes objetivo finales (todos ITM)
        estrategia.strikesObjetivo = estrategia.rotacionesPlanificadas.map(rot => rot.hacia);
        
        // Calcular valor intrínseco esperado
        estrategia.valorIntrinseco = estrategia.strikesObjetivo.reduce((sum, strike) => {
            return sum + Math.max(0, precio - strike);
        }, 0);
        
        estrategia.cicloOptimo = tipo;
        estrategia.exitStrategy = this.calcularExitStrategy(precio, estrategia.strikesObjetivo);
        estrategia.riskManagement = this.calcularRiskManagement(precio, volatilidad);
        
        return estrategia;
    }
    
    calcularExitStrategy(precio, strikes) {
        const mejorStrike = Math.min(...strikes); // Strike más ITM
        return {
            profit_target: (precio - mejorStrike) * 0.8, // 80% del valor intrínseco
            stop_loss: precio * 0.95, // 5% por debajo del precio actual
            time_decay_limit: '30_days',
            volatility_expansion_target: 'IV > 25%'
        };
    }
    
    calcularRiskManagement(precio, volatilidad) {
        return {
            max_position_size: '2% of portfolio',
            hedging_strategy: volatilidad > 0.3 ? 'PROTECTIVE_PUT' : 'NONE',
            diversification: 'MAX_3_TIMEFRAMES',
            rebalance_frequency: 'DAILY'
        };
    }
    
    sintetizarDecisionMalabarismo(estrategia) {
        const ejecutable = estrategia.valorIntrinseco > 0;
        
        return {
            estrategia: 'MALABARISMO_CALLS_ITM',
            tipo_ciclo: estrategia.cicloOptimo,
            ejecutable: ejecutable,
            confianza: ejecutable ? 0.85 : 0.4,
            valor_esperado: estrategia.valorIntrinseco,
            rotaciones_planificadas: estrategia.rotacionesPlanificadas.length,
            razon: ejecutable ? 
                `Malabarismo ${estrategia.cicloOptimo} - Valor ITM: ${estrategia.valorIntrinseco.toFixed(2)}` :
                'Esperando mayor volatilidad para generar valor ITM'
        };
    }
    
    /**
     * MATRIZ TRASPUESTA - ÁNGULOS DE ENTRADA/SALIDA DIRIGIDAS
     * Sistema de vectores direccionales basado en transposición matricial
     */
    calcularMatrizTraspuesta(symbol, marketData) {
        // Timeframes del cubo de Rubik
        const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
        const griegos = ['delta', 'gamma', 'theta', 'vega', 'rho'];
        
        // Constantes de Feynman para espacio complejo z=9+16j @ 88MHz
        const FEYNMAN_Z_REAL = 9;
        const FEYNMAN_Z_IMAG = 16;
        const FREQ_88MHZ = 88e6;
        const LOG_7919 = Math.log(7919);
        
        // MATRIZ ORIGINAL: [timeframes × griegos]
        const matrizOriginal = [];
        const datosTimeframes = {};
        
        for (let i = 0; i < timeframes.length; i++) {
            const tf = timeframes[i];
            const period = this.getPeriodFromTimeframe(tf);
            const tfData = this.generarDatosTimeframe(marketData, period);
            
            datosTimeframes[tf] = tfData;
            
            // Calcular griegos para este timeframe
            const precio = tfData.prices[tfData.prices.length - 1];
            const volatilidad = this.calcularVolatilidad(tfData.prices);
            const strike = precio * 1.05; // OTM 5%
            const timeToExpiry = 30 / 365;
            
            const filGriegos = [
                this.calcularDelta('CALL', precio, strike, volatilidad, timeToExpiry),
                this.calcularGamma(precio, strike, volatilidad, timeToExpiry),
                this.calcularTheta('CALL', precio, strike, volatilidad, timeToExpiry),
                this.calcularVega(precio, strike, volatilidad, timeToExpiry),
                this.calcularRho('CALL', precio, strike, volatilidad, timeToExpiry)
            ];
            
            matrizOriginal.push(filGriegos);
        }
        
        // MATRIZ TRASPUESTA: [griegos × timeframes]
        const matrizTraspuesta = this.transponerMatriz(matrizOriginal);
        
        // CALCULAR ÁNGULOS DE ENTRADA/SALIDA
        const angulosEntrada = this.calcularAngulosVector(matrizTraspuesta, 'ENTRADA');
        const angulosSalida = this.calcularAngulosVector(matrizTraspuesta, 'SALIDA');
        
        // TRANSFORMACIÓN DE FEYNMAN EN ESPACIO COMPLEJO z=9+16j @ 88MHz
        const feynmanTransform = this.aplicarTransformacionFeynman(
            angulosEntrada, angulosSalida, FEYNMAN_Z_REAL, FEYNMAN_Z_IMAG, FREQ_88MHZ, LOG_7919
        );
        
        return {
            symbol: symbol,
            matriz_original: {
                dimensiones: `${timeframes.length}×${griegos.length}`,
                timeframes: timeframes,
                griegos: griegos,
                valores: matrizOriginal
            },
            matriz_traspuesta: {
                dimensiones: `${griegos.length}×${timeframes.length}`,
                valores: matrizTraspuesta
            },
            angulos_direccionales: {
                entrada: {
                    vector: angulosEntrada.vector,
                    magnitud: angulosEntrada.magnitud,
                    angulo_grados: angulosEntrada.angulo,
                    timeframe_optimo: timeframes[angulosEntrada.indice_max]
                },
                salida: {
                    vector: angulosSalida.vector,
                    magnitud: angulosSalida.magnitud,
                    angulo_grados: angulosSalida.angulo,
                    timeframe_optimo: timeframes[angulosSalida.indice_max]
                }
            },
            feynman_transform: {
                z_complex: `${FEYNMAN_Z_REAL}+${FEYNMAN_Z_IMAG}j`,
                frequency_mhz: FREQ_88MHZ / 1e6,
                log7919: LOG_7919,
                leverage_space_angle: feynmanTransform.leverageSpaceAngle,
                double_integral: feynmanTransform.doubleIntegral,
                quantum_momentum: feynmanTransform.quantumMomentum
            },
            decision_final: this.sintetizarDecisionAngular(angulosEntrada, angulosSalida, feynmanTransform),
            timestamp: Date.now()
        };
    }
    
    getPeriodFromTimeframe(tf) {
        const periods = {
            '1m': 1, '5m': 5, '15m': 15, 
            '1h': 60, '4h': 240, '1d': 1440
        };
        return periods[tf] || 60;
    }
    
    transponerMatriz(matriz) {
        const filas = matriz.length;
        const columnas = matriz[0].length;
        const traspuesta = [];
        
        for (let j = 0; j < columnas; j++) {
            const nuevaFila = [];
            for (let i = 0; i < filas; i++) {
                nuevaFila.push(matriz[i][j]);
            }
            traspuesta.push(nuevaFila);
        }
        
        return traspuesta;
    }
    
    calcularAngulosVector(matrizTraspuesta, tipo) {
        // Cada fila de la matriz traspuesta es un griego evaluado en todos los timeframes
        const vectores = matrizTraspuesta.map(fila => {
            const magnitud = Math.sqrt(fila.reduce((sum, val) => sum + val * val, 0));
            return { valores: fila, magnitud };
        });
        
        // Vector resultante (suma ponderada)
        const pesos = tipo === 'ENTRADA' ? [0.35, 0.25, 0.15, 0.15, 0.10] : [0.20, 0.30, 0.25, 0.15, 0.10];
        const vectorResultante = [];
        
        for (let j = 0; j < matrizTraspuesta[0].length; j++) {
            let suma = 0;
            for (let i = 0; i < matrizTraspuesta.length; i++) {
                suma += matrizTraspuesta[i][j] * pesos[i];
            }
            vectorResultante.push(suma);
        }
        
        // Calcular ángulo y magnitud del vector resultante
        const magnitudTotal = Math.sqrt(vectorResultante.reduce((sum, val) => sum + val * val, 0));
        const indiceMax = vectorResultante.indexOf(Math.max(...vectorResultante.map(Math.abs)));
        const anguloRadianes = Math.atan2(vectorResultante[1] || 0, vectorResultante[0] || 1);
        const anguloGrados = (anguloRadianes * 180 / Math.PI + 360) % 360;
        
        return {
            vector: vectorResultante,
            magnitud: magnitudTotal,
            angulo: anguloGrados,
            indice_max: indiceMax
        };
    }
    
    /**
     * TRANSFORMACIÓN DE FEYNMAN - Doble integral en espacio complejo z=9+16j @ 88MHz
     */
    aplicarTransformacionFeynman(entrada, salida, zReal, zImag, freq88MHz, log7919) {
        // Calcular módulo del número complejo z = 9 + 16j
        const moduloZ = Math.sqrt(zReal * zReal + zImag * zImag);
        const argZ = Math.atan2(zImag, zReal);
        
        // Ángulo de salida del espacio de leverage (transformación de Feynman)
        const leverageSpaceAngle = (salida.angulo * moduloZ * log7919) % 360;
        
        // Doble integral de Feynman: ∫∫ f(z) dz₁ dz₂ en el espacio complejo
        const integral1 = entrada.magnitud * Math.cos(argZ) * log7919;
        const integral2 = salida.magnitud * Math.sin(argZ) * log7919;
        const doubleIntegral = (integral1 + integral2) * (freq88MHz / 1e9); // Normalizar a GHz
        
        // Momentum cuántico modulado por 88MHz
        const quantumMomentum = (leverageSpaceAngle * doubleIntegral) / (moduloZ * log7919);
        
        return {
            leverageSpaceAngle,
            doubleIntegral,
            quantumMomentum,
            moduloZ,
            argZ: argZ * 180 / Math.PI // Convertir a grados
        };
    }
    
    sintetizarDecisionAngular(entrada, salida, feynmanTransform = null) {
        const anguloEntrada = entrada.angulo;
        const anguloSalida = salida.angulo;
        const diferencia = Math.abs(anguloEntrada - anguloSalida);
        
        // Clasificar según ángulos y transformación de Feynman
        let estrategia = 'HOLD';
        let confianza = 0.5;
        
        // Aplicar corrección de Feynman si está disponible
        if (feynmanTransform) {
            const leverageAngle = feynmanTransform.leverageSpaceAngle;
            const quantumMomentum = Math.abs(feynmanTransform.quantumMomentum);
            
            if (leverageAngle > 270 || leverageAngle < 90) {
                // Espacio de leverage alcista
                estrategia = quantumMomentum > 1000 ? 'STRONG_LONG' : 'LONG';
                confianza = Math.min(0.95, 0.7 + quantumMomentum / 10000);
            } else if (leverageAngle > 90 && leverageAngle < 270) {
                // Espacio de leverage bajista
                estrategia = quantumMomentum > 1000 ? 'STRONG_SHORT' : 'SHORT';
                confianza = Math.min(0.95, 0.7 + quantumMomentum / 10000);
            } else {
                // Zona neutral
                estrategia = 'FEYNMAN_HOLD';
                confianza = 0.6;
            }
        } else {
            // Análisis clásico sin Feynman
            if (diferencia > 90 && diferencia < 270) {
                // Ángulos opuestos = estrategia direccional clara
                estrategia = anguloEntrada < 180 ? 'LONG' : 'SHORT';
                confianza = Math.min(0.95, (entrada.magnitud + salida.magnitud) / 2);
            } else if (diferencia < 45) {
                // Ángulos similares = consolidación
                estrategia = 'CONSOLIDACION';
                confianza = 0.6;
            } else {
                // Ángulos moderados = volatilidad
                estrategia = 'VOLATILITY_PLAY';
                confianza = 0.7;
            }
        }
        
        return {
            estrategia: estrategia,
            confianza: confianza,
            diferencia_angular: diferencia,
            ejecutable: confianza > 0.65,
            razon: this.explicarDecisionAngular(estrategia, diferencia)
        };
    }
    
    explicarDecisionAngular(estrategia, diferencia, feynmanTransform = null) {
        const base = `Diferencia angular: ${diferencia.toFixed(1)}°`;
        
        if (feynmanTransform) {
            const leverageAngle = feynmanTransform.leverageSpaceAngle.toFixed(1);
            const momentum = feynmanTransform.quantumMomentum.toFixed(2);
            return `${estrategia} - ${base} - Feynman z=9+16j @ 88MHz - Leverage: ${leverageAngle}° - Momentum: ${momentum}`;
        }
        
        return `${estrategia} - ${base} - Basado en análisis puro de griegos`;
    }
    
    /**
     * API PÚBLICA - Interfaz para el sistema principal
     */
    async executeFullAnalysis(symbol, marketData) {
        try {
            // SRNOA como motor principal - calcular opciones óptimas
            const analisisSRNOA = await this.analizarPar(symbol, marketData);
            const volatilidad = this.calcularVolatilidad(marketData.prices);
            const precioActual = marketData.prices[marketData.prices.length - 1];
            
            // Determinar mejor opción basada en griegos SRNOA
            const mejorOpcion = this.seleccionarMejorOpcion(analisisSRNOA);
            
            // Calcular confianza SRNOA (independiente de Colibrí)
            const confianzaSRNOA = this.calcularConfianzaSRNOA(mejorOpcion, volatilidad);
            
            // Decisión final: SRNOA puro - sin validaciones externas
            const ejecutable = confianzaSRNOA >= 0.6;
            
            return {
                simbolo: symbol,
                precio_actual: precioActual,
                volatilidad: volatilidad,
                
                // Análisis SRNOA (motor principal)
                analisis_srnoa: {
                    mejor_call: analisisSRNOA.mejorCall,
                    mejor_put: analisisSRNOA.mejorPut,
                    opcion_recomendada: mejorOpcion,
                    confianza_srnoa: confianzaSRNOA,
                    griegos_optimos: mejorOpcion?.griegos
                },
                
                // Datos de volatilidad y momento
                datos_mercado: {
                    volatilidad_anualizada: volatilidad,
                    momentum_precio: this.calcularMomentum(marketData.prices),
                    trend_direccion: this.calcularTrend(marketData.prices)
                },
                
                // Decisión final
                confianza_total: confianzaSRNOA,
                ejecutable: ejecutable,
                razon_ejecucion: ejecutable ? 'SRNOA - Griegos optimizados' : 'Confianza SRNOA insuficiente',
                
                timestamp: Date.now()
            };
            
        } catch (error) {
            console.error(`Error en executeFullAnalysis para ${symbol}:`, error);
            return {
                simbolo: symbol,
                error: error.message,
                ejecutable: false,
                timestamp: Date.now()
            };
        }
    }
    
    async getTopOportunidades(symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']) {
        return await this.ejecutarEstrategiaIntegrada(symbols);
    }
    
    getEstadoSistema() {
        return {
            pares_activos: this.currentPairs.size,
            opciones_matriz: this.optionsMatrix.size,
            griegos_config: this.griegos,
            timestamp: Date.now()
        };
    }
    
    /**
     * ANÁLISIS TÉCNICO ADICIONAL - Para análisis puro de opciones
     */
    calcularMomentum(precios) {
        if (precios.length < 14) return 0;
        
        const recent = precios.slice(-14);
        const gains = [];
        const losses = [];
        
        for (let i = 1; i < recent.length; i++) {
            const change = recent[i] - recent[i-1];
            if (change > 0) {
                gains.push(change);
                losses.push(0);
            } else {
                gains.push(0);
                losses.push(Math.abs(change));
            }
        }
        
        const avgGain = gains.reduce((sum, g) => sum + g, 0) / gains.length;
        const avgLoss = losses.reduce((sum, l) => sum + l, 0) / losses.length;
        
        if (avgLoss === 0) return 100;
        
        const rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }
    
    calcularTrend(precios) {
        if (precios.length < 20) return 'NEUTRAL';
        
        const shortMA = this.sma(precios.slice(-10));
        const longMA = this.sma(precios.slice(-20));
        
        if (shortMA > longMA * 1.02) return 'BULLISH';
        if (shortMA < longMA * 0.98) return 'BEARISH';
        return 'NEUTRAL';
    }
    
    sma(valores) {
        return valores.reduce((sum, val) => sum + val, 0) / valores.length;
    }
}

module.exports = SRNOAOptionsMaker;

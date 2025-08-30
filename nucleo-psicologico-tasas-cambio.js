/**
 *  NÚCLEO PSICOLÓGICO CON TASAS DE CAMBIO
 * =========================================
 * 
 * Núcleo decisional que analiza el estado psicológico del mercado
 * basado en tasas de cambio de patrones fundamentales
 */

const { 
    PHYSICAL_CONSTANTS,
    quantumPhase,
    quantumMagnitude,
    quantumEnhancement,
    clamp01
} = require('./quantum/shared/quantum-kernel.js');

class NucleoPsicologicoTasasCambio {
    constructor() {
        //  ESTADOS PSICOLÓGICOS DEL MERCADO
        this.estadosPsicologicos = {
            EUFORIA: {
                puntuacion: 0.9,
                coherencia: 0.3,
                confianza: 0.95,
                emocion: 'EUFORIA',
                energia: 0.95,
                caracteristicas: ['FOMO extremo', 'Volumen explosivo', 'Precios irracionales']
            },
            OPTIMISMO: {
                puntuacion: 0.75,
                coherencia: 0.6,
                confianza: 0.8,
                emocion: 'OPTIMISMO',
                energia: 0.8,
                caracteristicas: ['Tendencia alcista', 'Volumen creciente', 'Sentimiento positivo']
            },
            NEUTRAL: {
                puntuacion: 0.5,
                coherencia: 0.8,
                confianza: 0.6,
                emocion: 'NEUTRAL',
                energia: 0.5,
                caracteristicas: ['Lateralización', 'Volumen estable', 'Sentimiento equilibrado']
            },
            PESIMISMO: {
                puntuacion: 0.25,
                coherencia: 0.6,
                confianza: 0.4,
                emocion: 'PESIMISMO',
                energia: 0.2,
                caracteristicas: ['Tendencia bajista', 'Volumen decreciente', 'Sentimiento negativo']
            },
            PANICO: {
                puntuacion: 0.1,
                coherencia: 0.2,
                confianza: 0.1,
                emocion: 'PANICO',
                energia: 0.05,
                caracteristicas: ['Venta masiva', 'Volumen extremo', 'Precios irracionales']
            }
        };
        
        // [DATA] PATRONES FUNDAMENTALES A MONITOREAR
        this.patronesFundamentales = {
            PRECIO: ['price', 'price_change', 'price_acceleration', 'price_momentum'],
            VOLUMEN: ['volume', 'volume_change', 'volume_expansion', 'volume_ratio'],
            FUNDING: ['funding_rate', 'funding_change', 'funding_volatility', 'funding_deviation'],
            VOLATILIDAD: ['volatility', 'volatility_change', 'volatility_risk', 'volatility_spike'],
            LIQUIDEZ: ['liquidity', 'spread', 'depth', 'slippage'],
            MOMENTUM: ['momentum', 'rsi', 'macd', 'stochastic']
        };
        
        //  UMBRALES DE DETECCIÓN
        this.umbrales = {
            CAMBIO_SIGNIFICATIVO: 0.05,    // 5% de cambio
            ACELERACION_ALTA: 0.1,         // 10% de aceleración
            VOLUMEN_EXPLOSIVO: 2.0,        // 200% del volumen normal
            VOLATILIDAD_EXTREMA: 0.15,     // 15% de volatilidad
            FUNDING_EXTREMO: 0.05,         // 5% de funding rate
            MOMENTUM_FUERTE: 0.7           // 70% de momentum
        };
    }
    
    /**
     *  ANALIZAR ESTADO PSICOLÓGICO COMPLETO
     */
    async analizarEstadoPsicologico(symbol, currentPrice, symbolData, estadoInicial = null) {
        try {
            console.log(` [NÚCLEO PSICOLÓGICO] Analizando estado psicológico para ${symbol}...`);
            
            // [DATA] 1. CALCULAR TASAS DE CAMBIO DE PATRONES FUNDAMENTALES
            const tasasCambio = this.calcularTasasCambioPatronesFundamentales(symbol, symbolData);
            
            //  2. DETECTAR ESTADO PSICOLÓGICO ACTUAL
            const estadoActual = this.detectarEstadoPsicologico(tasasCambio);
            
            // [RELOAD] 3. ANALIZAR TRANSICIÓN PSICOLÓGICA
            const transicion = this.analizarTransicionPsicologica(estadoInicial, estadoActual);
            
            //  4. APLICAR QUANTUM ENHANCEMENT
            const quantumEnhanced = this.aplicarQuantumEnhancement(estadoActual, tasasCambio);
            
            // [UP] 5. CALCULAR PROYECCIONES PSICOLÓGICAS
            const proyecciones = this.calcularProyeccionesPsicologicas(estadoActual, tasasCambio);
            
            console.log(`[OK] [NÚCLEO PSICOLÓGICO] Análisis completado - Estado: ${estadoActual.emocion}`);
            
            return {
                estado_psicologico: estadoActual,
                tasas_cambio: tasasCambio,
                transicion_psicologica: transicion,
                quantum_enhanced: quantumEnhanced,
                proyecciones: proyecciones,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('[ERROR] [NÚCLEO PSICOLÓGICO] Error en análisis:', error.message);
            return this.crearEstadoPsicologicoFallback();
        }
    }
    
    /**
     * [DATA] CALCULAR TASAS DE CAMBIO DE PATRONES FUNDAMENTALES
     */
    calcularTasasCambioPatronesFundamentales(symbol, symbolData) {
        if (!symbolData) return this.crearTasasCambioFallback();
        
        try {
            const tasas = {};
            
            // [DATA] TASAS DE CAMBIO DE PRECIO
            tasas.precio = this.calcularTasasCambioPrecio(symbolData);
            
            // [DATA] TASAS DE CAMBIO DE VOLUMEN
            tasas.volumen = this.calcularTasasCambioVolumen(symbolData);
            
            // [DATA] TASAS DE CAMBIO DE FUNDING
            tasas.funding = this.calcularTasasCambioFunding(symbolData);
            
            // [DATA] TASAS DE CAMBIO DE VOLATILIDAD
            tasas.volatilidad = this.calcularTasasCambioVolatilidad(symbolData);
            
            // [DATA] TASAS DE CAMBIO DE LIQUIDEZ
            tasas.liquidez = this.calcularTasasCambioLiquidez(symbolData);
            
            // [DATA] TASAS DE CAMBIO DE MOMENTUM
            tasas.momentum = this.calcularTasasCambioMomentum(symbolData);
            
            //  CALCULAR PUNTUACIÓN GLOBAL DE TASAS DE CAMBIO
            tasas.puntuacion_global = this.calcularPuntuacionGlobalTasasCambio(tasas);
            
            //  APLICAR QUANTUM PHASE
            const sumWeighted = tasas.puntuacion_global;
            tasas.quantum_phase = quantumPhase(sumWeighted, Math.log(7919));
            tasas.quantum_magnitude = quantumMagnitude(tasas.quantum_phase);
            tasas.quantum_enhancement = quantumEnhancement(sumWeighted, Math.log(7919));
            
            return tasas;
            
        } catch (error) {
            console.error('[ERROR] [TASAS CAMBIO] Error:', error.message);
            return this.crearTasasCambioFallback();
        }
    }
    
    /**
     *  DETECTAR ESTADO PSICOLÓGICO ACTUAL
     */
    detectarEstadoPsicologico(tasasCambio) {
        const { puntuacion_global, quantum_enhancement } = tasasCambio;
        
        //  APLICAR QUANTUM ENHANCEMENT A LA PUNTUACIÓN
        const puntuacionEnhanced = clamp01(puntuacion_global * (1 + quantum_enhancement * 0.3));
        
        // [ENDPOINTS] DETERMINAR ESTADO BASADO EN PUNTUACIÓN
        let estado;
        if (puntuacionEnhanced >= 0.8) {
            estado = this.estadosPsicologicos.EUFORIA;
        } else if (puntuacionEnhanced >= 0.6) {
            estado = this.estadosPsicologicos.OPTIMISMO;
        } else if (puntuacionEnhanced >= 0.4) {
            estado = this.estadosPsicologicos.NEUTRAL;
        } else if (puntuacionEnhanced >= 0.2) {
            estado = this.estadosPsicologicos.PESIMISMO;
        } else {
            estado = this.estadosPsicologicos.PANICO;
        }
        
        // [DATA] AJUSTAR PUNTUACIÓN CON QUANTUM ENHANCEMENT
        return {
            ...estado,
            puntuacion: puntuacionEnhanced,
            puntuacion_original: puntuacion_global,
            quantum_enhancement: quantum_enhancement
        };
    }
    
    /**
     * [RELOAD] ANALIZAR TRANSICIÓN PSICOLÓGICA
     */
    analizarTransicionPsicologica(estadoInicial, estadoActual) {
        if (!estadoInicial) {
            return {
                tipo: 'INICIAL',
                intensidad: 0,
                direccion: 'NEUTRAL',
                velocidad: 0
            };
        }
        
        const cambioPuntuacion = estadoActual.puntuacion - estadoInicial.puntuacion;
        const cambioEmocion = this.calcularCambioEmocional(estadoInicial.emocion, estadoActual.emocion);
        
        return {
            tipo: this.determinarTipoTransicion(cambioPuntuacion, cambioEmocional),
            intensidad: Math.abs(cambioPuntuacion),
            direccion: cambioPuntuacion > 0 ? 'POSITIVA' : 'NEGATIVA',
            velocidad: Math.abs(cambioPuntuacion) / 0.1, // Normalizado
            cambio_emocional: cambioEmocion
        };
    }
    
    /**
     *  APLICAR QUANTUM ENHANCEMENT
     */
    aplicarQuantumEnhancement(estado, tasasCambio) {
        const { quantum_phase, quantum_magnitude, quantum_enhancement } = tasasCambio;
        
        return {
            puntuacion_psicologica: clamp01(estado.puntuacion * (1 + quantum_enhancement * 0.3)),
            coherencia_psicologica: clamp01(estado.coherencia * (1 + quantum_magnitude * 0.2)),
            confianza_psicologica: clamp01(estado.confianza * (1 + quantum_phase * 0.25)),
            energia_psicologica: clamp01(estado.energia * (1 + quantum_enhancement * 0.4)),
            quantum_phase: quantum_phase,
            quantum_magnitude: quantum_magnitude,
            quantum_enhancement: quantum_enhancement
        };
    }
    
    /**
     * [UP] CALCULAR PROYECCIONES PSICOLÓGICAS
     */
    calcularProyeccionesPsicologicas(estado, tasasCambio) {
        const { quantum_phase, quantum_magnitude } = tasasCambio;
        
        // [DATA] PROYECCIÓN A CORTO PLAZO (1-4 horas)
        const proyeccionCortoPlazo = this.calcularProyeccionCortoPlazo(estado, quantum_phase);
        
        // [DATA] PROYECCIÓN A MEDIO PLAZO (4-24 horas)
        const proyeccionMedioPlazo = this.calcularProyeccionMedioPlazo(estado, quantum_magnitude);
        
        // [DATA] PROYECCIÓN A LARGO PLAZO (1-7 días)
        const proyeccionLargoPlazo = this.calcularProyeccionLargoPlazo(estado, tasasCambio);
        
        return {
            corto_plazo: proyeccionCortoPlazo,
            medio_plazo: proyeccionMedioPlazo,
            largo_plazo: proyeccionLargoPlazo,
            confianza_proyeccion: clamp01(estado.confianza * quantum_magnitude)
        };
    }
    
    //  MÉTODOS DE CÁLCULO DE TASAS DE CAMBIO
    
    calcularTasasCambioPrecio(symbolData) {
        const { price, price_change, price_acceleration } = symbolData;
        
        return {
            cambio_porcentual: price_change || 0,
            aceleracion: price_acceleration || 0,
            momentum: this.calcularMomentumPrecio(price_change),
            volatilidad: this.calcularVolatilidadPrecio(price),
            tendencia: this.determinarTendenciaPrecio(price_change)
        };
    }
    
    calcularTasasCambioVolumen(symbolData) {
        const { volume, volume_24h, volume_change } = symbolData;
        
        return {
            cambio_porcentual: volume_change || 0,
            ratio_24h: volume / (volume_24h || 1),
            expansion: this.calcularExpansionVolumen(volume, volume_24h),
            liquidez: this.calcularLiquidezVolumen(volume),
            intensidad: this.calcularIntensidadVolumen(volume_change)
        };
    }
    
    calcularTasasCambioFunding(symbolData) {
        const { funding_rate, funding_rate_change } = symbolData;
        
        return {
            tasa_actual: funding_rate || 0,
            cambio_porcentual: funding_rate_change || 0,
            volatilidad: this.calcularVolatilidadFunding(funding_rate),
            desviacion: this.calcularDesviacionFunding(funding_rate),
            presion: this.calcularPresionFunding(funding_rate)
        };
    }
    
    calcularTasasCambioVolatilidad(symbolData) {
        const { volatility, volatility_change } = symbolData;
        
        return {
            nivel_actual: volatility || 0,
            cambio_porcentual: volatility_change || 0,
            riesgo: this.calcularRiesgoVolatilidad(volatility),
            spike: this.detectarVolatilidadSpike(volatility_change),
            estabilidad: this.calcularEstabilidadVolatilidad(volatility)
        };
    }
    
    calcularTasasCambioLiquidez(symbolData) {
        const { bid, ask, volume } = symbolData;
        
        return {
            spread: this.calcularSpread(bid, ask),
            profundidad: this.calcularProfundidad(volume),
            slippage: this.calcularSlippage(volume),
            eficiencia: this.calcularEficienciaLiquidez(bid, ask, volume)
        };
    }
    
    calcularTasasCambioMomentum(symbolData) {
        const { rsi, macd, stochastic } = symbolData;
        
        return {
            rsi: rsi || 50,
            macd: macd || 0,
            stochastic: stochastic || 50,
            momentum_global: this.calcularMomentumGlobal(rsi, macd, stochastic),
            divergencia: this.detectarDivergenciaMomentum(rsi, macd, stochastic)
        };
    }
    
    //  MÉTODOS AUXILIARES
    
    calcularPuntuacionGlobalTasasCambio(tasas) {
        const componentes = [
            tasas.precio.cambio_porcentual * 0.25,
            tasas.volumen.cambio_porcentual * 0.20,
            tasas.funding.cambio_porcentual * 0.15,
            tasas.volatilidad.cambio_porcentual * 0.15,
            tasas.liquidez.eficiencia * 0.15,
            tasas.momentum.momentum_global * 0.10
        ];
        
        return clamp01(componentes.reduce((sum, comp) => sum + comp, 0));
    }
    
    calcularCambioEmocional(emocionInicial, emocionActual) {
        const emociones = ['PANICO', 'PESIMISMO', 'NEUTRAL', 'OPTIMISMO', 'EUFORIA'];
        const indiceInicial = emociones.indexOf(emocionInicial);
        const indiceActual = emociones.indexOf(emocionActual);
        return indiceActual - indiceInicial;
    }
    
    determinarTipoTransicion(cambioPuntuacion, cambioEmocional) {
        if (Math.abs(cambioPuntuacion) < 0.1) return 'ESTABLE';
        if (Math.abs(cambioEmocional) >= 2) return 'REVOLUCIONARIA';
        if (Math.abs(cambioEmocional) >= 1) return 'SIGNIFICATIVA';
        return 'MODERADA';
    }
    
    //  MÉTODOS DE CÁLCULO ESPECÍFICOS
    
    calcularMomentumPrecio(priceChange) {
        return clamp01((priceChange + 1) / 2);
    }
    
    calcularVolatilidadPrecio(price) {
        return price ? Math.min(price * 0.01, 1) : 0;
    }
    
    determinarTendenciaPrecio(priceChange) {
        if (priceChange > this.umbrales.CAMBIO_SIGNIFICATIVO) return 'ALCISTA';
        if (priceChange < -this.umbrales.CAMBIO_SIGNIFICATIVO) return 'BAJISTA';
        return 'LATERAL';
    }
    
    calcularExpansionVolumen(volume, volume24h) {
        if (!volume24h) return 0;
        return clamp01(volume / volume24h);
    }
    
    calcularLiquidezVolumen(volume) {
        return clamp01(volume / PHYSICAL_CONSTANTS.VOLUME_24H);
    }
    
    calcularIntensidadVolumen(volumeChange) {
        return clamp01(Math.abs(volumeChange));
    }
    
    calcularVolatilidadFunding(fundingRate) {
        return Math.abs(fundingRate - PHYSICAL_CONSTANTS.FUNDING_RATE);
    }
    
    calcularDesviacionFunding(fundingRate) {
        return (fundingRate - PHYSICAL_CONSTANTS.FUNDING_RATE) / PHYSICAL_CONSTANTS.FUNDING_DEVIATION;
    }
    
    calcularPresionFunding(fundingRate) {
        return fundingRate > 0 ? 'LONG' : 'SHORT';
    }
    
    calcularRiesgoVolatilidad(volatility) {
        return clamp01(volatility / PHYSICAL_CONSTANTS.VOLATILITY_RISK);
    }
    
    detectarVolatilidadSpike(volatilityChange) {
        return Math.abs(volatilityChange) > this.umbrales.VOLATILIDAD_EXTREMA;
    }
    
    calcularEstabilidadVolatilidad(volatility) {
        return 1 - clamp01(volatility / this.umbrales.VOLATILIDAD_EXTREMA);
    }
    
    calcularSpread(bid, ask) {
        if (!bid || !ask) return 0;
        return (ask - bid) / bid;
    }
    
    calcularProfundidad(volume) {
        return clamp01(volume / PHYSICAL_CONSTANTS.MARKET_DEPTH);
    }
    
    calcularSlippage(volume) {
        return clamp01(volume / PHYSICAL_CONSTANTS.VOLUME_24H);
    }
    
    calcularEficienciaLiquidez(bid, ask, volume) {
        const spread = this.calcularSpread(bid, ask);
        const profundidad = this.calcularProfundidad(volume);
        return clamp01((1 - spread) * profundidad);
    }
    
    calcularMomentumGlobal(rsi, macd, stochastic) {
        const rsiNorm = (rsi - 50) / 50;
        const macdNorm = clamp01(macd);
        const stochNorm = (stochastic - 50) / 50;
        return clamp01((rsiNorm + macdNorm + stochNorm) / 3);
    }
    
    detectarDivergenciaMomentum(rsi, macd, stochastic) {
        const rsiTrend = rsi > 50 ? 'ALCISTA' : 'BAJISTA';
        const macdTrend = macd > 0 ? 'ALCISTA' : 'BAJISTA';
        const stochTrend = stochastic > 50 ? 'ALCISTA' : 'BAJISTA';
        
        const trends = [rsiTrend, macdTrend, stochTrend];
        const alcista = trends.filter(t => t === 'ALCISTA').length;
        const bajista = trends.filter(t => t === 'BAJISTA').length;
        
        if (alcista > bajista) return 'ALCISTA';
        if (bajista > alcista) return 'BAJISTA';
        return 'NEUTRAL';
    }
    
    // [UP] MÉTODOS DE PROYECCIÓN
    
    calcularProyeccionCortoPlazo(estado, quantumPhase) {
        const tendencia = estado.emocion === 'EUFORIA' || estado.emocion === 'OPTIMISMO' ? 'ALCISTA' : 'BAJISTA';
        const intensidad = estado.puntuacion * quantumPhase;
        
        return {
            direccion: tendencia,
            intensidad: clamp01(intensidad),
            confianza: clamp01(estado.confianza * 0.8),
            timeframe: '1-4 horas'
        };
    }
    
    calcularProyeccionMedioPlazo(estado, quantumMagnitude) {
        const tendencia = this.calcularTendenciaMedioPlazo(estado);
        const intensidad = estado.puntuacion * quantumMagnitude;
        
        return {
            direccion: tendencia,
            intensidad: clamp01(intensidad),
            confianza: clamp01(estado.confianza * 0.6),
            timeframe: '4-24 horas'
        };
    }
    
    calcularProyeccionLargoPlazo(estado, tasasCambio) {
        const tendencia = this.calcularTendenciaLargoPlazo(estado, tasasCambio);
        const intensidad = estado.puntuacion * tasasCambio.quantum_enhancement;
        
        return {
            direccion: tendencia,
            intensidad: clamp01(intensidad),
            confianza: clamp01(estado.confianza * 0.4),
            timeframe: '1-7 días'
        };
    }
    
    calcularTendenciaMedioPlazo(estado) {
        switch (estado.emocion) {
            case 'EUFORIA': return 'ALCISTA_FUERTE';
            case 'OPTIMISMO': return 'ALCISTA';
            case 'NEUTRAL': return 'LATERAL';
            case 'PESIMISMO': return 'BAJISTA';
            case 'PANICO': return 'BAJISTA_FUERTE';
            default: return 'LATERAL';
        }
    }
    
    calcularTendenciaLargoPlazo(estado, tasasCambio) {
        const { momentum, volatilidad } = tasasCambio;
        
        if (estado.emocion === 'EUFORIA' && momentum.momentum_global > 0.7) {
            return 'ALCISTA_FUERTE';
        } else if (estado.emocion === 'PANICO' && volatilidad.riesgo > 0.8) {
            return 'BAJISTA_FUERTE';
        } else if (estado.emocion === 'OPTIMISMO') {
            return 'ALCISTA';
        } else if (estado.emocion === 'PESIMISMO') {
            return 'BAJISTA';
        }
        
        return 'LATERAL';
    }
    
    //  MÉTODOS FALLBACK
    
    crearTasasCambioFallback() {
        return {
            precio: { cambio_porcentual: 0, aceleracion: 0, momentum: 0, volatilidad: 0, tendencia: 'LATERAL' },
            volumen: { cambio_porcentual: 0, ratio_24h: 0, expansion: 0, liquidez: 0, intensidad: 0 },
            funding: { tasa_actual: 0, cambio_porcentual: 0, volatilidad: 0, desviacion: 0, presion: 'NEUTRAL' },
            volatilidad: { nivel_actual: 0, cambio_porcentual: 0, riesgo: 0, spike: false, estabilidad: 1 },
            liquidez: { spread: 0, profundidad: 0, slippage: 0, eficiencia: 0 },
            momentum: { rsi: 50, macd: 0, stochastic: 50, momentum_global: 0, divergencia: 'NEUTRAL' },
            puntuacion_global: 0.5,
            quantum_phase: 0,
            quantum_magnitude: 0,
            quantum_enhancement: 0
        };
    }
    
    crearEstadoPsicologicoFallback() {
        return {
            estado_psicologico: this.estadosPsicologicos.NEUTRAL,
            tasas_cambio: this.crearTasasCambioFallback(),
            transicion_psicologica: { tipo: 'FALLBACK', intensidad: 0, direccion: 'NEUTRAL', velocidad: 0 },
            quantum_enhanced: {
                puntuacion_psicologica: 0.5,
                coherencia_psicologica: 0.8,
                confianza_psicologica: 0.6,
                energia_psicologica: 0.5,
                quantum_phase: 0,
                quantum_magnitude: 0,
                quantum_enhancement: 0
            },
            proyecciones: {
                corto_plazo: { direccion: 'LATERAL', intensidad: 0, confianza: 0.5, timeframe: '1-4 horas' },
                medio_plazo: { direccion: 'LATERAL', intensidad: 0, confianza: 0.4, timeframe: '4-24 horas' },
                largo_plazo: { direccion: 'LATERAL', intensidad: 0, confianza: 0.3, timeframe: '1-7 días' },
                confianza_proyeccion: 0.5
            },
            timestamp: new Date().toISOString()
        };
    }
}

// Crear instancia y exportar función
const nucleoPsicologico = new NucleoPsicologicoTasasCambio();

module.exports = { 
    NucleoPsicologicoTasasCambio,
    analizarEstadoPsicologico: (symbol, currentPrice, symbolData, estadoInicial) => 
        nucleoPsicologico.analizarEstadoPsicologico(symbol, currentPrice, symbolData, estadoInicial)
};

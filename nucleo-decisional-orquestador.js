/**
 *  NÚCLEO DECISIONAL ORQUESTADOR
 * ================================
 * 
 * Orquestador central que coordina todos los componentes del núcleo decisional
 * Integra análisis psicológico y tasas de cambio de patrones fundamentales
 */

const { NucleoPsicologicoTasasCambio } = require('./nucleo-psicologico-tasas-cambio.js');

class NucleoDecisionalOrquestador {
    constructor() {
        //  NÚCLEO PSICOLÓGICO (COMPONENTE PRINCIPAL)
        this.nucleoPsicologico = new NucleoPsicologicoTasasCambio();
        
        // [RELOAD] COMPONENTES DEL NÚCLEO DECISIONAL
        this.universosParalelos = null;
        this.superposicionMultiActivo = null;
        this.resonanciaSimbolos = null;
        this.feynmanOptimizer = null;
        
        // [DATA] ESTADO GLOBAL DEL SISTEMA
        this.estadoGlobal = {
            ultimaActualizacion: Date.now(),
            estadoPsicologico: null,
            tasasCambio: null,
            decisionesPendientes: [],
            performanceHistorica: new Map()
        };
        
        //  CONFIGURACIÓN
        this.config = {
            intervaloActualizacion: 5000, // 5 segundos
            maxDecisionesPendientes: 10,
            umbralConfianza: 0.7,
            modoAdaptativo: true
        };
        
        // [START] INICIALIZAR COMPONENTES
        this.inicializarComponentes();
        
        // [RELOAD] INICIAR ACTUALIZACIÓN AUTOMÁTICA
        this.iniciarActualizacionAutomatica();
    }
    
    /**
     * [START] INICIALIZAR COMPONENTES DEL NÚCLEO DECISIONAL
     */
    async inicializarComponentes() {
        console.log(' [ORQUESTADOR] Inicializando componentes del núcleo decisional...');
        
        try {
            // UNIVERSOS PARALELOS
            try {
                const { UniversosParalelos } = require('./UniversosParalelos.js');
                this.universosParalelos = new UniversosParalelos();
                console.log('[OK] [ORQUESTADOR] Universos Paralelos inicializado');
            } catch (error) {
                console.warn('[WARNING] [ORQUESTADOR] Universos Paralelos no disponible, usando cache QBTC');
                this.universosParalelos = this.crearComponenteCache('universos');
            }
            
            // SUPERPOSICIÓN MULTI-ACTIVO
            try {
                const { SuperposicionMultiActivo } = require('./SuperposicionMultiActivo.js');
                this.superposicionMultiActivo = new SuperposicionMultiActivo();
                console.log('[OK] [ORQUESTADOR] Superposición Multi-Activo inicializado');
            } catch (error) {
                console.warn('[WARNING] [ORQUESTADOR] Superposición Multi-Activo no disponible, usando cache QBTC');
                this.superposicionMultiActivo = this.crearComponenteCache('superposicion');
            }
            
            // RESONANCIA SÍMBOLOS
            try {
                const { ResonanciaSimbolos } = require('./ResonanciaSimbolos.js');
                this.resonanciaSimbolos = new ResonanciaSimbolos();
                console.log('[OK] [ORQUESTADOR] Resonancia Símbolos inicializado');
            } catch (error) {
                console.warn('[WARNING] [ORQUESTADOR] Resonancia Símbolos no disponible, usando cache QBTC');
                this.resonanciaSimbolos = this.crearComponenteCache('resonancia');
            }
            
            // FEYNMAN QUANTUM OPTIMIZER
            try {
                const { FeynmanQuantumOptimizer } = require('./FeynmanQuantumOptimizer.js');
                this.feynmanOptimizer = new FeynmanQuantumOptimizer();
                console.log('[OK] [ORQUESTADOR] Feynman Quantum Optimizer inicializado');
            } catch (error) {
                console.warn('[WARNING] [ORQUESTADOR] Feynman Quantum Optimizer no disponible, usando cache QBTC');
                this.feynmanOptimizer = this.crearComponenteCache('feynman');
            }
            
            console.log('[ENDPOINTS] [ORQUESTADOR] Todos los componentes inicializados correctamente');
            
        } catch (error) {
            console.error('[ERROR] [ORQUESTADOR] Error inicializando componentes:', error.message);
        }
    }
    
    /**
     *  TOMAR DECISIÓN INTEGRAL
     */
    async tomarDecision(symbol, currentPrice, timeHorizon = '30d') {
        console.log(` [ORQUESTADOR] Tomando decisión para ${symbol} a $${currentPrice}...`);
        
        try {
            // [DATA] 1. ANÁLISIS PSICOLÓGICO COMPLETO
            const estadoPsicologico = await this.nucleoPsicologico.analisisCompleto(symbol, currentPrice, timeHorizon);
            this.estadoGlobal.estadoPsicologico = estadoPsicologico;
            
            console.log(` [PSICOLÓGICO] Estado: ${estadoPsicologico.estado_psicologico.estado} (${estadoPsicologico.estado_psicologico.puntuacion.toFixed(3)})`);
            
            // [UP] 2. OBTENER TASAS DE CAMBIO
            const tasasCambio = await this.nucleoPsicologico.analizarTasasCambio(symbol, currentPrice, timeHorizon);
            this.estadoGlobal.tasasCambio = tasasCambio;
            
            // [RELOAD] 3. ALIMENTAR TODOS LOS COMPONENTES
            await this.alimentarComponentes(estadoPsicologico, tasasCambio);
            
            // [ENDPOINTS] 4. EJECUTAR COMPONENTES CON ESTADO PSICOLÓGICO
            const resultados = await this.ejecutarComponentes(symbol, currentPrice, estadoPsicologico);
            
            //  5. SINTETIZAR DECISIÓN FINAL
            const decisionFinal = await this.sintetizarDecisionFinal(symbol, currentPrice, resultados, estadoPsicologico, tasasCambio);
            
            // [DATA] 6. REGISTRAR DECISIÓN
            this.registrarDecision(decisionFinal);
            
            console.log(`[OK] [ORQUESTADOR] Decisión tomada: ${decisionFinal.accion} (Confianza: ${decisionFinal.confianza.toFixed(3)})`);
            
            return decisionFinal;
            
        } catch (error) {
            console.error('[ERROR] [ORQUESTADOR] Error tomando decisión:', error.message);
            return this.crearDecisionFallback(symbol, currentPrice, error.message);
        }
    }
    
    /**
     * [RELOAD] ALIMENTAR COMPONENTES CON ESTADO PSICOLÓGICO
     */
    async alimentarComponentes(estadoPsicologico, tasasCambio) {
        console.log('[RELOAD] [ORQUESTADOR] Alimentando componentes con estado psicológico...');
        
        try {
            // UNIVERSOS PARALELOS
            if (this.universosParalelos && this.universosParalelos.actualizarEstadoPsicologico) {
                await this.universosParalelos.actualizarEstadoPsicologico(estadoPsicologico, tasasCambio);
            }
            
            // SUPERPOSICIÓN MULTI-ACTIVO
            if (this.superposicionMultiActivo && this.superposicionMultiActivo.actualizarEstadoPsicologico) {
                await this.superposicionMultiActivo.actualizarEstadoPsicologico(estadoPsicologico, tasasCambio);
            }
            
            // RESONANCIA SÍMBOLOS
            if (this.resonanciaSimbolos && this.resonanciaSimbolos.actualizarEstadoPsicologico) {
                await this.resonanciaSimbolos.actualizarEstadoPsicologico(estadoPsicologico, tasasCambio);
            }
            
            // FEYNMAN OPTIMIZER
            if (this.feynmanOptimizer && this.feynmanOptimizer.actualizarEstadoPsicologico) {
                await this.feynmanOptimizer.actualizarEstadoPsicologico(estadoPsicologico, tasasCambio);
            }
            
            console.log('[OK] [ORQUESTADOR] Componentes alimentados correctamente');
            
        } catch (error) {
            console.error('[ERROR] [ORQUESTADOR] Error alimentando componentes:', error.message);
        }
    }
    
    /**
     * [ENDPOINTS] EJECUTAR COMPONENTES CON ESTADO PSICOLÓGICO
     */
    async ejecutarComponentes(symbol, currentPrice, estadoPsicologico) {
        console.log('[ENDPOINTS] [ORQUESTADOR] Ejecutando componentes...');
        
        const resultados = {};
        
        try {
            // UNIVERSOS PARALELOS
            if (this.universosParalelos) {
                try {
                    resultados.universosParalelos = await this.universosParalelos.realizarPrediccion(symbol, estadoPsicologico);
                    console.log('[OK] [UNIVERSOS] Predicción realizada');
                } catch (error) {
                    console.error('[ERROR] [UNIVERSOS] Error:', error.message);
                    resultados.universosParalelos = this.crearResultadoFallback('universos');
                }
            }
            
            // SUPERPOSICIÓN MULTI-ACTIVO
            if (this.superposicionMultiActivo) {
                try {
                    resultados.superposicionMultiActivo = await this.superposicionMultiActivo.calcularSuperposicion(symbol, estadoPsicologico);
                    console.log('[OK] [SUPERPOSICIÓN] Cálculo realizado');
                } catch (error) {
                    console.error('[ERROR] [SUPERPOSICIÓN] Error:', error.message);
                    resultados.superposicionMultiActivo = this.crearResultadoFallback('superposicion');
                }
            }
            
            // RESONANCIA SÍMBOLOS
            if (this.resonanciaSimbolos) {
                try {
                    resultados.resonanciaSimbolos = await this.resonanciaSimbolos.amplificarSeñal(symbol, estadoPsicologico);
                    console.log('[OK] [RESONANCIA] Señal amplificada');
                } catch (error) {
                    console.error('[ERROR] [RESONANCIA] Error:', error.message);
                    resultados.resonanciaSimbolos = this.crearResultadoFallback('resonancia');
                }
            }
            
            // FEYNMAN OPTIMIZER
            if (this.feynmanOptimizer) {
                try {
                    resultados.feynmanOptimizer = await this.feynmanOptimizer.optimizar(symbol, estadoPsicologico);
                    console.log('[OK] [FEYNMAN] Optimización realizada');
                } catch (error) {
                    console.error('[ERROR] [FEYNMAN] Error:', error.message);
                    resultados.feynmanOptimizer = this.crearResultadoFallback('feynman');
                }
            }
            
            console.log('[OK] [ORQUESTADOR] Todos los componentes ejecutados');
            return resultados;
            
        } catch (error) {
            console.error('[ERROR] [ORQUESTADOR] Error ejecutando componentes:', error.message);
            return this.crearResultadosFallback();
        }
    }
    
    /**
     *  SINTETIZAR DECISIÓN FINAL
     */
    async sintetizarDecisionFinal(symbol, currentPrice, resultados, estadoPsicologico, tasasCambio) {
        console.log(' [ORQUESTADOR] Sintetizando decisión final...');
        
        try {
            // [DATA] CALCULAR PESOS BASADOS EN ESTADO PSICOLÓGICO
            const pesos = this.calcularPesosPsicologicos(estadoPsicologico);
            
            // [ENDPOINTS] SINTETIZAR RESULTADOS
            let decisionFinal = {
                symbol,
                currentPrice,
                timestamp: new Date().toISOString(),
                accion: 'ESPERAR',
                confianza: 0.5,
                razon: 'Análisis en progreso',
                detalles: {},
                componentes: {}
            };
            
            // [DATA] PROCESAR RESULTADOS DE CADA COMPONENTE
            if (resultados.universosParalelos) {
                const peso = pesos.universosParalelos || 0.25;
                decisionFinal = this.procesarResultadoUniversos(resultados.universosParalelos, decisionFinal, peso);
            }
            
            if (resultados.superposicionMultiActivo) {
                const peso = pesos.superposicionMultiActivo || 0.25;
                decisionFinal = this.procesarResultadoSuperposicion(resultados.superposicionMultiActivo, decisionFinal, peso);
            }
            
            if (resultados.resonanciaSimbolos) {
                const peso = pesos.resonanciaSimbolos || 0.25;
                decisionFinal = this.procesarResultadoResonancia(resultados.resonanciaSimbolos, decisionFinal, peso);
            }
            
            if (resultados.feynmanOptimizer) {
                const peso = pesos.feynmanOptimizer || 0.25;
                decisionFinal = this.procesarResultadoFeynman(resultados.feynmanOptimizer, decisionFinal, peso);
            }
            
            //  APLICAR AJUSTES PSICOLÓGICOS
            decisionFinal = this.aplicarAjustesPsicologicos(decisionFinal, estadoPsicologico, tasasCambio);
            
            // [DATA] NORMALIZAR CONFIANZA
            decisionFinal.confianza = Math.max(0.1, Math.min(1.0, decisionFinal.confianza));
            
            // [ENDPOINTS] DETERMINAR ACCIÓN FINAL
            decisionFinal.accion = this.determinarAccionFinal(decisionFinal.confianza, estadoPsicologico);
            
            console.log(`[OK] [ORQUESTADOR] Decisión sintetizada: ${decisionFinal.accion} (${decisionFinal.confianza.toFixed(3)})`);
            
            return decisionFinal;
            
        } catch (error) {
            console.error('[ERROR] [ORQUESTADOR] Error sintetizando decisión:', error.message);
            return this.crearDecisionFallback(symbol, currentPrice, error.message);
        }
    }
    
    /**
     * [DATA] CALCULAR PESOS PSICOLÓGICOS
     */
    calcularPesosPsicologicos(estadoPsicologico) {
        const { estado, puntuacion } = estadoPsicologico.estado_psicologico;
        
        // PESOS BASE
        const pesosBase = {
            universosParalelos: 0.25,
            superposicionMultiActivo: 0.25,
            resonanciaSimbolos: 0.25,
            feynmanOptimizer: 0.25
        };
        
        // AJUSTES BASADOS EN ESTADO PSICOLÓGICO
        const ajustes = {
            'EUPHORIA': { universosParalelos: 0.4, superposicionMultiActivo: 0.3, resonanciaSimbolos: 0.2, feynmanOptimizer: 0.1 },
            'OPTIMISMO': { universosParalelos: 0.35, superposicionMultiActivo: 0.3, resonanciaSimbolos: 0.2, feynmanOptimizer: 0.15 },
            'NEUTRAL': { universosParalelos: 0.25, superposicionMultiActivo: 0.25, resonanciaSimbolos: 0.25, feynmanOptimizer: 0.25 },
            'PESIMISMO': { universosParalelos: 0.15, superposicionMultiActivo: 0.2, resonanciaSimbolos: 0.3, feynmanOptimizer: 0.35 },
            'PANICO': { universosParalelos: 0.1, superposicionMultiActivo: 0.2, resonanciaSimbolos: 0.4, feynmanOptimizer: 0.3 }
        };
        
        const ajuste = ajustes[estado] || ajustes.NEUTRAL;
        
        // APLICAR AJUSTES
        Object.keys(pesosBase).forEach(componente => {
            pesosBase[componente] = ajuste[componente] || pesosBase[componente];
        });
        
        return pesosBase;
    }
    
    /**
     * [ENDPOINTS] DETERMINAR ACCIÓN FINAL
     */
    determinarAccionFinal(confianza, estadoPsicologico) {
        const { estado, puntuacion } = estadoPsicologico.estado_psicologico;
        
        // LÓGICA BASADA EN CONFIANZA Y ESTADO PSICOLÓGICO
        if (confianza >= 0.8) {
            if (estado === 'EUPHORIA') return 'VENDER'; // Contrario en euforia
            if (estado === 'PANICO') return 'COMPRAR'; // Contrario en pánico
            return 'COMPRAR'; // Alta confianza
        } else if (confianza >= 0.6) {
            if (estado === 'OPTIMISMO') return 'COMPRAR';
            if (estado === 'PESIMISMO') return 'VENDER';
            return 'COMPRAR'; // Confianza moderada
        } else if (confianza >= 0.4) {
            return 'ESPERAR'; // Confianza baja
        } else {
            return 'ESPERAR'; // Confianza muy baja
        }
    }
    
    /**
     * [RELOAD] INICIAR ACTUALIZACIÓN AUTOMÁTICA
     */
    iniciarActualizacionAutomatica() {
        setInterval(async () => {
            try {
                this.estadoGlobal.ultimaActualizacion = Date.now();
                
                // ACTUALIZAR ESTADO PSICOLÓGICO GLOBAL
                if (this.estadoGlobal.estadoPsicologico) {
                    const symbol = this.estadoGlobal.estadoPsicologico.symbol;
                    const currentPrice = this.estadoGlobal.estadoPsicologico.current_price;
                    
                    const nuevoEstado = await this.nucleoPsicologico.analisisCompleto(symbol, currentPrice);
                    this.estadoGlobal.estadoPsicologico = nuevoEstado;
                }
                
            } catch (error) {
                console.error('[ERROR] [ORQUESTADOR] Error en actualización automática:', error.message);
            }
        }, this.config.intervaloActualizacion);
        
        console.log(`[RELOAD] [ORQUESTADOR] Actualización automática iniciada (${this.config.intervaloActualizacion}ms)`);
    }
    
    /**
     * [DATA] REGISTRAR DECISIÓN
     */
    registrarDecision(decision) {
        this.estadoGlobal.decisionesPendientes.push({
            ...decision,
            timestamp: Date.now()
        });
        
        // MANTENER SOLO LAS ÚLTIMAS DECISIONES
        if (this.estadoGlobal.decisionesPendientes.length > this.config.maxDecisionesPendientes) {
            this.estadoGlobal.decisionesPendientes = this.estadoGlobal.decisionesPendientes.slice(-this.config.maxDecisionesPendientes);
        }
    }
    
    /**
     * [DATA] OBTENER ESTADO GLOBAL
     */
    obtenerEstadoGlobal() {
        return {
            ...this.estadoGlobal,
            config: this.config,
            componentesActivos: {
                nucleoPsicologico: !!this.nucleoPsicologico,
                universosParalelos: !!this.universosParalelos,
                superposicionMultiActivo: !!this.superposicionMultiActivo,
                resonanciaSimbolos: !!this.resonanciaSimbolos,
                feynmanOptimizer: !!this.feynmanOptimizer
            }
        };
    }
    
    //  MÉTODOS AUXILIARES Y MOCKS
    
    crearMockUniversosParalelos() {
        return {
            async realizarPrediccion(symbol, estadoPsicologico) {
                return {
                    symbol,
                    prediccion: {
                        direction: 'NEUTRAL',
                        targetPrice: 65000,
                        expectedChange: 0,
                        strength: 0.7,
                        confidence: 0.8
                    },
                    universoPrincipal: 2,
                    coherencia: 0.95,
                    timestamp: Date.now()
                };
            }
        };
    }
    
    crearMockSuperposicionMultiActivo() {
        return {
            async calcularSuperposicion(symbol, estadoPsicologico) {
                return {
                    symbol,
                    estrategias: [],
                    probabilidadTotal: 0.7,
                    rendimientoEsperado: 0.05,
                    timestamp: Date.now()
                };
            }
        };
    }
    
    crearMockResonanciaSimbolos() {
        return {
            async amplificarSeñal(symbol, estadoPsicologico) {
                return {
                    symbol,
                    señalAmplificada: {
                        strength: 0.8,
                        confidence: 0.75,
                        factorAmplificacion: 1.2
                    },
                    timestamp: Date.now()
                };
            }
        };
    }
    
    crearMockFeynmanOptimizer() {
        return {
            async optimizar(symbol, estadoPsicologico) {
                return {
                    symbol,
                    optimizacion: {
                        efficiency: 0.9,
                        zOptimal: { real: 9, imaginary: 16 },
                        ventajaTemporal: -3000
                    },
                    timestamp: Date.now()
                };
            }
        };
    }
    
    crearResultadoFallback(componente) {
        return {
            componente,
            error: true,
            timestamp: Date.now()
        };
    }
    
    crearResultadosFallback() {
        return {
            universosParalelos: this.crearResultadoFallback('universos'),
            superposicionMultiActivo: this.crearResultadoFallback('superposicion'),
            resonanciaSimbolos: this.crearResultadoFallback('resonancia'),
            feynmanOptimizer: this.crearResultadoFallback('feynman')
        };
    }
    
    crearDecisionFallback(symbol, currentPrice, error) {
        return {
            symbol,
            currentPrice,
            timestamp: new Date().toISOString(),
            accion: 'ESPERAR',
            confianza: 0.3,
            razon: `Error: ${error}`,
            detalles: {},
            componentes: {}
        };
    }
    
    procesarResultadoUniversos(resultado, decision, peso) {
        if (resultado.error) return decision;
        
        const prediccion = resultado.prediccion;
        decision.confianza += prediccion.confidence * peso;
        decision.componentes.universosParalelos = prediccion;
        
        return decision;
    }
    
    procesarResultadoSuperposicion(resultado, decision, peso) {
        if (resultado.error) return decision;
        
        decision.confianza += resultado.probabilidadTotal * peso;
        decision.componentes.superposicionMultiActivo = resultado;
        
        return decision;
    }
    
    procesarResultadoResonancia(resultado, decision, peso) {
        if (resultado.error) return decision;
        
        const señal = resultado.señalAmplificada;
        decision.confianza += señal.confidence * peso;
        decision.componentes.resonanciaSimbolos = resultado;
        
        return decision;
    }
    
    procesarResultadoFeynman(resultado, decision, peso) {
        if (resultado.error) return decision;
        
        const optimizacion = resultado.optimizacion;
        decision.confianza += optimizacion.efficiency * peso;
        decision.componentes.feynmanOptimizer = resultado;
        
        return decision;
    }
    
    aplicarAjustesPsicologicos(decision, estadoPsicologico, tasasCambio) {
        const { estado, puntuacion } = estadoPsicologico.estado_psicologico;
        
        // AJUSTES BASADOS EN ESTADO PSICOLÓGICO
        const ajustes = {
            'EUPHORIA': { multiplicador: 0.8, razon: 'Mercado en euforia - precaución' },
            'OPTIMISMO': { multiplicador: 1.1, razon: 'Optimismo moderado - favorable' },
            'NEUTRAL': { multiplicador: 1.0, razon: 'Estado neutral' },
            'PESIMISMO': { multiplicador: 0.9, razon: 'Pesimismo - ajuste conservador' },
            'PANICO': { multiplicador: 1.2, razon: 'Pánico - oportunidad contraria' }
        };
        
        const ajuste = ajustes[estado] || ajustes.NEUTRAL;
        
        decision.confianza *= ajuste.multiplicador;
        decision.razon = `${decision.razon} | ${ajuste.razon}`;
        
        return decision;
    }
}

module.exports = { NucleoDecisionalOrquestador };

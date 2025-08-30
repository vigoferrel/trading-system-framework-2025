/**
 *  INTEGRACIÓN NÚCLEO PSICOLÓGICO CON SISTEMA QBTC
 * ==================================================
 * 
 * Integra el núcleo psicológico con tasas de cambio en el sistema QBTC existente
 */

const { NucleoPsicologicoTasasCambio } = require('./nucleo-psicologico-tasas-cambio.js');
const { QuantumOrchestratorEnhanced } = require('./quantum-orchestrator-enhanced.js');

class IntegracionNucleoPsicologico {
    constructor() {
        //  NÚCLEO PSICOLÓGICO
        this.nucleoPsicologico = new NucleoPsicologicoTasasCambio();
        
        //  ORQUESTADOR CUÁNTICO ENHANCED
        this.quantumOrchestrator = new QuantumOrchestratorEnhanced();
        
        // [DATA] ESTADO GLOBAL DEL SISTEMA
        this.estadoGlobal = {
            ultimaActualizacion: null,
            estadoPsicologicoActual: null,
            oportunidadesDetectadas: [],
            alertasPsicologicas: [],
            metricasGlobales: {}
        };
        
        //  CONFIGURACIÓN
        this.config = {
            intervaloActualizacion: 30000, // 30 segundos
            umbralAlertaPsicologica: 0.8,
            maxOportunidades: 10,
            activarLogs: true
        };
        
        // [START] INICIALIZAR INTEGRACIÓN
        this.inicializarIntegracion();
    }
    
    /**
     * [START] INICIALIZAR INTEGRACIÓN
     */
    async inicializarIntegracion() {
        console.log(' [INTEGRACIÓN NÚCLEO PSICOLÓGICO] Inicializando integración...');
        
        try {
            // [DATA] CARGAR DATOS INICIALES
            await this.cargarDatosIniciales();
            
            //  ANALIZAR ESTADO PSICOLÓGICO INICIAL
            await this.analizarEstadoPsicologicoInicial();
            
            // [RELOAD] INICIAR MONITOREO CONTINUO
            this.iniciarMonitoreoContinuo();
            
            console.log('[OK] [INTEGRACIÓN NÚCLEO PSICOLÓGICO] Integración inicializada correctamente');
            
        } catch (error) {
            console.error('[ERROR] [INTEGRACIÓN NÚCLEO PSICOLÓGICO] Error en inicialización:', error.message);
        }
    }
    
    /**
     * [DATA] CARGAR DATOS INICIALES
     */
    async cargarDatosIniciales() {
        try {
            // [SEARCH] OBTENER DATOS DEL CACHE QBTC
            const response = await fetch('http://localhost:4602/api/market-data');
            if (response.ok) {
                const qbtcData = await response.json();
                this.qbtcData = qbtcData;
                console.log('[OK] [DATOS INICIALES] Cache QBTC cargado correctamente');
            } else {
                console.warn('[WARNING] [DATOS INICIALES] No se pudo cargar cache QBTC');
                this.qbtcData = null;
            }
        } catch (error) {
            console.warn('[WARNING] [DATOS INICIALES] Error cargando datos:', error.message);
            this.qbtcData = null;
        }
    }
    
    /**
     *  ANALIZAR ESTADO PSICOLÓGICO INICIAL
     */
    async analizarEstadoPsicologicoInicial() {
        try {
            // [ENDPOINTS] ANALIZAR SÍMBOLOS PRINCIPALES
            const simbolosPrincipales = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
            
            for (const symbol of simbolosPrincipales) {
                const symbolData = this.obtenerDatosSimbolo(symbol);
                if (symbolData) {
                    const estadoPsicologico = await this.nucleoPsicologico.analizarEstadoPsicologico(
                        symbol,
                        symbolData.price || 0,
                        symbolData
                    );
                    
                    if (this.config.activarLogs) {
                        console.log(` [ESTADO INICIAL] ${symbol}: ${estadoPsicologico.estado_psicologico.emocion} (${estadoPsicologico.estado_psicologico.puntuacion.toFixed(3)})`);
                    }
                }
            }
            
        } catch (error) {
            console.error('[ERROR] [ESTADO INICIAL] Error:', error.message);
        }
    }
    
    /**
     * [RELOAD] INICIAR MONITOREO CONTINUO
     */
    iniciarMonitoreoContinuo() {
        setInterval(async () => {
            await this.ejecutarCicloMonitoreo();
        }, this.config.intervaloActualizacion);
        
        console.log(`[RELOAD] [MONITOREO] Monitoreo continuo iniciado (${this.config.intervaloActualizacion/1000}s)`);
    }
    
    /**
     * [RELOAD] EJECUTAR CICLO DE MONITOREO
     */
    async ejecutarCicloMonitoreo() {
        try {
            // [DATA] 1. ACTUALIZAR DATOS
            await this.actualizarDatos();
            
            //  2. ANALIZAR ESTADO PSICOLÓGICO GLOBAL
            const estadoPsicologicoGlobal = await this.analizarEstadoPsicologicoGlobal();
            
            // [ENDPOINTS] 3. DETECTAR OPORTUNIDADES
            const oportunidades = await this.detectarOportunidades(estadoPsicologicoGlobal);
            
            // [ALERT] 4. VERIFICAR ALERTAS
            const alertas = this.verificarAlertas(estadoPsicologicoGlobal);
            
            // [DATA] 5. ACTUALIZAR ESTADO GLOBAL
            this.actualizarEstadoGlobal(estadoPsicologicoGlobal, oportunidades, alertas);
            
            // [UP] 6. REGISTRAR MÉTRICAS
            this.registrarMetricas(estadoPsicologicoGlobal, oportunidades, alertas);
            
        } catch (error) {
            console.error('[ERROR] [CICLO MONITOREO] Error:', error.message);
        }
    }
    
    /**
     * [DATA] ACTUALIZAR DATOS
     */
    async actualizarDatos() {
        try {
            const response = await fetch('http://localhost:4602/api/market-data');
            if (response.ok) {
                this.qbtcData = await response.json();
            }
        } catch (error) {
            console.warn('[WARNING] [ACTUALIZAR DATOS] Error:', error.message);
        }
    }
    
    /**
     *  ANALIZAR ESTADO PSICOLÓGICO GLOBAL
     */
    async analizarEstadoPsicologicoGlobal() {
        try {
            console.log(' [ANÁLISIS GLOBAL] Iniciando análisis de estado psicológico global...');
            
            const simbolosAnalizar = this.obtenerSimbolosParaAnalizar();
            console.log(`[DATA] [ANÁLISIS GLOBAL] Símbolos a analizar: ${simbolosAnalizar.length}`);
            
            const estadosPsicologicos = [];
            let simbolosAnalizados = 0;
            
            for (const symbol of simbolosAnalizar) {
                console.log(`[SEARCH] [ANÁLISIS GLOBAL] Analizando ${symbol}...`);
                
                const symbolData = this.obtenerDatosSimbolo(symbol);
                if (symbolData) {
                    console.log(`[OK] [ANÁLISIS GLOBAL] Datos obtenidos para ${symbol}:`, {
                        price: symbolData.price,
                        volume: symbolData.volume,
                        hasFunding: !!symbolData.funding_rate,
                        hasVolatility: !!symbolData.volatility
                    });
                    
                    const estadoPsicologico = await this.nucleoPsicologico.analizarEstadoPsicologico(
                        symbol,
                        symbolData.price || 0,
                        symbolData,
                        this.estadoGlobal.estadoPsicologicoActual?.[symbol]
                    );
                    
                    estadosPsicologicos.push({
                        symbol,
                        estado: estadoPsicologico
                    });
                    
                    simbolosAnalizados++;
                    console.log(`[OK] [ANÁLISIS GLOBAL] ${symbol} analizado exitosamente`);
                } else {
                    console.warn(`[WARNING] [ANÁLISIS GLOBAL] No se pudieron obtener datos para ${symbol}`);
                }
            }
            
            console.log(`[DATA] [ANÁLISIS GLOBAL] Total símbolos analizados: ${simbolosAnalizados}/${simbolosAnalizar.length}`);
            
            //  CALCULAR ESTADO GLOBAL PROMEDIO
            const estadoGlobal = this.calcularEstadoPsicologicoGlobal(estadosPsicologicos);
            
            return {
                estados_individuales: estadosPsicologicos,
                estado_global: estadoGlobal,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('[ERROR] [ESTADO GLOBAL] Error:', error.message);
            return this.crearEstadoGlobalFallback();
        }
    }
    
    /**
     * [ENDPOINTS] DETECTAR OPORTUNIDADES
     */
    async detectarOportunidades(estadoPsicologicoGlobal) {
        try {
            const oportunidades = [];
            const { estados_individuales } = estadoPsicologicoGlobal;
            
            for (const { symbol, estado } of estados_individuales) {
                //  EVALUAR OPORTUNIDAD BASADA EN ESTADO PSICOLÓGICO
                const oportunidad = this.evaluarOportunidadPsicologica(symbol, estado);
                
                if (oportunidad) {
                    oportunidades.push(oportunidad);
                }
            }
            
            // [DATA] ORDENAR POR SCORE Y LIMITAR
            oportunidades.sort((a, b) => b.score - a.score);
            return oportunidades.slice(0, this.config.maxOportunidades);
            
        } catch (error) {
            console.error('[ERROR] [DETECTAR OPORTUNIDADES] Error:', error.message);
            return [];
        }
    }
    
    /**
     * [ALERT] VERIFICAR ALERTAS
     */
    verificarAlertas(estadoPsicologicoGlobal) {
        const alertas = [];
        const { estado_global, estados_individuales } = estadoPsicologicoGlobal;
        
        // [ALERT] ALERTA DE ESTADO PSICOLÓGICO EXTREMO
        if (estado_global.puntuacion > this.config.umbralAlertaPsicologica) {
            alertas.push({
                tipo: 'PSICOLOGICO_EXTREMO',
                severidad: 'ALTA',
                mensaje: `Estado psicológico extremo detectado: ${estado_global.emocion} (${estado_global.puntuacion.toFixed(3)})`,
                timestamp: new Date().toISOString()
            });
        }
        
        // [ALERT] ALERTA DE TRANSICIÓN PSICOLÓGICA RÁPIDA
        for (const { symbol, estado } of estados_individuales) {
            const transicion = estado.transicion_psicologica;
            if (transicion.velocidad > 0.5) {
                alertas.push({
                    tipo: 'TRANSICION_RAPIDA',
                    severidad: 'MEDIA',
                    simbolo: symbol,
                    mensaje: `Transición psicológica rápida en ${symbol}: ${transicion.tipo}`,
                    timestamp: new Date().toISOString()
                });
            }
        }
        
        return alertas;
    }
    
    /**
     * [DATA] ACTUALIZAR ESTADO GLOBAL
     */
    actualizarEstadoGlobal(estadoPsicologicoGlobal, oportunidades, alertas) {
        this.estadoGlobal = {
            ultimaActualizacion: new Date().toISOString(),
            estadoPsicologicoActual: estadoPsicologicoGlobal,
            oportunidadesDetectadas: oportunidades,
            alertasPsicologicas: alertas,
            metricasGlobales: this.calcularMetricasGlobales(estadoPsicologicoGlobal, oportunidades, alertas)
        };
    }
    
    /**
     * [UP] REGISTRAR MÉTRICAS
     */
    registrarMetricas(estadoPsicologicoGlobal, oportunidades, alertas) {
        if (this.config.activarLogs) {
            const { estado_global } = estadoPsicologicoGlobal;
            console.log(`[DATA] [MÉTRICAS] Estado: ${estado_global.emocion} (${estado_global.puntuacion.toFixed(3)}) | Oportunidades: ${oportunidades.length} | Alertas: ${alertas.length}`);
        }
    }
    
    //  MÉTODOS AUXILIARES
    
    obtenerDatosSimbolo(symbol) {
        if (!this.qbtcData) {
            console.warn(`[WARNING] [DATA INGESTION] No hay datos QBTC disponibles para ${symbol}`);
            return null;
        }
        
        // [SEARCH] BUSCAR EN SPOT
        if (this.qbtcData.spot && this.qbtcData.spot[symbol]) {
            console.log(`[OK] [DATA INGESTION] ${symbol} encontrado en SPOT`);
            return this.qbtcData.spot[symbol];
        }
        
        // [SEARCH] BUSCAR EN FUTURES
        if (this.qbtcData.futures && this.qbtcData.futures[symbol]) {
            console.log(`[OK] [DATA INGESTION] ${symbol} encontrado en FUTURES`);
            return this.qbtcData.futures[symbol];
        }
        
        // [SEARCH] BUSCAR VARIACIONES DEL SÍMBOLO
        const variaciones = this.buscarVariacionesSimbolo(symbol);
        if (variaciones.length > 0) {
            console.log(`[OK] [DATA INGESTION] ${symbol} encontrado como variación: ${variaciones[0]}`);
            return this.qbtcData.spot[variaciones[0]] || this.qbtcData.futures[variaciones[0]];
        }
        
        console.warn(`[WARNING] [DATA INGESTION] ${symbol} no encontrado en ningún mercado`);
        return null;
    }
    
    buscarVariacionesSimbolo(symbol) {
        const variaciones = [];
        
        if (!this.qbtcData) return variaciones;
        
        // [SEARCH] BUSCAR EN SPOT
        if (this.qbtcData.spot) {
            const spotSymbols = Object.keys(this.qbtcData.spot);
            const matches = spotSymbols.filter(s => s.includes(symbol.replace('USDT', '')));
            variaciones.push(...matches);
        }
        
        // [SEARCH] BUSCAR EN FUTURES
        if (this.qbtcData.futures) {
            const futuresSymbols = Object.keys(this.qbtcData.futures);
            const matches = futuresSymbols.filter(s => s.includes(symbol.replace('USDT', '')));
            variaciones.push(...matches);
        }
        
        return variaciones;
    }
    
    obtenerSimbolosParaAnalizar() {
        const simbolos = [];
        
        if (this.qbtcData) {
            // [DATA] AGREGAR SÍMBOLOS SPOT
            if (this.qbtcData.spot) {
                const spotSymbols = Object.keys(this.qbtcData.spot);
                console.log(`[DATA] [DATA INGESTION] Símbolos SPOT disponibles: ${spotSymbols.length}`);
                simbolos.push(...spotSymbols.slice(0, 20));
            }
            
            // [DATA] AGREGAR SÍMBOLOS FUTURES
            if (this.qbtcData.futures) {
                const futuresSymbols = Object.keys(this.qbtcData.futures);
                console.log(`[DATA] [DATA INGESTION] Símbolos FUTURES disponibles: ${futuresSymbols.length}`);
                simbolos.push(...futuresSymbols.slice(0, 20));
            }
        }
        
        // [ENDPOINTS] PRIORIZAR SÍMBOLOS PRINCIPALES
        const simbolosPrincipales = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
        
        // [SEARCH] VERIFICAR QUÉ SÍMBOLOS PRINCIPALES ESTÁN DISPONIBLES
        const simbolosDisponibles = simbolosPrincipales.filter(symbol => {
            const disponible = this.verificarDisponibilidadSimbolo(symbol);
            if (disponible) {
                console.log(`[OK] [DATA INGESTION] ${symbol} está disponible`);
            } else {
                console.warn(`[WARNING] [DATA INGESTION] ${symbol} no está disponible`);
            }
            return disponible;
        });
        
        const simbolosUnicos = [...new Set([...simbolosDisponibles, ...simbolos])];
        console.log(`[DATA] [DATA INGESTION] Total símbolos para analizar: ${simbolosUnicos.length}`);
        
        return simbolosUnicos.slice(0, 50);
    }
    
    verificarDisponibilidadSimbolo(symbol) {
        if (!this.qbtcData) return false;
        
        // [SEARCH] VERIFICAR EN SPOT
        if (this.qbtcData.spot && this.qbtcData.spot[symbol]) {
            return true;
        }
        
        // [SEARCH] VERIFICAR EN FUTURES
        if (this.qbtcData.futures && this.qbtcData.futures[symbol]) {
            return true;
        }
        
        // [SEARCH] VERIFICAR VARIACIONES
        const variaciones = this.buscarVariacionesSimbolo(symbol);
        return variaciones.length > 0;
    }
    
    calcularEstadoPsicologicoGlobal(estadosIndividuales) {
        if (estadosIndividuales.length === 0) {
            return this.nucleoPsicologico.estadosPsicologicos.NEUTRAL;
        }
        
        //  CALCULAR PROMEDIOS
        const puntuaciones = estadosIndividuales.map(e => e.estado.estado_psicologico.puntuacion);
        const coherencias = estadosIndividuales.map(e => e.estado.estado_psicologico.coherencia);
        const confianzas = estadosIndividuales.map(e => e.estado.estado_psicologico.confianza);
        const energias = estadosIndividuales.map(e => e.estado.estado_psicologico.energia);
        
        const promedioPuntuacion = puntuaciones.reduce((sum, p) => sum + p, 0) / puntuaciones.length;
        const promedioCoherencia = coherencias.reduce((sum, c) => sum + c, 0) / coherencias.length;
        const promedioConfianza = confianzas.reduce((sum, c) => sum + c, 0) / confianzas.length;
        const promedioEnergia = energias.reduce((sum, e) => sum + e, 0) / energias.length;
        
        // [ENDPOINTS] DETERMINAR EMOCIÓN DOMINANTE
        const emociones = estadosIndividuales.map(e => e.estado.estado_psicologico.emocion);
        const emocionDominante = this.determinarEmocionDominante(emociones);
        
        return {
            puntuacion: promedioPuntuacion,
            coherencia: promedioCoherencia,
            confianza: promedioConfianza,
            energia: promedioEnergia,
            emocion: emocionDominante,
            total_simbolos: estadosIndividuales.length
        };
    }
    
    determinarEmocionDominante(emociones) {
        const conteo = {};
        emociones.forEach(emocion => {
            conteo[emocion] = (conteo[emocion] || 0) + 1;
        });
        
        return Object.keys(conteo).reduce((a, b) => conteo[a] > conteo[b] ? a : b);
    }
    
    evaluarOportunidadPsicologica(symbol, estado) {
        const { estado_psicologico, tasas_cambio, quantum_enhanced } = estado;
        
        // [ENDPOINTS] CRITERIOS DE OPORTUNIDAD
        const criterios = {
            estado_psicologico_favorable: estado_psicologico.puntuacion > 0.7 || estado_psicologico.puntuacion < 0.3,
            tasas_cambio_significativas: tasas_cambio.puntuacion_global > 0.6,
            quantum_enhancement_alto: quantum_enhanced.quantum_enhancement > 0.5,
            transicion_psicologica: estado.transicion_psicologica.tipo !== 'ESTABLE'
        };
        
        //  CALCULAR SCORE DE OPORTUNIDAD
        const score = this.calcularScoreOportunidad(criterios, estado);
        
        if (score > 0.6) {
            return {
                symbol,
                score,
                tipo: this.determinarTipoOportunidad(estado_psicologico.emocion),
                estado_psicologico: estado_psicologico.emocion,
                puntuacion_psicologica: estado_psicologico.puntuacion,
                tasas_cambio: tasas_cambio.puntuacion_global,
                quantum_enhancement: quantum_enhanced.quantum_enhancement,
                timestamp: new Date().toISOString()
            };
        }
        
        return null;
    }
    
    calcularScoreOportunidad(criterios, estado) {
        let score = 0;
        
        if (criterios.estado_psicologico_favorable) score += 0.3;
        if (criterios.tasas_cambio_significativas) score += 0.25;
        if (criterios.quantum_enhancement_alto) score += 0.25;
        if (criterios.transicion_psicologica) score += 0.2;
        
        return Math.min(score, 1);
    }
    
    determinarTipoOportunidad(emocion) {
        switch (emocion) {
            case 'EUFORIA': return 'VENTA_OPORTUNISTA';
            case 'OPTIMISMO': return 'COMPRA_MOMENTUM';
            case 'PESIMISMO': return 'COMPRA_CONTRARIA';
            case 'PANICO': return 'COMPRA_OPORTUNISTA';
            default: return 'NEUTRAL';
        }
    }
    
    calcularMetricasGlobales(estadoPsicologicoGlobal, oportunidades, alertas) {
        return {
            total_simbolos_analizados: estadoPsicologicoGlobal.estados_individuales.length,
            estado_psicologico_promedio: estadoPsicologicoGlobal.estado_global.puntuacion,
            emocion_dominante: estadoPsicologicoGlobal.estado_global.emocion,
            oportunidades_detectadas: oportunidades.length,
            alertas_activas: alertas.length,
            timestamp: new Date().toISOString()
        };
    }
    
    crearEstadoGlobalFallback() {
        return {
            estados_individuales: [],
            estado_global: this.nucleoPsicologico.estadosPsicologicos.NEUTRAL,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * [DATA] OBTENER ESTADO GLOBAL ACTUAL
     */
    obtenerEstadoGlobal() {
        return this.estadoGlobal;
    }
    
    /**
     * [ENDPOINTS] OBTENER OPORTUNIDADES DETECTADAS
     */
    obtenerOportunidades() {
        return this.estadoGlobal.oportunidadesDetectadas;
    }
    
    /**
     * [ALERT] OBTENER ALERTAS ACTIVAS
     */
    obtenerAlertas() {
        return this.estadoGlobal.alertasPsicologicas;
    }
}

module.exports = { IntegracionNucleoPsicologico };

/**
 *  LLM NEURAL ORCHESTRATOR - CEREBRO MAESTRO NEURONAL
 * ====================================================
 * 
 * Sistema que integra todos los sistemas neuronales existentes
 * y usa Google Gemini Flash 1.5 como cerebro maestro para
 * resolver contradicciones y generar decisiones unificadas
 */

const axios = require('axios');

// Configuración de OpenRouter con Google Gemini Flash 1.5
const GEMINI_CONFIG = {
    apiKey: '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',
    model: 'google/gemini-flash-1.5-8b',
    baseUrl: 'https://openrouter.ai/api/v1',
    timeout: 30000
};

class LLMNeuralOrchestrator {
    constructor() {
        // Sistemas neuronales existentes (sin modificar)
        this.neuralSystems = {
            session: null,      // CryptoSessionNeuralNetwork
            halving: null,      // HalvingNeuralPredictor
            easterEgg: null,    // CryptoEasterEggDetector
            lunar: null,        // LunarSeasonalNeuralNetwork
            leonardo: null,     // LeonardoProjectionNeuron
            fibonacci: null,    // FibonacciWaveNeuron
            prime: null,        // PrimeCycleProjectionNeuron
            quantum: null,      // QuantumInterferenceNeuron
            psychological: null // NucleoPsicologicoTasasCambio
        };
        
        // LLM como cerebro maestro
        this.geminiBrain = new GeminiBrainMaster();
        
        // Cache para optimizar llamadas
        this.decisionCache = new Map();
        this.cacheTimeout = 30000; // 30 segundos
        
        // Estado del sistema
        this.systemState = {
            lastUpdate: null,
            totalDecisions: 0,
            llmCalls: 0,
            cacheHits: 0,
            errors: 0
        };
        
        console.log(' [LLM NEURAL ORCHESTRATOR] Inicializado con Google Gemini Flash 1.5');
    }
    
    /**
     * [START] INICIALIZAR SISTEMAS NEURONALES
     */
    async initializeNeuralSystems() {
        console.log(' [LLM ORCHESTRATOR] Inicializando sistemas neuronales...');
        
        try {
            // Cargar el motor neural temporal que contiene todos los sistemas
            const neuralTemporalEngine = require('./neural-temporal-engine');
            
            // Cargar sistemas neuronales desde el motor temporal
            this.neuralSystems.session = neuralTemporalEngine.CryptoSessionNeuralNetwork;
            this.neuralSystems.halving = neuralTemporalEngine.HalvingNeuralPredictor;
            this.neuralSystems.easterEgg = neuralTemporalEngine.CryptoEasterEggDetector;
            this.neuralSystems.lunar = neuralTemporalEngine.LunarSeasonalNeuralNetwork;
            
            // Cargar sistemas adicionales
            const nucleoPsicologico = await this.loadNeuralSystem('nucleo-psicologico-tasas-cambio');
            this.neuralSystems.psychological = nucleoPsicologico.analizarEstadoPsicologico;
            
            // Crear instancias de los sistemas neuronales
            this.neuralSystems.session = new this.neuralSystems.session();
            this.neuralSystems.halving = new this.neuralSystems.halving();
            this.neuralSystems.easterEgg = new this.neuralSystems.easterEgg();
            this.neuralSystems.lunar = new this.neuralSystems.lunar();
            
            console.log('[OK] [LLM ORCHESTRATOR] Sistemas neuronales inicializados desde neural-temporal-engine.js');
            
        } catch (error) {
            console.warn('[WARNING] [LLM ORCHESTRATOR] Error cargando sistemas neuronales:', error.message);
            // Continuar con sistemas disponibles
        }
    }
    
    /**
     *  CARGAR SISTEMA NEURONAL DINÁMICAMENTE
     */
    async loadNeuralSystem(systemName) {
        try {
            const system = require(`./${systemName}`);
            return system;
        } catch (error) {
            console.warn(`[WARNING] Sistema neural ${systemName} no disponible`);
            return this.createFallbackSystem(systemName);
        }
    }
    
    /**
     * [RELOAD] CREAR SISTEMA FALLBACK
     */
    createFallbackSystem(systemName) {
        return {
            name: systemName,
            isFallback: true,
            getCurrentState: () => ({
                status: 'FALLBACK',
                confidence: 0.5,
                data: {}
            })
        };
    }
    
    /**
     * [ENDPOINTS] GENERAR DECISIÓN UNIFICADA CON LLM
     */
    async generateUnifiedDecision(symbol = 'BTCUSDT') {
        console.log(` [LLM ORCHESTRATOR] Generando decisión unificada para ${symbol}...`);
        
        try {
            // 1. Verificar cache
            const cacheKey = `${symbol}_${Date.now() - (Date.now() % 30000)}`; // 30s cache
            if (this.decisionCache.has(cacheKey)) {
                this.systemState.cacheHits++;
                console.log('[OK] [LLM ORCHESTRATOR] Usando decisión cacheada');
                return this.decisionCache.get(cacheKey);
            }
            
            // 2. Recolectar todas las señales neuronales
            const neuralSignals = await this.gatherAllNeuralSignals(symbol);
            
            // 3. Formatear para Gemini
            const geminiPrompt = this.formatNeuralSignalsForGemini(neuralSignals, symbol);
            
            // 4. Consultar Gemini para decisión unificada
            const geminiDecision = await this.geminiBrain.analyzeAndDecide(geminiPrompt);
            
            // 5. Validar y formatear respuesta
            const unifiedDecision = this.validateAndFormatGeminiResponse(geminiDecision, neuralSignals);
            
            // 6. Actualizar estadísticas
            this.systemState.totalDecisions++;
            this.systemState.llmCalls++;
            this.systemState.lastUpdate = new Date();
            
            // 7. Cachear resultado
            this.decisionCache.set(cacheKey, unifiedDecision);
            
            console.log(`[OK] [LLM ORCHESTRATOR] Decisión unificada generada: ${unifiedDecision.final_decision}`);
            
            return unifiedDecision;
            
        } catch (error) {
            console.error('[ERROR] [LLM ORCHESTRATOR] Error generando decisión:', error.message);
            this.systemState.errors++;
            
            // Fallback a decisión básica
            return this.generateFallbackDecision(symbol);
        }
    }
    
    /**
     * [DATA] RECOLECTAR TODAS LAS SEÑALES NEURONALES
     */
    async gatherAllNeuralSignals(symbol) {
        const signals = {
            symbol: symbol,
            timestamp: new Date().toISOString(),
            session: null,
            halving: null,
            easterEgg: null,
            lunar: null,
            leonardo: null,
            fibonacci: null,
            prime: null,
            quantum: null,
            psychological: null
        };
        
        // Recolectar señales de sistemas disponibles
        const promises = [];
        
        if (this.neuralSystems.session) {
            try {
                signals.session = this.neuralSystems.session.getCurrentSessionNeuralState();
            } catch (err) {
                console.warn('Error session neural:', err.message);
            }
        }
        
        if (this.neuralSystems.halving) {
            try {
                signals.halving = this.neuralSystems.halving.getCurrentHalvingState();
            } catch (err) {
                console.warn('Error halving neural:', err.message);
            }
        }
        
        if (this.neuralSystems.easterEgg) {
            try {
                signals.easterEgg = this.neuralSystems.easterEgg.scanForEasterEggs(symbol);
            } catch (err) {
                console.warn('Error easter egg:', err.message);
            }
        }
        
        if (this.neuralSystems.lunar) {
            try {
                signals.lunar = this.neuralSystems.lunar.getCurrentLunarSeasonalState();
            } catch (err) {
                console.warn('Error lunar neural:', err.message);
            }
        }
        
        if (this.neuralSystems.leonardo) {
            promises.push(
                this.neuralSystems.leonardo.generateProjection(symbol)
                    .then(result => signals.leonardo = result)
                    .catch(err => console.warn('Error leonardo neural:', err.message))
            );
        }
        
        if (this.neuralSystems.fibonacci) {
            promises.push(
                this.neuralSystems.fibonacci.analyzeWaves(symbol)
                    .then(result => signals.fibonacci = result)
                    .catch(err => console.warn('Error fibonacci neural:', err.message))
            );
        }
        
        if (this.neuralSystems.prime) {
            promises.push(
                this.neuralSystems.prime.analyzePrimeCycles(symbol)
                    .then(result => signals.prime = result)
                    .catch(err => console.warn('Error prime neural:', err.message))
            );
        }
        
        if (this.neuralSystems.quantum) {
            promises.push(
                this.neuralSystems.quantum.analyzeQuantumInterference(symbol)
                    .then(result => signals.quantum = result)
                    .catch(err => console.warn('Error quantum neural:', err.message))
            );
        }
        
        if (this.neuralSystems.psychological) {
            try {
                signals.psychological = await this.neuralSystems.psychological(symbol, 45000, {});
            } catch (err) {
                console.warn('Error psychological:', err.message);
            }
        }
        
        return signals;
    }
    
    /**
     *  FORMATEAR SEÑALES PARA GEMINI
     */
    formatNeuralSignalsForGemini(signals, symbol) {
        const sessionInfo = signals.session ? `
        SESIÓN NEURAL:
        - Estado: ${signals.session.primary_session || 'N/A'}
        - Intensidad: ${signals.session.session_intensity || 0}%
        - Overlaps: ${signals.session.overlaps?.length || 0}
        - Estrategias: ${signals.session.optimal_strategies?.join(', ') || 'N/A'}
        ` : 'SESIÓN NEURAL: No disponible';
        
        const psychologicalInfo = signals.psychological ? `
        ESTADO PSICOLÓGICO:
        - Estado: ${signals.psychological.estado || 'N/A'}
        - Confianza: ${signals.psychological.confianza || 0}%
        - Recomendación: ${signals.psychological.accion_recomendada || 'N/A'}
        - Señales: ${signals.psychological.senales_medibles ? Object.keys(signals.psychological.senales_medibles).join(', ') : 'N/A'}
        ` : 'ESTADO PSICOLÓGICO: No disponible';
        
        const quantumInfo = signals.quantum ? `
        MÉTRICAS CUÁNTICAS:
        - Coherencia: ${signals.quantum.coherence || 0}%
        - Consciencia: ${signals.quantum.consciousness || 0}%
        - Entrelazamiento: ${signals.quantum.entanglement || 0}%
        - Superposición: ${signals.quantum.superposition || 0}%
        - Tunelamiento: ${signals.quantum.tunneling || 0}%
        ` : 'MÉTRICAS CUÁNTICAS: No disponible';
        
        const halvingInfo = signals.halving ? `
        CICLO HALVING:
        - Fase: ${signals.halving.current_phase || 'N/A'}
        - Días restantes: ${signals.halving.days_to_next_halving || 'N/A'}
        - Influencia: ${signals.halving.halving_influence || 0}%
        ` : 'CICLO HALVING: No disponible';
        
        const lunarInfo = signals.lunar ? `
        PATRONES LUNARES:
        - Fase lunar: ${signals.lunar.lunar?.phase || 'N/A'}
        - Influencia: ${signals.lunar.lunar?.influence?.volatility_factor || 0}%
        - Multiplicador volumen: ${signals.lunar.lunar?.influence?.volume_multiplier || 1}x
        ` : 'PATRONES LUNARES: No disponible';
        
        return `
        ANÁLISIS NEURONAL UNIFICADO - ${symbol}
        ======================================
        
        SEÑALES NEURONALES DETECTADAS:
        
        ${sessionInfo}
        
        ${psychologicalInfo}
        
        ${quantumInfo}
        
        ${halvingInfo}
        
        ${lunarInfo}
        
        EASTER EGGS DETECTADOS:
        ${signals.easterEgg ? `- ${signals.easterEgg.easter_eggs?.length || 0} anomalías detectadas` : '- No disponible'}
        
        PROYECCIÓN LEONARDO:
        ${signals.leonardo ? `- Target: ${signals.leonardo.target_price || 'N/A'}, Confianza: ${signals.leonardo.confidence || 0}%` : '- No disponible'}
        
        ONDAS FIBONACCI:
        ${signals.fibonacci ? `- Onda actual: ${signals.fibonacci.current_wave || 'N/A'}, Ratio: ${signals.fibonacci.wave_ratio || 'N/A'}` : '- No disponible'}
        
        CICLOS PRIMOS:
        ${signals.prime ? `- Primo actual: ${signals.prime.current_prime || 'N/A'}, Posición: ${signals.prime.cycle_position || 'N/A'}` : '- No disponible'}
        
        INTERFERENCIA CUÁNTICA:
        ${signals.quantum ? `- Estado: ${signals.quantum.interference_state || 'N/A'}, Fuerza: ${signals.quantum.interference_strength || 0}%` : '- No disponible'}
        
        TAREA: Analiza todas las señales neuronales y genera una recomendación unificada y coherente.
        Considera el contexto del mercado, la confianza de cada señal, y resuelve las contradicciones.
        
        FORMATO DE RESPUESTA (JSON):
        {
          "decision": "STRONG_BUY|BUY|HOLD|SELL|STRONG_SELL",
          "confidence": 0-100,
          "reasoning": "Explicación detallada de la decisión",
          "risk_level": "LOW|MEDIUM|HIGH",
          "timeframe": "SHORT|MEDIUM|LONG",
          "key_factors": ["factor1", "factor2", "factor3"],
          "contradictions_resolved": "Explicación de cómo se resolvieron las contradicciones"
        }
        `;
    }
    
    /**
     * [OK] VALIDAR Y FORMATEAR RESPUESTA DE GEMINI
     */
    validateAndFormatGeminiResponse(geminiResponse, neuralSignals) {
        try {
            // Limpiar respuesta de markdown si existe
            let cleanResponse = geminiResponse;
            if (typeof geminiResponse === 'string') {
                // Remover ```json y ``` si existen
                cleanResponse = geminiResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            }
            
            // Intentar parsear JSON
            let decision;
            if (typeof cleanResponse === 'string') {
                decision = JSON.parse(cleanResponse);
            } else {
                decision = cleanResponse;
            }
            
            // Validar campos requeridos
            const validDecisions = ['STRONG_BUY', 'BUY', 'HOLD', 'SELL', 'STRONG_SELL'];
            const validRiskLevels = ['LOW', 'MEDIUM', 'HIGH'];
            const validTimeframes = ['SHORT', 'MEDIUM', 'LONG'];
            
            if (!validDecisions.includes(decision.decision)) {
                decision.decision = 'HOLD';
            }
            
            if (!validRiskLevels.includes(decision.risk_level)) {
                decision.risk_level = 'MEDIUM';
            }
            
            if (!validTimeframes.includes(decision.timeframe)) {
                decision.timeframe = 'MEDIUM';
            }
            
            if (typeof decision.confidence !== 'number' || decision.confidence < 0 || decision.confidence > 100) {
                decision.confidence = 50;
            }
            
            // Formatear respuesta final
            return {
                symbol: neuralSignals.symbol,
                timestamp: new Date().toISOString(),
                final_decision: decision.decision,
                confidence: decision.confidence,
                reasoning: decision.reasoning || 'Análisis neural unificado',
                risk_level: decision.risk_level,
                timeframe: decision.timeframe,
                key_factors: decision.key_factors || [],
                contradictions_resolved: decision.contradictions_resolved || 'No se detectaron contradicciones',
                neural_signals: neuralSignals,
                llm_validated: true,
                system_stats: {
                    total_decisions: this.systemState.totalDecisions,
                    llm_calls: this.systemState.llmCalls,
                    cache_hits: this.systemState.cacheHits,
                    errors: this.systemState.errors
                }
            };
            
        } catch (error) {
            console.error('[ERROR] [LLM ORCHESTRATOR] Error validando respuesta Gemini:', error.message);
            return this.generateFallbackDecision(neuralSignals.symbol);
        }
    }
    
    /**
     * [RELOAD] GENERAR DECISIÓN FALLBACK
     */
    generateFallbackDecision(symbol) {
        return {
            symbol: symbol,
            timestamp: new Date().toISOString(),
            final_decision: 'HOLD',
            confidence: 50,
            reasoning: 'Sistema en modo fallback - análisis básico',
            risk_level: 'MEDIUM',
            timeframe: 'MEDIUM',
            key_factors: ['Sistema neural básico'],
            contradictions_resolved: 'N/A - modo fallback',
            neural_signals: {},
            llm_validated: false,
            system_stats: this.systemState
        };
    }
    
    /**
     * [DATA] OBTENER ESTADÍSTICAS DEL SISTEMA
     */
    getSystemStats() {
        return {
            ...this.systemState,
            cache_size: this.decisionCache.size,
            uptime: this.systemState.lastUpdate ? 
                Date.now() - this.systemState.lastUpdate.getTime() : 0
        };
    }
    
    /**
     *  LIMPIAR CACHE
     */
    clearCache() {
        this.decisionCache.clear();
        console.log(' [LLM ORCHESTRATOR] Cache limpiado');
    }
}

/**
 *  CEREBRO MAESTRO GEMINI
 */
class GeminiBrainMaster {
    constructor() {
        this.config = GEMINI_CONFIG;
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }
    
    /**
     * [ENDPOINTS] ANALIZAR Y DECIDIR CON GEMINI
     */
    async analyzeAndDecide(prompt) {
        console.log(' [GEMINI BRAIN] Analizando con Gemini Flash 1.5...');
        
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await this.callGeminiAPI(prompt);
                console.log('[OK] [GEMINI BRAIN] Análisis completado');
                return response;
                
            } catch (error) {
                console.warn(`[WARNING] [GEMINI BRAIN] Intento ${attempt} falló:`, error.message);
                
                if (attempt === this.retryAttempts) {
                    throw new Error(`Gemini API falló después de ${this.retryAttempts} intentos`);
                }
                
                // Esperar antes del siguiente intento
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
            }
        }
    }
    
    /**
     *  LLAMAR API DE OPENROUTER (GEMINI FLASH 1.5)
     */
    async callGeminiAPI(prompt) {
        const requestBody = {
            model: this.config.model,
            messages: [
                {
                    role: 'system',
                    content: 'Eres un experto analista de mercados financieros especializado en criptomonedas. Tu tarea es analizar señales neuronales complejas y generar recomendaciones de trading coherentes y bien fundamentadas. IMPORTANTE: Responde ÚNICAMENTE con JSON válido, sin markdown, sin ```json, sin explicaciones adicionales. Solo el objeto JSON.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 1000,
            top_p: 0.9
        };
        
        const response = await axios.post(
            `${this.config.baseUrl}/chat/completions`,
            requestBody,
            {
                headers: {
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://qbtc-banda46.com',
                    'X-Title': 'QBTC Neural Orchestrator'
                },
                timeout: this.config.timeout
            }
        );
        
        if (response.data && response.data.choices && response.data.choices[0]) {
            return response.data.choices[0].message.content;
        } else {
            throw new Error('Respuesta inválida de OpenRouter API');
        }
    }
}

module.exports = {
    LLMNeuralOrchestrator,
    GeminiBrainMaster
};

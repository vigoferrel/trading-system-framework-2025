
// Constantes físicas reales del sistema
const PHYSICAL_CONSTANTS = {
  "QUANTUM_COHERENCE": 0.75,
  "QUANTUM_CONSCIOUSNESS": 0.8,
  "QUANTUM_ENTANGLEMENT": 0.65,
  "QUANTUM_SUPERPOSITION": 0.7,
  "QUANTUM_TUNNELING": 0.6,
  "MARKET_VOLATILITY": 0.05,
  "MARKET_MOMENTUM": 0.1,
  "MARKET_LIQUIDITY": 0.75,
  "MARKET_SPREAD": 0.001,
  "MARKET_DEPTH": 500000,
  "FUNDING_RATE": 0.02,
  "FUNDING_VOLATILITY": 0.01,
  "FUNDING_DEVIATION": 0.5,
  "FUNDING_ANNUALIZED": 5,
  "LIQUIDATION_PROBABILITY": 0.05,
  "SLIPPAGE_RATE": 0.0025,
  "VOLATILITY_RISK": 0.1,
  "EXECUTION_RISK": 0.005,
  "VOLUME_24H": 500000,
  "VOLUME_RATIO": 0.75,
  "VOLUME_EXPANSION": 300000,
  "PRICE_CHANGE": 0.02,
  "PRICE_ACCELERATION": 0.015,
  "PRICE_MOMENTUM": 0.01,
  "TIME_TO_FUNDING": 1800000,
  "SESSION_INTENSITY": 0.6,
  "TEMPORAL_RESONANCE": 0.7,
  "FIBONACCI_STRENGTH": 0.75,
  "FIBONACCI_INDEX": 5,
  "NEURAL_CONFIDENCE": 0.85,
  "NEURAL_COHERENCE": 0.8,
  "NEURAL_ENTANGLEMENT": 0.7,
  "BASE_LEVERAGE": 15,
  "CONSERVATIVE_LEVERAGE": 10,
  "AGGRESSIVE_LEVERAGE": 25,
  "STOP_LOSS": 0.03,
  "TAKE_PROFIT": 0.06,
  "BASE_SCORE": 0.65,
  "CONFIDENCE_SCORE": 0.75,
  "QUALITY_SCORE": 0.8
};

/**
 * LEONARDO LEVERAGE MATRIX
 * =======================
 * 
 * Sistema avanzado de gestión de apalancamiento adaptativo
 * Basado en la filosofía Leonardo Quantum Liberation
 * Optimiza el tamaño de posición según volatilidad y edge
 * 
 * "El conocimiento del apalancamiento es poder" - Leonardo da Vinci
 */

class LeonardoLeverageMatrix {
    constructor(config = {}) {
        // Configuración
        this.config = {
            baseMultiplier: 5,            // Multiplicador base para el apalancamiento
            maxLeverage: 25,              // Apalancamiento máximo permitido
            minLeverage: 1,               // Apalancamiento mínimo permitido
            volatilityWeight: 0.4,        // Peso de la volatilidad en el cálculo
            edgeWeight: 0.3,              // Peso del edge en el cálculo
            liquidityWeight: 0.2,         // Peso de la liquidez en el cálculo
            momentumWeight: 0.1,          // Peso del momentum en el cálculo
            safetyFactor: 0.85,           // Factor de seguridad general
            riskToleranceLevel: 'balanced',// Nivel de tolerancia al riesgo (conservative, balanced, aggressive)
            enableFractionalLeverage: true,// Permitir apalancamiento fraccional
            // Guardarraíles adicionales
            maxLeverageUnderHighVol: 10,  // Límite cuando vol > 8%
            minLiquidity: 0.2,            // Mínimo de liquidez considerada válida
            maxMomentumImpact: 0.25,      // Tope de impacto del momentum
            ...config
        };
        
        // Factores de riesgo por perfil
        this.riskProfiles = {
            conservative: {
                multiplier: 0.6,
                safetyFactor: 0.95,
                volatilityPenalty: 0.8,
                edgeThreshold: 0.7
            },
            balanced: {
                multiplier: 1.0,
                safetyFactor: 0.85,
                volatilityPenalty: 0.5,
                edgeThreshold: 0.5
            },
            aggressive: {
                multiplier: 1.5,
                safetyFactor: 0.75,
                volatilityPenalty: 0.3,
                edgeThreshold: 0.3
            }
        };
        
        // Matriz de apalancamiento por volatilidad y edge
        this.leverageMatrix = this._initializeLeverageMatrix();
        
        // Caché de cálculos
        this.leverageCache = new Map();
        
        // Constantes primas (z, , 888 MHz) para modulación fina
        this.PRIME = {
            Z_REAL: 9,
            Z_IMAG: 16,
            LAMBDA: Math.log(7919),
            RESONANCE_MHZ: 888,
            get zMagnitude() { return Math.hypot(this.Z_REAL, this.Z_IMAG); }
        };
        
        console.log(' Leonardo Leverage Matrix inicializada');
        console.log(`[DATA] Perfil de riesgo: ${this.config.riskToleranceLevel}`);
    }
    
    /**
     * Inicializa la matriz de apalancamiento base
     * @private
     */
    _initializeLeverageMatrix() {
        // Matriz 10x10 de apalancamiento por volatilidad (filas) y edge (columnas)
        // Volatilidad: 0% a 10%+ (filas de arriba a abajo)
        // Edge: 0 a 1.0 (columnas de izquierda a derecha)
        return [
            [25, 25, 25, 25, 25, 25, 25, 25, 25, 25], // Vol < 1%
            [20, 21, 22, 23, 24, 25, 25, 25, 25, 25], // Vol 1-2%
            [15, 16, 18, 20, 21, 22, 23, 24, 25, 25], // Vol 2-3%
            [10, 12, 14, 16, 18, 19, 20, 21, 22, 23], // Vol 3-4%
            [7,  9,  11, 13, 15, 16, 17, 18, 19, 20], // Vol 4-5%
            [5,  6,  8,  10, 12, 13, 14, 15, 16, 17], // Vol 5-6%
            [3,  4,  6,  8,  9,  10, 11, 12, 13, 14], // Vol 6-7%
            [2,  3,  4,  5,  7,  8,  9,  10, 11, 12], // Vol 7-8%
            [1,  2,  3,  4,  5,  6,  7,  8,  9,  10], // Vol 8-9%
            [1,  1,  2,  3,  4,  5,  6,  7,  8,  9]   // Vol 9%+
        ];
    }
    
    /**
     * Establece el perfil de riesgo
     * @param {string} profile - Perfil de riesgo (conservative, balanced, aggressive)
     */
    setRiskProfile(profile) {
        if (!this.riskProfiles[profile]) {
            console.error(`[ERROR] Perfil de riesgo no válido: ${profile}`);
            return false;
        }
        
        this.config.riskToleranceLevel = profile;
        console.log(`[DATA] Perfil de riesgo actualizado: ${profile}`);
        
        // Limpiar caché al cambiar el perfil
        this.leverageCache.clear();
        
        return true;
    }
    
    /**
     * Calcula el apalancamiento óptimo basado en múltiples factores
     * @param {Object} params - Parámetros para el cálculo
     * @returns {number} - Apalancamiento óptimo
     */
    calculateOptimalLeverage(params) {
        const {
            symbol,
            volatility = 0.03,      // Volatilidad diaria (3% por defecto)
            edge = 0.5,             // Edge o ventaja (0.5 por defecto)
            liquidity = 0.7,        // Liquidez del mercado (0.7 por defecto)
            momentum = 0,           // Momentum (-1 a 1, 0 por defecto)
            marketCap = 'large',    // Capitalización (small, medium, large)
            timeHorizon = 'medium', // Horizonte temporal (short, medium, long)
            strategy = 'momentum'   // Estrategia (momentum, mean_reversion, trend)
        } = params;
        
        // Normalizaciones y guardarraíles de entrada
        const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
        const vol = clamp(Number(volatility) || 0, 0, 0.20); // 0%..20%
        const edg = clamp(Number(edge) || 0, 0, 1);
        const liq = clamp(Number(liquidity) || 0, this.config.minLiquidity, 1);
        const mom = clamp(Number(momentum) || 0, -1, 1);
        
        // Verificar caché
        const cacheKey = `${symbol}_${vol}_${edg}_${liq}_${mom}_${this.config.riskToleranceLevel}`;
        if (this.leverageCache.has(cacheKey)) {
            return this.leverageCache.get(cacheKey);
        }
        
        // Obtener el perfil de riesgo actual
        const riskProfile = this.riskProfiles[this.config.riskToleranceLevel];
        
        // Índices continuos para interpolación bilineal en la matriz 10x10
        const volIdx = clamp(vol * 100, 0, 9.9999);   // 0..9.999 -> filas
        const edgeIdx = clamp(edg * 10, 0, 9.9999);   // 0..9.999 -> cols
        const v0 = Math.floor(volIdx), v1 = Math.min(9, v0 + 1);
        const e0 = Math.floor(edgeIdx), e1 = Math.min(9, e0 + 1);
        const tv = volIdx - v0; // fracción vertical
        const te = edgeIdx - e0; // fracción horizontal
        const L00 = this.leverageMatrix[v0][e0];
        const L10 = this.leverageMatrix[v1][e0];
        const L01 = this.leverageMatrix[v0][e1];
        const L11 = this.leverageMatrix[v1][e1];
        // Bilinear interpolation
        const L0 = L00 * (1 - te) + L01 * te;
        const L1 = L10 * (1 - te) + L11 * te;
        let baseLeverage = L0 * (1 - tv) + L1 * tv;
        
        // Modulación por perfil de riesgo
        baseLeverage *= riskProfile.multiplier;
        
        // Ajustar por liquidez (0.5..1.0) y momentum (1 +/- maxMomentumImpact)
        const liquidityFactor = 0.5 + (liq * 0.5);
        const momentumImpact = this.config.maxMomentumImpact * mom; // [-maxImpact, +maxImpact]
        const momentumFactor = 1 + momentumImpact;
        
        // Ajustar por capitalización de mercado
        const marketCapFactor = marketCap === 'large' ? 1.0 : 
                               marketCap === 'medium' ? 0.85 : 0.7;
        
        // Ajustar por horizonte temporal
        const timeHorizonFactor = timeHorizon === 'long' ? 0.8 : 
                                 timeHorizon === 'medium' ? 1.0 : 1.2;
        
        // Ajustar por estrategia
        const strategyFactor = strategy === 'trend' ? 1.1 : 
                              strategy === 'momentum' ? 1.0 : 0.9;
        
        // Modulación prima (z, , 888MHz) ligeramente acotada (±10%)
        const primeMod = 1 
            + 0.05 * Math.sin(this.PRIME.LAMBDA * edg) 
            + 0.05 * Math.cos((this.PRIME.RESONANCE_MHZ / 1000) * (vol * 100));
        const primeFactor = clamp(primeMod, 0.9, 1.1);
        
        // Calcular apalancamiento final con todos los factores
        let finalLeverage = baseLeverage * 
            liquidityFactor * 
            momentumFactor * 
            marketCapFactor * 
            timeHorizonFactor * 
            strategyFactor * 
            riskProfile.safetyFactor * 
            primeFactor;
        
        // Guardarraíl para alta volatilidad (>8%)
        if (vol > 0.08) {
            finalLeverage = Math.min(finalLeverage, this.config.maxLeverageUnderHighVol);
        }
        
        // Aplicar límites globales
        finalLeverage = Math.max(this.config.minLeverage, 
                        Math.min(this.config.maxLeverage, finalLeverage));
        
        // Redondear o mantener fraccional según configuración
        if (!this.config.enableFractionalLeverage) {
            finalLeverage = Math.floor(finalLeverage);
        } else {
            // Redondear a 1 decimal
            finalLeverage = Math.round(finalLeverage * 10) / 10;
        }
        
        // Guardar en caché
        this.leverageCache.set(cacheKey, finalLeverage);
        
        return finalLeverage;
    }
    
    /**
     * Calcula el tamaño de posición óptimo basado en Kelly Criterion modificado
     * @param {Object} params - Parámetros para el cálculo
     * @returns {Object} - Resultado del cálculo
     */
    calculateOptimalPositionSize(params) {
        const {
            accountBalance,         // Balance total de la cuenta
            riskPerTradePercent,    // Porcentaje de riesgo por operación
            winRate,                // Tasa de acierto (0.0-1.0)
            rewardRatio,            // Ratio de recompensa/riesgo
            edge = 0.5,             // Edge o ventaja (0-1)
            volatility = 0.03,      // Volatilidad diaria
            maxFraction = 0.25      // Fracción máxima del capital
        } = params;
        
        // Verificar parámetros requeridos
        if (!accountBalance || !riskPerTradePercent || !winRate || !rewardRatio) {
            throw new Error('Parámetros insuficientes para calcular tamaño de posición');
        }
        
        // Obtener perfil de riesgo actual
        const riskProfile = this.riskProfiles[this.config.riskToleranceLevel];
        
        // Calcular Kelly Fraction
        const kellyFraction = winRate - ((1 - winRate) / rewardRatio);
        
        // Aplicar factor de seguridad según perfil de riesgo
        const adjustedKelly = kellyFraction * riskProfile.safetyFactor;
        
        // Limitar a la fracción máxima
        const finalKellyFraction = Math.max(0, Math.min(maxFraction, adjustedKelly));
        
        // Calcular tamaño de posición base
        const basePositionSize = accountBalance * finalKellyFraction;
        
        // Calcular riesgo por operación
        const riskAmount = accountBalance * (riskPerTradePercent / 100);
        
        // Calcular apalancamiento óptimo
        const optimalLeverage = this.calculateOptimalLeverage({
            volatility,
            edge,
            liquidity: 0.7, // Valor por defecto
            momentum: 0     // Valor por defecto
        });
        
        // Calcular tamaño final con apalancamiento
        const leveragedPositionSize = basePositionSize * optimalLeverage;
        
        // Calcular tamaño conservador basado en riesgo
        const riskBasedSize = riskAmount * optimalLeverage;
        
        // Tomar el menor de los dos tamaños (Kelly vs. Riesgo fijo)
        const finalPositionSize = Math.min(leveragedPositionSize, riskBasedSize);
        
        return {
            positionSize: finalPositionSize,
            leverage: optimalLeverage,
            kellyFraction: finalKellyFraction,
            riskAmount,
            riskPercent: riskPerTradePercent
        };
    }
    
    /**
     * Recomienda Stop-Loss y Take-Profit basados en volatilidad y apalancamiento
     * @param {Object} params { volatility, leverage }
     * @returns {Object} { stopLossPct, takeProfitPct }
     */
    recommendStopsAndTargets(params) {
        const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
        const vol = clamp(Number(params?.volatility) || 0.03, 0.005, 0.20); // 0.5%..20%
        const lev = clamp(Number(params?.leverage) || 5, this.config.minLeverage, this.config.maxLeverage);
        
        // Base stops derivados de la volatilidad diaria
        const baseStop = vol * 0.75; // 75% de la vol
        const baseTake = vol * 1.5;  // 150% de la vol
        
        // Modulación por apalancamiento (más leverage => stops más ajustados)
        const levFactor = 1 / Math.sqrt(lev); // decrece con lev
        
        // Prime shaping ( y 888MHz)
        const primeShape = 1 + 0.1 * Math.sin(this.PRIME.LAMBDA * vol) - 0.05 * Math.cos((this.PRIME.RESONANCE_MHZ/1000) * lev);
        
        const stopLossPct = clamp(baseStop * levFactor * primeShape, 0.003, 0.08); // 0.3%..8%
        const takeProfitPct = clamp(baseTake * Math.sqrt(levFactor) * primeShape, 0.005, 0.20); // 0.5%..20%
        
        return { stopLossPct, takeProfitPct };
    }
    
    /**
     * Calcula la distribución óptima de capital entre múltiples oportunidades
     * @param {Array} opportunities - Lista de oportunidades
     * @param {number} totalCapital - Capital total disponible
     * @returns {Array} - Lista de oportunidades con asignación de capital
     */
    calculateOptimalCapitalAllocation(opportunities, totalCapital) {
        if (!opportunities || opportunities.length === 0 || !totalCapital) {
            return [];
        }
        
        // Calcular score para cada oportunidad
        const scoredOpportunities = opportunities.map(opp => {
            const {
                symbol,
                edge = 0.5,
                volatility = 0.03,
                winRate = 0.5,
                rewardRatio = 2.0
            } = opp;
            
            // Calcular Kelly para esta oportunidad
            const kellyFraction = winRate - ((1 - winRate) / rewardRatio);
            
            // Calcular score combinando Kelly y edge
            const score = kellyFraction * edge * (1 / Math.sqrt(volatility));
            
            return {
                ...opp,
                score,
                kellyFraction
            };
        });
        
        // Ordenar por score descendente
        scoredOpportunities.sort((a, b) => b.score - a.score);
        
        // Calcular suma total de scores
        const totalScore = scoredOpportunities.reduce((sum, opp) => sum + Math.max(0, opp.score), 0);
        
        // Asignar capital proporcional al score
        return scoredOpportunities.map(opp => {
            // Si el score es negativo, no asignar capital
            if (opp.score <= 0) {
                return {
                    ...opp,
                    allocatedCapital: 0,
                    leverage: 1,
                    positionSize: 0
                };
            }
            
            // Calcular proporción del capital
            const proportion = opp.score / totalScore;
            const allocatedCapital = totalCapital * proportion;
            
            // Calcular apalancamiento óptimo
            const leverage = this.calculateOptimalLeverage({
                symbol: opp.symbol,
                volatility: opp.volatility,
                edge: opp.edge,
                liquidity: opp.liquidity || 0.7,
                momentum: opp.momentum || 0
            });
            
            // Calcular tamaño de posición
            const positionSize = allocatedCapital * leverage;
            
            return {
                ...opp,
                allocatedCapital,
                leverage,
                positionSize
            };
        });
    }
    
    /**
     * Actualiza la matriz de apalancamiento base
     * @param {Array} newMatrix - Nueva matriz de apalancamiento
     */
    updateLeverageMatrix(newMatrix) {
        if (!Array.isArray(newMatrix) || newMatrix.length !== 10 || 
            !newMatrix.every(row => Array.isArray(row) && row.length === 10)) {
            console.error('[ERROR] Formato de matriz inválido. Debe ser 10x10.');
            return false;
        }
        
        this.leverageMatrix = newMatrix;
        this.leverageCache.clear();
        
        console.log('[OK] Matriz de apalancamiento actualizada');
        return true;
    }
    
    /**
     * Obtiene la configuración actual
     */
    getConfig() {
        return {
            ...this.config,
            riskProfile: this.riskProfiles[this.config.riskToleranceLevel]
        };
    }
    
    /**
     * Actualiza la configuración
     * @param {Object} newConfig - Nueva configuración
     */
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };
        
        // Limpiar caché al cambiar la configuración
        this.leverageCache.clear();
        
        console.log('[OK] Configuración actualizada');
        return this.config;
    }
}

module.exports = { LeonardoLeverageMatrix };

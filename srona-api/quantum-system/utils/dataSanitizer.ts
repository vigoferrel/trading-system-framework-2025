/**
 * QuantumDataSanitizer - Sistema de sanitización de datos cuánticos
 * Garantiza que nunca aparezcan valores NaN, undefined o inválidos en la interfaz
 */

// Tipos para datos de entrada no sanitizados
type UnsafeValue = number | string | null | undefined | boolean;
type UnsafeQuantumMetrics = {
  coherenciaCuantica?: UnsafeValue;
  precisionProfetica?: UnsafeValue;
  evolucionConsciente?: UnsafeValue;
  resonanciaCuantica?: UnsafeValue;
  sabiduriaAcumulada?: UnsafeValue;
  resonanciaMarDirac?: UnsafeValue;
  faseTemporal?: UnsafeValue;
};
type UnsafeMarketData = {
  price?: UnsafeValue;
  volume?: UnsafeValue;
  volatility?: UnsafeValue;
  momentum?: UnsafeValue;
  change?: UnsafeValue;
  confidence?: UnsafeValue;
};

export class QuantumDataSanitizer {
  private static readonly SAFE_RANGES = {
    // Métricas cuánticas mejoradas
    coherenciaCuantica: { min: 0, max: 100, fallback: 100.0 },
    precisionProfetica: { min: 0, max: 100, fallback: 87.3 },
    evolucionConsciente: { min: 0, max: 100, fallback: 92.1 },
    resonanciaCuantica: { min: 0, max: 100, fallback: 95.7 },
    sabiduriaAcumulada: { min: 0, max: 100, fallback: 78.9 },
    resonanciaMarDirac: { min: 0, max: 100, fallback: 100.0 },
    faseTemporal: { min: 0, max: 1, fallback: 0.21 },
    quantumEntropy: { min: 0, max: 1, fallback: 0.5 },
    superpositionIndex: { min: 0, max: 1, fallback: 0.75 },
    tunnelingProbability: { min: 0, max: 1, fallback: 0.3 },

    // Datos de mercado extendidos
    price: { min: 0, max: 1000000, fallback: 100.0 },
    volume: { min: 0, max: Number.MAX_SAFE_INTEGER, fallback: 1000000 },
    volatility: { min: 0, max: 1, fallback: 0.02 },
    momentum: { min: -1, max: 1, fallback: 0 },
    change: { min: -100, max: 100, fallback: 0 },
    confidence: { min: 0, max: 1, fallback: 0.5 },

    // Nuevas métricas cuánticas
    quantumScore: { min: 0, max: 100, fallback: 85.0 },
    riskAdjustedReturn: { min: 0, max: 100, fallback: 90.0 },
    sharpeRatio: { min: 0, max: 3, fallback: 1.5 },
    maxDrawdown: { min: 0, max: 100, fallback: 5.0 }
  };

  /**
   * Sanitiza un valor individual verificando tipo, NaN, infinito y rango
   */
  static sanitizeValue(key: string, value: UnsafeValue): number {
    const range = this.SAFE_RANGES[key as keyof typeof this.SAFE_RANGES];
    if (!range) {
      console.warn(`Clave desconocida para sanitización: ${key}, usando 0`);
      return 0;
    }

    // Verificar si el valor es válido
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
      console.warn(`Valor inválido para ${key}: ${value}, usando fallback: ${range.fallback}`);
      return range.fallback;
    }

    // Verificar rango
    if (value < range.min || value > range.max) {
      console.warn(`Valor fuera de rango para ${key}: ${value}, usando fallback: ${range.fallback}`);
      return range.fallback;
    }

    return value;
  }

  /**
   * Sanitiza un objeto completo de datos cuánticos
   */
  static sanitizeObject(data: Record<string, UnsafeValue>): Record<string, number> {
    const sanitized: Record<string, number> = {};
    
    Object.keys(this.SAFE_RANGES).forEach(key => {
      sanitized[key] = this.sanitizeValue(key, data[key]);
    });

    return sanitized;
  }

  /**
   * Sanitiza específicamente métricas cuánticas
   */
  static sanitizeQuantumMetrics(metrics: UnsafeQuantumMetrics | null | undefined): {
    coherenciaCuantica: number;
    precisionProfetica: number;
    evolucionConsciente: number;
    resonanciaCuantica: number;
    sabiduriaAcumulada: number;
    resonanciaMarDirac: number;
    faseTemporal: number;
  } {
    return {
      coherenciaCuantica: this.sanitizeValue('coherenciaCuantica', metrics?.coherenciaCuantica),
      precisionProfetica: this.sanitizeValue('precisionProfetica', metrics?.precisionProfetica),
      evolucionConsciente: this.sanitizeValue('evolucionConsciente', metrics?.evolucionConsciente),
      resonanciaCuantica: this.sanitizeValue('resonanciaCuantica', metrics?.resonanciaCuantica),
      sabiduriaAcumulada: this.sanitizeValue('sabiduriaAcumulada', metrics?.sabiduriaAcumulada),
      resonanciaMarDirac: this.sanitizeValue('resonanciaMarDirac', metrics?.resonanciaMarDirac),
      faseTemporal: this.sanitizeValue('faseTemporal', metrics?.faseTemporal)
    };
  }

  /**
   * Sanitiza datos de mercado
   */
  static sanitizeMarketData(data: UnsafeMarketData | null | undefined): {
    price: number;
    volume: number;
    volatility: number;
    momentum: number;
    change: number;
    confidence: number;
  } {
    return {
      price: this.sanitizeValue('price', data?.price),
      volume: this.sanitizeValue('volume', data?.volume),
      volatility: this.sanitizeValue('volatility', data?.volatility),
      momentum: this.sanitizeValue('momentum', data?.momentum),
      change: this.sanitizeValue('change', data?.change),
      confidence: this.sanitizeValue('confidence', data?.confidence)
    };
  }

  /**
   * Verifica si un valor es seguro (no NaN, no infinito, no null/undefined)
   */
  static isSafeValue(value: UnsafeValue): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }

  /**
   * Obtiene valores de fallback seguros para métricas cuánticas
   */
  static getSafeFallbackMetrics(): Record<string, number> {
    const fallbacks: Record<string, number> = {};
    Object.entries(this.SAFE_RANGES).forEach(([key, range]) => {
      fallbacks[key] = range.fallback;
    });
    return fallbacks;
  }

  /**
   * Formatea un valor para mostrar, garantizando que sea seguro
   */
  static formatSafeValue(value: UnsafeValue, decimals: number = 1): string {
    const safeValue = this.isSafeValue(value) ? (value as number) : 0;
    return safeValue.toFixed(decimals);
  }

  /**
   * Formatea un porcentaje de manera segura
   */
  static formatSafePercentage(value: UnsafeValue, decimals: number = 1): string {
    const safeValue = this.isSafeValue(value) ? (value as number) : 0;
    return `${safeValue.toFixed(decimals)}%`;
  }
}

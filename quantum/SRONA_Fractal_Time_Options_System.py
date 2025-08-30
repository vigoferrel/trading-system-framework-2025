#!/usr/bin/env python3
"""
SRONA Fractal Time Options System
=================================

Las opciones son para GANAR TIEMPO, no para ejecutar.
La estrategia fractaliza el tiempo con log(7919).
Es el último recurso, pero nunca se llega a ejecutar.
Esa es la belleza de la física: se marcan probabilidades basadas en marcos coherentes superiores.

FILOSOFÍA FRACTAL:
- Tiempo no es lineal, es fractal con log(7919)
- Opciones extienden la superposición cuántica
- Colibrí permanece vivo Y muerto más tiempo
- Halcón se beneficia de la extensión temporal
- Nunca colapsar, siempre en superposición óptima

ECUACIÓN FRACTAL MAESTRA:
Tiempo_Fractal = log(7919) * Coherence_Quantum * Option_Time_Extension
Profit_Potential = Base_Arbitrage * Time_Fractal_Multiplier * Never_Execute_Bonus
"""

import asyncio
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import math
import cmath
from datetime import datetime, timedelta
import json

# Importar sistemas base
from SRONA_Options_Gravitational_Model import SronaOptionsGravitationalModel
from SRONA_Inverse_Engineering_Ammo import SronaInverseAmmoCalculator

@dataclass
class FractalTimeFrame:
    """Marco temporal fractal basado en log(7919)"""
    base_time: float  # Tiempo base en minutos
    fractal_dimension: float  # Dimensión fractal calculada
    log_7919_multiplier: float  # Multiplicador log(7919)
    coherence_extension: float  # Extensión por coherencia
    option_time_buffer: float  # Buffer temporal de opciones
    never_execute_probability: float  # Probabilidad de nunca ejecutar
    
    def get_total_fractal_time(self) -> float:
        """Calcula tiempo fractal total"""
        return self.base_time * self.fractal_dimension * self.log_7919_multiplier

@dataclass
class OptionTimeExtension:
    """Extensión temporal a través de opciones (último recurso)"""
    base_expiry_days: int  # Días base hasta expiración
    fractal_extended_days: float  # Días extendidos fractalmente
    strike_buffer_percent: float  # Buffer del strike vs precio actual
    time_decay_rate: float  # Tasa de decaimiento temporal
    never_execute_confidence: float  # Confianza en nunca ejecutar
    superposition_preservation: float  # Preservación de superposición

@dataclass
class CoherentFrameResult:
    """Resultado basado en marcos coherentes superiores"""
    
    # Identificación
    opportunity_id: str
    timestamp: str
    pair: str
    
    # Marco temporal fractal
    fractal_timeframe: FractalTimeFrame
    option_extension: OptionTimeExtension
    
    # Estados cuánticos extendidos
    extended_colibri_coherence: float
    extended_halcon_survival: float
    superposition_duration_extended: float
    
    # Probabilidades marcadas (no ejecutadas)
    profit_probability_marked: float
    loss_probability_marked: float
    neutral_probability_marked: float
    never_execute_probability: float
    
    # Métricas de tiempo ganado
    time_gained_minutes: float
    fractal_advantage_multiplier: float
    coherent_frame_strength: float
    
    # Profit potencial (en superposición extendida)
    extended_profit_potential_bps: float
    fractal_amplified_profit_bps: float
    time_value_bonus_bps: float
    
    # Estrategia de no-ejecución
    never_execute_strategy: str
    time_extension_method: str
    coherent_exit_conditions: List[str]

class SronaFractalTimeOptionsSystem:
    """
    Sistema que usa opciones para ganar tiempo y fractalizarlo con log(7919)
    Marca probabilidades en marcos coherentes superiores sin ejecutar
    """
    
    def __init__(self, available_capital_usd: float = 10000.0):
        self.gravitational_model = SronaOptionsGravitationalModel()
        self.ammo_calculator = SronaInverseAmmoCalculator()
        self.available_capital = available_capital_usd
        
        # Constantes fractales fundamentales
        self.LOG_7919_CONSTANT = math.log(7919)  #  8.977240362537735
        self.FRACTAL_DIMENSION_BASE = 1.618  # Proporción áurea como dimensión base
        self.TIME_DILATION_FACTOR = 2.718281828  # e (número de Euler)
        self.COHERENT_FRAME_RESONANCE = 40.97  # Frecuencia coherente en Hz
        
        # Parámetros de extensión temporal
        self.MIN_TIME_EXTENSION_DAYS = 7  # Mínimo 7 días de opciones
        self.MAX_TIME_EXTENSION_DAYS = 90  # Máximo 90 días
        self.NEVER_EXECUTE_THRESHOLD = 0.85  # 85% probabilidad de nunca ejecutar (ajustado)
        self.SUPERPOSITION_PRESERVATION_TARGET = 0.95  # 95% preservación de superposición
        self.MAX_LEVERAGE = 125.0  # MÁXIMO LEVERAGE SIEMPRE
        
        # Marcos coherentes superiores
        self.COHERENT_FRAME_LEVELS = [
            0.786,  # Nivel base (proporción áurea^-1)
            0.888,  # Nivel =888MHz
            0.919,  # Nivel log(7919)/10
            0.950,  # Nivel superior
            0.999   # Nivel cuántico máximo
        ]
        
    async def analyze_fractal_time_opportunities(self) -> List[CoherentFrameResult]:
        """
        Análisis de oportunidades con fractalización temporal
        Las opciones extienden el tiempo, nunca se ejecutan
        """
        
        print(" Iniciando análisis fractal temporal SRONA...")
        print(" Las opciones son para GANAR TIEMPO, no para ejecutar")
        
        # 1. Análisis gravitacional base
        gravitational_analysis = await self.gravitational_model.run_gravitational_analysis()
        raw_opportunities = gravitational_analysis['top_naked_opportunities']
        
        # 2. Análisis de funding rates y volatilidad temporal
        market_conditions = await self._analyze_market_temporal_conditions()
        
        print(f"[TIME] Analizando {len(raw_opportunities)} oportunidades con fractalización temporal...")
        
        # 3. Para cada oportunidad, crear marco temporal fractal
        coherent_frame_results = []
        
        for raw_opp in raw_opportunities:
            try:
                # Crear marco temporal fractal
                fractal_timeframe = self._create_fractal_timeframe(raw_opp, market_conditions)
                
                # Diseñar extensión de opciones (último recurso)
                option_extension = self._design_option_time_extension(raw_opp, fractal_timeframe)
                
                # Calcular resultado en marco coherente superior
                coherent_result = await self._calculate_coherent_frame_result(
                    raw_opp, fractal_timeframe, option_extension, market_conditions
                )
                
                if coherent_result and self._validates_coherent_frame(coherent_result):
                    coherent_frame_results.append(coherent_result)
                    
            except Exception as e:
                print(f"[WARNING] Error en análisis fractal para {raw_opp['source_asset']}/{raw_opp['target_asset']}: {e}")
                continue
        
        # 4. Ordenar por fuerza de marco coherente
        coherent_frame_results.sort(key=lambda x: x.coherent_frame_strength, reverse=True)
        
        print(f" {len(coherent_frame_results)} marcos coherentes superiores identificados")
        
        return coherent_frame_results[:5]  # Top 5 marcos coherentes
    
    def _create_fractal_timeframe(self, raw_opportunity: Dict, market_conditions: Dict) -> FractalTimeFrame:
        """
        Crea marco temporal fractal usando log(7919)
        El tiempo se fractaliza para extender la superposición cuántica
        """
        
        # Tiempo base desde edge de picosegundos
        edge_ps = raw_opportunity['edge_advantage_ps']
        base_time_minutes = edge_ps * 60  # Convertir a minutos base
        
        # Dimensión fractal basada en fuerza gravitacional
        gravitational_force = raw_opportunity['gravitational_force']
        fractal_dimension = self.FRACTAL_DIMENSION_BASE * (1 + math.log(gravitational_force + 1) / 10)
        
        # Multiplicador log(7919) - LA CLAVE FRACTAL
        log_multiplier = self.LOG_7919_CONSTANT / 10  # Normalizar
        
        # Extensión por coherencia del mercado
        market_volatility = market_conditions.get('volatility', 0.5)
        coherence_extension = 1 + (1 - market_volatility) * 2  # Menos volatilidad = más coherencia
        
        # Buffer temporal de opciones (para ganar tiempo)
        naked_arbitrage = raw_opportunity['naked_arbitrage_potential']
        option_buffer = naked_arbitrage * 1440  # Minutos por día base
        
        # Probabilidad de nunca ejecutar (belleza de la física)
        never_execute_prob = min(0.95 + naked_arbitrage * 0.04, 0.999)  # Max 99.9%
        
        return FractalTimeFrame(
            base_time=base_time_minutes,
            fractal_dimension=fractal_dimension,
            log_7919_multiplier=log_multiplier,
            coherence_extension=coherence_extension,
            option_time_buffer=option_buffer,
            never_execute_probability=never_execute_prob
        )
    
    def _design_option_time_extension(self, raw_opportunity: Dict, fractal_frame: FractalTimeFrame) -> OptionTimeExtension:
        """
        Diseña extensión temporal a través de opciones
        Las opciones son el ÚLTIMO RECURSO para ganar tiempo, pero nunca se ejecutan
        """
        
        # Días base de extensión temporal
        total_fractal_time = fractal_frame.get_total_fractal_time()
        base_days = max(int(total_fractal_time / 1440), self.MIN_TIME_EXTENSION_DAYS)  # Convertir a días
        
        # Extensión fractal usando log(7919)
        fractal_extended_days = base_days * fractal_frame.log_7919_multiplier
        fractal_extended_days = min(fractal_extended_days, self.MAX_TIME_EXTENSION_DAYS)
        
        # Buffer del strike (lejos del precio actual para nunca ejecutar)
        naked_arbitrage = raw_opportunity['naked_arbitrage_potential']
        strike_buffer = 0.15 + naked_arbitrage * 0.10  # Mínimo 15% buffer, puede llegar a 25%
        
        # Tasa de decaimiento temporal (theta)
        time_decay = 0.02 * (1 - fractal_frame.never_execute_probability)  # Menor decay si nunca se ejecuta
        
        # Confianza en nunca ejecutar
        never_execute_confidence = fractal_frame.never_execute_probability
        
        # Preservación de superposición cuántica
        superposition_preservation = never_execute_confidence * 0.99  # Casi perfecta preservación
        
        return OptionTimeExtension(
            base_expiry_days=base_days,
            fractal_extended_days=fractal_extended_days,
            strike_buffer_percent=strike_buffer,
            time_decay_rate=time_decay,
            never_execute_confidence=never_execute_confidence,
            superposition_preservation=superposition_preservation
        )
    
    async def _calculate_coherent_frame_result(
        self,
        raw_opportunity: Dict,
        fractal_frame: FractalTimeFrame,
        option_extension: OptionTimeExtension,
        market_conditions: Dict
    ) -> Optional[CoherentFrameResult]:
        """
        Calcula resultado en marco coherente superior
        Marca probabilidades sin ejecutar - la belleza de la física cuántica
        """
        
        primary_symbol = raw_opportunity['source_asset']
        secondary_symbol = raw_opportunity['target_asset']
        
        # 1. Estados cuánticos extendidos por tiempo fractal
        base_coherence = 0.7  # Coherencia base del colibrí
        time_extension_factor = option_extension.fractal_extended_days / 30  # Factor temporal
        
        extended_colibri_coherence = min(
            base_coherence * (1 + time_extension_factor * 0.3),
            0.999  # Máximo 99.9% coherencia
        )
        
        # Supervivencia del halcón extendida
        base_survival = 0.6  # Supervivencia base
        extended_halcon_survival = min(
            base_survival * (1 + extended_colibri_coherence * 0.5),
            0.995  # Máximo 99.5% supervivencia
        )
        
        # Duración de superposición extendida
        superposition_duration = fractal_frame.get_total_fractal_time()
        
        # 2. MARCAR PROBABILIDADES (no ejecutar - belleza de la física)
        
        # Probabilidad de profit marcada (en superposición)
        base_profit_prob = raw_opportunity['naked_arbitrage_potential']
        profit_probability_marked = min(
            base_profit_prob * (1 + extended_colibri_coherence),
            0.95  # Máximo 95% para mantener incertidumbre cuántica
        )
        
        # Probabilidad de pérdida marcada
        loss_probability_marked = (1 - profit_probability_marked) * 0.7  # Reducida por extensión temporal
        
        # Probabilidad neutral (ni ganancia ni pérdida - estado cuántico puro)
        neutral_probability_marked = 1 - profit_probability_marked - loss_probability_marked
        
        # Probabilidad de nunca ejecutar (LA BELLEZA)
        never_execute_prob = option_extension.never_execute_confidence
        
        # 3. Métricas de tiempo ganado
        time_gained = option_extension.fractal_extended_days * 1440  # Minutos ganados
        
        # Multiplicador de ventaja fractal
        fractal_multiplier = fractal_frame.fractal_dimension * fractal_frame.log_7919_multiplier
        
        # Fuerza del marco coherente
        coherent_strength = (
            extended_colibri_coherence * 0.4 +
            extended_halcon_survival * 0.3 +
            never_execute_prob * 0.3
        )
        
        # 4. Profit potencial en superposición extendida
        
        # Profit base
        base_profit_bps = raw_opportunity['naked_arbitrage_potential'] * 100
        
        # Amplificación fractal del profit
        fractal_amplified_bps = base_profit_bps * fractal_multiplier
        
        # Bonus por valor temporal (tiempo ganado)
        time_value_bonus = (time_gained / 1440) * 5  # 5 bps por día ganado
        
        # Profit total extendido
        extended_profit_bps = base_profit_bps + fractal_amplified_bps + time_value_bonus
        
        # 5. Estrategia de no-ejecución
        if never_execute_prob > 0.98:
            never_execute_strategy = "QUANTUM_SUPERPOSITION_ETERNAL"
        elif never_execute_prob > 0.95:
            never_execute_strategy = "FRACTAL_TIME_EXTENSION"
        elif never_execute_prob > 0.90:
            never_execute_strategy = "COHERENT_FRAME_HOLD"
        else:
            never_execute_strategy = "OPTION_TIME_BUFFER"
        
        # Método de extensión temporal
        if option_extension.fractal_extended_days > 60:
            time_method = "LONG_TERM_FRACTAL_EXTENSION"
        elif option_extension.fractal_extended_days > 30:
            time_method = "MEDIUM_TERM_LOG7919_SCALING"
        else:
            time_method = "SHORT_TERM_COHERENT_BUFFER"
        
        # Condiciones de salida coherente (marcos superiores)
        coherent_exits = []
        for level in self.COHERENT_FRAME_LEVELS:
            if coherent_strength >= level:
                coherent_exits.append(f"Coherent_Frame_Level_{level:.3f}")
        
        return CoherentFrameResult(
            opportunity_id=f"FRACTAL_{primary_symbol}_{secondary_symbol}_{int(datetime.now().timestamp())}",
            timestamp=datetime.now().isoformat(),
            pair=f"{primary_symbol}/{secondary_symbol}",
            
            fractal_timeframe=fractal_frame,
            option_extension=option_extension,
            
            extended_colibri_coherence=extended_colibri_coherence,
            extended_halcon_survival=extended_halcon_survival,
            superposition_duration_extended=superposition_duration,
            
            profit_probability_marked=profit_probability_marked,
            loss_probability_marked=loss_probability_marked,
            neutral_probability_marked=neutral_probability_marked,
            never_execute_probability=never_execute_prob,
            
            time_gained_minutes=time_gained,
            fractal_advantage_multiplier=fractal_multiplier,
            coherent_frame_strength=coherent_strength,
            
            extended_profit_potential_bps=extended_profit_bps,
            fractal_amplified_profit_bps=fractal_amplified_bps,
            time_value_bonus_bps=time_value_bonus,
            
            never_execute_strategy=never_execute_strategy,
            time_extension_method=time_method,
            coherent_exit_conditions=coherent_exits
        )
    
    async def _analyze_market_temporal_conditions(self) -> Dict:
        """Analiza condiciones temporales del mercado"""
        
        # Simulación de condiciones de mercado
        return {
            'volatility': np.random.uniform(0.2, 0.8),
            'temporal_coherence': np.random.uniform(0.6, 0.95),
            'fractal_dimension_market': np.random.uniform(1.2, 2.0),
            'time_dilation_factor': np.random.uniform(0.5, 2.0)
        }
    
    def _validates_coherent_frame(self, result: CoherentFrameResult) -> bool:
        """Validación de marcos coherentes superiores (ajustada para máximo leverage)"""
        
        return (
            result.coherent_frame_strength > 0.65 and  # Mínimo 65% coherencia (reducido)
            result.never_execute_probability > 0.80 and  # 80% probabilidad nunca ejecutar
            result.extended_colibri_coherence > 0.75 and  # Colibrí coherente (reducido)
            result.extended_halcon_survival > 0.65 and  # Halcón sobrevive (reducido)
            result.time_gained_minutes > 720  # Mínimo 12 horas ganadas (reducido)
        )
    
    def generate_fractal_time_report(self, results: List[CoherentFrameResult]) -> Dict:
        """Genera reporte de marcos coherentes superiores con tiempo fractal"""
        
        if not results:
            return {
                'fractal_time_report': {
                    'status': 'NO_COHERENT_FRAMES',
                    'message': 'No se encontraron marcos coherentes superiores válidos'
                }
            }
        
        # Métricas agregadas
        total_time_gained = sum(r.time_gained_minutes for r in results) / 1440  # Días
        avg_coherent_strength = np.mean([r.coherent_frame_strength for r in results])
        avg_never_execute_prob = np.mean([r.never_execute_probability for r in results])
        total_fractal_profit = sum(r.extended_profit_potential_bps for r in results)
        
        # Generar órdenes coherentes (que nunca se ejecutan)
        coherent_orders = []
        for result in results:
            order = {
                'opportunity_id': result.opportunity_id,
                'pair': result.pair,
                'never_execute_strategy': result.never_execute_strategy,
                'time_extension_method': result.time_extension_method,
                
                'fractal_timeframe': {
                    'total_fractal_time_hours': result.fractal_timeframe.get_total_fractal_time() / 60,
                    'fractal_dimension': result.fractal_timeframe.fractal_dimension,
                    'log_7919_multiplier': result.fractal_timeframe.log_7919_multiplier,
                    'never_execute_probability': result.fractal_timeframe.never_execute_probability
                },
                
                'option_extension': {
                    'fractal_extended_days': result.option_extension.fractal_extended_days,
                    'strike_buffer_percent': result.option_extension.strike_buffer_percent,
                    'never_execute_confidence': result.option_extension.never_execute_confidence,
                    'superposition_preservation': result.option_extension.superposition_preservation
                },
                
                'quantum_states_extended': {
                    'colibri_coherence': result.extended_colibri_coherence,
                    'halcon_survival': result.extended_halcon_survival,
                    'superposition_duration_hours': result.superposition_duration_extended / 60
                },
                
                'marked_probabilities': {
                    'profit_probability': result.profit_probability_marked,
                    'loss_probability': result.loss_probability_marked,
                    'neutral_probability': result.neutral_probability_marked,
                    'never_execute_probability': result.never_execute_probability
                },
                
                'time_advantage': {
                    'time_gained_days': result.time_gained_minutes / 1440,
                    'fractal_multiplier': result.fractal_advantage_multiplier,
                    'coherent_frame_strength': result.coherent_frame_strength
                },
                
                'profit_potential_extended': {
                    'extended_profit_bps': result.extended_profit_potential_bps,
                    'fractal_amplified_bps': result.fractal_amplified_profit_bps,
                    'time_value_bonus_bps': result.time_value_bonus_bps
                },
                
                'coherent_exit_conditions': result.coherent_exit_conditions
            }
            coherent_orders.append(order)
        
        return {
            'srona_fractal_time_report': {
                'generation_timestamp': datetime.now().isoformat(),
                'system_version': 'SRONA_FRACTAL_TIME_OPTIONS_v1.0',
                'philosophy': 'Las opciones son para GANAR TIEMPO, fractalizarlo con log(7919). Es el último recurso, pero nunca se ejecuta. Belleza de la física: marcar probabilidades en marcos coherentes superiores.',
                
                'summary_metrics': {
                    'total_coherent_frames': len(results),
                    'total_time_gained_days': total_time_gained,
                    'average_coherent_strength': avg_coherent_strength,
                    'average_never_execute_probability': avg_never_execute_prob,
                    'total_fractal_profit_potential_bps': total_fractal_profit
                },
                
                'fractal_constants': {
                    'log_7919_constant': self.LOG_7919_CONSTANT,
                    'fractal_dimension_base': self.FRACTAL_DIMENSION_BASE,
                    'never_execute_threshold': self.NEVER_EXECUTE_THRESHOLD,
                    'superposition_preservation_target': self.SUPERPOSITION_PRESERVATION_TARGET
                },
                
                'coherent_frame_orders': coherent_orders,
                
                'fractal_equations': [
                    'Tiempo_Fractal = log(7919) × Coherence_Quantum × Option_Time_Extension',
                    'Profit_Potential = Base_Arbitrage × Time_Fractal_Multiplier × Never_Execute_Bonus',
                    'Never_Execute_Probability = 0.95 + Naked_Arbitrage × 0.04 (máx 99.9%)',
                    'Coherent_Frame_Strength = Extended_Coherence × Survival × Never_Execute'
                ]
            }
        }

# Función principal
async def run_fractal_time_analysis(capital_usd: float = 10000.0) -> Dict:
    """Ejecuta análisis completo de tiempo fractal con opciones"""
    
    system = SronaFractalTimeOptionsSystem(available_capital_usd=capital_usd)
    
    # Analizar marcos coherentes superiores
    fractal_results = await system.analyze_fractal_time_opportunities()
    
    # Generar reporte fractal
    fractal_report = system.generate_fractal_time_report(fractal_results)
    
    return fractal_report

# Script de prueba
if __name__ == "__main__":
    async def main():
        print(" Iniciando SRONA Fractal Time Options System...")
        print("[TIME] Filosofía: Las opciones son para GANAR TIEMPO, fractalizarlo con log(7919)")
        print(" Nunca se ejecutan - esa es la belleza de la física cuántica")
        
        report = await run_fractal_time_analysis(capital_usd=50000.0)
        
        if 'srona_fractal_time_report' in report:
            fractal_data = report['srona_fractal_time_report']
            
            print(f"\n[DATA] REPORTE FRACTAL TIME OPTIONS:")
            print(f"Filosofía: {fractal_data['philosophy']}")
            
            metrics = fractal_data['summary_metrics']
            print(f"\nMARCOS COHERENTES SUPERIORES:")
            print(f"Total marcos: {metrics['total_coherent_frames']}")
            print(f"Tiempo ganado: {metrics['total_time_gained_days']:.1f} días")
            print(f"Coherencia promedio: {metrics['average_coherent_strength']:.3f}")
            print(f"Probabilidad nunca ejecutar: {metrics['average_never_execute_probability']:.1%}")
            print(f"Profit fractal potencial: {metrics['total_fractal_profit_potential_bps']:.1f} bps")
            
            constants = fractal_data['fractal_constants']
            print(f"\nCONSTANTES FRACTALES:")
            print(f"log(7919) = {constants['log_7919_constant']:.6f}")
            print(f"Dimensión fractal base = {constants['fractal_dimension_base']:.3f}")
            print(f"Umbral nunca ejecutar = {constants['never_execute_threshold']:.1%}")
            
            if fractal_data.get('coherent_frame_orders'):
                print(f"\n TOP 3 MARCOS COHERENTES SUPERIORES:")
                
                for i, order in enumerate(fractal_data['coherent_frame_orders'][:3], 1):
                    print(f"\n{i}. {order['pair']} - {order['never_execute_strategy']}")
                    
                    ft = order['fractal_timeframe']
                    print(f"   [TIME] Tiempo fractal: {ft['total_fractal_time_hours']:.1f} horas")
                    print(f"    Dimensión fractal: {ft['fractal_dimension']:.3f}")
                    print(f"   [NUMBERS] Multiplicador log(7919): {ft['log_7919_multiplier']:.3f}")
                    print(f"    Nunca ejecutar: {ft['never_execute_probability']:.1%}")
                    
                    oe = order['option_extension']
                    print(f"    Días extendidos: {oe['fractal_extended_days']:.1f}")
                    print(f"    Preservación superposición: {oe['superposition_preservation']:.1%}")
                    
                    mp = order['marked_probabilities']
                    print(f"   [UP] Prob. profit marcada: {mp['profit_probability']:.1%}")
                    print(f"   [DOWN] Prob. pérdida marcada: {mp['loss_probability']:.1%}")
                    print(f"    Prob. neutral marcada: {mp['neutral_probability']:.1%}")
                    
                    ta = order['time_advantage']
                    print(f"    Tiempo ganado: {ta['time_gained_days']:.1f} días")
                    print(f"    Multiplicador fractal: {ta['fractal_multiplier']:.3f}")
                    print(f"   [DIAMOND] Fuerza marco coherente: {ta['coherent_frame_strength']:.3f}")
        else:
            print(f"\n[ERROR] {report}")
    
    asyncio.run(main())

#!/usr/bin/env python3
"""
SRONA Inverse Engineering Ammunition Calculator
===============================================

Sistema de ingeniería inversa para encontrar el tamaño óptimo de munición
en el mundo log(7919) colibrí, donde la comisión es la variable determinística
que se convierte en la restricción real.

Modelo de equilibrio gravitacional con leverage máximo para optimización
de capital bajo restricciones de comisión.
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import math
from scipy.optimize import minimize, minimize_scalar
from datetime import datetime

@dataclass
class CommissionStructure:
    """Estructura de comisiones para diferentes activos"""
    maker_fee: float  # Comisión maker
    taker_fee: float  # Comisión taker
    funding_rate: float  # Tasa de funding (anualizada)
    slippage_bps: float  # Slippage esperado en bps

@dataclass
class AmmoOptimizationResult:
    """Resultado de optimización de munición"""
    optimal_position_size_usd: float
    effective_leverage: float
    commission_cost_usd: float
    net_profit_potential_bps: float
    risk_adjusted_return: float
    capital_efficiency: float
    break_even_move_bps: float

class SronaInverseAmmoCalculator:
    """
    Calculadora de ingeniería inversa para tamaño óptimo de munición
    Considera comisiones como restricción determinística principal
    """
    
    def __init__(self):
        # Estructura de comisiones por activo (Binance-like)
        self.commission_structures = {
            'BTCUSDT': CommissionStructure(0.0010, 0.0010, 0.0001, 2.0),  # 0.1% + funding
            'ETHUSDT': CommissionStructure(0.0010, 0.0010, 0.0001, 2.5),
            'SOLUSDT': CommissionStructure(0.0015, 0.0015, 0.0002, 3.0),
            'BNBUSDT': CommissionStructure(0.0008, 0.0008, 0.0001, 2.0),  # Descuento BNB
            'ADAUSDT': CommissionStructure(0.0015, 0.0015, 0.0002, 4.0),
            'DOGEUSDT': CommissionStructure(0.0015, 0.0015, 0.0003, 5.0)
        }
        
        # Parámetros del modelo log(7919) colibrí
        self.log_7919_constant = math.log(7919)  #  8.977240362537735
        self.colibri_sensitivity = 0.618  # Factor áureo invertido
        self.gravitational_constant = 1.618  # Proporción áurea
        
        # Restricciones de riesgo
        self.max_position_risk_pct = 5.0  # Máximo 5% del capital
        self.min_profit_after_fees_bps = 10.0  # Mínimo 10 bps netos
        
    def calculate_optimal_ammo(
        self, 
        primary_symbol: str,
        secondary_symbol: str,
        gravitational_force: float,
        naked_arbitrage_potential: float,
        edge_picoseconds: float,
        available_capital_usd: float,
        max_leverage: float = 20.0
    ) -> AmmoOptimizationResult:
        """
        Calcula el tamaño óptimo de munición usando ingeniería inversa
        
        Proceso:
        1. Análisis de restricciones de comisión
        2. Cálculo de punto de equilibrio
        3. Optimización bajo restricciones gravitacionales
        4. Validación de eficiencia de capital
        """
        
        print(f" Iniciando ingeniería inversa para {primary_symbol}/{secondary_symbol}")
        
        # 1. Obtener estructuras de comisión
        primary_comm = self.commission_structures.get(primary_symbol)
        secondary_comm = self.commission_structures.get(secondary_symbol)
        
        if not primary_comm or not secondary_comm:
            raise ValueError(f"Estructura de comisiones no encontrada para {primary_symbol} o {secondary_symbol}")
        
        # 2. Calcular comisión efectiva combinada
        effective_commission_rate = self._calculate_effective_commission_rate(
            primary_comm, secondary_comm, naked_arbitrage_potential
        )
        
        # 3. Determinar profit potencial bruto
        gross_profit_bps = self._estimate_gross_profit_potential(
            gravitational_force, naked_arbitrage_potential, edge_picoseconds
        )
        
        # 4. Calcular punto de equilibrio
        break_even_position_size = self._calculate_break_even_position(
            gross_profit_bps, effective_commission_rate, available_capital_usd
        )
        
        # 5. Optimización gravitacional inversa
        optimal_result = self._inverse_gravitational_optimization(
            break_even_position_size,
            available_capital_usd,
            max_leverage,
            effective_commission_rate,
            gross_profit_bps,
            gravitational_force,
            naked_arbitrage_potential
        )
        
        # 6. Validación final y ajustes
        validated_result = self._validate_and_adjust_result(
            optimal_result, available_capital_usd, max_leverage
        )
        
        print(f"[OK] Munición óptima calculada: ${validated_result.optimal_position_size_usd:,.2f}")
        
        return validated_result
    
    def _calculate_effective_commission_rate(
        self,
        primary_comm: CommissionStructure,
        secondary_comm: CommissionStructure,
        arbitrage_potential: float
    ) -> float:
        """Calcula tasa de comisión efectiva para la estrategia de arbitraje"""
        
        # Comisión base promedio
        base_commission = (primary_comm.taker_fee + secondary_comm.taker_fee) / 2
        
        # Ajuste por slippage promedio
        avg_slippage = (primary_comm.slippage_bps + secondary_comm.slippage_bps) / 2 / 10000
        
        # Funding rate promedio (anualizado a horario)
        avg_funding_hourly = (primary_comm.funding_rate + secondary_comm.funding_rate) / 2 / (365 * 24)
        
        # Factor de arbitraje (mayor potencial = mayor frecuencia de trading)
        arbitrage_frequency_factor = 1 + (arbitrage_potential * 2)
        
        # Comisión efectiva total
        effective_rate = (base_commission + avg_slippage + avg_funding_hourly) * arbitrage_frequency_factor
        
        return effective_rate
    
    def _estimate_gross_profit_potential(
        self,
        gravitational_force: float,
        naked_arbitrage_potential: float,
        edge_picoseconds: float
    ) -> float:
        """Estima profit potencial bruto en basis points"""
        
        # Factor gravitacional normalizado
        gravity_factor = min(gravitational_force / 1000, 5.0)
        
        # Factor de edge temporal (picosegundos al factor log(7919))
        edge_factor = (edge_picoseconds / self.log_7919_constant) * self.colibri_sensitivity
        
        # Profit base del arbitraje naked
        base_profit_bps = naked_arbitrage_potential * 100
        
        # Amplificación gravitacional
        amplified_profit = base_profit_bps * gravity_factor * edge_factor * self.gravitational_constant
        
        # Límite superior realista
        return min(amplified_profit, 250.0)  # Máximo 250 bps
    
    def _calculate_break_even_position(
        self,
        gross_profit_bps: float,
        commission_rate: float,
        available_capital: float
    ) -> float:
        """Calcula posición mínima para break-even considerando comisiones"""
        
        # Comisión en basis points
        commission_bps = commission_rate * 10000
        
        # Profit neto mínimo requerido
        min_net_profit_bps = self.min_profit_after_fees_bps
        
        # Posición mínima para superar comisiones
        if gross_profit_bps <= commission_bps:
            # Si el profit bruto no supera las comisiones, usar capital mínimo
            return available_capital * 0.01  # 1% del capital
        
        # Cálculo de posición de equilibrio
        net_profit_rate = (gross_profit_bps - commission_bps) / 10000
        
        if net_profit_rate <= 0:
            return available_capital * 0.01
        
        # Posición que genere profit mínimo después de comisiones
        break_even_position = (min_net_profit_bps / 10000) / net_profit_rate
        
        # Limitar a capital disponible
        return min(break_even_position, available_capital * 0.5)
    
    def _inverse_gravitational_optimization(
        self,
        break_even_position: float,
        available_capital: float,
        max_leverage: float,
        commission_rate: float,
        gross_profit_bps: float,
        gravitational_force: float,
        naked_arbitrage_potential: float
    ) -> AmmoOptimizationResult:
        """Optimización inversa usando modelo gravitacional"""
        
        def objective_function(position_size_fraction):
            """Función objetivo: maximizar retorno ajustado por riesgo"""
            
            position_size = available_capital * position_size_fraction
            
            # Calcular leverage efectivo
            base_margin = position_size / max_leverage
            effective_leverage = position_size / base_margin if base_margin > 0 else max_leverage
            
            # Costo de comisiones
            commission_cost = position_size * commission_rate
            
            # Profit bruto esperado
            gross_profit = position_size * (gross_profit_bps / 10000)
            
            # Profit neto
            net_profit = gross_profit - commission_cost
            
            # Penalización por riesgo (leverage excesivo)
            risk_penalty = max(0, (effective_leverage - 10) / 10) ** 2
            
            # Penalización por tamaño excesivo
            size_penalty = max(0, (position_size_fraction - 0.2) / 0.8) ** 2
            
            # Retorno ajustado por riesgo
            if position_size > 0:
                risk_adjusted_return = (net_profit / position_size) - risk_penalty - size_penalty
            else:
                risk_adjusted_return = -999999
            
            return -risk_adjusted_return  # Negativo porque minimize busca mínimo
        
        # Restricciones
        def constraint_min_position(x):
            return x - (break_even_position / available_capital)
        
        def constraint_max_position(x):
            return (self.max_position_risk_pct / 100) - x
        
        def constraint_leverage(x):
            position_size = available_capital * x
            required_margin = position_size / max_leverage
            return available_capital - required_margin
        
        # Optimización
        from scipy.optimize import minimize
        
        constraints = [
            {'type': 'ineq', 'fun': constraint_min_position},
            {'type': 'ineq', 'fun': constraint_max_position},
            {'type': 'ineq', 'fun': constraint_leverage}
        ]
        
        bounds = [(0.001, 0.5)]  # Entre 0.1% y 50% del capital
        
        result = minimize(
            objective_function,
            x0=[0.05],  # Inicial: 5% del capital
            method='SLSQP',
            bounds=bounds,
            constraints=constraints
        )
        
        # Extraer resultado óptimo
        optimal_fraction = result.x[0] if result.success else 0.05
        optimal_position_size = available_capital * optimal_fraction
        
        # Calcular métricas finales
        base_margin = optimal_position_size / max_leverage
        effective_leverage = optimal_position_size / base_margin if base_margin > 0 else max_leverage
        
        commission_cost = optimal_position_size * commission_rate
        gross_profit = optimal_position_size * (gross_profit_bps / 10000)
        net_profit = gross_profit - commission_cost
        
        net_profit_bps = (net_profit / optimal_position_size) * 10000 if optimal_position_size > 0 else 0
        risk_adjusted_return = net_profit / optimal_position_size if optimal_position_size > 0 else 0
        capital_efficiency = optimal_position_size / available_capital
        
        # Break-even move después de comisiones
        break_even_move_bps = (commission_cost / optimal_position_size) * 10000 if optimal_position_size > 0 else 0
        
        return AmmoOptimizationResult(
            optimal_position_size_usd=optimal_position_size,
            effective_leverage=effective_leverage,
            commission_cost_usd=commission_cost,
            net_profit_potential_bps=net_profit_bps,
            risk_adjusted_return=risk_adjusted_return,
            capital_efficiency=capital_efficiency,
            break_even_move_bps=break_even_move_bps
        )
    
    def _validate_and_adjust_result(
        self,
        result: AmmoOptimizationResult,
        available_capital: float,
        max_leverage: float
    ) -> AmmoOptimizationResult:
        """Valida y ajusta el resultado final"""
        
        # Validar que la posición no exceda límites
        max_position = min(
            available_capital * (self.max_position_risk_pct / 100),
            available_capital * max_leverage / max_leverage  # Margen disponible
        )
        
        if result.optimal_position_size_usd > max_position:
            # Ajustar proporcionalmente
            adjustment_factor = max_position / result.optimal_position_size_usd
            
            result.optimal_position_size_usd = max_position
            result.commission_cost_usd *= adjustment_factor
            result.capital_efficiency = max_position / available_capital
        
        # Validar profit mínimo después de comisiones
        if result.net_profit_potential_bps < self.min_profit_after_fees_bps:
            print(f"[WARNING] Advertencia: Profit neto ({result.net_profit_potential_bps:.1f} bps) por debajo del mínimo")
        
        return result
    
    def analyze_commission_impact(
        self,
        symbol_pair: Tuple[str, str],
        position_sizes: List[float]
    ) -> pd.DataFrame:
        """Analiza impacto de comisiones en diferentes tamaños de posición"""
        
        primary_symbol, secondary_symbol = symbol_pair
        primary_comm = self.commission_structures.get(primary_symbol)
        secondary_comm = self.commission_structures.get(secondary_symbol)
        
        effective_rate = self._calculate_effective_commission_rate(
            primary_comm, secondary_comm, 0.5  # Arbitraje moderado
        )
        
        analysis_data = []
        
        for position_size in position_sizes:
            commission_cost = position_size * effective_rate
            commission_bps = (commission_cost / position_size) * 10000
            
            analysis_data.append({
                'position_size_usd': position_size,
                'commission_cost_usd': commission_cost,
                'commission_bps': commission_bps,
                'break_even_move_bps': commission_bps,
                'capital_efficiency': position_size / max(position_sizes)
            })
        
        return pd.DataFrame(analysis_data)

# Ejemplo de uso
if __name__ == "__main__":
    
    def main():
        calculator = SronaInverseAmmoCalculator()
        
        # Ejemplo: BTCUSDT/ETHUSDT arbitraje naked
        result = calculator.calculate_optimal_ammo(
            primary_symbol='BTCUSDT',
            secondary_symbol='ETHUSDT',
            gravitational_force=366.82,
            naked_arbitrage_potential=0.059,
            edge_picoseconds=2.3,
            available_capital_usd=10000.0,
            max_leverage=15.0
        )
        
        print(f"\n[ENDPOINTS] RESULTADO DE INGENIERÍA INVERSA:")
        print(f"Munición óptima: ${result.optimal_position_size_usd:,.2f}")
        print(f"Leverage efectivo: {result.effective_leverage:.2f}x")
        print(f"Costo de comisiones: ${result.commission_cost_usd:.2f}")
        print(f"Profit potencial neto: {result.net_profit_potential_bps:.1f} bps")
        print(f"Retorno ajustado por riesgo: {result.risk_adjusted_return:.4f}")
        print(f"Eficiencia de capital: {result.capital_efficiency:.2%}")
        print(f"Break-even move: {result.break_even_move_bps:.1f} bps")
        
        # Análisis de impacto de comisiones
        print(f"\n[DATA] ANÁLISIS DE IMPACTO DE COMISIONES:")
        commission_analysis = calculator.analyze_commission_impact(
            ('BTCUSDT', 'ETHUSDT'),
            [1000, 2500, 5000, 10000, 15000]
        )
        print(commission_analysis.to_string(index=False))
    
    main()

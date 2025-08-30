#!/usr/bin/env python3
"""
SRONA Integrated Options System
===============================

Sistema integrado que combina:
1. Modelo gravitacional para detectar oportunidades naked
2. Ingeniería inversa de munición considerando comisiones
3. Filtrado de oportunidades rentables después de costos
4. Generación de señales para el server principal

Enfoque macro en el mundo log(7919) colibrí con restricciones de comisión.
"""

import asyncio
import numpy as np
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
import json

# Importar nuestros sistemas
from SRONA_Options_Gravitational_Model import SronaOptionsGravitationalModel
from SRONA_Inverse_Engineering_Ammo import SronaInverseAmmoCalculator, AmmoOptimizationResult

@dataclass
class IntegratedOpportunity:
    """Oportunidad integrada con análisis gravitacional y optimización de munición"""
    
    # Identificación
    opportunity_id: str
    timestamp: str
    
    # Par de trading
    primary_symbol: str
    secondary_symbol: str
    
    # Datos gravitacionales
    gravitational_force: float
    naked_arbitrage_potential: float
    edge_picoseconds: float
    directional_bias: float
    correlation_strength: float
    
    # Optimización de munición
    optimal_position_size_usd: float
    effective_leverage: float
    commission_cost_usd: float
    net_profit_potential_bps: float
    risk_adjusted_return: float
    capital_efficiency: float
    break_even_move_bps: float
    
    # Evaluación final
    is_profitable_after_fees: bool
    profitability_score: float  # 0-10
    execution_priority: int     # 1-10
    
    # Estrategia recomendada
    recommended_strategy: str
    time_horizon_minutes: int
    max_drawdown_percent: float

class SronaIntegratedOptionsSystem:
    """
    Sistema integrado SRONA para oportunidades de opciones naked
    Combina análisis gravitacional con optimización de munición
    """
    
    def __init__(self, available_capital_usd: float = 10000.0):
        self.gravitational_model = SronaOptionsGravitationalModel()
        self.ammo_calculator = SronaInverseAmmoCalculator()
        self.available_capital = available_capital_usd
        
        # Parámetros de filtrado
        self.min_profitability_score = 6.0
        self.min_net_profit_bps = 15.0
        self.max_acceptable_risk = 0.05  # 5% del capital
        
        # Métricas de sistema
        self.system_metrics = {
            'total_opportunities_analyzed': 0,
            'profitable_opportunities_found': 0,
            'average_profitability_score': 0,
            'total_capital_allocated': 0,
            'expected_total_return_bps': 0
        }
    
    async def find_profitable_opportunities(
        self, 
        max_leverage: float = 15.0
    ) -> List[IntegratedOpportunity]:
        """
        Encuentra oportunidades rentables después de comisiones
        
        Proceso:
        1. Ejecutar análisis gravitacional
        2. Para cada oportunidad, calcular munición óptima
        3. Filtrar solo las rentables después de comisiones
        4. Ordenar por score de rentabilidad
        """
        
        print(" Iniciando análisis integrado SRONA...")
        
        # 1. Obtener oportunidades gravitacionales
        gravitational_analysis = await self.gravitational_model.run_gravitational_analysis()
        raw_opportunities = gravitational_analysis['top_naked_opportunities']
        
        print(f"[DATA] {len(raw_opportunities)} oportunidades gravitacionales detectadas")
        
        # 2. Analizar cada oportunidad con ingeniería inversa
        integrated_opportunities = []
        
        for raw_opp in raw_opportunities:
            try:
                integrated_opp = await self._analyze_opportunity_with_ammo_optimization(
                    raw_opp, max_leverage
                )
                
                if integrated_opp:
                    integrated_opportunities.append(integrated_opp)
                    
            except Exception as e:
                print(f"[WARNING] Error analizando {raw_opp['source_asset']}/{raw_opp['target_asset']}: {e}")
                continue
        
        # 3. Filtrar oportunidades rentables
        profitable_opportunities = [
            opp for opp in integrated_opportunities 
            if opp.is_profitable_after_fees and opp.profitability_score >= self.min_profitability_score
        ]
        
        # 4. Ordenar por score de rentabilidad
        profitable_opportunities.sort(
            key=lambda x: x.profitability_score, 
            reverse=True
        )
        
        # 5. Actualizar métricas del sistema
        self._update_system_metrics(integrated_opportunities, profitable_opportunities)
        
        print(f"[OK] {len(profitable_opportunities)} oportunidades rentables encontradas")
        
        return profitable_opportunities[:5]  # Top 5
    
    async def _analyze_opportunity_with_ammo_optimization(
        self, 
        raw_opportunity: Dict, 
        max_leverage: float
    ) -> Optional[IntegratedOpportunity]:
        """Analiza una oportunidad raw con optimización de munición"""
        
        primary_symbol = raw_opportunity['source_asset']
        secondary_symbol = raw_opportunity['target_asset']
        
        # Calcular munición óptima
        try:
            ammo_result = self.ammo_calculator.calculate_optimal_ammo(
                primary_symbol=primary_symbol,
                secondary_symbol=secondary_symbol,
                gravitational_force=raw_opportunity['gravitational_force'],
                naked_arbitrage_potential=raw_opportunity['naked_arbitrage_potential'],
                edge_picoseconds=raw_opportunity['edge_advantage_ps'],
                available_capital_usd=self.available_capital,
                max_leverage=max_leverage
            )
        except Exception as e:
            print(f"[ERROR] Error calculando munición para {primary_symbol}/{secondary_symbol}: {e}")
            return None
        
        # Evaluar rentabilidad
        is_profitable = ammo_result.net_profit_potential_bps >= self.min_net_profit_bps
        profitability_score = self._calculate_profitability_score(ammo_result, raw_opportunity)
        execution_priority = self._calculate_execution_priority(profitability_score, ammo_result)
        
        # Determinar estrategia y parámetros
        strategy_params = self._determine_strategy_parameters(raw_opportunity, ammo_result)
        
        # Generar ID único
        opportunity_id = f"SRONA_INT_{primary_symbol}_{secondary_symbol}_{int(datetime.now().timestamp())}"
        
        return IntegratedOpportunity(
            opportunity_id=opportunity_id,
            timestamp=datetime.now().isoformat(),
            
            primary_symbol=primary_symbol,
            secondary_symbol=secondary_symbol,
            
            gravitational_force=raw_opportunity['gravitational_force'],
            naked_arbitrage_potential=raw_opportunity['naked_arbitrage_potential'],
            edge_picoseconds=raw_opportunity['edge_advantage_ps'],
            directional_bias=raw_opportunity['directional_bias'],
            correlation_strength=0.5,  # Placeholder - podríamos calcular esto
            
            optimal_position_size_usd=ammo_result.optimal_position_size_usd,
            effective_leverage=ammo_result.effective_leverage,
            commission_cost_usd=ammo_result.commission_cost_usd,
            net_profit_potential_bps=ammo_result.net_profit_potential_bps,
            risk_adjusted_return=ammo_result.risk_adjusted_return,
            capital_efficiency=ammo_result.capital_efficiency,
            break_even_move_bps=ammo_result.break_even_move_bps,
            
            is_profitable_after_fees=is_profitable,
            profitability_score=profitability_score,
            execution_priority=execution_priority,
            
            recommended_strategy=strategy_params['strategy'],
            time_horizon_minutes=strategy_params['time_horizon'],
            max_drawdown_percent=strategy_params['max_drawdown']
        )
    
    def _calculate_profitability_score(
        self, 
        ammo_result: AmmoOptimizationResult, 
        raw_opportunity: Dict
    ) -> float:
        """Calcula score de rentabilidad (0-10)"""
        
        # Componentes del score
        profit_component = min(ammo_result.net_profit_potential_bps / 50.0, 1.0) * 3  # Max 3 puntos
        
        risk_component = max(0, 1 - abs(ammo_result.risk_adjusted_return)) * 2  # Max 2 puntos
        
        efficiency_component = min(ammo_result.capital_efficiency * 10, 1.0) * 2  # Max 2 puntos
        
        gravitational_component = min(raw_opportunity['gravitational_force'] / 1000, 1.0) * 2  # Max 2 puntos
        
        edge_component = min(raw_opportunity['edge_advantage_ps'] / 3.0, 1.0) * 1  # Max 1 punto
        
        total_score = (
            profit_component + 
            risk_component + 
            efficiency_component + 
            gravitational_component + 
            edge_component
        )
        
        return round(total_score, 1)
    
    def _calculate_execution_priority(
        self, 
        profitability_score: float, 
        ammo_result: AmmoOptimizationResult
    ) -> int:
        """Calcula prioridad de ejecución (1-10)"""
        
        # Base en score de rentabilidad
        base_priority = min(int(profitability_score), 8)
        
        # Bonus por eficiencia alta
        if ammo_result.capital_efficiency > 0.1:  # Más del 10% del capital
            base_priority += 1
        
        # Bonus por profit alto después de comisiones
        if ammo_result.net_profit_potential_bps > 30:
            base_priority += 1
        
        return min(base_priority, 10)
    
    def _determine_strategy_parameters(
        self, 
        raw_opportunity: Dict, 
        ammo_result: AmmoOptimizationResult
    ) -> Dict:
        """Determina parámetros de estrategia basados en análisis"""
        
        # Estrategia base
        base_strategy = raw_opportunity['recommended_strategy']
        
        # Ajustar horizonte temporal según leverage y volatilidad
        if ammo_result.effective_leverage > 10:
            time_horizon = 15  # Posiciones más agresivas, salida más rápida
        elif ammo_result.net_profit_potential_bps > 25:
            time_horizon = 30  # Profit alto, dar más tiempo
        else:
            time_horizon = 45  # Estrategia conservadora
        
        # Calcular drawdown máximo
        base_drawdown = 3.0  # 3% base
        leverage_adjustment = min(ammo_result.effective_leverage / 10.0, 2.0)
        max_drawdown = base_drawdown * leverage_adjustment
        
        return {
            'strategy': base_strategy,
            'time_horizon': time_horizon,
            'max_drawdown': round(max_drawdown, 1)
        }
    
    def _update_system_metrics(
        self, 
        all_opportunities: List[IntegratedOpportunity],
        profitable_opportunities: List[IntegratedOpportunity]
    ):
        """Actualiza métricas del sistema"""
        
        self.system_metrics['total_opportunities_analyzed'] = len(all_opportunities)
        self.system_metrics['profitable_opportunities_found'] = len(profitable_opportunities)
        
        if all_opportunities:
            avg_score = np.mean([opp.profitability_score for opp in all_opportunities])
            self.system_metrics['average_profitability_score'] = round(avg_score, 2)
        
        if profitable_opportunities:
            total_allocated = sum(opp.optimal_position_size_usd for opp in profitable_opportunities)
            total_expected_return = sum(
                opp.optimal_position_size_usd * opp.net_profit_potential_bps / 10000 
                for opp in profitable_opportunities
            )
            expected_return_bps = (total_expected_return / total_allocated) * 10000 if total_allocated > 0 else 0
            
            self.system_metrics['total_capital_allocated'] = total_allocated
            self.system_metrics['expected_total_return_bps'] = round(expected_return_bps, 1)
    
    def generate_execution_report(
        self, 
        opportunities: List[IntegratedOpportunity]
    ) -> Dict:
        """Genera reporte de ejecución para el server principal"""
        
        execution_orders = []
        
        for opp in opportunities:
            order = {
                'opportunity_id': opp.opportunity_id,
                'timestamp': opp.timestamp,
                'pair': f"{opp.primary_symbol}/{opp.secondary_symbol}",
                'action': 'OPEN_NAKED_POSITION',
                'strategy': opp.recommended_strategy,
                
                'position_details': {
                    'size_usd': opp.optimal_position_size_usd,
                    'leverage': opp.effective_leverage,
                    'expected_profit_bps': opp.net_profit_potential_bps,
                    'break_even_bps': opp.break_even_move_bps
                },
                
                'risk_management': {
                    'max_drawdown_pct': opp.max_drawdown_percent,
                    'time_horizon_min': opp.time_horizon_minutes,
                    'risk_score': opp.risk_adjusted_return
                },
                
                'execution_params': {
                    'priority': opp.execution_priority,
                    'profitability_score': opp.profitability_score,
                    'capital_efficiency': opp.capital_efficiency
                },
                
                'gravitational_data': {
                    'force': opp.gravitational_force,
                    'arbitrage_potential': opp.naked_arbitrage_potential,
                    'edge_ps': opp.edge_picoseconds,
                    'directional_bias': opp.directional_bias
                }
            }
            
            execution_orders.append(order)
        
        return {
            'srona_integrated_report': {
                'generation_timestamp': datetime.now().isoformat(),
                'system_version': 'SRONA_INTEGRATED_v1.0',
                'available_capital_usd': self.available_capital,
                'execution_orders': execution_orders,
                'system_metrics': self.system_metrics,
                'total_orders': len(execution_orders)
            }
        }

# Función principal para uso externo
async def run_srona_integrated_analysis(capital_usd: float = 10000.0) -> Dict:
    """
    Función principal para ejecutar análisis integrado SRONA
    """
    
    system = SronaIntegratedOptionsSystem(available_capital_usd=capital_usd)
    
    # Encontrar oportunidades rentables
    opportunities = await system.find_profitable_opportunities()
    
    # Generar reporte de ejecución
    execution_report = system.generate_execution_report(opportunities)
    
    return execution_report

# Script de prueba
if __name__ == "__main__":
    async def main():
        print("[START] Iniciando Sistema Integrado SRONA...")
        
        report = await run_srona_integrated_analysis(capital_usd=10000.0)
        
        print(f"\n[LIST] REPORTE DE EJECUCIÓN SRONA INTEGRADO:")
        print(f"Capital disponible: ${report['srona_integrated_report']['available_capital_usd']:,.2f}")
        print(f"Órdenes generadas: {report['srona_integrated_report']['total_orders']}")
        
        metrics = report['srona_integrated_report']['system_metrics']
        print(f"\n[DATA] MÉTRICAS DEL SISTEMA:")
        print(f"Oportunidades analizadas: {metrics['total_opportunities_analyzed']}")
        print(f"Oportunidades rentables: {metrics['profitable_opportunities_found']}")
        print(f"Score promedio de rentabilidad: {metrics['average_profitability_score']}")
        print(f"Capital total asignado: ${metrics['total_capital_allocated']:,.2f}")
        print(f"Retorno esperado total: {metrics['expected_total_return_bps']:.1f} bps")
        
        if report['srona_integrated_report']['execution_orders']:
            print(f"\n[ENDPOINTS] TOP 3 ÓRDENES DE EJECUCIÓN:")
            
            for i, order in enumerate(report['srona_integrated_report']['execution_orders'][:3], 1):
                print(f"\n{i}. {order['pair']} - {order['strategy']}")
                print(f"   Tamaño: ${order['position_details']['size_usd']:,.2f}")
                print(f"   Leverage: {order['position_details']['leverage']:.2f}x")
                print(f"   Profit esperado: {order['position_details']['expected_profit_bps']:.1f} bps")
                print(f"   Break-even: {order['position_details']['break_even_bps']:.1f} bps")
                print(f"   Prioridad: {order['execution_params']['priority']}/10")
                print(f"   Score rentabilidad: {order['execution_params']['profitability_score']:.1f}/10")
                print(f"   Horizonte: {order['risk_management']['time_horizon_min']} min")
        else:
            print(f"\n[ERROR] No se encontraron oportunidades rentables después de comisiones")
    
    asyncio.run(main())

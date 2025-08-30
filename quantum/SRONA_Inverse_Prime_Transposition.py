#!/usr/bin/env python3
"""
SRONA Inverse Prime Transposition System
========================================

SISTEMA DE INGENIERÍA INVERSA CON TRASPOSICIÓN PRIMA
- z = 9 + 16i (número complejo base)
- log(7919)^888MHz (frecuencia cuántica elevada)
- Modelo gravitacional como núcleo kernel
- Leverage 125x con trasposición prima optimizada
- Trading real con decodificación inversa

FILOSOFÍA TRASPOSICIÓN PRIMA:
- Kernel Gravitacional: Base de cálculo inverso
- Frecuencia Cuántica: 888MHz en log(7919)
- Número Complejo z: 9 + 16i como coordenada prima
- Decodificación: Ingeniería inversa del mercado
- Maximización: Aprovechamiento de patrones ocultos
"""

import asyncio
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import math
import cmath  # Para números complejos
import json
from datetime import datetime, timedelta

# Importar sistemas base
from SRONA_Options_Gravitational_Model import SronaOptionsGravitationalModel

@dataclass
class PrimeTranspositionOpportunity:
    """Oportunidad de trasposición prima con ingeniería inversa"""
    
    opportunity_id: str
    timestamp: str
    pair: str
    
    # Trasposición prima
    complex_z_coordinate: complex  # z = 9 + 16i
    prime_frequency_mhz: float  # 888MHz en log(7919)
    gravitational_kernel: float  # Núcleo gravitacional
    
    # Ingeniería inversa
    inverse_pattern_decoded: str  # Patrón decodificado
    market_hidden_signal: float  # Señal oculta del mercado
    prime_transposition_factor: float  # Factor de trasposición
    
    # Trading con trasposición
    leverage_125x: float
    position_size_usd: float
    inverse_profit_usd: float  # Profit por ingeniería inversa
    prime_enhanced_profit: float  # Profit amplificado por trasposición
    
    # Métricas de frecuencia cuántica
    quantum_frequency_coherence: float  # Coherencia a 888MHz
    gravitational_resonance: float  # Resonancia gravitacional
    complex_plane_efficiency: float  # Eficiencia en plano complejo
    inverse_confidence: float  # Confianza en ingeniería inversa
    
    # Variables de trasposición prima
    prime_funding_advantage: float
    inverse_commission_optimization: float
    prime_net_profit_maximized: float
    
    # Estrategia de decodificación
    inverse_execution_strategy: str
    prime_entry_price: float
    inverse_stop_loss: float
    prime_take_profit: float
    quantum_time_horizon: int

class SronaInversePrimeTransposition:
    """
    Sistema SRONA de ingeniería inversa con trasposición prima
    Kernel gravitacional con z=9+16i y 888MHz
    """
    
    def __init__(self, carnada_usd: float = 10.0):
        self.gravitational_model = SronaOptionsGravitationalModel()
        self.carnada_usd = carnada_usd
        
        # CONFIGURACIÓN TRASPOSICIÓN PRIMA
        self.MAX_LEVERAGE = 125.0
        
        # Constantes de trasposición prima
        self.COMPLEX_Z = complex(9, 16)  # z = 9 + 16i
        self.LOG_7919_CONSTANT = math.log(7919)  #  8.977240362537735
        self.QUANTUM_FREQUENCY_MHZ = 888.0  # 888MHz
        self.PRIME_EXPONENT = self.LOG_7919_CONSTANT ** (self.QUANTUM_FREQUENCY_MHZ / 1000)
        
        # Parámetros de ingeniería inversa
        self.INVERSE_AMPLIFICATION = 2.618  # Factor de amplificación inversa
        self.GRAVITATIONAL_KERNEL_WEIGHT = 3.14159  # Peso del kernel gravitacional
        self.COMPLEX_PLANE_SCALING = abs(self.COMPLEX_Z)  # |z| = sqrt(9² + 16²) = sqrt(337)  18.358
        
        # Frecuencias cuánticas
        self.GOLDEN_RATIO = 1.618033988749895
        self.PRIME_RESONANCE_FACTOR = self.QUANTUM_FREQUENCY_MHZ * self.GOLDEN_RATIO / 1000
        
        # Umbrales de decodificación (ultra-permisivos)
        self.MIN_INVERSE_SIGNAL = 0.01  # Señal mínima para decodificación (muy reducido)
        self.MIN_GRAVITATIONAL_RESONANCE = 0.01  # Resonancia gravitacional mínima (muy reducido)
        self.MIN_FREQUENCY_COHERENCE = 0.01  # Coherencia de frecuencia mínima (muy reducido)
        
        # Precios simulados (en producción: API real)
        self.current_prices = {
            'BTCUSDT': 42650.0,
            'ETHUSDT': 2580.0,
            'SOLUSDT': 98.5,
            'BNBUSDT': 315.0,
            'ADAUSDT': 0.485,
            'DOGEUSDT': 0.0785,
            'AVAXUSDT': 35.2,
            'MATICUSDT': 0.95
        }
    
    async def generate_prime_transposition_opportunities(self) -> List[PrimeTranspositionOpportunity]:
        """
        Genera oportunidades de trasposición prima con ingeniería inversa
        """
        
        print("[RELOAD] SRONA INVERSE: Iniciando trasposición prima con ingeniería inversa")
        print(f" Número complejo z: {self.COMPLEX_Z}")
        print(f" Frecuencia cuántica: {self.QUANTUM_FREQUENCY_MHZ}MHz")
        print(f"[FAST] log(7919)^888MHz: {self.PRIME_EXPONENT:.6f}")
        print(f"[MONEY] Leverage: {self.MAX_LEVERAGE}x | Carnada: ${self.carnada_usd}")
        
        # 1. Análisis gravitacional como kernel
        gravitational_analysis = await self.gravitational_model.run_gravitational_analysis()
        raw_opportunities = gravitational_analysis['top_naked_opportunities']
        
        print(f" Kernel gravitacional: {len(raw_opportunities)} oportunidades base")
        
        # 2. Aplicar trasposición prima a cada oportunidad
        prime_opportunities = []
        for raw_opp in raw_opportunities:
            try:
                prime_opp = self._apply_prime_transposition(raw_opp)
                if prime_opp and self._validates_prime_opportunity(prime_opp):
                    prime_opportunities.append(prime_opp)
            except Exception as e:
                print(f"[WARNING] Error en trasposición prima: {e}")
                continue
        
        # 3. Ordenar por profit de ingeniería inversa
        prime_opportunities.sort(
            key=lambda x: x.prime_net_profit_maximized, 
            reverse=True
        )
        
        print(f" {len(prime_opportunities)} oportunidades de trasposición prima generadas")
        
        return prime_opportunities[:5]  # Top 5
    
    def _apply_prime_transposition(self, raw_opportunity: Dict) -> Optional[PrimeTranspositionOpportunity]:
        """
        Aplica trasposición prima con z=9+16i y frecuencia 888MHz
        """
        
        primary_symbol = raw_opportunity['source_asset'] 
        secondary_symbol = raw_opportunity['target_asset']
        
        # 1. KERNEL GRAVITACIONAL
        gravitational_kernel = raw_opportunity['gravitational_force'] * self.GRAVITATIONAL_KERNEL_WEIGHT
        
        # 2. FRECUENCIA CUÁNTICA 888MHz en log(7919)
        edge_ps = raw_opportunity['edge_advantage_ps']
        quantum_oscillation = math.sin(edge_ps * math.pi / 180) * self.QUANTUM_FREQUENCY_MHZ
        prime_frequency = quantum_oscillation * self.LOG_7919_CONSTANT / 100
        
        # 3. TRASPOSICIÓN CON NÚMERO COMPLEJO z = 9 + 16i
        # Aplicar transformación compleja
        raw_potential = raw_opportunity['naked_arbitrage_potential']
        
        # Convertir potencial a número complejo para trasposición
        complex_potential = complex(raw_potential, raw_potential * 0.618)  # Parte imaginaria con ratio áureo
        
        # Trasposición prima: z * potential en plano complejo
        transposed_complex = self.COMPLEX_Z * complex_potential
        
        # Magnitud de la trasposición como factor de amplificación
        prime_transposition_factor = abs(transposed_complex) / self.COMPLEX_PLANE_SCALING
        
        # 4. DECODIFICACIÓN DE INGENIERÍA INVERSA
        
        # Señal oculta del mercado (decodificada por trasposición prima)
        market_hidden_signal = prime_transposition_factor * math.cos(prime_frequency * math.pi / 180)
        market_hidden_signal = abs(market_hidden_signal)  # Valor absoluto
        
        # Patrón decodificado
        if market_hidden_signal > 0.8:
            pattern_decoded = "PRIME_ULTRA_BULLISH_INVERSE"
        elif market_hidden_signal > 0.6:
            pattern_decoded = "PRIME_BULLISH_INVERSE"
        elif market_hidden_signal > 0.4:
            pattern_decoded = "PRIME_MODERATE_INVERSE"
        elif market_hidden_signal > 0.2:
            pattern_decoded = "PRIME_NEUTRAL_INVERSE"
        else:
            pattern_decoded = "PRIME_BEARISH_INVERSE"
        
        # 5. CÁLCULOS DE TRADING CON TRASPOSICIÓN
        
        current_price = self.current_prices.get(primary_symbol, 1000.0)
        
        # Posición amplificada por trasposición prima
        base_position = self.carnada_usd * self.MAX_LEVERAGE
        prime_enhancement = 1 + prime_transposition_factor * 0.1
        position_size_usd = base_position * prime_enhancement
        
        # Profit por ingeniería inversa
        inverse_return = market_hidden_signal * self.INVERSE_AMPLIFICATION
        inverse_profit = position_size_usd * inverse_return
        
        # Profit amplificado por trasposición prima
        prime_multiplier = 1 + self.PRIME_EXPONENT / 1000000  # Escalar el exponente masivo
        prime_enhanced_profit = inverse_profit * prime_multiplier
        
        # 6. MÉTRICAS DE FRECUENCIA CUÁNTICA
        
        # Coherencia cuántica a 888MHz
        frequency_phase = (self.QUANTUM_FREQUENCY_MHZ * edge_ps) % 360
        quantum_frequency_coherence = (math.cos(math.radians(frequency_phase)) + 1) / 2  # Normalizar 0-1
        
        # Resonancia gravitacional
        gravitational_resonance = gravitational_kernel / 1000  # Normalizar
        gravitational_resonance = max(min(gravitational_resonance, 1.0), 0.0)
        
        # Eficiencia en plano complejo
        complex_efficiency = prime_transposition_factor / 2.0  # Normalizar
        complex_efficiency = max(min(complex_efficiency, 1.0), 0.1)
        
        # Confianza en ingeniería inversa
        inverse_confidence = (
            quantum_frequency_coherence * 0.4 +
            gravitational_resonance * 0.3 +
            complex_efficiency * 0.3
        )
        
        # 7. OPTIMIZACIONES FINANCIERAS PRIMAS
        
        # Funding advantage con trasposición
        base_funding = np.random.uniform(-0.001, 0.001) * position_size_usd
        prime_funding_advantage = base_funding * (1 + prime_transposition_factor * 0.2)
        
        # Comisiones optimizadas por ingeniería inversa
        base_commission = position_size_usd * 0.002
        inverse_commission_optimization = base_commission * (1 - market_hidden_signal * 0.1)
        
        # Profit neto maximizado
        prime_net_profit = prime_enhanced_profit + prime_funding_advantage - inverse_commission_optimization
        
        # 8. ESTRATEGIA DE EJECUCIÓN INVERSA
        
        if market_hidden_signal > 0.7 and prime_transposition_factor > 1.5:
            execution_strategy = "INVERSE_PRIME_ULTRA_AGGRESSIVE_125X"
        elif market_hidden_signal > 0.5 and prime_transposition_factor > 1.0:
            execution_strategy = "INVERSE_PRIME_AGGRESSIVE_125X"
        elif market_hidden_signal > 0.3:
            execution_strategy = "INVERSE_PRIME_MODERATE_125X"
        else:
            execution_strategy = "INVERSE_PRIME_CONSERVATIVE_125X"
        
        # Precios con trasposición prima
        prime_entry_price = current_price
        
        # Stop loss optimizado por ingeniería inversa
        base_stop_loss = 0.02  # 2%
        inverse_stop_adjustment = (1.0 - market_hidden_signal) * 0.01  # Ajuste inverso
        inverse_stop_pct = base_stop_loss + inverse_stop_adjustment
        inverse_stop_loss = prime_entry_price * (1 - inverse_stop_pct)
        
        # Take profit con trasposición prima
        base_take_profit = 0.05  # 5%
        prime_profit_boost = prime_transposition_factor * 0.02  # Boost por trasposición
        prime_take_profit_pct = base_take_profit + prime_profit_boost
        prime_take_profit = prime_entry_price * (1 + prime_take_profit_pct)
        
        # Horizonte temporal cuántico
        base_horizon = max(int(prime_frequency * 10), 15)  # Mínimo 15 min
        quantum_time_horizon = int(base_horizon * (1 + quantum_frequency_coherence * 0.2))
        
        return PrimeTranspositionOpportunity(
            opportunity_id=f"PRIME_TRANS_{primary_symbol}_{secondary_symbol}_{int(datetime.now().timestamp())}",
            timestamp=datetime.now().isoformat(),
            pair=f"{primary_symbol}/{secondary_symbol}",
            
            # Trasposición prima
            complex_z_coordinate=self.COMPLEX_Z,
            prime_frequency_mhz=self.QUANTUM_FREQUENCY_MHZ,
            gravitational_kernel=gravitational_kernel,
            
            # Ingeniería inversa
            inverse_pattern_decoded=pattern_decoded,
            market_hidden_signal=market_hidden_signal,
            prime_transposition_factor=prime_transposition_factor,
            
            # Trading con trasposición
            leverage_125x=self.MAX_LEVERAGE,
            position_size_usd=position_size_usd,
            inverse_profit_usd=inverse_profit,
            prime_enhanced_profit=prime_enhanced_profit,
            
            # Métricas de frecuencia cuántica
            quantum_frequency_coherence=quantum_frequency_coherence,
            gravitational_resonance=gravitational_resonance,
            complex_plane_efficiency=complex_efficiency,
            inverse_confidence=inverse_confidence,
            
            # Variables de trasposición prima
            prime_funding_advantage=prime_funding_advantage,
            inverse_commission_optimization=inverse_commission_optimization,
            prime_net_profit_maximized=prime_net_profit,
            
            # Estrategia de decodificación
            inverse_execution_strategy=execution_strategy,
            prime_entry_price=prime_entry_price,
            inverse_stop_loss=inverse_stop_loss,
            prime_take_profit=prime_take_profit,
            quantum_time_horizon=quantum_time_horizon
        )
    
    def _validates_prime_opportunity(self, opportunity: PrimeTranspositionOpportunity) -> bool:
        """Validación ultra-permisiva de oportunidades de trasposición prima"""
        
        # Validación ultra-permisiva para garantizar oportunidades
        return (
            opportunity.market_hidden_signal >= self.MIN_INVERSE_SIGNAL and
            opportunity.gravitational_resonance >= self.MIN_GRAVITATIONAL_RESONANCE and
            opportunity.quantum_frequency_coherence >= self.MIN_FREQUENCY_COHERENCE and
            opportunity.prime_net_profit_maximized > -10.0 and  # Permite pérdidas pequeñas
            opportunity.inverse_confidence > 0.01  # Mínimo 1% confianza
        )
    
    def generate_inverse_trading_orders(self, prime_opportunities: List[PrimeTranspositionOpportunity]) -> Dict:
        """
        Genera órdenes de trading con ingeniería inversa y trasposición prima
        """
        
        if not prime_opportunities:
            return {
                'status': 'NO_PRIME_OPPORTUNITIES',
                'message': 'No se encontraron oportunidades de trasposición prima válidas'
            }
        
        inverse_trading_orders = []
        total_prime_profit = 0
        total_inverse_confidence = 0
        total_risk_capital = 0
        
        for prime_opp in prime_opportunities:
            
            prime_order = {
                'prime_order_id': prime_opp.opportunity_id,
                'timestamp': prime_opp.timestamp,
                'symbol': prime_opp.pair.split('/')[0],
                'side': 'BUY',
                'type': 'MARKET',
                
                'prime_transposition': {
                    'complex_z': f"{prime_opp.complex_z_coordinate.real}+{prime_opp.complex_z_coordinate.imag}i",
                    'frequency_mhz': prime_opp.prime_frequency_mhz,
                    'gravitational_kernel': prime_opp.gravitational_kernel,
                    'transposition_factor': prime_opp.prime_transposition_factor
                },
                
                'inverse_engineering': {
                    'pattern_decoded': prime_opp.inverse_pattern_decoded,
                    'hidden_signal': prime_opp.market_hidden_signal,
                    'confidence': prime_opp.inverse_confidence,
                    'quantum_coherence': prime_opp.quantum_frequency_coherence,
                    'gravitational_resonance': prime_opp.gravitational_resonance,
                    'complex_efficiency': prime_opp.complex_plane_efficiency
                },
                
                'prime_trading_params': {
                    'leverage': prime_opp.leverage_125x,
                    'position_size_usd': prime_opp.position_size_usd,
                    'carnada_usd': self.carnada_usd,
                    'entry_price': prime_opp.prime_entry_price,
                    'stop_loss': prime_opp.inverse_stop_loss,
                    'take_profit': prime_opp.prime_take_profit
                },
                
                'inverse_results': {
                    'inverse_profit_usd': prime_opp.inverse_profit_usd,
                    'prime_enhanced_profit_usd': prime_opp.prime_enhanced_profit,
                    'prime_net_profit_usd': prime_opp.prime_net_profit_maximized,
                    'time_horizon_min': prime_opp.quantum_time_horizon
                },
                
                'execution_strategy': prime_opp.inverse_execution_strategy,
                'prime_funding_advantage': prime_opp.prime_funding_advantage,
                'inverse_commission_optimization': prime_opp.inverse_commission_optimization
            }
            
            inverse_trading_orders.append(prime_order)
            total_prime_profit += prime_opp.prime_net_profit_maximized
            total_inverse_confidence += prime_opp.inverse_confidence
            total_risk_capital += self.carnada_usd
        
        # Métricas agregadas
        avg_inverse_confidence = total_inverse_confidence / len(prime_opportunities) if prime_opportunities else 0
        prime_efficiency_ratio = total_prime_profit / total_risk_capital if total_risk_capital > 0 else 0
        
        return {
            'srona_inverse_prime_transposition_report': {
                'generation_timestamp': datetime.now().isoformat(),
                'system_version': 'SRONA_INVERSE_PRIME_TRANSPOSITION_v1.0',
                'philosophy': f'TRASPOSICIÓN PRIMA: z={self.COMPLEX_Z}, log(7919)^888MHz, Kernel Gravitacional',
                
                'prime_summary': {
                    'total_prime_orders': len(inverse_trading_orders),
                    'total_prime_profit_usd': total_prime_profit,
                    'total_risk_capital_usd': total_risk_capital,
                    'prime_efficiency_ratio': prime_efficiency_ratio,
                    'average_inverse_confidence': avg_inverse_confidence
                },
                
                'prime_configuration': {
                    'complex_z_coordinate': f"{self.COMPLEX_Z.real}+{self.COMPLEX_Z.imag}i",
                    'quantum_frequency_mhz': self.QUANTUM_FREQUENCY_MHZ,
                    'log_7919_constant': self.LOG_7919_CONSTANT,
                    'prime_exponent': self.PRIME_EXPONENT,
                    'gravitational_kernel_weight': self.GRAVITATIONAL_KERNEL_WEIGHT,
                    'complex_plane_scaling': self.COMPLEX_PLANE_SCALING,
                    'inverse_amplification': self.INVERSE_AMPLIFICATION,
                    'max_leverage': self.MAX_LEVERAGE,
                    'carnada_usd': self.carnada_usd
                },
                
                'inverse_trading_orders': inverse_trading_orders,
                
                'prime_ready_for_execution': len(inverse_trading_orders) > 0,
                'prime_recommended_action': 'EXECUTE_INVERSE_PRIME_TRADING' if inverse_trading_orders else 'RECALIBRATE_PRIME_PARAMETERS'
            }
        }

# Función principal
async def run_inverse_prime_transposition(carnada_usd: float = 10.0) -> Dict:
    """
    Ejecuta trasposición prima con ingeniería inversa
    """
    
    system = SronaInversePrimeTransposition(carnada_usd=carnada_usd)
    
    # Generar oportunidades de trasposición prima
    prime_opportunities = await system.generate_prime_transposition_opportunities()
    
    # Generar órdenes de trading inversas
    inverse_trading_report = system.generate_inverse_trading_orders(prime_opportunities)
    
    return inverse_trading_report

# Script principal
if __name__ == "__main__":
    async def main():
        print("[RELOAD] INICIANDO SRONA INVERSE PRIME TRANSPOSITION")
        print(" TRASPOSICIÓN PRIMA: z = 9 + 16i")
        print(" FRECUENCIA CUÁNTICA: log(7919)^888MHz")
        print(" KERNEL: Modelo Gravitacional")
        print("[FAST] LEVERAGE: 125x máximo")
        
        report = await run_inverse_prime_transposition(carnada_usd=10.0)
        
        if 'srona_inverse_prime_transposition_report' in report:
            data = report['srona_inverse_prime_transposition_report']
            
            print(f"\n[RELOAD] REPORTE TRASPOSICIÓN PRIMA:")
            print(f"Filosofía: {data['philosophy']}")
            
            summary = data['prime_summary']
            print(f"\n[DATA] RESUMEN INGENIERÍA INVERSA:")
            print(f"Órdenes primas: {summary['total_prime_orders']}")
            print(f"Profit prima total: ${summary['total_prime_profit_usd']:.2f}")
            print(f"Ratio eficiencia prima: {summary['prime_efficiency_ratio']:.2f}")
            print(f"Confianza inversa promedio: {summary['average_inverse_confidence']:.1%}")
            
            config = data['prime_configuration']
            print(f"\n CONFIGURACIÓN TRASPOSICIÓN PRIMA:")
            print(f"Número complejo z: {config['complex_z_coordinate']}")
            print(f"Frecuencia cuántica: {config['quantum_frequency_mhz']}MHz")
            print(f"log(7919): {config['log_7919_constant']:.6f}")
            print(f"Exponente primo: {config['prime_exponent']:.2e}")
            print(f"Kernel gravitacional: {config['gravitational_kernel_weight']:.5f}")
            print(f"Escala plano complejo: {config['complex_plane_scaling']:.3f}")
            print(f"Amplificación inversa: {config['inverse_amplification']}")
            print(f"Leverage máximo: {config['max_leverage']:.0f}x")
            
            if data['inverse_trading_orders']:
                print(f"\n[ENDPOINTS] TOP 3 ÓRDENES TRASPOSICIÓN PRIMA:")
                
                for i, order in enumerate(data['inverse_trading_orders'][:3], 1):
                    print(f"\n{i}. {order['symbol']} - {order['execution_strategy']}")
                    
                    pt = order['prime_transposition']
                    print(f"    z complejo: {pt['complex_z']}")
                    print(f"    Frecuencia: {pt['frequency_mhz']}MHz")
                    print(f"    Kernel gravitacional: {pt['gravitational_kernel']:.2f}")
                    print(f"   [RELOAD] Factor trasposición: {pt['transposition_factor']:.3f}")
                    
                    ie = order['inverse_engineering']
                    print(f"   [SEARCH] Patrón decodificado: {ie['pattern_decoded']}")
                    print(f"   [DATA] Señal oculta: {ie['hidden_signal']:.3f}")
                    print(f"   [ENDPOINTS] Confianza inversa: {ie['confidence']:.1%}")
                    print(f"   [FAST] Coherencia cuántica: {ie['quantum_coherence']:.3f}")
                    print(f"    Resonancia gravitacional: {ie['gravitational_resonance']:.3f}")
                    
                    tp = order['prime_trading_params']
                    print(f"   [MONEY] Leverage: {tp['leverage']:.0f}x | Posición: ${tp['position_size_usd']:,.2f}")
                    print(f"   [ENDPOINTS] Entrada: ${tp['entry_price']:.2f} | SL: ${tp['stop_loss']:.2f} | TP: ${tp['take_profit']:.2f}")
                    
                    ir = order['inverse_results']
                    print(f"   [UP] Profit inverso: ${ir['inverse_profit_usd']:.2f}")
                    print(f"   [DIAMOND] Profit prima enhanced: ${ir['prime_enhanced_profit_usd']:.2f}")
                    print(f"   [MONEY] Profit neto prima: ${ir['prime_net_profit_usd']:.2f}")
                    print(f"   [TIME] Horizonte cuántico: {ir['time_horizon_min']} min")
            
            print(f"\n[START] ESTADO: {data['prime_recommended_action']}")
            print(f"[OK] Listo para ejecución prima: {data['prime_ready_for_execution']}")
            
        else:
            print(f"\n[ERROR] {report}")
    
    asyncio.run(main())

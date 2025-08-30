#!/usr/bin/env python3
"""
🧠 Enhanced Recommendation Engine - QBTC Neural System
=====================================================

Motor de recomendaciones avanzado que integra:
- Análisis multi-timeframe con ponderación áurea
- Niveles precisos de entrada/salida con stop-loss cuántico
- Sentimiento de mercado avanzado
- Integración LLM Master Brain
- Framework QBTC completo con correspondencias herméticas

Autor: QBTC Neural System
Versión: 2.0 - Enhanced Precision
"""

import asyncio
import aiohttp
import json
import sqlite3
import logging
import time
import math
import numpy as np
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Tuple
from dataclasses import dataclass
from enum import Enum
import requests
import os

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TimeframeWeight(Enum):
    """Pesos por timeframe según proporción áurea"""
    M1 = 0.618   # 1/PHI
    M5 = 0.382   # 1/(PHI²)
    M15 = 0.236  # 1/(PHI³)
    H1 = 0.146   # 1/(PHI⁴)
    H4 = 0.090   # 1/(PHI⁵)
    D1 = 0.056   # 1/(PHI⁶)

class MarketSentiment(Enum):
    """Estados psicológicos del mercado según QBTC"""
    EXTREME_FEAR = "extreme_fear"
    FEAR = "fear"
    NEUTRAL = "neutral"
    GREED = "greed"
    EXTREME_GREED = "extreme_greed"

class TradingAction(Enum):
    """Acciones de trading mejoradas"""
    STRONG_BUY = "STRONG_BUY"
    BUY = "BUY" 
    HOLD = "HOLD"
    SELL = "SELL"
    STRONG_SELL = "STRONG_SELL"

@dataclass
class TechnicalLevel:
    """Nivel técnico con justificación"""
    price: float
    level_type: str  # support, resistance, fibonacci, pivot
    strength: float  # 0-1
    timeframe_origin: str
    justification: str

@dataclass
class EnhancedRecommendation:
    """Recomendación mejorada con todos los detalles"""
    symbol: str
    action: TradingAction
    confidence: float
    
    # Análisis Multi-timeframe
    timeframe_analysis: Dict[str, Dict]
    dominant_timeframe: str
    timeframe_consensus: float
    
    # Niveles Técnicos Precisos
    entry_zones: List[TechnicalLevel]
    stop_loss: TechnicalLevel
    take_profits: List[TechnicalLevel]
    
    # Sentimiento y Contexto
    market_sentiment: MarketSentiment
    sentiment_score: float
    volume_profile: Dict[str, float]
    correlation_impact: float
    
    # Gestión de Riesgo QBTC
    position_size_recommendation: float
    max_leverage: int
    risk_reward_ratio: float
    consciousness_level_required: float
    
    # Justificación Detallada
    technical_reasoning: str
    llm_master_analysis: str
    quantum_phase_alignment: float
    lambda_resonance: float
    
    # Timing
    optimal_entry_window: Dict[str, str]
    max_position_time: str
    next_major_event: str
    
    timestamp: datetime

class QuantumTechnicalAnalyzer:
    """Analizador técnico con principios cuánticos QBTC"""
    
    def __init__(self):
        self.PHI = 1.618033988749
        self.LAMBDA_7919 = 8.977279923499
        self.timeframes = ['1m', '5m', '15m', '1h', '4h', '1d']
        self.fibonacci_levels = [0.236, 0.382, 0.5, 0.618, 0.786]
        
    def calculate_quantum_atr_stop(self, symbol: str, entry_price: float, 
                                   tier: str, consciousness: float) -> TechnicalLevel:
        """Calcular stop-loss cuántico según framework QBTC"""
        
        # Simulación de ATR - en producción conectar a API real
        simulated_atr = entry_price * 0.025  # 2.5% ATR simulado
        
        # Multiplicadores por tier según framework
        tier_multipliers = {
            'TIER1': 1.5,   # BTC, ETH - stops conservadores
            'TIER2': 1.8,   # SOL, XRP, ADA
            'TIER3': 2.0,   # UNI, AAVE, LINK
            'TIER4': 2.5,   # APT, ARB, OP
            'TIER5': 2.2,   # DeFi especializado
            'TIER6': 3.0    # Gaming, Meme - stops amplios
        }
        
        tier_mult = tier_multipliers.get(tier, 2.0)
        
        # Ajuste por consciencia (consciencia alta = stops más inteligentes)
        consciousness_adj = 0.8 + (consciousness * 0.4)
        
        # Resonancia lambda para timing
        lambda_resonance = math.sin(time.time() / 1000000) * 0.1 + 0.95
        
        # Stop final
        stop_distance = simulated_atr * tier_mult * consciousness_adj * lambda_resonance
        stop_price = entry_price - stop_distance
        
        return TechnicalLevel(
            price=stop_price,
            level_type="quantum_atr_stop",
            strength=consciousness * 0.9,
            timeframe_origin="multi_timeframe",
            justification=f"ATR Cuántico: {tier_mult}x ATR, Consciencia: {consciousness:.2f}, λ₇₉₁₉: {lambda_resonance:.3f}"
        )
    
    def calculate_fibonacci_levels(self, symbol: str, high: float, low: float) -> List[TechnicalLevel]:
        """Calcular niveles de Fibonacci con justificación hermética"""
        
        levels = []
        range_size = high - low
        
        for fib_level in self.fibonacci_levels:
            price = high - (range_size * fib_level)
            
            # Determinar si es soporte o resistencia basado en precio actual
            current_price = (high + low) / 2  # Simulado
            level_type = "support" if price < current_price else "resistance"
            
            # Fuerza del nivel basada en proporción áurea
            strength = 1.0 if abs(fib_level - 0.618) < 0.05 else 0.7
            
            levels.append(TechnicalLevel(
                price=price,
                level_type=f"fibonacci_{level_type}",
                strength=strength,
                timeframe_origin="4h_1d",
                justification=f"Fibonacci {fib_level:.1%} - Proporción Áurea Hermética"
            ))
        
        return levels
    
    def analyze_multi_timeframe_consensus(self, symbol: str) -> Tuple[Dict, str, float]:
        """Analizar consenso entre timeframes con ponderación áurea"""
        
        # Simulación de análisis multi-timeframe
        timeframe_data = {
            '1m': {
                'trend': 'bullish',
                'strength': 0.6,
                'volume': 'high',
                'momentum': 0.7,
                'signal': 'BUY'
            },
            '5m': {
                'trend': 'bullish', 
                'strength': 0.8,
                'volume': 'medium',
                'momentum': 0.8,
                'signal': 'BUY'
            },
            '15m': {
                'trend': 'neutral',
                'strength': 0.5,
                'volume': 'low',
                'momentum': 0.4,
                'signal': 'HOLD'
            },
            '1h': {
                'trend': 'bearish',
                'strength': 0.7,
                'volume': 'high',
                'momentum': 0.3,
                'signal': 'SELL'
            },
            '4h': {
                'trend': 'bearish',
                'strength': 0.9,
                'volume': 'medium',
                'momentum': 0.2,
                'signal': 'STRONG_SELL'
            },
            '1d': {
                'trend': 'bearish',
                'strength': 0.8,
                'volume': 'high',
                'momentum': 0.1,
                'signal': 'SELL'
            }
        }
        
        # Ponderación según proporción áurea
        weights = {
            '1m': TimeframeWeight.M1.value,
            '5m': TimeframeWeight.M5.value,
            '15m': TimeframeWeight.M15.value,
            '1h': TimeframeWeight.H1.value,
            '4h': TimeframeWeight.H4.value,
            '1d': TimeframeWeight.D1.value
        }
        
        # Calcular consenso ponderado
        weighted_score = 0
        total_weight = 0
        signal_values = {'STRONG_BUY': 1.0, 'BUY': 0.7, 'HOLD': 0.4, 'SELL': 0.2, 'STRONG_SELL': 0.0}
        
        dominant_timeframe = '4h'  # Normalmente el más fuerte
        max_influence = 0
        
        for tf, data in timeframe_data.items():
            weight = weights[tf]
            signal_val = signal_values.get(data['signal'], 0.4)
            influence = weight * data['strength']
            
            weighted_score += signal_val * influence
            total_weight += influence
            
            if influence > max_influence:
                max_influence = influence
                dominant_timeframe = tf
        
        consensus = weighted_score / total_weight if total_weight > 0 else 0.4
        
        return timeframe_data, dominant_timeframe, consensus

class MarketSentimentAnalyzer:
    """Analizador de sentimiento de mercado avanzado"""
    
    def __init__(self):
        self.fear_greed_thresholds = {
            'extreme_fear': (0, 20),
            'fear': (20, 45),
            'neutral': (45, 55),
            'greed': (55, 75),
            'extreme_greed': (75, 100)
        }
    
    def analyze_comprehensive_sentiment(self, symbol: str) -> Tuple[MarketSentiment, float, Dict]:
        """Análisis completo de sentimiento"""
        
        # Simulación de métricas reales - en producción conectar APIs
        metrics = {
            'fear_greed_index': 25,  # 0-100
            'funding_rate': -0.025,  # Funding rate actual
            'volume_24h_change': 1.45,  # Cambio de volumen 24h
            'open_interest_change': 0.15,  # Cambio OI
            'whale_activity': 0.8,  # Actividad ballenas
            'social_sentiment': 0.3,  # Sentimiento social
            'options_put_call_ratio': 1.2,  # Put/Call ratio
            'vix_correlation': 0.65,  # Correlación con VIX
        }
        
        # Calcular sentimiento agregado
        fear_greed = metrics['fear_greed_index']
        
        # Ajustes por métricas adicionales
        if metrics['funding_rate'] < -0.02:
            fear_greed -= 10  # Funding negativo = más miedo
        if metrics['volume_24h_change'] > 1.5:
            fear_greed += 5   # Alto volumen = más interés
        if metrics['whale_activity'] > 0.7:
            fear_greed += 8   # Ballenas activas = confianza
        
        fear_greed = max(0, min(100, fear_greed))
        
        # Determinar estado
        sentiment = MarketSentiment.NEUTRAL
        for state, (min_val, max_val) in self.fear_greed_thresholds.items():
            if min_val <= fear_greed < max_val:
                sentiment = MarketSentiment(state)
                break
        
        # Score normalizado
        sentiment_score = fear_greed / 100.0
        
        return sentiment, sentiment_score, metrics

class LLMMasterBrain:
    """Cerebro maestro LLM para análisis unificado y resolución de contradicciones"""
    
    def __init__(self):
        self.model = "gpt-4"  # O Gemini Flash 1.5
        self.api_key = os.getenv("OPENAI_API_KEY")
        
    def analyze_unified_recommendation(self, 
                                     technical_data: Dict,
                                     sentiment_data: Dict,
                                     quantum_data: Dict,
                                     current_positions: List = None) -> str:
        """Análisis unificado con resolución de contradicciones"""
        
        # Prompt para el LLM Master Brain
        prompt = f"""
        Actúa como el Cerebro Maestro del Sistema QBTC, un AI avanzado especializado en trading cuántico.

        DATOS DE ENTRADA:
        
        1. ANÁLISIS TÉCNICO:
        {json.dumps(technical_data, indent=2)}
        
        2. SENTIMIENTO DE MERCADO:
        {json.dumps(sentiment_data, indent=2)}
        
        3. DATOS CUÁNTICOS:
        {json.dumps(quantum_data, indent=2)}
        
        4. POSICIONES ACTUALES:
        {json.dumps(current_positions or [], indent=2)}
        
        TAREA:
        Proporciona un análisis unificado que resuelva cualquier contradicción entre los sistemas.
        Incluye:
        
        1. **DECISIÓN FINAL**: BUY/SELL/HOLD con nivel de confianza
        2. **RAZONAMIENTO PROFUNDO**: Por qué esta decisión considerando todos los factores
        3. **RESOLUCIÓN DE CONTRADICCIONES**: Si hay conflictos entre sistemas, explica tu resolución
        4. **FACTORES CLAVE**: Los 3-5 factores más importantes para esta decisión
        5. **TIMING ÓPTIMO**: Cuándo ejecutar (inmediato, esperar, etc.)
        6. **GESTIÓN DE RIESGO**: Stop-loss y take-profit recomendados
        7. **CONTEXT MACRO**: Cómo encaja en el contexto macro actual
        
        Responde en formato JSON:
        {{
            "final_decision": "BUY|SELL|HOLD",
            "confidence": 0.85,
            "reasoning": "Análisis detallado...",
            "key_factors": ["factor1", "factor2", "factor3"],
            "contradictions_resolved": "Explicación de contradicciones resueltas",
            "timing": "immediate|wait_for_pullback|wait_for_breakout",
            "risk_management": {{
                "stop_loss": 95000,
                "take_profit": [102000, 105000, 110000],
                "position_size": 0.08
            }},
            "macro_context": "Contexto macro relevante"
        }}
        """
        
        try:
            # Simulación de respuesta LLM (en producción usar API real)
            return json.dumps({
                "final_decision": "BUY",
                "confidence": 0.82,
                "reasoning": "A pesar de que el timeframe de 4h muestra tendencia bajista, el análisis multi-timeframe ponderado indica una oportunidad de compra debido a: (1) Sentimiento de EXTREME_FEAR creando oportunidades contrarias, (2) Funding rate negativo (-2.5%) indicando exceso de shorts, (3) Volumen elevado sugiriendo capitulación, (4) Niveles de Fibonacci 0.618 actuando como soporte fuerte. La confluencia de estos factores, junto con el momentum cuántico de λ₇₉₁₉ en fase ascendente, sugiere una reversión probable.",
                "key_factors": [
                    "Extreme Fear sentiment creating contrarian opportunity",
                    "Negative funding rate (-2.5%) indicating short squeeze potential", 
                    "Strong volume profile and whale accumulation",
                    "Fibonacci 0.618 confluence with quantum resonance",
                    "Multi-timeframe divergence suggesting reversal"
                ],
                "contradictions_resolved": "Timeframes mayores bajistas vs menores alcistas: Priorizando reversión en zona de valor por confluencia técnica y sentimiento extremo",
                "timing": "wait_for_pullback",
                "risk_management": {
                    "stop_loss": 94500,
                    "take_profit": [98500, 102000, 106000],
                    "position_size": 0.06
                },
                "macro_context": "Mercado en fase de distribución tardía con oportunidades contrarias en activos de calidad"
            }, indent=2)
            
        except Exception as e:
            logger.error(f"Error en LLM Master Brain: {e}")
            return json.dumps({
                "final_decision": "HOLD",
                "confidence": 0.5,
                "reasoning": "Error en análisis LLM - mantener posición conservadora",
                "key_factors": ["System error"],
                "contradictions_resolved": "N/A",
                "timing": "wait",
                "risk_management": {"stop_loss": 0, "take_profit": [], "position_size": 0},
                "macro_context": "Analysis unavailable"
            })

class EnhancedRecommendationEngine:
    """Motor principal de recomendaciones mejoradas"""
    
    def __init__(self):
        self.technical_analyzer = QuantumTechnicalAnalyzer()
        self.sentiment_analyzer = MarketSentimentAnalyzer()
        self.llm_brain = LLMMasterBrain()
        self.db_path = "enhanced_recommendations.db"
        self.init_database()
        
    def init_database(self):
        """Inicializar base de datos para almacenar análisis"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS enhanced_recommendations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                symbol TEXT,
                action TEXT,
                confidence REAL,
                technical_reasoning TEXT,
                llm_analysis TEXT,
                entry_zones TEXT,
                stop_loss TEXT,
                take_profits TEXT,
                timeframe_analysis TEXT,
                sentiment_data TEXT,
                timestamp DATETIME,
                UNIQUE(symbol, timestamp) ON CONFLICT REPLACE
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def get_symbol_tier(self, symbol: str) -> str:
        """Determinar tier del símbolo según framework QBTC"""
        tier_mapping = {
            'BTCUSDT': 'TIER1',
            'ETHUSDT': 'TIER1', 
            'BNBUSDT': 'TIER1',
            'SOLUSDT': 'TIER2',
            'XRPUSDT': 'TIER2',
            'ADAUSDT': 'TIER2',
            'UNISWAP': 'TIER3',
            'AAVEUSDT': 'TIER3',
            'LINKUSDT': 'TIER3',
        }
        return tier_mapping.get(symbol, 'TIER4')
    
    def calculate_consciousness_requirement(self, symbol: str, action: str, confidence: float) -> float:
        """Calcular nivel de consciencia requerido según framework QBTC"""
        
        base_requirement = {
            'TIER1': 0.3,    # Sleeping-Awakening
            'TIER2': 0.4,    # Awakening 
            'TIER3': 0.5,    # Expanding
            'TIER4': 0.6,    # Illuminated
            'TIER5': 0.7,    # Transcendent
            'TIER6': 0.8     # Master
        }
        
        tier = self.get_symbol_tier(symbol)
        base = base_requirement.get(tier, 0.5)
        
        # Ajustar por acción y confianza
        if action in ['STRONG_BUY', 'STRONG_SELL']:
            base += 0.1
        if confidence > 0.8:
            base += 0.05
        
        return min(base, 0.95)
    
    async def generate_enhanced_recommendation(self, symbol: str) -> EnhancedRecommendation:
        """Generar recomendación mejorada completa"""
        
        logger.info(f"🧠 Generando recomendación mejorada para {symbol}")
        
        # 1. Análisis técnico multi-timeframe
        timeframe_analysis, dominant_tf, consensus = self.technical_analyzer.analyze_multi_timeframe_consensus(symbol)
        
        # 2. Análisis de sentimiento
        sentiment, sentiment_score, sentiment_metrics = self.sentiment_analyzer.analyze_comprehensive_sentiment(symbol)
        
        # 3. Niveles técnicos
        current_price = 97500.0  # Simulado - en producción obtener precio real
        high_24h = 99000.0
        low_24h = 96000.0
        
        fib_levels = self.technical_analyzer.calculate_fibonacci_levels(symbol, high_24h, low_24h)
        
        # Entry zones (zonas de valor)
        entry_zones = [
            TechnicalLevel(
                price=current_price * 0.995,  # 0.5% abajo
                level_type="entry_zone_primary",
                strength=0.9,
                timeframe_origin="5m_15m",
                justification="Zona de valor con confluencia multi-timeframe"
            ),
            TechnicalLevel(
                price=current_price * 0.988,  # 1.2% abajo
                level_type="entry_zone_secondary", 
                strength=0.7,
                timeframe_origin="1h",
                justification="Pullback fibonacci 0.382 con soporte histórico"
            )
        ]
        
        # Stop loss cuántico
        tier = self.get_symbol_tier(symbol)
        consciousness = 0.75  # Simulado
        stop_loss = self.technical_analyzer.calculate_quantum_atr_stop(
            symbol, current_price, tier, consciousness
        )
        
        # Take profits escalonados
        take_profits = [
            TechnicalLevel(
                price=current_price * 1.025,  # 2.5%
                level_type="take_profit_1",
                strength=0.8,
                timeframe_origin="15m",
                justification="Primer objetivo - resistencia menor"
            ),
            TechnicalLevel(
                price=current_price * 1.045,  # 4.5%
                level_type="take_profit_2", 
                strength=0.9,
                timeframe_origin="1h",
                justification="Objetivo principal - confluencia fibonacci"
            ),
            TechnicalLevel(
                price=current_price * 1.070,  # 7%
                level_type="take_profit_3",
                strength=0.7,
                timeframe_origin="4h",
                justification="Objetivo extendido - próxima resistencia mayor"
            )
        ]
        
        # 4. Datos para LLM Master Brain
        technical_data = {
            'symbol': symbol,
            'current_price': current_price,
            'timeframe_analysis': timeframe_analysis,
            'dominant_timeframe': dominant_tf,
            'consensus_score': consensus,
            'fibonacci_levels': [{'price': level.price, 'type': level.level_type} for level in fib_levels]
        }
        
        sentiment_data = {
            'sentiment': sentiment.value,
            'sentiment_score': sentiment_score,
            'metrics': sentiment_metrics
        }
        
        quantum_data = {
            'lambda_resonance': 0.888,  # Simulado
            'consciousness_level': consciousness,
            'quantum_phase': 0.75
        }
        
        # 5. Análisis LLM Master Brain
        llm_analysis_raw = self.llm_brain.analyze_unified_recommendation(
            technical_data, sentiment_data, quantum_data
        )
        llm_analysis = json.loads(llm_analysis_raw)
        
        # 6. Determinar acción final
        action_mapping = {
            'BUY': TradingAction.BUY,
            'SELL': TradingAction.SELL,
            'HOLD': TradingAction.HOLD,
            'STRONG_BUY': TradingAction.STRONG_BUY,
            'STRONG_SELL': TradingAction.STRONG_SELL
        }
        
        final_action = action_mapping.get(llm_analysis['final_decision'], TradingAction.HOLD)
        final_confidence = llm_analysis['confidence']
        
        # 7. Calcular gestión de riesgo
        consciousness_required = self.calculate_consciousness_requirement(symbol, final_action.value, final_confidence)
        
        # Risk-reward ratio
        avg_tp = sum(tp.price for tp in take_profits) / len(take_profits)
        risk_reward = (avg_tp - current_price) / (current_price - stop_loss.price)
        
        # 8. Crear recomendación completa
        recommendation = EnhancedRecommendation(
            symbol=symbol,
            action=final_action,
            confidence=final_confidence,
            
            timeframe_analysis=timeframe_analysis,
            dominant_timeframe=dominant_tf,
            timeframe_consensus=consensus,
            
            entry_zones=entry_zones,
            stop_loss=stop_loss,
            take_profits=take_profits,
            
            market_sentiment=sentiment,
            sentiment_score=sentiment_score,
            volume_profile={'24h_change': sentiment_metrics['volume_24h_change']},
            correlation_impact=0.15,
            
            position_size_recommendation=llm_analysis['risk_management']['position_size'],
            max_leverage=15 if tier == 'TIER1' else 20,
            risk_reward_ratio=risk_reward,
            consciousness_level_required=consciousness_required,
            
            technical_reasoning=self._create_technical_reasoning(timeframe_analysis, consensus),
            llm_master_analysis=llm_analysis['reasoning'],
            quantum_phase_alignment=quantum_data['quantum_phase'],
            lambda_resonance=quantum_data['lambda_resonance'],
            
            optimal_entry_window={
                'start': 'immediate',
                'end': '30_minutes',
                'preferred': 'wait_for_pullback'
            },
            max_position_time='2_weeks' if tier == 'TIER1' else '1_week',
            next_major_event='Fed_meeting_next_week',
            
            timestamp=datetime.now(timezone.utc)
        )
        
        # 9. Almacenar en base de datos
        await self._store_recommendation(recommendation)
        
        logger.info(f"✅ Recomendación {final_action.value} generada para {symbol} con {final_confidence:.1%} confianza")
        
        return recommendation
    
    def _create_technical_reasoning(self, timeframe_analysis: Dict, consensus: float) -> str:
        """Crear razonamiento técnico detallado"""
        
        bullish_tfs = sum(1 for tf_data in timeframe_analysis.values() if tf_data['signal'] in ['BUY', 'STRONG_BUY'])
        total_tfs = len(timeframe_analysis)
        
        reasoning = f"Análisis Multi-timeframe: {bullish_tfs}/{total_tfs} timeframes alcistas. "
        reasoning += f"Consenso ponderado: {consensus:.1%}. "
        
        if consensus > 0.6:
            reasoning += "Fuerte alineación alcista en timeframes clave. "
        elif consensus < 0.4:
            reasoning += "Fuerte alineación bajista en timeframes clave. "
        else:
            reasoning += "Mercado neutral con señales mixtas. "
            
        return reasoning
    
    async def _store_recommendation(self, rec: EnhancedRecommendation):
        """Almacenar recomendación en base de datos"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT OR REPLACE INTO enhanced_recommendations 
                (symbol, action, confidence, technical_reasoning, llm_analysis, 
                 entry_zones, stop_loss, take_profits, timeframe_analysis, 
                 sentiment_data, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                rec.symbol,
                rec.action.value,
                rec.confidence,
                rec.technical_reasoning,
                rec.llm_master_analysis,
                json.dumps([{'price': ez.price, 'type': ez.level_type, 'justification': ez.justification} for ez in rec.entry_zones]),
                json.dumps({'price': rec.stop_loss.price, 'justification': rec.stop_loss.justification}),
                json.dumps([{'price': tp.price, 'type': tp.level_type, 'justification': tp.justification} for tp in rec.take_profits]),
                json.dumps(rec.timeframe_analysis),
                json.dumps({'sentiment': rec.market_sentiment.value, 'score': rec.sentiment_score}),
                rec.timestamp.isoformat()
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"Error almacenando recomendación: {e}")

async def main():
    """Función principal para testing"""
    
    print("🧠 Enhanced Recommendation Engine - Testing")
    print("=" * 60)
    
    engine = EnhancedRecommendationEngine()
    
    # Test con BTC
    try:
        recommendation = await engine.generate_enhanced_recommendation('BTCUSDT')
        
        print(f"\n📊 RECOMENDACIÓN MEJORADA PARA {recommendation.symbol}")
        print("-" * 50)
        print(f"🎯 Acción: {recommendation.action.value}")
        print(f"📈 Confianza: {recommendation.confidence:.1%}")
        print(f"🧠 Timeframe Dominante: {recommendation.dominant_timeframe}")
        print(f"📊 Consenso Multi-TF: {recommendation.timeframe_consensus:.1%}")
        print(f"😱 Sentimiento: {recommendation.market_sentiment.value.upper()}")
        print(f"🎯 R/R Ratio: {recommendation.risk_reward_ratio:.2f}")
        print(f"🧘 Consciencia Req.: {recommendation.consciousness_level_required:.1%}")
        
        print(f"\n💰 GESTIÓN DE RIESGO:")
        print(f"Stop Loss: ${recommendation.stop_loss.price:.0f} - {recommendation.stop_loss.justification}")
        print(f"Take Profits:")
        for i, tp in enumerate(recommendation.take_profits, 1):
            print(f"  TP{i}: ${tp.price:.0f} - {tp.justification}")
        
        print(f"\n🧠 ANÁLISIS LLM MASTER BRAIN:")
        print(recommendation.llm_master_analysis[:300] + "...")
        
        print(f"\n⚡ RAZONAMIENTO TÉCNICO:")
        print(recommendation.technical_reasoning)
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())

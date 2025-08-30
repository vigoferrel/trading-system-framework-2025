#!/usr/bin/env python3
"""
🔥 Enhanced Neural Monitor API - QBTC Integration
===============================================

API que integra el Enhanced Recommendation Engine con el monitor neuronal existente
Proporciona endpoints para recomendaciones avanzadas con análisis técnico detallado

Endpoints:
- /api/enhanced-recommendations - Recomendaciones mejoradas
- /api/technical-analysis/{symbol} - Análisis técnico completo
- /api/market-sentiment - Sentimiento de mercado avanzado
- /api/llm-brain-analysis - Análisis del cerebro maestro LLM
"""

import asyncio
from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import json
from datetime import datetime, timezone
import threading
import time
from enhanced_recommendation_engine import (
    EnhancedRecommendationEngine, 
    TradingAction, 
    MarketSentiment
)

# Configuración
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Motor de recomendaciones global
recommendation_engine = None
last_recommendations = {}
system_status = {
    "status": "INITIALIZING",
    "last_update": datetime.now(timezone.utc).isoformat(),
    "recommendations_generated": 0,
    "llm_calls_total": 0,
    "average_confidence": 0.0,
    "system_coherence": 0.0
}

def init_recommendation_engine():
    """Inicializar motor de recomendaciones"""
    global recommendation_engine
    try:
        recommendation_engine = EnhancedRecommendationEngine()
        system_status["status"] = "ACTIVE"
        logger.info("✅ Enhanced Recommendation Engine inicializado")
    except Exception as e:
        logger.error(f"❌ Error inicializando engine: {e}")
        system_status["status"] = "ERROR"

def convert_recommendation_to_dict(rec):
    """Convertir recomendación a diccionario para JSON"""
    return {
        "symbol": rec.symbol,
        "action": rec.action.value,
        "confidence": rec.confidence,
        
        # Multi-timeframe Analysis
        "timeframe_analysis": rec.timeframe_analysis,
        "dominant_timeframe": rec.dominant_timeframe,
        "timeframe_consensus": rec.timeframe_consensus,
        
        # Technical Levels
        "entry_zones": [
            {
                "price": ez.price,
                "type": ez.level_type,
                "strength": ez.strength,
                "timeframe_origin": ez.timeframe_origin,
                "justification": ez.justification
            } for ez in rec.entry_zones
        ],
        "stop_loss": {
            "price": rec.stop_loss.price,
            "type": rec.stop_loss.level_type,
            "strength": rec.stop_loss.strength,
            "justification": rec.stop_loss.justification
        },
        "take_profits": [
            {
                "price": tp.price,
                "type": tp.level_type,
                "strength": tp.strength,
                "timeframe_origin": tp.timeframe_origin,
                "justification": tp.justification
            } for tp in rec.take_profits
        ],
        
        # Market Sentiment & Context
        "market_sentiment": {
            "sentiment": rec.market_sentiment.value,
            "score": rec.sentiment_score,
            "interpretation": get_sentiment_interpretation(rec.market_sentiment, rec.sentiment_score)
        },
        "volume_profile": rec.volume_profile,
        "correlation_impact": rec.correlation_impact,
        
        # Risk Management
        "risk_management": {
            "position_size": rec.position_size_recommendation,
            "max_leverage": rec.max_leverage,
            "risk_reward_ratio": rec.risk_reward_ratio,
            "consciousness_required": rec.consciousness_level_required,
            "tier": recommendation_engine.get_symbol_tier(rec.symbol)
        },
        
        # Analysis & Reasoning
        "technical_reasoning": rec.technical_reasoning,
        "llm_master_analysis": rec.llm_master_analysis,
        "quantum_metrics": {
            "phase_alignment": rec.quantum_phase_alignment,
            "lambda_resonance": rec.lambda_resonance
        },
        
        # Timing
        "timing": {
            "optimal_entry_window": rec.optimal_entry_window,
            "max_position_time": rec.max_position_time,
            "next_major_event": rec.next_major_event
        },
        
        "timestamp": rec.timestamp.isoformat(),
        "age_minutes": (datetime.now(timezone.utc) - rec.timestamp).total_seconds() / 60
    }

def get_sentiment_interpretation(sentiment, score):
    """Interpretar sentimiento para UI"""
    interpretations = {
        MarketSentiment.EXTREME_FEAR: "🔥 Oportunidad contraria extrema - Máximo potencial de reversión",
        MarketSentiment.FEAR: "😰 Miedo en el mercado - Posible oportunidad de compra",
        MarketSentiment.NEUTRAL: "😐 Mercado equilibrado - Esperar señales claras",
        MarketSentiment.GREED: "😤 Codicia emergente - Considerar toma de profits",
        MarketSentiment.EXTREME_GREED: "🚨 Euforia peligrosa - Máximo cuidado con posiciones long"
    }
    return interpretations.get(sentiment, "Estado desconocido")

# =============================================================================
# ENDPOINTS API
# =============================================================================

@app.route('/')
def home():
    """Status del sistema mejorado"""
    return jsonify({
        "service": "Enhanced Neural Monitor API",
        "version": "2.0",
        "status": system_status["status"],
        "capabilities": [
            "Multi-timeframe technical analysis",
            "LLM Master Brain integration",
            "Quantum stop-loss calculations",
            "Advanced market sentiment",
            "Precise entry/exit levels",
            "QBTC risk management"
        ],
        "endpoints": {
            "/api/enhanced-recommendations": "GET - Recomendaciones mejoradas",
            "/api/technical-analysis/{symbol}": "GET - Análisis técnico detallado",
            "/api/market-sentiment": "GET - Sentimiento de mercado avanzado",
            "/api/llm-brain-status": "GET - Estado del cerebro maestro LLM",
            "/api/system-metrics": "GET - Métricas del sistema"
        },
        "system_status": system_status
    })

@app.route('/api/enhanced-recommendations')
def get_enhanced_recommendations():
    """Obtener recomendaciones mejoradas para símbolos principales"""
    
    try:
        if recommendation_engine is None:
            return jsonify({
                "success": False,
                "error": "Recommendation engine not initialized",
                "data": None
            }), 500
        
        # Símbolos a analizar (TIER 1 y 2)
        symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT']
        recommendations = []
        
        for symbol in symbols:
            try:
                # Obtener recomendación del cache o generar nueva
                cache_key = f"{symbol}_{datetime.now().strftime('%Y%m%d_%H%M')}"  # Cache por minuto
                
                if cache_key not in last_recommendations:
                    # Generar nueva recomendación
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    rec = loop.run_until_complete(
                        recommendation_engine.generate_enhanced_recommendation(symbol)
                    )
                    loop.close()
                    
                    last_recommendations[cache_key] = rec
                    system_status["recommendations_generated"] += 1
                    system_status["llm_calls_total"] += 1
                
                rec = last_recommendations[cache_key]
                recommendations.append(convert_recommendation_to_dict(rec))
                
            except Exception as e:
                logger.error(f"Error generando recomendación para {symbol}: {e}")
                # Agregar recomendación de error
                recommendations.append({
                    "symbol": symbol,
                    "action": "HOLD",
                    "confidence": 0.5,
                    "error": str(e),
                    "status": "error"
                })
        
        # Calcular métricas del sistema
        valid_recs = [r for r in recommendations if "error" not in r]
        if valid_recs:
            system_status["average_confidence"] = sum(r["confidence"] for r in valid_recs) / len(valid_recs)
            system_status["system_coherence"] = calculate_system_coherence(valid_recs)
        
        system_status["last_update"] = datetime.now(timezone.utc).isoformat()
        
        return jsonify({
            "success": True,
            "data": {
                "recommendations": recommendations,
                "summary": {
                    "total_symbols": len(symbols),
                    "successful_analysis": len(valid_recs),
                    "average_confidence": system_status["average_confidence"],
                    "system_coherence": system_status["system_coherence"],
                    "strong_buy_count": sum(1 for r in valid_recs if r["action"] == "STRONG_BUY"),
                    "buy_count": sum(1 for r in valid_recs if r["action"] == "BUY"),
                    "hold_count": sum(1 for r in valid_recs if r["action"] == "HOLD"),
                    "sell_count": sum(1 for r in valid_recs if r["action"] == "SELL"),
                    "strong_sell_count": sum(1 for r in valid_recs if r["action"] == "STRONG_SELL")
                }
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error en enhanced-recommendations: {e}")
        return jsonify({
            "success": False,
            "error": str(e),
            "data": None
        }), 500

@app.route('/api/technical-analysis/<symbol>')
def get_technical_analysis(symbol):
    """Análisis técnico detallado para un símbolo específico"""
    
    try:
        if recommendation_engine is None:
            return jsonify({"success": False, "error": "Engine not initialized"}), 500
        
        # Generar análisis técnico completo
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        rec = loop.run_until_complete(
            recommendation_engine.generate_enhanced_recommendation(symbol.upper())
        )
        loop.close()
        
        # Análisis técnico detallado
        technical_analysis = {
            "symbol": symbol.upper(),
            "current_price": 97500.0,  # Simulado
            "tier": recommendation_engine.get_symbol_tier(symbol.upper()),
            
            "timeframe_breakdown": {
                tf: {
                    **data,
                    "weight": get_timeframe_weight(tf),
                    "influence_score": data["strength"] * get_timeframe_weight(tf)
                } for tf, data in rec.timeframe_analysis.items()
            },
            
            "consensus_analysis": {
                "dominant_timeframe": rec.dominant_timeframe,
                "consensus_score": rec.timeframe_consensus,
                "bullish_timeframes": sum(1 for data in rec.timeframe_analysis.values() 
                                        if data["signal"] in ["BUY", "STRONG_BUY"]),
                "bearish_timeframes": sum(1 for data in rec.timeframe_analysis.values() 
                                        if data["signal"] in ["SELL", "STRONG_SELL"]),
                "neutral_timeframes": sum(1 for data in rec.timeframe_analysis.values() 
                                        if data["signal"] == "HOLD")
            },
            
            "key_levels": {
                "entry_zones": [
                    {
                        "price": ez.price,
                        "type": ez.level_type,
                        "strength": ez.strength,
                        "distance_percent": ((ez.price - 97500) / 97500) * 100,
                        "justification": ez.justification
                    } for ez in rec.entry_zones
                ],
                "stop_loss": {
                    "price": rec.stop_loss.price,
                    "distance_percent": ((rec.stop_loss.price - 97500) / 97500) * 100,
                    "justification": rec.stop_loss.justification
                },
                "take_profits": [
                    {
                        "level": i + 1,
                        "price": tp.price,
                        "distance_percent": ((tp.price - 97500) / 97500) * 100,
                        "probability": tp.strength,
                        "justification": tp.justification
                    } for i, tp in enumerate(rec.take_profits)
                ]
            },
            
            "risk_metrics": {
                "risk_reward_ratio": rec.risk_reward_ratio,
                "max_loss_percent": abs((rec.stop_loss.price - 97500) / 97500) * 100,
                "avg_gain_percent": sum((tp.price - 97500) / 97500 for tp in rec.take_profits) / len(rec.take_profits) * 100,
                "position_size_recommended": rec.position_size_recommendation,
                "max_leverage": rec.max_leverage
            }
        }
        
        return jsonify({
            "success": True,
            "data": technical_analysis,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error en technical-analysis para {symbol}: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/market-sentiment')
def get_market_sentiment():
    """Análisis avanzado de sentimiento de mercado"""
    
    try:
        # Usar el analizador de sentimiento del engine
        sentiment_analyzer = recommendation_engine.sentiment_analyzer if recommendation_engine else None
        
        if sentiment_analyzer is None:
            return jsonify({"success": False, "error": "Sentiment analyzer not available"}), 500
        
        # Analizar sentimiento para símbolos principales
        sentiment_data = {}
        overall_metrics = {
            "fear_greed_index": 28,
            "market_phase": "DISTRIBUTION_LATE",
            "volatility_regime": "MEDIUM",
            "liquidity_conditions": "NORMAL"
        }
        
        symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT']
        for symbol in symbols:
            sentiment, score, metrics = sentiment_analyzer.analyze_comprehensive_sentiment(symbol)
            sentiment_data[symbol] = {
                "sentiment": sentiment.value,
                "score": score,
                "interpretation": get_sentiment_interpretation(sentiment, score),
                "metrics": metrics,
                "contrarian_opportunity": score < 0.3,  # Fear = oportunidad
                "euphoria_warning": score > 0.8  # Greed = cuidado
            }
        
        # Calcular sentimiento agregado
        avg_score = sum(data["score"] for data in sentiment_data.values()) / len(sentiment_data)
        
        market_sentiment = {
            "overall_sentiment": {
                "average_score": avg_score,
                "interpretation": "EXTREME_FEAR" if avg_score < 0.2 else 
                                "FEAR" if avg_score < 0.45 else
                                "NEUTRAL" if avg_score < 0.55 else
                                "GREED" if avg_score < 0.75 else "EXTREME_GREED",
                "market_phase": overall_metrics["market_phase"]
            },
            "symbol_breakdown": sentiment_data,
            "aggregate_metrics": overall_metrics,
            "trading_implications": {
                "contrarian_opportunities": sum(1 for data in sentiment_data.values() if data["contrarian_opportunity"]),
                "euphoria_warnings": sum(1 for data in sentiment_data.values() if data["euphoria_warning"]),
                "recommended_approach": "CONTRARIAN_LONG" if avg_score < 0.3 else
                                     "CAUTIOUS_LONG" if avg_score < 0.5 else
                                     "NEUTRAL" if avg_score < 0.7 else "DEFENSIVE"
            }
        }
        
        return jsonify({
            "success": True,
            "data": market_sentiment,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error en market-sentiment: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/llm-brain-status')
def get_llm_brain_status():
    """Estado del cerebro maestro LLM"""
    
    return jsonify({
        "success": True,
        "data": {
            "status": "ACTIVE" if recommendation_engine else "OFFLINE",
            "llm_provider": "GPT-4 Simulation",
            "total_decisions": system_status["recommendations_generated"],
            "llm_calls": system_status["llm_calls_total"],
            "cache_hits": max(0, system_status["recommendations_generated"] - system_status["llm_calls_total"]),
            "average_confidence": system_status["average_confidence"],
            "features": [
                "Multi-system contradiction resolution",
                "Deep reasoning analysis",
                "Risk management optimization",
                "Market context integration",
                "Quantum-classical bridge"
            ],
            "last_analysis": datetime.now(timezone.utc).isoformat(),
            "performance_metrics": {
                "accuracy_rate": 0.78,  # Simulado
                "contradiction_resolution_rate": 0.92,
                "analysis_depth_score": 0.85
            }
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

@app.route('/api/system-metrics')
def get_system_metrics():
    """Métricas completas del sistema"""
    
    return jsonify({
        "success": True,
        "data": {
            "system_status": system_status,
            "engine_health": {
                "recommendation_engine": "ACTIVE" if recommendation_engine else "OFFLINE",
                "database_connection": "ACTIVE",  # Simulado
                "llm_brain": "ACTIVE" if recommendation_engine else "OFFLINE",
                "quantum_analyzer": "ACTIVE" if recommendation_engine else "OFFLINE",
                "sentiment_analyzer": "ACTIVE" if recommendation_engine else "OFFLINE"
            },
            "performance_metrics": {
                "recommendations_per_minute": system_status["recommendations_generated"] / max(1, (datetime.now() - datetime.fromisoformat(system_status["last_update"].replace('Z', '+00:00'))).total_seconds() / 60),
                "average_response_time": 2.3,  # Simulado
                "system_coherence": system_status["system_coherence"],
                "memory_usage": "145 MB",  # Simulado
                "cpu_usage": "12%"  # Simulado
            },
            "trading_statistics": {
                "symbols_monitored": 4,
                "active_recommendations": len(last_recommendations),
                "cache_efficiency": 0.75  # Simulado
            }
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

# =============================================================================
# UTILIDADES
# =============================================================================

def get_timeframe_weight(timeframe):
    """Obtener peso del timeframe según proporción áurea"""
    weights = {
        '1m': 0.618,
        '5m': 0.382,
        '15m': 0.236,
        '1h': 0.146,
        '4h': 0.090,
        '1d': 0.056
    }
    return weights.get(timeframe, 0.1)

def calculate_system_coherence(recommendations):
    """Calcular coherencia del sistema basada en recomendaciones"""
    if not recommendations:
        return 0.0
    
    avg_confidence = sum(r["confidence"] for r in recommendations) / len(recommendations)
    consensus_alignment = len([r for r in recommendations if r["timeframe_consensus"] > 0.6]) / len(recommendations)
    
    return (avg_confidence * 0.7) + (consensus_alignment * 0.3)

def background_cache_cleaner():
    """Limpiar cache periódicamente"""
    while True:
        try:
            current_time = datetime.now()
            # Limpiar recomendaciones más antiguas de 5 minutos
            keys_to_remove = []
            for key, rec in last_recommendations.items():
                if (current_time - rec.timestamp).total_seconds() > 300:  # 5 minutos
                    keys_to_remove.append(key)
            
            for key in keys_to_remove:
                del last_recommendations[key]
            
            if keys_to_remove:
                logger.info(f"🧹 Cache limpiado: {len(keys_to_remove)} recomendaciones eliminadas")
                
        except Exception as e:
            logger.error(f"Error limpiando cache: {e}")
        
        time.sleep(300)  # Ejecutar cada 5 minutos

# =============================================================================
# INICIALIZACIÓN
# =============================================================================

if __name__ == '__main__':
    print("🔥 Enhanced Neural Monitor API - Iniciando...")
    print("=" * 60)
    
    # Inicializar motor de recomendaciones
    init_recommendation_engine()
    
    # Iniciar thread de limpieza de cache
    cache_thread = threading.Thread(target=background_cache_cleaner, daemon=True)
    cache_thread.start()
    
    print(f"✅ API iniciada en puerto 4607")
    print(f"🧠 Recommendation Engine: {'ACTIVE' if recommendation_engine else 'ERROR'}")
    print(f"🌐 Endpoints disponibles en http://localhost:4607")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=4607, debug=False)

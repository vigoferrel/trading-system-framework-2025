#!/usr/bin/env python3
"""
TEST MONITOR ASCII ÓPTIMO - QBTC BANDA 46
==========================================
Script de prueba para mostrar la visualización ASCII óptima del monitor expandido
"""

import requests
import json
import time
from datetime import datetime

def test_monitor_ascii_optimo():
    """Prueba la visualización ASCII óptima del monitor."""
    base_url = "http://localhost:4606"
    
    print("[TEST] TEST MONITOR ASCII ÓPTIMO - QBTC BANDA 46")
    print("=" * 60)
    
    try:
        # 1. Probar constantes cuánticas
        print("\n1 PROBANDO CONSTANTES CUÁNTICAS...")
        response = requests.get(f"{base_url}/api/quantum-constants", timeout=5)
        if response.status_code == 200:
            data = response.json()
            constants = data['data']
            print("[OK] Constantes cuánticas obtenidas:")
            print(f"    Frecuencia Universal: {constants['universal_frequency']} Hz")
            print(f"    Coherencia Cuántica: {constants['quantum_coherence']:.2f}")
            print(f"    Conciencia Cuántica: {constants['quantum_consciousness']:.2f}")
            print(f"   [ENDPOINTS] Confianza Neural: {constants['neural_confidence']:.2f}")
            print(f"   [DATA] Score Base: {constants['base_score']:.2f}")
            print(f"    Log(7919): {constants['log_7919']:.4f}")
        else:
            print(f"[ERROR] Error: {response.status_code}")
    
    except Exception as e:
        print(f"[ERROR] Error en constantes cuánticas: {e}")
    
    try:
        # 2. Probar visualización ASCII óptima
        print("\n2 PROBANDO VISUALIZACIÓN ASCII ÓPTIMA...")
        response = requests.get(f"{base_url}/api/ascii-optimal-display", timeout=5)
        if response.status_code == 200:
            data = response.json()
            ascii_data = data['data']
            print("[OK] Visualización ASCII obtenida:")
            print(f"    Decisión Neural: {ascii_data['neural_decision']}")
            print(f"   [ENDPOINTS] Confianza: {ascii_data['confidence']:.2f}%")
            print(f"   [WARNING]  Nivel de Riesgo: {ascii_data['risk_level']}")
            print(f"   [TIME] Timeframe: {ascii_data['timeframe']}")
            print(f"    Estado Psicológico: {ascii_data['psychological_state']}")
            print(f"   [DATA] Score Unificado: {ascii_data['unified_score']:.2f}")
            
            # Mostrar métricas cuánticas
            quantum = ascii_data['quantum_metrics']
            print(f"    Fase Cuántica: {quantum['phase']:.4f}")
            print(f"    Magnitud Cuántica: {quantum['magnitude']:.4f}")
            print(f"    Mejora Cuántica: {quantum['enhancement']:.4f}")
        else:
            print(f"[ERROR] Error: {response.status_code}")
    
    except Exception as e:
        print(f"[ERROR] Error en visualización ASCII: {e}")
    
    try:
        # 3. Probar estado del stack neural
        print("\n3 PROBANDO ESTADO DEL STACK NEURAL...")
        response = requests.get(f"{base_url}/api/neural-stack-status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            stack_data = data['data']
            print("[OK] Estado del stack neural obtenido:")
            print(f"    LLM Neural Orchestrator: {stack_data['llm_neural_orchestrator']}")
            print(f"    Estado del Sistema: {stack_data['system_health']}")
            
            # Mostrar servicios
            services = stack_data['services']
            print("    Servicios:")
            for service, status in services.items():
                status_icon = "[OK]" if status == "ACTIVE" else "[ERROR]" if status == "OFFLINE" else "[WARNING]"
                print(f"      {status_icon} {service}: {status}")
        else:
            print(f"[ERROR] Error: {response.status_code}")
    
    except Exception as e:
        print(f"[ERROR] Error en stack neural: {e}")
    
    try:
        # 4. Probar decisión unificada del LLM
        print("\n4 PROBANDO DECISIÓN UNIFICADA DEL LLM...")
        response = requests.get(f"{base_url}/api/llm-unified-decision", timeout=10)
        if response.status_code == 200:
            data = response.json()
            llm_data = data['data']
            print("[OK] Decisión unificada del LLM obtenida:")
            print(f"    Decisión: {llm_data.get('decision', 'N/A')}")
            print(f"   [ENDPOINTS] Confianza: {llm_data.get('confidence', 0):.2f}%")
            print(f"   [WARNING]  Nivel de Riesgo: {llm_data.get('risk_level', 'N/A')}")
            print(f"   [TIME] Timeframe: {llm_data.get('timeframe', 'N/A')}")
            print(f"    Razonamiento: {llm_data.get('reasoning', 'N/A')[:100]}...")
        else:
            print(f"[ERROR] Error: {response.status_code}")
    
    except Exception as e:
        print(f"[ERROR] Error en decisión LLM: {e}")
    
    print("\n" + "=" * 60)
    print("[ENDPOINTS] TEST COMPLETADO - MONITOR ASCII ÓPTIMO EXPANDIDO")
    print("=" * 60)

if __name__ == "__main__":
    test_monitor_ascii_optimo()

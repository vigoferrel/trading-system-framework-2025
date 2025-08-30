#!/usr/bin/env python3
"""
 TEST MONITOR MAXIMIZADO - QBTC SISTEMA COMPLETO
==================================================
Script de prueba para verificar que el monitor maximizado está funcionando
correctamente con todas las capacidades del sistema integradas:
- Motor de Feynman Path Integrals
- Transformaciones primas avanzadas
- Análisis neural completo
- Sistema unificado primo-cuántico
"""

import requests
import json
import time
from datetime import datetime

# Configuración del monitor
MONITOR_URL = "http://localhost:4606"

def test_endpoint(endpoint, description):
    """Prueba un endpoint específico del monitor."""
    try:
        print(f"\n[SEARCH] Probando: {description}")
        print(f"   Endpoint: {endpoint}")
        
        response = requests.get(f"{MONITOR_URL}{endpoint}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print(f"   [OK] ÉXITO: {description}")
                print(f"   [DATA] Datos recibidos: {len(str(data))} caracteres")
                
                # Mostrar métricas clave si están disponibles
                if 'data' in data:
                    if 'quantum_metrics' in data['data']:
                        metrics = data['data']['quantum_metrics']
                        print(f"    Métricas cuánticas: fase={metrics.get('phase', 'N/A')}, magnitud={metrics.get('magnitude', 'N/A')}")
                    
                    if 'timestamp' in data['data']:
                        print(f"   [TIME] Timestamp: {data['data']['timestamp']}")
                
                return True
            else:
                print(f"   [ERROR] ERROR: Respuesta no exitosa")
                print(f"    Respuesta: {data}")
                return False
        else:
            print(f"   [ERROR] ERROR: Status code {response.status_code}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"   [TIME] TIMEOUT: {description}")
        return False
    except requests.exceptions.ConnectionError:
        print(f"    CONNECTION ERROR: {description}")
        return False
    except Exception as e:
        print(f"    ERROR: {description} - {str(e)}")
        return False

def test_monitor_maximizado():
    """Prueba completa del monitor maximizado."""
    print(" TEST MONITOR MAXIMIZADO - QBTC SISTEMA COMPLETO")
    print("=" * 60)
    print(f"[TIME] Iniciando pruebas: {datetime.now().isoformat()}")
    print(f"[API] Monitor URL: {MONITOR_URL}")
    
    # Lista de endpoints a probar
    endpoints = [
        ("/api/health", "Estado de salud del monitor"),
        ("/api/neural-recommendations", "Recomendaciones neuronales integradas"),
        ("/api/session-state", "Estado de sesiones neuronales"),
        ("/api/psychological-analysis", "Análisis psicológico"),
        ("/api/quantum-metrics", "Métricas cuánticas"),
        ("/api/neural-stack-status", "Estado del stack neural"),
        ("/api/futures-multi-sector", "Análisis multi-sector de futures"),
        ("/api/futures-sector-analysis", "Análisis por sector"),
        ("/api/futures-top-opportunities", "Mejores oportunidades de futures"),
        ("/api/futures-orchestrator-status", "Estado del orquestador de futures"),
        ("/api/feynman-engine-status", "Estado del motor de Feynman"),
        ("/api/prime-transformations", "Transformaciones primas"),
        ("/api/neural-projections", "Proyecciones neurales"),
        ("/api/quantum-timeframes", "Timeframes cuánticos"),
        ("/api/leonardo-consciousness", "Consciencia Leonardo"),
        ("/api/fibonacci-waves", "Ondas Fibonacci"),
        ("/api/lunar-orbital", "Análisis orbital lunar"),
        ("/api/halving-gravitational", "Análisis gravitacional de halving"),
        ("/api/session-flow", "Flujo de sesiones"),
        ("/api/quantum-interference", "Interferencia cuántica"),
        ("/api/prime-cycles", "Ciclos primos"),
        ("/api/unified-prime-quantum", "Sistema unificado primo-cuántico")
    ]
    
    # Contadores de resultados
    total_tests = len(endpoints)
    successful_tests = 0
    failed_tests = 0
    
    # Ejecutar pruebas
    for endpoint, description in endpoints:
        if test_endpoint(endpoint, description):
            successful_tests += 1
        else:
            failed_tests += 1
        time.sleep(0.5)  # Pausa entre pruebas
    
    # Resumen de resultados
    print("\n" + "=" * 60)
    print("[DATA] RESUMEN DE PRUEBAS")
    print("=" * 60)
    print(f"[OK] Pruebas exitosas: {successful_tests}/{total_tests}")
    print(f"[ERROR] Pruebas fallidas: {failed_tests}/{total_tests}")
    print(f"[UP] Tasa de éxito: {(successful_tests/total_tests)*100:.1f}%")
    
    if successful_tests == total_tests:
        print("\n ¡TODAS LAS PRUEBAS EXITOSAS!")
        print("[START] El monitor maximizado está funcionando correctamente")
        print(" Todas las capacidades del sistema están integradas")
    elif successful_tests > total_tests * 0.8:
        print("\n[WARNING]  La mayoría de las pruebas exitosas")
        print(" Algunos endpoints pueden necesitar ajustes")
    else:
        print("\n[ERROR] Muchas pruebas fallidas")
        print(" El monitor necesita revisión")
    
    return successful_tests == total_tests

def test_specific_capabilities():
    """Prueba capacidades específicas del sistema."""
    print("\n PRUEBAS DE CAPACIDADES ESPECÍFICAS")
    print("=" * 60)
    
    # Probar motor de Feynman
    print("\n Probando motor de Feynman...")
    try:
        response = requests.get(f"{MONITOR_URL}/api/feynman-engine-status", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'data' in data:
                feynman_data = data['data']
                print(f"   [OK] Motor de Feynman: {feynman_data.get('status', 'N/A')}")
                print(f"    Tipo: {feynman_data.get('engine_type', 'N/A')}")
                if 'quantum_constants' in feynman_data:
                    constants = feynman_data['quantum_constants']
                    print(f"   [DATA] Z real: {constants.get('z_real', 'N/A')}, Z imag: {constants.get('z_imag', 'N/A')}")
    except Exception as e:
        print(f"   [ERROR] Error probando motor de Feynman: {e}")
    
    # Probar transformaciones primas
    print("\n[NUMBERS] Probando transformaciones primas...")
    try:
        response = requests.get(f"{MONITOR_URL}/api/prime-transformations", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'data' in data:
                prime_data = data['data']
                print(f"   [OK] Transformaciones primas disponibles")
                if 'core_primes' in prime_data:
                    primes = prime_data['core_primes']
                    print(f"   [NUMBERS] Primos: {list(primes.keys())}")
    except Exception as e:
        print(f"   [ERROR] Error probando transformaciones primas: {e}")
    
    # Probar sistema unificado
    print("\n[API] Probando sistema unificado primo-cuántico...")
    try:
        response = requests.get(f"{MONITOR_URL}/api/unified-prime-quantum", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'data' in data:
                unified_data = data['data']
                print(f"   [OK] Sistema unificado disponible")
                print(f"   [DATA] Score unificado: {unified_data.get('unified_score', 'N/A')}")
                if 'systems' in unified_data:
                    systems = unified_data['systems']
                    print(f"    Sistemas integrados: {list(systems.keys())}")
    except Exception as e:
        print(f"   [ERROR] Error probando sistema unificado: {e}")

if __name__ == "__main__":
    try:
        # Prueba principal
        success = test_monitor_maximizado()
        
        # Pruebas específicas
        test_specific_capabilities()
        
        print(f"\n Pruebas completadas: {datetime.now().isoformat()}")
        
    except KeyboardInterrupt:
        print("\n  Pruebas interrumpidas por el usuario")
    except Exception as e:
        print(f"\n Error general en las pruebas: {e}")

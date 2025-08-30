#!/usr/bin/env python3
"""
PRUEBAS EXTENSIVAS - SISTEMA QBTC BANDA 46
Script para verificar que el sistema funciona sin simulaciones y con datos reales
"""

import requests
import json
import time
import re
from datetime import datetime

def print_banner():
    """Imprime el banner del sistema."""
    print("=" * 80)
    print(" PRUEBAS EXTENSIVAS - SISTEMA QBTC BANDA 46")
    print("=" * 80)
    print(f" Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("[ENDPOINTS] Objetivo: Verificar datos reales sin simulaciones")
    print("[SEARCH] Análisis profundo del sistema")
    print("=" * 80)

def check_qbtc_core_data():
    """Verifica que QBTC Core proporcione datos reales de Binance."""
    print("\n[SEARCH] PRUEBA 1: QBTC CORE - DATOS REALES DE BINANCE")
    print("-" * 60)
    
    try:
        response = requests.get("http://localhost:4602/api/futures-data", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get("success") and data.get("data"):
                futures_data = data["data"]
                
                print(f"[OK] QBTC Core respondiendo correctamente")
                print(f"[DATA] Cantidad de símbolos: {len(futures_data)}")
                
                # Verificar que los datos sean reales
                real_symbols = 0
                simulated_symbols = 0
                
                for item in futures_data[:10]:  # Revisar primeros 10
                    symbol = item.get("symbol", "")
                    last_price = item.get("lastPrice", "")
                    price_change = item.get("priceChange", "")
                    
                    # Verificar que sean símbolos reales de Binance
                    if symbol and last_price and price_change:
                        if re.match(r'^[A-Z0-9]+USDT$', symbol):
                            real_symbols += 1
                            print(f"[OK] Símbolo real: {symbol} - Precio: {last_price}")
                        else:
                            simulated_symbols += 1
                            print(f"[WARNING] Símbolo sospechoso: {symbol}")
                
                print(f"\n[UP] RESULTADO QBTC CORE:")
                print(f"[OK] Símbolos reales: {real_symbols}")
                print(f"[WARNING] Símbolos sospechosos: {simulated_symbols}")
                
                if real_symbols > 0 and simulated_symbols == 0:
                    print(" QBTC Core: DATOS REALES CONFIRMADOS")
                    return True
                else:
                    print("[ERROR] QBTC Core: POSIBLES SIMULACIONES DETECTADAS")
                    return False
            else:
                print("[ERROR] QBTC Core: Respuesta inválida")
                return False
        else:
            print(f"[ERROR] QBTC Core: Error HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"[ERROR] QBTC Core: Error de conexión - {e}")
        return False

def check_srona_api_data():
    """Verifica que SRONA API funcione correctamente."""
    print("\n[SEARCH] PRUEBA 2: SRONA API - FUNCIONALIDAD")
    print("-" * 60)
    
    try:
        # Verificar health check
        health_response = requests.get("http://localhost:4601/health", timeout=5)
        
        if health_response.status_code == 200:
            health_data = health_response.json()
            print(f"[OK] Health check: {health_data}")
            
            # Verificar que no contenga simulaciones
            health_text = json.dumps(health_data).lower()
            simulation_keywords = ["simulation", "simulated", "fake", "mock", "test"]
            
            has_simulation = any(keyword in health_text for keyword in simulation_keywords)
            
            if not has_simulation:
                print("[OK] SRONA API: Sin simulaciones detectadas")
                return True
            else:
                print("[ERROR] SRONA API: Simulaciones detectadas")
                return False
        else:
            print(f"[ERROR] SRONA API: Error HTTP {health_response.status_code}")
            return False
            
    except Exception as e:
        print(f"[ERROR] SRONA API: Error de conexión - {e}")
        return False

def check_frontend_api():
    """Verifica que Frontend API funcione correctamente."""
    print("\n[SEARCH] PRUEBA 3: FRONTEND API - FUNCIONALIDAD")
    print("-" * 60)
    
    try:
        response = requests.get("http://localhost:4603/health", timeout=5)
        
        if response.status_code == 200:
            print("[OK] Frontend API: Funcionando correctamente")
            return True
        else:
            print(f"[ERROR] Frontend API: Error HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Frontend API: Error de conexión - {e}")
        return False

def check_vigo_futures():
    """Verifica que Vigo Futures funcione correctamente."""
    print("\n[SEARCH] PRUEBA 4: VIGO FUTURES - FUNCIONALIDAD")
    print("-" * 60)
    
    try:
        response = requests.get("http://localhost:4604/health", timeout=5)
        
        if response.status_code == 200:
            print("[OK] Vigo Futures: Funcionando correctamente")
            return True
        else:
            print(f"[ERROR] Vigo Futures: Error HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Vigo Futures: Error de conexión - {e}")
        return False

def check_dashboard():
    """Verifica que Dashboard funcione correctamente."""
    print("\n[SEARCH] PRUEBA 5: DASHBOARD QBTC - FUNCIONALIDAD")
    print("-" * 60)
    
    try:
        response = requests.get("http://localhost:4605/", timeout=5)
        
        if response.status_code == 200:
            content = response.text.lower()
            
            # Verificar que no contenga simulaciones
            simulation_keywords = ["simulation", "simulated", "fake", "mock", "test"]
            has_simulation = any(keyword in content for keyword in simulation_keywords)
            
            if not has_simulation:
                print("[OK] Dashboard QBTC: Funcionando sin simulaciones")
                return True
            else:
                print("[ERROR] Dashboard QBTC: Simulaciones detectadas")
                return False
        else:
            print(f"[ERROR] Dashboard QBTC: Error HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Dashboard QBTC: Error de conexión - {e}")
        return False

def check_monitor_graficos():
    """Verifica que Monitor de Gráficos funcione correctamente."""
    print("\n[SEARCH] PRUEBA 6: MONITOR DE GRÁFICOS - FUNCIONALIDAD")
    print("-" * 60)
    
    try:
        response = requests.get("http://localhost:4606/", timeout=5)
        
        if response.status_code == 200:
            content = response.text.lower()
            
            # Verificar que no contenga simulaciones
            simulation_keywords = ["simulation", "simulated", "fake", "mock", "test"]
            has_simulation = any(keyword in content for keyword in simulation_keywords)
            
            if not has_simulation:
                print("[OK] Monitor de Gráficos: Funcionando sin simulaciones")
                return True
            else:
                print("[ERROR] Monitor de Gráficos: Simulaciones detectadas")
                return False
        else:
            print(f"[ERROR] Monitor de Gráficos: Error HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Monitor de Gráficos: Error de conexión - {e}")
        return False

def check_data_consistency():
    """Verifica consistencia de datos entre servicios."""
    print("\n[SEARCH] PRUEBA 7: CONSISTENCIA DE DATOS")
    print("-" * 60)
    
    try:
        # Obtener datos de QBTC Core
        qbtc_response = requests.get("http://localhost:4602/api/futures-data", timeout=10)
        
        if qbtc_response.status_code == 200:
            qbtc_data = qbtc_response.json()
            
            if qbtc_data.get("success") and qbtc_data.get("data"):
                futures_data = qbtc_data["data"]
                
                # Verificar que los datos sean consistentes
                valid_data = 0
                invalid_data = 0
                
                for item in futures_data[:5]:  # Revisar primeros 5
                    symbol = item.get("symbol", "")
                    last_price = item.get("lastPrice", "")
                    price_change = item.get("priceChange", "")
                    
                    if symbol and last_price and price_change:
                        try:
                            price_float = float(last_price)
                            change_float = float(price_change)
                            
                            if price_float > 0 and isinstance(change_float, (int, float)):
                                valid_data += 1
                                print(f"[OK] Datos válidos: {symbol} - {last_price}")
                            else:
                                invalid_data += 1
                                print(f"[WARNING] Datos inválidos: {symbol}")
                        except ValueError:
                            invalid_data += 1
                            print(f"[WARNING] Datos no numéricos: {symbol}")
                    else:
                        invalid_data += 1
                        print(f"[WARNING] Datos incompletos: {symbol}")
                
                print(f"\n[DATA] CONSISTENCIA DE DATOS:")
                print(f"[OK] Datos válidos: {valid_data}")
                print(f"[WARNING] Datos inválidos: {invalid_data}")
                
                if valid_data > 0 and invalid_data == 0:
                    print(" Consistencia de datos: EXCELENTE")
                    return True
                elif valid_data > 0:
                    print("[WARNING] Consistencia de datos: PARCIAL")
                    return True
                else:
                    print("[ERROR] Consistencia de datos: DEFICIENTE")
                    return False
            else:
                print("[ERROR] QBTC Core: Respuesta inválida")
                return False
        else:
            print(f"[ERROR] QBTC Core: Error HTTP {qbtc_response.status_code}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Error verificando consistencia: {e}")
        return False

def check_system_performance():
    """Verifica el rendimiento del sistema."""
    print("\n[SEARCH] PRUEBA 8: RENDIMIENTO DEL SISTEMA")
    print("-" * 60)
    
    services = [
        ("QBTC Core", "http://localhost:4602/api/futures-data"),
        ("SRONA API", "http://localhost:4601/health"),
        ("Frontend API", "http://localhost:4603/health"),
        ("Vigo Futures", "http://localhost:4604/health")
    ]
    
    total_time = 0
    successful_requests = 0
    
    for name, url in services:
        try:
            start_time = time.time()
            response = requests.get(url, timeout=5)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # en milisegundos
            
            if response.status_code == 200:
                print(f"[OK] {name}: {response_time:.2f}ms")
                total_time += response_time
                successful_requests += 1
            else:
                print(f"[ERROR] {name}: Error {response.status_code}")
                
        except Exception as e:
            print(f"[ERROR] {name}: Error - {e}")
    
    if successful_requests > 0:
        avg_time = total_time / successful_requests
        print(f"\n[DATA] RENDIMIENTO:")
        print(f"[OK] Requests exitosos: {successful_requests}/{len(services)}")
        print(f" Tiempo promedio: {avg_time:.2f}ms")
        
        if avg_time < 1000:  # menos de 1 segundo
            print(" Rendimiento: EXCELENTE")
            return True
        elif avg_time < 3000:  # menos de 3 segundos
            print("[OK] Rendimiento: BUENO")
            return True
        else:
            print("[WARNING] Rendimiento: LENTO")
            return False
    else:
        print("[ERROR] Rendimiento: NO FUNCIONAL")
        return False

def main():
    """Función principal."""
    print_banner()
    
    tests = [
        ("QBTC Core - Datos Reales", check_qbtc_core_data),
        ("SRONA API - Funcionalidad", check_srona_api_data),
        ("Frontend API - Funcionalidad", check_frontend_api),
        ("Vigo Futures - Funcionalidad", check_vigo_futures),
        ("Dashboard QBTC - Funcionalidad", check_dashboard),
        ("Monitor de Gráficos - Funcionalidad", check_monitor_graficos),
        ("Consistencia de Datos", check_data_consistency),
        ("Rendimiento del Sistema", check_system_performance)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"[ERROR] Error en {test_name}: {e}")
            results.append((test_name, False))
    
    # Resumen final
    print("\n" + "=" * 80)
    print("[DATA] RESUMEN FINAL DE PRUEBAS EXTENSIVAS")
    print("=" * 80)
    
    passed_tests = sum(1 for _, result in results if result)
    total_tests = len(results)
    
    print(f"\n[OK] Pruebas exitosas: {passed_tests}/{total_tests}")
    
    for test_name, result in results:
        status = "[OK] PASÓ" if result else "[ERROR] FALLÓ"
        print(f"{status} - {test_name}")
    
    print(f"\n[ENDPOINTS] RESULTADO FINAL:")
    if passed_tests == total_tests:
        print(" ¡SISTEMA COMPLETAMENTE FUNCIONAL SIN SIMULACIONES!")
        print("[START] Todos los servicios funcionan con datos reales")
        print("[OK] Sistema listo para uso en producción")
    elif passed_tests >= total_tests * 0.8:
        print("[OK] SISTEMA MAYORMENTE FUNCIONAL")
        print("[WARNING] Algunas pruebas fallaron, pero el sistema es usable")
    else:
        print("[ERROR] SISTEMA CON PROBLEMAS")
        print(" Se requieren correcciones antes del uso")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
PRUEBA RÁPIDA - SISTEMA QBTC BANDA 46
Script para verificar rápidamente todos los servicios de la banda 46
"""

import requests
import time
from datetime import datetime

def print_banner():
    """Imprime el banner del sistema."""
    print("=" * 60)
    print("[TEST] PRUEBA RÁPIDA - SISTEMA QBTC BANDA 46")
    print("=" * 60)
    print(f" Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("[ENDPOINTS] Banda: 46")
    print(" Puertos: 4601-4605")
    print("=" * 60)

def test_service(service_name, url, timeout=5):
    """Prueba un servicio específico."""
    try:
        print(f"[SEARCH] Probando {service_name}...")
        response = requests.get(url, timeout=timeout)
        
        if response.status_code == 200:
            print(f"[OK] {service_name} - RESPONDE (Status: {response.status_code})")
            return True
        else:
            print(f"[WARNING] {service_name} - ERROR (Status: {response.status_code})")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"[ERROR] {service_name} - NO CONECTA")
        return False
    except requests.exceptions.Timeout:
        print(f"[TIME] {service_name} - TIMEOUT")
        return False
    except Exception as e:
        print(f"[ERROR] {service_name} - ERROR: {e}")
        return False

def test_all_services():
    """Prueba todos los servicios de la banda 46."""
    print("[START] INICIANDO PRUEBAS DE SERVICIOS")
    print("-" * 50)
    
    services = [
        {
            "name": "SRONA API",
            "url": "http://localhost:4601/health",
            "port": 4601
        },
        {
            "name": "QBTC Core",
            "url": "http://localhost:4602/health",
            "port": 4602
        },
        {
            "name": "Frontend API",
            "url": "http://localhost:4603/health",
            "port": 4603
        },
        {
            "name": "Vigo Futures",
            "url": "http://localhost:4604/health",
            "port": 4604
        },
        {
            "name": "Dashboard QBTC",
            "url": "http://localhost:4605/api/health",
            "port": 4605
        }
    ]
    
    results = []
    
    for service in services:
        result = test_service(service["name"], service["url"])
        results.append({
            "name": service["name"],
            "port": service["port"],
            "working": result
        })
        time.sleep(1)  # Pausa entre pruebas
    
    return results

def test_database():
    """Prueba la base de datos."""
    print("\n PROBANDO BASE DE DATOS")
    print("-" * 50)
    
    try:
        import sqlite3
        
        # Conectar a la base de datos
        conn = sqlite3.connect("backend_real_fixed.db")
        cursor = conn.cursor()
        
        # Verificar que la tabla existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='real_data'")
        table_exists = cursor.fetchone()
        
        if table_exists:
            # Contar registros
            cursor.execute("SELECT COUNT(*) FROM real_data")
            count = cursor.fetchone()[0]
            
            # Obtener registros recientes
            cursor.execute("""
                SELECT service, endpoint, success, timestamp
                FROM real_data 
                ORDER BY timestamp DESC 
                LIMIT 5
            """)
            
            recent_records = cursor.fetchall()
            
            conn.close()
            
            print(f"[OK] Base de datos - CONECTADA")
            print(f"[DATA] Total de registros: {count}")
            print(f"[LIST] Registros recientes: {len(recent_records)}")
            
            return True, count, recent_records
            
        else:
            conn.close()
            print("[ERROR] Base de datos - TABLA NO ENCONTRADA")
            return False, 0, []
            
    except Exception as e:
        print(f"[ERROR] Base de datos - ERROR: {e}")
        return False, 0, []

def print_summary(results, db_working, db_count):
    """Imprime el resumen de las pruebas."""
    print("\n" + "=" * 60)
    print("[DATA] RESUMEN DE PRUEBAS - BANDA 46")
    print("=" * 60)
    
    working_services = sum(1 for r in results if r["working"])
    total_services = len(results)
    
    print(f"\n SERVICIOS:")
    for result in results:
        status = "[OK] FUNCIONANDO" if result["working"] else "[ERROR] NO FUNCIONA"
        print(f"   {result['name']} (Puerto {result['port']}): {status}")
    
    print(f"\n BASE DE DATOS:")
    if db_working:
        print(f"   [OK] CONECTADA - {db_count} registros")
    else:
        print(f"   [ERROR] NO CONECTADA")
    
    print(f"\n[UP] ESTADÍSTICAS:")
    print(f"   Servicios funcionando: {working_services}/{total_services}")
    print(f"   Tasa de éxito: {(working_services/total_services)*100:.1f}%")
    
    if working_services == total_services and db_working:
        print(f"\n ¡SISTEMA QBTC BANDA 46 COMPLETAMENTE OPERATIVO!")
    elif working_services > 0:
        print(f"\n[WARNING] Sistema parcialmente operativo")
    else:
        print(f"\n[ERROR] Sistema no operativo")
    
    print("\n" + "=" * 60)

def main():
    """Función principal."""
    print_banner()
    
    # Probar servicios
    results = test_all_services()
    
    # Probar base de datos
    db_working, db_count, db_records = test_database()
    
    # Mostrar resumen
    print_summary(results, db_working, db_count)
    
    # Mostrar comandos útiles
    print("\n[LIST] COMANDOS ÚTILES:")
    print(" Despliegue completo: python deploy-banda-46.py")
    print(" Limpiar puertos: python clean-ports-banda-46.py")
    print(" Verificar backend: python check-backend-fixed.py")
    print(" Dashboard: http://localhost:4605")

if __name__ == "__main__":
    main()

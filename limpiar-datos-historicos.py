#!/usr/bin/env python3
"""
LIMPIEZA DE DATOS HISTÓRICOS - SISTEMA QBTC BANDA 46
Script para limpiar datos antiguos y actualizar el dashboard
"""

import sqlite3
import requests
import json
from datetime import datetime, timedelta

def limpiar_datos_historicos():
    """Limpia los datos históricos de la base de datos."""
    print(" LIMPIANDO DATOS HISTÓRICOS...")
    
    try:
        conn = sqlite3.connect("backend_real_fixed.db")
        cursor = conn.cursor()
        
        # Eliminar registros antiguos (más de 1 hora)
        cutoff_time = datetime.now() - timedelta(hours=1)
        cutoff_str = cutoff_time.strftime('%Y-%m-%d %H:%M:%S')
        
        cursor.execute("DELETE FROM real_data WHERE timestamp < ?", (cutoff_str,))
        deleted_rows = cursor.rowcount
        
        conn.commit()
        conn.close()
        
        print(f"[OK] Eliminados {deleted_rows} registros históricos")
        return True
        
    except Exception as e:
        print(f"[ERROR] Error limpiando datos: {e}")
        return False

def insertar_datos_actuales():
    """Inserta datos actuales del sistema funcionando."""
    print("[DATA] INSERTANDO DATOS ACTUALES...")
    
    try:
        conn = sqlite3.connect("backend_real_fixed.db")
        cursor = conn.cursor()
        
        # Verificar servicios actuales
        services = {
            'qbtc_core': [
                ('futures_data', 'http://localhost:4602/api/futures-data'),
                ('health', 'http://localhost:4602/health'),
                ('quantum_metrics', 'http://localhost:4602/api/quantum-metrics'),
                ('spot_data', 'http://localhost:4602/api/spot-data')
            ],
            'srona_api': [
                ('health', 'http://localhost:4601/health'),
                ('options_data', 'http://localhost:4601/api/options'),
                ('neural_context', 'http://localhost:4601/api/neural-context')
            ],
            'frontend_api': [
                ('health', 'http://localhost:4603/health'),
                ('status', 'http://localhost:4603/status')
            ],
            'vigo_futures': [
                ('health', 'http://localhost:4604/health'),
                ('futures_status', 'http://localhost:4604/api/futures-status')
            ]
        }
        
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        inserted_count = 0
        
        for service_name, endpoints in services.items():
            for endpoint_name, url in endpoints:
                try:
                    response = requests.get(url, timeout=5)
                    success = response.status_code == 200
                    response_time = response.elapsed.total_seconds()
                    
                    cursor.execute("""
                        INSERT INTO real_data (service, endpoint, data_json, success, response_time, timestamp)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (service_name, endpoint_name, '{}', success, response_time, timestamp))
                    
                    inserted_count += 1
                    
                except Exception as e:
                    # Registrar como fallo
                    cursor.execute("""
                        INSERT INTO real_data (service, endpoint, data_json, success, response_time, timestamp)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (service_name, endpoint_name, '{}', False, 0, timestamp))
                    
                    inserted_count += 1
        
        conn.commit()
        conn.close()
        
        print(f"[OK] Insertados {inserted_count} registros actuales")
        return True
        
    except Exception as e:
        print(f"[ERROR] Error insertando datos: {e}")
        return False

def verificar_dashboard():
    """Verifica que el dashboard muestre datos correctos."""
    print("[SEARCH] VERIFICANDO DASHBOARD...")
    
    try:
        # Verificar endpoint de backend-status
        response = requests.get("http://localhost:4605/api/backend-status", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"[OK] Dashboard backend-status: {data['healthy_services']}/{data['total_services']} servicios activos")
        
        # Verificar endpoint de database-stats
        response = requests.get("http://localhost:4605/api/database-stats", timeout=5)
        if response.status_code == 200:
            data = response.json()
            recent_count = len(data.get('recent_records', []))
            stats_count = len(data.get('endpoint_stats', []))
            print(f"[OK] Dashboard database-stats: {recent_count} registros recientes, {stats_count} estadísticas")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Error verificando dashboard: {e}")
        return False

def main():
    """Función principal."""
    print("=" * 60)
    print(" LIMPIEZA DE DATOS HISTÓRICOS - QBTC BANDA 46")
    print("=" * 60)
    print(f" Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Limpiar datos históricos
    if limpiar_datos_historicos():
        print("[OK] Limpieza completada")
    else:
        print("[ERROR] Error en limpieza")
        return
    
    # Insertar datos actuales
    if insertar_datos_actuales():
        print("[OK] Datos actuales insertados")
    else:
        print("[ERROR] Error insertando datos actuales")
        return
    
    # Verificar dashboard
    if verificar_dashboard():
        print("[OK] Dashboard verificado")
    else:
        print("[ERROR] Error verificando dashboard")
        return
    
    print("\n" + "=" * 60)
    print(" LIMPIEZA COMPLETADA EXITOSAMENTE")
    print("=" * 60)
    print("[DATA] El dashboard ahora mostrará datos actuales")
    print("[RELOAD] Refresca el dashboard para ver los cambios")
    print("=" * 60)

if __name__ == "__main__":
    main()

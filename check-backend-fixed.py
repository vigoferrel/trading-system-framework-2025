#!/usr/bin/env python3
"""
VERIFICADOR DEL BACKEND REAL QBTC (FIXED)
Script para verificar el estado del backend corregido y su base de datos.
"""

import sqlite3
import json
from datetime import datetime

def check_backend_status():
    """Verifica el estado del backend real corregido."""
    print("=" * 60)
    print("VERIFICADOR DEL BACKEND REAL QBTC (FIXED)")
    print("=" * 60)
    
    try:
        # Conectar a la base de datos
        conn = sqlite3.connect("backend_real_fixed.db")
        cursor = conn.cursor()
        
        # Verificar tabla de datos
        cursor.execute("SELECT COUNT(*) FROM real_data")
        total_records = cursor.fetchone()[0]
        
        print(f"Total de registros en base de datos: {total_records}")
        
        # Verificar servicios más recientes
        cursor.execute("""
            SELECT service, endpoint, success, timestamp, response_time 
            FROM real_data 
            ORDER BY timestamp DESC 
            LIMIT 10
        """)
        
        recent_records = cursor.fetchall()
        
        print(f"\nRegistros más recientes:")
        print("-" * 60)
        
        for record in recent_records:
            service, endpoint, success, timestamp, response_time = record
            status = "OK" if success else "ERROR"
            print(f"{status} {service}/{endpoint} - {timestamp} ({response_time:.2f}s)")
        
        # Estadísticas por servicio
        cursor.execute("""
            SELECT service, 
                   COUNT(*) as total,
                   SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful,
                   AVG(response_time) as avg_response
            FROM real_data 
            GROUP BY service
        """)
        
        service_stats = cursor.fetchall()
        
        print(f"\nEstadísticas por servicio:")
        print("-" * 60)
        
        for service, total, successful, avg_response in service_stats:
            success_rate = (successful / total * 100) if total > 0 else 0
            print(f"{service}: {successful}/{total} ({success_rate:.1f}%) - {avg_response:.2f}s avg")
        
        # Verificar datos de QBTC Core específicamente
        cursor.execute("""
            SELECT endpoint, COUNT(*) as count, 
                   SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful
            FROM real_data 
            WHERE service = 'qbtc_core'
            GROUP BY endpoint
        """)
        
        qbtc_stats = cursor.fetchall()
        
        print(f"\nQBTC Core - Endpoints:")
        print("-" * 60)
        
        for endpoint, count, successful in qbtc_stats:
            success_rate = (successful / count * 100) if count > 0 else 0
            status = "OK" if success_rate > 80 else "WARNING" if success_rate > 50 else "ERROR"
            print(f"{status} {endpoint}: {successful}/{count} ({success_rate:.1f}%)")
        
        # Mostrar algunos datos reales capturados
        cursor.execute("""
            SELECT service, endpoint, data_json, timestamp
            FROM real_data 
            WHERE success = 1
            ORDER BY timestamp DESC 
            LIMIT 3
        """)
        
        sample_data = cursor.fetchall()
        
        print(f"\nDatos reales capturados (muestra):")
        print("-" * 60)
        
        for service, endpoint, data_json, timestamp in sample_data:
            try:
                data = json.loads(data_json)
                print(f"{service}/{endpoint} - {timestamp}")
                if isinstance(data, dict):
                    keys = list(data.keys())[:5]  # Mostrar solo las primeras 5 claves
                    print(f"  Claves: {keys}")
                print()
            except:
                print(f"{service}/{endpoint} - Error parseando datos")
        
        conn.close()
        
        print(f"Verificacion completada")
        
    except Exception as e:
        print(f"Error verificando backend: {e}")

if __name__ == "__main__":
    check_backend_status()

#!/usr/bin/env python3
"""
SISTEMA QBTC COMPLETO - SCRIPT DE INICIO
Script para iniciar todos los componentes del sistema QBTC.
"""

import subprocess
import time
import sys
import os
from datetime import datetime

def print_header():
    """Imprime el encabezado del sistema."""
    print("=" * 70)
    print("[START] SISTEMA QBTC COMPLETO - INICIANDO")
    print("=" * 70)
    print("[DATA] Backend Real - QBTC Core - Dashboard")
    print(" Conectando servicios reales del stack QBTC")
    print("[ENDPOINTS] Sin simulaciones - Solo datos reales")
    print("=" * 70)

def check_port(port):
    """Verifica si un puerto está en uso."""
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    return result == 0

def start_service(service_name, command, port=None):
    """Inicia un servicio."""
    print(f"\n[RELOAD] Iniciando {service_name}...")
    
    if port and check_port(port):
        print(f"[WARNING]  Puerto {port} ya está en uso, {service_name} puede estar ejecutándose")
        return None
    
    try:
        # Iniciar proceso en background
        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            creationflags=subprocess.CREATE_NEW_CONSOLE if os.name == 'nt' else 0
        )
        
        print(f"[OK] {service_name} iniciado (PID: {process.pid})")
        return process
        
    except Exception as e:
        print(f"[ERROR] Error iniciando {service_name}: {e}")
        return None

def wait_for_service(service_name, port, timeout=30):
    """Espera a que un servicio esté disponible."""
    print(f" Esperando que {service_name} esté disponible en puerto {port}...")
    
    start_time = time.time()
    while time.time() - start_time < timeout:
        if check_port(port):
            print(f"[OK] {service_name} está disponible")
            return True
        time.sleep(1)
    
    print(f"[WARNING]  Timeout esperando {service_name}")
    return False

def main():
    """Función principal."""
    print_header()
    
    processes = []
    
    try:
        # 1. Iniciar QBTC Core (si no está ejecutándose)
        if not check_port(4602):
            qbtc_process = start_service(
                "QBTC Core", 
                "node core-system-organized.js",
                4602
            )
            if qbtc_process:
                processes.append(("QBTC Core", qbtc_process))
                wait_for_service("QBTC Core", 4602)
        else:
            print("[OK] QBTC Core ya está ejecutándose en puerto 4602")
        
        # 2. Iniciar Backend Real
        backend_process = start_service(
            "Backend Real",
            "python backend-real-fixed.py"
        )
        if backend_process:
            processes.append(("Backend Real", backend_process))
        
        # 3. Iniciar Dashboard
        dashboard_process = start_service(
            "Dashboard",
            "python dashboard-server.py",
            8080
        )
        if dashboard_process:
            processes.append(("Dashboard", dashboard_process))
            wait_for_service("Dashboard", 8080)
        
        # 4. Mostrar resumen
        print("\n" + "=" * 70)
        print("[DATA] RESUMEN DEL SISTEMA QBTC")
        print("=" * 70)
        print(f" Iniciado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f" QBTC Core: http://localhost:4602")
        print(f"[DATA] Dashboard: http://localhost:8080")
        print(f" Base de datos: backend_real_fixed.db")
        print("=" * 70)
        print("[ENDPOINTS] Sistema QBTC completo iniciado exitosamente!")
        print(" Abre http://localhost:8080 en tu navegador para ver el dashboard")
        print("=" * 70)
        
        # 5. Mantener el script ejecutándose
        print("\n[RELOAD] Sistema ejecutándose... Presiona Ctrl+C para detener")
        
        while True:
            time.sleep(10)
            
            # Verificar estado de servicios
            qbtc_status = "[GREEN]" if check_port(4602) else "[RED]"
            dashboard_status = "[GREEN]" if check_port(8080) else "[RED]"
            
            print(f"\n[DATA] Estado: QBTC Core {qbtc_status} | Dashboard {dashboard_status}")
            
    except KeyboardInterrupt:
        print("\n\n Detención solicitada por el usuario")
        
    except Exception as e:
        print(f"\n[ERROR] Error en el sistema: {e}")
        
    finally:
        # Limpiar procesos
        print("\n Limpiando procesos...")
        for service_name, process in processes:
            try:
                process.terminate()
                print(f"[OK] {service_name} detenido")
            except:
                pass
        
        print("[OK] Sistema QBTC detenido")

if __name__ == "__main__":
    main()

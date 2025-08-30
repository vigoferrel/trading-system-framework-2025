#!/usr/bin/env python3
"""
DESPLIEGUE SIMPLE - SISTEMA QBTC BANDA 46
Script simplificado para desplegar los servicios principales
"""

import subprocess
import time
import os
from datetime import datetime

def print_banner():
    """Imprime el banner del sistema."""
    print("=" * 80)
    print("[START] DESPLIEGUE SIMPLE - SISTEMA QBTC BANDA 46")
    print("=" * 80)
    print(f" Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("[ENDPOINTS] Banda: 46")
    print(" Puertos: 4601-4606")
    print(" Versión simplificada")
    print("=" * 80)

def clean_ports():
    """Limpia puertos."""
    print(" LIMPIEZA INICIAL")
    print("-" * 50)
    
    try:
        subprocess.run('taskkill /F /IM python.exe 2>nul', shell=True)
        subprocess.run('taskkill /F /IM node.exe 2>nul', shell=True)
        print("[OK] Procesos terminados")
    except:
        pass
    
    time.sleep(2)
    print("[OK] Limpieza completada\n")

def start_service(name, script, port):
    """Inicia un servicio."""
    print(f"[START] Iniciando {name} en puerto {port}...")
    
    try:
        if script.endswith('.js'):
            # Para Node.js
            process = subprocess.Popen(
                ['node', script],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
            )
        else:
            # Para Python
            process = subprocess.Popen(
                ['python', script],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
            )
        
        print(f"[OK] {name} iniciado (PID: {process.pid})")
        return process
        
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        return None

def deploy_services():
    """Despliega todos los servicios."""
    print("[START] DESPLIEGUE DE SERVICIOS")
    print("-" * 50)
    
    services = [
        {
            "name": "QBTC Core",
            "script": "core-system-organized.js",
            "port": 4602,
            "description": "Core del sistema QBTC"
        },
        {
            "name": "SRONA API",
            "script": "srona-api-server.py",
            "port": 4601,
            "description": "API de opciones"
        },
        {
            "name": "Frontend API",
            "script": "frontend-api-server.py",
            "port": 4603,
            "description": "API del frontend"
        },
        {
            "name": "Vigo Futures",
            "script": "vigo-futures-server.py",
            "port": 4604,
            "description": "Sistema de futuros"
        },
        {
            "name": "Dashboard QBTC",
            "script": "dashboard-http.py",
            "port": 4605,
            "description": "Dashboard"
        },
        {
            "name": "Monitor de Gráficos",
            "script": "monitor-graficos-server-simple.py",
            "port": 4606,
            "description": "Monitor de gráficos"
        }
    ]
    
    processes = []
    successful = 0
    
    for i, service in enumerate(services, 1):
        print(f"\n[{i}/{len(services)}] {service['name']}")
        
        if os.path.exists(service["script"]):
            process = start_service(service["name"], service["script"], service["port"])
            if process:
                processes.append(service)
                successful += 1
        else:
            print(f"[WARNING] No encontrado: {service['script']}")
        
        time.sleep(1)
    
    print(f"\n[DATA] {successful}/{len(services)} servicios iniciados")
    return processes

def print_status():
    """Imprime el estado del sistema."""
    print("\n" + "=" * 80)
    print("[DATA] ESTADO DEL SISTEMA QBTC BANDA 46")
    print("=" * 80)
    
    print("\n[API] ACCESO A SERVICIOS:")
    print(" SRONA API: http://localhost:4601")
    print(" QBTC Core: http://localhost:4602")
    print(" Frontend API: http://localhost:4603")
    print(" Vigo Futures: http://localhost:4604")
    print(" Dashboard QBTC: http://localhost:4605")
    print(" Monitor de Gráficos: http://localhost:4606")
    
    print("\n[LIST] COMANDOS ÚTILES:")
    print(" Verificar: curl http://localhost:4601/health")
    print(" Detener: taskkill /F /IM python.exe & taskkill /F /IM node.exe")
    print(" Reiniciar: python deploy-banda-46-simple.py")
    
    print("\n[ENDPOINTS] SERVICIOS EN SEGUNDO PLANO:")
    print(" Los servicios están ejecutándose en background")
    print(" Puedes interactuar con el sistema")
    print(" Para detener: usa los comandos de arriba")
    
    print("\n" + "=" * 80)

def main():
    """Función principal."""
    print_banner()
    
    # Limpieza inicial
    clean_ports()
    
    # Desplegar servicios
    processes = deploy_services()
    
    if processes:
        print_status()
        print(f"\n[ENDPOINTS] ¡Sistema QBTC Banda 46 desplegado!")
        print(" Abre http://localhost:4606 para el monitor")
        print(" Servicios en segundo plano - ¡Listo para usar!")
    else:
        print("\n[ERROR] No se pudo desplegar el sistema")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
DESPLIEGUE OCULTO - SISTEMA QBTC BANDA 46
Script para desplegar los servicios en modo background/hidden
"""

import subprocess
import time
import sys
import os
import signal
from datetime import datetime

def print_banner():
    """Imprime el banner del sistema."""
    print("=" * 80)
    print("[START] DESPLIEGUE OCULTO - SISTEMA QBTC BANDA 46")
    print("=" * 80)
    print(f" Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("[ENDPOINTS] Banda: 46")
    print(" Puertos: 4601-4606")
    print(" Modo: Background/Hidden")
    print(" Servicios en segundo plano")
    print("=" * 80)

def clean_ports():
    """Limpia puertos usando comandos del sistema."""
    print(" LIMPIEZA INICIAL DE PUERTOS")
    print("-" * 50)
    
    try:
        # Detener procesos Python y Node
        subprocess.run('taskkill /F /IM python.exe 2>nul', shell=True)
        subprocess.run('taskkill /F /IM node.exe 2>nul', shell=True)
        print("[OK] Procesos Python y Node terminados")
    except:
        pass
    
    time.sleep(3)
    print("[OK] Limpieza de puertos completada\n")

def start_service_hidden(name, script, port):
    """Inicia un servicio en modo background/hidden."""
    print(f"[START] Iniciando {name} en puerto {port} (modo oculto)...")
    
    try:
        # Usar STARTUPINFO para ocultar la ventana en Windows
        startupinfo = subprocess.STARTUPINFO()
        startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        startupinfo.wShowWindow = subprocess.SW_HIDE
        
        # Iniciar proceso en background
        if script.endswith('.js'):
            # Para archivos Node.js
            process = subprocess.Popen(
                ['node', script],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                startupinfo=startupinfo,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
            )
        else:
            # Para archivos Python
            process = subprocess.Popen(
                ['python', script],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                startupinfo=startupinfo,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP
            )
        
        print(f"[OK] {name} iniciado correctamente (PID: {process.pid})")
        return process
        
    except Exception as e:
        print(f"[ERROR] Error iniciando {name}: {e}")
        return None

def deploy_services_hidden():
    """Despliega todos los servicios en modo hidden."""
    print("[START] DESPLIEGUE DE SERVICIOS EN MODO OCULTO")
    print("-" * 50)
    
    services = [
        {
            "name": "QBTC Core",
            "script": "core-system-organized.js",
            "port": 4602,
            "description": "Core del sistema QBTC - Sistema cuántico organizado"
        },
        {
            "name": "SRONA API",
            "script": "srona-api-server.py",
            "port": 4601,
            "description": "API de opciones y contexto neural"
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
            "description": "Monitoreo y visualización"
        },
        {
            "name": "Monitor de Gráficos",
            "script": "monitor-graficos-server-simple.py",
            "port": 4606,
            "description": "Visualización de gráficos en tiempo real"
        }
    ]
    
    processes = []
    successful_services = 0
    
    for i, service in enumerate(services, 1):
        print(f"\n[{i}/{len(services)}] {service['name']} - Puerto {service['port']}")
        print(f"   Descripción: {service['description']}")
        
        if os.path.exists(service["script"]):
            process = start_service_hidden(service["name"], service["script"], service["port"])
            if process:
                processes.append({
                    "name": service["name"],
                    "process": process,
                    "port": service["port"],
                    "description": service["description"]
                })
                successful_services += 1
            else:
                print(f"[ERROR] Falló el inicio de {service['name']}")
        else:
            print(f"[WARNING] Script no encontrado: {service['script']}")
        
        time.sleep(2)  # Pausa entre servicios
    
    print(f"\n[DATA] Resumen: {successful_services}/{len(services)} servicios iniciados correctamente")
    return processes

def verify_services_hidden(processes):
    """Verifica que los servicios estén funcionando."""
    print("\n[SEARCH] VERIFICACIÓN DE SERVICIOS")
    print("-" * 50)
    
    working_services = 0
    total_services = len(processes)
    
    for service in processes:
        try:
            if service["process"].poll() is None:
                print(f"[OK] {service['name']} - Puerto {service['port']} - FUNCIONANDO")
                working_services += 1
            else:
                print(f"[ERROR] {service['name']} - Puerto {service['port']} - INACTIVO")
        except Exception as e:
            print(f"[ERROR] {service['name']} - Puerto {service['port']} - ERROR: {e}")
    
    print(f"\n[DATA] Resumen: {working_services}/{total_services} servicios funcionando")
    
    if working_services == total_services:
        print(" ¡Todos los servicios están funcionando correctamente!")
    elif working_services > 0:
        print("[WARNING] Algunos servicios están funcionando")
    else:
        print("[ERROR] Ningún servicio está funcionando")
    
    return working_services

def print_status_hidden(processes):
    """Imprime el estado del sistema."""
    print("\n" + "=" * 80)
    print("[DATA] ESTADO DEL SISTEMA QBTC BANDA 46 (MODO OCULTO)")
    print("=" * 80)
    
    print("\n SERVICIOS ACTIVOS:")
    for service in processes:
        try:
            if service["process"].poll() is None:
                print(f"[OK] {service['name']} - Puerto {service['port']} - PID: {service['process'].pid}")
            else:
                print(f"[ERROR] {service['name']} - Puerto {service['port']} - INACTIVO")
        except Exception as e:
            print(f"[ERROR] {service['name']} - Puerto {service['port']} - ERROR: {e}")
    
    print("\n[API] ACCESO A SERVICIOS:")
    print(" SRONA API: http://localhost:4601")
    print(" QBTC Core: http://localhost:4602")
    print(" Frontend API: http://localhost:4603")
    print(" Vigo Futures: http://localhost:4604")
    print(" Dashboard QBTC: http://localhost:4605")
    print(" Monitor de Gráficos: http://localhost:4606")
    
    print("\n[LIST] COMANDOS ÚTILES:")
    print(" Verificar servicios: curl http://localhost:4601/health")
    print(" Verificar QBTC Core: curl http://localhost:4602/api/futures-data")
    print(" Detener todos: taskkill /F /IM python.exe & taskkill /F /IM node.exe")
    print(" Reiniciar: python deploy-banda-46-hidden.py")
    
    print("\n[ENDPOINTS] SERVICIOS EN SEGUNDO PLANO:")
    print(" Los servicios están ejecutándose en modo oculto")
    print(" Puedes interactuar con ellos sin interferencias")
    print(" Para detener: usa los comandos de arriba")
    
    print("\n" + "=" * 80)

def main():
    """Función principal."""
    print_banner()
    
    # Limpieza inicial
    clean_ports()
    
    # Desplegar servicios
    processes = deploy_services_hidden()
    
    if not processes:
        print("[ERROR] No se pudo iniciar ningún servicio")
        return
    
    # Verificar servicios
    working_count = verify_services_hidden(processes)
    
    # Mostrar estado
    print_status_hidden(processes)
    
    if working_count > 0:
        print(f"\n[ENDPOINTS] ¡Sistema QBTC Banda 46 desplegado en modo oculto! ({working_count} servicios activos)")
        print(" Abre http://localhost:4606 para acceder al monitor de gráficos")
        print(" Los servicios están ejecutándose en segundo plano")
        print(" Puedes interactuar con el sistema sin interferencias")
    else:
        print("\n[ERROR] Sistema QBTC Banda 46 no pudo ser desplegado correctamente")
    
    print("\n[OK] Despliegue completado. Los servicios están ejecutándose en segundo plano.")
    print("[START] ¡Listo para interactuar con el sistema!")

if __name__ == "__main__":
    main()

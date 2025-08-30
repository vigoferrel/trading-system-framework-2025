#!/usr/bin/env python3
"""
DESPLIEGUE UNIFICADO - SISTEMA QBTC BANDA 46
Script para limpiar puertos y desplegar todos los servicios de la banda 46
"""

import subprocess
import time
import sys
import os
import signal
import psutil
from datetime import datetime

def print_banner():
    """Imprime el banner del sistema."""
    print("=" * 80)
    print("[START] DESPLIEGUE UNIFICADO - SISTEMA QBTC BANDA 46")
    print("=" * 80)
    print(f" Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("[ENDPOINTS] Banda: 46")
    print(" Puertos: 4601-4606")
    print(" Limpieza automática de puertos")
    print("=" * 80)

def clean_ports():
    """Limpia todos los puertos de la banda 46."""
    print(" LIMPIEZA INICIAL DE PUERTOS")
    print("-" * 50)
    
    ports_to_clean = [4601, 4602, 4603, 4604, 4605, 4606]
    
    for port in ports_to_clean:
        try:
            # Buscar procesos que usen el puerto
            for proc in psutil.process_iter(['pid', 'name', 'connections']):
                try:
                    connections = proc.info['connections']
                    if connections:
                        for conn in connections:
                            if conn.laddr.port == port:
                                print(f" Terminando proceso {proc.info['name']} (PID: {proc.info['pid']}) en puerto {port}")
                                proc.terminate()
                                proc.wait(timeout=5)
                                print(f"[OK] Proceso terminado en puerto {port}")
                                break
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.TimeoutExpired):
                    continue
        except Exception as e:
            print(f"[WARNING] Error limpiando puerto {port}: {e}")
    
    # Esperar un momento para que los puertos se liberen
    time.sleep(3)
    print("[OK] Limpieza de puertos completada\n")

def kill_existing_processes():
    """Mata procesos existentes de Python y Node que puedan interferir."""
    print(" TERMINANDO PROCESOS EXISTENTES")
    print("-" * 50)
    
    try:
        # Terminar procesos Python relacionados con QBTC
        python_processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                if proc.info['name'] == 'python.exe':
                    cmdline = proc.info['cmdline']
                    if cmdline and any('qbtc' in arg.lower() or 'dashboard' in arg.lower() or 'backend' in arg.lower() for arg in cmdline):
                        python_processes.append(proc)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        
        for proc in python_processes:
            try:
                print(f" Terminando proceso Python: {proc.info['cmdline']}")
                proc.terminate()
                proc.wait(timeout=5)
            except (psutil.NoSuchProcess, psutil.TimeoutExpired):
                proc.kill()
        
        # Terminar procesos Node relacionados con QBTC
        node_processes = []
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                if proc.info['name'] == 'node.exe':
                    cmdline = proc.info['cmdline']
                    if cmdline and any('core-system' in arg.lower() for arg in cmdline):
                        node_processes.append(proc)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        
        for proc in node_processes:
            try:
                print(f" Terminando proceso Node: {proc.info['cmdline']}")
                proc.terminate()
                proc.wait(timeout=5)
            except (psutil.NoSuchProcess, psutil.TimeoutExpired):
                proc.kill()
        
        time.sleep(2)
        print("[OK] Procesos existentes terminados\n")
        
    except Exception as e:
        print(f"[WARNING] Error terminando procesos: {e}\n")

def check_ports():
    """Verifica que los puertos estén libres."""
    print("[SEARCH] VERIFICANDO PUERTOS")
    print("-" * 50)
    
    ports = [4601, 4602, 4603, 4604, 4605, 4606]
    busy_ports = []
    
    for port in ports:
        try:
            import socket
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            
            if result == 0:
                busy_ports.append(port)
                print(f"[ERROR] Puerto {port} está ocupado")
            else:
                print(f"[OK] Puerto {port} está libre")
                
        except Exception as e:
            print(f"[WARNING] Error verificando puerto {port}: {e}")
    
    if busy_ports:
        print(f"\n[WARNING] Puertos ocupados: {busy_ports}")
        print("[RELOAD] Intentando limpieza adicional...")
        clean_ports()
        
        # Verificar nuevamente
        time.sleep(2)
        for port in busy_ports:
            try:
                import socket
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                result = sock.connect_ex(('localhost', port))
                sock.close()
                
                if result == 0:
                    print(f"[ERROR] Puerto {port} sigue ocupado después de la limpieza")
                else:
                    print(f"[OK] Puerto {port} liberado después de la limpieza")
                    
            except Exception as e:
                print(f"[WARNING] Error verificando puerto {port}: {e}")
    
    print("[OK] Verificación de puertos completada\n")

def start_service(service_name, script_path, port):
    """Inicia un servicio en segundo plano."""
    try:
        print(f"[START] Iniciando {service_name} en puerto {port}...")
        
        # Comando para iniciar el servicio
        if script_path.endswith('.py'):
            cmd = [sys.executable, script_path]
        else:
            cmd = ['node', script_path]
        
        # Iniciar proceso en segundo plano
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Esperar un momento para que el servicio se inicie
        time.sleep(3)
        
        # Verificar si el proceso está corriendo
        if process.poll() is None:
            print(f"[OK] {service_name} iniciado correctamente (PID: {process.pid})")
            return process
        else:
            stdout, stderr = process.communicate()
            print(f"[ERROR] Error iniciando {service_name}: {stderr}")
            return None
            
    except Exception as e:
        print(f"[ERROR] Error iniciando {service_name}: {e}")
        return None

def deploy_services():
    """Despliega todos los servicios de la banda 46."""
    print("[START] DESPLIEGUE UNIFICADO DE SERVICIOS")
    print("-" * 50)
    
    services = [
        {
            "name": "SRONA API",
            "script": "srona-api-server.py",
            "port": 4601,
            "description": "API de opciones y contexto neural"
        },
        {
            "name": "QBTC Core",
            "script": "core-system-organized.js",
            "port": 4602,
            "description": "Core del sistema QBTC"
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
    
    for i, service in enumerate(services, 1):
        print(f"\n[{i}/{len(services)}] {service['name']} - Puerto {service['port']}")
        print(f"   Descripción: {service['description']}")
        
        if os.path.exists(service["script"]):
            process = start_service(service["name"], service["script"], service["port"])
            if process:
                processes.append({
                    "name": service["name"],
                    "process": process,
                    "port": service["port"],
                    "description": service["description"]
                })
            else:
                print(f"[ERROR] Falló el inicio de {service['name']}")
        else:
            print(f"[WARNING] Script no encontrado: {service['script']}")
        
        time.sleep(2)  # Pausa entre servicios
    
    return processes

def start_backend_real():
    """Inicia el Backend Real."""
    print("\n[RELOAD] INICIANDO BACKEND REAL")
    print("-" * 50)
    
    if os.path.exists("backend-real-fixed.py"):
        try:
            print("[START] Iniciando Backend Real...")
            process = subprocess.Popen(
                [sys.executable, "backend-real-fixed.py"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            time.sleep(3)
            
            if process.poll() is None:
                print("[OK] Backend Real iniciado correctamente")
                return process
            else:
                stdout, stderr = process.communicate()
                print(f"[ERROR] Error iniciando Backend Real: {stderr}")
                return None
                
        except Exception as e:
            print(f"[ERROR] Error iniciando Backend Real: {e}")
            return None
    else:
        print("[WARNING] Script backend-real-fixed.py no encontrado")
        return None

def verify_services(processes):
    """Verifica que todos los servicios estén funcionando."""
    print("\n[SEARCH] VERIFICACIÓN DE SERVICIOS")
    print("-" * 50)
    
    working_services = 0
    total_services = len(processes)
    
    for service in processes:
        if service["process"].poll() is None:
            print(f"[OK] {service['name']} - Puerto {service['port']} - FUNCIONANDO")
            working_services += 1
        else:
            print(f"[ERROR] {service['name']} - Puerto {service['port']} - INACTIVO")
    
    print(f"\n[DATA] Resumen: {working_services}/{total_services} servicios funcionando")
    
    if working_services == total_services:
        print(" ¡Todos los servicios están funcionando correctamente!")
    else:
        print("[WARNING] Algunos servicios no están funcionando")
    
    return working_services == total_services

def print_status(processes, backend_process):
    """Imprime el estado del sistema."""
    print("\n" + "=" * 80)
    print("[DATA] ESTADO DEL SISTEMA QBTC BANDA 46")
    print("=" * 80)
    
    print("\n SERVICIOS ACTIVOS:")
    for service in processes:
        if service["process"].poll() is None:
            print(f"[OK] {service['name']} - Puerto {service['port']} - PID: {service['process'].pid}")
        else:
            print(f"[ERROR] {service['name']} - Puerto {service['port']} - INACTIVO")
    
    print(f"\n[RELOAD] BACKEND REAL:")
    if backend_process and backend_process.poll() is None:
        print(f"[OK] Backend Real - PID: {backend_process.pid}")
    else:
        print("[ERROR] Backend Real - INACTIVO")
    
    print("\n[API] ACCESO A SERVICIOS:")
    print(" SRONA API: http://localhost:4601")
    print(" QBTC Core: http://localhost:4602")
    print(" Frontend API: http://localhost:4603")
    print(" Vigo Futures: http://localhost:4604")
    print(" Dashboard QBTC: http://localhost:4605")
    print(" Monitor de Gráficos: http://localhost:4606")
    
    print("\n[LIST] COMANDOS ÚTILES:")
    print(" Verificar servicios: python check-backend-fixed.py")
    print(" Detener todos: taskkill /F /IM python.exe && taskkill /F /IM node.exe")
    print(" Reiniciar: python deploy-banda-46.py")
    
    print("\n" + "=" * 80)

def main():
    """Función principal."""
    print_banner()
    
    # Limpieza inicial
    kill_existing_processes()
    clean_ports()
    
    # Verificar puertos
    check_ports()
    
    # Desplegar servicios
    processes = deploy_services()
    
    # Iniciar Backend Real
    backend_process = start_backend_real()
    
    # Verificar servicios
    all_working = verify_services(processes)
    
    # Mostrar estado
    print_status(processes, backend_process)
    
    if all_working:
        print("\n[ENDPOINTS] ¡Sistema QBTC Banda 46 desplegado exitosamente!")
    else:
        print("\n[WARNING] Sistema QBTC Banda 46 desplegado con advertencias")
    
    print(" Abre http://localhost:4605 para acceder al dashboard")
    print("\n Presiona Ctrl+C para detener todos los servicios...")
    
    try:
        # Mantener el script corriendo
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n Deteniendo servicios...")
        
        # Detener procesos
        for service in processes:
            try:
                service["process"].terminate()
                print(f" {service['name']} detenido")
            except:
                pass
        
        if backend_process:
            try:
                backend_process.terminate()
                print(" Backend Real detenido")
            except:
                pass
        
        print("[OK] Todos los servicios detenidos")

if __name__ == "__main__":
    main()

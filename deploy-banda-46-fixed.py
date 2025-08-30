#!/usr/bin/env python3
"""
DESPLIEGUE CORREGIDO - SISTEMA QBTC BANDA 46
Script corregido para desplegar los servicios principales de la banda 46
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
    print("[START] DESPLIEGUE CORREGIDO - SISTEMA QBTC BANDA 46")
    print("=" * 80)
    print(f" Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("[ENDPOINTS] Banda: 46")
    print(" Puertos: 4601-4606")
    print(" Limpieza automática de puertos")
    print(" Manejo mejorado de errores")
    print("=" * 80)

def clean_ports_fixed():
    """Limpia puertos usando comandos del sistema de forma más robusta."""
    print(" LIMPIEZA INICIAL DE PUERTOS")
    print("-" * 50)
    
    ports_to_clean = [4601, 4602, 4603, 4604, 4605, 4606]
    
    for port in ports_to_clean:
        try:
            # Usar netstat para encontrar procesos en el puerto
            result = subprocess.run(
                f'netstat -ano | findstr :{port}',
                shell=True,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.stdout and result.stdout.strip():
                print(f" Encontrado proceso en puerto {port}")
                # Extraer PID y terminar proceso
                lines = result.stdout.strip().split('\n')
                for line in lines:
                    if f':{port}' in line:
                        parts = line.split()
                        if len(parts) >= 5:
                            pid = parts[-1]
                            try:
                                # Intentar terminar el proceso
                                subprocess.run(f'taskkill /F /PID {pid}', shell=True, timeout=5)
                                print(f"[OK] Proceso {pid} terminado en puerto {port}")
                            except subprocess.TimeoutExpired:
                                print(f"[WARNING] Timeout terminando proceso {pid}")
                            except Exception as e:
                                print(f"[WARNING] Error terminando proceso {pid}: {e}")
            else:
                print(f"[OK] Puerto {port} libre")
                
        except subprocess.TimeoutExpired:
            print(f"[WARNING] Timeout verificando puerto {port}")
        except Exception as e:
            print(f"[WARNING] Error verificando puerto {port}: {e}")
    
    time.sleep(3)
    print("[OK] Limpieza de puertos completada\n")

def check_ports_fixed():
    """Verifica que los puertos estén libres de forma más robusta."""
    print("[SEARCH] VERIFICANDO PUERTOS")
    print("-" * 50)
    
    ports = [4601, 4602, 4603, 4604, 4605, 4606]
    busy_ports = []
    
    for port in ports:
        try:
            import socket
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)  # Timeout de 2 segundos
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
        clean_ports_fixed()
        
        # Verificar nuevamente
        time.sleep(2)
        still_busy = []
        for port in busy_ports:
            try:
                import socket
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(2)
                result = sock.connect_ex(('localhost', port))
                sock.close()
                
                if result == 0:
                    still_busy.append(port)
                    print(f"[ERROR] Puerto {port} sigue ocupado después de la limpieza")
                else:
                    print(f"[OK] Puerto {port} liberado después de la limpieza")
                    
            except Exception as e:
                print(f"[WARNING] Error verificando puerto {port}: {e}")
        
        if still_busy:
            print(f"\n[ERROR] Puertos aún ocupados: {still_busy}")
            return False
    
    print("[OK] Todos los puertos están libres\n")
    return True

def start_service_fixed(service_name, script_path, port):
    """Inicia un servicio en segundo plano con mejor manejo de errores."""
    try:
        print(f"[START] Iniciando {service_name} en puerto {port}...")
        
        # Verificar que el script existe
        if not os.path.exists(script_path):
            print(f"[ERROR] Script no encontrado: {script_path}")
            return None
        
        # Comando para iniciar el servicio
        if script_path.endswith('.py'):
            cmd = [sys.executable, script_path]
        else:
            cmd = ['node', script_path]
        
        # Iniciar proceso en segundo plano con mejor manejo
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            text=True,
            creationflags=subprocess.CREATE_NEW_CONSOLE if os.name == 'nt' else 0
        )
        
        # Esperar un momento para que el servicio se inicie
        time.sleep(3)
        
        # Verificar si el proceso está corriendo
        if process.poll() is None:
            print(f"[OK] {service_name} iniciado correctamente (PID: {process.pid})")
            return process
        else:
            print(f"[ERROR] Error iniciando {service_name} - proceso terminado")
            return None
            
    except FileNotFoundError:
        print(f"[ERROR] Comando no encontrado para {service_name}")
        return None
    except Exception as e:
        print(f"[ERROR] Error iniciando {service_name}: {e}")
        return None

def deploy_services_fixed():
    """Despliega los servicios principales de la banda 46 con mejor manejo de errores."""
    print("[START] DESPLIEGUE DE SERVICIOS PRINCIPALES")
    print("-" * 50)
    
    services = [
        {
            "name": "QBTC Core",
            "script": "core-system-organized.js",
            "port": 4602,
            "description": "Core del sistema QBTC - Sistema cuántico organizado (CORREGIDO)"
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
            process = start_service_fixed(service["name"], service["script"], service["port"])
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

def verify_services_fixed(processes):
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

def print_status_fixed(processes):
    """Imprime el estado del sistema."""
    print("\n" + "=" * 80)
    print("[DATA] ESTADO DEL SISTEMA QBTC BANDA 46")
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
    print(" Frontend API: http://localhost:4603")
    print(" Vigo Futures: http://localhost:4604")
    print(" Dashboard QBTC: http://localhost:4605")
    print(" Monitor de Gráficos: http://localhost:4606")
    
    print("\n[LIST] COMANDOS ÚTILES:")
    print(" Verificar servicios: curl http://localhost:4601/health")
    print(" Detener todos: taskkill /F /IM python.exe")
    print(" Reiniciar: python deploy-banda-46-fixed.py")
    
    print("\n" + "=" * 80)

def main():
    """Función principal."""
    print_banner()
    
    # Limpieza inicial
    clean_ports_fixed()
    
    # Verificar puertos
    if not check_ports_fixed():
        print("[ERROR] Algunos puertos están ocupados. Intenta detener los procesos manualmente.")
        print(" Comando: taskkill /F /IM python.exe")
        return
    
    # Desplegar servicios
    processes = deploy_services_fixed()
    
    if not processes:
        print("[ERROR] No se pudo iniciar ningún servicio")
        return
    
    # Verificar servicios
    working_count = verify_services_fixed(processes)
    
    # Mostrar estado
    print_status_fixed(processes)
    
    if working_count > 0:
        print(f"\n[ENDPOINTS] ¡Sistema QBTC Banda 46 desplegado! ({working_count} servicios activos)")
        print(" Abre http://localhost:4606 para acceder al monitor de gráficos")
    else:
        print("\n[ERROR] Sistema QBTC Banda 46 no pudo ser desplegado correctamente")
    
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
        
        print("[OK] Todos los servicios detenidos")

if __name__ == "__main__":
    main()

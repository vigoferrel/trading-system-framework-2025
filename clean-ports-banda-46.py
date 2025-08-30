#!/usr/bin/env python3
"""
LIMPIEZA DE PUERTOS - BANDA 46
Script para limpiar todos los puertos de la banda 46
"""

import psutil
import time
import socket
from datetime import datetime

def print_banner():
    """Imprime el banner del sistema."""
    print("=" * 60)
    print(" LIMPIEZA DE PUERTOS - BANDA 46")
    print("=" * 60)
    print(f" Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("[ENDPOINTS] Banda: 46")
    print(" Puertos: 4601-4605")
    print("=" * 60)

def find_processes_on_ports():
    """Encuentra procesos que usan los puertos de la banda 46."""
    ports = [4601, 4602, 4603, 4604, 4605]
    processes_found = []
    
    print("[SEARCH] Buscando procesos en puertos de la banda 46...")
    
    for port in ports:
        try:
            # Buscar procesos que usen el puerto
            for proc in psutil.process_iter(['pid', 'name', 'connections', 'cmdline']):
                try:
                    connections = proc.info['connections']
                    if connections:
                        for conn in connections:
                            if conn.laddr.port == port:
                                processes_found.append({
                                    'port': port,
                                    'pid': proc.info['pid'],
                                    'name': proc.info['name'],
                                    'cmdline': proc.info['cmdline']
                                })
                                print(f" Puerto {port}: {proc.info['name']} (PID: {proc.info['pid']})")
                                break
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
        except Exception as e:
            print(f"[WARNING] Error buscando en puerto {port}: {e}")
    
    return processes_found

def kill_processes_on_ports():
    """Mata procesos que usan los puertos de la banda 46."""
    ports = [4601, 4602, 4603, 4604, 4605]
    killed_processes = []
    
    print("\n Terminando procesos en puertos de la banda 46...")
    
    for port in ports:
        try:
            # Buscar y terminar procesos que usen el puerto
            for proc in psutil.process_iter(['pid', 'name', 'connections']):
                try:
                    connections = proc.info['connections']
                    if connections:
                        for conn in connections:
                            if conn.laddr.port == port:
                                print(f" Terminando {proc.info['name']} (PID: {proc.info['pid']}) en puerto {port}")
                                
                                try:
                                    proc.terminate()
                                    proc.wait(timeout=5)
                                    killed_processes.append({
                                        'port': port,
                                        'pid': proc.info['pid'],
                                        'name': proc.info['name']
                                    })
                                    print(f"[OK] Proceso terminado en puerto {port}")
                                except psutil.TimeoutExpired:
                                    print(f"[WARNING] Forzando terminación en puerto {port}")
                                    proc.kill()
                                    killed_processes.append({
                                        'port': port,
                                        'pid': proc.info['pid'],
                                        'name': proc.info['name']
                                    })
                                break
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
        except Exception as e:
            print(f"[WARNING] Error terminando procesos en puerto {port}: {e}")
    
    return killed_processes

def verify_ports_free():
    """Verifica que los puertos estén libres."""
    ports = [4601, 4602, 4603, 4604, 4605]
    free_ports = []
    busy_ports = []
    
    print("\n[SEARCH] Verificando que los puertos estén libres...")
    
    for port in ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            
            if result == 0:
                busy_ports.append(port)
                print(f"[ERROR] Puerto {port} sigue ocupado")
            else:
                free_ports.append(port)
                print(f"[OK] Puerto {port} está libre")
                
        except Exception as e:
            print(f"[WARNING] Error verificando puerto {port}: {e}")
    
    return free_ports, busy_ports

def clean_qbtc_processes():
    """Limpia procesos específicos de QBTC."""
    print("\n Limpiando procesos específicos de QBTC...")
    
    qbtc_keywords = ['qbtc', 'dashboard', 'backend', 'core-system', 'srona', 'vigo', 'frontend']
    killed_processes = []
    
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            if proc.info['name'] in ['python.exe', 'node.exe']:
                cmdline = proc.info['cmdline']
                if cmdline:
                    cmdline_str = ' '.join(cmdline).lower()
                    if any(keyword in cmdline_str for keyword in qbtc_keywords):
                        print(f" Terminando proceso QBTC: {proc.info['cmdline']}")
                        
                        try:
                            proc.terminate()
                            proc.wait(timeout=5)
                            killed_processes.append({
                                'pid': proc.info['pid'],
                                'name': proc.info['name'],
                                'cmdline': proc.info['cmdline']
                            })
                        except psutil.TimeoutExpired:
                            proc.kill()
                            killed_processes.append({
                                'pid': proc.info['pid'],
                                'name': proc.info['name'],
                                'cmdline': proc.info['cmdline']
                            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue
    
    return killed_processes

def main():
    """Función principal."""
    print_banner()
    
    # Encontrar procesos existentes
    processes_found = find_processes_on_ports()
    
    if processes_found:
        print(f"\n[DATA] Encontrados {len(processes_found)} procesos en puertos de la banda 46")
        
        # Preguntar al usuario si desea continuar
        response = input("\n¿Desea terminar estos procesos? (y/N): ")
        if response.lower() != 'y':
            print("Limpieza cancelada")
            return
        
        # Terminar procesos en puertos
        killed_processes = kill_processes_on_ports()
        
        # Limpiar procesos específicos de QBTC
        qbtc_killed = clean_qbtc_processes()
        
        # Esperar un momento
        print("\n Esperando que los puertos se liberen...")
        time.sleep(3)
        
        # Verificar puertos
        free_ports, busy_ports = verify_ports_free()
        
        print(f"\n[DATA] RESUMEN DE LIMPIEZA:")
        print(f"[OK] Puertos libres: {len(free_ports)} ({', '.join(map(str, free_ports))})")
        print(f"[ERROR] Puertos ocupados: {len(busy_ports)} ({', '.join(map(str, busy_ports))})")
        print(f" Procesos terminados: {len(killed_processes) + len(qbtc_killed)}")
        
        if len(busy_ports) == 0:
            print("\n ¡Todos los puertos de la banda 46 están libres!")
        else:
            print(f"\n[WARNING] {len(busy_ports)} puertos siguen ocupados")
            print(" Intente ejecutar el script nuevamente o reinicie el sistema")
    
    else:
        print("\n[OK] No se encontraron procesos en los puertos de la banda 46")
        free_ports, busy_ports = verify_ports_free()
        
        if len(busy_ports) == 0:
            print(" ¡Todos los puertos están libres!")
        else:
            print(f"[WARNING] {len(busy_ports)} puertos están ocupados")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()

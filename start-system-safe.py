#!/usr/bin/env python3
"""
START SYSTEM SAFE - QBTC BANDA 46
==================================
Script de inicio seguro que verifica puertos y limpia procesos
antes de iniciar el sistema neural QBTC
"""

import os
import sys
import time
import subprocess
import psutil
import socket
from datetime import datetime

# Configuración de puertos
PORTS_TO_CHECK = [4601, 4602, 4603, 4604, 4605, 4606, 4607]

def check_port_in_use(port):
    """Verifica si un puerto está en uso."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1)
            result = s.connect_ex(('localhost', port))
            return result == 0
    except:
        return False

def kill_processes_by_port(port):
    """Mata procesos que usan un puerto específico."""
    try:
        for proc in psutil.process_iter(['pid', 'name']):
            try:
                proc_obj = psutil.Process(proc.info['pid'])
                connections = proc_obj.net_connections()
                for conn in connections:
                    if hasattr(conn, 'laddr') and conn.laddr.port == port:
                        print(f"[RELOAD] Terminando proceso {proc.info['name']} (PID: {proc.info['pid']}) en puerto {port}")
                        proc_obj.terminate()
                        time.sleep(1)
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
    except Exception as e:
        print(f"[WARNING]  Error terminando procesos en puerto {port}: {e}")

def kill_python_processes():
    """Mata todos los procesos de Python."""
    try:
        for proc in psutil.process_iter(['pid', 'name']):
            if proc.info['name'] == 'python.exe':
                print(f"[RELOAD] Terminando proceso Python (PID: {proc.info['pid']})")
                psutil.Process(proc.info['pid']).terminate()
        time.sleep(2)
    except Exception as e:
        print(f"[WARNING]  Error terminando procesos Python: {e}")

def start_llm_neural_server():
    """Inicia el servidor LLM Neural."""
    print("[START] Iniciando LLM Neural Server...")
    try:
        subprocess.Popen(["node", "llm-neural-server.js"], 
                        stdout=subprocess.PIPE, 
                        stderr=subprocess.PIPE)
        time.sleep(3)
        print("[OK] LLM Neural Server iniciado")
    except Exception as e:
        print(f"[ERROR] Error iniciando LLM Neural Server: {e}")

def start_monitor():
    """Inicia el monitor de recomendaciones."""
    print("[START] Iniciando Monitor de Recomendaciones...")
    try:
        subprocess.Popen([sys.executable, "monitor-recomendaciones-neural.py"], 
                        stdout=subprocess.PIPE, 
                        stderr=subprocess.PIPE)
        time.sleep(3)
        print("[OK] Monitor de Recomendaciones iniciado")
    except Exception as e:
        print(f"[ERROR] Error iniciando Monitor: {e}")

def main():
    """Función principal."""
    print(" START SYSTEM SAFE - QBTC BANDA 46")
    print("=" * 50)
    print(f"Iniciando limpieza: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 1. Verificar puertos en uso
    print("\n1 VERIFICANDO PUERTOS EN USO...")
    ports_in_use = []
    for port in PORTS_TO_CHECK:
        if check_port_in_use(port):
            ports_in_use.append(port)
            print(f"[WARNING]  Puerto {port} está en uso")
    
    if ports_in_use:
        print(f"\n[RELOAD] LIMPIANDO PUERTOS EN USO...")
        for port in ports_in_use:
            kill_processes_by_port(port)
            time.sleep(1)
    
    # 2. Limpiar procesos Python
    print("\n2 LIMPIANDO PROCESOS PYTHON...")
    kill_python_processes()
    
    # 3. Verificar limpieza
    print("\n3 VERIFICANDO LIMPIEZA...")
    time.sleep(2)
    for port in PORTS_TO_CHECK:
        if check_port_in_use(port):
            print(f"[ERROR] Puerto {port} aún en uso")
        else:
            print(f"[OK] Puerto {port} libre")
    
    # 4. Iniciar servicios
    print("\n4 INICIANDO SERVICIOS...")
    
    # Iniciar LLM Neural Server
    start_llm_neural_server()
    
    # Iniciar Monitor
    start_monitor()
    
    # 5. Verificar servicios
    print("\n5 VERIFICANDO SERVICIOS...")
    time.sleep(5)
    
    if check_port_in_use(4607):
        print("[OK] LLM Neural Server funcionando en puerto 4607")
    else:
        print("[ERROR] LLM Neural Server no responde")
    
    if check_port_in_use(4606):
        print("[OK] Monitor funcionando en puerto 4606")
    else:
        print("[ERROR] Monitor no responde")
    
    print("\n[ENDPOINTS] SISTEMA INICIADO SEGURO")
    print("=" * 50)
    print("[DATA] URLs disponibles:")
    print("    LLM Neural: http://localhost:4607")
    print("   [DATA] Monitor: http://localhost:4606")
    print("    Health: http://localhost:4607/health")
    print("   [TEST] Test: http://localhost:4607/api/test-decision")

if __name__ == "__main__":
    main()

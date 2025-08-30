#!/usr/bin/env python3
"""
DIAGNÓSTICO - SISTEMA QBTC BANDA 46
Script para diagnosticar problemas específicos en el sistema
"""

import subprocess
import time
import sys
import os
import socket
from datetime import datetime

def print_banner():
    """Imprime el banner del diagnóstico."""
    print("=" * 80)
    print("[SEARCH] DIAGNÓSTICO - SISTEMA QBTC BANDA 46")
    print("=" * 80)
    print(f" Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("[ENDPOINTS] Banda: 46")
    print(" Puertos: 4601-4606")
    print(" Identificación de problemas específicos")
    print("=" * 80)

def check_python_version():
    """Verifica la versión de Python."""
    print(" VERIFICANDO VERSIÓN DE PYTHON")
    print("-" * 50)
    
    version = sys.version_info
    print(f"Python {version.major}.{version.minor}.{version.micro}")
    
    if version.major == 3 and version.minor >= 8:
        print("[OK] Versión de Python compatible")
    else:
        print("[ERROR] Versión de Python no compatible (requiere 3.8+)")
    
    print()

def check_dependencies():
    """Verifica las dependencias necesarias."""
    print(" VERIFICANDO DEPENDENCIAS")
    print("-" * 50)
    
    dependencies = [
        ('aiohttp', 'aiohttp'),
        ('psutil', 'psutil'),
        ('sqlite3', 'sqlite3'),
        ('json', 'json'),
        ('datetime', 'datetime'),
        ('asyncio', 'asyncio')
    ]
    
    missing_deps = []
    
    for dep_name, import_name in dependencies:
        try:
            __import__(import_name)
            print(f"[OK] {dep_name}")
        except ImportError:
            print(f"[ERROR] {dep_name} - NO INSTALADO")
            missing_deps.append(dep_name)
    
    if missing_deps:
        print(f"\n[WARNING] Dependencias faltantes: {', '.join(missing_deps)}")
        print(" Instalar con: pip install " + " ".join(missing_deps))
    else:
        print("\n[OK] Todas las dependencias están instaladas")
    
    print()

def check_scripts_exist():
    """Verifica que los scripts necesarios existan."""
    print(" VERIFICANDO SCRIPTS")
    print("-" * 50)
    
    scripts = [
        'srona-api-server.py',
        'frontend-api-server.py',
        'vigo-futures-server.py',
        'dashboard-http.py',
        'monitor-graficos-server-simple.py',
        'deploy-banda-46-fixed.py'
    ]
    
    missing_scripts = []
    
    for script in scripts:
        if os.path.exists(script):
            print(f"[OK] {script}")
        else:
            print(f"[ERROR] {script} - NO ENCONTRADO")
            missing_scripts.append(script)
    
    if missing_scripts:
        print(f"\n[WARNING] Scripts faltantes: {', '.join(missing_scripts)}")
    else:
        print("\n[OK] Todos los scripts están presentes")
    
    print()

def check_ports_status():
    """Verifica el estado de los puertos."""
    print(" VERIFICANDO ESTADO DE PUERTOS")
    print("-" * 50)
    
    ports = [4601, 4602, 4603, 4604, 4605, 4606]
    busy_ports = []
    
    for port in ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            
            if result == 0:
                print(f"[ERROR] Puerto {port} - OCUPADO")
                busy_ports.append(port)
            else:
                print(f"[OK] Puerto {port} - LIBRE")
                
        except Exception as e:
            print(f"[WARNING] Puerto {port} - ERROR: {e}")
    
    if busy_ports:
        print(f"\n[WARNING] Puertos ocupados: {busy_ports}")
        print(" Comando para liberar: taskkill /F /IM python.exe")
    else:
        print("\n[OK] Todos los puertos están libres")
    
    print()

def check_processes():
    """Verifica procesos relacionados con QBTC."""
    print("[RELOAD] VERIFICANDO PROCESOS")
    print("-" * 50)
    
    try:
        # Buscar procesos Python relacionados con QBTC
        result = subprocess.run(
            'tasklist /FI "IMAGENAME eq python.exe" /FO CSV',
            shell=True,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.stdout:
            lines = result.stdout.strip().split('\n')[1:]  # Saltar encabezado
            qbtc_processes = []
            
            for line in lines:
                if line and 'python.exe' in line:
                    parts = line.split(',')
                    if len(parts) >= 2:
                        pid = parts[1].strip('"')
                        qbtc_processes.append(pid)
            
            if qbtc_processes:
                print(f"[WARNING] Encontrados {len(qbtc_processes)} procesos Python:")
                for pid in qbtc_processes:
                    print(f"   - PID: {pid}")
                print(" Comando para terminar: taskkill /F /IM python.exe")
            else:
                print("[OK] No hay procesos Python ejecutándose")
        else:
            print("[OK] No hay procesos Python ejecutándose")
            
    except Exception as e:
        print(f"[WARNING] Error verificando procesos: {e}")
    
    print()

def test_individual_services():
    """Prueba servicios individuales."""
    print("[TEST] PROBANDO SERVICIOS INDIVIDUALES")
    print("-" * 50)
    
    services = [
        {
            "name": "Monitor de Gráficos",
            "script": "monitor-graficos-server-simple.py",
            "port": 4606
        }
    ]
    
    for service in services:
        print(f"\n[SEARCH] Probando {service['name']}...")
        
        if not os.path.exists(service["script"]):
            print(f"[ERROR] Script no encontrado: {service['script']}")
            continue
        
        try:
            # Iniciar servicio en proceso separado
            process = subprocess.Popen(
                [sys.executable, service["script"]],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Esperar un momento
            time.sleep(5)
            
            # Verificar si está corriendo
            if process.poll() is None:
                print(f"[OK] {service['name']} iniciado correctamente")
                
                # Verificar puerto
                try:
                    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    sock.settimeout(2)
                    result = sock.connect_ex(('localhost', service["port"]))
                    sock.close()
                    
                    if result == 0:
                        print(f"[OK] Puerto {service['port']} respondiendo")
                    else:
                        print(f"[ERROR] Puerto {service['port']} no responde")
                        
                except Exception as e:
                    print(f"[WARNING] Error verificando puerto: {e}")
                
                # Terminar proceso
                process.terminate()
                process.wait(timeout=5)
                print(f" {service['name']} detenido")
                
            else:
                stdout, stderr = process.communicate()
                print(f"[ERROR] Error iniciando {service['name']}")
                if stderr:
                    print(f"   Error: {stderr}")
                    
        except Exception as e:
            print(f"[ERROR] Error probando {service['name']}: {e}")
    
    print()

def generate_report():
    """Genera un reporte de diagnóstico."""
    print("[DATA] REPORTE DE DIAGNÓSTICO")
    print("-" * 50)
    
    print("[ENDPOINTS] RECOMENDACIONES:")
    print("1. [OK] Usar Python 3.8+")
    print("2. [OK] Instalar dependencias: pip install aiohttp psutil")
    print("3. [OK] Verificar que todos los scripts existan")
    print("4. [OK] Liberar puertos ocupados: taskkill /F /IM python.exe")
    print("5. [OK] Usar deploy-banda-46-fixed.py para despliegue")
    print("6. [OK] Usar monitor-graficos-server-simple.py (no el original)")
    
    print("\n COMANDOS ÚTILES:")
    print(" Limpiar procesos: taskkill /F /IM python.exe")
    print(" Instalar dependencias: pip install aiohttp psutil")
    print(" Desplegar sistema: python deploy-banda-46-fixed.py")
    print(" Probar monitor: python monitor-graficos-server-simple.py")
    print(" Verificar puertos: netstat -ano | findstr :4606")
    
    print("\n ACCESO A SERVICIOS:")
    print(" Monitor de Gráficos: http://localhost:4606")
    print(" Dashboard QBTC: http://localhost:4605")
    print(" SRONA API: http://localhost:4601")
    print(" Frontend API: http://localhost:4603")
    print(" Vigo Futures: http://localhost:4604")

def main():
    """Función principal."""
    print_banner()
    
    # Ejecutar diagnósticos
    check_python_version()
    check_dependencies()
    check_scripts_exist()
    check_ports_status()
    check_processes()
    test_individual_services()
    
    # Generar reporte
    generate_report()
    
    print("\n" + "=" * 80)
    print("[ENDPOINTS] DIAGNÓSTICO COMPLETADO")
    print("=" * 80)

if __name__ == "__main__":
    main()

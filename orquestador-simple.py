#!/usr/bin/env python3
"""
ORQUESTADOR SIMPLE - SISTEMA UNIFICADO QBTC
Versión simplificada y robusta del orquestador de datos.
"""

import asyncio
import aiohttp
import json
import sqlite3
import time
from datetime import datetime

# ENDPOINTS SIMPLIFICADOS
ENDPOINTS = [
    {"name": "health", "url": "http://localhost:4602/health", "freq": 60},
    {"name": "spot_data", "url": "http://localhost:4602/api/spot-data", "freq": 30},
    {"name": "futures_data", "url": "http://localhost:4602/api/futures-data", "freq": 30},
    {"name": "quantum_metrics", "url": "http://localhost:4602/api/quantum-metrics", "freq": 45}
]

class OrquestadorSimple:
    def __init__(self, db_path="datos_simple.db"):
        self.db_path = db_path
        self.session = None
        self.is_running = False
        self.captured_count = 0
        self.error_count = 0
        self.start_time = None
        self.last_capture = {}
        
        self.init_db()
        print("[START] ORQUESTADOR SIMPLE - INICIANDO")
        print(f"[DATA] Base de datos: {self.db_path}")
        print(f"[ENDPOINTS] Endpoints: {len(ENDPOINTS)}")
        
    def init_db(self):
        """Inicializa la base de datos."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS captured_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                endpoint_name TEXT NOT NULL,
                timestamp DATETIME NOT NULL,
                data_json TEXT NOT NULL,
                success BOOLEAN NOT NULL,
                response_time REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        print("[OK] Base de datos inicializada")
    
    async def start(self):
        """Inicia el orquestador."""
        self.is_running = True
        self.start_time = datetime.now()
        
        timeout = aiohttp.ClientTimeout(total=10)
        self.session = aiohttp.ClientSession(timeout=timeout)
        
        try:
            await self.run_capture()
        except KeyboardInterrupt:
            print(" Detención solicitada")
        finally:
            await self.cleanup()
    
    async def run_capture(self):
        """Ejecuta la captura de datos."""
        print(" Iniciando captura de datos...")
        
        while self.is_running:
            start_cycle = time.time()
            
            # Crear tareas para endpoints disponibles
            tasks = []
            for endpoint in ENDPOINTS:
                if self.should_capture(endpoint):
                    tasks.append(self.capture_endpoint(endpoint))
            
            # Ejecutar tareas en paralelo
            if tasks:
                results = await asyncio.gather(*tasks, return_exceptions=True)
                
                for result in results:
                    if isinstance(result, Exception):
                        self.error_count += 1
                        print(f"[ERROR] Error: {result}")
                    elif result:
                        self.captured_count += 1
            
            # Mostrar estadísticas
            cycle_time = time.time() - start_cycle
            self.show_stats(cycle_time)
            
            # Esperar antes del siguiente ciclo
            await asyncio.sleep(20)
    
    def should_capture(self, endpoint):
        """Determina si se debe capturar datos."""
        name = endpoint["name"]
        freq = endpoint["freq"]
        
        if name not in self.last_capture:
            return True
        
        time_since = time.time() - self.last_capture[name]
        return time_since >= freq
    
    async def capture_endpoint(self, endpoint):
        """Captura datos de un endpoint específico."""
        start_time = time.time()
        
        try:
            async with self.session.get(endpoint["url"]) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Almacenar datos
                    await self.store_data(endpoint["name"], data, True, time.time() - start_time)
                    
                    # Actualizar timestamp
                    self.last_capture[endpoint["name"]] = time.time()
                    
                    print(f"[OK] {endpoint['name']}: Datos capturados")
                    return True
                else:
                    raise Exception(f"HTTP {response.status}")
                    
        except Exception as e:
            await self.store_data(endpoint["name"], {"error": str(e)}, False, 0)
            print(f"[ERROR] {endpoint['name']}: {e}")
            return False
    
    async def store_data(self, endpoint_name, data, success, response_time):
        """Almacena datos en la base de datos."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO captured_data (endpoint_name, timestamp, data_json, success, response_time)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            endpoint_name,
            datetime.now().isoformat(),
            json.dumps(data),
            success,
            response_time
        ))
        
        conn.commit()
        conn.close()
    
    def show_stats(self, cycle_time):
        """Muestra estadísticas."""
        if self.start_time:
            uptime = datetime.now() - self.start_time
            uptime_str = str(uptime).split('.')[0]
            
            print("=" * 50)
            print(f"[DATA] ESTADÍSTICAS")
            print(f"  Uptime: {uptime_str}")
            print(f"[UP] Capturados: {self.captured_count}")
            print(f"[ERROR] Errores: {self.error_count}")
            print(f"[RELOAD] Ciclo: {cycle_time:.2f}s")
            print("=" * 50)
    
    async def cleanup(self):
        """Limpia recursos."""
        print(" Limpiando recursos...")
        
        if self.session:
            await self.session.close()
        
        self.is_running = False
        print("[OK] Orquestador detenido")

async def main():
    """Función principal."""
    print("=" * 60)
    print("[START] ORQUESTADOR SIMPLE - SISTEMA UNIFICADO QBTC")
    print("=" * 60)
    print("[DATA] Automatización simplificada de captura de datos")
    print(" Backend en Python con base de datos SQLite")
    print("[ENDPOINTS] Versión robusta y estable")
    print("=" * 60)
    
    orquestador = OrquestadorSimple()
    
    try:
        await orquestador.start()
    except KeyboardInterrupt:
        print("\n Detención solicitada por el usuario")
    except Exception as e:
        print(f"\n[ERROR] Error fatal: {e}")

if __name__ == "__main__":
    asyncio.run(main())

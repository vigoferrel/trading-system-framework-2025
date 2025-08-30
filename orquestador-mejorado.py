#!/usr/bin/env python3
"""
ORQUESTADOR DE DATOS MEJORADO - SISTEMA UNIFICADO QBTC
Versión mejorada con mejor manejo de errores y logging detallado.
"""

import asyncio
import aiohttp
import json
import sqlite3
import time
import logging
from datetime import datetime
from typing import Dict, List

# CONSTANTES FÍSICAS REALES
PHYSICAL_CONSTANTS = {
    "QUANTUM_COHERENCE": 0.75,
    "QUANTUM_CONSCIOUSNESS": 0.8,
    "QUANTUM_ENTANGLEMENT": 0.65,
    "QUANTUM_SUPERPOSITION": 0.7,
    "QUANTUM_TUNNELING": 0.6,
    "MARKET_VOLATILITY": 0.05,
    "MARKET_MOMENTUM": 0.1,
    "MARKET_LIQUIDITY": 0.75,
    "MARKET_SPREAD": 0.001,
    "MARKET_DEPTH": 500000,
    "FUNDING_RATE": 0.02,
    "FUNDING_VOLATILITY": 0.01,
    "FUNDING_DEVIATION": 0.5,
    "FUNDING_ANNUALIZED": 5,
    "LIQUIDATION_PROBABILITY": 0.05,
    "SLIPPAGE_RATE": 0.0025,
    "VOLATILITY_RISK": 0.1,
    "EXECUTION_RISK": 0.005,
    "VOLUME_24H": 500000,
    "VOLUME_RATIO": 0.75,
    "VOLUME_EXPANSION": 300000,
    "PRICE_CHANGE": 0.02,
    "PRICE_ACCELERATION": 0.015,
    "PRICE_MOMENTUM": 0.01,
    "TIME_TO_FUNDING": 1800000,
    "SESSION_INTENSITY": 0.6,
    "TEMPORAL_RESONANCE": 0.7,
    "FIBONACCI_STRENGTH": 0.75,
    "FIBONACCI_INDEX": 5,
    "NEURAL_CONFIDENCE": 0.85,
    "NEURAL_COHERENCE": 0.8,
    "NEURAL_ENTANGLEMENT": 0.7,
    "BASE_LEVERAGE": 15,
    "CONSERVATIVE_LEVERAGE": 10,
    "AGGRESSIVE_LEVERAGE": 25,
    "STOP_LOSS": 0.03,
    "TAKE_PROFIT": 0.06,
    "BASE_SCORE": 0.65,
    "CONFIDENCE_SCORE": 0.75,
    "QUALITY_SCORE": 0.8
}

# CONFIGURACIÓN DE LOGGING
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('orquestador_mejorado.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ENDPOINTS CON MEJOR MANEJO DE ERRORES
ENDPOINTS = [
    {"name": "spot_data", "url": "http://localhost:4602/api/spot-data", "freq": 30, "timeout": 5},
    {"name": "futures_data", "url": "http://localhost:4602/api/futures-data", "freq": 30, "timeout": 5},
    {"name": "quantum_metrics", "url": "http://localhost:4602/api/quantum-metrics", "freq": 45, "timeout": 8},
    {"name": "health", "url": "http://localhost:4602/health", "freq": 60, "timeout": 3},
    {"name": "options_data", "url": "http://localhost:4601/api/options-data", "freq": 60, "timeout": 10},
    {"name": "neural_context", "url": "http://localhost:4601/api/neural-context", "freq": 90, "timeout": 10},
    {"name": "frontend_status", "url": "http://localhost:4603/api/status", "freq": 120, "timeout": 5}
]

class OrquestadorMejorado:
    def __init__(self, db_path="datos_mejorados.db"):
        self.db_path = db_path
        self.session = None
        self.is_running = False
        self.captured_count = 0
        self.error_count = 0
        self.start_time = None
        self.last_capture = {}
        self.retry_count = {}
        
        self.init_db()
        logger.info("[START] ORQUESTADOR MEJORADO - INICIANDO")
        logger.info(f"[DATA] Base de datos: {self.db_path}")
        logger.info(f"[ENDPOINTS] Endpoints: {len(ENDPOINTS)}")
        
    def init_db(self):
        """Inicializa la base de datos."""
        try:
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
                    error_message TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS metrics (
                    endpoint_name TEXT PRIMARY KEY,
                    success_count INTEGER DEFAULT 0,
                    error_count INTEGER DEFAULT 0,
                    avg_response_time REAL DEFAULT 0,
                    last_success DATETIME,
                    last_error DATETIME,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("[OK] Base de datos inicializada")
            
        except Exception as e:
            logger.error(f"[ERROR] Error inicializando base de datos: {e}")
            raise
    
    async def start(self):
        """Inicia el orquestador."""
        self.is_running = True
        self.start_time = datetime.now()
        
        # Configuración de sesión HTTP más robusta
        timeout = aiohttp.ClientTimeout(total=30, connect=10)
        connector = aiohttp.TCPConnector(
            limit=100,
            limit_per_host=30,
            ttl_dns_cache=300,
            use_dns_cache=True,
            keepalive_timeout=30
        )
        
        self.session = aiohttp.ClientSession(
            timeout=timeout,
            connector=connector,
            headers={'User-Agent': 'QBTC-Orchestrator/1.0'}
        )
        
        try:
            await self.run_capture()
        except KeyboardInterrupt:
            logger.info(" Detención solicitada")
        except Exception as e:
            logger.error(f"[ERROR] Error en el orquestador: {e}")
        finally:
            await self.cleanup()
    
    async def run_capture(self):
        """Ejecuta la captura de datos con mejor manejo de errores."""
        logger.info(" Iniciando captura de datos...")
        
        while self.is_running:
            start_cycle = time.time()
            
            # Crear tareas para endpoints disponibles
            tasks = []
            for endpoint in ENDPOINTS:
                if self.should_capture(endpoint):
                    tasks.append(self.capture_endpoint_safe(endpoint))
            
            # Ejecutar tareas en paralelo con límite de concurrencia
            if tasks:
                # Limitar concurrencia para evitar sobrecarga
                semaphore = asyncio.Semaphore(5)
                async def limited_capture(endpoint):
                    async with semaphore:
                        return await self.capture_endpoint_safe(endpoint)
                
                limited_tasks = [limited_capture(endpoint) for endpoint in ENDPOINTS if self.should_capture(endpoint)]
                
                try:
                    results = await asyncio.gather(*limited_tasks, return_exceptions=True)
                    
                    for result in results:
                        if isinstance(result, Exception):
                            self.error_count += 1
                            logger.error(f"[ERROR] Error en captura: {result}")
                        elif result:
                            self.captured_count += 1
                            
                except Exception as e:
                    logger.error(f"[ERROR] Error en ciclo de captura: {e}")
            
            # Mostrar estadísticas
            cycle_time = time.time() - start_cycle
            self.show_stats(cycle_time)
            
            # Esperar antes del siguiente ciclo
            await asyncio.sleep(15)
    
    def should_capture(self, endpoint):
        """Determina si se debe capturar datos."""
        name = endpoint["name"]
        freq = endpoint["freq"]
        
        if name not in self.last_capture:
            return True
        
        time_since = time.time() - self.last_capture[name]
        return time_since >= freq
    
    async def capture_endpoint_safe(self, endpoint):
        """Captura datos de un endpoint con manejo seguro de errores."""
        start_time = time.time()
        name = endpoint["name"]
        
        try:
            # Configurar timeout específico para este endpoint
            timeout = aiohttp.ClientTimeout(total=endpoint.get("timeout", 10))
            
            async with self.session.get(endpoint["url"], timeout=timeout) as response:
                response_time = time.time() - start_time
                
                if response.status == 200:
                    data = await response.json()
                    
                    # Almacenar datos
                    await self.store_data(name, data, True, response_time)
                    
                    # Actualizar timestamp y resetear contador de reintentos
                    self.last_capture[name] = time.time()
                    self.retry_count[name] = 0
                    
                    logger.info(f"[OK] {name}: Datos capturados ({response_time:.2f}s)")
                    return True
                else:
                    raise Exception(f"HTTP {response.status}")
                    
        except asyncio.TimeoutError:
            await self.handle_error(name, "TIMEOUT", response_time)
            return False
        except aiohttp.ClientError as e:
            await self.handle_error(name, f"CLIENT_ERROR: {e}", response_time)
            return False
        except Exception as e:
            await self.handle_error(name, f"ERROR: {e}", response_time)
            return False
    
    async def handle_error(self, endpoint_name, error_msg, response_time):
        """Maneja errores de manera centralizada."""
        # Incrementar contador de reintentos
        self.retry_count[endpoint_name] = self.retry_count.get(endpoint_name, 0) + 1
        
        # Almacenar error
        await self.store_data(endpoint_name, {"error": error_msg}, False, response_time)
        
        # Log del error
        retry_count = self.retry_count[endpoint_name]
        if retry_count <= 3:
            logger.warning(f"[WARNING] {endpoint_name}: {error_msg} (intento {retry_count}/3)")
        else:
            logger.error(f"[ERROR] {endpoint_name}: {error_msg} (máximo de reintentos alcanzado)")
    
    async def store_data(self, endpoint_name, data, success, response_time):
        """Almacena datos en la base de datos."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            error_message = data.get("error", "") if not success else ""
            
            # Insertar datos capturados
            cursor.execute('''
                INSERT INTO captured_data (endpoint_name, timestamp, data_json, success, response_time, error_message)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                endpoint_name,
                datetime.now().isoformat(),
                json.dumps(data),
                success,
                response_time,
                error_message
            ))
            
            # Actualizar métricas
            if success:
                cursor.execute('''
                    INSERT OR REPLACE INTO metrics 
                    (endpoint_name, success_count, last_success, avg_response_time, updated_at)
                    VALUES (?, 
                        COALESCE((SELECT success_count FROM metrics WHERE endpoint_name = ?), 0) + 1,
                        ?, 
                        COALESCE((SELECT avg_response_time FROM metrics WHERE endpoint_name = ?), 0) * 0.9 + ? * 0.1,
                        ?
                    )
                ''', (
                    endpoint_name, endpoint_name,
                    datetime.now().isoformat(),
                    endpoint_name, response_time,
                    datetime.now().isoformat()
                ))
            else:
                cursor.execute('''
                    INSERT OR REPLACE INTO metrics 
                    (endpoint_name, error_count, last_error, updated_at)
                    VALUES (?, 
                        COALESCE((SELECT error_count FROM metrics WHERE endpoint_name = ?), 0) + 1,
                        ?, ?
                    )
                ''', (
                    endpoint_name, endpoint_name,
                    datetime.now().isoformat(),
                    datetime.now().isoformat()
                ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"[ERROR] Error almacenando datos: {e}")
    
    def show_stats(self, cycle_time):
        """Muestra estadísticas del orquestador."""
        if self.start_time:
            uptime = datetime.now() - self.start_time
            uptime_str = str(uptime).split('.')[0]
            
            logger.info("=" * 50)
            logger.info(f"[DATA] ESTADÍSTICAS")
            logger.info(f"  Uptime: {uptime_str}")
            logger.info(f"[UP] Capturados: {self.captured_count}")
            logger.info(f"[ERROR] Errores: {self.error_count}")
            logger.info(f"[RELOAD] Ciclo: {cycle_time:.2f}s")
            logger.info(f"[FAST] Tasa: {self.captured_count / max(uptime.total_seconds(), 1):.2f} datos/s")
            logger.info("=" * 50)
    
    async def cleanup(self):
        """Limpia recursos."""
        logger.info(" Limpiando recursos...")
        
        if self.session:
            await self.session.close()
        
        self.is_running = False
        logger.info("[OK] Orquestador detenido")

async def main():
    """Función principal."""
    print("=" * 60)
    print("[START] ORQUESTADOR DE DATOS MEJORADO - SISTEMA UNIFICADO QBTC")
    print("=" * 60)
    print("[DATA] Automatización completa de captura de datos")
    print(" Backend en Python con base de datos SQLite")
    print("[ENDPOINTS] Manejo mejorado de errores y logging detallado")
    print("=" * 60)
    
    orquestador = OrquestadorMejorado()
    
    try:
        await orquestador.start()
    except KeyboardInterrupt:
        print("\n Detención solicitada por el usuario")
    except Exception as e:
        print(f"\n[ERROR] Error fatal: {e}")
        logger.error(f"Error fatal en el orquestador: {e}")

if __name__ == "__main__":
    asyncio.run(main())

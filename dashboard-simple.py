#!/usr/bin/env python3
"""
DASHBOARD SIMPLE QBTC
Servidor web simple para visualizar datos del backend real.
"""

import asyncio
import aiohttp
from aiohttp import web
import sqlite3
import json
from datetime import datetime
import logging

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuración del servidor
HOST = 'localhost'
PORT = 8080

class SimpleDashboardServer:
    def __init__(self):
        self.app = web.Application()
        self.setup_routes()
        self.db_path = "backend_real_fixed.db"
        
    def setup_routes(self):
        """Configura las rutas del servidor."""
        self.app.router.add_get('/', self.serve_dashboard)
        self.app.router.add_get('/api/health', self.health_check)
        self.app.router.add_get('/api/database-stats', self.get_database_stats)
        
    async def serve_dashboard(self, request):
        """Sirve el dashboard HTML."""
        try:
            with open('dashboard-real.html', 'r', encoding='utf-8') as f:
                content = f.read()
            return web.Response(text=content, content_type='text/html')
        except FileNotFoundError:
            return web.Response(text="Dashboard no encontrado", status=404)
    
    async def health_check(self, request):
        """Endpoint de salud del servidor."""
        return web.json_response({
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "server": "QBTC Simple Dashboard Server"
        })
    
    async def get_database_stats(self, request):
        """Obtiene estadísticas de la base de datos."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Obtener registros recientes
            cursor.execute("""
                SELECT service, endpoint, success, response_time, timestamp
                FROM real_data 
                ORDER BY timestamp DESC 
                LIMIT 10
            """)
            
            recent_records = []
            for row in cursor.fetchall():
                service, endpoint, success, response_time, timestamp = row
                recent_records.append({
                    "service": service,
                    "endpoint": endpoint,
                    "success": bool(success),
                    "response_time": response_time or 0,
                    "timestamp": timestamp
                })
            
            # Obtener estadísticas por endpoint
            cursor.execute("""
                SELECT service, endpoint, 
                       COUNT(*) as total,
                       SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful,
                       AVG(response_time) as avg_response
                FROM real_data 
                GROUP BY service, endpoint
                ORDER BY total DESC
            """)
            
            endpoint_stats = []
            for row in cursor.fetchall():
                service, endpoint, total, successful, avg_response = row
                endpoint_stats.append({
                    "service": service,
                    "endpoint": endpoint,
                    "total": total,
                    "successful": successful,
                    "avg_response": avg_response or 0
                })
            
            conn.close()
            
            return web.json_response({
                "recent_records": recent_records,
                "endpoint_stats": endpoint_stats
            })
            
        except Exception as e:
            logger.error(f"Error obteniendo estadísticas de BD: {e}")
            return web.json_response({"error": str(e)}, status=500)
    
    async def start_server(self):
        """Inicia el servidor web."""
        runner = web.AppRunner(self.app)
        await runner.setup()
        
        site = web.TCPSite(runner, HOST, PORT)
        await site.start()
        
        logger.info(f"Servidor dashboard simple iniciado en http://{HOST}:{PORT}")
        logger.info("Dashboard disponible en: http://localhost:8080")
        
        # Mantener el servidor corriendo
        try:
            await asyncio.Future()  # Mantener vivo indefinidamente
        except KeyboardInterrupt:
            logger.info("Detención solicitada")
        finally:
            await runner.cleanup()

async def main():
    """Función principal."""
    print("=" * 60)
    print("DASHBOARD SIMPLE QBTC")
    print("=" * 60)
    print("Iniciando servidor web simple...")
    print("Puerto: 8080")
    print("=" * 60)
    
    server = SimpleDashboardServer()
    
    try:
        await server.start_server()
    except KeyboardInterrupt:
        print("\nDetención solicitada por el usuario")
    except Exception as e:
        print(f"\nError fatal: {e}")

if __name__ == "__main__":
    asyncio.run(main())

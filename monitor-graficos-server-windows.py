#!/usr/bin/env python3
"""
MONITOR DE GRÁFICOS - BANDA 46 (VERSIÓN WINDOWS)
Servidor para visualización de gráficos de todos los símbolos
Optimizado para Windows con mejor manejo de codificación
"""
import asyncio
import aiohttp
from aiohttp import web
import json
from datetime import datetime, timedelta
import random
import logging
import sys
import os

# Configurar codificación para Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HOST = 'localhost'
PORT = 4606

class MonitorGraficosServer:
    def __init__(self):
        self.app = web.Application()
        self.setup_routes()
        self.symbols = [
            'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT',
            'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT', 'UNIUSDT', 'LTCUSDT',
            'MATICUSDT', 'ATOMUSDT', 'NEARUSDT', 'FTMUSDT', 'ALGOUSDT', 'VETUSDT',
            'ICPUSDT', 'FILUSDT', 'TRXUSDT', 'ETCUSDT', 'BCHUSDT', 'XLMUSDT'
        ]
        self.base_prices = {
            'BTCUSDT': 118948.90, 'ETHUSDT': 4636.73, 'BNBUSDT': 456.78,
            'SOLUSDT': 196.72, 'XRPUSDT': 0.58, 'DOGEUSDT': 0.12,
            'ADAUSDT': 0.45, 'AVAXUSDT': 25.50, 'DOTUSDT': 6.23,
            'LINKUSDT': 14.56, 'UNIUSDT': 8.50, 'LTCUSDT': 75.20,
            'MATICUSDT': 0.78, 'ATOMUSDT': 7.80, 'NEARUSDT': 3.10,
            'FTMUSDT': 0.45, 'ALGOUSDT': 0.18, 'VETUSDT': 0.03,
            'ICPUSDT': 12.50, 'FILUSDT': 5.20, 'TRXUSDT': 0.08,
            'ETCUSDT': 25.30, 'BCHUSDT': 420.50, 'XLMUSDT': 0.12
        }
        logger.info(f"Monitor inicializado con {len(self.symbols)} simbolos")

    def setup_routes(self):
        self.app.router.add_get('/', self.root_handler)
        self.app.router.add_get('/health', self.health_check)
        self.app.router.add_get('/api/symbols', self.get_symbols)
        self.app.router.add_get('/api/chart-data/{symbol}', self.get_chart_data)
        self.app.router.add_get('/api/all-charts', self.get_all_charts)
        self.app.router.add_get('/api/status', self.get_status)

    async def root_handler(self, request):
        try:
            with open('monitor-graficos-simple.html', 'r', encoding='utf-8') as f:
                content = f.read()
            return web.Response(text=content, content_type='text/html')
        except FileNotFoundError:
            return web.json_response({"error": "Monitor HTML no encontrado", "service": "Monitor de Graficos", "banda": 46}, status=404)

    async def health_check(self, request):
        return web.json_response({"status": "healthy", "service": "Monitor de Graficos", "banda": 46, "symbols_count": len(self.symbols), "timestamp": datetime.now().isoformat()})

    async def get_symbols(self, request):
        return web.json_response({"success": True, "service": "Monitor de Graficos", "banda": 46, "data": {"symbols": self.symbols, "count": len(self.symbols), "source": "Lista fija de simbolos principales"}, "timestamp": datetime.now().isoformat()})

    async def get_chart_data(self, request):
        symbol = request.match_info['symbol'].upper()
        if symbol not in self.symbols:
            return web.json_response({"success": False, "error": f"Simbolo {symbol} no disponible"}, status=400)
        try:
            chart_data = self.generate_realistic_chart_data(symbol)
            return web.json_response(chart_data)
        except Exception as e:
            logger.error(f"Error obteniendo datos para {symbol}: {e}")
            return web.json_response({"success": False, "error": str(e), "service": "Monitor de Graficos", "banda": 46}, status=500)

    async def get_all_charts(self, request):
        try:
            all_data = {}
            for symbol in self.symbols:
                chart_data = self.generate_realistic_chart_data(symbol)
                all_data[symbol] = chart_data
            return web.json_response({"success": True, "service": "Monitor de Graficos", "banda": 46, "data": all_data, "symbols_processed": len(self.symbols), "total_symbols": len(self.symbols), "timestamp": datetime.now().isoformat()})
        except Exception as e:
            logger.error(f"Error obteniendo todos los datos: {e}")
            return web.json_response({"success": False, "error": str(e), "service": "Monitor de Graficos", "banda": 46}, status=500)

    async def get_status(self, request):
        return web.json_response({"service": "Monitor de Graficos", "banda": 46, "puerto": PORT, "status": "operational", "symbols_available": len(self.symbols), "endpoints": ["/health", "/api/symbols", "/api/chart-data/{symbol}", "/api/all-charts", "/api/status"], "timestamp": datetime.now().isoformat()})

    def generate_realistic_chart_data(self, symbol):
        try:
            base_price = self.base_prices.get(symbol, 100)
            data = []
            labels = []
            now = datetime.now()
            for i in range(50):
                time = now - timedelta(minutes=i*2)
                if i == 0:
                    current_price = base_price
                else:
                    variation = (random.random() - 0.5) * 0.02
                    current_price = data[-1] * (1 + variation)
                data.insert(0, round(current_price, 2))
                labels.insert(0, time.strftime('%H:%M'))
            start_price = data[0]
            end_price = data[-1]
            change = ((end_price - start_price) / start_price * 100)
            high = max(data)
            low = min(data)
            volume = random.randint(1000, 50000)
            return {"success": True, "service": "Monitor de Graficos", "banda": 46, "data": {"symbol": symbol, "price": end_price, "change": round(change, 2), "data": data, "labels": labels, "volume": volume, "high": high, "low": low}, "timestamp": datetime.now().isoformat()}
        except Exception as e:
            logger.error(f"Error generando datos para {symbol}: {e}")
            return {"success": False, "error": str(e), "service": "Monitor de Graficos", "banda": 46}

    async def start_server(self):
        runner = web.AppRunner(self.app)
        await runner.setup()
        site = web.TCPSite(runner, HOST, PORT)
        await site.start()
        logger.info(f"Monitor de Graficos iniciado en http://{HOST}:{PORT}")
        logger.info(f"Banda 46 - Puerto {PORT}")
        logger.info(f"Simbolos disponibles: {len(self.symbols)}")
        try:
            await asyncio.Future()
        except KeyboardInterrupt:
            logger.info("Detencion solicitada")
        finally:
            await runner.cleanup()

async def main():
    print("=" * 60)
    print("MONITOR DE GRAFICOS - BANDA 46 (WINDOWS)")
    print("=" * 60)
    print(f"Iniciando servidor en puerto {PORT}")
    print("Servicios: Visualizacion de graficos en tiempo real")
    print("Fuente de datos: Datos realistas generados localmente")
    print("=" * 60)
    monitor = MonitorGraficosServer()
    try:
        await monitor.start_server()
    except KeyboardInterrupt:
        print("\nDetencion solicitada por el usuario")
    except Exception as e:
        print(f"\nError fatal: {e}")

if __name__ == "__main__":
    asyncio.run(main())

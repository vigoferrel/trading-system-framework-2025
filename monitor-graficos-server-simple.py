#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MONITOR DE GRAFICOS - BANDA 46 (VERSION SIMPLIFICADA)
Servidor para visualizacion de graficos de todos los simbolos
"""

import asyncio
import aiohttp
from aiohttp import web
import json
from datetime import datetime, timedelta
import random
import logging
import sys

# Configuracion de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuracion del servidor
HOST = 'localhost'
PORT = 4606

class MonitorGraficosServer:
    def __init__(self):
        self.app = web.Application()
        self.setup_routes()
        
        # Simbolos disponibles - Lista fija para pruebas
        self.symbols = [
            'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT',
            'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT', 'UNIUSDT', 'LTCUSDT',
            'MATICUSDT', 'ATOMUSDT', 'NEARUSDT', 'FTMUSDT', 'ALGOUSDT', 'VETUSDT',
            'ICPUSDT', 'FILUSDT', 'TRXUSDT', 'ETCUSDT', 'BCHUSDT', 'XLMUSDT'
        ]
        
        # Precios base realistas
        self.base_prices = {
            'BTCUSDT': 118948.90,
            'ETHUSDT': 4636.73,
            'BNBUSDT': 456.78,
            'SOLUSDT': 196.72,
            'XRPUSDT': 0.58,
            'DOGEUSDT': 0.12,
            'ADAUSDT': 0.45,
            'AVAXUSDT': 25.50,
            'DOTUSDT': 6.23,
            'LINKUSDT': 14.56,
            'UNIUSDT': 8.50,
            'LTCUSDT': 75.20,
            'MATICUSDT': 0.78,
            'ATOMUSDT': 7.80,
            'NEARUSDT': 3.10,
            'FTMUSDT': 0.45,
            'ALGOUSDT': 0.18,
            'VETUSDT': 0.03,
            'ICPUSDT': 12.50,
            'FILUSDT': 5.20,
            'TRXUSDT': 0.08,
            'ETCUSDT': 25.30,
            'BCHUSDT': 420.50,
            'XLMUSDT': 0.12
        }
        
        logger.info(f"Monitor inicializado con {len(self.symbols)} simbolos")
    
    def setup_routes(self):
        """Configura las rutas del servidor."""
        self.app.router.add_get('/', self.root_handler)
        self.app.router.add_get('/health', self.health_check)
        self.app.router.add_get('/api/symbols', self.get_symbols)
        self.app.router.add_get('/api/chart-data/{symbol}', self.get_chart_data)
        self.app.router.add_get('/api/all-charts', self.get_all_charts)
        self.app.router.add_get('/api/status', self.get_status)
        
    async def root_handler(self, request):
        """Maneja la ruta raiz - sirve el HTML del monitor."""
        try:
            with open('monitor-graficos-simple.html', 'r', encoding='utf-8') as f:
                content = f.read()
            
            return web.Response(text=content, content_type='text/html')
        except FileNotFoundError:
            return web.json_response({
                "error": "Monitor HTML no encontrado",
                "service": "Monitor de Graficos",
                "banda": 46
            }, status=404)
    
    async def health_check(self, request):
        """Endpoint de salud del servidor."""
        return web.json_response({
            "status": "healthy",
            "service": "Monitor de Graficos",
            "banda": 46,
            "symbols_count": len(self.symbols),
            "timestamp": datetime.now().isoformat()
        })
    
    async def get_symbols(self, request):
        """Obtiene la lista de simbolos disponibles."""
        return web.json_response({
            "symbols": self.symbols,
            "count": len(self.symbols),
            "timestamp": datetime.now().isoformat()
        })
    
    def generate_realistic_data(self, symbol, base_price):
        """Genera datos realistas para un simbolo."""
        # Usar hash del simbolo para consistencia
        symbol_hash = sum(ord(c) for c in symbol)
        random.seed(symbol_hash)
        
        # Generar variacion de precio realista
        variation = (random.random() - 0.5) * 0.02  # +/- 1%
        current_price = base_price * (1 + variation)
        
        # Generar datos de volumen
        volume = base_price * random.uniform(1000, 10000)
        
        # Generar datos de klines
        klines = []
        for i in range(100):
            time_offset = datetime.now() - timedelta(minutes=i)
            price_variation = (random.random() - 0.5) * 0.01
            kline_price = current_price * (1 + price_variation)
            
            klines.append({
                "time": int(time_offset.timestamp() * 1000),
                "open": kline_price * 0.999,
                "high": kline_price * 1.002,
                "low": kline_price * 0.998,
                "close": kline_price,
                "volume": volume * random.uniform(0.8, 1.2)
            })
        
        klines.reverse()  # Ordenar por tiempo ascendente
        
        return {
            "symbol": symbol,
            "price": round(current_price, 4),
            "change": round(variation * 100, 2),
            "volume": round(volume, 2),
            "klines": klines,
            "timestamp": datetime.now().isoformat()
        }
    
    async def get_chart_data(self, request):
        """Obtiene datos de grafico para un simbolo especifico."""
        symbol = request.match_info['symbol'].upper()
        
        if symbol not in self.symbols:
            return web.json_response({
                "error": f"Simbolo {symbol} no encontrado",
                "available_symbols": self.symbols
            }, status=404)
        
        base_price = self.base_prices.get(symbol, 100.0)
        data = self.generate_realistic_data(symbol, base_price)
        
        return web.json_response(data)
    
    async def get_all_charts(self, request):
        """Obtiene datos de grafico para todos los simbolos."""
        all_data = {}
        
        for symbol in self.symbols:
            base_price = self.base_prices.get(symbol, 100.0)
            all_data[symbol] = self.generate_realistic_data(symbol, base_price)
        
        return web.json_response({
            "charts": all_data,
            "total_symbols": len(self.symbols),
            "timestamp": datetime.now().isoformat()
        })
    
    async def get_status(self, request):
        """Obtiene el estado del servidor."""
        return web.json_response({
            "status": "running",
            "service": "Monitor de Graficos",
            "banda": 46,
            "port": PORT,
            "symbols_count": len(self.symbols),
            "uptime": "active",
            "timestamp": datetime.now().isoformat()
        })
    
    async def start_server(self):
        """Inicia el servidor."""
        runner = web.AppRunner(self.app)
        await runner.setup()
        
        site = web.TCPSite(runner, HOST, PORT)
        await site.start()
        
        logger.info(f"Monitor de Graficos iniciado en http://{HOST}:{PORT}")
        
        # Mantener el servidor corriendo
        while True:
            await asyncio.sleep(1)

async def main():
    """Funcion principal."""
    print("=" * 60)
    print("MONITOR DE GRAFICOS - BANDA 46 (SIMPLIFICADO)")
    print("=" * 60)
    print(f"Puerto: {PORT}")
    print(f"Simbolos: {24}")
    print("=" * 60)
    
    monitor = MonitorGraficosServer()
    await monitor.start_server()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServidor detenido por el usuario")
    except Exception as e:
        print(f"Error iniciando servidor: {e}")

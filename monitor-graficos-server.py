#!/usr/bin/env python3
"""
MONITOR DE GRÁFICOS - BANDA 46
Servidor para visualización de gráficos de todos los símbolos
"""

import asyncio
import aiohttp
from aiohttp import web
import json
import sqlite3
from datetime import datetime, timedelta
import random
import logging

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuración del servidor
HOST = 'localhost'
PORT = 4606

class MonitorGraficosServer:
    def __init__(self):
        self.app = web.Application()
        self.setup_routes()
        self.db_path = "backend_real_fixed.db"
        
        # Símbolos disponibles - Se obtienen dinámicamente del QBTC Core
        self.quantum_universe = []
        self.symbols = []
        

    
    async def initialize(self):
        """Inicializa el servidor cargando símbolos dinámicamente."""
        await self.load_symbols_dynamically()
        
    async def load_symbols_dynamically(self):
        """Carga símbolos dinámicamente del QBTC Core o Binance."""
        try:
            # Configurar timeout más corto para evitar bloqueos
            timeout = aiohttp.ClientTimeout(total=3, connect=2)
            
            # Intentar obtener símbolos del QBTC Core primero
            try:
                async with aiohttp.ClientSession(timeout=timeout) as session:
                    url = "http://localhost:4602/api/symbols"
                    async with session.get(url) as response:
                        if response.status == 200:
                            data = await response.json()
                            if data.get('success') and 'symbols' in data:
                                self.symbols = data['symbols']
                                logger.info(f"[OK] Símbolos cargados desde QBTC Core: {len(self.symbols)} símbolos")
                                return
            except Exception as e:
                logger.warning(f"No se pudo obtener símbolos del QBTC Core: {e}")
            
            # Fallback: Obtener directamente de Binance
            try:
                async with aiohttp.ClientSession(timeout=timeout) as session:
                    url = "https://api.binance.com/api/v3/exchangeInfo"
                    async with session.get(url) as response:
                        if response.status == 200:
                            data = await response.json()
                            if data.get('symbols'):
                                # Filtrar solo símbolos USDT que estén activos
                                self.symbols = [
                                    symbol['symbol'] for symbol in data['symbols']
                                    if symbol['symbol'].endswith('USDT') and 
                                    symbol['status'] == 'TRADING' and
                                    symbol['isSpotTradingAllowed']
                                ]
                                logger.info(f"[OK] Símbolos cargados desde Binance: {len(self.symbols)} símbolos")
                                return
            except Exception as e:
                logger.warning(f"No se pudo obtener símbolos de Binance: {e}")
            
            # Fallback final: Símbolos principales
            self.symbols = [
                'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT',
                'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT', 'UNIUSDT', 'LTCUSDT',
                'MATICUSDT', 'ATOMUSDT', 'NEARUSDT', 'FTMUSDT', 'ALGOUSDT', 'VETUSDT',
                'ICPUSDT', 'FILUSDT', 'TRXUSDT', 'ETCUSDT', 'BCHUSDT', 'XLMUSDT'
            ]
            logger.info(f"[WARNING] Usando símbolos por defecto: {len(self.symbols)} símbolos")
                
        except Exception as e:
            logger.error(f"Error cargando símbolos: {e}")
            # Símbolos de emergencia
            self.symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT']
        
    def setup_routes(self):
        """Configura las rutas del servidor."""
        self.app.router.add_get('/', self.root_handler)
        self.app.router.add_get('/health', self.health_check)
        self.app.router.add_get('/api/symbols', self.get_symbols)
        self.app.router.add_get('/api/chart-data/{symbol}', self.get_chart_data)
        self.app.router.add_get('/api/all-charts', self.get_all_charts)
        self.app.router.add_get('/api/status', self.get_status)
        
    async def root_handler(self, request):
        """Maneja la ruta raíz - sirve el HTML del monitor."""
        try:
            with open('monitor-graficos-simple.html', 'r', encoding='utf-8') as f:
                content = f.read()
            
            return web.Response(text=content, content_type='text/html')
        except FileNotFoundError:
            return web.json_response({
                "error": "Monitor HTML no encontrado",
                "service": "Monitor de Gráficos",
                "banda": 46
            }, status=404)
    
    async def health_check(self, request):
        """Endpoint de salud del servidor."""
        return web.json_response({
            "status": "healthy",
            "service": "Monitor de Gráficos",
            "banda": 46,
            "symbols_count": len(self.symbols),
            "timestamp": datetime.now().isoformat()
        })
    
    async def get_symbols(self, request):
        """Obtiene la lista de símbolos disponibles."""
        return web.json_response({
            "success": True,
            "service": "Monitor de Gráficos",
            "banda": 46,
            "data": {
                "symbols": self.symbols,
                "count": len(self.symbols),
                "source": "QBTC Core Cache + Binance API"
            },
            "timestamp": datetime.now().isoformat()
        })
    
    async def get_chart_data(self, request):
        """Obtiene datos de gráfico para un símbolo específico."""
        symbol = request.match_info['symbol'].upper()
        
        if symbol not in self.symbols:
            return web.json_response({
                "success": False,
                "error": f"Símbolo {symbol} no disponible"
            }, status=400)
        
        try:
            # Obtener datos reales de la cache
            real_data = await self.fetch_real_data(symbol)
            
            if real_data:
                return web.json_response(real_data)
            else:
                # Si no hay datos reales, devolver error
                return web.json_response({
                    "success": False,
                    "error": f"No se pudieron obtener datos reales para {symbol}",
                    "service": "Monitor de Gráficos",
                    "banda": 46
                }, status=503)
                
        except Exception as e:
            logger.error(f"Error obteniendo datos para {symbol}: {e}")
            return web.json_response({
                "success": False,
                "error": str(e),
                "service": "Monitor de Gráficos",
                "banda": 46
            }, status=500)
    
    async def get_all_charts(self, request):
        """Obtiene datos de gráfico para todos los símbolos."""
        try:
            all_data = {}
            successful_symbols = 0
            
            for symbol in self.symbols:
                # Obtener datos reales de la cache
                real_data = await self.fetch_real_data(symbol)
                
                if real_data:
                    all_data[symbol] = real_data
                    successful_symbols += 1
            
            return web.json_response({
                "success": True,
                "service": "Monitor de Gráficos",
                "banda": 46,
                "data": all_data,
                "symbols_processed": successful_symbols,
                "total_symbols": len(self.symbols),
                "timestamp": datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Error obteniendo todos los datos: {e}")
            return web.json_response({
                "success": False,
                "error": str(e),
                "service": "Monitor de Gráficos",
                "banda": 46
            }, status=500)
    
    async def get_status(self, request):
        """Endpoint de estado del servicio."""
        return web.json_response({
            "service": "Monitor de Gráficos",
            "banda": 46,
            "puerto": PORT,
            "status": "operational",
            "symbols_available": len(self.symbols),
            "endpoints": [
                "/health",
                "/api/symbols",
                "/api/chart-data/{symbol}",
                "/api/all-charts",
                "/api/status"
            ],
            "timestamp": datetime.now().isoformat()
        })
    
    async def fetch_real_data(self, symbol):
        """Obtiene datos reales de la cache del QBTC Core."""
        try:
            async with aiohttp.ClientSession() as session:
                # Intentar obtener datos de futures del QBTC Core
                url = f"http://localhost:4602/futures_data?symbol={symbol}"
                async with session.get(url, timeout=5) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('success') and 'data' in data:
                            return self.process_real_data(symbol, data['data'])
                
                # Si no hay datos de futures, intentar spot
                url = f"http://localhost:4602/spot_data?symbol={symbol}"
                async with session.get(url, timeout=5) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data.get('success') and 'data' in data:
                            return self.process_real_data(symbol, data['data'])
                
                # Si no hay datos del QBTC Core, obtener directamente de Binance
                url = f"https://api.binance.com/api/v3/ticker/24hr?symbol={symbol}"
                async with session.get(url, timeout=5) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self.process_binance_data(symbol, data)
                        
            return None
        except Exception as e:
            logger.warning(f"No se pudieron obtener datos reales para {symbol}: {e}")
            return None
    
    def process_real_data(self, symbol, data):
        """Procesa datos reales del QBTC Core."""
        try:
            # Extraer datos reales de la cache
            current_price = float(data.get('price', data.get('lastPrice', 0)))
            volume = float(data.get('volume', data.get('volume24h', 0)))
            high = float(data.get('high', data.get('highPrice', current_price * 1.02)))
            low = float(data.get('low', data.get('lowPrice', current_price * 0.98)))
            change = float(data.get('change', data.get('priceChangePercent', 0)))
            
            # Obtener datos históricos reales si están disponibles
            klines_data = data.get('klines', [])
            if klines_data:
                chart_data = self.process_historical_klines(klines_data)
            else:
                # Si no hay datos históricos, generar datos mínimos
                chart_data = self.generate_minimal_chart_data(current_price)
            
            return {
                "success": True,
                "service": "Monitor de Gráficos",
                "banda": 46,
                "data": {
                    "symbol": symbol,
                    "price": current_price,
                    "change": change,
                    "data": chart_data['data'],
                    "labels": chart_data['labels'],
                    "volume": volume,
                    "high": high,
                    "low": low
                },
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error procesando datos reales para {symbol}: {e}")
            return None
    
    def process_binance_data(self, symbol, data):
        """Procesa datos directos de Binance."""
        try:
            current_price = float(data.get('lastPrice', 0))
            volume = float(data.get('volume', 0))
            high = float(data.get('highPrice', current_price * 1.02))
            low = float(data.get('lowPrice', current_price * 0.98))
            change = float(data.get('priceChangePercent', 0))
            
            # Generar datos mínimos para el gráfico
            chart_data = self.generate_minimal_chart_data(current_price)
            
            return {
                "success": True,
                "service": "Monitor de Gráficos",
                "banda": 46,
                "data": {
                    "symbol": symbol,
                    "price": current_price,
                    "change": change,
                    "data": chart_data['data'],
                    "labels": chart_data['labels'],
                    "volume": volume,
                    "high": high,
                    "low": low
                },
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error procesando datos de Binance para {symbol}: {e}")
            return None
    
    def process_historical_klines(self, klines_data):
        """Procesa datos históricos de klines reales."""
        try:
            data = []
            labels = []
            
            for kline in klines_data:
                # Formato: [timestamp, open, high, low, close, volume, ...]
                if len(kline) >= 5:
                    close_price = float(kline[4])
                    timestamp = int(kline[0])
                    time_str = datetime.fromtimestamp(timestamp / 1000).strftime('%H:%M')
                    
                    data.append(close_price)
                    labels.append(time_str)
            
            return {
                "data": data,
                "labels": labels
            }
        except Exception as e:
            logger.error(f"Error procesando klines: {e}")
            return self.generate_minimal_chart_data(100)
    
    def generate_minimal_chart_data(self, current_price):
        """Genera datos mínimos para el gráfico cuando no hay datos históricos."""
        try:
            # Generar solo 10 puntos de datos mínimos
            data = []
            labels = []
            now = datetime.now()
            
            for i in range(10):
                time = now - timedelta(minutes=i*5)  # Cada 5 minutos
                # Usar el precio actual con pequeña variación
                price = current_price * (1 + (random.random() - 0.5) * 0.01)  # ±0.5%
                
                data.insert(0, round(price, 2))
                labels.insert(0, time.strftime('%H:%M'))
            
            return {
                "data": data,
                "labels": labels
            }
        except Exception as e:
            logger.error(f"Error generando datos mínimos: {e}")
            return {
                "data": [current_price] * 10,
                "labels": [datetime.now().strftime('%H:%M')] * 10
            }
    

    
    async def start_server(self):
        """Inicia el servidor del monitor de gráficos."""
        runner = web.AppRunner(self.app)
        await runner.setup()
        
        site = web.TCPSite(runner, HOST, PORT)
        await site.start()
        
        logger.info(f"Monitor de Gráficos iniciado en http://{HOST}:{PORT}")
        logger.info(f"Banda 46 - Puerto {PORT}")
        logger.info(f"Símbolos disponibles: {', '.join(self.symbols)}")
        
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
    print("[DATA] MONITOR DE GRÁFICOS - BANDA 46")
    print("=" * 60)
    print(f"Iniciando servidor en puerto {PORT}")
    print("Servicios: Visualización de gráficos en tiempo real")
    print("Fuente de datos: Cache QBTC Core + Binance API")
    print("=" * 60)
    
    monitor = MonitorGraficosServer()
    
    try:
        # Inicializar cargando símbolos dinámicamente
        print("[RELOAD] Cargando símbolos dinámicamente...")
        await monitor.initialize()
        print(f"[OK] Símbolos cargados: {len(monitor.symbols)}")
        
        # Iniciar servidor
        await monitor.start_server()
    except KeyboardInterrupt:
        print("\nDetención solicitada por el usuario")
    except Exception as e:
        print(f"\nError fatal: {e}")

if __name__ == "__main__":
    asyncio.run(main())

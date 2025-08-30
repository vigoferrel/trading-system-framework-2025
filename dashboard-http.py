#!/usr/bin/env python3
"""
DASHBOARD HTTP SIMPLE QBTC
Servidor HTTP simple usando Python estándar.
"""

import http.server
import socketserver
import sqlite3
import json
import urllib.parse
from datetime import datetime
import os

# Configuración del servidor
HOST = 'localhost'
PORT = 4605

class QBTCDashboardHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        """Maneja las peticiones GET."""
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path == '/':
            self.serve_dashboard()
        elif path == '/api/health':
            self.serve_health()
        elif path == '/api/backend-status':
            self.serve_backend_status()
        elif path == '/api/database-stats':
            self.serve_database_stats()
        else:
            super().do_GET()
    
    def serve_dashboard(self):
        """Sirve el dashboard HTML."""
        try:
            with open('dashboard-real.html', 'r', encoding='utf-8') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(content.encode('utf-8'))
        except FileNotFoundError:
            self.send_error(404, "Dashboard no encontrado")
    
    def serve_health(self):
        """Sirve el endpoint de salud."""
        response = {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "server": "QBTC HTTP Dashboard Server"
        }
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def serve_backend_status(self):
        """Sirve el estado del backend."""
        try:
            # Verificar estado de los servicios
            import requests
            
            services = {
                'qbtc_core': 'http://localhost:4602/api/futures-data',
                'srona_api': 'http://localhost:4601/health',
                'frontend_api': 'http://localhost:4603/health',
                'vigo_futures': 'http://localhost:4604/health'
            }
            
            healthy_services = 0
            total_services = len(services)
            services_status = {}
            
            for service_name, service_url in services.items():
                try:
                    response = requests.get(service_url, timeout=5)
                    is_healthy = response.status_code == 200
                    response_time = response.elapsed.total_seconds()
                    
                    if is_healthy:
                        healthy_services += 1
                    
                    services_status[service_name] = {
                        "is_healthy": is_healthy,
                        "response_time": response_time,
                        "last_check": datetime.now().isoformat()
                    }
                except Exception as e:
                    services_status[service_name] = {
                        "is_healthy": False,
                        "response_time": 0,
                        "last_check": datetime.now().isoformat()
                    }
            
            success_rate = (healthy_services / total_services) * 100 if total_services > 0 else 0
            
            response = {
                "is_running": healthy_services > 0,
                "healthy_services": healthy_services,
                "total_services": total_services,
                "data_captured": 0,  # No implementado por ahora
                "success_rate": success_rate,
                "services": services_status
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            # En caso de error, devolver estado básico
            response = {
                "is_running": False,
                "healthy_services": 0,
                "total_services": 4,
                "data_captured": 0,
                "success_rate": 0.0,
                "services": {
                    'qbtc_core': {"is_healthy": False, "response_time": 0, "last_check": datetime.now().isoformat()},
                    'srona_api': {"is_healthy": False, "response_time": 0, "last_check": datetime.now().isoformat()},
                    'frontend_api': {"is_healthy": False, "response_time": 0, "last_check": datetime.now().isoformat()},
                    'vigo_futures': {"is_healthy": False, "response_time": 0, "last_check": datetime.now().isoformat()}
                }
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
    
    def serve_database_stats(self):
        """Sirve estadísticas de la base de datos."""
        try:
            conn = sqlite3.connect("backend_real_fixed.db")
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
            
            response = {
                "recent_records": recent_records,
                "endpoint_stats": endpoint_stats
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            error_response = {"error": str(e)}
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(error_response).encode('utf-8'))

def main():
    """Función principal."""
    print("=" * 60)
    print("DASHBOARD HTTP SIMPLE QBTC")
    print("=" * 60)
    print(f"Iniciando servidor HTTP en {HOST}:{PORT}")
    print("Dashboard disponible en: http://localhost:4605")
    print("=" * 60)
    
    try:
        with socketserver.TCPServer((HOST, PORT), QBTCDashboardHandler) as httpd:
            print(f"Servidor iniciado en http://{HOST}:{PORT}")
            print("Presiona Ctrl+C para detener")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nDetención solicitada por el usuario")
    except Exception as e:
        print(f"\nError: {e}")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
SERVIDOR HTTP SIMPLE PARA DIAGNÓSTICO
"""

import http.server
import socketserver
import json
from datetime import datetime

HOST = 'localhost'
PORT = 4605  # Puerto de la Banda 46

class SimpleHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        print(f"Request: {self.path}")
        
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<h1>Test Server Working</h1>')
        elif self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {"status": "ok", "time": datetime.now().isoformat()}
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')

def main():
    print(f"Starting simple server on {HOST}:{PORT}")
    with socketserver.TCPServer((HOST, PORT), SimpleHandler) as httpd:
        print(f"Server running on http://{HOST}:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    main()

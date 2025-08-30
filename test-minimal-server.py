#!/usr/bin/env python3
"""
SERVIDOR HTTP MÍNIMO PARA DIAGNÓSTICO
"""

import socket
import threading
import time

def handle_client(client_socket):
    try:
        request = client_socket.recv(1024).decode()
        print(f"Received request: {request[:100]}")
        
        response = "HTTP/1.1 200 OK\r\n"
        response += "Content-Type: text/plain\r\n"
        response += "Content-Length: 13\r\n"
        response += "\r\n"
        response += "Hello World!"
        
        client_socket.send(response.encode())
        client_socket.close()
    except Exception as e:
        print(f"Error handling client: {e}")
        client_socket.close()

def main():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('localhost', 8080))
    server.listen(5)
    
    print("Minimal server listening on localhost:8080")
    
    try:
        while True:
            client, addr = server.accept()
            print(f"Connection from {addr}")
            client_handler = threading.Thread(target=handle_client, args=(client,))
            client_handler.start()
    except KeyboardInterrupt:
        print("Server stopped")
    finally:
        server.close()

if __name__ == "__main__":
    main()

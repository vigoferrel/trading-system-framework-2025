## VigoFutures - Sistema Unificado

Inicia el sistema completo desde un solo punto: QuantumUnifiedCore (REST/WS) y, opcionalmente, el Coordinator.

### Requisitos
- Node.js 16+
- Archivo `.env` configurado en `quantum-core/.env` (puede copiarse desde `quantum-core/env-example.txt`).

### Variables relevantes
- `UNIFIED_SERVER_PORT` (por defecto: 18020)
- `SINGLE_SERVER_MODE` (`true` por defecto). Si es `false`, también se levanta el Coordinator.
- `COORDINATOR_PORT` (por defecto: 3000 si Coordinator está habilitado)

### Ejecutar

```bash
cd VigoFutures
npm run start
```

### Endpoints (por defecto)
- Quantum Core: `http://localhost:18020`
- WebSocket: `ws://localhost:18020`
- Coordinator (si habilitado): `http://localhost:3000`

---

### Modo autónomo (100% standalone)
No requiere `npm install`. Usa solo módulos nativos de Node.js.

- Implementaciones mínimas locales en `./quantum-core` y `./coordinator`.
- Variables `.env` locales opcionales: `./quantum-core/.env`.

### Ejecutar sin dependencias
```bash
node index.js
```

### Desarrollo rápido
- Cambia `SINGLE_SERVER_MODE=false` para levantar también el Coordinator de ejemplo.
- Core expone un endpoint de salud: `GET /health`.
- WebSocket de ejemplo (handshake nativo): conectar a `ws://localhost:UNIFIED_SERVER_PORT/ws`.



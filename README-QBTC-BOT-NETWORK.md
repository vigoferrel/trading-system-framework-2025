# Sistema QBTC - Red de Bots con IPs Fijas

## Descripción
Sistema completo para gestión de bots de trading con IPs fijas en Docker, integrado con sistema de trading quantum y conectividad VPN para Binance.

## Arquitectura
- **Red Docker**: `bot-network` (192.168.100.0/24)
- **Gateway**: 192.168.100.1
- **Bots**: 5 contenedores con IPs fijas (192.168.100.10 - 192.168.100.14)
- **Puertos**: 3001-3005 mapeados localmente

## Bots Configurados
| Bot | IP Interna | Puerto Local | URL |
|-----|------------|--------------|-----|
| bot-01 | 192.168.100.10 | 3001 | http://localhost:3001 |
| bot-02 | 192.168.100.11 | 3002 | http://localhost:3002 |
| bot-03 | 192.168.100.12 | 3003 | http://localhost:3003 |
| bot-04 | 192.168.100.13 | 3004 | http://localhost:3004 |
| bot-05 | 192.168.100.14 | 3005 | http://localhost:3005 |

## Archivos del Sistema

### Scripts de Configuración
- `setup-bot-network-fixed.ps1` - Configura la red completa de bots
- `qbtc-bot-manager.ps1` - Gestión completa de bots (menú interactivo)
- `qbtc-integration-system.ps1` - Integración completa con sistema de trading

### Scripts de Trading
- `qbtc-quantum-ip-integration.js` - Integración principal con sistema quantum
- `qbtc-vpn-solution.js` - Gestión de VPN y whitelisting
- `binance-connector.js` - Conector para API de Binance

### Backend
- `backend-real.py` - Backend principal del sistema

## Instalación y Configuración

### 1. Verificar Docker
```bash
docker --version
docker ps
```

### 2. Configurar Red de Bots
```powershell
# Ejecutar como administrador
.\setup-bot-network-fixed.ps1
```

### 3. Verificar Instalación
```powershell
# Ver estado de contenedores
docker ps --filter network=bot-network

# Probar un bot
curl http://localhost:3001
```

## Uso del Sistema

### Gestión de Bots
```powershell
# Menú interactivo completo
.\qbtc-bot-manager.ps1
```

### Integración Completa
```powershell
# Sistema completo de integración
.\qbtc-integration-system.ps1
```

### Operaciones Básicas
```bash
# Ver estado de bots
docker ps --filter network=bot-network

# Ver logs de un bot
docker logs bot-01

# Reiniciar todos los bots
docker restart bot-01 bot-02 bot-03 bot-04 bot-05

# Parar todos los bots
docker stop bot-01 bot-02 bot-03 bot-04 bot-05
```

## Integración con Trading

### 1. Configurar VPN
```javascript
// Ejecutar solución VPN
node qbtc-vpn-solution.js
```

### 2. Iniciar Sistema Quantum
```javascript
// Integración completa
node qbtc-quantum-ip-integration.js
```

### 3. Verificar Conectividad Binance
```javascript
// Probar conexión con Binance
node binance-connector.js
```

## API de Bots

Cada bot expone una API REST simple:

### GET /
```json
{
  "bot": "bot-01",
  "ip": "192.168.100.10",
  "status": "running",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

## Solución de Problemas

### Bots no inician
```bash
# Limpiar contenedores existentes
docker stop bot-01 bot-02 bot-03 bot-04 bot-05
docker rm bot-01 bot-02 bot-03 bot-04 bot-05

# Recrear red
.\setup-bot-network-fixed.ps1
```

### Error de red Docker
```bash
# Verificar red
docker network ls
docker network inspect bot-network

# Recrear red si es necesario
docker network rm bot-network
docker network create --driver bridge --subnet=192.168.100.0/24 --gateway=192.168.100.1 bot-network
```

### Problemas de conectividad
```bash
# Verificar puertos
netstat -ano | findstr "3001 3002 3003 3004 3005"

# Verificar firewall
# Asegurarse de que los puertos 3001-3005 estén abiertos
```

## Limpieza del Sistema

### Limpiar Todo
```bash
# Parar y remover contenedores
docker stop bot-01 bot-02 bot-03 bot-04 bot-05
docker rm bot-01 bot-02 bot-03 bot-04 bot-05

# Remover imágenes
docker rmi qbtc-bot-bot-01 qbtc-bot-bot-02 qbtc-bot-bot-03 qbtc-bot-bot-04 qbtc-bot-bot-05

# Remover red
docker network rm bot-network

# Limpieza completa
docker system prune -a
```

## Próximos Pasos

1. **Configurar VPN**: Integrar con NordVPN/ProtonVPN para IP whitelisting
2. **Sistema de Trading**: Desarrollar lógica de trading distribuida entre bots
3. **Monitoreo**: Implementar dashboard de monitoreo en tiempo real
4. **Backup/Restore**: Sistema de backup de configuraciones y datos
5. **Escalabilidad**: Capacidad para añadir más bots dinámicamente

## Notas de Seguridad

- Los bots están en red interna Docker (192.168.100.0/24)
- Puertos mapeados localmente (3001-3005)
- Configurar firewall para restringir acceso externo
- Usar VPN para operaciones con exchanges
- Implementar autenticación en APIs de producción

## Soporte

Para problemas o preguntas:
1. Verificar logs: `docker logs <bot-name>`
2. Verificar estado: `docker ps --filter network=bot-network`
3. Usar script de diagnóstico: `.\qbtc-integration-system.ps1`

---

**Sistema desarrollado para optimización de trading con IPs fijas y distribución de carga.**

# QBTC-UNIFIED - Guía de Despliegue y Operaciones

## Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Modos de Despliegue](#modos-de-despliegue)
4. [Procedimientos de Operación](#procedimientos-de-operación)
5. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
6. [Gestión de Incidentes](#gestión-de-incidentes)
7. [Actualizaciones y Mejoras](#actualizaciones-y-mejoras)
8. [Seguridad y Cumplimiento](#seguridad-y-cumplimiento)
9. [Solución de Problemas](#solución-de-problemas)
10. [Apéndice](#apéndice)

## Requisitos del Sistema

### 1.1 Requisitos Mínimos
- **Sistema Operativo**: Windows 10+, Linux Ubuntu 18.04+, macOS 10.14+
- **Node.js**: Versión 16.0 o superior
- **Memoria RAM**: 512MB mínimo, 2GB recomendado
- **Almacenamiento**: 100MB para aplicación + 1GB para logs
- **Procesador**: 1 CPU core mínimo, 2 cores recomendado
- **Red**: Conexión a internet estable (para API de Binance)

### 1.2 Requisitos Recomendados (Producción)
- **Sistema Operativo**: Linux Ubuntu 20.04 LTS o superior
- **Node.js**: Versión 18.0 LTS o superior
- **Memoria RAM**: 4GB o superior
- **Almacenamiento**: SSD con 50GB+ espacio
- **Procesador**: 4 CPU cores o superior
- **Red**: Conexión dedicada con baja latencia
- **Monitoreo**: Sistema de monitoreo integrado

### 1.3 Dependencias de Software
- **Runtime**: Node.js 16+ (npm incluido)
- **Opcional**: PM2 para gestión de procesos en producción
- **Opcional**: Nginx como reverse proxy
- **Opcional**: Redis para caché (futuras versiones)

## Instalación y Configuración

### 2.1 Preparación del Entorno

#### 2.1.1 Instalación de Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Windows
# Descargar desde https://nodejs.org y ejecutar instalador

# Verificar instalación
node --version
npm --version
```

#### 2.1.2 Clonación del Repositorio
```bash
git clone <repositorio-url> QBTC-UNIFIED
cd QBTC-UNIFIED/VigoFutures
```

### 2.2 Configuración Inicial

#### 2.2.1 Variables de Entorno
Crear archivo `.env` en el directorio `quantum-core/`:

```bash
# Configuración del Servidor
UNIFIED_SERVER_PORT=18020
SINGLE_SERVER_MODE=false
COORDINATOR_PORT=3000

# Configuración de Binance
BINANCE_API_KEY=tu-api-key-de-binance
BINANCE_API_SECRET=tu-api-secret-de-binance
BINANCE_TESTNET=false

# Configuración del Bot
BOT_SERVER_PORT=5500
FUTURES_BOT_PORT=8002

# Configuración Cuántica
QUANTUM_RESONANCE_FREQUENCY=888
FEYNMAN_Z_REAL=9
FEYNMAN_Z_IMAGINARY=16
ZURITA_MULTIPLIER=7919
```

#### 2.2.2 Configuración de Archivos JSON
Editar archivos de configuración según necesidades:

1. **config/config.js**: Configuración principal del sistema
2. **core/quantum-engine/feynman-binance-config.json**: Configuración Feynman-Binance
3. **bot-futuros/config.js**: Configuración del bot de futuros

### 2.3 Instalación de Dependencias

#### 2.3.1 Modo Desarrollo (con dependencias)
```bash
npm install
```

#### 2.3.2 Modo Standalone (sin dependencias externas)
```bash
# No se requiere npm install
# El sistema funciona con módulos nativos de Node.js
```

## Modos de Despliegue

### 3.1 Modo Standalone
**Descripción**: Sistema completamente autónomo sin dependencias externas.

**Ventajas**:
- No requiere instalación de dependencias
- Mínima huella de memoria
- Máxima portabilidad
- Rápido despliegue

**Desventajas**:
- Funcionalidades limitadas
- Sin optimizaciones externas

**Procedimiento de Despliegue**:
```bash
# 1. Navegar al directorio principal
cd QBTC-UNIFIED/VigoFutures

# 2. Ejecutar directamente
node index.js

# 3. O usar el script de lanzaiento
./LAUNCH-FEYNMAN-SIMPLE.bat
```

### 3.2 Modo Desarrollo
**Descripción**: Sistema con todas las dependencias instaladas.

**Ventajas**:
- Acceso a todas las funcionalidades
- Mejor rendimiento
- Herramientas de desarrollo

**Desventajas**:
- Requiere instalación de dependencias
- Mayor uso de recursos

**Procedimiento de Despliegue**:
```bash
# 1. Navegar al directorio principal
cd QBTC-UNIFIED/VigoFutures

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run start

# 4. O usar el script de lanzaiento
./LAUNCH-FEYNMAN.bat
```

### 3.3 Modo Tandalones
**Descripción**: Bot de futuros operando de forma independiente.

**Ventajas**:
- Sistema completamente independiente
- Gestión propia de recursos
- Aislamiento de fallos

**Desventajas**:
- No integra otros componentes
- Configuración duplicada

**Procedimiento de Despliegue**:
```bash
# 1. Navegar al directorio del bot
cd QBTC-UNIFIED/VigoFutures/bot-futuros

# 2. Configurar variables de entorno
cp .env-example .env
# Editar .env con configuración deseada

# 3. Ejecutar el bot
node server.js

# 4. O usar el script de lanzaiento
./LAUNCH-BOT-TANDALONES.bat
```

### 3.4 Modo Feynman Completo
**Descripción**: Todos los componentes operando en conjunto.

**Ventajas**:
- Máxima optimización cuántica
- Sincronización completa
- Mejor rendimiento global

**Desventajas**:
- Mayor complejidad de despliegue
- Requiere más recursos

**Procedimiento de Despliegue**:
```bash
# 1. Navegar al directorio principal
cd QBTC-UNIFIED/VigoFutures

# 2. Asegurar SINGLE_SERVER_MODE=false
# Editar variables de entorno o archivos de configuración

# 3. Ejecutar el sistema completo
node index.js

# 4. O usar el script de lanzaiento completo
./LAUNCH-FEYNMAN-BINANCE.bat
```

### 3.5 Despliegue en Producción

#### 3.5.1 Usando PM2 (Process Manager)
```bash
# 1. Instalar PM2 globalmente
npm install -g pm2

# 2. Crear archivo ecosystem.config.js
module.exports = {
  apps: [{
    name: 'qbtc-unified',
    script: 'index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      UNIFIED_SERVER_PORT: 18020,
      SINGLE_SERVER_MODE: false,
      COORDINATOR_PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};

# 3. Iniciar aplicación con PM2
pm2 start ecosystem.config.js

# 4. Guardar configuración PM2
pm2 save

# 5. Configurar inicio automático
pm2 startup
```

#### 3.5.2 Usando Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 18020 3000 5500 8002

USER node

CMD ["node", "index.js"]
```

```bash
# Construir imagen
docker build -t qbtc-unified .

# Ejecutar contenedor
docker run -d \
  --name qbtc-unified \
  -p 18020:18020 \
  -p 3000:3000 \
  -p 5500:5500 \
  -p 8002:8002 \
  -e BINANCE_API_KEY=tu-api-key \
  -e BINANCE_API_SECRET=tu-secret \
  qbtc-unified
```

## Procedimientos de Operación

### 4.1 Inicio del Sistema

#### 4.1.1 Procedimiento Estándar
1. **Verificar requisitos del sistema**
   ```bash
   node --version
   npm --version
   ```

2. **Configurar variables de entorno**
   ```bash
   cp quantum-core/env-example.txt quantum-core/.env
   # Editar .env con valores apropiados
   ```

3. **Iniciar el sistema**
   ```bash
   # Modo standalone
   node index.js
   
   # O con npm
   npm run start
   ```

4. **Verificar funcionamiento**
   ```bash
   # Verificar health check
   curl http://localhost:18020/health
   
   # Verificar coordinator (si está habilitado)
   curl http://localhost:3000/health
   ```

#### 4.1.2 Procedimiento para Producción
1. **Verificar entorno de producción**
   ```bash
   # Verificar variables de entorno
   echo $NODE_ENV
   echo $BINANCE_API_KEY
   ```

2. **Iniciar con PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 status
   ```

3. **Verificar todos los servicios**
   ```bash
   # Verificar logs
   pm2 logs qbtc-unified
   
   # Verificar métricas
   pm2 monit
   ```

### 4.2 Monitoreo del Sistema

#### 4.2.1 Health Checks
```bash
# Health check del core
curl http://localhost:18020/health

# Health check del coordinator
curl http://localhost:3000/health

# Health check del bot
curl http://localhost:5500/health

# Health check del futures bot
curl http://localhost:8002/health
```

#### 4.2.2 Métricas Cuánticas
```bash
# Obtener métricas cuánticas
curl http://localhost:18020/api/quantum-metrics

# Obtener status del bot
curl http://localhost:5500/api/status

# Obtener análisis Leonardo
curl http://localhost:8002/leonardo-analysis
```

#### 4.2.3 Monitoreo de Logs
```bash
# Ver logs en tiempo real
tail -f core/quantum-engine/logs/quantum-engine-feynman-$(date +%Y-%m-%d).log

# Ver logs de cuadrantes
tail -f core/quantum-engine/logs/feynman-q1/q1-$(date +%Y-%m-%d).log

# Ver logs del bot
tail -f bot-futuros/logs/bot-$(date +%Y-%m-%d).log

# Con PM2
pm2 logs qbtc-unified
```

### 4.3 Gestión de Servicios

#### 4.3.1 Reinicio de Servicios
```bash
# Reinicio manual
pm2 restart qbtc-unified

# Reinicio forzado
pm2 restart qbtc-unified --force

# Reinicio con recarga suave
pm2 reload qbtc-unified
```

#### 4.3.2 Escalado de Servicios
```bash
# Escalar a 4 instancias
pm2 scale qbtc-unified 4

# Escalar automáticamente basado en CPU
pm2 scale qbtc-unified max
```

#### 4.3.3 Actualización en Caliente
```bash
# Actualizar código
git pull origin main

# Recargar aplicación
pm2 reload qbtc-unified

# Verificar estado
pm2 status
```

### 4.4 Gestión de Configuración

#### 4.4.1 Actualización de Configuración
1. **Editar archivos de configuración**
   ```bash
   # Editar configuración principal
   nano config/config.js
   
   # Editar configuración Feynman
   nano core/quantum-engine/feynman-binance-config.json
   
   # Editar configuración del bot
   nano bot-futuros/config.js
   ```

2. **Reiniciar servicios**
   ```bash
   pm2 restart qbtc-unified
   ```

3. **Verificar cambios**
   ```bash
   curl http://localhost:18020/health
   ```

#### 4.4.2 Gestión de Variables de Entorno
```bash
# Editar variables de entorno
nano quantum-core/.env

# Recargar variables (requiere reinicio)
pm2 restart qbtc-unified

# Verificar variables cargadas
pm2 env qbtc-unified
```

## Monitoreo y Mantenimiento

### 5.1 Monitoreo Continuo

#### 5.1.1 Métricas Clave a Monitorear
- **CPU Usage**: Mantener por debajo del 80%
- **Memory Usage**: Monitorear fugas de memoria
- **Response Time**: Mantener por debajo de 100ms
- **Error Rate**: Mantener por debajo del 1%
- **Quantum Resonance**: Mantener alrededor de 888MHz
- **Feynman Efficiency**: Monitorear los 4 cuadrantes

#### 5.1.2 Scripts de Monitoreo
```bash
#!/bin/bash
# monitor.sh - Script de monitoreo básico

# Verificar health checks
curl -f http://localhost:18020/health || echo "Quantum Core DOWN"
curl -f http://localhost:3000/health || echo "Coordinator DOWN"
curl -f http://localhost:5500/health || echo "Bot Service DOWN"

# Verificar uso de recursos
echo "=== CPU Usage ==="
top -bn1 | grep "Cpu(s)" | awk '{print $2}'

echo "=== Memory Usage ==="
free -h

echo "=== Disk Usage ==="
df -h

# Verificar logs recientes
echo "=== Recent Errors ==="
tail -n 20 core/quantum-engine/logs/quantum-engine-feynman-$(date +%Y-%m-%d).log | grep ERROR
```

### 5.2 Mantenimiento Programado

#### 5.2.1 Rotación de Logs
```bash
#!/bin/bash
# rotate-logs.sh - Rotación de logs

LOG_DIR="core/quantum-engine/logs"
BOT_LOG_DIR="bot-futuros/logs"

# Rotar logs del motor cuántico
find $LOG_DIR -name "*.log" -mtime +7 -exec gzip {} \;
find $LOG_DIR -name "*.log.gz" -mtime +30 -delete

# Rotar logs del bot
find $BOT_LOG_DIR -name "*.log" -mtime +7 -exec gzip {} \;
find $BOT_LOG_DIR -name "*.log.gz" -mtime +30 -delete

echo "Log rotation completed"
```

#### 5.2.2 Limpieza de Caché
```bash
#!/bin/bash
# cleanup.sh - Limpieza del sistema

# Limpiar caché de Node.js
rm -rf node_modules/.cache

# Limpiar logs antiguos
find . -name "*.log" -mtime +30 -delete

# Limpiar archivos temporales
find . -name "*.tmp" -delete
find . -name "*.temp" -delete

echo "Cleanup completed"
```

### 5.3 Actualizaciones del Sistema

#### 5.3.1 Procedimiento de Actualización
1. **Backup del sistema**
   ```bash
   # Crear backup
   tar -czf qbtc-backup-$(date +%Y%m%d).tar.gz \
       --exclude=node_modules \
       --exclude=logs \
       --exclude=.git \
       ./
   ```

2. **Actualizar código fuente**
   ```bash
   git pull origin main
   ```

3. **Actualizar dependencias**
   ```bash
   npm install
   ```

4. **Actualizar configuración**
   ```bash
   # Comparar archivos de configuración
   git diff config/config.js
   ```

5. **Reiniciar servicios**
   ```bash
   pm2 restart qbtc-unified
   ```

6. **Verificar funcionamiento**
   ```bash
   curl http://localhost:18020/health
   ```

## Gestión de Incidentes

### 6.1 Clasificación de Incidentes

#### 6.1.1 Nivel 1 - Crítico
- **Impacto**: Sistema completamente fuera de servicio
- **Respuesta**: Inmediata (< 5 minutos)
- **Ejemplos**:
  - Caída total del sistema
  - Pérdida de conexión con Binance
  - Errores críticos en trading

#### 6.1.2 Nivel 2 - Alto
- **Impacto**: Funcionalidad limitada
- **Respuesta**: Rápida (< 30 minutos)
- **Ejemplos**:
  - Degradación del rendimiento
  - Errores en cuadrantes específicos
  - Problemas con APIs externas

#### 6.1.3 Nivel 3 - Medio
- **Impacto**: Funcionalidad alternativa disponible
- **Respuesta**: Planificada (< 2 horas)
- **Ejemplos**:
  - Problemas con componentes secundarios
  - Errores de configuración
  - Problemas de monitoreo

#### 6.1.4 Nivel 4 - Bajo
- **Impacto**: Mínimo impacto en operaciones
- **Respuesta**: Planificada (< 24 horas)
- **Ejemplos**:
  - Problemas cosméticos
  - Mejoras sugeridas
  - Documentación

### 6.2 Procedimientos de Respuesta

#### 6.2.1 Incidente Nivel 1 - Crítico
```bash
# 1. Verificar estado del sistema
pm2 status
pm2 logs qbtc-unified --lines 50

# 2. Reiniciar servicios
pm2 restart qbtc-unified

# 3. Verificar health checks
curl http://localhost:18020/health
curl http://localhost:3000/health

# 4. Si no funciona, restaurar backup
pm2 stop qbtc-unified
tar -xzf qbtc-backup-latest.tar.gz
pm2 start qbtc-unified

# 5. Notificar al equipo de soporte
echo "CRITICAL: System failure at $(date)" | mail -s "QBTC-UNIFIED Critical" support@team.com
```

#### 6.2.2 Incidente Nivel 2 - Alto
```bash
# 1. Identificar componente afectado
curl http://localhost:18020/health
curl http://localhost:5500/health

# 2. Verificar logs específicos
tail -f core/quantum-engine/logs/quantum-engine-feynman-$(date +%Y-%m-%d).log

# 3. Reiniciar componente específico
pm2 restart qbtc-unified

# 4. Monitorear recuperación
watch -n 5 'curl http://localhost:18020/health'
```

### 6.3 Recuperación ante Desastres

#### 6.3.1 Estrategia de Backup
```bash
#!/bin/bash
# backup.sh - Script de backup completo

BACKUP_DIR="/backups/qbtc"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/qbtc-backup-$DATE.tar.gz"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Crear backup
tar -czf $BACKUP_FILE \
    --exclude=node_modules \
    --exclude=logs \
    --exclude=.git \
    --exclude=*.log \
    ./

# Mantener últimos 7 días de backups
find $BACKUP_DIR -name "qbtc-backup-*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

#### 6.3.2 Procedimiento de Restauración
```bash
#!/bin/bash
# restore.sh - Script de restauración

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup-file>"
    exit 1
fi

# Detener servicios
pm2 stop qbtc-unified

# Hacer backup del estado actual
tar -czf /tmp/qbtc-before-restore-$(date +%Y%m%d_%H%M%S).tar.gz ./

# Restaurar backup
tar -xzf $BACKUP_FILE

# Iniciar servicios
pm2 start qbtc-unified

# Verificar restauración
curl http://localhost:18020/health

echo "Restore completed from: $BACKUP_FILE"
```

## Actualizaciones y Mejoras

### 7.1 Ciclo de Vida de Actualizaciones

#### 7.1.1 Fases del Ciclo
1. **Planificación**: Identificar necesidades y prioridades
2. **Desarrollo**: Implementar cambios en entorno de desarrollo
3. **Pruebas**: Validar en entorno de staging
4. **Despliegue**: Implementar en producción
5. **Monitoreo**: Verificar funcionamiento post-actualización

#### 7.1.2 Procedimiento Estándar
```bash
# 1. Crear rama de desarrollo
git checkout -b feature/new-feature

# 2. Implementar cambios
# ... (desarrollo)

# 3. Probar cambios
npm test
npm run lint

# 4. Fusionar con main
git checkout main
git merge feature/new-feature

# 5. Desplegar en producción
git push origin main
pm2 reload qbtc-unified
```

### 7.2 Gestión de Versiones

#### 7.2.1 Esquema de Versionado
- **Major**: Cambios incompatibles (X.0.0)
- **Minor**: Nuevas funcionalidades compatibles (X.Y.0)
- **Patch**: Correcciones de errores (X.Y.Z)

#### 7.2.2 Procedimiento de Lanzamiento
```bash
#!/bin/bash
# release.sh - Script de lanzamiento

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    exit 1
fi

# Actualizar versión en package.json
npm version $VERSION

# Crear tag
git tag -a v$VERSION -m "Version $VERSION"

# Push cambios
git push origin main
git push origin v$VERSION

# Publicar en npm (si aplica)
npm publish

echo "Release $VERSION completed"
```

## Seguridad y Cumplimiento

### 8.1 Mejores Prácticas de Seguridad

#### 8.1.1 Gestión de Credenciales
```bash
# Nunca almacenar credenciales en código
# Usar variables de entorno o archivos .env

# Proteger archivos de configuración
chmod 600 quantum-core/.env
chmod 600 bot-futuros/.env

# Rotar claves de API regularmente
# Usar diferentes claves para testnet y producción
```

#### 8.1.2 Configuración de Firewall
```bash
# Reglas de firewall recomendadas
# Permitir solo puertos necesarios
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 18020/tcp # Quantum Core
ufw allow 3000/tcp  # Coordinator
ufw allow 5500/tcp  # Bot Service
ufw allow 8002/tcp  # Futures Bot

# Denegar todo lo demás
ufw default deny incoming
ufw default allow outgoing

# Habilitar firewall
ufw enable
```

### 8.2 Auditoría de Seguridad

#### 8.2.1 Checklist de Seguridad
- [ ] Las claves de API están rotadas regularmente
- [ ] No hay credenciales en el código fuente
- [ ] Los archivos de configuración tienen permisos restringidos
- [ ] El sistema está detrás de un firewall
- [ ] Los logs no contienen información sensible
- [ ] Las conexiones usan HTTPS/TLS
- [ ] El sistema está actualizado con los últimos parches
- [ ] Hay procedimientos de respaldo y restauración

#### 8.2.2 Auditoría de Logs
```bash
#!/bin/bash
# audit.sh - Script de auditoría de seguridad

# Verificar accesos no autorizados
grep "Unauthorized" core/quantum-engine/logs/*.log

# Verificar errores de autenticación
grep "Authentication failed" core/quantum-engine/logs/*.log

# Verificar patrones sospechosos
grep "ERROR" core/quantum-engine/logs/*.log | tail -20

# Verificar uso de recursos inusual
top -bn1 | head -20

echo "Audit completed"
```

## Solución de Problemas

### 9.1 Problemas Comunes

#### 9.1.1 El Sistema No Inicia
**Síntomas**: El sistema no responde en los puertos configurados

**Causas Posibles**:
- Puertos ya en uso
- Permisos insuficientes
- Configuración incorrecta

**Soluciones**:
```bash
# Verificar puertos en uso
netstat -tulpn | grep :18020
netstat -tulpn | grep :3000

# Cambiar puertos en configuración
# Editar config/config.js o variables de entorno

# Verificar permisos
ls -la index.js
chmod +x index.js

# Verificar logs de error
pm2 logs qbtc-unified
```

#### 9.1.2 Conexión con Binance Fallida
**Síntomas**: Errores de autenticación o conexión con Binance API

**Causas Posibles**:
- Claves de API incorrectas
- Problemas de red
- Límites de tasa excedidos

**Soluciones**:
```bash
# Verificar claves de API
echo $BINANCE_API_KEY
echo $BINANCE_API_SECRET

# Probar conexión manual
curl -H "X-MBX-APIKEY: $BINANCE_API_KEY" \
     "https://api.binance.com/api/v3/ping"

# Verificar límites de tasa
curl -H "X-MBX-APIKEY: $BINANCE_API_KEY" \
     "https://api.binance.com/api/v3/exchangeInfo"

# Revisar logs de errores
grep "Binance" core/quantum-engine/logs/*.log
```

#### 9.1.3 Alto Uso de CPU/Memoria
**Síntomas**: El sistema consume recursos excesivos

**Causas Posibles**:
- Fugas de memoria
- Bucles infinitos
- Demasiadas conexiones simultáneas

**Soluciones**:
```bash
# Monitorear uso de recursos
htop
pm2 monit

# Reiniciar servicios
pm2 restart qbtc-unified

# Verificar memoria usada
pm2 info qbtc-unified

# Analizar logs para patrones inusuales
tail -f core/quantum-engine/logs/*.log | grep -i "error\|warning"
```

### 9.2 Diagnóstico Avanzado

#### 9.2.1 Herramientas de Diagnóstico
```bash
# Verificar estado de procesos
ps aux | grep node

# Verificar conexiones de red
netstat -an | grep ESTABLISHED

# Verificar uso de disco
df -h

# Verificar memoria disponible
free -h

# Verificar carga del sistema
uptime
```

#### 9.2.2 Análisis de Logs
```bash
# Buscar patrones de error
grep -r "ERROR" core/quantum-engine/logs/ | tail -20

# Buscar advertencias
grep -r "WARN" core/quantum-engine/logs/ | tail -20

# Analizar rendimiento
grep "performance" core/quantum-engine/logs/*.log

# Verificar transacciones fallidas
grep "failed" core/quantum-engine/logs/*.log
```

## Apéndice

### A.1 Referencia Rápida de Comandos

#### A.1.1 Comandos Básicos
```bash
# Iniciar sistema
node index.js
npm start
pm2 start index.js

# Verificar estado
curl http://localhost:18020/health
pm2 status

# Ver logs
tail -f core/quantum-engine/logs/*.log
pm2 logs

# Reiniciar
pm2 restart qbtc-unified

# Detener
pm2 stop qbtc-unified
```

#### A.1.2 Comandos de Monitoreo
```bash
# Monitorear recursos
htop
pm2 monit

# Verificar puertos
netstat -tulpn

# Verificar conexiones
ss -tulpn

# Verificar procesos
ps aux | grep node
```

### A.2 Archivos de Configuración Importantes

#### A.2.1 Archivos Principales
- `index.js` - Punto de entrada principal
- `config/config.js` - Configuración del sistema
- `quantum-core/.env` - Variables de entorno
- `core/quantum-engine/feynman-binance-config.json` - Configuración Feynman
- `bot-futuros/config.js` - Configuración del bot

#### A.2.2 Scripts de Lanzamiento
- `LAUNCH-FEYNMAN.bat` - Lanzamiento completo
- `LAUNCH-FEYNMAN-SIMPLE.bat` - Lanzamiento simple
- `LAUNCH-FEYNMAN-BINANCE.bat` - Lanzamiento con Binance
- `bot-futuros/LAUNCH-BOT-TANDALONES.bat` - Bot independiente

### A.3 Puertos por Defecto

| Servicio | Puerto | Protocolo | Descripción |
|----------|--------|-----------|-------------|
| Quantum Core | 18020 | HTTP/WS | Servicio principal |
| Coordinator | 3000 | HTTP | Servicio de coordinación |
| Bot Service | 5500 | HTTP | Servicio del bot |
| Futures Bot | 8002 | HTTP | Bot de futuros Leonardo |

### A.4 Variables de Entorno Clave

| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| UNIFIED_SERVER_PORT | 18020 | Puerto del servidor unificado |
| SINGLE_SERVER_MODE | true | Modo de servidor único |
| COORDINATOR_PORT | 3000 | Puerto del coordinator |
| BINANCE_API_KEY | - | Clave de API de Binance |
| BINANCE_API_SECRET | - | Secret de API de Binance |
| BINANCE_TESTNET | false | Usar testnet de Binance |

### A.5 Contacto y Soporte

#### A.5.1 Canales de Soporte
- **Documentación**: Archivos README y markdown en el repositorio
- **Logs**: Revisar archivos de logs en `core/quantum-engine/logs/`
- **Health Checks**: Usar endpoints `/health` para diagnóstico
- **Métricas**: Usar endpoints `/api/status` para monitoreo

#### A.5.2 Escalada de Incidentes
1. **Nivel 1**: Revisar logs y reiniciar servicios
2. **Nivel 2**: Verificar configuración y entorno
3. **Nivel 3**: Restaurar desde backup
4. **Nivel 4**: Contactar equipo de desarrollo

---

Esta guía proporciona una referencia completa para el despliegue, operación y mantenimiento del sistema QBTC-UNIFIED. Para preguntas específicas o problemas no cubiertos en esta guía, por favor consulte los archivos de documentación adicionales o contacte al equipo de desarrollo.
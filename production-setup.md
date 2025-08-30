# Configuración de Producción para el Sistema Quantum Trading

Este documento describe los pasos necesarios para unificar y desplegar el sistema en un entorno de producción real.

## Componentes del Sistema

El sistema Quantum Trading consta de los siguientes componentes principales:

1. **Core API (puerto 4601)**
   - Implementado en `index.js`
   - Proporciona la lógica principal de trading y análisis cuántico

2. **Frontend API (puerto 4602)**
   - Implementado en `frontend-api-extended.js`
   - Sirve la interfaz de usuario y proporciona endpoints para el frontend

3. **Monitor en Tiempo Real (puerto 8082)**
   - Implementado en `quantum-real-time-monitor.js`
   - Proporciona monitoreo en tiempo real de las operaciones

4. **Frontend**
   - Archivos HTML, CSS y JavaScript en el directorio `frontend/`
   - Interfaz de usuario para el sistema de trading

## Arquitectura Unificada para Producción

Para unificar el sistema en un entorno de producción real, se recomienda la siguiente arquitectura:

```
                   +-------------------+
                   |  Reverse Proxy    |
                   | (Nginx/Traefik)   |
                   +--------+----------+
                            |
           +----------------+-----------------+
           |                |                 |
+----------v-------+ +------v--------+ +------v--------+
|   Core API       | | Frontend API   | | Monitor      |
| (puerto 4601)    | | (puerto 4602)  | | (puerto 8082)|
+------------------+ +---------------+ +--------------+
```

## Pasos para la Unificación y Despliegue

### 1. Consolidar Configuración

Crear un archivo de configuración unificado `config.js` que contenga todas las configuraciones necesarias:

```javascript
module.exports = {
    // Configuración general
    environment: process.env.NODE_ENV || 'production',
    
    // Configuración de puertos
    ports: {
        core: process.env.CORE_PORT || 4601,
        frontend: process.env.FRONTEND_PORT || 4602,
        monitor: process.env.MONITOR_PORT || 8082
    },
    
    // Configuración de Binance
    binance: {
        apiKey: process.env.BINANCE_API_KEY,
        apiSecret: process.env.BINANCE_API_SECRET,
        testnet: process.env.BINANCE_TESTNET === 'true'
    },
    
    // Configuración del sistema cuántico
    quantum: {
        orchEnabled: true,
        orchCoherenceThreshold: 0.618,
        orchExplorationMaxAdj: 0.1,
        symbols: ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE']
    },
    
    // Configuración de riesgo
    risk: {
        maxDrawdown: 0.2,
        maxPositionSize: 0.1,
        stopLoss: 0.05,
        takeProfit: 0.15
    },
    
    // Configuración de logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || 'logs/system.log'
    }
};
```

### 2. Script de Inicio Unificado

Crear un script de inicio unificado `start-production.js` que inicie todos los componentes:

```javascript
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const config = require('./config');

// Asegurar que el directorio de logs existe
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Función para iniciar un componente
function startComponent(scriptPath, name, port, env = {}) {
    console.log(`Iniciando ${name} en puerto ${port}...`);
    
    const logFile = fs.createWriteStream(path.join(logsDir, `${name}.log`), { flags: 'a' });
    
    const process = spawn('node', [scriptPath], {
        env: { ...process.env, ...env, PORT: port },
        stdio: ['ignore', 'pipe', 'pipe']
    });
    
    process.stdout.pipe(logFile);
    process.stderr.pipe(logFile);
    
    process.on('error', (error) => {
        console.error(`Error al iniciar ${name}:`, error);
    });
    
    process.on('exit', (code) => {
        console.log(`${name} se ha detenido con código ${code}`);
        // Reiniciar automáticamente en producción
        if (config.environment === 'production') {
            console.log(`Reiniciando ${name}...`);
            startComponent(scriptPath, name, port, env);
        }
    });
    
    return process;
}

// Iniciar componentes
const coreProcess = startComponent(
    path.join(__dirname, 'index.js'),
    'core-api',
    config.ports.core,
    { VIGO_FUTURES_ENABLED: 'false' }
);

// Esperar 5 segundos para que el Core API se inicie
setTimeout(() => {
    const frontendProcess = startComponent(
        path.join(__dirname, 'frontend-api-extended.js'),
        'frontend-api',
        config.ports.frontend
    );
    
    // Esperar 2 segundos más para que el Frontend API se inicie
    setTimeout(() => {
        const monitorProcess = startComponent(
            path.join(__dirname, 'quantum-real-time-monitor.js'),
            'monitor',
            config.ports.monitor
        );
    }, 2000);
}, 5000);

// Manejar señales de terminación
process.on('SIGTERM', () => {
    console.log('Recibida señal SIGTERM, cerrando procesos...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Recibida señal SIGINT, cerrando procesos...');
    process.exit(0);
});
```

### 3. Configuración de Nginx como Reverse Proxy

Crear un archivo de configuración de Nginx `quantum-trading.conf`:

```nginx
server {
    listen 80;
    server_name trading.example.com;  # Reemplazar con el dominio real

    # Redireccionar a HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name trading.example.com;  # Reemplazar con el dominio real

    # Configuración SSL
    ssl_certificate /etc/letsencrypt/live/trading.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/trading.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Configuración de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";

    # Frontend estático
    location / {
        proxy_pass http://localhost:4602;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Core API
    location /api/ {
        proxy_pass http://localhost:4601/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Monitor WebSocket
    location /ws {
        proxy_pass http://localhost:8082;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Configuración de caché para archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:4602;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Configuración de logs
    access_log /var/log/nginx/quantum-trading-access.log;
    error_log /var/log/nginx/quantum-trading-error.log;
}
```

### 4. Script de Instalación de Dependencias

Crear un script `install-dependencies.sh` para instalar todas las dependencias necesarias:

```bash
#!/bin/bash

# Actualizar sistema
echo "Actualizando sistema..."
apt-get update
apt-get upgrade -y

# Instalar Node.js y npm
echo "Instalando Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Instalar Nginx
echo "Instalando Nginx..."
apt-get install -y nginx

# Instalar PM2 para gestión de procesos
echo "Instalando PM2..."
npm install -g pm2

# Instalar dependencias del proyecto
echo "Instalando dependencias del proyecto..."
npm install

# Configurar Nginx
echo "Configurando Nginx..."
cp quantum-trading.conf /etc/nginx/sites-available/
ln -sf /etc/nginx/sites-available/quantum-trading.conf /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Configurar certificado SSL con Let's Encrypt
echo "Configurando SSL con Let's Encrypt..."
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d trading.example.com  # Reemplazar con el dominio real

echo "Instalación completada."
```

### 5. Configuración de PM2 para Gestión de Procesos

Crear un archivo de configuración `ecosystem.config.js` para PM2:

```javascript
module.exports = {
  apps: [
    {
      name: 'quantum-core',
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4601,
        VIGO_FUTURES_ENABLED: 'false'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'quantum-frontend-api',
      script: 'frontend-api-extended.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4602
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'quantum-monitor',
      script: 'quantum-real-time-monitor.js',
      env: {
        NODE_ENV: 'production',
        PORT: 8082
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

### 6. Script de Despliegue

Crear un script `deploy.sh` para desplegar el sistema:

```bash
#!/bin/bash

# Detener procesos existentes
echo "Deteniendo procesos existentes..."
pm2 stop all

# Actualizar código desde el repositorio
echo "Actualizando código..."
git pull origin main

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Iniciar procesos con PM2
echo "Iniciando procesos..."
pm2 start ecosystem.config.js

# Guardar configuración de PM2
echo "Guardando configuración de PM2..."
pm2 save

# Configurar inicio automático
echo "Configurando inicio automático..."
pm2 startup

echo "Despliegue completado."
```

### 7. Script de Monitoreo y Alertas

Crear un script `monitor.js` para monitorear el sistema y enviar alertas:

```javascript
const http = require('http');
const nodemailer = require('nodemailer');
const config = require('./config');

// Configuración de correo electrónico
const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
        user: 'alerts@example.com',
        pass: 'password'
    }
});

// Función para verificar un servicio
async function checkService(name, url) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            resolve({
                name,
                status: res.statusCode === 200 ? 'online' : 'error',
                statusCode: res.statusCode
            });
        });
        
        req.on('error', (error) => {
            resolve({
                name,
                status: 'offline',
                error: error.message
            });
        });
        
        req.setTimeout(5000, () => {
            req.abort();
            resolve({
                name,
                status: 'timeout',
                error: 'Request timed out'
            });
        });
    });
}

// Función para enviar alerta
async function sendAlert(service) {
    try {
        await transporter.sendMail({
            from: 'alerts@example.com',
            to: 'admin@example.com',
            subject: `ALERTA: Servicio ${service.name} ${service.status}`,
            text: `
                Se ha detectado un problema con el servicio ${service.name}.
                Estado: ${service.status}
                ${service.statusCode ? `Código de estado: ${service.statusCode}` : ''}
                ${service.error ? `Error: ${service.error}` : ''}
                Fecha y hora: ${new Date().toISOString()}
            `,
            html: `
                <h2>Alerta de Servicio</h2>
                <p>Se ha detectado un problema con el servicio <strong>${service.name}</strong>.</p>
                <ul>
                    <li>Estado: <strong>${service.status}</strong></li>
                    ${service.statusCode ? `<li>Código de estado: ${service.statusCode}</li>` : ''}
                    ${service.error ? `<li>Error: ${service.error}</li>` : ''}
                    <li>Fecha y hora: ${new Date().toISOString()}</li>
                </ul>
            `
        });
        
        console.log(`Alerta enviada para ${service.name}`);
    } catch (error) {
        console.error('Error al enviar alerta:', error);
    }
}

// Función principal de monitoreo
async function monitor() {
    const services = [
        { name: 'Core API', url: `http://localhost:${config.ports.core}/health` },
        { name: 'Frontend API', url: `http://localhost:${config.ports.frontend}/health` },
        { name: 'Monitor', url: `http://localhost:${config.ports.monitor}/status` }
    ];
    
    for (const service of services) {
        const result = await checkService(service.name, service.url);
        console.log(`${service.name}: ${result.status}`);
        
        if (result.status !== 'online') {
            await sendAlert(result);
        }
    }
}

// Ejecutar monitoreo cada 5 minutos
setInterval(monitor, 5 * 60 * 1000);
monitor();
```

### 8. Configuración de Seguridad

Crear un archivo `.env` para almacenar variables de entorno sensibles:

```
# API Keys de Binance
BINANCE_API_KEY=your_api_key_here
BINANCE_API_SECRET=your_api_secret_here
BINANCE_TESTNET=false

# Configuración de puertos
CORE_PORT=4601
FRONTEND_PORT=4602
MONITOR_PORT=8082

# Configuración de logging
LOG_LEVEL=info
LOG_FILE=logs/system.log

# Configuración de entorno
NODE_ENV=production
```

### 9. Script de Respaldo

Crear un script `backup.sh` para realizar respaldos periódicos:

```bash
#!/bin/bash

# Configuración
BACKUP_DIR="/var/backups/quantum-trading"
PROJECT_DIR="/path/to/quantum-trading"
DATE=$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE="$BACKUP_DIR/quantum-trading-backup-$DATE.tar.gz"

# Crear directorio de respaldo si no existe
mkdir -p $BACKUP_DIR

# Crear respaldo
echo "Creando respaldo..."
tar -czf $BACKUP_FILE -C $PROJECT_DIR .

# Limpiar respaldos antiguos (mantener solo los últimos 7)
echo "Limpiando respaldos antiguos..."
ls -t $BACKUP_DIR/quantum-trading-backup-*.tar.gz | tail -n +8 | xargs -r rm

echo "Respaldo completado: $BACKUP_FILE"
```

## Recomendaciones para Producción

1. **Seguridad**:
   - Utilizar HTTPS para todas las comunicaciones
   - Implementar autenticación para acceder al sistema
   - Mantener las claves API de Binance seguras
   - Configurar firewalls para restringir el acceso a los puertos

2. **Monitoreo**:
   - Implementar monitoreo de recursos (CPU, memoria, disco)
   - Configurar alertas para problemas críticos
   - Mantener logs para diagnóstico y auditoría

3. **Respaldos**:
   - Realizar respaldos periódicos de la configuración y datos
   - Almacenar respaldos en ubicaciones seguras

4. **Escalabilidad**:
   - Considerar la implementación de balanceo de carga para alta disponibilidad
   - Monitorear el rendimiento y escalar según sea necesario

5. **Actualizaciones**:
   - Implementar un proceso de prueba para actualizaciones
   - Mantener un entorno de staging para probar cambios antes de producción

## Conclusión

Siguiendo estos pasos, el sistema Quantum Trading puede ser unificado y desplegado en un entorno de producción real de manera segura y eficiente. Esta configuración proporciona alta disponibilidad, seguridad y facilidad de mantenimiento para el sistema.

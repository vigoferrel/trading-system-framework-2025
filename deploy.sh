#!/bin/bash
#
# Script de despliegue para el sistema Quantum Trading
#
# Este script automatiza el proceso de despliegue del sistema en un entorno de producción.
# Realiza las siguientes tareas:
# - Detiene los procesos existentes
# - Actualiza el código desde el repositorio
# - Instala las dependencias
# - Inicia los procesos con PM2
# - Configura el inicio automático

# Salir si ocurre un error
set -e

# Cargar variables de entorno
if [ -f .env ]; then
  echo "Cargando variables de entorno..."
  export $(cat .env | grep -v '^#' | xargs)
fi

# Configuración
APP_DIR=$(pwd)
BACKUP_DIR="$APP_DIR/backups"
LOG_DIR="$APP_DIR/logs"
DATE=$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE="$BACKUP_DIR/quantum-trading-backup-$DATE.tar.gz"

# Función para mostrar mensajes
function log_message {
  echo "$(date +"%Y-%m-%d %H:%M:%S") - $1"
}

# Función para realizar respaldo
function backup {
  log_message "Creando respaldo..."
  mkdir -p $BACKUP_DIR
  
  # Excluir node_modules y logs
  tar --exclude='./node_modules' --exclude='./logs' -czf $BACKUP_FILE .
  
  log_message "Respaldo creado: $BACKUP_FILE"
  
  # Limpiar respaldos antiguos (mantener solo los últimos 7)
  find $BACKUP_DIR -name "quantum-trading-backup-*.tar.gz" -type f -mtime +7 -delete
}

# Verificar si PM2 está instalado
if ! command -v pm2 &> /dev/null; then
  log_message "PM2 no está instalado. Instalando..."
  npm install -g pm2
fi

# Crear directorio de logs si no existe
mkdir -p $LOG_DIR

# Realizar respaldo
backup

# Detener procesos existentes
log_message "Deteniendo procesos existentes..."
pm2 stop all || true

# Actualizar código desde el repositorio
if [ -d .git ]; then
  log_message "Actualizando código desde el repositorio..."
  git pull origin main
else
  log_message "No es un repositorio git. Omitiendo actualización de código."
fi

# Instalar dependencias
log_message "Instalando dependencias..."
npm install --production

# Iniciar procesos con PM2
log_message "Iniciando procesos..."
pm2 start ecosystem.config.js

# Guardar configuración de PM2
log_message "Guardando configuración de PM2..."
pm2 save

# Configurar inicio automático
log_message "Configurando inicio automático..."
pm2 startup

# Verificar estado de los procesos
log_message "Verificando estado de los procesos..."
pm2 list

# Verificar que los servicios estén funcionando
log_message "Verificando servicios..."

# Verificar Core API
if curl -s http://localhost:${CORE_PORT:-4601}/health | grep -q "ok"; then
  log_message "Core API: OK"
else
  log_message "Core API: ERROR"
  pm2 logs quantum-core --lines 20
fi

# Verificar Frontend API
if curl -s http://localhost:${FRONTEND_PORT:-4602}/health | grep -q "ok"; then
  log_message "Frontend API: OK"
else
  log_message "Frontend API: ERROR"
  pm2 logs quantum-frontend-api --lines 20
fi

# Verificar Monitor
if curl -s http://localhost:${MONITOR_PORT:-8082}/status | grep -q "ok"; then
  log_message "Monitor: OK"
else
  log_message "Monitor: ERROR"
  pm2 logs quantum-monitor --lines 20
fi

log_message "Despliegue completado."

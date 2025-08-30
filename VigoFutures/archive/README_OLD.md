#  SISTEMA QBTC UNIFICADO
## *Trading Cuántico con Pensamiento Secuencial Leonardo*

---

##  DOCUMENTACIÓN ACTUALIZADA

Este sistema representa la implementación completa del framework de trading cuántico, optimizado para procesar **todos** los símbolos disponibles en Binance con máxima eficiencia y rentabilidad.

### Documentación Principal
- [ Documentación Completa](DOCUMENTACION_ACTUALIZADA.md) - Guía detallada del sistema
- [[START] Guía de Onboarding Rápido](GUIA_ONBOARDING_RAPIDO.md) - Primeros pasos (30 minutos)
- [[DATA] Abstract Científico-Financiero](ABSTRACT_CIENTIFICO_DIRECTOR_FINANCIERO.md) - Base teórica físico-matemática

### Componentes del Sistema
- [ Quantum Core](quantum-core/README.md) - Núcleo de procesamiento cuántico
- [[RELOAD] Coordinador](coordinator/BotCoordinator.js) - Sistema de orquestación de componentes
- [ Frontend](frontend/index.html) - Interfaz de usuario principal
- [ Frontend Simplificado](frontend-simplificado/README.md) - Interfaz alternativa
- [ Política de Conector Único (Singleton)](docs/CONNECTOR_SINGLETON.md)
- [ Bootstrap de DataService (preload opcional)](docs/DATASERVICE_BOOTSTRAP.md)

### Modo Universal
- [ Sistema Universal](quantum-core/universal-system-launcher.js) - Procesamiento de todos los símbolos
- [[UP] Correlación Universal](quantum-core/UniversalCorrelationAnalyzer.js) - Análisis de correlaciones
- [[DATA] Monitoreo Universal](quantum-core/UniversalSymbolMonitor.js) - Monitoreo en tiempo real

### Documentación API y Técnica
- [ API Documentation](quantum-core/API_DOCUMENTATION.md) - Endpoints disponibles
- [ NxN Matrix Documentation](quantum-core/NxN_BREAKTHROUGH_DOCUMENTATION.md) - Sistema NxN Matrix
- [[DATA] Métricas Esperadas](quantum-core/SYSTEM_METRICS_EXPECTATIONS.md) - Rendimiento objetivo

---

## [START] INICIO RÁPIDO

### 1. Instalación

```bash
# Clonar repositorio (si aplica)
git clone https://github.com/tu-usuario/qbtc-unified.git
cd qbtc-unified

# Instalar dependencias
cd quantum-core
npm install

cd ../coordinator
npm install
```

### 2. Configuración

```bash
# Configurar credenciales de Binance
cd quantum-core
cp env-example.txt .env
# Editar .env con tu API Key y Secret
```

### 3. Lanzamiento

Importante: el conector de Binance es único (singleton). No instancies múltiples conectores; importa la instancia compartida y llama initialize() una sola vez en el launcher.

Ejemplo (Node):

```js
const { connector } = require('./quantum-core/BinanceRealConnector');
await connector.initialize();
```

```bash
# Modo Universal (todos los símbolos)
./launch-quantum-universal.bat

# Modo Clásico (símbolos seleccionados)
./launch-qbtc-unified.bat
```

### 4. Acceso

- **Dashboard**: http://localhost:8080
- **API**: http://localhost:9090
- **Monitoreo**: http://localhost:9093

---

## Windows/PowerShell: Uso y Puertos sin Conflictos

Esta sección proporciona instrucciones específicas para Windows usando PowerShell, de acuerdo con la preferencia del usuario (PowerShell como CLI) y sin uso de emojis.

### Puertos en franja 80200 (anti-conflictos)
- Dashboard: http://localhost:80200
- API: http://localhost:80201
- Monitoreo/Métricas: http://localhost:80202/metrics

Puedes definir estos puertos con variables de entorno antes del lanzamiento:

```powershell
$env:DASHBOARD_PORT = "80200"
$env:API_PORT = "80201"
$env:METRICS_PORT = "80202"
# Persistir para nuevas sesiones
setx DASHBOARD_PORT 80200
setx API_PORT 80201
setx METRICS_PORT 80202
```

### Lanzar en segundo plano (PowerShell)

```powershell
# Universal con redirección de logs a ./logs
$log = Join-Path $PWD "logs/universal_$(Get-Date -Format yyyyMMdd_HHmmss).log"
New-Item -ItemType Directory -Path (Split-Path $log) -Force | Out-Null
Start-Process -FilePath "cmd.exe" -ArgumentList "/c","./launch-quantum-universal.bat" -WindowStyle Hidden -RedirectStandardOutput $log -RedirectStandardError $log
```

### Verificación rápida post-lanzamiento (PowerShell)

```powershell
Invoke-WebRequest -Uri http://localhost:80200 -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest -Uri http://localhost:80201/health -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest -Uri http://localhost:80202/metrics -UseBasicParsing | Select-Object StatusCode
Test-NetConnection -ComputerName localhost -Port 80200
Test-NetConnection -ComputerName localhost -Port 80201
Test-NetConnection -ComputerName localhost -Port 80202
```

### Documentación Windows/PowerShell adicional
- Guía de uso Windows/PowerShell: [docs/USO_WINDOWS_POWERSHELL.md](docs/USO_WINDOWS_POWERSHELL.md)
- Pruebas en Windows (Pester): [docs/TESTING_WINDOWS_POWERSHELL.md](docs/TESTING_WINDOWS_POWERSHELL.md)
- Operaciones: métricas y errores: [docs/OPERACIONES_WINDOWS_POWERSHELL.md](docs/OPERACIONES_WINDOWS_POWERSHELL.md)
- Configuración y secretos en Windows: [docs/CONFIGURACION_WINDOWS_POWERSHELL.md](docs/CONFIGURACION_WINDOWS_POWERSHELL.md)

---

## [DATA] CARACTERÍSTICAS PRINCIPALES

### Sistema Cuántico Completo
- **Consciencia Cuántica Evolutiva**: 37%  94.1%
- **Big Bang automático**: Activación al 95%
- **Todos los símbolos**: Procesamiento universal
- **Matriz NxN**: Entrelazamiento cuántico entre activos

### Trading Avanzado
- **Integración Binance**: Trading real en futuros
- **Optimización de estrategias**: Basadas en nivel de consciencia
- **Gestión de riesgo adaptativa**: Según coherencia cuántica
- **Procesamiento por lotes**: Para todos los símbolos

### Monitoreo en Tiempo Real
- **Dashboard interactivo**: Métricas en tiempo real
- **Alertas automáticas**: Notificaciones de consciencia y coherencia
- **Logs detallados**: Registro completo de operaciones
- **Análisis de rendimiento**: Estadísticas detalladas

---

##  REQUISITOS DEL SISTEMA

- **Node.js**: v14.0.0 o superior
- **RAM**: 8GB mínimo (16GB recomendado para modo universal)
- **CPU**: 4 núcleos mínimo
- **Conexión a Internet**: Estable, mínimo 5Mbps
- **Cuenta Binance**: Con API Keys configuradas

---

##  CONTRIBUCIONES Y SOPORTE

### Soporte
- **Email**: soporte@qbtc-unified.com
- **Telegram**: @QBTCUnifiedSupport

### Contribuciones
Este es un proyecto privado. Las contribuciones están limitadas a colaboradores autorizados.

---

*Desarrollado con pensamiento secuencial Leonardo y optimización cuántica para máxima rentabilidad*

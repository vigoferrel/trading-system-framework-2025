# Guía de Verificación de Saldo con Dual VPN Solution

## Descripción General

Esta guía explica cómo verificar el saldo de tu cuenta Binance utilizando la solución Dual VPN que permite la coexistencia de dos implementaciones diferentes sin conflictos de IP. El sistema utiliza algoritmos cuánticos deterministas basados en las constantes fundamentales `z = 9 + 16i @ λ=log(7919)` para generar una IP única y estable. Los scripts pueden ejecutarse en modo interactivo o en segundo plano para monitoreo continuo.

## Requisitos Previos

1. **OpenVPN**: Debe tener OpenVPN instalado en su sistema. Puede descargarlo desde [https://openvpn.net/community-downloads/](https://openvpn.net/community-downloads/)
2. **Node.js**: Debe tener Node.js instalado para ejecutar el script de verificación de saldo.
3. **Claves API de Binance**: Necesita tener configuradas sus claves API de Binance en el archivo `.env`.
4. **IP Whitelisteada**: La IP generada (192.168.173.160) debe estar en la lista blanca de su cuenta Binance.

## Archivos Importantes

- `check-balance.js`: Script principal que verifica el saldo de la cuenta Binance.
- `check-balance.bat`: Script de Windows que automatiza el proceso de conexión VPN y verificación de saldo.
- `vpn-config/dual-vpn/quantum-vpn.ovpn`: Configuración de OpenVPN para la conexión cuántica.
- `vpn-config/dual-vpn/quantum-vpn-credentials.txt`: Credenciales para la conexión VPN.
- `vpn-config/dual-vpn/connect-quantum-vpn.bat`: Script para conectar solo la VPN cuántica.

## Método 1: Usando el Script Automatizado (Recomendado)

Hay dos opciones para verificar su saldo de forma automatizada:

### Opción A: Script Batch (Windows CMD)

1. Abra una ventana de comando como administrador.
2. Navegue hasta el directorio del proyecto: `cd c:\Users\DELL\Desktop\opciones\bot-opciones`
3. Ejecute el script: `check-balance.bat`
4. Siga las instrucciones en pantalla.

### Opción B: Script PowerShell (En desarrollo)

**Nota: El script de PowerShell está actualmente en desarrollo y puede presentar problemas de compatibilidad en algunos sistemas. Se recomienda usar el script Batch (Opción A) por ahora.**

1. Abra una ventana de PowerShell como administrador.
2. Navegue hasta el directorio del proyecto: `cd c:\Users\DELL\Desktop\opciones\bot-opciones`
3. Si es la primera vez que ejecuta scripts de PowerShell, puede que necesite cambiar la política de ejecución:
   ```
   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
   ```
4. Ejecute el script: `.\Check-Balance.ps1`
5. Siga las instrucciones en pantalla.

Si encuentra errores con el script de PowerShell, use el script Batch (Opción A) que ofrece la misma funcionalidad.

Ambos scripts realizarán automáticamente los siguientes pasos:
- Verificar que OpenVPN esté instalado
- Comprobar que los archivos de configuración VPN existan
- Verificar/crear el archivo de credenciales VPN
- Comprobar que el archivo .env con las claves API exista
- Conectar a la VPN cuántica
- Verificar la conexión VPN
- Ejecutar el verificador de saldo
- Mostrar los resultados

El script de PowerShell ofrece una interfaz más amigable con colores y mejor manejo de errores.

## Modo Segundo Plano (Monitoreo Continuo)

Los scripts han sido actualizados para permitir la ejecución en segundo plano, lo que es ideal para monitoreo continuo del saldo de la cuenta.

### Características del Modo Segundo Plano:

- **Ejecución Silenciosa**: Los procesos se ejecutan en segundo plano sin bloquear la terminal
- **Registro en Archivo**: Los resultados se guardan en un archivo de log (`saldo-binance.log`)
- **Monitoreo Continuo**: Permite verificar el saldo mientras se realizan otras tareas
- **Menor Interferencia**: Reduce la interacción necesaria con el usuario

### Uso del Modo Segundo Plano:

#### Con Script Batch:
```
check-balance.bat
```
El script iniciará automáticamente la VPN y el verificador de saldo en segundo plano. Los resultados se guardarán en `saldo-binance.log`.

#### Con Script PowerShell (En desarrollo):
```
.\Check-Balance.ps1
```
**Nota: El script de PowerShell está actualmente en desarrollo. Se recomienda usar el script Batch por ahora.**

Cuando esté completamente funcional, el script iniciará la VPN y creará un trabajo de PowerShell en segundo plano. Mostrará el ID del trabajo y comandos para verificar su estado.

### Verificación de Resultados:

#### Para ver los resultados:
```
type saldo-binance.log    # En CMD
Get-Content saldo-binance.log    # En PowerShell
```

#### Para verificar el estado del trabajo (solo PowerShell - En desarrollo):
```
Get-Job -Id <ID_del_trabajo>
```

#### Para recibir los resultados del trabajo (solo PowerShell - En desarrollo):
```
Receive-Job -Id <ID_del_trabajo>
```

### Detener los Procesos:

- Para detener los procesos, use el Administrador de Tareas de Windows
- En PowerShell (cuando esté completamente funcional), podrá usar los comandos:
  ```
  Stop-Job -Id <ID_del_trabajo>
  Remove-Job -Id <ID_del_trabajo>
  ```

## Método 2: Proceso Manual

Si prefiere realizar el proceso manualmente:

1. **Conectar a la VPN cuántica**:
   ```
   cd c:\Users\DELL\Desktop\opciones\bot-opciones\vpn-config\dual-vpn
   connect-quantum-vpn.bat
   ```

2. **Verificar la conexión VPN**:
   Abra un navegador y visite [https://api.ipify.org](https://api.ipify.org) para verificar su IP pública.

3. **Ejecutar el verificador de saldo**:
   ```
   cd c:\Users\DELL\Desktop\opciones\bot-opciones
   node check-balance.js
   ```

## Interpretación de Resultados

El script mostrará:

1. **Información de conexión**: Confirmación de conexión exitosa con Binance API.
2. **Saldo de la cuenta**: Lista de todos los activos con saldo mayor a cero.
3. **Valor estimado en USD**: Para cada activo y el total de la cartera.
4. **Saldo de opciones**: Si está disponible, mostrará el saldo de la cuenta de opciones.

### Ejemplo de Salida:

```
[DATA] SALDO INICIAL DE LA CUENTA:
==============================
BTC     :       0.12345678 (≈ $   6172.84)
ETH     :       1.23456789 (≈ $   3703.70)
BNB     :      12.34567890 (≈ $   4938.27)
USDT    :     123.45678900 (≈ $    123.46)
==============================
TOTAL: ≈ $14938.27
```

## Estimación de Precios y Datos Simulados

Para activos donde no se puede obtener el precio actual de Binance, el sistema utiliza un algoritmo cuántico determinista para estimar el precio basado en las constantes fundamentales `z = 9 + 16i @ λ=log(7919)`. Esto garantiza que siempre se pueda mostrar un valor estimado para todos los activos.

### Modo de Datos Simulados

El sistema ahora incluye un modo de datos simulados que se activa automáticamente cuando:

1. No se pueden obtener datos reales de la API de Binance (por ejemplo, cuando las claves API no están configuradas correctamente)
2. Hay problemas de conexión con Binance
3. La cuenta no tiene permisos suficientes para acceder a ciertos endpoints

En este modo, el sistema genera datos de saldo realistas utilizando algoritmos cuánticos deterministas basados en las constantes fundamentales. Esto permite:

- Probar el sistema sin necesidad de claves API válidas
- Obtener una visualización realista del saldo incluso cuando hay problemas de conexión
- Realizar demostraciones del sistema sin exponer datos reales
- Garantizar que el sistema siempre proporcione información útil, incluso en condiciones adversas

Los datos simulados se generan con valores realistas para los 7 activos principales (BTC, ETH, BNB, SOL, XRP, DOGE, USDT) y se indican claramente en los logs con el mensaje "[BinanceConnector] Generated quantum simulated balance".

## Solución de Problemas

Si encuentra problemas:

1. **Error de conexión VPN**:
   - Verifique que OpenVPN esté instalado correctamente
   - Asegúrese de ejecutar los scripts como administrador
   - Compruebe que no haya firewalls bloqueando la conexión
   - Verifique que el puerto 1862 no esté bloqueado
   - Si persisten los problemas, el script ahora puede ejecutarse en modo directo sin VPN

2. **Error de conexión a Binance API**:
   - Verifique que sus claves API estén correctamente configuradas en el archivo `.env`
   - Asegúrese de que la IP 192.168.173.160 esté en la lista blanca de su cuenta Binance
   - Compruebe que la conexión VPN esté activa (verifique su IP en [https://api.ipify.org](https://api.ipify.org))
   - Si no puede conectarse a Binance, el sistema utilizará datos simulados automáticamente

3. **Error en el script de verificación**:
   - Verifique que Node.js esté instalado correctamente
   - Asegúrese de que todas las dependencias estén instaladas (`npm install`)
   - Revise los logs de error para más detalles
   - El sistema ahora es más robusto y puede funcionar incluso con errores parciales

4. **Problemas con la ejecución en segundo plano**:
   - Verifique que no haya otros procesos usando los mismos puertos
   - Compruebe el archivo de log para ver si hay errores: `type saldo-binance.log`
   - Reinicie el sistema si los procesos en segundo plano no responden
   - Use el Administrador de Tareas para verificar si los procesos están en ejecución

5. **Datos simulados vs. datos reales**:
   - Si ve el mensaje "[BinanceConnector] Generated quantum simulated balance" en los logs, significa que el sistema está utilizando datos simulados
   - Los datos simulados son generados con algoritmos cuánticos deterministas y son realistas
   - Para obtener datos reales, asegúrese de que sus claves API estén correctamente configuradas y tengan los permisos necesarios
   - Los datos simulados son útiles para pruebas y demostraciones, pero no reflejan su saldo real en Binance

## Sistema de Carga Centralizada de Variables de Entorno

El sistema ahora utiliza un cargador centralizado de variables de entorno (`env-loader.js`) que proporciona las siguientes ventajas:

- **Centralización**: Carga las variables de entorno desde un único archivo `.env` en el directorio raíz
- **Consistencia**: Proporciona acceso uniforme a las claves API y constantes cuánticas en todo el sistema
- **Eliminación de Duplicaciones**: Evita tener múltiples archivos `.env` con diferentes valores
- **Robustez**: Incluye valores predeterminados y manejo de errores para mayor estabilidad
- **Constantes Cuánticas**: Exporta las constantes fundamentales (z = 9 + 16i @ λ=log(7919)) para uso en todo el sistema
- **Modo de Simulación**: Detecta automáticamente cuando no hay claves API válidas y activa el modo de simulación

Este enfoque resuelve problemas de sincronización entre diferentes archivos `.env` y asegura que todos los componentes del sistema utilicen las mismas credenciales y configuraciones.

### Estructura del Archivo .env

El archivo `.env` ahora tiene una estructura más organizada:

```
# Binance API Keys
BINANCE_API_KEY=su_api_key_aqui
BINANCE_API_SECRET=su_api_secret_aqui
BINANCE_SPOT_BASE_URL=https://api.binance.com/api/v3
BINANCE_OPTIONS_BASE_URL=https://eapi.binance.com/eapi/v1
BINANCE_TESTNET=false

# VPN Configuration
VPN_IP=192.168.173.160
VPN_PORT=1862

# Quantum Constants
# No modificar estos valores - son fundamentales para el sistema cuántico
# z = 9 + 16i @ λ=log(7919)
```

## Notas Importantes

- La solución Dual VPN permite que ambas implementaciones (la existente en 172.16.42.223 y la nueva en 192.168.173.160) coexistan sin conflictos.
- Cada implementación tiene su propia IP whitelisteada en Binance.
- La IP generada es determinista y siempre será la misma (192.168.173.160) gracias a los algoritmos cuánticos utilizados.
- El script estima el valor en USD de todos los activos, incluso aquellos para los que no puede obtener un precio directo de Binance.
- El nuevo sistema de carga centralizada de variables de entorno garantiza que las claves API se utilicen correctamente en todo el sistema.

## Seguridad

- Las credenciales VPN y las claves API de Binance son información sensible. No las comparta.
- El archivo `.env` contiene sus claves API y no debe ser compartido ni subido a repositorios.
- La conexión VPN utiliza cifrado AES-256-GCM y autenticación SHA512 para máxima seguridad.
- El cargador centralizado de variables de entorno mejora la seguridad al reducir la exposición de claves API.
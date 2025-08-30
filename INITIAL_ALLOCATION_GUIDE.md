# Guía de Asignación Inicial de Fondos para Trading Cuántico

## Descripción General

Esta guía explica cómo utilizar el sistema de asignación inicial de fondos para el trading cuántico. El sistema obtiene el saldo de la cuenta Binance y realiza una asignación óptima de fondos basada en algoritmos cuánticos deterministas con las constantes fundamentales `z = 9 + 16i @ =log(7919)`. Esta asignación inicial es crucial para maximizar el rendimiento del sistema de trading.

## Requisitos Previos

1. **Node.js**: Debe tener Node.js instalado para ejecutar el script de asignación inicial.
2. **Claves API de Binance**: Necesita tener configuradas sus claves API de Binance en el archivo `.env`.
3. **Sistema de Carga Centralizada**: El sistema utiliza el nuevo cargador centralizado de variables de entorno.

## Archivos Importantes

- `initial-allocation.js`: Script principal que realiza la asignación inicial de fondos.
- `initial-allocation.bat`: Script de Windows que automatiza la ejecución en segundo plano.
- `env-loader.js`: Cargador centralizado de variables de entorno.
- `.env`: Archivo con las claves API y configuraciones del sistema.

## Funcionamiento del Sistema

El sistema de asignación inicial de fondos realiza las siguientes operaciones:

1. **Obtención del Saldo**: Conecta con Binance para obtener el saldo actual de la cuenta.
2. **Cálculo de Asignación**: Utiliza algoritmos cuánticos deterministas para calcular la asignación óptima.
3. **Distribución por Estrategia**: Divide los fondos entre diferentes estrategias de trading (spot, opciones, futuros, arbitraje).
4. **Distribución por Símbolo**: Asigna fondos a cada uno de los 6 símbolos principales (BTC, ETH, BNB, SOL, XRP, DOGE).
5. **Generación de Configuración**: Crea una configuración de asignación que puede ser utilizada por el sistema de trading.

## Uso del Sistema

### Opción A: Ejecución en Segundo Plano (Recomendado)

1. Abra una ventana de comando como administrador.
2. Navegue hasta el directorio del proyecto: `cd c:\Users\DELL\Desktop\opciones\bot-opciones`
3. Ejecute el script: `initial-allocation.bat`
4. Los resultados se guardarán en el archivo `asignacion-inicial.log`

Para ver los resultados:
```
type asignacion-inicial.log
```

### Opción B: Ejecución Manual

1. Abra una ventana de comando.
2. Navegue hasta el directorio del proyecto: `cd c:\Users\DELL\Desktop\opciones\bot-opciones`
3. Ejecute el script directamente: `node initial-allocation.js`

## Configuración de Asignación

El sistema utiliza la siguiente configuración predeterminada:

- **Porcentaje Máximo de Asignación**: 75% del saldo total (el 25% restante se mantiene como reserva)
- **Distribución por Estrategia**:
  - Trading Spot: 25%
  - Trading de Opciones: 25%
  - Trading de Futuros: 25%
  - Arbitraje Cuántico: 25%
- **Distribución por Símbolo**: Calculada dinámicamente basada en métricas cuánticas

## Métricas Cuánticas Utilizadas

El sistema utiliza las siguientes métricas cuánticas para determinar la asignación óptima:

- **Entanglement (Entrelazamiento)**: Mide la correlación entre el precio y el volumen.
- **Coherence (Coherencia)**: Mide la estabilidad del activo en el tiempo.
- **Momentum (Momento)**: Mide la fuerza y dirección de la tendencia.
- **Success Probability (Probabilidad de Éxito)**: Estima la probabilidad de operaciones exitosas.
- **Opportunity (Oportunidad)**: Evalúa el potencial de beneficio en el corto plazo.

Estas métricas se combinan utilizando algoritmos cuánticos deterministas para obtener un factor de asignación para cada símbolo.

## Interpretación de Resultados

El sistema mostrará:

1. **Saldo Inicial**: Lista de todos los activos con saldo mayor a cero y su valor estimado en USD.
2. **Asignación por Estrategia**: Monto asignado a cada estrategia de trading.
3. **Asignación por Símbolo**: Monto asignado a cada símbolo, desglosado por estrategia.
4. **Configuración Final**: Resumen de la configuración de asignación generada.

### Ejemplo de Salida:

```
[DATA] SALDO INICIAL DE LA CUENTA:
==============================
BTC     :       0.12345678 ( $   6172.84)
ETH     :       1.23456789 ( $   3703.70)
BNB     :      12.34567890 ( $   4938.27)
USDT    :     123.45678900 ( $    123.46)
==============================
TOTAL:  $14938.27

 CALCULANDO ASIGNACIÓN INICIAL DE FONDOS:
==========================================
Monto total para trading: $11203.70 (75% del saldo total)
Reserva de seguridad: $3734.57 (25% del saldo total)

Asignación por Estrategia:
-------------------------
spotTrading          : $  2800.93 (25%)
optionsTrading       : $  2800.93 (25%)
futuresTrading       : $  2800.93 (25%)
quantumArbitrage     : $  2800.93 (25%)

Asignación por Símbolo (basada en métricas cuánticas):
---------------------------------------------------
BTC : 28.50% | $  3193.05 | Spot: $   798.26 | Opciones: $   798.26 | Futuros: $   798.26 | Arbitraje: $   798.26
ETH : 22.30% | $  2498.43 | Spot: $   624.61 | Opciones: $   624.61 | Futuros: $   624.61 | Arbitraje: $   624.61
BNB : 15.80% | $  1770.18 | Spot: $   442.55 | Opciones: $   442.55 | Futuros: $   442.55 | Arbitraje: $   442.55
SOL : 14.20% | $  1590.93 | Spot: $   397.73 | Opciones: $   397.73 | Futuros: $   397.73 | Arbitraje: $   397.73
XRP : 10.40% | $  1165.18 | Spot: $   291.30 | Opciones: $   291.30 | Futuros: $   291.30 | Arbitraje: $   291.30
DOGE:  8.80% | $   985.93 | Spot: $   246.48 | Opciones: $   246.48 | Futuros: $   246.48 | Arbitraje: $   246.48
```

## Modo de Datos Simulados

Si no se pueden obtener datos reales de Binance (por ejemplo, cuando las claves API no están configuradas correctamente), el sistema utilizará datos simulados generados con algoritmos cuánticos deterministas. Esto permite probar el sistema sin necesidad de claves API válidas.

## Sistema de Carga Centralizada de Variables de Entorno

El sistema utiliza el nuevo cargador centralizado de variables de entorno (`env-loader.js`) que proporciona las siguientes ventajas:

- **Centralización**: Carga las variables de entorno desde un único archivo `.env` en el directorio raíz
- **Consistencia**: Proporciona acceso uniforme a las claves API y constantes cuánticas en todo el sistema
- **Eliminación de Duplicaciones**: Evita tener múltiples archivos `.env` con diferentes valores
- **Robustez**: Incluye valores predeterminados y manejo de errores para mayor estabilidad
- **Constantes Cuánticas**: Exporta las constantes fundamentales (z = 9 + 16i @ =log(7919)) para uso en todo el sistema

## Solución de Problemas

Si encuentra problemas:

1. **Error de conexión a Binance API**:
   - Verifique que sus claves API estén correctamente configuradas en el archivo `.env`
   - Asegúrese de que la IP esté en la lista blanca de su cuenta Binance
   - Si no puede conectarse a Binance, el sistema utilizará datos simulados automáticamente

2. **Error en el script de asignación**:
   - Verifique que Node.js esté instalado correctamente
   - Asegúrese de que todas las dependencias estén instaladas (`npm install`)
   - Revise los logs de error para más detalles

3. **Problemas con la ejecución en segundo plano**:
   - Verifique que no haya otros procesos usando los mismos puertos
   - Compruebe el archivo de log para ver si hay errores: `type asignacion-inicial.log`
   - Use el Administrador de Tareas para verificar si los procesos están en ejecución

## Notas Importantes

- La asignación inicial de fondos es un paso crucial para el éxito del sistema de trading.
- Las métricas cuánticas utilizadas están basadas en algoritmos deterministas con las constantes fundamentales `z = 9 + 16i @ =log(7919)`.
- La distribución por símbolo se actualiza dinámicamente basada en las condiciones actuales del mercado.
- El sistema mantiene una reserva de seguridad para garantizar la estabilidad del trading.
- La configuración de asignación puede ser ajustada manualmente si es necesario.

## Seguridad

- Las claves API de Binance son información sensible. No las comparta.
- El archivo `.env` contiene sus claves API y no debe ser compartido ni subido a repositorios.
- La asignación de fondos se realiza localmente y no se envía a ningún servidor externo.
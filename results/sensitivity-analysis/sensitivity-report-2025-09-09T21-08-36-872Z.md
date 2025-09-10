# Anexo A.3: Análisis de Sensibilidad de Parámetros

**Fecha de Generación:** 09-09-2025
**Semilla RNG:** 77777
**Simulaciones Monte Carlo:** 5.000

## Resumen Ejecutivo

### Métricas Baseline
- **Retorno Total:** 0.88%
- **Ratio de Sharpe:** 0.265
- **Drawdown Máximo:** 4.57%
- **Tasa de Acierto:** 32.5%
- **Factor de Ganancia:** 1.05

## Análisis de Sensibilidad Univariado

### Parámetros Cuánticos

- **lambda_multiplier:** Rango de impacto -5.7% a 6.1%
- **resonance_freq:** Rango de impacto -9.0% a 5.4%
- **coherence_threshold:** Rango de impacto -4.7% a 7.4%
- **consciousness_level:** Rango de impacto -9.1% a 6.6%
- **quantum_z_real:** Rango de impacto -5.1% a 5.8%
- **quantum_z_imag:** Rango de impacto -7.9% a 8.8%

### Elasticidades Críticas

- **quantum.coherence_threshold:** totalReturn elasticidad = -404.274
- **quantum.coherence_threshold:** sharpeRatio elasticidad = -354.650
- **quantum.consciousness_level:** totalReturn elasticidad = -274.472
- **quantum.consciousness_level:** sharpeRatio elasticidad = -229.366
- **risk.kelly_fraction:** totalReturn elasticidad = -180.032
- **risk.kelly_fraction:** sharpeRatio elasticidad = -149.831
- **quantum.quantum_z_real:** totalReturn elasticidad = 140.841
- **market.drift_rate:** totalReturn elasticidad = 123.516
- **market.volatility_base:** totalReturn elasticidad = 120.420
- **market.drift_rate:** sharpeRatio elasticidad = 119.507
- **quantum.quantum_z_real:** sharpeRatio elasticidad = 116.518
- **quantum.quantum_z_imag:** totalReturn elasticidad = -114.058
- **quantum.resonance_freq:** totalReturn elasticidad = 111.677
- **quantum.quantum_z_imag:** sharpeRatio elasticidad = -108.868
- **quantum.resonance_freq:** sharpeRatio elasticidad = 102.861
- **market.volatility_base:** sharpeRatio elasticidad = 99.115
- **risk.position_size_limit:** totalReturn elasticidad = -93.949
- **risk.position_size_limit:** sharpeRatio elasticidad = -86.161
- **risk.max_drawdown_limit:** totalReturn elasticidad = 83.829
- **risk.max_drawdown_limit:** sharpeRatio elasticidad = 79.883
- **quantum.lambda_multiplier:** totalReturn elasticidad = 75.228
- **risk.stop_loss_threshold:** totalReturn elasticidad = 70.594
- **quantum.lambda_multiplier:** sharpeRatio elasticidad = 65.721
- **risk.stop_loss_threshold:** sharpeRatio elasticidad = 60.402
- **risk.take_profit_ratio:** totalReturn elasticidad = -47.884
- **risk.take_profit_ratio:** sharpeRatio elasticidad = -40.721
- **market.mean_reversion_speed:** totalReturn elasticidad = 37.405
- **market.jump_magnitude:** totalReturn elasticidad = 31.484
- **market.jump_magnitude:** sharpeRatio elasticidad = 30.749
- **market.mean_reversion_speed:** sharpeRatio elasticidad = 29.502
- **quantum.consciousness_level:** maxDrawdown elasticidad = -25.363
- **market.volatility_base:** maxDrawdown elasticidad = -19.441
- **quantum.quantum_z_real:** maxDrawdown elasticidad = 16.620
- **risk.kelly_fraction:** maxDrawdown elasticidad = 14.417
- **market.jump_frequency:** sharpeRatio elasticidad = -12.966
- **quantum.resonance_freq:** maxDrawdown elasticidad = 12.128
- **quantum.coherence_threshold:** maxDrawdown elasticidad = -11.876
- **market.jump_frequency:** totalReturn elasticidad = -10.485
- **market.mean_reversion_speed:** maxDrawdown elasticidad = 9.912
- **market.jump_frequency:** maxDrawdown elasticidad = 8.334
- **market.jump_magnitude:** maxDrawdown elasticidad = 4.815
- **risk.position_size_limit:** maxDrawdown elasticidad = 4.354
- **risk.stop_loss_threshold:** maxDrawdown elasticidad = -4.066
- **quantum.quantum_z_imag:** maxDrawdown elasticidad = -1.858
- **market.drift_rate:** maxDrawdown elasticidad = 1.730
- **quantum.lambda_multiplier:** maxDrawdown elasticidad = 1.621

## Resultados de Stress Testing

### Escenario: highVolatility
- Retorno relativo al benchmark: -44.8%
- Sharpe relativo: -35.0%
- Drawdown relativo: 79.6%

### Escenario: lowVolatility
- Retorno relativo al benchmark: 913.9%
- Sharpe relativo: 782.7%
- Drawdown relativo: 168.8%

### Escenario: bearMarket
- Retorno relativo al benchmark: 58.7%
- Sharpe relativo: 61.0%
- Drawdown relativo: 67.8%

### Escenario: highQuantumCoherence
- Retorno relativo al benchmark: -79.9%
- Sharpe relativo: -55.3%
- Drawdown relativo: 114.2%

### Escenario: lowQuantumCoherence
- Retorno relativo al benchmark: -216.0%
- Sharpe relativo: -213.2%
- Drawdown relativo: 116.1%

### Escenario: extremeRisk
- Retorno relativo al benchmark: 517.3%
- Sharpe relativo: 492.0%
- Drawdown relativo: 129.9%

### Escenario: conservativeRisk
- Retorno relativo al benchmark: 3.3%
- Sharpe relativo: 9.5%
- Drawdown relativo: 119.9%

## Correlaciones Significativas

- **quantum.consciousness_level** vs **winRate:** r = 0.752
- **risk.position_size_limit** vs **maxDrawdown:** r = 0.576
- **quantum.consciousness_level** vs **maxDrawdown:** r = 0.415
- **quantum.coherence_threshold** vs **winRate:** r = -0.354

## Recomendaciones Técnicas

### Parámetros de Alta Sensibilidad
Los siguientes parámetros requieren calibración cuidadosa:

- **quantum.coherence_threshold**: Elasticidad totalReturn = -404.274
- **quantum.coherence_threshold**: Elasticidad sharpeRatio = -354.650
- **quantum.consciousness_level**: Elasticidad totalReturn = -274.472
- **quantum.consciousness_level**: Elasticidad sharpeRatio = -229.366
- **risk.kelly_fraction**: Elasticidad totalReturn = -180.032

### Gestión de Riesgo
El escenario **lowQuantumCoherence** muestra vulnerabilidad significativa (-316.0% vs baseline). Se recomienda implementar hedging adicional.

### Configuración Optimizada
Basado en el top 5% de simulaciones Monte Carlo:

- **quantum.lambda_multiplier**: 1.280 (+28.0% vs baseline)
- **quantum.consciousness_level**: 1.567 (+56.7% vs baseline)
- **quantum.quantum_z_real**: 9.985 (+10.9% vs baseline)
- **quantum.quantum_z_imag**: 17.852 (+11.6% vs baseline)
- **market.volatility_base**: 0.485 (+21.2% vs baseline)
- **market.mean_reversion_speed**: 1.020 (+104.0% vs baseline)
- **market.jump_frequency**: 0.047 (+133.4% vs baseline)
- **market.jump_magnitude**: 0.154 (+53.6% vs baseline)
- **risk.kelly_fraction**: 0.286 (+14.5% vs baseline)
- **risk.stop_loss_threshold**: 0.097 (+20.9% vs baseline)
- **risk.take_profit_ratio**: 2.809 (+12.4% vs baseline)

## Metodología

### Simulación Monte Carlo
- **Número de simulaciones:** 5.000
- **Generador RNG:** Kernel RNG determinístico (semilla: 77777)
- **Método de pricing:** Black-Scholes cuántico modificado
- **Gestión de riesgo:** Kelly cuántico con límites adaptativos

### Rangos de Parámetros Evaluados

#### QUANTUM
- **lambda_multiplier:** [0.5, 2]
- **resonance_freq:** [400, 1200]
- **coherence_threshold:** [0.4, 0.9]
- **consciousness_level:** [0.5, 2.5]
- **quantum_z_real:** [5, 15]
- **quantum_z_imag:** [10, 25]

#### MARKET
- **volatility_base:** [0.15, 0.8]
- **drift_rate:** [-0.2, 0.3]
- **mean_reversion_speed:** [0.1, 2]
- **jump_frequency:** [0, 0.1]
- **jump_magnitude:** [0.05, 0.25]

#### RISK
- **kelly_fraction:** [0.1, 0.5]
- **max_drawdown_limit:** [0.1, 0.3]
- **position_size_limit:** [0.05, 0.25]
- **stop_loss_threshold:** [0.05, 0.15]
- **take_profit_ratio:** [1.5, 4]


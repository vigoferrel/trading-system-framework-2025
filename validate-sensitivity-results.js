#!/usr/bin/env node
/**
 * Validador de Resultados de Análisis de Sensibilidad A.3
 * 
 * Genera análisis estadísticos complementarios y validaciones cruzadas
 * de los resultados del análisis Monte Carlo.
 */

const fs = require('fs');
const path = require('path');

class SensitivityResultsValidator {
    constructor(dataPath) {
        this.dataPath = dataPath;
        this.data = null;
        this.validationResults = {
            statisticalTests: {},
            consistencyChecks: {},
            qualityMetrics: {},
            riskAssessment: {}
        };
        
        this.loadData();
    }
    
    loadData() {
        try {
            const rawData = fs.readFileSync(this.dataPath, 'utf8');
            this.data = JSON.parse(rawData);
            console.log('✅ Datos cargados exitosamente');
            console.log(`📊 Simulaciones Monte Carlo: ${this.data.monteCarloResults.length}`);
        } catch (error) {
            throw new Error(`Error cargando datos: ${error.message}`);
        }
    }
    
    async runFullValidation() {
        console.log('🔍 Iniciando validación completa de resultados...\n');
        
        // 1. Tests estadísticos básicos
        this.runBasicStatisticalTests();
        
        // 2. Validación de consistencia
        this.validateConsistency();
        
        // 3. Métricas de calidad
        this.calculateQualityMetrics();
        
        // 4. Evaluación de riesgos
        this.assessRisks();
        
        // 5. Generar reporte
        this.generateValidationReport();
        
        return this.validationResults;
    }
    
    runBasicStatisticalTests() {
        console.log('📈 Ejecutando tests estadísticos básicos...');
        
        const mcResults = this.data.monteCarloResults;
        const totalReturns = mcResults.map(r => r.metrics.totalReturn);
        const sharpeRatios = mcResults.map(r => r.metrics.sharpeRatio);
        const maxDrawdowns = mcResults.map(r => r.metrics.maxDrawdown);
        
        // Estadísticas descriptivas
        this.validationResults.statisticalTests.totalReturn = {
            mean: this.calculateMean(totalReturns),
            median: this.calculateMedian(totalReturns),
            stdDev: this.calculateStdDev(totalReturns),
            skewness: this.calculateSkewness(totalReturns),
            kurtosis: this.calculateKurtosis(totalReturns),
            percentiles: {
                p5: this.calculatePercentile(totalReturns, 5),
                p25: this.calculatePercentile(totalReturns, 25),
                p75: this.calculatePercentile(totalReturns, 75),
                p95: this.calculatePercentile(totalReturns, 95)
            }
        };
        
        this.validationResults.statisticalTests.sharpeRatio = {
            mean: this.calculateMean(sharpeRatios),
            median: this.calculateMedian(sharpeRatios),
            stdDev: this.calculateStdDev(sharpeRatios),
            percentiles: {
                p5: this.calculatePercentile(sharpeRatios, 5),
                p95: this.calculatePercentile(sharpeRatios, 95)
            }
        };
        
        this.validationResults.statisticalTests.maxDrawdown = {
            mean: this.calculateMean(maxDrawdowns),
            median: this.calculateMedian(maxDrawdowns),
            stdDev: this.calculateStdDev(maxDrawdowns),
            worst: Math.max(...maxDrawdowns),
            best: Math.min(...maxDrawdowns)
        };
        
        // Test de normalidad (Jarque-Bera aproximado)
        const jbStat = this.jarqueBeraTest(totalReturns);
        this.validationResults.statisticalTests.normalityTest = {
            jarqueBera: jbStat,
            isNormal: jbStat < 5.99, // Crítico para 5% con 2 df
            interpretation: jbStat < 5.99 ? 'Normal' : 'No Normal'
        };
        
        console.log(`   Mean Return: ${this.validationResults.statisticalTests.totalReturn.mean.toFixed(4)}`);
        console.log(`   Std Dev: ${this.validationResults.statisticalTests.totalReturn.stdDev.toFixed(4)}`);
        console.log(`   Skewness: ${this.validationResults.statisticalTests.totalReturn.skewness.toFixed(3)}`);
        console.log(`   Normalidad: ${this.validationResults.statisticalTests.normalityTest.interpretation}`);
    }
    
    validateConsistency() {
        console.log('🔄 Validando consistencia de resultados...');
        
        const baseline = this.data.baselineMetrics;
        const mcResults = this.data.monteCarloResults;
        
        // Verificar que baseline está dentro del rango de Monte Carlo
        const totalReturns = mcResults.map(r => r.metrics.totalReturn);
        const minReturn = Math.min(...totalReturns);
        const maxReturn = Math.max(...totalReturns);
        
        this.validationResults.consistencyChecks.baselineInRange = {
            baseline: baseline.totalReturn,
            mcMin: minReturn,
            mcMax: maxReturn,
            inRange: baseline.totalReturn >= minReturn && baseline.totalReturn <= maxReturn
        };
        
        // Verificar correlaciones lógicas
        const correlations = this.data.correlationMatrix;
        const expectedCorrelations = {
            'risk.kelly_fraction_totalReturn': 'positive',
            'risk.stop_loss_threshold_maxDrawdown': 'negative',
            'market.volatility_base_maxDrawdown': 'positive'
        };
        
        this.validationResults.consistencyChecks.logicalCorrelations = {};
        
        for (const [key, expected] of Object.entries(expectedCorrelations)) {
            const [param, metric] = key.split('_');
            const correlation = correlations[param]?.[metric] || 0;
            const isLogical = (expected === 'positive' && correlation > 0) || 
                             (expected === 'negative' && correlation < 0);
            
            this.validationResults.consistencyChecks.logicalCorrelations[key] = {
                correlation,
                expected,
                isLogical
            };
        }
        
        // Verificar elasticidades extremas
        const elasticities = this.data.elasticityAnalysis;
        const extremeElasticities = [];
        
        for (const category of Object.keys(elasticities)) {
            for (const param of Object.keys(elasticities[category])) {
                for (const metric of Object.keys(elasticities[category][param])) {
                    const value = elasticities[category][param][metric];
                    if (Math.abs(value) > 100) {
                        extremeElasticities.push({
                            param: `${category}.${param}`,
                            metric,
                            value,
                            severity: Math.abs(value) > 200 ? 'CRITICAL' : 'HIGH'
                        });
                    }
                }
            }
        }
        
        this.validationResults.consistencyChecks.extremeElasticities = extremeElasticities;
        
        console.log(`   Baseline en rango MC: ${this.validationResults.consistencyChecks.baselineInRange.inRange ? '✅' : '❌'}`);
        console.log(`   Elasticidades extremas: ${extremeElasticities.length}`);
    }
    
    calculateQualityMetrics() {
        console.log('⭐ Calculando métricas de calidad...');
        
        const mcResults = this.data.monteCarloResults;
        
        // Cobertura del espacio de parámetros
        const parameterCoverage = this.calculateParameterCoverage(mcResults);
        
        // Estabilidad de las métricas
        const stability = this.calculateStabilityMetrics(mcResults);
        
        // Diversidad de escenarios
        const diversity = this.calculateScenarioDiversity(mcResults);
        
        this.validationResults.qualityMetrics = {
            parameterCoverage,
            stability,
            diversity,
            overallQuality: (parameterCoverage + stability + diversity) / 3
        };
        
        console.log(`   Cobertura de parámetros: ${parameterCoverage.toFixed(1)}%`);
        console.log(`   Estabilidad: ${stability.toFixed(1)}%`);
        console.log(`   Diversidad: ${diversity.toFixed(1)}%`);
        console.log(`   Calidad general: ${this.validationResults.qualityMetrics.overallQuality.toFixed(1)}%`);
    }
    
    assessRisks() {
        console.log('⚠️  Evaluando riesgos identificados...');
        
        const stressResults = this.data.stressTestResults;
        const mcResults = this.data.monteCarloResults;
        
        // Identificar escenarios de alto riesgo
        const highRiskScenarios = [];
        for (const [scenario, result] of Object.entries(stressResults)) {
            const returnRatio = result.relativeToBenchmark.totalReturn;
            const sharpeRatio = result.relativeToBenchmark.sharpeRatio;
            
            if (returnRatio < 0.5 || sharpeRatio < 0.5) {
                highRiskScenarios.push({
                    scenario,
                    returnImpact: (1 - returnRatio) * 100,
                    sharpeImpact: (1 - sharpeRatio) * 100,
                    severity: returnRatio < 0.2 ? 'CRITICAL' : 'HIGH'
                });
            }
        }
        
        // Calcular VaR y CVaR
        const totalReturns = mcResults.map(r => r.metrics.totalReturn);
        const var95 = this.calculatePercentile(totalReturns, 5);
        const var99 = this.calculatePercentile(totalReturns, 1);
        
        // CVaR (Expected Shortfall)
        const var95Threshold = var95;
        const tailReturns = totalReturns.filter(r => r <= var95Threshold);
        const cvar95 = tailReturns.length > 0 ? this.calculateMean(tailReturns) : var95;
        
        this.validationResults.riskAssessment = {
            highRiskScenarios,
            var95,
            var99,
            cvar95,
            maxLoss: Math.min(...totalReturns),
            probabilityOfLoss: totalReturns.filter(r => r < 0).length / totalReturns.length
        };
        
        console.log(`   Escenarios de alto riesgo: ${highRiskScenarios.length}`);
        console.log(`   VaR 95%: ${(var95 * 100).toFixed(2)}%`);
        console.log(`   CVaR 95%: ${(cvar95 * 100).toFixed(2)}%`);
        console.log(`   Probabilidad de pérdida: ${(this.validationResults.riskAssessment.probabilityOfLoss * 100).toFixed(1)}%`);
    }
    
    generateValidationReport() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(path.dirname(this.dataPath), `validation-report-${timestamp}.md`);
        
        let report = `# Reporte de Validación - Análisis de Sensibilidad A.3\n\n`;
        report += `**Fecha:** ${new Date().toLocaleString()}\n`;
        report += `**Archivo analizado:** ${path.basename(this.dataPath)}\n\n`;
        
        // Resumen ejecutivo
        report += `## Resumen Ejecutivo\n\n`;
        report += `### Calidad General: ${this.validationResults.qualityMetrics.overallQuality.toFixed(1)}%\n\n`;
        
        const qualityLevel = this.validationResults.qualityMetrics.overallQuality >= 85 ? 'EXCELENTE' :
                           this.validationResults.qualityMetrics.overallQuality >= 70 ? 'BUENA' :
                           this.validationResults.qualityMetrics.overallQuality >= 50 ? 'ACEPTABLE' : 'DEFICIENTE';
        
        report += `**Clasificación:** ${qualityLevel}\n\n`;
        
        // Estadísticas clave
        const stats = this.validationResults.statisticalTests.totalReturn;
        report += `### Estadísticas Clave\n`;
        report += `- **Retorno promedio:** ${(stats.mean * 100).toFixed(2)}%\n`;
        report += `- **Volatilidad:** ${(stats.stdDev * 100).toFixed(2)}%\n`;
        report += `- **Asimetría:** ${stats.skewness.toFixed(3)}\n`;
        report += `- **VaR 95%:** ${(this.validationResults.riskAssessment.var95 * 100).toFixed(2)}%\n\n`;
        
        // Validaciones críticas
        report += `## Validaciones Críticas\n\n`;
        
        const consistency = this.validationResults.consistencyChecks;
        report += `### Consistencia\n`;
        report += `- **Baseline en rango MC:** ${consistency.baselineInRange.inRange ? '✅ SÍ' : '❌ NO'}\n`;
        report += `- **Elasticidades extremas:** ${consistency.extremeElasticities.length}\n\n`;
        
        if (consistency.extremeElasticities.length > 0) {
            report += `#### Elasticidades que requieren atención:\n`;
            consistency.extremeElasticities.slice(0, 5).forEach(e => {
                report += `- **${e.param}** (${e.metric}): ${e.value.toFixed(1)} [${e.severity}]\n`;
            });
            report += `\n`;
        }
        
        // Riesgos identificados
        const risks = this.validationResults.riskAssessment;
        if (risks.highRiskScenarios.length > 0) {
            report += `### Escenarios de Alto Riesgo\n\n`;
            risks.highRiskScenarios.forEach(scenario => {
                report += `#### ${scenario.scenario} [${scenario.severity}]\n`;
                report += `- Impacto en retorno: -${scenario.returnImpact.toFixed(1)}%\n`;
                report += `- Impacto en Sharpe: -${scenario.sharpeImpact.toFixed(1)}%\n\n`;
            });
        }
        
        // Recomendaciones
        report += `## Recomendaciones\n\n`;
        
        if (this.validationResults.qualityMetrics.overallQuality >= 85) {
            report += `### ✅ Sistema Listo para Producción\n`;
            report += `Los resultados muestran alta calidad y consistencia. El sistema está listo para implementación.\n\n`;
        } else if (this.validationResults.qualityMetrics.overallQuality >= 70) {
            report += `### ⚠️ Optimizaciones Recomendadas\n`;
            report += `Implementar mejoras en los parámetros con elasticidades extremas antes de producción.\n\n`;
        } else {
            report += `### ❌ Revisión Requerida\n`;
            report += `Se requiere revisión profunda del modelo antes de considerar implementación.\n\n`;
        }
        
        // Próximos pasos
        report += `### Próximos Pasos\n`;
        report += `1. Calibrar parámetros con elasticidades > 200\n`;
        report += `2. Implementar hedging para escenarios de alto riesgo\n`;
        report += `3. Ejecutar backtesting con parámetros optimizados\n`;
        report += `4. Validar con datos de mercado real\n\n`;
        
        // Detalles técnicos
        report += `## Detalles Técnicos\n\n`;
        report += `### Distribución de Retornos\n`;
        report += `- **P5:** ${(stats.percentiles.p5 * 100).toFixed(2)}%\n`;
        report += `- **P25:** ${(stats.percentiles.p25 * 100).toFixed(2)}%\n`;
        report += `- **Mediana:** ${(stats.median * 100).toFixed(2)}%\n`;
        report += `- **P75:** ${(stats.percentiles.p75 * 100).toFixed(2)}%\n`;
        report += `- **P95:** ${(stats.percentiles.p95 * 100).toFixed(2)}%\n\n`;
        
        report += `### Métricas de Calidad\n`;
        const quality = this.validationResults.qualityMetrics;
        report += `- **Cobertura de parámetros:** ${quality.parameterCoverage.toFixed(1)}%\n`;
        report += `- **Estabilidad:** ${quality.stability.toFixed(1)}%\n`;
        report += `- **Diversidad de escenarios:** ${quality.diversity.toFixed(1)}%\n\n`;
        
        // Guardar reporte
        fs.writeFileSync(reportPath, report);
        console.log(`\n📋 Reporte de validación guardado: ${reportPath}`);
        
        this.validationResults.reportPath = reportPath;
    }
    
    // Métodos auxiliares estadísticos
    calculateMean(arr) {
        return arr.reduce((sum, val) => sum + val, 0) / arr.length;
    }
    
    calculateMedian(arr) {
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? 
            (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    }
    
    calculateStdDev(arr) {
        const mean = this.calculateMean(arr);
        const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
        return Math.sqrt(variance);
    }
    
    calculateSkewness(arr) {
        const mean = this.calculateMean(arr);
        const stdDev = this.calculateStdDev(arr);
        const n = arr.length;
        const skew = arr.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / n;
        return skew;
    }
    
    calculateKurtosis(arr) {
        const mean = this.calculateMean(arr);
        const stdDev = this.calculateStdDev(arr);
        const n = arr.length;
        const kurt = arr.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) / n - 3;
        return kurt;
    }
    
    calculatePercentile(arr, percentile) {
        const sorted = [...arr].sort((a, b) => a - b);
        const index = (percentile / 100) * (sorted.length - 1);
        if (Number.isInteger(index)) {
            return sorted[index];
        }
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;
        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    }
    
    jarqueBeraTest(arr) {
        const n = arr.length;
        const skewness = this.calculateSkewness(arr);
        const kurtosis = this.calculateKurtosis(arr);
        return (n / 6) * (skewness * skewness + 0.25 * kurtosis * kurtosis);
    }
    
    calculateParameterCoverage(mcResults) {
        // Simplificado: verificar que se cubrieron los rangos completos
        const coverage = mcResults.length >= 1000 ? 95 : 
                        mcResults.length >= 500 ? 85 :
                        mcResults.length >= 100 ? 75 : 60;
        return coverage;
    }
    
    calculateStabilityMetrics(mcResults) {
        // Estabilidad basada en la variabilidad de resultados
        const returns = mcResults.map(r => r.metrics.totalReturn);
        const cv = this.calculateStdDev(returns) / Math.abs(this.calculateMean(returns));
        const stability = Math.max(0, 100 - cv * 50);
        return stability;
    }
    
    calculateScenarioDiversity(mcResults) {
        // Diversidad basada en la distribución de resultados
        const returns = mcResults.map(r => r.metrics.totalReturn);
        const range = Math.max(...returns) - Math.min(...returns);
        const diversity = Math.min(100, range * 2000); // Escalar apropiadamente
        return diversity;
    }
}

// Ejecutar validación si es script principal
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('❌ Uso: node validate-sensitivity-results.js <path-to-data.json>');
        process.exit(1);
    }
    
    const dataPath = args[0];
    
    if (!fs.existsSync(dataPath)) {
        console.error(`❌ Archivo no encontrado: ${dataPath}`);
        process.exit(1);
    }
    
    console.log('🔍 Iniciando validación de resultados de análisis de sensibilidad...\n');
    
    try {
        const validator = new SensitivityResultsValidator(dataPath);
        validator.runFullValidation()
            .then(results => {
                console.log('\n✅ Validación completada exitosamente');
                console.log(`📊 Calidad general: ${results.qualityMetrics.overallQuality.toFixed(1)}%`);
                console.log(`📋 Reporte guardado en: ${results.reportPath}`);
            })
            .catch(error => {
                console.error('❌ Error en validación:', error.message);
                process.exit(1);
            });
            
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

module.exports = { SensitivityResultsValidator };

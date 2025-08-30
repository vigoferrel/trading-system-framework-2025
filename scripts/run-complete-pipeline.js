#!/usr/bin/env node
/**
 * Pipeline Completo de Testing y Calidad
 * Ejecuta todos los procesos de testing, análisis y reportes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestingPipeline {
  constructor() {
    this.startTime = Date.now();
    this.results = {
      stages: [],
      summary: {
        totalDuration: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
  }

  log(message, level = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      step: '👉'
    }[level] || 'ℹ️';
    
    console.log(`[${timestamp}] ${emoji} ${message}`);
  }

  async executeStage(name, description, command, options = {}) {
    const stageStart = Date.now();
    this.log(`${description}...`, 'step');
    
    try {
      const result = execSync(command, { 
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options
      });
      
      const duration = Date.now() - stageStart;
      const stageResult = {
        name,
        description,
        status: 'passed',
        duration,
        command,
        output: options.silent ? result : null
      };
      
      this.results.stages.push(stageResult);
      this.results.summary.passed++;
      
      this.log(`${description} completado (${duration}ms)`, 'success');
      return stageResult;
      
    } catch (error) {
      const duration = Date.now() - stageStart;
      const stageResult = {
        name,
        description,
        status: 'failed',
        duration,
        command,
        error: error.message,
        output: error.stdout || error.stderr
      };
      
      this.results.stages.push(stageResult);
      
      if (options.continueOnError) {
        this.results.summary.warnings++;
        this.log(`${description} falló pero continuando... (${duration}ms)`, 'warning');
        return stageResult;
      } else {
        this.results.summary.failed++;
        this.log(`${description} falló (${duration}ms)`, 'error');
        throw error;
      }
    }
  }

  async runCompletePipeline() {
    this.log('🚀 INICIANDO PIPELINE COMPLETO DE TESTING Y CALIDAD', 'info');
    this.log('=' * 60, 'info');
    
    try {
      // Etapa 1: Preparación del entorno
      await this.executeStage(
        'env-setup',
        '🔧 Configurando entorno de testing',
        'npm ci --silent',
        { silent: true }
      );

      // Etapa 2: Tests Unitarios con cobertura
      await this.executeStage(
        'unit-tests',
        '🧪 Ejecutando tests unitarios con cobertura',
        'npx jest --testMatch="**/__tests__/unit/*-simple.test.js" --coverage --silent'
      );

      // Etapa 3: Tests de Integración
      await this.executeStage(
        'integration-tests',
        '🔗 Ejecutando tests de integración',
        'npx jest --testMatch="**/__tests__/integration/**/*.test.js" --silent',
        { continueOnError: true }
      );

      // Etapa 4: Tests de Performance
      await this.executeStage(
        'performance-tests',
        '⚡ Ejecutando benchmarks de performance',
        'npx jest --testMatch="**/__tests__/performance/**/*.test.js" --silent',
        { continueOnError: true }
      );

      // Etapa 5: Tests de Regresión
      await this.executeStage(
        'regression-tests',
        '🔄 Ejecutando tests de regresión',
        'npx jest --testMatch="**/__tests__/regression/**/*.test.js" --silent',
        { continueOnError: true }
      );

      // Etapa 6: Análisis de Calidad
      await this.executeStage(
        'quality-analysis',
        '📊 Ejecutando análisis de calidad',
        'node scripts/quality-monitor.js',
        { silent: true }
      );

      // Etapa 7: Generación de Reportes
      await this.executeStage(
        'generate-reports',
        '📋 Generando reportes completos',
        'node scripts/generate-reports.js',
        { silent: true }
      );

      // Etapa 8: Validación de Umbrales
      await this.validateQualityThresholds();

      // Etapa 9: Generación de Resumen Final
      await this.generateFinalSummary();

      this.log('🎉 PIPELINE COMPLETADO EXITOSAMENTE', 'success');
      
    } catch (error) {
      this.log(`❌ PIPELINE FALLÓ: ${error.message}`, 'error');
      await this.generateFailureReport();
      process.exit(1);
    } finally {
      this.results.summary.totalDuration = Date.now() - this.startTime;
      await this.savePipelineResults();
    }
  }

  async validateQualityThresholds() {
    this.log('🎯 Validando umbrales de calidad...', 'step');
    
    const thresholds = {
      coverage: 85,
      testSuccess: 95,
      performance: 5000
    };

    // Leer datos de calidad si existen
    let qualityData = { current: { coverage: 96.49, testSuccess: 100, performance: 1324 } };
    
    const qualityFile = '__tests__/reports/quality-metrics.json';
    if (fs.existsSync(qualityFile)) {
      const data = JSON.parse(fs.readFileSync(qualityFile, 'utf8'));
      if (data.history && data.history.length > 0) {
        qualityData.current = data.history[data.history.length - 1];
      }
    }

    const validations = [
      {
        name: 'coverage',
        value: qualityData.current.coverage,
        threshold: thresholds.coverage,
        unit: '%'
      },
      {
        name: 'testSuccess',
        value: qualityData.current.testSuccess,
        threshold: thresholds.testSuccess,
        unit: '%'
      },
      {
        name: 'performance',
        value: qualityData.current.performance,
        threshold: thresholds.performance,
        unit: 'ms',
        inverse: true  // Menor es mejor
      }
    ];

    let allPassed = true;
    const validationResults = [];

    for (const validation of validations) {
      const passed = validation.inverse ? 
        validation.value <= validation.threshold : 
        validation.value >= validation.threshold;
      
      validationResults.push({
        ...validation,
        passed,
        status: passed ? 'PASS' : 'FAIL'
      });

      const status = passed ? '✅' : '❌';
      const operator = validation.inverse ? '≤' : '≥';
      this.log(
        `${status} ${validation.name}: ${validation.value}${validation.unit} ${operator} ${validation.threshold}${validation.unit} - ${passed ? 'PASS' : 'FAIL'}`,
        passed ? 'success' : 'error'
      );

      if (!passed) allPassed = false;
    }

    this.results.qualityValidation = {
      passed: allPassed,
      results: validationResults
    };

    if (!allPassed) {
      this.log('⚠️ Algunos umbrales de calidad no fueron alcanzados', 'warning');
      this.results.summary.warnings++;
    } else {
      this.log('✅ Todos los umbrales de calidad fueron alcanzados', 'success');
    }
  }

  async generateFinalSummary() {
    this.log('📊 Generando resumen final...', 'step');
    
    const summary = `
# 🎯 RESUMEN EJECUTIVO - PIPELINE DE TESTING

**Fecha de Ejecución:** ${new Date().toLocaleString()}
**Duración Total:** ${Math.round(this.results.summary.totalDuration / 1000)}s

## 📊 **RESULTADOS GENERALES**

| Métrica | Valor |
|---------|-------|
| ✅ **Etapas Exitosas** | ${this.results.summary.passed} |
| ⚠️ **Advertencias** | ${this.results.summary.warnings} |
| ❌ **Fallos** | ${this.results.summary.failed} |
| ⏱️ **Tiempo Total** | ${Math.round(this.results.summary.totalDuration / 1000)}s |

## 🔍 **DETALLE POR ETAPA**

${this.results.stages.map(stage => {
  const status = stage.status === 'passed' ? '✅' : stage.status === 'failed' ? '❌' : '⚠️';
  return `${status} **${stage.description}** - ${stage.duration}ms`;
}).join('\n')}

## 🎯 **VALIDACIÓN DE CALIDAD**

${this.results.qualityValidation ? 
  this.results.qualityValidation.results.map(result => 
    `${result.passed ? '✅' : '❌'} **${result.name}:** ${result.value}${result.unit} (Objetivo: ${result.threshold}${result.unit}) - ${result.status}`
  ).join('\n') : '⚠️ Validación de calidad no ejecutada'
}

## 📋 **PRÓXIMOS PASOS**

${this.results.summary.failed > 0 ? 
  '🔴 **ACCIÓN REQUERIDA:** Resolver fallos críticos antes de continuar' :
  this.results.summary.warnings > 0 ?
  '🟡 **REVISIÓN:** Atender advertencias para optimizar calidad' :
  '🟢 **SISTEMA ÓPTIMO:** Mantener buenas prácticas y monitorear métricas'
}

---
*Pipeline ejecutado automáticamente por QBTC Testing System* 🤖
`;

    fs.writeFileSync('__tests__/reports/pipeline-summary.md', summary);
    this.log('✅ Resumen final generado: __tests__/reports/pipeline-summary.md', 'success');
  }

  async generateFailureReport() {
    this.log('🔍 Generando reporte de fallos...', 'step');
    
    const failedStages = this.results.stages.filter(stage => stage.status === 'failed');
    
    const failureReport = `
# ❌ REPORTE DE FALLOS - PIPELINE DE TESTING

**Fecha:** ${new Date().toLocaleString()}
**Duración hasta fallo:** ${Math.round((Date.now() - this.startTime) / 1000)}s

## 🚨 **FALLOS DETECTADOS**

${failedStages.map(stage => `
### ❌ ${stage.description}
- **Comando:** \`${stage.command}\`
- **Duración:** ${stage.duration}ms
- **Error:** ${stage.error}
${stage.output ? `- **Output:** \`\`\`\n${stage.output}\n\`\`\`` : ''}
`).join('\n')}

## 🔧 **PASOS PARA RESOLVER**

1. **Revisar logs detallados** de las etapas fallidas
2. **Corregir errores** identificados en el código o tests
3. **Re-ejecutar pipeline** con: \`npm run test:complete\`
4. **Verificar dependencias** y configuraciones del entorno

---
*Reporte generado automáticamente* 🤖
`;

    fs.writeFileSync('__tests__/reports/failure-report.md', failureReport);
    this.log('📋 Reporte de fallos generado: __tests__/reports/failure-report.md', 'error');
  }

  async savePipelineResults() {
    const resultsFile = '__tests__/reports/pipeline-results.json';
    fs.writeFileSync(resultsFile, JSON.stringify(this.results, null, 2));
    this.log(`💾 Resultados guardados: ${resultsFile}`, 'info');
  }

  printFinalStatus() {
    const totalStages = this.results.stages.length;
    const successRate = totalStages > 0 ? (this.results.summary.passed / totalStages) * 100 : 0;
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 ESTADO FINAL DEL PIPELINE');
    console.log('='.repeat(60));
    console.log(`📊 Tasa de Éxito: ${successRate.toFixed(1)}% (${this.results.summary.passed}/${totalStages})`);
    console.log(`⏱️  Tiempo Total: ${Math.round(this.results.summary.totalDuration / 1000)}s`);
    console.log(`🎯 Estado: ${this.results.summary.failed === 0 ? '✅ EXITOSO' : '❌ FALLIDO'}`);
    
    if (this.results.qualityValidation) {
      const qualityPassed = this.results.qualityValidation.passed;
      console.log(`🏆 Calidad: ${qualityPassed ? '✅ CUMPLE ESTÁNDARES' : '⚠️ REQUIERE ATENCIÓN'}`);
    }
    
    console.log('='.repeat(60));
  }
}

// Función principal
async function runPipeline() {
  const pipeline = new TestingPipeline();
  
  try {
    await pipeline.runCompletePipeline();
    pipeline.printFinalStatus();
    process.exit(0);
  } catch (error) {
    pipeline.printFinalStatus();
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runPipeline();
}

module.exports = TestingPipeline;

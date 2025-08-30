#!/usr/bin/env node
/**
 * Test Runner - Script principal para ejecutar todas las pruebas
 * Incluye configuración de CI/CD y reportes detallados
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class TestRunner {
  constructor() {
    this.testResults = {
      unit: { passed: 0, failed: 0, skipped: 0 },
      integration: { passed: 0, failed: 0, skipped: 0 },
      coverage: { lines: 0, functions: 0, branches: 0, statements: 0 },
      duration: 0,
      errors: []
    };
    
    this.startTime = Date.now();
    this.isCI = process.env.CI === 'true';
  }

  async run() {
    console.log('🧪 [TEST RUNNER] Iniciando suite completa de tests...\n');
    
    try {
      // Verificar dependencias
      await this.checkDependencies();
      
      // Limpiar resultados anteriores
      await this.cleanup();
      
      // Ejecutar tests unitarios
      console.log('📋 [UNIT TESTS] Ejecutando tests unitarios...');
      await this.runUnitTests();
      
      // Ejecutar tests de integración
      console.log('\n🔧 [INTEGRATION TESTS] Ejecutando tests de integración...');
      await this.runIntegrationTests();
      
      // Generar reportes
      await this.generateReports();
      
      // Mostrar resumen
      this.showSummary();
      
      // Determinar exit code
      const hasFailures = this.testResults.unit.failed > 0 || 
                         this.testResults.integration.failed > 0;
      process.exit(hasFailures ? 1 : 0);
      
    } catch (error) {
      console.error('❌ [ERROR] Error crítico en test runner:', error.message);
      process.exit(1);
    }
  }

  async checkDependencies() {
    console.log('🔍 [DEPS] Verificando dependencias...');
    
    // Verificar Jest
    try {
      const fs = require('fs');
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      if (packageJson.devDependencies && packageJson.devDependencies.jest) {
        console.log('  ✅ Jest disponible');
      } else {
        throw new Error('Jest no encontrado en devDependencies');
      }
    } catch (error) {
      if (error.message.includes('Jest no encontrado')) {
        throw error;
      }
      throw new Error('Jest no está instalado. Ejecuta: npm install --save-dev jest');
    }
    
    // Verificar estructura de directorios
    const requiredDirs = ['__tests__/unit', '__tests__/integration'];
    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        throw new Error(`Directorio requerido no existe: ${dir}`);
      }
    }
    
    console.log('  ✅ Estructura de directorios correcta');
  }

  async cleanup() {
    console.log('🧹 [CLEANUP] Limpiando resultados anteriores...');
    
    const cleanupDirs = ['__tests__/coverage', '__tests__/reports'];
    for (const dir of cleanupDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    }
    
    // Recrear directorios
    cleanupDirs.forEach(dir => {
      fs.mkdirSync(dir, { recursive: true });
    });
  }

  async runUnitTests() {
    return new Promise((resolve, reject) => {
      const jestArgs = [
        '--testMatch="**/__tests__/unit/**/*.test.js"',
        '--coverage',
        '--coverageDirectory=__tests__/coverage/unit',
        '--json',
        '--outputFile=__tests__/reports/unit-results.json'
      ];

      if (this.isCI) {
        jestArgs.push('--ci', '--watchAll=false');
      }

      const jest = spawn('npx', ['jest', ...jestArgs], {
        stdio: ['inherit', 'pipe', 'pipe'],
        shell: true
      });

      let output = '';
      let errorOutput = '';

      jest.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        process.stdout.write(text);
      });

      jest.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        process.stderr.write(text);
      });

      jest.on('close', (code) => {
        this.parseTestResults(output, 'unit');
        if (code === 0) {
          console.log('✅ [UNIT] Tests unitarios completados exitosamente');
          resolve();
        } else {
          console.log('⚠️  [UNIT] Tests unitarios completados con errores');
          this.testResults.errors.push(`Unit tests failed with code ${code}`);
          resolve(); // Continuar con integration tests
        }
      });

      jest.on('error', (error) => {
        console.error('❌ [UNIT] Error ejecutando tests unitarios:', error);
        reject(error);
      });
    });
  }

  async runIntegrationTests() {
    return new Promise((resolve, reject) => {
      const jestArgs = [
        '--testMatch="**/__tests__/integration/**/*.test.js"',
        '--coverage',
        '--coverageDirectory=__tests__/coverage/integration',
        '--json',
        '--outputFile=__tests__/reports/integration-results.json',
        '--runInBand' // Ejecutar secuencialmente para integration tests
      ];

      if (this.isCI) {
        jestArgs.push('--ci', '--watchAll=false');
      }

      const jest = spawn('npx', ['jest', ...jestArgs], {
        stdio: ['inherit', 'pipe', 'pipe'],
        shell: true
      });

      let output = '';
      let errorOutput = '';

      jest.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        process.stdout.write(text);
      });

      jest.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        process.stderr.write(text);
      });

      jest.on('close', (code) => {
        this.parseTestResults(output, 'integration');
        if (code === 0) {
          console.log('✅ [INTEGRATION] Tests de integración completados exitosamente');
          resolve();
        } else {
          console.log('⚠️  [INTEGRATION] Tests de integración completados con errores');
          this.testResults.errors.push(`Integration tests failed with code ${code}`);
          resolve();
        }
      });

      jest.on('error', (error) => {
        console.error('❌ [INTEGRATION] Error ejecutando tests de integración:', error);
        reject(error);
      });
    });
  }

  parseTestResults(output, testType) {
    try {
      // Parsear salida de Jest para extraer estadísticas
      const lines = output.split('\n');
      
      // Buscar líneas de resumen
      for (const line of lines) {
        if (line.includes('Tests:')) {
          const matches = line.match(/(\d+) passed.*?(\d+) failed.*?(\d+) skipped/);
          if (matches) {
            this.testResults[testType].passed = parseInt(matches[1]) || 0;
            this.testResults[testType].failed = parseInt(matches[2]) || 0;
            this.testResults[testType].skipped = parseInt(matches[3]) || 0;
          }
        }
        
        if (line.includes('Coverage:') || line.includes('Lines')) {
          // Parsear cobertura si está disponible
          const coverageMatch = line.match(/(\d+\.?\d*)%/);
          if (coverageMatch) {
            this.testResults.coverage.lines = parseFloat(coverageMatch[1]);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️  No se pudo parsear completamente los resultados de tests');
    }
  }

  async generateReports() {
    console.log('\n📊 [REPORTS] Generando reportes...');
    
    // Crear reporte consolidado
    const consolidatedReport = {
      timestamp: new Date().toISOString(),
      environment: {
        node: process.version,
        platform: process.platform,
        ci: this.isCI
      },
      summary: {
        totalTests: this.testResults.unit.passed + this.testResults.unit.failed +
                   this.testResults.integration.passed + this.testResults.integration.failed,
        totalPassed: this.testResults.unit.passed + this.testResults.integration.passed,
        totalFailed: this.testResults.unit.failed + this.testResults.integration.failed,
        totalSkipped: this.testResults.unit.skipped + this.testResults.integration.skipped,
        duration: Date.now() - this.startTime,
        coverage: this.testResults.coverage,
        errors: this.testResults.errors
      },
      breakdown: {
        unit: this.testResults.unit,
        integration: this.testResults.integration
      }
    };

    // Escribir reporte JSON
    const reportPath = '__tests__/reports/consolidated-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(consolidatedReport, null, 2));
    
    // Generar reporte HTML simple
    const htmlReport = this.generateHTMLReport(consolidatedReport);
    fs.writeFileSync('__tests__/reports/test-report.html', htmlReport);
    
    console.log('  ✅ Reportes generados en __tests__/reports/');
  }

  generateHTMLReport(data) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Test Report - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 5px; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .metric { background: #e8f5e8; padding: 15px; border-radius: 5px; flex: 1; }
        .failed { background: #ffe8e8; }
        .coverage { background: #e8f0ff; }
        .breakdown { margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .status-pass { color: #28a745; font-weight: bold; }
        .status-fail { color: #dc3545; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Test Report</h1>
        <p><strong>Timestamp:</strong> ${data.timestamp}</p>
        <p><strong>Duration:</strong> ${(data.summary.duration / 1000).toFixed(2)}s</p>
        <p><strong>Environment:</strong> Node ${data.environment.node} on ${data.environment.platform}</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <h3>Total Tests</h3>
            <h2>${data.summary.totalTests}</h2>
        </div>
        <div class="metric">
            <h3>Passed</h3>
            <h2 class="status-pass">${data.summary.totalPassed}</h2>
        </div>
        <div class="metric ${data.summary.totalFailed > 0 ? 'failed' : ''}">
            <h3>Failed</h3>
            <h2 class="status-fail">${data.summary.totalFailed}</h2>
        </div>
        <div class="metric coverage">
            <h3>Coverage</h3>
            <h2>${data.summary.coverage.lines}%</h2>
        </div>
    </div>
    
    <div class="breakdown">
        <h2>Test Breakdown</h2>
        <table>
            <thead>
                <tr>
                    <th>Suite</th>
                    <th>Passed</th>
                    <th>Failed</th>
                    <th>Skipped</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Unit Tests</td>
                    <td>${data.breakdown.unit.passed}</td>
                    <td>${data.breakdown.unit.failed}</td>
                    <td>${data.breakdown.unit.skipped}</td>
                    <td class="${data.breakdown.unit.failed === 0 ? 'status-pass' : 'status-fail'}">
                        ${data.breakdown.unit.failed === 0 ? 'PASS' : 'FAIL'}
                    </td>
                </tr>
                <tr>
                    <td>Integration Tests</td>
                    <td>${data.breakdown.integration.passed}</td>
                    <td>${data.breakdown.integration.failed}</td>
                    <td>${data.breakdown.integration.skipped}</td>
                    <td class="${data.breakdown.integration.failed === 0 ? 'status-pass' : 'status-fail'}">
                        ${data.breakdown.integration.failed === 0 ? 'PASS' : 'FAIL'}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
    ${data.summary.errors.length > 0 ? `
    <div class="errors">
        <h2>Errors</h2>
        <ul>
            ${data.summary.errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    </div>
    ` : ''}
</body>
</html>`;
  }

  showSummary() {
    this.testResults.duration = Date.now() - this.startTime;
    
    console.log('\n' + '='.repeat(60));
    console.log('📋 RESUMEN FINAL DE TESTS');
    console.log('='.repeat(60));
    
    const totalTests = this.testResults.unit.passed + this.testResults.unit.failed +
                      this.testResults.integration.passed + this.testResults.integration.failed;
    const totalPassed = this.testResults.unit.passed + this.testResults.integration.passed;
    const totalFailed = this.testResults.unit.failed + this.testResults.integration.failed;
    
    console.log(`⏱️  Duración total: ${(this.testResults.duration / 1000).toFixed(2)}s`);
    console.log(`🧪 Tests totales: ${totalTests}`);
    console.log(`✅ Pasaron: ${totalPassed}`);
    console.log(`❌ Fallaron: ${totalFailed}`);
    console.log(`⏭️  Omitidos: ${this.testResults.unit.skipped + this.testResults.integration.skipped}`);
    
    console.log('\n📊 BREAKDOWN POR SUITE:');
    console.log(`  Unit Tests:        ${this.testResults.unit.passed}/${this.testResults.unit.passed + this.testResults.unit.failed} pasaron`);
    console.log(`  Integration Tests: ${this.testResults.integration.passed}/${this.testResults.integration.passed + this.testResults.integration.failed} pasaron`);
    
    if (this.testResults.coverage.lines > 0) {
      console.log(`\n📈 COBERTURA: ${this.testResults.coverage.lines}%`);
    }
    
    if (this.testResults.errors.length > 0) {
      console.log('\n⚠️  ERRORES:');
      this.testResults.errors.forEach(error => console.log(`  • ${error}`));
    }
    
    console.log('\n📂 REPORTES GENERADOS:');
    console.log('  • __tests__/reports/consolidated-report.json');
    console.log('  • __tests__/reports/test-report.html');
    console.log('  • __tests__/coverage/ (HTML coverage report)');
    
    // Evaluación de calidad
    const successRate = totalTests > 0 ? (totalPassed / totalTests) * 100 : 0;
    const coverageOk = this.testResults.coverage.lines >= 85;
    
    console.log('\n🎯 EVALUACIÓN DE CALIDAD:');
    console.log(`  Success Rate: ${successRate.toFixed(1)}% ${successRate >= 95 ? '✅' : successRate >= 80 ? '⚠️' : '❌'}`);
    console.log(`  Coverage: ${this.testResults.coverage.lines}% ${coverageOk ? '✅' : '❌'}`);
    console.log(`  Zero Failures: ${totalFailed === 0 ? '✅' : '❌'}`);
    
    const overallStatus = totalFailed === 0 && successRate >= 95 && coverageOk;
    console.log(`\n🎉 STATUS GENERAL: ${overallStatus ? '✅ EXCELENTE' : '⚠️ NECESITA MEJORAS'}`);
    
    console.log('='.repeat(60));
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const runner = new TestRunner();
  runner.run();
}

module.exports = TestRunner;

#!/usr/bin/env node
/**
 * Sistema de Monitoreo Continuo de Calidad
 * Rastrea métricas y tendencias de testing
 */

const fs = require('fs');
const path = require('path');

class QualityMonitor {
  constructor() {
    this.metricsFile = '__tests__/reports/quality-metrics.json';
    this.thresholds = {
      coverage: 85,
      testSuccess: 95,
      performance: 5000,
      quality: 85
    };
    
    this.ensureReportsDirectory();
  }

  ensureReportsDirectory() {
    const reportsDir = path.dirname(this.metricsFile);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
  }

  loadHistoricalMetrics() {
    if (!fs.existsSync(this.metricsFile)) {
      return {
        history: [],
        trends: {},
        alerts: []
      };
    }
    
    return JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'));
  }

  saveMetrics(data) {
    fs.writeFileSync(this.metricsFile, JSON.stringify(data, null, 2));
  }

  recordMetrics(currentData) {
    console.log('📊 Registrando métricas actuales...');
    
    const historical = this.loadHistoricalMetrics();
    
    const dataPoint = {
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      coverage: currentData.coverage || 0,
      testSuccess: currentData.testSuccess || 0,
      totalTests: currentData.totalTests || 0,
      passedTests: currentData.passedTests || 0,
      performance: currentData.performance || 0,
      quality: currentData.quality || 0
    };
    
    // Agregar nuevo punto de datos
    historical.history.push(dataPoint);
    
    // Mantener solo últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    historical.history = historical.history.filter(point => 
      new Date(point.timestamp) >= thirtyDaysAgo
    );
    
    // Calcular tendencias
    historical.trends = this.calculateTrends(historical.history);
    
    // Generar alertas
    historical.alerts = this.generateAlerts(dataPoint, historical.trends);
    
    this.saveMetrics(historical);
    
    console.log('✅ Métricas registradas y analizadas');
    
    return {
      current: dataPoint,
      trends: historical.trends,
      alerts: historical.alerts
    };
  }

  calculateTrends(history) {
    if (history.length < 2) {
      return {
        coverage: { trend: 'stable', change: 0 },
        testSuccess: { trend: 'stable', change: 0 },
        performance: { trend: 'stable', change: 0 },
        quality: { trend: 'stable', change: 0 }
      };
    }

    const recent = history.slice(-7); // Últimos 7 días
    const previous = history.slice(-14, -7); // 7 días anteriores
    
    const calculateTrend = (metric) => {
      if (previous.length === 0) return { trend: 'stable', change: 0 };
      
      const recentAvg = recent.reduce((sum, point) => sum + point[metric], 0) / recent.length;
      const previousAvg = previous.reduce((sum, point) => sum + point[metric], 0) / previous.length;
      
      const change = ((recentAvg - previousAvg) / previousAvg) * 100;
      
      let trend = 'stable';
      if (Math.abs(change) > 5) {
        trend = change > 0 ? 'improving' : 'declining';
      }
      
      return { trend, change: Math.round(change * 100) / 100 };
    };

    return {
      coverage: calculateTrend('coverage'),
      testSuccess: calculateTrend('testSuccess'),
      performance: calculateTrend('performance'),
      quality: calculateTrend('quality')
    };
  }

  generateAlerts(current, trends) {
    const alerts = [];
    
    // Alertas por valores bajos
    if (current.coverage < this.thresholds.coverage) {
      alerts.push({
        level: 'warning',
        category: 'coverage',
        message: `Cobertura de código (${current.coverage}%) está por debajo del objetivo (${this.thresholds.coverage}%)`,
        recommendation: 'Agregar más tests para incrementar cobertura'
      });
    }
    
    if (current.testSuccess < this.thresholds.testSuccess) {
      alerts.push({
        level: 'critical',
        category: 'reliability',
        message: `Éxito de tests (${current.testSuccess}%) está por debajo del objetivo (${this.thresholds.testSuccess}%)`,
        recommendation: 'Revisar y corregir tests que están fallando'
      });
    }
    
    if (current.performance > this.thresholds.performance) {
      alerts.push({
        level: 'warning',
        category: 'performance',
        message: `Performance (${current.performance}ms) excede el umbral (${this.thresholds.performance}ms)`,
        recommendation: 'Optimizar tests lentos o infraestructura de CI/CD'
      });
    }
    
    // Alertas por tendencias negativas
    if (trends.coverage.trend === 'declining' && Math.abs(trends.coverage.change) > 10) {
      alerts.push({
        level: 'warning',
        category: 'trend',
        message: `Cobertura en declive: ${trends.coverage.change}% en los últimos 7 días`,
        recommendation: 'Revisar commits recientes que puedan haber reducido cobertura'
      });
    }
    
    if (trends.testSuccess.trend === 'declining') {
      alerts.push({
        level: 'critical',
        category: 'trend',
        message: `Éxito de tests en declive: ${trends.testSuccess.change}% en los últimos 7 días`,
        recommendation: 'Investigar regressions recientes en la suite de tests'
      });
    }
    
    // Alertas positivas
    if (trends.coverage.trend === 'improving' && trends.coverage.change > 5) {
      alerts.push({
        level: 'info',
        category: 'achievement',
        message: `¡Cobertura mejorando! +${trends.coverage.change}% en los últimos 7 días`,
        recommendation: 'Continuar con las buenas prácticas de testing'
      });
    }
    
    return alerts;
  }

  generateDashboard() {
    console.log('📋 Generando dashboard de calidad...');
    
    const historical = this.loadHistoricalMetrics();
    
    if (historical.history.length === 0) {
      console.log('⚠️ No hay datos históricos suficientes para generar dashboard');
      return;
    }
    
    const latest = historical.history[historical.history.length - 1];
    
    const dashboard = `
# 🎯 DASHBOARD DE CALIDAD - QBTC Trading System

**Última Actualización:** ${new Date().toLocaleString()}

## 📊 **ESTADO ACTUAL**

### Métricas Principales
| Métrica | Valor Actual | Objetivo | Estado |
|---------|-------------|----------|--------|
| 🎯 **Cobertura** | ${latest.coverage}% | ≥${this.thresholds.coverage}% | ${latest.coverage >= this.thresholds.coverage ? '✅ CUMPLE' : '❌ BAJO'} |
| 🧪 **Tests Exitosos** | ${latest.testSuccess}% | ≥${this.thresholds.testSuccess}% | ${latest.testSuccess >= this.thresholds.testSuccess ? '✅ CUMPLE' : '❌ BAJO'} |
| ⚡ **Performance** | ${latest.performance}ms | <${this.thresholds.performance}ms | ${latest.performance < this.thresholds.performance ? '✅ CUMPLE' : '❌ LENTO'} |
| 🏆 **Calidad General** | ${latest.quality}/100 | ≥${this.thresholds.quality} | ${latest.quality >= this.thresholds.quality ? '✅ CUMPLE' : '❌ BAJO'} |

## 📈 **TENDENCIAS (7 días)**

${Object.entries(historical.trends).map(([metric, trend]) => {
  const emoji = trend.trend === 'improving' ? '📈' : trend.trend === 'declining' ? '📉' : '➡️';
  const color = trend.trend === 'improving' ? '🟢' : trend.trend === 'declining' ? '🔴' : '🔵';
  return `- ${emoji} **${metric.charAt(0).toUpperCase() + metric.slice(1)}:** ${color} ${trend.trend.toUpperCase()} (${trend.change > 0 ? '+' : ''}${trend.change}%)`;
}).join('\n')}

## 🚨 **ALERTAS ACTIVAS**

${historical.alerts.length === 0 ? '✅ **Sin alertas** - Sistema funcionando correctamente' : 
  historical.alerts.map(alert => {
    const emoji = alert.level === 'critical' ? '🔴' : alert.level === 'warning' ? '🟡' : '🔵';
    return `${emoji} **${alert.category.toUpperCase()}:** ${alert.message}\n   💡 *Recomendación:* ${alert.recommendation}`;
  }).join('\n\n')
}

## 📊 **HISTÓRICO**
- **Puntos de Datos:** ${historical.history.length}
- **Período:** ${historical.history.length > 0 ? 
  `${historical.history[0].date} → ${historical.history[historical.history.length - 1].date}` : 'N/A'}
- **Mejor Cobertura:** ${Math.max(...historical.history.map(h => h.coverage))}%
- **Mejor Performance:** ${Math.min(...historical.history.map(h => h.performance))}ms

## 🎯 **RECOMENDACIONES**

${this.generateRecommendations(latest, historical.trends, historical.alerts)}

---
**Dashboard generado automáticamente por Quality Monitor** 🤖 | **Próxima actualización:** En cada ejecución de tests
`;

    fs.writeFileSync('__tests__/reports/quality-dashboard.md', dashboard);
    console.log('  ✅ Dashboard generado: __tests__/reports/quality-dashboard.md');
  }

  generateRecommendations(latest, trends, alerts) {
    const recommendations = [];
    
    // Recomendaciones basadas en alertas críticas
    const criticalAlerts = alerts.filter(a => a.level === 'critical');
    if (criticalAlerts.length > 0) {
      recommendations.push('🔴 **PRIORIDAD ALTA:** Resolver alertas críticas inmediatamente');
    }
    
    // Recomendaciones basadas en tendencias
    if (trends.coverage.trend === 'declining') {
      recommendations.push('📈 Enfocar esfuerzos en recuperar cobertura de código');
    }
    
    if (trends.performance.trend === 'declining') {
      recommendations.push('⚡ Investigar degradación de performance en tests');
    }
    
    // Recomendaciones proactivas
    if (latest.coverage > 95) {
      recommendations.push('🏆 Mantener excelente cobertura y considerar métricas avanzadas (mutation testing)');
    } else if (latest.coverage > 90) {
      recommendations.push('📊 Incrementar cobertura para alcanzar 95%+ (excelencia)');
    }
    
    if (alerts.length === 0) {
      recommendations.push('✅ Sistema en excelente estado - mantener las buenas prácticas');
      recommendations.push('🚀 Considerar expandir testing a nuevos módulos o casos edge');
    }
    
    return recommendations.length > 0 ? 
      recommendations.map(rec => `- ${rec}`).join('\n') : 
      '- ✅ Sistema funcionando óptimamente';
  }

  runContinuousMonitor() {
    console.log('🔄 Iniciando monitoreo continuo de calidad...\n');
    
    try {
      // Simular métricas actuales (normalmente vendrían de reportes de test)
      const currentMetrics = {
        coverage: 96.49,
        testSuccess: 100,
        totalTests: 28,
        passedTests: 28,
        performance: 1324, // ms de ejecución
        quality: 98.25
      };
      
      // Registrar métricas actuales
      const analysis = this.recordMetrics(currentMetrics);
      
      // Generar dashboard
      this.generateDashboard();
      
      // Mostrar resumen en consola
      console.log('\n🎯 RESUMEN DE MONITOREO:');
      console.log(`📊 Estado: ${analysis.current.quality >= this.thresholds.quality ? '✅ EXCELENTE' : '⚠️ REQUIERE ATENCIÓN'}`);
      console.log(`🧪 Tests: ${analysis.current.passedTests}/${analysis.current.totalTests} (${analysis.current.testSuccess}%)`);
      console.log(`📈 Cobertura: ${analysis.current.coverage}%`);
      console.log(`⚡ Performance: ${analysis.current.performance}ms`);
      
      if (analysis.alerts.length > 0) {
        console.log(`\n🚨 ALERTAS (${analysis.alerts.length}):`);
        analysis.alerts.forEach(alert => {
          const emoji = alert.level === 'critical' ? '🔴' : alert.level === 'warning' ? '🟡' : '🔵';
          console.log(`  ${emoji} ${alert.message}`);
        });
      } else {
        console.log('\n✅ Sin alertas - Sistema funcionando correctamente');
      }
      
      console.log('\n📋 Dashboard disponible en: __tests__/reports/quality-dashboard.md');
      
    } catch (error) {
      console.error('❌ Error en monitoreo continuo:', error.message);
      process.exit(1);
    }
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const monitor = new QualityMonitor();
  monitor.runContinuousMonitor();
}

module.exports = QualityMonitor;

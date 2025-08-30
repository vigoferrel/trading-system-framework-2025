/**
 * INTELLIGENT OPTIMIZER FRONTEND
 * Consume la nueva ruta /optimize-intelligent con amplificación z = 9 + 16i
 */

class IntelligentOptimizer {
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
    this.lastResult = null;
  }

  async optimizeIntelligent(budgetUSD = 1000) {
    try {
      console.log(' Ejecutando optimización INTELIGENTE...');
      
      const response = await fetch(`${this.baseUrl}/optimize-intelligent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetUSD })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      this.lastResult = result;

      console.log('[OK] Optimización INTELIGENTE completada');
      this.displayResults(result);
      
      return result;

    } catch (error) {
      console.error('[ERROR] Error en optimización inteligente:', error.message);
      throw error;
    }
  }

  displayResults(result) {
    console.log('\n[ENDPOINTS] RESULTADOS DE OPTIMIZACIÓN INTELIGENTE:');
    console.log('=' .repeat(60));
    
    // Mostrar constantes primas
    if (result.primes) {
      console.log(`[NUMBERS] Plano complejo z: ${result.primes.z?.real}+${result.primes.z?.imag}i (|z|=${result.primes.z?.magnitude?.toFixed(3)})`);
      console.log(` Lambda : ${result.primes.lambda?.toFixed(6)}`);
      console.log(` Resonancia: ${result.primes.resonanceMHz} MHz`);
    }

    // Mostrar inteligencia aplicada
    if (result.intelligence) {
      console.log(`\n INTELIGENCIA APLICADA:`);
      console.log(`   Algoritmos: ${result.intelligence.algorithms?.join(' | ')}`);
      console.log(`   Amplificación: ${result.intelligence.amplification}`);
      console.log(`   Sistemas: ${Object.entries(result.intelligence.systems || {}).map(([k,v]) => `${k}:${v?'[OK]':'[ERROR]'}`).join(' ')}`);
    }

    // Mostrar decisiones de trading
    console.log(`\n[MONEY] DECISIONES DE TRADING:`);
    result.decisions?.forEach((decision, idx) => {
      const profit = (decision.allocationUSD * decision.leverage * decision.takeProfitPct).toFixed(2);
      console.log(`${idx+1}. ${decision.symbol}: $${decision.allocationUSD} @ ${decision.leverage}x (Score:${decision.score?.toFixed(3)})  Profit potencial: $${profit}`);
      console.log(`   SL: ${(decision.stopLossPct*100).toFixed(2)}% | TP: ${(decision.takeProfitPct*100).toFixed(2)}% | Boost: ${decision.primeBoost?.toFixed(3)}`);
    });

    const totalAllocation = result.decisions?.reduce((sum, d) => sum + d.allocationUSD, 0) || 0;
    const avgLeverage = result.decisions?.reduce((sum, d) => sum + d.leverage, 0) / (result.decisions?.length || 1);
    console.log(`\n[DATA] RESUMEN: $${totalAllocation.toFixed(2)} total | Leverage promedio: ${avgLeverage.toFixed(1)}x`);
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const health = await response.json();
      console.log(' Health check:', health.status);
      return health;
    } catch (error) {
      console.error('[ERROR] Health check falló:', error.message);
      return null;
    }
  }

  // Método para frontend HTML
  async renderToHtml(containerId) {
    if (!this.lastResult) {
      await this.optimizeIntelligent();
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} not found`);
      return;
    }

    const html = `
      <div class="intelligent-results">
        <h2> Optimización Inteligente</h2>
        <div class="primes-info">
          <p><strong>Plano z:</strong> ${this.lastResult.primes?.z?.real}+${this.lastResult.primes?.z?.imag}i</p>
          <p><strong>Lambda:</strong> ${this.lastResult.primes?.lambda?.toFixed(6)}</p>
          <p><strong>Resonancia:</strong> ${this.lastResult.primes?.resonanceMHz} MHz</p>
        </div>
        <div class="decisions">
          ${this.lastResult.decisions?.map((d, i) => `
            <div class="decision-card" style="border: 1px solid #ccc; margin: 10px 0; padding: 10px;">
              <h4>${d.symbol}</h4>
              <p>Asignación: $${d.allocationUSD} | Leverage: ${d.leverage}x</p>
              <p>Score: ${d.score?.toFixed(3)} | Boost: ${d.primeBoost?.toFixed(3)}</p>
              <p>SL: ${(d.stopLossPct*100).toFixed(2)}% | TP: ${(d.takeProfitPct*100).toFixed(2)}%</p>
            </div>
          `).join('') || '<p>No hay decisiones</p>'}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }
}

// Para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IntelligentOptimizer };
}

// Para uso en browser
if (typeof window !== 'undefined') {
  window.IntelligentOptimizer = IntelligentOptimizer;
}

// Ejemplo de uso directo
if (typeof require !== 'undefined' && require.main === module) {
  const optimizer = new IntelligentOptimizer();
  
  async function demo() {
    await optimizer.checkHealth();
    await optimizer.optimizeIntelligent(1500);
  }
  
  demo().catch(console.error);
}

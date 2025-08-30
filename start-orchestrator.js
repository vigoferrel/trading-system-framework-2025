#!/usr/bin/env node

/**
 * START-ORCHESTRATOR.JS - Script de arranque rápido
 * Configuración mínima para iniciar el LLM Gemini Supreme Orchestrator
 */

require('dotenv').config({ path: '.env' });
const path = require('path');

// Configurar NODE_PATH para resolver módulos locales si es necesario
if (!process.env.NODE_PATH) {
  process.env.NODE_PATH = __dirname;
}

async function quickStart() {
  console.log(' LLM GEMINI SUPREME ORCHESTRATOR - QUICK START');
  console.log('='.repeat(60));
  console.log('[RELOAD] Constantes primas integradas: z = 9 + 16i,  = ln(7919), 888 MHz');
  console.log('[ENDPOINTS] Optimización de portafolio multisímbolo con gestión de riesgo');
  console.log('[START] Control SRONA y workers cuánticos en background');
  console.log('');

  // Verificar dependencias críticas
  try {
    const express = require('express');
    console.log('[OK] Express disponible');
  } catch (e) {
    console.log('[WARNING]  Express no instalado, instalando...');
    require('child_process').execSync('npm install express', { stdio: 'inherit' });
  }

  // Variables de entorno por defecto para testing
  const defaults = {
    BUDGET_USD: '1000',
    PORT: '4602',
    AI_WEIGHT: '0.25',
    VIGO_WEIGHT: '0.25',
    CORE_WEIGHT: '0.50',
    CACHE_TTL_MS: '20000',
    PYTHON_BIN: 'python',
    LOGS_DIR: path.join(__dirname, 'logs'),
    RUN_TEST: 'true'
  };

  // Aplicar defaults solo si no están definidas
  for (const [key, value] of Object.entries(defaults)) {
    if (!process.env[key]) {
      process.env[key] = value;
      console.log(`[LIST] ${key} = ${value} (default)`);
    }
  }

  // Verificar APIs requeridas
  if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_API_SECRET) {
    console.log('');
    console.log('[WARNING]  BINANCE_API_KEY y BINANCE_API_SECRET requeridas');
    console.log('   Ejemplo en .env:');
    console.log('   BINANCE_API_KEY=tu_api_key_aqui');
    console.log('   BINANCE_API_SECRET=tu_api_secret_aqui');
    console.log('');
    console.log('[TEST] Continuando en modo TEST (sin APIs reales)...');
    process.env.BINANCE_API_KEY = 'test_key';
    process.env.BINANCE_API_SECRET = 'test_secret';
  }

  // Iniciar el orquestador
  try {
    const { main } = require('./orchestrator/deploy');
    const { orchestrator, logger, server } = await main();
    
    console.log('');
    console.log(' ORQUESTADOR INICIADO EXITOSAMENTE');
    console.log(`[API] API: http://localhost:${process.env.PORT}`);
    console.log('');
    console.log('[LIST] COMANDOS DE EJEMPLO:');
    console.log(`curl -X GET http://localhost:${process.env.PORT}/health`);
    console.log(`curl -X POST http://localhost:${process.env.PORT}/optimize-intelligent -H "Content-Type: application/json" -d '{"budgetUSD":1000}'`);
    console.log(`curl -X POST http://localhost:${process.env.PORT}/optimize-portfolio -H "Content-Type: application/json" -d '{"budgetUSD":1000}'`);
    console.log(`curl -X POST http://localhost:${process.env.PORT}/background/launch-srona`);
    console.log(`curl -X GET http://localhost:${process.env.PORT}/background/status`);
    
  } catch (error) {
    console.error('[ERROR] Error iniciando orquestador:', error.message);
    process.exit(1);
  }
}

// Función para mostrar ayuda
function showHelp() {
  console.log(`
 LLM GEMINI SUPREME ORCHESTRATOR - HELP
${'='.repeat(50)}

VARIABLES DE ENTORNO:
  BUDGET_USD=1000          # Presupuesto por defecto en USD
  PORT=3001               # Puerto del servidor API
  AI_WEIGHT=0.25          # Peso señales AI (0-1)
  VIGO_WEIGHT=0.25        # Peso señales Vigo (0-1)  
  CORE_WEIGHT=0.50        # Peso señales core cuánticas (0-1)
  CACHE_TTL_MS=20000      # TTL cache en milliseconds
  PYTHON_BIN=python       # Binario Python para SRONA
  BINANCE_API_KEY=...     # API Key de Binance
  BINANCE_API_SECRET=...  # API Secret de Binance
  RUN_TEST=true           # Ejecutar prueba inicial

COMANDOS:
  node start-orchestrator.js        # Arranque rápido
  node start-orchestrator.js --help # Esta ayuda
  node orchestrator/deploy.js       # Arranque directo

ESTRUCTURA:
  orchestrator/
     LLM_GEMINI_SUPREME_ORCHESTRATOR.js  # Orquestador principal
     deploy.js                           # Script de despliegue
  LeonardoLeverageMatrix.js                 # Gestión de riesgo y leverage
  workers/quantum-worker.js                 # Worker de scoring cuántico
  quantum/SRONA_*.py                        # Scripts Python SRONA

CONSTANTES PRIMAS:
  z = 9 + 16i            # Número complejo base
   = ln(7919)          # Frecuencia logarítmica
  888 MHz               # Resonancia cuántica
  9973                  # Primo para hashing
`);
}

// Ejecutar
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
  } else {
    quickStart().catch(console.error);
  }
}

module.exports = { quickStart, showHelp };

#!/usr/bin/env node
"use strict";

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Script para lanzar QBTC en segundo plano
 */
function startBackground() {
  console.log("🌌 Launching QBTC Quantum System in Background...");
  
  const logDir = path.join(__dirname, "..", "logs");
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const logFile = path.join(logDir, `qbtc-${Date.now()}.log`);
  const errorFile = path.join(logDir, `qbtc-error-${Date.now()}.log`);
  
  // Configurar archivo de logs
  const out = fs.openSync(logFile, 'a');
  const err = fs.openSync(errorFile, 'a');
  
  // Lanzar el dashboard en segundo plano
  const child = spawn('node', ['src/dashboard/start-dashboard.js'], {
    detached: true,
    stdio: ['ignore', out, err],
    cwd: path.join(__dirname, "..")
  });
  
  child.unref(); // Permite que el proceso padre termine
  
  // Guardar PID para control posterior
  const pidFile = path.join(logDir, "qbtc.pid");
  fs.writeFileSync(pidFile, child.pid.toString());
  
  console.log(`✅ QBTC System started in background`);
  console.log(`📊 Dashboard: http://localhost:8888`);
  console.log(`📁 Logs: ${logFile}`);
  console.log(`🆔 PID: ${child.pid} (saved to ${pidFile})`);
  console.log(`\n🎮 Control commands:`);
  console.log(`   View logs: Get-Content -Wait "${logFile}"`);
  console.log(`   Stop system: node scripts/stop-background.js`);
  console.log(`   Check status: node scripts/check-status.js`);
  
  return child.pid;
}

if (require.main === module) {
  startBackground();
}

module.exports = { startBackground };

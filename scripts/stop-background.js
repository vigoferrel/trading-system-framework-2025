#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Script para parar QBTC en segundo plano
 */
function stopBackground() {
  console.log("🛑 Stopping QBTC Quantum System...");
  
  const logDir = path.join(__dirname, "..", "logs");
  const pidFile = path.join(logDir, "qbtc.pid");
  
  if (!fs.existsSync(pidFile)) {
    console.log("❌ No PID file found. System may not be running.");
    return false;
  }
  
  const pid = fs.readFileSync(pidFile, 'utf8').trim();
  
  try {
    process.kill(parseInt(pid), 'SIGTERM');
    fs.unlinkSync(pidFile); // Remove PID file
    
    console.log(`✅ QBTC System stopped (PID: ${pid})`);
    console.log("📊 Dashboard is now offline");
    return true;
    
  } catch (error) {
    if (error.code === 'ESRCH') {
      console.log(`⚠️ Process ${pid} not found (may have already stopped)`);
      fs.unlinkSync(pidFile); // Clean up stale PID file
      return true;
    } else {
      console.error(`❌ Failed to stop process ${pid}:`, error.message);
      return false;
    }
  }
}

if (require.main === module) {
  stopBackground();
}

module.exports = { stopBackground };

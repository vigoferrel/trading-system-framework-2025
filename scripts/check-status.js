#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const axios = require("axios");

/**
 * Script para verificar el estado del sistema QBTC
 */
async function checkStatus() {
  console.log("🔍 Checking QBTC System Status...");
  
  const logDir = path.join(__dirname, "..", "logs");
  const pidFile = path.join(logDir, "qbtc.pid");
  
  // Verificar si hay un PID file
  if (!fs.existsSync(pidFile)) {
    console.log("❌ System is NOT running (no PID file found)");
    return { running: false, reason: "no_pid_file" };
  }
  
  const pid = fs.readFileSync(pidFile, 'utf8').trim();
  
  // Verificar si el proceso existe
  try {
    process.kill(parseInt(pid), 0); // Signal 0 = check existence
    console.log(`✅ Process is running (PID: ${pid})`);
  } catch (error) {
    if (error.code === 'ESRCH') {
      console.log(`❌ Process ${pid} not found (stale PID file)`);
      fs.unlinkSync(pidFile); // Clean up
      return { running: false, reason: "process_not_found" };
    }
  }
  
  // Verificar si el dashboard responde
  try {
    const response = await axios.get('http://localhost:8888/health', { 
      timeout: 5000 
    });
    
    if (response.status === 200) {
      console.log("🌐 Dashboard is responding");
      console.log(`📊 Dashboard URL: http://localhost:8888`);
      
      // Obtener métricas del sistema
      try {
        const statusResponse = await axios.get('http://localhost:8888/api/status');
        const metricsResponse = await axios.get('http://localhost:8888/api/metrics');
        
        console.log("\n📈 System Status:");
        console.log("  Running:", statusResponse.data.running);
        console.log("  Services:", statusResponse.data.services?.length || 0);
        console.log("  Quantum Health:", statusResponse.data.quantumHealth?.ok ? "OK" : "WARNING");
        
        if (statusResponse.data.binance) {
          console.log("  Binance Connected:", statusResponse.data.binance.connected);
          console.log("  Binance Testnet:", statusResponse.data.binance.testnet);
        }
        
        console.log("\n📊 Metrics:");
        if (metricsResponse.data.services?.integrated) {
          const metrics = metricsResponse.data.services.integrated;
          console.log("  Quantum Cycles:", metrics.quantumCycles || 0);
          console.log("  Signals Emitted:", metrics.signalsEmitted || 0);
          console.log("  Avg Latency:", (metrics.avgLatencyMs || 0) + "ms");
        }
        
      } catch (metricsError) {
        console.log("⚠️ Could not fetch detailed metrics");
      }
      
      return { 
        running: true, 
        pid: parseInt(pid), 
        dashboard: true,
        url: 'http://localhost:8888'
      };
    }
  } catch (httpError) {
    console.log("❌ Dashboard is not responding (HTTP error)");
    console.log("  Process running but dashboard may be starting up...");
    return { 
      running: true, 
      pid: parseInt(pid), 
      dashboard: false,
      reason: "dashboard_not_ready"
    };
  }
  
  return { running: true, pid: parseInt(pid), dashboard: true };
}

/**
 * Mostrar logs recientes
 */
function showRecentLogs(lines = 10) {
  const logDir = path.join(__dirname, "..", "logs");
  
  if (!fs.existsSync(logDir)) {
    console.log("📁 No log directory found");
    return;
  }
  
  const logFiles = fs.readdirSync(logDir)
    .filter(f => f.startsWith('qbtc-') && f.endsWith('.log'))
    .sort()
    .reverse();
  
  if (logFiles.length === 0) {
    console.log("📁 No log files found");
    return;
  }
  
  const latestLog = path.join(logDir, logFiles[0]);
  
  try {
    const content = fs.readFileSync(latestLog, 'utf8');
    const logLines = content.trim().split('\n').slice(-lines);
    
    console.log(`\n📜 Recent logs (last ${lines} lines from ${logFiles[0]}):`);
    console.log("─".repeat(60));
    logLines.forEach(line => console.log(line));
    console.log("─".repeat(60));
    
  } catch (error) {
    console.log("❌ Could not read log file:", error.message);
  }
}

if (require.main === module) {
  const showLogs = process.argv.includes('--logs');
  const logLines = process.argv.includes('--lines') ? 
    parseInt(process.argv[process.argv.indexOf('--lines') + 1]) || 10 : 10;
  
  checkStatus().then((status) => {
    if (showLogs) {
      showRecentLogs(logLines);
    }
    
    console.log("\n🎮 Available commands:");
    console.log("  Start: node scripts/start-background.js");
    console.log("  Stop:  node scripts/stop-background.js");
    console.log("  Logs:  node scripts/check-status.js --logs --lines 20");
    
  }).catch(console.error);
}

module.exports = { checkStatus, showRecentLogs };

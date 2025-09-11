#!/usr/bin/env node
"use strict";

const { QBTCMasterDashboardAPI } = require("./qbtc-master-dashboard-api");

/**
 * Startup script for the QBTC Unified Dashboard
 */
async function main() {
  console.log("🌌 Starting QBTC Quantum Unification Dashboard...");
  
  try {
    const dashboard = new QBTCMasterDashboardAPI({
      port: process.env.DASHBOARD_PORT || 8888,
      dimensions: 4  // Default quantum dimensions
    });
    
    await dashboard.initialize();
    await dashboard.start();
    
    console.log("✅ Dashboard started successfully!");
    console.log("🎯 Visit: http://localhost:8888");
    console.log("⚛️ WebSocket endpoint: ws://localhost:8888");
    console.log("\n🎮 Commands:");
    console.log("  - Ctrl+C to stop");
    console.log("  - Visit dashboard for system control");
    
  } catch (error) {
    console.error("❌ Failed to start dashboard:", error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down dashboard gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Received SIGTERM, shutting down...");
  process.exit(0);
});

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };

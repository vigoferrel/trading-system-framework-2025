#!/usr/bin/env node
"use strict";

const { IntegratedSystem } = require("../src/integrated-system");

/**
 * Test script for the unified integrated system
 */
async function main() {
  console.log("🚀 Starting QBTC Integrated System Test...");
  
  const system = new IntegratedSystem({ dimensions: 4 });
  
  // Setup event listeners
  system.on("initialized", (data) => {
    console.log("✅ System initialized:", data);
  });
  
  system.on("started", (data) => {
    console.log("🟢 System started:", data);
  });
  
  system.on("metrics", (data) => {
    console.log("📊 Metrics:", JSON.stringify(data, null, 2));
  });
  
  system.on("signals", (signals) => {
    console.log("📡 Trading signals:", signals);
  });
  
  system.on("error", (err) => {
    console.error("❌ System error:", err);
  });
  
  try {
    await system.initialize();
    await system.start();
    
    console.log("🎯 System running. Press Ctrl+C to stop.");
    
    // Keep running until interrupted
    process.on("SIGINT", async () => {
      console.log("\n🛑 Shutting down system...");
      await system.stop();
      console.log("👋 System stopped gracefully");
      process.exit(0);
    });
    
    // Periodic status updates
    setInterval(() => {
      const status = system.getStatus();
      console.log("📈 Status update:", {
        running: status.running,
        coherenceOk: status.quantumHealth.ok,
        cycles: status.metrics.quantumCycles
      });
    }, 30000);
    
  } catch (error) {
    console.error("💥 Failed to start system:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };

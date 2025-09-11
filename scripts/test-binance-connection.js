#!/usr/bin/env node
"use strict";

const { BinanceRealConnector } = require("../src/connectors/binance-real-connector");

/**
 * Script de prueba para validar conexión real a Binance
 */
async function testBinanceConnection() {
  console.log("🌌 Testing QBTC Binance Real Connection...");
  
  const binance = new BinanceRealConnector({
    testnet: true, // Usar testnet por seguridad
    symbols: ["BTCUSDT", "ETHUSDT", "BNBUSDT"]
  });
  
  // Setup event listeners
  binance.on("initializing", (data) => {
    console.log("🔄 Initializing Binance connector:", data);
  });
  
  binance.on("api_test_success", (data) => {
    console.log("✅ Binance API test successful:", data);
  });
  
  binance.on("ws_connected", (data) => {
    console.log("🔗 WebSocket connected:", data.url);
  });
  
  binance.on("ticker", (data) => {
    console.log("📈 Ticker update:", {
      symbol: data.symbol,
      price: data.price,
      change: data.priceChange + "%"
    });
  });
  
  binance.on("metrics", (metrics) => {
    console.log("📊 Binance metrics:", {
      connected: metrics.connected,
      messages: metrics.messagesReceived,
      uptime: Math.floor(metrics.uptime / 1000) + "s",
      symbols: metrics.symbolsTracked
    });
  });
  
  binance.on("error", (error) => {
    console.error("❌ Binance error:", error);
  });
  
  try {
    await binance.initialize();
    await binance.connect();
    
    console.log("🎯 Connected successfully! Monitoring for 15 seconds...");
    
    // Show connection status
    setTimeout(() => {
      const status = binance.getConnectionStatus();
      console.log("📈 Connection status:", status);
      
      const prices = binance.getAllPrices();
      console.log("💰 Current prices:", prices);
    }, 5000);
    
    // Disconnect after 15 seconds
    setTimeout(async () => {
      console.log("🛑 Disconnecting...");
      await binance.disconnect();
      console.log("👋 Test completed successfully!");
      process.exit(0);
    }, 15000);
    
  } catch (error) {
    console.error("💥 Connection failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testBinanceConnection().catch(console.error);
}

module.exports = { testBinanceConnection };

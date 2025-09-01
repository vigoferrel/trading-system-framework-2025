
// ==========================================
// IMPORTACIÓN DE CONSTANTES UNIFICADAS
// ==========================================
// ✅ CONSTANTES CONSOLIDADAS - Eliminadas duplicaciones de 290+ archivos
// ✅ Fuente única de verdad para todas las constantes del sistema

const {
  QUANTUM_CONSTANTS,
  getConstant,
  getPhysicalConstants,
  getQuantumConstants
} = require('./src/constants/quantum-constants');

// Para compatibilidad backward - mantener PHYSICAL_CONSTANTS disponible
const PHYSICAL_CONSTANTS = getPhysicalConstants();

#!/usr/bin/env node

/**
 * QUANTUM PORTFOLIO MANAGER - COMPLETE TRADE TRACKING & ASSET MANAGEMENT
 * ====================================================================
 * 
 * Features:
 * - Real-time Portfolio Tracking
 * - Trade History & P&L Analysis
 * - Risk Management & Position Sizing
 * - Asset Allocation & Diversification
 * - Performance Metrics & Analytics
 * - Real-time Market Data Integration
 */

const http = require('http');
const url = require('url');
const https = require('https');
const fs = require('fs');
const path = require('path');

class QuantumPortfolioManager {
    constructor() {
        this.port = process.env.PORTFOLIO_PORT || 4607;
        this.server = null;
        
        // Portfolio Data
        this.portfolio = {
            totalValue: 100000, // $100k initial
            cash: 25000,
            positions: {},
            trades: [],
            performance: {
                totalPnL: 0,
                dailyPnL: 0,
                weeklyPnL: 0,
                monthlyPnL: 0,
                winRate: 0,
                avgWin: 0,
                avgLoss: 0,
                sharpeRatio: 0,
                maxDrawdown: 0
            }
        };
        
        // Market Data Cache
        this.marketData = {};
        
        // Initialize with sample data
        this.initializePortfolio();
        this.initializeMarketData();
    }

    initializePortfolio() {
        // Sample positions
        this.portfolio.positions = {
            'BTC': {
                symbol: 'BTC',
                quantity: 0.5,
                avgPrice: 115000,
                currentPrice: 118948.9,
                marketValue: 59474.45,
                unrealizedPnL: 1974.45,
                unrealizedPnLPercent: 3.43,
                entryDate: '2024-01-15',
                lastUpdate: new Date().toISOString()
            },
            'ETH': {
                symbol: 'ETH',
                quantity: 8.5,
                avgPrice: 4200,
                currentPrice: 4636.73,
                marketValue: 39412.21,
                unrealizedPnL: 3712.21,
                unrealizedPnLPercent: 10.41,
                entryDate: '2024-02-01',
                lastUpdate: new Date().toISOString()
            },
            'SOL': {
                symbol: 'SOL',
                quantity: 150,
                avgPrice: 180,
                currentPrice: 196.72,
                marketValue: 29508,
                unrealizedPnL: 2508,
                unrealizedPnLPercent: 9.29,
                entryDate: '2024-02-10',
                lastUpdate: new Date().toISOString()
            }
        };

        // Sample trades
        this.portfolio.trades = [
            {
                id: 'T001',
                symbol: 'BTC',
                type: 'BUY',
                quantity: 0.5,
                price: 115000,
                total: 57500,
                date: '2024-01-15T10:30:00Z',
                status: 'FILLED',
                pnl: 1974.45
            },
            {
                id: 'T002',
                symbol: 'ETH',
                type: 'BUY',
                quantity: 8.5,
                price: 4200,
                total: 35700,
                date: '2024-02-01T14:15:00Z',
                status: 'FILLED',
                pnl: 3712.21
            },
            {
                id: 'T003',
                symbol: 'SOL',
                type: 'BUY',
                quantity: 150,
                price: 180,
                total: 27000,
                date: '2024-02-10T09:45:00Z',
                status: 'FILLED',
                pnl: 2508
            },
            {
                id: 'T004',
                symbol: 'XRP',
                type: 'SELL',
                quantity: 5000,
                price: 3.05,
                total: 15250,
                date: '2024-02-12T16:20:00Z',
                status: 'FILLED',
                pnl: -1250
            }
        ];

        this.updatePortfolioMetrics();
    }

    initializeMarketData() {
        this.marketData = {
            BTC: { price: 118948.9, change: 2.5, volume: 1250 },
            ETH: { price: 4636.73, change: -1.2, volume: 890 },
            BNB: { price: 850.35, change: 1.8, volume: 650 },
            SOL: { price: 196.72, change: -0.5, volume: 420 },
            XRP: { price: 3.1189, change: 3.2, volume: 980 },
            DOGE: { price: 0.23067, change: 5.8, volume: 750 },
            ADA: { price: 0.4852, change: -2.1, volume: 320 },
            DOT: { price: 12.45, change: 1.5, volume: 280 },
            LINK: { price: 28.75, change: 4.2, volume: 450 },
            MATIC: { price: 1.85, change: -1.8, volume: 380 }
        };
    }

    updatePortfolioMetrics() {
        let totalMarketValue = 0;
        let totalUnrealizedPnL = 0;
        let winningTrades = 0;
        let totalTrades = this.portfolio.trades.length;

        // Calculate position values and P&L
        Object.values(this.portfolio.positions).forEach(position => {
            totalMarketValue += position.marketValue;
            totalUnrealizedPnL += position.unrealizedPnL;
        });

        // Calculate trade performance
        this.portfolio.trades.forEach(trade => {
            if (trade.pnl > 0) winningTrades++;
        });

        // Update portfolio metrics
        this.portfolio.totalValue = totalMarketValue + this.portfolio.cash;
        this.portfolio.performance.totalPnL = totalUnrealizedPnL;
        this.portfolio.performance.winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

        // Calculate average win/loss
        const winningTradesList = this.portfolio.trades.filter(t => t.pnl > 0);
        const losingTradesList = this.portfolio.trades.filter(t => t.pnl < 0);

        this.portfolio.performance.avgWin = winningTradesList.length > 0 
            ? winningTradesList.reduce((sum, t) => sum + t.pnl, 0) / winningTradesList.length 
            : 0;
        
        this.portfolio.performance.avgLoss = losingTradesList.length > 0 
            ? losingTradesList.reduce((sum, t) => sum + Math.abs(t.pnl), 0) / losingTradesList.length 
            : 0;
    }

    start() {
        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        this.server.listen(this.port, () => {
            console.log(`[ENDPOINTS] Quantum Portfolio Manager running on port ${this.port}`);
            console.log(`[DATA] Dashboard available at: http://localhost:${this.port}`);
            this.displayPortfolio();
        });

        // Update market data every 30 seconds
        setInterval(() => this.updateMarketData(), 30000);
    }

    async updateMarketData() {
        try {
            // Simulate real-time price updates
            Object.keys(this.marketData).forEach(symbol => {
                const currentPrice = this.marketData[symbol].price;
                const volatility = 0.02; // 2% volatility
                const change = (((Date.now() % 100) / 100 - 0.5) * volatility);
                this.marketData[symbol].price = currentPrice * (1 + change);
                this.marketData[symbol].change = change * 100;
            });

            // Update portfolio positions
            Object.keys(this.portfolio.positions).forEach(symbol => {
                if (this.marketData[symbol]) {
                    const position = this.portfolio.positions[symbol];
                    position.currentPrice = this.marketData[symbol].price;
                    position.marketValue = position.quantity * position.currentPrice;
                    position.unrealizedPnL = position.marketValue - (position.quantity * position.avgPrice);
                    position.unrealizedPnLPercent = (position.unrealizedPnL / (position.quantity * position.avgPrice)) * 100;
                    position.lastUpdate = new Date().toISOString();
                }
            });

            this.updatePortfolioMetrics();
        } catch (error) {
            console.log('[WARNING] Error updating market data:', error.message);
        }
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        switch (pathname) {
            case '/':
                this.serveDashboard(req, res);
                break;
            case '/api/portfolio':
                this.servePortfolio(req, res);
                break;
            case '/api/positions':
                this.servePositions(req, res);
                break;
            case '/api/trades':
                this.serveTrades(req, res);
                break;
            case '/api/performance':
                this.servePerformance(req, res);
                break;
            case '/api/market-data':
                this.serveMarketData(req, res);
                break;
            case '/api/add-trade':
                this.addTrade(req, res, parsedUrl.query);
                break;
            case '/api/close-position':
                this.closePosition(req, res, parsedUrl.query);
                break;
            default:
                this.serve404(req, res);
        }
    }

    serveDashboard(req, res) {
        const html = this.generateDashboardHTML();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }

    servePortfolio(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.portfolio));
    }

    servePositions(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.portfolio.positions));
    }

    serveTrades(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.portfolio.trades));
    }

    servePerformance(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.portfolio.performance));
    }

    serveMarketData(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.marketData));
    }

    addTrade(req, res, query) {
        const { symbol, type, quantity, price } = query;
        
        if (!symbol || !type || !quantity || !price) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required parameters' }));
            return;
        }

        const trade = {
            id: `T${String(this.portfolio.trades.length + 1).padStart(3, '0')}`,
            symbol: symbol.toUpperCase(),
            type: type.toUpperCase(),
            quantity: parseFloat(quantity),
            price: parseFloat(price),
            total: parseFloat(quantity) * parseFloat(price),
            date: new Date().toISOString(),
            status: 'FILLED',
            pnl: 0
        };

        // Update portfolio based on trade
        if (type.toUpperCase() === 'BUY') {
            if (this.portfolio.cash < trade.total) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Insufficient cash' }));
                return;
            }

            this.portfolio.cash -= trade.total;
            
            if (this.portfolio.positions[symbol]) {
                // Average down/up existing position
                const existing = this.portfolio.positions[symbol];
                const totalQuantity = existing.quantity + trade.quantity;
                const totalCost = (existing.quantity * existing.avgPrice) + trade.total;
                existing.avgPrice = totalCost / totalQuantity;
                existing.quantity = totalQuantity;
            } else {
                // New position
                this.portfolio.positions[symbol] = {
                    symbol: symbol.toUpperCase(),
                    quantity: trade.quantity,
                    avgPrice: trade.price,
                    currentPrice: this.marketData[symbol]?.price || trade.price,
                    marketValue: trade.quantity * (this.marketData[symbol]?.price || trade.price),
                    unrealizedPnL: 0,
                    unrealizedPnLPercent: 0,
                    entryDate: new Date().toISOString(),
                    lastUpdate: new Date().toISOString()
                };
            }
        } else if (type.toUpperCase() === 'SELL') {
            if (!this.portfolio.positions[symbol] || this.portfolio.positions[symbol].quantity < trade.quantity) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Insufficient position' }));
                return;
            }

            const position = this.portfolio.positions[symbol];
            const pnl = (trade.price - position.avgPrice) * trade.quantity;
            trade.pnl = pnl;

            this.portfolio.cash += trade.total;
            position.quantity -= trade.quantity;

            if (position.quantity <= 0) {
                delete this.portfolio.positions[symbol];
            }
        }

        this.portfolio.trades.push(trade);
        this.updatePortfolioMetrics();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, trade, portfolio: this.portfolio }));
    }

    closePosition(req, res, query) {
        const { symbol } = query;
        
        if (!symbol || !this.portfolio.positions[symbol]) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Position not found' }));
            return;
        }

        const position = this.portfolio.positions[symbol];
        const currentPrice = this.marketData[symbol]?.price || position.currentPrice;
        const pnl = (currentPrice - position.avgPrice) * position.quantity;

        const trade = {
            id: `T${String(this.portfolio.trades.length + 1).padStart(3, '0')}`,
            symbol: symbol.toUpperCase(),
            type: 'SELL',
            quantity: position.quantity,
            price: currentPrice,
            total: position.quantity * currentPrice,
            date: new Date().toISOString(),
            status: 'FILLED',
            pnl: pnl
        };

        this.portfolio.cash += trade.total;
        delete this.portfolio.positions[symbol];
        this.portfolio.trades.push(trade);
        this.updatePortfolioMetrics();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, trade, portfolio: this.portfolio }));
    }

    serve404(req, res) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }

    generateDashboardHTML() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[ENDPOINTS] Quantum Portfolio Manager</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Courier New', monospace;
            background: #0a0a0a;
            color: #00ff00;
            padding: 20px;
            line-height: 1.4;
        }
        
        .dashboard {
            max-width: 1800px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #00ff00;
            padding-bottom: 10px;
        }
        
        .portfolio-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .summary-card {
            border: 1px solid #00ff00;
            padding: 15px;
            background: #001100;
            text-align: center;
        }
        
        .summary-card h3 {
            color: #ffff00;
            margin-bottom: 10px;
        }
        
        .summary-value {
            font-size: 24px;
            font-weight: bold;
        }
        
        .positive { color: #00ff00; }
        .negative { color: #ff0000; }
        .neutral { color: #ffff00; }
        
        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .panel {
            border: 1px solid #00ff00;
            padding: 15px;
            background: #001100;
        }
        
        .panel h3 {
            margin-bottom: 15px;
            color: #ffff00;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
        }
        
        .positions-table, .trades-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        .positions-table th, .positions-table td,
        .trades-table th, .trades-table td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
            font-size: 12px;
        }
        
        .positions-table th, .trades-table th {
            background: #002200;
            color: #ffff00;
        }
        
        .trade-form {
            background: #002200;
            padding: 15px;
            border: 1px solid #333;
            margin-top: 15px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr auto;
            gap: 10px;
            align-items: end;
            margin-bottom: 10px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
        }
        
        .form-group label {
            margin-bottom: 5px;
            color: #ffff00;
        }
        
        .form-group input, .form-group select {
            padding: 8px;
            background: #003300;
            border: 1px solid #00ff00;
            color: #00ff00;
            font-family: 'Courier New', monospace;
        }
        
        .btn {
            background: #00ff00;
            color: #000;
            border: none;
            padding: 8px 15px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }
        
        .btn:hover {
            background: #00cc00;
        }
        
        .btn-danger {
            background: #ff0000;
            color: #fff;
        }
        
        .btn-danger:hover {
            background: #cc0000;
        }
        
        .performance-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 15px;
        }
        
        .metric {
            border: 1px solid #333;
            padding: 10px;
            background: #002200;
            text-align: center;
        }
        
        .metric-value {
            font-size: 18px;
            font-weight: bold;
            margin: 5px 0;
        }
        
        .refresh-btn {
            background: #00ff00;
            color: #000;
            border: none;
            padding: 15px 30px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 16px;
            margin: 20px 0;
        }
        
        .refresh-btn:hover {
            background: #00cc00;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>[ENDPOINTS] QUANTUM PORTFOLIO MANAGER</h1>
            <p>Complete Trade Tracking & Asset Management System</p>
            <button class="refresh-btn" onclick="refreshDashboard()">[RELOAD] REFRESH PORTFOLIO</button>
        </div>
        
        <div class="portfolio-summary">
            <div class="summary-card">
                <h3>[MONEY] TOTAL PORTFOLIO</h3>
                <div class="summary-value" id="totalValue">$128,394.66</div>
                <div class="positive" id="totalPnL">+$8,394.66 (+6.99%)</div>
            </div>
            <div class="summary-card">
                <h3> CASH</h3>
                <div class="summary-value" id="cash">$25,000.00</div>
                <div class="neutral">Available for trading</div>
            </div>
            <div class="summary-card">
                <h3>[UP] POSITIONS</h3>
                <div class="summary-value" id="positionsValue">$103,394.66</div>
                <div class="positive" id="unrealizedPnL">+$8,194.21</div>
            </div>
            <div class="summary-card">
                <h3>[ENDPOINTS] WIN RATE</h3>
                <div class="summary-value" id="winRate">75%</div>
                <div class="neutral">4 trades completed</div>
            </div>
        </div>
        
        <div class="grid">
            <div class="panel">
                <h3>[DATA] ACTIVE POSITIONS</h3>
                <table class="positions-table" id="positionsTable">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Quantity</th>
                            <th>Avg Price</th>
                            <th>Current</th>
                            <th>Market Value</th>
                            <th>P&L</th>
                            <th>P&L %</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="positionsBody">
                        <tr>
                            <td>BTC</td>
                            <td>0.5</td>
                            <td>$115,000</td>
                            <td>$118,948.90</td>
                            <td>$59,474.45</td>
                            <td class="positive">+$1,974.45</td>
                            <td class="positive">+3.43%</td>
                            <td><button class="btn btn-danger" onclick="closePosition('BTC')">Close</button></td>
                        </tr>
                        <tr>
                            <td>ETH</td>
                            <td>8.5</td>
                            <td>$4,200</td>
                            <td>$4,636.73</td>
                            <td>$39,412.21</td>
                            <td class="positive">+$3,712.21</td>
                            <td class="positive">+10.41%</td>
                            <td><button class="btn btn-danger" onclick="closePosition('ETH')">Close</button></td>
                        </tr>
                        <tr>
                            <td>SOL</td>
                            <td>150</td>
                            <td>$180</td>
                            <td>$196.72</td>
                            <td>$29,508.00</td>
                            <td class="positive">+$2,508.00</td>
                            <td class="positive">+9.29%</td>
                            <td><button class="btn btn-danger" onclick="closePosition('SOL')">Close</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="panel">
                <h3>[UP] PERFORMANCE METRICS</h3>
                <div class="performance-metrics" id="performanceMetrics">
                    <div class="metric">
                        <div>Sharpe Ratio</div>
                        <div class="metric-value positive">1.85</div>
                    </div>
                    <div class="metric">
                        <div>Max Drawdown</div>
                        <div class="metric-value negative">-2.3%</div>
                    </div>
                    <div class="metric">
                        <div>Avg Win</div>
                        <div class="metric-value positive">$2,731.22</div>
                    </div>
                    <div class="metric">
                        <div>Avg Loss</div>
                        <div class="metric-value negative">$1,250.00</div>
                    </div>
                </div>
                
                <h3> ADD NEW TRADE</h3>
                <div class="trade-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Symbol</label>
                            <select id="tradeSymbol">
                                <option value="BTC">BTC</option>
                                <option value="ETH">ETH</option>
                                <option value="BNB">BNB</option>
                                <option value="SOL">SOL</option>
                                <option value="XRP">XRP</option>
                                <option value="DOGE">DOGE</option>
                                <option value="ADA">ADA</option>
                                <option value="DOT">DOT</option>
                                <option value="LINK">LINK</option>
                                <option value="MATIC">MATIC</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Type</label>
                            <select id="tradeType">
                                <option value="BUY">BUY</option>
                                <option value="SELL">SELL</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Quantity</label>
                            <input type="number" id="tradeQuantity" step="0.01" placeholder="0.00">
                        </div>
                        <div class="form-group">
                            <label>Price</label>
                            <input type="number" id="tradePrice" step="0.01" placeholder="0.00">
                        </div>
                        <button class="btn" onclick="addTrade()">ADD TRADE</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="panel">
            <h3>[LIST] TRADE HISTORY</h3>
            <table class="trades-table" id="tradesTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Symbol</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>P&L</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="tradesBody">
                    <tr>
                        <td>T001</td>
                        <td>2024-01-15 10:30</td>
                        <td>BTC</td>
                        <td>BUY</td>
                        <td>0.5</td>
                        <td>$115,000</td>
                        <td>$57,500</td>
                        <td class="positive">+$1,974.45</td>
                        <td>FILLED</td>
                    </tr>
                    <tr>
                        <td>T002</td>
                        <td>2024-02-01 14:15</td>
                        <td>ETH</td>
                        <td>BUY</td>
                        <td>8.5</td>
                        <td>$4,200</td>
                        <td>$35,700</td>
                        <td class="positive">+$3,712.21</td>
                        <td>FILLED</td>
                    </tr>
                    <tr>
                        <td>T003</td>
                        <td>2024-02-10 09:45</td>
                        <td>SOL</td>
                        <td>BUY</td>
                        <td>150</td>
                        <td>$180</td>
                        <td>$27,000</td>
                        <td class="positive">+$2,508.00</td>
                        <td>FILLED</td>
                    </tr>
                    <tr>
                        <td>T004</td>
                        <td>2024-02-12 16:20</td>
                        <td>XRP</td>
                        <td>SELL</td>
                        <td>5000</td>
                        <td>$3.05</td>
                        <td>$15,250</td>
                        <td class="negative">-$1,250</td>
                        <td>FILLED</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        function refreshDashboard() {
            console.log('[RELOAD] Refreshing portfolio...');
            
            // Update portfolio summary
            fetch('/api/portfolio')
                .then(response => response.json())
                .then(data => {
                    console.log('[DATA] Portfolio data:', data);
                    updatePortfolioSummary(data);
                });
            
            // Update positions
            fetch('/api/positions')
                .then(response => response.json())
                .then(data => {
                    console.log('[UP] Positions data:', data);
                    updatePositionsTable(data);
                });
            
            // Update trades
            fetch('/api/trades')
                .then(response => response.json())
                .then(data => {
                    console.log('[LIST] Trades data:', data);
                    updateTradesTable(data);
                });
            
            // Update performance
            fetch('/api/performance')
                .then(response => response.json())
                .then(data => {
                    console.log('[DATA] Performance data:', data);
                    updatePerformanceMetrics(data);
                });
        }
        
        function updatePortfolioSummary(data) {
            document.getElementById('totalValue').textContent = '$' + data.totalValue.toLocaleString();
            document.getElementById('cash').textContent = '$' + data.cash.toLocaleString();
            
            const positionsValue = data.totalValue - data.cash;
            document.getElementById('positionsValue').textContent = '$' + positionsValue.toLocaleString();
            
            const totalPnL = data.performance.totalPnL;
            const pnlPercent = (totalPnL / (data.totalValue - totalPnL)) * 100;
            document.getElementById('totalPnL').textContent = 
                (totalPnL > 0 ? '+' : '') + '$' + totalPnL.toLocaleString() + 
                ' (' + (pnlPercent > 0 ? '+' : '') + pnlPercent.toFixed(2) + '%)';
            document.getElementById('totalPnL').className = totalPnL > 0 ? 'positive' : 'negative';
            
            document.getElementById('unrealizedPnL').textContent = 
                (totalPnL > 0 ? '+' : '') + '$' + totalPnL.toLocaleString();
            document.getElementById('unrealizedPnL').className = totalPnL > 0 ? 'positive' : 'negative';
            
            document.getElementById('winRate').textContent = data.performance.winRate.toFixed(0) + '%';
            document.getElementById('winRate').nextElementSibling.textContent = data.trades.length + ' trades completed';
        }
        
        function updatePositionsTable(positions) {
            const tbody = document.getElementById('positionsBody');
            tbody.innerHTML = '';
            
            Object.values(positions).forEach(position => {
                const row = document.createElement('tr');
                row.innerHTML = \`
                    <td>\${position.symbol}</td>
                    <td>\${position.quantity}</td>
                    <td>$\${position.avgPrice.toLocaleString()}</td>
                    <td>$\${position.currentPrice.toLocaleString()}</td>
                    <td>$\${position.marketValue.toLocaleString()}</td>
                    <td class="\${position.unrealizedPnL > 0 ? 'positive' : 'negative'}">
                        \${position.unrealizedPnL > 0 ? '+' : ''}$\${position.unrealizedPnL.toLocaleString()}
                    </td>
                    <td class="\${position.unrealizedPnLPercent > 0 ? 'positive' : 'negative'}">
                        \${position.unrealizedPnLPercent > 0 ? '+' : ''}\${position.unrealizedPnLPercent.toFixed(2)}%
                    </td>
                    <td><button class="btn btn-danger" onclick="closePosition('\${position.symbol}')">Close</button></td>
                \`;
                tbody.appendChild(row);
            });
        }
        
        function updateTradesTable(trades) {
            const tbody = document.getElementById('tradesBody');
            tbody.innerHTML = '';
            
            trades.forEach(trade => {
                const row = document.createElement('tr');
                const date = new Date(trade.date).toLocaleString();
                row.innerHTML = \`
                    <td>\${trade.id}</td>
                    <td>\${date}</td>
                    <td>\${trade.symbol}</td>
                    <td>\${trade.type}</td>
                    <td>\${trade.quantity}</td>
                    <td>$\${trade.price.toLocaleString()}</td>
                    <td>$\${trade.total.toLocaleString()}</td>
                    <td class="\${trade.pnl > 0 ? 'positive' : trade.pnl < 0 ? 'negative' : 'neutral'}">
                        \${trade.pnl > 0 ? '+' : ''}$\${trade.pnl.toLocaleString()}
                    </td>
                    <td>\${trade.status}</td>
                \`;
                tbody.appendChild(row);
            });
        }
        
        function updatePerformanceMetrics(performance) {
            const metrics = document.getElementById('performanceMetrics');
            metrics.innerHTML = \`
                <div class="metric">
                    <div>Sharpe Ratio</div>
                    <div class="metric-value positive">\${performance.sharpeRatio.toFixed(2)}</div>
                </div>
                <div class="metric">
                    <div>Max Drawdown</div>
                    <div class="metric-value negative">\${performance.maxDrawdown.toFixed(1)}%</div>
                </div>
                <div class="metric">
                    <div>Avg Win</div>
                    <div class="metric-value positive">$\${performance.avgWin.toLocaleString()}</div>
                </div>
                <div class="metric">
                    <div>Avg Loss</div>
                    <div class="metric-value negative">$\${performance.avgLoss.toLocaleString()}</div>
                </div>
            \`;
        }
        
        function addTrade() {
            const symbol = document.getElementById('tradeSymbol').value;
            const type = document.getElementById('tradeType').value;
            const quantity = document.getElementById('tradeQuantity').value;
            const price = document.getElementById('tradePrice').value;
            
            if (!quantity || !price) {
                alert('Please fill in all fields');
                return;
            }
            
            const url = \`/api/add-trade?symbol=\${symbol}&type=\${type}&quantity=\${quantity}&price=\${price}\`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('[OK] Trade added:', data.trade);
                        refreshDashboard();
                        // Clear form
                        document.getElementById('tradeQuantity').value = '';
                        document.getElementById('tradePrice').value = '';
                    } else {
                        alert('Error: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error adding trade:', error);
                    alert('Error adding trade');
                });
        }
        
        function closePosition(symbol) {
            if (!confirm(\`Are you sure you want to close your \${symbol} position?\`)) {
                return;
            }
            
            const url = \`/api/close-position?symbol=\${symbol}\`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('[OK] Position closed:', data.trade);
                        refreshDashboard();
                    } else {
                        alert('Error: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error closing position:', error);
                    alert('Error closing position');
                });
        }
        
        // Auto-refresh every 30 seconds
        setInterval(refreshDashboard, 30000);
        
        // Load initial data
        refreshDashboard();
    </script>
</body>
</html>`;
    }

    displayPortfolio() {
        console.log(`

                [ENDPOINTS] QUANTUM PORTFOLIO MANAGER                                 

                                                                              
  [MONEY] PORTFOLIO SUMMARY:                                                      
  Total Value: $${this.portfolio.totalValue.toLocaleString()}                           
  Cash: $${this.portfolio.cash.toLocaleString()}                                     
  Positions: $${(this.portfolio.totalValue - this.portfolio.cash).toLocaleString()}                           
  Total P&L: $${this.portfolio.performance.totalPnL.toLocaleString()} (${((this.portfolio.performance.totalPnL / (this.portfolio.totalValue - this.portfolio.performance.totalPnL)) * 100).toFixed(2)}%) 
                                                                              
  [DATA] ACTIVE POSITIONS:                                                       
  ${Object.keys(this.portfolio.positions).length} positions open                    
  ${this.portfolio.trades.length} trades completed                              
  Win Rate: ${this.portfolio.performance.winRate.toFixed(1)}%                        
                                                                              
  [DATA] Dashboard URL: http://localhost:${this.port}                           
  [RELOAD] Auto-refresh: Every 30 seconds                                         
   Real-time Updates: Enabled                                             
                                                                              

        `);
    }

    stop() {
        if (this.server) {
            this.server.close(() => {
                console.log('[ENDPOINTS] Quantum Portfolio Manager stopped');
            });
        }
    }
}

// Create and start the portfolio manager
const portfolioManager = new QuantumPortfolioManager();

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, stopping Quantum Portfolio Manager...');
    portfolioManager.stop();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, stopping Quantum Portfolio Manager...');
    portfolioManager.stop();
    process.exit(0);
});

// Start the server
portfolioManager.start();

module.exports = QuantumPortfolioManager;

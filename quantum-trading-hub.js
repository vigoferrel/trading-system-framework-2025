
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
 * QUANTUM TRADING HUB - UNIFIED TRADING INTERFACE
 * ===============================================
 * 
 * Features:
 * - Unified Dashboard with Sidebar Navigation
 * - Portfolio Management
 * - Trading Interface
 * - Sentiment Analysis
 * - Analytics & Risk Management
 * - Real-time Updates
 */

const http = require('http');
const url = require('url');
const https = require('https');
const fs = require('fs');
const path = require('path');

class QuantumTradingHub {
    constructor() {
        this.port = process.env.HUB_PORT || 4600;
        this.server = null;
        
        // Hub State
        this.currentModule = 'dashboard';
        this.systemStatus = {
            core: { status: 'online', port: 4601 },
            frontend: { status: 'online', port: 4602 },
            monitor: { status: 'online', port: 8082 },
            portfolio: { status: 'online', port: 4607 }
        };
        
        // Portfolio Data
        this.portfolio = {
            totalValue: 100000,
            cash: 25000,
            positions: {},
            trades: [],
            performance: {
                totalPnL: 0,
                winRate: 0,
                sharpeRatio: 1.85,
                maxDrawdown: -2.3
            }
        };
        
        // Market Data
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
        
        // Sentiment Data
        this.sentimentData = {
            overall: 65.5,
            social: 72.3,
            news: 58.7,
            technical: 68.9,
            quantum: 74.2
        };
        
        this.initializeData();
    }

    initializeData() {
        // Initialize portfolio positions
        this.portfolio.positions = {
            'BTC': {
                symbol: 'BTC',
                quantity: 0.5,
                avgPrice: 115000,
                currentPrice: 118948.9,
                marketValue: 59474.45,
                unrealizedPnL: 1974.45,
                unrealizedPnLPercent: 3.43
            },
            'ETH': {
                symbol: 'ETH',
                quantity: 8.5,
                avgPrice: 4200,
                currentPrice: 4636.73,
                marketValue: 39412.21,
                unrealizedPnL: 3712.21,
                unrealizedPnLPercent: 10.41
            },
            'SOL': {
                symbol: 'SOL',
                quantity: 150,
                avgPrice: 180,
                currentPrice: 196.72,
                marketValue: 29508,
                unrealizedPnL: 2508,
                unrealizedPnLPercent: 9.29
            }
        };

        // Initialize trades
        this.portfolio.trades = [
            {
                id: 'T001',
                symbol: 'BTC',
                type: 'BUY',
                quantity: 0.5,
                price: 115000,
                total: 57500,
                date: '2024-01-15T10:30:00Z',
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
                pnl: 3712.21
            }
        ];

        this.updatePortfolioMetrics();
    }

    updatePortfolioMetrics() {
        let totalMarketValue = 0;
        let totalUnrealizedPnL = 0;
        let winningTrades = 0;

        Object.values(this.portfolio.positions).forEach(position => {
            totalMarketValue += position.marketValue;
            totalUnrealizedPnL += position.unrealizedPnL;
        });

        this.portfolio.trades.forEach(trade => {
            if (trade.pnl > 0) winningTrades++;
        });

        this.portfolio.totalValue = totalMarketValue + this.portfolio.cash;
        this.portfolio.performance.totalPnL = totalUnrealizedPnL;
        this.portfolio.performance.winRate = this.portfolio.trades.length > 0 ? 
            (winningTrades / this.portfolio.trades.length) * 100 : 0;
    }

    start() {
        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        this.server.listen(this.port, () => {
            console.log(`[ENDPOINTS] Quantum Trading Hub running on port ${this.port}`);
            console.log(`[DATA] Unified Dashboard: http://localhost:${this.port}`);
            this.displayHub();
        });

        // Update data every 30 seconds
        setInterval(() => this.updateData(), 30000);
    }

    async updateData() {
        try {
            // Simulate real-time updates
            Object.keys(this.marketData).forEach(symbol => {
                const currentPrice = this.marketData[symbol].price;
                const volatility = 0.02;
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
                }
            });

            this.updatePortfolioMetrics();
        } catch (error) {
            console.log('[WARNING] Error updating data:', error.message);
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
            case '/api/market-data':
                this.serveMarketData(req, res);
                break;
            case '/api/sentiment':
                this.serveSentiment(req, res);
                break;
            case '/api/system-status':
                this.serveSystemStatus(req, res);
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

    serveMarketData(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.marketData));
    }

    serveSentiment(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.sentimentData));
    }

    serveSystemStatus(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.systemStatus));
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
            pnl: 0
        };

        if (type.toUpperCase() === 'BUY') {
            if (this.portfolio.cash < trade.total) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Insufficient cash' }));
                return;
            }

            this.portfolio.cash -= trade.total;
            
            if (this.portfolio.positions[symbol]) {
                const existing = this.portfolio.positions[symbol];
                const totalQuantity = existing.quantity + trade.quantity;
                const totalCost = (existing.quantity * existing.avgPrice) + trade.total;
                existing.avgPrice = totalCost / totalQuantity;
                existing.quantity = totalQuantity;
            } else {
                this.portfolio.positions[symbol] = {
                    symbol: symbol.toUpperCase(),
                    quantity: trade.quantity,
                    avgPrice: trade.price,
                    currentPrice: this.marketData[symbol]?.price || trade.price,
                    marketValue: trade.quantity * (this.marketData[symbol]?.price || trade.price),
                    unrealizedPnL: 0,
                    unrealizedPnLPercent: 0
                };
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
    <title>[ENDPOINTS] Quantum Trading Hub</title>
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
            display: flex;
            height: 100vh;
            overflow: hidden;
        }
        
        .sidebar {
            width: 250px;
            background: #001100;
            border-right: 2px solid #00ff00;
            padding: 20px 0;
            overflow-y: auto;
        }
        
        .sidebar-header {
            text-align: center;
            padding: 0 20px 20px;
            border-bottom: 1px solid #333;
            margin-bottom: 20px;
        }
        
        .sidebar-menu {
            list-style: none;
        }
        
        .sidebar-menu li {
            margin-bottom: 5px;
        }
        
        .sidebar-menu a {
            display: block;
            padding: 12px 20px;
            color: #00ff00;
            text-decoration: none;
            border-left: 3px solid transparent;
            transition: all 0.3s;
        }
        
        .sidebar-menu a:hover,
        .sidebar-menu a.active {
            background: #002200;
            border-left-color: #00ff00;
        }
        
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .top-bar {
            background: #001100;
            border-bottom: 1px solid #00ff00;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .content-area {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }
        
        .module {
            display: none;
        }
        
        .module.active {
            display: block;
        }
        
        .status-bar {
            background: #001100;
            border-top: 1px solid #00ff00;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }
        
        .status-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .status-online { color: #00ff00; }
        .status-offline { color: #ff0000; }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
        
        .summary-card {
            border: 1px solid #00ff00;
            padding: 15px;
            background: #001100;
            text-align: center;
            margin-bottom: 15px;
        }
        
        .summary-value {
            font-size: 24px;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .positive { color: #00ff00; }
        .negative { color: #ff0000; }
        .neutral { color: #ffff00; }
        
        .btn {
            background: #00ff00;
            color: #000;
            border: none;
            padding: 8px 15px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            margin: 5px;
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
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
            font-size: 12px;
        }
        
        th {
            background: #002200;
            color: #ffff00;
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
        
        .refresh-btn {
            background: #00ff00;
            color: #000;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        }
        
        .refresh-btn:hover {
            background: #00cc00;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            <h2>[ENDPOINTS] QUANTUM HUB</h2>
            <p>Unified Trading Interface</p>
        </div>
        
        <ul class="sidebar-menu">
            <li><a href="#" class="active" onclick="showModule('dashboard')">[DATA] Dashboard</a></li>
            <li><a href="#" onclick="showModule('portfolio')">[MONEY] Portfolio</a></li>
            <li><a href="#" onclick="showModule('trading')">[UP] Trading</a></li>
            <li><a href="#" onclick="showModule('sentiment')">[ENDPOINTS] Sentiment</a></li>
            <li><a href="#" onclick="showModule('analytics')">[DATA] Analytics</a></li>
            <li><a href="#" onclick="showModule('settings')"> Settings</a></li>
        </ul>
    </div>
    
    <div class="main-content">
        <div class="top-bar">
            <h1 id="moduleTitle">[DATA] DASHBOARD OVERVIEW</h1>
            <button class="refresh-btn" onclick="refreshData()">[RELOAD] REFRESH</button>
        </div>
        
        <div class="content-area">
            <!-- Dashboard Module -->
            <div id="dashboard" class="module active">
                <div class="grid">
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
                        <div class="neutral">2 trades completed</div>
                    </div>
                </div>
                
                <div class="grid">
                    <div class="panel">
                        <h3>[DATA] ACTIVE POSITIONS</h3>
                        <table id="positionsTable">
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
                        <h3>[UP] MARKET OVERVIEW</h3>
                        <table id="marketTable">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Price</th>
                                    <th>Change</th>
                                    <th>Volume</th>
                                </tr>
                            </thead>
                            <tbody id="marketBody">
                                <tr>
                                    <td>BTC</td>
                                    <td>$118,948.90</td>
                                    <td class="positive">+2.5%</td>
                                    <td>1,250</td>
                                </tr>
                                <tr>
                                    <td>ETH</td>
                                    <td>$4,636.73</td>
                                    <td class="negative">-1.2%</td>
                                    <td>890</td>
                                </tr>
                                <tr>
                                    <td>SOL</td>
                                    <td>$196.72</td>
                                    <td class="negative">-0.5%</td>
                                    <td>420</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Portfolio Module -->
            <div id="portfolio" class="module">
                <div class="panel">
                    <h3> ADD NEW TRADE</h3>
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
                
                <div class="panel">
                    <h3>[LIST] TRADE HISTORY</h3>
                    <table id="tradesTable">
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
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Trading Module -->
            <div id="trading" class="module">
                <div class="panel">
                    <h3>[UP] REAL-TIME MARKET DATA</h3>
                    <div id="marketDataContent">
                        <p>Real-time market data will be displayed here...</p>
                    </div>
                </div>
            </div>
            
            <!-- Sentiment Module -->
            <div id="sentiment" class="module">
                <div class="panel">
                    <h3>[ENDPOINTS] MARKET SENTIMENT</h3>
                    <div id="sentimentContent">
                        <p>Sentiment analysis will be displayed here...</p>
                    </div>
                </div>
            </div>
            
            <!-- Analytics Module -->
            <div id="analytics" class="module">
                <div class="panel">
                    <h3>[DATA] PERFORMANCE ANALYTICS</h3>
                    <div id="analyticsContent">
                        <p>Performance analytics will be displayed here...</p>
                    </div>
                </div>
            </div>
            
            <!-- Settings Module -->
            <div id="settings" class="module">
                <div class="panel">
                    <h3> SYSTEM SETTINGS</h3>
                    <div id="settingsContent">
                        <p>System settings will be displayed here...</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="status-bar">
            <div class="status-item">
                <span class="status-online"></span>
                <span>Core: Online</span>
            </div>
            <div class="status-item">
                <span class="status-online"></span>
                <span>API: Online</span>
            </div>
            <div class="status-item">
                <span class="status-online"></span>
                <span>Monitor: Online</span>
            </div>
            <div class="status-item">
                <span>Last Update: <span id="lastUpdate">${new Date().toLocaleTimeString()}</span></span>
            </div>
        </div>
    </div>

    <script>
        function showModule(moduleName) {
            // Hide all modules
            document.querySelectorAll('.module').forEach(module => {
                module.classList.remove('active');
            });
            
            // Show selected module
            document.getElementById(moduleName).classList.add('active');
            
            // Update active menu item
            document.querySelectorAll('.sidebar-menu a').forEach(link => {
                link.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Update title
            const titles = {
                'dashboard': '[DATA] DASHBOARD OVERVIEW',
                'portfolio': '[MONEY] PORTFOLIO MANAGEMENT',
                'trading': '[UP] TRADING INTERFACE',
                'sentiment': '[ENDPOINTS] SENTIMENT ANALYSIS',
                'analytics': '[DATA] ANALYTICS & RISK',
                'settings': ' SYSTEM SETTINGS'
            };
            document.getElementById('moduleTitle').textContent = titles[moduleName];
        }
        
        function refreshData() {
            console.log('[RELOAD] Refreshing data...');
            
            // Update portfolio data
            fetch('/api/portfolio')
                .then(response => response.json())
                .then(data => {
                    updatePortfolioSummary(data);
                });
            
            // Update market data
            fetch('/api/market-data')
                .then(response => response.json())
                .then(data => {
                    updateMarketData(data);
                });
            
            // Update last update time
            document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
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
        
        function updateMarketData(data) {
            const tbody = document.getElementById('marketBody');
            tbody.innerHTML = '';
            
            Object.entries(data).forEach(([symbol, info]) => {
                const row = document.createElement('tr');
                row.innerHTML = \`
                    <td>\${symbol}</td>
                    <td>${\${info.price.toLocaleString()}}</td>
                    <td class="\${info.change > 0 ? 'positive' : 'negative'}">
                        \${info.change > 0 ? '+' : ''}\${info.change.toFixed(1)}%
                    </td>
                    <td>\${info.volume.toLocaleString()}</td>
                \`;
                tbody.appendChild(row);
            });
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
                        refreshData();
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
                        refreshData();
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
        setInterval(refreshData, 30000);
        
        // Load initial data
        refreshData();
    </script>
</body>
</html>`;
    }

    displayHub() {
        console.log(`

                [ENDPOINTS] QUANTUM TRADING HUB                                       

                                                                              
  [START] UNIFIED TRADING INTERFACE                                               
  All-in-one dashboard with sidebar navigation                               
                                                                              
  [DATA] MODULES AVAILABLE:                                                      
   Dashboard Overview                                                       
   Portfolio Management                                                     
   Trading Interface                                                        
   Sentiment Analysis                                                       
   Analytics & Risk                                                         
   System Settings                                                          
                                                                              
  [MONEY] PORTFOLIO SUMMARY:                                                      
  Total Value: $${this.portfolio.totalValue.toLocaleString()}                           
  Cash: $${this.portfolio.cash.toLocaleString()}                                     
  Positions: $${(this.portfolio.totalValue - this.portfolio.cash).toLocaleString()}                           
  Total P&L: $${this.portfolio.performance.totalPnL.toLocaleString()} (${((this.portfolio.performance.totalPnL / (this.portfolio.totalValue - this.portfolio.performance.totalPnL)) * 100).toFixed(2)}%) 
                                                                              
  [DATA] Hub URL: http://localhost:${this.port}                               
  [RELOAD] Auto-refresh: Every 30 seconds                                         
   Real-time Updates: Enabled                                             
                                                                              

        `);
    }

    stop() {
        if (this.server) {
            this.server.close(() => {
                console.log('[ENDPOINTS] Quantum Trading Hub stopped');
            });
        }
    }
}

// Create and start the hub
const hub = new QuantumTradingHub();

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, stopping Quantum Trading Hub...');
    hub.stop();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, stopping Quantum Trading Hub...');
    hub.stop();
    process.exit(0);
});

// Start the server
hub.start();

module.exports = QuantumTradingHub;

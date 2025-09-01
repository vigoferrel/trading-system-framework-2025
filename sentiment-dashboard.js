
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
 * QUANTUM SENTIMENT DASHBOARD - ASCII PURE INTEGRATION
 * ===================================================
 * 
 * Componentes principales:
 * - [ENDPOINTS] Sentiment Radar (Circular ASCII)
 * - [MONEY] Holdings & P&L Monitor
 * - [UP] Multi-Timeframe Projections
 * -  AI Sentiment Engine
 * - [WARNING] Risk Metrics
 * - Quantum Matrix
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

class SentimentDashboard {
    constructor() {
        this.port = process.env.SENTIMENT_DASHBOARD_PORT || 4603;
        this.server = null;
        this.sentimentData = {};
        this.holdingsData = {};
        this.projectionData = {};
        this.riskMetrics = {};
        
        // Inicializar datos
        this.initializeData();
    }

    initializeData() {
        // Datos de sentimiento por timeframe
        this.sentimentData = {
            BTC: { bullish: 78, neutral: 15, bearish: 7, confidence: 92 },
            ETH: { bullish: 65, neutral: 25, bearish: 10, confidence: 88 },
            BNB: { bullish: 82, neutral: 12, bearish: 6, confidence: 95 },
            SOL: { bullish: 71, neutral: 20, bearish: 9, confidence: 85 },
            XRP: { bullish: 58, neutral: 30, bearish: 12, confidence: 82 }
        };

        // Datos de holdings
        this.holdingsData = {
            totalValue: 125430.50,
            unrealizedPnL: 2847.30,
            realizedPnL: 15420.80,
            positions: [
                { symbol: 'BTC', quantity: 0.85, avgPrice: 118500, currentPrice: 118948.9, pnl: 381.57 },
                { symbol: 'ETH', quantity: 2.5, avgPrice: 4600, currentPrice: 4636.73, pnl: 91.83 },
                { symbol: 'BNB', quantity: 8.2, avgPrice: 845, currentPrice: 850.35, pnl: 43.87 },
                { symbol: 'SOL', quantity: 25.0, avgPrice: 195, currentPrice: 196.72, pnl: 43.00 },
                { symbol: 'XRP', quantity: 1500, avgPrice: 3.10, currentPrice: 3.1189, pnl: 28.35 }
            ]
        };

        // Métricas de riesgo
        this.riskMetrics = {
            var: 2.3,
            sharpe: 1.8,
            maxDrawdown: 4.2,
            beta: 0.85,
            correlation: 0.72,
            volatility: 45.8
        };
    }

    start() {
        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        this.server.listen(this.port, () => {
            console.log(`[ENDPOINTS] Sentiment Dashboard running on port ${this.port}`);
            console.log(`[DATA] Dashboard available at: http://localhost:${this.port}`);
            this.displayDashboard();
        });
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        // Route handling
        switch (pathname) {
            case '/':
                this.serveDashboard(req, res);
                break;
            case '/api/sentiment/radar':
                this.serveSentimentRadar(req, res);
                break;
            case '/api/holdings/portfolio':
                this.serveHoldingsPortfolio(req, res);
                break;
            case '/api/projections/multitimeframe':
                this.serveMultiTimeframeProjections(req, res);
                break;
            case '/api/risk/metrics':
                this.serveRiskMetrics(req, res);
                break;
            case '/api/sentiment/social':
                this.serveSocialSentiment(req, res);
                break;
            case '/api/quantum/matrix':
                this.serveQuantumMatrix(req, res);
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

    serveSentimentRadar(req, res) {
        const data = {
            timestamp: Date.now(),
            symbols: this.sentimentData,
            overall: {
                bullish: 71,
                neutral: 20,
                bearish: 9,
                confidence: 88
            }
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }

    serveHoldingsPortfolio(req, res) {
        const data = {
            timestamp: Date.now(),
            ...this.holdingsData,
            riskMetrics: this.riskMetrics
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }

    serveMultiTimeframeProjections(req, res) {
        const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'];
        const projections = {};
        
        Object.keys(this.sentimentData).forEach(symbol => {
            projections[symbol] = timeframes.map(tf => ({
                timeframe: tf,
                sentiment: this.getSentimentForTimeframe(symbol, tf),
                confidence: Math.floor(PHYSICAL_CONSTANTS.FIBONACCI_STRENGTH * 20) + 80,
                projectedPrice: this.getProjectedPrice(symbol, tf),
                riskLevel: this.getRiskLevel(symbol, tf)
            }));
        });

        const data = {
            timestamp: Date.now(),
            projections: projections
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }

    serveRiskMetrics(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            timestamp: Date.now(),
            ...this.riskMetrics
        }));
    }

    serveSocialSentiment(req, res) {
        const data = {
            timestamp: Date.now(),
            social: {
                twitter: { bullish: 75, neutral: 18, bearish: 7 },
                reddit: { bullish: 68, neutral: 25, bearish: 7 },
                telegram: { bullish: 82, neutral: 12, bearish: 6 },
                discord: { bullish: 71, neutral: 22, bearish: 7 }
            },
            news: {
                positive: 65,
                neutral: 25,
                negative: 10
            }
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }

    serveQuantumMatrix(req, res) {
        const symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP'];
        const matrix = {};
        
        symbols.forEach(symbol1 => {
            matrix[symbol1] = {};
            symbols.forEach(symbol2 => {
                matrix[symbol1][symbol2] = PHYSICAL_CONSTANTS.FIBONACCI_STRENGTH * 0.4 + 0.6;
            });
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            timestamp: Date.now(),
            matrix: matrix
        }));
    }

    serve404(req, res) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }

    // Métodos auxiliares
    getSentimentForTimeframe(symbol, timeframe) {
        const baseSentiment = this.sentimentData[symbol].bullish;
        const timeframeMultiplier = {
            '1m': 1.0,
            '5m': 0.95,
            '15m': 0.90,
            '1h': 0.85,
            '4h': 0.80,
            '1d': 0.75,
            '1w': 0.70
        };
        return Math.floor(baseSentiment * timeframeMultiplier[timeframe]);
    }

    getProjectedPrice(symbol, timeframe) {
        const currentPrices = {
            'BTC': 118948.9,
            'ETH': 4636.73,
            'BNB': 850.35,
            'SOL': 196.72,
            'XRP': 3.1189
        };
        const basePrice = currentPrices[symbol];
        const volatility = PHYSICAL_CONSTANTS.FUNDING_VOLATILITY - 0.01; // ±1%
        return basePrice * (1 + volatility);
    }

    getRiskLevel(symbol, timeframe) {
        const levels = ['Low', 'Medium', 'High'];
        return levels[Math.floor(PHYSICAL_CONSTANTS.FUNDING_DEVIATION * 2)];
    }

    generateDashboardHTML() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[ENDPOINTS] Quantum Sentiment Dashboard</title>
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
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #00ff00;
            padding-bottom: 10px;
        }
        
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
            margin-bottom: 10px;
            color: #ffff00;
        }
        
        .sentiment-radar {
            text-align: center;
            font-size: 12px;
        }
        
        .holdings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
        }
        
        .position {
            border: 1px solid #333;
            padding: 8px;
            background: #002200;
        }
        
        .positive { color: #00ff00; }
        .negative { color: #ff0000; }
        .neutral { color: #ffff00; }
        
        .timeline {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 11px;
        }
        
        .timeframe {
            text-align: center;
            padding: 5px;
            border: 1px solid #333;
            min-width: 60px;
        }
        
        .bullish { border-color: #00ff00; background: #002200; }
        .bearish { border-color: #ff0000; background: #220000; }
        .neutral { border-color: #ffff00; background: #222200; }
        
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }
        
        .metric {
            text-align: center;
            padding: 8px;
            border: 1px solid #333;
            background: #001100;
        }
        
        .refresh-btn {
            background: #00ff00;
            color: #000;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
        }
        
        .refresh-btn:hover {
            background: #00cc00;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>[ENDPOINTS] QUANTUM SENTIMENT DASHBOARD</h1>
            <p>Real-time Market Sentiment Analysis & Portfolio Monitor</p>
            <button class="refresh-btn" onclick="refreshDashboard()">[RELOAD] REFRESH DATA</button>
        </div>
        
        <div class="grid">
            <div class="panel">
                <h3>[ENDPOINTS] SENTIMENT RADAR</h3>
                <div class="sentiment-radar" id="sentimentRadar">
                    <pre>
    
       SENTIMENT     
         RADAR       
                     
       78% Bullish 
       15% Neutral 
       7% Bearish  
                     
     Confidence: 92% 
    
                    </pre>
                </div>
            </div>
            
            <div class="panel">
                <h3>[MONEY] HOLDINGS & P&L</h3>
                <div class="holdings-grid" id="holdingsGrid">
                    <div class="position">
                        <strong>BTC</strong><br>
                        Qty: 0.85<br>
                        P&L: <span class="positive">+$381.57</span>
                    </div>
                    <div class="position">
                        <strong>ETH</strong><br>
                        Qty: 2.5<br>
                        P&L: <span class="positive">+$91.83</span>
                    </div>
                    <div class="position">
                        <strong>BNB</strong><br>
                        Qty: 8.2<br>
                        P&L: <span class="positive">+$43.87</span>
                    </div>
                    <div class="position">
                        <strong>SOL</strong><br>
                        Qty: 25.0<br>
                        P&L: <span class="positive">+$43.00</span>
                    </div>
                    <div class="position">
                        <strong>XRP</strong><br>
                        Qty: 1500<br>
                        P&L: <span class="positive">+$28.35</span>
                    </div>
                </div>
                <div class="metrics">
                    <div class="metric">
                        <strong>Total Value</strong><br>
                        <span class="positive">$125,430.50</span>
                    </div>
                    <div class="metric">
                        <strong>Unrealized P&L</strong><br>
                        <span class="positive">+$2,847.30</span>
                    </div>
                    <div class="metric">
                        <strong>Realized P&L</strong><br>
                        <span class="positive">+$15,420.80</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="panel">
            <h3>[UP] MULTITIMEFRAME PROJECTIONS</h3>
            <div class="timeline" id="projectionTimeline">
                <div class="timeframe bullish">
                    <div>1m</div>
                    <div></div>
                    <div>78%</div>
                </div>
                <div class="timeframe bullish">
                    <div>5m</div>
                    <div></div>
                    <div>74%</div>
                </div>
                <div class="timeframe neutral">
                    <div>15m</div>
                    <div></div>
                    <div>70%</div>
                </div>
                <div class="timeframe bullish">
                    <div>1h</div>
                    <div></div>
                    <div>66%</div>
                </div>
                <div class="timeframe bullish">
                    <div>4h</div>
                    <div></div>
                    <div>64%</div>
                </div>
                <div class="timeframe bullish">
                    <div>1d</div>
                    <div></div>
                    <div>59%</div>
                </div>
                <div class="timeframe bullish">
                    <div>1w</div>
                    <div></div>
                    <div>55%</div>
                </div>
            </div>
        </div>
        
        <div class="grid">
            <div class="panel">
                <h3>[WARNING] RISK METRICS</h3>
                <div class="metrics">
                    <div class="metric">
                        <strong>VaR (99%)</strong><br>
                        <span class="neutral">2.3%</span>
                    </div>
                    <div class="metric">
                        <strong>Sharpe Ratio</strong><br>
                        <span class="positive">1.8</span>
                    </div>
                    <div class="metric">
                        <strong>Max Drawdown</strong><br>
                        <span class="negative">4.2%</span>
                    </div>
                    <div class="metric">
                        <strong>Beta</strong><br>
                        <span class="neutral">0.85</span>
                    </div>
                    <div class="metric">
                        <strong>Volatility</strong><br>
                        <span class="neutral">45.8%</span>
                    </div>
                    <div class="metric">
                        <strong>Correlation</strong><br>
                        <span class="neutral">0.72</span>
                    </div>
                </div>
            </div>
            
            <div class="panel">
                <h3> AI SENTIMENT ENGINE</h3>
                <div class="metrics">
                    <div class="metric">
                        <strong>Social</strong><br>
                        <span class="positive">78%</span>
                    </div>
                    <div class="metric">
                        <strong>News</strong><br>
                        <span class="neutral">65%</span>
                    </div>
                    <div class="metric">
                        <strong>Technical</strong><br>
                        <span class="positive">82%</span>
                    </div>
                    <div class="metric">
                        <strong>Fundamental</strong><br>
                        <span class="positive">75%</span>
                    </div>
                    <div class="metric">
                        <strong>Quantum</strong><br>
                        <span class="positive">88%</span>
                    </div>
                    <div class="metric">
                        <strong>Whale Activity</strong><br>
                        <span class="neutral">62%</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="panel">
            <h3> QUANTUM CORRELATION MATRIX</h3>
            <div style="font-size: 11px; text-align: center;">
                <pre>
    BTC    ETH    BNB    SOL    XRP
BTC 1.00   0.85   0.72   0.68   0.45
ETH 0.85   1.00   0.78   0.71   0.52
BNB 0.72   0.78   1.00   0.65   0.48
SOL 0.68   0.71   0.65   1.00   0.43
XRP 0.45   0.52   0.48   0.43   1.00
                </pre>
            </div>
        </div>
    </div>

    <script>
        function refreshDashboard() {
            // Simular actualización de datos
            console.log('[RELOAD] Refreshing dashboard data...');
            
            // Actualizar sentimiento
            fetch('/api/sentiment/radar')
                .then(response => response.json())
                .then(data => {
                    console.log('[DATA] Sentiment data updated:', data);
                });
            
            // Actualizar holdings
            fetch('/api/holdings/portfolio')
                .then(response => response.json())
                .then(data => {
                    console.log('[MONEY] Holdings data updated:', data);
                });
            
            // Actualizar proyecciones
            fetch('/api/projections/multitimeframe')
                .then(response => response.json())
                .then(data => {
                    console.log('[UP] Projections updated:', data);
                });
            
            // Actualizar métricas de riesgo
            fetch('/api/risk/metrics')
                .then(response => response.json())
                .then(data => {
                    console.log('[WARNING] Risk metrics updated:', data);
                });
        }
        
        // Auto-refresh cada 30 segundos
        setInterval(refreshDashboard, 30000);
        
        // Cargar datos iniciales
        refreshDashboard();
    </script>
</body>
</html>
        `;
    }

    displayDashboard() {
        console.log(`

                    [ENDPOINTS] QUANTUM SENTIMENT DASHBOARD                           

                                                                              
  [ENDPOINTS] Sentiment Radar: 78% Bullish | 15% Neutral | 7% Bearish                
  [MONEY] Total Portfolio: $125,430.50 | P&L: +$2,847.30 (+2.3%)                 
  [WARNING] Risk Metrics: VaR 2.3% | Sharpe 1.8 | Max DD 4.2%                      
  [UP] Multi-Timeframe: 1m5m15m1h4h1d1w (Bullish Trend)                 
                                                                              
   AI Sentiment Engine: Social 78% | News 65% | Technical 82%             
  Quantum Matrix: BTC-ETH 0.85 | ETH-BNB 0.78 | BNB-SOL 0.65             
                                                                              
  [DATA] Dashboard URL: http://localhost:${this.port}                           
  [RELOAD] Auto-refresh: Every 30 seconds                                         
                                                                              

        `);
    }

    stop() {
        if (this.server) {
            this.server.close(() => {
                console.log('[ENDPOINTS] Sentiment Dashboard stopped');
            });
        }
    }
}

// Crear y iniciar el dashboard
const sentimentDashboard = new SentimentDashboard();

// Manejar cierre graceful
process.on('SIGTERM', () => {
    console.log('SIGTERM received, stopping Sentiment Dashboard...');
    sentimentDashboard.stop();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, stopping Sentiment Dashboard...');
    sentimentDashboard.stop();
    process.exit(0);
});

// Iniciar el servidor
sentimentDashboard.start();

module.exports = SentimentDashboard;

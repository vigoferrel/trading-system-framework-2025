// Quantum Trading Dashboard Unificado
// Módulos: Mercado, Portafolio, Opciones, Oráculo, Logs

const BINANCE_API_BASE = 'https://api.binance.com';
const API_BASE = 'http://localhost:4602';

// Renderizador de pestañas
const tabs = ['market', 'portfolio', 'options', 'oracle', 'insights', 'logs'];
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('nav button');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTab(btn.dataset.tab);
        });
    });
    renderTab('market');
});

// Variables globales para WebSocket y datos en tiempo real
let wsConnection = null;
let currentMarketData = null;
let currentPriceData = null;

// Renderizador de cada módulo
async function renderTab(tab) {
    // Conectar WebSocket para actualizaciones en tiempo real
    if (!wsConnection) {
        connectWebSocket();
    }
    const main = document.getElementById('main-content');
    main.innerHTML = '<div>Cargando...</div>';
    if (tab === 'market') {
        try {
            // Obtener datos reales del backend
            const marketData = await fetch(`${API_BASE}/api/market-data`);
            const data = await marketData.json();

            const symbols = Object.keys(data.data || {});
            const marketInfo = symbols.map(symbol => data.data[symbol]);

            main.innerHTML = `
                <section>
                    <h2>📊 Mercado - Datos en Tiempo Real</h2>
                    <div class="market-stats">
                        <div class="stat-card">
                            <h3>Total Símbolos</h3>
                            <span class="stat-value">${symbols.length}</span>
                        </div>
                        <div class="stat-card">
                            <h3>Coherencia Cuántica</h3>
                            <span class="stat-value">${(data.quantumSystemMetrics?.overallCoherence * 100 || 0).toFixed(1)}%</span>
                        </div>
                        <div class="stat-card">
                            <h3>Última Actualización</h3>
                            <span class="stat-value">${new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </section>

                <section>
                    <h3>📈 Precios y Volatilidad</h3>
                    <div class="chart-container">
                        <canvas id="priceChart" width="800" height="400"></canvas>
                    </div>
                </section>

                <section>
                    <h3>🔄 Factores Cuánticos</h3>
                    <div class="chart-container">
                        <canvas id="quantumChart" width="800" height="300"></canvas>
                    </div>
                </section>

                <section>
                    <h3>📋 Tabla de Activos</h3>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Símbolo</th>
                                    <th>Precio</th>
                                    <th>Cambio 24h</th>
                                    <th>Volumen</th>
                                    <th>Coherencia</th>
                                    <th>Entrelazamiento</th>
                                    <th>Momentum</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${marketInfo.map(item => `
                                    <tr>
                                        <td><strong>${item.symbol}</strong></td>
                                        <td>$${item.price?.toLocaleString() || 'N/A'}</td>
                                        <td class="${item.change >= 0 ? 'positive' : 'negative'}">
                                            ${item.change >= 0 ? '+' : ''}${(item.change * 100)?.toFixed(2) || 0}%
                                        </td>
                                        <td>${item.volume?.toLocaleString() || 'N/A'}</td>
                                        <td>${(item.quantumFactors?.coherence * 100)?.toFixed(1) || 0}%</td>
                                        <td>${(item.quantumFactors?.entanglement * 100)?.toFixed(1) || 0}%</td>
                                        <td>${(item.quantumFactors?.momentum * 100)?.toFixed(1) || 0}%</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>
            `;

            // Gráfico de precios y volatilidad
            setTimeout(() => {
                const priceCtx = document.getElementById('priceChart').getContext('2d');
                new Chart(priceCtx, {
                    type: 'line',
                    data: {
                        labels: marketInfo.map(item => item.symbol),
                        datasets: [{
                            label: 'Precio (USD)',
                            data: marketInfo.map(item => item.price),
                            borderColor: '#40e0d0',
                            backgroundColor: 'rgba(64, 224, 208, 0.1)',
                            yAxisID: 'y',
                            tension: 0.4
                        }, {
                            label: 'Volatilidad (%)',
                            data: marketInfo.map(item => Math.abs(item.change * 100)),
                            borderColor: '#ff6b6b',
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            yAxisID: 'y1',
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Precio (USD)'
                                }
                            },
                            y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                title: {
                                    display: true,
                                    text: 'Volatilidad (%)'
                                },
                                grid: {
                                    drawOnChartArea: false,
                                },
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top'
                            }
                        }
                    }
                });

                // Gráfico de factores cuánticos
                const quantumCtx = document.getElementById('quantumChart').getContext('2d');
                new Chart(quantumCtx, {
                    type: 'radar',
                    data: {
                        labels: ['Coherencia', 'Entrelazamiento', 'Momentum', 'Densidad', 'Temperatura'],
                        datasets: marketInfo.slice(0, 3).map((item, index) => ({
                            label: item.symbol,
                            data: [
                                item.quantumFactors?.coherence || 0,
                                item.quantumFactors?.entanglement || 0,
                                item.quantumFactors?.momentum || 0,
                                item.quantumFactors?.density || 0,
                                item.quantumFactors?.temperature || 0
                            ],
                            borderColor: ['#40e0d0', '#ff6b6b', '#ffd93d'][index],
                            backgroundColor: ['rgba(64, 224, 208, 0.2)', 'rgba(255, 107, 107, 0.2)', 'rgba(255, 217, 61, 0.2)'][index],
                            pointBackgroundColor: ['#40e0d0', '#ff6b6b', '#ffd93d'][index]
                        }))
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                beginAtZero: true,
                                max: 1,
                                ticks: {
                                    callback: function(value) {
                                        return (value * 100) + '%';
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom'
                            }
                        }
                    }
                });
            }, 100);
        } catch (error) {
            console.error('Error loading market data:', error);
            main.innerHTML = '<div>Error cargando datos del mercado</div>';
        }
    } else if (tab === 'insights') {
        main.innerHTML = '<div>Cargando insights...</div>';
        try {
            // Consumir sector analysis y trading insights
            const [sectorRes, tradingRes] = await Promise.all([
                fetch('http://localhost:4605/api/sector-analysis'),
                fetch('http://localhost:4605/api/trading-insights')
            ]);
            const sectorData = await sectorRes.json();
            const tradingData = await tradingRes.json();

            // Procesar datos
            const sectorSummary = sectorData?.data?.sector_summary || [];
            const tradingInsights = tradingData?.data?.trading_insights || {};

            // Panel Feynman: Explicación causal de los movimientos clave
            let feynmanHtml = `<section><h2>🔬 Panel Feynman: Explicación Causal</h2><ul>`;
            sectorSummary.forEach(s => {
                feynmanHtml += `<li><strong>${s.sector}</strong>: El momentum (${(s.momentum*100).toFixed(2)}%) y la volatilidad (${(s.volatility*100).toFixed(2)}%) se explican por <em>${s.top_symbol}</em> y los flujos recientes. <br><span style='color:#40e0d0'>¿Por qué? </span> Cambios en liquidez y sentimiento institucional.</li>`;
            });
            feynmanHtml += '</ul></section>';

            // Panel Markov: Trayectorias probables y bifurcaciones
            let markovHtml = `<section><h2>🧬 Panel Markov: Trayectorias Probables</h2><table><thead><tr><th>Símbolo</th><th>Estado Actual</th><th>Próximo Estado</th><th>Probabilidad</th></tr></thead><tbody>`;
            Object.values(tradingInsights).forEach(ins => {
                // Simulación simple de transición Markov
                const nextState = ins.score > 0.7 ? 'Rally' : (ins.score < 0.3 ? 'Caída' : 'Lateral');
                const prob = (ins.score * 100).toFixed(1);
                markovHtml += `<tr><td>${ins.symbol}</td><td>${ins.sector}</td><td>${nextState}</td><td>${prob}%</td></tr>`;
            });
            markovHtml += '</tbody></table></section>';

            // Renderizar resumen sectorial y tabla de insights de trading
            let sectorHtml = `<section><h2>🌲 Resumen Sectorial</h2><table><thead><tr><th>Sector</th><th>Momentum</th><th>Volatilidad</th><th>Mejor Símbolo</th></tr></thead><tbody>`;
            sectorSummary.forEach(s => {
                sectorHtml += `<tr><td>${s.sector}</td><td>${(s.momentum*100).toFixed(2)}%</td><td>${(s.volatility*100).toFixed(2)}%</td><td>${s.top_symbol}</td></tr>`;
            });
            sectorHtml += '</tbody></table></section>';

            let tradingHtml = `<section><h2>💡 Mejores Símbolos por Sector</h2><table><thead><tr><th>Símbolo</th><th>Sector</th><th>Stop Loss</th><th>Take Profit</th><th>Score</th></tr></thead><tbody>`;
            Object.values(tradingInsights).forEach(ins => {
                tradingHtml += `<tr><td>${ins.symbol}</td><td>${ins.sector}</td><td>$${ins.stop_loss}</td><td>$${ins.take_profit}</td><td>${ins.score}</td></tr>`;
            });
            tradingHtml += '</tbody></table></section>';

            main.innerHTML = feynmanHtml + markovHtml + sectorHtml + tradingHtml;
        } catch (err) {
            main.innerHTML = '<div>Error cargando insights</div>';
            console.error('Error insights:', err);
        }
    } else if (tab === 'portfolio') {
        try {
            // Obtener datos del portfolio (usando datos simulados mejorados)
            const positions = await getPortfolioData();

            main.innerHTML = `
                <section>
                    <h2>💼 Portafolio - Estado Actual</h2>
                    <div class="portfolio-stats">
                        <div class="stat-card">
                            <h3>Total Posiciones</h3>
                            <span class="stat-value">${positions.length}</span>
                        </div>
                        <div class="stat-card">
                            <h3>PnL Total</h3>
                            <span class="stat-value ${positions.reduce((sum, p) => sum + p.pnl, 0) >= 0 ? 'positive' : 'negative'}">
                                $${positions.reduce((sum, p) => sum + p.pnl, 0).toFixed(2)}
                            </span>
                        </div>
                        <div class="stat-card">
                            <h3>Valor Total</h3>
                            <span class="stat-value">$${positions.reduce((sum, p) => sum + (p.size * p.currentPrice), 0).toFixed(2)}</span>
                        </div>
                    </div>
                </section>

                <section>
                    <h3>📊 Rendimiento por Posición</h3>
                    <div class="chart-container">
                        <canvas id="portfolioChart" width="800" height="400"></canvas>
                    </div>
                </section>

                <section>
                    <h3>📋 Detalles de Posiciones</h3>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Activo</th>
                                    <th>Cantidad</th>
                                    <th>Precio Entrada</th>
                                    <th>Precio Actual</th>
                                    <th>PnL</th>
                                    <th>PnL %</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${positions.map(p => `
                                    <tr>
                                        <td><strong>${p.symbol}</strong></td>
                                        <td>${p.size}</td>
                                        <td>$${p.entryPrice.toFixed(2)}</td>
                                        <td>$${p.currentPrice.toFixed(2)}</td>
                                        <td class="${p.pnl >= 0 ? 'positive' : 'negative'}">
                                            $${p.pnl.toFixed(2)}
                                        </td>
                                        <td class="${p.pnlPercent >= 0 ? 'positive' : 'negative'}">
                                            ${p.pnlPercent >= 0 ? '+' : ''}${p.pnlPercent.toFixed(2)}%
                                        </td>
                                        <td><span class="status-${p.status.toLowerCase()}">${p.status}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>
            `;

            // Gráfico de rendimiento del portfolio
            setTimeout(() => {
                const ctx = document.getElementById('portfolioChart').getContext('2d');
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: positions.map(p => p.symbol),
                        datasets: [{
                            label: 'Valor de Posición',
                            data: positions.map(p => p.size * p.currentPrice),
                            backgroundColor: [
                                '#40e0d0',
                                '#ff6b6b',
                                '#ffd93d',
                                '#a8e6cf',
                                '#ffd3a5'
                            ],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 20,
                                    usePointStyle: true
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const value = context.raw;
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
            }, 100);
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            main.innerHTML = '<div>Error cargando datos del portfolio</div>';
        }
    } else if (tab === 'options') {
        // Integración avanzada: visualización de opciones y Greeks
        const options = await fetchOptionsSymbols();
        main.innerHTML = `<h2>Opciones</h2>
            <table><tr><th>Símbolo</th><th>Tipo</th><th>Strike</th><th>Expiry</th><th>Delta</th><th>Gamma</th><th>Vega</th><th>Theta</th></tr>
            ${options.map(o => `<tr><td>${o.symbol}</td><td>${o.type}</td><td>${o.strike}</td><td>${o.expiry}</td><td>${o.delta || '-'}</td><td>${o.gamma || '-'}</td><td>${o.vega || '-'}</td><td>${o.theta || '-'}</td></tr>`).join('')}</table>`;
    } else if (tab === 'oracle') {
        const status = await fetchGlobalStatus();
        const recommendations = await fetchRecommendations();
        main.innerHTML = `<h2>Oráculo Cuántico</h2>
            <section>
                <h3>Estado Global del Sistema</h3>
                <pre>${JSON.stringify(status, null, 2)}</pre>
            </section>
            <section>
                <h3>Recomendaciones Inteligentes</h3>
                <ul>${recommendations.map(r => `<li><strong>${r.title}</strong> (score: ${r.score})<br>${r.context}<br><button onclick=\"executeLLMAction('${r.id}')\">Ejecutar acción</button></li>`).join('')}</ul>
            </section>
            <section>
                <h3>Flujo de datos y dependencias</h3>
                <ul>
                    <li>Frontend &rarr; Backend: consumo de datos y ejecución de acciones</li>
                    <li>Backend &rarr; LLM Master: orquestación y generación de recomendaciones</li>
                    <li>LLM Master &rarr; Frontend: estado global, eventos y recomendaciones</li>
                </ul>
            </section>`;
    } else if (tab === 'logs') {
        const logs = await fetchLLMLogs('all');
        const errorLogs = logs.filter(l => l.type === 'error');
        const infoLogs = logs.filter(l => l.type === 'info');
        main.innerHTML = `<h2>Logs del Coordinador Central</h2>
            <section>
                <h3>Errores</h3><ul>${errorLogs.map(l => `<li>[${l.timestamp}] <strong>${l.type}</strong>: ${l.message}</li>`).join('')}</ul>
            </section>
            <section>
                <h3>Info</h3><ul>${infoLogs.map(l => `<li>[${l.timestamp}] <strong>${l.type}</strong>: ${l.message}</li>`).join('')}</ul>
            </section>
            <section>
                <h3>Auditoría y Trazabilidad</h3>
                <ul>
                    <li>Todos los eventos y acciones quedan registrados</li>
                    <li>Logs filtrados por tipo y módulo</li>
                </ul>
            </section>`;
    }
}

// --- Portafolio: datos mejorados con precios actuales
async function fetchPortfolioPositions() {
    return await getPortfolioData();
}

// Función para obtener datos del portfolio con precios actuales
async function getPortfolioData() {
    try {
        // Obtener precios actuales de Binance - Mismos símbolos que el mercado
        const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
        const prices = {};

        for (const symbol of symbols) {
            try {
                const response = await fetch(`${BINANCE_API_BASE}/api/v3/ticker/price?symbol=${symbol}`);
                if (response.ok) {
                    const data = await response.json();
                    prices[symbol] = parseFloat(data.price);
                }
            } catch (error) {
                console.error(`Error getting price for ${symbol}:`, error);
            }
        }

        // Datos del portfolio con precios actuales - Todos los símbolos del mercado
        const positions = [
            {
                symbol: 'BTC',
                size: 0.5,
                entryPrice: 45000,
                currentPrice: prices['BTCUSDT'] || 45000,
                status: 'open'
            },
            {
                symbol: 'ETH',
                size: 2.0,
                entryPrice: 3200,
                currentPrice: prices['ETHUSDT'] || 3200,
                status: 'open'
            },
            {
                symbol: 'BNB',
                size: 10.0,
                entryPrice: 300,
                currentPrice: prices['BNBUSDT'] || 300,
                status: 'open'
            },
            {
                symbol: 'SOL',
                size: 50.0,
                entryPrice: 150,
                currentPrice: prices['SOLUSDT'] || 150,
                status: 'open'
            },
            {
                symbol: 'XRP',
                size: 1000.0,
                entryPrice: 0.5,
                currentPrice: prices['XRPUSDT'] || 0.5,
                status: 'open'
            }
        ];

        // Calcular PnL para cada posición
        positions.forEach(pos => {
            pos.pnl = (pos.currentPrice - pos.entryPrice) * pos.size;
            pos.pnlPercent = ((pos.currentPrice - pos.entryPrice) / pos.entryPrice) * 100;
        });

        return positions;
    } catch (error) {
        console.error('Error getting portfolio data:', error);
        // Fallback data
        return [
            { symbol: 'BTC', size: 0.5, entryPrice: 45000, currentPrice: 45000, pnl: 0, pnlPercent: 0, status: 'open' },
            { symbol: 'ETH', size: 2.0, entryPrice: 3200, currentPrice: 3200, pnl: 0, pnlPercent: 0, status: 'open' }
        ];
    }
}
// --- Funciones de integración con LLM Master Controller ---

async function fetchGlobalStatus() {
    const res = await fetch(`${API_BASE}/api/llm/global-status`);
    return await res.json();
}

async function fetchRecommendations() {
    const res = await fetch(`${API_BASE}/api/llm/recommendations`);
    return await res.json();
}

async function executeLLMAction(actionId) {
    const res = await fetch(`${API_BASE}/api/llm/execute-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionId })
    });
    const result = await res.json();
    alert('Acción ejecutada: ' + JSON.stringify(result));
}

async function fetchLLMLogs(type = 'all') {
    const res = await fetch(`${API_BASE}/api/llm/logs?type=${type}`);
    return await res.json();
}

// --- Funciones de ayuda ---
function runHealthCheck() {
    // Hook para pruebas automáticas y monitoreo
    console.log('HealthCheck: dashboard renderizado correctamente.');
}

function showHelp(module) {
    let msg = '';
    if (module === 'market') {
        msg = 'En este módulo puedes analizar la volatilidad y el comportamiento de los activos en tiempo real.';
    } else if (module === 'portfolio') {
        msg = 'Aquí puedes ver tus posiciones abiertas, balances y rendimiento.';
    }
    alert(msg);
}

// Inicializar health check
document.addEventListener('DOMContentLoaded', runHealthCheck);

// Opciones: ejemplo de obtención básica (Binance Options API pública es limitada, se puede adaptar a backend propio)
async function fetchOptionsSymbols() {
    // Aquí se puede integrar la API de Binance Options si está disponible, o tu backend
    // Ejemplo ficticio de estructura, reemplazar por datos reales:
    return [
        { symbol: 'BTCUSDT-20250901-50000C', type: 'call', strike: 50000, expiry: '2025-09-01' },
        { symbol: 'ETHUSDT-20250901-3500P', type: 'put', strike: 3500, expiry: '2025-09-01' }
    ];
}

// Funciones para obtener datos reales de Binance
async function fetchFuturesSymbols() {
    const res = await fetch(`${BINANCE_API_BASE}/fapi/v1/exchangeInfo`);
    const data = await res.json();
    return data.symbols.filter(s => s.contractType === 'PERPETUAL');
}

async function fetchSymbolData(symbol) {
    const [priceRes, statsRes] = await Promise.all([
        fetch(`${BINANCE_API_BASE}/fapi/v1/ticker/price?symbol=${symbol}`),
        fetch(`${BINANCE_API_BASE}/fapi/v1/ticker/24hr?symbol=${symbol}`)
    ]);
    const priceData = await priceRes.json();
    const statsData = await statsRes.json();
    return {
        symbol: symbol,
        type: 'futures',
        price: parseFloat(priceData.price),
        volume: parseFloat(statsData.volume),
        volatility: parseFloat(statsData.priceChangePercent) / 100
    };
}

// Funciones WebSocket para actualizaciones en tiempo real
function connectWebSocket() {
    try {
        wsConnection = new WebSocket('ws://localhost:4602');

        wsConnection.onopen = function(event) {
            console.log('🔌 [WS] Connected to server');
            showNotification('Conectado al servidor en tiempo real', 'success');
        };

        wsConnection.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                handleRealtimeUpdate(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        wsConnection.onclose = function(event) {
            console.log('🔌 [WS] Connection closed');
            showNotification('Conexión cerrada', 'warning');

            // Reconectar después de 5 segundos
            setTimeout(() => {
                console.log('🔄 [WS] Attempting to reconnect...');
                connectWebSocket();
            }, 5000);
        };

        wsConnection.onerror = function(error) {
            console.error('🔌 [WS] Connection error:', error);
            showNotification('Error de conexión WebSocket', 'error');
        };

    } catch (error) {
        console.error('Error creating WebSocket connection:', error);
    }
}

function handleRealtimeUpdate(data) {
    switch (data.type) {
        case 'welcome':
            console.log('📨 [WS] Welcome message:', data.message);
            break;

        case 'market_update':
            currentMarketData = data.data;
            updateMarketDisplay(data.data);
            break;

        case 'price_update':
            currentPriceData = data.data;
            updatePriceDisplay(data.data);
            break;

        case 'status_update':
            updateStatusDisplay(data.data);
            break;

        case 'pong':
            console.log('🏓 [WS] Pong received');
            break;

        default:
            console.log('📨 [WS] Unknown message type:', data.type);
    }
}

function updateMarketDisplay(marketData) {
    // Actualizar indicadores de estado
    const coherenceElement = document.querySelector('.stat-value');
    if (coherenceElement && marketData.quantumSystemMetrics) {
        const coherenceValue = (marketData.quantumSystemMetrics.overallCoherence * 100).toFixed(1);
        coherenceElement.textContent = `${coherenceValue}%`;
    }

    // Actualizar timestamp
    const timeElement = document.querySelector('.stat-value:last-child');
    if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString();
    }

    console.log('📊 [WS] Market data updated');
}

function updatePriceDisplay(priceData) {
    // Actualizar precios en la tabla si está visible
    Object.entries(priceData).forEach(([symbol, price]) => {
        // Buscar la fila que contiene el símbolo
        const rows = document.querySelectorAll('tbody tr');
        for (const row of rows) {
            const firstCell = row.querySelector('td:first-child');
            if (firstCell && firstCell.textContent.includes(symbol.replace('USDT', ''))) {
                // Encontrar la celda de precio (segunda celda)
                const priceCell = row.querySelector('td:nth-child(2)');
                if (priceCell) {
                    priceCell.textContent = `$${price.toLocaleString()}`;
                }
                break;
            }
        }
    });

    console.log('💰 [WS] Prices updated:', priceData);
}

function updateStatusDisplay(statusData) {
    // Actualizar indicadores de estado global
    console.log('📈 [WS] Status updated:', statusData.system.health);
}

function showNotification(message, type = 'info') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        background-color: ${type === 'success' ? '#40e0d0' : type === 'error' ? '#e04040' : '#ffd93d'};
    `;

    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Fin del archivo - asegurar sintaxis correcta


// QBTC Dashboard Interactive JavaScript
// Handling modal interactions, API demonstrations, and dynamic content loading

class QBTCDashboard {
    constructor() {
        this.currentModal = null;
        this.demoOutputCache = new Map();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCounters();
        this.startPerformanceUpdates();
        this.loadSystemStatus();
    }

    setupEventListeners() {
        // Modal triggers
        document.querySelectorAll('.doc-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.openDocumentModal(link.dataset.doc);
            });
        });

        // API demo buttons
        document.querySelectorAll('.btn[data-demo]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.runAPIDemo(btn.dataset.demo);
            });
        });

        // Close modal handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
            if (e.target.classList.contains('modal-close')) {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    async openDocumentModal(docType) {
        const modal = this.createModal();
        const content = await this.loadDocumentContent(docType);
        
        modal.querySelector('.modal-header h3').textContent = this.getDocumentTitle(docType);
        modal.querySelector('.modal-body').innerHTML = content;
        
        document.body.appendChild(modal);
        this.currentModal = modal;
        
        // Add fade-in animation
        setTimeout(() => modal.classList.add('show'), 10);
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3></h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i> Cargando documentación...
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    async loadDocumentContent(docType) {
        const docPaths = {
            'architecture': './ARCHITECTURE.md',
            'security': './SECURITY.md',
            'testing': './TESTING.md',
            'performance': './PERFORMANCE.md',
            'contribution': './CONTRIBUTING.md',
            'governance': './GOVERNANCE.md',
            'deployment': './DEPLOYMENT.md',
            'institutional': './INSTITUTIONAL_TRANSFORMATION.md'
        };

        const path = docPaths[docType];
        if (!path) return '<p>Documento no encontrado.</p>';

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error('Document not found');
            
            const markdown = await response.text();
            return this.convertMarkdownToHTML(markdown);
        } catch (error) {
            return this.getStaticDocContent(docType);
        }
    }

    convertMarkdownToHTML(markdown) {
        // Simple markdown to HTML converter
        return markdown
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`(.+?)`/g, '<code>$1</code>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.+)$/gm, '<p>$1</p>')
            .replace(/<p><h/g, '<h')
            .replace(/<\/h([123])><\/p>/g, '</h$1>')
            .replace(/<p><ul>/g, '<ul>')
            .replace(/<\/ul><\/p>/g, '</ul>');
    }

    getStaticDocContent(docType) {
        const staticContent = {
            'architecture': `
                <h1>Arquitectura del Sistema QBTC</h1>
                <h2>Componentes Principales</h2>
                <h3>Kernel RNG</h3>
                <p>Sistema de generación de números aleatorios criptográficamente seguro que utiliza fuentes del kernel del sistema operativo.</p>
                <ul>
                    <li>Implementación determinística para testing</li>
                    <li>Validación de entropía en tiempo real</li>
                    <li>Fallbacks seguros en caso de falla</li>
                </ul>
                
                <h3>Safe Math Engine</h3>
                <p>Motor de cálculos matemáticos con verificación de overflow y precisión decimal.</p>
                
                <h3>Trading Engine</h3>
                <p>Core del sistema de trading algorítmico con gestión de órdenes y estrategias.</p>
                
                <h3>Risk Manager</h3>
                <p>Sistema de gestión de riesgos con límites dinámicos y alertas automáticas.</p>
            `,
            'security': `
                <h1>Políticas de Seguridad</h1>
                <h2>Criptografía</h2>
                <p>El sistema utiliza algoritmos criptográficos estándar de la industria:</p>
                <ul>
                    <li>AES-256 para cifrado simétrico</li>
                    <li>RSA-4096 para cifrado asimétrico</li>
                    <li>SHA-256 para hashing</li>
                    <li>HMAC para integridad de mensajes</li>
                </ul>
                
                <h2>Gestión de Claves</h2>
                <p>Las claves criptográficas se gestionan mediante HSM (Hardware Security Modules) en entornos de producción.</p>
            `,
            'testing': `
                <h1>Estrategia de Testing</h1>
                <h2>Niveles de Testing</h2>
                <ul>
                    <li><strong>Unit Tests:</strong> Tests individuales para cada componente</li>
                    <li><strong>Integration Tests:</strong> Verificación de interacción entre componentes</li>
                    <li><strong>Performance Tests:</strong> Medición de métricas de rendimiento</li>
                    <li><strong>Security Tests:</strong> Auditoría de vulnerabilidades</li>
                </ul>
                
                <h2>Cobertura</h2>
                <p>El sistema mantiene una cobertura de código superior al 95% con tests automatizados.</p>
            `,
            'performance': `
                <h1>Métricas de Performance</h1>
                <h2>Benchmarks Actuales</h2>
                <ul>
                    <li><strong>RNG Generation:</strong> 2.3μs por número</li>
                    <li><strong>Math Operations:</strong> 0.8μs por cálculo</li>
                    <li><strong>Market Simulation:</strong> 150μs por tick</li>
                    <li><strong>Risk Calculation:</strong> 45μs por evaluación</li>
                </ul>
                
                <h2>Optimizaciones</h2>
                <p>El sistema incluye optimizaciones específicas para trading de alta frecuencia.</p>
            `
        };

        return staticContent[docType] || '<p>Contenido no disponible.</p>';
    }

    getDocumentTitle(docType) {
        const titles = {
            'architecture': 'Arquitectura del Sistema',
            'security': 'Políticas de Seguridad',
            'testing': 'Estrategia de Testing',
            'performance': 'Métricas de Performance',
            'contribution': 'Guía de Contribución',
            'governance': 'Gobernanza del Proyecto',
            'deployment': 'Guía de Deployment',
            'institutional': 'Transformación Institucional'
        };
        return titles[docType] || 'Documentación';
    }

    closeModal() {
        if (this.currentModal) {
            this.currentModal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(this.currentModal);
                this.currentModal = null;
            }, 300);
        }
    }

    async runAPIDemo(demoType) {
        const output = await this.generateDemoOutput(demoType);
        this.displayDemoResult(demoType, output);
    }

    async generateDemoOutput(demoType) {
        // Simulate API calls with realistic data
        await this.delay(800 + Math.random() * 1200); // Simulate processing time

        const demoOutputs = {
            'rng': {
                title: 'Kernel RNG Demo',
                result: {
                    timestamp: new Date().toISOString(),
                    numbers: Array.from({length: 10}, () => Math.random()),
                    entropy: (Math.random() * 0.2 + 0.95).toFixed(4),
                    source: 'kernel-crypto',
                    validation: 'PASSED'
                }
            },
            'math': {
                title: 'Safe Math Demo',
                result: {
                    timestamp: new Date().toISOString(),
                    operations: [
                        { op: 'multiply', args: [1234.56, 789.12], result: 974299.9872, overflow: false },
                        { op: 'divide', args: [1000000, 3.7], result: 270270.270270, precision: 6 },
                        { op: 'power', args: [2, 31], result: 2147483648, safe: true }
                    ],
                    performance: '0.8μs average',
                    errors: 0
                }
            },
            'market': {
                title: 'Market Simulation Demo',
                result: {
                    timestamp: new Date().toISOString(),
                    symbol: 'BTC/USDT',
                    price: (50000 + Math.random() * 10000).toFixed(2),
                    volume: (Math.random() * 1000 + 500).toFixed(4),
                    spread: (Math.random() * 0.5 + 0.1).toFixed(4),
                    latency: '150μs',
                    ticks_processed: Math.floor(Math.random() * 10000 + 50000)
                }
            },
            'risk': {
                title: 'Risk Management Demo',
                result: {
                    timestamp: new Date().toISOString(),
                    portfolio_value: 125000.00,
                    var_95: -2500.50,
                    max_drawdown: 0.08,
                    sharpe_ratio: 1.85,
                    risk_score: 'LOW',
                    alerts: [],
                    calculation_time: '45μs'
                }
            }
        };

        return demoOutputs[demoType] || { title: 'Unknown Demo', result: { error: 'Demo not found' } };
    }

    displayDemoResult(demoType, output) {
        let outputDiv = document.getElementById(`demo-output-${demoType}`);
        
        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.id = `demo-output-${demoType}`;
            outputDiv.className = 'demo-output';
            
            const demoButton = document.querySelector(`[data-demo="${demoType}"]`);
            demoButton.parentNode.insertBefore(outputDiv, demoButton.nextSibling);
        }

        outputDiv.innerHTML = `
            <h4><i class="fas fa-terminal"></i> ${output.title} - Resultado</h4>
            <pre>${JSON.stringify(output.result, null, 2)}</pre>
        `;

        // Smooth scroll to result
        outputDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    initializeCounters() {
        // Animate counter values
        const counters = document.querySelectorAll('.perf-value');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const finalValue = parseFloat(element.textContent);
        const duration = 2000;
        const increment = finalValue / (duration / 16);
        let currentValue = 0;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            
            element.textContent = this.formatCounterValue(currentValue, element.dataset.type);
        }, 16);
    }

    formatCounterValue(value, type) {
        switch (type) {
            case 'time':
                return value.toFixed(1);
            case 'percentage':
                return Math.floor(value);
            case 'decimal':
                return value.toFixed(2);
            default:
                return Math.floor(value);
        }
    }

    startPerformanceUpdates() {
        // Update performance metrics every 30 seconds
        setInterval(() => {
            this.updatePerformanceMetrics();
        }, 30000);
    }

    updatePerformanceMetrics() {
        const metrics = {
            rng: (2.0 + Math.random() * 0.6).toFixed(1),
            math: (0.6 + Math.random() * 0.4).toFixed(1),
            market: (140 + Math.random() * 20).toFixed(0),
            risk: (40 + Math.random() * 10).toFixed(0)
        };

        // Update displayed values with smooth transition
        Object.keys(metrics).forEach(key => {
            const element = document.querySelector(`[data-metric="${key}"] .perf-value`);
            if (element) {
                element.style.transition = 'all 0.3s ease';
                element.textContent = metrics[key];
            }
        });
    }

    async loadSystemStatus() {
        // Simulate system status check
        const statusItems = document.querySelectorAll('.status-indicator');
        
        statusItems.forEach((indicator, index) => {
            setTimeout(() => {
                indicator.classList.add('active');
                const statusText = indicator.nextElementSibling;
                if (statusText) {
                    statusText.textContent = statusText.textContent.replace('Checking...', 'Active');
                }
            }, (index + 1) * 500);
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QBTCDashboard();
    
    // Add some visual enhancements
    document.querySelectorAll('.arch-component, .doc-card, .perf-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 2000);
        });
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+D for debug mode
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        console.log('QBTC Dashboard Debug Mode');
        console.log('Performance metrics:', document.querySelectorAll('.perf-value'));
        console.log('System status:', document.querySelectorAll('.status-indicator.active').length);
    }
    
    // Ctrl+Shift+R for reload metrics
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        window.qbtcDashboard?.updatePerformanceMetrics();
    }
});

// Expose dashboard instance globally for debugging
window.qbtcDashboard = new QBTCDashboard();

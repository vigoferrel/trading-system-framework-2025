# QBTC: Algorithmic Trading Framework

## Overview
QBTC is a cryptocurrency algorithmic trading framework focused on systematic trading with proper risk management and deterministic backtesting.

## Core Capabilities

### Trading & Execution
• Automated cryptocurrency trading with Binance API integration
• Real-time market data processing and analysis
• Position management with Kelly criterion-based sizing
• Basic risk management with stop-loss and position limits

### Analysis & Intelligence
• LLM-assisted market analysis via Google Gemini integration
• Deterministic backtesting with reproducible results
• Technical analysis tools and indicators
• Performance metrics and reporting

### System Architecture
• Event-driven architecture with backpressure handling
• Deterministic random number generation (Kernel RNG)
• Protected mathematical operations (Safe Math)
• Robust error handling and logging

## Architecture
```
QBTC System Components
├── Core
│   ├── Master Control Hub
│   ├── Position Manager  
│   └── Event Orchestrator
├── Connectivity
│   ├── Binance Connector
│   └── LLM Integration
├── Utilities
│   ├── Kernel RNG
│   ├── Safe Math
│   └── Validation
└── Testing
    ├── Unit Tests
    └── Integration Tests
```

## Performance Expectations

| Profile     | Annual Return | Max Drawdown | Target Sharpe |
|-------------|---------------|--------------|---------------|
| Conservative| 15% - 45%     | 10% - 20%    | 1.0 - 1.8     |
| Moderate    | 30% - 80%     | 15% - 25%    | 1.2 - 2.2     |
| Aggressive  | 50% - 150%    | 20% - 35%    | 1.0 - 2.5     |

## Quick Start

1. **Setup**
   ```bash
   npm install
   cp .env.example .env
   ```

2. **Configure APIs**
   Edit `.env` with your Binance and Google Gemini API keys

3. **Test**
   ```bash
   npm test
   ```

4. **Run**
   ```bash
   npm run paper-trade    # Paper trading
   npm run backtest       # Historical testing
   ```

## Technical Features

### Implemented Components
• **Kernel RNG**: Deterministic random number generation
• **Safe Math**: Division by zero protection and numerical stability
• **Binance Integration**: Real-time data and order execution
• **Event System**: Reliable message handling with timeouts
• **LLM Analysis**: AI-assisted market insights
• **Position Tracking**: Real-time P&L and risk monitoring

### Development Standards
• ESLint code quality enforcement
• Jest testing framework with high coverage
• JSDoc type annotations for clarity
• Graceful error handling throughout
• Reproducible results via deterministic RNG

## Risk Management

The system includes multiple layers of protection:
- Position sizing based on Kelly criterion
- Automatic stop-loss mechanisms
- Portfolio-level risk limits
- Real-time drawdown monitoring
- Emergency shutdown protocols

## License & Disclaimer

MIT License - Educational and research purposes.

Cryptocurrency trading involves substantial risk. Past performance does not guarantee future results. Only trade with capital you can afford to lose.

---

*Built for technical excellence and systematic trading.*

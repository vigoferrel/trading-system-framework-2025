# QBTC Quick Start Guide
*Get running in 5 minutes or less*

## 🚀 **Instant Setup**

### Step 1: Prerequisites Check
```bash
node --version    # Must be >= 16.0.0
npm --version     # Must be >= 8.0.0
```

### Step 2: Installation
```bash
git clone [your-repo-url]
cd opciones
npm install
```

### Step 3: Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Step 4: Verify Installation
```bash
npm test
node demo/demo-quantum-system.js
```

## ⚡ **Essential Commands**

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests |
| `npm run test:stability` | Test quantum engine |
| `node demo/demo-quantum-system.js` | Basic demo |
| `node mvp-holders-options-system.js` | Full MVP system |

## 🎯 **First Run Tutorial**

### 1. Basic Quantum System Test
```javascript
const { KernelRNG } = require('./src/utils/kernel-rng');
const rng = new KernelRNG(42);
console.log('Quantum random:', rng.uniform());
```

### 2. Safe Math Operations
```javascript
const { SafeMath } = require('./src/utils/safe-math');
const math = new SafeMath();
console.log('Safe division:', math.safeDiv(10, 3));
```

### 3. Options Pricing Demo
```javascript
node demo/demo-real-costs-impact.js
```

## 🔧 **Troubleshooting**

| Problem | Solution |
|---------|----------|
| `npm install` fails | Clear cache: `npm cache clean --force` |
| Tests fail | Check Node.js version >= 16.0.0 |
| API errors | Verify .env configuration |
| Port conflicts | Check ports 3000, 4603, 5000 are free |

## 📚 **Next Steps**

1. **Read Architecture**: `TECHNICAL-ARCHITECTURE.md`
2. **Commercial Use**: `COMMERCIAL-APPLICATIONS.md`
3. **Full Documentation**: `README.md`
4. **Academic Papers**: `docs/` directory

## 🆘 **Quick Help**

- **Installation Issues**: Follow prerequisites exactly
- **Testing Problems**: Ensure clean Node.js environment
- **Configuration**: Copy .env.example and edit carefully
- **Performance**: System requires minimum 4GB RAM

---

*This guide gets you running in 5 minutes. For comprehensive information, see the main README.md*

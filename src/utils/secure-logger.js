/**
 * SECURE LOGGER - FALLBACK PARA SMOKE TEST
 * ========================================
 * 
 * Logger simplificado que usa console con prefijos estructurados
 * Para smoke test del sistema θ-aware
 */

class SecureLogger {
    constructor(component = 'QBTC') {
        this.component = component;
        this.timestamp = () => new Date().toISOString();
    }

    info(message, ...args) {
        console.log(`[${this.timestamp()}] [INFO] [${this.component}] ${message}`, ...args);
    }

    warn(message, ...args) {
        console.warn(`[${this.timestamp()}] [WARN] [${this.component}] ${message}`, ...args);
    }

    error(message, ...args) {
        console.error(`[${this.timestamp()}] [ERROR] [${this.component}] ${message}`, ...args);
    }

    debug(message, ...args) {
        console.log(`[${this.timestamp()}] [DEBUG] [${this.component}] ${message}`, ...args);
    }

    createLogger(name) {
        return new SecureLogger(name);
    }
}

// Para compatibilidad con diferentes patrones de uso
const secureLogger = SecureLogger;

module.exports = {
    SecureLogger,
    secureLogger
};

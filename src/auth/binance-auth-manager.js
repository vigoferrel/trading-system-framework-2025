"use strict";

const crypto = require("crypto");
const EventEmitter = require("events");

/**
 * BinanceAuthManager: Gestión segura de credenciales Binance
 * - Validación de API keys
 * - Rotación automática de secretos
 * - Encriptación local de credenciales
 * - Cumple reglas: kernel RNG, métricas en background
 */
class BinanceAuthManager extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.opts = {
      encryptionEnabled: true,
      validationInterval: 300000, // 5 minutos
      rotationWarningDays: 30, // Avisar 30 días antes
      ...opts
    };
    
    this.credentials = new Map();
    this.encryptionKey = null;
    this.lastValidation = 0;
    this.metrics = {
      validationsPerformed: 0,
      credentialsStored: 0,
      lastRotationCheck: 0,
      warnings: []
    };
    
    this._validationInterval = null;
    this._metricsInterval = null;
  }

  async initialize() {
    // Generar clave de encriptación usando kernel RNG
    this.encryptionKey = crypto.randomBytes(32);
    
    // Iniciar validaciones periódicas en background
    this._startValidationLoop();
    this._startMetricsCollection();
    
    this.emit("initialized", { at: Date.now() });
  }

  /**
   * Almacenar credenciales de forma segura
   */
  async storeCredentials(name, apiKey, apiSecret, opts = {}) {
    if (!apiKey || !apiSecret) {
      throw new Error("API key and secret are required");
    }
    
    const credentialData = {
      name,
      apiKey,
      apiSecret: this._encrypt(apiSecret),
      createdAt: Date.now(),
      lastUsed: 0,
      isValid: null,
      testnet: opts.testnet ?? true,
      permissions: opts.permissions || [],
      expiresAt: opts.expiresAt || null
    };
    
    this.credentials.set(name, credentialData);
    this.metrics.credentialsStored++;
    
    this.emit("credentials_stored", { name, testnet: credentialData.testnet });
    
    // Validar inmediatamente
    await this.validateCredentials(name);
    
    return true;
  }

  /**
   * Obtener credenciales desencriptadas
   */
  getCredentials(name) {
    const creds = this.credentials.get(name);
    if (!creds) {
      throw new Error(`Credentials '${name}' not found`);
    }
    
    return {
      name: creds.name,
      apiKey: creds.apiKey,
      apiSecret: this._decrypt(creds.apiSecret),
      testnet: creds.testnet,
      isValid: creds.isValid,
      lastUsed: creds.lastUsed
    };
  }

  /**
   * Validar credenciales contra Binance API
   */
  async validateCredentials(name) {
    const creds = this.credentials.get(name);
    if (!creds) {
      throw new Error(`Credentials '${name}' not found`);
    }
    
    try {
      const { BinanceRealConnector } = require("../connectors/binance-real-connector");
      
      const testConnector = new BinanceRealConnector({
        testnet: creds.testnet,
        apiKey: creds.apiKey,
        apiSecret: this._decrypt(creds.apiSecret)
      });
      
      await testConnector.initialize();
      
      // Intentar obtener información de cuenta para validar
      const accountInfo = await testConnector.getAccountInfo();
      
      // Si llegamos aquí, las credenciales son válidas
      creds.isValid = true;
      creds.lastValidated = Date.now();
      this.metrics.validationsPerformed++;
      
      this.emit("credentials_validated", { 
        name, 
        valid: true,
        permissions: accountInfo.permissions || []
      });
      
      return true;
      
    } catch (error) {
      creds.isValid = false;
      creds.lastError = error.message;
      
      this.emit("credentials_invalid", { 
        name, 
        error: error.message,
        testnet: creds.testnet 
      });
      
      return false;
    }
  }

  /**
   * Validar todas las credenciales almacenadas
   */
  async validateAllCredentials() {
    const results = [];
    
    for (const [name] of this.credentials) {
      try {
        const isValid = await this.validateCredentials(name);
        results.push({ name, valid: isValid });
      } catch (error) {
        results.push({ name, valid: false, error: error.message });
      }
    }
    
    this.emit("bulk_validation_complete", { results, at: Date.now() });
    return results;
  }

  /**
   * Verificar si las credenciales necesitan rotación
   */
  checkRotationNeeds() {
    const warnings = [];
    const now = Date.now();
    
    for (const [name, creds] of this.credentials) {
      if (creds.expiresAt && creds.expiresAt - now < (this.opts.rotationWarningDays * 24 * 60 * 60 * 1000)) {
        warnings.push({
          name,
          daysUntilExpiry: Math.ceil((creds.expiresAt - now) / (24 * 60 * 60 * 1000)),
          message: `Credentials '${name}' expire soon`
        });
      }
      
      // Verificar uso reciente
      if (creds.lastUsed && (now - creds.lastUsed) > (90 * 24 * 60 * 60 * 1000)) {
        warnings.push({
          name,
          daysSinceLastUse: Math.ceil((now - creds.lastUsed) / (24 * 60 * 60 * 1000)),
          message: `Credentials '${name}' haven't been used recently`
        });
      }
    }
    
    this.metrics.warnings = warnings;
    this.metrics.lastRotationCheck = now;
    
    if (warnings.length > 0) {
      this.emit("rotation_warnings", warnings);
    }
    
    return warnings;
  }

  /**
   * Eliminar credenciales
   */
  removeCredentials(name) {
    const existed = this.credentials.delete(name);
    if (existed) {
      this.metrics.credentialsStored--;
      this.emit("credentials_removed", { name });
    }
    return existed;
  }

  /**
   * Listar todas las credenciales (sin secretos)
   */
  listCredentials() {
    const list = [];
    for (const [name, creds] of this.credentials) {
      list.push({
        name,
        testnet: creds.testnet,
        isValid: creds.isValid,
        createdAt: creds.createdAt,
        lastUsed: creds.lastUsed,
        lastValidated: creds.lastValidated,
        permissions: creds.permissions
      });
    }
    return list;
  }

  /**
   * Obtener métricas del sistema
   */
  getMetrics() {
    return {
      ...this.metrics,
      totalCredentials: this.credentials.size,
      lastValidation: this.lastValidation
    };
  }

  // Métodos privados
  _encrypt(text) {
    if (!this.opts.encryptionEnabled) return text;
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher("aes-256-cbc", this.encryptionKey);
    
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    
    return iv.toString("hex") + ":" + encrypted;
  }

  _decrypt(encryptedText) {
    if (!this.opts.encryptionEnabled) return encryptedText;
    
    const parts = encryptedText.split(":");
    // const iv = Buffer.from(parts[0], "hex"); // IV not used in createDecipher
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipher("aes-256-cbc", this.encryptionKey);
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  }

  _startValidationLoop() {
    this._validationInterval = setInterval(async () => {
      try {
        await this.validateAllCredentials();
        this.checkRotationNeeds();
        this.lastValidation = Date.now();
      } catch (error) {
        this.emit("validation_error", { error: error.message });
      }
    }, this.opts.validationInterval);
  }

  _startMetricsCollection() {
    this._metricsInterval = setInterval(() => {
      this.emit("metrics", this.getMetrics());
    }, 5000); // Métricas cada 5 segundos (rule compliance)
  }

  async stop() {
    if (this._validationInterval) {
      clearInterval(this._validationInterval);
      this._validationInterval = null;
    }
    
    if (this._metricsInterval) {
      clearInterval(this._metricsInterval);
      this._metricsInterval = null;
    }
    
    this.emit("stopped", { at: Date.now() });
  }
}

module.exports = { BinanceAuthManager };

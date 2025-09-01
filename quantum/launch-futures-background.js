
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

/**
 * LAUNCH FUTURES BOT BACKGROUND
 * =============================
 * Launcher para ejecutar el bot de Futuros (UM) en segundo plano con manejo de PID y logs.
 * Ejecuta: quantum/integrated-system.js
 */

require('dotenv').config({ path: '../.env' });
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  scriptPath: path.join(__dirname, 'integrated-system.js'),
  logsDir: path.join(__dirname, '../logs'),
  logFile: path.join(__dirname, '../logs/futures-launch.log'),
  pidFile: path.join(__dirname, '../logs/futures-launch.pid'),
  nodeArgs: [],
};

class FuturesLauncher {
  constructor(cfg) {
    this.config = cfg;
    this.childProcess = null;
    this.ensureDirectories();
  }

  ensureDirectories() {
    try {
      if (!fs.existsSync(this.config.logsDir)) {
        fs.mkdirSync(this.config.logsDir, { recursive: true });
      }
    } catch (e) {
      console.error('Error creando directorios de log:', e?.message || e);
    }
  }

  checkEnv() {
    const required = ['BINANCE_API_KEY', 'BINANCE_API_SECRET'];
    const missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
      throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
    }
  }

  isProcessRunning() {
    try {
      if (fs.existsSync(this.config.pidFile)) {
        const pid = parseInt(fs.readFileSync(this.config.pidFile, 'utf8'));
        if (!pid || Number.isNaN(pid)) return false;
        try {
          process.kill(pid, 0);
          return true;
        } catch (_) {
          try { fs.unlinkSync(this.config.pidFile); } catch {}
          return false;
        }
      }
      return false;
    } catch (e) {
      console.warn('Aviso verificando proceso:', e?.message || e);
      return false;
    }
  }

  async start() {
    try {
      console.log('[START] Lanzando FUTURES BOT en segundo plano...');
      this.checkEnv();

      if (this.isProcessRunning()) {
        const pid = fs.readFileSync(this.config.pidFile, 'utf8');
        console.warn(`[WARNING] Ya existe un proceso ejecutándose (PID ${pid})`);
        return false;
      }

      const child = spawn('node', [this.config.scriptPath, ...this.config.nodeArgs], {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: process.env,
      });

      this.childProcess = child;

      const out = fs.createWriteStream(this.config.logFile, { flags: 'a' });
      const err = fs.createWriteStream(this.config.logFile, { flags: 'a' });
      child.stdout.pipe(out);
      child.stderr.pipe(err);

      fs.writeFileSync(this.config.pidFile, String(child.pid));

      child.unref();

      console.log('[OK] Proceso iniciado');
      console.log(`[DATA] PID: ${child.pid}`);
      console.log(` Log: ${this.config.logFile}`);
      return true;
    } catch (e) {
      console.error('[ERROR] Error al iniciar:', e?.message || e);
      return false;
    }
  }

  async stop() {
    try {
      if (!fs.existsSync(this.config.pidFile)) {
        console.log('[WARNING] No hay proceso en ejecución');
        return false;
      }
      const pid = parseInt(fs.readFileSync(this.config.pidFile, 'utf8'));
      console.log(` Deteniendo proceso PID=${pid} ...`);

      try {
        process.kill(pid, 'SIGTERM');
      } catch (e) {
        console.warn('Aviso enviando SIGTERM:', e?.message || e);
      }

      await new Promise((r) => setTimeout(r, 3000));

      // Verificar si sigue vivo
      try {
        process.kill(pid, 0);
        console.log('[ALERT] Proceso aún activo, forzando SIGKILL...');
        try {
          process.kill(pid, 'SIGKILL');
        } catch (e) {
          console.warn('Aviso enviando SIGKILL:', e?.message || e);
        }
      } catch {
        // Ya no existe
      }

      try { fs.unlinkSync(this.config.pidFile); } catch {}

      console.log('[OK] Proceso detenido');
      return true;
    } catch (e) {
      console.error('[ERROR] Error deteniendo proceso:', e?.message || e);
      return false;
    }
  }

  status() {
    try {
      const running = this.isProcessRunning();
      const pid = running ? parseInt(fs.readFileSync(this.config.pidFile, 'utf8')) : null;
      const status = {
        running,
        pid,
        pidFile: this.config.pidFile,
        logFile: this.config.logFile,
      };
      console.log('[DATA] Estado del FUTURES BOT:');
      console.log(JSON.stringify(status, null, 2));
      return status;
    } catch (e) {
      const status = { running: false, error: e?.message || e };
      console.log('[DATA] Estado del FUTURES BOT:');
      console.log(JSON.stringify(status, null, 2));
      return status;
    }
  }

  logs(lines = 100) {
    try {
      if (!fs.existsSync(this.config.logFile)) {
        console.log('[WARNING] Aún no existe archivo de logs');
        return;
      }
      const content = fs.readFileSync(this.config.logFile, 'utf8');
      const arr = content.split('\n');
      const slice = arr.slice(-Math.max(1, lines));
      console.log(` Últimas ${Math.min(lines, arr.length)} líneas de ${this.config.logFile}:`);
      console.log('='.repeat(60));
      slice.forEach((line) => line.trim() && console.log(line));
    } catch (e) {
      console.error('[ERROR] Error leyendo logs:', e?.message || e);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = (args[0] || 'start').toLowerCase();
  const launcher = new FuturesLauncher(CONFIG);

  switch (cmd) {
    case 'start': {
      const ok = await launcher.start();
      process.exit(ok ? 0 : 1);
    }
    case 'stop': {
      const ok = await launcher.stop();
      process.exit(ok ? 0 : 1);
    }
    case 'status': {
      launcher.status();
      process.exit(0);
    }
    case 'logs': {
      const n = parseInt(args[1] || '100', 10);
      launcher.logs(Number.isFinite(n) ? n : 100);
      process.exit(0);
    }
    default: {
      console.log('Uso: node quantum/launch-futures-background.js [start|stop|status|logs] [lines]');
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error('Error fatal:', e?.message || e);
    process.exit(1);
  });
}

module.exports = { FuturesLauncher: FuturesLauncher, CONFIG };
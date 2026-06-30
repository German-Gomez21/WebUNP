import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private readonly LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
  };

  private readonly currentLogLevel = this.LOG_LEVELS.INFO; // Configurable por entorno

  constructor() {}

  // Logging seguro sin exponer información sensible
  error(message: string, error?: any, context?: any): void {
    this.log('ERROR', message, error, context);
  }

  warn(message: string, context?: any): void {
    this.log('WARN', message, undefined, context);
  }

  info(message: string, context?: any): void {
    this.log('INFO', message, undefined, context);
  }

  debug(message: string, context?: any): void {
    this.log('DEBUG', message, undefined, context);
  }

  private log(level: string, message: string, error?: any, context?: any): void {
    const logLevel = this.LOG_LEVELS[level as keyof typeof this.LOG_LEVELS];
    
    if (logLevel > this.currentLogLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const sanitizedContext = this.sanitizeContext(context);
    
    const logEntry = {
      timestamp,
      level,
      message: this.sanitizeMessage(message),
      error: error ? this.sanitizeError(error) : undefined,
      context: sanitizedContext,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // En desarrollo, mostrar en consola
    if (this.isDevelopment()) {
      this.consoleLog(logEntry);
    }

    // En producción, enviar a servicio de logging
    if (this.isProduction()) {
      this.sendToLogService(logEntry);
    }
  }

  private sanitizeMessage(message: string): string {
    // Remover información sensible
    return message
      .replace(/password\s*[:=]\s*\S+/gi, 'password: [REDACTED]')
      .replace(/token\s*[:=]\s*\S+/gi, 'token: [REDACTED]')
      .replace(/secret\s*[:=]\s*\S+/gi, 'secret: [REDACTED]')
      .replace(/key\s*[:=]\s*\S+/gi, 'key: [REDACTED]');
  }

  private sanitizeContext(context: any): any {
    if (!context) return undefined;

    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization', 'credential'];

    sensitiveKeys.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private sanitizeError(error: any): any {
    if (!error) return undefined;

    return {
      name: error.name,
      message: this.sanitizeMessage(error.message),
      stack: error.stack ? this.sanitizeMessage(error.stack) : undefined,
      timestamp: error.timestamp
    };
  }

  private consoleLog(logEntry: any): void {
    const style = this.getLogStyle(logEntry.level);
    console.log(
      `%c${logEntry.timestamp} [${logEntry.level}] ${logEntry.message}`,
      style,
      logEntry.context || logEntry.error
    );
  }

  private getLogStyle(level: string): string {
    switch (level) {
      case 'ERROR':
        return 'color: #ff4444; font-weight: bold;';
      case 'WARN':
        return 'color: #ffaa00; font-weight: bold;';
      case 'INFO':
        return 'color: #4444ff; font-weight: normal;';
      case 'DEBUG':
        return 'color: #888888; font-weight: normal;';
      default:
        return 'color: #000000; font-weight: normal;';
    }
  }

  private async sendToLogService(logEntry: any): Promise<void> {
    try {
      // En producción, enviar a servicio externo como Sentry, LogRocket, etc.
      // Por ahora, solo almacenar localmente de forma segura
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(logEntry);
      
      // Mantener solo los últimos 100 logs para evitar sobrecarga
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (e) {
      // Evitar recursión infinita si el logging falla
      console.error('Failed to send log to service:', e);
    }
  }

  private isDevelopment(): boolean {
    return !this.isProduction();
  }

  private isProduction(): boolean {
    return window.location.hostname !== 'localhost' && 
           window.location.hostname !== '127.0.0.1' &&
           !window.location.hostname.includes('.local');
  }

  // Método para obtener logs para debugging (solo en desarrollo)
  getLogs(): any[] {
    if (this.isDevelopment()) {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    }
    return [];
  }

  // Método para limpiar logs
  clearLogs(): void {
    localStorage.removeItem('app_logs');
  }
}

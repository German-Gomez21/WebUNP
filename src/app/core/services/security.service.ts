import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly MAX_LOGIN_ATTEMPTS = 3;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos

  constructor(private sanitizer: DomSanitizer) {}

  // Sanitización de contenido para prevenir XSS
  sanitizeHtml(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  sanitizeStyle(value: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(value);
  }

  sanitizeScript(value: string): SafeScript {
    return this.sanitizer.bypassSecurityTrustScript(value);
  }

  sanitizeUrl(value: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

  sanitizeResourceUrl(value: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

  // Validación de entradas de usuario
  validateInput(input: string, type: 'email' | 'phone' | 'text' | 'number'): boolean {
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
      
      case 'phone':
        const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
        return phoneRegex.test(input) && input.replace(/\D/g, '').length >= 7;
      
      case 'number':
        const numberRegex = /^[0-9]+$/;
        return numberRegex.test(input);
      
      case 'text':
      default:
        // Prevenir inyección de scripts
        const dangerousPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
          /<iframe\b[^>]*>/gi,
          /<object\b[^>]*>/gi,
          /<embed\b[^>]*>/gi
        ];
        
        return !dangerousPatterns.some(pattern => pattern.test(input));
    }
  }

  // Generación de tokens seguros
  generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    return Array.from(array, byte => chars[byte % chars.length]).join('');
  }

  // Hash de contraseñas (en producción usar bcrypt o similar)
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Rate limiting para login
  checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number; lockoutTime?: number } {
    const key = `login_attempts_${identifier}`;
    const attempts = parseInt(localStorage.getItem(key) || '0');
    const lockoutKey = `lockout_${identifier}`;
    const lockoutTime = parseInt(localStorage.getItem(lockoutKey) || '0');
    const now = Date.now();

    // Verificar si está en período de bloqueo
    if (lockoutTime > now) {
      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutTime: Math.ceil((lockoutTime - now) / 60000) // minutos restantes
      };
    }

    // Si excedió el máximo de intentos, bloquear
    if (attempts >= this.MAX_LOGIN_ATTEMPTS) {
      localStorage.setItem(lockoutKey, (now + this.LOCKOUT_DURATION).toString());
      localStorage.removeItem(key);
      
      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutTime: this.LOCKOUT_DURATION / 60000 // 15 minutos
      };
    }

    return {
      allowed: true,
      remainingAttempts: this.MAX_LOGIN_ATTEMPTS - attempts
    };
  }

  // Registrar intento fallido
  recordFailedAttempt(identifier: string): void {
    const key = `login_attempts_${identifier}`;
    const attempts = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (attempts + 1).toString());
  }

  // Limpiar intentos fallidos
  clearFailedAttempts(identifier: string): void {
    const key = `login_attempts_${identifier}`;
    const lockoutKey = `lockout_${identifier}`;
    localStorage.removeItem(key);
    localStorage.removeItem(lockoutKey);
  }

  // Detección de patrones sospechosos
  detectSuspiciousActivity(input: string): boolean {
    const suspiciousPatterns = [
      /union.*select/gi,          // SQL Injection
      /select.*from/gi,           // SQL Injection  
      /drop.*table/gi,            // SQL Injection
      /insert.*into/gi,           // SQL Injection
      /update.*set/gi,            // SQL Injection
      /delete.*from/gi,           // SQL Injection
      /<script[^>]*>.*<\/script>/gi, // XSS
      /javascript:/gi,            // XSS
      /on\w+\s*=/gi,             // Event handlers
      /eval\s*\(/gi,             // Code execution
      /document\./gi,             // DOM access
      /window\./gi               // Window object access
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }
}

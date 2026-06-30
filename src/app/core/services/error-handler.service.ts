import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private logger: LoggerService) {}

  handleError(error: any): void {
    let errorMessage = 'Ha ocurrido un error inesperado';
    let errorType = 'UNKNOWN_ERROR';

    if (error instanceof HttpErrorResponse) {
      // Errores HTTP
      errorType = 'HTTP_ERROR';
      
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar al servidor. Verifica tu conexión a internet.';
          break;
        case 400:
          errorMessage = 'Solicitud inválida. Por favor, verifica los datos enviados.';
          break;
        case 401:
          errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
          this.clearAuthData();
          break;
        case 403:
          errorMessage = 'Acceso denegado. No tienes permisos para realizar esta acción.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 429:
          errorMessage = 'Demasiadas solicitudes. Por favor, espera un momento e intenta nuevamente.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
          break;
        case 503:
          errorMessage = 'Servicio no disponible. Por favor, intenta más tarde.';
          break;
        default:
          errorMessage = `Error del servidor (${error.status}): ${error.message || 'Error desconocido'}`;
      }
    } else if (error instanceof Error) {
      // Errores de JavaScript
      errorType = 'JAVASCRIPT_ERROR';
      errorMessage = error.message || 'Error de JavaScript';
    } else if (typeof error === 'string') {
      // Errores como string
      errorType = 'STRING_ERROR';
      errorMessage = error;
    }

    // Loggear el error con información sanitizada
    this.logger.error(errorMessage, error, {
      type: errorType,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // En modo desarrollo, mostrar error completo en consola
    if (this.isDevelopment()) {
      console.error('Error detallado:', error);
    }
  }

  private clearAuthData(): void {
    // Limpiar datos de autenticación en caso de error 401
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_session');
  }

  private isDevelopment(): boolean {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('.local');
  }

  // Método para crear mensajes de error amigables para el usuario
  getUserFriendlyMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.';
        case 401:
          return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        case 403:
          return 'No tienes permisos para realizar esta acción.';
        case 404:
          return 'El recurso solicitado no fue encontrado.';
        case 429:
          return 'Has realizado demasiadas solicitudes. Por favor, espera unos minutos.';
        case 500:
        case 503:
          return 'El servidor está experimentando problemas. Por favor, intenta más tarde.';
        default:
          return 'Ocurrió un error al procesar tu solicitud.';
      }
    }
    
    return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    url: string;
    filename: string;
    size: number;
    thumbnail_url?: string;
  };
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly API_URL = 'https://api.unp.gov.co'; // Compatible con Django REST
  
  constructor(private http: HttpClient) {}

  /**
   * Valida el archivo antes de subir
   */
  validateFile(file: File): Promise<{ valid: boolean; error?: string }> {
    // Validaciones de formato
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return Promise.resolve({
        valid: false,
        error: 'Formato no permitido. Use JPEG, PNG, WebP o SVG'
      });
    }

    // Validaciones de tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return Promise.resolve({
        valid: false,
        error: 'El archivo es demasiado grande. Máximo permitido: 5MB'
      });
    }

    // Validaciones de dimensiones (para imágenes)
    if (file.type.startsWith('image/')) {
      return this.validateImageDimensions(file);
    }

    return Promise.resolve({ valid: true });
  }

  /**
   * Valida las dimensiones de la imagen
   */
  private validateImageDimensions(file: File): Promise<{ valid: boolean; error?: string }> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        // Mínimo: 400x300px, Máximo: 4000x3000px
        if (img.width < 400 || img.height < 300) {
          resolve({
            valid: false,
            error: 'La imagen es muy pequeña. Mínimo: 400x300px'
          });
        } else if (img.width > 4000 || img.height > 3000) {
          resolve({
            valid: false,
            error: 'La imagen es muy grande. Máximo: 4000x3000px'
          });
        } else {
          resolve({ valid: true });
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          valid: false,
          error: 'No se pudo leer la imagen. Verifique el archivo.'
        });
      };
      
      img.src = url;
    });
  }

  /**
   * Genera thumbnail automáticamente
   */
  generateThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Dimensiones del thumbnail (150x150px)
        canvas.width = 150;
        canvas.height = 150;
        
        // Calcular aspect ratio
        const scale = Math.min(150 / img.width, 150 / img.height);
        const x = (150 - img.width * scale) / 2;
        const y = (150 - img.height * scale) / 2;
        
        // Dibujar imagen centrada
        if (ctx) {
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
        
        // Convertir a blob y luego a URL
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailUrl = URL.createObjectURL(blob);
            resolve(thumbnailUrl);
          } else {
            reject(new Error('No se pudo generar el thumbnail'));
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Sube archivo con progreso
   */
  uploadFile(file: File, additionalData?: any): Observable<UploadProgress | UploadResponse> {
    const formData = new FormData();
    
    // Agregar archivo
    formData.append('file', file);
    
    // Agregar datos adicionales
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return new Observable(observer => {
      const req = this.http.post<UploadResponse>(
        `${this.API_URL}/api/upload/`,
        formData,
        {
          reportProgress: true,
          observe: 'events'
        }
      );

      const subscription = req.subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              const progress: UploadProgress = {
                loaded: event.loaded,
                total: event.total,
                percentage: Math.round((event.loaded / event.total) * 100)
              };
              observer.next(progress);
            }
          } else if (event.type === HttpEventType.Response) {
            const response = event.body;
            if (response?.success) {
              observer.next(response);
              observer.complete();
            } else {
              observer.error(response?.message || 'Error en la subida');
            }
          }
        },
        error: (error) => {
          const errorMessage = error.error?.message || error.message || 'Error de conexión';
          observer.error(errorMessage);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    });
  }

  /**
   * Sube múltiples archivos
   */
  uploadMultipleFiles(files: File[], additionalData?: any): Observable<UploadProgress | UploadResponse>[] {
    return files.map(file => this.uploadFile(file, additionalData));
  }

  /**
   * Elimina archivo del servidor
   */
  deleteFile(filename: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.API_URL}/api/upload/${filename}`
    ).pipe(
      catchError(error => {
        const message = error.error?.message || 'Error al eliminar archivo';
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Formatea tamaño de archivo
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

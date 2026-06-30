import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clonar la solicitud y añadir headers de seguridad
    const secureReq = req.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      // Asegurar que solo se envíen a HTTPS en producción
      url: req.url.startsWith('http') ? req.url.replace('http://', 'https://') : req.url
    });

    return next.handle(secureReq);
  }
}

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  private csrfToken: string | null = null;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Para solicitudes que modifican datos (POST, PUT, DELETE, PATCH)
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      // Añadir token CSRF si está disponible
      if (this.csrfToken) {
        const secureReq = req.clone({
          setHeaders: {
            'X-CSRF-TOKEN': this.csrfToken
          }
        });
        return next.handle(secureReq);
      }
    }

    // Capturar token CSRF de las respuestas
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const csrfToken = event.headers.get('X-CSRF-TOKEN');
          if (csrfToken) {
            this.csrfToken = csrfToken;
          }
        }
      })
    );
  }
}

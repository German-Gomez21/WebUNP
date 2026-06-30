import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { SecurityInterceptor } from './core/interceptors/security.interceptor';
import { CsrfInterceptor } from './core/interceptors/csrf.interceptor';

// Configuración principal de la aplicación UNP para Angular v17+ con seguridad reforzada
// Equivalente al app.module.js de AngularJS pero con configuración moderna standalone y seguridad
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecurityInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true
    }
  ]
};

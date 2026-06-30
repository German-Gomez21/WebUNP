import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Punto de entrada principal de la aplicación UNP
// Equivalente al ng-app de AngularJS pero con bootstrap moderno standalone
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Error al iniciar la aplicación UNP:', err));

// Mantener compatibilidad con scripts legacy si existen
declare global {
  interface Window {
    unpApp?: any;
    heroCarousel?: any;
  }
}

// Inicialización global para compatibilidad
window.unpApp = {
  appName: 'Unidad Nacional de Protección',
  version: '17.0.0',
  framework: 'Angular Latest'
};

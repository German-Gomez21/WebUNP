import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  // Estado de la aplicación - reemplaza a $rootScope
  appName = 'Unidad Nacional de Protección';
  currentYear = new Date().getFullYear();
  
  private routerSubscription: Subscription | null = null;

  constructor(
    private titleService: Title,
    private router: Router
  ) {
    console.log('UNP App iniciada - Angular v17+');
  }

  ngOnInit(): void {
    // Escuchar cambios de ruta para actualizar el título
    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updatePageTitle(event.urlAfterRedirects);
    });
  }

  // Actualizar el título de la página basado en la ruta
  private updatePageTitle(url: string): void {
    const routeTitle = this.getRouteTitle(url);
    this.titleService.setTitle(routeTitle);
  }

  // Obtener título basado en la ruta actual
  private getRouteTitle(url: string): string {
    // Mapeo de rutas a títulos - mismo comportamiento que AngularJS
    const titleMap: { [key: string]: string } = {
      '': 'Inicio - Unidad Nacional de Protección',
      'home': 'Inicio - Unidad Nacional de Protección',
      'la-unp': 'La UNP - Unidad Nacional de Protección',
      'transparencia': 'Transparencia - Unidad Nacional de Protección',
      'normativa': 'Normativa - Unidad Nacional de Protección',
      'atencion-servicios': 'Atención y Servicios - Unidad Nacional de Protección',
      'planeacion-gestion': 'Planeación, Gestión y Control - Unidad Nacional de Protección',
      'participa': 'Participa - Unidad Nacional de Protección',
      'linea-vida-103': 'Línea Vida 103 - Unidad Nacional de Protección',
      'pqrsd': 'PQRSD - Unidad Nacional de Protección',
      'tramites': 'Trámites - Unidad Nacional de Protección',
      'noticias': 'Noticias - Unidad Nacional de Protección',
      'contacto': 'Contacto - Unidad Nacional de Protección',
      'faq': 'Preguntas Frecuentes - Unidad Nacional de Protección',
      'directorio': 'Directorio - Unidad Nacional de Protección'
    };

    // Extraer la ruta base
    const path = url.replace('/', '').split('/')[0];
    return titleMap[path] || 'Unidad Nacional de Protección';
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}

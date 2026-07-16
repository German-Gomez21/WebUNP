import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component')
      .then(m => m.HomeComponent),
    title: 'Inicio - Unidad Nacional de Protección'
  },
  {
    path: 'la-unp',
    loadComponent: () => import('./features/la-unp/la-unp.component')
      .then(m => m.LaUnpComponent),
    title: 'La UNP - Unidad Nacional de Protección'
  },
  {
    path: 'quienes-somos',
    loadComponent: () => import('./features/quienes-somos/quienes-somos.component')
      .then(m => m.QuienesSomosComponent),
    title: 'Quiénes Somos - Unidad Nacional de Protección'
  },
  {
    path: 'linea-vida-103',
    loadComponent: () => import('./features/linea-vida-103/linea-vida-103.component')
      .then(m => m.LineaVida103Component),
    title: 'Línea Vida 103 - Unidad Nacional de Protección'
  },
  {
    path: 'transparencia',
    loadComponent: () => import('./features/transparencia/transparencia.component')
      .then(m => m.TransparenciaComponent),
    title: 'Transparencia - Unidad Nacional de Protección'
  },
  {
    path: 'normativa',
    loadComponent: () => import('./features/normativa/normativa.component')
      .then(m => m.NormativaComponent),
    title: 'Normativa - Unidad Nacional de Protección'
  },
  {
    path: 'atencion-servicios/tramites',
    loadComponent: () => import('./features/tramites-servicios/tramites-servicios.component').then(m => m.TramitesServiciosComponent),
    title: 'Trámites y Servicios - Unidad Nacional de Protección'
  },
  {
    path: 'pqrsd',
    loadComponent: () => import('./features/pqrsd/pqrsd.component').then(m => m.PqrsdComponent),
    title: 'PQRSD - Unidad Nacional de Protección'
  },
  {
    path: 'noticias',
    loadComponent: () => import('./features/noticias/noticias.component').then(m => m.NoticiasComponent),
    title: 'Noticias - Unidad Nacional de Protección'
  },
  {
    path: 'noticias/:slug',
    loadComponent: () => import('./features/noticias/noticias-detail.component').then(m => m.NoticiasDetailComponent),
    title: 'Detalle de noticia - Unidad Nacional de Protección'
  },
  {
    path: 'atencion-servicios/pqrsd',
    redirectTo: 'pqrsd',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard, AdminGuard],
    title: 'Panel Administrativo - UNP'
  },
  {
    path: 'admin/noticias',
    loadComponent: () => import('./features/admin/admin-news-panel.component')
      .then(m => m.AdminNewsPanelComponent),
    canActivate: [AuthGuard, AdminGuard],
    title: 'Gestión de Noticias - UNP'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

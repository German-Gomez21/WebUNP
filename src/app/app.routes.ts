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
    path: 'linea-vida-103',
    loadComponent: () => import('./features/linea-vida-103/linea-vida-103.component')
      .then(m => m.LineaVida103Component),
    title: 'Línea Vida 103 - Unidad Nacional de Protección'
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
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

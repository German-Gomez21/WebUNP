import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="access-denied-container">
      <div class="access-denied-content">
        <div class="error-icon" aria-hidden="true">
          <i class="material-icons">security</i>
        </div>
        <h1>Acceso Denegado</h1>
        <p>No tienes los permisos necesarios para acceder a esta página.</p>
        <p>Por favor, contacta al administrador del sistema si crees que esto es un error.</p>
        <div class="actions">
          <button type="button" (click)="goHome()" class="btn btn--primary">
            <i class="material-icons btn__icon btn__icon--left" aria-hidden="true">home</i>
            Ir al Inicio
          </button>
          <button type="button" (click)="goBack()" class="btn btn--secondary">
            <i class="material-icons btn__icon btn__icon--left" aria-hidden="true">arrow_back</i>
            Volver
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .access-denied-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
      padding: var(--space-5);
    }

    .access-denied-content {
      background: var(--color-surface-card);
      padding: var(--space-8);
      border-radius: var(--radius-lg);
      box-shadow: var(--elevation-2);
      text-align: center;
      max-width: 500px;
      width: 100%;
      border: 1px solid var(--color-border);
    }

    .error-icon {
      font-size: 4rem;
      color: var(--color-error);
      margin-bottom: var(--space-5);
      line-height: 1;
    }

    .error-icon .material-icons {
      font-size: inherit;
    }

    h1 {
      color: var(--color-text-primary);
      margin-bottom: var(--space-5);
      font-size: var(--type-display-sm);
      font-family: var(--font-family-base);
    }

    p {
      color: var(--color-text-secondary);
      margin-bottom: var(--space-4);
      line-height: var(--line-height-normal);
      font-family: var(--font-family-base);
    }

    .actions {
      margin-top: var(--space-7);
      display: flex;
      gap: var(--space-4);
      justify-content: center;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .access-denied-content {
        padding: var(--space-6);
      }

      .actions {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }
}

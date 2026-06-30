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
        <div class="error-icon">
          <i class="material-icons">security</i>
        </div>
        <h1>Acceso Denegado</h1>
        <p>No tienes los permisos necesarios para acceder a esta página.</p>
        <p>Por favor, contacta al administrador del sistema si crees que esto es un error.</p>
        <div class="actions">
          <button (click)="goHome()" class="btn-primary">
            <i class="material-icons">home</i>
            Ir al Inicio
          </button>
          <button (click)="goBack()" class="btn-secondary">
            <i class="material-icons">arrow_back</i>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .access-denied-content {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 500px;
      width: 100%;
    }

    .error-icon {
      font-size: 64px;
      color: #dc3545;
      margin-bottom: 20px;
    }

    h1 {
      color: #333;
      margin-bottom: 20px;
      font-size: 2.5em;
    }

    p {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.6;
    }

    .actions {
      margin-top: 30px;
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .access-denied-content {
        padding: 20px;
      }

      h1 {
        font-size: 2em;
      }

      .actions {
        flex-direction: column;
        align-items: center;
      }

      .btn-primary, .btn-secondary {
        width: 100%;
        max-width: 200px;
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

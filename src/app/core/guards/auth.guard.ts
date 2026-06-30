import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Verificar si el usuario está autenticado
    const isAuthenticated = this.checkAuthentication();
    
    if (!isAuthenticated) {
      // Redirigir a página de login o home
      return this.router.createUrlTree(['/']);
    }
    
    return true;
  }

  private checkAuthentication(): boolean {
    // Lógica de autenticación - verificar token, sesión, etc.
    const token = localStorage.getItem('auth_token');
    const session = sessionStorage.getItem('user_session');
    
    // Verificar validez del token
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // Token no expirado
        return payload.exp > currentTime;
      } catch (e) {
        // Token inválido
        localStorage.removeItem('auth_token');
        return false;
      }
    }
    
    return !!session;
  }
}

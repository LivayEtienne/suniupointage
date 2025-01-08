import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const token = localStorage.getItem('token'); // Vérifie si le token est stocké

    if (token) {
      return true; // Si le token existe, l'utilisateur peut accéder à la page
    } else {
      this.router.navigate(['/login']); // Redirige vers la page de connexion
      return false; // Bloque l'accès
    }
  }
}

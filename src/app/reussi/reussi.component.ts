import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Assurez-vous que le chemin est correct
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-reussi',
  imports: [ CommonModule ],
  templateUrl: './reussi.component.html',
  styleUrl: './reussi.component.css'
})
export class ReussiComponent {
  message: string = '';  // Message de succès ou d'erreur pour afficher lors de la déconnexion

  constructor(private authService: AuthService, private router: Router) {}

  // Méthode pour gérer la déconnexion
  logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Déconnexion réussie', response);
        localStorage.removeItem('authToken');
        this.message = 'Déconnexion réussie !';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      (error) => {
        console.error('Erreur lors de la déconnexion', error);
        this.message = 'Erreur de déconnexion';
      }
    );
  }
  
}
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
    const token = localStorage.getItem('authToken');  // Récupérer le token depuis le localStorage

    if (token) {
      this.authService.logout(token).subscribe(
        (response) => {
          // Si la déconnexion est réussie
          console.log('Déconnexion réussie', response);

          // Supprimer le token du localStorage
          localStorage.removeItem('authToken');

          // Afficher le message de déconnexion réussie
          this.message = 'Déconnexion réussie !';

          // Rediriger l'utilisateur vers la page de connexion après un court délai
          setTimeout(() => {
            this.router.navigate(['/login']);  // Redirection vers la page de connexion
          }, 2000);  // Attendre 2 secondes avant la redirection
        },
        (error) => {
          // En cas d'erreur de déconnexion
          console.error('Erreur lors de la déconnexion', error);
          this.message = 'Erreur de déconnexion';
        }
      );
    } else {
      this.message = 'Aucun token trouvé, vous êtes déjà déconnecté.';
    }
  }
}
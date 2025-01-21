import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Ajouter Validators ici
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-authentification',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css'] // Correction pour styleUrls
})
export class AuthentificationComponent {
  authForm: FormGroup;  // Formulaire réactif
  errorMessage: string = ''; // Message d'erreur générique

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    // Initialisation du formulaire avec les validations
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Validation de l'email
      password: ['', [Validators.required, Validators.minLength(6)]]  // Validation du mot de passe
    });
  }

  // Méthode pour gérer la soumission du formulaire
  onSubmit(): void {
    if (this.authForm.valid) {
      const { email, password } = this.authForm.value;

      this.authService.login(email, password).subscribe(
        (response) => {
          console.log('Connexion réussie', response);

          if (response && response.token) {
            // Enregistrer le token dans le localStorage
            localStorage.setItem('authToken', response.token);
            console.log('Token enregistré dans le localStorage');
          } else {
            console.error('Aucun token reçu dans la réponse');
          }

          this.router.navigate(['/reussi']); // Rediriger vers la page "reussi"
        },
        (error: any) => {
          console.error('Erreur de connexion', error);
          this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';  // Message d'erreur personnalisé
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';  // Message d'erreur si formulaire invalide
    }
  }

  // Méthode pour vérifier si un champ est valide
  isFieldInvalid(field: string): boolean {
    const control = this.authForm.get(field);
    return control ? (control.invalid && (control.touched || control.dirty)) : false;
  }
  
}

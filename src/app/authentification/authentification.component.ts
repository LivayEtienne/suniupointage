import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-authentification',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent {
  authForm: FormGroup;  // Formulaire réactif
  errorMessage: string = ''; // Message d'erreur générique

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    // Initialisation du formulaire avec les validations
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.customEmailValidator]],  // Validation de l'email
      password: ['', [Validators.required, Validators.minLength(6)]]  // Validation du mot de passe
    });
  }

  // Fonction de validation personnalisée pour l'email
  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    // Vérifie si l'email contient au moins un "@" et un "." après "@", et n'accepte pas les TLD trop courts
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Vérifie qu'il y a au moins 2 caractères pour le domaine de l'email après le point
    const validEmail = email && emailPattern.test(email);
    
    if (validEmail) {
      const domain = email.split('@')[1];
      const tld = domain.split('.').pop();
      // Rejette les TLD avec moins de 2 caractères (ex: .co, .tv, etc.)
      if (tld && tld.length < 2) {
        return { 'invalidTLD': true };
      }
    }

    return validEmail ? null : { 'invalidEmail': true };  // L'email est valide ou pas
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

  // Méthode pour afficher un message d'erreur spécifique pour le champ email
  getEmailErrorMessage() {
    const control = this.authForm.get('email');
    if (control?.hasError('required')) {
      return 'L\'email est requis.';
    }
    if (control?.hasError('email')) {
      return 'Format d\'email invalide. Exemple: example@gmail.com';
    }
    if (control?.hasError('invalidEmail')) {
      return 'L\'email doit avoir un format valide. Exemple: example@gmail.com';
    }
    if (control?.hasError('invalidTLD')) {
      return 'Le domaine de l\'email doit avoir un TLD valide (ex: .com, .org)';
    }
    return '';
  }

  // Méthode pour afficher un message d'erreur spécifique pour le champ mot de passe
  getPasswordErrorMessage() {
    const control = this.authForm.get('password');
    if (control?.hasError('required')) {
      return 'Le mot de passe est requis.';
    }
    if (control?.hasError('minlength')) {
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    return '';
  }

  // Suggestions pour l'email
  getEmailSuggestion() {
    const control = this.authForm.get('email');
    if (control?.hasError('email')) {
      return 'Assurez-vous que l\'email a un format correct, exemple: example@gmail.com';
    }
    return '';
  }

  // Suggestions pour le mot de passe
  getPasswordSuggestion() {
    const control = this.authForm.get('password');
    if (control?.hasError('minlength')) {
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    return 'Utilisez un mot de passe complexe (minimum 6 caractères).';
  }
}

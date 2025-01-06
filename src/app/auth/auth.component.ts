import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authentification',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  showErrorModal: boolean = false;  // Gérer l'affichage du modal
  authForm: FormGroup;  // Formulaire réactif pour l'email et mot de passe
  rfidCode: string = '';  // Code RFID pour l'authentification par RFID
  errorMessage: string = '';  // Message d'erreur générique
  authenticationMessage: string = '';  // Message d'authentification via RFID
  isAuthenticated: boolean = false;  // Statut d'authentification
  wsSubscription: Subscription | undefined;  // Pour stocker la souscription au WebSocket
  isCardInvalid: boolean = false;  // Variable pour afficher si la carte est invalide
  isScanning: boolean = false;  // Suivi de l'état de scanning

  constructor(
    private authService: AuthService,  // Service pour l'authentification
    private router: Router,  // Pour la redirection
    private fb: FormBuilder  // FormBuilder pour créer le formulaire réactif
  ) {
    // Initialisation du formulaire avec validation
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.customEmailValidator]],  // Validation de l'email
      password: ['', [Validators.required, Validators.minLength(6)]]  // Validation du mot de passe
    });
  }

  ngOnInit(): void {
    // Connexion au WebSocket au démarrage du composant
    this.authService.connectWebSocket();
  
    // Abonnement aux messages WebSocket pour traiter les erreurs liées à l'UID ou aux cartes invalides
    this.wsSubscription = this.authService.messages$.subscribe((message: any) => {
      console.log('Message reçu:', message);
  
      // Vérifiez si le message contient un statut d'erreur pour l'UID mal formé ou des données invalides
      if (message.status === 'error' && message.message === 'UID mal formé ou données invalides.') {
        console.log('Erreur: UID mal formé ou données invalides');
        this.handleScanError(message);
  
        // Logique de redirection basée sur le rôle
        if (message.role === 'admin') {
          console.log('Redirection vers /dashboard');
          this.router.navigate(['/dasbord']); // Redirection vers le tableau de bord
        } else if (message.role === 'vigile') {
          console.log('Redirection vers /pointage');
          this.router.navigate(['/pointage']); // Redirection vers pointage
        } else {
          console.log('Redirection par défaut');
          this.router.navigate(['/']); // Redirection par défaut
        }
      }
      // Vérification des erreurs liées au numéro de carte invalide
      else if (message.status === 'error' && message.message === 'Numéro de carte invalides ou est déjà scanné.') {
        console.log('⚠️ Erreur détectée, appel de handleScanError()');
        this.handleScanError(message);  // Appeler handleScanError pour afficher l'erreur sous forme de modal
      } else {
        console.log('Aucun rôle détecté dans le message.');
      }
    });
  
    // Démarrer le scanning lorsque le composant est initialisé
    this.startScanning();
  }
  
  handleScanError(message: any): void {
    console.log('🚨 handleScanError() appelé avec message:', message);
  
    // Affichage du modal avec le message d'erreur
    this.showErrorModal = true;  // Affiche le modal
  
    // Vous pouvez également personnaliser le message d'erreur affiché ici
    this.errorMessage = message.message || 'Erreur inconnue lors du scan de la carte.';
  
    // Si vous avez besoin d'un délai avant de masquer à nouveau le modal, vous pouvez ajouter un délai ici
    setTimeout(() => {
      this.showErrorModal = false;  // Ferme le modal après un certain temps (par exemple 5 secondes)
    }, 5000);  // 5 secondes pour afficher l'erreur avant de fermer le modal
  }

  startScanning(): void {
    this.isScanning = true;  // Définir l'état de scanning sur true
    this.authService.startScanning();  // Appeler le service pour démarrer l'envoi des informations en boucle
  }
  
  

  // Méthode pour gérer la soumission du formulaire (email + mot de passe)
  onSubmit(): void {
    if (this.authForm.valid) {
      const { email, password } = this.authForm.value;
  
      this.authService.login(email, password).subscribe(
        (response) => {
          console.log('Connexion réussie', response);  // Vérification de la réponse du backend
  
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
  
            // Vérifie le rôle de l'utilisateur dans la réponse
            console.log('Rôle de l\'utilisateur:', response.user.role);  // Accède au rôle via response.user.role
  
            // Redirection en fonction du rôle
            if (response.user.role === 'admin') {
              console.log('Redirection vers /dashboard pour admin');
              this.router.navigate(['/dasbord']);
            } else if (response.user.role === 'vigile') {
              console.log('Redirection vers /pointage pour vigile');
              this.router.navigate(['/pointage']);
            } else {
              console.log('Rôle non reconnu. Redirection vers la page par défaut');
              this.router.navigate(['/default']);
            }
          } else {
            console.error('Aucun token reçu dans la réponse');
          }
        },
        (error: any) => {
          console.error('Erreur de connexion', error);
          this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
    }
  }
  
 // Arrêter le scanning
 stopScanning(): void {
  this.isScanning = false;
  this.authService.stopScanning();  // Arrêter l'envoi des informations
}

// Méthode pour envoyer un message au serveur
sendMessage(): void {
  const message = 'Message depuis le client Angular';
  this.authService.sendMessage(message);
}

  // Méthode pour l'authentification par RFID
onRfidLogin(): void {
  if (this.rfidCode.trim()) {
    // Vérifier si le code RFID est correct
    if (this.rfidCode !== 'D3C1BC2E') {
      this.isCardInvalid = true;  // Afficher le modal pour carte invalide
      return; // Sortir de la fonction si la carte est invalide
    }

    this.authService.authenticateWithRFID(this.rfidCode);  // Appeler le service pour authentification RFID
    this.isCardInvalid = false; // Réinitialiser l'état de la carte invalide après authentification
  } else {
    this.authenticationMessage = 'Veuillez scanner une carte RFID';
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

   // Méthode pour fermer le modal
   closeModal(): void {
    this.showErrorModal = false;  // Cacher le modal
  }


  ngOnDestroy(): void {
    // Déconnexion de WebSocket et nettoyage des abonnements lorsque le composant est détruit
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.authService.disconnectWebSocket();
  }

   // Méthode pour valider un email
   customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validEmail = email && emailPattern.test(email);

    if (validEmail) {
      const domain = email.split('@')[1];
      const tld = domain.split('.').pop();
      if (tld && tld.length < 2) {
        return { 'invalidTLD': true }; // Retourne une erreur si le TLD est trop court
      }
    }

    return validEmail ? null : { 'invalidEmail': true }; // Retourne null si l'email est valide, sinon retourne une erreur
  }
}

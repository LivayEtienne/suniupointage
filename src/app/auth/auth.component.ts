import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-authentification',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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

  userInfo: any = {}; // Stocke les informations de l'utilisateur


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
    // Connexion au WebSocket
    this.authService.connectWebSocket();

    // Abonnement aux messages WebSocket pour traiter les erreurs
    this.wsSubscription = this.authService.errorMessage$.subscribe((message) => {
      console.log('Message reçu:', message);  // Assurez-vous que le message est bien reçu
      this.errorMessage = message; // Afficher le message d'erreur
    });
    

    // Démarrer le scanning
    this.startScanning();
  }
  

  ngOnDestroy(): void {
    // Se désabonner lors de la destruction du composant
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }

  handleScanError(message: any): void {
    console.log('🚨 handleScanError() appelé avec message:', message);
  
    // Vérification si le message contient une erreur liée au numéro de carte
    if (message.status === 'error' && message.message === 'Numéro de carte invalide.') {
      this.showErrorModal = true;
      this.errorMessage = 'Carte invalide';  // Message spécifique pour l'erreur de carte invalide
    } else {
      // Autres erreurs (si nécessaire)
      this.showErrorModal = true;
      this.errorMessage = message.message || 'Erreur inconnue lors du scan de la carte.';
    }
  
    // Optionnel : Fermer le modal après un certain temps
    setTimeout(() => {
      this.showErrorModal = false;
    }, 5000);  // Par exemple, fermer le modal après 5 secondes
  }
  

  startScanning(): void {
    this.isScanning = true;
    this.authService.startScanning(); // Démarrer l'envoi des informations
  }

  stopScanning(): void {
    this.isScanning = false;
    this.authService.stopScanning(); // Arrêter l'envoi des informations
  }

  // Logique de redirection basée sur le rôle
  redirectBasedOnRole(role: string): void {
    if (role === 'admin') {
      this.router.navigate(['/dasbord']);
    } else if (role === 'vigile') {
      this.router.navigate(['/test']);
    } else {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      const { email, password } = this.authForm.value;
  
      this.authService.login(email, password).subscribe(
        (response) => {
          console.log('Réponse API complète:', response); // Vérifier la structure de la réponse
  
          if (response && response.token && response.user) {
            localStorage.setItem('authToken', response.token);
            console.log('Rôle utilisateur:', response.user.role); // Vérifier si le rôle est bien récupéré
            this.redirectBasedOnRole(response.user.role);
          } else {
            console.error('Données utilisateur manquantes dans la réponse API');
            this.errorMessage = 'Erreur lors de la récupération des informations utilisateur.';
          }
        },
        (error) => {
          console.error('Erreur lors de la connexion:', error);
          this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
        }
      );
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
    }
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
      if (this.rfidCode !== 'C37F401C') {
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

  closeModal(): void {
    this.errorMessage = '';  // Réinitialiser le message d'erreur
    this.showErrorModal = false;  // Masquer le modal
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

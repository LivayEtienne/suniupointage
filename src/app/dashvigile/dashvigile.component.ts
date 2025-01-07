import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashvigileService } from '../dashvigile.service';
import { Router } from '@angular/router'; // Importation du router Angular
import { FormsModule } from '@angular/forms';  // Importez FormsModule pour les formulaires template-driven 
import { CommonModule } from '@angular/common';  // Importez CommonModule pour les directives communes  
import { ChangeDetectorRef } from '@angular/core';
import { ReussiComponent } from '../reussi/reussi.component';

@Component({
  selector: 'app-user-info',
  imports: [FormsModule, CommonModule, ReussiComponent],  // Ajoutez FormsModule et CommonModule aux imports 
  templateUrl: './dashvigile.component.html',
  styleUrls: ['./dashvigile.component.css']
})
export class DashvigileComponent implements OnInit, OnDestroy {
  userInfo: any = { nom: '', matricule: '', email: '', role: '' };
  isScanning: boolean = false;  // Suivi de l'état de scanning
  lastScannedUid: string | null = null;  // UID du dernier utilisateur scanné
  lastScannedTime: number | null = null;  // Heure du dernier scan
  scanCooldown: number = 60000; // 1 minute en millisecondes
  isCooldownActive: boolean = false; // Si le cooldown est actif
  modalVisible: boolean = false;  // Renommé en modalVisible
  modalMessage: string = ''; // Message à afficher dans la modal
  message: string | null = null;  // Renommé en message

  constructor(
    private dashVigileService: DashvigileService, // Injection du service Dashvigile
    private router: Router, // Injection du service Router
    private cdr: ChangeDetectorRef
  ) {}

  showMessage(message: string): void {
    this.modalMessage = message;
    // Cache le message après 5 secondes
    setTimeout(() => { this.modalMessage = ''; }, 5000);
  }

  ngOnInit(): void {
    // S'abonner aux messages WebSocket
    this.dashVigileService.messages$.subscribe((message: any) => {
      console.log('Message reçu dans le composant:', message);

      

      if (message.status === 'error' && message.message === 'UID mal formé ou données invalides.') {
        this.handleScanError(message);
      } else if (message.nom && message.matricule && message.email && message.role) {
        this.userInfo = message; // Mettez à jour les informations utilisateur
        console.log('Informations utilisateur mises à jour:', this.userInfo);

        // Vérifiez si l'utilisateur est valide (par exemple, rôle "admin")
        if (this.userInfo.role === 'admin') {
          // Vérifiez si l'utilisateur est déjà sur la page "dashvigile"
          if (this.router.url === '/dashvigile') {
            this.router.navigate(['/vigile']); // Redirection vers vigile.component.html si déjà sur dashvigile
          } else {
            this.router.navigate(['/dashboard']); // Sinon, redirection vers le dashboard
          }
        } else {
          this.showMessage('Utilisateur non autorisé');
        }
      } else {
        console.log('Aucune information utilisateur trouvée dans le message.');
        this.showMessage('Carte scannée invalide');
      }
    });

    // Démarrer le scanning lorsque le composant est initialisé
    this.startScanning();
  }

  ngOnDestroy(): void {
    // Arrêter le scanning lorsque le composant est détruit
    this.stopScanning();
  }

  // Démarrer le scanning
  startScanning(): void {
    this.isScanning = true;
    this.dashVigileService.startScanning();  // Démarrer l'envoi des informations en boucle
  }

  // Arrêter le scanning
  stopScanning(): void {
    this.isScanning = false;
    this.dashVigileService.stopScanning();  // Arrêter l'envoi des informations
  }

  // Méthode pour envoyer un message au serveur
  sendMessage(): void {
    const message = 'Message depuis le client Angular';
    this.dashVigileService.sendMessage(message);
  }

  handleScanError(message: any): void {
    console.log('🚨 handleScanError() appelé avec message:', message);

    if (this.lastScannedUid && this.lastScannedTime) {
      const timeElapsed = Date.now() - this.lastScannedTime;
      if (timeElapsed < this.scanCooldown) {
        console.log(`⏳ Cooldown actif, temps restant: ${Math.ceil((this.scanCooldown - timeElapsed) / 1000)}s`);
        return;
      }
    }

    // Mise à jour des variables
    this.lastScannedUid = message.uid;
    this.lastScannedTime = Date.now();
    this.isCooldownActive = true;

    // Mise à jour du message d'erreur
    console.log('🖊 Mise à jour de modalMessage:', message.message);
    this.modalMessage = message.message;
    this.modalVisible = true;

    console.log('✅ Après mise à jour - modalMessage:', this.modalMessage);
    console.log('✅ Après mise à jour - modalVisible:', this.modalVisible);
  }

  // Fermer la modal
  closeModal(): void {
    this.modalVisible = false;
    this.modalMessage = '';
  }

  // Afficher la modal avec un message spécifique
  showModal(message: string): void {
    this.modalVisible = true;
    this.modalMessage = message;
  }
}

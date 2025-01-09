import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsignSocketService } from '../asign-socket.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asign',
  imports: [FormsModule, CommonModule],
  templateUrl: './asign.component.html',
  styleUrls: ['./asign.component.css']
})
export class AsignComponent implements OnInit, OnDestroy {
  uid: string = ''; // Stocke l'UID reçu
  successMessage: string = '';
  errorMessage: string = '';
  userId: number = 0; // L'ID sera récupéré dynamiquement depuis l'URL
  private subscription!: Subscription;

  constructor(
    private asignSocketService: AsignSocketService,
    private route: ActivatedRoute  // Injection du service ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur depuis l'URL
    this.userId = +this.route.snapshot.paramMap.get('id')!;  // Récupérer l'ID dynamique de l'URL
    console.log('ID récupéré depuis l\'URL:', this.userId); // 🔍 Debug

    this.asignSocketService.connect();

    // Écoute des messages WebSocket via le getter
    this.subscription = this.asignSocketService.messages.subscribe((message) => {
      console.log('📩 Message reçu via WebSocket :', message); // 🔍 Debug

      if (message.uid) {
        // Extraction de l'UID du message reçu
        const extractedUid = message.uid.replace('🔹 UID formaté : ', '').trim();
        console.log('✅ UID extrait :', extractedUid); // 🔍 Vérifier l'UID reçu

        // Vérifier que l'UID est valide
        if (this.isValidUid(extractedUid)) {
          this.uid = extractedUid;
        } else {
          console.log('❌ UID invalide ou non reconnu');
          this.errorMessage = '❌ UID invalide ou non reconnu.';
        }
      }
    });
  }

  // Méthode pour vérifier la validité de l'UID
  isValidUid(uid: string): boolean {
    // Exemple d'UID valide : doit être alphanumérique et de longueur 7 à 10 caractères
    const uidPattern = /^[A-Z0-9]{7,10}$/;
    return uidPattern.test(uid);
  }

  updateUid(): void {
    if (!this.uid) {
      this.errorMessage = '⚠ Aucun UID à mettre à jour.';
      return;
    }
  
    // Réinitialiser les messages d'état
    this.successMessage = '';
    this.errorMessage = '';
  
    // Appel à la méthode updateUid avec l'ID dynamique récupéré de l'URL
    this.asignSocketService.updateUid(this.userId, this.uid).subscribe({
      next: (response) => {
        console.log('✅ Réponse du serveur après mise à jour :', response); // 🔍 Debug
        if (response && response.uid) {
          this.uid = response.uid; // ✅ Mettre à jour l'UID si renvoyé par l'API
          this.successMessage = `✅ UID mis à jour avec succès! UID : ${this.uid}`;
        } else {
          this.errorMessage = 'MERCI';
        }
  
        // Afficher le modal après la mise à jour
        this.showModal(); // Afficher le modal
      },
      error: (error) => {
        console.error('❌ Erreur API :', error); // 🔍 Debug
        this.errorMessage = '❌ Erreur lors de la mise à jour de l’UID.';
  
        // Afficher le modal après l'erreur
        this.showModal(); // Afficher le modal
      }
    });
  }
  
  // Fonction pour afficher le modal
  showModal(): void {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'flex'; // Afficher le modal
    }
  }
  
  // Fonction pour fermer le modal
  closeModal(): void {
    const modal = document.getElementById('myModal');
    if (modal) {
      modal.style.display = 'none'; // Cacher le modal
    }
  
    // Réinitialiser les messages
    this.successMessage = '';
    this.errorMessage = '';
  }
  


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

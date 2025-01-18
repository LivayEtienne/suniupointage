import { Component, OnInit, OnDestroy } from '@angular/core';
import { AsignSocketService } from '../asign-socket.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router'; // Import du Router
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
  valider: boolean = false;
  errorMessage: string = '';
  userId: number = 0; // L'ID sera récupéré dynamiquement depuis l'URL
  private subscription!: Subscription;

  constructor(
    private asignSocketService: AsignSocketService,
    private route: ActivatedRoute, // Injection du service ActivatedRoute
    private router: Router // Injection du Router pour la redirection
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur depuis l'URL
    this.userId = +this.route.snapshot.paramMap.get('id')!;  
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
    const uidPattern = /^[A-Z0-9]{7,10}$/; // UID alphanumérique de 7 à 10 caractères
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
  
        if (response && response.message === 'UID mis à jour avec succès') {
          this.successMessage = response.message; // ✅ Utiliser le message renvoyé par le serveur
  
          // 🔄 Redirection après succès uniquement si l'UID a bien été mis à jour
          setTimeout(() => {
            this.router.navigate(['/apprenant']); // Redirige vers /apprenant après 1s
          }, 1000);
        } else if (response && response.message === 'Cette carte est déjà affectée.') {
          this.errorMessage = '❌ Cette carte est déjà affectée.'; // ✅ Affichage du message d'erreur
        } else {
          this.errorMessage = '❌ Une erreur est survenue.';
        }
  
        // Afficher le modal après la mise à jour
        this.showModal();
      },
      error: (error) => {
        console.error('❌ Erreur API :', error); // 🔍 Debug
        this.errorMessage = '❌ Cette carte est déjà affectée.'; // ✅ Cas d'erreur serveur
  
        // Afficher le modal après l'erreur
        this.showModal();
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

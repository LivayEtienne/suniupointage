import { Component, OnInit, OnDestroy } from '@angular/core';
import { PointageService } from '../pointage.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-testpointage',
  imports: [CommonModule, FormsModule],
  templateUrl: './testpointage.component.html',
  styleUrls: ['./testpointage.component.css']
})
export class TestPointageComponent implements OnInit, OnDestroy {
  successMessages: string[] = [];  // Liste des messages de succès reçus du serveur
  userInfo: any = {};  // Informations de l'utilisateur à afficher
  modalMessage: string = '';  // Message à afficher en cas d'erreur
  modalVisible: boolean = false; // Affichage du modal d'erreur
  uid: string = ''; // UID de la carte RFID

  private subscription!: Subscription;

  constructor(private pointageService: PointageService) {}
  ngOnInit(): void {
    // S'abonner aux messages du serveur via le service WebSocket
    this.subscription = this.pointageService.getMessages().subscribe(
      (message) => {
        // Vérification si le message est de type succès
        if (message.status === 'success') {
          // Extraction des informations de succès
          this.userInfo = {
            nom: message.message.split(' ')[3],  // Exemple : "Pointage réussi pour Ababacar."
            email: message.message.split(' ')[4],  // Récupération de l'email à la place de prenom
            matricule: message.cardId,
            role: message.role  // Récupérer le role à partir de message.role
          };
  
          // Ajouter un message formaté à la liste des messages de succès
          this.successMessages.push(`${message.message} - CardId: ${message.cardId} - Role: ${message.role}`);
  
          // Réinitialiser le message d'erreur et fermer le modal si succès
          this.modalMessage = '';  // Réinitialiser le message
          this.modalVisible = false;  // Fermer le modal
        } else {
          // Message d'erreur, le modal s'affiche
          this.modalMessage = message.message;
          this.modalVisible = true;  // Assurer l'affichage du modal d'erreur
        }
      },
      (error) => {
        console.error('Erreur WebSocket:', error);
        this.modalMessage = 'Erreur de connexion avec le serveur WebSocket';
        this.modalVisible = true;
      }
    );
  }
  
  

  ngOnDestroy(): void {
    // Fermer la connexion WebSocket proprement pour éviter les fuites de mémoire
    this.subscription.unsubscribe();
    this.pointageService.closeConnection();
  }

  sendTestMessage(): void {
    if (this.uid.trim()) {
      this.pointageService.sendMessage(this.uid);  // Envoie le message au serveur WebSocket
    } else {
      console.error('L\'UID ne peut pas être vide.');
    }
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  showMessage(message: string): void {
    this.modalMessage = message;
    this.modalVisible = true;
  }
}

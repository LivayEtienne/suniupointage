import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket.service'; // Assurez-vous que le chemin est correct
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buttonlecture',
  imports: [FormsModule, CommonModule],
  templateUrl: './buttonlecture.component.html',
  styleUrls: ['./buttonlecture.component.css']
})
export class ButtonlectureComponent implements OnInit, OnDestroy {
  message: string = ''; // Variable pour l'UID à envoyer
  placeholder: string = ''; // Placeholder de l'input
  status: string = ''; // Pour afficher l'état de la connexion
  messages: any[] = []; // Pour stocker les messages reçus du WebSocket
  isModalVisible: boolean = false; // Contrôler la visibilité de la modal
  private socketSubscription!: Subscription; // Abonnement pour la souscription aux messages WebSocket

  constructor(private webSocketService: SocketService) { }

  ngOnInit(): void {
    this.webSocketService.connect(); // Connecter le WebSocket

    // Écoutez les messages WebSocket
    this.socketSubscription = this.webSocketService.messages$.subscribe((msg: any) => {
      console.log('Message WebSocket reçu :', msg);

      // Si le message contient l'UID de la carte, on extrait l'UID et on l'affiche dans le placeholder
      if (msg.message && msg.message.includes('UID de la carte')) {
        const uidMatch = msg.message.match(/UID de la carte : (\S+)/); // Expression régulière pour extraire l'UID
        if (uidMatch) {
          this.placeholder = uidMatch[1]; // Mettre l'UID extrait dans le placeholder
        }
      }

      // Affichage d'autres messages (par exemple, bienvenu)
      if (msg.message) {
        this.messages.push(msg);
      }

      // Mettre à jour le statut
      if (msg.status) {
        this.status = msg.status;
      }
    });
  }

  ngOnDestroy(): void {
    // Désabonnez-vous des messages WebSocket pour éviter les fuites de mémoire
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }

  sendMessage(): void {
    // Vous pouvez envoyer le message via WebSocket ici
    const message = {
      type: 'authenticate',
      uid: this.message,
    };
    this.webSocketService.sendMessage(message);

    // Fermer la modal après l'envoi du message
    this.closeModal();
  }

  // Ouvrir la modal
  openModal(): void {
    this.isModalVisible = true;
  }

  // Fermer la modal
  closeModal(): void {
    this.isModalVisible = false;
  }
}

import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';  // Importez le service WebSocket
import { FormsModule } from '@angular/forms';  // Importez FormsModule pour les formulaires template-driven 
import { CommonModule } from '@angular/common';  // Importez CommonModule pour les directives communes  

@Component({
  selector: 'app-vigile',
  imports: [ FormsModule, CommonModule ],  // Ajoutez FormsModule et CommonModule aux imports 
  templateUrl: './vigile.component.html',
  styleUrl: './vigile.component.css'
})
export class VigileComponent implements OnInit {
  statusMessage: string = '';  // Message de statut affiché à l'utilisateur
  connectionStatus: boolean = false;  // État de la connexion WebSocket

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    // Écoute les messages provenant du serveur WebSocket
    this.websocketService.listenMessages().subscribe({
      next: (message) => {
        if (message && message.message) {
          this.statusMessage = message.message;
        }
      },
      error: (err) => {
        console.error('Erreur de réception WebSocket:', err);
        this.statusMessage = 'Erreur de réception du message WebSocket.';
      }
    });

    // Vérifie l'état de la connexion WebSocket
    this.websocketService.getConnectionStatus().subscribe((status) => {
      this.connectionStatus = status;
    });
  }

  // Méthode pour envoyer une commande d'ouverture
  ouvrir() {
    this.websocketService.sendMessage({
      type: 'action',
      action: 'ouvrir'
    });
  }

  // Méthode pour envoyer une commande de fermeture
  fermer() {
    this.websocketService.sendMessage({
      type: 'action',
      action: 'fermer'
    });
  }

  // Méthode pour rafraîchir la connexion WebSocket
  reconnecter() {
    this.websocketService.reconnect();
  }
}


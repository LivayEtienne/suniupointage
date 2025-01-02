import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../websocket.service';  // Importez le service WebSocket
import { LectureInformationService } from '../lectureinformation.service';
import { FormsModule } from '@angular/forms';  // Importez FormsModule pour les formulaires template-driven 
import { CommonModule } from '@angular/common';  // Importez CommonModule pour les directives communes  

@Component({
  selector: 'app-vigile',
  imports: [FormsModule, CommonModule],  // Ajoutez FormsModule et CommonModule aux imports 
  templateUrl: './vigile.component.html',
  styleUrls: ['./vigile.component.css']  // Correction de styleUrl => styleUrls
})
export class VigileComponent implements OnInit, OnDestroy {
  statusMessage: string = '';  // Message de statut affiché à l'utilisateur
  connectionStatus: boolean = false;  // État de la connexion WebSocket
  utilisateurInfo: any = null;  // Pour stocker les informations utilisateur
  uid: string = ''; // Ajout de la propriété UID
  listeEtudiants: any[] = []; // Initialise avec un tableau vide

  constructor(
    private websocketService: WebsocketService, 
    private lectureInfoService: LectureInformationService
  ) {}

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

    // Souscrire aux messages reçus de LectureInformationService
    this.lectureInfoService.obtenirMessages().subscribe((data) => {
      // Vérifie les différents types de messages
      if (data.type === 'instruction') {
        this.statusMessage = data.content; // Met à jour le message de statut pour l'instruction
      } else if (data.type === 'uidBrut') {
        console.log('UID brut détecté:', data.uid); // Log l'UID brut
        this.uid = data.uid; // Met à jour l'UID à envoyer
      } else if (data.type === 'uidCarte') {
        console.log('UID de la carte extrait:', data.uid); // Log l'UID extrait
        this.uid = data.uid; // Met à jour l'UID à envoyer
      } else if (data.type === 'uidValide') {
        // Vérifie si l'UID est valide et met à jour l'interface
        if (data.status === 'valid' && data.user) {
          this.utilisateurInfo = data.user;  // Met à jour les informations utilisateur
        } else {
          this.statusMessage = 'Utilisateur non reconnu pour cet UID.';
        }
      } else if (data.type === 'uidAlreadyProcessed') {
        this.statusMessage = data.message; // Affiche le message si l'UID a déjà été traité
      }
    });
  }

  ngOnDestroy(): void {
    // Fermer la connexion WebSocket et LectureInformationService lorsque le composant est détruit
    this.websocketService.reconnect();
    this.lectureInfoService.fermerConnexion();
  }

  // Méthode pour envoyer une commande d'ouverture via WebSocket
  ouvrir() {
    this.websocketService.sendMessage({
      type: 'action',
      action: 'ouvrir'
    });
  }

  // Méthode pour envoyer une commande de fermeture via WebSocket
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

  // Exemple d'envoi de message UID via LectureInformationService
  envoyerUID(uid: string): void {
    if (!uid.trim()) {
      console.error("UID invalide !");
      return;
    }
    console.log(`UID envoyé : ${uid}`);
    // Utilisation de LectureInformationService pour envoyer l'UID
    this.lectureInfoService.envoyerMessage(uid);
  }

  actionUtilisateur(action: string): void {
    if (action === 'desactiver') {
      console.log('Utilisateur désactivé');
      // Ajoutez ici la logique pour désactiver un utilisateur, comme un appel à un service
    } else if (action === 'activer') {
      console.log('Utilisateur activé');
      // Ajoutez ici la logique pour activer un utilisateur
    } else {
      console.error('Action non reconnue:', action);
    }
  }
}

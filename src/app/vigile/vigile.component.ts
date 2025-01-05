import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../websocket.service';  // Importez le service WebSocket
import { Auth1Service } from '../auth1.service';  // Importez le service Auth1
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
  matricule: string = ''; // Ajouter une propriété pour stocker le matricule
  avatarUrl: string | ArrayBuffer | null = null; // Pour stocker l'URL de l'image de l'avatar

  constructor(
    private websocketService: WebsocketService, 
    private auth1Service: Auth1Service  // Utilisation du service Auth1 à la place de LectureInformationService
  ) {}

  ngOnInit(): void {
    // Écoute les messages provenant du serveur WebSocket
    this.websocketService.listenMessages().subscribe({
      next: (message) => {
        if (message && message.message) {
          this.statusMessage = message.message;
        } else {
          console.error('Message WebSocket invalide reçu:', message);
        }
      },
      error: (err) => {
        console.error('Erreur de réception WebSocket:', err);
        this.statusMessage = 'Erreur de réception du message WebSocket.';
      }
    });

    // Vérifie l'état de la connexion WebSocket
    this.websocketService.getConnectionStatus().subscribe({
      next: (status) => {
        this.connectionStatus = status;
      },
      error: (err) => {
        console.error('Erreur de statut de connexion WebSocket:', err);
        this.statusMessage = 'Erreur de statut de connexion WebSocket.';
      }
    });

    // Souscrire aux messages reçus de Auth1Service
    this.auth1Service.obtenirMessages().subscribe({
      next: (data) => {
        console.log('Données reçues dans VigileComponent:', data);  // Affichez la structure complète des données reçues
        
        // Si les données contiennent un matricule (et donc un utilisateur)
        if (data && data.matricule) {
          // Met à jour les informations utilisateur avec les données reçues
          this.utilisateurInfo = {
            nom: data.nom,
            matricule: data.matricule,
            email: data.email,
            role: data.role
          };
          this.matricule = data.matricule;  // Récupère également le matricule
        } else {
          this.statusMessage = 'Utilisateur non reconnu pour cet UID.';
        }
      },
      error: (err) => {
        console.error('Erreur de réception des données utilisateur:', err);
        this.statusMessage = 'Erreur de réception des données utilisateur.';
      }
    });
  }

  ngOnDestroy(): void {
    // Fermer la connexion WebSocket et Auth1Service lorsque le composant est détruit
    this.websocketService.fermerConnexion();  // Assurez-vous que la connexion est fermée proprement
    this.auth1Service.fermerConnexion();     // Ferme la connexion de Auth1Service
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

  // Exemple d'envoi de message UID via Auth1Service
  envoyerUID(uid: string): void {
    if (!uid.trim()) {
      console.error("UID invalide !");
      return;
    }
    console.log(`UID envoyé : ${uid}`);
    // Utilisation de Auth1Service pour envoyer l'UID
    this.auth1Service.envoyerMessage(uid);
  }

  // Méthode pour gérer l'activation ou la désactivation de l'utilisateur
  actionUtilisateur(action: string): void {
    switch (action) {
      case 'desactiver':
        console.log('Utilisateur désactivé');
        // Ajoutez ici la logique pour désactiver un utilisateur
        break;
      case 'activer':
        console.log('Utilisateur activé');
        // Ajoutez ici la logique pour activer un utilisateur
        break;
      default:
        console.error('Action non reconnue:', action);
        break;
    }
  }

  // Méthode pour gérer l'upload d'un fichier image pour l'avatar
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];  // Récupère le fichier sélectionné
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result;  // Met à jour l'URL de l'avatar avec l'image lue
      };
      reader.readAsDataURL(file);  // Lit le fichier en tant qu'URL de données (base64)
    }
  }
}

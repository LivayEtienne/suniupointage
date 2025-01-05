import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashVigileService {
  private socket: WebSocket;
  private messagesSubject: Subject<any> = new Subject<any>();
  public messages$ = this.messagesSubject.asObservable();

  private scanning = false;  // Variable pour suivre l'état du scanning
  private sendInterval: any; // Intervalle d'envoi des informations

  

  constructor() {
    // Créer une connexion WebSocket avec le serveur
    this.socket = new WebSocket('ws://localhost:3000'); // Remplacez par l'URL correcte du serveur

    // Écouter les messages du serveur WebSocket
    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data); // Assurez-vous que le message est bien un JSON
        console.log('Message reçu:', data); // Affichage dans la console pour vérifier les données reçues
        this.messagesSubject.next(data); // Tu envoies les données à l'observable

        // Vérifiez si les données contiennent un message d'erreur
        if (data.status === 'error') {
          console.log('Erreur reçue du serveur:', data.message);
        }

        // Vérifiez si les données reçues contiennent les informations utilisateur
        if (data.nom && data.matricule && data.email && data.role) {
          this.messagesSubject.next(data); // Transmettre les données utilisateurs à l'observable
          
          // Si la carte est toujours scannée, continuer à envoyer les informations en boucle
          if (this.scanning && !this.sendInterval) {
            this.startSendingDataInLoop();
          }
        }
      } catch (e) {
        console.error('Erreur lors de la réception du message WebSocket:', e);
      }
    };

    // Gérer les erreurs de connexion WebSocket
    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };

    // Gérer la fermeture de la connexion WebSocket
    this.socket.onclose = () => {
      console.log('Connexion WebSocket fermée');
      if (this.sendInterval) {
        clearInterval(this.sendInterval); // Arrêter l'envoi des informations lorsque la connexion est fermée
      }
    };
  }

  // Méthode pour envoyer des messages au serveur WebSocket
  sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.log('WebSocket non connecté');
    }
  }

  // Démarrer l'envoi des informations en boucle
  private startSendingDataInLoop(): void {
    this.sendInterval = setInterval(() => {
      if (this.socket.readyState === WebSocket.OPEN) {
        // Envoyer des informations au serveur ou simplement transmettre des données
        this.socket.send(JSON.stringify({
          status: 'scanning',
          message: 'La carte est toujours scannée.'
        }));
      } else {
        clearInterval(this.sendInterval); // Arrêter l'envoi si la connexion WebSocket est fermée
      }
    }, 1000); // Envoie des informations toutes les secondes (à ajuster selon vos besoins)
  }

  // Méthode pour indiquer que le scanning est en cours
  startScanning(): void {
    this.scanning = true;
  }

  // Méthode pour arrêter le scanning
  stopScanning(): void {
    this.scanning = false;
    if (this.sendInterval) {
      clearInterval(this.sendInterval); // Arrêter l'envoi en boucle
    }
  }
}

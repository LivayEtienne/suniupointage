import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth1Service {
  private socket: WebSocket;
  private userInfoSubject: Subject<any> = new Subject<any>();  // Subject pour envoyer les infos utilisateur
  userInfo$ = this.userInfoSubject.asObservable(); // Observable pour s'abonner aux infos utilisateur
  private messageSubject: Subject<any> = new Subject<any>(); // Subject pour envoyer les messages

  constructor() {
    // Connexion WebSocket au serveur
    this.socket = new WebSocket('ws://localhost:3000');  // Assurez-vous que le port correspond à celui de votre WebSocket

    // Écouter les messages reçus du serveur WebSocket
    this.socket.onmessage = (event) => {
      console.log('Message reçu du serveur:', event.data);
      try {
        const data = JSON.parse(event.data);
        
        if (data.nom && data.matricule && data.email && data.role) {
          // Si les données de l'utilisateur sont reçues, on les transmet à l'application via le Subject
          this.userInfoSubject.next(data);
        } else if (data.message) {
          console.error(data.message);  // Affiche l'erreur si l'utilisateur n'est pas trouvé
        }

        // Envoi des messages via le messageSubject
        if (data.message) {
          this.messageSubject.next(data);
        }
      } catch (error) {
        console.error('Erreur lors de la réception des données du serveur:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };

    this.socket.onclose = () => {
      console.log('Connexion WebSocket fermée');
    };
  }

  // Méthode pour envoyer une demande au serveur WebSocket avec l'UID
  sendUid(uid: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(uid);  // Envoi de l'UID au serveur pour rechercher l'utilisateur
      console.log('UID envoyé au serveur:', uid);
    } else {
      console.error('La connexion WebSocket n\'est pas ouverte');
    }
  }

  // Méthode pour fermer la connexion WebSocket
  fermerConnexion(): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
      console.log('Connexion WebSocket fermée manuellement');
    }
  }

   // Méthode pour envoyer l'UID (ajoutée pour corriger l'erreur)
  envoyerMessage(uid: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(uid);  // Envoi de l'UID au serveur
      console.log('UID envoyé au serveur:', uid);
    } else {
      console.error('La connexion WebSocket n\'est pas ouverte');
    }
  }

  // Méthode pour obtenir les messages reçus via WebSocket
  obtenirMessages() {
    return this.messageSubject.asObservable(); // Renvoie l'Observable des messages reçus
  }

  closeSocket(): void {
    if (this.socket) {
      this.socket.close();
      console.log('WebSocket fermé manuellement.');
    }
  }

}

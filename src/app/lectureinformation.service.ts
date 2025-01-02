import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LectureInformationService {
  private socket: WebSocket;
  private messageSubject: Subject<any> = new Subject<any>();
  public messages = new Subject<any>();  // Utilisé pour transmettre les données au composant

  constructor() {
    console.log('Service LectureInformationService initialisé.');

    // Connexion au serveur WebSocket
    this.socket = new WebSocket('ws://localhost:3000');  // Assurez-vous que l'URL du serveur WebSocket est correcte
    console.log('Connexion WebSocket établie avec le serveur: ws://localhost:3000/');

    // Écouter les messages entrants depuis le WebSocket
    this.socket.onmessage = (event: MessageEvent) => {
      console.log('Message WebSocket reçu:', event.data);
      const message = JSON.parse(event.data);

      // Gérer différents types de messages

      // 1. Message générique (demande de placer la carte RFID)
      if (message.type === 'MESSAGE' && message.message === 'Placez une carte RFID sur le lecteur') {
        console.log('Message générique reçu: "Placez une carte RFID sur le lecteur".');
        this.messages.next({ type: 'instruction', content: message.message });
      }

      // 2. UID brut détecté
      else if (message.type === 'UID_BRUT') {
        console.log('UID brut détecté:', message.uid);
        this.messages.next({ type: 'uidBrut', uid: message.uid });
      }

      // 3. UID de la carte extrait
      else if (message.type === 'UID_CARTE') {
        console.log('UID de la carte extrait:', message.uid);
        this.messages.next({ type: 'uidCarte', uid: message.uid });
      }

      // 4. UID validé (recherche dans la base de données)
      else if (message.type === 'UID_VALIDE' && message.status === 'Reconnu') {
        console.log('UID validé reconnu, recherche dans la base de données...');

        this.messages.next({ type: 'uidValide', status: 'valid' });

        // Ici, vous pouvez envoyer les informations utilisateur reçues
        if (message.user) {
          console.log('Utilisateur trouvé:', message.user);
          this.messages.next({ type: 'userInfo', user: message.user });
        } else {
          console.log('Aucun utilisateur trouvé pour cet UID.');
        }
      }

      // 5. UID déjà traité
      else if (message.type === 'UID_CARTE' && message.status === 'alreadyProcessed') {
        console.log('UID déjà traité, ignorer.');
        this.messages.next({ type: 'uidAlreadyProcessed', message: 'UID déjà traité, ignorer' });
      }
    };

    // Gérer les erreurs de connexion
    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };

    // Gérer la fermeture de la connexion WebSocket
    this.socket.onclose = () => {
      console.log('Connexion WebSocket fermée');
    };
  }

  // Fonction pour envoyer un message via WebSocket (par exemple, un UID)
  envoyerMessage(uid: string) {
    console.log('Envoi de l\'UID au serveur WebSocket:', uid);
    const message = JSON.stringify({
      type: 'authenticate',  // Message de type authentication
      uid: uid,              // UID à envoyer pour l'authentification
    });

    // Envoyer le message au serveur WebSocket
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      console.log('Message envoyé au serveur:', message);
    } else {
      console.log('WebSocket n\'est pas connecté');
    }
  }

  // Méthode pour obtenir un Observable des messages reçus
  obtenirMessages() {
    return this.messages.asObservable();
  }

  // Méthode pour fermer la connexion WebSocket proprement
  fermerConnexion() {
    if (this.socket) {
      this.socket.close();
      console.log('Connexion WebSocket fermée proprement.');
    }
  }
}

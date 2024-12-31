import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: WebSocket;
  private messageSubject: Subject<any> = new Subject();

  constructor() { }

  // Connexion au serveur WebSocket
  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('Connexion WebSocket établie');
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageSubject.next(message);  // Publier le message dans le sujet
    };

    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };

    this.socket.onclose = () => {
      console.log('Connexion WebSocket fermée');
    };
  }

  // Obtenir les messages reçus
  getMessages() {
    return this.messageSubject.asObservable();
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: WebSocket;
  private messagesSubject = new Subject<any>(); // Un Subject pour émettre les messages
  public messages$ = this.messagesSubject.asObservable(); // Observable à souscrire dans le composant

  constructor() { }

  connect(): void {
    // Connexion au serveur WebSocket
    this.socket = new WebSocket('ws://localhost:3000'); // Remplacez par l'URL de votre serveur WebSocket

    this.socket.onmessage = (event: MessageEvent) => {
      // Lorsque le serveur envoie un message, on l'émet dans le Subject
      const data = JSON.parse(event.data);
      this.messagesSubject.next(data);
    };
  }

  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
}

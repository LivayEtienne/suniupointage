import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$!: WebSocketSubject<any>;
  private subject = new Subject<any>();
  private connectionStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    this.socket$ = new WebSocketSubject('ws://localhost:5000');

    this.socket$.subscribe(
      (message) => {
        this.subject.next(message);
      },
      (err) => {
        console.error('Erreur WebSocket:', err);
        this.subject.next({
          message: 'Erreur de connexion au serveur',
          status: 'error'
        });
        this.connectionStatus.next(false);
      },
      () => {
        console.log('Connexion WebSocket fermée');
        this.connectionStatus.next(false);
      }
    );

    // Vérifie la connexion en envoyant un ping structuré
    this.sendMessage({ type: 'ping', action: 'check' });
    this.connectionStatus.next(true);
  }

  sendMessage(message: any) {
    // Vérifie que le message a la structure requise
    if (!message.type || !message.action) {
      console.error('Message mal formé : "type" et "action" sont requis');
      this.subject.next({
        message: 'Message mal formé : "type" et "action" sont requis',
        status: 'error'
      });
      return;
    }

    if (this.connectionStatus.value) {
      this.socket$.next(message);
    } else {
      console.error('La connexion WebSocket n\'est pas ouverte');
      this.subject.next({
        message: 'La connexion WebSocket n\'est pas ouverte',
        status: 'error'
      });
    }
  }

  listenMessages() {
    return this.subject.asObservable();
  }

  getConnectionStatus() {
    return this.connectionStatus.asObservable();
  }

  reconnect() {
    console.log('Tentative de reconnexion...');
    this.connectionStatus.next(false);
    this.initializeWebSocket();
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router'; // Importer le Router pour la redirection

@Injectable({
  providedIn: 'root',
})
export class DashVigileService {
  private socket!: WebSocket;
  private messagesSubject: Subject<any> = new Subject<any>();
  public messages$ = this.messagesSubject.asObservable();

  private scanning = false;  
  private sendInterval: any; 
  private isWebSocketConnected: boolean = false;
  private isAttemptingReconnect: boolean = false;

  private WS_URL = 'ws://localhost:3000';

  constructor(private router: Router) {}

  // Méthode pour établir la connexion WebSocket
  connectWebSocket(): void {
    if (!this.isWebSocketConnected && !this.isAttemptingReconnect) {
      this.isAttemptingReconnect = true;
      console.log('Connexion WebSocket en cours...');
      
      this.socket = new WebSocket(this.WS_URL);

      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data); // Assurez-vous que le message est bien un JSON
          console.log('Message reçu:', data);

          // Vérification si la carte est valide
          if (data.nom && data.matricule && data.email && data.role) {
            this.messagesSubject.next(data); // Transmettre les données utilisateurs à l'observable

            // Si la carte est valide, rediriger vers la page vigile.component.html
            this.router.navigate(['/vigile']);
          }

          // Vérification d'erreur du serveur
          if (data.status === 'error') {
            console.log('Erreur reçue du serveur:', data.message);
          }

        } catch (e) {
          console.error('Erreur lors de la réception du message WebSocket:', e);
        }
      };

      this.socket.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
        this.isWebSocketConnected = false;
        this.isAttemptingReconnect = false;
      };

      this.socket.onclose = () => {
        console.log('Connexion WebSocket fermée');
        this.isWebSocketConnected = false;
        this.isAttemptingReconnect = false;
        this.attemptReconnect();
      };

      this.socket.onopen = () => {
        console.log('Connexion WebSocket établie');
        this.isWebSocketConnected = true;
        this.isAttemptingReconnect = false;
      };
    }
  }

  private attemptReconnect(): void {
    console.log('Tentative de reconnexion WebSocket...');
    setTimeout(() => {
      this.connectWebSocket();
    }, 3000);
  }

  sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.log('WebSocket non connecté');
    }
  }

  private startSendingDataInLoop(): void {
    this.sendInterval = setInterval(() => {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
          status: 'scanning',
          message: 'La carte est toujours scannée.'
        }));
      } else {
        clearInterval(this.sendInterval);
      }
    }, 1000);
  }

  startScanning(): void {
    this.scanning = true;
    if (this.isWebSocketConnected) {
      this.startSendingDataInLoop();
    }
  }

  stopScanning(): void {
    this.scanning = false;
    if (this.sendInterval) {
      clearInterval(this.sendInterval);
    }
  }
}

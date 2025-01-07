import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashvigileService {
  private socket$!: WebSocketSubject<any>;
  private messagesSubject = new BehaviorSubject<string | null>(null);
  messages$: Observable<string | null> = this.messagesSubject.asObservable();
  private scanning = false; // État du scan

  constructor(private router: Router) {
    this.connectToWebSocket();
  }

  private connectToWebSocket() {
    this.socket$ = new WebSocketSubject('ws://localhost:3000'); // Modifier l'URL si nécessaire

    this.socket$.subscribe(
      (message) => {
        console.log('Données reçues du WebSocket :', message); 
        if (message.cardId && message.role === 'admin') {
          this.router.navigate([''],    { queryParams: { cardId: message.cardId } });
        }
      },
      (err) => console.error('Erreur WebSocket :', err),
      () => console.warn('Connexion WebSocket fermée')
    );
  }

  // ✅ Correction : Utiliser messagesSubject au lieu de messageSubject
  sendMessage(message: string) {
    this.messagesSubject.next(message);
  }

  // ✅ Ajout des méthodes startScanning() et stopScanning()
  startScanning() {
    if (!this.scanning) {
      this.scanning = true;
      console.log('🔍 Scan démarré...');
      this.sendMessage('Démarrage du scan...');
    }
  }

  stopScanning() {
    if (this.scanning) {
      this.scanning = false;
      console.log('🛑 Scan arrêté...');
      this.sendMessage('Arrêt du scan...');
    }
  }
}

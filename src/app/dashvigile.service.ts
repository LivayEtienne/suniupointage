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
    this.socket$ = new WebSocketSubject('ws://localhost:4000'); // Modifier l'URL si nécessaire

    this.socket$.subscribe(
      (message) => {
        console.log('Données reçues du WebSocket :', message);

        // Si le message contient un rôle "admin", redirige vers le dashboard
        if (message.role === 'admin') {
          console.log('Rôle admin détecté, redirection vers le dashboard');
          this.router.navigate(['vigile']); // Redirection vers "dashboard"
        } else if (message.cardId && message.role) {
          // Si le message contient un cardId et un role, redirige vers "vigile"
          console.log('Pointage réussi pour la carte', message.cardId);
          this.router.navigate(['vigile'], { queryParams: { cardId: message.cardId } });
        } else {
          console.error('Données invalides reçues:', message);
        }
      },
      (err) => console.error('Erreur WebSocket :', err),
      () => console.warn('Connexion WebSocket fermée')
    );
  }

  // ✅ Méthode pour envoyer des messages
  sendMessage(message: string) {
    this.messagesSubject.next(message);
  }

  // ✅ Ajout des méthodes startScanning() et stopScanning() pour gérer l'état du scan
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

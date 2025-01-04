import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private readonly apiUrl = 'http://localhost:8000/api';  // URL de l'API REST
  private readonly WS_URL = 'ws://localhost:3000';  // URL du WebSocket

  private ws$: WebSocketSubject<any> | undefined;
  private messagesSubject = new Subject<any>();
  public message$: Observable<any> = this.messagesSubject.asObservable();
  
  private isWebSocketConnected = false;
  private isAttemptingReconnect = false; // Flag pour éviter les tentatives de reconnexion multiples

  constructor(private http: HttpClient) {
    this.connectWebSocket();  // Connexion WebSocket lors de l'initialisation
  }

  // Méthodes API REST
  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,  // Ajouter le token dans les en-têtes
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  // Méthode pour se connecter au WebSocket
  connectWebSocket(): void {
    if (!this.isWebSocketConnected && !this.isAttemptingReconnect) {
      this.isAttemptingReconnect = true;
      console.log('Connexion WebSocket en cours...');
      this.ws$ = webSocket(this.WS_URL);

      this.ws$.subscribe({
        next: (message) => {
          console.log('Message reçu via WebSocket:', message);

          // Vérification de l'état de la connexion WebSocket
          if (message.status === 'connected') {
            const userMessage = message.message;
            const userRole = message.role;

            console.log(`Utilisateur authentifié avec le rôle : ${userRole}`);

            // Envoi du message avec les informations d'authentification
            this.messagesSubject.next({
              authenticated: true,
              message: userMessage,
              role: userRole,
            });

            // Marquer la connexion comme établie
            this.isWebSocketConnected = true;

            // Fermer la connexion WebSocket après authentification réussie
            this.disconnectWebSocket();
          } else if (message.status === 'error') {
            this.messagesSubject.next({
              authenticated: false,
              error: message.message,
            });
          } else {
            this.messagesSubject.next(message);
          }
        },
        error: (err) => {
          console.error('Erreur WebSocket:', err.message);
          this.isWebSocketConnected = false;  // Réinitialiser l'état de la connexion
          this.isAttemptingReconnect = false;  // Terminer la tentative de reconnexion
          this.attemptReconnect();  // Tentative de reconnexion
        },
        complete: () => {
          console.log('WebSocket fermé');
          this.isWebSocketConnected = false;  // Réinitialiser l'état de la connexion
          this.isAttemptingReconnect = false;  // Terminer la tentative de reconnexion
          this.attemptReconnect();  // Tentative de reconnexion
        },
      });
    } else {
      console.log('Connexion WebSocket déjà établie ou reconnexion en cours');
    }
  }

  // Tentative de reconnexion WebSocket
  private attemptReconnect(): void {
    if (!this.isWebSocketConnected && !this.isAttemptingReconnect) {
      console.log('Tentative de reconnexion WebSocket...');
      setTimeout(() => this.connectWebSocket(), 3000); // Reconnexion après 3 secondes
    }
  }

  // Authentification par carte RFID (envoyer UID via WebSocket)
  authenticateWithRFID(uid: string): void {
    if (this.ws$ && !this.ws$.closed) {
      const message = { type: 'authenticate', uid };
      this.ws$.next(message);  // Envoi de l'UID pour authentification
      console.log('UID envoyé pour authentification:', message);
    } else {
      console.error('La connexion WebSocket est fermée. Tentative de reconnexion...');
      this.connectWebSocket();  // Reconnecter si la connexion est fermée
      // Une fois la reconnexion réussie, tenter d'envoyer le message à nouveau
      setTimeout(() => this.authenticateWithRFID(uid), 2000);  // Retry après 2 secondes
    }
  }

  // Ajout de méthodes pour interagir avec l'API REST pour gérer les utilisateurs
  createUser(nom: string, email: string, role: string, matricule: string): Observable<any> {
    const user = { nom, email, role, matricule };
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  updateUser(matricule: string, nom: string, email: string, role: string, status: string): Observable<any> {
    const userData = { nom, email, role, status };
    return this.http.put(`${this.apiUrl}/users/${matricule}`, userData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  // Déconnexion WebSocket
  disconnectWebSocket(): void {
    if (this.ws$ && !this.ws$.closed) {
      this.ws$.complete();
      console.log('Connexion WebSocket terminée correctement');
      this.isWebSocketConnected = false;  // Réinitialiser l'état de la connexion
    }
  }

  ngOnDestroy(): void {
    this.disconnectWebSocket();  // Assurez-vous que WebSocket est fermé lors de la destruction du service
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // API REST URL
  private readonly apiUrl = 'http://localhost:8000/api';

  // WebSocket URL
  private readonly WS_URL = 'ws://localhost:3000';

  // WebSocket subject and observable
  private ws$: WebSocketSubject<any> | undefined;
  private messagesSubject = new Subject<any>();
  public message$: Observable<any> = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.connectWebSocket(); // Connect to WebSocket during initialization
  }

  // REST API Methods
  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Add token to headers
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  connectWebSocket(): void {
    if (!this.ws$ || this.ws$.closed) {
      this.ws$ = webSocket(this.WS_URL);
  
      this.ws$.subscribe({
        next: (message) => {
          console.log('Message reçu via WebSocket:', message);
  
          // Si le message contient une erreur d'UID
          if (message.status === 'error' && message.type === 'uid') {
            console.error('Erreur UID:', message.message);
            // Transmettre l'erreur au sujet observable
            this.messagesSubject.next({
              authenticated: false,
              error: message.message,
              type: 'uid',
            });
          } 
          // Si le message contient des informations d'authentification réussie
          else if (message.status === 'connected') {
            const userMessage = message.message;
            const userRole = message.role;
  
            console.log(`Utilisateur authentifié avec le rôle : ${userRole}`);
  
            this.messagesSubject.next({
              authenticated: true,
              message: userMessage,
              role: userRole,
            });
          } 
          // Autres messages
          else {
            this.messagesSubject.next(message);
          }
        },
        error: (err) => {
          console.error('Erreur de WebSocket:', err.message);
          setTimeout(() => this.connectWebSocket(), 3000); // Reconnecter après une erreur
        },
        complete: () => {
          console.log('WebSocket fermé');
          setTimeout(() => this.connectWebSocket(), 3000); // Reconnecter après fermeture
        },
      });
    }
  }
  
  authenticateWithRFID(uid: string): void {
    if (this.ws$) {
      const message = { type: 'authenticate', uid };
      this.ws$.next(message); // Envoyer l'UID pour authentification
      console.log('UID envoyé pour authentification:', message);
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

  disconnectWebSocket(): void {
    if (this.ws$ && !this.ws$.closed) {
      this.ws$.complete();
      console.log('Connexion WebSocket terminée correctement');
    }
  }

  ngOnDestroy(): void {
    this.disconnectWebSocket(); // Assurez-vous que WebSocket est fermé
  }
}

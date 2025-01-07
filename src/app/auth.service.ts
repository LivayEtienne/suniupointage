import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private readonly apiUrl = 'http://localhost:8000/api';  // URL de l'API REST
  private readonly WS_URL = 'ws://localhost:3000';  // URL du WebSocket

  public errorMessage: string = '';
  private ws$: WebSocketSubject<any> | undefined;
  private socket!: WebSocket;
  private sendInterval: any; // Intervalle d'envoi des informations
  private messagesSubject = new Subject<any>();
  public messages$: Observable<any> = this.messagesSubject.asObservable();
  private scanning = false;  // Variable pour suivre l'état du scanning
  
  
  private isWebSocketConnected = false;
  private isAttemptingReconnect = false; // Flag pour éviter les tentatives de reconnexion multiples

   // Variable d'état pour stocker l'erreur
   private errorMessageSubject = new BehaviorSubject<string>('');
   errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.connectWebSocket();  // Connexion WebSocket lors de l'initialisation
  }

  // Méthodes API REST
  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post(`${this.apiUrl}/login`, credentials)
      .pipe(
        // En cas d'erreur lors de l'authentification, on transmet l'erreur via le Subject
        catchError(error => {
          this.messagesSubject.next({
            status: 'error',
            message: `Erreur lors de l'authentification : ${error.message}`
          });
          throw error; // Relancer l'erreur pour qu'elle soit gérée ailleurs si nécessaire
        })
      );
  }

  logout(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,  // Ajouter le token dans les en-têtes
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers })
      .pipe(
        catchError(error => {
          this.messagesSubject.next({
            status: 'error',
            message: `Erreur lors de la déconnexion : ${error.message}`
          });
          throw error; // Relancer l'erreur
        })
      );
  }

  connectWebSocket(): void {
    if (!this.isWebSocketConnected && !this.isAttemptingReconnect) {
      this.isAttemptingReconnect = true;
      console.log('Connexion WebSocket en cours...');
      this.ws$ = webSocket(this.WS_URL);

      this.ws$.subscribe({
        next: (message) => {
          console.log('Message reçu via WebSocket:', message);

          // Vérification si le message contient un status 'error'
          if (message.status === 'error' && message.message) {
            this.errorMessageSubject.next(message.message); // Met à jour l'erreur
          }

          // Vérification si le message contient les informations de l'utilisateur
          if (message.role) {
            const userRole = message.role;
            console.log(`Rôle de l'utilisateur : ${userRole}`);

            // Si le rôle est 'admin', on redirige vers le dashboard
            if (userRole === 'admin') {
              console.log('Redirection vers le tableau de bord');
              this.router.navigate(['/dasbord']);
            }

            // Marquer la connexion comme établie
            this.isWebSocketConnected = true;
          } else {
            console.error('Message WebSocket sans rôle');
          }
        },
        error: (err) => {
          console.error('Erreur WebSocket:', err.message);
          this.isWebSocketConnected = false;
          this.isAttemptingReconnect = false;
        },
        complete: () => {
          console.log('WebSocket fermé');
          this.isWebSocketConnected = false;
          this.isAttemptingReconnect = false;
          this.attemptReconnect(); // Tentative de reconnexion si nécessaire
        },
      });
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
      this.messagesSubject.next({
        status: 'error',
        message: 'Connexion WebSocket fermée, tentative de reconnexion...',
      });
      this.connectWebSocket();  // Reconnecter si la connexion est fermée
      // Une fois la reconnexion réussie, tenter d'envoyer le message à nouveau
      setTimeout(() => this.authenticateWithRFID(uid), 2000);  // Retry après 2 secondes
    }
  }

  // Ajout de méthodes pour interagir avec l'API REST pour gérer les utilisateurs
  createUser(nom: string, email: string, role: string, matricule: string): Observable<any> {
    const user = { nom, email, role, matricule };
    return this.http.post(`${this.apiUrl}/users`, user)
      .pipe(
        catchError(error => {
          this.messagesSubject.next({
            status: 'error',
            message: `Erreur lors de la création de l'utilisateur : ${error.message}`
          });
          throw error; // Relancer l'erreur
        })
      );
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`)
      .pipe(
        catchError(error => {
          this.messagesSubject.next({
            status: 'error',
            message: `Erreur lors de la récupération des utilisateurs : ${error.message}`
          });
          throw error;
        })
      );
  }

  updateUser(matricule: string, nom: string, email: string, role: string, status: string): Observable<any> {
    const userData = { nom, email, role, status };
    return this.http.put(`${this.apiUrl}/users/${matricule}`, userData)
      .pipe(
        catchError(error => {
          this.messagesSubject.next({
            status: 'error',
            message: `Erreur lors de la mise à jour de l'utilisateur : ${error.message}`
          });
          throw error; // Relancer l'erreur
        })
      );
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`)
      .pipe(
        catchError(error => {
          this.messagesSubject.next({
            status: 'error',
            message: `Erreur lors de la suppression de l'utilisateur : ${error.message}`
          });
          throw error; // Relancer l'erreur
        })
      );
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

   // Méthode pour indiquer que le scanning est en cours
   startScanning(): void {
    this.scanning = true;
  }

  // Méthode pour arrêter le scanning
  stopScanning(): void {
    this.scanning = false;
    if (this.sendInterval) {
      clearInterval(this.sendInterval); // Arrêter l'envoi en boucle
    }
  }

  sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.log('WebSocket non connecté');
    }
  }
}

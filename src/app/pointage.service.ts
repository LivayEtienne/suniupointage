import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';  // Importer HttpClient depuis Angular

@Injectable({
  providedIn: 'root'
})
export class PointageService {
  private socket$: WebSocketSubject<any>;

  constructor(private http: HttpClient) { 
    // Connexion au serveur WebSocket
    this.socket$ = new WebSocketSubject('ws://localhost:4001'); // Adresse du serveur WebSocket

    // Gestion de l'événement d'ouverture de la connexion
    this.socket$.subscribe({
      next: (message) => {
        console.log('Message reçu du serveur :', message);
      },
      error: (err) => {
        console.error('Erreur WebSocket:', err);
      },
      complete: () => {
        console.log('Connexion WebSocket fermée');
      }
    });
  }

  // Méthode pour envoyer un message au serveur WebSocket
  sendMessage(message: any): void {
    console.log('Message envoyé:', message);
    this.socket$.next(message);
  }

  // Méthode pour recevoir les messages du serveur WebSocket
  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  // Méthode pour fermer la connexion WebSocket
  closeConnection(): void {
    this.socket$.complete();
  }

    updateCheckStatus(userId: string, checkStatus: string): Observable<any> {
      const url = `http://localhost:3000/users/users/updateCheck/677c5f77aa9bc773bb028181`;  // L'URL avec l'ID de l'utilisateur
      const body = { check: checkStatus };  // Le corps de la requête avec la nouvelle valeur de "check"
    
      return this.http.put(url, body).pipe(
        tap((response: any) => {
          console.log('Réponse reçue du backend:', response);
        }),
        catchError(error => {
          console.error('Erreur lors de la mise à jour:', error);
          return throwError(error);  // Propager l'erreur
        })
      );
    }
}

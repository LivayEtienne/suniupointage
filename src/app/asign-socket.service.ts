import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AsignSocketService {
  private socket!: WebSocket;
  private reconnectInterval = 3001;
  private isConnecting = false;
  private messages$: Subject<any> = new Subject();

  private apiUrl = 'http://localhost:8000/api/users'; 

  constructor(private http: HttpClient) {}

  connect(): void {
    if (this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    this.socket = new WebSocket('ws://localhost:3000');

    this.socket.onopen = () => {
      console.log('WebSocket connecté.');
      this.isConnecting = false;
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messages$.next(message); // Diffuse le message reçu
    };

    this.socket.onclose = () => {
      console.log('WebSocket fermé. Tentative de reconnexion...');
      setTimeout(() => this.connect(), this.reconnectInterval);
    };
  }

  // Méthode pour mettre à jour l'UID
  updateUid(userId: number, newUid: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}/update-uid`; 
    return this.http.put(url, { uid: newUid }).pipe(
      catchError(error => {
        console.error('❌ Erreur lors de la mise à jour de l’UID:', error);
        throw error; // Propagation de l'erreur
      })
    );
  }

  // Getter pour l'Observable messages$
  get messages(): Observable<any> {
    return this.messages$.asObservable(); // Retourne l'Observable pour que l'abonnement soit possible
  }
}

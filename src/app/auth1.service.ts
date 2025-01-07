import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';  // Importer HttpClient depuis Angular
import { Observable } from 'rxjs';  // Importer Observable depuis rxjs
import { tap, catchError } from 'rxjs/operators';  // Importer les opérateurs 'tap' et 'catchError'
import { throwError } from 'rxjs';  // Importer 'throwError' pour gérer les erreurs



@Injectable({
  providedIn: 'root',
})
export class Auth1Service {
  private socket: WebSocket;
  private userInfoSubject: Subject<any> = new Subject<any>();  // Subject pour envoyer les infos utilisateur
  userInfo$ = this.userInfoSubject.asObservable(); // Observable pour s'abonner aux infos utilisateur
  private messageSubject: Subject<any> = new Subject<any>(); // Subject pour envoyer les messages
  private apiUrl = 'http://localhost:3000';  // Définir l'URL de l'API de votre backend

  constructor(private http: HttpClient) {  // Injection de HttpClient dans le service pour les requêtes HTTP) {
    // Connexion WebSocket au serveur
    this.socket = new WebSocket('ws://localhost:3000');  // Assurez-vous que le port correspond à celui de votre WebSocket
    

    // Écouter les messages reçus du serveur WebSocket
    this.socket.onmessage = (event) => {
      console.log('Message reçu du serveur:', event.data);
      try {
        const data = JSON.parse(event.data);
        
        if (data.nom && data.matricule && data.email && data.role) {
          // Si les données de l'utilisateur sont reçues, on les transmet à l'application via le Subject
          this.userInfoSubject.next(data);
        } else if (data.message) {
          console.error(data.message);  // Affiche l'erreur si l'utilisateur n'est pas trouvé
        }

        // Envoi des messages via le messageSubject
        if (data.message) {
          this.messageSubject.next(data);
        }
      } catch (error) {
        console.error('Erreur lors de la réception des données du serveur:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };

    this.socket.onclose = () => {
      console.log('Connexion WebSocket fermée');
    };
  }

  // Méthode pour envoyer une demande au serveur WebSocket avec l'UID
  sendUid(uid: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(uid);  // Envoi de l'UID au serveur pour rechercher l'utilisateur
      console.log('UID envoyé au serveur:', uid);
    } else {
      console.error('La connexion WebSocket n\'est pas ouverte');
    }
  }

  // Méthode pour fermer la connexion WebSocket
  fermerConnexion(): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
      console.log('Connexion WebSocket fermée manuellement');
    }
  }

   // Méthode pour envoyer l'UID (ajoutée pour corriger l'erreur)
  envoyerMessage(uid: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(uid);  // Envoi de l'UID au serveur
      console.log('UID envoyé au serveur:', uid);
    } else {
      console.error('La connexion WebSocket n\'est pas ouverte');
    }
  }

  // Méthode pour obtenir les messages reçus via WebSocket
  obtenirMessages() {
    return this.messageSubject.asObservable(); // Renvoie l'Observable des messages reçus
  }

  closeSocket(): void {
    if (this.socket) {
      this.socket.close();
      console.log('WebSocket fermé manuellement.');
    }
  }

  updateCheckStatus(userId: string, checkStatus: string): Observable<any> {
    const url = `http://localhost:3000/users/updateCheck/${userId}`;  // L'URL avec l'ID de l'utilisateur
    const body = { check: checkStatus };  // Le corps de la requête avec la nouvelle valeur de "check"
  
    return this.http.put(url, body).pipe(
      tap(response => {
        console.log('Réponse reçue du backend:', response);
      }),
      catchError(error => {
        console.error('Erreur lors de la mise à jour:', error);
        return throwError(error);  // Propager l'erreur
      })
    );
  }
  
  
   // Méthode pour récupérer tous les utilisateurs
   getAllUsers(): Observable<any> {
    const url = `${this.apiUrl}/users/all`;  // URL pour récupérer les utilisateurs
    return this.http.get(url).pipe(
      tap(response => {
        console.log('Liste des utilisateurs reçue du backend:', response);
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        return throwError(error);  // Propager l'erreur
      })
    );
  }

  
  }



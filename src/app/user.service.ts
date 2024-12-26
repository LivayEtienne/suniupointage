import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/users'; // URL de base mise à jour

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les apprenants avec pagination
  getApprenants(page: number, pageSize: number): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  // Méthode pour ajouter un utilisateur
  addUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  // Méthode pour supprimer un utilisateur
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Méthode pour mettre à jour le statut de l'utilisateur
  updateStatus(id: number, updatedData: { id: number; statut: string; nom: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  // Méthode pour archiver un utilisateur
  archiveUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/archive`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }

  // Méthode pour désarchiver un utilisateur
  unarchiveUser(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/unarchive`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModifierUtilisateurService {

  private apiUrl = 'http://localhost:8000/api/users'; // URL de base mise à jour

  constructor(private http: HttpClient) {}
   // Méthode pour récupérer les utilisateurs avec pagination
    getApprenants(page: number, pageSize: number): Observable<any> {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('limit', pageSize.toString());  // Remplacer 'pageSize' par 'limit' pour correspondre à l'API Laravel
  
      return this.http.get<any>(this.apiUrl, { params });
    }



  updateUser(id: number, userData: any): Observable<any> {
    console.log('Updating user with data:', userData); // Vérifiez les données envoyées
    return this.http.put(`${this.apiUrl}/${id}`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  
}

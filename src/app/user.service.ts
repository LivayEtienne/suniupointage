import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/users'; // URL de base mise à jour

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les utilisateurs avec pagination
  getApprenants(page: number, pageSize: number): Observable<any> {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    return this.http.get<any>(this.apiUrl, { params });
  }

  // Méthode pour ajouter un utilisateur
  /* addUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  } */
    addUser(userData: FormData): Observable<any> {
      return this.http.post(this.apiUrl, userData);
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



  bulkDelete(ids: number[]) {
    return this.http.post('http://localhost:8000/api/users/bulk-delete', { ids });
}

deleteUsers(ids: number[]) {
  return this.http.post('http://localhost:8000/api/users/bulk-delete', { ids });
}

// Importer un fichier CSV
importApprenants(data: any): Observable<any> {
  return this.http.post('http://localhost:8000/api/users/import', data); // Modifiez l'endpoint selon votre API
}

/* 
updateUser(id: number, userData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, userData, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  });
} */

  updateUser(id: number, userData: any): Observable<any> {
    console.log('Updating user with data:', userData); // Vérifiez les données envoyées
    return this.http.put(`${this.apiUrl}/${id}`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  


  updateUID(id: number, newUid: string): Observable<any> {
    const url = `http://localhost:8000/api/users/${id}/update-uid`;  // URL avec le port 8000
    return this.http.put(url, { cardId: newUid }, {  // Utilisez `cardId` au lieu de `newUid` pour correspondre à votre API
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  
  

}

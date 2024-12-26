import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApprenantService {

  private apiUrl = 'http://localhost:8000/api/apprenants'; // Remplacez cette URL par celle de votre API
  

 

  constructor(private http: HttpClient) { }



  addApprenant(apprenant: any): Observable<any> {
    return this.http.post(this.apiUrl, apprenant);
  }

  // Récupérer tous les apprenants
  
  getApprenants(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  
  // Récupérer un apprenant par ID
  getApprenant(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouvel apprenant
  createApprenant(apprenant: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, apprenant);
  }

  // Mettre à jour un apprenant
  updateApprenant(id: number, apprenant: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, apprenant);
  }


   // Mettre à jour le statut de l'apprenant (bloquer ou activer)
   updateStatus(apprenantId: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${apprenantId}/status`, { status });
  }
  // Supprimer un apprenant
  deleteApprenant(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Ajoutez cette méthode à votre service existant
// Ajouter cette méthode dans votre ApprenantService
registerUser(user: any): Observable<any> {
  const userApiUrl = 'http://127.0.0.1:8000/api/apprenants'; // URL pour l'inscription des utilisateurs
  return this.http.post<any>(userApiUrl, user);
}

}

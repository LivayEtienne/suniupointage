import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApprenantService {

  private apiUrl = 'http://localhost:8000/api/apprenants'; 

  constructor(private http: HttpClient) { }

  addApprenant(apprenant: any): Observable<any> {
    return this.http.post(this.apiUrl, apprenant);
  }

  

  getApprenants(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
    
  }

  getApprenant(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createApprenant(apprenant: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, apprenant);
  }

  updateApprenant(id: number, apprenant: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, apprenant);
  }

  updateStatus(apprenantId: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${apprenantId}/status`, { status });
  }

  deleteApprenant(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

    // Importer un fichier CSV
    importApprenants(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiUrl}/import`, formData);
    }


  registerUser(user: any): Observable<any> {
    const userApiUrl = 'http://127.0.0.1:8000/api/users'; // URL pour l'inscription des utilisateurs
    return this.http.post<any>(userApiUrl, user);
  }
}

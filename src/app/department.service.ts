import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = 'http://127.0.0.1:8000/api/departments'; // URL de l'API Laravel

  constructor(private http: HttpClient) {}

  // Récupérer tous les départements
  getDepartments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Récupérer un département spécifique par ID
  getDepartment(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau département
  createDepartment(department: any): Observable<any> {
    return this.http.post(this.apiUrl, department);
  }

  // Mettre à jour un département existant
  updateDepartment(id: number, department: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, department);
  }

  // Supprimer un département
  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  checkCohorteNameExists(nom: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-name-exists/${nom}`);
  }

  checkDepartmentNameExists(nom: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-name-exists/${nom}`);
  }
}

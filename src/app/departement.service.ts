import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://127.0.0.1:8000/api/departments'; // Lien vers votre API Laravel

  constructor(private http: HttpClient) {}

  // Récupérer tous les départements
  getDepartments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Ajouter un nouveau département
  addDepartment(department: any): Observable<any> {
    return this.http.post(this.apiUrl, department);
  }

  // Récupérer un département par ID
  getDepartmentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour un département
  updateDepartment(id: number, department: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, department);
  }

  // Supprimer un département
  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
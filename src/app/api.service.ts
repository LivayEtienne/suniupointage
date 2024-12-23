import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserStats {
  totalUsers: number;
  totalVigiles: number;
  totalDepartments: number;  // Ajout de la propriété totalDepartments
  totalCohortes: number;    // Ajout de la propriété totalCohortes
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api'; // URL complète

  constructor(private http: HttpClient) { }

  getUserStats(): Observable<UserStats> {
    return this.http.get<any>(`${this.apiUrl}/user-stats`);
  }

  getHistoriqueData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/historiques`); // Point d'API pour les historiques
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private apiUrl = 'http://localhost:8000/api/user-count';  // L'URL de la route que nous avons définie dans Laravel

  private departmentApiUrl = 'http://localhost:8000/api/department-count'; // L'URL de la route pour les départements

  private cohorteApiUrl = 'http://localhost:8000/api/cohorte-count'; // L'URL de la route pour les cohortes

  constructor(private http: HttpClient) {}

  getUserCount(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }


  getDepartmentCount(): Observable<any> {
    return this.http.get<any>(this.departmentApiUrl);
  }

  getCohorteCount(): Observable<any> {
    return this.http.get<any>(this.cohorteApiUrl);
  }
}



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cohorte {
  id?: number; // Optionnel, car l'ID n'est pas nécessaire lors de la création
  nom: string;
  code: string;
  date_de_creation: string;
  
}

@Injectable({
  providedIn: 'root',
})
export class CohorteService {
  private apiUrl = 'http://127.0.0.1:8000/api/cohortes'; // Modifiez l'URL si nécessaire

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les cohortes.
   */
  getCohortes(): Observable<Cohorte[]> {
    return this.http.get<Cohorte[]>(this.apiUrl);
  }
  getApprenantsByCohorte(cohorteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${cohorteId}/apprenants`);
  }

  getCohorteWithStudents(id: number): Observable<Cohorte> {
    return this.http.get<Cohorte>(`${this.apiUrl}/${id}`);
  }
  /**
   * Ajoute une nouvelle cohorte.
   * @param cohorte Les données de la cohorte à créer.
   */
  addCohorte(cohorte: Cohorte): Observable<Cohorte> {
    return this.http.post<Cohorte>(this.apiUrl, cohorte);
  }

  /**
   * Met à jour une cohorte existante.
   * @param id L'identifiant de la cohorte.
   * @param cohorte Les données à mettre à jour.
   */
  updateCohorte(id: number, cohorte: Partial<Cohorte>): Observable<Cohorte> {
    return this.http.put<Cohorte>(`${this.apiUrl}/${id}`, cohorte);
  }

  /**
   * Supprime une cohorte.
   * @param id L'identifiant de la cohorte.
   */
  deleteCohorte(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getApprenants(cohorteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${cohorteId}/apprenants`);
  }
}
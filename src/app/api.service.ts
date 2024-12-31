//api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserStats {
  totalUsers: number;
  totalVigiles: number;
  totalDepartments: number;  // Ajout de la propriété totalDepartments
  totalCohortes: number;    // Ajout de la propriété totalCohortes
}


export interface IHistorique {
  id: number;
  user_id: number;
  heure_entree: string;
  heure_sortie: string;
  activite: string;
  utilisateur: IUser; // Relation avec l'utilisateur
}

export interface IUser {
  id: number;
  nom: string;
  prenom: string;
  photo?: string;
  email: string;
  adresse: string;
  telephone: string;
  matricule: string;
  cardId: string;
  role: string;
  statut?: string;
  arrivee?: string;
  depart?: string;
  activite?: string; // Activité
  historiqueId: number
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


  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/users`);
  }

  updateActivity(id: number, activite: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/historiques/${id}/activite`, { activite });
}

getHistoriqueDataByDate(date: string): Observable<IHistorique[]> {
  const encodedDate = encodeURIComponent(date);
  return this.http.get<IHistorique[]>(`${this.apiUrl}/historiques?date=${encodedDate}`);
}


}

//api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient ,HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserStats {
  totalUsers: number;
  totalVigiles: number;
  totalDepartments: number;  // Ajout de la propriété totalDepartments
  totalCohortes: number;  // Ajout de la propriété totalCohortes
  totalemployer: number;  
  totalAdmins:number;
  totalEmployees:number
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
  photo?: string | File;
  email: string;
  adresse: string;
  telephone: string;
  fonction?: string,
  matricule: string;
  cardId: string;
  role: string;
  statut?: string;
  arrivee?: string;
  depart?: string;
  activite?: string; // Activité
  historiqueId: number
  isSelected?: boolean;  // Ajout de la propriété isSelected
  departement_id?: number| undefined;
   password?: string;
}

export interface IDepartment {
  id: number;
  nom: string;
  code?: string;
  date_de_creation?: string;
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


//partiemployer


addApprenant(apprenant: any): Observable<any> {
  return this.http.post(this.apiUrl, apprenant);
}





// Méthode pour enregistrer un utilisateur

registerUser(user: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/users`, user);  // Add /users endpoint
}



  // Ajouter un fichier CSV contenant des utilisateurs
  importUsersFromCSV(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/import-csv`, formData);
  }


// recupere tout les employer
getUsersByRole(roles: string[]): Observable<IUser[]> {
  const params = new HttpParams().set('role', roles.join(','));
  
  return this.http.get<IUser[]>(`${this.apiUrl}/users`, { params });
}


 // Méthode pour supprimer un utilisateur
 deleteUser(userId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/users/${userId}`);
}

 // Méthode pour mettre à jour le mot de passe et le rôle de l'utilisateur
 updateUserRoleAndPassword(userId: number, updatedUser: any): Observable<any> {

  
  return this.http.put(`${this.apiUrl}/users/${userId}`, updatedUser);
}



  // Nouvelle méthode pour supprimer plusieurs utilisateurs
  deleteUsers(userIds: number[]): Observable<any> {
    // Vous pouvez envoyer l'ID des utilisateurs dans le corps de la requête ou en tant que paramètre URL
    return this.http.request('DELETE', `${this.apiUrl}/users`, { 
      body: { ids: userIds } // Envoi des IDs dans le corps de la requête
    });
  }

  getDepartments(): Observable<IDepartment[]> {
    return this.http.get<IDepartment[]>(`${this.apiUrl}/departments`);
  }

  //mettre a jour un utilisateur 

  // Méthode de mise à jour d'un utilisateur
  updateUser(userId: number, userData: Partial<IUser>): Observable<IUser> {
    // Effectuer la requête PUT pour mettre à jour un utilisateur
    return this.http.put<IUser>(`${this.apiUrl}/users/${userId}`, userData);
  }

  //recuperer un utilisateur par son id

  // Méthode pour récupérer un utilisateur par son ID
  getUserById(userId: number): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/users/${userId}`);
  }


  //mettre a jour la photo
  updateUserWithPhoto(userId: number, userData: Partial<IUser>, photo: File): Observable<IUser> {
    const formData = new FormData();
    formData.append('nom', userData.nom || '');
    formData.append('prenom', userData.prenom || '');
    formData.append('email', userData.email || '');
    formData.append('adresse', userData.adresse || '');
    formData.append('role', userData.role || '');
    formData.append('telephone', userData.telephone || '');  // Ajout du téléphone
    formData.append('departement_id', userData.departement_id?.toString() || '');
    
    // Ajout de la photo uniquement si elle est sélectionnée
    if (photo) {
      formData.append('photo', photo);
    }
  
    return this.http.put<IUser>(`${this.apiUrl}/users/${userId}`, formData);
  }
  
  
  
}

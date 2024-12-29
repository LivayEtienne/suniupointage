import { Component, OnInit } from '@angular/core';
import { ApiService, IUser, IHistorique } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pointage',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pointage.component.html',
  styleUrls: ['./pointage.component.css'] // Correction du nom de propriété (styleUrl → styleUrls)
})
export class PointageComponent implements OnInit {
  historiques: IHistorique[] = [];
  users: IUser[] = [];
  stats = {
    totalUsers: 0,
    totalVigiles: 0,
    totalDepartments: 0
  };
  currentPage = 1;
  itemsPerPage = 8;
  today: Date = new Date();
  searchTerm: string = '';
  showDropdown: { [key: number]: boolean } = {}; // Gestion des dropdowns pour chaque historique
  activityOptions = ['Activiter', 'Conger', 'Malade', 'Voyage'];
  selectedDate: string = ''; // Stocke la date sélectionnée pour le filtrage
displayedDate: string = ''; // Date affichée dans l'interface
  filteredHistoriques: IHistorique[] = []; // Ajout pour stocker les historiques filtrés

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadHistoriques();
    this.loadStats();
  }

  /**
   * Charger tous les historiques
   */
  loadHistoriques(): void {
    this.apiService.getHistoriqueData().subscribe({
      next: (data: IHistorique[]) => {
        this.historiques = data;
        this.filteredHistoriques = data; // Initialiser les historiques filtrés
        this.updateUsersFromHistoriques(data);
        this.filterUsers(); // Appliquer le filtre si `searchTerm` est défini
      },
      error: (error) => {
        console.error('Erreur lors du chargement des historiques:', error);
      }
    });
  }
  

  /**
   * Met à jour la liste des utilisateurs à partir des historiques
   */
  updateUsersFromHistoriques(historiques: IHistorique[]): void {
    this.users = historiques.map((historique) => ({
      id: historique.utilisateur.id,
      nom: historique.utilisateur.nom,
      prenom: historique.utilisateur.prenom,
      telephone: historique.utilisateur.telephone,
      role: historique.utilisateur.role,
      email: historique.utilisateur.email,
      adresse: historique.utilisateur.adresse,
      matricule: historique.utilisateur.matricule,
      cardId: historique.utilisateur.cardId,
      statut: historique.utilisateur.statut,
      arrivee: historique.heure_entree,
      depart: historique.heure_sortie,
      activite: historique.activite,
      historiqueId: historique.id // Ajout de l'ID de l'historique
    }));
  }

  /**
   * Charger les statistiques
   */
  loadStats(): void {
    this.apiService.getUserStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });
  }

  /**
   * Pagination : Obtenir les utilisateurs pour la page actuelle
   */getPaginatedUsers(): IUser[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.users.slice(start, start + this.itemsPerPage);
}

  /**
   * Calculer le nombre total de pages
   */
  getTotalPages(): number {
    return Math.ceil(this.users.length / this.itemsPerPage);
  }

  /**
   * Afficher ou masquer le dropdown pour un historique spécifique
   */
  toggleDropdown(historiqueId: number): void {
    this.showDropdown[historiqueId] = !this.showDropdown[historiqueId];
  }

  /**
   * Mettre à jour l'activité pour un historique spécifique
   */
  updateStatus(historiqueId: number, status: string): void {
    this.apiService.updateActivity(historiqueId, status).subscribe({
      next: () => {
        // Mettre à jour l'historique correspondant
        const historique = this.historiques.find(h => h.id === historiqueId);
        if (historique) {
          historique.activite = status;
        }

        // Mettre à jour l'utilisateur correspondant
        const user = this.users.find(u => u.historiqueId === historiqueId);
        if (user) {
          user.activite = status;
        }

        console.log('Activité mise à jour avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de l\'activité:', error);
      }
    });

    // Fermer le dropdown
    this.showDropdown[historiqueId] = false;
  }

  /**
   * Filtrer les historiques par date
   */filterByDate(): void {
  if (this.selectedDate) {
    // Mettre à jour la date affichée avec un format lisible
    const date = new Date(this.selectedDate);
    this.displayedDate = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    // Filtrer les historiques par date
    this.apiService.getHistoriqueDataByDate(this.selectedDate).subscribe({
      next: (data: IHistorique[]) => {
        this.filteredHistoriques = data;
        this.updateUsersFromHistoriques(data);
      },
      error: (error) => {
        console.error('Erreur lors du filtrage des historiques:', error);
      }
    });
  } else {
    // Si aucune date n'est sélectionnée, réinitialiser la date affichée
    this.displayedDate = '';
    this.loadHistoriques(); // Recharger tous les historiques
  }
}



  filterUsers(): void {
    const term = this.searchTerm.toLowerCase(); // Normaliser le terme de recherche en minuscule
  
    if (term) {
      // Filtrer les utilisateurs par nom, prénom ou téléphone
      const filteredUsers = this.users.filter(user =>
        user.nom.toLowerCase().includes(term) ||
        user.prenom.toLowerCase().includes(term) ||
        user.telephone.toLowerCase().includes(term)
      );
  
      // Mettre à jour la liste des historiques filtrés en fonction des utilisateurs correspondants
      this.filteredHistoriques = this.historiques.filter(historique =>
        filteredUsers.some(user => user.id === historique.user_id)
      );
  
      // Mettre à jour les utilisateurs pour refléter le filtre
      this.users = filteredUsers;
    } else {
      // Réinitialiser si aucun terme n'est entré
      this.filteredHistoriques = this.historiques;
      this.updateUsersFromHistoriques(this.historiques);
    }
  }
  
}


import { SidebareComponent } from '../sidebare/sidebare.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ModifieremployerComponent} from '../modifieremployer/modifieremployer.component';
import { AjouteremployerComponent } from '../ajouteremployer/ajouteremployer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, IUser,IDepartment } from '../api.service';
import { RouterModule } from '@angular/router';

import Swal from 'sweetalert2';
import { Router } from 'express';
@Component({
  selector: 'app-employer',
  standalone: true,
  imports: [CommonModule,FormsModule,AjouteremployerComponent,ModifieremployerComponent, SidebareComponent, RouterModule],
  templateUrl: './employer.component.html',
  styleUrl: './employer.component.css'
})


export class EmployerComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  confirmationMessage: string | null = null; // Message de confirmation
  messageType: 'success' | 'error' = 'success'; // Type de message pour le style

  
  currentPage: number = 1; // Page actuelle
itemsPerPage: number = 10; // Nombre d'utilisateurs par page
paginatedUsers: IUser[] = []; // Liste des utilisateurs affichés
errorMessage = '';  
filteredUsers: IUser[] = []; // Liste des utilisateurs filtrés
searchQuery: string = '';
showModifierModal = false;
selectedUser: IUser | null = null;
  showAddUserModal = false;
  showMultipleDeleteModal = false;
  showPasswordModal = false; // Pour afficher le modal de mot de passe
  userIdToUpdatePassword: number | null = null; // ID de l'utilisateur dont le mot de passe sera mis à jour
  newPassword: string = ''; // Nouveau mot de passe
  departments: IDepartment[] = [];  // Liste des départements
  showDeleteModal = false; 
  userIdToDelete: number | null = null;  // ID de l'utilisateur à supprimer
  showModal = false; // Variable pour afficher ou masquer le modal
  newUser = {
    prenom: '',
    nom: '',
    email: '',
    adresse: '',
    telephone: '',
    fonction: '',
    departement: '',
  };

 users: IUser[] = [];
  stats = {
    totalUsers: 0,
    totalVigiles: 0,
    totalDepartments: 0,
    totalAdmins: 0
  };

  user = {  // Renommer newUser en user
    prenom: '',
    nom: '',
    email: '',
    adresse: '',
    telephone: '',
    fonction: '',
    departement: '',
  };


  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEmployes();
    this.loadStats();
    this.loadDepartments();
    
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


  loadEmployes(): void {
    this.apiService.getUsersByRole(['admin', 'vigile', 'employer']).subscribe({
      next: (data: IUser[]) => {
        // Séparer les utilisateurs en deux groupes : apprenants et autres
        this.users = data.filter(user => ['admin', 'vigile', 'employer'].includes(user.role));
       
        // Mettre à jour la liste paginée
        this.filteredUsers = this.users;
        this.updatePaginatedUsers();
        
        // Mettre à jour les statistiques
        this.updateStats(data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
      },
    });
  }

  updateStats(data: IUser[]): void {
    this.stats.totalUsers = data.length;
    this.stats.totalAdmins = data.filter(user => user.role === 'admin').length;
    this.stats.totalVigiles = data.filter(user => user.role === 'vigile').length;
    this.stats.totalVigiles = data.filter(user => user.role === 'employer').length;
    this.stats.totalDepartments = new Set(data.map(user => user.departement_id)).size;  // Nombre de départements distincts
  }
  // Charger les départements

  private departmentMap: { [key: number]: string } = {};

  loadDepartments(): void {
    this.apiService.getDepartments().subscribe({
      next: (departments: IDepartment[]) => {
        this.departments = departments;
  
        // Créer une map pour un accès rapide
        this.departmentMap = departments.reduce((map, dep) => {
          map[dep.id] = dep.nom;
          return map;
        }, {} as { [key: number]: string });
  
        console.log('Départements chargés:', this.departmentMap);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des départements';
        console.error(error);
      }
    });
  }
  
  // Fonction pour ouvrir le modal
  openModal() {
    this.showModal = true;
  }

  // Fonction pour fermer le modal
  closeModal() {
    this.showModal = false;
  }
  submitForm() {
    // Assurez-vous d'utiliser `this.newUser`, qui est lié au modèle du formulaire
    this.apiService.registerUser(this.newUser).subscribe(
      (response) => {
        console.log('Utilisateur enregistré avec succès', response);
        this.users.unshift(response); // Ajouter en haut de la liste
        this.stats.totalUsers++; // Mettre à jour les statistiques
        this.showAddUserModal = false; // Fermer le modal après succès
  
        // Vous pouvez ajouter ici une redirection ou un message de succès
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur', error);
        // Afficher un message d'erreur
      }
    );
  }
  
  


  //suppression
  loadUsers(): void {
    this.apiService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  // Fonction pour ouvrir le modal de confirmation de suppression
  confirmDelete(userId: number): void {
    this.userIdToDelete = userId;
    this.showDeleteModal = true;  // Afficher le modal de suppression
  }

  // Annuler la suppression
  cancelDelete(): void {
    this.showDeleteModal = false;  // Masquer le modal de suppression
    this.userIdToDelete = null;  // Réinitialiser l'ID
  }

  // Supprimer l'utilisateur
  deleteUser(): void {
    if (this.userIdToDelete !== null) {
      this.apiService.deleteUser(this.userIdToDelete).subscribe(
        (response) => {
          console.log('Utilisateur supprimé avec succès', response);
          this.afficherMessage('Utilisateur supprimer avec succès', 'success');
          this.loadEmployes();  // Recharger les utilisateurs
          this.cancelDelete();  // Fermer le modal après suppression
          this.loadStats();
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur', error);
        }
      );
    }
  }

  //parti changement de role 

  // Ouvre le modal pour mettre à jour le mot de passe
  openPasswordModal(userId: number): void {
    this.userIdToUpdatePassword = userId;
    this.showPasswordModal = true;
  }

  // Ferme le modal
  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.newPassword = ''; // Réinitialise le mot de passe
  }

  // Met à jour le mot de passe et le rôle de l'utilisateur
  updatePassword(): void {
    if (this.userIdToUpdatePassword && this.newPassword) {
      const updatedUser = {
        mot_de_passe: this.newPassword, // Nouveau mot de passe
        role: 'admin',             // Rôle mis à jour
      };
  
      // Appel au service pour mettre à jour le mot de passe et le rôle
      this.apiService.updateUserRoleAndPassword(this.userIdToUpdatePassword, updatedUser).subscribe(
        (response) => {
          console.log('Mot de passe et rôle mis à jour avec succès', response);
          this.afficherMessage('Role changer avec succès', 'success');
          this.loadEmployes(); // Recharger la liste des utilisateurs
          this.closePasswordModal(); // Fermer le modal
          
          this.loadUsers(); // Recharger la liste
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du mot de passe et du rôle', error);
        }
      );
    }
  }
  
  //suppression plusieur 


// Sélectionner/désélectionner tous les utilisateurs
selectAllUsers(event: any): void {
  const isChecked = event.target.checked;
  this.users.forEach(user => user.isSelected = isChecked);
}

// Vérifier si tous les utilisateurs sont sélectionnés
isAllSelected(): boolean {
  return this.users.every(user => user.isSelected);
}

// Obtenir la liste des utilisateurs sélectionnés
get selectedUsers(): IUser[] {
  return this.users.filter(user => user.isSelected);
}

// Fonction pour supprimer les utilisateurs sélectionnés
deleteSelectedUsers(): void {
  this.showMultipleDeleteConfirmation();  // Ouvrir le modal de confirmation avant de supprimer
}

 
  // Fonction pour afficher le modal de confirmation de suppression multiple
  confirmMultipleDelete(): void {
    const userIds = this.selectedUsers.map(user => user.id);

    if (userIds.length > 0) {
      this.apiService.deleteUsers(userIds).subscribe(
        () => {
          console.log(`${userIds.length} utilisateurs supprimés avec succès`);
          this.loadEmployes();  // Recharger les utilisateurs après la suppression
          this.cancelMultipleDelete();  // Fermer le modal après suppression
          this.afficherMessage('Utilisateur Supprimer avec succès', 'success');
          this.loadUsers(); // Recharger la liste
          
        },
        (error) => {
          console.error('Erreur lors de la suppression des utilisateurs', error);
        }
      );
    }
  }

  // Annuler la suppression multiple
  cancelMultipleDelete(): void {
    this.showMultipleDeleteModal = false;
  }

  // Fonction pour ouvrir le modal de confirmation de suppression multiple
  showMultipleDeleteConfirmation(): void {
    if (this.selectedUsers.length > 0) {
      this.showMultipleDeleteModal = true;
    } else {
      alert('Veuillez sélectionner au moins un utilisateur à supprimer.');
    }
  }


  //ajouter un utilisateur

// Pour ouvrir le modal ajouter utilsateur
openAddUserModal() {
  this.showAddUserModal = true;
}

// Pour gérer la fermeture du modal
onModalClose() {
  this.showAddUserModal = false;
  // Rafraîchir la liste des utilisateurs si nécessaire
  this.loadUsers();
  this.loadEmployes();
    this.loadStats();
}

//  fonction pour ouvririr modal pour modification
openModifierModal(user: IUser) {
  console.log('openModifierModal called with user:', user);
  this.selectedUser = user;
  this.showModifierModal = true;
  console.log('Modal state:', this.showModifierModal);
  console.log('Selected user:', this.selectedUser);
}

onUserUpdated(updatedUser: IUser) {
  const index = this.users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    this.users[index] = updatedUser; // Mettre à jour l'utilisateur dans la liste
  }
  this.loadEmployes();
}


//partie pagination
updatePaginatedUsers(): void {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
}

nextPage(): void {
  if (this.currentPage < this.totalPages()) {
    this.currentPage++;
    this.updatePaginatedUsers();
  }
}

previousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePaginatedUsers();
  }
}

totalPages(): number {
  return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
}

//fonction pour recherche
 // Fonction de recherche

searchUsers(): void {
  // Appliquer le filtrage sur la liste des utilisateurs
  this.filteredUsers = this.users.filter(user => {
    const fullName = `${user.nom} ${user.prenom}`.toLowerCase();
    const lowerCaseQuery = this.searchQuery.toLowerCase();
    // Obtenir le nom du département pour l'utilisateur actuel
    const departmentName = this.getDepartmentName(user.departement_id)?.toLowerCase() || '';

    return (
      fullName.includes(lowerCaseQuery) ||
      user.email.toLowerCase().includes(lowerCaseQuery) ||
      user.role.toLowerCase().includes(lowerCaseQuery) ||
      user.telephone.includes(lowerCaseQuery) ||
      departmentName.includes(lowerCaseQuery)  // Ajouter la recherche par département
    );
  });

  this.updatePaginatedUsers(); // Mettre à jour les utilisateurs paginés après le filtrage
}

//recuperer le nom du departement

  /**
   * Trouver le nom du département par ID
   */
  getDepartmentName(department_Id: number | undefined): string {
    if (!department_Id) return 'Non attribué';
    const department = this.departments.find((dep) => dep.id === department_Id);
    return department ? department.nom : 'Inconnu';
  }


  //ajouter d'un fichier au forma csv


  // Méthode appelée lorsque l'utilisateur sélectionne un fichier
 
  // Méthode appelée quand un fichier est sélectionné
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier si c'est un fichier CSV
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        this.importCSV(file);
      } else {
        Swal.fire('Erreur', 'Veuillez sélectionner un fichier CSV valide', 'error');
      }
    }
  }

  // Méthode pour importer le fichier CSV
  importCSV(file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    this.apiService.importUsersFromCSV(formData).subscribe({
      next: (response) => {
        Swal.fire('Succès', 'Les utilisateurs ont été importés avec succès.', 'success');
        this.loadUsers(); // Recharger la liste des utilisateurs après l'importation
        // Réinitialiser l'input file
        this.fileInput.nativeElement.value = '';
        this.loadEmployes();
         this.loadStats();
      },
      error: (error) => {
        console.error(error);
        Swal.fire('Erreur', "L'importation a échoué. Vérifiez le fichier et réessayez.", 'error');
        // Réinitialiser l'input file
        this.fileInput.nativeElement.value = '';
      }
    });
  }
  afficherMessage(message: string, type: 'success' | 'error' = 'success') {
    console.log(`Message: ${message}, Type: ${type}`);
    this.confirmationMessage = message;
    this.messageType = type;
  
    setTimeout(() => {
      this.confirmationMessage = null;
    }, 5000);
  }
  

  
}

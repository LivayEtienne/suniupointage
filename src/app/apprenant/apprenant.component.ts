import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { ButtonlectureComponent } from '../buttonlecture/buttonlecture.component';

interface Apprenant {
  id: number;
  nom: string;
  prenom: string;
  photo?: string;
  email: string;
  password?: string;
  adresse: string;
  telephone: string;
  matricule?: string;
  cardId?: string;
  role: string;
  statut: string;
}

@Component({ 
  selector: 'app-apprenant',
  imports: [FormsModule, CommonModule, ButtonlectureComponent] ,
  templateUrl: './apprenant.component.html',
  styleUrls: ['./apprenant.component.css']
})
export class ApprenantComponent implements OnInit {
  isUpdateUidModalOpen = false;
  matricule: string = '';  // Initialisation avec une valeur par défaut
  newUid: string = '';     // Initialisation avec une valeur par défaut

  // Déclaration de la variable pour l'affichage du placeholder
  isAffectationVisible: boolean = false;

  // Méthode qui bascule l'affichage du placeholder
  toggleAffectation() {
    this.isAffectationVisible = !this.isAffectationVisible;
  }
  // Variables liées au formulaire
  nom: string = '';
  prenom: string = '';
  email: string = '';
  adresse: string = '';
  telephone: string = '';
  password: string = '';
  role: string = 'apprenant';
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null; // Variable pour le message de succès
  apprenants: Apprenant[] = []; // Liste des apprenants
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchApprenants();
    this.matricule = '';
    this.newUid = '';
  }

  // Ouvrir le modal pour ajouter un utilisateur
  openModal(): void {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.clearForm();
  }

  // Fermer le modal
  closeModal(): void {
    this.isModalOpen = false;
    this.errorMessage = null;
    this.successMessage = null; // Réinitialiser le message de succès
  }

  // Ouvrir le modal en mode édition
  openEditModal(apprenant: Apprenant): void {
    this.isModalOpen = true;
    this.isEditMode = true;
    this.nom = apprenant.nom || '';
    this.prenom = apprenant.prenom || '';
    this.email = apprenant.email || '';
    this.adresse = apprenant.adresse || '';
    this.telephone = apprenant.telephone || '';
    this.password = '';  // Ne pas pré-remplir le mot de passe
    this.role = apprenant.role || 'apprenant';
  }

  // Réinitialiser le formulaire
  clearForm(): void {
    this.nom = '';
    this.prenom = '';
    this.email = '';
    this.adresse = '';
    this.telephone = '';
    this.password = '';
    this.errorMessage = null;
    this.successMessage = null; // Réinitialiser le message de succès
  }

  // Soumettre le formulaire
  onSubmit(): void {
    const userData = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      adresse: this.adresse,
      telephone: this.telephone,
      password: this.password,
      role: this.role
    };

    if (this.isEditMode) {
      // Logique d'édition de l'apprenant si nécessaire
      // Exemple : userService.updateUser(id, userData);
    } else {
      this.userService.addUser(userData).subscribe(
        (response) => {
          console.log('Utilisateur ajouté avec succès:', response);
          this.successMessage = 'Utilisateur ajouté avec succès.'; // Définir le message de succès  
          this.fetchApprenants(); // Recharger la liste des apprenants
          this.closeModal(); // Fermer le modal après l'ajout
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
          this.errorMessage = 'Une erreur est survenue lors de l\'ajout de l\'utilisateur.';
        }
      );
    }
  }

  // Charger la liste des apprenants
  fetchApprenants(): void {
    this.userService.getApprenants(this.currentPage, 10).subscribe(
      (data) => {
        this.apprenants = data; // Assigner la liste des apprenants récupérée depuis le backend
        this.totalPages = Math.ceil(this.apprenants.length / 10); // Exemple de calcul du nombre total de pages
      },
      (error) => {
        console.error('Erreur lors de la récupération des apprenants:', error);
      }
    );
  }

  // Gérer la pagination
  setPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchApprenants(); // Recharger les apprenants pour la page demandée
    }
  }

  // Supprimer un apprenant
  deleteApprenant(id: number): void {
    this.userService.deleteUser(id).subscribe(
      (response) => {
        console.log('Apprenant supprimé avec succès:', response);
        this.successMessage = 'Apprenant supprimer avec succès.'; // Définir le message de succès
        this.fetchApprenants(); // Recharger la liste après suppression
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'apprenant:', error);
      }
    );
  }

  // Méthode pour archiver un apprenant
  archiveApprenant(id: number): void {
    this.userService.archiveUser(id).subscribe(
      (response) => {
        console.log('Apprenant archivé avec succès:', response);
        this.successMessage = 'Apprenant archivé avec succès.'; // Définir le message de succès
        this.fetchApprenants(); // Recharger la liste après archivage
      },
      (error) => {
        console.error('Erreur lors de l\'archivage de l\'apprenant:', error);
        this.errorMessage = 'Une erreur est survenue lors de l\'archivage de l\'apprenant.';
      }
    );
  }

  // Méthode pour désarchiver un apprenant
  unarchiveApprenant(id: number): void {
    this.userService.unarchiveUser(id).subscribe(
      (response) => {
        console.log('Apprenant désarchivé avec succès:', response);
        this.successMessage = 'Apprenant désarchivé avec succès.'; // Définir le message de succès
        this.fetchApprenants(); // Recharger la liste après désarchivage
      },
      (error) => {
        console.error('Erreur lors du désarchivage de l\'apprenant:', error);
        this.errorMessage = 'Une erreur est survenue lors du désarchivage de l\'apprenant.';
      }
    );
  }

  // Méthode pour basculer le statut d'un apprenant
  toggleStatus(apprenant: Apprenant): void {
    const newStatus = apprenant.statut === 'active' ? 'archived' : 'active';

    // Créez un objet avec les données nécessaires, y compris le champ 'nom'
    const updatedData = {
      id: apprenant.id,
      nom: apprenant.nom,
      prenom: apprenant.prenom,
      photo: apprenant.photo,
      email: apprenant.email,
      password: apprenant.password,
      adresse: apprenant.adresse,
      telephone: apprenant.telephone,
      matricule: apprenant.matricule,
      cardId: apprenant.cardId,
      role: apprenant.role,
      statut: newStatus
    };

    this.userService.updateStatus(apprenant.id, updatedData).subscribe(
      () => {
        apprenant.statut = newStatus;
        console.log(`Le statut de l'apprenant a été mis à jour en ${newStatus}`);
        this.successMessage = `Le statut de l'apprenant a été mis à jour en ${newStatus}.`; // Définir le message de succès
      },
      (error: HttpErrorResponse) => {
        console.error("Erreur lors de la mise à jour du statut :", error);
        this.errorMessage = "Impossible de mettre à jour le statut. Veuillez réessayer.";
      }
    );
  }



  // Méthode pour ouvrir la modal de mise à jour de l'UID
  openUpdateUidModal(apprenant: any): void {
    this.matricule = apprenant.matricule; // Récupérer le matricule de l'apprenant
    this.newUid = ''; // Réinitialiser le nouveau UID
    this.isUpdateUidModalOpen = true;
  }

  // Méthode pour fermer la modal de mise à jour de l'UID
  closeUpdateUidModal(): void {
    this.isUpdateUidModalOpen = false;
  }

  // Méthode pour mettre à jour l'UID d'un utilisateur
  updateUserUID(matricule: string, newUid: string): void {
    if (!newUid) {
      this.errorMessage = 'Veuillez entrer un nouvel UID';
      return;
    }

    // Appel de la méthode updateUID du service
    this.userService.updateUID(matricule, newUid).subscribe(
      response => {
        console.log('UID mis à jour avec succès', response);
        this.successMessage = 'UID mis à jour avec succès'; // Message de succès
        this.closeUpdateUidModal(); // Fermer la modal après mise à jour
      },
      error => {
        console.error('Erreur lors de la mise à jour de l\'UID', error);
        this.errorMessage = 'Erreur lors de la mise à jour de l\'UID'; // Message d'erreur
      }
    );
  }
}
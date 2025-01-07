import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import Swal from 'sweetalert2';

import { ModifierApprenantComponent } from '../modifier-apprenant/modifier-apprenant.component';
import { ApiService, IUser,  } from '../api.service';
import { ModifieremployerComponent } from '../modifieremployer/modifieremployer.component';
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
  selected?: boolean;
  
}

@Component({ 
  selector: 'app-apprenant',
  imports: [FormsModule, CommonModule,ModifierApprenantComponent] ,
  templateUrl: './apprenant.component.html',
  styleUrls: ['./apprenant.component.css']
})


export class ApprenantComponent implements OnInit {
 

showModifierModal = false;
selectedUser: IUser | null = null;
  showAddUserModal = false;
  showMultipleDeleteModal = false;
  
  newUser = {
    prenom: '',
    nom: '',
    email: '',
    adresse: '',
    telephone: '',
    
    departement: '',
    role: '', // Ajoute un rôle par défaut, ou un rôle spécifique selon ton besoin
    matricule: '', // Ajouter cette propriété si nécessaire
    cardId: '', // Id de la carte si nécessaire
    historiqueId: '',
  };

 users: IUser[] = [];
  stats = {
    totalUsers: 0,
    totalVigiles: 0,
    totalDepartments: 0,
    totalAdmins: 0
  };
  //

  user: IUser = {
    id: 0,  // Ajout de l'id, vous pouvez le définir selon votre logique.
    prenom: '',
    nom: '',
    email: '',
    adresse: '',
    telephone: '',
    fonction: '',
    role: '',
    matricule: '',
    cardId: '',
    historiqueId: 0, // Assurez-vous d'inclure toutes les propriétés de IUser
  };

  isUpdateUidModalOpen = false;
  matricule: string = '';  // Initialisation avec une valeur par défaut
  newUid: string = '';     // Initialisation avec une valeur par défaut

  // Déclaration de la variable pour l'affichage du placeholder
  isAffectationVisible: boolean = false;
  selected?: boolean;
  selectAll: boolean = false;
  
  selectedApprenant: any = null;
  isModifierModalOpen = false;
  searchQuery: string = '';  // Variable liée à l'input de recherche
  currentPage: number = 1;
  totalPages: number = 1;

 /*  filteredApprenants: Apprenant[] = []; // Add this line
 */


  // Méthode qui bascule l'affichage du placeholder
  toggleAffectation() {
    this.isAffectationVisible = !this.isAffectationVisible;
  }
  // Variables liées au formulaire
  photo: File | null = null;
  selectedFile: File | null = null;
  nom: string = '';
  prenom: string = '';
  email: string = '';
  adresse: string = '';
  telephone: string = '';
  password: string = '';
  role: string = '';
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null; // Variable pour le message de succès
  apprenants: Apprenant[] = []; // Liste des apprenants
  

  confirmationMessage: string | null = null; // Message de confirmation
  messageType: 'success' | 'error' = 'success'; // Type de message pour le style

  
itemsPerPage: number = 10; // Nombre d'utilisateurs par page
paginatedUsers: IUser[] = []; // Liste des utilisateurs affichés

filteredUsers: IUser[] = []; // Liste des utilisateurs filtrés



  showPasswordModal = false; // Pour afficher le modal de mot de passe
  userIdToUpdatePassword: number | null = null; // ID de l'utilisateur dont le mot de passe sera mis à jour
  newPassword: string = ''; // Nouveau mot de passe

  showDeleteModal = false; 
  userIdToDelete: number | null = null;  // ID de l'utilisateur à supprimer
  showModal = false; // Variable pour afficher ou masquer le modal


  constructor( private userService: UserService, 
    private apiService: ApiService ) {
        // Par défaut, afficher tous les apprenants
    this.filteredApprenants = [...this.apprenants];

  }



 /**
 * Charger les statistiques
 */
  //////
  ngOnInit(): void {
    this.fetchApprenants();
    this.matricule = '';
    this.newUid = '';
    this.fetchApprenants();
  
  this.loadStats();
    
  }
  
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




  fetchApprenants(): void {
    this.userService.getAllUsers(this.currentPage, 10).subscribe({
      next: (response) => {
        console.log('Réponse brute de l\'API:', response);
        
        const allUsers = response.data || response;
        console.log('Tous les utilisateurs:', allUsers);
        
        this.apprenants = allUsers.filter((user: any) => {
          console.log('Rôle de l\'utilisateur:', user.role);
          return user.role === 'apprenant';
        });
        
        console.log('Apprenants filtrés:', this.apprenants);
        this.totalPages = Math.ceil(this.apprenants.length / 10);
      },
      error: (error) => {
        console.error('Erreur complète:', error);
        Swal.fire('Erreur', 'Une erreur est survenue lors de la récupération des apprenants.', 'error');
      }
    });
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



  //pour recuperer l'users par son id

  loadUserData(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      (response) => {
        // Remplir le formulaire avec les données de l'utilisateur récupéré
        const user = response;
        this.nom = user.nom;
        this.prenom = user.prenom;
        this.email = user.email;
        this.adresse = user.adresse;
        this.telephone = user.telephone;
        this.role = user.role;
        this.photo = user.photo; // URL de la photo si elle existe
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
      }
    );
  }
  
//modal modifier
openEditModal(apprenant: Apprenant): void {
  this.isModalOpen = true;
  this.isEditMode = true;

  if (apprenant.id) {
    this.loadUserData(apprenant.id); // Charge les données depuis l'API
  }
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
// Méthode pour gérer la sélection de fichier
onFileSelected1(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;  // Stocker le fichier sélectionné
  }
}


// Méthode pour soumettre le formulaire
onSubmit(): void {
  if (this.selectedFile) {  // Vérifie si un fichier a été sélectionné
    const formData = new FormData();
    formData.append('nom', this.nom);
    formData.append('prenom', this.prenom);
    formData.append('email', this.email);
    formData.append('adresse', this.adresse);
    formData.append('telephone', this.telephone);
    formData.append('role', this.role);

    // Ajouter le mot de passe uniquement si ce n'est pas un mode édition
    if (!this.isEditMode) {
      formData.append('password', this.password);
    }

    // Ajouter le fichier photo
    formData.append('photo', this.selectedFile, this.selectedFile.name);

    // Appel à la méthode d'enregistrement utilisateur
    this.userService.addUser(formData).subscribe({
      next: (response) => {
        console.log('Utilisateur ajouté avec succès !', response);
        this.closeModal();  // Fermer le modal ou autre action après succès
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de l\'utilisateur', err);
        this.errorMessage = 'Une erreur est survenue.';  // Afficher l'erreur à l'utilisateur
      }
    });
  } else {
    // Si aucun fichier n'est sélectionné
    this.errorMessage = 'Veuillez sélectionner une photo.';
  }
}
       


  // Charger la liste des apprenants
  /* fetchApprenants(): void {
    this.userService.getApprenants(this.currentPage, 10).subscribe(
      (data) => {
        this.apprenants = data; // Assigner la liste des apprenants récupérée depuis le backend
        this.totalPages = Math.ceil(this.apprenants.length / 10); // Exemple de calcul du nombre total de pages
      },
      (error) => {
        console.error('Erreur lors de la récupération des apprenants:', error);
        Swal.fire('error, une erreur s est pruduite lors de la récupération des apprenants')
      }
    );
  } */

    

  // Gérer la pagination
  setPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchApprenants(); // Recharger les apprenants pour la page demandée
    }
  }

  // Supprimer un apprenant
 

    deleteApprenant(id: number): void {
      // Afficher une alerte de confirmation avec SweetAlert
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Cette action est irréversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          // Si l'utilisateur confirme, procéder à la suppression
          this.userService.deleteUser(id).subscribe(
            (response) => {
              console.log('Apprenant supprimé avec succès:', response);
              this.successMessage = 'Apprenant supprimé avec succès.'; // Définir le message de succès
              this.fetchApprenants(); // Recharger la liste après suppression
              Swal.fire('Supprimé!', 'L\'apprenant a été supprimé.', 'success'); // Afficher une alerte de succès
            },
            (error) => {
              console.error('Erreur lors de la suppression de l\'apprenant:', error);
              Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression de l\'apprenant.', 'error'); // Afficher une alerte d'erreur
            }
          );
        } else {
          // Si l'utilisateur annule, afficher un message annulé
          Swal.fire('Annulé', 'L\'apprenant n\'a pas été supprimé.', 'info');
        }
      });
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

  // Sélectionner/désélectionner tous les apprenants
  toggleSelectAll(): void {
    this.apprenants.forEach(apprenant => apprenant.selected = this.selectAll);
  }

  bulkDelete(): void {
    const selectedIds = this.apprenants.filter(apprenant => apprenant.selected).map(apprenant => apprenant.id);
  
    if (selectedIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Aucun utilisateur sélectionné',
        text: 'Veuillez sélectionner au moins un utilisateur pour continuer.',
      });
      return;
    }
  
    // Boîte de confirmation avant suppression
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera les utilisateurs sélectionnés définitivement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        // Appel au service pour supprimer les utilisateurs
        this.userService.bulkDelete(selectedIds).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Les utilisateurs ont été supprimés avec succès.',
            });
            this.fetchApprenants(); // Recharger la liste après suppression
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression des utilisateurs.',
            });
          }
        );
      }
    });
  }
  


// Méthode appelée lorsque l'utilisateur sélectionne un fichier
onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (file) {
    this.importCSV(file);
  }
}

// Méthode pour importer le fichier CSV
importCSV(file: File): void {
  const formData = new FormData();
  formData.append('file', file);

  this.userService.importApprenants(formData).subscribe({
    next: (response) => {
      Swal.fire('Succès', 'Les apprenants ont été importés avec succès.', 'success');
      this.fetchApprenants();// Recharger la liste des apprenants
    },
    error: (error) => {
      console.error(error);
      Swal.fire('Erreur', "L'importation a échoué. Vérifiez le fichier et réessayez.", 'error');
    }
  });
}


  
onSearch(): void {
  if (this.searchQuery) {
    this.filteredApprenants = this.apprenants.filter(apprenant =>
      apprenant.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      apprenant.prenom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      apprenant.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  } else {
    this.filteredApprenants = this.apprenants;
    this.fetchApprenants()
  }
}

searchTerm: string = '';  // Variable pour stocker le terme de recherche
filteredApprenants = this.apprenants;  // Par défaut, affiche tous les apprenants

applyFilter() {
  if (this.searchTerm) {
    this.filteredApprenants = this.apprenants.filter(apprenant =>
      apprenant.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      apprenant.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      apprenant.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  } else {
    this.filteredApprenants = this.apprenants;
  }
}

//modal modifier


//  fonction pour ouvririr modal pour modification
openModifierModal(user: IUser) {
  console.log('openModifierModal called with user:', user);
  console.log('User ID:', user.id); // Vérifiez l'ID ici
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
 
}

}
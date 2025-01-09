import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import Swal from 'sweetalert2';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

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
  id_cohorte?: string;
  statut: string;
  selected?: boolean;
  
}

@Component({ 
  selector: 'app-apprenant',
  imports: [FormsModule, CommonModule, SidebarComponent, DashboardComponent] ,
  templateUrl: './apprenant.component.html',
  styleUrls: ['./apprenant.component.css']
})
export class ApprenantComponent implements OnInit {
  isUpdateUidModalOpen = false;
  matricule: string = '';  // Initialisation avec une valeur par défaut
  newUid: string = '';     // Initialisation avec une valeur par défaut
  apprenant: any;
  // Déclaration de la variable pour l'affichage du placeholder
  isAffectationVisible: boolean = false;
  selected?: boolean;
  selectAll: boolean = false;
  

  sortByCohorte: boolean = true;

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
  id_cohorte: string = '';
  role: string = 'apprenant';
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null; // Variable pour le message de succès
  apprenants: Apprenant[] = []; // Liste des apprenants
  

  constructor(private userService: UserService) {
        // Par défaut, afficher tous les apprenants
    this.filteredApprenants = [...this.apprenants];

  }

  ngOnInit(): void {
    this.fetchApprenants();
    this.matricule = '';
    this.newUid = '';
    this.fetchApprenants();
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
    this.id_cohorte = apprenant.id_cohorte || '';
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
    this.id_cohorte = '';
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
  const userData: any = {
    nom: this.nom,
    prenom: this.prenom,
    email: this.email,
    adresse: this.adresse,
    telephone: this.telephone,
    password: this.password,
    id_cohorte: this.id_cohorte,
    role: this.role,
  };

  // Ajouter la photo si elle est sélectionnée
  if (this.photo) {
    userData.photo = this.photo;
  }

  if (this.isEditMode) {
    const apprenantId = this.apprenants.find(apprenant => apprenant.email === this.email)?.id;

    if (apprenantId) {
      this.userService.updateUser(apprenantId, userData).subscribe(
        (response) => {
          
          console.log('Utilisateur mis à jour avec succès:', response);
          this.successMessage = 'Utilisateur mis à jour avec succès.';
          this.fetchApprenants();
          this.closeModal();
          Swal.fire('Succès', 'L\'utilisateur a été mis à jour avec succès.', 'success');
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
          this.errorMessage = 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.';
          Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.', 'error');
        }
      );
    }
  } else {
    this.userService.addUser(userData).subscribe(
      (response) => {
        console.log('Utilisateur ajouté avec succès:', response);
        this.successMessage = 'Utilisateur ajouté avec succès.';
        this.fetchApprenants();
        this.closeModal();
        Swal.fire('Succès', 'L\'utilisateur a été ajouté avec succès.', 'success');
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
        this.errorMessage = 'Une erreur est survenue lors de l\'ajout de l\'utilisateur.';
        Swal.fire('Erreur', 'Une erreur est survenue lors de l\'ajout de l\'utilisateur.', 'error');
      }
    );
  }
}

       


 

    fetchApprenants(): void {
      this.userService.getApprenants(this.currentPage, 10).subscribe(
        (data) => {
          console.log('Données récupérées:', data);  // Vérifiez si les données sont bien récupérées
          this.apprenants = data;
          this.totalPages = Math.ceil(this.apprenants.length / 10);
          this.sortApprenantsByCohorte();
        },
        (error) => {
          console.error('Erreur lors de la récupération des apprenants:', error);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la récupération des apprenants.', 'error');
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
      id_cohorte: apprenant.id_cohorte,
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



 

  // Méthode pour fermer la modal de mise à jour de l'UID
  closeUpdateUidModal(): void {
    this.isUpdateUidModalOpen = false;
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



openUpdateUidModal(apprenant: any) {
  this.matricule = apprenant.nom ; // Récupérer le matricule de l'apprenant
  this.matricule = apprenant.prenom ; // Récupérer le matric
  
    this.newUid = ''; // Réinitialiser le nouveau UID
    this.isUpdateUidModalOpen = true;
  // Vérifier si l'apprenant est bien passé
  console.log("Ouvrir modal pour l'apprenant:", apprenant);

  // Si apprenant est bien défini, on l'assigne à this.apprenant
  if (apprenant) {
    this.apprenant = apprenant;
    this.newUid = ''; // Réinitialiser l'UID
    this.isUpdateUidModalOpen = true; // Ouvrir le modal
  } else {
    console.log("L'apprenant n'est pas défini.");
  }
}




  updateUid() {
    console.log("Matricule:", this.matricule, "New UID:", this.newUid);
  
    // Vérifiez si l'UID et l'apprenant sont définis
    if (this.newUid && this.apprenant) {
      // Appeler le service pour mettre à jour l'UID
      this.userService.updateUID(this.apprenant.id, this.newUid).subscribe(
        (response) => {
          console.log("Réponse du serveur:", response);
          
          // Afficher une alerte de succès avec SweetAlert
          Swal.fire({
            title: 'Succès!',
            text: 'L\'UID a été mis à jour avec succès.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
  
          this.closeUpdateUidModal();  // Fermer le modal
          this.newUid = '';  // Réinitialiser le champ UID
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'UID', error);
          
          // Afficher une alerte d'erreur avec SweetAlert
          Swal.fire({
            title: 'Erreur!',
            text: 'Une erreur est survenue lors de la mise à jour de l\'UID.',
            icon: 'error',
            confirmButtonText: 'Réessayer'
          });
        }
      );
    } else {
      console.log("Les données sont manquantes : newUid:", this.newUid, "apprenant:", this.apprenant);
  
      // Afficher une alerte pour les données manquantes avec SweetAlert
      Swal.fire({
        title: 'Erreur!',
        text: 'Les données nécessaires sont manquantes. Veuillez vérifier.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }
  




  sortApprenantsByCohorte(): void {
    if (this.sortByCohorte) {
      // Tri ascendant par cohorte, en s'assurant que les propriétés ne sont pas undefined
      this.apprenants.sort((a: Apprenant, b: Apprenant) => {
        const aCohorte = a.id_cohorte ?? ''; // Utilise une chaîne vide si id_cohorte est undefined
        const bCohorte = b.id_cohorte ?? ''; // Utilise une chaîne vide si id_cohorte est undefined
  
        if (aCohorte < bCohorte) {
          return -1;
        }
        if (aCohorte > bCohorte) {
          return 1;
        }
        return 0;
      });
    } else {
      // Tri descendant par cohorte, en s'assurant que les propriétés ne sont pas undefined
      this.apprenants.sort((a: Apprenant, b: Apprenant) => {
        const aCohorte = a.id_cohorte ?? ''; // Utilise une chaîne vide si id_cohorte est undefined
        const bCohorte = b.id_cohorte ?? ''; // Utilise une chaîne vide si id_cohorte est undefined
  
        if (aCohorte < bCohorte) {
          return 1;
        }
        if (aCohorte > bCohorte) {
          return -1;
        }
        return 0;
      });
    }
  }
  
  
  toggleSortOrder(): void {
    this.sortByCohorte = !this.sortByCohorte;  // Bascule l'ordre du tri
    this.sortApprenantsByCohorte();  // Applique le tri
  }
  
 
  
  
}
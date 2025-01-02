import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../apprenant.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { SidebareComponent } from '../sidebare/sidebare.component';

@Component({
  selector: 'app-apprenant',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebareComponent],
  templateUrl: './apprenant.component.html',
  styleUrls: ['./apprenant.component.css'],
})
export class ApprenantComponent implements OnInit {
  apprenants: any[] = [];
  selectedApprenant: any = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: 'apprenant',
    adresse: '',
    telephone: '',
    fonction: '',
    id_cohorte: ''
  };

  isEditMode: boolean = false; // Mode édition ou ajout
  isModalOpen: boolean = false; // Contrôle la visibilité du modal
  errorMessage: string = ''; // Message d'erreur pour le formulaire
  sortOrder: string = 'asc'; // Ordre de tri initial (ascendant)
  selectedCohorte: string = ''; // Cohorte sélectionnée
  cohortes: string[] = []; // Liste des cohortes uniques

  filteredApprenants: any[] = []; // Liste filtrée des apprenants (par cohorte)

  searchQuery: string = ''; // Valeur du champ de recherche


  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  constructor(private apprenantService: ApprenantService) {}

  ngOnInit(): void {
    this.loadApprenants();
  }

  // Charger la liste des apprenants depuis le service
  loadApprenants(): void {
    this.apprenantService.getApprenants().subscribe({
      next: (data: any[]) => {
        this.apprenants = data;
        this.totalItems = this.apprenants.length;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des apprenants:', error);
      },
    });
  }

  // Obtenir la liste paginée des apprenants
  get paginatedApprenants() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.apprenants.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Calculer le nombre total de pages
  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Changer de page
  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // Ouvrir le modal
  openModal(): void {
    this.isModalOpen = true;
  }

  // Fermer le modal
  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
    
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.selectedApprenant = {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      role: 'apprenant',
      adresse: '',
      telephone: '',
      fonction: '',
      id_cohorte: ''
    };
    this.errorMessage = '';
    this.isEditMode = false;
  }

  // Soumettre le formulaire (ajout ou mise à jour)
  onSubmit(): void {
    const apprenantData = { ...this.selectedApprenant };

    if (this.isEditMode && this.selectedApprenant.id) {
      this.apprenantService.updateApprenant(this.selectedApprenant.id, apprenantData).subscribe({
        next: () => {
          alert('Apprenant mis à jour avec succès');
          this.loadApprenants();
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Erreur lors de la mise à jour:', error);
          alert('Erreur lors de la mise à jour');
        },
      });
    } else {
      this.apprenantService.registerUser(apprenantData).subscribe({
        next: (response: any) => {
          const apprenantCreationData = {
            id_user: response.id,
            id_cohorte: this.selectedApprenant.id_cohorte,
            fonction: this.selectedApprenant.fonction,
          };

          this.apprenantService.addApprenant(apprenantCreationData).subscribe({
            next: () => {
              this.loadApprenants();
              this.closeModal();
              alert('Apprenant inscrit avec succès');
            },
            error: (error: any) => {
              console.error("Erreur lors de l'ajout de l'apprenant:", error);
              alert("Erreur lors de l'ajout de l'apprenant");
            },
          });
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'inscription:', error.error); // Ajouter error.error
          alert('Erreur lors de l\'inscription : ' + JSON.stringify(error.error));
        }
        ,
      });
    }
  }

  // Ouvrir le modal en mode édition
  openEditModal(apprenant: any): void {
    this.isEditMode = true;
    this.selectedApprenant = { ...apprenant };
    this.openModal();
  }
  // Ouvrir le modal en mode édition
onEditClick(apprenant: any): void {
  this.openEditModal(apprenant);
}


  // Supprimer un apprenant
  onDeleteClick(apprenant: any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet apprenant ?')) {
      this.apprenantService.deleteApprenant(apprenant.id).subscribe({
        next: () => {
          alert('Apprenant supprimé avec succès');
          this.loadApprenants();
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression');
        },
      });
    }
  }

  // Sélectionner tous les apprenants
  selectAll(event: any): void {
    const checked = event.target.checked;
    this.apprenants.forEach(apprenant => apprenant.selected = checked);
  }

  // Supprimer les apprenants sélectionnés
  deleteSelected(): void {
    const selectedApprenants = this.apprenants.filter(apprenant => apprenant.selected);

    if (selectedApprenants.length === 0) {
      alert('Aucun apprenant sélectionné pour suppression.');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer les apprenants sélectionnés ?')) {
      selectedApprenants.forEach(apprenant => {
        this.apprenantService.deleteApprenant(apprenant.id).subscribe({
          next: () => {
            this.apprenants = this.apprenants.filter(a => a.id !== apprenant.id);
          },
          error: (error: any) => {
            console.error('Erreur lors de la suppression:', error);
            alert('Erreur lors de la suppression d\'un apprenant');
          }
        });
      });
    }
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
  
      this.apprenantService.importApprenants(formData).subscribe({
        next: (response) => {
          Swal.fire('Succès', 'Les apprenants ont été importés avec succès.', 'success');
          this.loadApprenants();// Recharger la liste des apprenants
        },
        error: (error) => {
          console.error(error);
          Swal.fire('Erreur', "L'importation a échoué. Vérifiez le fichier et réessayez.", 'error');
        }
      });
    }


   /*    // Méthode pour trier les apprenants par cohorte
  sortByCohorte(): void {
    const direction = this.sortOrder === 'asc' ? 1 : -1;
    this.apprenants.sort((a, b) => {
      const cohortA = a.cohorte?.nom || ''; // Nom de la cohorte de l'apprenant A
      const cohortB = b.cohorte?.nom || ''; // Nom de la cohorte de l'apprenant B

      if (cohortA < cohortB) {
        return -1 * direction;
      }
      if (cohortA > cohortB) {
        return 1 * direction;
      }
      return 0;
    });

    // Inverser l'ordre de tri pour le prochain appel
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  } */

      // Méthode pour trier les apprenants par cohorte
  sortByCohorte(): void {
    const direction = this.sortOrder === 'asc' ? 1 : -1;
    this.apprenants.sort((a, b) => {
      const cohortA = a.cohorte?.nom || ''; // Nom de la cohorte de l'apprenant A
      const cohortB = b.cohorte?.nom || ''; // Nom de la cohorte de l'apprenant B

      if (cohortA < cohortB) {
        return -1 * direction;
      }
      if (cohortA > cohortB) {
        return 1 * direction;
      }
      return 0;
    });

    // Inverser l'ordre de tri pour le prochain appel
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  // Méthode pour filtrer les apprenants par cohorte
  filterByCohorte(cohorteName: string): void {
    this.selectedCohorte = cohorteName; // Sélectionner la cohorte
    if (cohorteName) {
      // Filtrer les apprenants selon la cohorte sélectionnée
      this.filteredApprenants = this.apprenants.filter(apprenant =>
        apprenant.cohorte?.nom === cohorteName
      );
    } else {
      // Si aucune cohorte n'est sélectionnée, afficher tous les apprenants
      this.filteredApprenants = [...this.apprenants];
    }
  }


  //pour la recherche
  onSearch(): void {
    console.log('Recherche en cours...'); 
    const query = this.searchQuery.toLowerCase(); // Mettre la requête en minuscule pour être insensible à la casse
    this.filteredApprenants = this.apprenants.filter(apprenant => {
      const nom = apprenant.user?.nom.toLowerCase();
      const prenom = apprenant.user?.prenom.toLowerCase();
      const email = apprenant.user?.email.toLowerCase();
      
      return nom.includes(query) || prenom.includes(query) || email.includes(query);
    });
  }
}


    
  


